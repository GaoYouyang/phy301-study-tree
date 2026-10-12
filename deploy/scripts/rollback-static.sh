#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'EOF'
Usage: bash deploy/scripts/rollback-static.sh --target USER@HOST SELECTOR [--apply]

Selector (choose one):
  --previous          Select the newest release other than current
  --release ID        Select a specific release

Without --apply, the script only prints the selected rollback.
EOF
}

target=""
selection_mode=""
requested_release=""
apply="0"
deploy_root="/srv/learning-hub/courses/phy301"
site_prefix="phy301-study-tree"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) target="${2:-}"; shift 2 ;;
    --previous) selection_mode="previous"; shift ;;
    --release) selection_mode="release"; requested_release="${2:-}"; shift 2 ;;
    --apply) apply="1"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ ! "${target}" =~ ^[A-Za-z0-9._-]+@[A-Za-z0-9._:-]+$ ]]; then
  printf 'Provide a safe SSH target such as ubuntu@150.109.55.123.\n' >&2
  exit 2
fi
if [[ "${selection_mode}" != "previous" && "${selection_mode}" != "release" ]]; then
  printf 'Choose --previous or --release ID.\n' >&2
  exit 2
fi
if [[ "${selection_mode}" == "release" && ! "${requested_release}" =~ ^[A-Za-z0-9._-]+$ ]]; then
  printf 'Release ID contains unsupported characters.\n' >&2
  exit 2
fi

ssh "${target}" bash -s -- \
  "${deploy_root}" "${site_prefix}" "${selection_mode}" \
  "${requested_release}" "${apply}" <<'REMOTE_ROLLBACK'
set -Eeuo pipefail
deploy_root="$1"
site_prefix="$2"
selection_mode="$3"
requested_release="$4"
apply="$5"
current_link="${deploy_root}/current"
current_target="$(readlink "${current_link}" 2>/dev/null || true)"
current_release="${current_target##*/}"

if [[ "${selection_mode}" == "release" ]]; then
  selected="${requested_release}"
else
  mapfile -t candidates < <(find "${deploy_root}/releases" \
    -mindepth 1 -maxdepth 1 -type d ! -name '.incoming-*' \
    -printf '%f\n' | sort -r)
  selected=""
  for candidate in "${candidates[@]}"; do
    if [[ "${candidate}" != "${current_release}" ]]; then
      selected="${candidate}"
      break
    fi
  done
fi

if [[ -z "${selected:-}" ]]; then
  printf 'No rollback release is available.\n' >&2
  exit 1
fi
if [[ ! -f "${deploy_root}/releases/${selected}/${site_prefix}/index.html" ]]; then
  printf 'Selected release is incomplete or missing: %s\n' "${selected}" >&2
  exit 1
fi

printf 'Current release: %s\n' "${current_release:-none}"
printf 'Selected release: %s\n' "${selected}"

if [[ "${apply}" != "1" ]]; then
  printf 'Preview only. Add --apply to switch releases.\n'
  exit 0
fi
if [[ "${selected}" == "${current_release}" ]]; then
  printf 'Already active; no change made.\n'
  exit 0
fi

next_link="${deploy_root}/.current-next-${selected}"
ln -sfnT "releases/${selected}" "${next_link}"
mv -Tf "${next_link}" "${current_link}"

page_html="$(curl -fsS --max-time 10 \
  -H 'Host: localhost' \
  "http://127.0.0.1:8080/${site_prefix}/")"
if ! grep -Fq 'PHY301' <<<"${page_html}"; then
  printf 'Rollback health check failed; restoring %s.\n' "${current_release}" >&2
  restore_link="${deploy_root}/.current-restore-${current_release}"
  ln -sfnT "${current_target}" "${restore_link}"
  mv -Tf "${restore_link}" "${current_link}"
  exit 1
fi

printf 'Rollback complete: %s\n' "${selected}"
REMOTE_ROLLBACK
