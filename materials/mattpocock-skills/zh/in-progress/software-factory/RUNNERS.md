# 运行器

> 调研于 2026-10，不保证仍然最新。用它建立方向感，再自行研究当前选项：产品、价格、限制和测试版变化很快。

运行器是**一次性的**：每次运行从全新机器开始，结束后不留下任何东西。五种类型可填补这个位置，主要区别在于谁拥有代理循环、谁拥有机器：

| 类型 | 代理循环 | 机器 | 同时覆盖 |
| --- | --- | --- | --- |
| CI 运行器 | 你的，在 CI 作业内 | CI 厂商的，或你的 | 编排器、可观测性平台 |
| MicroVM API | 你的，在编排器或运行器上 | 提供方的 | 无 |
| 捆绑代理平台 | 厂商的 | 厂商的 | 部分编排器、可观测性平台 |
| 自备 worker | 厂商的 | 你的 | 部分编排器、可观测性平台 |
| 自有 VPS 或容器 | 你的 | 你的 | 无 |

运行器按每次运行选择：审查运行用廉价 CI 运行器，实现运行用 microVM，是正常设计。

## CI 运行器

每个 CI 作业使用全新 VM 或 pod，由 Git 托管平台自己的工作流引擎启动；代理 CLI 是作业中的一步。编排器通过工作流触发器（issue、PR、日程、手动派发）启动运行，并发组防止两次运行处理同一工单。托管运行器天然是一次性的；自托管运行器通过临时模式实现：每个作业一个 pod，结束后删除。按分钟计费。

**何时选择**：Git 托管平台是 GitHub 或 GitLab，所有触发器都来自托管平台事件或时钟：工作流文件就是编排器，运行页面就是可观测性平台，一个产品填补三个位置。

起点：
- [GitHub Actions](https://docs.github.com/en/actions/reference/limits)：全 GitHub 工厂的默认选择；[定价](https://docs.github.com/en/billing/reference/actions-runner-pricing)。
- [Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions)：将 Claude Code 作为工作流步骤。
- [GitLab 托管运行器](https://docs.gitlab.com/ci/runners/hosted_runners/linux/)：每个作业一个临时 VM。
- [Actions Runner Controller](https://docs.github.com/en/actions/concepts/runners/actions-runner-controller)：自托管，在用户 Kubernetes 上每作业一个临时 pod。

## MicroVM API

一次 SDK 调用约一秒创建一个隔离 microVM（厂商称“沙箱”）；编排器在其中执行命令或启动代理 CLI。按 vCPU 与内存使用秒数计费。编排器每次运行创建一个，结束时销毁，并设超时兜底。提供方也销售持久化（暂停/恢复、快照、磁盘）；工厂将其用作缓存，运行间记忆保存在工单跟踪器、Git 托管平台和编排器中。

**何时选择**：工厂已有自己的编排器（服务器、队列），希望大量短期并行运行而无需管理机器。比较最长运行时间、并发上限，以及等待模型的时间是否收费：截至 2026-10，Vercel 仅按活跃 CPU 计费，因此在那里等待模型几乎免费。

起点：[E2B](https://e2b.dev/pricing)、[Daytona](https://www.daytona.io/pricing)、[Modal Sandboxes](https://modal.com/docs/guide/sandboxes)、[Vercel Sandbox](https://vercel.com/docs/vercel-sandbox/pricing)。

## 捆绑代理平台

自带运行器的托管编码代理：厂商每次运行配置全新 VM 或容器，在其中运行自己的代理循环，推送分支或 PR。只有分支保留下来。运行可由 Git 托管平台或工单跟踪器中的 @ 提及、指派、聊天消息、日程或 HTTP 调用启动，因此平台覆盖编排器的大部分；其会话记录视图覆盖可观测性平台。费用包含在席位或订阅中，或按运行计费。

**何时选择**：用户希望活动部件最少，并接受该厂商代理。确认触发器覆盖用户的工单跟踪器。

起点：
- [Claude Code cloud](https://code.claude.com/docs/en/claude-code-on-the-web)，带[定时任务](https://code.claude.com/docs/en/routines)，支持 cron、API、GitHub 事件触发。
- [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview)：API 优先；针对环境创建运行并流式接收事件。
- [Codex cloud](https://developers.openai.com/codex/cloud)：每个任务一个容器。
- [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)：将 issue 指派给 Copilot；其运行器是 GitHub Actions 运行器。

## 自备 worker

捆绑平台保留自己的代理循环和运行队列，但工具调用在用户托管的 worker 上执行。worker 主动向外轮询厂商，认领运行，执行后退出：形状与自托管 CI 运行器相同。一次性由用户保障：将 worker 放到 Kubernetes 或 microVM API 下，让每次运行获得全新磁盘。费用为厂商席位/用量加用户自己的机器。

**何时选择**：用户希望使用捆绑代理，但运行必须访问私网、数据留在用户机器上，或使用定制硬件。

起点：[Claude Code 自托管环境](https://code.claude.com/docs/en/self-hosted-environments)、[Cursor 自托管池](https://cursor.com/docs/cloud-agent/self-hosted-pool)、[ARC 上的 Copilot coding agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)。

## 自有 VPS 或容器

用户租用或自行运行的机器，每次运行创建全新容器（或机器）：机器可能存活数月，容器只存活一次运行。最长运行时间由编排器设定的截止时间决定。通过 `docker run --rm`、带 `ttlSecondsAfterFinished: 0` 的 Kubernetes Job，或结束时销毁机器实现一次性；所有缓存都放在下一次运行视为可选的路径。按月固定或按运行秒数计费。

**何时选择**：运行时间长、稳定或负载重，每小时成本占主导，或已经有服务器托管编排器。

起点：[Fly Machines](https://docs.fly.io/machines/overview)（[定价](https://docs.fly.io/about/pricing)）、[Hetzner Cloud](https://www.hetzner.com/cloud/) 加 Docker、[Kubernetes Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/)。

## 进一步研究

### 决定此位置的问题

结合工厂实际运行，用以下问题检查每个候选项：

1. **编排器如何启动一次运行？** 工作流触发器、SDK 调用、@ 提及、HTTP 调用，或 worker 认领的厂商队列。是否适配设计已有的编排器？
2. **最长运行时间与并发上限是多少？** 找到各套餐的默认超时、最大值，以及达到上限后的行为。与设计中最长运行和最繁忙突发量比较。
3. **费用结构是什么？** 按分钟、vCPU 与内存秒数、仅活跃 CPU、按运行、按席位，还是按月固定。等待模型是否收费？模型 token 包含在价格内还是另算？
4. **如何实现一次性？** 默认全新、临时标志，还是编排器自行拆除。有哪些持久化功能，设计能否仅将它们用于缓存？
5. **运行能访问什么？** 私网访问、出站防火墙或允许名单、密钥如何到达运行器，以及还有谁能读取它们。
6. **还覆盖哪些位置？** 将它读取的触发器计为编排器覆盖，将运行页面或会话记录计为可观测性平台覆盖。

### 答案位置

- 优先看厂商的**限制/配额页面**和**定价页面**，而不是宣传首页。
- 创建调用的 **SDK 或 API 参考**：超时、生命周期和网络参数。
- **安全或网络文档**：防火墙、允许名单、密钥处理。
- **变更日志或发行说明**：beta、预览、GA 状态，以及套餐门槛（Team、Enterprise）。
- 对 CI 运行器，查看 Git 托管平台的**计费文档**。

### 最易过时的内容

- **价格与免费额度。** 截至 2026-10，GitHub 曾宣布对自托管运行器按分钟收费，之后推迟。
- **Beta、预览和抢先体验状态**，以及哪些套餐解锁功能。截止 2026-10，Claude Managed Agents 和 Claude Code 自托管环境都处于 beta。
- 各档**默认超时与最长运行时间**。
- 捆绑平台的**触发器集成**：哪些工单跟踪器、聊天工具能启动运行。
- **启动时间**是厂商声明；如果重要，就实测。

上述类型特征（谁拥有循环、谁拥有机器、覆盖哪些位置）变化缓慢；比起此处任何数字，更应相信这些特征。
