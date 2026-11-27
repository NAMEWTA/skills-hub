# Home 方法归属

每种完整方法只由一个技能维护。调用者传递目标、作用范围、已有材料和返回条件，读取实际安装入口；资源相对引用与脚本导入留在单包内。

| 方法或资料 | 唯一 owner | 其他方法如何使用 |
| --- | --- | --- |
| Home 任务分流、派遣协调、直接交付和主题验收 | home-workflow | 按选定方法投递、核查并交 `home-tasks` 保存结论 |
| `coordination/` 主题、每轮 task/report、项目占用和 TSV 视图 | home-tasks | 记录 Home 直接任务，引用原派遣证据 |
| `repos.json`、`local.json`、按需生成或显式导出的项目登记地图 | home-setup | route 只读定位，doctor 只读检查；`repos.md` 可缺省，变更交 setup |
| Home Git 跟踪范围、基线与换机恢复登记项目 | home-setup | 用同仓技能读取正式资料，恢复时调用 route 核验项目身份 |
| `context/profile.md`、`preferences.md`、`dispatch/`、`team/`、`environment.md` | home-setup | 保存独立的派遣方式、team、默认及明确关联 |
| 实际路径、Git root/common dir、worktree、HEAD 与 remote 身份核验 | home-route | 按主 remote 首 fetch URL 核验，报告其他 remote 漂移；登记变更交 setup，不读取项目内部知识正文 |
| `relations.md` 与基于项目证据的影响分析 | home-map | workflow/integrate 引用方向、边界和证据，不从登记分组推断关系 |
| `notes/`、`inbox/`、`archive/notes/`、`exclusions.md`、知识派生索引 | home-knowledge | 保留来源、范围、核验与更正边界；配置更正交 setup |
| Home AGENTS 的格式、渐进式披露、读取条件、资料指针与可选 SOUL | home-knowledge | 按授权直接维护 Home 文档，配置继续由 setup 维护 |
| Home 根 AGENTS 的短指针及实际宿主接入 | home-setup | 完整初始化合并或复用，普通安装与局部配置保留根；遵循 knowledge 入口规范 |
| Home AGENTS 首次创建 | 安装器及 `scripts/persistence/home.md` 模板 | 仅补缺，技能升级保留已有入口 |
| `history/`、`archive/history/`、事件与历史查询入口 | home-history | 记录当时理由和结果，不以摘要替代当前任务状态 |
| 联合验证执行者、组合条件和真实结果核对 | home-integrate | 执行和原件归实际项目；Home 协调摘要由 workflow 保持 |
| 导航、登记、路径、结构和链接的只读检查 | home-doctor | 报告准确缺口，修复交所属 owner，不重复知识语义判断 |
| 实际投递、终端/会话、原始回执、恢复与清理 | 用户在当地选用的派遣方法 | Home 按原方法调用并核查投递结果 |
| 项目代码、内部知识、文档、技能与开发验收 | 实际项目与当地方法 | Home 委派查询/修改，保留基本管理结论及来源 |

## 跨 owner 的变更

一个用户请求可以涉及多个 owner。workflow 明确请求范围和先后依赖，复用用户已有授权；不会以“归别的 owner”为由把已经授权的工作留给用户。

用户更正长期偏好时，setup 改现行配置，knowledge 更新引用该偏好的现行主题，history 记录有价值的更正事件与当时理由。三者不分别保存可编辑的默认配置。无长期价值的变化不强制产生三个文件。

忘记请求同样逐一覆盖有关真源、候选、归档和派生入口。history 可读取排除依据以防旧事件重新导入，但排除依据由 knowledge 管理。未触达的外部源、原生会话或 Git 历史保留明确边界。

索引、地图与摘要的重建不拥有修改事实的权限。由来源丢失、日期过期或版本变化提出复核时，只核查相关断言；单次 HEAD 改变不使全部项目知识自动失效。

## 配置与执行

home-setup 复用本仓 dev-setup 的“保存意图、观察能力、核对实际生效”划分，并适配 Home 的资料位置。两者不因此共享第二份配置文件，也不修改 dev 既有方法。

Home 默认只在用户定义的 Home 作用范围内生效。项目收到上层任务后读取当地规则；它继续派遣时由当地有效规则决定。已有会话的实际设置只能通过该会话证明，不能用新配置文件冒充。

共享资源引用同一 owner 和同一预算。某层保留的角色表、项目数和子 Agent 数均不直接等于新的主机容量或额度。

## 安装与宿主

安装器负责部署完整技能、逐技能 Claude 兼容链接、按所选 domain 的导航及忽略规则。Home 主入口仅缺失时创建。home-setup 维护业务资料、Home Git 范围、完整初始化的根短入口和换机恢复。Home 提交可保存 `.agents/skills/` 本体，新机直接使用同仓技能。home-doctor 诊断实际入口及链接，语义修复交 knowledge，技能安装损坏交原安装机制。

入口 owner 不构成强制安装依赖。每个 Home 技能自带必要读取步骤，单装可执行本职责；只有确需其他方法的分支才调用其已安装入口。AGENTS/SOUL 的普通编辑不受原知识 CLI 主题写锁保护，按 knowledge 的读基线、最小编辑和回读方法处理。

安装契约见[安装说明](../usage/installation.md)，实际宿主加载与执行能力须按[验证说明](validation.md)取得证据。
