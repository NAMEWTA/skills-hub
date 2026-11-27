# 综合 Issue 的 ops 独立审查

审查对象：`research/comprehensive-issue-draft.md`。本次只读审查 Issue、既有 ops 方法和清单导航；未修改 Issue 草稿或运行文件，未运行额外测试、上游脚本或生产操作。

## 结论

ops 方案的领域边界与实施方向通过。现稿不重复建立 `ops-recall`、`ops-correct`、`ops-reflect`，不引入 dev 安装依赖、跨域事实数据库或 ops JSONL 读取器，也没有将上游材料更新解释为发布、部署定义或 schema 迁移授权。history、execute、runbook 的既有职责被正确保留。

发布前建议补一条具体验收，并澄清一句范围表达；没有发现需要重写 ops 方案的阻断项。

## 建议 1：将错误经验的反向失效写成可观察验收

现稿第 7 节已要求记录“被什么新证据纠正、影响哪些现行方法、替代入口、复验结论”，并在验收矩阵中要求修订受影响手册。这一方向正确，但目前验收结果还可被“只加警告、不改操作”形式满足，建议明确一个贯穿示例：

> 原始 run `R` 形成经验 `L`，`L` 已被手册 `M1`、`M2` 的具体步骤引用；新证据 `C` 推翻该经验。验收必须看到：`R` 保留原样并追加更正引用；`L` 关联 `C` 与失效条件；通过现行引用枚举 `M1`、`M2` 的受影响方法并标记需重验；替换相反步骤或提供退役原因和替代入口；在现有适用验证方法下记录复验结论。缺少访问、环境或执行前提的方法明确为 blocked/未验证。只在顶部加警告而保留相反操作不能通过。

这无需新增知识数据库或全局索引。落点沿用现稿：

- `skills/ops/ops-runbook/assets/lessons.md`：经验来源、反证、采用位置与更正结果。
- `skills/ops/ops-runbook/references/knowledge-lifecycle.md`：从被推翻经验追踪现行方法、更新与退役。
- `skills/ops/ops-runbook/references/maintenance.md`：逐方法复验、changed/blocked 与保留有效部分。
- `docs/operations/validation.md`：上述情景验收。

既有 `knowledge-lifecycle.md` 已明确“不只在顶部警告却保留相反动作”；本建议把既有合同变成 Issue 的明确完成条件，不另造机制。反例和合法场景可采用既有证据或所选回放方法，不把独立批量回放判据强加到每次维护。

## 建议 2：澄清 ops 自有交付仍沿用现有授权

第 7 节“ops 不自动改代码、开 PR 或迁移发布体系”结合前句可理解为禁止越界，但脱离上下文可能被误读为禁止 ops 自有方法交付。既有 `knowledge-lifecycle.md` 允许按本次授权提交或 PR，`maintenance.md` 允许在范围内修复辅助缺口。

可改为：

> 应用代码、发布定义、数据/schema 变更仍交项目流程；ops 不因回忆或复盘扩大这些范围。ops 自有文档、项目运维技能源和授权内辅助工具，继续按现有交付合同维护，不新增固定审批链。

## 已通过的检查

| 项目 | 结果与依据 |
| --- | --- |
| 唯一职责 | 只增强 `ops-history`、`ops-runbook`、`ops-workflow`；execute 继续负责原步骤追加更正与单一 writer。 |
| 事实优先 | 聊天仅辅助定位和解释；原始 run/step、当前后端状态优先；“聊天称恢复但后端 unknown”验收已覆盖。 |
| 单独可用 | 不安装或依赖 dev；不复制 dev 读取器；缺证据时明确能力缺口。 |
| 发布边界 | 应用、部署定义、制品切换、数据/schema 迁移交项目；不把材料更新变成生产操作授权。 |
| 成熟度 | 不把重复转述算独立事故，不把一次缓解当根因，不把固定次数自动升格为可用方法。 |
| 回放 | 保留现有独立回放；70% 正确加部分正确、零有害及连续 10 次旁路观察仅适用于明确选定的方法评估。 |
| oncall/Sentry 状态 | “选定树没有新内容”正确：oncall 三个单元 11 文件，Sentry 5 文件；16 文件的 path/mode/blob 未变。 |
| Modern Web 来源 | dialog 与 context-menu 链接固定到 `2b4aa13a72dd47cd135b06ce5abfccd92e19b24f`，路径准确；三项 JS 问题按静态发现、待隔离验证表达，没有声称运行复现。 |
| Dashboard 来源 | inspiration 链接固定到 `57f96688862668b482f647fa1e370efb5d3ddd31`；43 仪表盘、说明分母 45、表格分母 43 均能在原件找到。 |

oncall 固定来源：

- [triage](https://github.com/anthropics/oncall-kit/tree/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1/skills/triage)
- [templates](https://github.com/anthropics/oncall-kit/tree/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1/templates)
- [eval](https://github.com/anthropics/oncall-kit/tree/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1/eval)
- [Sentry](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/sentry)

## 四处 ops 子清单导航

以下四行 adaptation 已从旧 `docs/ops-method-ownership.md` 改为 `docs/operations/method-ownership.md`；目标文件实际存在。本轮未改变这些行的 `source_git_blob`、`runtime_reviewed_blob`、原件或中文哈希。

| 子清单 | 来源行 path |
| --- | --- |
| `materials/oncall-triage/manifest.tsv` | `SKILL.md` |
| `materials/oncall-templates/manifest.tsv` | `lessons.md` |
| `materials/oncall-replay/manifest.tsv` | `replay.md` |
| `materials/openai-sentry/manifest.tsv` | `SKILL.md` |

## 来源数量与 README

使用共享 `parseTsvTable` 读取父清单：当前为 **15 个来源单元、13 个不同 repository 字符串**。`materials/README.md` 的来源表也有 15 行，包含 `nanobot-memory`；14 个来源单元的说法不准确。当前 `README.md` 和 `materials/README.md` 正文没有发现“14 个”或“十四个”的计数陈述，因此无需为了纠正不存在的文字而改动它们。对外总结应采用 15 单元，且区分仓库与来源单元。

## 发布时的链接收尾

Issue 目前用相对路径引用 `.agents/dev/changes/.../reports/`。这些链接适合仓库内文档，但 GitHub Issue 发布前应由 root 换为实际材料同步提交或 PR 文件的可访问固定 URL，避免读者在 Issue 路径下得到无效相对跳转。此项不需要修改方法内容，也不要求提前合并 Draft PR。

## dev 主线交叉检查

目前主线已涵盖唯一 recall owner、显式会话身份优先于 mtime、有限授权范围、坏尾/未知记录/压缩与子会话覆盖、只读读取、真实工具结果与计划分离、纠正事件去重、反思不自动收尾，以及单独安装闭包。没有发现 ops 方案强迫 dev 宿主或引入跨域方法复制的遗漏。现稿对其他宿主不承诺沿用 Claude schema，边界适当。
