---
name: setup-matt-pocock-skills
description: "配置当前仓库以使用工程技能：设置问题跟踪器、分诊标签术语和领域文档布局。在首次使用其他工程技能之前运行一次。"
disable-model-invocation: true
---

# 设置 Matt Pocock 的技能

搭建工程技能所假定的逐仓库配置：

- **问题跟踪器**：问题存在哪里（默认 GitHub；也开箱支持本地 Markdown）
- **分诊标签**：五个规范分诊角色所使用的字符串
- **领域文档**：`GLOSSARY.md` 和 ADR 的位置，以及读取它们的消费规则

这是提示驱动的技能，不是确定性脚本。先探索、展示发现、与用户确认，再写入。

## 过程

### 1. 探索

查看当前仓库，了解起始状态。读取实际存在的内容，不要假定：

- `git remote -v` 和 `.git/config`：这是 GitHub 仓库吗？哪一个？
- 仓库根部的 `AGENTS.md` 和 `CLAUDE.md`：是否存在？其中是否已有 `## Agent skills` 部分？
- 根部的 `GLOSSARY.md`、`GLOSSARY-MAP.md`，以及旧版 `CONTEXT.md` / `CONTEXT-MAP.md`。如果存在旧文件，提议用 `git mv` 改为对应的 `GLOSSARY` 名称，并重写 `docs/agents/domain.md` 中的这些名称。
- `docs/adr/` 及任何 `src/*/docs/adr/` 目录
- `docs/agents/`：是否已有本技能此前的输出？
- `.scratch/`：表明可能已经采用本地 Markdown 问题跟踪约定
- 是否安装 `triage` 技能？（旁边是否有 `triage` 技能文件夹，或可用技能中是否有 `triage`。）这决定是否执行 B 节。
- Monorepo 信号：`pnpm-workspace.yaml`、`package.json` 中的 `workspaces` 字段，或内容充实且具有各自 `src/` 的 `packages/*`。这些只会出现在真正的大型多包仓库中；没有它们就意味着单上下文，几乎所有仓库都属于这一类。

### 2. 展示发现并询问

概括已有与缺失内容，然后按顺序处理各节。一次一节，得到一次回答后再进入下一节。

每节先给推荐答案，让用户一个词就能接受。只有选择确实存在分支时才给一句说明；探索已经解决的部分直接跳过（未安装 `triage` 时跳过 B 节，没有 monorepo 时跳过 C 节）。

**A 节：问题跟踪器。**

> 说明：“问题跟踪器”是本仓库保存问题的位置。`to-tickets`、`triage`、`to-spec` 等技能会读写它们。它们需要知道应调用 `gh issue create`、在 `.scratch/` 下写 Markdown 文件，还是遵循你描述的其他工作流。选择你实际用来跟踪此仓库工作的位置。

默认立场：这些技能是为 GitHub 设计的。如果 `git remote` 指向 GitHub，就推荐 GitHub。如果指向 GitLab（`gitlab.com` 或自托管主机），就推荐 GitLab。否则（或用户有其他偏好），提供：

- **GitHub**：问题保存在仓库的 GitHub Issues（使用 `gh` CLI）
- **GitLab**：问题保存在仓库的 GitLab Issues（使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI）
- **本地 Markdown**：问题以文件形式保存在仓库内 `.scratch/<feature>/`（适合个人项目或无远端仓库）
- **其他**（Jira、Linear 等）：让用户用一段话描述工作流；技能会将其记录为自由文本

将选择记录到 `docs/agents/issue-tracker.md`。GitHub 和 GitLab 模板带有“PR 作为请求入口”开关，默认**关闭**。保持关闭，不要主动提问：希望把外部 PR 加入分诊队列的用户可以以后自行在文件中开启。

GitHub 或 GitLab 跟踪器需要可访问的仓库。当用户选择其中之一，却没有 `git remote` 指向该主机时，先向用户获取仓库 URL 并连接好（必要时 `git init`，然后 `git remote add origin <url>`），再继续。在当前目录中运行 `gh repo view` / `glab repo view` 能打印项目时才算完成；如果不能，停止并告知缺少什么。

**B 节：分诊标签术语。** 如果未安装 `triage` 技能（探索已经确认），完全跳过本节，因为未安装的技能不需要标签。

若已安装，只问一个问题：

> 是否保留默认分诊标签？（推荐：**是**）

默认是五个规范角色，每个标签字符串等于其名称：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。回答**是**时原样写入。仅当用户回答否，通常是其跟踪器已有其他名称（例如用 `bug:triage` 表示 `needs-triage`）时，才收集覆盖值，让 `triage` 使用现有标签而非创建重复标签。

**C 节：领域文档。** 默认采用**单上下文**（仓库根部一份 `GLOSSARY.md` + `docs/adr/`）。这适用于几乎所有仓库，无需询问，直接写入。

只有探索发现 monorepo 信号时，才提供**多上下文**（根部 `GLOSSARY-MAP.md` 指向各上下文的 `GLOSSARY.md`）。然后确认用户想要的布局。

### 3. 确认并编辑

向用户展示以下草稿：

- 要添加到本次编辑的 `CLAUDE.md` / `AGENTS.md` 中的 `## Agent skills` 块（选择规则见步骤 4）
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md`、`docs/agents/triage-labels.md` 的内容（最后一个仅在已安装 `triage` 时）

写入前允许用户修改。

### 4. 写入

**选择要编辑的文件：**

- 如果 `CLAUDE.md` 存在，编辑它。
- 否则若 `AGENTS.md` 存在，编辑它。
- 两者都不存在时，询问用户要创建哪一个，不要替他们选择。

已有 `CLAUDE.md` 时绝不创建 `AGENTS.md`（反之亦然）；始终编辑已有的那个。

如果选定文件已有 `## Agent skills` 块，就原位更新其内容，不追加重复块。不要覆盖周围部分的用户修改。

该块如下：

```markdown
## Agent skills

### Issue tracker

[用一句话概括问题跟踪位置]。参见 `docs/agents/issue-tracker.md`。

### Triage labels

[用一句话概括标签术语]。参见 `docs/agents/triage-labels.md`。

### Domain docs

[用一句话概括布局："single-context" 或 "multi-context"]。参见 `docs/agents/domain.md`。
```

仅当安装了 `triage` 且执行过 B 节时，才包含 `### Triage labels` 子块，并写入 `docs/agents/triage-labels.md`。否则两者都省略。

如果在 GitHub 或 GitLab 上执行了 B 节，创建跟踪器缺少的每个已配置标签（`gh label create` / `glab label create`）。

然后以本技能文件夹中的种子模板为起点，写入文档文件：

- [issue-tracker-github.md](./issue-tracker-github.md)：GitHub 问题跟踪器
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md)：GitLab 问题跟踪器
- [issue-tracker-local.md](./issue-tracker-local.md)：本地 Markdown 问题跟踪器
- [triage-labels.md](./triage-labels.md)：标签映射（仅在安装 `triage` 时）
- [domain.md](./domain.md)：领域文档消费规则 + 布局

对于“其他”问题跟踪器，依据用户描述从头编写 `docs/agents/issue-tracker.md`。

### 5. 完成

告知用户设置完成，以及哪些工程技能现在会读取这些文件。说明以后可以直接编辑 `docs/agents/*.md`；只有想切换问题跟踪器或从头重建时才需要重新运行本技能。
