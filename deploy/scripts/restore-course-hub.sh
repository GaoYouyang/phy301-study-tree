#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  printf 'Usage: sudo bash %s --backup FILE [--apply]\n' "$0"
}

if [[ "${EUID}" -ne 0 ]]; then
  printf 'Run this restore with sudo.\n' >&2
  exit 1
fi

backup=""
apply="0"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --backup) backup="${2:-}"; shift 2 ;;
    --apply) apply="1"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ -z "${backup}" || ! -f "${backup}" ]]; then
  printf 'Choose an existing --backup FILE.\n' >&2
  exit 2
fi
backup="$(cd -- "$(dirname -- "${backup}")" && pwd -P)/$(basename -- "${backup}")"

if [[ -f "${backup}.sha256" ]]; then
  (cd "$(dirname -- "${backup}")" && sha256sum -c "$(basename -- "${backup}").sha256")
fi
python3 - "${backup}" <<'PY'
import sqlite3
import sys

required = {"courses", "progress", "notes", "questions", "recent_positions", "sessions"}
with sqlite3.connect(f"file:{sys.argv[1]}?mode=ro", uri=True) as db:
    result = db.execute("PRAGMA integrity_check").fetchone()[0]
    tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
if result != "ok":
    raise SystemExit(f"integrity check failed: {result}")
missing = required - tables
if missing:
    raise SystemExit(f"backup is missing tables: {sorted(missing)}")
PY

printf 'Validated backup: %s\n' "${backup}"
if [[ "${apply}" != "1" ]]; then
  printf 'Preview only. Add --apply to replace the live database.\n'
  exit 0
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
database="/var/lib/course-hub/course-hub.sqlite3"
safety_backup="$(bash "${script_dir}/backup-course-hub.sh")"
restore_temp="${database}.restore.$$"
trap 'rm -f -- "${restore_temp}"' EXIT
restore_in_progress=0
rollback_restore() {
  exit_code=$?
  trap - ERR
  if [[ "${restore_in_progress}" == "1" ]]; then
    systemctl stop course-hub-api.service || true
    install -o coursehub -g coursehub -m 0600 "${safety_backup}" "${database}"
    rm -f -- "${database}-wal" "${database}-shm"
    systemctl start course-hub-api.service || true
    printf 'Restore interrupted; pre-restore safety backup was reinstated.\n' >&2
  fi
  exit "${exit_code}"
}
trap rollback_restore ERR

systemctl stop course-hub-api.service
restore_in_progress=1
install -o coursehub -g coursehub -m 0600 "${backup}" "${restore_temp}"
mv -f "${restore_temp}" "${database}"
rm -f -- "${database}-wal" "${database}-shm"

if ! systemctl start course-hub-api.service || \
   ! curl --fail --silent --show-error --max-time 10 --retry 3 \
      --retry-connrefused http://127.0.0.1:8787/api/v1/health >/dev/null; then
  systemctl stop course-hub-api.service || true
  install -o coursehub -g coursehub -m 0600 "${safety_backup}" "${database}"
  rm -f -- "${database}-wal" "${database}-shm"
  systemctl start course-hub-api.service
  printf 'Restore failed; pre-restore safety backup was reinstated.\n' >&2
  exit 1
fi
restore_in_progress=0

printf 'Restore complete. Pre-restore safety copy: %s\n' "${safety_backup}"
