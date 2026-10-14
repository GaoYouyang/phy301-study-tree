# PHY301 on Tencent Lighthouse

This bundle serves the existing GitHub Pages build in `docs/` from the new
Ubuntu 24.04 Lighthouse instance. It is deliberately small: Ubuntu's Nginx,
atomic release directories, a `current` symlink, a health check, and an
explicit rollback command.

Important: moving the current build to this server does **not** by itself make
the site dynamic. It gives us a server on which a future Next.js/API process,
database, authentication, and the other three courses can be added without
changing providers.

## Layout

```text
/srv/learning-hub/courses/phy301/
  current -> releases/<release-id>
  releases/<release-id>/phy301-study-tree/...
  releases/<release-id>/phy301 -> phy301-study-tree
/srv/learning-hub/hub/
  current -> releases/<release-id>
/srv/learning-hub/courses/{phy408,phy309,mat107}/
  current -> releases/<release-id>
```

The extra `phy301-study-tree` directory is intentional. The checked-in
`docs/` build currently contains that GitHub Pages base path. Until the hub is
deployed, Nginx sends the root to `/phy301-study-tree/`, so the same build
works without rewriting generated HTML. The stable `/phy301/` entry also
resolves through a release-local relative symlink to that legacy tree until a
native `/phy301/` package exists. This keeps `/phy301/materials/source-inventory.json`
and every original-material download on the same immutable release as the
course page, without changing generated asset paths.

## 1. One-time server bootstrap

The site is private. Before the first bootstrap, create its password-only
credential interactively. The input is hidden and only a salted PBKDF2-SHA256
record is stored on the server:

```bash
sudo bash deploy/scripts/configure-private-access.sh
```

There is no username. Keep the password in a password manager. The plaintext
password must never be added to this repository, a command line, JavaScript,
or a deployment log. Browsers enter it only on `/access/` and receive an
HttpOnly, Secure, SameSite=Strict session cookie for the whole origin. Changing
the password revokes existing browser sessions. The ACME certificate-renewal
route remains public, while the hub, course pages, downloads, and API require
authentication.

Password rotation is transactional: if the API is running, the rotation
stops it before replacing the hash or touching SQLite, revokes sessions as the
unprivileged `coursehub` account, and starts it only after both operations
succeed. A failed restart restores the previous hash and prior service state;
revoked sessions intentionally stay revoked.

Copy this `deploy/` directory to the server, then run the bootstrap from the
server account that should own future releases:

```bash
sudo DEPLOY_OWNER="$USER" bash deploy/scripts/bootstrap-ubuntu.sh
```

The script is idempotent. It installs `nginx`, `rsync`, `curl`, and
`ca-certificates` from Ubuntu packages, installs the Nginx vhost, verifies the
configuration, and reloads Nginx. It does not alter SSH configuration, delete
the default vhost, enable UFW, or create credentials.

The Ubuntu default vhost may remain enabled: this vhost is not declared as a
second `default_server`, and requests whose Host is the public IP or either
configured domain match this vhost by name. A comment-only include placeholder
is installed so the future-route glob is valid even before any API exists.

If UFW is already active, inspect the warning. Only if SSH access has already
been verified may you ask the bootstrap to add the standard rules:

```bash
sudo CONFIGURE_UFW=1 DEPLOY_OWNER="$USER" bash deploy/scripts/bootstrap-ubuntu.sh
```

Independently, the Tencent Lighthouse firewall must allow inbound TCP 80 and
443. Keep TCP 22 allowed from a trusted source so SSH remains recoverable.

## 2. Deploy the current static build

Run this from the repository on the Mac. Replace `ubuntu` if the instance uses
a different SSH account; the script uses the existing SSH agent/key or normal
interactive SSH flow and stores no password.

```bash
COURSE_HUB_AUTH_TOKEN="$TOKEN_FROM_PASSWORD_MANAGER" \
  bash deploy/scripts/deploy-static.sh \
  --target ubuntu@course-hub \
  --url https://gaoyouyang.site/phy301-study-tree/
unset COURSE_HUB_AUTH_TOKEN
```

`course-hub` may be an entry in `~/.ssh/config`; both `ssh` and `rsync` honor
that alias. A literal `ubuntu@150.109.55.123` target works as well.

The script uploads `docs/` into an immutable release, atomically changes the
`current` symlink, and checks the new version through both local Nginx and the
public URL. An external HTTPS check fails before SSH unless the maintenance
token is present. If either post-switch check fails, the script restores the
previous symlink; after an external failure it also verifies the restored
release through server-local Nginx. The public check also reads the stable
`/phy301/materials/source-inventory.json` and performs a real authenticated GET
for every listed downloadable original, so a missing deck cannot pass on the
strength of the homepage alone. It never deletes old releases. Reusing an
explicit release ID is a no-op against the already immutable release:

```bash
COURSE_HUB_AUTH_TOKEN="$TOKEN_FROM_PASSWORD_MANAGER" \
  bash deploy/scripts/deploy-static.sh \
  --target ubuntu@150.109.55.123 \
  --release 20261013-initial
unset COURSE_HUB_AUTH_TOKEN
```

## 3. Verify or roll back

External health checks authenticate with the maintenance token, not the human
site password. Load it from a password manager into the environment without
placing it on the command line, then clear it afterward. The checker writes the
header to a mode-`0600` temporary file, removes the environment variable before
starting `curl`, and deletes the file on exit, so the token is never present in
`curl`'s process arguments:

```bash
COURSE_HUB_AUTH_TOKEN="$TOKEN_FROM_PASSWORD_MANAGER" \
  bash deploy/scripts/health-check.sh \
    https://gaoyouyang.site/phy301-study-tree/
unset COURSE_HUB_AUTH_TOKEN

# Preview which release would be selected; this does not change the server.
bash deploy/scripts/rollback-static.sh \
  --target ubuntu@150.109.55.123 --previous

# Apply the reviewed rollback atomically.
bash deploy/scripts/rollback-static.sh \
  --target ubuntu@150.109.55.123 --previous --apply
```

To choose a specific release, use `--release <release-id>` instead of
`--previous`.

## 4. Domain and HTTPS

The domain review is complete, `@` and `www` point to `150.109.55.123`, and
Certbot has already issued the certificate under
`/etc/letsencrypt/live/gaoyouyang.site/`. The commands below are retained only
for rebuilding a fresh server; do not request another certificate on the
current instance:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d gaoyouyang.site -d www.gaoyouyang.site
```

Do not request the certificate before DNS resolves; issuance will fail. The
health checker accepts the final HTTPS course URL unchanged.

Once a certificate exists, `bootstrap-ubuntu.sh` automatically selects the
TLS-aware template instead of the HTTP template. Before its first migration it
preserves Certbot's exact vhost as
`/etc/nginx/sites-available/phy301-study-tree.conf.pre-course-hub`; every
replacement is tested and rolled back on failure. Verify the live result with:

```bash
sudo bash deploy/scripts/verify-course-hub-tls.sh
# Optional; performs a real Certbot staging renewal attempt:
sudo bash deploy/scripts/verify-course-hub-tls.sh --renewal-dry-run
```

## 5. Shared dynamic state and four-course expansion

The implemented Course Hub API shares progress, notes, questions, and recent
positions across four isolated course slugs. Install it without changing the
static release:

```bash
sudo DEPLOY_OWNER="$USER" bash deploy/scripts/install-course-hub-api.sh
```

The service listens only on `127.0.0.1:8787`; Nginx exposes the versioned
same-origin path `/api/v1/`. Authentication secrets stay in a protected server
file/systemd credential. See `services/course_hub_api/README.md` and
`services/course_hub_api/API.md` for operations and the frontend contract.

The domain root is reserved for `/srv/learning-hub/hub/current`. Until its
`index.html` exists, `/` falls back to the current PHY301 page. Stable prefixes
`/phy301/`, `/phy408/`, `/phy309/`, and `/mat107/` map to independent release
trees; the legacy build remains at `/phy301-study-tree/` during migration.

Deploy the dependency-free shared dashboard independently from the courses:

```bash
COURSE_HUB_AUTH_TOKEN="$TOKEN_FROM_PASSWORD_MANAGER" \
  bash deploy/scripts/deploy-hub.sh \
  --target ubuntu@course-hub \
  --url https://gaoyouyang.site \
  --check-api
unset COURSE_HUB_AUTH_TOKEN
```

This uploads `hub/site/` into an immutable hub release, switches its `current`
symlink atomically, and restores the prior hub release if either the
server-local or authenticated public check fails. A public-check rollback is
followed by another server-local check of the restored hub.
