from __future__ import annotations

import http.client
import hashlib
import importlib.util
import json
import os
import shutil
import sqlite3
import sys
import tempfile
import threading
import unittest
from pathlib import Path


SERVICE_DIR = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("course_hub_api", SERVICE_DIR / "course_hub_api.py")
assert SPEC and SPEC.loader
api = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = api
SPEC.loader.exec_module(api)


class ApiIntegrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        root = Path(self.temp_dir.name)
        self.token = "test-root-token-" + "x" * 48
        self.site_password = "test-private-site-password"
        salt = bytes.fromhex("00112233445566778899aabbccddeeff")
        digest = hashlib.pbkdf2_hmac(
            "sha256", self.site_password.encode("utf-8"), salt, 100_000
        )
        self.site_password_hash = (
            f"pbkdf2_sha256$100000${salt.hex()}${digest.hex()}"
        )
        self.token_file = root / "token"
        self.token_file.write_text(self.token + "\n", encoding="utf-8")
        os.chmod(self.token_file, 0o600)
        self.courses_file = root / "courses.json"
        shutil.copyfile(SERVICE_DIR / "courses.json", self.courses_file)
        self.database = root / "state.sqlite3"
        store = api.Store(self.database, self.courses_file)
        self.server = api.CourseHubServer(
            ("127.0.0.1", 0), store, self.token, 86400,
            site_password_hash=self.site_password_hash,
        )
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.port = self.server.server_port
        self.cookie = ""
        self.csrf = ""

    def tearDown(self) -> None:
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=3)
        self.temp_dir.cleanup()

    def request(self, method: str, path: str, body=None, headers=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        request_headers = dict(headers or {})
        data = None
        if body is not None:
            data = json.dumps(body).encode("utf-8")
            request_headers["Content-Type"] = "application/json"
        connection.request(method, path, body=data, headers=request_headers)
        response = connection.getresponse()
        raw = response.read()
        result_headers = {key.lower(): value for key, value in response.getheaders()}
        connection.close()
        payload = None if not raw else json.loads(raw.decode("utf-8"))
        return response.status, result_headers, payload, raw

    def login(self) -> None:
        status, headers, payload, raw = self.request(
            "POST", "/api/v1/session", {"token": self.token}
        )
        self.assertEqual(status, 201)
        self.assertNotIn(self.token.encode(), raw)
        self.cookie = headers["set-cookie"].split(";", 1)[0]
        self.assertIn("httponly", headers["set-cookie"].lower())
        self.assertIn("samesite=strict", headers["set-cookie"].lower())
        self.csrf = payload["csrfToken"]
        with sqlite3.connect(self.database) as db:
            dump = "\n".join(db.iterdump())
        self.assertNotIn(self.token, dump)
        self.assertNotIn(self.cookie.split("=", 1)[1], dump)

    def session_headers(self, *, csrf: bool = False):
        headers = {"Cookie": self.cookie}
        if csrf:
            headers["X-CSRF-Token"] = self.csrf
        return headers

    def test_health_and_authentication_boundary(self) -> None:
        status, _, payload, _ = self.request("GET", "/api/v1/health")
        self.assertEqual(status, 200)
        self.assertEqual(payload["courses"], 4)

        status, _, _, _ = self.request("GET", "/api/v1/courses")
        self.assertEqual(status, 401)

        status, _, payload, _ = self.request(
            "GET", "/api/v1/courses", headers={"Authorization": f"Bearer {self.token}"}
        )
        self.assertEqual(status, 200)
        self.assertEqual({item["slug"] for item in payload["courses"]}, {"phy301", "phy408", "phy309", "mat107"})

    def test_session_csrf_and_logout(self) -> None:
        self.login()
        status, _, payload, _ = self.request(
            "GET", "/api/v1/session", headers=self.session_headers()
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload["csrfToken"], self.csrf)

        status, _, _, _ = self.request(
            "PUT", "/api/v1/courses/phy301/progress/node-01",
            {"status": "in_progress", "score": 80}, self.session_headers()
        )
        self.assertEqual(status, 403)

        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/phy301/progress/node-01",
            {"status": "in_progress", "score": 80}, self.session_headers(csrf=True)
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload["progress"]["score"], 80)

        status, headers, _, _ = self.request(
            "DELETE", "/api/v1/session", headers=self.session_headers(csrf=True)
        )
        self.assertEqual(status, 204)
        self.assertIn("max-age=0", headers["set-cookie"].lower())
        status, _, _, _ = self.request(
            "GET", "/api/v1/courses", headers=self.session_headers()
        )
        self.assertEqual(status, 401)

    def test_site_password_creates_site_wide_secure_session(self) -> None:
        status, _, _, _ = self.request(
            "POST", "/api/v1/session", {"token": "incorrect-site-password"}
        )
        self.assertEqual(status, 401)

        status, headers, payload, raw = self.request(
            "POST", "/api/v1/session", {"token": self.site_password},
            headers={"X-Forwarded-Proto": "https"},
        )
        self.assertEqual(status, 201)
        self.assertTrue(payload["authenticated"])
        cookie = headers["set-cookie"]
        self.assertIn("path=/;", cookie.lower())
        self.assertIn("httponly", cookie.lower())
        self.assertIn("samesite=strict", cookie.lower())
        self.assertIn("secure", cookie.lower())
        self.assertNotIn(self.site_password.encode(), raw)

        with sqlite3.connect(self.database) as db:
            dump = "\n".join(db.iterdump())
        self.assertNotIn(self.site_password, dump)

    def test_course_isolation_and_snapshot(self) -> None:
        self.login()
        headers = self.session_headers(csrf=True)
        for slug, content in (("phy301", "canonical note"), ("phy408", "other course note")):
            status, _, _, _ = self.request(
                "PUT", f"/api/v1/courses/{slug}/notes/shared-node",
                {"content": content}, headers
            )
            self.assertEqual(status, 200)

        for slug, expected in (("phy301", "canonical note"), ("phy408", "other course note")):
            status, _, payload, _ = self.request(
                "GET", f"/api/v1/courses/{slug}/notes/shared-node",
                headers=self.session_headers()
            )
            self.assertEqual(status, 200)
            self.assertEqual(payload["note"]["content"], expected)

        status, _, created, _ = self.request(
            "POST", "/api/v1/courses/phy301/questions",
            {"nodeId": "node-01", "question": "Why fixed N?"}, headers
        )
        self.assertEqual(status, 201)
        question_id = created["question"]["id"]
        status, _, _, _ = self.request(
            "GET", f"/api/v1/courses/phy408/questions/{question_id}",
            headers=self.session_headers()
        )
        self.assertEqual(status, 404)

        status, _, _, _ = self.request(
            "PUT", "/api/v1/courses/phy301/recent",
            {"nodeId": "node-01", "subsection": "definition"}, headers
        )
        self.assertEqual(status, 200)
        status, _, snapshot, _ = self.request(
            "GET", "/api/v1/courses/phy301/snapshot",
            headers=self.session_headers()
        )
        self.assertEqual(status, 200)
        self.assertEqual(snapshot["course"]["slug"], "phy301")
        self.assertEqual(snapshot["recent"]["nodeId"], "node-01")
        self.assertEqual(len(snapshot["notes"]), 1)
        self.assertEqual(len(snapshot["questions"]), 1)
        self.assertIsNone(snapshot["learningState"])

    def test_learning_state_aliases_etags_and_course_isolation(self) -> None:
        status, _, _, _ = self.request(
            "GET", "/api/v1/courses/PHY408/learning-state"
        )
        self.assertEqual(status, 401)
        bearer = {"Authorization": f"Bearer {self.token}"}
        status, headers, payload, raw = self.request(
            "GET", "/api/v1/courses/PHY408/learning-state", headers=bearer
        )
        self.assertEqual(status, 204)
        self.assertEqual(raw, b"")
        self.assertIsNone(payload)
        self.assertNotIn("etag", headers)
        status, _, payload, _ = self.request(
            "GET", "/api/v1/courses/PHY408/state", headers=bearer
        )
        self.assertEqual(status, 404)
        self.assertEqual(payload["error"]["code"], "learning_state_not_found")

        first = {
            "version": 1,
            "completed": ["terminal"],
            "notes": {"terminal": "自己的笔记"},
        }
        status, headers, payload, _ = self.request(
            "PUT", "/api/v1/courses/pHy408/state", first, bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, first)
        first_etag = headers["etag"]
        self.assertRegex(first_etag, r'^"[0-9a-f]{64}"$')

        status, headers, payload, _ = self.request(
            "GET", "/api/v1/courses/phy408/learning-state", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, first)
        self.assertEqual(headers["etag"], first_etag)
        status, headers, payload, _ = self.request(
            "GET", "/api/v1/courses/PHY408/state", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, first)
        self.assertEqual(headers["etag"], first_etag)
        with sqlite3.connect(self.database) as db:
            stored_slug = db.execute(
                "SELECT course_slug FROM learning_states"
            ).fetchone()[0]
        self.assertEqual(stored_slug, "phy408")

        status, _, payload, _ = self.request(
            "GET", "/api/v1/courses/PHY301/learning-state", headers=bearer
        )
        self.assertEqual(status, 204)
        self.assertIsNone(payload)

        stale_headers = {**bearer, "If-Match": '"stale"'}
        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY408/learning-state",
            {"version": 2}, stale_headers,
        )
        self.assertEqual(status, 412)
        self.assertEqual(payload["error"]["code"], "precondition_failed")

        malformed_headers = {**bearer, "If-Match": f'{first_etag}, *'}
        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY408/learning-state",
            {"version": 3}, malformed_headers,
        )
        self.assertEqual(status, 412)
        self.assertEqual(payload["error"]["code"], "precondition_failed")

        second = {"version": 2, "completed": ["terminal", "python"]}
        matching_headers = {**bearer, "If-Match": first_etag}
        status, headers, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY408/learning-state", second,
            matching_headers,
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, second)
        self.assertNotEqual(headers["etag"], first_etag)

        status, _, payload, _ = self.request(
            "GET", "/api/v1/courses/PHY408/learning-state", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, second)

        status, _, snapshot, _ = self.request(
            "GET", "/api/v1/courses/phy408/snapshot", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(snapshot["learningState"], second)
        status, _, other_snapshot, _ = self.request(
            "GET", "/api/v1/courses/phy301/snapshot", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertIsNone(other_snapshot["learningState"])

    def test_learning_state_auth_shape_size_and_unknown_course_validation(self) -> None:
        self.login()
        state_path = "/api/v1/courses/MAT107/learning-state"
        status, _, _, _ = self.request(
            "PUT", state_path, {"version": 1}, self.session_headers()
        )
        self.assertEqual(status, 403)
        status, _, payload, _ = self.request(
            "PUT", state_path, {"version": 1}, self.session_headers(csrf=True)
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, {"version": 1})

        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY309/learning-state", ["not", "an", "object"],
            self.session_headers(csrf=True),
        )
        self.assertEqual(status, 400)
        self.assertEqual(payload["error"]["code"], "invalid_json_shape")

        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY309/learning-state",
            {"invalidUnicode": "\ud800"}, self.session_headers(csrf=True),
        )
        self.assertEqual(status, 400)
        self.assertEqual(payload["error"]["code"], "invalid_json")

        bearer = {"Authorization": f"Bearer {self.token}"}
        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY309/learning-state",
            {"blob": "x" * (api.MAX_BODY_BYTES + 1)}, bearer,
        )
        self.assertEqual(status, 413)
        self.assertEqual(payload["error"]["code"], "body_too_large")

        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/UNKNOWN/learning-state", {"version": 1}, bearer
        )
        self.assertEqual(status, 404)
        self.assertEqual(payload["error"]["code"], "course_not_found")

        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY309/learning-state", {"version": 1},
            {**bearer, "If-Match": "*"},
        )
        self.assertEqual(status, 412)
        self.assertEqual(payload["error"]["code"], "precondition_failed")

        create_only_headers = {**bearer, "If-None-Match": "*"}
        status, headers, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY309/learning-state",
            {"schemaVersion": 1}, create_only_headers,
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, {"schemaVersion": 1})
        self.assertIn("etag", headers)
        status, _, payload, _ = self.request(
            "PUT", "/api/v1/courses/PHY309/learning-state",
            {"schemaVersion": 2}, create_only_headers,
        )
        self.assertEqual(status, 412)
        self.assertEqual(payload["error"]["code"], "precondition_failed")

    def test_validation_and_security_headers(self) -> None:
        self.login()
        status, headers, _, _ = self.request(
            "PUT", "/api/v1/courses/phy301/progress/bad%20node",
            {"status": "unknown"}, self.session_headers(csrf=True)
        )
        self.assertEqual(status, 400)
        self.assertEqual(headers["cache-control"], "no-store")
        self.assertEqual(headers["x-content-type-options"], "nosniff")

        status, _, _, _ = self.request(
            "GET", "/api/v1/courses/not-a-course/snapshot",
            headers=self.session_headers()
        )
        self.assertEqual(status, 404)

    def test_database_persists_across_server_restart(self) -> None:
        bearer = {"Authorization": f"Bearer {self.token}"}
        status, _, _, _ = self.request(
            "PUT", "/api/v1/courses/mat107/notes/limit",
            {"content": "persistent"}, bearer
        )
        self.assertEqual(status, 200)
        learning_state = {
            "version": 1,
            "completed": ["probability-basics"],
            "lastNode": "probability-basics",
        }
        status, headers, payload, _ = self.request(
            "PUT", "/api/v1/courses/MAT107/learning-state", learning_state, bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, learning_state)
        stored_etag = headers["etag"]
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=3)

        store = api.Store(self.database, self.courses_file)
        self.server = api.CourseHubServer(
            ("127.0.0.1", 0), store, self.token, 86400,
            site_password_hash=self.site_password_hash,
        )
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.port = self.server.server_port
        status, _, payload, _ = self.request(
            "GET", "/api/v1/courses/mat107/notes/limit", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload["note"]["content"], "persistent")
        status, headers, payload, _ = self.request(
            "GET", "/api/v1/courses/mat107/learning-state", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload, learning_state)
        self.assertEqual(headers["etag"], stored_etag)
        status, _, snapshot, _ = self.request(
            "GET", "/api/v1/courses/mat107/snapshot", headers=bearer
        )
        self.assertEqual(status, 200)
        self.assertEqual(snapshot["learningState"], learning_state)


class StaticSecurityTests(unittest.TestCase):
    def test_schema_v2_upgrade_preserves_granular_data(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            database = root / "legacy.sqlite3"
            courses_file = root / "courses.json"
            shutil.copyfile(SERVICE_DIR / "courses.json", courses_file)
            store = api.Store(database, courses_file)
            with store.connect() as db:
                db.execute(
                    "INSERT INTO notes(course_slug, node_id, content, updated_at) VALUES (?, ?, ?, ?)",
                    ("phy301", "legacy-note", "keep me", api.utc_now()),
                )
                db.execute("DROP TABLE learning_states")
                db.execute("DELETE FROM schema_migrations WHERE version=2")

            api.Store(database, courses_file)
            with sqlite3.connect(database) as db:
                note = db.execute(
                    "SELECT content FROM notes WHERE course_slug=? AND node_id=?",
                    ("phy301", "legacy-note"),
                ).fetchone()
                migration = db.execute(
                    "SELECT version FROM schema_migrations WHERE version=2"
                ).fetchone()
                table = db.execute(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='learning_states'"
                ).fetchone()
            self.assertEqual(note, ("keep me",))
            self.assertEqual(migration, (2,))
            self.assertEqual(table, ("learning_states",))

    def test_token_file_permissions_are_enforced(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            token_file = Path(directory) / "token"
            token_file.write_text("x" * 48, encoding="utf-8")
            os.chmod(token_file, 0o604)
            with self.assertRaises(ValueError):
                api.read_root_token(token_file)
            os.chmod(token_file, 0o620)
            with self.assertRaises(ValueError):
                api.read_root_token(token_file)

    def test_non_loopback_bind_is_refused_before_start(self) -> None:
        with self.assertRaises(SystemExit) as context:
            api.main([
                "--host", "0.0.0.0", "--database", "/tmp/unused.sqlite3",
                "--courses", str(SERVICE_DIR / "courses.json"),
                "--token-file", "/tmp/unused-token",
            ])
        self.assertIn("Refusing non-loopback", str(context.exception))

    def test_site_password_hash_format_and_permissions_are_enforced(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            password_file = Path(directory) / "site-password"
            salt = bytes.fromhex("00112233445566778899aabbccddeeff")
            digest = hashlib.pbkdf2_hmac("sha256", b"test-password", salt, 100_000)
            encoded = f"pbkdf2_sha256$100000${salt.hex()}${digest.hex()}"
            password_file.write_text(encoded + "\n", encoding="utf-8")
            os.chmod(password_file, 0o600)
            self.assertEqual(api.read_site_password_hash(password_file), encoded)
            self.assertTrue(api.verify_site_password("test-password", encoded))
            self.assertFalse(api.verify_site_password("wrong-password", encoded))

            os.chmod(password_file, 0o640)
            self.assertEqual(api.read_site_password_hash(password_file), encoded)
            os.chmod(password_file, 0o620)
            with self.assertRaises(ValueError):
                api.read_site_password_hash(password_file)
            os.chmod(password_file, 0o600)
            password_file.write_text("not-a-valid-record\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                api.read_site_password_hash(password_file)


if __name__ == "__main__":
    unittest.main()
