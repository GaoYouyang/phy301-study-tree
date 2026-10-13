import type { TeacherFormulaLesson } from "./teacher-formula-types";

/**
 * Teacher-slide formula chains for Lectures 07–10 that are not already
 * represented by the main concept derivation registry.  The compact strings
 * in `sourceFormulas` are verbatim from the checked translation inventory;
 * the normalized LaTeX below supplies the algebra the slides elide.
 */
export const teacherFormulaLessons0710: TeacherFormulaLesson[] = [
  {
    moduleId: "quantum-bridge",
    lecture: 7,
    slides: [10],
    sourceTitle: "When quantum statistics is required",
    sourceFormulas: [
      "p²/(2m)≈3kBT/2",
      "p=h/λ",
      "λ=√[4π²ℏ²/(3mkBT)] (slide convention)",
      "a=n^{-1/3}",
      "quantum regime: a≲λ",
    ],
    derivation: {
      id: "teacher-l07-s10-wavepacket-overlap-criterion",
      title: "从热动量到波包重叠判据",
      kind: "模型",
      origin:
        "课件用热运动的均方根动量估计 de Broglie 波长，再把它与平均粒子间距比较。这给出量子简并的数量级判据；它不是严格相变边界，也不是课本最常用的热 de Broglie 波长定义。",
      symbols: [
        { symbol: "p", meaning: "用能均分估计的三维热动量大小" },
        { symbol: "m", meaning: "单粒子质量" },
        { symbol: "λ", meaning: "本页约定的 de Broglie 波长 h/p" },
        { symbol: "λT", meaning: "标准热波长 h/√(2πmkBT)" },
        { symbol: "a=n^{-1/3}", meaning: "三维数密度 n 对应的平均间距数量级" },
      ],
      prerequisites: ["三维二次动能的能均分", "de Broglie 关系", "数密度与平均间距"],
      assumptions: [
        "非相对论、三维、二次色散的稀薄气体",
        "用典型热动量作数量级估计，而非对完整 Maxwell 分布积分",
        "λ 与 a 的比较只精确到 O(1) 常数；真正的简并参数通常写成 nλT³",
      ],
      steps: [
        {
          title: "用三维能均分估计典型动量",
          formula: "$\\frac{p_{\\mathrm{th}}^2}{2m}\\simeq\\frac{3}{2}k_B T$",
          explanation:
            "三个平动二次自由度各给 kBT/2，所以这里的 pth 是热动量大小的均方根估计。",
        },
        {
          title: "解出热动量",
          formula: "$p_{\\mathrm{th}}\\simeq\\sqrt{3mk_B T}$",
          explanation:
            "两边乘 2m 后开平方；降温或减小质量都会降低典型动量。",
        },
        {
          title: "代入 de Broglie 关系",
          formula: "$\\lambda_{\\mathrm{slide}}=\\frac{h}{p_{\\mathrm{th}}}=\\frac{2\\pi\\hbar}{\\sqrt{3mk_B T}}=\\sqrt{\\frac{4\\pi^2\\hbar^2}{3mk_B T}}$",
          explanation:
            "这正是课件的 λ 约定。它随 T^{-1/2} 增长，所以低温更容易出现波包重叠。",
        },
        {
          title: "由每粒子占据的体积估计间距",
          formula: "$a^3\\sim\\frac{V}{N}=\\frac{1}{n}\\quad\\Longrightarrow\\quad a=n^{-1/3}$",
          explanation:
            "三维中每个粒子平均分到体积 1/n，其线性尺度就是 n^{-1/3}。",
        },
        {
          title: "把长度比较改写成无量纲参数",
          formula: "$a\\lesssim\\lambda_{\\mathrm{slide}}\\quad\\Longleftrightarrow\\quad n\\lambda_{\\mathrm{slide}}^3\\gtrsim1$",
          explanation:
            "波包尺度不小于粒子间距时，不可再给粒子贴上互不重叠的经典标签，交换统计会变得重要。",
        },
        {
          title: "与标准热波长对齐",
          formula: "$\\lambda_T=\\frac{h}{\\sqrt{2\\pi mk_B T}},\\qquad\\frac{\\lambda_{\\mathrm{slide}}}{\\lambda_T}=\\sqrt{\\frac{2\\pi}{3}}=O(1)$",
          explanation:
            "两种 λ 只差约定造成的 O(1) 因子；比较不同资料时必须先统一定义，不能把课件 λ 直接当成标准 λT。",
        },
      ],
      conclusion:
        "$n\\lambda^3=O(1)$ 标志量子波包开始显著重叠；用标准约定时通常写成 $n\\lambda_T^3\\gtrsim1$。",
      checks: [
        "nλ³ 必须无量纲。",
        "T 降低时 λ 增大，量子简并应更明显。",
        "若只改变热波长定义中的常数，判据只能移动 O(1) 因子，不能改变物理趋势。",
      ],
      evidence: [
        "课件 7 slide 10：p²/(2m)≈3kBT/2、p=h/λ、a=n^{-1/3} 与 a≲λ。",
        "课件 7 slide 10 翻译审校：不同教材的热波长定义含不同 2π 或 3 因子。",
      ],
    },
  },
  {
    moduleId: "quantum-bridge",
    lecture: 7,
    slides: [11, 14, 18],
    sourceTitle: "Von Neumann evolution of the density matrix",
    sourceFormulas: [
      "Source slide prints: -iℏ d|Ψ⟩/dt=H|Ψ⟩",
      "U(t,t₀)=exp[-iH(t-t₀)/ℏ]",
      "|Ψ(t)⟩=U(t,t₀)|Ψ(t₀)⟩",
      "U†U=I",
      "iℏ∂ρ/∂t=[H,ρ]",
      "[H,ρ]=Hρ-ρH",
      "ρ(t)=U(t)ρ(0)U†(t)",
    ],
    derivation: {
      id: "teacher-l07-s18-von-neumann-unitary-solution",
      title: "从 Schrödinger 方程到密度矩阵的幺正解",
      kind: "推导结果",
      origin:
        "冯诺依曼方程由 ket 与 bra 的 Schrödinger 演化逐项求导得到；对不显含时间的封闭系统，其解是 ρ(t)=Uρ(0)U†。课件 slide 11 左侧的 −iℏ 与 slide 14 的 U=e^{-iHt/ℏ} 不相容，标准 Schrödinger 方程左侧应为 +iℏ。",
      symbols: [
        { symbol: "ρ(t)", meaning: "密度算符" },
        { symbol: "H", meaning: "不显含时间的 Hermitian Hamiltonian" },
        { symbol: "U(t,t0)", meaning: "从 t0 到 t 的幺正演化算符" },
        { symbol: "[H,ρ]", meaning: "交换子 Hρ−ρH" },
      ],
      prerequisites: ["Schrödinger 方程", "bra–ket 伴随", "矩阵乘法的乘积法则", "矩阵指数"],
      assumptions: [
        "封闭系统作幺正演化",
        "H 与时间无关；若 H(t) 随时间变，应使用 time-ordered exponential",
        "ρ 可是纯态投影，也可是纯态投影的统计混合",
      ],
      steps: [
        {
          title: "先写正确符号的 ket 方程",
          formula: "$i\\hbar\\,\\partial_t|\\psi_\\alpha(t)\\rangle=H|\\psi_\\alpha(t)\\rangle$",
          explanation:
            "这是标准 Schrödinger 方程。课件 slide 11 打印的负号是勘误；它也会与后页的指数演化符号冲突。",
        },
        {
          title: "取 Hermitian conjugate 得到 bra 方程",
          formula: "$-i\\hbar\\,\\partial_t\\langle\\psi_\\alpha(t)|=\\langle\\psi_\\alpha(t)|H$",
          explanation:
            "复共轭使 i 变成 −i，并用 H†=H；因此 bra 的时间导数满足 ∂t⟨ψ|=(i/ℏ)⟨ψ|H。",
        },
        {
          title: "对一个纯态投影使用乘积法则",
          formula: "$\\partial_t(|\\psi_\\alpha\\rangle\\langle\\psi_\\alpha|)=-\\frac{i}{\\hbar}H|\\psi_\\alpha\\rangle\\langle\\psi_\\alpha|+\\frac{i}{\\hbar}|\\psi_\\alpha\\rangle\\langle\\psi_\\alpha|H$",
          explanation:
            "第一项来自 ket，第二项来自 bra；两个符号不同，正好组合成交换子。",
        },
        {
          title: "对统计混合求和",
          formula: "$\\rho=\\sum_\\alpha p_\\alpha|\\psi_\\alpha\\rangle\\langle\\psi_\\alpha|\\quad\\Longrightarrow\\quad i\\hbar\\,\\partial_t\\rho=H\\rho-\\rho H=[H,\\rho]$",
          explanation:
            "封闭演化中制备概率 pα 不随时间变化，所以可直接把每个投影的方程按 pα 相加。",
        },
        {
          title: "解出 ket 的演化算符",
          formula: "$U(t,t_0)=\\exp[-iH(t-t_0)/\\hbar],\\qquad|\\psi(t)\\rangle=U(t,t_0)|\\psi(t_0)\\rangle$",
          explanation:
            "H 与时间无关时，这是一阶常系数线性方程的矩阵指数解。",
        },
        {
          title: "把 ket 与 bra 的解代回密度算符",
          formula: "$\\rho(t)=U(t,t_0)\\rho(t_0)U^\\dagger(t,t_0)$",
          explanation:
            "每个 ket 左乘 U、每个 bra 右乘 U†；线性相加后仍是同一形式。",
        },
        {
          title: "验证它确实保持概率结构",
          formula: "$U^\\dagger U=I,\\qquad\\operatorname{tr}\\rho(t)=\\operatorname{tr}[U\\rho(0)U^\\dagger]=\\operatorname{tr}\\rho(0)$",
          explanation:
            "幺正性保持迹、本征值、正性与纯度；所以演化不会凭空创造或丢失总概率。",
        },
      ],
      conclusion:
        "$i\\hbar\\,\\partial_t\\rho=[H,\\rho]$ 且 $\\rho(t)=U(t,t_0)\\rho(t_0)U^\\dagger(t,t_0)$；课件 slide 11 的 Schrödinger 负号应改为正号。",
      checks: [
        "把 ρ(t) 对 t 求导，应回到 −(i/ℏ)[H,ρ]。",
        "若 [H,ρ(0)]=0，则 ρ(t)=ρ(0)。",
        "演化前后 trρ 必须相同。",
      ],
      evidence: [
        "课件 7 slide 11：源页打印 −iℏd|Ψ⟩/dt=H|Ψ⟩；翻译审校明确标注与标准式及后页不一致。",
        "课件 7 slide 14：U(t,t₀)=exp[-iH(t-t₀)/ℏ]、U†U=I。",
        "课件 7 slide 18：iℏ∂ρ/∂t=[H,ρ] 与 ρ(t)=U(t)ρ(0)U†(t)。",
      ],
    },
  },
  {
    moduleId: "quantum-statistics",
    lecture: 8,
    slides: [3],
    sourceTitle: "N-particle symmetry and the Pauli principle",
    sourceFormulas: [
      "Ψ_B(…,i,…,j,…)=+Ψ_B(…,j,…,i,…)",
      "Ψ_F(…,i,…,j,…)=-Ψ_F(…,j,…,i,…)",
      "fermion occupation n_i=0 or 1",
    ],
    derivation: {
      id: "teacher-l08-s03-antisymmetry-to-pauli-exclusion",
      title: "反对称性为什么强制 Pauli 不相容",
      kind: "推导结果",
      origin:
        "Pauli 不相容不是额外的计数技巧；对普通三维相同费米子，它直接来自多体波函数在交换任意两粒子时反对称。反对称性本身是相同费米子的量子统计公设。",
      symbols: [
        { symbol: "ΨF", meaning: "相同费米子的多体波函数" },
        { symbol: "φr", meaning: "包含空间、自旋等全部量子数的单粒子态" },
        { symbol: "ni", meaning: "第 i 个单粒子态的占据数" },
        { symbol: "Pij", meaning: "交换粒子 i 与 j 的算符" },
      ],
      prerequisites: ["相同粒子的交换", "多体波函数", "行列式交换两行变号"],
      assumptions: [
        "讨论普通三维非相对论相同费米子",
        "所谓同一单粒子态包含所有量子数；同一空间轨道的不同自旋是不同单粒子态",
      ],
      steps: [
        {
          title: "采用费米交换反对称公设",
          formula: "$P_{ij}\\Psi_F(\\ldots,i,\\ldots,j,\\ldots)=-\\Psi_F(\\ldots,i,\\ldots,j,\\ldots)$",
          explanation:
            "交换任意两名相同费米子的全部标签，多体概率幅必须变号。",
        },
        {
          title: "先看两个不同单粒子态",
          formula: "$\\Psi_F(1,2)=\\frac{1}{\\sqrt2}[\\phi_a(1)\\phi_b(2)-\\phi_b(1)\\phi_a(2)]$",
          explanation:
            "减号使交换 1↔2 后波函数整体变号；这就是二粒子 Slater determinant。",
        },
        {
          title: "令两粒子企图占同一完整单粒子态",
          formula: "$\\phi_a=\\phi_b=\\phi_i$",
          explanation:
            "这里的“同一”不仅指能量相同，而是空间、动量、自旋等全部量子数都相同。",
        },
        {
          title: "两个排列逐点完全抵消",
          formula: "$\\Psi_F(1,2)=\\frac{1}{\\sqrt2}[\\phi_i(1)\\phi_i(2)-\\phi_i(1)\\phi_i(2)]=0$",
          explanation:
            "零波函数意味着这一配置在任何位置的概率都为零，因此物理上不能出现。",
        },
        {
          title: "推广到 N 粒子 determinant",
          formula: "$\\Psi_F=\\frac{1}{\\sqrt{N!}}\\det[\\phi_r(j)]$",
          explanation:
            "若两个粒子占同一单粒子态，determinant 中两行或两列相同，行列式必为零。",
        },
        {
          title: "翻译成占据数语言",
          formula: "$n_i\\in\\{0,1\\}$",
          explanation:
            "每个完整单粒子态最多放一个相同费米子；若能级有简并 gi，则整个能级仍可容纳 gi 个。",
        },
      ],
      conclusion:
        "$\\Psi_F$ 的交换反对称性使重复占据的 Slater determinant 为零，因此每个完整单粒子态满足 $n_i=0$ 或 $1$。",
      checks: [
        "交换两粒子后，写出的 ΨF 必须只差一个负号。",
        "令 φa=φb 后，波函数必须逐点为零。",
        "不要把“单粒子态最多一个”误写成“有简并的整个能级最多一个”。",
      ],
      evidence: [
        "课件 8 slide 3：N-particle symmetry and the Pauli principle。",
        "课件 8 slide 3 翻译审校：不同自旋仍可算不同单粒子态。",
      ],
    },
  },
  {
    moduleId: "bose-gas",
    lecture: 9,
    slides: [12],
    sourceTitle: "Atomic Bose gas in a harmonic optical trap",
    sourceFormulas: [
      "V(r)=½m(ω₁²x²+ω₂²y²+ω₃²z²)",
      "ε_{l₁,l₂,l₃}=ℏω₁l₁+ℏω₂l₂+ℏω₃l₃+½ℏ(ω₁+ω₂+ω₃)",
      "Π(μ,T)=-(kBT)⁴/[2(ℏω₀)³]∫₀^∞x²ln(1-e^{-x}e^{βμ})dx=(kBT)⁴g₄(z)/(ℏω₀)³",
      "N(μ,T)=(∂Π/∂μ)_T=(kBT/ℏω₀)³g₃(z)",
      "kBT_c/(ℏω₀)=[N/ζ(3)]^{1/3}",
      "a_α=√(ℏ/(mω_α))",
      "a_thermal=√(kBT/(mω_α²))=a_α√(kBT/(ℏω_α))",
    ],
    derivation: {
      id: "teacher-l09-s12-harmonic-trap-bose-chain",
      title: "各向异性谐振子能谱、DOS、grand potential 与 trapped BEC",
      kind: "近似",
      origin:
        "对三维各向异性 harmonic trap，先数能量四面体中的格点得到 semiclassical density of states，再计算 grand potential 与粒子数。课件用 Π 表示 conventional grand potential ΦG 的负值，即 Π=−ΦG；因此 N=(∂Π/∂μ)T 的正号是自洽的。",
      symbols: [
        { symbol: "ω1,ω2,ω3", meaning: "三个主轴方向的 trap angular frequencies" },
        { symbol: "ω0=(ω1ω2ω3)^{1/3}", meaning: "几何平均 trap frequency" },
        { symbol: "ε0", meaning: "零点能 ℏ(ω1+ω2+ω3)/2" },
        { symbol: "z", meaning: "相对基态能量计量的 fugacity e^{β(μ−ε0)}" },
        { symbol: "Π=−ΦG", meaning: "课件的正 pressure-like potential，等于 conventional grand potential 的负值" },
      ],
      prerequisites: ["一维量子谐振子能谱", "三维格点计数", "Bose grand potential", "Bose function"],
      assumptions: [
        "理想 Bose 气体位于三维各向异性 harmonic trap",
        "semiclassical/large-N 极限 kBT≫ℏωα，以连续 DOS 近似大量激发态",
        "能量零点可移到 ε0；若不移，fugacity 应写 e^{β(μ−ε0)}",
        "凝聚点取 z→1，且忽略有限尺寸与相互作用修正",
      ],
      steps: [
        {
          title: "分离三个一维谐振子",
          formula: "$\\varepsilon_{l_1l_2l_3}=\\sum_{\\alpha=1}^3\\hbar\\omega_\\alpha l_\\alpha+\\varepsilon_0,\\qquad\\varepsilon_0=\\frac{\\hbar}{2}(\\omega_1+\\omega_2+\\omega_3)$",
          explanation:
            "势能在三个主轴方向相加，Hamiltonian 可分离，因此总能量是三个 occupation energies 与零点能之和。",
        },
        {
          title: "把零点能移入 chemical potential",
          formula: "$E\\equiv\\varepsilon-\\varepsilon_0=\\sum_\\alpha\\hbar\\omega_\\alpha l_\\alpha,\\qquad z=e^{\\beta(\\mu-\\varepsilon_0)}$",
          explanation:
            "这样激发能 E 从 0 开始，BEC 极限仍写 z→1；课件等价地把零点能吸收到 μ 的定义。",
        },
        {
          title: "数能量 E 以下的非负格点",
          formula: "$\\mathcal N(E)\\simeq\\frac{E^3}{6\\hbar^3\\omega_1\\omega_2\\omega_3}$",
          explanation:
            "第一卦限中 Σℏωαlα≤E 是一个三维四面体，其体积给大量格点的 leading count。",
        },
        {
          title: "对累计态数求导得到 DOS",
          formula: "$g(E)=\\frac{d\\mathcal N}{dE}=\\frac{E^2}{2(\\hbar\\omega_0)^3},\\qquad\\omega_0=(\\omega_1\\omega_2\\omega_3)^{1/3}$",
          explanation:
            "各向异性只通过频率乘积进入 leading DOS；这使 trapped gas 的 DOS 从均匀气体 ε^{1/2} 变成 E²。",
        },
        {
          title: "写 conventional grand potential",
          formula: "$\\Phi_G=k_B T\\int_0^\\infty g(E)\\ln(1-ze^{-\\beta E})\\,dE$",
          explanation:
            "Bose 每态 grand factor 是 (1−ze^{-βE})^{-1}，所以 ΦG=−kBTlnQ=kBTΣln(1−ze^{-βE})，本身为负。",
        },
        {
          title: "换元并计算 logarithmic integral",
          formula: "$\\int_0^\\infty x^2\\ln(1-ze^{-x})\\,dx=-2g_4(z)\\quad\\Longrightarrow\\quad\\Phi_G=-\\frac{(k_B T)^4}{(\\hbar\\omega_0)^3}g_4(z)$",
          explanation:
            "展开 ln(1−q)=−Σq^l/l，再用 ∫x²e^{-lx}dx=2/l³，产生 g4。",
        },
        {
          title: "翻译课件的 Π convention",
          formula: "$\\Pi\\equiv-\\Phi_G=\\frac{(k_B T)^4}{(\\hbar\\omega_0)^3}g_4(z)$",
          explanation:
            "课件写 Π 为正；它不是 conventional ΦG 本身，而是 −ΦG。保留这个勘误可避免后续 N 导数符号混乱。",
        },
        {
          title: "对 μ 求导得到激发态粒子数",
          formula: "$N_{ex}=\\left(\\frac{\\partial\\Pi}{\\partial\\mu}\\right)_T=\\left(\\frac{k_B T}{\\hbar\\omega_0}\\right)^3g_3(z)$",
          explanation:
            "利用 ∂μz=βz 与 z∂zg4=g3；在凝聚点 z→1，激发态容量饱和。",
        },
        {
          title: "令激发态容量等于总粒子数",
          formula: "$N=\\left(\\frac{k_B T_c}{\\hbar\\omega_0}\\right)^3\\zeta(3)\\quad\\Longrightarrow\\quad\\frac{k_B T_c}{\\hbar\\omega_0}=\\left[\\frac{N}{\\zeta(3)}\\right]^{1/3}$",
          explanation:
            "trapped BEC 的 Tc∝N^{1/3}ω0，与均匀盒中的 n^{2/3} 标度不同。",
        },
        {
          title: "比较 ground-state 与 thermal cloud 长度",
          formula: "$a_\\alpha=\\sqrt{\\frac{\\hbar}{m\\omega_\\alpha}},\\qquad a_{\\mathrm{thermal}}=\\sqrt{\\frac{k_B T}{m\\omega_\\alpha^2}}=a_\\alpha\\sqrt{\\frac{k_B T}{\\hbar\\omega_\\alpha}}$",
          explanation:
            "前者由量子零点运动决定，后者由 mωα²r²/2∼kBT 的经典热尺度决定。",
        },
      ],
      conclusion:
        "$g(E)=E^2/[2(\\hbar\\omega_0)^3]$ 导出 $\\Pi=-\\Phi_G=(k_BT)^4g_4(z)/(\\hbar\\omega_0)^3$ 与 $k_BT_c/(\\hbar\\omega_0)=[N/\\zeta(3)]^{1/3}$。",
      checks: [
        "DOS 的单位应为 1/energy。",
        "Π 必须是 energy，且课件 convention 下 N=(∂Π/∂μ)T 为正。",
        "各向同性 ω1=ω2=ω3=ω 时应有 ω0=ω。",
      ],
      evidence: [
        "课件 9 slide 12：trap potential、spectrum、Π、N、Tc 与两种长度。",
        "课件 9 slide 12 公式 convention：Π 的显示式为正，物理上对应 −ΦG。",
      ],
    },
  },
  {
    moduleId: "bose-gas",
    lecture: 9,
    slides: [14],
    sourceTitle: "Blackbody photons",
    sourceFormulas: [
      "ε=pc=ℏω",
      "μ_photon=0",
      "n̄_ω=1/(e^{βℏω}-1)",
      "U/V=σT⁴",
      "σ=π²kB⁴/[15(ℏc)³] (slide definition)",
      "Planck spectrum peak label: x≈2.8214",
    ],
    derivation: {
      id: "teacher-l09-s14-planck-frequency-peak",
      title: "Planck 频谱峰值方程与 T⁴ 能量密度",
      kind: "推导结果",
      origin:
        "光子数不守恒，所以 μ=0。把两个偏振的三维 photon DOS 与 Bose occupation 相乘，得到每 angular-frequency 的 Planck energy spectrum；对无量纲函数 x³/(eˣ−1) 求极值给 x≈2.8214。课件的 σ 是 energy-density coefficient，不是辐射通量的 Stefan–Boltzmann constant。",
      symbols: [
        { symbol: "ω", meaning: "angular frequency" },
        { symbol: "x=ℏω/(kBT)", meaning: "无量纲频率" },
        { symbol: "uω", meaning: "每单位 angular frequency、每单位体积的能量" },
        { symbol: "σslide", meaning: "课件定义的 U/(VT⁴) 系数" },
      ],
      prerequisites: ["三维 photon density of states", "Bose occupation", "一元函数极值", "Bose integral"],
      assumptions: [
        "平衡黑体腔、自由光子、两个横向偏振",
        "光子数不守恒，因此 μphoton=0",
        "x≈2.8214 是按 angular-frequency spectrum uω 的峰；按 wavelength 作图峰值不同",
      ],
      steps: [
        {
          title: "数出两个偏振的 photon DOS",
          formula: "$\\frac{g(\\omega)}{V}=\\frac{\\omega^2}{\\pi^2c^3}$",
          explanation:
            "三维 k-space shell 给 4πk²dk，除以 (2π)³ 并乘两个偏振，再用 ω=ck。",
        },
        {
          title: "乘每模式能量与 Bose occupation",
          formula: "$u_\\omega(T)=\\frac{\\hbar\\omega^3}{\\pi^2c^3}\\frac{1}{e^{\\beta\\hbar\\omega}-1}$",
          explanation:
            "每个光子能量为 ℏω，平均 occupation 为 1/(e^{βℏω}−1)。",
        },
        {
          title: "把峰值问题无量纲化",
          formula: "$x=\\frac{\\hbar\\omega}{k_B T},\\qquad u_\\omega\\propto f(x)=\\frac{x^3}{e^x-1}$",
          explanation:
            "所有 T 依赖只缩放横轴与整体高度；峰的位置由同一个 f(x) 决定。",
        },
        {
          title: "对 f(x) 求导",
          formula: "$f'(x)=\\frac{x^2[3(e^x-1)-xe^x]}{(e^x-1)^2}$",
          explanation:
            "除 x=0 的边界外，内部峰由方括号为零决定。",
        },
        {
          title: "得到 transcendental peak equation",
          formula: "$3(e^x-1)-xe^x=0\\quad\\Longleftrightarrow\\quad x=3(1-e^{-x})$",
          explanation:
            "该方程没有初等闭式解，数值迭代得到正的非零根。",
        },
        {
          title: "读出课件标注的频率峰",
          formula: "$x_{\\mathrm{peak}}=2.821439\\ldots,\\qquad\\hbar\\omega_{\\mathrm{peak}}=2.821439\\ldots\\,k_B T$",
          explanation:
            "这是 uω 的峰，不是 uλ 的 Wien constant；变换谱密度时 Jacobian 会移动峰位。",
        },
        {
          title: "积分整个 spectrum",
          formula: "$\\frac{U}{V}=\\frac{(k_B T)^4}{\\pi^2\\hbar^3c^3}\\int_0^\\infty\\frac{x^3}{e^x-1}dx=\\frac{\\pi^2k_B^4}{15(\\hbar c)^3}T^4$",
          explanation:
            "使用 ∫x³/(eˣ−1)dx=π⁴/15，得到 T⁴ law。",
        },
        {
          title: "区分 energy density 与 emitted flux constant",
          formula: "$u=\\sigma_{\\mathrm{slide}}T^4,\\quad\\sigma_{\\mathrm{slide}}=\\frac{\\pi^2k_B^4}{15(\\hbar c)^3};\\qquad j^*=\\frac{c}{4}u$",
          explanation:
            "课件 σslide 乘 T⁴ 得能量密度；通常命名的 Stefan–Boltzmann flux constant 还要乘 c/4。",
        },
      ],
      conclusion:
        "$u_\\omega\\propto x^3/(e^x-1)$ 的峰满足 $x=3(1-e^{-x})$，故 $x=2.821439\\ldots$；积分给 $U/V=\\sigma_{slide}T^4$，其中课件 σ 是能量密度系数。",
      checks: [
        "x 必须无量纲，ωpeak 应与 T 成正比。",
        "低频 uω∝ω²，高频指数衰减，所以确有有限峰。",
        "energy-density coefficient 与 flux constant 的单位相差一个速度因子。",
      ],
      evidence: [
        "课件 9 slide 14：μphoton=0、Planck occupation、T⁴ law 与 x≈2.8214。",
        "课件 9 slide 14 翻译审校：本页 σ 是 energy-density coefficient，不是辐射通量常数。",
      ],
    },
  },
  {
    moduleId: "bose-gas",
    lecture: 9,
    slides: [15, 16],
    sourceTitle: "Debye energy and heat-capacity limits",
    sourceFormulas: [
      "∫₀^{ωD}g(ω)dω=3N",
      "ω_D=(6π²n)^{1/3}c",
      "g(ω)=3Vω²/(2π²c³), 0≤ω≤ω_D",
      "U=∫₀^{ωD}dω g(ω)ℏω/(e^{βℏω}-1)",
      "kBT_D=ℏω_D, u=T_D/T",
      "U/N=3kBT D(u)",
      "D(u)=3/u³∫₀^u t³/(e^t-1)dt",
      "T≫T_D: C_V→3NkB",
      "T≪T_D: C_V∝T³",
    ],
    derivation: {
      id: "teacher-l09-s16-debye-d3-normalization",
      title: "Debye 截止、D3(u) 归一化与两端热容",
      kind: "模型",
      origin:
        "Debye 模型把三条 acoustic branches 近似为相同声速的线性色散，并用总模式数 3N 固定 cutoff。把 DOS 写成由 ωD 与 N 归一的形式后，能量自然整理成 U/N=3kBTD3(TD/T)，从而同时得到 Dulong–Petit 与低温 T³ law。",
      symbols: [
        { symbol: "g(ω)", meaning: "含三条声学极化的 phonon density of states" },
        { symbol: "ωD,TD", meaning: "Debye cutoff frequency 与 temperature，kBTD=ℏωD" },
        { symbol: "u=TD/T", meaning: "Debye function 的无量纲上限" },
        { symbol: "D3(u)", meaning: "三维 Debye function；课件简记 D(u)" },
      ],
      prerequisites: ["三维线性色散 DOS", "Bose occupation with μ=0", "无量纲换元", "标准 Bose integral"],
      assumptions: [
        "三维晶体、三条 acoustic branches，课件简化为同一声速 c",
        "线性色散 ω=ck 只延伸到由 3N 模式数确定的 Debye cutoff",
        "忽略 optical branches 与真实 Brillouin-zone geometry",
      ],
      steps: [
        {
          title: "写三条极化的低频 DOS",
          formula: "$g(\\omega)=\\frac{3V\\omega^2}{2\\pi^2c^3},\\qquad0\\le\\omega\\le\\omega_D$",
          explanation:
            "每条线性色散 branch 的三维壳层数正比于 ω²；前面的 3 计入三个方向。",
        },
        {
          title: "用总模式数固定 cutoff",
          formula: "$3N=\\int_0^{\\omega_D}g(\\omega)d\\omega=\\frac{V\\omega_D^3}{2\\pi^2c^3}$",
          explanation:
            "晶格共有 3N 个振动自由度，Debye sphere 必须包含同样多的 modes。",
        },
        {
          title: "解出 Debye frequency",
          formula: "$\\omega_D^3=6\\pi^2\\frac{N}{V}c^3\\quad\\Longrightarrow\\quad\\omega_D=(6\\pi^2n)^{1/3}c$",
          explanation:
            "n=N/V；cutoff 随 number density 的立方根与声速线性增长。",
        },
        {
          title: "把 DOS 改写成显式归一形式",
          formula: "$g(\\omega)=\\frac{9N}{\\omega_D^3}\\omega^2$",
          explanation:
            "代入 ωD³ 的归一条件后，积分 0→ωD 立即给 3N，便于追踪所有数值因子。",
        },
        {
          title: "写 thermal phonon energy",
          formula: "$U=\\int_0^{\\omega_D}g(\\omega)\\frac{\\hbar\\omega}{e^{\\beta\\hbar\\omega}-1}d\\omega$",
          explanation:
            "不含与热容无关的零点能；phonon 数不守恒，所以 μ=0。",
        },
        {
          title: "以 t=βℏω 换元",
          formula: "$U=9Nk_B T\\left(\\frac{T}{T_D}\\right)^3\\int_0^{T_D/T}\\frac{t^3}{e^t-1}dt$",
          explanation:
            "用 ℏωD=kBTD；所有材料参数被压进 TD。",
        },
        {
          title: "定义归一化 Debye function",
          formula: "$D_3(u)=\\frac{3}{u^3}\\int_0^u\\frac{t^3}{e^t-1}dt,\\qquad u=\\frac{T_D}{T}$",
          explanation:
            "系数 3/u³ 被选择为高温极限 D3(0)=1。",
        },
        {
          title: "恢复课件的紧凑能量式",
          formula: "$\\frac{U}{N}=3k_B T D_3(u)$",
          explanation:
            "把上一步定义乘回即可；这也核对了 DOS 的 3 与 Debye function 的 3 没有重复或遗漏。",
        },
        {
          title: "取高温极限",
          formula: "$u\\ll1:\quad\\frac{t^3}{e^t-1}\\simeq t^2,\\quad D_3(u)\\to1,\\quad C_V\\to3Nk_B$",
          explanation:
            "每个谐振模式回到 classical equipartition，得到 Dulong–Petit law。",
        },
        {
          title: "取低温极限",
          formula: "$u\\gg1:\quad D_3(u)\\simeq\\frac{\\pi^4}{5u^3},\\quad C_V\\simeq\\frac{12\\pi^4}{5}Nk_B\\left(\\frac{T}{T_D}\\right)^3$",
          explanation:
            "把上限延到 ∞ 并用 ∫t³/(e^t−1)dt=π⁴/15；U∝T⁴，所以 CV∝T³。",
        },
      ],
      conclusion:
        "$D_3(u)=3u^{-3}\\int_0^u t^3/(e^t-1)dt$ 的归一化保证 $U/N=3k_BTD_3$、高温 $C_V\\to3Nk_B$、低温 $C_V\\sim(12\\pi^4/5)Nk_B(T/T_D)^3$。",
      checks: [
        "∫0^{ωD}g(ω)dω 必须严格为 3N。",
        "D3(u→0) 应趋于 1，而不是 3。",
        "低温 CV 的量纲是 NkB，剩余因子只依赖无量纲 T/TD。",
      ],
      evidence: [
        "课件 9 slide 15：g(ω)、3N normalization 与 ωD。",
        "课件 9 slide 16：U/N=3kBTD(u) 及 high/low-T heat-capacity limits。",
      ],
    },
  },
  {
    moduleId: "quantum-statistics",
    lecture: 9,
    slides: [3, 20],
    sourceTitle: "Bose functions and equation of state",
    sourceFormulas: [
      "g_ν(z)=1/Γ(ν)∫₀∞x^{ν-1}/(z^{-1}e^x-1)dx=∑_{l=1}∞z^l/l^ν",
      "f_ν(z)=1/Γ(ν)∫₀∞x^{ν-1}/(z^{-1}e^x+1)dx=∑_{l=1}∞(-1)^{l+1}z^l/l^ν",
    ],
    derivation: {
      id: "teacher-l09-s03-bose-fermi-integral-series",
      title: "Bose/Fermi 积分如何变成 fugacity 级数",
      kind: "恒等式",
      origin:
        "把 Bose 或 Fermi 分母展开成指数级数，再逐项用 Gamma integral 积分，就得到课件的 gν 与 fν 级数。逐项展开只在相应收敛域内直接合法；特别是退化 Fermi 气体 z>1 时，积分仍有意义，但显示的 z 幂级数必须理解为 analytic continuation，不能数值逐项相加。",
      symbols: [
        { symbol: "z=e^{βμ}", meaning: "fugacity" },
        { symbol: "ν", meaning: "由维度、色散和所算热力学量决定的积分指标" },
        { symbol: "Γ(ν)", meaning: "Gamma function" },
        { symbol: "gν,fν", meaning: "Bose 与 Fermi integral functions" },
      ],
      prerequisites: ["几何级数", "Gamma integral", "交换求和与积分的收敛条件"],
      assumptions: [
        "ν>0 使 x=0 附近的基本积分可讨论；Bose 在 z=1 还需要 ν>1",
        "Bose 的直接级数推导取 0≤z<1；z=1 由极限得到 ζ(ν)",
        "Fermi 的 fugacity 幂级数直接收敛于 |z|≤1 的适当边界；z>1 用积分定义或 analytic continuation，而非发散级数",
      ],
      steps: [
        {
          title: "把 Bose 分母写成几何级数",
          formula: "$\\frac{1}{z^{-1}e^x-1}=\\frac{ze^{-x}}{1-ze^{-x}}=\\sum_{l=1}^{\\infty}z^l e^{-lx}$",
          explanation:
            "当 |ze^{-x}|<1 时使用 1/(1-y)=Σy^l；对所有 x≥0 统一成立需要 z<1。",
        },
        {
          title: "逐项代入 Bose integral",
          formula: "$g_\\nu(z)=\\frac{1}{\\Gamma(\\nu)}\\sum_{l=1}^{\\infty}z^l\\int_0^\\infty x^{\\nu-1}e^{-lx}\\,dx$",
          explanation:
            "非负项情形可用 monotone convergence；一般复 z 则需要 absolute convergence 来交换积分与求和。",
        },
        {
          title: "缩放积分变量",
          formula: "$\\int_0^\\infty x^{\\nu-1}e^{-lx}\\,dx=l^{-\\nu}\\Gamma(\\nu)$",
          explanation:
            "令 u=lx，就有 x^{ν−1}dx=u^{ν−1}du/l^ν。",
        },
        {
          title: "得到 Bose 级数并检查 z=1",
          formula: "$g_\\nu(z)=\\sum_{l=1}^{\\infty}\\frac{z^l}{l^\\nu},\\qquad g_\\nu(1)=\\zeta(\\nu)\\;\\text{only for }\\nu>1$",
          explanation:
            "z=1 时小 x 行为约为 x^{ν−2}，只有 ν>1 才可积；这正是 BEC 容量判据的数学核心。",
        },
        {
          title: "对 Fermi 分母作交替展开",
          formula: "$\\frac{1}{z^{-1}e^x+1}=\\frac{ze^{-x}}{1+ze^{-x}}=\\sum_{l=1}^{\\infty}(-1)^{l+1}z^l e^{-lx}$",
          explanation:
            "使用 1/(1+y)=Σ(−1)^k y^k；直接幂级数推导要求 |ze^{-x}|<1。",
        },
        {
          title: "复用同一个 Gamma integral",
          formula: "$f_\\nu(z)=\\sum_{l=1}^{\\infty}(-1)^{l+1}\\frac{z^l}{l^\\nu}$",
          explanation:
            "每一项的积分仍给 Γ(ν)/l^ν，唯一差异是 Fermi 的交替符号。",
        },
        {
          title: "标清退化 Fermi 区的使用方式",
          formula: "$z>1:\quad f_\\nu(z)\\equiv\\frac{1}{\\Gamma(\\nu)}\\int_0^\\infty\\frac{x^{\\nu-1}}{z^{-1}e^x+1}\\,dx\\neq\\text{termwise sum of a convergent }z\\text{-series}$",
          explanation:
            "低温 Fermi 气体通常 z≫1；此时用积分、Sommerfeld 展开或 polylog 的 analytic continuation，不能硬加发散 fugacity series。",
        },
      ],
      conclusion:
        "$g_\\nu(z)=\\sum_{l\\ge1}z^l/l^\\nu$，$f_\\nu(z)=\\sum_{l\\ge1}(-1)^{l+1}z^l/l^\\nu$；前者在 $z=1$ 需 $\\nu>1$，后者在 $z>1$ 必须转用积分定义或解析延拓。",
      checks: [
        "z≪1 时 gν(z) 与 fν(z) 都应以 z 开头，回到经典极限。",
        "Bose 的第二项为 +z²/2^ν，Fermi 的第二项为 −z²/2^ν。",
        "对 z>1 直接逐项相加 Fermi fugacity series 若不收敛，不能误判为物理积分发散。",
      ],
      evidence: [
        "课件 9 slide 3：g_ν(z) 的 integral–series identity。",
        "课件 9 slide 20：f_ν(z) 的 alternating integral–series identity。",
      ],
    },
  },
  {
    moduleId: "quantum-statistics",
    lecture: 9,
    slides: [4, 5, 22],
    sourceTitle: "High-temperature virial expansion of the Bose gas",
    sourceFormulas: [
      "Pv/(kBT)=∑_{l=1}^∞a_l(λ³/v)^{l-1}",
      "a₁=1",
      "a₂=-1/(4√2)=-0.17678",
      "C_V/(NkB)=(3/2)∑_{l=1}^∞[(5-3l)/2]a_l(λ³/v)^{l-1}",
      "C_V/(NkB)=(3/2)[1+0.0884(λ³/v)+0.0066(λ³/v)²+0.0004(λ³/v)³+…]",
      "PV/(NkBT)=∑_{l=1}^∞(-1)^{l-1}a_l(λ³/(gv))^{l-1}",
      "C_V=(3/2)NkB∑_{l=1}^∞(-1)^{l-1}[(5-3l)/2]a_l(λ³/(gv))^{l-1}",
      "C_V=(3/2)NkB[1-0.0884(λ³/(gv))+0.0066(λ³/(gv))²-0.0004(λ³/(gv))³+…]",
      "U=(3/2)kBT(V/λ³)g_{5/2}(z)",
      "P=(2/3)(U/V)",
    ],
    derivation: {
      id: "teacher-l09-s04-quantum-virial-heat-capacity",
      title: "Bose/Fermi 交换修正怎样传到 virial equation 与 CV",
      kind: "近似",
      origin:
        "在低 phase-space density y=nλ³/g≪1 时展开 n(z) 与 P(z)，反解 fugacity 并消去 z。Bose 与 Fermi 的首个修正符号相反；再用二次色散的 U=3PV/2，并在固定 N、V 下对 λ³∝T^{-3/2} 求导，得到课件的热容符号。",
      symbols: [
        { symbol: "v=V/N=1/n", meaning: "每粒子体积" },
        { symbol: "g", meaning: "内部简并度；Bose 课件式采用 g=1" },
        { symbol: "λ", meaning: "热 de Broglie 波长" },
        { symbol: "y=nλ³/g", meaning: "小的量子简并展开参数" },
        { symbol: "s", meaning: "统计符号：Fermi s=+1，Bose s=−1" },
      ],
      prerequisites: ["Bose/Fermi fugacity expansion", "级数反演", "U=3PV/2", "固定体积热容"],
      assumptions: [
        "三维均匀理想量子气体、二次色散",
        "y=nλ³/g≪1，保留首个交换修正；课件显示的更高阶项同样是渐近 virial series",
        "计算 CV 时固定 N、V，不固定 z；因此 y∝T^{-3/2}",
      ],
      steps: [
        {
          title: "展开数密度与压力的 fugacity series",
          formula: "$\\frac{n\\lambda^3}{g}=z-s\\frac{z^2}{2^{3/2}}+O(z^3),\\qquad\\frac{P\\lambda^3}{gk_B T}=z-s\\frac{z^2}{2^{5/2}}+O(z^3)$",
          explanation:
            "Fermi 的级数交替，对应 s=+1；Bose 全为正，对应 s=−1。这里故意让一个 s 同时控制两式。",
        },
        {
          title: "反解 fugacity",
          formula: "$y\\equiv\\frac{n\\lambda^3}{g}\\quad\\Longrightarrow\\quad z=y+s\\frac{y^2}{2^{3/2}}+O(y^3)$",
          explanation:
            "把 z=y+cy² 代回第一式，要求 y² 系数消失就得到 c=s/2^{3/2}。",
        },
        {
          title: "消去 z 得到首个 virial correction",
          formula: "$\\frac{P}{nk_B T}=1+s\\frac{y}{2^{5/2}}+O(y^2)$",
          explanation:
            "因为 1/2^{3/2}−1/2^{5/2}=1/2^{5/2}；Fermi 压力升高，Bose 压力降低。",
        },
        {
          title: "与课件 a2 对齐",
          formula: "$a_2^{BE}=-\\frac{1}{2^{5/2}}=-\\frac{1}{4\\sqrt2},\\qquad a_2^{FD}=+\\frac{1}{2^{5/2}}$",
          explanation:
            "这是纯交换统计修正，不代表 Hamiltonian 里存在真实吸引或排斥势。",
        },
        {
          title: "用二次色散把压力转成内能",
          formula: "$U=\\frac{3}{2}PV=\\frac{3}{2}Nk_B T\\left[1+s\\frac{y}{2^{5/2}}+O(y^2)\\right]$",
          explanation:
            "P=2U/(3V) 来自动能对长度缩放的齐次性，对 Bose 和 Fermi 都成立。",
        },
        {
          title: "在固定 N、V 下跟踪 λ 的温度依赖",
          formula: "$\\lambda^3\\propto T^{-3/2}\\quad\\Longrightarrow\\quad\\left(\\frac{\\partial y}{\\partial T}\\right)_{N,V}=-\\frac{3y}{2T}$",
          explanation:
            "求 CV 时若把 λ 或 y 当常数，就会漏掉全部量子热容修正。",
        },
        {
          title: "对 U 求温度导数",
          formula: "$\\frac{C_V}{Nk_B}=\\frac{3}{2}\\left[1-s\\frac{y}{2^{7/2}}+O(y^2)\\right]$",
          explanation:
            "T·y∝T^{-1/2}，所以首修正求导后乘 −1/2：Bose 得 +0.0884y，Fermi 得 −0.0884y。",
        },
        {
          title: "写成课件的通项微分系数",
          formula: "$\\frac{C_V}{Nk_B}=\\frac{3}{2}\\sum_{l=1}^{\\infty}\\frac{5-3l}{2}\\,a_l\\left(\\frac{\\lambda^3}{v}\\right)^{l-1}$",
          explanation:
            "第 l 项含 T·(λ³)^{l−1}∝T^{(5−3l)/2}，求导就产生 (5−3l)/2。Fermi 还带课件的 (−1)^{l−1} 与 g。",
        },
      ],
      conclusion:
        "$P/(nk_BT)=1\\mp(n\\lambda^3/g)/2^{5/2}+\\cdots$（上号 Bose、下号 Fermi 对应负/正修正），且 fixed-$N,V$ 的 $C_V$ 首修正符号相反。",
      checks: [
        "y→0 时 P→nkBT、CV→3NkB/2。",
        "Bose 首个压力修正必须为负，Fermi 必须为正。",
        "Bose 的 CV 首修正 +0.0884y、Fermi 的 −0.0884y，应与课件数值一致。",
      ],
      evidence: [
        "课件 9 slides 4–5：Bose virial coefficients、U=3PV/2 与 fixed-N,V 的 CV series。",
        "课件 9 slide 22：Fermi 交替 virial 与 CV series，并显式含 g。",
      ],
    },
  },
  {
    moduleId: "bose-gas",
    lecture: 9,
    slides: [8],
    sourceTitle: "Pressure and compressibility through BEC",
    sourceFormulas: [
      "T<Tc: P=kBTζ(5/2)/λ³",
      "κ_T=-(1/V)(∂V/∂P)T→∞",
      "T>Tc: P=nkBT g_{5/2}(z)/g_{3/2}(z)",
    ],
    derivation: {
      id: "teacher-l09-s08-bec-compressibility-divergence",
      title: "理想 BEC 相中为什么 κT 发散",
      kind: "模型",
      origin:
        "三维均匀理想 Bose 气体在 T<Tc 时 fugacity 钉在 z=1，激发态压力只由 T 决定。等温改变 V 时，多出的粒子可在零动量凝聚态与激发态之间重分配而不改变压力，因此理想模型的 ∂P/∂V 为零，等温压缩率发散。",
      symbols: [
        { symbol: "κT", meaning: "等温压缩率 −V^{-1}(∂V/∂P)T" },
        { symbol: "λ", meaning: "热 de Broglie 波长" },
        { symbol: "z", meaning: "fugacity；把基态能设为 0 后凝聚相中 z=1" },
        { symbol: "n0,nex", meaning: "凝聚态与激发态数密度" },
      ],
      prerequisites: ["BEC 的激发态饱和", "等温压缩率定义", "Bose equation of state"],
      assumptions: [
        "三维、均匀、热力学极限中的理想 Bose 气体",
        "T<Tc 且基态能量取 0，所以 μ=0、z=1",
        "忽略粒子间相互作用；真实弱相互作用会使压缩率有限",
      ],
      steps: [
        {
          title: "写凝聚相的粒子数分解",
          formula: "$n=n_0+n_{ex},\\qquad n_{ex}=\\frac{\\zeta(3/2)}{\\lambda^3}$",
          explanation:
            "固定 T 时 λ 固定，激发态容量 nex 已饱和；继续增加总密度只增加 n0。",
        },
        {
          title: "写压力只来自激发态",
          formula: "$P(T,z=1)=\\frac{k_B T}{\\lambda^3}\\zeta(5/2)$",
          explanation:
            "零动量基态在理想、热力学极限中不提供动量通量，所以压力没有 n0 项。",
        },
        {
          title: "固定 T 改变 V",
          formula: "$T\\;\\mathrm{fixed}:\\quad\\lambda\\;\\mathrm{fixed},\\quad N_0=N-Vn_{ex}(T)$",
          explanation:
            "压缩或膨胀只改变需要放在凝聚态里的粒子数；只要仍留在 T<Tc 的两相容量区，P 不变。",
        },
        {
          title: "因此压力对体积的斜率为零",
          formula: "$\\left(\\frac{\\partial P}{\\partial V}\\right)_{T,N}=0$",
          explanation:
            "P 是 T 的函数而不是 V 或总 n 的函数；这正是理想 condensate 的无限柔软性。",
        },
        {
          title: "代入压缩率定义",
          formula: "$\\kappa_T=-\\frac{1}{V}\\left(\\frac{\\partial V}{\\partial P}\\right)_{T,N}=-\\frac{1}{V}\\left[\\left(\\frac{\\partial P}{\\partial V}\\right)_{T,N}\\right]^{-1}\\to\\infty$",
          explanation:
            "分母趋于零使 κT 发散；符号应结合稳定侧极限理解为正无穷。",
        },
        {
          title: "从 density derivative 再检查一次",
          formula: "$\\kappa_T=\\frac{1}{n}\\left(\\frac{\\partial n}{\\partial P}\\right)_T=\\frac{1}{n(\\partial P/\\partial n)_T}\\to\\infty$",
          explanation:
            "凝聚相中 P 与 n 无关，所以 inverse stiffness 同样发散。",
        },
      ],
      conclusion:
        "理想均匀 Bose 凝聚相在 fixed $T$ 下满足 $(\\partial P/\\partial n)_T=0$，故 $\\kappa_T\\to\\infty$；这不是有相互作用真实气体的普遍结论。",
      checks: [
        "固定 T 时 λ 不应随 V 改变。",
        "压缩后 N0 应改变，而 nex/V 仍为 ζ(3/2)/λ³。",
        "加入弱排斥相互作用后应产生 density-dependent pressure，κT 不再无限。",
      ],
      evidence: [
        "课件 9 slide 8：T<Tc 的 P=kBTζ(5/2)/λ³ 与 κT→∞。",
        "课件 9 slide 8 翻译审校：无限压缩率是无相互作用理想模型结论。",
      ],
    },
  },
  {
    moduleId: "bose-gas",
    lecture: 9,
    slides: [9],
    sourceTitle: "Heat capacity at the BEC transition",
    sourceFormulas: [
      "C_V/(NkB)=(1/NkB)(∂U/∂T)_{N,V}=(3/2){∂[PV/(NkB)]/∂T}_v",
      "T<T_c: C_V/(NkB)=(15/4)ζ(5/2)v/λ³=(15/4)[ζ(5/2)/ζ(3/2)](T/T_c)^{3/2}",
      "T>T_c: C_V/(NkB)=15g_{5/2}(z)/(4g_{3/2}(z))-9g_{3/2}(z)/(4g_{1/2}(z))",
      "(1/z)(∂z/∂T)_v=-(3/2T)g_{3/2}(z)/g_{1/2}(z)",
      "C_V(T_c)≈1.925NkB",
    ],
    derivation: {
      id: "teacher-l09-s09-bose-normal-phase-z-cv",
      title: "正常 Bose 气体 fixed-N 的 z(T) 与热容",
      kind: "推导结果",
      origin:
        "T>Tc 时没有宏观基态占据，固定 N、V 要求 fugacity 随温度改变。先对 n=λ^{-3}g3/2(z) 隐式求导，再把 dz/dT 代入 U/N=(3/2)kBT g5/2/g3/2，才能得到课件热容的第二项。",
      symbols: [
        { symbol: "v=V/N", meaning: "固定的每粒子体积" },
        { symbol: "z(T)", meaning: "为保持 N 固定而随 T 调整的 fugacity" },
        { symbol: "gν(z)", meaning: "Bose function" },
        { symbol: "λ", meaning: "热波长，λ^{-3}∝T^{3/2}" },
      ],
      prerequisites: ["隐函数求导", "Bose function derivative", "fixed-N heat capacity"],
      assumptions: [
        "三维均匀理想 Bose 气体，二次色散",
        "正常相 T>Tc，无宏观 N0；N、V 固定",
        "使用 identity z∂zgν(z)=gν−1(z)",
      ],
      steps: [
        {
          title: "写 fixed density constraint",
          formula: "$n=\\frac{N}{V}=\\lambda^{-3}g_{3/2}(z)$",
          explanation:
            "T 改变时 λ 与 z 都变，但左侧 n 因 N、V 固定而不变。",
        },
        {
          title: "记录两项导数",
          formula: "$\\frac{d\\ln\\lambda^{-3}}{dT}=\\frac{3}{2T},\\qquad z\\frac{d g_\\nu}{dz}=g_{\\nu-1}(z)$",
          explanation:
            "第一式来自 λ∝T^{-1/2}；第二式可由 fugacity series 逐项求导。",
        },
        {
          title: "对 density constraint 取对数导数",
          formula: "$0=\\frac{3}{2T}+\\frac{g_{1/2}(z)}{g_{3/2}(z)}\\frac{1}{z}\\left(\\frac{\\partial z}{\\partial T}\\right)_v$",
          explanation:
            "下标 v 表示 V/N 固定，与 fixed N,V 完全一致。",
        },
        {
          title: "解出 fugacity 的温度变化",
          formula: "$\\frac{1}{z}\\left(\\frac{\\partial z}{\\partial T}\\right)_v=-\\frac{3}{2T}\\frac{g_{3/2}(z)}{g_{1/2}(z)}$",
          explanation:
            "升温时保持 density 不变需要 z 降低，所以负号符合物理直觉。",
        },
        {
          title: "写每粒子内能",
          formula: "$\\frac{U}{N}=\\frac{3}{2}k_B T\\frac{g_{5/2}(z)}{g_{3/2}(z)}$",
          explanation:
            "这是 U=(3/2)PV 与 P/n=kBT g5/2/g3/2 的组合。",
        },
        {
          title: "对 T 求导并代入 dz/dT",
          formula: "$\\frac{C_V}{Nk_B}=\\frac{15}{4}\\frac{g_{5/2}(z)}{g_{3/2}(z)}-\\frac{9}{4}\\frac{g_{3/2}(z)}{g_{1/2}(z)}$",
          explanation:
            "第一项来自显式 T 与 λ^{-3} 的尺度，第二项正是维持 N 不变所需的 z(T) 修正。",
        },
        {
          title: "取临界点上方极限",
          formula: "$z\\to1^-:\quad g_{1/2}(z)\\to\\infty,\\qquad\\frac{C_V(T_c^+)}{Nk_B}=\\frac{15}{4}\\frac{\\zeta(5/2)}{\\zeta(3/2)}\\simeq1.925$",
          explanation:
            "第二项趋零，并与凝聚相下方的值连续相接；不光滑的是更高导数。",
        },
      ],
      conclusion:
        "fixed $N,V$ 时必须先求 $z(T)$；代入后得到 $C_V/(Nk_B)=15g_{5/2}/(4g_{3/2})-9g_{3/2}/(4g_{1/2})$，且临界值约为 $1.925$。",
      checks: [
        "若错误固定 z，热容会漏掉第二项。",
        "z(T) 的导数在正常相应为负。",
        "z→1− 时 g1/2 发散，所以第二项应趋零而非发散。",
      ],
      evidence: ["课件 9 slide 9：normal-phase z(T)、CV 及临界值 1.925NkB。"],
    },
  },
  {
    moduleId: "bose-gas",
    lecture: 9,
    slides: [10],
    sourceTitle: "Exchange-induced statistical force",
    sourceFormulas: [
      "⟨r₁,r₂|e^{-βĤ}|r₁,r₂⟩=[1±exp(-2πr₁₂²/λ²)]/(2λ⁶)",
      "Q₂(V,T)=(1/(2λ⁶))∬[1±exp(-2πr₁₂²/λ²)]d³r₁d³r₂",
      "Q₂(V,T)=(1/2)(V/λ³)²[1±(1/2^{3/2})(λ³/V)]",
      "+ : bosons, - : fermions",
    ],
    derivation: {
      id: "teacher-l09-s10-two-particle-exchange-kernel",
      title: "二粒子交换项怎样产生 statistical interaction",
      kind: "推导结果",
      origin:
        "两个无相互作用相同粒子的 canonical kernel 必须投影到对称或反对称子空间。direct path 与 exchange path 相加或相减，得到短距离 enhancement/suppression；积分后就是第二 virial correction。所谓 statistical force 不是 Hamiltonian 中新增的真实二体势。",
      symbols: [
        { symbol: "r12=|r1−r2|", meaning: "两粒子间距" },
        { symbol: "λ", meaning: "课件采用的 thermal wavelength" },
        { symbol: "+/−", meaning: "分别对应 boson/fermion" },
        { symbol: "Q2", meaning: "两个相同粒子的 canonical partition function" },
      ],
      prerequisites: ["一粒子 free-particle thermal kernel", "交换对称化", "三维 Gaussian integral"],
      assumptions: [
        "无相互作用、非相对论、三维自由粒子",
        "只讨论两个相同粒子",
        "大容器极限，交换 Gaussian 的边界修正可忽略",
      ],
      steps: [
        {
          title: "写一粒子对角与非对角 thermal kernel",
          formula: "$K_1(\\mathbf r,\\mathbf r';\\beta)=\\lambda^{-3}\\exp[-\\pi|\\mathbf r-\\mathbf r'|^2/\\lambda^2]$",
          explanation:
            "对角 r=r′ 时得到 λ^{-3}；非对角位移受 Gaussian 抑制。",
        },
        {
          title: "用交换 projector 构造相同粒子 kernel",
          formula: "$K_2^{\\pm}=\\frac12[\\langle12|e^{-\\beta H}|12\\rangle\\pm\\langle12|e^{-\\beta H}|21\\rangle]$",
          explanation:
            "(1±P12)/2 分别投影到 bosonic symmetric 与 fermionic antisymmetric subspace。",
        },
        {
          title: "计算 direct term",
          formula: "$\\langle12|e^{-\\beta H}|12\\rangle=K_1(r_1,r_1)K_1(r_2,r_2)=\\lambda^{-6}$",
          explanation:
            "无相互作用使二粒子 kernel 因子化；两条路径都不交换端点。",
        },
        {
          title: "计算 exchange term",
          formula: "$\\langle12|e^{-\\beta H}|21\\rangle=K_1(r_1,r_2)K_1(r_2,r_1)=\\lambda^{-6}e^{-2\\pi r_{12}^2/\\lambda^2}$",
          explanation:
            "两个相反方向的位移 Gaussian 相乘，使指数中的 π 变成 2π。",
        },
        {
          title: "得到课件的局域 enhancement/suppression",
          formula: "$K_2^{\\pm}(r_1,r_2)=\\frac{1}{2\\lambda^6}[1\\pm e^{-2\\pi r_{12}^2/\\lambda^2}]$",
          explanation:
            "r12≪λ 时 boson 权重增强、fermion 权重被压低；r12≫λ 时 exchange term 消失。",
        },
        {
          title: "积分 exchange Gaussian",
          formula: "$\\int_{\\mathbb R^3}e^{-2\\pi r^2/\\lambda^2}d^3r=\\frac{\\lambda^3}{2^{3/2}}$",
          explanation:
            "使用 ∫e^{-ar²}d³r=(π/a)^{3/2}，这里 a=2π/λ²。",
        },
        {
          title: "分离 center coordinate 并得到 Q2",
          formula: "$Q_2=\\frac12\\left(\\frac{V}{\\lambda^3}\\right)^2\\left[1\\pm\\frac{1}{2^{3/2}}\\frac{\\lambda^3}{V}\\right]$",
          explanation:
            "direct term 给 V²，exchange term 的 center integral 给 V、relative integral 给 λ³/2^{3/2}。",
        },
      ],
      conclusion:
        "$K_2^{\\pm}=(2\\lambda^6)^{-1}[1\\pm e^{-2\\pi r_{12}^2/\\lambda^2}]$；短程差异来自 exchange interference，而不是额外势能。",
      checks: [
        "r12≫λ 时 boson 与 fermion kernel 都应趋于 classical direct term。",
        "r12=0 时 fermion spatial kernel 在相同内部态 convention 下应为零。",
        "exchange correction 相对主项应按 λ³/V 缩小。",
      ],
      evidence: [
        "课件 9 slide 10：two-particle thermal kernel 与 Q₂ 的 direct/exchange 两项。",
        "课件 9 slide 10 翻译审校：statistical force 不是新增真实二体势。",
      ],
    },
  },
  {
    moduleId: "quantum-statistics",
    lecture: 8,
    slides: [5, 7],
    sourceTitle: "Total multiplicity and constraints",
    sourceFormulas: [
      "W_MB=∏i g_i^{n_i}/n_i!",
      "∑i n_i=N",
      "∑i n_iε_i=E",
      "a=-1 (BE), +1 (FD), 0 (MB)",
      "n_i*=g_i/[e^{α+βε_i}+a]",
      "α=-βμ",
      "β=1/(kBT)",
      "n_i*=g_i/[e^{β(ε_i-μ)}+a]",
    ],
    derivation: {
      id: "teacher-l08-s05-maxwell-boltzmann-multiplicity-occupation",
      title: "从 Maxwell–Boltzmann multiplicity 到最概然占据",
      kind: "推导结果",
      origin:
        "在固定 N、E 下最大化课件给出的 MB multiplicity。若从可区分粒子的绝对排列数出发还会有全局 N!；固定 N 时它与 {ni} 无关，因此课件省略它不影响最概然分布，但计算绝对态数或配分函数时不能无条件忘掉。",
      symbols: [
        { symbol: "ni", meaning: "能级 i 的粒子数" },
        { symbol: "gi", meaning: "能量 εi 的单粒子简并度" },
        { symbol: "α,β", meaning: "粒子数与能量约束的 Lagrange 乘子" },
        { symbol: "μ", meaning: "化学势，满足 α=−βμ" },
      ],
      prerequisites: ["Stirling 近似", "Lagrange 乘子", "对数把乘积变成和"],
      assumptions: [
        "Maxwell–Boltzmann 稀占据极限 ni≪gi，量子交换效应可忽略",
        "ni 足够大以对主要占据能级使用 Stirling 近似",
        "变分时 N 与 E 固定；省略的全局 N! 因而是常数",
      ],
      steps: [
        {
          title: "写课件采用的相对 multiplicity",
          formula: "$W_{MB}=\\prod_i\\frac{g_i^{n_i}}{n_i!}$",
          explanation:
            "gi^{ni} 分配每个粒子的简并子态，1/ni! 消除同能级内标签排列造成的重复计数。",
        },
        {
          title: "说明固定 N 时省略的全局因子",
          formula: "$W_{\\mathrm{labelled}}=N!\\prod_i\\frac{g_i^{n_i}}{n_i!},\\qquad\\delta\\ln N!=0\\quad(N\\;\\mathrm{fixed})$",
          explanation:
            "有些计数 convention 保留 N!，有些把它吸收掉；固定 N 的极值位置相同，但绝对熵或跨 N 比较时必须固定 convention。",
        },
        {
          title: "取对数并使用 Stirling",
          formula: "$\\ln W_{MB}=\\sum_i[n_i\\ln g_i-\\ln(n_i!)]\\simeq\\sum_i[n_i\\ln g_i-n_i\\ln n_i+n_i]$",
          explanation:
            "巨大乘积变成可逐项求导的和；保留 +ni 才会让导数中的常数正确抵消。",
        },
        {
          title: "连同两个约束一起变分",
          formula: "$\\delta\\!\\left[\\ln W_{MB}-\\alpha\\sum_i n_i-\\beta\\sum_i n_i\\varepsilon_i\\right]=0$",
          explanation:
            "α 约束总粒子数，β 约束总能量；常数 N、E 不必写在变分项内。",
        },
        {
          title: "令每个独立 δni 的系数为零",
          formula: "$\\ln g_i-\\ln n_i-\\alpha-\\beta\\varepsilon_i=0$",
          explanation:
            "因为各 δni 可独立改变，括号中的 stationarity 条件必须逐能级成立。",
        },
        {
          title: "解出 Maxwell–Boltzmann 占据",
          formula: "$n_i^*=g_i e^{-\\alpha-\\beta\\varepsilon_i}=g_i e^{-\\beta(\\varepsilon_i-\\mu)}$",
          explanation:
            "识别 β=1/(kBT)、α=−βμ 后，就得到统一分布在 a=0 时的极限。",
        },
      ],
      conclusion:
        "$W_{MB}=\\prod_i g_i^{n_i}/n_i!$ 在固定 N、E 下给出 $n_i^*=g_i e^{-\\beta(\\varepsilon_i-\\mu)}$；固定 N 时省略全局 $N!$ 不改变极值，但不代表它在所有用途都可丢弃。",
      checks: [
        "把解代回约束，应能由 α、β 调整出给定 N、E。",
        "εi 增大时 ni 必须指数下降。",
        "固定 N 的变分中乘上 N! 不得改变 stationarity equation。",
      ],
      evidence: [
        "课件 8 slide 5：W_MB=∏i g_i^{n_i}/n_i! 及 N、E 约束。",
        "课件 8 slide 7：a=0 的统一 occupation 与 α=−βμ、β=1/(kBT)。",
      ],
    },
  },
  {
    moduleId: "quantum-statistics",
    lecture: 8,
    slides: [9, 10, 11],
    sourceTitle: "Entropy and the quantum-gas equation",
    sourceFormulas: [
      "α=-μ/(kBT), β=1/(kBT)",
      "PV=(kBT/a)∑i g_i ln{1+a e^{-α-βε_i}}",
      "ln(1+a x)≈a x",
      "PV=kBT∑i g_i e^{-α-βε_i}=NkBT",
      "Q_BE=∏ε[1-ze^{-βε}]^{-1}",
      "Q_FD=∏ε(1+ze^{-βε})",
      "Q_MB=exp(zV/λ³)",
    ],
    derivation: {
      id: "teacher-l08-s09-unified-grand-product-pressure-energy",
      title: "BE、FD、MB 的单态乘积怎样生成 P、N 与 U",
      kind: "推导结果",
      origin:
        "巨正则系综中无相互作用单粒子态可独立求和。把每态的几何级数、二项和或 Poisson 指数相乘，得到统一 grand partition function，再用导数生成 N 与 U。课件的能量导数明确固定 z；若改为固定 μ，导数会多出 μN。",
      symbols: [
        { symbol: "a", meaning: "统计符号：BE 为 −1、FD 为 +1；MB 取 a→0 极限" },
        { symbol: "z=e^{βμ}", meaning: "fugacity" },
        { symbol: "Q", meaning: "grand partition function（课件记号）" },
        { symbol: "gi", meaning: "能级 i 的简并度" },
      ],
      prerequisites: ["几何级数", "巨正则权重", "对数导数", "三维二次色散的尺度关系"],
      assumptions: [
        "理想无相互作用气体，单粒子态占据可因子化",
        "BE 每态 ze^{-βε}<1；FD 每态占据仅 0 或 1",
        "由 lnQ 得 U 的课件公式固定 z 和 V；固定 μ 时须对 z=e^{βμ} 的 β 依赖求导",
        "P=2U/(3V) 还要求三维均匀气体与二次色散 ε∝p²",
      ],
      steps: [
        {
          title: "定义单态 Boltzmann–fugacity 因子",
          formula: "$x_i=z e^{-\\beta\\varepsilon_i}=e^{-\\beta(\\varepsilon_i-\\mu)}$",
          explanation:
            "一个粒子占据该态就贡献一个 xi；n 个粒子贡献 xi^n。",
        },
        {
          title: "分别对允许的占据数求和",
          formula: "$q_i^{BE}=\\sum_{n=0}^{\\infty}x_i^n=(1-x_i)^{-1},\\qquad q_i^{FD}=1+x_i$",
          explanation:
            "玻色占据可为任意非负整数；费米占据只能为 0 或 1。",
        },
        {
          title: "把每个简并子态相乘并统一记号",
          formula: "$Q_a=\\prod_i(1+a x_i)^{g_i/a},\\qquad\\ln Q_a=\\frac{1}{a}\\sum_i g_i\\ln(1+a x_i)$",
          explanation:
            "a=−1 给 Bose 乘积，a=+1 给 Fermi 乘积；a→0 时用 ln(1+ax)/a→x。",
        },
        {
          title: "取 Maxwell–Boltzmann 极限",
          formula: "$Q_{MB}=\\exp\\!\\left(\\sum_i g_i x_i\\right),\\qquad\\ln Q_{MB}=z\\frac{V}{\\lambda_T^3}$",
          explanation:
            "连续三维自由粒子态求和给单粒子配分函数 V/λT³；这也解释课件的指数形式。",
        },
        {
          title: "由体积齐次性读出压力",
          formula: "$PV=k_B T\\ln Q_a=\\frac{k_B T}{a}\\sum_i g_i\\ln[1+a e^{-\\alpha-\\beta\\varepsilon_i}]$",
          explanation:
            "均匀理想气体的 lnQ 与 V 成正比；α=−βμ，所以 e^{-α-βε}=ze^{-βε}。",
        },
        {
          title: "用 fugacity 导数生成平均粒子数",
          formula: "$N=z\\left(\\frac{\\partial\\ln Q}{\\partial z}\\right)_{\\beta,V}=\\sum_i\\frac{g_i}{z^{-1}e^{\\beta\\varepsilon_i}+a}$",
          explanation:
            "对每个 xi 的 z 依赖求导，就回到统一 BE/FD/MB occupation。",
        },
        {
          title: "在固定 z 时生成能量",
          formula: "$U=-\\left(\\frac{\\partial\\ln Q}{\\partial\\beta}\\right)_{z,V}$",
          explanation:
            "固定 z 意味着指数中只有 −βεi 对 β 求导，因此直接拉出 Σniεi。",
        },
        {
          title: "区分 fixed z 与 fixed μ",
          formula: "$-\\left(\\frac{\\partial\\ln Q}{\\partial\\beta}\\right)_{\\mu,V}=U-\\mu N,\\qquad\\left(\\frac{\\partial z}{\\partial\\beta}\\right)_\\mu=\\mu z$",
          explanation:
            "固定 μ 时 z 随 β 改变，链式法则多出 μN；不能把课件 fixed-z 公式原样标成 fixed-μ。",
        },
        {
          title: "用二次色散的尺度关系收尾",
          formula: "$U=\\frac{3}{2}PV\\quad\\Longleftrightarrow\\quad P=\\frac{2U}{3V}$",
          explanation:
            "三维态密度 ε^{1/2} 与动能的齐次性给出这一关系；它不是 Bose 或 Fermi 独有。",
        },
      ],
      conclusion:
        "$\\ln Q_a=a^{-1}\\sum_i g_i\\ln(1+a z e^{-\\beta\\varepsilon_i})$ 同时生成 $PV$、$N$ 与 fixed-z 的 $U$；固定 μ 求 β 导数得到的是 $U-\\mu N$。",
      checks: [
        "a=−1 应回到 ∏(1−ze^{-βε})^{-1}；a=+1 应回到 ∏(1+ze^{-βε})。",
        "a→0 前必须先展开 ln(1+ax)，不能直接除以零。",
        "固定 μ 的 β 导数若仍写成 U，就是漏掉 z=e^{βμ} 的链式项。",
      ],
      evidence: [
        "课件 8 slides 9–11：统一压力式与 BE、FD、MB grand products。",
        "课件 9 slide 5：U=−(∂lnQ/∂β)_{z,V}，下标明确是 fixed z。",
      ],
    },
  },
  {
    moduleId: "quantum-statistics",
    lecture: 8,
    slides: [13, 14],
    sourceTitle: "Single-state occupation probability",
    sourceFormulas: [
      "Var_MB(n)=n̄",
      "BE: P(n)=(1-ze^{-βε})(ze^{-βε})^n, n=0,1,…",
      "FD: P(1)=ze^{-βε}/(1+ze^{-βε}), P(0)=1/(1+ze^{-βε})",
      "MB: P(n)=e^{-n̄}n̄^n/n!",
    ],
    derivation: {
      id: "teacher-l08-s14-mb-single-state-poisson",
      title: "经典单态为什么服从 Poisson 分布",
      kind: "推导结果",
      origin:
        "Maxwell–Boltzmann 极限把一个单粒子态中的任意占据视为独立、稀少事件。单态 grand sum 的 1/n! 归一化直接给 Poisson distribution，并自动给出均值等于方差。",
      symbols: [
        { symbol: "n", meaning: "所选单粒子态的占据数" },
        { symbol: "x=ze^{-βε}", meaning: "该态的一粒子 fugacity weight" },
        { symbol: "n̄", meaning: "该态的平均占据，MB 极限中等于 x" },
      ],
      prerequisites: ["指数函数的幂级数", "概率归一化", "概率生成函数"],
      assumptions: ["Maxwell–Boltzmann 稀占据极限", "所看单粒子态与其他态在 grand ensemble 中独立因子化"],
      steps: [
        {
          title: "写 n 粒子占据的未归一化权重",
          formula: "$w_n=\\frac{x^n}{n!},\\qquad x=z e^{-\\beta\\varepsilon}$",
          explanation:
            "每个粒子给一个 x；1/n! 消除同一态中交换标签造成的重复计数。",
        },
        {
          title: "对所有 n 求单态 grand sum",
          formula: "$q_{MB}=\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}=e^x$",
          explanation:
            "这就是指数函数的 Taylor series，也是概率归一化分母。",
        },
        {
          title: "权重除以归一化得到概率",
          formula: "$P(n)=\\frac{w_n}{q_{MB}}=e^{-x}\\frac{x^n}{n!}$",
          explanation:
            "因此 MB 单态 occupation 是参数 x 的 Poisson distribution。",
        },
        {
          title: "由对数导数求均值",
          formula: "$\\bar n=x\\frac{\\partial\\ln q_{MB}}{\\partial x}=x$",
          explanation:
            "x∂x 会把级数中的每一项乘以 n，所以它生成 occupation 的一阶矩。",
        },
        {
          title: "求 factorial second moment",
          formula: "$\\langle n(n-1)\\rangle=x^2\\frac{1}{q_{MB}}\\frac{\\partial^2 q_{MB}}{\\partial x^2}=x^2$",
          explanation:
            "用 n²=n(n−1)+n，就可从 factorial moment 恢复普通二阶矩。",
        },
        {
          title: "计算方差",
          formula: "$\\operatorname{Var}(n)=\\langle n^2\\rangle-\\bar n^2=(x^2+x)-x^2=x=\\bar n$",
          explanation:
            "Poisson 分布的均值与方差相等，正是课件 MB fluctuation 公式。",
        },
      ],
      conclusion:
        "$P_{MB}(n)=e^{-\\bar n}\\bar n^n/n!$ 且 $\\operatorname{Var}(n)=\\bar n$。",
      checks: [
        "ΣnP(n)=e^{-x}e^x=1。",
        "P(n+1)/P(n)=x/(n+1)。",
        "x≪1 时 P(0)≈1−x、P(1)≈x，符合稀占据直觉。",
      ],
      evidence: [
        "课件 8 slide 13：Var_MB(n)=n̄。",
        "课件 8 slide 14：MB: P(n)=e^{-n̄}n̄^n/n!。",
      ],
    },
  },
  {
    moduleId: "fermi-gas",
    lecture: 9,
    slides: [20, 21, 28],
    sourceTitle: "Ideal Fermi gas thermodynamics",
    sourceFormulas: [
      "ε_k=ℏ²k²/(2m)",
      "f_ν(z)=1/Γ(ν)∫₀∞x^{ν-1}/(z^{-1}e^x+1)dx=∑_{l=1}∞(-1)^{l+1}z^l/l^ν",
      "P=gkBTλ^{-3}f_{5/2}(z)",
      "n=gλ^{-3}f_{3/2}(z)",
      "U=(3/2)gVkBTλ^{-3}f_{5/2}(z)=(3/2)NkBT f_{5/2}(z)/f_{3/2}(z)",
      "P=2U/(3V)",
      "(1/z)(∂z/∂T)_v=-(3/2T)f_{3/2}(z)/f_{1/2}(z)",
      "C_V/(NkB)=15f_{5/2}(z)/(4f_{3/2}(z))-9f_{3/2}(z)/(4f_{1/2}(z))",
      "Source slide visibly prints: N=(g/λ³)f_{3/2}(z) (the expected density form is N/V=(g/λ³)f_{3/2}(z))",
    ],
    derivation: {
      id: "teacher-l09-s20-finite-temperature-fermi-thermodynamics",
      title: "有限温三维 Fermi 气体的 n、P、U 与 fixed-N 热容",
      kind: "推导结果",
      origin:
        "从含内部简并 g 的三维 momentum-state measure 与 Fermi–Dirac occupation 出发，用 x=βε 换元得到 f3/2 与 f5/2。计算 CV 时必须保持 N、V，而不是保持 z；隐式求出 z(T) 才得到课件的第二项。",
      symbols: [
        { symbol: "g", meaning: "每个 momentum state 的内部简并数；电子通常 g=2" },
        { symbol: "z=e^{βμ}", meaning: "fugacity" },
        { symbol: "λ=h/√(2πmkBT)", meaning: "thermal wavelength" },
        { symbol: "fν(z)", meaning: "Fermi integral function" },
        { symbol: "v=V/N", meaning: "fixed-N,V 求导时保持的每粒子体积" },
      ],
      prerequisites: ["三维 momentum-space state counting", "Fermi–Dirac occupation", "Fermi integral derivative", "隐函数求导"],
      assumptions: [
        "三维均匀、理想、非相对论 Fermi 气体，ε=p²/(2m)",
        "thermodynamic/continuum limit",
        "内部 g 个 components 具有相同质量与 chemical potential",
        "热容定义固定 N、V；因此 z 随 T 改变",
        "课件 slide 28 首行的 N=(g/λ³)f3/2 量纲错误，应读作 N/V=(g/λ³)f3/2",
      ],
      steps: [
        {
          title: "写 occupation 与 momentum measure",
          formula: "$\\bar n_{\\mathbf p}=\\frac{1}{z^{-1}e^{\\beta p^2/(2m)}+1},\\qquad N=\\frac{gV}{h^3}\\int d^3p\\,\\bar n_{\\mathbf p}$",
          explanation:
            "g 乘每个 momentum cell 的内部态数；费米 occupation 已确保每个完整单粒子态最多占 1。",
        },
        {
          title: "把球对称积分化为能量积分",
          formula: "$n=\\frac{4\\pi g}{h^3}\\int_0^\\infty\\frac{p^2dp}{z^{-1}e^{\\beta p^2/(2m)}+1}$",
          explanation:
            "d³p=4πp²dp；这里 n=N/V，不要漏掉 volume factor。",
        },
        {
          title: "令 x=βp²/(2m)",
          formula: "$n=\\frac{g}{\\lambda^3}\\frac{1}{\\Gamma(3/2)}\\int_0^\\infty\\frac{x^{1/2}}{z^{-1}e^x+1}dx=\\frac{g}{\\lambda^3}f_{3/2}(z)$",
          explanation:
            "Jacobian p²dp 产生 x^{1/2}，所有 m、T 常数合并成 λ^{-3}。",
        },
        {
          title: "由 grand potential 得压力",
          formula: "$P=\\frac{gk_B T}{\\lambda^3}f_{5/2}(z)$",
          explanation:
            "对 ln(1+ze^{-βε}) 的 energy integral 做 integration by parts，指数从 3/2 提升到 5/2。",
        },
        {
          title: "直接积分能量并与压力比较",
          formula: "$U=\\frac{gV}{h^3}\\int d^3p\\,\\frac{p^2}{2m}\\bar n_{\\mathbf p}=\\frac{3}{2}\\frac{gVk_B T}{\\lambda^3}f_{5/2}(z)=\\frac{3}{2}PV$",
          explanation:
            "额外的 ε 使 Gamma(5/2)=(3/2)Γ(3/2)；P=2U/(3V) 来自二次色散尺度。",
        },
        {
          title: "消去 volume prefactor 得每粒子能量",
          formula: "$\\frac{U}{N}=\\frac{3}{2}k_B T\\frac{f_{5/2}(z)}{f_{3/2}(z)}$",
          explanation:
            "用 n=(g/λ³)f3/2 除掉 gV/λ³。",
        },
        {
          title: "在 fixed density 下求 z(T)",
          formula: "$0=\\frac{3}{2T}+\\frac{f_{1/2}(z)}{f_{3/2}(z)}\\frac{1}{z}\\left(\\frac{\\partial z}{\\partial T}\\right)_v$",
          explanation:
            "用 λ^{-3}∝T^{3/2} 与 z∂zfν=fν−1；左侧 density 固定。",
        },
        {
          title: "解出课件的 fugacity derivative",
          formula: "$\\frac{1}{z}\\left(\\frac{\\partial z}{\\partial T}\\right)_v=-\\frac{3}{2T}\\frac{f_{3/2}(z)}{f_{1/2}(z)}$",
          explanation:
            "这一步是 fixed-N heat capacity 与 fixed-z derivative 的关键区别。",
        },
        {
          title: "对 U/N 求导",
          formula: "$\\frac{C_V}{Nk_B}=\\frac{15}{4}\\frac{f_{5/2}(z)}{f_{3/2}(z)}-\\frac{9}{4}\\frac{f_{3/2}(z)}{f_{1/2}(z)}$",
          explanation:
            "第一项来自显式 T 与尺度，第二项来自 z(T)；两项在 classical limit 合成 3/2。",
        },
      ],
      conclusion:
        "$n=g\\lambda^{-3}f_{3/2}(z)$、$P=gk_BT\\lambda^{-3}f_{5/2}(z)$、$U=3PV/2$；fixed $N,V$ 后得到课件的两项 $C_V$。",
      checks: [
        "n 的单位必须是 1/volume，P 的单位必须是 energy/volume。",
        "z≪1 时 fν≈z，两项热容应合成 3NkB/2。",
        "g 必须同时出现在 n、P、U 中；不能只在 Fermi momentum 处才补。",
        "课件 slide 28 的左侧若写 N 而非 N/V，单位会立刻不匹配。",
      ],
      evidence: [
        "课件 9 slide 20：finite-T ideal Fermi n 与 P，包含 component degeneracy g。",
        "课件 9 slide 21：U=3PV/2、fixed-v 的 z(T) 与 CV。",
        "课件 9 slide 28：源页首行打印 N=(g/λ³)f3/2；翻译审校明确勘误为 N/V=(g/λ³)f3/2。",
      ],
    },
  },
  {
    moduleId: "nonequilibrium",
    lecture: 10,
    slides: [7],
    sourceTitle: "From random walks to the diffusion equation",
    sourceFormulas: [
      "n(r,t)=N/(4πDt)^{3/2} exp[-r²/(4Dt)]",
      "∇²n-(1/D)∂n/∂t=0",
      "n(x,t+τ)=∫_{-∞}^{∞}dΔ f_τ(-Δ)n(x+Δ,t)",
      "∂tn=(1/2τ)⟨Δ²⟩_τ ∂x²n",
      "⟨Δ²⟩_τ∼τ",
    ],
    derivation: {
      id: "teacher-l10-s07-three-dimensional-diffusion-green-function",
      title: "三维扩散方程的点源 Green function",
      kind: "推导结果",
      origin:
        "对无限均匀空间中的 diffusion equation 作 spatial Fourier transform，每个 wavevector mode 独立指数衰减。点源初态的 inverse transform 分解成三个一维 Gaussian，得到课件的三维 kernel；乘 N 后是粒子数密度，不是归一为 1 的单粒子概率。",
      symbols: [
        { symbol: "n(r,t)", meaning: "粒子数密度，空间积分为总粒子数 N" },
        { symbol: "D", meaning: "各向同性 diffusion coefficient" },
        { symbol: "k", meaning: "spatial Fourier wavevector" },
        { symbol: "δ³(r)", meaning: "三维点源 initial condition" },
      ],
      prerequisites: ["diffusion equation", "spatial Fourier transform", "Gaussian integral", "delta-function initial condition"],
      assumptions: [
        "无限三维均匀空间，无边界与 source/sink",
        "D 为正的常数且各向同性",
        "初态 n(r,0)=Nδ³(r)；一般初态由与 Green function convolution 得到",
      ],
      steps: [
        {
          title: "把课件 PDE 写成标准形式",
          formula: "$\\nabla^2 n-\\frac{1}{D}\\partial_t n=0\\quad\\Longleftrightarrow\\quad\\partial_t n=D\\nabla^2 n$",
          explanation:
            "移项并乘 D；D>0 使高 spatial-frequency variation 随时间被抹平。",
        },
        {
          title: "定义 spatial Fourier transform",
          formula: "$\\widetilde n(\\mathbf k,t)=\\int_{\\mathbb R^3}n(\\mathbf r,t)e^{-i\\mathbf k\\cdot\\mathbf r}d^3r$",
          explanation:
            "在 Fourier space，Laplacian 变成乘法 −k²。",
        },
        {
          title: "把 PDE 化为每个 k 的 ODE",
          formula: "$\\partial_t\\widetilde n(\\mathbf k,t)=-Dk^2\\widetilde n(\\mathbf k,t)$",
          explanation:
            "不同 wavevector modes 不耦合，因此可分别求解。",
        },
        {
          title: "用点源初态确定 mode amplitude",
          formula: "$n(\\mathbf r,0)=N\\delta^{(3)}(\\mathbf r)\\quad\\Longrightarrow\\quad\\widetilde n(\\mathbf k,0)=N$",
          explanation:
            "delta function 的 Fourier transform 是 1；总粒子数 N 是所有初始 mode 的共同 amplitude。",
        },
        {
          title: "解出每个 mode 的衰减",
          formula: "$\\widetilde n(\\mathbf k,t)=N e^{-Dk^2t}$",
          explanation:
            "k 越大，代表空间变化越快，衰减率 Dk² 越大。",
        },
        {
          title: "作 inverse transform 并分离三个方向",
          formula: "$n(\\mathbf r,t)=N\\prod_{j=x,y,z}\\int_{-\\infty}^{\\infty}\\frac{dk_j}{2\\pi}e^{-Dtk_j^2+ik_jr_j}$",
          explanation:
            "因为 k²=kx²+ky²+kz²、k·r=Σkjrj，三维积分是三个相同类型的一维 Gaussian product。",
        },
        {
          title: "完成 Gaussian integrals",
          formula: "$n(\\mathbf r,t)=\\frac{N}{(4\\pi Dt)^{3/2}}\\exp\\left(-\\frac{r^2}{4Dt}\\right)$",
          explanation:
            "每个方向给 (4πDt)^{-1/2}exp[−rj²/(4Dt)]；三方向相乘得到 3/2 次方。",
        },
        {
          title: "检查 normalization 与 mean-square radius",
          formula: "$\\int n(\\mathbf r,t)d^3r=N,\\qquad\\frac{1}{N}\\int r^2n(\\mathbf r,t)d^3r=6Dt$",
          explanation:
            "每个 Cartesian component 的 variance 是 2Dt，三维相加为 6Dt。",
        },
      ],
      conclusion:
        "无限三维空间的点源扩散核是 $n(\\mathbf r,t)=N(4\\pi Dt)^{-3/2}e^{-r^2/(4Dt)}$；除以 $N$ 才是归一化为 1 的单粒子概率密度。",
      checks: [
        "空间积分必须为 N，而不是 1（除非先除以 N）。",
        "Dt 的单位是 length²，指数必须无量纲。",
        "把 kernel 代回 PDE，应满足 ∂tn=D∇²n。",
      ],
      evidence: [
        "课件 10 slide 7：three-dimensional Gaussian density 与 diffusion equation。",
        "课件 10 slide 7 翻译审校：n(r,t) 是粒子数密度，除以 N 后才归一化为 1。",
      ],
    },
  },
  {
    moduleId: "nonequilibrium",
    lecture: 10,
    slides: [10, 15],
    sourceTitle: "Velocity relaxation and mean-square displacement",
    sourceFormulas: [
      "⟨v(t)⟩=v(0)e^{-t/τ}, τ=MB",
      "r·v=(1/2)d(r²)/dt",
      "r·dv/dt=(1/2)d²(r²)/dt²-v²",
      "⟨r·F⟩=0",
      "d²⟨r²⟩/dt²+(1/τ)d⟨r²⟩/dt=2⟨v²⟩",
      "⟨v²⟩=3kBT/M",
      "⟨r²⟩=(6kBTτ²/M){t/τ-[1-e^{-t/τ}]}",
      "t≫τ: ⟨r²⟩≈6BkBTt=6Dt",
      "D=BkBT",
      "∂f/∂t=B∂x(F_x f)+BkBT∂²f/∂x²",
    ],
    derivation: {
      id: "teacher-l10-s10-langevin-three-dimensional-msd",
      title: "三维 Langevin moment ODE、精确 MSD 与 Einstein relation",
      kind: "推导结果",
      origin:
        "从 Mdv/dt=−v/B+F(t) 与 r 的运动学恒等式出发，先对 r² 建立 closed moment ODE，再用三维 equipartition 求精确 crossover。短时是 ballistic t²，长时是 diffusive 6Dt。课件 slide 15 的 force symbol 有特殊符号 convention；若 Fphys=−∂xU，Fokker–Planck drift 应写 −∂x(BFphys f)。",
      symbols: [
        { symbol: "B", meaning: "mobility；friction coefficient γ=1/B" },
        { symbol: "τ=MB", meaning: "velocity relaxation time" },
        { symbol: "F(t)", meaning: "zero-mean random force" },
        { symbol: "y(t)=⟨r²(t)⟩", meaning: "三维 mean-square displacement" },
        { symbol: "D", meaning: "long-time diffusion coefficient" },
      ],
      prerequisites: ["Langevin equation", "向量点积求导", "equipartition", "二阶线性 ODE"],
      assumptions: [
        "三维 isotropic equilibrium bath，B 为常数",
        "初始位移取 r(0)=0，且 y′(0)=0；随机力与同一时刻位置无系统相关 ⟨r·F⟩=0",
        "速度已达到 thermal variance ⟨v²⟩=3kBT/M",
        "外力符号采用 Fphys=−∂xU 时，以 zero-current Boltzmann equilibrium 检查 drift sign",
      ],
      steps: [
        {
          title: "写课件 Langevin equation 与 relaxation time",
          formula: "$M\\dot{\\mathbf v}=-\\frac{\\mathbf v}{B}+\\mathbf F(t),\\qquad\\tau=MB$",
          explanation:
            "1/B 是 friction coefficient；去掉 random force 后速度按 e^{-t/τ} 衰减。",
        },
        {
          title: "建立 r² 的一阶运动学恒等式",
          formula: "$\\mathbf r\\cdot\\mathbf v=\\frac12\\frac{d}{dt}r^2$",
          explanation:
            "因为 d(r·r)/dt=2r·v。",
        },
        {
          title: "再求一次导数但保留 v²",
          formula: "$\\mathbf r\\cdot\\dot{\\mathbf v}=\\frac12\\frac{d^2r^2}{dt^2}-v^2$",
          explanation:
            "d(r·v)/dt=v²+r·v̇；课件特别提醒不能漏掉 −v²。",
        },
        {
          title: "Langevin equation 点乘 r 并平均",
          formula: "$\\frac{M}{2}\\ddot y-M\\langle v^2\\rangle=-\\frac{1}{2B}\\dot y+\\langle\\mathbf r\\cdot\\mathbf F\\rangle$",
          explanation:
            "令 y=⟨r²⟩，并把前两步恒等式逐项代入。",
        },
        {
          title: "用 decorrelation 与 equipartition 闭合",
          formula: "$\\langle\\mathbf r\\cdot\\mathbf F\\rangle=0,\\qquad\\langle v^2\\rangle=\\frac{3k_B T}{M}$",
          explanation:
            "三维三个 velocity components 各贡献 kBT/(2) 到 kinetic energy。",
        },
        {
          title: "得到课件的 moment ODE",
          formula: "$\\ddot y+\\frac{1}{\\tau}\\dot y=\\frac{6k_B T}{M},\\qquad\\tau=MB$",
          explanation:
            "右边的 6 来自 ODE 原有的 factor 2 乘三维 ⟨v²⟩。",
        },
        {
          title: "先解一阶方程 u=y′",
          formula: "$\\dot u+\\frac{u}{\\tau}=\\frac{6k_B T}{M},\\quad u(0)=0\\quad\\Longrightarrow\\quad u(t)=\\frac{6k_B T\\tau}{M}(1-e^{-t/\\tau})$",
          explanation:
            "integrating factor e^{t/τ} 给出从 0 平滑增长到 long-time slope。",
        },
        {
          title: "再次积分得到精确 MSD",
          formula: "$\\langle r^2(t)\\rangle=\\frac{6k_B T\\tau^2}{M}\\left[\\frac{t}{\\tau}-(1-e^{-t/\\tau})\\right]$",
          explanation:
            "使用 y(0)=0；该式连接惯性与 overdamped 两个区间。",
        },
        {
          title: "检查短时 ballistic limit",
          formula: "$t\\ll\\tau:\quad\\langle r^2\\rangle\\simeq\\frac{3k_B T}{M}t^2=\\langle v^2\\rangle t^2$",
          explanation:
            "展开 1−e^{-x}=x−x²/2+⋯，一次项抵消，留下自由飞行的 t²。",
        },
        {
          title: "读出长时 diffusion coefficient",
          formula: "$t\\gg\\tau:\quad\\langle r^2\\rangle\\simeq6\\frac{k_B T\\tau}{M}t=6Bk_B Tt=6Dt\\quad\\Longrightarrow\\quad D=Bk_B T$",
          explanation:
            "三维 diffusion 的 MSD 是 6Dt，因此 coefficient matching 给 Einstein relation。",
        },
        {
          title: "用 Boltzmann equilibrium 固定外力符号",
          formula: "$F_{\\mathrm{phys}}=-\\partial_xU,\\qquad\\partial_t f=-\\partial_x(BF_{\\mathrm{phys}}f)+Bk_BT\\,\\partial_x^2f$",
          explanation:
            "课件 slide 15 写 +B∂x(Fx f)，所以其 Fx 若要自洽应理解为 +∂xU 或负的 physical force。最可靠的检查是 f_eq∝e^{-βU} 时 current 为零。",
        },
      ],
      conclusion:
        "$\\langle r^2(t)\\rangle=(6k_BT\\tau^2/M)[t/\\tau-(1-e^{-t/\\tau})]$，长时给 $D=Bk_BT$；外力 drift 的正负必须以 $F_{phys}=-\\partial_xU$ 与 Boltzmann equilibrium 核对。",
      checks: [
        "短时系数必须等于 ⟨v²⟩=3kBT/M。",
        "长时 slope 必须为 6D，且 D 的单位为 length²/time。",
        "把 feq∝e^{-βU} 代入 Fokker–Planck probability current，必须得到零。",
      ],
      evidence: [
        "课件 10 slide 10：三维 moment ODE、exact MSD 与 D=BkBT。",
        "课件 10 slide 15：∂f/∂t=B∂x(F_x f)+BkBT∂²f/∂x²；翻译审校标注 Fx 符号 convention 可能与 physical force F=−∂xU 相反。",
      ],
    },
  },
  {
    moduleId: "nonequilibrium",
    lecture: 10,
    slides: [9, 11],
    sourceTitle: "Noise correlations and fluctuation–dissipation",
    sourceFormulas: [
      "M dv/dt=-v/B+F(t)",
      "⟨F(t)⟩=0",
      "τ=MB",
      "v(ω)=∫dt v(t)e^{iωt}",
      "v(ω)=F(ω)/(1/B-iMω)",
      "⟨F(t₁)·F(t₂)⟩=K(t₁-t₂)",
      "⟨F(ω)·F(ω′)⟩=2πδ(ω+ω′)K(ω)",
      "⟨v²(t)⟩=∫dω/(2π) K(ω)/(1/B²+M²ω²)",
      "K(t)=Cδ(t)",
    ],
    derivation: {
      id: "teacher-l10-s11-fourier-langevin-noise-amplitude",
      title: "Fourier-space Langevin response 与白噪声强度",
      kind: "推导结果",
      origin:
        "对 Langevin equation 采用课件的 e^{iωt} Fourier convention，速度 response denominator 是 1/B−iMω。再以 equipartition 固定 white-noise amplitude。必须区分单个 Cartesian component correlation 与课件向量点积 correlation：三维 dot product 多一个 factor 3。",
      symbols: [
        { symbol: "B", meaning: "mobility，friction γ=1/B" },
        { symbol: "Fi", meaning: "random force 的第 i 个 Cartesian component" },
        { symbol: "C1", meaning: "per-component white-noise amplitude" },
        { symbol: "Kvec", meaning: "向量点积 ⟨F(t)·F(t′)⟩ 的 correlation" },
      ],
      prerequisites: ["Fourier transform of a derivative", "stationary correlation spectrum", "Lorentzian integral", "equipartition"],
      assumptions: [
        "三维 isotropic equilibrium bath，Markov/white-noise approximation",
        "Fourier convention v(ω)=∫dt v(t)e^{iωt}",
        "components uncorrelated and identical: ⟨FiFj⟩∝δij",
        "若 K 指单 component，则 C=2kBT/B；若 K 指课件显示的 vector dot，则三维 C=6kBT/B",
      ],
      steps: [
        {
          title: "写每个 component 的 Langevin equation",
          formula: "$M\\dot v_i(t)+\\frac{1}{B}v_i(t)=F_i(t)$",
          explanation:
            "isotropy 让三个 Cartesian components 遵循同一 scalar equation。",
        },
        {
          title: "按课件 convention 变换时间导数",
          formula: "$\\int_{-\\infty}^{\\infty}\\dot v_i(t)e^{i\\omega t}dt=-i\\omega v_i(\\omega)$",
          explanation:
            "integration by parts 后 boundary term 为零；e^{+iωt} convention 给 −iω。",
        },
        {
          title: "解出 frequency response",
          formula: "$v_i(\\omega)=\\frac{F_i(\\omega)}{B^{-1}-iM\\omega}$",
          explanation:
            "低频 response 约为 B，高频被惯性 Mω 抑制。",
        },
        {
          title: "定义 per-component white noise",
          formula: "$\\langle F_i(t)F_j(t')\\rangle=C_1\\delta_{ij}\\delta(t-t')$",
          explanation:
            "δ(t−t′) 表示 bath correlation time 比 τ=MB 短；δij 表示不同方向不相关。",
        },
        {
          title: "Fourier transform correlation",
          formula: "$\\langle F_i(\\omega)F_j(\\omega')\\rangle=2\\pi C_1\\delta_{ij}\\delta(\\omega+\\omega')$",
          explanation:
            "stationarity 产生总 frequency conservation δ(ω+ω′)，white noise 使 spectrum C1 与 ω 无关。",
        },
        {
          title: "写单 component velocity variance",
          formula: "$\\langle v_i^2\\rangle=\\int_{-\\infty}^{\\infty}\\frac{d\\omega}{2\\pi}\\frac{C_1}{B^{-2}+M^2\\omega^2}$",
          explanation:
            "response modulus squared 是 1/(B^{-2}+M²ω²)。",
        },
        {
          title: "完成 Lorentzian integral",
          formula: "$\\int_{-\\infty}^{\\infty}\\frac{d\\omega}{2\\pi}\\frac{1}{B^{-2}+M^2\\omega^2}=\\frac{B}{2M}$",
          explanation:
            "把 denominator 写成 M²[ω²+(MB)^{-2}]，再用 ∫dω/(ω²+a²)=π/a。",
        },
        {
          title: "用每 component 的 equipartition 固定 C1",
          formula: "$\\frac{C_1B}{2M}=\\langle v_i^2\\rangle=\\frac{k_B T}{M}\\quad\\Longrightarrow\\quad C_1=\\frac{2k_B T}{B}$",
          explanation:
            "噪声越强，velocity variance 越大；friction γ=1/B 越强，需要的 equilibrium noise amplitude 也越大。",
        },
        {
          title: "转换成课件的 vector-dot convention",
          formula: "$\\langle\\mathbf F(t)\\cdot\\mathbf F(t')\\rangle=\\sum_{i=1}^3C_1\\delta(t-t')=\\frac{6k_B T}{B}\\delta(t-t')$",
          explanation:
            "如果 K(t) 定义的是向量点积，三维要乘 3；若 K 是单 component correlation，就不能乘 3。",
        },
      ],
      conclusion:
        "$v_i(\\omega)=F_i(\\omega)/(B^{-1}-iM\\omega)$；equilibrium white noise 为 per-component $\\langle F_iF_j\\rangle=(2k_BT/B)\\delta_{ij}\\delta(t-t')$，三维 vector dot 则为 $(6k_BT/B)\\delta(t-t')$。",
      checks: [
        "用 e^{+iωt} convention 时 derivative 必须给 −iω。",
        "per-component variance 应为 kBT/M，vector variance 应为 3kBT/M。",
        "C1 的单位必须是 force²×time。",
      ],
      evidence: [
        "课件 10 slide 9：Mdv/dt=−v/B+F(t) 与 τ=MB。",
        "课件 10 slide 11：Fourier response、K correlation 与 white-noise ansatz。",
        "课件 10 slide 11 翻译审校：向量点积会带维数因子，必须统一 component/vector convention。",
      ],
    },
  },
  {
    moduleId: "nonequilibrium",
    lecture: 10,
    slides: [12],
    sourceTitle: "Master equation and detailed balance",
    sourceFormulas: [
      "∂_t p(a,t)=∫da′[W(a|a′)p(a′,t)-W(a′|a)p(a,t)]",
      "0=∫da′[W(a|a′)p_eq(a′)-W(a′|a)p_eq(a)]",
      "W(a|a′)/W(a′|a)=p_eq(a)/p_eq(a′)",
    ],
    derivation: {
      id: "teacher-l10-s12-stationarity-versus-detailed-balance",
      title: "Stationarity 为什么不等于 detailed balance",
      kind: "推导结果",
      origin:
        "master equation 只要求每个状态的总 inflow 减总 outflow。stationary distribution 令这个净和为零；detailed balance 更强，要求每一对状态的 probability current 都逐对为零。后一条件推出前者，反向一般不成立，非平衡稳态可以有循环 current。",
      symbols: [
        { symbol: "W(a|a′)", meaning: "从 a′ 跳到 a 的 transition rate" },
        { symbol: "peq(a)", meaning: "stationary candidate distribution" },
        { symbol: "J(a,a′)", meaning: "从 a′ 到 a 的净 pairwise probability current" },
      ],
      prerequisites: ["连续状态 master equation", "概率守恒", "transition rate"],
      assumptions: [
        "Markov jump process，rates 使所写积分存在",
        "detailed-balance ratio 只在正向、反向 rates 与 peq 相关值非零时直接相除",
        "stationary 不自动意味着 thermodynamic equilibrium",
      ],
      steps: [
        {
          title: "把 master equation 读成收入减支出",
          formula: "$\\partial_t p(a,t)=\\int da'\\,[W(a|a')p(a',t)-W(a'|a)p(a,t)]$",
          explanation:
            "第一项把其他状态的 probability 搬入 a，第二项把 a 的 probability 搬出。",
        },
        {
          title: "定义一对状态之间的净 current",
          formula: "$J(a,a';t)=W(a|a')p(a',t)-W(a'|a)p(a,t)$",
          explanation:
            "交换 a 与 a′ 后 J(a′,a)=−J(a,a′)，所以它有明确方向。",
        },
        {
          title: "stationarity 只约束 current 的积分",
          formula: "$\\partial_t p_{eq}(a)=0\\quad\\Longleftrightarrow\\quad\\int da'\\,J_{eq}(a,a')=0$",
          explanation:
            "不同 a′ 的非零 currents 可以互相抵消；这只是每个 state node 的 net current 为零。",
        },
        {
          title: "detailed balance 加上逐对条件",
          formula: "$J_{eq}(a,a')=0\\quad\\text{for every pair }(a,a')$",
          explanation:
            "它禁止任何 pairwise net flow，因此也禁止稳态循环 probability current。",
        },
        {
          title: "在非零权重处整理为课件 ratio",
          formula: "$W(a|a')p_{eq}(a')=W(a'|a)p_{eq}(a)\\quad\\Longrightarrow\\quad\\frac{W(a|a')}{W(a'|a)}=\\frac{p_{eq}(a)}{p_{eq}(a')}$",
          explanation:
            "这正是课件 detailed-balance formula；先写乘积等式比直接 ratio 更能处理 zero rate。",
        },
        {
          title: "证明 detailed balance 足以推出 stationarity",
          formula: "$J_{eq}(a,a')=0\\;\\forall a'\\quad\\Longrightarrow\\quad\\int da'J_{eq}(a,a')=0$",
          explanation:
            "逐项为零当然使总和为零，所以 detailed balance ⇒ stationarity。",
        },
        {
          title: "构造 stationary 但不 detailed-balanced 的环流",
          formula: "$1\\xrightarrow{r}2\\xrightarrow{r}3\\xrightarrow{r}1,\\quad1\\xleftarrow{s}2\\xleftarrow{s}3\\xleftarrow{s}1,\\quad p_i=\\frac13,\\quad r\\ne s$",
          explanation:
            "每个状态的总流入与总流出都是 (r+s)/3，所以 pi stationary；但每条边的净 current 是 (r−s)/3，不为零。",
        },
        {
          title: "写清逻辑关系",
          formula: "$\\text{detailed balance}\\;\\Longrightarrow\\;\\text{stationarity},\\qquad\\text{stationarity}\\;\\not\\Longrightarrow\\;\\text{detailed balance}$",
          explanation:
            "非平衡 steady state 可以在概率不随时间改变的同时持续产生环流与 entropy production。",
        },
      ],
      conclusion:
        "stationarity 只要求 $\\int da'J(a,a')=0$；detailed balance 要求每一对都满足 $J(a,a')=0$。因此 detailed balance 更强，反向推理一般错误。",
      checks: [
        "对 master equation 积分所有 a，总概率导数应因交换 a↔a′ 而为零。",
        "三状态环流例中逐点 dp_i/dt=0，但若 r≠s 每条边 current 非零。",
        "遇到 zero rate 时优先用乘积形式，不要盲目除法得到 ratio。",
      ],
      evidence: [
        "课件 10 slide 12：master equation、stationary integral condition 与 detailed-balance ratio。",
        "课件 10 slide 12 翻译审校：stationary 不必满足 detailed balance；非平衡稳态可有循环概率流。",
      ],
    },
  },
  {
    moduleId: "fermi-gas",
    lecture: 9,
    slides: [26, 27],
    sourceTitle: "General Sommerfeld series for Fermi functions",
    sourceFormulas: [
      "ξ=ln z=βμ",
      "f_ν(e^ξ)≈ξ^ν/Γ(ν+1)[1+ν(ν-1)π²/(6ξ²)+ν(ν-1)(ν-2)(ν-3)7π⁴/(360ξ⁴)+…]",
      "f_{5/2}(e^ξ)≈ξ^{5/2}/Γ(7/2)[1+5π²/(8ξ²)-7π⁴/(384ξ⁴)+…]",
      "f_{3/2}(e^ξ)≈ξ^{3/2}/Γ(5/2)[1+π²/(8ξ²)+7π⁴/(640ξ⁴)+…]",
      "f_{1/2}(e^ξ)≈ξ^{1/2}/Γ(3/2)[1-π²/(24ξ²)-7π⁴/(384ξ⁴)+…]",
    ],
    derivation: {
      id: "teacher-l09-s26-sommerfeld-fermi-functions",
      title: "把 Sommerfeld expansion 逐项应用到 fν",
      kind: "近似",
      origin:
        "把 Fermi integral 的积分变量写成 x、chemical potential 写成 ξ=βμ，就可直接套 Sommerfeld formula。对 H(x)=x^{ν−1}/Γ(ν) 求奇数阶导数，整理出课件通式；再代 ν=5/2、3/2、1/2。该展开是 ξ≫1 的 asymptotic series。",
      symbols: [
        { symbol: "ξ=lnz=βμ", meaning: "dimensionless chemical potential" },
        { symbol: "ν", meaning: "Fermi integral index" },
        { symbol: "Γ", meaning: "Gamma function" },
        { symbol: "H(x)", meaning: "Sommerfeld formula 中的平滑权函数" },
      ],
      prerequisites: ["Sommerfeld expansion", "Gamma recursion", "幂函数高阶导数"],
      assumptions: [
        "强简并低温区 ξ=βμ≫1",
        "H(x)=x^{ν−1}/Γ(ν) 在 x≈ξ 附近平滑",
        "所得级数为渐近展开；ξ 不大时应回到完整 Fermi integral",
      ],
      steps: [
        {
          title: "把 Fermi function 写成标准 kernel",
          formula: "$f_\\nu(e^\\xi)=\\frac{1}{\\Gamma(\\nu)}\\int_0^\\infty\\frac{x^{\\nu-1}}{e^{x-\\xi}+1}dx$",
          explanation:
            "因为 z=e^ξ，所以 z^{-1}e^x=e^{x−ξ}，Fermi edge 位于 x=ξ。",
        },
        {
          title: "写 Sommerfeld formula 到四阶",
          formula: "$\\int_0^\\infty\\frac{H(x)}{e^{x-\\xi}+1}dx\\simeq\\int_0^\\xi H(x)dx+\\frac{\\pi^2}{6}H'(\\xi)+\\frac{7\\pi^4}{360}H'''(\\xi)+\\cdots$",
          explanation:
            "Fermi edge 两侧的 thermal smearing 只产生偶次 1/ξ corrections，因此出现 H 的奇数阶导数。",
        },
        {
          title: "选取本题权函数并积分 leading term",
          formula: "$H(x)=\\frac{x^{\\nu-1}}{\\Gamma(\\nu)},\\qquad\\int_0^\\xi H(x)dx=\\frac{\\xi^\\nu}{\\Gamma(\\nu+1)}$",
          explanation:
            "使用 Γ(ν+1)=νΓ(ν)，把 leading term 写成课件 prefactor。",
        },
        {
          title: "计算一阶导数修正",
          formula: "$H'(\\xi)=\\frac{(\\nu-1)\\xi^{\\nu-2}}{\\Gamma(\\nu)}$",
          explanation:
            "除以 leading term 后得到相对系数 ν(ν−1)π²/(6ξ²)。",
        },
        {
          title: "计算三阶导数修正",
          formula: "$H'''(\\xi)=\\frac{(\\nu-1)(\\nu-2)(\\nu-3)\\xi^{\\nu-4}}{\\Gamma(\\nu)}$",
          explanation:
            "再除以 leading term，额外乘 ν，得到课件 7π⁴/360 的四阶相对项。",
        },
        {
          title: "组装一般 ν 的课件通式",
          formula: "$f_\\nu(e^\\xi)\\simeq\\frac{\\xi^\\nu}{\\Gamma(\\nu+1)}\\left[1+\\frac{\\nu(\\nu-1)\\pi^2}{6\\xi^2}+\\frac{7\\nu(\\nu-1)(\\nu-2)(\\nu-3)\\pi^4}{360\\xi^4}+\\cdots\\right]$",
          explanation:
            "每个 correction 都以 1/ξ 的偶次幂出现；系数符号由 ν 的连续乘积决定。",
        },
        {
          title: "代入 ν=5/2",
          formula: "$f_{5/2}(e^\\xi)\\simeq\\frac{\\xi^{5/2}}{\\Gamma(7/2)}\\left[1+\\frac{5\\pi^2}{8\\xi^2}-\\frac{7\\pi^4}{384\\xi^4}+\\cdots\\right]$",
          explanation:
            "(ν−3)=−1/2 使四阶项为负；这条函数用于 pressure 与 energy。",
        },
        {
          title: "代入 ν=3/2 与 1/2",
          formula: "$f_{3/2}\\simeq\\frac{\\xi^{3/2}}{\\Gamma(5/2)}\\left[1+\\frac{\\pi^2}{8\\xi^2}+\\frac{7\\pi^4}{640\\xi^4}\\right],\\quad f_{1/2}\\simeq\\frac{\\xi^{1/2}}{\\Gamma(3/2)}\\left[1-\\frac{\\pi^2}{24\\xi^2}-\\frac{7\\pi^4}{384\\xi^4}\\right]$",
          explanation:
            "f3/2 固定 particle number，f1/2 来自对 z 或 μ 求导；不同 ν 的符号不能靠替换指数猜测。",
        },
      ],
      conclusion:
        "令 $H(x)=x^{\\nu-1}/\\Gamma(\\nu)$ 后，Sommerfeld formula 直接生成课件的 $f_\\nu(e^\\xi)$ 通式和三个 half-integer 展开；适用条件是 $\\xi\\gg1$。",
      checks: [
        "leading term 必须是 ξ^ν/Γ(ν+1)，不是 ξ^{ν−1}/Γ(ν)。",
        "ν=5/2 的 1/ξ² 系数应为 5π²/8。",
        "ξ 不大时逐项修正不再递减，应停止使用该 asymptotic expansion。",
      ],
      evidence: [
        "课件 9 slide 26：general Sommerfeld series for fν(e^ξ)。",
        "课件 9 slide 27：ν=5/2、3/2、1/2 的显式系数。",
      ],
    },
  },
  {
    moduleId: "fermi-gas",
    lecture: 9,
    slides: [33, 34, 35],
    sourceTitle: "Finite-temperature Pauli paramagnetism: canonical setup",
    sourceFormulas: [
      "n_p^+,n_p^-=0 or 1",
      "E_n=∑p(n_p^++n_p^-)p²/(2m)-μ*B(N^+-N^-)",
      "N^++N^-=N",
      "Q(N)=∑_{N^+=0}^N e^{βμ*B(2N^+-N)}Q₀(N^+)Q₀(N-N^+)",
      "A₀(N±)=-kBT lnQ₀(N±)",
      "Q(N)=e^{-βμ*BN}∑_{N^+=0}^N e^{2βμ*BN^+}Q₀(N^+)Q₀(N-N^+)",
      "μ₀(N̄^+)-μ₀(N-N̄^+)=2μ*B",
      "N̄^+=(1+r)N/2, N̄^-=(1-r)N/2",
      "M=μ*Nr",
      "χ=M/(VB)=2nμ*²/[∂μ₀(xN)/∂x]_{x=1/2}",
      "χ≈χ₀[1-(π²/12)(kBT/ε_F)²]",
      "ε_F=ℏ²(6π²N/(gV))^{2/3}/(2m)",
    ],
    derivation: {
      id: "teacher-l09-s33-canonical-pauli-saddle",
      title: "教师的 canonical saddle 路线如何得到 Pauli χ(T)",
      kind: "近似",
      origin:
        "固定总 N，把 partition function 按自旋上支粒子数 N+ 分块。热力学极限中 N+ 的和由自由能 exponent 的最大项支配；stationarity 给两自旋组分的 chemical-potential difference 等于 Zeeman splitting。弱场展开得到 χ，再用低温 μ0(Ns,T) 的 Sommerfeld correction 得到 T² 衰减。",
      symbols: [
        { symbol: "μ*", meaning: "单电子磁矩大小；不是 chemical potential" },
        { symbol: "μ0(Ns,T)", meaning: "无磁场、单自旋 component 含 Ns 粒子时的 chemical potential" },
        { symbol: "N±", meaning: "两条 Zeeman branch 的粒子数" },
        { symbol: "r=(N+−N−)/N", meaning: "dimensionless spin polarization" },
        { symbol: "εF", meaning: "B=0、g=2 时总 density 对应的 Fermi energy" },
      ],
      prerequisites: ["canonical partition function", "Laplace/maximum-term approximation", "chemical potential as ∂A/∂N", "Sommerfeld μ(T)"],
      assumptions: [
        "三维理想 nonrelativistic electron gas，固定 N、V、T",
        "两自旋 components 除 Zeeman shift 外等价，B=0 时 g=2",
        "thermodynamic limit 使 N+ distribution sharply peaked",
        "弱场 |μ*B|≪εF、低温 kBT≪εF，只保留 B 的线性项与 T² correction",
      ],
      steps: [
        {
          title: "按 N+ 分解 fixed-N partition function",
          formula: "$Q(N)=\\sum_{N^+=0}^{N}e^{\\beta\\mu^*B(2N^+-N)}Q_0(N^+)Q_0(N-N^+)$",
          explanation:
            "选定 N+ 后 N−=N−N+；Zeeman energy −μ*B(N+−N−) 给显示的 exponential。",
        },
        {
          title: "把每项改写成 free-energy exponent",
          formula: "$Q(N)=\\sum_{N^+}\\exp\\{-\\beta[A_0(N^+)+A_0(N-N^+)-\\mu^*B(2N^+-N)]\\}$",
          explanation:
            "使用 A0(Ns)=−kBTlnQ0(Ns)；最大 Boltzmann weight 等价于最小 bracketed free energy。",
        },
        {
          title: "对 N+ 取 saddle condition",
          formula: "$0=\\frac{\\partial A_0(N^+)}{\\partial N^+}-\\frac{\\partial A_0(N-N^+)}{\\partial(N-N^+)}-2\\mu^*B$",
          explanation:
            "第二项的 chain-rule minus 与外场项的 −2μ*B 一起给平衡 chemical-potential difference。",
        },
        {
          title: "识别每个 component 的 chemical potential",
          formula: "$\\mu_0(\\bar N^+)-\\mu_0(N-\\bar N^+)=2\\mu^*B$",
          explanation:
            "把一个电子从 − branch 搬到 + branch 的 free-energy cost，平衡时等于 Zeeman energy gain。",
        },
        {
          title: "用 polarization 参数化两组分",
          formula: "$\\bar N^+=\\frac{1+r}{2}N,\\qquad\\bar N^-=\\frac{1-r}{2}N,\\qquad M=\\mu^*Nr$",
          explanation:
            "r=0 是无磁场等占据，弱场时 r 是 O(B) 小量。",
        },
        {
          title: "在 x=1/2 周围线性展开",
          formula: "$\\mu_0[(1+r)N/2]-\\mu_0[(1-r)N/2]\\simeq r\\left.\\frac{\\partial\\mu_0(xN)}{\\partial x}\\right|_{x=1/2}$",
          explanation:
            "两边 Taylor expansion 的偶次项相消，两个一阶位移 r/2 相加成 r。",
        },
        {
          title: "解出 r 与 susceptibility",
          formula: "$r=\\frac{2\\mu^*B}{[\\partial_x\\mu_0(xN)]_{1/2}},\\qquad\\chi=\\frac{M}{VB}=\\frac{2n\\mu^{*2}}{[\\partial_x\\mu_0(xN)]_{1/2}}$",
          explanation:
            "这就是课件 canonical saddle route 的一般形式，尚未使用具体低温 equation of state。",
        },
        {
          title: "先在 T=0 评估 derivative",
          formula: "$\\mu_0(xN,0)=\\varepsilon_F(2x)^{2/3}\\quad\\Longrightarrow\\quad[\\partial_x\\mu_0]_{1/2}=\\frac{4}{3}\\varepsilon_F$",
          explanation:
            "每个 spin component 的 density 是 xn；在 x=1/2 时恰好恢复 g=2 的 unpolarized εF。",
        },
        {
          title: "恢复零温 Pauli susceptibility",
          formula: "$\\chi_0=\\frac{2n\\mu^{*2}}{4\\varepsilon_F/3}=\\frac{3n\\mu^{*2}}{2\\varepsilon_F}$",
          explanation:
            "只有 Fermi surface 附近可重新分配的电子响应，而不是全部电子作 classical Curie response。",
        },
        {
          title: "加入 fixed-component-density 的低温 μ0",
          formula: "$\\mu_0(xN,T)\\simeq\\varepsilon_F(2x)^{2/3}-\\frac{\\pi^2(k_B T)^2}{12\\varepsilon_F(2x)^{2/3}}$",
          explanation:
            "这是每个 component 的 Sommerfeld chemical-potential correction；density xN/V 固定。",
        },
        {
          title: "求导再取倒数",
          formula: "$[\\partial_x\\mu_0]_{1/2}=\\frac{4\\varepsilon_F}{3}\\left[1+\\frac{\\pi^2}{12}\\left(\\frac{k_B T}{\\varepsilon_F}\\right)^2\\right]\\Longrightarrow\\chi\\simeq\\chi_0\\left[1-\\frac{\\pi^2}{12}\\left(\\frac{k_B T}{\\varepsilon_F}\\right)^2\\right]$",
          explanation:
            "对 1/(1+δ) 展开为 1−δ；升温轻微降低 ideal-gas Pauli susceptibility。",
        },
      ],
      conclusion:
        "canonical fixed-$N$ 的 $N^+$ saddle 给 $\\chi=2n\\mu^{*2}/[\\partial_x\\mu_0(xN)]_{1/2}$，低温弱场下为 $\\chi_0[1-(\\pi^2/12)(k_BT/\\varepsilon_F)^2]$。",
      checks: [
        "μ* 是磁矩，不能与 chemical potential μ0 混写。",
        "B→0 时 r→0，且 χ 保持有限。",
        "T=0 derivative 4εF/3 必须恢复 χ0=3nμ*²/(2εF)。",
      ],
      evidence: [
        "课件 9 slide 33：fixed-N canonical sum over N+。",
        "课件 9 slide 34：maximum-term condition μ0(N+)−μ0(N−)=2μ*B。",
        "课件 9 slide 35：r、M、χ 的 derivative form 与低温 T² correction。",
      ],
    },
  },
];
