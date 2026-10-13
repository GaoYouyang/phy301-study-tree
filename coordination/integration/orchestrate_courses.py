#!/usr/bin/env python3
"""Validate and optionally deploy every registered course package.

This coordinator deliberately executes only the central validator and the
central deployment script. It never executes commands declared by a course
manifest. COURSE_HUB_AUTH_TOKEN, when needed by the deployment script, is
inherited by subprocesses; this program never reads or prints its value.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import json
import os
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Iterable, TypeVar


PROJECT_REGISTRY_SCHEMA = "course-project-registry/v1"
RECEIPT_SCHEMA = "course-orchestration-receipt/v1"
HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[1]
DEFAULT_REGISTRY = HERE / "course-projects.json"
ALLOWED_COURSES = HERE / "allowed-courses.json"
VALIDATOR = HERE / "validate_course_package.py"
DEPLOY_SCRIPT = REPO_ROOT / "deploy" / "scripts" / "deploy-course-package.sh"


class RegistryError(ValueError):
    """Raised when the local project registry is unsafe or inconsistent."""


@dataclass(frozen=True)
class CourseProject:
    code: str
    slug: str
    route: str
    package_root: Path
    enabled: bool


def _read_json_object(path: Path, label: str) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise RegistryError(f"{label} is missing: {path}") from exc
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise RegistryError(f"{label} is not readable UTF-8 JSON: {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise RegistryError(f"{label} must be a JSON object: {path}")
    return value


def load_project_registry(
    registry_path: Path = DEFAULT_REGISTRY,
    allowed_path: Path = ALLOWED_COURSES,
) -> list[CourseProject]:
    """Load the machine registry and cross-check the deployment allow-list."""

    registry_path = registry_path.expanduser().resolve()
    document = _read_json_object(registry_path, "project registry")
    if document.get("schemaVersion") != PROJECT_REGISTRY_SCHEMA:
        raise RegistryError(
            f"project registry schemaVersion must be {PROJECT_REGISTRY_SCHEMA!r}"
        )
    if set(document) != {"schemaVersion", "projects"}:
        extras = sorted(set(document).difference({"schemaVersion", "projects"}))
        raise RegistryError(
            "project registry contains unsupported top-level fields"
            + (f": {', '.join(extras)}" if extras else "")
        )

    allowed_document = _read_json_object(allowed_path.resolve(), "allowed-course registry")
    allowed = allowed_document.get("courses")
    if not isinstance(allowed, dict):
        raise RegistryError("allowed-course registry must contain a courses object")

    raw_projects = document.get("projects")
    if not isinstance(raw_projects, list) or not raw_projects:
        raise RegistryError("project registry projects must be a non-empty array")

    projects: list[CourseProject] = []
    seen_codes: set[str] = set()
    seen_slugs: set[str] = set()
    seen_routes: set[str] = set()
    seen_roots: set[Path] = set()
    supported_fields = {
        "code",
        "slug",
        "route",
        "packageRoot",
        "enabled",
        "coordination",
    }
    for index, raw in enumerate(raw_projects):
        prefix = f"projects[{index}]"
        if not isinstance(raw, dict):
            raise RegistryError(f"{prefix} must be an object")
        unknown = sorted(set(raw).difference(supported_fields))
        if unknown:
            raise RegistryError(f"{prefix} contains unsupported fields: {', '.join(unknown)}")

        code = raw.get("code")
        slug = raw.get("slug")
        route = raw.get("route")
        package_root_raw = raw.get("packageRoot")
        enabled = raw.get("enabled", True)
        coordination = raw.get("coordination")
        if not isinstance(code, str) or not code.strip():
            raise RegistryError(f"{prefix}.code must be a non-empty string")
        if not isinstance(slug, str) or not slug.strip():
            raise RegistryError(f"{prefix}.slug must be a non-empty string")
        if not isinstance(route, str) or not route.startswith("/") or not route.endswith("/"):
            raise RegistryError(f"{prefix}.route must start and end with '/'")
        if not isinstance(package_root_raw, str) or not package_root_raw.strip():
            raise RegistryError(f"{prefix}.packageRoot must be a non-empty absolute path")
        package_root = Path(package_root_raw).expanduser()
        if not package_root.is_absolute():
            raise RegistryError(f"{prefix}.packageRoot must be absolute")
        package_root = package_root.resolve(strict=False)
        if not isinstance(enabled, bool):
            raise RegistryError(f"{prefix}.enabled must be a boolean")
        if coordination is not None and not isinstance(coordination, dict):
            raise RegistryError(f"{prefix}.coordination must be an object when present")

        expected = allowed.get(code)
        if not isinstance(expected, dict):
            raise RegistryError(f"{prefix}.code is not in allowed-courses.json: {code}")
        if expected.get("slug") != slug or expected.get("route") != route:
            raise RegistryError(
                f"{prefix} does not match allowed-courses.json for {code}: "
                f"expected slug={expected.get('slug')!r}, route={expected.get('route')!r}"
            )
        for value, seen, label in (
            (code, seen_codes, "code"),
            (slug, seen_slugs, "slug"),
            (route, seen_routes, "route"),
            (package_root, seen_roots, "packageRoot"),
        ):
            if value in seen:
                raise RegistryError(f"duplicate project {label}: {value}")
            seen.add(value)

        projects.append(
            CourseProject(
                code=code,
                slug=slug,
                route=route,
                package_root=package_root,
                enabled=enabled,
            )
        )
    return projects


def select_projects(
    projects: Iterable[CourseProject], selectors: list[str] | None
) -> list[CourseProject]:
    enabled = [project for project in projects if project.enabled]
    if not selectors:
        if not enabled:
            raise RegistryError("project registry has no enabled courses")
        return enabled

    index: dict[str, CourseProject] = {}
    for project in enabled:
        index[project.code.casefold()] = project
        index[project.slug.casefold()] = project
    selected: list[CourseProject] = []
    seen: set[str] = set()
    for selector in selectors:
        project = index.get(selector.casefold())
        if project is None:
            raise RegistryError(f"unknown or disabled course selector: {selector}")
        if project.code not in seen:
            selected.append(project)
            seen.add(project.code)
    return selected


def _utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")


def _trim_output(value: str, limit: int = 8000) -> str:
    value = value.strip()
    if len(value) <= limit:
        return value
    return "[truncated]\n" + value[-limit:]


def _validation_worker(project: CourseProject, timeout: float) -> dict[str, Any]:
    started = time.monotonic()
    command = [
        sys.executable,
        str(VALIDATOR),
        str(project.package_root),
        "--emit-tsv",
    ]
    try:
        completed = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired:
        return {
            "status": "failed",
            "durationMs": round((time.monotonic() - started) * 1000),
            "message": f"central validator timed out after {timeout:g} seconds",
        }
    except OSError as exc:
        return {
            "status": "failed",
            "durationMs": round((time.monotonic() - started) * 1000),
            "message": f"central validator could not start: {exc}",
        }

    duration_ms = round((time.monotonic() - started) * 1000)
    if completed.returncode != 0:
        return {
            "status": "failed",
            "exitCode": completed.returncode,
            "durationMs": duration_ms,
            "message": _trim_output(completed.stderr or completed.stdout)
            or "central validator rejected the package",
        }
    fields = completed.stdout.strip().split("\t")
    if len(fields) != 6:
        return {
            "status": "failed",
            "exitCode": completed.returncode,
            "durationMs": duration_ms,
            "message": "central validator returned malformed deployment metadata",
        }
    code, slug, route, build_dir, entrypoint, digest = fields
    if (code, slug, route) != (project.code, project.slug, project.route):
        return {
            "status": "failed",
            "exitCode": completed.returncode,
            "durationMs": duration_ms,
            "message": (
                "validated package identity does not match the project registry: "
                f"got {code}/{slug}/{route}"
            ),
        }
    return {
        "status": "passed",
        "exitCode": completed.returncode,
        "durationMs": duration_ms,
        "buildDir": build_dir,
        "entrypoint": entrypoint,
        "packageSha256": digest,
    }


def _deployment_worker(
    project: CourseProject,
    target: str,
    origin: str,
    timeout: float,
) -> dict[str, Any]:
    started = time.monotonic()
    command = [
        "bash",
        str(DEPLOY_SCRIPT),
        "--package",
        str(project.package_root),
        "--target",
        target,
        "--origin",
        origin,
    ]
    try:
        # Deliberately omit env=. The child inherits COURSE_HUB_AUTH_TOKEN
        # without this coordinator ever reading or serializing the token.
        completed = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired:
        return {
            "status": "failed",
            "durationMs": round((time.monotonic() - started) * 1000),
            "message": f"central deployment timed out after {timeout:g} seconds",
        }
    except OSError as exc:
        return {
            "status": "failed",
            "durationMs": round((time.monotonic() - started) * 1000),
            "message": f"central deployment could not start: {exc}",
        }

    duration_ms = round((time.monotonic() - started) * 1000)
    if completed.returncode != 0:
        return {
            "status": "failed",
            "exitCode": completed.returncode,
            "durationMs": duration_ms,
            "message": _trim_output(completed.stderr or completed.stdout)
            or "central deployment failed",
        }
    return {
        "status": "passed",
        "exitCode": completed.returncode,
        "durationMs": duration_ms,
        "message": _trim_output(completed.stdout),
    }


T = TypeVar("T")


def _run_parallel(
    projects: list[CourseProject],
    jobs: int,
    worker: Callable[[CourseProject], T],
) -> list[T]:
    """Run all projects independently while preserving registry order."""

    if jobs < 1:
        raise ValueError("jobs must be at least 1")
    results: list[T | None] = [None] * len(projects)
    with concurrent.futures.ThreadPoolExecutor(
        max_workers=min(jobs, len(projects)), thread_name_prefix="course-orchestrator"
    ) as executor:
        future_indexes = {
            executor.submit(worker, project): index
            for index, project in enumerate(projects)
        }
        for future in concurrent.futures.as_completed(future_indexes):
            index = future_indexes[future]
            results[index] = future.result()
    return [result for result in results if result is not None]


def coordinate(
    projects: list[CourseProject],
    *,
    deploy: bool = False,
    target: str | None = None,
    origin: str = "https://gaoyouyang.site",
    jobs: int = 3,
    validation_timeout: float = 1800,
    deploy_timeout: float = 7200,
    registry_path: Path = DEFAULT_REGISTRY,
) -> dict[str, Any]:
    """Validate all selected courses, then deploy only the passing subset."""

    if deploy and not target:
        raise RegistryError("--target is required with --deploy")
    started_at = _utc_now()
    records = [
        {
            "code": project.code,
            "slug": project.slug,
            "route": project.route,
            "packageRoot": str(project.package_root),
        }
        for project in projects
    ]
    validations = _run_parallel(
        projects,
        jobs,
        lambda project: _validation_worker(project, validation_timeout),
    )
    passing_projects: list[CourseProject] = []
    for project, record, validation in zip(projects, records, validations):
        record["validation"] = validation
        if validation["status"] == "passed":
            record["status"] = "validated"
            passing_projects.append(project)
        else:
            record["status"] = "validation_failed"

    if deploy and passing_projects:
        deployments = _run_parallel(
            passing_projects,
            jobs,
            lambda project: _deployment_worker(
                project, target or "", origin, deploy_timeout
            ),
        )
        deployment_by_code = {
            project.code: deployment
            for project, deployment in zip(passing_projects, deployments)
        }
        for record in records:
            deployment = deployment_by_code.get(record["code"])
            if deployment is None:
                continue
            record["deployment"] = deployment
            record["status"] = (
                "deployed" if deployment["status"] == "passed" else "deploy_failed"
            )

    failed = any(
        record["status"] in {"validation_failed", "deploy_failed"} for record in records
    )
    receipt: dict[str, Any] = {
        "schemaVersion": RECEIPT_SCHEMA,
        "mode": "deploy" if deploy else "validate",
        "startedAt": started_at,
        "finishedAt": _utc_now(),
        "registryPath": str(registry_path.resolve()),
        "jobs": jobs,
        "overallStatus": "failed" if failed else "passed",
        "courses": records,
    }
    if deploy:
        receipt["deployment"] = {"target": target, "origin": origin}
    return receipt


def write_receipt(path: Path, receipt: dict[str, Any]) -> None:
    path = path.expanduser().resolve()
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp-{os.getpid()}")
    temporary.write_text(
        json.dumps(receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    os.replace(temporary, path)


def _default_receipt_path() -> Path:
    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    return REPO_ROOT / ".codex-local" / "course-coordinator" / f"run-{stamp}.json"


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate all registered course packages and optionally deploy them."
    )
    parser.add_argument("--registry", type=Path, default=DEFAULT_REGISTRY)
    parser.add_argument(
        "--course",
        action="append",
        help="select one enabled course by code or slug; repeat for multiple courses",
    )
    parser.add_argument("--jobs", type=int, default=3, help="maximum parallel courses")
    parser.add_argument("--receipt", type=Path, help="JSON receipt output path")
    parser.add_argument("--deploy", action="store_true", help="deploy packages that validate")
    parser.add_argument("--target", help="SSH USER@HOST; required with --deploy")
    parser.add_argument("--origin", default="https://gaoyouyang.site")
    parser.add_argument("--validation-timeout", type=float, default=1800)
    parser.add_argument("--deploy-timeout", type=float, default=7200)
    return parser.parse_args(argv)


def _print_statuses(receipt: dict[str, Any]) -> None:
    for record in receipt["courses"]:
        status = record["status"].upper()
        detail = record.get("deployment") or record["validation"]
        message = detail.get("message", "")
        suffix = f" - {message.splitlines()[-1]}" if message else ""
        print(f"[{status}] {record['code']} {record['route']}{suffix}")


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    if args.jobs < 1:
        print("course coordinator rejected: --jobs must be at least 1", file=sys.stderr)
        return 2
    if args.validation_timeout <= 0 or args.deploy_timeout <= 0:
        print("course coordinator rejected: timeouts must be positive", file=sys.stderr)
        return 2
    try:
        projects = select_projects(load_project_registry(args.registry), args.course)
        receipt = coordinate(
            projects,
            deploy=args.deploy,
            target=args.target,
            origin=args.origin,
            jobs=args.jobs,
            validation_timeout=args.validation_timeout,
            deploy_timeout=args.deploy_timeout,
            registry_path=args.registry,
        )
    except RegistryError as exc:
        print(f"course coordinator rejected: {exc}", file=sys.stderr)
        return 2

    receipt_path = args.receipt or _default_receipt_path()
    write_receipt(receipt_path, receipt)
    _print_statuses(receipt)
    print(f"JSON receipt: {receipt_path.expanduser().resolve()}")
    return 0 if receipt["overallStatus"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
