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
inventory_file=""
inventory_url_list_file=""

cleanup() {
  if [[ -n "${auth_header_file}" ]]; then
    rm -f -- "${auth_header_file}"
  fi
  if [[ -n "${inventory_file}" ]]; then
    rm -f -- "${inventory_file}"
  fi
  if [[ -n "${inventory_url_list_file}" ]]; then
    rm -f -- "${inventory_url_list_file}"
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

inventory_file="$(mktemp "${TMPDIR:-/tmp}/phy301-source-inventory.XXXXXX")"
inventory_url_list_file="$(mktemp "${TMPDIR:-/tmp}/phy301-original-urls.XXXXXX")"
chmod 0600 "${inventory_file}" "${inventory_url_list_file}"
curl "${curl_flags[@]}" --output "${inventory_file}" \
  "${origin}/phy301/materials/source-inventory.json"

python3 - "${inventory_file}" >"${inventory_url_list_file}" <<'PY'
import json
import sys
import urllib.parse

with open(sys.argv[1], "r", encoding="utf-8") as handle:
    inventory = json.load(handle)
if inventory.get("schemaVersion") != "course-materials/v1":
    raise SystemExit("stable PHY301 inventory has the wrong schemaVersion")
course = inventory.get("course")
if not isinstance(course, dict) or course.get("code") != "PHY301" or course.get("route") != "/phy301/":
    raise SystemExit("stable PHY301 inventory has the wrong course identity")

for index, material in enumerate(inventory.get("materials", [])):
    if material.get("sourceStatus") != "published-original":
        continue
    value = material.get("originalUrl")
    if not isinstance(value, str) or not value.startswith("/phy301/"):
        raise SystemExit(f"unsafe originalUrl at materials[{index}]")
    decoded = value
    for _ in range(8):
        next_decoded = urllib.parse.unquote(decoded, errors="strict")
        if next_decoded == decoded:
            break
        decoded = next_decoded
    else:
        raise SystemExit(f"excessively encoded originalUrl at materials[{index}]")
    relative = decoded[len("/phy301/"):]
    if (
        not relative
        or decoded.startswith("//")
        or any(character in decoded for character in ("\\", "?", "#"))
        or any(ord(character) < 32 for character in decoded)
        or any(part in {"", ".", ".."} for part in relative.split("/"))
    ):
        raise SystemExit(f"unsafe originalUrl at materials[{index}]")
    sys.stdout.buffer.write(value.encode("utf-8") + b"\0")
PY

original_count=0
while IFS= read -r -d '' original_url; do
  curl "${curl_flags[@]}" --output /dev/null "${origin}${original_url}"
  original_count=$((original_count + 1))
done <"${inventory_url_list_file}"
if [[ "${original_count}" -lt 1 ]]; then
  printf 'Stable PHY301 material inventory contains no downloadable originals.\n' >&2
  exit 1
fi

printf 'Healthy: %s\n' "${course_url}"
printf 'Verified: /healthz, course title, generated asset, stable material inventory, and %s original downloads.\n' "${original_count}"
