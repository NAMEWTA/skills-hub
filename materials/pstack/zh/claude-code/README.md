# pstack

我是 [poteto](https://x.com/poteto)。我不是总裁或首席执行官，但我曾在 Meta、Netflix 和 Cursor 处理过数百万行代码。我也是 React 核心团队成员，帮助构建和维护 React Compiler。

越来越多人认为 AI 写出了太多粗制滥造的代码。我同意。我不想像一支由二十个滥造者组成的团队那样交付。没有质量的吞吐量不是我追求的目标。想要快，先要深入。

**pstack 是我的答案。** 这些就是我每天在 Cursor 用来交付高质量代码的技能。它们把 Cursor 变成一支真正的工程团队。目标不是让代码行数最大化，实际上恰好相反。pstack 帮助你写出更少、但质量更高的代码。

**pstack 让你无惧并行。** 当你可以深入使用一个智能体，并相信它能写出优质、可验证的代码时，你才能真正有信心地并行工作。用 `poteto-mode` 启动多个智能体，相信它们会在工作中运用严谨的工程原则。

**Cursor 让你兼得各家之长。** 每个前沿模型都有自己的优势和弱点。pstack 可以使用任何模型。事实上，我的许多技能使用多模型工作流，发挥各模型独有的长处。

派生它，改进它，让它成为你自己的工具。欢迎提交 PR！

## 安装

```bash
/add-plugin pstack
```

在 Claude Code 中：

```bash
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

Claude Code 默认关闭第三方市场的自动更新，因此 pstack 会停留在你安装的版本。要打开自动更新，运行 `/plugin`，打开 **marketplaces** 标签页，选择 `cursor-plugins`，再选择 **enable auto-update**。要手动更新一次，运行 `claude plugin update pstack@cursor-plugins`。

Claude Code 会给插件命令和智能体加前缀，因此 `/poteto-mode` 在这里是 `/pstack:poteto-mode`。[Claude Code 适配器](./docs/harness/claude-code.md)映射了其他所有 Cursor 名称。在 Claude Code 中，`/pstack:setup-pstack` 把你的模型选择写入 `~/.claude/rules/pstack-models.md`；需要 Cursor 专有功能的步骤，例如 bugbot 或自动化，会被跳过，并用一行说明。

Claude Code 从仓库根目录下的 [`harness/pstack/`](https://github.com/cursor/plugins/tree/main/harness/pstack) 安装生成的 pstack 副本，包括这份 README 和指南。修改 pstack 后，从仓库根目录运行 `node scripts/generate-pstack-harness-trees.mjs`，并提交结果。生成的副本过期时，CI 会失败。

## 开始使用

只需两步：

1. 运行 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)，选择推理预算和要使用的模型。
2. 做任何需要严谨性的事情时，使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。

第一次使用？[pstack 指南](./docs/guide/README.md)会带你完成第一个真实任务，从设置和提示词，到验证和通宵运行。卡住了，或者不确定该用哪个技能？问 [`/poteto-help`](./skills/poteto-help/SKILL.md)。

就这些。其他技能用于特定场景，模式技能会按需为你调用。默认情况下，这个模式按模型强项分工：代码委派任务，包括功能、重构、缺陷修复、性能和爬坡优化，交给 Grok；最难的改动、文字和判断交给 Opus 5.5。默认评审组是 Opus 5.5 / Grok。[`/setup-pstack`](./skills/setup-pstack/SKILL.md) 可以修改其中任意配置。

## 用法

任务开始时使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。它读取你的请求，从一组手册中选择，并在步骤需要时运行其他技能。

输入任务之前，先从 `/` 菜单选择 `/poteto-mode`，这样 Cursor 会把技能附到消息上。

### 直接使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)

这个技能是主要快捷入口。只要需要智能体开展严谨的工程工作，我就使用它。它带有二十三份手册：

```
/poteto-mode 这个 PR 有一个隐蔽的缺陷，即使空闲，滚动位置也会每 750ms 漂移一次。先复现，
再修复并验证。
```

```
/poteto-mode 我要睡觉了。即使 CI 偶发失败，也把整个堆叠落地。我希望早上之前
全部合并。
```

<details>
<summary>二十三份手册</summary>

| 手册 | 适用情况 |
|---|---|
| [调查](./skills/poteto-mode/playbooks/investigation.md) | 只读问题。x 如何工作，y 为什么这样构建，我们确定吗。 |
| [缺陷修复](./skills/poteto-mode/playbooks/bug-fix.md) | 复现缺陷，找出根因，用运行时证据完成修复。 |
| [性能](./skills/poteto-mode/playbooks/perf-issue.md) | 追踪已经测得的缓慢行为，并相对于基线改善它。 |
| [爬坡优化](./skills/poteto-mode/playbooks/hillclimb.md) | 面向目标，对一个指标进行持续、科学的改进，循环提出假设并进行前后测量，每项接受的改进对应一个提交。 |
| [运行时取证](./skills/poteto-mode/playbooks/runtime-forensics.md) | 利用检测手段诊断现场症状，例如泄漏、空闲 CPU 忙转或故障。 |
| [轨迹取证](./skills/poteto-mode/playbooks/trace-forensics.md) | 诊断捕获的性能分析制品，例如 cpuprofile、trace、spindump 或堆快照。 |
| [功能](./skills/poteto-mode/playbooks/feature.md) | 从一个明确命名的数据形状构建新增或改变的行为。 |
| [重构](./skills/poteto-mode/playbooks/refactoring.md) | 保持行为不变的结构或形状修改。 |
| [原型](./skills/poteto-mode/playbooks/prototype.md) | 用可丢弃的草图，低成本地做出设计或行为决定，或通过实际观察裁定需要经验验证的分歧。 |
| [视觉一致](./skills/poteto-mode/playbooks/visual-parity.md) | 两份实现之间达到逐像素精确的 UI 一致。 |
| [编写技能](./skills/poteto-mode/playbooks/authoring-a-skill.md) | 编写或编辑 SKILL.md。 |
| [评估](./skills/poteto-mode/playbooks/eval.md) | 以盲测方式检验技能或提示词改动如何影响智能体行为。 |
| [跟进](./skills/poteto-mode/playbooks/babysit.md) | 处理冲突、评审讨论和 CI，推动一个 PR 或一个堆叠达到可合并状态。 |
| [交付](./skills/poteto-mode/playbooks/shipping.md) | 独立验证已经全绿的堆叠，然后自底向上落地连续通过验证的部分，默认通过 GitHub；Origin 可用时使用 Origin。 |
| [自主运行](./skills/poteto-mode/playbooks/autonomous-run.md) | 不停下，推动长期任务直至完成。 |
| [统筹](./skills/poteto-mode/playbooks/orchestrate.md) | 将持续项目交给一个协调对话：跨多天、多个堆叠 PR、大量子智能体。 |
| [autopilot-full](./skills/poteto-mode/playbooks/autopilot-full.md) | 为每个独立 PR 分配一位负责人，推进到合并。一组智能体验证每个代码就绪的最新提交，此后每次补丁变更都重新检查。 |
| [autopilot-stack](./skills/poteto-mode/playbooks/autopilot-stack.md) | 不执行合并的 autopilot-full。构建并验证 PR，由操作者评审和落地；只有依赖某个 PR 的工作才堆叠在其上。 |
| [会话接续](./skills/poteto-mode/playbooks/session-pickup.md) | 恢复或接手此前智能体进行中的工作。 |
| [安全暂停](./skills/poteto-mode/playbooks/pause-safely.md) | 干净地暂停进行中的工作，使其以后可以恢复。 |
| [多阶段计划](./skills/poteto-mode/playbooks/multi-phase-plan.md) | 跨越多个阶段或堆叠 PR 的工作。 |
| [工作树清理](./skills/poteto-mode/playbooks/worktree-cleanup.md) | 在安全检查约束下，清理已合并或已放弃的工作树和过时 iOS 模拟器，回收磁盘空间。 |
| [打开 PR](./skills/poteto-mode/playbooks/opening-a-pr.md) | 从有序的小提交打开就绪 PR，采用 Conventional Commits 标题和简报式正文。每份其他手册结束时都会调用。 |

</details>



调用后，它会：

1. 将任务匹配到一份[手册](./skills/poteto-mode/playbooks/)，打开待办清单，第一批条目逐字复制该手册的步骤。
2. 各步骤执行时，路由到其他技能。
3. 面向使用者和维护者，写出去除冗余套话的回复。

完整规则与手册位于 [`skills/poteto-mode/SKILL.md`](./skills/poteto-mode/SKILL.md)。

要让 [`/poteto-mode`](./skills/poteto-mode/SKILL.md) 在多轮对话间持续生效，从 `/` 菜单选择它，然后按 option+enter（Mac）或 alt+enter（Windows），而不是 enter。这样它会成为[自定义模式](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，Cursor 在智能体窗口和 CLI 中都提供此功能。退出模式之前，它会一直保留在每一轮的上下文中。单按 enter 只会将它附到一条消息上。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 与 Cursor 的 `/loop` 命令配合得非常好。你可以让 Cursor 连续工作数小时，同时保持严谨性。

## 技能

步骤需要时，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 会为你运行其中大多数技能，包括 `how`、`why`、`architect`、`arena`、`swarm`、`interrogate`、`unslop`、`no-comments`、`technical-writing`、`tdd` 和各项原则。下表用于你想直接调用某个技能时：

```
/how 我们如何取消运行？查找每个待取消的运行时，是否存在 n+1？
```

```
/interrogate 评审这个 PR。
```

<details>
<summary>全部技能</summary>

| 技能 | 使用时机 |
|---|---|
| [`/poteto-mode`](./skills/poteto-mode/SKILL.md) | 任何非简单任务的默认入口。 |
| [`/poteto-help`](./skills/poteto-help/SKILL.md) | 你刚开始使用 pstack，或不确定哪个技能、手册或原则合适。它了解你想做什么，回答相关部分，给你一条可以输入的提示词。只有输入 `/poteto-help` 才运行。 |
| [`/in-your-own-words`](./skills/in-your-own-words/SKILL.md) | 希望智能体开始之前，先复述你的目标和问题。只有输入 `/in-your-own-words` 才运行。 |
| [`/sharpen`](./skills/sharpen/SKILL.md) | 发送提示词之前，希望它变得更深入，而非更庞大：一位顶尖专业人士会做哪些你没有要求的事情，会从哪些原始材料开始，使用什么方法和工具，以及如何从外部检验结果是否正确。它返回改写后的提示词，保留你的选择空间，不执行任务。只有输入 `/sharpen` 才运行。 |
| [`/how`](./skills/how/SKILL.md) | 希望有人带你了解一个子系统如何工作。 |
| [`/why`](./skills/why/SKILL.md) | 想知道为什么这样构建。它在运行时发现可用 MCP，并行查询每一类证据：源码管理、工单跟踪器、长文档、实时聊天、基础设施可观测性、错误追踪和分析仓库。 |
| [`/recall`](./skills/recall/SKILL.md) | 开始或恢复工作，希望根据自己的聊天历史和共享记录，重建某个主题的近期背景，返回一份精练的当前状态简报。 |
| [`/ketchup`](./skills/ketchup/SKILL.md) | 想知道自上次发消息以来，这段对话中发生了哪些变化；用朴素语言和小型图示说明，列出每一项等待你决定的事情，并让你只读这份回复就能做决定，即使回复因此变长。 |
| [`/ketchup-video`](./skills/ketchup-video/SKILL.md) | 希望把 `/ketchup` 进展回顾做成带字幕的幻灯片短视频，并在视频下方用文字列出等待你决定的事项。 |
| [`/blast-radius`](./skills/blast-radius/SKILL.md) | 改动看似很小，但你想知道它还可能破坏什么；它必须通过实际运行代码证明那个使改动安全的关键事实，不能只作断言。 |
| [`/architect`](./skills/architect/SKILL.md) | 即将编写跨函数边界的代码，希望先确定调用方用法、类型和模块形状。 |
| [`/arena`](./skills/arena/SKILL.md) | 希望对同一件事并行尝试 N 次，再取各方案之长。 |
| [`/swarm`](./skills/swarm/SKILL.md) | 希望 N 位工作者针对不同切片或竞争尝试并行工作，最后给出一份汇总报告。 |
| [`/interrogate`](./skills/interrogate/SKILL.md) | 已有差异，希望不同模型尝试破坏它，只保留真实运行能够证明的问题。 |
| [`/automate-me`](./skills/automate-me/SKILL.md) | 希望根据自己的实际工作方式，起草自己的 `-mode` 技能。 |
| [`/make-bot-ui`](./skills/make-bot-ui/SKILL.md) | 希望构建一个页面或仪表盘，用按钮通过 webhook 唤醒 Grok Bot，包括发送者密钥交接和 Tailscale。 |
| [`/setup-pstack`](./skills/setup-pstack/SKILL.md) | 希望为 pstack 的每个角色选择模型。它检测你的模型并写入配置规则。 |
| [`/reflect`](./skills/reflect/SKILL.md) | 长任务已经交付，希望把做法记录为技能修改。 |
| [`/correct`](./skills/correct/SKILL.md) | 你总在纠正智能体的同类错误。它挖掘历史中的错误类别，在有效的最高层修复每类问题，先架构，再类型、lint 和 CI，再测试，最后才是文档，并维护一张规则及其强制机制的配对表。 |
| [`/teach`](./skills/teach/SKILL.md) | 希望真正理解某项改动或子系统，而不只是得到摘要。它运行 how + why，把结果组织成朴素说明，逐张图建立理解。 |
| [`/tdd`](./skills/tdd/SKILL.md) | 正在修复缺陷，而且存在低成本的本地测试路径。先写失败测试，再修复。 |
| [`/benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | 运行过基准测试，或测得加速、回退。在你报告数字或据此行动之前，它检查数字，包括限制因素、调优、错误、重复运行和端到端相关性。 |
| [`/no-comments`](./skills/no-comments/SKILL.md) | 评审前移除注释；派出 Comment Sicko，修复接受的问题，为注释声称的约束提供编码方案。 |
| [`/typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | 正在阅读或编辑 TypeScript。它把 type-system-discipline 原则落实到语法。 |
| [`/figure-it-out`](./skills/figure-it-out/SKILL.md) | 没有随附手册适用。它为任务设计一份严谨、可审计的手册。 |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | 希望得到可审查的决策轨迹。它把决策记录到一个可以提交的 TSV 中。 |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | 项目没有能够证明应用行为的脚本化方式。它为任何语言或平台生成项目本地的验证技能，附带功能映射。 |
| [`/maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | 验证技能的功能映射已经与应用发生漂移。进行一轮源码调查和一次真实运行，最多产出一个 PR，包含已被证明的修正。 |
| [`/create-formal-verification-skill`](./skills/create-formal-verification-skill/SKILL.md) | 测试无法触达会破坏竞态、重试、状态机、解析器或不安全代码的情况。它使用合适的工具验证一个属性，生成项目本地技能，在每次改动时重新检查。 |
| [`/maintain-formal-verification-skill`](./skills/maintain-formal-verification-skill/SKILL.md) | 自上次检查以来，形式化验证覆盖的代码发生了变化。它更新模型、验证框架或属性，使之匹配代码，重新运行，并说明每项失败究竟是验证内容漂移，还是代码中的缺陷。 |
| [`/statechart`](./skills/statechart/SKILL.md) | 对行为负责的人需要看见它，而非阅读规格。它检查 TLA+ 模型，用 Mermaid 状态图画出用户所见，标记每个违反规则的状态，并给出到达每个状态的最短路径。 |
| [`/unslop`](./skills/unslop/SKILL.md) | 正在整理文字。它去掉 AI 写作痕迹。 |
| [`/bro`](./skills/bro/SKILL.md) | 希望用朴素的人类语言重述上一条消息，不用术语。 |
| [`/technical-writing`](./skills/technical-writing/SKILL.md) | 用于文档、RFC、README、PR 描述和提交消息的分层文档标准：Diátaxis + Google 开发者风格 + STE + Global English。 |

</details>



### 示例

大多数时候，我在任务开始时输入 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)，让它路由到手册。步骤需要时，其他技能会触发。有几个技能我会直接调用。


<details>
<summary>全部示例</summary>

```
缺陷修复：          /poteto-mode 这个 PR 有一个隐蔽的缺陷，即使空闲，滚动位置也会每 750ms
                   漂移一次。先复现，再修复并验证。
性能：              /poteto-mode 即使使用了虚拟化，一个大列表还是要一两秒才能加载。
                   运行 CPU 轨迹分析，告诉我原因。
功能：              /poteto-mode 在功能开关后面构建一个小功能。验证它确实有效。
原型：              /poteto-mode 为 Markdown 渲染器构建两个原型，便于比较。
                   每个原型派一位智能体。
多阶段：            /poteto-mode 把这些技能作为插件开源。不能泄露内部信息，在临时目录
                   中工作，先给我看依赖图。
通宵运行：          /poteto-mode 我要睡觉了。即使 CI 偶发失败，也把整个堆叠落地。我希望
                   早上之前全部合并。
跟进：              /poteto-mode 检查 PR 123。还有什么未完成？
视觉一致：          /poteto-mode 这个标志打开时，行间距太高。第二张图才是正确的。
                   复现并修复，直到匹配。
自行解决：          /poteto-mode 我要离开一会儿。把每个调用方从同步存储迁移到新的异步
                   存储，保持行为完全一致。我希望回来时，可以相信工作已经正确完成。
机制：              /how 我们如何取消运行？查找每个待取消的运行时，是否存在 n+1？
原因：              /why 为什么这个功能开关还没打开？
架构：              设计这套检测机制，要有高信号且没有误报。先用 /architect
                   设计它。
比选：              /arena 把我的提示词逐字送入比选。我想比较各方案
                   和你的方案。
并行：              /swarm 按各包的 check.sh 检查 packages/ 下的每个包。每包一位
                   工作者，给我一份报告。
审问：              /interrogate 评审这个 PR。
TDD：               /tdd 实现
文字清理：          能不能清理新改动里的套话，并收紧文字？
反思：              /reflect 那次花了太久。记录我们学到的内容，让下次运行
                   不再重蹈覆辙。
纠正：              /correct
展示工作：          /show-me-your-work 保留决策轨迹，让我回来时可以审查。
为我自动化：        /automate-me
帮助：              /poteto-help 我应该用哪个技能评审这个分支？
```

</details>

## `poteto-agent` 和 Comment Sicko 子智能体

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 在收到它的对话中运行。该对话负责手册、待办清单和每次子智能体创建。

pstack 还提供 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md)，作为运行中创建的被委派智能体的包装器。它在开展任何工作之前，完整阅读 `poteto-mode`，包括其内嵌原则索引。换成 `generalPurpose` 会跳过这次阅读，导致偏移。不要创建 `poteto-agent` 来运行手册本身。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md) 通过同一个包装器路由。

pstack 还提供 [Comment Sicko](./agents/comment-sicko.md)，一位只读注释审查者，可以作为 `subagent_type: "comment-sicko"` 使用。通常通过 [`/no-comments`](./skills/no-comments/SKILL.md) 调用它，而非直接调用。

## 原则

二十四个简短技能，每个对应一条原则。`poteto-mode` 将它们编成内嵌索引，在任务开始时读取该索引。提供独立文件，是为了让其他技能可以按名称引用原则，也让索引能指向每条原则的完整规则。

<details>
<summary>全部二十四条原则</summary>

| 原则 | 分组 | 规则 |
|---|---|---|
| [laziness-protocol](./skills/principle-laziness-protocol/SKILL.md) | 核心 | 优先删除，以及足以解决问题的最小改动。 |
| [foundational-thinking](./skills/principle-foundational-thinking/SKILL.md) | 核心 | 写逻辑之前应用：选择核心类型和数据结构，安排框架搭建与功能工作的先后，询问并发参与者共享什么。把数据结构选对，使后续代码变得显而易见。 |
| [redesign-from-first-principles](./skills/principle-redesign-from-first-principles/SKILL.md) | 核心 | 重新设计，就像需求从第一天起就是基础假设，而非后来附加。 |
| [attack-the-premise](./skills/principle-attack-the-premise/SKILL.md) | 核心 | 两个或更多共享同一前提的修复都未通过同一道检查时应用。写下前提，在继续编写依赖它的修复之前，直接测试这个前提。 |
| [subtract-before-you-add](./skills/principle-subtract-before-you-add/SKILL.md) | 核心 | 先删除无用负担、冗余校验和占位引用，再在更简单的基础上构建。 |
| [minimize-reader-load](./skills/principle-minimize-reader-load/SKILL.md) | 核心 | 数清问题到答案之间的层次，以及读者脑中必须保持的隐藏状态；收拢只有一个调用者的包装层，缩小可变状态范围。 |
| [outcome-oriented-execution](./skills/principle-outcome-oriented-execution/SKILL.md) | 核心 | 在具有明确阶段边界的计划性重写和迁移中应用。收敛到目标架构，不用会被丢弃的兼容代码维持平滑的中间状态。 |
| [experience-first](./skills/principle-experience-first/SKILL.md) | 核心 | 选择用户愉悦而非实现方便；宁可交付更少且打磨好的功能，也不要更多粗糙功能。 |
| [exhaust-the-design-space](./skills/principle-exhaust-the-design-space/SKILL.md) | 核心 | 做出决定之前，构建 2-3 个相互竞争的原型，并排比较。 |
| [build-the-lever](./skills/principle-build-the-lever/SKILL.md) | 核心 | 应用于所有非简单工作，不只是批量工作：编辑、迁移、分析、检查。构建完成或证明工作的工具，例如 codemod、脚本、生成器或子智能体遵循的技能，不要手工完成。工具就是审查者可以重新运行的制品。 |
| [model-the-domain](./skills/principle-model-the-domain/SKILL.md) | 架构 | 将领域编码到结构中，而非散落的条件判断。 |
| [boundary-discipline](./skills/principle-boundary-discipline/SKILL.md) | 架构 | 把检查集中到系统边界，例如 CLI、配置、网络和外部 API；信任内部类型，把业务逻辑保留在纯函数中。 |
| [type-system-discipline](./skills/principle-type-system-discipline/SKILL.md) | 架构 | 让非法状态无法表示，为有语义的基础值加品牌类型，在边界解析外部数据，穷尽所有变体，从权威 Schema 推导。 |
| [make-operations-idempotent](./skills/principle-make-operations-idempotent/SKILL.md) | 架构 | 无论此前是否执行过部分步骤，都收敛到同一个最终状态。 |
| [migrate-callers-then-delete-legacy-apis](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | 架构 | 在同一轮迁移调用方并删除旧 API，不保留兼容层。 |
| [separate-before-serializing-shared-state](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | 架构 | 先消除共享；只有单一共享写入者确实是不变量时，才从结构上串行化。 |
| [prove-it-works](./skills/principle-prove-it-works/SKILL.md) | 验证 | 完成任务之后、宣称完成之前应用。针对真实制品验证，例如运行功能、读取真实数值、检查差异；不要用替代物、自述或“它能编译”作为验证。 |
| [fix-root-causes](./skills/principle-fix-root-causes/SKILL.md) | 验证 | 将每个症状追踪到系统最先出错的位置，并在那里修复。只有所处理状态本身合理时，增加防护才算修复。 |
| [sequence-verifiable-units](./skills/principle-sequence-verifiable-units/SKILL.md) | 验证 | 应用于多步骤工作，例如批量处理、迁移、一系列相似编辑，也应用于提交和 PR 的堆叠方式。把工作拆成结束时都可验证的小单元，每个单元检查通过再进入下一个，按能向审查者自行证明的顺序交付。 |
| [test-behavior-not-implementation](./skills/principle-test-behavior-not-implementation/SKILL.md) | 验证 | 编写、修改或保留测试时应用。断言代码使用者可观察到的结果，使行为损坏时测试失败，只改变内部实现时测试仍然通过。 |
| [explain-the-number](./skills/principle-explain-the-number/SKILL.md) | 验证 | 信任、报告测量值或据此行动之前应用，无论测得的是加速、回退、吞吐量、延迟还是评估结果。找出限制它的因素，排除测到的并非你以为的工作这一可能。 |
| [guard-the-context-window](./skills/principle-guard-the-context-window/SKILL.md) | 委派 | 将大量内容交给子智能体；主线程只保留摘要，不保留原始载荷。 |
| [never-block-on-the-human](./skills/principle-never-block-on-the-human/SKILL.md) | 委派 | 继续推进，展示结果，让人事后纠偏；把确认留给不可逆行动。 |
| [encode-lessons-in-structure](./skills/principle-encode-lessons-in-structure/SKILL.md) | 元原则 | 把规则编码为 lint、元数据标志、运行时检查或脚本，不再增加文字。 |

</details>

## 此处未随附的内容

`poteto-mode` 引用了少量未随附的内容：

- `/deslop` 和 `deslop` 技能在 `cursor-team-kit` 插件中提供。
- `control-cli`，用于 CLI 和 TUI，以及 `control-ui`，用于浏览器、Electron 和 Web，也在 `cursor-team-kit` 中提供。
- `/create-skill` 是 Cursor 内置功能。Cursor 还提供内置 `/autopilot`，用于跟进一个 PR。在 `poteto-mode` 中，PR 状态请求则交给[跟进手册](./skills/poteto-mode/playbooks/babysit.md)。

如果希望使用全套能力，请在 pstack 之外一并安装 `cursor-team-kit`。

## 为什么没有计划技能？

Cursor 已经有一个很好的计划模式，与 pstack 配合得很好。不过就我个人而言，我不相信计划。最好的规格就是代码。如果你确实想制定计划，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 也涵盖它，但它不是默认流程。

## 让它成为自己的工具

`poteto-mode` 是我的风格。你可能并不想原样采用。

输入 [`/automate-me`](./skills/automate-me/SKILL.md)。它挖掘你近期的对话记录，根据实际工作方式起草 `<your-name>-mode` 技能，底层通过 pstack 路由。你保留 pstack 作为基础，并在 `poteto-mode` 旁边获得自己的路由技能。

模型也可以配置。输入 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)。它检测你能访问的模型，写入一条始终应用的简短规则，将各个角色，包括代码、判断、评审组，映射到模型。每个技能都会读取它，规则不存在时回退到合理默认值，因此你只需覆盖想改的部分。

默认值变化时，变化之前写入的规则仍会固定在旧默认值。删除对应角色的行，或删除整个文件，再运行 `/setup-pstack`。重新运行会保留模型与默认值不同的角色。

## 自动化

pstack 还随附了一个默认不启用的 [benny 自动化包](https://github.com/cursor/plugins/tree/2eaf46574b25cdf7ef8c849837099b866b7438ce/pstack/automations/benny)。benny 对 Slack 问题报告进行分流，再用真实 UI 证据复现并修复已确认的缺陷。它的文件没有注册为斜杠技能。

要设置它，请让 Cursor 阅读 [`FOR_AGENTS.md`](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/pstack/automations/benny/FOR_AGENTS.md)。设置过程把自动化包复制到目标仓库的 `.cursor/automations/benny/`，在目标仓库启用 pstack 以提供共享技能，并把用户配置保留在复制的包之外。benny 运行在 Cursor Automations 上，因此仅适用于 Cursor。

## 许可证

MIT
