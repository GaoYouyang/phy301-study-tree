#!/usr/bin/env bash
set -Eeuo pipefail

run_renewal_dry_run="0"
if [[ "${1:-}" == "--renewal-dry-run" ]]; then
  run_renewal_dry_run="1"
elif [[ $# -gt 0 ]]; then
  printf 'Usage: sudo bash %s [--renewal-dry-run]\n' "$0" >&2
  exit 2
fi

if [[ "${EUID}" -ne 0 ]]; then
  printf 'Run with sudo so certificate files can be verified.\n' >&2
  exit 1
fi

certificate_dir="/etc/letsencrypt/live/gaoyouyang.site"
for required in \
  "${certificate_dir}/fullchain.pem" \
  "${certificate_dir}/privkey.pem" \
  /etc/letsencrypt/options-ssl-nginx.conf \
  /etc/letsencrypt/ssl-dhparams.pem; do
  if [[ ! -f "${required}" ]]; then
    printf 'Missing TLS artifact: %s\n' "${required}" >&2
    exit 1
  fi
done

nginx -t
openssl x509 -in "${certificate_dir}/fullchain.pem" -noout -checkend 604800

curl_flags=(--fail --silent --show-error --location --max-time 20 --noproxy '*')
curl "${curl_flags[@]}" --resolve gaoyouyang.site:443:127.0.0.1 \
  --output /dev/null https://gaoyouyang.site/
curl "${curl_flags[@]}" --resolve gaoyouyang.site:443:127.0.0.1 \
  --output /dev/null https://gaoyouyang.site/phy301-study-tree/
curl "${curl_flags[@]}" --resolve gaoyouyang.site:443:127.0.0.1 \
  --output /dev/null https://gaoyouyang.site/phy301/
api_health="$(curl "${curl_flags[@]}" \
  --resolve gaoyouyang.site:443:127.0.0.1 \
  https://gaoyouyang.site/api/v1/health)"
if ! grep -Fq '"status":"ok"' <<<"${api_health}"; then
  printf 'HTTPS API health response was unexpected.\n' >&2
  exit 1
fi

if [[ "${run_renewal_dry_run}" == "1" ]]; then
  certbot renew --dry-run
fi

printf '%s\n' 'TLS verified: Nginx, certificate validity, root, stable/legacy PHY301, and API.'
