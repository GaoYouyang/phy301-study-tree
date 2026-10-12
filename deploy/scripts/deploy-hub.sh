#!/usr/bin/env bash
set -Eeuo pipefail

trap 'printf "hub deploy failed at line %s\n" "$LINENO" >&2' ERR

usage() {
  cat <<'EOF'
Usage: bash deploy/scripts/deploy-hub.sh --target USER@HOST [options]

Options:
  --source DIR       Hub static directory (default: repository hub/site/)
  --release ID       Safe release ID (default: UTC timestamp + Git SHA)
  --url ORIGIN       Public origin to verify (default: server public IP)
  --check-api        Also require /api/v1/health through the hub health script
  -h, --help         Show this help
EOF
}

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd -- "${script_dir}/../.." && pwd -P)"
source_dir="${repo_root}/hub/site"
target=""
release_id=""
origin="https://gaoyouyang.site"
check_api="0"
deploy_root="/srv/learning-hub/hub"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) target="${2:-}"; shift 2 ;;
    --source) source_dir="${2:-}"; shift 2 ;;
    --release) release_id="${2:-}"; shift 2 ;;
    --url) origin="${2:-}"; shift 2 ;;
    --check-api) check_api="1"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

is_external_https_url() {
  local authority
  [[ "$1" == https://* ]] || return 1
  authority="${1#https://}"
  authority="${authority%%/*}"
  case "${authority}" in
    localhost|localhost:*|127.0.0.1|127.0.0.1:*|'[::1]'|'[::1]':*) return 1 ;;
    *) return 0 ;;
  esac
}

if [[ ! "${target}" =~ ^[A-Za-z0-9._-]+@[A-Za-z0-9._:-]+$ ]]; then
  printf 'Provide a safe SSH target such as ubuntu@course-hub.\n' >&2
  exit 2
fi
if [[ ! -f "${source_dir}/index.html" ]]; then
  printf 'Hub source is missing index.html: %s\n' "${source_dir}" >&2
  exit 2
fi
if [[ "${origin}" != http://* && "${origin}" != https://* ]]; then
  printf 'Hub health origin must begin with http:// or https://.\n' >&2
  exit 2
fi
origin="${origin%/}"

if is_external_https_url "${origin}" && [[ -z "${COURSE_HUB_AUTH_TOKEN:-}" ]]; then
  printf 'Private external HTTPS verification requires COURSE_HUB_AUTH_TOKEN; no remote change was made.\n' >&2
  exit 2
fi
if [[ "${COURSE_HUB_AUTH_TOKEN:-}" == *$'\n'* || "${COURSE_HUB_AUTH_TOKEN:-}" == *$'\r'* ]]; then
  printf 'COURSE_HUB_AUTH_TOKEN must not contain a newline; no remote change was made.\n' >&2
  exit 2
fi

if [[ -z "${release_id}" ]]; then
  git_sha="$(git -C "${repo_root}" rev-parse --short=12 HEAD 2>/dev/null || printf 'local')"
  release_id="$(date -u +%Y%m%dT%H%M%SZ)-${git_sha}"
fi
if [[ ! "${release_id}" =~ ^[A-Za-z0-9._-]+$ ]]; then
  printf 'Release ID contains unsupported characters.\n' >&2
  exit 2
fi

for command_name in env ssh rsync curl; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    printf 'Required command not found: %s\n' "${command_name}" >&2
    exit 1
  fi
done

hub_health="${repo_root}/hub/scripts/health-check.sh"
if [[ ! -f "${hub_health}" ]]; then
  printf 'Hub health checker is missing: %s\n' "${hub_health}" >&2
  exit 1
fi

remote_state="$(env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- "${deploy_root}" "${release_id}" <<'REMOTE_PREPARE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
final_dir="${deploy_root}/releases/${release_id}"
incoming_dir="${deploy_root}/releases/.incoming-${release_id}"
if [[ -d "${final_dir}" ]]; then
  [[ -f "${final_dir}/index.html" ]]
  printf 'existing\n'
else
  mkdir -p "${incoming_dir}"
  printf 'upload\n'
fi
REMOTE_PREPARE
)"

if [[ "${remote_state}" == "upload" ]]; then
  env -u COURSE_HUB_AUTH_TOKEN rsync -a --delete --exclude '.DS_Store' \
    "${source_dir}/" "${target}:${deploy_root}/releases/.incoming-${release_id}/"
elif [[ "${remote_state}" != "existing" ]]; then
  printf 'Unexpected server preparation response: %s\n' "${remote_state}" >&2
  exit 1
fi

env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- "${deploy_root}" "${release_id}" <<'REMOTE_ACTIVATE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
final_dir="${deploy_root}/releases/${release_id}"
incoming_dir="${deploy_root}/releases/.incoming-${release_id}"
current_link="${deploy_root}/current"
next_link="${deploy_root}/.current-next-${release_id}"
rollback_state="${deploy_root}/.rollback-${release_id}"
rollback_state_tmp="${rollback_state}.tmp.$$"

cleanup() {
  rm -f -- "${next_link}" "${rollback_state_tmp}"
}
trap cleanup EXIT

restore_previous() {
  local previous_target="$1"
  if [[ -n "${previous_target}" ]]; then
    rollback_link="${deploy_root}/.current-rollback-${release_id}"
    ln -sfnT "${previous_target}" "${rollback_link}"
    mv -Tf "${rollback_link}" "${current_link}"
  else
    unlink "${current_link}"
  fi
}
if [[ ! -d "${final_dir}" ]]; then
  [[ -f "${incoming_dir}/index.html" ]]
  find "${incoming_dir}" -type d -exec chmod 0755 {} +
  find "${incoming_dir}" -type f -exec chmod 0644 {} +
  mv "${incoming_dir}" "${final_dir}"
fi
previous_target="$(readlink "${current_link}" 2>/dev/null || true)"
if [[ -n "${previous_target}" && ! "${previous_target}" =~ ^releases/[A-Za-z0-9._-]+$ ]]; then
  printf 'Refusing activation because the current hub link is unmanaged: %s\n' "${previous_target}" >&2
  exit 1
fi
umask 077
printf '%s\n' "${previous_target}" >"${rollback_state_tmp}"
mv -f "${rollback_state_tmp}" "${rollback_state}"
ln -sfnT "releases/${release_id}" "${next_link}"
mv -Tf "${next_link}" "${current_link}"

page_html=""
if ! page_html="$(curl -fsS --max-time 10 -H 'Host: localhost' http://127.0.0.1:8080/)"; then
  page_html=""
fi
if ! grep -Eiq '<!doctype|<html' <<<"${page_html}"; then
  printf 'Server-local hub check failed; restoring previous release.\n' >&2
  restore_previous "${previous_target}"
  rm -f -- "${rollback_state}"
  exit 1
fi
printf 'Activated hub release %s\n' "${release_id}"
REMOTE_ACTIVATE

if ! {
  if [[ "${check_api}" == "1" ]]; then
    bash "${hub_health}" "${origin}" --api
  else
    bash "${hub_health}" "${origin}"
  fi
}; then
  printf 'External hub health check failed; restoring the previous release.\n' >&2
  if ! env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- "${deploy_root}" "${release_id}" <<'REMOTE_ROLLBACK'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
current_link="${deploy_root}/current"
rollback_state="${deploy_root}/.rollback-${release_id}"
expected_target="releases/${release_id}"

[[ -f "${rollback_state}" ]]
active_target="$(readlink "${current_link}" 2>/dev/null || true)"
if [[ "${active_target}" != "${expected_target}" ]]; then
  printf 'Refusing rollback because current changed concurrently: %s\n' "${active_target}" >&2
  exit 1
fi
IFS= read -r previous_target <"${rollback_state}" || true
if [[ -n "${previous_target}" && ! "${previous_target}" =~ ^releases/[A-Za-z0-9._-]+$ ]]; then
  printf 'Rollback state contains an unmanaged hub target.\n' >&2
  exit 1
fi

if [[ -n "${previous_target}" ]]; then
  rollback_link="${deploy_root}/.current-rollback-${release_id}"
  ln -sfnT "${previous_target}" "${rollback_link}"
  mv -Tf "${rollback_link}" "${current_link}"
else
  unlink "${current_link}"
fi
rm -f -- "${rollback_state}"

if [[ -z "${previous_target}" ]]; then
  printf 'External check failed on the first hub release; removed the current link.\n' >&2
  exit 0
fi

page_html=""
if ! page_html="$(curl -fsS --max-time 10 -H 'Host: localhost' http://127.0.0.1:8080/)"; then
  page_html=""
fi
if ! grep -Eiq '<!doctype|<html' <<<"${page_html}"; then
  printf 'Previous hub release was restored, but its server-local health check failed.\n' >&2
  exit 1
fi
printf 'Restored and verified previous hub release %s\n' "${previous_target}"
REMOTE_ROLLBACK
  then
    printf 'Automatic hub rollback could not be verified; inspect the remote current link immediately.\n' >&2
  fi
  exit 1
fi

env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- "${deploy_root}" "${release_id}" <<'REMOTE_FINALIZE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
current_link="${deploy_root}/current"
rollback_state="${deploy_root}/.rollback-${release_id}"
expected_target="releases/${release_id}"

[[ "$(readlink "${current_link}" 2>/dev/null || true)" == "${expected_target}" ]]
rm -f -- "${rollback_state}"
REMOTE_FINALIZE
