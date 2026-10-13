from __future__ import annotations

import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "validate_course_package.py"
SPEC = importlib.util.spec_from_file_location("validate_course_package", MODULE_PATH)
assert SPEC and SPEC.loader
VALIDATOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = VALIDATOR
SPEC.loader.exec_module(VALIDATOR)


class CoursePackageValidatorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.package = Path(self.temporary.name) / "course-package"
        (self.package / "site" / "assets").mkdir(parents=True)
        (self.package / "site" / "index.html").write_text(
            "<!doctype html><html><title>PHY408</title></html>", encoding="utf-8"
        )
        (self.package / "site" / "assets" / "app.js").write_text(
            "console.log('ready');\n", encoding="utf-8"
        )
        (self.package / "source-coverage.json").write_text(
            json.dumps(
                {
                    "schemaVersion": "source-coverage/v1",
                    "items": [
                        {
                            "source": "materials/lecture.pdf",
                            "sha256": "1" * 64,
                            "type": "slides",
                            "pages": 10,
                            "learningNodes": ["node-1"],
                            "outputs": ["site/index.html"],
                        },
                        {
                            "source": "materials/problems.pdf",
                            "sha256": "2" * 64,
                            "type": "assessment",
                            "assessmentItems": 4,
                            "learningNodes": ["node-2"],
                            "outputs": ["site/index.html"],
                        },
                    ],
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        (self.package / "qa-report.json").write_text(
            json.dumps(
                {
                    "mechanical": {"status": "passed", "checks": ["build", "links"]},
                    "content": {"status": "passed", "checks": ["sequence", "sampling"]},
                }
            ),
            encoding="utf-8",
        )
        (self.package / "README.md").write_text(
            "# PHY408 delivery\n\nPreview and known limitations.\n", encoding="utf-8"
        )
        self.manifest = {
            "schemaVersion": "course-package/v1",
            "course": {
                "code": "PHY408",
                "nameZh": "数据密集型科学",
                "nameEn": "Data Intensive Science",
                "slug": "phy408",
                "route": "/phy408/",
            },
            "artifact": {
                "kind": "static-site",
                "entry": "site/index.html",
                "basePath": "/phy408/",
                "apiBase": "/api/v1",
                "localFallback": True,
            },
            "build": {
                "command": "npm ci && npm run build",
                "workingDirectory": ".",
                "outputDir": "site",
                "builtAt": "2026-10-13T10:00:00+08:00",
            },
            "inventory": {
                "sourceFiles": 2,
                "slideDecks": 1,
                "originalSlides": 10,
                "translationExplanationSlides": 15,
                "assessmentFiles": 1,
                "assessmentItems": 4,
                "learningNodes": 2,
            },
            "coverage": {
                "sourceFilesMapped": 2,
                "sourceFilesTotal": 2,
                "originalSlidesMapped": 10,
                "originalSlidesTotal": 10,
                "assessmentItemsMapped": 4,
                "assessmentItemsTotal": 4,
            },
            "files": {
                "site": "site/",
                "coverage": "source-coverage.json",
                "qa": "qa-report.json",
                "checksums": "checksums.sha256",
                "readme": "README.md",
            },
            "tests": [
                {
                    "name": "build and tests",
                    "command": "npm test",
                    "status": "passed",
                    "evidence": "qa-report.json",
                }
            ],
            "rights": {
                "basis": "User-reported course-site permission; source limits retained.",
                "redistribution": "course-site-only",
            },
            "limitations": [],
        }
        self._write_manifest_and_checksums()

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def _write_manifest(self) -> None:
        (self.package / "manifest.json").write_text(
            json.dumps(self.manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

    def _contract_paths(self) -> list[Path]:
        paths = [
            self.package / "manifest.json",
            self.package / "source-coverage.json",
            self.package / "qa-report.json",
            self.package / "README.md",
        ]
        paths.extend(path for path in (self.package / "site").rglob("*") if path.is_file())
        return sorted(set(paths))

    def _write_checksums(self, omit: str | None = None) -> None:
        lines = []
        for path in self._contract_paths():
            relative = path.relative_to(self.package).as_posix()
            if relative == omit:
                continue
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            lines.append(f"{digest}  {relative}")
        (self.package / "checksums.sha256").write_text("\n".join(lines) + "\n", encoding="utf-8")

    def _write_manifest_and_checksums(self) -> None:
        self._write_manifest()
        self._write_checksums()

    def assert_rejected(self, fragment: str) -> None:
        with self.assertRaises(VALIDATOR.ValidationError) as caught:
            VALIDATOR.validate_package(self.package)
        self.assertIn(fragment, "\n".join(caught.exception.errors))

    def test_valid_package_and_optional_pinned_hash(self) -> None:
        result = VALIDATOR.validate_package(self.package)
        self.assertEqual((result.course_id, result.slug, result.route), ("PHY408", "phy408", "/phy408/"))
        self.assertRegex(result.package_sha256, r"^[0-9a-f]{64}$")

        self.manifest["packageSha256"] = result.package_sha256
        self._write_manifest_and_checksums()
        pinned = VALIDATOR.validate_package(self.package)
        self.assertEqual(pinned.package_sha256, result.package_sha256)

    def test_cli_emits_nested_manifest_deploy_metadata(self) -> None:
        completed = subprocess.run(
            [sys.executable, str(MODULE_PATH), str(self.package), "--emit-tsv"],
            check=True,
            capture_output=True,
            text=True,
        )
        fields = completed.stdout.strip().split("\t")
        self.assertEqual(fields[:5], ["PHY408", "phy408", "/phy408/", "site", "index.html"])
        self.assertRegex(fields[5], r"^[0-9a-f]{64}$")

    def test_unknown_course_code_is_rejected(self) -> None:
        self.manifest["course"].update(code="PHY999", slug="phy999", route="/phy999/")
        self.manifest["artifact"]["basePath"] = "/phy999/"
        self._write_manifest_and_checksums()
        self.assert_rejected("unknown course.code")

    def test_wrong_known_route_is_rejected(self) -> None:
        self.manifest["course"]["route"] = "/phy309/"
        self.manifest["artifact"]["basePath"] = "/phy309/"
        self._write_manifest_and_checksums()
        self.assert_rejected("course.route for PHY408 must be '/phy408/'")

    def test_legacy_flat_manifest_fields_are_not_silently_accepted(self) -> None:
        self.manifest["buildCommand"] = "npm run build"
        self._write_manifest_and_checksums()
        self.assert_rejected("manifest contains unsupported fields: buildCommand")

    def test_failed_test_receipt_is_rejected(self) -> None:
        self.manifest["tests"][0]["status"] = "failed"
        self._write_manifest_and_checksums()
        self.assert_rejected("status must be 'passed'")

    def test_incomplete_coverage_is_rejected(self) -> None:
        self.manifest["coverage"]["assessmentItemsMapped"] = 3
        self._write_manifest_and_checksums()
        self.assert_rejected("coverage is incomplete")

    def test_all_zero_inventory_and_coverage_cannot_claim_complete(self) -> None:
        self.manifest["inventory"] = {
            field: 0 for field in VALIDATOR.INVENTORY_FIELDS
        }
        self.manifest["coverage"] = {
            field: 0
            for mapped, total, _ in VALIDATOR.COVERAGE_PAIRS
            for field in (mapped, total)
        }
        (self.package / "source-coverage.json").write_text(
            json.dumps({"schemaVersion": "source-coverage/v1", "items": []}),
            encoding="utf-8",
        )
        self._write_manifest_and_checksums()
        self.assert_rejected("inventory.sourceFiles must be greater than zero")

    def test_deployable_inventory_requires_nodes_and_real_content_units(self) -> None:
        self.manifest["inventory"]["learningNodes"] = 0
        self.manifest["inventory"]["originalSlides"] = 0
        self.manifest["inventory"]["assessmentItems"] = 0
        self.manifest["coverage"].update(
            originalSlidesMapped=0,
            originalSlidesTotal=0,
            assessmentItemsMapped=0,
            assessmentItemsTotal=0,
        )
        self._write_manifest_and_checksums()
        with self.assertRaises(VALIDATOR.ValidationError) as caught:
            VALIDATOR.validate_package(self.package)
        errors = "\n".join(caught.exception.errors)
        self.assertIn("inventory.learningNodes must be greater than zero", errors)
        self.assertIn("at least one original slide or assessment item", errors)

    def test_qa_must_separate_mechanical_and_content(self) -> None:
        (self.package / "qa-report.json").write_text(
            json.dumps({"mechanical": {"status": "passed"}}), encoding="utf-8"
        )
        self._write_checksums()
        self.assert_rejected("non-empty content object")

    def test_qa_report_must_be_an_object(self) -> None:
        (self.package / "qa-report.json").write_text(
            json.dumps([{"status": "passed"}]), encoding="utf-8"
        )
        self._write_checksums()
        self.assert_rejected("qa-report.json must be a JSON object")

    def test_qa_sections_must_explicitly_pass(self) -> None:
        for status in ("failed", "partial", "not-run"):
            with self.subTest(status=status):
                (self.package / "qa-report.json").write_text(
                    json.dumps(
                        {
                            "mechanical": {"status": status, "checks": ["build"]},
                            "content": {"status": "passed", "checks": ["sequence"]},
                        }
                    ),
                    encoding="utf-8",
                )
                self._write_checksums()
                self.assert_rejected("mechanical.status must be a deployable pass status")

    def test_qa_pass_with_notes_is_deployable(self) -> None:
        (self.package / "qa-report.json").write_text(
            json.dumps(
                {
                    "mechanical": {"status": "PASS", "checks": ["build"]},
                    "content": {
                        "status": "PASS_WITH_NOTES",
                        "checks": ["sequence"],
                    },
                }
            ),
            encoding="utf-8",
        )
        self._write_checksums()
        self.assertEqual(VALIDATOR.validate_package(self.package).course_id, "PHY408")

    def test_bad_checksum_is_rejected(self) -> None:
        (self.package / "site" / "assets" / "app.js").write_text(
            "console.log('changed');\n", encoding="utf-8"
        )
        self.assert_rejected("SHA-256 mismatch for site/assets/app.js")

    def test_checksum_inventory_must_cover_contract_surface(self) -> None:
        self._write_checksums(omit="README.md")
        self.assert_rejected("does not cover the contract surface: README.md")

    def test_secret_in_deployed_site_is_rejected(self) -> None:
        secret = self.package / "site" / ".env.production"
        secret.write_text("PASSWORD=definitely-not-public\n", encoding="utf-8")
        self._write_checksums()
        self.assert_rejected("credential-like file name is forbidden")

    def test_private_key_in_declared_evidence_is_rejected(self) -> None:
        (self.package / "qa-report.json").write_text(
            "-----BEGIN OPENSSH PRIVATE KEY-----\nnot-a-real-key\n", encoding="utf-8"
        )
        self._write_checksums()
        self.assert_rejected("possible private key")

    def test_site_symlink_is_rejected(self) -> None:
        (self.package / "site" / "linked-index.html").symlink_to("index.html")
        self.assert_rejected("symbolic links are not allowed")

    def test_rsync_partial_name_is_reserved_inside_site(self) -> None:
        (self.package / "site" / ".rsync-partial").mkdir()
        self.assert_rejected("deployment-internal path is forbidden in site/")

    def test_rebuild_workspace_and_node_modules_symlink_are_outside_delivery_surface(self) -> None:
        (self.package / "src").mkdir()
        (self.package / "src" / "main.ts").write_text("export {};\n", encoding="utf-8")
        (self.package / "node_modules" / ".bin").mkdir(parents=True)
        (self.package / "node_modules" / "tool.js").write_text("// dev only\n", encoding="utf-8")
        (self.package / "node_modules" / ".bin" / "tool").symlink_to("../../tool.js")
        result = VALIDATOR.validate_package(self.package)
        self.assertEqual(result.course_id, "PHY408")

    def test_incorrect_pinned_package_hash_is_rejected(self) -> None:
        self.manifest["packageSha256"] = "0" * 64
        self._write_manifest_and_checksums()
        self.assert_rejected("packageSha256 mismatch")


if __name__ == "__main__":
    unittest.main()
