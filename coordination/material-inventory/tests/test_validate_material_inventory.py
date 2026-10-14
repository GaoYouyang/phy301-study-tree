from __future__ import annotations

import copy
import datetime as dt
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "validate_material_inventory.py"
SPEC = importlib.util.spec_from_file_location("validate_material_inventory", MODULE_PATH)
assert SPEC and SPEC.loader
VALIDATOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = VALIDATOR
SPEC.loader.exec_module(VALIDATOR)


class MaterialInventoryValidatorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.path = self.root / "source-inventory.json"
        self.now = dt.datetime(2026, 10, 14, 12, 0, tzinfo=dt.timezone.utc)
        self.inventory = {
            "schemaVersion": "course-materials/v1",
            "course": {
                "code": "PHY301",
                "slug": "phy301",
                "route": "/phy301/",
                "nameZh": "热力学与统计物理",
                "nameEn": "Thermodynamics and Statistical Physics",
            },
            "generatedAt": "2026-10-14T19:55:00+08:00",
            "inventoryStatus": "verified-current-upload",
            "inventoryNote": "Checked against the currently received source package.",
            "summary": {
                "sourceFiles": 2,
                "publishedOriginals": 1,
                "totalPages": None,
                "categoryCounts": {"lecture": 1, "dataset": 1},
            },
            "materials": [
                {
                    "id": "lecture-01",
                    "title": "Lecture 1",
                    "originalFileName": "lecture-01.pptx",
                    "category": "lecture",
                    "format": "pptx",
                    "sequence": "01",
                    "pages": 31,
                    "bytes": 1024,
                    "sha256": "a" * 64,
                    "sourceStatus": "published-original",
                    "originalUrl": "/phy301/materials/originals/lecture-01.pptx",
                    "derivativeCount": 2,
                    "derivativeLabels": ["中文精讲", "PDF 预览"],
                    "note": "Original teacher deck.",
                },
                {
                    "id": "dataset-01",
                    "title": "Example data",
                    "originalFileName": "example.csv",
                    "category": "dataset",
                    "format": "csv",
                    "sequence": None,
                    "pages": None,
                    "bytes": None,
                    "sha256": "b" * 64,
                    "sourceStatus": "indexed-no-download",
                    "originalUrl": None,
                    "derivativeCount": 0,
                    "derivativeLabels": [],
                    "note": "Indexed while the download is unavailable.",
                },
            ],
            "knownGaps": [
                {
                    "id": "week-14-deck",
                    "label": "Week 14 standalone deck",
                    "status": "unknown",
                    "note": "No separate file was found in the current upload.",
                }
            ],
            "freshness": {
                "sourceAuditDate": "2026-10-14",
                "suggestedReviewDays": 7,
                "updateTrigger": "Teacher publishes or replaces a source file.",
            },
        }
        self._write()

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def _write(self, path: Path | None = None, inventory: dict | None = None) -> Path:
        target = path or self.path
        target.write_text(
            json.dumps(inventory or self.inventory, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return target

    def assert_rejected(self, fragment: str) -> None:
        with self.assertRaises(VALIDATOR.ValidationError) as caught:
            VALIDATOR.validate_inventory(self.path, now=self.now)
        self.assertIn(fragment, "\n".join(caught.exception.errors))

    @staticmethod
    def _make_cli_current(inventory: dict) -> None:
        current = dt.datetime.now(dt.timezone.utc)
        inventory["generatedAt"] = current.isoformat(timespec="seconds")
        inventory["freshness"]["sourceAuditDate"] = current.date().isoformat()

    def test_valid_inventory_passes(self) -> None:
        result = VALIDATOR.validate_inventory(self.path, now=self.now)
        self.assertEqual(
            (result.course_code, result.slug, result.route),
            ("PHY301", "phy301", "/phy301/"),
        )
        self.assertEqual((result.source_files, result.published_originals), (2, 1))
        self.assertIsNone(result.total_pages)

    def test_cli_accepts_multiple_files(self) -> None:
        self._make_cli_current(self.inventory)
        self._write()
        second = copy.deepcopy(self.inventory)
        second["course"].update(
            code="MAT107", slug="mat107", route="/mat107/", nameZh="概率论", nameEn="Probability Theory"
        )
        second["materials"][0]["originalUrl"] = "/mat107/materials/originals/lecture-01.pptx"
        second_path = self._write(self.root / "mat107.json", second)
        completed = subprocess.run(
            [sys.executable, str(MODULE_PATH), str(self.path), str(second_path)],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(completed.stdout.count("OK:"), 2)

    def test_all_cross_field_counts_are_checked(self) -> None:
        mutations = (
            ("sourceFiles", 3, "summary.sourceFiles"),
            ("publishedOriginals", 0, "summary.publishedOriginals"),
            ("totalPages", 30, "summary.totalPages"),
        )
        for field, value, expected in mutations:
            with self.subTest(field=field):
                candidate = copy.deepcopy(self.inventory)
                candidate["summary"][field] = value
                self._write(inventory=candidate)
                self.assert_rejected(expected)

        candidate = copy.deepcopy(self.inventory)
        candidate["summary"]["categoryCounts"]["lecture"] = 2
        self._write(inventory=candidate)
        self.assert_rejected("summary.categoryCounts.lecture")

    def test_traversal_and_absolute_original_urls_are_rejected(self) -> None:
        unsafe_urls = (
            "../private/lecture.pptx",
            "materials/%2e%2e/private/lecture.pptx",
            "materials/%252e%252e/private/lecture.pptx",
            "/materials/lecture.pptx",
            "/phy408/materials/lecture.pptx",
            "https://example.test/lecture.pptx",
            "//example.test/lecture.pptx",
            "/phy301/materials/%5c..%5cprivate/lecture.pptx",
            "/phy301/materials/lecture.pptx%3fdownload=1",
            "/phy301/materials/lecture%00.pptx",
        )
        for unsafe_url in unsafe_urls:
            with self.subTest(url=unsafe_url):
                candidate = copy.deepcopy(self.inventory)
                candidate["materials"][0]["originalUrl"] = unsafe_url
                self._write(inventory=candidate)
                with self.assertRaises(VALIDATOR.ValidationError):
                    VALIDATOR.validate_inventory(self.path, now=self.now)

    def test_indexed_material_must_not_have_a_download_url(self) -> None:
        self.inventory["materials"][1]["originalUrl"] = "/phy301/materials/example.csv"
        self._write()
        self.assert_rejected("must be null for indexed-no-download")

    def test_course_identity_must_match_the_fixed_whitelist(self) -> None:
        self.inventory["course"]["slug"] = "phy408"
        self.inventory["course"]["route"] = "/phy408/"
        self._write()
        with self.assertRaises(VALIDATOR.ValidationError) as caught:
            VALIDATOR.validate_inventory(self.path, now=self.now)
        errors = "\n".join(caught.exception.errors)
        self.assertIn("course.slug for PHY301 must be 'phy301'", errors)
        self.assertIn("course.route for PHY301 must be '/phy301/'", errors)

    def test_local_path_and_sensitive_field_are_rejected(self) -> None:
        self.inventory["inventoryNote"] = "Imported from /Users/alice/Desktop/PHY301/lecture.pptx"
        self.inventory["authToken"] = "not-for-publication"
        self._write()
        with self.assertRaises(VALIDATOR.ValidationError) as caught:
            VALIDATOR.validate_inventory(self.path, now=self.now)
        errors = "\n".join(caught.exception.errors)
        self.assertIn("local absolute filesystem path", errors)
        self.assertIn("forbidden sensitive field", errors)

    def test_original_file_name_cannot_smuggle_a_local_path(self) -> None:
        self.inventory["materials"][0]["originalFileName"] = "/opt/private/lecture-01.pptx"
        self._write()
        self.assert_rejected("must be a file name, not a filesystem path")

    def test_sha_ids_dates_and_derivative_counts_are_checked(self) -> None:
        self.inventory["materials"][0]["sha256"] = "A" * 64
        self.inventory["materials"][1]["id"] = "lecture-01"
        self.inventory["materials"][0]["derivativeCount"] = 1
        self.inventory["generatedAt"] = "2026-10-15T12:00:00Z"
        self.inventory["freshness"]["sourceAuditDate"] = "2026-10-17"
        self._write()
        with self.assertRaises(VALIDATOR.ValidationError) as caught:
            VALIDATOR.validate_inventory(self.path, now=self.now)
        errors = "\n".join(caught.exception.errors)
        self.assertIn("64 lowercase hexadecimal", errors)
        self.assertIn("duplicate id 'lecture-01'", errors)
        self.assertIn("does not match derivativeLabels length", errors)
        self.assertIn("generatedAt is too far in the future", errors)
        self.assertIn("freshness.sourceAuditDate is too far in the future", errors)

    def test_cli_returns_nonzero_when_any_input_fails(self) -> None:
        self._make_cli_current(self.inventory)
        valid_path = self.root / "valid.json"
        self._write(valid_path, copy.deepcopy(self.inventory))
        invalid = copy.deepcopy(self.inventory)
        invalid["summary"]["sourceFiles"] = 99
        invalid_path = self._write(self.root / "invalid.json", invalid)
        completed = subprocess.run(
            [sys.executable, str(MODULE_PATH), str(valid_path), str(invalid_path)],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("summary.sourceFiles", completed.stderr)

    def test_deployed_inventory_verifies_original_file_bytes_and_sha(self) -> None:
        site = self.root / "site"
        materials_dir = site / "materials"
        materials_dir.mkdir(parents=True)
        payload = b"teacher source bytes"
        original = materials_dir / "lecture-01.pptx"
        original.write_bytes(payload)

        candidate = copy.deepcopy(self.inventory)
        candidate["materials"] = [candidate["materials"][0]]
        candidate["materials"][0].update(
            originalUrl="/phy301/materials/lecture-01.pptx",
            bytes=len(payload),
            sha256=hashlib.sha256(payload).hexdigest(),
            pages=31,
        )
        candidate["summary"].update(
            sourceFiles=1,
            publishedOriginals=1,
            totalPages=31,
            categoryCounts={"lecture": 1},
        )
        deployed_inventory = self._write(
            materials_dir / "source-inventory.json", candidate
        )
        result = VALIDATOR.validate_inventory(deployed_inventory, now=self.now)
        self.assertEqual(result.published_originals, 1)

        candidate["materials"][0]["sha256"] = "c" * 64
        self._write(deployed_inventory, candidate)
        with self.assertRaises(VALIDATOR.ValidationError) as caught:
            VALIDATOR.validate_inventory(deployed_inventory, now=self.now)
        self.assertIn("sha256 does not match", "\n".join(caught.exception.errors))


if __name__ == "__main__":
    unittest.main()
