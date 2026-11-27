# 逐项审查开发方法和状态图变化

## 已复核并采用

以 `ac71b45` 的运行版为基线，对照 pstack `b7b93c36`、Matt Pocock `6f7f7831` 和 DeepSeek `4b399c39` 的固定原文、新旧清单及运行文件。本次采用的正文和入口按下表核对。

| 来源 | 运行采用和范围 |
| --- | --- |
| pstack `architect/SKILL.md` | `dev-architecture/references/architecture-method.md` 用同一条真实业务操作比较两个结构不同的边界、状态所有者及调用者负担。实施中出现同类绕路时重新考虑职责。保留理由模板和危险信号。 |
| pstack `how/SKILL.md` | `dev-learn/references/module-exploration.md` 对单一操作一次探索和解释，沿真实入口、状态所有者和失败路径核对。存在独立视角时采用既有探索和解释参考。 |
| pstack `why/SKILL.md` | `dev-why/references/investigation-method.md` 优先查最初引入和后续修改的提交、PR 与作者记录。需要补证时再扩展到相应来源，以证据强度和实际范围限定结论。保留按类别展开完整调查的能力。 |
| pstack `reframe/SKILL.md` | `dev-learn/references/reframe.md` 从真实任务区分可能的术语，核对使用该术语的来源与相邻领域，说明类比边界，最后检查重述是否保留原要求。 |
| pstack `poteto-mode/worker.md` | `dev-workflow/references/delegate-role.md` 沿用任务验收条件，从基线和当前失败区分影响，报告可复核证据。在所给范围内完成可逆选择。草稿策略、对外操作和执行会话复用按现有授权。 |
| Matt `engineering/domain-modeling/GLOSSARY-FORMAT.md` | `dev-archive/references/glossary-format.md` 在定义中用加粗的规范词连接已有术语，并用订单、发票、客户举例。项目已有词汇表继续作为唯一维护位置。 |
| DeepSeek `dsh-code-review/SKILL.md` | `dev-review/references/review-baseline.md` 依据实际 base/head、行为所属原件、清单及调用点检查包职责和必要依赖。 |
| DeepSeek `dsh-error-handling/SKILL.md` | `dev-debug/references/diagnostic-loop.md` 保存错误标识、cause 和操作身份，对部分或未知副作用先查状态。允许忽略的失败限定在单项操作，区分可忽略条件与应报告错误。 |
| DeepSeek `dsh-pr-description/SKILL.md` | `dev-deploy/references/pull-request-procedure.md` 在结构变化时说明职责、具体依赖方向、可选与组装边和关键调用。长表留 Change，PR 按本仓格式链接；回读核对最新 diff。 |
| DeepSeek `dsh-client-ui-ux/references/icons.md` | `dev-ui-design/references/design-system.md` 保持既有图标描边和填形规则，按实际尺寸核对。组件库改动要求验证实际调用方，尺寸取项目真实规则。 |

## 保留、迁出与未采用

逐行对照 [pstack 删除清单](../reports/pstack-sync-report.md#删除来源与旧运行映射)与当前运行文件，确认 24 份删除源文件中原有 22 份带运行映射，现存 18 份运行文件。各删除源的旧 blob 与运行路径保留在旧清单报告。

| 删除或变化 | 当前决定 |
| --- | --- |
| architect 的 `design-red-flags.md`、`rationale-template.md`、`runner-prompt.md` | 分别保留为危险信号、理由模板、候选任务说明。它们支持真实调用方、具体设计取舍和独立候选责任。 |
| how 的 `explainer-prompt.md`、`explorer-prompt.md` | 分别保留为按场景选用的解释和探索资源。一次调用链只采用解释结构，避免为窄问题安排完整探索流程。 |
| why 的 `epistemics.md`、`investigator-prompt.md`、`source-playbook.md`、`synthesizer-prompt.md` 及 code-archaeology、databricks、datadog、incident-postmortem、linear、notion、sentry、slack 八项来源指南 | 保留置信、调查和综合方法以及八份可选来源指南，分别支持历史设计证据、事故、遥测及远端记录的核查。现行入口以实际证据缺口决定何时读取。 |
| poteto 的 `orchestrate.md`、`check-plan.mjs`、`check-plan.test.ts` | 保留 `dev-parallel/references/program-coordination.md` 中多个执行者的明确归属、结果验证和接续。两个删除脚本没有运行映射。计划依赖及票据图由既有 `dev-plan` 和 `dev-program` 承担。 |
| reflect 的 `divergent-reviewer.md`、`judgment-reviewer.md`、`synthesizer.md`、`tooling-reviewer.md` | 旧四份复盘模板连同配套入口迁出归档包。其判断、工具、漏项和综合步骤归 `dev-reflect`，高风险时按需独立审阅。核查技能、文档和 README 后无指向四份旧模板的入链。 |
| pstack 的原则与写作差异 | 逐条以 pstack 的 question premise、边界、工具、数字、根因、基础设计、幂等、读者负担、领域、行为证据、共享状态、可验证切片、行为测试、类型纪律及 technical-writing、unslop 对照现有负责文件。保留现有方法中的例子、反例、验证和判断。上游的压缩、格式及宿主链接变化无需改写运行版。 |
| pstack 工作流与指南 | `multi-phase-plan` 的独立依赖、真实场景和 PR 证据与现有 `dev-plan`、`dev-program`、`dev-deploy` 匹配。指南、工作流入口、代理和 playbook 的 Claude/Cursor 配置、固定模型或新会话默认、强制所有 PR 就绪、40 行上限、无条件性能检查，以及 plugin JSON、README、工具包配置留作材料。对于仍引用旧本地适配的行，避免仅凭指南同步推进采用依据。 |
| DeepSeek `dsh-pre-push-checks/SKILL.md`、`dsh-merging-stacked-prs/SKILL.md` | 逐项核对已存在的基线更新、分支所有权、绑定已知头的 lease 和实际堆叠行为。目标项目决定变基或 merge-forward，继续保留平台检测。DeepSeek 默认启用 rerere、专用 pnpm 检查、新的 GitHub stack 命令策略留作材料。 |
| DeepSeek `dsh-cua-macos-signing/SKILL.md` | 变更是 macOS 专用插件包名和配置入口。独立材料保留，dev 未接入此宿主包。 |
| Matt `in-progress/README.md`、`chief-of-staff/SKILL.md`、`chief-of-staff/agents/openai.yaml`、`software-factory/SKILL.md`、`software-factory/EXAMPLE-TASKS.md` | README 和 metadata 更新只影响上游发现。前者的来源指针和有日期的工作经验在当前负责人和记录体系已有落点，保留一次会话可接续多票的规则。软件工厂新增实例中的复现、分诊证据与实施者分工由现有 dev issue 方法处理。周期调度、固定全新会话、自动转交工单和另建 wiki 无新运行采用。 |

## 验证

通过读取两级 TSV 和运行树验证 pstack 24 个删除源的去留。用本地链接搜索确认旧四份反思模板没有技能、文档或 README 入链。

`node scripts/validate.mjs` 通过，核对 67 项技能及 1,559 条本地链接。`node scripts/validate-materials.mjs` 通过，核对全部 2,196 个源文件的本地集合、摘要及运行路径。

同一固定 corpus 的状态图 captured-output replay 通过 33/33，SANY 解析失败、CRLF 和生命周期等定向回归 4/4。适用入口、用例及范围见[状态图与独立包验证](22-packages.md)。运行阶段沿用捕获的轨迹，新的 TLC 求解留在真实模型和 Java/TLC 环境中验证。
