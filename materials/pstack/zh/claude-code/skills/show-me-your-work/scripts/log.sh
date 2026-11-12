#!/usr/bin/env bash
# 向 show-me-your-work 决策日志追加格式正确的一行 TSV。
# 用法：log.sh <logfile> <phase> <decision> <why> <evidence> <result>
set -euo pipefail

if [ "$#" -ne 6 ]; then
	printf 'usage: log.sh <logfile> <phase> <decision> <why> <evidence> <result>\n' >&2
	exit 1
fi

logfile="$1"
shift

logdir="$(dirname "$logfile")"
if [ -n "$logdir" ] && [ "$logdir" != "." ] && [ ! -d "$logdir" ]; then
	mkdir -p "$logdir"
fi

# 这里使用 `>>`，不能用 `>`。网络挂载可能把已有日志判断为不存在。
# 这样最坏只是多一行表头，不会丢掉全部记录。
if [ ! -s "$logfile" ]; then
	printf 'ts\tphase\tdecision\twhy\tevidence\tresult\n' >> "$logfile"
fi

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
# 去掉制表符、换行和回车，让单元格保持单行。首字符若会被表格软件
# 当作公式（=、+、-、@），就加单引号前缀。日志可能由电子表格读取，
# 因此攻击者可控制的证据，例如 PR 标题、文件名或生成文字，
# 不能在审查者打开文件时变成公式执行。
clean() {
	local v
	v=$(printf '%s' "$1" | tr '\t\n\r' '   ')
	case "$v" in
		=*|+*|-*|@*) printf "'%s" "$v" ;;
		*) printf '%s' "$v" ;;
	esac
}
printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
	"$ts" "$(clean "$1")" "$(clean "$2")" "$(clean "$3")" "$(clean "$4")" "$(clean "$5")" \
	>> "$logfile"
