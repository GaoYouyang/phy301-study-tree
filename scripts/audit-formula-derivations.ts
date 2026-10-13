import { formulaMap, modules } from "../app/course-data";
import {
  formulaDerivations,
  formulaMapTargets,
  getConceptFormulaDerivation,
  getDeepDiveFormulaDerivation,
} from "../app/formula-derivations";
import type { FormulaDerivation } from "../app/formula-derivation-types";
import { teacherFormulaLessons } from "../app/teacher-formula-lessons";
import teacherFormulaSource from "../app/teacher-slide-formulas.generated.json";

const failures: string[] = [];
let conceptFormulaCount = 0;
let deepFormulaCount = 0;
let derivationStepCount = 0;
let symbolDefinitionCount = 0;
let selfCheckCount = 0;

const EXPECTED_SITE_FORMULAS = 126;
const EXPECTED_TEACHER_SUPPLEMENTS = 53;
const EXPECTED_DERIVATION_CHAINS = 179;
const EXPECTED_SOURCE_LECTURES = 10;
const EXPECTED_SOURCE_SLIDES = 214;
const EXPECTED_SOURCE_FORMULAS = 629;

for (const courseModule of modules) {
  for (const concept of courseModule.concepts) {
    if (!concept.formula) continue;
    conceptFormulaCount += 1;
    const derivation = getConceptFormulaDerivation(courseModule.id, concept.title);
    if (!derivation) {
      failures.push(
        `Missing concept derivation: ${courseModule.id} / ${concept.title}`,
      );
      continue;
    }
    if (derivation.conclusion !== concept.formula) {
      failures.push(
        `Conclusion drift: ${derivation.id} must equal the displayed concept formula`,
      );
    }
  }

  for (const deepDive of courseModule.deepDives) {
    for (const formula of deepDive.formulas ?? []) {
      deepFormulaCount += 1;
      const derivation = getDeepDiveFormulaDerivation(
        courseModule.id,
        deepDive.title,
        formula,
      );
      if (!derivation) {
        failures.push(
          `Missing deep-dive derivation: ${courseModule.id} / ${deepDive.title} / ${formula}`,
        );
        continue;
      }
      if (derivation.conclusion !== formula) {
        failures.push(
          `Conclusion drift: ${derivation.id} must equal the displayed deep-dive formula`,
        );
      }
    }
  }
}

const derivationsById = new Map<string, string>();

function auditDerivation(
  occurrence: string,
  derivation: FormulaDerivation,
  minimumStepCount: number,
) {
  derivationStepCount += derivation.steps.length;
  symbolDefinitionCount += derivation.symbols.length;
  selfCheckCount += derivation.checks.length;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(derivation.id)) {
    failures.push(`Unstable formula id: ${derivation.id}`);
  }
  const previous = derivationsById.get(derivation.id);
  if (previous) {
    failures.push(
      `Formula id must be unique across all libraries: ${derivation.id} (${previous}, ${occurrence})`,
    );
  } else {
    derivationsById.set(derivation.id, occurrence);
  }

  for (const [field, value] of Object.entries({
    title: derivation.title,
    origin: derivation.origin,
    conclusion: derivation.conclusion,
  })) {
    if (!value.trim()) failures.push(`${occurrence} has empty ${field}`);
  }
  for (const [field, values] of Object.entries({
    prerequisites: derivation.prerequisites,
    assumptions: derivation.assumptions,
    checks: derivation.checks,
    evidence: derivation.evidence ?? [],
  })) {
    if (values.length === 0 || values.some((item) => !item.trim())) {
      failures.push(`${occurrence} needs non-empty ${field}`);
    }
  }
  if (derivation.steps.length < minimumStepCount) {
    failures.push(
      `${occurrence} needs at least ${minimumStepCount} continuous steps`,
    );
  }
  derivation.steps.forEach((step, index) => {
    if (!step.title.trim() || !step.formula.trim() || !step.explanation.trim()) {
      failures.push(`${occurrence} step ${index + 1} is incomplete`);
    }
  });
}

for (const [occurrence, derivation] of Object.entries(formulaDerivations)) {
  auditDerivation(occurrence, derivation, 2);
}

const moduleIds = new Set(modules.map((courseModule) => courseModule.id));
for (const [index, lesson] of teacherFormulaLessons.entries()) {
  const occurrence = `teacherFormulaLessons[${index}]`;
  if (!moduleIds.has(lesson.moduleId)) {
    failures.push(`${occurrence} has unknown moduleId: ${lesson.moduleId}`);
  }
  if (!Number.isInteger(lesson.lecture) || lesson.lecture < 1 || lesson.lecture > 10) {
    failures.push(`${occurrence} has invalid lecture: ${lesson.lecture}`);
  }
  if (
    lesson.slides.length === 0 ||
    lesson.slides.some((slide) => !Number.isInteger(slide) || slide < 1)
  ) {
    failures.push(`${occurrence} needs valid source slides`);
  }
  if (!lesson.sourceTitle.trim()) {
    failures.push(`${occurrence} has an empty sourceTitle`);
  }
  if (
    lesson.sourceFormulas.length === 0 ||
    lesson.sourceFormulas.some((formula) => !formula.trim())
  ) {
    failures.push(`${occurrence} needs non-empty sourceFormulas`);
  }
  auditDerivation(occurrence, lesson.derivation, 4);
}

for (const item of formulaMap) {
  const targets = formulaMapTargets[item.name];
  if (!targets?.length) {
    failures.push(`Formula-map card has no derivation route: ${item.name}`);
    continue;
  }
  for (const target of targets) {
    if (!getConceptFormulaDerivation(target.moduleId, target.conceptTitle)) {
      failures.push(
        `Formula-map route is unresolved: ${item.name} → ${target.moduleId} / ${target.conceptTitle}`,
      );
    }
    const targetModule = modules.find(
      (courseModule) => courseModule.id === target.moduleId,
    );
    const targetConcept = targetModule?.concepts.find(
      (concept) => concept.title === target.conceptTitle,
    );
    if (!targetConcept || targetConcept.core === false) {
      failures.push(
        `Formula-map route must stay visible in core mode: ${item.name} → ${target.moduleId} / ${target.conceptTitle}`,
      );
    }
  }
}

const sourceFormulaIds = new Set<string>();
const sourceFormulaKeys = new Set<string>();
const sourceFormulaRoutes = new Map<string, Set<string>>();
const sourceLectureIds = new Set<number>();
const routedDerivationIds = new Set<string>();
const teacherDerivationIds = new Set(
  teacherFormulaLessons.map((lesson) => lesson.derivation.id),
);
let sourceFormulaCount = 0;
let sourceSlideCount = 0;

if (teacherFormulaSource.course !== "PHY301") {
  failures.push(`Teacher formula source has wrong course: ${teacherFormulaSource.course}`);
}
if (teacherFormulaSource.sourceLectureCount !== EXPECTED_SOURCE_LECTURES) {
  failures.push(
    `Expected ${EXPECTED_SOURCE_LECTURES} source lectures, found ${teacherFormulaSource.sourceLectureCount}`,
  );
}
if (teacherFormulaSource.sourceSlideCount !== EXPECTED_SOURCE_SLIDES) {
  failures.push(
    `Expected ${EXPECTED_SOURCE_SLIDES} source slides, found ${teacherFormulaSource.sourceSlideCount}`,
  );
}
if (teacherFormulaSource.totalFormulaOccurrences !== EXPECTED_SOURCE_FORMULAS) {
  failures.push(
    `Expected ${EXPECTED_SOURCE_FORMULAS} teacher formula occurrences, found ${teacherFormulaSource.totalFormulaOccurrences}`,
  );
}
if (teacherFormulaSource.derivationChainCount !== EXPECTED_DERIVATION_CHAINS) {
  failures.push(
    `Expected ${EXPECTED_DERIVATION_CHAINS} derivation chains in source manifest, found ${teacherFormulaSource.derivationChainCount}`,
  );
}
if (
  teacherFormulaSource.dedicatedTeacherSupplementCount !==
  EXPECTED_TEACHER_SUPPLEMENTS
) {
  failures.push(
    `Expected ${EXPECTED_TEACHER_SUPPLEMENTS} teacher supplements in source manifest, found ${teacherFormulaSource.dedicatedTeacherSupplementCount}`,
  );
}

for (const lecture of teacherFormulaSource.lectures) {
  if (
    !Number.isInteger(lecture.lecture) ||
    lecture.lecture < 1 ||
    lecture.lecture > EXPECTED_SOURCE_LECTURES
  ) {
    failures.push(`Teacher source has invalid lecture number: ${lecture.lecture}`);
  }
  if (sourceLectureIds.has(lecture.lecture)) {
    failures.push(`Teacher source repeats lecture ${lecture.lecture}`);
  }
  sourceLectureIds.add(lecture.lecture);
  if (!lecture.sourceFile.trim()) {
    failures.push(`Lecture ${lecture.lecture} has an empty sourceFile`);
  }
  if (!Number.isInteger(lecture.slideCount) || Number(lecture.slideCount) < 1) {
    failures.push(`Lecture ${lecture.lecture} has invalid slideCount: ${lecture.slideCount}`);
  } else {
    sourceSlideCount += Number(lecture.slideCount);
  }

  const slideIds = new Set<number>();
  let lectureFormulaCount = 0;
  for (const slide of lecture.slides) {
    if (
      !Number.isInteger(slide.slide) ||
      slide.slide < 1 ||
      slide.slide > Number(lecture.slideCount)
    ) {
      failures.push(
        `Lecture ${lecture.lecture} has invalid formula slide: ${slide.slide}`,
      );
    }
    if (slideIds.has(slide.slide)) {
      failures.push(`Lecture ${lecture.lecture} repeats slide ${slide.slide}`);
    }
    slideIds.add(slide.slide);
    for (const [field, value] of Object.entries({
      title: slide.title,
      translation: slide.translation,
      explanation: slide.explanation,
    })) {
      if (!value.trim()) {
        failures.push(
          `Lecture ${lecture.lecture} slide ${slide.slide} has empty ${field}`,
        );
      }
    }

    for (const formula of slide.formulas) {
      sourceFormulaCount += 1;
      lectureFormulaCount += 1;
      if (sourceFormulaIds.has(formula.id)) {
        failures.push(`Teacher source formula id is duplicated: ${formula.id}`);
      }
      sourceFormulaIds.add(formula.id);
      const sourceFormulaKey = `${lecture.lecture}:${slide.slide}:${formula.formula}`;
      sourceFormulaKeys.add(sourceFormulaKey);
      const exactRoutes = sourceFormulaRoutes.get(sourceFormulaKey) ?? new Set<string>();
      formula.routeIds.forEach((routeId) => exactRoutes.add(routeId));
      sourceFormulaRoutes.set(sourceFormulaKey, exactRoutes);
      if (!formula.formula.trim() || !formula.note.trim() || !formula.status.trim()) {
        failures.push(`Teacher source formula ${formula.id} has incomplete source metadata`);
      }
      if (formula.routeIds.length === 0) {
        failures.push(`Teacher source formula ${formula.id} has no derivation route`);
      }
      for (const routeId of formula.routeIds) {
        routedDerivationIds.add(routeId);
        if (!derivationsById.has(routeId)) {
          failures.push(
            `Teacher source formula ${formula.id} has unresolved route: ${routeId}`,
          );
        }
      }
      if (
        formula.coverage !== "existing-chain" &&
        formula.coverage !== "dedicated-supplement"
      ) {
        failures.push(
          `Teacher source formula ${formula.id} has invalid coverage: ${formula.coverage}`,
        );
      }
      if (
        formula.coverage === "dedicated-supplement" &&
        !formula.routeIds.some((routeId) => teacherDerivationIds.has(routeId))
      ) {
        failures.push(
          `Teacher source formula ${formula.id} claims dedicated coverage without a teacher supplement route`,
        );
      }
    }
  }
  if (lecture.formulaCount !== lectureFormulaCount) {
    failures.push(
      `Lecture ${lecture.lecture} formulaCount drift: ${lecture.formulaCount} metadata vs ${lectureFormulaCount} rows`,
    );
  }
}

for (const lesson of teacherFormulaLessons) {
  if (!routedDerivationIds.has(lesson.derivation.id)) {
    failures.push(
      `Teacher supplement is not routed from the source manifest: ${lesson.derivation.id}`,
    );
  }
  for (const sourceFormula of lesson.sourceFormulas) {
    const exactSourceKey = lesson.slides
      .map((slide) => `${lesson.lecture}:${slide}:${sourceFormula}`)
      .find((key) => sourceFormulaKeys.has(key));
    if (!exactSourceKey) {
      failures.push(
        `Teacher supplement source formula is not an exact manifest row: ${lesson.derivation.id} / ${sourceFormula}`,
      );
    } else if (
      !sourceFormulaRoutes
        .get(exactSourceKey)
        ?.has(lesson.derivation.id)
    ) {
      failures.push(
        `Teacher supplement source formula does not route to its own derivation: ${lesson.derivation.id} / ${sourceFormula}`,
      );
    }
  }
}

if (sourceLectureIds.size !== EXPECTED_SOURCE_LECTURES) {
  failures.push(
    `Expected ${EXPECTED_SOURCE_LECTURES} unique lecture inventories, found ${sourceLectureIds.size}`,
  );
}
if (sourceSlideCount !== EXPECTED_SOURCE_SLIDES) {
  failures.push(
    `Expected lecture slideCount total ${EXPECTED_SOURCE_SLIDES}, computed ${sourceSlideCount}`,
  );
}
if (sourceFormulaCount !== EXPECTED_SOURCE_FORMULAS) {
  failures.push(
    `Expected ${EXPECTED_SOURCE_FORMULAS} source formula rows, computed ${sourceFormulaCount}`,
  );
}

const expectedOccurrences = conceptFormulaCount + deepFormulaCount;
if (Object.keys(formulaDerivations).length !== expectedOccurrences) {
  failures.push(
    `Expected exactly ${expectedOccurrences} formula occurrences, found ${Object.keys(formulaDerivations).length}`,
  );
}
if (expectedOccurrences !== EXPECTED_SITE_FORMULAS) {
  failures.push(
    `Expected ${EXPECTED_SITE_FORMULAS} structured site formulas, computed ${expectedOccurrences}`,
  );
}
if (teacherFormulaLessons.length !== EXPECTED_TEACHER_SUPPLEMENTS) {
  failures.push(
    `Expected ${EXPECTED_TEACHER_SUPPLEMENTS} teacher supplements, found ${teacherFormulaLessons.length}`,
  );
}
const expectedAllDerivationRecords =
  Object.keys(formulaDerivations).length + teacherFormulaLessons.length;
if (expectedAllDerivationRecords !== EXPECTED_DERIVATION_CHAINS) {
  failures.push(
    `Expected ${EXPECTED_DERIVATION_CHAINS} total derivation chains, computed ${expectedAllDerivationRecords}`,
  );
}
if (derivationsById.size !== expectedAllDerivationRecords) {
  failures.push(
    `Formula ids must be one-to-one across libraries: ${derivationsById.size} ids for ${expectedAllDerivationRecords} records`,
  );
}

if (failures.length > 0) {
  console.error(
    JSON.stringify(
      {
        failures: failures.slice(0, 80),
        failureCount: failures.length,
        conceptFormulaCount,
        deepFormulaCount,
        teacherSupplementCount: teacherFormulaLessons.length,
        sourceFormulaCount,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} else {
  console.log(
    `Formula derivation audit passed: ${expectedOccurrences}/${EXPECTED_SITE_FORMULAS} structured site formulas + ${teacherFormulaLessons.length}/${EXPECTED_TEACHER_SUPPLEMENTS} teacher supplements = ${derivationsById.size}/${EXPECTED_DERIVATION_CHAINS} stable derivation chains with ${derivationStepCount} intermediate steps, ${symbolDefinitionCount} symbol definitions, and ${selfCheckCount} checks; ${sourceFormulaCount}/${EXPECTED_SOURCE_FORMULAS} teacher formula occurrences indexed across ${sourceSlideCount}/${EXPECTED_SOURCE_SLIDES} source slides.`,
  );
}
