import {
  deepDiveFormulaKey,
  type FormulaDerivation,
} from "./formula-derivation-types";

const ps1Q1Conclusion =
  "$$\\det J=1+\\mathcal O(\\delta t^2);\\quad \\rho_{\\mathrm{eq}}=Z^{-1}e^{-\\beta H};\\quad \\partial_t\\rho_{\\mathrm{eq}}+\\{\\rho_{\\mathrm{eq}},H\\}=0$$";
const masslessGasConclusion =
  "$$\\Gamma(E,L,N)=\\frac{L^N}{N!h^N}\\frac{2^N(E/c)^N}{N!};\\quad E=Nk_{\\mathrm B}T;\\quad PL=Nk_{\\mathrm B}T;\\quad C_V=Nk_{\\mathrm B};\\quad C_P=2Nk_{\\mathrm B};\\quad p(p)=\\frac{\\beta c}{2}e^{-\\beta c|p|}$$";
const generalizedEquipartitionConclusion =
  "$$\\left\\langle x_i\\frac{\\partial H}{\\partial x_j}\\right\\rangle=k_{\\mathrm B}T\\,\\delta_{ij}$$";
const adsorptionConclusion =
  "$$\\Xi=\\left[1+e^{\\beta(\\mu+\\varepsilon)}\\right]^{N_{\\mathrm{site}}};\\quad \\langle M\\rangle=\\frac{N_{\\mathrm{site}}}{1+e^{-\\beta(\\mu+\\varepsilon)}};\\quad \\operatorname{Var}(M)=N_{\\mathrm{site}}f(1-f)$$";
const virialClusterConclusion =
  "$$\\frac{P}{nk_{\\mathrm B}T}=1+B_2(T)n+B_3(T)n^2+\\cdots;\\quad f(r)=e^{-\\beta U(r)}-1$$";
const isingTransferConclusion =
  "$$Z=\\operatorname{Tr}(T^N)=\\lambda_+^N+\\lambda_-^N;\\quad \\xi^{-1}=\\ln\\frac{\\lambda_+}{|\\lambda_-|};\\quad T_c=0$$";
const linearBoseConclusion =
  "$$\\frac{D(\\varepsilon)}{V}=\\frac{g_d\\varepsilon^2}{2\\pi^2(\\hbar c)^3};\\quad n_{\\mathrm{exc}}\\propto T^3g_3(z);\\quad P\\propto T^4g_4(z);\\quad U=3PV;\\quad T_c\\propto n^{1/3};\\quad \\frac{C_V(T_c^-)}{Nk_{\\mathrm B}}=\\frac{12\\zeta(4)}{\\zeta(3)}$$";
const trappedBoseConclusion =
  "$$N_{\\mathrm{exc}}=\\left(\\frac{k_{\\mathrm B}T}{\\hbar\\bar\\omega}\\right)^3g_3(z);\\quad T_c=\\frac{\\hbar\\bar\\omega}{k_{\\mathrm B}}\\left[\\frac{N}{\\zeta(3)}\\right]^{1/3};\\quad \\frac{N_0}{N}=1-\\left(\\frac{T}{T_c}\\right)^3$$";
const boseFunctionConclusion =
  "$$D(\\varepsilon)=C\\varepsilon^{s-1}\\Longrightarrow N_{\\mathrm{exc}}=C\\Gamma(s)(k_{\\mathrm B}T)^sg_s(z);\\quad U=C\\Gamma(s+1)(k_{\\mathrm B}T)^{s+1}g_{s+1}(z)$$";
const smoluchowskiConclusion =
  "$$m\\dot v=-\\gamma v-U'(x)+\\xi(t)\\longrightarrow \\gamma\\dot x=-U'(x)+\\xi(t)\\longrightarrow \\partial_tP=\\partial_x\\left[\\frac{U'(x)}{\\gamma}P+D\\partial_xP\\right]$$";

export const supplementalFormulaDerivations: Record<string, FormulaDerivation> =
  {
    [deepDiveFormulaKey(
      "phase-ensemble",
      "作业 1 Q1 的答题骨架",
      ps1Q1Conclusion,
    )]: {
      id: "supplemental-ps1-q1-jacobian-maxent-stationarity",
      title: "作业 1 Q1：Jacobian、最大熵与平衡驻定的完整闭环",
      kind: "解题框架",
      origin:
        "Problem Set 1 Q1 把三件事串成一题：Hamilton 小时间映射先保证相空间体积不压缩；带约束的最大熵再选择 canonical 权重；最后用 Liouville 方程验证该权重不随时间改变。",
      symbols: [
        {
          symbol: "J",
          meaning: "从 (q,p) 到 (q′,p′) 的小时间映射 Jacobian 矩阵",
        },
        { symbol: "δt", meaning: "用于一阶展开的短时间步长" },
        { symbol: "ρ", meaning: "相空间概率密度，满足 ∫dΓρ=1" },
        {
          symbol: "β",
          meaning: "平均能量约束的 Lagrange multiplier；平衡时 β=1/(kBT)",
        },
        {
          symbol: "Z",
          meaning: "使 e^{−βH} 归一化的 canonical partition function",
        },
      ],
      prerequisites: [
        "Hamilton 方程 q̇i=∂H/∂pi、ṗi=−∂H/∂qi",
        "det(I+δtM)=1+δtTrM+O(δt²)",
        "带归一化与平均能量约束的变分法",
        "Liouville 方程与 Poisson bracket",
      ],
      assumptions: [
        "H 对 canonical 坐标至少二阶连续，使混合偏导可交换",
        "动力学为封闭 Hamilton 流，没有非保守源汇",
        "ρ 可归一化，且最大熵变分的边界项合法",
        "canonical 平衡只施加归一化与固定平均能量两项约束",
      ],
      steps: [
        {
          title: "把 Hamilton 轨迹推进一个短时间步",
          formula: "qi′=qi+q̇iδt;  pi′=pi+ṗiδt",
          explanation:
            "只保留 δt 的一阶项；这个映射把旧相空间小体积送到新位置，体积变化由其 Jacobian determinant 决定。",
        },
        {
          title: "展开 Jacobian determinant",
          formula:
            "$$J=I+\\delta t\\,M\\Longrightarrow \\det J=1+\\delta t\\,\\operatorname{Tr}M+\\mathcal O(\\delta t^2)$$",
          explanation:
            "M 是相空间速度场对 (q,p) 的导数矩阵；一阶体积变化只看它的 trace，也就是相空间散度。",
        },
        {
          title: "用 Hamilton 方程令相空间散度归零",
          formula:
            "$$\\operatorname{Tr}M=\\sum_i\\left(\\partial_{q_i}\\dot q_i+\\partial_{p_i}\\dot p_i\\right)=\\sum_i\\left(\\partial_{q_i}\\partial_{p_i}H-\\partial_{p_i}\\partial_{q_i}H\\right)=0$$",
          explanation:
            "每一对混合偏导恰好抵消，因此 detJ 在一阶等于 1；这就是 Liouville 体积守恒的小时间证明。",
        },
        {
          title: "在两个约束下极大化 Gibbs entropy",
          formula:
            "$$\\delta\\!\\left\\{-\\int d\\Gamma\\,\\rho\\ln\\rho-\\alpha\\left(\\int d\\Gamma\\,\\rho-1\\right)-\\beta\\left(\\int d\\Gamma\\,\\rho H-E\\right)\\right\\}=0$$",
          explanation:
            "α 负责归一化，β 负责固定平均能量；两项必须同时出现，否则无法得到归一化且能量受控的平衡分布。",
        },
        {
          title: "解 Euler 条件并由归一化确定 Z",
          formula: "−lnρ−1−α−βH=0  ⇒  ρeq=Z⁻¹e^{−βH};  Z=∫dΓe^{−βH}",
          explanation:
            "指数形式不是猜出来的；它是受约束 entropy 极值的一阶条件。Z 吸收常数 e^{−1−α} 并保证总概率为一。",
        },
        {
          title: "把结果代回 Liouville 方程验 stationary",
          formula:
            "$$\\partial_t\\rho_{\\mathrm{eq}}+\\{\\rho_{\\mathrm{eq}},H\\}=0+\\frac{d\\rho_{\\mathrm{eq}}}{dH}\\{H,H\\}=0$$",
          explanation:
            "ρeq 没有显含时间且只依赖守恒的 H；Poisson bracket 的反对称性给 {H,H}=0，所以这个分布确实驻定。",
        },
      ],
      conclusion: ps1Q1Conclusion,
      checks: [
        "detJ=1+O(δt²) 只声称短时间一阶体积不变；连续复合短步才给有限时间的 Hamilton 体积守恒。",
        "若最大熵式漏掉负号，会把 entropy maximum 误写成 minimum；应以 S=−kB∫ρlnρ 为准。",
        "把 ρeq 归一化后应有 ∫dΓρeq=1；代回 Liouville 后每一项量纲都是概率密度除以时间。",
      ],
      evidence: [
        "Problem Set 1 题面 p.1；solution pp.1–3",
        "课件 2 slides 8–16",
      ],
    },

    [deepDiveFormulaKey(
      "classical-gases",
      "作业 1 Q3：一维质量为零相对论气体",
      masslessGasConclusion,
    )]: {
      id: "supplemental-ps1-q3-one-dimensional-massless-gas",
      title: "作业 1 Q3：从 L1 动量球到状态方程、热容与边缘分布",
      kind: "推导结果",
      origin:
        "Problem Set 1 Q3 的粒子满足 ε=c|p|。能量约束因此不是 Euclidean 球，而是 N 维 L1 球；先数累计相空间体积，再由 entropy derivatives 与 canonical 边缘完成整题。",
      symbols: [
        { symbol: "L", meaning: "一维容器长度" },
        { symbol: "c", meaning: "线性色散 ε=c|p| 中的速度常数" },
        { symbol: "Γ(E,L,N)", meaning: "除去 N!hᴺ 后的无量纲累计态数" },
        { symbol: "P", meaning: "与长度 L 共轭的一维 pressure/force" },
        { symbol: "p(p)", meaning: "单个粒子动量的归一化概率密度" },
      ],
      prerequisites: [
        "N 维 simplex 体积 Rᴺ/N!",
        "全同经典粒子的 Gibbs factor 1/N!",
        "微正则关系 S=kBlnΓ 与 dS=(1/T)dE+(P/T)dL−(μ/T)dN",
        "一维绝对值指数积分",
      ],
      assumptions: [
        "N 个不可分辨、无相互作用的经典粒子，Hamiltonian H=cΣi|pi|",
        "位置可独立遍历长度 L，边界效应忽略",
        "采用累计计数 Γ(H≤E)；薄壳定义只造成有限 N 的次领先差异",
        "热容结论固定 N，并取热力学极限使用 Stirling 近似",
      ],
      steps: [
        {
          title: "识别动量允许域为 L1 球",
          formula: "H≤E  ⇔  Σi|pi|≤E/c",
          explanation:
            "二次色散会给普通球；这里每个能量对 |p| 线性，所以边界是交叉多面体。先认对几何形状，后面的 E 次幂才不会错。",
        },
        {
          title: "按 2ᴺ 个正负正交区数体积",
          formula:
            "$$\\int_{\\sum_i|p_i|\\le E/c}d^Np=\\frac{2^N(E/c)^N}{N!}$$",
          explanation:
            "每个正交区令 ui=|pi|≥0，得到 Σui≤E/c 的 simplex，体积为 (E/c)ᴺ/N!；除零测度边界外共有 2ᴺ 个符号选择。",
        },
        {
          title: "乘位置体积并去除 cell 与标签重复",
          formula: "Γ(E,L,N)=[1/(N!hᴺ)]Lᴺ·[2ᴺ(E/c)ᴺ/N!]",
          explanation:
            "Lᴺ 来自 N 个位置积分；hᴺ 使计数无量纲，第一个 N! 去除全同粒子标签。第二个 N! 来自动量 simplex 几何，二者来源不同，不能合并后忘掉。",
        },
        {
          title: "由 entropy 的 E、L 偏导读出热学方程",
          formula:
            "$$S=k_{\\mathrm B}\\ln\\Gamma\\Longrightarrow \\frac1T=\\left(\\frac{\\partial S}{\\partial E}\\right)_{L,N}=\\frac{Nk_{\\mathrm B}}E,\\quad \\frac PT=\\left(\\frac{\\partial S}{\\partial L}\\right)_{E,N}=\\frac{Nk_{\\mathrm B}}L$$",
          explanation:
            "因此 E=NkBT 且 PL=NkBT。若改用能量薄壳，E 的幂为 N−1；差别是有限 N 的 O(1/N)，热力学极限回到同一结果。",
        },
        {
          title: "分别沿定长与定压路径求热容",
          formula:
            "$$C_V=\\left(\\frac{\\partial E}{\\partial T}\\right)_{L,N}=Nk_{\\mathrm B},\\quad C_P=\\left[\\frac{\\partial(E+PL)}{\\partial T}\\right]_{P,N}=2Nk_{\\mathrm B}$$",
          explanation:
            "一维定压热容要对 enthalpy-like quantity E+PL 求导；只对 E 求导会漏掉维持 pressure 时的边界功。",
        },
        {
          title: "归一化单粒子 canonical 动量边缘",
          formula:
            "$$z_p=\\int_{-\\infty}^{\\infty}dp\\,e^{-\\beta c|p|}=\\frac{2}{\\beta c}\\Longrightarrow p(p)=z_p^{-1}e^{-\\beta c|p|}$$",
          explanation:
            "绝对值使左右两半贡献相同。代入 zp 后得到 (βc/2)e^{−βc|p|}；它也可由其余 N−1 粒子的 bath state ratio 在大 N 极限得到。",
        },
      ],
      conclusion: masslessGasConclusion,
      checks: [
        "Lᴺdᴺp/hᴺ 无量纲；若漏 hᴺ，lnΓ 会对有量纲量取对数。",
        "p(p) 关于 p 偶对称，且 ∫₋∞^∞p(p)dp=1。",
        "线性色散在一维给 E/N=kBT；这与 quadratic dispersion 的 kBT/2 不同。",
      ],
      evidence: [
        "Problem Set 1 题面 pp.1–2；solution pp.6–8",
        "课件 3 slides 16–23",
      ],
    },

    [deepDiveFormulaKey(
      "canonical",
      "virial theorem 与 generalized equipartition",
      generalizedEquipartitionConclusion,
    )]: {
      id: "supplemental-generalized-equipartition-integration-by-parts",
      title: "generalized equipartition：一次 canonical 分部积分",
      kind: "推导结果",
      origin:
        "课件 4 slide 13 的 generalized equipartition。核心不是背结论，而是把 Boltzmann factor 的导数换成 ∂H，再检查分部积分边界项何时消失。",
      symbols: [
        { symbol: "xi,xj", meaning: "相空间 canonical 坐标中的任意两个分量" },
        { symbol: "Z", meaning: "canonical partition function" },
        { symbol: "β=1/(kBT)", meaning: "逆温度" },
        { symbol: "δij", meaning: "Kronecker delta；i=j 时为 1，否则为 0" },
      ],
      prerequisites: [
        "canonical average ⟨A⟩=Z⁻¹∫dΓAe^{−βH}",
        "链式法则 ∂xj e^{−βH}=−β(∂xjH)e^{−βH}",
        "一维分部积分与边界项",
      ],
      assumptions: [
        "积分测度与所选 canonical 坐标相容",
        "在积分边界上 xi e^{−βH} 的贡献为零，或周期边界贡献相消",
        "Z 有限且 H 对 xj 可微",
        "硬墙、受限角变量或奇异势需单独重审边界项",
      ],
      steps: [
        {
          title: "从 canonical expectation 写成积分",
          formula:
            "$$\\left\\langle x_i\\frac{\\partial H}{\\partial x_j}\\right\\rangle=Z^{-1}\\int d\\Gamma\\,x_i\\frac{\\partial H}{\\partial x_j}e^{-\\beta H}$$",
          explanation:
            "先保留完整归一化 Z；积分中除 xj 外的其余变量可视为参数。",
        },
        {
          title: "用 Boltzmann factor 的导数替换 ∂H",
          formula:
            "$$\\frac{\\partial H}{\\partial x_j}e^{-\\beta H}=-\\beta^{-1}\\frac{\\partial}{\\partial x_j}e^{-\\beta H}$$",
          explanation:
            "这一步把 Hamiltonian derivative 变成全导数，才可以直接分部积分。",
        },
        {
          title: "对 xj 分部积分",
          formula:
            "$$\\left\\langle x_i\\frac{\\partial H}{\\partial x_j}\\right\\rangle=-\\frac{1}{\\beta Z}\\left[x_i e^{-\\beta H}\\right]_{\\mathrm{boundary}}+\\frac{1}{\\beta Z}\\int d\\Gamma\\,\\frac{\\partial x_i}{\\partial x_j}e^{-\\beta H}$$",
          explanation: "第一项是必须检查的边界项；第二项中 ∂xjxi=δij。",
        },
        {
          title: "边界项消失后约掉 Z",
          formula:
            "$$\\left\\langle x_i\\frac{\\partial H}{\\partial x_j}\\right\\rangle=\\beta^{-1}\\delta_{ij}Z^{-1}\\int d\\Gamma\\,e^{-\\beta H}=k_{\\mathrm B}T\\,\\delta_{ij}$$",
          explanation:
            "积分就是 Z，所以只剩 β⁻¹δij。结论同时包含对角的能量分配和非对角的零相关。",
        },
        {
          title: "把 generalized result 还原成常见二次项",
          formula: "H=pi²/(2m)  ⇒  ⟨pi∂H/∂pi⟩=⟨pi²/m⟩=kBT",
          explanation:
            "因此该二次动能本身是 ⟨pi²/(2m)⟩=kBT/2；harmonic coordinate 的 kqi²/2 完全同理。",
        },
      ],
      conclusion: generalizedEquipartitionConclusion,
      checks: [
        "i≠j 时右边为零；若算出普遍非零，应回查坐标、边界或 Hamiltonian coupling。",
        "结论给的是 ⟨xi∂xjH⟩，不是无条件声称每个任意能量项都等于 kBT/2。",
        "对 quadratic term，先得到 ⟨pi²/m⟩=kBT，再除以 2 才是平均能量。",
      ],
      evidence: ["课件 4 slide 13"],
    },

    [deepDiveFormulaKey(
      "grand-canonical",
      "作业 2 Q3：吸附模型完整路线",
      adsorptionConclusion,
    )]: {
      id: "supplemental-ps2-q3-independent-site-adsorption",
      title: "作业 2 Q3：二项式 grand sum、平均吸附数与涨落",
      kind: "推导结果",
      origin:
        "Problem Set 2 Q3。采用一致约定：ε>0 是 binding energy 的大小，每个已占据位置能量为 −ε；因此 grand weight 中出现 μ+ε。",
      symbols: [
        {
          symbol: "Nsite",
          meaning: "相互独立、每个至多容纳一粒子的吸附位置数",
        },
        { symbol: "M", meaning: "实际被占据的位置数，0≤M≤Nsite" },
        { symbol: "ε>0", meaning: "binding energy 大小；占据能级为 −ε" },
        {
          symbol: "q=e^{β(μ+ε)}",
          meaning: "单位置被占据相对于空位的 grand weight",
        },
        { symbol: "f=⟨M⟩/Nsite", meaning: "平均占据比例" },
      ],
      prerequisites: [
        "grand-canonical 权重 e^{−β(E−μN)}",
        "二项式定理 ΣM C(N,M)qᴹ=(1+q)ᴺ",
        "⟨M⟩=β⁻¹∂μlnΞ 与 Var(M)=β⁻²∂μ²lnΞ",
      ],
      assumptions: [
        "每个 site 只有 empty/occupied 两态，且至多容纳一个粒子",
        "不同 sites 彼此独立，没有 lateral interaction",
        "全题固定采用 occupied energy −ε；若把 ε 定义成能级本身，所有 μ+ε 要一致改为 μ−ε",
        "系统与外部 reservoir 处于同一 T、μ",
      ],
      steps: [
        {
          title: "写固定 M 的能量、简并与 grand weight",
          formula:
            "$$E(M)=-M\\varepsilon,\\quad \\Gamma(M)=\\binom{N_{\\mathrm{site}}}{M},\\quad w_M=\\binom{N_{\\mathrm{site}}}{M}e^{\\beta(\\mu+\\varepsilon)M}$$",
          explanation:
            "从 Nsite 个位置选 M 个产生组合数；−β[E(M)−μM]=β(μ+ε)M，符号由 binding-energy 约定唯一决定。",
        },
        {
          title: "用二项式定理完成 grand sum",
          formula:
            "$$\\Xi=\\sum_{M=0}^{N_{\\mathrm{site}}}\\binom{N_{\\mathrm{site}}}{M}q^M=(1+q)^{N_{\\mathrm{site}}},\\quad q=e^{\\beta(\\mu+\\varepsilon)}$$",
          explanation:
            "也可从单 site 的 Ξ1=1+q 出发，再利用独立性取 Nsite 次方；两条路线必须相同。",
        },
        {
          title: "对 chemical potential 求一阶导得到平均数",
          formula:
            "$$\\langle M\\rangle=\\frac1\\beta\\frac{\\partial\\ln\\Xi}{\\partial\\mu}=N_{\\mathrm{site}}\\frac q{1+q}=\\frac{N_{\\mathrm{site}}}{1+e^{-\\beta(\\mu+\\varepsilon)}}$$",
          explanation:
            "占据比例 f=q/(1+q) 是 logistic 形式。它看起来像 Fermi factor，是因为每个位置只有 0/1 两态，并不表示吸附粒子必须是 Fermion。",
        },
        {
          title: "再求一次导数得到 number variance",
          formula:
            "$$\\operatorname{Var}(M)=\\frac1{\\beta^2}\\frac{\\partial^2\\ln\\Xi}{\\partial\\mu^2}=N_{\\mathrm{site}}\\frac q{(1+q)^2}=N_{\\mathrm{site}}f(1-f)$$",
          explanation:
            "独立 sites 等价于 Nsite 个 Bernoulli variables，方差相加后也得到同一二项式结果。",
        },
        {
          title: "用最大项路线交叉核对",
          formula:
            "$$\\frac{w_{M+1}}{w_M}=\\frac{N_{\\mathrm{site}}-M}{M+1}\\,q\\approx1\\Longrightarrow \\frac{M}{N_{\\mathrm{site}}}\\approx\\frac q{1+q}$$",
          explanation:
            "大 Nsite 时分布尖锐，most probable M 与 ensemble average 的相对差趋零；有限系统中两者概念仍应区分。",
        },
      ],
      conclusion: adsorptionConclusion,
      checks: [
        "μ+ε→−∞ 时 f→0；μ+ε→+∞ 时 f→1，符合空位与饱和极限。",
        "0≤Var(M)=Nsite f(1−f)≤Nsite/4，最大涨落出现在半占据。",
        "若选择 occupied energy +ε 的另一约定，必须整题把 μ+ε 换成 μ−ε，不能只改最终答案。",
      ],
      evidence: [
        "Problem Set 2 题面 p.2；solution pp.3–6",
        "课件 5 slides 8–13",
      ],
    },

    [deepDiveFormulaKey(
      "interactions-vdw",
      "virial/cluster expansion 只需掌握层级",
      virialClusterConclusion,
    )]: {
      id: "supplemental-mayer-function-virial-expansion",
      title: "从 Mayer f-function 到低密度 virial expansion",
      kind: "解题框架",
      origin:
        "课件 6 slide 5 的层级图：把 pair-potential Boltzmann factor 写成 1+f，再按连通 clusters 组织低密度修正；本课程只需推到 B2 并理解其符号。",
      symbols: [
        { symbol: "n=N/V", meaning: "number density" },
        { symbol: "U(r)", meaning: "两粒子相距 r 时的 pair potential" },
        { symbol: "f(r)", meaning: "Mayer function，等于 e^{−βU(r)}−1" },
        { symbol: "Bk(T)", meaning: "第 k virial coefficient" },
      ],
      prerequisites: [
        "经典 canonical configurational integral",
        "Boltzmann factor 与低密度展开",
        "grand potential 中 lnΞ 只保留 connected clusters 的基本结论",
      ],
      assumptions: [
        "相互作用可写成稳定、短程、pairwise additive potential",
        "密度足够低，使按 n 的 virial series 有效",
        "体系均匀且处于热力学极限",
        "∫d³r|f(r)| 收敛；长程 Coulomb 情形不能直接套用",
      ],
      steps: [
        {
          title: "把总相互作用 Boltzmann factor 分解到每一对",
          formula:
            "$$U_{\\mathrm{int}}=\\sum_{i<j}U(r_{ij})\\Longrightarrow e^{-\\beta U_{\\mathrm{int}}}=\\prod_{i<j}e^{-\\beta U(r_{ij})}$$",
          explanation:
            "pairwise additivity 把指数中的和变成所有 particle pairs 的乘积。",
        },
        {
          title: "定义 Mayer function",
          formula:
            "$$f_{ij}=e^{-\\beta U(r_{ij})}-1\\Longrightarrow e^{-\\beta U_{\\mathrm{int}}}=\\prod_{i<j}(1+f_{ij})$$",
          explanation:
            "理想气体对应 f=0。展开乘积时，每个 f-bond 代表一对粒子的 correlation correction。",
        },
        {
          title: "从乘积展开辨认 cluster 层级",
          formula:
            "$$\\prod_{i<j}(1+f_{ij})=1+\\sum_{i<j}f_{ij}+\\sum_{(i,j)<(k,l)}f_{ij}f_{kl}+\\cdots$$",
          explanation:
            "单 bond 给首个两体修正；更多相连 bonds 生成三体及更高 clusters。取 lnΞ 会去掉彼此不连通的重复乘积，使 pressure 保持 extensive。",
        },
        {
          title: "两体 connected cluster 给第二 virial coefficient",
          formula:
            "$$B_2(T)=-\\frac12\\int_{\\mathbb R^3}d^3r\\,f(r)=-\\frac12\\int_{\\mathbb R^3}d^3r\\left[e^{-\\beta U(r)}-1\\right]$$",
          explanation:
            "1/2 去除 pair 双计数。B2 已经把微观 pair potential 压缩成一个随温度变化的宏观系数。",
        },
        {
          title: "按密度写 equation of state",
          formula:
            "$$P=nk_{\\mathrm B}T\\left[1+B_2(T)n+B_3(T)n^2+\\cdots\\right]$$",
          explanation:
            "第一项是理想气体；Bk n^{k−1} 是 k-body cluster 层级在稀薄极限留下的修正。",
        },
      ],
      conclusion: virialClusterConclusion,
      checks: [
        "硬核区 U=+∞ 给 f=−1，因此排斥贡献使 B2>0、同密度下 pressure 高于理想气体。",
        "吸引区 U<0 给 f>0，因此可使 B2<0。",
        "Bk 的量纲应为 volume^{k−1}，所以每一项 Bk n^{k−1} 都无量纲。",
      ],
      evidence: ["课件 6 slide 5"],
    },

    [deepDiveFormulaKey(
      "phase-transition",
      "1D Ising transfer matrix：为何有限温度无相变",
      isingTransferConclusion,
    )]: {
      id: "supplemental-one-dimensional-ising-transfer-matrix",
      title:
        "1D Ising transfer matrix：partition sum、correlation length 与 Tc=0",
      kind: "推导结果",
      origin:
        "课件 6 slides 25–29 的 exact one-dimensional check。transfer matrix 把相邻 bond 权重变成 2×2 matrix；最大 eigenvalue 控制 free energy，eigenvalue ratio 控制 correlations。",
      symbols: [
        { symbol: "σi=±1", meaning: "第 i 个 Ising spin" },
        { symbol: "J>0", meaning: "ferromagnetic nearest-neighbour coupling" },
        { symbol: "h", meaning: "external field" },
        {
          symbol: "λ+,λ−",
          meaning: "transfer matrix 的两个 eigenvalues，|λ+|≥|λ−|",
        },
        { symbol: "ξ", meaning: "spin correlation length" },
      ],
      prerequisites: [
        "nearest-neighbour Ising Hamiltonian",
        "2×2 matrix diagonalization",
        "热力学极限中最大指数项主导",
        "correlation function 的指数衰减",
      ],
      assumptions: [
        "一维周期链，N 个 spins，只有有限程 nearest-neighbour coupling",
        "J 有限且 T>0；Tc 结论指 thermodynamic limit",
        "correlation-length 简式在 h=0 下书写",
        "ferromagnetic case J>0",
      ],
      steps: [
        {
          title: "把每条 bond 的 Boltzmann weight 写成矩阵元",
          formula: "T_{σσ′}=e^{βJσσ′+βh(σ+σ′)/2}",
          explanation:
            "把 field energy 平分给 bond 两端后，相邻 spins 的权重只依赖 σ、σ′，因此可组成 2×2 transfer matrix。",
        },
        {
          title: "周期边界把 spin sum 化成 matrix trace",
          formula:
            "$$Z=\\sum_{\\sigma_1=\\pm1}\\cdots\\sum_{\\sigma_N=\\pm1}T_{\\sigma_1\\sigma_2}\\cdots T_{\\sigma_N\\sigma_1}=\\operatorname{Tr}(T^N)=\\lambda_+^N+\\lambda_-^N$$",
          explanation:
            "对 T 对角化后，Tᴺ 的 trace 等于两个 eigenvalues 的 N 次方之和。",
        },
        {
          title: "零场 eigenvalues 可直接求出",
          formula:
            "$$h=0:\\quad T=\\begin{pmatrix}e^{\\beta J}&e^{-\\beta J}\\\\e^{-\\beta J}&e^{\\beta J}\\end{pmatrix},\\quad \\lambda_+=2\\cosh(\\beta J),\\quad \\lambda_-=2\\sinh(\\beta J)$$",
          explanation:
            "对称与反对称 eigenvectors 分别给 λ+、λ−。任意有限 T 下 λ+ 严格大于 |λ−|。",
        },
        {
          title: "最大 eigenvalue 决定 free energy",
          formula:
            "$$\\lim_{N\\to\\infty}\\frac1N\\ln Z=\\ln\\lambda_+\\Longrightarrow f=-k_{\\mathrm B}T\\ln\\lambda_+$$",
          explanation:
            "(λ−/λ+)ᴺ 在 N→∞ 时消失。λ+=2cosh(βJ) 对所有 T>0 都正且解析，所以 free energy 没有有限温度非解析点。",
        },
        {
          title: "eigenvalue ratio 决定 correlation length",
          formula:
            "$$\\langle\\sigma_0\\sigma_r\\rangle=\\left(\\frac{\\lambda_-}{\\lambda_+}\\right)^r=e^{-r/\\xi},\\quad \\xi^{-1}=\\ln\\frac{\\lambda_+}{|\\lambda_-|}=-\\ln[\\tanh(\\beta J)]$$",
          explanation:
            "有限 T 时 |λ−/λ+|<1，correlation 随距离指数衰减；只有 T→0 时 ratio→1，ξ 才发散。",
        },
        {
          title: "用 correlation divergence 判定 critical temperature",
          formula: "ξ(T<∞)<∞;  lim_{T→0}ξ=∞  ⇒  Tc=0",
          explanation:
            "一维短程 Ising 没有有限温度 long-range ordered phase；这也是 mean-field 预测有限 Tc 在低维失效的精确反例。",
        },
      ],
      conclusion: isingTransferConclusion,
      checks: [
        "N=1 或 2 时可直接枚举 states，与 Tr(Tᴺ) 交叉核对。",
        "T→∞ 时 tanh(βJ)→0，ξ→0；T→0 时 ξ→∞。",
        "Tc=0 依赖一维、短程相互作用；不能外推到二维 Ising。",
      ],
      evidence: ["课件 6 slides 25–29"],
    },

    [deepDiveFormulaKey(
      "bose-gas",
      "作业 3 Q3：题名说 arbitrary，其实算 3D linear dispersion",
      linearBoseConclusion,
    )]: {
      id: "supplemental-ps3-q3-three-dimensional-linear-bose-gas",
      title: "作业 3 Q3：3D linear-dispersion Bose gas 的完整热力学链",
      kind: "推导结果",
      origin:
        "Problem Set 3 Q3 的标题声称 arbitrary dimension/dispersion，但题面实际固定 V=L³ 与 ε=ℏck。本推导只对这个 conserved-particle、三维线性色散特例负责。",
      symbols: [
        {
          symbol: "g_d",
          meaning: "internal degeneracy，不是 Bose function 的下标",
        },
        { symbol: "z=e^{βμ}", meaning: "fugacity；守恒 Boson 在凝聚点趋于 1" },
        { symbol: "gν(z)", meaning: "Bose function/polylog Liν(z)" },
        {
          symbol: "D(ε)",
          meaning: "含 internal degeneracy 的单粒子 density of states",
        },
        { symbol: "n=N/V", meaning: "固定总 particle density" },
      ],
      prerequisites: [
        "periodic box 中 Σk→V∫d³k/(2π)³",
        "Bose grand partition function",
        "球壳计数 4πk²dk",
        "Bose integral 与 Γ-function",
        "BEC 时 ground state N0 必须从 continuum integral 单列",
      ],
      assumptions: [
        "三维均匀 ideal Bose gas，εk=ℏck，ground-state energy 取 0",
        "粒子数守恒，系统通过 μ 调节 N；这不是 μ=0 的 photon gas",
        "thermodynamic continuum limit，且 internal degeneracy g_d 与 k 无关",
        "凝聚态以下 excited cloud 取 z=1，N=N0+Nexc",
      ],
      steps: [
        {
          title: "由 k-space shell 得到带 prefactor 的 DOS",
          formula: "D(ε)dε=g_d[V/(2π)³]4πk²dk  ⇒  D(ε)/V=g_d ε²/[2π²(ℏc)³]",
          explanation:
            "线性色散给 k=ε/(ℏc)、dk/dε=1/(ℏc)；三维 shell 的 k² 因此变成 ε²。",
        },
        {
          title: "把 grand partition sum 变成 continuum integral",
          formula:
            "$$\\ln\\Xi=-\\sum_{\\mathbf k}\\ln\\left(1-ze^{-\\beta\\varepsilon_{\\mathbf k}}\\right),\\quad \\Phi_G=-k_{\\mathrm B}T\\ln\\Xi=-PV$$",
          explanation:
            "每个 Boson mode 给几何级数。对 excited modes 用 DOS 替换求和；ground state 的 N0 另行保留。",
        },
        {
          title: "积分 grand potential 得 pressure",
          formula:
            "$$\\frac{\\ln\\Xi_{\\mathrm{exc}}}{V}=\\frac{g_d(k_{\\mathrm B}T)^3}{\\pi^2(\\hbar c)^3}g_4(z)\\Longrightarrow P=\\frac{g_d(k_{\\mathrm B}T)^4}{\\pi^2(\\hbar c)^3}g_4(z)$$",
          explanation:
            "展开 −ln(1−ze^{−x}) 并逐项积分，ε² DOS 把级数索引推到 g4；再乘 kBT 得 T⁴ pressure。",
        },
        {
          title: "对 fugacity 求导得到 excited density",
          formula:
            "$$n_{\\mathrm{exc}}=\\frac zV\\frac{\\partial\\ln\\Xi}{\\partial z}=\\frac{g_d(k_{\\mathrm B}T)^3}{\\pi^2(\\hbar c)^3}g_3(z)$$",
          explanation:
            "z∂z 把 g4 降为 g3；这就是 conserved gas 中激发态在 z≤1 下可容纳的 particle density。",
        },
        {
          title: "直接做 energy integral并与 pressure 对照",
          formula:
            "$$\\frac UV=\\int_0^\\infty d\\varepsilon\\,\\frac{D(\\varepsilon)}V\\frac{\\varepsilon}{z^{-1}e^{\\beta\\varepsilon}-1}=\\frac{3g_d(k_{\\mathrm B}T)^4}{\\pi^2(\\hbar c)^3}g_4(z)=3P$$",
          explanation:
            "多乘一个 ε 后积分产生 Γ(4)=6；与 pressure 的 prefactor 比较得到 linear dispersion 在三维的 U=3PV。",
        },
        {
          title: "在 z=1 的饱和值确定 Tc",
          formula:
            "n=g_d(kBTc)³ζ(3)/[π²(ℏc)³]  ⇒  kBTc=ℏc[π²n/(g_dζ(3))]^{1/3}",
          explanation:
            "Tc 处刚好 N0=0；再降温时 excited density 达到上限，多余粒子进入 ground state，因此 Tc∝n^{1/3}。",
        },
        {
          title: "凝聚侧对 U(T) 求导得到临界热容比",
          formula:
            "T<Tc: U/N=3kBT[ζ(4)/ζ(3)](T/Tc)³  ⇒  CV(Tc⁻)/(NkB)=12ζ(4)/ζ(3)≈10.805",
          explanation:
            "固定 N、V 时 z=1，U∝T⁴；导数带来系数 4。老师答案中的 3 是 classical linear-dispersion 每粒子热容，不是此处凝聚侧临界值。",
        },
      ],
      conclusion: linearBoseConclusion,
      checks: [
        "DOS per volume 的量纲是 1/(energy·volume)；右侧 ε²/(ℏc)³ 正好一致。",
        "P∝T⁴、U=3PV 与三维无质量线性色散的 scaling 一致。",
        "这是 conserved Boson gas；若改成 photon gas，μ=0 且不能用固定 n 解 Tc。",
        "12ζ(4)/ζ(3)≈10.805，不等于 3。",
      ],
      evidence: [
        "Problem Set 3 题面 pp.3–4；solution pp.10–14",
        "课件 9 slides 1–7",
      ],
    },

    [deepDiveFormulaKey(
      "bose-gas",
      "harmonic trap BEC",
      trappedBoseConclusion,
    )]: {
      id: "supplemental-harmonic-trap-bose-condensation",
      title: "三维 harmonic trap 中的 BEC：DOS 如何把指数改成 3",
      kind: "推导结果",
      origin:
        "课件 9 slide 12 的 optical-trap application。与均匀盒不同，harmonic trap 的 semiclassical DOS 随 ε² 增长，因此 excited number 随 T³ 而非 T^{3/2}。",
      symbols: [
        { symbol: "ωx,ωy,ωz", meaning: "三方向 trap angular frequencies" },
        {
          symbol: "\\bar{\\omega}=(ωxωyωz)^{1/3}",
          meaning: "trap frequency 的 geometric mean",
        },
        { symbol: "Nexc", meaning: "所有 excited trap levels 的平均粒子数" },
        { symbol: "N0", meaning: "trap ground state 的凝聚粒子数" },
        { symbol: "g3(z)", meaning: "三阶 Bose function" },
      ],
      prerequisites: [
        "三维 harmonic oscillator level counting",
        "semiclassical density of states",
        "Bose integral 与 excited-state saturation",
        "BEC 时单列 ground state",
      ],
      assumptions: [
        "ideal Bose gas 位于三维 harmonic trap",
        "N 大且 kBT≫ℏωi，可把离散 excited levels 近似为 continuum DOS",
        "trap ground energy 已平移为 0，凝聚侧 z=1",
        "忽略 finite-size 与 interaction shifts",
      ],
      steps: [
        {
          title: "用 geometric mean 压缩 anisotropic trap",
          formula:
            "$$\\bar\\omega=(\\omega_x\\omega_y\\omega_z)^{1/3},\\quad \\omega_x\\omega_y\\omega_z=\\bar\\omega^3$$",
          explanation:
            "semiclassical state count 只通过三方向频率乘积出现，所以以 geometric mean 书写最简洁。",
        },
        {
          title: "数出能量以下的 trap states 并求 DOS",
          formula:
            "$$G(\\varepsilon)\\approx\\frac{\\varepsilon^3}{6\\hbar^3\\omega_x\\omega_y\\omega_z}\\Longrightarrow D(\\varepsilon)=\\frac{dG}{d\\varepsilon}=\\frac{\\varepsilon^2}{2(\\hbar\\bar\\omega)^3}$$",
          explanation:
            "三个非负 oscillator quantum numbers 在能量约束下形成三维 simplex；求导后得到 ε² DOS。",
        },
        {
          title: "把 DOS 代入 Bose number integral",
          formula:
            "$$N_{\\mathrm{exc}}=\\int_0^\\infty d\\varepsilon\\,\\frac{D(\\varepsilon)}{z^{-1}e^{\\beta\\varepsilon}-1}=\\left(\\frac{k_{\\mathrm B}T}{\\hbar\\bar\\omega}\\right)^3g_3(z)$$",
          explanation:
            "令 x=βε 后，ε²dε 给 (kBT)³；1/2 与 Γ(3)=2 抵消，留下 g3(z)。",
        },
        {
          title: "用 z=1 的 excited-state 饱和值定义 Tc",
          formula:
            "N=(kBTc/ℏ\\bar{\\omega})³ζ(3)  ⇒  Tc=(ℏ\\bar{\\omega}/kB)[N/ζ(3)]^{1/3}",
          explanation:
            "Tc 处还没有宏观 N0；激发态达到 z=1 的最大容量，解出 trap critical temperature。",
        },
        {
          title: "Tc 以下把多余粒子放入 ground state",
          formula:
            "$$N_{\\mathrm{exc}}(T)=N\\left(\\frac{T}{T_c}\\right)^3,\\quad N_0=N-N_{\\mathrm{exc}}\\Longrightarrow \\frac{N_0}{N}=1-\\left(\\frac{T}{T_c}\\right)^3$$",
          explanation:
            "凝聚侧 z 保持 1，Nexc 只按 T³ 缩小；剩余部分构成 condensate。",
        },
      ],
      conclusion: trappedBoseConclusion,
      checks: [
        "kBT/(ℏ\\bar{\\omega}) 无量纲，所以 Nexc 是纯数。",
        "T=Tc 时 N0=0，T→0 时 N0/N→1。",
        "三次幂属于 harmonic trap；均匀 3D quadratic Bose gas 的 exponent 是 3/2。",
      ],
      evidence: ["课件 9 slide 12"],
    },

    [deepDiveFormulaKey(
      "bose-gas",
      "Bose function 防混表",
      boseFunctionConclusion,
    )]: {
      id: "supplemental-density-of-states-bose-index-rule",
      title: "从 DOS 幂次直接推出 Bose-function 索引",
      kind: "推导结果",
      origin:
        "课件 9 slides 2–5 与 Problem Set 3 Q3 共用的积分规则。先把所有几何和 degeneracy 收进 C，再用 x=βε 一次性读出温度幂与 g-index。",
      symbols: [
        {
          symbol: "D(ε)=Cε^{s−1}",
          meaning:
            "低能或 continuum density of states；C 含 volume、几何和 degeneracy",
        },
        { symbol: "s", meaning: "DOS exponent 加 1" },
        { symbol: "g_s(z)", meaning: "采用 Γ(s) 归一化的 Bose function" },
        { symbol: "z=e^{βμ}", meaning: "fugacity" },
      ],
      prerequisites: [
        "Bose occupation [z⁻¹e^{βε}−1]⁻¹",
        "变量替换 x=βε",
        "Gamma function Γ(s)",
        "number integral 与 energy integral 的区别",
      ],
      assumptions: [
        "continuum DOS 在所需能区可写成 Cε^{s−1}",
        "C 不依赖 ε 与 T",
        "z<1 时积分收敛；若取 z=1，number integral 还需 s>1",
        "ground state 若可宏观占据，必须从 continuum integral 单列",
      ],
      steps: [
        {
          title: "固定本网站的 Bose-function 定义",
          formula: "g_s(z)=Γ(s)⁻¹∫₀∞dx x^{s−1}/(z⁻¹e^x−1)",
          explanation:
            "显式写 Γ(s) 可避免不同教材把 factorial 或 prefactor 吸进 g_s 的 convention confusion。",
        },
        {
          title: "把 DOS 放进 excited-number integral",
          formula:
            "$$N_{\\mathrm{exc}}=C\\int_0^\\infty d\\varepsilon\\,\\frac{\\varepsilon^{s-1}}{z^{-1}e^{\\beta\\varepsilon}-1}$$",
          explanation:
            "number 只数 occupation，不额外乘单粒子能量；这决定它对应 g_s 而不是 g_{s+1}。",
        },
        {
          title: "令 x=βε 提取完整温度幂",
          formula:
            "$$\\varepsilon=xk_{\\mathrm B}T,\\quad d\\varepsilon=k_{\\mathrm B}T\\,dx\\Longrightarrow N_{\\mathrm{exc}}=C(k_{\\mathrm B}T)^s\\Gamma(s)g_s(z)$$",
          explanation:
            "ε^{s−1} 与 dε 合计给 (kBT)^s；剩余无量纲积分正是 Γ(s)g_s(z)。",
        },
        {
          title: "energy integral 多出一个 ε",
          formula:
            "$$U=C\\int_0^\\infty d\\varepsilon\\,\\frac{\\varepsilon^s}{z^{-1}e^{\\beta\\varepsilon}-1}=C(k_{\\mathrm B}T)^{s+1}\\Gamma(s+1)g_{s+1}(z)$$",
          explanation:
            "多乘一个 ε 同时把温度幂和 Bose-function 索引各提高 1；这是最可靠的防混规则。",
        },
        {
          title: "用常见模型检查索引",
          formula:
            "$$\\text{3D quadratic}:s=\\frac32\\Longrightarrow N_{\\mathrm{exc}}\\propto T^{3/2}g_{3/2}(z);\\quad \\text{3D linear}:s=3\\Longrightarrow N_{\\mathrm{exc}}\\propto T^3g_3(z)$$",
          explanation:
            "只要先由 dispersion 求对 DOS 幂次，后续 g-index 不必死记。",
        },
      ],
      conclusion: boseFunctionConclusion,
      checks: [
        "C 的量纲必须使 D(ε) 具有 1/energy；结论中的 Nexc 无量纲、U 有 energy 量纲。",
        "energy integral 相比 number integral 必须多一个 kBT 并把 index 从 s 升到 s+1。",
        "z=1 时若 s≤1，excited number 的低能积分不收敛，不能形成这一机制下的 finite-T BEC。",
      ],
      evidence: ["课件 9 slides 2–5", "Problem Set 3 Q3 题面 pp.3–4"],
    },

    [deepDiveFormulaKey(
      "nonequilibrium",
      "从 underdamped 到 overdamped",
      smoluchowskiConclusion,
    )]: {
      id: "supplemental-underdamped-overdamped-smoluchowski-limit",
      title: "从 inertial Langevin 到 overdamped Smoluchowski equation",
      kind: "近似",
      origin:
        "课件 10 slides 9–15。先由 underdamped Langevin 识别速度松弛时间，再在长时间/高摩擦极限消去 v，最后把 drift 与 white noise 写成 position-space Fokker–Planck equation。",
      symbols: [
        { symbol: "γ", meaning: "friction coefficient；mobility B=1/γ" },
        { symbol: "τv=m/γ", meaning: "velocity relaxation time" },
        { symbol: "ξ(t)", meaning: "zero-mean thermal random force" },
        { symbol: "D=kBT/γ", meaning: "position diffusion coefficient" },
        { symbol: "P(x,t)", meaning: "位置概率密度" },
      ],
      prerequisites: [
        "Langevin equation",
        "white-noise correlation",
        "Einstein relation D=kBT/γ",
        "一维 Fokker–Planck drift-diffusion form",
      ],
      assumptions: [
        "constant γ、constant T 与 additive Gaussian white noise",
        "fluctuation–dissipation relation ⟨ξ(t)ξ(t′)⟩=2γkBTδ(t−t′)",
        "观测时间 t≫τv=m/γ，且势能在速度松弛时间内变化缓慢",
        "只保留 position dynamics；短时 ballistic regime 不在此近似内",
      ],
      steps: [
        {
          title: "写含 inertia 的 Langevin equation",
          formula: "m v̇=−γv−U′(x)+ξ(t);  ⟨ξ(t)⟩=0;  ⟨ξ(t)ξ(t′)⟩=2γkBTδ(t−t′)",
          explanation:
            "−γv 是平均 dissipative drag，ξ 是热浴 fluctuation；噪声均值为零不表示每条 trajectory 上随机力为零。",
        },
        {
          title: "从无外力平均运动读出快时间尺度",
          formula:
            "$$m\\frac{d\\langle v\\rangle}{dt}=-\\gamma\\langle v\\rangle\\Longrightarrow \\langle v(t)\\rangle=\\langle v(0)\\rangle e^{-t/\\tau_v},\\quad \\tau_v=\\frac m\\gamma$$",
          explanation:
            "速度在 τv 内遗忘初值。只有观测尺度远大于 τv，才可把 v 当作已快速松弛的变量。",
        },
        {
          title: "在长时间极限丢掉 inertial term",
          formula: "t≫m/γ  ⇒  m v̇≈0  ⇒  γẋ=−U′(x)+ξ(t)",
          explanation:
            "这是 time-scale separation 的近似，不是把粒子质量宣称为严格等于零；短时或快速变化势场下不能这样做。",
        },
        {
          title: "除以 γ 并把随机力改写成位置噪声",
          formula:
            "ẋ=A(x)+η(t);  A=−U′/γ;  η=ξ/γ;  ⟨η(t)η(t′)⟩=2Dδ(t−t′);  D=kBT/γ",
          explanation:
            "fluctuation–dissipation correlation 除以 γ² 后给 2(kBT/γ)δ，因此 position diffusion coefficient 正是 Einstein relation。",
        },
        {
          title: "代入 additive-noise Fokker–Planck equation",
          formula: "∂tP=−∂x[AP]+D∂x²P=∂x[(U′/γ)P+D∂xP]",
          explanation:
            "drift A=−U′/γ 的负号与 Fokker–Planck 外层负号相乘，得到右侧 Smoluchowski 形式。",
        },
        {
          title: "用 equilibrium current 检查系数",
          formula: "J=−(U′/γ)P−D∂xP;  J=0  ⇒  Peq∝e^{−U/(γD)}=e^{−βU}",
          explanation:
            "最后等号要求 γD=kBT；因此所得 equation 的 stationary distribution 与 canonical Boltzmann weight 一致。",
        },
      ],
      conclusion: smoluchowskiConclusion,
      checks: [
        "U=constant 时退化为 ∂tP=D∂x²P。",
        "D 的单位是 length²/time；U′/γ 的单位是 velocity。",
        "若 t≲m/γ，必须保留 velocity 并使用 (x,v) 空间的 Kramers equation。",
        "若 γ 或噪声强度依赖 x，会出现 multiplicative-noise convention 与额外 drift，不能直接沿用此式。",
      ],
      evidence: ["课件 10 slides 9–15"],
    },
  };
