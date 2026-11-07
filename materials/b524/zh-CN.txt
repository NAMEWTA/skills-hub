# 配置 pstack

本页带你安装插件、选择 pstack 使用的模型，并运行第一个任务。配置只需一条命令和一段简短对话。

## 安装插件

在 Cursor 聊天中运行：

```text
/add-plugin pstack
```

Cursor 会确认插件已安装。

在 Claude Code 中，先运行 `/plugin marketplace add cursor/plugins`，再运行 `/plugin install pstack@cursor-plugins`。Claude Code 会给插件命令加前缀，因此本指南中的每条命令在那里都带 `pstack:` 前缀，例如 `/pstack:setup-pstack`；它把模型规则写入 `~/.claude/rules/pstack-models.md`。[Claude Code 适配器](../harness/claude-code.md)介绍其他差异。

## 选择模型

运行：

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md) 检测你可以访问的模型，询问推理预算，展示每个角色（代码执行者、判断角色和评审组），再询问你的选择。回答这些问题即可。它会写入 `~/.cursor/rules/pstack-models.mdc`，这份小规则由每个 pstack 技能读取。

默认使用 `xhigh` 推理，与 `large` 预算相同。`unlimited` 将每个模型提升到其最高级别，最高为 `max`。Opus 升到 `max`。Grok 最高为 `xhigh`，所以保持不变。`medium` 和 `small` 降低推理级别，消耗更少 token。

只覆盖你关心的部分。规则中没有某角色的行时，它保留技能默认值。删除对应角色行即可恢复默认。再次运行 `/setup-pstack` 会保留模型不同于默认值的角色。默认值变化后，之前写入的规则仍锁定旧默认值，因此要删除这些角色行或整个文件，再运行 `/setup-pstack`。

如果使用 Auto，会发生什么？把角色设为 `inherit-parent` 或 `auto`，pstack 就省略子智能体的 `model` 字段，使其继承父聊天模型。这两个值含义相同，都不是模型 slug。评审组角色的值是列表，每个条目运行一个子智能体，因此列表长度决定评审组规模。配置还会设置 `swarm workers`，作为每个 `/swarm` 工作智能体的默认模型，除非竞赛为每个分支指定模型。

## 接受验证技能建议，或跳过

配置结束时，`/setup-pstack` 会寻找项目中证明应用行为的方式，例如 `verify-*` 技能或已有测试设施。如果两者都没有，就只提出一次用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 生成的建议。

回答“是”，它会写入 `.cursor/skills/verify-<app>/`，这是一份项目本地技能，教智能体像用户一样驱动应用。交付前，它会证明该技能实际运行一次成功。回答“否”，配置继续。你随时可以自己运行 `/create-verification-skill`。[验证与交付](./06-verify-and-ship.md#create-a-project-verification-skill)有详细说明。

如果刚开始使用 pstack，建议接受。能检查自身工作的智能体会继续推进，直到检查通过；做不到的智能体会把每个结果交回给你人工检查。本指南里，验证技能带来的回报最大。

随后，配置会只提出一次用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 生成形式化验证技能的建议，除非项目已有。测试检查有人想到并写下的情况；形式化验证技能在明确范围内的所有情况检查代码的某个关键属性，例如“一个作业绝不会同时运行两次”。若代码涉及并发、重试、状态机或解析器，bug 代价高，而测试很少触及出错情况，就回答“是”。否则回答“否”，情况变化时再运行。[验证与交付](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill)对此有说明。

配置完成后，开启新聊天。模型规则适用于新会话。

## 控制成本

pstack 会在子智能体和评审组上多花 token，这是严谨性的成本。要减少消耗：

- 再次运行 `/setup-pstack`，选择更低的推理预算或更便宜的模型。主聊天使用强模型，代码角色使用便宜、快速的模型，是一种合理分配。
- 将角色设为 `auto` 或 `inherit-parent`，使用聊天自身的模型。
- 缩短评审组列表，每个条目都会运行一个子智能体。
- 把 `/poteto-mode` 留给需要严谨性的工作，简单、明显的小修改不需要它。

## 运行第一个任务

选择真实但较小的任务，像向同事描述一样说清楚：

```text
/poteto-mode 为这个命令添加 --json 标志。文本输出保持逐字节一致。验证两种输出。
```

观察待办清单。最前面的条目是复制进来的匹配规程步骤；这个提示会匹配 Feature 规程。若 `/poteto-mode` 跳过某步，该步骤仍保留在清单中，并标注 `skip: <reason>`，让你看到它选择省略了什么。

此后可以正常追问。若要让 `/poteto-mode` 在整个聊天中持续生效，在 `/` 菜单选中它时按 Option+Enter（Mac）或 Alt+Enter（Windows），不要只按 Enter。这会启用[自定义模式](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，在退出前每轮都保持在上下文中。自定义模式可用于 Agents Window 和 CLI。单按 Enter 只把技能附到一条消息上，随着对话推进会逐渐淡出。

下一步：[通过 `/poteto-mode` 分流工作](./02-poteto-mode.md)。
