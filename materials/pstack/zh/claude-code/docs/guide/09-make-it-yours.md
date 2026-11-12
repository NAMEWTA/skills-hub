# 形成自己的方式

poteto-mode 是一个人的风格；它下方的规程、分流和模型角色，同样能配合你的风格工作。本页介绍如何生成个人模式、捕获会话经验、修复仓库以免智能体重复犯错、编写聚焦技能，以及在信任技能变更前进行测试。

起步应比你想象中更小。第一天不需要很多技能，甚至不需要整个插件。直白提出要求，观察智能体在哪里失败；同一失败出现两次时，再增加技能或检查。

## 使用 `/automate-me` 生成个人模式

```text
/automate-me
```

你不用描述自己的风格，因为 [`/automate-me`](../../skills/automate-me/SKILL.md) 会从历史中读取它。它挖掘当前工作区近期对话中反复出现的偏好，涉及回复、委派、验证、代码、文字和流程，再询问哪些模式真正代表你。它通过 Cursor 内置的 `create-skill` 流程起草 `.cursor/skills/<your-name>-mode/SKILL.md`，用 [`/unslop`](../../skills/unslop/SKILL.md) 整理草稿，并从 worktree 打开 PR，让你像审查普通变更一样审查它。

习惯发生变化时再次运行：

```text
/automate-me 用上次编辑以来的所有内容更新我的模式技能
```

更新模式只挖掘技能上次改变之后的历史。保留你没有否定的规则，根据新证据修订其他规则，只为新模式添加章节。

## 使用 `/reflect` 捕获一次会话的经验

刚完成一项让你学到东西的任务后，运行：

```text
/reflect 这次花得太久了。记录我们学到的内容，让下次不再重复。
```

[`/reflect`](../../skills/reflect/SKILL.md) 将对话记录交给三位并行审查者，再由汇总者把提案分为 `Accepted`、`Rejected` 和 `Backlog`，并在修改任何技能前等待你的批准。只有会改变未来决定的提案才值得批准。一次奇怪会话只是轶事，不是规则。

## 使用 `/correct` 修复环境

你一再纠正智能体同一种错误时，修复应进入仓库，而不是进入你的下一条提示。按约束可靠性对方案排序：

1. 通过架构或更好的数据结构，让错误不可能发生。
2. 用类型，或错误信息明确指出修复方式的 lint、CI 检查阻止它。
3. 用测试捕获它。
4. 写进文档或智能体规则。智能体跳过规则时没有东西会失败，所以它排最后。

人类审查不在清单中。每个 PR 都得靠审查者抓同一种错误，本身就是要修复的问题。[`/correct`](../../skills/correct/SKILL.md) 执行这项工作：

```text
/correct 智能体总是直接调用数据库客户端，没有经过仓储层
```

它读取近期提交、回退、审查评论，以及解释变通做法的注释，然后按类别归纳错误。某一类发生两次才计入。它先修最高频类别，每类一个提交，选用有效的最高层约束，并证明每个新检查会在真实历史错误上失败。它还在智能体指令文件维护规则与执行机制的对应表，使没有约束机制的规则显现为待再处理项。回复逐类列出证据、所选层级，以及为什么更高层不适用。

不带参数运行时，它会自行从历史中发现类别。`/reflect` 和 `/correct` 分工不同：前者根据一次会话改进技能，后者修改仓库，避免一类错误复发。如果修复涉及新边界，可与 `/architect` 配合。[并行运行多个项目](./07-overnight.md#run-many-projects-in-parallel)给出了覆盖整仓库、同时使用两者的提示。

## 编写聚焦技能

已经知道要捕获什么工作流时：

```text
/poteto-mode 为这个仓库编写验证数据库迁移的技能
```

编写技能会匹配[编写或修改技能规程](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，它通过 Cursor 内置 `create-skill`，验证 frontmatter 和链接，再通过 Opening a PR 规程交付。面向智能体的文字标准高于面向人类的文字，因为无用句子会变成未来智能体遵循的指令。让规程维持这个标准，不要徒手随意写一个 `SKILL.md`。

两种特殊情况有专门生成器。若技能必须驱动应用并证明行为，应使用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 和 [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md)。若技能通过模型检查器、证明或其他验证器检查代码属性，应使用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 和 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。[验证与交付](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill)介绍这两类技能。

## 使用 `/technical-writing` 按标准编写文档

交付的文字不只有技能。对于文档、RFC、README、PR 描述和提交消息：

```text
/technical-writing 审查 README 的变化
```

[`/technical-writing`](../../skills/technical-writing/SKILL.md) 使用分层标准，目标是让疲惫的工程师第一次读就理解。先选择文档模式（教程、操作指南、参考或解释），再逐句检查谁做什么、每句一个想法，以及是否存在两种读法。可用它审查你或智能体刚写的内容，也可在请求文档时预先指定。

## 盲测技能变更

技能修改影响今后的每次会话，因此要把它当作实验测试。采用他人的技能也一样。保留之前，先证明它确实让智能体更擅长你的工作。

```text
/poteto-mode 对这次技能变更运行评测规程。两种版本用同一任务，参与者保持盲态。
```

技能持续遗漏某点、你又知道它应该怎么做时，可把修改与测试放在同一任务：

```text
/poteto-mode 更新审查技能，让它指出缺失的迁移，并评测这次修改。
```

预先要求评测，让修改保持诚实。只根据一次糟糕会话写出的修复容易对该会话过拟合；多次编辑后，技能逐渐漂移。评测在交付前发现这种漂移。

[评测规程](../../skills/poteto-mode/playbooks/eval.md) 围绕一个失败模式设计，即观察者效应：知道自己被评估的智能体会表现不同。因此参与智能体在清理后的目录中收到自然任务，不出现“评测”或“候选者”等词，也不知道彼此存在。一位裁判按中性标签评分所有输出；是否沿引用链执行，应根据各参与者实际读取的文件判断，不根据其声称。

接受结论前，亲自阅读每份输出。若不同意裁判，先怀疑评分标准，再怀疑自己的判断。

## 使用 `/make-bot-ui` 构建机器人界面

另一个适用于特定场景的技能面向 Grok Bot 用户。[`/make-bot-ui`](../../skills/make-bot-ui/SKILL.md) 构建小页面，按钮通过 webhook 例程唤醒机器人。例如，你可以滑动浏览审查队列，每次滑动都请求机器人处理该事项。机器上的服务器保存 webhook 发送者密钥，因此密钥不会进入浏览器或聊天。技能还涵盖通过 Tailscale 暴露页面。

**易错点：**不要因为技能表现不佳就在任务中途编辑它。用单独 PR 修复技能，同时继续推进原任务。技能修改与功能工作混在一起交付，会让它不易被审查，也无法评估。

下一步：[配方与易错点](./10-recipes-and-pitfalls.md)。
