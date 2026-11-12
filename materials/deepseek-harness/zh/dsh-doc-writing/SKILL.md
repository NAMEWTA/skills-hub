---
name: dsh-doc-writing
description: 创建、重组、审查、审计或迁移 DeepSeek Harness Markdown 文档、包 README 及文档网站，采用受众优先层级、kind 映射 YAML 元数据、双语行对齐、概要／目录导航、从用户到开发者的渐进细节、实际执行操作的事实核验及仓库验证。用于新增或修改 DSH 文档、文档树组织、文档质量审计及预算、网站页面发布和双语文档结构变更。
---

# DeepSeek Harness 文档

## 概要

DeepSeek Harness 文档标准：每页可搜索、新人可读、足够精确以供 agent 及维护者使用，文档网站保持为仓库 Markdown 的已测试投影。先应用仓库 `AGENTS.md` 及实际执行的门禁，再用本流程处理 kind 映射元数据、渐进细节、行对齐双语页、语料审计及网站发布。每个事实保留一个负责者：源码、测试、生成目录、包 README、指南、Agent Notes 及临时材料各自拥有不同种类的真实信息。`session-persistence-jsonl` README 双语对是格式参考示例。

## 目录

- [流程](#流程)
- [事实核验：测试而非假设](#事实核验测试而非假设)
- [kind 系统及模板](#kind-系统及模板)
- [表达规则](#表达规则)
- [质量标准](#质量标准)
- [语料审计](#语料审计)
- [字数预算](#字数预算)
- [网站发布](#网站发布)
- [详细参考](#详细参考)
- [验证](#验证)
- [开发笔记](#开发笔记)

## 流程

每个请求范围按此顺序。常见读者路径保持简短，但不为减字删除失败、责任归属、限制或其他必需约定。

1. 阅读根及更具体的 `AGENTS.md`、[文档标准](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md)、目标页、其源码／测试、导航负责者及双语记录。
2. 按一个主要任务及读者分类页面：产品快速入门、用户任务指南、贡献者教程、架构概览、包／子系统参考、生成参考、agent 指令、决策记录或临时材料。
3. 放在最近的负责位置。包约定紧邻包代码；跨包学习、用户、开发者、架构、讨论及有期限临时材料放 `docs/`。
4. 写细节前定义读者起点、可观察结果、可能失败、恢复路径及下一层有用深度。
5. 新增或修改 YAML 元数据——指定映射到文档任务模板的 `kind`——然后在类型允许时依次写 `Summary`、`Table of Contents`、用户内容、开发者内容、可选 `Further Exploration` 及最后的 `Dev Note`。
6. 同轮更新双语对应页。标题、列表、表格、代码、链接、frontmatter 布局及物理行数对齐。
7. 对照代码、测试、生成器、包元数据或当前决定负责者验证每项主张，并按下述事实核验流程执行页面要求的操作。先更新负责者，再更新派生产物。
8. 先运行聚焦检查，再运行 `pnpm run test:docs`、`pnpm run doc-sync`、`pnpm run lint` 及 `git diff --check`；先为正确性重读完整差异，再为简洁及仓库适配重读。

## 事实核验：测试而非假设

文档描述产品今天如何行为，操作主张唯一可接受证据是实际运行过。每篇新文档及每个声称操作、命令、默认值、错误或平台差异的新段落，都必须执行此流程。

1. **写安装指导前分类对象。** 读事实，不靠目录名：`package.json` 的 `dsh.bundle.patch` 声明，以及入口文件的插件形态（`apply` 导出或默认服务导出是插件；普通模块 API 是库）。bundle 用 `dsh plugin --profile <name> add <package>` 安装，也是唯一通过此命令激活配置档层的包形态；插件作为 `cordis.yml` 一行挂载；库是没有独立安装路径的依赖。特殊地位的包（库、bundle）使用各自 README 模板——不能在插件 README 中写不适用安装指导。
2. **在当前检出运行每项声称操作。** 完全按文档展示执行每个 CLI 命令、配置片段及配置档或补丁示例；只写观察结果，包括准确输出、警告及失败方式。主张依赖没有的密钥或网络时，说明并指出验证负责者，而非断言行为。
3. **删除无法复现的内容。** 绝不凭记忆、类比或邻包 README 搬用命令、字段、默认值或行为。无法复现时，修主张，不修测试。
4. **对照最新 master 检查旧文档。** 修改已有页前运行 `git fetch origin`，将章节与 `origin/master` 比较；配对文件可恢复任一侧最后确认文字。master 上过时陈述仍然错误：按代码纠正，不按旧文字。
5. **每次编辑后重新记录配对。** 每次双语编辑重新运行 `pnpm run verify-translation-pairing --write <pair>`，使配套文件追踪确认的双语对。

## kind 系统及模板

frontmatter 的 `kind` 恰好选择一个 README 模板。[元数据参考](references/metadata-links-i18n.md#kind-系统)每个 kind 映射到 [`templates/`](templates/) 中一份模板，且每份模板只支持一个 kind；文档检查按相同机械事实推导预期 kind。

- `package-group` → [templates/package-group.md](templates/package-group.md)：分组地图（`packages/README.md`、`packages/<group>/README.md`），介绍家族、映射直接包含的包、链接包负责的细节。
- `package-reference` → [templates/package-reference.md](templates/package-reference.md)：Cordis 插件或服务包；挂载配置、配置表、折叠实现，以及按门禁规定形式的 Model Experience 与 Known Limitations。
- `package-library` → [templates/package-library.md](templates/package-library.md)：没有插件表面的包；消费者入口，无配置档安装路径或挂载配置。
- `package-bundle` → [templates/package-bundle.md](templates/package-bundle.md)：声明 `dsh.bundle.patch` 的包；已验证 `dsh plugin` 安装路径、层语义及补丁文档。
- `persistence-change` → [templates/persistence-change.md](templates/persistence-change.md)：`docs/persistence-changes/` 中带日期记录，以逐根前驱及生成的变化后模式确认检测到的类型转换。
- `persistence-release` → [templates/persistence-release.md](templates/persistence-release.md)：`docs/persistence-changes/releases/` 中固定标签；比较重建历史类型，不声称兼容性确认。
- `persistence-format` → [templates/persistence-format.md](templates/persistence-format.md)：`docs/persistence-changes/historical-formats/` 中历史 Session 格式检查点，含完整模式；当前写入器使用已有目录。
- `upgrade-guide` → [templates/upgrade-guide.md](templates/upgrade-guide.md)：`docs/upgrade-guide/v<version>/<item>/guide.md` 及中文对应文件，一项外部可感知破坏的迁移步骤，由 [dsh-create-upgrade-guide](../dsh-create-upgrade-guide/SKILL.md)负责。

写作前打开模板，遵循骨架及规则；其中说明 kind 是什么、页面如何组织、各节应做哪些事实核验。新增 kind 必须同时有独立模板文件、已记录仓库位置或声明负责者，以及将文档映射到它的聚焦检查。

## 表达规则

以下规则决定章节可以说什么。适用于所有人工编写、面向人的页面，对包 README 尤其严格。

- **Summary 说对象能做什么。** 开头 `Summary` 及用户章节描述用户或 agent 能用它做什么——结果、益处、选择时机、主要成本——绝不是角色、类型或内部身份。包 Summary 的“是什么”仅指读者可见能力，不是 Cordis 角色、注册或内部组件。读者未直接在配置、命令或公开 API 中使用的源码标识符应省略。“接缝注册 `ctx.x` 并追加 `x/event` 记录”是身份叙述；“你能为每条消息保存笔记，重启后仍在”才是能做什么。
- **开发者章节解释，不枚举。** 折叠实现涵盖整体设计概念、架构及粗略数据流，足够理解包如何工作，精确细节链接代码。折叠区内没有完整 API 目录、穷尽列清单、事件载荷枚举或 JSDoc 重述。
- **Dev Note 是唯一杂乱区。** 未完成想法、草稿、未定方向、测量产物及工作假设只放最后 Dev Note，明确标非权威。其他所有章节都是打磨过的当前状态文字。
- **只写当前状态。** 普通文档描述当前代码库。专用 `persistence-change`、`persistence-release` 和 `persistence-format` 记录保留历史类型证据；发布比较及格式检查点描述观察历史，不断言兼容性。`upgrade-guide` 描述从所在版本目录发布到下一版的变化。Agent Notes 及事后复盘保留各自历史范围。
- **使用受控技术英语。** 当歧义可能改变行为时，每句给明确行动者及一个主要动作。每概念复用一个术语，偏好直接动词，拆分堆叠指令及条件，保留情态及例外。采用[页面风格参考](references/style.md#受控技术英语)中受 ASD-STE100 启发但未经认证的纪律。若会降低精确性，不强迫短句。

## 质量标准

审查采用以下定义。各节先以简短定位段落开头，再进入子节或穷尽细节。

- **简短：** 常见路径只包含达成结果所需事实；完整真实信息隔一个直接链接或细节层可达。
- **直观：** 前提先于依赖概念，一个下一步动作清楚，标题使用读者搜索术语。
- **友好：** 读者能识别成功、行动前理解风险、从可能失败恢复，并选择是否深入。
- **准确：** 每个长期主张有一个负责者及与风险相称的验证路径。
- **Agent 可读：** 元数据、稳定标题、锚点、术语、责任归属及当前／提议状态支持定向检索，无需加载全部语料。
- **新人完整：** 无仓库背景的专业工程师能通过三至五个链接页重建相关架构或功能。

穷尽参考不设统一字数上限。衡量入口路径长度、一次查找要扫的无关内容、最大章节、标题数及页面大小；检索成本高时按已有领域负责者拆分。

## 语料审计

阅读而非重写摘要：层级、教程／参考形式、分类、预算及杂乱清单由 [docs/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md)负责；Agent Note 生命周期由 [.agents/notes/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/README.md)负责；双语配对规则由 [docs/i18n/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/README.md)负责；常设指令见[根 AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/AGENTS.md)。审计与编辑排除 `.agents/notes/archived/`，归档笔记是冻结历史。

对范围内每份面向人的文档（不是 Agent Notes）应用标准写作顺序：定位文档，说明自己的主题；设允许细节层级，将更深解释移到负责的下级页面并链接；按预期用途而非路径分类教程或参考；教程按前提及难度排序概念；拆分实质混合形式。再查位置约束：双语文档每次编辑都需更新对应页及 `--write` 重新记录；生成目录绝不手改；移动必须与所有入链修复在同次变更原子完成。

结构检查后，先用最便宜探测寻找杂乱清单问题。用 [dsh-trim-cot-leakage](../dsh-trim-cot-leakage/SKILL.md)处理推理记录泄漏，grep 特征措辞找重复规则，用权威负责者替代手写目录及状态清单，从已实施 Agent Notes 删除迁移计划及未来时规格语言。用 `pnpm run verify-doc-budgets --list` 及词数扫描衡量异常；删文字若改变承诺行为而非解释，先提出行为变更（遵循 [dsh-find-simplifications](../dsh-find-simplifications/SKILL.md)）。保留每条承重规则，最好一至三行加理由链接；不为搬迁可丢弃推理而新写解释。

## 字数预算

`pnpm run verify-doc-budgets` 将常设文档与 [scripts/doc-budgets.manifest.json](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/scripts/doc-budgets.manifest.json) 上限比较；红门禁按 [docs/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md#wordcount-budgets)中搬迁、压缩、提高上限的顺序处理。上限是护栏，不是缩减目标：在目标以内时保留至少 5% 余量；仅当文字确实需要空间才提高上限，并在 PR 说明清单差异理由。

## 网站发布

网站是经过测试的投影，不是第二份副本：[website/docs.ts](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/website/docs.ts) 是显式公开允许清单，将规范 `docs/` 来源映射到路由树；[scripts/project-doc-site.ts](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/scripts/project-doc-site.ts) 重写到可丢弃 `website/.generated/` 树，VitePress 构建该树。仓库 Markdown 始终是唯一可编辑内容来源；译文保持同目录双语组（`foo.md`、`foo.zh.md`、`foo.i18n.yaml`），不用语言目录。已发布页只改规范来源；新页加一条清单；移动或删除原子更新来源、清单条目及入链；绝不编辑 `website/.generated/`、`website/.cache/` 或 `website/.dist/`。有意设置每个 `DocsPage` 字段并遵守投影器链接规则；字段、侧栏集合及预览命令见 [references/website-sync.md](references/website-sync.md)。同步内容进入构建不等于发布：部署仍是单独、需明确请求的步骤。

## 详细参考

只加载任务需要的参考。每份参考均从本文件直接链接，没有深层参考链。

- [元数据、链接及双语对](references/metadata-links-i18n.md)：README frontmatter、kind 系统及推导、描述语义、仓库路径、行对齐及配套记录。
- [页面结构及层级](references/structure-hierarchy.md)：必需章节顺序、章节概要、用户到开发者渐进、文档树位置、小规则文件、Further Exploration 及 Dev Note 责任归属。
- [页面风格](references/style.md)：简短 Summary、`-----` 分节符、可折叠内容节及强调纪律。
- [审查标准](references/review.md)：新人测试、证据检查、包 README 审查、参考示例及验证命令。
- [网站发布](references/website-sync.md)：清单字段、投影器链接规则、预览及验证、部署分离。

[`templates/`](templates/) 每个 `kind` 提供一个可用骨架；写作前打开文档 kind 指定的模板。

句子级约定覆盖及编辑判断使用 [dsh-prose-standard](../dsh-prose-standard/SKILL.md)。`session-persistence-jsonl` README 双语对（[英文](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/session/session-persistence-jsonl/README.md)、[中文](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/session/session-persistence-jsonl/README.zh.md)）是参考示例：可搜索 YAML、Summary 及目录、从用户到开发者渐进并折叠开发者章节、Further Exploration、规范 Model Experience 与 Known Limitations 节，以及最后 Dev Note。

## 验证

验证受影响格式，不只是 Markdown 语法。强承诺需要聚焦的有效夹具，以及证明顶层门禁能失败的无效夹具。

- README 元数据：解析 YAML，将 `kind` 映射到模板及文档标准；拒绝 `name`、`audience`、无治理 `tags` 及 README 内 `i18n` 元数据；拒绝缺失或广告式描述。
- 双语页：验证结构、准确行数、术语、链接对应及配套记录。
- 教程：实际执行文档入口路径，或明确指出手工验证负责者。
- 生成参考：运行确定性新鲜度检查，报告检索大小指标。
- 包 README：运行 Summary 门禁，将每份英文 Summary 限制为按 `wc -w` 风格计数的 100 词，失败引回本技能及 kind 模板；运行模型体验及限制检查，行为主张变化时再运行包聚焦测试；合并 README 命令主张前，重新运行它要求的每条命令。
- 技能：运行仓库技能调用元数据检查。

完整 `pnpm run doc-sync` 前，运行 `pnpm run test:docs` 快速全面文档检查（配对、换行、链接、README 门禁、预算、技能元数据、Agent Note 门禁）。

## 开发笔记

无。
