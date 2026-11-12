# 可观测性平台

> 调研于 2026-10，不保证仍然最新。用它建立方向感，再自行研究当前选项：产品、价格、限制和测试版变化很快。

用于选择可观测性平台，或有意决定不使用。各类型按**人类需要看到运行内部的什么**区分：日志、代理追踪（每个模型调用和工具调用各为一个 span），或把追踪与用户系统其他部分关联起来。自托管与 SaaS 的区分横跨最后三类。当运行应依据平台看到的内容采取行动时，把平台设为工单来源：监控器提交工单，运行读取它。

## 运行器如何接入

每类都通过五种钩子之一接收数据。填补此位置时，在产品旁注明钩子。

- **宿主 OTel**：代理宿主自行导出 OpenTelemetry。Claude Code 和 Claude Agent SDK 使用 `CLAUDE_CODE_ENABLE_TELEMETRY=1` 加 `OTEL_*` 变量，提示与工具输出需要主动启用；Codex CLI 使用 `config.toml` 中的 `[otel]` 块。（[Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/observability)、[Claude Code](https://code.claude.com/docs/en/monitoring-usage)、[Codex 配置](https://developers.openai.com/codex/config-advanced)）
- **平台推送**：模型平台替你发送追踪，例如 Claude Managed Agents 向 Claude Console 配置的 OTLP 目标推送。（[Claude 文档](https://platform.claude.com/docs/en/manage-claude/opentelemetry/api)）
- **SDK 包装器**：运行器代码中加一次调用，例如 LangSmith 的 `configure_claude_agent_sdk()`。
- **Hook 插件**：Claude Code hook 在每次 Stop 读取会话记录并发送，例如 Langfuse 的 Claude Code 插件。
- **网关**：运行器的模型 base URL 指向日志代理。运行器无需代码修改，但只能看到模型调用：宿主内部的工具调用不可见。

OpenTelemetry 是通用传输方式：宿主 OTel 和平台推送都可进入任何 OTLP 后端。GenAI 语义约定（`invoke_agent`、`chat`、`execute_tool` span）仍在稳定过程中，应预期 span 名称变化。（[OTel GenAI agent spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans)）

## 类型 1：无（运行器或编排器产品已经展示足够信息）

**是什么**：人类直接在运行器或编排器已有位置查看各次运行：CI 运行页面、沙箱控制台、保存为运行产物的代理记录。无需构建钩子，自托管程度与运行器相同，费用已包含。

**工厂何时选择**：每天少量运行、一个人查看，问题是“失败了吗，打印了什么？”大多数工厂从这里起步；需要跨运行搜索、逐运行 token/费用汇总，或超出运行器保留时间时，再升级。

**起点**：[GitHub Actions 运行日志](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization)、[E2B 沙箱日志与指标](https://e2b.dev/docs)、[Daytona 沙箱遥测](https://www.daytona.io/docs/en/observability/otel-collection/)、[OpenAI Agents SDK 追踪](https://openai.github.io/openai-agents-python/tracing/)。沙箱产品通常也能通过 OTLP 转发同一数据，这就是通往类型 2 的路径。

**核实**：各运行器产品的保留天数；有些沙箱保留很短（Daytona：截至 2026-10 为 3 天）。

## 类型 2：LLM 与代理追踪平台

**是什么**：围绕代理追踪构建的后端：每次运行是一棵模型调用与工具调用树，附带 token 费用、提示和会话，通常还提供评估与数据集。

**工厂何时选择**：人类想跨大量运行回答“代理为什么这样做？”；回顾运行或人类需要比较运行；token 支出需逐运行汇总。自托管开源产品能让会话记录留在内部。

**类型特征**：接收宿主 OTel、SDK 包装器或 hook 插件，通常也支持平台推送。按数据量计费；代理运行的 span 很多（每次工具调用一个），因此按运行而非请求估算预算。

**起点**：[Langfuse](https://langfuse.com/pricing) 和 [Arize Phoenix](https://phoenix.arize.com)（开源、可自托管）、[LangSmith](https://www.langchain.com/pricing-langsmith)、[Braintrust](https://www.braintrust.dev/pricing)。

**核实**：免费层限制、计费单位（trace、span、unit 或 GB；Braintrust 于 2026-03 改为 GB）、哪一档允许自托管，以及当前所有权。

## 类型 3：通用 APM 和日志后端

**是什么**：用户现有的可观测性技术栈（各服务的日志、指标、分布式追踪），另加代理或 LLM 视图。

**工厂何时选择**：团队已经付费使用；运行需与应用自身追踪关联（Agent SDK 传播 `TRACEPARENT`，使运行嵌套在调用方追踪内）；或监控器工单来源已从此读取。

**类型特征**：宿主 OTel 直接进入厂商 OTLP 端点。按 GB、事件或主机计费，因此工厂数据量对已有账单可能只是零头，对新账单却可能是意外。

**起点**：[Datadog Agent Observability](https://www.datadoghq.com/product/llm-observability/)、[Grafana Cloud](https://grafana.com/pricing/)、[Honeycomb](https://www.honeycomb.io/pricing)、[SigNoz](https://signoz.io/pricing/)（开源）。

**核实**：代理视图是 GA 还是预览，哪些宿主有配置指南，以及免费层额度。

## 类型 4：带请求日志的 LLM 网关

**是什么**：运行器与模型提供方之间的代理，记录每次请求与响应，同时提供路由、密钥、预算与缓存。

**工厂何时选择**：用户希望为各次运行设置支出上限，或为多个运行器提供统一密钥库，而日志随之附带；或宿主没有自己的导出功能。它只看到模型调用，因此需搭配类型 2 或 3 查看工具调用。

**起点**：[LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/logging)（开源，可向 Langfuse 或 OTel 转发日志）、[Portkey](https://portkey.ai/pricing)。

**核实**：SaaS 的逐请求价格，以及产品是否仍在积极开发（截至 2026-10，Helicone 在被收购后进入维护模式）。

## 进一步研究

用决定此位置的下列问题检查每个候选项：

1. **运行器或编排器是否已经展示足够信息？** 比较人类需求（跨运行搜索、逐运行费用、保留时间）与运行页面或沙箱控制台提供的能力。如果是，就有意选择无。
2. **代理宿主如何导出追踪？** 确定宿主支持哪种钩子，再确定产品接收哪种。确认工具调用会作为 span 到达，以及提示和工具输出是否需要主动启用。
3. **可否自托管？** 许可证、允许自托管的套餐，以及运行条件。会话记录必须留在内部时，这至关重要。
4. **费用结构是什么？** 计费单位、免费层，以及按每次工具调用一个 span 估算的每次运行费用，再乘每天运行次数。
5. **保留多久？** 各档保留天数，与运行出错后人类需要回看多远比较。

**答案位置**：厂商定价页面（单位、档位、保留时间）；厂商针对具体宿主的集成文档；宿主自己的监控文档（导出什么、哪些标志是 beta）；OpenTelemetry GenAI 语义约定；产品仓库的许可证与发布活动；厂商变更日志或博客中的所有权变更。

**最易过时的内容**：免费层限制和价格；beta 与预览标志（Claude Code 追踪导出、Console 平台推送、厂商代理视图）；所有权与维护状态；计费单位；保留天数；GenAI span 名称。
