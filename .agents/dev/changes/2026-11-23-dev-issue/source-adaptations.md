# dev-issue 的来源核对与适配决定

核对日期：2026-11-23。对应 [Issue #13](https://github.com/NAMEWTA/skills-hub/issues/13)。仓库分析基线为 `main@e81e7e570b64ce5b40da0540d95966a626075672`，当时包版本为 `0.1.23`。

本记录保存本次方法研究、现有技能复用和适配理由。它不是新增运行指令，也不代表整仓上游同步。本次不刷新 `materials/`、来源摘要或 `runtime_reviewed_blob`，不把外部文章或技能整篇复制、翻译进 `dev-issue`。

## 先复用本仓库的完整方法

| 基线依据 | 本次采用与边界 |
| --- | --- |
| [AGENTS.md](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/AGENTS.md) | 继续已授权工作；按任务选择验证方法；项目资料放在 dev 领域目录；技能包只保留方法 |
| [方法归属](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/docs/development/method-ownership.md) | 一个完整方法有一个负责人，调用方传递目标、权威记录、证据和返回条件 |
| [dev-intake](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/skills/dev/dev-intake/SKILL.md) | 复用来源、事实、目标和缺口整理；不在新技能重写完整 intake 方法 |
| [dev-spec](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/skills/dev/dev-spec/SKILL.md) | 行为契约与实施简报仍归 spec；已有充分契约直接使用 |
| [dev-plan](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/skills/dev/dev-plan/SKILL.md)、[本地工作记录](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/skills/dev/dev-plan/references/local-work-records.md) | 本地一票一文件、直接阻塞、DAG 和进展保持原归属；新技能组织远端发布视图 |
| [dev-issue-triage](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/skills/dev/dev-issue-triage/SKILL.md)、[dev-issue-setup](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/skills/dev/dev-issue-setup/SKILL.md) | 分类分流与来源自动化继续独立；用户手工要求写完整 Issue 时不强制建立自动化 |
| [dev-writing](https://github.com/NAMEWTA/skills-hub/blob/e81e7e570b64ce5b40da0540d95966a626075672/skills/dev/dev-writing/SKILL.md) | 指南按用户任务组织；区分事实、计划、示例和未知，使用真实路径与行为证据 |

当前规范允许根据项目与切片选择规格驱动、TDD、实现后验证或其他适合的方法。旧记录中的“禁止 TDD”不作为本次约束；`dev-issue` 不强制测试和实现的先后。

## GitHub 官方文档

网页按上述日期读取，没有为持续更新的文档虚构固定 commit。

| 完整来源 | 采用的规则 | 未采用或需要适配的部分 |
| --- | --- | --- |
| [Copilot cloud agent 的任务说明](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results) | 明确问题、完成条件、相关代码和项目约束，缩小可认领任务范围 | Issue 面向人和不同 Agent，不要求分配给 Copilot 或使用其专有流程 |
| [Issue forms 语法](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) | 读取仓库已有表单，保留适用字段；Bug 提供环境、预期、复现和证据 | Markdown 通过 API 写入不能被描述成已经触发浏览器表单校验；不擅自安装模板或创建标签 |
| [创建 Issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue) | 建单前检查相关问题，使用代码与讨论链接补足上下文 | 已有 Issue 的更新和评论另按用户授权处理，不因有写权限扩大操作 |

## Claude、OpenAI 与 Gemini

| 完整来源 | 采用的规则 | 未采用或需要适配的部分 |
| --- | --- | --- |
| [Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices) | 写清症状、相关位置和完成后的状态；补充源码无法体现的决定；验证需要可观察结果；审查对照规格 | 不移植 Claude 专属 hooks、固定权限设置、模型参数或旧版思考关键词；不为风格偏好扩大范围 |
| [OpenAI ExecPlans 文章](https://developers.openai.com/cookbook/articles/codex_exec_plans)、[固定源码](https://github.com/openai/openai-cookbook/blob/857eb0b0a3419b7868ea768f1de3ee906cf176e4/articles/codex_exec_plans.md) | 接手者无需聊天历史；正文交代目的、上下文、步骤、预期结果与决定理由；修改后同步受影响内容 | 不强制完整 ExecPlan 章节、特定围栏格式或迁移兼容策略；必要结论写入正文，并保留可追溯来源链接 |
| [OpenAI Prompting](https://learn.chatgpt.com/docs/prompting) | 明确目标、上下文、输出和边界；Bug 提供复现，UI 补充图像未表达的交互 | 自然语言原则适配为 Issue 内容要求，不引入 Codex 专属操作命令 |
| [OpenAI AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | 开工前核对目标仓库与影响目录的真实指导 | 不要求所有项目新建 AGENTS.md，也不把技能仓库规范替代目标项目规范 |
| [Gemini CLI 项目上下文](https://geminicli.com/docs/cli/gemini-md/) | 按工作区和组件读取适用项目上下文 | 不强制建立 GEMINI.md，不依赖特定客户端的上下文加载机制 |
| [Gemini CLI Plan Mode](https://geminicli.com/docs/cli/plan-mode/) | Issue 研究阶段了解问题、比较方案和组织计划，生产实现单独授权 | 不要求启用 Gemini 模式，不复制固定审批回合或宿主工具白名单 |
| [Google Conductor 官方介绍](https://developers.googleblog.com/en/conductor-introducing-context-driven-development-for-gemini-cli/)、[new-track 固定源码](https://github.com/gemini-cli-extensions/conductor/blob/6e8f9a860bcdd6a2c423473c12e745200688c633/skills/conductor-new-track/SKILL.md) | 先读产品、技术栈和工作流；区分工作类型；分清规格与计划；任务说明完成条件 | 不引入 `conductor/`、注册表、自动安装技能、多轮必确认或自动进入实现；工作流示例不作为通用 TDD 规定 |

OpenAI 的 `https://developers.openai.com/codex/prompting` 与 `https://developers.openai.com/codex/guides/agents-md` 在核对时分别重定向至表中的当前地址。引用采用实际落地页面。

## GitHub Spec Kit

核对提交：`a4d571229e164e440f8950cac034607bae7b7518`。

| 完整文件地址 | 采用与适配 |
| --- | --- |
| [templates/spec-template.md](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/templates/spec-template.md) | 用户场景、明确需求、边界与成功条件用于检查内容覆盖；小任务按实际复杂度合并栏目 |
| [templates/plan-template.md](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/templates/plan-template.md) | 记录技术环境、约束和真实项目结构；不要求建立 Spec Kit 的目录、命令或治理文件 |
| [templates/tasks-template.md](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/templates/tasks-template.md) | 任务关联行为、依赖和完成验证；不把模板示例的测试先后变成固定规则 |
| [extensions/github/commands/speckit.github.taskstoissues.md](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/extensions/github/commands/speckit.github.taskstoissues.md) | 创建前核对目标仓库，查询开放与关闭事项，重复执行先查已存在结果；保留分页完整性 |

上游 taskstoissues 依据 Git remote 选择仓库，并按 `T001` 一类任务编号去重。本次适配以用户明确指定的目标仓库为准，核对研究对象与写入对象一致；查重同时比较来源、范围和内容，避免不同 Change 的同号任务互相误判。不复制其 hook 执行、脚本前置或批量建单默认行为。

## Matt Pocock 的规格与票据方法

本次研究提交：`abeeaf95660ba9e8b7c753eb38f441ca707a8823`。研究较新版本不表示本地已收录的材料或采用版本全部更新。

| 完整文件地址 | 采用与适配 |
| --- | --- |
| [skills/engineering/to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/skills/engineering/to-spec/SKILL.md) | 综合已有上下文，遵守领域术语和已定决策，写清行为、实现决定、验证和范围；完整规格方法继续由 `dev-spec` 持有 |
| [skills/engineering/to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/skills/engineering/to-tickets/SKILL.md) | 读取原 Issue 与全部评论，切片独立可验收、显式记录真实阻塞；完整拆票方法继续由 `dev-plan` 持有 |

不复制固定标签、庞大用户故事数量要求、强制问答审批和缺少 tracker 就退出的条件。代码证据仍给出版本化路径，区分当前入口与拟新增位置；不把“避免易过期路径”变成禁止记录所有源码位置。`dev-issue` 按名称调用现有方法，不新增 `to-spec` 或 `to-tickets` 的第二个 owner，也不把同一来源重新映射到两个技能。

## OpenSpec

核对提交：`0c737dc1b543249b38b0f4716816fcf493d894dd`。

| 完整文件地址 | 采用与适配 |
| --- | --- |
| [schemas/spec-driven/schema.yaml](https://github.com/Fission-AI/OpenSpec/blob/0c737dc1b543249b38b0f4716816fcf493d894dd/schemas/spec-driven/schema.yaml) | 区分变更动机、行为要求、设计取舍与实施任务；任务有可检查的结束条件；实施阻塞需要先明确 |
| [schemas/spec-driven/templates/design.md](https://github.com/Fission-AI/OpenSpec/blob/0c737dc1b543249b38b0f4716816fcf493d894dd/schemas/spec-driven/templates/design.md) | 设计按需写当前约束、目标、决定、理由及风险；避免重复动机正文 |

不引入独立 `openspec/` 目录、固定机器 Schema 或所有任务必须经过的阶段状态机。复杂设计在现有权威记录中补足，小范围事项保留足以实施的内容。

## 本次新增规则的来源边界

`create`、`update`、`comment` 与草稿交付、更新前重新读取、响应不明先回读、写后核对结果，以及单一契约与远端发布视图的配合，是对用户需求和本仓库约定的整合，不声明为上述来源共同制定的标准。普通 GitHub 编辑不提供本技能可宣称的原子比较后交换保证。

Bug 与性能正文需要区分报告、源码观察、实测和假设；未测基线不能填成实测数字。Issue 已发布、内容可认领和产品已实现分别需要对应证据，不能相互替代。

本次仅以自有表述记录方法比较与适配，没有新增整篇翻译或长段复制。既有方法及其法律文件继续按根 [THIRD_PARTY_NOTICES.md](../../../../THIRD_PARTY_NOTICES.md) 管理，新增研究出处也由根声明集中登记；不把研究链接当作第三方全文转载许可。以后实际复制源码、模板或长段文字时，再按所复制内容的适用许可保留法律文件、署名与修改说明。
