export type PhaseKey =
  "foundation" | "classical" | "quantum" | "nonequilibrium" | "review";

export type ConceptCard = {
  title: string;
  label: string;
  core?: boolean;
  intuition: string;
  explanation: string[];
  formula?: string;
  formulaNote?: string;
  steps?: string[];
  example?: {
    question: string;
    solution: string[];
  };
  pitfalls?: string[];
  check?: {
    question: string;
    answer: string;
  };
};

export type DeepDive = {
  title: string;
  summary: string;
  paragraphs: string[];
  formulas?: string[];
};

export type PracticeItem = {
  title: string;
  instruction: string;
  answer: string;
  source?: string;
};

export type StudyModule = {
  id: string;
  phase: PhaseKey;
  phaseLabel: string;
  week: string;
  title: string;
  english: string;
  hoursCore: number;
  hoursFull: number;
  goal: string;
  why: string;
  prerequisites: string[];
  outcomes: string[];
  sourceRefs: string[];
  concepts: ConceptCard[];
  deepDives: DeepDive[];
  practice: PracticeItem[];
  gate: {
    prompt: string;
    criteria: string[];
  };
};

export const phaseMeta: Record<
  PhaseKey,
  { label: string; short: string; color: string; description: string }
> = {
  foundation: {
    label: "第 0 阶段 · 前置桥梁",
    short: "前置",
    color: "amber",
    description:
      "把后面会反复用到的数学、概率、热力学和力学语言先变成熟悉工具。",
  },
  classical: {
    label: "第一阶段 · 经典统计物理",
    short: "经典",
    color: "blue",
    description: "从相空间与 Liouville 定理走到三大系综、相变和期中考试。",
  },
  quantum: {
    label: "第二阶段 · 量子统计",
    short: "量子",
    color: "violet",
    description: "先补量子语言，再掌握密度矩阵、Bose 气体和 Fermi 气体。",
  },
  nonequilibrium: {
    label: "第三阶段 · 非平衡",
    short: "非平衡",
    color: "teal",
    description: "从随机游走走到扩散、Langevin 方程与 Fokker–Planck 方程。",
  },
  review: {
    label: "第四阶段 · 总复习",
    short: "复习",
    color: "rose",
    description: "用三套作业和期中评分标准反推答题模板，完成闭环。",
  },
};

export const syllabus = [
  {
    week: "Week 1",
    topic: "Thermodynamics and introduction to statistical approach in physics",
    chinese: "热力学回顾与统计方法入门",
  },
  {
    week: "Week 2",
    topic: "Statistical formalism of classical system and ensemble theory",
    chinese: "经典系统的统计形式与系综理论",
  },
  {
    week: "Week 3",
    topic: "Microcanonical ensemble",
    chinese: "微正则系综",
  },
  {
    week: "Week 4",
    topic: "Statistical interpretation for the laws of thermodynamics",
    chinese: "热力学定律的统计解释",
  },
  {
    week: "Week 5",
    topic: "Canonical ensemble",
    chinese: "正则系综",
  },
  {
    week: "Week 6",
    topic: "Grand canonical ensemble",
    chinese: "巨正则系综（课件还含 Gibbs 正则系综）",
  },
  {
    week: "Week 7",
    topic: "Phase transition",
    chinese: "相互作用与相变",
  },
  {
    week: "Week 8",
    topic: "Revision for classical statistical mechanics and mid-term exam",
    chinese: "经典统计物理复习与期中考试",
  },
  {
    week: "Week 9",
    topic: "Statistical formalism for quantum system",
    chinese: "量子系统的统计形式",
  },
  {
    week: "Week 10",
    topic: "Quantum microcanonical, canonical, and grand canonical ensemble",
    chinese: "量子系综与全同粒子统计",
  },
  {
    week: "Week 11",
    topic: "Ideal Bose gas",
    chinese: "理想 Bose 气体",
  },
  {
    week: "Week 12",
    topic: "Ideal Fermi gas",
    chinese: "理想 Fermi 气体",
  },
  {
    week: "Week 13",
    topic:
      "Out of equilibrium: Diffusion, Langevin theory and Fokker–Planck equation",
    chinese: "非平衡：扩散、Langevin 理论与 Fokker–Planck 方程",
  },
  {
    week: "Week 14",
    topic: "Revision week for quantum statistical mechanics",
    chinese: "量子统计物理复习",
  },
];

export const notationAlerts = [
  {
    symbol: "Ω(E)",
    teacher: "微正则系综中可访问微观态数（multiplicity）。",
    other:
      "有些书把相空间体积写作 Γ(E)，把态密度写作 ω(E)；不要只看字母，要看定义。",
  },
  {
    symbol: "Z",
    teacher: "正则配分函数（canonical partition function）。",
    other: "几乎所有教材一致；连续经典系统要记住 1/(N!h³ᴺ)。",
  },
  {
    symbol: "Q / Ξ",
    teacher: "课件和作业常用 Q 表示巨配分函数。",
    other: "多数教材写 Ξ；网页统一写 Ξ（老师记号 Q）。",
  },
  {
    symbol: "G / ΦG",
    teacher: "部分课件把巨势写成 G = −kBT ln Q。",
    other:
      "标准热力学里 G 通常是 Gibbs 自由能；网页把巨势写成 ΦG 或 ΩG，避免混淆。",
  },
  {
    symbol: "β",
    teacher: "β = 1/(kBT)，不是热膨胀系数。",
    other: "看到 e⁻ᵝᴱ 时，先检查指数是否无量纲。",
  },
  {
    symbol: "ρ",
    teacher: "经典部分可指相空间概率密度；量子部分指密度算符/密度矩阵。",
    other: "同一个字母在两个语境中对象不同，但都负责描述“对微观态的不确定性”。",
  },
];

export const formulaMap = [
  {
    family: "语言",
    name: "逆温度",
    formula: "β = 1/(kBT)",
    use: "把温度写进 Boltzmann 因子；几乎贯穿全课程。",
    warning: "β 的量纲是 1/能量。",
  },
  {
    family: "微正则",
    name: "Boltzmann 熵",
    formula: "S(E,V,N) = kB ln Ω(E,V,N)",
    use: "从“数状态”连接到热力学。",
    warning: "Ω 是态数/相空间体积，不是能量本身。",
  },
  {
    family: "微正则",
    name: "三条共轭关系",
    formula: "1/T = (∂S/∂E)V,N;  P/T = (∂S/∂V)E,N;  −μ/T = (∂S/∂N)E,V",
    use: "由熵求温度、压强、化学势。",
    warning: "偏导下标说明保持谁不变，不能省略理解。",
  },
  {
    family: "动力学",
    name: "Liouville 方程",
    formula: "∂tρ + {ρ,H} = 0",
    use: "说明 Hamilton 流下相空间概率像不可压缩流体。",
    warning: "它不等于系统会自动达到平衡；还需粗粒化/遍历性等思想。",
  },
  {
    family: "正则",
    name: "Boltzmann 分布",
    formula: "pi = e^(−βEi) / Z",
    use: "已知 T、V、N 时求微观态概率。",
    warning: "Z 负责归一化，不能漏。",
  },
  {
    family: "正则",
    name: "配分函数",
    formula: "Z = Σi e^(−βEi)  或  Z = [1/(N!h³ᴺ)]∫d³Np d³Nq e^(−βH)",
    use: "正则系综的“总生成器”。",
    warning: "全同经典粒子要有 Gibbs 修正 N!；相空间积分要除 h³ᴺ。",
  },
  {
    family: "正则",
    name: "自由能与平均能量",
    formula: "F = −kBT ln Z;  U = −∂β ln Z",
    use: "从 Z 快速得到热力学量。",
    warning: "求 ∂β 时通常保持 V、N 不变。",
  },
  {
    family: "涨落",
    name: "能量涨落",
    formula: "Var(E) = ∂²β ln Z = kBT²CV",
    use: "连接热容与微观能量波动。",
    warning: "宏观系统相对涨落约为 1/√N，小但不是绝对为零。",
  },
  {
    family: "NPT",
    name: "Gibbs 正则系综",
    formula: "Δ(T,P,N) = ∫(dV/V0) e^(−βPV) Z(T,V,N);  G = −kBT ln Δ",
    use: "温度、压强、粒子数固定而体积涨落。",
    warning:
      "连续 V 积分需约定参考体积/测度；它只影响 G 的加法常数。也不要把 Δ 与微小变化符号混为一谈。",
  },
  {
    family: "巨正则",
    name: "巨配分函数",
    formula: "Ξ = ΣN e^(βμN) ZN = Σstates e^[−β(E−μN)]",
    use: "T、V、μ 固定而 E、N 都可涨落。",
    warning: "老师常写 Q；活度 z = e^(βμ)。",
  },
  {
    family: "巨正则",
    name: "巨势与粒子数",
    formula: "ΦG = −kBT ln Ξ = −PV;  ⟨N⟩ = (1/β)∂μ ln Ξ",
    use: "从 Ξ 求压强、平均粒子数和粒子涨落。",
    warning:
      "ΦG=−PV 假定均匀、广延的 bulk thermodynamic limit；巨势也不是 Gibbs 自由能，虽然部分课件都写 G。",
  },
  {
    family: "量子统计",
    name: "Bose–Einstein / Fermi–Dirac 占据数",
    formula: "n̄i = gi / [e^(β(εi−μ)) ∓ 1]",
    use: "上方减号给 Boson，下方加号给 Fermion。",
    warning: "最常见错误就是把 ± 号记反；记“Boson 能挤在一起，所以分母更小”。",
  },
  {
    family: "Bose",
    name: "三维理想气体 BEC 临界温度",
    formula: "Tc = [2πℏ²/(mkB)] [n/ζ(3/2)]^(2/3)",
    use: "判断固定粒子数的三维非相对论 Bose 气体何时凝聚。",
    warning: "只对相应色散、维数和热力学极限成立。",
  },
  {
    family: "Fermi",
    name: "Fermi 波矢与 Fermi 能",
    formula: "kF = (6π²n/gs)^(1/3);  εF = ℏ²kF²/(2m)",
    use: "T = 0 时从粒子密度填满单粒子态。",
    warning: "gs 是自旋简并度；电子通常 gs = 2。",
  },
  {
    family: "扩散",
    name: "扩散方程与均方位移",
    formula: "∂tP = D∇²P;  ⟨|Δr|²⟩ = 2dDt",
    use: "从概率密度描述随机游走的宏观扩散。",
    warning: "d 是空间维数，不是微分符号。",
  },
  {
    family: "涨落耗散",
    name: "Langevin 与 Einstein 关系",
    formula: "mṽ = −γv + ξ(t);  D = kBT/γ;  ⟨ξ(t)ξ(t′)⟩ = 2γkBT δ(t−t′)",
    use: "把阻尼与热噪声放在同一个动力学模型中。",
    warning: "噪声均值为零不代表每一时刻的随机力为零。",
  },
  {
    family: "非平衡",
    name: "一维 Fokker–Planck 方程",
    formula: "∂tP = −∂x[A(x)P] + ½∂x²[B(x)P]",
    use: "从随机轨迹转到概率分布的确定性演化。",
    warning: "A 是漂移，B 是噪声二阶强度；不同噪声约定会改变系数写法。",
  },
];

export const glossary = [
  [
    "微观态 microstate",
    "系统每个自由度的完整微观配置；经典里是相空间一点，量子里是 Hilbert 空间中的态。",
  ],
  [
    "宏观态 macrostate",
    "只用 E、V、N、T、P 等少数宏观量描述的状态；一个宏观态通常对应海量微观态。",
  ],
  [
    "相空间 phase space",
    "所有广义坐标 q 和共轭动量 p 组成的空间；N 个三维粒子通常有 6N 维。",
  ],
  [
    "系综 ensemble",
    "满足同一宏观约束的一大群“系统副本”的概念集合，用它做概率平均。",
  ],
  ["简并度 degeneracy", "具有同一能量的不同单粒子或多粒子状态数。"],
  ["态密度 density of states", "单位能量区间内可用状态的数量，常写 g(ε)。"],
  ["熵 entropy", "在微正则语境中衡量兼容宏观约束的微观态数量；S = kB ln Ω。"],
  [
    "配分函数 partition function",
    "对允许状态的 Boltzmann 权重求和；是正则系综的归一化常数与热力学生成器。",
  ],
  [
    "化学势 chemical potential",
    "在给定熵和体积等约束下增加一个粒子的能量代价；也控制粒子交换方向。",
  ],
  ["活度 fugacity", "z = e^(βμ)，让巨正则公式更紧凑。"],
  [
    "热力学极限",
    "N,V → ∞ 且 N/V 固定；在此极限中不同系综通常给出相同宏观结果。",
  ],
  [
    "涨落 fluctuation",
    "微观量相对其平均值的随机偏离；方差是最基本的强度指标。",
  ],
  [
    "序参量 order parameter",
    "无序相为零、有序相非零的宏观量，例如 Ising 磁化强度 m。",
  ],
  [
    "响应函数 response function",
    "系统对外部微小扰动的响应，例如热容、磁化率、压缩率；临界点附近可发散。",
  ],
  [
    "密度矩阵 density matrix",
    "同时表示经典概率混合与量子态的算符；满足 Hermitian、正定、迹为 1。",
  ],
  ["Boson", "多粒子波函数交换对称、同一单粒子态可容纳任意多个粒子的粒子。"],
  ["Fermion", "多粒子波函数交换反对称、服从 Pauli 不相容原理的粒子。"],
  [
    "详细平衡 detailed balance",
    "平衡时任意两状态之间的正反跃迁概率流彼此抵消。",
  ],
  ["漂移 drift", "概率分布因确定性力或平均速度产生的定向运动。"],
  ["扩散 diffusion", "随机运动使概率分布展宽并趋向均匀的过程。"],
];

export const materials = [
  {
    id: "L1",
    label: "课件 1",
    href: "/materials/lecture-01.pptx",
    bilingualHref: "/materials/lecture-01_中英逐页精讲.pptx",
    pages: "25 张原始页",
    maps: "Week 1",
    note: "课程要求、热力学回顾、动理学与 Maxwell–Boltzmann",
  },
  {
    id: "L2",
    label: "课件 2",
    href: "/materials/lecture-02.pptx",
    bilingualHref: "/materials/lecture-02_中英逐页精讲.pptx",
    pages: "16 张原始页",
    maps: "Week 2",
    note: "相空间、系综、Liouville、时间反演与遍历性",
  },
  {
    id: "L3",
    label: "课件 3",
    href: "/materials/lecture-03.pptx",
    bilingualHref: "/materials/lecture-03_中英逐页精讲.pptx",
    pages: "27 张原始页",
    maps: "Week 3–4",
    note: "微正则、两能级、理想气体、Gibbs paradox",
  },
  {
    id: "L4",
    label: "课件 4",
    href: "/materials/lecture-04.pptx",
    bilingualHref: "/materials/lecture-04_中英逐页精讲.pptx",
    pages: "13 张原始页",
    maps: "Week 5",
    note: "正则系综、两能级、理想气体、equipartition",
  },
  {
    id: "L5",
    label: "课件 5",
    href: "/materials/lecture-05.pptx",
    bilingualHref: "/materials/lecture-05_中英逐页精讲.pptx",
    pages: "13 张原始页",
    maps: "Week 5–6",
    note: "slides 2–7 延续正则；slides 8–13 进入巨正则",
  },
  {
    id: "L6",
    label: "课件 6",
    href: "/materials/lecture-06.pptx",
    bilingualHref: "/materials/lecture-06_中英逐页精讲.pptx",
    pages: "29 张原始页",
    maps: "Week 7",
    note: "van der Waals、Ising、Landau、超导与一维 Ising",
  },
  {
    id: "L7",
    label: "课件 7",
    href: "/materials/lecture-07.pptx",
    bilingualHref: "/materials/lecture-07_中英逐页精讲.pptx",
    pages: "19 张原始页",
    maps: "Week 8–9",
    note: "经典总结、量子形式、密度矩阵、量子系综",
  },
  {
    id: "L8",
    label: "课件 8",
    href: "/materials/lecture-08.pptx",
    bilingualHref: "/materials/lecture-08_中英逐页精讲.pptx",
    pages: "19 张原始页",
    maps: "Week 10",
    note: "全同粒子、BE/FD/MB 统计与占据数",
  },
  {
    id: "L9",
    label: "课件 9",
    href: "/materials/lecture-09.pptx",
    bilingualHref: "/materials/lecture-09_中英逐页精讲.pptx",
    pages: "35 张原始页",
    maps: "Week 11–12",
    note: "BEC、光子、声子、Fermi 气体与 Pauli 顺磁",
  },
  {
    id: "L10",
    label: "课件 10",
    href: "/materials/lecture-10.pptx",
    bilingualHref: "/materials/lecture-10_中英逐页精讲.pptx",
    pages: "18 张原始页",
    maps: "Week 13",
    note: "Brownian、扩散、Langevin、Fokker–Planck",
  },
  {
    id: "PS1",
    label: "作业 1",
    href: "/materials/problem-set-01.pdf",
    pages: "2 pages",
    maps: "Week 1–4",
    note: "Q2 直接对应 Week 1 MB；其余覆盖 Liouville、微正则气体与振子",
  },
  {
    id: "PS1S",
    label: "作业 1 答案",
    href: "/materials/problem-set-01-solution.pdf",
    pages: "12 pages",
    maps: "Week 1–4",
    note: "做完再看；含数处已在勘误区纠正的符号/归一化问题",
  },
  {
    id: "PS2",
    label: "作业 2",
    href: "/materials/problem-set-02.pdf",
    pages: "3 pages",
    maps: "Week 5–7；Q2 衔接 Week 10",
    note: "正则振子、巨正则吸附、lattice gas/Ising；量子振子按正式计划属 Week 10",
  },
  {
    id: "PS2S",
    label: "作业 2 答案",
    href: "/materials/problem-set-02-solution.pdf",
    pages: "10 pages",
    maps: "Week 5–7；Q2 衔接 Week 10",
    note: "文件名原本未标 Solution，经逐页核对确为答案；内含需避开的公式错误",
  },
  {
    id: "PS3",
    label: "作业 3",
    href: "/materials/problem-set-03.pdf",
    pages: "4 pages",
    maps: "Week 9–12",
    note: "密度矩阵、量子统计、Bose 与 Fermi 气体",
  },
  {
    id: "PS3S",
    label: "作业 3 答案",
    href: "/materials/problem-set-03-solution.pdf",
    pages: "19 pages",
    maps: "Week 9–12",
    note: "含 Fourier 与多维 Gaussian 的长推导",
  },
  {
    id: "MID",
    label: "2025 期中评分答案",
    href: "/materials/midterm-2025-solution.pdf",
    pages: "12 pages",
    maps: "Week 1–8",
    note: "4 题 × 25 分；是最直接的答题格式证据",
  },
];

export const readings = [
  {
    level: "主参考 · 本地",
    title: "David Tong — Statistical Physics",
    href: "/readings/david-tong-statistical-physics.pdf",
    route:
      "Ch. 4 热力学 → Ch. 1 系综 → Ch. 2 经典气体 → Ch. 5 相变 → Ch. 3 量子气体",
    why: "和本课覆盖高度重合，解释清楚且官方开放；不要从第 1 页硬啃，按网页节点跳读。",
  },
  {
    level: "非平衡参考 · 本地",
    title: "Daniel Arovas — Thermodynamics and Statistical Mechanics",
    href: "/readings/arovas-thermodynamics-statistical-mechanics.pdf",
    route:
      "只读 Ch. 9 的 Brownian motion、Langevin 与 Fokker–Planck（约原书 520 页后）",
    why: "体积很大，不是主线教材；仅用于 Week 13 查缺补漏。",
  },
  {
    level: "老师课件列出 · 按需查阅",
    title: "Mehran Kardar — Statistical Physics of Particles (2007)",
    href: "https://www.cambridge.org/highereducation/books/statistical-physics-of-particles/3CC2F33BD9F8DC56758DBDDB5B870558",
    route:
      "概率与热力学 → classical statistical mechanics → interacting particles → quantum statistical mechanics",
    why: "课件 1 slides 4、7、9 明确展示；适合 Week 1–3 查概念与完整推导，不要求整本顺读。",
  },
  {
    level: "老师课件列出 · 标准查表",
    title:
      "R. K. Pathria & Paul D. Beale — Statistical Mechanics, 4th ed. (2021)",
    href: "https://shop.elsevier.com/books/statistical-mechanics/pathria/978-0-08-102692-2",
    route: "Ch. 1–4 三大系综；Ch. 5–8 量子、Bose/Fermi；Ch. 12 相变",
    why: "课件 1 slide 7 列出；内容完整但密度高，优先用来核对定义、公式适用条件和高阶扩展。",
  },
  {
    level: "老师课件列出 · 课程概览",
    title: "Kerson Huang — Introduction to Statistical Physics (2009)",
    href: "https://www.routledge.com/Introduction-to-Statistical-Physics/Huang/p/book/9781420079029",
    route: "按当前学习树同名主题查阅，不作为第一遍主线",
    why: "课件 1 slide 6 用它概括课程范围；适合建立全景，不适合在基础薄弱时连续硬读。",
  },
  {
    level: "老师课件列出 · 传统严谨路线",
    title: "Kerson Huang — Statistical Mechanics, 2nd ed.",
    href: "https://www.wiley-vch.de/en/areas-interest/natural-sciences/statistical-mechanics-978-0-471-81518-1",
    route:
      "classical ensembles → quantum statistics → Bose/Fermi → Ising/Landau",
    why: "课件 1 slide 7 与课件 3 slide 23 引用；老师评价为旧式但好，适合推导查证，不宜作为零基础第一读物。",
  },
  {
    level: "老师课件列出 · 最友好补读",
    title:
      "S. J. Blundell & K. M. Blundell — Concepts in Thermal Physics, 2nd ed.",
    href: "https://academic.oup.com/book/26407",
    route:
      "Ch. 4 Boltzmann factor；Ch. 5–6 MB/压强；Ch. 14–22 熵、热力学势与配分函数",
    why: "课件 1 slide 21 引用；直觉、例题与课程前半衔接友好，是卡在 Week 1–5 时最优先的老师书单补读。",
  },
  {
    level: "老师课件列出 · 前置复习",
    title: "Halliday, Resnick & Walker — Fundamentals of Physics, 10th ed.",
    href: "https://bcs.wiley.com/he-bcs/Books?action=contents&bcsId=8262&itemId=1118230728",
    route: "只查 Ch. 18 热与第一定律、Ch. 19 气体动理学、Ch. 20 熵与第二定律",
    why: "课件 1 slide 24 引用；只负责修补普通物理前置，不承担统计系综主线。",
  },
  {
    level: "视频/讲义 · 在线",
    title: "MIT OCW 8.333 — Statistical Mechanics I",
    href: "https://ocw.mit.edu/courses/8-333-statistical-mechanics-i-statistical-mechanics-of-particles-fall-2013/",
    route: "L1–6 前置；L12–18 经典系综与相互作用；L20–25 量子统计",
    why: "有讲义、视频、作业和考试；难度略高，卡住时按主题选看，不做整门替代。",
  },
  {
    level: "零基础补课 · 在线",
    title: "OpenStax University Physics Vol. 2 — Thermodynamics",
    href: "https://openstax.org/books/university-physics-volume-2/pages/3-introduction",
    route: "先读 system/equilibrium，再读 first law、processes、second law",
    why: "当课件默认你已经熟悉热、功、状态函数时，用它补最底层直觉。",
  },
];

export const assessmentMap = [
  {
    id: "PS1-Q1",
    title: "作业 1 · Q1 Liouville 与最大熵",
    prerequisites: "Jacobian、Hamilton 方程、泛函/普通 Lagrange multiplier",
    target: "phase-ensemble",
    method:
      "写出小时间映射 → 展开 Jacobian → 用 Hamilton 方程抵消散度 → 同时加归一化/平均能量约束得到 ρ=e⁻ᵝᴴ/Z；结果反向预告 Week 5 canonical",
  },
  {
    id: "PS1-Q2",
    title: "作业 1 · Q2 重力场中的 Maxwell–Boltzmann（Week 1 直接考点）",
    prerequisites: "连续概率、Gaussian 积分、equipartition、方差",
    target: "classical-gases",
    method:
      "写单粒子能量 → ρ ∝ e⁻ᵝε → 对速度积分得 n(z) → 用 Z 的导数或 Gaussian 矩求平均",
  },
  {
    id: "PS1-Q3",
    title: "作业 1 · Q3 一维相对论理想气体",
    prerequisites: "微正则态数、Stirling、热力学偏导",
    target: "classical-gases",
    method:
      "先声明累计体积 Γ(E) 还是壳密度 ω(E)，并用 hᴺ 无量纲化 → S=kBlnΩ → 从 dS 系数读 T、P、μ → 求热容和边缘分布",
  },
  {
    id: "PS1-Q4",
    title: "作业 1 · Q4 等间距能级的微正则振子",
    prerequisites: "stars and bars、Stirling、组合数",
    target: "microcanonical",
    method:
      "把量子数当球、分隔符当墙 → 数 Ω → 取 ln 与 Stirling → 求 E(T)、C 与单振子分布",
  },
  {
    id: "PS2-Q1",
    title: "作业 2 · Q1 经典谐振子（正则）",
    prerequisites: "多维 Gaussian、配分函数导数",
    target: "canonical",
    method:
      "分离 p/q 积分 → 求 Z → F/U/S/C → 验证动能与势能各贡献 kBT/2 每二次自由度",
  },
  {
    id: "PS2-Q2",
    title: "作业 2 · Q2 量子谐振子（计划 Week 10；期中已出现同结构）",
    prerequisites: "几何级数、能级、低温/高温极限",
    target: "quantum-bridge",
    method:
      "先完成量子桥，再回用 Week 5 的 Z 流水线：能级谱 → 单振子几何级数 → N 次方 → −∂β ln Z → C 与 p(n)；不要在 ket、能级和 ℏ 尚陌生时硬做",
  },
  {
    id: "PS2-Q3",
    title: "作业 2 · Q3 吸附粒子的巨正则模型",
    prerequisites: "二项式、巨配分函数、化学平衡",
    target: "grand-canonical",
    method:
      "数 C(N,M) → 求 Ξ → 用 ∂μ ln Ξ 求平均和方差 → 令吸附相与气相 μ 相等",
  },
  {
    id: "PS2-Q4",
    title: "作业 2 · Q4 lattice gas → Ising",
    prerequisites: "变量替换、mean field、tanh 展开、Landau 展开",
    target: "phase-transition",
    method:
      "ni=(1+σi)/2 → 识别 J/H → 忽略二阶涨落 → 自洽方程 → 临界附近 Taylor 展开",
  },
  {
    id: "PS3-Q1",
    title: "作业 3 · Q1 谐振子密度矩阵",
    prerequisites: "量子谐振子、Hermite、多维 Gaussian、Fourier、trace",
    target: "quantum-bridge",
    method:
      "谱分解 → Fourier 把导数变乘法 → 二维 Gaussian → 取 trace 求 Z → 再算 ⟨x²⟩ 与 U",
  },
  {
    id: "PS3-Q2",
    title: "作业 3 · Q2 BE/FD 量子统计",
    prerequisites: "全同粒子、占据数、几何级数、巨正则",
    target: "quantum-statistics",
    method:
      "把每个单粒子态独立因子化 → Boson 求无限和、Fermion 求两项和 → 导数得平均占据",
  },
  {
    id: "PS3-Q3",
    title: "作业 3 · Q3 任意色散 Bose 气体",
    prerequisites: "态密度、连续极限、Bose 函数、分部积分",
    target: "bose-gas",
    method: "Σk→积分 → 无量纲化 → 求 ΦG/P/U/N → z→1 找 Tc → 对 U 求导得热容",
  },
  {
    id: "PS3-Q4",
    title: "作业 3 · Q4 二维 Fermi 气体",
    prerequisites: "二维态密度、Fermi 面、Sommerfeld 展开",
    target: "fermi-gas",
    method: "数 k 空间状态 → εF → 固定 N 解 μ(T) → 求 ΦG/U/P → 低温展开热容",
  },
  {
    id: "MID-Q1",
    title: "期中 · Q1 定义与热力学连接",
    prerequisites: "Liouville、Z/Ξ、F 与全微分",
    target: "midterm-review",
    method:
      "概念句先答原因，再写完整积分（含 N!h³ᴺ），最后用 dF = −SdT−PdV 取偏导",
  },
  {
    id: "MID-Q2",
    title: "期中 · Q2 微正则谐振子",
    prerequisites: "canonical transformation、6N 维球、Stirling、边缘分布",
    target: "midterm-review",
    method:
      "尺度变换成球 → 求 Ω → S → E/C → 对剩余 N−1 个振子数态得到 Boltzmann 边缘",
  },
  {
    id: "MID-Q3",
    title: "期中 · Q3 巨正则量子振子与涨落",
    prerequisites: "几何级数、Ξ、化学平衡、粒子涨落导数",
    target: "midterm-review",
    method: "求 Ξ/⟨N⟩ → 与理想气体 μ 匹配 → 二阶 μ 导数求 Var(N)",
  },
  {
    id: "MID-Q4",
    title: "期中 · Q4 mean-field van der Waals 与临界涨落",
    prerequisites: "mean field、excluded volume、F 的体积导数、压缩率",
    target: "interactions-vdw",
    method:
      "均匀密度近似相互作用 → 修正有效体积 → F→P → 用巨势导出 Var(N) 与响应函数发散",
  },
];

export const studyPlans = [
  {
    id: "rebuild",
    title: "重建基础模式",
    pace: "8 周 · 每周 10–12 小时",
    bestFor: "现在看公式大多陌生，想在开课前真正打通。",
    rhythm: "每周 5 天 × 2 小时；第 6 天只做题和错题复盘，第 7 天休息。",
  },
  {
    id: "semester",
    title: "跟课稳过模式",
    pace: "14 周 · 每周 6–8 小时（不含上课）",
    bestFor: "重修学期同步使用，确保每周不欠债。",
    rhythm: "课前 45 分钟预习本节点；课后 90 分钟复述与例题；周末 3 小时作业。",
  },
  {
    id: "rescue",
    title: "28 日强化模式",
    pace: "28 天 · 每天 3.5–4 小时",
    bestFor: "有连续整块时间，想沿最短核心主线快速但完整地打通一次。",
    rhythm:
      "1–6 天前置；7–15 天经典；16–23 天量子；24–25 天非平衡；26–28 天累计套题与错因回退。",
  },
];

export const modules: StudyModule[] = [
  {
    id: "math-toolbox",
    phase: "foundation",
    phaseLabel: "前置桥梁",
    week: "第 0 章 A",
    title: "数学符号与计算工具箱",
    english: "Mathematical toolbox",
    hoursCore: 4,
    hoursFull: 7,
    goal: "看到求和、偏导、指数、Gaussian 积分或 Taylor 展开时，不再因为记号而中断物理思路。",
    why: "PHY301 的真正难点经常不是物理概念，而是老师在一页内跳过三步数学。先把这些步骤变成固定动作，后面每章都会更快。",
    prerequisites: [
      "只要求中学代数：移项、幂、函数图像",
      "知道普通导数表示斜率即可；忘了也可从本节重学",
    ],
    outcomes: [
      "能读懂 Σ、Π、∂、d、exp、ln、δ、⟨·⟩ 的角色",
      "能做简单偏导、全微分和链式法则",
      "能用 Taylor、Stirling 与 saddle-point 判断大 N 极限",
      "知道 Gaussian、Gamma、超球体积、Fourier 在作业中各负责什么",
    ],
    sourceRefs: ["课件 3 slides 14–19", "作业 1 Q3–Q4", "期中 Q2", "作业 3 Q1"],
    concepts: [
      {
        title: "先学会读一行公式",
        label: "必会记号",
        core: true,
        intuition:
          "公式是一句话的压缩版。先找“等号左边要算什么”，再找“右边对谁求和/积分”，最后检查每个量的单位。",
        explanation: [
          "Σi ai 是把所有 i 对应的 ai 相加；Πi ai 是相乘。统计物理里状态很多，所以求和与乘积会一直出现。",
          "exp(x) 就是 eˣ，ln 是以 e 为底的对数。指数把可加的能量变成可乘的权重；对数又把巨大的态数乘积变回可加的熵。",
          "⟨A⟩ 表示 A 的概率平均，不表示某一次测量。δA = A−⟨A⟩ 表示相对平均值的涨落。",
          "下标 i 常标记微观态或能级；N 是粒子数；d 通常是空间维数。先查看定义，不要仅凭字母猜。",
        ],
        formula: "⟨A⟩ = Σi pi Ai（离散） 或  ⟨A⟩ = ∫dx p(x)A(x)（连续）",
        formulaNote:
          "两式结构完全一样：概率权重 × 该状态的数值，再把所有可能相加。",
        steps: [
          "圈出求和/积分变量",
          "确认概率已经归一化",
          "写清每个符号的定义与单位",
          "最后做极限或量纲检查",
        ],
        example: {
          question:
            "两能级系统 E0=0、E1=ε，概率分别为 1−p 与 p。平均能量是多少？",
          solution: [
            "按“概率 × 能量”相加",
            "⟨E⟩=(1−p)·0+p·ε=pε",
            "p→0 时能量→0；p→1 时能量→ε，极限合理",
          ],
        },
        pitfalls: [
          "把状态标签 i 当成数值相乘",
          "忘记求和边界",
          "公式算完不检查单位",
        ],
        check: {
          question: "为什么 S=kB ln Ω 使用 ln，而不是直接令 S=Ω？",
          answer:
            "独立系统的态数相乘 ΩAB=ΩAΩB，而热力学熵应相加；ln 把乘法变成加法。",
        },
      },
      {
        title: "偏导、全微分与“保持谁不变”",
        label: "热力学语言",
        core: true,
        intuition:
          "偏导是在多旋钮系统里只拧一个旋钮；下标告诉你其他旋钮被锁住。",
        explanation: [
          "若 F=F(T,V,N)，那么 (∂F/∂T)V,N 表示只改变 T，保持 V、N 固定。",
          "全微分 dF 把所有小变化的贡献加起来：dF=(∂F/∂T)dT+(∂F/∂V)dV+(∂F/∂N)dN。",
          "热力学常把同一个 dF 与第一定律得到的形式比较，从 dT、dV、dN 前的系数直接读出 S、P、μ。",
          "普通 d/dT 常暗含其他外参固定；遇到不清楚的题，主动写出下标。",
        ],
        formula: "dF = −S dT − P dV + μ dN  ⇒  S=−(∂F/∂T)V,N，P=−(∂F/∂V)T,N",
        formulaNote: "这不是背出两个孤立公式，而是比较同一个全微分的系数。",
        steps: [
          "先列出函数依赖 F(T,V,N)",
          "写数学全微分",
          "再用物理定义写 dF",
          "逐项比较相同微分前的系数",
        ],
        example: {
          question: "F(T,V)=−aVT²（a>0）。求 S 和 P。",
          solution: [
            "S=−∂F/∂T=2aVT",
            "P=−∂F/∂V=aT²",
            "S 随 T 增大、P 为正；符号合理",
          ],
        },
        pitfalls: [
          "漏掉偏导下标",
          "把 dF/dT 与 F/T 混淆",
          "第一定律符号约定换了却不跟着调整",
        ],
        check: {
          question: "已知 dG=−S dT+V dP+μ dN，(∂G/∂P)T,N 等于什么？",
          answer: "等于 V，因为在保持 T、N 时，dG 中 dP 的系数就是 V。",
        },
      },
      {
        title: "小量展开、大 N 与最可能项",
        label: "近似发动机",
        core: true,
        intuition:
          "统计物理不追踪 10²³ 个粒子；它利用“大数让分布尖锐”这一事实，把难求和化成找最大值附近。",
        explanation: [
          "Taylor 展开把复杂函数在某点附近写成多项式。临界点附近常保留 m²、m⁴；小时间演化常只保留 δt 的一阶项。",
          "Stirling 公式 ln N!≈N lnN−N 把组合数的阶乘变成可微函数，是微正则计数和 Lagrange multiplier 的基础。",
          "若求和项形如 exp[Nf(x)] 且 N 很大，f 最大处会压倒其他项。这就是 most probable 与 thermodynamic average 接近的原因。",
          "saddle-point/Laplace method 的最低阶做法：找 f′(x*)=0，再检查 f″(x*)<0（最大）或对 e⁻ᴺᶠ 检查最小。",
        ],
        formula: "ln N! ≈ N lnN − N；  ∫dx e^{Nf(x)} 由 f(x) 最大处 x* 主导",
        formulaNote: "不是说其他项严格为零，而是相对贡献随 N 指数小。",
        steps: [
          "识别小参数或大参数",
          "选展开点",
          "保留题目需要的最低阶",
          "用极限/数值估计确认丢弃项确实更小",
        ],
        example: {
          question: "为什么两大系统接触后几乎总在总熵最大的能量分配附近？",
          solution: [
            "某分配 E1 的联合态数 Ωtot=exp[(S1(E1)+S2(E−E1))/kB]",
            "熵随 N 成正比，偏离最大值一点就让态数比值出现 e^{-cN}",
            "N≈10²³ 时该比值极小，因此观测几乎总落在最大熵附近",
          ],
        },
        pitfalls: [
          "没说明展开参数为什么小",
          "把最可能值和平均值在小系统中也强行等同",
          "Stirling 后忘记 N 必须足够大",
        ],
        check: {
          question: "若 f′(x*)=0 但 f″(x*)>0，e^{Nf(x)} 在 x* 附近是峰还是谷？",
          answer: "是谷；要主导 e^{Nf}，需要 f 的局部最大值，即 f″(x*)<0。",
        },
      },
      {
        title: "Gaussian、Gamma、超球与 Fourier：只学用途",
        label: "作业工具",
        intuition:
          "这四个工具看似分散，其实都在把“很多自由度的积分”变成可重复套用的模板。",
        explanation: [
          "Gaussian 积分负责二次 Hamiltonian：动量 p²、谐振子 q²。每个独立二次项通常贡献一个 √(π/a)。",
          "Gamma 函数把阶乘延伸到非整数，并给出高维球体积。微正则理想气体和期中谐振子都把能量约束变成高维球。",
          "d 维球面面积 Sd−1=2π^{d/2}/Γ(d/2)，球体积 Vd(R)=π^{d/2}R^d/Γ(d/2+1)。",
          "Fourier 变换把导数变成 ik 的乘法。作业 3 Q1 用它处理 Hermite 多项式与密度矩阵；这是深读工具，不应阻塞经典部分。",
        ],
        formula:
          "∫₋∞^∞ e^(−ax²)dx=√(π/a)；  ∫dⁿx e^(−½xᵀAx+Jᵀx)=√[(2π)ⁿ/detA] e^(½JᵀA⁻¹J)",
        formulaNote:
          "作业 3 给出的多维公式符号约定可能不同；使用前对照指数中 1/2 与 J 的正负号。",
        steps: [
          "先把指数配成标准二次型",
          "确认 a>0 或矩阵 A 正定",
          "逐自由度因子化或用 detA",
          "结果用单位与一维特例检查",
        ],
        example: {
          question:
            "经典一维谐振子 H=p²/(2m)+mω²q²/2 的 Z 中，p 与 q 积分为什么能分开？",
          solution: [
            "e^{-βH}=e^{-βp²/(2m)}e^{-βmω²q²/2}",
            "积分区域是整个 p、q 平面，乘积可拆成两个一维 Gaussian",
            "分别套公式后相乘",
          ],
        },
        pitfalls: [
          "漏掉矩阵 determinant 的平方根",
          "把球面面积和球体积混用",
          "Fourier 约定 2π 因子不一致",
        ],
        check: {
          question:
            "一个 Hamiltonian 中有 3N 个独立动量二次项，动量 Gaussian 积分大致给出温度的什么幂？",
          answer:
            "每个二次项给 β^{-1/2}，共 3N 个，所以给 β^{-3N/2}，也就是 T^{3N/2}。",
        },
      },
    ],
    deepDives: [
      {
        title: "补课：Lagrange multiplier 的固定四步",
        summary: "所有“在约束下找最可能分布”的题，都可以按同一个模板做。",
        paragraphs: [
          "要极值化 f(x1,…,xn)，同时满足 g(x)=c，构造 L=f−λ[g−c]。分别对所有 xi 和 λ 求导并令零。",
          "统计物理常有两个约束：Σni=N 与 Σεini=E，所以需要两个乘子。解出的指数形式最终会把一个乘子认成 β，另一个认成 −βμ。",
          "先写约束、再写 L、再求导，最后才解释乘子的物理意义。不要一上来猜 Boltzmann 分布。",
        ],
        formulas: ["∂L/∂xi=0", "∂L/∂λ=0 ⇒ g(x)=c"],
      },
      {
        title: "补课：为什么量纲检查能救命",
        summary: "很多漏掉 kB、β、h、体积因子的错误，不用重算就能发现。",
        paragraphs: [
          "指数的自变量必须无量纲，所以 βE、βμ、βPV 都是无量纲。",
          "ln 的自变量也应无量纲；经典连续相空间积分需除以 h 的适当次幂，才能让 Z 无量纲。",
          "熵有 J/K 的量纲，所以 lnΩ 前需要 kB；自由能有能量量纲，所以 −kBT lnZ 正确。",
        ],
      },
    ],
    practice: [
      {
        title: "一分钟记号翻译",
        instruction:
          "用中文读出 U=−∂βlnZ 与 CV=∂U/∂T，并说明各自保持什么外参。",
        answer:
          "平均内能等于 lnZ 对 β 的负导数；定容热容是保持 V、N 时内能对 T 的导数。",
      },
      {
        title: "全微分练习",
        instruction: "对 f(x,y)=x²y+ln y 写 df。",
        answer: "df=2xy dx+(x²+1/y)dy。",
      },
      {
        title: "Taylor 练习",
        instruction: "写出 eˣ、ln(1+x)、tanh x 到最低几个非零阶。",
        answer: "eˣ≈1+x+x²/2；ln(1+x)≈x−x²/2；tanh x≈x−x³/3。",
      },
    ],
    gate: {
      prompt:
        "闭卷解释“偏导下标、Gaussian、Stirling、Lagrange multiplier”分别在课程里解决什么问题。",
      criteria: [
        "四项都能用一句话说出用途",
        "能正确做一个全微分",
        "知道何时不能随便使用大 N 近似",
      ],
    },
  },
  {
    id: "probability-counting",
    phase: "foundation",
    phaseLabel: "前置桥梁",
    week: "第 0 章 B",
    title: "概率、计数与涨落",
    english: "Probability, counting and fluctuations",
    hoursCore: 4,
    hoursFull: 6,
    goal: "把“统计”理解成可计算的概率模型，而不是一堆模糊平均。",
    why: "系综就是概率分布；熵来自计数；热容、压缩率、磁化率又和方差相连。这里不牢，后面每个公式都会像魔法。",
    prerequisites: [
      "math-toolbox：求和、积分、指数与对数",
      "会算简单组合数更好；不会可在本节补",
    ],
    outcomes: [
      "能区分概率、概率密度与状态数",
      "能计算平均、二阶矩、方差和相对涨落",
      "能做二项式、多项式与 stars-and-bars 计数",
      "能解释为什么大系统的宏观量稳定",
    ],
    sourceRefs: [
      "课件 1 slides 4–6, 21–25",
      "课件 3 slides 10–15",
      "作业 1 Q2/Q4",
      "作业 2 Q3",
    ],
    concepts: [
      {
        title: "概率与概率密度不是同一件事",
        label: "归一化",
        core: true,
        intuition:
          "离散状态有“一个状态的概率”；连续变量单点概率为零，只能说落在小区间里的概率。",
        explanation: [
          "离散：pi≥0 且 Σipi=1。连续：p(x)≥0 且 ∫p(x)dx=1。",
          "连续变量中 p(x) 是密度，p(x)dx 才是 x 到 x+dx 的概率。因此 p(x) 可以大于 1，只要积分为 1。",
          "相空间概率密度 ρ(q,p) 要对全部相空间积分归一化；量纲是相空间体积的倒数。",
          "简并能级的总概率要乘状态数 gi；漏 gi 是量子统计常见错误。",
        ],
        formula: "P(x∈[a,b])=∫ₐᵇp(x)dx；  Σi pi=1",
        steps: [
          "判断变量是离散还是连续",
          "写可能范围",
          "求归一化常数",
          "再求任何平均值",
        ],
        example: {
          question: "p(x)=C e^{-ax²}（−∞<x<∞，a>0），C 是多少？",
          solution: [
            "归一化 1=C∫e^{-ax²}dx",
            "Gaussian 积分为 √(π/a)",
            "所以 C=√(a/π)",
          ],
        },
        pitfalls: [
          "连续密度 p(x) 直接当概率",
          "忘记积分测度 d³p、d³q",
          "有简并度时只数一个状态",
        ],
        check: {
          question: "若 x 的密度 p(x)=2x（0≤x≤1），P(x<1/2) 是多少？",
          answer: "∫₀^{1/2}2x dx=1/4。",
        },
      },
      {
        title: "平均、方差与相对涨落",
        label: "涨落语言",
        core: true,
        intuition: "平均告诉你分布中心，方差告诉你每次观测通常离中心多远。",
        explanation: [
          "二阶矩 ⟨X²⟩ 与方差不是同一个量；Var(X)=⟨X²⟩−⟨X⟩²。",
          "标准差 σX=√Var(X)，与 X 同单位。相对涨落 σX/|⟨X⟩| 无量纲，便于比较系统大小。",
          "N 个近似独立贡献相加时，平均通常 ∝N，方差∝N，标准差∝√N，因此相对涨落∝1/√N。",
          "这解释了宏观热力学量为何看起来稳定，也解释了小系统为何必须研究涨落。",
        ],
        formula: "Var(X)=⟨(X−⟨X⟩)²⟩=⟨X²⟩−⟨X⟩²",
        formulaNote: "方差永不为负；算出负数通常说明代数或归一化错了。",
        example: {
          question: "公平硬币正面记 X=1，反面 X=0。求平均与方差。",
          solution: [
            "⟨X⟩=1/2",
            "⟨X²⟩=1/2（因为 0²=0、1²=1）",
            "Var(X)=1/2−1/4=1/4",
          ],
        },
        pitfalls: [
          "把 ⟨X²⟩ 当方差",
          "只给方差不说明单位",
          "平均为零时还除以平均求相对涨落",
        ],
        check: {
          question: "N 个独立相同变量之和 S 的标准差怎样随 N 变？",
          answer:
            "Var(S)=N Var(X)，所以标准差随 √N 变；若平均随 N 变，相对涨落随 1/√N 下降。",
        },
      },
      {
        title: "从“数方法”到熵",
        label: "组合计数",
        core: true,
        intuition:
          "微正则系综的第一任务不是解运动方程，而是数有多少微观安排符合宏观约束。",
        explanation: [
          "从 N 个位置选 M 个激发：Ω=C(N,M)=N!/[M!(N−M)!]。",
          "把 M 个相同能量量子分给 N 个振子：stars and bars 给 Ω=C(M+N−1,M)。",
          "多能级占据数 {ni} 且 Σni=N：可区分粒子的排列数为 N!/Πi ni!。",
          "全同经典粒子相空间积分除 N!，是消除交换标签造成的重复计数；这也是 Gibbs paradox 的核心。",
        ],
        formula: "C(N,M)=N!/[M!(N−M)!]；  Ωstars-bars=C(M+N−1,M)",
        steps: [
          "先问对象是否可区分",
          "明确盒子/能级是否有标签",
          "写约束",
          "选择组合、排列或 stars-and-bars",
        ],
        example: {
          question: "3 个相同量子分给 2 个可区分振子，有多少占据数组合？",
          solution: [
            "解 n1+n2=3，ni≥0",
            "可能为 (0,3),(1,2),(2,1),(3,0)",
            "共 C(3+2−1,3)=4",
          ],
        },
        pitfalls: [
          "把相同粒子当可区分",
          "盒子和球的可区分性没写",
          "计数完忘记与能量约束相连",
        ],
        check: {
          question:
            "N 个吸附位置每个最多一个粒子，恰有 M 个粒子时简并度是多少？",
          answer:
            "从 N 个位置选择 M 个，Γ(M)=C(N,M)。这正是作业 2 Q3 的第一步。",
        },
      },
      {
        title: "最大熵与指数分布",
        label: "分布来源",
        core: true,
        intuition:
          "在只知道有限约束时，选择不额外偏爱任何未知细节的分布；数学上就是在约束下最大化熵。",
        explanation: [
          "离散 Gibbs/Shannon 熵为 −kBΣipi lnpi。只约束归一化时，最大熵给均匀分布。",
          "再约束平均能量 ΣipiEi=U，Lagrange multiplier 给 pi∝e^{-βEi}。",
          "β 的物理意义不是凭空假设；把小系统与大热库比较或与热力学关系匹配后，得到 β=1/(kBT)。",
          "最大熵是建模原则，不替代动力学；系统是否实际遍历到这些状态仍是另一问题。",
        ],
        formula:
          "maximize −Σi pi lnpi, subject to Σipi=1 and ΣipiEi=U  ⇒  pi=e^{-βEi}/Z",
        steps: [
          "写目标熵",
          "写所有约束",
          "加 Lagrange 乘子",
          "对 pi 求导",
          "归一化并识别乘子",
        ],
        example: {
          question: "只有两个状态且无能量约束，最大熵概率是什么？",
          solution: ["只约束 p0+p1=1", "熵在 p0=p1 时最大", "因此 p0=p1=1/2"],
        },
        pitfalls: [
          "把 entropy 的正负号写反",
          "忘记归一化乘子",
          "最大熵结果未经物理约束就直接称为平衡",
        ],
        check: {
          question: "为什么加入平均能量约束后不再得到均匀分布？",
          answer:
            "均匀分布通常不满足指定 U；能量高的状态必须按 e^{-βE} 被抑制，才能同时满足能量约束并保持最大熵。",
        },
      },
    ],
    deepDives: [
      {
        title: "补课：大数定律与中心极限定理只需懂到哪",
        summary: "本课不要求严格概率论证明，但要知道它们为什么支撑热力学。",
        paragraphs: [
          "大数定律说大量独立同分布样本的平均趋近真实平均；中心极限定理说许多独立贡献之和经标准化后趋向 Gaussian。",
          "统计物理中粒子并非总独立，但远离临界点时相关长度有限，宏观体积仍可分成许多近似独立块。",
          "临界点相关长度变大，独立块图景失效，涨落与响应函数会异常增大；这正是 Week 7 的桥梁。",
        ],
      },
      {
        title: "补课：most probable 不总等于 average",
        summary: "大系统里它们常几乎相同，小系统或偏斜分布里则可能明显不同。",
        paragraphs: [
          "众数（峰位置）、中位数与均值是三个不同概念。热力学极限中分布极窄，差异通常相对 O(1/N)。",
          "作业若要求“最大化 summand”是在找 most probable；若要求导数 ∂μlnΞ 是求 ensemble average。答案可能在大 N 下相同，但步骤和意义不同。",
        ],
      },
    ],
    practice: [
      {
        title: "归一化与平均",
        instruction: "p(x)=C x（0≤x≤2）。求 C 与 ⟨x⟩。",
        answer: "1=C∫₀²x dx=2C，所以 C=1/2；⟨x⟩=(1/2)∫₀²x²dx=4/3。",
      },
      {
        title: "组合计数",
        instruction: "4 个二能级粒子中恰有 2 个激发，微观态数是多少？",
        answer: "C(4,2)=6。",
      },
      {
        title: "涨落判断",
        instruction:
          "系统粒子数扩大 100 倍，若贡献近似独立，相对涨落大约变为多少？",
        answer: "变为原来的 1/√100=1/10。",
      },
    ],
    gate: {
      prompt:
        "不看答案完成：一个简单连续分布的归一化、平均、方差；再判断一个计数题对象是否可区分。",
      criteria: [
        "方差公式不写错",
        "连续密度带积分测度",
        "组合计数先声明可区分性",
        "能解释 1/√N 的来源",
      ],
    },
  },
  {
    id: "thermo-bridge",
    phase: "foundation",
    phaseLabel: "前置桥梁",
    week: "第 0 章 C",
    title: "热力学从零搭桥",
    english: "Thermodynamics bridge",
    hoursCore: 5,
    hoursFull: 8,
    goal: "能用状态、过程、热、功、熵和热力学势描述系统，不再靠死记四条定律。",
    why: "统计物理要解释热力学。若热力学本身只剩零散公式，你就无法判断统计结果是否合理。",
    prerequisites: [
      "math-toolbox：偏导与全微分",
      "生活直觉：热会从热物体流向冷物体",
    ],
    outcomes: [
      "区分状态函数与路径量、强度量与广延量",
      "固定本课的第一定律符号约定",
      "理解 0–3 定律的任务分工",
      "能从自然变量选择 U、F、G 或巨势",
    ],
    sourceRefs: [
      "课件 1 slides 8–20",
      "课件 3 slides 3–9",
      "David Tong Ch. 4",
      "OpenStax Thermodynamics",
    ],
    concepts: [
      {
        title: "系统、边界、平衡与状态量",
        label: "起点",
        core: true,
        intuition: "先决定研究“哪一块世界”，再说它能和外界交换什么。",
        explanation: [
          "孤立系统不交换能量与粒子；封闭系统可交换能量但不交换粒子；开放系统两者都可交换。",
          "平衡不是粒子停止运动，而是宏观概率分布和可观测平均不再随时间变化。",
          "宏观状态由少数坐标如 E,V,N 或 T,P,N 描述；状态方程把并非独立的坐标联系起来，例如 PV=NkBT。",
          "广延量随系统大小成比例（E,V,N,S）；强度量不随复制系统而翻倍（T,P,μ）。",
        ],
        formula: "ideal gas: PV = NkBT",
        example: {
          question: "一杯水达到室温后，分子是否停止运动？它是否处于热平衡？",
          solution: [
            "分子仍高速运动",
            "宏观温度与分布不再有净变化",
            "因此可以处于热平衡",
          ],
        },
        pitfalls: [
          "把 equilibrium 等同静止",
          "把 heat 当系统内储存的状态量",
          "把密度当广延量",
        ],
        check: {
          question:
            "把两个相同盒子的理想气体并排视为一个系统，E、V、T 怎样变化？",
          answer: "E 和 V 加倍，T 不变；前两者广延，温度是强度量。",
        },
      },
      {
        title: "热、功、内能与符号约定",
        label: "第一定律",
        core: true,
        intuition: "内能是账户余额；热和功是两种转账方式，不是账户里两种物质。",
        explanation: [
          "先区分两种式子：封闭系统真实过程的账本是 dE=δQ−P_ext dV；简单可压缩单组分的平衡态基本关系是 dE=T dS−P dV+μdN。不要把它们无条件拼成一条开放系统过程公式。",
          "有些工程教材写 dE=δQ+δW 且 δW 表示外界对系统做功。两者都对，关键是先声明。",
          "E 是状态函数，所以 dE 只看初末态；Q、W 依赖路径，严格写作 δQ、δW。",
          "可逆准静态过程中才可同时令 δQrev=T dS、P_ext=P；不可逆过程中二者一般不能逐项替换。",
        ],
        formula:
          "过程: dE=δQ−P_{ext} dV（封闭, 仅 P dV 功）；平衡态: dE=T dS−P dV+μ dN",
        steps: [
          "画出系统边界",
          "标出能量/粒子流方向",
          "写正号约定",
          "再代入第一定律",
        ],
        example: {
          question: "封闭气体吸热 100 J，同时对外做功 30 J，内能改变多少？",
          solution: [
            "δQ=+100 J",
            "系统对外做功为 30 J，所以进入 dE 时是 −30 J",
            "ΔE=70 J",
          ],
        },
        pitfalls: [
          "热和温度混为一谈",
          "不同教材符号直接拼接",
          "不可逆过程也写 δQ=T dS",
        ],
        check: {
          question: "绝热压缩中 δQ=0、dV<0，dE 的符号是什么？",
          answer: "−P dV>0，所以内能增加；外界对系统做功。",
        },
      },
      {
        title: "四条定律各自解决什么",
        label: "0–3 定律",
        core: true,
        intuition:
          "第零定律定义温度，第一定律管账，第二定律给方向，第三定律给低温边界。",
        explanation: [
          "第零定律：若 A 与 C、B 与 C 分别热平衡，则 A 与 B 热平衡。它让温度成为可传递比较的状态量。",
          "第一定律：能量守恒；不能告诉过程会不会自发发生。",
          "第二定律：孤立系统熵不减，平衡是可达约束下熵最大。它解释时间方向与热机效率上限。",
          "第三定律：理想完美晶体 T→0 时熵趋向常数（常取 0）；激发被冻结，热容常趋零。",
        ],
        formula: "isolated system: ΔS≥0；两热库热机: η≤1−T_c/T_h，可逆时取等号",
        example: {
          question:
            "为什么“热量自发从冷物体流到热物体”不违反第一定律，却违反第二定律？",
          solution: [
            "总能量仍可守恒，所以第一定律不禁止",
            "但该方向会让孤立总熵下降",
            "因此第二定律禁止其自发发生",
          ],
        },
        pitfalls: [
          "把 ΔS≥0 用在任意子系统而不计环境",
          "认为可逆过程没有变化",
          "把第三定律说成所有系统绝对熵必为零",
        ],
        check: {
          question: "冰箱把热从冷处搬到热处是否违反第二定律？",
          answer:
            "不违反，因为冰箱需要外界做功；把冰箱与环境一起算，总熵不减。",
        },
      },
      {
        title: "熵：从热力学定义到统计定义",
        label: "核心桥梁",
        core: true,
        intuition:
          "热力学说熵决定方向；统计物理解释熵为何与可实现的微观方式数有关。",
        explanation: [
          "热力学定义可逆微小过程 dS=δQrev/T。",
          "统计定义 S=kBlnΩ。两个系统接触后，最可能的宏观分配是联合 Ω 最大，也就是总 S 最大。",
          "在平衡能量分配处 ∂S1/∂E1=∂S2/∂E2；定义 1/T=∂S/∂E 后得到 T1=T2。",
          "因此温度不是单粒子的固有属性，而是熵随能量增长速度的宏观量。",
        ],
        formula: "S=kBlnΩ；  1/T=(∂S/∂E)V,N",
        formulaNote: "这两式会在微正则模块严格从组合系统推导。",
        example: {
          question:
            "系统 A 加一点能量能新增很多微观态，系统 B 新增很少。能量倾向流向谁？",
          solution: [
            "∂S/∂E 较大的系统温度较低",
            "联合态数增长最快的方向是能量流向 A",
            "直到两边 ∂S/∂E 相等，即温度相等",
          ],
        },
        pitfalls: [
          "把熵简单等同“混乱”",
          "只看单个子系统熵，不看总系统",
          "认为微观动力学每一步都不可逆",
        ],
        check: {
          question: "为什么总熵最大条件给出温度相等？",
          answer:
            "固定总能量时 dStot/dE1=∂S1/∂E1−∂S2/∂E2=0；用 1/T=∂S/∂E 得 1/T1=1/T2。",
        },
      },
      {
        title: "为什么需要不同热力学势",
        label: "选择工具",
        core: true,
        intuition:
          "实验能控制的旋钮不同，就换一个以这些旋钮为自然变量的“平衡评分函数”。",
        explanation: [
          "孤立系统固定 S,V,N：平衡使 U 最小；或固定 E,V,N：平衡使 S 最大。",
          "热库固定 T,V,N：使用 Helmholtz 自由能 F=U−TS，平衡使 F 最小。",
          "固定 T,P,N：使用 Gibbs 自由能 G=U−TS+PV，平衡使 G 最小。",
          "固定 T,V,μ：使用巨势 ΦG=U−TS−μN=−PV，平衡使巨势最小。",
        ],
        formula: "F=U−TS； G=U−TS+PV； ΦG=U−TS−μN",
        formulaNote:
          "Legendre transform 的本质是把不方便控制的变量换成方便控制的共轭变量。",
        steps: [
          "列出固定的外界控制量",
          "选自然变量匹配的势",
          "写全微分",
          "用最小/最大条件或偏导求平衡",
        ],
        example: {
          question: "恒温恒容盒子里比较两个可能相，应该比较 U、S 还是 F？",
          solution: [
            "外界固定 T,V,N",
            "对应 Helmholtz F(T,V,N)",
            "F 较小的相稳定",
          ],
        },
        pitfalls: [
          "看到自由能都叫 G",
          "固定条件没看就选势",
          "忘记 μN 或 PV 的正负号",
        ],
        check: {
          question: "恒温恒压条件下相共存为什么比较 Gibbs 自由能/化学势？",
          answer:
            "因为 T、P、N 是控制量，G 的自然变量与之匹配；相间转移达到平衡时化学势相等。",
        },
      },
    ],
    deepDives: [
      {
        title: "补课：等温、等容、等压、绝热过程",
        summary: "题目先识别过程，再决定哪些微分为零。",
        paragraphs: [
          "等温 dT=0；等容 dV=0；等压 dP=0；绝热 δQ=0。绝热不等于等温，也不自动等于可逆。",
          "可逆绝热又称等熵，因为 δQrev=T dS=0；不可逆绝热过程仍可能熵增。",
          "循环过程回到初态，所有状态函数净变化为零，但沿路径交换的净热与净功可以非零。",
        ],
      },
      {
        title: "补课：Maxwell relations 从哪里来",
        summary: "它们不是四条新公理，而是状态函数混合偏导可交换。",
        paragraphs: [
          "例如 dF=−S dT−P dV，所以 S=−∂TF、P=−∂VF。",
          "若 F 足够光滑，∂V∂TF=∂T∂VF，因此 (∂S/∂V)T=(∂P/∂T)V。",
          "考试时先写对应势的全微分，再交换混合偏导，比背表格可靠。",
        ],
        formulas: ["(∂S/∂V)T = (∂P/∂T)V"],
      },
    ],
    practice: [
      {
        title: "符号约定",
        instruction: "气体放热 20 J，外界压缩它做功 50 J。按本网页约定求 ΔE。",
        answer: "δQ=−20 J；外界对系统做功意味着 −PΔV=+50 J；ΔE=30 J。",
      },
      {
        title: "选势",
        instruction: "分别给固定 E,V,N；T,V,N；T,P,N；T,V,μ 选择平衡势。",
        answer: "S 最大（或 U 视固定条件）；F；G；巨势 ΦG。",
      },
      {
        title: "全微分",
        instruction: "从 F=U−TS 和 dU=T dS−P dV+μdN 推出 dF。",
        answer: "dF=dU−T dS−S dT=−S dT−P dV+μdN。",
      },
    ],
    gate: {
      prompt:
        "给任意一个热力学过程，能画系统边界、声明符号、选势，并解释第二定律判断的对象。",
      criteria: [
        "热与功不再称为状态函数",
        "能从 dF 读出 S/P",
        "能区分系统熵与总熵",
        "四个势按固定条件选择正确",
      ],
    },
  },
  {
    id: "hamilton-phase-space",
    phase: "foundation",
    phaseLabel: "前置桥梁",
    week: "第 0 章 D",
    title: "从 Newton 走到 Hamilton 与相空间",
    english: "Hamiltonian mechanics and phase space",
    hoursCore: 4,
    hoursFull: 7,
    goal: "理解经典微观态为何是相空间的一点，以及概率分布为何必须服从 Liouville 方程。",
    why: "Week 2 和作业 1 Q1 默认你已经会 Hamilton 方程、Jacobian 与相空间；这一节把它们连成一张图。",
    prerequisites: [
      "math-toolbox：多变量偏导与小量展开",
      "知道 Newton 第二定律 F=ma",
    ],
    outcomes: [
      "能从 Lagrangian/Hamiltonian 的角色理解 q、p",
      "能数出 N 个三维粒子的 6N 维相空间",
      "能写 Hamilton 方程与 Poisson bracket",
      "能用“不可压缩概率流”直觉说明 Liouville 定理",
    ],
    sourceRefs: ["课件 2 slides 2–16", "作业 1 Q1", "期中 Q1(a)"],
    concepts: [
      {
        title: "为什么换成 Hamilton 语言",
        label: "动力学重写",
        core: true,
        intuition:
          "Newton 用位置和加速度描述轨迹；Hamilton 把位置 q 与动量 p 放在对称的一阶方程里，更适合描述一整群可能状态。",
        explanation: [
          "一维粒子 H(q,p)=p²/(2m)+V(q)，通常就是总能量。",
          "Hamilton 方程 q̇=∂H/∂p、ṗ=−∂H/∂q 等价于 Newton 方程。",
          "对不显含时间的 Hamiltonian，沿轨迹 dH/dt=0，能量守恒。",
          "统计物理不试图解每条轨迹，而是研究许多初始条件在相空间中形成的概率云。",
        ],
        formula: "q̇i=∂H/∂pi； ṗi=−∂H/∂qi",
        example: {
          question: "H=p²/(2m)+mω²q²/2，写出 Hamilton 方程并恢复谐振子方程。",
          solution: ["q̇=p/m", "ṗ=−mω²q", "对 q̇ 再求时间导数：q̈=ṗ/m=−ω²q"],
        },
        pitfalls: [
          "ṗ 方程漏负号",
          "所有 Hamiltonian 都机械地叫总能量而不检查显含时间",
          "把 q、p 当成彼此独立的粒子",
        ],
        check: {
          question: "自由粒子 H=p²/(2m) 的 q̇、ṗ 是什么？",
          answer: "q̇=p/m，ṗ=0，所以动量不变、位置匀速变化。",
        },
      },
      {
        title: "一个微观态就是相空间一点",
        label: "6N 维",
        core: true,
        intuition:
          "要预测经典系统下一刻，必须同时知道所有位置和动量；把这些数排成一个大坐标，就是相空间点。",
        explanation: [
          "一个三维粒子有 (x,y,z,px,py,pz) 六个相空间坐标。",
          "N 个三维粒子有 6N 维。相空间不是普通实空间，不要试图“看见”6N 维，只需会数自由度和写积分。",
          "Hamiltonian H(q,p)=E 定义能量壳；H≤E 定义壳内体积。微正则态数常由这类高维体积得到。",
          "经典连续相空间每一点无限密，态数需用 h³ᴺ 划分相空间单元，并对全同粒子除 N!。",
        ],
        formula: "dΓ = d³Nq d³Np；  classical state count ∼ [1/(N!h³ᴺ)]∫dΓ",
        example: {
          question: "N 个一维谐振子相空间是几维？能量约束是什么形状？",
          solution: [
            "每个振子有 qi、pi 两个坐标，共 2N 维",
            "适当缩放 q、p 后 H≤E 变成 2N 维球内部",
          ],
        },
        pitfalls: [
          "把 N 个三维粒子写成 3N 维而漏动量",
          "H=E 的壳与 H≤E 的体积混用",
          "经典 Z 漏 h³ᴺ/N!",
        ],
        check: {
          question: "两个三维粒子的相空间维数是多少？",
          answer: "12 维：每个粒子 3 个位置加 3 个动量。",
        },
      },
      {
        title: "Poisson bracket 是相空间的导数规则",
        label: "统一写法",
        core: true,
        intuition: "它把“某个量怎样沿 Hamilton 轨迹变化”压成一个括号。",
        explanation: [
          "{A,H}=Σi[(∂A/∂qi)(∂H/∂pi)−(∂A/∂pi)(∂H/∂qi)]。",
          "若 A 不显含时间，dA/dt={A,H}。因此 {H,H}=0 给能量守恒。",
          "若 {C,H}=0，C 是守恒量；平衡分布取守恒量的函数时可保持时间不变。",
          "课件结论“ρ 可以是 H 或其他守恒量的函数”来自这里。",
        ],
        formula: "dA/dt = ∂A/∂t + {A,H}",
        example: {
          question: "为什么任何 ρ=f(H) 都满足 {ρ,H}=0？",
          solution: [
            "链式法则 {f(H),H}=f′(H){H,H}",
            "{H,H}=0",
            "所以括号为零；若不显含时间，ρ 稳定",
          ],
        },
        pitfalls: [
          "Poisson bracket 两项顺序写反",
          "有显含时间时漏 ∂A/∂t",
          "stationary 分布就等于唯一平衡分布",
        ],
        check: {
          question: "{q,p} 是多少（单自由度）？",
          answer: "{q,p}=(∂q/∂q)(∂p/∂p)−(∂q/∂p)(∂p/∂q)=1。",
        },
      },
      {
        title: "Jacobian、连续性与相空间不可压缩",
        label: "Liouville 预告",
        core: true,
        intuition:
          "Hamilton 演化会拉伸和折叠概率云，但不会把一小块相空间体积压扁或膨胀。",
        explanation: [
          "小时间 δt 后 q′=q+q̇δt、p′=p+ṗδt。坐标变换的 Jacobian 决定小体积如何变化。",
          "Jacobian 一阶变化由 Σi(∂q̇i/∂qi+∂ṗi/∂pi)δt 决定。",
          "代入 Hamilton 方程后，两项是 H 的混合偏导，正负抵消，因此 Jacobian=1+O(δt²)。",
          "概率守恒再给 ∂tρ+∇Γ·(ρvΓ)=0；相空间散度为零时得到 ∂tρ+{ρ,H}=0。",
        ],
        formula: "∇Γ·vΓ = Σi(∂q̇i/∂qi+∂ṗi/∂pi)=0",
        steps: [
          "写小时间坐标映射",
          "展开 Jacobian 到一阶",
          "代 Hamilton 方程",
          "用混合偏导相等抵消",
          "结合概率守恒",
        ],
        example: {
          question: "为什么 Liouville 定理不是说每个相空间点不动？",
          solution: [
            "点会沿 Hamilton 轨迹移动",
            "定理只说随流移动的小体积不变",
            "像不可压缩水流：水滴移动，但体积不变",
          ],
        },
        pitfalls: [
          "把体积守恒误解为概率密度处处常数",
          "一阶 Jacobian 展开漏 O(δt²)",
          "没说明使用混合偏导可交换",
        ],
        check: {
          question: "Hamilton 流相空间散度为什么为零？",
          answer: "∂q̇/∂q=∂²H/(∂q∂p)，∂ṗ/∂p=−∂²H/(∂p∂q)，对光滑 H 两者抵消。",
        },
      },
    ],
    deepDives: [
      {
        title: "补课：时间反演与热力学不可逆并不直接矛盾",
        summary: "微观方程常可逆，宏观过程却几乎总朝熵增方向。",
        paragraphs: [
          "把所有动量反向，许多经典 Hamilton 轨迹可倒放；更准确地说，时间反演还要同时反转所有在时间反演下为奇的外场。固定不变的磁场会破坏这种朴素的 t→−t 对称，弱相互作用也可真正违反 T 对称。",
          "对那些满足时间反演对称的微观方程，随机准备一个宏观态时，落在能精确倒放的特殊微观态集合的概率仍极小。",
          "熵减轨迹不是数学上绝对不存在，而是在 10²³ 粒子系统中不可思议地罕见。",
          "Liouville 细粒度熵守恒与热力学熵增之间还涉及 coarse graining；课程以物理直觉和 ensemble 描述为主。",
        ],
      },
      {
        title: "补课：ergodicity 需要知道到什么程度",
        summary:
          "遍历假设让长时间平均可由系综平均代替，但并非所有系统严格遍历。",
        paragraphs: [
          "实验通常观测一个系统随时间；理论计算一群系统副本的 ensemble average。遍历性是连接二者的常用假设。",
          "积分常数、规则轨道、玻璃等可能破坏简单遍历图景。本课解题通常接受平衡系综假设，不要求证明遍历性。",
        ],
      },
    ],
    practice: [
      {
        title: "维数检查",
        instruction:
          "5 个三维粒子的相空间维数、位置子空间维数、动量子空间维数分别是多少？",
        answer: "30、15、15。",
      },
      {
        title: "Hamilton 方程",
        instruction: "H=p²/(2m)+V(q)，写 q̇ 和 ṗ。",
        answer: "q̇=p/m，ṗ=−dV/dq=F。",
      },
      {
        title: "Liouville 一句话",
        instruction: "不用公式解释 Liouville 定理。",
        answer:
          "Hamilton 动力学使相空间中的状态云像不可压缩流体那样移动：形状可变，但随流体积不变。",
      },
    ],
    gate: {
      prompt:
        "从 Hamilton 方程开始，用五行以内写出相空间散度为零，并说出它和概率守恒如何组成 Liouville 方程。",
      criteria: [
        "ṗ 的负号正确",
        "混合偏导抵消写清",
        "能区分轨迹移动与体积守恒",
        "会数 6N 维",
      ],
    },
  },
  {
    id: "statistical-entry",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 1",
    title: "为什么 10²³ 个粒子反而能预测",
    english: "Thermodynamics and the statistical approach",
    hoursCore: 3,
    hoursFull: 5,
    goal: "建立全课程主问题：如何从大量微观自由度，得到稳定的温度、压强、熵与相变。",
    why: "这一周不是“历史介绍”。它决定你后面每个公式在回答什么，避免只会机械求 Z。",
    prerequisites: ["thermo-bridge", "probability-counting"],
    outcomes: [
      "能用自己的话区分微观规律、统计模型与宏观定律",
      "知道微观态、宏观态、相空间、系综之间的层级",
      "能读 Maxwell 速度分布并做量纲/极限判断",
      "能解释 equipartition 与理想气体定律为什么是统计结果",
    ],
    sourceRefs: [
      "课件 1 slides 1–25",
      "David Tong pp. 1–2 与 Ch. 2.3",
      "MIT OCW L1–2",
    ],
    concepts: [
      {
        title: "统计物理的翻译任务",
        label: "课程总图",
        core: true,
        intuition:
          "我们不是放弃微观定律，而是把“每个粒子怎样动”翻译成“整体通常会怎样”。",
        explanation: [
          "微观层：给定 Hamiltonian 或量子 Hamiltonian，粒子遵守确定的运动/演化规律。",
          "统计层：由于微观自由度太多且初态未知，用微观态上的概率分布描述系统。",
          "宏观层：对压力、能量、磁化等可观测量取 ensemble average，得到热力学。",
          "“More is different”：温度、熵、相变是大量自由度共同出现的 emergent concepts，单个粒子通常没有同样意义的温度。",
        ],
        formula:
          "microphysics → probability over microstates → ensemble average → thermodynamics",
        example: {
          question:
            "知道一箱气体每个分子的 Newton 方程，为什么仍不直接逐粒子求解？",
          solution: [
            "初始条件数量约 6N，无法测全",
            "数值误差与碰撞使逐轨迹信息不可用",
            "实验关心的是 P、T、U 等少数稳定平均量",
            "概率描述直接针对这些问题",
          ],
        },
        pitfalls: [
          "把统计理解为微观规律不确定",
          "认为平均值意味着每个粒子都等于平均",
          "一开始就背系综而忘了控制条件",
        ],
        check: {
          question:
            "statistical mechanics 中最需要预测的是一个特定微观态，还是宏观可观测量？",
          answer:
            "通常是宏观可观测量及其涨落；特定微观态既难获得也通常不是实验目标。",
        },
      },
      {
        title: "宏观状态、微观态与 ensemble",
        label: "三层对象",
        core: true,
        intuition:
          "宏观态像邮编，微观态像完整地址；系综是同一邮编下所有可能地址的概率清单。",
        explanation: [
          "宏观约束 E,V,N 固定时，仍有巨大数量的相空间点符合条件。",
          "ensemble 不是实验室里真的复制无数盒子，而是概率论上的概念集合。",
          "observable A(q,p) 对每个微观态有值，宏观预测是 ⟨A⟩=∫ρA dΓ。",
          "不同控制条件给不同允许集合与概率：E 固定是微正则，T 固定是正则，μ 固定是巨正则。",
        ],
        formula: "⟨A⟩ = ∫dΓ ρ(Γ) A(Γ)",
        steps: [
          "写微观态空间",
          "列宏观约束",
          "选概率分布",
          "归一化",
          "计算 observable 的平均/方差",
        ],
        example: {
          question: "同一温度和体积的气体，微观态是否唯一？",
          solution: [
            "不唯一",
            "粒子位置和动量有海量组合",
            "这些组合在相应系综中以不同概率出现",
          ],
        },
        pitfalls: [
          "把 ensemble 与单个微观态混用",
          "平均时漏相空间测度",
          "认为换系综就是换物理系统而不是换控制方式",
        ],
        check: {
          question: "若要预测能量涨落，只有平均能量够吗？",
          answer: "不够，还需要 ⟨E²⟩ 或分布；Var(E)=⟨E²⟩−⟨E⟩²。",
        },
      },
      {
        title: "Maxwell–Boltzmann 速度分布怎么读",
        label: "第一种统计模型",
        core: true,
        intuition:
          "一个速度分量呈 Gaussian；速度大小还要乘球壳面积 4πv²，所以最可能速度不是零。",
        explanation: [
          "三分量独立且各向同性时，p(vx,vy,vz)∝exp[−βm(vx²+vy²+vz²)/2]。",
          "若问速度向量落在 d³v 中，用三维密度；若问 speed v 到 v+dv，要对方向积分，得到 4πv² 因子。",
          "温度升高使分布变宽并把峰向高速度移动；质量增大使分布变窄、峰向低速度移动。",
          "分布尾部永不严格为零，但高能粒子被指数抑制。",
        ],
        formula: "f(v)=4π(m/2πkBT)^(3/2) v² exp[−mv²/(2kBT)]",
        formulaNote: "f(v)dv 是 speed 位于 [v,v+dv] 的概率。",
        example: {
          question: "为什么 vx 最可能为 0，但 speed v 最可能不为 0？",
          solution: [
            "单分量密度在 0 最大",
            "三维中半径 v 的球壳状态数随 v² 增大",
            "v² 与指数抑制竞争，在非零 v 出现峰",
          ],
        },
        pitfalls: [
          "速度向量分布与 speed 分布漏掉 4πv²",
          "把平均速度向量 0 当平均 speed 0",
          "指数中漏 m 或 2",
        ],
        check: {
          question: "同温度下，氢分子与氧分子谁的典型速度更大？",
          answer: "氢分子更大；典型速度随 √(kBT/m) 变化。",
        },
      },
      {
        title: "equipartition 与理想气体定律",
        label: "宏观结果",
        core: true,
        intuition: "在经典热平衡中，每个独立二次自由度平均分到 kBT/2 的能量。",
        explanation: [
          "单原子理想气体每粒子有 px²,py²,pz² 三个二次动量项，因此平均动能 3kBT/2。",
          "谐振子每个空间方向还有一个 q² 势能项，因此一维振子平均能量 kBT。",
          "取垂直于墙面的 x 方向：单个粒子一次弹性碰撞传给墙 2mvx，往返同一面平均间隔 2L/|vx|，故时间平均力为 mvx²/L。对全部粒子求和并除以墙面积 A，得到 P=(N/V)m⟨vx²⟩。",
          "各向同性给 ⟨vx²⟩=⟨v²⟩/3；再用 ⟨mv²/2⟩=3kBT/2，便得到 PV=NkBT。这样压强是碰壁动量通量，状态方程不是额外背出的公理。",
          "equipartition 是经典、高温、能谱近连续时的结果；量子低温会“冻结”自由度。",
        ],
        formula: "P=(N/V)m⟨v_x²⟩=(N/3V)m⟨v²⟩;  U=3NkBT/2;  PV=NkBT",
        example: {
          question: "N 个三维经典谐振子总平均能量是多少？",
          solution: [
            "每个振子 3 个动量二次项 + 3 个位置二次项，共 6 个",
            "每项 kBT/2",
            "每振子 3kBT，总能量 3NkBT",
          ],
        },
        pitfalls: [
          "任意势能都套 kBT/2",
          "量子低温也强行 equipartition",
          "自由度计数漏位置或动量",
        ],
        check: {
          question: "单原子理想气体定容热容 CV 是多少？",
          answer: "U=3NkBT/2，所以 CV=(∂U/∂T)V,N=3NkB/2。",
        },
      },
    ],
    deepDives: [
      {
        title: "先不要纠结：为什么 statistics 能给因果解释",
        summary:
          "课件提醒统计描述模式，不自动给微观机制；统计物理还需 Hamiltonian 提供机制。",
        paragraphs: [
          "只拟合分布不能告诉你粒子为何具有某能量；Hamiltonian 决定允许状态与能量，系综决定在约束下如何加权。",
          "因此完整答案常有三层：模型的微观能量、系综分布、由平均得到的宏观定律。",
        ],
      },
      {
        title: "课程旧版考核信息",
        summary:
          "课件 1 的 2025-09 版本写 Assignment 30%、Mid-term 30%、Final 40%。",
        paragraphs: [
          "网页据此重视三套作业和期中评分答案，但下一次重修的比例可能改变。",
          "开课第一周请把新 syllabus 与这里对照；知识路径通常不变，权重和截止日期需要更新。",
        ],
      },
    ],
    practice: [
      {
        title: "概念复述",
        instruction:
          "用“邮编/地址”的比喻解释 macrostate、microstate、ensemble。",
        answer:
          "宏观态是邮编；微观态是完整地址；系综是该邮编下地址及其概率的清单。",
      },
      {
        title: "自由度计数",
        instruction:
          "三维单原子理想气体每个粒子有几个对能量作二次贡献的自由度？",
        answer: "3 个动量二次自由度，所以平均能量 3kBT/2。",
      },
      {
        title: "分布判断",
        instruction: "提高 T 后 Maxwell speed 分布的峰与宽度怎样变化？",
        answer: "峰向更高 v 移动，分布变宽。",
      },
    ],
    gate: {
      prompt:
        "不用公式先讲清：为何大量粒子可以用概率预测，以及 Maxwell speed 分布为何在 v=0 为零。",
      criteria: [
        "三层翻译链完整",
        "分清速度向量与 speed",
        "能正确做一次自由度计数",
      ],
    },
  },
  {
    id: "phase-ensemble",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 2",
    title: "Liouville 定理与系综理论",
    english: "Liouville theorem and ensemble theory",
    hoursCore: 4,
    hoursFull: 7,
    goal: "从微观 Hamilton 动力学推到概率密度的允许演化，并理解平衡分布为何只能依赖守恒量。",
    why: "这是期中 Q1(a) 和作业 1 Q1 的直接考点，也是三大系综合法性的底座。",
    prerequisites: ["hamilton-phase-space", "probability-counting"],
    outcomes: [
      "能用 Jacobian 或 continuity 两条路线说明 Liouville",
      "能写 classical ensemble average",
      "能解释 stationary distribution 为何可写成 f(H, conserved quantities)",
      "能区分 time reversal、recurrence、ergodicity 与 equilibrium",
    ],
    sourceRefs: [
      "课件 2 slides 1–16",
      "课件 7 slides 2–4",
      "作业 1 Q1",
      "期中 Q1(a)",
      "MIT OCW L7",
    ],
    concepts: [
      {
        title: "Liouville 方程：概率也要服从微观动力学",
        label: "核心定理",
        core: true,
        intuition:
          "不能任意在相空间画一个随时间变化的概率云；它必须被 Hamilton 流搬运并守恒。",
        explanation: [
          "状态点速度是 vΓ=(q̇,ṗ)。概率守恒给相空间 continuity equation。",
          "Hamilton 流散度为零，于是 ∂tρ+vΓ·∇Γρ=0，也就是 ∂tρ+{ρ,H}=0。",
          "沿任一轨迹的总导数 dρ/dt=0：随流观察，概率密度不变。",
          "这对应 phase-space volume preservation；两种证明是同一几何事实。",
        ],
        formula: "∂tρ + {ρ,H} = 0  ⇔  dρ/dt along trajectory = 0",
        steps: [
          "写 continuity",
          "计算 Hamilton 流散度",
          "令散度为零",
          "识别 Poisson bracket",
        ],
        example: {
          question: "若初始概率云被拉成长条，Liouville 是否允许？",
          solution: [
            "允许形状改变",
            "只要求随流小体积与密度保持",
            "长条在某方向拉长时必须在其他方向压缩，整体相空间体积不变",
          ],
        },
        pitfalls: [
          "把 ∂tρ=0 当成一般 Liouville 结论",
          "只写方程不解释 phase volume",
          "认为 Liouville 本身证明熵增",
        ],
        check: {
          question: "平衡分布的 ∂tρ=0，还需满足什么？",
          answer:
            "还需 {ρ,H}=0；因此 ρ 必须沿 Hamilton 轨迹不变，通常可取守恒量的函数。",
        },
      },
      {
        title: "平衡分布的允许形式",
        label: "stationarity",
        core: true,
        intuition:
          "平衡时概率图案不随时间变，所以同一条动力学轨道上的概率不能忽高忽低。",
        explanation: [
          "若 ρ=f(H)，则 {ρ,H}=f′(H){H,H}=0，所以 stationary。",
          "若还有粒子数、总动量、角动量等守恒量，ρ 也可以依赖它们。",
          "Liouville 只给“允许形式”，没有唯一决定 f。具体宏观约束才选出 microcanonical/canonical 等分布。",
          "期中简答要同时回答两句：粒子必须服从 Newton/Hamilton，故相空间体积守恒；平衡密度必须是 Hamiltonian/守恒量的函数。",
        ],
        formula: "ρeq = f(H,C1,C2,...)",
        example: {
          question: "ρ∝e^{-βH} 为什么与 Liouville 相容？",
          solution: [
            "它是 H 的函数",
            "Poisson bracket {e^{-βH},H}=0",
            "所以在时间无关 H 下 stationary",
          ],
        },
        pitfalls: [
          "把“可以是 f(H)”说成“只能是均匀分布”",
          "忽略额外守恒量",
          "只凭 stationary 就确定 β",
        ],
        check: {
          question: "ρ=q（单自由度）一般是平衡分布吗？",
          answer: "一般不是，因为 {q,H}=∂H/∂p=q̇ 通常不为零。",
        },
      },
      {
        title: "ensemble average 与 time average",
        label: "遍历桥梁",
        core: true,
        intuition:
          "理论同时看很多可能系统，实验往往长时间看一个系统；遍历假设让两种平均在适当条件下相等。",
        explanation: [
          "ensemble average 在某时刻对所有微观态按 ρ 加权。",
          "time average 沿一条长轨迹对 A(t) 平均。",
          "ergodicity 粗略说轨迹会充分探索对应 invariant measure 的可访问区域；孤立 Hamilton 轨迹固定能量，只能直接对应同一能量壳的 microcanonical measure。",
          "canonical 长时平均要把小系统连同热库视为更大微正则系统，或使用确实保存 canonical measure 的恒温/随机动力学；不能让一条封闭固定能量轨迹凭空采样不同能量。",
          "recurrence 说有限受限 Hamilton 系统可能极长时间后接近初态，并不妨碍实际时间尺度上的热力学。",
        ],
        formula: "lim(τ→∞)(1/τ)∫₀^τA(t)dt ≈ ∫dΓ ρeq A",
        example: {
          question: "温度计测量更接近瞬时微观态还是时间/系综平均？",
          solution: [
            "温度计响应时间内与大量粒子相互作用",
            "读数本质上是时空平均",
            "所以稳定宏观量由 ensemble average 预测",
          ],
        },
        pitfalls: [
          "把遍历性当对所有系统的已证定理",
          "把孤立 Hamilton 轨迹说成会直接遍历 canonical 能量分布",
          "recurrence 时间与实验时间混为一谈",
          "认为 time reversal 直接否定熵增",
        ],
        check: {
          question: "为什么课程可以用 ensemble average 预测一个真实气体？",
          answer:
            "假设其平衡动力学能在观测尺度上充分采样可访问微观态，使时间/空间平均接近系综平均。",
        },
      },
      {
        title: "不可逆性的正确表述",
        label: "概念防坑",
        intuition:
          "微观方程允许倒放，不等于宏观熵减过程常见；差别在初态集合的体积与概率。",
        explanation: [
          "低熵宏观态只占能量壳中极小区域；高熵宏观态占绝大多数。",
          "从低熵态出发，多数微观轨迹进入更大宏观区域；精确反向动量可倒放，但这种准备极特殊。",
          "细粒度 Gibbs entropy 在 Liouville 演化下可守恒；热力学熵增涉及对不可观测细节的 coarse graining。",
          "考试若只问 Liouville，不要展开成哲学长文；写清 volume preservation 与 stationary form 即可。",
        ],
        check: {
          question: "Liouville 体积守恒是否等于所有宏观熵不变？",
          answer:
            "不等于。细粒度相空间信息守恒；热力学熵对应宏观粗粒化和可访问宏观区域，仍可表现为增加。",
        },
      },
    ],
    deepDives: [
      {
        title: "作业 1 Q1 的答题骨架",
        summary:
          "这道题考两条线：Jacobian 体积守恒，以及最大熵分布的 stationarity。",
        paragraphs: [
          "第一部分：写 q′、p′ 的小时间映射；det(I+δtM)=1+δtTrM+O(δt²)；TrM 是相空间散度；用 Hamilton 方程归零。",
          "第二部分：对 −∫ρlnρ（注意题目可能漏负号或采用不同号）加归一化与平均能量约束；变分得 ρ∝e^{-βH}。",
          "最后验证 ∂tρ=−{ρ,H}=0，因为 ρ 只依赖 H。",
        ],
        formulas: [
          "$$\\det J=1+\\mathcal O(\\delta t^2);\\quad \\rho_{\\mathrm{eq}}=Z^{-1}e^{-\\beta H};\\quad \\partial_t\\rho_{\\mathrm{eq}}+\\{\\rho_{\\mathrm{eq}},H\\}=0$$",
        ],
      },
      {
        title: "期中 Q1(a) 的 10 分最短答案",
        summary: "5 分原因 + 5 分平衡形式。",
        paragraphs: [
          "原因：每个粒子遵守 Hamilton/Newton 动力学，Hamilton 流相空间散度为零，因此 phase-space volume preserved。",
          "形式：平衡要求 ∂tρ=0；Liouville 给 {ρ,H}=0，所以 ρ 可为 Hamiltonian 或其他守恒量的函数。",
        ],
      },
    ],
    practice: [
      {
        title: "五行推导",
        instruction: "从 q̇=∂pH、ṗ=−∂qH 推出 ∂q q̇+∂p ṗ=0。",
        answer: "代入得 ∂q∂pH−∂p∂qH=0（H 足够光滑，混合偏导可交换）。",
      },
      {
        title: "stationary 判断",
        instruction: "判断 ρ=f(H) 与 ρ=f(q) 哪个必然 stationary。",
        answer: "f(H) 必然；f(q) 一般不必然。",
      },
      {
        title: "口头解释",
        instruction: "用“不可压缩水流”解释 Liouville，并指出比喻不代表什么。",
        answer:
          "概率云随流移动且局部体积不变；不代表相空间点静止，也不单独保证达到平衡。",
      },
    ],
    gate: {
      prompt: "按期中 Q1(a) 的 10 分结构，限时 4 分钟写完并自评。",
      criteria: [
        "volume preservation 的动力学原因 5 分点齐",
        "ρeq=f(conserved quantities) 5 分点齐",
        "没有把 Liouville 误写成熵增定理",
      ],
    },
  },
  {
    id: "microcanonical",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 3",
    title: "微正则系综：从数状态定义温度",
    english: "Microcanonical ensemble",
    hoursCore: 5,
    hoursFull: 9,
    goal: "在 E、V、N 固定的孤立系统中，从等概率假设、态数与熵推出平衡、温度、压强和化学势。",
    why: "这是全课程最重要的逻辑起点：正则和巨正则都可由“系统 + 热库”的微正则描述推出。",
    prerequisites: ["phase-ensemble", "probability-counting", "thermo-bridge"],
    outcomes: [
      "能声明微正则适用控制条件与 equal a priori probability",
      "区分 Ω、能量壳与态密度",
      "能从组合系统最大总熵推出温度相等",
      "能用熵偏导求 T、P、μ",
      "能完成两能级/等间距能级的基本计数",
    ],
    sourceRefs: [
      "课件 3 slides 1–15, 23",
      "作业 1 Q3–Q4",
      "David Tong Ch. 1.2",
      "MIT OCW L12",
    ],
    concepts: [
      {
        title: "等先验概率不是“所有宇宙状态等概率”",
        label: "基本假设",
        core: true,
        intuition:
          "在已知孤立系统 E、V、N 且达到平衡后，对所有可访问且满足约束的微观态不额外偏爱。",
        explanation: [
          "微正则控制量：E、V、N 固定。能量在狭窄壳 [E,E+δE] 内的可访问态等概率。",
          "若可访问态数为 Ω，单个微观态 pi=1/Ω。",
          "accessible 很重要：额外守恒量或动力学隔离可能缩小集合。",
          "连续经典系统用相空间体积近似态数；量子系统直接数能级/态。",
        ],
        formula: "pi = 1/Ω(E,V,N) for accessible states; otherwise 0",
        example: {
          question: "4 个二能级粒子固定恰有 2 个激发，单个具体排列概率是多少？",
          solution: ["可访问态数 Ω=C(4,2)=6", "每个排列等概率", "所以概率 1/6"],
        },
        pitfalls: [
          "忘记固定 E,V,N",
          "把不同能量状态也等概率",
          "不说明 equilibrium/accessibility",
        ],
        check: {
          question: "微正则中系统能量会像正则系综一样涨落吗？",
          answer:
            "理想定义中总能量固定（只允许极窄能量壳），因此总能量不作热涨落；子系统能量仍可涨落。",
        },
      },
      {
        title: "Ω、ω 与能量壳",
        label: "计数对象",
        core: true,
        intuition:
          "可以数 H≤E 的累计体积，也可以数 E 附近薄壳；大系统热力学结果通常只差次领先项。",
        explanation: [
          "先用原始测度 dΓ=d³ᴺq d³ᴺp 定义有量纲累计体积 Σraw(E)=∫Θ(E−H)dΓ；这里 dΓ 本身不暗含 N! 或 h³ᴺ。",
          "对三维经典全同粒子，再定义无量纲累计态数 Γ(E)=Σraw(E)/(N!h³ᴺ)、态密度 ω(E)=∂EΓ(E)，薄壳态数约 ω(E)δE；可区分粒子不除 N!。",
          "课件/作业常统一写 Ω(E)，必须从上下文看它指体积还是薄壳。",
          "熵可写 kBlnΩ。大 N 下选择累计态数 Γ 或薄壳态数通常给同一 leading thermodynamics，但严格推导要一致。",
        ],
        formula:
          "Σraw(E)=∫dΓ Θ(E−H);  Γ(E)=Σraw(E)/(N!h³ᴺ);  ω(E)=∂EΓ(E);  Ωshell≈ω(E)δE",
        example: {
          question: "为什么期中 Q2 把 H≤E 变成 6N 维球体积，而不是只积分球面？",
          solution: [
            "题目明确定义 available phase-space volume H≤E",
            "因此积分球内部",
            "若要薄壳态密度再对 E 求导",
          ],
        },
        pitfalls: [
          "球面面积与球体积互换",
          "忘 δE",
          "不同定义的 Ω 在同一推导里混用",
        ],
        check: {
          question: "若已知无量纲累计态数 Γ(E)，如何得到单位能量区间态密度？",
          answer:
            "ω(E)=dΓ/dE；若起点是有量纲 Σraw，必须先除 N!h³ᴺ（可区分粒子省略 N!）。",
        },
      },
      {
        title: "最大总态数给出热平衡",
        label: "温度诞生",
        core: true,
        intuition: "能量在两个子系统间流动时，会停在联合微观安排最多的位置。",
        explanation: [
          "总能量 Etot 固定，系统 1 取 E1 时联合态数 Ωtot(E1)=Ω1(E1)Ω2(Etot−E1)。",
          "最大化 Ω 等价最大化 lnΩ，也就是最大化 Stot=S1+S2。",
          "对 E1 求导为零得到 ∂E1S1=∂E2S2。",
          "把共同的导数定义为 1/T，就得到 T1=T2；二阶导为负保证稳定最大值并关联正热容。",
        ],
        formula: "dStot/dE1 = 1/T1 − 1/T2 = 0",
        steps: [
          "写总能量约束",
          "联合态数相乘",
          "取 ln 变总熵相加",
          "求极值",
          "识别 1/T",
        ],
        example: {
          question: "若初始 T1>T2，能量平均从哪边流向哪边？",
          solution: [
            "T1>T2 ⇒ 1/T1<1/T2",
            "把少量能量从 1 移到 2 会增加 Stot",
            "所以从热的 1 流向冷的 2",
          ],
        },
        pitfalls: [
          "E2 对 E1 的导数漏负号",
          "只写 T1=T2 不写态数/熵逻辑",
          "极值不检查稳定性",
        ],
        check: {
          question: "温度在统计定义中衡量什么？",
          answer:
            "它的倒数衡量熵随能量增加的斜率：系统新增能量能打开多少对数态数。",
        },
      },
      {
        title: "从熵微分读出第一定律",
        label: "热力学连接",
        core: true,
        intuition:
          "S(E,V,N) 的三个斜率分别定义 T、P、μ；把全微分重排，就是第一定律。",
        explanation: [
          "写 dS=(∂ES)dE+(∂VS)dV+(∂NS)dN。",
          "定义 ∂ES=1/T、∂VS=P/T、∂NS=−μ/T。",
          "乘 T 并重排：dE=T dS−P dV+μdN。",
          "这说明热力学共轭变量不是外加，而可由微观态数对约束的敏感性产生。",
        ],
        formula: "dS=(1/T)dE+(P/T)dV−(μ/T)dN",
        steps: ["明确 S 的自然变量", "写全微分", "代三条统计定义", "重排成 dE"],
        example: {
          question: "若 S=kB[N lnV+(3N/2)lnE+const]，压强怎样求？",
          solution: [
            "P/T=(∂S/∂V)E,N=NkB/V",
            "所以 P=NkBT/V",
            "得到理想气体定律",
          ],
        },
        pitfalls: [
          "μ 项负号",
          "偏导固定量不写",
          "把 E 与 T 同时当微正则独立控制量",
        ],
        check: {
          question: "为什么 ∂S/∂V=P/T 通常为正？",
          answer: "增大可用体积通常增加可访问微观态和熵；正压强系统中 P/T>0。",
        },
      },
      {
        title: "两能级系统：最小完整模型",
        label: "第一例题",
        core: true,
        intuition:
          "每个粒子只有基态 0 与激发态 ε，却已包含计数、熵、温度、能量饱和与低温冻结。",
        explanation: [
          "N 个可区分位置，M 个激发，总能量 E=Mε，态数 Ω=C(N,M)。",
          "用 Stirling 得 S(M)，再由 1/T=∂S/∂E 求 M/N=1/[e^{βε}+1]（相应模型约定下）。",
          "T→0 时 M→0；T→∞ 时两态近等概率，M/N→1/2。",
          "能量有上界，所以若允许负温度定义，还会出现 population inversion；本课核心先掌握 T>0。",
        ],
        formula: "Ω=C(N,M);  E=Mε;  excited fraction → 1/(e^{βε}+1)",
        example: {
          question: "为什么高温极限平均能量不是无限大？",
          solution: [
            "每个粒子只有两个能级",
            "高温只让两态等概率",
            "平均每粒子能量趋 ε/2，能量饱和",
          ],
        },
        pitfalls: [
          "把二能级粒子当 Boson/Fermion 占据问题",
          "漏 C(N,M)",
          "高温仍套经典 equipartition",
        ],
        check: {
          question: "低温热容为什么趋近 0？",
          answer:
            "几乎所有粒子已在基态，热能不足以跨过能隙 ε，能量对温度不敏感。",
        },
      },
    ],
    deepDives: [
      {
        title: "补课：熵的 concavity 与热容",
        summary: "稳定平衡要求总熵极大，对普通系统意味着正热容。",
        paragraphs: [
          "由 1/T=∂S/∂E，再求导得 ∂²S/∂E²=−1/(T²C)。",
          "若 C>0，则 S(E) 向下凹，两个系统能量分配的 stationary point 是最大值。",
          "引力等长程相互作用系统可有负热容，普通 ensemble equivalence 也会更微妙；不在本课主线。",
        ],
        formulas: ["∂²S/∂E² = −1/(T²C)"],
      },
      {
        title: "作业 1 Q4：stars-and-bars 路线",
        summary: "N 个振子、总激发量子 M，先计数再取大 N。",
        paragraphs: [
          "总能量 E=ℏω(M+N/2)。把 M 个相同量子分给 N 个有标签振子，Ω=C(M+N−1,M)。",
          "Stirling 后对 E 求导得到 Planck 型平均能量；单振子边缘分布在大 N 下趋于 p(n)≈(1−e^{−βℏω})e^{−nβℏω}。老师答案末式的加号无法归一化。",
          "每一步都先保留 M，再在最后用 E 替换，能减少链式法则错误。",
        ],
        formulas: ["Σn≥0 p(n)=1", "large N: p(n)≈(1−e^{−βℏω})e^{−nβℏω}"],
      },
    ],
    practice: [
      {
        title: "温度条件",
        instruction: "从 Stot(E1)=S1(E1)+S2(Etot−E1) 推导平衡条件。",
        answer: "dStot/dE1=∂E1S1−∂E2S2=0 ⇒ 1/T1=1/T2 ⇒ T1=T2。",
      },
      {
        title: "两能级计数",
        instruction: "N=5、M=2 时 Ω 与单个排列概率是多少？",
        answer: "Ω=C(5,2)=10；微正则中每个可访问排列概率 1/10。",
      },
      {
        title: "共轭变量",
        instruction: "闭卷写出 S(E,V,N) 的三个偏导定义。",
        answer: "∂ES=1/T，∂VS=P/T，∂NS=−μ/T（各自保持另外两个变量）。",
      },
    ],
    gate: {
      prompt:
        "完整讲一遍“两系统接触 → 最大联合态数 → 最大总熵 → 温度相等”，再做一个两能级计数。",
      criteria: [
        "联合态数写成乘积",
        "E2=Etot−E1 的负号正确",
        "三条共轭偏导会写",
        "Ω/ω 不混用",
      ],
    },
  },
  {
    id: "classical-gases",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 4",
    title: "理想气体、热力学定律与 Gibbs paradox",
    english: "Statistical interpretation of thermodynamics",
    hoursCore: 5,
    hoursFull: 9,
    goal: "用微正则态数计算理想气体的 S、U、CV、P 和单粒子分布，并看见 N! 为什么不可缺。",
    why: "它把 Week 3 的抽象定义兑现成你熟悉的理想气体，也是作业 1、期中 Q2 和后续所有配分函数计算的模板。",
    prerequisites: [
      "microcanonical",
      "math-toolbox 的 Gaussian/Gamma/超球",
      "thermo-bridge",
    ],
    outcomes: [
      "能把 H≤E 化成 3N 或 6N 维球",
      "能从 Ω 得 Sackur–Tetrode 型结构和理想气体定律",
      "能从大系统边缘分布得到 Boltzmann/Maxwell",
      "能解释 equipartition 与第三定律的统计图像",
      "能解释 Gibbs paradox 与 N! 修正",
    ],
    sourceRefs: [
      "课件 3 slides 16–27",
      "作业 1 Q2–Q3",
      "期中 Q2",
      "David Tong Ch. 2.2",
      "MIT OCW L13",
    ],
    concepts: [
      {
        title: "把能量约束看成高维球",
        label: "几何主线",
        core: true,
        intuition:
          "理想气体 Hamiltonian 是许多动量平方之和；固定总能量就是固定高维向量长度。",
        explanation: [
          "H=Σi pᵢ²/(2m)，位置只受盒子限制，给出 Vᴺ。",
          "动量条件 Σ pᵢ²≤2mE 是 3N 维半径 √(2mE) 的球内部。",
          "球体积随 E^{3N/2}，所以 lnΩ 中出现 (3N/2)lnE；这一步决定 equipartition。",
          "总态数含 Vᴺ、球体积、1/(N!h³ᴺ)。对数后分别贡献体积、能量与 indistinguishability 项。",
        ],
        formula: "Φ(E,V,N)=[Vᴺ/(N!h³ᴺ)](2πmE)^{3N/2}/Γ(3N/2+1)",
        formulaNote:
          "这里 Φ 是 H≤E 的累计无量纲态数；π^{3N/2} 来自 3N 维球体积，不能在涉及 N 导数时藏进一个与 N 有关的“常数”。",
        steps: [
          "位置积分→Vᴺ",
          "动量约束→高维球",
          "写球体积",
          "除 N!h³ᴺ",
          "再取 ln 与 Stirling",
        ],
        example: {
          question: "为什么理想气体 Ω 对 V 是 Vᴺ？",
          solution: [
            "每个粒子的位置可在体积 V 中选择",
            "无相互作用时位置积分因子化",
            "N 个粒子给 V×…×V=Vᴺ，随后用 N! 消除标签重复",
          ],
        },
        pitfalls: [
          "球维数写 3 而不是 3N",
          "半径漏 2m",
          "位置积分漏 Vᴺ",
          "N!h³ᴺ 缺失",
        ],
        check: {
          question: "若 Ω∝E^{3N/2}，1/T=∂E(kBlnΩ) 给什么 E(T)？",
          answer: "1/T=(3NkB/2)/E，所以 E=3NkBT/2。",
        },
      },
      {
        title: "从 Ω 一口气得到 U、CV、P",
        label: "热力学兑现",
        core: true,
        intuition: "一旦 lnΩ 的 E、V 依赖清楚，热力学量只是取斜率。",
        explanation: [
          "S≈NkB[ln(V/N)+(3/2)ln(E/N)+constants]，体现 extensivity。",
          "∂ES=1/T 给 U=3NkBT/2；再对 T 求导得 CV=3NkB/2。",
          "∂VS=P/T 给 P=NkBT/V。",
          "三个结果不是独立背诵，而来自同一个 S(E,V,N)。",
        ],
        formula: "U=3NkBT/2;  CV=3NkB/2;  PV=NkBT",
        example: {
          question: "若粒子数翻倍、T 与密度 N/V 不变，U、P、S 如何变？",
          solution: [
            "U 加倍（广延）",
            "P 不变（强度）",
            "含 N! 修正后 S 加倍（广延）",
          ],
        },
        pitfalls: [
          "先背结果后无法处理改造 Hamiltonian",
          "求 P 时固定变量错误",
          "S 表达式中 E、V 没除 N 导致非广延",
        ],
        check: {
          question: "为何单原子理想气体 CV 不依赖 V？",
          answer:
            "其内能只有动量二次项并只依赖 T；无相互作用使体积不改变能量谱的经典平均。",
        },
      },
      {
        title: "从大系统中抽一个粒子：Boltzmann 因子",
        label: "边缘分布",
        core: true,
        intuition:
          "给一个粒子能量 ε 后，剩余热库少了 ε；剩余可用态数的相对减少正好近似 e^{-βε}。",
        explanation: [
          "单粒子取状态 x、能量 ε(x) 的概率 ∝ Ωbath(E−ε)。",
          "展开 Sbath(E−ε)≈Sbath(E)−ε/T，得到 Ωbath(E−ε)/Ωbath(E)≈e^{-βε}。",
          "这说明 canonical Boltzmann factor 可从总系统 microcanonical 推出。",
          "理想气体的 ε=p²/2m，得到 Gaussian momentum 与 Maxwell speed distribution。",
        ],
        formula: "P(x) ∝ Ωbath(E−εx) ≈ exp[−βεx]",
        steps: [
          "固定子系统状态",
          "数剩余系统态数",
          "对 bath entropy 一阶展开",
          "识别 β=1/kBT",
          "归一化",
        ],
        example: {
          question: "为什么高能单粒子状态概率更小？",
          solution: [
            "子系统占去更多能量",
            "热库剩余能量更少、可用微观态数更少",
            "比值按 e^{-βε} 抑制",
          ],
        },
        pitfalls: [
          "直接宣称 Boltzmann 因子而不说明 bath",
          "展开时漏 kB",
          "子系统不够小时仍只保留一阶",
        ],
        check: {
          question: "bath 熵展开的二阶项对应什么物理？",
          answer:
            "有限热容引起的非无限热库修正与能量涨落；热库越大，二阶相对越小。",
        },
      },
      {
        title: "Gibbs paradox：N! 不是装饰",
        label: "全同粒子",
        core: true,
        intuition:
          "交换两个完全相同粒子的标签不产生新的物理微观态；若重复计数，混合同种气体会凭空增熵。",
        explanation: [
          "把带标签的经典粒子相空间直接积分，会把同一物理配置的 N! 种标签排列分别计算。",
          "除 N! 后熵成为 extensive，移除同种气体隔板不再产生虚假 mixing entropy。",
          "不同气体仍可区分，移除隔板有真实混合熵。",
          "量子全同粒子从态空间对称/反对称性更根本地解决交换计数；Week 10 会回来。",
        ],
        formula: "ZN = (1/N!h³ᴺ)∫dΓ e^{-βH}",
        example: {
          question: "两个同温同压、同种气体盒子移除隔板，宏观状态是否改变？",
          solution: [
            "密度、温度、压强都不变",
            "物理上没有可观测混合",
            "正确计数给 ΔS=0",
          ],
        },
        pitfalls: [
          "任何粒子都机械除 N! 而不讲全同/经典极限",
          "同种与不同种气体混淆",
          "把 paradox 只说成数学技巧",
        ],
        check: {
          question: "期中写经典 Z 时漏 N! 可能说明什么概念没体现？",
          answer: "没有消除全同粒子交换标签的重复计数，即缺 Gibbs correction。",
        },
      },
      {
        title: "热力学定律的统计图像",
        label: "Week 4 核心",
        core: true,
        intuition:
          "第零定律是最大联合态数的斜率匹配；第二定律是系统从小宏观区域走向占据绝大多数态的大区域。",
        explanation: [
          "第零定律：能量交换平衡给 T 相等。",
          "第一定律：S(E,V,N) 的全微分定义共轭变量并重排得到能量账本。",
          "第二定律：孤立系统平衡宏观态对应最大 Ω、最大 S；熵减宏观态的相空间比例极小。",
          "第三定律：有能隙系统 T→0 时占据基态、热涨落冻结、热容趋零；若基态简并，残余熵需单独讨论。",
        ],
        example: {
          question: "两能级系统为何直观体现第三定律？",
          solution: [
            "T→0 时 e^{-βε} 抑制激发",
            "几乎全在基态",
            "能量不再随 T 改变，所以 C→0",
          ],
        },
        pitfalls: [
          "统计解释写成循环定义",
          "忽略基态简并",
          "第二定律说成每个微观轨迹的态数真的增加",
        ],
        check: {
          question: "平衡态最大熵是绝对无约束最大吗？",
          answer: "不是，是在给定 E、V、N 及其他守恒约束下的最大。",
        },
      },
    ],
    deepDives: [
      {
        title: "期中 Q2：6N 维谐振子球体积",
        summary: "与理想气体相似，但每个振子同时有 p² 与 q²，所以是 6N 维。",
        paragraphs: [
          "作 canonical scaling P=p/√(mω)、Q=√(mω)q，使 H=(ω/2)Σ(P²+Q²)，且相空间 Jacobian 为 1。",
          "H≤E 变为半径 √(2E/ω) 的 6N 维球；由球体积得到老师题目中的几何相空间体积 Ωphase=(2πE/ω)^{3N}/(3N)!，它的单位是 action^{3N}。",
          "真正放入对数的无量纲计数应写 Γ=Ωphase/h^{3N}，其中 h=2πℏ，不是任意 cell convention。这些振子固定在各自位置、彼此可区分，所以这里不再除 N!。固定 N 时该因子不改变 E=3NkBT 与 C=3NkB；但熵移位与 N 成比例，会影响化学势，不能在变 N 问题中任意丢弃。",
          "单振子边缘由剩余 N−1 个振子的态数比得到 canonical Gaussian。",
        ],
        formulas: [
          "Ωphase(E)=(2πE/ω)^{3N}/(3N)!",
          "Γ(E)=Ωphase(E)/h^{3N};  S=kB lnΓ",
        ],
      },
      {
        title: "作业 1 Q3：一维质量为零相对论气体",
        summary:
          "色散 ε=c|p| 让动量区域变成 L1 球/交叉多面体，而非普通二次球。",
        paragraphs: [
          "题目已给动量积分，可集中处理位置 Lᴺ、N!hᴺ 与给定动量体积。",
          "取 ln、Stirling 后从 dS 的 dE、dL、dN 系数读 T、P、μ；求 Cp 时要包含对外做功。",
          "边缘动量分布仍由 bath state ratio 推到指数 e^{-βc|p|}。",
        ],
        formulas: [
          "$$\\Gamma(E,L,N)=\\frac{L^N}{N!h^N}\\frac{2^N(E/c)^N}{N!};\\quad E=Nk_{\\mathrm B}T;\\quad PL=Nk_{\\mathrm B}T;\\quad C_V=Nk_{\\mathrm B};\\quad C_P=2Nk_{\\mathrm B};\\quad p(p)=\\frac{\\beta c}{2}e^{-\\beta c|p|}$$",
        ],
      },
      {
        title: "一张清单检查 classical phase-space integrals",
        summary: "连续经典题在交卷前逐项扫一遍。",
        paragraphs: [
          "是否有正确的 d^{3N}p d^{3N}q？是否除 h^{3N} 使计数无量纲？全同粒子是否除 N!？",
          "能量约束是 H=E、E≤H≤E+δE，还是 H≤E？维数与球半径是否正确？",
          "最后的 lnΩ 是否 extensive？E、V、N 的量纲和极限是否合理？",
        ],
      },
    ],
    practice: [
      {
        title: "从 Ω 求热力学",
        instruction: "只用 Ω∝VᴺE^{3N/2} 推 U(T) 和 P(T,V)。",
        answer:
          "S=kB[NlnV+(3N/2)lnE+const]；1/T=3NkB/(2E) ⇒ U=3NkBT/2；P/T=NkB/V ⇒ P=NkBT/V。",
      },
      {
        title: "Boltzmann 边缘",
        instruction: "写出 Ωbath(E−ε) 的一阶熵展开。",
        answer: "S(E−ε)≈S(E)−ε(∂S/∂E)=S(E)−ε/T，所以态数比≈e^{-ε/(kBT)}。",
      },
      {
        title: "Gibbs correction",
        instruction: "闭卷写经典 N 粒子正则相空间积分的完整 prefactor。",
        answer: "1/(N!h^{3N})。",
      },
    ],
    gate: {
      prompt:
        "限时 20 分钟，独立完成“Ω∝VᴺE^{3N/2} → S,U,CV,P”，再口述 Boltzmann 边缘分布来源。",
      criteria: [
        "高维球维数/幂正确",
        "N!h³ᴺ 不漏",
        "三条偏导控制变量正确",
        "能解释而非背诵 e^{-βε}",
      ],
    },
  },
  {
    id: "canonical",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 5",
    title: "正则系综：一个 Z 生成全部热力学",
    english: "Canonical ensemble",
    hoursCore: 5,
    hoursFull: 8,
    goal: "在 T、V、N 固定时，从热库推导 Boltzmann 分布，并熟练用 Z 的导数求 F、U、S、C 与涨落。",
    why: "正则系综是本课计算最频繁的工具；真正要学的是一条固定流水线，而不是每道题从头发明。",
    prerequisites: [
      "microcanonical 的 bath state-ratio",
      "classical-gases 的 Gaussian 积分",
      "thermo-bridge 的 Helmholtz F",
    ],
    outcomes: [
      "能从 system+bath 推出 pi=e^{-βEi}/Z",
      "能写离散、量子与经典连续三种 Z",
      "能从 lnZ 的一阶/二阶导数求平均与涨落",
      "能完成两能级、经典谐振子与理想气体；学完 Week 9 量子桥后再回访量子谐振子",
      "能解释 ensemble equivalence 的大 N 条件",
    ],
    sourceRefs: [
      "课件 4 slides 1–13",
      "作业 2 Q1–Q2",
      "David Tong Ch. 1.3",
      "MIT OCW L13",
    ],
    concepts: [
      {
        title: "从微正则总系统切出正则子系统",
        label: "分布来源",
        core: true,
        intuition:
          "子系统能量可涨落，但系统+热库总能量固定；某子系统状态的概率由热库剩余态数决定。",
        explanation: [
          "总系统 isolated：Etot fixed。子系统在状态 i、能量 Ei 时，bath 能量 Etot−Ei。",
          "pi∝Ωbath(Etot−Ei)=exp[Sbath(Etot−Ei)/kB]。",
          "bath 很大，对 Ei 一阶展开：Sbath≈constant−Ei/T；故 pi∝e^{-βEi}。",
          "Z=Σie^{-βEi} 只负责归一化，也记录全部能谱信息。",
        ],
        formula: "pi=e^{-βEi}/Z;  Z=Σi e^{-βEi}",
        steps: [
          "写总能量约束",
          "概率∝bath 态数",
          "展开 bath entropy",
          "识别 β",
          "用 Z 归一化",
        ],
        example: {
          question: "能量差 ΔE 的两状态概率比 p2/p1 是多少？",
          solution: [
            "p2/p1=e^{-βE2}/e^{-βE1}",
            "所以 p2/p1=e^{-βΔE}",
            "比值不需要先算 Z",
          ],
        },
        pitfalls: [
          "把 Z 当某个微观态的能量",
          "概率比还多带 Z",
          "bath 不够大却忽略二阶项",
        ],
        check: {
          question: "T→∞ 时有限能级系统的 pi 怎样？",
          answer:
            "β→0，所有 e^{-βEi}→1，概率趋向各微观态等概率（简并态仍逐态计数）。",
        },
      },
      {
        title: "三种 Z 写法与防漏清单",
        label: "定义",
        core: true,
        intuition: "对象不同，求和测度不同；Boltzmann 权重的结构不变。",
        explanation: [
          "离散状态：Z=Σi e^{-βEi}，若按能级求和则写 Σlevel gi e^{-βεi}。",
          "量子：Z=Tr e^{-βĤ}，在能量本征基严格等于 Σn e^{-βEn}；这是换基表示的精确等号。",
          "经典全同粒子：只在高温、稀薄、交换量子效应可忽略的 Maxwell–Boltzmann / semiclassical 极限，才近似为 ZN≈[1/(N!h³ᴺ)]∫d³Np d³Nq e^{-βH}。",
          "Hamiltonian 可分成独立部分时，指数和积分因子化；这是 oscillator、ideal gas 的加速关键。",
        ],
        formula:
          "Zquantum=Tr e^{-βĤ}=Σn e^{-βEn};  Zclassical≈1/(N!h³ᴺ)∫dΓ e^{-βH}",
        steps: [
          "确认 classical/quantum",
          "确认状态是否按简并能级合并",
          "写完整测度/prefactor",
          "检查 Hamiltonian 能否因子化",
        ],
        example: {
          question:
            "N 个互不作用、可区分的相同子系统，单体配分函数 z1，ZN 是多少？",
          solution: [
            "总能量为单体能量和",
            "Boltzmann 权重与求和因子化",
            "可区分时 ZN=z1ᴺ；经典全同气体还需 /N!",
          ],
        },
        pitfalls: [
          "简并度 gi 漏掉",
          "把经典 phase-space integral 与量子 trace 说成任意温度下严格相等",
          "经典全同粒子漏 N!h³ᴺ",
          "固定 N 的 canonical 与允许 N 变化的 grand partition 混用",
        ],
        check: {
          question: "两个能级 0、ε，激发态简并度 g，Z 是什么？",
          answer: "Z=1+g e^{-βε}。",
        },
      },
      {
        title: "ln Z 的导数机器",
        label: "核心流水线",
        core: true,
        intuition: "Z 是加权状态总数；对 β 求导会把能量从指数里“拉下来”。",
        explanation: [
          "F=−kBTlnZ，把统计归一化与 Helmholtz 自由能连接。",
          "U=−∂βlnZ；S=(U−F)/T=kB(lnZ+βU)。",
          "CV=(∂U/∂T)V,N=kBβ²Var(E)。",
          "若 Hamiltonian 含外参 λ，广义力通常由 −∂F/∂λ 得到；符号依 H 中耦合约定。",
        ],
        formula: "F=−kBTlnZ; U=−∂βlnZ; S=kB(lnZ+βU); Var(E)=∂²βlnZ",
        steps: [
          "先求 Z",
          "取 ln 并化简",
          "一阶 β 导数求 U",
          "F/S 用代数关系",
          "二阶导或 T 导数求 C/涨落",
        ],
        example: {
          question: "Z=Aβ^{-a}（A 与 β 无关），求 U 与 CV。",
          solution: ["lnZ=lnA−a lnβ", "U=−∂βlnZ=a/β=akBT", "CV=akB"],
        },
        pitfalls: [
          "对 T 与 β 链式法则错",
          "求 ∂β 时把 β 依赖藏在 λT 中漏掉",
          "F、U、S 单位混淆",
        ],
        check: {
          question: "为什么 Var(E)≥0 能推出 CV≥0（普通正则系综）？",
          answer:
            "CV=Var(E)/(kBT²)，右边非负；因此稳定正则系统的定容热容非负。",
        },
      },
      {
        title: "能量涨落与 ensemble equivalence",
        label: "大系统",
        core: true,
        intuition:
          "正则中 E 会抖动，但宏观系统的相对抖动通常只有 1/√N，所以看起来像固定能量。",
        explanation: [
          "Var(E)=kBT²CV；若 CV∝N，则标准差∝√N，而 U∝N。",
          "相对涨落 σE/U∝1/√N，于是 microcanonical 与 canonical 对局域/宏观平均常等价。",
          "临界点、长程相互作用、小系统等情形可让简单 equivalence 失效或变慢。",
          "“最可能 E”和“平均 E”在尖锐大 N 分布中接近，但概念仍不同。",
        ],
        formula: "σE/U ∼ N^{-1/2}",
        example: {
          question: "N 增大一万倍，相对能量涨落约缩小多少？",
          solution: ["按 1/√N", "√10000=100", "所以缩小约 100 倍"],
        },
        pitfalls: [
          "说正则 E 固定",
          "说相对涨落小就绝对涨落小",
          "临界点也无条件套 1/√N",
        ],
        check: {
          question: "为何 canonical 可以模拟与微正则相同的宏观气体？",
          answer:
            "热力学极限中 canonical 能量分布相对极窄，几乎集中在与微正则同一平均能量附近。",
        },
      },
      {
        title: "经典与量子谐振子：最重要的对照",
        label: "回访支线 · 学完 Week 9 后",
        core: false,
        intuition:
          "高温时能级间隔看不清，量子结果回到经典 equipartition；低温时能隙冻结热容。",
        explanation: [
          "顺序提醒：第一次学习 Week 5 时，只需掌握经典谐振子的 Gaussian 与 Z 流水线。若 ket、能级、ℏ 仍陌生，请先跳过本卡；完成“量子语言与密度矩阵”后再回来做作业 2 Q2。",
          "经典三维振子每个振子 6 个二次项，Z1∝(kBT/ℏω)³，U1=3kBT。",
          "一维量子振子 En=ℏω(n+1/2)，Z1=e^{-βℏω/2}/(1−e^{-βℏω})。",
          "U1=ℏω/2+ℏω/[e^{βℏω}−1]；高温趋 kBT，低温趋零点能。",
          "CV 高温趋 kB（一维），低温指数趋零。零点能不贡献热容，因为不随 T 变。",
        ],
        formula: "Zq,1=e^{-βℏω/2}/(1−e^{-βℏω}); Uq,1=ℏω/2+ℏω/(e^{βℏω}−1)",
        example: {
          question: "为何量子一维振子高温 U≈kBT 而不是 kBT/2？",
          solution: [
            "Hamiltonian 有 p² 与 q² 两个二次自由度",
            "经典极限每项 kBT/2",
            "合计 kBT",
          ],
        },
        pitfalls: [
          "量子数 n 与粒子 occupation number 混用",
          "几何级数漏零点能因子",
          "N 个独立振子忘记 Z=Z1ᴺ",
        ],
        check: {
          question: "T→0 时 U 为何不趋 0？CV 又为何趋 0？",
          answer: "U 保留零点能 ℏω/2；但它不随 T 变化，所以 CV=dU/dT→0。",
        },
      },
    ],
    deepDives: [
      {
        title: "virial theorem 与 generalized equipartition",
        summary: "课件 4 slide 13 把 equipartition 推广到非纯理想气体形式。",
        paragraphs: [
          "canonical integration by parts 可得到 ⟨xi ∂H/∂xj⟩=kBTδij（边界项消失时）。",
          "对 H=p_i²/(2m) 取 x=p_i，得到 ⟨p_i∂H/∂p_i⟩=⟨p_i²/m⟩=kBT，因此该能量项本身是 ⟨p_i²/(2m)⟩=kBT/2；harmonic 的 q_i² 项同理。",
          "应用前必须检查积分边界与分布衰减，不能对任意坐标机械套。",
        ],
        formulas: [
          "$$\\left\\langle x_i\\frac{\\partial H}{\\partial x_j}\\right\\rangle=k_{\\mathrm B}T\\,\\delta_{ij}$$",
        ],
      },
      {
        title: "正则题固定解题模板",
        summary: "作业 2 Q1/Q2 都按这六步。",
        paragraphs: [
          "① 写 Hamiltonian；② 判断独立自由度并求单体 Z1；③ 组合为 ZN；④ lnZ；⑤ 用导数求 U/F/S/C；⑥ 做 high/low-T、单位与 equipartition 检查。",
          "若问单自由度分布，写 p(x)=e^{-βh(x)}/z1；若问涨落，用二阶导数而不是重新积分所有状态。",
        ],
      },
    ],
    practice: [
      {
        title: "两能级 canonical",
        instruction: "E0=0、E1=ε，求 Z、U 和高低温极限。",
        answer: "Z=1+e^{-βε}；U=ε/(e^{βε}+1)；T→0 时 0，T→∞ 时 ε/2。",
      },
      {
        title: "幂律 Z",
        instruction: "若 Z∝T^a，直接写 U 与 C。",
        answer: "因 Z∝β^{-a}，U=akBT，C=akB。",
      },
      {
        title: "涨落",
        instruction: "用 Z 写 Var(E) 的两种等价形式。",
        answer: "Var(E)=∂²βlnZ=kBT²CV。",
      },
    ],
    gate: {
      prompt:
        "不看笔记完成一个两能级系统和一个 classical oscillator 的 Z→F/U/S/C 流水线。",
      criteria: [
        "Z 定义与简并正确",
        "β/T 链式法则正确",
        "极限检查写出",
        "能量涨落公式会解释",
      ],
    },
  },
  {
    id: "grand-canonical",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 6",
    title: "Gibbs 正则与巨正则：体积、粒子数也会涨落",
    english: "Isothermal-isobaric and grand canonical ensembles",
    hoursCore: 5,
    hoursFull: 8,
    goal: "根据外界固定的 T/P/μ 选择 NPT 或巨正则模型，并用 Δ/Ξ 计算平均体积、粒子数及涨落。",
    why: "这一周最容易被记号搞乱；真正主线是“哪个广延量可以和热库交换，它就会涨落”。",
    prerequisites: ["canonical", "thermo-bridge 的 Legendre transforms"],
    outcomes: [
      "能列四大系综的固定量与涨落量",
      "能写 NPT 配分函数与 Gibbs free energy",
      "能从 system+particle reservoir 推出 e^{-β(E−μN)}",
      "能用 Ξ 求 ΦG、P、⟨N⟩、Var(N)",
      "能完成经典理想气体与吸附位点模型",
    ],
    sourceRefs: [
      "课件 5 slides 1–13",
      "作业 2 Q3",
      "期中 Q1(b)/Q3",
      "David Tong Ch. 1.4",
      "MIT OCW L14",
    ],
    concepts: [
      {
        title: "四大系综只看“允许交换什么”",
        label: "总表",
        core: true,
        intuition:
          "与什么 reservoir 接触，就固定相应强度量，让共轭广延量涨落。",
        explanation: [
          "microcanonical：E,V,N 固定。",
          "canonical：接热库，T,V,N 固定，E 涨落。",
          "isothermal–isobaric/Gibbs canonical：接热库与压力库，T,P,N 固定，E,V 涨落。",
          "grand canonical：接热库与粒子库，T,V,μ 固定，E,N 涨落。",
        ],
        formula: "(E,V,N) → (T,V,N) → (T,P,N) or (T,V,μ)",
        example: {
          question:
            "开放小孔允许粒子交换、盒子壁固定、温度受热浴控制，选什么系综？",
          solution: [
            "粒子和能量可交换，体积固定",
            "控制 T,V,μ",
            "选 grand canonical",
          ],
        },
        pitfalls: [
          "grand canonical 里还说 N 固定",
          "NPT 与 grand canonical 都叫 Gibbs 而混淆",
          "只背名字不写控制量",
        ],
        check: {
          question: "固定 T、P、N 时哪一项涨落？",
          answer:
            "能量和体积可涨落；使用 isothermal–isobaric（课件称 Gibbs canonical）系综。",
        },
      },
      {
        title: "Gibbs canonical / NPT",
        label: "体积涨落",
        core: true,
        intuition:
          "外界活塞保持压强 P，系统采用体积 V 要付出 PV 的“体积能量成本”。",
        explanation: [
          "给定 V 的 canonical 权重由 Z(T,V,N) 描述；再让 V 可变并乘 e^{-βPV}。",
          "取一个固定 reference volume V0 后，严格的无量纲 NPT partition 可写 Δ=∫(dV/V0)e^{-βPV}Z(T,V,N)。课件常把不影响宏观结果的 V0 省略。",
          "G=−kBTlnΔ；平均体积 ⟨V⟩=−(1/β)∂P lnΔ。",
          "对理想气体 ZN∝Vᴺ，这个固定 dV/V0 测度严格给 ⟨V⟩=(N+1)kBT/P；宏观极限才有 ⟨V⟩/N→kBT/P。+1 是次广延的测度修正。",
          "只要 V0 与 P、T、N 无关，更换它不改变 ⟨V⟩ 的 P 导数，但会移动 Δ、G 的参考项与相应熵零点；若另选含 P 的 prefactor，则必须把它的有限尺寸导数一并保留。",
          "体积方差与 isothermal compressibility 关联，结构和 canonical 能量涨落相同。",
        ],
        formula: "Δ=∫₀∞(dV/V0)e^{-βPV}Z;  G=−kBTlnΔ;  ⟨V⟩=−β^{-1}∂PlnΔ",
        example: {
          question: "为什么权重里是 H+PV 而不是 H−PV？",
          solution: [
            "系统占据体积 V 要排开外界、付出 PV",
            "总有效指数为 e^{-β(H+PV)}",
            "相应 thermodynamic potential 是 G=U−TS+PV",
          ],
        },
        pitfalls: [
          "Δ 与小变化 Δ 混淆",
          "P 导数的负号漏掉",
          "把 NPT 的 G 与巨势混为同一个 G",
        ],
        check: {
          question: "NPT 中 V 较大的状态为何被 e^{-βPV} 抑制？",
          answer:
            "在固定外压下扩大体积需要更多 PV work，因此统计权重较小；系统内部 Z 的 V 增长与之竞争。",
        },
      },
      {
        title: "巨正则权重与巨配分函数",
        label: "粒子交换",
        core: true,
        intuition:
          "加入粒子需要能量，但粒子库用化学势 μ 给每个粒子“补贴”；有效成本是 E−μN。",
        explanation: [
          "状态由粒子数 N 和 N 粒子微观态 i 共同标记。",
          "概率 p_{N,i}=e^{-β(E_{N,i}−μN)}/Ξ。",
          "Ξ=ΣN e^{βμN}ZN；活度 z=e^{βμ}。",
          "μ 越大，增加粒子的统计权重越高；平衡时可交换粒子的系统 μ 相等。",
        ],
        formula: "Ξ=ΣN=0∞ zᴺZN;  pN,i=e^{-β(EN,i−μN)}/Ξ",
        steps: [
          "写每个 N 的 canonical ZN",
          "乘 zᴺ",
          "对 N 从 0 求和",
          "取 lnΞ 与导数",
        ],
        example: {
          question:
            "若单个位置只能空/占据，空能量 0、占据能量 ε，单位置 Ξ 是什么？",
          solution: [
            "n=0 权重 1",
            "n=1 权重 e^{-β(ε−μ)}",
            "Ξsite=1+e^{-β(ε−μ)}",
          ],
        },
        pitfalls: [
          "e^{βμN} 正负号",
          "ZN 中已经含 N 粒子统计又重复除/乘",
          "把 chemical potential 当固定粒子数",
        ],
        check: {
          question: "为什么 photon gas 在平衡中 μ=0？",
          answer:
            "光子数不守恒，系统可自由产生/湮灭；没有固定 N 约束对应的 Lagrange multiplier，因此平衡 μ=0。",
        },
      },
      {
        title: "ln Ξ 的导数机器",
        label: "粒子涨落",
        core: true,
        intuition: "μ 出现在 βμN 中，对 μ 求导就把 N 拉下来。",
        explanation: [
          "巨势 ΦG=−kBTlnΞ；对热力学极限中的均匀、广延 bulk system，Euler relation 给 ΦG=−PV。有限、受限或有显著表面项的系统可有边界修正。",
          "⟨N⟩=(1/β)∂μlnΞ；Var(N)=(1/β²)∂²μlnΞ=(1/β)∂μ⟨N⟩。",
          "粒子数涨落与 isothermal compressibility 相连：Var(N)/⟨N⟩=n kBTκT。",
          "临界点 κT 发散，粒子数/密度涨落也变大。",
        ],
        formula: "ΦG=−kBTlnΞ=−PV;  ⟨N⟩=β^{-1}∂μlnΞ;  VarN=β^{-2}∂²μlnΞ",
        example: {
          question: "若 lnΞ=Az（z=e^{βμ}），求 ⟨N⟩ 与 Var(N)。",
          solution: [
            "∂μz=βz",
            "⟨N⟩=Az",
            "再求导得 Var(N)=Az=⟨N⟩，是 Poisson 结构",
          ],
        },
        pitfalls: [
          "漏 1/β",
          "二阶导后忘减均值平方（lnΞ 已自动给 cumulant）",
          "κT 负号/固定量不写",
        ],
        check: {
          question: "对 lnΞ 而非 Ξ 求二阶导为何直接得到方差？",
          answer:
            "ln of generating function 生成 cumulants；二阶 cumulant 正是方差。",
        },
      },
      {
        title: "经典理想气体与吸附位点",
        label: "两个模板",
        core: true,
        intuition:
          "理想气体的 ZN∝1/N! 让 N 求和变成指数；独立二态位置让乘积变二项式。",
        explanation: [
          "经典理想气体 ZN=(1/N!)(V/λT³)ᴺ，所以 Ξ=exp(zV/λT³)。",
          "于是 P=kBT z/λT³、⟨N⟩=zV/λT³，恢复 PV=NkBT。",
          "Nsite 个独立吸附位点，每位点空或能量 −ε 的占据，Ξ=[1+e^{β(μ+ε)}]^{Nsite}（符号按 binding energy 定义）。",
          "平均占据呈 logistic/Fermi-like 形式，方差是 Bernoulli Nsite f(1−f)。",
        ],
        formula: "Ξideal=exp(zV/λT³);  λT=h/√(2πmkBT)",
        formulaNote: "期中答案把 thermal wavelength 写反；网页使用上式。",
        example: {
          question: "理想气体 lnΞ=zV/λ³，如何用 ΦG=−PV 求压强？",
          solution: ["ΦG=−kBT zV/λ³", "与 −PV 比较", "P=kBT z/λ³"],
        },
        pitfalls: [
          "thermal wavelength 颠倒",
          "binding energy 正负约定没声明",
          "吸附位点最多一个却用无限几何级数",
        ],
        check: {
          question: "经典理想气体的粒子数分布为何是 Poisson？",
          answer:
            "Ξ=e^{mean} 的展开系数给 P(N)=e^{-mean}mean^N/N!，其方差等于平均。",
        },
      },
    ],
    deepDives: [
      {
        title: "作业 2 Q3：吸附模型完整路线",
        summary: "组合数路线与独立位点乘积路线应得到同一结果。",
        paragraphs: [
          "M 个粒子占 Nsite 个位置，简并 Γ(M)=C(Nsite,M)，能量按题目 binding 定义。",
          "Ξ=ΣM C(Nsite,M)e^{-β(E(M)−μM)}，用二项式化为单位置因子的 Nsite 次方。",
          "most probable M 用 Stirling 最大化 summand；average M 用 β^{-1}∂μlnΞ。大 N 时相同，但写法要区分。",
          "与外部气体平衡时令 μads=μgas，再用理想气体 fugacity–pressure 关系代入。",
        ],
        formulas: [
          "$$\\Xi=\\left[1+e^{\\beta(\\mu+\\varepsilon)}\\right]^{N_{\\mathrm{site}}};\\quad \\langle M\\rangle=\\frac{N_{\\mathrm{site}}}{1+e^{-\\beta(\\mu+\\varepsilon)}};\\quad \\operatorname{Var}(M)=N_{\\mathrm{site}}f(1-f)$$",
        ],
      },
      {
        title: "notation firewall：三种 G",
        summary: "每次看到 G 先看自然变量。",
        paragraphs: [
          "Gibbs free energy G(T,P,N)=U−TS+PV，对应 NPT。",
          "grand potential 常写 ΩG、ΦG 或 𝒢(T,V,μ)=U−TS−μN=−PV。",
          "老师部分课件/答案把 grand potential 也写 G。解题开头主动定义，可避免后面符号冲突。",
        ],
      },
    ],
    practice: [
      {
        title: "系综选择",
        instruction: "给四种固定条件分别写系综、配分函数符号与热力学势。",
        answer:
          "E,V,N microcanonical/Ω/S；T,V,N canonical/Z/F；T,P,N NPT/Δ/G；T,V,μ grand/Ξ/ΦG。",
      },
      {
        title: "理想气体 grand sum",
        instruction: "从 ZN=(A^N/N!) 求 Ξ=Σz^NZN。",
        answer: "Ξ=Σ(zA)^N/N!=e^{zA}。",
      },
      {
        title: "涨落导数",
        instruction: "闭卷写 ⟨N⟩ 与 Var(N) 的 μ 导数。",
        answer: "⟨N⟩=β^{-1}∂μlnΞ；Var(N)=β^{-2}∂²μlnΞ。",
      },
    ],
    gate: {
      prompt:
        "看到任意固定条件，10 秒内选出系综；再独立完成 ideal gas 的 Ξ→P/⟨N⟩/VarN。",
      criteria: [
        "NPT 与 grand 不混",
        "e^{βμN} 符号正确",
        "λT 方向正确",
        "巨势与 Gibbs free energy 区分",
      ],
    },
  },
  {
    id: "interactions-vdw",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 7 · A",
    title: "从相互作用到 van der Waals 与相共存",
    english: "Interactions, mean field and liquid–gas transition",
    hoursCore: 5,
    hoursFull: 9,
    goal: "理解理想气体为何不会相变，以及吸引、排斥怎样通过 mean field/virial 修正方程并产生临界点。",
    why: "期中 Q4 与作业 2 Q4 都从这里出发；原评分答案有量纲/求导错误，必须掌握正确结构而非死背。",
    prerequisites: [
      "canonical",
      "grand-canonical",
      "thermo-bridge 的相稳定与响应函数",
    ],
    outcomes: [
      "能解释 mean-field approximation 的假设与边界",
      "能写 excluded volume + average attraction 的 Z/F/P 结构",
      "能识别 van der Waals 等温线的不稳定区",
      "能解释临界点响应函数与涨落发散",
      "能说明 coexistence、latent heat 与 Clausius–Clapeyron",
    ],
    sourceRefs: [
      "课件 6 slides 1–9",
      "期中 Q4",
      "David Tong Ch. 2.5 与 5.1",
      "MIT OCW L15–18",
    ],
    concepts: [
      {
        title: "为什么 ideal gas 不会液化",
        label: "相互作用动机",
        core: true,
        intuition:
          "没有粒子间吸引就没有聚在一起的能量收益；没有短程排斥又没有有限分子体积。",
        explanation: [
          "理想气体 Hamiltonian 只有动能，Z 的位置积分仅 Vᴺ，方程 PV=NkBT 在所有 T 平滑。",
          "真实势通常有短程强排斥和较长程吸引。",
          "排斥减少可用体积；吸引降低密集状态能量。两者与 entropy 竞争可产生气液相变。",
          "相变不是“某一对粒子发生特殊事件”，而是大量粒子 collective behavior。",
        ],
        example: {
          question: "只有吸引没有短程排斥的经典粒子模型可能怎样？",
          solution: [
            "粒子可无限靠近以不断降低势能",
            "系统可能 collapse，热力学不稳定",
            "真实模型需要短程排斥/量子效应稳定",
          ],
        },
        pitfalls: [
          "把统计有效 attraction 当真实势",
          "认为 ideal gas 低温自动液化",
          "忽略稳定性",
        ],
        check: {
          question: "van der Waals 的 b 与 a 分别粗略代表什么？",
          answer:
            "b 代表排斥导致的 excluded volume；a>0 代表平均吸引带来的 pressure correction。",
        },
      },
      {
        title: "mean field：把邻居换成平均密度",
        label: "近似方法",
        core: true,
        intuition:
          "不追踪每对粒子相关，而让每个粒子感受由平均密度产生的平滑背景。",
        explanation: [
          "把硬核排斥单独交给 excluded volume；只对可积 attractive tail 定义本站的带符号参数 ū=ūsite=∫d³r Uattr(r)<0。",
          "不同 pair 的精确数量是 N(N−1)/2，所以 mean field 先给 N(N−1)ū/(2V)，再在 thermodynamic limit 用 N² 替代 N(N−1)。",
          "若老师课件把 attraction strength 定成正数 ūteacher，则 ūsite=−ūteacher；若 Ωexcl 是一对粒子的 pair excluded volume，则每粒子参数 b=Ωexcl/2。",
          "核心假设 n(r)≈N/V 且 fluctuations/correlations 小。",
          "吸引势使本站 ū<0，平均相互作用能随密度 N/V 增大而更负。",
          "mean field 常给正确定性相图与临界行为框架，但临界点附近大涨落会破坏它。",
        ],
        formula: "Hint ≈ N²ū/(2V)",
        steps: [
          "把邻居和替成密度积分",
          "令 n(r)≈N/V",
          "处理 1/2 避免 pair double count",
          "检查 ū 的符号/量纲",
        ],
        example: {
          question: "pair sum 前为什么有 1/2？",
          solution: [
            "Σi≠j 同时数 (i,j) 与 (j,i)",
            "同一物理 pair 被数两次",
            "乘 1/2 消除重复",
          ],
        },
        pitfalls: [
          "把发散硬核也放进 ū 的积分",
          "N² 与 N(N−1) 精度层次不说明",
          "漏 1/2",
          "本站负 ū 与课件正 ūteacher 不做符号桥接",
        ],
        check: {
          question: "为何临界点附近 mean field 更可疑？",
          answer: "相关长度和涨落变大，局部密度不再只是平均密度附近的小扰动。",
        },
      },
      {
        title: "van der Waals 结构的正确推导",
        label: "期中纠错",
        core: true,
        intuition: "排斥把 V 改成 V−Nb；吸引把压强减去与密度平方成正比的一项。",
        explanation: [
          "硬核用 b=Ωexcl/2 和 V−Nb 表示；吸引尾才进入 ū=ūsite=∫Uattr<0。有限 N 先写 exp[−βN(N−1)ū/(2V)]，热力学极限再用 N²。",
          "因此近似 ZN≈[(V−Nb)ᴺ/(N!λT³ᴺ)] exp[−βN²ū/(2V)]。",
          "F=−kBTlnZ 包含 +N²ū/(2V)，不是再多一个 β。",
          "P=−∂VF=NkBT/(V−Nb)+N²ū/(2V²)。若 ū<0，第二项降低 P。",
          "若课件用正数 ūteacher 表示 attraction strength，则 ū=−ūteacher；定义 a=−ū/2=ūteacher/2>0，得到 P=NkBT/(V−Nb)−aN²/V²。",
        ],
        formula: "[P+a(N/V)²](V−Nb)=NkBT（近似 van der Waals）",
        formulaNote:
          "原 midterm marking scheme 的 F/P 有 β 与 V 次幂错误；这里给物理/量纲一致结构。",
        steps: [
          "写正确 Z",
          "ln 后求 F",
          "对 V 求导",
          "再定义正的 a",
          "检查每项都是 pressure",
        ],
        example: {
          question: "为何 attraction correction ∝n²？",
          solution: [
            "pair 数量约 N²",
            "每 pair 平均作用随 1/V",
            "总能量约 N²/V，压强导数约 N²/V²=n²",
          ],
        },
        pitfalls: [
          "interaction exponential 放进整体 N 次方",
          "F 相互作用项多 β",
          "P correction 写成 1/V 而非 1/V²",
          "a 定义含 N/V 导致不是材料常数",
        ],
        check: {
          question: "P+aN²/V² 中 aN²/V² 的量纲必须是什么？",
          answer:
            "压强；因此 a 的量纲是 pressure·volume²/particle²（若 N 视纯数则 pressure·volume²）。",
        },
      },
      {
        title: "临界点与响应函数发散",
        label: "collective fluctuation",
        core: true,
        intuition:
          "临界等温线在拐点变得很平：压一点体积就变很多，所以压缩率和密度涨落变大。",
        explanation: [
          "van der Waals critical point 满足 (∂P/∂V)T=0 与 (∂²P/∂V²)T=0。",
          "isothermal compressibility κT=−(1/V)(∂V/∂P)T,N，因此斜率趋零时 κT 发散。",
          "grand canonical fluctuation relation Var(N)/⟨N⟩=n kBTκT，故临界密度涨落增强。",
          "response divergence 是相变 hallmark；有限系统中表现为大峰而非真正无穷。",
        ],
        formula: "(∂VP)Tc=0; (∂²VP)Tc=0;  VarN/⟨N⟩=n kBTκT",
        example: {
          question: "为何临界点附近 fluid 看起来乳白（critical opalescence）？",
          solution: [
            "密度涨落跨很多尺度增强",
            "折射率随密度变化",
            "光被强烈散射",
          ],
        },
        pitfalls: [
          "只记“发散”不写 thermodynamic limit",
          "κT 负号漏掉",
          "固定 T/N 条件不写",
        ],
        check: {
          question: "若 (∂P/∂V)T 接近 0，(∂V/∂P)T 怎样？",
          answer: "其倒数绝对值很大，因此压缩率很大。",
        },
      },
      {
        title: "相共存、潜热与 Clausius–Clapeyron",
        label: "相图",
        core: true,
        intuition:
          "不稳定 S 形等温线不会被真实系统走过；系统分成气液两相，以共同压力改变相比例。",
        explanation: [
          "机械稳定要求 κT>0，即通常 (∂P/∂V)T<0。van der Waals 中正斜率段不稳定。",
          "coexistence 时两相 T、P、μ 相等；改变总 V 主要改变两相比例，P 保持 vapor pressure。",
          "一阶相变有 entropy/volume jump 与 latent heat L=TΔS。",
          "沿 coexistence curve dP/dT=L/[TΔV]，即 Clausius–Clapeyron。",
        ],
        formula: "dPcoex/dT = ΔS/ΔV = L/(TΔV)",
        example: {
          question: "沸腾时持续加热，水温为何在固定压强下近似不升？",
          solution: [
            "输入热量用于改变相比例、提供 latent heat",
            "两相共存温度由 P 决定",
            "直到液相基本耗尽",
          ],
        },
        pitfalls: [
          "共存区当均匀不稳定气体",
          "latent heat 与 heat capacity 混",
          "相平衡只写 P 相等漏 μ",
        ],
        check: {
          question: "一阶相变和连续相变在序参量上最直观差别？",
          answer:
            "一阶相变序参量发生跳变并常有潜热；连续相变序参量连续趋零但响应可发散。",
        },
      },
    ],
    deepDives: [
      {
        title: "virial/cluster expansion 只需掌握层级",
        summary: "低密度下按密度修正理想气体，系数编码两体、三体相关。",
        paragraphs: [
          "equation of state 可写 P/(nkBT)=1+B2(T)n+B3(T)n²+…；B2 由 pair potential 决定。",
          "Mayer f(r)=e^{-βU(r)}−1 把 interaction expansion 组织成 connected clusters。",
          "本课课件提到但考试材料更重 mean field/van der Waals；先理解 B2 的物理符号，不必先攻完整图展开。",
        ],
        formulas: [
          "$$\\frac{P}{nk_{\\mathrm B}T}=1+B_2(T)n+B_3(T)n^2+\\cdots;\\quad f(r)=e^{-\\beta U(r)}-1$$",
        ],
      },
      {
        title: "Maxwell construction 的角色",
        summary: "用相平衡自由能替代 van der Waals 不稳定回环。",
        paragraphs: [
          "等温 P–V 图上选一条水平 coexistence pressure，使水平线上下两块面积相等。",
          "等面积条件等价于两端态的 Gibbs free energy/chemical potential 相等。",
          "这是修正 mean-field equation of state 的 thermodynamic construction，不是微观动力学过程。",
        ],
      },
    ],
    practice: [
      {
        title: "量纲纠错",
        instruction: "检查 N²ū/(2V) 与 N²ū/(2V²) 分别应出现在 F 还是 P。",
        answer: "前者是能量，出现在 F；对 V 求导后后者是压强修正，出现在 P。",
      },
      {
        title: "临界条件",
        instruction: "写 van der Waals critical point 的两个导数条件。",
        answer: "(∂P/∂V)T=0，(∂²P/∂V²)T=0。",
      },
      {
        title: "相共存",
        instruction: "两相平衡必须相等的三个强度量是什么？",
        answer: "T、P、μ。",
      },
    ],
    gate: {
      prompt:
        "从近似 Z 推到 van der Waals P，并用量纲逐项检查；再解释临界 κT/VarN 发散链。",
      criteria: [
        "排斥/吸引符号正确",
        "V^{-2} 导数正确",
        "a 是材料参数而非含 N/V",
        "响应–涨落关系会解释",
      ],
    },
  },
  {
    id: "phase-transition",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 7 · B",
    title: "Ising、序参量与 Landau 相变理论",
    english: "Ising model, symmetry breaking and Landau theory",
    hoursCore: 6,
    hoursFull: 11,
    goal: "用 Ising 模型看懂自洽 mean field、序参量、对称性破缺、临界响应和一阶/二阶相变。",
    why: "这是课件 6 体积最大的部分，也是作业 2 Q4 的核心；需要分成主线与可折叠深读。",
    prerequisites: [
      "interactions-vdw",
      "canonical",
      "math-toolbox 的 Taylor/Lagrange",
    ],
    outcomes: [
      "能读 Ising Hamiltonian 中 J、h、σi",
      "能完成 mean-field decoupling 与 self-consistency",
      "能从 tanh 小 m 展开求 Tc 与临界行为",
      "能用 Landau free energy 识别一阶/二阶相变",
      "知道 susceptibility/correlation length 与 critical fluctuation",
      "能解释 1D Ising 为何有限 T 无相变（结论与 transfer-matrix 证据）",
    ],
    sourceRefs: [
      "课件 6 slides 10–29",
      "作业 2 Q4",
      "David Tong Ch. 5.2–5.5",
      "MIT OCW L18–19",
    ],
    concepts: [
      {
        title: "Ising 模型把 collective order 压到 ±1",
        label: "模型",
        core: true,
        intuition:
          "每个格点只有向上/向下，邻居偏好同向，外场偏好某一方向；最简单却能产生真正的相变语言。",
        explanation: [
          "σi=±1；H=−JΣ⟨ij⟩σiσj−hΣiσi（是否有 1/2 取决于 pair sum 定义）。",
          "J>0 ferromagnetic，邻居同向降能；h 是外磁场耦合。",
          "magnetization m=⟨σi⟩ 是序参量：h=0 时高温 m=0，低温可有 m≠0。",
          "Hamiltonian 在 h=0 对 σ→−σ 对称；选择 m>0 或 m<0 是 spontaneous symmetry breaking。",
        ],
        formula: "H=−JΣ⟨ij⟩σiσj−hΣiσi;  m=(1/N)Σi⟨σi⟩",
        example: {
          question: "为什么 h=0、m≠0 称自发对称性破缺？",
          solution: [
            "方程对 m→−m 对称",
            "低温平衡却选一个符号",
            "微观定律有对称，宏观态没有",
          ],
        },
        pitfalls: [
          "J/h/磁化 m 字母混",
          "pair sum 是否重复不说明",
          "finite system 里绝对对称破缺与热力学极限混用",
        ],
        check: {
          question: "高温为什么 m 倾向 0？",
          answer: "entropy 喜欢向上/向下近随机；热涨落压过 J 的有序能量收益。",
        },
      },
      {
        title: "mean-field decoupling 与自洽方程",
        label: "作业核心",
        core: true,
        intuition:
          "把每个邻居 σj 换成平均 m，但 m 又必须等于在这个平均场里算出的磁化，所以要自洽。",
        explanation: [
          "写 σi=m+δσi；忽略 δσiδσj，得 σiσj≈mσi+mσj−m²。",
          "每个自旋感受有效场 heff=h+zJm，其中 z 是 coordination number（具体 prefactor 看课件 pair 约定）。",
          "单自旋平均给 m=tanh[β(h+zJm)]。",
          "这不是显式解；m 同时在两边，要用图像、数值或临界附近展开。",
        ],
        formula: "m = tanh[β(h+zJm)]",
        steps: [
          "σ=m+δσ",
          "丢二阶 fluctuation",
          "收集单自旋有效场",
          "求单自旋 Z",
          "令算出的 ⟨σ⟩=m",
        ],
        example: {
          question: "h=0、很高 T 时自洽方程有哪些解？",
          solution: ["βzJ<1", "tanh(βzJm) 的斜率小于 1", "只有 m=0 稳定解"],
        },
        pitfalls: [
          "decoupling 漏 −m²",
          "z（邻居数）漏掉",
          "tanh 展开适用于任意 m",
          "求出多个解不比较 free energy/stability",
        ],
        check: {
          question: "mean-field Tc 如何从图像斜率得到？",
          answer:
            "h=0 在 m=0 比较 RHS 斜率 βzJ 与 LHS 斜率 1；βczJ=1，所以 kBTc=zJ。",
        },
      },
      {
        title: "临界附近展开与响应",
        label: "critical behavior",
        core: true,
        intuition:
          "Tc 附近 m 小，所以 tanh 或 free energy 可低阶展开；最小几个幂决定通用形状。",
        explanation: [
          "tanh x≈x−x³/3。h=0 代入得非零解 m∝(Tc−T)^{1/2}（mean-field exponent βcrit=1/2）。",
          "隐式求导给 χ=β(1−m²)/[1−βzJ(1−m²)]。高温侧 m=0，χ+=1/[kB(T−Tc)]；低温侧要代入非零分支 m²≈3(βzJ−1)/(βzJ)³，得到 χ−≈1/[2kB(Tc−T)]。",
          "所以两侧 susceptibility 都按 |T−Tc|^{-1} 发散（mean-field exponent γ=1），但低温与高温振幅不同。",
          "这里临界指数 βcrit 与逆温度 β=1/kBT 同字母；网页始终写 βcrit 区分。",
          "临界涨落导致 cluster size/correlation length 增大，实际低维指数可偏离 mean field。",
        ],
        formula: "m∼(Tc−T)^{1/2};  χ∼|T−Tc|^{-1}  (mean field)",
        example: {
          question: "为何微小 h 在 Tc 附近能产生很大 m？",
          solution: [
            "free-energy minimum 很平",
            "恢复力/二阶曲率很小",
            "响应 χ 是曲率的倒数，因此大",
          ],
        },
        pitfalls: [
          "β 两种含义混",
          "critical exponent 当所有维数精确值",
          "只求 stationary 不判 stable",
        ],
        check: {
          question: "响应函数发散和 free-energy 曲率有什么关系？",
          answer:
            "对序参量的 susceptibility 大致是 free-energy 二阶曲率的倒数；曲率趋零时响应发散。",
        },
      },
      {
        title: "Landau free energy：只保留对称性允许的幂",
        label: "统一语言",
        core: true,
        intuition:
          "不必知道所有微观细节；在 Tc 附近按小序参量 m 展开，自由能形状决定相。",
        explanation: [
          "这里 m 是每格点磁化，因此展开每格点自由能 f=F/N：h=0 且 m→−m 对称时，f(m)=f0+a(T)m²+b m⁴+…，不含奇次项。",
          "b>0 且 a∝T−Tc：T>Tc 时单谷在 m=0；T<Tc 时双谷在 ±m0，连续二阶相变。",
          "若允许 m³，或 m⁴ 系数变负并需 m⁶ 稳定，可产生不连续的一阶跳变。",
          "外场在 f 中加 −hm；等价地，总自由能 F 的耦合是 −Nhm。",
        ],
        formula: "f(m)=F(m)/N=f0+a0(T−Tc)m²+b m⁴−hm+…",
        steps: [
          "确定序参量及其归一化",
          "列对称性",
          "写最低稳定展开",
          "求 ∂mf=0",
          "比较极小值与曲率",
        ],
        example: {
          question: "b>0、a<0、h=0 时极小值在哪？",
          solution: [
            "∂f/∂m=2am+4bm³=0",
            "m=0 或 m²=−a/(2b)",
            "m=0 曲率 2a<0 是极大；±√(−a/2b) 是极小",
          ],
        },
        pitfalls: [
          "把每格点 m 与总自由能耦合误写成 −hm（应为 −Nhm）",
          "只解 ∂f=0 不比较",
          "对称性禁止奇次项却仍写 m³",
          "最高保留阶不稳定（系数负）",
        ],
        check: {
          question: "order parameter 在连续相变中怎样过 Tc？",
          answer: "从有序侧连续趋向 0；其导数或响应可不连续/发散。",
        },
      },
      {
        title: "lattice gas 与 Ising 是同一数学骨架",
        label: "作业 2 Q4",
        core: true,
        intuition:
          "空/占据 n=0,1 可以改写成向下/向上 σ=±1，于是液气密度相变变成磁化相变。",
        explanation: [
          "使用 ni=(1+σi)/2，把 −uΣninj+εΣni 展开。",
          "σiσj 项给 Ising coupling J；线性 σi 项给 effective field h；常数项不影响概率比但影响绝对 F。",
          "平均 occupation n̄=(1+m)/2。",
          "作业要求 mean-field Z、自洽方程、Tc 附近 m，以及 F 到 m⁴；按 Ising 模板逐步替换。",
        ],
        formula: "ni=(1+σi)/2;  n̄=(1+m)/2",
        example: {
          question: "m=0 对应 lattice gas 的平均占据是多少？",
          solution: ["n̄=(1+0)/2", "所以 n̄=1/2"],
        },
        pitfalls: [
          "pair sum coordination 系数错",
          "常数项全删后又要求绝对 free energy",
          "occupation 与粒子总数记号混",
        ],
        check: {
          question: "lattice gas 的粒子–空穴对称对应 Ising 的什么？",
          answer: "ni→1−ni 对应 σi→−σi，即自旋翻转对称。",
        },
      },
    ],
    deepDives: [
      {
        title: "1D Ising transfer matrix：为何有限温度无相变",
        summary:
          "这是课件 6 slides 25–29 的大块内容，放在深读，不阻断期中主线。",
        paragraphs: [
          "把 partition sum 写成相邻自旋权重矩阵 T 的乘积，周期边界下 Z=Tr(Tᴺ)=λ+ᴺ+λ−ᴺ。",
          "热力学极限由最大 eigenvalue λ+ 主导；有限 T 时 λ+ 是解析函数，所以 free energy 无非解析点。",
          "correlation length 由 ξ^{-1}=ln(λ+/|λ−|) 给出，只在 T→0 发散，因此 1D short-range Ising 无有限 T 相变。",
        ],
        formulas: [
          "$$Z=\\operatorname{Tr}(T^N)=\\lambda_+^N+\\lambda_-^N;\\quad \\xi^{-1}=\\ln\\frac{\\lambda_+}{|\\lambda_-|};\\quad T_c=0$$",
        ],
      },
      {
        title: "Ginzburg–Landau 与超导只读到哪",
        summary: "课件 slides 22–24 是相变语言的应用，不是先修主干。",
        paragraphs: [
          "超导序参量 ψ(r) 是空间变化的复场：|ψ|² 表示凝聚强度，复相位承载超流/超导电流的信息。Landau 的局域多项式因此还要补上 spatial gradient cost。",
          "课件采用的 GL free-energy density 可写成普通态 f_n、α|ψ|²、β|ψ|⁴/2、gauge-covariant gradient 与磁场能 B²/(8π) 之和；四次截断要求 β(T)>0，若 β(T)≤0 则必须补正的 |ψ|⁶ 或更高偶次项才能稳定。对 ψ* 与 vector potential 变分可得到序参量和电磁响应方程。",
          "式中的 m* 与 e* 是 Cooper pair 的有效质量与电荷；星号属于符号名称，不是乘号。课件使用 B²/(8π) 的 Gaussian-unit convention，换 SI 时电磁项写法会改变。",
          "均匀低场下系统排斥内部磁场，对应 Meissner effect；type-II 超导体允许量子化磁通以 vortex 穿入，多涡旋可排成 Abrikosov lattice。",
          "本课主线只需识别 complex order parameter、symmetry、gradient cost、Meissner/vortex 这条因果链；不需先学完整 gauge field theory。",
        ],
        formulas: [
          "f_s=f_n+α(T)|ψ|²+[β(T)/2]|ψ|⁴+[1/(2m*)]|(−iℏ∇−e*A/c)ψ|²+B²/(8π)",
          "ψ(r)=|ψ(r)|e^{iθ(r)}",
        ],
      },
      {
        title: "mean field 何时不可靠",
        summary: "越低维、越靠近 Tc、涨落越强，mean field 越可能失败。",
        paragraphs: [
          "mean field 忽略 spatial correlations；临界点 correlation length 发散、系统失去有限 characteristic length，许多分布转为 power law，正好违反平均场的独立局部涨落假设。",
          "临界指数不仅取决于平均场代数，还可能随空间维数、序参量对称性和相互作用范围改变；这就是 universality/RG 的入口。",
          "1D Ising 是鲜明反例：mean field 预测有限 Tc，精确 transfer matrix 给 Tc=0。",
          "考试若问课件 mean-field 结果按其框架作答，同时注明 approximation。",
        ],
      },
    ],
    practice: [
      {
        title: "自洽方程",
        instruction: "h=0 时从 m=tanh(βzJm) 求 mean-field Tc 条件。",
        answer: "m 小时 RHS≈βzJm；非零解出现条件 βzJ>1，故 kBTc=zJ。",
      },
      {
        title: "Landau 极小值",
        instruction: "F=am²+bm⁴（b>0），分别讨论 a>0 与 a<0。",
        answer:
          "a>0：m=0 唯一稳定极小；a<0：m=0 不稳定，±√(−a/2b) 为两个稳定极小。",
      },
      {
        title: "lattice mapping",
        instruction: "ni=0/1 如何映射到 σi=−1/+1？",
        answer: "ni=(1+σi)/2；空位→−1，占据→+1。",
      },
    ],
    gate: {
      prompt:
        "独立完成 mean-field decoupling → m=tanh(...) → Tc 附近展开，并用 Landau 图解释相同结果。",
      criteria: [
        "−m² correction 不漏",
        "coordination z/课件约定清楚",
        "只在小 m 展开",
        "stationary 与 stable 区分",
        "能说明 mean-field 局限",
      ],
    },
  },
  {
    id: "midterm-review",
    phase: "classical",
    phaseLabel: "经典统计物理",
    week: "Week 8",
    title: "经典统计闭环与期中四题通关",
    english: "Classical revision and midterm",
    hoursCore: 6,
    hoursFull: 10,
    goal: "把 Week 1–7 压成四类可重复答题模板，用 2025 marking scheme 做限时训练并避开答案勘误。",
    why: "旧期中不是只拿来“看懂”。它直接展示老师如何分配步骤分；你要练到能按评分点输出。",
    prerequisites: [
      "phase-ensemble",
      "microcanonical",
      "canonical",
      "grand-canonical",
      "interactions-vdw",
      "phase-transition",
    ],
    outcomes: [
      "能画四大系综控制量/势/涨落总表",
      "能按 Q1–Q4 的评分结构限时作答",
      "能检查 N!、h³ᴺ、λT、简并度、ground-state 等扣分点",
      "能区分老师原答案与物理纠正版",
      "建立个人错题分类而不是只记某题答案",
    ],
    sourceRefs: [
      "课件 7 slides 1–8",
      "期中答案 PDF pp. 3–12",
      "作业 1–2 与答案",
    ],
    concepts: [
      {
        title: "一张系综总表先拿定义分",
        label: "Q1",
        core: true,
        intuition:
          "先声明控制条件和分布，再计算；老师评分明确重视 normalization 与 thermodynamic connection。",
        explanation: [
          "microcanonical：E,V,N；uniform on shell；S=kBlnΩ。",
          "canonical：T,V,N；Z；F=−kBTlnZ；E fluctuates。",
          "NPT：T,P,N；Δ；G=−kBTlnΔ；V fluctuates。",
          "grand：T,V,μ；Ξ/Q；ΦG=−kBTlnΞ；N fluctuates。",
        ],
        formula: "constraint → ensemble → partition → potential → derivative",
        example: {
          question: "期中 Q1(b) 先写什么才能避免直接丢 4 分？",
          solution: [
            "经典 Z 的 1/(N!h³ᴺ)",
            "完整 d³Np d³Nq 积分",
            "grand sum 从 N=0 到 ∞",
            "再写 F/ΦG connection",
          ],
        },
        pitfalls: [
          "漏 N! 扣分",
          "漏 h³ᴺ 扣分",
          "grand 误标 canonical",
          "G 符号不定义",
        ],
        check: {
          question: "Q1(c) 由什么两式推出 dF？",
          answer: "F=E−TS 与 dE=T dS−P dV（固定 N）；得到 dF=−S dT−P dV。",
        },
      },
      {
        title: "高维球题统一模板",
        label: "Q2",
        core: true,
        intuition: "先缩放坐标把椭球变球，再数维度、半径、体积。",
        explanation: [
          "识别 quadratic Hamiltonian 的独立变量数；N 个三维振子是 6N。",
          "做 canonical scaling 保 Jacobian=1，得到 Σ(P²+Q²)≤R²。",
          "写 d 维球体积并代 d=6N、R²=2E/ω。",
          "lnΩ+Stirling → S；∂ES → E(T)；固定一个子系统 → bath ratio 得 Gaussian。",
        ],
        formula: "Vd(R)=π^{d/2}R^d/Γ(d/2+1)",
        example: {
          question: "看到 N 个三维 harmonic oscillators，最先写哪两个数字？",
          solution: ["每振子 3 个 q+3 个 p", "所以 d=6N；缩放后 R²=2E/ω"],
        },
        pitfalls: [
          "3N/6N 混",
          "sphere surface/volume 混",
          "答案 p.6 多出的 1/2 常数不一致",
        ],
        check: {
          question: "Q2 的最终 E=3NkBT 如何用 equipartition 快速验？",
          answer: "每振子 6 个二次项，每项 kBT/2，所以 3kBT；N 个为 3NkBT。",
        },
      },
      {
        title: "几何级数 + chemical equilibrium",
        label: "Q3",
        core: true,
        intuition:
          "单 bosonic mode 允许 n=0,1,…，先求几何级数，再把它和外部理想气体的 μ 匹配。",
        explanation: [
          "能量 En=ℏω(n+1/2)，粒子数 n；Ξmode=e^{-βℏω/2}/[1−e^{-β(ℏω−μ)}]，要求 μ<ℏω。",
          "n̄=1/[e^{β(ℏω−μ)}−1]；Var n=n̄(1+n̄)。",
          "外部经典理想气体 z=e^{βμ}=PλT³/(kBT)，λT=h/√(2πmkBT)。",
          "原 marking scheme 在 λT、μ/ℏ 与 fluctuation 式上不一致；学习用纠正版，考试如发现歧义应先定义单位。",
        ],
        formula: "n̄=1/(e^{β(ℏω−μ)}−1);  Var n=n̄(1+n̄)",
        example: {
          question: "为什么 μ 必须小于 mode energy ℏω？",
          solution: ["几何级数比值 q=e^{-β(ℏω−μ)}", "收敛需 q<1", "所以 μ<ℏω"],
        },
        pitfalls: [
          "μ 当频率又当能量",
          "thermal wavelength 写反",
          "boson variance 写成 Poisson n̄",
        ],
        check: {
          question: "Boson 的 Var n 比 Poisson 大还是小？",
          answer: "大；Var=n̄(1+n̄)>n̄，体现 bunching。",
        },
      },
      {
        title: "mean-field van der Waals 与 critical fluctuation",
        label: "Q4",
        core: true,
        intuition:
          "这题本意是“均匀背景 → Z → F → P → 响应/涨落”；原答案代数不能盲抄。",
        explanation: [
          "hard core 用 b=Ωexcl/2 把 V 改成 V−Nb，不放进 attraction integral；只对 Uattr 定义 ū=ūsite<0，并与课件正参数用 ūsite=−ūteacher 桥接。",
          "interaction 先是 N(N−1)ū/(2V)，只在 N≫1 时近似 N²ū/(2V)。",
          "正确 Z 的 interaction exponential 只出现一次，不再整体取 N 次方。",
          "F interaction=N²ū/(2V)，P correction=N²ū/(2V²)。",
          "κT 发散 → VarN/⟨N⟩=n kBTκT 发散。",
        ],
        formula: "P=NkBT/(V−Nb)+N²ū/(2V²)",
        formulaNote:
          "ū<0 时第二项为负；也可定义 a=−ū/2>0 写 P=NkBT/(V−Nb)−aN²/V²。",
        example: {
          question:
            "如何用量纲一眼看出 marking scheme 的 βN²ū/(2V) 不能直接加进 F？",
          solution: [
            "ū 积分后使 N²ū/V 已是能量",
            "再乘 β 变无量纲",
            "F 必须是能量，因此多 β 不对",
          ],
        },
        pitfalls: ["把原答案错误当标准", "a 含 N/V", "κT 固定量与负号不写"],
        check: {
          question: "临界点 number fluctuation 为什么大？",
          answer:
            "equation of state 变平、κT 发散；fluctuation–response relation 把大压缩率对应到大密度/粒子数涨落。",
        },
      },
      {
        title: "考场输出协议",
        label: "拿步骤分",
        core: true,
        intuition:
          "每题先交付定义与路线，再做代数；即使积分卡住，也保住结构分。",
        explanation: [
          "第 1 行：写控制量、Hamiltonian、完整 partition/Ω definition。",
          "第 2–4 行：写变量变换或 factorization，并标 Jacobian/degeneracy。",
          "中段：写 lnZ 与 thermodynamic derivative，偏导固定量明确。",
          "末尾：做 T→0/high T、量纲、classical limit 或 fluctuation positivity 检查。",
        ],
        steps: [
          "定义",
          "约束/测度",
          "计算核心",
          "连接 thermodynamics",
          "极限/量纲自检",
        ],
        example: {
          question: "积分一时算不出，是否应该空着等最后结果？",
          solution: [
            "不要",
            "先写正确积分、变换、维数和预期 derivative",
            "这些在 marking scheme 中都有独立分值",
          ],
        },
        pitfalls: [
          "只写最终结果",
          "一处代数错后整题放弃",
          "答案没单位/极限",
          "看到原答案错误也不做自检",
        ],
        check: {
          question: "最便宜但最有效的三个自检是什么？",
          answer: "量纲、已知极限（T→0/∞）、方差/热容等应非负或稳定性符号。",
        },
      },
    ],
    deepDives: [
      {
        title: "2025 midterm 勘误清单",
        summary: "这些地方在网页按正确物理讲，并保留“原答案可能这样写”的提醒。",
        paragraphs: [
          "Q2 熵中多出的 1/2 常数与上一页 Ω 不一致；只影响次要常数。",
          "Q3 thermal wavelength 写反；μ 有时被当能量、有时与 ω 同量纲；P–n̄ 与 fluctuation 式不可靠。",
          "Q4 interaction exponential、free energy、pressure 与 a 的量纲/求导有多处错误；使用本模块正确结构。",
          "若下一次考试复用有歧义题，先写清自己采用的定义与单位，再一致推导。",
        ],
      },
      {
        title: "错题本只记“错误类型”",
        summary: "不要抄一整份答案；每次只记录可迁移的失败模式。",
        paragraphs: [
          "建议标签：控制量错、测度/prefactor 漏、自由度维数错、链式求导错、简并/ground state 漏、符号/量纲错、极限不合理。",
          "复盘时遮住原题，只根据标签重做同类型最小例题；能迁移才算修复。",
        ],
      },
    ],
    practice: [
      {
        title: "Q1 限时",
        instruction: "12 分钟闭卷写 Q1(a–c) 的完整骨架。",
        answer: "用本模块 Q1 checklist 对照；尤其检查 N!h³ᴺ、grand sum、dF。",
        source: "midterm-2025-solution.pdf pp.3–4",
      },
      {
        title: "Q2 限时",
        instruction: "25 分钟只做 6N 球→Ω→S→E/C，不看 marginal 答案。",
        answer:
          "按题目定义先得几何体积 Ωphase=(2πE/ω)^{3N}/(3N)!；写 entropy 前改用无量纲 Γ=Ωphase/h^{3N}。这些固定位置振子可区分，无 N!；E=3NkBT，C=3NkB。",
        source: "midterm-2025-solution.pdf pp.5–7",
      },
      {
        title: "Q4 纠错",
        instruction: "逐行标出原 marking scheme 中量纲不对的项，再独立重推 P。",
        answer:
          "F interaction 应为 N²ū/(2V)；P correction 为 N²ū/(2V²)；a 应为 intensive coefficient。",
        source: "midterm-2025-solution.pdf pp.10–12",
      },
    ],
    gate: {
      prompt:
        "在 90 分钟内闭卷做一遍 2025 midterm；完成后只按评分点和勘误表批改。",
      criteria: [
        "总分至少 70/100 且 Q1 定义分基本全拿",
        "任何漏 N!h³ᴺ 已修复",
        "Q2/Q4 维数与量纲通过",
        "错题已归类到可迁移标签",
      ],
    },
  },
  {
    id: "quantum-bridge",
    phase: "quantum",
    phaseLabel: "量子统计",
    week: "Week 9 · 先修桥",
    title: "量子语言与密度矩阵从零补齐",
    english: "Quantum formalism and density matrices",
    hoursCore: 7,
    hoursFull: 12,
    goal: "只补统计物理真正需要的量子力学：态、基、算符、trace、density matrix 与量子系综。",
    why: "老师的量子部分在几页内跨过一学期量子语言。这里采用 just-in-time 路线，不让无关量子细节拖慢你。",
    prerequisites: [
      "canonical：会把一组状态按概率加权求平均",
      "math-toolbox：会读求和、指数和普通二维坐标",
      "复数共轭、矩阵、eigenvalue、trace 若陌生，先完成本节第 1 卡；不必先重学整门线性代数",
    ],
    outcomes: [
      "能手算 2×2 矩阵乘向量、Hermitian conjugate、eigenvalue 与 trace",
      "能读 ket/bra、inner product、eigenstate、completeness",
      "能用 Born rule 与 trace 计算 expectation",
      "能区分 pure state 与 mixed state",
      "会检查 density matrix 的四项合法性",
      "能写 quantum Liouville equation 与三种 equilibrium density operator",
      "能理解作业 3 Q1 的谱分解主线而不先陷入 Hermite 代数",
    ],
    sourceRefs: [
      "课件 7 slides 9–19",
      "课件 8 slides 15–18",
      "作业 3 Q1",
      "MIT OCW L20–22",
    ],
    concepts: [
      {
        title: "先补一张 2×2 线性代数地图",
        label: "零基础入口",
        core: true,
        intuition:
          "量子记号看起来新，但本课大部分操作只是：把状态写成一列数，让矩阵作用在它上面，再把对角线相加。先用 2×2 例子练会动作，再换成 ket 名字。",
        explanation: [
          "复数 z=a+ib 的共轭是 z*=a−ib，绝对值平方 |z|²=z*z≥0。对列向量先转成行向量再逐项共轭，得到 Hermitian conjugate，记作 †。",
          "矩阵乘向量时，每一行分别与列向量做乘加。若 A|a⟩=a|a⟩，作用后方向不变，|a⟩ 是 eigenvector、a 是 eigenvalue。",
          "Hermitian 矩阵满足 A†=A；它的 eigenvalues 为实数，正适合代表可观测量。对角化就是选用它的 eigenvectors 作为新坐标轴。",
          "trace 是对角元之和 TrA=Σi Aii，也可写成 Σi⟨i|A|i⟩。换正交基后 trace 不变，所以可挑最容易算的基。",
          "inner product ⟨φ|ψ⟩ 是复数版点积；orthonormal 表示 ⟨i|j⟩=δij。Σi|i⟩⟨i|=I 就是把任意向量按完整正交基拆开再拼回去。",
        ],
        formula: "A†=(A*)ᵀ;  A|a⟩=a|a⟩;  Tr(A)=Σi A_{ii}=Σi⟨i|A|i⟩",
        formulaNote:
          "这里的 i 在 Aii 中是索引，在 a+ib 中才是虚数单位；看到同一字母时先看语境。",
        steps: [
          "把 ket 暂时写成列向量",
          "按行乘列计算矩阵作用",
          "做 † 时先逐项共轭，再转置",
          "求 trace 只加对角元",
          "最后再把列向量语言翻回 bra–ket",
        ],
        example: {
          question: "A=diag(2,5)，|ψ⟩=(1,i)ᵀ/√2。求 A|ψ⟩、⟨ψ| 与 TrA。",
          solution: [
            "按行乘列：A|ψ⟩=(2,5i)ᵀ/√2",
            "转置并复共轭：⟨ψ|=(1,−i)/√2",
            "trace 只加对角元：TrA=2+5=7",
          ],
        },
        pitfalls: [
          "做 bra 时只转置却忘了复共轭",
          "把 trace 误当所有矩阵元素之和",
          "把 eigenvalue equation 误读成普通数乘，不检查向量方向是否保持",
        ],
        check: {
          question:
            "ρ=diag(3/4,1/4) 为什么已经满足归一化？它的两个 eigenvalues 是什么？",
          answer:
            "Trρ=3/4+1/4=1；对角矩阵的 eigenvalues 就是对角元 3/4 与 1/4，且都非负。",
        },
      },
      {
        title: "Hilbert space：量子态是向量，不是粒子轨迹",
        label: "最小语言",
        core: true,
        intuition:
          "选一组正交基后，量子态就像一列复数坐标；改变基不改变物理态。",
        explanation: [
          "|ψ⟩ 是 state vector，⟨ψ| 是其 Hermitian conjugate；归一化 ⟨ψ|ψ⟩=1。",
          "energy eigenstates 满足 Ĥ|n⟩=En|n⟩，且可选 orthonormal：⟨m|n⟩=δmn。",
          "completeness Σn|n⟩⟨n|=I 允许在计算中插入“量子版的 1”。",
          "波函数 ψ(x)=⟨x|ψ⟩ 是同一态在 position basis 的坐标，不是额外物体。",
        ],
        formula: "Ĥ|n⟩=En|n⟩;  Σn|n⟩⟨n|=I",
        example: {
          question: "为什么作业 3 Q1 一开始在 ⟨x|e^{-βH}|x′⟩ 中插入 Σn|n⟩⟨n|？",
          solution: [
            "energy basis 让 e^{-βH}|n⟩=e^{-βEn}|n⟩",
            "复杂算符变成普通指数权重",
            "再用 ⟨x|n⟩=φn(x) 得谱和",
          ],
        },
        pitfalls: [
          "把 ket 当普通概率",
          "completeness 漏 bra/ket 顺序",
          "波函数与概率密度 |ψ|² 混",
        ],
        check: {
          question: "在 energy basis 中 e^{-βĤ}|n⟩ 等于什么？",
          answer: "e^{-βEn}|n⟩，因为 |n⟩ 是 H 的本征态。",
        },
      },
      {
        title: "observable、Born rule 与 unitary evolution",
        label: "测量与演化",
        core: true,
        intuition:
          "Hermitian 算符给可能测量值；态在测量前提供这些结果的概率，而 unitary 演化保存总概率。",
        explanation: [
          "observable Â Hermitian，eigenvalues 实数。纯态 expectation ⟨A⟩=⟨ψ|Â|ψ⟩。",
          "在 Â 的本征基中，测得 an 的概率是 |⟨an|ψ⟩|²。",
          "Schrödinger equation 是 +iℏ∂t|ψ⟩=Ĥ|ψ⟩；课件一页的负号与同页 U=e^{-iHt/ℏ} 不一致。",
          "time-independent H 下 U(t)=e^{-iHt/ℏ} unitary，U†U=I。",
        ],
        formula: "iℏ∂t|ψ⟩=H|ψ⟩;  |ψ(t)⟩=e^{-iHt/ℏ}|ψ(0)⟩",
        example: {
          question:
            "energy eigenstate 随时间怎样变？其 energy measurement probability 是否变？",
          solution: [
            "只获得 phase e^{-iEnt/ℏ}",
            "绝对值平方不变",
            "所以仍以概率 1 测得 En",
          ],
        },
        pitfalls: [
          "Schrödinger 左侧写 −iℏ",
          "amplitude 与 probability 混",
          "unitary 当成 Hermitian",
        ],
        check: {
          question: "为什么 global phase 不影响测量概率？",
          answer: "所有 amplitude 同乘 e^{iφ}，取绝对值平方后相位消失。",
        },
      },
      {
        title: "density matrix 同时装下量子与经典不确定性",
        label: "核心对象",
        core: true,
        intuition:
          "如果系统有概率 pα 处于不同纯态，就把每个投影 |ψα⟩⟨ψα| 按概率相加。",
        explanation: [
          "ρ=Σαpα|ψα⟩⟨ψα|。pure state 特例 ρ=|ψ⟩⟨ψ|。",
          "expectation ⟨A⟩=Tr(ρA)，在任何基都相同。",
          "合法 density matrix：Trρ=1、ρ†=ρ、ρ positive semidefinite。",
          "purity Trρ²：纯态等于 1；混态小于 1。课件写“ρ²=Σpα²”不严谨，应是正交混合下 Trρ²=Σpα²。",
        ],
        formula: "ρ=Σαpα|ψα⟩⟨ψα|;  ⟨A⟩=Tr(ρA);  purity=Trρ²",
        steps: [
          "写 ensemble 与概率",
          "组成 projectors",
          "检查 trace/Hermitian/positivity",
          "用 trace 求 observable",
        ],
        example: {
          question: "两能级完全混态 ρ=I/2 的 purity 是多少？",
          solution: ["ρ²=I/4", "Tr(I)=2", "Trρ²=2/4=1/2<1，所以是 mixed"],
        },
        pitfalls: [
          "ρ 的矩阵元素直接都当概率",
          "ρ² 与 Trρ² 混",
          "非正交 mixture 直接写 purity=Σp²",
        ],
        check: {
          question: "pure state density matrix 满足什么幂等关系？",
          answer: "ρ²=ρ，因此 Trρ²=Trρ=1。",
        },
      },
      {
        title: "quantum Liouville 与平衡",
        label: "经典对应",
        core: true,
        intuition:
          "经典用 Poisson bracket 推概率密度，量子用 commutator 推 density operator。",
        explanation: [
          "Liouville–von Neumann equation：iℏ∂tρ=[H,ρ]。",
          "equilibrium 要 ∂tρ=0，因此 [H,ρ]=0。",
          "若能谱非简并，ρ 在 energy basis 必须对角；只在简并子空间内可保留与 H 对易的 off-diagonal coherence。",
          "这与 classical ρ=f(H) 的 stationarity 完全平行。",
        ],
        formula: "iℏ∂tρ=[H,ρ];  equilibrium: [H,ρ]=0",
        example: {
          question: "ρ=e^{-βH}/Z 是否 equilibrium？",
          solution: [
            "ρ 是 H 的函数",
            "任何 H 的函数与 H 对易",
            "所以 commutator 为零",
          ],
        },
        pitfalls: [
          "commutator 顺序/符号错",
          "平衡时任意 off-diagonal 都可以",
          "ρ 与 H 对易就自动确定温度",
        ],
        check: {
          question:
            "经典 Poisson bracket 与量子 commutator 在这里扮演什么相似角色？",
          answer:
            "都描述 observable/probability object 在 Hamiltonian 下的演化，并给出平衡 stationarity 条件。",
        },
      },
      {
        title: "三种量子系综只是把概率变成算符",
        label: "operator 版本",
        core: true,
        intuition:
          "经典系综逻辑不变；量子中用 energy projectors 与 trace 归一化。",
        explanation: [
          "microcanonical：ρmc=P_E/TrP_E，对指定能量壳子空间均匀混合。",
          "canonical：ρc=e^{-βH}/Z，Z=Tr e^{-βH}。",
          "grand canonical：ρgc=e^{-β(H−μN)}/Ξ，Ξ=Tr e^{-β(H−μN)}，要求 [H,N]=0 的平衡粒子数语境。",
          "在共同本征基中，这些算符对角元素就是熟悉的 ensemble probability。",
        ],
        formula: "ρc=e^{-βH}/Tr(e^{-βH});  ρgc=e^{-β(H−μN)}/Tr(e^{-β(H−μN)})",
        example: {
          question:
            "canonical density matrix 在 energy basis 的第 n 个对角元是什么？",
          solution: ["⟨n|ρ|n⟩=e^{-βEn}/Z", "就是 Boltzmann probability pn"],
        },
        pitfalls: [
          "Z=Trρ（ρ 已归一化时是 1）",
          "grand exponent 漏 μN",
          "P_E projector 与 pure state projector 混",
        ],
        check: {
          question:
            "若 energy level 有 g 重简并，canonical 中该能级总概率是什么？",
          answer: "g e^{-βε}/Z；每个简并微观态各有 e^{-βε}/Z。",
        },
      },
    ],
    deepDives: [
      {
        title: "回访作业 2 Q2：现在再做量子谐振子",
        summary:
          "这题虽然放在作业 2，但正式教学计划属于量子部分；完成本节 core 后，才是高效回访时点。",
        paragraphs: [
          "一维量子谐振子的能级为 En=ℏω(n+1/2)。在 energy basis 取 trace，单振子 Z1 是等比级数；N 个独立可区分振子给 ZN=Z1^N。",
          "沿用 Week 5 的同一台导数机器：U=−∂βlnZN，随后 C=(∂U/∂T)。零点能保留在 U 中，但因不随 T 变化而不贡献 C。",
          "若问 level probability，先写 p(n)=e^{-βEn}/Z1，再化成 normalized geometric form。最后检查 T→0 时 U/N→ℏω/2、C→0，高温时 U/N→kBT、C→kB。",
          "完成这里后，如需把经典 Gaussian 与量子能级逐项对照，再切回 Week 5 的“完整深读”查看那张回访卡。",
        ],
        formulas: [
          "Z1=e^{-βℏω/2}/(1−e^{-βℏω}),  ZN=Z1^N",
          "U/N=ℏω/2+ℏω/(e^{βℏω}−1)",
          "p(n)=(1−e^{-βℏω})e^{-nβℏω}",
          String.raw`$$\frac{C}{N}=k_{\mathrm B}(\beta\hbar\omega)^2\frac{e^{\beta\hbar\omega}}{(e^{\beta\hbar\omega}-1)^2}$$`,
        ],
      },
      {
        title: "作业 3 Q1 主线：先懂结构，再攻积分",
        summary: "这题数学体积最大，优先掌握 8 个逻辑节点。",
        paragraphs: [
          "① 插入 energy completeness；② 用 En 与 φn(x) 写 thermal kernel；③ Hermite 的 Rodrigues derivative 经 Fourier 变为 (ik)^n；④ 对 n 用指数级数求和；⑤ 做 2×2 Gaussian；⑥ 把零点能、本征函数与积分 prefactor 重新装回 K；⑦ 取 diagonal trace 得 Z；⑧ 再求 ⟨x²⟩ 与 U。",
          "多维 Gaussian 正确公式的 source term 指数是 +½JᵀA⁻¹J。题目印成负号；因 J 含 i，最终空间 Gaussian 仍是负指数。",
          "自检：T→0 时 ⟨x²⟩→ℏ/(2mω)、U→ℏω/2；高温 U→kBT。",
        ],
        formulas: [
          "K(x,x′;β)=Σn e^{-βEn}φn(x)φn*(x′)",
          String.raw`$$K(x,x';\beta)=\sqrt{\frac{m\omega}{2\pi\hbar\sinh(\beta\hbar\omega)}}\exp\!\left[-\frac{m\omega}{4\hbar}\left((x+x')^2\tanh\frac{\beta\hbar\omega}{2}+(x-x')^2\coth\frac{\beta\hbar\omega}{2}\right)\right]$$`,
          "Z=∫dx K(x,x;β)=1/[2sinh(βℏω/2)]",
          String.raw`$$\rho(x,x')=\frac{K(x,x';\beta)}{Z},\qquad \langle H\rangle=\frac{\hbar\omega}{2}\coth\!\left(\frac{\beta\hbar\omega}{2}\right)$$`,
          "⟨x²⟩=ℏ/[2mω] coth(βℏω/2)",
        ],
      },
      {
        title: "多维 Gaussian 勘误",
        summary: "固定采用一个标准，避免被题目符号带错。",
        paragraphs: [
          "若指数是 −½xᵀAx+Jᵀx，积分结果是正的 +½JᵀA⁻¹J。",
          "若 source 写成 iJ，则代入后 i² 会让最终实空间指数为负；不要因此把标准公式的正号改掉。",
          "每次检查 A positive definite、detA>0 与一维特例。",
        ],
      },
    ],
    practice: [
      {
        title: "trace 练习",
        instruction: "ρ=diag(3/4,1/4)，求 Trρ、purity。",
        answer: "Trρ=1；Trρ²=9/16+1/16=5/8，故 mixed。",
      },
      {
        title: "量子 canonical",
        instruction: "在 energy basis 写 ρnm。",
        answer: "ρnm=δnm e^{-βEn}/Z（非简并能量本征基）。",
      },
      {
        title: "极限自检",
        instruction: "解释 quantum oscillator 高温 U→kBT 的自由度来源。",
        answer: "一维谐振子有 p² 与 q² 两个经典二次项，各 kBT/2。",
      },
    ],
    gate: {
      prompt:
        "闭卷写 density matrix 四性质、purity、trace expectation、quantum Liouville 与三种 ρ。",
      criteria: [
        "能手算一个 2×2 矩阵的 †、eigenvalues 与 trace",
        "Schrödinger/Liouville 符号正确",
        "ρ² 与 Trρ² 不混",
        "平衡 off-diagonal 条件说清",
        "作业 2 Q2 的高低温极限与作业 3 Q1 七步都能复述",
      ],
    },
  },
  {
    id: "quantum-statistics",
    phase: "quantum",
    phaseLabel: "量子统计",
    week: "Week 10",
    title: "全同粒子、占据数与 BE/FD 分布",
    english: "Identical particles and quantum statistics",
    hoursCore: 6,
    hoursFull: 10,
    goal: "从交换对称性与占据数表象，推到 Boson/Fermion 的巨配分函数、平均占据与涨落。",
    why: "这是后面 Bose/Fermi 气体共同的发动机，也是作业 3 Q2 最直接的 25 分。",
    prerequisites: [
      "quantum-bridge",
      "grand-canonical",
      "probability-counting 的 geometric/Bernoulli",
    ],
    outcomes: [
      "能解释 exchange symmetry 与 Pauli exclusion",
      "能读能级 εi、简并度 gi、占据数 niα",
      "能写 BE/FD multiplicity 与约束",
      "能用 grand canonical factorization 推 ΞB/ΞF",
      "能求平均占据、单态概率与方差",
      "能正确识别 Maxwell–Boltzmann classical limit",
    ],
    sourceRefs: [
      "课件 8 slides 1–14, 19",
      "作业 3 Q2",
      "David Tong Ch. 3.5–3.6",
      "MIT OCW L22–23",
    ],
    concepts: [
      {
        title: "exchange symmetry 决定允许的多粒子态",
        label: "Boson vs Fermion",
        core: true,
        intuition:
          "全同粒子的标签没有物理意义；交换两粒子后，波函数只能保持或变号。",
        explanation: [
          "exchange twice 必须回到原态；三维普通粒子 phase 只允许 +1 或 −1。",
          "Boson wavefunction symmetric；Fermion antisymmetric。",
          "两个 Fermion 若占同一单粒子态，交换既不改变状态又应变号，只能波函数为零——Pauli exclusion。",
          "2D 可有更一般 anyon phase，是课件提及的拓展，不在考试主线。",
        ],
        formula: "P12Ψ=+Ψ (boson);  P12Ψ=−Ψ (fermion)",
        example: {
          question: "为什么两个 Boson 能共享同一态，而两个相同 Fermion 不能？",
          solution: [
            "同态交换后空间部分不变",
            "Boson 的 + 对称允许",
            "Fermion 要变号却又是同一函数，只能为零",
          ],
        },
        pitfalls: [
          "exchange phase 当普通经典概率",
          "Pauli exclusion 说成所有 Fermion 不能靠近",
          "自旋/空间部分对称性未看总波函数",
        ],
        check: {
          question:
            "电子是 Boson 还是 Fermion？同一单粒子轨道为何仍可有两个电子？",
          answer:
            "电子是 Fermion；若自旋相反，它们占据不同 spin-orbitals，完整单粒子态不同。",
        },
      },
      {
        title: "occupation-number representation",
        label: "新坐标",
        core: true,
        intuition:
          "不再给粒子贴 1、2、3 标签，而记录每个单粒子态里有几个粒子。",
        explanation: [
          "能级 i 能量 εi、简并 gi；用 substate α=1…gi，occupation niα。",
          "Boson niα=0,1,2,…；Fermion niα=0 或 1。",
          "总粒子 N=Σiαniα，总能量 E=Σiαεi niα（noninteracting）。",
          "noninteracting 让不同 substate 的能量相加，是 grand product factorization 的关键。",
        ],
        formula: "N=Σi,α niα;  E=Σi,α εi niα",
        example: {
          question:
            "能级 ε 有三重简并 gi=3，Fermion 该能级最多容纳几个同种粒子？",
          solution: [
            "每个 substate 最多 1 个",
            "共有 3 个 substates",
            "最多 3 个",
          ],
        },
        pitfalls: [
          "level occupation ni 与 substate niα 混",
          "带 gi 的总 occupation 与单态 occupation 混",
          "有相互作用时仍写 E 简单相加",
        ],
        check: {
          question: "Boson 的一个 substate 最大 occupation 是多少？",
          answer:
            "没有 Pauli 上限，可为任意非负整数（在给定总 N 下当然不超过 N）。",
        },
      },
      {
        title: "microcanonical counting 与最可能分布",
        label: "组合路线",
        core: true,
        intuition:
          "给定每个能级的粒子数 ni，数这些粒子怎样放进 gi 个 substate，再在 N/E 约束下找 W 最大。",
        explanation: [
          "Boson level multiplicity WB,i=(ni+gi−1)!/[ni!(gi−1)!]。",
          "Fermion WF,i=gi!/[ni!(gi−ni)!]。",
          "总 W=ΠiWi；最大化 lnW−αΣini−βΣiεini。",
          "Stirling 给 n*i=gi/[e^{α+βεi}∓1]，识别 α=−βμ。",
        ],
        formula: "n̄i=gi/[e^{β(εi−μ)}∓1]",
        formulaNote:
          "减号 Boson、加号 Fermion；这里带 gi 是整个简并能级总 occupation。",
        steps: [
          "先写 Wi",
          "乘成 W",
          "写 N/E 约束",
          "Stirling+Lagrange",
          "识别 β,μ",
        ],
        example: {
          question: "如何不用死记 ±？",
          solution: [
            "Boson 可聚集，occupation 应比 classical 更大",
            "分母用 −1 更小",
            "Fermion 分母 +1，occupation 被压低且≤gi",
          ],
        },
        pitfalls: [
          "± 记反",
          "gi 漏掉",
          "most probable 与 exact average 无条件混",
          "Stirling 用在很小 ni",
        ],
        check: {
          question: "Fermion 总 occupation n̄i 为什么不会超过 gi？",
          answer: "分母 e^{β(ε−μ)}+1≥1，因此 n̄i≤gi；T→0 深在 μ 下时趋 gi。",
        },
      },
      {
        title: "grand canonical factorization：更快的主路线",
        label: "作业 3 Q2",
        core: true,
        intuition:
          "去掉固定总 N 的约束后，每个 substate 可以独立求和；整个 Ξ 是单态因子的乘积。",
        explanation: [
          "令 q=e^{-β(ε−μ)}。Boson 单态 sum Σn=0∞qⁿ=1/(1−q)。",
          "Fermion 单态 sum 1+q，因为 n 仅 0/1。",
          "含简并 gi：ΞB=Πi(1−q_i)^{-gi}；ΞF=Πi(1+q_i)^{gi}。",
          "对 εi 或 μ 求导得到 occupation；比组合路线更直接且给 exact ensemble average。",
        ],
        formula: "ΞB=Πi[1−ze^{-βεi}]^{-gi};  ΞF=Πi[1+ze^{-βεi}]^{gi}",
        steps: [
          "写 exponent Σ(ε−μ)n",
          "把 sum 对每个 substate factorize",
          "做 geometric/two-term sum",
          "乘简并次数",
          "取 ln 与导数",
        ],
        example: {
          question:
            "一个 Fermion substate 的 mean occupation 如何由 Ξ=1+q 求？",
          solution: [
            "n̄=(1/β)∂μln(1+q)",
            "∂μq=βq",
            "n̄=q/(1+q)=1/[e^{β(ε−μ)}+1]",
          ],
        },
        pitfalls: [
          "Boson convergence μ≤ground energy 不检查",
          "gi 次方漏",
          "对 ε 求导符号漏负号",
        ],
        check: {
          question: "固定 N canonical 为何难 factorize？",
          answer:
            "occupation numbers 受 Σni=N 的全局约束耦合；grand canonical 用 μ 放松约束后各 mode 独立。",
        },
      },
      {
        title: "单态概率、涨落与 classical limit",
        label: "分布细节",
        core: true,
        intuition:
          "Boson 单态是 geometric、Fermion 是 Bernoulli、稀薄 classical 是 Poisson；它们的方差立刻暴露统计差别。",
        explanation: [
          "Boson P(n)=(1−q)qⁿ，n=0,1,…；Var n=n̄(1+n̄)，有 bunching。",
          "Fermion P(n)=qⁿ/(1+q)，n=0,1；Var n=n̄(1−n̄)，Pauli 抑制涨落。",
          "统一 Var n=n̄(1±n̄)，上加 Boson、下减 Fermion。",
          "classical limit 不是 β→∞，而是 occupation 稀薄：e^{β(ε−μ)}≫1 或 nλT³≪1，±1 可忽略。",
        ],
        formula: "n̄≈e^{-β(ε−μ)} when nλT³≪1",
        example: {
          question: "n̄=0.1 时 Boson/Fermion 方差分别多少（单 substate）？",
          solution: [
            "Boson 0.1×1.1=0.11",
            "Fermion 0.1×0.9=0.09",
            "classical Poisson 约 0.1，夹在两者之间",
          ],
        },
        pitfalls: [
          "classical limit 写 β→∞（其实低温更量子）",
          "带 gi 的 level variance 与单 substate 混",
          "Boson μ 超过 ground energy导致发散",
        ],
        check: {
          question:
            "Boson/Fermion distribution 在什么物理条件下都近似 Maxwell–Boltzmann？",
          answer:
            "高温、低密度、phase-space density nλT³≪1，使平均 occupation 很小。",
        },
      },
    ],
    deepDives: [
      {
        title: "作业 3 Q2：单态概率与涨落完整链",
        summary:
          "从单 mode grand factor 出发，不跳步地得到概率、平均占据和 Bose/Fermi 涨落。",
        paragraphs: [
          "先令 q=e^{-β(ε−μ)}。Boson 可占 n=0,1,2,…，归一化后是 geometric distribution；Fermion 只可占 0/1，是 Bernoulli distribution。",
          "对每个能级 εi 求 −β^{-1}∂_{εi}lnΞ，可直接得到整个 gi 重简并能级的 exact ensemble average；二阶导数则给 occupation fluctuation。",
          "这条路线正好对应作业 3 Q2 的指定步骤，也清楚地区分单个 substate 与带 gi 的整个 level。",
        ],
        formulas: [
          String.raw`$$P_B(n)=(1-q)q^n,\quad \operatorname{Var}_B(n)=\bar n(1+\bar n);\qquad P_F(n)=\frac{q^n}{1+q},\quad \operatorname{Var}_F(n)=\bar n(1-\bar n)$$`,
          String.raw`$$\bar n_i=-\frac{1}{\beta}\frac{\partial\ln\Xi}{\partial\varepsilon_i}=\frac{g_i}{e^{\beta(\varepsilon_i-\mu)}\mp1}$$`,
        ],
      },
      {
        title: "balls-in-boxes 三种统计一眼图",
        summary: "先问粒子是否可区分，再问盒子是否允许多占据。",
        paragraphs: [
          "Maxwell–Boltzmann：粒子可区分，substates 有标签；排列数含 N!/Πni!。",
          "Bose–Einstein：粒子全同，盒子可多占；用 stars-and-bars。",
          "Fermi–Dirac：粒子全同，盒子最多一个；用 combinations。",
        ],
      },
      {
        title: "quantum gas equation of state 的统一符号",
        summary: "不同教材定义 Bose/Fermi function 的符号不同，先看 integral。",
        paragraphs: [
          "最安全做法是从 lnΞ=∓Σi gi ln(1∓ze^{-βεi}) 出发，再做 continuum limit。",
          "不要只背 gν/fν 的字母；确认分母是 z^{-1}e^x−1 还是 +1，以及 Γ(ν) 归一化。",
        ],
      },
    ],
    practice: [
      {
        title: "单 mode partition",
        instruction: "分别写一个 Boson 与 Fermion substate 的 Ξ、n̄、Var。",
        answer:
          "B: Ξ=1/(1−q), n̄=q/(1−q), Var=n̄(1+n̄)。F: Ξ=1+q, n̄=q/(1+q), Var=n̄(1−n̄)。",
      },
      {
        title: "简并度",
        instruction: "若 gi=4，写该能级 Boson/Fermion mean total occupation。",
        answer: "Boson 4/[e^{β(ε−μ)}−1]；Fermion 4/[e^{β(ε−μ)}+1]。",
      },
      {
        title: "classical criterion",
        instruction: "写 thermal wavelength 并给 classical condition。",
        answer: "λT=h/√(2πmkBT)；nλT³≪1。",
      },
    ],
    gate: {
      prompt:
        "闭卷从单 substate sum 推 ΞB/ΞF、n̄、P(n)、Var，并解释 classical limit。",
      criteria: [
        "± 号零错误",
        "gi 与 substate 区分",
        "μ convergence 说明",
        "不把 β→∞ 当 classical limit",
      ],
    },
  },
  {
    id: "bose-gas",
    phase: "quantum",
    phaseLabel: "量子统计",
    week: "Week 11",
    title: "理想 Bose 气体、BEC、光子与声子",
    english: "Ideal Bose gas, photons and phonons",
    hoursCore: 7,
    hoursFull: 12,
    goal: "掌握 continuum/DOS → Bose functions → thermodynamics → BEC 的统一路线，并能处理 photon/phonon 的线性色散。",
    why: "这一周公式多，但它们都来自同一台机器：色散决定 DOS，DOS 与占据数积分决定热力学。",
    prerequisites: [
      "quantum-statistics",
      "math-toolbox 的 Gamma/积分/无量纲化",
      "canonical 的 derivative machine",
    ],
    outcomes: [
      "能做 Σk→积分和 3D DOS",
      "能写 thermal wavelength、gν(z)、P/N/U",
      "能解释 BEC 的 excited-state saturation 与 ground-state 单列",
      "能求 Tc、condensate fraction、低温 CV 标度",
      "能解释 photon μ=0、Planck/Stefan–Boltzmann",
      "能解释 Debye cutoff 与 T³ heat capacity",
    ],
    sourceRefs: [
      "课件 9 slides 1–18",
      "作业 3 Q3",
      "David Tong Ch. 3.1–3.5",
      "MIT OCW L20, L25",
    ],
    concepts: [
      {
        title: "continuum limit 与 DOS 是所有气体题的入口",
        label: "k-space counting",
        core: true,
        intuition:
          "大盒子里 k 点非常密，把逐态求和换成球壳积分；色散 ε(k) 决定每个能量壳有多少状态。",
        explanation: [
          "周期边界三维：Σk→V/(2π)³∫d³k=V/(2π)³4π∫k²dk。",
          "非相对论 ε=ℏ²k²/(2m)，所以 D(ε)∝V ε^{1/2}。",
          "线性色散 ε=ℏck，所以 D(ε)∝V ε²。",
          "任何 spin/polarization degeneracy gs 要乘上；BEC ground state k=0 必须单列，不能被 continuum integral 淹没。",
        ],
        formula: "Σk → V/(2π)³ ∫d³k;  D(ε)=gs V/(2π)³·4πk²·dk/dε",
        steps: [
          "写 boundary state density",
          "转 spherical k integral",
          "代 dispersion 求 dk/dε",
          "乘 degeneracy",
          "检查 ground state",
        ],
        example: {
          question: "为何 3D quadratic dispersion 的 DOS 随 √ε？",
          solution: ["k² shell factor", "ε∝k² ⇒ dk/dε∝1/k", "相乘 k²·1/k∝k∝√ε"],
        },
        pitfalls: [
          "(2π)³ 漏",
          "用 p 与 k 时 ℏ 混",
          "spin/polarization 漏",
          "ground state 直接积分",
        ],
        check: {
          question: "2D quadratic dispersion 的 DOS 对 ε 怎样？",
          answer: "常数，因为 k shell 因子 k 与 dk/dε∝1/k 抵消。",
        },
      },
      {
        title: "三维非相对论 Bose 气体的 thermodynamic machine",
        label: "Bose functions",
        core: true,
        intuition:
          "把 occupation 积分无量纲化后，所有温度/化学势依赖被压进 λT 与 gν(z)。",
        explanation: [
          "λT=h/√(2πmkBT)，z=e^{βμ}，ground energy 取 0 时 0<z≤1。",
          "excited density ne=λT^{-3}g_{3/2}(z)，pressure P=kBT λT^{-3}g_{5/2}(z)。",
          "U=3PV/2 对 quadratic dispersion 成立。",
          "gν(z)=Γ(ν)^{-1}∫₀∞x^{ν−1}/(z^{-1}e^x−1)dx；半整数必须用 Γ，不写普通 factorial。",
        ],
        formula: "n=n0+λT^{-3}g3/2(z);  P=kBTλT^{-3}g5/2(z);  U=3PV/2",
        example: {
          question: "高温低密度时怎样恢复 ideal gas？",
          solution: [
            "z≪1 时 gν(z)≈z",
            "n≈z/λ³、P≈kBT z/λ³",
            "消去 z 得 P≈nkBT",
          ],
        },
        pitfalls: [
          "g3/2 与 g5/2 对换",
          "λT 写反",
          "μ>0 导致 z>1",
          "Γ(ν) 误写 (ν−1)! 对半整数照用",
        ],
        check: {
          question: "为什么 Boson 的 μ（ground energy 设 0）不能大于 0？",
          answer:
            "否则 ground-state factor 1−ze^{-βε0}=1−z 会非正/发散，occupation 不物理；需 z≤1。",
        },
      },
      {
        title: "BEC：不是粒子突然没有能量，而是激发态装满",
        label: "相变核心",
        core: true,
        intuition:
          "温度降低时 λT 变大；当激发态能容纳的最大密度有限，多余粒子只能宏观占据 ground state。",
        explanation: [
          "z 增大到最大 1 时，激发密度上限 ne,max=ζ(3/2)/λT³。",
          "固定总密度 n；定义 Tc 使 n=ζ(3/2)/λTc³。",
          "T<Tc 时 z=1、N0/N=1−(T/Tc)^{3/2}。",
          "理想均匀 Bose gas below Tc 的 P 只依赖 T、不依赖总密度，compressibility 异常大；真实相互作用会修正。",
        ],
        formula: "Tc=[2πℏ²/(mkB)] [n/ζ(3/2)]^{2/3};  N0/N=1−(T/Tc)^{3/2}",
        steps: [
          "单列 N0",
          "令 z→1 找 excited maximum",
          "固定 N 解 Tc",
          "below Tc 固定 z=1",
          "用 N−Ne 得 condensate",
        ],
        example: {
          question: "T=Tc/4 时理想三维 Bose 气体 condensate fraction 是多少？",
          solution: ["(T/Tc)^{3/2}=(1/4)^{3/2}=1/8", "N0/N=1−1/8=7/8"],
        },
        pitfalls: [
          "把 N0 也放进 continuum integral",
          "认为 BEC 等于所有粒子能量为零",
          "任意维数/色散都套 ζ(3/2)",
          "BEC 与 superfluid 完全等同",
        ],
        check: {
          question: "BEC 发生的三个条件如何概括？",
          answer:
            "粒子数有效守恒；激发态在 μ→ε0 时容量有限；多余粒子可宏观占据 ground state。",
        },
      },
      {
        title: "热容与 statistical attraction",
        label: "相变信号",
        core: true,
        intuition:
          "below Tc，只有 excited particles 携带热能；它们数量随 T^{3/2} 增长，因此 U 与 CV 有特定幂律。",
        explanation: [
          "均匀 quadratic Bose gas below Tc：P∝T^{5/2}、U∝T^{5/2}、CV∝T^{3/2}。",
          "Tc 处 heat capacity 有 cusp（理想三维 Bose 气体的具体连续性/导数结构由函数决定）。",
          "Boson exchange 在 virial expansion 中表现为 statistical attraction；不是 Hamiltonian 里新增真实 pair potential。",
          "真实 ⁴He 强相互作用且 superfluid transition 与 ideal BEC 不可直接等同。",
        ],
        formula: "T<Tc: CV ∝ T^{3/2} (3D quadratic ideal Bose gas)",
        example: {
          question: "T→0 时理想 Bose gas CV 为什么趋 0？",
          solution: [
            "绝大多数粒子在 ground state",
            "可热激发粒子密度随 T^{3/2} 消失",
            "U 对 T 的变化趋零",
          ],
        },
        pitfalls: [
          "statistical attraction 当真实相互作用",
          "⁴He 的 2.17 K 直接用 ideal formula",
          "不同色散的 CV 幂律混",
        ],
        check: {
          question: "3D linear-dispersion boson below Tc 的 CV 幂律会怎样？",
          answer: "DOS∝ε²，U∝T⁴，所以 CV∝T³；这正是作业 3 Q3。",
        },
      },
      {
        title: "photon gas：粒子数不守恒所以 μ=0",
        label: "黑体",
        core: true,
        intuition: "腔壁能吸收/发射光子，平衡只固定能量，不固定光子数。",
        explanation: [
          "photon dispersion ε=ℏck，两个 polarization，μ=0。",
          "occupation n̄k=1/(e^{βℏck}−1)，结合 DOS 得 Planck spectrum。",
          "积分后 energy density u∝T⁴，pressure P=u/3，total U=3PV。",
          "低频 classical equipartition 导致 Rayleigh–Jeans catastrophe；quantization 修复高频发散。",
        ],
        formula: "u(ω)=ℏω³/[π²c³(e^{βℏω}−1)];  U/V=aT⁴;  P=U/(3V)",
        example: {
          question:
            "为什么 photon grand partition 可用 μ=0 而不是固定 N 解 μ？",
          solution: [
            "光子可被腔壁产生/吸收",
            "平衡态不约束总光子数",
            "对应 Lagrange multiplier μ=0",
          ],
        },
        pitfalls: [
          "把 N 叫 Lagrange multiplier",
          "漏 2 polarization",
          "Stefan–Boltzmann energy density 与 radiated flux 常数混",
        ],
        check: {
          question: "提高黑体温度，total energy density 怎样变？",
          answer: "按 T⁴ 增长；谱峰也向高频移动（Wien displacement）。",
        },
      },
      {
        title: "phonon 与 Debye T³",
        label: "晶格振动",
        core: true,
        intuition:
          "低温只激发长波 acoustic modes，它们像三种线性色散的 Boson；态密度给 T³ 热容。",
        explanation: [
          "phonon 不是守恒粒子，μ=0；低 k acoustic dispersion ω≈ck。",
          "三条 acoustic polarization/branch 给 DOS∝ω²。",
          "Debye cutoff ωD 由总 mode 数 ∫₀^{ωD}g(ω)dω=3N 确定。",
          "T≪TD：CV∝T³；T≫TD：回到 Dulong–Petit 3NkB。",
        ],
        formula: "low T Debye: CV=(12π⁴/5)NkB(T/TD)³;  high T: CV→3NkB",
        example: {
          question: "为什么 real phonon dispersion 很复杂，低温仍常有 T³？",
          solution: [
            "低温只占据低能长波 modes",
            "它们在 Γ 点附近普遍近线性",
            "高能 optical/非线性细节被冻结",
          ],
        },
        pitfalls: [
          "ωD 当真实最高频率精确细节",
          "漏 3 acoustic branches",
          "任何温度都用 T³",
        ],
        check: {
          question: "金属低温总热容为何常写 γT+δT³？",
          answer:
            "Fermi electron contribution ∝T，加上 Debye phonon contribution ∝T³。",
        },
      },
    ],
    deepDives: [
      {
        title: "作业 3 Q3：题名说 arbitrary，其实算 3D linear dispersion",
        summary: "不要把特例结果误当任意 d/s。",
        paragraphs: [
          "正文固定 ε=cp（量子写 ε=ℏck）且 V=L³，所以 DOS∝ε²，使用 g4 与 g3。",
          "得到 P∝T⁴g4(z)、U=3PV、nexc∝T³g3(z)，Tc∝n^{1/3}。",
          "below Tc，CV∝T³；临界低温侧 CV/(NkB)=12ζ(4)/ζ(3)≈10.805。原答案误写 3；3 是 classical linear-dispersion gas 的每粒子热容。",
        ],
        formulas: [
          "$$\\frac{D(\\varepsilon)}{V}=\\frac{g_d\\varepsilon^2}{2\\pi^2(\\hbar c)^3};\\quad n_{\\mathrm{exc}}\\propto T^3g_3(z);\\quad P\\propto T^4g_4(z);\\quad U=3PV;\\quad T_c\\propto n^{1/3};\\quad \\frac{C_V(T_c^-)}{Nk_{\\mathrm B}}=\\frac{12\\zeta(4)}{\\zeta(3)}$$",
        ],
      },
      {
        title: "harmonic trap BEC",
        summary: "课件 slide 12 的实验应用，主线只记 DOS 改变指数。",
        paragraphs: [
          "三维 harmonic trap 的 DOS∝ε²，Nexc∝T³g3(z)，所以 condensate fraction 约 1−(T/Tc)³。",
          "这与均匀盒中 quadratic gas 的 3/2 次幂不同；几何/势阱改变 DOS。",
        ],
        formulas: [
          "$$N_{\\mathrm{exc}}=\\left(\\frac{k_{\\mathrm B}T}{\\hbar\\bar\\omega}\\right)^3g_3(z);\\quad T_c=\\frac{\\hbar\\bar\\omega}{k_{\\mathrm B}}\\left[\\frac{N}{\\zeta(3)}\\right]^{1/3};\\quad \\frac{N_0}{N}=1-\\left(\\frac{T}{T_c}\\right)^3$$",
        ],
      },
      {
        title: "Bose function 防混表",
        summary: "看 DOS 的能量幂，就知道函数索引。",
        paragraphs: [
          "若 D(ε)∝ε^{s−1}，number integral 通常给 g_s(z)，energy/pressure 再多一个 ε 给 g_{s+1}(z)。",
          "始终从 integral 定义出发；不同书对 gν、Liν 可能采用不同 prefactor。",
        ],
        formulas: [
          "$$D(\\varepsilon)=C\\varepsilon^{s-1}\\Longrightarrow N_{\\mathrm{exc}}=C\\Gamma(s)(k_{\\mathrm B}T)^sg_s(z);\\quad U=C\\Gamma(s+1)(k_{\\mathrm B}T)^{s+1}g_{s+1}(z)$$",
        ],
      },
    ],
    practice: [
      {
        title: "DOS",
        instruction: "推导 3D linear dispersion 的 DOS 能量幂。",
        answer: "k²dk shell；ε=ℏck ⇒ dk/dε 常数；所以 D(ε)∝k²∝ε²。",
      },
      {
        title: "condensate",
        instruction: "均匀 3D quadratic Bose gas 在 T=0.64Tc 时 N0/N 是多少？",
        answer: "1−0.64^{3/2}=1−0.512=0.488。",
      },
      {
        title: "photon/phonon",
        instruction: "解释二者为什么 μ=0，并分别给低温/总能量标度。",
        answer: "粒子数不守恒；photon u∝T⁴，Debye phonon low-T CV∝T³。",
      },
    ],
    gate: {
      prompt:
        "从 Σk→DOS 开始，闭卷推一次 n/P/U 的函数结构，再完整讲 BEC 三条件和 photon/phonon 差别。",
      criteria: [
        "ground state 单列",
        "g3/2/g5/2 不混",
        "Tc 与 condensate exponent 正确",
        "作业 3 Q3 的 10.805 勘误知道",
      ],
    },
  },
  {
    id: "fermi-gas",
    phase: "quantum",
    phaseLabel: "量子统计",
    week: "Week 12",
    title: "理想 Fermi 气体：从填海到低温展开",
    english: "Ideal Fermi gas",
    hoursCore: 5,
    hoursFull: 9,
    goal: "先用 T=0 的“从低到高填满状态”建立直觉，再用 Sommerfeld 展开理解金属电子的低温热容和 Pauli 顺磁。",
    why: "Fermi 气体最容易被一串特殊函数吓住。真正的骨架只有三步：数 k 空间状态、找到 Fermi 面、只处理 Fermi 面附近约 kBT 厚的一薄层。",
    prerequisites: [
      "quantum-statistics：能写 Fermi–Dirac 平均占据数",
      "bose-gas 中的 DOS 桥：会把 Σk 变成能量积分",
      "JIT 数学：球壳体积、分部积分；Sommerfeld 公式可在本节现用现学",
    ],
    outcomes: [
      "能从 k 空间态计数推导 kF、εF、TF",
      "能解释 T=0 时的 Fermi sea、Fermi surface 与 degeneracy pressure",
      "能推出 E0/N=3εF/5 和 P0=2E0/(3V)",
      "会在固定 N 条件下使用 Sommerfeld 展开得到 μ(T) 与 CV∝T",
      "能识别作业 3 Q4 的二维 DOS 为常数，并处理二维结果",
    ],
    sourceRefs: [
      "课件 9 slides 19–35",
      "作业 3 Q4 与答案 pp. 15–19",
      "David Tong Ch. 3.6",
    ],
    concepts: [
      {
        title: "T=0 的填海规则",
        label: "先建立图像",
        core: true,
        intuition:
          "Fermion 像不能共用座位的观众：从最低能座位开始依次坐满，最后一排就是 Fermi surface。",
        explanation: [
          "Pauli 原理限制每个单粒子量子态最多放一个同种 Fermion；若把自旋算进简并度 gs，则同一空间波矢可有 gs 个粒子。",
          "T=0 时能量最小的多粒子态不是所有粒子都在基态，而是把 ε≤εF 的态全部填满。",
          "平均占据 n̄(ε)=1/[e^{β(ε−μ)}+1] 在 T→0 时成为阶跃函数：ε<μ 时为 1，ε>μ 时为 0。",
          "最高被占据的能量 εF 定义 Fermi energy；TF=εF/kB 只是把该能量换成温度尺度，并不表示气体真的处于 TF。",
        ],
        formula: "n̄(ε,T=0)=Θ(εF−ε)",
        formulaNote:
          "阶跃的高度若 DOS 已包含自旋简并，就仍是每单粒子态 1；不要把 gs 重复乘两次。",
        steps: [
          "先声明系统维数、边界条件和自旋简并 gs",
          "在 k 空间数 |k|≤kF 内的状态",
          "令总态数等于 N，解 kF",
          "代入 ε(k)=ℏ²k²/(2m) 得 εF",
        ],
        example: {
          question: "三维盒中自旋 1/2 粒子为何有 N=2·V(4πkF³/3)/(2π)³？",
          solution: [
            "周期边界下每个 k 态占 k 空间体积 (2π)³/V",
            "球内体积是 4πkF³/3",
            "电子有两个自旋态，所以乘 gs=2",
            "化简得 n=N/V=kF³/(3π²)",
          ],
        },
        pitfalls: [
          "把 εF 当成所有粒子的平均能量",
          "忘记自旋简并或重复乘自旋简并",
          "把 Fermi surface 当成真实空间表面；它在动量/k 空间",
        ],
        check: {
          question: "T=0 时为何仍有非零压强，明明没有热运动？",
          answer:
            "Pauli 原理迫使粒子占据非零动量态；压缩体积会增大 k 态间隔和 kF，从而提高总能量，产生简并压强。",
        },
      },
      {
        title: "三维 Fermi 尺度与基态热力学",
        label: "必会推导",
        core: true,
        intuition:
          "所有宏观量都由“填到多高”决定；密度越大，必须填到更大的 kF 和 εF。",
        explanation: [
          "一般自旋简并 gs 下，n=gs kF³/(6π²)，所以 kF=(6π²n/gs)^{1/3}。",
          "三维非相对论 DOS 与 √ε 成正比。把能量从 0 积到 εF 得 N，再多乘一个 ε 积分得到 E0。",
          "比值积分直接给 E0/N=3εF/5；这不是每个粒子的能量，而是所有填充态的平均。",
          "二次色散的 virial relation 给 P=2E/(3V)，故 P0=2nεF/5。",
        ],
        formula: "kF=(6π²n/gs)^(1/3),  εF=ℏ²kF²/(2m),  E0/N=3εF/5,  P0=2nεF/5",
        formulaNote: "标度检查：kF∝n^{1/3}，εF∝n^{2/3}，压强∝n^{5/3}。",
        steps: [
          "写 D(ε)=Cε^{1/2}",
          "用 N=∫₀^εF D(ε)dε 固定常数/上限",
          "用 E=∫₀^εF εD(ε)dε",
          "做两个幂积分后取 E/N",
          "用 P=−(∂E/∂V)N 或 virial relation 检查",
        ],
        example: {
          question: "若密度增大 8 倍，kF、εF 与 P0 各变多少倍？",
          solution: [
            "kF∝n^{1/3}，变 2 倍",
            "εF∝n^{2/3}，变 4 倍",
            "P0∝n^{5/3}，变 8^{5/3}=32 倍",
          ],
        },
        pitfalls: [
          "用体积球面 4πk² 而忘记 dk",
          "把 h 与 ℏ 的相空间格点混用",
          "没有写 gs 的定义",
        ],
        check: {
          question: "为什么 E0/N 小于 εF？",
          answer:
            "εF 是最高占据能量；其下从 0 到 εF 的大量状态也被占据，平均自然低于最高值，三维结果为 3εF/5。",
        },
      },
      {
        title: "有限温度：只有 Fermi 面附近在变化",
        label: "低温核心",
        core: true,
        intuition:
          "深埋在 Fermi 海里的粒子没有空位可跳；只有表面附近约 kBT 的薄壳能被热激发。",
        explanation: [
          "当 T≪TF 时，Fermi–Dirac 阶跃只在 εF 附近被抹平。低能态几乎仍满，高能态几乎仍空。",
          "固定 N 很重要：升温时 μ 会略微下降，以补偿阶跃两侧 DOS 不对称造成的粒子数变化。",
          "Sommerfeld 展开把 ∫φ(ε)fFD(ε)dε 写成 0→μ 的零温积分加上与 (kBT)² 成正比的边界修正。",
          "三维非相对论气体 μ≈εF[1−(π²/12)(T/TF)²]；能量修正∝T²，所以 CV=(π²/2)NkB(T/TF)，线性于 T。",
        ],
        formula:
          "∫₀∞φ(ε)fFD dε ≈ ∫₀^μ φ(ε)dε + (π²/6)(kBT)²φ′(μ);  CV=(π²/2)NkB(T/TF)",
        formulaNote:
          "适用条件：φ 在 μ 附近平滑、kBT≪μ；固定 N 时必须先由 number equation 解 μ(T)。",
        steps: [
          "明确积分算 N 还是 U，并写 φ(ε)",
          "对 N 使用展开，令结果保持 N(T)=N(0)",
          "解出 μ(T) 到 T² 阶",
          "把 μ(T) 代入 U 的展开",
          "最后 CV=(∂U/∂T)V,N",
        ],
        example: {
          question: "为何低温 Fermi 气体 CV∝T，而经典理想气体 CV 与 T 无关？",
          solution: [
            "经典气体几乎所有粒子都可吸热，equipartition 给每粒子固定贡献",
            "Fermi 气体只有比例约 T/TF 的表面粒子可被激发",
            "每个活跃粒子的典型能量变化约 kBT",
            "总能量修正约 N(T/TF)kBT∝T²，因此 CV∝T",
          ],
        },
        pitfalls: [
          "直接令 μ=εF 后求所有 T² 系数；固定 N 时 μ(T) 的修正可能同阶",
          "在 T 与 TF 可比时仍使用 Sommerfeld 展开",
          "把电子热容的线性 T 项与 phonon 的 T³ 项混淆",
        ],
        check: {
          question: "Sommerfeld 展开前必须问哪三个问题？",
          answer:
            "是否低温 kBT≪μ；积分权重 φ 是否在 μ 附近平滑；系统保持 μ 还是保持 N。",
        },
      },
      {
        title: "二维 Fermi 气体与作业 3 Q4",
        label: "考核对齐",
        core: true,
        intuition:
          "二维最特别之处是二次色散的 DOS 与能量无关；很多积分因此比三维更直接。",
        explanation: [
          "二维 k 空间数圆盘：N=gs AπkF²/(2π)²，所以 kF²=4πn/gs。",
          "ε=ℏ²k²/(2m) 导致单位面积 DOS D(ε)/A=gs m/(2πℏ²)，是常数。",
          "number equation 可精确积分：n=D0 kBT ln(1+e^{βμ})。低温时 μ 接近 εF，修正不是通常的 T² 幂，而是指数小。",
          "作业要求的压力/能量可从巨势或积分得到；二维二次色散满足 PA=U。",
        ],
        formula: "D2D(ε)/A=gs m/(2πℏ²),  εF=2πℏ²n/(gs m),  PA=U",
        formulaNote:
          "使用答案时先核对它采用的 gs；若公式差 2，通常是自旋简并约定不同。",
        steps: [
          "先画二维 k 圆盘并数态",
          "求 D2D 为常数",
          "从 N 方程求 μ(T)",
          "再计算 U 或巨势",
          "检查 T→0 时 U/N=εF/2",
        ],
        example: {
          question: "二维 T=0 Fermi 气体的平均能量为何是 εF/2？",
          solution: [
            "DOS 是常数 D0",
            "N=D0∫₀^εF dε=D0εF",
            "U=D0∫₀^εF εdε=D0εF²/2",
            "相除得 U/N=εF/2",
          ],
        },
        pitfalls: [
          "照搬三维 √ε DOS",
          "不声明面积 A 与粒子面密度 n=N/A",
          "把二维低温 μ 修正误写成三维 T² 结果",
        ],
        check: {
          question: "二维结果与三维结果的最快区分方法是什么？",
          answer:
            "先看 DOS 的能量幂：二次色散下 Dd(ε)∝ε^{d/2−1}；二维指数为 0，三维为 1/2。",
        },
      },
    ],
    deepDives: [
      {
        title: "作业 3 Q4：二维有限温度完整链",
        summary:
          "把 constant DOS 一路算到 exact chemical potential、低温热容、particle-hole symmetry 与 PA=U。",
        paragraphs: [
          "二维二次色散的 DOS 是常数 D0。先精确积分 number equation 并用 N=D0εF，得到 μ(T)，再对 energy integral 作低温展开。",
          "Fermi function 关于 μ 的 occupation/vacancy 对称是精确恒等式；grand potential 的分部积分则给二维 scale relation PA=U。",
          "这里 μ、particle-hole relation 与 PA=U 是精确结果，只有 CV 的最后一项使用 T≪TF 的 Sommerfeld 近似。",
        ],
        formulas: [
          String.raw`$$\mu=k_{\mathrm B}T\ln\!\left(e^{\varepsilon_F/(k_{\mathrm B}T)}-1\right);\quad \frac{C_V}{Nk_{\mathrm B}}\approx\frac{\pi^2}{3}\frac{T}{T_F};\quad f(\mu+\delta)=1-f(\mu-\delta);\quad PA=U$$`,
        ],
      },
      {
        title: "JIT：Sommerfeld 展开为什么只看 Fermi 面",
        summary: "需要推低温系数时再展开；核心通过只需会用前两项并检查条件。",
        paragraphs: [
          "把 Fermi 函数与阶跃函数的差限制在 μ 附近，令 x=(ε−μ)/(kBT)。差函数在远离零处指数衰减。",
          "将 φ(μ+kBTx) Taylor 展开；奇偶性使首个非零修正来自 φ′(μ)，积分常数给 π²/6。",
          "这个推导同时解释了为什么低温修正由 Fermi 面局部 DOS 与导数决定。",
        ],
        formulas: [
          "fFD(x)−Θ(−x) 只在 |x|≈1 有贡献",
          "I=∫₀^μ φ(ε)dε+(π²/6)(kBT)²φ′(μ)+O(T⁴)",
        ],
      },
      {
        title: "金属电子低温热容：怎样从实验图上分开电子与声子",
        summary:
          "课件 slide 31 把 Fermi 线性项与 Debye 三次项放到同一条可测公式里。",
        paragraphs: [
          "理想三维电子气给 Ce=(π²/2)NkB(kBT/εF)=γT；晶格的 Debye 声子给 Cph=δT³。因此足够低温的金属常写 Ctotal=γT+δT³。",
          "两边除以 T 得 C/T=γ+δT²。以 C/T 对 T² 作图，纵截距是电子系数 γ，斜率是 phonon 系数 δ；这比直接在 C(T) 曲线上凭眼睛分离更稳。",
          "真实晶体的 band structure 和相互作用会把裸电子质量换成 effective mass m*，因此测得 γ 与自由电子估计的差可反映 quasiparticle renormalization。",
        ],
        formulas: ["Ce=(π²/2)NkB(kBT/εF)=γT", "Ctotal=γT+δT³;  Ctotal/T=γ+δT²"],
      },
      {
        title: "Pauli 顺磁：磁场移动两种自旋的 Fermi 面",
        summary: "课件后段应用；主线先掌握两套自旋人口的线性响应。",
        paragraphs: [
          "按课件记号，弱磁场使两种自旋的能量成为 εp,±=p²/(2m)∓μ*B，相差 2μ*B；这里 μ* 是电子的磁矩（可含有效修正），不是 chemical potential μ。",
          "两种自旋人口略微不等，总磁矩 Mtot=μ*(N+−N−)，磁化强度为 𝓜=Mtot/V。按课件采用的 χ=∂𝓜/∂B convention，T=0 的三维自由电子结果是 χ0=(3/2)n(μ*)²/εF；若改用 SI 的 χH=∂𝓜/∂H，还要按单位制处理 μ0。",
          "低温展开给 χ(T)≈χ0[1−(π²/12)(kBT/εF)²]。只有 Fermi 面附近的薄壳能改变占据，因此不是所有电子都按经典 Curie law 响应。",
        ],
        formulas: [
          "ε_{p,±}=p²/(2m)∓μ*B;  Mtot=μ*(N_+−N_-);  Mmag=Mtot/V",
          "χ0=(3/2)n(μ*)²/εF",
          "χ(T)≈χ0[1−(π²/12)(kBT/εF)²]",
        ],
      },
      {
        title: "白矮星简并压强",
        summary: "用于理解 Fermi 压强不是温度效应；不是本课计算主线。",
        paragraphs: [
          "引力压缩提高电子密度，因 Pauli 原理必须占据更高动量态，电子简并压强抵抗进一步压缩。",
          "非相对论与相对论色散给不同压强标度；后者通向 Chandrasekhar 极限，但无需作为本课程 gate。",
        ],
      },
    ],
    practice: [
      {
        title: "三维态计数",
        instruction: "不看公式，从每个 k 态体积开始推导一般 gs 下的 kF。",
        answer: "N=gs[V/(2π)³](4πkF³/3)，所以 kF=(6π²N/(gsV))^{1/3}。",
      },
      {
        title: "零温热力学",
        instruction: "用 DOS 幂积分推 E0/N 和 P0；每一步写量纲。",
        answer:
          "D=C√ε；N=(2C/3)εF^{3/2}，E=(2C/5)εF^{5/2}，故 E/N=3εF/5；P=2E/(3V)。",
      },
      {
        title: "作业 3 Q4",
        instruction:
          "先只打开题目，独立写二维 DOS、number equation 和 T→0 检查；卡住后才展开提示。",
        answer:
          "D/A=gs m/(2πℏ²)；n=D0kBT ln(1+e^{βμ})；T→0 得 μ→εF=n/D0，U/N→εF/2。",
        source: "作业 3 Q4",
      },
    ],
    gate: {
      prompt:
        "闭卷从 k 空间数态推 kF 与 εF，再分别解释 T=0 压强、低温 CV∝T，以及二维作业题为何 DOS 为常数。",
      criteria: [
        "不漏/不重复 gs",
        "E0/N 与 P0 系数正确",
        "能说出 Sommerfeld 的适用条件和固定 N 步骤",
        "能用 DOS 幂快速区分二维与三维",
      ],
    },
  },
  {
    id: "nonequilibrium",
    phase: "nonequilibrium",
    phaseLabel: "非平衡",
    week: "Week 13",
    title: "非平衡三连桥：扩散、Langevin 与 Fokker–Planck",
    english: "Diffusion, Langevin theory and Fokker–Planck equation",
    hoursCore: 6.5,
    hoursFull: 10,
    goal: "在“单条随机轨迹”和“概率分布的确定性演化”之间来回翻译，完整走通老师 Week 13 的三个闭环。",
    why: "这章看似突然换课，其实仍在问同一个问题：微观随机规则如何产生可预测的宏观方程。把三种描述层次分清，公式就不会混成一团。",
    prerequisites: [
      "probability-counting：平均、方差、独立增量",
      "math-toolbox：Taylor、普通微分方程、偏导",
      "gradient、divergence、Laplacian 若陌生，随机游走后先完成本节第 2 卡，再读 Fick 定律",
    ],
    outcomes: [
      "能从离散 random walk 推出 ⟨x⟩ 与 ⟨x²⟩=2Dt",
      "能从 Fick 定律与连续性方程推出 diffusion equation",
      "能解自由 Brownian particle 的 Langevin 方程并解释两种时间尺度",
      "能用 equilibrium 要求推出 Einstein relation D=kBT/γ",
      "能从 master equation 的前两阶矩理解 Fokker–Planck 的 drift/diffusion 项",
    ],
    sourceRefs: [
      "课件 10 slides 1–18，核心为 slides 6–15",
      "Arovas Ch. 9 Brownian motion / Langevin / Fokker–Planck",
      "David Tong Ch. 4.4 附近的涨落思想用于回顾",
    ],
    concepts: [
      {
        title: "闭环一：随机游走 → 扩散",
        label: "微观到宏观",
        core: true,
        intuition:
          "单个醉汉的路线不可预测，但很多次路线的中心和宽度非常可预测。",
        explanation: [
          "一维每隔 τ 向左/右走一步长 a，若两方向等概率，单步平均为 0、方差为 a²。",
          "N 步独立增量相加后，平均仍为 0，方差相加为 Na²。令 t=Nτ，得到 ⟨x²⟩=(a²/τ)t=2Dt。",
          "中央极限定理使长时间位移分布趋近 Gaussian；其宽度 √(2Dt) 只按 √t 增长。",
          "连续极限可从离散概率更新式 Taylor 展开得到 ∂tP=D∂x²P。",
        ],
        formula: "⟨x²(t)⟩=2Dt（1D）；P(x,t)=[4πDt]^(−1/2)exp[−x²/(4Dt)]",
        formulaNote:
          "d 维各方向独立时 ⟨|r|²⟩=2dDt；Gaussian 分母 4Dt 与方差 2Dt 完全一致。",
        steps: [
          "写 xN=Σj Δxj",
          "用独立性算均值与方差",
          "定义 D=a²/(2τ)",
          "把离散更新 P(x,t+τ)=[P(x−a,t)+P(x+a,t)]/2 展开到 a²、τ 一阶",
          "取 a,τ→0 且 a²/(2τ)=D 固定",
        ],
        example: {
          question: "D=0.5 μm²/s 的一维粒子，10 s 后 rms 位移是多少？",
          solution: [
            "⟨x²⟩=2Dt=2×0.5×10=10 μm²",
            "xrms=√10 μm≈3.16 μm",
            "这不是平均位移；对称游走的 ⟨x⟩仍为 0",
          ],
        },
        pitfalls: [
          "把 ⟨x⟩=0 误解为粒子没有运动",
          "把 rms 位移写成与 t 成正比",
          "混淆一步数 N 与粒子数 N",
        ],
        check: {
          question: "若步长加倍、时间步不变，D 变多少倍？",
          answer: "D=a²/(2τ)，所以变 4 倍。",
        },
      },
      {
        title: "读 Fick 方程前：四个空间微分动作",
        label: "零基础必经桥",
        core: true,
        intuition:
          "不要先背 ∇ 符号。把空间切成许多小格：gradient 问哪边更浓，divergence 问一个小格净流出多少，Laplacian 问中心比邻居高还是低，continuity 把净流出翻译成库存减少。",
        explanation: [
          "一维先学即可：gradient 退化为 ∂xn，表示密度曲线的斜率；三维 ∇n 是一个向量，指向 n 增长最快的方向。",
          "divergence 在一维是 ∂xJ。若某点右侧流量大于左侧流量，∂xJ>0，说明这个小区间净流出，库存 n 应下降。",
          "Laplacian ∇²n=∇·(∇n)，一维就是 ∂x²n。局部峰顶通常 ∂x²n<0，所以扩散方程会让峰顶随时间降低；谷底则相反。",
          "continuity equation ∂tn+∇·J=0 只表达守恒。负号说：净流出为正时，本地密度随时间减少。它本身还没有指定流 J 的成因。",
          "对全空间积分后，Gauss theorem 把体积内的 divergence 变成边界流；封闭边界 J·n̂=0 时总粒子数保持不变。",
        ],
        formula:
          "1D: ∂xn → slope,  ∂xJ → net outflow,  ∂x²n → curvature;  ∂tn+∂xJ=0",
        formulaNote:
          "第一次只在一维画图和判断正负；能做到后，再把 ∂x 换成 ∇、∇·、∇²。",
        steps: [
          "画 n(x) 曲线并选一个位置",
          "由斜率判断 ∂xn 的正负",
          "由左右边界流量判断 ∂xJ 的正负",
          "用 ∂tn=−∂xJ 判断局部密度增减",
          "最后才推广到三维符号",
        ],
        example: {
          question:
            "某小区间左边每秒流入 5 个粒子，右边每秒流出 8 个粒子；区间内粒子数怎样变？",
          solution: [
            "净流出率是 8−5=3 个/秒",
            "continuity 的负号把净流出变成库存下降",
            "所以区间内粒子数每秒减少 3 个；这就是 ∂tn+∂xJ=0 的离散版本",
          ],
        },
        pitfalls: [
          "把 gradient、divergence、Laplacian 当成同一个导数",
          "只背 continuity 负号，不用流入/流出检查方向",
          "D 随位置变化时把 ∇·(D∇n) 擅自写成 D∇²n",
        ],
        check: {
          question: "扩散中的密度峰顶为何会降低？",
          answer:
            "峰顶曲率 ∂x²n<0；扩散方程 ∂tn=D∂x²n 且 D>0，因此峰顶 ∂tn<0。",
        },
      },
      {
        title: "Fick + continuity → diffusion equation",
        label: "守恒结构",
        core: true,
        intuition: "浓的地方向稀的地方漏；局部减少多少，必须由流出去多少解释。",
        explanation: [
          "Fick 第一定律 J=−D∇n：粒子流沿密度下降方向，所以有负号。",
          "连续性方程 ∂tn+∇·J=0 只是粒子数守恒；它不规定 J 由什么产生。",
          "将本构关系 Fick 代入守恒律，若 D 常数，得到 ∂tn=D∇²n。",
          "若有外力导致 drift velocity u，流可写 J=un−D∇n；代入后得到 drift–diffusion 方程。",
        ],
        formula: "J=−D∇n;  ∂tn+∇·J=0  ⇒  ∂tn=D∇²n",
        formulaNote: "三层不要混：n 是密度，J 是流密度，D 是扩散系数。",
        steps: [
          "先画密度图并判断流的方向",
          "写出 J 的模型（Fick 或 drift+diffusion）",
          "再写独立的守恒方程",
          "代入并检查全空间积分是否守恒",
        ],
        example: {
          question: "为什么 Fick 定律的负号必不可少？",
          solution: [
            "若 n 随 x 增大，则 ∂xn>0",
            "扩散流应向负 x，也就是 Jx<0",
            "Jx=−D∂xn 且 D>0 正好满足",
          ],
        },
        pitfalls: [
          "把 continuity equation 当作扩散的经验定律",
          "D 随位置变化时错误地直接写 D∇²n",
          "忘记边界上的流决定总粒子数是否守恒",
        ],
        check: {
          question: "封闭边界 J·n̂=0 时，总粒子数为何不变？",
          answer:
            "对 continuity equation 全空间积分，用 Gauss 定理得到 dN/dt=−∮J·dA=0。",
        },
      },
      {
        title: "闭环二：Langevin 方程与涨落—耗散",
        label: "轨迹层",
        core: true,
        intuition:
          "液体一边用黏滞阻力刹车，一边用分子碰撞乱踢；平衡温度决定‘踢’必须有多强。",
        explanation: [
          "自由 Brownian particle 的轨迹方程 m dv/dt=−γv+ξ(t)。−γv 是可预测的耗散，ξ 是平均为零的快速随机力。",
          "速度记忆在 τv=m/γ 后指数衰减。短时 t≪τv 近似 ballistic，MSD∝t²；长时 t≫τv 进入 diffusion，MSD≈2Dt。",
          "白噪声模型写 ⟨ξ(t)ξ(t′)⟩=2γkBTδ(t−t′)。delta 表示理想化的零相关时间，不表示随机力无穷大可直接逐点解释。",
          "若噪声过弱，阻尼会把系统冷到零；若过强会无限加热。平衡 equipartition 要求二者锁定，得到 D=kBT/γ。",
        ],
        formula: "mṽ=−γv+ξ(t);  ⟨ξ(t)ξ(t′)⟩=2γkBTδ(t−t′);  D=kBT/γ",
        formulaNote: "有些课件写 mobility B=1/γ，于是 D=BkBT；先查 B/γ 定义。",
        steps: [
          "先解无噪声齐次方程得到 e^(−t/τv)",
          "用积分因子写含噪声的形式解",
          "先取平均：⟨ξ⟩=0",
          "再用二时刻相关算方差/MSD",
          "用长时间 diffusion 或平衡 equipartition 固定噪声强度",
        ],
        example: {
          question: "同一温度下把黏滞系数 γ 增大 3 倍，D 如何变化？",
          solution: [
            "Einstein relation D=kBT/γ",
            "T 不变、γ 变 3 倍，因此 D 变为 1/3",
            "物理上阻力更强，位置扩散更慢",
          ],
        },
        pitfalls: [
          "因 ⟨ξ⟩=0 就在方差计算中删掉 ξ",
          "把 γ/m 与 m/γ 两个时间尺度写反",
          "忽视 noise convention，直接比较不同资料中的 2 因子",
        ],
        check: {
          question: "trajectory-level 与 distribution-level 的区别是什么？",
          answer:
            "Langevin 方程描述单次随机轨迹，每次 ξ(t) realization 不同；Fokker–Planck 方程描述许多 realization 的概率密度，给定初态后是确定性的 PDE。",
        },
      },
      {
        title: "闭环三：Master equation → Fokker–Planck",
        label: "分布层",
        core: true,
        intuition:
          "先记清每种跳跃带来多少概率流，再把很小的跳跃按一阶漂移、二阶展宽整理。",
        explanation: [
          "master equation 的 gain−loss 结构保证总概率守恒：从其他状态跳入 x 的概率流减去从 x 跳出的流。",
          "若跃迁步长 Δ 很小，对 P(x−Δ)W(x−Δ;Δ) 按 Δ 做 Taylor 展开，得到 Kramers–Moyal 系列。",
          "保留前两阶矩：A(x)=lim⟨Δx⟩/Δt 是 drift，B(x)=lim⟨(Δx)²⟩/Δt 是 diffusion strength。",
          "于是 ∂tP=−∂x(AP)+½∂x²(BP)。若 B=2D 常数、A=0，就退化为普通 diffusion equation。",
        ],
        formula: "∂tP=−∂x[A(x)P]+½∂x²[B(x)P]",
        formulaNote:
          "系数 1/2 是否显式取决于 B 的定义；网页采用 B=单位时间二阶增量。",
        steps: [
          "写 gain−loss master equation",
          "设跳跃小且 moments 存在",
          "对空间变量 Taylor 展开",
          "把一阶增量归为 A、二阶增量归为 B",
          "检查 ∫Pdx 的时间导数只剩边界项",
        ],
        example: {
          question: "A=u 常数、B=2D 时，Fokker–Planck 方程是什么？",
          solution: [
            "第一项 −∂x(uP)=−u∂xP",
            "第二项 ½∂x²(2DP)=D∂x²P",
            "所以 ∂tP=−u∂xP+D∂x²P：中心以 u 移动，同时以 D 展宽",
          ],
        },
        pitfalls: [
          "把 A、B 当作概率而不是增量 moments",
          "丢掉 gain 或 loss 导致概率不守恒",
          "未检查边界条件便宣称 stationary distribution",
        ],
        check: {
          question: "怎样从 Fokker–Planck 一眼恢复普通扩散？",
          answer: "令 drift A=0、二阶强度 B=2D 常数，就得 ∂tP=D∂x²P。",
        },
      },
      {
        title: "详细平衡与平衡分布",
        label: "接回热力学",
        core: true,
        intuition: "平衡不是没有微观跳跃，而是每条边上的正反概率流刚好抵消。",
        explanation: [
          "detailed balance 要求 Peq(x)W(x→x′)=Peq(x′)W(x′→x)。它比仅要求总概率不变更强。",
          "在外势 U(x) 中 overdamped drift A=−U′/γ、B=2D。令 stationary current J=AP−D∂xP=0。",
          "解得 Peq∝exp[−U/(γD)]。要与 canonical Boltzmann 分布 exp(−βU) 一致，必须 γD=kBT。",
          "这再次得到 Einstein relation，显示热力学平衡约束随机动力学系数。",
        ],
        formula: "J=−(U′/γ)P−D∂xP=0  ⇒  Peq∝e^[−U/(γD)]  ⇒  D=kBT/γ",
        formulaNote:
          "这是最短的 fluctuation–dissipation 推导之一；它依赖零平衡流和 overdamped 模型。",
        steps: [
          "写 Fokker–Planck 成 continuity 形式 ∂tP=−∂xJ",
          "平衡令 J=0",
          "分离变量积分",
          "与 Boltzmann 权重比较指数",
        ],
        example: {
          question: "谐振势 U=kx²/2 的平衡位置分布方差是多少？",
          solution: [
            "Peq∝exp[−βkx²/2] 是 Gaussian",
            "与 exp[−x²/(2σ²)] 比较得 σ²=kBT/k",
            "也与 equipartition k⟨x²⟩/2=kBT/2 一致",
          ],
        },
        pitfalls: [
          "把 stationary 等同 detailed balance；有稳恒环流时前者可成立而后者不成立",
          "忘记势能符号导致分布向高势能增长",
          "不检查归一化是否存在",
        ],
        check: {
          question: "为什么自由粒子在无限空间没有可归一化的平衡位置分布？",
          answer:
            "U 为常数时 Peq 也是常数；无限空间上积分发散。速度可达到 Maxwell 平衡，但位置会持续扩散。",
        },
      },
    ],
    deepDives: [
      {
        title: "从 underdamped 到 overdamped",
        summary:
          "当 t≫m/γ 时速度已快速松弛，可消去惯性；需要比较两种 Fokker–Planck 时再看。",
        paragraphs: [
          "完整 Kramers 方程在 (x,v) 相空间演化。高摩擦/长时间极限下 m dv/dt 可忽略，得到 γ xdot=−U′+ξ。",
          "对应位置概率满足 Smoluchowski 方程 ∂tP=∂x[(U′/γ)P+D∂xP]。",
          "消去变量是近似，必须声明时间尺度；不能在短时 ballistic 区间使用。",
        ],
        formulas: [
          "$$m\\dot v=-\\gamma v-U'(x)+\\xi(t)\\longrightarrow \\gamma\\dot x=-U'(x)+\\xi(t)\\longrightarrow \\partial_tP=\\partial_x\\left[\\frac{U'(x)}{\\gamma}P+D\\partial_xP\\right]$$",
        ],
      },
      {
        title: "Ornstein–Uhlenbeck 过程",
        summary:
          "把 Langevin 速度看成线性 drift 的 Fokker–Planck，可统一计算相关函数。",
        paragraphs: [
          "速度 obey dv=−(γ/m)vdt+(noise)。对应 Gaussian 分布的均值指数衰减，方差趋向 kBT/m。",
          "平衡速度自相关 ⟨v(t)v(0)⟩=(kBT/m)e^{−|t|/τv}；对时间积分可恢复长时间 D。",
        ],
      },
      {
        title: "Slides 16–18：非考核拓展路线",
        summary:
          "这三页只负责告诉你后续可以往哪里走，不属于 Week 13 的核心 gate，也不应挤占扩散、Langevin 与 Fokker–Planck 的练习时间。",
        paragraphs: [
          "slide 16 把 classical cluster expansion、quantum second quantization/field theory、critical phenomena/RG 列为进一步方向；slide 17 列 Boltzmann equation、Lindbladian 与 Keldysh path integral；slide 18 列 statistics、stochastic calculus、Monte Carlo 与 molecular dynamics。",
          "高效顺序是先通过本节 slides 6–15 的核心闭环；只有后续课程、科研或个人兴趣明确需要时，再沿其中一条路线展开，当前不要求推导或背诵。",
          "其中书封与术语是路线索引，不是本课已讲授内容，也不能据此推断考试范围。",
        ],
      },
    ],
    practice: [
      {
        title: "random walk",
        instruction: "从 N 个独立 ±a 增量推均值、方差和 D；不要先写扩散公式。",
        answer:
          "均值 0；交叉项因独立和零均值消失，⟨x²⟩=Na²；t=Nτ，故 D=a²/(2τ)。",
      },
      {
        title: "守恒与 Fick",
        instruction:
          "写一维 J=un−D∂xn，并由 continuity 推 drift–diffusion equation。",
        answer: "∂tn=−∂xJ=−u∂xn+D∂x²n（u,D 常数）。",
      },
      {
        title: "分布翻译",
        instruction:
          "给定 overdamped Langevin γxdot=−kx+ξ、噪声相关 2γkBTδ，写对应 Fokker–Planck 和平衡分布。",
        answer: "∂tP=∂x[(kx/γ)P]+(kBT/γ)∂x²P；Peq∝exp[−βkx²/2]。",
      },
    ],
    gate: {
      prompt:
        "闭卷画出三层翻译：random walk→diffusion、Langevin trajectory→Fokker–Planck distribution、零概率流→Boltzmann equilibrium；每条箭头写假设。",
      criteria: [
        "能区分 mean displacement 与 MSD",
        "能用一维小区间的流入/流出解释 continuity equation 的负号，再推广到 ∇·J",
        "Fick 负号、continuity 守恒和边界项正确",
        "能说明白噪声相关与 Einstein relation",
        "能识别 Fokker–Planck 的 drift A 与二阶强度 B",
      ],
    },
  },
  {
    id: "final-review",
    phase: "review",
    phaseLabel: "总复习",
    week: "Week 14",
    title: "量子复习与整门课闭环",
    english: "Quantum revision and cumulative mastery",
    hoursCore: 6,
    hoursFull: 12,
    goal: "停止按章节背公式，改为从控制条件识别系综、从状态计数/配分函数推出需要的量，并用陌生变式证明自己会迁移。",
    why: "老师没有提供单独的 Week 14 课件，也没有本地期末真题；因此本节不假装预测原题，而是用课件回顾页、三套作业和期中评分格式构造最稳妥的能力闭环。",
    prerequisites: [
      "midterm-review：经典部分能在限时下输出完整结构",
      "quantum-bridge → quantum-statistics → bose-gas → fermi-gas",
      "nonequilibrium：至少通过 Week 13 核心 gate",
    ],
    outcomes: [
      "看到控制量即可在 microcanonical/canonical/grand canonical 之间选择",
      "能用同一模板处理经典与量子：状态空间→权重→生成函数→平均/涨落",
      "能区分 MB、BE、FD 的适用条件与极限",
      "能完成作业 3 四题的核心结构，并解释资料勘误",
      "形成 1/3/7/14/30 天累计复习队列和可执行错因回退路径",
    ],
    sourceRefs: [
      "课件 7 slides 8–9 经典统计总结与量子区间边界",
      "课件 8 slide 19 量子统计总结",
      "课件 9 slide 17 Bose 回顾及 slides 19–35 Fermi",
      "作业 3 全套；2025 期中答案作为评分表达模板",
    ],
    concepts: [
      {
        title: "六步解题导航",
        label: "整门课主轴",
        core: true,
        intuition:
          "任何题先定位自己在六步链的哪一格，不要一看到关键词就抓公式。",
        explanation: [
          "第 1 步控制条件：E/V/N、T/V/N、T/V/μ 中哪些固定，哪些能交换？",
          "第 2 步状态与统计：经典相空间还是量子占据数？全同粒子、简并度和守恒量是什么？",
          "第 3 步生成对象：Ω、Z、Ξ，或非平衡时的 transition rate/Langevin equation。",
          "第 4 步可观测量：用 ln 的导数求平均、方差和响应，或用 DOS 积分。",
          "第 5 步热力学连接：S、F、巨势、P、μ、CV、compressibility。",
          "第 6 步自检：量纲、符号、极限、适用条件与数量级。",
        ],
        formula:
          "控制条件 → 状态/权重 → Ω/Z/Ξ → 平均与涨落 → 热力学势/响应 → 三重自检",
        formulaNote:
          "这条链比孤立公式更值得背，因为每章只是替换其中一两个对象。",
        steps: [
          "题目第一遍只圈控制量和输出量",
          "写一句系综选择理由",
          "先写定义式，再代模型能谱/Hamiltonian",
          "求导前标保持量",
          "结果后写至少一个极限或单位检查",
        ],
        example: {
          question:
            "题目说系统接触热库和粒子库，要求粒子数涨落。第一行应写什么？",
          solution: [
            "控制量是 T,V,μ，E 与 N 可交换，所以选 grand canonical ensemble",
            "写 Ξ=Σstates exp[−β(E−μN)]",
            "再用 ⟨N⟩=(1/β)∂μlnΞ、Var(N)=(1/β²)∂μ²lnΞ",
          ],
        },
        pitfalls: [
          "直接抄某个熟悉结果而不声明 ensemble",
          "连续极限不写 DOS/measure",
          "只给最终数值没有自检",
        ],
        check: {
          question: "为什么同一物理系统在不同控制条件下要换热力学势？",
          answer:
            "热力学势的自然变量与外界固定的控制量匹配；Legendre transform 把不受控的 extensive variable 换成对应 reservoir 的 intensive variable。",
        },
      },
      {
        title: "经典—量子对照表要会自己重建",
        label: "迁移能力",
        core: true,
        intuition:
          "量子统计不是把经典公式全部推翻；概率框架相同，改变的是允许状态、计数和占据限制。",
        explanation: [
          "经典：microstate 是相空间点，积分 measure 含 1/(N!h^{3N})。量子：microstate 是 Hilbert-space state，平均用 trace。",
          "canonical 都有 ρ∝e^{−βH} 和 Z=Tr e^{−βH}；经典 trace 变成相空间积分。",
          "grand canonical 都把 E−μN 放入指数。量子理想气体因单粒子态 occupation 独立而 factorize。",
          "低占据 nλT³≪1 时 BE/FD 都回到 Maxwell–Boltzmann；这比只说“高温”更完整。",
        ],
        formula: "classical ∫dΓ/(N!h³ᴺ)  ↔  quantum Tr;  ρ=e^(−βH)/Z",
        formulaNote:
          "同一符号 ρ 在经典是相空间密度，在量子是 density operator；对象不同，归一化思想相同。",
        steps: [
          "列出 state space",
          "列出统计/占据限制",
          "写 trace 或 integral measure",
          "比较生成函数与导数规则",
          "说明 classical limit",
        ],
        example: {
          question:
            "为何量子 grand canonical 对 ideal gas 易 factorize，而固定 N canonical 较难？",
          solution: [
            "巨正则允许总 N 波动，每个单粒子态的 ni 可独立求和",
            "总权重 exp[−βΣi(εi−μ)ni] 变成各 i 因子的乘积",
            "canonical 的约束 Σini=N 把不同能级 occupation 耦合起来",
          ],
        },
        pitfalls: [
          "把 most probable occupation 与 ensemble average 混为一谈",
          "忽略 degeneracy 是状态数而非粒子数",
          "把 β→∞ 错称 classical limit",
        ],
        check: {
          question: "BE 与 FD 都变成 MB 的物理条件是什么？",
          answer:
            "每个量子态的平均占据远小于 1，即稀薄、低简并 nλT³≪1；此时分母中的 ±1 相对 e^{β(ε−μ)} 可忽略。",
        },
      },
      {
        title: "评分点式输出",
        label: "考试表达",
        core: true,
        intuition:
          "会做题还要让阅卷人清楚看到你为什么这样做；结构化书写也能减少自己的漏项。",
        explanation: [
          "第一块写对象和假设：ensemble、控制量、Hamiltonian/energy spectrum、简并度。",
          "第二块写定义和正规化：Ω/Z/Ξ 或 evolution equation；连续积分写 measure。",
          "第三块写计算主线：每一等号一个动作，近似旁标条件。",
          "第四块写结果解释：单位、极限、与已知 relation 的一致性。",
          "若老师资料中的记号或公式有误，先声明你采用的定义，再按自洽公式作答；不要只写“老师错了”。",
        ],
        formula:
          "定义与假设 20% → 主体推导 55% → 结果与自检 25%（练习用，不宣称官方固定比例）",
        formulaNote:
          "期中 2025 答案表明每题分步骤给分，但上述比例是网页训练模板，不是老师公布的 rubrics。",
        steps: [
          "用 30 秒列评分骨架",
          "先做最有把握的定义与关键式",
          "卡代数时保留正确积分/导数结构",
          "最后两分钟专查符号、指数与 N!h³ᴺ",
        ],
        example: {
          question: "算到最后忘了 Gaussian 常数，怎样尽量保住物理分？",
          solution: [
            "写出正确 Z 的积分和变量分离",
            "标明所需 ∫e^{−ax²}dx=√(π/a)",
            "继续用 lnZ 的导数写 U/C 的结构",
            "用 equipartition 或量纲核对，明确未化简常数",
          ],
        },
        pitfalls: [
          "只写公式名不写定义",
          "跨三行代数不解释近似",
          "把训练评分模板冒充官方评分细则",
        ],
        check: {
          question:
            "为什么即使不会算完，也应写 ensemble 与 partition function？",
          answer:
            "它们确定解题框架并通常独立得分；后续代数失误不应掩盖正确的物理建模。",
        },
      },
      {
        title: "复习不是重读：1/3/7/14/30 天检索",
        label: "长期保留",
        core: true,
        intuition:
          "记忆像路径；隔一段时间主动走一次，比一直盯着地图更能让路留下来。",
        explanation: [
          "本节结束立刻做 30 秒收尾：一个问题、一条关系、一个坑。",
          "1 天后做定义检索+最小计算；3 天后做变式题，决定‘暂时掌握’能否转为‘已确认’。",
          "7 天后与新章混合；14 天后用作业/考试评分点无提示输出；30 天后跨阶段累计复习。",
          "若只是排版小错，不必全部重置；若控制量、定义或物理方向错，回到 1 天间隔并补精确先修节点。",
        ],
        formula: "立即 → 1 日 → 3 日 → 7 日 → 14 日 → 30 日",
        formulaNote:
          "网页会在本地保存完成状态；复习日期以主动检索为准，不以滚动到页面底部为准。",
        steps: [
          "先闭卷输出",
          "再核对答案并分类错因",
          "只补导致错误的最小节点",
          "用同结构新题重试",
          "安排下一次间隔",
        ],
        example: {
          question: "你能看懂推导，但空白纸上想不到第一步，错因应归哪类？",
          solution: [
            "不是概念完全不懂，也不一定是代数问题",
            "归为‘策略启动’错误",
            "补法是练题型识别和渐隐例题，只给第一步提示后重试",
          ],
        },
        pitfalls: [
          "把重读高亮当作检索练习",
          "原题反复刷到背答案",
          "一次失败就把全部进度清零",
        ],
        check: {
          question: "3 日复测通过的证据是什么？",
          answer:
            "在无提示情况下完成未见过的同结构小题，并能用自己的话解释核心关系；‘看着熟’不算。",
        },
      },
    ],
    deepDives: [
      {
        title: "没有官方期末真题时怎样造可靠模拟题",
        summary: "用老师的 coverage 与作业结构造题，不假装预测题目。",
        paragraphs: [
          "抽取一个核心操作，例如 DOS、Ξ factorization 或 fluctuation derivative，再替换维数、能谱或外参。",
          "每套至少包含：经典系综一题、相变/涨落一题、量子统计一题、Bose/Fermi 一题、概念辨析；若 Week 13 纳入期末，再加非平衡一题。",
          "先写评分点再写答案，确保题目测的是课程技能而非刁钻常数。",
        ],
      },
      {
        title: "错因路由卡",
        summary: "同一道错题的补法取决于错在哪里。",
        paragraphs: [
          "看不懂题目对象：回 definition；知道物理不会变形：回 JIT 数学；符号/单位错：做三检清单。",
          "看答案懂但想不到第一步：做策略分类与渐隐题；隔天忘：缩短检索间隔，不重读全部。",
          "同一 gate 两次失败时必须换同构新题，不能继续背原答案。",
        ],
      },
      {
        title: "老师 2025 grading 信息的使用边界",
        summary:
          "课件 1 显示 Assignment 30%、Mid-term 30%、Final 40%；重修学期必须再次核实。",
        paragraphs: [
          "这组比例来自存档课件，不应自动视为下一学期仍有效。网站只用它提醒作业不能放弃、期中是重要诊断。",
          "开学第一周请以新课程主页、老师公告或 syllabus 为准，再更新个人时间分配。",
        ],
      },
    ],
    practice: [
      {
        title: "60 分钟量子混合卷",
        instruction:
          "15 分钟密度矩阵；15 分钟 BE/FD 单态因子化；15 分钟 DOS/BEC；15 分钟 Fermi T=0。每题先列六步链。",
        answer:
          "用对应模块 gate criteria 自评；若某题少于 80% 或红线定义错误，回该节点最小补洞后换变式重做。",
      },
      {
        title: "口述总图",
        instruction:
          "不用公式，向一名同学解释为什么三大系综、Bose/Fermi、Langevin/Fokker–Planck 都属于同一门课。",
        answer:
          "共同主题是用概率描述巨大自由度：约束决定允许状态与权重，平均与涨落给宏观量；非平衡再研究该概率如何随时间演化。",
      },
      {
        title: "资料勘误演练",
        instruction:
          "随机选一条勘误，完成‘原式→问题→更正→快速验证→考场写法’五格。",
        answer:
          "以 thermal wavelength 为例：原式倒置；标准 λT=h/√(2πmkBT)；单位是长度且 T↑时 λ↓；考场先声明定义再代入。",
      },
    ],
    gate: {
      prompt:
        "在不打开公式表的情况下完成一套跨章节小卷，并把每一处失分归为概念、数学、符号/单位、策略或遗忘；只针对错因补洞后做新变式。",
      criteria: [
        "所有 ensemble 选择与控制量红线项正确",
        "经典/量子 measure 与生成函数不混",
        "BE/FD/DOS/BEC/Fermi 的适用条件说清",
        "总分至少 80%，且 3 天后变式复测再次通过",
      ],
    },
  },
];

export const moduleDependencies: Record<string, string[]> = {
  "math-toolbox": [],
  "probability-counting": ["math-toolbox"],
  "thermo-bridge": ["math-toolbox"],
  "hamilton-phase-space": ["math-toolbox", "probability-counting"],
  "statistical-entry": ["probability-counting", "thermo-bridge"],
  "phase-ensemble": [
    "hamilton-phase-space",
    "probability-counting",
    "statistical-entry",
  ],
  microcanonical: ["phase-ensemble", "probability-counting", "thermo-bridge"],
  "classical-gases": ["microcanonical", "math-toolbox"],
  canonical: ["microcanonical", "thermo-bridge", "classical-gases"],
  "grand-canonical": ["canonical", "thermo-bridge", "probability-counting"],
  "interactions-vdw": ["canonical", "grand-canonical"],
  "phase-transition": [
    "interactions-vdw",
    "grand-canonical",
    "probability-counting",
  ],
  "midterm-review": [
    "phase-ensemble",
    "microcanonical",
    "canonical",
    "grand-canonical",
    "phase-transition",
  ],
  "quantum-bridge": ["math-toolbox", "probability-counting", "canonical"],
  "quantum-statistics": ["quantum-bridge", "grand-canonical"],
  "bose-gas": ["quantum-statistics", "math-toolbox"],
  "fermi-gas": ["quantum-statistics", "bose-gas"],
  nonequilibrium: ["math-toolbox", "probability-counting", "thermo-bridge"],
  "final-review": [
    "midterm-review",
    "quantum-bridge",
    "quantum-statistics",
    "bose-gas",
    "fermi-gas",
    "nonequilibrium",
  ],
};

export const diagnostics = [
  {
    id: "symbols",
    skill: "公式识读",
    question: "βE 为什么必须是无量纲？若 β 的单位是 J⁻¹，E 的单位应是什么？",
    choices: ["J", "K", "s", "没有单位"],
    answer: 0,
    route: "math-toolbox",
    feedback: "指数函数的自变量必须无量纲；βE=(J⁻¹)(J)=1。",
  },
  {
    id: "probability",
    skill: "概率",
    question: "P(x)=C（0≤x≤2），区间外为 0。归一化常数 C 是多少？",
    choices: ["2", "1", "1/2", "1/4"],
    answer: 2,
    route: "probability-counting",
    feedback: "∫₀²Cdx=2C=1，所以 C=1/2。",
  },
  {
    id: "thermo",
    skill: "热力学",
    question: "dF=−S dT−P dV+μdN。保持 T,N 时，(∂F/∂V) 等于什么？",
    choices: ["P", "−P", "S", "μ"],
    answer: 1,
    route: "thermo-bridge",
    feedback: "比较 dV 的系数，(∂F/∂V)T,N=−P。",
  },
  {
    id: "ensemble",
    skill: "系综识别",
    question: "系统能与热库交换能量，但 V、N 固定，应优先用哪个系综？",
    choices: ["微正则", "正则", "巨正则", "都一样无需说明"],
    answer: 1,
    route: "canonical",
    feedback: "T,V,N 是控制量，能量可交换，所以使用正则系综。",
  },
  {
    id: "quantum",
    skill: "量子语言",
    question: "合法密度矩阵必须满足哪一组？",
    choices: [
      "迹为 0、反 Hermitian",
      "迹为 1、Hermitian、正半定",
      "每个元素都相等",
      "只允许纯态",
    ],
    answer: 1,
    route: "quantum-bridge",
    feedback:
      "密度矩阵需 Hermitian、positive semidefinite、Trρ=1；可以描述纯态或混态。",
  },
  {
    id: "stochastic",
    skill: "随机过程",
    question: "对称随机游走的平均位移为 0，能推出什么？",
    choices: [
      "粒子没动",
      "每条轨迹回到原点",
      "分布中心在原点，但宽度可增长",
      "扩散系数为 0",
    ],
    answer: 2,
    route: "nonequilibrium",
    feedback: "⟨x⟩=0 只说明对称；⟨x²⟩可随时间增长。",
  },
];

export const reviewIntervals = [
  { days: 0, label: "立即", task: "30 秒闭卷：一个问题、一条关系、一个易错点" },
  { days: 1, label: "1 天", task: "一个定义检索 + 一个最小计算" },
  { days: 3, label: "3 天", task: "未见过的同结构变式；通过后标记“已确认”" },
  { days: 7, label: "7 天", task: "与新章节混合，先判断方法再计算" },
  { days: 14, label: "14 天", task: "按作业/考试评分点无提示输出" },
  { days: 30, label: "30 天", task: "跨阶段累计复习与错因再分类" },
];

export const materialErrata = [
  {
    id: "errata-potential-names",
    severity: "概念/命名错误",
    source: "课件 5 与 2025 期中 Q1 的 thermodynamic-potential 标题",
    original:
      "部分页面把 −kBT lnZ 或 −kBT lnΞ 都称为 Gibbs free energy，且期中一处把含 N 求和的式子标成 canonical。",
    problem: "三者自然变量不同；混名会导致选错系综、微分关系与导数。",
    corrected:
      "canonical：F(T,V,N)=−kBTlnZ（Helmholtz）；NPT：G(T,P,N)=U−TS+PV（Gibbs）；grand canonical：ΦG(T,V,μ)=−kBTlnΞ=−PV（grand potential）。",
    verify:
      "检查控制量：Z 固定 T,V,N；NPT 固定 T,P,N；Ξ 对 N 求和并固定 T,V,μ。",
    exam: "开头写出势的名字、符号与自然变量；若沿用老师的 G，先明确‘本文 G 指 grand potential’。",
  },
  {
    id: "errata-ps1-entropy-constraint",
    severity: "明确错误/漏项",
    source: "作业 1 Q1 题面与 solution pp.1–3",
    original:
      "题面把 entropy 写成 +∫ρlnρ；答案变分时只显式加入平均能量约束，并把常数直接写成 C=e⁻¹。",
    problem:
      "+∫ρlnρ 在归一化概率上应最小化而非最大化；若漏掉 ∫ρdΓ=1，指数分布的 prefactor 也无法正确确定。",
    corrected:
      "S[ρ]=−kB∫dΓρlnρ；对 S/kB−α(∫ρ−1)−β(∫ρH−E) 变分，得到 ρ=Z⁻¹e^{−βH}。",
    verify: "两等概率状态应有 S=kBln2>0；再检查 ∫ρdΓ=1 决定 Z。",
    exam: "即使题面漏负号，也在第一行声明采用 Gibbs entropy，并把 normalization 与 energy 两个约束都写全。",
  },
  {
    id: "errata-ps1-geometric",
    severity: "明确错误",
    source: "作业 1 Q4 solution p.12，单振子能级分布",
    original: "最后一行写 p(n)≈[1+e^{−βℏω}]e^{−nβℏω}。",
    problem:
      "这个 prefactor 不能归一化；对 n=0,1,2,… 求和会得到 (1+x)/(1−x) 而不是 1。",
    corrected:
      "在答案所用的大 N、E≫nℏω 近似下，令 x=e^{−βℏω}，正确极限分布为 p(n)≈(1−x)xⁿ=[1−e^{−βℏω}]e^{−nβℏω}。",
    verify: "Σn≥0(1−x)xⁿ=1；T→0 时 x→0，p(0)→1。",
    exam: "得到单振子边缘分布后一定做 Σnp(n)=1 与 T→0 两次检查。",
  },
  {
    id: "errata-ps1-mb-normalization",
    severity: "明确错误",
    source: "作业 1 Q2(a) solution p.4，重力场 Maxwell–Boltzmann 归一化",
    original:
      "答案最后的 C 分母写成 π^{3/2}，漏掉速度 Gaussian 带来的 2^{3/2}。",
    problem: "三维速度积分是 (2πkBT/m)^{3/2}；旧 prefactor 积分后不等于 1。",
    corrected:
      "当 x,y∈[0,L]、z∈[0,∞) 时，C=(m/2πkBT)^{3/2}·mg/(kBTL²)=g m^{5/2}/[(2π)^{3/2}(kBT)^{5/2}L²]。",
    verify:
      "分三块检查：∫d³v、∫dxdy=L²、∫₀∞dz e^{−βmgz}=1/(βmg)，乘积必须为 1。",
    exam: "若题目保留有限高度 L，竖直因子还要改为 βmg/[L²(1−e^{−βmgL})]；先写积分再化常数。",
  },
  {
    id: "errata-ps1-beta-typo",
    severity: "明确笔误",
    source: "作业 1 Q2(d) solution p.5，能量二阶矩",
    original: "文字写 where β=kBT。",
    problem:
      "这会让 exp(−βmv²/2) 的指数带能量平方量纲，与本课程所有 Boltzmann 因子冲突。",
    corrected:
      "β=1/(kBT)。该题最终 Var(ε)=(5/2)(kBT)² 本身可以由独立的 kinetic 与 mgz 方差验证。",
    verify: "β×energy 必须无量纲；β 的单位为 J⁻¹。",
    exam: "每次抄 β 后立刻做指数无量纲检查，不跟随答案页这处文字笔误。",
  },
  {
    id: "errata-ps2-classical-oscillator",
    severity: "答案不完整/测度不清",
    source: "作业 2 Q1(d) solution p.2",
    original:
      "答案只写了 joint density，没有完成题目要求的平均动能、平均势能；prefactor 也未声明概率密度所对应的 measure。",
    problem:
      "相对于 d³p d³q 与相对于 d³p d³q/h³ 的密度差一个 h³；不声明 measure 会误判归一化。",
    corrected:
      "每个三维振子 ⟨p²/2m⟩=3kBT/2、⟨mω²q²/2⟩=3kBT/2。若密度相对于 d³p d³q/h³，prefactor 为 (βℏω)³；相对于 d³p d³q，则为 (βω/2π)³。",
    verify:
      "分别做 6 个 Gaussian 二次自由度的 equipartition，并直接积分检查概率为 1。",
    exam: "先写‘概率密度相对于……’再给 prefactor；均值用 equipartition 可在两行内补齐。",
  },
  {
    id: "errata-ps2-binding-sign",
    severity: "前后矛盾",
    source: "作业 2 Q3 solution pp.4–6，吸附结合能",
    original:
      "先定义 E(M)=−Mε，随后却使用 ZM=C(N,M)e^{−βMε}，后者对应 E(M)=+Mε。",
    problem:
      "同一 ε 的号在能量与 Boltzmann weight 间改变，使 Ξ、平均占据和压力关系全部跟着翻号。",
    corrected:
      "若 ε>0 表示结合能大小且 occupied energy=−ε，则 Ξ=[1+e^{β(μ+ε)}]ᴺ，M̄=N/[1+e^{−β(μ+ε)}]。若 occupied energy=+ε，则改为 Ξ=[1+e^{β(μ−ε)}]ᴺ。",
    verify:
      "始终从单位置权重 exp[−β(Eocc−μ)] 重建；结合更强（ε↑、Eocc=−ε）应提高占据。",
    exam: "第一行声明 ε 是能级还是正的 binding magnitude，此后只从 E−μN 写权重，不背旧答案末式。",
  },
  {
    id: "errata-ps2-relativistic-scale",
    severity: "明确错误",
    source: "作业 2 Q3(c) solution pp.5–6，massless relativistic gas",
    original:
      "答案先由 E=pc 得到 ZN∝[8πV/(hβc)³]ᴺ，随后突然换用含质量 m 的非相对论 thermal wavelength。",
    problem:
      "质量为零模型不能使用 h/√(2πmkBT)；这也与前一行已经算出的单粒子积分矛盾。",
    corrected:
      "定义 λr³=(hβc)³/(8π)，则 ZN=(V/λr³)ᴺ/N!、Ξ=exp(zV/λr³)、P=kBTz/λr³，故 z=e^{βμ}=βPλr³。",
    verify: "λr³ 必须有体积单位；由 ∫d³p e^{−βcp}=8π/(βc)³ 可一行重建。",
    exam: "不要套 nonrelativistic λT；从题给 dispersion 重新做 momentum integral 最稳。",
  },
  {
    id: "errata-ps2-ising-critical",
    severity: "明确错误/漏答",
    source: "作业 2 Q4(d–e) solution pp.9–10",
    original:
      "非零解写成 m²∝1−4βJ，且把 4βJ 写成 T/Tc；题目所问 ⟨ni⟩ 也没有真正答出。",
    problem:
      "T<Tc 时 4βJ>1，旧式会给虚数；同时 β∝1/T，所以温度比方向必然相反。",
    corrected:
      "令 K=4βJ。在 T≈Tc、m 很小的近临界展开中，m²≈3(K−1)/K³；Tc=4J/kB 且 K=Tc/T。并且 ⟨ni⟩=(1+m)/2；Landau m² 系数应保留 2βJ(1−4βJ)。",
    verify: "有序非零解只应在 T<Tc 出现；把 tanh(Km)=Km−(Km)³/3 直接移项即可。",
    exam: "先令 K=4βJ，再做 Taylor；最后用 K=Tc/T 和 m→0 at Tc 检查。",
  },
  {
    id: "errata-midterm-factorial",
    severity: "有限 N 代数错误",
    source: "2025 期中 Q2(c) solution PDF p.7（卷面 p.5）",
    original: "单振子 marginal 的 factorial ratio 被写成 (3N−1)(3N−2)(3N−3)。",
    problem:
      "(3N)!/(3N−3)! 的三个因子应从 3N 开始；错移一位虽在 N→∞ 时不改 leading limit，却不是精确有限 N 结果。",
    corrected: "(3N)!/(3N−3)!=(3N)(3N−1)(3N−2)。",
    verify: "用 n!/(n−3)!=n(n−1)(n−2)；取 n=3 可立即排除旧式。",
    exam: "阶乘先完整约分，再取 thermodynamic limit；不要直接猜三个相邻因子。",
  },
  {
    id: "errata-gaussian",
    severity: "明确错误",
    source: "作业 3 Q1 / Gaussian source integral",
    original: "题面把 source term 完成平方后的指数写成 −½JᵀA⁻¹J。",
    problem: "完成平方后常数项符号相反；代回一维简单情形即可发现。",
    corrected: "∫dⁿx exp[−½xᵀAx+Jᵀx] ∝ exp[+½JᵀA⁻¹J]。",
    verify: "令 A=1，−x²/2+Jx=−(x−J)²/2+J²/2。",
    exam: "先写完成平方的中间行，并声明 A 正定；不要照抄负号。",
  },
  {
    id: "errata-bose-cv",
    severity: "明确错误",
    source: "作业 3 Q3 solution，临界点上方/下方热容跳变",
    original: "答案把 12ζ(4)/ζ(3) 的数值写成 3。",
    problem: "ζ(4)=π⁴/90≈1.0823，ζ(3)≈1.2021；直接代数不可能得到 3。",
    corrected: "12ζ(4)/ζ(3)≈10.805。",
    verify: "12×1.0823/1.2021≈10.805。",
    exam: "保留精确 ζ 比值最稳妥；若写小数，采用约 10.805。",
  },
  {
    id: "errata-thermal-wave",
    severity: "明确错误",
    source: "2025 期中答案中的 thermal wavelength",
    original: "答案把热波长写成与 √(mkBT) 成正比的倒置形式。",
    problem: "该式量纲不是长度，也违背温度越高量子波包越短的趋势。",
    corrected: "λT=h/√(2πmkBT)=√[2πℏ²/(mkBT)]。",
    verify: "h/动量具有长度单位；T↑ 时 λT↓。",
    exam: "开头声明你采用的 λT 定义；不同资料可能把 2π 放置不同，但必须量纲自洽。",
  },
  {
    id: "errata-oscillator-mu",
    severity: "记号不一致",
    source: "2025 期中 Q3，量子振子巨正则",
    original: "题解在 μ 与 μ/ℏ 的量纲之间切换，指数写法不统一。",
    problem: "指数 β(energy) 必须无量纲；若 μ 是化学势，它与 ℏω 都应是能量。",
    corrected: "n̄=1/[e^{β(ℏω−μ)}−1]，Var(n)=n̄(1+n̄)。",
    verify: "β、ℏω、μ 的单位分别为 1/能量、能量、能量。",
    exam: "先写‘令 μ 表示能量单位的化学势’，再全程保持同一定义。",
  },
  {
    id: "errata-vdw",
    severity: "明确错误",
    source: "2025 期中 Q4，mean-field van der Waals",
    original: "相互作用自由能和由其求压强的 V 次幂/系数在答案中不一致。",
    problem: "pair mean-field energy 必须随 N²/V 标度；P=−∂F/∂V 再多一个 1/V。",
    corrected:
      "Z≈(V−Nb)^N/(N!λT^{3N}) exp[−βN²ū/(2V)]；Fint=N²ū/(2V)，Pint=N²ū/(2V²)。若 ū<0，定义 a=−ū/2，则 P=NkBT/(V−Nb)−aN²/V²。",
    verify: "Fint 量纲为能量；−∂V(N²ū/2V)=+N²ū/(2V²)，吸引 ū<0 给负压修正。",
    exam: "把 ū 与 a 的定义写在式旁；用量纲和吸引应降压的方向检查。",
  },
  {
    id: "errata-schrodinger",
    severity: "明确错误",
    source: "课件 7 的 Schrödinger equation / density matrix 复习页",
    original: "时间演化式的一处符号与标准 iℏ∂t|ψ⟩=H|ψ⟩ 不一致。",
    problem:
      "错误符号会给相位演化方向相反，并破坏后续 von Neumann equation 的约定一致性。",
    corrected: "iℏ∂t|ψ⟩=H|ψ⟩；∂tρ=−(i/ℏ)[H,ρ]。",
    verify: "能量本征态解 |ψ(t)⟩=e^{−iEt/ℏ}|ψ(0)⟩。",
    exam: "采用标准式并由本征态相位快速检查。",
  },
  {
    id: "errata-purity",
    severity: "记号不严谨",
    source: "课件 7 density matrix properties",
    original: "纯度条件的 trace/平方写法容易被读成 (Trρ)²。",
    problem: "(Trρ)² 对所有正规化密度矩阵都等于 1，不能区分 pure 与 mixed。",
    corrected: "purity=Tr(ρ²)；纯态为 1，混态小于 1。",
    verify: "ρ=diag(1/2,1/2) 时 Trρ²=1/2，而 (Trρ)²=1。",
    exam: "给 ρ² 加明确括号：Tr(ρ²)。",
  },
  {
    id: "errata-offdiagonal",
    severity: "适用条件",
    source: "课件 7 equilibrium density matrix",
    original: "‘平衡时 off-diagonal 全为零’若不说明 basis 会过强。",
    problem:
      "ρ=f(H) 在能量本征基中可对角；简并子空间内基可旋转，且其他 basis 一般出现 off-diagonal。",
    corrected:
      "canonical ρ=e^{−βH}/Z 与 H 对易；在能量本征基可取对角形式，简并子空间内需谨慎表述。",
    verify: "[ρ,H]=0 是 basis-independent 的准确陈述。",
    exam: "写‘在能量本征基中（可）对角’，不要说所有 basis 都无 off-diagonal。",
  },
  {
    id: "errata-photon-mu",
    severity: "概念澄清",
    source: "课件 9 photon / phonon",
    original: "若只把 μ=0 当成公式记忆，会误以为所有 Boson 都 μ=0。",
    problem:
      "固定粒子数 Bose 气体一般 μ≤ε0 且不必为 0；光子/声子特殊在粒子数不守恒。",
    corrected:
      "热平衡 photon/phonon 的 number 可由物质/晶格自由产生消灭，故相应 chemical potential μ=0。",
    verify:
      "若用非零 μ 约束，就等于额外固定其平均数量，与通常黑体/phonon 平衡条件不同。",
    exam: "先写‘因为 quasiparticle number 不守恒’，再写 μ=0。",
  },
  {
    id: "errata-fluctuation",
    severity: "系数/保持量",
    source: "期中 Q4 / 粒子数涨落与 compressibility",
    original: "答案中的涨落—压缩率关系若省略固定量与 V、n 因子，容易量纲不合。",
    problem:
      "μ 导数和 isothermal compressibility 的转换依赖 n=N/V 以及 T,V 固定。",
    corrected: "Var(N)=kBT(∂⟨N⟩/∂μ)T,V = kBT·V n² κT。",
    verify:
      "κT 单位 1/pressure=volume/energy；kBT·Vn²κT 无量纲，符合粒子数方差。",
    exam: "写全导数下标与 n=N/V，再化为 κT。",
  },
  {
    id: "errata-ps3-title",
    severity: "题名错误",
    source: "作业 3 Q1 标题",
    original: "标题写 Density matrix for two-particle system。",
    problem:
      "正文实际研究单个 quantum harmonic oscillator 的 thermal density matrix，并非 two-particle system。",
    corrected:
      "应按“single harmonic oscillator thermal density matrix”理解与作答。",
    verify:
      "正文 Hamiltonian 只有一个坐标 x、一个动量 p，能谱标记单个 oscillator quantum number n。",
    exam: "按正文 Hamiltonian 解题；不要因标题额外引入两粒子 tensor product。",
  },
  {
    id: "errata-ps3-kernel",
    severity: "中间式疑点",
    source: "作业 3 Q1 solution p.5",
    original: "一个 intermediate exponent 中的 (ξ+ξ′) 项看起来漏写平方。",
    problem:
      "Gaussian kernel 的指数应是坐标的二次型；线性残留与最终 boxed kernel 结构不一致。",
    corrected:
      "以完成平方后的二次型和最终 boxed thermal kernel 为准，(ξ+ξ′) 对应项应保留平方。",
    verify:
      "density kernel 的 Hermiticity 要求 ρ(x,x′)=ρ*(x′,x)，且 diagonal ρ(x,x) 应是正常 Gaussian。",
    exam: "不要跨过完成平方；保留中间二次型，最后检查 x↔x′ 对称。",
  },
  {
    id: "errata-degeneracy-occupation",
    severity: "记号混用",
    source: "作业 3 Q2 solution p.9",
    original: "答案把 ⟨ni⟩ 与 ⟨niα⟩ 混写，同时有时保留简并度 gi。",
    problem:
      "整个能级总 occupation 与该能级一个 substate 的 occupation 相差 gi，混写会重复计数。",
    corrected: "单 substate：n̄iα=[e^{β(εi−μ)}∓1]⁻¹；整个简并能级：n̄i=gi n̄iα。",
    verify: "将 α=1…gi 求和，能量相同，每项平均占据相同。",
    exam: "第一行声明 ni 是 level total 还是 single-state occupation；只有前者乘 gi。",
  },
  {
    id: "errata-ps3-q3-scope",
    severity: "题目范围不一致",
    source: "作业 3 Q3",
    original:
      "标题称 arbitrary dispersion in d dimensions，正文却固定 ε=cp、V=L³，答案也按三维线性色散。",
    problem:
      "一般 d 维、ε=cpˢ 的 DOS 幂与 BEC 条件不同，不能把三维特例冒充一般结论。",
    corrected:
      "本作业实际计算 d=3、s=1 的 linear-dispersion Bose gas；一般式需另由 D(ε)∝ε^{d/s−1} 推。",
    verify:
      "d=3,s=1 给 D∝ε²、Nexc∝T³；若是 quadratic s=2，则 D∝ε^{1/2}、Nexc∝T^{3/2}。",
    exam: "按题面给定 V=L³ 与 ε=cp 作答，同时注明这是三维线性色散特例。",
  },
  {
    id: "errata-ps3-q4-area",
    severity: "几何记号",
    source: "作业 3 Q4",
    original: "二维系统仍沿用体积符号 V。",
    problem:
      "二维 extensive measure 应是 area，若不说明会让 density 和 DOS 的单位混乱。",
    corrected: "网页统一写面积 A、面密度 n=N/A、二维 DOS D2D/A。",
    verify: "D2D/A=gs m/(2πℏ²) 的单位是 1/(area·energy)。",
    exam: "若沿用题面 V，先写‘V 在本题表示二维面积’，或直接改记 A 并声明。",
  },
  {
    id: "errata-midterm-label",
    severity: "标题错误",
    source: "2025 期中答案 PDF p.4",
    original: "第 (ii) 项被标成 Canonical ensemble。",
    problem:
      "该式对 N 求和并含 e^{βμN}，控制量是 T,V,μ，实际是 grand canonical ensemble。",
    corrected: "应标 Grand Canonical ensemble，Ξ=ΣN e^{βμN}ZN。",
    verify: "canonical 固定 N，不会再对 N 从 0 到 ∞ 求和。",
    exam: "按公式和控制量识别系综，不跟随错误小标题。",
  },
  {
    id: "errata-midterm-entropy-half",
    severity: "页间不一致",
    source: "2025 期中 Q2(a)–(b)",
    original:
      "Q2(b) 的 entropy 计算凭空多出 1/2，带来 −kB ln2；Q2(a) 的 Ω 没有此因子。",
    problem: "若态数定义未改变，对同一个 Ω 取 ln 不应突然出现额外常数。",
    corrected: "从 Q2(a) 自己得到的 Ω 连续取 S=kBlnΩ；不要无来源插入 1/2。",
    verify: "将 Q2(a) 的 Ω 原样代入 ln，逐项展开即可检查。",
    exam: "把 Ω 定义完整写在 S 前；常数不影响 thermodynamic limit，但有限 N 书写必须自洽。",
  },
  {
    id: "errata-phase-volume-h",
    severity: "定义边界",
    source: "2025 期中 Q2 / 微正则 phase-space volume",
    original:
      "Ω 有时被口头称为 number of states，但写法只给有量纲的 phase-space volume。",
    problem:
      "有量纲量不能直接放入 ln；经典态数需要除以适当 h 的幂（全同粒子还涉及 N!）。",
    corrected:
      "若 Ω 表示 dimensionless state count，应含 h^{-3N}（以及题设需要的 Gibbs correction）；若只表示 phase volume，则明确它的定义并在熵中加入 reference cell。",
    verify: "d^{3N}p d^{3N}q 的单位是 action^{3N}，除 h^{3N} 才无量纲。",
    exam: "优先跟随题目已给定义评分，但加一句‘以 h^{3N} 作为相空间单元’显示物理自洽。",
  },
  {
    id: "errata-midterm-pn",
    severity: "明确错误",
    source: "2025 期中 Q3(c)–(d)",
    original:
      "marking scheme 的 P–⟨N⟩ 关系指数/量纲不一致，涨落式的正负号也不可靠。",
    problem:
      "fugacity substitution 必须保持指数 β(energy) 无量纲；Boson occupation 的方差不可能为负。",
    corrected:
      "从 Ξ 或 z=e^{βμ} 重新求 relation；单 Bose mode 的 Var(N)=N̄(1+N̄)。",
    verify: "几何分布的方差为 q/(1−q)²=N̄(1+N̄)>0。",
    exam: "不要背答案末式；从 Ξ 的一、二阶 μ 导数重建，并检查方差正定。",
  },
  {
    id: "errata-vdw-bracket",
    severity: "题解矛盾",
    source: "2025 期中 Q4(b) 题干与答案页",
    original:
      "题干把 interaction exponential 放进整体方括号后再取 N 次方；答案页却把 exponential 放在外面。",
    problem:
      "若指数已含 N²/V，再整体取 N 次方会多出一个 N，破坏 extensive scaling。",
    corrected:
      "ideal/excluded-volume 单粒子因子取 N 次方；mean-field pair interaction 的 exp[−βN²ū/(2V)] 只出现一次并放在外面。",
    verify: "固定密度 N/V 时总 interaction energy 应∝N，而不是∝N²。",
    exam: "按 extensive scaling 选择答案页的外置结构，并清楚写 mean-field pair energy。",
  },
  {
    id: "errata-hard-core",
    severity: "约定不清",
    source: "2025 期中 Q4 hard-core radius / excluded volume",
    original:
      "题中写 r<2a0 且称 a0 为 radius，但后续 excluded-volume coefficient 与标准 hard-sphere convention 不一致。",
    problem:
      "粒子几何半径、pair exclusion distance、每粒子 van der Waals b 不是同一个量；直接背系数容易差 2 或 4。",
    corrected:
      "网页只固定结构 V→V−Nb，并要求 b 由题目所采用的 pair excluded volume convention 明确定义。",
    verify:
      "先从两球中心最小距离画几何，再分清 pair excluded volume 与分摊到每粒子的 b。",
    exam: "若题目指定 b 就沿用；若只给半径，先声明推导采用的几何 convention，不盲抄旧系数。",
  },
  {
    id: "errata-ps2-phase-measure",
    severity: "明确错误",
    source: "作业 2 Q1(a) 题面，经典 N 振子正则配分函数",
    original: "相空间积分写成 d^{3N}q d^{3N}p / h^3。",
    problem:
      "积分包含 3N 对共轭坐标与动量；只除 h^3 会让 N>1 时 Z 仍带有 action^{3N-3} 的量纲。",
    corrected:
      "每一对三维粒子的相空间单元贡献 h^3，因此应写 Z=(1/h^{3N})∫d^{3N}q d^{3N}p e^{−βH}。若题目实际把每个 oscillator 当一维，则相应写 (1/h^N)∫d^Nq d^Np；关键是 h 的幂必须与相空间维数配对。",
    verify: "d^{3N}q d^{3N}p 的单位是 action^{3N}；除 h^{3N} 后 Z 才无量纲。",
    exam: "先根据 Hamiltonian 中 q_i,p_i 的维数声明采用一维还是三维 convention，再让 h 的幂与之严格匹配。",
  },
  {
    id: "errata-midterm-number-sign",
    severity: "明确错误",
    source: "2025 期中 Q3(b) 答案，巨正则平均粒子数",
    original: "答案一处写成 ⟨N⟩=−β^{-1}∂_μ lnQ。",
    problem:
      "巨配分函数的权重是 e^{−β(E−μN)}=e^{−βE+βμN}；对 μ 求导会带出 +βN，不应有负号。",
    corrected:
      "⟨N⟩=(1/β)(∂lnQ/∂μ)_{T,V}；相应 Var(N)=(1/β²)(∂²lnQ/∂μ²)_{T,V}。",
    verify: "直接对单项 e^{−βE+βμN} 求 μ 导数得到 +βN 乘原权重。",
    exam: "若改为对能级 ε 求导才出现负号；先看导数变量，再决定符号。",
  },
  {
    id: "errata-ps1-relativistic-h",
    severity: "明确遗漏",
    source: "作业 1 Q3 solution，相对论一维理想气体微正则态数",
    original:
      "答案先写含 δ(H−E) 的能量壳积分，后续却改算 H≤E 的累计体积，并把该有量纲体积直接作为 Ω 取对数，未除以 h^N。",
    problem:
      "δ shell density 与 cumulative volume 相差一次 E 导数，不能无声明互换；同时 N 个一维粒子的 d^Nq d^Np 具有 action^N 的单位，有量纲的 phase volume 不能直接放入 S=kBlnΩ。",
    corrected:
      "若采用累计态数，应写 Γ(E)=1/(N!h^N)∫_{H≤E}d^Nq d^Np；壳密度再由 ω(E)=∂Γ/∂E 得到。题面已给的 1/N! 与 h^N 分别处理全同粒子重复计数和相空间单元。",
    verify:
      "d^Nq d^Np/h^N 无量纲，故 lnΓ 有定义；一维 N 粒子需要 h^N，而不是三维问题的 h^{3N}。",
    exam: "第一行先声明使用 Γ(E) 还是 ω(E)，并显式写出 1/(N!h^N)；不要把 δ(H−E) 与 H≤E 的积分当成同一个量。",
  },
  {
    id: "errata-relaxation-tau",
    severity: "字体易读错",
    source: "课件 10 slide 10",
    original: "relaxation coefficient 的字体容易被看成 1/t。",
    problem:
      "t 是演化时间变量，τ 是固定 relaxation time；把两者混用会让微分方程系数随时间变化。",
    corrected: "线性 relaxation rate 写 1/τ，解为 exp(−t/τ)。",
    verify: "1/τ 量纲是 inverse time，指数 t/τ 无量纲。",
    exam: "手写时明确使用 τ，并在旁边定义 relaxation time。",
  },
];
