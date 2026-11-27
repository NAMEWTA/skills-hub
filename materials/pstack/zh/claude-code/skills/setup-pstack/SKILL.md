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

默认的角色与模型映射采用下方第 5 步所示的规则格式。如果 `~/.cursor/rules/pstack-models.mdc` 已存在，先读取它，将其中的 `# budget` 行和角色值视为当前选择。否则，从默认设置开始。第 5 步未列出的角色，例如 `hardest tasks`、`architect runners`、`reflect tooling` 或 `why investigators`，属于已停用角色，删除相应行。

较旧的默认设置曾先将另一款 Gemini 模型、后来将 `gemini-4-neon-high` 用于小组席位。因此，任何规则中，小组角色（`arena runners`、`arena cross-judge pool`、`interrogate reviewers`）里的 `gemini-4-neon-high` 条目，或除 `gemini-4-neon-*` 以外的 `gemini-4-*` 条目，均属于旧默认值。将它们逐一改为 `gemini-4-neon-xhigh`。其他级别的 Gemini 4 Neon 条目属于用户选择，予以保留。告知用户替换了哪些条目。

没有 `# defaults: 3` 行的规则来自旧版设置流程。旧流程会为每个角色写入一行，因此某些值属于旧默认值，并非用户选择。在第 3 步之前，替换以下值：

- 如果 `arena cross-judge pool` 列表恰好包含一个 `claude-fable-*` 条目、一个 `claude-opus-*` 条目和一个 `gemini-*` 条目，无论顺序如何，都替换为该角色在第 5 步的列表。Fable 和 Opus 属于同一家供应商，因此 Fable 条目只能在 Opus 条目也可担任裁判的场合担任裁判。
- 将 `# budget: unlimited` 改为 `large`，因为任何角色都不应高于 `xhigh`。
- 如果规则也没有 `# defaults: 2` 行，则匹配 `grok-*` 的标识属于旧标识。`feature, refactoring`、`bug-fix`、`perf-issue`、`hillclimb` 或 `swarm workers` 中的旧标识，替换为该角色第 5 步的默认值。对于小组角色（`arena runners`、`arena cross-judge pool`、`interrogate reviewers`），如果列表恰好包含一个 `claude-opus-*` 条目和一个旧标识，无论顺序如何，都替换为该角色第 5 步的列表。对于其他列表，将每个旧标识替换为 `claude-opus-5-5-high-fast`。

其他所有值均属于用户选择，予以保留，包括其他角色中的旧标识，以及所有 `inherit-parent` 或 `auto` 值。告知用户替换了哪些值。

### 3. 预算、映射和确认

**(a) 询问预算。** 优先使用 AskQuestion，而非自由文本。使用以下三个选项及其精确标签；如果规则记录了当前预算，则说明当前预算。没有规则时，说明 `large` 与技能默认设置一致。

- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) 应用预算。** 以技能默认设置构建工作表；重新运行时，保留你曾按模型系列、列表或别名（`inherit-parent`、`auto`）修改过的角色。模型系列按 **arena** 技能的阶段 A 定义，因此 Fable 是独立系列。每个角色都有目标推理强度，即从默认强度按预算调整后的级别。级别顺序为 `xhigh` > `high` > `medium` > `low`：`large` 保持不变，`medium` 降低一级，`small` 降低两级。任何角色都不高于 `xhigh`；已在最低级的目标保持不变。多数默认值为 `xhigh`，各预算标签说明它们最终落在哪一级。将角色中每个实际标识的推理强度字段设为角色目标，小组条目也包括在内。推理强度字段是最后一个字段，或尾部 `fast` 前的字段。如果结果不在检测到的标识中，使用同系列里不高于目标的最高推理强度标识；若不存在，则将该角色标记为需要选择。`inherit-parent` 和 `auto` 保持不变。因此，`medium` 将 `claude-opus-5-5-xhigh-fast` 改为 `claude-opus-5-5-high-fast`，将 `claude-opus-5-5-high-fast` 改为 `claude-opus-5-5-medium-fast`；`small` 则分别改为 `claude-opus-5-5-medium-fast` 和 `claude-opus-5-5-low-fast`。Opus 5.5 始终使用 `-fast` 标识，所以每个 Opus 5.5 值都以 `-fast` 结尾。Fable 5.2 和 Gemini 没有 fast 标识，不要写出这样的标识。Gemini 4 Neon 的标识从 `low` 到 `xhigh`，没有 `max` 或 `fast` 标识，因此其席位使用最高级别 `gemini-4-neon-xhigh`。小组角色中的 Gemini 4 Neon 条目有自己的目标，即从 `xhigh` 按预算调整：`large` 保持 `gemini-4-neon-xhigh`，`medium` 写入 `gemini-4-neon-high`，`small` 写入 `gemini-4-neon-medium`。

**(c) 展示角色并确认。** 展示每个角色及其模型，将不在检测集合中的实际标识标记为需要选择。另列出第 2 步删除的每一行。询问是否原样接受或修改指定角色，选项包括检测到的 `xhigh` 及以下模型，以及 `inherit-parent` 和 `auto`（两者均表示该角色使用父聊天模型，这也是 Auto 用户保持使用 Auto 的方式）。优先使用 AskQuestion，而非自由文本。对于小组角色（arena runners、interrogate reviewers），值为一个列表，每个条目对应一个子代理，别名条目也包括在内，因此列表长度决定数量。`arena cross-judge pool` 也是列表，但 Arena 只运行一名裁判。它按列表顺序仅尝试与父模型不同供应商的值，因此应按偏好排序。Fable 和其他 Claude 模型属于同一家供应商。`inherit-parent` 或 `auto` 值永不担任裁判。除非竞赛或对照为各组另行指定模型，`swarm workers` 就是每名工作者的默认模型。

### 4. 验证

每个写入的实际标识都必须属于检测集合，且不高于 `xhigh`。`inherit-parent` 和 `auto` 始终通过。如果所选实际标识不可用，停止并重新询问。

### 5. 写入规则

写入 `~/.cursor/rules/pstack-models.mdc`，包含 `alwaysApply: true`、`# defaults: 3` 行、记录所选标签及其对应推理强度的 `# budget` 行，以及每个角色的一行，角色标签与 poteto-mode 一致。覆盖整个文件，使重新运行保持幂等。格式如下：

```
---
description: pstack 各角色模型选择，覆盖技能默认值
alwaysApply: true
---
# pstack 模型配置。每个角色一行。删除某行即可回到技能默认值。
# `inherit-parent` 或 `auto` 作为值：该角色使用父聊天模型（省略 Task 的 `model` 并启动 `generalPurpose`）。小组列表中的别名条目仍计入并行数量。
# defaults: 3
# budget: large (xhigh)
feature, refactoring: claude-opus-5-5-xhigh-fast
bug-fix: claude-opus-5-5-xhigh-fast
perf-issue: claude-opus-5-5-xhigh-fast
hillclimb: claude-opus-5-5-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh-fast
arena runners: claude-fable-5-2-high, claude-opus-5-5-high-fast, gemini-4-neon-xhigh
arena cross-judge pool: claude-opus-5-5-high-fast, gemini-4-neon-xhigh
swarm workers: claude-opus-5-5-high-fast
interrogate reviewers: claude-fable-5-2-high, claude-opus-5-5-high-fast, gemini-4-neon-xhigh
```

### 6. 确认

告诉用户规则已写入，并且适用于新会话。再次运行本技能会更新它。

### 7. 提供验证技能，可选

检查项目是否有驱动真实应用来提供证据的方式，例如 `verify-*` 技能或已有测试设施。如果没有，只提出一次：“要创建一个项目本地验证技能吗？这样智能体可以像用户一样驱动应用，并证明变更有效。我可以用 /create-verification-skill 生成。”如果用户同意，调用 `/create-verification-skill`，无论 pstack 安装在工作区、用户目录还是插件中，都应解析到它。如果不同意，就继续，不要催促。

### 8. 提供形式化验证技能，可选

检查项目是否已有形式化验证技能，即运行模型检查器、证明或其他验证器来检查代码的项目技能。如果没有，只提出一次：“要创建形式化验证技能吗？这样智能体可以证明代码的某个关键属性在限定范围内的所有情况都成立，而不只是测试触及的情况。我可以用 /create-formal-verification-skill 生成。”如果用户同意，调用 `/create-formal-verification-skill`，无论 pstack 安装在工作区、用户目录还是插件中，都应解析到它。如果不同意，就继续，不要催促。
