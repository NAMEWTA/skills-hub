---
name: typescript-best-practices
description: TypeScript 最佳实践。读取或编辑任何 .ts 或 .tsx 文件时使用。
paths: ["**/*.ts", "**/*.tsx"]
disable-model-invocation: true
---

# TypeScript 最佳实践

先应用 **type-system-discipline** 原则技能。

| 规则 | 摘要 |
|------|---------|
| 可辨识联合 | 使用 `kind` 字面量判别字段表示变体，使不可能状态无法表达。不使用一堆可选字段。 |
| 品牌类型 | 用 `& { readonly __brand: "X" }` 给基础类型加品牌，避免混淆。在边界验证一次。品牌来自真实验证的类型守卫（`input is AgentId`），绝不来自 `as`。 |
| 构造式建模 | 设计形状，使非法值无法构造。非空用 `[T, ...T[]]`，偶数长度用 `[T, T][]`，区间用 `start` 加 `duration`。不是运行时防护，也不是期待精化类型。 |
| 最简单的全定义类型 | 只要每个操作都对全部输入有定义，就保留 `T[]`。只有松散类型迫使使用 `!`、类型断言或“不应发生”的异常时，才加强为 `NonEmpty<T>`。 |
| `unknown` 优于 `any` | 外部数据是 `unknown`。 |
| Schema 先于守卫 | 手写逐属性类型守卫前，先使用仓库的运行时 Schema 库，从 Schema 推导类型，例如 `z.infer`。 |
| 不用 `as` 断言 | 每个 `as` 都是潜在运行时崩溃。只在验证后断言。 |
| 类型收窄顺序 | 判别字段 switch > `in` 操作符 > `typeof`/`instanceof` > 自定义类型守卫 > `as`。 |
| 类型守卫 | 必须验证自己声称的事实。说谎的守卫比 `as` 更糟，因为缺陷躲在一个声称安全的名称后面。命名为 `isX` 或 `hasX`。 |
| 穷尽检查 | 在 default 分支内联 `const _exhaustive: never = x;`，新增变体时让编译器报错。 |
| `satisfies` 优于 `as` | 验证值，同时不拓宽字面量类型。 |
| 边界验证 | 数据进入时解析成命名领域类型。`Record<string, unknown>` 无论如何书写，都止于该解析处。内部信任类型。见 **boundary-discipline** 原则技能。 |
| Schema 派生类型 | 声明新接口前，先考虑 `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof`。 |
| 对象参数 | 传对象而不是位置参数，让参数顺序自行说明。在热路径上跳过，包括逐帧渲染、分词器、解析器。 |
| 真实测试 | 能真实运行的就不模拟。优先框架真实测试原语，包含泄漏与可释放资源检查，并在运行中的构建验证 UI。只模拟本地无法运行的东西。 |
| 结构化遥测 | 优先结构化日志诊断，携带足够上下文，能从一个 ID 开始调试。交付代码不使用 `console.log`。 |

示例：`references/patterns.md`。
