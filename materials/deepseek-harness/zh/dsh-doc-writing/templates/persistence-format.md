# 模板：persistence-format

用于 `docs/persistence-changes/historical-formats/vN.md` 及中文对应文件。每份记录描述一个明确选定的历史 Session 格式检查点，具有完整声明类型。它是格式参考，不是发布记录或兼容性确认。当前检出的写入器使用已有的当前目录。

## Frontmatter

```yaml
---
description: "此处记录的历史 Session 格式、来源检查点与持久化类型。"
kind: persistence-format
---
```

## 章节

1. **概要：** 指明格式及其有区别的持久化字段。
2. **目录：** 使用双语共享锚点链接后续章节。
3. **来源证据：** 指明标签或 PR，并提供足够上下文以选择来源树。不能把 PR 的中间树呈现为最终合并或产品发布。历史来源使用无行号的文件路径，除非链接到准确来源，否则保持纯文本。
4. **格式特征：** 解释头、事件及物理编码区别；声明类型清单之外的行为链接到编解码器负责者。
5. **声明：** 每种语言包含一个完全相同的 `yaml persistence-format` 区块，含 `schemaVersion: 1`、数字 `sessionFormatVersion`，`source` 恰好包含一个 `tag` 或数字 `pullRequest`，`roots` 将每个根键映射到捕获的 SHA-256 摘要。链接同目录 `vN.schema.json`。
6. **完整模式：** 保留一个 `persistence-format-schema:start` / `persistence-format-schema:end` 注释区域。格式校验器在这里渲染根摘要及所有可达定义。
7. **验证与限制：** 陈述实际提取证据、覆盖限制及离线校验器。保留历史可选字段和不透明声明，不声称编解码器会接纳，也不声称迁移安全。
8. **开发笔记：** 留作非权威工作上下文，或写 `None.`。

[格式索引](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/persistence-changes/historical-formats/README.md)负责覆盖与维护。`pnpm run verify-persistence-formats --write` 先验证模式，再刷新生成区域与配对记录。它不能创造历史证据或修复机器数据。当前写入器版本前进时，继续记录每个较旧整数版本；不要用历史文件名复制当前目录。
