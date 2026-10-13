# 三门课程项目联动派发包

下面三段提示词是相互独立、可直接复制的完整任务。把对应代码块原样发送到该课程自己的 Codex 项目即可；不需要把服务器密码、IP、SSH 私钥或 PHY301 项目文件复制过去。

三个课程项目只负责完成自己的课程内容、学习站、质量检查和标准化 `course-package/`。PHY301 总控项目收到最终回执后，统一做二次验收、接入总入口、部署和回滚。这样可以并行工作，又不会让几个项目同时改服务器而相互覆盖。

> 重要：项目如果已经做了一部分，不要从头重做。先审计现有成果，保留正确部分，只补缺口；最终仍须按统一交付协议收口。

---

## 1. 派发给 PHY408 — Data Intensive Science

```text
你现在负责完成这个项目中的 PHY408（Data Intensive Science）学习站。请把现有成果继续做到可交付状态，不要只给计划，也不要在已有成品正确时推倒重来。

【学习目标】
我基础不牢，许多内容可能完全陌生。目标不是让你赶工，而是让我用尽可能短的学习时间，沿着合理顺序真正学会老师要求的全部内容。网站以中文讲解为主，保留准确英文术语；不能默认我已经掌握 Python、线性代数、概率统计、数值计算、数据处理或机器学习。

【开始前】
1. 先读本项目中的 AGENTS.md、README 和构建说明；若使用 Next.js，必须先读当前项目 node_modules/next/dist/docs/ 中与本项目相关的指南，不要凭旧版 Next.js 经验改代码。
2. 扫描全部课件、作业、答案、讲义、代码、Notebook、数据集、课程大纲和考试材料，同时盘点现有网站与已生成的中英课件。
3. 不覆盖、删除或改写老师的原始文件。已有成果先审计再复用；所有“完成/100%”结论必须有清单和测试证据。

【课程内容与教学顺序】
1. 建立可追溯覆盖矩阵：原始文件/页码/题号 -> 知识点 -> 学习节点 -> 示例/练习 -> 作业或考试考点。逐文件、逐页、逐题登记；没有答案的材料也要登记并标为“无官方答案”，不能凭空称为官方答案。
2. 依据真实课程材料反向设计依赖树。至少检查并按需要补齐：Python 基础、Jupyter、NumPy/Pandas/绘图、命令行与文件格式、向量与矩阵、微积分、概率统计、误差与数值稳定性、数据清洗、可视化、回归、分类、降维、聚类、模型验证、过拟合与可复现科学计算。这是检查清单，不是替代老师大纲的通用目录。
3. 顺序必须由浅入深，后置节点只能依赖已讲过的内容。每个节点至少包含：为什么学、先修、直觉、严格定义、符号/单位、最小示例、可运行代码或伪代码、图表解读、常见误区、与前后节点的连接、闭卷检查题、答案、掌握门槛和进一步阅读。大内容可折叠，但不能把必要铺垫藏到后面。
4. Notebook/代码示例必须注明环境、依赖、输入数据、预期输出和随机种子；不能把过期输出截图当作已运行证据。数据缺失、绝对路径、只在作者机器可运行、训练时间过长或结果不可复现，都要修正或明确写入限制项。
5. 逐题覆盖作业与考试资料，标明每题所需前置节点、解题策略、完整过程、易错点和同型变式。不得只给答案，也不得用网站自编题代替老师原题覆盖。

【原始课件与中英精讲版】
1. 每张原始英文页必须完整保留，紧随其后插入一页或多页中文忠实翻译、入门解释、公式/代码/图表解读、术语和易错点；不得仅做摘要、截图合集或漏页。
2. 有原始 PPTX 时优先保留 PPTX，检查动画、叠加图层、GIF、媒体、嵌入对象和讲者备注。不要把 PDF 渲染图伪装成“保留了原始动画/图层”的 PPTX。
3. 若项目实际只收到 PDF 或图片，必须保留原始视觉内容并明确标注“未收到可编辑 PPTX，无法恢复原始动画、叠加图层、媒体和备注”；这属于来源限制，不能悄悄补造。
4. 输出逐页映射、原件与交付件 SHA-256；随机人工抽查不少于全部原始页的 10%，并记录抽查页码和结论。

【学习站】
1. 必须包含：课程总览、先修诊断、依赖学习树、按周路线、知识正文、作业/考试索引、原始资料与中英精讲版下载、搜索、完成进度、节点笔记、问题清单和断点续学。
2. 数学表达式统一用 LaTeX/KaTeX 正确渲染；代码有语法高亮和复制功能；图表说明坐标、变量、结论和可能误读。自动检查裸露的 LaTeX、KaTeX 错误、损坏链接和丢失资源。
3. 桌面与手机都要阅读友好。至少实测 1440px 和 390px：导航、学习树、表格、公式、代码、下载按钮、展开内容、问题入口均可用，无页面级横向溢出；键盘可达且焦点可见。
4. 进度、笔记和问题通过前端数据适配层保存；本地可回退 localStorage，生产使用相对地址 `/api/v1`。Cookie 会话下先同源读取 `GET /api/v1/session` 的 `csrfToken`，所有 PUT/POST/PATCH/DELETE 都发送 `X-CSRF-Token`；学习状态首次创建用 `If-None-Match: *`，已有记录才用服务端 ETag/`If-Match` 防覆盖。不要硬编码域名、服务器 IP、账号或密钥，也不要把维护 Bearer 令牌放进前端。API 不可用时仍须能读课和保存本地进度。
5. 固定标识：code=`PHY408`，slug=`phy408`，route=`/phy408/`。所有站内链接和资源必须兼容 `/phy408/` 基路径，不得假设部署在域名根目录。

【统一交付目录】
在项目根目录生成以下结构；目录名和文件名不得自行改名：

course-package/
  manifest.json
  site/index.html
  source-coverage.json
  qa-report.json
  checksums.sha256
  README.md

`site/` 必须是已经构建好的静态产物，可由 Nginx 直接托管，不能依赖开发服务器。下载资料也须位于 `site/` 内或使用可迁移相对路径。

`manifest.json` 必须是无注释的有效 JSON，严格采用以下字段结构；数字填写真实值，未知或未验证的内容不可写成 100%：

{
  "schemaVersion": "course-package/v1",
  "course": {
    "code": "PHY408",
    "nameZh": "数据密集型科学",
    "nameEn": "Data Intensive Science",
    "slug": "phy408",
    "route": "/phy408/"
  },
  "artifact": {
    "kind": "static-site",
    "entry": "site/index.html",
    "basePath": "/phy408/",
    "apiBase": "/api/v1",
    "localFallback": true
  },
  "build": {
    "command": "实际构建命令",
    "workingDirectory": ".",
    "outputDir": "实际构建输出目录",
    "builtAt": "ISO-8601 时间"
  },
  "inventory": {
    "sourceFiles": 0,
    "slideDecks": 0,
    "originalSlides": 0,
    "translationExplanationSlides": 0,
    "assessmentFiles": 0,
    "assessmentItems": 0,
    "learningNodes": 0
  },
  "coverage": {
    "sourceFilesMapped": 0,
    "sourceFilesTotal": 0,
    "originalSlidesMapped": 0,
    "originalSlidesTotal": 0,
    "assessmentItemsMapped": 0,
    "assessmentItemsTotal": 0
  },
  "files": {
    "site": "site/",
    "coverage": "source-coverage.json",
    "qa": "qa-report.json",
    "checksums": "checksums.sha256",
    "readme": "README.md"
  },
  "tests": [
    {"name": "build", "command": "实际命令", "status": "passed|failed|not-run", "evidence": "日志或报告中的相对路径"}
  ],
  "rights": {
    "basis": "记录用户所述的课程资料使用授权及素材来源，不额外扩大版权结论",
    "redistribution": "course-site-only|restricted|unknown"
  },
  "limitations": []
}

`source-coverage.json` 须逐项列出相对源路径、SHA-256、类型、页数/题数、对应节点和输出文件，不能只放汇总百分比。`qa-report.json` 须把 `mechanical`（构建、链接、文件、公式、类型检查等）与 `content`（翻译忠实度、解释正确性、教学顺序、题目覆盖、抽查记录）分开报告。`checksums.sha256` 必须覆盖合同交付面中除自身外的文件：`manifest.json`、固定根证据、`site/**` 和测试收据；可重建工程里的 `src/`、`tools/`、`node_modules/` 不需要纳入，也不会被部署。`README.md` 说明本地预览、构建、测试、基路径、API 回退和已知限制。

【必须特别防止的漏项】
- 原 PPTX 的动画/叠加图层/媒体被 PDF 或截图覆盖后仍声称完整保留。
- 公式以 `$...$`、`\(...\)` 或原始命令裸露，或 KaTeX 构建无报错但页面实际不可读。
- 手机端表格、公式、代码块、下载按钮溢出屏幕，导航或学习树无法操作。
- 只统计课件页数，不覆盖作业/答案/考试的每一道小题。
- 学习节点顺序照搬文件顺序，导致定义、数学工具或编程基础在使用后才讲。
- 图表、模型指标和代码输出没有解释“怎么看、为什么、有什么限制”。
- 把没有收到的答案、动画、源代码、数据或期末资料默认为存在。
- 对第三方图片、教材页或数据集作未经证据支持的版权承诺。老师资料可按用户说明用于本站，但仍要记录来源、授权依据与公开限制。

【验收与边界】
1. 运行并记录实际构建、类型检查、lint、测试、链接检查、公式检查和内容覆盖检查；不能只写“已通过”。桌面与 390px 手机都要做截图或可复查的视觉 QA 记录。
2. 只有逐文件、逐页、逐题核对完成时才能写覆盖率 100%；否则如实写明缺口、影响和下一步，不得伪造满覆盖。
3. 可并行使用子代理，但最终必须统一术语、去重、交叉复核并由主代理验收。
4. 不要登录或修改共享服务器，不要部署，不要改 DNS、Nginx、HTTPS、systemd 或共享数据库；不要索取、搜索、打印或保存服务器密码、IP、SSH 私钥、令牌以及其他项目的账号信息。此项目只产出本地标准交付包。
5. 不要上传 GitHub 或其他公开平台。总控项目会在复验后统一部署。

【完成时的唯一回执格式】
完成后请在最终回复中原样使用下面格式，用真实的绝对路径和真实测试结果替换内容。绝对路径用于同一台电脑上的总控项目定位；不要把任何秘密放进回执。

COURSE_HANDOFF_V1
status: READY | PARTIAL | BLOCKED
course: PHY408
projectRoot: /绝对路径/到/PHY408项目
packageRoot: /绝对路径/到/PHY408项目/course-package
manifestPath: /绝对路径/到/PHY408项目/course-package/manifest.json
siteEntry: /绝对路径/到/PHY408项目/course-package/site/index.html
gitCommit: 提交哈希或 NOT_COMMITTED
mechanicalQA: PASS | PARTIAL | FAIL
contentQA: PASS | PARTIAL | FAIL
commandsRun:
  - 命令 -> exit code / 结果 / 证据路径
coverage:
  sourceFiles: 已映射/总数
  originalSlides: 已映射/总数
  assessmentItems: 已映射/总数
limitations:
  - 无则写 none；否则逐条写清
coordinatorAction: 请 PHY301 总控项目读取 manifest，独立验证后再接入；本项目未部署、未接触秘密。

现在立即审计现有成果并继续实现，直到交付包与回执都完成。不要仅回复建议、框架或“已经做得差不多”。
```

---

## 2. 派发给 PHY309 — Photonics and Optoelectronics

```text
你现在负责完成这个项目中的 PHY309（Photonics and Optoelectronics）学习站。请把现有成果继续做到可交付状态，不要只给计划，也不要在已有成品正确时推倒重来。

【学习目标】
我基础不牢，许多内容可能完全陌生。目标不是让你赶工，而是让我用尽可能短的学习时间，沿着合理顺序真正学会老师要求的全部内容。网站以中文讲解为主，保留准确英文术语；不能默认我已经熟练掌握复数、微积分、微分方程、电磁学、波动光学、量子物理或半导体物理。

【开始前】
1. 先读本项目中的 AGENTS.md、README 和构建说明；若使用 Next.js，必须先读当前项目 node_modules/next/dist/docs/ 中与本项目相关的指南，不要凭旧版 Next.js 经验改代码。
2. 扫描全部课件、作业、答案、讲义、实验、仿真、课程大纲和考试材料，同时盘点现有网站与已生成的中英课件。
3. 不覆盖、删除或改写老师的原始文件。已有成果先审计再复用；所有“完成/100%”结论必须有清单和测试证据。

【课程内容与教学顺序】
1. 建立可追溯覆盖矩阵：原始文件/页码/题号 -> 定律、概念或器件 -> 学习节点 -> 推导/算例 -> 作业或考试考点。逐文件、逐页、逐题登记；没有答案的材料也要登记并标为“无官方答案”，不能凭空称为官方答案。
2. 依据真实课程材料反向设计依赖树。至少检查并按需要补齐：复数与相量、向量微积分、常微分方程、Maxwell 方程、边界条件、平面波、偏振、干涉与衍射、傅里叶光学、几何光学、能带与载流子、光与物质相互作用。这是检查清单，不是替代老师大纲的通用目录。
3. 顺序必须由浅入深，后置节点只能依赖已讲过的内容。每个节点至少包含：为什么学、先修、物理图像、严格定义与逐步推导、符号与 SI 单位、采用的假设、适用条件、极限情况、示意图、最小算例、常见误区、与前后节点的连接、闭卷检查题、答案、掌握门槛和进一步阅读。大内容可折叠，但不能把必要铺垫藏到后面。
4. 每次推导说明用了哪条定律、边界条件和近似；矢量/标量、复振幅/实场、相位约定、角频率/频率、强度/振幅不得混用。器件或光路图必须说明材料、几何、传播方向、输入、输出和工作机制。
5. 逐题覆盖作业、实验和考试资料，标明每题所需前置节点、解题策略、完整过程、单位检查、物理解读、易错点和同型变式。不得只给答案，也不得用网站自编题代替老师原题覆盖。

【原始课件与中英精讲版】
1. 每张原始英文页必须完整保留，紧随其后插入一页或多页中文忠实翻译、物理直觉、公式逐项解释、图像/器件结构解读、术语和易错点；不得仅做摘要、截图合集或漏页。
2. 有原始 PPTX 时优先保留 PPTX，检查动画、叠加图层、GIF、媒体、嵌入对象和讲者备注。不要把 PDF 渲染图伪装成“保留了原始动画/图层”的 PPTX。
3. 若项目实际只收到 PDF 或图片，必须保留原始视觉内容并明确标注“未收到可编辑 PPTX，无法恢复原始动画、叠加图层、媒体和备注”；这属于来源限制，不能悄悄补造。
4. 输出逐页映射、原件与交付件 SHA-256；随机人工抽查不少于全部原始页的 10%，并记录抽查页码和结论。

【学习站】
1. 必须包含：课程总览、先修诊断、依赖学习树、按周路线、知识正文、推导索引、器件/现象索引、作业/实验/考试索引、原始资料与中英精讲版下载、搜索、完成进度、节点笔记、问题清单和断点续学。
2. 数学表达式统一用 LaTeX/KaTeX 正确渲染；矢量、复振幅、相位、单位、上下标和积分范围必须准确；自动检查裸露 LaTeX、KaTeX 错误、损坏链接和丢失资源。
3. 桌面与手机都要阅读友好。至少实测 1440px 和 390px：导航、学习树、表格、公式、器件图、下载按钮、展开内容、问题入口均可用，无页面级横向溢出；键盘可达且焦点可见。
4. 进度、笔记和问题通过前端数据适配层保存；本地可回退 localStorage，生产使用相对地址 `/api/v1`。Cookie 会话下先同源读取 `GET /api/v1/session` 的 `csrfToken`，所有 PUT/POST/PATCH/DELETE 都发送 `X-CSRF-Token`；学习状态首次创建用 `If-None-Match: *`，已有记录才用服务端 ETag/`If-Match` 防覆盖。不要硬编码域名、服务器 IP、账号或密钥，也不要把维护 Bearer 令牌放进前端。API 不可用时仍须能读课和保存本地进度。
5. 固定标识：code=`PHY309`，slug=`phy309`，route=`/phy309/`。所有站内链接和资源必须兼容 `/phy309/` 基路径，不得假设部署在域名根目录。

【统一交付目录】
在项目根目录生成以下结构；目录名和文件名不得自行改名：

course-package/
  manifest.json
  site/index.html
  source-coverage.json
  qa-report.json
  checksums.sha256
  README.md

`site/` 必须是已经构建好的静态产物，可由 Nginx 直接托管，不能依赖开发服务器。下载资料也须位于 `site/` 内或使用可迁移相对路径。

`manifest.json` 必须是无注释的有效 JSON，严格采用以下字段结构；数字填写真实值，未知或未验证的内容不可写成 100%：

{
  "schemaVersion": "course-package/v1",
  "course": {
    "code": "PHY309",
    "nameZh": "光子学与光电子学",
    "nameEn": "Photonics and Optoelectronics",
    "slug": "phy309",
    "route": "/phy309/"
  },
  "artifact": {
    "kind": "static-site",
    "entry": "site/index.html",
    "basePath": "/phy309/",
    "apiBase": "/api/v1",
    "localFallback": true
  },
  "build": {
    "command": "实际构建命令",
    "workingDirectory": ".",
    "outputDir": "实际构建输出目录",
    "builtAt": "ISO-8601 时间"
  },
  "inventory": {
    "sourceFiles": 0,
    "slideDecks": 0,
    "originalSlides": 0,
    "translationExplanationSlides": 0,
    "assessmentFiles": 0,
    "assessmentItems": 0,
    "learningNodes": 0
  },
  "coverage": {
    "sourceFilesMapped": 0,
    "sourceFilesTotal": 0,
    "originalSlidesMapped": 0,
    "originalSlidesTotal": 0,
    "assessmentItemsMapped": 0,
    "assessmentItemsTotal": 0
  },
  "files": {
    "site": "site/",
    "coverage": "source-coverage.json",
    "qa": "qa-report.json",
    "checksums": "checksums.sha256",
    "readme": "README.md"
  },
  "tests": [
    {"name": "build", "command": "实际命令", "status": "passed|failed|not-run", "evidence": "日志或报告中的相对路径"}
  ],
  "rights": {
    "basis": "记录用户所述的课程资料使用授权及素材来源，不额外扩大版权结论",
    "redistribution": "course-site-only|restricted|unknown"
  },
  "limitations": []
}

`source-coverage.json` 须逐项列出相对源路径、SHA-256、类型、页数/题数、对应节点和输出文件，不能只放汇总百分比。`qa-report.json` 须把 `mechanical`（构建、链接、文件、公式、类型检查等）与 `content`（翻译忠实度、解释正确性、教学顺序、题目覆盖、抽查记录）分开报告。`checksums.sha256` 必须覆盖合同交付面中除自身外的文件：`manifest.json`、固定根证据、`site/**` 和测试收据；可重建工程里的 `src/`、`tools/`、`node_modules/` 不需要纳入，也不会被部署。`README.md` 说明本地预览、构建、测试、基路径、API 回退和已知限制。

【必须特别防止的漏项】
- 原 PPTX 的动画/叠加图层/媒体被 PDF 或截图覆盖后仍声称完整保留。
- 公式以 `$...$`、`\(...\)` 或原始命令裸露，或 KaTeX 构建无报错但页面实际不可读。
- 手机端表格、长推导、公式、器件图、下载按钮溢出屏幕，导航或学习树无法操作。
- 只统计课件页数，不覆盖作业、实验、答案和考试的每一道小题。
- 学习节点照搬文件顺序，导致复数/矢量/Maxwell 方程/边界条件在应用后才讲。
- 漏写单位、坐标系、符号约定、近似条件或有效范围，使公式看似正确但无法使用。
- 把没有收到的答案、动画、实验数据、仿真文件或期末资料默认为存在。
- 对第三方图片、教材页或器件资料作未经证据支持的版权承诺。老师资料可按用户说明用于本站，但仍要记录来源、授权依据与公开限制。

【验收与边界】
1. 运行并记录实际构建、类型检查、lint、测试、链接检查、公式检查和内容覆盖检查；不能只写“已通过”。桌面与 390px 手机都要做截图或可复查的视觉 QA 记录。
2. 只有逐文件、逐页、逐题核对完成时才能写覆盖率 100%；否则如实写明缺口、影响和下一步，不得伪造满覆盖。
3. 可并行使用子代理，但最终必须统一术语、去重、交叉复核并由主代理验收。
4. 不要登录或修改共享服务器，不要部署，不要改 DNS、Nginx、HTTPS、systemd 或共享数据库；不要索取、搜索、打印或保存服务器密码、IP、SSH 私钥、令牌以及其他项目的账号信息。此项目只产出本地标准交付包。
5. 不要上传 GitHub 或其他公开平台。总控项目会在复验后统一部署。

【完成时的唯一回执格式】
完成后请在最终回复中原样使用下面格式，用真实的绝对路径和真实测试结果替换内容。绝对路径用于同一台电脑上的总控项目定位；不要把任何秘密放进回执。

COURSE_HANDOFF_V1
status: READY | PARTIAL | BLOCKED
course: PHY309
projectRoot: /绝对路径/到/PHY309项目
packageRoot: /绝对路径/到/PHY309项目/course-package
manifestPath: /绝对路径/到/PHY309项目/course-package/manifest.json
siteEntry: /绝对路径/到/PHY309项目/course-package/site/index.html
gitCommit: 提交哈希或 NOT_COMMITTED
mechanicalQA: PASS | PARTIAL | FAIL
contentQA: PASS | PARTIAL | FAIL
commandsRun:
  - 命令 -> exit code / 结果 / 证据路径
coverage:
  sourceFiles: 已映射/总数
  originalSlides: 已映射/总数
  assessmentItems: 已映射/总数
limitations:
  - 无则写 none；否则逐条写清
coordinatorAction: 请 PHY301 总控项目读取 manifest，独立验证后再接入；本项目未部署、未接触秘密。

现在立即审计现有成果并继续实现，直到交付包与回执都完成。不要仅回复建议、框架或“已经做得差不多”。
```

---

## 3. 派发给 MAT107 — Probability Theory

```text
你现在负责完成这个项目中的 MAT107（Probability Theory）学习站。请把现有成果继续做到可交付状态，不要只给计划，也不要在已有成品正确时推倒重来。

【学习目标】
我基础不牢，许多内容可能完全陌生。目标不是让你赶工，而是让我用尽可能短的学习时间，沿着合理顺序真正学会老师要求的全部内容。网站以中文讲解为主，保留准确英文术语；不能默认我已经熟练掌握集合、逻辑、计数、级数、微积分、二重积分或严谨证明。

【开始前】
1. 先读本项目中的 AGENTS.md、README 和构建说明；若使用 Next.js，必须先读当前项目 node_modules/next/dist/docs/ 中与本项目相关的指南，不要凭旧版 Next.js 经验改代码。
2. 扫描全部课件、作业、答案、讲义、课程大纲和考试材料，同时盘点现有网站与已生成的中英课件。
3. 不覆盖、删除或改写老师的原始文件。已有成果先审计再复用；所有“完成/100%”结论必须有清单和测试证据。

【课程内容与教学顺序】
1. 建立可追溯覆盖矩阵：原始文件/页码/题号 -> 定义、定理或方法 -> 学习节点 -> 证明/例题 -> 作业或考试考点。逐文件、逐页、逐题登记；没有答案的材料也要登记并标为“无官方答案”，不能凭空称为官方答案。
2. 依据真实课程材料反向设计依赖树。至少检查并按需要补齐：集合与映射、命题逻辑、排列组合、二项式定理、求和与级数、单变量/多变量微积分、换元与 Jacobian、严谨证明方法；随后再按真实材料组织样本空间、事件、条件概率、独立性、随机变量、分布、期望方差、联合/条件分布、生成函数与极限定理。这是检查清单，不是替代老师大纲的通用目录。
3. 顺序必须由浅入深，后置节点只能依赖已讲过的内容。每个节点至少包含：为什么学、先修、直觉、严格定义、符号、适用条件、从简单例子到一般形式的推导、反例、常见误区、与前后节点的连接、分层练习、完整答案、掌握门槛和进一步阅读。大内容可折叠，但不能把必要铺垫藏到后面。
4. 证明不能突然跳步：逐步标明定义、定理、代数变形、积分/求和交换和边界条件。离散/连续、概率质量/密度、独立/互斥、条件概率/条件分布、随机变量/实现值等不得混淆。
5. 逐题覆盖作业与考试资料，标明每题所需前置节点、题型识别、完整证明或计算、条件检查、易错点和同型变式。不得只给答案，也不得用网站自编题代替老师原题覆盖。

【原始课件与中英精讲版】
1. 每张原始英文页必须完整保留，紧随其后插入一页或多页中文忠实翻译、概念解释、公式逐项解释、证明补步、例题、术语和易错点；不得仅做摘要、截图合集或漏页。
2. 有原始 PPTX 时优先保留 PPTX，检查动画、叠加图层、GIF、媒体、嵌入对象和讲者备注。不要把 PDF 渲染图伪装成“保留了原始动画/图层”的 PPTX。
3. 若项目实际只收到 PDF 或图片，必须保留原始视觉内容并明确标注“未收到可编辑 PPTX，无法恢复原始动画、叠加图层、媒体和备注”；这属于来源限制，不能悄悄补造。
4. 输出逐页映射、原件与交付件 SHA-256；随机人工抽查不少于全部原始页的 10%，并记录抽查页码和结论。

【学习站】
1. 必须包含：课程总览、先修诊断、依赖学习树、按周路线、定义/定理/证明索引、分布速查、题型索引、作业/考试索引、原始资料与中英精讲版下载、搜索、完成进度、节点笔记、问题清单和断点续学。
2. 数学表达式统一用 LaTeX/KaTeX 正确渲染；事件、随机变量、分布、上下标、积分/求和范围和条件必须准确；自动检查裸露 LaTeX、KaTeX 错误、损坏链接和丢失资源。
3. 桌面与手机都要阅读友好。至少实测 1440px 和 390px：导航、学习树、真值/分布表、长公式、证明、下载按钮、展开内容、问题入口均可用，无页面级横向溢出；键盘可达且焦点可见。
4. 进度、笔记和问题通过前端数据适配层保存；本地可回退 localStorage，生产使用相对地址 `/api/v1`。Cookie 会话下先同源读取 `GET /api/v1/session` 的 `csrfToken`，所有 PUT/POST/PATCH/DELETE 都发送 `X-CSRF-Token`；学习状态首次创建用 `If-None-Match: *`，已有记录才用服务端 ETag/`If-Match` 防覆盖。不要硬编码域名、服务器 IP、账号或密钥，也不要把维护 Bearer 令牌放进前端。API 不可用时仍须能读课和保存本地进度。
5. 固定标识：code=`MAT107`，slug=`mat107`，route=`/mat107/`。所有站内链接和资源必须兼容 `/mat107/` 基路径，不得假设部署在域名根目录。

【统一交付目录】
在项目根目录生成以下结构；目录名和文件名不得自行改名：

course-package/
  manifest.json
  site/index.html
  source-coverage.json
  qa-report.json
  checksums.sha256
  README.md

`site/` 必须是已经构建好的静态产物，可由 Nginx 直接托管，不能依赖开发服务器。下载资料也须位于 `site/` 内或使用可迁移相对路径。

`manifest.json` 必须是无注释的有效 JSON，严格采用以下字段结构；数字填写真实值，未知或未验证的内容不可写成 100%：

{
  "schemaVersion": "course-package/v1",
  "course": {
    "code": "MAT107",
    "nameZh": "概率论",
    "nameEn": "Probability Theory",
    "slug": "mat107",
    "route": "/mat107/"
  },
  "artifact": {
    "kind": "static-site",
    "entry": "site/index.html",
    "basePath": "/mat107/",
    "apiBase": "/api/v1",
    "localFallback": true
  },
  "build": {
    "command": "实际构建命令",
    "workingDirectory": ".",
    "outputDir": "实际构建输出目录",
    "builtAt": "ISO-8601 时间"
  },
  "inventory": {
    "sourceFiles": 0,
    "slideDecks": 0,
    "originalSlides": 0,
    "translationExplanationSlides": 0,
    "assessmentFiles": 0,
    "assessmentItems": 0,
    "learningNodes": 0
  },
  "coverage": {
    "sourceFilesMapped": 0,
    "sourceFilesTotal": 0,
    "originalSlidesMapped": 0,
    "originalSlidesTotal": 0,
    "assessmentItemsMapped": 0,
    "assessmentItemsTotal": 0
  },
  "files": {
    "site": "site/",
    "coverage": "source-coverage.json",
    "qa": "qa-report.json",
    "checksums": "checksums.sha256",
    "readme": "README.md"
  },
  "tests": [
    {"name": "build", "command": "实际命令", "status": "passed|failed|not-run", "evidence": "日志或报告中的相对路径"}
  ],
  "rights": {
    "basis": "记录用户所述的课程资料使用授权及素材来源，不额外扩大版权结论",
    "redistribution": "course-site-only|restricted|unknown"
  },
  "limitations": []
}

`source-coverage.json` 须逐项列出相对源路径、SHA-256、类型、页数/题数、对应节点和输出文件，不能只放汇总百分比。`qa-report.json` 须把 `mechanical`（构建、链接、文件、公式、类型检查等）与 `content`（翻译忠实度、解释正确性、教学顺序、题目覆盖、抽查记录）分开报告。`checksums.sha256` 必须覆盖合同交付面中除自身外的文件：`manifest.json`、固定根证据、`site/**` 和测试收据；可重建工程里的 `src/`、`tools/`、`node_modules/` 不需要纳入，也不会被部署。`README.md` 说明本地预览、构建、测试、基路径、API 回退和已知限制。

【必须特别防止的漏项】
- 原 PPTX 的动画/叠加图层/媒体被 PDF 或截图覆盖后仍声称完整保留。
- 公式以 `$...$`、`\(...\)` 或原始命令裸露，或 KaTeX 构建无报错但页面实际不可读。
- 手机端表格、长公式、证明、下载按钮溢出屏幕，导航或学习树无法操作。
- 只统计课件页数，不覆盖作业、答案和考试的每一道小题。
- 学习节点照搬文件顺序，导致集合、计数、微积分或定义在使用后才讲。
- 证明跳步，省略定理条件，或把独立与互斥、密度与概率、联合与条件概念混淆。
- 把没有收到的答案、动画、题库、证明过程或期末资料默认为存在。
- 对第三方图片、教材页或题库作未经证据支持的版权承诺。老师资料可按用户说明用于本站，但仍要记录来源、授权依据与公开限制。

【验收与边界】
1. 运行并记录实际构建、类型检查、lint、测试、链接检查、公式检查和内容覆盖检查；不能只写“已通过”。桌面与 390px 手机都要做截图或可复查的视觉 QA 记录。
2. 只有逐文件、逐页、逐题核对完成时才能写覆盖率 100%；否则如实写明缺口、影响和下一步，不得伪造满覆盖。
3. 可并行使用子代理，但最终必须统一术语、去重、交叉复核并由主代理验收。
4. 不要登录或修改共享服务器，不要部署，不要改 DNS、Nginx、HTTPS、systemd 或共享数据库；不要索取、搜索、打印或保存服务器密码、IP、SSH 私钥、令牌以及其他项目的账号信息。此项目只产出本地标准交付包。
5. 不要上传 GitHub 或其他公开平台。总控项目会在复验后统一部署。

【完成时的唯一回执格式】
完成后请在最终回复中原样使用下面格式，用真实的绝对路径和真实测试结果替换内容。绝对路径用于同一台电脑上的总控项目定位；不要把任何秘密放进回执。

COURSE_HANDOFF_V1
status: READY | PARTIAL | BLOCKED
course: MAT107
projectRoot: /绝对路径/到/MAT107项目
packageRoot: /绝对路径/到/MAT107项目/course-package
manifestPath: /绝对路径/到/MAT107项目/course-package/manifest.json
siteEntry: /绝对路径/到/MAT107项目/course-package/site/index.html
gitCommit: 提交哈希或 NOT_COMMITTED
mechanicalQA: PASS | PARTIAL | FAIL
contentQA: PASS | PARTIAL | FAIL
commandsRun:
  - 命令 -> exit code / 结果 / 证据路径
coverage:
  sourceFiles: 已映射/总数
  originalSlides: 已映射/总数
  assessmentItems: 已映射/总数
limitations:
  - 无则写 none；否则逐条写清
coordinatorAction: 请 PHY301 总控项目读取 manifest，独立验证后再接入；本项目未部署、未接触秘密。

现在立即审计现有成果并继续实现，直到交付包与回执都完成。不要仅回复建议、框架或“已经做得差不多”。
```

---

## 收到三个回执后怎么联动

把每个项目最终返回的整段 `COURSE_HANDOFF_V1` 回执复制回 PHY301 总控项目即可。总控项目只根据回执中的绝对 `manifestPath` 定位交付物，并应先独立执行以下检查，再决定是否接入：

1. 解析 `manifest.json`，确认 `schemaVersion=course-package/v1`，课程 code、slug、route 唯一且正确。
2. 验证 `checksums.sha256`、`site/index.html`、下载文件和所有 manifest 引用文件。
3. 重跑可重复的构建/测试命令，并把“机械通过”与“内容通过”分开判断。
4. 在临时目录按目标子路径预览，检查没有根路径假设、跨课程写入或硬编码秘密。
5. 只有通过总控复验的包才由总控项目做版本化发布；某一门失败时不得影响其他课程或覆盖现有线上版本。

项目之间不需要互相读取源码、共享聊天记录或共享密码。真正的“打通”依靠统一包结构、机器可读 manifest、绝对路径回执和总控的独立复验，而不是让四个项目同时操作同一台服务器。
