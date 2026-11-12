---
name: principle-type-system-discipline
description: "设计类型、审查函数签名或编写任何静态类型语言代码时使用。使非法状态无法表达，为语义基础类型加品牌，在边界解析外部数据，穷尽变体，从权威Schema派生。"
disable-model-invocation: true
---

# 类型系统纪律

让编译器拒绝不可能的状态、不匹配的基础类型和未处理变体。优先通过定义消除错误与特殊情况，而非不断增加处理器。TypeScript 语法见 `typescript-best-practices` 技能。

- **为语义基础类型加品牌。** `UserId` 和 `OrderId` 底层都是字符串，但不应可以互换。分别给它们类型，例如 TypeScript 的品牌交叉类型，或其他语言的 newtype。创建时验证一次，后续信任类型。两个参数共享同一基础类型却有不同含义时，就加品牌。
- **外部数据在解析前没有类型。** 包括 RPC 负载、JSON、IPC 消息、CLI 参数、配置文件、环境变量、数据库行。在每个边界设置解析函数，把无结构输入转成有类型模型。**boundary-discipline** 原则说明验证应放在哪里。
- **从权威 Schema 派生类型。** 协议缓冲定义、OpenAPI 规格、GraphQL Schema、数据库迁移、设计变量文件或其他文件负责某个形状时，从它派生，不手写另一套并行类型。见 **encode-lessons-in-structure** 原则技能。
