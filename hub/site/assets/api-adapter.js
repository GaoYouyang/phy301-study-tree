const API_BASE = "/api/v1";
const CACHE_PREFIX = "course-hub:dashboard:v1:";
const CACHE_VERSION = 1;
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const COMPLETED_STATES = new Set(["core_passed", "review_passed"]);

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
  const progress = Array.isArray(snapshot?.progress) ? snapshot.progress : [];
  const notes = Array.isArray(snapshot?.notes) ? snapshot.notes : [];
  const questions = Array.isArray(snapshot?.questions) ? snapshot.questions : [];
  const completed = progress.filter((item) => COMPLETED_STATES.has(item?.status)).length;
  const inProgress = progress.filter((item) => item?.status === "in_progress").length;
  const expectedNodes = positiveIntegerOrNull(course?.expectedNodes);
  const denominator = expectedNodes ?? (progress.length > 0 ? progress.length : null);
  const percent = denominator ? Math.min(100, Math.round((completed / denominator) * 100)) : null;

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
    percent,
    percentBasis: expectedNodes ? "course" : progress.length > 0 ? "tracked" : "unknown",
    recent: normalizeRecent(snapshot?.recent),
    noteCount: notes.length,
    questionCount: questions.length,
    openQuestionCount: questions.filter((item) => item?.status === "open").length,
    notes: notes
      .map(normalizeNote)
      .filter(Boolean)
      .sort(compareUpdatedDescending)
      .slice(0, 4),
    questions: questions
      .map(normalizeQuestion)
      .filter(Boolean)
      .sort(compareUpdatedDescending)
      .slice(0, 4),
    cachedAt: new Date().toISOString(),
  };
}

function positiveIntegerOrNull(value) {
  return Number.isInteger(value) && value > 0 ? value : null;
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
    if (parsed?.version !== CACHE_VERSION || parsed?.slug !== course.slug) return null;
    return {
      ...parsed,
      code: course.code,
      titleZh: course.titleZh,
      route: course.route,
      expectedNodes: positiveIntegerOrNull(course.expectedNodes),
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
