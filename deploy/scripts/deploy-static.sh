#!/usr/bin/env bash
set -Eeuo pipefail

trap 'printf "deploy failed at line %s\n" "$LINENO" >&2' ERR

usage() {
  cat <<'EOF'
Usage: bash deploy/scripts/deploy-static.sh --target USER@HOST [options]

Options:
  --source DIR       Static build directory (default: repository docs/)
  --release ID       Safe release ID (default: UTC timestamp + Git SHA)
  --url URL          Public course URL to verify after deployment
  -h, --help         Show this help
EOF
}

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd -- "${script_dir}/../.." && pwd -P)"
source_dir="${repo_root}/docs"
target=""
release_id=""
health_url=""
deploy_root="/srv/learning-hub/courses/phy301"
site_prefix="phy301-study-tree"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) target="${2:-}"; shift 2 ;;
    --source) source_dir="${2:-}"; shift 2 ;;
    --release) release_id="${2:-}"; shift 2 ;;
    --url) health_url="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ -z "${health_url}" ]]; then
  health_url="https://gaoyouyang.site/${site_prefix}/"
fi

if [[ "${health_url}" != http://* && "${health_url}" != https://* ]]; then
  printf 'Health URL must begin with http:// or https://.\n' >&2
  exit 2
fi

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

if is_external_https_url "${health_url}" && [[ -z "${COURSE_HUB_AUTH_TOKEN:-}" ]]; then
  printf 'Private external HTTPS verification requires COURSE_HUB_AUTH_TOKEN; no remote change was made.\n' >&2
  exit 2
fi
if [[ "${COURSE_HUB_AUTH_TOKEN:-}" == *$'\n'* || "${COURSE_HUB_AUTH_TOKEN:-}" == *$'\r'* ]]; then
  printf 'COURSE_HUB_AUTH_TOKEN must not contain a newline; no remote change was made.\n' >&2
  exit 2
fi

if [[ ! "${target}" =~ ^[A-Za-z0-9._-]+@[A-Za-z0-9._:-]+$ ]]; then
  printf 'Provide a safe SSH target such as ubuntu@150.109.55.123.\n' >&2
  exit 2
fi
if [[ ! -f "${source_dir}/index.html" ]]; then
  printf 'Static build is missing index.html: %s\n' "${source_dir}" >&2
  exit 2
fi

if [[ -z "${release_id}" ]]; then
  git_sha="$(git -C "${repo_root}" rev-parse --short=12 HEAD 2>/dev/null || printf 'local')"
  release_id="$(date -u +%Y%m%dT%H%M%SZ)-${git_sha}"
fi
if [[ ! "${release_id}" =~ ^[A-Za-z0-9._-]+$ ]]; then
  printf 'Release ID may contain only letters, digits, dot, underscore, and dash.\n' >&2
  exit 2
fi

for command_name in env ssh rsync curl; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    printf 'Required command not found: %s\n' "${command_name}" >&2
    exit 1
  fi
done

if [[ ! -f "${script_dir}/health-check.sh" ]]; then
  printf 'Course health checker is missing: %s\n' "${script_dir}/health-check.sh" >&2
  exit 1
fi

remote_state="$(env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
  "${deploy_root}" "${release_id}" "${site_prefix}" <<'REMOTE_PREPARE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
site_prefix="$3"
final_dir="${deploy_root}/releases/${release_id}"
incoming_dir="${deploy_root}/releases/.incoming-${release_id}"

if [[ -d "${final_dir}" ]]; then
  [[ -f "${final_dir}/${site_prefix}/index.html" ]]
  printf 'existing\n'
else
  mkdir -p "${incoming_dir}/${site_prefix}"
  printf 'upload\n'
fi
REMOTE_PREPARE
)"

if [[ "${remote_state}" == "upload" ]]; then
  env -u COURSE_HUB_AUTH_TOKEN rsync -a --delete --exclude '.DS_Store' \
    "${source_dir}/" \
    "${target}:${deploy_root}/releases/.incoming-${release_id}/${site_prefix}/"
elif [[ "${remote_state}" != "existing" ]]; then
  printf 'Unexpected server preparation response: %s\n' "${remote_state}" >&2
  exit 1
fi

env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
  "${deploy_root}" "${release_id}" "${site_prefix}" <<'REMOTE_ACTIVATE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
site_prefix="$3"
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
  [[ -f "${incoming_dir}/${site_prefix}/index.html" ]]
  find "${incoming_dir}" -type d -exec chmod 0755 {} +
  find "${incoming_dir}" -type f -exec chmod 0644 {} +
  mv "${incoming_dir}" "${final_dir}"
fi

previous_target="$(readlink "${current_link}" 2>/dev/null || true)"
if [[ -n "${previous_target}" && ! "${previous_target}" =~ ^releases/[A-Za-z0-9._-]+$ ]]; then
  printf 'Refusing activation because the current release link is unmanaged: %s\n' "${previous_target}" >&2
  exit 1
fi
umask 077
printf '%s\n' "${previous_target}" >"${rollback_state_tmp}"
mv -f "${rollback_state_tmp}" "${rollback_state}"
ln -sfnT "releases/${release_id}" "${next_link}"
mv -Tf "${next_link}" "${current_link}"

page_html=""
if ! page_html="$(curl -fsS --max-time 10 \
  -H 'Host: localhost' \
  "http://127.0.0.1:8080/${site_prefix}/")"; then
  page_html=""
fi
if ! grep -Fq 'PHY301' <<<"${page_html}"; then
  printf 'Server-local health check failed; restoring previous release.\n' >&2
  restore_previous "${previous_target}"
  rm -f -- "${rollback_state}"
  exit 1
fi

printf 'Activated release %s\n' "${release_id}"
REMOTE_ACTIVATE

if ! bash "${script_dir}/health-check.sh" "${health_url}"; then
  printf 'External course health check failed; restoring the previous release.\n' >&2
  if ! env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
    "${deploy_root}" "${release_id}" "${site_prefix}" <<'REMOTE_ROLLBACK'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
site_prefix="$3"
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
  printf 'Rollback state contains an unmanaged release target.\n' >&2
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
  printf 'External check failed on the first release; removed the current link.\n' >&2
  exit 0
fi

page_html=""
if ! page_html="$(curl -fsS --max-time 10 \
  -H 'Host: localhost' \
  "http://127.0.0.1:8080/${site_prefix}/")"; then
  page_html=""
fi
if ! grep -Fq 'PHY301' <<<"${page_html}"; then
  printf 'Previous release was restored, but its server-local health check failed.\n' >&2
  exit 1
fi
printf 'Restored and verified previous release %s\n' "${previous_target}"
REMOTE_ROLLBACK
  then
    printf 'Automatic rollback could not be verified; inspect the remote current link immediately.\n' >&2
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
