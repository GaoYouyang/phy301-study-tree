import assert from "node:assert/strict";
import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = join(root, "out");
const docs = join(root, "docs");
const requiredCourseFiles = [
  "materials/lecture-01.pptx",
  "materials/midterm-2025-solution.pdf",
  "readings/david-tong-statistical-physics.pdf",
  "course-plan/teacher-course-plan-2025.png",
];

await access(join(out, "index.html"));
await Promise.all(requiredCourseFiles.map((file) => access(join(out, file))));

await writeFile(join(out, ".nojekyll"), "");
await rm(docs, { recursive: true, force: true });
await mkdir(docs, { recursive: true });
await cp(out, docs, { recursive: true });

const html = await readFile(join(docs, "index.html"), "utf8");
assert.match(html, /\/phy301-study-tree\/_next\//);

console.log("GitHub Pages output prepared in docs/ (complete course library included).");
