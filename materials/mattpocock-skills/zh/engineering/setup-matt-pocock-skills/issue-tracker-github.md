# 问题跟踪器：GitHub

本仓库的问题与规格保存在 GitHub issue 中。所有操作使用 `gh` CLI。

## 约定

- **创建问题**：`gh issue create --title "..." --body "..."`。多行正文使用 heredoc。
- **读取问题**：`gh issue view <number> --json number,title,body,labels,comments`。
- **列出问题**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，并配合适当的 `--label`、`--state` 过滤条件。
- **将问题设为父问题的子问题**：`gh issue create --parent <parent> ...`，或之后执行 `gh issue edit <parent> --add-sub-issue <child>`（`gh` 2.94+）。旧版 `gh`：`gh api --method POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>`（数据库 id，见下面的**阻塞**）。不支持子问题时，在子问题正文顶部添加 `Part of #<parent>`。
- **阻塞**：使用 GitHub 的**原生问题依赖关系**，这是规范的、可在 UI 中看到的表示。用 `gh issue create --blocked-by <n>,<n> ...` 或 `gh issue edit <child> --add-blocked-by <blocker>`（`gh` 2.94+）添加边。旧版 `gh`：`gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`，其中 `<blocker-db-id>` 是阻塞问题的数字**数据库 id**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，_不是_ `#number` 或 `node_id`）。无法使用依赖关系时，回退为子问题正文顶部的一行 `Blocked by: #<n>, #<n>`。所有阻塞项关闭后，工单才解除阻塞。
- **统计未关闭的阻塞项**：`gh api repos/<owner>/<repo>/issues/<n> --jq .issue_dependencies_summary.blocked_by`（只统计未关闭的阻塞项；0 表示可以开始）。`gh issue view <n> --json blockedBy` 也会列出已关闭的阻塞项，因此要过滤：`--jq '[.blockedBy.nodes[] | select(.state == "OPEN")] | length'`。
- **评论问题**：`gh issue comment <number> --body "..."`
- **添加/移除标签**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **关闭**：先用 `gh issue comment <number> --body "..."` 发布解释，再执行 `gh issue close <number>`。对于已关闭的问题，`gh issue close --comment` 会丢弃评论，却仍以 0 退出。

从 `git remote -v` 推断仓库；在克隆内运行时，`gh` 会自动处理。

只向用户自己的仓库提交问题。除非用户拥有 `mattpocock/skills`（这些技能的来源仓库），否则绝不要向它提交。在 fork 中，`gh` 可能默认指向上游父仓库，因此在会话第一次 `gh issue create` 前，用 `gh repo view --json nameWithOwner` 检查目标；如果不是用户的仓库，与用户确认。

## 将拉取请求作为分诊入口

**PRs as a request surface: no.** _（如果本仓库把外部 PR 当作功能请求，将其设为 `yes`；`/triage` 读取此标记。）_

设为 `yes` 时，PR 通过同样的标签和状态流转，使用对应的 `gh pr` 命令：

- **读取 PR**：`gh pr view <number>`，然后 `gh pr view <number> --comments`（非 TTY 时，`--comments` 只打印评论，不打印正文），以及 `gh pr diff <number>` 获取差异。
- **列出待分诊的外部 PR**：`gh api --paginate 'repos/{owner}/{repo}/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'`。
- **评论/标签/关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 的问题与 PR 共用编号空间，因此单独的 `#42` 可能是任意一种：先用 `gh pr view 42` 解析，再回退到 `gh issue view 42`。

## 技能说“发布到问题跟踪器”时

创建 GitHub issue。

## 技能说“获取相关工单”时

按上述**读取问题**操作读取。

## 寻路操作

供 `/wayfinder` 使用。**地图**是一张问题，**子问题**是工单。

- **地图**：一张带有 `wayfinder:map` 标签的问题，正文包含 Notes / Decisions-so-far / Fog。`gh issue create --label wayfinder:map`。
- **子工单**：通过 GitHub 子问题关系链接到地图的问题（见**将问题设为父问题的子问题**）。未启用子问题时，把子工单加入地图正文的任务列表，并在子工单正文顶部写 `Part of #<map>`。标签：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。认领后，将工单指派给负责推进的开发者。
- **阻塞**：见约定中的**阻塞**。
- **前沿查询**：列出地图下未关闭的子项（`gh issue list --state open`，限定在地图子问题/任务列表范围），排除仍有未关闭阻塞项（见**统计未关闭的阻塞项**，或 `Blocked by` 行中未关闭的问题）或已有指派人的工单；地图顺序中最靠前的获选。
- **认领**：`gh issue edit <n> --add-assignee @me`，这是会话中的第一次写入。
- **解决**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，再向地图的 Decisions-so-far 追加上下文指针（要旨 + 链接）。
