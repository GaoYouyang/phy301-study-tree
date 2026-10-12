# PHY301 重修通关树

这是一个可在本地或静态服务器运行的统计物理学习网站，覆盖必要前置知识、老师 Week 1–14
教学计划、三套作业、2025 期中资料、65 个小问覆盖矩阵、公式地图、勘误、复习队列和错因回退。

正式在线版：<https://gaoyouyang.site/>（需要站点访问密码）

资料库同时保留 10 份老师英文原始 PPTX，以及对应的“中英逐页精讲”
PPTX。精讲版在每张原始页后插入中文翻译、术语说明和难点解释；文件版本
规则与完整清单见 [`public/materials/course-materials-manifest.json`](./public/materials/course-materials-manifest.json)。

学生使用说明请从这里开始：

- [README_从这里开始.md](./README_从这里开始.md)
- 双击 `打开PHY301学习树.command`
- 或运行 `npm run dev` 后打开 `http://localhost:3000`

## 开发与验证

```bash
npm install
npm run dev
npm test
npm run lint
npm run typecheck
```

`npm run build:pages` 会生成带仓库子路径的静态站点，并检查课件、作业、
答案、参考 PDF 与教学计划截图是否完整进入产物。生成结果写入 `docs/`，
GitHub Pages 直接从 `main` 分支的这个目录发布。

## 私密站与 GitHub 可见性

`gaoyouyang.site` 由服务器端统一密码门保护；未登录时，首页、课程深链、
下载与 API 均不可访问。密码明文不进入仓库或服务器磁盘，服务器仅保存
加盐哈希。

历史 GitHub 仓库与 GitHub Pages 是独立的公开副本，服务器密码不会保护
它们。在决定是否关闭 Pages、把仓库转为 private 之前，不应把新的完整
课程包推送到公开远端。账号凭据、环境变量、缓存、日志、数据库与内部
审计报告始终由 `.gitignore` 排除。
