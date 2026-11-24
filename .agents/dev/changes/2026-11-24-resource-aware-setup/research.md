# 资源感知初始化与团队上下文研究

调研日期：2026-11-24。项目基线：[62aa895600d18891219af9e97046e393b8f66647](https://github.com/NAMEWTA/skills-hub/commit/62aa895600d18891219af9e97046e393b8f66647)，对应 v0.1.26；Git tree 为 `41f938f317ed3a0706f57adf2c0441da4a802dd8`。

本文说明本次改造采用哪些成熟机制、为什么需要适配，以及保留哪些边界。网页事实以调研日读取内容为准；实施结果和验证结论由本 Change 的证据记录承担。本文没有声称已完成修改、测试、推送或发布。

## 研究范围与判断

需求涉及三类不同约束：项目运行环境是否满足、执行主机还能承受多少工作、已完成工作占用的资源何时释放。Agent 数量、重任务并发量和 worktree 保留量应分别评估。模型服务额度和上下文 token 预算不能代替本机 CPU、内存、磁盘或进程容量。

本次采用官方产品的环境准备、显式并发限制和 worktree 生命周期机制，结合 Kubernetes 的可分配资源与预约思想、Google SRE 的过载处理方法，再接入本项目现有技能职责。该方案属于机制融合；没有完整复制某个上游技能或在项目中引入 Kubernetes 调度器。

## OpenAI 与 Anthropic 的可迁移机制

| 一手来源 | 调研确认的事实 | 本项目适配依据 |
| --- | --- | --- |
| [OpenAI 配置参考](https://learn.chatgpt.com/docs/config-file/config-reference.md) | `agents.max_concurrent_threads_per_session` 限制单会话并发派生线程，不含主线程；`agents.max_threads` 是旧别名。角色可以使用独立配置层；显式派生参数优先于默认子代理设置。 | 资源预算需注明是否包含 Lead。原生参数只控制其声明范围，不能代表跨会话、跨 CLI 的主机总上限；应用参数前核对已装版本及作用域。 |
| [openai/codex 固定配置定义](https://github.com/openai/codex/blob/6aaf2a86b198bb0ee8f9d995e79155ad5c7f6357/codex-rs/config/src/config_toml.rs) | `AgentsToml` 中的 `max_concurrent_threads_per_session` 字段带 `serde(alias = "max_threads")`，与配置参考中的别名关系一致。 | 以固定源码交叉核实精确字段，避免网页渲染或检索遗漏被误当作不存在。文件 blob 为 `edff672e72291e2811d36b53dd1ca56e8d5b1bad`；这不证明用户所装版本已支持该字段。 |
| [openai/codex 配置源码](https://github.com/openai/codex/blob/main/codex-rs/core/src/config/mod.rs) | `effective_agent_max_threads` 根据 multi-agent 版本解析限制；内部总槽位与派生线程限制存在换算。 | 不把运行时槽位、配置值和主机预算机械等同，不固化当前源码默认值。该链接跟随主分支，用于解释机制；没有将其视为本次固定代码同步。 |
| [OpenAI 本地环境](https://learn.chatgpt.com/docs/environments/local-environment) | 新 worktree 需要独立准备依赖和未纳入 Git 的运行文件；setup scripts 可随创建执行，并可按操作系统区分。 | `dev-setup` 分开检查项目声明、主 checkout 和实际执行 worktree。环境初始化也是重任务，不能创建多个 worktree 后无预算地同时安装、构建。 |
| [OpenAI worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees) | 每个 worktree 的文件、依赖和缓存消耗磁盘。管理型 worktree 有可配置保留数量，保护进行中和 pinned 的会话，删除前保存快照。 | 接入现有回收流程时保留活动、保留标记与成果保护条件。数量策略不能代替实际磁盘和内存评估。 |
| [Claude Code subagents](https://code.claude.com/docs/en/sub-agents) | 支持原生子代理并发限制，但 resume、会话内 fork、team teammates 与其他功能的计数和准入范围不完全相同。`isolation: worktree` 提供工作树隔离，无修改的临时树可自动清理。 | 预算覆盖嵌套 Agent、恢复的 Agent 和它们启动的工具进程。读取到一个并发参数不足以证明整台机器已有资源保护。 |
| [Claude Code agent teams](https://code.claude.com/docs/en/agent-teams) | 队员拥有独立上下文；任务细节需要随派遣传递，Lead 的会话历史不会完整继承。队员支持有序关闭，团队规模建议基于协调成本与收益。 | 派遣携带任务、所选上下文和资源约束。资源回收先结束所属任务进程，再处理工作树；不把团队规模建议当硬件容量结论。 |
| [Claude Code worktrees](https://code.claude.com/docs/en/worktrees) | 清理检查变更、未跟踪文件、子模块工作和新提交；发现其他活动会话时保留。运行中的工作树持有 Git lock；其清扫只释放自身设置且会话已退出的旧锁，不释放用户手工锁。 | 复用现有清理方法并核对会话、进程身份和所有权。已合并只是清理条件之一，不能覆盖活动会话、未保存成果或未知锁。 |
| [Claude Code skills](https://code.claude.com/docs/en/skills) | 技能正文按使用加载，详细资料适合包内 supporting files。跨宿主使用时需区分 Agent Skills 标准元数据与 Claude 专属扩展。 | 技能入口保留触发条件与步骤，探测项、预算推导和例外归包内参考；相邻技能调用唯一方法，不复制完整资源规范。 |

这些来源没有给出适用于所有项目的“每 Agent 固定消耗多少内存”的保证。依赖安装、语言服务、浏览器和构建 worker 的峰值必须计入实际工作负载。

## Google、Kubernetes 与 Linux 的容量依据

| 一手来源 | 调研确认的事实 | 本项目适配依据 |
| --- | --- | --- |
| [Gemini CLI 配置](https://geminicli.com/docs/reference/configuration/) | 配置存在不同作用域。`advanced.autoConfigureMemory` 调整 Node 内存配置，仅读取全局用户设置，忽略 workspace 覆盖。上下文文件支持分层加载和显式导入。 | 初始化记录真实运行时和生效范围，不擅自全局调整 Node 堆；团队文档采用显式引用，避免在自动加载入口中导入全部团队文件。 |
| [Gemini CLI Git worktrees](https://geminicli.com/docs/cli/git-worktrees/) | 每个会话可使用独立工作树，共享 Git 历史；每棵新树需要项目环境准备。退出保留工作树与分支，完成后的清理由用户工作流负责。 | 不能把“CLI 会话退出”当作“磁盘已回收”。统一回收入口必须检查实际目录和 Git 登记状态，并复测释放结果。 |
| [Gemini CLI sandbox](https://geminicli.com/docs/cli/sandbox/) | 提供多种沙箱后端；容器参数和挂载位置受实际后端影响，容器内运行还涉及宿主机路径对应。 | 区分当前执行环境、容器限制与物理宿主；沙箱存在不等于已配置资源上限，也不等于项目依赖已准备好。 |
| [Kubernetes 系统资源预留](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/) | Node Allocatable 在节点容量中扣除系统预留、组件预留和驱逐阈值等；调度使用可分配资源，而非标称硬件总量。 | 为系统、桌面和既有服务保留余量，再计算可新增工作。只借鉴预算方法，不要求项目安装集群或照搬示例数值。 |
| [Kubernetes 资源 requests 与 limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) | 调度按已预约的资源判断是否还能放置工作，即使当前使用量低也可能拒绝。requests 与运行时 limits 的用途不同。 | 同时考虑当前可用资源和已承诺但尚未达到峰值的占用；工作流预算与系统硬限制分别记录，避免并行任务同时把一份空闲量重复分配。 |
| [Google SRE：Handling Overload](https://sre.google/sre-book/handling-overload/) | 工作请求的资源成本不同，固定请求数未必能代表容量。文档主张直接测量资源，并在过载时降级、转移或拒绝工作。 | 将 Agent 会话、安装构建、测试浏览器等分开估算。资源不足时停止新派遣、减少重任务并行或等待，不用持续重试扩大负载。 |
| [Linux cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | 资源控制是分层的，子组不能扩大祖先施加的限制。`memory.max` 是内存硬限制；达到限制且无法回收时可触发组内 OOM。 | 在容器或受限执行环境内核对当前组和祖先组的有效限制，不能只读物理内存。未知限制保留为未知；纯技能文档不声称提供 OS 级强制隔离。 |

分布式主机按各自执行位置计算预算。不同主机的可用内存不能相加后用于一台机器；共享文件系统、共同宿主或共同容器父组还需要共同约束，避免重复记账。远程检查只覆盖用户指定的主机，连接失败的主机没有已验证容量。

## Git 与成熟技能仓库的生命周期参考

| 来源 | 调研确认的事实 | 本项目适配依据 |
| --- | --- | --- |
| [Git worktree 手册](https://git-scm.com/docs/git-worktree) | `list` 可展示工作树、分支、锁与可清扫状态；`remove` 删除工作树，默认保护未提交和未跟踪文件；`prune` 清理缺失工作树的管理信息。lock 可保护暂时未挂载的网络或可移动存储。 | 枚举、删除目录和清理 Git 登记是不同动作。清理流程不能把 `prune` 当作磁盘目录删除，也不能仅因路径不可见就解锁或删除远程工作树。 |
| [superpowers using-git-worktrees](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/using-git-worktrees/SKILL.md) | 先识别已有隔离环境，再优先使用宿主原生工具，最后才回退 Git。方法包含子模块识别、工作树目录忽略规则、环境初始化与基线检查。 | 沿用已有隔离和宿主所有权，不在现有工作树中重复创建新树。环境初始化纳入资源准入，验证按本项目变更风险执行。 |
| [superpowers finishing-a-development-branch](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/finishing-a-development-branch/SKILL.md) | 集成前识别环境与父分支，按工作树来源决定清理责任；PR 待反馈时保留，删除遭遇未保存内容时不自行强制清理。 | 复用现有集成和回收技能，保留真实父分支、成果状态与宿主所有权证据。项目已有授权继续执行，不引入重复的固定选项菜单。 |

superpowers 固定提交为 `22f0b463e7a5e579904dd6211a520321035526f7`。本次核对的 `using-git-worktrees/SKILL.md` blob 为 `1381dacb3516b94382dd6ec736ede21ee8ede2b3`，`finishing-a-development-branch/SKILL.md` blob 为 `fa8aecaf8813f1b19d19996f7957d1b0121f2d9c`。这里记录机制参考，不表示同步了整棵来源材料树或完整复制上游正文。

## 适配决策与职责

以下属于本项目设计决定，不是上述厂商共同定义的统一协议。

| 需求 | 建议归属与约束 |
| --- | --- |
| 当前主机及用户指定远程主机的环境与容量检查 | `dev-setup` 持有完整方法。保存带时间、执行位置和未知项的资源事实，读取项目真实运行时要求，分别给出 Agent、重任务和 worktree 的容量依据。 |
| 多任务并行 | 协调者在派遣前使用有效预算，考虑所有相关会话、嵌套代理和工具进程。只能在依赖关系与资源约束同时允许时并行；将预算不足明确表达为排队或阻塞。 |
| 首次运行或缺少峰值样本 | 不编造每 Agent 内存值。先读取已有运行证据；有足够资源时以代表性串行任务校准，没有依据时不承诺更多并发。容量可以为零。 |
| 快照失效与资源压力 | 在新增派遣、创建或初始化工作树、重任务开始和回收完成后复测。负载异常时停止接纳新工作，记录已采取的缩减与剩余占用。 |
| 已完成并已合并的工作树 | 沿用已有回收入口。验证指定父分支、成果保存、活动会话、锁与进程所有权后，结束所属进程并清理。实际成功后才释放预约并更新容量。 |
| 不同任务的团队模型约定 | 使用 `.agents/dev/context/team/<team_name>.md` 普通上下文文件。用户要求创建但没有命名时按 topic 生成名称；只有明确指定的文件参与本次任务，不扫描、合并或默认加载其他团队文件。 |
| 技能结构 | 完整方法归唯一持有者。相邻技能仅保留本阶段需要的读取条件、准入与返回责任；团队模型策略不重复塞入 `dev-build` 等阶段技能。 |

团队文件表示用户选择的协作上下文，不因存放在该目录就成为运行时原生配置。未显式指定时沿用实际宿主设置，不自行选择固定模型。已有用户文档和历史记录需要保留真实引用，不能为目录统一无条件覆盖或删除。

## 参考后不直接采用的做法

| 做法 | 不直接采用的原因 |
| --- | --- |
| 固定使用工具默认并发数或官方团队规模建议 | 作用域、计数方式、项目负载和宿主资源不同，不能推导安全机器容量。 |
| 将 Codex 默认保留 15 个 worktree 作为统一上限 | 这是产品保留策略。大型依赖与构建缓存可能先耗尽磁盘，小项目也可能允许不同数量。 |
| 每次创建工作树、集成或发布都追加固定确认菜单 | 本项目要求沿用已明确的用户授权和有效决定。只对真实未决、破坏性事项处理确认，不因参考技能有菜单就重复阻塞。 |
| 默认读取或聚合全部团队模型文件 | 会把不同 topic 的选择混入同一任务，违背用户显式引用要求；也可能意外覆盖实际宿主配置。 |
| 为缓解内存问题全局扩大 Node 堆 | 单进程堆配置不等于整机多进程预算；扩大后可能增加并发峰值。Gemini 的该配置还具有全局作用域。 |
| 在 setup 新建另一套全局清理器 | 会形成与已有交付清理流程竞争的所有权和删除判断，应复用唯一入口。 |
| 将技能预算描述为绝对防崩溃保障 | 外部进程、突发负载和不受此工作流控制的会话仍可能消耗资源；系统硬限制需要真实运行环境支持。 |

## 验证边界

本研究通过官方文档和固定上游技能正文核对机制，没有在用户实际宿主机、远程主机或多 CLI 混合环境上测量峰值，也没有执行这些环境中的工作树删除或进程清理。实施验收应核对未知容量、容器限制、重复派遣、任务恢复、共享磁盘、未保存工作和外部所有权这些分支；具体运行结果写入对应 evidence，不由来源引用代替。
