import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const normalized = path === "/" ? "index.html" : `${path.replace(/^\//, "")}/index.html`;
  const html = await readFile(new URL(`../out/${normalized}`, import.meta.url), "utf8");
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

test("server-renders the complete PHY301 study guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /PHY301 重修通关树/);
  assert.match(html, /一条不跳步的学习树/);
  assert.match(html, /低压力诊断/);
  assert.match(html, /学习树/);
  assert.match(html, /公式地图/);
  assert.match(html, /作业与考试/);
  assert.match(html, /资料勘误/);
  assert.match(html, /从零到统计物理/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Building your site/i);
});

test("course graph covers all modules and every assessment target exists", async () => {
  const source = await readFile(
    new URL("../app/course-data.ts", import.meta.url),
    "utf8",
  );
  const moduleBlock = source.match(
    /export const modules:[\s\S]*?=\s*\[([\s\S]*?)\n\];\n\nexport const moduleDependencies/,
  )?.[1];
  assert.ok(moduleBlock, "modules array should be present");

  const moduleIds = [...moduleBlock.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map(
    (match) => match[1],
  );
  assert.equal(moduleIds.length, 19);
  assert.equal(new Set(moduleIds).size, moduleIds.length);
  assert.equal(moduleIds[0], "math-toolbox");
  assert.equal(moduleIds.at(-1), "final-review");

  const assessmentBlock = source.match(
    /export const assessmentMap\s*=\s*\[([\s\S]*?)\n\];\n\nexport const studyPlans/,
  )?.[1];
  assert.ok(assessmentBlock, "assessment map should be present");
  const targets = [
    ...assessmentBlock.matchAll(/^\s{4}target:\s*"([^"]+)"/gm),
  ].map((match) => match[1]);
  assert.equal(targets.length, 16);
  for (const target of targets) {
    assert.ok(moduleIds.includes(target), `missing module target: ${target}`);
  }

  const dependencyBlock = source.match(
    /export const moduleDependencies:[\s\S]*?=\s*\{([\s\S]*?)\n\};\n\nexport const diagnostics/,
  )?.[1];
  assert.ok(dependencyBlock, "dependency graph should be present");
  const dependencyEntries = [
    ...dependencyBlock.matchAll(
      /^\s{2}(?:"([^"]+)"|([a-z][a-z-]*)):\s*\[([\s\S]*?)\],?$/gm,
    ),
  ];
  assert.equal(dependencyEntries.length, moduleIds.length);
  for (const entry of dependencyEntries) {
    const moduleId = entry[1] ?? entry[2];
    assert.ok(moduleIds.includes(moduleId), `unknown dependency owner: ${moduleId}`);
    const dependencies = [...entry[3].matchAll(/"([^"]+)"/g)].map(
      (match) => match[1],
    );
    for (const dependency of dependencies) {
      assert.ok(moduleIds.includes(dependency), `unknown dependency: ${dependency}`);
      assert.ok(
        moduleIds.indexOf(dependency) < moduleIds.indexOf(moduleId),
        `${moduleId} must appear after prerequisite ${dependency}`,
      );
    }
  }

  for (let week = 1; week <= 14; week += 1) {
    assert.match(source, new RegExp(`Week ${week}(?![0-9])`));
  }
});

test("course evidence audit preserves teacher references and known answer corrections", async () => {
  const source = await readFile(
    new URL("../app/course-data.ts", import.meta.url),
    "utf8",
  );
  const errataBlock = source.match(
    /export const materialErrata\s*=\s*\[([\s\S]*?)\n\];\s*$/,
  )?.[1];
  assert.ok(errataBlock, "material errata should be present");

  const errataIds = [
    ...errataBlock.matchAll(/^\s{4}id:\s*"(errata-[^"]+)"/gm),
  ].map((match) => match[1]);
  assert.ok(errataIds.length >= 30);
  assert.equal(new Set(errataIds).size, errataIds.length);
  for (const requiredId of [
    "errata-ps1-entropy-constraint",
    "errata-ps1-mb-normalization",
    "errata-ps1-geometric",
    "errata-ps2-binding-sign",
    "errata-ps2-relativistic-scale",
    "errata-ps2-ising-critical",
    "errata-midterm-factorial",
    "errata-gaussian",
    "errata-bose-cv",
  ]) {
    assert.ok(errataIds.includes(requiredId), `missing erratum: ${requiredId}`);
  }

  for (const teacherReference of [
    "Mehran Kardar",
    "Pathria",
    "Kerson Huang",
    "Blundell",
    "Halliday",
  ]) {
    assert.match(source, new RegExp(teacherReference));
  }
  assert.match(source, /Week 1–4/);
  assert.match(source, /Week 5–6/);
  assert.match(source, /Q2 衔接 Week 10/);
});

test("all published course links resolve and sensitive runtime files stay ignored", async () => {
  const [source, gitignore, packageJson] = await Promise.all([
    readFile(new URL("../app/course-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  const localLinks = [
    ...source.matchAll(
      /href:\s*"\/((?:materials|readings|course-plan)\/[^"]+)"/g,
    ),
  ].map((match) => match[1]);
  assert.ok(localLinks.length >= 19);
  for (const localLink of localLinks) {
    await access(new URL(`../public/${localLink}`, import.meta.url));
  }
  await access(
    new URL(
      "../public/course-plan/teacher-course-plan-2025.png",
      import.meta.url,
    ),
  );

  assert.doesNotMatch(gitignore, /\/public\/materials\//);
  assert.doesNotMatch(gitignore, /\/public\/readings\//);
  assert.doesNotMatch(gitignore, /\/public\/course-plan\//);
  assert.match(gitignore, /\.env\*/);
  assert.match(gitignore, /credentials\.json/);
  assert.match(gitignore, /\/logs\//);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("interactive learning safeguards are implemented", async () => {
  const [component, css] = await Promise.all([
    readFile(new URL("../app/StudyGuide.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(component, /phy301-study-tree-v2/);
  assert.match(component, /provisional/);
  assert.match(component, /confirmed/);
  assert.match(component, /reviewIntervals\.map/);
  assert.match(component, /gateChecks/);
  assert.match(component, /review\.result === "pass"/);
  assert.match(component, /generation/);
  assert.match(component, /enforceMasteryInvariants/);
  assert.match(component, /dependenciesReady/);
  assert.match(component, /diagnosticSubmitted/);
  assert.match(component, /错因本/);
  assert.match(component, /导出 JSON 备份/);
  assert.match(component, /导入 JSON 恢复/);
  assert.match(component, /window\.confirm/);
  assert.match(component, /答案默认折叠/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
