# dev 与 system 证据写入审查

审查基线为 `d6b7d32`。按 `skills/dev` 和 `skills/system` 的 42 个入口枚举包内参考、模板和运行工具，查找保存位置与真实文件写入，再回读命中处的调用和约束。本表记录策划时的原行为与拟改范围，行号对应基线；实测结果见各票同名报告。路径与报告契约见[实施计划](plan.md#路径与生命周期)。

## dev：直接产生取证文件或验收记录

| 技能 | 现状与依据 | 实施范围 |
| --- | --- | --- |
| `dev-plan` | [多阶段计划](../../../../skills/dev/dev-plan/references/multiphase-plan.md#L98)要求 `evidence/<task-id>/<scenario>/<slug>.png`。同模板的回归块和 PR 审查另有截图、复制和录像路径。 | 改所有阶段、回归槽位和 PR 媒体指令；[本地记录](../../../../skills/dev/dev-plan/references/local-work-records.md)、[票据模板](../../../../skills/dev/dev-plan/references/plan-template.md)、切片和计划审查方法引用原票同名报告，不创建空证据目录。研究、规格和已确认原型仍是独立资料。 |
| `dev-verify` | [入口](../../../../skills/dev/dev-verify/SKILL.md#L40)将结果放 `evidence.md` 及被引用产物目录，[创建示例](../../../../skills/dev/dev-verify/references/feature-map-example.md#L32)与[搜索示例](../../../../skills/dev/dev-verify/references/feature-search-example.md#L37)把 ARIA、截图写到 `artifacts/`。验证包生成与维护各自说明取证及清理。 | 持有 dev 证据存储的完整方法与报告示例。更新入口、功能图示例、生成和维护说明，确保新生成的 `dev-verify-<app>` 也传入目标项目的运行目录并复用原报告。数据隔离和清理条件不弱化；验收所需附件要在清理后可回读。 |
| `dev-debug`、`dev-tdd` | [调试](../../../../skills/dev/dev-debug/SKILL.md#L54)、[诊断环](../../../../skills/dev/dev-debug/references/diagnostic-loop.md#L24)和 [TDD](../../../../skills/dev/dev-tdd/SKILL.md#L40)使用 Change 根 `evidence.md`；诊断会保存轨迹重放。[手工复现脚本](../../../../skills/dev/dev-debug/scripts/manual-reproduction.mjs)只向终端输出。 | 复现、红绿结果、根因检查写同名报告。重定向或捕获时传入 `temp/dev/`，不强迫 stdout 工具落盘。临时探针与持续维护的失败回归测试分开。 |
| `dev-issue-setup`、`dev-issue-triage`、`dev-issue-fix` | 三个入口要求不同阶段的本地证据或恢复点写根 `evidence.md`；[分诊方法](../../../../skills/dev/dev-issue-triage/references/triage-method.md#L244)也有旧写入。[复现方法](../../../../skills/dev/dev-issue-fix/references/fix-method.md#L199)交给配置的工件目录，[控制适配器](../../../../skills/dev/dev-issue-fix/references/control-adapter.md#L137)要求在仓库之外。 | 更新入口、适配器、运行输出与恢复示例；适配器使用目标根的 ignored `temp/dev/` 目录，不改来源身份、可信分诊、真实双次复现、保留期和外发授权。监控游标、现有平台对象仍是恢复/来源记录，不是第二份验收报告。 |
| `dev-benchmark` | [入口](../../../../skills/dev/dev-benchmark/SKILL.md#L37)、[性能事项](../../../../skills/dev/dev-benchmark/references/performance-issue.md#L17)、[爬坡优化](../../../../skills/dev/dev-benchmark/references/hillclimb.md#L9)使用 change 目录、代码树外或忽略目录。[轨迹取证](../../../../skills/dev/dev-benchmark/references/trace-forensics.md)还会生成可查询数据。 | 原始捕获、样本、SQLite 转换和逐轮 TSV 只写 `temp/dev/`。把测量及实验模板用于同名报告内的结论和可复跑条件，保留单位、预算、样本方法和实际前后对比。 |
| `dev-formal-verify` | [入口](../../../../skills/dev/dev-formal-verify/SKILL.md#L28)指定 `verification/`。[TLC 包装器](../../../../skills/dev/dev-formal-verify/assets/run-tlc.mjs#L17)省略第 3 参数时写 `<model>-verification`。`check-model.mjs` 默认 stdout，显式 `--out` 会写原始报告。 | 改 TLC 输出参数、生成的项目验证技能和执行/维护模板，把 stdout、状态库、检查器 Markdown 和反例工件归 `temp/dev/`。手写适用属性、模型版本、代码映射和检查结论留报告或真实模型文档；不改变原始 TLC 退出码。 |
| `dev-statechart` | [入口](../../../../skills/dev/dev-statechart/SKILL.md#L24)与[方法](../../../../skills/dev/dev-statechart/references/statechart-method.md#L21)默认 `verification/`。[主入口](../../../../skills/dev/dev-statechart/scripts/statechart.mjs#L57)默认 `<SPEC>-chart`；[渲染器](../../../../skills/dev/dev-statechart/scripts/render.mjs#L20)默认输入同级 SVG。 | 改 CLI 与文档示例，避免 `report.md`、`chart.mmd`、SVG 和 TLC 轨迹落在输入旁。保留无覆盖、暂存后发布、信号清理、反例与工具错误的区别。维护回放仍在隔离目录，历史 corpus 不迁移。 |
| `dev-prototype`、`dev-ui-design` | [确认原型](../../../../skills/dev/dev-prototype/references/change-prototype.md)区分完整 HTML/资源和辅助截图；[UI 设计](../../../../skills/dev/dev-ui-design/SKILL.md#L43)要求将实际截图写入设计说明或等价文件。 | 保留确认原型和指纹工具、设计决定、真实用户确认记录。调整视觉对照、运行截图/录像与指纹输出示例；报告以实际版本、视口、主题、操作与观察取证，不把截图当原型。 |
| `dev-parallel`、`dev-status` | [并行](../../../../skills/dev/dev-parallel/SKILL.md#L33)使用 `parallel/`，并允许候选工作区在 `/tmp/`；[状态回顾](../../../../skills/dev/dev-status/SKILL.md#L34)允许保存简报、分镜、清单。 | 保留候选工作区隔离、必要比较决定和明确要求的交付成片。候选原始结果、剪辑输入、试渲染与检查输出进 `temp/dev/`，比较或状态文档引用原 task，不再建证据集合。 |
| `dev-deploy` | [PR 步骤](../../../../skills/dev/dev-deploy/references/pull-request-procedure.md#L22)附截图/录像；证据、已验证合并、部署记录和自动化队列各有消费点。`watch-pr` 输出到终端。 | PR 指向实际可访问的结果或已授权附件渠道，不为 PR 把原件提交进仓库。CI 日志保留原生运行 ID，若下载需进 `temp/dev/`。版本发布记录、环境 runbook 和真实备份不迁移。只在该技能负责整体终点时汇总 Change 验收，不以“已开 PR”冒充合并或上线。 |
| `dev-workflow`、`dev-guardrails` | [决策轨迹](../../../../skills/dev/dev-workflow/references/decision-trail.md#L35)允许任意 TSV 路径，[真实证据](../../../../skills/dev/dev-guardrails/references/real-evidence.md#L19)允许大型工作提交审计原件。 | 决定及理由仍留 Markdown；改 TSV 调用路径和可提交条款。决策轨迹和实际证据复用同一报告，不把所有取证步骤硬塞进入口。未变更记录字段、表格和证据强度标准。 |

## dev：消费、接续与不需要改变的内容

| 技能 | 核对结果与实施范围 |
| --- | --- |
| `dev-build`、`dev-review` | [实施](../../../../skills/dev/dev-build/SKILL.md#L26)链接证据，[审查](../../../../skills/dev/dev-review/SKILL.md#L68)引用根 `evidence.md`，对抗审查原始复现常在独立工作树。调整实施任务图、审查模板和验证交回：保持一位写入者，引用原票报告及实际验证版本。修改证据路径不改变普通项目规则、两轴审查和明确要求的独立性。 |
| `dev-program`、`dev-handoff`、`dev-archive` | [批次](../../../../skills/dev/dev-program/references/batch.md)读取成员结果并做组合验收；[交接](../../../../skills/dev/dev-handoff/references/handoff-method.md)读取已有证据；[归档](../../../../skills/dev/dev-archive/references/change-closure.md)会移动 Change 和修复链接。更新这些消费者，不复制成员报告。归档保留新任务原票、Markdown 验收和正式资产，不收进临时附件；旧证据不在本次范围。 |
| `dev-help`、`dev-setup` | 帮助的实施、自治、验证、PR 和常用配方仍可能传播旧写法；[自治指南](../../../../skills/dev/dev-help/references/guide-autonomous.md#L58)有当次记录和提交建议。更新帮助示例及 [形式验证配置](../../../../skills/dev/dev-setup/references/formal-options.md)的取证出口，不改变工具安装或角色选择。 |
| `dev-personalize`、`dev-why` | 偏好依据与历史动机的长期结论不是运行原件。保留决定、源指针和置信限制；若保存调查原始输出归 `temp/dev/`。实际票据的验收只链接或写入一份同名报告。核对[偏好记录](../../../../skills/dev/dev-personalize/SKILL.md#L45)与[动机调查](../../../../skills/dev/dev-why/references/investigation-method.md#L99)，不把整段会话写入报告。 |
| `dev-intake`、`dev-issue`、`dev-spec`、`dev-grill`、`dev-sharpen`、`dev-architecture` | 输入材料、事项正文、权威规格、研究、设计决定不是运行输出。保留其本职文件和已有来源链接；新增取证交实际任务处理，不因发出 Issue、访谈或写规格自动生成目录。未发现需要改写的默认原件输出。 |
| `dev-worktree`、`dev-merge-conflict` | 检出、Git 状态和合并记录不是临时验收附件；检查结果沿调用者的原票。保留独立工作区、多 worktree 权限与当前未提交的冲突技能编辑。本次不改变其 Git 行为。 |
| `dev-learn`、`dev-writing` | 学习导读、写作简报和真实交付物不是运行原件。保留长期知识与文档原位置；不要用新增 notes 或写作记录充当第二份任务验收。未发现需更改的固定原件输出。 |

## system：六个技能都纳入检查

| 技能 | 现状与实施范围 |
| --- | --- |
| `system-herdr`、`system-herdr-core` | [TUI](../../../../skills/system/system-herdr/SKILL.md#L262)和 [Core](../../../../skills/system/system-herdr-core/SKILL.md#L128)默认写 `.agents/system/ignore/`，入口及 task/report 模板含相对路径，topic 管理共享可达性。改两套入口、topic/task/report、协作指南和恢复流。`manifest.tsv`、主题、派发编号和完整终端身份继续承担协调职责，派发回执不重复业务验收。既有派发和附件不处理。 |
| `system-inspect` | [脚本](../../../../skills/system/system-inspect/scripts/inspect.mjs)只读并打印 Markdown；[健康审计](../../../../skills/system/system-inspect/references/health-audit.md)提供原生命令。保留 stdout 默认和实际主机前提。要留存时在 `temp/system/` 捕获，报告引用采样对象、窗口、实际值及缺口。 |
| `system-cleanup` | [Linux 清理工作流](../../../../skills/system/system-cleanup/references/linux-cleanup-workflow.md#L5)已有 `/tmp/cleanup-...-manifest.txt` 示例。区分待批准/已执行的清理清单与原始扫描、前后空间输出。后者改 `temp/system/`；不扩大删除范围，不删除别人的附件或正在用的文件。 |
| `system-config` | [变更方法](../../../../skills/system/system-config/references/changes.md#L23)要求私有的恢复备份，另外有配置执行和验收输出。备份、凭据及实际生效的配置不搬动；需要保留的脱敏诊断、读回和验证输出改写 `temp/system/`。 |
| `system-proxy` | [DNS 工作流](../../../../skills/system/system-proxy/references/dns-workflow.md#L85)在选定目录生成请求二进制、响应头和响应二进制。更新具体命令的工作目录和 `--dump-header`、`--output` 位置，不只改入口。网络路径、负面判据、恢复办法和保护边界不变。 |

## 安装、校验与文档

| 位置 | 依据与范围 |
| --- | --- |
| [`.gitignore`](../../../../.gitignore)、[初始化模块](../../../../scripts/init-persistence.mjs) | 本仓库已有 `temp/`；真正缺口是消费项目。现初始化分别补开发 worktree 与旧系统附件规则，统一到 `/temp/` 并保留 worktree 规则。旧规则与业务文件不自动删除。 |
| [CLI](../../../../cli.mjs)、[非交互入口](../../../../install.mjs)、[导航模板](../../../../scripts/persistence/) | 对齐交互确认、显式安装及预览输出、三份相关领域导航。沿用现有写前检查、双锁与原字节回滚。 |
| [路径校验](../../../../scripts/check-persistence-roots.mjs)、[初始化测试](../../../../tests/persistence-initialization.test.mjs)、[工具运行测试](../../../../tests/runtime.test.mjs)、[包验收](../../../../scripts/check-package.mjs) | 校验当前写入默认值而非历史引用。更新已对旧路径作断言的测试，检查真实 Git 排除、报告一一对应、负面路径和真实 npm 包安装。 |
| [根约定](../../../../AGENTS.md)、[安装契约](../../../../docs/usage/installation.md)、[持久化目录](../../../../docs/reference/persistence-roots.md)、[Herdr 协作](../../../../docs/usage/herdr-coordination.md) | 把路径和兼容性变更写进实际使用说明；同步 README 与 CHANGELOG。开发流程、Issue 来源、交接、原型、知识归档、项目架构和验证指南应引用同一契约，不把早期历史路径当新模板。按实际资源改动核对来源采用映射，不改原件。 |

`skills/ops`、`upstream-skills`、`materials`、历史发布报告和其他消费者项目不属于实施范围。本清单不是对所有工具运行能力或过往取证内容的认证。
