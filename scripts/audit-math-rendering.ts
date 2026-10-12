import katex from "katex";
import * as courseData from "../app/course-data";
import * as assessmentCoverage from "../app/assessment-coverage";
import { legacyMathToLatex, splitMathText } from "../app/MathText";

type Failure = {
  path: string;
  source: string;
  latex: string;
  error: string;
};

const failures: Failure[] = [];
let courseStrings = 0;
let mathExpressions = 0;
let displayExpressions = 0;

function validateExpression(
  source: string,
  path: string,
  displayMode = false,
  literalLatex = false,
) {
  const latex = literalLatex ? source.trim() : legacyMathToLatex(source);
  try {
    const rendered = katex.renderToString(latex, {
      displayMode,
      throwOnError: true,
      strict: "error",
      trust: false,
      output: "htmlAndMathml",
    });
    if (!rendered.includes("<math") || !rendered.includes("annotation encoding=\"application/x-tex\"")) {
      throw new Error("KaTeX output is missing accessible MathML or its TeX annotation");
    }
    mathExpressions += 1;
    if (displayMode) displayExpressions += 1;
  } catch (error) {
    failures.push({
      path,
      source,
      latex,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function visit(value: unknown, path: string, formulaContext = false) {
  if (typeof value === "string") {
    courseStrings += 1;
    if (formulaContext) {
      validateExpression(value.replace(/^\$\$?|\$\$?$/g, ""), path, true);
      return;
    }
    for (const [index, segment] of splitMathText(value).entries()) {
      if (segment.kind === "math") {
        validateExpression(
          segment.value,
          `${path}#${index}`,
          segment.display,
          segment.literalLatex,
        );
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, `${path}[${index}]`, formulaContext));
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      visit(child, `${path}.${key}`, key === "formula" || key === "formulas");
    }
  }
}

for (const [exportName, value] of Object.entries(courseData)) {
  visit(value, exportName);
}

for (const [exportName, value] of Object.entries(assessmentCoverage)) {
  visit(value, `assessmentCoverage.${exportName}`);
}

const conversionRegressions = [
  {
    source: "n̄i=gi/[e^(β(εi−μ))∓1]",
    required: ["\\bar{n}_{i}", "e^{\\beta (\\varepsilon _{i}-\\mu )}"],
    forbidden: ["e^("],
  },
  {
    source: "Ξ=ΣN=0∞ zᴺZN=Σstates e^[−β(E−μN)]",
    required: ["\\sum_{N=0}^{\\infty", "\\sum_{\\text{states}}", "e^{-\\beta (E-\\mu N)}"],
    forbidden: ["Σ", "e^["],
  },
  {
    source: "P(x∈[a,b])=∫ₐᵇp(x)dx",
    required: ["\\int_{a}^{b}"],
    forbidden: ["ₐ", "ᵇ"],
  },
  {
    source: "VarN=β^{-2}∂²μlnΞ",
    required: ["\\operatorname{Var}(N)", "\\partial_{\\mu }^{2}\\ln\\Xi"],
    forbidden: ["\\operatorname{\\operatorname"],
  },
] as const;

for (const [index, check] of conversionRegressions.entries()) {
  const latex = legacyMathToLatex(check.source);
  for (const required of check.required) {
    if (!latex.includes(required)) {
      failures.push({
        path: `conversion-regression[${index}]`,
        source: check.source,
        latex,
        error: `Missing expected TeX fragment: ${required}`,
      });
    }
  }
  for (const forbidden of check.forbidden) {
    if (latex.includes(forbidden)) {
      failures.push({
        path: `conversion-regression[${index}]`,
        source: check.source,
        latex,
        error: `Unexpected legacy fragment remained: ${forbidden}`,
      });
    }
  }
}

const literalSegment = splitMathText(
  "$\\operatorname{Var}(E)+\\ln Z+\\exp(-\\beta E)$",
)[0];
if (
  literalSegment?.kind !== "math" ||
  !literalSegment.literalLatex ||
  literalSegment.value !== "\\operatorname{Var}(E)+\\ln Z+\\exp(-\\beta E)"
) {
  failures.push({
    path: "literal-latex",
    source: "$\\operatorname{Var}(E)+\\ln Z+\\exp(-\\beta E)$",
    latex: literalSegment?.value ?? "",
    error: "Explicit $...$ TeX must bypass the legacy notation converter",
  });
}

if (mathExpressions < 500) {
  failures.push({
    path: "coverage",
    source: String(mathExpressions),
    latex: "",
    error: "Expected at least 500 rendered mathematical expressions across the course data",
  });
}

if (displayExpressions < 100) {
  failures.push({
    path: "display-coverage",
    source: String(displayExpressions),
    latex: "",
    error: "Expected at least 100 display equations across formula fields",
  });
}

if (failures.length > 0) {
  console.error(JSON.stringify({ failures: failures.slice(0, 40), failureCount: failures.length }, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    `Math audit passed: ${mathExpressions} expressions (${displayExpressions} display) from ${courseStrings} course strings.`,
  );
}
