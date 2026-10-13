import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("lesson labels and step markers do not restyle nested MathText or KaTeX spans", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  for (const selector of [
    ".today-review > div > span",
    ".module-goal > span",
    ".intuition-box > span",
    ".lesson-details > summary > span",
    ".explanation-list > li > span",
    ".derivation-steps > li > span",
    ".triple-check > span",
    ".module-pager button > span",
    ".assessment-block > span",
    ".syllabus-grid article > span",
    ".errata-grid > div > span",
    ".errata-grid > .corrected > span",
  ]) {
    assert.ok(css.includes(`${selector} {`), `missing scoped selector: ${selector}`);
  }

  for (const unsafeSelector of [
    ".today-review span",
    ".module-goal span",
    ".intuition-box span",
    ".lesson-details > summary span",
    ".explanation-list span",
    ".derivation-steps span",
    ".triple-check span",
    ".module-pager span",
    ".assessment-block span",
    ".syllabus-grid span",
    ".errata-grid span",
    ".errata-grid .corrected span",
  ]) {
    assert.ok(
      !css.includes(`${unsafeSelector} {`),
      `unsafe descendant selector returned: ${unsafeSelector}`,
    );
  }
});
