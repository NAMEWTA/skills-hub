---
name: "sentry"
description: "当用户要求检查 Sentry 问题或事件、总结近期生产错误，或通过 Sentry CLI 获取基本健康数据时使用；使用 `sentry` 命令执行只读查询。"
---

# Sentry（只读可观测性）

## 快速开始

- 如果尚未认证，请用户运行 `sentry auth login`，或将 `SENTRY_AUTH_TOKEN` 设置为环境变量。
- CLI 会根据 `.env` 文件、源码、默认配置和目录名中的 DSN 自动检测组织/项目。只有自动检测失败或选错目标时，才指定 `<org>/<project>`。
- 默认值：时间范围 `24h`、环境 `production`、数量上限 20。
- 程序处理输出时始终使用 `--json`。使用 `--json --fields` 选择特定字段并减少输出量。
- 使用 `sentry schema <resource>` 快速发现 API 端点。

如果没有安装 CLI，向用户提供这些步骤：

1. 安装 Sentry CLI：`curl https://cli.sentry.dev/install -fsS | bash`
2. 认证：`sentry auth login`
3. 确认认证状态：`sentry auth status`

- 不要让用户把完整 token 粘贴到聊天中。请他们在本地设置，准备好后确认。

## 核心任务（使用 Sentry CLI）

所有查询都使用 `sentry` CLI。它自动处理认证、组织/项目检测、分页与重试。使用 `--json` 获得机器可读输出。

### 1）列出问题（按最近时间排序）

```bash
sentry issue list \
  --query "is:unresolved environment:production" \
  --period 24h \
  --limit 20 \
  --json --fields shortId,title,priority,level,status
```

如果自动检测无法确定组织/项目，显式传入：

```bash
sentry issue list {your-org}/{your-project} \
  --query "is:unresolved environment:production" \
  --period 24h \
  --limit 20 \
  --json
```

### 2）把问题短 ID 解析为问题详情

```bash
sentry issue view {ABC-123} --json
```

使用短 ID 格式（例如 `ABC-123`），不要使用数字 ID。

### 3）问题详情

```bash
sentry issue view {ABC-123}
```

### 4）问题事件

```bash
sentry issue events {ABC-123} --limit 20 --json
```

### 5）事件详情

```bash
sentry event view {your-org}/{your-project}/{event_id} --json
```

### 6）AI 辅助根因分析

```bash
sentry issue explain {ABC-123}
```

### 7）AI 辅助修复计划

```bash
sentry issue plan {ABC-123}
```

## 后备方式：任意 API 访问

对于专用 CLI 命令没有覆盖的端点，使用 `sentry api`：

```bash
sentry api /api/0/organizations/{your-org}/ --method GET
```

使用 `sentry schema` 发现可用的 API 端点：

```bash
sentry schema issues
```

## 输入与默认值

- `org_slug`、`project_slug`：CLI 根据 DSN、环境变量和目录名自动检测。自动检测失败时，使用位置参数 `{your-org}/{your-project}` 覆盖。
- `time_range`：默认 `24h`（通过 `--period 24h` 传入）。
- `environment`：默认 `prod`（作为 `--query` 的一部分传入，例如 `environment:production`）。
- `limit`：默认 20（通过 `--limit` 传入）。
- `search_query`：可选 `--query` 参数，使用 Sentry 搜索语法，例如 `is:unresolved`、`assigned:me`。
- `issue_short_id`：直接用于 `sentry issue view`。

## 输出格式规则

- 问题列表：显示 title、short_id、status、first_seen、last_seen、count、environments、top_tags；按最近时间排序。
- 事件详情：包含 culprit、timestamp、environment、release、url。
- 没有结果时明确说明。
- 输出中的个人信息（电子邮件、IP）须脱敏。不要输出原始堆栈跟踪。
- 不要回显认证 token。

## 标准测试输入

- 组织：`{your-org}`
- 项目：`{your-project}`
- 问题短 ID：`{ABC-123}`

示例提示：“列出过去 24 小时 prod 中前 10 个未关闭的问题。”
预期：按顺序列出标题、短 ID、数量与最后出现时间。
