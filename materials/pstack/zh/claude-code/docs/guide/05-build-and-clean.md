# 实现改动并清理差异

各实现手册共用一条纪律：说清你观察到什么，让手册要求所需的证据。本页说明常见实现任务的提示词应包含什么，再介绍使差异便于审查的清理习惯。

## 用已知事实提示每种实现手册

缺陷提示说明症状，并要求先复现：

```text
/poteto-mode 这个命令重试后输出两条记录。先复现，再修复并验证。
```

功能提示说明行为，以及哪些内容必须保持不变：

```text
/poteto-mode 添加 --json 标志。文本输出保持逐字节一致。验证两种形式。
```

重构提示在移动结构之前固定行为：

```text
/poteto-mode 把解析移到一个模块，行为完全不变。先记录当前输出，再证明改动后没有变化。
```

性能提示陈述测量，而非印象：

```text
/poteto-mode 在这个夹具上启动需要 1.8 秒。追踪它，修复测得的原因，展示前后对比。
```

每种请求路由到对应手册：[缺陷修复](../../skills/poteto-mode/playbooks/bug-fix.md)、[功能](../../skills/poteto-mode/playbooks/feature.md)、[重构](../../skills/poteto-mode/playbooks/refactoring.md)、[性能问题](../../skills/poteto-mode/playbooks/perf-issue.md)。手册补充你没打出来的步骤：修复前复现，实现前明确数据形状，重组前固定行为，优化前做性能分析。

持续改进一个数字时，使用[爬坡优化手册](../../skills/poteto-mode/playbooks/hillclimb.md)。给出指标、目标和尝试次数下限，它会冻结测量框架，每次检验一个假设。保留有效改进，撤回其他改动。

两份性能手册都会对数字运行 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)。性能问题手册核验基线及之后的每个数字，爬坡优化手册在冻结框架之前核验它。[验证并交付](./06-verify-and-ship.md#vet-a-measured-number-with-benchmark-checklist)说明何时应自己明确调用。

有时你希望先知道原因，再决定是否修复。泄漏、空闲 CPU 忙转、视觉故障等现场症状，使用[运行时取证手册](../../skills/poteto-mode/playbooks/runtime-forensics.md)检测正在运行的进程。已有捕获的性能分析文件时，[轨迹取证手册](../../skills/poteto-mode/playbooks/trace-forensics.md)读取制品，把热点帧映射到源码。两者都返回诊断，不返回修复：

```text
/poteto-mode 这是慢启动的 cpuprofile。告诉我时间花在哪里，哪些源码行负责这些耗时。先不要修复。
```

## 用 `/tdd` 先写失败测试

缺陷具有低成本的本地测试路径时，整个提示可以只有两个词：

```text
/tdd 实现
```

有上下文时，这就够了。[`/tdd`](../../skills/tdd/SKILL.md) 先写因预期原因失败的最小测试，再修复，再重新运行测试。如果测试需要大范围搭建框架或脆弱的模拟，技能会说明情况，并使用最接近目标的可执行检查。真实命令能够提供更强证据时，不要强行测试。

## 按名称加载 TypeScript 规则

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) 把类型系统原则落实为具体规则：可辨识联合、边界处的 `unknown`、穷尽变体、从 Schema 推导的类型。它不会自行加载，因此任务触及 `.ts` 或 `.tsx` 文件时，输入 `/typescript-best-practices`。

## 提交之前清理

[发起 PR 手册](../../skills/poteto-mode/playbooks/opening-a-pr.md) 在每次提交之前对差异运行 `/deslop`，并用 [`/unslop`](../../skills/unslop/SKILL.md) 处理 PR 描述和提交正文。`/deslop` 来自 `cursor-team-kit` 插件，不在 pstack 中。没有它时，用普通语言要求相同结果：删除逐行叙述的注释、没有依据的防护、失效兼容路径和无关编辑。

对于文字，`/unslop` 接受目标和你额外指定的规则：

```text
/unslop 清理 README 的改动，不要长破折号
```

你会逐渐形成自己的简短说法。技能可以从“清理那个，再收紧些”这样的简短提示中理解意图。

## 用 `/no-comments` 清理注释

注释需要独立审查，而且不能由写它的智能体自己审。作者会维护自己的注释，就像你维护自己的注释一样。因此审查之前，让新视角来检查：

```text
/no-comments 检查差异
```

[`/no-comments`](../../skills/no-comments/SKILL.md) 派出 [Comment Sicko](../../agents/comment-sicko.md)，一位只读审查者，保留清单很短：许可头、公共 API 文档注释、解释代码无法表达内容的链接，以及无法重塑的外部依赖强制要求的行为。其余全部去掉。自己代码里的意外情况没有这种豁免。这类注释会以重构信号返回，`/no-comments` 从根因修复它认可的信号。注释宣称“不要删除”等约束时，技能会提出把该主张编码为类型、测试或 lint。不管哪种情况，注释都会移除。

这几者的分工应保持清楚。`/deslop` 清理代码中的冗余，`/unslop` 清理文字中的冗余，`/no-comments` 把注释交给不是原作者的审查者。

**误区：** 清理不是可有可无的润色。包含叙述性注释和防御性冗余的差异，在审查者看来仍未完成；多余代码也是下一个缺陷的藏身处。差异看起来膨胀时，应在提交之前说“清理它”，而非等审查指出之后再做。

下一步：[验证并交付](./06-verify-and-ship.md)。
