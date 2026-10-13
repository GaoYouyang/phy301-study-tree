import {
  conceptFormulaKey,
  type FormulaDerivation,
} from "./formula-derivation-types";

export const nonequilibriumFormulaDerivations: Record<
  string,
  FormulaDerivation
> = {
  [conceptFormulaKey("nonequilibrium", "闭环一：随机游走 → 扩散")]: {
    id: "random-walk-gaussian-msd",
    title: "从离散随机游走得到均方位移与 Gaussian",
    kind: "推导结果",
    origin:
      "把一维位置写成许多次独立小步的和，再用独立性计算二阶矩；连续极限中保持 a²/(2τ) 固定，便得到扩散常数 D。",
    symbols: [
      { symbol: "a", meaning: "每一步的长度" },
      { symbol: "τ", meaning: "每一步经历的时间" },
      { symbol: "D=a²/(2τ)", meaning: "一维扩散常数" },
      { symbol: "P(x,t)", meaning: "时刻 t 在 x 附近的概率密度" },
    ],
    prerequisites: ["独立随机变量的方差相加", "二项分布或中心极限定理", "概率密度归一化"],
    assumptions: [
      "每一步以相同概率向左或向右，且各步相互独立",
      "单步方差有限；连续极限取 a→0、τ→0，同时 D=a²/(2τ) 保持有限",
      "连续 Gaussian 写法采用点源初态 P(x,0)=δ(x)，并假设无限直线或在所看时间内远离边界",
      "固定 N 时可达格点具有同一奇偶性，相邻可达位置间距为 2a",
    ],
    steps: [
      {
        title: "把终点写成每一步的和",
        formula: "x_N=Σ_{j=1}^N Δx_j，Δx_j=±a，t=Nτ",
        explanation:
          "对称性给 ⟨Δx_j⟩=0，所以 ⟨x_N⟩=0；位置没有平均漂移，但分布会逐渐展宽。",
      },
      {
        title: "展开平方并用独立性消掉交叉项",
        formula: "⟨x_N²⟩=Σ_j⟨Δx_j²⟩+Σ_{i≠j}⟨Δx_iΔx_j⟩=Na²",
        explanation:
          "独立且零均值使 i≠j 的交叉项为零；每一步的平方恒为 a²。",
      },
      {
        title: "把步数换成时间并定义连续尺度",
        formula: "⟨x²(t)⟩=(t/τ)a²=2Dt，D=a²/(2τ)",
        explanation:
          "这一步定义了连续扩散中保留下来的组合 D；D 的单位是长度²/时间。",
      },
      {
        title: "写出一步后的离散概率更新",
        formula:
          "P(x,t+τ)=(1/2)[P(x−a,t)+P(x+a,t)]",
        explanation:
          "要在下一时刻到达 x，上一步只能位于 x−a 后向右走，或位于 x+a 后向左走；两条路径各乘 1/2。",
      },
      {
        title: "两边 Taylor 展开得到扩散方程",
        formula:
          "P+τ∂tP=P+(a²/2)∂x²P+O(τ²,a⁴) ⇒ ∂tP=D∂x²P",
        explanation:
          "左右位移的一阶导数项相消；除以 τ 并在 a²/(2τ)=D 固定的连续极限丢掉高阶项。",
      },
      {
        title: "先数出恰好走到格点 m 的路径",
        formula:
          "P_N(m)=2^(−N)N!/[n_+!n_-!]，n_+=(N+m)/2，n_-=(N−m)/2，x=ma",
        explanation:
          "要有 n_+ 步向右、n_- 步向左，并满足 n_++n_-=N、n_+−n_-=m；二项系数数出这些左右步的排列数。",
      },
      {
        title: "对三个阶乘使用 Stirling 并保留二次项",
        formula:
          "P_N(m)≈√[2/(πN)] exp[−m²/(2N)]",
        explanation:
          "在分布中心 m≪N 附近展开 lnP_N；常数项给归一化前因子，关于 m 的最低非零项是负的二次项。",
      },
      {
        title: "把格点概率换成连续概率密度",
        formula:
          "P(x,t)=P_N(m)/(2a)≈[2πNa²]^(−1/2)exp[−x²/(2Na²)]=[4πDt]^(−1/2)exp[−x²/(4Dt)]",
        explanation:
          "固定 N 时允许的 m 相差 2，所以相邻位置间距是 2a；除以 2a 才把概率质量变为密度。最后用 Na²=2Dt 得到连续扩散核。",
      },
    ],
    conclusion:
      "⟨x²(t)⟩=2Dt（1D）；P(x,t)=[4πDt]^(−1/2)exp[−x²/(4Dt)]",
    checks: [
      "∫₋∞^∞P(x,t)dx=1。",
      "P 关于 x 对称，所以 ⟨x⟩=0；这不妨碍 ⟨x²⟩ 随时间增长。",
      "Dt 的单位是长度²，因此指数 x²/(4Dt) 无量纲。",
    ],
    evidence: ["Lecture 10 slide 6"],
  },

  [conceptFormulaKey("nonequilibrium", "读 Fick 方程前：四个空间微分动作")]: {
    id: "continuity-gradient-divergence-laplacian",
    title: "斜率、净流出、曲率与局部守恒",
    kind: "推导结果",
    origin:
      "这些符号先来自微积分和库存守恒，而不是扩散模型。把一个很短区间看作小仓库，流入减流出就是区间内粒子数的变化。",
    symbols: [
      { symbol: "n(x,t)", meaning: "粒子数密度" },
      { symbol: "J(x,t)", meaning: "沿 x 方向的粒子流密度" },
      { symbol: "∂x n", meaning: "密度曲线的局部斜率" },
      { symbol: "∂x² n", meaning: "密度曲线的局部曲率" },
    ],
    prerequisites: ["一元函数斜率", "小区间内的流入减流出", "偏导表示只改变一个变量"],
    assumptions: ["n 与 J 足够光滑，可以对小区间做一阶展开", "区间内部没有粒子产生或消失"],
    steps: [
      {
        title: "写一个小区间的库存",
        formula: "N_[x,x+Δx](t)≈n(x,t)Δx",
        explanation:
          "当 Δx 很小时，区间内的密度可用左端或中点值近似。",
      },
      {
        title: "写流入减流出",
        formula: "dN/dt=J(x,t)−J(x+Δx,t)",
        explanation:
          "左边界流入为正，右边界流出要减去；负号来自库存方向，不是记忆技巧。",
      },
      {
        title: "Taylor 展开右边界的流",
        formula: "J(x+Δx,t)=J(x,t)+(∂xJ)Δx+O(Δx²)",
        explanation:
          "只保留一阶项后，流入减流出等于 −(∂xJ)Δx。",
      },
      {
        title: "除以区间长度得到局部守恒",
        formula: "∂t n+∂xJ=0",
        explanation:
          "三维时 ∂xJ 换成散度 ∇·J；若随后 J 与 ∂xn 成正比，就会出现二阶导 ∂x²n。",
      },
    ],
    conclusion:
      "1D: ∂xn → slope,  ∂xJ → net outflow,  ∂x²n → curvature;  ∂tn+∂xJ=0",
    checks: [
      "若 ∂xJ>0，右侧流出比左侧流入大，所以 ∂tn<0。",
      "全空间积分后只剩边界流；封闭边界下总粒子数守恒。",
    ],
    evidence: ["Lecture 10 slides 7–8"],
  },

  [conceptFormulaKey("nonequilibrium", "Fick + continuity → diffusion equation")]: {
    id: "fick-continuity-diffusion-equation",
    title: "由 Fick 本构关系和连续性方程得到扩散方程",
    kind: "推导结果",
    origin:
      "Fick 定律是近局域平衡下的经验本构关系；连续性方程是粒子数守恒。把两者代入，扩散方程才是严格的代数结果。",
    symbols: [
      { symbol: "J", meaning: "粒子流密度" },
      { symbol: "n", meaning: "粒子数密度" },
      { symbol: "D>0", meaning: "扩散常数" },
      { symbol: "∇²", meaning: "Laplacian，衡量局部曲率" },
    ],
    prerequisites: ["gradient、divergence 与 Laplacian", "连续性方程", "向量负号的方向含义"],
    assumptions: ["各向同性、常数 D", "没有体源或汇", "Fick 线性本构在所研究尺度有效"],
    steps: [
      {
        title: "写 Fick 定律",
        formula: "J=−D∇n",
        explanation:
          "密度沿某方向升高时，扩散流指向反方向；D>0，因此负号保证从高密度流向低密度。",
      },
      {
        title: "写局部粒子数守恒",
        formula: "∂t n+∇·J=0",
        explanation:
          "某点密度的增加等于流的净汇入；净流出由 ∇·J 表示。",
      },
      {
        title: "把本构关系代入守恒式",
        formula: "∂t n=−∇·J=−∇·(−D∇n)",
        explanation:
          "这里出现两个负号；漏掉其中一个会让扩散把起伏越放越大。",
      },
      {
        title: "常数 D 移出微分算符",
        formula: "∂t n=D∇·∇n=D∇²n",
        explanation:
          "若 D 随位置变化，正确形式应保留为 ∇·(D∇n)，不能直接写 D∇²n。",
      },
    ],
    conclusion: "J=−D∇n;  ∂tn+∇·J=0  ⇒  ∂tn=D∇²n",
    checks: [
      "D 的单位必须是长度²/时间。",
      "对全空间积分，边界无流时 d/dt∫n dV=0。",
      "Fourier 模式 n_k 会按 e^(−Dk²t) 衰减，而不是增长。",
    ],
    evidence: ["Lecture 10 slides 7–8"],
  },

  [conceptFormulaKey("nonequilibrium", "闭环二：Langevin 方程与涨落—耗散")]: {
    id: "langevin-fluctuation-dissipation-einstein",
    title: "Langevin 方程、白噪声强度与 Einstein 关系",
    kind: "模型",
    origin:
      "Langevin 模型把未追踪的热浴自由度压缩成平均阻尼 −γv 与随机力 ξ(t)。噪声强度不能任取：平衡时必须恢复 equipartition，这固定了涨落—耗散系数。",
    symbols: [
      { symbol: "m", meaning: "Brownian 粒子质量" },
      { symbol: "γ", meaning: "速度阻尼系数" },
      { symbol: "ξ(t)", meaning: "均值为零的随机热力" },
      { symbol: "τv=m/γ", meaning: "速度松弛时间" },
      { symbol: "D", meaning: "长时间位置扩散常数" },
    ],
    prerequisites: ["一阶线性微分方程的积分因子", "δ 函数", "equipartition：m⟨v²⟩/2=kBT/2"],
    assumptions: [
      "热浴相关时间远小于粒子的观测时间，可近似为白噪声",
      "线性阻尼、恒定温度且热浴处于平衡",
      "噪声均值为零；这不表示每条轨迹上的随机力为零",
      "公式按一维或单个笛卡尔分量书写；向量噪声另有 δij",
      "精确速度相关与 MSD 采用平衡初速度，且初态与未来噪声独立；非平衡初态只在长时间趋于同一扩散极限",
    ],
    steps: [
      {
        title: "先解线性随机微分方程",
        formula: "v(t)=v(0)e^(−t/τv)+(1/m)∫₀ᵗds e^[−(t−s)/τv]ξ(s)，τv=m/γ",
        explanation:
          "积分因子 e^(γt/m) 把阻尼项吸收；第一项遗忘初速度，第二项累计热浴的随机冲击。",
      },
      {
        title: "设白噪声相关强度为未知常数 A",
        formula: "⟨ξ(t)⟩=0，⟨ξ(t)ξ(t′)⟩=Aδ(t−t′)",
        explanation:
          "δ 函数让双重积分缩成单积分；A 之后由热平衡而不是猜测确定。",
      },
      {
        title: "计算长时间速度方差",
        formula: "lim_{t→∞}⟨v²(t)⟩=A/(2mγ)",
        explanation:
          "把形式解平方并用噪声相关式积分；初速度项随 e^(−2t/τv) 消失。",
      },
      {
        title: "用 equipartition 固定噪声强度",
        formula: "m⟨v²⟩=kBT ⇒ A=2γkBT",
        explanation:
          "阻尼越强，维持同一温度所需的随机冲击也越强；这就是涨落与耗散的配对。",
      },
      {
        title: "先求平衡速度相关函数",
        formula: "C_v(s)=⟨v(s)v(0)⟩=(kBT/m)e^(−|s|/τv)",
        explanation:
          "形式解中与 v(0) 相关的只有指数衰减项；平衡 equipartition 给 ⟨v²(0)⟩=kBT/m。",
      },
      {
        title: "把位移平方写成速度相关的双重积分",
        formula:
          "⟨Δx²(t)⟩=2∫₀ᵗds (t−s)C_v(s)=2(kBT/γ)[t−τv(1−e^(−t/τv))]",
        explanation:
          "由 Δx=∫₀ᵗv(s)ds 展开平方；平稳性把正方形积分区化为两倍三角区积分，再代入指数相关函数逐项积分。",
      },
      {
        title: "取长时间极限并读出扩散常数",
        formula:
          "t≫τv ⇒ ⟨Δx²(t)⟩≈2(kBT/γ)t=2Dt ⇒ D=kBT/γ",
        explanation:
          "长时间时常数修正 2(kBT/γ)τv 相对线性项可忽略，位置进入普通扩散；短时间展开则得到 ballistic 的 t² 行为。",
      },
    ],
    conclusion:
      "mṽ=−γv+ξ(t);  ⟨ξ(t)ξ(t′)⟩=2γkBTδ(t−t′);  D=kBT/γ",
    checks: [
      "噪声相关整体的单位应为力²；因此 A 的单位是力²×时间，而 δ(t−t′) 带 1/时间。",
      "γ 增大时 D 变小，符合更强阻力使空间扩散更慢。",
      "T→0 的经典模型给 D→0；极低温量子热浴需另建模型。",
    ],
    evidence: ["Lecture 10 slides 9–11"],
  },

  [conceptFormulaKey("nonequilibrium", "闭环三：Master equation → Fokker–Planck")]: {
    id: "master-kramers-moyal-fokker-planck",
    title: "由 Master equation 的小跳跃展开得到 Fokker–Planck",
    kind: "近似",
    origin:
      "Master equation 精确记录各位置之间的 gain−loss。若单次跳跃相对分布变化尺度很小，可对 gain 项做 Kramers–Moyal Taylor 展开，并在二阶截断。",
    symbols: [
      { symbol: "P(x,t)", meaning: "位置概率密度" },
      { symbol: "A(x)", meaning: "单位时间的一阶跳跃矩，即漂移" },
      { symbol: "B(x)", meaning: "单位时间的二阶跳跃矩" },
      { symbol: "W(x|x′)", meaning: "从 x′ 跳到 x 的跃迁率" },
      {
        symbol: "W_b(x)≡W(x+b|x)",
        meaning: "从 x 出发、发生大小为 b 的跳跃的跃迁率",
      },
    ],
    prerequisites: ["gain−loss 记账", "Taylor 展开到二阶", "分部积分与边界项"],
    assumptions: [
      "Markov 过程：下一步只依赖当前状态",
      "跳跃足够小且前两阶矩存在",
      "三阶及更高 Kramers–Moyal 项在研究尺度可忽略",
    ],
    steps: [
      {
        title: "从精确 gain−loss 方程开始",
        formula: "∂tP(x)=∫dx′[W(x|x′)P(x′)−W(x′|x)P(x)]",
        explanation:
          "第一项收集所有跳入 x 的概率，第二项减去从 x 跳走的概率。",
      },
      {
        title: "用跳跃量定义局域跃迁核",
        formula: "b=x−x′，W_b(y)≡W(y+b|y) ⇒ W(x|x−b)=W_b(x−b)",
        explanation:
          "W_b(y) 表示从 y 跳 b 到 y+b；因此从 x−b 跳到 x 的 gain 正是 W_b(x−b)P(x−b)。",
      },
      {
        title: "在目标位置 x 附近 Taylor 展开 gain 项",
        formula:
          "W_b(x−b)P(x−b)=Σ_{n=0}^∞(−b)^n/n! · ∂x^n[W_b(x)P(x)]",
        explanation:
          "P 与跃迁率都在 x 附近展开；小跳跃让高次幂 b^n 逐阶变小。",
      },
      {
        title: "把 loss 改变量并看见零阶抵消",
        formula:
          "∫db W_(−b)(x)P(x)=∫db W_b(x)P(x)",
        explanation:
          "在完整跳跃范围内把 loss 积分的 b 改名为 −b；它与 gain 展开中的 n=0 项完全相同，因此概率不会凭空产生或消失。",
      },
      {
        title: "定义每单位时间的跳跃矩",
        formula:
          "α_n(x)=∫db b^n W_b(x) ⇒ ∂tP=Σ_{n=1}^∞(−∂x)^n[α_nP]/n!",
        explanation:
          "把每个 Taylor 项对 b 积分；α₁ 给平均位移率，α₂ 给均方跳跃率，完整求和从 n=1 开始。",
      },
      {
        title: "保留到二阶",
        formula:
          "∂tP=−∂x[α₁P]+(1/2)∂x²[α₂P]+Σ_{n=3}^∞(−∂x)^n[α_nP]/n!",
        explanation:
          "在小跳跃近似下截断显式写出的高阶和，再令 A=α₁、B=α₂≥0，就得到 Fokker–Planck 方程。",
      },
    ],
    conclusion: "∂tP=−∂x[A(x)P]+½∂x²[B(x)P]",
    checks: [
      "A 的单位是 x/时间，B 的单位是 x²/时间。",
      "B=α₂ 是平方跳跃率，在常规 Markov 跳跃模型中应非负。",
      "对 x 积分后右边应只剩边界概率流，从而保持 ∫Pdx=1。",
      "有些教材把扩散系数定义为 B/2；看到公式时必须先核对约定。",
    ],
    evidence: ["Lecture 10 slides 12–14"],
  },

  [conceptFormulaKey("nonequilibrium", "详细平衡与平衡分布")]: {
    id: "smoluchowski-detailed-balance-boltzmann",
    title: "由零概率流恢复 Boltzmann 平衡分布",
    kind: "推导结果",
    origin:
      "把过阻尼动力学写成概率守恒形式。热平衡且无持续环流时令概率流 J=0，解一阶微分方程，再与 Boltzmann 分布比较。",
    symbols: [
      { symbol: "U(x)", meaning: "外势能" },
      { symbol: "γ", meaning: "过阻尼摩擦系数" },
      { symbol: "D", meaning: "位置扩散常数" },
      { symbol: "P_eq(x)", meaning: "归一化后的平衡位置分布" },
    ],
    prerequisites: ["Fokker–Planck 的 continuity 形式", "一阶可分离微分方程", "Boltzmann 权重"],
    assumptions: [
      "过阻尼极限、常数 γ 与 D，且保守力 F=−U′",
      "平衡边界条件要求净概率流 J=0",
      "e^(−βU) 在给定区域可归一化，或边界条件足以定义平衡分布",
      "Boltzmann 权重作为热平衡输入；仅凭 Fokker–Planck 方程本身不能独立规定热浴温度",
    ],
    steps: [
      {
        title: "识别漂移和扩散后的概率流",
        formula: "∂tP=−∂xJ，J=−(U′/γ)P−D∂xP",
        explanation:
          "确定性漂移速度是 F/γ=−U′/γ；扩散流仍为 −D∂xP。",
      },
      {
        title: "平衡时令净流为零",
        formula: "0=−(U′/γ)P_eq−D∂xP_eq",
        explanation:
          "stationary 只要求 ∂tP=0；这里进一步采用详细平衡边界条件，排除恒定环流。",
      },
      {
        title: "分离变量并积分",
        formula: "∂xP_eq/P_eq=−U′/(γD) ⇒ lnP_eq=−U/(γD)+constant",
        explanation:
          "左侧是 ∂x lnP；右侧 U′ 对 x 积分后恢复势能 U。",
      },
      {
        title: "与热平衡的 Boltzmann 权重比较",
        formula: "P_eq∝e^[−U/(γD)]，P_eq∝e^(−U/kBT) ⇒ γD=kBT",
        explanation:
          "要求随机动力学与已知的热平衡 Boltzmann 权重一致，两个指数才必须逐点相同；这给出涨落—耗散约束，而不是从 FP 单独证明 Boltzmann 定律。",
      },
    ],
    conclusion:
      "J=−(U′/γ)P−D∂xP=0  ⇒  Peq∝e^[−U/(γD)]  ⇒  D=kBT/γ",
    checks: [
      "U/(γD) 必须无量纲；用 D=kBT/γ 后正好成为 U/(kBT)。",
      "势阱最低处 U 小，P_eq 应最大。",
      "若 D(x) 可变，扩散项的导数位置依随机积分约定而变，不能沿用此常系数推导。",
    ],
    evidence: ["Lecture 10 slides 8, 12, 15"],
  },

  [conceptFormulaKey("final-review", "六步解题导航")]: {
    id: "six-step-stat-mech-solution-workflow",
    title: "统计物理六步解题链",
    kind: "解题框架",
    origin:
      "这不是物理定律，而是把老师课件、三套作业和期中评分点整理成的稳定答题顺序，用来防止一上来就盲算。",
    symbols: [
      { symbol: "Ω", meaning: "微正则态数或相空间体积" },
      { symbol: "Z", meaning: "正则配分函数" },
      { symbol: "Δ", meaning: "等温等压系综的配分函数" },
      { symbol: "Ξ", meaning: "巨配分函数" },
    ],
    prerequisites: ["能从题目圈出固定量与可交换量", "知道四类系综的控制条件"],
    assumptions: ["流程用于组织答案，不替代具体模型的假设与推导", "百分比或步骤顺序不是老师公布的固定评分模板"],
    steps: [
      {
        title: "先写控制条件",
        formula: "fixed variables + allowed exchanges ⇒ ensemble",
        explanation:
          "例如固定 T,V,μ 且允许 E,N 交换，就应选巨正则，而不是因为题中出现粒子就机械选 Ξ。",
      },
      {
        title: "写状态、能谱与概率权重",
        formula: "microstate/state |i⟩，energy E_i，weight w_i",
        explanation:
          "先定义求和对象和 Hamiltonian；这一步能提前暴露简并度、测度与 N! 是否遗漏。",
      },
      {
        title: "构造对应生成函数",
        formula:
          "microcanonical: Ω；canonical: Z=Σ_i e^(−βE_i)；NPT: Δ；grand canonical: Ξ=Σ_N e^(βμN)Z_N",
        explanation:
          "生成函数必须与控制条件一致；经典连续系统还要写完整相空间测度。",
      },
      {
        title: "由导数得到平均与涨落",
        formula: "first derivative ⇒ mean，second derivative ⇒ variance/response",
        explanation:
          "求导前标注保持量，避免把 ∂β、∂T、∂μ 混在一起。",
      },
      {
        title: "连接热力学势并做三检",
        formula:
          "S=kBlnΩ；F=−kBTlnZ；G=−kBTlnΔ；ΦG=−kBTlnΞ ⇒ units + limits + sign",
        explanation:
          "微正则的 Ω 连接熵，不服从 −kBTln 的统一写法；其余三种势各自匹配自己的控制条件。最终还要检查量纲、极限与物理符号。",
      },
    ],
    conclusion:
      "控制条件 → 状态/权重 → Ω/Z/Ξ → 平均与涨落 → 热力学势/响应 → 三重自检",
    checks: [
      "每个求和或积分都能说清楚变量范围。",
      "每个偏导都写明保持量。",
      "结果至少通过一个已知极限或简单特例。",
    ],
    evidence: ["站点综合归纳自 Lectures 1–10、Homework 1–3 与 2025 Midterm；不是老师逐字给出的固定六步"],
  },

  [conceptFormulaKey("final-review", "经典—量子对照表要会自己重建")]: {
    id: "classical-quantum-trace-measure-correspondence",
    title: "经典相空间积分与量子 trace 的对应",
    kind: "解题框架",
    origin:
      "经典与量子统计的共同骨架都是对状态按 e^(−βE) 加权；差别在于“所有状态”分别由相空间积分或 Hilbert 空间 trace 表示。",
    symbols: [
      { symbol: "dΓ", meaning: "经典相空间体积元" },
      { symbol: "dμcl=dΓ/(N!h³ᴺ)", meaning: "全同经典粒子的无量纲状态测度" },
      { symbol: "Tr", meaning: "对完整正交量子基的对角元求和" },
      { symbol: "ρ", meaning: "归一化的统计状态；量子中为密度算符" },
    ],
    prerequisites: ["经典微观态是相空间一点", "量子完备基与 trace", "Boltzmann 权重"],
    assumptions: [
      "经典一侧是 N 个全同粒子并处于经典稀薄极限；若粒子可区分，测度中的 N! 要相应修改",
      "量子正则态假定系统与温度为 T 的大热浴弱耦合",
    ],
    steps: [
      {
        title: "经典：把状态求和换成带测度的积分",
        formula: "dμcl≡dΓ/(N!h³ᴺ)；  Σ_states → ∫dμcl",
        explanation:
          "h³ᴺ 给相空间元一个状态单位，N! 去掉全同经典粒子标签的重复计数。",
      },
      {
        title: "量子：用能量本征基写 trace",
        formula: "Tr(e^(−βH))=Σ_n⟨n|e^(−βH)|n⟩=Σ_n e^(−βE_n)=Z",
        explanation:
          "能量基把 H 对角化，因此算符指数变为熟悉的 Boltzmann 权重。",
      },
      {
        title: "经典：用同一测度完成归一化",
        formula:
          "Zcl=∫dμcl e^(−βH)；ρcl(Γ)=e^(−βH)/Zcl；∫dμcl ρcl=1",
        explanation:
          "ρcl 是相对于 dμcl 的密度；若改回裸 dΓ，就必须把 1/(N!h³ᴺ) 吸进密度，不能在平均时漏掉。",
      },
      {
        title: "量子归一化并对照两种平均",
        formula:
          "ρq=e^(−βH)/Zq，Trρq=1；⟨A⟩cl=∫dμcl ρcl A，⟨A⟩q=Tr(ρqA)",
        explanation:
          "这说明经典积分与量子 trace 是同一“概率加权平均”思想的两种状态空间实现。",
      },
    ],
    conclusion: "classical ∫dΓ/(N!h³ᴺ)  ↔  quantum Tr;  ρ=e^(−βH)/Z",
    checks: [
      "经典测度必须无量纲且不能重复遗漏 N!。",
      "量子 trace 与所选完备基无关；能量基只是在计算上最方便。",
      "classical limit 还需 nλT³≪1 等条件，不能只把 ℏ 写成 0。",
    ],
    evidence: ["Lectures 4, 7–9", "Midterm Q1", "Problem Set 3"],
  },

  [conceptFormulaKey("final-review", "评分点式输出")]: {
    id: "exam-derivation-output-allocation",
    title: "把完整解答组织成可评分的证据链",
    kind: "解题框架",
    origin:
      "比例只是练习时的时间分配建议，不是老师公布的官方固定评分。目的在于即使代数暂时卡住，也保留定义、关键结构和自检分。",
    symbols: [],
    prerequisites: ["会区分定义、假设、推导和结果", "能在计算前写出目标量"],
    assumptions: ["仅用于练习与自我检查", "正式考试以当次题目和 marking scheme 为准"],
    steps: [
      {
        title: "前 20%：锁定对象与起点",
        formula: "given + assumptions + definitions → starting equation",
        explanation:
          "写清系综、状态空间、Hamiltonian、测度与固定量；即使后面没算完，这些也是可独立检查的证据。",
      },
      {
        title: "中间 55%：逐等号推进主体",
        formula: "starting equation = intermediate 1 = intermediate 2 = target structure",
        explanation:
          "每次只做一种操作，并在旁边注明求和、积分、展开或求导依据，避免一行跳三步。",
      },
      {
        title: "最后 25%：结果与三重自检",
        formula: "result + units + limiting case + physical sign",
        explanation:
          "若数值化简没完成，也要保留正确积分或导数结构，并说明预期极限。",
      },
    ],
    conclusion: "定义与假设 20% → 主体推导 55% → 结果与自检 25%（练习用，不宣称官方固定比例）",
    checks: [
      "不能把练习比例写成老师官方评分标准。",
      "主体推导中的每个新符号必须在首次出现时定义。",
      "结尾必须回答题目实际问的量，而不只是停在 Z 或 Ξ。",
    ],
    evidence: ["站点作者练习分配；受 2025 Midterm marking scheme 与作业答案结构启发，比例并非老师规定"],
  },

  [conceptFormulaKey("final-review", "复习不是重读：1/3/7/14/30 天检索")]: {
    id: "spaced-retrieval-schedule",
    title: "检索练习与间隔复习顺序",
    kind: "解题框架",
    origin:
      "这是一条学习流程而非物理公式。间隔只提供默认节奏；真正的下一次复习应由是否能闭卷重建公式和推导来决定。",
    symbols: [],
    prerequisites: ["先完成一次不看答案的检索", "能把错误归为概念、数学、符号、策略或遗忘"],
    assumptions: ["日期是默认安排，可根据失败结果退回更短间隔", "复习任务必须包含主动输出，而不是重新浏览"],
    steps: [
      {
        title: "立即检索并建立基线",
        formula: "learn → close notes → reconstruct formula + assumptions + first step",
        explanation:
          "如果第一次闭卷就无法写出起点，马上补最小前置，不把“刚看懂”误当成掌握。",
      },
      {
        title: "按 1 日与 3 日检查短期保持",
        formula: "failure at day 1 or 3 ⇒ diagnose cause → retry with a new variant",
        explanation:
          "失败不重读整章，只修导致错误的最小节点，然后换一道同结构题。",
      },
      {
        title: "用 7、14、30 日检验长期可调用性",
        formula: "pass ⇒ widen interval；fail ⇒ shorten interval and replace prompt",
        explanation:
          "能在新题里主动选对公式和第一步，才说明知识可以在考试中调用。",
      },
    ],
    conclusion: "立即 → 1 日 → 3 日 → 7 日 → 14 日 → 30 日",
    checks: [
      "每次复习都必须先闭卷输出，再看答案。",
      "只重复同一道熟题会高估掌握，应使用同结构变式。",
      "本流程不会自动改变 gate；网站仍以实际复测证据为准。",
    ],
    evidence: ["Site mastery and review design; no separate Week 14 lecture deck was provided"],
  },
};
