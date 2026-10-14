#!/usr/bin/env python3
"""Validate one course-package/v1 handoff before central deployment.

The validator is dependency-free and deliberately does not execute commands
declared by an untrusted handoff package. It validates their recorded receipts;
the coordinator may independently rerun reviewed commands afterwards.
"""

from __future__ import annotations

import argparse
import copy
import datetime as dt
import hashlib
import importlib.util
import json
import os
import re
import stat
import sys
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Any, Iterable


MANIFEST_SCHEMA = "course-package/v1"
REGISTRY_SCHEMA = "allowed-courses/v1"
PACKAGE_HASH_FIELD = "packageSha256"

INVENTORY_FIELDS = (
    "sourceFiles",
    "slideDecks",
    "originalSlides",
    "translationExplanationSlides",
    "assessmentFiles",
    "assessmentItems",
    "learningNodes",
)
QA_PASS_STATUSES = {
    "pass",
    "passed",
    "pass_with_notes",
    "passed_with_notes",
}
COVERAGE_PAIRS = (
    ("sourceFilesMapped", "sourceFilesTotal", "sourceFiles"),
    ("originalSlidesMapped", "originalSlidesTotal", "originalSlides"),
    ("assessmentItemsMapped", "assessmentItemsTotal", "assessmentItems"),
)
FIXED_FILES = {
    "site": "site/",
    "coverage": "source-coverage.json",
    "qa": "qa-report.json",
    "checksums": "checksums.sha256",
    "readme": "README.md",
}
ALLOWED_MANIFEST_KEYS = {
    "schemaVersion",
    "course",
    "artifact",
    "build",
    "inventory",
    "coverage",
    "files",
    "tests",
    "rights",
    "limitations",
    PACKAGE_HASH_FIELD,
}
FORBIDDEN_NAMES = {
    ".env",
    ".netrc",
    ".npmrc",
    "credentials.json",
    "id_rsa",
    "id_ed25519",
    "api-token",
    "site-password",
    ".course-hub.htpasswd",
}
FORBIDDEN_SUFFIXES = {".pem", ".key", ".p12", ".pfx"}
RESERVED_DELIVERY_NAMES = {".rsync-partial"}
SECRET_PATTERNS: tuple[tuple[str, re.Pattern[bytes]], ...] = (
    (
        "private key",
        re.compile(rb"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"),
    ),
    ("AWS access key", re.compile(rb"\bAKIA[0-9A-Z]{16}\b")),
    ("GitHub token", re.compile(rb"\bgh[pousr]_[A-Za-z0-9]{20,}\b")),
    ("Google API key", re.compile(rb"\bAIza[0-9A-Za-z_-]{30,}\b")),
    ("Slack token", re.compile(rb"\bxox[baprs]-[0-9A-Za-z-]{16,}\b")),
    (
        "course hub token assignment",
        re.compile(
            rb"COURSE_HUB_AUTH_TOKEN\s*=\s*(?![\"']?(?:<[^>]+>|\$\{|\$[A-Za-z_]))[\"']?[A-Za-z0-9._~+/-]{12,}",
            re.IGNORECASE,
        ),
    ),
    (
        "literal password or secret assignment",
        re.compile(
            rb"\b(?:password|passwd|api[_-]?key|auth[_-]?token|access[_-]?token|client[_-]?secret)\b\s*[:=]\s*[\"']?(?!<|\$|REDACTED|CHANGEME|example|placeholder)[^\s\"'<>]{8,}",
            re.IGNORECASE,
        ),
    ),
    ("embedded URL credential", re.compile(rb"https?://[^\s/:@]+:[^\s/@]+@", re.I)),
)


class ValidationError(Exception):
    def __init__(self, errors: Iterable[str]):
        self.errors = list(errors)
        super().__init__("\n".join(self.errors))


@dataclass(frozen=True)
class ValidationResult:
    package_dir: Path
    course_id: str
    slug: str
    route: str
    build_dir: str
    entrypoint: str
    package_sha256: str
    file_count: int


def _load_json(path: Path, label: str, errors: list[str]) -> Any:
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        errors.append(f"{label} is missing: {path}")
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        errors.append(f"{label} is not valid UTF-8 JSON: {path}: {exc}")
    return None


def _object(value: Any, field: str, errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"{field} must be an object")
        return {}
    return value


def _reject_unknown_keys(
    value: dict[str, Any], allowed: set[str], field: str, errors: list[str]
) -> None:
    unknown = sorted(set(value).difference(allowed))
    if unknown:
        errors.append(f"{field} contains unsupported fields: {', '.join(unknown)}")


def _nonempty_string(value: Any, field: str, errors: list[str], limit: int = 2000) -> str:
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{field} must be a non-empty string")
        return ""
    if len(value) > limit or any(ord(character) < 32 and character not in "\t" for character in value):
        errors.append(f"{field} contains unsupported characters or is too long")
        return ""
    return value


def _safe_relative_path(value: Any, field: str, errors: list[str]) -> str | None:
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{field} must be a non-empty relative POSIX path")
        return None
    if "\\" in value or any(ord(character) < 32 for character in value):
        errors.append(f"{field} contains unsupported path characters")
        return None
    pure = PurePosixPath(value)
    if pure.is_absolute() or value.startswith("./") or any(
        part in {"", ".", ".."} for part in pure.parts
    ):
        errors.append(f"{field} must not be absolute or contain dot traversal: {value}")
        return None
    return pure.as_posix()


def _inside(package_dir: Path, relative: str, field: str, errors: list[str]) -> Path:
    candidate = package_dir.joinpath(*PurePosixPath(relative).parts)
    try:
        candidate.resolve(strict=False).relative_to(package_dir.resolve())
    except ValueError:
        errors.append(f"{field} escapes the package directory: {relative}")
    return candidate


def _tree_files(root_dir: Path, package_dir: Path, errors: list[str]) -> list[Path]:
    """Return regular files in one declared contract tree, rejecting links."""

    files: list[Path] = []
    if root_dir.is_symlink():
        errors.append(
            f"symbolic links are not allowed in a handoff package: {root_dir.relative_to(package_dir).as_posix()}"
        )
        return files
    if not root_dir.is_dir():
        return files
    for root, directory_names, file_names in os.walk(root_dir, followlinks=False):
        root_path = Path(root)
        for name in list(directory_names):
            if name in RESERVED_DELIVERY_NAMES:
                relative = (root_path / name).relative_to(package_dir).as_posix()
                errors.append(f"deployment-internal path is forbidden in site/: {relative}")
                directory_names.remove(name)
        for name in file_names:
            if name in RESERVED_DELIVERY_NAMES:
                relative = (root_path / name).relative_to(package_dir).as_posix()
                errors.append(f"deployment-internal path is forbidden in site/: {relative}")
        for name in sorted(directory_names + file_names):
            path = root_path / name
            try:
                mode = path.lstat().st_mode
            except OSError as exc:
                errors.append(f"cannot inspect package path {path}: {exc}")
                continue
            relative = path.relative_to(package_dir).as_posix()
            if stat.S_ISLNK(mode):
                errors.append(f"symbolic links are not allowed in a handoff package: {relative}")
            elif stat.S_ISREG(mode):
                files.append(path)
            elif not stat.S_ISDIR(mode):
                errors.append(f"special files are not allowed in a handoff package: {relative}")
    return sorted(set(files), key=lambda path: path.relative_to(package_dir).as_posix())


def _forbidden_name(path: Path, package_dir: Path) -> str | None:
    for part in path.relative_to(package_dir).parts:
        lower = part.lower()
        if lower in FORBIDDEN_NAMES or lower.startswith(".env."):
            return part
        if Path(lower).suffix in FORBIDDEN_SUFFIXES:
            return part
    return None


def _scan_for_secrets(files: list[Path], package_dir: Path, errors: list[str]) -> None:
    for path in files:
        relative = path.relative_to(package_dir).as_posix()
        if _forbidden_name(path, package_dir):
            errors.append(f"credential-like file name is forbidden: {relative}")
            continue
        try:
            with path.open("rb") as handle:
                first = handle.read(1024 * 1024)
                if b"\x00" in first[:4096]:
                    continue
                previous = b""
                block = first
                while block:
                    sample = previous + block
                    for label, pattern in SECRET_PATTERNS:
                        if pattern.search(sample):
                            errors.append(f"possible {label} found in package file: {relative}")
                            block = b""
                            break
                    else:
                        previous = sample[-512:]
                        block = handle.read(1024 * 1024)
                        continue
                    break
        except OSError as exc:
            errors.append(f"cannot scan package file {relative}: {exc}")


def _canonical_manifest(manifest: dict[str, Any]) -> bytes:
    canonical = copy.deepcopy(manifest)
    canonical.pop(PACKAGE_HASH_FIELD, None)
    return json.dumps(
        canonical, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")


def compute_package_sha256(
    package_dir: Path,
    manifest: dict[str, Any],
    files: list[Path],
    checksums_relative: str,
) -> str:
    """Compute a stable package digest without self-reference.

    It covers the canonical manifest without packageSha256 and every regular
    file except manifest.json and checksums.sha256. The checksum inventory is
    excluded because it contains the digest of the final manifest itself.
    """

    digest = hashlib.sha256()
    digest.update(b"course-package/v1\0")
    manifest_bytes = _canonical_manifest(manifest)
    digest.update(b"manifest\0")
    digest.update(str(len(manifest_bytes)).encode("ascii"))
    digest.update(b"\0")
    digest.update(manifest_bytes)
    digest.update(b"\0")
    excluded = {"manifest.json", checksums_relative}
    for path in files:
        relative = path.relative_to(package_dir).as_posix()
        if relative in excluded:
            continue
        size = path.stat().st_size
        digest.update(b"file\0")
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        digest.update(str(size).encode("ascii"))
        digest.update(b"\0")
        with path.open("rb") as handle:
            for block in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(block)
        digest.update(b"\0")
    return digest.hexdigest()


def _validate_checksums(
    checksum_path: Path,
    checksum_relative: str,
    package_dir: Path,
    required_files: list[Path],
    errors: list[str],
) -> list[Path]:
    try:
        lines = checksum_path.read_text(encoding="utf-8").splitlines()
    except (OSError, UnicodeDecodeError) as exc:
        errors.append(f"checksums.sha256 is unreadable: {exc}")
        return required_files
    pattern = re.compile(r"^([0-9a-fA-F]{64}) [ *](.+)$")
    declared: dict[str, str] = {}
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        match = pattern.match(line)
        if not match:
            errors.append(f"invalid checksums.sha256 line {number}: {line!r}")
            continue
        relative = _safe_relative_path(match.group(2), f"checksums line {number}", errors)
        if relative is None:
            continue
        if relative == checksum_relative:
            errors.append("checksums.sha256 must exclude itself")
            continue
        if relative in declared:
            errors.append(f"duplicate checksum path: {relative}")
            continue
        declared[relative] = match.group(1).lower()

    required_paths = {
        path.relative_to(package_dir).as_posix()
        for path in required_files
        if path.relative_to(package_dir).as_posix() != checksum_relative
    }
    missing = sorted(required_paths.difference(declared))
    if missing:
        preview = ", ".join(missing[:5])
        suffix = "" if len(missing) <= 5 else f" (+{len(missing) - 5} more)"
        errors.append(f"checksums.sha256 does not cover the contract surface: {preview}{suffix}")

    declared_files: list[Path] = []
    for relative, expected in declared.items():
        path = _inside(package_dir, relative, "checksum path", errors)
        if not path.is_file() or path.is_symlink():
            errors.append(f"checksum references a missing/non-regular file: {relative}")
            continue
        declared_files.append(path)
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual != expected:
            errors.append(f"SHA-256 mismatch for {relative}: expected {expected}, got {actual}")
    return sorted(
        set(required_files + declared_files),
        key=lambda path: path.relative_to(package_dir).as_posix(),
    )


def _validate_iso8601(value: Any, field: str, errors: list[str]) -> None:
    text = _nonempty_string(value, field, errors, 100)
    if not text:
        return
    try:
        parsed = dt.datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        errors.append(f"{field} must be an ISO-8601 timestamp")
        return
    if parsed.tzinfo is None:
        errors.append(f"{field} must include an explicit timezone")


def _validate_qa_report(path: Path, errors: list[str]) -> None:
    report = _load_json(path, "qa-report.json", errors)
    if not isinstance(report, dict):
        if report is not None:
            errors.append("qa-report.json must be a JSON object")
        return
    for section in ("mechanical", "content"):
        value = report.get(section)
        if not isinstance(value, dict) or not value:
            errors.append(
                f"qa-report.json must contain a non-empty {section} object"
            )
            continue
        status = value.get("status")
        if not isinstance(status, str) or not status.strip():
            errors.append(
                f"qa-report.json {section}.status must declare a passing status"
            )
            continue
        normalized_status = re.sub(r"[^a-z0-9]+", "_", status.strip().lower()).strip("_")
        if normalized_status not in QA_PASS_STATUSES:
            errors.append(
                f"qa-report.json {section}.status must be a deployable pass status; "
                f"got {status!r}"
            )


def _validate_coverage_report(path: Path, expected_count: int, errors: list[str]) -> None:
    report = _load_json(path, "source-coverage.json", errors)
    if not isinstance(report, (dict, list)):
        errors.append("source-coverage.json must be a JSON object or array")
        return
    items: Any = report if isinstance(report, list) else None
    if isinstance(report, dict):
        for key in ("items", "sources", "files", "records", "mappings"):
            if isinstance(report.get(key), list):
                items = report[key]
                break
    if expected_count > 0 and (not isinstance(items, list) or len(items) < expected_count):
        errors.append(
            "source-coverage.json must contain itemized source records matching inventory.sourceFiles"
        )


def _validate_material_inventory_contract(
    package_dir: Path,
    course_id: str,
    slug: str,
    route: str,
    errors: list[str],
) -> None:
    inventory_path = package_dir / "site" / "materials" / "source-inventory.json"
    if not inventory_path.is_file() or inventory_path.is_symlink():
        errors.append(
            "site/materials/source-inventory.json is required for the course hub material radar"
        )
        return

    validator_path = (
        Path(__file__).resolve().parents[1]
        / "material-inventory"
        / "validate_material_inventory.py"
    )
    try:
        spec = importlib.util.spec_from_file_location(
            "_central_material_inventory_validator", validator_path
        )
        if spec is None or spec.loader is None:
            raise RuntimeError("could not create module spec")
        module = importlib.util.module_from_spec(spec)
        sys.modules[spec.name] = module
        spec.loader.exec_module(module)
        result = module.validate_inventory(inventory_path)
    except Exception as exc:  # The inventory module owns detailed validation errors.
        detail_errors = getattr(exc, "errors", None)
        if isinstance(detail_errors, list):
            errors.extend(
                f"site/materials/source-inventory.json: {detail}"
                for detail in detail_errors
            )
        else:
            errors.append(f"material inventory validator failed: {exc}")
        return

    if (result.course_code, result.slug, result.route) != (course_id, slug, route):
        errors.append(
            "site/materials/source-inventory.json course identity must exactly match manifest.course"
        )


def validate_package(package_dir: Path, registry_path: Path | None = None) -> ValidationResult:
    errors: list[str] = []
    package_dir = package_dir.expanduser().resolve()
    if not package_dir.is_dir():
        raise ValidationError([f"package directory does not exist: {package_dir}"])

    integration_dir = Path(__file__).resolve().parent
    registry_path = (registry_path or integration_dir / "allowed-courses.json").resolve()
    registry = _load_json(registry_path, "course registry", errors)
    manifest = _load_json(package_dir / "manifest.json", "manifest", errors)
    if errors or not isinstance(registry, dict) or not isinstance(manifest, dict):
        raise ValidationError(errors or ["registry and manifest must be JSON objects"])

    if registry.get("schemaVersion") != REGISTRY_SCHEMA:
        errors.append(f"course registry schemaVersion must be {REGISTRY_SCHEMA}")
    courses = registry.get("courses")
    if not isinstance(courses, dict):
        errors.append("course registry must contain a courses object")
        courses = {}
    if manifest.get("schemaVersion") != MANIFEST_SCHEMA:
        errors.append(f"manifest schemaVersion must be {MANIFEST_SCHEMA}")
    _reject_unknown_keys(manifest, ALLOWED_MANIFEST_KEYS, "manifest", errors)

    course = _object(manifest.get("course"), "course", errors)
    _reject_unknown_keys(course, {"code", "nameZh", "nameEn", "slug", "route"}, "course", errors)
    course_id = course.get("code")
    if not isinstance(course_id, str) or course_id not in courses:
        errors.append(f"unknown course.code: {course_id!r}")
        course_id = ""
        registered: dict[str, Any] = {}
    else:
        registered = courses[course_id]
    for key in ("nameZh", "nameEn"):
        _nonempty_string(course.get(key), f"course.{key}", errors, 240)
    slug = course.get("slug")
    route = course.get("route")
    if slug != registered.get("slug"):
        errors.append(
            f"course.slug for {course_id or 'unknown course'} must be {registered.get('slug')!r}, got {slug!r}"
        )
    if route != registered.get("route"):
        errors.append(
            f"course.route for {course_id or 'unknown course'} must be {registered.get('route')!r}, got {route!r}"
        )
    if not isinstance(slug, str):
        slug = ""
    if not isinstance(route, str):
        route = ""

    artifact = _object(manifest.get("artifact"), "artifact", errors)
    _reject_unknown_keys(
        artifact,
        {"kind", "entry", "basePath", "apiBase", "localFallback"},
        "artifact",
        errors,
    )
    if artifact.get("kind") != "static-site":
        errors.append("artifact.kind must be 'static-site'")
    if artifact.get("entry") != "site/index.html":
        errors.append("artifact.entry must be 'site/index.html'")
    if artifact.get("basePath") != route:
        errors.append("artifact.basePath must exactly equal course.route")
    if artifact.get("apiBase") != "/api/v1":
        errors.append("artifact.apiBase must be '/api/v1'")
    if artifact.get("localFallback") is not True:
        errors.append("artifact.localFallback must be true")

    build = _object(manifest.get("build"), "build", errors)
    _reject_unknown_keys(
        build,
        {"command", "workingDirectory", "outputDir", "builtAt"},
        "build",
        errors,
    )
    _nonempty_string(build.get("command"), "build.command", errors)
    _safe_relative_path(build.get("workingDirectory"), "build.workingDirectory", errors) if build.get("workingDirectory") != "." else None
    _nonempty_string(build.get("outputDir"), "build.outputDir", errors)
    _validate_iso8601(build.get("builtAt"), "build.builtAt", errors)

    inventory = _object(manifest.get("inventory"), "inventory", errors)
    _reject_unknown_keys(inventory, set(INVENTORY_FIELDS), "inventory", errors)
    for field in INVENTORY_FIELDS:
        value = inventory.get(field)
        if not isinstance(value, int) or isinstance(value, bool) or value < 0:
            errors.append(f"inventory.{field} must be a non-negative integer")

    # A deployable course cannot honestly be represented by an all-zero shell.
    # Keep the gate content-format agnostic: a course may contain slides,
    # assessments, or both, but it must have real sources, a navigable learning
    # sequence, and at least one mapped source content unit.
    if inventory.get("sourceFiles") == 0:
        errors.append("inventory.sourceFiles must be greater than zero for deployment")
    if inventory.get("learningNodes") == 0:
        errors.append("inventory.learningNodes must be greater than zero for deployment")
    content_units = (inventory.get("originalSlides"), inventory.get("assessmentItems"))
    if all(isinstance(value, int) and not isinstance(value, bool) for value in content_units):
        if sum(content_units) == 0:
            errors.append(
                "inventory must include at least one original slide or assessment item for deployment"
            )

    coverage = _object(manifest.get("coverage"), "coverage", errors)
    _reject_unknown_keys(
        coverage,
        {field for pair in COVERAGE_PAIRS for field in pair[:2]},
        "coverage",
        errors,
    )
    for mapped_field, total_field, inventory_field in COVERAGE_PAIRS:
        mapped = coverage.get(mapped_field)
        total = coverage.get(total_field)
        if not isinstance(mapped, int) or isinstance(mapped, bool) or mapped < 0:
            errors.append(f"coverage.{mapped_field} must be a non-negative integer")
            continue
        if not isinstance(total, int) or isinstance(total, bool) or total < 0:
            errors.append(f"coverage.{total_field} must be a non-negative integer")
            continue
        if mapped != total:
            errors.append(f"coverage is incomplete: {mapped_field}={mapped}, {total_field}={total}")
        if isinstance(inventory.get(inventory_field), int) and total != inventory[inventory_field]:
            errors.append(
                f"coverage.{total_field} must equal inventory.{inventory_field}"
            )

    if coverage.get("sourceFilesTotal") == 0:
        errors.append("coverage.sourceFilesTotal must be greater than zero for deployment")
    covered_content_units = (
        coverage.get("originalSlidesTotal"),
        coverage.get("assessmentItemsTotal"),
    )
    if all(
        isinstance(value, int) and not isinstance(value, bool)
        for value in covered_content_units
    ):
        if sum(covered_content_units) == 0:
            errors.append(
                "coverage must include at least one original slide or assessment item for deployment"
            )

    file_map = _object(manifest.get("files"), "files", errors)
    _reject_unknown_keys(file_map, set(FIXED_FILES), "files", errors)
    for key, expected in FIXED_FILES.items():
        if file_map.get(key) != expected:
            errors.append(f"files.{key} must be {expected!r}")

    contract_files: list[Path] = [package_dir / "manifest.json"]
    for key, relative in FIXED_FILES.items():
        normalized = relative.rstrip("/")
        path = _inside(package_dir, normalized, f"files.{key}", errors)
        if key == "site":
            if not path.is_dir() or path.is_symlink():
                errors.append("files.site must reference the real site/ directory")
            else:
                contract_files.extend(_tree_files(path, package_dir, errors))
        elif not path.is_file() or path.is_symlink() or path.stat().st_size == 0:
            errors.append(f"files.{key} must reference a non-empty regular file: {relative}")
        else:
            contract_files.append(path)
    entry_path = package_dir / "site" / "index.html"
    if not entry_path.is_file() or entry_path.is_symlink():
        errors.append("site/index.html is missing or is not a regular file")

    tests = manifest.get("tests")
    if not isinstance(tests, list) or not tests:
        errors.append("tests must be a non-empty array")
        tests = []
    for index, test in enumerate(tests):
        prefix = f"tests[{index}]"
        if not isinstance(test, dict):
            errors.append(f"{prefix} must be an object")
            continue
        _reject_unknown_keys(test, {"name", "command", "status", "evidence"}, prefix, errors)
        _nonempty_string(test.get("name"), f"{prefix}.name", errors, 240)
        _nonempty_string(test.get("command"), f"{prefix}.command", errors)
        if test.get("status") != "passed":
            errors.append(f"{prefix}.status must be 'passed' for a deployable package")
        receipt = _safe_relative_path(test.get("evidence"), f"{prefix}.evidence", errors)
        if receipt is not None:
            receipt_path = _inside(package_dir, receipt, f"{prefix}.evidence", errors)
            if not receipt_path.is_file() or receipt_path.is_symlink() or receipt_path.stat().st_size == 0:
                errors.append(f"{prefix}.evidence must reference a non-empty regular file")
            else:
                contract_files.append(receipt_path)

    rights = _object(manifest.get("rights"), "rights", errors)
    _reject_unknown_keys(rights, {"basis", "redistribution"}, "rights", errors)
    _nonempty_string(rights.get("basis"), "rights.basis", errors)
    if rights.get("redistribution") not in {"course-site-only", "restricted", "unknown"}:
        errors.append(
            "rights.redistribution must be course-site-only, restricted, or unknown"
        )
    limitations = manifest.get("limitations")
    if not isinstance(limitations, list) or any(
        not isinstance(item, str) or not item.strip() for item in limitations
    ):
        errors.append("limitations must be an array of non-empty strings (or an empty array)")

    qa_path = package_dir / FIXED_FILES["qa"]
    coverage_path = package_dir / FIXED_FILES["coverage"]
    if qa_path.is_file():
        _validate_qa_report(qa_path, errors)
    if coverage_path.is_file() and isinstance(inventory.get("sourceFiles"), int):
        _validate_coverage_report(coverage_path, inventory["sourceFiles"], errors)
    _validate_material_inventory_contract(
        package_dir,
        course_id,
        slug,
        route,
        errors,
    )

    checksums_relative = FIXED_FILES["checksums"]
    checksums_path = package_dir / checksums_relative
    if checksums_path.is_file():
        contract_files = _validate_checksums(
            checksums_path,
            checksums_relative,
            package_dir,
            sorted(set(contract_files)),
            errors,
        )

    # Only the declared delivery surface is deployable and security-scanned:
    # manifest, fixed evidence/readme files, test receipts, checksum-declared
    # evidence, and site/**. Build tools, src/, and node_modules may coexist in
    # course-package/ as a rebuild workspace but are neither trusted nor copied.
    contract_files = sorted(
        set(contract_files), key=lambda path: path.relative_to(package_dir).as_posix()
    )
    _scan_for_secrets(contract_files, package_dir, errors)

    package_sha256 = compute_package_sha256(
        package_dir, manifest, contract_files, checksums_relative
    )
    declared_hash = manifest.get(PACKAGE_HASH_FIELD)
    if declared_hash is not None:
        if not isinstance(declared_hash, str) or not re.fullmatch(r"[0-9a-f]{64}", declared_hash):
            errors.append(f"{PACKAGE_HASH_FIELD} must be a lowercase 64-character SHA-256")
        elif declared_hash != package_sha256:
            errors.append(
                f"{PACKAGE_HASH_FIELD} mismatch: declared {declared_hash}, computed {package_sha256}"
            )

    if errors:
        raise ValidationError(errors)
    return ValidationResult(
        package_dir=package_dir,
        course_id=course_id,
        slug=slug,
        route=route,
        build_dir="site",
        entrypoint="index.html",
        package_sha256=package_sha256,
        file_count=len(contract_files),
    )


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate the single course-package/v1 handoff contract."
    )
    parser.add_argument("package_dir", type=Path, help="directory containing manifest.json")
    parser.add_argument("--registry", type=Path, help="override allowed-courses.json")
    parser.add_argument(
        "--emit-tsv",
        action="store_true",
        help="emit code, slug, route, build dir, entrypoint, and digest for deployment",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    try:
        result = validate_package(args.package_dir, args.registry)
    except ValidationError as exc:
        print("Course package rejected:", file=sys.stderr)
        for error in exc.errors:
            print(f"  - {error}", file=sys.stderr)
        return 1
    if args.emit_tsv:
        print(
            "\t".join(
                (
                    result.course_id,
                    result.slug,
                    result.route,
                    result.build_dir,
                    result.entrypoint,
                    result.package_sha256,
                )
            )
        )
    else:
        print(
            f"VALID {result.course_id} {result.route} "
            f"files={result.file_count} sha256={result.package_sha256}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
