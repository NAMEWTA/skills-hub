# Herdr 协作与文件通信

<a id="herdr-方法采用与文件通信"></a>

`system-herdr` 用于控制 Herdr 的窗格和 agent，并通过任务文件派发工作、收取报告。完整 CLI、默认启动命令和通信规则统一维护在[技能入口](../skills/system/system-herdr/SKILL.md)，配套文件提供格式模板。

## 安装与运行前提

在目标项目根目录安装技能：

```sh
npx @namewta/skills-hub@latest install --skill system-herdr
```

这条命令安装技能文件，Herdr 程序和会话仍需由当前环境提供。只有用户明确要求使用 Herdr 时才启用该技能。执行控制命令前确认当前 agent 位于 Herdr 管理的窗格：

```sh
test "${HERDR_ENV:-}" = 1
```

检查失败时停止控制，不能从 Herdr 外部查看或操纵当前聚焦会话。检查通过后，先了解当前安装的 CLI 和服务端状态：

```sh
herdr --help
herdr agent
herdr pane
herdr status
```

相关命令组不带子命令时用于查看帮助。不要用裸 `herdr` 或省略修改命令参数来试探语法，后者可能直接执行默认操作。

## 选择目标与启动 agent

工作区、标签页和窗格负责布局，agent 名称标识窗格内被识别的程序。先读实时状态，再使用响应中的 ID 或唯一在线名称：

```sh
herdr pane current --current
herdr pane list --workspace "$HERDR_WORKSPACE_ID"
herdr agent list
```

默认沿用当前标签页、工作目录和用户焦点。按实际布局选择拆分方向，后台工作使用 `--no-focus`。`agent start` 只在已有可用 shell 窗格中启动程序，不创建布局。Claude Code、Codex 和 Pi 的默认启动命令及模型、推理参数见[技能入口](../skills/system/system-herdr/SKILL.md)，使用实际返回的 pane ID，保留用户指定参数。

跨机器时，先在目标机器查询 ID，后续查看和控制使用同一个 `--machine <label-or-id>` 前缀。机器标签来自已保存配置，不能用本地 ID 或当前聚焦状态代替远程目标。连接失败不说明操作未生效，重试前先核实状态。

## 选择通信方式

普通终端交互先使用 prompt、等待和输出读取。只有扩大读取范围后仍无法取得已完成响应时，才让执行者把结果写入临时 Markdown 并返回路径。

需要持久化派发与回复时，从首次投递就使用 task/report 文件。派发方称为 Lead，执行者称为 worker；Herdr 控制消息只传文件位置，任务正文、执行结果和恢复依据保存在共享目录中。有多个已确定的并行任务时，先全部投递，再观察和等待，避免逐个 `prompt --wait` 把工作串行化。

## 共享目录与任务身份

默认共享根为 `.agents/system/herdr/YYYY-MM-DD-topic_name/`。一个主题只对应一个 Herdr 服务端和一个共享根，各 worktree 的参与者使用同一绝对路径。远程派发前核实 worker 能读取任务，Lead 能读取报告；两台机器上的同名路径不证明文件共享。

| 文件 | 内容与写入者 |
| --- | --- |
| [topic.md](../skills/system/system-herdr/assets/topic.md) | Lead 维护连接上下文、Lead pane、共享根、目标、验收、约束和必要结论 |
| [manifest.tsv](../skills/system/system-herdr/assets/manifest.tsv) | Lead 维护每个已派发 pane 的当前任务和状态 |
| [task01.md](../skills/system/system-herdr/assets/task.md) | Lead 写清目标、输入、工作目录、读写边界、产物和验证要求，发布后保持不变 |
| [report01.md](../skills/system/system-herdr/assets/report.md) | worker 记录执行结果，交回终稿后由 Lead 追加验收 |

每个已派发 pane 使用独立目录，任务和报告采用相同编号，至少两位并逐次递增，不复用。完整任务身份包括共享根、真实 pane ID 和 task 文件名，报告必须写全。

pane 目录默认使用真实 ID。宿主无法原样表示时，整个主题在派发前统一使用 `encodeURIComponent(pane_id)`，manifest 仍保留真实 ID。目录名须是合法的单个路径组件，TSV 字段不能包含 Tab 或换行。同名主题先判断是恢复还是新任务，保留既有文件。

## 派发、执行与验收

`manifest.tsv` 使用真实制表符，三列固定为 `pane_id`、`task`、`status`。每个已派发 pane 一行，task 只写当前文件名，状态含义如下：

| 状态 | 含义 |
| --- | --- |
| `active` | 已派发、尚未验收，包括执行中和待审 |
| `done` | Lead 按任务验收要求确认通过 |
| `blocked` | 有明确阻碍，原因和下一步写在报告或 topic |

Lead 先写完整、自包含的 task，确认 pane 没有仍在执行的任务，再更新清单并通过 Herdr 投递绝对 task 和 report 路径。worker 读取 task、topic 和 manifest，核对服务端、pane、当前指针及完整身份，只执行这一个任务。无须安装本技能也应能理解任务文件。

worker 只写授权的业务产物和自己的报告执行部分，不修改清单、任务或他人记录。报告先写同目录临时文件，核对身份与内容后重命名为同号终稿，不覆盖已有终稿；完成后停止写报告并返回绝对路径。无法写报告时明确说明失败和已有产物，不能声称已经提交。

Lead 读取报告和真实产物，按任务要求验收后才把清单改为 `done`。worker 报告中的完成判断或终端生命周期不能代替验收。补充、返工、解除阻碍或换任务时，确认原执行者停止，再创建下一编号任务并引用前次结果；worker 不自行领取下一项。

## 观察、中断与恢复

等待失败、出现 `blocked` 或怀疑提示停滞时，先读取实际状态和输出：

```sh
herdr agent get <agent-name>
herdr agent read <agent-name> --source recent-unwrapped --lines 120
```

沿用已有授权处理受阻界面，只有必要决定、权限或认证确实缺失时才请求用户参与。prompt 成功只证明投递，`idle`、`done` 和 `blocked` 是终端状态，超时也不能证明任务未收到。结合 task、report 和真实产物判断，避免重复派发。

收到重复提示时，已在执行同一任务就继续原执行，已有身份匹配的终稿就只返回路径；过期指针或身份不符时停止。接手先读取主题、清单、当前任务和报告，并确认原执行者已经停止。没有报告不代表外部动作未发生，先核实产物与真实状态。

临时报告只提供恢复线索，不作为终稿。pane 移动导致 ID 改变时，保留旧目录和报告，结束或交回在途任务，再按新身份建立目录与任务并记录接续关系。Lead 交接时更新 topic 中的实际身份和必要结论，保留验收依据，不另建永久队列或轮询领单机制。

<a id="来源与完整性"></a>
<a id="必要适配与本地扩展"></a>

## 来源与许可

方法来源、贡献者归属和许可统一见[第三方声明](../THIRD_PARTY_NOTICES.md)。
