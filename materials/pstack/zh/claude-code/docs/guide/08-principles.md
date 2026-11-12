# 用原则名称引导工作

pstack 把 24 条原则作为独立技能提供。`/poteto-mode` 在每项多步骤任务开始时读取其索引，应用任务触发的原则，并在回复中指出每条已应用原则及其改变的决定。

你不必直接调用原则，而是用它们的名称引导工作。每个名称指向智能体已经读过的一条完整规则，因此一句话比一段指令更精确地改变工作方向。

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

- [惰性协议](../../skills/principle-laziness-protocol/SKILL.md)优先删除，以及足以解决问题的最小改动。
- [基础性思考](../../skills/principle-foundational-thinking/SKILL.md)在写逻辑之前选择核心数据结构。
- [从第一性原理重新设计](../../skills/principle-redesign-from-first-principles/SKILL.md)整合新需求，就像它从第一天就存在一样。
- [质疑前提](../../skills/principle-attack-the-premise/SKILL.md)写下两个或更多失败修复共有的前提，在下一次修复之前直接测试它。
- [先删后加](../../skills/principle-subtract-before-you-add/SKILL.md)在继续构建之前去除负担。
- [减少读者负担](../../skills/principle-minimize-reader-load/SKILL.md)收拢阅读者必须在脑中保持的层次和隐藏状态。
- [面向结果执行](../../skills/principle-outcome-oriented-execution/SKILL.md)使重写收敛到目标设计，而非保留将被丢弃的兼容状态。
- [体验优先](../../skills/principle-experience-first/SKILL.md)选择用户结果，而非实现方便。
- [穷尽设计空间](../../skills/principle-exhaust-the-design-space/SKILL.md)在没有先例时构建两到三个相互竞争的原型。
- [构建省力工具](../../skills/principle-build-the-lever/SKILL.md)编写真正完成或证明工作的脚本，让审查者可以重跑。智能体反复手工做同一件事时，让它写出自己希望已有的工具或技能。脚本能每次以相同方式完成的步骤就交给脚本，把智能体留给判断。

架构原则决定状态、校验和兼容性放在哪里：

- [建模领域](../../skills/principle-model-the-domain/SKILL.md)把重复规则编码到一个结构中，而非散落的条件判断。
- [边界纪律](../../skills/principle-boundary-discipline/SKILL.md)在边界校验，并信任内部类型。
- [类型系统纪律](../../skills/principle-type-system-discipline/SKILL.md)让非法状态无法表示。
- [使操作幂等](../../skills/principle-make-operations-idempotent/SKILL.md)让重试收敛到同一个最终状态。
- [迁移调用者，再删除旧 API](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md)一轮完成迁移和删除。
- [先隔离共享状态，再考虑串行化](../../skills/principle-separate-before-serializing-shared-state/SKILL.md)在增加协调之前移除共享。

验证原则定义什么才算证据：

- [证明它有效](../../skills/principle-prove-it-works/SKILL.md)验证真实制品，而非替代物。
- [修复根因](../../skills/principle-fix-root-causes/SKILL.md)在改代码前复现并追踪原因。
- [把工作排列为可验证单元](../../skills/principle-sequence-verifiable-units/SKILL.md)每个小单元结束时先检查，再开始下一个。
- [测试行为，而非实现](../../skills/principle-test-behavior-not-implementation/SKILL.md)断言代码使用者可以观察到的结果，使测试在行为损坏时失败，在内部结构改变后继续有效。
- [解释数字](../../skills/principle-explain-the-number/SKILL.md)在任何人信任或报告测量值之前，指出限制该数字的因素，并排除其实测到了其他对象的可能。[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)把它转成七个需要用真实运行回答的问题。

委派原则让并行工作保持可控：

- [保护上下文窗口](../../skills/principle-guard-the-context-window/SKILL.md)把大量阅读路由给子智能体，主对话只保留发现。
- [绝不因等待人而阻塞](../../skills/principle-never-block-on-the-human/SKILL.md)继续可逆工作，并展示结果。

还有一条元原则：

- [把经验编码进结构](../../skills/principle-encode-lessons-in-structure/SKILL.md)把重复两次的建议变成 lint、检查或脚本。[`/correct`](../../skills/correct/SKILL.md)将它应用到整个仓库，示例见[按需调整](./09-make-it-yours.md#fix-the-environment-with-correct)。

不用背下这份列表。现在浏览一遍，看到智能体的某项行为本来可以被这里的某个名称阻止时，再回来查。这就是词汇留下来的方式。

下一步：[按需调整](./09-make-it-yours.md)。
