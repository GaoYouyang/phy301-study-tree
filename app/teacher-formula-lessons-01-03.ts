import type { FormulaDerivation } from "./formula-derivation-types";
import type { TeacherFormulaLesson } from "./teacher-formula-types";

const tex = String.raw;

function lesson(
  moduleId: string,
  lecture: number,
  slides: number[],
  sourceTitle: string,
  sourceFormulas: string[],
  derivation: FormulaDerivation,
): TeacherFormulaLesson {
  return {
    moduleId,
    lecture,
    slides,
    sourceTitle,
    sourceFormulas,
    derivation,
  };
}

export const teacherFormulaLessons0103: TeacherFormulaLesson[] = [
  lesson(
    "thermo-bridge",
    1,
    [14, 15, 16],
    "Second law: Clausius inequality",
    [
      "∮ dQi/Ti ≤ 0",
      "dQ = dE − dW",
      "W = Σi dQi",
      "∮ dQrev/T = 0",
      "∫A^B dQrev(1)/T1 = ∫A^B dQrev(2)/T2",
      "S(B) − S(A) = ∫A^B dQrev/T",
      "S(B)−S(A) = ∫A^B dQrev/T ≥ ∫A^B dQ/T",
      "dS = dQrev/T ≥ dQ/T = 0",
    ],
    {
      id: "teacher-l01-clausius-to-entropy-increase",
      title: "从 Clausius 不等式到熵是状态函数与孤立系统熵增",
      aliases: ["Clausius inequality", "entropy state function", "isolated entropy increase"],
      kind: "推导结果",
      origin:
        "教师课件连续三页给出 Clausius 不等式、可逆循环和熵增结论；这里把闭合路径、反向可逆路径和符号方向逐步补全。",
      symbols: [
        { symbol: tex`$\delta Q$`, meaning: "系统吸收的无穷小热量；正号表示热流入系统" },
        { symbol: tex`$T$`, meaning: "发生热交换处的绝对温度" },
        { symbol: tex`$S$`, meaning: "由可逆热积分定义的熵状态函数" },
        { symbol: tex`$A,B$`, meaning: "两个平衡态端点" },
      ],
      prerequisites: ["循环积分的方向", "可逆与不可逆过程的区别", "状态函数只由端点决定"],
      assumptions: [
        "采用“系统吸热为正”的热量符号约定",
        "端点 A、B 是平衡态，并且存在连接它们的准静态可逆参考路径",
        "Clausius 不等式写作闭合循环的 ∮δQ/T≤0；可逆循环取等号",
      ],
      steps: [
        {
          title: "先写任意循环的 Clausius 不等式",
          formula: tex`$\displaystyle \oint \frac{\delta Q}{T}\le 0$`,
          explanation: "不等号针对一个完整循环；只有循环处处可逆时才取等号。",
        },
        {
          title: "对可逆循环取等号",
          formula: tex`$\displaystyle \oint_{\rm rev}\frac{\delta Q_{\rm rev}}{T}=0$`,
          explanation: "零循环积分意味着可逆热积分只由端点决定，可以据此定义一个状态函数。",
        },
        {
          title: "用任意可逆路径定义熵差",
          formula: tex`$\displaystyle S(B)-S(A)\equiv\int_{A}^{B}\frac{\delta Q_{\rm rev}}{T}$`,
          explanation: "若换另一条可逆路径，两条路径首尾相接形成可逆循环；循环积分为零，所以两条积分相同。",
        },
        {
          title: "把实际过程与反向可逆参考路径拼成循环",
          formula: tex`$\displaystyle \int_{A}^{B}\frac{\delta Q}{T}+\int_{B}^{A}\frac{\delta Q_{\rm rev}}{T}\le0$`,
          explanation: "第一段允许不可逆；第二段从 B 可逆返回 A，因此可直接用熵差替换。",
        },
        {
          title: "把反向可逆积分改写成熵差",
          formula: tex`$\displaystyle \int_{B}^{A}\frac{\delta Q_{\rm rev}}{T}=S(A)-S(B)=-\Delta S$`,
          explanation: "代回上一步并移项，得到实际路径上的 Clausius 不等式。",
        },
        {
          title: "得到实际过程与孤立系统结论",
          formula: tex`$\displaystyle \Delta S\ge\int_A^B\frac{\delta Q}{T};\qquad \delta Q=0\ \Longrightarrow\ \Delta S\ge0$`,
          explanation: "孤立系统没有热交换，所以右侧为零；可逆孤立过程取等号，不可逆过程严格增熵。",
        },
      ],
      conclusion: tex`$\displaystyle dS=\frac{\delta Q_{\rm rev}}{T},\qquad \Delta S\ge\int\frac{\delta Q}{T},\qquad \Delta S_{\rm isolated}\ge0$`,
      checks: [
        "可逆循环必须给出零，而不是负数",
        "反向路径的熵差必须变号",
        "若把热量正号改成“系统放热为正”，整套不等式的写法也必须同步改变",
      ],
      evidence: ["课件 1 slide 14", "课件 1 slide 15", "课件 1 slide 16"],
    },
  ),

  lesson(
    "thermo-bridge",
    1,
    [18],
    "How to reach equilibrium?",
    ["H = E − J·x", "F = E − TS", "G = E − TS − J·x", "dQ = dE − dW"],
    {
      id: "teacher-l01-generalized-work-legendre-potentials",
      title: "广义功变量与 H、F、G 的 Legendre 变换",
      aliases: ["generalized work", "Legendre transform", "thermodynamic potentials"],
      kind: "推导结果",
      origin:
        "从含一对广义共轭变量的平衡热力学基本微分式出发，逐次更换自然变量；课件中的 H、G 是按 H=E−J·x、G=E−TS−J·x 定义的。",
      symbols: [
        { symbol: tex`$E$`, meaning: "内能，初始自然变量取 S 与 x" },
        { symbol: tex`$J$`, meaning: "与广义位移 x 共轭的广义力，满足 J=(∂E/∂x)S" },
        { symbol: tex`$x$`, meaning: "广义位移；简单可压缩系统中取 x=V" },
        { symbol: tex`$H,F,G$`, meaning: "分别对 x、S、以及 S 与 x 作 Legendre 变换后的势" },
      ],
      prerequisites: ["乘积微分", "全微分", "Legendre 变换的目的：交换自然变量"],
      assumptions: [
        "平衡态、组成固定，且只保留一对广义功变量",
        "采用 dE=T dS+J·dx；若 x=V，则必须取 J=−P",
        "课件的 dQ=dE−dW 与这里一致时，dW 表示加到系统上的广义功 J·dx",
      ],
      steps: [
        {
          title: "固定广义功的符号约定",
          formula: tex`$\displaystyle dE=T\,dS+J\!\cdot dx$`,
          explanation: "这一行定义 J 与 x 的共轭方向；后面每个势的正负号都必须从它一致地推出。",
        },
        {
          title: "对 x 作 Legendre 变换",
          formula: tex`$\displaystyle H\equiv E-J\!\cdot x$`,
          explanation: "H 用 J 取代 x 作为自然变量；这里的符号是课件的广义记号。",
        },
        {
          title: "微分 H 并消去 J·dx",
          formula: tex`$\displaystyle dH=dE-J\!\cdot dx-x\!\cdot dJ=T\,dS-x\!\cdot dJ$`,
          explanation: "乘积微分产生 J·dx 与 x·dJ 两项，前者与 dE 中的功项抵消。",
        },
        {
          title: "对熵作 Legendre 变换",
          formula: tex`$\displaystyle F\equiv E-TS,\qquad dF=-S\,dT+J\!\cdot dx$`,
          explanation: "F 的自然变量为 T 与 x；由 d(TS)=T dS+S dT 可见 T dS 正好抵消。",
        },
        {
          title: "同时交换 S 与 x",
          formula: tex`$\displaystyle G\equiv E-TS-J\!\cdot x,\qquad dG=-S\,dT-x\!\cdot dJ$`,
          explanation: "G 的自然变量为 T 与 J，可以直接读出 S=−(∂G/∂T)J 与 x=−(∂G/∂J)T。",
        },
        {
          title: "恢复简单可压缩系统的通常符号",
          formula: tex`$\displaystyle x=V,\ J=-P\ \Longrightarrow\ dE=T\,dS-P\,dV,\ H=E+PV,\ G=E-TS+PV$`,
          explanation: "若直接把 J 当成 +P，会把所有 P dV 项的符号弄反；必须成对代入 x=V、J=−P。",
        },
      ],
      conclusion: tex`$\displaystyle dF=-S\,dT+J\!\cdot dx,\qquad dG=-S\,dT-x\!\cdot dJ$`,
      checks: [
        "令 x=V、J=−P 后必须得到 dE=T dS−P dV",
        "每次 Legendre 变换都要把被替换变量对应的乘积完整微分",
        "不同教材可能把广义功写成 −J·dx；换约定时势的定义必须一起换",
      ],
      evidence: ["课件 1 slide 18"],
    },
  ),

  lesson(
    "thermo-bridge",
    1,
    [19],
    "Third law of thermodynamics",
    ["lim(T→0) S(X,T) = 0", "energy fluctuation scale ~ kBT"],
    {
      id: "teacher-l01-l03-third-law-ground-degeneracy",
      title: "第三定律、基态简并与残余熵",
      aliases: ["third law", "ground-state degeneracy", "residual entropy"],
      kind: "公设 / 经验定律",
      origin:
        "第三定律本身是经验规律而不是从经典统计力学必然推出的定理；统计计数只说明零温极限与基态简并度之间的关系。",
      symbols: [
        { symbol: tex`$g_0$`, meaning: "可实现的基态简并度，等同课件 3 的 Ω(E(0))" },
        { symbol: tex`$E_0$`, meaning: "基态能量" },
        { symbol: tex`$S_0$`, meaning: "零温极限的熵；若 g0>1 则为残余熵" },
      ],
      prerequisites: ["Boltzmann 熵 S=kB lnΩ", "简并度表示同一能量对应的微观态数"],
      assumptions: [
        "系统确实达到热力学平衡，且讨论 T→0 的极限",
        "Planck 形式 S→0 还要求基态唯一 g0=1，并选择零温熵常数为零",
        "冻结无序、玻璃态或受约束系统可能保留 g0>1 的残余熵",
      ],
      steps: [
        {
          title: "先陈述经验性的 Nernst/Planck 内容",
          formula: tex`$\displaystyle \lim_{T\to0}\bigl[S(X_2,T)-S(X_1,T)\bigr]=0$`,
          explanation: "第三定律限制零温附近的熵差；它不是由后面的计数步骤证明出来的。",
        },
        {
          title: "零温平衡只留下基态流形",
          formula: tex`$\displaystyle T\to0\quad\Longrightarrow\quad E(T)\to E_0,\qquad \Omega(E_0)=g_0$`,
          explanation: "激发态的热权重被压低，但若有多个等能基态，它们仍共同贡献计数。",
        },
        {
          title: "把 Boltzmann 定义用于基态计数",
          formula: tex`$\displaystyle S_0=\lim_{T\to0}S(T)=k_B\ln\Omega(E_0)=k_B\ln g_0$`,
          explanation: "这是统计计数给出的条件式；并没有自动保证 g0=1。",
        },
        {
          title: "唯一基态给出 Planck 形式",
          formula: tex`$\displaystyle g_0=1\quad\Longrightarrow\quad S_0=k_B\ln1=0$`,
          explanation: "课件 1 的 lim S=0 隐含了唯一基态以及熵零点的约定。",
        },
        {
          title: "简并基态产生残余熵",
          formula: tex`$\displaystyle g_0>1\quad\Longrightarrow\quad S_{\rm residual}=k_B\ln g_0>0$`,
          explanation: "因此“任何系统都严格趋于零熵”不能不加条件地使用。",
        },
      ],
      conclusion: tex`$\displaystyle S(T\to0)=k_B\ln g_0;\qquad g_0=1\Rightarrow S\to0,\quad g_0>1\Rightarrow S_{\rm residual}>0$`,
      checks: [
        "若 g0=1，ln g0 必须为零",
        "不要把热能尺度 kBT→0 当成第三定律的证明",
        "必须区分平衡简并与动力学冻结造成的非平衡残余熵",
      ],
      evidence: ["课件 1 slide 19", "课件 3 slide 9"],
    },
  ),

  lesson(
    "classical-gases",
    1,
    [21],
    "Kinetic theory of gas",
    ["g(vx) = √[m/(2πkBT)] exp[−mvx²/(2kBT)]"],
    {
      id: "teacher-l01-one-dimensional-maxwell-component",
      title: "由 canonical 权重归一化得到一维 Maxwell 速度分量",
      aliases: ["one-dimensional Maxwell distribution", "Gaussian velocity component"],
      kind: "推导结果",
      origin:
        "对经典自由粒子的一个笛卡尔速度分量使用 canonical Boltzmann 权重，再用 Gaussian 积分确定归一化常数。",
      symbols: [
        { symbol: tex`$v_x$`, meaning: "粒子速度的 x 分量，可正可负" },
        { symbol: tex`$m$`, meaning: "单粒子质量" },
        { symbol: tex`$\beta$`, meaning: "1/(kBT)" },
        { symbol: tex`$g(v_x)$`, meaning: "一维速度分量的概率密度" },
      ],
      prerequisites: ["canonical 权重 e^(−βE)", "一维 Gaussian 积分", "概率密度归一化"],
      assumptions: ["经典、非相对论、无相互作用气体", "热平衡且各笛卡尔动量分量可分离", "速度空间覆盖整个实轴"],
      steps: [
        {
          title: "取一个速度分量的动能",
          formula: tex`$\displaystyle \varepsilon_x=\frac12m v_x^2$`,
          explanation: "三维自由粒子动能是三个相互独立的二次项之和，因此可单独处理 vx。",
        },
        {
          title: "写出未归一化 canonical 权重",
          formula: tex`$\displaystyle g(v_x)=A\exp\!\left(-\frac12\beta m v_x^2\right)$`,
          explanation: "A 不能凭记忆填写，必须由总概率等于 1 决定。",
        },
        {
          title: "施加概率归一化",
          formula: tex`$\displaystyle 1=A\int_{-\infty}^{\infty}e^{-\beta m v_x^2/2}\,dv_x$`,
          explanation: "vx 是有正负方向的分量，所以积分区间不是 0 到无穷。",
        },
        {
          title: "使用 Gaussian 积分",
          formula: tex`$\displaystyle \int_{-\infty}^{\infty}e^{-a v_x^2}\,dv_x=\sqrt{\frac\pi a},\quad a=\frac{\beta m}{2}$`,
          explanation: "代入 a 后，积分等于 √[2π/(βm)]。",
        },
        {
          title: "解出归一化常数",
          formula: tex`$\displaystyle A=\sqrt{\frac{\beta m}{2\pi}}=\sqrt{\frac{m}{2\pi k_BT}}$`,
          explanation: "把 β=1/(kBT) 代回，就得到课件的系数。",
        },
      ],
      conclusion: tex`$\displaystyle g(v_x)=\sqrt{\frac{m}{2\pi k_BT}}\exp\!\left(-\frac{m v_x^2}{2k_BT}\right)$`,
      checks: [
        "g(vx) 关于 vx 应为偶函数，因此 ⟨vx⟩=0",
        "积分 ∫g(vx)dvx 必须等于 1",
        "方差应为 ⟨vx²⟩=kBT/m，且量纲为速度平方",
      ],
      evidence: ["课件 1 slide 21"],
    },
  ),

  lesson(
    "classical-gases",
    1,
    [23],
    "Moments of the speed distribution",
    ["⟨v⟩ = √[8kBT/(πm)]", "⟨v²⟩ = 3kBT/m", "½m⟨v²⟩ = 3kBT/2"],
    {
      id: "teacher-l01-maxwell-speed-moments-gamma",
      title: "用 Gamma 积分计算 Maxwell 速率矩",
      aliases: ["Maxwell speed moments", "mean speed", "mean-square speed"],
      kind: "推导结果",
      origin:
        "从三维 Maxwell 速率分布出发，把所有矩统一化为一个 Gamma 积分，再分别代入一阶和二阶矩。",
      symbols: [
        { symbol: tex`$v$`, meaning: "速率 |v⃗|，范围为 v≥0" },
        { symbol: tex`$f(v)$`, meaning: "速率概率密度，满足 ∫0∞f(v)dv=1" },
        { symbol: tex`$a$`, meaning: "简写 a=m/(2kBT)>0" },
        { symbol: tex`$\Gamma(s)$`, meaning: "Gamma 函数" },
      ],
      prerequisites: ["三维 Maxwell 速率分布", "概率分布的矩", "Gamma 函数 Γ(s)"],
      assumptions: ["经典、非相对论理想气体", "三维各向同性热平衡", "m>0、T>0"],
      steps: [
        {
          title: "把速率分布写成统一形式",
          formula: tex`$\displaystyle f(v)=4\pi\left(\frac{m}{2\pi k_BT}\right)^{3/2}v^2e^{-av^2},\qquad a=\frac{m}{2k_BT}$`,
          explanation: "v² 来自三维速度空间的球坐标 Jacobian。",
        },
        {
          title: "建立所需的 Gamma 积分",
          formula: tex`$\displaystyle I_n(a)\equiv\int_0^\infty v^n e^{-av^2}\,dv=\frac12a^{-(n+1)/2}\Gamma\!\left(\frac{n+1}{2}\right)$`,
          explanation: "令 u=av² 即可把积分化成 Gamma 函数定义。",
        },
        {
          title: "把任意速率矩化成 I",
          formula: tex`$\displaystyle \langle v^r\rangle=4\pi\left(\frac{m}{2\pi k_BT}\right)^{3/2}I_{r+2}(a)$`,
          explanation: "期望值还要再乘一个 v^r，所以积分中的幂次从 v² 变为 v^(r+2)。",
        },
        {
          title: "计算平均速率",
          formula: tex`$\displaystyle \langle v\rangle=4\pi\left(\frac{m}{2\pi k_BT}\right)^{3/2}\frac{1}{2a^2}=\sqrt{\frac{8k_BT}{\pi m}}$`,
          explanation: "这里使用 Γ(2)=1，并把 a=m/(2kBT) 代回。",
        },
        {
          title: "计算均方速率",
          formula: tex`$\displaystyle \langle v^2\rangle=4\pi\left(\frac{m}{2\pi k_BT}\right)^{3/2}\frac{3\sqrt\pi}{8a^{5/2}}=\frac{3k_BT}{m}$`,
          explanation: "这里 Γ(5/2)=3√π/4；三个方向各贡献 kBT/m。",
        },
        {
          title: "换成平均平动动能",
          formula: tex`$\displaystyle \left\langle\frac12mv^2\right\rangle=\frac12m\langle v^2\rangle=\frac32k_BT$`,
          explanation: "这正是三个二次平动自由度各贡献 kBT/2 的结果。",
        },
      ],
      conclusion: tex`$\displaystyle \langle v\rangle=\sqrt{\frac{8k_BT}{\pi m}},\qquad \langle v^2\rangle=\frac{3k_BT}{m},\qquad \langle K\rangle=\frac32k_BT$`,
      checks: [
        "平均速率和方均根速率都必须随 √(T/m) 缩放",
        "必须有 √⟨v²⟩>⟨v⟩",
        "⟨v²⟩ 的三个笛卡尔分量各给 kBT/m",
      ],
      evidence: ["课件 1 slide 22", "课件 1 slide 23"],
    },
  ),

  lesson(
    "phase-ensemble",
    2,
    [10],
    "The relaxation puzzle",
    ["ρ(p,q,t) → ρeq(p,q) as t→∞ ?"],
    {
      id: "teacher-l02-liouville-flow-fine-grained-entropy",
      title: "Liouville 流解与 fine-grained Gibbs 熵守恒",
      aliases: ["Liouville flow solution", "fine-grained Gibbs entropy", "relaxation puzzle"],
      kind: "推导结果",
      origin:
        "Hamilton 流既沿轨道保持密度又保持相空间体积，因此精细 Gibbs 熵严格不变；课件在 ρ→ρeq 后写问号是必须认真保留的逻辑警告。",
      symbols: [
        { symbol: tex`$\Gamma=(p,q)$`, meaning: "完整相空间点" },
        { symbol: tex`$\Phi^t$`, meaning: "把初始相空间点推进时间 t 的 Hamilton 流" },
        { symbol: tex`$\rho(\Gamma,t)$`, meaning: "归一化的 fine-grained 相空间密度" },
        { symbol: tex`$S_G$`, meaning: "fine-grained Gibbs 熵 −kB∫ρlnρ dΓ" },
      ],
      prerequisites: ["Hamilton 方程", "Liouville 方程", "变量代换的 Jacobian"],
      assumptions: [
        "封闭的经典 Hamilton 系统，Hamiltonian 足够光滑",
        "使用不做分箱或平滑的 fine-grained 密度",
        "若讨论趋于平衡，必须另外引入 coarse graining、mixing、观测分辨率或环境耦合",
      ],
      steps: [
        {
          title: "把 Liouville 方程写成随流导数",
          formula: tex`$\displaystyle \frac{D\rho}{Dt}=\frac{\partial\rho}{\partial t}+\dot\Gamma\!\cdot\nabla_\Gamma\rho=0$`,
          explanation: "相空间中的一份系综密度沿 Hamilton 轨道保持不变。",
        },
        {
          title: "写出流映射的显式解",
          formula: tex`$\displaystyle \rho(\Gamma,t)=\rho_0\!\left(\Phi^{-t}\Gamma\right)$`,
          explanation: "要知道当前点 Γ 的密度，只需沿流反推到 t=0 的起点。",
        },
        {
          title: "用 Hamilton 流的零散度",
          formula: tex`$\displaystyle \nabla_\Gamma\!\cdot\dot\Gamma=\sum_i\left(\frac{\partial\dot q_i}{\partial q_i}+\frac{\partial\dot p_i}{\partial p_i}\right)=0$`,
          explanation: "Hamilton 方程给出的两个混合二阶偏导逐项相消。",
        },
        {
          title: "得到相空间 Jacobian 为一",
          formula: tex`$\displaystyle \det\!\left(\frac{\partial\Phi^t\Gamma_0}{\partial\Gamma_0}\right)=1,\qquad d\Gamma_t=d\Gamma_0$`,
          explanation: "流可以把密度拉伸成细丝，但不会改变任意相空间体积元。",
        },
        {
          title: "代入 fine-grained Gibbs 熵",
          formula: tex`$\displaystyle S_G(t)=-k_B\int d\Gamma\,\rho(\Gamma,t)\ln\rho(\Gamma,t)$`,
          explanation: "用 Γ=Φ^tΓ0 换元时，密度值和体积元都与初始时刻相同。",
        },
        {
          title: "证明精细熵不变并识别缺口",
          formula: tex`$\displaystyle S_G(t)=S_G(0),\qquad \rho(t)\not\xrightarrow[\rm fine\!\!-\!grained]{\rm generally}\rho_{\rm eq}$`,
          explanation: "因此 Liouville 方程本身不能无条件推出光滑的平衡密度；宏观弛豫需要额外的物理或观测层假设。",
        },
      ],
      conclusion: tex`$\displaystyle \rho(\Gamma,t)=\rho_0(\Phi^{-t}\Gamma),\qquad S_G^{\rm fine}(t)=S_G^{\rm fine}(0)$`,
      checks: [
        "反向流必须写成 Φ^(−t)，否则初值映射方向错误",
        "Hamilton 流的 Jacobian 应等于 1",
        "课件的 ρ→ρeq 带问号，不能改写成无条件定理",
      ],
      evidence: ["课件 2 slides 3–10，尤其 slide 10"],
    },
  ),

  lesson(
    "microcanonical",
    3,
    [2, 6, 22],
    "Microcanonical ensemble",
    [
      "ρeq(p,q)=δ(H(p,q)−E)/Ω(E)",
      "Ω(E)=∫δ(H(p,q)−E) dpdq",
      "pE=1/Ω(E) if H(p,q)=E; 0 otherwise",
      "dpdq=∏i=1^N d³qi d³pi",
      "ρeq=δ(H−E)/Ω(E)",
      "S=kB ln Ω",
    ],
    {
      id: "teacher-l03-normalized-delta-shell-window",
      title: "delta 能量壳的归一化与有限能窗解释",
      aliases: ["microcanonical delta shell", "finite energy window", "density of states"],
      kind: "定义",
      origin:
        "微正则系综定义为固定能量壳上的均匀概率；连续相空间中 delta 函数写法必须同时给出归一化因子与有限能窗的操作解释。",
      symbols: [
        { symbol: tex`$\Gamma=(p,q)$`, meaning: "6N 维经典相空间点" },
        { symbol: tex`$\omega(E)$`, meaning: "delta 壳态密度 ∫dΓ δ(H−E)，课件把它记作 Ω(E)" },
        { symbol: tex`$\Sigma(E)$`, meaning: "累计相空间体积 ∫dΓ Θ(E−H)" },
        { symbol: tex`$\Delta$`, meaning: "实验或计数使用的小而有限的能量窗宽" },
      ],
      prerequisites: ["Dirac delta 函数", "概率密度归一化", "相空间体积元"],
      assumptions: [
        "系统孤立，E、V、N 固定，且只取可达的能量壳",
        "课件的 Ω(E) 在这些页表示 delta 壳测度；别处也可能用 Ω 表示无量纲态数，需看定义",
        "严格经典态数要除以 h^(3N)，同种粒子还除以 N!；这些常数在归一化概率比中相消",
      ],
      steps: [
        {
          title: "先定义 delta 壳测度",
          formula: tex`$\displaystyle \omega(E)\equiv\int d\Gamma\,\delta\!\bigl(H(\Gamma)-E\bigr)$`,
          explanation: "delta 函数把积分限制到 H=E 的超曲面；ω 的量纲是相空间体积除以能量。",
        },
        {
          title: "用壳测度归一化密度",
          formula: tex`$\displaystyle \rho_E(\Gamma)\equiv\frac{\delta(H(\Gamma)-E)}{\omega(E)}$`,
          explanation: "连续相空间中不能把“壳上每一点概率相等”理解为每点有有限概率；均匀的是密度。",
        },
        {
          title: "直接检查归一化",
          formula: tex`$\displaystyle \int d\Gamma\,\rho_E(\Gamma)=\frac{1}{\omega(E)}\int d\Gamma\,\delta(H-E)=1$`,
          explanation: "分母正是分子的全相空间积分，所以总概率为 1。",
        },
        {
          title: "改用有限能窗理解 delta 壳",
          formula: tex`$\displaystyle \Gamma_\Delta(E)\equiv\int d\Gamma\,\mathbf 1_{E\le H<E+\Delta}$`,
          explanation: "真实分辨率总是有限；指示函数选出厚度为 Δ 的薄壳。",
        },
        {
          title: "小能窗极限连接态密度",
          formula: tex`$\displaystyle \Gamma_\Delta(E)=\Sigma(E+\Delta)-\Sigma(E)\simeq\omega(E)\Delta,\qquad \omega(E)=\frac{\partial\Sigma}{\partial E}$`,
          explanation: "这说明 delta 壳是有限窗在 Δ→0 时除以窗宽后的极限。",
        },
      ],
      conclusion: tex`$\displaystyle \rho_E(\Gamma)=\frac{\delta(H-E)}{\int d\Gamma\,\delta(H-E)},\qquad \Gamma_\Delta(E)\simeq\omega(E)\Delta$`,
      checks: [
        "ρE 对全相空间积分必须为 1",
        "delta 壳态密度、累计体积与有限窗态数不能都用同一符号而不先定义",
        "对数取态数前要补 h^(3N)、N! 和能量窗，使对数自变量无量纲",
      ],
      evidence: ["课件 3 slide 2", "课件 3 slide 6", "课件 3 slide 22", "课件 3 slide 23（有限窗记号）"],
    },
  ),

  lesson(
    "microcanonical",
    3,
    [3],
    "Two weakly coupled systems in a microcanonical ensemble",
    [
      "E=E1+E2",
      "μ1,2=(p1,2,q1,2)",
      "pE(μ1⊗μ2)=1/Ω(E) if H1(μ1)+H2(μ2)=E; 0 otherwise",
      "Si(Ei)=kB ln Ωi(Ei)",
      "Ω(E)=∫dE1 Ω1(E1)Ω2(E−E1)=∫dE1 exp([S1(E1)+S2(E−E1)]/kB)",
    ],
    {
      id: "teacher-l03-convolution-saddle-equal-temperature",
      title: "由总态数卷积到最大熵与 T1=T2",
      aliases: ["density-of-states convolution", "Laplace saddle", "thermal equilibrium"],
      kind: "近似",
      origin:
        "两个弱耦合子系统共享固定总能量时，总态数按能量分配卷积；宏观极限用 Laplace 最大项近似得到温度相等。",
      symbols: [
        { symbol: tex`$E_1,E_2$`, meaning: "两个子系统的能量，满足 E2=E−E1" },
        { symbol: tex`$\Omega_i(E_i)$`, meaning: "子系统 i 的能量壳态数或同一约定下的态密度" },
        { symbol: tex`$S_i$`, meaning: "kB lnΩi" },
        { symbol: tex`$E_1^*$`, meaning: "最可几、也即鞍点处的能量分配" },
      ],
      prerequisites: ["弱耦合下能量可加", "Boltzmann 熵", "大参数 Laplace 方法"],
      assumptions: [
        "相互作用能相对子系统体能可忽略，但两系统仍可缓慢交换能量",
        "两个系统使用一致的能量壳/窗宽约定",
        "系统足够大，使能量分配概率在内部单一最大点附近尖锐集中",
      ],
      steps: [
        {
          title: "固定总能量并枚举所有分配",
          formula: tex`$\displaystyle E=E_1+E_2,\qquad E_2=E-E_1$`,
          explanation: "每选一个 E1，第二个系统的能量就被总能量守恒唯一确定。",
        },
        {
          title: "把独立子系统的态数相乘并卷积",
          formula: tex`$\displaystyle \Omega(E)=\int dE_1\,\Omega_1(E_1)\Omega_2(E-E_1)$`,
          explanation: "固定能量分配下组合态数相乘；再对所有允许的 E1 求和或积分。",
        },
        {
          title: "用 Boltzmann 熵改写被积函数",
          formula: tex`$\displaystyle \Omega_1(E_1)\Omega_2(E-E_1)=\exp\!\left[\frac{S_1(E_1)+S_2(E-E_1)}{k_B}\right]$`,
          explanation: "宏观熵为 O(N)，因此指数对偏离最大点的能量分配极其敏感。",
        },
        {
          title: "在大系统极限取 Laplace 鞍点",
          formula: tex`$\displaystyle \Omega(E)\approx \exp\!\left[\frac{S_1(E_1^*)+S_2(E-E_1^*)}{k_B}\right]\times(\text{Gaussian prefactor})$`,
          explanation: "课件只保留指数领先项；前因子来自最大点附近的二阶展开。",
        },
        {
          title: "对能量分配求驻点",
          formula: tex`$\displaystyle 0=\left.\frac{d}{dE_1}[S_1(E_1)+S_2(E-E_1)]\right|_*=\left.\frac{\partial S_1}{\partial E_1}\right|_*-\left.\frac{\partial S_2}{\partial E_2}\right|_*$`,
          explanation: "E2 对 E1 的导数是 −1，这个负号是最容易漏掉的一步。",
        },
        {
          title: "用温度定义读出平衡条件",
          formula: tex`$\displaystyle \frac1{T_i}\equiv\left(\frac{\partial S_i}{\partial E_i}\right)_{V_i,N_i}\quad\Longrightarrow\quad \frac1{T_1}=\frac1{T_2}$`,
          explanation: "温度相等来自总熵对可交换能量达到最大，而不是先验强加。",
        },
      ],
      conclusion: tex`$\displaystyle E_1^*=\arg\max_{E_1}[S_1(E_1)+S_2(E-E_1)],\qquad T_1=T_2$`,
      checks: [
        "必须保留 dE2/dE1=−1",
        "稳定平衡还要求总熵二阶导数为负",
        "若最大值在边界、存在一阶相变或系统很小，单一 Gaussian 鞍点近似要重新检查",
      ],
      evidence: ["课件 3 slide 3", "课件 3 slide 4", "课件 3 slide 5"],
    },
  ),

  lesson(
    "microcanonical",
    3,
    [12],
    "Heat capacity of the two-level system",
    [
      "E(T)=Nε/[exp(ε/kBT)+1]",
      "C=dE/dT=NkB(ε/kBT)² exp(ε/kBT)[exp(ε/kBT)+1]⁻²",
      "C∝e^(−ε/kBT) at low T",
      "C∼(ε/2kBT)² at high T",
    ],
    {
      id: "teacher-l03-two-level-heat-capacity-limits",
      title: "二能级系统热容及高低温极限",
      aliases: ["two-level heat capacity", "Schottky anomaly", "high-temperature limit"],
      kind: "推导结果",
      origin:
        "对课件给出的二能级能量—温度关系显式求导，并分别在 x≫1 与 x≪1 展开；同时修正课件高温行省略的归一化量。",
      symbols: [
        { symbol: tex`$N$`, meaning: "相互独立的二能级单元数" },
        { symbol: tex`$\varepsilon$`, meaning: "激发态相对基态的能隙" },
        { symbol: tex`$x$`, meaning: "无量纲逆温 x=ε/(kBT)" },
        { symbol: tex`$C$`, meaning: "定容热容 dE/dT" },
      ],
      prerequisites: ["链式法则", "指数函数高低 x 展开", "二能级能量 E(T)"],
      assumptions: ["N 个单元彼此独立", "能级为 0 与 ε，且各自非简并", "N、ε 固定"],
      steps: [
        {
          title: "引入无量纲变量",
          formula: tex`$\displaystyle x\equiv\frac{\varepsilon}{k_BT},\qquad E(T)=\frac{N\varepsilon}{e^x+1}$`,
          explanation: "温度依赖全部集中在 x(T) 中，后面用链式法则最清楚。",
        },
        {
          title: "分别求两个导数",
          formula: tex`$\displaystyle \frac{dE}{dx}=-\frac{N\varepsilon e^x}{(1+e^x)^2},\qquad \frac{dx}{dT}=-\frac{x}{T}$`,
          explanation: "两个负号相乘，使热容为正。",
        },
        {
          title: "应用链式法则",
          formula: tex`$\displaystyle C=\frac{dE}{dT}=\frac{N\varepsilon x}{T}\frac{e^x}{(1+e^x)^2}$`,
          explanation: "利用 ε/T=kBx，把前面的有量纲系数改写成 NkB x²。",
        },
        {
          title: "得到无量纲热容形式",
          formula: tex`$\displaystyle \frac{C}{Nk_B}=x^2\frac{e^x}{(1+e^x)^2}$`,
          explanation: "右边完全无量纲，适合检查课件后两行的渐近式。",
        },
        {
          title: "取低温极限",
          formula: tex`$\displaystyle x\gg1:\qquad \frac{C}{Nk_B}\simeq x^2e^{-x}$`,
          explanation: "分母约为 e^(2x)，所以热容被能隙以 Boltzmann 因子指数压低。",
        },
        {
          title: "取高温极限并保留勘误",
          formula: tex`$\displaystyle x\ll1:\qquad \frac{C}{Nk_B}\simeq\frac{x^2}{4}=\left(\frac{\varepsilon}{2k_BT}\right)^2$`,
          explanation: "课件写的 C∼(ε/2kBT)² 右侧无量纲，因此严格说应是 C/(NkB) 的渐近式。",
        },
      ],
      conclusion: tex`$\displaystyle C=Nk_Bx^2\frac{e^x}{(1+e^x)^2},\quad C/(Nk_B)\sim x^2e^{-x}\ (T\to0),\quad C/(Nk_B)\sim x^2/4\ (T\to\infty)$`,
      checks: [
        "C/(NkB) 必须无量纲",
        "T→0 与 T→∞ 时 C 都趋于零",
        "课件高温式不能直接等同于有量纲的 C",
      ],
      evidence: ["课件 3 slide 12；高温行应读作 C/(NkB) 的渐近式"],
    },
  ),

  lesson(
    "microcanonical",
    3,
    [13],
    "Single-site occupation probability",
    [
      "p(ni)=Ω(E−niε,N−1)/Ω(E,N)",
      "p(0)=1−N1/N",
      "p(1)=1−p(0)",
      "p(0)=1/[1+exp(−ε/kBT)]",
      "p(1)=exp(−ε/kBT)/[1+exp(−ε/kBT)]",
    ],
    {
      id: "teacher-l03-single-site-probability-state-count-ratio",
      title: "由微正则态数比推出单站点 p(0) 与 p(1)",
      aliases: ["single-site marginal", "two-level occupation probability", "state-count ratio"],
      kind: "推导结果",
      origin:
        "固定总激发数 N1 时，指定一个站点处于 0 或 1 后，剩余 N−1 个站点的组合数给出该站点的边缘概率。",
      symbols: [
        { symbol: tex`$n_i\in\{0,1\}$`, meaning: "第 i 个二能级单元的占据变量" },
        { symbol: tex`$N_1$`, meaning: "总激发单元数，E=εN1" },
        { symbol: tex`$\Omega(E,N)$`, meaning: "N 个站点、总能量 E 的微正则组合数" },
      ],
      prerequisites: ["二项式组合数", "条件计数", "课件 3 slide 11 的温度—能量关系"],
      assumptions: ["N 个站点可区分且彼此独立，能级为 0 与 ε", "总能量固定为 E=εN1", "0≤N1≤N"],
      steps: [
        {
          title: "写出总微观态数",
          formula: tex`$\displaystyle \Omega(E,N)=\binom{N}{N_1}=\frac{N!}{N_1!(N-N_1)!}$`,
          explanation: "从 N 个站点中选择 N1 个作为激发态。",
        },
        {
          title: "指定站点为激发态并计数",
          formula: tex`$\displaystyle p(1)=\frac{\binom{N-1}{N_1-1}}{\binom{N}{N_1}}$`,
          explanation: "该站点已经占用一个激发，因此其余 N−1 个站点还需放置 N1−1 个激发。",
        },
        {
          title: "化简激发概率",
          formula: tex`$\displaystyle p(1)=\frac{N_1}{N}=\frac{E}{N\varepsilon}$`,
          explanation: "阶乘约掉后只剩激发站点所占比例。",
        },
        {
          title: "同理得到基态概率",
          formula: tex`$\displaystyle p(0)=\frac{\binom{N-1}{N_1}}{\binom{N}{N_1}}=\frac{N-N_1}{N}=1-p(1)$`,
          explanation: "固定该站点为 0 后，其余站点仍需容纳全部 N1 个激发。",
        },
        {
          title: "用微正则温度关系改写比例",
          formula: tex`$\displaystyle \frac1T=\frac{k_B}{\varepsilon}\ln\frac{N-N_1}{N_1}\quad\Longrightarrow\quad \frac{N-N_1}{N_1}=e^{\varepsilon/(k_BT)}$`,
          explanation: "这一步把固定能量的组合比例改写成温度形式。",
        },
        {
          title: "得到课件的两条概率",
          formula: tex`$\displaystyle p(0)=\frac{1}{1+e^{-\varepsilon/(k_BT)}},\qquad p(1)=\frac{e^{-\varepsilon/(k_BT)}}{1+e^{-\varepsilon/(k_BT)}}$`,
          explanation: "两式之和严格为 1；这里的 Fermi 形状来自二能级占据约束，不等于已经假设量子 Fermion。",
        },
      ],
      conclusion: tex`$\displaystyle p(1)=N_1/N=\frac{1}{e^{\varepsilon/(k_BT)}+1},\qquad p(0)=1-p(1)$`,
      checks: [
        "p(0)+p(1) 必须等于 1",
        "T→0+ 时 p(1)→0；T→∞ 时 p(0)=p(1)=1/2",
        "不要因为结果长得像 Fermi–Dirac 分布就误称这些站点为 Fermion",
      ],
      evidence: ["课件 3 slide 10", "课件 3 slide 11", "课件 3 slide 13"],
    },
  ),

  lesson(
    "classical-gases",
    3,
    [19, 24, 26],
    "Entropy of a classical ideal gas",
    [
      "2π^(3N/2)/(3N/2−1)!",
      "S(E,V,N)=kB[N ln V+(3N/2)ln(2πmE)−(3N/2)ln(3N/2)+3N/2]",
      "S(E,V,N)=NkB ln[V(4πemE/3N)^(3/2)]",
      "∂S/∂E=1/T ⇒ E=3NkBT/2",
      "S(T,V,N)=NkB ln[Vσ(T)]",
      "σ(T)=(2πemT)^(3/2)",
      "S=NkB ln[(V/N)(4πemE/3N)^(3/2)]",
    ],
    {
      id: "teacher-l03-ideal-gas-shell-to-sackur-tetrode",
      title: "由理想气体相空间体积到 Sackur–Tetrode 熵",
      aliases: ["Sackur–Tetrode entropy", "ideal-gas phase volume", "N! h^(3N) correction"],
      kind: "近似",
      origin:
        "对 3N 维动量球计算累计体积或壳态密度，再用 h^(3N) 与 N! 将经典相空间体积化成无量纲不可区分态数，最后作 Stirling 展开。",
      symbols: [
        { symbol: tex`$\Sigma(E)$`, meaning: "H<E 的累计相空间体积" },
        { symbol: tex`$\omega(E)$`, meaning: "∂Σ/∂E，对应能量壳态密度" },
        { symbol: tex`$h^{3N}$`, meaning: "把经典相空间体积换成无量纲量子单元的尺度" },
        { symbol: tex`$N!$`, meaning: "同种不可区分粒子的 Gibbs 计数修正" },
      ],
      prerequisites: ["d 维球体积", "Gamma 函数", "Stirling 公式", "Boltzmann 熵"],
      assumptions: [
        "三维、经典、非相对论、单原子理想气体，硬壁体积 V",
        "同种粒子不可区分，且处于热力学极限",
        "shell 与 cumulative 定义相差次领先 O(lnN) 项；必须先固定约定再比较常数",
      ],
      steps: [
        {
          title: "位置积分给出 V 的 N 次方",
          formula: tex`$\displaystyle \int_{V^N}d^{3N}q=V^N$`,
          explanation: "理想气体在容器内部势能为零，因此每个粒子的位置都可独立遍历体积 V。",
        },
        {
          title: "把能量限制变成 3N 维动量球",
          formula: tex`$\displaystyle \sum_{i=1}^N\frac{p_i^2}{2m}\le E\quad\Longleftrightarrow\quad |p|\le\sqrt{2mE}$`,
          explanation: "累计体积使用球内部；delta 壳则通过对 E 求导得到球面壳测度。",
        },
        {
          title: "写出累计相空间体积",
          formula: tex`$\displaystyle \Sigma(E)=V^N\frac{\pi^{3N/2}(2mE)^{3N/2}}{\Gamma(3N/2+1)}=V^N\frac{(2\pi mE)^{3N/2}}{\Gamma(3N/2+1)}$`,
          explanation: "π^(3N/2) 不能漏掉；它来自高维单位球体积。",
        },
        {
          title: "从累计体积得到壳态密度",
          formula: tex`$\displaystyle \omega(E)=\frac{\partial\Sigma}{\partial E}=V^N\frac{(2\pi m)^{3N/2}E^{3N/2-1}}{\Gamma(3N/2)}$`,
          explanation: "有限窗态数为 ω(E)Δ；用 Σ 或 ωΔ 得到相同的热力学领先项。",
        },
        {
          title: "补齐无量纲与不可区分修正",
          formula: tex`$\displaystyle \mathcal N(E,\Delta)=\frac{\omega(E)\Delta}{N!\,h^{3N}},\qquad S=k_B\ln\mathcal N$`,
          explanation: "课件原式省略 h^(3N) 后对有量纲量取对数；教学上必须补回。Δ 只改变次领先加法常数。",
        },
        {
          title: "对 N! 与 Gamma 函数作 Stirling 展开",
          formula: tex`$\displaystyle \ln N!\simeq N\ln N-N,\qquad \ln\Gamma(3N/2+1)\simeq\frac{3N}{2}\ln\frac{3N}{2}-\frac{3N}{2}$`,
          explanation: "保留 O(N) 项，舍去 O(lnN) 的壳宽和 Gaussian 前因子项。",
        },
        {
          title: "整理为 Sackur–Tetrode 形式",
          formula: tex`$\displaystyle S=Nk_B\left[\ln\!\left(\frac VN\left(\frac{4\pi mE}{3Nh^2}\right)^{3/2}\right)+\frac52\right]+O(\ln N)$`,
          explanation: "这才是对数自变量无量纲且具有广延性的标准结果；课件紧凑式可视为省略 h 与次领先常数的版本。",
        },
      ],
      conclusion: tex`$\displaystyle S_{\rm ST}=Nk_B\left[\ln\!\left(\frac VN\left(\frac{4\pi mE}{3Nh^2}\right)^{3/2}\right)+\frac52\right]$`,
      checks: [
        "对数内部必须无量纲，因此 h² 不能漏",
        "把 E、V、N 同时放大 λ 倍，S 应放大 λ 倍",
        "由 (∂S/∂E)V,N=1/T 应恢复 E=3NkBT/2",
        "课件 σ(T)=(2πemT)^(3/2) 是保留原页的有量纲紧凑写法，不是完整态数因子",
      ],
      evidence: ["课件 3 slide 19", "课件 3 slide 24", "课件 3 slide 25", "课件 3 slide 26"],
    },
  ),

  lesson(
    "classical-gases",
    3,
    [21],
    "Maxwell–Boltzmann momentum distribution from the microcanonical ensemble",
    [
      "V Ω(E−p⃗1²/2m,V,N−1)/Ω(E,V,N)",
      "(1−p⃗1²/2mE)^(3N/2−2)",
      "p(p⃗1)=1/(2πmkBT)^(3/2) exp(−p⃗1²/(2mkBT))",
    ],
    {
      id: "teacher-l03-microcanonical-marginal-to-maxwell",
      title: "由微正则边缘态数比得到 Maxwell 动量分布",
      aliases: ["microcanonical marginal", "Maxwell momentum distribution", "large-N bath"],
      kind: "近似",
      origin:
        "固定粒子 1 的动量后，剩余 N−1 个粒子可用的能量减少 p1²/(2m)；其态数与总态数之比给出边缘分布，大 N 展开产生指数。",
      symbols: [
        { symbol: tex`$\mathbf p_1$`, meaning: "被观察的单粒子三维动量" },
        { symbol: tex`$\varepsilon_1$`, meaning: "p1²/(2m)，该粒子的动能" },
        { symbol: tex`$\alpha_N$`, meaning: "理想气体态数对 E 的幂次，等于 3N/2 加一个 O(1) 常数" },
      ],
      prerequisites: ["微正则边缘概率", "理想气体态数的能量幂律", "ln(1−x) 的小 x 展开"],
      assumptions: [
        "N≫1 且被观察粒子的能量 ε1≪E",
        "总能量满足 E/N→3kBT/2",
        "课件保留指数 3N/2−2；不同的 delta 壳、累计体积或窗宽 convention 会使有限 O(1) 常数不同，但不改变大 N 极限",
      ],
      steps: [
        {
          title: "固定粒子 1 后计算剩余态数",
          formula: tex`$\displaystyle p(\mathbf p_1)\propto V\,\frac{\Omega_{N-1}(E-\varepsilon_1,V)}{\Omega_N(E,V)},\qquad \varepsilon_1=\frac{\mathbf p_1^2}{2m}$`,
          explanation: "粒子 1 的位置积分给 V；剩余粒子只能分享 E−ε1。",
        },
        {
          title: "利用理想气体的能量幂律",
          formula: tex`$\displaystyle \Omega_{N-1}(E-\varepsilon_1)\propto(E-\varepsilon_1)^{\alpha_N+O(1)},\qquad \alpha_N=\frac{3N}{2}$`,
          explanation: "O(1) 项取决于用 shell 还是 cumulative convention；热力学极限由 3N/2 主导。",
        },
        {
          title: "保留课件的有限 N 写法",
          formula: tex`$\displaystyle p(\mathbf p_1)\propto\left(1-\frac{\mathbf p_1^2}{2mE}\right)^{3N/2-2}$`,
          explanation: "这条按原页保留；若从严格 delta 壳采用另一常见计数，幂次会相差有限 O(1)，不能把两种 convention 混称为同一有限 N 恒等式。",
        },
        {
          title: "对大 N 取对数展开",
          formula: tex`$\displaystyle \ln p=\left(\frac{3N}{2}+O(1)\right)\ln\!\left(1-\frac{\varepsilon_1}{E}\right)+\mathrm{const}\simeq-\frac{3N\varepsilon_1}{2E}+\mathrm{const}$`,
          explanation: "使用 ln(1−x)=−x+O(x²)，而 O(1) 的幂次差除以 E=O(N) 后消失。",
        },
        {
          title: "用微正则温度替换总能量",
          formula: tex`$\displaystyle E=\frac32Nk_BT\quad\Longrightarrow\quad -\frac{3N\varepsilon_1}{2E}=-\frac{\varepsilon_1}{k_BT}=-\frac{\mathbf p_1^2}{2mk_BT}$`,
          explanation: "有限系统的幂律在热力学极限变成 canonical Boltzmann 指数。",
        },
        {
          title: "用三维 Gaussian 归一化",
          formula: tex`$\displaystyle \int d^3p\,e^{-\mathbf p^2/(2mk_BT)}=(2\pi mk_BT)^{3/2}$`,
          explanation: "分成三个独立的一维 Gaussian 积分即可。",
        },
      ],
      conclusion: tex`$\displaystyle p(\mathbf p_1)=\frac{1}{(2\pi mk_BT)^{3/2}}\exp\!\left(-\frac{\mathbf p_1^2}{2mk_BT}\right)$`,
      checks: [
        "p(p⃗1) 对 d³p 的积分必须为 1",
        "每个分量方差应为 mkBT",
        "课件的 3N/2−2 只按原页保留；有限 O(1) exponent convention 不影响大 N Maxwell 极限",
      ],
      evidence: ["课件 3 slide 21"],
    },
  ),

  lesson(
    "classical-gases",
    3,
    [24, 25, 26, 27],
    "Gibbs paradox: mixing identical gases without N!",
    [
      "S(E,V,N)=NkB ln[V(4πemE/3N)^(3/2)]",
      "S(T,V,N)=NkB ln[Vσ(T)]",
      "σ(T)=(2πemT)^(3/2)",
      "E=3NkBT/2",
      "ΔS=kB ln[(V1+V2)^(N1+N2)/(V1^N1 V2^N2)]",
      "Ωcorrected=Ω/N!",
      "S=NkB ln[(V/N)(4πemE/3N)^(3/2)]",
      "N1/V1=N2/V2=(N1+N2)/(V1+V2)",
      "ΔS=kB ln 1=0",
      "divide by N1!N2!, not by (N1+N2)!",
    ],
    {
      id: "teacher-l03-gibbs-paradox-mixing-entropy",
      title: "Gibbs paradox：同种气体零混合熵与异种气体混合熵",
      aliases: ["Gibbs paradox", "entropy of mixing", "indistinguishability correction"],
      kind: "推导结果",
      origin:
        "先展示把同种粒子错误视为可区分时产生的伪混合熵，再加入 1/N! 修正恢复广延性；异种气体仍分别按 N1!、N2! 计数并保留真实混合熵。",
      symbols: [
        { symbol: tex`$N_i,V_i$`, meaning: "隔板移除前第 i 份气体的粒子数与体积" },
        { symbol: tex`$V=V_1+V_2$`, meaning: "移除隔板后的总体积" },
        { symbol: tex`$x_i=N_i/(N_1+N_2)$`, meaning: "异种理想气体的摩尔分数或粒子分数" },
      ],
      prerequisites: ["理想气体熵的体积项", "同种粒子 1/N! 修正", "对数把体积比乘积化成和"],
      assumptions: [
        "理想气体，移除隔板前后温度相同",
        "同种气体得 ΔS=0 还要求初态密度相同 N1/V1=N2/V2；否则仍会有均匀化熵增",
        "异种气体的 −kBΣNi lnxi 形式还要求初态等温等压，使 Vi/V=Ni/N=xi",
      ],
      steps: [
        {
          title: "先看漏掉 N! 的错误计数",
          formula: tex`$\displaystyle S_{\rm wrong}(T,V,N)=Nk_B\ln[V\,\sigma(T)]$`,
          explanation: "体积项是 N lnV 而不是 N ln(V/N)，因此不是广延函数。",
        },
        {
          title: "错误计数给同种气体伪混合熵",
          formula: tex`$\displaystyle \Delta S_{\rm wrong}=k_B\ln\frac{(V_1+V_2)^{N_1+N_2}}{V_1^{N_1}V_2^{N_2}}>0$`,
          explanation: "即使隔板两侧是完全相同且同密度的气体，这个式子仍给出非零结果，形成 Gibbs paradox。",
        },
        {
          title: "加入同种不可区分粒子的修正",
          formula: tex`$\displaystyle \Omega_{\rm corrected}=\frac{\Omega_{\rm labeled}}{N!},\qquad S(T,V,N)=Nk_B[\ln(V/N)+f(T)]$`,
          explanation: "Stirling 展开把 −lnN! 转成 −NlnN+N，使熵依赖粒子比体积 V/N 并恢复广延性。",
        },
        {
          title: "同种、同温、同密度时逐项相消",
          formula: tex`$\displaystyle \frac{V_1}{N_1}=\frac{V_2}{N_2}=\frac{V_1+V_2}{N_1+N_2}\quad\Longrightarrow\quad \Delta S_{\rm identical}=0$`,
          explanation: "移除隔板前后每个粒子的可用比体积没有改变，因此没有新的可区分宏观状态。",
        },
        {
          title: "异种气体必须分别做阶乘修正",
          formula: tex`$\displaystyle \Omega_{\rm mix}\propto\frac{1}{N_1!N_2!},\qquad \text{not }\frac{1}{(N_1+N_2)!}$`,
          explanation: "不同组分仍可由种类标签区分，不能把两种粒子合成同一个不可区分集合。",
        },
        {
          title: "写出异种气体各自自由膨胀的熵变",
          formula: tex`$\displaystyle \Delta S_{\rm different}=k_B\left[N_1\ln\frac{V}{V_1}+N_2\ln\frac{V}{V_2}\right]$`,
          explanation: "每个组分从自己的初始体积扩展到共同总体积 V。",
        },
        {
          title: "在等温等压初态化成摩尔分数形式",
          formula: tex`$\displaystyle \frac{V_i}{V}=\frac{N_i}{N}=x_i\quad\Longrightarrow\quad \Delta S_{\rm mix}=-k_B\sum_{i=1}^{2}N_i\ln x_i>0$`,
          explanation: "0<xi<1，所以 lnxi<0；外面的负号使异种气体混合熵为正。",
        },
      ],
      conclusion: tex`$\displaystyle \Delta S_{\rm identical}=0\ \text{(same T and density)},\qquad \Delta S_{\rm different}=-k_B\sum_iN_i\ln x_i$`,
      checks: [
        "令两侧同种且 V1/N1=V2/N2，结果必须严格为零",
        "等量两种气体 x1=x2=1/2 时应得到 ΔS=NkB ln2",
        "若初态不等压或不等密度，应使用一般体积比公式，不可直接代 xi",
      ],
      evidence: ["课件 3 slide 24", "课件 3 slide 25", "课件 3 slide 26", "课件 3 slide 27"],
    },
  ),
];
