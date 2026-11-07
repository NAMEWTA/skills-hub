#!/usr/bin/env bash
# 人机协作的复现循环。
# 复制这个文件，修改下方步骤，然后运行。
# Agent 运行脚本；用户在自己的终端中按提示操作。
#
# 用法：
#   bash manual-reproduction.sh
#
# 两个辅助函数：
#   step "<操作说明>"            → 展示说明，等待按 Enter
#   capture VAR "<问题>"        → 展示问题，将回答读入 VAR
#
# 最后以 KEY=VALUE 输出收集的值，供 Agent 解析。
#
# `capture` 会把值回显到终端，Agent 可以读取；
# 因此只收集观察结果，登录操作留给用户通过 `step` 完成。

set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [完成后按 Enter] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

# --- 修改下方内容 ------------------------------------------------------

step "打开 http://localhost:3000 上的应用并登录。"

capture ERRORED "点击‘导出’按钮。是否出现错误？（y/n）"

capture ERROR_MSG "粘贴错误消息（没有则填 none）："

# --- 修改上方内容 ------------------------------------------------------

printf '\n--- 已收集 ---\n'
printf 'ERRORED=%s\n' "$ERRORED"
printf 'ERROR_MSG=%s\n' "$ERROR_MSG"
