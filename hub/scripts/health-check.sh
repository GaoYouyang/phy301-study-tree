#!/usr/bin/env bash
set -euo pipefail

origin="${1:-}"
check_api=false

if [[ -z "${origin}" ]]; then
  printf 'Usage: %s <origin> [--api]\n' "$0" >&2
  exit 2
fi

if [[ "${2:-}" == "--api" ]]; then
  check_api=true
elif [[ -n "${2:-}" ]]; then
  printf 'Unknown option: %s\n' "$2" >&2
  exit 2
fi

origin="${origin%/}"
curl_flags=(--fail --silent --show-error --location --connect-timeout 5 --max-time 15)
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

html="$(curl "${curl_flags[@]}" "${origin}/")"
if [[ "${html}" != *"我的学习总台"* ]]; then
  printf 'Root page does not contain the hub marker.\n' >&2
  exit 1
fi

css="$(curl "${curl_flags[@]}" "${origin}/assets/styles.css")"
if [[ "${css}" != *".course-grid"* ]]; then
  printf 'Hub stylesheet response was unexpected.\n' >&2
  exit 1
fi

javascript="$(curl "${curl_flags[@]}" "${origin}/assets/app.js")"
if [[ "${javascript}" != *"refreshDashboard"* ]]; then
  printf 'Hub application script response was unexpected.\n' >&2
  exit 1
fi

if [[ "${check_api}" == true ]]; then
  api="$(curl "${curl_flags[@]}" "${origin}/api/v1/health")"
  if [[ "${api}" != *'"status":"ok"'* || "${api}" != *'"apiVersion":"v1"'* ]]; then
    printf 'Course Hub API health response was unexpected.\n' >&2
    exit 1
  fi
fi

printf 'Course hub healthy: root, stylesheet, application%s.\n' "$([[ "${check_api}" == true ]] && printf ', API' || true)"
