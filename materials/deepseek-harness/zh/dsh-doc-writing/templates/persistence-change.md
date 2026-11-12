# 模板：persistence-change

用于 `docs/persistence-changes/YYYY-MM-DD-slug.md` 及中文对应文件。目录 README 是索引，不是记录。记录只确认机械检测到的持久化类型变化。生成的同名 JSON 配套文件保留完整的变更后模式，使验证不需要 Git 基线。

## Frontmatter

```yaml
---
description: "此记录解释的持久化类型变化及兼容性决定。"
kind: persistence-change
---
```

## 骨架

生成器填写机器声明、模式配套文件和一致性记录。既定同版本情形之外的结构变化，需要明确的兼容性决定。提供 `--prose` JSON，其中 `en` 与 `zh` 对象各自包含人工编写的 `summary`、`compatibility` 和 `verification` 字符串。Compatibility 解释两个读取方向，Verification 记录实际执行的检查。[操作指南](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/cookbook/reviewing-persistence-type-changes.md)展示具体操作。下方字段使用实际生成的根名称、记录 ID 和摘要。

````markdown
# Persistence change: <具体的持久化变化>

English | [中文](YYYY-MM-DD-slug.zh.md)

## Summary

描述机械检测到的变化及其版本决定。

## Table of Contents

- [声明](#declaration)
- [兼容性](#compatibility)
- [验证](#verification)
- [开发笔记](#dev-note)

<a id="declaration"></a>
## Declaration

```yaml persistence-change
schemaVersion: 1
id: YYYY-MM-DD-slug
baseline: false
changes:
  - root: event:example/message
    previous: YYYY-MM-DD-predecessor
    after: <generated-64-character-sha256-hex>
    decision: same-version
```

<a id="compatibility"></a>
## Compatibility

针对每个检测到的路径解释声明的决定：旧读取器如何保留含义、安全忽略可选数据，或在执行或恢复前拒绝必需功能；新读取器如何保留历史含义并处理混合表示。功能缺失时保留既有行为。版本提升时，链接相邻迁移及其验证负责者。

<a id="verification"></a>
## Verification

记录实际运行的命令及结果。链接支持兼容性解释的聚焦测试或保留证据。

<a id="dev-note"></a>
## Dev Note

无。
````

## 规则

- 恰好保留一个 `yaml persistence-change` 区块。英文与中文区块字节完全一致；校验器解析英文记录一次，再检查对应文件。
- 文件名主干与 `id` 一致。根的 `previous` 标识前驱记录；`null` 表示引入根。`after` 匹配生成的配套模式摘要；`null` 表示删除。
- 一份初始 `baseline: true` 记录覆盖完整清单。常规变更使用 `baseline: false`，保留已接受的前驱。版本提升记录携带自身递增的 `SessionHeader.version` 转换。
- 不仅凭结构差异推断版本提升。需要审查的同版本变更必须明确提供 `--decision same-version`；头版本变化则推断为 `version-bump`。显式决定不能豁免必需的头版本递增。命令不会提供源码变更或验证声明。
- 只解释检测到的持久化类型变化。此类别允许包含转换所需的前后事实及历史证据；纯行为变化不在范围内。
- 创建记录及更新末端记录时，会生成目录双语对与一致性配套文件。审查两种语言，保留生成的配套文件。直接编辑文字仍需重新记录配对；不要手工维护模式节点或摘要。
- 只有未接受的末端记录才显式使用 `--update`。它拒绝基线及已有依赖的记录；`--prose` 替换人工解释，省略则保留。被标记的同版本更新需要显式 `--decision same-version`；对照完整转换重新评估解释。已接受记录应增加后继。
- [目录参考](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/persistence-changes/README.md)负责兼容性规则；[操作指南](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/cookbook/reviewing-persistence-type-changes.md)负责命令及恢复。
