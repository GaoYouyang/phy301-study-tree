import { classicalFormulaDerivations } from "./formula-derivations-classical";
import { assessmentFormulaDerivations } from "./formula-derivations-assessment";
import { foundationFormulaDerivations } from "./formula-derivations-foundation";
import { nonequilibriumFormulaDerivations } from "./formula-derivations-nonequilibrium";
import { quantumFormulaDerivations } from "./formula-derivations-quantum";
import { supplementalFormulaDerivations } from "./formula-derivations-supplemental";
import {
  conceptFormulaKey,
  deepDiveFormulaKey,
  type FormulaDerivation,
} from "./formula-derivation-types";

export const formulaDerivations: Record<string, FormulaDerivation> = {
  ...foundationFormulaDerivations,
  ...classicalFormulaDerivations,
  ...quantumFormulaDerivations,
  ...nonequilibriumFormulaDerivations,
  ...supplementalFormulaDerivations,
  ...assessmentFormulaDerivations,
};

export function getConceptFormulaDerivation(
  moduleId: string,
  conceptTitle: string,
) {
  return formulaDerivations[conceptFormulaKey(moduleId, conceptTitle)];
}

export function getDeepDiveFormulaDerivation(
  moduleId: string,
  deepDiveTitle: string,
  formula: string,
) {
  return formulaDerivations[
    deepDiveFormulaKey(moduleId, deepDiveTitle, formula)
  ];
}

export type FormulaMapTarget = {
  moduleId: string;
  conceptTitle: string;
};

export const formulaMapTargets: Record<string, FormulaMapTarget[]> = {
  逆温度: [
    { moduleId: "probability-counting", conceptTitle: "最大熵与指数分布" },
  ],
  "Boltzmann 熵": [
    { moduleId: "thermo-bridge", conceptTitle: "熵：从热力学定义到统计定义" },
  ],
  三条共轭关系: [
    { moduleId: "microcanonical", conceptTitle: "从熵微分读出第一定律" },
  ],
  "Liouville 方程": [
    { moduleId: "phase-ensemble", conceptTitle: "Liouville 方程：概率也要服从微观动力学" },
  ],
  "Boltzmann 分布": [
    { moduleId: "canonical", conceptTitle: "从微正则总系统切出正则子系统" },
  ],
  配分函数: [
    { moduleId: "canonical", conceptTitle: "三种 Z 写法与防漏清单" },
  ],
  自由能与平均能量: [
    { moduleId: "canonical", conceptTitle: "ln Z 的导数机器" },
  ],
  能量涨落: [
    { moduleId: "canonical", conceptTitle: "ln Z 的导数机器" },
    { moduleId: "canonical", conceptTitle: "能量涨落与 ensemble equivalence" },
  ],
  "Gibbs 正则系综": [
    { moduleId: "grand-canonical", conceptTitle: "Gibbs canonical / NPT" },
  ],
  巨配分函数: [
    { moduleId: "grand-canonical", conceptTitle: "巨正则权重与巨配分函数" },
  ],
  巨势与粒子数: [
    { moduleId: "grand-canonical", conceptTitle: "ln Ξ 的导数机器" },
  ],
  "Bose–Einstein / Fermi–Dirac 占据数": [
    { moduleId: "quantum-statistics", conceptTitle: "microcanonical counting 与最可能分布" },
  ],
  "三维理想气体 BEC 临界温度": [
    { moduleId: "bose-gas", conceptTitle: "BEC：不是粒子突然没有能量，而是激发态装满" },
  ],
  "Fermi 波矢与 Fermi 能": [
    { moduleId: "fermi-gas", conceptTitle: "三维 Fermi 尺度与基态热力学" },
  ],
  扩散方程与均方位移: [
    { moduleId: "nonequilibrium", conceptTitle: "闭环一：随机游走 → 扩散" },
    { moduleId: "nonequilibrium", conceptTitle: "Fick + continuity → diffusion equation" },
  ],
  "Langevin 与 Einstein 关系": [
    { moduleId: "nonequilibrium", conceptTitle: "闭环二：Langevin 方程与涨落—耗散" },
  ],
  "一维 Fokker–Planck 方程": [
    { moduleId: "nonequilibrium", conceptTitle: "闭环三：Master equation → Fokker–Planck" },
  ],
};
