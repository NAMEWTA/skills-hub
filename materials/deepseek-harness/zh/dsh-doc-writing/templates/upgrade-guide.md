# 模板：upgrade-guide

用于 `docs/upgrade-guide/v<version>/<item>/guide.md` 及中文对应文件 `guide.zh.md`；后者的章节是 `## 变更` 与 `## 迁移`。该树没有目录索引。[dsh-create-upgrade-guide](../../dsh-create-upgrade-guide/SKILL.md)负责范围、位置、维护及长度规则；`pnpm run verify-upgrade-guides` 强制检查。

## Frontmatter

```yaml
---
kind: upgrade-guide
description: "发生破坏的外部可感知接口，以及替代它的内容。"
---
```

## 骨架

````markdown
# <具体破坏，例如：`--profile` 取代 `--preset`>

English | [中文](guide.zh.md)

## Change

陈述接口的旧行为、新行为及哪些人能观察到变化。

## Migration

1. 指明要修改的准确文件、键、命令或符号；前后片段比文字更短时使用片段。
2. 说明如何确认迁移成功。
````
