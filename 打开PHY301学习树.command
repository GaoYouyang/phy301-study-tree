#!/bin/zsh

# PHY301 本地学习树启动器。
# - 已有 http://localhost:3000 响应时只打开浏览器。
# - 否则后台运行 npm run dev，记录日志与 PID。
# - 本脚本不会杀掉任何进程。

set -u

SITE_URL="http://localhost:3000"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" >/dev/null 2>&1 && pwd -P)"

pause_for_user() {
  if [[ -t 0 ]]; then
    printf "\n按回车键关闭此窗口..."
    IFS= read -r _
  fi
}

fail() {
  printf "\n启动失败：%s\n" "$1" >&2
  pause_for_user
  exit 1
}

site_responds() {
  command -v curl >/dev/null 2>&1 || return 1
  curl \
    --silent \
    --max-time 2 \
    "$SITE_URL" \
    2>/dev/null |
    grep --quiet "PHY301 重修通关树"
}

port_responds() {
  command -v curl >/dev/null 2>&1 || return 1
  curl \
    --silent \
    --output /dev/null \
    --max-time 2 \
    "$SITE_URL" \
    2>/dev/null
}

[[ -n "$SCRIPT_DIR" && -d "$SCRIPT_DIR" ]] ||
  fail "无法确定启动器所在目录。请不要把脚本内容粘贴到其他位置运行。"

cd "$SCRIPT_DIR" ||
  fail "无法进入项目目录：$SCRIPT_DIR"

NODE_COMMAND="$(command -v node 2>/dev/null || true)"
NPM_COMMAND="$(command -v npm 2>/dev/null || true)"

if site_responds; then
  printf "PHY301 学习树已经在运行，正在打开 %s\n" "$SITE_URL"
  if [[ -z "$NODE_COMMAND" || -z "$NPM_COMMAND" ]]; then
    printf "提示：当前终端没有找到完整的 node/npm，但已有网站正在响应，因此不需要重复启动。\n"
  fi
  command -v open >/dev/null 2>&1 ||
    fail "系统中找不到 macOS 的 open 命令，请手动打开 $SITE_URL"
  open "$SITE_URL" ||
    fail "浏览器未能自动打开，请手动访问 $SITE_URL"
  exit 0
fi

if port_responds; then
  fail "端口 3000 已有其他网页响应，但不是 PHY301 学习树。为避免误开或启动重复服务，本启动器不会继续；请先确认占用 3000 的本地项目。"
fi

[[ -n "$NODE_COMMAND" ]] ||
  fail "没有找到 Node.js。请先安装 Node.js 22.13.0 或更高版本。"

[[ -n "$NPM_COMMAND" ]] ||
  fail "没有找到 npm。请安装带 npm 的 Node.js 22.13.0 或更高版本。"

NODE_VERSION="$(node --version 2>/dev/null || true)"
NPM_VERSION="$(npm --version 2>/dev/null || true)"

[[ -n "$NODE_VERSION" ]] ||
  fail "Node.js 命令存在，但无法读取版本。"

[[ -n "$NPM_VERSION" ]] ||
  fail "npm 命令存在，但无法读取版本。"

node -e '
  const [major, minor, patch] = process.versions.node.split(".").map(Number);
  const supported =
    major > 22 ||
    (major === 22 && (minor > 13 || (minor === 13 && patch >= 0)));
  process.exit(supported ? 0 : 1);
' >/dev/null 2>&1 ||
  fail "当前 Node.js 为 $NODE_VERSION；本项目需要 22.13.0 或更高版本。"

[[ -f "$SCRIPT_DIR/package.json" ]] ||
  fail "项目目录中找不到 package.json：$SCRIPT_DIR"

[[ -d "$SCRIPT_DIR/node_modules" ]] ||
  fail "尚未安装项目依赖。请先在终端进入本目录并运行 npm install，然后重新双击。"

LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/phy301-site.log"
PID_FILE="$SCRIPT_DIR/.phy301-site.pid"

mkdir -p "$LOG_DIR" ||
  fail "无法创建日志目录：$LOG_DIR"

SERVER_PID=""
STARTED_NEW="false"

if [[ -r "$PID_FILE" ]]; then
  SERVER_PID="$(tr -d '[:space:]' < "$PID_FILE" 2>/dev/null || true)"
  case "$SERVER_PID" in
    ""|*[!0-9]*)
      SERVER_PID=""
      ;;
  esac
fi

if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
  printf "检测到已有启动进程 PID %s，继续等待网站响应。\n" "$SERVER_PID"
else
  printf "Node.js: %s，npm: %s\n" "$NODE_VERSION" "$NPM_VERSION"
  printf "正在后台启动 PHY301 学习树……\n"

  {
    printf "\n===== PHY301 site start: %s =====\n" "$(date '+%Y-%m-%d %H:%M:%S %z')"
  } >> "$LOG_FILE"

  nohup npm run dev >> "$LOG_FILE" 2>&1 < /dev/null &
  SERVER_PID=$!
  STARTED_NEW="true"

  printf "%s\n" "$SERVER_PID" > "$PID_FILE" ||
    fail "网站已尝试启动，但无法写入 PID 文件：$PID_FILE"

  printf "后台 PID：%s\n" "$SERVER_PID"
  printf "日志：%s\n" "$LOG_FILE"
fi

attempt=1
while (( attempt <= 30 )); do
  if site_responds; then
    printf "网站已响应，正在打开 %s\n" "$SITE_URL"
    command -v open >/dev/null 2>&1 ||
      fail "系统中找不到 macOS 的 open 命令，请手动打开 $SITE_URL"
    open "$SITE_URL" ||
      fail "浏览器未能自动打开，请手动访问 $SITE_URL"
    exit 0
  fi

  if [[ -n "$SERVER_PID" ]] && ! kill -0 "$SERVER_PID" 2>/dev/null; then
    printf "后台启动进程已提前退出。\n" >&2
    break
  fi

  printf "\r等待网站准备：%2d/30 秒" "$attempt"
  sleep 1
  (( attempt += 1 ))
done

printf "\n"

if [[ "$STARTED_NEW" == "true" ]]; then
  printf "网站在约 30 秒内没有响应，但脚本没有终止或杀掉任何进程。\n" >&2
else
  printf "已有后台进程在约 30 秒内仍未让网站响应；脚本没有启动第二个进程，也没有杀进程。\n" >&2
fi

printf "请稍后手动访问 %s，或检查日志：\n%s\n" "$SITE_URL" "$LOG_FILE" >&2

if [[ -f "$LOG_FILE" ]]; then
  printf "\n最近 30 行日志：\n" >&2
  tail -n 30 "$LOG_FILE" >&2
fi

pause_for_user
exit 1
