---
name: setup-pstack
description: 配置 pstack 为各角色使用的模型和推理预算。检测可用模型，并写入始终应用的规则，覆盖技能默认值。用于 /setup-pstack、“配置 pstack 模型”、“pstack 预算”，或改变 pstack 的模型选择。
---

# 配置 pstack

在 Claude Code 中，每个会话在遵循此技能前，先阅读一次 [Claude Code 适配器](../../docs/harness/claude-code.md)。它将 pstack 技能中的 Cursor 名称映射到 Claude Code。

写入 `~/.cursor/rules/pstack-models.mdc`，这是一份始终应用的规则，设置 pstack 各角色的模型。

## 步骤

### 1. 检测可用模型

列出本次会话中可以传给 `Task` 子智能体的模型 slug。这是可靠来源。如果 Cursor 还提供可列出用户有权使用模型的 API 或 CLI，为了完整性优先采用它。如果检测不到任何模型，请用户粘贴其可访问的 slug。绝不写入未经确认可用的真实 slug。别名 `inherit-parent` 和 `auto` 始终有效，即使它们不是检测到的 slug。

### 2. 加载当前状态

默认角色与模型映射就是下方第 5 步给出的规则形态。如果 `~/.cursor/rules/pstack-models.mdc` 已存在，读取它，把其中的 `# budget` 行和角色值作为当前选择。否则从这些默认值开始。若某行的角色不在第 5 步中，例如 `how critics`，说明它是已退役角色，删除该行。

### 3. 预算、映射和确认

**(a) 询问预算。** 优先使用 AskQuestion，不用自由文本。提供以下四个选项，使用完全相同的标签；如果规则记录了当前预算，就指出它。没有规则时，说明 `large` 对应技能默认值。

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) 应用预算。** 从技能默认值构建工作表；重复运行时，保留通过模型家族、列表或别名（`inherit-parent`、`auto`）改变过的角色。`unlimited`、`large`、`medium` 和 `small` 将每个真实 slug 的推理级别标记分别设为 `max`、`xhigh`、`high` 或 `medium`，评审组条目也一样。推理级别标记是最后一个标记，或尾随 `fast` 之前的标记；等级顺序是 `max` > `xhigh` > `high` > `medium` > `low`。如果结果不在检测到的 slug 中，就使用同一模型家族中已检测到、且不高于目标的最高推理级别；否则将该角色标为需要选择。`inherit-parent` 和 `auto` 不变。因此 `unlimited` 会把 `claude-opus-5-5-xhigh` 改为 `claude-opus-5-5-max`。Grok slug 最高为 `xhigh`，所以在 `unlimited` 下，回退会让 Grok 保持 `xhigh`，`grok-4.7-xhigh-fast` 也保持不变。`large` 保留两个默认值。`small` 则把它们改为 `claude-opus-5-5-medium` 和 `grok-4.7-medium-fast`。

**(c) 展示角色并确认。** 展示每个角色及其模型，把不在已检测集合中的真实 slug 标为需要选择。同时列出第 2 步删除的每一行。询问是按现状接受，还是更改特定角色；可选项包括检测到的模型，以及 `inherit-parent` 和 `auto`。这两个别名都意味着该角色运行在父聊天模型上，Auto 用户由此继续使用 Auto。优先使用 AskQuestion，不用自由文本。评审组角色（arena runners、architect runners、interrogate reviewers）的值是列表，每个条目运行一个子智能体，别名条目也计入，因此列表长度决定数量。`arena cross-judge pool` 也是列表，但 Arena 只运行一位裁判。它按列表顺序只尝试与父模型不同家族的值，所以按偏好排序。值为 `inherit-parent` 或 `auto` 的条目从不担任裁判。`swarm workers` 是每个工作智能体的默认模型，除非竞赛或比较为每个分支指定另一个模型。

### 4. 验证

写入的每个真实 slug 都必须在检测集合中。`inherit-parent` 和 `auto` 始终通过。如果选中的真实 slug 不可用，停止并再次询问。

### 5. 写入规则

写入 `~/.cursor/rules/pstack-models.mdc`，包含 `alwaysApply: true`、一行记录所选标签及目标推理级别的 `# budget`，以及每个角色一行，使用 poteto-mode 的同一套标签。覆盖整个文件，让重复运行保持幂等。格式如下：

```
---
description: pstack 各角色模型选择，覆盖技能默认值
alwaysApply: true
---
# pstack 模型配置。每个角色一行。删除某行即可回到技能默认值。
# 值为 `inherit-parent` 或 `auto` 时，该角色使用父聊天模型，省略 Task 的 `model`。评审组列表里的别名条目仍计入分派数量。
# budget: large (xhigh)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh
hardest tasks: claude-opus-5-5-xhigh
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-xhigh
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-xhigh
reflect tooling: grok-4.7-xhigh-fast
reflect judgment, divergent, synthesizer: claude-opus-5-5-xhigh
arena runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
```

### 6. 确认

告诉用户规则已写入，并且适用于新会话。再次运行本技能会更新它。

### 7. 提供验证技能，可选

检查项目是否有驱动真实应用来提供证据的方式，例如 `verify-*` 技能或已有测试设施。如果没有，只提出一次：“要创建一个项目本地验证技能吗？这样智能体可以像用户一样驱动应用，并证明变更有效。我可以用 /create-verification-skill 生成。”如果用户同意，调用 `/create-verification-skill`，无论 pstack 安装在工作区、用户目录还是插件中，都应解析到它。如果不同意，就继续，不要催促。

### 8. 提供形式化验证技能，可选

检查项目是否已有形式化验证技能，即运行模型检查器、证明或其他验证器来检查代码的项目技能。如果没有，只提出一次：“要创建形式化验证技能吗？这样智能体可以证明代码的某个关键属性在限定范围内的所有情况都成立，而不只是测试触及的情况。我可以用 /create-formal-verification-skill 生成。”如果用户同意，调用 `/create-formal-verification-skill`，无论 pstack 安装在工作区、用户目录还是插件中，都应解析到它。如果不同意，就继续，不要催促。
