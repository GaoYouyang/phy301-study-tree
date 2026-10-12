# Security review

## Trust boundary

- Nginx is the only public listener. The API refuses any bind address other
  than `127.0.0.1`.
- The root token is generated on the server and loaded through a protected
  systemd credential. It is not part of the repository or browser bundle.
- The human site password is stored only as a salted PBKDF2-SHA256 record in a
  separate protected systemd credential.
- Browsers receive opaque HttpOnly sessions; SQLite stores only their hashes.
- Cookie-authenticated writes require a per-session CSRF value and same-origin
  operation. CORS is intentionally absent.
- Course records are keyed and queried by the route's validated course slug.

## Defensive controls

- Constant-time comparisons for root token and CSRF checks.
- 64-KiB request cap plus field-specific length and enum validation.
- Parameterized SQL, foreign keys, WAL, busy timeout, and server timestamps.
- Application and Nginx login throttling.
- No request body, Authorization header, cookie, or token logging.
- systemd privilege removal, filesystem protection, restricted address
  families, task/file limits, and a 384-MB memory ceiling.
- Online consistent backups, SHA-256 verification, integrity checks, explicit
  restore `--apply`, and automatic pre-restore safety backup.

## Accepted limitations

- This is deliberately single-user. Anyone holding the site password or root
  token has full access to all four courses.
- Public HTTP never accepts credentials: the domain and literal IP redirect to
  HTTPS. A loopback-only port is retained for local deployment checks.
- SQLite protects integrity, not disk confidentiality. Server and off-server
  backup access must remain restricted; use encrypted backup storage.
- The in-memory login limiter resets with the process. Nginx supplies an
  additional per-IP limit; the root token has high entropy and the human
  password should remain long and unique.
- Root-token rotation and site-password changes revoke every existing browser
  session. Ordinary sessions otherwise remain valid for up to 30 days unless
  explicitly logged out.

## Verification

Run from the repository:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s services/course_hub_api/tests -v
python3 services/course_hub_api/security_audit.py
for file in deploy/scripts/*.sh; do bash -n "$file"; done
```
