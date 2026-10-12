import assert from "node:assert/strict";
import test from "node:test";

import {
  API_CONTRACT,
  ApiError,
  CourseHubApi,
  isUnauthorized,
  loadSummaryCache,
  saveSummaryCache,
  summarizeSnapshot,
} from "../site/assets/api-adapter.js";
import { COURSES } from "../site/assets/course-config.js";

const phy301 = COURSES.find((course) => course.slug === "phy301");

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function createStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    keys() {
      return [...values.keys()];
    },
  };
}

test("course registry exposes exactly the four stable local routes", () => {
  assert.deepEqual(COURSES.map(({ slug }) => slug), ["phy301", "phy408", "phy309", "mat107"]);
  assert.equal(COURSES.every((course) => course.route.startsWith("/") && !course.route.startsWith("//")), true);
});

test("snapshot summary uses the known course denominator and preserves only dashboard fields", () => {
  const summary = summarizeSnapshot(
    {
      progress: [
        { nodeId: "math-toolbox", status: "review_passed", updatedAt: "2026-10-13T01:00:00Z" },
        { nodeId: "canonical", status: "core_passed", updatedAt: "2026-10-13T02:00:00Z" },
        { nodeId: "bose-gas", status: "in_progress", updatedAt: "2026-10-13T03:00:00Z" },
      ],
      notes: [{ nodeId: "canonical", content: "配分函数决定热力学量。", updatedAt: "2026-10-13T02:30:00Z" }],
      questions: [
        { id: 7, nodeId: "bose-gas", question: "为什么化学势不大于零？", status: "open", updatedAt: "2026-10-13T03:10:00Z" },
      ],
      recent: { nodeId: "bose-gas", subsection: "chemical-potential", updatedAt: "2026-10-13T03:15:00Z" },
    },
    phy301,
  );

  assert.equal(summary.completed, 2);
  assert.equal(summary.inProgress, 1);
  assert.equal(summary.percent, 11);
  assert.equal(summary.percentBasis, "course");
  assert.equal(summary.noteCount, 1);
  assert.equal(summary.openQuestionCount, 1);
  assert.equal(summary.recent.nodeId, "bose-gas");
  assert.equal("csrfToken" in summary, false);
  assert.equal("token" in summary, false);
});

test("401 is classified as signed out rather than an unavailable API", async () => {
  const api = new CourseHubApi({ fetchImpl: async () => jsonResponse({ error: { code: "unauthorized", message: "Authentication required." } }, 401) });
  await assert.rejects(
    api.resumeSession(),
    (error) => error instanceof ApiError && isUnauthorized(error) && error.code === "unauthorized",
  );
});

test("login uses same-origin credentials, then cookie writes include in-memory CSRF", async () => {
  const calls = [];
  const api = new CourseHubApi({
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      if (url.endsWith("/session")) {
        return jsonResponse({ authenticated: true, csrfToken: "session-csrf", expiresAt: "2026-11-12T00:00:00Z" }, 201);
      }
      return jsonResponse({ progress: { nodeId: "canonical", status: "in_progress", score: null, updatedAt: "2026-10-13T00:00:00Z" } });
    },
  });

  await api.login("one-time-user-input");
  await api.request("/courses/phy301/progress/canonical", { method: "PUT", body: { status: "in_progress" } });

  assert.equal(calls[0].url, "/api/v1/session");
  assert.equal(calls[0].options.credentials, "same-origin");
  assert.deepEqual(JSON.parse(calls[0].options.body), { token: "one-time-user-input" });
  assert.equal(calls[0].options.headers["X-CSRF-Token"], undefined);
  assert.equal(calls[1].options.headers["X-CSRF-Token"], "session-csrf");
  assert.equal(API_CONTRACT.base, "/api/v1");
});

test("snapshot loading isolates a failed course so other courses still render", async () => {
  const api = new CourseHubApi({
    fetchImpl: async (url) => {
      if (url.includes("/phy408/")) throw new TypeError("offline");
      const slug = url.match(/courses\/([^/]+)\/snapshot/)?.[1];
      return jsonResponse({ course: { slug }, progress: [], notes: [], questions: [], recent: null });
    },
  });

  const result = await api.loadSnapshots(["phy301", "phy408", "phy309"]);
  assert.deepEqual([...result.snapshots.keys()], ["phy301", "phy309"]);
  assert.equal(result.errors.has("phy408"), true);
});

test("API-unavailable mode can recover a sanitized course summary from local cache", () => {
  const storage = createStorage();
  const summary = summarizeSnapshot({ progress: [], notes: [], questions: [], recent: null }, phy301);
  assert.equal(saveSummaryCache(storage, summary), true);
  assert.equal(storage.keys().length, 1);
  assert.match(storage.keys()[0], /phy301$/);

  const restored = loadSummaryCache(storage, phy301);
  assert.equal(restored.slug, "phy301");
  assert.equal(restored.route, "/phy301/");
  assert.equal(restored.completed, 0);
});

test("malformed or empty snapshot data degrades to an empty, honest summary", () => {
  const summary = summarizeSnapshot(null, COURSES.find((course) => course.slug === "phy408"));
  assert.equal(summary.percent, null);
  assert.equal(summary.percentBasis, "unknown");
  assert.deepEqual(summary.notes, []);
  assert.deepEqual(summary.questions, []);
});
