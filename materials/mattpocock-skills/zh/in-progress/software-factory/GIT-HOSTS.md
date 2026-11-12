# Git 托管平台

> 调研于 2026-10，不保证仍然最新。用它建立方向感，再自行研究当前选项：产品、价格、限制和测试版变化很快。

## 类型

### 一体化平台

Git 托管平台捆绑工单跟踪器、作为编排器的 CI 系统和托管运行器，共享同一事件流和权限模型。一个产品填补 Git 托管平台、工单跟踪器、编排器和运行器的位置，其 CI 运行页面通常也覆盖可观测性平台。每个 PR、审查、标签、检查事件同时是 webhook 和原生触发器，因此这一类型的触发器目录最丰富。

**何时选择**：工厂规模较小、代码已经托管在此，或用户希望只有一张账单、一次登录。这是 [SKILL.md](SKILL.md) 中的“全部使用 GitHub”设计。厂商还推出自己的代理，它们可能与用户的运行竞争，也可能作为其中一种接入。

- [GitHub](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)：默认选择；Issues、Actions、Apps 和最大的集成生态。
- [GitLab](https://about.gitlab.com/pricing/)：问题、合并请求、CI/CD、运行器集于一体，可用 SaaS 或自行管理。

### 套件式 Git 托管平台

作为更大套件中的一个模块销售，工单跟踪器是通过链接与 webhook 连接的兄弟产品（Jira、Azure Boards）。跟踪器事件来自第二条事件流，因此编排器需要汇合两个事件源。

**何时选择**：组织已经使用该套件，人类主要在 Jira 或 Azure Boards 中工作。工厂继承该跟踪器作为面向人类的接口。

- [Bitbucket Cloud](https://support.atlassian.com/bitbucket-cloud/docs/api-request-limits/)：Atlassian 的 Git 托管平台，配合 Jira 和 Bitbucket Pipelines。
- [Azure DevOps (Azure Repos)](https://learn.microsoft.com/en-us/azure/devops/integrate/concepts/rate-limits)：同一组织内提供 Repos、Boards、Pipelines 和 Entra 身份，因此填补全部四个位置。
- [AWS CodeCommit](https://aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/)：带 IAM 身份的纯 Git 托管平台；搭配外部跟踪器与 CI。

### 自托管 Git 托管平台

用户在自己的基础设施上运行，通常与编排器和运行器在同一网络。运维者设置限流，因此上限由硬件决定。用户负责其覆盖的每个位置的升级、备份和可用性。

**何时选择**：代码必须留在本地或隔离网、用户希望免除按席位费用，或 SaaS API 预算限制繁忙工厂。Forgejo、Gitea 适合小团队，捆绑问题和兼容 GitHub Actions 的 CI；GitLab 自管版和 GitHub Enterprise Server 适合组织，保留其 Apps 和服务账户。

- [Forgejo](https://forgejo.org/2026-10-release-v17-0/)：社区治理、轻量，带 Forgejo Actions。
- [Gitea](https://about.gitea.com/)：轻量，带 Gitea Actions；也销售托管版。
- [GitLab self-managed](https://about.gitlab.com/install/) 和 [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@latest)：在用户自己的基础设施上运行完整平台。

### 审查优先与去中心化 Git 托管平台

审查模型不同于分支加 PR：按提交的补丁集配合标签投票，或仓库在用户运行的节点间联邦互联。大多数工厂工具假定使用 PR，因此要预期自行构建更多胶合逻辑。在 Gerrit 中，自动检查运行由 bot 账户投 `Verified` 票，人类投 `Code-Review` 票。

**何时选择**：用户团队已经按这种方式审查，或更看重联邦互联而非生态。

- [Gerrit](https://www.gerritcodereview.com/)：以标签投票审查补丁集；Android 和 Chromium 使用的模式。
- [Tangled](https://blog.tangled.org/ci/)：基于 AT Protocol 的 Git 托管，支持堆叠 PR 和自有 CI 运行器。

### 代理原生 Git 托管平台

围绕代理作为主要作者构建的新平台：高提交吞吐、用服务端读取代替克隆、逐代理归因。整个类型尚处早期（截至 2026-10），门禁与限流可能未公开：询问厂商。

**何时选择**：工厂针对一个大型仓库开展大量并发运行，克隆时间或 API 限制占主导。在单个仓库的镜像上试点，保留 GitHub 作为回退。

- [Cursor Origin](https://cursor.com/origin)：来自 Graphite 团队，支持 GitHub 同步，以及签名的 PR、审查和推送 webhook。
- [GitLab next-gen SCM](https://about.gitlab.com/blog/gitlab-next-gen-scm/)：重构后的 GitLab 后端，提供无需克隆的代理 API。

### 运行用 Git 存储

无界面、API 优先、可成千创建的 Git 仓库：有分支、提交、差异，没有 PR、审查或门禁。它们只填补一半的位置，每次运行签发短期逐仓库令牌。

**何时选择**：运行需要廉价的逐次临时仓库或 fork（每张工单一个 fork、代理的工作状态），而最终 PR 仍提交到上述完整 Git 托管平台。

- [Cloudflare Artifacts](https://www.cloudflare.com/product/artifacts/)：Workers 上兼容 Git 的存储；为每个任务 fork 基线。
- [Pierre code.storage](https://code.storage/docs)：白标 Git API，支持临时分支。

## 进一步研究

用以下问题检查每个候选项：

1. **触发器**：哪些事件（打开 PR、推送、提交审查、加标签、检查结束）会经 webhook 到达编排器，投递是否签名？
2. **身份**：运行能否使用专用 bot 或 app 身份？这让运行可归因，使自动审查运行能批准另一身份创建的 PR，并决定运行自身的推送会不会触发下一次运行。
3. **门禁**：用户套餐与仓库可见性下，是否支持必需检查、必需批准、分支保护，bot 能否加入绕过名单？
4. **限流**：每个运行器上的每次运行共用什么 API 预算，按什么单位（安装、令牌、用户、工作区）计量，如何扩展？
5. **覆盖位置**：同一产品覆盖工单跟踪器、编排器、运行器、可观测性平台中的哪些？

从一手来源找答案：REST API 与 webhook 参考、限流页面、定价和套餐比较页面、访问令牌或 app 文档，以及变更日志或发行说明。

最易过时的是：beta 和预览状态（整个代理原生和 Git 存储类型）、限流数字、哪些套餐解锁门禁，以及收购、关闭、重新开放后的可用性。例如截至 2026-10，AWS CodeCommit 已重新向新客户开放，Bitbucket Data Center 仅以与 Cloud 搭配的混合许可证形式销售。

## 持久的陷阱

设计依赖其中某条之前，先验证它仍成立。

- **GitHub `GITHUB_TOKEN` 会终止链条。** Actions 内置令牌引发的事件不会启动新工作流运行（`workflow_dispatch` 和 `repository_dispatch` 除外），因此使用它推送会悄然停止下一次运行。从第一天起就给运行配置 GitHub App 身份。
- **门禁常需付费套餐。** 截至 2026-10，GitHub 私有仓库 ruleset 需要 Pro、Team 或 Enterprise；GitLab 审批规则需要 Premium；强制 Bitbucket 合并检查需要 Premium。
- **限流按身份计算，bot 类型影响额度。** 截至 2026-10，GitHub App 安装每小时 5,000 请求，`GITHUB_TOKEN` 为 1,000；Bitbucket 用户令牌维持基础速率，访问令牌则可扩展；Azure DevOps 按访问级别提高 bot 预算。
- **套件跟踪器意味着两条事件流。** 编排器自行汇合 Git 托管平台与工单跟踪器事件。
