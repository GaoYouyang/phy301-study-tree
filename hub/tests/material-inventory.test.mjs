import assert from "node:assert/strict";
import test from "node:test";

import { COURSES } from "../site/assets/course-config.js";
import {
  DEFAULT_INVENTORY_TIMEOUT_MS,
  filterMaterials,
  freshnessFor,
  gapsByGroup,
  InventoryRequestTimeoutError,
  InventoryValidationError,
  loadMaterialInventories,
  shortSha,
  summarizeInventories,
  validateMaterialInventory,
} from "../site/assets/material-inventory.js";

function fixture(course = COURSES[0], overrides = {}) {
  const base = {
    schemaVersion: "course-materials/v1",
    course: {
      code: course.code,
      slug: course.slug,
      route: course.route,
      nameZh: course.titleZh,
      nameEn: course.titleEn,
    },
    generatedAt: "2026-10-01T03:00:00Z",
    inventoryStatus: "verified-current-upload",
    inventoryNote: "已经核对当前线上版本。",
    summary: {
      sourceFiles: 2,
      publishedOriginals: 1,
      totalPages: 38,
      categoryCounts: { lecture: 1, assignment: 1 },
    },
    materials: [
      {
        id: `${course.slug}-lecture-01`,
        title: "Lecture 01",
        originalFileName: "lecture-01.pdf",
        category: "lecture",
        format: "pdf",
        sequence: "01",
        pages: 30,
        bytes: 1024,
        sha256: "a".repeat(64),
        sourceStatus: "published-original",
        originalUrl: `/${course.slug}/materials/lecture-01.pdf`,
        derivativeCount: 2,
        derivativeLabels: ["中文翻译", "逐页精讲"],
        note: "老师原始讲义。",
      },
      {
        id: `${course.slug}-assignment-01`,
        title: "Assignment 01",
        originalFileName: "assignment-01.pdf",
        category: "assignment",
        format: "pdf",
        sequence: "01",
        pages: 8,
        bytes: null,
        sha256: "b".repeat(64),
        sourceStatus: "indexed-no-download",
        originalUrl: null,
        derivativeCount: 0,
        derivativeLabels: [],
        note: "已登记但暂未在线提供。",
      },
    ],
    knownGaps: [
      { id: `${course.slug}-unknown-final`, label: "期末复习资料", status: "unknown", note: "是否存在待确认。" },
      { id: `${course.slug}-not-issued`, label: "第 3 次作业", status: "not-issued", note: "老师尚未发布。" },
      { id: `${course.slug}-missing`, label: "Lecture 02", status: "expected-missing", note: "课程页面已列出但未收到文件。" },
    ],
    freshness: {
      sourceAuditDate: "2026-10-01",
      suggestedReviewDays: 7,
      updateTrigger: "老师开放新权限或更新同名文件。",
    },
  };
  return Object.assign(base, overrides);
}

test("v1 inventory validator accepts the complete contract and course identity", () => {
  const course = COURSES[0];
  const payload = fixture(course);
  assert.equal(validateMaterialInventory(payload, course), payload);
});

test("validator rejects additional properties and dishonest summary counts", () => {
  const course = COURSES[0];
  const extra = fixture(course);
  extra.secret = "must-not-pass";
  assert.throws(() => validateMaterialInventory(extra, course), InventoryValidationError);

  const mismatched = fixture(course);
  mismatched.summary.publishedOriginals = 2;
  assert.throws(
    () => validateMaterialInventory(mismatched, course),
    /publishedOriginals.*published-original count/,
  );

  const wrongPages = fixture(course);
  wrongPages.summary.totalPages = 37;
  assert.throws(() => validateMaterialInventory(wrongPages, course), /sum of material pages/);

  const partialPages = fixture(course);
  partialPages.materials[1].pages = null;
  partialPages.summary.totalPages = null;
  assert.equal(validateMaterialInventory(partialPages, course), partialPages);
  partialPages.summary.totalPages = 30;
  assert.throws(
    () => validateMaterialInventory(partialPages, course),
    /must be null when any material page count is unknown/,
  );

  const wrongDerivatives = fixture(course);
  wrongDerivatives.materials[0].derivativeCount = 1;
  assert.throws(() => validateMaterialInventory(wrongDerivatives, course), /derivativeLabels.length/);
});

test("published originals need URLs while indexed-only rows must not provide one", () => {
  const course = COURSES[0];
  const missingUrl = fixture(course);
  missingUrl.materials[0].originalUrl = null;
  assert.throws(() => validateMaterialInventory(missingUrl, course), /published originals need a download URL/);

  const unexpectedUrl = fixture(course);
  unexpectedUrl.materials[1].originalUrl = "/should-not-exist.pdf";
  assert.throws(() => validateMaterialInventory(unexpectedUrl, course), /indexed-no-download must use null/);

  const unsafeUrl = fixture(course);
  unsafeUrl.materials[0].originalUrl = "javascript:alert(1)";
  assert.throws(() => validateMaterialInventory(unsafeUrl, course), /must stay under \/phy301\//);

  const traversalUrl = fixture(course);
  traversalUrl.materials[0].originalUrl = "/phy301/materials/%252e%252e/private.pdf";
  assert.throws(() => validateMaterialInventory(traversalUrl, course), /traversal path segment/);
});

test("all course inventories start in parallel and one failure stays isolated", async () => {
  const courses = COURSES.slice(0, 3);
  const started = [];
  const waiting = new Map();
  const fetchImpl = (url) => new Promise((resolve, reject) => {
    started.push(url);
    waiting.set(url, { resolve, reject });
  });

  const pending = loadMaterialInventories(courses, { fetchImpl });
  await Promise.resolve();
  assert.deepEqual(started, courses.map((course) => course.materialInventoryUrl));

  waiting.get(courses[0].materialInventoryUrl).resolve(Response.json(fixture(courses[0])));
  waiting.get(courses[1].materialInventoryUrl).reject(new TypeError("offline"));
  waiting.get(courses[2].materialInventoryUrl).resolve(Response.json(fixture(courses[2])));

  const result = await pending;
  assert.deepEqual([...result.inventories.keys()], [courses[0].slug, courses[2].slug]);
  assert.equal(result.errors.has(courses[1].slug), true);
  assert.deepEqual([...result.timedOutCourses], []);
});

test("one hung inventory aborts at its own deadline without blocking successful courses", async () => {
  const courses = COURSES.slice(0, 2);
  let hangingSignal;
  const fetchImpl = (url, options) => {
    if (url === courses[0].materialInventoryUrl) return Promise.resolve(Response.json(fixture(courses[0])));
    hangingSignal = options.signal;
    return Promise.resolve({
      ok: true,
      json: () => new Promise(() => {}),
    });
  };

  const result = await loadMaterialInventories(courses, {
    fetchImpl,
    timeoutMs: 15,
    validationNow: new Date("2026-10-14T12:00:00Z"),
  });

  assert.deepEqual([...result.inventories.keys()], [courses[0].slug]);
  assert.equal(result.errors.get(courses[1].slug) instanceof InventoryRequestTimeoutError, true);
  assert.deepEqual([...result.timedOutCourses], [courses[1].slug]);
  assert.equal(hangingSignal.aborted, true);
  assert.equal(DEFAULT_INVENTORY_TIMEOUT_MS, 8_000);
});

test("validator rejects implausibly future timestamps but tolerates clock skew", () => {
  const course = COURSES[0];
  const now = new Date(2026, 9, 14, 12, 0, 0);

  const tolerated = fixture(course);
  tolerated.generatedAt = new Date(now.getTime() + 9 * 60_000).toISOString();
  tolerated.freshness.sourceAuditDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  ).toLocaleDateString("en-CA");
  assert.equal(validateMaterialInventory(tolerated, course, { now }), tolerated);

  const generatedTooFarAhead = fixture(course);
  generatedTooFarAhead.generatedAt = new Date(now.getTime() + 11 * 60_000).toISOString();
  assert.throws(
    () => validateMaterialInventory(generatedTooFarAhead, course, { now }),
    /generatedAt.*10 minutes in the future/,
  );

  const auditTooFarAhead = fixture(course);
  auditTooFarAhead.freshness.sourceAuditDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2,
  ).toLocaleDateString("en-CA");
  assert.throws(
    () => validateMaterialInventory(auditTooFarAhead, course, { now }),
    /sourceAuditDate.*later than tomorrow/,
  );
});

test("overview totals only loaded inventories and marks unknown pages honestly", () => {
  const first = fixture(COURSES[0]);
  const second = fixture(COURSES[1]);
  second.summary.totalPages = null;
  const inventories = new Map([
    [COURSES[0].slug, first],
    [COURSES[1].slug, second],
  ]);
  const summary = summarizeInventories(COURSES, inventories, { now: new Date("2026-10-14T12:00:00Z") });

  assert.equal(summary.sourceFiles, 4);
  assert.equal(summary.publishedOriginals, 2);
  assert.equal(summary.knownPages, 38);
  assert.equal(summary.hasUnknownPages, true);
  assert.equal(summary.latestAuditDate, "2026-10-01");
  assert.equal(summary.overdueCourses, 2);
  assert.equal(summary.loadedCourses, 2);
});

test("freshness, file-name search, gap grouping, and short SHA stay explicit", () => {
  const payload = fixture();
  const freshness = freshnessFor(payload, new Date(2026, 9, 14, 12));
  assert.equal(freshness.ageDays, 13);
  assert.equal(freshness.isOverdue, true);
  assert.equal(freshness.reviewAt, "2026-10-08");

  assert.deepEqual(
    filterMaterials(payload.materials, "ASSIGNMENT").map((item) => item.originalFileName),
    ["assignment-01.pdf"],
  );
  assert.equal(
    filterMaterials([{ originalFileName: "PHY301_Mid_term_Exam.pdf" }], "midterm").length,
    1,
    "spaces and punctuation should not make an obvious file-name search fail",
  );
  assert.equal(filterMaterials(payload.materials, "中文翻译").length, 0, "search is intentionally limited to original file names");

  const groups = Object.fromEntries(gapsByGroup(payload).map((group) => [group.id, group.items.map((item) => item.status)]));
  assert.deepEqual(groups, {
    unknown: ["unknown"],
    "not-provided": ["not-issued"],
    missing: ["expected-missing"],
  });
  assert.equal(shortSha("1234567890abcdef".repeat(4)), "12345678…cdef");
});

test("freshness reminder starts on the review date, not the following day", () => {
  const payload = fixture();
  const due = freshnessFor(payload, new Date(2026, 9, 8, 12));
  assert.equal(due.ageDays, 7);
  assert.equal(due.isDueToday, true);
  assert.equal(due.isOverdue, true);
  assert.equal(due.isDueSoon, false);
  assert.equal(due.daysPastDue, 0);

  const dayBefore = freshnessFor(payload, new Date(2026, 9, 7, 12));
  assert.equal(dayBefore.isOverdue, false);
  assert.equal(dayBefore.isDueSoon, true);
});

test("course registry exposes the four fixed same-origin manifest endpoints", () => {
  assert.deepEqual(
    COURSES.map((course) => course.materialInventoryUrl),
    [
      "/phy301/materials/source-inventory.json",
      "/phy408/materials/source-inventory.json",
      "/phy309/materials/source-inventory.json",
      "/mat107/materials/source-inventory.json",
    ],
  );
});
