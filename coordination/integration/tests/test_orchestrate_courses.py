from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest import mock


MODULE_PATH = Path(__file__).resolve().parents[1] / "orchestrate_courses.py"
SPEC = importlib.util.spec_from_file_location("course_orchestrator", MODULE_PATH)
assert SPEC is not None and SPEC.loader is not None
ORCHESTRATOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = ORCHESTRATOR
SPEC.loader.exec_module(ORCHESTRATOR)


class CourseOrchestratorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        root = Path(self.temporary.name)
        self.projects = [
            ORCHESTRATOR.CourseProject(
                code=code,
                slug=slug,
                route=f"/{slug}/",
                package_root=(root / slug).resolve(),
                enabled=True,
            )
            for code, slug in (
                ("PHY408", "phy408"),
                ("PHY309", "phy309"),
                ("MAT107", "mat107"),
            )
        ]

    @staticmethod
    def validator_success(command: list[str]) -> subprocess.CompletedProcess[str]:
        package_root = Path(command[2])
        code = package_root.name.upper()
        if code == "MAT107":
            course_code = "MAT107"
        else:
            course_code = code
        output = (
            f"{course_code}\t{package_root.name}\t/{package_root.name}/\t"
            f"site\tindex.html\t{'a' * 64}\n"
        )
        return subprocess.CompletedProcess(command, 0, output, "")

    def test_validations_run_in_parallel_and_preserve_registry_order(self) -> None:
        barrier = threading.Barrier(3)
        active = 0
        maximum_active = 0
        lock = threading.Lock()

        def fake_run(command: list[str], **_: object) -> subprocess.CompletedProcess[str]:
            nonlocal active, maximum_active
            with lock:
                active += 1
                maximum_active = max(maximum_active, active)
            barrier.wait(timeout=2)
            time.sleep(0.01)
            with lock:
                active -= 1
            return self.validator_success(command)

        with mock.patch.object(ORCHESTRATOR.subprocess, "run", side_effect=fake_run):
            receipt = ORCHESTRATOR.coordinate(self.projects, jobs=3)

        self.assertGreaterEqual(maximum_active, 2)
        self.assertEqual(
            [course["code"] for course in receipt["courses"]],
            ["PHY408", "PHY309", "MAT107"],
        )
        self.assertEqual(
            [course["status"] for course in receipt["courses"]],
            ["validated", "validated", "validated"],
        )

    def test_one_validation_failure_does_not_block_other_courses(self) -> None:
        called: list[str] = []

        def fake_run(command: list[str], **_: object) -> subprocess.CompletedProcess[str]:
            slug = Path(command[2]).name
            called.append(slug)
            if slug == "phy309":
                return subprocess.CompletedProcess(command, 1, "", "bad package")
            return self.validator_success(command)

        with mock.patch.object(ORCHESTRATOR.subprocess, "run", side_effect=fake_run):
            receipt = ORCHESTRATOR.coordinate(self.projects, jobs=3)

        self.assertCountEqual(called, ["phy408", "phy309", "mat107"])
        self.assertEqual(receipt["overallStatus"], "failed")
        self.assertEqual(
            {course["code"]: course["status"] for course in receipt["courses"]},
            {
                "PHY408": "validated",
                "PHY309": "validation_failed",
                "MAT107": "validated",
            },
        )

    def test_course_selection_accepts_code_or_slug(self) -> None:
        selected = ORCHESTRATOR.select_projects(
            self.projects, ["phy309", "MAT107", "phy309"]
        )
        self.assertEqual([project.code for project in selected], ["PHY309", "MAT107"])
        with self.assertRaises(ORCHESTRATOR.RegistryError):
            ORCHESTRATOR.select_projects(self.projects, ["PHY999"])

    def test_deploy_gate_runs_only_for_validation_passes(self) -> None:
        deploy_roots: list[str] = []

        def fake_run(command: list[str], **_: object) -> subprocess.CompletedProcess[str]:
            if command[0] == "bash":
                package_index = command.index("--package") + 1
                deploy_roots.append(Path(command[package_index]).name)
                return subprocess.CompletedProcess(command, 0, "deployed\n", "")
            if Path(command[2]).name == "phy309":
                return subprocess.CompletedProcess(command, 1, "", "rejected")
            return self.validator_success(command)

        with mock.patch.object(ORCHESTRATOR.subprocess, "run", side_effect=fake_run):
            receipt = ORCHESTRATOR.coordinate(
                self.projects,
                deploy=True,
                target="ubuntu@example",
                origin="https://example.test",
                jobs=3,
            )

        self.assertCountEqual(deploy_roots, ["phy408", "mat107"])
        self.assertEqual(
            {course["code"]: course["status"] for course in receipt["courses"]},
            {
                "PHY408": "deployed",
                "PHY309": "validation_failed",
                "MAT107": "deployed",
            },
        )
        self.assertEqual(receipt["overallStatus"], "failed")

    def test_registry_is_machine_readable_and_matches_allow_list(self) -> None:
        registry = Path(self.temporary.name) / "projects.json"
        registry.write_text(
            json.dumps(
                {
                    "schemaVersion": "course-project-registry/v1",
                    "projects": [
                        {
                            "code": "PHY408",
                            "slug": "phy408",
                            "route": "/phy408/",
                            "packageRoot": str(self.projects[0].package_root),
                            "enabled": True,
                            "coordination": {"threadId": "human-only"},
                        }
                    ],
                }
            ),
            encoding="utf-8",
        )
        loaded = ORCHESTRATOR.load_project_registry(registry)
        self.assertEqual(loaded, [self.projects[0]])


if __name__ == "__main__":
    unittest.main()
