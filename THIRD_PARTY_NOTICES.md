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
| [anthropics/oncall-kit](https://github.com/anthropics/oncall-kit)，Anthropic 及贡献者 | `skills/triage`、`templates`、`eval`；分别用于事故调查、经验手册和回放评估方法。 | [Apache 2.0](licenses/oncall-kit/LICENSE)；[调查](materials/oncall-triage/manifest.tsv)、[模板](materials/oncall-templates/manifest.tsv)、[回放](materials/oncall-replay/manifest.tsv)清单 |
| [openai/skills — Sentry](https://github.com/openai/skills/tree/main/skills/.curated/sentry)，OpenAI 及贡献者 | `skills/.curated/sentry`；只读错误观测、范围核对与脱敏方法用于 `ops-inspect`。 | [Apache 2.0](licenses/openai-sentry-Apache-2.0.txt)；[清单](materials/openai-sentry/manifest.tsv) |
| [HumanLayer](https://github.com/humanlayer/humanlayer) / [Dex Horthy](https://github.com/dexhorthy)，QueryTale, Inc. d/b/a HumanLayer | 既有 PR 视觉说明中的 show-me 方法；已作中文翻译和流程适配。NOTICE 中列出的其他程序组件未因此一并收录。 | [Apache 2.0](licenses/humanlayer-Apache-2.0.txt)、[NOTICE](licenses/humanlayer-NOTICE.txt) |
| [abdiraimov-otabek/dashboard-design-skill](https://github.com/abdiraimov-otabek/dashboard-design-skill)，Otabek Abdiraimov | 固定版本 `skills/dashboard-design/` 的 11 份 Markdown；完整翻译后独立提供 `zh-dashboard-design`。不包含来源仓库根部的示例页面、图片与 Claude 插件配置。 | [MIT](licenses/dashboard-design-skill-MIT.txt)；[清单](materials/dashboard-design-skill/manifest.tsv) |

### 整合内容的修改范围

自有领域的运行内容在完整方法基础上作中文翻译，并调整技能名称、项目路径、宿主能力与职责归属。来源语境保存在 `materials/`，本地差异记录在子清单的 `adaptation` 字段。

- `dev-handoff` 采用 Matt handoff 及 pstack session-pickup、pause-safely 方法，把临时交接改为项目持久资料，并适配技能调用、既有授权和恢复核对。
- `dev-prototype` 采用 Speculo 的原型证据方法、采购申请引用示例，以及 Matt/pstack 的完整探索方法。采购示例只分发必要 HTML/CSS/JS，不包含来源画廊的照片、品牌字体或图标库。
- `system-herdr` 保留完整 CLI 方法；客户端启动示例与按 pane 的 task/report 文件通信属于本地扩展。
- ops 将调查、经验和只读观测方法适配到本领域的 registry、run、项目资料与实际工具能力。领域之间不因此产生自动安装依赖。
- issue 初始化、分诊和复现修复保留 pstack 较早 [Benny 自动化资料](https://github.com/cursor/plugins/tree/6b0300214a09fd6029cfb7077043125758cd1fd2/pstack/automations/benny)的方法；通用来源接口和项目配置属于本地适配，原 Slack 分支保留其身份核对与回读要求。

## 独立中文上游技能

以下目录对应所选版本的原技能文件，保留完整结构和内容。自然语言文档由 skills-hub 翻译为中文；运行包使用 `zh-` 名称，并调整必要的自身调用、交叉技能名称和本地链接。代码示例、工具程序、协议字段及法律原文按原件保留。译文的英文标题锚点用于兼容原有片段链接。

| 中文运行包 | 固定来源 | 逐文件对应 |
| --- | --- | --- |
| `zh-archify` | [tt-a1i/archify，a7ed6fd 的 archify/](https://github.com/tt-a1i/archify/tree/a7ed6fd6657da90414831d1d42cf95987188750c/archify) | [Archify 清单](materials/archify/manifest.tsv) |
| `zh-modern-web-guidance` | [GoogleChrome/modern-web-guidance，64a6d70 的 skills/modern-web-guidance/](https://github.com/GoogleChrome/modern-web-guidance/tree/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/modern-web-guidance) | [Google 技能清单](materials/modern-web-guidance/manifest.tsv) |
| `zh-chrome-extensions` | [同版 skills/chrome-extensions/](https://github.com/GoogleChrome/modern-web-guidance/tree/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions) | [Google 技能清单](materials/modern-web-guidance/manifest.tsv) |
| `zh-dashboard-design` | [abdiraimov-otabek/dashboard-design-skill 2.1.0，463b8fd 的 skills/dashboard-design/](https://github.com/abdiraimov-otabek/dashboard-design-skill/tree/463b8fdf62c640180ec1ba731f3616c2319bf68c/skills/dashboard-design) | [仪表盘技能清单](materials/dashboard-design-skill/manifest.tsv) |

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

这六份文件既有集中原文，也在 `zh-archify` 中按上游原路径保留。字体、图标和品牌的单独条件不因软件采用 Apache 2.0 而改变。

### Google modern-web-guidance

归属 GoogleChrome/modern-web-guidance 贡献者。固定版本的 [README 许可节](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/README.md#license)区分软件代码的 [Apache 2.0](licenses/modern-web-guidance/LICENSE) 与 `guides/` 文档内容的 [CC-BY 4.0](licenses/modern-web-guidance/CC-BY-4.0.txt)，另有声明的内容从其声明。原 README 全文保存在 [SOURCE-README.txt](licenses/modern-web-guidance/SOURCE-README.txt)。

按其归属声明，部分文档源自 [MDN Web Docs](https://developer.mozilla.org/) 的 Mozilla Contributors，以及 [W3C](https://www.w3.org/)、[WHATWG](https://whatwg.org/) 和 [IETF](https://www.ietf.org/) 规范。两个中文包的文档和指南保留这些来源及适用许可；商店、隐私文案模板中的自然语言也翻译为中文，原占位符和结构保留。本仓库 MIT 不替代这些许可。

### Dashboard Design

版权归 Otabek Abdiraimov（2026）。原仓库根目录的 [MIT 许可原文](licenses/dashboard-design-skill-MIT.txt) 已按原字节保存，适用于收录的技能内容。所选 `skills/dashboard-design/` 子树共有 1 个入口文件和 10 个参考文件；没有额外复制仓库外层 `examples/`、`docs/`、`.claude-plugin/` 或原仓库 README。中文底稿保留上游 `dashboard-design` 身份，安装运行版的名称为 `zh-dashboard-design`，并在原作者的完成署名中同步使用该运行名；作者的 Halo、Shedi 介绍链接及用户可请求取消的条件保持。所有代码围栏、数据格式和阈值保持原义。本项目的译文并不意味着得到原作者背书。

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
