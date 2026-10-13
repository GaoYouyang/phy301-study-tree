# Course Hub API v1

Base path: `/api/v1`

All non-empty responses are JSON. Successful `DELETE` requests and an absent
canonical compatibility state return `204` with no body. API responses use
`Cache-Control: no-store`. There is intentionally no CORS: course frontends
and the API must share the same origin.

## Authentication and browser session

### Login

```http
POST /api/v1/session
Content-Type: application/json

{"token":"<site access password>"}
```

On success, the server returns an HttpOnly, SameSite=Strict cookie and:

```json
{
  "authenticated": true,
  "csrfToken": "short-lived session-specific value",
  "expiresAt": "2026-11-12T12:00:00Z"
}
```

The plaintext site password is never stored or returned; the service verifies
it against a salted PBKDF2-SHA256 record loaded through a systemd credential.
Session cookies last 30 days by default, cover the whole origin (`Path=/`), and
are stored in SQLite only as SHA-256 hashes. HTTPS sessions receive the
`Secure` cookie flag. The protected root token is also accepted here for
maintenance/recovery, but normal browsers should use only the site password.

### Resume a browser session

```http
GET /api/v1/session
Cookie: course_hub_session=...
```

This returns the session's CSRF token, allowing a page reload without storing
that token persistently. Every cookie-authenticated `POST`, `PUT`, `PATCH`, or
`DELETE` must send `X-CSRF-Token`. Read-only requests need only the cookie.

CLI maintenance may instead use `Authorization: Bearer <root token>`. Bearer
requests do not need CSRF. Never put a token in a query string.

### Logout

`DELETE /api/v1/session` with the session cookie and CSRF header revokes that
session and clears the cookie.

## Health endpoint

- `GET /api/v1/health`

The loopback process does not require authentication for this endpoint so
systemd/Nginx health checks can run locally. The public Nginx route still
requires a valid site session or maintenance Bearer token. The response
contains only service status, API version, and course count—never database
paths, versions, tokens, or user data.

## Course registry

- `GET /api/v1/courses`
- `GET /api/v1/courses/{courseSlug}`

Valid slugs are `phy301`, `phy408`, `phy309`, and `mat107`. A slug from the
route is included in every data query; records never fall back to another
course.

## Whole-course learning-state compatibility endpoint

Independently built course packages may use one complete JSON object instead
of the granular resources below:

- `GET /api/v1/courses/{courseCodeOrSlug}/learning-state`
- `PUT /api/v1/courses/{courseCodeOrSlug}/learning-state`

The already-delivered PHY408 package uses the legacy aliases
`GET/PUT /api/v1/courses/{courseCodeOrSlug}/state`. They address the same row,
use the same authentication, bounds, ETag, and conditional-write rules, and
remain supported so the large static package does not need to be rebuilt.
The only legacy response difference is that an absent `GET .../state` returns
`404 learning_state_not_found`, which that client treats as a fresh state;
an absent `GET .../learning-state` returns `204` for PHY309 and MAT107.

For these compatibility routes only, the registry code or slug is accepted
case-insensitively (`PHY408`, `phy408`, and `pHy408` all resolve to the exact
registry slug `phy408`). Unknown or disabled courses return `404`; arbitrary
course identifiers are never created.

`GET .../learning-state` returns `204 No Content` until that course has been
written. Once present, it returns the stored JSON object directly with a strong
`ETag` header. `PUT` accepts exactly one JSON object of at most 64 KiB, returns
the normalized stored object and its `ETag` with `200 OK`. Arrays, scalar JSON,
invalid JSON, and oversized objects are rejected.

To prevent a stale browser from overwriting a newer save, pass the ETag read
from the latest GET or PUT:

```http
PUT /api/v1/courses/PHY408/learning-state
Content-Type: application/json
X-CSRF-Token: <current session token>
If-Match: "8c4f..."

{"version":1,"completed":["terminal"],"notes":{}}
```

A mismatched `If-Match`, or any `If-Match` when no state exists yet, returns
`412 Precondition Failed` without changing the saved object. Omitting
`If-Match` intentionally performs an unconditional upsert. `If-Match: *` is
accepted only when a state already exists. Cookie-authenticated PUT requests
need the same CSRF header as every other write; maintenance Bearer requests do
not.

For an atomic first save after a `204`, a future client may send
`If-None-Match: *`; the write succeeds only while no state exists. A second
conditional create returns `412`. Other `If-None-Match` values and requests
that combine it with `If-Match` are rejected. The currently delivered clients
omit this header on their first save, so those initial writes intentionally use
the documented unconditional-upsert behavior.

This table is an additive compatibility store. Installing the schema preserves
all existing progress, notes, questions, recent positions, and sessions. It
does not synthesize a compatibility object from those granular records or copy
the compatibility object back into them. Therefore the canonical compatibility
GET for an upgraded existing course returns `204` until its frontend performs
its first PUT. Both storage models then persist independently across service
restarts and backups.

## Progress

- `GET /api/v1/courses/{slug}/progress`
- `GET /api/v1/courses/{slug}/progress/{nodeId}`
- `PUT /api/v1/courses/{slug}/progress/{nodeId}`
- `DELETE /api/v1/courses/{slug}/progress/{nodeId}`

PUT body:

```json
{"status":"in_progress","score":72}
```

Allowed statuses: `not_started`, `in_progress`, `core_passed`, and
`review_passed`. Score is optional and must be 0–100.

## Node notes

- `GET /api/v1/courses/{slug}/notes`
- `GET /api/v1/courses/{slug}/notes/{nodeId}`
- `PUT /api/v1/courses/{slug}/notes/{nodeId}` with `{"content":"..."}`
- `DELETE /api/v1/courses/{slug}/notes/{nodeId}`

Notes are limited to 20,000 characters.

## Questions

- `GET /api/v1/courses/{slug}/questions`
- `POST /api/v1/courses/{slug}/questions`
- `GET /api/v1/courses/{slug}/questions/{id}`
- `PATCH /api/v1/courses/{slug}/questions/{id}`
- `DELETE /api/v1/courses/{slug}/questions/{id}`

Create body:

```json
{"nodeId":"canonical-ensemble","question":"为什么这里要固定 N？"}
```

`nodeId` may be omitted. PATCH accepts any of `question`, `answer`, or
`status`; allowed statuses are `open`, `answered`, and `archived`.

## Recent reading position

- `GET /api/v1/courses/{slug}/recent`
- `PUT /api/v1/courses/{slug}/recent`

PUT body:

```json
{"nodeId":"canonical-ensemble","subsection":"partition-function"}
```

## Initial synchronization

- `GET /api/v1/courses/{slug}/snapshot`

Returns the registry entry plus all progress, notes, questions, and the recent
position for that one course. The response also includes `learningState`: the
stored compatibility object for that exact course, or `null` when absent. The
hub may inspect this field as schema-specific read-only data; the API does not
guess or translate individual course fields. It is the recommended first
request after login. Writes remain small idempotent PUTs so the frontend can
retry them safely.

## Frontend integration contract

1. Use same-origin relative URLs such as `/api/v1/courses/phy301/snapshot`.
2. On page load, call `GET /api/v1/session` with
   `credentials: "same-origin"`. Nginx normally redirects an unauthenticated
   page navigation to `/access/`; a direct API 401 means the session expired.
3. Keep the user-entered site password only in the access form's in-memory
   state. POST it once, then clear the field and state.
4. Keep the returned CSRF token in memory. After a reload, obtain it again
   from `GET /api/v1/session`; do not use localStorage.
5. Include `credentials: "same-origin"` on every API request and
   `X-CSRF-Token` on every write.
6. The current browser-local PHY301 state should be imported explicitly after
   the user confirms. Server values are authoritative after import; timestamps
   are server-generated and current conflict handling is last successful write.
7. Namespace every client cache by course slug. Never infer the active course
   from a record returned for a different slug.
8. Render note, question, and answer values as text, never as trusted HTML.

Minimal write helper:

```js
async function apiWrite(path, method, body, csrfToken) {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.status === 204 ? null : response.json();
}
```

## Errors and limits

Errors use `{"error":{"code":"...","message":"..."}}`. Important statuses:

- `400` invalid field or JSON
- `401` missing/invalid/expired authentication
- `403` missing/invalid CSRF token
- `404` unknown course, record, or endpoint
- `412` stale or otherwise unsatisfied `If-Match`
- `413` body over 64 KiB
- `415` non-JSON write
- `429` login rate limit
- `503` SQLite unavailable

Node IDs are limited to 128 ASCII letters, digits, dots, underscores, colons,
or hyphens. The service intentionally has no file-upload or arbitrary SQL API.
