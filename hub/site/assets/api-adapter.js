const API_BASE = "/api/v1";
const CACHE_PREFIX = "course-hub:dashboard:v1:";
const CACHE_VERSION = 2;
const MIGRATABLE_CACHE_VERSIONS = new Set([1, CACHE_VERSION]);
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const COMPLETED_STATES = new Set(["core_passed", "review_passed"]);
const PROGRESS_STATES = new Set(["not_started", "in_progress", ...COMPLETED_STATES]);

export class ApiError extends Error {
  constructor(message, { status = 0, code = "network_error", cause } = {}) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class CourseHubApi {
  constructor({ fetchImpl = globalThis.fetch, timeoutMs = 8000 } = {}) {
    if (typeof fetchImpl !== "function") {
      throw new TypeError("A fetch implementation is required.");
    }
    this.fetchImpl = fetchImpl;
    this.timeoutMs = timeoutMs;
    this.csrfToken = null;
  }

  async health() {
    return this.request("/health");
  }

  async resumeSession() {
    const result = await this.request("/session");
    this.csrfToken = typeof result.csrfToken === "string" ? result.csrfToken : null;
    return result;
  }

  async login(token) {
    if (typeof token !== "string" || token.length === 0) {
      throw new ApiError("请输入访问令牌。", { status: 400, code: "missing_token" });
    }

    const result = await this.request("/session", {
      method: "POST",
      body: { token },
      includeCsrf: false,
    });
    this.csrfToken = typeof result.csrfToken === "string" ? result.csrfToken : null;
    return result;
  }

  async logout() {
    const result = await this.request("/session", { method: "DELETE" });
    this.csrfToken = null;
    return result;
  }

  async snapshot(slug) {
    return this.request(`/courses/${encodeURIComponent(slug)}/snapshot`);
  }

  async loadSnapshots(slugs) {
    const settled = await Promise.allSettled(slugs.map((slug) => this.snapshot(slug)));
    const snapshots = new Map();
    const errors = new Map();

    settled.forEach((result, index) => {
      const slug = slugs[index];
      if (result.status === "fulfilled") {
        snapshots.set(slug, result.value);
      } else {
        errors.set(slug, result.reason);
      }
    });

    return { snapshots, errors };
  }

  async request(path, { method = "GET", body, includeCsrf = true } = {}) {
    const normalizedMethod = method.toUpperCase();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = { Accept: "application/json" };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (includeCsrf && WRITE_METHODS.has(normalizedMethod) && this.csrfToken) {
      headers["X-CSRF-Token"] = this.csrfToken;
    }

    let response;
    try {
      response = await this.fetchImpl(`${API_BASE}${path}`, {
        method: normalizedMethod,
        credentials: "same-origin",
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      const timedOut = error?.name === "AbortError";
      throw new ApiError(timedOut ? "连接超时。" : "暂时无法连接同步服务。", {
        code: timedOut ? "timeout" : "network_error",
        cause: error,
      });
    } finally {
      clearTimeout(timeout);
    }

    const payload = await readJsonSafely(response);
    if (!response.ok) {
      const message = payload?.error?.message || `同步服务返回 ${response.status}。`;
      const code = payload?.error?.code || `http_${response.status}`;
      throw new ApiError(message, { status: response.status, code });
    }

    return response.status === 204 ? null : payload;
  }
}

async function readJsonSafely(response) {
  if (response.status === 204) return null;
  const contentType = response.headers?.get?.("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function summarizeSnapshot(snapshot, course) {
  const granular = normalizeGranularState(snapshot);
  const compatibility = normalizeCompatibilityState(snapshot?.learningState);
  const state = selectAuthoritativeState(course?.stateSource, granular, compatibility);
  const { progress, notes, questions, recent } = state;
  const completed = progress.filter((item) => COMPLETED_STATES.has(item?.status)).length;
  const inProgress = progress.filter((item) => item?.status === "in_progress").length;
  const expectedNodes = positiveIntegerOrNull(course?.expectedNodes);
  const progressMetrics = calculateProgressMetrics(completed, progress.length, expectedNodes);

  return {
    version: CACHE_VERSION,
    slug: course.slug,
    code: course.code,
    titleZh: course.titleZh,
    route: course.route,
    expectedNodes,
    progressRecords: progress.length,
    completed,
    inProgress,
    percent: progressMetrics.percent,
    percentBasis: progressMetrics.percentBasis,
    recent,
    noteCount: notes.length,
    questionCount: questions.length,
    openQuestionCount: questions.filter((item) => item?.status === "open").length,
    notes: notes.sort(compareUpdatedDescending).slice(0, 4),
    questions: questions.sort(compareUpdatedDescending).slice(0, 4),
    cachedAt: new Date().toISOString(),
  };
}

function emptyNormalizedState() {
  return { valid: false, progress: [], notes: [], questions: [], recent: null };
}

function normalizeStrictArray(value, normalizer) {
  if (!Array.isArray(value)) return { valid: false, items: [] };
  const normalized = value.map(normalizer);
  return {
    valid: normalized.every(Boolean),
    items: normalized.filter(Boolean),
  };
}

function normalizeGranularState(snapshot) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return emptyNormalizedState();
  }

  const progress = normalizeStrictArray(snapshot.progress, normalizeProgress);
  const notes = normalizeStrictArray(snapshot.notes, normalizeNote);
  const questions = normalizeStrictArray(snapshot.questions, normalizeQuestion);
  const recentIsEmpty = snapshot.recent === null;
  const recent = recentIsEmpty ? null : normalizeRecent(snapshot.recent);

  return {
    valid: progress.valid && notes.valid && questions.valid && (recentIsEmpty || Boolean(recent)),
    progress: progress.items,
    notes: notes.items,
    questions: questions.items,
    recent,
  };
}

function selectAuthoritativeState(stateSource, granular, compatibility) {
  if (!["granular", "compatibility"].includes(stateSource)) {
    throw new TypeError(`Unsupported course stateSource: ${String(stateSource)}`);
  }
  const preferred = stateSource === "granular" ? granular : compatibility;
  const fallback = stateSource === "granular" ? compatibility : granular;
  if (preferred.valid) return preferred;
  if (fallback.valid) return fallback;
  return emptyNormalizedState();
}

function calculateProgressMetrics(completed, progressRecords, expectedNodes) {
  const denominator = expectedNodes ?? (progressRecords > 0 ? progressRecords : null);
  return {
    percent: denominator
      ? Math.min(100, Math.round((completed / denominator) * 100))
      : null,
    percentBasis: expectedNodes ? "course" : progressRecords > 0 ? "tracked" : "unknown",
  };
}

function normalizeCompatibilityState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return emptyNormalizedState();
  }

  const updatedAt = safeDateString(value.updatedAt);
  const completedField = value.completed !== undefined ? value.completed : value.completedNodes;
  const rawCompleted = completedField === undefined ? [] : completedField;
  const completedIsValid = Array.isArray(rawCompleted)
    && rawCompleted.every((item) => typeof item === "string" && item.trim());
  const completedIds = completedIsValid ? [...new Set(rawCompleted)] : [];
  const progress = completedIds.map((nodeId) => ({
    nodeId: nodeId.slice(0, 128),
    status: "core_passed",
    updatedAt,
  }));

  const notesValue = value.notes === undefined ? {} : value.notes;
  const notesIsObject = notesValue && typeof notesValue === "object" && !Array.isArray(notesValue);
  const noteEntries = notesIsObject ? Object.entries(notesValue) : [];
  const notesAreValid = notesIsObject && noteEntries.every(
    ([nodeId, content]) => typeof nodeId === "string" && nodeId.trim()
      && typeof content === "string",
  );
  const notes = notesAreValid
    ? noteEntries
      .filter(([, content]) => content.trim())
      .map(([nodeId, content]) => normalizeNote({ nodeId, content, updatedAt }))
      .filter(Boolean)
    : [];

  const questionsValue = value.questions === undefined ? [] : value.questions;
  const questionsAreArray = Array.isArray(questionsValue);
  const questions = questionsAreArray
    ? questionsValue
      .map((item) => normalizeQuestion(item && typeof item === "object" ? {
        id: typeof item.id === "string" ? item.id : null,
        nodeId: typeof item.nodeId === "string" ? item.nodeId.slice(0, 128) : null,
        question: item.text,
        status: item.resolved === true ? "answered" : "open",
        updatedAt: safeDateString(item.updatedAt) || safeDateString(item.createdAt) || updatedAt,
      } : null))
      .filter(Boolean)
    : [];
  const questionsAreValid = questionsAreArray && questions.length === questionsValue.length;

  const recentNodeId = compatibilityRecentNode(value);
  const hasRecentValue = value.lastNode !== undefined || value.lastLocation !== undefined;
  const recentIsValid = !hasRecentValue || Boolean(recentNodeId);
  return {
    valid: completedIsValid && notesAreValid && questionsAreValid && recentIsValid,
    progress,
    notes,
    questions,
    recent: recentNodeId ? { nodeId: recentNodeId, subsection: null, updatedAt } : null,
  };
}

function compatibilityRecentNode(value) {
  if (typeof value.lastNode === "string" && value.lastNode.trim()) {
    return value.lastNode.slice(0, 128);
  }
  if (typeof value.lastLocation !== "string") return null;
  const match = value.lastLocation.match(/(?:^|#\/)\/?(?:lesson|node)\/([^/?#]+)/);
  return match ? decodeURIComponentSafely(match[1]).slice(0, 128) : null;
}

function decodeURIComponentSafely(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function positiveIntegerOrNull(value) {
  return Number.isInteger(value) && value > 0 ? value : null;
}

function nonNegativeIntegerOrZero(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function normalizeProgress(value) {
  if (!value || typeof value.nodeId !== "string" || !PROGRESS_STATES.has(value.status)) return null;
  return {
    nodeId: value.nodeId.slice(0, 128),
    status: value.status,
    updatedAt: safeDateString(value.updatedAt),
  };
}

function normalizeRecent(value) {
  if (!value || typeof value.nodeId !== "string") return null;
  return {
    nodeId: value.nodeId.slice(0, 128),
    subsection: typeof value.subsection === "string" ? value.subsection.slice(0, 512) : null,
    updatedAt: safeDateString(value.updatedAt),
  };
}

function normalizeNote(value) {
  if (!value || typeof value.nodeId !== "string" || typeof value.content !== "string") return null;
  return {
    nodeId: value.nodeId.slice(0, 128),
    content: value.content.slice(0, 1200),
    updatedAt: safeDateString(value.updatedAt),
  };
}

function normalizeQuestion(value) {
  if (!value || typeof value.question !== "string") return null;
  return {
    id: Number.isInteger(value.id) ? value.id : null,
    nodeId: typeof value.nodeId === "string" ? value.nodeId.slice(0, 128) : null,
    question: value.question.slice(0, 1200),
    status: ["open", "answered", "archived"].includes(value.status) ? value.status : "open",
    updatedAt: safeDateString(value.updatedAt),
  };
}

function safeDateString(value) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return null;
  return value;
}

function compareUpdatedDescending(left, right) {
  return Date.parse(right.updatedAt || 0) - Date.parse(left.updatedAt || 0);
}

export function saveSummaryCache(storage, summary) {
  if (!storage || !summary?.slug) return false;
  try {
    storage.setItem(`${CACHE_PREFIX}${summary.slug}`, JSON.stringify(summary));
    return true;
  } catch {
    return false;
  }
}

export function loadSummaryCache(storage, course) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(`${CACHE_PREFIX}${course.slug}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!MIGRATABLE_CACHE_VERSIONS.has(parsed?.version) || parsed?.slug !== course.slug) return null;
    const expectedNodes = positiveIntegerOrNull(course.expectedNodes);
    const completed = nonNegativeIntegerOrZero(parsed.completed);
    const progressRecords = nonNegativeIntegerOrZero(parsed.progressRecords);
    const progressMetrics = calculateProgressMetrics(completed, progressRecords, expectedNodes);
    return {
      ...parsed,
      version: CACHE_VERSION,
      code: course.code,
      titleZh: course.titleZh,
      route: course.route,
      expectedNodes,
      completed,
      progressRecords,
      percent: progressMetrics.percent,
      percentBasis: progressMetrics.percentBasis,
    };
  } catch {
    return null;
  }
}

export function isUnauthorized(error) {
  return error instanceof ApiError && error.status === 401;
}

export const API_CONTRACT = Object.freeze({
  base: API_BASE,
  credentials: "same-origin",
  csrfHeader: "X-CSRF-Token",
  cachePrefix: CACHE_PREFIX,
});
