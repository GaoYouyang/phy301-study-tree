import {
  deepDiveFormulaKey,
  type FormulaDerivation,
} from "./formula-derivation-types";

const tex = String.raw;

export const assessmentFormulaDerivations: Record<string, FormulaDerivation> = {
  [deepDiveFormulaKey(
    "quantum-bridge",
    "回访作业 2 Q2：现在再做量子谐振子",
    tex`$$\frac{C}{N}=k_{\mathrm B}(\beta\hbar\omega)^2\frac{e^{\beta\hbar\omega}}{(e^{\beta\hbar\omega}-1)^2}$$`,
  )]: {
    id: "assessment-quantum-oscillator-heat-capacity",
    title: "量子谐振子热容的完整链式求导",
    kind: "推导结果",
    origin:
      "从单振子的 canonical partition function 出发，先用 U=−∂βlnZ 求平均能量，再把 β=1/(kBT) 的温度依赖完整带入 C=(∂U/∂T)。零点能保留在 U 中，但因不随 T 变化而不贡献热容。",
    symbols: [
      { symbol: "C", meaning: "N 个独立一维量子谐振子的定容热容" },
      { symbol: "N", meaning: "彼此独立且可区分的相同振子数" },
      { symbol: "β", meaning: "inverse temperature 1/(kBT)" },
      { symbol: "ω", meaning: "谐振子的角频率，计算中保持不变" },
      { symbol: "ℏ", meaning: "约化 Planck 常数" },
      { symbol: "x", meaning: "为简化求导定义的无量纲变量 βℏω" },
    ],
    prerequisites: [
      "canonical identity U=−∂βlnZ",
      "量子谐振子的 geometric partition sum",
      "chain rule 与 β=1/(kBT)",
    ],
    assumptions: [
      "N 个一维谐振子彼此独立、频率均为 ω，并处于 canonical equilibrium",
      "求 C 时固定 N、ω 与外部参数；β>0、ω>0",
    ],
    steps: [
      {
        title: "先写总 partition function 的对数",
        formula: tex`$$Z_1=\frac{e^{-\beta\hbar\omega/2}}{1-e^{-\beta\hbar\omega}},\qquad \ln Z_N=N\left[-\frac{\beta\hbar\omega}{2}-\ln\!\left(1-e^{-\beta\hbar\omega}\right)\right]$$`,
        explanation:
          "N 个独立、可区分振子给 ZN=Z1^N。先取对数把乘积变成 N 倍，后续只需逐项求导。",
      },
      {
        title: "对 β 求导得到每个振子的能量",
        formula: tex`$$\frac{U}{N}=-\frac{1}{N}\frac{\partial\ln Z_N}{\partial\beta}=\frac{\hbar\omega}{2}+\frac{\hbar\omega e^{-\beta\hbar\omega}}{1-e^{-\beta\hbar\omega}}=\frac{\hbar\omega}{2}+\frac{\hbar\omega}{e^{\beta\hbar\omega}-1}$$`,
        explanation:
          "第一项是 zero-point energy；第二项是 thermal excitation。把分子分母同乘 e^{βℏω} 就得到标准 Bose factor。",
      },
      {
        title: "把温度依赖集中到 x=βℏω",
        formula: tex`$$x=\beta\hbar\omega=\frac{\hbar\omega}{k_{\mathrm B}T},\qquad \frac{dx}{dT}=-\frac{\hbar\omega}{k_{\mathrm B}T^2}=-\frac{x}{T}$$`,
        explanation:
          "ω 固定时，U 中只有 x 随 T 改变；零点能 ℏω/2 的温度导数为零。",
      },
      {
        title: "先对 x 求 thermal term 的导数",
        formula: tex`$$\frac{d}{dx}\!\left(\frac{\hbar\omega}{e^x-1}\right)=-\frac{\hbar\omega e^x}{(e^x-1)^2}$$`,
        explanation:
          "这是 reciprocal 与 exponential 的 chain rule；负号随后会与 dx/dT 的负号相消。",
      },
      {
        title: "乘上 dx/dT 并整理",
        formula: tex`$$\frac{C}{N}=\frac{d(U/N)}{dT}=\left[-\frac{\hbar\omega e^x}{(e^x-1)^2}\right]\left(-\frac{x}{T}\right)=k_{\mathrm B}\frac{x^2e^x}{(e^x-1)^2}$$`,
        explanation:
          "最后一步使用 ℏω·x/T=(ℏω)²/(kBT²)=kBx²，把结果整理为显然具有热容单位的形式。",
      },
      {
        title: "代回 x=βℏω",
        formula: tex`$$\frac{C}{N}=k_{\mathrm B}(\beta\hbar\omega)^2\frac{e^{\beta\hbar\omega}}{(e^{\beta\hbar\omega}-1)^2}$$`,
        explanation: "这就是每个一维量子谐振子的精确 canonical heat capacity。",
      },
    ],
    conclusion: tex`$$\frac{C}{N}=k_{\mathrm B}(\beta\hbar\omega)^2\frac{e^{\beta\hbar\omega}}{(e^{\beta\hbar\omega}-1)^2}$$`,
    checks: [
      "C/N 的单位必须是 kB，括号内全部无量纲且结果恒非负。",
      "βℏω≪1 时 e^x−1≈x，故 C/N→kB，回到经典一维谐振子的 equipartition 结果。",
      "βℏω≫1 时 C/N≈kB(βℏω)²e^{-βℏω}→0，符合第三定律方向。",
    ],
    evidence: [
      "作业 2 Q2(b)",
      "作业 2 答案 p. 3（由 Z 对 β 求 U，再对 T 求 C）",
      "课件 7 slide 19、课件 8 slide 18（quantum canonical density operator 与 trace 归一化）",
    ],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "作业 3 Q1 主线：先懂结构，再攻积分",
    tex`$$K(x,x';\beta)=\sqrt{\frac{m\omega}{2\pi\hbar\sinh(\beta\hbar\omega)}}\exp\!\left[-\frac{m\omega}{4\hbar}\left((x+x')^2\tanh\frac{\beta\hbar\omega}{2}+(x-x')^2\coth\frac{\beta\hbar\omega}{2}\right)\right]$$`,
  )]: {
    id: "assessment-quantum-oscillator-mehler-kernel",
    title: "从能量谱到完整 Mehler thermal kernel",
    kind: "推导结果",
    origin:
      "把 harmonic-oscillator energy basis 插入 K(x,x′;β)=⟨x|e^{-βH}|x′⟩，再将 Hermite polynomial 的高阶导数改写成 Fourier 乘法。先完成 n-sum，最后用二维 Gaussian integral 消去两个 Fourier variables，就得到闭式 Mehler kernel。",
    symbols: [
      {
        symbol: "K(x,x′;β)",
        meaning: "未除以 Z 的 imaginary-time thermal kernel ⟨x|e^{-βH}|x′⟩",
      },
      { symbol: "m, ω", meaning: "一维 harmonic oscillator 的质量与角频率" },
      { symbol: "ξ", meaning: "dimensionless position √(mω/ℏ)x；ξ′ 同理" },
      { symbol: "q", meaning: "e^{-βℏω}，满足 0<q<1" },
      {
        symbol: "A",
        meaning:
          "Fourier variables k,k′ 的 2×2 positive-definite Gaussian matrix",
      },
      { symbol: "J", meaning: "Gaussian source vector i(ξ,ξ′)ᵀ" },
    ],
    prerequisites: [
      "energy-basis completeness",
      "harmonic-oscillator eigenfunctions 与 Hermite Rodrigues formula",
      "Fourier transform of a Gaussian",
      "multivariate Gaussian integral",
    ],
    assumptions: [
      "一维 quantum harmonic oscillator，β>0、m>0、ω>0",
      "能量本征函数采用正交归一约定，Fourier convention 为 F(k)=∫dξ e^{-ikξ}f(ξ)",
      "Gaussian source 公式采用 exp(−vᵀAv/2+Jᵀv)，其积分指数为 +JᵀA⁻¹J/2",
    ],
    steps: [
      {
        title: "插入能量本征态完备关系",
        formula: tex`$$K(x,x';\beta)=\left\langle x\left|e^{-\beta H}\left(\sum_{n=0}^{\infty}|n\rangle\langle n|\right)\right|x'\right\rangle=\sum_{n=0}^{\infty}e^{-\beta E_n}\varphi_n(x)\varphi_n^*(x')$$`,
        explanation:
          "因为 H|n⟩=En|n⟩，算符指数作用在 |n⟩ 上只产生 e^{-βEn}。对 harmonic oscillator，En=ℏω(n+1/2)。",
      },
      {
        title: "代入 normalized oscillator eigenfunction",
        formula: tex`$$\varphi_n(x)=\left(\frac{m\omega}{\pi\hbar}\right)^{1/4}\frac{H_n(\xi)e^{-\xi^2/2}}{\sqrt{2^n n!}},\qquad \xi=\sqrt{\frac{m\omega}{\hbar}}\,x$$`,
        explanation:
          "乘上 x′ 端的同类因子后，困难部分只剩带 q^n/(2^n n!) 权重的 Hermite product sum。",
      },
      {
        title: "用 Fourier transform 消去 Hermite 的 n 阶导数",
        formula: tex`$$H_n(\xi)=(-1)^n e^{\xi^2}\frac{\partial^n}{\partial\xi^n}e^{-\xi^2},\qquad e^{-\xi^2}=\frac{1}{2\pi}\int_{-\infty}^{\infty}dk\,\sqrt{\pi}\,e^{-k^2/4}e^{ik\xi},\qquad \frac{\partial^n}{\partial\xi^n}e^{ik\xi}=(ik)^n e^{ik\xi}$$`,
        explanation:
          "对 ξ 与 ξ′ 各做一次变换后，两个 n 阶导数合并为 (-kk′)^n，原来的 polynomial sum 变成 exponential series。",
      },
      {
        title: "先完成 n-sum",
        formula: tex`$$\sum_{n=0}^{\infty}\frac{q^nH_n(\xi)H_n(\xi')}{2^n n!}=\frac{e^{\xi^2+\xi'^2}}{4\pi}\int_{-\infty}^{\infty}dk\int_{-\infty}^{\infty}dk'\,\exp\!\left[-\frac{k^2+2qkk'+k'^2}{4}+i(k\xi+k'\xi')\right]$$`,
        explanation:
          "这里使用 Σn y^n/n!=e^y；cross term −q k k'/2 正是两个 Fourier factors 与 q^n/2^n 相乘的结果。",
      },
      {
        title: "识别并计算二维 Gaussian",
        formula: tex`$$\mathbf v=\begin{pmatrix}k\\k'\end{pmatrix},\quad A=\frac12\begin{pmatrix}1&q\\q&1\end{pmatrix},\quad \mathbf J=i\begin{pmatrix}\xi\\\xi'\end{pmatrix},\quad \det A=\frac{1-q^2}{4},\quad \int d^2\mathbf v\,e^{-\mathbf v^{\mathsf T}A\mathbf v/2+\mathbf J^{\mathsf T}\mathbf v}=\frac{2\pi}{\sqrt{\det A}}e^{\mathbf J^{\mathsf T}A^{-1}\mathbf J/2}$$`,
        explanation:
          "A^{-1}=2(1-q²)^{-1}[[1,-q],[-q,1]]，且 detA>0。J 含 i，所以标准公式中的正 source exponent 最终给出负的 real-space quadratic form。",
      },
      {
        title: "把能级零点因子、本征函数因子与求和结果重新装回 K",
        formula: tex`$$K=\sqrt{\frac{m\omega}{\pi\hbar}}\,e^{-\beta\hbar\omega/2}e^{-(\xi^2+\xi'^2)/2}\,S_q(\xi,\xi'),\qquad S_q=\frac{e^{\xi^2+\xi'^2}}{\sqrt{1-q^2}}\exp\!\left[-\frac{\xi^2-2q\xi\xi'+\xi'^2}{1-q^2}\right]$$`,
        explanation:
          "这一步把前面暂时分开的三块全部收回：oscillator eigenfunction 的 normalization 与 Gaussian、能量中的 zero-point factor e^{-βℏω/2}，以及完成二维积分后的 Hermite sum S_q。这样最终 prefactor 不会凭空出现。",
      },
      {
        title: "把 q 改写成 hyperbolic functions",
        formula: tex`$$1-q^2=2e^{-\beta\hbar\omega}\sinh(\beta\hbar\omega),\qquad \frac{1+q}{1-q}=\coth\!\left(\frac{\beta\hbar\omega}{2}\right),\qquad \frac{1-q}{1+q}=\tanh\!\left(\frac{\beta\hbar\omega}{2}\right)$$`,
        explanation:
          "把 quadratic form 改写为 x+x′ 与 x−x′ 两个方向，就能分别识别 tanh 与 coth；同时将 prefactor 化为 sinh(βℏω) 的平方根。",
      },
      {
        title: "恢复有量纲坐标并收集 prefactor",
        formula: tex`$$K(x,x';\beta)=\sqrt{\frac{m\omega}{2\pi\hbar\sinh(\beta\hbar\omega)}}\exp\!\left[-\frac{m\omega}{4\hbar}\left((x+x')^2\tanh\frac{\beta\hbar\omega}{2}+(x-x')^2\coth\frac{\beta\hbar\omega}{2}\right)\right]$$`,
        explanation:
          "使用 ξ=√(mω/ℏ)x 与 ξ′=√(mω/ℏ)x′ 后，指数无量纲，prefactor 的单位为 1/length，符合 position-space kernel 的单位。",
      },
    ],
    conclusion: tex`$$K(x,x';\beta)=\sqrt{\frac{m\omega}{2\pi\hbar\sinh(\beta\hbar\omega)}}\exp\!\left[-\frac{m\omega}{4\hbar}\left((x+x')^2\tanh\frac{\beta\hbar\omega}{2}+(x-x')^2\coth\frac{\beta\hbar\omega}{2}\right)\right]$$`,
    checks: [
      "K(x,x′;β)=K(x′,x;β) 且为实数，符合 Hermiticity。",
      "β→∞ 时 kernel 应趋向 e^{-βℏω/2}φ0(x)φ0(x′)，只剩 ground state。",
      "β→0 时应恢复 free-particle short-time kernel 的窄 Gaussian 极限。",
      "detA=(1-e^{-2βℏω})/4>0，保证两个 Fourier integrals 收敛。",
    ],
    evidence: [
      "作业 3 Q1(a–c)",
      "作业 3 答案 pp. 1–5（spectral sum、Hermite Fourier trick、2×2 Gaussian 与 hyperbolic 化简；p. 3 Gaussian source sign 与 p. 5 的 (ξ+ξ′)² 按资料勘误修正）",
      "课件 7 slides 13、19；课件 8 slide 18（energy completeness 与 quantum canonical operator）",
    ],
  },

  [deepDiveFormulaKey(
    "quantum-bridge",
    "作业 3 Q1 主线：先懂结构，再攻积分",
    tex`$$\rho(x,x')=\frac{K(x,x';\beta)}{Z},\qquad \langle H\rangle=\frac{\hbar\omega}{2}\coth\!\left(\frac{\beta\hbar\omega}{2}\right)$$`,
  )]: {
    id: "assessment-quantum-oscillator-density-energy",
    title: "由 thermal kernel 归一化 density matrix 并求平均能量",
    kind: "推导结果",
    origin:
      "canonical density operator 是 ρ̂=e^{-βH}/Z，因此其 position-space matrix element 就是未归一化 thermal kernel 除以 trace。再利用 ⟨H⟩=−∂βlnZ，可从同一个 normalization factor 直接得到能量。",
    symbols: [
      {
        symbol: "ρ(x,x′)",
        meaning: "normalized density-matrix element ⟨x|ρ̂|x′⟩",
      },
      { symbol: "K(x,x′;β)", meaning: "unnormalized kernel ⟨x|e^{-βH}|x′⟩" },
      { symbol: "Z", meaning: "Tr(e^{-βH})，使 Trρ̂=1" },
      { symbol: "⟨H⟩", meaning: "canonical mean energy" },
      { symbol: "coth", meaning: "hyperbolic cotangent cosh/sinh" },
    ],
    prerequisites: [
      "canonical density operator",
      "Mehler thermal kernel",
      "trace in a continuous position basis",
      "Gaussian integral 与 logarithmic derivative",
    ],
    assumptions: [
      "一维 quantum harmonic oscillator，β>0",
      "position states 以 ∫dx|x⟩⟨x|=I 归一化",
      "Hamiltonian 与 ω 不显含温度；求导时保持 ω 固定",
    ],
    steps: [
      {
        title: "从 canonical operator 定义取 position matrix element",
        formula: tex`$$\hat\rho=\frac{e^{-\beta H}}{Z},\qquad \rho(x,x')=\langle x|\hat\rho|x'\rangle=\frac{\langle x|e^{-\beta H}|x'\rangle}{Z}=\frac{K(x,x';\beta)}{Z}$$`,
        explanation:
          "这一步区分 K 与 ρ：K 尚未归一化，ρ 必须满足 ∫dxρ(x,x)=1。",
      },
      {
        title: "在 position basis 计算 trace",
        formula: tex`$$Z=\operatorname{Tr}(e^{-\beta H})=\int_{-\infty}^{\infty}dx\,K(x,x;\beta)=\int_{-\infty}^{\infty}dx\,\sqrt{\frac{m\omega}{2\pi\hbar\sinh y}}\,e^{-(m\omega/\hbar)\tanh(y/2)x^2},\qquad y=\beta\hbar\omega$$`,
        explanation:
          "令 x′=x 后，Mehler exponent 的 (x−x′)² 项消失，剩下一维 centered Gaussian。",
      },
      {
        title: "完成 Gaussian normalization",
        formula: tex`$$\int_{-\infty}^{\infty}dx\,e^{-ax^2}=\sqrt{\frac{\pi}{a}},\qquad a=\frac{m\omega}{\hbar}\tanh\!\left(\frac y2\right)\quad\Longrightarrow\quad Z=\frac{1}{2\sinh(y/2)}$$`,
        explanation:
          "使用 sinh y=2sinh(y/2)cosh(y/2)，所有 m、ω、ℏ prefactors 正好相消，Z 为无量纲。",
      },
      {
        title: "用 canonical derivative 求能量",
        formula: tex`$$\langle H\rangle=-\frac{\partial\ln Z}{\partial\beta}=\frac{\partial}{\partial\beta}\ln\!\left[2\sinh\!\left(\frac{\beta\hbar\omega}{2}\right)\right]$$`,
        explanation: "因为 lnZ=−ln[2sinh(βℏω/2)]，前面的负号把它改成正导数。",
      },
      {
        title: "完成 chain rule",
        formula: tex`$$\frac{\partial}{\partial\beta}\ln\!\left[\sinh\!\left(\frac{\beta\hbar\omega}{2}\right)\right]=\frac{\hbar\omega}{2}\frac{\cosh(\beta\hbar\omega/2)}{\sinh(\beta\hbar\omega/2)}=\frac{\hbar\omega}{2}\coth\!\left(\frac{\beta\hbar\omega}{2}\right)$$`,
        explanation:
          "常数 ln2 的导数为零；sinh 的 logarithmic derivative 是 coth。",
      },
      {
        title: "把归一化与能量结果并列",
        formula: tex`$$\rho(x,x')=\frac{K(x,x';\beta)}{Z},\qquad \langle H\rangle=\frac{\hbar\omega}{2}\coth\!\left(\frac{\beta\hbar\omega}{2}\right)$$`,
        explanation:
          "第一式确保 trace one，第二式包含 zero-point energy 与 thermal excitation 两部分。",
      },
    ],
    conclusion: tex`$$\rho(x,x')=\frac{K(x,x';\beta)}{Z},\qquad \langle H\rangle=\frac{\hbar\omega}{2}\coth\!\left(\frac{\beta\hbar\omega}{2}\right)$$`,
    checks: [
      "直接积分 ∫dxρ(x,x) 必须得到 1。",
      "β→∞ 时 ⟨H⟩→ℏω/2；βℏω≪1 时 coth(βℏω/2)≈2/(βℏω)，故 ⟨H⟩→kBT。",
      "ρ(x,x′)=ρ*(x′,x)，且对任意测试函数给出非负 quadratic form。",
    ],
    evidence: [
      "作业 3 Q1(d–f)",
      "作业 3 答案 pp. 5–6（对角 kernel、Gaussian trace、normalized ρ、⟨x²⟩ 与 ⟨H⟩）",
      "课件 7 slides 16–19、课件 8 slides 16–18（density matrix、trace expectation 与 thermal equilibrium）",
    ],
  },

  [deepDiveFormulaKey(
    "quantum-statistics",
    "作业 3 Q2：单态概率与涨落完整链",
    tex`$$P_B(n)=(1-q)q^n,\quad \operatorname{Var}_B(n)=\bar n(1+\bar n);\qquad P_F(n)=\frac{q^n}{1+q},\quad \operatorname{Var}_F(n)=\bar n(1-\bar n)$$`,
  )]: {
    id: "assessment-quantum-single-state-probability-fluctuation",
    title: "Boson geometric 与 Fermion Bernoulli 单态涨落",
    kind: "推导结果",
    origin:
      "在 grand canonical ensemble 中，一个固定 one-particle state 的权重是 q^n，其中 q=e^{-β(ε−μ)}。Boson 允许 n=0,1,2,…，得到 geometric distribution；Fermion 只允许 n=0,1，得到 Bernoulli distribution。由各自 generating sum 的前两阶导数可求均值与方差。",
    symbols: [
      { symbol: "q", meaning: "single-state fugacity factor e^{-β(ε−μ)}" },
      {
        symbol: "PB(n)",
        meaning: "一个 Bosonic one-particle state 有 n 个粒子的概率",
      },
      {
        symbol: "PF(n)",
        meaning:
          "一个 Fermionic one-particle state 有 n 个粒子的概率，n 只能为 0 或 1",
      },
      { symbol: "n̄", meaning: "该单态 occupation number 的平均值" },
      { symbol: "Var(n)", meaning: "⟨n²⟩−⟨n⟩²" },
    ],
    prerequisites: [
      "grand-canonical weight e^{-β(ε−μ)n}",
      "geometric series 与 Bernoulli distribution",
      "generating-function derivatives",
    ],
    assumptions: [
      "讨论的是一个不含 degeneracy factor 的单粒子态；能级简并时要对 gi 个态分别相加",
      "ideal non-interacting particles，使不同 single-particle states 的 grand partition factors 独立",
      "Boson 必须有 μ<ε，故 0≤q<1；Fermion 允许 q≥0",
    ],
    steps: [
      {
        title: "归一化 Boson 的无限 occupation sum",
        formula: tex`$$z_B=\sum_{n=0}^{\infty}q^n=\frac{1}{1-q},\qquad P_B(n)=\frac{q^n}{z_B}=(1-q)q^n$$`,
        explanation: "前因子必须是 1−q；否则 ΣnPB(n) 不会等于 1。",
      },
      {
        title: "用 q-derivative 求 Boson mean",
        formula: tex`$$\bar n_B=\sum_{n=0}^{\infty}nP_B(n)=(1-q)q\frac{d}{dq}\!\left(\frac{1}{1-q}\right)=\frac{q}{1-q}$$`,
        explanation: "算符 q∂q 作用在 q^n 上会拉下 n，因此可避免逐项硬算。",
      },
      {
        title: "再求 Boson second factorial moment",
        formula: tex`$$\langle n(n-1)\rangle_B=(1-q)q^2\frac{d^2}{dq^2}\!\left(\frac{1}{1-q}\right)=\frac{2q^2}{(1-q)^2}$$`,
        explanation: "由 n²=n(n−1)+n 得 ⟨n²⟩，再减去 n̄B²。",
      },
      {
        title: "整理 Boson variance",
        formula: tex`$$\operatorname{Var}_B(n)=\frac{2q^2}{(1-q)^2}+\frac{q}{1-q}-\frac{q^2}{(1-q)^2}=\frac{q}{(1-q)^2}=\bar n_B(1+\bar n_B)$$`,
        explanation:
          "额外的 +n̄B² 是 Bose bunching：平均 occupation 越大，super-Poisson fluctuation 越强。",
      },
      {
        title: "归一化 Fermion 的两个 allowed occupations",
        formula: tex`$$z_F=\sum_{n=0}^{1}q^n=1+q,\qquad P_F(n)=\frac{q^n}{1+q}\ (n=0,1),\qquad P_F(0)=\frac{1}{1+q},\quad P_F(1)=\frac{q}{1+q}$$`,
        explanation:
          "Pauli exclusion 把 occupation 限制为 0 或 1，所以这是一个 Bernoulli variable。",
      },
      {
        title: "利用 n²=n 求 Fermion variance",
        formula: tex`$$\bar n_F=\langle n\rangle_F=\frac{q}{1+q},\qquad \langle n^2\rangle_F=\langle n\rangle_F\quad\Longrightarrow\quad \operatorname{Var}_F(n)=\bar n_F-\bar n_F^2=\bar n_F(1-\bar n_F)$$`,
        explanation:
          "−n̄F² 表示 Pauli blocking 抑制涨落；occupation 接近 1 时 variance 再次趋零。",
      },
      {
        title: "把两种统计并列",
        formula: tex`$$P_B(n)=(1-q)q^n,\quad \operatorname{Var}_B(n)=\bar n(1+\bar n);\qquad P_F(n)=\frac{q^n}{1+q},\quad \operatorname{Var}_F(n)=\bar n(1-\bar n)$$`,
        explanation:
          "两行只差 allowed n 的范围，却分别产生 enhanced 与 suppressed fluctuations。",
      },
    ],
    conclusion: tex`$$P_B(n)=(1-q)q^n,\quad \operatorname{Var}_B(n)=\bar n(1+\bar n);\qquad P_F(n)=\frac{q^n}{1+q},\quad \operatorname{Var}_F(n)=\bar n(1-\bar n)$$`,
    checks: [
      "分别验证 ΣnPB(n)=1 与 PF(0)+PF(1)=1。",
      "dilute limit q≪1 时两者都有 n̄≈q、Var(n)≈n̄，回到 Poisson-like classical limit。",
      "Boson variance 大于 mean，Fermion variance 小于 mean；若符号相反，通常是统计种类写反。",
    ],
    evidence: [
      "作业 3 Q2(c) 及由同一分布继续求 moments 的标准步骤",
      "作业 3 答案 pp. 8–10（single-state grand factors、mean occupation 与 PB/PF）",
      "课件 8 slides 13–14、19（occupation-number grand ensemble、most probable 与 average）",
    ],
  },

  [deepDiveFormulaKey(
    "quantum-statistics",
    "作业 3 Q2：单态概率与涨落完整链",
    tex`$$\bar n_i=-\frac{1}{\beta}\frac{\partial\ln\Xi}{\partial\varepsilon_i}=\frac{g_i}{e^{\beta(\varepsilon_i-\mu)}\mp1}$$`,
  )]: {
    id: "assessment-quantum-mean-level-occupation",
    title: "由 grand partition function 的能级导数得到 BE/FD occupation",
    kind: "推导结果",
    origin:
      "non-interacting quantum gas 的 grand partition function 可按 one-particle levels factorize。改变 εi 会同时改变该能级 gi 个简并态的 Boltzmann weights，因此对 lnΞ 关于 εi 求导会直接拉下该能级总 occupation ni。",
    symbols: [
      {
        symbol: "n̄i",
        meaning: "能量 εi 的整个 gi-fold degenerate level 的平均总 occupation",
      },
      { symbol: "Ξ", meaning: "grand partition function" },
      { symbol: "gi", meaning: "level i 的 degeneracy" },
      { symbol: "εi", meaning: "one-particle energy of level i" },
      { symbol: "μ", meaning: "chemical potential" },
      { symbol: "∓", meaning: "upper minus 为 Boson，lower plus 为 Fermion" },
    ],
    prerequisites: [
      "occupation-number representation",
      "grand-canonical factorization",
      "logarithmic derivative",
    ],
    assumptions: [
      "ideal non-interacting identical particles；每个 level i 有 gi 个同能 one-particle states",
      "对 εi 求偏导时保持 β、μ 与其他 εj 固定",
      "Boson 要求 μ 小于最低相关单粒子能量，使 q_i<1",
    ],
    steps: [
      {
        title: "定义每个能级的 fugacity factor",
        formula: tex`$$q_i=e^{-\beta(\varepsilon_i-\mu)},\qquad \frac{\partial q_i}{\partial\varepsilon_i}=-\beta q_i$$`,
        explanation:
          "把 εi、μ、β 的组合先收进 qi，可让 Boson 与 Fermion 的求导共用同一条 chain rule。",
      },
      {
        title: "按简并态 factorize grand partition function",
        formula: tex`$$\Xi_B=\prod_i(1-q_i)^{-g_i},\qquad \Xi_F=\prod_i(1+q_i)^{g_i}$$`,
        explanation:
          "Boson 单态 sum 是 1/(1−qi)，Fermion 单态 sum 是 1+qi；同能级有 gi 个独立 states，因此各自取 gi 次方。",
      },
      {
        title: "先把 product 变成 logarithmic sum",
        formula: tex`$$\ln\Xi_B=-\sum_j g_j\ln(1-q_j),\qquad \ln\Xi_F=\sum_j g_j\ln(1+q_j)$$`,
        explanation: "对 εi 求偏导时，只有 j=i 的一项保留下来。",
      },
      {
        title: "计算 Boson 的能级导数",
        formula: tex`$$-\frac{1}{\beta}\frac{\partial\ln\Xi_B}{\partial\varepsilon_i}=-\frac{1}{\beta}\left(-\frac{g_i\beta q_i}{1-q_i}\right)=\frac{g_iq_i}{1-q_i}=\frac{g_i}{e^{\beta(\varepsilon_i-\mu)}-1}$$`,
        explanation:
          "最后把分子分母同除以 qi，就得到 Bose–Einstein denominator。",
      },
      {
        title: "计算 Fermion 的能级导数",
        formula: tex`$$-\frac{1}{\beta}\frac{\partial\ln\Xi_F}{\partial\varepsilon_i}=-\frac{1}{\beta}\left(-\frac{g_i\beta q_i}{1+q_i}\right)=\frac{g_iq_i}{1+q_i}=\frac{g_i}{e^{\beta(\varepsilon_i-\mu)}+1}$$`,
        explanation:
          "Pauli restriction 把 geometric denominator 的减号改成加号。",
      },
      {
        title: "合并成统一记号",
        formula: tex`$$\bar n_i=-\frac{1}{\beta}\frac{\partial\ln\Xi}{\partial\varepsilon_i}=\frac{g_i}{e^{\beta(\varepsilon_i-\mu)}\mp1}$$`,
        explanation:
          "upper sign 取 minus 是 Boson；lower sign 取 plus 是 Fermion。n̄i 已包含 gi，单个简并态的平均 occupation 还要除以 gi。",
      },
    ],
    conclusion: tex`$$\bar n_i=-\frac{1}{\beta}\frac{\partial\ln\Xi}{\partial\varepsilon_i}=\frac{g_i}{e^{\beta(\varepsilon_i-\mu)}\mp1}$$`,
    checks: [
      "dilute limit e^{β(εi−μ)}≫1 时，两种统计都给 n̄i≈gi e^{-β(εi−μ)}。",
      "Fermion 必须满足 0≤n̄i≤gi；Boson occupation 则无此上限。",
      "若把 n̄i 解释成单个 state occupation，就不应再保留 numerator gi。",
    ],
    evidence: [
      "作业 3 Q2(a–b)",
      "作业 3 答案 pp. 8–9（ΞB/ΞF factorization 与 −β⁻¹∂εi lnΞ）",
      "课件 8 slides 6–14、19（degeneracy、occupation number 与 grand-canonical average）",
    ],
  },

  [deepDiveFormulaKey(
    "fermi-gas",
    "作业 3 Q4：二维有限温度完整链",
    tex`$$\mu=k_{\mathrm B}T\ln\!\left(e^{\varepsilon_F/(k_{\mathrm B}T)}-1\right);\quad \frac{C_V}{Nk_{\mathrm B}}\approx\frac{\pi^2}{3}\frac{T}{T_F};\quad f(\mu+\delta)=1-f(\mu-\delta);\quad PA=U$$`,
  )]: {
    id: "assessment-fermi-2d-finite-temperature-chain",
    title: "二维 Fermi 气的 exact μ、低温热容、粒子-空穴对称与状态方程",
    kind: "推导结果",
    origin:
      "二维 quadratic dispersion 产生与能量无关的 density of states。constant DOS 让 fixed-N number integral 可精确求出 μ(T)，让 Sommerfeld energy correction 特别简单；同一 quadratic scale relation 还给 PA=U。Fermi function 关于 μ 的代数对称则直接联系上方占据与下方空穴。",
    symbols: [
      { symbol: "A", meaning: "二维系统面积；本题的 thermodynamic volume" },
      { symbol: "g", meaning: "spin 或内部 degeneracy" },
      {
        symbol: "εF",
        meaning: "固定 density 下的 zero-temperature Fermi energy",
      },
      { symbol: "TF", meaning: "Fermi temperature εF/kB" },
      { symbol: "f(ε)", meaning: "Fermi–Dirac function 1/[e^{β(ε−μ)}+1]" },
      {
        symbol: "δ",
        meaning: "相对 chemical potential 的任意正或负 energy offset",
      },
      { symbol: "P", meaning: "二维 thermodynamic pressure" },
    ],
    prerequisites: [
      "二维 k-space state counting",
      "Fermi–Dirac distribution",
      "Sommerfeld expansion",
      "grand potential 与 pressure 的关系 ΦG=−PA",
    ],
    assumptions: [
      "ideal homogeneous 2D Fermi gas，dispersion ε=ℏ²k²/(2m)，DOS 在 band bottom 以上为常数",
      "μ(T) 公式在 constant-DOS continuum model 与固定 N 下精确；忽略 finite-size 与 band-edge corrections",
      "CV 的 displayed expression 只保留 T/TF 的 leading low-temperature term，要求 T≪TF",
      "PA=U 对二维 nonrelativistic quadratic ideal gas 成立；A 不是三维体积",
    ],
    steps: [
      {
        title: "先由二维 k-space 求 constant DOS",
        formula: tex`$$D_{2\mathrm D}(\varepsilon)=\frac{Agm}{2\pi\hbar^2}\equiv D_0,\qquad N(T=0)=D_0\varepsilon_F\quad\Longrightarrow\quad D_0=\frac{N}{\varepsilon_F}$$`,
        explanation:
          "环带态数 A g·2πkdk/(2π)² 与 dε=(ℏ²k/m)dk 中的 k 正好相消，所以 DOS 不依赖 ε。",
      },
      {
        title: "精确完成 fixed-N number integral",
        formula: tex`$$N=D_0\int_0^{\infty}\frac{d\varepsilon}{e^{\beta(\varepsilon-\mu)}+1}=D_0k_{\mathrm B}T\ln\!\left(1+e^{\beta\mu}\right)$$`,
        explanation:
          "令 x=β(ε−μ)，或直接验证 antiderivative −kBT ln[1+e^{-β(ε−μ)}]，上下限相减得到该式。",
      },
      {
        title: "用 N=D0εF 解 chemical potential",
        formula: tex`$$\varepsilon_F=k_{\mathrm B}T\ln\!\left(1+e^{\beta\mu}\right)\quad\Longrightarrow\quad e^{\varepsilon_F/(k_{\mathrm B}T)}=1+e^{\beta\mu}\quad\Longrightarrow\quad \mu=k_{\mathrm B}T\ln\!\left(e^{\varepsilon_F/(k_{\mathrm B}T)}-1\right)$$`,
        explanation:
          "这是二维 constant DOS 的 exact result。低温时 μ−εF=kBTln(1−e^{-εF/(kBT)})，偏离 εF 只有指数小。",
      },
      {
        title: "对 energy integral 使用 Sommerfeld expansion",
        formula: tex`$$U=D_0\int_0^{\infty}\varepsilon f(\varepsilon)\,d\varepsilon\approx D_0\left[\frac{\mu^2}{2}+\frac{\pi^2}{6}(k_{\mathrm B}T)^2\right]$$`,
        explanation:
          "这里 weight φ(ε)=D0ε，故 φ′=D0。二维 μ 与 εF 的差在低温是 exponential，而非普通 T² correction，所以在代数阶可令 μ≈εF。",
      },
      {
        title: "对 T 求导得到低温 heat capacity",
        formula: tex`$$\frac{U}{N}\approx\frac{\varepsilon_F}{2}+\frac{\pi^2}{6}\frac{(k_{\mathrm B}T)^2}{\varepsilon_F},\qquad \frac{C_V}{N}=\frac{\pi^2}{3}k_{\mathrm B}\frac{k_{\mathrm B}T}{\varepsilon_F}=\frac{\pi^2}{3}k_{\mathrm B}\frac{T}{T_F}$$`,
        explanation:
          "第一项是 T=0 Fermi sea energy，只有第二项贡献 leading heat capacity。与三维相同都线性于 T，但 coefficient 不同。",
      },
      {
        title: "直接验证 μ 两侧的 particle-hole 对称",
        formula: tex`$$f(\mu+\delta)=\frac{1}{e^{\beta\delta}+1},\qquad 1-f(\mu-\delta)=1-\frac{1}{e^{-\beta\delta}+1}=\frac{1}{e^{\beta\delta}+1}$$`,
        explanation:
          "因此 chemical potential 上方距 δ 的 occupation probability，等于下方距 δ 的 vacancy probability；此恒等式不需要低温近似。",
      },
      {
        title: "由 grand potential 的分部积分得到 PA=U",
        formula: tex`$$\Phi_G=-k_{\mathrm B}TD_0\int_0^{\infty}d\varepsilon\,\ln\!\left(1+ze^{-\beta\varepsilon}\right)=-D_0\int_0^{\infty}d\varepsilon\,\varepsilon f(\varepsilon)=-U,\qquad \Phi_G=-PA\quad\Longrightarrow\quad PA=U$$`,
        explanation:
          "边界项在 ε=0 与 ∞ 都消失。这个等式也可写成 quadratic dispersion 的 scale relation P=(2/d)U/A，在 d=2 时即 PA=U。",
      },
      {
        title: "汇总 exact 与 low-temperature results",
        formula: tex`$$\mu=k_{\mathrm B}T\ln\!\left(e^{\varepsilon_F/(k_{\mathrm B}T)}-1\right);\quad \frac{C_V}{Nk_{\mathrm B}}\approx\frac{\pi^2}{3}\frac{T}{T_F};\quad f(\mu+\delta)=1-f(\mu-\delta);\quad PA=U$$`,
        explanation:
          "只有 CV 一项带低温近似符号；μ、Fermi-function symmetry 与 PA=U 在上述 ideal 2D continuum assumptions 下是精确关系。",
      },
    ],
    conclusion: tex`$$\mu=k_{\mathrm B}T\ln\!\left(e^{\varepsilon_F/(k_{\mathrm B}T)}-1\right);\quad \frac{C_V}{Nk_{\mathrm B}}\approx\frac{\pi^2}{3}\frac{T}{T_F};\quad f(\mu+\delta)=1-f(\mu-\delta);\quad PA=U$$`,
    checks: [
      "T→0 时 μ→εF 且 CV→0；μ 的 correction 应是 exponential，不应误写成三维的 T² shift。",
      "constant DOS 给 U(T=0)/N=εF/2；若得到 3εF/5，说明误用了三维 DOS。",
      "f(μ+δ) 与 1−f(μ−δ) 都应落在 0 到 1 之间，并在 δ=0 时等于 1/2。",
      "PA 与 U 都具有能量单位；若写 PV=U，必须明确二维的 V 在这里就是 area A。",
    ],
    evidence: [
      "作业 3 Q4(a–e)",
      "作业 3 答案 pp. 15–19（εF、exact μ、grand potential、PA=U、Sommerfeld CV 与 occupation-vacancy symmetry）",
      "课件 9 slides 20–21、25–30（ideal Fermi gas thermodynamics 与 low-temperature Sommerfeld chain）",
    ],
  },
};
