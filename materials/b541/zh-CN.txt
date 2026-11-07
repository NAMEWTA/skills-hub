# 在 Claude Code 中使用 pstack

pstack 技能使用 Cursor 的名称。在 Claude Code 中，每个会话读取本文件一次，再用下列表格映射技能里的 Cursor 名称。`<pstack>` 指包含 `skills/` 和 `docs/` 的文件夹。某个 Cursor 字段在表中没有对应行时，省略它并说明。绝不传递工具 schema 拒绝的字段或值。

## 工具

| Cursor | Claude Code |
| --- | --- |
| `Task` | `Agent` |
| `AskQuestion` | `AskUserQuestion`。`-p` 模式下没有该工具，因此用普通文字询问。 |
| 打开待办清单 | 会话提供 `TodoWrite` 时使用它；否则在回复中维护清单，每个阶段更新。 |
| 运行另一个 pstack 技能（`/name` 或“**name** 技能”） | 用 `Read` 读取 `<pstack>/skills/<name>/SKILL.md` 并遵循它。`Skill` 工具会拒绝大多数 pstack 技能。告诉用户如何输入时，写 `/pstack:<name>`。 |
| `Grep`、`Glob` | 会话没有 `Grep` 或 `Glob` 时，用 `Bash` 运行 `rg`。 |

## 子智能体字段

| Cursor | Claude Code |
| --- | --- |
| `subagent_type: generalPurpose` | `subagent_type: "general-purpose"` |
| `poteto-agent`、`comment-sicko` | `pstack:poteto-agent`、`pstack:comment-sicko` |
| `readonly: true` | `subagent_type: "Explore"`。它仍保留 `Bash`，因此任务说明也要写“不要编辑文件”，并在事后检查 `git status`。 |
| `readonly: false` | `general-purpose`。它保留本次会话的 MCP 服务器。 |
| `environment: "cloud"` | `isolation: "worktree"`。指定工作智能体要检出的分支或提交。 |
| `environment: "local"` | 省略。 |
| `cloud_base_branch: <b>` | 在任务说明中让工作智能体先检出 `<b>`。 |
| `run_in_background: true` | 省略。子智能体默认在后台运行，完成时会通知。 |
| `resume` | 启动新智能体，把之前的结果粘贴进其任务说明。 |
| `file_attachments` | 在任务说明中列出路径。 |

## 模型

| Cursor | Claude Code |
| --- | --- |
| `claude-<family>-<version>-<effort>[-fast]`，如 `claude-opus-5-5-xhigh` | `model: "opus"` 和 `effort: "xhigh"`。`model` 只接受 `opus`、`sonnet`、`haiku`、`fable`。省略 `-fast`。 |
| `grok-*`、`gpt-*` 或其他非 Claude slug | 省略 `model`，让智能体使用会话模型，并说明这一点。 |
| `auto` 或 `inherit-parent` | 省略 `model`。 |
| `pstack-models.mdc` 规则，即 `~/.cursor/rules/pstack-models.mdc` | `~/.claude/rules/pstack-models.md`。Claude Code 会将它加载到每个新会话，因此各角色行已在上下文中；若没有，读取该文件。文件或对应角色行缺失时，使用技能默认 slug。 |
| 角色值 `<model> <effort>`，如 `opus high` | `model: "opus"` 和 `effort: "high"`。 |

## setup-pstack

Claude Code 会把 `~/.claude/rules/` 中所有 `.md` 文件加载到每个新会话，所以 `setup-pstack` 把规则写在那里。按其步骤执行，但作以下调整：

- 检测。已检测的模型是 `Agent` 工具 schema 列出的 `model` 值，每个模型搭配其 `effort` 值之一。真实模型写为 `<model> <effort>`，如 `opus xhigh`。推理级别是最后一个标记，所以预算步骤可直接沿用。
- 默认值。按上表映射每个默认 slug：`claude-opus-5-5-xhigh` 对应 `opus xhigh`，`grok-4.7-xhigh-fast` 对应 `inherit-parent`。
- 写入。写入 `~/.claude/rules/pstack-models.md`，不带 frontmatter，随后是注释行、`# budget` 行，以及第 5 步每个角色各一行。覆盖整个文件。绝不把角色行写进 `CLAUDE.md` 或 `AGENTS.md`。

## 路径

| Cursor | Claude Code |
| --- | --- |
| `.cursor/skills/`、`~/.cursor/skills/` | `.claude/skills/`、`~/.claude/skills/` |
| `~/.cursor/plugins/`、`.cursor-plugin/plugin.json` | `~/.claude/plugins/`、`.claude-plugin/plugin.json` |
| `.cursor/rules/*.mdc`、始终应用的规则 | `CLAUDE.md`，没有 `CLAUDE.md` 时用 `AGENTS.md`。Claude Code 从不读取 `.mdc` 文件。模型规则是例外，见“模型”。 |
| `https://github.com/cursor/plugins/blob/main/pstack/<path>` | 该文件存在时使用 `<pstack>/<path>`。插件包含技能、`docs/guide/` 和 `README.md`。读取本地副本，绝不抓取它。用户需要链接时给出 URL。 |
| `~/.cursor/projects/<slug>/agent-transcripts/` 中的对话记录 | `~/.claude/projects/<slug>/<session>.jsonl`。slug 将工作区路径中每个 `/` 和 `.` 都替换为 `-`，因此 `/Users/you/proj` 变为 `-Users-you-proj`。该文件夹直接下属的最新 `.jsonl` 是当前会话。它的 `<session>/subagents/` 文件夹保存子智能体记录。只读取本工作区的文件夹。 |

## Cursor 专有功能

Claude Code 没有 Cursor Automations、Bugbot、Cursor 云智能体或内置 PR 工具。步骤需要其中某项时，在回复中加一行 `Skipped in Claude Code: <step>. <reason>.`，然后继续下一步。不要停止、询问或重试。后续步骤如果依赖被跳过步骤生成的东西，例如 URL 或密钥，留下占位符，并在那行说明中指出。

| Cursor | Claude Code |
| --- | --- |
| Cursor Automations：例程、调用 `update_state` 的例程、`api2.cursor.sh/automations` webhook、例程唤醒，以及 `SendToUser` 秘密请求 | 跳过，并附上述说明行。 |
| Bugbot | GitHub PR 中的 Bugbot 评论是普通审查讨论，因此用该步骤提供的代码托管平台命令进行分诊。PR 没有 Bugbot 检查或评论时，跳过启动、等待或配置 Bugbot 的步骤。 |
| Cursor 云智能体 | `environment: "cloud"` 映射为 worktree，见“子智能体字段”。需要云智能体本身的步骤，例如其仪表盘状态或专有机器，则跳过。 |
| 内置 PR 工具 | 使用步骤给出的代码托管平台命令，例如 `gh pr create`。这不算跳过，所以无需说明行。 |
