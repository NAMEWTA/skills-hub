# GitHub Issue #15 来源快照

- 平台：GitHub
- 仓库：NAMEWTA/skills-hub
- 原始地址：https://github.com/NAMEWTA/skills-hub/issues/15
- 原生编号：15
- 状态：closed
- 获取时间（UTC）：2026-11-26T08:30:07.145Z
- 正文更新时间：2026-11-25T06:51:37Z
- 评论：已取回全部 0 条，与 Issue 返回计数 0 一致。

## 原始标题

fix(dev): 由 dev-setup 配置派遣规则，允许同一 Agent 会话处理多个 task

## 原始正文

## 目标

任务要求与执行 Agent 会话相互独立：一项 task 描述要完成的工作，某个 Agent session 可以依次处理多个 task。由 `dev-setup` 在现有团队配置中记录用户选定的派遣规则，Lead 按该规则和实际情况分配任务；Lead 与 worker 都可以使用各自 CLI 已支持的能力自行压缩上下文并继续。

本次是配置约定和冲突文案的局部调整。不得把“换了一个 task”“完成一次回告”或“需要压缩上下文”自动推导为必须创建新 Agent/session；同样不要求所有任务永远复用同一会话。是否复用、并行或需要独立上下文，由本次已选规则和任务实际需要决定。

## 当前依据

核验基线：[main f782755](https://github.com/NAMEWTA/skills-hub/commit/f782755b780646e09ae3fcb56598d89df090eb98)，读取日期：2026-11-25。

- 用户报告：使用 dev domain 配合 system-herdr-core 编排时，遇到上下文满后新开 session，不符合希望一个执行者持续完成多项任务的使用方式。尚未在用户现场复现，不把该现象认定为 herdr-core 的运行时缺陷。
- [dev-setup 已支持显式选择的团队文件](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-setup/SKILL.md#L21)，位置为 `.agents/dev/context/team/<team_name>.md`，可以直接补充派遣约定。
- [system-herdr-core 已支持同一终端的 task01/report01、task02/report02](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/system/system-herdr-core/SKILL.md#L115)；[worker 回告后等待下一项派发](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/system/system-herdr-core/assets/task.md#L37)。现有能力能够承接本次规则，不必重做协议。
- [workflow-routing 已明确不要求每次实施新开会话，并支持压缩后继续](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-workflow/references/workflow-routing.md#L34)。本次主要消除与它相反的局部要求。

## 确定的行为

1. **Task 与会话分开。** Task 保留各自目标、输入、范围、产物和验收；执行者可以按派遣规则承接多个 task，不建立 task 与 session 必须一一对应的约束。
2. **按配置选择执行者。** Lead 可以把后续 task 继续派给原 worker，也可以根据并行需要或独立性要求选用其他 worker。worker 在已授权范围承担子级协调时，同样遵循其本次适用的规则。
3. **自主压缩。** Lead 与 worker 都可以根据上下文情况，使用当前 CLI 实际支持的压缩能力后继续。正常压缩不等于失败、交接或新建会话，不要求为了压缩先退出整个执行过程。
4. **同一会话顺序处理。** 沿用既有派发方式和同一 worker 同时一项活动任务的约束。多个 task 可以预先规划并依次交给同一 worker，不能覆盖在途派发或把忙碌会话当成另一个并行执行者。
5. **已选规则在同一批次持续有效。** 后续 task、补充、修复和压缩后接续保留本次选择，不要求每个 task 重新指定团队。新的无关用户请求仍按原有显式选择规则处理。
6. **保留必要独立性。** 独立评审、独立方案候选等仍按其明确条件使用独立上下文；任务可独立接手的要求继续保留。

## dev-setup 怎样配置

直接扩展现有 `assets/team.md` 的“协作约定”，并在 `references/configure-team.md` 解释适用范围。只需普通 Markdown，沿用现有团队文件的创建、更新和显式引用方式。

可保存的约定示例：

> 本次任务要求与执行 Agent 会话分开。Lead 根据任务和实际运行情况，允许将多个 task 依次派给同一个 worker session；需要并行或独立判断时再使用其他执行者。Lead 和 worker 均可使用当前 CLI 实际支持的压缩能力后继续，不因 task 切换或正常压缩强制创建新会话。独立评审和任务验收沿用已有要求。

用户要求配置派遣规则时即可与团队配置一起保存。普通环境初始化不自动创建默认团队。其他 dev 技能遵循本次已选约定，不增加调用 `dev-setup` 的前置步骤，也不扫描或自动合并所有团队文件。

CLI、模型、推理设置和派遣工具继续由用户选择，本次不引入固定值或修改原生参数。配置表达执行约定，不伪称仅保存 Markdown 就改变了 CLI 底层行为。

## 与上述规则直接冲突的内容

下表路径相对 `skills/dev/`；修改是局部句子调整，不是重构整个技能。

| 位置 | 当前冲突 | 最小修改 |
| --- | --- | --- |
| [dev-workflow/references/delegate-role.md:7](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-workflow/references/delegate-role.md#L7) | 每个新任务优先独立上下文，复用被限制为必要状态或同一未完任务。 | 取消固定偏好，按本次已选派遣规则选择执行者，允许同一会话接续不同 task。 |
| [dev-workflow/references/execution-support.md:23](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-workflow/references/execution-support.md#L23) | 再次要求新任务优先独立上下文。 | 删除相反默认，保留产物核验、任务范围和已有执行约束。 |
| [dev-workflow/references/operating-method.md:94](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-workflow/references/operating-method.md#L94) | 虽以逐项独立上下文模式为前提，后文把修复、后续工作、重试和下一队列项统统绑定新执行者。 | 仅在本次明确采用该模式时适用；普通任务按已选配置决定复用或新建，保留完整任务范围和指令传递要求。 |
| [dev-plan/references/research-method.md:1](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-plan/references/research-method.md#L1) | 普通后台研究被要求使用新的上下文窗口。 | 允许交给已有合适研究者，是否使用独立上下文按本次规则和研究要求决定。 |
| [dev-grill/references/decision-interview.md:23](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-grill/references/decision-interview.md#L23) | 查环境、文件和工具等事实时要求拥有全新上下文的子智能体。 | 删除对全新上下文的无条件要求，保留主动查证与并行推进的方法。 |
| [dev-build/references/implement-task-graph.md:42](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-build/references/implement-task-graph.md#L42) | 审查后的实施返工必须交给新的实施子代理。 | 按本次派遣规则选择实施者，允许原实施者继续修复；独立审查本身不变。 |

### 需要澄清适用范围的几处表述

| 位置 | 最小澄清 |
| --- | --- |
| [dev-workflow/references/phase-boundaries.md:37–41](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-workflow/references/phase-boundaries.md#L37) | 可以无人值守不自动等于需要新执行者；Lead 与 worker 均可自行压缩后继续。将描述压缩结果的“新会话”改为“压缩后的会话”。保留原 handoff 分支。 |
| [dev-build/references/implement-task-graph.md:19、40](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-build/references/implement-task-graph.md#L19) | 独立工作树不自动要求新 session；下一批工单可以派给原执行者。保留工作树隔离、集成和预算方法。 |
| [dev-parallel/references/program-coordination.md:12、22](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-parallel/references/program-coordination.md#L12) | 需要已有状态时可以向原执行者追加 task，不必一律分叉；正常上下文压缩不属于失败或停滞，不能仅因此替换执行者。保留原有真实失败处理。 |
| [dev-setup/references/configure-team.md:9](https://github.com/NAMEWTA/skills-hub/blob/f782755b780646e09ae3fcb56598d89df090eb98/skills/dev/dev-setup/references/configure-team.md#L9) | “新任务不继承上次选择”指新的无关请求；同一已授权批次中的后续 task 仍沿用已经选定的规则。 |

下列内容不属于本次冲突：任务大小适合一个上下文、任务可以被新会话独立理解、确有必要的独立评审和独立候选。这些要求有助于任务自包含或判断独立，不应机械删除。

## 最小实施范围

| SKILL | 本次改动文件 |
| --- | --- |
| dev-setup | `SKILL.md` 的团队配置说明、`references/configure-team.md`、`assets/team.md`。 |
| dev-workflow | `references/delegate-role.md`、`references/execution-support.md`、`references/operating-method.md`、`references/phase-boundaries.md`。 |
| dev-build | `references/implement-task-graph.md`。 |
| dev-parallel | `references/program-coordination.md`。 |
| dev-plan | `references/research-method.md`。 |
| dev-grill | `references/decision-interview.md`。 |

先补好 dev-setup 的约定，再逐处消除上表冲突。其他技能只在相关句子中遵循“本次已选派遣规则”，不各自复制一套长规则。若当前文档或材料采用映射受这些实际改动影响，只同步对应说明和映射。

### 范围边界

- **dev-handoff 及其模板、原有交接方式保持不变。** 保存、交接、恢复或明确暂停仍按原方法使用；多 task 复用不要求逐 task 触发 handoff。
- **system-herdr-core、system-herdr 的启动命令和文件协作协议保持不变。** 不增加 session ID 表、manifest 字段、队列、恢复框架或回收策略。
- 不新增 SKILL、配置格式、后台服务、CLI 适配器、状态机或会话账本。
- 不扩展 dev-program、dev-status、dev-worktree、环境预算等相邻体系；现有独立审查和资源约束继续适用。

## 验收与验证

- [ ] 使用 dev-setup 可以把上述派遣约定保存到用户选择的现有团队文件；不新建一套配置体系。
- [ ] 显式采用该约定后，两个目标不同且适合连续处理的 task 可以依次交给同一 worker session，各自交付和验收。
- [ ] Lead 或 worker 正常压缩上下文后继续当前工作，不因压缩强制启动新的会话或触发 handoff。
- [ ] 同一批次的后续 task 保留已选规则；用户不需要逐 task 重复指定团队或运行 dev-setup。
- [ ] 需要独立评审、独立候选或真实并行时，仍可以使用不同执行者，未被改成“所有任务必须复用”。
- [ ] 上表的相反默认已逐处消除；任务自包含、既有 handoff、Herdr 协议和必要隔离保持。

按仓库要求运行 `npm run check`。用上述自然场景核对配置读取和实际派遣选择；具备现有 CLI 环境时，轻量验证一次同 session 连续两项任务及其可用压缩行为，并如实记录验证范围。不为文字调整新建测试平台、自动调度服务或全 CLI 兼容矩阵。

**认领状态：可认领实施。** 用户要求、文件范围和验收已明确；现场故障的具体触发链尚未复现，不影响修正已核实的相反文案。本 Issue 交付的是配置约定与局部一致性修改。

## 完整讨论

原 Issue 无评论。
