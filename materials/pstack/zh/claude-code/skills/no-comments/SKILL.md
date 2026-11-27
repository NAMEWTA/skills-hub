---
name: no-comments
description: "派出 Comment Sicko，修复接受的发现，并为注释声称的约束提供可编码方案。"
disable-model-invocation: true
---

# 不要注释

在 Claude Code 中，每个会话在遵循此技能前，先阅读一次 [Claude Code 适配器](../../docs/harness/claude-code.md)。它将 pstack 技能中的 Cursor 名称映射到 Claude Code。

派出 Comment Sicko。处理接受的发现。

尊重 Comment Sicko 的新鲜视角。

## 范围

使用调用者给出的文件或差异。没有时，使用相对基础分支的当前差异，默认基础分支为 `main`，包括工作区。

## 步骤

1. 启动 `Task`，设置 `subagent_type: "comment-sicko"`，并传入范围。按照 **poteto-mode** 技能的 Subagents 部分，为每个子代理选择适合任务的推理级别。不要重复陈述它的规则。
2. 检查它的报告和 diff。拒绝修改应用代码、越出范围、删除受例外保护的内容、错误陈述 `MUST KILL` 理由，以及将保留的有意代码判为有问题的标记。对于自有代码中意外行为的重构标记，仍须保留可执行性；不要恢复这些注释。只有能证明注释描述的是我们无法更改的东西，才能保留。检查是否漏掉范围内的 lint 和 TypeScript 抑制项。涉及正确性或安全性的抑制项仍是必须处理的 `MUST KILL`。只有精确符合例外且有范围内证据时，才恢复删除内容。对于内容单薄的 `IMPORTANT` 或 `do not remove` 注释，在接受删除或保留决定前，追踪其符号或对它运行 `/why`。删除理由模糊时，不要恢复。如果保留理由被反驳或仍模糊不清，就删除。首次报告被拒绝时，回退并指出失败原因后重跑；第二次仍被拒绝，则将其报告为未解决，并让 `/no-comments` 失败。
3. 直接修复简单且已接受的标记，例如删除死路径、移除参数、使用真实 API。任何修复需要结构设计时，对接受的整组发现及周边代码运行一次 `/architect`，停在草图。Architect 设计形状，第 4 步实现。
4. 实现范围内最小的根因修复，移除每个点名绕路。根因在范围之外时，交付范围内最小修复，其余报告未解决。**principle-fix-root-causes** 和 **principle-redesign-from-first-principles** 只指导意图，都不授权扩大边界或修复范围外实例。绝不追加症状防护。
5. 约束注释会说 `do not remove`、`do not change wording` 或 `talk to X before changing`。保留涉及无法改变事情的注释。提出范围内最廉价的类型、运行时、测试或 CI lint 方案。等待交互批准。无人值守与评测需要调用者预先批准。批准后先编码，再删除；否则删除，报告约束仍未执行，并勾勒范围外工作。
6. 报告删除数量、恢复的注释、重跑、架构草图、修复、编码提议、已编码约束、尚未执行的约束及其他未完成工作。
