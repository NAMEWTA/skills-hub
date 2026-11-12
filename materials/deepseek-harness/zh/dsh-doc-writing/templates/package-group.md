# 模板：package-group

用于 `packages/README.md` 及每份 `packages/<group>/README.md`。页面是一张地图：介绍能力家族，为直接包含的包逐项列出一行职责，并链接包自己负责的细节。绝不重述包的约定。

## Frontmatter

```yaml
---
description: "<group> 包组：packages/<group>/ 下各包负责什么，面向选择或导航此家族的读者。"
kind: "package-group"
---
```

## 骨架

```markdown
# <group>/ — <一行主题>

English | [中文](README.zh.md)

## Summary

三到五句话，按 `wc -w` 方式计数最多 100 词：这个家族提供什么、读者能用它做什么、哪个包负责哪部分，以及主要限制。应用[概要语气规则](../SKILL.md#voice-rules)。

## Table of Contents

- [包](#packages)
- [相关文档](#related-documentation)
- [开发笔记](#dev-note)

-----

<a id="packages"></a>
## Packages

一句简短定位说明，然后是包地图：

| 包 | 职责 |
|---|---|
| [`<pkg>`](<pkg>/README.md) | 一行职责：它贡献什么 |

<a id="related-documentation"></a>
## Related documentation

- [相邻负责者](../../<path>.md)——它为这个家族补充什么。

<a id="dev-note"></a>
## Dev Note

无。
```

## 规则

- 每个直接包含的包一行；职责文字陈述包贡献什么，不写内部实现。
- 只有当区别能帮助读者在直接包含的包之间作选择时，才增加 `ctx key`、包形态或 npm 名称列。
- 相关文档链接到相邻负责者（分组地图、子系统页、Agent Notes），每个链接附一个短语。
- 不添加 Model Experience 或 Known Limitations 节；分组地图不负责运行时行为。
- 编辑双语对后，重跑 `pnpm run verify-translation-pairing --write packages/<group>/README.md`。
