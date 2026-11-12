# 来源调查手册

why 技能为每个可用证据类别启动一位调查者，每位只阅读下面对应来源的一个手册。手册提供常见 MCP 的具体实例。使用同类别的其他 MCP 时进行适配。

| 类别 | 手册 | 文档中的 MCP 示例 |
|---|---|---|
| 版本控制历史 | [`code-archaeology.md`](./sources/code-archaeology.md) | git、`gh` |
| 问题／工单系统 | [`linear.md`](./sources/linear.md) | Linear（适配 Jira、GitHub Issues、Plane、Shortcut） |
| 长篇文档 | [`notion.md`](./sources/notion.md) | Notion（适配 Confluence、Google Docs、Coda） |
| 团队即时聊天 | [`slack.md`](./sources/slack.md) | Slack（适配 Discord、Microsoft Teams、Mattermost） |
| 基础设施可观测性 | [`datadog.md`](./sources/datadog.md) | Datadog（适配 New Relic、Honeycomb、Grafana、Splunk） |
| 错误／异常追踪 | [`sentry.md`](./sources/sentry.md) | Sentry（适配 Rollbar、Bugsnag、Airbrake） |
| 产品分析仓库 | [`databricks.md`](./sources/databricks.md) | Databricks SQL（适配 Snowflake、BigQuery、ClickHouse、dbt） |

跨类别补充：

- [`incident-postmortem.md`](./sources/incident-postmortem.md)。当目标代码看起来具有防御性时加入（空值检查、重试、超时、限流、功能开关、出站访问保护、OOM 处理器）。
