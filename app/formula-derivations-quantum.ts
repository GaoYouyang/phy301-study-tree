import {
  conceptFormulaKey,
  deepDiveFormulaKey,
  type FormulaDerivation,
} from "./formula-derivation-types";

export const quantumFormulaDerivations: Record<string, FormulaDerivation> = {
  [conceptFormulaKey("quantum-bridge", "先补一张 2×2 线性代数地图")]: {
    id: "quantum-linear-algebra-map",
    title: "伴随、本征方程与迹的共同语言",
    kind: "定义",
    origin:
      "这些式子是有限维 Hilbert 空间的基础定义。这里要做的是把复向量、线性算符和基底无关的 trace 对齐，而不是假装从统计物理定律推出线性代数定义。",
    symbols: [
      { symbol: "A†", meaning: "算符 A 的 Hermitian conjugate（复共轭后转置）" },
      { symbol: "|a⟩", meaning: "A 的本征向量" },
      { symbol: "a", meaning: "对应本征值" },
      { symbol: "Tr(A)", meaning: "A 的迹；任意正交归一基底中对角矩阵元之和" },
      { symbol: "U", meaning: "连接两组正交归一基底的 unitary 变换，满足 U†U=I" },
    ],
    prerequisites: ["复数共轭", "矩阵乘法", "正交归一基底"],
    assumptions: ["采用有限维正交归一基底书写；无限维情形还需算符可取迹"],
    steps: [
      {
        title: "先把伴随写成矩阵操作",
        formula: "A†=(A*)ᵀ",
        explanation:
          "先逐元素做复共轭 A→A*，再交换行列。Hermitian 算符满足 A†=A，因此它的本征值为实数。",
      },
      {
        title: "用本征方程定义可重复的方向",
        formula: "A|a⟩=a|a⟩",
        explanation:
          "算符作用后只把向量缩放而不改变其方向；量子测量把这些本征值作为可能结果。",
      },
      {
        title: "证明 Hermitian 算符的本征值为实数",
        formula: "⟨a|A|a⟩=a⟨a|a⟩;  ⟨a|A|a⟩*=⟨a|A†|a⟩=a*⟨a|a⟩  ⇒  a=a*",
        explanation:
          "A†=A 让同一个 expectation 同时等于自身的复共轭；对非零本征向量 ⟨a|a⟩>0，因此 a 必须是实数。这一步补上了不能只靠口头断言的原因。",
      },
      {
        title: "在选定基底计算 trace",
        formula: "Tr(A)=Σi A_{ii}=Σi⟨i|A|i⟩",
        explanation:
          "在选定基底中 A_{ii}=⟨i|A|i⟩；这先给出 trace 的可计算定义。",
      },
      {
        title: "证明换正交基后 trace 不变",
        formula: "A′=U†AU;  Tr(A′)=Tr(U†AU)=Tr(AUU†)=Tr(A)",
        explanation:
          "循环性来自 Tr(XY)=ΣijXijYji=Tr(YX)。再用 UU†=I，就知道后面可在最方便的能量基中取 trace，而不是把“基底无关”当成未证明的口号。",
      },
    ],
    conclusion: "A†=(A*)ᵀ;  A|a⟩=a|a⟩;  Tr(A)=Σi A_{ii}=Σi⟨i|A|i⟩",
    checks: [
      "若 A 是 Hermitian，检查 A†=A 且本征值 a 为实数。",
      "对 2×2 矩阵直接相加两个对角元，结果应与本征值之和一致。",
    ],
    evidence: ["课件 7 slides 11–14（态、算符与 Hermitian 语言）", "课件 8 slide 15（能量基与 trace 语境）"],
  },

  [conceptFormulaKey("quantum-bridge", "Hilbert space：量子态是向量，不是粒子轨迹")]: {
    id: "quantum-hilbert-energy-basis",
    title: "能量本征态与完备关系",
    kind: "定义",
    origin:
      "量子态用 Hilbert 空间向量表示；能量本征方程定义 Hamiltonian 的本征态。完备关系表示这组态足以展开目标 Hilbert 空间中的任意态。",
    symbols: [
      { symbol: "Ĥ", meaning: "Hamiltonian 算符" },
      { symbol: "|n⟩", meaning: "第 n 个能量本征态" },
      { symbol: "En", meaning: "本征态 |n⟩ 的能量" },
      { symbol: "I", meaning: "Hilbert 空间上的恒等算符" },
    ],
    prerequisites: ["本征值与本征向量", "内积", "正交归一基底"],
    assumptions: ["先写离散、完备的能量本征基；连续谱需把部分求和换成积分"],
    steps: [
      {
        title: "解 Hamiltonian 的本征问题",
        formula: "Ĥ|n⟩=En|n⟩",
        explanation:
          "能量测量的可能结果是 En；对应态在仅由 Ĥ 演化时只积累相位。",
      },
      {
        title: "把任意态沿能量基展开",
        formula: "|ψ⟩=Σn |n⟩⟨n|ψ⟩",
        explanation:
          "系数 ⟨n|ψ⟩ 是 |ψ⟩ 在第 n 个能量方向上的复振幅。",
      },
      {
        title: "抽出对所有态都成立的算符关系",
        formula: "Σn|n⟩⟨n|=I",
        explanation:
          "因为左侧作用在任意 |ψ⟩ 上都返回 |ψ⟩，所以它就是恒等算符。",
      },
    ],
    conclusion: "Ĥ|n⟩=En|n⟩;  Σn|n⟩⟨n|=I",
    checks: [
      "把完备关系作用到任意 |ψ⟩，必须仍得到 |ψ⟩。",
      "若存在简并，n 还应包含足以区分同能量态的额外标签。",
    ],
    evidence: ["课件 7 slides 11–13", "课件 8 slide 15"],
  },

  [conceptFormulaKey("quantum-bridge", "observable、Born rule 与 unitary evolution")]: {
    id: "quantum-schrodinger-unitary-evolution",
    title: "Schrödinger 方程与时间演化算符",
    kind: "公设 / 经验定律",
    origin:
      "时间依赖 Schrödinger 方程是非相对论量子力学的动力学公设，不从经典统计公式证明。对不显含时间的 Hamiltonian，可解出指数形式的 unitary evolution。",
    symbols: [
      { symbol: "|ψ(t)⟩", meaning: "时刻 t 的量子态" },
      { symbol: "H", meaning: "不显含时间的 Hamiltonian" },
      { symbol: "ℏ", meaning: "约化 Planck 常数" },
      { symbol: "U(t)", meaning: "时间演化算符 e^{-iHt/ℏ}" },
      { symbol: "|an⟩, an", meaning: "observable A 的归一化本征态与对应测量值" },
    ],
    prerequisites: ["一阶常微分方程", "矩阵指数", "Hermitian 算符", "正交完备基底"],
    assumptions: ["|ψ⟩ 已归一化", "A 的离散本征态构成完备正交基；连续谱需改用概率密度", "H 与时间无关；封闭系统作 unitary evolution"],
    steps: [
      {
        title: "先在 observable 的本征基展开态",
        formula: "A|an⟩=an|an⟩;  |ψ⟩=Σn cn|an⟩;  cn=⟨an|ψ⟩",
        explanation:
          "完备关系给出展开系数。cn 是 probability amplitude，不是概率本身。",
      },
      {
        title: "把 Born rule 写成概率与 expectation",
        formula: "P(an)=|⟨an|ψ⟩|²;  ΣnP(an)=1;  ⟨A⟩=Σn anP(an)=⟨ψ|A|ψ⟩",
        explanation:
          "P(an)=|cn|² 是测量公设；归一化来自 Σn|an⟩⟨an|=I。把 A=Σnan|an⟩⟨an| 代入，就得到 expectation 的 bra–ket 形式。",
      },
      {
        title: "采用量子动力学公设",
        formula: "iℏ∂t|ψ(t)⟩=H|ψ(t)⟩",
        explanation:
          "这一行是起点，不应被包装成由统计物理推得；课件原页的负号与同页演化算符不一致，标准式左侧为 +iℏ。",
      },
      {
        title: "把常系数方程积分",
        formula: "∂t|ψ⟩=-(i/ℏ)H|ψ⟩  ⇒  |ψ(t)⟩=e^{-iHt/ℏ}|ψ(0)⟩",
        explanation:
          "这与标量方程 ydot=Ay 的解 e^{At}y(0) 同构，只是 A=−iH/ℏ 是算符。",
      },
      {
        title: "检查概率守恒",
        formula: "U†U=e^{iHt/ℏ}e^{-iHt/ℏ}=I",
        explanation:
          "H†=H 使 U unitary，因此 ⟨ψ(t)|ψ(t)⟩ 保持不变。",
      },
    ],
    conclusion: "iℏ∂t|ψ⟩=H|ψ⟩;  |ψ(t)⟩=e^{-iHt/ℏ}|ψ(0)⟩",
    checks: [
      "Born 概率必须非负且总和为 1；amplitude cn 本身可为复数。",
      "对能量本征态应得到相位 e^{-iEnt/ℏ}，概率不随时间改变。",
      "指数必须无量纲：Ht/ℏ 的量纲为 1。",
    ],
    evidence: ["课件 7 slides 11–15（observable、能量基与时间演化）", "课件 8 slide 15", "课件 7 slide 14 原式负号勘误；Born rule 为本页使用但未展开的标准测量公设"],
  },

  [conceptFormulaKey("quantum-bridge", "density matrix 同时装下量子与经典不确定性")]: {
    id: "quantum-density-matrix-expectation-purity",
    title: "从纯态系综构造 density matrix",
    kind: "定义",
    origin:
      "当制备过程以概率 pα 产生纯态 |ψα⟩ 时，density operator 定义为各纯态 projector 的概率平均；trace 公式把量子期望与经典混合概率合并。",
    symbols: [
      { symbol: "ρ", meaning: "density operator" },
      { symbol: "pα", meaning: "制备纯态 |ψα⟩ 的经典概率，Σαpα=1" },
      { symbol: "A", meaning: "observable 算符" },
      { symbol: "Trρ²", meaning: "purity；纯态为 1，非平凡混态小于 1" },
      { symbol: "|χ⟩", meaning: "用于检验 positivity 的任意测试态" },
    ],
    prerequisites: ["projector |ψ⟩⟨ψ|", "trace", "概率加权平均"],
    assumptions: ["pα≥0 且 Σαpα=1；各 |ψα⟩ 已归一化"],
    steps: [
      {
        title: "对每次制备写纯态期望",
        formula: "⟨A⟩α=⟨ψα|A|ψα⟩",
        explanation:
          "这是 Born rule 对 observable 平均值的写法。",
      },
      {
        title: "再对制备概率平均",
        formula: "⟨A⟩=Σαpα⟨ψα|A|ψα⟩=Tr[(Σαpα|ψα⟩⟨ψα|)A]",
        explanation:
          "使用 Tr(|u⟩⟨v|A)=⟨v|A|u⟩，把每一项改写成 trace。",
      },
      {
        title: "把括号定义为 density operator",
        formula: "ρ=Σαpα|ψα⟩⟨ψα|  ⇒  ⟨A⟩=Tr(ρA)",
        explanation:
          "这一步只完成定义与 expectation 的重写；下面再逐项验证合法 density matrix 的性质。",
      },
      {
        title: "逐项验证归一化、Hermiticity 与 positivity",
        formula: "Trρ=Σαpα=1;  ρ†=ρ;  ⟨χ|ρ|χ⟩=Σαpα|⟨ψα|χ⟩|²≥0",
        explanation:
          "归一化使用 Tr(|ψα⟩⟨ψα|)=1；每个 projector 都 Hermitian；任意测试态 |χ⟩ 给出的 quadratic form 都是非负项之和，因此 ρ positive semidefinite。",
      },
      {
        title: "展开 purity，避免把 ρ² 与一个数混淆",
        formula: "Trρ²=Σα,β pαpβ|⟨ψα|ψβ⟩|²≤1",
        explanation:
          "一般非正交 mixture 含交叉 overlap；只有互相正交的制备态才化为 Σαpα²。纯态只有一个非零 eigenvalue 1，所以 ρ²=ρ 且 Trρ²=1。",
      },
    ],
    conclusion: "ρ=Σαpα|ψα⟩⟨ψα|;  ⟨A⟩=Tr(ρA);  purity=Trρ²",
    checks: [
      "单一纯态 p1=1 时，ρ²=ρ 且 Trρ²=1。",
      "最大混合 d 维态 ρ=I/d 时，Trρ²=1/d。",
    ],
    evidence: ["课件 7 slides 15–17（density matrix 与 purity）", "课件 8 slides 16–17（trace expectation）", "课件 7 中把 ρ² 与 Σpα² 混写处按正交混合条件修正"],
  },

  [conceptFormulaKey("quantum-bridge", "quantum Liouville 与平衡")]: {
    id: "quantum-von-neumann-equilibrium",
    title: "从 Schrödinger 方程到 quantum Liouville 方程",
    kind: "推导结果",
    origin:
      "对纯态 projector 使用 Schrödinger 方程及其 adjoint，再以线性性推广到混态，可得到 Liouville–von Neumann equation。",
    symbols: [
      { symbol: "ρ", meaning: "density operator" },
      { symbol: "[H,ρ]", meaning: "commutator Hρ−ρH" },
      { symbol: "∂tρ", meaning: "density operator 的时间导数" },
    ],
    prerequisites: ["Schrödinger 方程", "乘积求导", "commutator"],
    assumptions: ["封闭系统；H 对所有 ensemble members 相同", "这里的 equilibrium 只指在给定 H 下 stationary；热力学平衡还需给定约束并作 entropy maximum / reservoir argument"],
    steps: [
      {
        title: "先对纯态 projector 求导",
        formula: "ρ=|ψ⟩⟨ψ|  ⇒  ∂tρ=|ψdot⟩⟨ψ|+|ψ⟩⟨ψdot|",
        explanation:
          "bra 和 ket 都随时间变，因此乘积求导必须有两项。",
      },
      {
        title: "代入 ket 与 bra 的运动方程",
        formula: "|ψdot⟩=-(i/ℏ)H|ψ⟩;  ⟨ψdot|=(i/ℏ)⟨ψ|H",
        explanation:
          "第二式是第一式取 Hermitian conjugate，符号随 i 的复共轭改变。",
      },
      {
        title: "合并成 commutator",
        formula: "∂tρ=-(i/ℏ)(Hρ-ρH)  ⇒  iℏ∂tρ=[H,ρ]",
        explanation:
          "混态是纯态 projector 的线性组合，所以同一方程逐项成立。",
      },
      {
        title: "区分 stationary 与 thermodynamic equilibrium",
        formula: "∂tρ=0  ⇔  [H,ρ]=0",
        explanation:
          "这只是封闭系统在给定 H 下不随时间变化的充要条件。任意能量本征态 projector 也满足它，却不自动是有某个温度的 canonical equilibrium；Boltzmann 形式还需要热浴或最大熵约束。",
      },
    ],
    conclusion: "iℏ∂tρ=[H,ρ];  equilibrium: [H,ρ]=0",
    checks: [
      "ρ=f(H) 时必有 [H,ρ]=0。",
      "非简并能量基中平衡 ρ 必须对角；简并子空间内可保留 coherence。",
      "不要反推“与 H 对易 ⇒ 必为 e^{-βH}/Z”；commutator 只判 stationarity，不决定温度或概率权重。",
    ],
    evidence: ["课件 7 slide 18", "课件 8 slide 17"],
  },

  [conceptFormulaKey("quantum-bridge", "三种量子系综只是把概率变成算符")]: {
    id: "quantum-canonical-grand-density-operators",
    title: "量子 canonical 与 grand-canonical density operators",
    kind: "推导结果",
    origin:
      "在能量本征基中，经典的 Boltzmann 权重成为本征态概率；把谱分解重新写成算符函数，就得到量子 density operator。",
    symbols: [
      { symbol: "ρmc", meaning: "microcanonical density operator P_E/Tr(P_E)" },
      { symbol: "P_E", meaning: "投影到指定能量壳子空间的 projector" },
      { symbol: "ρc", meaning: "quantum canonical density operator" },
      { symbol: "ρgc", meaning: "quantum grand-canonical density operator" },
      { symbol: "N", meaning: "粒子数算符" },
      { symbol: "Tr", meaning: "对完整量子态空间取 trace" },
    ],
    prerequisites: ["Boltzmann 权重", "谱分解", "trace 归一化"],
    assumptions: ["microcanonical 固定能量壳与固定粒子数 sector", "canonical trace 在固定 N 的 Hilbert sector 取", "grand-canonical trace 跨越全部粒子数 sectors，通常要求 [H,N]=0", "与相应 reservoir 弱耦合后达到热平衡"],
    steps: [
      {
        title: "先写 microcanonical 的能量壳混合",
        formula: "ρmc=P_E/Tr(P_E);  P_E=Σ_{n:En∈shell}|n⟩⟨n|",
        explanation:
          "Tr(P_E) 是能量壳内量子态数；ρmc 在该子空间给每个微观态相同权重，在壳外权重为零。",
      },
      {
        title: "在能量基写 canonical 概率",
        formula: "pn=e^{-βEn}/Z_N;  Z_N=Σ_{n∈ℋ_N}e^{-βEn}=Tr_{ℋ_N}(e^{-βH})",
        explanation:
          "因为 H|n⟩=En|n⟩，算符 e^{-βH} 在该基中的本征值就是 e^{-βEn}；canonical 的 trace 不跨越不同 N。",
      },
      {
        title: "重组 canonical 谱分解",
        formula: "ρc=Σn pn|n⟩⟨n|=e^{-βH}/Tr(e^{-βH})",
        explanation:
          "分母保证 Trρc=1。",
      },
      {
        title: "允许粒子交换",
        formula: "p_{N,n}∝e^{-β(En-μN)};  Tr_F=ΣN Tr_{ℋ_N}  ⇒  ρgc=e^{-β(H-μN)}/Tr_F(e^{-β(H-μN)})",
        explanation:
          "把受热浴控制的能量改成 E−μN；Fock-space trace 明确同时覆盖粒子数 sectors 与每个 sector 的量子态。",
      },
    ],
    conclusion: "ρc=e^{-βH}/Tr(e^{-βH});  ρgc=e^{-β(H−μN)}/Tr(e^{-β(H−μN)})",
    checks: [
      "两种 density operator 的 trace 都必须等于 1。",
      "若 μN 项量纲不是能量，指数就不可能无量纲。",
      "microcanonical 的 Tr(P_E) 是壳内态数；canonical 的 Z_N 与 grand-canonical 的 Ξ 不可混用。",
    ],
    evidence: ["课件 7 slide 19（三种 quantum ensembles）", "课件 8 slide 18（canonical / grand-canonical density operators）"],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "回访作业 2 Q2：现在再做量子谐振子",
    "Z1=e^{-βℏω/2}/(1−e^{-βℏω}),  ZN=Z1^N",
  )]: {
    id: "quantum-oscillator-partition-function",
    title: "量子谐振子的 geometric partition sum",
    kind: "推导结果",
    origin:
      "把一维 harmonic oscillator 的离散能谱 En=ℏω(n+1/2) 代入 canonical partition function，求一个 geometric series。",
    symbols: [
      { symbol: "Z1", meaning: "单个一维量子谐振子的 partition function" },
      { symbol: "ZN", meaning: "N 个可区分、独立振子的总 partition function" },
      { symbol: "ω", meaning: "振子角频率" },
      { symbol: "n", meaning: "振子能级量子数 0,1,2,…" },
    ],
    prerequisites: ["量子谐振子能谱", "geometric series", "独立系统的 Z 相乘"],
    assumptions: ["振子彼此独立且有标签；canonical equilibrium；一维振子"],
    steps: [
      {
        title: "把能谱代入定义",
        formula: "Z1=Σn=0∞ e^{-βℏω(n+1/2)}=e^{-βℏω/2}Σn=0∞(e^{-βℏω})^n",
        explanation:
          "先把与 n 无关的 zero-point factor 提到求和号外。",
      },
      {
        title: "计算 geometric series",
        formula: "Σn=0∞q^n=1/(1-q),  q=e^{-βℏω}<1",
        explanation:
          "β>0、ω>0 保证 q<1，因此级数收敛。",
      },
      {
        title: "组合 N 个独立振子",
        formula: "Z1=e^{-βℏω/2}/(1-e^{-βℏω});  ZN=Πj=1N Z1=Z1^N",
        explanation:
          "这里的 N 个振子是可区分的独立 sites，不再除 N!。",
      },
    ],
    conclusion: "Z1=e^{-βℏω/2}/(1−e^{-βℏω}),  ZN=Z1^N",
    checks: [
      "T→0 时 Z1 只剩 ground-state weight e^{-βℏω/2}。",
      "若漏掉 zero-point factor，U 会错误地失去 ℏω/2。",
    ],
    evidence: ["作业 2 Q2", "作业 2 答案 pp. 2–3"],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "回访作业 2 Q2：现在再做量子谐振子",
    "U/N=ℏω/2+ℏω/(e^{βℏω}−1)",
  )]: {
    id: "quantum-oscillator-mean-energy",
    title: "由 ln Z 求量子谐振子平均能量",
    kind: "推导结果",
    origin:
      "canonical identity U=−∂βlnZN 作用在 geometric partition function 上。",
    symbols: [
      { symbol: "U/N", meaning: "每个一维量子谐振子的平均能量" },
      { symbol: "β", meaning: "1/(kBT)" },
      { symbol: "ℏω/2", meaning: "temperature-independent zero-point energy" },
    ],
    prerequisites: ["量子振子 Z1", "logarithmic derivative", "chain rule"],
    assumptions: ["N 个独立相同振子；canonical equilibrium"],
    steps: [
      {
        title: "先取 partition function 的对数",
        formula: "lnZN=N[-βℏω/2-ln(1-e^{-βℏω})]",
        explanation:
          "乘积 Z1^N 变成 NlnZ1，便于求导。",
      },
      {
        title: "逐项对 β 求导",
        formula: "-∂βlnZN=N[ℏω/2+ℏω e^{-βℏω}/(1-e^{-βℏω})]",
        explanation:
          "第二项来自 -ln(1-e^{-βℏω}) 的 chain rule。",
      },
      {
        title: "把指数比改成标准 occupation",
        formula: "e^{-x}/(1-e^{-x})=1/(e^x-1)",
        explanation:
          "令 x=βℏω，即得 Bose-like thermal occupation factor。",
      },
    ],
    conclusion: "U/N=ℏω/2+ℏω/(e^{βℏω}−1)",
    checks: [
      "T→0 时 U/N→ℏω/2。",
      "βℏω≪1 时 ℏω/(e^{βℏω}−1)=kBT−ℏω/2+O[(ℏω)²/(kBT)]，与 zero-point term 相消后 U/N≈kBT，回到一维经典 equipartition。",
    ],
    evidence: ["作业 2 Q2", "作业 2 答案 pp. 2–3"],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "回访作业 2 Q2：现在再做量子谐振子",
    "p(n)=(1−e^{-βℏω})e^{-nβℏω}",
  )]: {
    id: "quantum-oscillator-level-probability",
    title: "量子谐振子能级的 normalized geometric probability",
    kind: "推导结果",
    origin:
      "canonical level probability pn=e^{-βEn}/Z1 中，zero-point factor 在分子与分母相消，留下 normalized geometric distribution。",
    symbols: [
      { symbol: "p(n)", meaning: "振子处于第 n 个能级的概率" },
      { symbol: "n", meaning: "非负整数能级量子数" },
      { symbol: "q", meaning: "e^{-βℏω}" },
    ],
    prerequisites: ["canonical probability", "量子振子 Z1", "geometric normalization"],
    assumptions: ["β>0、ω>0，因此 0<q<1"],
    steps: [
      {
        title: "用 Boltzmann weight 除以 Z1",
        formula: "p(n)=e^{-βℏω(n+1/2)}/[e^{-βℏω/2}/(1-e^{-βℏω})]",
        explanation:
          "共同的 zero-point factor 完全约掉，所以它不影响相对能级概率。",
      },
      {
        title: "整理成 geometric distribution",
        formula: "p(n)=(1-q)q^n,  q=e^{-βℏω}",
        explanation:
          "这给出第 n 个 excitation level 的概率。",
      },
      {
        title: "显式检查归一化",
        formula: "Σn=0∞p(n)=(1-q)Σn=0∞q^n=1",
        explanation:
          "归一化要求前因子必须是 1−q；作业 1 答案中的 1+q 是明确笔误。",
      },
    ],
    conclusion: "p(n)=(1−e^{-βℏω})e^{-nβℏω}",
    checks: [
      "把 n 从 0 求和必须得到 1。",
      "T→0 时 p(0)→1，所有 n>0 的概率趋零。",
    ],
    evidence: ["作业 2 Q2", "作业 2 答案 p. 3（canonical level probability）", "作业 1 Q4(c) 答案 p. 12 的 1+q 归一化笔误勘误"],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "作业 3 Q1 主线：先懂结构，再攻积分",
    "K(x,x′;β)=Σn e^{-βEn}φn(x)φn*(x′)",
  )]: {
    id: "quantum-oscillator-thermal-kernel-spectral",
    title: "thermal kernel 的 spectral decomposition",
    kind: "推导结果",
    origin:
      "在 K(x,x′;β)=⟨x|e^{-βH}|x′⟩ 中插入能量本征态的完备关系，并使用 H 的谱分解。",
    symbols: [
      { symbol: "K(x,x′;β)", meaning: "unnormalized thermal density kernel" },
      { symbol: "φn(x)", meaning: "能量本征函数 ⟨x|n⟩" },
      { symbol: "En", meaning: "第 n 个能量本征值" },
      { symbol: "ξ, ξ′", meaning: "无量纲位置 √(mω/ℏ)x 与 √(mω/ℏ)x′" },
      { symbol: "q", meaning: "e^{-βℏω}，满足 0<q<1" },
      { symbol: "A, J", meaning: "把 k,k′ 积分写成 2×2 Gaussian 时的矩阵与 source vector" },
    ],
    prerequisites: ["完备关系", "算符函数的谱分解", "position representation", "Hermite Rodrigues formula", "Fourier transform", "2×2 Gaussian integral"],
    assumptions: ["一维 harmonic oscillator", "β>0、ω>0", "离散完整能谱；本征函数采用正交归一约定", "Fourier convention F(k)=∫dξ e^{-ikξ}f(ξ)"],
    steps: [
      {
        title: "在指数算符后插入恒等算符",
        formula: "K=⟨x|e^{-βH}(Σn|n⟩⟨n|)|x′⟩",
        explanation:
          "完备关系不会改变矩阵元，却把问题分解到 H 的本征态。",
      },
      {
        title: "让算符指数作用在本征态上",
        formula: "e^{-βH}|n⟩=e^{-βEn}|n⟩",
        explanation:
          "算符函数在本征态上等于对本征值使用同一函数。",
      },
      {
        title: "识别 position-space wavefunctions",
        formula: "⟨x|n⟩=φn(x);  ⟨n|x′⟩=φn*(x′)",
        explanation:
          "代回即得到结论中的 spectral sum。下面继续展开作业 3 Q1 省略最多的 Hermite 求和，不用一句“由 Mehler 公式”直接跳过。",
      },
      {
        title: "把 Hermite 导数变成 Fourier 空间乘法",
        formula: "Hn(ξ)=(-1)^n e^{ξ²}∂ξ^n e^{-ξ²};  e^{-ξ²}=(1/(2π))∫dk √πe^{-k²/4}e^{ikξ};  ∂ξ^n e^{ikξ}=(ik)^n e^{ikξ}",
        explanation:
          "Rodrigues formula 中难处理的 n 阶导数，在 Fourier space 只会产生 (ik)^n；对 ξ′ 也做同一变换。",
      },
      {
        title: "先对 n 求和，再保留两个普通积分",
        formula: "Σn e^{-βℏω(n+1/2)}Hn(ξ)Hn(ξ′)/(2^n n!) = e^{-βℏω/2}e^{ξ²+(ξ′)²}/(4π) ∫dk dk′ exp[-(k²+2qkk′+(k′)²)/4+i(kξ+k′ξ′)]",
        explanation:
          "两次 Fourier transform 给乘积 (-kk′)^n；与 q^n/2^n n! 相乘后用 Σn y^n/n!=e^y，得到指数中的负交叉项。",
      },
      {
        title: "明确 2×2 Gaussian 的 A、J 与正号",
        formula: "v=(k,k′)ᵀ;  A=(1/2)[[1,q],[q,1]];  J=i(ξ,ξ′)ᵀ;  detA=(1-q²)/4>0;  ∫d²v e^{-vᵀAv/2+Jᵀv}=(2π)/√detA · e^{JᵀA^{-1}J/2}",
        explanation:
          "标准 source term 是 +JᵀA^{-1}J/2；本题 J 含 i，所以实际位置指数仍为负。detA>0 保证 Gaussian 收敛。作业题面把标准 source exponent 印成负号，不能跟着改错。",
      },
      {
        title: "完成矩阵逆并还原 x,x′",
        formula: "K=√[mω/(2πℏsinh y)] exp{-(mω/(4ℏ))[(x+x′)²tanh(y/2)+(x-x′)²coth(y/2)]},  y=βℏω",
        explanation:
          "A^{-1}=2(1-q²)^{-1}[[1,-q],[-q,1]]。把 q=e^{-y} 改写成 sinh、cosh，并用 ξ=√(mω/ℏ)x，即得到完整 Mehler thermal kernel。",
      },
    ],
    conclusion: "K(x,x′;β)=Σn e^{-βEn}φn(x)φn*(x′)",
    checks: [
      "β→∞ 时应只剩 ground-state projector 乘 e^{-βE0}。",
      "K(x,x′;β)*=K(x′,x;β)，符合 Hermiticity。",
      "2×2 Gaussian 必须满足 detA=(1-e^{-2βℏω})/4>0；source 项标准符号为正。",
    ],
    evidence: ["作业 3 Q1(a–c)", "作业 3 答案 pp. 2–5（completeness → Hermite Fourier → 2×2 Gaussian → Mehler kernel）", "作业 3 Q1(c) 题面多维 Gaussian 的 source 指数负号勘误"],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "作业 3 Q1 主线：先懂结构，再攻积分",
    "Z=∫dx K(x,x;β)=1/[2sinh(βℏω/2)]",
  )]: {
    id: "quantum-oscillator-kernel-trace",
    title: "从 Mehler kernel 取 trace 得 partition function",
    kind: "推导结果",
    origin:
      "partition function 是 e^{-βH} 的 trace；在 position basis 中 trace 是 kernel 对角线的积分。对 harmonic oscillator 的 Mehler kernel，积分退化为一维 Gaussian。",
    symbols: [
      { symbol: "K(x,x;β)", meaning: "thermal kernel 的对角元" },
      { symbol: "Z", meaning: "一维量子 harmonic oscillator partition function" },
      { symbol: "sinh", meaning: "双曲正弦函数" },
      { symbol: "y", meaning: "dimensionless inverse temperature βℏω" },
      { symbol: "C", meaning: "Mehler kernel prefactor √[mω/(2πℏsinh y)]" },
      { symbol: "a", meaning: "对角 Gaussian coefficient (mω/ℏ)tanh(y/2)>0" },
      { symbol: "ρ(x,x′;β)", meaning: "normalized kernel K(x,x′;β)/Z" },
    ],
    prerequisites: ["trace 的 basis independence", "Mehler kernel", "Gaussian integral"],
    assumptions: ["一维 harmonic oscillator；β>0"],
    steps: [
      {
        title: "在 position basis 写 trace",
        formula: "Z=Tr(e^{-βH})=∫dx⟨x|e^{-βH}|x⟩=∫dx K(x,x;β)",
        explanation:
          "连续基的完备关系把离散对角和换成对 x 的积分。",
      },
      {
        title: "先把容易混淆的 C 与 a 定义清楚",
        formula: "y=βℏω;  C=√[mω/(2πℏsinh y)];  a=(mω/ℏ)tanh(y/2)",
        explanation:
          "C 是未归一化 kernel 的 prefactor，a 是对角线上 x² 的正系数；两者都不是任意常数。β>0 保证 a>0。",
      },
      {
        title: "令 x′=x 化简 Mehler exponent",
        formula: "K(x,x;β)=C exp[-ax²]",
        explanation:
          "完整 kernel 中 (x−x′)² 项消失，(x+x′)² 变成 4x²，所以恰好留下 a=(mω/ℏ)tanh(y/2)。",
      },
      {
        title: "完成 Gaussian integral 并化简双曲函数",
        formula: "Z=C√(π/a)=1/√[2sinh y·tanh(y/2)]=1/[2sinh(y/2)]",
        explanation:
          "因为 sinh y=2sinh(y/2)cosh(y/2)，所以 2sinh y·tanh(y/2)=4sinh²(y/2)。这把 prefactor 化简过程完整写出。",
      },
      {
        title: "把未归一化 kernel 除以 Z",
        formula: "ρ(x,x′;β)=K/Z=√[mωtanh(y/2)/(πℏ)] exp{-(mω/(4ℏ))[(x+x′)²tanh(y/2)+(x-x′)²coth(y/2)]}",
        explanation:
          "2sinh(y/2)C=√[mωtanh(y/2)/(πℏ)]。这就是作业 3 Q1(d) 要求的完整 normalized density matrix；令 x′=x 才进入下一条的 position probability。",
      },
      {
        title: "顺手完成作业 3 Q1(f) 的 energy 检查",
        formula: "⟨H⟩=Tr(Hρ)=-∂βlnZ=(ℏω/2)coth(y/2)",
        explanation:
          "由 Z=[2sinh(y/2)]^{-1}，有 −∂βlnZ=(1/2)coth(y/2)·∂βy；再用 ∂βy=ℏω。它与 ℏω/2+ℏω/(e^y−1) 完全等价。",
      },
    ],
    conclusion: "Z=∫dx K(x,x;β)=1/[2sinh(βℏω/2)]",
    checks: [
      "结果应等价于 e^{-βℏω/2}/(1-e^{-βℏω})。",
      "Z 无量纲，且 β→∞ 时趋 e^{-βℏω/2}。",
    ],
    evidence: ["作业 3 Q1(d,f)", "作业 3 答案 pp. 5–6（kernel 对角线、Gaussian trace、normalized density matrix 与 ⟨H⟩）"],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "作业 3 Q1 主线：先懂结构，再攻积分",
    "⟨x²⟩=ℏ/[2mω] coth(βℏω/2)",
  )]: {
    id: "quantum-oscillator-position-variance",
    title: "thermal oscillator 的位置方差",
    kind: "推导结果",
    origin:
      "normalized density kernel 的对角元是 centered Gaussian；用 Gaussian second moment 即得 ⟨x²⟩。",
    symbols: [
      { symbol: "⟨x²⟩", meaning: "thermal position second moment" },
      { symbol: "m", meaning: "振子质量" },
      { symbol: "ω", meaning: "振子角频率" },
      { symbol: "coth", meaning: "双曲余切" },
      { symbol: "a", meaning: "(mω/ℏ)tanh(βℏω/2)，normalized Gaussian 的 inverse-width coefficient" },
    ],
    prerequisites: ["normalized density kernel", "Gaussian second moment", "hyperbolic functions"],
    assumptions: ["一维 harmonic oscillator；平衡态中心在 x=0"],
    steps: [
      {
        title: "先用 Z 归一化 kernel",
        formula: "K(x,x)=Ce^{-ax²};  Z=C√(π/a)  ⇒  ρ(x,x;β)=K/Z=√(a/π)e^{-ax²}",
        explanation:
          "C 在分子与 Z 中相消；这一步同时说明 √(a/π) 从哪里来，而不是直接猜一个 normalized Gaussian。",
      },
      {
        title: "由 normalization 对 a 求导得到二阶矩",
        formula: "I0(a)=∫dx e^{-ax²}=√(π/a);  -dI0/da=∫dx x²e^{-ax²}=√π/(2a^{3/2})  ⇒  ⟨x²⟩=1/(2a)",
        explanation:
          "最后除以 I0，等价于乘 normalized prefactor √(a/π)。这把 Gaussian second moment 的中间计算补全。",
      },
      {
        title: "代回 a 并取倒数",
        formula: "1/(2a)=ℏ/[2mω tanh(βℏω/2)]=ℏ/[2mω]coth(βℏω/2)",
        explanation:
          "使用 coth y=1/tanh y。",
      },
    ],
    conclusion: "⟨x²⟩=ℏ/[2mω] coth(βℏω/2)",
    checks: [
      "T→0 时得到 ground-state variance ℏ/(2mω)。",
      "high T 时 coth y≈1/y，得到 ⟨x²⟩≈kBT/(mω²)，符合 equipartition。",
    ],
    evidence: ["作业 3 Q1(d–e)", "作业 3 答案 pp. 5–6（先归一化 kernel，再算 Gaussian second moment）"],
  },

  [conceptFormulaKey("quantum-statistics", "exchange symmetry 决定允许的多粒子态")]: {
    id: "quantum-exchange-symmetry-postulate",
    title: "交换两次的数学约束与 quantum statistics 公设",
    kind: "公设 / 经验定律",
    origin:
      "对三维空间中的相同粒子，交换两次必须回到同一物理态，因此交换相位只能是 ±1；自然界粒子选择 symmetric 或 antisymmetric sector 是 symmetrization postulate，不由这两行代数单独证明。",
    symbols: [
      { symbol: "P12", meaning: "交换粒子 1 与 2 标签的算符" },
      { symbol: "Ψ", meaning: "多粒子 wavefunction" },
      { symbol: "+", meaning: "bosonic symmetric sector" },
      { symbol: "−", meaning: "fermionic antisymmetric sector" },
    ],
    prerequisites: ["相同粒子不可区分性", "线性算符", "整体相位不改变物理态"],
    assumptions: ["三维普通 boson/fermion；二维 anyon 不受仅 ±1 的同一限制"],
    steps: [
      {
        title: "允许交换产生一个相位",
        formula: "P12Ψ=e^{iφ}Ψ",
        explanation:
          "相同粒子交换后所有可观测概率不变，因此最多相差一个单位模相位。",
      },
      {
        title: "使用交换两次回到原态",
        formula: "P12²Ψ=e^{2iφ}Ψ=Ψ  ⇒  e^{iφ}=±1",
        explanation:
          "这一步只把可能的 exchange eigenvalue 限制为 ±1。",
      },
      {
        title: "明确物理公设的角色",
        formula: "boson: P12Ψ=+Ψ;  fermion: P12Ψ=-Ψ",
        explanation:
          "把整数自旋粒子放入 symmetric sector、半整数自旋粒子放入 antisymmetric sector 还依赖 spin-statistics theorem；本课程把它作为输入，不伪装成初等推导。",
      },
    ],
    conclusion: "P12Ψ=+Ψ (boson);  P12Ψ=−Ψ (fermion)",
    checks: [
      "antisymmetric wavefunction 在两粒子占同一单粒子态时必须为零。",
      "交换算符的本征值平方必须为 1。",
    ],
    evidence: ["课件 8 slides 2–3"],
  },

  [conceptFormulaKey("quantum-statistics", "occupation-number representation")]: {
    id: "quantum-occupation-number-bookkeeping",
    title: "用 occupation numbers 重写粒子数与能量",
    kind: "定义",
    origin:
      "对 noninteracting particles，多粒子态可由每个单粒子 substate 的 occupation niα 指定；总粒子数和总能量因此是逐 substate 的加和。",
    symbols: [
      { symbol: "i", meaning: "能量 level 标签" },
      { symbol: "α", meaning: "同一能量 level 内的 degeneracy 标签" },
      { symbol: "niα", meaning: "substate (i,α) 的 occupation number" },
      { symbol: "εi", meaning: "level i 的单粒子能量" },
    ],
    prerequisites: ["单粒子能级", "degeneracy", "noninteracting Hamiltonian"],
    assumptions: ["总 Hamiltonian 是单粒子能量之和；无 interaction energy"],
    steps: [
      {
        title: "逐 substate 数粒子",
        formula: "N=Σi Σα niα",
        explanation:
          "每个 occupation 都贡献 niα 个粒子；boson 可取 0,1,2,…，fermion 只能取 0 或 1。",
      },
      {
        title: "逐粒子累加单粒子能量",
        formula: "E=Σi Σα εi niα",
        explanation:
          "noninteracting 条件保证没有额外的 pair interaction term。",
      },
    ],
    conclusion: "N=Σi,α niα;  E=Σi,α εi niα",
    checks: [
      "若 level i 有 gi 个 substates，α 的求和范围必须包含 gi 项。",
      "出现 interaction 时，E 通常不能只写成 Σ εi niα。",
    ],
    evidence: ["课件 8 slides 4–5", "作业 3 Q2"],
  },

  [conceptFormulaKey("quantum-statistics", "microcanonical counting 与最可能分布")]: {
    id: "quantum-be-fd-most-probable-occupation",
    title: "从 multiplicity 极大化到 BE/FD occupation",
    kind: "近似",
    origin:
      "对每个简并 level 写 bosonic 或 fermionic multiplicity，令总 multiplicity 在固定 N、E 下最大；用 Stirling approximation 和 Lagrange multipliers 求 thermodynamic-limit 的最可能 occupation。",
    symbols: [
      { symbol: "n̄i", meaning: "level i（含全部 gi 个 substates）的平均/最可能总 occupation" },
      { symbol: "gi", meaning: "level i 的 degeneracy" },
      { symbol: "μ", meaning: "particle-number constraint 对应的 chemical potential" },
      { symbol: "∓", meaning: "上方减号用于 boson，下方加号用于 fermion" },
    ],
    prerequisites: ["BE/FD combinatorial multiplicity", "Stirling approximation", "Lagrange multiplier"],
    assumptions: ["noninteracting particles", "thermodynamic limit", "Stirling route 要求相关 factorial arguments 都大：boson 的 ni、gi−1、ni+gi−1；fermion 的 ni、gi−ni、gi", "当某些 occupation 很小时，应改用 grand-canonical single-state factorization；它给出同一 BE/FD 平均占据而不依赖该 Stirling 步骤"],
    steps: [
      {
        title: "写每个 level 的 multiplicity",
        formula: "Wi,B=(ni+gi-1)!/[ni!(gi-1)!];  Wi,F=gi!/[ni!(gi-ni)!]",
        explanation:
          "Boson 是把 ni 个相同粒子放入 gi 个 substates；fermion 只能从 gi 个 substates 选择 ni 个。",
      },
      {
        title: "带约束极大化 lnW",
        formula: "δ[Σi lnWi-αΣi ni-βΣi εi ni]=0",
        explanation:
          "α、β 分别固定总粒子数和总能量。",
      },
      {
        title: "对 ni 求导并解指数",
        formula: "boson: ln[(ni+gi)/ni]≈α+βεi;  fermion: ln[(gi-ni)/ni]≈α+βεi",
        explanation:
          "Stirling 把 factorial 的差变成 log ratio；boson 精确计数中的 gi−1 在 thermodynamic limit 下被 gi 取代。随后识别 α=−βμ。",
      },
      {
        title: "整理两类结果",
        formula: "n̄i=gi/[e^{β(εi-μ)}∓1]",
        explanation:
          "带 gi 的 n̄i 是整个 degenerate level 的总 occupation；单个 substate 的 occupation 不带 gi。",
      },
    ],
    conclusion: "n̄i=gi/[e^{β(εi−μ)}∓1]",
    checks: [
      "Boson 使用减号，允许 occupation 无上限；fermion 使用加号并保证每 substate occupation≤1。",
      "稀薄极限两者都应趋 gi e^{-β(εi-μ)}。",
      "作业 3 答案 p. 9 虽把左侧写成 ⟨niα⟩，右侧却带 gi；该右侧实际是 level total ⟨ni⟩=Σα⟨niα⟩，单 substate 结果不带 gi。",
    ],
    evidence: ["课件 8 slides 4–9（BE/FD counting 与 Stirling route）", "作业 3 Q2(b)", "作业 3 答案 p. 9（带 gi 的结果应解释为整个 level occupation）"],
  },

  [conceptFormulaKey("quantum-statistics", "grand canonical factorization：更快的主路线")]: {
    id: "quantum-grand-factorization-be-fd",
    title: "noninteracting modes 的 grand partition factorization",
    kind: "推导结果",
    origin:
      "在 grand canonical ensemble 中固定 N 的 constraint 被 fugacity weight 吸收。noninteracting Hamiltonian 使指数对每个 substate 相加，因此总求和可 factorize。",
    symbols: [
      { symbol: "ΞB, ΞF", meaning: "bosonic / fermionic grand partition function" },
      { symbol: "z", meaning: "fugacity e^{βμ}" },
      { symbol: "gi", meaning: "level i 的 degeneracy" },
      { symbol: "niα", meaning: "单 substate occupation" },
      { symbol: "qi", meaning: "single-substate Boltzmann-fugacity factor ze^{-βεi}=e^{-β(εi−μ)}" },
    ],
    prerequisites: ["grand-canonical weight", "geometric series", "occupation-number representation"],
    assumptions: ["noninteracting modes", "boson 要求 ze^{-βεi}<1", "fermion niα∈{0,1}"],
    steps: [
      {
        title: "把 grand weight 写成 substate 乘积",
        formula: "e^{-β(E-μN)}=Πi,α [ze^{-βεi}]^{niα}",
        explanation:
          "E 与 N 都是 occupation 的和，所以指数的和变成乘积。",
      },
      {
        title: "对一个 bosonic substate 求和",
        formula: "Σn=0∞(ze^{-βεi})^n=[1-ze^{-βεi}]^{-1}",
        explanation:
          "level i 有 gi 个相同能量的独立 substates，因此该因子取 gi 次方。",
      },
      {
        title: "对一个 fermionic substate 求和",
        formula: "Σn=0,1(ze^{-βεi})^n=1+ze^{-βεi}",
        explanation:
          "Pauli exclusion 把无穷 geometric sum 截成两项。",
      },
      {
        title: "乘遍所有 levels",
        formula: "ΞB=Πi[1-ze^{-βεi}]^{-gi};  ΞF=Πi[1+ze^{-βεi}]^{gi}",
        explanation:
          "这条 factorization 是 noninteracting quantum gas 最快的计算主线。",
      },
      {
        title: "对 level energy 求导得到平均 occupation",
        formula: "n̄i=-(1/β)∂_{εi}lnΞ;  n̄i,B=gi qi/(1-qi);  n̄i,F=gi qi/(1+qi)",
        explanation:
          "因为 ∂_{εi}[-βΣjεjnj]=-βni。把 qi=e^{-β(εi−μ)} 代入后，立即恢复 n̄i=gi/[e^{β(εi−μ)}∓1]，也说明 combinatorial route 与 grand route 一致。",
      },
    ],
    conclusion: "ΞB=Πi[1−ze^{-βεi}]^{-gi};  ΞF=Πi[1+ze^{-βεi}]^{gi}",
    checks: [
      "对单个 fermionic substate 展开只能得到 1+q，不能出现 q²。",
      "Boson denominator 接近 0 时 occupation 发散，提示 μ 不能超过最低单粒子能量。",
      "对 εi 求导得到的是整个 gi-fold level 的 occupation；除以 gi 才是单 substate 平均。",
    ],
    evidence: ["课件 8 slides 11–12（single-state factorization）", "作业 3 Q2(a–b)", "作业 3 答案 pp. 8–9（Ξ 与 derivative occupation）"],
  },

  [conceptFormulaKey("quantum-statistics", "单态概率、涨落与 classical limit")]: {
    id: "quantum-classical-dilute-limit",
    title: "BE/FD occupation 的 Maxwell–Boltzmann 极限",
    kind: "近似",
    origin:
      "当每个量子 substate 的 occupation 很小，BE/FD denominator 中的 ±1 相对 exponential 可忽略，两种量子统计都退化为 Maxwell–Boltzmann weight。",
    symbols: [
      { symbol: "n̄", meaning: "单 substate 的平均 occupation" },
      { symbol: "λT", meaning: "thermal de Broglie wavelength" },
      { symbol: "nλT³", meaning: "三维 phase-space degeneracy parameter" },
      { symbol: "gs", meaning: "internal spin degeneracy；一般 classical criterion 使用 nλT³/gs" },
      { symbol: "q", meaning: "e^{-β(ε−μ)}=ze^{-βε}，单 substate 的 fugacity weight" },
      { symbol: "PB, PF", meaning: "单一 bosonic / fermionic substate 的 normalized occupation probabilities" },
      { symbol: "Var(n)", meaning: "occupation-number variance ⟨n²⟩−⟨n⟩²" },
    ],
    prerequisites: ["BE/FD distribution", "fugacity", "thermal wavelength", "geometric 与 Bernoulli distributions"],
    assumptions: ["noninteracting single-particle substates", "ze^{-βε}≪1 对有显著权重的能级成立", "结论显示的 nλT³≪1 采用 gs=1；一般内部简并下应检验 nλT³/gs≪1"],
    steps: [
      {
        title: "从单 substate partition factor 归一化概率",
        formula: "PB(n)=(1-q)q^n,  n=0,1,…;  PF(n)=q^n/(1+q),  n=0,1",
        explanation:
          "Boson 用 Σnq^n=(1-q)^{-1}；fermion 只有空、占两种状态，normalizer 是 1+q。这里 q=e^{-β(ε−μ)}。",
      },
      {
        title: "由概率逐项求 mean occupation",
        formula: "n̄B=Σn n(1-q)q^n=q/(1-q);  n̄F=0·PF(0)+1·PF(1)=q/(1+q)",
        explanation:
          "把 q 改写成 e^{-β(ε−μ)}，就得到 1/[e^{β(ε−μ)}∓1]；Boson 与 fermion 的差只在 denominator 的常数项符号。",
      },
      {
        title: "再算二阶涨落，看到 bunching 与 Pauli suppression",
        formula: "VarB(n)=q∂q n̄B=n̄B(1+n̄B);  VarF(n)=q∂q n̄F=n̄F(1-n̄F)",
        explanation:
          "对 normalized q^n family，q∂q n̄=⟨n²⟩−⟨n⟩²。Boson 的加号放大涨落，fermion 的减号来自 n 只能取 0/1。",
      },
      {
        title: "要求 exponential 远大于 1",
        formula: "e^{β(ε-μ)}≫1  ⇔  ze^{-βε}≪1",
        explanation:
          "此时 denominator 的 ±1 都是相对小修正。",
      },
      {
        title: "把 microscopic small-q 条件连到 density criterion",
        formula: "3D MB limit:  n≈gs z/λT³  ⇒  z≈nλT³/gs≪1",
        explanation:
          "低能 substate 的 q 最大约为 z（ground energy 取 0）。因此一般条件是每个 internal substate 的 phase-space occupation nλT³/gs 很小；结论中的 spinless 写法令 gs=1。",
      },
      {
        title: "删除次要的 ±1",
        formula: "n̄B≈n̄F≈q=e^{-β(ε-μ)}",
        explanation:
          "此时 PB 与 PF 都以 P(1)/P(0)=q 开始，mean 与 variance 也都趋 q；classical limit 不是简单令 β→∞，而是要求低 fugacity / 低 phase-space density。",
      },
    ],
    conclusion: "n̄≈e^{-β(ε−μ)} when nλT³≪1",
    checks: [
      "classical limit 中 boson 与 fermion 必须给出同一 leading term。",
      "nλT³ 是无量纲量；若带单位说明 λT 或密度写错。",
      "检查涨落符号：Boson Var>n̄，fermion Var<n̄；q≪1 时两者都趋 Poisson-like Var≈n̄。",
    ],
    evidence: ["课件 8 slides 8, 10, 12–14（BE/FD occupation 与 classical limit）", "作业 3 Q2(c)", "作业 3 答案 p. 9（单态 Boson/Fermion probabilities；variance 由同一分布补推）"],
  },

  [conceptFormulaKey("bose-gas", "continuum limit 与 DOS 是所有气体题的入口")]: {
    id: "bose-continuum-density-of-states",
    title: "从 box quantization 到三维 density of states",
    kind: "近似",
    origin:
      "周期边界条件把允许的 k 点排成间距 2π/L 的晶格；大体积极限中，k 点求和可由 k-space cell density 转成积分，再用色散关系作 Jacobian 变换到能量。",
    symbols: [
      { symbol: "V", meaning: "盒体积 L³" },
      { symbol: "gs", meaning: "spin 或 polarization degeneracy" },
      { symbol: "D(ε)", meaning: "每单位能量的单粒子态数" },
      { symbol: "k", meaning: "wave-vector magnitude" },
    ],
    prerequisites: ["周期边界条件", "三维球坐标 Jacobian", "变量替换 dk/dε"],
    assumptions: ["V 足够大使能级近似连续", "各向同性 dispersion ε(k)", "结论最后一式按 k≥0 上单调递增 branch 书写，所以 dk/dε>0", "非单调或多 branch dispersion 必须对同一 ε 的所有 roots 求和", "ground state 若特殊必须单列"],
    steps: [
      {
        title: "计算一个 k-state 占据的 cell",
        formula: "kx=2πnx/L  ⇒  Δ³k=(2π/L)³=(2π)³/V",
        explanation:
          "每个 allowed k point 在 k space 占一个体积 (2π)³/V。",
      },
      {
        title: "把离散和换成 k-space 积分",
        formula: "Σk f(k)≈V/(2π)³∫d³k f(k)",
        explanation:
          "这是 continuum approximation；有限盒中的离散 ground state 不应因此被淹没。",
      },
      {
        title: "对各向同性系统取球壳",
        formula: "d³k=4πk²dk;  dNstates=gs V/(2π)³ 4πk²dk",
        explanation:
          "gs 只乘一次，用来计入相同 k 下的内部 substates。",
      },
      {
        title: "从 k 换成 energy",
        formula: "D(ε)=gs V/(2π)³·4π Σr kr(ε)²|dkr/dε|",
        explanation:
          "变量替换的 Jacobian 必须取绝对值，并对所有满足 ε(kr)=ε 的 branches/roots 相加。本课 quadratic 与 positive-slope linear dispersion 只有一个递增 root，才可去掉绝对值并得到结论的简写。",
      },
    ],
    conclusion: "Σk → V/(2π)³ ∫d³k;  D(ε)=gs V/(2π)³·4πk²·dk/dε",
    checks: [
      "quadratic dispersion 给 D(ε)∝√ε；linear dispersion 给 D(ε)∝ε²。",
      "D(ε)dε 必须是无量纲态数。",
      "若 dε/dk=0，DOS 可出现 van Hove singularity；此时不能机械使用单调 branch 的简式。",
    ],
    evidence: ["课件 8 slide 8", "课件 9 slides 2–3, 14–16, 20", "作业 3 Q3–Q4"],
  },

  [conceptFormulaKey("bose-gas", "三维非相对论 Bose 气体的 thermodynamic machine")]: {
    id: "bose-3d-quadratic-thermodynamics",
    title: "三维理想 Bose 气体的 number、pressure 与 energy",
    kind: "推导结果",
    origin:
      "把 bosonic grand partition 的 k-sum 换成三维 quadratic-dispersion DOS integral，并以 x=βε 无量纲化，便得到 thermal wavelength 与 Bose functions。",
    symbols: [
      { symbol: "n", meaning: "总 number density N/V" },
      { symbol: "n0", meaning: "ground-state number density N0/V" },
      { symbol: "λT", meaning: "h/√(2πmkBT)" },
      { symbol: "gν(z)", meaning: "Bose function Liν(z)" },
      { symbol: "z", meaning: "fugacity e^{βμ}" },
      { symbol: "gs", meaning: "internal degeneracy；本条 conclusion 按老师的 spinless convention 取 gs=1" },
    ],
    prerequisites: ["bosonic Ξ factorization", "3D quadratic DOS", "Gamma integral"],
    assumptions: ["ideal homogeneous 3D Bose gas", "ε=ℏ²k²/(2m)", "ground energy set to 0 so 0<z≤1", "结论采用 single-component / spinless gas，即 gs=1；若有 gs 个等价内部 substates，excited DOS、n 与 P 都应乘 gs"],
    steps: [
      {
        title: "把 excited-particle number 写成 integral",
        formula: "D(ε)/V=gs λT^{-3}β^{3/2}ε^{1/2}/Γ(3/2);  Ne=∫0∞D(ε)dε/[z^{-1}e^{βε}-1]",
        explanation:
          "3D quadratic DOS 已包含 internal degeneracy gs。k=0 ground state 单独记为 N0；continuum integral 只计算 excited states。",
      },
      {
        title: "无量纲化并识别 Bose function",
        formula: "gν(z)=Γ(ν)^{-1}∫0∞x^{ν-1}dx/[z^{-1}e^x-1]",
        explanation:
          "3D quadratic DOS∝ε^{1/2}，令 x=βε 后 number integral 的索引为 3/2。",
      },
      {
        title: "整理 number equation",
        formula: "Ne/V=gs λT^{-3}g_{3/2}(z);  gs=1  ⇒  n=n0+λT^{-3}g_{3/2}(z)",
        explanation:
          "所有 kinetic prefactors 合并为 λT^{-3}；老师课件与显示结论使用 spinless convention，所以最后令 gs=1。",
      },
      {
        title: "由 grand potential 求 pressure 与 energy",
        formula: "P=gs kBT λT^{-3}g_{5/2}(z);  U=∫εD(ε)nB dε=(3/2)PV;  gs=1 gives the stated result",
        explanation:
          "多一个 ε 使 Bose-function index 从 3/2 提到 5/2；quadratic virial relation 给 U=3PV/2。",
      },
    ],
    conclusion: "n=n0+λT^{-3}g3/2(z);  P=kBTλT^{-3}g5/2(z);  U=3PV/2",
    checks: [
      "z≪1 时 gν(z)≈z，消去 z 必须恢复 P≈nkBT。",
      "半整数 Bose function 用 Γ(ν)，不能机械写普通 factorial。",
      "若 DOS 已含 gs，就不能再在 occupation 中重复乘；结论无 gs 是因为明确采用 gs=1。",
    ],
    evidence: ["课件 9 slides 2–5"],
  },

  [conceptFormulaKey("bose-gas", "BEC：不是粒子突然没有能量，而是激发态装满")]: {
    id: "bose-bec-critical-temperature-condensate",
    title: "excited-state saturation 推出 Tc 与 condensate fraction",
    kind: "推导结果",
    origin:
      "固定总粒子数时，fugacity 最多升到 z=1。三维 quadratic DOS 使 excited-state density 在 z=1 仍有限，多出的粒子只能进入单独保留的 ground state。",
    symbols: [
      { symbol: "Tc", meaning: "BEC critical temperature" },
      { symbol: "N0", meaning: "ground-state occupation" },
      { symbol: "ζ(3/2)", meaning: "g3/2(1)" },
      { symbol: "n", meaning: "固定总 number density" },
      { symbol: "gs", meaning: "等价 internal-state degeneracy；显示结论取 gs=1" },
    ],
    prerequisites: ["Bose number equation", "thermal wavelength", "fugacity bound z≤1"],
    assumptions: ["homogeneous ideal 3D gas", "quadratic dispersion", "particle number conserved", "thermodynamic limit", "结论使用 single-component gas gs=1；若有 gs 个等价组分且共同 chemical potential，excited-state capacity 乘 gs"],
    steps: [
      {
        title: "求 excited states 的最大容量",
        formula: "ne,max(T)=gs λT^{-3}g_{3/2}(1)=gs λT^{-3}ζ(3/2)",
        explanation:
          "ground energy 取 0 时 μ≤0，所以 z≤1；z=1 给最大 excited density。",
      },
      {
        title: "在 transition 定义 Tc",
        formula: "n=gs ζ(3/2)/λTc³=gs ζ(3/2)[mkBTc/(2πℏ²)]^{3/2}",
        explanation:
          "刚发生凝聚时 N0 还可视为 0，所有粒子恰好装进 excited states。",
      },
      {
        title: "解出 critical temperature",
        formula: "Tc(general)=[2πℏ²/(mkB)][n/(gsζ(3/2))]^{2/3};  gs=1 gives the stated Tc",
        explanation:
          "指数 2/3 直接来自三维 quadratic DOS 与 λT^{-3}∝T^{3/2}。显示结论省略 gs 不是漏因子，而是明确采用老师题目的 spinless convention。",
      },
      {
        title: "计算 Tc 以下的 ground-state fraction",
        formula: "Ne/N=(T/Tc)^{3/2}  ⇒  N0/N=1-(T/Tc)^{3/2}",
        explanation:
          "Tc 以下 z 固定在 1，excited number 只按 T^{3/2} 变化。",
      },
    ],
    conclusion: "Tc=[2πℏ²/(mkB)] [n/ζ(3/2)]^{2/3};  N0/N=1−(T/Tc)^{3/2}",
    checks: [
      "T=Tc 时 N0/N=0，T=0 时 N0/N=1。",
      "这条 3/2 次幂不能照搬到 harmonic trap、二维或 linear dispersion。",
      "改变 internal degeneracy 会把 Tc 改为 gs^{-2/3}Tc(gs=1)；若不声明 gs，数值会差一个幂因子。",
    ],
    evidence: ["课件 9 slides 6–11"],
  },

  [conceptFormulaKey("bose-gas", "热容与 statistical attraction")]: {
    id: "bose-below-tc-heat-capacity-scaling",
    title: "三维 homogeneous Bose gas 在 Tc 以下的热容",
    kind: "推导结果",
    origin:
      "Tc 以下 z=1，pressure 的 Bose function 成为常数，而 λT^{-3}∝T^{3/2}；因此 U∝T^{5/2}，再对 T 求导得到 CV∝T^{3/2}。",
    symbols: [
      { symbol: "CV", meaning: "constant-volume heat capacity" },
      { symbol: "Tc", meaning: "BEC critical temperature" },
      { symbol: "ζ(5/2)", meaning: "g5/2(1)" },
    ],
    prerequisites: ["Bose pressure formula", "U=3PV/2", "Tc number equation"],
    assumptions: ["ideal homogeneous 3D quadratic Bose gas", "single-component convention gs=1", "T<Tc，因此 z=1", "固定 N、V"],
    steps: [
      {
        title: "固定 z=1 写 pressure",
        formula: "P=kBT λT^{-3}ζ(5/2) ∝ T·T^{3/2}=T^{5/2}",
        explanation:
          "λT∝T^{-1/2}，所以 λT^{-3}∝T^{3/2}。",
      },
      {
        title: "把 energy 写成 T/Tc",
        formula: "U=(3/2)PV=(3/2)NkBT [ζ(5/2)/ζ(3/2)](T/Tc)^{3/2}",
        explanation:
          "使用 N=Vζ(3/2)/λTc³ 消掉体积与 mass-dependent prefactor。",
      },
      {
        title: "在固定 N、V 下求导",
        formula: "CV=(∂U/∂T)V,N=(15/4)NkB[ζ(5/2)/ζ(3/2)](T/Tc)^{3/2}",
        explanation:
          "因此核心 scaling 是 CV∝T^{3/2}；Tc^- 的系数约为 1.925NkB。",
      },
    ],
    conclusion: "T<Tc: CV ∝ T^{3/2} (3D quadratic ideal Bose gas)",
    checks: [
      "T→0 时 CV→0，符合第三定律趋势。",
      "linear-dispersion boson 的 DOS 不同，会得到 CV∝T³ 而非 T^{3/2}。",
    ],
    evidence: ["课件 9 slides 8–10"],
  },

  [conceptFormulaKey("bose-gas", "photon gas：粒子数不守恒所以 μ=0")]: {
    id: "bose-photon-planck-stefan-pressure",
    title: "从 photon DOS 与 Bose occupation 到 Planck spectrum",
    kind: "推导结果",
    origin:
      "腔内 photon number 不守恒，所以 μ=0。把两种 polarization 的 linear-dispersion DOS 乘以每 mode 能量与 Bose occupation，得到 Planck energy density；积分后得到 T⁴ law。",
    symbols: [
      { symbol: "u(ω)", meaning: "单位体积、单位角频率的 photon energy density" },
      { symbol: "c", meaning: "光速" },
      { symbol: "a", meaning: "radiation energy-density constant π²kB⁴/(15ℏ³c³)" },
      { symbol: "μ", meaning: "photon chemical potential；平衡时为 0" },
    ],
    prerequisites: ["linear-dispersion DOS", "Bose occupation", "Gamma-zeta integral"],
    assumptions: ["黑体腔热平衡", "photon number 可由腔壁产生/吸收", "两种 transverse polarizations"],
    steps: [
      {
        title: "求每体积每频率的 mode density",
        formula: "D(ω)/V=2·4πk²/(2π)³·dk/dω=ω²/(π²c³)",
        explanation:
          "使用 ω=ck 与两种 polarization；漏掉 2 会使结果减半。",
      },
      {
        title: "乘每 mode energy 与 occupation",
        formula: "u(ω)=D(ω)ℏω/[V(e^{βℏω}-1)]=ℏω³/[π²c³(e^{βℏω}-1)]",
        explanation:
          "μ=0，所以 denominator 中没有 fugacity。",
      },
      {
        title: "积分全部频率",
        formula: "U/V=∫0∞u(ω)dω=(kBT)^4/[π²ℏ³c³]·Γ(4)ζ(4)=aT⁴",
        explanation:
          "Γ(4)ζ(4)=π⁴/15，因此 a=π²kB⁴/(15ℏ³c³)。",
      },
      {
        title: "使用 massless isotropic gas 的 virial relation",
        formula: "P=U/(3V)",
        explanation:
          "linear dispersion ε=pc 在三维给 traceless radiation stress 与 P=u/3。",
      },
    ],
    conclusion: "u(ω)=ℏω³/[π²c³(e^{βℏω}−1)];  U/V=aT⁴;  P=U/(3V)",
    checks: [
      "u(ω)dω 的单位应为 energy/volume。",
      "低频恢复 Rayleigh–Jeans u(ω)≈kBTω²/(π²c³)，高频指数衰减。",
    ],
    evidence: ["课件 9 slide 14"],
  },

  [conceptFormulaKey("bose-gas", "phonon 与 Debye T³")]: {
    id: "bose-debye-low-high-temperature-heat-capacity",
    title: "Debye cutoff、低温 T³ 与高温 Dulong–Petit",
    kind: "模型",
    origin:
      "Debye model 用三条 isotropic linear acoustic branches 近似低能 phonons，并选择 cutoff 使总 mode 数恰为 3N。对 Bose energy integral 取低温或高温极限得到两条热容规律。",
    symbols: [
      { symbol: "ωD", meaning: "Debye cutoff frequency" },
      { symbol: "TD", meaning: "Debye temperature ℏωD/kB" },
      { symbol: "N", meaning: "晶体原子数" },
      { symbol: "CV", meaning: "phonon constant-volume heat capacity" },
      { symbol: "cL, cT", meaning: "longitudinal 与 transverse acoustic sound speeds" },
      { symbol: "cD", meaning: "Debye effective sound speed，定义为 3/cD³=1/cL³+2/cT³" },
    ],
    prerequisites: ["linear-dispersion DOS", "Bose occupation with μ=0", "Gamma-zeta integral"],
    assumptions: ["三维各向同性或已作角平均的固体", "一个 longitudinal 与两个 transverse acoustic branches 在低频近似 ωs(k)=cs k", "Debye continuum approximation 用 effective cD 合并不同 branch velocities", "忽略 optical branches 的低温贡献"],
    steps: [
      {
        title: "先把三条声学 branch 的不同速度合并",
        formula: "g(ω)/V=ω²/(2π²)(1/cL³+2/cT³)=3ω²/(2π²cD³);  3/cD³=1/cL³+2/cT³",
        explanation:
          "每条 linear branch 都给 ω²/(2π²cs³)。真实晶体通常 cL≠cT；课件写单一声速时，应理解为这个按 inverse-cube 加权的 Debye effective speed，而非三条 branch 真有相同速度。",
      },
      {
        title: "用 mode count 固定 DOS",
        formula: "∫0^ωD g(ω)dω=3N  ⇒  g(ω)=9Nω²/ωD³;  kD=(6π²N/V)^{1/3},  ωD=cDkD",
        explanation:
          "ω² 来自三维 linear dispersion；normalization 把三条 acoustic branches 合并，并用一个保留总 mode 数的 cutoff 替代真实 Brillouin zone。",
      },
      {
        title: "写 phonon thermal energy",
        formula: "U=∫0^ωD dω g(ω)ℏω/[e^{βℏω}-1]",
        explanation:
          "zero-point energy 不随 T 变，不影响 CV，故这里只保留 thermal part。",
      },
      {
        title: "取低温极限",
        formula: "T≪TD:  U=9NkBT(T/TD)^3∫0∞x³/(e^x-1)dx=3π⁴NkBT⁴/(5TD³)",
        explanation:
          "上限 TD/T 很大，可延到 ∞；积分为 π⁴/15。对 T 求导得到 12π⁴/5 coefficient。",
      },
      {
        title: "取高温极限",
        formula: "T≫TD:  ℏω/(e^{βℏω}-1)≈kBT  ⇒  U≈3NkBT",
        explanation:
          "每个 normal mode 回到 classical equipartition，因此 CV→3NkB。",
      },
    ],
    conclusion: "low T Debye: CV=(12π⁴/5)NkB(T/TD)³;  high T: CV→3NkB",
    checks: [
      "低温 CV 必须随 T³ 消失，高温必须趋 3NkB。",
      "Debye T³ 只依赖低频 acoustic modes，不能用来描述所有温度的真实 dispersion。",
      "若直接用某一条 cL 或 cT 代替 cD，低温 T³ coefficient 会因速度的三次方而系统性偏差。",
    ],
    evidence: ["课件 9 slides 15–18"],
  },

  [conceptFormulaKey("fermi-gas", "T=0 的填海规则")]: {
    id: "fermi-zero-temperature-step",
    title: "Fermi–Dirac distribution 的零温阶跃极限",
    kind: "推导结果",
    origin:
      "从 Fermi–Dirac occupation 对 β→∞ 取极限。chemical potential 在零温趋向 Fermi energy，因此 εF 以下的 substates 填满，以上为空。",
    symbols: [
      { symbol: "n̄(ε,T)", meaning: "单个 fermionic substate 的平均 occupation" },
      { symbol: "εF", meaning: "T=0 chemical potential / Fermi energy" },
      { symbol: "Θ", meaning: "Heaviside step function" },
    ],
    prerequisites: ["Fermi–Dirac distribution", "exponential limits", "Pauli exclusion"],
    assumptions: ["ideal Fermi gas", "每个 substate 最多一个 fermion", "固定 particle number 后 T→0"],
    steps: [
      {
        title: "从 finite-temperature occupation 出发",
        formula: "n̄(ε,T)=1/[e^{β(ε-μ)}+1]",
        explanation:
          "这里是单 substate occupation；spin degeneracy 应放入 DOS，而不是让 occupation 高于 1。",
      },
      {
        title: "分别考察 μ 两侧",
        formula: "ε<μ: e^{β(ε-μ)}→0 ⇒ n̄→1;  ε>μ: e^{β(ε-μ)}→∞ ⇒ n̄→0",
        explanation:
          "β→∞ 时只有 ε=μ 的单点保持 1/2；它不影响 continuum integral。",
      },
      {
        title: "识别 zero-temperature chemical potential",
        formula: "μ(T→0)=εF  ⇒  n̄(ε,0)=Θ(εF-ε)",
        explanation:
          "固定 N 决定阶跃终点 εF。",
      },
    ],
    conclusion: "n̄(ε,T=0)=Θ(εF−ε)",
    checks: [
      "occupation 必须始终位于 0 与 1 之间。",
      "把 step 与 DOS 积分后应恰好给固定 N。",
    ],
    evidence: ["课件 9 slide 23"],
  },

  [conceptFormulaKey("fermi-gas", "三维 Fermi 尺度与基态热力学")]: {
    id: "fermi-3d-zero-temperature-scales",
    title: "三维 Fermi sphere 的 kF、εF、E0 与 P0",
    kind: "推导结果",
    origin:
      "在 T=0 填满 |k|≤kF 的全部 substates。先数 k-space sphere 中的 states 固定 kF，再对 quadratic energy 积分得到 ground-state energy，最后由 volume derivative 或 virial relation 得 pressure。",
    symbols: [
      { symbol: "gs", meaning: "spin degeneracy；电子通常为 2" },
      { symbol: "n", meaning: "number density N/V" },
      { symbol: "kF", meaning: "Fermi wave vector" },
      { symbol: "εF", meaning: "ℏ²kF²/(2m)" },
      { symbol: "P0", meaning: "zero-temperature degeneracy pressure" },
      { symbol: "C_D", meaning: "3D DOS coefficient gsV(2m/ℏ²)^{3/2}/(4π²)，使 D(ε)=C_D√ε" },
    ],
    prerequisites: ["k-space state counting", "3D quadratic DOS", "power-law integrals"],
    assumptions: ["ideal homogeneous 3D Fermi gas", "quadratic dispersion", "T=0"],
    steps: [
      {
        title: "数 Fermi sphere 中的 states",
        formula: "N=gs V/(2π)³·(4π/3)kF³=gsVkF³/(6π²)",
        explanation:
          "gs 已计入 spin；不要在 occupation 中再重复乘一次。",
      },
      {
        title: "解 kF 与 εF",
        formula: "kF=(6π²n/gs)^{1/3};  εF=ℏ²kF²/(2m)",
        explanation:
          "因此 kF∝n^{1/3}、εF∝n^{2/3}。",
      },
      {
        title: "从 k-shell 明确写出 3D DOS",
        formula: "D(ε)=gsV/(2π²)k²(dk/dε)=gsV(2m/ℏ²)^{3/2}√ε/(4π²)=C_D√ε",
        explanation:
          "ε=ℏ²k²/(2m) 给 dk/dε=m/(ℏ²k)。这一步保留全部系数，也能直接核对 spin degeneracy 只出现一次。",
      },
      {
        title: "分别做 number 与 energy 的幂积分",
        formula: "N=∫0^εF C_Dε^{1/2}dε=(2C_D/3)εF^{3/2};  E0=∫0^εF C_Dε^{3/2}dε=(2C_D/5)εF^{5/2}",
        explanation:
          "energy integral 比 number integral 多一个 ε；上下限相同，所以无需再猜比例常数。",
      },
      {
        title: "把两个积分相除",
        formula: "E0/N=[(2C_D/5)εF^{5/2}]/[(2C_D/3)εF^{3/2}]=3εF/5",
        explanation:
          "C_D 与 εF^{3/2} 完全约掉，3/5 来自两个幂积分的系数比。",
      },
      {
        title: "由尺度关系求 pressure",
        formula: "E0=(3/5)NεF∝N^{5/3}V^{-2/3};  P0=-(∂E0/∂V)N=2E0/(3V)=2nεF/5",
        explanation:
          "quadratic dispersion 在三维满足 P=2E/(3V)，即使 T=0 仍有 degeneracy pressure。",
      },
    ],
    conclusion: "kF=(6π²n/gs)^(1/3),  εF=ℏ²kF²/(2m),  E0/N=3εF/5,  P0=2nεF/5",
    checks: [
      "E0/N 必须小于最高 occupied energy εF。",
      "P0 的 density scaling 应为 n^{5/3}。",
    ],
    evidence: ["课件 9 slides 23–24"],
  },

  [conceptFormulaKey("fermi-gas", "有限温度：只有 Fermi 面附近在变化")]: {
    id: "fermi-sommerfeld-heat-capacity",
    title: "Sommerfeld expansion 与三维低温 Fermi 热容",
    kind: "近似",
    origin:
      "把 Fermi function 与 T=0 step 的差限制在 μ 附近宽度约 kBT 的薄层，对 smooth weight φ(ε) 作 Taylor expansion；固定 N 时先解 μ(T)，再计算 U(T)。",
    symbols: [
      { symbol: "φ(ε)", meaning: "与具体 observable 和 DOS 组成的 smooth weight" },
      { symbol: "fFD", meaning: "Fermi–Dirac distribution" },
      { symbol: "TF", meaning: "Fermi temperature εF/kB" },
      { symbol: "CV", meaning: "fixed-N constant-volume heat capacity" },
      { symbol: "t", meaning: "dimensionless low-temperature parameter T/TF=kBT/εF" },
      { symbol: "C_D", meaning: "3D DOS coefficient，D(ε)=C_D√ε" },
      { symbol: "a", meaning: "求 μ(T) 时临时引入的 dimensionless T² expansion coefficient" },
    ],
    prerequisites: ["Fermi function", "Taylor expansion", "integration by parts", "3D DOS"],
    assumptions: ["kBT≪μ≈εF", "φ 在 μ 附近平滑", "固定 N", "3D quadratic ideal gas for the stated CV coefficient"],
    steps: [
      {
        title: "写通用 Sommerfeld expansion",
        formula: "∫0∞φ(ε)fFD dε=∫0^μ φ(ε)dε+(π²/6)(kBT)²φ′(μ)+(7π⁴/360)(kBT)⁴[d³φ/dε³]_{ε=μ}+…",
        explanation:
          "首个修正来自 Fermi surface 附近；odd/even symmetry 消去 linear-T term。显示结论中的 O(T⁴) 是固定能标后的简写，维数完整的下一项是 (kBT)⁴ 乘 φ 的三阶能量导数。",
      },
      {
        title: "对 number integral 展开到 T²",
        formula: "N=(2C_D/3)μ^{3/2}+(π²C_D/12)(kBT)²μ^{-1/2}+…=(2C_D/3)μ^{3/2}[1+(π²/8)(kBT/μ)²+…]",
        explanation:
          "这里 φ=D=C_D√ε，所以 φ′=C_D/(2√ε)。左侧 N 固定且等于 (2C_D/3)εF^{3/2}。",
      },
      {
        title: "逐项解 fixed-N chemical potential",
        formula: "μ=εF(1+at²);  1=(μ/εF)^{3/2}[1+(π²/8)(kBT/μ)²+…]  ⇒  a=-π²/12",
        explanation:
          "展开 (1+at²)^{3/2}=1+(3a/2)t²，再令 T² coefficient 为零，得到 μ(T)=εF[1−(π²/12)t²+O(t⁴)]。",
      },
      {
        title: "对 energy integral 展开并代回 μ(T)",
        formula: "U=(2C_D/5)μ^{5/2}+(π²C_D/4)(kBT)²μ^{1/2}+…  ⇒  U/N=(3εF/5)[1+(5π²/12)t²+O(t⁴)]",
        explanation:
          "这次 φ=εD=C_Dε^{3/2}，故 φ′=(3C_D/2)√ε。μ shift 贡献 −5π²t²/24，显式 energy correction 贡献 +5π²t²/8，合计 +5π²t²/12。",
      },
      {
        title: "对 T 求导",
        formula: "CV/(NkB)=(π²/2)t+O(t³),  t=T/TF",
        explanation:
          "能量修正∝T²，所以低温 heat capacity 线性于 T。把余项写成 dimensionless t³，避免把有单位的 CV 与裸 O(T³) 相加。",
      },
    ],
    conclusion: "∫₀∞φ(ε)fFD dε ≈ ∫₀^μ φ(ε)dε + (π²/6)(kBT)²φ′(μ);  CV=(π²/2)NkB(T/TF)",
    checks: [
      "T→0 时 CV→0。",
      "当 T 与 TF 同量级时 Sommerfeld expansion 不再可靠。",
      "固定 N 时必须先解 μ(T)；若直接全程令 μ=εF，会得到错误的 U(T) coefficient。",
    ],
    evidence: ["课件 9 slides 25–30"],
  },

  [conceptFormulaKey("fermi-gas", "二维 Fermi 气体与作业 3 Q4")]: {
    id: "fermi-2d-density-of-states-and-virial",
    title: "二维 constant DOS、Fermi energy 与 PA=U",
    kind: "推导结果",
    origin:
      "二维 k-space 中 occupied region 是圆盘。quadratic dispersion 的 k shell 与 dk/dε 恰好抵消，使 DOS 为常数；同一 scale invariance 给二维 virial relation PA=U。",
    symbols: [
      { symbol: "A", meaning: "二维系统面积" },
      { symbol: "n", meaning: "surface number density N/A" },
      { symbol: "D2D(ε)", meaning: "二维每单位能量的单粒子态数" },
      { symbol: "gs", meaning: "spin degeneracy" },
      { symbol: "D0", meaning: "constant DOS per area gs m/(2πℏ²)" },
      { symbol: "z", meaning: "fugacity e^{βμ}" },
      { symbol: "Ω", meaning: "grand potential −kBT lnΞ；作业答案记作 G" },
      { symbol: "δ", meaning: "相对 chemical potential 的正 energy offset" },
      { symbol: "f2(z)", meaning: "Fermi integral ∫0∞x dx/(z^{-1}e^x+1)" },
    ],
    prerequisites: ["二维 k-space state counting", "quadratic dispersion", "constant-DOS integrals"],
    assumptions: ["ideal homogeneous 2D Fermi gas", "ε=ℏ²k²/(2m)", "固定 N、A 时讨论 μ(T) 与 CV", "边界效应忽略"],
    steps: [
      {
        title: "数二维 k-space 圆盘",
        formula: "N=gs A/(2π)²·πkF²=gsAkF²/(4π)",
        explanation:
          "二维不是球体积 4πk³/3，而是圆盘面积 πk²。",
      },
      {
        title: "换成能量并求 constant DOS",
        formula: "D2D(ε)/A=gs/(2π)·k dk/dε=gs m/(2πℏ²)≡D0",
        explanation:
          "ε=ℏ²k²/(2m) 给 kdk/dε=m/ℏ²，因此能量依赖完全消失。",
      },
      {
        title: "由 N 解 Fermi energy",
        formula: "n=D0εF=gs kF²/(4π)  ⇒  εF=n/D0=ℏ²kF²/(2m)=2πℏ²n/(gs m)",
        explanation:
          "若结果差 2，先检查 gs 是否已包含 spin。",
      },
      {
        title: "精确积分 number equation",
        formula: "n=D0∫0∞dε/[z^{-1}e^{βε}+1]=D0kBT ln(1+z)=D0kBT ln(1+e^{βμ})",
        explanation:
          "令 x=β(ε−μ) 或直接对 ln(1+ze^{-βε}) 求导即可。因为 D0 是常数，这个积分不需要 Sommerfeld approximation。",
      },
      {
        title: "在固定 n 下精确解 μ(T)",
        formula: "βεF=ln(1+e^{βμ})  ⇒  μ=kBT ln(e^{βεF}-1)=εF+kBT ln(1-e^{-βεF})",
        explanation:
          "所以 T≪TF 时 μ−εF≈−kBT e^{-TF/T}，是指数小而不是三维常见的 T² shift。",
      },
      {
        title: "从 grand potential 逐步得到 pressure",
        formula: "Ω=-kBT AD0∫0∞dε ln(1+ze^{-βε})=-AD0(kBT)²f2(z);  PA=-Ω=AD0(kBT)²f2(z)",
        explanation:
          "这里 f2(z) 可定义为 ∫0∞x dx/(z^{-1}e^x+1)。作业答案把 grand potential 记为 G；避免与 Gibbs free energy 混淆，这里用 Ω。",
      },
      {
        title: "对 energy integral 作同一变量替换",
        formula: "U=AD0∫0∞ε dε/[z^{-1}e^{βε}+1]=AD0(kBT)²f2(z)=PA",
        explanation:
          "与 −Ω 恰好相同，因此二维 quadratic virial relation PA=U 不是额外背诵结论，而是两个明确积分的结果。",
      },
      {
        title: "取低温展开并求 heat capacity",
        formula: "U/N=εF/2+(π²/6)(kBT)²/εF+exponentially small terms;  CV=(π²/3)NkB(kBT/εF)+…",
        explanation:
          "constant DOS 使 fixed-N μ shift 只有指数小；对 φ(ε)=D0ε 的 Sommerfeld T² 项直接求导，就得到与三维同为 linear-T、但 coefficient 不同的 CV。",
      },
      {
        title: "完成作业的 particle–hole probability 检查",
        formula: "Pocc(μ+δ)=1/(e^{βδ}+1);  Phole(μ-δ)=1-fFD(μ-δ)=1/(e^{βδ}+1)",
        explanation:
          "Fermi function 满足 1−f(μ−δ)=f(μ+δ)，因此 chemical potential 两侧等距的 particle 与 hole excitation 概率相同。",
      },
    ],
    conclusion: "D2D(ε)/A=gs m/(2πℏ²),  εF=2πℏ²n/(gs m),  PA=U",
    checks: [
      "D2D/A 的单位应为 1/(area·energy)。",
      "T=0 时 constant DOS 给 U/N=εF/2。",
      "μ(T) 的低温 correction 应是 exponential；若得到 −π²(kBT)²/(12εF)，说明误套了三维 DOS。",
      "Pocc(μ+δ) 与 Phole(μ−δ) 必须相等，这是 f(μ+δ)+f(μ−δ)=1 的直接自检。",
    ],
    evidence: ["作业 3 Q4(a–e)", "作业 3 答案 pp. 15–19（2D DOS、exact μ、grand potential、PA=U、CV 与 particle–hole probabilities）"],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "JIT：Sommerfeld 展开为什么只看 Fermi 面",
    "fFD(x)−Θ(−x) 只在 |x|≈1 有贡献",
  )]: {
    id: "fermi-sommerfeld-localization-near-surface",
    title: "Fermi function 与 step 的差为何局域在 Fermi 面",
    kind: "近似",
    origin:
      "令 x=(ε−μ)/(kBT)。Fermi function 与 zero-temperature step 在 |x| 很大时指数接近，因此 finite-temperature correction 只来自 |ε−μ| 约为 kBT 的窄窗。",
    symbols: [
      { symbol: "x", meaning: "dimensionless energy distance (ε−μ)/(kBT)" },
      { symbol: "fFD(x)", meaning: "1/(e^x+1)" },
      { symbol: "Θ(-x)", meaning: "T=0 occupied-state step" },
    ],
    prerequisites: ["Fermi–Dirac function", "Heaviside step", "exponential asymptotics"],
    assumptions: ["low temperature so the physical energy window kBT is narrow", "weight function varies slowly across that window"],
    steps: [
      {
        title: "考察 Fermi 面下方",
        formula: "x≪-1:  fFD(x)=1/(e^x+1)≈1-e^x;  Θ(-x)=1",
        explanation:
          "两者差约为 -e^x，随 |x| 指数消失。",
      },
      {
        title: "考察 Fermi 面上方",
        formula: "x≫1:  fFD(x)≈e^{-x};  Θ(-x)=0",
        explanation:
          "两者差约为 e^{-x}，同样指数消失。",
      },
      {
        title: "锁定 correction window",
        formula: "fFD(x)-Θ(-x)≠0 appreciably only for |x|=O(1)",
        explanation:
          "换回能量即 |ε−μ|=O(kBT)，所以低温修正只看 Fermi surface 附近。",
      },
    ],
    conclusion: "fFD(x)−Θ(−x) 只在 |x|≈1 有贡献",
    checks: [
      "x=±10 时差应已指数小。",
      "温度越低，同一 |x| window 对应的实际 energy width 越窄。",
    ],
    evidence: ["课件 9 slides 25–26"],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "JIT：Sommerfeld 展开为什么只看 Fermi 面",
    "I=∫₀^μ φ(ε)dε+(π²/6)(kBT)²φ′(μ)+O(T⁴)",
  )]: {
    id: "fermi-sommerfeld-general-expansion",
    title: "Sommerfeld expansion 的前两项",
    kind: "近似",
    origin:
      "把 finite-T integral 减去 T=0 step integral，再围绕 ε=μ Taylor-expand smooth φ；correction kernel 的奇偶性消掉常数项并留下 φ′(μ) 的 π²/6 moment。",
    symbols: [
      { symbol: "I", meaning: "∫0∞φ(ε)fFD(ε)dε" },
      { symbol: "φ(ε)", meaning: "在 μ 附近平滑的 weight function" },
      { symbol: "O(T⁴)", meaning: "课件式的简写；维数完整的下一项含 (kBT)⁴ 乘 φ 的三阶能量导数，或除以固定能标后写 O((T/T0)⁴)" },
    ],
    prerequisites: ["Taylor expansion", "Fermi-surface localization", "integration by parts"],
    assumptions: ["kBT≪μ", "φ 在 μ 附近至少足够多次可微", "积分下限离 μ 很远，可忽略 exponentially small boundary correction"],
    steps: [
      {
        title: "加减 zero-temperature integral",
        formula: "I=∫0^μ φ(ε)dε+∫0∞φ(ε)[fFD(ε)-Θ(μ-ε)]dε",
        explanation:
          "第一项是完整 Fermi sea；第二项只在 μ 附近非零。",
      },
      {
        title: "换成 Fermi-surface variable",
        formula: "ε=μ+kBTx;  φ(μ+kBTx)=φ(μ)+kBTxφ′(μ)+…",
        explanation:
          "低温让实际 energy window 小，因此可 Taylor-expand φ。",
      },
      {
        title: "使用 correction kernel 的 moments",
        formula: "∫dx[fFD(x)-Θ(-x)]=0;  ∫dx x[fFD(x)-Θ(-x)]=π²/6",
        explanation:
          "第一个 moment 为零，所以没有 O(T) 项；第二个给 O(T²) coefficient。",
      },
      {
        title: "收集到 T² 阶",
        formula: "I=∫0^μ φ(ε)dε+(π²/6)(kBT)²φ′(μ)+(7π⁴/360)(kBT)⁴[d³φ/dε³]_{ε=μ}+…",
        explanation:
          "更高非零 corrections 继续只含 even powers of T。结论保留课程原来的 O(T⁴) 记法，但实际使用时必须带上 kB 与 φ 的相应导数，不能把有单位量直接与裸 T⁴ 相加。",
      },
    ],
    conclusion: "I=∫₀^μ φ(ε)dε+(π²/6)(kBT)²φ′(μ)+O(T⁴)",
    checks: [
      "φ 为常数时 φ′=0，constant-DOS number integral 没有普通 T² correction。",
      "若 φ 在 μ 附近有 singularity，就不能直接使用该展开。",
      "每一项量纲必须与 I 相同：(kBT)²φ′ 与 (kBT)⁴ 乘 φ 的三阶能量导数都满足这一点。",
    ],
    evidence: ["课件 9 slides 25–27"],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "金属电子低温热容：怎样从实验图上分开电子与声子",
    "Ce=(π²/2)NkB(kBT/εF)=γT",
  )]: {
    id: "fermi-metal-electronic-linear-heat-capacity",
    title: "低温 electron heat capacity 的线性项",
    kind: "近似",
    origin:
      "三维 degenerate Fermi gas 的 Sommerfeld expansion 给 U−U0∝T²；对温度求导即得 Ce∝T，并把 coefficient 定义为 γ。",
    symbols: [
      { symbol: "Ce", meaning: "conduction-electron heat capacity" },
      { symbol: "γ", meaning: "Sommerfeld coefficient" },
      { symbol: "εF", meaning: "Fermi energy" },
    ],
    prerequisites: ["三维 Fermi gas Sommerfeld result", "CV=∂U/∂T"],
    assumptions: ["T≪TF", "free-electron-like quadratic band；真实材料可用 effective mass 修正"],
    steps: [
      {
        title: "取 low-T energy correction",
        formula: "(U-U0)/(NεF)=(π²/4)(kBT/εF)²+O[(kBT/εF)⁴]",
        explanation:
          "等价地 U−U0=(π²/4)N(kBT)²/εF+…；用 dimensionless ratio 写余项可避免量纲不清。只有 Fermi surface 附近比例约 T/TF 的 electrons 可被热激发。",
      },
      {
        title: "对温度求导",
        formula: "Ce=(∂U/∂T)V,N=(π²/2)NkB(kBT/εF)",
        explanation:
          "energy 的 T² correction 变成 heat capacity 的 T-linear term。",
      },
      {
        title: "定义实验系数",
        formula: "γ=(π²/2)NkB²/εF  ⇒  Ce=γT",
        explanation:
          "按 sample 或 mole 报告 γ 时，N 的含义要与单位一致。",
      },
    ],
    conclusion: "Ce=(π²/2)NkB(kBT/εF)=γT",
    checks: [
      "T→0 时 Ce→0。",
      "γ 的单位应为 heat-capacity/temperature。",
    ],
    evidence: ["课件 9 slides 29–31"],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "金属电子低温热容：怎样从实验图上分开电子与声子",
    "Ctotal=γT+δT³;  Ctotal/T=γ+δT²",
  )]: {
    id: "fermi-metal-separate-electron-phonon-heat-capacity",
    title: "用 C/T 对 T² 作图区分 electron 与 phonon",
    kind: "模型",
    origin:
      "足够低温时，degenerate electrons 给 γT，Debye acoustic phonons 给 δT³。两种近似贡献相加后除以 T，可线性化为容易拟合的实验关系。",
    symbols: [
      { symbol: "Ctotal", meaning: "measured total heat capacity" },
      { symbol: "γ", meaning: "electronic Sommerfeld coefficient" },
      { symbol: "δ", meaning: "phonon T³ coefficient" },
    ],
    prerequisites: ["electron Ce∝T", "Debye phonon Cph∝T³", "直线拟合"],
    assumptions: ["温度足够低", "electron 与 phonon contributions 可近似相加", "其他 excitations 可忽略"],
    steps: [
      {
        title: "相加两种 leading contributions",
        formula: "Ctotal=Ce+Cph=γT+δT³",
        explanation:
          "γ 与 δ 分别吸收材料参数和单位换算。",
      },
      {
        title: "两边除以 T",
        formula: "Ctotal/T=γ+δT²",
        explanation:
          "令 y=C/T、x=T²，就得到 y-intercept 为 γ、slope 为 δ 的直线。",
      },
    ],
    conclusion: "Ctotal=γT+δT³;  Ctotal/T=γ+δT²",
    checks: [
      "C/T 对 T² 图若不近直线，说明温区过高或还有其他 excitations。",
      "纵截距对应 electron term，斜率对应 phonon term，不能互换。",
    ],
    evidence: ["课件 9 slide 31"],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "Pauli 顺磁：磁场移动两种自旋的 Fermi 面",
    "ε_{p,±}=p²/(2m)∓μ*B;  Mtot=μ*(N_+−N_-);  Mmag=Mtot/V",
  )]: {
    id: "fermi-pauli-zeeman-population-magnetization",
    title: "Zeeman splitting 如何变成人口差与磁化",
    kind: "模型",
    origin:
      "弱磁场把两种 spin orientation 的单粒子能量反向平移。Pauli exclusion 使两套 Fermi seas 的边界略微不同，人口差乘单粒子磁矩就给总磁矩。",
    symbols: [
      { symbol: "μ*", meaning: "单粒子 effective magnetic moment；不是 chemical potential" },
      { symbol: "B", meaning: "外加 magnetic field（课件 convention）" },
      { symbol: "N±", meaning: "两种 spin orientation 的粒子数" },
      { symbol: "Mmag", meaning: "magnetization density" },
    ],
    prerequisites: ["Zeeman energy", "Fermi sea", "magnetic moment addition"],
    assumptions: ["weak uniform field", "ideal 3D electron gas", "orbital response ignored", "课件采用对 B 求响应的 convention"],
    steps: [
      {
        title: "加入 Zeeman energy",
        formula: "ε_{p,+}=p²/(2m)-μ*B;  ε_{p,-}=p²/(2m)+μ*B",
        explanation:
          "平行于场的 orientation 能量降低，反平行方向升高；标签正负取决于约定，但能级差为 2μ*B。",
      },
      {
        title: "把每个 particle moment 相加",
        formula: "Mtot=(+μ*)N_++(-μ*)N_-=μ*(N_+-N_-)",
        explanation:
          "完全相等的人口给零 net moment；弱场只产生小人口差。",
      },
      {
        title: "除以体积得到 magnetization",
        formula: "Mmag=Mtot/V",
        explanation:
          "若改用 SI susceptibility ∂M/∂H，还需处理 B、H 与 μ0；课件这里按 B convention。",
      },
    ],
    conclusion: "ε_{p,±}=p²/(2m)∓μ*B;  Mtot=μ*(N_+−N_-);  Mmag=Mtot/V",
    checks: [
      "B=0 时 N+=N-，因此 Mmag=0。",
      "μ* 是 magnetic moment，不可与 chemical potential μ 混为一个量。",
    ],
    evidence: ["课件 9 slide 32"],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "Pauli 顺磁：磁场移动两种自旋的 Fermi 面",
    "χ0=(3/2)n(μ*)²/εF",
  )]: {
    id: "fermi-pauli-zero-temperature-susceptibility",
    title: "T=0 Pauli susceptibility",
    kind: "近似",
    origin:
      "弱场只改变 Fermi surface 附近的 occupations。用 Fermi energy 处的 DOS 把 ±μ*B 的能量位移换成人口差，再对 B 求 magnetization slope。",
    symbols: [
      { symbol: "χ0", meaning: "课件 convention 下 ∂Mmag/∂B at T=0" },
      { symbol: "n", meaning: "total electron number density" },
      { symbol: "D(εF)", meaning: "包含两种 spins 的 total DOS at Fermi energy" },
    ],
    prerequisites: ["3D Fermi DOS", "linear response", "Zeeman population split"],
    assumptions: ["T=0", "μ*B≪εF", "free-electron-like 3D quadratic band", "orbital diamagnetism ignored"],
    steps: [
      {
        title: "写 Fermi surface 的 total DOS",
        formula: "D(εF)/V=3n/(2εF)",
        explanation:
          "三维 quadratic DOS∝√ε，并用 N=∫0^εF D(ε)dε 得到该关系。",
      },
      {
        title: "把能级位移换成人口差",
        formula: "(N_+-N_-)/V=[D(εF)/V]μ*B=3nμ*B/(2εF)",
        explanation:
          "每个 spin sector 使用一半 total DOS，但两个方向相反移动，差值恢复一个 total DOS factor。",
      },
      {
        title: "求 magnetization 的线性 slope",
        formula: "Mmag=μ*(N_+-N_-)/V=[3n(μ*)²/(2εF)]B",
        explanation:
          "对 B 求导即得到 χ0；SI 对 H 的 susceptibility 还会带单位制因子。",
      },
    ],
    conclusion: "χ0=(3/2)n(μ*)²/εF",
    checks: [
      "χ0 为正，表示 paramagnetic response。",
      "只有比例约 μ*B/εF 的 Fermi-surface electrons 改变 occupation，而不是所有 electrons 遵从 Curie law。",
    ],
    evidence: ["课件 9 slide 32"],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "Pauli 顺磁：磁场移动两种自旋的 Fermi 面",
    "χ(T)≈χ0[1−(π²/12)(kBT/εF)²]",
  )]: {
    id: "fermi-pauli-low-temperature-susceptibility",
    title: "Pauli susceptibility 的低温修正",
    kind: "近似",
    origin:
      "finite temperature 把 Fermi surface 在宽度 kBT 内抹平。susceptibility 是 DOS 对 -∂f/∂ε 的 thermal average；对三维 D(ε)∝√ε 使用 Sommerfeld expansion，并同时保持 N 固定。",
    symbols: [
      { symbol: "χ(T)", meaning: "finite-temperature Pauli susceptibility" },
      { symbol: "χ0", meaning: "T=0 Pauli susceptibility" },
      { symbol: "εF", meaning: "zero-temperature Fermi energy" },
      { symbol: "t", meaning: "dimensionless temperature kBT/εF=T/TF" },
      { symbol: "C_D", meaning: "3D total DOS coefficient，D(ε)=C_D√ε" },
    ],
    prerequisites: ["Pauli χ0", "Sommerfeld expansion", "fixed-N chemical-potential correction"],
    assumptions: ["kBT≪εF", "weak magnetic field", "3D quadratic free-electron DOS", "fixed particle number"],
    steps: [
      {
        title: "把 response 写成 thermally averaged DOS",
        formula: "χ(T)=(μ*)²∫0∞D(ε)[-∂fFD/∂ε]dε/V",
        explanation:
          "-∂f/∂ε 是以 μ 为中心、宽度约 kBT 的 normalized peak。",
      },
      {
        title: "对 smooth DOS 作低温展开",
        formula: "∫D(ε)(-f′)dε=D(μ)+(π²/6)(kBT)²D″(μ)+O[(kBT)⁴D^{(4)}(μ)]",
        explanation:
          "这里是 Sommerfeld expansion 的 derivative-kernel 版本。",
      },
      {
        title: "先算 DOS curvature 的显式修正",
        formula: "D(ε)=C_D√ε;  D″(ε)=-D(ε)/(4ε²)  ⇒  Deff=D(μ)[1-(π²/24)(kBT/μ)²+O(t⁴)]",
        explanation:
          "derivative-kernel correction 单独贡献 −π²t²/24；这还不是最终 fixed-N coefficient，因为 D 的中心 μ 也随 T 移动。",
      },
      {
        title: "再加入 fixed-N chemical-potential shift",
        formula: "μ/εF=1-(π²/12)t²+O(t⁴);  D(μ)/D(εF)=√(μ/εF)=1-(π²/24)t²+O(t⁴)",
        explanation:
          "三维 DOS∝√ε，所以 μ 向下移动再贡献 −π²t²/24。两份相等的 correction 合计 −π²t²/12。",
      },
      {
        title: "以 χ0 归一化",
        formula: "χ(T)/χ0=[1-(π²/24)t²][1-(π²/24)t²]+O(t⁴)=1-(π²/12)t²+O(t⁴)",
        explanation:
          "thermal smearing 稍微降低 Fermi-level DOS 的有效 response。",
      },
    ],
    conclusion: "χ(T)≈χ0[1−(π²/12)(kBT/εF)²]",
    checks: [
      "T→0 时必须恢复 χ0。",
      "该 expansion 只在 T≪TF 有效，不能外推到 classical Curie regime。",
      "若只保留 D″ thermal averaging 或只保留 μ(T) shift，会误得一半 coefficient π²/24。",
    ],
    evidence: ["课件 9 slides 33–35"],
  },
};





