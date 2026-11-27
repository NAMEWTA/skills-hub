---
name: architect
description: "先勾勒类型、签名和模块结构，再在实现填充过程中持续参与。用于 /architect、‘为它做架构设计’、‘设计这个’，或直接写代码会锁定错误形态的非平凡工作。"
disable-model-invocation: true
---

# 架构设计

在 Claude Code 中，每个会话在遵循此技能前，先阅读一次 [Claude Code 适配器](../../docs/harness/claude-code.md)。它将 pstack 技能中的 Cursor 名称映射到 Claude Code。

编写代码前，追踪改动涉及的每个系统，然后为它勾勒两种不同的结构（类型、签名、模块边界），选择其中每份状态只有一个所有者、每项任务只有一种执行方式、调用方所需知识最少的方案。若变通方案反复出现，就重新设计，而不是继续打补丁。

对于大型或存在争议的设计，运行 **arena** 技能，而不是独自勾勒方案。
