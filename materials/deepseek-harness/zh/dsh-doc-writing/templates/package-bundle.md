# 模板：package-bundle

用于清单声明 `dsh.bundle.patch` 的包，即可安装的配置档层：`packages/bundle/*`、`dsh-subagent-codex`、`dsh-subagent-claude-code`。`bundle/base` 的 README 双语对是完整示例。

功能包 README 首先给出配置档安装路径及层的语义；实现折叠区解释补丁文档。绝不把该包呈现为可导入的库或可挂载的单个插件。

## Frontmatter

```yaml
---
description: "此功能包层给 dsh --profile 接口增加什么，面向组合或自定义配置档的用户。"
kind: "package-bundle"
---
```

## 骨架

````markdown
# @deepseek-ai/dsh-<name>

English | [中文](README.zh.md)

## Summary

三到五句话，按 `wc -w` 方式计数最多 100 词：配置档从该层获得什么、哪些配置档已包含它、用户如何添加或移除，以及主要限制。应用[概要语气规则](../SKILL.md#voice-rules)。

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

### Install into a profile

已验证的安装路径：编写之前，在当前检出版本上运行：

```text
dsh plugin --profile <name> add @deepseek-ai/dsh-<name>
dsh plugin --profile <name> remove @deepseek-ai/dsh-<name>
```

说明内置功能包从哪里解析、协调步骤激活什么，以及缺少补丁声明时什么会失败。

### What you get

该层新增的可观察接口：工具、提供者或 UI 行，以及每行行为归哪个包负责。

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>实现内部细节——点击展开</summary>

补丁文档：插入列表、行 ID、平台门控、覆盖语义。源码地图表链接 `cordis.patch.yml` 和 `src/`。不放 API 目录。

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

相邻页面：分组地图、配置档约定、组合图。

-----

<a id="model-experience"></a>
## Model Experience

采用 verify-package-readme-model-experience 门禁指定的形式（功能包载体为 `indirect` 或 `none`：每个插入行所在的包负责其面向模型的行为）。

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

当前约束：用户必须遵守的覆盖语义、平台门控及冲突规则。

<a id="dev-note"></a>
### Dev Note

<details>
<summary>维护者工作上下文——点击展开</summary>

无。

</details>
````

## 规则

- **只有 `dsh.bundle.patch` 包使用此模板。** 分类前验证 `package.json` 中的声明；`dsh plugin` 协调操作恰好只为这类包激活一个层。
- **测试安装路径。** 在临时配置档中运行 `dsh plugin --profile <name> add <this-package>`，复现文档所写的警告、层激活及失败模式，再写入。
- 编辑双语对后，重跑 `pnpm run verify-translation-pairing --write packages/<group>/<pkg>/README.md`。
