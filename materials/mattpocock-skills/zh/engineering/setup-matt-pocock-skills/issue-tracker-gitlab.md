# 问题跟踪器：GitLab

本仓库的问题与规格保存在 GitLab issue 中。所有操作使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI。

## 约定

- **创建问题**：`glab issue create --title "..." --description "..."`。多行描述使用 heredoc。传入 `--description -` 可打开编辑器。
- **读取问题**：`glab issue view <number> --comments`。用 `-F json` 获取机器可读输出。
- **列出问题**：`glab issue list -O json`，配合适当的 `--label` 过滤条件。
- **评论问题**：`glab issue note <number> --message "..."`。GitLab 将评论称为 “notes”。
- **添加/移除标签**：`glab issue update <number> --label "..."` / `--unlabel "..."`。多个标签可用逗号分隔或重复传入标志。
- **关闭**：`glab issue close <number>`。`glab issue close` 不接受关闭评论，因此先用 `glab issue note <number> --message "..."` 发布解释，再关闭。
- **合并请求**：GitLab 将 PR 称为 “merge requests”。使用 `glab mr create`、`glab mr view`、`glab mr note` 等，形式与 `gh pr ...` 相同，只是用 `mr` 代替 `pr`，用 `note`/`--message` 代替 `comment`/`--body`。

从 `git remote -v` 推断仓库；在克隆中运行时，`glab` 会自动处理。

## 将合并请求作为分诊入口

**MRs as a request surface: no.** _（如果本仓库把外部合并请求当作功能请求，将其设为 `yes`；`/triage` 读取此标记。）_

设为 `yes` 时，MR 通过同样的标签和状态流转，使用对应的 `glab mr` 命令：

- **读取 MR**：`glab mr view <number> --comments`，以及 `glab mr diff <number>` 获取差异。
- **列出待分诊的外部 MR**：`glab mr list -O json`，然后只保留作者不是项目成员/所有者的 MR（贡献者的 MR，而不是维护者正在进行的工作）。
- **评论/标签/关闭**：`glab mr note`、`glab mr update --label`/`--unlabel`、`glab mr close`。

与 GitHub 不同，GitLab 为问题和 MR 分别编号，因此一旦知道维护者指的是哪种入口，`#42` 就没有歧义。

## 技能说“发布到问题跟踪器”时

创建 GitLab issue。

## 技能说“获取相关工单”时

运行 `glab issue view <number> --comments`。

## 寻路操作

供 `/wayfinder` 使用。**地图**是一张问题，**子问题**是工单。

- **地图**：一张带有 `wayfinder:map` 标签的问题，正文包含 Notes / Decisions-so-far / Fog。`glab issue create --label wayfinder:map`。（在支持原生 epic 的 GitLab 套餐中，也可用 epic 承载地图；带标签的问题在任何套餐中都适用。）
- **子工单**：在描述顶部带有 `Part of #<map>`、链接到地图（`glab issue create --linked-issues <map> --link-type relates_to`）、带有 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）标签的问题。认领后，将工单指派给负责推进的开发者。
- **阻塞**：使用 GitLab **原生阻塞链接**，这是规范的、可在 UI 中看到的表示。通过作为 note 发布的 `/blocked_by #<n>` 快捷操作添加（`glab issue note <child> --message "/blocked_by #<blocker>"`）。原生阻塞链接是 Premium/Ultimate 功能；免费套餐（或不可用时）回退到描述顶部的一行 `Blocked by: #<n>, #<n>`。所有阻塞项关闭后，工单才解除阻塞。
- **前沿查询**：用 `glab api projects/:id/issues/<map>/links` 列出地图的子项，只保留带 `wayfinder:<type>` 标签的未关闭问题；排除仍有未关闭阻塞项的工单——指向未关闭问题的原生 `blocked_by` 链接（`glab api projects/:id/issues/<child-iid>/links`），或 `Blocked by` 行中的未关闭问题——并排除已有指派人的工单；地图顺序中最靠前的获选。
- **认领**：`glab issue update <n> --assignee @me`，这是会话中的第一次写入。
- **解决**：`glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，再向地图的 Decisions-so-far 追加上下文指针（要旨 + 链接）。
