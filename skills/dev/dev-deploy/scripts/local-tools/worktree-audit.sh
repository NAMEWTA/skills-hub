#!/usr/bin/env bash
# 工作树的只读审计。按大小、合并状态、未提交工作、远程与 PR 状态，
# 以及明确指定目录中的最近聊天记录，对工作树分类。只输出建议，不删除。
# 不抓取远程、不写 Git 引用，也不推断或扫描宿主的私人聊天目录。
#
# 用法：worktree-audit.sh [-b|--base <ref>] [--with-pr]
#                         [--transcripts <目录>] [--] [repo-path]
#   repo-path 默认为当前仓库。带空格的路径使用引号。
#   -b 指定 MERGED 列对照的本地已存在引用，例如 origin/integration。
#   未指定时依次尝试 origin/HEAD、origin/main、origin/master。
#   origin/HEAD 是远程默认分支，不一定是 PR 合入的分支；两者不同时传 -b。
#   --with-pr 显式启用只读 PR 查询，需要已认证的 Origin 或 gh，以及 jq。
#   --transcripts 仅搜索给定目录；也可设置 SKILLS_WTA_TRANSCRIPTS_DIR。
#   未指定对话目录时完全跳过聊天读取。指定目录时需要 rg。
#   TSV 分组 safe 只表示可进一步评估回收，绝不表示已获删除授权。
set -u
export GIT_OPTIONAL_LOCKS=0

base=""
with_pr=0
transcripts="${SKILLS_WTA_TRANSCRIPTS_DIR:-}"
while [ $# -gt 0 ]; do
	case "$1" in
	-b|--base) [ $# -ge 2 ] || { echo "错误：$1 需要一个引用" >&2; exit 2; }; base="$2"; shift 2 ;;
	--with-pr) with_pr=1; shift ;;
	--transcripts) [ $# -ge 2 ] || { echo "错误：--transcripts 需要目录" >&2; exit 2; }; transcripts="$2"; shift 2 ;;
	-h|--help) sed -n '2,/^set -u/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 0 ;;
	--) shift; break ;;
	-*) echo "错误：未知选项：$1" >&2; exit 2 ;;
	*) break ;;
	esac
done
[ $# -le 1 ] || { echo "错误：只接受一个仓库路径" >&2; exit 2; }

repo="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -z "$repo" ] && { echo "当前不在 Git 仓库中；请传入仓库路径" >&2; exit 1; }
if [ -n "$transcripts" ]; then
	[ -d "$transcripts" ] || { echo "错误：对话目录不存在：$transcripts" >&2; exit 2; }
	command -v rg >/dev/null 2>&1 || { echo "错误：搜索显式对话目录需要 rg" >&2; exit 2; }
	transcripts=$(cd "$transcripts" && pwd -P) || exit 2
fi
cd "$repo" || exit 1
git rev-parse --git-dir >/dev/null 2>&1 || { echo "错误：不是 Git 仓库：$repo" >&2; exit 1; }

# porcelain -z 保留空格及特殊字符；逐个 NUL 字段读取，不按空白切路径。
worktree_paths() {
	git worktree list --porcelain -z | while IFS= read -r -d '' field; do
		case "$field" in worktree\ *) printf '%s\0' "${field#worktree }" ;; esac
	done
}
main_wt=""
IFS= read -r -d '' main_wt < <(worktree_paths)
[ -n "$main_wt" ] || { echo "错误：无法读取主工作树" >&2; exit 1; }

if [ -z "$base" ]; then
	for cand in "$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)" origin/main origin/master; do
		[ -n "$cand" ] && git rev-parse --verify --quiet "$cand^{commit}" >/dev/null && { base="$cand"; break; }
	done
	[ -z "$base" ] && { echo "错误：没有基础引用；请传入 -b <ref>" >&2; exit 1; }
	echo "警告：未指定 -b；MERGED 对照本地 $base 检查" >&2
fi
git rev-parse --verify --quiet "$base^{commit}" >/dev/null 2>&1 || { echo "错误：找不到本地基础引用：$base" >&2; exit 1; }

# 只读取本地已有引用。需要更新远程状态时，在审计之外另行执行已授权抓取。
case "$base" in origin/*) echo "说明：使用本地 $base，未抓取远程；数据可能过期" >&2 ;; esac

# 兼容 GNU 与 BSD 的时间戳读取形式，不把文件名重新拆成参数。
if stat -c %Y / >/dev/null 2>&1; then
	stat_fmt=(-c '%Y'); fmt_day() { date -d "@$1" '+%Y-%m-%d'; }
else
	stat_fmt=(-f '%m'); fmt_day() { date -r "$1" '+%Y-%m-%d'; }
fi

prs=$(mktemp) || exit 1
trap 'rm -f "$prs"' EXIT
printf '[]\n' > "$prs"
if [ "$with_pr" -eq 1 ]; then
	command -v jq >/dev/null 2>&1 || { echo "错误：--with-pr 需要 jq" >&2; exit 2; }
	if command -v origin >/dev/null 2>&1 \
		&& raw=$(origin pr list --author "@me" --state all --limit 1000 \
			--json number,status,headRef 2>/dev/null); then
		printf '%s' "$raw" | jq '[.[] | {number, state: (.status | ascii_downcase), head: .headRef}]' > "$prs" 2>/dev/null
	elif command -v gh >/dev/null 2>&1 \
		&& raw=$(gh pr list --author "@me" --state all --limit 1000 \
			--json number,state,headRefName 2>/dev/null); then
		printf '%s' "$raw" | jq '[.[] | {number, state: (.state | ascii_downcase), head: .headRefName}]' > "$prs" 2>/dev/null
	else
		echo "警告：无法读取 PR 状态；只报告本地证据" >&2
	fi
	[ -s "$prs" ] || printf '[]\n' > "$prs"
fi
now=$(date +%s)

echo "# base: $base"
printf 'SIZE\tAGE\tMERGED\tDIRTY\tREMOTE\tPR\tLAST_CHAT\tBUCKET\tWORKTREE\n'

while IFS= read -r -d '' wt; do
	[ "$wt" = "$main_wt" ] && continue
	display_wt=${wt//$'\t'/\\t}; display_wt=${display_wt//$'\n'/\\n}
	if ! git -C "$wt" rev-parse --git-dir >/dev/null 2>&1; then
		printf '?\t?\tunknown\tunknown\tunknown\t-\t-\treview\t%s\n' "$display_wt"
		continue
	fi
	size=$(du -sh "$wt" 2>/dev/null | awk '{print $1}')
	head=$(git -C "$wt" rev-parse HEAD 2>/dev/null)
	head_ts=$(git -C "$wt" log -1 --format='%ct' HEAD 2>/dev/null || echo 0)
	age=$([ "$head_ts" -gt 0 ] 2>/dev/null && echo "$(( (now - head_ts) / 86400 ))d" || echo '?')

	# Squash 合并不一定是基础引用的祖先，需要显式 PR 查询补充证据。
	git merge-base --is-ancestor "$head" "$base" 2>/dev/null && merged=YES || merged=no
	if ! porcelain=$(git -C "$wt" status --porcelain 2>/dev/null); then dirty=unknown
	elif [ -z "$porcelain" ]; then dirty=clean
	elif printf '%s\n' "$porcelain" | grep -qv '^??'; then
		dirty="wip:$(printf '%s\n' "$porcelain" | grep -cv '^??')"
	else dirty="scratch:$(printf '%s\n' "$porcelain" | grep -c '^??')"; fi

	branch=$(git -C "$wt" symbolic-ref --quiet --short HEAD 2>/dev/null || echo '')
	if [ -z "$branch" ]; then remote=detached
	elif git -C "$wt" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
		[ "$(git -C "$wt" rev-parse "origin/$branch" 2>/dev/null)" = "$head" ] \
			&& remote=pushed \
			|| remote="ahead$(git -C "$wt" rev-list --count "origin/$branch..HEAD" 2>/dev/null)"
	else remote=no-remote; fi
	pr='-'
	if [ "$with_pr" -eq 1 ] && [ -n "$branch" ]; then
		pr=$(jq -r --arg b "$branch" '.[] | select(.head==$b) | "#\(.number)/\(.state)"' "$prs" 2>/dev/null | head -1)
		[ -n "$pr" ] || pr='-'
	fi

	# 只查显式目录，固定字符串匹配路径边界；NUL 分隔保留空格和元字符。
	last='-'; last_ts=0
	if [ -n "$transcripts" ]; then
		while IFS= read -r -d '' transcript; do
			stamp=$(stat "${stat_fmt[@]}" "$transcript" 2>/dev/null) || continue
			if [ "$stamp" -gt "$last_ts" ] 2>/dev/null; then last_ts=$stamp; fi
		done < <(rg -F -l -0 -e "${wt}/" -e "${wt}\"" -- "$transcripts" 2>/dev/null)
		[ "$last_ts" -eq 0 ] || last=$(fmt_day "$last_ts" 2>/dev/null)
	fi
	recent=$([ "$last_ts" -gt 0 ] 2>/dev/null && [ $(( (now - last_ts) / 86400 )) -le 4 ] && echo yes || echo no)

	case "$dirty" in wip:*|unknown) bucket=hold-wip ;; *)
		case "$pr" in */open|*/draft) bucket=hold-open-pr ;; *)
			if [ "$recent" = yes ]; then bucket=verify-recent-chat
			elif [ "$merged" = YES ]; then bucket=safe
			else
				# 已关闭但未合并的 PR 不能作为安全回收证据。
				case "$pr" in */merged) bucket=safe ;; *) bucket=review ;; esac
			fi ;;
		esac ;;
	esac
	printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
		"$size" "$age" "$merged" "$dirty" "$remote" "$pr" "$last" "$bucket" "$display_wt"
done < <(worktree_paths) | sort -t$'\t' -k1,1 -rh
