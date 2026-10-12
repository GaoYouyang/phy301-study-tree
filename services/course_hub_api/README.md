# Course Hub API

A dependency-free Python service for one student's learning state across four
courses on a 2-core/2-GB Ubuntu 24.04 server. It stores only mutable personal
state; course content remains in each independently deployed static site.

Registered course slugs:

- `phy301`
- `phy408`
- `phy309`
- `mat107`

Data is isolated by course slug in composite keys and every course-scoped SQL
query. The current schema stores node progress, node notes, questions/answers,
and the last reading position.

## Server installation

From a checkout containing both `deploy/` and `services/`:

```bash
sudo DEPLOY_OWNER="$USER" bash deploy/scripts/install-course-hub-api.sh
```

The installer is idempotent. It creates a non-login `coursehub` account,
generates a 384-bit random root token if one does not already exist, installs a
hardened systemd service, and enables Nginx proxying at `/api/v1/`. The Python
process is forced to bind only to `127.0.0.1:8787`; it is never a public port.

Before the first install, run `deploy/scripts/configure-private-access.sh` as
root. It stores only the salted site-password hash at
`/etc/course-hub/site-password`; the plaintext is never written to disk.

The normal browser login uses the human site password at `/access/`. Read the
root token only for maintenance, deployment health checks, or recovery:

```bash
sudo cat /etc/course-hub/api-token
```

Never copy either credential into Git, JavaScript, `NEXT_PUBLIC_*`, a URL,
analytics, or browser localStorage. The access page sends the password once to
the session endpoint and then receives an HttpOnly session cookie. See
[API.md](API.md) for the exact frontend contract.

## IP testing and the live domain

The live site should use `https://gaoyouyang.site`; DNS and the Certbot
certificate are already active. If domain routing ever needs diagnosis, the
safest IP-only test is an SSH tunnel to Nginx:

```bash
ssh -N -L 18080:127.0.0.1:8080 ubuntu@course-hub
```

Then open `http://127.0.0.1:18080/phy301-study-tree/`. Requests travel through
SSH to Nginx's loopback-only listener. The public IP's HTTP endpoint never
accepts credentials; it redirects to `https://gaoyouyang.site`.

The same relative API URLs work through the domain. The service automatically
adds `Secure` to new session cookies when Nginx reports an HTTPS request.

## Operations

```bash
# Health through the private listener and Nginx
sudo bash deploy/scripts/health-check-api.sh

# Review systemd's host-specific sandbox assessment
sudo systemd-analyze security --no-pager course-hub-api.service

# Consistent online SQLite backup (sessions are removed from the copy)
sudo bash deploy/scripts/backup-course-hub.sh

# Validate only; no data changes
sudo bash deploy/scripts/restore-course-hub.sh \
  --backup /var/backups/course-hub/course-hub-YYYYMMDDTHHMMSSZ.sqlite3

# Explicit restore, with automatic pre-restore safety backup
sudo bash deploy/scripts/restore-course-hub.sh \
  --backup /var/backups/course-hub/course-hub-YYYYMMDDTHHMMSSZ.sqlite3 \
  --apply

# Generate a new root token and revoke every browser session
sudo bash deploy/scripts/rotate-course-hub-token.sh
```

Backups are mode `0600`, include an adjacent SHA-256 file, and deliberately do
not contain the root token or live sessions. Copy backups to a separate,
encrypted location. Store the root token in a password manager; if it is lost,
rotation creates a replacement without affecting learning data.

## Resource profile

The runtime uses one Python process with threaded request handling, SQLite WAL,
a 384-MB systemd memory ceiling, and no package-manager dependencies beyond
Ubuntu's Python, Nginx, curl, and rsync. This leaves the majority of a 2-GB
instance available for static files and later course services.
