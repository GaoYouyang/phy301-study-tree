#!/usr/bin/env bash
set -Eeuo pipefail

trap 'printf "course-package deploy failed at line %s\n" "$LINENO" >&2' ERR

usage() {
  cat <<'EOF'
Usage: bash deploy/scripts/deploy-course-package.sh \
  --package /path/to/course-package --target USER@HOST [options]

Options:
  --package DIR      Validated handoff directory containing manifest.json
  --target USER@HOST SSH destination used by the central operator
  --release ID       Immutable release ID (default: full package digest)
  --origin URL       Public origin for the authenticated smoke test
                     (default: https://gaoyouyang.site)
  -h, --help         Show this help

COURSE_HUB_AUTH_TOKEN is read only for the final private HTTPS smoke test.
It is removed from ssh/rsync environments and never copied into the release.
EOF
}

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd -- "${script_dir}/../.." && pwd -P)"
validator="${repo_root}/coordination/integration/validate_course_package.py"
package_dir=""
target=""
release_id=""
origin="https://gaoyouyang.site"
lock_dir=""
auth_header_file=""
external_inventory_file=""
snapshot_dir=""
snapshot_list_file=""
inventory_url_list_file=""
lock_acquired="0"

cleanup() {
  if [[ -n "${auth_header_file}" ]]; then
    unlink "${auth_header_file}" 2>/dev/null || true
  fi
  if [[ -n "${external_inventory_file}" ]]; then
    unlink "${external_inventory_file}" 2>/dev/null || true
  fi
  if [[ -n "${snapshot_list_file}" ]]; then
    unlink "${snapshot_list_file}" 2>/dev/null || true
  fi
  if [[ -n "${inventory_url_list_file}" ]]; then
    unlink "${inventory_url_list_file}" 2>/dev/null || true
  fi
  if [[ -n "${snapshot_dir}" && -d "${snapshot_dir}" ]]; then
    # The validated snapshot is made read-only before any network operation.
    # Restore write permission only on its own directories so the exact
    # mktemp tree can be removed without following links.
    find "${snapshot_dir}" -type d -exec chmod u+rwx {} + 2>/dev/null || true
    find "${snapshot_dir}" -depth -delete 2>/dev/null || true
  fi
  if [[ "${lock_acquired}" == "1" && -n "${lock_dir}" ]]; then
    unlink "${lock_dir}/pid" 2>/dev/null || true
    rmdir "${lock_dir}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

while [[ $# -gt 0 ]]; do
  case "$1" in
    --package) package_dir="${2:-}"; shift 2 ;;
    --target) target="${2:-}"; shift 2 ;;
    --release) release_id="${2:-}"; shift 2 ;;
    --origin) origin="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ -z "${package_dir}" ]]; then
  printf 'Provide --package /path/to/course-package.\n' >&2
  exit 2
fi
if [[ ! "${target}" =~ ^[A-Za-z0-9._-]+@[A-Za-z0-9._:-]+$ ]]; then
  printf 'Provide a safe SSH target such as ubuntu@course-hub.\n' >&2
  exit 2
fi
if [[ "${origin}" != http://* && "${origin}" != https://* ]]; then
  printf 'Origin must begin with http:// or https://.\n' >&2
  exit 2
fi
origin="${origin%/}"

for command_name in python3 env ssh rsync curl grep cmp mktemp find chmod unlink; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    printf 'Required command not found: %s\n' "${command_name}" >&2
    exit 1
  fi
done
if [[ ! -f "${validator}" ]]; then
  printf 'Course-package validator is missing: %s\n' "${validator}" >&2
  exit 1
fi

# Validation is deliberately the first gate: no network or remote mutation has
# happened if identity, evidence, checksums, package hash, or secret scans fail.
package_dir="$(cd -- "${package_dir}" && pwd -P)"
env -u COURSE_HUB_AUTH_TOKEN python3 "${validator}" "${package_dir}" --emit-tsv >/dev/null

# Freeze the exact validated delivery surface before deriving a release ID or
# touching the network. The first validation establishes that the live package
# is a legitimate course-package/v1 handoff. We then copy only its declared
# contract surface into a private mktemp directory and run the same validator
# again there. If the live project changes during this copy, the snapshot is
# either a self-consistent new package with its own digest or validation fails;
# an old digest can never label newly copied bytes.
snapshot_dir="$(mktemp -d "${TMPDIR:-/tmp}/course-package-snapshot.XXXXXX")"
snapshot_dir="$(cd -- "${snapshot_dir}" && pwd -P)"
snapshot_list_file="$(mktemp "${TMPDIR:-/tmp}/course-package-snapshot-files.XXXXXX")"

# Copy the five fixed root files first. The copied manifest and checksum file,
# not mutable live metadata, define which additional evidence belongs to this
# particular snapshot. Archive mode preserves a raced-in symlink so the second
# validator rejects it rather than following it.
env -u COURSE_HUB_AUTH_TOKEN rsync -a -- \
  "${package_dir}/manifest.json" \
  "${package_dir}/source-coverage.json" \
  "${package_dir}/qa-report.json" \
  "${package_dir}/checksums.sha256" \
  "${package_dir}/README.md" \
  "${snapshot_dir}/"

for fixed_file in manifest.json source-coverage.json qa-report.json checksums.sha256 README.md; do
  if [[ ! -f "${snapshot_dir}/${fixed_file}" || -L "${snapshot_dir}/${fixed_file}" ]]; then
    printf 'Snapshot root file is missing or became a symlink: %s\n' "${fixed_file}" >&2
    exit 1
  fi
done

# Copy the site directory as one archive source without a trailing slash. If a
# concurrent writer swaps site/ for a symlink, rsync preserves the link itself
# and the second validator rejects it; it does not follow an arbitrary target.
env -u COURSE_HUB_AUTH_TOKEN rsync -a -- \
  "${package_dir}/site" "${snapshot_dir}/"

# Emit a NUL-delimited rsync list from the already-frozen root metadata. Test
# receipts and checksum-declared evidence outside site/ are copied individually.
# The parser repeats strict path containment so even a concurrent malicious
# manifest edit cannot make rsync leave the package.
env -u COURSE_HUB_AUTH_TOKEN python3 - \
  "${snapshot_dir}/manifest.json" \
  "${snapshot_dir}/checksums.sha256" \
  >"${snapshot_list_file}" <<'PY'
import json
import re
import sys
from pathlib import PurePosixPath

manifest_path, checksums_path = sys.argv[1:]
with open(manifest_path, "r", encoding="utf-8") as handle:
    manifest = json.load(handle)

fixed = {
    "manifest.json",
    "source-coverage.json",
    "qa-report.json",
    "checksums.sha256",
    "README.md",
}
paths = set()

def add_path(value: object, label: str) -> None:
    if not isinstance(value, str) or not value or "\\" in value:
        raise SystemExit(f"unsafe {label} path in frozen snapshot metadata")
    if any(ord(character) < 32 for character in value):
        raise SystemExit(f"unsafe {label} path in frozen snapshot metadata")
    pure = PurePosixPath(value)
    if pure.is_absolute() or value.startswith("./") or any(
        part in {"", ".", ".."} for part in pure.parts
    ):
        raise SystemExit(f"unsafe {label} path in frozen snapshot metadata: {value}")
    normalized = pure.as_posix()
    if normalized not in fixed and not normalized.startswith("site/"):
        paths.add(normalized)

tests = manifest.get("tests")
if not isinstance(tests, list):
    raise SystemExit("frozen manifest tests must be an array")
for index, test in enumerate(tests):
    if not isinstance(test, dict):
        raise SystemExit(f"frozen manifest tests[{index}] must be an object")
    add_path(test.get("evidence"), f"tests[{index}].evidence")

checksum_pattern = re.compile(r"^[0-9a-fA-F]{64} [ *](.+)$")
with open(checksums_path, "r", encoding="utf-8") as handle:
    for number, raw_line in enumerate(handle, 1):
        line = raw_line.rstrip("\r\n")
        if not line.strip():
            continue
        match = checksum_pattern.fullmatch(line)
        if match is None:
            raise SystemExit(f"invalid frozen checksums line {number}")
        add_path(match.group(1), f"checksums line {number}")

for path in sorted(paths):
    sys.stdout.buffer.write(path.encode("utf-8") + b"\0")
PY

# --files-from intentionally suppresses archive mode's implied recursion. Every
# listed item was a regular file during the first validation; if one races into
# a directory, the snapshot cannot recursively ingest an undeclared subtree and
# the second validator rejects the resulting non-file.
env -u COURSE_HUB_AUTH_TOKEN rsync -aR --from0 \
  --files-from="${snapshot_list_file}" \
  "${package_dir}/" "${snapshot_dir}/"

# All deploy metadata is deliberately replaced by the snapshot validation
# result. Every later source path, digest, default release ID, and uploaded
# manifest therefore belongs to one immutable local tree.
metadata="$(env -u COURSE_HUB_AUTH_TOKEN python3 "${validator}" "${snapshot_dir}" --emit-tsv)"
IFS=$'\t' read -r course_id slug route build_dir entrypoint package_sha256 <<EOF
${metadata}
EOF
if [[ -z "${course_id}" || -z "${slug}" || -z "${route}" || -z "${package_sha256}" ]]; then
  printf 'Validator returned incomplete deployment metadata.\n' >&2
  exit 1
fi

source_dir="${snapshot_dir}/${build_dir}"
manifest_path="${snapshot_dir}/manifest.json"
inventory_path="${source_dir}/materials/source-inventory.json"
deploy_root="/srv/learning-hub/courses/${slug}"

# Freeze the exact set of public teacher-original URLs that must work after
# activation. The package validator has already checked the inventory schema,
# course identity, URL containment, file bytes, and SHA-256 values; this small
# parser repeats the URL boundary before those values are used by curl.
inventory_url_list_file="$(mktemp "${TMPDIR:-/tmp}/course-package-original-urls.XXXXXX")"
env -u COURSE_HUB_AUTH_TOKEN python3 - \
  "${inventory_path}" "${route}" >"${inventory_url_list_file}" <<'PY'
import json
import sys
import urllib.parse
from pathlib import PurePosixPath

inventory_path, course_route = sys.argv[1:]
with open(inventory_path, "r", encoding="utf-8") as handle:
    inventory = json.load(handle)

for index, material in enumerate(inventory.get("materials", [])):
    if material.get("sourceStatus") != "published-original":
        continue
    value = material.get("originalUrl")
    if not isinstance(value, str) or not value.startswith(course_route):
        raise SystemExit(f"unsafe published-original URL at materials[{index}]")
    decoded = value
    for _ in range(8):
        next_decoded = urllib.parse.unquote(decoded, errors="strict")
        if next_decoded == decoded:
            break
        decoded = next_decoded
    else:
        raise SystemExit(f"excessively encoded URL at materials[{index}]")
    relative = decoded[len(course_route):]
    parts = relative.split("/")
    pure = PurePosixPath(relative)
    if (
        not relative
        or any(ord(character) < 32 for character in decoded)
        or "\\" in decoded
        or "?" in decoded
        or "#" in decoded
        or decoded.startswith("//")
        or any(part in {"", ".", ".."} for part in parts)
        or pure.is_absolute()
        or any(part in {".", ".."} for part in pure.parts)
    ):
        raise SystemExit(f"unsafe published-original URL at materials[{index}]")
    sys.stdout.buffer.write(value.encode("utf-8") + b"\0")
PY

# Seal only after the validator has finished reading. The random 0700 parent
# plus read-only descendants prevents accidental edits by the deploy process;
# cleanup later restores directory write permission for this exact temp tree.
find "${snapshot_dir}" -type f -exec chmod 0444 {} +
find "${snapshot_dir}" -type d -exec chmod 0555 {} +

if [[ -z "${release_id}" ]]; then
  # Content-addressed by default so rerunning the same interrupted 200 MB
  # handoff selects the same .incoming directory and actually resumes it.
  release_id="pkg-${package_sha256}"
fi
if [[ ! "${release_id}" =~ ^[A-Za-z0-9._-]+$ ]]; then
  printf 'Release ID may contain only letters, digits, dot, underscore, and dash.\n' >&2
  exit 2
fi

is_external_https_origin() {
  local authority
  [[ "$1" == https://* ]] || return 1
  authority="${1#https://}"
  authority="${authority%%/*}"
  case "${authority}" in
    localhost|localhost:*|127.0.0.1|127.0.0.1:*|'[::1]'|'[::1]':*) return 1 ;;
    *) return 0 ;;
  esac
}

if is_external_https_origin "${origin}" && [[ -z "${COURSE_HUB_AUTH_TOKEN:-}" ]]; then
  printf 'Private external HTTPS verification requires COURSE_HUB_AUTH_TOKEN; no remote change was made.\n' >&2
  exit 2
fi
if [[ "${COURSE_HUB_AUTH_TOKEN:-}" == *$'\n'* || "${COURSE_HUB_AUTH_TOKEN:-}" == *$'\r'* ]]; then
  printf 'COURSE_HUB_AUTH_TOKEN must not contain a newline; no remote change was made.\n' >&2
  exit 2
fi

# Different course IDs get different locks and can deploy concurrently. The
# same course is serialized on the central operator host to avoid last-writer
# ambiguity. An abandoned lock is intentionally not deleted automatically.
umask 077
lock_dir="${TMPDIR:-/tmp}/course-hub-deploy-${slug}.lock"
if ! mkdir "${lock_dir}" 2>/dev/null; then
  lock_pid="$(sed -n '1p' "${lock_dir}/pid" 2>/dev/null || true)"
  printf 'Another %s deployment is active (lock %s, pid %s).\n' \
    "${course_id}" "${lock_dir}" "${lock_pid:-unknown}" >&2
  exit 1
fi
lock_acquired="1"
printf '%s\n' "$$" >"${lock_dir}/pid"

remote_state="$(env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
  "${deploy_root}" "${release_id}" "${slug}" "${entrypoint}" \
  "${package_sha256}" <<'REMOTE_PREPARE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
slug="$3"
entrypoint="$4"
package_sha256="$5"
final_dir="${deploy_root}/releases/${release_id}"
incoming_dir="${deploy_root}/releases/.incoming-${release_id}"

mkdir -p "${deploy_root}/releases"
if [[ -d "${final_dir}" ]]; then
  [[ -f "${final_dir}/${slug}/${entrypoint}" ]]
  [[ "$(cat "${final_dir}/.delivery/package-sha256" 2>/dev/null || true)" == "${package_sha256}" ]]
  printf 'existing\n'
elif [[ -d "${incoming_dir}" ]]; then
  if [[ "$(cat "${incoming_dir}/.delivery/package-sha256" 2>/dev/null || true)" != "${package_sha256}" ]]; then
    printf 'Incoming release belongs to a different package digest: %s\n' "${incoming_dir}" >&2
    exit 1
  fi
  mkdir -p "${incoming_dir}/${slug}" "${incoming_dir}/.delivery"
  printf 'resume\n'
elif [[ -e "${incoming_dir}" ]]; then
  printf 'Incoming release path exists but is not a directory: %s\n' "${incoming_dir}" >&2
  exit 1
else
  mkdir -p "${incoming_dir}/${slug}" "${incoming_dir}/.delivery"
  umask 077
  printf '%s\n' "${package_sha256}" >"${incoming_dir}/.delivery/package-sha256"
  printf 'upload\n'
fi
REMOTE_PREPARE
)"

# A matching .incoming directory is a resumable upload, not a failed release.
# rsync keeps interrupted file fragments in a reserved directory and protects
# it from --delete. Only a zero-exit rsync is followed by partial cleanup.
if [[ "${remote_state}" == "upload" || "${remote_state}" == "resume" ]]; then
  env -u COURSE_HUB_AUTH_TOKEN rsync -a --delete --partial \
    --partial-dir=.rsync-partial --exclude='.rsync-partial/' \
    "${source_dir}/" \
    "${target}:${deploy_root}/releases/.incoming-${release_id}/${slug}/"
  env -u COURSE_HUB_AUTH_TOKEN rsync -a \
    "${manifest_path}" \
    "${target}:${deploy_root}/releases/.incoming-${release_id}/.delivery/manifest.json"

  # Successful rsync means every current source file is complete. Remove only
  # its reserved partial directories (including stale fragments for files no
  # longer in the source), then assert none can enter the immutable release.
  env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
    "${deploy_root}" "${release_id}" "${slug}" <<'REMOTE_CLEAN_PARTIALS'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
slug="$3"
incoming_site="${deploy_root}/releases/.incoming-${release_id}/${slug}"

while IFS= read -r -d '' partial_dir; do
  find "${partial_dir}" -mindepth 1 -delete
  rmdir "${partial_dir}"
done < <(find "${incoming_site}" -type d -name .rsync-partial -print0)

if find "${incoming_site}" -type d -name .rsync-partial -print -quit | grep -q .; then
  printf 'Rsync partial data remains after a successful upload.\n' >&2
  exit 1
fi
REMOTE_CLEAN_PARTIALS
elif [[ "${remote_state}" != "existing" ]]; then
  printf 'Unexpected server preparation response: %s\n' "${remote_state}" >&2
  exit 1
fi

env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
  "${deploy_root}" "${release_id}" "${slug}" "${route}" \
  "${entrypoint}" "${package_sha256}" "${course_id}" <<'REMOTE_ACTIVATE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
slug="$3"
route="$4"
entrypoint="$5"
package_sha256="$6"
course_id="$7"
final_dir="${deploy_root}/releases/${release_id}"
incoming_dir="${deploy_root}/releases/.incoming-${release_id}"
current_link="${deploy_root}/current"
next_link="${deploy_root}/.current-next-${release_id}"
rollback_state="${deploy_root}/.rollback-${release_id}"
rollback_state_tmp="${rollback_state}.tmp.$$"
lock_file="${deploy_root}/.deploy.lock"

command -v flock >/dev/null 2>&1
exec 9>"${lock_file}"
flock -x 9

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
  [[ -f "${incoming_dir}/${slug}/${entrypoint}" ]]
  [[ "$(cat "${incoming_dir}/.delivery/package-sha256")" == "${package_sha256}" ]]
  if find "${incoming_dir}/${slug}" -type d -name .rsync-partial -print -quit | grep -q .; then
    printf 'Refusing activation while rsync partial data remains.\n' >&2
    exit 1
  fi
  find "${incoming_dir}" -type d -exec chmod 0755 {} +
  find "${incoming_dir}" -type f -exec chmod 0644 {} +
  mv "${incoming_dir}" "${final_dir}"
fi
[[ -f "${final_dir}/${slug}/${entrypoint}" ]]
[[ "$(cat "${final_dir}/.delivery/package-sha256")" == "${package_sha256}" ]]

previous_target="$(readlink "${current_link}" 2>/dev/null || true)"
if [[ -n "${previous_target}" && ! "${previous_target}" =~ ^releases/[A-Za-z0-9._-]+$ ]]; then
  printf 'Refusing activation because current is unmanaged: %s\n' "${previous_target}" >&2
  exit 1
fi
umask 077
printf '%s\n' "${previous_target}" >"${rollback_state_tmp}"
mv -f "${rollback_state_tmp}" "${rollback_state}"
ln -sfnT "releases/${release_id}" "${next_link}"
mv -Tf "${next_link}" "${current_link}"

page_html="$(curl -fsS --max-time 10 -H 'Host: localhost' "http://127.0.0.1:8080${route}" || true)"
if ! grep -Eiq '<!doctype|<html' <<<"${page_html}"; then
  printf 'Server-local course check failed; restoring previous release.\n' >&2
  restore_previous "${previous_target}"
  rm -f -- "${rollback_state}"
  exit 1
fi

inventory_json="$(curl -fsS --max-time 10 -H 'Host: localhost' \
  "http://127.0.0.1:8080${route}materials/source-inventory.json" || true)"
if ! grep -Eq '"schemaVersion"[[:space:]]*:[[:space:]]*"course-materials/v1"' \
    <<<"${inventory_json}" \
  || ! grep -Eq '"code"[[:space:]]*:[[:space:]]*"'"${course_id}"'"' \
    <<<"${inventory_json}" \
  || ! grep -Eq '"slug"[[:space:]]*:[[:space:]]*"'"${slug}"'"' \
    <<<"${inventory_json}"; then
  printf 'Server-local source inventory check failed; restoring previous release.\n' >&2
  restore_previous "${previous_target}"
  rm -f -- "${rollback_state}"
  exit 1
fi
printf 'Activated %s release %s\n' "${slug}" "${release_id}"
REMOTE_ACTIVATE

curl_flags=(--fail --silent --show-error --location --max-time 20 --retry 2)
if [[ -n "${COURSE_HUB_AUTH_TOKEN:-}" ]]; then
  auth_header_file="$(mktemp "${TMPDIR:-/tmp}/course-hub-curl-header.XXXXXX")"
  chmod 0600 "${auth_header_file}"
  printf 'Authorization: Bearer %s\n' "${COURSE_HUB_AUTH_TOKEN}" >"${auth_header_file}"
  unset COURSE_HUB_AUTH_TOKEN
  curl_flags+=(--header "@${auth_header_file}")
fi

external_ok="1"
health_body="$(curl "${curl_flags[@]}" "${origin}/healthz" 2>/dev/null || true)"
if [[ "${health_body}" != "ok" ]]; then
  printf 'External /healthz check failed.\n' >&2
  external_ok="0"
fi
page_html="$(curl "${curl_flags[@]}" "${origin}${route}" 2>/dev/null || true)"
if ! grep -Eiq '<!doctype|<html' <<<"${page_html}"; then
  printf 'External course page check failed: %s%s\n' "${origin}" "${route}" >&2
  external_ok="0"
fi

external_inventory_file="$(mktemp "${TMPDIR:-/tmp}/course-package-external-inventory.XXXXXX")"
chmod 0600 "${external_inventory_file}"
if ! curl "${curl_flags[@]}" --output "${external_inventory_file}" \
  "${origin}${route}materials/source-inventory.json" 2>/dev/null; then
  printf 'External source inventory request failed: %s%smaterials/source-inventory.json\n' \
    "${origin}" "${route}" >&2
  external_ok="0"
elif ! cmp -s "${inventory_path}" "${external_inventory_file}"; then
  printf 'External source inventory does not match the validated package.\n' >&2
  external_ok="0"
fi

# Deliberately perform a GET (not HEAD) for every published teacher original.
# The bearer token remains only in the mode-0600 curl header file and is never
# interpolated into a command argument, URL, diagnostic, or deployment receipt.
while IFS= read -r -d '' original_url; do
  if ! curl "${curl_flags[@]}" --output /dev/null \
    "${origin}${original_url}" 2>/dev/null; then
    printf 'External original-material GET failed: %s\n' "${original_url}" >&2
    external_ok="0"
  fi
done <"${inventory_url_list_file}"

if [[ "${external_ok}" != "1" ]]; then
  printf 'External smoke test failed; restoring the prior release.\n' >&2
  if ! env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
    "${deploy_root}" "${release_id}" "${slug}" "${route}" <<'REMOTE_ROLLBACK'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
slug="$3"
route="$4"
current_link="${deploy_root}/current"
rollback_state="${deploy_root}/.rollback-${release_id}"
expected_target="releases/${release_id}"
exec 9>"${deploy_root}/.deploy.lock"
flock -x 9

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
if [[ -n "${previous_target}" ]]; then
  page_html="$(curl -fsS --max-time 10 -H 'Host: localhost' "http://127.0.0.1:8080${route}" || true)"
  grep -Eiq '<!doctype|<html' <<<"${page_html}"
fi
printf 'Restored previous %s release: %s\n' "${slug}" "${previous_target:-none}"
REMOTE_ROLLBACK
  then
    printf 'Automatic rollback could not be verified; inspect %s immediately.\n' "${course_id}" >&2
  fi
  exit 1
fi

env -u COURSE_HUB_AUTH_TOKEN ssh "${target}" bash -s -- \
  "${deploy_root}" "${release_id}" <<'REMOTE_FINALIZE'
set -Eeuo pipefail
deploy_root="$1"
release_id="$2"
current_link="${deploy_root}/current"
rollback_state="${deploy_root}/.rollback-${release_id}"
expected_target="releases/${release_id}"
exec 9>"${deploy_root}/.deploy.lock"
flock -x 9
[[ "$(readlink "${current_link}" 2>/dev/null || true)" == "${expected_target}" ]]
rm -f -- "${rollback_state}"
REMOTE_FINALIZE

printf 'DEPLOYED %s %s%s release=%s sha256=%s\n' \
  "${course_id}" "${origin}" "${route}" "${release_id}" "${package_sha256}"
