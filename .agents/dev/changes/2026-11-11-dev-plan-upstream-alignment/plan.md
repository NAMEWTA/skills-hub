# dev-plan 上游对照与融合

目标：按用户批准的 P1–P5 改进 dev-plan，以指定 Matt、pstack 固定版本为标杆，保留完整方法与模板，只解决已确认的本地适配冲突。交付点是本地修改和验证，不提交、推送或发布，不操作其他项目。

基线：`54f7a26`，开始时工作区干净。`node scripts/check.mjs` 已通过：35 个技能、355 份 Markdown、649 组资料配对。执行环境为 Linux、Node.js v24.22.1。

## 来源与适配边界

- Matt 固定修订 `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`：a017 research、a019 本地 tracker、a021 to-tickets、a025 wayfinder。补充核对 a012 implement-spec、a020 to-spec、a030 writing-for-agents，但不复制其他技能已负责的方法。
- pstack 固定修订 `8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b`：b015 multi-phase-plan；补充核对 b017 编排、b028 真实证据、b029 可验证单元、b041 技能编写、b044 评测、b086 共享写入。原件均在 materials/<编号>/original.txt，中文底稿不改动。
- 保留 a021 五步流程及本地/外部任务模板，b015 七步流程、完整计划模板、十个可选验证槽位、四份附录，a025 地图结构、任务类型与两种调用方式。
- 新增计划核对材料只把 a021 的粒度/依赖检查与 b015 的文件/构建/可见结果/验证逐项对应，不另建框架。用户再次强调以复刻为主，因此不另增一套完整原创计划示例文件；必要反例与现有模板就近说明，验证输入另存维护记录。

## 实施单元

| 单元 | 交付 | 依赖 | 文件边界 | 证据 |
| --- | --- | --- | --- | --- |
| 规则 | 强调指定上游、完整复制、必要少量适配 | 无 | AGENTS.md、docs/development-constraints.md | 原则与现有版权、中文、工具约束一致 |
| P1 | 入口明确何时读完整方法，新增简短计划核对 | 规则 | dev-plan/SKILL.md、agents/openai.yaml、references/plan-review.md | 自然请求对应方法与终点 |
| P2 | 保留模板结构，补齐行为/验收关系与必要实施导航，修正条件冲突 | P1 | vertical-slicing.md、plan-template.md、multiphase-plan.md | 对照 a021、b015 栏目和完整步骤 |
| P3 | 决策、研究与进度记录一致，避免多研究者同写 | P1 | uncertainty-map.md、research-method.md、local-work-records.md | 单项/并行研究与冷启动场景走查 |
| P4 | 修复调用方冲突，记录来源适配 | P2、P3 | dev-build 的研究落点、dev-help 的计划说明、materials/manifest.tsv | 不变更原件摘要，不复制跨技能完整方法 |
| P5 | 结构检查、来源复核与生成行为检查 | P4 | 本 change 记录、docs/validation.md | 实际命令、结果、独立性和未覆盖范围 |

单人顺序修改，避免多个执行者覆盖同一入口或模板。

## 验证

- `node scripts/check.mjs`、`node scripts/check-skill-quality.mjs --report`、`git diff --check`。
- 逐项对照保留的上游步骤、栏目、场景与附录；原件及中文底稿的摘要由现有材料检查核实。
- 覆盖小改动、明确规格、未知决定、依赖环、并行研究、已有实现、兼容迁移、整体替换、多 PR 的自然请求。能取得独立执行能力才做原版/修改版隔离比较；否则明确只做当前执行者走查，不冒称盲测或真实执行。
- 不新增通用计划检查器；如不修改验证器或安装行为，不为本轮文字适配改门禁。

进展与证据见 [progress](progress.md)。
