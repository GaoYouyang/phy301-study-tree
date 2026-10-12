#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  printf 'Run with sudo: sudo bash %s\n' "$0" >&2
  exit 1
fi

token_path="/etc/course-hub/api-token"
database="/var/lib/course-hub/course-hub.sqlite3"
if [[ ! -f "${token_path}" ]]; then
  printf 'Token file not found: %s\n' "${token_path}" >&2
  exit 1
fi

old_token="$(mktemp /etc/course-hub/.api-token-old.XXXXXX)"
new_token="$(mktemp /etc/course-hub/.api-token-new.XXXXXX)"
trap 'rm -f -- "${old_token}" "${new_token}"' EXIT
rotation_in_progress=0
rollback_rotation() {
  exit_code=$?
  trap - ERR
  if [[ "${rotation_in_progress}" == "1" ]]; then
    systemctl stop course-hub-api.service || true
    install -o root -g root -m 0600 "${old_token}" "${token_path}"
    systemctl start course-hub-api.service || true
    printf 'Rotation interrupted; previous token restored. Existing sessions may require a new login.\n' >&2
  fi
  exit "${exit_code}"
}
trap rollback_rotation ERR
chmod 0600 "${old_token}" "${new_token}"
cp "${token_path}" "${old_token}"
python3 -c 'import secrets; print(secrets.token_urlsafe(48))' >"${new_token}"
chown root:root "${new_token}"
chmod 0600 "${new_token}"

systemctl stop course-hub-api.service
rotation_in_progress=1
mv -f "${new_token}" "${token_path}"
if [[ -f "${database}" ]]; then
  python3 - "${database}" <<'PY'
import sqlite3
import sys
with sqlite3.connect(sys.argv[1]) as db:
    db.execute("DELETE FROM sessions")
PY
fi

if ! systemctl start course-hub-api.service || \
   ! curl --fail --silent --show-error --max-time 10 --retry 3 \
      --retry-connrefused http://127.0.0.1:8787/api/v1/health >/dev/null; then
  systemctl stop course-hub-api.service || true
  install -o root -g root -m 0600 "${old_token}" "${token_path}"
  systemctl start course-hub-api.service
  printf 'Rotation failed; previous token restored. Existing sessions were revoked.\n' >&2
  exit 1
fi
rotation_in_progress=0

printf '%s\n' 'Root token rotated and all browser sessions revoked.'
printf '%s\n' 'Retrieve the new token only when needed:'
printf '%s\n' '  sudo cat /etc/course-hub/api-token'
