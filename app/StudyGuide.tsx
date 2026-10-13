"use client";

import {
  assessmentMap,
  diagnostics,
  formulaMap,
  glossary,
  materialErrata,
  materials,
  moduleDependencies,
  modules,
  notationAlerts,
  phaseMeta,
  readings,
  reviewIntervals,
  studyPlans,
  syllabus,
  type PhaseKey,
  type StudyModule,
} from "./course-data";
import MathText from "./MathText";
import FormulaWalkthrough from "./FormulaWalkthrough";
import TeacherFormulaSupplements from "./TeacherFormulaSupplements";
import TeacherFormulaAtlas, {
  teacherFormulaSourceManifest,
} from "./TeacherFormulaAtlas";
import CloudSyncPanel from "./CloudSyncPanel";
import AssessmentCoverage from "./AssessmentCoverage";
import { teacherFormulaLessons } from "./teacher-formula-lessons";
import {
  formulaDerivations,
  formulaMapTargets,
  getConceptFormulaDerivation,
  getDeepDiveFormulaDerivation,
} from "./formula-derivations";
import {
  blankState,
  enforceMasteryInvariants,
  safeParseState,
  transitionReviewState,
  type ErrorEntry,
  type Mastery,
  type StoredState,
} from "./mastery-state";
import { useEffect, useMemo, useRef, useState } from "react";

type TabKey =
  | "roadmap"
  | "formula"
  | "assessment"
  | "resources"
  | "schedule"
  | "errata";

const STORAGE_KEY = "phy301-study-tree-v2";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const IS_HOSTED_BUILD = BASE_PATH.length > 0;

function localAssetHref(href: string) {
  return href.startsWith("/") ? `${BASE_PATH}${href}` : href;
}

const tabs: { id: TabKey; label: string; sub: string }[] = [
  { id: "roadmap", label: "学习树", sub: "严格顺序" },
  { id: "formula", label: "公式地图", sub: "从定义找公式" },
  { id: "assessment", label: "作业与考试", sub: "按能力拆题" },
  { id: "resources", label: "资料库", sub: "课件与文献" },
  { id: "schedule", label: "学习计划", sub: "复习与错因" },
  { id: "errata", label: "资料勘误", sub: `${materialErrata.length} 条核验` },
];

const statusMeta: Record<Mastery, { label: string; short: string }> = {
  new: { label: "尚未开始", short: "未学" },
  learning: { label: "正在学习", short: "进行中" },
  provisional: { label: "核心通过，待延迟复测", short: "暂时掌握" },
  confirmed: { label: "延迟复测通过", short: "已确认" },
};

const formulaModuleById = new Map<string, string>([
  ...Object.entries(formulaDerivations).map(
    ([occurrence, derivation]): [string, string] => [
      derivation.id,
      occurrence.split(":")[1],
    ],
  ),
  ...teacherFormulaLessons.map(
    (lesson): [string, string] => [lesson.derivation.id, lesson.moduleId],
  ),
]);

const fullOnlyFormulaIds = new Set(
  modules.flatMap((courseModule) =>
    courseModule.concepts.flatMap((concept) => {
      if (concept.core !== false || !concept.formula) return [];
      const derivation = getConceptFormulaDerivation(
        courseModule.id,
        concept.title,
      );
      return derivation ? [derivation.id] : [];
    }),
  ),
);

const formulaSearchIndex = [
  ...Object.entries(formulaDerivations).flatMap(([occurrence, derivation]) => {
    const moduleId = occurrence.split(":")[1];
    const courseModule = modules.find((item) => item.id === moduleId);
    if (!courseModule) return [];
    return [
      {
        moduleId,
        moduleTitle: courseModule.title,
        derivation,
        searchable: [
          courseModule.title,
          courseModule.english,
          derivation.title,
          derivation.kind,
          derivation.origin,
          derivation.conclusion,
          ...(derivation.aliases ?? []),
        ]
          .join(" ")
          .toLowerCase(),
      },
    ];
  }),
  ...teacherFormulaLessons.flatMap((lesson) => {
    const courseModule = modules.find((item) => item.id === lesson.moduleId);
    if (!courseModule) return [];
    return [
      {
        moduleId: lesson.moduleId,
        moduleTitle: courseModule.title,
        derivation: lesson.derivation,
        searchable: [
          courseModule.title,
          courseModule.english,
          lesson.sourceTitle,
          ...lesson.sourceFormulas,
          lesson.derivation.title,
          lesson.derivation.kind,
          lesson.derivation.origin,
          lesson.derivation.conclusion,
          ...(lesson.derivation.aliases ?? []),
        ]
          .join(" ")
          .toLowerCase(),
      },
    ];
  }),
];

const formulaDerivationStepCount = [
  ...Object.values(formulaDerivations),
  ...teacherFormulaLessons.map((lesson) => lesson.derivation),
].reduce((sum, derivation) => sum + derivation.steps.length, 0);

function formulaIdFromHash(hash: string) {
  const prefix = "#derivation-";
  if (!hash.startsWith(prefix)) return null;
  try {
    return decodeURIComponent(hash.slice(prefix.length));
  } catch {
    return null;
  }
}

function formulaRouteFromHash(hash: string) {
  const formulaId = formulaIdFromHash(hash);
  const moduleId = formulaId ? formulaModuleById.get(formulaId) : undefined;
  return formulaId && moduleId
    ? {
        formulaId,
        moduleId,
        requiresFullMode: fullOnlyFormulaIds.has(formulaId),
      }
    : null;
}

const causeHelp: Record<ErrorEntry["cause"], string> = {
  概念: "回到对象、控制量和定义卡；用自己的话重新说一遍。",
  数学: "只补当前等号用到的数学动作，不重学整本数学。",
  "符号/单位": "做指数无量纲、结果单位、物理方向三检。",
  策略: "先只看“第一步找什么”，再做一题同构变式。",
  遗忘: "不重读全文；立即做最小检索，并把间隔退回 1 天。",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(iso));
}

function phaseOf(module: StudyModule) {
  return phaseMeta[module.phase];
}

export default function StudyGuide() {
  const [activeTab, setActiveTab] = useState<TabKey>("roadmap");
  const [selectedId, setSelectedId] = useState(modules[0].id);
  const [mode, setMode] = useState<"core" | "full">("core");
  const [query, setQuery] = useState("");
  const [formulaQuery, setFormulaQuery] = useState("");
  const [state, setState] = useState<StoredState>(blankState);
  const [hydrated, setHydrated] = useState(false);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [treeOpen, setTreeOpen] = useState(false);
  const [pendingScrollTarget, setPendingScrollTarget] = useState<string | null>(
    null,
  );
  const [importStatus, setImportStatus] = useState("");
  const [errorDraft, setErrorDraft] = useState({
    source: "",
    cause: "策略" as ErrorEntry["cause"],
    firstStep: "",
    rule: "",
  });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = safeParseState(window.localStorage.getItem(STORAGE_KEY));
    const formulaRoute = formulaRouteFromHash(window.location.hash);
    const frame = window.requestAnimationFrame(() => {
      setState(saved);
      setSelectedId(formulaRoute?.moduleId ?? saved.lastModule);
      if (formulaRoute) {
        if (formulaRoute.requiresFullMode) setMode("full");
        setActiveTab("roadmap");
        setPendingScrollTarget(`derivation-${formulaRoute.formulaId}`);
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const routeFormulaHash = () => {
      const formulaRoute = formulaRouteFromHash(window.location.hash);
      if (!formulaRoute) return;
      setSelectedId(formulaRoute.moduleId);
      if (formulaRoute.requiresFullMode) setMode("full");
      setActiveTab("roadmap");
      setTreeOpen(false);
      setPendingScrollTarget(`derivation-${formulaRoute.formulaId}`);
    };
    window.addEventListener("hashchange", routeFormulaHash);
    return () => window.removeEventListener("hashchange", routeFormulaHash);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!pendingScrollTarget) return;
    let frame = 0;
    let attempts = 0;
    const settleTimers: number[] = [];

    const scrollToSettledTarget = () => {
      const settledTarget = document.getElementById(pendingScrollTarget);
      settledTarget?.scrollIntoView({ behavior: "auto", block: "start" });
      if (
        pendingScrollTarget === "course-question" ||
        settledTarget instanceof HTMLDetailsElement
      ) {
        const focusTarget =
          settledTarget instanceof HTMLDetailsElement
            ? settledTarget.querySelector<HTMLElement>("summary")
            : settledTarget;
        focusTarget?.focus({ preventScroll: true });
      }
    };

    const revealAndScroll = () => {
      if (pendingScrollTarget === "top") {
        window.scrollTo({ top: 0, behavior: "auto" });
        setPendingScrollTarget(null);
        return;
      }

      const target = document.getElementById(pendingScrollTarget);
      if (!target) {
        if (attempts < 120) {
          attempts += 1;
          frame = window.requestAnimationFrame(revealAndScroll);
        } else {
          setPendingScrollTarget(null);
        }
        return;
      }

      let collapsedAncestor = target?.parentElement?.closest("details") ?? null;
      while (collapsedAncestor) {
        collapsedAncestor.open = true;
        collapsedAncestor =
          collapsedAncestor.parentElement?.closest("details") ?? null;
      }
      if (target instanceof HTMLDetailsElement) target.open = true;

      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          scrollToSettledTarget();
          // Mobile layouts and web fonts can finish reflowing after hydration.
          // Re-anchor twice so a deep formula does not drift thousands of pixels.
          settleTimers.push(window.setTimeout(scrollToSettledTarget, 150));
          settleTimers.push(
            window.setTimeout(() => {
              scrollToSettledTarget();
              setPendingScrollTarget(null);
            }, 700),
          );
        });
      });
    };

    frame = window.requestAnimationFrame(revealAndScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activeTab, mode, pendingScrollTarget, selectedId]);

  useEffect(() => {
    if (!treeOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTreeOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [treeOpen]);

  const selected =
    modules.find((item) => item.id === selectedId) ?? modules[0];
  const selectedIndex = modules.findIndex((item) => item.id === selected.id);

  const confirmed = modules.filter(
    (item) => state.statuses[item.id] === "confirmed",
  ).length;
  const provisionallyDone = modules.filter((item) =>
    ["provisional", "confirmed"].includes(state.statuses[item.id] ?? "new"),
  ).length;
  const nextModule =
    modules.find(
      (item) =>
        !["provisional", "confirmed"].includes(
          state.statuses[item.id] ?? "new",
        ),
    ) ?? modules.at(-1)!;
  const totalCoreHours = modules.reduce(
    (sum, item) => sum + item.hoursCore,
    0,
  );
  const totalFullHours = modules.reduce(
    (sum, item) => sum + item.hoursFull,
    0,
  );
  const totalConceptCards = modules.reduce(
    (sum, item) => sum + item.concepts.length,
    0,
  );
  const formulaOccurrenceCount = modules.reduce(
    (sum, item) =>
      sum +
      item.concepts.filter((concept) => Boolean(concept.formula)).length +
      item.deepDives.reduce(
        (deepSum, deepDive) => deepSum + (deepDive.formulas?.length ?? 0),
        0,
      ),
    0,
  );
  const normalizedFormulaQuery = formulaQuery.trim().toLowerCase();
  const matchingFormulaRelations = formulaMap.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(normalizedFormulaQuery),
  );
  const matchingFormulaDerivations = normalizedFormulaQuery
    ? formulaSearchIndex.filter((item) =>
        item.searchable.includes(normalizedFormulaQuery),
      )
    : [];

  const filteredModules = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return modules;
    return modules.filter((item) =>
      [
        item.title,
        item.english,
        item.week,
        item.goal,
        ...item.outcomes,
        ...item.concepts.map((concept) => concept.title),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const dueReviews = state.reviews
    .filter((item) => !item.done && new Date(item.due) <= new Date())
    .sort((a, b) => a.due.localeCompare(b.due));
  const selectedCanConfirm = state.reviews.some(
    (review) =>
      review.moduleId === selected.id &&
      ["3 天", "3 天再确认"].includes(review.label) &&
      review.done &&
      review.result === "pass" &&
      (review.generation ?? 0) === (state.generations[selected.id] ?? 0) &&
      new Date(review.due) <= new Date(),
  );

  function clearFormulaHash() {
    if (!formulaIdFromHash(window.location.hash)) return;
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }

  function selectModule(id: string) {
    clearFormulaHash();
    setSelectedId(id);
    setTreeOpen(false);
    setState((current) => ({ ...current, lastModule: id }));
    requestAnimationFrame(() =>
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function openTab(tab: TabKey, target = "top") {
    if (!target.startsWith("derivation-")) clearFormulaHash();
    setActiveTab(tab);
    setTreeOpen(false);
    setPendingScrollTarget(target);
  }

  function goToModule(id: string) {
    setSelectedId(id);
    setTreeOpen(false);
    setState((current) => ({ ...current, lastModule: id }));
    openTab("roadmap", "learning-workspace");
  }

  function goToFormula(moduleId: string, derivationId: string) {
    window.history.replaceState(
      window.history.state,
      "",
      `#derivation-${encodeURIComponent(derivationId)}`,
    );
    setSelectedId(moduleId);
    if (fullOnlyFormulaIds.has(derivationId)) setMode("full");
    setTreeOpen(false);
    setState((current) => ({ ...current, lastModule: moduleId }));
    openTab("roadmap", `derivation-${derivationId}`);
  }

  function openQuestionBox(id: string) {
    setSelectedId(id);
    setState((current) => ({ ...current, lastModule: id }));
    openTab("schedule", "course-question");
  }

  function setMastery(id: string, mastery: Mastery) {
    setState((current) => {
      const currentGeneration = current.generations[id] ?? 0;
      const target = modules.find((item) => item.id === id);
      const checked = current.gateChecks[id] ?? [];
      const gateComplete =
        Boolean(target?.gate.criteria.length) &&
        target!.gate.criteria.every((_, index) => checked[index]);
      const threeDayReviewComplete = current.reviews.some(
        (review) =>
          review.moduleId === id &&
          ["3 天", "3 天再确认"].includes(review.label) &&
          review.done &&
          review.result === "pass" &&
          (review.generation ?? 0) === currentGeneration &&
          new Date(review.due) <= new Date(),
      );
      const dependenciesReady = (moduleDependencies[id] ?? []).every(
        (dependencyId) =>
          ["provisional", "confirmed"].includes(
            current.statuses[dependencyId] ?? "new",
          ),
      );

      if (
        mastery === "provisional" &&
        (!gateComplete || !dependenciesReady)
      )
        return current;
      if (mastery === "confirmed" && !threeDayReviewComplete) return current;

      if (
        mastery === "learning" &&
        ["provisional", "confirmed"].includes(current.statuses[id] ?? "new")
      ) {
        return enforceMasteryInvariants({
          ...current,
          statuses: { ...current.statuses, [id]: "learning" },
          generations: {
            ...current.generations,
            [id]: currentGeneration + 1,
          },
          reviews: current.reviews.filter(
            (review) => review.moduleId !== id || review.done,
          ),
          lastModule: id,
        });
      }

      const next = {
        ...current,
        statuses: { ...current.statuses, [id]: mastery },
        lastModule: id,
      };

      if (
        mastery === "provisional" &&
        current.statuses[id] !== "provisional" &&
        current.statuses[id] !== "confirmed"
      ) {
        const now = new Date();
        const withoutOld = current.reviews.filter(
          (item) => item.moduleId !== id,
        );
        next.reviews = [
          ...withoutOld,
          ...reviewIntervals.map((interval) => {
            const due = new Date(now);
            due.setDate(due.getDate() + interval.days);
            return {
              id: `${id}-${interval.days}-${now.getTime()}`,
              moduleId: id,
              due: due.toISOString(),
              label: interval.label,
              task: interval.task,
              done: false,
              generation: currentGeneration,
            };
          }),
        ];
      }
      return enforceMasteryInvariants(next);
    });
  }

  function updateGateCheck(
    moduleId: string,
    criterionIndex: number,
    checked: boolean,
  ) {
    setState((current) => {
      const nextChecks = [...(current.gateChecks[moduleId] ?? [])];
      nextChecks[criterionIndex] = checked;
      const invalidatesMastery =
        !checked &&
        ["provisional", "confirmed"].includes(
          current.statuses[moduleId] ?? "new",
        );
      return enforceMasteryInvariants({
        ...current,
        statuses:
          invalidatesMastery
            ? { ...current.statuses, [moduleId]: "learning" }
            : current.statuses,
        generations: invalidatesMastery
          ? {
              ...current.generations,
              [moduleId]: (current.generations[moduleId] ?? 0) + 1,
            }
          : current.generations,
        gateChecks: {
          ...current.gateChecks,
          [moduleId]: nextChecks,
        },
        reviews: invalidatesMastery
          ? current.reviews.filter(
              (review) => review.moduleId !== moduleId || review.done,
            )
          : current.reviews,
      });
    });
  }

  function saveNote(value: string) {
    setState((current) => ({
      ...current,
      notes: { ...current.notes, [selected.id]: value },
    }));
  }

  function finishReview(reviewId: string, result: "pass" | "retry") {
    setState((current) =>
      transitionReviewState(current, reviewId, result, new Date()),
    );
  }

  function addErrorEntry() {
    if (!errorDraft.source.trim() || !errorDraft.rule.trim()) return;
    const entry: ErrorEntry = {
      id: `error-${Date.now()}`,
      moduleId: selected.id,
      source: errorDraft.source.trim(),
      cause: errorDraft.cause,
      firstStep: errorDraft.firstStep.trim(),
      rule: errorDraft.rule.trim(),
      createdAt: new Date().toISOString(),
    };
    setState((current) => ({
      ...current,
      errors: [entry, ...current.errors],
    }));
    setErrorDraft({
      source: "",
      cause: "策略",
      firstStep: "",
      rule: "",
    });
  }

  function recordGateFailure(studyModule: StudyModule) {
    setState((current) =>
      enforceMasteryInvariants({
        ...current,
        statuses: { ...current.statuses, [studyModule.id]: "learning" },
        generations: {
          ...current.generations,
          [studyModule.id]: (current.generations[studyModule.id] ?? 0) + 1,
        },
        reviews: current.reviews.filter(
          (review) => review.moduleId !== studyModule.id || review.done,
        ),
      }),
    );
    setErrorDraft({
      source: `${studyModule.week} · ${studyModule.title} gate`,
      cause: "策略",
      firstStep: "",
      rule: "",
    });
    openTab("schedule", "error-notebook");
  }

  function exportProgress() {
    const payload = JSON.stringify(
      {
        schemaVersion: 2,
        exportedAt: new Date().toISOString(),
        course: "PHY301 Statistical Physics",
        ...state,
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `PHY301-学习记录-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(href);
  }

  async function importProgress(file: File | undefined) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Record<string, unknown>;
      if (
        parsed.course !== "PHY301 Statistical Physics" &&
        !("statuses" in parsed)
      ) {
        throw new Error("not a PHY301 progress file");
      }
      const restored = safeParseState(JSON.stringify(parsed));
      setState(restored);
      setSelectedId(restored.lastModule);
      setImportStatus("导入成功；进度、笔记、复习和错因已恢复。");
    } catch {
      setImportStatus("导入失败：这不是有效的 PHY301 JSON 备份。原记录未改变。");
    }
  }

  function clearProgress() {
    if (!window.confirm("确定清空本机浏览器中的 PHY301 进度、笔记和错因记录吗？此操作不能撤销。"))
      return;
    window.localStorage.removeItem(STORAGE_KEY);
    setState(blankState);
    setSelectedId(modules[0].id);
    setImportStatus("");
  }

  function submitDiagnostic() {
    setState((current) => ({ ...current, diagnosticSubmitted: true }));
  }

  const diagnosticScore = diagnostics.filter(
    (item) => state.diagnosticAnswers[item.id] === item.answer,
  ).length;

  return (
    <main className="site-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#top"
          aria-label="PHY301 学习树首页"
          onClick={(event) => {
            event.preventDefault();
            openTab("roadmap");
          }}
        >
          <span className="brand-mark">Σ</span>
          <span>
            <strong>PHY301</strong>
            <small>STATISTICAL PHYSICS</small>
          </span>
        </a>
        <nav className="topnav" aria-label="主要栏目">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? "nav-tab active" : "nav-tab"}
              key={tab.id}
              onClick={() => openTab(tab.id)}
              type="button"
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span>{tab.label}</span>
              <small>{tab.sub}</small>
            </button>
          ))}
        </nav>
        <button
          className="progress-pill"
          type="button"
          onClick={() => {
            openTab("schedule", "review-queue");
          }}
        >
          <span>{confirmed}/{modules.length} 已确认</span>
          <span className="progress-track" aria-hidden="true">
            <i style={{ width: `${(confirmed / modules.length) * 100}%` }} />
          </span>
        </button>
      </header>

      {activeTab === "roadmap" && (
        <>
          <section className="hero" id="top">
            <div className="hero-copy">
              <p className="eyebrow">REBUILD, THEN MASTER · 为重修重新搭地基</p>
              <h1>
                从零到统计物理，
                <br />
                <em>一条不跳步的学习树。</em>
              </h1>
              <p className="hero-lead">
                这里的“快”不是赶进度，而是减少返工：每一节都沿着
                <strong> 直觉 → 定义 → 推导 → 例题 → 闭卷自测 → gate </strong>
                前进；卡住就退回最小前置，不必把整章重学。
              </p>
              <div className="hero-actions">
                <button
                  className="button primary"
                  type="button"
                  onClick={() => goToModule(nextModule.id)}
                >
                  继续下一步：<MathText text={nextModule.title} />
                  <span aria-hidden="true">→</span>
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => setDiagnosticOpen((value) => !value)}
                >
                  {diagnosticOpen ? "收起诊断" : "先做 10 分钟低压力诊断"}
                </button>
              </div>
              <p className="gentle-note">
                诊断只决定从哪里开始，不评价你“聪不聪明”；通过的前置也会在 3
                天后复测。
              </p>
            </div>
            <aside className="hero-board" aria-label="课程总览">
              <div className="board-heading">
                <span>你的全程路线</span>
                <strong>
                  {modules.length} 章 · {totalConceptCards} 个微课卡
                </strong>
              </div>
              <div className="mini-chain">
                {(
                  [
                    "foundation",
                    "classical",
                    "quantum",
                    "nonequilibrium",
                    "review",
                  ] as PhaseKey[]
                ).map((phase, index) => {
                  const count = modules.filter(
                    (item) => item.phase === phase,
                  ).length;
                  return (
                    <div className={`chain-row phase-${phase}`} key={phase}>
                      <span className="chain-index">
                        {String(index).padStart(2, "0")}
                      </span>
                      <div>
                        <b>{phaseMeta[phase].short}</b>
                        <small>{phaseMeta[phase].description}</small>
                      </div>
                      <span>{count} 节</span>
                    </div>
                  );
                })}
              </div>
              <div className="board-stats">
                <div>
                  <strong>{totalCoreHours}h</strong>
                  <span>最短核心</span>
                </div>
                <div>
                  <strong>{totalFullHours}h</strong>
                  <span>含全部深潜</span>
                </div>
                <div>
                  <strong>14</strong>
                  <span>教学周覆盖</span>
                </div>
              </div>
            </aside>
          </section>

          {diagnosticOpen && (
            <section className="diagnostic-panel" aria-labelledby="diagnostic-title">
              <div className="section-kicker">STARTING POINT</div>
              <div className="section-heading">
                <div>
                  <h2 id="diagnostic-title">低压力入口诊断</h2>
                  <p>
                    先在纸上算，再选择。答错会给出精确补洞入口；不要求一次全对。
                  </p>
                </div>
                <span className="score-badge">
                  {state.diagnosticSubmitted
                    ? `${diagnosticScore}/${diagnostics.length}`
                    : "约 10 分钟"}
                </span>
              </div>
              <div className="diagnostic-grid">
                {diagnostics.map((item, index) => {
                  const chosen = state.diagnosticAnswers[item.id];
                  const isCorrect = chosen === item.answer;
                  return (
                    <article className="diagnostic-card" key={item.id}>
                      <div className="diagnostic-number">
                        {String(index + 1).padStart(2, "0")} · {item.skill}
                      </div>
                      <h3><MathText text={item.question} /></h3>
                      <div className="choice-list">
                        {item.choices.map((choice, choiceIndex) => (
                          <label
                            className={
                              chosen === choiceIndex ? "choice selected" : "choice"
                            }
                            key={choice}
                          >
                            <input
                              type="radio"
                              name={item.id}
                              value={choiceIndex}
                              checked={chosen === choiceIndex}
                              onChange={() =>
                                setState((current) => ({
                                  ...current,
                                  diagnosticAnswers: {
                                    ...current.diagnosticAnswers,
                                    [item.id]: choiceIndex,
                                  },
                                  diagnosticSubmitted: false,
                                }))
                              }
                            />
                            <span>{String.fromCharCode(65 + choiceIndex)}</span>
                            <MathText text={choice} />
                          </label>
                        ))}
                      </div>
                      {state.diagnosticSubmitted && chosen !== undefined && (
                        <div
                          className={
                            isCorrect
                              ? "diagnostic-feedback correct"
                              : "diagnostic-feedback needs-work"
                          }
                        >
                          <strong>{isCorrect ? "通过" : "这里需要补一小块"}</strong>
                          <p><MathText text={item.feedback} /></p>
                          <button
                            type="button"
                            onClick={() => goToModule(item.route)}
                          >
                            {isCorrect
                              ? "去挑战该节点 gate →"
                              : "去对应补洞节点 →"}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
              <div className="diagnostic-actions">
                <button
                  className="button primary"
                  type="button"
                  disabled={Object.keys(state.diagnosticAnswers).length === 0}
                  onClick={submitDiagnostic}
                >
                  查看结果与补洞路线
                </button>
                {state.diagnosticSubmitted && (
                  <p>
                    建议：答错就补对应节点；答对只允许去挑战完整 gate，不能靠这
                    1 道筛查题直接跳过。gate 通过后还需 3 天变式复测。
                  </p>
                )}
              </div>
            </section>
          )}

          <section className="today-strip">
            <div className="today-label">
              <span>现在最重要</span>
              <strong>
                {dueReviews.length > 0
                  ? `${dueReviews.length} 项到期复习`
                  : "推进唯一下一步"}
              </strong>
            </div>
            {dueReviews.length > 0 ? (
              <div className="today-review">
                <div>
                  <b>
                    <MathText
                      text={
                        modules.find(
                          (item) => item.id === dueReviews[0].moduleId,
                        )?.title ?? ""
                      }
                    />
                  </b>
                  <span><MathText text={dueReviews[0].task} /></span>
                </div>
                <button
                  type="button"
                  onClick={() => goToModule(dueReviews[0].moduleId)}
                >
                  开始检索 →
                </button>
              </div>
            ) : (
              <div className="today-review">
                <div>
                  <b>{nextModule.week} · <MathText text={nextModule.title} /></b>
                  <span><MathText text={nextModule.goal} /></span>
                </div>
                <button type="button" onClick={() => goToModule(nextModule.id)}>
                  进入节点 →
                </button>
              </div>
            )}
          </section>

          <section className="tree-intro">
            <div>
              <p className="section-kicker">THE DEPENDENCY TREE</p>
              <h2>沿依赖前进，不沿文件顺序硬翻</h2>
            </div>
            <p>
              老师的 14 周覆盖保持不变；网页额外插入必要的数学、概率、热力学、量子和随机过程桥梁。
              深潜内容都可合上，不阻塞核心主线。
            </p>
          </section>

          <div className="mobile-tree-control">
            <button
              type="button"
              onClick={() => setTreeOpen((value) => !value)}
              aria-expanded={treeOpen}
              aria-controls="knowledge-tree"
            >
              <span className="mobile-tree-current">
                <small>当前 {String(selectedIndex).padStart(2, "0")}</small>
                <b>{selected.title}</b>
              </span>
              <span className="mobile-tree-action">
                {treeOpen ? "收起" : "学习树"} · {provisionallyDone}/{modules.length}
              </span>
            </button>
          </div>

          <section className="learning-workspace" ref={contentRef}>
            <aside
              className={treeOpen ? "tree-sidebar open" : "tree-sidebar"}
              id="knowledge-tree"
              aria-label="学习树与节点搜索"
            >
              <div className="mobile-tree-header">
                <b>学习树与搜索</b>
                <button type="button" onClick={() => setTreeOpen(false)}>
                  关闭
                </button>
              </div>
              <div className="sidebar-tools">
                <label>
                  <span className="sr-only">搜索学习节点</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索概念、周次、英文…"
                  />
                </label>
                <div className="mode-switch" aria-label="学习内容模式">
                  <button
                    type="button"
                    className={mode === "core" ? "active" : ""}
                    onClick={() => setMode("core")}
                    aria-pressed={mode === "core"}
                  >
                    最短主线
                  </button>
                  <button
                    type="button"
                    className={mode === "full" ? "active" : ""}
                    onClick={() => setMode("full")}
                    aria-pressed={mode === "full"}
                  >
                    完整深读
                  </button>
                </div>
              </div>
              <nav className="tree-nav" aria-label="知识依赖树">
                {filteredModules.length === 0 && (
                  <div className="tree-empty">
                    <b>没有匹配节点</b>
                    <p>试试中文主题、Week 周次或英文术语。</p>
                    <button type="button" onClick={() => setQuery("")}>
                      清除搜索
                    </button>
                  </div>
                )}
                {(
                  [
                    "foundation",
                    "classical",
                    "quantum",
                    "nonequilibrium",
                    "review",
                  ] as PhaseKey[]
                ).map((phase) => {
                  const phaseModules = filteredModules.filter(
                    (item) => item.phase === phase,
                  );
                  if (!phaseModules.length) return null;
                  return (
                    <div className={`tree-phase phase-${phase}`} key={phase}>
                      <div className="tree-phase-title">
                        <span className="phase-dot" />
                        <div>
                          <b>{phaseMeta[phase].label}</b>
                          <small>{phaseMeta[phase].description}</small>
                        </div>
                      </div>
                      <div className="tree-nodes">
                        {phaseModules.map((item) => {
                          const index = modules.findIndex(
                            (module) => module.id === item.id,
                          );
                          const mastery = state.statuses[item.id] ?? "new";
                          const missingPrerequisites = (
                            moduleDependencies[item.id] ?? []
                          ).filter(
                            (dependencyId) =>
                              !["provisional", "confirmed"].includes(
                                state.statuses[dependencyId] ?? "new",
                              ),
                          );
                          return (
                            <button
                              type="button"
                              key={item.id}
                              className={
                                selected.id === item.id
                                  ? `tree-node active status-${mastery} ${missingPrerequisites.length ? "has-missing" : ""}`
                                  : `tree-node status-${mastery} ${missingPrerequisites.length ? "has-missing" : ""}`
                              }
                              onClick={() => selectModule(item.id)}
                            >
                              <span className="node-index">
                                {String(index).padStart(2, "0")}
                              </span>
                              <span className="node-copy">
                                <b><MathText text={item.title} /></b>
                                <small>
                                  {item.week} · 核心 {item.hoursCore}h
                                  {missingPrerequisites.length > 0
                                    ? ` · 前置 ${missingPrerequisites.length}`
                                    : ""}
                                </small>
                              </span>
                              <span
                                className="node-state"
                                title={statusMeta[mastery].label}
                              >
                                {mastery === "confirmed"
                                  ? "✓"
                                  : mastery === "provisional"
                                    ? "◐"
                                    : mastery === "learning"
                                      ? "→"
                                      : ""}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </nav>
            </aside>

            <article className={`module-reader phase-${selected.phase}`}>
              <ModuleReader
                module={selected}
                index={selectedIndex}
                mode={mode}
                mastery={state.statuses[selected.id] ?? "new"}
                statuses={state.statuses}
                gateChecks={state.gateChecks[selected.id] ?? []}
                canConfirm={selectedCanConfirm}
                note={state.notes[selected.id] ?? ""}
                onMastery={(mastery) => setMastery(selected.id, mastery)}
                onGateCheck={(criterionIndex, checked) =>
                  updateGateCheck(selected.id, criterionIndex, checked)
                }
                onGateFail={() => recordGateFailure(selected)}
                onNote={saveNote}
                onNavigate={goToModule}
                onAsk={() => openQuestionBox(selected.id)}
              />
              <div className="module-pager">
                <button
                  type="button"
                  disabled={selectedIndex === 0}
                  onClick={() =>
                    selectModule(modules[Math.max(0, selectedIndex - 1)].id)
                  }
                >
                  <span>上一节点</span>
                  <b>
                    {selectedIndex > 0 ? (
                      <MathText text={modules[selectedIndex - 1].title} />
                    ) : (
                      "已经是起点"
                    )}
                  </b>
                </button>
                <button
                  type="button"
                  className="next"
                  disabled={selectedIndex === modules.length - 1}
                  onClick={() =>
                    selectModule(
                      modules[
                        Math.min(modules.length - 1, selectedIndex + 1)
                      ].id,
                    )
                  }
                >
                  <span>下一节点</span>
                  <b>
                    {selectedIndex < modules.length - 1 ? (
                      <MathText text={modules[selectedIndex + 1].title} />
                    ) : (
                      "主线已闭合"
                    )}
                  </b>
                </button>
              </div>
            </article>
          </section>
        </>
      )}

      {activeTab === "formula" && (
        <section className="library-page" id="top">
          <PageHeading
            kicker="FORMULA MAP"
            title="公式地图：先找它从哪里来"
            description="公式地图只负责检索；点击推导入口会回到它第一次被系统讲清的学习节点。每条都会区分定义、公设、模型、近似与可推导结果。"
          />
          <div className="formula-coverage-note">
            <div className="formula-coverage-stats">
              <strong>
                <span>{Object.keys(formulaDerivations).length}/{formulaOccurrenceCount}</span>
                <small>结构化公式</small>
              </strong>
              <strong>
                <span>629/629</span>
                <small>教师原式条目</small>
              </strong>
              <strong>
                <span>{teacherFormulaLessons.length}</span>
                <small>漏步补课</small>
              </strong>
              <strong>
                <span>{teacherFormulaSourceManifest.derivationChainCount}</span>
                <small>详细推导链</small>
              </strong>
              <strong>
                <span>{formulaDerivationStepCount}</span>
                <small>连续步骤</small>
              </strong>
            </div>
            <p>
              126 条结构化主公式与深潜公式，加上 53 组专为老师课件跳步补写的推导，共形成 179 条详细推导链。629 是 10 讲、214 页课件中的原式出现次数，不代表 629 条互不相同的定理；每个条目都能追溯原页，并连接到相关推导或解释。定义、公设和经验定律说明物理来源，不伪装成数学证明。
            </p>
          </div>
          <div className="formula-search">
            <label>
              <span className="sr-only">搜索公式地图</span>
              <input
                type="search"
                placeholder="搜索 Z、涨落、Bose、扩散…"
                value={formulaQuery}
                onChange={(event) => setFormulaQuery(event.target.value)}
              />
            </label>
            <span>
              {matchingFormulaRelations.length}/{formulaMap.length} 条关系
              {normalizedFormulaQuery
                ? ` · ${matchingFormulaDerivations.length}/${formulaSearchIndex.length} 条完整推导`
                : ` · 可搜索 ${formulaSearchIndex.length} 条完整推导`}
            </span>
          </div>
          <div className="formula-grid">
            {matchingFormulaRelations.map((item, index) => {
                const targets = (formulaMapTargets[item.name] ?? []).flatMap(
                  (target) => {
                    const derivation = getConceptFormulaDerivation(
                      target.moduleId,
                      target.conceptTitle,
                    );
                    return derivation ? [{ ...target, derivation }] : [];
                  },
                );
                return (
                  <article className="formula-card" key={item.name}>
                    <div className="formula-topline">
                      <span>{item.family}</span>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                    </div>
                    <h2><MathText text={item.name} /></h2>
                    <div className="formula-display">
                      <MathText text={item.formula} display />
                    </div>
                    <p><MathText text={item.use} /></p>
                    <div className="formula-warning">
                      <b>先检查</b>
                      <MathText text={item.warning} />
                    </div>
                    <div className="formula-route-list">
                      <span>完整推导入口</span>
                      {targets.map((target) => (
                        <a
                          href={`#derivation-${target.derivation.id}`}
                          key={target.derivation.id}
                          onClick={(event) => {
                            if (
                              event.metaKey ||
                              event.ctrlKey ||
                              event.shiftKey ||
                              event.altKey
                            )
                              return;
                            event.preventDefault();
                            goToFormula(target.moduleId, target.derivation.id);
                          }}
                        >
                          {target.derivation.title} →
                        </a>
                      ))}
                    </div>
                  </article>
                );
              })}
          </div>
          {normalizedFormulaQuery && matchingFormulaDerivations.length > 0 && (
            <section className="formula-index-results" aria-live="polite">
              <div>
                <span>ALL DERIVATIONS</span>
                <h2>完整推导搜索结果</h2>
                <p>
                  找到 {matchingFormulaDerivations.length} 条；点击后会回到课程中的正确位置并自动展开。
                </p>
              </div>
              <div className="formula-index-list">
                {matchingFormulaDerivations.map((item) => (
                  <a
                    href={`#derivation-${item.derivation.id}`}
                    key={item.derivation.id}
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      goToFormula(item.moduleId, item.derivation.id);
                    }}
                  >
                    <small>
                      {item.derivation.kind} · {item.moduleTitle}
                    </small>
                    <b>{item.derivation.title}</b>
                    <MathText text={item.derivation.conclusion} />
                  </a>
                ))}
              </div>
            </section>
          )}
          {normalizedFormulaQuery &&
            matchingFormulaRelations.length === 0 &&
            matchingFormulaDerivations.length === 0 && (
            <div className="empty-state formula-empty">
              <b>没有找到对应公式</b>
              <p>试试公式名称、物理量、节点名、Bose/Fermi 英文词或用途关键词。</p>
              <button type="button" onClick={() => setFormulaQuery("")}>
                清除搜索
              </button>
            </div>
            )}
          <div className="two-column-section">
            <section>
              <div className="minor-heading">
                <span>NOTATION</span>
                <h2>老师记号与常见教材对照</h2>
              </div>
              <div className="notation-list">
                {notationAlerts.map((item) => (
                  <article key={item.symbol}>
                    <strong><MathText text={item.symbol} /></strong>
                    <div>
                      <p><b>本课：</b><MathText text={item.teacher} /></p>
                      <p><b>对照：</b><MathText text={item.other} /></p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <div className="minor-heading">
                <span>GLOSSARY</span>
                <h2>核心术语中英对照</h2>
              </div>
              <div className="glossary-list">
                {glossary.map(([term, definition]) => (
                  <details key={term}>
                    <summary><MathText text={term} /></summary>
                    <p><MathText text={definition} /></p>
                  </details>
                ))}
              </div>
            </section>
          </div>
          <TeacherFormulaAtlas onOpenDerivation={goToFormula} />
        </section>
      )}

      {activeTab === "assessment" && (
        <section className="library-page" id="top">
          <PageHeading
            kicker="ASSESSMENT ROUTES"
            title="所有作业与期中，都挂回知识树"
            description="先做题，卡住只看一级提示；仍卡住才回对应节点。完整答案用于核对评分点，不用于第一次学习。"
          />
          <div className="assessment-guidance">
            <div>
              <span>01</span>
              <b>只看题面</b>
              <p>先圈控制量、输出量和所需定义。</p>
            </div>
            <div>
              <span>02</span>
              <b>写出第一步</b>
              <p>最多卡 8–10 分钟，再看方法提示。</p>
            </div>
            <div>
              <span>03</span>
              <b>评分点核对</b>
              <p>完成后才开答案，并记录漏掉的第一步。</p>
            </div>
            <div>
              <span>04</span>
              <b>换变式复测</b>
              <p>原题会背不等于掌握。</p>
            </div>
          </div>
          <div className="assessment-grid">
            {assessmentMap.map((item) => {
              const target = modules.find((module) => module.id === item.target);
              const group = item.id.split("-")[0];
              const sourceMaterial =
                group === "PS1"
                  ? materials.find((material) => material.id === "PS1")
                  : group === "PS2"
                    ? materials.find((material) => material.id === "PS2")
                    : group === "PS3"
                      ? materials.find((material) => material.id === "PS3")
                      : materials.find((material) => material.id === "MID");
              const solutionMaterial =
                group === "PS1"
                  ? materials.find((material) => material.id === "PS1S")
                  : group === "PS2"
                    ? materials.find((material) => material.id === "PS2S")
                    : group === "PS3"
                      ? materials.find((material) => material.id === "PS3S")
                      : materials.find((material) => material.id === "MID");
              return (
                <article className={`assessment-card group-${group}`} key={item.id}>
                  <div className="assessment-id">{item.id}</div>
                  <h2><MathText text={item.title} /></h2>
                  <div className="assessment-block">
                    <span>先修动作</span>
                    <p><MathText text={item.prerequisites} /></p>
                  </div>
                  <details>
                    <summary>一级方法提示</summary>
                    <p><MathText text={item.method} /></p>
                  </details>
                  <div className="assessment-links">
                    {target && (
                      <button type="button" onClick={() => goToModule(target.id)}>
                        回到：<MathText text={target.title} />
                      </button>
                    )}
                    {sourceMaterial && (
                      <a
                        href={localAssetHref(sourceMaterial.href)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {group === "MID" ? "打开评分答案 ↗" : "打开题面 ↗"}
                      </a>
                    )}
                    {solutionMaterial &&
                      solutionMaterial.href !== sourceMaterial?.href && (
                        <a
                          href={localAssetHref(solutionMaterial.href)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          完成后开答案 ↗
                        </a>
                      )}
                  </div>
                </article>
              );
            })}
          </div>
          <AssessmentCoverage onOpenModule={goToModule} />
          <div className="archive-grade">
            <b>2025 存档评分结构</b>
            <div>
              <span>Assignments 30%</span>
              <span>Mid-term 30%</span>
              <span>Final 40%</span>
            </div>
            <p>
              来源为旧课件 1。重修学期开学第一周必须以新 syllabus/老师公告再次核实；网页不把旧比例冒充当前规则。
            </p>
          </div>
        </section>
      )}

      {activeTab === "resources" && (
        <section className="library-page" id="top">
          <PageHeading
            kicker="LOCAL COURSE LIBRARY"
            title="课件、作业、答案与参考阅读"
            description="主线网页足以通过 gate；原文件用于对齐老师语言，教材只在卡住或深读时按指定章节打开。"
          />
          <div className="privacy-banner">
            <span>{IS_HOSTED_BUILD ? "FULL COURSE LIBRARY" : "LOCAL LIBRARY"}</span>
            <div>
              <b>{IS_HOSTED_BUILD ? "完整课程资料已随学习树发布" : "课程资料可在本机直接打开"}</b>
              <p>
                {IS_HOSTED_BUILD
                  ? "依据课程方的公开使用授权，课件、作业、答案、教学计划截图和参考资料均保留入口。每份课件同时提供老师的英文原始文件，以及按原页穿插中文翻译和难点解释的逐页精讲版。"
                  : "课件、作业、答案和本地 PDF 都由本网页统一索引。每份课件同时保留老师的英文原始文件，以及按原页穿插中文翻译和难点解释的逐页精讲版。"}
              </p>
              <a
                className="materials-manifest-link"
                href={localAssetHref("/materials/course-materials-manifest.json")}
                target="_blank"
                rel="noreferrer"
              >
                查看材料版本说明与完整文件清单 ↗
              </a>
            </div>
          </div>
          <div className="resource-table-wrap">
            <table className="resource-table">
              <thead>
                <tr>
                  <th>文件</th>
                  <th>对应课程</th>
                  <th>内容与使用方式</th>
                  <th>版本与下载</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item) => (
                  <tr key={item.id}>
                    <td data-label="文件">
                      <b><MathText text={item.label} /></b>
                      <small>{item.pages}</small>
                    </td>
                    <td data-label="对应课程"><MathText text={item.maps} /></td>
                    <td data-label="内容与使用方式"><MathText text={item.note} /></td>
                    <td data-label="版本与下载">
                      <div className="resource-actions">
                        <a
                          href={localAssetHref(item.href)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {"bilingualHref" in item ? "英文原始课件" : "打开文件"} ↗
                        </a>
                        {"bilingualHref" in item && item.bilingualHref && (
                          <a
                            className="bilingual-resource-link"
                            href={localAssetHref(item.bilingualHref)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            中英逐页精讲 ↗
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="reading-grid">
            {readings.map((item) => (
              <article className="reading-card" key={item.title}>
                <span>{item.level}</span>
                <h2><MathText text={item.title} /></h2>
                <div className="reading-route">
                  <b>只走这条阅读路线</b>
                  <p><MathText text={item.route} /></p>
                </div>
                <p><MathText text={item.why} /></p>
                <a href={localAssetHref(item.href)} target="_blank" rel="noreferrer">
                  打开参考资料 <span>↗</span>
                </a>
              </article>
            ))}
          </div>
          <details className="syllabus-proof">
            <summary>
              <span>查看老师网页上的 14 周教学计划原图</span>
              <small>2025-09-29 存档截图</small>
            </summary>
            {/* This archival screenshot is included under the course's public-use permission. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={localAssetHref("/course-plan/teacher-course-plan-2025.png")}
              alt="老师网页公布的 PHY301 十四周教学计划"
            />
          </details>
        </section>
      )}

      {activeTab === "schedule" && (
        <section className="library-page" id="top">
          <PageHeading
            kicker="MASTERY SYSTEM"
            title="学习计划以 gate 为准，不以日历赶进度"
            description="预计时间帮助排期，但只有主动输出和延迟复测才会把节点标为“已确认”。中断不会受罚，回来继续唯一下一步。"
          />
          <div className="plan-grid">
            {studyPlans.map((plan, index) => (
              <article className={index === 0 ? "plan-card featured" : "plan-card"} key={plan.id}>
                <span>路线 {String(index + 1).padStart(2, "0")}</span>
                <h2><MathText text={plan.title} /></h2>
                <strong><MathText text={plan.pace} /></strong>
                <p><MathText text={plan.bestFor} /></p>
                <div><MathText text={plan.rhythm} /></div>
              </article>
            ))}
          </div>

          <section className="review-section" id="review-queue">
            <div className="minor-heading">
              <span>SPACED RETRIEVAL</span>
              <h2>复习队列</h2>
              <p>把节点标成“核心通过”后，会自动生成 立即/1/3/7/14/30 天检索任务。</p>
            </div>
            {state.reviews.length === 0 ? (
              <div className="empty-state">
                <b>还没有复习任务</b>
                <p>去学习树完成一个节点 gate，再点“核心通过”。</p>
                <button type="button" onClick={() => goToModule(nextModule.id)}>
                  去下一节点 →
                </button>
              </div>
            ) : (
              <div className="review-list">
                {state.reviews
                  .slice()
                  .sort((a, b) => a.due.localeCompare(b.due))
                  .map((review) => {
                    const reviewModule = modules.find(
                      (item) => item.id === review.moduleId,
                    );
                    const overdue =
                      !review.done && new Date(review.due) <= new Date();
                    const notYetDue =
                      !review.done && new Date(review.due) > new Date();
                    return (
                      <article
                        className={`${review.done ? "done" : ""} ${overdue ? "due" : ""}`}
                        key={review.id}
                      >
                        <time>{formatDate(review.due)}</time>
                        <div>
                          <b>
                            {review.label} · {reviewModule && <MathText text={reviewModule.title} />}
                          </b>
                          <p><MathText text={review.task} /></p>
                        </div>
                        <div className="review-actions">
                          <button
                            type="button"
                            onClick={() =>
                              reviewModule && goToModule(reviewModule.id)
                            }
                          >
                            打开节点
                          </button>
                          {review.done ? (
                            <span
                              className={
                                review.result === "retry"
                                  ? "review-result retry"
                                  : "review-result pass"
                              }
                            >
                              {review.result === "retry"
                                ? "未通过 · 已退回 1 天"
                                : "已通过"}
                            </span>
                          ) : notYetDue ? (
                            <span className="review-result waiting">到期后检索</span>
                          ) : (
                            <>
                              <button
                                className="review-pass"
                                type="button"
                                onClick={() => finishReview(review.id, "pass")}
                              >
                                本次通过
                              </button>
                              <button
                                className="review-retry"
                                type="button"
                                onClick={() => finishReview(review.id, "retry")}
                              >
                                没通过 · 退回 1 天
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    );
                  })}
              </div>
            )}
          </section>

          <section className="error-notebook" id="error-notebook">
            <div className="minor-heading">
              <span>ERROR ROUTING</span>
              <h2>错因本：只记导致失分的那一步</h2>
              <p>
                不抄完整答案。记录来源、错因、漏掉的第一步和一句正确判据，下一次换同构题。
              </p>
            </div>
            <div className="error-layout">
              <div className="error-form">
                <label>
                  <span>题目来源 / 简短描述</span>
                  <input
                    value={errorDraft.source}
                    onChange={(event) =>
                      setErrorDraft((draft) => ({
                        ...draft,
                        source: event.target.value,
                      }))
                    }
                    placeholder="例如：作业 2 Q3，Ξ 写错"
                  />
                </label>
                <label>
                  <span>错因类别</span>
                  <select
                    value={errorDraft.cause}
                    onChange={(event) =>
                      setErrorDraft((draft) => ({
                        ...draft,
                        cause: event.target.value as ErrorEntry["cause"],
                      }))
                    }
                  >
                    {Object.keys(causeHelp).map((cause) => (
                      <option key={cause}>{cause}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>我漏掉的第一步</span>
                  <input
                    value={errorDraft.firstStep}
                    onChange={(event) =>
                      setErrorDraft((draft) => ({
                        ...draft,
                        firstStep: event.target.value,
                      }))
                    }
                    placeholder="例如：先声明 T,V,μ 固定"
                  />
                </label>
                <label>
                  <span>一句正确判据 *</span>
                  <textarea
                    value={errorDraft.rule}
                    onChange={(event) =>
                      setErrorDraft((draft) => ({
                        ...draft,
                        rule: event.target.value,
                      }))
                    }
                    placeholder="例如：巨正则指数必须是 −β(E−μN)"
                  />
                </label>
                <div className="cause-tip"><MathText text={causeHelp[errorDraft.cause]} /></div>
                <button
                  className="button primary"
                  type="button"
                  disabled={!errorDraft.source.trim() || !errorDraft.rule.trim()}
                  onClick={addErrorEntry}
                >
                  保存到本机错因本
                </button>
              </div>
              <div className="error-entries">
                {state.errors.length === 0 ? (
                  <div className="empty-state compact">
                    <b>错因本还是空的</b>
                    <p>第一次错很正常；关键是把错误路由成一个短小动作。</p>
                  </div>
                ) : (
                  state.errors.map((entry) => (
                    <article key={entry.id}>
                      <div className="error-entry-top">
                        <span>{entry.cause}</span>
                        <time>{formatDate(entry.createdAt)}</time>
                      </div>
                      <h3>{entry.source}</h3>
                      {entry.firstStep && (
                        <p><b>漏掉的第一步：</b>{entry.firstStep}</p>
                      )}
                      <p><b>正确判据：</b>{entry.rule}</p>
                      <button type="button" onClick={() => goToModule(entry.moduleId)}>
                        回到关联节点 →
                      </button>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="syllabus-section">
            <div className="minor-heading">
              <span>14-WEEK ALIGNMENT</span>
              <h2>老师教学计划逐周对齐</h2>
            </div>
            <div className="syllabus-grid">
              {syllabus.map((item) => (
                <article key={item.week}>
                  <span>{item.week}</span>
                  <b>{item.chinese}</b>
                  <p><MathText text={item.topic} /></p>
                </article>
              ))}
            </div>
          </section>

          <CloudSyncPanel
            localState={state}
            selectedModuleId={selected.id}
            onApplyCloud={(nextState) => {
              setState(nextState);
              setSelectedId(nextState.lastModule);
            }}
            onSelectModule={goToModule}
          />

          <section className="data-controls">
            <div>
              <b>本机记录始终是默认安全副本</b>
              <p>
                包括 gate 证据、节点状态、诊断、笔记、复习队列和错因；只有在上方明确选择“本机 → 云端”时，支持的字段才会上传。
                {importStatus && <span className="import-status">{importStatus}</span>}
              </p>
            </div>
            <div>
              <button type="button" onClick={exportProgress}>导出 JSON 备份</button>
              <label className="import-button">
                导入 JSON 恢复
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => {
                    void importProgress(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
              <button className="danger" type="button" onClick={clearProgress}>
                清空本机记录
              </button>
            </div>
          </section>
        </section>
      )}

      {activeTab === "errata" && (
        <section className="library-page" id="top">
          <PageHeading
            kicker="VERIFIED ERRATA"
            title="原资料有误时，不静默照抄"
            description="每条都保留“原式—问题—标准更正—快速验证—考场写法”。红色只用于明确错误，不用于评价学习者。"
          />
          <div className="errata-intro">
            <strong>{materialErrata.length}</strong>
            <div>
              <b>条需要你主动知道的资料问题</b>
              <p>
                网页采用量纲、极限和标准推导核验后的形式。重修考试若沿用老师记号，先声明定义，再保持自洽。
              </p>
            </div>
          </div>
          <div className="errata-list">
            {materialErrata.map((item, index) => (
              <article key={item.id}>
                <div className="errata-number">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item.severity}</b>
                </div>
                <div className="errata-content">
                  <div className="errata-source"><MathText text={item.source} /></div>
                  <h2>老师原资料</h2>
                  <p><MathText text={item.original} /></p>
                  <div className="errata-grid">
                    <div>
                      <span>问题在哪里</span>
                      <p><MathText text={item.problem} /></p>
                    </div>
                    <div className="corrected">
                      <span>网页采用的标准更正</span>
                      <p><MathText text={item.corrected} /></p>
                    </div>
                    <div>
                      <span>30 秒快速验证</span>
                      <p><MathText text={item.verify} /></p>
                    </div>
                    <div>
                      <span>考场建议</span>
                      <p><MathText text={item.exam} /></p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer>
        <div>
          <span className="brand-mark small">Σ</span>
          <p>
            <b>PHY301 重修通关树</b>
            <small>本地优先 · 内容可离线阅读 · 可选同源云同步</small>
          </p>
        </div>
        <p>
          正确的“快”是少走回头路。<br />
          每次只推进一个可验证的认知动作。
        </p>
      </footer>
    </main>
  );
}

function PageHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{kicker}</p>
      <h1><MathText text={title} /></h1>
      <p><MathText text={description} /></p>
    </header>
  );
}

function ModuleReader({
  module,
  index,
  mode,
  mastery,
  statuses,
  gateChecks,
  canConfirm,
  note,
  onMastery,
  onGateCheck,
  onGateFail,
  onNote,
  onNavigate,
  onAsk,
}: {
  module: StudyModule;
  index: number;
  mode: "core" | "full";
  mastery: Mastery;
  statuses: Record<string, Mastery>;
  gateChecks: boolean[];
  canConfirm: boolean;
  note: string;
  onMastery: (mastery: Mastery) => void;
  onGateCheck: (criterionIndex: number, checked: boolean) => void;
  onGateFail: () => void;
  onNote: (note: string) => void;
  onNavigate: (id: string) => void;
  onAsk: () => void;
}) {
  const phase = phaseOf(module);
  const dependencyModules = (moduleDependencies[module.id] ?? [])
    .map((id) => modules.find((item) => item.id === id))
    .filter((item): item is StudyModule => Boolean(item));
  const dependenciesReady = dependencyModules.every((dependency) =>
    ["provisional", "confirmed"].includes(
      statuses[dependency.id] ?? "new",
    ),
  );
  const concepts =
    mode === "core"
      ? module.concepts.filter((concept) => concept.core !== false)
      : module.concepts;
  const gateComplete = module.gate.criteria.every(
    (_, criterionIndex) => gateChecks[criterionIndex],
  );

  return (
    <>
      <header className="module-header">
        <div className="module-overline">
          <span>{module.week}</span>
          <span>{phase.label}</span>
          <span>核心 {module.hoursCore}h · 完整 {module.hoursFull}h</span>
        </div>
        <div className="module-title-row">
          <span className="module-big-index">{String(index).padStart(2, "0")}</span>
          <div>
            <h1><MathText text={module.title} /></h1>
            <p>{module.english}</p>
          </div>
        </div>
        <div className="module-goal">
          <span>本节只解决</span>
          <p><MathText text={module.goal} /></p>
        </div>
        <p className="module-why"><MathText text={module.why} /></p>
      </header>

      <section className="readiness-grid">
        <article className="prereq-card">
          <span>先修入口检查</span>
          <h2>开始前，确认这些动作不陌生</h2>
          <div className="dependency-links">
            {dependencyModules.length === 0 ? (
              <b>这是主树起点，无强制前置</b>
            ) : (
              dependencyModules.map((dependency) => {
                const status = statuses[dependency.id] ?? "new";
                const ready = ["provisional", "confirmed"].includes(status);
                return (
                  <button
                    type="button"
                    className={ready ? "ready" : ""}
                    key={dependency.id}
                    onClick={() => onNavigate(dependency.id)}
                  >
                    <span>{ready ? "✓" : "待补"}</span>
                    {dependency.title}
                  </button>
                );
              })
            )}
          </div>
          <ul>
            {module.prerequisites.map((item) => (
              <li key={item}><MathText text={item} /></li>
            ))}
          </ul>
          <p>若其中一项完全陌生，先补对应短支线；“看过”不等于会做。</p>
        </article>
        <article className="outcome-card">
          <span>通过后的证据</span>
          <h2>你应能独立做到</h2>
          <ul>
            {module.outcomes.map((item) => (
              <li key={item}><MathText text={item} /></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="source-chips">
        <span>老师材料锚点</span>
        <div>
          {module.sourceRefs.map((source) => (
            <b key={source}><MathText text={source} /></b>
          ))}
        </div>
      </section>

      <section className="module-question-route" aria-labelledby="module-question-title">
        <div>
          <span>卡住就问 · 不跳过当前节点</span>
          <h2 id="module-question-title">把问题绑在这一节，回来时仍从这里继续</h2>
          <p>
            记录问题不会改变进度、勾选 gate 或重排学习树；先写下一个具体疑问，再继续当前顺序。
          </p>
        </div>
        <button type="button" onClick={onAsk}>
          记录本节点问题 →
        </button>
      </section>

      <section className="concept-stack">
        <div className="reader-section-heading">
          <span>CORE LESSON</span>
          <h2>直觉 → 定义 → 推导 → 例题 → 自检</h2>
          <p>
            每张卡先读直觉并在纸上预测，再展开解释。答案默认折叠，避免“看懂答案”的错觉。
          </p>
        </div>
        {concepts.map((concept, conceptIndex) => {
          const formulaDerivation = concept.formula
            ? getConceptFormulaDerivation(module.id, concept.title)
            : undefined;
          return (
          <article
            className="concept-card"
            id={formulaDerivation ? `formula-${formulaDerivation.id}` : undefined}
            key={`${module.id}-${concept.title}`}
          >
            <div className="concept-heading">
              <span className="concept-index">
                {String(conceptIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <small><MathText text={concept.label} /> · 建议 35–60 分钟</small>
                <h3><MathText text={concept.title} /></h3>
              </div>
            </div>
            <div className="intuition-box">
              <span>先抓直觉</span>
              <p><MathText text={concept.intuition} /></p>
            </div>
            {concept.formula && (
              <div className="concept-formula">
                <MathText text={concept.formula} display />
                {concept.formulaNote && <p><MathText text={concept.formulaNote} /></p>}
              </div>
            )}
            {formulaDerivation && (
              <FormulaWalkthrough
                id={`derivation-${formulaDerivation.id}`}
                derivation={formulaDerivation}
                exampleAvailable={Boolean(concept.example)}
              />
            )}
            <details className="lesson-details" open={mode === "full"}>
              <summary>
                <span>展开精确定义与完整解释</span>
                <small>{concept.explanation.length} 个认知动作</small>
              </summary>
              <ol className="explanation-list">
                {concept.explanation.map((paragraph, paragraphIndex) => (
                  <li key={paragraph}>
                    <span>{String(paragraphIndex + 1).padStart(2, "0")}</span>
                    <p><MathText text={paragraph} /></p>
                  </li>
                ))}
              </ol>
            </details>
            {concept.steps && (
              <details
                className="lesson-details steps-details"
                open={mode === "full"}
              >
                <summary>
                  <span>展开解题动作清单（先做什么）</span>
                  <small>每次只做一步</small>
                </summary>
                <ol className="derivation-steps">
                  {concept.steps.map((step, stepIndex) => (
                    <li key={step}>
                      <span>{stepIndex + 1}</span>
                      <p><MathText text={step} /></p>
                    </li>
                  ))}
                </ol>
                <div className="triple-check">
                  <b>三重自检</b>
                  <span>① 指数/结果量纲</span>
                  <span>② 高低温或大 N 极限</span>
                  <span>③ 符号与物理方向</span>
                </div>
              </details>
            )}
            {concept.example && (
              <div className="worked-example">
                <span>完整例题 · 先在纸上写第一步</span>
                <h4><MathText text={concept.example.question} /></h4>
                <details>
                  <summary>我已经尝试过，展开分步解答</summary>
                  <ol>
                    {concept.example.solution.map((step) => (
                      <li key={step}><MathText text={step} /></li>
                    ))}
                  </ol>
                </details>
              </div>
            )}
            <div className="concept-bottom-grid">
              {concept.pitfalls && (
                <details className="pitfall-box">
                  <summary>常见坑 · 提交答案前检查</summary>
                  <ul>
                    {concept.pitfalls.map((pitfall) => (
                      <li key={pitfall}><MathText text={pitfall} /></li>
                    ))}
                  </ul>
                </details>
              )}
              {concept.check && (
                <div className="self-check">
                  <span>闭卷自测</span>
                  <p><MathText text={concept.check.question} /></p>
                  <details>
                    <summary>说出答案后再展开</summary>
                    <p><MathText text={concept.check.answer} /></p>
                  </details>
                </div>
              )}
            </div>
          </article>
          );
        })}
      </section>

      {module.deepDives.length > 0 && (
        <section className="deep-dive-section">
          <div className="reader-section-heading">
            <span>JUST IN TIME / DEEP DIVE</span>
            <h2>{mode === "core" ? "按需展开，不阻塞主线" : "完整深读支线"}</h2>
            <p>
              只有标题描述的场景需要时才看；读完合上，回到本节 gate。
            </p>
          </div>
          <div className="deep-dive-list">
            {module.deepDives.map((deepDive) => (
              <details key={deepDive.title} open={mode === "full"}>
                <summary>
                  <div>
                    <b><MathText text={deepDive.title} /></b>
                    <p><MathText text={deepDive.summary} /></p>
                  </div>
                  <span>展开支线</span>
                </summary>
                <div className="deep-dive-body">
                  {deepDive.paragraphs.map((paragraph) => (
                    <p key={paragraph}><MathText text={paragraph} /></p>
                  ))}
                  {deepDive.formulas?.map((formula) => {
                    const formulaDerivation = getDeepDiveFormulaDerivation(
                      module.id,
                      deepDive.title,
                      formula,
                    );
                    return (
                      <div className="deep-formula-group" key={formula}>
                        <MathText text={formula} display />
                        {formulaDerivation && (
                          <FormulaWalkthrough
                            id={`derivation-${formulaDerivation.id}`}
                            derivation={formulaDerivation}
                            compact
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <TeacherFormulaSupplements moduleId={module.id} />

      <section className="practice-section">
        <div className="reader-section-heading">
          <span>FADED PRACTICE</span>
          <h2>从跟做，逐步撤掉提示</h2>
          <p>先完成 instruction；答案只用于核对第一步和结构。</p>
        </div>
        <div className="practice-grid">
          {module.practice.map((practice, practiceIndex) => (
            <article key={practice.title}>
              <span>练习 {String(practiceIndex + 1).padStart(2, "0")}</span>
              <h3><MathText text={practice.title} /></h3>
              <p><MathText text={practice.instruction} /></p>
              {practice.source && <small>来源：<MathText text={practice.source} /></small>}
              <details>
                <summary>完成后核对结构</summary>
                <p><MathText text={practice.answer} /></p>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="gate-flag">MASTERY GATE</div>
        <div className="gate-main">
          <span>只有主动输出才算通过</span>
          <h2><MathText text={module.gate.prompt} /></h2>
          <div className="gate-criteria">
            {module.gate.criteria.map((criterion, criterionIndex) => (
              <label key={criterion}>
                <input
                  type="checkbox"
                  checked={Boolean(gateChecks[criterionIndex])}
                  onChange={(event) =>
                    onGateCheck(criterionIndex, event.target.checked)
                  }
                />
                <span><MathText text={criterion} /></span>
              </label>
            ))}
          </div>
          {!gateComplete && (
            <p className="gate-evidence-note">
              先在纸上完成 gate，再逐项勾选证据。未勾完时不能标记“核心通过”。
            </p>
          )}
          {!dependenciesReady && (
            <p className="gate-evidence-note">
              仍有待补的先修节点。你可以先读本节预览，但先修未通过前不能把本节标为“核心通过”。
            </p>
          )}
          <div className="traffic-rules">
            <div className="green">
              <b>绿灯</b>
              <span>红线项全对、综合 ≥80%、无提示 → 进入下一节</span>
            </div>
            <div className="yellow">
              <b>黄灯</b>
              <span>60–79% 或依赖提示 → 只补 10–25 分钟支线</span>
            </div>
            <div className="red">
              <b>红灯</b>
              <span>&lt;60% 或定义/方向错 → 回最近先修，再换变式</span>
            </div>
          </div>
          <div className="mastery-actions">
            <div>
              <span>当前状态</span>
              <b>{statusMeta[mastery].label}</b>
            </div>
            <button
              type="button"
              className="gate-fail"
              onClick={onGateFail}
            >
              本次没通过 · 记录错因
            </button>
            <button
              type="button"
              className={mastery === "learning" ? "active" : ""}
              onClick={() => onMastery("learning")}
            >
              标记正在学习
            </button>
            <button
              type="button"
              className={mastery === "provisional" ? "active" : ""}
              disabled={
                !gateComplete ||
                !dependenciesReady ||
                mastery === "provisional" ||
                mastery === "confirmed"
              }
              onClick={() => onMastery("provisional")}
            >
              核心通过 · 加入复习
            </button>
            <button
              type="button"
              className={mastery === "confirmed" ? "active confirmed" : ""}
              disabled={mastery !== "confirmed" && !canConfirm}
              onClick={() => onMastery("confirmed")}
            >
              {mastery === "confirmed"
                ? "3 日变式已通过"
                : "完成 3 日复测后确认"}
            </button>
          </div>
        </div>
      </section>

      <section className="module-note">
        <label htmlFor={`note-${module.id}`}>
          <span>本节 30 秒收尾 / 个人笔记</span>
          <small>只写：一个问题、一条关系、一个易错点。自动保存在本机浏览器。</small>
        </label>
        <textarea
          id={`note-${module.id}`}
          value={note}
          onChange={(event) => onNote(event.target.value)}
          placeholder="例：正则的控制量是 T,V,N；Z 是权重总和；求 ∂β 时保持 V,N。"
        />
      </section>
    </>
  );
}
