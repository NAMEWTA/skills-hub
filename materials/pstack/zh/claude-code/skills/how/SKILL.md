---
name: how
description: "用于‘X 如何工作’、修改前的代码走读，以及放置位置、所有权和分层问题（‘应该放哪里’、‘哪个包负责它’、‘这层对吗’）。解释子系统架构、运行时流程和入门心智模型。动机问题用 why。"
disable-model-invocation: true
---

# 如何运作

在 Claude Code 中，每个会话在遵循此技能前，先阅读一次 [Claude Code 适配器](../../docs/harness/claude-code.md)。它将 pstack 技能中的 Cursor 名称映射到 Claude Code。

探索代码库，回答“X 如何工作”。以资深工程师接手子系统所需的层次解释架构，足够建立可用心智模型，又不至于像逐行注释源码。

每次派生都使用 Task 子智能体，设置 `subagent_type: generalPurpose` 和 `readonly: true`。探索者使用 `pstack-models.mdc` 规则的 `how explorer` 行（默认 `grok-4.7-xhigh-fast`），每位解释者使用 `how explainer` 行（默认 `claude-opus-5-5-xhigh`）。把 `model` 设为对应行的值；规则或该行缺失时用默认值。值为 `auto` 或 `inherit-parent` 时不设置 `model`。若 Task 工具拒绝某个标识，使用默认值并说明；若连默认值也拒绝，使用错误消息中同系列最接近的有效标识。按 **poteto-mode** 技能“子智能体”一节，为每位子智能体选择适合工作的推理级别与快速或标准速度。

## 1. 判断复杂度

范围模糊时，说明你的理解并开始探索，用户可以调整方向。

- **简单**（单个模块、小工具、例如“函数 X 怎么工作”的窄问题）：无需探索者。派一位解释者一次完成探索和解释，按 `references/explainer-prompt.md` 构建提示，移除探索发现一节。转到第 4 步。
- **复杂**（跨多个文件或服务的子系统、横切功能、完整架构概览）：转到第 2 步。

拿不准时选简单路径。

## 2. 探索（仅复杂情况）

把问题分成 2 至 4 个角度，每个是子系统的独立切片。在一条消息中派出所有探索者，每位拿到填好角度的 `references/explorer-prompt.md`。

## 3. 综合（仅复杂情况）

全部探索者返回后，派一位解释者，给出 `references/explainer-prompt.md`，填入所有探索发现。

## 4. 展示

展示解释者输出。可以为清晰度或对话背景做轻微编辑，不要大幅重写。

## 输出格式

解释采用 `references/explainer-prompt.md` 定义的章节，删除不适用部分：概览、关键概念、工作机制、代码位置、注意事项。
