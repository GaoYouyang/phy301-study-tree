# PHY301 重修通关树

这是一个可在本地或 GitHub Pages 运行的统计物理学习网站，覆盖必要前置知识、老师 Week 1–14
教学计划、三套作业、2025 期中资料、公式地图、勘误、复习队列和错因回退。

在线版：<https://gaoyouyang.github.io/phy301-study-tree/>

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
答案、参考 PDF 与教学计划截图是否完整进入产物。生成结果发布到独立的
`gh-pages` 分支，源码保留在 `main`。

## GitHub 可见性

仓库与 GitHub Pages 均为公开。课程方已允许公开使用，因此课件、作业、
答案、考试资料、教学计划截图和参考 PDF 均随网站发布。账号凭据、环境
变量、缓存、日志、数据库与内部审计报告仍由 `.gitignore` 排除。
