---
name: dsh-error-handling
description: 设计或审查失败、错误类与代码、工具失败、恢复、重试、后台任务及用户可见错误报告时，应用错误处理原则。
---

# DeepSeek Harness 错误处理

定义失败、其负责者，以及失败后哪些事情仍然安全。

## 有类型的结构化失败

预期失败需要声明的类型、稳定的判别标记及与处理有关的细节。复用包的错误约定，保留原因，分开机器身份与显示文字。绝不通过解析消息决定处理路径。`assertNever` 等意外缺陷可以仍是普通 `Error`；隔离绝不能将其变成成功。

携带机器代码的错误类，直接或经由包的错误类继承 `dsh-error` 的 `HarnessError`（`dsh-llm` 也重新导出），绝不继承裸 `Error`。优先每个负责包或领域一个错误类，而非每种失败一个类；调用者按类型捕获，或它有自己的结构化字段（如 `ToolArgsError.violations`）时，才有理由独立成类。除下文的取消外，`name` 是类名；`code` 值是稳定的 `UPPER_SNAKE_CASE` 字符串，通常以领域为前缀，在类旁声明为联合或常量。代码命名消费者据以行动的失败类别，而不是调用位置；语义不同时应新增代码，而不是复用。[错误类与代码指南](references/error-codes.md)定义类选择、命名、标准条件、声明、外来错误转换及兼容性。

在拥有依赖的位置转换外来失败。Node errno、SDK、协议、原生、worker 和跨 realm 错误转换为拥有者包的错误，将原错误保存为 `cause`；外来的数字或厂商代码放在消息里，不放在 `code` 中。跨层保留结构：绝不把 `HarnessError` 重新包装成普通 `Error`，不只保存消息以供以后重新抛出，不在脱敏文字时丢掉 `name` 和 `code`。进程或 worker 边界传输 `name` 与 `code`，再重建错误。

## 工具失败

生产者提供时，工具注册表在 `tool/result` 上保留 `error.name` 和 `error.code`：工具主体抛出的 `HarnessError`，执行前 `deny`、guard 拒绝或带 `info` 的执行后阻止（包括注册表自身审批拒绝，即带 `APPROVAL_REJECTED`、`APPROVAL_CANCELLED` 或 `APPROVAL_UNAVAILABLE` 的 `ApprovalError`），注册表自身的取消结果（带 `ABORTED` 或 `ABORTED_BEFORE_DISPATCH` 的 `AbortError`；也适用于取消后主体或 `tools/execute` 包装器抛出的 signal reason 或名为 `AbortError` 的 `Error`），以及 `tools/execute` 包装结果（如超时策略的 `TOOL_TIMEOUT`）。其他任何抛出值，以及不带 `info` 的 guard 拒绝或阻止，只持久化文字，重试策略、UI 和分析都无法据此路由。因此，工具主体可达的每种预期失败都应抛出 `HarnessError`，通常是负责领域的子类：

- 手工检查的参数约束抛出 `dsh-tools` 中的 `ToolArgsError`（`INVALID_ARGS`）。
- 缺少组合或调用上下文，例如缺少 Agent、服务或开放 turn，抛出 `dsh-tools` 中的 `ToolContextUnavailableError`（`TOOL_CONTEXT_UNAVAILABLE`）。
- 调用者取消时，要么传播 signal 的 reason 或名为 `AbortError` 的 `Error`，由注册表归类为 `AbortError`，使用 `dsh-tools` 的 `TOOL_ABORTED` 常量（`ABORTED`）；要么抛出具有同一 `name` 和代码的 `HarnessError`。绝不替换为另一个普通 `Error`；与取消不同的失败，例如清理失败，保留自己的类和代码。
- 依赖失败遵循上述转换规则；文件系统 errno 映射为 `FsError` 代码，例如 `FS_NOT_FOUND`、`FS_PERMISSION_DENIED` 和 `FS_IO_ERROR`。

通过 `tools/pre-execute`、`tools.guard()` 或执行后阻止来拒绝调用的策略，应提供包含自己 `name` 和 `code` 的 `info`。模型不得视为成功的失败是 `isError` 结果；非理想状态下仍成功的领域结果，例如非零退出或没有匹配，仍为成功值；只有输出模式明确说明时，才允许形状像成功的失败值。测试对每条预期失败路径断言 `error.info.name` 和 `error.info.code`，而非只断言消息。

现有 `name` 与 `code` 值持久化在 Session 日志中，并用于分析。重命名或重新分类是外部可感知的变化，需要[升级指南](../dsh-create-upgrade-guide/SKILL.md)。

## 捕获、恢复或停止

对每种失败，在其负责 API 文档中定义处理与报告负责者、隔离范围及保证：有效不变量，副作用是未发生／部分发生／已提交／未知，以及清理责任。后台工作也保留这些义务。

捕获限制的是异常传播，不是状态修改。只有受影响状态的拥有者能确认安全继续。否则停止依赖工作，丢弃无效状态或实例，或升级处理。仅记录日志不是恢复。重试要求可安全重复、支持取消且有明确负责者；有限操作需要预算，持续监督需要生命周期责任归属与可观察的降级。

### 空 catch 子句

空 `catch` 的块内除了 `;` 没有其他语句，它会丢弃 `try` 抛出的所有失败。只有每种失败都不会破坏拥有者的状态，且任何调用者都无法据此采取行动时才使用，例如删除一个不被任何地方读取的临时文件失败。记录日志、报告、重新抛出或返回后备值的 `catch` 不为空，下列规则不适用于它。[`verify-empty-catch`](https://github.com/deepseek-ai/deepseek-harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/scripts/verify-empty-catch.ts) 检查第一方 JavaScript 和 TypeScript 中的每条 `try`／`catch` 语句，包括测试；它不检查 `promise.catch()` 回调。检查器检查形式；评审检查名称和理由是否真实。

**`try` 中只有一条语句。** 一条语句指一个语法上的语句，例如一次调用或一次赋值，无论跨多少行；不等于一行。包含多条语句时，理由可能只涵盖一种预期失败，子句却把其他失败也丢弃，包括 `TypeError` 等缺陷；早期语句失败还会跳过后续语句，而调用者看到的仍是成功：

```ts
// 拒绝：一个 try 中有三条语句。
try {
  await unlink(tempFile)
  registry.delete(id)
  emit('removed', id)
} catch (_cleanupFailed) {
  // 遗留临时文件不保存任何会被读取的状态。
}

// 接受：只丢弃 unlink 的失败。
try {
  await unlink(tempFile)
} catch (_cleanupFailed) {
  // 遗留临时文件不保存任何会被读取的状态。
}
registry.delete(id)
emit('removed', id)
```

多条语句各自都允许失败时，为每条语句单独编写 `try` 和理由。检查器把一个块或一条复合语句（例如一个 `if`）计为一条语句；但如果这样的 `try` 包含多个操作，评审应拒绝。

**绑定名称说明预期失败。** 写 `catch (_cleanupFailed)`，不写 `catch {}` 或 `catch (_)`。Lint 要求未使用的绑定以 `_` 开头，而单独的 `_` 没有说明任何含义。

**用注释说明为什么可以安全地丢弃失败。** 注释放在 `catch` 块中，或子句结束 `}` 后的同一行。`try` 块内或 `try` 上方的注释不算。`// ignore` 和 `// expected` 只是重述空块；应说明预期的是哪种失败，以及为什么状态仍然有效。

**只接受部分失败时要检查它们。** 如果只有部分失败可安全丢弃，例如文件不存在，而权限错误仍必须报告，则编写非空 `catch` 检查 `code` 或 `name`，重新抛出其他错误；检查器不检查这样的子句。

```ts
try {
  await unlink(tempFile)
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
}
```

## 本地化、可操作、可见的报告

每份最终报告需要可读概要、受影响操作及安全的下一步。接收应用有语言区域机制时通过它本地化；其他诊断沿用现有输出语言。敏感内部细节不进入用户可见文字。

不可信状态或未知结果，必须通过 UI 或默认开启、可访问的日志显示：报告影响、不确定性、系统处置及安全的下一步。持久无效状态需要持续可见。没有保证时，绝不声称成功、回滚或可安全重试。报告本身失败时需要独立后备方式。

验证结果状态与可见结果，不仅验证异常被捕获。

## 基础

Meyer 的《Object-Oriented Software Construction》（1997）：约定与不变量；Sutter 的《Exceptional C++》（1999）：异常安全保证；Armstrong 的[论文](https://www.erlang.org/download/armstrong_thesis_2003.pdf)（2003）：隔离与监督。
