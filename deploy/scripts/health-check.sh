#!/usr/bin/env bash
set -Eeuo pipefail

course_url="${1:-https://gaoyouyang.site/phy301-study-tree/}"
course_url="${course_url%/}/"

if [[ "${course_url}" != http://* && "${course_url}" != https://* ]]; then
  printf 'Health URL must begin with http:// or https://.\n' >&2
  exit 2
fi

origin="${course_url%%/phy301-study-tree/*}"
if [[ "${origin}" == "${course_url}" ]]; then
  printf 'Expected a URL ending in /phy301-study-tree/.\n' >&2
  exit 2
fi

curl_flags=(--fail --silent --show-error --location --max-time 20 --retry 2)
auth_header_file=""

cleanup() {
  if [[ -n "${auth_header_file}" ]]; then
    rm -f -- "${auth_header_file}"
  fi
}
trap cleanup EXIT

if [[ -n "${COURSE_HUB_AUTH_TOKEN:-}" ]]; then
  if [[ "${COURSE_HUB_AUTH_TOKEN}" == *$'\n'* || "${COURSE_HUB_AUTH_TOKEN}" == *$'\r'* ]]; then
    printf 'COURSE_HUB_AUTH_TOKEN must not contain a newline.\n' >&2
    exit 2
  fi
  auth_header_file="$(mktemp "${TMPDIR:-/tmp}/course-hub-curl-header.XXXXXX")"
  chmod 0600 "${auth_header_file}"
  printf 'Authorization: Bearer %s\n' "${COURSE_HUB_AUTH_TOKEN}" >"${auth_header_file}"
  unset COURSE_HUB_AUTH_TOKEN
  curl_flags+=(--header "@${auth_header_file}")
fi

health_body="$(curl "${curl_flags[@]}" "${origin}/healthz")"
if [[ "${health_body}" != "ok" ]]; then
  printf 'Unexpected /healthz response: %s\n' "${health_body}" >&2
  exit 1
fi

page_html="$(curl "${curl_flags[@]}" "${course_url}")"
if ! grep -Fq '<title>统计物理从零学习路线</title>' <<<"${page_html}"; then
  printf 'Course page loaded but the expected title was absent.\n' >&2
  exit 1
fi

asset_path="$(grep -Eo '/phy301-study-tree/_next/static/[^" ]+\.(css|js)' \
  <<<"${page_html}" | head -n 1 || true)"
if [[ -z "${asset_path}" ]]; then
  printf 'Course page did not expose a generated CSS/JS asset path.\n' >&2
  exit 1
fi
curl "${curl_flags[@]}" --output /dev/null "${origin}${asset_path}"

printf 'Healthy: %s\n' "${course_url}"
printf 'Verified: /healthz, course title, and generated asset.\n'
