import type { FormulaDerivation } from "./formula-derivation-types";

/**
 * A derivation chain added specifically because a teacher slide skips one or
 * more algebraic or physical steps. `sourceFormulas` keeps the exact compact
 * notation from the slide inventory so coverage can be audited independently
 * from the normalized LaTeX used in the walkthrough.
 */
export type TeacherFormulaLesson = {
  moduleId: string;
  lecture: number;
  slides: number[];
  sourceTitle: string;
  sourceFormulas: string[];
  derivation: FormulaDerivation;
};
