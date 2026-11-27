# 上游方法对照

采用 [材料父清单](../../../../materials/manifest.tsv) 的 Matt Pocock `6f7f7831a625f040a8e06a0e7954826b87ce775a` 与 pstack `b7b93c36be9bcc36a74db438e0fd385d660bc559`。阅读固定快照及中文对照，以下说明运行采用及本地差异。

| 来源 | 保留的方法 | 本地落点与差异 |
| --- | --- | --- |
| [Matt grilling](../../../../materials/mattpocock-skills/upstream/productivity/grilling/SKILL.md) | 设计树、编号前沿、推荐答案、依赖解锁、事实先查 | `dev-grill` 保留完整轮次方法。过大的前沿可分成少量题，事实调查按实际宿主能力完成，已获执行授权直接沿用。 |
| [Matt grill-with-docs](../../../../materials/mattpocock-skills/upstream/engineering/grill-with-docs/SKILL.md) 与 [domain-modeling](../../../../materials/mattpocock-skills/upstream/engineering/domain-modeling/SKILL.md) | 访谈中即时更新已确认词汇，按三个条件筛选值得保留的 ADR | `dev-grill` 负责访谈和当轮写回，既有 `dev-architecture`、`dev-archive` 分别维持领域建模和记录格式。 |
| [Matt local Markdown tracker](../../../../materials/mattpocock-skills/upstream/engineering/setup-matt-pocock-skills/issue-tracker-local.md) 与 [Wayfinder](../../../../materials/mattpocock-skills/upstream/engineering/wayfinder/SKILL.md) | 固定规格文件，每票独立文件，明确依赖，评论历史追加，问题答案与地图索引 | `dev-spec` 固定写入 Change 的 `spec.md`。`dev-grill` 独立访谈写 `decisions.md`，地图写回 `questions/` 原题。`dev-plan` 保留本仓的 `tasks/` 与同名 `evidences/` 配对。 |
| [Matt to-spec](../../../../materials/mattpocock-skills/upstream/engineering/to-spec/SKILL.md) | 综合已有共识、领域词汇和 ADR，优先最高可验收接缝，保留完整模板及原型片段例外 | `dev-spec` 保存同一份现行规格并按可核对的已定决定迁移旧 brief。未决产品选择交回访谈。需要远端发布时按本仓现有授权交给 `dev-issue`。 |
| [Matt to-tickets](../../../../materials/mattpocock-skills/upstream/engineering/to-tickets/SKILL.md) | 垂直切片、真实阻塞、按依赖编号、机械改动的扩展到收缩与整合例外 | `dev-plan` 以同一 Change 的规格为前提，逐票验证独立交接并组装索引。粒度等实质分歧按需与用户核对，已有授权继续沿用。 |
| [pstack multi-phase-plan](../../../../materials/pstack/upstream/claude-code/skills/poteto-mode/playbooks/multi-phase-plan.md) 与 [sequence-verifiable-units](../../../../materials/pstack/upstream/claude-code/skills/principle-sequence-verifiable-units/SKILL.md) | 先用可运行原型回答未知、按阶段或 PR 编排依赖与写入边界、具体验证与可观察证据 | `dev-plan` 保留多阶段模板和实测要求。按实际风险选择性能探针与基线。用户明确要求正式规划时，单个切片也保存规格、票据、报告和计划。 |
| [pstack show-me-your-work](../../../../materials/pstack/upstream/claude-code/skills/show-me-your-work/SKILL.md) | 一个历史记录，重要取舍带证据，追加更正并可接续 | `dev-workflow` 保留其运行轨迹方法。`dev-grill` 将追加和替代语义用于当前 Change 的 Markdown 问答，来源依宿主实际可见资料。 |

按任务记录实际验证，见[验收计划](plan.md)与[隔离验证](evidences/03-validation.md)。
