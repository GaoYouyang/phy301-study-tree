#!/usr/bin/env python3
"""Static deployment security assertions; exits nonzero on a regression."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
APP = (ROOT / "services/course_hub_api/course_hub_api.py").read_text(encoding="utf-8")
UNIT = (ROOT / "deploy/systemd/course-hub-api.service").read_text(encoding="utf-8")
PROXY = (ROOT / "deploy/nginx/locations-enabled/10-course-hub-api.conf").read_text(encoding="utf-8")
INSTALLER = (ROOT / "deploy/scripts/install-course-hub-api.sh").read_text(encoding="utf-8")
BOOTSTRAP = (ROOT / "deploy/scripts/bootstrap-ubuntu.sh").read_text(encoding="utf-8")
TLS_VHOST = (ROOT / "deploy/nginx/phy301-study-tree-tls.conf").read_text(encoding="utf-8")
LOCATIONS = (ROOT / "deploy/nginx/server-locations.conf").read_text(encoding="utf-8")
PASSWORD_SETUP = (ROOT / "deploy/scripts/configure-private-access.sh").read_text(encoding="utf-8")
DEPLOY_HEALTH = (ROOT / "deploy/scripts/health-check.sh").read_text(encoding="utf-8")
HUB_HEALTH = (ROOT / "hub/scripts/health-check.sh").read_text(encoding="utf-8")
TLS_VERIFY = (ROOT / "deploy/scripts/verify-course-hub-tls.sh").read_text(encoding="utf-8")
ACCESS_PAGE = (ROOT / "hub/site/access/index.html").read_text(encoding="utf-8")
REGISTRY = json.loads((ROOT / "services/course_hub_api/courses.json").read_text(encoding="utf-8"))


def contains_in_order(content: str, *needles: str) -> bool:
    cursor = 0
    for needle in needles:
        position = content.find(needle, cursor)
        if position < 0:
            return False
        cursor = position + len(needle)
    return True


PASSWORD_TRANSACTION = PASSWORD_SETUP[PASSWORD_SETUP.index("transaction_started=1") :]


checks = {
    "application refuses non-loopback bind": 'args.host != "127.0.0.1"' in APP,
    "systemd binds loopback": "--host 127.0.0.1 --port 8787" in UNIT,
    "Nginx proxies only to loopback": "proxy_pass http://127.0.0.1:8787" in PROXY and "0.0.0.0" not in PROXY,
    "systemd loads protected credential": "LoadCredential=api_token:/etc/course-hub/api-token" in UNIT,
    "systemd loads private-site hash": "LoadCredential=site_password:/etc/course-hub/site-password" in UNIT,
    "source token remains root-only": 'chown root:root "${token_path}"' in INSTALLER and 'chmod 0600 "${token_path}"' in INSTALLER,
    "private-site hash remains root-only": 'chown root:root "${site_password_path}"' in INSTALLER and 'chmod 0600 "${site_password_path}"' in INSTALLER,
    "service has no privilege escalation": "NoNewPrivileges=true" in UNIT and "CapabilityBoundingSet=\n" in UNIT,
    "service filesystem is protected": "ProtectSystem=strict" in UNIT and "ReadWritePaths=/var/lib/course-hub" in UNIT,
    "browser wildcard CORS absent": "Access-Control-Allow-Origin" not in APP and "Access-Control-Allow-Origin" not in PROXY,
    "request size is bounded": "MAX_BODY_BYTES = 64 * 1024" in APP and "client_max_body_size 64k" in PROXY,
    "cookie is HttpOnly and SameSite strict": "HttpOnly" in APP and "SameSite=Strict" in APP,
    "session cookie protects the whole origin": 'Path=/; HttpOnly' in APP,
    "site content uses session auth request": (
        all(item in LOCATIONS for item in (
            "auth_request /_course_site_auth;",
            "error_page 401 = @private_login;",
            "proxy_set_header Authorization $http_authorization;",
            "location = /access/",
        ))
        and "location ^~ /access/" not in LOCATIONS
        and "try_files /access/index.html =404;" in LOCATIONS
    ),
    "health endpoint cannot bypass the private gate": (
        'location = /healthz {' in LOCATIONS
        and "try_files /healthz =404;" in LOCATIONS
        and 'return 200 "ok\\n";' not in LOCATIONS
        and (ROOT / "hub/site/healthz").read_text(encoding="utf-8") == "ok\n"
    ),
    "anonymous login endpoint is narrowly exempt": all(item in PROXY for item in (
        "location = /api/v1/session",
        "allow all;",
        "auth_request off;",
    )),
    "password form cannot fall back to a URL query": all(item in ACCESS_PAGE for item in (
        'method="post"',
        'action="/api/v1/session"',
        'name="token"',
    )),
    "post-login redirect remains same-origin": all(item in ACCESS_PAGE for item in (
        r"/[\u0000-\u0020\u007f]/.test(candidate)",
        "new URL(candidate, window.location.origin)",
        "destination.origin !== window.location.origin",
        'destination.pathname.startsWith("/access/")',
    )),
    "site password rotation revokes old sessions": (
        all(item in PASSWORD_SETUP for item in (
            'hashlib.pbkdf2_hmac("sha256"',
            'connection.execute("DELETE FROM sessions")',
            'install -o root -g root -m 0600 "${credential_backup}" "${credential_file}"',
            "trap - ERR INT TERM HUP",
        ))
        and contains_in_order(
            PASSWORD_TRANSACTION,
            'systemctl stop "${service}"',
            'mv -f "${credential_temp}" "${credential_file}"',
            'runuser -u coursehub -- python3',
            'systemctl start "${service}"',
        )
    ),
    "external checks keep Bearer token out of curl argv": all(
        all(item in script for item in (
            'chmod 0600 "${auth_header_file}"',
            'unset COURSE_HUB_AUTH_TOKEN',
            '--header "@${auth_header_file}"',
            'trap cleanup EXIT',
        ))
        and '-H "Authorization: Bearer ${COURSE_HUB_AUTH_TOKEN}"' not in script
        for script in (DEPLOY_HEALTH, HUB_HEALTH)
    ),
    "loopback TLS verification needs no maintenance token": (
        "/etc/course-hub/api-token" not in TLS_VERIFY
        and "Authorization: Bearer" not in TLS_VERIFY
        and "--noproxy '*'" in TLS_VERIFY
    ),
    "plaintext public HTTP never serves the login form": all(item in TLS_VHOST for item in (
        "return 301 https://gaoyouyang.site$request_uri;",
        "listen 127.0.0.1:8080;",
    )),
    "course registry is exact": {item["slug"] for item in REGISTRY["courses"]} == {"phy301", "phy408", "phy309", "mat107"},
    "TLS vhost uses the issued Certbot certificate": all(item in TLS_VHOST for item in (
        "/etc/letsencrypt/live/gaoyouyang.site/fullchain.pem",
        "/etc/letsencrypt/live/gaoyouyang.site/privkey.pem",
        "/etc/letsencrypt/options-ssl-nginx.conf",
    )),
    "bootstrap preserves live TLS configuration": all(item in BOOTSTRAP for item in (
        ".pre-course-hub",
        "Existing vhost contains TLS",
        "previous live vhost restored",
    )),
    "stable PHY301 route has a legacy fallback": all(item in LOCATIONS for item in (
        "location = /phy301/",
        "@legacy_phy301_stable",
        "return 308 /phy301-study-tree/",
    )),
}

failed = [name for name, passed in checks.items() if not passed]
for name, passed in checks.items():
    print(f"{'PASS' if passed else 'FAIL'}: {name}")
if failed:
    raise SystemExit(f"Security audit failed: {', '.join(failed)}")
print(f"Security audit passed ({len(checks)} checks).")
