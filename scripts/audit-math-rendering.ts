import katex from "katex";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as courseData from "../app/course-data";
import * as assessmentCoverage from "../app/assessment-coverage";
import { formulaDerivations } from "../app/formula-derivations";
import { teacherFormulaLessons } from "../app/teacher-formula-lessons";
import teacherFormulaSource from "../app/teacher-slide-formulas.generated.json";
import MathText, {
  legacyMathToLatex,
  splitMathText,
  unwrapWholeLiteralMath,
} from "../app/MathText";
import FormulaWalkthrough from "../app/FormulaWalkthrough";

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
      const literalLatex = unwrapWholeLiteralMath(value);
      validateExpression(
        literalLatex ?? value.replace(/^\$\$?|\$\$?$/g, ""),
        path,
        true,
        literalLatex !== null,
      );
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
      visit(
        child,
        `${path}.${key}`,
        key === "formula" || key === "formulas" || key === "sourceFormulas",
      );
    }
  }
}

for (const [exportName, value] of Object.entries(courseData)) {
  visit(value, exportName);
}

for (const [exportName, value] of Object.entries(assessmentCoverage)) {
  visit(value, `assessmentCoverage.${exportName}`);
}

visit(formulaDerivations, "formulaDerivations");

const beforeTeacherSupplements = mathExpressions;
visit(teacherFormulaLessons, "teacherFormulaLessons");
const teacherSupplementExpressions = mathExpressions - beforeTeacherSupplements;

const beforeTeacherSource = mathExpressions;
visit(teacherFormulaSource, "teacherFormulaSource");
const teacherSourceExpressions = mathExpressions - beforeTeacherSource;

const renderedWalkthroughs = [
  ...Object.values(formulaDerivations),
  ...teacherFormulaLessons.map((lesson) => lesson.derivation),
];
for (const [index, derivation] of renderedWalkthroughs.entries()) {
  const markup = renderToStaticMarkup(
    createElement(FormulaWalkthrough, { derivation }),
  );
  if (markup.includes("katex-error")) {
    failures.push({
      path: `renderedWalkthroughs[${index}].${derivation.id}`,
      source: derivation.conclusion,
      latex: "",
      error: "FormulaWalkthrough rendered a KaTeX error node",
    });
  }
}

if (teacherFormulaLessons.length !== 53) {
  failures.push({
    path: "teacherFormulaLessons.coverage",
    source: String(teacherFormulaLessons.length),
    latex: "",
    error: "Expected all 53 teacher skipped-step supplements in the math audit",
  });
}

if (teacherSupplementExpressions < teacherFormulaLessons.length * 5) {
  failures.push({
    path: "teacherFormulaLessons.math-coverage",
    source: String(teacherSupplementExpressions),
    latex: "",
    error: "Teacher supplement math coverage is unexpectedly low",
  });
}

if (
  teacherFormulaSource.totalFormulaOccurrences !== 629 ||
  teacherSourceExpressions < teacherFormulaSource.totalFormulaOccurrences
) {
  failures.push({
    path: "teacherFormulaSource.math-coverage",
    source: `${teacherSourceExpressions}/${teacherFormulaSource.totalFormulaOccurrences}`,
    latex: "",
    error: "Expected every one of the 629 teacher source formulas to be rendered",
  });
}

const conversionRegressions = [
  {
    source: "N ~ 10²³",
    required: ["N \\sim 10^{23}"],
    forbidden: ["N ~ 10^{23}"],
  },
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
  {
    source: "D0=N/εF; T/TF; coth(βℏω/2)",
    required: ["D_0", "T_F", "\\coth"],
    forbidden: ["\\text{coth}", "D0", "TF"],
  },
  {
    source: "K(x,x';β): imaginary-time thermal kernel",
    required: [
      "\\text{imaginary-time}\\ \\text{thermal}\\ \\text{kernel}",
    ],
    forbidden: ["imaginary}-\\text{time}", "thermal}\\text{kernel}"],
  },
  {
    source: "p⃗1²+q⃗i+M⃗",
    required: ["\\vec{p}_{1}^{2}", "\\vec{q}_{i}", "\\vec{M}"],
    forbidden: ["⃗"],
  },
  {
    source: "∏ᵢ₌₁ᴺ d³qi; ∑ᴺ₌₀∞ zᴺ; Σα₌₁³ᴺ",
    required: [
      "\\prod _{i=1}^{N}",
      "\\sum_{N=0}^{\\infty}",
      "\\sum_{\\alpha =1}^{3N}",
    ],
    forbidden: ["}_{=", "ᵢ", "₌"],
  },
  {
    source: "Ū=-N²ū/V; x²¯; m²¯",
    required: ["\\bar{U}", "\\overline{x^{2}}", "\\overline{m^{2}}"],
    forbidden: ["Ū", "¯"],
  },
  {
    source: "H_N=-J∑ᵢσᵢσᵢ₊₁; ∂μ₀(xN)/∂x",
    required: ["\\sigma _{i+1}", "\\partial_{\\mu _0}"],
    forbidden: ["_{i}_{+1}", "_{\\mu }_{0}"],
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

const wholeDisplayLiteral = String.raw`$$\sum_{n=0}^{\infty}\int_0^{\infty}dx\;\begin{pmatrix}1&q\\q&1\end{pmatrix}$$`;
const wholeDisplayMarkup = renderToStaticMarkup(
  createElement(MathText, { text: wholeDisplayLiteral, display: true }),
);
for (const required of [
  "\\sum_{n=0}^{\\infty}",
  "\\int_0^{\\infty}",
  "\\begin{pmatrix}",
]) {
  if (!wholeDisplayMarkup.includes(required)) {
    failures.push({
      path: "whole-display-literal",
      source: wholeDisplayLiteral,
      latex: wholeDisplayMarkup,
      error: `Display-level literal TeX was not preserved: ${required}`,
    });
  }
}
if (wholeDisplayMarkup.includes("\\text{pmatrix}")) {
  failures.push({
    path: "whole-display-literal",
    source: wholeDisplayLiteral,
    latex: wholeDisplayMarkup,
    error: "Display-level literal TeX was incorrectly sent through the legacy converter",
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
    `Math audit passed: ${mathExpressions} expressions (${displayExpressions} display) from ${courseStrings} course strings, including ${teacherSupplementExpressions} teacher-supplement expressions and ${teacherSourceExpressions} source-inventory expressions.`,
  );
}
