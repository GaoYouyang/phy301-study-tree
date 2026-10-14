#!/usr/bin/env python3
"""Validate one or more ``course-materials/v1`` inventory files.

This validator is intentionally dependency-free.  ``schema.json`` documents
the wire format; this module enforces that format plus the cross-field and
security invariants that JSON Schema alone cannot express.
"""

from __future__ import annotations

import argparse
import collections
import datetime as dt
import hashlib
import json
import re
import sys
import urllib.parse
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Any, Iterable, Sequence


SCHEMA_VERSION = "course-materials/v1"
MAX_FUTURE_SKEW = dt.timedelta(minutes=10)
MAX_AUDIT_DATE_LEAD = dt.timedelta(days=1)

ALLOWED_COURSES = {
    "PHY301": {"slug": "phy301", "route": "/phy301/"},
    "PHY408": {"slug": "phy408", "route": "/phy408/"},
    "PHY309": {"slug": "phy309", "route": "/phy309/"},
    "MAT107": {"slug": "mat107", "route": "/mat107/"},
}

CATEGORIES = {
    "lecture",
    "syllabus",
    "assignment",
    "solution",
    "exam",
    "reference",
    "dataset",
    "code",
    "notebook",
    "other",
}
SOURCE_STATUSES = {"published-original", "indexed-no-download"}
INVENTORY_STATUSES = {
    "verified-current-upload",
    "partial-current-upload",
    "unknown",
}
GAP_STATUSES = {"expected-missing", "not-received", "not-issued", "unknown"}

ROOT_FIELDS = {
    "schemaVersion",
    "course",
    "generatedAt",
    "inventoryStatus",
    "inventoryNote",
    "summary",
    "materials",
    "knownGaps",
    "freshness",
}
COURSE_FIELDS = {"code", "slug", "route", "nameZh", "nameEn"}
SUMMARY_FIELDS = {"sourceFiles", "publishedOriginals", "totalPages", "categoryCounts"}
MATERIAL_FIELDS = {
    "id",
    "title",
    "originalFileName",
    "category",
    "format",
    "sequence",
    "pages",
    "bytes",
    "sha256",
    "sourceStatus",
    "originalUrl",
    "derivativeCount",
    "derivativeLabels",
    "note",
}
GAP_FIELDS = {"id", "label", "status", "note"}
FRESHNESS_FIELDS = {"sourceAuditDate", "suggestedReviewDays", "updateTrigger"}

SLUG_RE = re.compile(r"^[a-z0-9-]+$")
ROUTE_RE = re.compile(r"^/[a-z0-9-]+/$")
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
RFC3339_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$"
)

# These are local filesystem locations, not legitimate public site routes.
LOCAL_PATH_RE = re.compile(
    r"(?:^|[\s\"'=(])(?:"
    r"file://(?:localhost)?/|"
    r"/(?:Users|home|root|tmp|Volumes|private/(?:tmp|var)|var/(?:folders|tmp))/|"
    r"[A-Za-z]:[\\/]|"
    r"\\\\[^\\\s]+[\\/]"
    r")",
    re.IGNORECASE,
)

SENSITIVE_KEY_NAMES = {
    "password",
    "passwd",
    "pwd",
    "secret",
    "clientsecret",
    "apikey",
    "accesstoken",
    "authtoken",
    "refreshtoken",
    "privatekey",
    "credentials",
    "credential",
    "authorization",
    "cookie",
    "sessionid",
}


class DuplicateKeyError(ValueError):
    """Raised when JSON contains two members with the same name."""


class ValidationError(Exception):
    def __init__(self, errors: Iterable[str]):
        self.errors = list(errors)
        super().__init__("\n".join(self.errors))


@dataclass(frozen=True)
class ValidationResult:
    path: Path
    course_code: str
    slug: str
    route: str
    source_files: int
    published_originals: int
    total_pages: int | None


def _object_pairs_without_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise DuplicateKeyError(f"duplicate JSON field: {key}")
        result[key] = value
    return result


def _load_json(path: Path, errors: list[str]) -> Any:
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle, object_pairs_hook=_object_pairs_without_duplicates)
    except FileNotFoundError:
        errors.append(f"inventory file is missing: {path}")
    except (OSError, UnicodeDecodeError, json.JSONDecodeError, DuplicateKeyError) as exc:
        errors.append(f"inventory is not valid UTF-8 JSON: {path}: {exc}")
    return None


def _object(value: Any, field: str, errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"{field} must be an object")
        return {}
    return value


def _array(value: Any, field: str, errors: list[str]) -> list[Any]:
    if not isinstance(value, list):
        errors.append(f"{field} must be an array")
        return []
    return value


def _exact_fields(
    value: dict[str, Any], expected: set[str], field: str, errors: list[str]
) -> None:
    missing = sorted(expected.difference(value))
    unknown = sorted(set(value).difference(expected))
    if missing:
        errors.append(f"{field} is missing required fields: {', '.join(missing)}")
    if unknown:
        errors.append(f"{field} contains unsupported fields: {', '.join(unknown)}")


def _string(
    value: Any,
    field: str,
    errors: list[str],
    *,
    nonempty: bool = False,
) -> str:
    if not isinstance(value, str):
        errors.append(f"{field} must be a string")
        return ""
    if nonempty and not value:
        errors.append(f"{field} must be a non-empty string")
    return value


def _integer(
    value: Any,
    field: str,
    errors: list[str],
    *,
    minimum: int = 0,
) -> int | None:
    if isinstance(value, bool) or not isinstance(value, int):
        errors.append(f"{field} must be an integer")
        return None
    if value < minimum:
        errors.append(f"{field} must be at least {minimum}")
    return value


def _nullable_integer(value: Any, field: str, errors: list[str]) -> int | None:
    if value is None:
        return None
    return _integer(value, field, errors)


def _enum(value: Any, allowed: set[str], field: str, errors: list[str]) -> str:
    if not isinstance(value, str) or value not in allowed:
        errors.append(f"{field} must be one of: {', '.join(sorted(allowed))}")
        return ""
    return value


def _normalise_now(now: dt.datetime | None) -> dt.datetime:
    current = now or dt.datetime.now(dt.timezone.utc)
    if current.tzinfo is None:
        current = current.replace(tzinfo=dt.timezone.utc)
    return current.astimezone(dt.timezone.utc)


def _date_time(
    value: Any,
    field: str,
    errors: list[str],
    now: dt.datetime,
) -> dt.datetime | None:
    text = _string(value, field, errors, nonempty=True)
    if not text:
        return None
    if not RFC3339_RE.fullmatch(text):
        errors.append(f"{field} must be an RFC 3339 date-time with a timezone")
        return None
    try:
        parsed = dt.datetime.fromisoformat(text[:-1] + "+00:00" if text.endswith("Z") else text)
    except ValueError:
        errors.append(f"{field} is not a valid calendar date-time")
        return None
    parsed_utc = parsed.astimezone(dt.timezone.utc)
    if parsed_utc > now + MAX_FUTURE_SKEW:
        errors.append(f"{field} is too far in the future")
    return parsed_utc


def _calendar_date(
    value: Any,
    field: str,
    errors: list[str],
    now: dt.datetime,
) -> dt.date | None:
    text = _string(value, field, errors, nonempty=True)
    if not text:
        return None
    if not DATE_RE.fullmatch(text):
        errors.append(f"{field} must use YYYY-MM-DD")
        return None
    try:
        parsed = dt.date.fromisoformat(text)
    except ValueError:
        errors.append(f"{field} is not a valid calendar date")
        return None
    if parsed > now.date() + MAX_AUDIT_DATE_LEAD:
        errors.append(f"{field} is too far in the future")
    return parsed


def _safe_course_url(
    value: Any,
    field: str,
    errors: list[str],
    course_route: str,
) -> str | None:
    if not isinstance(value, str) or not value or value != value.strip():
        errors.append(
            f"{field} must be a non-empty course-root URL without surrounding whitespace"
        )
        return None
    if any(ord(character) < 32 for character in value) or "\\" in value:
        errors.append(f"{field} contains unsafe path characters")
        return None
    if "?" in value or "#" in value:
        errors.append(f"{field} must be a path without a query string or fragment")
        return None
    if re.search(r"%(?![0-9A-Fa-f]{2})", value):
        errors.append(f"{field} contains invalid percent encoding")
        return None

    decoded = value
    try:
        for _ in range(8):
            next_decoded = urllib.parse.unquote(decoded, errors="strict")
            if next_decoded == decoded:
                break
            decoded = next_decoded
        else:
            errors.append(f"{field} uses excessive nested URL encoding")
            return None
    except UnicodeDecodeError:
        errors.append(f"{field} contains invalid UTF-8 percent encoding")
        return None

    if any(ord(character) < 32 for character in decoded) or "\\" in decoded:
        errors.append(
            f"{field} must be a safe course-root URL; it contains unsafe encoded characters"
        )
        return None
    if "?" in decoded or "#" in decoded:
        errors.append(
            f"{field} must be a safe relative URL and must not hide a query or fragment"
        )
        return None

    parsed = urllib.parse.urlsplit(decoded)
    if not course_route or not decoded.startswith(course_route):
        errors.append(
            f"{field} must begin with the declared course route {course_route!r}: {value}"
        )
        return None

    route_relative = decoded[len(course_route) :]
    raw_parts = route_relative.split("/")
    pure = PurePosixPath(route_relative)
    if (
        parsed.scheme
        or parsed.netloc
        or parsed.query
        or parsed.fragment
        or decoded.startswith("//")
        or any(part in {"", ".", ".."} for part in raw_parts)
        or pure.is_absolute()
        or any(part in {".", ".."} for part in pure.parts)
    ):
        errors.append(
            f"{field} must be a safe course-root URL without traversal segments: {value}"
        )
        return None
    return value


def _plain_file_name(value: Any, field: str, errors: list[str]) -> str:
    text = _string(value, field, errors, nonempty=True)
    if text and (text in {".", ".."} or "/" in text or "\\" in text):
        errors.append(f"{field} must be a file name, not a filesystem path")
    return text


def _normalised_key(key: str) -> str:
    return re.sub(r"[^a-z0-9]", "", key.lower())


def _scan_security(value: Any, field: str, errors: list[str]) -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            child_field = f"{field}.{key}" if field else key
            if _normalised_key(key) in SENSITIVE_KEY_NAMES:
                errors.append(f"{child_field} is a forbidden sensitive field")
            _scan_security(child, child_field, errors)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _scan_security(child, f"{field}[{index}]", errors)
    elif isinstance(value, str) and LOCAL_PATH_RE.search(value):
        errors.append(f"{field} contains a local absolute filesystem path")


def _validate_course(value: Any, errors: list[str]) -> tuple[str, str, str]:
    course = _object(value, "course", errors)
    _exact_fields(course, COURSE_FIELDS, "course", errors)

    code = _string(course.get("code"), "course.code", errors, nonempty=True)
    slug = _string(course.get("slug"), "course.slug", errors, nonempty=True)
    route = _string(course.get("route"), "course.route", errors, nonempty=True)
    _string(course.get("nameZh"), "course.nameZh", errors, nonempty=True)
    _string(course.get("nameEn"), "course.nameEn", errors, nonempty=True)

    if slug and not SLUG_RE.fullmatch(slug):
        errors.append("course.slug must contain only lowercase letters, digits, and hyphens")
    if route and not ROUTE_RE.fullmatch(route):
        errors.append("course.route must be a lowercase site route ending in /")

    allowed = ALLOWED_COURSES.get(code)
    if allowed is None:
        if code:
            errors.append(f"unknown course.code: {code}")
    else:
        if slug != allowed["slug"]:
            errors.append(f"course.slug for {code} must be '{allowed['slug']}'")
        if route != allowed["route"]:
            errors.append(f"course.route for {code} must be '{allowed['route']}'")
    return code, slug, route


def _validate_material(
    value: Any,
    index: int,
    errors: list[str],
    course_route: str,
) -> dict[str, Any]:
    field = f"materials[{index}]"
    material = _object(value, field, errors)
    _exact_fields(material, MATERIAL_FIELDS, field, errors)

    material_id = _string(material.get("id"), f"{field}.id", errors, nonempty=True)
    _string(material.get("title"), f"{field}.title", errors, nonempty=True)
    _plain_file_name(
        material.get("originalFileName"),
        f"{field}.originalFileName",
        errors,
    )
    category = _enum(material.get("category"), CATEGORIES, f"{field}.category", errors)
    _string(material.get("format"), f"{field}.format", errors, nonempty=True)

    sequence = material.get("sequence")
    if sequence is not None:
        _string(sequence, f"{field}.sequence", errors)
    pages = _nullable_integer(material.get("pages"), f"{field}.pages", errors)
    _nullable_integer(material.get("bytes"), f"{field}.bytes", errors)

    sha256 = _string(material.get("sha256"), f"{field}.sha256", errors)
    if sha256 and not SHA256_RE.fullmatch(sha256):
        errors.append(f"{field}.sha256 must be exactly 64 lowercase hexadecimal characters")

    source_status = _enum(
        material.get("sourceStatus"), SOURCE_STATUSES, f"{field}.sourceStatus", errors
    )
    original_url = material.get("originalUrl")
    safe_original_url = None
    if source_status == "published-original":
        safe_original_url = _safe_course_url(
            original_url, f"{field}.originalUrl", errors, course_route
        )
    elif source_status == "indexed-no-download" and original_url is not None:
        errors.append(f"{field}.originalUrl must be null for indexed-no-download")
    elif source_status == "indexed-no-download":
        pass
    elif original_url is not None and not isinstance(original_url, str):
        errors.append(f"{field}.originalUrl must be a string or null")

    derivative_count = _integer(
        material.get("derivativeCount"), f"{field}.derivativeCount", errors
    )
    derivative_labels = _array(
        material.get("derivativeLabels"), f"{field}.derivativeLabels", errors
    )
    for label_index, label in enumerate(derivative_labels):
        _string(label, f"{field}.derivativeLabels[{label_index}]", errors)
    if derivative_count is not None and derivative_count != len(derivative_labels):
        errors.append(
            f"{field}.derivativeCount ({derivative_count}) does not match "
            f"derivativeLabels length ({len(derivative_labels)})"
        )
    _string(material.get("note"), f"{field}.note", errors)

    return {
        "id": material_id,
        "category": category,
        "pages": pages,
        "bytes": material.get("bytes"),
        "sha256": sha256,
        "sourceStatus": source_status,
        "originalUrl": safe_original_url,
    }


def _decode_course_relative_url(value: str, course_route: str) -> str:
    decoded = value
    for _ in range(8):
        next_decoded = urllib.parse.unquote(decoded, errors="strict")
        if next_decoded == decoded:
            break
        decoded = next_decoded
    return decoded[len(course_route) :]


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _validate_published_files(
    inventory_path: Path,
    course_route: str,
    material_rows: list[dict[str, Any]],
    errors: list[str],
) -> None:
    # The deployed contract always lives at <site-root>/materials/source-inventory.json.
    # Fixtures or standalone metadata stored elsewhere retain schema-only validation.
    if inventory_path.parent.name != "materials":
        return
    site_root = inventory_path.parent.parent
    try:
        resolved_root = site_root.resolve(strict=True)
    except OSError as exc:
        errors.append(f"cannot resolve inventory site root {site_root}: {exc}")
        return

    for index, row in enumerate(material_rows):
        if row["sourceStatus"] != "published-original" or not row["originalUrl"]:
            continue
        relative = _decode_course_relative_url(row["originalUrl"], course_route)
        candidate = site_root.joinpath(*PurePosixPath(relative).parts)
        try:
            resolved = candidate.resolve(strict=True)
            resolved.relative_to(resolved_root)
        except (OSError, ValueError) as exc:
            errors.append(
                f"materials[{index}].originalUrl does not resolve to a file inside "
                f"the site root: {row['originalUrl']}: {exc}"
            )
            continue
        if not resolved.is_file():
            errors.append(
                f"materials[{index}].originalUrl is not a regular file: {row['originalUrl']}"
            )
            continue
        actual_bytes = resolved.stat().st_size
        if row["bytes"] is not None and row["bytes"] != actual_bytes:
            errors.append(
                f"materials[{index}].bytes ({row['bytes']}) does not match "
                f"the published file ({actual_bytes})"
            )
        actual_sha256 = _sha256_file(resolved)
        if row["sha256"] != actual_sha256:
            errors.append(
                f"materials[{index}].sha256 does not match the published file: "
                f"expected {row['sha256']}, got {actual_sha256}"
            )


def _validate_gap(value: Any, index: int, errors: list[str]) -> str:
    field = f"knownGaps[{index}]"
    gap = _object(value, field, errors)
    _exact_fields(gap, GAP_FIELDS, field, errors)
    gap_id = _string(gap.get("id"), f"{field}.id", errors, nonempty=True)
    _string(gap.get("label"), f"{field}.label", errors, nonempty=True)
    _enum(gap.get("status"), GAP_STATUSES, f"{field}.status", errors)
    _string(gap.get("note"), f"{field}.note", errors)
    return gap_id


def _validate_summary(
    value: Any,
    material_rows: list[dict[str, Any]],
    errors: list[str],
) -> tuple[int, int, int | None]:
    summary = _object(value, "summary", errors)
    _exact_fields(summary, SUMMARY_FIELDS, "summary", errors)

    source_files = _integer(summary.get("sourceFiles"), "summary.sourceFiles", errors)
    published = _integer(
        summary.get("publishedOriginals"), "summary.publishedOriginals", errors
    )
    total_pages = _nullable_integer(summary.get("totalPages"), "summary.totalPages", errors)

    if source_files is not None and source_files != len(material_rows):
        errors.append(
            f"summary.sourceFiles ({source_files}) does not match materials length "
            f"({len(material_rows)})"
        )

    expected_published = sum(
        row["sourceStatus"] == "published-original" for row in material_rows
    )
    if published is not None and published != expected_published:
        errors.append(
            f"summary.publishedOriginals ({published}) does not match published materials "
            f"({expected_published})"
        )

    known_pages = [row["pages"] for row in material_rows if row["pages"] is not None]
    has_unknown_pages = any(row["pages"] is None for row in material_rows)
    expected_pages = sum(known_pages)
    if has_unknown_pages:
        if total_pages is not None:
            errors.append(
                "summary.totalPages must be null when any material page count is unknown"
            )
    elif total_pages != expected_pages:
        errors.append(
            f"summary.totalPages ({total_pages}) does not match the sum of material "
            f"pages ({expected_pages})"
        )

    counts_value = summary.get("categoryCounts")
    category_counts = _object(counts_value, "summary.categoryCounts", errors)
    for category, count in category_counts.items():
        if category not in CATEGORIES:
            errors.append(f"summary.categoryCounts has unknown category: {category}")
        _integer(count, f"summary.categoryCounts.{category}", errors)

    expected_counts = collections.Counter(
        row["category"] for row in material_rows if row["category"] in CATEGORIES
    )
    for category in sorted(CATEGORIES):
        declared = category_counts.get(category, 0)
        if isinstance(declared, bool) or not isinstance(declared, int):
            continue
        expected = expected_counts.get(category, 0)
        if declared != expected:
            errors.append(
                f"summary.categoryCounts.{category} ({declared}) does not match "
                f"materials ({expected})"
            )

    return source_files or 0, published or 0, total_pages


def _validate_freshness(
    value: Any,
    errors: list[str],
    now: dt.datetime,
) -> None:
    freshness = _object(value, "freshness", errors)
    _exact_fields(freshness, FRESHNESS_FIELDS, "freshness", errors)
    _calendar_date(freshness.get("sourceAuditDate"), "freshness.sourceAuditDate", errors, now)
    _integer(
        freshness.get("suggestedReviewDays"),
        "freshness.suggestedReviewDays",
        errors,
        minimum=1,
    )
    _string(
        freshness.get("updateTrigger"),
        "freshness.updateTrigger",
        errors,
        nonempty=True,
    )


def validate_inventory(
    path: str | Path,
    *,
    now: dt.datetime | None = None,
) -> ValidationResult:
    """Validate one inventory and return its normalized identity and totals."""

    inventory_path = Path(path)
    errors: list[str] = []
    data = _load_json(inventory_path, errors)
    if data is None:
        raise ValidationError(errors)

    root = _object(data, "inventory", errors)
    _scan_security(root, "inventory", errors)
    _exact_fields(root, ROOT_FIELDS, "inventory", errors)

    version = root.get("schemaVersion")
    if version != SCHEMA_VERSION:
        errors.append(f"schemaVersion must be '{SCHEMA_VERSION}'")

    code, slug, route = _validate_course(root.get("course"), errors)
    current = _normalise_now(now)
    _date_time(root.get("generatedAt"), "generatedAt", errors, current)
    _enum(root.get("inventoryStatus"), INVENTORY_STATUSES, "inventoryStatus", errors)
    _string(root.get("inventoryNote"), "inventoryNote", errors)

    materials = _array(root.get("materials"), "materials", errors)
    material_rows = [
        _validate_material(material, index, errors, route)
        for index, material in enumerate(materials)
    ]
    _validate_published_files(inventory_path, route, material_rows, errors)
    source_files, published_originals, total_pages = _validate_summary(
        root.get("summary"), material_rows, errors
    )

    gaps = _array(root.get("knownGaps"), "knownGaps", errors)
    gap_ids = [_validate_gap(gap, index, errors) for index, gap in enumerate(gaps)]
    _validate_freshness(root.get("freshness"), errors, current)

    seen_ids: dict[str, str] = {}
    for index, row in enumerate(material_rows):
        item_id = row["id"]
        if not item_id:
            continue
        previous = seen_ids.get(item_id)
        if previous is not None:
            errors.append(f"duplicate id '{item_id}' in materials[{index}]; first used by {previous}")
        else:
            seen_ids[item_id] = f"materials[{index}]"
    for index, gap_id in enumerate(gap_ids):
        if not gap_id:
            continue
        previous = seen_ids.get(gap_id)
        if previous is not None:
            errors.append(f"duplicate id '{gap_id}' in knownGaps[{index}]; first used by {previous}")
        else:
            seen_ids[gap_id] = f"knownGaps[{index}]"

    if errors:
        raise ValidationError(errors)
    return ValidationResult(
        path=inventory_path,
        course_code=code,
        slug=slug,
        route=route,
        source_files=source_files,
        published_originals=published_originals,
        total_pages=total_pages,
    )


def validate_files(
    paths: Sequence[str | Path],
    *,
    now: dt.datetime | None = None,
) -> list[ValidationResult]:
    """Validate every path, aggregating failures so one run reports all files."""

    results: list[ValidationResult] = []
    failures: list[str] = []
    for path in paths:
        try:
            results.append(validate_inventory(path, now=now))
        except ValidationError as exc:
            failures.extend(f"{Path(path)}: {error}" for error in exc.errors)
    if failures:
        raise ValidationError(failures)
    return results


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate one or more course-materials/v1 JSON inventory files."
    )
    parser.add_argument("inventories", nargs="+", help="inventory JSON file(s) to validate")
    parser.add_argument("--quiet", action="store_true", help="emit output only on failure")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = _build_parser().parse_args(argv)
    try:
        results = validate_files(args.inventories)
    except ValidationError as exc:
        for error in exc.errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    if not args.quiet:
        for result in results:
            print(
                "OK: "
                f"{result.path} [{result.course_code} {result.route}] "
                f"{result.source_files} source files, "
                f"{result.published_originals} published originals"
            )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
