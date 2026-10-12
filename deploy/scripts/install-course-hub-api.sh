#!/usr/bin/env bash
set -Eeuo pipefail

trap 'printf "course-hub install failed at line %s\n" "$LINENO" >&2' ERR

if [[ "${EUID}" -ne 0 ]]; then
  printf 'Run with sudo: sudo DEPLOY_OWNER="$USER" bash %s\n' "$0" >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd -- "${script_dir}/../.." && pwd -P)"
service_source="${repo_root}/services/course_hub_api"
deploy_owner="${DEPLOY_OWNER:-${SUDO_USER:-root}}"

required_files=(
  "${service_source}/course_hub_api.py"
  "${service_source}/courses.json"
  "${repo_root}/deploy/systemd/course-hub-api.service"
  "${repo_root}/deploy/nginx/conf.d/course-hub-rate-limit.conf"
  "${repo_root}/deploy/nginx/locations-enabled/10-course-hub-api.conf"
)
for required_file in "${required_files[@]}"; do
  if [[ ! -f "${required_file}" ]]; then
    printf 'Missing deployment source: %s\n' "${required_file}" >&2
    exit 1
  fi
done

# Ensure the base Nginx/static layout exists without deleting the default site.
DEPLOY_OWNER="${deploy_owner}" bash "${script_dir}/bootstrap-ubuntu.sh"
apt-get install -y --no-install-recommends python3

if ! getent group coursehub >/dev/null; then
  groupadd --system coursehub
fi
if ! id coursehub >/dev/null 2>&1; then
  useradd --system --gid coursehub --home-dir /var/lib/course-hub \
    --shell /usr/sbin/nologin coursehub
fi

install -d -o root -g root -m 0755 /opt/course-hub-api
install -d -o root -g root -m 0700 /etc/course-hub
install -d -o coursehub -g coursehub -m 0700 /var/lib/course-hub
install -d -o root -g root -m 0700 /var/backups/course-hub

install -o root -g root -m 0555 "${service_source}/course_hub_api.py" \
  /opt/course-hub-api/course_hub_api.py
install -o root -g root -m 0444 "${service_source}/courses.json" \
  /opt/course-hub-api/courses.json
install -o root -g root -m 0644 \
  "${repo_root}/deploy/systemd/course-hub-api.service" \
  /etc/systemd/system/course-hub-api.service

token_path="/etc/course-hub/api-token"
site_password_path="/etc/course-hub/site-password"
if [[ ! -f "${token_path}" ]]; then
  token_temp="$(mktemp /etc/course-hub/.api-token.XXXXXX)"
  chmod 0600 "${token_temp}"
  python3 -c 'import secrets; print(secrets.token_urlsafe(48))' >"${token_temp}"
  chown root:root "${token_temp}"
  chmod 0600 "${token_temp}"
  mv -f "${token_temp}" "${token_path}"
else
  chown root:root "${token_path}"
  chmod 0600 "${token_path}"
fi
if [[ "$(tr -d '\r\n' <"${token_path}" | wc -c)" -lt 32 ]]; then
  printf 'Existing API token is too short; rotate it before installation.\n' >&2
  exit 1
fi
if [[ ! -s "${site_password_path}" ]]; then
  printf '%s\n' \
    'Private-site password hash is missing; run configure-private-access.sh first.' >&2
  exit 1
fi
chown root:root "${site_password_path}"
chmod 0600 "${site_password_path}"

systemctl daemon-reload
systemctl enable course-hub-api.service
systemctl restart course-hub-api.service

config_backup="$(mktemp -d /tmp/course-hub-nginx.XXXXXX)"
trap 'rm -rf -- "${config_backup}"' EXIT
rate_target="/etc/nginx/conf.d/course-hub-rate-limit.conf"
proxy_target="/etc/nginx/phy301/locations-enabled/10-course-hub-api.conf"
rate_existed=0
proxy_existed=0
if [[ -f "${rate_target}" ]]; then
  cp -a "${rate_target}" "${config_backup}/rate.conf"
  rate_existed=1
fi
if [[ -f "${proxy_target}" ]]; then
  cp -a "${proxy_target}" "${config_backup}/proxy.conf"
  proxy_existed=1
fi

install -o root -g root -m 0644 \
  "${repo_root}/deploy/nginx/conf.d/course-hub-rate-limit.conf" "${rate_target}"
install -o root -g root -m 0644 \
  "${repo_root}/deploy/nginx/locations-enabled/10-course-hub-api.conf" "${proxy_target}"

if ! nginx -t; then
  if [[ "${rate_existed}" == "1" ]]; then
    cp -a "${config_backup}/rate.conf" "${rate_target}"
  else
    unlink "${rate_target}"
  fi
  if [[ "${proxy_existed}" == "1" ]]; then
    cp -a "${config_backup}/proxy.conf" "${proxy_target}"
  else
    unlink "${proxy_target}"
  fi
  nginx -t || true
  printf 'Nginx configuration rejected; previous files restored.\n' >&2
  exit 1
fi
systemctl reload nginx

bash "${script_dir}/health-check-api.sh"

printf '%s\n' 'Course Hub API installed without exposing its loopback port.'
printf '%s\n' 'Read the root token only when logging in:'
printf '%s\n' '  sudo cat /etc/course-hub/api-token'
printf '%s\n' 'Rotate it after HTTP/IP testing and again if it is ever disclosed.'
