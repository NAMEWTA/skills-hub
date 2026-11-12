# Herdr 文件协作的采用与适配

本页记录 `system-herdr` 的方法依据与必要改动；实际执行入口是 [SKILL.md](../skills/system/system-herdr/SKILL.md)。团队约定按本次用户要求收敛为 Lead、编号任务、对应报告和一份 pane 清单，适用于开发、调查及审查。核对日期：2026-11-12。

## 原有 Herdr 方法的保留

依据[父清单](../materials/manifest.tsv)固定的 Herdr 修订 `ee5bfb5041bb3e4a49d591c72308aae3c81ecdde`，对照[完整原件](../materials/herdr/upstream/SKILL.md)、[中文底稿](../materials/herdr/zh/SKILL.md)和[逐文件采用记录](../materials/herdr/manifest.tsv)。该原件的 Git blob 为 `4943e5575e941a7820ea01ca9416e79749c3ddc3`；本次未同步或改写原件、译文和父清单的版本。

原运行技能中的 CLI 方法整体移入 [CLI 参考](../skills/system/system-herdr/references/cli.md)，保留环境校验、帮助发现、布局、身份、跨机器作用域、启动、投递、等待、输出读取、关闭边界、错误处理，以及对应命令、示例、判断和数值。入口只承担选择与编排，不以简短摘要取代完整操作方法。

| 对应原文或既有本地扩展 | 本次处理 | 理由与适用范围 |
| --- | --- | --- |
| 原件的读取输出章节：扩大终端读取仍失败后，才要求临时 Markdown；初始提示不要求文件 | 普通终端交互保留后备方法；团队任务从首次派发就指定持久 task/report | 用户明确指定文件作为团队主通信渠道，直接修正冲突段落 |
| 原件的 `agent prompt --wait` 和 `agent wait`：跟踪稳定生命周期，不保证某个任务完成 | 原语义完整保留；Lead 必须读对应报告、产物和证据后才能标记完成 | 防止将投递成功、idle、旧一轮结束误作当前任务通过 |
| 原件的 agent_blocked：回答前询问用户 | 先读阻塞界面；已有授权和上下文足够就继续，缺少必要决定、权限或认证才询问 | 遵循仓库的持续执行和不重复审批规则 |
| 既有运行版追加的 Claude Code、Codex、Pi 固定启动命令，含默认权限绕过参数 | 改成沿用实际配置、核对原生帮助、参数放在 `--` 之后的通用入口 | 这些不在原件中；团队协议无需绑定客户端、固定模型或默认绕过权限 |
| 原件的 pane ID 只在单个服务端唯一、跨 workspace 移动会换 ID | 一个主题绑定一个服务端与共享根；保留旧记录与在途路径，新 ID 用新目录接后续任务 | 用户以 pane 为唯一行键，不能再把不同机器的同名 pane 混入一份清单 |

`runtime_paths` 只登记实际承载上述 Herdr 方法的入口与 CLI 参考。新的文件协议和团队模板是本地组合，不冒充原件已有内容；完成对照与验证后才更新 `runtime_reviewed_blob`。

## 复用的编排与交接方法

以下是用户先前要求研究的官方方法背景，不扩展 `materials/` 的六来源快照范围，不把网页引文或署名放进运行技能。

| 依据 | 沿用的方法 | 在本技能中的落点 |
| --- | --- | --- |
| [OpenAI：Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration) | 管理者保持最终答复与整合责任，将专家作为有边界的能力调用；确有收益才拆分 | Lead 默认推进主线，按需咨询；普通工作交接不转移整个主会话的控制权 |
| [Anthropic：How we built our multi-agent research system](https://www.anthropic.com/research/multi-agent-research-system) | 按独立上下文拆分；委派明确目标、边界、输入和输出；大产物持久化，只回传引用 | task 的上下文与可写范围、report 的证据与产物引用；只并行独立工作 |
| [Anthropic：Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) | 每次推进有边界的增量，留下可恢复产物；接手先读进度及实际状态，完成需要真实验证 | 同 pane 串行任务、不可覆盖的编号历史、恢复先核实产物、Lead 验收 |

本次采用这些原则并按用户要求落实为文件约定，没有移植 Agents SDK、Claude Code 原生 Agent Teams 的任务系统，或长运行示例中的 JSON 功能清单、Shell 初始化器。它们不是执行本技能的依赖。

## 明确属于本地约定的部分

- `.agents/system/herdr/YYYY-MM-DD-topic_name/`、`topic.md`、`task01.md/report01.md` 及按 pane 分目录：来自用户指定的持久化与通信形状。
- `manifest.tsv` 仅有 `pane_id/task/status`；`active/done/blocked` 是本地的简化进度词汇。active 包括等待启动和等待验收，不能冒称 agent 此刻正在计算。
- Lead 独占清单，worker 交回终稿后 Lead 才追加验收；同 pane 一次一项、返工新编号、重复提示复用报告、过期指针不执行：是将上述分工和恢复原则用于这个目录协议的必要细化。
- Windows 等文件系统无法原样使用 pane ID 时，在该主题统一采用可逆百分号编码；清单始终保留真实 ID。不新增会话身份字段。
- 四种场景模板仅改变任务拆分和验收重点；模型选择、专家触发条件与并发规模按实际任务确定，不声称官方规定了统一模型层级或升级次数。

模板不是一个确定性调度器。它减少协调开销，但不能保证任意客户端都可靠识别状态，也不能消除“动作发生后、报告写入前中断”的重复执行窗口；因此恢复要核对真实结果，尤其是外部写入。实际检查范围见[验证记录](validation.md)。
