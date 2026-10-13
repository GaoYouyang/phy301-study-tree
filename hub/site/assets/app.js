import { CourseHubApi, isUnauthorized, loadSummaryCache, saveSummaryCache, summarizeSnapshot } from "./api-adapter.js?v=0016d3cc04de";
import { COURSES, COURSE_BY_SLUG, courseAvailabilityPresentation } from "./course-config.js?v=486f22d8755f";

const api = new CourseHubApi();
const summaries = new Map();
let refreshInFlight = false;

const elements = {
  refreshButton: document.querySelector("#refresh-button"),
  syncDot: document.querySelector("#sync-dot"),
  syncTitle: document.querySelector("#sync-title"),
  syncDescription: document.querySelector("#sync-description"),
  showLoginButton: document.querySelector("#show-login-button"),
  logoutButton: document.querySelector("#logout-button"),
  loginForm: document.querySelector("#login-form"),
  tokenInput: document.querySelector("#login-token"),
  loginError: document.querySelector("#login-error"),
  cancelLoginButton: document.querySelector("#cancel-login-button"),
  focusTitle: document.querySelector("#focus-title"),
  focusDetail: document.querySelector("#focus-detail"),
  focusLink: document.querySelector("#focus-link"),
  completedMetric: document.querySelector("#metric-completed"),
  questionsMetric: document.querySelector("#metric-questions"),
  notesMetric: document.querySelector("#metric-notes"),
  recentNotes: document.querySelector("#recent-notes"),
  recentQuestions: document.querySelector("#recent-questions"),
  activitySource: document.querySelector("#activity-source"),
  lastUpdated: document.querySelector("#last-updated"),
  liveRegion: document.querySelector("#live-region"),
};

const NODE_LABELS = Object.freeze({
  "math-toolbox": "数学工具箱",
  "probability-counting": "概率与计数基础",
  "thermo-bridge": "热力学桥梁",
  "hamilton-phase-space": "Hamilton 力学与相空间",
  "statistical-entry": "统计物理入口",
  "phase-ensemble": "相空间与系综",
  microcanonical: "微正则系综",
  "classical-gases": "经典气体与热力学定律",
  canonical: "正则系综",
  "grand-canonical": "巨正则系综",
  "interactions-vdw": "相互作用与 van der Waals 模型",
  "phase-transition": "相变",
  "midterm-review": "期中复习",
  "quantum-bridge": "量子力学桥梁",
  "quantum-statistics": "量子统计",
  "bose-gas": "理想 Bose 气体",
  "fermi-gas": "理想 Fermi 气体",
  nonequilibrium: "非平衡统计",
  "final-review": "期末总复习",
});

function loadCachedSummaries() {
  summaries.clear();
  for (const course of COURSES) {
    const cached = loadSummaryCache(globalThis.localStorage, course);
    if (cached) summaries.set(course.slug, cached);
  }
}

async function refreshDashboard({ announce = false } = {}) {
  if (refreshInFlight) return;
  refreshInFlight = true;
  setRefreshing(true);

  const [healthResult, sessionResult] = await Promise.allSettled([api.health(), api.resumeSession()]);
  const serviceOnline = healthResult.status === "fulfilled" && healthResult.value?.status === "ok";

  if (sessionResult.status === "fulfilled") {
    const { snapshots, errors } = await api.loadSnapshots(COURSES.map((course) => course.slug));

    for (const course of COURSES) {
      const snapshot = snapshots.get(course.slug);
      if (snapshot) {
        const summary = summarizeSnapshot(snapshot, course);
        summaries.set(course.slug, summary);
        saveSummaryCache(globalThis.localStorage, summary);
      } else if (!summaries.has(course.slug)) {
        const cached = loadSummaryCache(globalThis.localStorage, course);
        if (cached) summaries.set(course.slug, cached);
      }
    }

    setSyncUi("connected", errors.size > 0
      ? `已连接；${errors.size} 门课程暂时沿用本机缓存。`
      : "四门课程的进度、笔记和问题已从云端同步。"
    );
    if (announce) say(errors.size > 0 ? "同步完成，部分课程使用缓存。" : "云同步已完成。");
  } else if (isUnauthorized(sessionResult.reason)) {
    loadCachedSummaries();
    setSyncUi(serviceOnline ? "signed-out" : "offline");
    if (announce) say(serviceOnline ? "同步服务在线，请登录后同步。" : "同步服务暂不可用，已显示本机缓存。");
  } else {
    loadCachedSummaries();
    setSyncUi("offline");
    if (announce) say("同步服务暂不可用，课程入口和本机缓存仍可使用。");
  }

  renderDashboard();
  setRefreshing(false);
  refreshInFlight = false;
}

function setRefreshing(isLoading) {
  elements.refreshButton.disabled = isLoading;
  elements.refreshButton.classList.toggle("is-loading", isLoading);
  elements.refreshButton.setAttribute("aria-busy", String(isLoading));
}

function setSyncUi(mode, overrideDescription) {
  const copy = {
    connected: {
      title: "云同步已连接",
      description: "四门课程的学习记录会在这台服务器上统一保存。",
      dot: "status-dot--online",
    },
    "signed-out": {
      title: "同步服务在线",
      description: "登录后即可在不同设备间继续学习；未登录不影响打开课程。",
      dot: "status-dot--checking",
    },
    offline: {
      title: "当前使用本机模式",
      description: "同步服务暂不可用；课程入口和已缓存概览仍然可用。",
      dot: "status-dot--offline",
    },
  }[mode];

  elements.syncTitle.textContent = copy.title;
  elements.syncDescription.textContent = overrideDescription || copy.description;
  elements.syncDot.className = `status-dot ${copy.dot}`;
  elements.showLoginButton.hidden = mode === "connected";
  elements.logoutButton.hidden = mode !== "connected";
  if (mode === "connected") toggleLogin(false);
  elements.activitySource.textContent = mode === "connected" ? "云端同步" : "本机缓存";
}

function renderDashboard() {
  for (const course of COURSES) {
    renderCourse(course, summaries.get(course.slug));
  }
  renderMetrics();
  renderFocus();
  renderActivities();
  renderTimestamp();
}

function renderCourse(course, summary) {
  const card = document.querySelector(`[data-course="${course.slug}"]`);
  if (!card) return;

  const label = card.querySelector('[data-role="progress-label"]');
  const value = card.querySelector('[data-role="progress-value"]');
  const bar = card.querySelector('[data-role="progress-bar"]');
  const track = card.querySelector('[role="progressbar"]');
  const recent = card.querySelector('[data-role="recent"]');
  const courseLink = card.querySelector('[data-role="course-link"]');
  const courseState = card.querySelector('[data-role="course-state"]');

  courseLink.href = course.route;
  const availability = courseAvailabilityPresentation(course.availability);
  courseState.textContent = availability.label;
  courseState.classList.remove("course-state--ready", "course-state--building");
  courseState.classList.add(availability.className);

  if (!summary) {
    const isReady = course.availability === "ready";
    label.textContent = isReady ? "尚无已同步进度" : "待课程包接入";
    value.textContent = isReady ? "0%" : "—";
    bar.style.width = "0%";
    track.setAttribute("aria-valuenow", "0");
    track.setAttribute(
      "aria-label",
      isReady ? `${course.code} 课程完成度 0%` : `${course.code} 完成度尚不可用`,
    );
    recent.textContent = isReady ? "尚无云端续学位置" : "课程项目正在整理资料";
    return;
  }

  const percent = Number.isFinite(summary.percent) ? summary.percent : 0;
  if (summary.percentBasis === "course") {
    label.textContent = `${summary.completed}/${summary.expectedNodes} 个节点已完成`;
    value.textContent = `${percent}%`;
  } else if (summary.percentBasis === "tracked") {
    label.textContent = `${summary.completed}/${summary.progressRecords} 条已记录进度`;
    value.textContent = `${percent}%*`;
  } else {
    label.textContent = "尚无已同步进度";
    value.textContent = course.availability === "ready" ? "0%" : "—";
  }

  bar.style.width = `${percent}%`;
  track.setAttribute("aria-valuenow", String(percent));
  track.setAttribute(
    "aria-label",
    `${course.code} ${summary.percentBasis === "tracked" ? "已记录节点" : "课程"}完成度 ${percent}%`,
  );

  if (summary.recent) {
    const subsection = summary.recent.subsection ? ` · ${summary.recent.subsection}` : "";
    recent.textContent = `上次：${nodeLabel(summary.recent.nodeId)}${subsection}`;
  } else {
    recent.textContent = "尚无云端续学位置";
  }
}

function renderMetrics() {
  const items = [...summaries.values()];
  const completed = sum(items, "completed");
  const questions = sum(items, "openQuestionCount");
  const notes = sum(items, "noteCount");
  elements.completedMetric.textContent = String(completed);
  elements.questionsMetric.textContent = String(questions);
  elements.notesMetric.textContent = String(notes);
}

function renderFocus() {
  const candidates = [...summaries.values()]
    .filter((summary) => summary.recent?.updatedAt)
    .sort((left, right) => Date.parse(right.recent.updatedAt) - Date.parse(left.recent.updatedAt));

  if (candidates.length === 0) {
    const phy301 = COURSE_BY_SLUG.get("phy301");
    elements.focusTitle.textContent = "先进入 PHY301，沿学习树顺序推进";
    elements.focusDetail.textContent = "建议从前置桥梁开始；每完成一个节点，再进入依赖它的下一节点。";
    elements.focusLink.href = phy301.route;
    return;
  }

  const latest = candidates[0];
  const course = COURSE_BY_SLUG.get(latest.slug);
  const subsection = latest.recent.subsection ? ` · ${latest.recent.subsection}` : "";
  elements.focusTitle.textContent = `继续 ${course.code}：${nodeLabel(latest.recent.nodeId)}`;
  elements.focusDetail.textContent = `这是最近一次学习位置${subsection}。先复述上一小节，再继续向后读。`;
  elements.focusLink.href = course.route;
}

function renderActivities() {
  const noteItems = [];
  const questionItems = [];

  for (const summary of summaries.values()) {
    for (const note of summary.notes || []) noteItems.push({ ...note, slug: summary.slug, code: summary.code });
    for (const question of summary.questions || []) {
      if (question.status !== "archived") questionItems.push({ ...question, slug: summary.slug, code: summary.code });
    }
  }

  noteItems.sort(sortByUpdated);
  questionItems.sort(sortByUpdated);
  renderActivityList(elements.recentNotes, noteItems.slice(0, 3), "note");
  renderActivityList(elements.recentQuestions, questionItems.slice(0, 3), "question");
}

function renderActivityList(list, items, type) {
  list.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = type === "note" ? "目前没有可显示的笔记。" : "目前没有可显示的问题。";
    list.append(empty);
    return;
  }

  for (const item of items) {
    const row = document.createElement("li");
    row.className = "activity-item";

    const code = document.createElement("span");
    code.className = "activity-code";
    code.textContent = item.code;

    const content = document.createElement("div");
    const text = document.createElement("span");
    text.className = "activity-text";
    text.textContent = type === "note" ? item.content : item.question;

    const meta = document.createElement("span");
    meta.className = "activity-meta";
    const node = item.nodeId ? nodeLabel(item.nodeId) : "课程总问题";
    meta.textContent = `${node} · ${relativeTime(item.updatedAt)}`;

    content.append(text, meta);
    row.append(code, content);
    list.append(row);
  }
}

function renderTimestamp() {
  const timestamps = [...summaries.values()]
    .map((summary) => summary.cachedAt)
    .filter(Boolean)
    .map((value) => Date.parse(value))
    .filter(Number.isFinite);

  if (timestamps.length === 0) {
    elements.lastUpdated.textContent = "尚未同步";
    return;
  }
  const latest = new Date(Math.max(...timestamps));
  elements.lastUpdated.textContent = `概览更新于 ${formatDateTime(latest)}`;
}

function sum(items, field) {
  return items.reduce((total, item) => total + (Number(item?.[field]) || 0), 0);
}

function sortByUpdated(left, right) {
  return Date.parse(right.updatedAt || 0) - Date.parse(left.updatedAt || 0);
}

function nodeLabel(nodeId) {
  return NODE_LABELS[nodeId] || nodeId.replaceAll(/[-_]/g, " ");
}

function relativeTime(value) {
  const timestamp = Date.parse(value || 0);
  if (!Number.isFinite(timestamp)) return "时间未知";
  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const absolute = Math.abs(seconds);
  const formatter = new Intl.RelativeTimeFormat("zh-CN", { numeric: "auto" });
  if (absolute < 60) return formatter.format(seconds, "second");
  if (absolute < 3600) return formatter.format(Math.round(seconds / 60), "minute");
  if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
  if (absolute < 2_592_000) return formatter.format(Math.round(seconds / 86400), "day");
  return formatDateTime(new Date(timestamp));
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toggleLogin(show) {
  elements.loginForm.hidden = !show;
  elements.showLoginButton.setAttribute("aria-expanded", String(show));
  if (show) {
    elements.loginError.textContent = "";
    elements.tokenInput.removeAttribute("aria-invalid");
    elements.tokenInput.focus();
  } else {
    clearTokenInput();
  }
}

function clearTokenInput() {
  elements.tokenInput.value = "";
}

function say(message) {
  elements.liveRegion.textContent = "";
  requestAnimationFrame(() => {
    elements.liveRegion.textContent = message;
  });
}

elements.refreshButton.addEventListener("click", () => refreshDashboard({ announce: true }));
elements.showLoginButton.addEventListener("click", () => toggleLogin(true));
elements.cancelLoginButton.addEventListener("click", () => toggleLogin(false));

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  elements.loginError.textContent = "";
  elements.tokenInput.removeAttribute("aria-invalid");

  let token = elements.tokenInput.value;
  if (!token) {
    elements.loginError.textContent = "请输入访问令牌。";
    elements.tokenInput.setAttribute("aria-invalid", "true");
    elements.tokenInput.focus();
    return;
  }

  const submitButton = elements.loginForm.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "正在连接…";
  try {
    await api.login(token);
    clearTokenInput();
    token = "";
    toggleLogin(false);
    await refreshDashboard({ announce: true });
  } catch (error) {
    clearTokenInput();
    token = "";
    elements.tokenInput.setAttribute("aria-invalid", "true");
    elements.loginError.textContent = loginErrorMessage(error);
    elements.tokenInput.focus();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "登录并同步";
  }
});

elements.logoutButton.addEventListener("click", async () => {
  elements.logoutButton.disabled = true;
  try {
    await api.logout();
    setSyncUi("signed-out");
    say("已退出云同步；本机缓存仍保留。 ");
  } catch {
    setSyncUi("offline", "暂时无法联系同步服务；课程入口和本机缓存仍可使用。");
    say("暂时无法完成退出请求，请稍后重试。");
  } finally {
    elements.logoutButton.disabled = false;
  }
});

function loginErrorMessage(error) {
  if (error?.status === 401) return "访问令牌不正确，请重新输入。";
  if (error?.status === 429) return "尝试次数较多，请稍后再试。";
  if (error?.code === "timeout" || error?.code === "network_error") return "同步服务暂时无法连接。课程内容仍可直接打开。";
  return "暂时无法登录，请稍后重试。";
}

loadCachedSummaries();
renderDashboard();
refreshDashboard();
