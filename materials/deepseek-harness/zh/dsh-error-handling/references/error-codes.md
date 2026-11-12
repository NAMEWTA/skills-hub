# 错误类与代码指南

新增或审查错误类、错误代码，或其 `name` 与 `code` 会进入 `tool/result` 的 `error` 等持久记录的失败路径时，使用本指南。

## `name` 和 `code` 去向

`HarnessError` 除 `message` 与 `cause` 外，还携带 `name` 与 `code`。工具注册表将抛出的 `HarnessError` 的 `name` 和 `code` 复制到 `ToolErrorInfo`，Session 日志将它持久化为 `tool/result` 的 `error`；模型只看到渲染后的 `message`。重试策略、UI 卡片、回放和失败分析按 `name` 与 `code` 路由，因此从首次记录它们的版本起，两者就是兼容性承诺。

| 字段 | 受众 | 内容 |
|---|---|---|
| `name` | 代码与分析 | 错误类；归组一个领域负责的所有失败 |
| `code` | 代码与分析 | 消费者据以行动的失败类别 |
| `message` | 模型与日志 | 英文，可操作，指出操作与安全的下一步 |
| `reason`（`ToolErrorInfo`） | 用户可见投影 | 可选原始细节，不进入模型可见内容；只有提供 `info` 的策略决定可设置它 |
| `cause` | 调试 | 原始外来或下层错误 |

## 选择类

1. 失败属于已有领域时，复用负责领域的现有类：文件系统目标用 `FsError`，`glob`／`grep` 用 `SearchError`，以及 `LspError`、`WebError`、`SubagentError`、`TeamError`、`GoalError`、`WorkflowError`、`UserQuestionError`、`SessionQueryError`、`Sandbox*Error` 各类和 `CodeRunFailedError`。
2. 参数模式无法表达的参数约束，例如空字符串、范围或跨字段规则，用 `ToolArgsError`（`INVALID_ARGS`）；工具调用缺少必需 Agent、服务或开放 turn，用 `ToolContextUnavailableError`（`TOOL_CONTEXT_UNAVAILABLE`）。
3. 只为新的负责领域声明新类。优先一个带代码联合的类，而非每种失败一个类；消费者必须按类型捕获，或存在自己的结构化字段（如 `ToolArgsError.violations`）时，才有理由独立子类；已有领域类时继承它，让领域仍能通过 `instanceof` 匹配。
4. 绝不声明继承裸 `Error` 的带代码类。迁移现有类时修改基类，并保留每个 `name` 与 `code`。

## 命名类

- `name` 是以 `Error` 结尾的 PascalCase 类名，例如 `JobError` 或 `SandboxEscalationError`。
- 在构造器中将字符串字面值赋给 `this.name`。`HarnessError` 默认将 `name` 设为 `new.target.name`，但打包器可能重命名冲突的类绑定，类重命名会改变持久化数据。
- 不复用其他领域的类名，也不在类名中编码错误代码。
- 取消是唯一例外：其 `name` 为 `AbortError`，代码是 `dsh-tools` 的 `TOOL_ABORTED` 常量（`ABORTED`）。取消后工具抛出的 signal reason 或名为 `AbortError` 的 `Error`，注册表均应用这两个值，不论工具内部哪个操作被中止；工具自行抛出取消错误时，使用带相同 `name` 和代码的 `HarnessError`。

## 代码格式

- 代码匹配 `^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$`：ASCII `UPPER_SNAKE_CASE`。
- 新代码先写同一类共享的领域前缀，再写条件：`<DOMAIN>_<CONDITION>`，例如 `FS_NOT_FOUND`、`TEAM_TASK_STALE_REVISION` 或 `MCP_CONNECTION_CLOSED`。领域有多个主体时，允许在前缀和条件间加入主体，例如 `TEAM_TASK_*` 与 `TEAM_MEMBER_*`。
- 已有无前缀代码，例如 `SubagentError` 的 `NOT_RESUMABLE` 或 `LlmError` 的 `TIMEOUT`，保持原样；重命名是破坏性变化。这些类的新代码沿用该类现有风格。
- 代码必须是字面值。绝不从模板字符串、状态数字、路径、ID、工具名或外来代码拼出。

## 命名条件

按消费者下一步要做什么选择条件，而非按失败发生位置。发明条件前，先复用以下标准条件：

| 条件 | 含义 | 典型消费者动作 |
|---|---|---|
| `INVALID_<FIELD>` 或 `INVALID_ARGUMENT` | 调用者输入违反已记录的约束 | 模型修正输入 |
| `NOT_FOUND` | 具名目标不存在 | 模型选择另一目标 |
| `ALREADY_EXISTS` | 创建与已有目标冲突 | 模型复用或重命名 |
| `PERMISSION_DENIED` | 主机或平台拒绝访问 | 报告；不原样重试 |
| `SANDBOX_DENIED` | 沙箱策略拒绝操作 | 请求升级权限或停止 |
| `REJECTED` | 人或审查策略拒绝请求 | 停止并解释；不绕过 |
| `CANCELLED` / `ABORTED` | 用户或调用者取消操作 | 停止且不重试 |
| `TIMEOUT` | 截止时间已过，且已知结果未完成 | 只有幂等操作才重试 |
| `UNAVAILABLE` | 必需服务、提供者或后端不存在或不可达 | 报告缺少的组合，或稍后重试 |
| `UNSUPPORTED_<FEATURE>` | 请求有效，但此实现无法服务 | 选择其他选项 |
| `LIMIT_REACHED` / `TOO_LARGE` | 达到配置的数量、大小或速率上限 | 缩减请求 |
| `STALE_<STATE>` | 调用者基于过期版本行动 | 重读并重试 |
| `CONFLICT` | 并发或重复工作占用目标 | 等待或选择其他目标 |
| `CORRUPT` | 持久化状态验证失败 | 报告；不信任该状态 |
| `<OPERATION>_FAILED` | 依赖失败，拥有者无法进一步分类 | 携带原因报告 |

只有上述具体条件都不合适时，才使用 `<OPERATION>_FAILED`。一个代码覆盖一种消费者动作：消费者必须采取不同动作时拆分代码，所有消费者处理相同时合并候选代码。

## 声明代码

拥有其全部代码的领域，在类旁声明封闭列表，用它为构造器提供类型，如以下任务领域示例：

```ts
/** 所有可由机器路由的任务失败。 */
export const JOB_ERROR_CODES = [
  'JOB_NOT_FOUND',
  'JOB_FOREIGN_SESSION',
  'JOB_LIMIT_REACHED',
] as const

/** 一个任务失败代码。 */
export type JobErrorCode = typeof JOB_ERROR_CODES[number]

/** 有类型的任务失败；`code` 属于 {@link JOB_ERROR_CODES}。 */
export class JobError extends HarnessError {
  override readonly code: JobErrorCode

  constructor(message: string, code: JobErrorCode, options?: ErrorOptions) {
    super(message, code, options)
    this.name = 'JobError'
    this.code = code
  }
}
```

提供者可添加代码的 Service Definition，例如 `WebError` 或 `LlmError`，保留 `code: string`，通过导出常量记录共享代码，并要求消费者容忍未知代码。在类 JSDoc 或负责子系统的页面中，记录每个代码的含义及消费者动作。

## 转换外来失败

在拥有依赖的包转换，原错误保存为 `cause`；任何外来数字或厂商代码放入 `message`，绝不放入 `code`。

| 外来失败 | 转换后的错误 |
|---|---|
| `ENOENT`、`ENOTDIR` | `FsError` `FS_NOT_FOUND` |
| `EACCES`、`EPERM` | `FsError` `FS_PERMISSION_DENIED` |
| 要求文件时出现 `EISDIR` | `FsError` `FS_NOT_REGULAR_FILE` |
| 其他文件系统 errno | `FsError` `FS_IO_ERROR` |
| 启动进程的 `ENOENT` | 启动领域的 `*_NOT_FOUND`，例如缺少可执行文件 |
| JSON-RPC、HTTP 或 SDK 状态 | 对应该状态的领域条件，状态放入 `message` |
| 原生或 Win32 API 失败 | 调用领域的 `<OPERATION>_FAILED`，API 名与代码放入 `message` |
| worker 或进程边界 | 传输 `name` 和 `code`，再重建同一个类 |

错误经过多层时，由理解失败的最底层分类，上层保留。只为添加上下文才包装 `HarnessError`，并在包装错误上保留其 `name` 与 `code`。

## 修改已有代码

新增代码或类是兼容的。对已有 `name` 或 `code` 重命名、拆分、合并或重新分类，会改变持久化数据与分析：写入[升级指南](../../dsh-create-upgrade-guide/SKILL.md)，列出新旧值。不把已退役代码复用于另一含义。

## 检查清单

- [ ] 变化路径可达的每个预期失败都抛出 `HarnessError` 子类。
- [ ] 类继承 `HarnessError` 或领域类，并赋予字面值 `name`。
- [ ] 每个代码都是声明列表中的字面值，且指明一种消费者动作。
- [ ] 外来错误在其拥有者处转换并保留 `cause`，任何层都不丢弃 `name` 或 `code`。
- [ ] `message` 对模型可操作，且不含敏感内部细节。
- [ ] 测试对每个预期失败断言 `name` 与 `code`。
- [ ] 已有 `name` 或 `code` 变化有升级指南。
