# `course-package/v1` 四课程联动协议

这里定义 PHY301 总控与 PHY408、PHY309、MAT107 三个独立项目之间唯一的机器交接协议。三个项目并行制作和自测，总控只读取各自的本地 `course-package/`，复验后统一部署。课程项目不需要互相读取源码、共享聊天历史或接触服务器密码、SSH 私钥、维护令牌、DNS、Nginx 和 systemd。

统一派发提示词位于 [`../other-course-project-prompts.md`](../other-course-project-prompts.md)。该文件中的 `schemaVersion: "course-package/v1"` 嵌套 manifest 是唯一合同；本目录不保留兼容旧 manifest 的第二套解释。

## 交付面与可重建工程

每个课程项目最终必须有这些固定交付文件：

```text
course-package/
├── manifest.json
├── site/
│   ├── index.html
│   └── ...全部线上静态资源和下载文件
├── source-coverage.json
├── qa-report.json
├── checksums.sha256
└── README.md
```

`course-package/` 可以同时是可重建工程根，因此允许保留 `src/`、`tools/`、`node_modules/`、生成缓存等开发文件。它们不属于交付面，不被总控信任、扫描、哈希或上传。真正的交付面只有：

- `manifest.json` 和上述固定根证据文件；
- `site/**`；
- manifest 中每个 `tests[].evidence` 指向的收据；
- `checksums.sha256` 主动列入的其他证据文件。

这条边界让现有课程工程可以增量收口，无需删除开发依赖；同时确保服务器只收到 `site/` 与一份部署 manifest。`site/**` 内禁止符号链接、凭据和特殊文件。

## 唯一 manifest 结构

完整样例见 [`manifest.example.json`](manifest.example.json)。核心结构必须与统一派发提示词一致：

| 对象 | 必须满足的门槛 |
| --- | --- |
| `schemaVersion` | 固定为 `course-package/v1` |
| `course` | `code`、`nameZh`、`nameEn`、`slug`、`route`；code/slug/route 必须匹配中央白名单 |
| `artifact` | `kind=static-site`、`entry=site/index.html`、`basePath=course.route`、`apiBase=/api/v1`、`localFallback=true` |
| `build` | 非空构建命令、工作目录、输出目录，以及带时区的 ISO-8601 `builtAt` |
| `inventory` | 七个计数字段均为真实的非负整数；可部署包至少有 1 个来源、1 个学习节点，并至少含原始页或考核题之一，不能用全 0 冒充完整 |
| `coverage` | 三组 mapped/total 与 inventory 对齐；可部署包必须全部 mapped=total |
| `files` | 固定指向 `site/`、`source-coverage.json`、`qa-report.json`、`checksums.sha256`、`README.md` |
| `tests` | 至少一项；包含 name、实际 command、`status: passed` 与非空 evidence 文件 |
| `rights` | 写明授权/来源依据；redistribution 只能为 `course-site-only`、`restricted` 或 `unknown` |
| `limitations` | 字符串数组；没有则 `[]`，不能用虚构的“完整”掩盖缺失材料 |

可选顶层字段 `packageSha256` 用于固定一次交付。它必须是验证器计算的 64 位小写 SHA-256；不填写也可以部署。摘要覆盖：去掉 `packageSha256` 后的规范化 manifest，以及交付面中除 `manifest.json`、`checksums.sha256` 外的全部文件。排除这两项是为了避免自引用；最终 manifest 本身仍由 `checksums.sha256` 校验。

课程和路由白名单在 [`allowed-courses.json`](allowed-courses.json)：

| code | slug | route |
| --- | --- | --- |
| PHY301 | phy301 | `/phy301/` |
| PHY408 | phy408 | `/phy408/` |
| PHY309 | phy309 | `/phy309/` |
| MAT107 | mat107 | `/mat107/` |

未知 code、借用另一门课的 slug/route、任意服务器路径都会被拒绝。新增第五门课必须由总控同时审查白名单、Nginx、API 注册和总站导航，不能只改 manifest 绕过。

## 三类证据门

`source-coverage.json` 必须逐项记录每个真实来源的相对路径、SHA-256、类型、页数或题数、映射节点和输出，不能只写汇总百分比。验证器接受顶层数组，或对象中的 `items`、`sources`、`files`、`records`、`mappings` 数组；记录数不得少于 `inventory.sourceFiles`。

`qa-report.json` 必须是 JSON 对象，且至少有两个非空对象区段。两段都要明确给出通过状态（`pass`、`passed` 或 `pass_with_notes`/`passed_with_notes`，大小写不敏感）；`failed`、`partial`、`not-run` 等非通过状态不能部署：

- `mechanical`：构建、类型、测试、链接、文件、公式、静态基路径、桌面/390px 交互等可机械复查结果；
- `content`：翻译忠实度、概念正确性、先修和顺序、逐题覆盖、随机抽查、已知资料缺口。

`tests[].status` 全部为 `passed` 才是可部署包，且每项 evidence 必须指向包内非空普通文件。验证器只检查收据，不会自动执行 manifest 中未经中央审查的命令；总控随后可以重跑安全、可重复的命令。

`checksums.sha256` 使用常见格式：

```text
7ad5509fac1a...  manifest.json
2b956dbe8f6a...  site/index.html
```

它必须覆盖整个交付面并排除自身，至少包括 manifest、四个固定证据/说明文件与 `site/**`。可以额外列入测试日志或其他 QA 证据；一旦列入，该文件也会进入交付摘要和凭据扫描。未声明的 `src/`、`tools/`、`node_modules/` 不需要进入 checksums，也不会部署。

## 课程项目收口步骤

1. 审计并复用已有成品，只补派发提示词指出的缺口。
2. 构建 `site/`，确认所有链接使用本课程 base path 或可迁移相对路径。
3. 运行课程自己的构建、类型、内容覆盖、数学渲染、桌面与 390px 交互检查。
4. 写入逐项 `source-coverage.json` 和机械/内容分离的 `qa-report.json`。
5. 最后生成覆盖交付面的 `checksums.sha256`；如果加入 `packageSha256`，须更新 manifest 后重新生成 checksums。
6. 用中央同一验证器做离线检查：

```bash
python3 /Users/gaoyouyang/Documents/PHY301/coordination/integration/validate_course_package.py \
  /绝对路径/课程项目/course-package
```

成功示例：

```text
VALID PHY408 /phy408/ files=128 sha256=0123abcd...
```

随后按派发提示词返回完整 `COURSE_HANDOFF_V1` 回执。最重要的是 `packageRoot`、`manifestPath`、mechanicalQA、contentQA、实际命令证据和 limitations；回执中不得包含任何秘密。

旧格式课程包不会被“猜测兼容”为通过。对应项目必须按派发提示词增量生成五个固定根文件并升级 manifest，然后再交总控。这样可以暴露遗漏，而不会把旧字段静默误读为新合同。

## 总控复验与部署

[`course-projects.json`](course-projects.json) 是本机三门外部课程的机器注册表；PHY301 作为第四门课程与总控本身，不需要伪装成外部交付包。注册表固定记录每门课的绝对 `packageRoot`、code、slug、route 和是否启用；`threadId` 只帮助人类找到对应聊天，验证与部署绝不依赖聊天记录。

日常只需在 PHY301 项目运行这一条纯本地命令。它会并行检查所有启用课程，逐课程显示结果，并把完整 JSON 收据写到已忽略版本控制的 `.codex-local/course-coordinator/`；一门失败不会挡住另外两门完成验证：

```bash
python3 coordination/integration/orchestrate_courses.py
```

需要只复验一门时可重复使用 `--course`（接受 code 或 slug）：

```bash
python3 coordination/integration/orchestrate_courses.py --course PHY408
```

三门包准备好后，总控一次并行部署全部验证通过的课程。失败课程不会被部署，也不会阻止其他已通过课程上线；只要任一课程失败，整次命令仍以非零状态结束，供自动化明确识别：

```bash
COURSE_HUB_AUTH_TOKEN="$TOKEN_FROM_PASSWORD_MANAGER" \
  python3 coordination/integration/orchestrate_courses.py \
  --deploy \
  --target ubuntu@course-hub \
  --origin https://gaoyouyang.site
unset COURSE_HUB_AUTH_TOKEN
```

总控 CLI 只会调用中央 `validate_course_package.py` 和验证通过后的中央 `deploy-course-package.sh`，不会运行各项目 manifest 中声明的命令，也不会读取、打印或写入维护令牌；部署脚本仅从继承环境取得令牌。需要固定收据位置时使用 `--receipt /绝对路径/receipt.json`。

底层单包调试仍可直接执行：

```bash
python3 coordination/integration/validate_course_package.py \
  /绝对路径/PHY408/course-package
```

验证失败时把具体错误退回原课程项目；不得为了部署方便在总控伪造它的内容 QA。验证通过后，只有总控读取维护令牌：

```bash
COURSE_HUB_AUTH_TOKEN="$TOKEN_FROM_PASSWORD_MANAGER" \
  bash deploy/scripts/deploy-course-package.sh \
  --package /绝对路径/PHY408/course-package \
  --target ubuntu@course-hub \
  --origin https://gaoyouyang.site
unset COURSE_HUB_AUTH_TOKEN
```

部署脚本会先在课程项目的实时目录运行同一验证器，再把该次 manifest 声明的交付面复制到权限隔离的本地临时快照；快照会由同一验证器完整复验并转为只读。后续摘要、默认 release ID、`site/` 上传和部署 manifest 全部只读取这一个快照，不再读取仍可能被课程项目写入的实时目录。若实时目录在首次验证后发生变化，快照要么以变化后的自洽内容取得新摘要，要么复验失败并在任何网络操作前停止，因此不会出现“旧摘要标记新内容”的竞态。远端仍只收到快照中的 `site/` 和 manifest，然后：

1. 以快照的完整包摘要作为默认 release ID，写入不可变 release 和摘要收据；同一大包中断后重跑会回到同一 `.incoming` 并续传；
2. 原子切换该课程的 `current` symlink；
3. 进行服务器本地检查和带维护令牌的外部 HTTPS 检查；
4. 任一检查失败时恢复上一 release；旧 release 不删除。

维护令牌只存在于总控环境与权限 `0600` 的临时 curl header 中；脚本也从本地快照、验证器以及所有 ssh/rsync 子进程环境移除它。只读快照、文件清单和 header 都由退出 trap 精确清理；课程项目和交付包永远不接触令牌。

## 并行工作与防踩踏门

```text
PHY408 ──制作/自测──┐
PHY309 ──制作/自测──┼─> course-package/v1 离线门 ─> 各自独立 release ─> 总站最终验收
MAT107 ──制作/自测──┘
```

- 三项目可同时写自己的工作区；不存在共享写目录。
- 三个离线验证可同时运行，不访问网络或秘密。
- 不同课程可同时部署，因为服务器 release 根与中央锁按 slug 隔离。
- 同一课程部署必须串行；中央脚本检测到已有本地锁会拒绝第二次，服务器激活另有 per-course `flock`。
- 某一课程未过门不影响另外两门继续制作或上线，也不会覆盖其 current。
- 三门课程各自通过线上地址后，最后再单独更新总站导航；总站发布不混入课程构建。
- “生成完成”“机械 QA”“内容 QA”“线上部署”是四张不同收据，任何一张不能代替另一张。

## 协议自身测试

```bash
python3 -m unittest discover \
  -s coordination/integration/tests \
  -p 'test_*.py' -v

bash -n deploy/scripts/deploy-course-package.sh
```

测试只使用临时目录，不执行包里的构建命令、不登录服务器、不读取密码，也不修改三个课程的现有成品。
