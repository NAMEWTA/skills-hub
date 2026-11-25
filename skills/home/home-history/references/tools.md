# 历史文件工具参考

`scripts/history.mjs` 使用 Node.js 22.14+ 标准库，维护明确 Home 根中的 Markdown 历史。所有脚本资源在本包内；单独安装后仍可调用，缺少其他方法时按准确技能名说明缺项。

## 输入和身份

事件输入包含非空 `scope`、`sources`、`event_key`、`status` 和 `occurred_at`。平面 frontmatter 的字符串使用 JSON 双引号，列表使用 JSON 字符串数组；复杂 YAML 不在工具支持范围。正文说明目标、理由、实际结果和限制。

`event_key` 是原来源事件的稳定身份，与 scope 共同查重；标题不是身份。`id` 可省略，由工具生成；指定时只允许字母、数字、下划线、连字符，最多 101 字符。新文件保存到 `history/YYYY/MM/<id>.md`；事件时间未知时仅用整理年月放置文件，正文仍标 unknown。

`occurred_at` 可为 `YYYY-MM-DD`、带时区偏移的 ISO 时间或 `unknown`。ISO 时间的秒数必填，小数秒可省略或为 1～3 位，使用 Node Date 的毫秒精度；例如 `2026-11-25T15:20:00.123+08:00`。更高精度输入明确拒绝，不静默截断，owner 需决定是否按毫秒精度转换并保留必要的原始来源。`recorded_at` 由首次记录操作生成，修订保留它并增加 `updated_at`。工具不从文件 mtime、目录或整理时间推断事件实际时间。

## 命令

将示例 Home 根和输入文件换成本次实际路径，从 Home 根调用：

```sh
node .agents/skills/home-history/scripts/history.mjs record --home /path/to/home --input /path/to/checked-event.md
node .agents/skills/home-history/scripts/history.mjs query --home /path/to/home --text 项目A
node .agents/skills/home-history/scripts/history.mjs query --home /path/to/home --from 2026-11-01T00:00:00+08:00 --until 2026-11-30T23:59:59.999+08:00
node .agents/skills/home-history/scripts/history.mjs index --home /path/to/home
```

| 命令 | 行为 |
| --- | --- |
| `record --input FILE或-` | 校验来源、事件身份与时间，锁内查重、保存并更新索引 |
| `read --path PATH` | 读取指定 `history/` 或 `archive/history/` 正文及 SHA-256 |
| `update --path PATH --input FILE或- --expect HASH` | 保留事件身份、id 与首次整理时间，旧稿 hash 不匹配时拒绝覆盖 |
| `remove --path PATH --expect HASH` | 删除指定原件并更新索引，不代表跨 owner 忘记全部完成 |
| `query` | 在实际历史正文中按时间、scope 和关键字检索，独立于索引 |
| `index` | 稳定生成 `history/index.md`，不改原件或排除依据 |

查询支持 `--scope`、`--text`、`--limit`、`--from`、`--until`。加 `--include-archive` 才查询归档；有时间过滤时未知时间默认不进入结果，加 `--include-undated` 可保留并显示其未知状态。`from/until` 只有日期时按 UTC 日边界；用户本地日期应换成实际带偏移时间。

确定的事件按实际时间倒序排列，不按时区字符串排序；相同时间按路径稳定排序，未知或无效时间在最后。只有日期的事件按当天起点用于排序，日期过滤按全天重叠处理，不赋予其精确发生时刻。

`query/index` 支持 `--max-files`、`--max-bytes`，默认最多 2000 个正文与 8 MiB。索引预算默认 6000 Unicode 字符，可用 `--budget` 调整至 512～50000。单文件最多 512 KiB。身份查重另读取 history 和 archive/history，最多 10000 个正文与 32 MiB，读取未完成或元数据无法解析时停止新增，不能宣称去重完成。

既有纯 Markdown 可以参与正文检索；缺少时间或身份明确显示 unknown。`unidentifiedRecords` 说明新增前读到了多少无事件身份记录，不能证明这些记录与新事件无关。

## 排除、并发与失败

工具读取 knowledge 维护的 `exclusions.md`，匹配 `sources` 与 `derived_from` 的准确标识及范围，不修改排除文件。历史有被排除的来源时停止重导和默认返回，索引也不展示。定点 `read` 供维护使用，不应把被排除原文重新写入答案或新摘要。

knowledge 与 history 共用 Home 的 `.home-content-write.lock`。写入在同一锁内查原件、版本、排除和身份，正文使用可读回的单文件替换；不提供跨 owner 全局事务或对非配合编辑器的互斥保证。`STALE` 时重读合并，`BUSY` 时核实原写者，不能按年龄自动删锁。

| 返回 | 含义 |
| --- | --- |
| 退出码 `0` | 本命令完成，仍需按范围、来源与 warning 限定结论 |
| `status: unchanged` | 同身份且有效负载相同，未新建重复事件 |
| 退出码 `1` | 参数、路径、身份、排除、并发或 IO 错误 |
| `EVENT_EXISTS` | 同事件内容不同，先 read 再用 update 修订 |
| `ID_EXISTS`、`IDENTITY_CONFLICT` | 已有 ID 或多份相同事件，保留原件交 owner 核查 |
| `INCOMPLETE` | 去重范围未读完或无法解析，不能安全新增 |
| 退出码 `2`、`status: partial` | 正文已保存或删除，索引待修；保留正文并修复导航 |

查询返回实际发生时间、整理时间、状态、来源、检索范围与截断信息。它没有核验服务、部署或会话状态；摘要更不会因为命令退出成功而变成验收通过。
