import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import textwrap
import unittest


SCRIPT = Path(__file__).resolve().parents[3] / "deploy" / "scripts" / "deploy-course-package.sh"
VALIDATOR = Path(__file__).resolve().parents[1] / "validate_course_package.py"


def _write_executable(path: Path, source: str) -> None:
    path.write_text(textwrap.dedent(source).lstrip(), encoding="utf-8")
    path.chmod(0o755)


def _write_valid_package(package: Path) -> None:
    (package / "site" / "materials").mkdir(parents=True)
    (package / "site" / "index.html").write_text(
        "<!doctype html><html>initial-live-content</html>\n", encoding="utf-8"
    )
    original_bytes = b"teacher lecture source"
    (package / "site" / "materials" / "lecture.pdf").write_bytes(original_bytes)
    (package / "site" / "materials" / "source-inventory.json").write_text(
        json.dumps(
            {
                "schemaVersion": "course-materials/v1",
                "course": {
                    "code": "PHY408",
                    "slug": "phy408",
                    "route": "/phy408/",
                    "nameZh": "数据密集型科学",
                    "nameEn": "Data Intensive Science",
                },
                "generatedAt": "2026-10-14T10:00:00+08:00",
                "inventoryStatus": "verified-current-upload",
                "inventoryNote": "Snapshot fixture source inventory.",
                "summary": {
                    "sourceFiles": 1,
                    "publishedOriginals": 1,
                    "totalPages": 1,
                    "categoryCounts": {"lecture": 1},
                },
                "materials": [
                    {
                        "id": "phy408-lecture",
                        "title": "Lecture",
                        "originalFileName": "lecture.pdf",
                        "category": "lecture",
                        "format": "pdf",
                        "sequence": "Week 1",
                        "pages": 1,
                        "bytes": len(original_bytes),
                        "sha256": hashlib.sha256(original_bytes).hexdigest(),
                        "sourceStatus": "published-original",
                        "originalUrl": "/phy408/materials/lecture.pdf",
                        "derivativeCount": 0,
                        "derivativeLabels": [],
                        "note": "Teacher source.",
                    }
                ],
                "knownGaps": [],
                "freshness": {
                    "sourceAuditDate": "2026-10-14",
                    "suggestedReviewDays": 7,
                    "updateTrigger": "Teacher publishes a new source.",
                },
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (package / "source-coverage.json").write_text(
        json.dumps(
            {
                "items": [
                    {
                        "source": "lecture.pdf",
                        "sha256": "1" * 64,
                        "type": "slides",
                        "pages": 1,
                        "learningNodes": ["node-1"],
                        "outputs": ["site/index.html"],
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    (package / "qa-report.json").write_text(
        json.dumps(
            {
                "mechanical": {"status": "passed", "checks": ["build"]},
                "content": {"status": "passed", "checks": ["sequence"]},
            }
        ),
        encoding="utf-8",
    )
    (package / "README.md").write_text("# snapshot fixture\n", encoding="utf-8")
    manifest = {
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
            "command": "npm run build",
            "workingDirectory": ".",
            "outputDir": "site",
            "builtAt": "2026-10-13T10:00:00+08:00",
        },
        "inventory": {
            "sourceFiles": 1,
            "slideDecks": 1,
            "originalSlides": 1,
            "translationExplanationSlides": 1,
            "assessmentFiles": 0,
            "assessmentItems": 0,
            "learningNodes": 1,
        },
        "coverage": {
            "sourceFilesMapped": 1,
            "sourceFilesTotal": 1,
            "originalSlidesMapped": 1,
            "originalSlidesTotal": 1,
            "assessmentItemsMapped": 0,
            "assessmentItemsTotal": 0,
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
                "name": "fixture",
                "command": "npm test",
                "status": "passed",
                "evidence": "qa-report.json",
            }
        ],
        "rights": {
            "basis": "User-reported course-site permission.",
            "redistribution": "course-site-only",
        },
        "limitations": [],
    }
    (package / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    contract = [
        package / "manifest.json",
        package / "source-coverage.json",
        package / "qa-report.json",
        package / "README.md",
        package / "site" / "index.html",
        package / "site" / "materials" / "lecture.pdf",
        package / "site" / "materials" / "source-inventory.json",
    ]
    (package / "checksums.sha256").write_text(
        "".join(
            f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(package).as_posix()}\n"
            for path in contract
        ),
        encoding="utf-8",
    )


class DeployScriptContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SCRIPT.read_text(encoding="utf-8")

    def test_interrupted_upload_has_digest_guarded_resume(self) -> None:
        self.assertIn("printf 'resume\\n'", self.source)
        self.assertIn('!= "${package_sha256}"', self.source)
        self.assertIn('"${remote_state}" == "resume"', self.source)
        self.assertIn('release_id="pkg-${package_sha256}"', self.source)

    def test_rsync_uses_protected_partial_resume(self) -> None:
        self.assertIn("--partial-dir=.rsync-partial", self.source)
        self.assertIn("--exclude='.rsync-partial/'", self.source)
        self.assertIn("--delete --partial", self.source)

    def test_partial_data_is_removed_and_cannot_activate(self) -> None:
        self.assertIn("REMOTE_CLEAN_PARTIALS", self.source)
        self.assertIn('find "${partial_dir}" -mindepth 1 -delete', self.source)
        self.assertIn("Refusing activation while rsync partial data remains.", self.source)

    def test_only_validated_site_and_manifest_are_uploaded(self) -> None:
        self.assertIn('"${source_dir}/"', self.source)
        self.assertIn('"${manifest_path}"', self.source)
        self.assertIn('source_dir="${snapshot_dir}/${build_dir}"', self.source)
        self.assertIn('manifest_path="${snapshot_dir}/manifest.json"', self.source)

    def test_snapshot_is_revalidated_and_all_uploads_read_it(self) -> None:
        self.assertGreaterEqual(self.source.count('"${validator}"'), 2)
        self.assertIn('source_dir="${snapshot_dir}/${build_dir}"', self.source)
        self.assertIn('manifest_path="${snapshot_dir}/manifest.json"', self.source)
        self.assertIn('release_id="pkg-${package_sha256}"', self.source)

    def test_activation_checks_server_local_source_inventory(self) -> None:
        self.assertIn(
            'http://127.0.0.1:8080${route}materials/source-inventory.json',
            self.source,
        )
        self.assertIn("Server-local source inventory check failed", self.source)
        self.assertIn('restore_previous "${previous_target}"', self.source)
        self.assertIn('"course-materials/v1"', self.source)

    def test_external_smoke_test_checks_inventory_and_every_original(self) -> None:
        self.assertIn(
            '"${origin}${route}materials/source-inventory.json"', self.source
        )
        self.assertIn(
            'cmp -s "${inventory_path}" "${external_inventory_file}"', self.source
        )
        self.assertIn('material.get("sourceStatus") != "published-original"', self.source)
        self.assertIn('"${origin}${original_url}"', self.source)
        self.assertIn('--output /dev/null', self.source)
        self.assertIn('done <"${inventory_url_list_file}"', self.source)
        self.assertIn('curl_flags+=(--header "@${auth_header_file}")', self.source)

    def test_live_mutation_after_first_validation_cannot_reuse_old_digest(self) -> None:
        real_rsync = shutil.which("rsync")
        self.assertIsNotNone(real_rsync)
        assert real_rsync is not None

        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            package = root / "course-package"
            fake_bin = root / "fake-bin"
            temp_dir = root / "tmp"
            fake_bin.mkdir()
            temp_dir.mkdir()
            _write_valid_package(package)

            old_validation = subprocess.run(
                [sys.executable, str(VALIDATOR), str(package), "--emit-tsv"],
                check=True,
                capture_output=True,
                text=True,
            ).stdout.strip()
            old_digest = old_validation.split("\t")[-1]

            _write_executable(
                fake_bin / "python3",
                f"""
                #!{sys.executable}
                import hashlib
                import os
                from pathlib import Path
                import subprocess
                import sys

                real_python = os.environ["TEST_REAL_PYTHON"]
                validator = str(Path(os.environ["TEST_VALIDATOR"]).resolve())
                is_validator = len(sys.argv) > 1 and str(Path(sys.argv[1]).resolve()) == validator
                if not is_validator:
                    os.execv(real_python, [real_python, *sys.argv[1:]])

                result = subprocess.run(
                    [real_python, *sys.argv[1:]], capture_output=True
                )
                sys.stdout.buffer.write(result.stdout)
                sys.stderr.buffer.write(result.stderr)
                if result.returncode != 0:
                    raise SystemExit(result.returncode)

                count_path = Path(os.environ["TEST_VALIDATOR_COUNT"])
                count = int(count_path.read_text() if count_path.exists() else "0")
                with Path(os.environ["TEST_VALIDATOR_OUTPUTS"]).open("ab") as handle:
                    handle.write(result.stdout.rstrip(b"\\n") + b"\\n")
                live = Path(os.environ["TEST_LIVE_PACKAGE"])
                if count == 0:
                    (live / "site" / "index.html").write_text(
                        "<!doctype html><html>post-first-validation</html>\\n",
                        encoding="utf-8",
                    )
                    rewritten = []
                    for line in (live / "checksums.sha256").read_text(encoding="utf-8").splitlines():
                        relative = line.split("  ", 1)[1]
                        digest = hashlib.sha256((live / relative).read_bytes()).hexdigest()
                        rewritten.append(f"{{digest}}  {{relative}}")
                    (live / "checksums.sha256").write_text(
                        "\\n".join(rewritten) + "\\n", encoding="utf-8"
                    )
                elif count == 1:
                    # This is deliberately unchecksummed and happens after the
                    # immutable snapshot has passed its own validation.
                    (live / "site" / "index.html").write_text(
                        "<!doctype html><html>late-live-mutation</html>\\n",
                        encoding="utf-8",
                    )
                count_path.write_text(str(count + 1), encoding="utf-8")
                """,
            )
            _write_executable(
                fake_bin / "rsync",
                f"""
                #!{sys.executable}
                import json
                import os
                from pathlib import Path
                import sys

                destination = sys.argv[-1]
                if ":" not in destination:
                    os.execv(os.environ["TEST_REAL_RSYNC"], [os.environ["TEST_REAL_RSYNC"], *sys.argv[1:]])
                source = sys.argv[-2]
                record = {{"source": source, "destination": destination}}
                if source.endswith("/"):
                    record["index"] = (Path(source) / "index.html").read_text(encoding="utf-8")
                with Path(os.environ["TEST_RSYNC_RECORDS"]).open("a", encoding="utf-8") as handle:
                    handle.write(json.dumps(record) + "\\n")
                """,
            )
            _write_executable(
                fake_bin / "ssh",
                f"""
                #!{sys.executable}
                import json
                import os
                from pathlib import Path
                import sys

                sys.stdin.buffer.read()
                count_path = Path(os.environ["TEST_SSH_COUNT"])
                count = int(count_path.read_text() if count_path.exists() else "0")
                with Path(os.environ["TEST_SSH_RECORDS"]).open("a", encoding="utf-8") as handle:
                    handle.write(json.dumps(sys.argv[1:]) + "\\n")
                count_path.write_text(str(count + 1), encoding="utf-8")
                if count == 0:
                    print("upload")
                """,
            )
            _write_executable(
                fake_bin / "curl",
                f"""
                #!{sys.executable}
                import json
                import os
                from pathlib import Path
                import sys

                url = sys.argv[-1]
                with Path(os.environ["TEST_CURL_RECORDS"]).open("a", encoding="utf-8") as handle:
                    handle.write(json.dumps({{
                        "url": url,
                        "args": sys.argv[1:-1],
                        "tokenInEnvironment": "COURSE_HUB_AUTH_TOKEN" in os.environ,
                    }}) + "\\n")

                if url.endswith("/healthz"):
                    body = b"ok\\n"
                elif url.endswith("/materials/source-inventory.json"):
                    body = (
                        Path(os.environ["TEST_LIVE_PACKAGE"])
                        / "site"
                        / "materials"
                        / "source-inventory.json"
                    ).read_bytes()
                elif url.endswith("/materials/lecture.pdf"):
                    body = b"teacher lecture source"
                else:
                    body = b"<!doctype html><html>course</html>\\n"

                if "--output" in sys.argv:
                    output = Path(sys.argv[sys.argv.index("--output") + 1])
                    output.write_bytes(body)
                else:
                    sys.stdout.buffer.write(body)
                """,
            )

            env = os.environ.copy()
            env.update(
                {
                    "COURSE_HUB_AUTH_TOKEN": "test-token-must-not-leak",
                    "PATH": f"{fake_bin}:{os.environ.get('PATH', '')}",
                    "TMPDIR": str(temp_dir),
                    "TEST_REAL_PYTHON": sys.executable,
                    "TEST_REAL_RSYNC": real_rsync,
                    "TEST_VALIDATOR": str(VALIDATOR),
                    "TEST_LIVE_PACKAGE": str(package),
                    "TEST_VALIDATOR_COUNT": str(root / "validator-count"),
                    "TEST_VALIDATOR_OUTPUTS": str(root / "validator-outputs"),
                    "TEST_RSYNC_RECORDS": str(root / "rsync-records"),
                    "TEST_SSH_COUNT": str(root / "ssh-count"),
                    "TEST_SSH_RECORDS": str(root / "ssh-records"),
                    "TEST_CURL_RECORDS": str(root / "curl-records"),
                }
            )
            completed = subprocess.run(
                [
                    "bash",
                    str(SCRIPT),
                    "--package",
                    str(package),
                    "--target",
                    "tester@example.test",
                    "--origin",
                    "http://localhost:9999",
                ],
                env=env,
                capture_output=True,
                text=True,
            )
            self.assertEqual(completed.returncode, 0, completed.stderr)

            validator_outputs = (root / "validator-outputs").read_text(encoding="utf-8").splitlines()
            self.assertEqual(len(validator_outputs), 2)
            snapshot_digest = validator_outputs[1].split("\t")[-1]
            self.assertNotEqual(snapshot_digest, old_digest)

            ssh_calls = [
                json.loads(line)
                for line in (root / "ssh-records").read_text(encoding="utf-8").splitlines()
            ]
            self.assertIn(f"pkg-{snapshot_digest}", ssh_calls[0])
            self.assertNotIn(f"pkg-{old_digest}", ssh_calls[0])

            rsync_calls = [
                json.loads(line)
                for line in (root / "rsync-records").read_text(encoding="utf-8").splitlines()
            ]
            site_upload = next(record for record in rsync_calls if record["source"].endswith("/"))
            self.assertIn("post-first-validation", site_upload["index"])
            self.assertNotIn("late-live-mutation", site_upload["index"])
            self.assertNotIn(str(package), site_upload["source"])

            curl_calls = [
                json.loads(line)
                for line in (root / "curl-records").read_text(encoding="utf-8").splitlines()
            ]
            curl_urls = [record["url"] for record in curl_calls]
            self.assertFalse(any(record["tokenInEnvironment"] for record in curl_calls))
            self.assertNotIn("test-token-must-not-leak", json.dumps(curl_calls))
            self.assertNotIn("test-token-must-not-leak", completed.stdout)
            self.assertNotIn("test-token-must-not-leak", completed.stderr)
            self.assertIn(
                "http://localhost:9999/phy408/materials/source-inventory.json",
                curl_urls,
            )
            self.assertIn(
                "http://localhost:9999/phy408/materials/lecture.pdf", curl_urls
            )
            original_get = next(
                record
                for record in curl_calls
                if record["url"].endswith("/materials/lecture.pdf")
            )
            self.assertIn("--output", original_get["args"])
            self.assertIn("/dev/null", original_get["args"])
            self.assertFalse(list(temp_dir.glob("course-package-snapshot.*")))
            self.assertFalse(list(temp_dir.glob("course-package-snapshot-files.*")))
            self.assertFalse(list(temp_dir.glob("course-package-original-urls.*")))
            self.assertFalse(list(temp_dir.glob("course-package-external-inventory.*")))
            self.assertFalse(list(temp_dir.glob("course-hub-curl-header.*")))


if __name__ == "__main__":
    unittest.main()
