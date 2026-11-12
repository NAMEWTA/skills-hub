# 工程

我日常编程时使用的技能。

## 由用户调用

只有你输入名称时才可触达（Claude Code：`disable-model-invocation: true`；Codex：`agents/openai.yaml` 中的 `policy.allow_implicit_invocation: false`）。

- **[ask-matt](./ask-matt/SKILL.md)**：询问哪个技能或流程适合你的情境。它为本仓库中由用户调用的技能提供路由。
- **[grill-with-docs](./grill-with-docs/SKILL.md)**：开展深入追问，同时构建项目的领域模型，打磨术语，并随讨论即时更新 `GLOSSARY.md` 和 ADR。
- **[triage](./triage/SKILL.md)**：通过分诊角色组成的状态机推进问题。
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)**：扫描代码库寻找深化机会，以可视化 HTML 报告呈现，然后深入追问你选中的候选项。
- **[setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md)**：配置当前仓库，使其适用于工程技能（问题跟踪器、分诊标签、领域文档布局）。每个仓库运行一次。
- **[to-spec](./to-spec/SKILL.md)**：将当前对话转为规格，并发布到问题跟踪器。
- **[to-tickets](./to-tickets/SKILL.md)**：将计划、规格或对话拆分成一组曳光弹式工单；每张工单都声明阻塞边，可以是本地文件中的文本，也可以是真实跟踪器中的原生阻塞链接。
- **[implement](./implement/SKILL.md)**：实现规格或一组工单描述的工作，在预先约定的接缝处驱动 `/tdd`，并在提交前用 `/code-review` 收尾。
- **[implement-spec](./implement-spec/SKILL.md)**：在一条集成分支上实现整份规格。把工单作为任务图，在就绪前沿上运行实现子代理，以最大化并发，最后用 `/code-review` 收尾。
- **[wayfinder](./wayfinder/SKILL.md)**：将超过单个代理会话容量的大型工作，规划成问题跟踪器上一张共享的决策工单地图；逐个解决决策，直到通往目标的路径清晰。
- **[retro](./retro/SKILL.md)**：在会话结束后，为编码代理的环境（导航、自动检查、编码标准、引导文件、工具）提出改进建议，按严重程度降序排列。

## 由模型调用

模型或用户均可触达（提供丰富的触发表述，让模型能够主动使用）。

- **[prototype](./prototype/SKILL.md)**：构建一次性原型来回答设计问题：状态/逻辑用单个可分享的 HTML 文件，或提供多种可切换的 UI 变体。

- **[diagnosing-bugs](./diagnosing-bugs/SKILL.md)**：针对棘手缺陷与性能回归，采用严谨的诊断循环：建立能因该缺陷变红的反馈循环 → 最小化 → 提出假设 → 添加观测 → 修复 → 回归测试。
- **[research](./research/SKILL.md)**：依据高可信一手来源研究问题，并将发现保存为仓库内带引文的 Markdown 文件，以后台代理运行。
- **[tdd](./tdd/SKILL.md)**：采用红—绿—重构循环的测试驱动开发，每次完成一个纵向切片，构建功能或修复缺陷。
- **[domain-modeling](./domain-modeling/SKILL.md)**：通过质疑术语、用场景进行压力测试，并随讨论即时更新 `GLOSSARY.md` 和 ADR，主动构建、打磨项目的领域模型。
- **[codebase-design](./codebase-design/SKILL.md)**：设计深模块的共同准则与术语：小接口、清晰接缝、能够通过接口测试。
- **[code-review](./code-review/SKILL.md)**：从固定起点审查差异的两个维度：**标准**（是否遵循仓库编码标准，以及 Fowler 代码异味基线？）和**规格**（是否忠实实现最初的问题/规格？），由并行子代理执行。
- **[pr](./pr/SKILL.md)**：拉取请求正文应有的形式：用能讲清变更的最小可视化作为摘要，给出证明有效的前后对照证据，并判断合并风险（单向门还是双向门，以及影响范围）。
- **[wizard](./wizard/SKILL.md)**：生成交互式 bash 向导，引导人类完成只有他们能做的步骤：配置基础设施、设置凭据或 CI 密钥、操作陌生的第三方控制台，或执行一次性迁移、切换。
