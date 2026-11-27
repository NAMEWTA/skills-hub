# 第三方来源与许可

本文集中说明 skills-hub 采用的第三方内容、中文翻译与本地适配，以及对应许可。项目原创内容采用 [MIT](LICENSE)；被收录内容继续适用原作者的版权和许可。感谢下列项目的作者与贡献者。

[licenses/](licenses/) 保存适用许可、NOTICE 和归属声明的原文，随源码仓库和 npm 包分发。所选上游树自带的法律文件也保留在原路径，维持文件对应关系；本文不替代这些法律原文。安装器只复制所选技能及其包内资源，不另建项目级许可目录。单独再次分发技能或材料时，应一并提供适用的许可和归属信息。

## 已收录来源

来源仓库、跟踪分支和固定提交以[材料父清单](materials/manifest.tsv)为准；下表的项目清单记录逐文件原件、中文对照和实际采用路径。存在中文对照不代表该文件已经进入运行技能。

| 来源与权利人 | 收录范围与主要用途 | 许可原文与映射 |
| --- | --- | --- |
| [cursor/plugins — pstack](https://github.com/cursor/plugins/tree/main/harness/pstack)，Lauren Tan | `harness/pstack`；开发方法、会话接续和安全暂停。既有 issue 自动化适配仍保留较早版本方法。 | [MIT](licenses/pstack-MIT.txt)；[清单](materials/pstack/manifest.tsv) |
| [mattpocock/skills](https://github.com/mattpocock/skills)，Matt Pocock | `skills`；需求、架构、实施、诊断、审查、写作、原型和开发交接方法。 | [MIT](licenses/mattpocock-skills-MIT.txt)；[清单](materials/mattpocock-skills/manifest.tsv) |
| [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)，DeepSeek | `.agents/skills`；知识、归档、写作与笔记实例。未收录 Host、vendor 或仓库根声明中的 npm/Python 依赖实现。 | [MIT](licenses/deepseek-harness-MIT.txt)；[清单](materials/deepseek-harness/manifest.tsv) |
| [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills)，Elaya | `skills`；设计方法与资料。设计材料内嵌的 Leon / leonxlnx 授权另行保留。 | [MIT](licenses/ai-design-skills-MIT.txt)、[taste-skill MIT](licenses/taste-skill-MIT.txt)；[清单](materials/ai-design-skills/manifest.tsv) |
| [NAMEWTA/Speculo](https://github.com/NAMEWTA/Speculo)，wta 及其列出的第三方作者 | 整仓被动快照、中文对照及按需采用的方法；嵌套内容适用下方单独列出的许可。 | [MIT](licenses/Speculo-MIT.txt)、[上游完整声明](licenses/Speculo-THIRD-PARTY-NOTICES.txt)；[清单](materials/speculo/manifest.tsv) |
| [herdrdev/herdr](https://github.com/herdrdev/herdr)，Herdr 贡献者 | `skills/herdr`；`system-herdr` 的终端控制方法。未收录 Herdr 程序或 vendor 树。 | [Apache 2.0](licenses/herdr-Apache-2.0.txt)；[清单](materials/herdr/manifest.tsv) |
| [herdrdev/herdr-core](https://github.com/herdrdev/herdr-core)，Herdr Core 贡献者 | `skills/herdr-core`；`system-herdr-core` 的中文入口与手册读取方式。 | [Apache 2.0](licenses/herdr-Apache-2.0.txt)；[清单](materials/herdr-core/manifest.tsv) |
| [anthropics/oncall-kit](https://github.com/anthropics/oncall-kit)，Anthropic 及贡献者 | `skills/triage`、`templates`、`eval`；分别用于事故调查、经验手册和回放评估方法。 | [Apache 2.0](licenses/oncall-kit/LICENSE)；[调查](materials/oncall-triage/manifest.tsv)、[模板](materials/oncall-templates/manifest.tsv)、[回放](materials/oncall-replay/manifest.tsv)清单 |
| [openai/skills — Sentry](https://github.com/openai/skills/tree/main/skills/.curated/sentry)，OpenAI 及贡献者 | `skills/.curated/sentry`；只读错误观测、范围核对与脱敏方法用于 `ops-inspect`。 | [Apache 2.0](licenses/openai-sentry-Apache-2.0.txt)；[清单](materials/openai-sentry/manifest.tsv) |
| [HumanLayer](https://github.com/humanlayer/humanlayer) / [Dex Horthy](https://github.com/dexhorthy)，QueryTale, Inc. d/b/a HumanLayer | 既有 PR 视觉说明中的 show-me 方法；已作中文翻译和流程适配。NOTICE 中列出的其他程序组件未因此一并收录。 | [Apache 2.0](licenses/humanlayer-Apache-2.0.txt)、[NOTICE](licenses/humanlayer-NOTICE.txt) |
| [abdiraimov-otabek/dashboard-design-skill](https://github.com/abdiraimov-otabek/dashboard-design-skill)，Otabek Abdiraimov | `skills/dashboard-design/` 共 14 份 Markdown，附完整中文对照，独立运行包 `zh-dashboard-design` 采用同一提交。收录范围为该技能目录。 | [MIT](licenses/dashboard-design-skill-MIT.txt)、[清单](materials/dashboard-design-skill/manifest.tsv) |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot)，Xubin Ren 与 nanobot 贡献者 | `nanobot/skills/memory` 的完整短技能及中文底稿；采用按需读取、来源边界、已确认长期知识、读后更新、修复引用和历史检索方法。 | [MIT](licenses/nanobot-MIT.txt)；[清单](materials/nanobot-memory/manifest.tsv) |

### 整合内容的修改范围

自有领域的运行内容在完整方法基础上作中文翻译，并调整技能名称、项目路径、宿主能力与职责归属。来源语境保存在 `materials/`，本地差异记录在子清单的 `adaptation` 字段。

- `dev-program` 的批次推进方法参考 Speculo 的目标计划与接续，跨 Change 交付点和 Goal 文本按本项目记录方式组织。pstack 的持续项目协调由 `dev-parallel` 承接，独立与堆叠 PR 队列由 `dev-deploy` 承接。
- `dev-plan` 采用 Matt Pocock 的 [to-tickets](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/to-tickets/SKILL.md) 垂直切片和显式阻塞方法，以及 Speculo 的 [实施切片与 Tickets](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-t-tickets/SKILL.md) 中的原型引用、覆盖检查、独立接手与进展记录约定。本项目的实施规划先保存本地票据，再汇总 DAG，外部事项可按授权链接到共享版本。
- Dev 的三项持久化入口采用 Matt Pocock 的 [本地 Markdown 跟踪约定](https://github.com/mattpocock/skills/blob/6f7f7831a625f040a8e06a0e7954826b87ce775a/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md)、[grill-with-docs](https://github.com/mattpocock/skills/blob/6f7f7831a625f040a8e06a0e7954826b87ce775a/skills/engineering/grill-with-docs/SKILL.md) 与 pstack 的 [追加决策轨迹](https://github.com/cursor/plugins/blob/b7b93c36be9bcc36a74db438e0fd385d660bc559/harness/pstack/claude-code/skills/show-me-your-work/SKILL.md) 和 [多阶段规划](https://github.com/cursor/plugins/blob/b7b93c36be9bcc36a74db438e0fd385d660bc559/harness/pstack/claude-code/skills/poteto-mode/playbooks/multi-phase-plan.md)。项目沿用 Change 目录，独立访谈追加 `decisions.md`，正式规格保存 `spec.md`，正式规划保存 `plan.md` 及配对票据与报告。
- `dev-build` 保留 Matt Pocock 的任务图实施方法，工作树创建、组合验证与集成转由 `dev-worktree` 承接。pstack 的工作树与额外磁盘清理方法及只读审计工具归 `dev-worktree`。本项目采用独立集成树生成双亲提交，并按 Git 的索引状态处理冲突。
- 工作树和冲突处理的行为参考包括 [Git 工作树](https://git-scm.com/docs/git-worktree)、[Git 合并](https://git-scm.com/docs/git-merge)、[GitHub 合并方式](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)、[Codex](https://learn.chatgpt.com/docs/environments/git-worktrees)、[Claude Code](https://code.claude.com/docs/en/worktrees)、[Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/git-worktrees.md)、[Antigravity](https://antigravity.google/docs/projects)与 [Cursor](https://cursor.com/docs/configuration/worktrees)。宿主资料用来核对其路径、基线与保留边界，仓库内检出及交付约定由本项目定义。
- `dev-handoff` 采用 Matt handoff 及 pstack session-pickup、pause-safely 方法，把临时交接改为项目持久资料，并适配技能调用、既有授权和恢复核对。
- `dev-prototype` 采用 Speculo 的原型证据方法、采购申请引用示例，以及 Matt/pstack 的完整探索方法。采购示例只分发必要 HTML/CSS/JS，不包含来源画廊的照片、品牌字体或图标库。
- `system-herdr` 保留完整 CLI 方法；客户端启动示例与按 pane 的 task/report 文件通信属于本地扩展。
- `system-herdr-core` 的运行版采用用户明确选用的触发条件，并增加客户端启动示例及按 Core 终端地址派发 task/report 的方法。许可原文与现有 Herdr Apache 2.0 文件字节相同。
- ops 将调查、经验和只读观测方法适配到本领域的 registry、run、项目资料与实际工具能力。领域之间不因此产生自动安装依赖。
- home 采用 Matt 的直接负责人、上下文指针、按主题组织知识和交接资料方法，将来源中常驻会话、固定回顾频率和整套开发链改为用户按需选择的项目协作；现行知识、历史和用户配置分别由所属技能维护。nanobot 的记忆方法适配为 `.agents/home/` 下的 Markdown，保留项目当地知识归属，不接入其全局工作区、私有 history.jsonl、游标或 Dream 运行时。具体来源和研究取舍见 [Home 来源](docs/home/sources.md)。
- Home 入口与可选合作风格的组织参考 Agent Skills、OpenAI、Claude、Gemini、Grok、GitHub 的官方发现机制，以及 Orca 的生成/用户文件生命周期和 OpenClaw 的工作区职责划分。此轮新增模板、迁移逻辑和诊断由本项目实现，没有复制这些产品的源码或网页正文，也未新增第三方代码来源单元。研究版本和采用边界见 [Home 入口研究](docs/home/sources.md#入口与宿主研究)。
- issue 初始化、分诊和复现修复保留 pstack 较早 [Benny 自动化资料](https://github.com/cursor/plugins/tree/6b0300214a09fd6029cfb7077043125758cd1fd2/pstack/automations/benny)的方法；通用来源接口和项目配置属于本地适配，原 Slack 分支保留其身份核对与回读要求。

## 独立中文上游技能

以下目录对应所选版本的原技能文件，保留完整结构和内容。自然语言文档由 skills-hub 翻译为中文；运行包使用 `zh-` 名称，并调整必要的自身调用、交叉技能名称和本地链接。代码示例、工具程序、协议字段及法律原文按原件保留。译文的英文标题锚点用于兼容原有片段链接。

| 中文运行包 | 固定来源 | 逐文件对应 |
| --- | --- | --- |
| `zh-archify` | [tt-a1i/archify 3.3.2，d6b0f71 的 archify/](https://github.com/tt-a1i/archify/tree/d6b0f71f25a3337ed2fcd09c973cacf67be7baba/archify) | [Archify 清单](materials/archify/manifest.tsv) |
| `zh-modern-web-guidance` | [GoogleChrome/modern-web-guidance，2b4aa13 的 skills/modern-web-guidance/](https://github.com/GoogleChrome/modern-web-guidance/tree/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f/skills/modern-web-guidance) | [Google 技能清单](materials/modern-web-guidance/manifest.tsv) |
| `zh-chrome-extensions` | [同版 skills/chrome-extensions/](https://github.com/GoogleChrome/modern-web-guidance/tree/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f/skills/chrome-extensions)，与上一固定版本的目录内容一致 | [Google 技能清单](materials/modern-web-guidance/manifest.tsv) |
| `zh-dashboard-design` | [abdiraimov-otabek/dashboard-design-skill，57f9668 的 skills/dashboard-design/](https://github.com/abdiraimov-otabek/dashboard-design-skill/tree/57f96688862668b482f647fa1e370efb5d3ddd31/skills/dashboard-design) | [仪表盘技能清单](materials/dashboard-design-skill/manifest.tsv) |

上述中文化与名称调整是本项目的修改，原作者和相关组织未因此为译文提供背书。项目补充的来源与修改说明集中在本文，技能目录不额外添加 `UPSTREAM.md` 或翻译声明段落。清单中的 `zh_path`、`runtime_paths` 和摘要可用于逐文件核对。

### Archify

版权归 tt-a1i (Archify)、Cocoon AI 及各组件作者。Archify 源自 [Cocoon-AI/architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator)。默认许可为 Apache 2.0；转换前取得的 MIT 代码和既有发布继续保留原授权，详见原始 NOTICE。

| 适用内容 | 原始声明 |
| --- | --- |
| Archify 默认许可与来源归属 | [Apache 2.0](licenses/archify/LICENSE)、[NOTICE](licenses/archify/NOTICE) |
| 历史 MIT 授权 | [LICENSE-MIT](licenses/archify/LICENSE-MIT) |
| Simple Icons、品牌图形及其他第三方边界 | [上游第三方声明](licenses/archify/THIRD_PARTY_NOTICES.md.txt) |
| JetBrains Mono 字体 | [SIL OFL 1.1](licenses/archify/assets/JetBrainsMono-OFL.txt) |
| Pele Mermaid 渲染组件，kepano | [MIT](licenses/archify/explainer/vendor/pele/LICENSE) |

这些声明既有集中原文，也在 `zh-archify` 中按上游原路径保留。字体、图标和品牌分别适用各自条款。历史版本 `a7ed6fd` 的 [NOTICE](licenses/archify/a7ed6fd/NOTICE) 和[第三方声明](licenses/archify/a7ed6fd/THIRD_PARTY_NOTICES.md.txt)随集中副本保留。

3.3.2 新增 Code Analysis 与 Story 资源。法律原文保留在材料及运行包中，集中副本随 npm 包分发。

| 随 3.3.2 分发的组件 | 原始声明 |
| --- | --- |
| Code Analysis 模块 | [MIT](licenses/archify/modules/code-analysis/LICENSE)、[NOTICE](licenses/archify/modules/code-analysis/NOTICE) |
| Python 分析来源 Pyright | [MIT](licenses/archify/modules/code-analysis/extract/py/upstream/LICENSE.txt) |
| CodeQL 行指纹算法 | [MIT](licenses/archify/modules/code-analysis/import/vendor/CODEQL-LICENSE.txt) |
| OASIS SARIF 2.1.0 schema 与 Errata 01 | [固定版本仓库许可](licenses/archify/modules/code-analysis/import/vendor/OASIS-LICENSE.md)、[规范 Notices 原文](licenses/archify/modules/code-analysis/import/vendor/OASIS-SARIF-2.1.0-Errata01-NOTICES.html) |
| Three.js 与分析模块随附依赖 | [Three.js MIT](licenses/archify/modules/code-analysis/overlay/vendor/THREE-LICENSE.txt)、[DEPENDENCY LICENSES](licenses/archify/modules/code-analysis/vendor/LICENSES.txt) |
| Vue 回归摘录 | [vue-2532.LICENSE](licenses/archify/modules/code-analysis/test/fixtures/vue-2532.LICENSE) |
| Story HTML 解析器 | [parse5 MIT](licenses/archify/story/vendor/parse5-LICENSE.txt)、[entities BSD-2-Clause](licenses/archify/story/vendor/entities-LICENSE.txt) |

SARIF schema 与 OASIS 发布件的 SHA-256 一致。技能包把原仓库许可和 Errata 01 的完整 Notices 随原路径 schema 一起分发。OASIS 对该规范采用 RF on RAND Terms Mode。 [官方 schema](https://docs.oasis-open.org/sarif/sarif/v2.1.0/errata01/os/schemas/sarif-schema-2.1.0.json) [规范及 Notices](https://docs.oasis-open.org/sarif/sarif/v2.1.0/errata01/os/sarif-v2.1.0-errata01-os-complete.html)

Archify 中文材料完整翻译说明文档；程序、生成代码、内置目录与 schema 沿用该来源已有的原字节保留策略，代码对照不称为译文。机器夹具、二进制和法律原文同样保留原字节。

### Google modern-web-guidance

归属 GoogleChrome/modern-web-guidance 贡献者。固定版本的 [README 许可节](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/README.md#license)区分软件代码的 [Apache 2.0](licenses/modern-web-guidance/LICENSE) 与 `guides/` 文档内容的 [CC-BY 4.0](licenses/modern-web-guidance/CC-BY-4.0.txt)，另有声明的内容从其声明。原 README 全文保存在 [SOURCE-README.txt](licenses/modern-web-guidance/SOURCE-README.txt)。

按其归属声明，部分文档源自 [MDN Web Docs](https://developer.mozilla.org/) 的 Mozilla Contributors，以及 [W3C](https://www.w3.org/)、[WHATWG](https://whatwg.org/) 和 [IETF](https://www.ietf.org/) 规范。两个中文包的文档和指南保留这些来源及适用许可；商店、隐私文案模板中的自然语言也翻译为中文，原占位符和结构保留。本仓库 MIT 不替代这些许可。

运行包固定版本的[新版 README 许可节](https://github.com/GoogleChrome/modern-web-guidance/blob/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f/README.md#license)与 `64a6d70` 的许可节逐字一致。集中副本保存的是 `64a6d70` 的完整 README。

### Dashboard Design

版权归 Otabek Abdiraimov（2026）。原仓库根目录的 [MIT 许可原文](licenses/dashboard-design-skill-MIT.txt) 已按原字节保存，适用于收录的技能内容。材料和运行包各含 1 个入口文件和 13 个参考文件。中文底稿保留 `dashboard-design` 身份，安装运行版及完成署名使用 `zh-dashboard-design`。完成署名保留 Gold Master Kit、Halo、Shedi 的原链接和用户可取消的条件。可执行示例保留技术标识、行为和数值，代码注释与布局示意文字翻译为中文。

## Speculo 内嵌内容

Speculo 的根 MIT 不覆盖其所有第三方内容。下列原始声明随被动材料保存，并在 `licenses/` 提供集中副本。

| 内容与权利人 | 许可及归属原文 |
| --- | --- |
| `skills-hub` 中的 Ting'an Wang 技能包 | [MIT](licenses/Speculo-skills-hub-MIT.txt) |
| `writing/ste-zh`，Ting'an Wang、dualface | [MIT](licenses/Speculo-ste-zh-MIT.txt)、[NOTICE](licenses/Speculo-ste-zh-NOTICE.txt)；不包含 ASD-STE100 标准或词典 |
| `writing/eli5`，wta | [完整声明](licenses/Speculo-eli5-THIRD-PARTY-NOTICES.txt)，含教学研究仅作概念参考的边界；`align-intent` 适用 Speculo 根 MIT |
| awesome-design-md 设计分析，VoltAgent | [MIT](licenses/awesome-design-md-MIT.txt) |
| toml-eslint-parser 1.0.3、eslint-visitor-keys 5.0.0、jsonc-parser 3.3.1，Yosuke Ota、相关贡献者、Microsoft | [完整许可集](licenses/Speculo-vendor-parsers-NOTICES.txt)，分别为 MIT、Apache 2.0、MIT；仅作被动资料 |
| Lucide 1.37.0，Lucide Icons and Contributors、Cole Bemis | [完整 LICENSE](licenses/lucide-1.37.0-LICENSE.txt)，含 Lucide ISC、Feather 衍生图标名单及 MIT |
| Unsplash 画廊照片 | [原始归属](licenses/Speculo-gallery-ATTRIBUTION.txt)、[许可页原文](licenses/Unsplash-LICENSE-page.html.txt)、[条款页原文](licenses/Unsplash-TERMS-page.html.txt) |

照片、字体、商标及历史文本的单独权利不会由软件 MIT 自动授予。Unsplash 法律页面保存的是取得时版本，照片对应的历史条款和额外权利未全部核实。`person-m-mao-zedong-cognitive-os/books/src/` 的历史语料也没有由 Speculo 或本项目重新授予 MIT 许可。再次分发相应材料前需核实其适用条件。

Lucide 与 Unsplash 补充法律文件的来源 URL、取得时间、摘要和核对边界见[资产许可来源记录](licenses/Speculo-ASSET-LEGAL-PROVENANCE.txt)。这些文件用于说明已保留资产的权利依据，不表示全部第三方资产已完成权利清理。

## 方法与规范参考

以下资料用于概念、格式或工具语义对照，未整篇转载，也未作为新增材料树或运行依赖收录。实际采用的开源方法和许可已列在前文；查看文章或较新提交不代表本地材料已整体更新。

### 技能组织、写作与知识管理

| 参考 | 对应内容 |
| --- | --- |
| [Agent Skills specification](https://agentskills.io/specification) | 技能元数据、文件组织和按需读取 |
| [Anthropic 技能编写指南](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)、[技能概述](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | 描述、入口长度、资源引用和渐进式披露 |
| [OpenAI 技能文档](https://learn.chatgpt.com/docs/build-skills)、[Rethinking skills and prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)、[Harness engineering](https://openai.com/index/harness-engineering/) | 入口路由、项目知识与执行环境约束 |
| [OpenAI ExecPlans](https://developers.openai.com/cookbook/articles/codex_exec_plans)、[技能评测](https://developers.openai.com/blog/eval-skills)、[Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices) | 可接手的计划、可观察验收和风险适配 |
| [MetaCubeX 文档固定版本](https://github.com/MetaCubeX/Meta-Docs/tree/2a6ba6b04a9eecdbe5c88c4e4a09776659c0878b) | 代理配置字段与相关技术语义 |

### 开发环境与资源准入

`dev-setup` 在既有 pstack 角色能力核对方法上，按本项目要求将团队约定改为显式引用的独立文件，环境预算与团队文件分开维护。资源容量方法采用以下成熟机制并适配到现有 dev 技能；新增参考没有整篇转载或复制工具实现，不新增材料树，也不改变材料父清单的固定版本。

| 参考（2026-11-24 核对） | 采用与适配 |
| --- | --- |
| OpenAI [原生并发配置](https://learn.chatgpt.com/docs/config-file/config-reference.md)、[工作树](https://learn.chatgpt.com/docs/environments/git-worktrees)、[本地环境](https://learn.chatgpt.com/docs/environments/local-environment) | 区分单会话并发与整机容量；逐 worktree 初始化并计算依赖/缓存空间；活动和保留对象受到保护。不把产品默认数量复制为硬件预算。 |
| Anthropic [子代理](https://code.claude.com/docs/en/sub-agents)、[Agent teams](https://code.claude.com/docs/en/agent-teams)、[工作树](https://code.claude.com/docs/en/worktrees) | 委派传递必要上下文；先核实版本与限制作用域；正常退出、活动会话/锁与所有权核对用于现有清理流程。 |
| Google Gemini CLI [配置](https://geminicli.com/docs/reference/configuration/)、[工作树](https://geminicli.com/docs/cli/git-worktrees/)、[沙箱](https://geminicli.com/docs/cli/sandbox/) | 单进程堆设置不代表整机预算；退出后可能仍保留工作树；环境初始化、隔离和资源限制分别核验。 |
| Kubernetes [Node Allocatable](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/)、[资源请求与限制](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) | 容量扣除系统保护与已承诺工作，准入与运行时限制分开；本项目不引入 Kubernetes 调度器。 |
| Google SRE [Handling Overload](https://sre.google/sre-book/handling-overload/)、[Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) | 按真实负载测量容量，过载时停止追加与重试放大，保留恢复条件。 |
| [Linux cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)、[Docker 资源限制](https://docs.docker.com/engine/containers/resource_constraints/) | 核对父层/容器有效配额、内存剩余、CPU 承诺和包含线程的 PID 计数；隔离不等于已设置限制。 |
| [Git worktree](https://git-scm.com/docs/git-worktree) | 保留 remove、锁、未保存内容和 prune 的真实语义，复用现有只读审计与清理。 |
| obra/superpowers [using-git-worktrees](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/using-git-worktrees/SKILL.md)、[finishing-a-development-branch](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/finishing-a-development-branch/SKILL.md) | 先识别现有隔离与管理归属，初始化后验证，从目标检出外按归属收尾；不复制额外确认菜单或与本次任务无关的固定流程。 |

逐主机共享预算、未兑现峰值增长、允许新增量为零和 `.agents/dev/context/team/<team_name>.md` 是上述机制在本项目的适配，不是各来源共同制定的标准。v0.1.28 按用户纠正，删除其他阶段方法和帮助中的团队/模型配置转介、默认继承与通用模型选择提醒；保留独立判断、盲评覆盖和资源准入机制。来源证据与未采用事项见[研究记录](.agents/dev/changes/2026-11-24-resource-aware-setup/research.md)。

v0.1.29 继续按用户要求，移除其他 dev 运行技能对环境初始化技能的提及。环境与资源信息改为直接复用已有记录的有效部分，缺失或过期时依据实际执行主机核对；模板不要求预先建立环境文件。该调整保留资源预留、独立判断、覆盖和工作树回收机制，不改变上游来源版本或已复核对象。

本轮依据 [Issue #18](https://github.com/NAMEWTA/skills-hub/issues/18) 的 2026-11-25 方法研究，补充结果口径、有界校准和会话、重任务、工作树的联合预算。上表已列出的原生并发、工作树、cgroup、系统预留与过载处理来源继续沿用；以下只列新增的具体参考。源码链接固定到研究所用提交，滚动文档的研究日期不表示其内容永久不变，实际配置仍按安装版本核对。

| 增量参考 | 采用与不采用的边界 |
| --- | --- |
| Gemini CLI [subagents](https://geminicli.com/docs/core/subagents/)、[安装要求](https://geminicli.com/docs/get-started/installation/) | 区分独立上下文、实际执行资源与环境要求；不把安装页内存建议换算成每个 Agent 的固定成本。 |
| xAI Grok Build [更新记录](https://x.ai/changelog/build)、固定源码 [admission.rs](https://github.com/xai-org/grok-build/blob/2bdd1d6a6369de0e8c68132ea4539e9abd9e14a8/crates/codegen/xai-grok-tools/src/implementations/grok_build/task/admission.rs)、[auto_gc.rs](https://github.com/xai-org/grok-build/blob/2bdd1d6a6369de0e8c68132ea4539e9abd9e14a8/crates/codegen/xai-fast-worktree/src/auto_gc.rs) | 核对会话准入、workflow 运行池和回收策略各自的作用域；不以旧版本说明推断当前并发或清理能力，会话结束也不视为磁盘已释放。 |
| GitHub Copilot CLI [命令参考](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)、[/fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion) | 将任务独立性、会话树与产品限制、本地资源分别核对；不把产品可创建的会话数当作硬件安全容量。 |
| obra/superpowers [dispatching-parallel-agents](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/dispatching-parallel-agents/SKILL.md) | 借鉴按独立问题分工，沿用本项目 task 与会话分离及会话复用约定；不把每项 task 固定映射为一个新会话。上表工作树方法中的自动安装与基线测试不作为普通只读评估的默认步骤。 |
| AI-CFD-Scientist [resource_probe.py](https://github.com/csml-rpi/AI-CFD-Scientist/blob/27eb2e82793ef9f1d190257e10020aa158a81b9a/src/cfd_langgraph/scheduling/resource_probe.py)、[scheduler.py](https://github.com/csml-rpi/AI-CFD-Scientist/blob/27eb2e82793ef9f1d190257e10020aa158a81b9a/src/cfd_langgraph/scheduling/scheduler.py) | 借鉴单项进程树校准、结合 CPU 与内存估算及压力下暂缓新增；不采用未测时按核数猜人数、强制至少一个名额、等待超时后带压启动的策略，不引入其 Python 调度器。 |
| Linux [PSI](https://docs.kernel.org/accounting/psi.html) | 配合已有 cgroup 来源解释持续压力与恢复观察；保护线、观察窗口和恢复条件按实际环境说明来源，不声称存在全平台通用的安全常数。 |
| Node.js 22.14 [os.availableParallelism()](https://nodejs.org/download/release/v22.14.0/docs/api/os.html#osavailableparallelism)、[process.constrainedMemory()](https://nodejs.org/download/release/v22.14.0/docs/api/process.html#processconstrainedmemory) | 按接口语义与可见平台约束解释观测；不把并行度估计等同于 Agent 数，也不把内存接口返回 `0` 直接解释为零 RAM 或无限容量。 |
| Playwright [并行测试](https://playwright.dev/docs/test-parallel)、CMake [构建并发](https://cmake.org/cmake/help/latest/envvar/CMAKE_BUILD_PARALLEL_LEVEL.html) | 记录实际工具版本下的内部 workers 或 jobs，并核对限制是否生效；不让多个工作树各自无条件使用整机并行度。 |

报告中的当前观测、已验证运行规模、建议并发和实际极限分别表述；默认只读、按已有授权有界校准、证据不足时保留未知，以及当前数量超出建议时停止扩张，均是本项目的适配。来源中的团队人数建议、配置默认值与安装要求不能代替实际容量证据。本轮只作方法研究与适配，不执行或导入来源脚本，不新增运行依赖或全量材料副本，也不更新材料的逐文件审校状态和已有历史声明。

### Issue 撰写与维护

`dev-issue` 将以下资料作为正文完整性、仓库上下文和远程写入语义的对照，自行组织面向 GitHub 的创建、更新与评论流程。完整规格和本地切片方法继续分别由 `dev-spec`、`dev-plan` 维护，不复制其正文或增加第二个材料归属。以下网页和较新源码未整篇翻译收录，也不改变材料父清单的固定版本。

| 参考（2026-11-23 核对） | 采用与适配 |
| --- | --- |
| GitHub [任务说明](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results)、[Issue Forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)、[创建 Issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue) | 目标、相关代码、验收与模板；创建前查重。沿用目标仓库字段，不硬编码标签或负责人。 |
| [Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices) | 写明代码无法推断的业务选择、具体症状和完成标准，以真实验证支持结论。 |
| [OpenAI ExecPlans 固定源码](https://github.com/openai/openai-cookbook/blob/857eb0b0a3419b7868ea768f1de3ee906cf176e4/articles/codex_exec_plans.md) | 接手者不依赖聊天历史；正文包含必要结论、行动及可观察验收。没有移植其全部专用章节。 |
| Gemini CLI [项目上下文](https://geminicli.com/docs/cli/gemini-md/)、[规划模式](https://geminicli.com/docs/cli/plan-mode/) | 先读适用项目指导再研究方案。按实际宿主使用已有文件，不新建另一套配置。 |
| [Google Conductor new-track](https://github.com/gemini-cli-extensions/conductor/blob/6e8f9a860bcdd6a2c423473c12e745200688c633/skills/conductor-new-track/SKILL.md) | 对照需求类型、规格和计划的分工；保留既有授权，不引入固定多轮确认、自动安装和自动实施。 |
| GitHub Spec Kit [规格](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/templates/spec-template.md)、[计划](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/templates/plan-template.md)、[任务](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/templates/tasks-template.md)、[任务发布](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/extensions/github/commands/speckit.github.taskstoissues.md) | 对照需求、任务、验收映射和真实依赖；按目标项目选择验证方式；查重结合仓库和来源语义，不只匹配跨任务重复的编号。 |
| Matt Pocock [to-spec](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/skills/engineering/to-spec/SKILL.md)、[to-tickets](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/skills/engineering/to-tickets/SKILL.md) | 核对完整上下文和独立接手要求；沿用现有负责技能，不新增重复方法。源码定位作为带版本的证据，不把猜测路径固定成需求。 |
| [OpenSpec 规格驱动 schema](https://github.com/Fission-AI/OpenSpec/blob/0c737dc1b543249b38b0f4716816fcf493d894dd/schemas/spec-driven/schema.yaml)、[设计模板](https://github.com/Fission-AI/OpenSpec/blob/0c737dc1b543249b38b0f4716816fcf493d894dd/schemas/spec-driven/templates/design.md) | 分清问题、行为、设计和任务；只为真实复杂度展开设计，任务附完成验证，阻塞选择如实保留。 |

本次来源核对、当前技能复用关系及裁剪理由见[开发记录](.agents/dev/changes/2026-11-23-dev-issue/source-adaptations.md)。上游没有共同制定这份 Issue 流程；已发布的正文与本地契约如何同步是本项目的维护约定。

### 上下文交接

[Anthropic 长任务实践](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)、[上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)和[后续 harness 实践](https://www.anthropic.com/engineering/harness-design-long-running-apps)用于对照进度、决定、证据与会话接续；[OpenAI Agents SDK handoffs](https://openai.github.io/openai-agents-python/handoffs/) 和 [context](https://openai.github.io/openai-agents-python/context/)用于区分交接目标、输入上下文与本地状态。项目未引入对应 SDK 或演示 harness。

### 原型与设计验证

主要复制适配来自已收录的 Speculo、Matt 和 pstack。Speculo 的[原型入口](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-p-prototype/SKILL.md)、[证据方法](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-p-prototype/references/design-evidence.md)和[完整引用示例](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-p-prototype/references/design-evidence-example.md)提供直接代码证据与同场景对照方法。

补充对照包括 Matt 的 [prototype](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/prototype/SKILL.md)、[LOGIC](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/prototype/LOGIC.md)、[UI](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/prototype/UI.md)，以及 pstack 的[原型方法](https://github.com/cursor/plugins/blob/3fa33bb0f927bea2ccacd48a3cfda95145fb6bae/pstack/skills/poteto-mode/playbooks/prototype.md)、[Experience First](https://github.com/cursor/plugins/blob/3fa33bb0f927bea2ccacd48a3cfda95145fb6bae/pstack/skills/principle-experience-first/SKILL.md)和[视觉对齐](https://github.com/cursor/plugins/blob/3fa33bb0f927bea2ccacd48a3cfda95145fb6bae/pstack/skills/poteto-mode/playbooks/visual-parity.md)。

| 参考 | 对应内容 |
| --- | --- |
| OpenAI [Figma 实施技能](https://github.com/openai/skills/blob/0e7823cca07bc2cbf34718a383f9ae92525be6a5/skills/.curated/figma-implement-design/SKILL.md)、[前端设计](https://learn.chatgpt.com/use-cases/frontend-designs)、[页面内反馈](https://openai.com/index/codex-for-almost-everything/) | 项目设计上下文、token、浏览器状态与视口核对 |
| Anthropic [frontend-design](https://github.com/anthropics/skills/blob/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design/SKILL.md)、[web-artifacts-builder](https://github.com/anthropics/skills/blob/ef740771ac901e03fbca3ce4e1c453a96010f30a/skills/web-artifacts-builder/SKILL.md)、[应用开发 harness](https://www.anthropic.com/research/harness-design-long-running-apps)、[端到端验证](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) | 视觉约束、HTML 交付与实际用户路径验证 |
| Google [Gemini Canvas](https://blog.google/products-and-platforms/products/gemini/gemini-collaboration-features/)、[Stitch](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/) | 代码预览、交互修改与完整用户旅程 |
| obra/superpowers [visual companion](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/brainstorming/visual-companion.md) | 视觉问题与概念澄清的区分、真实反馈 |
| GitHub Spec Kit [spec template](https://github.com/github/spec-kit/blob/e210504aa09c9273a38bba665b12b8088468c96f/templates/spec-template.md) | 用户旅程、独立验证与行为边界 |

确认原型对可见效果的优先级是本项目的开发约定，不代表上述来源共同制定的标准。

### 运维工具与工程方法

| 参考 | 对应内容 |
| --- | --- |
| [Ansible check/diff](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html) | 后端预览、真实执行与输出保密的区别 |
| [Rundeck Executions](https://docs.rundeck.com/docs/manual/07-executions.html) | node/step、输出、再次运行与中断核对 |
| Docker Compose [logs](https://docs.docker.com/reference/cli/docker/compose/logs/) / [restart](https://docs.docker.com/reference/cli/docker/compose/restart/) | 有界日志与实例重启语义 |
| Google SRE [Incident Response](https://sre.google/workbook/incident-response/) / [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) | 事件记录、恢复、根因与可执行复盘 |
