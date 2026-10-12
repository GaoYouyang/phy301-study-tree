import type { Mastery, StoredState } from "./mastery-state";

const API_BASE = "/api/v1";
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export type CloudProgressStatus =
  | "not_started"
  | "in_progress"
  | "core_passed"
  | "review_passed";

export type CloudProgress = {
  nodeId: string;
  status: CloudProgressStatus;
  score: number | null;
  updatedAt: string;
};

export type CloudNote = {
  nodeId: string;
  content: string;
  updatedAt: string;
};

export type CloudQuestion = {
  id: number;
  nodeId: string | null;
  question: string;
  answer: string | null;
  status: "open" | "answered" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type CourseSnapshot = {
  course: {
    slug: string;
    code: string;
    titleZh: string;
    titleEn: string;
    enabled: boolean;
  };
  progress: CloudProgress[];
  notes: CloudNote[];
  questions: CloudQuestion[];
  recent: { nodeId: string; subsection: string | null; updatedAt: string } | null;
};

export class CourseHubError extends Error {
  status: number;
  code: string;

  constructor(
    message: string,
    { status = 0, code = "network_error", cause }: { status?: number; code?: string; cause?: unknown } = {},
  ) {
    super(message, { cause });
    this.name = "CourseHubError";
    this.status = status;
    this.code = code;
  }
}

export class CourseHubClient {
  private csrfToken: string | null = null;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor({ fetchImpl = fetch, timeoutMs = 8_000 }: { fetchImpl?: typeof fetch; timeoutMs?: number } = {}) {
    this.fetchImpl = fetchImpl;
    this.timeoutMs = timeoutMs;
  }

  async resumeSession() {
    const session = await this.request<{ authenticated: true; mode: string; csrfToken: string }>("/session");
    this.csrfToken = session.csrfToken;
    return session;
  }

  async login(token: string) {
    const session = await this.request<{ authenticated: true; csrfToken: string; expiresAt: string }>("/session", {
      method: "POST",
      body: { token },
      includeCsrf: false,
    });
    this.csrfToken = session.csrfToken;
    return session;
  }

  async logout() {
    await this.request<null>("/session", { method: "DELETE" });
    this.csrfToken = null;
  }

  snapshot() {
    return this.request<CourseSnapshot>("/courses/phy301/snapshot");
  }

  putProgress(nodeId: string, status: CloudProgressStatus) {
    return this.request<{ progress: CloudProgress }>(`/courses/phy301/progress/${encodeURIComponent(nodeId)}`, {
      method: "PUT",
      body: { status, score: null },
    });
  }

  putNote(nodeId: string, content: string) {
    return this.request<{ note: CloudNote }>(`/courses/phy301/notes/${encodeURIComponent(nodeId)}`, {
      method: "PUT",
      body: { content },
    });
  }

  putRecent(nodeId: string) {
    return this.request<{ recent: CourseSnapshot["recent"] }>("/courses/phy301/recent", {
      method: "PUT",
      body: { nodeId, subsection: null },
    });
  }

  createQuestion(nodeId: string, question: string) {
    return this.request<{ question: CloudQuestion }>("/courses/phy301/questions", {
      method: "POST",
      body: { nodeId, question },
    });
  }

  private async request<T>(
    path: string,
    {
      method = "GET",
      body,
      includeCsrf = true,
    }: { method?: string; body?: Record<string, unknown>; includeCsrf?: boolean } = {},
  ): Promise<T> {
    const normalizedMethod = method.toUpperCase();
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), this.timeoutMs);
    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (includeCsrf && WRITE_METHODS.has(normalizedMethod) && this.csrfToken) {
      headers["X-CSRF-Token"] = this.csrfToken;
    }

    let response: Response;
    try {
      response = await this.fetchImpl(`${API_BASE}${path}`, {
        method: normalizedMethod,
        credentials: "same-origin",
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      const timeoutError = error instanceof DOMException && error.name === "AbortError";
      throw new CourseHubError(timeoutError ? "连接超时。" : "暂时无法连接云端。", {
        code: timeoutError ? "timeout" : "network_error",
        cause: error,
      });
    } finally {
      globalThis.clearTimeout(timeout);
    }

    const payload = await parseJson(response);
    if (!response.ok) {
      const errorPayload = payload as { error?: { code?: string; message?: string } } | null;
      throw new CourseHubError(errorPayload?.error?.message ?? `云端返回 ${response.status}。`, {
        status: response.status,
        code: errorPayload?.error?.code ?? `http_${response.status}`,
      });
    }
    return (response.status === 204 ? null : payload) as T;
  }
}

async function parseJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  if (!(response.headers.get("content-type") ?? "").includes("application/json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function masteryToCloud(status: Mastery | undefined): CloudProgressStatus {
  return {
    new: "not_started",
    learning: "in_progress",
    provisional: "core_passed",
    confirmed: "review_passed",
  }[status ?? "new"] as CloudProgressStatus;
}

export function cloudToMastery(status: CloudProgressStatus): Mastery {
  return {
    not_started: "new",
    in_progress: "learning",
    core_passed: "provisional",
    review_passed: "confirmed",
  }[status] as Mastery;
}

export function mergeCloudSnapshot(
  local: StoredState,
  snapshot: CourseSnapshot,
  validModuleIds: ReadonlySet<string>,
): StoredState {
  const statuses = { ...local.statuses };
  const notes = { ...local.notes };

  for (const progress of snapshot.progress) {
    if (validModuleIds.has(progress.nodeId)) {
      statuses[progress.nodeId] = cloudToMastery(progress.status);
    }
  }
  for (const note of snapshot.notes) {
    if (validModuleIds.has(note.nodeId)) notes[note.nodeId] = note.content;
  }

  return {
    ...local,
    statuses,
    notes,
    lastModule:
      snapshot.recent && validModuleIds.has(snapshot.recent.nodeId)
        ? snapshot.recent.nodeId
        : local.lastModule,
  };
}

export function isSignedOut(error: unknown) {
  return error instanceof CourseHubError && error.status === 401;
}
