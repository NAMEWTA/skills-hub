# 模板：package-reference

用于入口是 Cordis 插件、挂载在组合中的包，即默认导出的服务或 `apply` 函数。这是 `packages/<group>/<pkg>/README.md` 的默认模板。`session-persistence-jsonl` 的 README 双语对是本模板的完整示例。

## Frontmatter

```yaml
---
description: "用一两句包含可搜索领域术语的具体话，说明读者可用此包选择、配置或调试什么。"
kind: "package-reference"
---
```

## 骨架

```markdown
# @deepseek-ai/dsh-<name>

English | [中文](README.zh.md)

## Summary

三到五句话，按 `wc -w` 方式计数最多 100 词，说明用户或 agent 能用包做什么：结果、何时选择、主要成本、最重要的限制。应用[概要语气规则](../SKILL.md#voice-rules)；绝不描述它的职责、类型或内部身份。

## Table of Contents

- [使用此包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延后工作](#known-limitations-and-deferred-work)
- [开发笔记](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

一句定位说明：常用路径。

### When to choose it

选择或避开此包：用一段话指出决定条件及后备包。

### Minimal configuration

以 `cordis.yml` 片段给出可工作的最小挂载，加上配置表：

| 字段 | 默认值 | 含义 |
|---|---|---|
| `<field>` | `<default>` 或 `required` | 一行含义 |

生成的[配置目录](../../../docs/config-catalog.md#deepseek-aidsh-<name>)是所有可接受字段的穷尽来源。

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>实现内部细节——点击展开</summary>

设计概念、组件架构及概略数据流，足以理解包。用源码地图表链接文件以获取准确细节。不放 API 目录，不重述 JSDoc。

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

三到七份相邻页面，最近的前置知识在先，每项附一短语。

-----

<a id="model-experience"></a>
## Model Experience

<遵循 docs/cookbook/adding-a-package.md#4-write-the-package-readme 中的 Model Experience 约定；verify-package-readme-model-experience 门禁负责规定必需形式>

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

一句定位说明，然后用顶层要点指出当前包约束。没有约束的包使用 scripts/verify-package-readme-limitations.ts 的允许列表。

<a id="dev-note"></a>
### Dev Note

<details>
<summary>维护者工作上下文——点击展开</summary>

无。

</details>
```

## 规则

- **先查证再写。** 将包挂载到测试组合，运行 README 所声称的每个命令、配置字段、默认值和行为。未复现的内容一律删除；链接生成的配置目录，而不是重述字段。
- **安装指导。** 插件包通过 `cordis.yml` 行挂载。只有声明 `dsh.bundle.patch` 的包才通过 `dsh plugin --profile <name> add <package>` 安装成配置档层；包缺少该声明时，说明它如何在组合中挂载，绝不写 `dsh plugin add`。
- **Model Experience 和 Known Limitations 由门禁负责。** 精确匹配两道门禁要求的标题及逐包形式；行为变化导致包在形式之间转换时，在同一变更中更新门禁审计列表。
- 编辑双语对后，重跑 `pnpm run verify-translation-pairing --write packages/<group>/<pkg>/README.md`。
