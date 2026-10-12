#!/usr/bin/env bash
set -Eeuo pipefail

trap 'printf "bootstrap failed at line %s\n" "$LINENO" >&2' ERR

if [[ "${EUID}" -ne 0 ]]; then
  printf 'Run with sudo: sudo DEPLOY_OWNER="$USER" bash %s\n' "$0" >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
deploy_dir="$(cd -- "${script_dir}/.." && pwd -P)"
nginx_source="${deploy_dir}/nginx/phy301-study-tree.conf"
nginx_tls_source="${deploy_dir}/nginx/phy301-study-tree-tls.conf"
locations_source="${deploy_dir}/nginx/server-locations.conf"
placeholder_source="${deploy_dir}/nginx/locations-enabled/00-placeholder.conf"
deploy_root="/srv/learning-hub/courses/phy301"
deploy_owner="${DEPLOY_OWNER:-${SUDO_USER:-root}}"

if [[ ! -f "${nginx_source}" || ! -f "${nginx_tls_source}" || \
      ! -f "${locations_source}" || ! -f "${placeholder_source}" ]]; then
  printf 'Deployment Nginx files are incomplete under: %s\n' \
    "${deploy_dir}/nginx" >&2
  exit 1
fi

if ! id "${deploy_owner}" >/dev/null 2>&1; then
  printf 'DEPLOY_OWNER does not name a local user: %s\n' "${deploy_owner}" >&2
  exit 1
fi

if [[ -r /etc/os-release ]]; then
  # shellcheck disable=SC1091
  source /etc/os-release
  if [[ "${ID:-}" != "ubuntu" || "${VERSION_ID:-}" != "24.04" ]]; then
    printf 'Warning: designed for Ubuntu 24.04; detected %s %s.\n' \
      "${ID:-unknown}" "${VERSION_ID:-unknown}" >&2
  fi
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends nginx rsync curl ca-certificates

if [[ ! -s /etc/course-hub/site-password ]]; then
  printf '%s\n' \
    'Private-site password hash is missing: run configure-private-access.sh first.' >&2
  exit 1
fi
chown root:root /etc/course-hub/site-password
chmod 0600 /etc/course-hub/site-password

install -d -o "${deploy_owner}" -g www-data -m 2775 \
  /srv/learning-hub \
  /srv/learning-hub/hub \
  /srv/learning-hub/hub/releases \
  /srv/learning-hub/courses \
  "${deploy_root}" \
  "${deploy_root}/releases" \
  /srv/learning-hub/courses/phy408 \
  /srv/learning-hub/courses/phy408/releases \
  /srv/learning-hub/courses/phy309 \
  /srv/learning-hub/courses/phy309/releases \
  /srv/learning-hub/courses/mat107 \
  /srv/learning-hub/courses/mat107/releases
install -d -o root -g root -m 0755 \
  /etc/nginx/phy301 \
  /etc/nginx/phy301/locations-enabled

vhost_target="/etc/nginx/sites-available/phy301-study-tree.conf"
locations_target="/etc/nginx/phy301/server-locations.conf"
certificate_dir="/etc/letsencrypt/live/gaoyouyang.site"
certbot_options="/etc/letsencrypt/options-ssl-nginx.conf"
certbot_dhparams="/etc/letsencrypt/ssl-dhparams.pem"
certificate_ready=0
if [[ -f "${certificate_dir}/fullchain.pem" && \
      -f "${certificate_dir}/privkey.pem" ]]; then
  if [[ ! -f "${certbot_options}" || ! -f "${certbot_dhparams}" ]]; then
    printf 'Certificate exists but Certbot Nginx support files are incomplete; preserving the live vhost.\n' >&2
    exit 1
  fi
  certificate_ready=1
  nginx_source="${nginx_tls_source}"
fi

if [[ "${certificate_ready}" == "0" && -f "${vhost_target}" ]] && \
   grep -Eq 'listen[[:space:]]+443|ssl_certificate' "${vhost_target}"; then
  printf 'Existing vhost contains TLS but certificate detection failed; refusing to overwrite it.\n' >&2
  exit 1
fi

# Preserve the exact first Certbot-managed vhost before migrating to the
# repository's TLS-aware layout. Repeated bootstraps leave this copy untouched.
if [[ "${certificate_ready}" == "1" && -f "${vhost_target}" && \
      ! -f "${vhost_target}.pre-course-hub" ]]; then
  cp -a "${vhost_target}" "${vhost_target}.pre-course-hub"
fi

vhost_backup="$(mktemp /tmp/phy301-vhost.XXXXXX)"
locations_backup="$(mktemp /tmp/phy301-locations.XXXXXX)"
vhost_existed=0
locations_existed=0
if [[ -f "${vhost_target}" ]]; then
  cp -a "${vhost_target}" "${vhost_backup}"
  vhost_existed=1
fi
if [[ -f "${locations_target}" ]]; then
  cp -a "${locations_target}" "${locations_backup}"
  locations_existed=1
fi
install -o root -g root -m 0644 "${locations_source}" "${locations_target}"
install -o root -g root -m 0644 "${placeholder_source}" \
  /etc/nginx/phy301/locations-enabled/00-placeholder.conf
install -o root -g root -m 0644 "${nginx_source}" "${vhost_target}"
ln -sfn /etc/nginx/sites-available/phy301-study-tree.conf \
  /etc/nginx/sites-enabled/phy301-study-tree.conf

if ! nginx -t; then
  if [[ "${vhost_existed}" == "1" ]]; then
    cp -a "${vhost_backup}" "${vhost_target}"
  else
    unlink "${vhost_target}"
    unlink /etc/nginx/sites-enabled/phy301-study-tree.conf
  fi
  if [[ "${locations_existed}" == "1" ]]; then
    cp -a "${locations_backup}" "${locations_target}"
  else
    unlink "${locations_target}"
  fi
  rm -f -- "${vhost_backup}" "${locations_backup}"
  nginx -t || true
  printf 'New Nginx vhost rejected; previous live vhost restored.\n' >&2
  exit 1
fi
rm -f -- "${vhost_backup}" "${locations_backup}"
systemctl enable --now nginx
systemctl reload nginx

if command -v ufw >/dev/null 2>&1 && ufw status | grep -q '^Status: active'; then
  if [[ "${CONFIGURE_UFW:-0}" == "1" ]]; then
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
  else
    printf '%s\n' \
      'Warning: UFW is active. Confirm that OpenSSH and Nginx Full are allowed.' >&2
  fi
fi

printf 'Bootstrap complete. Release owner: %s\n' "${deploy_owner}"
if [[ "${certificate_ready}" == "1" ]]; then
  printf 'TLS certificate detected; installed the HTTPS-preserving vhost.\n'
fi
printf 'Next: run deploy-static.sh from the local repository.\n'
