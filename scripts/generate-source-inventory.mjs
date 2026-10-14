import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = join(projectRoot, "public");
const materialsRoot = join(publicRoot, "materials");
const outputPath = join(materialsRoot, "source-inventory.json");
const rawSourceRoot = resolve(
  process.env.PHY301_RAW_SOURCE_DIR ?? join(homedir(), "Desktop", "PHY301"),
);
const legacyManifestPath = join(
  materialsRoot,
  "course-materials-manifest.json",
);

function calendarDateInShanghai(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

const lectureTopics = new Map([
  ["L1", "课程要求、热力学回顾、动理学与 Maxwell-Boltzmann 分布"],
  ["L2", "相空间、系综、Liouville 定理、时间反演与遍历性"],
  ["L3", "微正则、正则与巨正则系综，热力学定律及理想气体"],
  ["L4", "正则与巨正则系综、两能级系统、理想气体与能量均分"],
  ["L5", "正则系综续篇与巨正则系综"],
  ["L6", "相互作用、van der Waals、Ising、Landau 与相变"],
  ["L7", "经典统计总结、量子形式、密度矩阵与量子系综"],
  ["L8", "全同粒子、Bose-Einstein、Fermi-Dirac 与 Maxwell-Boltzmann 统计"],
  ["L9", "理想 Bose/Fermi 气体、黑体辐射、声子与 Pauli 顺磁"],
  ["L10", "涨落、Brownian 运动、扩散、Langevin 与 Fokker-Planck 方程"],
]);

const assessmentSpecs = [
  {
    id: "phy301-assignment-01",
    title: "PHY301 Problem Set 1（2025-09）",
    originalFileName:
      "PHY301_Statistical_Physics_Problem_set_1__2025_09.pdf",
    publicPath: "materials/problem-set-01.pdf",
    expectedSha256:
      "8407745733b539f262fab7e7039d83cb1fef6a4e4bbad7400edd38e583817cca",
    category: "assignment",
    sequence: "Problem Set 1 · Week 1-4",
    derivativeLabels: ["站内逐题知识映射与解题路线"],
    note: "老师原始作业；覆盖 Liouville、Maxwell-Boltzmann、微正则气体与振子。",
  },
  {
    id: "phy301-solution-01",
    title: "PHY301 Problem Set 1 Solution（2025-09）",
    originalFileName:
      "PHY301_Statistical_Physics_Problem_set_1__2025_09_(Solution).pdf",
    publicPath: "materials/problem-set-01-solution.pdf",
    expectedSha256:
      "43745fb5a160b1f96aabc88046a320b2dbdf55a98ca5fbca3cd7dbe926efb2e2",
    category: "solution",
    sequence: "Problem Set 1 solution · Week 1-4",
    derivativeLabels: ["站内答案勘误与推导讲解"],
    note: "老师原始答案；站内另行标出符号与归一化注意事项。",
  },
  {
    id: "phy301-assignment-02",
    title: "PHY301 Problem Set 2（2025-09）",
    originalFileName:
      "PHY301_Statistical_Physics_Problem_set_2__2025_09.pdf",
    publicPath: "materials/problem-set-02.pdf",
    expectedSha256:
      "dd3b965f8c180ca5ed1d7f40dd29e47df0e248fc45f05813047c7af8068ab9b1",
    category: "assignment",
    sequence: "Problem Set 2 · Week 5-7; Q2 revisited in Week 10",
    derivativeLabels: ["站内逐题知识映射与解题路线"],
    note: "老师原始作业；覆盖正则振子、巨正则吸附与 lattice gas/Ising。",
  },
  {
    id: "phy301-solution-02",
    title: "PHY301 Problem Set 2 Solution（2025-09）",
    originalFileName:
      "PHY301_Statistical_Physics_Problem_set_2__2025_09_.pdf",
    publicPath: "materials/problem-set-02-solution.pdf",
    expectedSha256:
      "f9e262b3dfb265bcdf128ba47ffe89b8e98029cfe4bcfb31a1839156c6e80acc",
    category: "solution",
    sequence: "Problem Set 2 solution · Week 5-7; Q2 revisited in Week 10",
    derivativeLabels: ["站内答案勘误与推导讲解"],
    note: "老师原文件名未写 Solution；经逐页内容核对，此文件确为 Problem Set 2 答案。",
  },
  {
    id: "phy301-assignment-03",
    title: "PHY301 Problem Set 3（2025-09）",
    originalFileName:
      "PHY301_Statistical_Physics_Problem_set_3__2025_09_.pdf",
    publicPath: "materials/problem-set-03.pdf",
    expectedSha256:
      "a993fa39a0ab61523d3908264b63078d02129d4218a7c3b3b3928ca4ac307621",
    category: "assignment",
    sequence: "Problem Set 3 · Week 9-12",
    derivativeLabels: ["站内逐题知识映射与解题路线"],
    note: "老师原始作业；覆盖密度矩阵、量子统计、Bose 与 Fermi 气体。",
  },
  {
    id: "phy301-solution-03",
    title: "PHY301 Problem Set 3 Solution（2025-09）",
    originalFileName:
      "PHY301_Statistical_Physics_Problem_set_3__2025_09_ (solution).pdf",
    publicPath: "materials/problem-set-03-solution.pdf",
    expectedSha256:
      "6e5b7cbab2e6557a063c01df2bdab2ee6b11e4bd94c1edaa5452507c9c82a1d5",
    category: "solution",
    sequence: "Problem Set 3 solution · Week 9-12",
    derivativeLabels: ["站内答案勘误与推导讲解"],
    note: "老师原始答案；含 Fourier 与多维 Gaussian 的长推导。",
  },
  {
    id: "phy301-exam-midterm-2025",
    title: "PHY301 Mid-term Exam 2025-09 Solution / Marking Scheme",
    originalFileName: "PHY301_Mid_term_Exam_2025_09 (solution).pdf",
    publicPath: "materials/midterm-2025-solution.pdf",
    expectedSha256:
      "82447a86f195a32a8f12c67125f96d4bffdd3e1878e17ed9c3003b3b08a990e5",
    category: "exam",
    sequence: "2025 mid-term · Week 1-8",
    derivativeLabels: ["站内评分点拆解与原答案勘误"],
    note: "老师原始期中评分答案；4 题，每题 25 分。",
  },
];

const supportingSpecs = [
  {
    id: "phy301-syllabus-course-plan-2025",
    title: "PHY301 2025 Course Plan",
    originalFileName: "teacher-course-plan-2025.png",
    publicPath: "course-plan/teacher-course-plan-2025.png",
    expectedSha256:
      "3b32aa914ea2822d036fc02f552da91de4f30e5aaa13479db9fbde9fb3bb48b3",
    category: "syllabus",
    sequence: "Week 1-14 plan",
    pages: 1,
    derivativeLabels: ["站内 14 周学习顺序与课程计划解读"],
    note: "老师网页课程计划的原始截图；用于核对 Week 1-14 教学顺序。",
  },
  {
    id: "phy301-reference-tong-statistical-physics",
    title: "David Tong — Statistical Physics",
    originalFileName: "david-tong-statistical-physics.pdf",
    publicPath: "readings/david-tong-statistical-physics.pdf",
    expectedSha256:
      "9d41ab5d5751a44e3a5e117da30f25ad555e6e023bddec8366f9450570dcf5d4",
    category: "reference",
    sequence: null,
    derivativeLabels: ["站内按课程节点编排的跳读路线"],
    note: "本地开放参考讲义；不是老师课件，按课程主题选读而非从头硬读。",
  },
  {
    id: "phy301-reference-arovas-thermodynamics-statistical-mechanics",
    title: "Daniel Arovas — Thermodynamics and Statistical Mechanics",
    originalFileName: "arovas-thermodynamics-statistical-mechanics.pdf",
    publicPath: "readings/arovas-thermodynamics-statistical-mechanics.pdf",
    expectedSha256:
      "2b5029d97d22d6d86325d1d7ee6892fbffedcda3a0f4a4aedc5edafaa3632f3f",
    category: "reference",
    sequence: "Week 13 supplementary reading",
    derivativeLabels: ["站内非平衡统计按主题跳读路线"],
    note: "本地开放参考讲义；不是老师课件，主要用于 Brownian、Langevin 与 Fokker-Planck 补读。",
  },
];

function run(command, args, label) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message ?? result.stderr.trim();
    throw new Error(`${label} failed: ${detail || `exit ${result.status}`}`);
  }
  return result.stdout;
}

async function sha256(path) {
  const contents = await readFile(path);
  return createHash("sha256").update(contents).digest("hex");
}

function pptxSlideCount(path) {
  const listing = run("unzip", ["-Z1", path], `Inspecting ${basename(path)}`);
  return listing
    .split("\n")
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/u.test(entry)).length;
}

function pdfPageCount(path) {
  const info = run("pdfinfo", [path], `Inspecting ${basename(path)}`);
  const match = info.match(/^Pages:\s+(\d+)\s*$/mu);
  if (!match) {
    throw new Error(`Could not determine PDF page count: ${path}`);
  }
  return Number(match[1]);
}

function publicUrl(publicPath) {
  return `/phy301/${publicPath.split("/").map(encodeURIComponent).join("/")}`;
}

async function materialFromSpec(spec) {
  const path = join(publicRoot, spec.publicPath);
  const fileStat = await stat(path);
  if (!fileStat.isFile()) {
    throw new Error(`Expected a regular public source file: ${path}`);
  }

  const extension = extname(path).slice(1).toLowerCase();
  const pages =
    spec.pages ??
    (extension === "pptx"
      ? pptxSlideCount(path)
      : extension === "pdf"
        ? pdfPageCount(path)
        : null);

  const digest = await sha256(path);
  if (spec.expectedSha256) {
    assert(
      digest === spec.expectedSha256,
      `${spec.id} changed SHA-256; preserve it as a new source version and review all derivatives before updating expectedSha256`,
    );
  }

  return {
    id: spec.id,
    title: spec.title,
    originalFileName: spec.originalFileName,
    category: spec.category,
    format: extension,
    sequence: spec.sequence,
    pages,
    bytes: fileStat.size,
    sha256: digest,
    sourceStatus: "published-original",
    originalUrl: publicUrl(spec.publicPath),
    derivativeCount: spec.derivativeLabels.length,
    derivativeLabels: spec.derivativeLabels,
    note: spec.note,
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function auditRegisteredSourceFiles({ legacyManifest, teacherMaterials }) {
  const publishedCandidates = (await readdir(materialsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.(?:pdf|ppt|pptx)$/iu.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const expectedPublished = new Set([
    ...legacyManifest.lectures.flatMap((lecture) => [lecture.original, lecture.bilingual]),
    ...assessmentSpecs.map((spec) => basename(spec.publicPath)),
  ]);
  const unregisteredPublished = publishedCandidates.filter(
    (name) => !expectedPublished.has(name),
  );
  assert(
    unregisteredPublished.length === 0,
    `Unregistered PDF/PPT/PPTX in public/materials: ${unregisteredPublished.join(", ")}`,
  );

  let rawEntries;
  try {
    rawEntries = await readdir(rawSourceRoot, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  const expectedRawNames = new Set(
    teacherMaterials.map((material) => material.originalFileName),
  );
  const rawFiles = rawEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && !name.startsWith("~$"))
    .filter((name) => !/^lecture-\d{2}_中英逐页精讲_副本\.pptx$/u.test(name))
    .sort();
  const unregisteredRaw = rawFiles.filter((name) => !expectedRawNames.has(name));
  const missingRaw = [...expectedRawNames].filter((name) => !rawFiles.includes(name));
  assert(
    unregisteredRaw.length === 0,
    `Unregistered file in the canonical raw-source folder ${rawSourceRoot}: ${unregisteredRaw.join(", ")}`,
  );
  assert(
    missingRaw.length === 0,
    `Registered teacher source is missing from ${rawSourceRoot}: ${missingRaw.join(", ")}`,
  );

  for (const material of teacherMaterials) {
    const rawPath = join(rawSourceRoot, material.originalFileName);
    assert(
      (await sha256(rawPath)) === material.sha256,
      `Canonical raw source differs from the published original: ${material.originalFileName}`,
    );
  }
}

async function preservedSourceAuditDate(materials, today) {
  let previous;
  try {
    previous = JSON.parse(await readFile(outputPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return today;
    throw error;
  }
  const previousSignature = JSON.stringify(
    (previous.materials ?? []).map(({ id, sha256: digest }) => [id, digest]),
  );
  const currentSignature = JSON.stringify(
    materials.map(({ id, sha256: digest }) => [id, digest]),
  );
  const priorDate = previous.freshness?.sourceAuditDate;
  return previousSignature === currentSignature && /^\d{4}-\d{2}-\d{2}$/u.test(priorDate)
    ? priorDate
    : today;
}

function validateInventory(inventory) {
  assert(inventory.schemaVersion === "course-materials/v1", "Wrong schemaVersion");
  assert(inventory.course.route === "/phy301/", "Wrong PHY301 course route");
  assert(
    inventory.summary.sourceFiles === inventory.materials.length,
    "summary.sourceFiles does not match materials[]",
  );
  assert(
    inventory.summary.publishedOriginals ===
      inventory.materials.filter(
        (material) => material.sourceStatus === "published-original",
      ).length,
    "summary.publishedOriginals does not match materials[]",
  );

  const ids = new Set();
  for (const material of inventory.materials) {
    assert(!ids.has(material.id), `Duplicate material id: ${material.id}`);
    ids.add(material.id);
    assert(
      /^[0-9a-f]{64}$/u.test(material.sha256),
      `Invalid SHA-256 for ${material.id}`,
    );
    assert(
      material.derivativeCount === material.derivativeLabels.length,
      `Derivative count mismatch for ${material.id}`,
    );
    if (material.sourceStatus === "published-original") {
      assert(
        typeof material.originalUrl === "string" &&
          material.originalUrl.startsWith("/phy301/"),
        `Published source must use the stable PHY301 route: ${material.id}`,
      );
      const relativeUrl = decodeURIComponent(
        material.originalUrl.slice("/phy301/".length),
      );
      const resolvedPath = resolve(publicRoot, relativeUrl);
      const resolvedRelative = relative(publicRoot, resolvedPath);
      assert(
        resolvedRelative !== "" &&
          !resolvedRelative.startsWith("..") &&
          !resolvedRelative.startsWith("/"),
        `Published source URL does not resolve to a file below public/: ${material.id}`,
      );
    } else {
      assert(material.originalUrl === null, `Indexed-only URL must be null`);
    }
  }
}

const legacyManifest = JSON.parse(
  await readFile(legacyManifestPath, "utf8"),
);

const lectureMaterials = [];
for (const lecture of legacyManifest.lectures) {
  const number = Number(lecture.id.slice(1));
  const padded = String(number).padStart(2, "0");
  const originalFileName = `PHY301 - ${number}.pptx`;
  const bilingualPath = join(materialsRoot, lecture.bilingual);
  const bilingualStat = await stat(bilingualPath);
  assert(bilingualStat.isFile(), `Missing bilingual derivative: ${bilingualPath}`);

  const material = await materialFromSpec({
    id: `phy301-lecture-${padded}`,
    title: `Lecture ${number} — ${lectureTopics.get(lecture.id)}`,
    originalFileName,
    publicPath: `materials/${lecture.original}`,
    category: "lecture",
    sequence: `${lecture.id} · ${lecture.weeks}`,
    derivativeLabels: [
      `中英逐页精讲 PPTX（${lecture.bilingual}）`,
      "站内逐页公式索引、推导与中文讲解",
    ],
    note: `${lectureTopics.get(lecture.id)}；公开副本已与老师原始 PPTX 做 SHA-256 一致性核验。`,
  });

  assert(
    material.pages === lecture.originalPages,
    `${lecture.id} slide count differs from course-materials-manifest.json`,
  );
  assert(
    material.bytes === lecture.bytes.original,
    `${lecture.id} byte count differs from course-materials-manifest.json`,
  );
  assert(
    material.sha256 === lecture.sha256.original,
    `${lecture.id} SHA-256 differs from course-materials-manifest.json`,
  );
  lectureMaterials.push(material);
}

const otherMaterials = [];
for (const spec of [...assessmentSpecs, ...supportingSpecs]) {
  otherMaterials.push(await materialFromSpec(spec));
}

const materials = [...lectureMaterials, ...otherMaterials];
await auditRegisteredSourceFiles({
  legacyManifest,
  teacherMaterials: [
    ...lectureMaterials,
    ...otherMaterials.slice(0, assessmentSpecs.length),
  ],
});
const categoryCounts = Object.fromEntries(
  [...new Set(materials.map((material) => material.category))]
    .sort()
    .map((category) => [
      category,
      materials.filter((material) => material.category === category).length,
    ]),
);

const generatedAt = new Date();
const sourceAuditDate = await preservedSourceAuditDate(
  materials,
  calendarDateInShanghai(generatedAt),
);
const inventory = {
  schemaVersion: "course-materials/v1",
  course: {
    code: "PHY301",
    slug: "phy301",
    route: "/phy301/",
    nameZh: "热力学与统计物理",
    nameEn: "Thermodynamics and Statistical Physics",
  },
  generatedAt: generatedAt.toISOString(),
  inventoryStatus: "verified-current-upload",
  inventoryNote:
    "已逐文件核验当前静态交付包：10 份英文原始课件与 7 份老师作业/答案/考试材料均和本地收到的老师原件 SHA-256 一致；另登记课程计划原图与 2 份本地开放参考讲义。中英逐页精讲版和网页讲解只计为衍生物，不重复计入原件。该状态只证明当前项目已收录文件，不代表老师平台今后不会新增或替换资料。",
  summary: {
    sourceFiles: materials.length,
    publishedOriginals: materials.filter(
      (material) => material.sourceStatus === "published-original",
    ).length,
    totalPages: materials.reduce(
      (total, material) => total + (material.pages ?? 0),
      0,
    ),
    categoryCounts,
  },
  materials,
  knownGaps: [
    {
      id: "phy301-gap-week-14-deck",
      label: "Week 14 独立复习课件",
      status: "not-received",
      note: "课程计划写有量子统计复习周，但当前收到的资料中没有独立 Week 14 课件；若老师以后开放，应新增而不是覆盖现有 Lecture 10。",
    },
    {
      id: "phy301-gap-final-exam",
      label: "期末试卷或评分答案",
      status: "not-received",
      note: "Lecture 1 写有 Final Exam 40%，当前项目没有期末试卷或评分答案。",
    },
    {
      id: "phy301-gap-midterm-question-only",
      label: "2025 期中空白试卷",
      status: "unknown",
      note: "当前只有带答案/评分内容的期中文件；尚不确定老师是否另行提供过无答案版本。",
    },
    {
      id: "phy301-gap-standalone-syllabus",
      label: "独立课程大纲或课程手册",
      status: "unknown",
      note: "当前以老师网页课程计划截图和 Lecture 1 内的考核说明为依据；尚不确定是否存在独立 syllabus 文件。",
    },
  ],
  freshness: {
    sourceAuditDate,
    suggestedReviewDays: 7,
    updateTrigger:
      "老师平台开放新权限、出现同名文件的新修改时间/大小、课程计划或考核说明变化时，保存为新版本并重新运行本脚本；若 SHA-256 变化，视为新版本并重新翻译、讲解、测试和部署。",
  },
};

validateInventory(inventory);
await writeFile(outputPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");

console.log(
  [
    `Wrote ${relative(projectRoot, outputPath)}`,
    `${inventory.summary.sourceFiles} source files`,
    `${inventory.summary.publishedOriginals} published originals`,
    `${inventory.summary.totalPages} pages/slides`,
  ].join(" · "),
);
