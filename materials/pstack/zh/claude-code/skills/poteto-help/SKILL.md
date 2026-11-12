---
name: poteto-help
description: 引导用户完成 pstack 配置、使用 /poteto-mode，并为任务选择技能、操作流程或原则。输入 /poteto-help 和你的问题。
disable-model-invocation: true
---

# Poteto 帮助

在 Claude Code 中，每个会话在遵循此技能前，先阅读一次 [Claude Code 适配器](../../docs/harness/claude-code.md)。它将 pstack 技能中的 Cursor 名称映射到 Claude Code。

回答用户关于 pstack 的问题，给出一条他们可以发送的提示词，并链接到答案来源文件。对于帮助问题，不开始执行工作。用户问的是如何做，而一次 pstack 执行会消耗真实 token，所以让他们自行发送提示词。

要求执行工作，例如“用 pstack 修复这个 bug”，不是帮助问题。读取 [`poteto-mode`](../poteto-mode/SKILL.md)，按它执行，并提醒一次 Custom Mode 可以让它持续生效。

本文将问题映射到包含答案的技能与指南页；细节由这些文件负责。在引用前读取对应文件，与本映射冲突时以该文件为准。这里的链接指向已安装插件，用户可能无法打开，因此向用户提供公开副本：`https://github.com/cursor/plugins/blob/main/pstack/` 加上文件路径。

## 查明他们需要什么

根据消息和对话推断需求。有明确场景，例如“哪个技能审查 PR”，就直接进入对应章节。仍不清楚时，用以下选项问一个选择题，然后只回答所选部分：

- 完成配置
- 用 `/poteto-mode` 开始任务
- 为某种场景选择技能
- 修正偏离目标的执行
- 将 pstack 变成自己的工作方式

检查会改变答案的状态，只在确有影响时提及：

- 没有 `~/.cursor/rules/pstack-models.mdc`，表示这位用户尚未运行 `/setup-pstack`，每个角色都使用默认模型。
- 项目中没有 `verify-*` 技能或其他应用驱动框架，表示代理没有脚本化操作应用的方法。问题涉及证明改动有效时，提及 `/create-verification-skill`。
- 项目没有形式化验证技能，表示测试之外没有进一步检查属性。问题涉及竞态、不变量或测试难以覆盖的情况时，提及 `/create-formal-verification-skill`。已有技能且覆盖代码在其记录的最后同步提交之后发生变化时，若问题涉及这些代码，提及 `/maintain-formal-verification-skill`。

模型规则缺失且与问题有关时，询问用户是否现在为每个角色选模型及推理预算。用户是新手、问题涉及配置或成本、答案取决于运行模型时，这件事才相关。每次对话最多问一次。需求也不清楚时，两问一起提出。提供两个选项：

- 现在：给出可以输入的 `/setup-pstack`，同时回答原问题。
- 稍后：回答原问题，再用一行说明运行 `/setup-pstack` 前各角色保留默认模型。

## 完成配置

1. 在聊天中用 `/add-plugin pstack` 安装，或从侧栏 Customize 安装。
2. 运行 [`/setup-pstack`](../setup-pstack/SKILL.md)。它询问推理预算，为每个角色映射模型并写入规则。规则对新对话生效。随后会各询问一次是否为项目生成验证技能和形式化验证技能，已有对应技能时不再询问。
3. 使用 `/poteto-mode`、一个目标以及一个能通过或失败的检查，开始真实任务。

安装本身不会改变行为，直到用户调用技能。只有 `/setup-pstack` 会根据用户自然语言自动加载。详细说明见 [README](../../README.md) 和[指南第 1 页](../../docs/guide/01-setup.md)。按 [`references/prompting.md`](references/prompting.md) 提议一起组织第一条提示词。

用户担心成本时，说明 token 花在哪里、怎样减少。pstack 在子代理和审查小组上花额外 token。重新运行 `/setup-pstack`，选择更小预算或更便宜模型。角色设为 `auto` 或 `inherit-parent` 时，运行父对话模型；父对话使用 Auto 或便宜模型时可以节省 token。缩短审查小组列表会减少子代理，每个条目对应一个代理。将 `/poteto-mode` 留给需要严谨处理的工作。

pstack 为 Cursor 构建，也可通过 `/plugin marketplace add cursor/plugins` 与 `/plugin install pstack@cursor-plugins` 安装到 Claude Code。那里每条命令带 `pstack:` 前缀，例如 `/pstack:poteto-mode`。[Claude Code 适配器](../../docs/harness/claude-code.md) 映射 Cursor 名称；需要 Bugbot 或 Automations 等 Cursor 专属功能的步骤会跳过，并用一行说明。

其他工具也能读取这些技能，因为它们使用 Agent Skills 格式。但 `/poteto-mode`、`/how`、`/why`、`/teach` 等大多数工作流技能会按角色模型启动 Cursor 子代理；Custom Modes 和 `/loop` 也是 Cursor 功能，因此这些部分可能不能在其他工具中运行。

## 用 `/poteto-mode` 开始任务

`/poteto-mode` 把任务匹配到一个操作流程，把其步骤复制到任务清单，并在需要时运行其他技能。跳过的步骤仍以 `skip: <reason>` 留在清单中。好的提示词说明目标及完成判据，不列技能清单，因为手工序列容易丢失或重排流程会保留的步骤。帮助组织提示词前先读 [`references/prompting.md`](references/prompting.md)。例子见[指南第 2 页](../../docs/guide/02-poteto-mode.md)。

`/poteto-mode` 是否持续生效，取决于启动方式：

- 在 `/poteto-mode` 上按 Enter，将技能附加到一条消息；对话继续后会逐渐淡出。
- Mac 按 Option+Enter、Windows 按 Alt+Enter，或在技能条目选择 Use as Mode，会将它设为 Custom Mode。它在退出模式之前每轮都保留在上下文里，但不会介入闲聊轮次。
- Cursor 文档在 Agents Window 和 CLI 中列出了 Custom Modes。其他位置每次新任务都用 `/poteto-mode` 开始。

问题涉及这一点时，链接 [Cursor 技能文档](https://cursor.com/docs/skills)。对话中说“new task”会让模式重新匹配流程。`/poteto-mode` 已经为各步骤派生的子代理使用 `poteto-agent`。自己的子代理也要采用这种风格时，用 `subagent_type: "poteto-agent"` 启动。

## 选择技能

默认答案是 `/poteto-mode`，它在步骤需要时运行大多数其他技能。用户希望比流程默认更多或更少地做某件事时，才直接指定技能。推荐前先读取该技能，并给一个示例提示词。

| 用户想做什么 | 技能 |
|---|---|
| 严谨完成任何非平凡任务 | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| 开始前确认代理理解目标与问题 | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| 发送前深化提示词而不扩大范围：专业人士会增加什么、原始材料与方法是什么、外部如何核验；只返回提示词而不执行 | [`/sharpen`](../sharpen/SKILL.md) |
| 理解代码现在如何工作、新代码应放在哪里 | [`/how`](../how/SKILL.md) |
| 理解代码为何如此组织、某个数字从哪里来 | [`/why`](../why/SKILL.md) |
| 用简单语言理解改动或子系统 | [`/teach`](../teach/SKILL.md) |
| 回顾自己最近在某个话题上的工作 | [`/recall`](../recall/SKILL.md) |
| 用通俗文字与小图回顾本对话自上条消息以来的变化，列全等待自己决定的事项，并让回复本身足以决策 | [`/ketchup`](../ketchup/SKILL.md) |
| 将 `/ketchup` 回顾做成短字幕幻灯视频，并在下方用文字列出等待决定的事项 | [`/ketchup-video`](../ketchup-video/SKILL.md) |
| 知道一个小 diff 可能在自身之外破坏什么 | [`/blast-radius`](../blast-radius/SKILL.md) |
| 写跨函数边界代码前确定类型与模块形状 | [`/architect`](../architect/SKILL.md) |
| 对同一简报尝试多种方案，融合成最佳结果 | [`/arena`](../arena/SKILL.md) |
| 通过云代理并行检查切片，或让执行者竞速 | [`/swarm`](../swarm/SKILL.md) |
| 让不同模型审查 diff 并尝试破坏它 | [`/interrogate`](../interrogate/SKILL.md) |
| 存在廉价本地测试时，测试先行修复 bug | [`/tdd`](../tdd/SKILL.md) |
| 为 `.ts` 或 `.tsx` 工作应用 TypeScript 规则 | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| 审查前由没写过这些注释的审查者评估并清理注释 | [`/no-comments`](../no-comments/SKILL.md) |
| 去除文字中的 AI 痕迹 | [`/unslop`](../unslop/SKILL.md) |
| 按标准写文档、RFC、README、PR 描述或提交信息 | [`/technical-writing`](../technical-writing/SKILL.md) |
| 用通俗语言重新听一遍上条回复 | [`/bro`](../bro/SKILL.md) |
| 给代理脚本化操作应用并证明行为的方法 | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| 让验证技能及其功能图重新符合应用 | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| 形式化验证竞态、不变量及测试难以触达的属性 | [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| 覆盖代码变化后同步形式化验证，并判断失败属于漂移还是缺陷 | [`/maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| 向产品经理或设计师展示经 TLA+ 模型检查的用户行为图，以及到达每个违规状态的最短路径 | [`/statechart`](../statechart/SKILL.md) |
| 报告或依据性能数字行动前审查它 | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| 执行大型、跨领域或离开后回来审查的变更 | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| 执行中保存决定日志，随后复核 | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| 为每个角色选择模型和推理预算 | [`/setup-pstack`](../setup-pstack/SKILL.md) |
| 将自己的工作习惯变成个人模式技能 | [`/automate-me`](../automate-me/SKILL.md) |
| 将已完成任务的经验转成技能修改 | [`/reflect`](../reflect/SKILL.md) |
| 阻止代理在本仓库重复同样错误 | [`/correct`](../correct/SKILL.md) |
| 构建按钮通过 webhook 唤醒 Grok Bot 的页面 | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |
| 熟悉 pstack 的使用方式 | `/poteto-help` |

同级技能目录不在表中时，读取其 frontmatter 并根据 description 分流。`principle-*` 目录在下方原则部分说明。

容易混淆的选择：

- `/how` 解释代码做什么，`/why` 解释理由，`/teach` 运行一个或两者，再用简单语言讲解结果。
- `/arena` 给每个执行者同一简报并融合优点；`/swarm` 划分切片或竞速，返回一份报告。
- `/architect` 确定设计后立即实施。要在写代码前审查设计，增加“with checkpoint”。
- `/interrogate` 审查 diff；`/blast-radius` 查找 diff 以外的破坏，并证明让改动安全的关键事实。
- `/recall` 从最近多次对话重建上下文；`/ketchup` 只覆盖本对话自用户上次消息以来的变化。恢复某个具体对话或分支使用 Session pickup 流程。
- `/figure-it-out` 设计一次严谨执行；Orchestrate 流程协调跨多日、多 PR 的项目；Autonomous run 流程把单个任务推进到完成条件。

pstack 未包含：

- `/deslop`、`control-cli`、`control-ui` 来自 `cursor-team-kit` 插件。
- `/loop` 和 `/create-skill` 是 Cursor 内置能力。
- pstack 没有 `/orchestrate` 技能。Orchestrate 是 `/poteto-mode` 的操作流程。如果斜杠菜单出现 `/orchestrate`，它来自其他插件。

## 操作流程与原则

操作流程是 `/poteto-mode` 内部的步骤列表，不是技能，因此没有斜杠命令。在 `/poteto-mode` 中，描述任务即可选中流程，以下表达也能直接指定：

- “babysit this pr”或“check on pr 123”运行 Babysit，将 PR 推到可合并并停在那里。除非用户要求 merge、land 或 ship，否则不合并。
- “land the stack”运行 Shipping。
- “take over this branch”运行 Session pickup。
- “pause safely”运行 Pause safely。
- “full autopilot on this queue”运行 Autopilot-full；“autopilot, don't merge”运行 Autopilot-stack。
- “run the eval playbook”运行 Eval。

未使用 `/poteto-mode` 时，“babysit this pr”可能启动 Cursor 自己的同类技能。[`poteto-mode`](../poteto-mode/SKILL.md) 的 Playbooks 部分列出全部流程及适用条件。[指南第 6 页](../../docs/guide/06-verify-and-ship.md) 说明开启、跟进和落地 PR。

pstack 没有规划技能，Cursor Plan Mode 可以配合使用。跨阶段或堆叠 PR 的工作，要求 `/poteto-mode` 制订计划会运行[多阶段计划流程](../poteto-mode/playbooks/multi-phase-plan.md)，只写计划而不实施。设计问题先通过 Prototype 流程或 `/architect` 用代码厘清。

原则是每个只含一条规则的技能，`/poteto-mode` 会读取并在回复里引用。用户通常不直接调用，而是用名称引导，例如“apply prove it works. show me the real output.”。输入 `/principle-<name>` 也能按需加载。[指南第 8 页](../../docs/guide/08-principles.md) 列出了这些原则。

## 修正偏离目标的执行

| 症状 | 处理 |
|---|---|
| 几轮之后模式不再生效 | 启动时用了 Enter。改为 Custom Mode，或每次任务以 `/poteto-mode` 开始。 |
| 一个问题被当成上个任务的下一步 | 说“new task”，或明确这一轮不需要该模式。 |
| 新模型选择没有效果 | `/setup-pstack` 写入的规则对新对话生效，开启新对话。 |
| 执行成本超出预期 | 查看配置章节中的成本段落。 |
| 技能没有自行加载 | 只有 `/setup-pstack` 会根据自然语言加载。其他技能需要用户输入名称，或由 `/poteto-mode` 运行；它不会运行所有技能。 |
| 并行代理相互覆盖 | 给每个代理独立 worktree，或使用各有独立机器的云代理。 |
| 夜间执行一直有动作却没完成任何事 | `/loop` 需要可通过或失败的判据，不是持续时长。见[指南第 7 页](../../docs/guide/07-overnight.md)。 |
| 回复凭绿色构建宣称成功 | 要求真实命令、流程、存储值或 profile。这就是 prove-it-works 原则。 |

偏离目标时，[`references/prompting.md`](references/prompting.md) 有一句话引导例子。[指南第 10 页](../../docs/guide/10-recipes-and-pitfalls.md) 还有更多常见问题及可复制用法。

## 将 pstack 变成自己的工作方式

- [`/automate-me`](../automate-me/SKILL.md) 从用户自己的历史起草个人模式技能，与 `/poteto-mode` 一起使用。
- 一次会话后用 [`/reflect`](../reflect/SKILL.md) 将经验变成由用户批准的技能修改。
- `/poteto-mode write a skill for <workflow>` 运行技能编写流程；eval 流程盲测技能变化。
- 有问题的技能单独开 PR 修复，不混进发现问题时正在进行的功能工作。

[指南第 9 页](../../docs/guide/09-make-it-yours.md) 逐项介绍这些方法。

## 回复

先回答问题。最多给一个代码块示例提示词，有合适场景时改写自 [`references/recipes.md`](references/recipes.md)，随后链接到对应文件。用户没要求完整地图时保持简短。
