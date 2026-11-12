# 模板：package-library

用于没有插件接口的包：入口导出普通模块 API，不向组合注册任何东西。例如 `boot/app-boot`、`util/*`、`sdk/protocol`、`typert/generator`。`boot/app-boot` 的 README 双语对是完整示例。

库 README 与包参考有三点不同：没有“安装到配置档”的指导（库是依赖，不是层），没有挂载配置（不存在 `cordis.yml` 行），Model Experience 一节只采用门禁审计指定的形式（多数库为 `none` 或 `indirect`）。

## Frontmatter

```yaml
---
description: "用一两句具体的话说明调用者可用此库构建什么，包含消费它的包或可搜索领域术语。"
kind: "package-library"
---
```

## 骨架

```markdown
# @deepseek-ai/dsh-<name>

English | [中文](README.zh.md)

## Summary

三到五句话，按 `wc -w` 方式计数最多 100 词：调用者能用库做什么、谁消费它、最小入口及主要限制。应用[概要语气规则](../SKILL.md#voice-rules)。

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

### When to use it

指出消费调用点（哪些 bin、包或运行时导入它），以及调用者何时应选择它而非插件。

### Entry point

在 `text` 或 `ts` 代码围栏中写能运行的最小导入加调用，随后说明成功与失败的表现。准确细节链接 `src/index.ts` 中负责的约定，而非重述。

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>实现内部细节——点击展开</summary>

设计说明与源码地图表。不放 API 目录。

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

相邻页面，最近的前置知识在先。

-----

<a id="model-experience"></a>
## Model Experience

只采用 verify-package-readme-model-experience 门禁指定给此包的形式（`none`、`indirect` 或规范区块）。库绝不虚构自己没有的模型影响。

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

用顶层要点列出当前包约束；没有约束时，将包加入 scripts/verify-package-readme-limitations.ts 的允许列表。

<a id="dev-note"></a>
### Dev Note

<details>
<summary>维护者工作上下文——点击展开</summary>

无。

</details>
```

## 规则

- **按入口分类，不按目录。** 选模板前阅读 `src/index.ts`：`export default` 导出服务类或导出 `apply`，则属于 `package-reference`；`package.json` 中有 `dsh.bundle.patch`，则属于 `package-bundle`。不具备这些的普通模块 API 才是库。
- **绝不写配置档安装指导。** `dsh plugin --profile <name> add <package>` 可以安装任何 npm 依赖，但只会为声明 `dsh.bundle` 的包激活配置档层；用于库时，充其量只添加一个不生效的依赖，不得作为安装路径呈现。
- 编辑双语对后，重跑 `pnpm run verify-translation-pairing --write packages/<group>/<pkg>/README.md`。
