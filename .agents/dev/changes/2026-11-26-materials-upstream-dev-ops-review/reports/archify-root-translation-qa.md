# Archify 非 Code Analysis 文档中文同步独立复核

## 结论

本次审阅 root 负责的 18 份 Markdown，共 700 个分块：506 个旧译复用、180 个新增译块，其余为代码或技术原样块。180 个新增译块已逐项与英文完整对照。未发现缺译块、复用索引错配、关键数值遗漏或代码变更。发现一处 Timeline 时间来源措辞歧义，已报告，且已回读确认 root 修正。

## 核验范围与方法

- 来源：固定 Archify `d6b0f71f25a3337ed2fcd09c973cacf67be7baba`，并与实际 `materials/archify/upstream/` 的最新字节对照。翻译计划的 18 份来源分块与实际原文完整一致。
- 复用：逐块用 Git HEAD 的旧英文与旧中文重建对应关系，506 个 reused block 均在同一源文件的原文相同块对应旧中文索引上找到；表格行数和标题级别保持。未重新翻译未变旧段，检查结果不替代旧译文的全量语义审计。
- 代码：使用尊重围栏长度的扫描器提取 54 个完整代码块，最新中英文围栏内容逐字一致；没有执行来源命令或程序。
- 新译：全文对照 A001–A180，包括 PR 依赖与附件限制、Story 编排/时间/来源约束、原子发布失败状态、语言目录、自动布局、输出恢复、代码分析、CSV 验证、源码阅读边界、ERD/Workflow 数值与限制。
- 自动标记：7 个 inline-code 表面差异均经人工辨识，来自代码跨度内软换行、多反引号/转义、为 ENOTEMPTY 添加反引号，以及自然语言示例翻译；未发现技术标识符变化。数字检查的标记来自四/三等中文数词或后缀触发的部分数字匹配；相关版本、阈值、时间、尺寸均保留。

## 已修正项目

`references/repository-authoring.md` / A155：原文 `Say either in a card.` 指在卡片说明采用的时间来源。初译“两者都应在卡片中说明”会让读者以为两个替代来源都要提供；现已改为“在卡片中说明采用了哪一种时间来源”。当前正式译文回读确认：已修正。

## 文件统计

| 路径 | 分块 | 旧译复用 | 新译块 | 完整代码围栏 |
| --- | ---: | ---: | ---: | ---: |
| references/pr-review.md | 26 | 0 | 23 | 3 |
| references/story-authoring.md | 22 | 0 | 18 | 4 |
| renderers/shared/atomic-output.md | 36 | 0 | 35 | 1 |
| story/vendor/README.md | 6 | 0 | 4 | 2 |
| SKILL.md | 56 | 40 | 16 | 2 |
| locales/README.md | 10 | 8 | 2 | 0 |
| references/architecture-layout-repair.md | 9 | 7 | 2 | 0 |
| references/authoring-contract.md | 116 | 106 | 9 | 6 |
| references/authoring-defaults.md | 30 | 22 | 8 | 0 |
| references/delivery-contract.md | 126 | 110 | 15 | 9 |
| references/explainer-authoring.md | 74 | 55 | 18 | 11 |
| references/repository-authoring.md | 24 | 15 | 9 | 0 |
| references/update-awareness.md | 9 | 7 | 2 | 0 |
| references/viewer-runtime.md | 19 | 18 | 1 | 0 |
| renderers/erd/README.md | 37 | 31 | 6 | 3 |
| renderers/lifecycle/README.md | 20 | 19 | 1 | 2 |
| renderers/tree/README.md | 22 | 18 | 4 | 2 |
| renderers/workflow/README.md | 58 | 50 | 7 | 9 |

详细机器扫描与人工处置保存在 `archify-root-translation-qa-findings.json`。本次 QA 没有修改 root 负责的材料或运行技能。品牌标志与 schema 两份另行 hunk 文档、法律文件和本次新增 code-analysis 文档不属于此 18 份复核范围。
