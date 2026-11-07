# 用原则名称引导工作

本项目将 24 条工程原则作为完整本地参考提供。按任务需要读取相关原则；它们改变设计、验证或执行决定时，说明实际作用，不要求每个小任务加载并引用全部规则。

你不必直接调用原则，而是用它们的名称引导工作。每个名称指向可在本包读取的一条完整规则，因此一句话比一段指令更精确地改变工作方向。

## 实际引导

假设智能体正准备在已有三个适配器之外再接一个：

```text
使用“先删后加”。先删除过时适配器，再设计剩下的部分。
```

假设它因为构建通过就宣称成功：

```text
应用“证明它有效”。运行真实导入流程，给我看写入的记录。
```

假设两个并行尝试准备写入同一分支：

```text
先隔离共享状态，再考虑串行化。每个尝试用独立工作树，不加锁。
```

这些表达有效，是因为背后的规则具体。智能体仍必须在回复中说明规则改变了哪个决定。只引用原则却说不出决定，表示它只报了名称，没有应用。

## 24 条原则概览

核心原则决定做多少，以及何时重新思考设计：

- [惰性协议](principles/minimal-change.md)优先删除，以及足以解决问题的最小改动。
- [基础性思考](principles/foundations.md)在写逻辑之前选择核心数据结构。
- [从第一性原理重新设计](principles/redesign.md)整合新需求，就像它从第一天就存在一样。
- [质疑前提](principles/question-premise.md)写下两个或更多失败修复共有的前提，在下一次修复之前直接测试它。
- [先删后加](principles/subtract-first.md)在继续构建之前去除负担。
- [减少读者负担](principles/reader-load.md)收拢阅读者必须在脑中保持的层次和隐藏状态。
- [面向结果执行](workflow/references/outcome-execution.md)使重写收敛到目标设计，而非保留将被丢弃的兼容状态。
- [体验优先](principles/experience-first.md)选择用户结果，而非实现方便。
- [穷尽设计空间](principles/design-alternatives.md)在没有先例时构建两到三个相互竞争的原型。
- [构建省力工具](principles/repeatable-tools.md)编写真正完成或证明工作的脚本，让审查者可以重跑。智能体反复手工做同一件事时，让它写出自己希望已有的工具或技能。脚本能每次以相同方式完成的步骤就交给脚本，把智能体留给判断。

架构原则决定状态、校验和兼容性放在哪里：

- [建模领域](workflow/references/domain-structure.md)把重复规则编码到一个结构中，而非散落的条件判断。
- [边界纪律](workflow/references/boundary-discipline.md)在边界校验，并信任内部类型。
- [类型系统纪律](principles/type-discipline.md)让非法状态无法表示。
- [使操作幂等](principles/idempotence.md)让重试收敛到同一个最终状态。
- [迁移调用者，再删除旧 API](principles/migrate-callers.md)一轮完成迁移和删除。
- [先隔离共享状态，再考虑串行化](principles/shared-state.md)在增加协调之前移除共享。

验证原则定义什么才算证据：

- [证明它有效](workflow/references/real-evidence.md)验证真实制品，而非替代物。
- [修复根因](principles/root-causes.md)在改代码前复现并追踪原因。
- [把工作排列为可验证单元](workflow/references/verifiable-units.md)每个小单元结束时先检查，再开始下一个。
- [测试行为，而非实现](workflow/references/behavior-verification.md)断言代码使用者可以观察到的结果，使测试在行为损坏时失败，在内部结构改变后继续有效。
- [解释数字](principles/explain-numbers.md)在任何人信任或报告测量值之前，指出限制该数字的因素，并排除其实测到了其他对象的可能。[`$dev-benchmark`](principles/measurement-checklist.md)把它转成七个需要用真实运行回答的问题。

委派原则让并行工作保持可控：

- [保护上下文窗口](principles/context-budget.md)把大量阅读路由给子智能体，主对话只保留发现。
- [绝不因等待人而阻塞](workflow/references/autonomy-boundaries.md)继续可逆工作，并展示结果。

还有一条元原则：

- [把经验编码进结构](workflow/references/structural-learning.md)把证据充分的重复经验放在最有效的层：优先结构与类型，再考虑已有检查或脚本，不把每次纠正自动变成新 lint。[`$dev-guardrails`](principles/recurring-corrections.md)将它应用到整个仓库，示例见[按需调整](guide-personal.md)。

不用背下这份列表。现在浏览一遍，看到智能体的某项行为本来可以被这里的某个名称阻止时，再回来查。这就是词汇留下来的方式。

下一步：[按需调整](guide-personal.md)。
