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

1. 调用 `Task`，设置 `subagent_type: "comment-sicko"`，传入范围。按照 **poteto-mode** 技能的“子智能体”章节，为每个子智能体选择适合任务的推理级别及快速或标准速度。不要重述它的规则。
2. 检查报告与差异。拒绝应用代码编辑、越界、删除受例外保护的注释、错误的 `MUST KILL` 理由，以及把有意保留的代码判为有罪的标记。对自身代码中意外行为提出的结构改造标记仍需处理。不要恢复那些注释。只有证明内容涉及无法改变的事情，保留才成立。审计遗漏的范围内 lint 与 TypeScript 抑制。正确性或安全抑制仍是要处理的 `MUST KILL`。恢复删除只能依据准确例外及范围内证据。对依据单薄的 `IMPORTANT` 或 `do not remove` 删除或保留结论，接受前对其符号运行 `/how` 或 `/why`。删除结论含糊时，不恢复；保留结论被反驳或仍含糊时，删除。回退并重跑一次被拒绝的报告，指出失败。第二次仍拒绝时，报告未解决，令 `/no-comments` 失败。
3. 直接修复简单且已接受的标记，例如删除死路径、移除参数、使用真实 API。任何修复需要结构设计时，对接受的整组发现及周边代码运行一次 `/architect`，停在草图。Architect 设计形状，第 4 步实现。
4. 实现范围内最小的根因修复，移除每个点名绕路。根因在范围之外时，交付范围内最小修复，其余报告未解决。**principle-fix-root-causes** 和 **principle-redesign-from-first-principles** 只指导意图，都不授权扩大边界或修复范围外实例。绝不追加症状防护。
5. 约束注释会说 `do not remove`、`do not change wording` 或 `talk to X before changing`。保留涉及无法改变事情的注释。提出范围内最廉价的类型、运行时、测试或 CI lint 方案。等待交互批准。无人值守与评测需要调用者预先批准。批准后先编码，再删除；否则删除，报告约束仍未执行，并勾勒范围外工作。
6. 报告删除数量、恢复的注释、重跑、架构草图、修复、编码提议、已编码约束、尚未执行的约束及其他未完成工作。
