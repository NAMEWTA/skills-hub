---
name: principle-type-system-discipline
description: "设计类型、审查函数签名或编写任何静态类型语言代码时使用。使非法状态无法表达，为语义基础类型加品牌，在边界解析外部数据，穷尽变体，从权威Schema派生。"
disable-model-invocation: true
---

# 类型系统纪律

在 Claude Code 中，每个会话首次遵循本技能前，先读一次 [Claude Code 适配器](../../docs/harness/claude-code.md)。它将 pstack 技能里的 Cursor 名称映射到 Claude Code。

让编译器拒绝不可能状态、含义不匹配的基础类型，以及未处理的变体。

- **为语义基础类型加品牌。** 两个参数使用相同基础类型却含义不同时，各自定义独立类型。在创建时验证一次。
- **外部数据在解析前没有可信类型。** JSON、RPC 载荷、CLI 参数、配置、环境变量及数据库行，都要经过边界上的解析函数，返回有类型的模型。
- **从权威 schema 派生类型。** 形状由 schema 文件拥有时，从它派生类型，不手工维护平行版本。

TypeScript 语法见 **typescript-best-practices** 技能。
