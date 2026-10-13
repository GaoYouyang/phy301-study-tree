import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  COURSES,
  courseAvailabilityPresentation,
} from "../site/assets/course-config.js";

const hubRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(hubRoot, "site");

function contentVersion(source) {
  return createHash("sha256").update(source).digest("hex").slice(0, 12);
}

test("all deployed courses expose a ready badge presentation", () => {
  assert.equal(COURSES.length, 4);
  assert.equal(COURSES.every((course) => course.availability === "ready"), true);
  assert.deepEqual(courseAvailabilityPresentation("ready"), {
    label: "内容已上线",
    className: "course-state--ready",
  });
  assert.deepEqual(courseAvailabilityPresentation("building"), {
    label: "学习站建设中",
    className: "course-state--building",
  });
  assert.deepEqual(
    courseAvailabilityPresentation("unexpected"),
    courseAvailabilityPresentation("building"),
    "unknown availability must fail closed",
  );
});

test("course badge markup is controlled by course availability", async () => {
  const [html, app] = await Promise.all([
    readFile(path.join(siteRoot, "index.html"), "utf8"),
    readFile(path.join(siteRoot, "assets/app.js"), "utf8"),
  ]);

  assert.equal((html.match(/data-role="course-state"/g) || []).length, COURSES.length);
  assert.equal((html.match(/>内容已上线<\/span>/g) || []).length, COURSES.length);
  assert.match(app, /courseAvailabilityPresentation\(course\.availability\)/);
  assert.match(app, /courseState\.textContent = availability\.label/);
});

test("entry module and direct dependencies use content-derived cache keys", async () => {
  const [html, app, adapter, config] = await Promise.all([
    readFile(path.join(siteRoot, "index.html"), "utf8"),
    readFile(path.join(siteRoot, "assets/app.js"), "utf8"),
    readFile(path.join(siteRoot, "assets/api-adapter.js"), "utf8"),
    readFile(path.join(siteRoot, "assets/course-config.js"), "utf8"),
  ]);

  const appVersion = html.match(/src="\.\/assets\/app\.js\?v=([0-9a-f]{12})"/)?.[1];
  const adapterVersion = app.match(/from "\.\/api-adapter\.js\?v=([0-9a-f]{12})"/)?.[1];
  const configVersion = app.match(/from "\.\/course-config\.js\?v=([0-9a-f]{12})"/)?.[1];

  assert.equal(appVersion, contentVersion(app), "index.html must pin the current app.js bytes");
  assert.equal(adapterVersion, contentVersion(adapter), "app.js must pin the current api-adapter.js bytes");
  assert.equal(configVersion, contentVersion(config), "app.js must pin the current course-config.js bytes");
});
