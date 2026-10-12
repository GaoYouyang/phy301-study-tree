#!/usr/bin/env bash
set -Eeuo pipefail

direct_url="${COURSE_HUB_DIRECT_URL:-http://127.0.0.1:8787/api/v1/health}"
proxy_url="${COURSE_HUB_PROXY_URL:-http://127.0.0.1:8080/api/v1/health}"
proxy_host="${COURSE_HUB_PROXY_HOST:-localhost}"
curl_flags=(--fail --silent --show-error --max-time 10 --retry 3 --retry-connrefused)

if command -v ss >/dev/null 2>&1; then
  listeners="$(ss -ltnH 'sport = :8787' || true)"
  if [[ -n "${listeners}" ]] && ! grep -Fq '127.0.0.1:8787' <<<"${listeners}"; then
    printf 'API port 8787 is not restricted to IPv4 loopback.\n' >&2
    exit 1
  fi
fi

direct_body="$(curl "${curl_flags[@]}" "${direct_url}")"
if ! grep -Fq '"status":"ok"' <<<"${direct_body}"; then
  printf 'Direct API health response was unexpected.\n' >&2
  exit 1
fi

proxy_body="$(curl "${curl_flags[@]}" -H "Host: ${proxy_host}" "${proxy_url}")"
if ! grep -Fq '"courses":4' <<<"${proxy_body}"; then
  printf 'Nginx-proxied API health response was unexpected.\n' >&2
  exit 1
fi

printf 'Course Hub API healthy through loopback and Nginx.\n'
