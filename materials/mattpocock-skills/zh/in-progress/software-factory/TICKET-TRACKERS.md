# 工单跟踪器

> 调研于 2026-10，不保证仍然最新。用它建立方向感，再自行研究当前选项：产品、价格、限制和测试版变化很快。

工单跟踪器是工厂面向人类的接口。下面每种类型都是起点：先了解是什么、工厂何时选择，再根据[进一步研究](#进一步研究)中的问题检查示例。

## 类型

### 1. Git 托管平台内置跟踪器

内置于 Git 托管平台，因此工单、分支、PR 共享同一产品、权限模型和身份。工厂规模小、团队已在平台中工作，或仓库公开时选择。即“全部使用 GitHub”设计：托管平台的 CI 无需胶合就能承担编排器。标签是可靠的路由，因为状态位于单独看板。外部开发者在代码所在处提交；非开发者需要账户，因此反馈按钮通过 API 提交。自托管 Git 平台附带自己的跟踪器。

- [GitHub Issues](https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents)：默认选择；可指派给 Copilot、Claude、Codex。
- [GitLab Issues](https://about.gitlab.com/blog/how-to-use-a-work-item-created-trigger/)：由工作项触发 Duo Agent Platform 流程。
- [Forgejo](https://forgejo.org/2026-10-release-v17-0/)：自托管、兼容 Actions。

需核实：哪些指派给代理功能仍处预览、哪些套餐包含；原生代理读取后续评论，还是只读取指派时的工单（截至 2026-10，Copilot 只在指派时读取）。

### 2. 代理原生开发跟踪器

面向软件团队的独立 SaaS 跟踪器，将代理视为一等受指派者，提供代理 API 和自有编码代理。产品、支持或设计人员安排工作、团队已在此工作，或希望精致分诊/规划视图时选择。即“Linear 工单”设计。状态与工作流是一等对象，因此“移到 Ready”是清晰触发器。代理以人类可委派的应用用户身份出现，运行可向工单流式更新进度。这里原生代理集成深度为各类型之最，因此也能部分填补编排器与运行器位置。

- [Linear](https://linear.app/developers/agents)：最贴合代理形态的跟踪器。
- [Jira](https://support.atlassian.com/jira-software-cloud/docs/collaborate-on-work-items-with-ai-agents/)：状态触发代理；适合已使用 Atlassian 的组织。
- [Shortcut](https://www.shortcut.com/help/integrations/using-ai-agents)：指派 story，或在评论中提及代理。
- [YouTrack](https://www.jetbrains.com/youtrack/)：工作流即代码；可自托管。

需核实：代理 API 状态（截至 2026-10，Linear 仍是开发者预览）；原生代理运行如何计量、计价；代理席位成本；代理 webhook 确认时限；哪个套餐解锁面向客户的表单；自托管版本生命周期终止日期。

### 3. 开源开发跟踪器

可在自有基础设施运行的 Linear 风格跟踪器，同时提供云版。数据必须留在内部（隔离网、受监管），或用户希望一边购买一边阅读和修补源码时选择。按状态、标签、自定义属性路由与类型 2 很像；原生代理较新。

- [Plane](https://developers.plane.so/dev-tools/agents/overview)：类似 Linear；每个应用有 bot 用户；代理在评论中回复。
- [Huly](https://github.com/hcengineering/huly-selfhost)：一体化工作区，支持 GitHub 双向同步；运维栈较重。
- [OpenProject](https://www.openproject.org/)：成熟、经典的项目管理。

需核实：代理功能状态（截至 2026-10，Plane 为 beta）；哪个版本提供访客角色和请求表单；许可证；自托管栈的运维成本。

### 4. 通用工作工具

工作管理或文档工具，以数据库或任务列表兼任跟踪器。工厂服务已在此工作的非工程团队，或工单主要是内容、运维、研究而非代码时选择。表单是优势：有链接即可提交工单。路由使用灵活数据库属性，因此每个工厂都自行发明 schema。开发者上下文（差异、PR）位于一次点击之外的 Git 托管平台。仅 SaaS。

- [Notion](https://www.notion.com/help/custom-agents)：数据库作为跟踪器；数据库变更触发代理。
- [Asana](https://asana.com/product/ai/ai-teammates)：AI Teammates 接收指派任务。
- [ClickUp](https://clickup.com/brain/cloud-agents)：Cloud Agents 在任务讨论串中返回 PR。
- [Trello](https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/)：看板与列表；webhook 加 Butler 自动化。

需核实：webhook 延迟和粒度（截至 2026-10，Notion 批量发送内容更新，延迟一两分钟到达）；哪个套餐包含代理。

### 5. 仓库原生跟踪器

工单以文件（JSONL、Markdown）保存在仓库中，代理通过 CLI 或 MCP 服务器编辑，像代码一样合并。一个开发者在本地驱动代理并希望计划进入 Git，或作为真实跟踪器旁的运行工作记忆时选择。推送到 Git 托管平台是唯一触发器，因此编排器需比较文件差异以发现变更。身份沿用 Git 托管平台。外部提交要通过 commit 或 PR，是所有类型中最弱的；因此其他人开始提交工单后，工厂会升级到托管平台内置跟踪器。

- [Beads](https://github.com/steveyegge/beads)：带依赖跟踪的 JSONL，使运行可选择下一个未阻塞工单。
- [Backlog.md](https://github.com/MrLesk/Backlog.md)：Markdown 任务，带 Kanban 视图与 MCP 服务器。

### 6. 自建

工厂自己的应用在自有数据库保存工单，通常与编排器并列。即“自有跟踪器”设计。当跟踪器*就是*产品（内部平台、面向客户的支持工厂），或没有现成模型适配时选择。触发器变成函数调用；下述每个问题涉及的特性都变成需要编写、维护的代码，因此技能更倾向购买。带 webhook 的 [Airtable](https://airtable.com/developers/web/api/webhooks-overview) base 是半自建的折中。

## 进一步研究

用这些问题检查每个候选项。它们决定此位置：

- **触发器**：哪些工单变更（创建、加标签、移动状态、指派、评论、提及）发出编排器可转为运行的 webhook/事件？多快、多细？
- **路由**：运行能读取哪些标签、状态、字段，以判断类型（探索、实现、返工）？
- **讨论串**：人类能在评论中回答代理吗，回复能触发下一次运行吗？
- **身份**：有 API 加 bot 身份吗，让运行以自己身份行动、人类能区分代理与同事？bot 是否占付费席位？
- **原生代理**：工单能直接指派给代理吗？哪些代理、哪个套餐、如何计量？读取指派时的工单，还是整个讨论串？
- **外部提交**：工单来源或客户如何创建工单：表单、邮件、聊天、API？哪个套餐解锁？
- **托管**：仅 SaaS，还是可自托管，适用哪种许可证？

答案在一手来源：API 与 webhook 参考（事件列表、载荷、投递、重试规则）、代理或应用开发文档、定价页面和套餐比较表、变更日志或发行说明。优先这些，而不是博客和比较网站。

按最易过时排序：代理功能及预览/beta 状态、代理计量与积分价格、代理和表单的套餐门槛、限流，以及收购、关闭、自托管版本终止日期。Webhook 事件列表和路由模型变化缓慢。

## 持久的陷阱

依赖某条之前先验证仍成立：

- **GitHub 的 `GITHUB_TOKEN` 陷阱**：默认 `GITHUB_TOKEN` 所做变更不触发新工作流运行。通过为工单加标签或评论来触发下一次运行时，须使用 GitHub App 令牌。
- **指派时上下文**：某些原生代理只在被指派时读取工单，因此后续上下文要放到 PR。
- **代理 webhook 要求快速确认**：编排器立即确认，随后再启动运行。
- **通用工作工具的批量 webhook**到达较晚；需要及时运行的工厂应由属性变更触发，或选择其他类型。
