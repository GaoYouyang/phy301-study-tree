import assert from "node:assert/strict";
import test from "node:test";

import {
  CourseHubClient,
  CourseHubError,
  cloudToMastery,
  isSignedOut,
  masteryToCloud,
  mergeCloudSnapshot,
} from "../app/course-hub-client.ts";
import { blankState } from "../app/mastery-state.ts";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("PHY301 cloud adapter maps all mastery states without ambiguity", () => {
  assert.equal(masteryToCloud("new"), "not_started");
  assert.equal(masteryToCloud("learning"), "in_progress");
  assert.equal(masteryToCloud("provisional"), "core_passed");
  assert.equal(masteryToCloud("confirmed"), "review_passed");
  assert.equal(cloudToMastery("review_passed"), "confirmed");
});

test("login is same-origin and subsequent writes carry only the in-memory CSRF token", async () => {
  const calls = [];
  const client = new CourseHubClient({
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      if (url.endsWith("/session")) {
        return jsonResponse({ authenticated: true, csrfToken: "csrf-in-memory", expiresAt: "2026-11-12T00:00:00Z" }, 201);
      }
      return jsonResponse({ progress: { nodeId: "canonical", status: "in_progress", score: null, updatedAt: "2026-10-13T00:00:00Z" } });
    },
  });

  await client.login("user-entered-once");
  await client.putProgress("canonical", "in_progress");

  assert.equal(calls[0].url, "/api/v1/session");
  assert.equal(calls[0].options.credentials, "same-origin");
  assert.deepEqual(JSON.parse(calls[0].options.body), { token: "user-entered-once" });
  assert.equal(calls[0].options.headers["X-CSRF-Token"], undefined);
  assert.equal(calls[1].options.headers["X-CSRF-Token"], "csrf-in-memory");
  assert.equal(calls[1].url, "/api/v1/courses/phy301/progress/canonical");
});

test("401 is treated as signed out while network failure remains an offline condition", async () => {
  const signedOut = new CourseHubClient({
    fetchImpl: async () => jsonResponse({ error: { code: "unauthorized", message: "Authentication required." } }, 401),
  });
  await assert.rejects(signedOut.resumeSession(), (error) => isSignedOut(error));

  const offline = new CourseHubClient({ fetchImpl: async () => { throw new TypeError("offline"); } });
  await assert.rejects(
    offline.resumeSession(),
    (error) => error instanceof CourseHubError && error.code === "network_error" && !isSignedOut(error),
  );
});

test("cloud-to-local merge changes only supported fields and keeps local study evidence", () => {
  const local = {
    ...blankState,
    statuses: { "math-toolbox": "learning" },
    gateChecks: { "math-toolbox": [true, true] },
    generations: { "math-toolbox": 2 },
    notes: { "math-toolbox": "本机旧笔记" },
    reviews: [{ id: "r1", moduleId: "math-toolbox", due: "2026-10-14T00:00:00Z", label: "1 天", task: "复测", done: false }],
    errors: [{ id: "e1", moduleId: "math-toolbox", source: "练习", cause: "策略", firstStep: "", rule: "先写控制量", createdAt: "2026-10-13T00:00:00Z" }],
  };
  const snapshot = {
    course: { slug: "phy301", code: "PHY301", titleZh: "统计物理", titleEn: "Statistical Physics", enabled: true },
    progress: [
      { nodeId: "math-toolbox", status: "review_passed", score: null, updatedAt: "2026-10-13T01:00:00Z" },
      { nodeId: "unknown-node", status: "review_passed", score: null, updatedAt: "2026-10-13T01:00:00Z" },
    ],
    notes: [{ nodeId: "math-toolbox", content: "云端新笔记", updatedAt: "2026-10-13T01:00:00Z" }],
    questions: [],
    recent: { nodeId: "math-toolbox", subsection: null, updatedAt: "2026-10-13T01:00:00Z" },
  };

  const merged = mergeCloudSnapshot(local, snapshot, new Set(["math-toolbox"]));
  assert.equal(merged.statuses["math-toolbox"], "confirmed");
  assert.equal(merged.statuses["unknown-node"], undefined);
  assert.equal(merged.notes["math-toolbox"], "云端新笔记");
  assert.deepEqual(merged.gateChecks, local.gateChecks);
  assert.deepEqual(merged.reviews, local.reviews);
  assert.deepEqual(merged.errors, local.errors);
});
