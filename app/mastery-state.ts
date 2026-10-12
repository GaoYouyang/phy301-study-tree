import {
  diagnostics,
  moduleDependencies,
  modules,
  reviewIntervals,
} from "./course-data.ts";

export type Mastery = "new" | "learning" | "provisional" | "confirmed";

export type ReviewItem = {
  id: string;
  moduleId: string;
  due: string;
  label: string;
  task: string;
  done: boolean;
  result?: "pass" | "retry";
  generation?: number;
  completedAt?: string;
};

export type ErrorEntry = {
  id: string;
  moduleId: string;
  source: string;
  cause: "概念" | "数学" | "符号/单位" | "策略" | "遗忘";
  firstStep: string;
  rule: string;
  createdAt: string;
};

export type StoredState = {
  statuses: Record<string, Mastery>;
  gateChecks: Record<string, boolean[]>;
  generations: Record<string, number>;
  notes: Record<string, string>;
  lastModule: string;
  reviews: ReviewItem[];
  errors: ErrorEntry[];
  diagnosticAnswers: Record<string, number>;
  diagnosticSubmitted: boolean;
};

export const blankState: StoredState = {
  statuses: {},
  gateChecks: {},
  generations: {},
  notes: {},
  lastModule: modules[0].id,
  reviews: [],
  errors: [],
  diagnosticAnswers: {},
  diagnosticSubmitted: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function enforceMasteryInvariants(
  input: StoredState,
  now = new Date(),
): StoredState {
  const statuses: Record<string, Mastery> = {};
  const invalidated = new Set<string>();

  for (const studyModule of modules) {
    const requested = input.statuses[studyModule.id] ?? "new";
    if (requested === "new" || requested === "learning") {
      statuses[studyModule.id] = requested;
      continue;
    }

    const dependenciesReady = (moduleDependencies[studyModule.id] ?? []).every(
      (dependencyId) =>
        ["provisional", "confirmed"].includes(
          statuses[dependencyId] ?? "new",
        ),
    );
    const checks = input.gateChecks[studyModule.id] ?? [];
    const gateComplete = studyModule.gate.criteria.every(
      (_, index) => checks[index],
    );
    const generation = input.generations[studyModule.id] ?? 0;
    const confirmedByCurrentReview = input.reviews.some(
      (review) =>
        review.moduleId === studyModule.id &&
        ["3 天", "3 天再确认"].includes(review.label) &&
        review.done &&
        review.result === "pass" &&
        (review.generation ?? 0) === generation &&
        new Date(review.due) <= now,
    );

    if (!dependenciesReady || !gateComplete) {
      statuses[studyModule.id] = "learning";
      invalidated.add(studyModule.id);
    } else if (requested === "confirmed" && !confirmedByCurrentReview) {
      statuses[studyModule.id] = "learning";
      invalidated.add(studyModule.id);
    } else {
      statuses[studyModule.id] = requested;
    }
  }

  if (invalidated.size === 0) {
    return { ...input, statuses };
  }

  const generations = { ...input.generations };
  for (const moduleId of invalidated) {
    generations[moduleId] = (generations[moduleId] ?? 0) + 1;
  }

  return {
    ...input,
    statuses,
    generations,
    reviews: input.reviews.filter(
      (review) => !invalidated.has(review.moduleId) || review.done,
    ),
  };
}

export function safeParseState(
  value: string | null,
  now = new Date(),
): StoredState {
  if (!value) return blankState;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed)) return blankState;

    const statuses = isRecord(parsed.statuses)
      ? (Object.fromEntries(
          Object.entries(parsed.statuses).filter(
            ([id, status]) =>
              modules.some((item) => item.id === id) &&
              ["new", "learning", "provisional", "confirmed"].includes(
                String(status),
              ),
          ),
        ) as Record<string, Mastery>)
      : {};
    const gateChecks = isRecord(parsed.gateChecks)
      ? Object.fromEntries(
          Object.entries(parsed.gateChecks)
            .filter(
              ([id, checks]) =>
                modules.some((item) => item.id === id) &&
                Array.isArray(checks),
            )
            .map(([id, checks]) => [
              id,
              (checks as unknown[]).map((check) => check === true),
            ]),
        )
      : {};
    const generations = isRecord(parsed.generations)
      ? (Object.fromEntries(
          Object.entries(parsed.generations).filter(
            ([id, generation]) =>
              modules.some((item) => item.id === id) &&
              typeof generation === "number" &&
              Number.isInteger(generation) &&
              generation >= 0,
          ),
        ) as Record<string, number>)
      : {};
    const notes = isRecord(parsed.notes)
      ? (Object.fromEntries(
          Object.entries(parsed.notes).filter(
            ([id, note]) =>
              modules.some((item) => item.id === id) &&
              typeof note === "string",
          ),
        ) as Record<string, string>)
      : {};
    const reviews = Array.isArray(parsed.reviews)
      ? parsed.reviews.filter(
          (item): item is ReviewItem =>
            isRecord(item) &&
            typeof item.id === "string" &&
            typeof item.moduleId === "string" &&
            modules.some((studyModule) => studyModule.id === item.moduleId) &&
            typeof item.due === "string" &&
            !Number.isNaN(Date.parse(item.due)) &&
            typeof item.label === "string" &&
            typeof item.task === "string" &&
            typeof item.done === "boolean" &&
            (item.result === undefined ||
              ["pass", "retry"].includes(String(item.result))),
        )
      : [];
    const errors = Array.isArray(parsed.errors)
      ? parsed.errors.filter(
          (item): item is ErrorEntry =>
            isRecord(item) &&
            typeof item.id === "string" &&
            typeof item.moduleId === "string" &&
            modules.some((studyModule) => studyModule.id === item.moduleId) &&
            typeof item.source === "string" &&
            ["概念", "数学", "符号/单位", "策略", "遗忘"].includes(
              String(item.cause),
            ) &&
            typeof item.firstStep === "string" &&
            typeof item.rule === "string" &&
            typeof item.createdAt === "string",
        )
      : [];
    const diagnosticAnswers = isRecord(parsed.diagnosticAnswers)
      ? (Object.fromEntries(
          Object.entries(parsed.diagnosticAnswers).filter(
            ([id, answer]) =>
              diagnostics.some((item) => item.id === id) &&
              typeof answer === "number",
          ),
        ) as Record<string, number>)
      : {};

    const normalized = enforceMasteryInvariants(
      {
        statuses,
        gateChecks,
        generations,
        notes,
        lastModule:
          typeof parsed.lastModule === "string" &&
          modules.some((item) => item.id === parsed.lastModule)
            ? parsed.lastModule
            : modules[0].id,
        reviews,
        errors,
        diagnosticAnswers,
        diagnosticSubmitted: parsed.diagnosticSubmitted === true,
      },
      now,
    );
    const restoredReviews = [...normalized.reviews];
    for (const studyModule of modules) {
      if (normalized.statuses[studyModule.id] !== "provisional") continue;
      const generation = normalized.generations[studyModule.id] ?? 0;
      const hasCurrentQueue = restoredReviews.some(
        (review) =>
          review.moduleId === studyModule.id &&
          (review.generation ?? 0) === generation &&
          (!review.done ||
            (["3 天", "3 天再确认"].includes(review.label) &&
              review.result === "pass")),
      );
      if (hasCurrentQueue) continue;

      for (const interval of reviewIntervals) {
        const due = new Date(now);
        due.setDate(due.getDate() + interval.days);
        restoredReviews.push({
          id: `${studyModule.id}-restored-${interval.days}-${now.getTime()}`,
          moduleId: studyModule.id,
          due: due.toISOString(),
          label: interval.label,
          task: interval.task,
          done: false,
          generation,
        });
      }
    }
    return { ...normalized, reviews: restoredReviews };
  } catch {
    return blankState;
  }
}

export function transitionReviewState(
  current: StoredState,
  reviewId: string,
  result: "pass" | "retry",
  now = new Date(),
): StoredState {
  const target = current.reviews.find((item) => item.id === reviewId);
  const reviewModule = target
    ? modules.find((item) => item.id === target.moduleId)
    : undefined;
  const dependencyReady = target
    ? (moduleDependencies[target.moduleId] ?? []).every((dependencyId) =>
        ["provisional", "confirmed"].includes(
          current.statuses[dependencyId] ?? "new",
        ),
      )
    : false;
  const gateReady =
    Boolean(reviewModule) &&
    reviewModule!.gate.criteria.every(
      (_, index) => current.gateChecks[reviewModule!.id]?.[index],
    );

  if (
    !target ||
    !reviewModule ||
    target.done ||
    new Date(target.due) > now ||
    !["provisional", "confirmed"].includes(
      current.statuses[target.moduleId] ?? "new",
    ) ||
    !dependencyReady ||
    !gateReady ||
    (target.generation ?? 0) !==
      (current.generations[target.moduleId] ?? 0)
  ) {
    return enforceMasteryInvariants(current, now);
  }

  const completedAt = now.toISOString();
  const completedReviews = current.reviews.map((item) =>
    item.id === reviewId
      ? { ...item, done: true, result, completedAt }
      : item,
  );

  if (result === "retry") {
    const nextGeneration = (current.generations[target.moduleId] ?? 0) + 1;
    const retryDue = new Date(now);
    retryDue.setDate(retryDue.getDate() + 1);
    const retryItem: ReviewItem = {
      id: `${target.moduleId}-retry-${now.getTime()}`,
      moduleId: target.moduleId,
      due: retryDue.toISOString(),
      label: "补救 1 天",
      task: "按错因补最小节点后，换一道同结构新题重新检索",
      done: false,
      generation: nextGeneration,
    };
    return enforceMasteryInvariants(
      {
        ...current,
        reviews: completedReviews
          .filter(
            (review) => review.moduleId !== target.moduleId || review.done,
          )
          .concat(retryItem),
        generations: {
          ...current.generations,
          [target.moduleId]: nextGeneration,
        },
        statuses: {
          ...current.statuses,
          [target.moduleId]: "provisional",
        },
      },
      now,
    );
  }

  const isConfirmationReview = ["3 天", "3 天再确认"].includes(target.label);
  const passedRecovery = target.label === "补救 1 天";
  const currentGeneration = current.generations[target.moduleId] ?? 0;
  const additionalReviews: ReviewItem[] = [];

  if (passedRecovery) {
    const due = new Date(now);
    due.setDate(due.getDate() + 3);
    additionalReviews.push({
      id: `${target.moduleId}-reconfirm-${now.getTime()}`,
      moduleId: target.moduleId,
      due: due.toISOString(),
      label: "3 天再确认",
      task: "不看旧答案，完成一题新的同结构变式；通过后恢复“已确认”",
      done: false,
      generation: currentGeneration,
    });
  }

  if (target.label === "3 天再确认") {
    for (const interval of reviewIntervals.filter((item) =>
      [7, 14, 30].includes(item.days),
    )) {
      const due = new Date(now);
      due.setDate(due.getDate() + interval.days);
      additionalReviews.push({
        id: `${target.moduleId}-renewed-${interval.days}-${now.getTime()}`,
        moduleId: target.moduleId,
        due: due.toISOString(),
        label: interval.label,
        task: interval.task,
        done: false,
        generation: currentGeneration,
      });
    }
  }

  return enforceMasteryInvariants(
    {
      ...current,
      reviews: completedReviews.concat(additionalReviews),
      statuses: isConfirmationReview
        ? { ...current.statuses, [target.moduleId]: "confirmed" }
        : current.statuses,
    },
    now,
  );
}
