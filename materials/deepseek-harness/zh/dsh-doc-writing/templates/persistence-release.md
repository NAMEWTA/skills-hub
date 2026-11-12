# 模板：persistence-release

用于 `docs/persistence-changes/releases/dsh-v<version>.md` 及中文对应文件。这些记录重建标签版本的持久化类型，供人比较及格式验证。它们是观察记录，不是兼容性确认，不参与当前源码历史。

## Frontmatter

```yaml
---
description: "此处记录的标签版本持久化类型及相邻发布差异。"
kind: persistence-release
---
```

## 章节

1. **概要：** 解释与上一可用标签的具体类型差异，或说明没有差异；相关时陈述 Session 写入器版本。
2. **目录：** 用双语共享锚点链接后续章节。
3. **发布证据：** 指明来源标签及该标签的源码路径，再以相对路径链接前一记录及模式配套文件。指出重建限制。
4. **声明：** 恰好包含一个 `yaml persistence-release` 区块，具有 `schemaVersion: 1`、`tag`、`previous`、`sessionFormatVersion` 和 `changes`。每项变化指明 `root`、`before` 与 `after`；null 表示不存在。两种语言包含相同机器区块。
5. **结构变化：** 列出机械检测到的路径及类别。按当前规则作出的分类仅供参考，不证明历史发布安全，也不暗示观察到的写入器版本递增。
6. **验证：** 陈述实际执行的重建与验证证据。`pnpm run verify-persistence-releases` 不需要源码检出、Git 或网络，即可验证已提交档案。
7. **开发笔记：** 保留作非权威工作上下文，或写 `None.`。

## 快照与历史规则

[档案参考](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/persistence-changes/releases/README.md)负责固定发布清单与提取限制。首份记录包含每个提取的根；后续模式配套文件只含发生变化且仍存在的根，以及它们所有可达的类型定义。没有类型变化的发布，也通过空变化及快照保留。每份记录引用清单中的紧邻前一条目。

索引表、清单单元格及结构变化事实使用 `persistence-release-index`、`persistence-release-inventory` 和 `persistence-release-changes` 起止注释标记。人工解释不放进这些生成区域。`pnpm run verify-persistence-releases --write` 验证所有机器数据后，才刷新事实区域与配对记录；保留人工文字、机器声明及模式文件。默认验证拒绝过期的生成事实及缺失的固定索引文件。

完整保留源 `number` 声明与历史可选字段。另行报告实际写入器版本常量。历史解析允许表面事件具有可选 `surfaceOp`；在线持久化解析器与确认规则仍保持严格。绝不将这些回溯记录插入当前源码确认链，也不为适应旧发布而改写已提交基线。
