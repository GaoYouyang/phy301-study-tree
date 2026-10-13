import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formulaDerivations } from "../app/formula-derivations";
import { teacherFormulaLessons } from "../app/teacher-formula-lessons";

type SourceFormula =
  | string
  | { formula: string; note?: string; status?: string };

type TranslationSlide = {
  source_slide: number;
  original_title: string;
  faithful_zh_translation: string;
  teaching_explanation: string;
  formulas_and_symbols: SourceFormula[];
  prerequisites_and_backlinks?: string[];
  prerequisites_backlinks?: string[];
  common_mistakes?: string[];
};

type TranslationLecture = {
  source_file?: string;
  source?: string;
  slide_count?: number;
  slides: TranslationSlide[];
};

type RouteCandidate = {
  id: string;
  moduleId: string;
  lecture: number;
  firstSlide: number;
  lastSlide: number;
  searchable: string;
  dedicated: boolean;
};

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(scriptPath), "..");
const translationRoot = path.join(
  repositoryRoot,
  ".codex-build",
  "translation-content",
);
const outputPath = path.join(
  repositoryRoot,
  "app",
  "teacher-slide-formulas.generated.json",
);

function slideRangesFromEvidence(evidence: string) {
  const ranges: { lecture: number; firstSlide: number; lastSlide: number }[] = [];
  const patterns = [
    /课件\s*(\d+)\s+slides?\s*(\d+)(?:[–-](\d+))?/giu,
    /Lecture\s*(\d+).*?(?:slide|p\.?|页)\s*(\d+)(?:[–-](\d+))?/giu,
  ];

  for (const pattern of patterns) {
    for (const match of evidence.matchAll(pattern)) {
      ranges.push({
        lecture: Number(match[1]),
        firstSlide: Number(match[2]),
        lastSlide: Number(match[3] ?? match[2]),
      });
    }
  }
  return ranges;
}

function searchTokens(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[−–—]/gu, "-")
    .replace(/[^a-z0-9\u3400-\u9fffα-ωΑ-Ω]+/gu, " ")
    .trim();
  const tokens = new Set(normalized.split(/\s+/u).filter((token) => token.length > 1));
  const chinese = [...normalized.replace(/[^\u3400-\u9fff]/gu, "")];
  for (let index = 0; index < chinese.length - 1; index += 1) {
    tokens.add(`${chinese[index]}${chinese[index + 1]}`);
  }
  return tokens;
}

function overlapScore(source: string, candidate: string) {
  const sourceTokens = searchTokens(source);
  const candidateTokens = searchTokens(candidate);
  let score = 0;
  for (const token of sourceTokens) {
    if (candidateTokens.has(token)) score += token.length > 2 ? 4 : 1;
  }
  return score;
}

const candidates: RouteCandidate[] = [];
for (const [occurrence, derivation] of Object.entries(formulaDerivations)) {
  const moduleId = occurrence.split(":")[1];
  const searchable = [
    derivation.title,
    derivation.origin,
    derivation.conclusion,
    ...(derivation.aliases ?? []),
  ].join(" ");
  for (const evidence of derivation.evidence ?? []) {
    for (const range of slideRangesFromEvidence(evidence)) {
      candidates.push({
        id: derivation.id,
        moduleId,
        ...range,
        searchable,
        dedicated: false,
      });
    }
  }
}

for (const lesson of teacherFormulaLessons) {
  const searchable = [
    lesson.sourceTitle,
    ...lesson.sourceFormulas,
    lesson.derivation.title,
    lesson.derivation.origin,
    lesson.derivation.conclusion,
    ...(lesson.derivation.aliases ?? []),
  ].join(" ");
  for (const slide of lesson.slides) {
    candidates.push({
      id: lesson.derivation.id,
      moduleId: lesson.moduleId,
      lecture: lesson.lecture,
      firstSlide: slide,
      lastSlide: slide,
      searchable,
      dedicated: true,
    });
  }
}

const manualFallbacks: Record<string, string[]> = {
  "8:19": ["grand-log-xi-potential-number-fluctuation"],
  "9:13": ["bose-bec-critical-temperature-condensate"],
  "10:2": [
    "canonical-relative-energy-fluctuation-scaling",
    "grand-log-xi-potential-number-fluctuation",
  ],
  "10:8": [
    "fick-continuity-diffusion-equation",
    "smoluchowski-detailed-balance-boltzmann",
  ],
};

const knownRouteIds = new Set([
  ...Object.values(formulaDerivations).map((item) => item.id),
  ...teacherFormulaLessons.map((item) => item.derivation.id),
]);

const missingSources: string[] = [];
let totalFormulaOccurrences = 0;
const lectures = [];

for (let lecture = 1; lecture <= 10; lecture += 1) {
  const lectureId = String(lecture).padStart(2, "0");
  const sourcePath = path.join(translationRoot, `lecture-${lectureId}.json`);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Translation inventory is missing: ${sourcePath}`);
  }
  const source = JSON.parse(
    fs.readFileSync(sourcePath, "utf8"),
  ) as TranslationLecture;
  const slideCount = source.slide_count ?? source.slides.length;

  const slides = source.slides.flatMap((slide) => {
    if (slide.formulas_and_symbols.length === 0) return [];
    const formulas = slide.formulas_and_symbols.map((entry, formulaIndex) => {
      const formula = typeof entry === "string" ? entry : entry.formula;
      const note = typeof entry === "string" ? "课件原式；结合本页讲解与推导链阅读。" : entry.note ?? "";
      const status = typeof entry === "string" ? "verbatim_from_slide_inventory" : entry.status ?? "";
      const sourceText = [
        slide.original_title,
        slide.faithful_zh_translation,
        slide.teaching_explanation,
        formula,
        note,
      ].join(" ");

      const ranked = candidates
        .filter(
          (candidate) =>
            candidate.lecture === lecture &&
            candidate.firstSlide <= slide.source_slide &&
            candidate.lastSlide >= slide.source_slide,
        )
        .map((candidate) => ({
          ...candidate,
          score:
            (candidate.dedicated ? 10_000 : 0) +
            Math.max(0, 120 - (candidate.lastSlide - candidate.firstSlide) * 8) +
            overlapScore(sourceText, candidate.searchable) * 20,
        }))
        .sort((left, right) => right.score - left.score);

      const routeIds = [
        ...new Set([
          ...ranked.map((candidate) => candidate.id),
          ...(manualFallbacks[`${lecture}:${slide.source_slide}`] ?? []),
        ]),
      ].filter((id) => knownRouteIds.has(id)).slice(0, 5);

      if (routeIds.length === 0) {
        missingSources.push(`Lecture ${lecture} slide ${slide.source_slide}: ${formula}`);
      }
      totalFormulaOccurrences += 1;
      return {
        id: `L${lectureId}-S${String(slide.source_slide).padStart(3, "0")}-F${String(formulaIndex + 1).padStart(2, "0")}`,
        formula,
        note,
        status,
        routeIds,
        coverage: ranked.some((candidate) => candidate.dedicated)
          ? "dedicated-supplement"
          : "existing-chain",
      };
    });

    return [
      {
        slide: slide.source_slide,
        title: slide.original_title,
        translation: slide.faithful_zh_translation,
        explanation: slide.teaching_explanation,
        prerequisites: [
          ...(slide.prerequisites_and_backlinks ?? []),
          ...(slide.prerequisites_backlinks ?? []),
        ].filter((item, index, values) => values.indexOf(item) === index),
        mistakes: slide.common_mistakes ?? [],
        formulas,
      },
    ];
  });

  lectures.push({
    lecture,
    sourceFile:
      source.source_file ??
      source.source ??
      `public/materials/lecture-${lectureId}.pptx`,
    slideCount,
    formulaCount: slides.reduce((sum, slide) => sum + slide.formulas.length, 0),
    slides,
  });
}

if (missingSources.length > 0) {
  throw new Error(
    `Teacher formula routes are incomplete (${missingSources.length}):\n${missingSources.join("\n")}`,
  );
}

const output = {
  course: "PHY301",
  sourceLectureCount: lectures.length,
  sourceSlideCount: lectures.reduce((sum, item) => sum + item.slideCount, 0),
  totalFormulaOccurrences,
  derivationChainCount:
    Object.keys(formulaDerivations).length + teacherFormulaLessons.length,
  dedicatedTeacherSupplementCount: teacherFormulaLessons.length,
  lectures,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(
  `Teacher formula source generated: ${totalFormulaOccurrences} occurrences across ${output.sourceSlideCount} slides, routed to ${output.derivationChainCount} derivation chains.`,
);
