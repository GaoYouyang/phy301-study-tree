import {
  conceptFormulaKey,
  deepDiveFormulaKey,
  type FormulaDerivation,
} from "./formula-derivation-types";

const phaseEvidence = [
  "课件 2 slides 1–16",
  "课件 7 slides 2–4",
  "作业 1 Q1",
  "期中 Q1(a)",
];

const microEvidence = [
  "课件 3 slides 1–15, 23",
  "作业 1 Q3–Q4",
  "David Tong Ch. 1.2",
];

const gasEvidence = [
  "课件 3 slides 16–27",
  "作业 1 Q2–Q3",
  "期中 Q2",
];

const canonicalEvidence = [
  "课件 4 slides 1–13",
  "作业 2 Q1–Q2",
  "David Tong Ch. 1.3",
];

const grandEvidence = [
  "课件 5 slides 1–13",
  "作业 2 Q3",
  "期中 Q1(b)/Q3",
];

const interactionEvidence = [
  "课件 6 slides 1–9",
  "期中 Q4",
  "David Tong Ch. 2.5 与 5.1",
];

const transitionEvidence = [
  "课件 6 slides 10–29",
  "作业 2 Q4",
  "David Tong Ch. 5.2–5.5",
];

const midtermEvidence = [
  "课件 7 slides 1–8",
  "期中答案 PDF pp. 3–12",
  "作业 1–2 与答案",
];

export const classicalFormulaDerivations: Record<string, FormulaDerivation> = {
  [conceptFormulaKey("phase-ensemble", "Liouville 方程：概率也要服从微观动力学")]: {
    id: "classical-liouville-continuity",
    title: "从相空间概率守恒推出 Liouville 方程",
    kind: "推导结果",
    origin: "Week 2 · Liouville 定理与系综理论；把 Hamilton 流视为相空间中的不可压缩概率流。",
    symbols: [
      { symbol: "ρ(Γ,t)", meaning: "相空间概率密度" },
      { symbol: "Γ=(q,p)", meaning: "相空间点" },
      { symbol: "H", meaning: "Hamiltonian" },
      { symbol: "{ρ,H}", meaning: "ρ 与 H 的 Poisson bracket" },
    ],
    prerequisites: ["相空间 continuity equation", "Hamilton 方程", "Poisson bracket"],
    assumptions: ["H 二阶连续且没有显含导致概率源汇的非 Hamilton 动力学", "使用 canonical 坐标 q,p"],
    steps: [
      {
        title: "先写相空间概率守恒",
        formula: "∂tρ+∇Γ·(ρvΓ)=0",
        explanation: "任意相空间小体积内概率的变化等于穿过边界的净流量；vΓ=(q̇,ṗ)。",
      },
      {
        title: "证明 Hamilton 流散度为零",
        formula: "∇Γ·vΓ=Σi[∂qi(∂H/∂pi)+∂pi(−∂H/∂qi)]=0",
        explanation: "两项是相反号的混合偏导；H 足够光滑时它们逐项抵消。",
      },
      {
        title: "展开 continuity 并识别 Poisson bracket",
        formula: "∂tρ+vΓ·∇Γρ=∂tρ+{ρ,H}=0",
        explanation: "散度项消失后，只剩概率密度被 Hamilton 流平移；点积正是 Poisson bracket 的坐标表达。",
      },
      {
        title: "改写成沿轨迹的总导数",
        formula: "dρ/dt=∂tρ+q̇·∂qρ+ṗ·∂pρ=0",
        explanation: "随某个相空间流体元一起运动时，所看到的概率密度保持不变。",
      },
    ],
    conclusion: "∂tρ + {ρ,H} = 0  ⇔  dρ/dt along trajectory = 0",
    checks: ["∫dΓρ 的时间导数应只剩边界流并在封闭系统中为 0", "Liouville 允许概率云变形，但不允许 Hamilton 流压缩相空间体积"],
    evidence: phaseEvidence,
  },

  [conceptFormulaKey("phase-ensemble", "平衡分布的允许形式")]: {
    id: "classical-stationary-density-conserved-quantities",
    title: "为什么守恒量的函数是平衡分布",
    kind: "推导结果",
    origin: "Week 2 · Liouville 方程的 stationary 解；它只给允许形式，不单独选出具体系综。",
    symbols: [
      { symbol: "ρeq", meaning: "不显含时间的平衡概率密度" },
      { symbol: "Ca", meaning: "与 H Poisson-commute 的守恒量" },
      { symbol: "f", meaning: "由宏观约束和归一化决定的函数" },
    ],
    prerequisites: ["Liouville 方程", "Poisson bracket 链式法则", "守恒量"],
    assumptions: ["Hamiltonian 不显含时间", "所列 H,Ca 在动力学下守恒", "f 可微且最终可归一化"],
    steps: [
      {
        title: "stationary 条件代入 Liouville",
        formula: "∂tρeq=0  ⇒  {ρeq,H}=0",
        explanation: "平衡概率图案不随时间改变，因此 Liouville 方程要求它沿每条 Hamilton 轨道也不变。",
      },
      {
        title: "让密度只依赖守恒量",
        formula: "ρeq=f(H,C1,C2,...)",
        explanation: "同一轨道上 H 与所有 Ca 均不变，所以这样的复合函数也不会沿轨道变化。",
      },
      {
        title: "用链式法则验证",
        formula: "{ρeq,H}=fH{H,H}+Σa fCa{Ca,H}=0",
        explanation: "{H,H}=0，而每个守恒量满足 {Ca,H}=0；因此该形式确实 stationary。",
      },
    ],
    conclusion: "ρeq = f(H,C1,C2,...)",
    checks: ["这不是唯一解：具体 f 还要由 E、T、μ 等控制条件选择", "若某个 Ca 并不守恒，就不能把它无条件放入 stationary density"],
    evidence: phaseEvidence,
  },

  [conceptFormulaKey("phase-ensemble", "ensemble average 与 time average")]: {
    id: "classical-ergodic-time-ensemble-average",
    title: "time average 与 ensemble average 的遍历桥梁",
    kind: "公设 / 经验定律",
    origin: "Week 2 · 遍历性讨论；等号不是 Liouville 自动保证的结论，而且必须先说明哪一个动力学保存哪一个 invariant measure。",
    symbols: [
      { symbol: "A(t)", meaning: "单条微观轨迹上的 observable" },
      { symbol: "ρeq", meaning: "平衡 invariant density" },
      { symbol: "τ", meaning: "观测时间" },
    ],
    prerequisites: ["概率平均", "相空间积分", "平衡分布"],
    assumptions: [
      "孤立 Hamilton 系统的单条轨迹停留在固定能量壳，因此它能遍历的候选测度是 microcanonical energy-shell measure",
      "canonical average 必须来自系统+热库的更大孤立系统，或来自确实以 canonical density 为 invariant measure 的 thermostat/stochastic dynamics",
      "所讨论动力学对 A 是 ergodic 或至少 mixing 足够强，τ 远大于相关时间，且平均存在",
    ],
    steps: [
      {
        title: "定义单轨迹时间平均",
        formula: "A_time(τ)=(1/τ)∫₀^τ A(Γ(t))dt",
        explanation: "实验常在一个系统上连续读数；这一定义不需要同时准备许多副本。",
      },
      {
        title: "定义平衡系综平均",
        formula: "A_ens=∫dΓ ρeq(Γ)A(Γ)",
        explanation: "理论用同一宏观约束下的许多可能微观态及其概率来平均。",
      },
      {
        title: "孤立 Hamilton 轨迹对应微正则壳",
        formula: "lim(τ→∞)A_time(τ)≈∫_{H=E}dμE A  (if ergodic on H=E)",
        explanation: "能量沿封闭 Hamilton 轨迹守恒，所以单条轨迹不能跨越不同能量壳去直接采样 canonical energy distribution。",
      },
      {
        title: "canonical 平均需要不同的物理实现",
        formula: "⟨A⟩β=Z^{-1}∫dμ e^{-βH}A",
        explanation: "可把小系统嵌入系统+热库的微正则总系统，或采用保存 canonical measure 的恒温/随机动力学；这时长期观测才可能趋近该平均。",
      },
    ],
    conclusion: "lim(τ→∞)(1/τ)∫₀^τA(t)dt ≈ ∫dΓ ρeq A",
    checks: ["integrable 或玻璃态系统可能不遍历，不能把 ≈ 当普适恒等式", "孤立固定能量轨迹不能直接遍历 canonical 的不同能量", "recurrence 的极长时间尺度不等同于实验达到平均所需时间"],
    evidence: phaseEvidence,
  },

  [conceptFormulaKey("microcanonical", "等先验概率不是“所有宇宙状态等概率”")]: {
    id: "microcanonical-equal-a-priori-probability",
    title: "微正则等先验概率与归一化",
    kind: "公设 / 经验定律",
    origin: "Week 3 · 微正则系综基本假设；等概率只限定在固定 E,V,N 的可访问能量壳内。",
    symbols: [
      { symbol: "pi", meaning: "第 i 个微观态的概率" },
      { symbol: "Ω(E,V,N)", meaning: "满足约束的可访问微观态数" },
    ],
    prerequisites: ["离散概率归一化", "宏观约束与微观态"],
    assumptions: ["系统孤立并处于平衡", "E,V,N 固定在指定能量壳", "没有遗漏会分割可访问区域的额外守恒量"],
    steps: [
      {
        title: "在可访问集合内不给额外偏好",
        formula: "pi=c  for i∈accessible;  pi=0 otherwise",
        explanation: "equal a priori probability 是物理假设；它不是说不同能量或动力学不可达的状态也等概率。",
      },
      {
        title: "用总概率为一确定常数",
        formula: "Σi∈accessible pi=Ωc=1  ⇒  c=1/Ω",
        explanation: "可访问集合有 Ω 个状态，所以每个状态分到相同的 1/Ω 权重。",
      },
    ],
    conclusion: "pi = 1/Ω(E,V,N) for accessible states; otherwise 0",
    checks: ["Σi pi=1", "微正则总能量不作 canonical 式热涨落；子系统能量仍可涨落"],
    evidence: microEvidence,
  },

  [conceptFormulaKey("microcanonical", "Ω、ω 与能量壳")]: {
    id: "microcanonical-cumulative-density-shell-count",
    title: "累计体积、态密度与薄壳态数",
    kind: "定义",
    origin: "Week 3 · 统一区分课件中常被统写成 Ω 的三种计数对象。",
    symbols: [
      { symbol: "Σraw(E)", meaning: "H≤E 的有量纲原始相空间体积" },
      { symbol: "Γ(E)", meaning: "除去 N!h^{3N} 后的无量纲累计态数" },
      { symbol: "ω(E)=∂EΓ", meaning: "每单位能量的无量纲态密度" },
      { symbol: "δE", meaning: "微正则能量壳厚度" },
      { symbol: "Θ", meaning: "Heaviside step function" },
    ],
    prerequisites: ["相空间积分", "Heaviside 与 Dirac delta", "微积分基本定理"],
    assumptions: [
      "dΓ=d^{3N}q d^{3N}p 是原始 canonical phase-space measure，不暗含 N! 或 h^{3N}",
      "这里以 N 个三维经典全同粒子为例；可区分粒子不除 N!",
      "Γ 对 E 可微，且 δE 足够窄使 ω 在壳内近似常数",
    ],
    steps: [
      {
        title: "先用原始测度累计相空间体积",
        formula: "Σraw(E)=∫dΓ Θ(E−H(Γ));  dΓ=d^{3N}q d^{3N}p",
        explanation: "Θ 在 H≤E 时为 1。这个积分仍带 action^{3N} 量纲，不能直接当作可取对数的状态数。",
      },
      {
        title: "再除去相空间 cell 与标签重复",
        formula: "Γ(E)=Σraw(E)/(N!h^{3N})",
        explanation: "h^{3N} 使累计计数无量纲，N! 去掉全同粒子标签排列；这两个因子不是 dΓ 的一部分。",
      },
      {
        title: "对无量纲累计态数求导",
        formula: "ω(E)=dΓ(E)/dE=[1/(N!h^{3N})]∫dΓ δ(E−H(Γ))",
        explanation: "求导把累计体积变成能量壳上的态密度；δ 函数只保留 H=E 的点。",
      },
      {
        title: "把薄壳积分近似成密度乘宽度",
        formula: "Ωshell=∫E^{E+δE}ω(E′)dE′≈ω(E)δE",
        explanation: "只要壳很窄而态密度变化不剧烈，就可把 ω 从积分中取出。",
      },
    ],
    conclusion: "Σraw(E)=∫dΓ Θ(E−H);  Γ(E)=Σraw(E)/(N!h³ᴺ);  ω(E)=∂EΓ(E);  Ωshell≈ω(E)δE",
    checks: ["Σraw 带 action^{3N} 量纲，而 Γ 与 Ωshell 无量纲", "ω 的量纲应为 1/能量", "同一计算中不能把原始体积、累计态数与薄壳态数混写成同一个 Ω"],
    evidence: microEvidence,
  },

  [conceptFormulaKey("microcanonical", "最大总态数给出热平衡")]: {
    id: "microcanonical-entropy-maximum-thermal-equilibrium",
    title: "由联合态数极大推出温度相等",
    kind: "推导结果",
    origin: "Week 3 · 两个只交换能量的弱耦合系统；平衡能量分配使总态数最大。",
    symbols: [
      { symbol: "E1,E2", meaning: "两个子系统能量，E2=Etot−E1" },
      { symbol: "Stot", meaning: "S1(E1)+S2(E2)" },
      { symbol: "1/Ta", meaning: "(∂Sa/∂Ea) at fixed Va,Na" },
    ],
    prerequisites: ["独立系统态数相乘", "S=kB lnΩ", "单变量极值"],
    assumptions: ["两系统弱耦合，交互能可忽略", "总能量固定，只允许能量交换", "stationary point 为稳定熵最大值"],
    steps: [
      {
        title: "写联合态数",
        formula: "Ωtot(E1)=Ω1(E1)Ω2(Etot−E1)",
        explanation: "选定 E1 后，系统 2 的能量被总能量约束固定为 Etot−E1；独立微观安排数相乘。",
      },
      {
        title: "取对数变成总熵",
        formula: "Stot(E1)=kBlnΩtot=S1(E1)+S2(Etot−E1)",
        explanation: "最大化 Ωtot 与最大化 lnΩtot 等价，而对数把乘积变成可微的和。",
      },
      {
        title: "对唯一可变能量求导",
        formula: "dStot/dE1=(∂S1/∂E1)−(∂S2/∂E2)=1/T1−1/T2",
        explanation: "E2 对 E1 的导数为 −1，这个负号决定能量流的正确方向。",
      },
      {
        title: "令稳定平衡处一阶变化为零",
        formula: "dStot/dE1=0  ⇒  1/T1=1/T2  ⇒  T1=T2",
        explanation: "二阶导为负时该 stationary point 才是总熵最大值。",
      },
    ],
    conclusion: "dStot/dE1 = 1/T1 − 1/T2 = 0",
    checks: ["若 T1>T2，则 1/T1<1/T2，能量从 1 流向 2 会使 Stot 增大", "必须保留 E2=Etot−E1 带来的负号"],
    evidence: microEvidence,
  },

  [conceptFormulaKey("microcanonical", "从熵微分读出第一定律")]: {
    id: "microcanonical-entropy-differential-conjugates",
    title: "从 S(E,V,N) 的全微分定义热力学共轭量",
    kind: "定义",
    origin: "Week 3 · 用微正则熵对控制量的斜率定义 T、P、μ，再重排为第一定律。",
    symbols: [
      { symbol: "S(E,V,N)", meaning: "微正则熵" },
      { symbol: "T", meaning: "绝对温度" },
      { symbol: "P", meaning: "压强" },
      { symbol: "μ", meaning: "化学势" },
    ],
    prerequisites: ["多变量全微分", "偏导固定量", "S=kB lnΩ"],
    assumptions: ["S 是 E,V,N 的可微状态函数", "采用 dE=T dS−P dV+μdN 的功与化学势符号约定"],
    steps: [
      {
        title: "先写纯数学全微分",
        formula: "dS=(∂S/∂E)V,N dE+(∂S/∂V)E,N dV+(∂S/∂N)E,V dN",
        explanation: "每个系数说明只改变一个自然变量、保持另外两个不变时熵的斜率。",
      },
      {
        title: "定义三个共轭斜率",
        formula: "(∂S/∂E)V,N=1/T;  (∂S/∂V)E,N=P/T;  (∂S/∂N)E,V=−μ/T",
        explanation: "这些定义使统计熵的变化与热力学第一定律使用同一组强度量。",
      },
      {
        title: "代回并可反向重排",
        formula: "dS=(1/T)dE+(P/T)dV−(μ/T)dN  ⇔  dE=T dS−P dV+μdN",
        explanation: "μ 项的负号来自把 dN 项从 dE 形式移到 dS 形式。",
      },
    ],
    conclusion: "dS=(1/T)dE+(P/T)dV−(μ/T)dN",
    checks: ["每个偏导都要写固定量", "P/T 通常为正；增加可用体积会增加普通系统的态数"],
    evidence: microEvidence,
  },

  [conceptFormulaKey("microcanonical", "两能级系统：最小完整模型")]: {
    id: "microcanonical-two-level-combinatorics",
    title: "由二项计数推出两能级激发比例",
    kind: "推导结果",
    origin: "Week 3 · N 个可区分位置各有 0 与 ε 两个能级，固定 M 个激发。",
    symbols: [
      { symbol: "N", meaning: "两能级位置总数" },
      { symbol: "M", meaning: "处于激发态的位置数" },
      { symbol: "ε", meaning: "单次激发能隙" },
      { symbol: "x=M/N", meaning: "激发比例" },
    ],
    prerequisites: ["二项组合数", "Stirling 近似", "1/T=∂S/∂E"],
    assumptions: ["位置可区分且彼此无相互作用", "N、M、N−M 足够大以使用 Stirling", "这里只取正温度支"],
    steps: [
      {
        title: "先数固定 M 的微观排列",
        formula: "Ω=C(N,M)=N!/[M!(N−M)!];  E=Mε",
        explanation: "从 N 个有标签位置中选 M 个激发；能量只由激发数决定。",
      },
      {
        title: "对组合数取对数并用 Stirling",
        formula: "S/kB≈NlnN−MlnM−(N−M)ln(N−M)",
        explanation: "线性的 −N、+M、+(N−M) 正好抵消，留下可求导的对数项。",
      },
      {
        title: "对能量求熵斜率",
        formula: "1/T=∂S/∂E=(kB/ε)ln[(N−M)/M]",
        explanation: "由于 E=Mε，链式法则给 ∂/∂E=(1/ε)∂/∂M。",
      },
      {
        title: "解出激发比例",
        formula: "ln[(1−x)/x]=βε  ⇒  x=1/(e^{βε}+1)",
        explanation: "高温 β→0 时 x→1/2；低温 β→∞ 时 x→0。",
      },
    ],
    conclusion: "Ω=C(N,M);  E=Mε;  excited fraction → 1/(e^{βε}+1)",
    checks: ["T→0 时激发比例趋 0", "T→∞ 时两态等概率而不是能量无限增大"],
    evidence: microEvidence,
  },

  [deepDiveFormulaKey("microcanonical", "补课：熵的 concavity 与热容", "∂²S/∂E² = −1/(T²C)")]: {
    id: "microcanonical-entropy-concavity-heat-capacity",
    title: "熵曲率与热容的关系",
    kind: "恒等式",
    origin: "Week 3 深潜 · 在固定 V,N 下把 1/T=∂S/∂E 再求一次导数。",
    symbols: [
      { symbol: "C", meaning: "固定相应外参时的 dE/dT" },
      { symbol: "∂²S/∂E²", meaning: "熵关于能量的曲率" },
    ],
    prerequisites: ["链式法则", "温度的统计定义", "热容定义"],
    assumptions: ["固定 V,N", "T(E) 可微且 C≠0"],
    steps: [
      {
        title: "从逆温度定义出发",
        formula: "∂S/∂E=1/T",
        explanation: "这是微正则温度定义，求导时 V,N 保持不变。",
      },
      {
        title: "对 E 再求导并使用链式法则",
        formula: "∂²S/∂E²=d(T^{-1})/dE=−T^{-2}dT/dE",
        explanation: "先对 T^{-1} 求 T 导数，再乘 dT/dE。",
      },
      {
        title: "用热容倒数替换 dT/dE",
        formula: "C=dE/dT  ⇒  dT/dE=1/C  ⇒  ∂²S/∂E²=−1/(T²C)",
        explanation: "普通正热容系统因此具有向下凹的 S(E)，与稳定熵最大值一致。",
      },
    ],
    conclusion: "∂²S/∂E² = −1/(T²C)",
    checks: ["C>0 时曲率必须为负", "长程相互作用系统可能出现 C<0，不能无条件套用普通系综等价"],
    evidence: microEvidence,
  },

  [deepDiveFormulaKey("microcanonical", "作业 1 Q4：stars-and-bars 路线", "Σn≥0 p(n)=1")]: {
    id: "microcanonical-geometric-level-normalization",
    title: "单振子几何分布的归一化",
    kind: "恒等式",
    origin: "Week 3 深潜 · 作业 1 Q4；用于排除老师答案末式中无法归一化的加号。",
    symbols: [
      { symbol: "p(n)", meaning: "单振子处于第 n 个激发能级的概率" },
      { symbol: "q=e^{-βℏω}", meaning: "几何级数公比，正温度时 0<q<1" },
    ],
    prerequisites: ["无穷几何级数", "概率归一化"],
    assumptions: ["β>0、ω>0，因此 |q|<1", "n=0,1,2,..."],
    steps: [
      {
        title: "写待定归一化的几何权重",
        formula: "p(n)=Aq^n;  q=e^{-βℏω}",
        explanation: "相邻能级相差 ℏω，所以 Boltzmann 权重每升一级都乘相同的 q。",
      },
      {
        title: "求和并确定 A",
        formula: "Σn=0∞p(n)=AΣn=0∞q^n=A/(1−q)=1  ⇒  A=1−q",
        explanation: "正温度下 q<1，几何级数收敛；归一化系数必须是 1−q 而不是 1+q。",
      },
    ],
    conclusion: "Σn≥0 p(n)=1",
    checks: ["代回 p(n)=(1−q)q^n 后总和严格为 1", "若写 1+q，概率总和会成为 (1+q)/(1−q)>1"],
    evidence: microEvidence,
  },

  [deepDiveFormulaKey("microcanonical", "作业 1 Q4：stars-and-bars 路线", "large N: p(n)≈(1−e^{−βℏω})e^{−nβℏω}")]: {
    id: "microcanonical-oscillator-marginal-large-n",
    title: "从微正则计数得到单振子几何边缘分布",
    kind: "近似",
    origin: "Week 3 深潜 · 作业 1 Q4；从 N 振子固定总激发数的 multiplicity ratio 取热力学极限。",
    symbols: [
      { symbol: "M", meaning: "N 个振子的总激发量子数" },
      { symbol: "n", meaning: "被抽出的单个振子激发量子数" },
      { symbol: "β", meaning: "由剩余大系统熵斜率确定的逆温度" },
    ],
    prerequisites: ["stars-and-bars", "reservoir multiplicity ratio", "熵的一阶展开"],
    assumptions: ["N、M 很大而被抽出的 n 为 O(1)", "剩余 N−1 个振子可视为热库", "β>0"],
    steps: [
      {
        title: "写剩余振子的态数比",
        formula: "p(n)∝Ω_{N−1}(M−n)=C(M−n+N−2,M−n)",
        explanation: "指定一个振子拿走 n 个量子后，剩下 M−n 个量子分给 N−1 个有标签振子。",
      },
      {
        title: "对大热库熵作一阶展开",
        formula: "lnΩ_{N−1}(M−n)≈lnΩ_{N−1}(M)−nβℏω",
        explanation: "移走能量 nℏω 后，热库对数态数减少 βnℏω；二阶项相对大 N 受抑制。",
      },
      {
        title: "指数化并归一化",
        formula: "p(n)=A e^{-nβℏω};  A=1−e^{-βℏω}",
        explanation: "使用前一条几何级数归一化，得到正号概率且总和为 1。",
      },
    ],
    conclusion: "large N: p(n)≈(1−e^{−βℏω})e^{−nβℏω}",
    checks: ["Σn p(n)=1", "βℏω≫1 时 p(0)→1；高温时分布变宽"],
    evidence: microEvidence,
  },

  [conceptFormulaKey("classical-gases", "把能量约束看成高维球")]: {
    id: "classical-ideal-gas-cumulative-state-count",
    title: "经典理想气体的高维球态数",
    kind: "推导结果",
    origin: "Week 4 · 将 H≤E 的动量约束化成 3N 维球，并补上位置体积、Gibbs 修正与相空间量子。",
    symbols: [
      { symbol: "Φ(E,V,N)", meaning: "H≤E 的累计无量纲经典态数" },
      { symbol: "d=3N", meaning: "N 个三维粒子的独立动量维数" },
      { symbol: "h^{3N}", meaning: "使连续相空间计数无量纲的相空间单元" },
    ],
    prerequisites: ["d 维球体积", "理想气体 Hamiltonian", "全同粒子的 N! 修正"],
    assumptions: ["单原子、无相互作用、非相对论经典粒子", "盒内势能为零", "粒子全同且处于经典稀薄极限"],
    steps: [
      {
        title: "位置积分给出 V 的 N 次方",
        formula: "∫V d^{3N}q=V^N",
        explanation: "每个粒子的位置可独立遍历体积 V；理想气体没有位置相关势能。",
      },
      {
        title: "把能量约束识别成动量球",
        formula: "Σi pi²/(2m)≤E  ⇔  Σi pi²≤2mE",
        explanation: "3N 个动量分量组成半径 R=√(2mE) 的 3N 维球。",
      },
      {
        title: "代入高维球体积",
        formula: "Vp=π^{3N/2}(2mE)^{3N/2}/Γ(3N/2+1)=(2πmE)^{3N/2}/Γ(3N/2+1)",
        explanation: "能量的 3N/2 次幂来自球的维数，这一幂稍后直接决定平均能量。",
      },
      {
        title: "加入经典全同粒子计数因子",
        formula: "Φ=[1/(N!h^{3N})]V^N Vp",
        explanation: "h^{3N} 消除量纲，N! 去掉同一物理配置的标签排列重复计数。",
      },
    ],
    conclusion: "Φ(E,V,N)=[Vᴺ/(N!h³ᴺ)](2πmE)^{3N/2}/Γ(3N/2+1)",
    checks: ["Φ 必须无量纲", "对 E 的标度为 E^{3N/2}，对 V 的标度为 V^N", "涉及 N 导数时不能把 Γ 函数或 N! 藏进所谓常数"],
    evidence: gasEvidence,
  },

  [conceptFormulaKey("classical-gases", "从 Ω 一口气得到 U、CV、P")]: {
    id: "classical-ideal-gas-thermodynamics-from-entropy",
    title: "由同一个理想气体熵得到 U、CV 与 P",
    kind: "推导结果",
    origin: "Week 4 · 对理想气体累计态数取对数，并用微正则共轭偏导读取热力学量。",
    symbols: [
      { symbol: "U", meaning: "理想气体平均内能，此处等同平衡能量 E" },
      { symbol: "CV", meaning: "固定 V,N 的热容" },
      { symbol: "P", meaning: "压强" },
    ],
    prerequisites: ["理想气体态数 Φ", "S=kB lnΦ", "1/T=∂ES 与 P/T=∂VS"],
    assumptions: ["N≫1，忽略 O(lnN) 的有限尺寸项", "单原子三维经典理想气体", "固定粒子数"],
    steps: [
      {
        title: "保留与 E、V 有关的熵项",
        formula: "S=kBlnΦ=NkBlnV+(3N/2)kBlnE+terms independent of E,V",
        explanation: "N!、h 与 Γ 函数影响熵的完整常数和 N 依赖，但不影响这里的 E、V 偏导。",
      },
      {
        title: "能量偏导给温度",
        formula: "1/T=(∂S/∂E)V,N=3NkB/(2E)  ⇒  U=E=3NkBT/2",
        explanation: "3N 个动量二次自由度各贡献 kBT/2。",
      },
      {
        title: "对温度求导得到定容热容",
        formula: "CV=(∂U/∂T)V,N=3NkB/2",
        explanation: "经典模型中 U 与 T 线性，因此热容为常数。",
      },
      {
        title: "体积偏导给压强",
        formula: "P/T=(∂S/∂V)E,N=NkB/V  ⇒  PV=NkBT",
        explanation: "位置态数 V^N 的对数导数直接产生理想气体压强。",
      },
    ],
    conclusion: "U=3NkBT/2;  CV=3NkB/2;  PV=NkBT",
    checks: ["U 与 CV 都随 N 广延", "PV 与 NkBT 都有能量量纲", "量子低温区不能继续使用常数 CV"],
    evidence: gasEvidence,
  },

  [conceptFormulaKey("classical-gases", "从大系统中抽一个粒子：Boltzmann 因子")]: {
    id: "classical-bath-multiplicity-boltzmann-factor",
    title: "由热库态数比推出 Boltzmann 因子",
    kind: "近似",
    origin: "Week 4 · 把总系统视为微正则，指定小系统状态后数剩余热库的微观态。",
    symbols: [
      { symbol: "x", meaning: "小系统的一个微观状态" },
      { symbol: "εx", meaning: "状态 x 的能量" },
      { symbol: "Ωbath", meaning: "热库在剩余能量下的态数" },
    ],
    prerequisites: ["微正则等先验概率", "S=kB lnΩ", "一阶 Taylor 展开"],
    assumptions: ["热库远大于小系统", "εx 相对热库总能量很小", "系统—热库耦合能可忽略且总能量固定"],
    steps: [
      {
        title: "指定小系统状态后数热库",
        formula: "P(x)∝Ωbath(Etot−εx)",
        explanation: "总系统的每个微正则态等概率；与 x 相容的总态数就是热库的剩余态数。",
      },
      {
        title: "改写成热库熵",
        formula: "Ωbath(Etot−εx)=exp[Sbath(Etot−εx)/kB]",
        explanation: "对数态数是熵，把巨大的乘法计数变成可展开的状态函数。",
      },
      {
        title: "对小能量抽取作一阶展开",
        formula: "Sbath(Etot−εx)≈Sbath(Etot)−εx(∂Sbath/∂E)=Sbath(Etot)−εx/T",
        explanation: "二阶修正由热库有限热容控制，在无限大热库极限被忽略。",
      },
      {
        title: "丢掉与 x 无关的常数",
        formula: "P(x)∝exp[−εx/(kBT)]=exp[−βεx]",
        explanation: "共同因子最终由配分函数归一化；留下的相对权重就是 Boltzmann factor。",
      },
    ],
    conclusion: "P(x) ∝ Ωbath(E−εx) ≈ exp[−βεx]",
    checks: ["指数 βεx 必须无量纲", "能量更高的状态在正温度下权重更小", "小热库时必须保留二阶及更高修正"],
    evidence: gasEvidence,
  },

  [conceptFormulaKey("classical-gases", "Gibbs paradox：N! 不是装饰")]: {
    id: "classical-gibbs-corrected-partition-function",
    title: "为什么经典全同粒子配分函数要除 N!h^{3N}",
    kind: "定义",
    origin: "Week 4 · 从带标签的连续相空间积分修正为无量纲、无重复计数的经典全同粒子配分函数。",
    symbols: [
      { symbol: "ZN", meaning: "固定 N 的 canonical partition function" },
      { symbol: "dΓ", meaning: "d^{3N}q d^{3N}p" },
      { symbol: "N!", meaning: "同一物理配置的粒子标签排列数" },
    ],
    prerequisites: ["canonical Boltzmann 权重", "全同粒子计数", "相空间积分"],
    assumptions: ["经典稀薄极限", "粒子全同", "采用 h^{3N} 作为每个量子态对应的相空间单元"],
    steps: [
      {
        title: "先写带标签的连续状态积分",
        formula: "Z_labeled=∫d^{3N}q d^{3N}p e^{-βH}",
        explanation: "积分变量带有粒子标签，因此交换任意两个全同粒子会被当成不同点重复计算。",
      },
      {
        title: "用 h^{3N} 使状态计数无量纲",
        formula: "Z_dimensionless=Z_labeled/h^{3N}",
        explanation: "每个 q-p 对贡献 action 量纲；除以 h 的相应次幂后才能进入 lnZ。",
      },
      {
        title: "除去 N! 个标签排列",
        formula: "ZN=Z_labeled/(N!h^{3N})",
        explanation: "同一组无标签位置和动量有 N! 种标签排列；Gibbs 修正避免虚假混合熵并恢复广延性。",
      },
    ],
    conclusion: "ZN = (1/N!h³ᴺ)∫dΓ e^{-βH}",
    checks: ["ZN 必须无量纲", "若粒子可物理区分，不能机械地除同一个 N!", "对同种气体移除隔板不应产生宏观 mixing entropy"],
    evidence: gasEvidence,
  },

  [deepDiveFormulaKey("classical-gases", "期中 Q2：6N 维谐振子球体积", "Ωphase(E)=(2πE/ω)^{3N}/(3N)!")]: {
    id: "classical-oscillator-phase-volume-6n-ball",
    title: "N 个三维谐振子的 6N 维相空间球",
    kind: "推导结果",
    origin: "Week 4 深潜 · 期中 Q2；先作 Jacobian 为 1 的 canonical scaling，再使用 6N 维球体积。",
    symbols: [
      { symbol: "Ωphase", meaning: "尚未除 h^{3N} 的几何相空间体积" },
      { symbol: "ω", meaning: "各向同性谐振子角频率" },
      { symbol: "N", meaning: "固定在各自位置、彼此可区分的三维振子数" },
    ],
    prerequisites: ["谐振子 Hamiltonian", "变量缩放与 Jacobian", "d 维球体积"],
    assumptions: ["N 个独立同频三维 harmonic oscillators", "累计区域为 H≤E", "振子因固定位置而可区分，不除 N!"],
    steps: [
      {
        title: "作保持相空间测度的缩放",
        formula: "P=p/√(mω);  Q=√(mω)q;  dp dq=dP dQ",
        explanation: "p 与 q 的缩放因子互为倒数，所以每个 canonical pair 的 Jacobian 为 1。",
      },
      {
        title: "把 Hamiltonian 化成欧氏半径",
        formula: "H=(ω/2)Σ_{a=1}^{6N}Xa²≤E  ⇒  R²=2E/ω",
        explanation: "每个三维振子有 3 个 P 与 3 个 Q，总共 6N 个坐标。",
      },
      {
        title: "代入 6N 维球体积",
        formula: "V_{6N}(R)=π^{3N}R^{6N}/Γ(3N+1)=π^{3N}(2E/ω)^{3N}/(3N)!",
        explanation: "整理 π 与 2E/ω 的幂后得到题目所需的几何相空间体积。",
      },
    ],
    conclusion: "Ωphase(E)=(2πE/ω)^{3N}/(3N)!",
    checks: ["Ωphase 的量纲应为 action^{3N}", "维数是 6N 而不是 3N", "这是球体积，不是球面面积"],
    evidence: gasEvidence,
  },

  [deepDiveFormulaKey("classical-gases", "期中 Q2：6N 维谐振子球体积", "Γ(E)=Ωphase(E)/h^{3N};  S=kB lnΓ")]: {
    id: "classical-oscillator-dimensionless-count-entropy",
    title: "从几何相空间体积到无量纲态数与熵",
    kind: "定义",
    origin: "Week 4 深潜 · 期中 Q2；纠正对有量纲 Ωphase 直接取对数的问题。",
    symbols: [
      { symbol: "Γ(E)", meaning: "无量纲累计态数" },
      { symbol: "Ωphase(E)", meaning: "量纲为 action^{3N} 的相空间体积" },
      { symbol: "h^{3N}", meaning: "3N 个 canonical pairs 的相空间单元" },
    ],
    prerequisites: ["连续经典态计数", "Boltzmann entropy"],
    assumptions: [
      "振子彼此可区分，因此不额外除 N!",
      "h=2πℏ 是固定的 Planck constant；写 h 或 2πℏ 是同一物理 cell，不是可任意调节的 convention",
    ],
    steps: [
      {
        title: "检查几何体积量纲",
        formula: "[Ωphase]=[p q]^{3N}=action^{3N}",
        explanation: "对数的自变量必须无量纲，所以几何体积还不能直接放进 ln。",
      },
      {
        title: "除以相空间单元",
        formula: "Γ(E)=Ωphase(E)/h^{3N}",
        explanation: "每个 canonical pair 的 semiclassical cell 取 h=2πℏ；若把 cell 任意乘常数 c，熵会移位 −3NkBlnc，而不只是与 N 无关的常数。",
      },
      {
        title: "对无量纲计数取 Boltzmann 熵",
        formula: "S(E)=kBlnΓ(E)=kBln[Ωphase(E)/h^{3N}]",
        explanation: "在固定 N 时，cell 因子不依赖 E、V，所以由 E 或 V 导出的 T、C、P 不受影响；但它随 N 成比例，会进入化学势，不能在变粒子数问题中随意丢弃。",
      },
    ],
    conclusion: "Γ(E)=Ωphase(E)/h^{3N};  S=kB lnΓ",
    checks: ["Γ 必须无量纲", "h 与 2πℏ 完全相同，不能把 h 和 ℏ 当成只差任意 convention", "这些固定位置振子可区分，不能照搬理想气体的 N!", "只有固定 N 的 E、V 导数不受 cell 常数影响；μ 会受 N-dependent entropy shift 影响"],
    evidence: gasEvidence,
  },

  [conceptFormulaKey("canonical", "从微正则总系统切出正则子系统")]: {
    id: "canonical-weight-from-microcanonical-bath",
    title: "由微正则热库推出正则权重与 Z",
    kind: "近似",
    origin: "Week 5 · 总系统能量固定，小系统与巨大热库弱耦合；热库熵的一阶展开产生指数权重。",
    symbols: [
      { symbol: "Ei", meaning: "小系统第 i 个微观态能量" },
      { symbol: "pi", meaning: "该微观态的 canonical 概率" },
      { symbol: "Z", meaning: "所有 Boltzmann 权重的归一化和" },
    ],
    prerequisites: ["微正则等先验概率", "热库态数比", "熵的一阶 Taylor 展开"],
    assumptions: ["热库远大于小系统且温度近似不变", "系统—热库耦合能可忽略", "总系统达到平衡"],
    steps: [
      {
        title: "数与状态 i 相容的总微观态",
        formula: "pi∝Ωbath(Etot−Ei)=exp[Sbath(Etot−Ei)/kB]",
        explanation: "指定小系统状态后，唯一剩下的 multiplicity 来自热库。",
      },
      {
        title: "展开大热库熵",
        formula: "Sbath(Etot−Ei)≈Sbath(Etot)−Ei/T",
        explanation: "使用 ∂Sbath/∂E=1/T；忽略的二阶项随热库热容增大而变小。",
      },
      {
        title: "得到相对 Boltzmann 权重",
        formula: "pi∝e^{-Ei/(kBT)}=e^{-βEi}",
        explanation: "与 i 无关的 exp[Sbath(Etot)/kB] 会在归一化中消掉。",
      },
      {
        title: "定义归一化常数",
        formula: "Z=Σi e^{-βEi};  pi=e^{-βEi}/Z",
        explanation: "这样 Σi pi=1；Z 同时编码完整能谱。",
      },
    ],
    conclusion: "pi=e^{-βEi}/Z;  Z=Σi e^{-βEi}",
    checks: ["Σi pi=1", "βEi 无量纲", "正温度下低能态概率更大"],
    evidence: canonicalEvidence,
  },

  [conceptFormulaKey("canonical", "三种 Z 写法与防漏清单")]: {
    id: "canonical-partition-sum-trace-phase-integral",
    title: "量子 trace 的精确表示与经典相空间近似",
    kind: "定义",
    origin: "Week 5 · trace 与量子能量本征态求和严格等价；经典相空间积分则是高温、稀薄 Maxwell–Boltzmann / semiclassical 极限。",
    symbols: [
      { symbol: "Tr", meaning: "Hilbert 空间 trace" },
      { symbol: "Ĥ", meaning: "量子 Hamiltonian 算符" },
      { symbol: "dΓ", meaning: "经典 6N 维相空间测度" },
    ],
    prerequisites: ["Boltzmann 权重", "trace 的基不变性", "经典连续态计数"],
    assumptions: [
      "量子 trace 收敛，且能量本征态构成完备正交基",
      "经典表达只在高温、稀薄、交换量子效应可忽略的 Maxwell–Boltzmann / semiclassical 极限使用",
      "经典全同粒子采用 Gibbs 修正，Hamiltonian 对应指定系综控制量",
    ],
    steps: [
      {
        title: "从离散微观态归一化定义 Z",
        formula: "Z=Σstates e^{-βEstate}",
        explanation: "每个允许微观态贡献一个 Boltzmann 权重；若按能级合并，必须另乘简并度。",
      },
      {
        title: "在能量本征基写量子 trace",
        formula: "Tr(e^{-βĤ})=Σn⟨n|e^{-βĤ}|n⟩=Σn e^{-βEn}",
        explanation: "trace 在任意完备基相同；选能量本征基后就显式回到状态求和。",
      },
      {
        title: "在 semiclassical 极限把量子态和近似为 phase-space cells",
        formula: "Σquantum states ≈ [1/(N!h^{3N})]∫dΓ",
        explanation: "每个近经典量子态约占 h^{3N} 的相空间 cell，N! 去掉全同粒子标签重复；这是极限替换，不是任意温度下与量子 trace 的恒等式。",
      },
    ],
    conclusion: "Zquantum=Tr e^{-βĤ}=Σn e^{-βEn};  Zclassical≈1/(N!h³ᴺ)∫dΓ e^{-βH}",
    checks: ["两种 Z 都必须无量纲", "trace=本征态求和是精确等号，经典积分前是极限近似号", "按能级而非按状态求和时不要漏简并度", "经典全同粒子不要漏 N!h^{3N}"],
    evidence: [...canonicalEvidence, "Week 9 · 课件 7 slides 15–19（classical/quantum bridge）"],
  },

  [conceptFormulaKey("canonical", "ln Z 的导数机器")]: {
    id: "canonical-log-z-thermodynamic-generator",
    title: "从 Z 连续推出 F、U、S 与能量方差",
    kind: "推导结果",
    origin: "Week 5 · 正则分布的归一化、Shannon–Gibbs 熵与 β 导数共同组成 thermodynamic generator。",
    symbols: [
      { symbol: "Z", meaning: "正则配分函数" },
      { symbol: "F", meaning: "Helmholtz free energy" },
      { symbol: "U", meaning: "平均能量" },
      { symbol: "Var(E)", meaning: "能量方差" },
    ],
    prerequisites: ["pi=e^{-βEi}/Z", "概率平均", "对 β 求导"],
    assumptions: ["求 β 导数时保持 V,N 与 Hamiltonian 外参固定", "状态和与求导可交换", "Z 有限"],
    steps: [
      {
        title: "一阶 β 导数给平均能量",
        formula: "∂βlnZ=(1/Z)Σi(−Ei)e^{-βEi}=−Σi piEi=−U",
        explanation: "Z 的导数把每个权重拉下一个 −Ei；除以 Z 后正好成为概率平均。",
      },
      {
        title: "由 Gibbs entropy 得 F 与 S",
        formula: "S=−kBΣi pi lnpi=kB(lnZ+βU);  F=U−TS=−kBTlnZ",
        explanation: "将 lnpi=−βEi−lnZ 代入，归一化 Σpi=1 后即可整理。",
      },
      {
        title: "二阶 β 导数给方差",
        formula: "∂β²lnZ=−∂βU=⟨E²⟩−⟨E⟩²=Var(E)",
        explanation: "再次求导会产生二阶矩，并由 lnZ 的 quotient 结构减去平均值平方。",
      },
    ],
    conclusion: "F=−kBTlnZ; U=−∂βlnZ; S=kB(lnZ+βU); Var(E)=∂²βlnZ",
    checks: ["U 的 β 导数带负号", "Var(E) 必须非负", "F、U 的量纲为能量而 lnZ 无量纲"],
    evidence: canonicalEvidence,
  },

  [conceptFormulaKey("canonical", "能量涨落与 ensemble equivalence")]: {
    id: "canonical-relative-energy-fluctuation-scaling",
    title: "为什么宏观系统的相对能量涨落按 N^{-1/2} 消失",
    kind: "近似",
    origin: "Week 5 · 由能量涨落—热容关系和普通短程系统的广延性得到大 N 标度。",
    symbols: [
      { symbol: "σE", meaning: "√Var(E)，能量标准差" },
      { symbol: "U", meaning: "平均能量" },
      { symbol: "N", meaning: "粒子数或近独立子系统数" },
    ],
    prerequisites: ["Var(E)=kBT²CV", "广延量标度", "标准差"],
    assumptions: ["远离临界点的短程宏观系统", "U∝N 且 CV∝N", "不存在让涨落超广延的长程关联"],
    steps: [
      {
        title: "从配分函数二阶导数开始",
        formula: "Var(E)=∂β²lnZ=−∂βU",
        explanation: "第一步 ∂βlnZ=−U；再求一次 β 导数，就得到二阶累积量即能量方差。",
      },
      {
        title: "把 β 导数改写成温度导数",
        formula: "β=1/(kBT) ⇒ dT/dβ=−kBT² ⇒ −∂βU=kBT²(∂U/∂T)V,N",
        explanation: "链式法则中的两个负号抵消；这里保持 V、N 与 Hamiltonian 外参不变。",
      },
      {
        title: "识别定容热容",
        formula: "CV=(∂U/∂T)V,N ⇒ Var(E)=kBT²CV",
        explanation: "这一步把可测响应 CV 与微观能量涨落连接起来。",
      },
      {
        title: "使用热容的广延标度",
        formula: "CV∝N  ⇒  Var(E)∝N  ⇒  σE∝√N",
        explanation: "许多弱相关区域的独立涨落像随机和一样以平方根增长。",
      },
      {
        title: "除以广延平均能量",
        formula: "U∝N  ⇒  σE/U∝√N/N=N^{-1/2}",
        explanation: "绝对涨落随系统变大，但相对宏观尺度却趋于零。",
      },
    ],
    conclusion: "σE/U ∼ N^{-1/2}",
    checks: ["σE 自身不是随 N 消失，而是相对涨落消失", "临界点或长程相互作用下 CV 标度可能改变"],
    evidence: canonicalEvidence,
  },

  [conceptFormulaKey("canonical", "经典与量子谐振子：最重要的对照")]: {
    id: "canonical-quantum-oscillator-z-and-energy",
    title: "量子谐振子的几何级数与平均能量",
    kind: "推导结果",
    origin: "作业 2 Q2 直源 · 第一次学 Week 5 时先跳过；完成 Week 9–10 的量子语言、能级与量子系综桥后再回访。",
    symbols: [
      { symbol: "En=ℏω(n+1/2)", meaning: "一维量子谐振子能谱" },
      { symbol: "Zq,1", meaning: "单个一维量子谐振子的 canonical partition function" },
      { symbol: "Uq,1", meaning: "其平均能量" },
    ],
    prerequisites: ["量子谐振子能级", "无穷几何级数", "U=−∂βlnZ"],
    assumptions: ["独立一维量子谐振子", "ω 不随 T 改变", "β>0"],
    steps: [
      {
        title: "把零点能因子提出",
        formula: "Zq,1=Σn=0∞e^{-βℏω(n+1/2)}=e^{-βℏω/2}Σn=0∞(e^{-βℏω})^n",
        explanation: "相邻能级等间距，所以剩余求和是公比小于 1 的几何级数。",
      },
      {
        title: "求几何级数",
        formula: "Zq,1=e^{-βℏω/2}/(1−e^{-βℏω})",
        explanation: "β>0 时 e^{-βℏω}<1，级数收敛。",
      },
      {
        title: "对 lnZ 求 β 导数",
        formula: "lnZq,1=−βℏω/2−ln(1−e^{-βℏω})",
        explanation: "乘积取对数后变成两项，分别给零点能与热激发贡献。",
      },
      {
        title: "得到平均能量",
        formula: "Uq,1=−∂βlnZq,1=ℏω/2+ℏω/(e^{βℏω}−1)",
        explanation: "第一项与温度无关；第二项在低温冻结、高温恢复 classical kBT。",
      },
    ],
    conclusion: "Zq,1=e^{-βℏω/2}/(1−e^{-βℏω}); Uq,1=ℏω/2+ℏω/(e^{βℏω}−1)",
    checks: ["T→0 时 U→ℏω/2", "kBT≫ℏω 时热激发项趋 kBT", "零点能不随 T 变，因而不贡献热容"],
    evidence: ["作业 2 Q2", "problem-set-02-solution.pdf p. 3", "Week 9–10 · 量子桥后回访", "课件 7 slides 15–19"],
  },

  [conceptFormulaKey("grand-canonical", "四大系综只看“允许交换什么”")]: {
    id: "ensemble-control-variable-ladder",
    title: "从允许交换量识别四大系综",
    kind: "解题框架",
    origin: "Week 6 · 这条箭头链是控制条件导航，不是动力学时间演化公式。",
    symbols: [
      { symbol: "E,V,N", meaning: "能量、体积、粒子数" },
      { symbol: "T,P,μ", meaning: "与 E,V,N 共轭的温度、压强、化学势" },
    ],
    prerequisites: ["孤立、热、机械、粒子库的含义", "热力学共轭变量"],
    assumptions: ["各 reservoir 足够大，可把对应强度量视为固定", "系统与 reservoir 达到平衡"],
    steps: [
      {
        title: "没有交换时固定广延量",
        formula: "isolated: (E,V,N) fixed  ⇒  microcanonical",
        explanation: "孤立系统不与环境交换能量、体积功或粒子，使用固定能量壳。",
      },
      {
        title: "接热库时用 T 替换 E",
        formula: "heat bath: (E,V,N)→(T,V,N)  ⇒  canonical",
        explanation: "E 可以涨落，热库温度 T 成为外界控制量；相应生成函数是 Z。",
      },
      {
        title: "再允许体积或粒子交换",
        formula: "pressure bath: (T,V,N)→(T,P,N);  particle bath: (T,V,N)→(T,V,μ)",
        explanation: "前者得到 NPT/Gibbs canonical，后者得到 grand canonical；二者不是同一个系综。",
      },
    ],
    conclusion: "(E,V,N) → (T,V,N) → (T,P,N) or (T,V,μ)",
    checks: ["箭头表示改换控制条件，不表示系统必然按此时间顺序演化", "先圈题目固定量，再选 Ω、Z、Δ 或 Ξ"],
    evidence: grandEvidence,
  },

  [conceptFormulaKey("grand-canonical", "Gibbs canonical / NPT")]: {
    id: "npt-partition-gibbs-volume-derivative",
    title: "NPT 配分函数、Gibbs 自由能与平均体积",
    kind: "推导结果",
    origin: "Week 6 · 在 canonical Z(T,V,N) 外再对可涨落体积加权并积分。",
    symbols: [
      { symbol: "Δ(T,P,N)", meaning: "无量纲 NPT partition function" },
      { symbol: "V0", meaning: "与 T,P,N 无关的固定参考体积" },
      { symbol: "G", meaning: "Gibbs free energy" },
    ],
    prerequisites: ["canonical partition function", "压力功 PV", "对参数求导生成平均值"],
    assumptions: [
      "T,P,N 固定且 V>0，体积积分收敛、系统与压力库平衡",
      "采用固定且与 T,P,N 无关的 reference volume V0，因此 −β^{-1}∂P lnΔ 精确给该测度下的 ⟨V⟩",
      "把 −kBTlnΔ 认作宏观 Gibbs free energy 时忽略 O(lnN) 或 O(1) 的测度依赖有限尺寸项",
    ],
    steps: [
      {
        title: "给每个体积切片加压力库权重",
        formula: "weight(V)∝Z(T,V,N)e^{-βPV}",
        explanation: "系统能量已经由 Z 求和；外界维持压力 P 时，还要为体积功 PV 付出 Boltzmann 权重。",
      },
      {
        title: "对所有正体积求和并无量纲化",
        formula: "Δ(T,P,N)=∫₀∞(dV/V0)e^{-βPV}Z(T,V,N)",
        explanation: "dV/V0 使连续积分无量纲；固定 V0 只改变自由能的加法常数。",
      },
      {
        title: "定义对应热力学势",
        formula: "G=−kBTlnΔ",
        explanation: "NPT 的自然变量是 T,P,N。固定 V0 的选择会移动 Δ 的归一化、G 的参考项以及相应熵零点；它不改变热力学极限的广延主项。",
      },
      {
        title: "对压力求导拉下体积",
        formula: "∂PlnΔ=(1/Δ)∫(dV/V0)(−βV)e^{-βPV}Z=−β⟨V⟩",
        explanation: "与 canonical 中 −∂βlnZ=⟨E⟩ 完全同构。",
      },
      {
        title: "用理想气体看清有限 N 的 +1",
        formula: "ZN(V)∝V^N ⇒ Δ∝∫₀∞dV V^N e^{-βPV}=Γ(N+1)/(βP)^{N+1} ⇒ ⟨V⟩=(N+1)/(βP)",
        explanation: "在 dV/V0 这一测度下，有限 N 的精确均值不是 NkBT/P；只有 N→∞ 时 ⟨V⟩/N→kBT/P。这个 +1 是次广延测度修正，不是理想气体状态方程失效。",
      },
    ],
    conclusion: "Δ=∫₀∞(dV/V0)e^{-βPV}Z;  G=−kBTlnΔ;  ⟨V⟩=−β^{-1}∂PlnΔ",
    checks: ["Δ 必须无量纲", "∂P lnΔ 通常为负，因此所得 ⟨V⟩ 为正", "有限 N 理想气体在固定 dV/V0 测度下给 (N+1)kBT/P", "若采用含 P 的 prefactor 或别的体积测度，求导公式必须连该因子一起改变"],
    evidence: ["课件 5 slides 2–5", "作业 2 Q3", "David Tong Ch. 1.4"],
  },

  [conceptFormulaKey("grand-canonical", "巨正则权重与巨配分函数")]: {
    id: "grand-canonical-weight-and-partition-function",
    title: "由粒子库权重构造巨配分函数",
    kind: "推导结果",
    origin: "Week 6 · 系统同时与热库、粒子库交换 E 与 N；每个状态由 (N,i) 标记。",
    symbols: [
      { symbol: "Ξ", meaning: "grand partition function" },
      { symbol: "z=e^{βμ}", meaning: "活度" },
      { symbol: "ZN", meaning: "固定 N 的 canonical partition function" },
      { symbol: "EN,i", meaning: "N 粒子第 i 个微观态能量" },
    ],
    prerequisites: ["canonical Boltzmann 权重", "化学势", "按粒子数分组求和"],
    assumptions: ["T,V,μ 固定", "粒子交换达到化学平衡", "所有 N sector 的求和收敛"],
    steps: [
      {
        title: "写单个 (N,i) 状态的未归一化权重",
        formula: "wN,i=e^{-β(EN,i−μN)}=e^{βμN}e^{-βEN,i}",
        explanation: "从 reservoir 熵展开会同时产生 −βE 与 +βμN；增加粒子的能量代价由 μ 补偿。",
      },
      {
        title: "先在固定 N 内求和",
        formula: "Σi wN,i=e^{βμN}Σi e^{-βEN,i}=z^N ZN",
        explanation: "固定 N 的能量权重和正是 canonical ZN，活度只依赖 N。",
      },
      {
        title: "再对所有粒子数 sector 求和",
        formula: "Ξ=ΣN=0∞z^N ZN",
        explanation: "Ξ 是所有允许 N 与其微观态权重的总和，因此负责全局归一化。",
      },
      {
        title: "除以 Ξ 得概率",
        formula: "pN,i=wN,i/Ξ=e^{-β(EN,i−μN)}/Ξ",
        explanation: "直接求和可验证 ΣN,i pN,i=1。",
      },
    ],
    conclusion: "Ξ=ΣN=0∞ zᴺZN;  pN,i=e^{-β(EN,i−μN)}/Ξ",
    checks: ["grand sum 从 N=0 开始", "指数 β(EN,i−μN) 无量纲", "提高 μ 应提高大 N sector 的相对权重"],
    evidence: grandEvidence,
  },

  [conceptFormulaKey("grand-canonical", "ln Ξ 的导数机器")]: {
    id: "grand-log-xi-potential-number-fluctuation",
    title: "由 lnΞ 推出巨势、平均粒子数与方差",
    kind: "推导结果",
    origin: "Week 6 · 把 μ 看作生成粒子数矩的参数；bulk Euler relation 再给 ΦG=−PV。",
    symbols: [
      { symbol: "ΦG", meaning: "grand potential，避免与 Gibbs free energy G 混淆" },
      { symbol: "⟨N⟩", meaning: "平均粒子数" },
      { symbol: "VarN", meaning: "粒子数方差" },
    ],
    prerequisites: ["grand probability", "对 μ 求导", "热力学 Euler relation"],
    assumptions: ["求 μ 导数时 T,V 固定", "Ξ 有限且可逐项求导", "ΦG=−PV 只用于均匀广延 bulk thermodynamic limit"],
    steps: [
      {
        title: "定义巨势",
        formula: "ΦG=−kBTlnΞ=U−TS−μN",
        explanation: "这是从 U 对 S、N 作 Legendre transform 得到的 T,V,μ 势。",
      },
      {
        title: "一次 μ 导数给平均粒子数",
        formula: "∂μlnΞ=(1/Ξ)ΣN,i(βN)e^{-β(E−μN)}=β⟨N⟩",
        explanation: "μ 只在 +βμN 中出现，求导会把每一项拉下 βN。",
      },
      {
        title: "二次 μ 导数给方差",
        formula: "∂μ²lnΞ=β²[⟨N²⟩−⟨N⟩²]=β²VarN",
        explanation: "ln 的二阶导自动生成 connected second moment。",
      },
      {
        title: "对均匀广延系统使用 Euler relation",
        formula: "U=TS−PV+μN  ⇒  ΦG=U−TS−μN=−PV",
        explanation: "有限系统、表面显著系统或非广延系统可有边界修正，不能无条件使用。",
      },
    ],
    conclusion: "ΦG=−kBTlnΞ=−PV;  ⟨N⟩=β^{-1}∂μlnΞ;  VarN=β^{-2}∂²μlnΞ",
    checks: ["VarN 必须非负", "平均粒子数公式是正号", "先声明 ΦG 是巨势而不是 Gibbs free energy"],
    evidence: grandEvidence,
  },

  [conceptFormulaKey("grand-canonical", "经典理想气体与吸附位点")]: {
    id: "grand-classical-ideal-gas-xi-thermal-wavelength",
    title: "经典理想气体的 Ξ 与正确 thermal wavelength",
    kind: "推导结果",
    origin: "Week 6 · 从单粒子动量 Gaussian 得 λT，再将 ZN 的 exponential generating function 求和。",
    symbols: [
      { symbol: "λT", meaning: "thermal de Broglie wavelength" },
      { symbol: "z", meaning: "e^{βμ}" },
      { symbol: "Ξideal", meaning: "经典理想气体 grand partition function" },
    ],
    prerequisites: ["三维 Gaussian integral", "经典理想气体 ZN", "指数函数级数"],
    assumptions: ["三维非相对论经典稀薄气体", "Maxwell–Boltzmann 极限 nλT³≪1", "无内部简并；若有需另乘简并度"],
    steps: [
      {
        title: "计算单粒子动量积分",
        formula: "∫d³p e^{-βp²/(2m)}=(2πm/β)^{3/2}",
        explanation: "三个独立动量分量各给一个一维 Gaussian。",
      },
      {
        title: "定义 thermal wavelength 并写 ZN",
        formula: "λT=h/√(2πmkBT);  ZN=(1/N!)(V/λT³)^N",
        explanation: "1/λT³ 正是每单位体积的经典热相空间态密度；网页采用该方向，修正原答案倒写。",
      },
      {
        title: "对 N 求 grand sum",
        formula: "Ξ=ΣN=0∞[zV/λT³]^N/N!=exp(zV/λT³)",
        explanation: "N! 使这恰好成为指数函数的 Taylor series。",
      },
    ],
    conclusion: "Ξideal=exp(zV/λT³);  λT=h/√(2πmkBT)",
    checks: ["λT 随 T^{-1/2} 降低而不是升高", "zV/λT³ 必须无量纲", "由 lnΞ 可恢复 ⟨N⟩=zV/λT³ 与 PV=NkBT"],
    evidence: grandEvidence,
  },

  [conceptFormulaKey("interactions-vdw", "mean field：把邻居换成平均密度")]: {
    id: "vdw-mean-field-pair-energy",
    title: "均匀密度近似下的平均 pair interaction energy",
    kind: "近似",
    origin: "Week 7A · 用连续平均密度替代离散邻居和，并保留 1/2 避免 pair double count。",
    symbols: [
      { symbol: "Hint", meaning: "总 pair interaction energy" },
      { symbol: "ū≡ūsite=∫d³r Uattr(r)<0", meaning: "本站对吸引尾积分采用的带符号参数" },
      { symbol: "ūteacher=−ūsite>0", meaning: "老师课件若把 attraction strength 定义为正数时的对应参数" },
      { symbol: "n=N/V", meaning: "均匀数密度" },
    ],
    prerequisites: ["pair potential", "连续密度近似", "平移不变积分"],
    assumptions: ["bulk 系统近似均匀", "忽略 pair correlations 与边界效应", "空间积分只作用于可积的 attractive tail Uattr；发散硬核不塞进 ūsite，而由 excluded volume 另行处理"],
    steps: [
      {
        title: "从不重复计数的 pair 和开始",
        formula: "Hint=(1/2)Σi≠j Uattr(ri−rj)",
        explanation: "有序和会把 (i,j) 与 (j,i) 各算一次，所以前面必须有 1/2；其中恰有 N(N−1) 个有序 pair，而不是精确 N² 个。",
      },
      {
        title: "把离散粒子和换成平均密度积分",
        formula: "Hint≈[N(N−1)/(2V)]∫d³s Uattr(s)=N(N−1)ū/(2V)",
        explanation: "mean field 用 n(r)n(r′) 近似两点密度，忽略关联 hole 与 cluster。",
      },
      {
        title: "最后才取热力学极限并桥接课件符号",
        formula: "N(N−1)≈N²;  ū=ūsite=−ūteacher  ⇒  Hint≈N²ū/(2V)=−N²ūteacher/(2V)",
        explanation: "N² 是大 N 的 leading term；本站保留 attraction integral 的负号，若课件用正的 attraction strength，则两者相差一个负号。",
      },
    ],
    conclusion: "Hint ≈ N²ū/(2V)",
    checks: ["固定密度 N/V 时 Hint∝N，保持广延", "吸引占优时 ūsite<0，使平均相互作用能降低", "硬核势不可直接纳入这个发散积分", "N² 只是在 N≫1 后替代 N(N−1)"],
    evidence: interactionEvidence,
  },

  [conceptFormulaKey("interactions-vdw", "van der Waals 结构的正确推导")]: {
    id: "vdw-corrected-partition-to-equation-of-state",
    title: "从纠正后的 Z 推出 van der Waals 状态方程",
    kind: "近似",
    origin: "Week 7A · 结合 excluded volume 与均匀 mean-field attraction；显式修正旧期中答案的 β 和 V 次幂错误。",
    symbols: [
      { symbol: "Ωexcl", meaning: "一对粒子因硬核而禁止的相对坐标体积" },
      { symbol: "b=Ωexcl/2", meaning: "分摊到每粒子的 excluded-volume 参数" },
      { symbol: "ū≡ūsite=∫d³r Uattr(r)<0", meaning: "本站的带符号 attractive-tail integral" },
      { symbol: "ūteacher=−ū>0", meaning: "老师若以正数记录 attraction strength 时的参数" },
      { symbol: "a=−ū/2=ūteacher/2", meaning: "正的 van der Waals attraction parameter" },
    ],
    prerequisites: ["经典理想气体 ZN", "F=−kBTlnZ", "P=−∂VF"],
    assumptions: ["V−Nb>0", "硬核排斥只用 b=Ωexcl/2 与可用体积 V−Nb 表示，不放入 ū 的空间积分", "ū 只积分可积 attractive tail，并用均匀 mean field 表示", "忽略临界涨落与高阶 virial 项"],
    steps: [
      {
        title: "先保留有限 N 的 pair 数",
        formula: "ZN≈[(V−Nb)^N/(N!λT^{3N})]exp[−βN(N−1)ū/(2V)]",
        explanation: "N(N−1)/2 是不同 pair 的精确数量；interaction exponential 只出现一次。大 N 时才以 N² 替代 N(N−1)。",
      },
      {
        title: "取热力学极限并得到自由能",
        formula: "N(N−1)≈N²;  F=−kBTlnZN≈F_excluded+N²ū/(2V)",
        explanation: "−kBT 乘 −β 正好消去 β；原答案若在 F 中保留多余 β 就会量纲错误。",
      },
      {
        title: "固定 T,N 对 V 求导",
        formula: "P=−(∂F/∂V)T,N=NkBT/(V−Nb)+N²ū/(2V²)",
        explanation: "ū<0 时 interaction correction 为负，符合吸引降低压强。",
      },
      {
        title: "定义正参数 a 并整理",
        formula: "ū=−ūteacher;  a=−ū/2=ūteacher/2>0  ⇒  P=NkBT/(V−Nb)−aN²/V²",
        explanation: "本站把带符号积分记成 ū<0；若课件把 attraction strength 定义为正的 ūteacher，两套记号由显式负号桥接。",
      },
    ],
    conclusion: "[P+a(N/V)²](V−Nb)=NkBT（近似 van der Waals）",
    checks: ["每一项都必须有 pressure 量纲", "b=Ωexcl/2，不能把整对 excluded volume 重复分给每个粒子", "硬核不进入 ū；只积分 Uattr", "b→0、a→0 时恢复 PV=NkBT", "固定密度时 Fint=N²ū/(2V)∝N"],
    evidence: interactionEvidence,
  },

  [conceptFormulaKey("interactions-vdw", "临界点与响应函数发散")]: {
    id: "vdw-critical-inflection-and-number-fluctuation",
    title: "van der Waals 临界拐点与压缩率涨落",
    kind: "推导结果",
    origin: "Week 7A · critical isotherm 的水平拐点让 κT 发散，并通过 grand-canonical response 连接到 VarN。",
    symbols: [
      { symbol: "κT", meaning: "−(1/V)(∂V/∂P)T,N" },
      { symbol: "n", meaning: "⟨N⟩/V" },
      { symbol: "VarN", meaning: "粒子数方差" },
    ],
    prerequisites: ["van der Waals equation", "拐点条件", "grand-canonical number response"],
    assumptions: ["使用 mean-field van der Waals equation", "讨论均匀 bulk system", "真正无限发散只在 thermodynamic limit"],
    steps: [
      {
        title: "把临界等温线定义为水平拐点",
        formula: "(∂P/∂V)T=0;  (∂²P/∂V²)T=0 at (Tc,Vc)",
        explanation: "临界点是气液两个极值合并的位置，一阶和二阶体积导数同时为零。",
      },
      {
        title: "斜率消失使压缩率增大",
        formula: "κT=−(1/V)(∂V/∂P)T,N=−1/[V(∂P/∂V)T,N]",
        explanation: "当稳定侧的等温线斜率趋近 0−，其倒数趋于正无穷。",
      },
      {
        title: "把 μ response 写成压缩率",
        formula: "dP=n dμ at fixed T  ⇒  (∂N/∂μ)T,V=Vn²κT",
        explanation: "Gibbs–Duhem 在恒温下给 dP=n dμ；再用 n=N/V 和 κT 的定义换元。",
      },
      {
        title: "使用粒子数涨落—响应关系",
        formula: "VarN=kBT(∂N/∂μ)T,V  ⇒  VarN/⟨N⟩=n kBTκT",
        explanation: "因此临界压缩率增强直接对应宏观密度涨落增强。",
      },
    ],
    conclusion: "(∂VP)Tc=0; (∂²VP)Tc=0;  VarN/⟨N⟩=n kBTκT",
    checks: ["稳定单相区 κT>0", "有限系统只出现大峰而非真正无穷", "偏导固定量必须写清"],
    evidence: interactionEvidence,
  },

  [conceptFormulaKey("interactions-vdw", "相共存、潜热与 Clausius–Clapeyron")]: {
    id: "phase-coexistence-clausius-clapeyron",
    title: "由两相化学势相等推出 Clausius–Clapeyron",
    kind: "推导结果",
    origin: "Week 7A · 沿 coexistence curve，两相化学势始终相等；比较其 Gibbs differential 得曲线斜率。",
    symbols: [
      { symbol: "ΔS,ΔV", meaning: "相 2 减相 1 的熵与体积差" },
      { symbol: "L=TΔS", meaning: "相变潜热" },
      { symbol: "Pcoex(T)", meaning: "两相共存压力" },
    ],
    prerequisites: ["chemical potential", "Gibbs differential", "相平衡条件"],
    assumptions: ["一阶相变，两相处于热、机械、化学平衡", "沿 coexistence curve 准静态移动", "ΔV≠0"],
    steps: [
      {
        title: "写每粒子 Gibbs differential",
        formula: "dμ=−s dT+v dP",
        explanation: "对单组分相，μ 是 molar/particle Gibbs free energy，s 与 v 是对应熵和体积。",
      },
      {
        title: "保持两相化学势相等",
        formula: "μ1(T,P)=μ2(T,P)  ⇒  dμ1=dμ2",
        explanation: "沿共存线移动后仍要满足 chemical equilibrium。",
      },
      {
        title: "相减并解共存线斜率",
        formula: "−s1dT+v1dP=−s2dT+v2dP  ⇒  dP/dT=Δs/Δv",
        explanation: "同样可用总熵、总体积的相变差写成 ΔS/ΔV。",
      },
      {
        title: "用潜热替换熵跃变",
        formula: "L=TΔS  ⇒  dPcoex/dT=ΔS/ΔV=L/(TΔV)",
        explanation: "L、ΔS、ΔV 必须采用相同的每粒子、每摩尔或总量 convention。",
      },
    ],
    conclusion: "dPcoex/dT = ΔS/ΔV = L/(TΔV)",
    checks: ["L 与 TΔS 的单位一致", "ΔS 与 ΔV 必须使用相同归一化", "液气转变通常 ΔV>0、L>0，因此 vapor-pressure slope 为正"],
    evidence: ["课件 6 slide 9", "David Tong Ch. 5.1"],
  },

  [conceptFormulaKey("phase-transition", "Ising 模型把 collective order 压到 ±1")]: {
    id: "ising-hamiltonian-and-magnetization",
    title: "Ising Hamiltonian 与序参量的建模来源",
    kind: "模型",
    origin: "Week 7B · 用 σi=±1 的最小局域变量编码两态自由度，再加入最近邻耦合和外场。",
    symbols: [
      { symbol: "σi=±1", meaning: "格点 i 的 Ising spin" },
      { symbol: "J", meaning: "最近邻 coupling；J>0 偏好同向" },
      { symbol: "h", meaning: "与总磁化线性耦合的外场" },
      { symbol: "m", meaning: "每格点平均 magnetization" },
    ],
    prerequisites: ["离散两态变量", "pair interaction", "统计平均"],
    assumptions: ["只保留 σi=±1 两个局域状态", "采用最近邻、均匀 J 与均匀 h", "pair sum ⟨ij⟩ 每对只计一次"],
    steps: [
      {
        title: "写单个最近邻 pair 的能量",
        formula: "Eij=−Jσiσj",
        explanation: "J>0 时同向自旋给 −J、反向给 +J，因此 ferromagnetic interaction 偏好一致排列。",
      },
      {
        title: "对所有不同最近邻 pair 求和并加外场",
        formula: "H=−JΣ⟨ij⟩σiσj−hΣiσi",
        explanation: "第一项编码 cooperative order，第二项让 h>0 偏好 σ=+1。若 pair sum 有序计两次，需另补 1/2。",
      },
      {
        title: "定义能检测集体有序的平均量",
        formula: "m=(1/N)Σi⟨σi⟩",
        explanation: "h=0 时高温相 m=0；低温 thermodynamic limit 可自发选择 m>0 或 m<0。",
      },
    ],
    conclusion: "H=−JΣ⟨ij⟩σiσj−hΣiσi;  m=(1/N)Σi⟨σi⟩",
    checks: ["h=0 时 H 对所有 σi→−σi 不变", "J、h 都有能量量纲", "说明 pair sum convention，避免把每对算两次"],
    evidence: transitionEvidence,
  },

  [conceptFormulaKey("phase-transition", "mean-field decoupling 与自洽方程")]: {
    id: "ising-mean-field-self-consistency",
    title: "由 mean-field decoupling 推出 Ising 自洽方程",
    kind: "近似",
    origin: "Week 7B · 用平均磁化替代邻居的瞬时涨落，并要求算出的单自旋平均重新等于 m。",
    symbols: [
      { symbol: "m", meaning: "待自洽确定的平均磁化" },
      { symbol: "z", meaning: "每个格点的最近邻数" },
      { symbol: "heff=h+zJm", meaning: "mean-field effective field" },
    ],
    prerequisites: ["Ising Hamiltonian", "单自旋 partition function", "双曲函数"],
    assumptions: ["忽略二阶 connected fluctuation δσiδσj", "空间均匀 m", "采用每对最近邻只计一次的 convention"],
    steps: [
      {
        title: "围绕平均值分解每个自旋",
        formula: "σi=m+δσi;  σiσj=m²+mδσi+mδσj+δσiδσj",
        explanation: "mean field 的唯一近似发生在下一步丢弃二阶 fluctuation product。",
      },
      {
        title: "忽略二阶涨落并整理",
        formula: "σiσj≈mσi+mσj−m²",
        explanation: "用 δσ=σ−m 代回后得到该形式；−m² 是防止平均贡献重复计算的常数修正。",
      },
      {
        title: "得到单自旋有效场",
        formula: "HMF=−(h+zJm)Σiσi+(NzJm²/2)",
        explanation: "每个自旋的 z 个邻居都以平均 m 作用；常数项不影响单自旋概率但影响 free energy。",
      },
      {
        title: "计算单自旋平均并施加自洽",
        formula: "Z1=2cosh(βheff);  ⟨σ⟩=[e^{βheff}−e^{-βheff}]/Z1=tanh(βheff)=m",
        explanation: "输入 mean field 的 m 必须等于在该 effective field 下输出的平均磁化。",
      },
    ],
    conclusion: "m = tanh[β(h+zJm)]",
    checks: ["h=0 时 m=0 永远是一个解", "高温 βzJ<1 时只有 m=0 稳定", "不要漏 decoupling 中的 −m²"],
    evidence: transitionEvidence,
  },

  [conceptFormulaKey("phase-transition", "临界附近展开与响应")]: {
    id: "ising-mean-field-critical-exponents",
    title: "mean-field 的磁化与 susceptibility 临界标度",
    kind: "近似",
    origin: "Week 7B · 在 h=0、m 很小的 Tc 邻域展开 Ising mean-field 自洽方程。",
    symbols: [
      { symbol: "Tc=zJ/kB", meaning: "mean-field 临界温度" },
      { symbol: "χ=(∂m/∂h)h→0", meaning: "零场 susceptibility" },
      { symbol: "βcrit=1/2", meaning: "不要与逆温度 β 混淆的 mean-field 临界指数" },
    ],
    prerequisites: ["m=tanh[β(h+zJm)]", "tanh Taylor 展开", "隐函数求导"],
    assumptions: ["|m|≪1、|h| 很小且 T 接近 Tc", "mean-field approximation", "只保留最低非零阶"],
    steps: [
      {
        title: "零场下展开 tanh",
        formula: "m=tanh(βzJm)≈βzJm−(βzJm)^3/3",
        explanation: "临界附近 m 小，五次及更高阶只给次领先修正。",
      },
      {
        title: "解非零磁化分支",
        formula: "m²≈3(βzJ−1)/(βzJ)^3",
        explanation: "βzJ=Tc/T，因此从低温侧 βzJ−1≈(Tc−T)/Tc。",
      },
      {
        title: "读取磁化临界指数",
        formula: "m∝(Tc−T)^{1/2}",
        explanation: "这是 mean-field 结果；低维精确临界指数可不同。",
      },
      {
        title: "隐式求导得到两侧都适用的响应",
        formula: "χ=β(1−m²)(1+zJχ) ⇒ χ=β(1−m²)/[1−βzJ(1−m²)]",
        explanation: "在 h=0 的自洽解上 sech²[βzJm]=1−tanh²[βzJm]=1−m²；这一步不能在低温侧误把 m 设为 0。",
      },
      {
        title: "从高温无序侧逼近 Tc",
        formula: "T>Tc: m=0 ⇒ χ+=β/(1−βzJ)=1/[kB(T−Tc)]",
        explanation: "利用 zJ=kBTc，分母正比 T−Tc，因此高温侧的 mean-field 临界指数 γ=1。",
      },
      {
        title: "从低温有序侧逼近 Tc",
        formula: "T<Tc: m²≈3(βzJ−1)/(βzJ)^3 ⇒ χ−≈1/[2kB(Tc−T)]",
        explanation: "把非零 m 分支代回通式后，分母的 leading term 是高温侧的两倍；两侧指数同为 1，但 mean-field 振幅比 χ+/χ−=2。",
      },
    ],
    conclusion: "m∼(Tc−T)^{1/2};  χ∼|T−Tc|^{-1}  (mean field)",
    checks: ["m 只在 T<Tc 的自发有序侧取非零实解", "临界指数是 mean-field 值，不可宣称所有维数精确", "βcrit 与逆温度 β 是不同对象"],
    evidence: transitionEvidence,
  },

  [conceptFormulaKey("phase-transition", "Landau free energy：只保留对称性允许的幂")]: {
    id: "landau-free-energy-symmetry-expansion",
    title: "Landau 自由能密度的对称性展开与稳定极小值",
    kind: "模型",
    origin: "Week 7B · 在连续相变附近把小序参量自由能写成解析低阶多项式；它是 phenomenological expansion。",
    symbols: [
      { symbol: "m", meaning: "标量序参量" },
      { symbol: "f=F/N", meaning: "每格点（或每单位体积）的 Landau 自由能密度" },
      { symbol: "a0(T−Tc)", meaning: "在 Tc 变号的二次系数" },
      { symbol: "b", meaning: "保证四次截断稳定的正系数" },
      { symbol: "h", meaning: "与 m 共轭的外场" },
    ],
    prerequisites: ["Taylor expansion", "m→−m symmetry", "极值与二阶导稳定性"],
    assumptions: ["Tc 附近 |m| 小且 f 对 m 解析", "h=0 时系统有 m→−m 对称", "b>0；若 b≤0 必须保留更高偶次项"],
    steps: [
      {
        title: "按小序参量作一般解析展开",
        formula: "f(m)=F(m)/N=f0+c1m+c2m²+c3m³+c4m⁴+...",
        explanation: "m 是每格点磁化，所以最自然的是展开 intensive 的 f=F/N；这只是局域低阶描述，不等于从微观 Hamiltonian 精确求出全部自由能。",
      },
      {
        title: "用零场 Z2 对称性删去奇次项",
        formula: "h=0: f(m)=f(−m)  ⇒  c1=c3=...=0",
        explanation: "外场破坏该对称性，并通过自由能密度中的 −hm 倾斜势形；等价的总自由能耦合是 −Nhm。",
      },
      {
        title: "让二次项在 Tc 变号并保留稳定四次项",
        formula: "c2=a0(T−Tc);  c4=b>0",
        explanation: "T>Tc 时正二次曲率稳定 m=0；T<Tc 时二次项变负，四次项阻止自由能无界下降。",
      },
      {
        title: "用极值方程确认相结构",
        formula: "∂f/∂m=2a0(T−Tc)m+4bm³−h=0",
        explanation: "h=0、T<Tc 时 m²=−a0(T−Tc)/(2b)，还需检查 ∂²f/∂m²>0。",
      },
    ],
    conclusion: "f(m)=F(m)/N=f0+a0(T−Tc)m²+b m⁴−hm+…",
    checks: ["若改写总自由能，外场项必须是 −Nhm", "h=0 时只含偶次幂", "最高保留阶系数必须使 f 有下界", "stationary point 不等于 stable minimum，必须检查曲率"],
    evidence: transitionEvidence,
  },

  [conceptFormulaKey("phase-transition", "lattice gas 与 Ising 是同一数学骨架")]: {
    id: "lattice-gas-ising-variable-map",
    title: "从 occupation 变量映射到 Ising spin",
    kind: "恒等式",
    origin: "Week 7B · 作业 2 Q4；用线性变量替换把 ni=0,1 映成 σi=−1,+1。",
    symbols: [
      { symbol: "ni∈{0,1}", meaning: "格点 i 的空/占据变量" },
      { symbol: "σi∈{−1,+1}", meaning: "对应的 Ising spin" },
      { symbol: "n̄", meaning: "平均 occupation" },
      { symbol: "m=⟨σ⟩", meaning: "平均 magnetization" },
    ],
    prerequisites: ["二值变量", "统计平均的线性性"],
    assumptions: ["每格点最多占据一个粒子", "使用 ni=0↔σi=−1、ni=1↔σi=+1 的 convention"],
    steps: [
      {
        title: "求连接两个二值集合的线性函数",
        formula: "ni=A+Bσi;  0=A−B;  1=A+B",
        explanation: "要求 σ=−1 映到 0、σ=+1 映到 1；两条线性方程唯一确定 A、B。",
      },
      {
        title: "解出映射及逆映射",
        formula: "A=B=1/2  ⇒  ni=(1+σi)/2;  σi=2ni−1",
        explanation: "代入两个端点可直接验证。",
      },
      {
        title: "对映射取统计平均",
        formula: "n̄=⟨ni⟩=[1+⟨σi⟩]/2=(1+m)/2",
        explanation: "平均的线性性把 lattice gas 密度序参量直接连接到 Ising magnetization。",
      },
    ],
    conclusion: "ni=(1+σi)/2;  n̄=(1+m)/2",
    checks: ["σ=−1 给 n=0，σ=+1 给 n=1", "m=0 对应 half filling n̄=1/2"],
    evidence: transitionEvidence,
  },

  [deepDiveFormulaKey("phase-transition", "Ginzburg–Landau 与超导只读到哪", "f_s=f_n+α(T)|ψ|²+[β(T)/2]|ψ|⁴+[1/(2m*)]|(−iℏ∇−e*A/c)ψ|²+B²/(8π)")]: {
    id: "ginzburg-landau-superconductor-free-energy-density",
    title: "超导 Ginzburg–Landau 自由能各项从何而来",
    kind: "模型",
    origin: "Week 7B 深潜 · 课件 slides 22–24；由局域相变展开、空间刚度与 gauge coupling 组成的 phenomenological model。",
    symbols: [
      { symbol: "ψ(r)", meaning: "复超导序参量" },
      { symbol: "m*,e*", meaning: "Cooper pair 的有效质量与电荷" },
      { symbol: "A,B", meaning: "vector potential 与 magnetic field" },
      { symbol: "α(T),β(T)", meaning: "Landau expansion coefficients；这里 β(T) 不是逆温度" },
    ],
    prerequisites: ["Landau symmetry expansion", "复场 modulus", "gradient energy 的概念"],
    assumptions: ["序参量在 coherence length 尺度上缓慢变化", "接近超导转变温度", "四次截断要求 β(T)>0；若 β(T)≤0，必须加入正的 |ψ|⁶ 或更高偶次项才能稳定", "公式采用 Gaussian electromagnetic units，SI 写法不同"],
    steps: [
      {
        title: "从均匀 Landau 局域能开始",
        formula: "f_local=f_n+α(T)|ψ|²+[β(T)/2]|ψ|⁴",
        explanation: "自由能必须对全局相位 ψ→e^{iφ}ψ 不变，所以最低阶只依赖 |ψ|²；在 β(T)>0 时四次项负责稳定，否则该截断本身不稳定。",
      },
      {
        title: "加入空间变化与电磁 gauge coupling",
        formula: "f_grad=[1/(2m*)]|(−iℏ∇−e*A/c)ψ|²",
        explanation: "普通 |∇ψ|² 在电磁场下改成 gauge-covariant derivative；它惩罚序参量幅度或相位的快速空间变化。",
      },
      {
        title: "加入磁场自身能量",
        formula: "f_field=B²/(8π)",
        explanation: "这是 Gaussian units 的磁场能密度；不能与 SI 的 B²/(2μ0) 混用。",
      },
      {
        title: "将三个物理来源相加",
        formula: "fs=flocal+fgrad+ffield",
        explanation: "对 ψ* 与 A 变分会给 GL 序参量方程和超电流响应，但本课主线只需认清每项角色。",
      },
    ],
    conclusion: "f_s=f_n+α(T)|ψ|²+[β(T)/2]|ψ|⁴+[1/(2m*)]|(−iℏ∇−e*A/c)ψ|²+B²/(8π)",
    checks: ["每一项都是能量密度", "四次截断必须有 β(T)>0；否则补正的 |ψ|⁶ 或更高项", "m*、e* 中的星号属于符号名称", "β(T) 是 GL 系数，不是 1/(kBT)"],
    evidence: ["课件 6 slides 22–24"],
  },

  [deepDiveFormulaKey("phase-transition", "Ginzburg–Landau 与超导只读到哪", "ψ(r)=|ψ(r)|e^{iθ(r)}")]: {
    id: "complex-order-parameter-polar-form",
    title: "复序参量的幅度—相位分解",
    kind: "恒等式",
    origin: "Week 7B 深潜 · 将每个非零复数序参量写成 polar form，以分离凝聚强度和相位信息。",
    symbols: [
      { symbol: "|ψ(r)|", meaning: "非负幅度；平方代表局域凝聚强度" },
      { symbol: "θ(r)", meaning: "局域复相位" },
    ],
    prerequisites: ["复数的 Cartesian 与 polar form", "Euler formula"],
    assumptions: ["ψ(r)≠0 时相位局域可定义", "相位只定义到 2π 的整数倍"],
    steps: [
      {
        title: "把复场拆成实部和虚部",
        formula: "ψ(r)=ψR(r)+iψI(r)",
        explanation: "每个空间点上的序参量都是一个复数。",
      },
      {
        title: "定义幅度与相位",
        formula: "|ψ|=√(ψR²+ψI²);  θ=atan2(ψI,ψR)",
        explanation: "atan2 保留象限信息；在 ψ=0 的点相位不可定义。",
      },
      {
        title: "使用 Euler formula 重组",
        formula: "e^{iθ}=cosθ+i sinθ  ⇒  ψ=|ψ|e^{iθ}",
        explanation: "幅度控制凝聚强度，相位梯度则与超流/超导电流相关。",
      },
    ],
    conclusion: "ψ(r)=|ψ(r)|e^{iθ(r)}",
    checks: ["|ψ|²=ψ*ψ", "θ→θ+2πn 不改变 ψ", "ψ=0 的 vortex core 处相位可出现奇点"],
    evidence: ["课件 6 slides 22–24"],
  },

  [conceptFormulaKey("midterm-review", "一张系综总表先拿定义分")]: {
    id: "midterm-ensemble-solution-pipeline",
    title: "从控制条件到可求导势的考场路线",
    kind: "解题框架",
    origin: "Week 8 · 期中 Q1；这是一条组织答案的逻辑链，不是数值等式。",
    symbols: [
      { symbol: "Ω/Z/Δ/Ξ", meaning: "四类控制条件对应的统计生成对象" },
      { symbol: "S/F/G/ΦG", meaning: "对应热力学势" },
    ],
    prerequisites: ["四大系综控制量", "partition function", "热力学势自然变量"],
    assumptions: ["题目处于平衡统计物理范围", "先明确 classical/quantum 与粒子可区分性"],
    steps: [
      {
        title: "圈出题目控制量",
        formula: "fixed (E,V,N)/(T,V,N)/(T,P,N)/(T,V,μ)",
        explanation: "控制量先决定可允许的涨落，避免看到关键词就抓错公式。",
      },
      {
        title: "选择系综和生成对象",
        formula: "micro→Ω; canonical→Z; NPT→Δ; grand→Ξ",
        explanation: "同时写清概率权重和 normalization；经典连续积分补全 N!h^{3N}。",
      },
      {
        title: "从生成对象得到势",
        formula: "S=kBlnΩ; F=−kBTlnZ; G=−kBTlnΔ; ΦG=−kBTlnΞ",
        explanation: "不同势的自然变量与题目固定量匹配。",
      },
      {
        title: "最后用导数取得输出量",
        formula: "potential derivative → average/response/fluctuation",
        explanation: "求导前标注保持量，结果后做单位、极限和符号检查。",
      },
    ],
    conclusion: "constraint → ensemble → partition → potential → derivative",
    checks: ["grand canonical 的求和从 N=0 开始", "经典 Z 不漏 N!h^{3N}", "G 与 grand potential 不混名"],
    evidence: midtermEvidence,
  },

  [conceptFormulaKey("midterm-review", "高维球题统一模板")]: {
    id: "midterm-d-dimensional-ball-volume",
    title: "用 Gaussian 积分推导 d 维球体积",
    kind: "恒等式",
    origin: "Week 8 · 期中 Q2 模板；任何 quadratic Hamiltonian 化球后都调用这一几何公式。",
    symbols: [
      { symbol: "Vd(R)", meaning: "d 维半径 R 球的体积" },
      { symbol: "Sd−1", meaning: "d−1 维单位球面的面积" },
      { symbol: "Γ", meaning: "Gamma function" },
    ],
    prerequisites: ["一维 Gaussian integral", "d 维 spherical coordinates", "Gamma function"],
    assumptions: ["d>0，通常 d 为正整数", "Euclidean norm r²=Σixi²", "R≥0"],
    steps: [
      {
        title: "用 Cartesian factorization 算 d 维 Gaussian",
        formula: "Id=∫R^d d^dx e^{-r²}=[∫_{−∞}^{∞}e^{-x²}dx]^d=π^{d/2}",
        explanation: "指数分成 d 个独立平方项，所以积分是 √π 的 d 次方。",
      },
      {
        title: "再用 spherical coordinates 算同一积分",
        formula: "Id=Sd−1∫₀∞r^{d−1}e^{-r²}dr=(Sd−1/2)Γ(d/2)",
        explanation: "令 u=r² 后径向积分变成 Gamma function。",
      },
      {
        title: "比较两式得到单位球面面积",
        formula: "Sd−1=2π^{d/2}/Γ(d/2)",
        explanation: "两种坐标计算的是同一个 Id。",
      },
      {
        title: "对半径积分得到球体积",
        formula: "Vd(R)=∫₀^R Sd−1r^{d−1}dr=π^{d/2}R^d/Γ(d/2+1)",
        explanation: "使用 Γ(d/2+1)=(d/2)Γ(d/2) 整理。",
      },
    ],
    conclusion: "Vd(R)=π^{d/2}R^d/Γ(d/2+1)",
    checks: ["d=2 给 πR²", "d=3 给 4πR³/3", "不要把 Sd−1 与 Vd 混用"],
    evidence: midtermEvidence,
  },

  [conceptFormulaKey("midterm-review", "几何级数 + chemical equilibrium")]: {
    id: "midterm-bosonic-mode-mean-and-variance",
    title: "单 bosonic mode 的平均占据与 bunching 方差",
    kind: "推导结果",
    origin: "Week 8 · 期中 Q3；把允许 n=0,1,... 的单 mode grand sum 化成几何级数。",
    symbols: [
      { symbol: "q=e^{-β(ℏω−μ)}", meaning: "单 mode 几何级数公比" },
      { symbol: "n̄", meaning: "平均 occupation number" },
      { symbol: "Var n", meaning: "occupation-number variance" },
    ],
    prerequisites: ["无穷几何级数", "grand partition function", "q d/dq 生成 n"],
    assumptions: ["Boson occupation n=0,1,...", "μ<ℏω 因而 0<q<1", "mode 之间独立"],
    steps: [
      {
        title: "对单 mode 的所有 occupation 求和",
        formula: "Ξmode=e^{-βℏω/2}Σn=0∞q^n=e^{-βℏω/2}/(1−q)",
        explanation: "零点能只给共同因子；与 occupation 统计有关的是 1/(1−q)。",
      },
      {
        title: "用 q 导数求一阶矩",
        formula: "n̄=q∂qlnΞmode=q/(1−q)=1/[e^{β(ℏω−μ)}−1]",
        explanation: "q∂q 会给每个 q^n 拉下 n。",
      },
      {
        title: "再求一次得到 connected second moment",
        formula: "Var n=q∂q n̄=q/(1−q)²",
        explanation: "grand-canonical cumulant derivative 自动减去平均值平方。",
      },
      {
        title: "改写成 n̄ 的形式",
        formula: "q/(1−q)²=[q/(1−q)][1/(1−q)]=n̄(1+n̄)",
        explanation: "额外的 1+n̄ 体现 Boson bunching，方差大于 Poisson 值 n̄。",
      },
    ],
    conclusion: "n̄=1/(e^{β(ℏω−μ)}−1);  Var n=n̄(1+n̄)",
    checks: ["收敛条件 μ<ℏω", "Var n>n̄", "不要把 μ 当频率；此处 μ 与 ℏω 都是能量"],
    evidence: midtermEvidence,
  },

  [conceptFormulaKey("midterm-review", "mean-field van der Waals 与 critical fluctuation")]: {
    id: "midterm-corrected-vdw-pressure",
    title: "期中 Q4 的纠正版 mean-field 压强",
    kind: "近似",
    origin: "Week 8 · 对旧 marking scheme 做量纲与 V 导数纠错；沿用 Week 7A 的 excluded-volume + mean-field 路线。",
    symbols: [
      { symbol: "b=Ωexcl/2", meaning: "pair excluded volume 的一半，即每粒子参数" },
      { symbol: "ū≡ūsite=∫d³r Uattr(r)<0", meaning: "本站只对 attractive tail 积分的带符号参数" },
      { symbol: "ūteacher=−ū>0", meaning: "老师课件采用正 attraction strength 时的对应记号" },
      { symbol: "a=−ū/2=ūteacher/2", meaning: "常用正 attraction parameter" },
    ],
    prerequisites: ["纠正后的 van der Waals Z", "F=−kBTlnZ", "P=−∂VF"],
    assumptions: ["V>Nb", "硬核由 b=Ωexcl/2 单独处理，ū 只积分 Uattr", "均匀 mean field", "interaction exponential 只出现一次", "忽略更高阶 correlation"],
    steps: [
      {
        title: "先按真实 pair 数写两种修正",
        formula: "ZN≈[(V−Nb)^N/(N!λT^{3N})]exp[−βN(N−1)ū/(2V)]",
        explanation: "排斥缩小可用体积；N(N−1)/2 个不同 pair 的吸引只贡献一个总 interaction-energy Boltzmann factor。",
      },
      {
        title: "取大 N 极限、对数并恢复能量量纲",
        formula: "N(N−1)≈N²;  F=−kBTlnZN≈F_excluded+N²ū/(2V)",
        explanation: "N² 是 thermodynamic-limit leading term；β 在 −kBTlnZ 中被消掉，若 Fint 仍带 β 就不是能量。",
      },
      {
        title: "对 V 求导得到两项压强",
        formula: "P=−(∂F/∂V)T,N=NkBT/(V−Nb)+N²ū/(2V²)",
        explanation: "ū<0 时第二项为负；定义 a=−ū/2 后得到熟悉的 −aN²/V²。",
      },
      {
        title: "连接临界涨落检查",
        formula: "ū=−ūteacher;  a=−ū/2=ūteacher/2;  VarN/⟨N⟩=n kBTκT",
        explanation: "先桥接老师的正 attraction-strength 记号，再用状态方程变平→κT 增大检查 grand-canonical density fluctuation。",
      },
    ],
    conclusion: "P=NkBT/(V−Nb)+N²ū/(2V²)",
    checks: ["ū<0 时 interaction correction 降低 P", "b=Ωexcl/2 且硬核不进入 ū 的积分", "N² 只在 N≫1 后替代 N(N−1)", "a 不得含 N 或 V", "a,b→0 时恢复理想气体"],
    evidence: midtermEvidence,
  },
};
