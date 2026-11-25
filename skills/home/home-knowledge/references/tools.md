# 知识文件工具参考

`scripts/knowledge.mjs` 使用 Node.js 22.14+ 标准库，在明确 Home 根下处理有限 Markdown 文件。运行包自包含，可从实际安装目录调用，不依赖源码仓库或兄弟技能。

## 输入与元数据

每次操作都显式传 `--home`。`--path` 相对 `.agents/home/`，允许 `notes/`、`inbox/`、`archive/notes/` 下非 `index.md` 的 Markdown 正文。`read` 也可读 `exclusions.md`；该文件由 `exclude` 定点追加。工具拒绝路径跳转、根/父目录/文件的链接入口和非普通文件。

正文仍是普通 Markdown。`put` 所需 frontmatter 只有非空 `scope` 和非空字符串列表 `sources`。可用平面字段 `status`、`evidence_kind`、`observed_at`、`verified_at`、`review_after`、`related`、`derived_from`、`title` 和 `summary`；复杂 YAML 不属于工具解析格式，既有文档可继续由 owner 直接维护。

字符串使用 JSON 双引号，列表使用 JSON 字符串数组。字段名用小写字母、数字与下划线。模板中的占位内容必须换成实际来源；不以添加 frontmatter 代替核实内容。

## 命令

以下示例的 `/path/to/home`、输入文件和 SHA-256 要换成本次实际值。命令在 Home 根运行：

```sh
node .agents/skills/home-knowledge/scripts/knowledge.mjs read --home /path/to/home --path notes/project-a.md
node .agents/skills/home-knowledge/scripts/knowledge.mjs put --home /path/to/home --path notes/project-a.md --input /path/to/checked-note.md --expect missing
node .agents/skills/home-knowledge/scripts/knowledge.mjs query --home /path/to/home --text 项目A
node .agents/skills/home-knowledge/scripts/knowledge.mjs index --home /path/to/home
node .agents/skills/home-knowledge/scripts/knowledge.mjs lint --home /path/to/home --today 2026-11-25 --include-archive
```

| 命令 | 行为 |
| --- | --- |
| `read --path PATH` | 返回原文与 `sha256`，不存在明确失败 |
| `put --path PATH --input FILE或- --expect HASH或missing` | 旧文件要求读回 hash，新文件用 missing；锁内检查排除与版本，保存后重建索引 |
| `remove --path PATH --expect HASH` | 删除明确原件并重建索引，不代表完成跨 owner 忘记 |
| `exclude --source-ref ID --scope SCOPE --basis-ref REF --expect HASH或missing` | 维护排除依据，不保存被忘记正文；已有文件先 read |
| `query --text TEXT` | 在正文中查找，不依赖 index；默认查询 notes |
| `index` | 重新生成 `notes/index.md`，不修改事实和排除依据 |
| `lint` | 检查来源标记、重复 id、显式 related 引用、排除残留和复核日期，不判断事实真假 |

`query --area inbox` 查候选，`--area archive` 查归档。notes 默认跳过整篇标为 `retired`、`superseded`、`pending`、`candidate`、`unverified`、`draft` 或对应中文状态的正文。`query --include-inactive` 显式读取这些材料，但 index 始终不将它们列为现行入口。未标 status 的既有文档仍可查，返回 `unspecified`，须人工判断。

查询可传 `--scope` 精确限定、`--limit` 控制返回数；`query`、`index`、`lint` 可传 `--max-files`、`--max-bytes`。默认枚举最多 2000 个正文和 8 MiB，单文件最多 512 KiB；只读查询不会创建目录。查询结果保留状态、证据性质及相关时间，`complete`、`truncated`、`warnings` 描述实际范围。

索引默认预算 6000 Unicode 字符，可用 `--budget` 在 512～50000 字符间调整。排序稳定，超预算明确注明截断。索引未列出与正文不存在是两种结果。

## 错误与恢复

| 结果 | 含义和后续 |
| --- | --- |
| 退出码 `0` | 该命令完成，仍按返回的查询范围或警告限定结论 |
| 退出码 `1` | 参数、路径、owner、来源排除、版本冲突或 IO 失败；读取错误码和 message |
| 退出码 `2`、`status: partial` | 正文已保存或删除，索引待修复；按返回路径核查后重建 |
| `STALE` | 原件变化，重新读取并合并，保留另一写者的修改 |
| `BUSY` | 写锁存在，核实原操作，不能按时间直接清锁 |
| `EXCLUDED` | 来源或派生来源在该范围被排除，回到用户的保留决定 |
| `EXCLUSIONS_FORMAT` | 无法确认排除表，先核对原文，不能当空表继续 |

`sourceCheck: identifiers-only` 只说明检索到来源标识，不证明来源已读取、结论仍有效或用户授权改变。明确文件 `read` 用于维护原件，可能读到已排除内容；不要将维护读取再次带回当前回答或新摘要。

脚本对 `sources` 与 `derived_from` 的精确标识执行排除，不解析外部原件或推断完整来源链。跨文件修改、正文段落的语义合并以及跨 owner 忘记按维护方法执行。
