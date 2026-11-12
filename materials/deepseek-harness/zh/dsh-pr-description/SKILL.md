---
name: dsh-pr-description
description: 创建 deepseek-harness PR，或后续变化、已处理评审轮次后更新描述时使用。定义各描述章节、Issue 引用、测试设计、变更专用披露，以及 AI Usage 节的级别、阶段、评级规则、AI-DECLARATION 徽章及更新时间。
user-invocable: false
---

# 编写 PR 描述

本技能定义 deepseek-harness PR 描述包含什么、如何写及何时更新。[PR 模板](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.github/pull_request_template.md)只提供章节标题及占位符；各节要求由本技能负责。所有 PR 描述均遵循本技能，包括绕过模板的 `gh pr create --body-file` 创建的 PR。

## 范围

- 创建 PR 时写完整描述。
- PR 已存在后，描述不再匹配 PR 时，在你判断合适的时机更新受影响章节。
- 堆叠中每个 PR 有自己的描述，只覆盖该层相对基分支的变化。

## 描述结构

依次使用四个二级标题：`## Motivation`、`## Changes`、`## Testing` 和 `## AI Usage`。

固定章节标题及标签，如 **Interface changes**、**Behavior changes**、**Test design** 和 **Test entries**，用英文。表头及其余描述使用 PR 描述语言，除非人类要求其他语言，否则用中文。

### Motivation

- 一句话说明问题。
- 至少引用一个同仓库 Issue：解决它时用 `Fixes #N`、`Closes #N` 或 `Resolves #N`，只提供上下文时用 `Refs #N`。PR 编号不算 Issue 引用；HTML 注释、代码围栏或行内代码中的引用也不算。准确规则及 Priority 匹配由 [Issue 管理](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.github/issue-management/README.md)负责。

### Changes

- Interface changes：总结命令（包括仓库脚本）、标志、配置键、环境变量、公开导出、插件注册值、协议或持久化格式变化；没有则写 None。
- Behavior changes：总结用户、模型、开发者或系统可观察的结果，包括默认值、性能、时机及输出；没有则写 None。README、AGENTS.md、技能等文档及 agent 指令变化，对其指导的读者是行为变化。
- 只陈述差异保证、测试覆盖的行为。

### Testing

先写测试设计，再写测试条目。

**Test design**：总结测试如何覆盖 Changes 每项及覆盖为何完整。按变更类型选择形式：

| 变更类型 | 测试设计展示什么 |
|---|---|
| 行为变化 | 场景 × 之前行为 × 之后行为 × 覆盖测试的行为矩阵，展示哪些场景此前失败或不同 |
| 性能变化 | 逐阶段或场景的前后值及测量条件：机器、运行次数、取值方法 |
| 无行为变化的重构或迁移 | 如何展示行为未变：逐字节比较、快照未变或旧新比较测试 |
| 纯文档 | 如何检查内容：链接、双语配对、示例编译等 |

PR 混合多种变更时，每种类型给一种形式。Changes 标为 None 的项无需测试设计。

**Test entries**：

- 每种测试方法一项，显式列出命令或步骤，以及覆盖行为。
- 只列实际运行的测试及结果；更新描述时加入后续运行。说明证据来自本地还是 CI。
- 将测试输出、截图、录像或日志等可审查证据放在该项的 `<details><summary>Proof</summary>` 块；全文很长时可只放命令、计数及结果概要。

### 变更专用披露

每项披露放相关章节，通常是 Changes，置于命名它的英文加粗标签之后，例如 **Existing test behavior**；不新增标题。

| 变化 | 描述说明什么 | 规则负责者 |
|---|---|---|
| 改变已有测试描述的行为 | 行为何以改变 | [根 AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/AGENTS.md) 的 Tests describe behavior 规则 |
| 提高 `scripts/doc-budgets.manifest.json` 上限 | 每项提高的旧值、新值及文字必要性 | [字数预算](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md#wordcount-budgets) |
| 改变产品用户可见 GUI 行为 | 嵌入演示 GIF，并在旁边给出 record-browser-gif 要求的披露；每项无 GIF 的 GUI 变化，说明未嵌入及原因 | [record-browser-gif](../record-browser-gif/SKILL.md#每个-gui-pr-都含-gif) |
| 使用术语表未收录的译词 | 译法来源，或在待定术语下提出译法 | [翻译规则](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/translation-rules.md) |

## AI Usage

记录 PR 各阶段 AI 参与多少，以及谁做决定。

### 级别

按 AI 参与从少到多排列；每级配英文及中文名。AI 参与度指 AI 参与该阶段决策及工作的程度，在所选级别范围内取 5% 的倍数。不是代码量、时间或 token 的度量。

| 级别 | 含义 | AI 参与度 |
|---|---|---|
| hint 人工独立 | 人类完成工作；AI 不参与，或只给由人类采纳／拒绝的被动建议 | 0–10% |
| assist 人工主导 | 人类提供主要内容或每项关键决定；AI 完成部分工作 | 15–25% |
| pair 人工引导 | 人类给关键方向或约束，多次修订 AI 输出；人类理解内部 | 30–50% |
| copilot 人工把关 | AI 完成整个任务；人类审查、选择或拒绝，决定或澄清关键点，但不提供实质内容 | 55–85% |
| auto 模型自主 | AI 自主完成任务；人类只设目标或接受输出 | 90–100% |
| n/a 暂不适用 | 阶段不存在或尚未发生 | — |

### 阶段及标准

阶段按固定顺序，每阶段配英文及中文名。以下标准覆盖 assist 到 auto；hint 按级别表含义判断。

**breakdown 问题拆解**：问题出现后，人类是否参与拆解，还是 Agent 直接行动。确认问题应该修复属于此阶段，不属于设计。

- auto 模型自主：Agent 直接处理问题。
- copilot 人工把关：Agent 识别子问题、根因及范围；人类只确认或从 Agent 清单删项。
- pair 人工引导：人类贡献一两个关键事实，如怀疑方向、关键子问题、触发条件、范围限制，或要求追踪根因；Agent 识别其余部分。
- assist 人工主导：人类提供构成 PR 范围的问题／子问题清单或根因判断，并设范围；Agent 追踪根因或按清单工作。

**design 方案设计**：谁提供逻辑设计，人类做多少取舍及细节改动。按谁提供最终采用的设计结构评级，不按谁先提出候选：Agent 先给候选、人类后给采用结构时，是 assist。设计结构指模块划分、数据流、关键接口或状态转换；文档则是目录、页面划分及职责分层。可观察结果形式的约束是约束，不是结构。人类经连续纠正达成的结构算人类提供。

- auto 模型自主：人类原样采用 Agent 设计，或只确认 Agent 推荐选项。
- copilot 人工把关：人类在 Agent 设计中选择，或拒绝部分设计。
- pair 人工引导：Agent 提出设计结构；人类给关键约束、名称或数次修订。
- assist 人工主导：人类提供设计结构（模块划分、数据流或关键接口）；Agent 补机制或写成文档。

**testing 验收测试**：谁设验收目标、用例及矩阵，谁检查结果。纯文档变更的验收目标就是内容要求。只规定顺序的指令，如先写测试再修复，不计。

- auto 模型自主：Agent 设目标及用例；人类最多批准发布或确认 Agent 推荐范围。
- copilot 人工把关：人类审查或评论用例、矩阵或 Agent 报告的结果。
- pair 人工引导：人类设量化目标或必需场景，如触发条件、必须覆盖的前后对比，或纯文档的内容要求；Agent 设计具体用例。
- assist 人工主导：人类定义矩阵、维度或行，并运行或尝试结果来检查；Agent 可填值及用例。

**implementation 技术实现**：人类对变更内容的介入，包括生产代码、文档（README、JSDoc、Agent Notes、注释）、CI 及发布脚本。

- auto 模型自主：Agent 写所有变化，记录无人工 diff 审查。
- copilot 人工把关：人类审查 diff（包括逐块暂存），接受或给少量无需返工意见。
- pair 人工引导：人类要求撤销或重做任意部分，或指定重构或实现方式。
- assist 人工主导：人类编写 diff 关键部分；Agent 完成其余。口述内容让 Agent 写，不算自己编写。

**review 评审处理**：谁决定每条已处理意见修复或拒绝。机器人及人的意见都算；按决策者而非回复者评级。没有已处理意见时始终 n/a，即使已有意见或合并后收到意见。

- auto 模型自主：Agent 决定并回复每条意见。
- copilot 人工把关：人类只给总体授权或类别指示，或只回应 Agent 处理清单少数项，其余交 Agent。
- pair 人工引导：人类在线程或 Agent 清单回应所有非措辞项，决定修复、拒绝或延后，哪怕只简短接受；合并重复意见算一项，措辞意见可按类别处理；Agent 执行并回复。
- assist 人工主导：人类直接回复评审者，或主导争议讨论；人类决定、Agent 发回复算 pair。

### 评级规则

- 从会话及任务记录评级。人类在子 agent 会话发的消息计入；Agent 写给子 agent 的指令不算人类消息。
- 只计最终进入本 PR 的工作，包括先前会话工作。人类要求撤销或重做，即使被撤内容不留在 PR，也计入。
- 问题拆解、设计、测试及实现阶段的人类，是与 Agent 合作的作者；评审者批准及意见只计 review。
- 分支、工作顺序、暂存、何时提交／推送／开 PR 等流程及顺序指令，不计任何阶段人工参与。
- 记录充分时，在满足标准的级别中选择人工参与最多的级别，并用 AI 参与度值表达双方份额。只有记录不足时，才选择记录支持的人工参与较少级别。
- 阶段覆盖多项变更时，按主要变更评级，描述其他变化的差异。主要变更是占 diff 及评审工作最多的一项；没有单项主导时，按人工参与最多的变化。后续工作改变主项时，重新评级。
- 所选范围内，越接近人工参与更多一级的标准，AI 参与度越低；越接近人工参与更少一级则越高。

### 徽章 URL

AI-DECLARATION 块固定规范版本 0.1.2。使用[章节格式](#章节格式)中所选级别的徽章 URL；徽章遵循 [AI-DECLARATION](https://ai-declaration.md)。

| 级别 | 徽章 URL |
|---|---|
| hint 人工独立 | `https://img.shields.io/badge/䷼%20AI--DECLARATION-hint-ecfccb?labelColor=ecfccb` |
| assist 人工主导 | `https://img.shields.io/badge/䷼%20AI--DECLARATION-assist-fef9c3?labelColor=fef9c3` |
| pair 人工引导 | `https://img.shields.io/badge/䷼%20AI--DECLARATION-pair-ffedd5?labelColor=ffedd5` |
| copilot 人工把关 | `https://img.shields.io/badge/䷼%20AI--DECLARATION-copilot-fee2e2?labelColor=fee2e2` |
| auto 模型自主 | `https://img.shields.io/badge/䷼%20AI--DECLARATION-auto-ede9fe?labelColor=ede9fe` |

上游规范变化时，更新本技能及 PR 模板所有版本引用。

### 章节格式

先放 AI-DECLARATION 块，再按固定顺序每阶段一行：

```markdown
## AI Usage

<!-- ai-declaration:start -->
[![AI-DECLARATION: <highest level>](<badge URL>)](https://ai-declaration.md)

**AI declaration** ([v0.1.2](https://ai-declaration.md/en/0.1.2)): `<highest level>`
<!-- ai-declaration:end -->

| 阶段 | 级别 | AI 参与度 | 决策记录 |
|:--|:--|--:|:--|
| <stage English name> <stage Chinese name> | <level English name> <level Chinese name> | <AI involvement> | <description> |
```

- 徽章用阶段行中 AI 参与最多的级别，忽略 n/a 暂不适用。这遵循[规范规则](https://ai-declaration.md)：全局级别是声明的最高级别。
- 保留 `ai-declaration` 标记，以便原地替换已有声明、不重复添加。
- 描述使用 PR 描述语言，一两句，最多 80 个中文字或 40 个英文词。说明谁做哪些决定：列一两个代表决定，其余只给数量。
- 将描述写成已确定事实，不用“会话未见”或“待作者确认”等保留措辞。
- 称人为作者或评审者，不用用户名。省略评价、会话时间、会话 ID、直接引语，以及检查和 CI 的执行或处理（本地跳过、钩子、重跑、无关失败）。

### 更新时间

- 创建 PR 时，review 行是 `| review 评审处理 | n/a 暂不适用 | — | `，后接描述语言的“尚未处理评审意见”说明。
- PR 已存在后更新描述，重写受影响行以覆盖迄今所有工作，包括后续工作改变其决定或人工份额的早期阶段；不追加变化历史。
- 阶段级别变化时更新行；最高级别变化时，同时更新徽章 URL 及声明行。
- review 行只记录已处理意见，不写批准、合并时机及未处理意见。
- 修复推送且意见回复后，一轮评审结束。合并后收到意见不触发更新。

### 示例

根据 #6013 的会话及评审记录填写：

```markdown
## AI Usage

<!-- ai-declaration:start -->
[![AI-DECLARATION: pair](https://img.shields.io/badge/䷼%20AI--DECLARATION-pair-ffedd5?labelColor=ffedd5)](https://ai-declaration.md)

**AI declaration** ([v0.1.2](https://ai-declaration.md/en/0.1.2)): `pair`
<!-- ai-declaration:end -->

| 阶段 | 级别 | AI 参与度 | 决策记录 |
|:--|:--|--:|:--|
| breakdown 问题拆解 | pair 人工引导 | 40% | 作者指出两个不应进入系统提示的进程专用值，并指向自定义模型路由；Agent 追踪根因。 |
| design 方案设计 | assist 人工主导 | 20% | 作者提供设计结构：运行上下文、旧会话冻结的遗留章节及独立包；Agent 补充投影匹配。 |
| testing 验收测试 | pair 人工引导 | 40% | 作者要求升级后恢复旧会话及升级后改端口两个场景；Agent 编写用例与快照。 |
| implementation 技术实现 | pair 人工引导 | 35% | Agent 编写代码与 Agent Note；作者要求一次撤销，并指定 3 种方式，如用 getOrigin() 而非 origin 属性。 |
| review 评审处理 | pair 人工引导 | 40% | 作者逐条决定机器人意见，如不加升级指南及保留 devDependency；Agent 修复并回复。 |
```

## 创建及更新描述

1. 写到 git 忽略的文件，如 `.artifacts/pr/body.md`。用 `gh pr create --body-file <file>` 创建，或 `gh pr edit <number> --body-file <file>` 更新；嵌入 GIF 时遵循 [record-browser-gif](../record-browser-gif/SKILL.md)，使用 `--attach`。
2. 更新前，用 `gh pr view <number> --json body --jq .body` 保存现有描述，只改需要的章节：保留作者文字及媒体，仅替换已有 `ai-declaration` 块内容，删除不再匹配代码的陈述。若仍有旧 `## Human and Agent Roles`，将该标题及级别行替换为 `## AI Usage` 及声明块；只保留一个 AI Usage 节。
3. 写完回读，确认四节齐全，AI Usage 匹配当前代码及评审状态，无旧 `## Human and Agent Roles` 节残留。
