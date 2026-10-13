import type { TeacherFormulaLesson } from "./teacher-formula-types";

/**
 * Formula chains for Lectures 4–6 whose source slides jump over algebra or
 * silently switch conventions. `sourceFormulas` is intentionally kept in the
 * compact notation of the translation inventory; the walkthrough formulas use
 * literal LaTeX so the reader can inspect every intermediate operation.
 */
export const teacherFormulaLessons0406: TeacherFormulaLesson[] = [
  {
    moduleId: "canonical",
    lecture: 4,
    slides: [3, 4],
    sourceTitle:
      "Probability of an energy level in the canonical ensemble; Free-energy weighting and energy fluctuations",
    sourceFormulas: [
      "p(ε)=Ω(ε)e^(−βε)/Z",
      "Z(T)=Σε Ω(ε)e^(−βε)",
      "p(ε)=Ωe^(−βε)/Z=(1/Z)exp[S(ε)/kB−ε/kBT]=(1/Z)exp[−A(ε)/kBT]",
      "A=ε−TS(ε)",
      "Z=Σ_ε e^(βA(ε))≈e^(−βA(E*))",
      "⟨H²⟩c=⟨H²⟩−⟨H⟩²=∂²lnZ/∂β²=−∂⟨H⟩/∂β",
    ],
    derivation: {
      id: "teacher-l04-s03-s04-free-energy-saddle-gaussian",
      title: "从能级简并度到自由能鞍点与 Gaussian 能量涨落",
      kind: "近似",
      origin:
        "Lecture 4 slides 3–4：把正则能级概率写成自由能权重，再在热力学极限的最概然能量附近作二阶展开。",
      symbols: [
        { symbol: "$E$", meaning: "系统能量（课件写作 ε）" },
        { symbol: "$\\Omega(E)$", meaning: "能量 E 的简并度/态数" },
        { symbol: "$S(E)=k_B\\ln\\Omega(E)$", meaning: "该能量壳的熵" },
        { symbol: "$A(E)=E-TS(E)$", meaning: "把 E 当作涨落变量时的自由能函数" },
        { symbol: "$E_*$", meaning: "概率峰值，也即 A(E) 的局部极小点" },
      ],
      prerequisites: ["Boltzmann 权重", "S=k_B ln Ω", "Taylor 二阶展开", "Gaussian 分布"],
      assumptions: [
        "温度 T 固定且系统与大热库达到平衡",
        "E* 位于求和/积分内部，A 在其附近二阶可微且 A''(E*)>0",
        "系统足够大，使能量分布在 E* 附近尖锐；离散求和可在峰附近近似为积分",
        "课件 slide 4 的 exp(+βA) 与本页前式矛盾；推导采用物理上相容的 exp(-βA)",
      ],
      steps: [
        {
          title: "先把同一能级的微观态概率相加",
          formula: "$p(E)=\\dfrac{\\Omega(E)e^{-\\beta E}}{Z},\\qquad Z=\\sum_E\\Omega(E)e^{-\\beta E}$",
          explanation: "每个能量为 E 的微观态都有相同 Boltzmann 权重，但一共有 Ω(E) 个，所以能级概率必须乘简并度。",
        },
        {
          title: "用熵消去态数",
          formula: "$\\Omega(E)=e^{S(E)/k_B}\\ \\Longrightarrow\\ p(E)=\\dfrac{1}{Z}\\exp\\!\\left[\\dfrac{S(E)}{k_B}-\\beta E\\right]$",
          explanation: "这里 β=1/(kBT)，因此简并带来的熵增与高能量带来的 Boltzmann 抑制在同一个指数中竞争。",
        },
        {
          title: "识别自由能权重并纠正源页符号",
          formula: "$\\dfrac{S(E)}{k_B}-\\beta E=-\\beta\\,[E-TS(E)]=-\\beta A(E),\\qquad Z=\\sum_Ee^{-\\beta A(E)}$",
          explanation: "所以 slide 4 所印 Z=Σe^(+βA) 的正号与它自己的 p∝e^(−βA) 不相容；应为负号，这不是另一个 convention。",
        },
        {
          title: "一阶条件选出最概然能量",
          formula: "$A'(E_*)=1-T\\,S'(E_*)=0\\ \\Longleftrightarrow\\ S'(E_*)=\\dfrac{1}{T}$",
          explanation: "峰值条件正好恢复热力学温度定义；A(E) 在 E* 最小，p(E) 在同一点最大。",
        },
        {
          title: "在鞍点附近保留二阶项",
          formula: "$A(E)=A(E_*)+\\dfrac{1}{2}A''(E_*)(E-E_*)^2+O((E-E_*)^3)$",
          explanation: "线性项因 A'(E*)=0 消失；A''>0 才给可归一化的局部 Gaussian 峰。",
        },
        {
          title: "得到 Gaussian 与方差",
          formula: "$p(E)\\propto e^{-\\frac{\\beta A''(E_*)}{2}(E-E_*)^2},\\qquad \\operatorname{Var}(E)=\\dfrac{1}{\\beta A''(E_*)}=k_BT^2C_V$",
          explanation: "最后一个等号可由 S''(E*)=−1/(T²CV) 得到；这也与 ∂²β ln Z 的涨落公式一致。",
        },
      ],
      conclusion:
        "$p(E)=Z^{-1}e^{-\\beta A(E)}$；热力学极限下由 $A'(E_*)=0$ 选峰，并在峰附近给出方差 $k_BT^2C_V$ 的 Gaussian。",
      checks: [
        "若把指数误写成 +βA，概率会偏爱更大的自由能并通常不可归一化",
        "A''(E*) 必须为正；否则该点不是稳定平衡峰",
        "能量方差量纲为能量平方，kBT²CV 的量纲确实为 E²",
      ],
      evidence: [
        "课件 4 slide 3：p(ε)=Ω(ε)e^(−βε)/Z 与 Z(T)=ΣεΩ(ε)e^(−βε)",
        "课件 4 slide 4：自由能权重、能量 cumulant 与热容；该页 Z=Σe^(βA) 的正号为源课件疑似笔误，应为负号",
      ],
    },
  },
  {
    moduleId: "canonical",
    lecture: 4,
    slides: [7],
    sourceTitle: "Thermodynamics from the canonical partition function",
    sourceFormulas: [
      "⟨H⟩=−∂lnZ/∂β",
      "⟨H⟩=(∂(F/T)/∂(1/T))N,V",
      "F=−kBT ln Z",
    ],
    derivation: {
      id: "teacher-l04-s07-gibbs-helmholtz",
      title: "Gibbs–Helmholtz：为什么对 F/T 关于 1/T 求导会得到 U",
      kind: "恒等式",
      origin: "Lecture 4 slide 7：从 F=−kBT ln Z 与 U=−∂β ln Z 严格换元。",
      symbols: [
        { symbol: "$F$", meaning: "Helmholtz free energy" },
        { symbol: "$U=\\langle H\\rangle$", meaning: "正则平均内能" },
        { symbol: "$y=1/T$", meaning: "Gibbs–Helmholtz 使用的求导变量" },
      ],
      prerequisites: ["正则配分函数", "偏导链式法则", "β=1/(kBT)"],
      assumptions: ["N,V 固定", "Hamiltonian 不显含温度；若显含 T，需要额外项"],
      steps: [
        {
          title: "把自由能除以温度",
          formula: "$F=-k_BT\\ln Z\\ \\Longrightarrow\\ \\dfrac{F}{T}=-k_B\\ln Z$",
          explanation: "此写法把显式的 T 因子移走，剩下的温度依赖全部藏在 β 中。",
        },
        {
          title: "换用 y=1/T",
          formula: "$y\\equiv\\dfrac{1}{T},\\qquad \\beta=\\dfrac{y}{k_B},\\qquad \\dfrac{\\partial\\beta}{\\partial y}=\\dfrac{1}{k_B}$",
          explanation: "求 ∂/∂(1/T) 时不能把它误当 ∂/∂T；链式法则会带出 1/kB。",
        },
        {
          title: "对 F/T 求导",
          formula: "$\\left(\\dfrac{\\partial(F/T)}{\\partial y}\\right)_{N,V}=-k_B\\dfrac{\\partial\\ln Z}{\\partial\\beta}\\dfrac{\\partial\\beta}{\\partial y}=-\\left(\\dfrac{\\partial\\ln Z}{\\partial\\beta}\\right)_{N,V}$",
          explanation: "kB 与 dβ/dy 恰好抵消。",
        },
        {
          title: "代入正则内能生成式",
          formula: "$U=-\\left(\\dfrac{\\partial\\ln Z}{\\partial\\beta}\\right)_{N,V}\\ \\Longrightarrow\\ \\boxed{\\left(\\dfrac{\\partial(F/T)}{\\partial(1/T)}\\right)_{N,V}=U}$",
          explanation: "这就是课件所列 Gibbs–Helmholtz 形式；固定变量必须随公式一起记。",
        },
      ],
      conclusion: "$\\left[\\partial(F/T)/\\partial(1/T)\\right]_{N,V}=U$。",
      checks: ["F/T 与导数变量 1/T 的商量纲给能量", "漏掉固定 N,V 会把别的功项混进来"],
      evidence: ["课件 4 slide 7：⟨H⟩=(∂(F/T)/∂(1/T))N,V 与 F=−kBT lnZ"],
    },
  },
  {
    moduleId: "canonical",
    lecture: 4,
    slides: [10, 11],
    sourceTitle:
      "Canonical solution of the two-level system; Agreement of the two-level ensembles",
    sourceFormulas: [
      "Z=(1+e^(−βε))^N",
      "F=−NkBT ln[1+e^(−ε/kBT)]",
      "E=−∂lnZ/∂β=Nεe^(−βε)/(1+e^(−βε))",
      "pi(ni)=e^(−βεni)/(1+e^(−βε))",
      "E(T)=Nε/[e^(βε)+1]",
    ],
    derivation: {
      id: "teacher-l04-s10-s11-two-level-canonical-loop",
      title: "N 个独立二能级单元：从 z₁ 到 Z、F、p、⟨n⟩、U 的闭环",
      kind: "推导结果",
      origin: "Lecture 4 slides 10–11：每个单元只有 n=0,1，能量为 εn。",
      symbols: [
        { symbol: "$n_i\\in\\{0,1\\}$", meaning: "第 i 个单元是否处于激发态" },
        { symbol: "$\\varepsilon>0$", meaning: "两能级间隔" },
        { symbol: "$z_1$", meaning: "单个二能级单元的配分函数" },
        { symbol: "$Z$", meaning: "N 个可区分、互不相互作用单元的配分函数" },
      ],
      prerequisites: ["Boltzmann 权重", "独立变量的配分函数相乘", "Bernoulli 平均"],
      assumptions: ["N 个单元可区分且相互独立", "每个单元基态能量取 0、激发态能量取 ε", "N 固定"],
      steps: [
        {
          title: "先算一个单元",
          formula: "$z_1=\\sum_{n=0}^{1}e^{-\\beta\\varepsilon n}=1+e^{-\\beta\\varepsilon}$",
          explanation: "n=0 的权重是 1，n=1 的权重是 e^(−βε)。",
        },
        {
          title: "独立性让总配分函数因子化",
          formula: "$Z=\\prod_{i=1}^{N}z_1=(1+e^{-\\beta\\varepsilon})^N$",
          explanation: "这里不是 N×z1；每个单元的状态选择相互组合，所以权重和相乘。",
        },
        {
          title: "由 Z 得自由能",
          formula: "$F=-k_BT\\ln Z=-Nk_BT\\ln(1+e^{-\\beta\\varepsilon})$",
          explanation: "把乘方通过对数变为 N 倍，得到广延自由能。",
        },
        {
          title: "归一化单元概率",
          formula: "$p_i(n_i)=\\dfrac{e^{-\\beta\\varepsilon n_i}}{1+e^{-\\beta\\varepsilon}},\\qquad p_i(1)=\\dfrac{1}{e^{\\beta\\varepsilon}+1}$",
          explanation: "分母就是 z1；n=0 与 n=1 两项相加严格等于 1。",
        },
        {
          title: "计算平均激发数",
          formula: "$\\langle n_i\\rangle=0\\,p_i(0)+1\\,p_i(1)=\\dfrac{1}{e^{\\beta\\varepsilon}+1}$",
          explanation: "这是一个 Bernoulli 平均；不要在 n=0 项中保留 ε。",
        },
        {
          title: "两条路线得到同一内能",
          formula: "$U=N\\varepsilon\\langle n_i\\rangle=\\dfrac{N\\varepsilon}{e^{\\beta\\varepsilon}+1}=-\\dfrac{\\partial\\ln Z}{\\partial\\beta}$",
          explanation: "直接概率平均与配分函数求导闭合，正是检查推导最稳妥的方法。",
        },
      ],
      conclusion:
        "$z_1=1+e^{-\\beta\\varepsilon}$，$Z=z_1^N$，$F=-Nk_BT\\ln z_1$，且 $U=N\\varepsilon/(e^{\\beta\\varepsilon}+1)$。",
      checks: ["T→0 时 U→0", "T→∞ 时每个单元两态等概率，U→Nε/2", "p_i(0)+p_i(1)=1"],
      evidence: ["课件 4 slides 10–11：二能级正则解及其与微正则结果的一致性"],
    },
  },
  {
    moduleId: "canonical",
    lecture: 4,
    slides: [12],
    sourceTitle: "Canonical ensemble of a classical ideal gas",
    sourceFormulas: [
      "Z=V^N/N! (2πmkBT/h²)^(3N/2)=1/N!(V/λ³)^N",
      "λ=h/√(2πmkBT)",
      "F=−NkBT[ln(Ve/N)+(3/2)ln(2πmkBT/h²)]",
      "−S=∂F/∂T=…=(F−E)/T",
      "E=3NkBT/2",
      "P=−∂F/∂V=NkBT/V",
      "PV=NkBT",
    ],
    derivation: {
      id: "teacher-l04-s12-canonical-ideal-gas-thermodynamics",
      title: "经典理想气体：从相空间积分一路算到 F、U、S 与 P",
      kind: "推导结果",
      origin: "Lecture 4 slide 12：固定 T,V,N 的 Maxwell–Boltzmann 理想气体。",
      symbols: [
        { symbol: "$\\lambda=h/\\sqrt{2\\pi mk_BT}$", meaning: "热德布罗意波长" },
        { symbol: "$N!$", meaning: "相同经典粒子的 Gibbs 修正" },
        { symbol: "$Z_N$", meaning: "固定粒子数的正则配分函数" },
      ],
      prerequisites: ["Gaussian 动量积分", "Stirling 近似", "F=−kBT ln Z", "热力学偏导"],
      assumptions: ["单原子、无相互作用经典气体", "稀薄且 nλ³≪1", "N≫1 时才在 F 与 S 的简式中使用 lnN!≈NlnN−N"],
      steps: [
        {
          title: "把位置与动量积分分开",
          formula: "$Z_N=\\dfrac{1}{N!h^{3N}}\\int_{V}d^{3N}q\\int d^{3N}p\\,e^{-\\beta\\sum_i p_i^2/(2m)}$",
          explanation: "位置积分只给 V^N；1/N! 防止相同粒子的置换被重复计数。",
        },
        {
          title: "逐分量完成 Gaussian 积分",
          formula: "$\\int_{-\\infty}^{\\infty}dp\\,e^{-\\beta p^2/(2m)}=\\sqrt{\\dfrac{2\\pi m}{\\beta}},\\quad Z_N=\\dfrac{1}{N!}\\left(\\dfrac{V}{\\lambda^3}\\right)^N$",
          explanation: "每个粒子有三个动量分量，因此单粒子动量因子是 (2πmkBT)^(3/2)/h³=λ^(−3)。",
        },
        {
          title: "取对数并用 Stirling 公式",
          formula: "$\\ln Z_N=N\\ln\\!\\dfrac{V}{\\lambda^3}-\\ln N!\\simeq N\\left[\\ln\\!\\dfrac{V}{N\\lambda^3}+1\\right]$",
          explanation: "只有这一步用了大 N；原始 Z_N 的 1/N! 形式本身无需 Stirling。",
        },
        {
          title: "得到 Helmholtz free energy",
          formula: "$F=-k_BT\\ln Z_N\\simeq-Nk_BT\\left[\\ln\\!\\dfrac{V}{N\\lambda^3}+1\\right]$",
          explanation: "把 λ 的定义展开，就与课件的 ln(Ve/N)+(3/2)ln(2πmkBT/h²) 相同。",
        },
        {
          title: "对 β 求导得到内能",
          formula: "$U=-\\partial_\\beta\\ln Z_N=-N\\partial_\\beta\\ln(\\beta^{-3/2})=\\dfrac{3}{2}Nk_BT$",
          explanation: "V、N 固定，只有 λ^(−3N)∝β^(−3N/2) 依赖 β。",
        },
        {
          title: "用 F=U−TS 解出熵",
          formula: "$S=\\dfrac{U-F}{T}=Nk_B\\left[\\ln\\!\\dfrac{V}{N\\lambda^3}+\\dfrac{5}{2}\\right]$",
          explanation: "这就是 Sackur–Tetrode 形式；5/2 来自 F 中的 1 与 U/(NkBT)=3/2。",
        },
        {
          title: "对体积求导得到状态方程",
          formula: "$P=-\\left(\\dfrac{\\partial F}{\\partial V}\\right)_{T,N}=\\dfrac{Nk_BT}{V}\\ \\Longrightarrow\\ PV=Nk_BT$",
          explanation: "吸取偏导时 T、N 固定；外面的负号不能漏。",
        },
      ],
      conclusion:
        "$Z_N=(V/\\lambda^3)^N/N!$ 同时生成 $F$、$U=3Nk_BT/2$、$S$ 与 $PV=Nk_BT$。",
      checks: ["Z_N 无量纲", "U 与 V 无关符合无相互作用单原子气体", "S 随 V 增大而增大"],
      evidence: ["课件 4 slide 12：经典理想气体的 Z、λ、F、E、S、P 与 PV=NkBT"],
    },
  },
  {
    moduleId: "canonical",
    lecture: 5,
    slides: [2, 4],
    sourceTitle:
      "Generalized canonical ensemble at fixed generalized force; Gibbs free energy and the ideal-gas equation of state",
    sourceFormulas: [
      "p(μS,x)=exp[−βH(μS)+βJ·x]/𝒵(T,N,J)",
      "𝒵(N,T,J)=Σ_{μS,x} e^(βJ·x−βH(μS))",
      "⟨x⟩=kBT ∂ln𝒵/∂J",
      "G(N,T,J)=−kBT ln𝒵",
      "G=E−TS−x·J",
      "dG=−SdT+VdP+μdN",
      "V=(∂G/∂P)T,N=NkBT/P",
      "⟨x⟩=kBT∂ln𝒵/∂J",
    ],
    derivation: {
      id: "teacher-l05-s02-s04-generalized-canonical-fixed-force",
      title: "固定广义力的正则系综：从 H−J·x 到响应导数与 NPT",
      kind: "推导结果",
      origin:
        "Lecture 5 slides 2,4：对固定广义位移的能量作 Legendre 变换；NPT 是 J=−P、x=V 的特例。",
      symbols: [
        { symbol: "$x$", meaning: "可涨落的广义位移" },
        { symbol: "$J$", meaning: "与 x 共轭、由外界固定的广义力" },
        { symbol: "$\\mathcal Z(T,N,J)$", meaning: "固定 T,N,J 的广义配分函数" },
        { symbol: "$G_J$", meaning: "广义势；本条用下标避免与 Gibbs free energy 混淆" },
      ],
      prerequisites: ["正则权重", "Legendre 变换", "对参数求导"],
      assumptions: [
        "能量-功项 convention 采用 dE=T dS+J·dx+μdN，因此固定 J 的指数为 −β(H−J·x)",
        "若改用流体 convention dE=T dS−P dV+μdN，则 J=−P、x=V",
        "求 J 导数时 T,N 固定，且微观 H 不显含 J；若显含需保留额外导数",
      ],
      steps: [
        {
          title: "把系统与力库合并后的有效能量写出",
          formula: "$H_J(\\mu_S,x)=H(\\mu_S)-J\\!\\cdot x$",
          explanation: "外界固定 J 时，改变 x 所交换的功由 −J·x 进入 Boltzmann 指数；符号取决于最初的功项 convention。",
        },
        {
          title: "归一化得到广义正则分布",
          formula: "$p(\\mu_S,x)=\\dfrac{e^{-\\beta[H(\\mu_S)-J\\cdot x]}}{\\mathcal Z},\\quad \\mathcal Z=\\sum_{\\mu_S,x}e^{-\\beta[H(\\mu_S)-J\\cdot x]}$",
          explanation: "这与课件的 exp(−βH+βJ·x) 完全等价。",
        },
        {
          title: "对固定力求导把位移带下来",
          formula: "$\\dfrac{\\partial\\ln\\mathcal Z}{\\partial J_a}=\\dfrac{1}{\\mathcal Z}\\sum_{\\mu_S,x}\\beta x_a e^{-\\beta(H-J\\cdot x)}=\\beta\\langle x_a\\rangle$",
          explanation: "向量导数应逐分量理解，不能把 J 与 x 当作无方向的普通数。",
        },
        {
          title: "得到响应生成式与广义势",
          formula: "$\\langle x_a\\rangle=k_BT\\left(\\dfrac{\\partial\\ln\\mathcal Z}{\\partial J_a}\\right)_{T,N},\\qquad G_J=-k_BT\\ln\\mathcal Z=E-TS-J\\cdot x$",
          explanation: "配分函数生成平均位移；Legendre 变换后的自然变量从 x 变为 J。",
        },
        {
          title: "映射到恒温恒压系综",
          formula: "$J=-P,\\quad x=V\\ \\Longrightarrow\\ H_J=H+PV,\\quad \\Delta(T,P,N)=\\int_0^\\infty dV\\,e^{-\\beta PV}Z_N(T,V)$",
          explanation: "流体的功项是 −P dV，所以固定压力时权重必为 exp[−β(H+PV)]，不是 exp[−β(H−PV)]。",
        },
        {
          title: "恢复 Gibbs 导数",
          formula: "$G(T,P,N)=-k_BT\\ln\\Delta,\\qquad \\left(\\dfrac{\\partial G}{\\partial P}\\right)_{T,N}=\\langle V\\rangle$",
          explanation: "因为 J=−P，广义 J 导数的符号映射后正好得到 dG=−S dT+V dP+μ dN。",
        },
      ],
      conclusion:
        "固定 J 的权重为 $e^{-\\beta(H-J\\cdot x)}$，并有 $\\langle x\\rangle=k_BT\\partial_J\\ln\\mathcal Z$；NPT 对应 $J=-P,x=V$。",
      checks: [
        "NPT 权重随 V 增大应受 e^(−βPV) 抑制",
        "对向量 J 求导只生成同一分量 xa",
        "压力导数 ∂PG 的符号应给 +V",
      ],
      evidence: [
        "课件 5 slide 2：固定 J 的广义正则概率、𝒵、⟨x⟩ 与 G",
        "课件 5 slide 4：J=−P 的符号映射、dG 与 V=(∂G/∂P)T,N",
      ],
    },
  },
  {
    moduleId: "canonical",
    lecture: 5,
    slides: [3, 5],
    sourceTitle:
      "Isothermal–isobaric ensemble for an ideal gas; Enthalpy and heat capacity at constant pressure",
    sourceFormulas: [
      "𝒵=∫₀∞dV e^(−βPV) ∫(1/N!)∏d³qi d³pi/h³ exp[−βΣp_i²/2m]",
      "𝒵=∫₀∞dV V^N e^(−βPV)/(N!λ^(3N))=1/[(βP)^(N+1)λ^(3N)]",
      "−∂ln𝒵/∂β=⟨H−x·J⟩≡H",
      "H=−∂ln𝒵/∂β=5NkBT/2",
      "CP=dH/dT=5NkB/2",
    ],
    derivation: {
      id: "teacher-l05-s03-s05-npt-enthalpy-finite-n",
      title: "NPT 理想气体：焓与 CP，以及课件省掉的有限 N 的 +1",
      kind: "推导结果",
      origin:
        "Lecture 5 slides 3,5：按固定参考尺度的测度 dV/V0 积分体积；课件的 5N/2 是热力学极限写法。",
      symbols: [
        { symbol: "$\\Delta_N$", meaning: "NPT 配分函数（课件记作 𝒵）" },
        { symbol: "$V_0$", meaning: "使体积积分测度 dV/V0 无量纲的固定参考体积" },
        { symbol: "$\\mathcal H=H_{\\rm micro}+PV$", meaning: "瞬时焓；避免与 Hamiltonian 同符号混淆" },
        { symbol: "$C_P$", meaning: "固定 P,N 的热容" },
      ],
      prerequisites: ["正则理想气体 ZN(V)", "Gamma 积分", "λ∝β^(1/2)", "对 ln 配分函数求 β 导数"],
      assumptions: [
        "单原子经典理想气体，固定 N,P,T",
        "体积测度为 dV/V0，其中 V0 与 β、P 无关；换测度会改变有限 N 常数项",
        "P 在 β 求导时保持不变",
      ],
      steps: [
        {
          title: "把正则理想气体放入 NPT 体积积分",
          formula: "$\\Delta_N=\\int_0^\\infty\\dfrac{dV}{V_0}\\,e^{-\\beta PV}\\dfrac{1}{N!}\\left(\\dfrac{V}{\\lambda^3}\\right)^N$",
          explanation: "固定的 1/V0 只负责量纲，不依赖温度，因此不会消掉后面的有限 N 修正。",
        },
        {
          title: "完成 Gamma 积分",
          formula: "$\\int_0^\\infty dV\\,V^Ne^{-\\beta PV}=\\dfrac{\\Gamma(N+1)}{(\\beta P)^{N+1}}=\\dfrac{N!}{(\\beta P)^{N+1}}$",
          explanation: "正是上限到无穷和 V^N 让幂次成为 N+1；这一步是有限 N 的 +1 来源。",
        },
        {
          title: "写出配分函数的 β 依赖",
          formula: "$\\Delta_N=\\dfrac{1}{V_0\\lambda^{3N}(\\beta P)^{N+1}},\\qquad \\ln\\Delta_N=\\text{const}-\\dfrac{3N}{2}\\ln\\beta-(N+1)\\ln\\beta$",
          explanation: "因 λ∝β^(1/2)，λ^(−3N) 给 −3N/2 lnβ；体积积分另给 −(N+1)lnβ。",
        },
        {
          title: "生成平均焓",
          formula: "$\\langle\\mathcal H\\rangle=-\\left(\\dfrac{\\partial\\ln\\Delta_N}{\\partial\\beta}\\right)_{P,N}=\\left(\\dfrac{5N}{2}+1\\right)\\dfrac{1}{\\beta}=\\left(\\dfrac{5N}{2}+1\\right)k_BT$",
          explanation: "课件写 5NkBT/2，相当于在 N≫1 时丢掉非广延的 +kBT；严格有限 N 且测度 dV/V0 固定时应保留 +1。",
        },
        {
          title: "对温度求导得到 CP",
          formula: "$C_P=\\left(\\dfrac{\\partial\\langle\\mathcal H\\rangle}{\\partial T}\\right)_{P,N}=\\left(\\dfrac{5N}{2}+1\\right)k_B\\xrightarrow[N\\gg1]{}\\dfrac{5N}{2}k_B$",
          explanation: "宏观极限恢复熟悉的单原子理想气体结果，但有限系统的 measure convention 必须说清楚。",
        },
        {
          title: "用平均体积交叉检查",
          formula: "$\\langle V\\rangle=-\\dfrac{\\partial\\ln\\Delta_N}{\\partial(\\beta P)}=\\dfrac{N+1}{\\beta P},\\qquad \\langle H_{\\rm micro}\\rangle=\\dfrac{3N}{2}k_BT$",
          explanation: "两者相加给 (3N/2+N+1)kBT，与 β 导数完全一致。",
        },
      ],
      conclusion:
        "固定 $dV/V_0$ 测度下，有限 N 的 $\\langle\\mathcal H\\rangle=(5N/2+1)k_BT$、$C_P=(5N/2+1)k_B$；课件式是忽略 O(1) 的热力学极限。",
      checks: [
        "若忘记体积积分，便不会出现 N+1",
        "V0 必须与 β、P 无关；若人为选温度相关测度，导数会改变",
        "N≫1 时 +1 相对 N 项消失，故不与宏观热力学冲突",
      ],
      evidence: [
        "课件 5 slide 3：𝒵=1/[(βP)^(N+1)λ^(3N)]（课件省略固定参考体积因子）",
        "课件 5 slide 5：H=5NkBT/2 与 CP=5NkB/2；这是热力学极限表达",
      ],
    },
  },
  {
    moduleId: "canonical",
    lecture: 5,
    slides: [6, 7],
    sourceTitle:
      "Paramagnet in an external magnetic field; Magnetization, susceptibility, and magnetic heat capacity",
    sourceFormulas: [
      "𝒵=tr exp(−βH+βB·M⃗)",
      "M=μ0Σiσi",
      "p({σi})=1/𝒵 exp[βBμ0Σiσi]",
      "𝒵=[2cosh(βμ0B)]^N",
      "G=−NkBT ln[2cosh(βμ0B)]",
      "M=−∂G/∂B=Nμ0 tanh(βμ0B)",
      "χ(T)=∂M/∂B|B=0=Nμ0²/(kBT)",
      "H=⟨H−BM⟩=−BM",
      "CB=−B ∂M/∂T",
    ],
    derivation: {
      id: "teacher-l05-s06-s07-independent-paramagnet",
      title: "独立经典顺磁体：Z、M、Curie susceptibility 与磁热容",
      kind: "模型",
      origin: "Lecture 5 slides 6–7：N 个互不作用的 Ising 磁矩置于均匀外场 B。",
      symbols: [
        { symbol: "$\\sigma_i=\\pm1$", meaning: "第 i 个磁矩的取向" },
        { symbol: "$\\mu_0$", meaning: "课件中的单自旋磁矩参数，不是真空磁导率" },
        { symbol: "$x=\\beta\\mu_0B$", meaning: "无量纲场强" },
        { symbol: "$M=\\mu_0\\sum_i\\sigma_i$", meaning: "总磁矩" },
      ],
      prerequisites: ["二态配分函数", "双曲函数", "参数导数生成平均值"],
      assumptions: ["磁矩彼此独立", "B 均匀且沿量子化轴", "固定 B 求热容；忽略晶格等其他自由度"],
      steps: [
        {
          title: "写出微观 Zeeman 能量",
          formula: "$E(\\{\\sigma_i\\})=-\\mu_0B\\sum_{i=1}^{N}\\sigma_i=-BM$",
          explanation: "平行外场 σ=+1 的能量较低；这里 μ0 是磁矩大小。",
        },
        {
          title: "先求单自旋配分函数",
          formula: "$z_1=\\sum_{\\sigma=\\pm1}e^{x\\sigma}=e^x+e^{-x}=2\\cosh x$",
          explanation: "x=βμ0B 把温度和外场组合成唯一的无量纲参数。",
        },
        {
          title: "利用独立性得到总配分函数与势",
          formula: "$\\mathcal Z=z_1^N=[2\\cosh x]^N,\\qquad G=-Nk_BT\\ln(2\\cosh x)$",
          explanation: "独立磁矩的状态组合相乘，故必须有 N 次方。",
        },
        {
          title: "对 B 求导得到磁化强度",
          formula: "$M=-\\left(\\dfrac{\\partial G}{\\partial B}\\right)_T=N\\mu_0\\tanh x$",
          explanation: "链式法则给 ∂Bx=βμ0；负号与 dG=−S dT−M dB 的 convention 相配。",
        },
        {
          title: "在弱场求 Curie susceptibility",
          formula: "$\\chi=\\left(\\dfrac{\\partial M}{\\partial B}\\right)_{B=0}=N\\beta\\mu_0^2\\operatorname{sech}^2(0)=\\dfrac{N\\mu_0^2}{k_BT}$",
          explanation: "只有在 x≪1 时 tanh x≈x；大场会饱和，不能继续线性外推。",
        },
        {
          title: "求磁能与固定场热容",
          formula: "$U_B=-BM=-N\\mu_0B\\tanh x,\\qquad C_B=\\left(\\dfrac{\\partial U_B}{\\partial T}\\right)_B=Nk_Bx^2\\operatorname{sech}^2x$",
          explanation: "等价地 CB=−B(∂M/∂T)B；温度升高会削弱磁化，使磁能变得不那么负。",
        },
      ],
      conclusion:
        "$\\mathcal Z=[2\\cosh x]^N$，$M=N\\mu_0\\tanh x$，弱场 $\\chi=N\\mu_0^2/(k_BT)$，且 $C_B=Nk_Bx^2\\operatorname{sech}^2x$。",
      checks: ["B→0 时 M→0 且 CB→0", "T→0、B≠0 时 M→Nμ0 饱和", "χ 只在 B=0 的线性响应中服从 1/T"],
      evidence: ["课件 5 slides 6–7：独立顺磁体的 𝒵、G、M、χ、磁能与 CB"],
    },
  },
  {
    moduleId: "grand-canonical",
    lecture: 5,
    slides: [9],
    sourceTitle: "Particle-number fluctuations",
    sourceFormulas: [
      "𝒬=ΣμS e^(βμN−βH)",
      "⟨N⟩=(1/𝒬)∂𝒬/∂(βμ)=∂ln𝒬/∂(βμ)",
      "∂²ln𝒬/∂(βμ)²=∂⟨N⟩/∂(βμ)∝N",
      "√(⟨N²⟩c/⟨N⟩²)∼1/√N",
      "N*≈⟨N⟩",
    ],
    derivation: {
      id: "teacher-l05-s09-number-fluctuation-scaling",
      title: "粒子数 cumulant：为什么相对涨落通常按 1/√N 消失",
      kind: "推导结果",
      origin: "Lecture 5 slide 9：巨配分函数对 α=βμ 的导数生成粒子数 cumulant。",
      symbols: [
        { symbol: "$\\alpha=\\beta\\mu$", meaning: "粒子数的无量纲共轭变量" },
        { symbol: "$\\kappa_2(N)$", meaning: "二阶 cumulant，即 Var(N)" },
        { symbol: "$N_*$", meaning: "巨正则分布的最概然粒子数" },
      ],
      prerequisites: ["巨配分函数", "方差", "广延量", "cumulant generating function"],
      assumptions: [
        "处于单一稳定、有限相关长度的宏观相，远离临界点与相共存奇点",
        "粒子数可分成许多近似独立的局部贡献，因此 ln𝒬 与二阶 cumulant 都是 O(N)",
      ],
      steps: [
        {
          title: "把 α 写进权重",
          formula: "$\\mathcal Q(\\alpha)=\\sum_s e^{\\alpha N_s-\\beta H_s}$",
          explanation: "对 α 求导只会把每个微观态的粒子数 Ns 从指数中带下来。",
        },
        {
          title: "一阶导数生成均值",
          formula: "$\\partial_\\alpha\\ln\\mathcal Q=\\dfrac{1}{\\mathcal Q}\\sum_sN_se^{\\alpha N_s-\\beta H_s}=\\langle N\\rangle$",
          explanation: "若直接对 μ 求导，还会多出 β；用 α=βμ 可以避免漏因子。",
        },
        {
          title: "二阶导数生成方差",
          formula: "$\\partial_\\alpha^2\\ln\\mathcal Q=\\langle N^2\\rangle-\\langle N\\rangle^2\\equiv\\operatorname{Var}(N)$",
          explanation: "对归一化分母的导数正好减去均值平方，所以结果不是 ⟨N²⟩ 本身。",
        },
        {
          title: "使用通常相中的广延标度",
          formula: "$\\langle N\\rangle=O(N),\\qquad \\operatorname{Var}(N)=O(N)$",
          explanation: "有限相关长度时，许多局部涨落近似相加：均值与方差都随体积/粒子数线性增长。",
        },
        {
          title: "得到相对均方根涨落",
          formula: "$\\dfrac{\\sqrt{\\operatorname{Var}(N)}}{\\langle N\\rangle}\\sim\\dfrac{\\sqrt{N}}{N}=N^{-1/2}$",
          explanation: "消失的是相对涨落；绝对宽度仍按 √N 增长。",
        },
        {
          title: "说明临界例外",
          formula: "$\\operatorname{Var}(N)=k_BT\\left(\\dfrac{\\partial\\langle N\\rangle}{\\partial\\mu}\\right)_{T,V}=k_BT\\,n^2V\\kappa_T$",
          explanation: "临界点 κT 可发散，Var(N) 可能超广延，于是 1/√N 标度不再自动成立。",
        },
      ],
      conclusion:
        "普通单相区有 $\\sqrt{\\operatorname{Var}N}/\\langle N\\rangle\\sim N^{-1/2}$，故 $N_*\\approx\\langle N\\rangle$；临界点必须另查 susceptibility 标度。",
      checks: ["绝对涨落 √Var(N) 不趋于零", "分母必须是 ⟨N⟩，不是 √⟨N⟩", "临界区不能机械套中心极限定理"],
      evidence: ["课件 5 slide 9：⟨N⟩、二阶导数、1/√N 相对涨落与 N*≈⟨N⟩"],
    },
  },
  {
    moduleId: "grand-canonical",
    lecture: 5,
    slides: [13],
    sourceTitle: "Grand canonical ensemble of a classical ideal gas",
    sourceFormulas: [
      "𝒬=Σ_{N=0}^∞ e^(βμN)/N! ∫(∏d³qi d³pi/h³) exp[−βΣp_i²/2m]",
      "𝒬=Σ_N e^(βμN)/N!(V/λ³)^N=exp[e^(βμ)V/λ³]",
      "λ=h/√(2πmkBT)",
      "𝒢=−kBT ln𝒬=−kBT e^(βμ)V/λ³",
      "kBT ln𝒬=PV",
      "P=kBT e^(βμ)/λ³",
      "N=e^(βμ)V/λ³",
      "P=kBTN/V",
      "μ=kBT ln(λ³N/V)=kBT ln(Pλ³/kBT)",
    ],
    derivation: {
      id: "teacher-l05-s13-grand-ideal-gas-loop",
      title: "经典理想气体的巨正则闭环：𝒬、N、P 与 μ",
      kind: "推导结果",
      origin: "Lecture 5 slide 13：把固定 N 的理想气体 ZN 对所有 N 用 fugacity 加权求和。",
      symbols: [
        { symbol: "$z=e^{\\beta\\mu}$", meaning: "fugacity" },
        { symbol: "$\\lambda$", meaning: "热德布罗意波长" },
        { symbol: "$\\mathcal Q$", meaning: "巨配分函数" },
        { symbol: "$\\mathcal G=-k_BT\\ln\\mathcal Q$", meaning: "巨势" },
      ],
      prerequisites: ["固定 N 理想气体配分函数", "指数函数幂级数", "巨势 𝒢=−PV"],
      assumptions: ["经典 Maxwell–Boltzmann 极限 nλ³≪1", "均匀无相互作用气体", "V,T,μ 固定"],
      steps: [
        {
          title: "从固定 N 的结果开始",
          formula: "$Z_N=\\dfrac{1}{N!}\\left(\\dfrac{V}{\\lambda^3}\\right)^N$",
          explanation: "1/N! 是后面把级数识别成指数函数不可缺少的因子。",
        },
        {
          title: "对粒子数作 fugacity 加权",
          formula: "$\\mathcal Q=\\sum_{N=0}^{\\infty}z^NZ_N=\\sum_{N=0}^{\\infty}\\dfrac{1}{N!}\\left(\\dfrac{zV}{\\lambda^3}\\right)^N$",
          explanation: "巨正则系综必须把 N=0,1,2,… 全部求和，不能仍固定 N。",
        },
        {
          title: "识别指数级数",
          formula: "$\\mathcal Q=\\exp\\!\\left(\\dfrac{zV}{\\lambda^3}\\right),\\qquad \\ln\\mathcal Q=\\dfrac{e^{\\beta\\mu}V}{\\lambda^3}$",
          explanation: "e^(βμ) 位于总指数的内部；把它写到 exp 外会改变整个函数。",
        },
        {
          title: "对 βμ 求导得到平均粒子数",
          formula: "$\\langle N\\rangle=\\dfrac{\\partial\\ln\\mathcal Q}{\\partial(\\beta\\mu)}=\\dfrac{e^{\\beta\\mu}V}{\\lambda^3}$",
          explanation: "求导后仍保留 V/λ³；它决定可用单粒子相空间态数。",
        },
        {
          title: "由巨势得到压力",
          formula: "$\\mathcal G=-k_BT\\ln\\mathcal Q=-PV\\ \\Longrightarrow\\ P=\\dfrac{k_BT}{V}\\ln\\mathcal Q=\\dfrac{k_BTe^{\\beta\\mu}}{\\lambda^3}$",
          explanation: "均匀、广延的单组分体系满足 𝒢=−PV。",
        },
        {
          title: "消去 fugacity 并反解化学势",
          formula: "$P=\\dfrac{\\langle N\\rangle k_BT}{V},\\qquad \\mu=k_BT\\ln\\!\\left(\\dfrac{\\lambda^3\\langle N\\rangle}{V}\\right)=k_BT\\ln\\!\\left(\\dfrac{P\\lambda^3}{k_BT}\\right)$",
          explanation: "第一式恢复理想气体状态方程；经典稀薄极限 nλ³≪1 也意味着 μ<0。",
        },
      ],
      conclusion:
        "$\\mathcal Q=\\exp(e^{\\beta\\mu}V/\\lambda^3)$ 同时给出 $N=e^{\\beta\\mu}V/\\lambda^3$、$P=Nk_BT/V$ 与 $\\mu=k_BT\\ln(n\\lambda^3)$。",
      checks: ["μ→−∞ 时 N与P均趋零", "ln𝒬、e^(βμ)V/λ³ 均无量纲", "经典适用区要求 nλ³≪1"],
      evidence: ["课件 5 slide 13：经典理想气体的 𝒬、𝒢、P、N 与 μ 全套关系"],
    },
  },
  {
    moduleId: "interactions-vdw",
    lecture: 6,
    slides: [3],
    sourceTitle: "Excluded volume and approximate partition function",
    sourceFormulas: [
      "Z≈[1/(N!λ³ᴺ)]V(V-Ω)…[V-(N-1)Ω]exp(-βŪ)",
      "V(V-Ω)…[V-(N-1)Ω]≈(V-NΩ/2)ᴺ",
      "Ū=-N²ū/V",
      "Z(T,N,V)≈[(V-NΩ/2)ᴺ/(N!λ³ᴺ)]exp[βūN²/(2V)]",
    ],
    derivation: {
      id: "teacher-l06-s03-excluded-volume-product",
      title: "排除体积乘积为什么近似成 (V−Nb)ᴺ",
      kind: "近似",
      origin:
        "Lecture 6 slide 3：逐个放入硬核粒子，并在低密度、宏观极限中把可用体积乘积压缩成 van der Waals 形式。",
      symbols: [
        { symbol: "$\\Omega$", meaning: "一对粒子的排除体积尺度" },
        { symbol: "$b=\\Omega/2$", meaning: "每粒子的 van der Waals covolume" },
        { symbol: "$\\bar u>0$", meaning: "吸引强度；总吸引能带负号" },
        { symbol: "$n=N/V$", meaning: "数密度" },
      ],
      prerequisites: ["硬核排斥", "ln(1−x) 的低密度展开", "理想气体 ZN"],
      assumptions: [
        "NΩ/V≪1，忽略三个及更多粒子的排除体积重叠与高阶相关",
        "N≫1，允许用 N−1≈N",
        "源页 Ū 与最终指数的 1/2 convention 不完全一致；以最终 Z 中的成对双计数修正为准",
      ],
      steps: [
        {
          title: "按顺序放入粒子",
          formula: "$W_N\\approx V(V-\\Omega)\\cdots[V-(N-1)\\Omega]=V^N\\prod_{j=0}^{N-1}\\left(1-\\dfrac{j\\Omega}{V}\\right)$",
          explanation: "第 j+1 个粒子的中心约少 jΩ 的可用体积；这只是低密度几何近似，不是精确组合公式。",
        },
        {
          title: "对乘积取对数",
          formula: "$\\ln\\dfrac{W_N}{V^N}=\\sum_{j=0}^{N-1}\\ln\\left(1-\\dfrac{j\\Omega}{V}\\right)$",
          explanation: "取对数把很多因子变成和，便于按 Ω/V 展开。",
        },
        {
          title: "保留第一 virial 阶",
          formula: "$\\ln\\dfrac{W_N}{V^N}\\simeq-\\dfrac{\\Omega}{V}\\sum_{j=0}^{N-1}j=-\\dfrac{\\Omega N(N-1)}{2V}\\simeq-\\dfrac{N^2\\Omega}{2V}$",
          explanation: "1/2 来自 0+1+…+(N−1)，也可理解为每一对只计一次。",
        },
        {
          title: "匹配单一有效体积",
          formula: "$N\\ln(V-Nb)=N\\ln V+N\\ln(1-Nb/V)\\simeq N\\ln V-\\dfrac{N^2b}{V}$",
          explanation: "要与上一行的一阶修正相同，必须取 b=Ω/2。",
        },
        {
          title: "得到课件近似",
          formula: "$W_N\\simeq(V-Nb)^N=(V-N\\Omega/2)^N$",
          explanation: "两边只保证到低密度首个修正相符；不能把这个式子当高密度精确结果。",
        },
        {
          title: "加入平均吸引能",
          formula: "$Z_N\\approx\\dfrac{(V-Nb)^N}{N!\\lambda^{3N}}\\exp\\!\\left(\\dfrac{\\beta\\bar uN^2}{2V}\\right)$",
          explanation: "平均吸引能 Uatt≈−ūN²/(2V)，放入 e^(−βUatt) 后指数为正。源页另写 Ū=−N²ū/V，显示其 Ū 命名与最终式相差成对计数的 1/2。",
        },
      ],
      conclusion:
        "低密度、N≫1 时 $V(V-\\Omega)\\cdots[V-(N-1)\\Omega]\\simeq(V-Nb)^N$，其中 $b=\\Omega/2$。",
      checks: ["b 的量纲必须是体积", "V−Nb 必须为正", "吸引能为负，所以 Z 的吸引修正指数为正"],
      evidence: [
        "课件 6 slide 3：排除体积乘积、(V−NΩ/2)^N 与最终 Z",
        "课件 6 slide 3 勘误提示：Ū 的定义与最终 Z 的 1/2 采用不同约定，须按成对双计数追踪",
      ],
    },
  },
  {
    moduleId: "interactions-vdw",
    lecture: 6,
    slides: [4, 5],
    sourceTitle: "Van der Waals equation from free energy; Virial and cluster expansions",
    sourceFormulas: [
      "[P+ūN²/(2V²)](V-NΩ/2)=NkBT",
      "P/(kBT)=(N/V)[1/(1-NΩ/V)-(ū/2)(N/V)]",
      "P/(kBT)=(N/V){1+(Ω-ū/2)(N/V)+Ω(N²/V²)+…}",
      "f(q)=exp[-β𝒱(q)]-1",
    ],
    derivation: {
      id: "teacher-l06-s05-vdw-second-virial",
      title: "从 van der Waals 状态方程读出第二 virial coefficient",
      kind: "近似",
      origin:
        "Lecture 6 slides 4–5：在低密度展开压力，并把课件的 Ω、ū convention 翻译为标准 a、b。",
      symbols: [
        { symbol: "$n=N/V$", meaning: "数密度" },
        { symbol: "$a=\\bar u/2$", meaning: "标准 van der Waals 吸引参数，量纲为能量×体积" },
        { symbol: "$b=\\Omega/2$", meaning: "标准排除体积参数" },
        { symbol: "$B_2(T)$", meaning: "压力 virial expansion 的第二系数" },
      ],
      prerequisites: ["van der Waals 方程", "几何级数", "virial expansion"],
      assumptions: [
        "低密度 bn≪1，只保留 n² 阶",
        "采用标准有量纲写法 P=nkBT/(1−bn)−an²",
        "课件 slide 5 将 Ω、ū 直接塞进 P/(kBT) 的括号，量纲约定未展开；比较 B2 时必须恢复 a/(kBT)",
      ],
      steps: [
        {
          title: "把课件方程换成标准参数",
          formula: "$a\\equiv\\dfrac{\\bar u}{2},\\quad b\\equiv\\dfrac{\\Omega}{2},\\quad P=\\dfrac{Nk_BT}{V-Nb}-a\\dfrac{N^2}{V^2}$",
          explanation: "这与 slide 4 的 [P+ūN²/(2V²)](V−NΩ/2)=NkBT 等价。",
        },
        {
          title: "改用数密度",
          formula: "$\\dfrac{P}{k_BT}=\\dfrac{n}{1-bn}-\\dfrac{a}{k_BT}n^2$",
          explanation: "除以 kBT 后，每一项量纲都必须是 1/体积；因此吸引参数必须以 a/(kBT) 出现。",
        },
        {
          title: "展开排除体积分母",
          formula: "$\\dfrac{1}{1-bn}=1+bn+b^2n^2+O(n^3)$",
          explanation: "这是低密度条件 bn<1 下的几何级数。",
        },
        {
          title: "收集到 n² 阶",
          formula: "$\\dfrac{P}{k_BT}=n+\\left(b-\\dfrac{a}{k_BT}\\right)n^2+b^2n^3+O(n^4)$",
          explanation: "排斥贡献 +b，吸引贡献 −a/(kBT)；升温会削弱吸引在无量纲系数中的影响。",
        },
        {
          title: "与 virial 定义逐项比较",
          formula: "$\\dfrac{P}{k_BT}=n+B_2(T)n^2+B_3(T)n^3+\\cdots\\ \\Longrightarrow\\ \\boxed{B_2(T)=b-\\dfrac{a}{k_BT}}$",
          explanation: "B2 有体积量纲；这也揭示课件 slide 5 的 shorthand 若直接读成 Ω−ū/2 会发生量纲混淆。",
        },
      ],
      conclusion: "$B_2(T)=b-a/(k_BT)$；排斥使 B2 为正，吸引使其降低。",
      checks: ["a=0 时 B2=b>0", "T→∞ 时吸引修正消失", "B2 的量纲与 b、a/(kBT) 都是体积"],
      evidence: [
        "课件 6 slide 4：van der Waals 状态方程及 a=ū/2、b=Ω/2 的映射",
        "课件 6 slide 5：压力低密度展开；原页未展开说明 ū 与 Ω 的量纲 convention",
      ],
    },
  },
  {
    moduleId: "interactions-vdw",
    lecture: 6,
    slides: [6],
    sourceTitle: "Breakdown of the gas equation and critical point",
    sourceFormulas: [
      "P=NkBT/(V-NΩ/2)-ūN²/(2V²)",
      "(∂P/∂V)T=0",
      "(∂²P/∂V²)T=0",
      "Pc=a/(27b²), Vc=3Nb, Tc=8a/(27b)",
      "a=ū/2, b=Ω/2",
    ],
    derivation: {
      id: "teacher-l06-s06-vdw-critical-point",
      title: "van der Waals 临界常数：逐步解出 Vc、Tc、Pc",
      kind: "推导结果",
      origin: "Lecture 6 slide 6：临界等温线的拐点同时满足一阶、二阶体积导数为零。",
      symbols: [
        { symbol: "$a=\\bar u/2$", meaning: "吸引参数" },
        { symbol: "$b=\\Omega/2$", meaning: "排除体积参数" },
        { symbol: "$V_c,T_c,P_c$", meaning: "临界体积、温度、压力" },
      ],
      prerequisites: ["van der Waals 方程", "一阶与二阶偏导", "联立代数方程"],
      assumptions: ["N 固定", "采用 P=NkBT/(V−Nb)−aN²/V²", "临界点由等温线水平拐点定义"],
      steps: [
        {
          title: "写成标准 van der Waals 形式",
          formula: "$P(V,T)=\\dfrac{Nk_BT}{V-Nb}-\\dfrac{aN^2}{V^2}$",
          explanation: "这里 a=ū/2、b=Ω/2，与课件原参数一一对应。",
        },
        {
          title: "求第一导数",
          formula: "$\\left(\\dfrac{\\partial P}{\\partial V}\\right)_T=-\\dfrac{Nk_BT}{(V-Nb)^2}+\\dfrac{2aN^2}{V^3}$",
          explanation: "临界点斜率为零，给 NkBT/(V−Nb)²=2aN²/V³。",
        },
        {
          title: "求第二导数",
          formula: "$\\left(\\dfrac{\\partial^2P}{\\partial V^2}\\right)_T=\\dfrac{2Nk_BT}{(V-Nb)^3}-\\dfrac{6aN^2}{V^4}$",
          explanation: "临界点曲率也为零，给 2NkBT/(V−Nb)³=6aN²/V⁴。",
        },
        {
          title: "用两条件相除消去温度",
          formula: "$\\dfrac{2}{V_c-Nb}=\\dfrac{3}{V_c}\\ \\Longrightarrow\\ 2V_c=3(V_c-Nb)\\ \\Longrightarrow\\ V_c=3Nb$",
          explanation: "同时为零的两个方程相除最省代数，并且不会先引入 Tc。",
        },
        {
          title: "回代求临界温度",
          formula: "$k_BT_c=\\dfrac{2aN(V_c-Nb)^2}{V_c^3}=\\dfrac{8a}{27b}$",
          explanation: "用 Vc=3Nb，则 Vc−Nb=2Nb，所有 N 消去。",
        },
        {
          title: "再回代求临界压力",
          formula: "$P_c=\\dfrac{Nk_BT_c}{V_c-Nb}-\\dfrac{aN^2}{V_c^2}=\\dfrac{a}{27b^2}$",
          explanation: "两项分别为 4a/(27b²) 与 3a/(27b²)，相减留下 a/(27b²)。",
        },
      ],
      conclusion:
        "$V_c=3Nb$，$k_BT_c=8a/(27b)$，$P_c=a/(27b^2)$；课件 Tc 式若省略 kB，表示以能量单位量温度。",
      checks: ["Vc 必须大于硬核下限 Nb", "Pc>0、Tc>0 要求 a,b>0", "PcVc/(NkBTc)=3/8"],
      evidence: ["课件 6 slide 6：van der Waals 方程、两条临界导数条件与 Pc,Vc,Tc"],
    },
  },
  {
    moduleId: "interactions-vdw",
    lecture: 6,
    slides: [8],
    sourceTitle: "Maxwell construction and gas–liquid coexistence",
    sourceFormulas: ["dμ=(V/N)dP", "μg(T,Pc)=μl(T,Pc)", "∮dP′ V(T,P′)=0"],
    derivation: {
      id: "teacher-l06-s08-maxwell-equal-area",
      title: "Maxwell 等面积构造：从化学势相等到两种积分形式",
      kind: "推导结果",
      origin:
        "Lecture 6 slide 8：沿固定温度等温线积分 dμ=v dP，用气液共存两端化学势相等替换不稳定回环。",
      symbols: [
        { symbol: "$v=V/N$", meaning: "每粒子体积" },
        { symbol: "$P_c$", meaning: "该温度下的共存压力，不是必然指临界压力" },
        { symbol: "$v_l,v_g$", meaning: "共存液相与气相的每粒子体积" },
      ],
      prerequisites: ["Gibbs–Duhem relation", "相平衡化学势相等", "分部积分"],
      assumptions: ["单组分体系", "温度固定", "气相和液相在同一共存压力 Pc 下达到平衡"],
      steps: [
        {
          title: "从单粒子 Gibbs relation 开始",
          formula: "$d\\mu=-s\\,dT+v\\,dP\\ \\xrightarrow{dT=0}\\ d\\mu=v\\,dP$",
          explanation: "固定温度时，化学势沿等温线的变化只由每粒子体积乘压力变化给出。",
        },
        {
          title: "应用两相平衡条件",
          formula: "$\\mu_g(T,P_c)=\\mu_l(T,P_c)\\ \\Longrightarrow\\ \\Delta\\mu=0$",
          explanation: "若化学势不同，粒子会从高 μ 相流向低 μ 相，不能静态共存。",
        },
        {
          title: "沿 van der Waals 回环闭合积分",
          formula: "$0=\\Delta\\mu=\\oint v(T,P')\\,dP'$",
          explanation: "这就是课件所写 ∮V dP=0；若使用总 V，整体只多常数 N，不影响零值。",
        },
        {
          title: "用分部积分改写成常见 P–V 等面积",
          formula: "$\\oint v\\,dP=\\oint d(Pv)-\\oint P\\,dv=-\\oint P\\,dv=0$",
          explanation: "闭合回路上状态函数 Pv 回到原值，所以 ∮d(Pv)=0。",
        },
        {
          title: "拆出水平共存线",
          formula: "$\\int_{v_l}^{v_g}[P(v,T)-P_c]\,dv=0$",
          explanation: "曲线高于 Pc 的面积与低于 Pc 的面积相等；这就是常见图上的 Maxwell equal-area rule。",
        },
      ],
      conclusion:
        "$\\mu_g=\\mu_l$ 等价于课件的 $\\oint v\,dP=0$，也等价于 $\\int_{v_l}^{v_g}[P(v,T)-P_c]dv=0$。",
      checks: ["积分必须在同一温度完成", "Pc 在本条是 coexistence pressure", "等面积替换的是不稳定回环，不是实验可走的连续路径"],
      evidence: ["课件 6 slide 8：dμ=(V/N)dP、气液化学势相等与 ∮VdP=0"],
    },
  },
  {
    moduleId: "phase-transition",
    lecture: 6,
    slides: [14, 17, 18],
    sourceTitle:
      "Magnetization near Tc; Symmetry and free-energy expansion; Free-energy landscape",
    sourceFormulas: [
      "m=±√{3[(Tc-T)/Tc](T/Tc)³}",
      "kBTc=8J (as shown on this slide)",
      "P H(σ) P†=H(−σ)=H(σ)",
      "F=-kBT ln ZMF",
      "F=-NkBT ln2+[NkBTc/(2T)](T-Tc)m²+[NkBTc⁴/(12T³)]m⁴+…",
      "m₀=±√{3[(Tc-T)/Tc](T/Tc)²} (as shown)",
      "χ^{-1}∝(∂²F/∂m²)equilibrium",
    ],
    derivation: {
      id: "teacher-l06-s14-s17-s18-ising-landau-curvature",
      title: "Ising 平均场自由能：极小值、磁化平方根律与曲率 susceptibility",
      kind: "近似",
      origin:
        "Lecture 6 slides 14,17–18：B=0 时以 m 的偶次 Landau 展开描述平均场临界行为，并核对源页指数差异。",
      symbols: [
        { symbol: "$m$", meaning: "每格点平均自旋序参量" },
        { symbol: "$T_c$", meaning: "给定配位/键计数 convention 下的平均场临界温度" },
        { symbol: "$F(m)$", meaning: "固定 m 的平均场自由能 landscape" },
        { symbol: "$\\chi$", meaning: "对共轭外场的线性响应" },
      ],
      prerequisites: ["Ising Z2 对称性", "Taylor 展开", "稳定点二阶导数", "线性响应"],
      assumptions: [
        "外场 B=0，因此 F(m)=F(−m) 且奇次项消失",
        "平均场并只保留 m⁴；靠近 Tc、|m|≪1",
        "源课件对 kBTc 使用 4J 与 8J 两套计数；本推导把 Tc 保留为符号，不混用数值 convention",
      ],
      steps: [
        {
          title: "抄出课件的偶次展开",
          formula: "$F(m)=F_0+A(T)m^2+B(T)m^4+O(m^6)$",
          explanation: "Z2 对称性 m→−m 禁止 B=0 时的 m、m³ 等奇次项。",
        },
        {
          title: "识别课件系数",
          formula: "$A(T)=\\dfrac{Nk_BT_c}{2T}(T-T_c),\\qquad B(T)=\\dfrac{Nk_BT_c^4}{12T^3}>0$",
          explanation: "B>0 保证截断后的自由能在大 |m| 方向稳定。",
        },
        {
          title: "求驻点",
          formula: "$\\dfrac{\\partial F}{\\partial m}=2Am+4Bm^3=2m(A+2Bm^2)=0$",
          explanation: "解分成 m=0 与 m²=−A/(2B) 两支，不能把 m 直接约掉而丢失无序解。",
        },
        {
          title: "得到低温自发磁化",
          formula: "$m_0^2=-\\dfrac{A}{2B}=3\\dfrac{T_c-T}{T_c}\\left(\\dfrac{T}{T_c}\\right)^2,\qquad m_0=\\pm\\sqrt{3\\dfrac{T_c-T}{T_c}\\left(\\dfrac{T}{T_c}\\right)^2}$",
          explanation: "这与 slide 18 一致；slide 14 根号内所印 (T/Tc)^3 与同一自由能展开不相容，应为二次幂。",
        },
        {
          title: "用曲率判断稳定支",
          formula: "$F''(m)=2A+12Bm^2,\\quad F''(0)=2A,\quad F''(m_0)=-4A$",
          explanation: "T>Tc 时 A>0，m=0 稳定；T<Tc 时 A<0，m=0 失稳而 ±m0 成为两个等价极小值。",
        },
        {
          title: "加入微小共轭场并求响应",
          formula: "$F_h(m)=F(m)-Nh\,m,\qquad F''(m_{\\rm eq})\\dfrac{\\partial m}{\\partial h}=N$",
          explanation: "对平衡条件 F'(m_eq)=Nh 再求 h 导数即可，无需把 m 误当常数。",
        },
        {
          title: "读出 susceptibility 发散",
          formula: "$\\chi\\propto\\dfrac{1}{F''(m_{\\rm eq})}\\propto|T-T_c|^{-1}$",
          explanation: "临界点曲率变平，所以极小外场也能产生很大磁化变化；比例常数取决于 h 与物理 B 的定义。",
        },
      ],
      conclusion:
        "课件给定 F(m) 推出 $m_0^2=3[(T_c-T)/T_c](T/T_c)^2$ 与 $\\chi\\propto|T-T_c|^{-1}$；slide 14 的三次幂应改为二次幂。",
      checks: [
        "T→Tc− 时 m0∝(Tc−T)^(1/2)",
        "两支 ±m0 体现 B=0 的 Z2 对称性",
        "不要把 slide 14 的 kBTc=8J 与 slides 13,17 的 4J 静默混成同一键计数 convention",
      ],
      evidence: [
        "课件 6 slide 14：m 根号式与 kBTc=8J；根号内 (T/Tc)^3 为源课件不一致",
        "课件 6 slide 17：B=0 对称性与 F 的 m²+m⁴ 展开；该页另采用 kBTc=4J",
        "课件 6 slide 18：m0 根号内 (T/Tc)^2 与 χ^−1∝F''",
      ],
    },
  },
  {
    moduleId: "phase-transition",
    lecture: 6,
    slides: [20],
    sourceTitle: "Spatial Landau theory",
    sourceFormulas: [
      "F[m(x)]≈∫d³x[½|∇m|²+r₀m²+u₀m⁴+u₁m⁶]",
      "r₀=α₀(T-Tc)",
      "m=0 (r₀>0)",
      "m=√[-r₀/(2u₀)] (r₀≤0, uniform mean field)",
    ],
    derivation: {
      id: "teacher-l06-s20-spatial-landau-euler-lagrange",
      title: "空间 Landau functional：Euler–Lagrange 方程与 ± 均匀极小值",
      kind: "模型",
      origin:
        "Lecture 6 slide 20：把序参量升级为位置场 m(x)，梯度能惩罚空间不均匀，再由泛函变分决定平衡剖面。",
      symbols: [
        { symbol: "$m(\\mathbf x)$", meaning: "实标量序参量场" },
        { symbol: "$r_0=\\alpha_0(T-T_c)$", meaning: "跨过临界温度时变号的二次系数" },
        { symbol: "$u_0,u_1$", meaning: "四次、六次局域系数" },
        { symbol: "$\\nabla m$", meaning: "序参量的空间梯度" },
      ],
      prerequisites: ["多元微积分", "分部积分", "Euler–Lagrange 方程", "Landau 稳定性"],
      assumptions: [
        "m 是实标量且自由能在 m→−m 下对称",
        "边界变分 δm 在边界为零，或边界项由自然边界条件消失",
        "若只截断到四次，必须有 u0>0；u0≤0 时需保留 u1>0",
      ],
      steps: [
        {
          title: "写出自由能密度",
          formula: "$F[m]=\\int d^3x\\left[\\dfrac{1}{2}|\\nabla m|^2+r_0m^2+u_0m^4+u_1m^6\\right]$",
          explanation: "梯度项偏爱平滑场，局域多项式决定每一点偏爱的序参量大小。",
        },
        {
          title: "对梯度项作变分与分部积分",
          formula: "$\\delta\\!\\int d^3x\\,\\dfrac{1}{2}|\\nabla m|^2=\\int d^3x\\,\\nabla m\\cdot\\nabla\\delta m=-\\int d^3x\\,(\\nabla^2m)\\delta m$",
          explanation: "边界项按假设消失，所以梯度能贡献 −∇²m。",
        },
        {
          title: "对局域势逐项求导",
          formula: "$\\delta\\!\\int d^3x(r_0m^2+u_0m^4+u_1m^6)=\\int d^3x(2r_0m+4u_0m^3+6u_1m^5)\\delta m$",
          explanation: "这里是普通幂函数导数；各数字系数不能省略。",
        },
        {
          title: "令任意 δm 的系数为零",
          formula: "$-\\nabla^2m+2r_0m+4u_0m^3+6u_1m^5=0$",
          explanation: "这是静态 Landau–Ginzburg Euler–Lagrange 方程，可描述均匀相、界面与缺陷。",
        },
        {
          title: "取均匀四次近似",
          formula: "$\\nabla m=0,\\ u_1\\text{ neglected}\\ \\Longrightarrow\\ 2m(r_0+2u_0m^2)=0$",
          explanation: "只有明确采用均匀近似时，才能把空间方程降为代数方程。",
        },
        {
          title: "列出完整的对称极小值",
          formula: "$r_0>0:\\ m_0=0;\\qquad r_0<0,\\ u_0>0:\\ m_0=\\pm\\sqrt{-\\dfrac{r_0}{2u_0}}$",
          explanation: "源页只显示正根，但实标量 Z2 对称模型同时有等能的负根；二者代表两个破缺对称态。",
        },
      ],
      conclusion:
        "$\\delta F/\\delta m=0$ 给 $-\\nabla^2m+2r_0m+4u_0m^3+6u_1m^5=0$；均匀四次模型低温有 $m_0=\\pm\\sqrt{-r_0/(2u_0)}$。",
      checks: ["每一项的量纲都应为自由能密度对 m 的导数", "r0<0 时 m=0 曲率为 2r0<0，确为不稳定", "非均匀界面不能丢掉 ∇²m"],
      evidence: ["课件 6 slide 20：空间 Landau functional、r0(T) 与均匀解；课件正根须补上 Z2 对称的负根"],
    },
  },
  {
    moduleId: "phase-transition",
    lecture: 6,
    slides: [21],
    sourceTitle: "First- and second-order transitions in Landau theory",
    sourceFormulas: [
      "F(m)=r₀m²+u₀m⁴+u₁m⁶",
      "u₀>0: continuous transition",
      "u₀<0, u₁>0: first-order transition",
    ],
    derivation: {
      id: "teacher-l06-s21-phi6-first-order-coexistence",
      title: "φ⁶ Landau 模型：连续相变与一阶共存点如何算出",
      kind: "模型",
      origin:
        "Lecture 6 slide 21：六次项稳定 u0<0 的自由能，并允许 m=0 与有限 m 极小值在 r0>0 时共存。",
      symbols: [
        { symbol: "$r_0$", meaning: "二次系数/温度控制参数" },
        { symbol: "$u_0$", meaning: "四次系数，决定连续或一阶情形" },
        { symbol: "$u_1>0$", meaning: "保证 |m|→∞ 时稳定的六次系数" },
        { symbol: "$x=m^2\\ge0$", meaning: "化简共存方程的非负变量" },
      ],
      prerequisites: ["多项式极值", "局部稳定性", "相共存时自由能相等"],
      assumptions: ["B=0 且 F(m)=F(−m)", "u1>0", "只讨论均匀 mean-field 序参量"],
      steps: [
        {
          title: "写自由能并求驻点",
          formula: "$F(m)=r_0m^2+u_0m^4+u_1m^6,\\qquad F'(m)=2m(r_0+2u_0m^2+3u_1m^4)$",
          explanation: "m=0 永远是驻点；非零驻点满足括号中的二次方程。",
        },
        {
          title: "先看 u0>0 的连续情形",
          formula: "$u_0>0,\\ r_0<0:\\qquad m^2\\simeq-\\dfrac{r_0}{2u_0}$",
          explanation: "靠近 r0=0 时 m 很小，六次项次领先；m 从 0 连续长出。",
        },
        {
          title: "为 u0<0 保留稳定六次项",
          formula: "$u_0<0,\\ u_1>0:\\qquad r_0+2u_0x+3u_1x^2=0,\\quad x=m^2>0$",
          explanation: "负四次项会偏爱有限 m，正六次项阻止自由能向 −∞ 逃逸。",
        },
        {
          title: "写相共存的等自由能条件",
          formula: "$F(\\pm\\sqrt{x})=F(0)=0\\ \\Longrightarrow\\ r_0+u_0x+u_1x^2=0$",
          explanation: "一阶转变点不只要求驻点，还要求有序与无序极小值的自由能相等。",
        },
        {
          title: "联立两式求跃变量",
          formula: "$(r_0+2u_0x+3u_1x^2)-(r_0+u_0x+u_1x^2)=x(u_0+2u_1x)=0$",
          explanation: "选择非零共存支，得到 x*=−u0/(2u1)>0。",
        },
        {
          title: "求共存控制参数",
          formula: "$m_*^2=x_*=-\\dfrac{u_0}{2u_1},\\qquad r_{0,*}=\\dfrac{u_0^2}{4u_1}>0$",
          explanation: "序参量在 r0仍为正时就从 0 跳到 ±m*，这正是一阶转变；不是等到 r0=0 才发生。",
        },
      ],
      conclusion:
        "$u_0>0$ 时转变在 $r_0=0$ 连续发生；$u_0<0,u_1>0$ 时共存点为 $r_{0,*}=u_0^2/(4u_1)$，序参量跃到 $m_*^2=-u_0/(2u_1)$。",
      checks: ["一阶共存点两相的 F 必须相等", "u1>0 才能稳定 u0<0 模型", "m*² 必须非负，故要求 u0<0"],
      evidence: ["课件 6 slide 21：F=r0m²+u0m⁴+u1m⁶ 与 u0 正负对应的连续/一阶分类"],
    },
  },
  {
    moduleId: "phase-transition",
    lecture: 6,
    slides: [23, 24],
    sourceTitle:
      "Ginzburg–Landau free energy for superconductors; GL equations and Abrikosov vortex lattice",
    sourceFormulas: [
      "ψ(r)=|ψ(r)|e^{iφ(r)}",
      "fs=fn+α(T)|ψ|²+½β(T)|ψ|⁴+[1/(2m*)]|(-iℏ∇-e*A/c)ψ|²+B²/(8π)",
      "e*=2e",
      "B=∇×A",
      "αψ+β|ψ|²ψ+[1/(2m*)](-iℏ∇-e*A/c)²ψ=0",
      "∇×B=(4π/c)J",
      "J=(e*/m*)Re{ψ*(-iℏ∇-e*A/c)ψ}",
      "ψ(r)=0 at vortex core",
    ],
    derivation: {
      id: "teacher-l06-s23-s24-superconducting-gl-equations-vortex",
      title: "超导 Ginzburg–Landau：两条变分方程与 vortex core 为什么 ψ=0",
      kind: "模型",
      origin:
        "Lecture 6 slides 23–24：对复序参量 ψ* 与 vector potential A 分别变分，并用相位绕转解释 Abrikosov vortex core。",
      symbols: [
        { symbol: "$\\psi=|\\psi|e^{i\\phi}$", meaning: "Cooper pair 凝聚的复序参量，不是单电子波函数" },
        { symbol: "$e^*=2e$", meaning: "Cooper pair 有效电荷；e 的正负 convention 需与协变导数一致" },
        { symbol: "$\\mathbf D=-i\\hbar\\nabla-e^*\\mathbf A/c$", meaning: "规范协变动量" },
        { symbol: "$\\mathbf B=\\nabla\\times\\mathbf A$", meaning: "磁感应强度" },
      ],
      prerequisites: ["复变量变分", "vector calculus", "minimal coupling", "相位单值性"],
      assumptions: [
        "采用 cgs 单位，因此磁场能为 B²/(8π)、Ampère 方程含 4π/c",
        "把 ψ 与 ψ* 视为独立变分变量",
        "边界项消失；材料参数 α,β,m* 在所考察区域取常数且 β>0",
      ],
      steps: [
        {
          title: "写总自由能 functional",
          formula: "$F=\\int d^3r\\left[\\alpha|\\psi|^2+\\dfrac{\\beta}{2}|\\psi|^4+\\dfrac{1}{2m^*}|\\mathbf D\\psi|^2+\\dfrac{|\\mathbf B|^2}{8\\pi}\\right]+F_n$",
          explanation: "前两项选择凝聚幅度，第三项惩罚带规范场的空间变化，最后一项是磁场能。",
        },
        {
          title: "对 ψ* 变分局域项",
          formula: "$\\dfrac{\\delta}{\\delta\\psi^*}\\left(\\alpha|\\psi|^2+\\dfrac{\\beta}{2}|\\psi|^4\\right)=\\alpha\\psi+\\beta|\\psi|^2\\psi$",
          explanation: "因为 |ψ|²=ψ*ψ；四次项求导后 1/2 与 2 抵消。",
        },
        {
          title: "对 ψ* 变分梯度项",
          formula: "$\\dfrac{\\delta}{\\delta\\psi^*}\\dfrac{|\\mathbf D\\psi|^2}{2m^*}=\\dfrac{1}{2m^*}\\mathbf D^2\\psi$",
          explanation: "分部积分后协变导数作用两次；符号取决于 D 的一致定义。",
        },
        {
          title: "得到第一条 GL 方程",
          formula: "$\\alpha\\psi+\\beta|\\psi|^2\\psi+\\dfrac{1}{2m^*}\\left(-i\\hbar\\nabla-\\dfrac{e^*}{c}\\mathbf A\\right)^2\\psi=0$",
          explanation: "这是序参量的平衡方程；无场均匀情形会退化成 αψ+β|ψ|²ψ=0。",
        },
        {
          title: "对 A 变分物质项与磁场项",
          formula: "$\\delta_AF_{\\rm matter}=-\\dfrac{1}{c}\\int d^3r\\,\\mathbf J\\cdot\\delta\\mathbf A,\\qquad \\delta_A F_B=\\dfrac{1}{4\\pi}\\int d^3r(\\nabla\\times\\mathbf B)\\cdot\\delta\\mathbf A$",
          explanation: "令总变分为零便把 supercurrent 与磁场旋度联系起来。",
        },
        {
          title: "得到第二条 GL/Ampère 方程",
          formula: "$\\nabla\\times\\mathbf B=\\dfrac{4\\pi}{c}\\mathbf J,\\qquad \\mathbf J=\\dfrac{e^*}{m^*}\\operatorname{Re}\\!\\left\\{\\psi^*\\left(-i\\hbar\\nabla-\\dfrac{e^*}{c}\\mathbf A\\right)\\psi\\right\\}$",
          explanation: "这与课件公式一致；电荷正负 convention 必须同时用于 D 与 J。",
        },
        {
          title: "用相位绕转解释 vortex core",
          formula: "$\\oint\\nabla\\phi\\cdot d\\boldsymbol\\ell=2\\pi n,\\qquad |\\nabla\\phi|\\sim\\dfrac{|n|}{r}$",
          explanation: "非零 winding 使相位梯度在 r→0 发散；若 |ψ| 保持非零，梯度能密度将不可接受地发散。",
        },
        {
          title: "核心处必须压低凝聚幅度",
          formula: "$|\\psi(r)|\\xrightarrow[r\\to0]{}0\\qquad(n\\ne0)$",
          explanation: "因此磁通以离散 vortex 穿透，核心处回到 normal-like 状态；并非磁场均匀、无阻碍地穿透超导体。",
        },
      ],
      conclusion:
        "对 $\\psi^*$、$\\mathbf A$ 的独立变分给出两条 GL 方程；非零相位 winding 为保持有限梯度能，要求 vortex core 处 $\\psi\\to0$。",
      checks: ["A=0 且 ψ 均匀时第一式应化为 αψ+β|ψ|²ψ=0", "ψ=0 时超电流 J=0", "ψ 的规范相位变化与 A 的变化必须成套"],
      evidence: [
        "课件 6 slide 23：超导 GL 自由能、ψ 的幅相形式、e*=2e 与 B=∇×A",
        "课件 6 slide 24：两条 GL 方程、supercurrent 与 ψ=0 at vortex core",
      ],
    },
  },
  {
    moduleId: "phase-transition",
    lecture: 6,
    slides: [25, 26, 27],
    sourceTitle:
      "One-dimensional Ising model: transfer matrix; Transfer-matrix eigenvalues; No finite-temperature transition in 1D Ising",
    sourceFormulas: [
      "H_N=-J∑ᵢσᵢσᵢ₊₁-(μB/2)∑ᵢ(σᵢ+σᵢ₊₁)",
      "P=[[e^{β(J+μB)}, e^{-βJ}],[e^{-βJ}, e^{β(J-μB)}]]",
      "Z=tr(Pᴺ)=λ₁ᴺ+λ₂ᴺ",
      "λ1,2=e^{βJ}cosh(βμB)±{e^{-2βJ}+e^{2βJ}sinh²(βμB)}^{1/2}",
      "F=-kBT ln Z≈-NkBT lnλ1",
      "F=-NJ-NkBT ln[cosh(βμB)+{e^{-4βJ}+sinh²(βμB)}^{1/2}]",
      "M̄=Nμ sinh(βμB)/{e^{-4βJ}+sinh²(βμB)}^{1/2}",
      "lim_{B→0}M̄=0 for T>0",
    ],
    derivation: {
      id: "teacher-l06-s25-s27-ising-transfer-finite-field",
      title: "有限外场的一维 Ising：transfer matrix 本征值、自由能与磁化",
      kind: "推导结果",
      origin:
        "Lecture 6 slides 25–27：把每条键的 Boltzmann 权重组成 2×2 transfer matrix，并取热力学极限的最大本征值。",
      symbols: [
        { symbol: "$K=\\beta J$", meaning: "无量纲交换耦合" },
        { symbol: "$h=\\beta\\mu B$", meaning: "无量纲磁场；这里 μ 是单自旋磁矩，不是化学势" },
        { symbol: "$P$", meaning: "课件记号的 transfer matrix" },
        { symbol: "$\\lambda_+>\\lambda_-$", meaning: "有限 T 下的两本征值" },
      ],
      prerequisites: ["2×2 矩阵本征值", "trace", "热力学极限", "由自由能求磁化"],
      assumptions: ["一维近邻 Ising 链、周期边界", "J>0 ferromagnetic", "先固定 T>0 再取 N→∞；最大本征值非简并"],
      steps: [
        {
          title: "把每个自旋的场能平均分给相邻两键",
          formula: "$E(\\sigma_i,\\sigma_{i+1})=-J\\sigma_i\\sigma_{i+1}-\\dfrac{\\mu B}{2}(\\sigma_i+\\sigma_{i+1})$",
          explanation: "周期链中每个自旋出现在两条键上，分一半可避免磁场项双计数。",
        },
        {
          title: "列出 transfer matrix",
          formula: "$P_{\\sigma,\\sigma'}=e^{K\\sigma\\sigma'+\\frac{h}{2}(\\sigma+\\sigma')}=\\begin{pmatrix}e^{K+h}&e^{-K}\\\\e^{-K}&e^{K-h}\\end{pmatrix}$",
          explanation: "行列分别对应 σ,σ'=+1,−1；四个矩阵元逐一来自键能。",
        },
        {
          title: "由迹与行列式求本征值",
          formula: "$\\lambda_{\\pm}=e^K\\cosh h\\pm\\sqrt{e^{-2K}+e^{2K}\\sinh^2h}$",
          explanation: "使用 λ±=trP/2±√[(trP/2)²−detP]；这正是课件 slide 26 的结果。",
        },
        {
          title: "写出有限 N 配分函数",
          formula: "$Z_N=\\operatorname{tr}P^N=\\lambda_+^N+\\lambda_-^N=\\lambda_+^N\\left[1+(\\lambda_-/\\lambda_+)^N\\right]$",
          explanation: "周期边界对应矩阵乘积取迹；第二式把最大本征值贡献显式抽出。",
        },
        {
          title: "取热力学极限",
          formula: "$|\\lambda_-/\\lambda_+|<1,\\ T>0\\ \\Longrightarrow\\ F=-k_BT\\ln Z_N\\simeq-Nk_BT\\ln\\lambda_+$",
          explanation: "丢掉 λ− 只在 N→∞ 且本征值比严格小于 1 时成立。",
        },
        {
          title: "把 λ+ 整理成课件自由能",
          formula: "$F=-NJ-Nk_BTN\\ln\\!\\left[\\cosh h+\\sqrt{e^{-4K}+\\sinh^2h}\\right]$",
          explanation: "从 λ+ 提出 e^K，得到 −NkBTK=−NJ。",
        },
        {
          title: "对外场求导得到磁化",
          formula: "$\\bar M=-\\left(\\dfrac{\\partial F}{\\partial B}\\right)_T=N\\mu\\,\\dfrac{\\sinh h}{\\sqrt{e^{-4K}+\\sinh^2h}}$",
          explanation: "完整求导中看似复杂的项会约简；这里 μ 是磁矩参数。",
        },
        {
          title: "检查零场极限",
          formula: "$T>0:\\quad \\lim_{B\\to0}\\bar M=N\\mu\\dfrac{0}{e^{-2K}}=0$",
          explanation: "任何有限 T 下分母都非零，因此一维短程 Ising 没有有限温自发磁化；T=0 必须单独取极限。",
        },
      ],
      conclusion:
        "$\\lambda_+$ 控制热力学极限，给出课件的有限场 $F$ 与 $\\bar M$；对任意 $T>0$，$B\\to0$ 后磁化为零。",
      checks: ["B=0 时 λ+=2coshK", "J=0 时退化为 N 个独立顺磁自旋", "T=0 与 T→0+ 的极限次序不可混用"],
      evidence: [
        "课件 6 slide 25：键能、transfer matrix 与 Z=tr(P^N)",
        "课件 6 slide 26：λ1,2 与最大本征值自由能",
        "课件 6 slide 27：有限场 F、M̄ 及 T>0 的零场极限",
      ],
    },
  },
  {
    moduleId: "phase-transition",
    lecture: 6,
    slides: [28, 29],
    sourceTitle:
      "Spin correlation in the 1D Ising chain; Correlation length and absence of a 1D transition",
    sourceFormulas: [
      "g_k(r)=⟨σ_kσ_{k+r}⟩=tanh^r(βJ)",
      "∂ ln Z/∂(βJ_i)=⟨σ_iσ_{i+1}⟩",
      "g_k(r)=exp[r ln tanh(βJ)]=e^{-r/ξ}",
      "Source slide prints: ξ=1/ln cosh(βJ)",
      "Derived from preceding line: ξ=-1/ln tanh(βJ)",
    ],
    derivation: {
      id: "teacher-l06-s28-s29-ising-correlation-length",
      title: "一维 Ising 相关函数：从 bond derivative 到 tanhᴿK 与 ξ",
      kind: "推导结果",
      origin:
        "Lecture 6 slides 28–29：在 B=0 的一维链中，用键耦合导数与 transfer matrix 得到指数衰减，并纠正源页相关长度公式。",
      symbols: [
        { symbol: "$K_i=\\beta J_i$", meaning: "第 i 条键的无量纲耦合" },
        { symbol: "$g_k(r)$", meaning: "间隔 r 的二点自旋相关函数" },
        { symbol: "$\\xi$", meaning: "以格距为单位的 correlation length" },
      ],
      prerequisites: ["对数配分函数参数导数", "B=0 transfer matrix", "指数衰减"],
      assumptions: ["B=0", "ferromagnetic J>0", "T>0 且取热力学极限", "均匀耦合时 Ji=J"],
      steps: [
        {
          title: "先允许每条键有独立耦合",
          formula: "$Z(\\{K_i\\})=\\sum_{\\{\\sigma\\}}\\exp\\!\\left(\\sum_iK_i\\sigma_i\\sigma_{i+1}\\right)$",
          explanation: "把 Ki 当探针参数，求导就能选出指定键的 observable。",
        },
        {
          title: "对单条键求导",
          formula: "$\\dfrac{\\partial\\ln Z}{\\partial K_i}=\\dfrac{1}{Z}\\sum_{\\{\\sigma\\}}\\sigma_i\\sigma_{i+1}e^{\\sum_jK_j\\sigma_j\\sigma_{j+1}}=\\langle\\sigma_i\\sigma_{i+1}\\rangle$",
          explanation: "这里必须是 ∂lnZ，而不是 ∂Z；源页中间把 Z 与 Σln(...) 并列的写法有对数/量纲不一致。",
        },
        {
          title: "求最近邻相关",
          formula: "$B=0:\\quad \\lambda_+=2\\cosh K,\\qquad \\langle\\sigma_i\\sigma_{i+1}\\rangle=\\dfrac{\\partial\\ln\\lambda_+}{\\partial K}=\\tanh K$",
          explanation: "热力学极限 lnZ≈Nlnλ+；对均匀 K 的总导数再除以 N 得每条键的平均。",
        },
        {
          title: "把 r 条键串起来",
          formula: "$g_k(r)=\\langle\\sigma_k\\sigma_{k+r}\\rangle=\\left(\\dfrac{\\lambda_-}{\\lambda_+}\\right)^r=(\\tanh K)^r$",
          explanation: "B=0 时 λ−=2sinhK，所以本征值比为 tanhK；每多隔一格就多乘同一因子。",
        },
        {
          title: "与指数衰减定义比较",
          formula: "$(\\tanh K)^r=\\exp[r\\ln(\\tanh K)]\\equiv e^{-r/\\xi}$",
          explanation: "有限 T、J>0 时 0<tanhK<1，故 ln(tanhK)<0，指数确实衰减。",
        },
        {
          title: "解出正确相关长度",
          formula: "$\\boxed{\\xi^{-1}=-\\ln(\\tanh K)},\\qquad \\xi=-\\dfrac{1}{\\ln(\\tanh\\beta J)}$",
          explanation: "课件 slide 29 印成 ξ=1/ln cosh(βJ)，既不由上一行推出，也给出错误的温度行为；应明确标作源页笔误。",
        },
        {
          title: "检查低温极限",
          formula: "$K\\gg1:\\quad \\tanh K\\simeq1-2e^{-2K},\\qquad \\xi\\simeq\\dfrac{1}{2}e^{2K}$",
          explanation: "ξ 只在 T→0 时发散；任意有限 T 都有限，因此没有有限温临界点。",
        },
      ],
      conclusion:
        "$g_k(r)=(\\tanh\\beta J)^r=e^{-r/\\xi}$ 且 $\\xi^{-1}=-\\ln(\\tanh\\beta J)$；slide 29 的 $1/\\ln\\cosh(\\beta J)$ 是源课件笔误。",
      checks: ["T→∞ 时 tanhK→0，相关只剩 r=0", "T→0+ 时 ξ→∞", "ξ 必须为正，所以负号不能漏"],
      evidence: [
        "课件 6 slide 28：bond derivative 与 gk(r)=tanh^r(βJ)；中间行应使用 lnZ",
        "课件 6 slide 29：g=e^(−r/ξ)；源页 ξ=1/lncosh(βJ) 与上一行不一致，应为 ξ^−1=−lntanh(βJ)",
      ],
    },
  },
];
