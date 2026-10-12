#!/usr/bin/env python3
"""Small, single-user learning-state API using only Python's standard library."""

from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import stat
import sys
import threading
import time
import traceback
from dataclasses import dataclass
from datetime import datetime, timezone
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

API_PREFIX = "/api/v1"
API_VERSION = "v1"
MAX_BODY_BYTES = 64 * 1024
COOKIE_NAME = "course_hub_session"
NODE_ID_RE = re.compile(r"^[A-Za-z0-9._:-]{1,128}$")
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,31}$")
PROGRESS_STATES = {"not_started", "in_progress", "core_passed", "review_passed"}
QUESTION_STATES = {"open", "answered", "archived"}
SITE_PASSWORD_SCHEME = "pbkdf2_sha256"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def token_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def decode_site_password_record(encoded: str | None) -> tuple[int, bytes, bytes] | None:
    """Decode a bounded PBKDF2 record, returning None for malformed input."""
    if not encoded:
        return None
    try:
        scheme, raw_iterations, raw_salt, raw_digest = encoded.split("$", 3)
        iterations = int(raw_iterations)
        salt = bytes.fromhex(raw_salt)
        expected = bytes.fromhex(raw_digest)
    except (TypeError, ValueError):
        return None
    if scheme != SITE_PASSWORD_SCHEME or not 100_000 <= iterations <= 1_000_000:
        return None
    if not 16 <= len(salt) <= 64 or len(expected) != 32:
        return None
    return iterations, salt, expected


def verify_site_password(value: str, encoded: str | None) -> bool:
    """Verify a PBKDF2 password record without storing the plaintext secret."""
    decoded = decode_site_password_record(encoded)
    if decoded is None:
        return False
    iterations, salt, expected = decoded
    actual = hashlib.pbkdf2_hmac("sha256", value.encode("utf-8"), salt, iterations)
    return hmac.compare_digest(actual, expected)


class ApiError(Exception):
    def __init__(self, status: int, code: str, message: str):
        super().__init__(message)
        self.status = status
        self.code = code
        self.message = message


@dataclass(frozen=True)
class AuthContext:
    mode: str
    session_hash: str | None = None
    csrf_token: str | None = None


class LoginLimiter:
    """Small in-memory guard in addition to Nginx's login rate limit."""

    def __init__(self, attempts: int = 5, window_seconds: int = 300):
        self.attempts = attempts
        self.window_seconds = window_seconds
        self._failures: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def _recent(self, key: str, now: float) -> list[float]:
        cutoff = now - self.window_seconds
        return [item for item in self._failures.get(key, []) if item >= cutoff]

    def _prune(self, now: float) -> None:
        if len(self._failures) < 2048:
            return
        cutoff = now - self.window_seconds
        stale = [key for key, values in self._failures.items() if not values or values[-1] < cutoff]
        for key in stale:
            self._failures.pop(key, None)
        while len(self._failures) > 4096:
            self._failures.pop(next(iter(self._failures)))

    def check(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            self._prune(now)
            recent = self._recent(key, now)
            self._failures[key] = recent
            if len(recent) >= self.attempts:
                raise ApiError(429, "login_rate_limited", "Too many login attempts; retry later.")

    def fail(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            self._prune(now)
            recent = self._recent(key, now)
            recent.append(now)
            self._failures[key] = recent

    def clear(self, key: str) -> None:
        with self._lock:
            self._failures.pop(key, None)


class Store:
    def __init__(self, database: Path, courses_file: Path):
        self.database = database
        self.courses = self._load_courses(courses_file)
        self.database.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    @staticmethod
    def _load_courses(path: Path) -> dict[str, dict[str, Any]]:
        payload = json.loads(path.read_text(encoding="utf-8"))
        courses: dict[str, dict[str, Any]] = {}
        for item in payload.get("courses", []):
            slug = item.get("slug", "")
            if not SLUG_RE.fullmatch(slug) or slug in courses:
                raise ValueError(f"Invalid or duplicate course slug: {slug!r}")
            courses[slug] = {
                "slug": slug,
                "code": str(item["code"]),
                "titleZh": str(item["title_zh"]),
                "titleEn": str(item["title_en"]),
                "enabled": bool(item.get("enabled", True)),
            }
        if set(courses) != {"phy301", "phy408", "phy309", "mat107"}:
            raise ValueError("Course registry must contain PHY301, PHY408, PHY309, and MAT107.")
        return courses

    def connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database, timeout=5.0)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        connection.execute("PRAGMA busy_timeout = 5000")
        return connection

    def _initialize(self) -> None:
        with self.connect() as db:
            db.execute("PRAGMA journal_mode = WAL")
            db.execute("PRAGMA synchronous = NORMAL")
            db.executescript(
                """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    version INTEGER PRIMARY KEY,
                    applied_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS courses (
                    slug TEXT PRIMARY KEY,
                    code TEXT NOT NULL UNIQUE,
                    title_zh TEXT NOT NULL,
                    title_en TEXT NOT NULL,
                    enabled INTEGER NOT NULL CHECK(enabled IN (0, 1)),
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS progress (
                    course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
                    node_id TEXT NOT NULL,
                    status TEXT NOT NULL CHECK(status IN ('not_started', 'in_progress', 'core_passed', 'review_passed')),
                    score REAL CHECK(score IS NULL OR (score >= 0 AND score <= 100)),
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY(course_slug, node_id)
                );
                CREATE TABLE IF NOT EXISTS notes (
                    course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
                    node_id TEXT NOT NULL,
                    content TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY(course_slug, node_id)
                );
                CREATE TABLE IF NOT EXISTS questions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
                    node_id TEXT,
                    question TEXT NOT NULL,
                    answer TEXT,
                    status TEXT NOT NULL CHECK(status IN ('open', 'answered', 'archived')),
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS questions_course_status
                    ON questions(course_slug, status, updated_at DESC);
                CREATE TABLE IF NOT EXISTS recent_positions (
                    course_slug TEXT PRIMARY KEY REFERENCES courses(slug) ON DELETE CASCADE,
                    node_id TEXT NOT NULL,
                    subsection TEXT,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    token_hash TEXT PRIMARY KEY,
                    csrf_token TEXT NOT NULL,
                    created_at INTEGER NOT NULL,
                    expires_at INTEGER NOT NULL,
                    last_seen_at INTEGER NOT NULL
                );
                """
            )
            now = utc_now()
            for course in self.courses.values():
                db.execute(
                    """
                    INSERT INTO courses(slug, code, title_zh, title_en, enabled, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(slug) DO UPDATE SET
                        code=excluded.code,
                        title_zh=excluded.title_zh,
                        title_en=excluded.title_en,
                        enabled=excluded.enabled,
                        updated_at=excluded.updated_at
                    """,
                    (
                        course["slug"], course["code"], course["titleZh"],
                        course["titleEn"], int(course["enabled"]), now,
                    ),
                )
            db.execute(
                "INSERT OR IGNORE INTO schema_migrations(version, applied_at) VALUES (1, ?)",
                (now,),
            )

    def ensure_course(self, slug: str) -> dict[str, Any]:
        course = self.courses.get(slug)
        if not course or not course["enabled"]:
            raise ApiError(404, "course_not_found", "Course does not exist or is disabled.")
        return course


class CourseHubServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(
        self,
        address: tuple[str, int],
        store: Store,
        root_token: str,
        session_ttl_seconds: int,
        site_password_hash: str | None = None,
    ):
        super().__init__(address, CourseHubHandler)
        self.store = store
        self.root_token = root_token
        self.site_password_hash = site_password_hash
        self.session_ttl_seconds = session_ttl_seconds
        self.login_limiter = LoginLimiter()


class CourseHubHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "CourseHubAPI/1"
    sys_version = ""

    @property
    def app(self) -> CourseHubServer:
        return self.server  # type: ignore[return-value]

    def do_GET(self) -> None:
        self._handle("GET")

    def do_POST(self) -> None:
        self._handle("POST")

    def do_PUT(self) -> None:
        self._handle("PUT")

    def do_PATCH(self) -> None:
        self._handle("PATCH")

    def do_DELETE(self) -> None:
        self._handle("DELETE")

    def do_OPTIONS(self) -> None:
        self._json(405, {"error": {"code": "method_not_allowed", "message": "CORS is not enabled; use the same origin."}})

    def log_message(self, format_string: str, *args: object) -> None:
        # Log only the URL path, never a query string, headers, cookie, or body.
        path = urlsplit(self.path).path
        safe_path = "".join(character if 32 <= ord(character) < 127 else "?" for character in path)[:512]
        status = str(args[1]) if len(args) > 1 else "-"
        sys.stderr.write(
            f"{self.client_address[0]} - - [{self.log_date_time_string()}] "
            f"{self.command} {safe_path} {status}\n"
        )

    def _handle(self, method: str) -> None:
        try:
            path = urlsplit(self.path).path
            if path in {"/healthz", f"{API_PREFIX}/health"}:
                if method != "GET":
                    raise ApiError(405, "method_not_allowed", "Only GET is allowed.")
                self._health()
                return
            if path == f"{API_PREFIX}/session" and method == "POST":
                self._create_session()
                return
            if not path.startswith(f"{API_PREFIX}/") and path != API_PREFIX:
                raise ApiError(404, "not_found", "Endpoint not found.")

            auth = self._authenticate(require_csrf=method in {"POST", "PUT", "PATCH", "DELETE"})
            if path == f"{API_PREFIX}/session":
                if method == "GET":
                    self._session_status(auth)
                elif method == "DELETE":
                    self._delete_session(auth)
                else:
                    raise ApiError(405, "method_not_allowed", "Method not allowed.")
                return

            segments = [part for part in path[len(API_PREFIX):].split("/") if part]
            if segments == ["courses"]:
                if method != "GET":
                    raise ApiError(405, "method_not_allowed", "Only GET is allowed.")
                self._list_courses()
                return
            if len(segments) < 2 or segments[0] != "courses":
                raise ApiError(404, "not_found", "Endpoint not found.")

            slug = segments[1]
            self.app.store.ensure_course(slug)
            remainder = segments[2:]
            if not remainder:
                if method != "GET":
                    raise ApiError(405, "method_not_allowed", "Only GET is allowed.")
                self._json(200, {"course": self.app.store.courses[slug]})
            elif remainder == ["snapshot"] and method == "GET":
                self._snapshot(slug)
            elif remainder[0] == "progress":
                self._progress(method, slug, remainder[1:])
            elif remainder[0] == "notes":
                self._notes(method, slug, remainder[1:])
            elif remainder[0] == "questions":
                self._questions(method, slug, remainder[1:])
            elif remainder[0] == "recent":
                self._recent(method, slug, remainder[1:])
            else:
                raise ApiError(404, "not_found", "Endpoint not found.")
        except ApiError as error:
            # An error may occur before a write body is consumed (for example,
            # failed CSRF). Close the HTTP/1.1 connection so unread bytes can
            # never be parsed as a second request.
            self.close_connection = True
            self._json(error.status, {"error": {"code": error.code, "message": error.message}})
        except (BrokenPipeError, ConnectionResetError):
            return
        except sqlite3.Error:
            self.close_connection = True
            traceback.print_exc(file=sys.stderr)
            self._json(503, {"error": {"code": "database_unavailable", "message": "Database operation failed."}})
        except Exception:
            self.close_connection = True
            traceback.print_exc(file=sys.stderr)
            self._json(500, {"error": {"code": "internal_error", "message": "Unexpected server error."}})

    def _json(self, status_code: int, payload: Any | None = None, headers: dict[str, str] | None = None) -> None:
        body = b"" if status_code == 204 else json.dumps(
            payload, ensure_ascii=False, separators=(",", ":")
        ).encode("utf-8")
        self.send_response(status_code)
        if status_code != 204:
            self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        if self.close_connection:
            self.send_header("Connection", "close")
        for key, value in (headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        if body:
            self.wfile.write(body)

    def _read_json(self) -> dict[str, Any]:
        content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
        if content_type != "application/json":
            raise ApiError(415, "unsupported_media_type", "Content-Type must be application/json.")
        raw_length = self.headers.get("Content-Length")
        if raw_length is None:
            raise ApiError(411, "length_required", "Content-Length is required.")
        try:
            length = int(raw_length)
        except ValueError as exc:
            raise ApiError(400, "invalid_content_length", "Invalid Content-Length.") from exc
        if length < 0 or length > MAX_BODY_BYTES:
            raise ApiError(413, "body_too_large", "Request body exceeds 64 KiB.")
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ApiError(400, "invalid_json", "Request body is not valid UTF-8 JSON.") from exc
        if not isinstance(payload, dict):
            raise ApiError(400, "invalid_json_shape", "JSON body must be an object.")
        return payload

    def _client_key(self) -> str:
        return self.headers.get("X-Real-IP", self.client_address[0]).split(",", 1)[0].strip()[:128]

    def _authenticate(self, require_csrf: bool) -> AuthContext:
        authorization = self.headers.get("Authorization", "")
        if authorization:
            scheme, _, value = authorization.partition(" ")
            if scheme.lower() != "bearer" or not value or not hmac.compare_digest(value, self.app.root_token):
                raise ApiError(401, "unauthorized", "Authentication failed.")
            return AuthContext(mode="bearer")

        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get("Cookie", ""))
        except Exception as exc:
            raise ApiError(401, "unauthorized", "Authentication failed.") from exc
        morsel = cookie.get(COOKIE_NAME)
        if not morsel or not morsel.value:
            raise ApiError(401, "unauthorized", "Authentication required.")
        session_hash = token_hash(morsel.value)
        now = int(time.time())
        with self.app.store.connect() as db:
            db.execute("DELETE FROM sessions WHERE expires_at <= ?", (now,))
            row = db.execute(
                "SELECT csrf_token FROM sessions WHERE token_hash=? AND expires_at>?",
                (session_hash, now),
            ).fetchone()
            if not row:
                raise ApiError(401, "session_expired", "Session is missing or expired.")
            csrf_token = str(row["csrf_token"])
            db.execute(
                "UPDATE sessions SET last_seen_at=? WHERE token_hash=?",
                (now, session_hash),
            )
        if require_csrf and not hmac.compare_digest(
            self.headers.get("X-CSRF-Token", ""), csrf_token
        ):
            raise ApiError(403, "csrf_failed", "Valid X-CSRF-Token header required.")
        return AuthContext(mode="session", session_hash=session_hash, csrf_token=csrf_token)

    def _health(self) -> None:
        with self.app.store.connect() as db:
            db.execute("SELECT 1").fetchone()
        self._json(200, {
            "status": "ok",
            "service": "course-hub-api",
            "apiVersion": API_VERSION,
            "courses": len(self.app.store.courses),
        })

    def _create_session(self) -> None:
        client_key = self._client_key()
        self.app.login_limiter.check(client_key)
        payload = self._read_json()
        supplied = payload.get("token")
        root_token_matches = isinstance(supplied, str) and hmac.compare_digest(
            supplied, self.app.root_token
        )
        site_password_matches = isinstance(supplied, str) and verify_site_password(
            supplied, self.app.site_password_hash
        )
        if not (root_token_matches or site_password_matches):
            self.app.login_limiter.fail(client_key)
            raise ApiError(401, "unauthorized", "Authentication failed.")
        self.app.login_limiter.clear(client_key)

        now = int(time.time())
        expires_at = now + self.app.session_ttl_seconds
        session_token = secrets.token_urlsafe(48)
        csrf_token = secrets.token_urlsafe(32)
        with self.app.store.connect() as db:
            db.execute("DELETE FROM sessions WHERE expires_at <= ?", (now,))
            db.execute(
                "INSERT INTO sessions(token_hash, csrf_token, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)",
                (token_hash(session_token), csrf_token, now, expires_at, now),
            )
        secure = self.headers.get("X-Forwarded-Proto", "").lower() == "https"
        cookie = (
            f"{COOKIE_NAME}={session_token}; Path=/; HttpOnly; "
            f"SameSite=Strict; Max-Age={self.app.session_ttl_seconds}"
        )
        if secure:
            cookie += "; Secure"
        self._json(201, {
            "authenticated": True,
            "csrfToken": csrf_token,
            "expiresAt": datetime.fromtimestamp(expires_at, timezone.utc).isoformat().replace("+00:00", "Z"),
        }, {"Set-Cookie": cookie})

    def _session_status(self, auth: AuthContext) -> None:
        self._json(200, {
            "authenticated": True,
            "mode": auth.mode,
            "csrfToken": auth.csrf_token,
        })

    def _delete_session(self, auth: AuthContext) -> None:
        if auth.session_hash:
            with self.app.store.connect() as db:
                db.execute("DELETE FROM sessions WHERE token_hash=?", (auth.session_hash,))
        expired = f"{COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
        if self.headers.get("X-Forwarded-Proto", "").lower() == "https":
            expired += "; Secure"
        self._json(204, headers={"Set-Cookie": expired})

    def _list_courses(self) -> None:
        courses = [course for course in self.app.store.courses.values() if course["enabled"]]
        self._json(200, {"courses": courses})

    @staticmethod
    def _node_id(raw: Any) -> str:
        if not isinstance(raw, str) or not NODE_ID_RE.fullmatch(raw):
            raise ApiError(400, "invalid_node_id", "Invalid node ID.")
        return raw

    @staticmethod
    def _text(payload: dict[str, Any], key: str, maximum: int, *, required: bool = True) -> str | None:
        value = payload.get(key)
        if value is None and not required:
            return None
        if not isinstance(value, str) or (required and not value.strip()) or len(value) > maximum:
            raise ApiError(400, f"invalid_{key}", f"{key} must be text of at most {maximum} characters.")
        return value

    def _progress(self, method: str, slug: str, tail: list[str]) -> None:
        if not tail:
            if method != "GET":
                raise ApiError(405, "method_not_allowed", "Only GET is allowed on the collection.")
            with self.app.store.connect() as db:
                rows = db.execute(
                    "SELECT node_id, status, score, updated_at FROM progress WHERE course_slug=? ORDER BY node_id",
                    (slug,),
                ).fetchall()
            self._json(200, {"items": [self._progress_row(row) for row in rows]})
            return
        if len(tail) != 1:
            raise ApiError(404, "not_found", "Endpoint not found.")
        node_id = self._node_id(tail[0])
        if method == "GET":
            with self.app.store.connect() as db:
                row = db.execute(
                    "SELECT node_id, status, score, updated_at FROM progress WHERE course_slug=? AND node_id=?",
                    (slug, node_id),
                ).fetchone()
            if not row:
                raise ApiError(404, "progress_not_found", "Progress record not found.")
            self._json(200, {"progress": self._progress_row(row)})
        elif method == "PUT":
            payload = self._read_json()
            status_value = payload.get("status")
            if status_value not in PROGRESS_STATES:
                raise ApiError(400, "invalid_status", "Invalid progress status.")
            score = payload.get("score")
            if score is not None and (isinstance(score, bool) or not isinstance(score, (int, float)) or not 0 <= score <= 100):
                raise ApiError(400, "invalid_score", "Score must be null or between 0 and 100.")
            updated_at = utc_now()
            with self.app.store.connect() as db:
                db.execute(
                    """
                    INSERT INTO progress(course_slug, node_id, status, score, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(course_slug, node_id) DO UPDATE SET
                        status=excluded.status, score=excluded.score, updated_at=excluded.updated_at
                    """,
                    (slug, node_id, status_value, score, updated_at),
                )
            self._json(200, {"progress": {"nodeId": node_id, "status": status_value, "score": score, "updatedAt": updated_at}})
        elif method == "DELETE":
            with self.app.store.connect() as db:
                db.execute("DELETE FROM progress WHERE course_slug=? AND node_id=?", (slug, node_id))
            self._json(204)
        else:
            raise ApiError(405, "method_not_allowed", "Method not allowed.")

    @staticmethod
    def _progress_row(row: sqlite3.Row) -> dict[str, Any]:
        return {"nodeId": row["node_id"], "status": row["status"], "score": row["score"], "updatedAt": row["updated_at"]}

    def _notes(self, method: str, slug: str, tail: list[str]) -> None:
        if not tail:
            if method != "GET":
                raise ApiError(405, "method_not_allowed", "Only GET is allowed on the collection.")
            with self.app.store.connect() as db:
                rows = db.execute(
                    "SELECT node_id, content, updated_at FROM notes WHERE course_slug=? ORDER BY node_id",
                    (slug,),
                ).fetchall()
            self._json(200, {"items": [self._note_row(row) for row in rows]})
            return
        if len(tail) != 1:
            raise ApiError(404, "not_found", "Endpoint not found.")
        node_id = self._node_id(tail[0])
        if method == "GET":
            with self.app.store.connect() as db:
                row = db.execute(
                    "SELECT node_id, content, updated_at FROM notes WHERE course_slug=? AND node_id=?",
                    (slug, node_id),
                ).fetchone()
            if not row:
                raise ApiError(404, "note_not_found", "Note not found.")
            self._json(200, {"note": self._note_row(row)})
        elif method == "PUT":
            payload = self._read_json()
            content = self._text(payload, "content", 20_000)
            updated_at = utc_now()
            with self.app.store.connect() as db:
                db.execute(
                    """
                    INSERT INTO notes(course_slug, node_id, content, updated_at)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(course_slug, node_id) DO UPDATE SET
                        content=excluded.content, updated_at=excluded.updated_at
                    """,
                    (slug, node_id, content, updated_at),
                )
            self._json(200, {"note": {"nodeId": node_id, "content": content, "updatedAt": updated_at}})
        elif method == "DELETE":
            with self.app.store.connect() as db:
                db.execute("DELETE FROM notes WHERE course_slug=? AND node_id=?", (slug, node_id))
            self._json(204)
        else:
            raise ApiError(405, "method_not_allowed", "Method not allowed.")

    @staticmethod
    def _note_row(row: sqlite3.Row) -> dict[str, Any]:
        return {"nodeId": row["node_id"], "content": row["content"], "updatedAt": row["updated_at"]}

    def _questions(self, method: str, slug: str, tail: list[str]) -> None:
        if not tail:
            if method == "GET":
                with self.app.store.connect() as db:
                    rows = db.execute(
                        "SELECT id, node_id, question, answer, status, created_at, updated_at FROM questions WHERE course_slug=? ORDER BY updated_at DESC, id DESC",
                        (slug,),
                    ).fetchall()
                self._json(200, {"items": [self._question_row(row) for row in rows]})
            elif method == "POST":
                payload = self._read_json()
                question = self._text(payload, "question", 5_000)
                node_id_raw = payload.get("nodeId")
                node_id = None if node_id_raw is None else self._node_id(node_id_raw)
                now = utc_now()
                with self.app.store.connect() as db:
                    cursor = db.execute(
                        "INSERT INTO questions(course_slug, node_id, question, answer, status, created_at, updated_at) VALUES (?, ?, ?, NULL, 'open', ?, ?)",
                        (slug, node_id, question, now, now),
                    )
                    question_id = cursor.lastrowid
                self._json(201, {"question": {"id": question_id, "nodeId": node_id, "question": question, "answer": None, "status": "open", "createdAt": now, "updatedAt": now}})
            else:
                raise ApiError(405, "method_not_allowed", "Method not allowed.")
            return
        if len(tail) != 1 or not tail[0].isdigit():
            raise ApiError(404, "not_found", "Endpoint not found.")
        question_id = int(tail[0])
        if method == "GET":
            with self.app.store.connect() as db:
                row = db.execute(
                    "SELECT id, node_id, question, answer, status, created_at, updated_at FROM questions WHERE course_slug=? AND id=?",
                    (slug, question_id),
                ).fetchone()
            if not row:
                raise ApiError(404, "question_not_found", "Question not found.")
            self._json(200, {"question": self._question_row(row)})
        elif method == "PATCH":
            payload = self._read_json()
            with self.app.store.connect() as db:
                current = db.execute(
                    "SELECT node_id, question, answer, status, created_at FROM questions WHERE course_slug=? AND id=?",
                    (slug, question_id),
                ).fetchone()
                if not current:
                    raise ApiError(404, "question_not_found", "Question not found.")
                question = current["question"] if "question" not in payload else self._text(payload, "question", 5_000)
                answer = current["answer"] if "answer" not in payload else self._text(payload, "answer", 20_000, required=False)
                status_value = payload.get("status", current["status"])
                if status_value not in QUESTION_STATES:
                    raise ApiError(400, "invalid_status", "Invalid question status.")
                updated_at = utc_now()
                db.execute(
                    "UPDATE questions SET question=?, answer=?, status=?, updated_at=? WHERE course_slug=? AND id=?",
                    (question, answer, status_value, updated_at, slug, question_id),
                )
            self._json(200, {"question": {
                "id": question_id,
                "nodeId": current["node_id"],
                "question": question,
                "answer": answer,
                "status": status_value,
                "createdAt": current["created_at"],
                "updatedAt": updated_at,
            }})
        elif method == "DELETE":
            with self.app.store.connect() as db:
                cursor = db.execute("DELETE FROM questions WHERE course_slug=? AND id=?", (slug, question_id))
            if cursor.rowcount == 0:
                raise ApiError(404, "question_not_found", "Question not found.")
            self._json(204)
        else:
            raise ApiError(405, "method_not_allowed", "Method not allowed.")

    @staticmethod
    def _question_row(row: sqlite3.Row) -> dict[str, Any]:
        return {
            "id": row["id"], "nodeId": row["node_id"], "question": row["question"],
            "answer": row["answer"], "status": row["status"],
            "createdAt": row["created_at"], "updatedAt": row["updated_at"],
        }

    def _recent(self, method: str, slug: str, tail: list[str]) -> None:
        if tail:
            raise ApiError(404, "not_found", "Endpoint not found.")
        if method == "GET":
            with self.app.store.connect() as db:
                row = db.execute(
                    "SELECT node_id, subsection, updated_at FROM recent_positions WHERE course_slug=?",
                    (slug,),
                ).fetchone()
            self._json(200, {"recent": None if not row else {"nodeId": row["node_id"], "subsection": row["subsection"], "updatedAt": row["updated_at"]}})
        elif method == "PUT":
            payload = self._read_json()
            node_id_raw = payload.get("nodeId")
            if not isinstance(node_id_raw, str):
                raise ApiError(400, "invalid_node_id", "nodeId is required.")
            node_id = self._node_id(node_id_raw)
            subsection = self._text(payload, "subsection", 512, required=False)
            updated_at = utc_now()
            with self.app.store.connect() as db:
                db.execute(
                    """
                    INSERT INTO recent_positions(course_slug, node_id, subsection, updated_at)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(course_slug) DO UPDATE SET
                        node_id=excluded.node_id, subsection=excluded.subsection, updated_at=excluded.updated_at
                    """,
                    (slug, node_id, subsection, updated_at),
                )
            self._json(200, {"recent": {"nodeId": node_id, "subsection": subsection, "updatedAt": updated_at}})
        else:
            raise ApiError(405, "method_not_allowed", "Method not allowed.")

    def _snapshot(self, slug: str) -> None:
        with self.app.store.connect() as db:
            progress = [self._progress_row(row) for row in db.execute(
                "SELECT node_id, status, score, updated_at FROM progress WHERE course_slug=? ORDER BY node_id", (slug,)
            ).fetchall()]
            notes = [self._note_row(row) for row in db.execute(
                "SELECT node_id, content, updated_at FROM notes WHERE course_slug=? ORDER BY node_id", (slug,)
            ).fetchall()]
            questions = [self._question_row(row) for row in db.execute(
                "SELECT id, node_id, question, answer, status, created_at, updated_at FROM questions WHERE course_slug=? ORDER BY updated_at DESC, id DESC", (slug,)
            ).fetchall()]
            recent_row = db.execute(
                "SELECT node_id, subsection, updated_at FROM recent_positions WHERE course_slug=?", (slug,)
            ).fetchone()
        recent = None if not recent_row else {"nodeId": recent_row["node_id"], "subsection": recent_row["subsection"], "updatedAt": recent_row["updated_at"]}
        self._json(200, {"course": self.app.store.courses[slug], "progress": progress, "notes": notes, "questions": questions, "recent": recent})


def read_root_token(path: Path) -> str:
    metadata = path.stat()
    if not stat.S_ISREG(metadata.st_mode):
        raise ValueError("Token path must be a regular file.")
    if stat.S_IMODE(metadata.st_mode) & 0o027:
        raise ValueError("Token file may be group-readable but not group-writable, executable, or accessible by other users.")
    value = path.read_text(encoding="utf-8").strip()
    if len(value) < 32:
        raise ValueError("Root token must contain at least 32 characters.")
    return value


def resolve_token_path(explicit: str | None) -> Path:
    if explicit:
        return Path(explicit)
    if os.environ.get("COURSE_HUB_TOKEN_FILE"):
        return Path(os.environ["COURSE_HUB_TOKEN_FILE"])
    if os.environ.get("CREDENTIALS_DIRECTORY"):
        return Path(os.environ["CREDENTIALS_DIRECTORY"]) / "api_token"
    raise ValueError("Provide --token-file or a systemd api_token credential.")


def read_site_password_hash(path: Path | None) -> str | None:
    if path is None:
        return None
    metadata = path.stat()
    if not stat.S_ISREG(metadata.st_mode):
        raise ValueError("Site password path must be a regular file.")
    if stat.S_IMODE(metadata.st_mode) & 0o027:
        raise ValueError(
            "Site password hash may be group-readable but not group-writable, "
            "executable, or accessible by other users."
        )
    encoded = path.read_text(encoding="utf-8").strip()
    if decode_site_password_record(encoded) is None:
        raise ValueError("Site password hash is malformed.")
    return encoded


def resolve_site_password_path(explicit: str | None) -> Path | None:
    if explicit:
        return Path(explicit)
    if os.environ.get("COURSE_HUB_SITE_PASSWORD_FILE"):
        return Path(os.environ["COURSE_HUB_SITE_PASSWORD_FILE"])
    if os.environ.get("CREDENTIALS_DIRECTORY"):
        candidate = Path(os.environ["CREDENTIALS_DIRECTORY"]) / "site_password"
        return candidate if candidate.exists() else None
    return None


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8787)
    parser.add_argument("--database", required=True)
    parser.add_argument("--courses", required=True)
    parser.add_argument("--token-file")
    parser.add_argument("--site-password-file")
    parser.add_argument("--session-days", type=int, default=30)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.host != "127.0.0.1":
        raise SystemExit("Refusing non-loopback bind; --host must be 127.0.0.1.")
    if not 1 <= args.port <= 65535:
        raise SystemExit("Port must be between 1 and 65535.")
    if not 1 <= args.session_days <= 90:
        raise SystemExit("Session lifetime must be between 1 and 90 days.")
    root_token = read_root_token(resolve_token_path(args.token_file))
    site_password_hash = read_site_password_hash(
        resolve_site_password_path(args.site_password_file)
    )
    store = Store(Path(args.database), Path(args.courses))
    server = CourseHubServer(
        (args.host, args.port), store, root_token, args.session_days * 86400,
        site_password_hash=site_password_hash,
    )
    print(f"course-hub-api listening on {args.host}:{server.server_port}", flush=True)
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
