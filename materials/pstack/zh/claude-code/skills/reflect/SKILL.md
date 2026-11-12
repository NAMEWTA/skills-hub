---
name: reflect
description: "针对当前对话记录派出三位并行审查子智能体，提炼经验，并把每条经验路由为现有技能的一项具体编辑。用户说 reflect 时使用。"
disable-model-invocation: true
---

# 反思

在 Claude Code 中，每个会话在遵循此技能前，先阅读一次 [Claude Code 适配器](../../docs/harness/claude-code.md)。它将 pstack 技能中的 Cursor 名称映射到 Claude Code。

从当前对话中挖掘长期有效的经验，再把它们路由到技能修改。

用户说“reflect”或“/reflect”时调用。对话琐碎、无关，或现有技能已经覆盖且父智能体正确遵循时跳过。一次性事件不是经验。

## 1. 定位当前对话记录

扇出前，在系统提示指定的 `agent-transcripts/` 目录中找到这段对话的记录。不要跨 `~/.cursor/projects/*/` 做通配搜索，那会越过工作区边界，读取其他项目的私人对话。

```bash
ls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10
```

这涵盖旧版平铺（`<id>.jsonl`）、当前嵌套（`<id>/<id>.jsonl`）和子智能体（`<parent>/subagents/<child>.jsonl`）布局。对每个候选，读取第一条 JSONL。选择 `message.content[0].text` 包含本次对话最初用户提示的文件。没有匹配时，改为传入紧凑的会话摘要。

## 2. 并行派出三位审查者

一条消息、三个 `Task` 调用，使用 `subagent_type: generalPurpose` 和智能体模式（`readonly: false`）。审查者需要 MCP 访问，以查阅对话提及的工单、聊天线程和可观测性轨迹；只读模式会移除 MCP。

每位审查者及综合者对应 `pstack-models.mdc` 中的角色行和一个默认值。把 `model` 设为该行值，规则或该行缺失时使用默认值。值为 `auto` 或 `inherit-parent` 时不设置 `model`。若 Task 工具拒绝标识，使用默认值并说明；若默认值也拒绝，使用错误消息中同系列最接近的有效标识。按 **poteto-mode** 技能“子智能体”一节，为任务选择推理级别与快速或标准速度。

| 视角 | 角色行 | 默认 `model` | 提示模板 |
|---|---|---|---|
| 判断 | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/judgment-reviewer.md` |
| 工具 | `reflect tooling` | `grok-4.7-xhigh-fast` | `references/tooling-reviewer.md` |
| 发散 | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/divergent-reviewer.md` |

原样传入各模板，在标记处替换为对话记录路径或摘要。审查者在 `Task` 响应正文中返回发现。

## 3. 综合

一个 `Task` 调用，采用 `subagent_type: generalPurpose`、`reflect judgment, divergent, synthesizer` 行指定的模型（默认 `claude-opus-5-5-xhigh`），智能体模式（`readonly: false`）。它通过 MCP 抽查引用，只读模式会移除 MCP。原样传入 `references/synthesizer.md`，在指定位置内嵌各审查者的完整输出。返回“接受 / 拒绝 / 待办”列表。

## 4. 结构化强制检查

任何可由 lint 规则、脚本、元数据标志或运行时检查更可靠执行的“接受”项，都移至“待办”。参见 **encode-lessons-in-structure** 原则技能。

## 5. 应用

展示综合者完整的“接受 / 拒绝 / 待办”输出，在应用任何“接受”修改前等待明确批准。用户挑选子集，并可调整路由。技能改动会影响组织中所有未来智能体，不要自动应用。

无需等待就把每条“待办”写入团队开发体验或待办跟踪器。只有“接受”列表需要等待批准。

不要编辑 `plugins/cache/` 下的技能。批准前展示目标位置，即 `.cursor/skills/<skill>/` 或 `~/.cursor/skills/<skill>/`。批准后把技能文件夹复制到那里，再编辑副本。永远不要打开 PR 或推送。

严格遵循每个已批准条目的路由：

- 现有技能的小改动（一行条目、一句收紧措辞、纠正过时事实）：父智能体直接做。
- 现有技能的实质修改（新增章节、新模式表、超过约 10 行）：交给 Cursor 内置 `create-skill` 技能，执行其起草、测试、迭代循环。
- `tune description: <skill path>`（技能存在但应触发时未触发）：交给 `create-skill`，执行描述优化循环。
- `new skill via create-skill: <kebab-name>`：交给 `create-skill` 创建，不要临时发明形态。

环境提供 SKILL.md 验证器时，在宣布完成前对所有触及的技能运行。

## 6. 向用户总结

简短列表，无开场白：

- 已应用编辑：`<skill path>`。每项一行说明变化。
- 已创建新技能：`<skill path>`。每项一行，应该很少。
- 已写入开发体验跟踪器的待办：`<issue title>`（`<tags>`）。每项一行。
- 已排除：每条拒绝发现一行，附综合者理由。
