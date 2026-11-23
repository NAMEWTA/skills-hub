# 八类请求的技能入口评估

评估日期：2026-11-23。依据当前仓库 `skills/dev/` 中实际可读的入口描述、`dev-help` 的必要方法和 `dev-workflow` 路由作出判断。本次仅选择入口、说明职责与接续条件，没有执行八项请求，没有联网，也没有修改现有技能。

## 选择原则

`dev-help` 要求先识别用户需要的结果，阶段明确时选一个当前负责人，只有跨阶段或阶段不明时才需要 `dev-workflow` 统筹。推荐前核对能力地图和实际入口；已有契约、决定、计划和有效证据直接复用，其他技能只补具体缺口后返回。[帮助方法][help-method]、[能力地图][capabilities]与[工作流入口][workflow]一致要求按交付物选择，材料来自 Issue、聊天或报告并不决定路线。

本组请求的直接入口是：第 1、5、6、8 项使用 `dev-issue`，第 2 项使用 `dev-issue-triage`，第 3 项使用 `dev-plan`，第 4 项从 `dev-debug` 开始并接续 `dev-deploy`，第 7 项使用 `dev-intake`。

## 逐项判断

| 编号与请求 | 最合适的直接入口 | 选择理由 | 接续与交付终点 |
| --- | --- | --- | --- |
| **1. 我有个新点子，请研究这个项目并发布一个能直接认领的完整 Issue。** | `dev-issue`，新建并发布分支。 | 明确的最终产物是有项目依据、可独立接手的完整 GitHub Issue。该入口支持从一句想法开始，自行阅读代码与已有资料，再补目标行为、实施清单、验收及证据。研究是完成 Issue 的工作内容。[Issue 入口][issue] | 有散落来源才借用 `dev-intake`；存在代码不能代决的产品取舍才借用 `dev-grill`；行为约定不足才借用 `dev-spec`。技术取舍或体验依据有缺口时，按需调用对应方法并返回本 Issue。只有确需多张独立票据或依赖图才使用 `dev-plan`。核实目标仓库、查重并通过就绪检查后，按已有发布授权创建并回读。完成点是已核实的 Issue 与就绪结论；没有实施授权，不继续开发或开 PR。[编写方法][authoring] |
| **2. 把这些用户报告分类，找重复，告诉我分别该谁处理。** | `dev-issue-triage`。 | 分类、重复关系、负责层和处理去向正是其描述中的产物；用户提供的手工报告同样适用，不要求先建立报告管道。[分诊入口][triage] | 当前请求只需要分析结论及证据，没有必须继续的其他技能。资料不足时标明分类、查重或负责人判断的缺口。只在另有接入或持续监控目标时使用 `dev-issue-setup`。当前措辞不要求通知负责人、创建工单、复现或修复。 |
| **3. 按已定规格给我本地每任务一张票，再生成有依赖的 plan。** | `dev-plan`。 | 该入口明确负责一票一文件的本地实施票据，先保存各票，再从票据的真实阻塞关系组装 `plan.md` 的 DAG。用户已经给出规格和预期产物。[计划入口][plan] | 直接复用已定规格，核对必要前提后出票与生成计划。只有发现会影响范围、行为或验收的实际缺口时，才补相应澄清或规格。当前终点是票据和计划；后续实施需有对应授权才交 `dev-build`，发布 GitHub Issue 也需另有该目标才交 `dev-issue`。 |
| **4. 修复 #42 的崩溃，并提交 PR。** | `dev-debug`，修复验证后接 `dev-deploy` 的 PR 交付分支。 | 崩溃是功能故障，用户明确要求修复。`dev-debug` 的描述直接覆盖崩溃及“复现并修复这个 Issue”；`#42` 是问题来源，不能据此改选 Issue 撰写或分诊。[诊断入口][debug] | **需要继续 `dev-deploy`**，因为创建 PR 已在请求范围内。复用修复与验证证据，完成提交和 PR，并核对远端结果。[交付入口][deploy] 若需要总编排，`dev-workflow` 可协调这两个已明确阶段，但不会改变各自职责。没有可信分诊与真实 UI 控制等证据时，不选择专用的 `dev-issue-fix` 管道。请求终点为修复后的可审查 PR，没有要求合并或环境部署。[报告修复入口][issue-fix] |
| **5. 完善我旧 Issue 的正文，保留已完成项，按新评论补方案。** | `dev-issue`，`update` 分支。 | 请求是维护已有完整正文。该入口要求读取正文、全部评论及关联 PR 的实际进展，保留仍有效的需求、完成勾选、证据和附件，再按新讨论合并方案。[Issue 入口][issue]、[GitHub 操作方法][github-operations] | 通常无需转交。仅当新评论揭示行为契约或技术决策缺口时，借用相应方法并返回同一 Issue。沿用已有权威记录，写入前复读最新远端并合并变化，写入后回读核对。终点是更新后的正文；不附加通知评论，不自动重开、关闭或改变指派。 |
| **6. 在别人的 Issue 下面追加我的性能分析，只评论。** | `dev-issue`，`comment` 分支。 | 最终动作是追加有证据的评论。性能是评论内容，原作者身份不会改变入口。先读原 Issue 与讨论，引用此次新增分析，区分证据、推断与建议。[Issue 入口][issue]、[GitHub 操作方法][github-operations] | 现有分析已充分时不必继续其他技能。确需核实性能数字或分析轨迹时，可按当前授权借用 `dev-benchmark`，结果仍返回评论任务；不因出现“性能”就开始优化代码。[性能入口][benchmark] 只新增评论并回读，保留原正文、他人评论和讨论状态。 |
| **7. 把这堆聊天整理成目标、事实、范围与缺口。** | `dev-intake`。 | 用户要求的产物是需求简报，其字段与 `dev-intake` 的描述直接对应。整理来源、事实、目标、范围、已有决定和缺口即可；“聊天”只是来源格式。[需求整理入口][intake] | 当前目标不需要继续其他技能。代码或材料能够回答的事实先查清；不能查清的事项记录为缺口。只有后续需要解决会改变结果的产品取舍，或补足独立实施契约时，才分别调用 `dev-grill`、`dev-spec`。本次以简报收束，不自动变成可认领 Issue、访谈或实施任务。 |
| **8. 用现有规格准备完整 Issue 草稿，先不发布。** | `dev-issue`，完整正文草稿分支。 | 该入口既支持发布，也支持只交付草稿。既有规格是输入与权威行为来源，最终交付物仍是完整 Issue 正文。[Issue 入口][issue] | 规格充分时直接复用，无须重做访谈、规格或本地拆票。正文写出接手者需要的背景、范围、方案、任务与验收，并标明权威来源路径及版本；来源不可访问时补入必要内容。交付完整草稿及就绪结论，不创建或更新远端对象。[编写方法][authoring]、[GitHub 操作方法][github-operations] |

## 容易影响判断的边界

### Issue 撰写可以包含研究

第 1 项虽然从新点子出发，目标仍然明确。`dev-workflow` 的路由明确把“可认领 Issue、正文修订或增量评论”交给 `dev-issue`；后者按缺口借用需求整理、产品决策、规格或证据方法，完成后返回 Issue 任务。因此，不能把 `dev-intake`、`dev-grill`、`dev-spec`、`dev-plan` 排成每次必经的前置流程。[阶段衔接][workflow-routing]

“可认领实施”要有充分的范围、行为与验收依据。若研究后仍有会改变结果的未决事项，入口保持 `dev-issue`，结果应如实标明待澄清内容。只有调查或测量工作本身明确且符合用户目标时，才可标为“可认领调查”；不能为满足发布动作擅自把功能需求改成调查任务。[编写方法][authoring]

### 三类相近产物各有负责人

完整 GitHub Issue 正文、正文维护和增量评论归 `dev-issue`；报告的类型、重复关系与处理去向归 `dev-issue-triage`；本地每任务一张票以及依赖计划归 `dev-plan`。Issue 内可以包含实施清单，但跨切片票据和 DAG 由 `dev-plan` 维护。已有本地计划发布到 Issue 时保留原权威记录，不再维护一套独立任务进度。[能力地图][capabilities]、[计划入口][plan]

### 故障修复和评论维护按各自目标结束

第 4 项明确要求修复并开 PR，必须继续到 PR 交付。`dev-issue-fix` 有可信分诊、真实 UI 控制和双次 UI 证据等专用前提；普通 Issue 故障由 `dev-debug` 负责。第 6 项明确限定只评论，性能内容只决定需要什么证据，不产生代码优化授权。[诊断入口][debug]、[报告修复入口][issue-fix]、[GitHub 操作方法][github-operations]

## 核对范围

已读取 `dev-help/SKILL.md`、帮助方法、能力地图和路由指南，`dev-workflow/SKILL.md` 与阶段路由，以及上述直接入口的实际 `SKILL.md`。Issue 的创建、更新、评论和草稿边界还核对了其编写方法与 GitHub 操作方法。辅助技能仅按相关职责核对描述，未执行其流程。

本次唯一交付文件为本报告。未读取同目录其他代理输出，未调用外部服务，未生成、更新或评论任何真实 Issue，也未执行修复、拆票或 PR 操作。

[help-method]: ../../../../../../skills/dev/dev-help/references/help-method.md
[capabilities]: ../../../../../../skills/dev/dev-help/references/capabilities.md
[workflow]: ../../../../../../skills/dev/dev-workflow/SKILL.md
[workflow-routing]: ../../../../../../skills/dev/dev-workflow/references/workflow-routing.md
[issue]: ../../../../../../skills/dev/dev-issue/SKILL.md
[authoring]: ../../../../../../skills/dev/dev-issue/references/authoring.md
[github-operations]: ../../../../../../skills/dev/dev-issue/references/github-operations.md
[triage]: ../../../../../../skills/dev/dev-issue-triage/SKILL.md
[plan]: ../../../../../../skills/dev/dev-plan/SKILL.md
[debug]: ../../../../../../skills/dev/dev-debug/SKILL.md
[deploy]: ../../../../../../skills/dev/dev-deploy/SKILL.md
[issue-fix]: ../../../../../../skills/dev/dev-issue-fix/SKILL.md
[benchmark]: ../../../../../../skills/dev/dev-benchmark/SKILL.md
[intake]: ../../../../../../skills/dev/dev-intake/SKILL.md
