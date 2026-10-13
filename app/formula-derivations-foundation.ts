import {
  conceptFormulaKey,
  deepDiveFormulaKey,
  type FormulaDerivation,
} from "./formula-derivation-types";

export const foundationFormulaDerivations: Record<string, FormulaDerivation> = {
  [conceptFormulaKey("math-toolbox", "先学会读一行公式")]: {
    id: "expected-value-discrete-continuous",
    title: "离散与连续变量的期望值",
    aliases: ["平均值", "expectation value", "ensemble average"],
    kind: "定义",
    origin: "期望值首先定义为概率测度下的加权平均；大量重复试验的样本平均在大数定律条件下趋近它。连续公式由离散分箱的 Riemann 和取极限得到。",
    symbols: [
      { symbol: "A_i", meaning: "第 i 个状态中可观测量 A 的数值" },
      { symbol: "p_i", meaning: "第 i 个离散状态的概率" },
      { symbol: "p(x)", meaning: "连续变量 x 的概率密度" },
    ],
    prerequisites: ["会做有限项加法", "知道离散概率和概率密度的区别"],
    assumptions: [
      "Σi pi=1，∫dx p(x)=1，且相应平均值存在",
      "只有在使用频率解释时，才额外要求重复样本独立同分布，或动力学采样足够遍历",
    ],
    steps: [
      {
        title: "先写概率论中的离散定义",
        formula: "E[A]≡Σi piAi，Σi pi=1",
        explanation: "每个可能值按其概率加权；这一行是期望值的定义，不依赖先做一组真实重复试验。",
      },
      {
        title: "再说明它为什么对应长期样本平均",
        formula: "ĀN=Σi(ni/N)Ai；  ni/N→pi ⇒ ĀN→E[A]",
        explanation: "对独立同分布样本，大数定律使经验频率和样本平均趋近期望值；这是操作解释，不是期望值定义本身。",
      },
      {
        title: "把连续变量分成小格",
        formula: "⟨A⟩≈Σj p(xj)Δx A(xj)",
        explanation: "第 j 个小区间的概率约为 p(xj)Δx，仍然是“概率 × 该格中的数值”。",
      },
      {
        title: "让分箱宽度趋于零",
        formula: "lim(Δx→0) Σj p(xj)A(xj)Δx = ∫dx p(x)A(x)",
        explanation: "Riemann 和的极限就是积分，因此连续式与离散式具有完全相同的结构。",
      },
    ],
    conclusion: "⟨A⟩ = Σi pi Ai（离散） 或  ⟨A⟩ = ∫dx p(x)A(x)（连续）",
    checks: ["A 为常数 A0 时应得到 ⟨A⟩=A0", "平均值与 A 具有相同量纲", "先检查概率是否归一化"],
    evidence: ["课件 2 slide 3", "课件 3 slides 14–19（离散占据数路线）"],
  },

  [conceptFormulaKey("math-toolbox", "偏导、全微分与“保持谁不变”")]: {
    id: "helmholtz-differential-coefficients",
    title: "由 Helmholtz 自由能全微分读出熵与压强",
    aliases: ["dF", "Helmholtz differential", "自然变量"],
    kind: "推导结果",
    origin: "从基本热力学关系 dU=T dS−P dV+μ dN 与 Legendre 变换 F=U−TS 出发。",
    symbols: [
      { symbol: "F", meaning: "Helmholtz 自由能，F(T,V,N)" },
      { symbol: "S", meaning: "熵" },
      { symbol: "P", meaning: "压强" },
      { symbol: "μ", meaning: "化学势" },
    ],
    prerequisites: ["乘积微分", "多变量函数的全微分", "第一定律的基本微分式"],
    assumptions: ["平衡态热力学", "系统只做 P dV 功", "F 对自然变量足够光滑"],
    steps: [
      {
        title: "对 Legendre 变换逐项微分",
        formula: "F=U−TS  ⇒  dF=dU−T dS−S dT",
        explanation: "d(TS)=T dS+S dT，两个乘积项都不能漏。",
      },
      {
        title: "代入内能的基本关系",
        formula: "dF=(T dS−P dV+μ dN)−T dS−S dT",
        explanation: "将 dU 替换后，+T dS 与 −T dS 正好抵消。",
      },
      {
        title: "整理成物理全微分",
        formula: "dF=−S dT−P dV+μ dN",
        explanation: "这一步显示 F 的自然变量是 T、V、N。",
      },
      {
        title: "与数学全微分比较系数",
        formula: "dF=(∂F/∂T)V,N dT+(∂F/∂V)T,N dV+(∂F/∂N)T,V dN",
        explanation: "dT、dV、dN 可以独立变化，所以相同微分前的系数必须分别相等。",
      },
      {
        title: "读出共轭变量",
        formula: "S=−(∂F/∂T)V,N；  P=−(∂F/∂V)T,N；  μ=(∂F/∂N)T,V",
        explanation: "偏导下标就是做该偏导时锁住的其余自然变量。",
      },
    ],
    conclusion: "dF = −S dT − P dV + μ dN  ⇒  S=−(∂F/∂T)V,N，P=−(∂F/∂V)T,N",
    checks: ["−S dT、−P dV、μ dN 每项都有能量量纲", "固定 V、N 升高 T 时普通系统 F 通常下降", "偏导下标不能省略理解"],
    evidence: ["2025 期中 Q1(c)", "课件 1 slide 18", "课件 3 slide 7"],
  },

  [conceptFormulaKey("math-toolbox", "小量展开、大 N 与最可能项")]: {
    id: "stirling-and-laplace-method",
    title: "Stirling 公式与大 N 鞍点近似",
    aliases: ["Stirling approximation", "Laplace method", "saddle point"],
    kind: "近似",
    origin: "阶乘的对数可由求和近似成积分；指数含大参数 N 时，最大点附近的二次展开压倒其余区域。",
    symbols: [
      { symbol: "N", meaning: "很大的正整数或无量纲大参数" },
      { symbol: "f(x)", meaning: "指数中的光滑函数" },
      { symbol: "x*", meaning: "f 的内部最大点" },
    ],
    prerequisites: ["对数把乘积变成求和", "定积分", "Taylor 二阶展开"],
    assumptions: ["N≫1", "f 在 x* 附近足够光滑", "f′(x*)=0 且 f″(x*)<0", "最大点与积分边界有足够距离"],
    steps: [
      {
        title: "把阶乘乘积取对数",
        formula: "ln N!=Σn=1N ln n",
        explanation: "对数把 1·2·…·N 的乘积变成可用积分近似的和。",
      },
      {
        title: "用面积近似求和",
        formula: "Σn=1N ln n ≈ ∫₁ᴺ dx ln x = N lnN−N+1",
        explanation: "ln x 缓慢变化时，矩形和与曲线下面积的相对差随 N 增大而减小。",
      },
      {
        title: "保留领先的大 N 项",
        formula: "ln N!=N lnN−N+O(ln N)",
        explanation: "更精确式还有 (1/2)ln(2πN) 等次领先项；热力学领先阶先保留 N lnN−N。",
      },
      {
        title: "在指数最大点附近展开",
        formula: "f(x)≈f(x*)+(1/2)f″(x*)(x−x*)²",
        explanation: "最大点满足 f′(x*)=0，因此线性项消失；f″(x*)<0 给出向下的 Gaussian 峰。",
      },
      {
        title: "把局部峰化成 Gaussian 积分",
        formula: "∫dx e^{Nf(x)}≈e^{Nf(x*)}∫dx e^{Nf″(x*)(x−x*)²/2}",
        explanation: "离峰越远，指数相差 O(N)，贡献按指数被压低。",
      },
      {
        title: "得到领先鞍点结果",
        formula: "∫dx e^{Nf(x)}≈e^{Nf(x*)}√[2π/(−Nf″(x*))]",
        explanation: "平方根前因子只按 N 的幂变化，主导的指数尺度来自 f 的最大值。",
      },
    ],
    conclusion: "ln N! ≈ N lnN − N；  ∫dx e^{Nf(x)} 由 f(x) 最大处 x* 主导",
    checks: ["必须先说明 N 为何足够大", "最大点要满足 f″(x*)<0", "若最大值在边界或有多个峰，近似形式需要修改"],
    evidence: ["课件 3 slides 14–19", "作业 1 Q4", "期中 Q2"],
  },

  [conceptFormulaKey("math-toolbox", "Gaussian、Gamma、超球与 Fourier：只学用途")]: {
    id: "gaussian-integrals-one-and-many-dimensions",
    title: "一维与多维 Gaussian 积分",
    aliases: ["Gaussian integral", "completing the square", "determinant formula"],
    kind: "推导结果",
    origin: "一维结果由把积分平方后改用极坐标得到；多维结果由配方、平移和对正定矩阵对角化得到。",
    symbols: [
      { symbol: "a", meaning: "正实数 Gaussian 系数" },
      { symbol: "A", meaning: "实对称正定 n×n 矩阵" },
      { symbol: "J", meaning: "线性源向量" },
      { symbol: "detA", meaning: "矩阵 A 的行列式" },
    ],
    prerequisites: ["二重积分极坐标", "配平方", "实对称矩阵正交对角化"],
    assumptions: ["a>0", "A=Aᵀ 且全部本征值为正", "积分覆盖整个实空间"],
    steps: [
      {
        title: "把一维积分平方",
        formula: "I(a)=∫₋∞^∞ dx e^(−ax²)；  I(a)²=∫dxdy e^[−a(x²+y²)]",
        explanation: "两个相同的一维积分相乘，变成整个二维平面上的积分。",
      },
      {
        title: "在二维平面改用极坐标",
        formula: "I(a)²=∫₀²π dθ∫₀∞ r dr e^(−ar²)=2π[−e^(−ar²)/(2a)]₀∞=π/a",
        explanation: "Jacobian 给出 r；a>0 保证无穷远的指数项消失。",
      },
      {
        title: "取正平方根",
        formula: "I(a)=√(π/a)",
        explanation: "原积分被积函数为正，所以选择正根。",
      },
      {
        title: "给多维指数配平方",
        formula: "−(1/2)xᵀAx+Jᵀx=−(1/2)(x−A⁻¹J)ᵀA(x−A⁻¹J)+(1/2)JᵀA⁻¹J",
        explanation: "平移中心 A⁻¹J，把与 x 有关的部分恢复成纯二次型。",
      },
      {
        title: "平移并对角化二次型",
        formula: "A=Oᵀdiag(λ1,…,λn)O  ⇒  ∫dⁿy e^(−yᵀAy/2)=Πr √(2π/λr)",
        explanation: "正交变换 Jacobian 的绝对值为 1；对角化后积分分解成 n 个一维 Gaussian。",
      },
      {
        title: "把本征值乘积写成行列式",
        formula: "Πr √(2π/λr)=√[(2π)ⁿ/(Πrλr)]=√[(2π)ⁿ/detA]",
        explanation: "detA 等于所有本征值之积，源项常数因子再乘回。",
      },
    ],
    conclusion: "∫₋∞^∞ e^(−ax²)dx=√(π/a)；  ∫dⁿx e^(−½xᵀAx+Jᵀx)=√[(2π)ⁿ/detA] e^(½JᵀA⁻¹J)",
    checks: ["n=1、J=0 时必须退化为一维 Gaussian", "detA>0 才有实且收敛的结果", "指数中的 1/2 与源项正负号必须按同一 convention"],
    evidence: ["课件 3 slides 14–19", "期中 Q2", "作业 3 Q1"],
  },

  [deepDiveFormulaKey("math-toolbox", "补课：Lagrange multiplier 的固定四步", "∂L/∂xi=0")]: {
    id: "lagrange-stationarity-variables",
    title: "Lagrange 函数对待求变量的驻点条件",
    aliases: ["Lagrange multiplier", "stationarity"],
    kind: "解题框架",
    origin: "在约束 g(x)=c 下，把目标函数和约束组合成 L=f−λ[g−c]，再寻找 L 的驻点。",
    symbols: [
      { symbol: "L", meaning: "Lagrange 函数" },
      { symbol: "xi", meaning: "第 i 个待求变量" },
      { symbol: "λ", meaning: "约束乘子" },
    ],
    prerequisites: ["多变量偏导", "无约束极值的一阶必要条件"],
    assumptions: ["约束在候选点附近可微", "约束梯度不为零", "讨论内部的正则极值点"],
    steps: [
      {
        title: "把约束并入目标函数",
        formula: "L(x1,…,xn,λ)=f(x1,…,xn)−λ[g(x1,…,xn)−c]",
        explanation: "在满足 g=c 的点上，附加项为零；λ 用来调节沿约束法向的变化。",
      },
      {
        title: "对每个独立变量取一阶变化",
        formula: "δL=Σi(∂L/∂xi)δxi+(∂L/∂λ)δλ",
        explanation: "把所有独立小变化的贡献写成全微分。",
      },
      {
        title: "令任意 δxi 的系数为零",
        formula: "δL=0  for arbitrary δxi  ⇒  ∂L/∂xi=0",
        explanation: "驻点处每个可独立改变的方向都不能留下一阶变化。",
      },
    ],
    conclusion: "∂L/∂xi=0",
    checks: ["每个 xi 都要写一条方程", "这只是候选极值的一阶条件，还需检查最大或最小", "不要漏掉对 λ 的方程"],
    evidence: ["课件 3 slides 14–15", "作业 1 Q1"],
  },

  [deepDiveFormulaKey("math-toolbox", "补课：Lagrange multiplier 的固定四步", "∂L/∂λ=0 ⇒ g(x)=c")]: {
    id: "lagrange-stationarity-constraint",
    title: "Lagrange 乘子恢复原约束",
    aliases: ["constraint equation", "Lagrange multiplier"],
    kind: "解题框架",
    origin: "L=f−λ[g−c] 对乘子 λ 的偏导直接取出约束残差。",
    symbols: [
      { symbol: "λ", meaning: "Lagrange 乘子" },
      { symbol: "g(x)", meaning: "约束函数" },
      { symbol: "c", meaning: "约束指定值" },
    ],
    prerequisites: ["对线性参数求偏导"],
    assumptions: ["L 中 λ 只通过 −λ[g(x)−c] 出现"],
    steps: [
      {
        title: "对乘子求偏导",
        formula: "∂L/∂λ=−[g(x)−c]",
        explanation: "f 与 λ 无关，对 λ 求导只留下约束残差及前面的负号。",
      },
      {
        title: "施加驻点条件",
        formula: "∂L/∂λ=0  ⇒  −[g(x)−c]=0",
        explanation: "λ 也是 L 的独立变量，所以候选解必须同时满足这条方程。",
      },
      {
        title: "恢复约束",
        formula: "g(x)−c=0  ⇒  g(x)=c",
        explanation: "因此求 L 的驻点不会丢掉原始约束。",
      },
    ],
    conclusion: "∂L/∂λ=0 ⇒ g(x)=c",
    checks: ["约束右端的 c 不能漏", "若 L 采用相反正号，前两步符号改变但最终约束不变"],
    evidence: ["课件 3 slides 14–15", "作业 1 Q1"],
  },

  [conceptFormulaKey("probability-counting", "概率与概率密度不是同一件事")]: {
    id: "probability-mass-density-normalization",
    title: "离散概率归一化与连续区间概率",
    aliases: ["probability density", "normalization", "区间概率"],
    kind: "定义",
    origin: "概率测度把完整样本空间规定为总概率 1；连续变量把越来越细的分箱概率写成密度乘区间宽度。相对频率只是在大数定律条件下对概率的操作解释。",
    symbols: [
      { symbol: "p_i", meaning: "离散状态 i 的概率" },
      { symbol: "p(x)", meaning: "连续变量 x 的概率密度" },
      { symbol: "P(x∈[a,b])", meaning: "x 落在区间 [a,b] 的概率" },
    ],
    prerequisites: ["有限求和", "定积分是 Riemann 和的极限"],
    assumptions: [
      "概率或概率密度非负，且所有互斥可能覆盖完整样本空间",
      "若用 ni/N 估计 pi，重复样本还需独立同分布或具有足够遍历性",
    ],
    steps: [
      {
        title: "从离散概率公理开始",
        formula: "pi≥0；  P(whole sample space)=Σi pi=1",
        explanation: "互斥且穷尽的状态构成完整样本空间，总概率按定义等于 1。",
      },
      {
        title: "用频数给出可测量的估计",
        formula: "Σi ni=N ⇒ Σi(ni/N)=1；  N→∞ 时 ni/N→pi",
        explanation: "有限样本的经验频率天然归一；在大数定律条件下，它才趋近理论概率。",
      },
      {
        title: "把连续区间切成小格",
        formula: "P(x∈[a,b])≈Σxj∈[a,b] p(xj)Δx",
        explanation: "p(xj) 本身是每单位 x 的概率；乘 Δx 才是一个小格内的概率。",
      },
      {
        title: "取连续极限",
        formula: "lim(Δx→0)Σxj∈[a,b] p(xj)Δx=∫ₐᵇp(x)dx",
        explanation: "区间概率是密度在该区间下的面积，而单点概率在连续分布中为零。",
      },
    ],
    conclusion: "P(x∈[a,b])=∫ₐᵇp(x)dx；  Σi pi=1",
    checks: ["取 [a,b] 为整个支持集时积分必须等于 1", "p(x) 的量纲是 1/x 的量纲", "p(x) 可以大于 1，但区间概率不能超过 1"],
    evidence: ["课件 2 slide 3", "课件 3 slides 10–15（离散计数补充）"],
  },

  [conceptFormulaKey("probability-counting", "平均、方差与相对涨落")]: {
    id: "variance-second-moment-identity",
    title: "方差等于二阶矩减均值平方",
    aliases: ["variance", "second moment", "fluctuation"],
    kind: "恒等式",
    origin: "从方差的定义 ⟨(X−⟨X⟩)²⟩ 直接展开平方并使用期望值的线性性。",
    symbols: [
      { symbol: "X", meaning: "随机变量" },
      { symbol: "⟨X⟩", meaning: "X 的期望值" },
      { symbol: "Var(X)", meaning: "X 的方差" },
    ],
    prerequisites: ["平方展开", "期望值的线性性"],
    assumptions: ["X 的一阶和二阶矩有限"],
    steps: [
      {
        title: "从方差定义出发",
        formula: "Var(X)=⟨(X−⟨X⟩)²⟩",
        explanation: "方差测量 X 相对其自身平均值的平方偏离。",
      },
      {
        title: "展开平方",
        formula: "(X−⟨X⟩)²=X²−2X⟨X⟩+⟨X⟩²",
        explanation: "⟨X⟩ 对一次抽样而言是常数，不是另一个随机变量。",
      },
      {
        title: "逐项取平均",
        formula: "Var(X)=⟨X²⟩−2⟨X⟩⟨X⟩+⟨X⟩²",
        explanation: "使用 ⟨aX+b⟩=a⟨X⟩+b，并把常数移出平均号。",
      },
      {
        title: "合并均值平方",
        formula: "Var(X)=⟨X²⟩−⟨X⟩²",
        explanation: "−2⟨X⟩²+⟨X⟩² 只剩 −⟨X⟩²。",
      },
    ],
    conclusion: "Var(X)=⟨(X−⟨X⟩)²⟩=⟨X²⟩−⟨X⟩²",
    checks: ["方差不能为负", "Var(X) 的量纲是 X 量纲的平方", "X 为常数时方差必须为零"],
    evidence: ["课件 1 slides 21–25", "作业 2 Q3"],
  },

  [conceptFormulaKey("probability-counting", "从“数方法”到熵")]: {
    id: "binomial-and-stars-bars-counting",
    title: "组合数与 stars-and-bars 计数",
    aliases: ["binomial coefficient", "stars and bars", "multiplicity"],
    kind: "推导结果",
    origin: "组合数来自消除选取顺序的重复计数；stars-and-bars 把非负整数解一一对应为星与隔板的排列。",
    symbols: [
      { symbol: "N", meaning: "可区分位置或盒子数" },
      { symbol: "M", meaning: "被选位置数或相同量子数" },
      { symbol: "C(N,M)", meaning: "从 N 个对象中无序选 M 个的方法数" },
    ],
    prerequisites: ["阶乘", "排列与组合的区别", "一一对应计数"],
    assumptions: ["组合题中位置可区分而被选对象无序", "stars-and-bars 中 M 个量子相同、N 个盒子可区分且允许空盒"],
    steps: [
      {
        title: "先数有顺序的 M 次选择",
        formula: "N(N−1)…(N−M+1)=N!/(N−M)!",
        explanation: "第一项有 N 种选择，之后不能重复选择已占用的位置。",
      },
      {
        title: "消除同一集合的内部顺序",
        formula: "C(N,M)=[N!/(N−M)!]/M!=N!/[M!(N−M)!]",
        explanation: "同一组 M 个位置会因 M! 种排列被重复计算，所以除以 M!。",
      },
      {
        title: "把占据数组合画成星和隔板",
        formula: "n1+…+nN=M  ↔  M 个星与 N−1 个隔板",
        explanation: "相邻隔板之间的星数就是一个盒子的占据数，空段自然表示 ni=0。",
      },
      {
        title: "从总位置中选择星的位置",
        formula: "Ωstars-bars=C(M+N−1,M)=C(M+N−1,N−1)",
        explanation: "字符串总长 M+N−1；选择哪些位置放 M 个星，余下自动成为隔板。",
      },
    ],
    conclusion: "C(N,M)=N!/[M!(N−M)!]；  Ωstars-bars=C(M+N−1,M)",
    checks: ["C(N,0)=C(N,N)=1", "N=1 时 stars-and-bars 必须只有一种", "先说明粒子、量子和盒子谁可区分"],
    evidence: ["课件 3 slides 10–15", "作业 1 Q4"],
  },

  [conceptFormulaKey("probability-counting", "最大熵与指数分布")]: {
    id: "maximum-entropy-boltzmann-distribution",
    title: "带归一化和平均能量约束的最大熵分布",
    aliases: ["maximum entropy", "Boltzmann distribution", "Lagrange multipliers"],
    kind: "推导结果",
    origin: "在只知道归一化与平均能量时，对 Gibbs–Shannon 熵做约束极大化。",
    symbols: [
      { symbol: "p_i", meaning: "微观态 i 的概率" },
      { symbol: "E_i", meaning: "微观态 i 的能量" },
      { symbol: "β", meaning: "能量约束的乘子，热平衡时等于 1/(kBT)" },
      { symbol: "Z", meaning: "保证概率归一化的配分函数" },
    ],
    prerequisites: ["Lagrange multiplier", "d(pi lnpi)/dpi=lnpi+1", "指数与对数"],
    assumptions: [
      "允许态集合已知，Z=Σi e^(−βEi) 有限，指定的 U 可由某个概率分布实现",
      "p_i>0 的内部极值",
      "只施加归一化与平均能量两个约束",
      "把乘子 β 解释为温度时，系统与一个具有明确热力学温度的大热库弱耦合",
    ],
    steps: [
      {
        title: "写出目标与两个约束",
        formula: "s=−Σi pi lnpi；  Σi pi=1；  Σi piEi=U",
        explanation: "先去掉整体常数 kB，不影响使熵最大的位置。",
      },
      {
        title: "构造 Lagrange 函数",
        formula: "L=−Σi pi lnpi−α(Σi pi−1)−β(Σi piEi−U)",
        explanation: "α 管归一化，β 管平均能量；此时 β 先只是数学乘子。",
      },
      {
        title: "对每个概率独立求导",
        formula: "∂L/∂pi=−(lnpi+1)−α−βEi=0",
        explanation: "每个 p_i 都是独立待求变量，因此得到一组逐态方程。",
      },
      {
        title: "解出指数形式",
        formula: "lnpi=−1−α−βEi  ⇒  pi=e^(−1−α)e^(−βEi)",
        explanation: "能量约束的线性项经过指数化后变成 Boltzmann 权重。",
      },
      {
        title: "用归一化确定常数",
        formula: "1=Σi pi=e^(−1−α)Σi e^(−βEi)  ⇒  e^(−1−α)=1/Z",
        explanation: "定义 Z=Σi e^(−βEi)，使所有概率之和恰好等于 1。",
      },
      {
        title: "用热库态数独立识别指数系数",
        formula:
          "pi∝Ωbath(Etot−Ei)=exp[Sbath(Etot−Ei)/kB]",
        explanation: "固定小系统能量 Ei 后，复合系统可实现方式数正比于热库剩余能量的态数。",
      },
      {
        title: "对大热库熵作一阶展开",
        formula:
          "Sbath(Etot−Ei)≈Sbath(Etot)−Ei(∂Sbath/∂E)=constant−Ei/T",
        explanation: "热力学温度定义给 (∂S/∂E)V,N=1/T；大热库因 Ei 很小而只需保留一阶。",
      },
      {
        title: "比较两个指数并识别逆温度",
        formula: "e^(−βEi)=e^[−Ei/(kBT)] ⇒ β=1/(kBT)",
        explanation: "因此 Lagrange 乘子并非凭空叫作逆温度；它由热库熵的斜率固定。",
      },
      {
        title: "检查驻点确实是最大值",
        formula: "δ²s=−Σi(δpi)²/pi<0  for nonzero allowed δpi",
        explanation: "在约束允许的非零变化方向上二阶变分严格为负，所以找到的内部驻点是唯一最大值，而不只是一个候选点。",
      },
      {
        title: "得到最大熵分布",
        formula: "pi=e^(−βEi)/Z；  Z=Σi e^(−βEi)",
        explanation: "再与热库或热力学温度匹配，才把 β 识别为 1/(kBT)。",
      },
    ],
    conclusion: "maximize −Σi pi lnpi, subject to Σipi=1 and ΣipiEi=U  ⇒  pi=e^{-βEi}/Z",
    checks: ["Σi pi 必须等于 1", "βEi 必须无量纲", "若所有 Ei 相同，应退化为均匀分布", "最大熵原则不自动证明动力学遍历性"],
    evidence: ["作业 1 Q1", "课件 3 slides 14–15（等价的大 N 最可能分布路线）"],
  },

  [conceptFormulaKey("thermo-bridge", "系统、边界、平衡与状态量")]: {
    id: "ideal-gas-equation-of-state",
    title: "由动量通量与均分定理得到理想气体状态方程",
    aliases: ["ideal gas law", "equation of state", "PV=NkBT"],
    kind: "模型",
    origin: "在稀薄、无相互作用且经典平衡的模型中，墙面碰撞给出压强，平动能量均分把速度平均改写成温度。",
    symbols: [
      { symbol: "P", meaning: "气体压强" },
      { symbol: "V", meaning: "容器体积" },
      { symbol: "N", meaning: "粒子数" },
      { symbol: "T", meaning: "绝对温度" },
    ],
    prerequisites: ["弹性碰撞的动量变化", "各向同性", "经典均分定理"],
    assumptions: ["单原子经典理想气体", "粒子间相互作用可忽略", "容器达到各向同性热平衡", "非相对论速度"],
    steps: [
      {
        title: "单个粒子对墙的平均力",
        formula: "Δpx=2mvx；  Δt=2L/|vx|  ⇒  F̄x=Δpx/Δt=mvx²/L",
        explanation: "粒子在同一对墙之间往返；一次碰撞传递 2mvx 的法向动量。",
      },
      {
        title: "对粒子求和并除以墙面积",
        formula: "P=F/A=(m/AL)Σi vxi²=(N/V)m⟨vx²⟩",
        explanation: "V=AL，且 Σi vxi²=N⟨vx²⟩。",
      },
      {
        title: "使用各向同性",
        formula: "⟨vx²⟩=⟨vy²⟩=⟨vz²⟩=(1/3)⟨v²⟩",
        explanation: "平衡气体没有优先方向，三个平方分量贡献相同。",
      },
      {
        title: "用平动能均分定义温度尺度",
        formula: "(1/2)m⟨v²⟩=(3/2)kBT  ⇒  m⟨vx²⟩=kBT",
        explanation: "三个独立二次动量自由度各贡献 kBT/2。",
      },
      {
        title: "代回压强关系",
        formula: "P=(N/V)kBT  ⇒  PV=NkBT",
        explanation: "这把微观碰墙动量通量连接到宏观状态方程。",
      },
    ],
    conclusion: "ideal gas: PV = NkBT",
    checks: ["P 的量纲应为能量/体积", "固定 N、V 时 P 与 T 成正比", "低温量子气体或强相互作用气体不满足此前提"],
    evidence: ["课件 1 slides 8–20", "课件 1 slides 21–25"],
  },

  [conceptFormulaKey("thermo-bridge", "热、功、内能与符号约定")]: {
    id: "first-law-fundamental-differential",
    title: "第一定律与基本热力学微分式",
    aliases: ["first law", "fundamental relation", "sign convention"],
    kind: "公设 / 经验定律",
    origin: "先把真实过程的能量账本与平衡态空间的基本微分分开：封闭过程由第一定律记账；简单可压缩单组分平衡态满足 dE=T dS−P dV+μ dN。只有可逆准静态路径才能逐项把两者对应起来。",
    symbols: [
      { symbol: "E", meaning: "系统内能" },
      { symbol: "δQ", meaning: "流入系统的微小热量" },
      { symbol: "−P_ext dV", meaning: "真实边界过程中的体积功；P_ext 是外压" },
      { symbol: "−P dV+μ dN", meaning: "平衡态基本微分中的共轭项" },
    ],
    prerequisites: ["状态函数与路径量", "功的正负号约定", "可逆过程"],
    assumptions: [
      "过程账本先限于封闭系统且只考虑 P dV 边界功",
      "平衡态基本关系限于简单可压缩、单组分系统",
      "δQrev=T dS 与 P_ext=P 只在可逆准静态路径使用",
      "开放流动系统的能量输运不能靠给任意过程机械追加 μdN 代替",
    ],
    steps: [
      {
        title: "先写封闭系统的过程账本",
        formula: "dE=δQ+δW",
        explanation: "E 是状态函数，δQ 与 δW 是沿真实路径跨边界传递的能量；封闭系统没有粒子穿过边界。",
      },
      {
        title: "代入真实边界上的膨胀功",
        formula: "δW=−P_ext dV  ⇒  dE=δQ−P_ext dV",
        explanation: "dV>0 时系统克服外压做功，所以进入系统的功为负；不可逆过程中一般不能把 P_ext 偷换成系统平衡压强 P。",
      },
      {
        title: "独立写出平衡态基本关系",
        formula: "E=E(S,V,N) ⇒ dE=T dS−P dV+μ dN",
        explanation: "这里 T、−P、μ 是 E 对自然变量 S、V、N 的偏导；它描述邻近平衡态，而不是任意非平衡过程的热功拆分。",
      },
      {
        title: "只在可逆准静态路径上逐项接合",
        formula: "δQrev=T dS，P_ext=P；  dN=0 ⇒ dE=T dS−P dV",
        explanation: "此时过程账本与平衡态微分一致；不可逆绝热过程仍可能有 dS>0，不能令 δQ=T dS。",
      },
    ],
    conclusion: "过程: dE=δQ−P_{ext} dV（封闭, 仅 P dV 功）；平衡态: dE=T dS−P dV+μ dN",
    checks: [
      "每一项都必须有能量量纲。",
      "看到 P dV 时先问它是过程中的 P_ext，还是平衡基本关系中的 P。",
      "绝热不等于 dS=0，除非过程还可逆。",
      "若改用“外界对系统做功为正”，必须整题一致改写。",
    ],
    evidence: ["课件 1 slide 12（第一定律与符号）", "课件 3 slide 7（固定 N 的平衡态关系）"],
  },

  [conceptFormulaKey("thermo-bridge", "四条定律各自解决什么")]: {
    id: "second-law-entropy-and-carnot-bound",
    title: "孤立系统熵增与 Carnot 效率上限",
    aliases: ["second law", "Carnot efficiency", "entropy production"],
    kind: "公设 / 经验定律",
    origin: "第二定律断言孤立总系统的熵不减；把它应用到在冷热库之间循环运行的热机，得到 Carnot 上限。",
    symbols: [
      { symbol: "ΔS", meaning: "孤立总系统的熵变" },
      { symbol: "Qh", meaning: "热机从高温热库吸收的热量" },
      { symbol: "Qc", meaning: "热机排向低温热库的热量绝对值" },
      { symbol: "η", meaning: "热机效率 W/Qh" },
    ],
    prerequisites: ["第一定律的循环能量账本", "热库熵变 ΔS=Q/T", "正负号约定"],
    assumptions: ["热机完成一个循环，工作物质回到初态", "两个热库温度分别固定为 Th>Tc", "Qh、Qc 取正的热量大小"],
    steps: [
      {
        title: "写第二定律的基本陈述",
        formula: "isolated total system: ΔStot≥0",
        explanation: "这是经验定律，不由能量守恒单独推出；可逆过程取等号，不可逆过程严格大于零。",
      },
      {
        title: "计算两个热库的总熵变",
        formula: "ΔStot=−Qh/Th+Qc/Tc≥0",
        explanation: "高温库失去 Qh，低温库得到 Qc；循环后工作物质自身熵变为零。",
      },
      {
        title: "整理热量之比",
        formula: "Qc/Qh≥Tc/Th",
        explanation: "低温库至少必须接收这一比例的废热，否则总熵会下降。",
      },
      {
        title: "用第一定律写循环输出功",
        formula: "W=Qh−Qc；  η=W/Qh=1−Qc/Qh",
        explanation: "工作物质一个循环的内能净变化为零，因此吸热分成输出功和排热。",
      },
      {
        title: "得到 Carnot 上限",
        formula: "η≤1−Tc/Th=ηCarnot",
        explanation: "只有总熵产生为零的可逆循环才能达到等号。",
      },
    ],
    conclusion: "isolated system: ΔS≥0；两热库热机: η≤1−T_c/T_h，可逆时取等号",
    checks: ["Tc<Th 时 ηCarnot 介于 0 与 1", "两热库同温时不可能持续输出净功", "实际不可逆热机效率严格低于上限"],
    evidence: ["课件 1 slides 13–16", "OpenStax Thermodynamics（补充推导）"],
  },

  [conceptFormulaKey("thermo-bridge", "熵：从热力学定义到统计定义")]: {
    id: "boltzmann-entropy-and-temperature",
    title: "Boltzmann 熵与统计温度定义",
    aliases: ["Boltzmann entropy", "microcanonical temperature", "S=kBlnΩ"],
    kind: "定义",
    origin: "独立系统的态数相乘，而热力学熵应相加；对数是把乘法变成加法的自然选择。温度随后由两个系统交换能量时的最大总态数条件识别。",
    symbols: [
      { symbol: "Ω(E,V,N)", meaning: "满足宏观约束的可访问微观态数" },
      { symbol: "S", meaning: "Boltzmann 熵" },
      { symbol: "T", meaning: "由熵对能量斜率定义的绝对温度" },
      { symbol: "kB", meaning: "把无量纲 lnΩ 转换为 J/K 的 Boltzmann 常数" },
    ],
    prerequisites: ["独立事件的计数相乘", "对数法则", "一变量极值"],
    assumptions: ["微正则平衡态", "两个弱耦合系统总能量固定", "大系统中最大态数附近主导"],
    steps: [
      {
        title: "组合两个独立子系统的态数",
        formula: "Ωtot(E1)=Ω1(E1)Ω2(Etot−E1)",
        explanation: "给定一次能量分配，系统 1 的每个状态都能与系统 2 的每个状态配对。",
      },
      {
        title: "用对数把乘法变成可加量",
        formula: "kBlnΩtot=kBlnΩ1+kBlnΩ2  ⇒  Stot=S1+S2",
        explanation: "因此定义 S=kBlnΩ，使独立系统的熵具有热力学要求的可加性。",
      },
      {
        title: "在平衡能量分配处求极值",
        formula: "dStot/dE1=(∂S1/∂E1)V1,N1−(∂S2/∂E2)V2,N2=0",
        explanation: "E2=Etot−E1，所以 dE2/dE1=−1；平衡位于总态数也即总熵最大处。",
      },
      {
        title: "识别两侧共同的强度量",
        formula: "(∂S1/∂E1)V1,N1=(∂S2/∂E2)V2,N2",
        explanation: "热平衡时两边这一斜率相等，因此可用它定义可传递比较的温度。",
      },
      {
        title: "定义统计温度",
        formula: "1/T=(∂S/∂E)V,N",
        explanation: "熵随能量增长越快，1/T 越大、温度越低。",
      },
    ],
    conclusion: "S=kBlnΩ；  1/T=(∂S/∂E)V,N",
    checks: ["Ω 必须是无量纲态数或使用一致参考测度", "S 的量纲为 J/K", "偏导时 V、N 固定", "稳定平衡还要检查总熵为最大而非最小"],
    evidence: ["课件 3 slides 3–9", "课件 3 slides 10–15", "David Tong Ch. 4"],
  },

  [conceptFormulaKey("thermo-bridge", "为什么需要不同热力学势")]: {
    id: "thermodynamic-potentials-legendre-transforms",
    title: "由内能构造 Helmholtz、Gibbs 与巨势",
    aliases: ["thermodynamic potentials", "Legendre transform", "free energy"],
    kind: "定义",
    origin: "从 U(S,V,N) 的自然变量出发，用 Legendre 变换把不便控制的广延量换成实验可控的共轭强度量。",
    symbols: [
      { symbol: "F", meaning: "Helmholtz 自由能，自然变量 T,V,N" },
      { symbol: "G", meaning: "Gibbs 自由能，自然变量 T,P,N" },
      { symbol: "ΦG", meaning: "巨势，自然变量 T,V,μ" },
      { symbol: "U", meaning: "内能，自然变量 S,V,N" },
    ],
    prerequisites: ["基本关系 dU=T dS−P dV+μ dN", "乘积微分", "Legendre 变换的变量交换思想"],
    assumptions: ["平衡态热力学", "只含 P dV 功", "使用同一符号约定"],
    steps: [
      {
        title: "以 T 替换 S",
        formula: "F≡U−TS",
        explanation: "减去共轭乘积 TS，把自然变量 S 换成其共轭量 T。",
      },
      {
        title: "验证 Helmholtz 的自然变量",
        formula: "dF=dU−T dS−S dT=−S dT−P dV+μ dN",
        explanation: "代入 dU 后 T dS 抵消，剩余微分为 dT、dV、dN。",
      },
      {
        title: "再以 P 替换 V",
        formula: "G≡F+PV=U−TS+PV",
        explanation: "因为 U 的体积共轭系数是 −P，所以加上 PV 可把 V 换成 P。",
      },
      {
        title: "验证 Gibbs 的自然变量",
        formula: "dG=dF+P dV+V dP=−S dT+V dP+μ dN",
        explanation: "−P dV 与 +P dV 抵消，剩余微分为 dT、dP、dN。",
      },
      {
        title: "以 μ 替换 N",
        formula: "ΦG≡F−μN=U−TS−μN",
        explanation: "从 F 中减去 μN，把粒子数 N 换成化学势 μ。",
      },
      {
        title: "验证巨势的自然变量",
        formula: "dΦG=dF−μ dN−N dμ=−S dT−P dV−N dμ",
        explanation: "+μ dN 与 −μ dN 抵消，留下 T、V、μ。",
      },
    ],
    conclusion: "F=U−TS； G=U−TS+PV； ΦG=U−TS−μN",
    checks: ["三个势都具有能量量纲", "G 与巨势 ΦG 不能因老师记号相近而混淆", "每次 Legendre 变换后用全微分检查自然变量"],
    evidence: ["由课件 1 slide 18 的势函数继续推导", "David Tong Ch. 4（补充）"],
  },

  [deepDiveFormulaKey("thermo-bridge", "补课：Maxwell relations 从哪里来", "(∂S/∂V)T = (∂P/∂T)V")]: {
    id: "maxwell-relation-helmholtz",
    title: "由 Helmholtz 自由能得到 Maxwell relation",
    aliases: ["Maxwell relation", "mixed partial derivatives"],
    kind: "推导结果",
    origin: "F(T,V,N) 是状态函数；其足够光滑时，先对 T 后对 V 与先对 V 后对 T 的混合偏导相等。",
    symbols: [
      { symbol: "F", meaning: "Helmholtz 自由能" },
      { symbol: "S", meaning: "熵" },
      { symbol: "P", meaning: "压强" },
    ],
    prerequisites: ["dF=−S dT−P dV+μ dN", "二阶混合偏导可交换"],
    assumptions: ["固定 N", "F 在所研究区域至少二阶连续可微", "不跨越使导数不连续的一阶相变点"],
    steps: [
      {
        title: "从全微分读出一阶偏导",
        formula: "S=−(∂F/∂T)V,N；  P=−(∂F/∂V)T,N",
        explanation: "比较 dF 的 dT 与 dV 系数。",
      },
      {
        title: "分别再求一次偏导",
        formula: "(∂S/∂V)T,N=−∂V∂T F；  (∂P/∂T)V,N=−∂T∂V F",
        explanation: "两边都来自 F 的同一个二阶混合偏导，只是求导次序相反。",
      },
      {
        title: "交换混合偏导顺序",
        formula: "∂V∂T F=∂T∂V F",
        explanation: "F 足够光滑时使用 Clairaut 定理。",
      },
      {
        title: "消去共同负号",
        formula: "(∂S/∂V)T=(∂P/∂T)V",
        explanation: "固定的 N 在本节语境中省略书写，但理解上始终保持不变。",
      },
    ],
    conclusion: "(∂S/∂V)T = (∂P/∂T)V",
    checks: ["两边量纲都为压强/温度，也等价于熵/体积", "先写正确热力学势再交换偏导", "相变不光滑点不能直接套用"],
    evidence: ["由课件 1 slide 18 的势函数继续推导", "David Tong Ch. 4（补充）"],
  },

  [conceptFormulaKey("hamilton-phase-space", "为什么换成 Hamilton 语言")]: {
    id: "hamilton-equations-from-legendre-transform",
    title: "由 Lagrangian 的 Legendre 变换得到 Hamilton 方程",
    aliases: ["Hamilton equations", "canonical equations", "Legendre transform"],
    kind: "推导结果",
    origin: "以 p_i=∂L/∂q̇i 定义共轭动量，并对 H=Σi pi q̇i−L 做全微分。",
    symbols: [
      { symbol: "q_i", meaning: "第 i 个广义坐标" },
      { symbol: "p_i", meaning: "与 q_i 共轭的广义动量" },
      { symbol: "H", meaning: "Hamiltonian，写成 q、p、t 的函数" },
      { symbol: "L", meaning: "Lagrangian，写成 q、q̇、t 的函数" },
    ],
    prerequisites: ["Lagrangian 方程", "共轭动量定义", "乘积与全微分"],
    assumptions: ["Legendre 变换非奇异，可以用 p 反解 q̇", "系统由正则坐标描述", "函数足够可微"],
    steps: [
      {
        title: "定义动量与 Hamiltonian",
        formula: "pi=∂L/∂q̇i；  H(q,p,t)=Σi pi q̇i−L(q,q̇,t)",
        explanation: "H 是对所有速度变量做 Legendre 变换后的函数。",
      },
      {
        title: "对 H 逐项微分",
        formula: "dH=Σi(q̇i dpi+pi d q̇i)−Σi[(∂L/∂qi)dqi+(∂L/∂q̇i)d q̇i]−(∂L/∂t)dt",
        explanation: "第一项使用乘积法则，第二项是 L 的全微分。",
      },
      {
        title: "利用动量定义消去速度微分",
        formula: "pi=∂L/∂q̇i  ⇒  pi d q̇i−(∂L/∂q̇i)d q̇i=0",
        explanation: "这正是 Legendre 变换把自然变量从 q̇ 换成 p 的关键抵消。",
      },
      {
        title: "利用 Euler–Lagrange 方程",
        formula: "d/dt(∂L/∂q̇i)=∂L/∂qi  ⇒  ṗi=∂L/∂qi",
        explanation: "把剩余的 ∂L/∂qi 改写成共轭动量的时间导数。",
      },
      {
        title: "得到 H 的物理全微分",
        formula: "dH=Σi(q̇i dpi−ṗi dqi)−(∂L/∂t)dt",
        explanation: "现在 dH 已完全用 H 的独立变量 q、p、t 表示。",
      },
      {
        title: "与 H 的数学全微分比较",
        formula: "dH=Σi[(∂H/∂qi)dqi+(∂H/∂pi)dpi]+(∂H/∂t)dt",
        explanation: "比较 dqi 与 dpi 前的系数，分别读出两条正则运动方程。",
      },
    ],
    conclusion: "q̇i=∂H/∂pi； ṗi=−∂H/∂qi",
    checks: ["H=p²/(2m)+V(q) 时应给 q̇=p/m、ṗ=−dV/dq", "两条方程是一阶且符号相反", "若 Legendre 变换奇异，需要约束 Hamiltonian 理论"],
    evidence: ["课件 2 slide 7（老师给出 Hamilton 方程终点）", "标准分析力学 Legendre 变换补推"],
  },

  [conceptFormulaKey("hamilton-phase-space", "一个微观态就是相空间一点")]: {
    id: "classical-phase-space-measure-state-count",
    title: "经典 N 粒子相空间测度与无量纲态数",
    aliases: ["phase space measure", "Gibbs correction", "h cell"],
    kind: "定义",
    origin: "经典微观态由全部位置与动量指定。裸相空间测度来自经典力学；用 h^{3N} 作为状态单元是量子/半经典态计数输入的 prescription，并非仅凭量纲唯一推出；N! 只用于全同经典粒子。",
    symbols: [
      { symbol: "Γ", meaning: "6N 维经典相空间" },
      { symbol: "d^{3N}q", meaning: "全部 N 个三维位置的体积元" },
      { symbol: "d^{3N}p", meaning: "全部 N 个三维动量的体积元" },
      { symbol: "h", meaning: "用于相空间单元计数的 Planck 常数" },
    ],
    prerequisites: ["多重积分的乘积测度", "自由度计数", "全同粒子的交换不可分辨性"],
    assumptions: [
      "N 个三维经典粒子，使用正则坐标与动量",
      "在使用 1/N! 时，粒子全同且交换标签不产生新物理态",
      "h^{3N} 的单元解释采用半经典状态计数，而非纯经典动力学定理",
    ],
    steps: [
      {
        title: "写单个三维粒子的微观坐标",
        formula: "Γ1=(x,y,z,px,py,pz)；  dΓ1=d³q d³p",
        explanation: "位置和动量各有三个分量，所以单粒子相空间为六维。",
      },
      {
        title: "对 N 个粒子取直积",
        formula: "dΓ=Πa=1N d³qa d³pa=d³Nq d³Np",
        explanation: "所有粒子的坐标都必须同时指定，测度因此相乘。",
      },
      {
        title: "引入半经典相空间单元",
        formula: "raw state count ∼ ∫dΓ/h³ᴺ",
        explanation: "量纲检查说明需要一个作用量尺度；具体选 h 来自量子/半经典的每态相空间单元规则，不是量纲分析单独决定。",
      },
      {
        title: "消除标签交换的重复计数",
        formula: "physical state count ∼ (1/N!)∫dΓ/h³ᴺ",
        explanation: "同一全同粒子配置在带标签积分中被 N! 个置换重复计算。",
      },
    ],
    conclusion: "dΓ = d³Nq d³Np；  classical state count ∼ [1/(N!h³ᴺ)]∫dΓ",
    checks: ["dΓ/h^{3N} 必须无量纲", "可区分粒子模型不能机械除以 N!", "具体态数还必须写清积分区域或能量约束"],
    evidence: ["课件 2 slides 2–3（6N 相空间与裸 dΓ）", "课件 3 slides 25–27（N!）", "2025 期中 Q1(b)（1/[N!h³ᴺ]）"],
  },

  [conceptFormulaKey("hamilton-phase-space", "Poisson bracket 是相空间的导数规则")]: {
    id: "observable-time-evolution-poisson-bracket",
    title: "可观测量沿 Hamilton 轨迹的时间演化",
    aliases: ["Poisson bracket", "total time derivative", "conserved quantity"],
    kind: "推导结果",
    origin: "把 A(q,p,t) 沿轨迹的全时间导数展开，再代入 Hamilton 方程。",
    symbols: [
      { symbol: "A(q,p,t)", meaning: "任意经典相空间可观测量" },
      { symbol: "{A,H}", meaning: "A 与 Hamiltonian 的 Poisson bracket" },
      { symbol: "H", meaning: "生成时间演化的 Hamiltonian" },
    ],
    prerequisites: ["多变量链式法则", "Hamilton 方程", "Poisson bracket 定义"],
    assumptions: ["使用正则相空间坐标", "A 与 H 足够可微"],
    steps: [
      {
        title: "沿实际轨迹写全导数",
        formula: "dA/dt=∂A/∂t+Σi[(∂A/∂qi)q̇i+(∂A/∂pi)ṗi]",
        explanation: "A 既可能显含 t，也会因 q_i(t)、p_i(t) 移动而改变。",
      },
      {
        title: "代入 Hamilton 方程",
        formula: "dA/dt=∂A/∂t+Σi[(∂A/∂qi)(∂H/∂pi)−(∂A/∂pi)(∂H/∂qi)]",
        explanation: "使用 q̇i=∂H/∂pi 与 ṗi=−∂H/∂qi，负号来自第二条 Hamilton 方程。",
      },
      {
        title: "识别 Poisson bracket",
        formula: "{A,H}≡Σi[(∂A/∂qi)(∂H/∂pi)−(∂A/∂pi)(∂H/∂qi)]",
        explanation: "括号只是把反复出现的相空间导数组合命名。",
      },
      {
        title: "得到紧凑演化式",
        formula: "dA/dt=∂A/∂t+{A,H}",
        explanation: "若 A 不显含时间且 {A,H}=0，A 就沿每条轨迹守恒。",
      },
    ],
    conclusion: "dA/dt = ∂A/∂t + {A,H}",
    checks: ["令 A=q_i 应恢复 q̇_i", "令 A=p_i 应恢复 ṗ_i", "令 A=H 且 H 不显含时间应得到 dH/dt=0"],
    evidence: ["课件 2 slides 2–16", "作业 1 Q1"],
  },

  [conceptFormulaKey("hamilton-phase-space", "Jacobian、连续性与相空间不可压缩")]: {
    id: "hamilton-flow-zero-divergence",
    title: "Hamilton 流在相空间中的散度为零",
    aliases: ["Liouville theorem", "phase-space incompressibility", "Jacobian"],
    kind: "推导结果",
    origin: "将相空间速度 vΓ=(q̇1,…,ṗ1,…) 代入散度，并用 Hamiltonian 混合偏导的可交换性逐自由度抵消。",
    symbols: [
      { symbol: "vΓ", meaning: "Hamilton 流在相空间中的速度场" },
      { symbol: "∇Γ", meaning: "对全部 q_i、p_i 的相空间梯度" },
      { symbol: "H", meaning: "Hamiltonian" },
    ],
    prerequisites: ["Hamilton 方程", "散度", "二阶混合偏导"],
    assumptions: ["H 对 q_i、p_i 至少二阶连续可微", "使用正则坐标", "不含非 Hamiltonian 摩擦流"],
    steps: [
      {
        title: "写出相空间速度场",
        formula: "vΓ=(q̇1,…,q̇n,ṗ1,…,ṗn)",
        explanation: "一个相空间点的每个坐标都由对应 Hamilton 方程给出速度。",
      },
      {
        title: "按定义计算散度",
        formula: "∇Γ·vΓ=Σi(∂q̇i/∂qi+∂ṗi/∂pi)",
        explanation: "散度衡量随流移动的小相空间体积在一阶上膨胀还是收缩。",
      },
      {
        title: "代入两条 Hamilton 方程",
        formula: "∇Γ·vΓ=Σi[∂²H/(∂qi∂pi)−∂²H/(∂pi∂qi)]",
        explanation: "q̇_i 对 q_i 求导产生第一项，ṗ_i 的负号产生第二项。",
      },
      {
        title: "逐项使用混合偏导相等",
        formula: "∂²H/(∂qi∂pi)=∂²H/(∂pi∂qi)  ⇒  ∇Γ·vΓ=0",
        explanation: "每个 i 的两项正负抵消，所以 Hamilton 流像不可压缩流体。",
      },
    ],
    conclusion: "∇Γ·vΓ = Σi(∂q̇i/∂qi+∂ṗi/∂pi)=0",
    checks: ["结论只表示相空间体积守恒，不表示相空间点静止", "小时间 Jacobian 应为 1+O(δt²)", "加入摩擦的非 Hamiltonian 流一般散度不为零"],
    evidence: ["课件 2 slides 2–16", "作业 1 Q1", "期中 Q1(a)"],
  },

  [conceptFormulaKey("statistical-entry", "统计物理的翻译任务")]: {
    id: "statistical-physics-translation-chain",
    title: "从微观模型到热力学的四层翻译链",
    aliases: ["statistical physics workflow", "micro to macro", "course map"],
    kind: "解题框架",
    origin: "统计物理的工作流不是单条可证明的等式，而是把微观能量、概率模型、可观测平均和热力学预测依次连接。",
    symbols: [
      { symbol: "microstate", meaning: "由全部微观自由度指定的状态" },
      { symbol: "ρ", meaning: "微观态上的概率分布" },
      { symbol: "⟨A⟩", meaning: "可观测量的系综平均" },
    ],
    prerequisites: ["微观态与宏观态", "Hamiltonian", "概率平均"],
    assumptions: ["已选定微观模型和宏观控制条件", "平衡问题中使用相应平衡系综", "宏观量可由所选分布的平均描述"],
    steps: [
      {
        title: "指定微观能量规则",
        formula: "microstate Γ  →  energy H(Γ)",
        explanation: "Hamiltonian 告诉我们哪些微观配置允许、每个配置代价多少能量。",
      },
      {
        title: "由控制条件选择概率",
        formula: "constraints + H(Γ)  →  normalized probability ρ(Γ)",
        explanation: "固定 E、固定 T 或固定 μ 会对应不同系综，但概率都必须归一化。",
      },
      {
        title: "对微观可观测量取平均",
        formula: "ρ(Γ)+A(Γ)  →  ⟨A⟩=∫dΓρ(Γ)A(Γ)",
        explanation: "不追踪单条轨迹，而直接计算实验会稳定看到的平均和涨落。",
      },
      {
        title: "识别宏观关系",
        formula: "⟨E⟩,⟨P⟩,⟨N⟩,…  →  thermodynamics",
        explanation: "把平均量及其导数解释为内能、压强、粒子数、热容等热力学对象。",
      },
    ],
    conclusion: "microphysics → probability over microstates → ensemble average → thermodynamics",
    checks: ["不能只有分布而没有 Hamiltonian", "必须说明外界固定哪些量", "预测应包含平均值以及需要时的涨落"],
    evidence: ["课件 1 slides 1–25", "David Tong pp. 1–2", "MIT OCW L1–2"],
  },

  [conceptFormulaKey("statistical-entry", "宏观状态、微观态与 ensemble")]: {
    id: "classical-ensemble-average",
    title: "经典相空间中的系综平均",
    aliases: ["ensemble average", "phase-space density", "observable average"],
    kind: "定义",
    origin: "把连续相空间切成微小单元，先写离散概率加权平均，再让单元体积趋于零。",
    symbols: [
      { symbol: "Γ", meaning: "相空间点，包含全部 q 与 p" },
      { symbol: "ρ(Γ)", meaning: "相空间概率密度" },
      { symbol: "A(Γ)", meaning: "微观态 Γ 上可观测量 A 的值" },
    ],
    prerequisites: ["离散期望值", "概率密度", "多维积分"],
    assumptions: ["ρ(Γ)≥0", "∫dΓρ(Γ)=1", "A 的相应平均存在"],
    steps: [
      {
        title: "把相空间分成小单元",
        formula: "Pα≈ρ(Γα)ΔΓα",
        explanation: "概率密度乘小相空间体积，给出系统落在第 α 个单元的概率。",
      },
      {
        title: "先写离散加权平均",
        formula: "⟨A⟩≈Σα PαA(Γα)=Σαρ(Γα)A(Γα)ΔΓα",
        explanation: "每个小单元贡献“落入该格的概率 × 该格中的 A 值”。",
      },
      {
        title: "取连续极限",
        formula: "max(ΔΓα)→0  ⇒  Σαρ(Γα)A(Γα)ΔΓα→∫dΓρ(Γ)A(Γ)",
        explanation: "多维 Riemann 和变成整个允许相空间上的积分。",
      },
      {
        title: "用常数可观测量检查归一化",
        formula: "A(Γ)=1  ⇒  ⟨1⟩=∫dΓρ(Γ)=1",
        explanation: "如果这一步不成立，任何后续平均值都没有概率意义。",
      },
    ],
    conclusion: "⟨A⟩ = ∫dΓ ρ(Γ) A(Γ)",
    checks: ["ρ 的量纲必须是相空间体积的倒数", "A=1 时结果必须为 1", "积分区域要与宏观约束一致"],
    evidence: ["课件 2 slide 3", "David Tong pp. 1–2 与 Ch. 2.3（补充）"],
  },

  [conceptFormulaKey("statistical-entry", "Maxwell–Boltzmann 速度分布怎么读")]: {
    id: "maxwell-boltzmann-speed-distribution",
    title: "从三维速度分量分布得到 speed 分布",
    aliases: ["Maxwell distribution", "speed distribution", "Gaussian velocity"],
    kind: "推导结果",
    origin: "三个笛卡尔速度分量在经典平衡下各自为 Gaussian；把三维速度概率密度对半径为 v 的球壳方向积分。",
    symbols: [
      { symbol: "v", meaning: "速度向量的大小，v≥0" },
      { symbol: "m", meaning: "单粒子质量" },
      { symbol: "T", meaning: "绝对温度" },
      { symbol: "f(v)", meaning: "speed 的一维概率密度" },
    ],
    prerequisites: ["Boltzmann 权重", "一维 Gaussian 归一化", "球坐标体积元 d³v=v²dv dΩ"],
    assumptions: ["稀薄经典非相对论理想气体", "热平衡且各向同性", "三个速度分量独立"],
    steps: [
      {
        title: "写单个速度分量的归一化 Gaussian",
        formula: "p(vx)=√[m/(2πkBT)] exp[−mvx²/(2kBT)]",
        explanation: "动能 mvx²/2 给 Boltzmann 指数，Gaussian 积分确定归一化常数。",
      },
      {
        title: "相乘得到三维速度密度",
        formula: "p(vx,vy,vz)=[m/(2πkBT)]^(3/2) exp[−m(vx²+vy²+vz²)/(2kBT)]",
        explanation: "三个独立同分布分量的联合概率等于三个边缘概率的乘积。",
      },
      {
        title: "识别速度大小",
        formula: "v²=vx²+vy²+vz²  ⇒  p(vx,vy,vz)=[m/(2πkBT)]^(3/2)e^[−mv²/(2kBT)]",
        explanation: "各向同性使概率密度只依赖半径 v，不依赖方向。",
      },
      {
        title: "对固定 v 的全部方向求和",
        formula: "f(v)dv=p(vx,vy,vz)·4πv²dv",
        explanation: "半径 v、厚度 dv 的速度空间球壳体积是 4πv²dv。",
      },
      {
        title: "得到 speed 分布",
        formula: "f(v)=4π[m/(2πkBT)]^(3/2)v² exp[−mv²/(2kBT)]",
        explanation: "v² 的态数增长与大 v 的指数抑制竞争，使峰值出现在非零速度。",
      },
    ],
    conclusion: "f(v)=4π(m/2πkBT)^(3/2) v² exp[−mv²/(2kBT)]",
    checks: ["∫₀∞f(v)dv=1", "f(0)=0 且 v→∞ 时 f(v)→0", "f(v) 的量纲为 1/速度", "升高 T 应使分布变宽"],
    evidence: ["课件 1 slides 21–25", "David Tong Ch. 2.3"],
  },

  [conceptFormulaKey("statistical-entry", "equipartition 与理想气体定律")]: {
    id: "kinetic-pressure-equipartition-ideal-gas",
    title: "从碰壁动量通量和均分定理得到 U 与 PV",
    aliases: ["equipartition", "kinetic pressure", "ideal gas law"],
    kind: "推导结果",
    origin: "弹性碰壁把微观动量变化转成压强；各向同性与三个平动二次自由度的均分给出温度关系。",
    symbols: [
      { symbol: "⟨v_x²⟩", meaning: "单个速度分量平方的系综平均" },
      { symbol: "⟨v²⟩", meaning: "速度大小平方的系综平均" },
      { symbol: "U", meaning: "单原子理想气体总内能" },
    ],
    prerequisites: ["弹性碰撞", "各向同性", "经典均分定理"],
    assumptions: ["三维单原子经典理想气体", "热平衡", "粒子间相互作用和边界势能可忽略"],
    steps: [
      {
        title: "由单粒子碰墙得到力",
        formula: "Δpx=2mvx；  collision rate=|vx|/(2L)  ⇒  F̄x=mvx²/L",
        explanation: "动量传递乘单位时间碰撞次数，给出该粒子对法向墙的平均力。",
      },
      {
        title: "对全部粒子求和得到压强",
        formula: "P=(1/A)Σi m vxi²/L=(N/V)m⟨vx²⟩",
        explanation: "墙面积 A 与边长 L 满足 V=AL。",
      },
      {
        title: "用各向同性合并三个分量",
        formula: "⟨vx²⟩=(1/3)⟨vx²+vy²+vz²⟩=(1/3)⟨v²⟩",
        explanation: "三个方向统计等价，各承担总平方速度的三分之一。",
      },
      {
        title: "把压强写成总动能",
        formula: "PV=(N/3)m⟨v²⟩=(2/3)U",
        explanation: "单原子理想气体只有平动动能，所以 U=N⟨mv²/2⟩。",
      },
      {
        title: "对三个二次自由度使用均分",
        formula: "U=N·3(kBT/2)=3NkBT/2",
        explanation: "p_x²/(2m)、p_y²/(2m)、p_z²/(2m) 各贡献 kBT/2。",
      },
      {
        title: "代回压力关系",
        formula: "PV=(2/3)(3NkBT/2)=NkBT",
        explanation: "同一推导同时给出内能和理想气体状态方程。",
      },
    ],
    conclusion: "P=(N/V)m⟨v_x²⟩=(N/3V)m⟨v²⟩;  U=3NkBT/2;  PV=NkBT",
    checks: ["PV 与 U 都具有能量量纲", "P=(2/3)U/V", "低温量子冻结或内部转动振动自由度会改变 U 的系数"],
    evidence: ["课件 1 slides 8–25", "David Tong Ch. 2.3", "MIT OCW L1–2"],
  },
};
