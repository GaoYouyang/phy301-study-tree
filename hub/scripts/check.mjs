import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const hubRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(hubRoot, "site");
const requiredFiles = [
  "index.html",
  "assets/styles.css",
  "assets/app.js",
  "assets/api-adapter.js",
  "assets/course-config.js",
];

for (const relative of requiredFiles) {
  const metadata = await stat(path.join(siteRoot, relative));
  assert(metadata.isFile(), `${relative} must be a file`);
}

const [html, css, app, adapter, config] = await Promise.all(
  requiredFiles.map((relative) => readFile(path.join(siteRoot, relative), "utf8")),
);

assert.match(html, /<html lang="zh-CN">/, "page language must be declared");
assert.match(html, /href="#main-content"/, "skip link is required");
assert.match(html, /aria-live="polite"/, "status changes need a live region");
assert.match(html, /<label for="login-token">/, "token input needs a visible label");
assert.equal((html.match(/data-course="/g) || []).length, 4, "exactly four course cards are required");
assert.match(css, /@media \(max-width: 390px\)/, "390px layout guard is required");
assert.match(css, /overflow-x: hidden/, "page must guard against horizontal overflow");
assert.match(app, /\.textContent\s*=/, "dynamic text must use textContent");
assert.doesNotMatch(app, /innerHTML\s*=/, "untrusted content must not use innerHTML");
assert.match(adapter, /const API_BASE = "\/api\/v1"/, "API base must be same-origin and relative");
assert.match(adapter, /credentials: "same-origin"/, "all API requests need same-origin credentials");
assert.match(adapter, /"X-CSRF-Token"/, "writes need the agreed CSRF header");
assert.doesNotMatch(`${html}\n${css}\n${app}\n${adapter}\n${config}`, /https?:\/\/\d{1,3}(?:\.\d{1,3}){3}/, "public IPs must not be embedded");
assert.doesNotMatch(`${html}\n${css}\n${app}\n${adapter}\n${config}`, /BEGIN (?:OPENSSH |RSA )?PRIVATE KEY/, "private keys must not be embedded");

for (const slug of ["phy301", "phy408", "phy309", "mat107"]) {
  assert.match(config, new RegExp(`slug: "${slug}"`), `${slug} must be registered`);
}

console.log("Hub structural checks passed: 4 courses, relative API, security and accessibility guards.");
