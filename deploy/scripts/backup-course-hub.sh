#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  printf 'Run with sudo: sudo bash %s\n' "$0" >&2
  exit 1
fi

database="${COURSE_HUB_DATABASE:-/var/lib/course-hub/course-hub.sqlite3}"
backup_dir="${COURSE_HUB_BACKUP_DIR:-/var/backups/course-hub}"
if [[ ! -f "${database}" ]]; then
  printf 'Database not found: %s\n' "${database}" >&2
  exit 1
fi

install -d -o root -g root -m 0700 "${backup_dir}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="${backup_dir}/course-hub-${timestamp}-$$.sqlite3"
temporary="${target}.tmp"
trap 'rm -f -- "${temporary}"' EXIT

python3 - "${database}" "${temporary}" <<'PY'
import sqlite3
import sys

source = sqlite3.connect(f"file:{sys.argv[1]}?mode=ro", uri=True)
destination = sqlite3.connect(sys.argv[2])
with destination:
    source.backup(destination)
    destination.execute("DELETE FROM sessions")
    result = destination.execute("PRAGMA integrity_check").fetchone()[0]
if result != "ok":
    raise SystemExit(f"backup integrity check failed: {result}")
source.close()
destination.close()
PY

chmod 0600 "${temporary}"
mv -f "${temporary}" "${target}"
(
  cd "${backup_dir}"
  sha256sum "$(basename "${target}")" >"$(basename "${target}").sha256"
  chmod 0600 "$(basename "${target}").sha256"
)
printf '%s\n' "${target}"
