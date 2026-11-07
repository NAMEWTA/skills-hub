#!/bin/sh
set -eu

if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
  echo '用法：run-tlc.sh MODEL.tla CONFIG.cfg [NEW_OUTPUT_DIRECTORY]' >&2
  echo '设置 TLA2TOOLS 为本地 tla2tools.jar 的绝对路径，可选 JAVA 指定 Java。' >&2
  exit 2
fi
: "${TLA2TOOLS:?请先设置 TLA2TOOLS 为本地 tla2tools.jar 的绝对路径}"
case "$TLA2TOOLS" in
  /*) ;;
  *) echo 'TLA2TOOLS 必须是绝对路径。' >&2; exit 2 ;;
esac
[ -f "$TLA2TOOLS" ] || { echo 'TLA2TOOLS 指定的文件不存在。' >&2; exit 2; }
model=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")
config=$(cd "$(dirname "$2")" && pwd)/$(basename "$2")
[ -f "$model" ] && [ -f "$config" ] || { echo '模型或配置文件不存在。' >&2; exit 2; }
output=${3:-"${model%.tla}-verification"}
# 每次运行使用全新目录，避免覆盖既有反例或结果。
if [ -e "$output" ]; then echo '输出目录已存在，请指定新目录。' >&2; exit 2; fi
mkdir -p "$(dirname "$output")"
mkdir "$output"
output=$(cd "$output" && pwd)
java_cmd=${JAVA:-java}
"$java_cmd" -version >"$output/java-version.txt" 2>&1
set +e
(
  cd "$(dirname "$model")" || exit 2
  "$java_cmd" -XX:+UseParallelGC -cp "$TLA2TOOLS" tlc2.TLC \
    -workers 1 -fp 0 -lncheck final -metadir "$output/states" \
    -config "$config" "$(basename "$model" .tla)"
) >"$output/tlc.out" 2>&1
status=$?
set -e
printf '%s\n' "$status" >"$output/exit-code.txt"
cat "$output/tlc.out"
printf '\nTLC 原始退出码：%s；证据目录：%s\n' "$status" "$output"
exit "$status"
