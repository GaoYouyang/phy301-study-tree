const SCHEMA_VERSION = "course-materials/v1";
export const DEFAULT_INVENTORY_TIMEOUT_MS = 8_000;
const MAX_GENERATED_AT_FUTURE_SKEW_MS = 10 * 60_000;

const INVENTORY_STATUSES = new Set([
  "verified-current-upload",
  "partial-current-upload",
  "unknown",
]);

const MATERIAL_CATEGORIES = new Set([
  "lecture",
  "syllabus",
  "assignment",
  "solution",
  "exam",
  "reference",
  "dataset",
  "code",
  "notebook",
  "other",
]);

const SOURCE_STATUSES = new Set(["published-original", "indexed-no-download"]);
const GAP_STATUSES = new Set(["expected-missing", "not-received", "not-issued", "unknown"]);

const ROOT_KEYS = [
  "schemaVersion",
  "course",
  "generatedAt",
  "inventoryStatus",
  "inventoryNote",
  "summary",
  "materials",
  "knownGaps",
  "freshness",
];

const COURSE_KEYS = ["code", "slug", "route", "nameZh", "nameEn"];
const SUMMARY_KEYS = ["sourceFiles", "publishedOriginals", "totalPages", "categoryCounts"];
const MATERIAL_KEYS = [
  "id",
  "title",
  "originalFileName",
  "category",
  "format",
  "sequence",
  "pages",
  "bytes",
  "sha256",
  "sourceStatus",
  "originalUrl",
  "derivativeCount",
  "derivativeLabels",
  "note",
];
const GAP_KEYS = ["id", "label", "status", "note"];
const FRESHNESS_KEYS = ["sourceAuditDate", "suggestedReviewDays", "updateTrigger"];

export const CATEGORY_LABELS = Object.freeze({
  lecture: "课件",
  syllabus: "教学大纲",
  assignment: "作业 / Tutorial",
  solution: "解答资料",
  exam: "考试资料",
  reference: "参考资料",
  dataset: "数据集",
  code: "代码",
  notebook: "Notebook",
  other: "其他",
});

export const INVENTORY_STATUS_PRESENTATION = Object.freeze({
  "verified-current-upload": Object.freeze({ label: "当前上传已核验", tone: "verified" }),
  "partial-current-upload": Object.freeze({ label: "当前上传不完整", tone: "partial" }),
  unknown: Object.freeze({ label: "上传状态待确认", tone: "unknown" }),
});

export const GAP_GROUPS = Object.freeze([
  Object.freeze({
    id: "unknown",
    label: "是否存在未知",
    description: "还不能确认老师是否发布过，不能当作缺失。",
    statuses: Object.freeze(["unknown"]),
  }),
  Object.freeze({
    id: "not-provided",
    label: "当前未收到",
    description: "当前资料包没有；可能尚未发放，也可能平台已有但尚未上传，需要回老师平台核对。",
    statuses: Object.freeze(["not-received", "not-issued"]),
  }),
  Object.freeze({
    id: "missing",
    label: "明确缺失",
    description: "确认应该存在，但当前原始资料包中没有。",
    statuses: Object.freeze(["expected-missing"]),
  }),
]);

const GAP_STATUS_LABELS = Object.freeze({
  unknown: "存在性待确认",
  "not-received": "当前未收到",
  "not-issued": "确认老师尚未发布",
  "expected-missing": "确认缺失",
});

export class InventoryValidationError extends Error {
  constructor(path, message) {
    super(`${path}: ${message}`);
    this.name = "InventoryValidationError";
    this.path = path;
  }
}

export class InventoryRequestTimeoutError extends Error {
  constructor(url, timeoutMs) {
    super(`读取 ${url} 超过 ${timeoutMs} 毫秒`);
    this.name = "InventoryRequestTimeoutError";
    this.code = "INVENTORY_REQUEST_TIMEOUT";
    this.url = url;
    this.timeoutMs = timeoutMs;
  }
}

export function validateMaterialInventory(
  value,
  expectedCourse,
  { now = new Date(), maxGeneratedAtFutureSkewMs = MAX_GENERATED_AT_FUTURE_SKEW_MS } = {},
) {
  assertPlainObject(value, "$", ROOT_KEYS);
  assertEqual(value.schemaVersion, SCHEMA_VERSION, "$.schemaVersion");

  assertPlainObject(value.course, "$.course", COURSE_KEYS);
  assertNonEmptyString(value.course.code, "$.course.code");
  assertPattern(value.course.slug, /^[a-z0-9-]+$/, "$.course.slug");
  assertPattern(value.course.route, /^\/[a-z0-9-]+\/$/, "$.course.route");
  assertNonEmptyString(value.course.nameZh, "$.course.nameZh");
  assertNonEmptyString(value.course.nameEn, "$.course.nameEn");

  if (expectedCourse) {
    assertEqual(value.course.slug, expectedCourse.slug, "$.course.slug");
    assertEqual(value.course.code, expectedCourse.code, "$.course.code");
    assertEqual(value.course.route, expectedCourse.route, "$.course.route");
  }

  assertDateTime(value.generatedAt, "$.generatedAt");
  assertNotFutureDateTime(value.generatedAt, now, maxGeneratedAtFutureSkewMs, "$.generatedAt");
  assertEnum(value.inventoryStatus, INVENTORY_STATUSES, "$.inventoryStatus");
  assertString(value.inventoryNote, "$.inventoryNote");

  assertPlainObject(value.summary, "$.summary", SUMMARY_KEYS);
  assertInteger(value.summary.sourceFiles, "$.summary.sourceFiles");
  assertInteger(value.summary.publishedOriginals, "$.summary.publishedOriginals");
  assertNullableInteger(value.summary.totalPages, "$.summary.totalPages");
  assertPlainObject(value.summary.categoryCounts, "$.summary.categoryCounts");
  for (const [category, count] of Object.entries(value.summary.categoryCounts)) {
    assertEnum(category, MATERIAL_CATEGORIES, `$.summary.categoryCounts.${category}`);
    assertInteger(count, `$.summary.categoryCounts.${category}`);
  }

  assertArray(value.materials, "$.materials");
  value.materials.forEach((material, index) => {
    const path = `$.materials[${index}]`;
    validateMaterial(material, path, value.course.route);
  });

  assertArray(value.knownGaps, "$.knownGaps");
  value.knownGaps.forEach((gap, index) => validateGap(gap, `$.knownGaps[${index}]`));

  assertPlainObject(value.freshness, "$.freshness", FRESHNESS_KEYS);
  assertPattern(value.freshness.sourceAuditDate, /^\d{4}-\d{2}-\d{2}$/, "$.freshness.sourceAuditDate");
  assertCalendarDate(value.freshness.sourceAuditDate, "$.freshness.sourceAuditDate");
  assertNotFutureCalendarDate(value.freshness.sourceAuditDate, now, "$.freshness.sourceAuditDate");
  assertInteger(value.freshness.suggestedReviewDays, "$.freshness.suggestedReviewDays", 1);
  assertNonEmptyString(value.freshness.updateTrigger, "$.freshness.updateTrigger");

  const ids = new Set();
  for (const [index, item] of [...value.materials, ...value.knownGaps].entries()) {
    if (ids.has(item.id)) throw new InventoryValidationError(`$[${index}].id`, "id must be unique");
    ids.add(item.id);
  }

  if (value.summary.sourceFiles !== value.materials.length) {
    throw new InventoryValidationError("$.summary.sourceFiles", "must equal materials.length");
  }
  const published = value.materials.filter((material) => material.sourceStatus === "published-original").length;
  if (value.summary.publishedOriginals !== published) {
    throw new InventoryValidationError("$.summary.publishedOriginals", "must equal the published-original count");
  }
  const countedCategories = countCategories(value.materials);
  const declaredCategories = value.summary.categoryCounts;
  const categoryNames = new Set([...Object.keys(countedCategories), ...Object.keys(declaredCategories)]);
  for (const category of categoryNames) {
    if ((declaredCategories[category] || 0) !== (countedCategories[category] || 0)) {
      throw new InventoryValidationError(`$.summary.categoryCounts.${category}`, "does not match materials");
    }
  }

  const knownPages = value.materials
    .map((material) => material.pages)
    .filter((pages) => pages !== null);
  const hasUnknownPages = knownPages.length !== value.materials.length;
  const countedPages = knownPages.reduce((total, pages) => total + pages, 0);
  if (hasUnknownPages && value.summary.totalPages !== null) {
    throw new InventoryValidationError("$.summary.totalPages", "must be null when any material page count is unknown");
  }
  if (!hasUnknownPages && value.summary.totalPages !== countedPages) {
    throw new InventoryValidationError("$.summary.totalPages", "must equal the sum of material pages");
  }

  return value;
}

function validateMaterial(material, path, courseRoute) {
  assertPlainObject(material, path, MATERIAL_KEYS);
  assertNonEmptyString(material.id, `${path}.id`);
  assertNonEmptyString(material.title, `${path}.title`);
  assertNonEmptyString(material.originalFileName, `${path}.originalFileName`);
  if (/[\\/]/.test(material.originalFileName) || [".", ".."].includes(material.originalFileName)) {
    throw new InventoryValidationError(`${path}.originalFileName`, "must be a file name, not a path");
  }
  assertEnum(material.category, MATERIAL_CATEGORIES, `${path}.category`);
  assertNonEmptyString(material.format, `${path}.format`);
  assertNullableString(material.sequence, `${path}.sequence`);
  assertNullableInteger(material.pages, `${path}.pages`);
  assertNullableInteger(material.bytes, `${path}.bytes`);
  assertPattern(material.sha256, /^[0-9a-f]{64}$/, `${path}.sha256`);
  assertEnum(material.sourceStatus, SOURCE_STATUSES, `${path}.sourceStatus`);
  assertNullableString(material.originalUrl, `${path}.originalUrl`);
  assertInteger(material.derivativeCount, `${path}.derivativeCount`);
  assertArray(material.derivativeLabels, `${path}.derivativeLabels`);
  material.derivativeLabels.forEach((label, index) => assertString(label, `${path}.derivativeLabels[${index}]`));
  if (material.derivativeCount !== material.derivativeLabels.length) {
    throw new InventoryValidationError(`${path}.derivativeCount`, "must equal derivativeLabels.length");
  }
  assertString(material.note, `${path}.note`);

  if (material.sourceStatus === "published-original" && !material.originalUrl) {
    throw new InventoryValidationError(`${path}.originalUrl`, "published originals need a download URL");
  }
  if (material.sourceStatus === "published-original") {
    assertSafeCourseUrl(material.originalUrl, courseRoute, `${path}.originalUrl`);
  }
  if (material.sourceStatus === "indexed-no-download" && material.originalUrl !== null) {
    throw new InventoryValidationError(`${path}.originalUrl`, "indexed-no-download must use null");
  }
}

function validateGap(gap, path) {
  assertPlainObject(gap, path, GAP_KEYS);
  assertNonEmptyString(gap.id, `${path}.id`);
  assertNonEmptyString(gap.label, `${path}.label`);
  assertEnum(gap.status, GAP_STATUSES, `${path}.status`);
  assertString(gap.note, `${path}.note`);
}

export async function loadMaterialInventories(
  courses,
  {
    fetchImpl = globalThis.fetch,
    timeoutMs = DEFAULT_INVENTORY_TIMEOUT_MS,
    validationNow = new Date(),
  } = {},
) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new TypeError("timeoutMs must be a positive finite number");
  }

  const settled = await Promise.allSettled(courses.map((course) => (
    loadOneMaterialInventory(course, { fetchImpl, timeoutMs, validationNow })
  )));

  const inventories = new Map();
  const errors = new Map();
  const timedOutCourses = new Set();
  settled.forEach((result, index) => {
    const course = courses[index];
    if (result.status === "fulfilled") inventories.set(course.slug, result.value);
    else {
      errors.set(course.slug, result.reason);
      if (isInventoryRequestTimeout(result.reason)) timedOutCourses.add(course.slug);
    }
  });
  return { inventories, errors, timedOutCourses };
}

async function loadOneMaterialInventory(course, { fetchImpl, timeoutMs, validationNow }) {
  const controller = new AbortController();
  const timeoutError = new InventoryRequestTimeoutError(course.materialInventoryUrl, timeoutMs);
  let timeoutId;
  const timeout = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(timeoutError);
      controller.abort();
    }, timeoutMs);
  });
  const request = Promise.resolve().then(async () => {
    const response = await fetchImpl(course.materialInventoryUrl, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response?.ok) throw new Error(`HTTP ${response?.status || "unknown"}`);
    const payload = await response.json();
    return validateMaterialInventory(payload, course, { now: validationNow });
  });

  try {
    return await Promise.race([request, timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}

function isInventoryRequestTimeout(error) {
  return error instanceof InventoryRequestTimeoutError
    || error?.code === "INVENTORY_REQUEST_TIMEOUT";
}

export function summarizeInventories(courses, inventories, { now = new Date() } = {}) {
  let sourceFiles = 0;
  let publishedOriginals = 0;
  let knownPages = 0;
  let hasUnknownPages = false;
  let latestAuditDate = null;
  let overdueCourses = 0;

  for (const course of courses) {
    const inventory = inventories.get(course.slug);
    if (!inventory) continue;
    sourceFiles += inventory.summary.sourceFiles;
    publishedOriginals += inventory.summary.publishedOriginals;
    if (inventory.summary.totalPages === null) hasUnknownPages = true;
    else knownPages += inventory.summary.totalPages;
    if (!latestAuditDate || inventory.freshness.sourceAuditDate > latestAuditDate) {
      latestAuditDate = inventory.freshness.sourceAuditDate;
    }
    if (freshnessFor(inventory, now).isOverdue) overdueCourses += 1;
  }

  return {
    sourceFiles,
    publishedOriginals,
    knownPages,
    hasUnknownPages,
    latestAuditDate,
    overdueCourses,
    loadedCourses: inventories.size,
    totalCourses: courses.length,
  };
}

export function freshnessFor(inventory, now = new Date()) {
  const auditDay = parseCalendarDate(inventory.freshness.sourceAuditDate);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const ageDays = Math.max(0, Math.floor((today - auditDay) / 86_400_000));
  const reviewDays = inventory.freshness.suggestedReviewDays;
  const reviewAt = new Date(auditDay + reviewDays * 86_400_000).toISOString().slice(0, 10);
  return {
    ageDays,
    reviewDays,
    reviewAt,
    daysPastDue: Math.max(0, ageDays - reviewDays),
    isDueToday: ageDays === reviewDays,
    isOverdue: ageDays >= reviewDays,
    isDueSoon: ageDays < reviewDays && reviewDays - ageDays <= 3,
  };
}

export function filterMaterials(materials, query) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [...materials];
  return materials.filter((material) => normalizeSearchText(material.originalFileName).includes(normalized));
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("zh-CN")
    .replace(/[\s._-]+/gu, "");
}

export function shortSha(sha256) {
  return `${sha256.slice(0, 8)}…${sha256.slice(-4)}`;
}

export function formatAuditDate(value) {
  if (!value) return "暂无可用审计日期";
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export function categoryEntries(inventory) {
  return Object.entries(inventory.summary.categoryCounts)
    .filter(([, count]) => count > 0)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
}

export function gapsByGroup(inventory) {
  return GAP_GROUPS.map((group) => ({
    ...group,
    items: inventory.knownGaps.filter((gap) => group.statuses.includes(gap.status)),
  }));
}

export function gapStatusLabel(status) {
  return GAP_STATUS_LABELS[status] || status;
}

export function createMaterialInventoryDashboard({
  courses,
  root,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  announce = () => {},
}) {
  if (!root) throw new Error("Material inventory dashboard root is required");

  const document = root.ownerDocument;
  const courseGrid = root.querySelector("[data-inventory-course-grid]");
  const searchInput = root.querySelector("#material-search");
  const clearButton = root.querySelector("#material-search-clear");
  const resultStatus = root.querySelector("#material-search-status");
  const coverageNote = root.querySelector("#inventory-coverage-note");
  const alertList = root.querySelector("#inventory-alert-list");
  const metrics = {
    sources: root.querySelector("#inventory-total-sources"),
    downloads: root.querySelector("#inventory-total-downloads"),
    pages: root.querySelector("#inventory-total-pages"),
    audit: root.querySelector("#inventory-latest-audit"),
    overdue: root.querySelector("#inventory-overdue-count"),
  };

  let inventories = new Map();
  let errors = new Map();
  let query = "";
  let hasLoaded = false;
  let refreshPromise = null;

  searchInput.addEventListener("input", () => {
    query = searchInput.value;
    render();
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchInput.value) {
      searchInput.value = "";
      query = "";
      render();
      searchInput.focus();
    }
  });
  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    query = "";
    render();
    searchInput.focus();
  });

  async function refresh({ shouldAnnounce = false } = {}) {
    if (refreshPromise) return refreshPromise;
    root.setAttribute("aria-busy", "true");
    refreshPromise = loadMaterialInventories(courses, { fetchImpl })
      .then((result) => {
        inventories = result.inventories;
        errors = result.errors;
        hasLoaded = true;
        render();
        if (shouldAnnounce) {
          if (errors.size) {
            const timeoutCount = result.timedOutCourses.size;
            const timeoutDetail = timeoutCount ? `，其中 ${timeoutCount} 门读取超时` : "";
            announce(`原始资料清单已刷新，成功读取 ${inventories.size}/${courses.length} 门；${errors.size} 门暂时无法读取${timeoutDetail}。`);
          } else {
            announce(`${courses.length} 门课程的原始资料清单已刷新。`);
          }
        }
        return result;
      })
      .finally(() => {
        root.setAttribute("aria-busy", "false");
        refreshPromise = null;
      });
    return refreshPromise;
  }

  function render() {
    if (!hasLoaded) {
      clearButton.hidden = true;
      resultStatus.textContent = "正在读取线上清单。";
      return;
    }
    const currentNow = now();
    renderOverview(currentNow);
    renderAlerts(currentNow);
    courseGrid.replaceChildren(...courses.map((course) => renderCourseInventory(course, currentNow)));

    const normalizedQuery = query.trim();
    const allMaterials = [...inventories.values()].flatMap((inventory) => inventory.materials);
    const matchCount = filterMaterials(allMaterials, normalizedQuery).length;
    clearButton.hidden = normalizedQuery.length === 0;
    resultStatus.textContent = normalizedQuery
      ? `按原文件名找到 ${matchCount} 个匹配项。`
      : `已读取 ${inventories.size}/${courses.length} 门课程清单。`;
  }

  function renderOverview(currentNow) {
    const summary = summarizeInventories(courses, inventories, { now: currentNow });
    metrics.sources.textContent = inventories.size ? String(summary.sourceFiles) : "—";
    metrics.downloads.textContent = inventories.size ? String(summary.publishedOriginals) : "—";
    metrics.pages.textContent = inventories.size
      ? (summary.hasUnknownPages ? `${summary.knownPages}+` : String(summary.knownPages))
      : "—";
    metrics.pages.title = summary.hasUnknownPages
      ? "至少这些页；包含教材与开放参考，且部分原件页数尚未登记"
      : "全部已登记原始资料的页数，包含教材与开放参考";
    metrics.audit.textContent = summary.latestAuditDate ? formatAuditDate(summary.latestAuditDate) : "—";
    metrics.overdue.textContent = inventories.size ? `${summary.overdueCourses} 门` : "—";
    coverageNote.textContent = errors.size
      ? `当前成功读取 ${summary.loadedCourses}/${summary.totalCourses} 门；失败清单不影响下方课程入口。`
      : `四门课程清单均来自当前线上版本；短 SHA 已记录，可用于人工比对同名文件的新旧版本。`;
  }

  function renderAlerts(currentNow) {
    alertList.replaceChildren();
    for (const course of courses) {
      const inventory = inventories.get(course.slug);
      if (!inventory) continue;
      const freshness = freshnessFor(inventory, currentNow);
      if (!freshness.isOverdue) continue;
      const item = element(document, "li", "inventory-alert inventory-alert--overdue");
      const strong = element(document, "strong", null, `${course.code} 包内清单已到复查期`);
      const detail = element(
        document,
        "span",
        null,
        freshness.isDueToday
          ? `今天达到建议复查间隔；本站未自动检查老师平台，请现在主动核对。触发条件：${inventory.freshness.updateTrigger}`
          : `距包内资料核验已超过建议复查日 ${freshness.daysPastDue} 天；本站未自动检查老师平台，请现在主动核对。触发条件：${inventory.freshness.updateTrigger}`,
      );
      item.append(strong, detail);
      alertList.append(item);
    }
    for (const course of courses) {
      if (!errors.has(course.slug)) continue;
      const item = element(document, "li", "inventory-alert inventory-alert--error");
      item.append(
        element(document, "strong", null, `${course.code} 清单暂不可读`),
        element(document, "span", null, "可能尚未部署或未通过 v1 契约校验；课程入口仍然可用。"),
      );
      alertList.append(item);
    }
    if (alertList.childElementCount === 0) {
      const item = element(document, "li", "inventory-alert inventory-alert--clear");
      item.append(
        element(document, "strong", null, "目前没有过期提醒"),
        element(document, "span", null, "本站不会自动扫描老师平台；老师开放新权限或宣布更新后请立即核对。"),
      );
      alertList.append(item);
    }
  }

  function renderCourseInventory(course, currentNow) {
    const inventory = inventories.get(course.slug);
    if (!inventory) return renderFailedCourse(course);

    const card = element(document, "article", `inventory-course-card course-card--${course.slug}`);
    card.dataset.inventoryCourse = course.slug;
    const titleId = `inventory-${course.slug}-title`;
    card.setAttribute("aria-labelledby", titleId);

    const header = element(document, "header", "inventory-course-header");
    const titleWrap = element(document, "div", "inventory-course-title");
    const code = element(document, "span", "course-code", course.code);
    const title = element(document, "h3", null, inventory.course.nameZh);
    title.id = titleId;
    titleWrap.append(code, title);

    const statusInfo = INVENTORY_STATUS_PRESENTATION[inventory.inventoryStatus];
    const status = element(document, "span", `inventory-status inventory-status--${statusInfo.tone}`, statusInfo.label);
    header.append(titleWrap, status);

    const freshness = freshnessFor(inventory, currentNow);
    const audit = element(document, "div", "inventory-audit-row");
    const auditTime = element(document, "time", null, `包内清单核验：${formatAuditDate(inventory.freshness.sourceAuditDate)}`);
    auditTime.dateTime = inventory.freshness.sourceAuditDate;
    const freshnessLabel = freshness.isOverdue
      ? (freshness.isDueToday ? "今天应复查" : `超期 ${freshness.daysPastDue} 天`)
      : freshness.isDueSoon
        ? `建议 ${freshness.reviewAt} 前复查`
        : `下次建议复查：${formatAuditDate(freshness.reviewAt)}`;
    const freshnessState = element(
      document,
      "span",
      `freshness-state${freshness.isOverdue ? " freshness-state--overdue" : ""}`,
      freshnessLabel,
    );
    audit.append(auditTime, freshnessState);

    const note = element(document, "p", "inventory-note", inventory.inventoryNote || "当前清单未附加说明。");
    const stats = element(document, "dl", "inventory-course-stats");
    appendStat(stats, "原件", inventory.summary.sourceFiles);
    appendStat(stats, "可下载", inventory.summary.publishedOriginals);
    appendStat(stats, "页数", inventory.summary.totalPages ?? "待补齐");
    appendStat(stats, "待确认项", inventory.knownGaps.length);

    const category = renderCategoryDistribution(inventory);
    const gaps = renderGaps(inventory);
    const materials = renderMaterialDetails(inventory);
    card.append(header, audit, note, stats, category, gaps, materials);
    return card;
  }

  function renderFailedCourse(course) {
    const card = element(document, "article", `inventory-course-card inventory-course-card--failed course-card--${course.slug}`);
    const titleId = `inventory-${course.slug}-title`;
    card.setAttribute("aria-labelledby", titleId);

    const header = element(document, "header", "inventory-course-header");
    const titleWrap = element(document, "div", "inventory-course-title");
    titleWrap.append(element(document, "span", "course-code", course.code));
    const title = element(document, "h3", null, course.titleZh);
    title.id = titleId;
    titleWrap.append(title);
    header.append(titleWrap, element(document, "span", "inventory-status inventory-status--error", "清单暂不可读"));

    const failure = errors.get(course.slug);
    const failureMessage = isInventoryRequestTimeout(failure)
      ? `读取清单超过 ${failure.timeoutMs / 1000} 秒，已停止等待；其他课程不受影响。这里不会猜测你上传过什么。`
      : "当前线上清单尚未返回，或内容没有通过 course-materials/v1 校验。这里不会猜测你上传过什么。";
    const message = element(
      document,
      "p",
      "inventory-failure-copy",
      failureMessage,
    );
    const path = element(document, "code", "inventory-manifest-path", course.materialInventoryUrl);
    const courseLink = element(document, "a", "inventory-course-fallback", `仍可打开 ${course.code} 课程`);
    courseLink.href = course.route;
    card.append(header, message, path, courseLink);
    return card;
  }

  function renderCategoryDistribution(inventory) {
    const section = element(document, "section", "category-distribution");
    section.setAttribute("aria-label", `${inventory.course.code} 原件分类分布`);
    section.append(element(document, "h4", null, "原件分类分布"));
    const entries = categoryEntries(inventory);
    if (entries.length === 0) {
      section.append(element(document, "p", "inventory-inline-empty", "尚未登记原件。"));
      return section;
    }

    const bar = element(document, "div", "category-bar");
    bar.setAttribute("aria-hidden", "true");
    entries.forEach(([, count], index) => {
      const segment = element(document, "span", `category-segment category-segment--${index % 6}`);
      segment.style.flexGrow = String(count);
      bar.append(segment);
    });

    const legend = element(document, "ul", "category-legend");
    entries.forEach(([category, count], index) => {
      const item = element(document, "li");
      item.append(
        element(document, "span", `category-key category-key--${index % 6}`),
        element(document, "span", null, `${CATEGORY_LABELS[category]} ${count}`),
      );
      legend.append(item);
    });
    section.append(bar, legend);
    return section;
  }

  function renderGaps(inventory) {
    const section = element(document, "section", "inventory-gaps");
    const heading = element(document, "div", "inventory-subheading");
    heading.append(
      element(document, "h4", null, "尚待确认的资料"),
      element(document, "span", null, "未知不等于缺失"),
    );
    const grid = element(document, "div", "gap-grid");

    for (const group of gapsByGroup(inventory)) {
      const groupElement = element(document, "details", `gap-group gap-group--${group.id}`);
      const header = element(document, "summary", "gap-group-header");
      header.append(
        element(document, "strong", "gap-group-title", group.label),
        element(document, "span", "gap-count", String(group.items.length)),
      );
      groupElement.append(header, element(document, "p", "gap-description", group.description));
      if (group.items.length) {
        const list = element(document, "ul", "gap-list");
        for (const gap of group.items) {
          const item = element(document, "li");
          const label = element(document, "strong", null, gap.label);
          const exact = element(document, "span", "gap-exact-status", gapStatusLabel(gap.status));
          const note = element(document, "p", null, gap.note || "暂无补充说明。");
          item.append(label, exact, note);
          list.append(item);
        }
        groupElement.append(list);
      } else {
        groupElement.append(element(document, "p", "gap-empty", "当前 0 项"));
      }
      grid.append(groupElement);
    }
    section.append(heading, grid);
    return section;
  }

  function renderMaterialDetails(inventory) {
    const filtered = filterMaterials(inventory.materials, query);
    const details = element(document, "details", "material-details");
    if (query.trim()) details.open = true;
    const summary = element(document, "summary");
    const summaryLabel = query.trim()
      ? `原文件清单 · 命中 ${filtered.length}/${inventory.materials.length}`
      : `展开原文件清单 · ${inventory.materials.length} 个`;
    summary.append(element(document, "span", null, summaryLabel), element(document, "span", "details-caret", "⌄"));
    details.append(summary);

    if (filtered.length === 0) {
      details.append(element(document, "p", "material-no-results", "这门课没有匹配该原文件名的资料。"));
      return details;
    }

    const list = element(document, "ol", "material-list");
    for (const material of filtered) list.append(renderMaterial(material));
    details.append(list);
    return details;
  }

  function renderMaterial(material) {
    const item = element(document, "li", "material-item");
    const header = element(document, "div", "material-item-header");
    const naming = element(document, "div", "material-naming");
    naming.append(
      element(document, "strong", "material-file-name", material.originalFileName),
      element(document, "span", "material-title", material.title),
    );
    header.append(naming, element(document, "span", "material-category", CATEGORY_LABELS[material.category]));

    const metadata = element(document, "dl", "material-metadata");
    appendStat(metadata, "页数", material.pages ?? "未知");
    appendStat(metadata, "格式", material.format.toUpperCase());
    appendStat(metadata, "短 SHA", shortSha(material.sha256));
    appendStat(metadata, "衍生版", `${material.derivativeCount} 个`);

    const footer = element(document, "div", "material-item-footer");
    if (material.sourceStatus === "published-original") {
      const link = element(document, "a", "material-download", "下载原始文件");
      link.href = material.originalUrl;
      link.target = "_blank";
      link.rel = "noopener";
      footer.append(link);
    } else {
      footer.append(element(document, "span", "material-unavailable", "已登记，暂不提供下载"));
    }
    const derivatives = material.derivativeLabels.length
      ? `衍生版：${material.derivativeLabels.join("、")}`
      : "暂无衍生版";
    footer.append(element(document, "span", "material-derivatives", derivatives));
    if (material.note) item.append(header, metadata, footer, element(document, "p", "material-note", material.note));
    else item.append(header, metadata, footer);
    return item;
  }

  function appendStat(list, term, value) {
    const item = element(document, "div");
    item.append(element(document, "dt", null, term), element(document, "dd", null, String(value)));
    list.append(item);
  }

  function element(owner, tagName, className = null, text = null) {
    const node = owner.createElement(tagName);
    if (className) node.className = className;
    if (text !== null) node.textContent = text;
    return node;
  }

  render();
  return Object.freeze({ refresh });
}

function countCategories(materials) {
  return materials.reduce((counts, material) => {
    counts[material.category] = (counts[material.category] || 0) + 1;
    return counts;
  }, {});
}

function parseCalendarDate(value) {
  return Date.parse(`${value}T00:00:00Z`);
}

function assertSafeCourseUrl(value, courseRoute, path) {
  if (value !== value.trim() || /[\\?#\u0000-\u001f]/u.test(value)) {
    throw new InventoryValidationError(path, "must be a clean course-root URL without query or fragment");
  }

  let decoded = value;
  for (let index = 0; index < 8; index += 1) {
    let next;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      throw new InventoryValidationError(path, "contains invalid percent encoding");
    }
    if (next === decoded) break;
    decoded = next;
    if (index === 7) {
      throw new InventoryValidationError(path, "uses excessive nested URL encoding");
    }
  }

  if (/[\\?#\u0000-\u001f]/u.test(decoded)) {
    throw new InventoryValidationError(path, "contains unsafe encoded path characters");
  }

  if (!decoded.startsWith(courseRoute) || decoded.startsWith("//")) {
    throw new InventoryValidationError(path, `must stay under ${courseRoute}`);
  }
  const relative = decoded.slice(courseRoute.length);
  const segments = relative.split("/");
  if (!relative || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new InventoryValidationError(path, "contains an empty or traversal path segment");
  }
}

function assertPlainObject(value, path, allowedKeys = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InventoryValidationError(path, "must be an object");
  }
  if (!allowedKeys) return;
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw new InventoryValidationError(`${path}.${key}`, "additional property is not allowed");
  }
  for (const key of allowedKeys) {
    if (!Object.hasOwn(value, key)) throw new InventoryValidationError(`${path}.${key}`, "is required");
  }
}

function assertArray(value, path) {
  if (!Array.isArray(value)) throw new InventoryValidationError(path, "must be an array");
}

function assertString(value, path) {
  if (typeof value !== "string") throw new InventoryValidationError(path, "must be a string");
}

function assertNonEmptyString(value, path) {
  assertString(value, path);
  if (value.length < 1) throw new InventoryValidationError(path, "must not be empty");
}

function assertNullableString(value, path) {
  if (value !== null) assertString(value, path);
}

function assertInteger(value, path, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new InventoryValidationError(path, `must be an integer >= ${minimum}`);
  }
}

function assertNullableInteger(value, path) {
  if (value !== null) assertInteger(value, path);
}

function assertEnum(value, allowed, path) {
  if (!allowed.has(value)) throw new InventoryValidationError(path, "contains an unsupported value");
}

function assertEqual(value, expected, path) {
  if (value !== expected) throw new InventoryValidationError(path, `must equal ${expected}`);
}

function assertPattern(value, pattern, path) {
  assertString(value, path);
  if (!pattern.test(value)) throw new InventoryValidationError(path, "has an invalid format");
}

function assertDateTime(value, path) {
  assertString(value, path);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    || !Number.isFinite(Date.parse(value))) {
    throw new InventoryValidationError(path, "must be an RFC 3339 date-time");
  }
}

function assertCalendarDate(value, path) {
  const timestamp = parseCalendarDate(value);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    throw new InventoryValidationError(path, "must be a real calendar date");
  }
}

function assertNotFutureDateTime(value, now, futureSkewMs, path) {
  const nowTimestamp = dateTimestamp(now, "now");
  if (!Number.isFinite(futureSkewMs) || futureSkewMs < 0) {
    throw new TypeError("maxGeneratedAtFutureSkewMs must be a non-negative finite number");
  }
  if (Date.parse(value) > nowTimestamp + futureSkewMs) {
    throw new InventoryValidationError(path, "must not be more than 10 minutes in the future");
  }
}

function assertNotFutureCalendarDate(value, now, path) {
  const current = new Date(dateTimestamp(now, "now"));
  const tomorrow = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate() + 1);
  if (parseCalendarDate(value) > tomorrow) {
    throw new InventoryValidationError(path, "must not be later than tomorrow in the reader's local calendar");
  }
}

function dateTimestamp(value, label) {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new TypeError(`${label} must be a valid date`);
  return timestamp;
}
