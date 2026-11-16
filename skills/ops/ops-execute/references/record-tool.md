# 本地记录助手

## 能力与前提

[ops-record.mjs](../scripts/ops-record.mjs) 使用 Node.js 22.14+ 标准库，仅在指定工作根的 `.agents/ops/runs/` 保存 Markdown。它不联网、不启动 SSH、不运行输入字符串、不管理远端锁，也不会从文本中判定授权、领域边界或服务健康。

先核实真实已安装的脚本位置和 Node 版本。以下示例在运维工作根运行，完整安装时工具位置为 `.agents/skills/ops-execute/scripts/ops-record.mjs`。如果技能安装在其他被明确允许的位置，读取真实路径，不从父会话的加载状态推断可用。

```bash
node .agents/skills/ops-execute/scripts/ops-record.mjs --help
```

输入由本次调用者准备的 UTF-8 Markdown 文件提供，每份最多 1 MiB，先脱敏。工作根必须是已有真实目录；其路径和记录路径不能经过符号链接。文件记录依赖可信本地目录和操作系统权限，不提供恶意同权限写入者隔离或跨主机文件系统保证。

run、step、writer 标识使用 1–96 位字母、数字、点、下划线或连字符，首位为字母或数字；run ID 的 `none` 保留给无父任务标识。单份累积记录最多 16 MiB，超出时保留原件并使用真实证据引用，不截断历史。

## 创建主 run 或子 run

依据[请求模板](../assets/run-request.md)准备真实请求文件，例如 `request.md`。该文件是本次输入，不属于安装包。没有目标的首次发现写明尚未核验。

```bash
node .agents/skills/ops-execute/scripts/ops-record.mjs init --root . --run 2026-11-16-host-check --writer ops-coordinator --request-file request.md
```

工具生成 `run.md` 和空的 `steps/`，先完整写入临时目录再发布。已存在的 run，包括不完整或空目录，都不会被覆盖；先核实其现场。初始化失败不能当作允许现场操作。

独立工作者已有真实父任务时，使用新 ID 和 writer 并加 `--parent 2026-11-16-host-check`。父任务必须存在。内部技能切换不新建子 run，只有独立会话需要独立写入时才使用。

## 追加步骤

按[步骤模板](../assets/step.md)准备 `observation.md`。计划、请求已接受、最终验证和更正都可以是不同的步骤；ID 推荐带顺序，如 `001-plan`、`002-accepted`、`003-verified`。

```bash
node .agents/skills/ops-execute/scripts/ops-record.mjs append --root . --run 2026-11-16-host-check --writer ops-coordinator --step 001-observation --file observation.md
```

同名步骤始终拒绝覆盖；错误或新的验证追加另一个步骤并引用前者。工具生成的 `recorded_at` 是保存时间，正文写真实发生时间。重试必须有独立 attempt/步骤，不能把旧未知记录改成成功。

运行中没有本地写能力但已有后端完整保存 execution 时，依[记录契约](record-contract.md)保持后端引用和待补状态；不要另写一个绕过检查的临时执行器。

## 查看与更新汇总

```bash
node .agents/skills/ops-execute/scripts/ops-record.mjs show --root . --run 2026-11-16-host-check
node .agents/skills/ops-execute/scripts/ops-record.mjs summarize --root . --run 2026-11-16-host-check --writer ops-coordinator --file summary-input.md --expected none
```

show 为只读，输出 run.md、步骤路径、当前摘要及各自 SHA-256；它不会查询远端，也不判断记录是否仍反映现场。原始步骤直接按输出路径读取。摘要使用[结果模板](../assets/summary.md)，必须指向真实步骤和证据。

首次摘要使用 `--expected none`。更新已有摘要时，重新读取 show 输出，将对应的 **summary.md SHA-256** 传给 `--expected`。若其他写入已经改变摘要，工具拒绝覆盖；重新读事实再汇总，不以强制重试丢弃更新。

run.md 的摘要与 summary.md 的摘要是不同值，不要混用。摘要只防止读后覆盖，不证明内容正确，也不保证远端动作幂等。

## 转交记录责任

核实原会话不再写入、原后端任务和目标状态后，按[写入交接模板](../assets/writer-handoff.md)准备 `handoff.md`。show 读取最新的 **run.md SHA-256**：

```bash
node .agents/skills/ops-execute/scripts/ops-record.mjs handoff --root . --run 2026-11-16-host-check --writer ops-coordinator --to ops-successor --reason-file handoff.md --expected <run-md-sha256>
```

尖括号表示应替换的值，不是可直接执行的命令文本。交接在本地写锁内检查旧 writer 与已读内容摘要，原子更新当前 writer，并在 run.md 追加交接事实；初始请求和 `created_by` 保留。旧 writer 后续写入被拒绝。

工具不会认证你是否真是旧会话，也不会自动核实或停止远端操作。writer 是协作标识；实际的账号权限、任务授权和共享资源锁由现有机制处理。原会话是否已交出责任需要真实证据，不能仅凭知道其 writer 名称就抢占。

## 文件与错误语义

| 情况 | 行为 |
| --- | --- |
| run / step ID 越界、缺少 writer、输入为空或过大 | 在变更相应记录前拒绝 |
| 记录目录或文件是符号链接，文件不是独立普通文件 | 拒绝，不写到其他目录 |
| run 已存在或步骤同名 | 拒绝，保留原记录 |
| 当前 writer 不符 | 要求真实交接，不覆盖 |
| 摘要或交接的 expected 已过期 | 拒绝丢更新，重新读取 |
| 本地写锁存在 | 拒绝并发写入，不按超时自动抢锁 |
| 文件已发布但同步失败 | 返回错误；先核实原路径，不能自动重放现场动作 |

退出码 0 表示本次本地记录操作完成，退出码 1 表示错误；两者都不表示远端业务成功或失败。新文件以完整内容原子发布；目录或原子操作不被文件系统支持时明确失败，不降级为直接截断写入。正常结束释放本地锁，崩溃残留按[中断方法](interruption.md)核实。

只读 show 连续读取多个文件，可能观察到新的步骤或摘要，不提供整个 run 的跨文件事务快照。并发取证需要明确查询截点；最终汇总在已确认的单写入者下完成。

## JavaScript 接口

控制端验证或已有 JavaScript 工具可从脚本导入下列函数；它们与 CLI 使用同一方法，不引入独立日志。

| 函数 | 参数要点 | 返回 |
| --- | --- | --- |
| `createRun` | `{ root, runId, writer, request, parentRunId? }` | 原始记录路径与 SHA-256 |
| `appendStep` | `{ root, runId, writer, stepId, content }` | 已发布步骤路径与 SHA-256 |
| `summarizeRun` | `{ root, runId, writer, content, expected? }` | 新摘要路径与 SHA-256；默认 expected 为 none |
| `handoffRun` | `{ root, runId, writer, to, reason, expected }` | 新 writer、run 路径与 SHA-256 |
| `inspectRun` | `{ root, runId }` | 原始记录、元数据、步骤内容及当前摘要 |
| `parseRecord` | 工具生成的记录全文 | 仅解析受控 Markdown 头与正文，不执行内容 |

元数据头只保存记录身份与时间，不是工作流 DSL。业务目标、三维结果、授权和证据仍是可读 Markdown，所有语义判断由对应方法负责。
