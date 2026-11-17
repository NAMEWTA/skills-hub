# 来源适配记录

## 基线与边界

本次沿用仓库固定来源，仅修正已认可的职责冲突，不同步新的上游版本。`materials/manifest.tsv`、来源原件、中文底稿、Git blob/内容摘要与许可均不变。`runtime_reviewed_blob` 保持原值，不将局部适配冒充对全部最新上游方法的重新认证。

完整方法只维护一份。运行入口、模板、调用者和 UI 描述同步修正；实际源码与当前命令仍是工具能力依据。

## 逐项运行适配

| 来源项目与文件 | 当前运行位置 | 本次适配 |
| --- | --- | --- |
| `mattpocock-skills/engineering/ask-matt/SKILL.md` | `skills/dev/dev-workflow/references/workflow-routing.md` | 按真实缺口调用且返回当前负责人，契约与决定单处维护，保留guardrails适用条件并复用有效证据 |
| `mattpocock-skills/engineering/code-review/SKILL.md` | `skills/dev/dev-review/references/two-axis-review.md` | 无spec文件仍审明确用户要求；沿用有效证据，并纠正PR意见分诊的调用归属 |
| `mattpocock-skills/engineering/diagnosing-bugs/SKILL.md` | `skills/dev/dev-debug/references/diagnostic-method.md` | 按证据选择可证伪假设；3–5个仅为复杂调查参考，不作为起测门槛 |
| `mattpocock-skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md` | `skills/dev/dev-plan/references/local-work-records.md` | 携带同一权威契约、问题与决定位置；访谈返回原问题记录 |
| `mattpocock-skills/engineering/to-spec/SKILL.md` | `skills/dev/dev-spec/references/specification-method.md` | 在既有权威契约中补足行为与验收；复用充分简报，保留完整模板、例子与反例 |
| `mattpocock-skills/engineering/triage/AGENT-BRIEF.md` | `skills/dev/dev-spec/references/implementation-brief.md` | 完整实施简报从dev-intake迁到dev-spec，正文与四类示例保留；来源整理与报告分诊、诊断分开；完整行为契约归dev-spec，按实际缺口交接 |
| `mattpocock-skills/engineering/triage/SKILL.md` | `skills/dev/dev-intake/references/requirement-triage.md` | 来源整理与报告分诊、诊断分开；完整行为契约归dev-spec，按实际缺口交接 |
| `mattpocock-skills/engineering/wayfinder/SKILL.md` | `skills/dev/dev-plan/references/uncertainty-map.md` | 携带同一权威契约、问题与决定位置；访谈返回原问题记录 |
| `mattpocock-skills/productivity/grill-me/SKILL.md` | `skills/dev/dev-grill/references/interview-entry.md` | 决策访谈沿用已有共识与调用方指定的决定记录，解决未决选择后返回 |
| `mattpocock-skills/productivity/grilling/SKILL.md` | `skills/dev/dev-grill/references/decision-interview.md` | 决策访谈沿用已有共识与调用方指定的决定记录，解决未决选择后返回 |
| `mattpocock-skills/productivity/writing-for-agents/SKILL-MECHANICS.md` | `skills/dev/dev-writing/references/skill-format.md` | 区分包内链接闭包与按技能名调用，避免禁止合法的跨技能协作 |
| `pstack/claude-code/docs/guide/01-setup.md` | `skills/dev/dev-help/references/guide-setup.md` | 帮助目录与示例同步真实负责者、四类需求入口、双分支和验证工具边界 |
| `pstack/claude-code/docs/guide/02-poteto-mode.md` | `skills/dev/dev-help/references/guide-routing.md` | 帮助目录与示例同步真实负责者、四类需求入口、双分支和验证工具边界 |
| `pstack/claude-code/docs/guide/06-verify-and-ship.md` | `skills/dev/dev-help/references/guide-verification.md` | 帮助目录与示例同步真实负责者、四类需求入口、双分支和验证工具边界 |
| `pstack/claude-code/docs/guide/09-make-it-yours.md` | `skills/dev/dev-help/references/guide-personal.md` | 帮助目录与示例同步真实负责者、四类需求入口、双分支和验证工具边界 |
| `pstack/claude-code/docs/guide/10-recipes-and-pitfalls.md` | `skills/dev/dev-help/references/guide-recipes.md` | 帮助目录与示例同步真实负责者、四类需求入口、双分支和验证工具边界 |
| `pstack/claude-code/skills/create-formal-verification-skill/SKILL.md` | `skills/dev/dev-formal-verify/references/create-check.md` | 按模型格式交接，JS检查不传给statechart；新建形式验证包使用dev-formal-verify前缀并检查名称冲突 |
| `pstack/claude-code/skills/create-verification-skill/SKILL.md` | `skills/dev/dev-verify/references/verification-authoring.md` | 应用验证包与形式验证包分名，创建前核对已有职责；依版本、环境与范围复用有效证据 |
| `pstack/claude-code/skills/maintain-formal-verification-skill/SKILL.md` | `skills/dev/dev-formal-verify/references/maintain-check.md` | 按模型格式交接，JS检查不传给statechart；新建形式验证包使用dev-formal-verify前缀并检查名称冲突 |
| `pstack/claude-code/skills/maintain-verification-skill/SKILL.md` | `skills/dev/dev-verify/references/verification-maintenance.md` | 应用验证包与形式验证包分名，创建前核对已有职责；依版本、环境与范围复用有效证据 |
| `pstack/claude-code/skills/poteto-help/SKILL.md` | `skills/dev/dev-help/references/help-method.md` | 帮助目录与示例同步真实负责者、四类需求入口、双分支和验证工具边界 |
| `pstack/claude-code/skills/poteto-help/references/recipes.md` | `skills/dev/dev-help/references/recipes.md` | 帮助目录与示例同步真实负责者、四类需求入口、双分支和验证工具边界 |
| `pstack/claude-code/skills/poteto-mode/SKILL.md` | `skills/dev/dev-workflow/references/operating-method.md` | 按真实缺口调用且返回当前负责人，契约与决定单处维护，保留guardrails适用条件并复用有效证据 |
| `pstack/claude-code/skills/poteto-mode/playbooks/authoring-a-skill.md` | `skills/dev/dev-personalize/references/authoring-a-skill.md` | 显露通用技能编写分支，按任务验证触发与完整方法，不先要求偏好历史 |
| `pstack/claude-code/skills/poteto-mode/playbooks/feature.md` | `skills/dev/dev-build/references/feature-delivery.md` | 将迁移后含糊的本包指代改为真实负责技能，携带契约和证据后返回当前实施 |
| `pstack/claude-code/skills/poteto-mode/playbooks/refactoring.md` | `skills/dev/dev-build/references/behavior-preserving-refactor.md` | 将迁移后含糊的本包指代改为真实负责技能，携带契约和证据后返回当前实施 |
| `pstack/claude-code/skills/poteto-mode/references/bugbot-triage.md` | `skills/dev/dev-review/references/review-triage.md` | 无spec文件仍审明确用户要求；沿用有效证据，并纠正PR意见分诊的调用归属 |
| `pstack/claude-code/skills/sharpen/SKILL.md` | `skills/dev/dev-sharpen/references/deepen-task.md` | 明确只改写请求的产出边界，保留四方面深化方法 |
| `pstack/claude-code/skills/show-me-your-work/SKILL.md` | `skills/dev/dev-workflow/references/decision-trail.md` | 按真实缺口调用且返回当前负责人，契约与决定单处维护，保留guardrails适用条件并复用有效证据 |
| `pstack/claude-code/skills/statechart/SKILL.md` | `skills/dev/dev-statechart/SKILL.md`、`skills/dev/dev-statechart/references/statechart-method.md` | 只处理TLA+/TLC；区分INVARIANT与PROPERTY、有限最短图路径与带循环的时序反例 |
| `pstack/claude-code/skills/statechart/references/render.md` | `skills/dev/dev-statechart/references/render.md` | 只处理TLA+/TLC；区分INVARIANT与PROPERTY、有限最短图路径与带循环的时序反例 |
| `speculo/template/workflows/specdev/specdev-p-prototype/SKILL.md` | `skills/dev/dev-prototype/SKILL.md`、`skills/dev/dev-prototype/references/change-prototype.md` | 原型入口按缺口区分需求材料整理与产品取舍访谈，沿用当前决定及记录后返回原型任务 |

## 实施简报迁移

完整实施简报由 `dev-intake` 移至 `dev-spec`，原模板与四类示例保留。`mattpocock-skills` 子清单更新同一来源行的 `runtime_paths`；来源身份、原件及中文对照不变。

历史迁移夹具用于验证当前被移除路径及存续目标。旧夹具曾断言 spec 中同名文件已移除；该位置现在恢复为唯一负责者，因此移除失效断言，改为断言 intake 旧位置已移除、spec 目标存在。本变更只调整这一对路径，不重写此前 change 中的历史事实。

## 额外职责校准

`dev-setup` 的形式化说明聚焦真实工具、配置与入口。完整属性验证、模型与代码映射、故障注入及反例方法继续由 `dev-formal-verify` 维护，不另建证明流程。`dev-writing` 明确包内链接不可越界，同时保留按技能名称调用专门方法的合法协作。

## 核对方法

使用现有来源映射定位受影响正文，比较源基线与当前差异，核对原方法的模板、示例、工具输入与适用条件。入口和路由的自然请求结果、资源检查与限制见 [验证记录](verification.md)。
