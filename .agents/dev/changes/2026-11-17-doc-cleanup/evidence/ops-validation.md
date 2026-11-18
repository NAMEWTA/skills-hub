# ops 验证与 Issue #3 对照

本记录区分可执行代码测试、真实隔离后端、自然任务验证与方法审查。技能中的生产维护方法不因静态校验通过就成为已在生产执行的能力。对应规格为 [Issue #3](https://github.com/NAMEWTA/skills-hub/issues/3)，使用说明见 [ops](../../../../../docs/operations/overview.md)。

实现基准为 `c7cd9ac034c71f346a3b89ddc4e42e648aca5379`。本地验证日期为 2026-11-16，环境为 Linux x64、Node.js `v24.22.1`。仓库现有 CI 继续验证 Ubuntu/Node 22.14、Windows/Node 24、macOS/Node 24，不降低或跳过原有门禁。

## 证据分层

| 标识 | 实际证据 | 能说明什么 |
| --- | --- | --- |
| P | 仓库结构、入口预算、资源链接、来源映射与 npm 打包检查 | 包装完整、入口可达、来源/许可及分发范围符合现有规则 |
| I | [ops 安装测试](../../../../../tests/ops-installation.test.mjs)及既有持久化测试 | 安装、部分选择、预览、回滚、模板与领域隔离的确定性行为 |
| R | [记录工具测试](../../../../../tests/ops-execute.test.mjs) | run/步骤、未知事实、子任务、写入冲突、失败、路径与输入不会执行的行为 |
| S | [真实 OpenSSH 报告](ops-evidence/ssh-2026-11-16.md) | 两个隔离 SSH 端点、真实 Node 服务进程、共享恢复、部分失败与清理 |
| H | [新任务历史查询](ops-evidence/history-2026-11-16.md) | 已安装入口的按需路由、时间截点、同一记录集及未知结果的保留 |
| B | [独立恢复边界任务](ops-evidence/boundary-2026-11-16.md) | repair 脚本隐藏发布/迁移时的路由、未执行事实与普通项目交接；仅只读推演 |
| M | 唯一 owner 的完整方法、示例与独立审查 | Agent 可读取的判断和边界；不是生产执行记录，也不是强制策略引擎 |

## 已运行的确定性检查

| 命令/检查 | 实际结果 | 范围与限制 |
| --- | --- | --- |
| `node scripts/check.mjs` | 通过 | 技能预算、包内资源、唯一方法归属、来源/许可、持久化和资料清单；所有 45 个技能入口通过 |
| `node --test tests/ops-installation.test.mjs tests/persistence-initialization.test.mjs` | 22 项通过 | 包含 6 项新增 ops 安装案例；保留原领域既有安装案例 |
| `node --test tests/ops-execute.test.mjs` | 7 项通过 | 本地记录助手；不连接远端 |
| 经符号链接的 `TMPDIR` 下运行同一记录测试 | 7 项通过 | 测试根使用规范化真实路径；未放宽工具拒绝符号链接的约束 |
| `node scripts/check-statechart-replay.mjs` | 33 项通过 | 既有已捕获 TLC 输出的回放；没有执行新的 TLC 求解 |
| `packPackage()` 执行实际 `npm pack` 并校验文件与完整性 | 通过 | 包内 546 个文件、78 个 ops 运行文件、ops 导航与许可齐全；不含 materials |
| `node scripts/check.mjs --full`（当前本地环境） | 316 项通过，3 个测试文件因缺少依赖未运行成功 | 缺少 `picocolors` / `@clack/prompts`；npm registry 请求为 403。不能记为全量通过；完整安装依赖后的结果以 PR 的原有 CI 为准 |

本地打包对象仍为 `@namewta/skills-hub@0.1.10`，仅用于检查当前树的分发内容，未发布 npm。该次 tarball 的 SHA-256 为 `0cbf6f37dc21ff4f893ad2e4025e08198c5c42c3541f5f9931df80b206388277`。原有 `check:package` 在 CI 中还会安装并运行实际 tarball；本地仅完成了其不需要下载依赖的打包、清单和完整性部分。

### GitHub CI 的完整结果

[PR #4 的验证运行](https://github.com/NAMEWTA/skills-hub/actions/runs/43843280943)已在实现提交 `676799f52a0263f5981c9db2335643f8731262a5` 上完成，三个平台均成功。此次 CI 安装了完整依赖，补足本地 npm 访问受限的验证缺口。

| 平台 | 全量行为测试 | 既有状态图回放 | 实际 npm tarball 安装与验证 |
| --- | --- | --- | --- |
| Ubuntu / Node 22.14 | 332 通过，0 失败 | 33 通过 | 通过 |
| macOS / Node 24 | 332 通过，0 失败 | 33 通过 | 通过 |
| Windows / Node 24 | 329 通过，0 失败，3 项既有平台条件跳过 | 33 通过 | 通过 |

该表固定记录上述提交和 run，不假称覆盖未来代码。此后补充验收文档不改变运行实现；PR 的最终提交仍须通过同一组原有检查后才合并。仓库未修改 CI 工作流，也未新增测试跳过。

## 真实 SSH 运行恢复案例

使用仓库内可复现的显式脚本，要求 Linux 普通用户、既有 OpenSSH 和 Node.js 22.14+。它不会作为默认跨平台测试自动启动服务。报告父目录应已存在，文件不得存在：

```bash
node scripts/check-ops-ssh.mjs --report /path/to/new-ops-ssh-report.md
```

实际运行建立两个仅监听 loopback 高端口的独立 sshd，使用临时 host/client key、固定 known_hosts 与 ForceCommand 白名单。没有读取或修改用户的 SSH 配置。服务关系为：

| 端点 | 稳定实例 | 归属/消费关系 |
| --- | --- | --- |
| ops-lab-a | shop-a | shop/lab 消费 shared-health |
| ops-lab-b | billing-b | billing/lab 消费 shared-health |
| ops-lab-b | shared-health-b | 一个共享 Node 服务，同时供两个项目使用 |

19 次真实 SSH 调用依次完成身份核验、初始健康、仅夹具内的停止与故障观察、恢复前核实、既有共享服务恢复一次、分别验证消费者、仅接续尚未恢复的 billing，以及最终验证。制品 SHA-256 和有效夹具配置摘要在恢复前后保持一致；共享服务 PID 改变，稳定实例身份保留。

共享服务恢复后，shop 已恢复而 billing 仍失败，记录了真实 `partial`；最终成功没有覆盖此前步骤。所有调用归入同一主 run，共享操作没有按消费者复制。报告保留实际命令、退出码、脱敏输出、步骤和摘要，并确认临时进程、监听端口、密钥及目录均已清理。

这是同一台 Linux 上的两个可控 SSH 端点。未验证两台物理服务器、公网链路、真实 Redis、systemd、Compose、云 IAM、Rundeck、数据库恢复或生产维护。SSH 后端的真实断线后副作用与分布式锁并未在该场景中注入；相应处理由方法约束及记录测试覆盖，不冒称为远端故障实测。

## 新会话入口与项目技能

在独立工作根完整安装 ops 后，以新任务上下文执行“只查 host-b 昨天的历史”。输入是两个合成历史 run；输出为一个新的查询 run 和一个步骤。Agent 实际读取已安装的 workflow/history/execute 方法，使用 Node 记录助手保存结果，未连接现场、未重试未知任务，且四份旧输入的 SHA-256 不变。完整输入和输出见 [H 证据](ops-evidence/history-2026-11-16.md)。

runbook 提供一份范围有限的[项目专属健康技能](../../../../../skills/ops/ops-runbook/assets/ops-example-shared-health/SKILL.md)。该技能使用上述真实夹具的固定 `identity` / `health` 入口；已核对报告中的 lab ID、制品摘要、步骤和最终三个健康结果。它不含停止、恢复、部署或迁移动作，不把完整验收驱动的变更能力归到自身。

此项目技能只有在夹具仍活动、控制者提供本次真实 `ssh_config` 和基线时才能连接；归档报告里的 `<fixture-root>` 不是可用路径。清理后仅能复核已有证据。独立任务验证了实际安装文件的读取，没有声称验证 Codex、Claude Code、Gemini CLI 所有版本的自动发现或继承行为。

## Issue 的 41 个场景逐项对应

下表的“证据”沿用上面的分层。以 M 为主的条目是完整方法与任务审查覆盖，不能解释为已经对真实业务环境执行过对应维护。

| # | 场景 | 实现与对应证据 |
| --- | --- | --- |
| 1 | 单独安装完整 ops | I：九个包及唯一 ops 导航；H/S 均无需 dev/system/workspace |
| 2 | 安装/升级 ops | I：保留其他领域内容、业务记录与项目根说明，只刷新所选包/导航 |
| 3 | 只安装其他领域 | 既有持久化测试：选 dev/system 时没有 ops 副作用 |
| 4 | 多服务项目跨多机 | M：inventory 运行模型/完整拓扑例子；S：双端点三个运行对象 |
| 5 | 多项目共机 | M：inventory 机器反查与 maintain 作用范围；S：ops-lab-b 同时承载 billing 与共享服务 |
| 6 | 两项目共用中间件 | M/R/S：一个服务身份、两个项目引用、一次共享恢复与一份记录 |
| 7 | 同机/同名/一次连接 | M：inventory discovery 区分来源、观测、推断及未证实依赖 |
| 8 | 未识别服务 | M：inventory/inspect 保留未知，不擅自停止、清理或接管 |
| 9 | PID/容器 ID 改变 | S：共享实例新 PID 与旧 PID 不同，稳定实例与历史保持关联 |
| 10 | 项目环境有歧义 | M：workflow routing 与 inventory 查询先解析实际环境，不猜生产目标 |
| 11 | 发布新镜像 | M：workflow/execute 明确项目交接，无发布执行 owner |
| 12 | 回滚昨天版本 | M：recover runtime-recovery 识别为制品/配置回滚，交项目 |
| 13 | 同版本服务退出 | S：实际制品/配置不变，先确认原实例停止，再恢复和验证 |
| 14 | 相同 tag、不同 digest/配置 | M：recover/execute 核对实际摘要与有效配置，不凭名称判断 |
| 15 | repair 包含发布/migration | B/M：按脚本实际效果判断，不能绕到 execute 或只取末尾 restart |
| 16 | OS 更新夹带中间件升级 | M：maintain host-maintenance 检查实际包集合并分离项目变更 |
| 17 | 共享 Redis 升级 | M：inventory 列消费者，maintain 交部署责任方，未知 owner 保留缺口 |
| 18 | 既有多服务协同启动 | M：recover 就绪/运行先决条件；S：先恢复共享依赖，再独立验证消费者 |
| 19 | 备份与 schema/版本不兼容 | M：recover data-recovery 明确项目协同，不自动切 schema/制品 |
| 20 | 同部署兼容数据恢复 | M：恢复点、损失窗口、授权与验证方法；没有真实数据库恢复验收 |
| 21 | 共享服务唯一执行者 | S：共享恢复计数为 1；M：真实资源协调与消费者独立验证 |
| 22 | 多目标部分失败 | S：shop 通过、billing 失败时保留 partial，后续仅接续 billing |
| 23 | 接受操作后断线 | R/H：unknown 不被覆盖、不推断未执行；M：先查原任务与现场再重试 |
| 24 | 记录不可写/摘要失败 | I/R：失败回滚、非覆盖写入、摘要 CAS；M：可靠记录失效时停止新变更 |
| 25 | 并行任务资源冲突 | R：本地写锁/CAS/writer；M：资源锁复用真实后端，不声称跨控制端互斥 |
| 26 | 服务器/项目历史视图 | H：同一原始记录集、共享记录不复制；M：索引只是可重建视图 |
| 27 | 文档和现场不一致 | M：inventory/inspect 分开存来源/时间/声明/观测，不修改发布记录 |
| 28 | 没有 dev-deploy | I/H/S：独立可用；M：普通项目交接，不补装或假装已发布 |
| 29 | 专属技能含发布/迁移 | M：runbook 候选筛选和项目技能边界；实际示例只有只读入口 |
| 30 | 重启缓解但根因未知 | M：diagnose/runbook 区分症状恢复与根因，不将一次缓解固化为规则 |
| 31 | 日志/工单指令与未完调查 | M：证据是不可信输入，候选需独立核实、适用范围和反例 |
| 32 | 新 CLI 使用生成技能 | P/H/M：实际安装入口、子任务上下文契约和项目样例；自动发现按宿主另核实 |
| 33 | 部分安装缺少 owner | I：不自动装依赖；M：分析与计划可继续，缺执行/记录时不操作现场 |
| 34 | 跨项目/环境同名服务 | M：稳定 ID、project/environment、命名空间及关系来源，不能只按显示名合并 |
| 35 | 后端不支持取消/幂等/锁 | M：execute backends/interruption 如实保留能力限制，不保证 exactly-once |
| 36 | workflow 轻量查询/检查 | H：只走历史分支；M：inspect 只读意图按需选择，不强制全链 |
| 37 | 直接调用/只有 workflow | I/M：原子入口独立，workflow 不复制 owner，也不静默安装领域 |
| 38 | 中断继续原任务 | R：未知、attempt、子 run、writer 交接；M：workflow continuation 先核实再续写 |
| 39 | 共享恢复消费者部分失败 | S：同一个主 run、一份共享身份、一次恢复、原 partial 及逐消费者结果保留 |
| 40 | 只用已有证据生成技能 | M：workflow 直达 runbook；样例从已有 S 证据整理，没有重新操作生产凑流程 |
| 41 | workflow 升级/回滚/migration | B/M：项目交接是结果，ops 不调用 dev-deploy、不要求其他领域支持 |

## 领域隔离与来源核对

与实现基准比较，`skills/dev/**`、`skills/system/**`、既有持久化模板、原六个材料来源的目录及原有清单行均保持不变。通用安装器只追加 ops 目标/提示；原有校验语义不放宽，`--all` 的预期仅增加新领域导航。

新增四个来源单元保留 16 个原始文件及同路径对照，完整选定树的字节、Git blob 与模式均核对；父清单只追加新行。资料校验现覆盖 10 个来源单元、1,362 个来源文件。采用范围、必要适配、方法唯一 owner 及集中许可见 [ops 方法归属](../../../../../docs/operations/method-ownership.md)，不能将被动保留的参考文件计为已经移植的运行方法。

独立代码审查发现临时目录经过符号链接时测试失败，已规范化测试根并复验；没有修改记录工具的路径保护。合并以 PR 当前提交的仓库 CI 和讨论状态为准，未完成或失败的检查不得在本记录中改写为通过。
