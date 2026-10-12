# 四课程学习总台

`hub/site/` 是 `gaoyouyang.site/` 的独立静态根目录。它只负责四门课的总览和导航；课程正文继续由各课程路径独立部署，个人进度、笔记、问题与续学位置通过同源 `/api/v1` 保存。

## 当前路由

| 课程 | 入口 |
| --- | --- |
| PHY301 | `/phy301/` |
| PHY408 | `/phy408/` |
| PHY309 | `/phy309/` |
| MAT107 | `/mat107/` |

四个入口均采用服务器约定的稳定课程前缀。课程项目更新时保持这些入口不变；不要在前端写服务器 IP、外部域名或访问令牌。

## 本地检查

无需安装依赖；测试只使用 Node.js 内置模块。

```bash
cd hub
npm test
npm run serve
```

本地预览默认监听 `127.0.0.1:4173`。静态预览不会代理 `/api/v1`，因此页面会自动进入本机模式；课程链接依然可用。可以用 `PORT=4180 npm run serve` 改端口。

## API 与安全契约

- 所有请求使用相对地址 `/api/v1` 和 `credentials: "same-origin"`。
- Nginx 会先把未登录的页面导航送到 `/access/`。页面启动后调用 `GET /api/v1/session` 恢复已有会话；直接 API 的 `401` 表示会话已失效。
- `/access/` 只向 `POST /api/v1/session` 发送一次访问密码。密码成功或失败后都会从输入框和局部变量清除，绝不写入 bundle、URL、cookie API 或 localStorage。
- 服务端签发 HttpOnly、SameSite=Strict 会话 cookie；前端只在内存保留 `csrfToken`，写请求附带 `X-CSRF-Token`。
- 登录后按课程请求 `GET /api/v1/courses/{slug}/snapshot`。笔记与问题只通过 `textContent` 显示，不注入 HTML。
- localStorage 只保存用于离线概览的裁剪后摘要，不保存令牌、cookie 或 CSRF 值。云端重新可用后，以最新成功读取的服务端数据为准。

完整契约见仓库 `services/course_hub_api/API.md`。

## 服务器部署

静态部署源必须是 `hub/site/`，而不是整个 `hub/`，避免把测试和说明文件暴露到站点根目录。仓库的 `deploy/scripts/deploy-hub.sh` 负责原子 release、`current` 软链接切换、失败回滚和外部健康检查。

私有 HTTPS 站点部署前必须通过 `COURSE_HUB_AUTH_TOKEN` 提供维护令牌；若缺失，脚本会在 SSH 前终止。切换后的公网检查若失败，脚本会恢复旧 `current`，并在服务器内部重新验证旧版本。

部署后检查：

```bash
COURSE_HUB_AUTH_TOKEN="$TOKEN_FROM_PASSWORD_MANAGER" \
  bash hub/scripts/health-check.sh https://gaoyouyang.site --api
unset COURSE_HUB_AUTH_TOKEN
```

外部健康检查使用维护令牌；正常浏览器只输入访问密码。公网 HTTP
只会跳转到 HTTPS，不接受任何凭据。脚本通过权限为 `0600` 的临时文件传递
维护请求头，退出时自动删除，而不会把令牌暴露在 `curl` 的进程参数中。

## 验收内容

- 通过统一密码门后，四门课程入口可独立打开。
- API 在线时恢复同源会话；API 不可用时明确显示本机模式。
- 进度只用课程已知节点总数计算。课程包尚未提供节点总数时，明确标为“待课程包接入”；若云端已有记录，只显示“已记录进度”百分比并加星号，不伪装成全课完成率。
- 响应式断点覆盖桌面、平板、手机；390px 不应出现横向溢出。
- 键盘焦点、跳转链接、表单标签、状态播报与进度语义均已提供。
