export type FormulaKind =
  | "定义"
  | "公设 / 经验定律"
  | "恒等式"
  | "模型"
  | "近似"
  | "推导结果"
  | "解题框架";

export type FormulaDerivationStep = {
  title: string;
  formula: string;
  explanation: string;
};

export type FormulaDerivation = {
  id: string;
  title: string;
  aliases?: string[];
  kind: FormulaKind;
  origin: string;
  symbols: { symbol: string; meaning: string }[];
  prerequisites: string[];
  assumptions: string[];
  steps: FormulaDerivationStep[];
  conclusion: string;
  checks: string[];
  evidence?: string[];
};

export function conceptFormulaKey(moduleId: string, conceptTitle: string) {
  return `concept:${moduleId}:${conceptTitle}`;
}

export function deepDiveFormulaKey(
  moduleId: string,
  deepDiveTitle: string,
  formula: string,
) {
  return `deep:${moduleId}:${deepDiveTitle}:${formula}`;
}
