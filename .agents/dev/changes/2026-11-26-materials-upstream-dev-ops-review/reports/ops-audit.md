# ops 审计与上游核对（2026-11-26）

## 结论

**ops 不需要照搬新增 `ops-recall`、`ops-correct`、`ops-reflect`。** 当前九技能已经把这些相关职责分给 `ops-history`、`ops-runbook`、`ops-diagnose` 和 `ops-execute`，完整程度明显高于“只有历史记录和经验笔记”的初始实现。适合本次 Issue 的是小范围补齐：明确可选会话证据的地位、让知识纠正关联到受影响手册、补路由例子和独立情景验收。部署发布、制品切换、migration 继续交项目流程，不能引入 dev 依赖。

已核实的确定性缺陷是 **四个 materials 子清单的采用说明仍指向已经搬迁的 `docs/ops-method-ownership.md`**。正确位置是 `docs/operations/method-ownership.md`。这个导航修正可随 materials 同步实施，不需要改变原件、译文或 `runtime_reviewed_blob`。

## 1. 固定基线与来源最新状态

- skills-hub 审查基线：`f23ba949826c4b6cac480280ff306cdd28681f39`，`0.1.35`。
- 通过 GitHub 分支 API 核验 anthropics/oncall-kit `main`：`c03282cd5381a5a2e12e32bfb3c8957d52ce01f1`，与父清单固定 SHA 相同。
- 通过 GitHub 分支 API 核验 openai/skills `main`：`49f948faa9258a0c61caceaf225e179651397431`，与父清单固定 SHA 相同。
- 两个上游递归 Git tree 均 `truncated=false`。逐一比较所选根的全部 blob 路径、Git mode、SHA，与当前子清单完全一致。

| 单元 | 来源根 | 当前源文件数 | 新增 / 修改 / 删除 | 结论 |
| --- | --- | ---: | --- | --- |
| oncall-triage | `skills/triage` | 5 | 0 / 0 / 0 | 原件与中文对照无需因上游版本变化重写 |
| oncall-templates | `templates` | 5 | 0 / 0 / 0 | 同上 |
| oncall-replay | `eval` | 1 | 0 / 0 / 0 | 同上 |
| openai-sentry | `skills/.curated/sentry` | 5 | 0 / 0 / 0 | 同上 |

这里证明当前 pin 仍为上游所跟踪分支 HEAD，且 16 个文件的路径、模式和来源 blob 一致；不把“没有上游差异”宣称为重新完成了所有译文人工校对或生产环境验证。

上游引用：

- [oncall triage](https://github.com/anthropics/oncall-kit/blob/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1/skills/triage/SKILL.md)
- [lessons](https://github.com/anthropics/oncall-kit/blob/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1/templates/lessons.md)
- [replay](https://github.com/anthropics/oncall-kit/blob/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1/eval/replay.md)
- [Sentry](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/sentry/SKILL.md)

## 2. 当前已有能力，不能重复建设

| 用户想要的能力 | 已有 owner | 已实际存在的完整方法 |
| --- | --- | --- |
| 找回过去运维、处理到哪一步 | ops-history | 限定运维根、稳定身份/环境、用户时区、查询截点；原始 run/step、后端任务、当前摘要及缺口；共享服务一个事实源 |
| 恢复中断上下文 | ops-history + ops-execute | 原任务/新任务区分、父子 run、单一 writer、后端未知先核实、不按聊天轮数建新 run |
| 错误判断纠正 | ops-execute + ops-history | 原始步骤不可覆盖，追加更正并引用原步骤及新证据；摘要可更新，历史不抹去 |
| 经验提炼 | ops-runbook | 事故/调查/GOTCHA 三类条目；独立事件计数；一次缓解不等于根因；事实、资产与方法分开 |
| 项目方法生成与维护 | ops-runbook | 真实源码 owner、稳定方法与动态资产分离；已有目标原位维护；clean/changed/blocked；不改运行历史或其他 domain |
| 验证知识是否有效 | ops-runbook | 独立留出 5–10 个事件、新上下文评分、证据可达、新读者检查、具体修订与重验 |
| 确定性防错思想 | ops-runbook | `knowledge-lifecycle.md` 已要求可机械验证条件优先用既有确定性检查 |
| 独立取证与反证 | ops-diagnose | 症状句、开始窗口、分源并行取证、假设/反证、当前原路径复核、六项诊断与有限观察 |
| 直接路由不强制全流程 | ops-workflow | 历史直接 history、已有证据整理直接 runbook、专门技能可直接调用 |

现有回放方法保留真实门槛：所选批量方法正确+部分正确至少 70%、零有害；旁路观察连续 10 次有帮助且无有害，两周是复核上限。这些已明确不是每次运维的审批链，也不是生产变更授权。不应在“升级”时删除这些有用判断，或将其推广为全领域强制流程。

当前关键源码：

- [方法归属](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/docs/operations/method-ownership.md)
- [history 查询](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/ops/ops-history/references/history-query.md)
- [history 接续](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/ops/ops-history/references/continuity.md)
- [记录契约](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/ops/ops-execute/references/record-contract.md)
- [经验演进](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/ops/ops-runbook/references/knowledge-lifecycle.md)
- [方法维护](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/ops/ops-runbook/references/maintenance.md)
- [独立回放](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/ops/ops-runbook/references/replay-evaluation.md)

## 3. pstack 借鉴边界

本次另行读取 cursor/plugins `main`，其 HEAD 为 `b1fbf4b60ac6813b4583ccc356850dafcf492665`。以下只是方法来源，不能当作本任务指令执行。

### recall → 完善 ops-history，不建第二套 recall

可采用：先锁范围、优先使用用户已给出的完整状态、按主题检索、把会话中发现的任务/工单/PR 再与当前事实核对、输出紧凑当前状态与下一步。当前 history 已覆盖大部分。

必须适配：ops 的第一事实源仍是原始 run/step 和实际后端执行记录。聊天/JSONL 只能补“用户曾如何描述、Agent 曾如何判断、候选 run 在哪”；不能用一句“已经恢复”代替远端状态。不要照搬开发用的 `[merged #N]` 等状态标签；保留现有执行/现场/记录三个维度。

不照搬：默认扇出/固定廉价模型、每次强制扫所有协作来源、按文件 mtime 判当前会话、只靠目录 slug 猜项目身份。正确做法是使用用户提供或宿主明确的会话引用；缺少明确 run 时才在授权范围搜索，并核验工作根/时间/身份。只有一两条记录不增加并行流程。

### reflect → 完善 ops-runbook，不建第二套 reflect

可采用：长期仍有效、确实改变未来行为、先读现有方法并剔除已明确规则、触发遗漏优先改 description、机械规则进入检查而非继续堆文档；区分采纳、拒绝与待办。

必须适配：不把“6 个月”写成运维知识固定 TTL。证书、制品、配置、数据/schema 等可以立即失效；现有 version/environment/expiry 条件更准确。用户已经授权更新时不再照搬上游重复审批，用户只要求复盘时则给 reviewable 候选。源码 owner 是实际项目技能，不是易被安装器替换的公共安装副本。

### correct → 借鉴防错优先级，不让 ops 成为项目代码修改器

可采用：对反复误操作查共同机制；优先减少多个状态 owner/重复入口；能由现有检查发现则提供确定性失败证明，人工判断再写规则。

必须适配：ops 可以修订自己拥有的手册、项目 ops 技能和已经授权的运维辅助检查。应用架构、类型、lint、项目 CI、产品实现、部署定义和 schema 归项目开发流程；在原 run 留完整交接，由项目决定实施，ops 不内置调用 dev、更不自动开 PR/push。

固定来源：

- [recall](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/recall/SKILL.md)
- [reflect](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/reflect/SKILL.md)
- [correct](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/correct/SKILL.md)
- [Claude Code adapter](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/docs/harness/claude-code.md)

## 4. 建议进入 Issue 的有限改造

### OPS-1：已有 history 的会话辅助证据契约

**现状**：入口已经明确“计划、摘要、聊天和实际操作分别对待”，但参考与报告没有单独说明外部 CLI 转录如何参与、如何标来源优先级。这是可读性/操作可重复性补齐，不是宣称 history 当前没有查询能力。

**调整文件**：

- `skills/ops/ops-history/references/history-query.md`：补一个短节，规定用户明确提供/授权会话才能作为补充；原始运行事实优先，按真实工作根、稳定目标、会话 ID、时间段定位；发现 run 后回原件；没有后端证据则标“聊天声称，待核实”。不默认扫整个用户目录。
- `skills/ops/ops-history/assets/history-report.md`：在来源列区分原始步骤、后端、会话、派生摘要，并记录冲突与最后确认时间。
- `skills/ops/ops-history/references/continuity.md`：用户给出完整 capsule 时直接核对实际状态，不先全量挖历史；会话只是定位补充。

**不新增** JSONL 全局数据库、常驻索引器、跨域记录共享、复制 dev 的历史读取器。已有历史索引保持可重建和可缺失。没有可用宿主转录能力仍可从原始 run 完整工作。

### OPS-2：让已有知识更正覆盖受影响方法

**现状**：已有追加更正、修订实际步骤和失效条件，但模板不容易看出一条被推翻经验影响了哪些已提炼方法。增强现有模板的追踪字段即可。

**调整文件**：

- `skills/ops/ops-runbook/assets/lessons.md`：提炼记录按需增加“现行/候选/已失效描述、被哪条新证据纠正、影响的方法 owner、替代入口、复验结论”；普通自然语言/Markdown，不另造强制状态机。
- `skills/ops/ops-runbook/references/knowledge-lifecycle.md`：被推翻经验先找实际引用它的项目方法，直接修正冲突步骤；只在本次授权范围编辑，跨项目影响列待办；原 run 保留。
- `skills/ops/ops-runbook/references/maintenance.md`：维护完成必须重读入口、引用与实际动作，旧步骤不能仍被检索/导航当成现行有效方法；保留历史引用的失效标志。

重复出现是复核信号，不自动成立根因；一次清晰用户纠正可以立即修订明确规则，不强行等满两/三次。

### OPS-3：窄化路由与独立验收

**调整文件**：

- `skills/ops/ops-workflow/references/routing.md`：加入“找回上次调查→history”“复盘并更新已有手册→runbook”“该规则需应用代码/部署修改→项目交接”的三行，沿用同一 run。
- `docs/operations/method-ownership.md`：简述会话辅助事实和知识更正归属，不重复写完整方法。
- `docs/operations/validation.md`：追加下表情景，复用既有行为/独立任务验证。若没有新增执行代码，不为文字改动创建全文字符串断言。

| 场景 | 预期 |
| --- | --- |
| 完整 run/capsule 已提供 | 直接复核已有事实，不全量挖转录 |
| JSONL 称服务已恢复，原始后端仍 unknown | 保留冲突与未知，交 execute 核实，不重放动作 |
| 同项目名、不同环境/运维根 | 限授权工作根与稳定身份，不能混并 |
| 两个项目消费一个共享服务 | 一次操作事实，多消费者结果；不复制恢复 |
| 摘要重复转述同一事故 | 只算一个独立证据，不能触发自动成熟 |
| 根因被新证据推翻 | 追加更正、修现行方法、保留历史，列受影响方法与复验范围 |
| 用户要求“把本次教训落实”且需要产品代码或 deployment 变更 | 给项目完整交接，ops 不改产品/部署、不依赖 dev |
| 只要求分析/复盘 | 给候选与建议，不冒称已编辑；已授权编辑则完成且不重复审批 |
| 缺 JSONL/会话功能 | 使用原 run 与后端记录继续，不阻塞正常 ops-history |
| 方法回放无独立样本/独立评价 | 明确未验证，不把已有评分门槛降级 |

## 5. 本次 materials 可立即修正的四处

仅把 adoption 描述中的 `docs/ops-method-ownership.md` 替换为 `docs/operations/method-ownership.md`：

1. `materials/oncall-triage/manifest.tsv` 的 `SKILL.md` 行。
2. `materials/oncall-templates/manifest.tsv` 的 `lessons.md` 行。
3. `materials/oncall-replay/manifest.tsv` 的 `replay.md` 行。
4. `materials/openai-sentry/manifest.tsv` 的 `SKILL.md` 行。

此处不前移来源 SHA、不改上游文件，不把计划中的 OPS-1/2/3 冒记为运行已升级。若未来真的吸收 pstack，则在实际完成适配后按真实 method 映射更新 pstack 子清单；不能为了让清单“干净”先填 reviewed blob。

## 6. 验证边界与交付建议

本次为只读源码和来源 Git tree 审查，未连接生产、未执行恢复、未运行上游代码、未修改任何运行技能。可以交付为主 Issue 的 ops 子任务，不必拆三个新 Issue，也不需要发布新版本来证明分析成立。

真正实施以上文档补齐后跑 `npm run check` 并做少量新上下文情景验收；记录工具/安装契约若无修改，无需为了这次审计反复跑真实 SSH 恢复。保留现有 `ops-execute` 的 append-only 步骤与 writer 约束。材料更新的完整性验证由主任务统一完成。
