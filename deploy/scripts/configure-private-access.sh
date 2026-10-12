#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  printf 'Run with sudo: sudo bash %s\n' "$0" >&2
  exit 1
fi

if [[ "$#" -ne 0 ]]; then
  printf 'This password-only gate does not use a username.\n' >&2
  exit 2
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends python3

umask 077
install -d -o root -g root -m 0700 /etc/course-hub
credential_file=/etc/course-hub/site-password
database=/var/lib/course-hub/course-hub.sqlite3
service=course-hub-api.service
credential_temp=""
credential_backup=""
password=""
confirmation=""
had_credential=0
service_was_active=0
transaction_started=0

cleanup() {
  password=""
  confirmation=""
  if [[ -n "${credential_temp}" ]]; then
    rm -f -- "${credential_temp}"
  fi
  if [[ -n "${credential_backup}" ]]; then
    rm -f -- "${credential_backup}"
  fi
}
trap cleanup EXIT

rollback_transaction() {
  local exit_status="${1:-1}"
  local failure_line="${2:-unknown}"
  local reason="${3:-Private access setup failed.}"
  local restore_failed=0

  trap - ERR INT TERM HUP
  set +e

  # Ensure no process can keep using the replacement credential while the
  # previous on-disk state is restored.
  if [[ "${service_was_active}" == "1" ]] || \
     systemctl is-active --quiet "${service}" >/dev/null 2>&1; then
    systemctl stop "${service}" >/dev/null 2>&1 || restore_failed=1
  fi

  if [[ "${had_credential}" == "1" && -n "${credential_backup}" ]]; then
    install -o root -g root -m 0600 "${credential_backup}" "${credential_file}" || \
      restore_failed=1
  elif [[ "${had_credential}" == "0" ]]; then
    rm -f -- "${credential_file}" || restore_failed=1
  else
    restore_failed=1
  fi

  if [[ "${service_was_active}" == "1" ]]; then
    systemctl start "${service}" || restore_failed=1
  fi

  transaction_started=0
  printf '%s Previous password hash and service state were restored when available; existing sessions may remain revoked.\n' \
    "${reason}" >&2
  if [[ "${restore_failed}" != "0" ]]; then
    printf 'Automatic rollback was incomplete; inspect %s and %s before retrying.\n' \
      "${credential_file}" "${service}" >&2
  fi
  printf 'Failure occurred at line %s.\n' "${failure_line}" >&2
  exit "${exit_status}"
}

handle_error() {
  local exit_status="$1"
  local failure_line="$2"

  if [[ "${transaction_started}" == "1" ]]; then
    rollback_transaction "${exit_status}" "${failure_line}"
  fi
  printf 'Private-access setup failed at line %s.\n' "${failure_line}" >&2
  exit "${exit_status}"
}

handle_signal() {
  local signal_name="$1"
  local exit_status="$2"
  local failure_line="$3"

  if [[ "${transaction_started}" == "1" ]]; then
    rollback_transaction "${exit_status}" "${failure_line}" \
      "Password rotation was interrupted by ${signal_name}."
  fi
  printf 'Private-access setup interrupted by %s.\n' "${signal_name}" >&2
  exit "${exit_status}"
}

trap 'failure_status=$?; failure_line=$LINENO; handle_error "${failure_status}" "${failure_line}"' ERR
trap 'handle_signal INT 130 "${LINENO}"' INT
trap 'handle_signal TERM 143 "${LINENO}"' TERM
trap 'handle_signal HUP 129 "${LINENO}"' HUP

printf 'Set the private-site password (at least 12 characters). Input is hidden: '
IFS= read -r -s password
printf '\nRepeat the password: '
IFS= read -r -s confirmation
printf '\n'

if [[ "${password}" != "${confirmation}" ]]; then
  printf 'Passwords do not match.\n' >&2
  exit 2
fi
if (( ${#password} < 12 )); then
  printf 'Password must contain at least 12 characters.\n' >&2
  exit 2
fi

credential_temp="$(mktemp /etc/course-hub/.site-password.XXXXXX)"
printf '%s' "${password}" | python3 -c '
import hashlib
import os
import sys

value = sys.stdin.buffer.read()
salt = os.urandom(16)
iterations = 310_000
digest = hashlib.pbkdf2_hmac("sha256", value, salt, iterations)
print(f"pbkdf2_sha256${iterations}${salt.hex()}${digest.hex()}")
' >"${credential_temp}"
chown root:root "${credential_temp}"
chmod 0600 "${credential_temp}"
password=""
confirmation=""
if [[ -f "${credential_file}" ]]; then
  had_credential=1
  credential_backup="$(mktemp /etc/course-hub/.site-password-backup.XXXXXX)"
  cp -a "${credential_file}" "${credential_backup}"
fi

service_state="$(systemctl is-active "${service}" 2>/dev/null || true)"
case "${service_state}" in
  active|activating|reloading)
    service_was_active=1
    ;;
esac

# From this point through the final Nginx reload, every error restores the
# previous credential and the service's original running/stopped state.
transaction_started=1
if [[ "${service_was_active}" == "1" ]]; then
  systemctl stop "${service}"
fi
if systemctl is-active --quiet "${service}"; then
  rollback_transaction 1 "${LINENO}" \
    'The API could not be stopped safely; no password change was retained.'
fi

mv -f "${credential_temp}" "${credential_file}"
credential_temp=""

# Changing the site password must invalidate every browser that authenticated
# with the previous password. Learning data is untouched. The API is stopped,
# and SQLite runs as the same unprivileged user as the service so it cannot
# create root-owned journal, WAL, or shared-memory files.
if [[ -f "${database}" ]]; then
  if ! id -u coursehub >/dev/null 2>&1; then
    rollback_transaction 1 "${LINENO}" \
      'The coursehub service account is missing; sessions were not changed.'
  fi
  runuser -u coursehub -- python3 - "${database}" <<'PY'
import sqlite3
import sys

database = sys.argv[1]
with sqlite3.connect(database) as connection:
    connection.execute("DELETE FROM sessions")
PY
fi

if [[ "${service_was_active}" == "1" ]]; then
  if ! systemctl start "${service}"; then
    rollback_transaction 1 "${LINENO}" \
      'The API could not start with the replacement password hash.'
  fi

  api_ready=0
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    if python3 -c '
import urllib.request
with urllib.request.urlopen("http://127.0.0.1:8787/api/v1/health", timeout=2) as response:
    raise SystemExit(0 if response.status == 200 else 1)
' >/dev/null 2>&1; then
      api_ready=1
      break
    fi
    sleep 1
  done
  if [[ "${api_ready}" != "1" ]]; then
    rollback_transaction 1 "${LINENO}" \
      'The API did not become healthy with the replacement password hash.'
  fi
fi

if [[ -f /etc/nginx/sites-enabled/phy301-study-tree.conf ]]; then
  nginx -t
  systemctl reload nginx
fi

transaction_started=0
printf 'Private access password hash installed; plaintext was not written to disk.\n'
