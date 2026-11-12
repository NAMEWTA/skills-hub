# 变更日志

Speculo 的所有重要变更均记录于本文件。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)。

## [3.0.0] - 尚未发布

### 破坏性变更

- 将 SpecDev 与 Ops 合并为一个从需求到部署的领域。在四个精简领域路由之后重写全部 39 项 Work 能力，提供可独立选择的标准 Skill 入口。
- 移除工作流 manifest、业务 schema／验证器、派单编排、生成的 Canonical 文档和固定交接表单。保留目标规划、拆分及所有其他任务方法，不再要求强制执行协议。
- 使用一份可选发布记录、当前知识（ADR/context/error/design）、可复用环境笔记和历史归档。设计可继续以代码存在；不再要求 change 内的 DESIGN 文档。
- 将已批准的 UI 结构和明确要求的用户验收保留为真实交付义务。技术检查不能认证其中任一决定（#105、#106）。
- 重写八个显式命令、全部 15 个保留的工具技能和维护者指导。保留专业参考、原始来源语料、设计示例和有用工具；移除随包编排适配器。

### 安装

- 直接从文件和标准头部元数据发现领域与 Work 方法；保留原有简短 Work ID。保留原子安装、所有权、路径安全、投影和恢复。
- 将所有用户运行数据作为不透明字节保留，包括旧工作流数据。普通刷新将旧 Ops 领域及全部五个 Work 选择映射到其 SpecDev 后继，保留其他 Work 选择并移除退役编排投影；显式旧 Ops ID 会收到替代指导。
- 移除生成的工作流／运行时包及其 AJV/esbuild 构建依赖。验证真实包的安装、刷新、移除及完整 Hub 资源。

详见[升级说明](../upstream/docs/upgrade-v3.md)和[研究决定](../upstream/docs/research.md)。此条目不表示已向 npm 发布。

## [Unreleased]

## [2.1.17] - 2026-11-04

### 新增

- 新增 writing/align-intent Skill，供审查用户意图复述，区分明确要求与 AI 推断，并在依赖工作前纳入纠正。包含研究来源与澄清示例。

### 变更

- 更新 Hub 清单和包验证，覆盖 17 个完整 Skill 包。

## [2.1.16] - 2026-10-29

### 修复

- 刷新时保留按月份分组的历史 SpecDev 归档，不将月份视为 Change 身份。为冲突检测保留可识别历史身份，并保持旧记录只读。
- 将归档索引文件作为不透明运行数据保护，报告已有安装中的路径冲突。重新生成共享运行时和便携 SpecDev 文档。

## [2.1.15] - 2026-10-29

### 变更

- 将 ASD-STE100 Issue 9 表达原则用于 Learning 讲解和 SpecDev 学习导读，保留用户语言，区分清晰表达与经验证的合规。
- 整合 Learning 课程、提问和 Goal-Plan 指导，以及 SpecDev 产物、审查、错误处理和原型指导，同时保留其所有权、限制和验证要求。
- 从来源重新生成 Learning 和 SpecDev Canonical 文档。

### 修复

- 保留具体盲点分析与脚手架要求，编译或评估课程合同时加载教学政策。
- 明确设计树轮次推进，在共享组合协议中保留完整原型资源与浏览器验证指导。

## [2.1.14] - 2026-10-29

### 变更

- 将协调改为 Agent 主导：按实际任务需要选择直接执行、普通工具并行或委派，再选择已授权通道。将已保存协调选择视为必要约束内的偏好，增加可选 `allowed_modes` 项目限制。
- 分离 Ticket 拆分、调度、Agent 分配、执行通道和工作区。允许同一 Lead 或被委派 Agent 完成多个 Ticket，同时保留每个 Ticket 的就绪性、证据和验收；每个 change 复用一个已选工作区。
- 在实现、完成和恢复阶段应用风险适配标准与规格审查。低风险工作允许自审，高风险工作或明确要求仍保留独立审查者；证据的实际交付输入变化时，使其失效。
- 渐进发现可选 Skill，不强制扫描目录或重新规划；为必要的安全、用户和验收方法保留固定输入与实际执行证据。
- 允许已就绪的父计划生产者推进，即使未来消费者仍为草稿。分别报告合格候选、冲突与建议批次；在依赖、所有权和 Gate 约束内，仍可选择其他合法批次。
- 短时同步只读委派使用可关联的内联返回；异步、写入、跨会话、可恢复或正式交付任务使用持久化 TASK/REPORT 交接。对齐 Herdr 与 Orca 入口，重建便携 SpecDev Canonical 文档和共享运行时，并增加回归及宿主观测评估夹具。

### 修复

- 持久化任务目录仅允许 `TASK.md` 和 `REPORT.md`；REPORT 可含经核验的可选 `Session log:` 头部，替代独立定位文件。拒绝意外交接条目，保留 Lead 对实际结果的验收。
- 将 Herdr 的 Claude 和 Codex 启动限定在受管窗格，默认启动不带绕过权限的参数；历史参数示例仅在明确授权且已从已安装 CLI 帮助确认后保留。

### 升级说明

- 持久化派单验证拒绝任务目录中的额外文件，包括旧 `session-locator.json`。保留历史记录；新派单使用当前双文件格式，不自动重写旧交接。
- 不自动迁移已有用户运行产物。确定性回归夹具与新宿主观测合同不能认证实际宿主执行或模型质量；真实证据提供前，宿主观测案例仍未评估。

## [2.1.13] - 2026-10-27

### 变更

- agent 协调默认使用当前宿主，包括原生子 agent 和团队能力；直接 AI CLI、Herdr 和 Orca 仍作为单独选择的模式。
- 项目 CLI 偏好可记录所选工具及无头或交互调用方式。外部派单继续保留 TASK、REPORT 与可选经核验会话定位信息，Lead 验收和独立审查不变。
- CI 升级至 actions/setup-python v6 和 actions/upload-artifact v7。合并 read-cmd-shim 更新分支，同时保留 5.x，以维持声明的 Node.js 兼容范围。
- 从更新后的协调合同重建便携 SpecDev Canonical 文档与共享运行时。

### 升级说明

- 项目协调偏好现使用 schema v2，`host` 取代旧 `lead` 模式。已有 v1 协调文件保留但被拒绝，不自动迁移；建立 v2 配置前审查并备份旧选择。

## [2.1.12] - 2026-10-26

### 修复

- 即使本地内容、普通权限或文件存在性不同，也从运行中的包刷新受管 Workflow、Command、Work、Hub 与发现文件。修复仅模式变化的投影冲突，避免反复保留未变条目。
- 取消能力选择时移除已编辑的受管文件，同时保留运行数据与用户新增内容。继续保护第三方冲突、不安全节点及并发事务漂移，回滚时恢复真实的刷新前内容。
- 从安装记录发现已安装工作流，以修复损坏方法入口；澄清刷新与 doctor 指导。

## [2.1.11] - 2026-10-25

### 变更

- 在安装的项目手册中新增共享变更影响与范围合同，要求修改已有功能前检查调用者与依赖、识别受影响文件，并作最小充分修改。
- 在 SpecDev 规划、任务、实现和审查中应用该合同，保留已有产物所有权与授权边界，排除无关重构。
- 重新生成便携 SpecDev Canonical 文档，验证仅核心安装、手册刷新、直接 Work 引用及隔离编译依赖。

## [2.1.10] - 2026-10-25

### 变更

- 在安装的项目手册中新增共享研究与复用合同，使规划、设计、文档和实现都可使用已有实现发现、定向外部研究与原始来源引用。
- 将所有直接 SpecDev Work 和可复用研究技能连接到共享合同。在访谈、原型、Spec、任务、实现和审查各自已有的归属产物中保留来源链接与复用决定。
- 重新生成包含完整共享合同的便携 SpecDev Canonical 文档，验证仅核心安装、手册刷新、直接 Work 引用及隔离编译依赖。

## [2.1.9] - 2026-10-24

### 变更

- 将文档、知识和归档维护整合到 `project-maintenance`；以上游评估 `upstream-assess` 替换上游同步，并通过 `speculo-feedback` 处理框架反馈。
- 分离 SpecDev 请求评估与专门 Delivery Work；后者负责已授权 Issue、PR 和发布操作，共用 GitHub 传输与持久化交付记录。
- 加强复盘会话证据、溯源与知识毕业；为九个 Command 和 39 个 Work 更新工作流路由、Canonical 导出、安装检查和文档。
- 扩充 Clash 客户端配置的 AI 规则模板。

### 移除

- 移除独立工程标准构建器。退役已被替代的 Command 入口，记录维护、评估和反馈操作的负责方。

## [2.1.8] - 2026-10-20

### 变更

- 在发现、安装、doctor 和便携资产间统一当前工作流 manifest 与能力配置验证。领域生命周期仍归原负责方，从源码重新生成共享运行时、验证器与完整 Canonical 文档。
- 将已就绪的 Direct Spec 与已批准原型后续工作路由到 Implement，保留实际未提交交付快照，集中共享 SpecDev 协调。新增正确类型的父 Map、Plan 和聚合 Evidence 模板，提供结构化、范围感知的调度诊断。
- 按 Change 隔离 Person 咨询状态和阶段证据。基于精确摘要发布已验证候选，仅合并当前咨询的活动条目，保留原始五阶段方法、问题要求和原文来源。
- 安装与独立工具共享无依赖 OPS 资源语义。分离包、已安装方法和显式状态根检查；使用受控诊断分类和项目负责的业务验证配方保留未知探测结果。
- 将确定性的已安装 CLI 产物场景接入 CI，保留实际进程日志、文件清单和失败。区分夹具就绪、产物检查、已认证观测 Gate 与发布授权。
- 使命令根发现与领域委派自包含。即使首次使用 stdin 配置和 Git 合并分析，上游 dry-run 仍保持字节不变；源码打包入口在两种模块环境中均以 CommonJS 分发。
- 终端依赖升级至 `@clack/prompts` 1.8.1、`string-width` 8.3.0 和 `wrap-ansi` 10.0.2。

### 修复

- 使用当前 Clack API 保留不同的安装完成、取消和失败结果；保留现有中文键盘提示，不重复提问，移除过时颜色库补丁。
- 使 Learning 整合具备日志与恢复能力：精确输入摘要、自有锁、完整后代定位、幂等续接／回滚及并发漂移保护。重新检查终态事务方向，不接受相反方向的完整图像。
- 验证 Learning 时间预算、真实来源／目标引用、精确提交标记、冻结原始答案和延迟保持证据。要求明确且受支持的即时结果；已审查、错误或阻塞的 Homework 不能默默认证掌握。
- 修正已安装包中 Media Python 渲染器的共享工具路径。将报告绑定到实际输入与执行身份，最终交付必须消费完整审查 Gate、预览／静帧字节、媒体签名及声明的产物依赖。
- 拒绝悬空 Person 状态、候选和锁符号链接，不替换它们；通过异步模块边界加载包负责的咨询验证器。

### 移除

- 更新活动消费者后，移除未启用的内核／检查点合同、旧 SpecDev JSON 权威读取器与转换器、TASK v1 适配器及过时执行分支。拒绝未知或混合的当前协议，不重写用户记录。

### 升级说明

- 这是有意的合同清理，不转换旧协议。当前工作流 manifest 使用 schema 2，SpecDev Goal Plan 使用 schema 8，Implementation Plan 使用 schema 3；当前 Media 渲染／审查报告使用 schema 2。咨询按 Change 保存运行事实，不再使用全局标量。保留历史或未知业务文件，继续受影响写入前由其负责方协调。
- 完整 Canonical 导出和全部 16 个 Skills Hub 包仍可用。机械夹具和离线渲染不能认证真实模型行为、语义审查质量、人工批准或外部发布。

## [2.1.7] - 2026-10-19

### 修复

- 从包声明的 JavaScript 入口恢复 Volta 自更新，不再把 Windows npm 命令 shim 传给 Node.js。

## [2.1.6] - 2026-10-19

### 修复

- 交互检查发现新版本时，始终提供“立即更新”或“稍后更新”，检查安装所有权前明确显示当前与最新版本。稍后更新继续原交互，下次再次提醒；旧忽略版本偏好不再抑制提示。
- 识别经过核验的 Volta 管理 npm 安装以自更新，保留当前 Node.js 运行时，验证更新后的包并恢复原命令。普通 npm 全局更新显式固定已核验前缀。

## [2.1.5] - 2026-10-19

### 新增

- 随包加入精简 ELI5 教学 Skill，包含 lesson、explain、explore 和 tutor 模式、可复用模板、合成示例与可选只读验证。保留教学、提交、原答案保护和持久化规则，省去冗余文档及历史构建／评估文件。

### 变更

- 更新 Hub 安装与包验证，覆盖 16 个完整 Skill 包，包含两个支持目标中的 ELI5。

## [2.1.4] - 2026-10-18

### 修复

- 随包 Herdr Skill 的 Codex 启动示例传入 `--no-daemon`，切换账号时绕过共享守护进程。

## [2.1.3] - 2026-10-18

### 新增

- 新增公共 coordination-init 命令，供全部工作流共用一个项目级默认编排方法。
- 新增独立于工作流的 TASK v2 验证和会话存储，支持任意规划、任务、讲解、审查及交接任务，保留旧 SpecDev TASK v1 适配器。
- 新增显式请求的共享交接方法，更新每个可写 change 的 handoff.md，并在跨多个 change 或没有 change 时保留整会话摘要。

### 变更

- 将编排初始化移出 SpecDev 工程设置；运行时选择工具、模型、任务顺序和 Skill，保留领域所有权与验收 Gate。
- 允许 worker 直接写入已分配产物，Lead 验证和原领域网关维护正式状态与 Evidence。
- 为共享协调能力更新工作流路由、文档、Canonical 导出及隔离安装／包检查。

## [2.1.2] - 2026-10-17

### 发布

- CI 改用 npm 暂存发布并核对暂存记录；维护者在官网以 2FA 确认后公开上架，GitHub Release 标注待确认状态。

### 新增

- 在交互安装和文本诊断前检查稳定 CLI 更新，总网络时限两秒，提供更新／跳过／忽略选择。
- 将已核验的 npm 全局安装升级到显示版本，验证后按原参数和工作目录恢复原命令。

### 变更

- 将忽略版本存于项目之外，保留显式 `version` 检查，脚本、CI、JSON、help、resolve 和 recovery 跳过自动检查。
- 使用 SemVer 比较和有界注册表响应；与 fastcli 共用终端颜色与键盘约定，避免安装向导重复版本提示。

## [2.1.1] - 2026-10-16

### 变更

- 以 Clack 组件、一致颜色及更清楚的中文指导统一 CLI 提示、帮助、版本信息、安装摘要和诊断。
- 在 Workflows 旁显示 Skills Hub 分类；打开分类选择单个 Skill，跨次访问保留选择，并可从总览直接切换工作流。
- 按终端高度调整选择列表，按显示宽度换行中文和彩色文本，简化安装预览，同时保留移除与冲突详情。

### 修复

- 标准输入或输出重定向时跳过交互提示与动画，使管道输出和机器可读 JSON／路径结果不含装饰。

## [2.1.0] - 2026-10-16

### 新增

- 从根 `skills-hub/` 随包提供 15 个完整 Skills Hub 包，安装器分别设置 SKILLS-HUB 和 WORKFLOWS 区域，并提供分类／技能标签。
- 新增 `--hub-skills` 选择，可安装到 `.agents/skills/`、`.claude/skills/` 或两者，包含包资源、所有权记录和 doctor 检查。

### 变更

- 将显式工作流与 Hub 选择视为期望安装：安全卸载取消选择的受管包，保留工作流运行数据，冲突包完整保留。
- 支持 `--workflows none`；`--core-only` 移除工作流和 Hub 选择但保留核心命令。非交互模式省略选择时保留已安装选择。
- SpecDev 初始化可选择 Herdr、Orca、CLI 或不使用协调模式，复用本地已安装 Hub 技能，必要技能缺失时引导用户回到安装器。

### 修复

- npm 打包保留完整 Hub 资源，包括点文件、空目录和文件模式。
- 用事务日志 v4 将原子安装与恢复扩展到嵌套技能资源，同时保留 v3 日志恢复支持并拒绝并发文件系统漂移。
- 保留未启用工作流登记，使移除工作流后仍能读取已有协调规则。

## [2.0.6] - 2026-10-16

### 新增
- 为冻结 TASK 输入、worker REPORT 和可选 `session-locator.json` 记录新增只读交接验证，包含 TASK/REPORT 身份、任务目录边界和绝对日志路径格式。

### 变更
- 任务身份保存在 YAML 头部，派单后冻结 TASK。Lead 仅在独立的任务本地定位文件中记录已确认的绝对对话记录路径；报告和 Evidence 引用该文件，不重复地址。
- 将原会话日志视为工具负责的可选引用：省略不可核验路径，不复制日志，按原合同保留已有交接与归档快照。

### 修复
- 交付产物 schema 验证将继承的对象属性名作为未知字段拒绝。

## [2.0.5] - 2026-10-15

### 新增
- 独立、带日期的 SpecDev 复盘报告，包含原始引文、来源 change 引用和按严重程度排序的环境改进。审查覆盖导航、自动检查、编码标准、指导指令、工具经济性与信息访问。
- 项目 Skill 维护循环：将未归档报告整合为具体计划，记录确认，更新已有 Skill 或在 `.agents/skills/` 创建缺失 Skill，验证结果，由原归档负责方归档已完成输入。暂缓发现保持活动。
- 只读复盘验证，涵盖来源快照、完整发现决定、候选摘要、所有权、批准、执行证据、漂移、中断升级及封存归档清单。

### 变更
- 每个 change 保留一个已选工作区，在 change README 中一次记录分支、基线和负责方。Ticket 和 Direct Spec 证据引用该上下文；重试、审查者与协作者复用它。
- 分离自动／串行／并行 Ticket 调度、实际 Agent 并发和工作区选择。显式协调共享写入与 Git 操作，接受经验证的冻结工作树交付，不要求提交或额外集成检出。
- 在共享 agent 写作指导中加入项目 Skill 所有权与维护规则。机械违规优先使用确定性检查，判断问题交给审查标准，并携必要参考刷新便携 Canonical 文档。

### 修复
- 工作区恢复夹具比较原生文件系统路径，避免 Windows 临时目录别名造成误报。

### 升级说明
- Goal Plan schema 8、Implementation Plan schema 3 和执行上下文／记录 schema 1 替换旧执行合同；`ticket-control` 现输出 schema 2。已有活动记录须由负责方显式协调；未知或混合版本被拒绝，不改写原件。
- 新复盘报告和升级计划位于 `specdev/retro/`，已完成记录位于 `specdev/retro/archive/`。旧 change 内复盘产物和 `validate-specdev --stage retro` 被 `validate-retro.mjs` 替代。
- 自动夹具不能认证真实 AI 宿主调用、实际 Agent 并发或人工批准。

## [2.0.4] - 2026-10-15

### 修复
- 独立审查和历史压缩执行 Git 仓库边界检查前，解析 Windows 短路径与盘符大小写别名。
- 源码检出保持 LF，以确定性生成资产与溯源哈希。
- 使隔离测试定位信息、文件名及 worktree 身份检查可跨 Windows、macOS 和 Linux 使用。

## [2.0.3] - 2026-10-15

### 新增
- 为外部 CLI、Herdr 和 Orca 任务提供轻量 Markdown 交接：中立时间戳会话目录、按主题组织的任务、独立输入与 worker 报告、聚焦摘要。Agent 交付前必须尝试定位并验证对话记录身份、宿主与可读性，记录任务边界或无法取得历史的原因；快照仍可选。Lead 验收保存在原 Evidence；原生协作者按需选择使用。
- 为未提交 Direct Spec 交付提供只读工作树审查范围，包含未跟踪新增、删除、文件模式和链接。完成检查将独立报告绑定到冻结代码与来源输入；归档记录保持历史属性。

### 变更
- 围绕上游项目 Skill 对齐 Orca 和 Herdr 接入：复用已核验文件，或从固定修订安装完整 Skill，不覆盖用户资产，再读取实际 CLI／运行时指南。保留工具专用派单、结算与历史查询合同。
- 在 Goal/Ticket 交接中持久保存 Implement 入口。双轴审查默认由一个独立派单 Agent 执行，继承所选编排模式，记录实际身份和工具证据，覆盖最终集成交付。
- 围绕行为、垂直切片和验收简化 Spec 与 Ticket 表述。保留结构化所有权与 Skill 调用合同，移除强制实现步骤数量及无关风险套话。现有长模板仍可读。

### 修复
- 比较计划变更前规范化投影文件模式，避免 Windows 将未变 Skill 入口算作更新。

## [2.0.2] - 2026-10-15

### 变更
- 重新设计安装向导，提供更清楚的中文指导、工作流分组、最终变更预览与一致取消行为。先选择暴露位置，再为 `.agents/skills/` 和 `.claude/skills/` 配置共享能力列表。
- 支持全部已安装能力、整工作流／Command 分组、自定义入口、已保存选择及不暴露。以 `--skill-targets` 和 `--skills` 替代 `--agent-skills`／`--claude-skills`。
- 将 `specdev/learn` 扩展为独立学习与图解 Work，覆盖需求参考、项目代码、已有 change 和外部材料。保留以往课程与已有开发 Outcome，允许轻量纯学习 change。
- 按安装、概念、全部五个工作流、十个 Command、便携 Canonical 文档和排障重组中文手册。资产处置审计数据移到 `scripts/data/`，移除已替代实现报告。

### 修复
- 安装、取消和成功恢复后清理空 `.agents/.speculo-transactions` 目录，保留非空恢复证据。
- 从取消选择的暴露位置移除未变受管入口，保留已编辑与第三方文件，回滚或显式恢复时恢复两个位置及共享选择。
- 验证学习图解编号与索引，不改写历史课程标题、不重开已完成 change。

### 升级说明
- 暴露元数据现使用 `projections.json` schema 3，包含 `targets` 和一个 `asset_ids` 列表。拒绝旧逐位置 schema，不自动迁移；保留已有文件。移除旧暴露参数与 `domains` 快捷方式；须显式选择领域入口，例如 `--skill-targets agents --skills domain/specdev`。
- `specdev/learn` 业务 ID 不变，但源码入口现为 `specdev-l-learn/SKILL.md`，验证器阶段为 `learn`。更新指向旧 `specdev-l-learn-change` 路径或 `learn-change` 阶段的直接引用。
- 自动夹具和终端检查不能认证真实 AI 宿主调用或模型行为。

实现、审查和发布准备使用了 AI 辅助。

## [2.0.1] - 2026-10-14

### 变更
- 新 SpecDev change 使用明确的项目／方法／数据根和 Markdown Outcome；保留完整 Ticket、Goal、Git 集成和 DESIGN 证据 Gate，不重复业务状态文件。
- 分离本地完成、整 change 取消与归档就绪；移入 `changes/archive/` 前完成相关文档与知识工作。
- Init、Implement、Archive 和手动 docs-sync 共用当前事实文档方法，保留仅命令拥有的 Git／状态所有权。
- SpecDev 安装种子改为可选。现有活动 v5/v6 状态数据须显式审查转换；历史归档及其他四个工作流保留各自持久化合同。

### 新增
- 项目和 change DESIGN 产物、独立验证器，以及含 12 个模板和 10 个参考设计的设计目录。
- 为尚未提交的 change 提供明确来源文件审查范围。
- 只读 Markdown 身份、Outcome、负责方与收尾读取器，以及具固定输入摘要、前图像、pending 保护与恢复的显式转换维护工具。
- 稳定的 change 相对 DESIGN 批准定位及更新的便携交接包；已有不可变批准／修订字节不变。

### 修复
- 使用 JavaScript 和原生 pnpm 入口执行发布验证，包括 CI 经 PATH 解析的可执行程序。
- 历史压缩规划时保护活动 Markdown SpecDev 证据，本地或远程写入前重新检查冻结证据根；未封存归档仍阻塞，缺此根的旧计划须重建。
- 在交接与复盘 Command 中读取 SpecDev README 及实际负责产物；在包内位置验证 Canonical 文件，规范化 macOS 临时夹具根。
- Markdown 转换规划前拒绝畸形 UTF-8；中断与恢复时保留有效 Unicode、BOM、换行和文件模式。
- Ticket 进度保存在 Ticket/Evidence，一致解析可选执行策略来源，实现中的 Lead 计入并发。阻塞 Ticket 仅停止其依赖分支；取消不能满足成功前置条件。
- 根据各产物的权威与有效范围解决清理冲突，保留活动 ADR 义务；恢复设计访谈，不创建空的可选知识文件。

### 升级说明
- 不要让旧 SpecDev 写入器处理已转换活动数据。准备转换前读取 `scripts/references/migrate-specdev-markdown.md`；普通 Work 使用不要求该维护工具。
- 夹具检查、真实宿主观测和真实人工设计批准属于不同证据层级；转换不授予发布、远程写入或归档权限。

## [2.0.0] - 2026-10-13

- 在 `.agents/speculo` 安装标准领域与 Work Skill；保留 38 个业务 Work 身份并组织十个 Command 包。
- 在独立 Agents/Claude 投影中保留来源 YAML，逐文件管理所有权并报告本地冲突。
- 共用 Lead/Orca/Herdr／无头 CLI 协调方法与可选项目选择；业务进度保存在已有产物。
- 要求当前布局和 schema，拒绝旧安装且不迁移，安装恢复使用事务 v3。
- 一并重建便携验证器、Canonical 分发、文档、编写技能和回归夹具。

## [1.0.24] - 2026-10-11

### 新增
- 为 SpecDev 架构审查增加性能调查，为 Implement 增加文档执行，为 Diagnosis 增加事故证据分诊，保留全部 15 个 Work 入口路径、ID 与恢复键（#86）。
- 增加共享错误／恢复、测试可靠性、Agent 体验、文档与工程证据规则，以及只读 Git 审查范围和专业证据验证器，包含 51 项针对性回归测试。

### 变更
- 通过已有 SpecDev 负责方与产物，连接证据驱动的发现、决定、规格、Ticket、Goal、实现、审查、交付、学习、复盘和归档。
- 允许按版本标签显式触发现有 Release 工作流；分支触发不能发布。标签／版本验证、测试、npm 认证与发布仍在原工作流。

### 修复
- 以依赖上下文的设计规则和明确回归覆盖义务，替代无条件删除测试、适配器数量要求、术语禁令及一概而论的副作用建议。
- 区分精确 Git 审查范围、有效空差异、未确认事故解释、不可比性能宣称、过期证据及部分远程结果。

### 升级说明
- 无运行 schema 迁移：已有配置、持久化根、所有权、授权、归档网关和历史记录不变。#86 不改变其他工作流来源、顶层 Skill、命令和 CLI 行为。
- 本包也包含下文 1.0.23 所述 Media 和 Learning 变更；准备期间核验的最新 GitHub Release 为 v1.0.22。
- 未执行真实模型／宿主的多轮 Work 评估；结构与可执行测试通过不能认证模型遵循或 token 节省。

实现、审查和发布准备使用了 AI 辅助。

## [1.0.23] - 2026-10-10

### 新增
- 新增 Media 工作流，含七个 Work：证据驱动内容简报、参考拆解、确定性代码视频渲染、经审查手绘提示提取、本地分发草稿和人工反馈复盘（issue #81、PR #85）。
- 新增四份便携 Media Canonical 提示、技能来源与许可登记表，以及可复现的 18 秒本地视频演示。
- 新增 Learning 主动探究、生产盲点探索、证据地图，以及便携 Lesson/Question Canonical 提示。

### 修复
- 修复 Media 已安装状态验证，运行时不要求被排除的 `_state` 模板种子；拒绝无效状态，不修改已有运行数据。
- 在组合仓库检查中保留 Learning 与 Media 生成／验证；覆盖安装、重复刷新和跨平台兼容。

### 升级说明
- Media 发布能力有意仅限本地草稿：不登录、上传、发布、调用付费模型 API 或自动操作平台账号。
- 不随包提供第三方手绘配方。精确风格提取要求另行审查完整上游包及适用依赖和权利。
- 关联 PR 合并前通过 Linux Node 22.22.3／24 和 Windows Node 22.22.3 CI。正式发布须由带标签发布工作流独立通过。

实现、审查和发布准备使用了 AI 辅助。

## [1.0.22] - 2026-10-08

### 移除
- 将 `optimize-codex-config` 移出模板技能。维护副本为 `wta-skills-hub` 的 `skills/system/optimize-codex-config`。剩余八个顶层 Skill。

### 升级说明
- 刷新若保留现有 Agent Skills 投影，且仍登记 `optimize-codex-config`，会停止，因为包已不含该模板技能。刷新前移除受管名称，仍需要时从 `@namewta/skills-hub` 安装该技能。

本次实现、审查和发布准备使用了 AI 辅助。

## [1.0.21] - 2026-10-08

### 新增
- 新增 OPS 服务器发现，无需 Linux 上已有 Node；增加显式持久根确认回执，以及含控制端和主机文档的最小主机初始化。
- 在主机群视图中显示连接账号、根确认凭据，分别呈现登记、目录、文档与运行就绪状态。

### 修复
- 拒绝重复机器登记、不安全或无所有权根、过期身份／信任／确认凭据；更换连接账号时保留已有主机根。
- 新主机根锁和引导使用已确认登录账号，保留 Node 引导恢复证据以防意外重放。

### 升级说明
- OPS 现为 2.3.0；已有主机根、status schema v3、运行记录与恢复边界保持。执行器／schema 摘要变化要求重新生成尚未执行计划。
- 本地未实际测试真实 SSH 主机、sudo、Docker 和生产部署。Windows 跳过 Linux shell/tar 测试；Linux 发布工作流在发布前执行完整测试套件。

本次实现、审查和发布准备使用了 AI 辅助。

## [1.0.20] - 2026-10-08

### 新增
- **可选 Agent Skills 投影**：交互 init 可将每个所选工作流 Work 暴露为指针技能，并在目标项目 `.agents/skills/` 链接所选模板技能，供 Agents `/skills` 使用。全新无人值守安装仍不写该位置。`--agent-skills` 接受 `none`、`keep`、`template`、`template:<id>+<id>` 和工作流 ID。受管名称随 init 事务回滚；非受管技能目录保留。
- 新增 SpecDev R-retro、离线逻辑原型和显式启用的项目 UI 预览。SpecDev 现有 15 个 Work；全部工作流暴露 31 个 Work 入口。
- 新增 PR 交付和独立 CI／发布记录，包含 schema 验证、固定来源快照、授权证据与恢复回执。
- 追踪全部 38 项上游 Skill 处置与 110 个固定修订来源哈希，保留第三方许可和署名证据。

### 变更
- 将所有 GitHub/npm 操作合入 T-triage，包含 Issue/PR 接入、交付、CI／安全、发布预检、发布和恢复。Ticket 到 Issue 的 `publish` 仍与包 `release` 分离。
- 将 `speculo-retro` 更名为 `retrospective`，`writing-great-skills` 更名为 `writing-for-agents`；整合重复指导。剩余九个顶层 Skill。
- 根据宿主专用调用控制对齐 Skill 元数据和编写规则，使用 `@AGENTS.md` 生成受管 CLAUDE 桥接。

### 修复
- 从 SpecDev config v5 迁至 v6 并退役旧静态 Skill 资产时，保留所有权、用户编辑、运行数据及事务回滚。
- 独立于 Windows 控制端路径规范化 Linux SSH 目标路径；执行前拒绝无效 scp 目的地。
- 修正跨平台 OPS 夹具，要求有意义的 shell 失败证据，实际测试 Windows junction 拒绝，不让未执行检查静默通过。
- npm 包纳入运行 Skill 验证器，供可选 Agent Skills 投影使用。

### 升级说明
- 移除独立 `github-npm-ops` 入口；改用 SpecDev T-triage。重新绑定引用更名或已移除 Skill 的活动 Ticket，再检查 Ready。历史证据保持只读。
- 已有自有静态资产仅在暂存和所有权检查后替换。已修改或无所有权的退役资产阻塞受影响刷新；使用现有 doctor/resolve/recover 事务流程。
- 真实 GitHub/npm 操作仍须各自明确授权。独立 CI／发布操作不会重开实现状态，也不隐式成为 change 完成 Gate。

本次实现、审查和发布准备使用了 AI 辅助。

## [1.0.19] - 2026-10-06

### 变更
- 将 SpecDev（14）、OPS（5）、Learning（9）和 Person（2）的全部 30 个 Work 入口重构为发现、激活、活动 Work 和条件参考层（#78）。
- T-triage 模式、实现分支、OPS 范围、交接检查点、审查复用及 SpecDev 到 OPS 交付仍与原负责方和证据网关一致。
- 机械复盘发现优先使用确定性检查；保留领域专用教学、审查和归档合同。

### 新增
- 分离夹具、产物和观测评估层；观测发布资格要求签名外部观察者证据和摘要绑定，而非模型自报。
- 增加条件参考与反向调用者审计、有界读取轨迹核算，以及原生／嵌套刷新和回滚回归覆盖。
- 在 docs/work-upgrade/ 记录原升级计划、全 Work 变更矩阵、保护文件清单、兼容结果和明确验证边界。

### 修复
- 区分仅架构报告请求与已选设计执行。
- 按请求数量生成 Learning 问答对，保留冻结问题／答案快照。
- Windows 路径规范化不将普通短名或大小写别名视为链接；继续拒绝符号链接、junction 和路径穿越。

### 升级说明
- 无运行 schema 迁移。保留已有状态、历史、根、旧恢复键、写入者所有权、锁、权限和永久知识网关。
- 不得重放 OPS 未知动作；修复文档不得重跑业务动作。刷新前检查 pending 运行，绝不复用无效批准。
- 未执行真实 Agent／模型 A/B 或生产部署。提议的诊断放宽仍禁用；文本大小变化不代表测得的 token、成本或成功率收益。

## [1.0.18] - 2026-09-30

### 新增
- **OPS 服务器接入**：新增 `S-server-connect` 和带时间戳的 16 项 Linux 检查清单，含 base、compose、native 配置。严格主机密钥与公钥检查，区分未知／过期证据与就绪。
- **OPS 资产视图**：新增 `V-inventory-view` 和离线 Markdown/JSON/HTML 主机群快照，含服务器到项目与项目到服务器导航、部署实例、主机服务、依赖及 task/run 引用。
- **任务范围执行**：新增 `task-plan`、`task-authorize` 和 `task-run`，冻结范围、输入、凭据、执行器身份与有效期，再执行已授权步骤，无需重复会话确认。

### 变更
- **明确 OPS 所有权**：分离控制端初始化、服务器接入、服务器管理、项目部署和资产查看。服务器及项目任务拒绝跨范围或间接依赖提权。
- **集中记录**：新任务、服务器检查和视图记录放在 `records/`；保留 `status.json` v3 作为资源权威，保留已有运行、发布、配置镜像与恢复回执。
- **安全离线渲染**：只导出允许列表字段，转义渲染内容，使用基于哈希的内容安全策略，先发布完整不可变视图代际，再更新根 `FLEET.md` 入口。

### 修复
- 补全 mkdir 示例和夹具中的必要理由；保留框架 Work 激活标题和渐进读取记忆指针。

### 测试
- 覆盖任务授权、过期与漂移、H/D 范围隔离、失败／未知执行停止、防重放、SSH 检查失败、离线渲染及不可变快照一致性。
- 将工作区接入已有 planner/approval/apply 网关，验证安装／刷新保留记录字节与权限。

### 升级说明
- 新模块和 schema 改变 `engine_digest`；重新生成未执行批准，重试前检查未知运行。不要删除已有运行记录或业务数据。
- 首次公钥安装仍要求已有可信通道。真实 SSH、sudo、systemd、Docker、数据库恢复和应用部署须按环境验收；仓库 CI 不认证这些目标。

## [1.0.17] - 2026-09-23

### 修复
- **Agent 入口安全**：原子、幂等的受管手册块；拒绝链接／共享外部文件，替换前检测并发编辑。
- **安装完整性**：doctor 验证配置、根、受管哈希和已安装工作流；结构化场景检查不再因轨迹非空而给行为分。
- **中断刷新**：持久保存前／后图像与阶段；基于明确事务 ID 的恢复拒绝活动负责方、未知证据和漂移。
- **OPS 权限**：环境和含凭据配置使用私有权限；新控制端文档默认凭据引用，明文须计划绑定的显式选择，并保留旧状态。

### 变更
- **被动发现**：安装运行指南和生成目录；为未选但已安装工作流保留知识引用。无人值守首次 init 仅安装核心；显式 `--workflows` 控制新增。
- **便携 Skill**：标准化输出元数据，旧 ID 作为描述性兼容数据保留，不改写活动 Ticket 绑定或已完成 Evidence。
- **文档合同**：分离 docs-sync 审计／更新／提交，将 Learning 分支专用合同放到直接条件引用之后，并记录非 slash Goal 执行。
- **验证**：在支持的 Node 22/24 上执行完整 PR Gate、Windows 安装冒烟、输出 Skill 验证、产物绑定场景断言，并明确历史来源清单限制。

## [1.0.16] - 2026-09-21

### 修复
- **SpecDev Goal 路由**：`P-goal-plan` 现从 Implementation Map、Implementation Plan 或 `goal-tickets-map` 条目识别父编排。合法单 change Goal 不再要求父产物；截断的父对象仍报告缺失父文件。单 change Goal 阶段要求 Goal Plan、布尔 ready 字段和合法状态组合；Tickets 阶段仍可没有 Goal（#70）。
- **SpecDev 渐进任务就绪**：单 change Ready Goal 不再要求所有未来 Ticket 都 Ready。合法草稿任务仅阻塞自身和依赖者；独立 Ready 任务可进入前沿。可执行 `ready`／`in_progress`／`review` 任务仍要求 `ready: true`。授权、依赖、写入者、资源及父 all-Ready 创建 Gate 不变（#71）。
- **Builder Gradle 缓存**：Git 忽略 `.gradle/`，npm 包和 CLI 技能复制排除它，Builder manifest、验证和夹具发现跳过它。`fallback/kotlin-gradle` 扫描夹具继续跟踪和分发。

### 测试
- 在 `specdev-local-first` 增加 Goal 路由、Goal schema 和渐进就绪覆盖。
- 增加 Builder 缓存排除和路由入口合同覆盖。

## [1.0.15] - 2026-09-17

### 新增
- **SpecDev T-triage 收集收件箱**：将尚未成为 Change 的笔记保留为仍开启的 GitHub Issue，带 `specdev:captured` + `origin:local`。工作区账本为 `capture.md`（允许缺失）。默认一条记录对应一个未来 Change。新增 `capture-protocol.md`、`capture-template.md`、`issue-record-template.md`、`capture.schema.json` 和 `capture-status.mjs`。

### 变更
- T-triage 现有 intake、reconcile、publish、capture 四模式。Capture 不创建或选择 Change，不设置 `current_work`，不关闭 Issue。Intake 将匹配收集行标记为 `intaken`。GitHub 仍是投影／计数器／收件箱，不是开发事实来源。

### 测试
- 新增 `specdev-t-triage-capture` 覆盖：缺账本、开放本地来源行、禁止标签、混合 kind、change 级副本、change triage 上的 `mode=capture`，以及与 `published_issues` 分开的收件箱计数。

## [1.0.14] - 2026-09-16

### 新增
- **SpecDev T-triage 发布投影**：已完成 Change 可将每个计划 Ticket 发布为已分类 GitHub Issue，并以脱敏 Evidence 评论关闭。计入本地来源工作。新增 `publish.md` 账本、分类映射、公开投影规则、`publish.schema.json` 和 `publish-status.mjs`。

### 变更
- T-triage 现有 intake、reconcile、publish 三模式。`external_action` 仍负责来源 Issue；`publish_action` 负责任务投影。归档像阻塞未协调事项一样阻塞 `pending`／`publish-failed` 发布动作。
- Ticket 头部接受可选 `kind`。Intake 可展示相似 ADR／归档条目，但仍不向来源 Issue 回写标签。

### 测试
- 新增 `specdev-t-triage-publish` 覆盖：后向兼容接入、本地来源账本、混合且无 kind、禁止 `needs-triage` 标签、归档 Gate，以及含跳过的取消任务的已发布 issue 计数。

## [1.0.13] - 2026-09-16

### 新增
- **OPS H 无 Node Linux SSH 引导**：`ops.mjs bootstrap-node` 经控制端 SHA256 + scp + POSIX 安装固定 Volta 2.0.2 + Node 24.21.0（无 `curl|sh`、不编辑 profile、不用 `latest`）。之后 `ops.mjs enroll` 写入 `status.json` 和 `hosts/{host_id}/inventory/snapshot-*.json`，防止身份／资产仅留在 Agent 对话中（#66）。

### 变更
- H-host-manage 激活：缺 Node 只阻塞 apply，不能跳过主机登记。Discover 探测返回结构化 `node-missing` 和下一步 `bootstrap-node`。`environment-spec` 回退至受管 `{host.root}/_host/toolchains/{account}/volta` 路径。
- SSH 传输暴露 POSIX `/bin/sh -s` 和 `scp`，与 Node agent 使用相同主机密钥合同。固定版本元数据位于 `common/toolchains/volta-linux.json`。

### 测试
- 新增 `test_ops_bootstrap.mjs` 覆盖：缺 Node 发现、ack/SHA/`latest` 拒绝、跳过已有 Node、不改 profile 安装、enroll 持久化和受管 Volta 回退。

## [1.0.12] - 2026-09-16


### 新增
- **Learning G-goal 先教后挖**：`/goal` 现先教授一个项目规模挖掘单元（硬上限 15 课，不是配额），再为每课分派一个挖掘者。Lead 指导写集隔离；10 问后 `split-lesson`；新增参考 `lead-orchestration.md`、`mine-unit.md`、`split-rules.md`。

### 变更
- G-goal 运行时不再每教一课就挖掘。迭代策略、停止规则、链 Units 表、probe `b01`/`b02` 预算和提问策略将每个 `lesson_id` 挖掘限制为 10 问。`wave_cap` 不再是挖掘 Gate。
- `validate-learning` 强制先教后挖、`mine_unit_cap=15`、最多 10 问、无 `b03`、Lead 独占矩阵标记，并拒绝挖掘探测中的学习者协议字段。

### 测试
- 新增 `learning-g-goal-mine-pass` 覆盖：mine_unit_cap、10Q/b03、拆分提议、交替流程、预算重置、拆分深度 2、探测中的学习者协议字段。

## [1.0.11] - 2026-09-16

### 新增
- **Learning `G-goal`**：计划编译 Work（`learning/goal`），写入完整、归 Change 所有的 Goal-Plan 后停止。用户随后通过外部 AI CLI `/goal` 执行计划，可派单 L-lesson，再以 socratic-questioning `audience=mine` 写入 `goal/probes/`。绝不自动激活 H/R/C/A-archive，不写 mastered，不使用 Q-question 的 `inquiry/` Response 协议，也不恢复 Q-quiz。
- Learning 元数据现列九个 Work：原七个，加上已发布 `Q-question` 和新 `G-goal`。`validate-assets` 执行 `validate-learning --workflow-root`。

### 变更
- Learning AUTO-INDEX、Change 布局、产物所有权、提问／教学策略及 socratic-questioning 技能区分 `audience=tutor`（`inquiry/`）和 `audience=mine`（`goal/probes/`）。

## [1.0.10] - 2026-09-16

### 修复
- **SpecDev 嵌套安装状态根**：`validate-specdev` 将 change 路径绑定到 `workspace.json` 的 `roots.state`。存在自洽 workspace 合同时，项目根 `.speculo/specdev` 树封闭失败；无 `workspace.json` 的夹具保留原祖先查找（#62）。

### 变更
- SpecDev init、激活、README 和路径参考文档要求创建状态目录前打开 `workspace.json`，并说明嵌套安装下项目根 `.speculo/specdev` 树不合法。

### 测试
- 新增 `specdev-nested-state-root` 覆盖合法嵌套 change、非法项目根影子树、归档路径、冲突 workspace 合同和无 `workspace.json` 的旧夹具。

## [1.0.8] - 2026-09-15

### 修复
- **OPS compose-up JSON**：`command()` 保留原始 stdout/stderr 供 Docker inspect 解析，仅脱敏 `log_*` 字段，防止短数字密码破坏 JSON（#51）。
- **Node 24 上的 OPS SSH**：SSH 和 agent `spawnSync` 将 stdin 作为 `Buffer` 传入，`encoding` 仍为 `"buffer"`，避免 `ERR_UNKNOWN_ENCODING`（#52）。
- **OPS 并发 apply**：计划为涉及的 hosts/projects/deployments 绑定 `registry_slice_digest`；互不相交的已批准 H 计划可顺序应用。`commitObservations` 仅合并计划切片，避免后续 apply 回退其他主机（#53）。
- **OPS 主机 README 重叠**：`write-file` 不能指向生成器负责的主机文档（`README.md`、`DEPLOYMENTS.md`、知识账本）；冲突主机动作后交付不再卡于 `docs_pending`（#54）。

### 变更
- **OPS Compose 持久化**：仍默认只读根与映射 VOLUME/tmpfs；`read_only: false` 要求 `writable_root_justification`。`config/` 和 `*.conf`/`*.acl` 默认 `0644`。compose-up 封闭失败，除非容器运行且存在健康状态时为 `Health=healthy`（#55）。
- **OPS 主机／主机群手册**：使用 Markdown（无 HTML `<code>`）、服务总览表、说明章节；可选明文凭据仅位于控制端账本（#56）。
- **OPS 写入控制**：允许已声明 nginx、wireguard 和非 `ops-` systemd unit 路径，须有理由、回滚与验证；核心 unit 仍禁止（#57）。
- **OPS 主机级入口**：`host_services` 和 `public_ingress` 是一等目录字段，交付为 `knowledge/host-services.json` 和 `knowledge/public-ingress.json`，包含公网访问内网章节（#58）。

### 测试
- OPS 合同覆盖 compose JSON 秘密、Node 24 stdin Buffer、不相交主机 apply、生成文档 write-file 拒绝、nginx/wireguard 写入控制、Markdown 主机群表及 host_services/public_ingress 交付。

## [1.0.7] - 2026-09-15

### 变更
- **OPS 运行时改为 Node ESM**：控制端和目标 agent 以 `ops.mjs`／`opslib/*.mjs` 运行，仅用 Node 内建模块。远程 SSH 使用 `connection.node` 和 `node --input-type=module`。移除 Python OPS 脚本；APP 工具链仍可经 uv 安装 Python。

### 测试
- Windows 无开发者模式时跳过 SpecDev plan-contract 符号链接案例，与其他符号链接测试一致。

## [1.0.6] - 2026-09-15

### 新增
- **OPS 2.2**：以 `I-initialize`、`H-host-manage` 和 `D-project-deploy` 替代五个 change 生命周期 Work。APP 与共享服务共用主机／项目持久化布局；双侧文档是完成 Gate。

### 变更
- Status、archive-and-consolidate 命令及 CLI 结构化验证读取 Ops schema v3 资源表。遗留非空 v2 状态作为只读证据，不转换为新批准。

## [1.0.5] - 2026-09-14

### 新增
- **Ops `H-computer-hygiene`**：新增主机清洁 Work，默认只读审计 Windows/macOS/Linux 环境，可选确认后隔离缓存，报告位于 `{roots.state}/ops/changes/{change}/hygiene/`。纯清洁全局 change 可不经部署尝试而完成。

## [1.0.4] - 2026-09-14

### 新增
- **`git-history-squash` 命令**：为已有 first-parent 压缩技能新增用户调用的确认和审计报告入口。命令报告位于 `{roots.state}/commands/git-history-squash/`；事务状态仍位于 `{roots.state}/skills/git-history-squash/`。

### 变更
- **`@inquirer/prompts`**：8.5.2 → 8.7.2，包含提示结算清理及 confirm 空白修剪。

### 修复
- **`archive-and-consolidate` 报告根**：命令报告必须解析到 `{roots.state}/commands/archive-and-consolidate/`。`{roots.commands}` 仅含定义。`commands_root` 等于 `{roots.commands}` 时阻塞且不写文件。

### 测试
- 为每个 `template/commands/*.md` 入口新增命令报告根覆盖，以及 archive-and-consolidate 和 git-history-squash 确认／路径合同覆盖。

## [1.0.3] - 2026-09-10

### 新增
- **SpecDev 计划合同**：新增 Ticket/Map `plan_contract_version: 1`、Skill 调用绑定、量化交付检查及只读 `ticket-control`／`plan-contract` 工具。
- **SpecDev Initiative 地图**：Wayfinder 现记录候选 change 图，各子 change 独立负责。

### 变更
- **统一 Goal 编排**：`P-goal-plan` 现负责一个或多个 Ready change 的 plan/run/resume/replan/verify；普通本地请求不再要求 Triage。
- **架构审查**：按审查量表用 Markdown 记录高置信发现，不再用 HTML 报告模板。
- **维护者编写技能**：事实来源移到 `skills/`；`.agents/skills/` 保留兼容指针。

### 移除
- **SpecDev `O-orchestrate-implementation`**：删除独立父编排 Work。跨 change 实现使用 `P-goal-plan`、Implementation Map/Plan 和可选 `goal-tickets-map` 指针。

### 修复
- **父 Goal 验证**：父实现不再要求自身 Tickets Map 或 Ticket 目录；子 change 仍为 Ticket 权威。

### 测试
- 新增 `specdev-plan-contract` 覆盖调用绑定、交付数量、旧版升级和 initiative 身份；更新父 Goal 与维护脚本路径夹具。

## [1.0.2] - 2026-09-08

### 新增
- **工作流披露验证**：资产管线新增 `scripts/validate-workflow-disclosure.mjs`，检查工作流入口的激活、读取范围和记忆指针。

### 变更
- **维护者指导刷新**：围绕明确入口流程和最新项目事实，重写 Speculo 手册、共享技能参考与工作流文档。
- **工作流资产刷新**：更新 SpecDev、Learning、Ops、Person 包及其 Canonical 输出，匹配新披露模型和 Ops 包拆分。

## [1.0.1] - 2026-09-05

### 变更
- **持久知识引用**：所选工作流现仅在受控 `AGENTS.md` 块中管理 manifest 声明的永久知识路径；工作流激活和 Work 执行仍惰性进行。
- **Agent 手册保留**：移除旧 `<SPECULO>` 块，保留已有用户内容，缺失 `CLAUDE.md` 时创建固定重定向至 `AGENTS.md`。
- **Manifest 验证**：工作流 manifest 现声明并验证安全持久知识根。

## [1.0.0] - 2026-09-05

### 新增
- **Speculo 运行内核**：增加提供方中立的生命周期、风险类别、能力配置、工作流 manifest、检查点和轨迹事件合同，供全部工作流共享。
- **只读诊断与场景 Gate**：新增 `speculo doctor` 及含 24 个夹具的结构评估命令，覆盖续接和恢复场景。

### 变更
- **破坏性 1.0 命名空间**：刷新要求 install manifest schema v3 和包主版本 1；0.x 安装阻塞，须迁移或导出。
- **事务刷新**：一同暂存和回滚 `speculo/`、`.gitignore`、`AGENTS.md` 与 `CLAUDE.md`。
- **工作流合同**：SpecDev、Learning、Ops、Person 现发布机器可读阶段 manifest，由资产管线验证。
- **运行策略**：已有结构化状态和配置使用严格 1.0 schema；不兼容版本封闭失败，不改写。
- **Node 支持**：要求 `>=22.22.3 <25`。

### 测试
- 新增内核转换／能力测试、严格旧安装覆盖、doctor 健康检查、工作流 manifest 验证及跨领域场景夹具。

## [0.8.13] - 2026-09-02

### 新增
- **`git-history-squash` Skill**：新增用户调用、摘要确认的 first-parent 历史收敛，含合并安全提交构造、事务备份引用、精确远程 lease、可恢复报告和子模块先子后父发布。

### 变更
- **工程标准技能集生成**：将项目证据、模板、测试和用户决定编译为最小自有 Skill Set，含一个路由 Skill、可选领域 Skill、来源映射、确定性验证及刷新安全所有权边界。
- **SpecDev 项目 Skill 路由**：在 Tickets Map 记录共享实现上下文与经验证的逐 Ticket 项目 Skill 矩阵，实现或子 agent 交付前强制必要读取顺序。

### 修复
- 使 Git 历史远程与子模块夹具不依赖机器级默认分支和作者身份配置。

### 测试
- 增加临时 Git 仓库覆盖：包含／排除及根范围、合并起点、脏及无效输入、活动工作流证据、持久状态篡改、中断恢复、确认摘要、远程 lease 漂移和聚合 gitlink 顺序；扩充工程标准所有权／来源映射自测及 SpecDev 项目 Skill 路由验证。

## [0.8.12] - 2026-09-02

### 发布状态
- 已打标签但未发布：两个 Git 夹具依赖机器级配置，发布工作流在测试步骤停止，尚未 npm 发布或创建 GitHub Release。

## [0.8.11] - 2026-09-02

### 变更
- **SpecDev Ticket 恢复循环**：反复实现、审查、直接父级和候选失败返回有效 Lead，保留检查点，再派单前作最小 Evidence 支持的恢复决定。
- **集成尝试语义**：现有尝试上限是 Lead 审查触发器，而非永久 Ticket 终态，同时允许父编排继续不受影响的就绪前沿工作。

### 测试
- 增加候选创建上限、Lead 恢复证据、实质变化的重派单包和父编排继续执行回归覆盖。

## [0.8.10] - 2026-09-01

### 新增
- **项目范围 Ops 工作流**：新增接入／评估、计划／批准、迭代执行／稳定、复盘／归档四阶段，分离项目本地 change、归档、背景、ADR、SOP 和全局知识。
- **Ops 执行学习循环**：保留不可变失败／补救／回滚尝试，要求完整复盘，仅通过摘要绑定事务 manifest 提升已验证项目或全局知识。
- **Ops 安全合同**：分离部署根文件写入与外部控制面修改，要求明确全局环境审查，来源、目标、权限或计划漂移使批准失效。
- **Ops 目标与发布合同**：新增非秘密目标配置、完整控制面身份断言、优先接管模式选择、不可变候选和硬 Gate 规划、生产备份强制、严格仅本地豁免、类型化尝试日志、结构化验证状态和脱敏交接投影。
- **Ops 证据兼容**：plan v2 和 attempt v1 产物保持只读；活动旧 change 在关闭、归档或知识提升前，要求当前目标配置和一次仅验证 attempt v2。

### 测试
- 增加 Ops 项目隔离、跨项目重复 change 名、计划修订谱系、目标／配置漂移、Gate 顺序、数据保护策略、类型化日志和验证状态、旧版只读恢复、尝试恢复、项目／全局知识提升、事务归档、运行时保留及刷新阻塞覆盖。

## [0.8.9] - 2026-09-01

### 新增
- **SpecDev `L-learn-change` Work**：新增实现后提问与讲解阶段，在所属 SpecDev change 下追加面向初学者的 Markdown 和 ASCII 图，与 Learning 工作流独立。

### 变更
- **SpecDev 学习所有权**：学习产物保存在各 SpecDev change 下，后续提问保留已完成开发状态，在路由、产物所有权、生成索引及 Canonical 合同中登记新 Work。

### 测试
- 新增缺失索引、有效已索引图解、未索引文件、仅 Markdown 输出、连续编号及 SpecDev/Learning 命名空间分离的阶段验证。

## [0.8.8] - 2026-09-01

### 新增
- **父实现编排**：新增统一 `P-goal-plan` 多 change 编排，将多个 change 编译为持久复合 Ticket 超级 DAG，从一个可恢复 Lead 会话持续驱动 `I-implement`。
- **跨 change 执行合同**：新增版本化 Implementation Map 和 Implementation Plan schema、依赖及串行化所有权、全局工作区／agent 上限、仓库集成队列、聚合 Evidence 和含完整实现依赖闭包的隔离 Canonical 分发。

### 变更
- **实现集成**：子 Goal Plan 缺失时，父计划可提供工作区与集成策略；子计划保留内部 Gate，但不能与父策略冲突。
- **验证和归档 Gate**：验证 Ready 子输入、精确复合任务投影、内部及跨 change 依赖、可写路径冲突、唯一未完成父所有权、执行上限、完成 Evidence 和非级联归档。

### 修复
- 从严格 SpecDev 全局 status v5 索引规范化移除旧字段，其值保留在 change 自有状态中；将 Wayfinder claim 所有权修正为 change status 产物。

### 测试
- 增加可恢复父实现图、跨 change 串行化、无效／过期输入、重复所有权、聚合完成及旧全局状态规范化回归覆盖。

## [0.8.7] - 2026-08-30

### 新增
- **证据支持的 UI 设计包**：新增已有风格检测、引导设计选择、八种参考风格、六种布局模式，以及含离线视觉示例的固定开源研究快照。
- **确定性原型工具**：新增持久 `design-system.md` 包、对比变体和最终 HTML/CSS/JS 输出的 schema 验证与来源实体化。

### 变更
- **SpecDev 原型流程**：以可恢复 `UI-NNN` 设计包替代一次性逻辑／UI 原型记录，保留决定、研究来源、响应行为、无障碍合同和可直接实现的源码。
- 原型规划边界更名为 `ui_design_default_candidates` 与 `ui_design_max_candidates`，支持候选数量限制为二至四。

### 测试
- 新增已就绪与可恢复设计包、实体化来源漂移、畸形来源标记、缺失对比、过时原型记录和更新配置合同覆盖。

## [0.8.6] - 2026-08-30

### 新增
- **Learning 工作流**：新增七个 Work，覆盖初始化、证据评估、含明确学习者基线的通俗 ASCII 教学、主动练习、即时测验、延迟复习和知识 Gate 归档。
- **书籍式 Markdown 知识**：新增层级背景／领域索引、精确文件导航、复习调度，支持项目、产品、学科、语言和技能领域，无需 RAG、嵌入或向量存储。
- **Learning 持久化验证**：刷新预检登记 Learning schema v1，增加掌握 Gate、状态投影、证据路径、重复 Knowledge ID 和损坏 Markdown 链接的确定性检查。

### 变更
- 共享归档技能新增 `mechanical-only` 策略，使工作流负责的知识毕业独立于安全归档移动。

## [0.8.5] - 2026-08-24

### 变更
- **被动 SpecDev 发现**：将 `specdev/INDEX.md` 缩为永久知识发现和激活指针，已安装但未启用 SpecDev 不再加载运行状态、创建 change 或应用 Work 执行合同。
- **渐进工作流激活**：将完整 SpecDev 运行合同和生成的 Work 目录移到工作流根 `README.md`；全部 15 个 Work 入口仅在激活后读取。
- **README 负责 Work 目录**：marker 模式工作流生成现维护 `README.md` 中 AUTO-INDEX 块，生成器负责的 `workflow-index` 包仍整文件重建 `INDEX.md`。

### 修复
- 将文档中的 SpecDev 全局 status schema 版本从 v4 修正为实际 v5 合同。

### 测试
- 新增被动 INDEX、激活后 README 加载、已安装工作流打包、README 标记生成、确定性重建和验证器执行回归覆盖。

## [0.8.4] - 2026-08-24

### 新增
- **`upstream-fork-sync` 技能**：新增通用、仓库映射驱动的 fork／上游评估，包含已证实集成检查点、不覆盖技能变更、可复现差异／冲突报告，并在标准 Skill 状态命名空间记录精确合并父检查点。

### 变更
- **运行路径所有权**：命令和技能现使用 `<Path>{roots.*}/...</Path>` 持久化及跨包引用；独立持久化技能仅负责 `{roots.state}/skills/<skill>/`。

### 测试
- 新增 fork-sync 图检查点、dry-run、不覆盖、精确合并父、路径逃逸、缺引用及刷新保留覆盖。

## [0.8.3] - 2026-08-24

### 变更
- **SpecDev `E-eli5` Work**：讲解对象从五岁儿童改为无专业背景的大学一年级学生。ELI5 改为生成含 ASCII 结构、数据流、调用流和状态图的 Markdown，而非 HTML 视觉稿。
- **ELI5 产物连续性**：每个 change 追加 `01_<topic>.md`、`02_<topic>.md` 等图解，不重编已有文件。`eli_index.md` 为文件、主题和简介的权威索引；验证连续编号、索引／文件一致、Markdown 章节与 ASCII 图。

## [0.8.2] - 2026-08-24

### 修复
- **SpecDev 引用闭包**：用完整静态或项目相对路径替换初始化及外部子 agent 交付合同中的歧义裸文件名，恢复包自检和 Canonical 生成。

## [0.8.1] - 2026-08-24

### 新增
- **SpecDev `E-eli5` Work**：完整中文转写并保留原作者“像对五岁的我解释、HTML、大图、少字”的核心，将图解持久化到当前 change 的 `eli5.html`，支持状态恢复和阶段校验。

## [0.8.0] - 2026-08-23

### 变更
- **所有权驱动 init 刷新**：`speculo init` 现替换受管静态资产，逐字节保留不透明运行文件，以三方基线协调持久配置，原子替换前执行显式结构化状态迁移器。
- **事务冲突处理**：刷新使用项目排他锁、活动安装指纹、暂存验证、交换后验证和回滚。无效结构化数据、不安全符号链接、并发漂移和 schema 冲突以代码 `2` 退出，不改变活动安装。
- **Manifest v2**：`.speculo/install.json` 指向逐文件 SHA-256 所有权清单，`.speculo/baselines/` 保存上次用于配置协调的模板默认值。普通刷新不再复制完整运行状态；仅破坏性改变的配置或结构化文件作定向备份。

### 移除
- 从新安装移除 `migrate-runtime-state` 命令和技能。带 pending 标记的已有旧安装不变，刷新前须完成其已安装修复命令。

### 测试
- 新增配置协调、v0.7 基线引导、不透明字节保留、结构化迁移、定向备份、旧 pending、符号链接、锁、并发漂移、暂存回滚、工作流选择及双命令 CLI 覆盖。

---

## [0.7.6] - 2026-08-19

### 变更
- **`source-code-zip` 从 Python 重写为 Node.js**：技能的 `zip_source_code.js` 现仅依赖 Node.js 内建模块，支持 ZIP64、CRC32 和流式压缩；移除 `uv`/Python 依赖。
- **`subagent-delivery` 外部网页通道强化为仅 ZIP 交付**：派单前锁定 `native | external-web` 通道；外部包遵循暂存 → `source-code-zip` → SHA-256 清单核验 → 隔离解包生命周期，持久保存在 `temp/subagent-delivery/`，绝不覆盖同一定位。移除 `github-checkpoints` 参考，远程提交／分支不再是交付媒介；不可信自报结果保持 `unverified`。

---

## [0.7.5] - 2026-08-18

### 新增
- **`source-code-zip` 技能**：将源码目录打包为仅代码 ZIP，提供可编辑正则 IGNORE 规则，排除 node_modules、虚拟环境、构建产物、归档、`.env`、YAML、秘密、媒体和办公文件。优先 `uv`，回退至 `python3`／`py -3`／`python`。
- **双向钢人化论证 Work**：新增独立 `person/steelman-deliberation` 工作流入口，冻结回答前档案，强化双方最可信论证，找决定变量，至多问一个用户专属问题，然后生成经验证的明确决定、行动与反转条件。
- **钢人 change 验证器**：新增无依赖验证器，支持暂存文件和等待回答／已完成生命周期自检夹具。

### 变更
- **`engineering-standards-builder` 替代 `typescript-standards-builder`**：为已有调用者保留稳定 Skill ID，生成器泛化为跨语言工程标准编译器，覆盖 TypeScript/JavaScript、React、Vue、Java/Spring Boot、Go、Rust 和多语言 monorepo，含逐语言参考、适配器、兼容模板及自测夹具。

### 修复
- **整文件工作流索引生成**：`generate-index.mjs` 现同时遵循标记负责的 `type: workflow` 索引和生成器负责的 `type: workflow-index`／`auto_generated: true` 索引，匹配现有 person 包与维护者验证器合同。

### 测试
- 新增 person Work 结构、验证器失败模式、整文件索引幂等与过期检测、手写 marker 模式 INDEX 内容保留的回归覆盖。

---

## [0.7.4] - 2026-08-12

### 新增
- **可配置 SpecDev 执行上限**：新增实现 agent、集成尝试及 UI 原型默认／最大变体配置；Goal Plan 对适用执行上限取快照，不再固定上限为三。
- **Git 支持的完成验证**：`validate-specdev.mjs --repo` 现对照真实仓库验证记录提交、祖先关系、分支结果和干净完成状态。

### 变更
- **Goal Plan 工作区选择**：创建 Goal Plan 时询问是否使用 worktree，默认在当前工作区串行实现；选择 worktree 则保留逐 Ticket 来源 worktree 与候选集成。
- **策略中立执行产物**：统一 Ticket、子 agent、Implement 和 Evidence 合同，使 current/direct-parent 与 required/candidate-merge 共用一套清晰文档结构。
- **运行合同与迁移**：SpecDev config 升至 v5，Goal Plan/change status 升至 v6，保留旧正数并发值，为新字段增加确定性默认值。
- **Canonical 分发**：从更新的工作流依赖闭包重新生成受影响 SpecDev Canonical 文档。

### 测试
- 新增超过三的可配置上限、上限违规、集成尝试边界、运行迁移、当前工作区串行化与真实 Git 证据验证覆盖。

---

## [0.7.3] - 2026-08-12

### 变更
- **Lead 指导 SpecDev 执行**：实现现由单一 Lead 统筹，Ticket worktree 数量有界，并要求候选合并／集成步骤。
- **执行与迁移合同**：更新 Goal Plan、Implement、Init、Ticket、迁移及验证资产，记录委派证据和可恢复集成状态。
- **Canonical 分发**：从更新的工作流依赖闭包重新生成受影响 SpecDev Canonical 文档。

### 测试
- 新增及更新 Lead 编排、Ticket worktree 集成、迁移状态和刷新工作流合同覆盖。

---

## [0.7.2] - 2026-08-09

### 新增
- **Codex 配置审计技能**：新增 `optimize-codex-config`，提供脱敏只读审计，涵盖本地配置、自定义 Responses 提供方、认证元数据、权限、Agent、模型目录、rollout 事故、compaction 失败和配置漂移。任何本地配置修改前均要求明确确认包。
- **独立工作区执行合同**：Goal Plan 将 `coordination_mode` 与 `workspace_strategy` 作为正交轴，含独立隔离工作区补充、角色中立的实现／集成所有权、便携工作区定位和持久本地集成授权。

### 变更
- **Agent Team 不再隐含使用 worktree**：`single-session | lead-team` 控制协作；`current | worktree | mixed` 仅按具体隔离触发因素选择，如并行写入、受保护本地状态、一次性实验、后台恢复、提供方要求或用户明确请求。默认仍为当前工作区单写入会话；只读子 agent 不改变模式。
- **自动本地 worktree 集成**：`terminal_action=integrate` 授权集成负责方完成快进或机械确定的合并冲突集成，无需重复确认。成功集成不会自动推送、创建或合并 PR、部署、迁移或移除分支／worktree。
- **Canonical 分发**：从更新的工作流依赖闭包重新生成全部六份 SpecDev Canonical 文档。

### 修复
- **可恢复 worktree 集成状态**：快进现记录结果检查点、验证证据、通过的集成结果和 `integrated` 终态。新 `integrating` 锁要求完整合同，可从记录的父／来源检查点或匹配 `MERGE_HEAD` 恢复。
- **集成证据不变量**：验证现要求正数尝试、完整父／来源检查点、来源相等、合并提交结果不同、快进结果精确相等，同时保留旧 v3 worktree 记录。
- **Codex 写入者检测**：用目标 `config.toml` 的精确可写句柄证据替代宽泛进程名匹配，调用中的 Codex CLI 和不写入的应用 helper 不再阻塞技能。
- **模型目录与 413 归因**：从当前 `supported_reasoning_levels[].effort` 字段读取推理等级；除非明确代理签名支持外部代理所有权，JSON／提供方 413 响应保持未归因。

### 测试
- 新增全部四种协调／工作区组合、旧及新集成记录、快进检查点不变量、真实 Codex 目录结构、可写句柄检测、秘密脱敏和代理证据阈值回归覆盖。

## [0.7.1] - 2026-08-09

### 新增
- **状态安全刷新迁移**：`speculo init` 现对原项目配置和完整运行状态取快照，最新备份保存在 `speculo/.speculo/back/`，在 `back/manifest.json` 记录文件哈希，并写入含安装版本与工作流的 `.speculo/install.json`。
- **待迁移 Gate**：不兼容版本、畸形 JSON、状态符号链接、未知命令状态、不支持工作流 schema 或索引冲突会安装干净活动骨架及 `.speculo/migration.json`；CLI 退出 `2`，工作流阻塞，重复 `init` 不修改。
- **Agent 辅助运行迁移**：新增 `migrate-runtime-state` 命令和技能。确定性脚本检查不可变备份内容，为活动目标取指纹，要求完整来源决定和明确确认，暂存全部变更、验证结果、原子替换安装，失败则回滚。

### 变更
- **兼容 v0.7+ 刷新**：`speculo init` 仍刷新受管静态命令、技能、工作区元数据及所选工作流包，同时递归合并项目配置默认值，保留完整兼容工作流／命令运行状态，包括已初始化配置、状态索引、`.config/`、永久知识、`changes/`、`archive/`、sidecar、报告和自有命令 `state.json`。
- **静态／运行所有权分离**：模板刷新移除过期受管静态命令、技能和所选工作流文件。运行数据兼容时迁移，pending 时保留在不可变备份等待显式协调。提示中未选的当前支持工作流不变。
- **运行忽略项**：安装 SpecDev 时，项目根 `.gitignore` 除 `specdev-worktree/` 外，现幂等加入 `speculo/.speculo/back/`。

### 测试
- 新增全新安装清单、完整兼容状态保留、备份哈希、pending 零修改重试、CLI 退出码 `2`、CRLF／幂等忽略、备份篡改、确认 Gate、目标漂移、路径逃逸、无效状态回滚、未选工作流保留、暂存失败回滚及缩减 CLI 界面覆盖。

## [0.7.0] - 2026-08-09

### 变更
- **直接刷新是唯一升级路径**：`speculo init` 现暂存完整替换安装并刷新受管模板资产，不检查或迁移旧状态。替换 `config.json`、工作区元数据、命令、技能和所选工作流包；所选工作流状态重置为当前骨架，保留 `changes/`、`archive/` 和命令 Markdown 报告。
- **状态清理合同**：刷新移除所选工作流 sidecar、工作流配置、未知状态文件和命令 `state.json`。提示中未选的当前支持工作流不变。
- **构建输出卫生**：`pnpm build` 编译前清空 `dist/`，防止已删除来源模块被意外打包。

### 移除
- **迁移和技能镜像 CLI 界面**：移除 `speculo migrate`、`speculo mirror-skills`、`speculo update` 和 `--all`／`--apply`／`--dry-run`。调用已移除命令或选项非零退出，引导使用 `speculo init`。
- 移除迁移及技能镜像源码模块、旧兼容测试和引导用户迁移状态的工作流指令。

### 测试
- 新增畸形 schema v2 状态、未知旧文件、状态清理、保留审计历史、未选工作流保留、暂存失败回滚及缩减 CLI 界面的直接刷新覆盖。

## [0.6.1] - 2026-08-08

### 新增
- **SpecDev 本地优先 Triage**：`T-triage` 增加 intake / reconcile 双模式，将远程 Issue、PR、URL、文件或对话冻结为本地 `source.md`，以本地 `triage.md` 记录路由和待处理外部动作；change 完成本地开发后可再次进入 Triage，经明确确认回写并关闭支持的远程 Issue。
- **GitHub Issue transport**：`github-npm-ops` 新增可复用的 `issue-read`、`pr-read`、`issue-search`、`issue-create` 与 `issue-comment-close` 操作；外部写默认 dry-run，close 重试使用稳定 comment marker 保持幂等。该能力仅作摄入与完成投影，不成为 SpecDev tracker。
- **C-code-review 与共享双轴审查能力**：固定 commit、branch、tag、merge-base 或 PR 后，分别执行工程标准轴和规范符合轴审查，并把可恢复报告持久化到 change；I-implement 复用同一能力。
- **P-prototype**：新增 Logic / UI 原型分支、原型记录与 schema；原型只回答一个设计问题，通过可迁移 branch/worktree locator 与 Wayfinder、后续实现和清理状态互相定位。
- **诊断、问卷与冲突协议**：D-diagnose-bugs 增加 red-loop 硬门、最小化、可证伪假设、单变量探针和 HITL 捕获脚本；G 增加 stakeholder questionnaire 阻塞/恢复分支；I 增加 merge/rebase 冲突处理协议。
- **上游来源一致性检查**：新增覆盖全部 26 个 `temp/skills` 来源的 source map 与 hash 检查，并接入 `pnpm validate-assets`。

### 变更
- **SpecDev 全局状态 v4（#37）**：`status.json` 收敛为 `active` / `archived` change 索引，删除全局 `work_history`、active `result` 与 `completed` 元数据投影；`speculo migrate` 新增 v3→v4 dry-run、阻塞检查、分阶段替换和回滚安全迁移。
- **Ticket worktree 固定路径（#36）**：Git provider 固定使用 `<project-root>/specdev-worktree/<ticket-id>`；`speculo init` 在安装 SpecDev 时幂等治理项目根 `.gitignore`，native/external provider 继续使用可迁移 locator。
- **TDD 与完成门收敛**：I-implement 使用严格 red→green 垂直切片、独立真相来源和系统边界 mock；重构移到双轴审查后的独立修正阶段。change 完成与归档分离，未 reconcile 的远程 close 不回滚本地完成，但会阻塞归档，除非显式 waive。
- **领域工件语义与毕业边界收窄**：change CONTEXT 只保留本 change 已确认的项目规范术语；change ADR 仅在“难以逆转、缺少上下文会令人惊讶、存在真实权衡”三个条件同时成立时创建，并只作为当前 change 合同。永久 `context/` / `adr/` 只能由 Archive 在实现证据、毕业评估和用户确认后写入；Research 不再创建共享 namespace，由调用方声明输出 owner 和目标路径。
- **归档职责去重**：SpecDev A work 改为全局 `archive-and-consolidate` skill 的 workflow wrapper；Status、Handoff、Archive 与 Retro command 同步理解本地权威与远程 reconcile 状态。
- **Goal Plan 角色编排改为显式可选**：每次运行 P-goal-plan 由用户选择普通或委派计划；普通计划只保留 DAG/Wave/Gate/owner、证据和恢复，不生成 Lead、Provider、Delivery Contract 或 Dispatch Packet。只有委派分支加载 subagent-delivery；普通计划由最后一个 Implement 完成 change，委派计划仍由 Lead 验收完成。共享路径、E2E、偏差与 worktree 公共契约改用角色中立 owner，只有委派分支才映射为 Lead/Worker。

### 移除
- 删除 `source-issue.md` 兼容入口、外部 status-label 初始化，以及重复或已过期的 `archive-checklist.md`、`knowledge-promotion-rules.md`、`code-review-process.md` 和 `tdd-examples.md`。旧 `source-issue.md` 会被 validator 明确拒绝，不执行迁移或兼容回退。

### 测试
- 新增 status v3→v4、迁移阻塞、`.gitignore` 换行/幂等、provider 引用校验及真实 Git linked worktree 集成覆盖。
- 新增 Triage 前置摄入、旧来源拒绝、诊断 red-loop、双轴审查 fixed point、原型 locator、远程 close 归档门，以及 GitHub transport dry-run / 幂等重试覆盖。

## [0.6.0] - 2026-08-07

### 新增
- **参考内容复用规则（作者技能）**：`authoring-quality.md` 共享规则新增"参考内容复用"——用户提供参考内容时视为待复用实现而非灵感来源，默认尽可能直接复制原文，只对 Speculo 集成所必需的路径解析、持久化、状态、缓存/临时目录、输出位置及直接相关脚本配置做最小修改；方法、步骤顺序、问题、判断条件、模板语义与完成标准不得顺带改变。
- **写技能接入质量模型**：`speculo-write-canonical` / `speculo-write-command` / `speculo-write-skill` / `speculo-write-work` / `speculo-write-workflows` 五个技能全部接入 `_shared/authoring-quality.md` 读取，并在用户提供参考内容时先应用复用规则再继续设计。
- **验证门证据要求**：`validation-gates.md` Gate 5 新增参考内容修改核对——列出相对原文的实质修改及 Speculo 集成理由，无法说明必要性的改写恢复原文。

---

## [0.5.0] - 2026-08-07

### 新增
- **`subagent-delivery` Skill（specdev 工作流）**：为 Goal Plan 生成可恢复的 direct、原生或外部网页 Agent 派单，并在 Implement 阶段按同一交付合同核对基线、候选交付、修正与 Lead 验收；随 specdev 工作流作为 common skill 自动安装。
- **`design-tree.schema.json` 与 `wayfinder-ticket.schema.json`**：为设计树与 Wayfinder Ticket 新增正式 JSON Schema，`validate-specdev.mjs` 与 canonical 生成脚本同步接入。
- **specdev 契约扩展**：artifact-contract 新增设计树、Wayfinder 地图/Ticket/solution comment、架构审查等工件；新增 `architecture-report-contract.md`、`local-tracker-contract.md`、`solution-comment-template.md` 契约文档与 `design-tree-template.json` 模板。
- **`codebase-design` 规则**：新增深层模块设计语言（小接口承载大行为、缝合点、可测试性），并入 specdev common rules。

### 变更
- **`docs-sync` Skill 重构为手册树构建器，取代 `agents-md-builder`**：基于可复现 Git 区间、确认范围和 workflow 规则审计项目文档，在增量维护或重建分支中生成可预测的 AGENTS.md / CLAUDE.md 手册树；`agents-md-builder` skill 及其模板与引用全部移除。
- **specdev 各 work 更新**：G-grill-with-docs（设计树模板与 grilling 协议）、I-implement（design-it-twice、evidence-template、execution-preflight）、P-goal-plan（规划模式与编排协议）、R-review-architecture（架构审查报告契约）、W-wayfinder（地图与 investigation 契约）同步演进至新工件契约。
- **canonical 单文件分发物重新生成**：全部 canonical-specdev-* 文件与源码同步（新增 subagent-delivery、设计树与 Wayfinder ticket schema 内联）。
- **测试扩展**：cli.test.ts 新增 specdev 契约相关用例。

---

## [0.4.0] - 2026-08-02

### 变更
- **`engineering-standards-builder` Skill 取代 `typescript-engineering-standards`**：由静态工程规范合集重构为规范生成器——先扫描仓库事实，再通过自适应问答确认分歧点，为当前项目生成专属 TypeScript Standards Skill。输出正式规范到 `.agents/skills/typescript-standards/`，并为 `.claude/skills/` 创建强制引用入口；主 Skill 精简、详细规则拆分进项目内 `references/`，随 `skills` 核心资产自动安装。

---

## [0.3.4] - 2026-08-02

### 新增
- **`typescript-engineering-standards` Skill**：为 TypeScript、JavaScript、React、Node.js、Electron、CLI、npm 库与 Monorepo 项目提供渐进披露的工程规范。轻量主入口按任务最小化读取 `references/` 主题文档（规则优先级、架构与目录、命名、模块、类型系统、异步/错误、注释、测试、React、Node CLI、格式化/Lint、配置/CI、安全/性能/i18n、Git/评审、迁移治理、Orca 工程习惯），并附带 `templates/`（tsconfig/prettier/editorconfig/AGENTS/PR/评审清单）与 `examples/`。随 `skills` 核心资产自动安装。

---

## [0.3.3] - 2026-07-31

### 新增
- **A-archive-and-consolidate 新增 consolidate-from-code 模式**：归档 Work 从单一 archive 路径扩展为双模式。没有可归档 change（或用户显式要求“基于当前代码沉淀知识”）时，进入 consolidate-from-code 模式——以当前代码库为基本事实、一次一问深度访谈用户，把经验证的架构决策与领域术语提升为永久知识。访谈运行本身建立一个承载 change，轨迹/LOG/CONTEXT/ADR 先落在该 change 内，经代码验证后再提升、最后归档；两模式收束到同一条“评估 → 提升 → 归档”尾部。§0 判定模式，多候选或既有可归档 change 又收到沉淀请求时停止请用户消歧。
- **consolidation-interview.md 访谈协议**：新增代码库沉淀访谈协议子文件（基本事实优先、决策树、每轮只关闭一个关键结论、复用 grill 的 LOG/CONTEXT/ADR 格式、停止条件），供 consolidate-from-code 模式加载。

### 变更
- **W-wayfinder 工作流增强**：明确“规划而非执行”与“以名称指代”两条核心纪律；拆分“绘制地图 / 走完地图”两种调用模式；目标命名作为第一动作独立成节；调查 Ticket 引入 Type（research/decision/validation/mapping）与模式（AFK/HITL）分类，research/AFK 型可并行领取、decision 等 HITL 型单会话一次只解决一个。
- **wayfinder-map-template 重构**：地图定位为“索引而非仓库”，新增目标、笔记（含执行授权）、已定决策、尚未指定（战争迷雾）、范围之外等分节；前沿由调查清单投影；停止条件补齐目标命名与迷雾收敛项。
- **investigation-ticket-template**：随 Wayfinder 分类模型同步更新。
- **specdev INDEX**：A-archive-and-consolidate 描述更新为双模式沉淀 Work。

---

## [0.3.2] - 2026-07-31

### 新增
- **`speculo mirror-skills` 命令**（#34）：将 `.agents/skills/*` 完整正本镜像为 `.claude/skills/*` 薄指针。指针保留正本 frontmatter（`name`/`description`/触发短语），正文仅含哨兵 `<!-- speculo:pointer -->` 与指向正本的相对路径 `../../../.agents/skills/<name>/SKILL.md`，不复制判定逻辑（单一事实来源）。支持反向归位（`.claude` 完整 skill 且 `.agents` 缺失时，先 copy 到 `.agents` 作正本再指针化）、幂等（二次运行仅 `skip`）、`--dry-run` 预览。`.agents` 缺失对应正本或两侧均为完整 skill 时明确报错而非静默。仅处理含 `SKILL.md` 的目录，`_shared/` 等自动跳过。

### 修复
- **init 输出显式标注保留的 config.json**（#33）：更新（update）模式下若 `speculo/config.json` 已存在，不覆盖用户修改，并在输出中报告 `config.json (preserved)`，补齐验收标准的"创建/跳过提示"一项。全新 init 生成 config.json 的行为自 v0.2.1（commit 042e8a4）起已在 main 中，本次仅补 update 侧提示。

---

## [0.3.1] - 2026-07-31

### 新增
- **E-engineering-cognitive-mentor 工作流**：specdev 新增“工程认知导师”非执行型 work，面向 Bug、源码、需求方案、架构与陌生技术领域提供证据驱动、可复述、可恢复的认知指导；含 mode-routing、interaction-protocol、evidence-and-options、五类场景指南、comprehension-and-closure、persistence-and-resume 与 mentor-report-template 等渐进披露子文件。
- **E canonical 纳入生成流水线**：`generate-specdev-canonical.mjs` 注册 E 入口与引用闭包，`canonical-specdev-engineering-cognitive-mentor.md` 改为从源自动生成（取代早期手工版），纳入 `--check` 幂等校验。

### 变更
- **内部创作契约自包含化**：废弃集中式 `docs/`（skill/command/canonical/persistence-authoring），契约迁入各 speculo-write-* skill 的 `references/<type>-contract.md` 与 `.agents/skills/_shared/`（project-model、path-and-reference-rules、authoring-quality、validation-gates）；新增 `.agents/skills/README.md`。
- **AGENTS.md 刷新**：更新版本号至 v0.3.1、目录图（移除 `docs/`）、workflows 盘点（specdev 12 works 含 E）、Validation Pipeline（补 `generate-specdev-canonical --check`、`validate-speculo-assets.mjs`、`generate-index.mjs` 双 INDEX 模式）与 Internal Authoring Skills 引用说明。
- **specdev INDEX**：AUTO-INDEX 重建至 12 works（新增 E-engineering-cognitive-mentor）。
- **README / README-ZH**：文档索引移除已废弃的 `docs/` 链接，指向自包含的 `.agents/skills/`。

### 修复
- **maintainer 校验器 `validate-speculo-assets.mjs`**：修正项目相对路径（`<Path>src/example.ts</Path>` 等，符合 path-reference-contract §3）被误判为“必须以 root alias 开头”；识别 `type: workflow-index` 整文件自动生成模式（person），不再对其强制 AUTO-INDEX 标记；豁免散文文档（README、`.speculo/`）与讲解性占位（省略号、`{roots.X}`/`{roots.xxx}`）。
- **E work 引用契约合规**：修正 E 文档中裸 `workspace.json` / `.status.json` code span 与 `<Path>...</Path>`、`<Url>...</Url>` 占位，改用完整 `<Path>` 或散文描述；`common/tools/validate-specdev.mjs` 的 `EXPECTED_WORKS` 白名单登记 E。

---

## [0.3.0] - 2026-07-28

### 新增
- **R-review-architecture workflow**：新增架构评审工作流，含探索指南（exploration-guide.md）和 HTML 报告模板（html-report-template.md），支持系统性代码架构评审
- **handoff 独立 skill**：handoff 从 workflow 迁移为 `template/skills/common/handoff/SKILL.md` 和 `template/commands/handoff.md` 的一等公民 command+skill
- **毛泽东咨询输出模板**：person workflow 新增 `mao-consultation-output-template.md` 输出模板
- **git-repository-audit command**：新增 `template/commands/git-repository-audit.md` 命令定义
- `writing-great-skills` SKILL.md 新增内容补充
- `canonical-specdev-*` 文档内容更新
- `G-grill-with-docs` 新增 `adr-format.md` 引用

### 变更
- **AGENTS.md 刷新至 v0.3.0**：更新资产盘点（commands 4→5、skills 6→6、workflows 10→11+）、移除 canonicalize.mjs 引用
- **specdev workflow 重组**：INDEX.md 新增 R-review-architecture、A-archive-and-consolidate、P-goal-plan 条目；移除 improve-codebase-architecture
- **canonical 格式纯 Markdown 化**：`canonical-authoring.md` 移除 `scripts/canonicalize.mjs` 引用，确认纯 Markdown 分发格式
- **dev-worktree SKILL.md 大幅精简**：从 122 行压缩，移除冗余内容
- **triage SKILL.md 与 OUT-OF-SCOPE.md 更新**
- `validate-framework-assets.mjs` 与 `check-template-links.mjs` 适配新 workflow 结构
- 多个 specdev Work 入口内容同步更新：D-diagnose-bugs, G-grill-with-docs, I-implement, I-init-setup, P-goal-plan, T-tickets, W-wayfinder
- GitHub npm ops 参考文档更新（failure-recovery, preflight-checklist, release-notes-injection, troubleshooting-playbook, version-bump-flow, workflow-yaml-reference）
- CLI 测试更新以匹配 handoff 命令新路径

### 移除
- **`scripts/canonicalize.mjs`**：已废弃的旧 XML 容器格式生成脚本，与现行纯 Markdown 契约不符
- **`template/workflows/specdev/common/improve-codebase-architecture/`**：功能合并到 R-review-architecture
- **`.agents/skills/speculo-write-workflows/references/authoring-quality.md` 与 `persistence-contract.md`**：移除冗余参考文档

---

## [0.2.16] - 2026-07-24

### 修复
- 修复 `speculo init` 未生成 `speculo/config.json` 的回归问题（#33）

### 新增
- handoff 命令新增「路径引用规范」小节，要求文件引用统一使用项目根目录相对路径（#32）

---

## [0.2.15] - 2026-07-23

### 修复
- 修复 handoff command 迁移后 CI 测试断言：`commands/handoff.md` 现为 first-class command，init 后应存在

---

## [0.2.14] - 2026-07-23

### 变更
- **handoff command 重构**：从 workflow SKILL 迁移为独立 command，归档路径规范化为 `speculo/.speculo/commands/handoff/<YYYY-MM-DD>-<scope>-<topic>[-NN].md`，禁止写入 temp/ 或非规范位置

### 新增
- `AGENTS.md` 新增 Speculo 运行时配置段：初始化状态检查与工作流入门强制读取规则

---

## [0.2.13] - 2026-07-23

### 新增
- `speculo version` 命令：查看当前安装版本，自动检查 npm registry 最新版本并提示升级
- `speculo` / `speculo init` 启动时自动版本检查：显示本地版本与远程最新版本比对，交互模式下确认后继续

---

## [0.2.12] - 2026-07-22

### 新增
- T-triage workflow：外部 issue 摄入分诊——深度理解上下文后写入 source-issue.md 与 triage.md，推荐下一 work（#31）

### 变更
- **status.json schema 升级到 v2**：`active` 从 `string[]` 升级为 `object[]`，支持 per-change 维度的 `current_work`/`works_run`/`result` 独立追踪（#31）
- 移除全局 `current_work` 字段，语义移至 per-change active 条目
- `work_history` 条目增加 `change` 外键，移除 `artifacts` 字段
- 新增 `completed` 数组记录已归档 change 的路径与时间
- 新增 per-change `.status.json` 约定，追踪 change 生命周期状态
- A-archive-and-consolidate 全链路联动：从 status.json `active` 筛选 `result: "completed"`，归档后追加到 `completed` 数组
- W-wayfinder ticket 领取机制从全局 `active` 数组迁移到 per-change `claimed_tickets`

---

## [0.2.11] - 2026-07-22

### 修复
- T-tickets 编号契约去掉 `#` 前缀：文件名/编号列/阻塞路径/DAG 与派单协议统一为两位零填充纯数字（`01`），避免 tickets-map 链接被编码为 `%23`（#30）
- P-goal-plan §5 执行协议强制引用 I-implement：开头声明本协议是 I-implement 的实例化，Lead 与简化模型步骤 1 清单均以 I-implement 为第一项（#29）

### 变更
- `IMPLEMENTER_DISPATCH` / `TICKET_DONE` 协议标签改为纯数字编号（`IMPLEMENTER_DISPATCH 01` / `TICKET_DONE 01`），不再使用 `#n`
- `canonical-specdev-tickets.md` 与 T-tickets 编号契约锁步同步

---

## [0.2.7] - 2026-07-21

### 修复
- specdev INDEX.md 持久化约定表格补充 `.config/` 配置目录文档说明（#25）

---

## [0.2.6] - 2026-07-21

### 新增
- `archive-and-consolidate` command 与配套 skill：知识生命周期治理——归档过期内容、合并分散知识、清理过时资产。含完整参考规则（archive-rules.md、cleanup-rules.md、consolidation-rules.md、knowledge-graduation.md）和资产模板。
- `specdev` workflow package：全周期规范驱动开发，含 7 个 work 条目——D-diagnose-bugs（诊断 bug）、G-grill-with-docs（带文档质询）、I-implement（实现）、I-init-setup（初始化设置）、S-spec（规范编写）、T-tickets（任务拆解）、W-wayfinder（路径导航）。替代原有的 matt-pocock workflow。
- `speculo-write-canonical` 内部创作 skill：为 AI 平台生成/审计单文件 canonical 分发格式。
- `speculo-write-work` 内部创作 skill：编写 workflow 内的独立 work 条目文件及渐进式展示子文件。
- vendor `khazix-skills/neat-freak`：知识治理与清理的原始 skill 集合。
- Workflow `INDEX.md` 自动生成脚本（`generate-index.mjs`），替代手动维护的 PERSISTENCE.md/WORKFLOW.md。
- `template/AGENTS.md` 与 `template/CLAUDE.md` 作为模板级代理入口，遵循 AGENTS.md 权威手册 + CLAUDE.md 轻量重定向的铁律。
- `authoring-quality.md`、`workflow-authoring.md`、`work-entry-authoring.md`、`index-template.md` 参考文档，提取到对应 skill 的 references/ 中。

### 变更
- `template/commands/` 从 5 个精简为 4 个：移除 `finalize` 和 `knowledge-prune`（功能合并到 `archive-and-consolidate`）。
- `template/skills/` 从 10 个精简为 6 个：移除 `change-lifecycle`、`config-prune`、`knowledge-prune`、`runtime-context`、`scaffold-exercises`；新增 `archive-and-consolidate`。
- `template/workflows/`：matt-pocock workflow 替换为 specdev workflow（7 work entries + INDEX.md）。
- `template/workflows/person/`：适配新 INDEX.md 格式，移除 PERSISTENCE.md/WORKFLOW.md。
- `.agents/skills/` 从 4 个扩展为 5 个：新增 `speculo-write-canonical` 和 `speculo-write-work`。
- `speculo-write-workflows` skill 重构：新增 INDEX.md 生成、vendor reconciliation 重构。
- `docs/` 目录更新：移除 `workflow-authoring.md`；`canonical-authoring.md`、`persistence-contract.md`、`skill-authoring.md` 内容同步。
- `template/vendor/`：新增 `khazix-skills/`。
- `scripts/validate-framework-assets.mjs` 适配新的 INDEX.md 格式。
- `src/` CLI 模块适配 workflow 包结构变更。
- `check-template-links.mjs` 跳过 canonical 自包含文档。

### 移除
- `template/commands/finalize.md` 与 `template/commands/knowledge-prune.md`（功能合并到 archive-and-consolidate）。
- `template/skills/change-lifecycle/`、`config-prune/`、`knowledge-prune/`、`runtime-context/`、`scaffold-exercises/`。
- `template/workflows/matt-pocock/` 整个 workflow package（替换为 specdev）。
- `template/workflows/person/PERSISTENCE.md`、`WORKFLOW.md`、`_state/.config/`、`_templates/`。
- `.agents/skills/speculo-write-workflows/scripts/vendor-workflow-impact.mjs`。
- `docs/workflow-authoring.md`。
- `test/vendor-workflow-impact.test.ts`。

## [0.2.5] - 2026-07-20

### 修复
- PERSISTENCE.md state root 路径解析多了一级 `state/` 子目录：`<root base="X" path="Y"/>` 现在明确解析为 `workspace.roots[X] + "/" + Y`，root ID 不重复作为子目录拼接（#23）。
- setup-matt-pocock-skills 产物 `docs/agents/*` 现通过 `adapt-paths` 中间件映射到 `{state_root}/integrations/` 与 `{state_root}/knowledge/` 持久化命名空间，不再污染项目根（#24）。
- PERSISTENCE.md 新增 `<vendor-path-mapping>` 规范表作为 vendor 路径适配的单一事实源。

### 变更
- to-tickets 本地文件模式现通过 wrapper 层 `adapt-local-template` 覆盖为 `tickets/` 目录结构（`README.md` 索引 + `NN-<kebab-title>.md` 独立文件），支持按编号引用与独立归档；issue tracker 模式行为不变（#22）。
- idea-to-delivery route artifact 路径从 `tracker/tickets.md` 更新为 `tracker/tickets/README.md`。

## [0.2.4] - 2026-07-20

### 新增
- Canonical 格式支持与 `speculo-write-canonical` 内部创作 skill。
- `template/canonical/` 含格式规范、示例与教学指南。
- `scripts/canonicalize.mjs` 用于自动生成 canonical 自包含文档。

## [0.2.3] - 2026-07-17

### 修复
- retro 命令目标仓库写死为 `NAMEWTA/Speculo`，移除 AI 可覆盖目标仓库的歧义空间，防止 issue 误提到其他仓库。

### 新增
- README 九段式通用写作指南（`readme-writing-guide.md`），供 `docs-sync` 等命令在生成/审计 README 时引用。

### 变更
- `docs-sync` skill 步骤 4 同步引用新写作指南；`readme-contract.md` 增加交叉引用。

## [0.2.2] - 2026-07-15

### 新增
- 逐工作流 `PERSISTENCE.md` 运行合同，以及可独立调用的 `atomic-skills/` 入口。
- 为当前 Matt Pocock vendor 清单提供完整一一对应包装目录，包括每个 `in-progress` 技能的明确 Gate。
- 只读 Git 影响分析，用于将 vendor 新增、移除、移动、更名及支持文件变化与工作流包装、路由和调用者协调。

### 变更
- Matt Pocock 路由现通过工作流自有原子包装解析每个原始技能，使路由和直接调用共用一个 change 与持久化边界。
- 框架验证现强制持久化加载、包装／目录完整性、唯一原始目标，并禁止路由直接引用原始技能。
- 内部工作流编写技能现将 vendor 同步视为依赖闭合协调分支；被引用项移除或更名时阻塞，等待明确决定。

## [0.2.0] - 2026-07-11

### 新增
- 基于包的工作流系统，使用 XML 路由声明（`<runtime-context>`、`<persistence>`、`<routes>`、`<sequence>`、`<dependencies>`、`<state-schema>`、`<transitions>`）。
- 两个可安装工作流包：**matt-pocock**（10 条路由：idea-to-delivery、wayfinder、triage、diagnose、architecture、review、merge-conflicts、research-prototype、productivity、experimental）和 **person**（1 条路由：毛泽东认知操作系统咨询流程）。
- 五个命令定义：docs-sync、finalize、knowledge-prune、retro、status。
- 十个技能：agents-md-builder、change-lifecycle、config-prune、docs-sync、github-npm-ops、knowledge-prune、runtime-context、scaffold-exercises、speculo-retro、worktree-isolation。
- `speculo migrate [--apply] [target]`，将 v2 和过渡 v3 状态迁移到当前 v3 合同，带暂存回滚安全保障。
- `speculo init [--all] [target]`，通过 `@inquirer/prompts` 交互选择工作流。
- vendor 技能集合支持：matt-pocock（工程与生产力）和 officecli。
- `docs-sync` 技能，含 git-state、workflow-scope、document-lifecycle、readme、changelog、agents 六份参考合同。
- CI 管线：build、test、validate-assets、verify-bin。
- npm 发布工作流，含包溯源和标签版本验证。
- `speculo init` 的 `--all` 参数，可选择全部工作流，更新时完整刷新 vendor 资产。
- 工作流状态扩展：`current_route`、`route_history`、`skill_history`、`external_refs`、`legacy_source`。

### 变更
- `speculo update` 弃用，转调 `speculo init --all`。
- 重组 vendor 目录：`vendor/` 为原生技能集合目录。
- `speculo/` 目录更名为 `template/`，更清楚表达分发资产语义。
- init/update 合并为统一 `speculo init` 命令，更智能地保留状态。
- docs-sync 状态 schema 升至 v4，带逐工作流 `docs-sync.json` sidecar。
- 工作流资产从平铺 vendor 目录迁移为结构化包布局。

### 移除
- 旧 v2 工作流分类（dev、doc、person 顶层状态树）。
- 旧配置文件：`.speculo/.config/` 下 RULES.md、LESSONS.md。
- 旧技能：handoff、write-a-skill、caveman（被 `template/skills/` 中独立技能资产替代）。

[Unreleased]: https://github.com/NAMEWTA/Speculo/compare/v2.1.13...HEAD
[2.1.13]: https://github.com/NAMEWTA/Speculo/compare/v2.1.12...v2.1.13
[2.1.12]: https://github.com/NAMEWTA/Speculo/compare/v2.1.11...v2.1.12
[2.1.11]: https://github.com/NAMEWTA/Speculo/compare/v2.1.10...v2.1.11
[2.1.10]: https://github.com/NAMEWTA/Speculo/compare/v2.1.9...v2.1.10
[2.1.9]: https://github.com/NAMEWTA/Speculo/compare/v2.1.8...v2.1.9
[2.1.8]: https://github.com/NAMEWTA/Speculo/compare/v2.1.7...v2.1.8
[2.1.1]: https://github.com/NAMEWTA/Speculo/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/NAMEWTA/Speculo/compare/v2.0.6...v2.1.0
[2.0.6]: https://github.com/NAMEWTA/Speculo/compare/v2.0.5...v2.0.6
[2.0.5]: https://github.com/NAMEWTA/Speculo/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/NAMEWTA/Speculo/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/NAMEWTA/Speculo/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/NAMEWTA/Speculo/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/NAMEWTA/Speculo/compare/209f927...v2.0.1
[1.0.19]: https://github.com/NAMEWTA/Speculo/compare/v1.0.18...v1.0.19
