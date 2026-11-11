# dev-plan 任务交接优化：来源与适配

日期：2026-11-11。基线 `8be629b`。用户先要求调研 Speculo、Matt 与 Claude/OpenAI 官方资料，随后授权全面优化，特别强调 Matt、OpenAI、Claude 的最佳实践。范围是 dev-plan 及其来源、验证说明；不修改安装器，不升级固定来源，不提交、推送或发布。

## 来源角色

- 主体继续使用仓库固定 Matt `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` 的 [to-tickets](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/to-tickets/SKILL.md)，完整原件是 [a021](../../../../materials/a021/original.txt)。固定 pstack 多阶段计划 [b015](../../../../materials/b015/original.txt) 保留原有完整结构。
- 官方文档用于补充交接、验证、风险和技能编写原则，不移植其整套模板，不把局部建议冒称统一任务标准。已回读本次调研取得的官方正文；未转载全文，不新增伪称全文翻译的 materials 条目。
- Speculo 固定版 `9199c3b` 的六份 tickets 文件及相关规则已调研；远端对照版本固定为 `994a64427a6784053dd092a86713870062cfde2f`。后者已移除旧模板与控制机制。它是用户指定的交叉对照，不升级本仓库 E/F 组，也不把旧 Schema、Ready、Map、Skill 哈希绑定或工作区政策迁入本轮。

## 对应原文、保留与必要适配

| 来源与原文位置 | 本轮保留或补充 | 适配理由与明确不采用内容 |
| --- | --- | --- |
| Matt Process 1–5；“a narrow but COMPLETE path”；“single fresh context window” | 五步顺序、垂直行为、独立验收、真实阻塞、粒度核对、跟踪器发布及两类紧凑模板保留 | 独立会话缺少聊天上下文，补充可读来源与约束；同上下文小任务仍保持最简，不重写原模板 |
| Matt “Work the frontier”；宽重构 expand–contract / integration branch | 保留真实前沿、前置产物与宽重构完整例外 | 延续已有本地适配：用户允许整体替换时不新增兼容层；无授权不更改父事项、不发布远端内容 |
| Matt “avoid specific file paths or code snippets”；允许承载决定的原型片段 | 行为契约与当前代码导航分开，保留原型例外 | 和实施计划的精确定位要求分层融合；路径注明观察版本，新增文件明确计划创建，不把行号变成长久契约 |
| [OpenAI ExecPlans](https://developers.openai.com/cookbook/articles/codex_exec_plans) Purpose / Guidelines：“Purpose and intent come first”；“Anchor the plan with observable outcomes” | 任务说明必要背景、用户可见结果、条件/动作/预期结果及证据入口 | 在现有单个切片中补充，不采用完整 ExecPlan 固定章节、代码围栏、全量上下文复制或默认提交规则 |
| 同文 Requirements：“There is no memory of prior plans and no external context”；Guidelines：“Specify repository context explicitly” | 新上下文只凭任务、可读来源与当前代码可接手；指针不可访问时提供必要原文；命令说明运行位置与环境 | 项目要求单一权威来源，因此可通过实际可读指针组成上下文，不复制整份规格和仓库事实；不声称这与原文全文自包含要求完全相同 |
| 同文 Guidelines：“Be idempotent and safe”；Milestones 独立可验证 | 真实高风险才展开关键顺序、部分完成核对、重试/恢复/停止及兼容收缩条件；本项与最终整合分别验收 | 不为普通文案或低风险任务强制回滚、审批、迁移清单；不凭提示词声称实现原子性或幂等 |
| [Claude Code best practices](https://code.claude.com/docs/en/best-practices) Tell Claude what it can't see / Give Claude a check to run：“Only write down what Claude can't find by reading the repo”；“ask Claude for evidence” | 保留代码外决定与理由、真实命令/观察/输出和环境缺口；结构检查不冒充行为证据 | 不复制整个架构说明，不把“测试通过”当结果；不在任务中强制安装宿主 Hook 或额外工具 |
| [Claude Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) Concise / Degrees of freedom：“Match the level of specificity to the task's fragility and variability” | 入口只保留判断与导航，详细内容在资源；普通局部实现留给实施者，只有脆弱操作固定必要顺序 | 不新增 Lite/Standard/Deep 字段、固定步数或空栏目；保留现有多阶段完整模板，非所有任务默认加载 |
| 同文 Examples / Template pattern / Evaluation and iteration：“Create evaluations BEFORE writing extensive documentation” | 增加假想项目的正反例，沿用现有单个切片模板；先准备同请求原版/修改版隔离场景，再检查真实输出 | 示例明确非当前代码与非运行结果；评测不以关键词/字段数量代替质量，也不靠主观更长判优 |
| [OpenAI Codex prompting](https://developers.openai.com/codex/prompting/)：“names the behavior ... preserves important constraints ... how to verify” | 对独立任务补必要来源、边界和验证；小任务不需固定提示格式 | 不引入宿主专用命令、固定模型或强制技能预扫描 |
| [OpenAI skill evals](https://developers.openai.com/blog/eval-skills) “prompt → ... trace + artifacts → ... checks” | 保存实际请求、独立输出、退出结果和检查限制，比较具体遗漏与不必要工作 | 不把单次输出宣称统计提升、多模型验证或生产成功；不为这次可逆文字修改建立永久评测框架 |
| [Speculo 对照版 tickets](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-t-tickets/SKILL.md) 独立协作 / 交付与继续 | 对照规格反向覆盖、真实消费者、共享语义冲突与整体验收；用户明确数量不能静默减少 | 在原 plan 与核对清单添加导航，不引入新 Map、状态副本或额外工作区 |

官方文档为动态页面，以上链接、原文片段和核对日期说明本轮采用的原则，不代表已固定整个官方站点的版本。调研原始抓取位于 `/tmp/skills-hub-dev-plan-research/`，不是运行或恢复本技能的前提。

## 文件职责

- `SKILL.md`、`agents/openai.yaml`：明确同一任务的独立交接与规格覆盖，不扩大入口到实际实现。
- `vertical-slicing.md`：保留五步及两类模板，修正独立接手的读取条件，并直接消除“一律一文件”与小任务表格的局部矛盾。
- `plan-template.md`：沿用最小计划和单个切片栏目/顺序，补充按风险说明与仅导航的可选覆盖表。
- `plan-review.md`：整合完整规格反查、真实共享对象、风险证据、来源可达与失效范围，不另建准入流程。
- `multiphase-plan.md`：保留七步、任务块顺序、十个可选场景槽位和四附录，仅在原位置衔接覆盖、交接与风险。
- `task-examples.md`：本地假想项目示例，按现有模板说明最小任务、交接、覆盖和语义冲突；不冒称上游原件或真实运行。
- `materials/manifest.tsv`：只补运行映射与本轮适配理由；原件、译文及双方摘要保持不变。

## 交付判断

需要在保持小任务轻量的同时，证明独立任务能承接全部规格、准确定位上下文并安排可判定验证。具体执行过的检查、原始请求、独立输出及首轮缺口后的修正见[验证与限制](verification.md)；本文只记录来源与修改依据，不以文本更完整直接推导效果提升。
