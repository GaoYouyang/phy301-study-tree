import assert from "node:assert/strict";
import test from "node:test";

import { modules } from "../app/course-data.ts";
import {
  blankState,
  enforceMasteryInvariants,
  safeParseState,
  transitionReviewState,
} from "../app/mastery-state.ts";

const now = new Date("2026-01-10T12:00:00.000Z");

function freshState() {
  return {
    ...blankState,
    statuses: {},
    gateChecks: {},
    generations: {},
    notes: {},
    reviews: [],
    errors: [],
    diagnosticAnswers: {},
  };
}

function completeGate(moduleId) {
  const studyModule = modules.find((item) => item.id === moduleId);
  assert.ok(studyModule);
  return studyModule.gate.criteria.map(() => true);
}

test("forged mastery is downgraded when gate evidence is missing", () => {
  const state = freshState();
  state.statuses["math-toolbox"] = "confirmed";

  const normalized = enforceMasteryInvariants(state, now);
  assert.equal(normalized.statuses["math-toolbox"], "learning");
  assert.equal(normalized.generations["math-toolbox"], 1);
});

test("confirmed requires a passed current-generation three-day review", () => {
  const state = freshState();
  state.statuses["math-toolbox"] = "confirmed";
  state.gateChecks["math-toolbox"] = completeGate("math-toolbox");
  state.generations["math-toolbox"] = 2;
  state.reviews.push({
    id: "three-day-pass",
    moduleId: "math-toolbox",
    due: "2026-01-10T11:00:00.000Z",
    label: "3 天",
    task: "变式复测",
    done: true,
    result: "pass",
    generation: 2,
  });

  const valid = enforceMasteryInvariants(state, now);
  assert.equal(valid.statuses["math-toolbox"], "confirmed");

  const stale = enforceMasteryInvariants(
    {
      ...state,
      generations: { "math-toolbox": 3 },
    },
    now,
  );
  assert.equal(stale.statuses["math-toolbox"], "learning");
});

test("a failed three-day review cannot be used to confirm", () => {
  const state = freshState();
  state.statuses["math-toolbox"] = "provisional";
  state.gateChecks["math-toolbox"] = completeGate("math-toolbox");
  state.generations["math-toolbox"] = 0;
  state.reviews.push({
    id: "three-day",
    moduleId: "math-toolbox",
    due: "2026-01-10T11:00:00.000Z",
    label: "3 天",
    task: "变式复测",
    done: false,
    generation: 0,
  });

  const failed = transitionReviewState(state, "three-day", "retry", now);
  assert.equal(failed.statuses["math-toolbox"], "provisional");
  assert.equal(failed.generations["math-toolbox"], 1);
  assert.equal(
    failed.reviews.find((item) => item.id === "three-day")?.result,
    "retry",
  );
  const retry = failed.reviews.find((item) => item.label === "补救 1 天");
  assert.ok(retry);
  assert.equal(retry.generation, 1);
  assert.notEqual(failed.statuses["math-toolbox"], "confirmed");
});

test("failed review recovers through a new one-day retry and new three-day proof", () => {
  const state = freshState();
  state.statuses["math-toolbox"] = "provisional";
  state.gateChecks["math-toolbox"] = completeGate("math-toolbox");
  state.reviews.push({
    id: "three-day",
    moduleId: "math-toolbox",
    due: "2026-01-10T11:00:00.000Z",
    label: "3 天",
    task: "变式复测",
    done: false,
    generation: 0,
  });

  const failed = transitionReviewState(state, "three-day", "retry", now);
  const retry = failed.reviews.find((item) => item.label === "补救 1 天");
  assert.ok(retry);
  const retryTime = new Date(retry.due);
  const recovered = transitionReviewState(failed, retry.id, "pass", retryTime);
  assert.equal(recovered.statuses["math-toolbox"], "provisional");

  const reconfirm = recovered.reviews.find(
    (item) => item.label === "3 天再确认" && !item.done,
  );
  assert.ok(reconfirm);
  assert.equal(reconfirm.generation, 1);

  const confirmed = transitionReviewState(
    recovered,
    reconfirm.id,
    "pass",
    new Date(reconfirm.due),
  );
  assert.equal(confirmed.statuses["math-toolbox"], "confirmed");
  for (const label of ["7 天", "14 天", "30 天"]) {
    assert.ok(confirmed.reviews.some((item) => item.label === label && !item.done));
  }
});

test("a downstream module cannot stay mastered when its prerequisite drops", () => {
  const state = freshState();
  state.statuses["math-toolbox"] = "provisional";
  state.statuses["probability-counting"] = "provisional";
  state.gateChecks["math-toolbox"] = completeGate("math-toolbox");
  state.gateChecks["probability-counting"] =
    completeGate("probability-counting");

  const valid = enforceMasteryInvariants(state, now);
  assert.equal(valid.statuses["probability-counting"], "provisional");

  const invalidated = enforceMasteryInvariants(
    {
      ...valid,
      statuses: {
        ...valid.statuses,
        "math-toolbox": "learning",
        "probability-counting": "provisional",
      },
    },
    now,
  );
  assert.equal(invalidated.statuses["probability-counting"], "learning");
  assert.equal(invalidated.generations["probability-counting"], 1);
});

test("future reviews and reviews for invalid dependencies cannot mutate mastery", () => {
  const state = freshState();
  state.statuses["math-toolbox"] = "learning";
  state.statuses["probability-counting"] = "provisional";
  state.gateChecks["probability-counting"] =
    completeGate("probability-counting");
  state.reviews.push({
    id: "future-or-blocked",
    moduleId: "probability-counting",
    due: "2026-01-20T12:00:00.000Z",
    label: "3 天",
    task: "变式复测",
    done: false,
    generation: 0,
  });

  const result = transitionReviewState(
    state,
    "future-or-blocked",
    "pass",
    now,
  );
  assert.notEqual(result.statuses["probability-counting"], "confirmed");
});

test("imported JSON is normalized instead of trusting stored status labels", () => {
  const forged = JSON.stringify({
    statuses: { "math-toolbox": "confirmed" },
    gateChecks: {},
    generations: {},
    notes: {},
    lastModule: "math-toolbox",
    reviews: [],
    errors: [],
    diagnosticAnswers: {},
    diagnosticSubmitted: false,
  });

  const restored = safeParseState(forged, now);
  assert.equal(restored.statuses["math-toolbox"], "learning");
});

test("a valid imported provisional state receives a recoverable review queue", () => {
  const imported = JSON.stringify({
    statuses: { "math-toolbox": "provisional" },
    gateChecks: { "math-toolbox": completeGate("math-toolbox") },
    generations: { "math-toolbox": 4 },
    notes: {},
    lastModule: "math-toolbox",
    reviews: [],
    errors: [],
    diagnosticAnswers: {},
    diagnosticSubmitted: false,
  });

  const restored = safeParseState(imported, now);
  assert.equal(restored.statuses["math-toolbox"], "provisional");
  assert.equal(
    restored.reviews.filter((item) => item.moduleId === "math-toolbox").length,
    6,
  );
  assert.ok(
    restored.reviews.every(
      (item) => item.moduleId !== "math-toolbox" || item.generation === 4,
    ),
  );
});
