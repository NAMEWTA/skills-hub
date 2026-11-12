---
name: dsh-code-review
description: 在 deepseek-harness 仓库审查拉取请求时使用，帮助审查者掌握本代码库的规范（AGENTS.md 约定、防御模式、ADR、质量门禁），以及仅靠代码无法看出的审查专项检查。
---

# 审查 DeepSeek-Harness PR

**本技能是指导，不是完整检查清单。** 核实并获取 PR 当前的基准与准确的头提交，然后运行 `pnpm --silent run change-scope --base <verified-base-ref> --head <verified-head-ref>`，再阅读差异及足够的周边代码，以理解设计。报告指出路径和有改动的层，但不能替代语义审查。改换目标分支或合并后，重新确定基准并重跑。优先考虑正确性、生命周期、安全和被破坏的必需行为，而非风格；简短审查中一个有依据的阻塞问题，胜过一串细枝末节。

**判断差异之前，先读要求。** 将变化路径对应到下方的产物，从[事实来源](#事实来源)打开各自负责说明的页面，然后才按这些要求阅读差异。凭记忆中的规则判断差异，正是违规漏过审查的原因。

## 事实来源

- [AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/AGENTS.md) 和 [packages/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/AGENTS.md)：仓库及包编写的长期规则。
- [docs/defensive-patterns/](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/README.md)：变更必须满足的架构要求及其背后的习惯。每页负责一种产物；阅读差异涉及的每一页：
  - [general.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/general.md)：时序、异步状态、值表示、共享责任归属、去中心化、重构、迁移、性能证据、释放、回调、子进程。
  - [package-surface.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/package-surface.md)：导出、包结构、构建面、依赖声明、解析钩子。
  - [remote-and-api.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/remote-and-api.md)：远程服务、`@Remote` 方法、API 分派、`packages/api` 中的业务责任归属。
  - [client-components.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/client-components.md)：客户端组件、插槽、存储、钩子、副作用、共享基础包。
  - [conversation-and-session.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/conversation-and-session.md)：投影读取、Session 保留、对话节点、渲染器。
- [docs/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md)：文档位置与文字纪律。
- [dsh-prose-standard](../dsh-prose-standard/SKILL.md)：注释、文档、提示词和可见字符串的必要覆盖与编辑判断。
- [dsh-ci-test-reliability](../dsh-ci-test-reliability/SKILL.md)：拥有资源、异步或不稳定的测试与夹具所需的隔离及防回归规则。
- [dsh-client-ui-ux](../dsh-client-ui-ux/SKILL.md)：产品用户可见 GUI 变化的反馈界面选择、叠加层安全、平台窗口适配与视觉设计变量纪律。
- [dsh-error-handling](../dsh-error-handling/SKILL.md)：失败分类、错误类与代码、工具失败、处理责任、隔离、状态保证及可操作报告。
- [dsh-session-projection](../dsh-session-projection/SKILL.md)：投影责任归属、状态大小、历史读取与迁移。
- [docs/testing.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/testing.md) 和[质量门禁参考](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/testing.md)：必要测试层级与门禁。
- [Agent Notes](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/README.md)：设计理由。与 Agent Note 不一致应作为设计讨论，而非自动否决。
- 双语变更要阅读 [translation-rules.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/translation-rules.md) 和 [terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/terminology.md)；扩展翻译技能不在自动审查范围内，只在用户明确调用时运行。

## 阻塞性要求

1. **新文字接受语义审查。** 使用 [dsh-prose-standard](../dsh-prose-standard/SKILL.md) 批判性地审查每处新增或修改的 Markdown 段落、JSDoc、注释、提示词、描述、诊断信息和可见字符串。对照负责的代码或行为，验证必要覆盖、准确性、位置和编辑质量；自动检查不能证明这些性质。
2. **文档与代码一致。** 配置、默认值、错误、传输字段、事件及公开行为，应在同一差异中同步更新包 README 与 JSDoc。注释陈述不明显的约定；实现旁白、测试步骤讲解、审查历史和重复理由，应标记为删除或链接到其唯一归属处。
3. **核心类型文档一致。** 主干或能力接缝词汇变化，要更新相应的[子系统](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/subsystems/README.md)页面和任何 `type-equiv` 条目。内部类型不需要目录条目。
4. **Cordis 责任归属与清理。** 审查 Cordis 插件代码或从其入口可到达的辅助函数时，加载 [cordis-styling-nitpicking](../cordis-styling-nitpicking/SKILL.md)，应用于变化行为及受影响消费者。检查三条 P0 规则：单例状态、未撤销的副作用，以及消费者完成前就释放清理所需依赖。验证每项新增注册贡献都通过 [packages/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/AGENTS.md) 要求的释放测试。
5. **具备必要证据。** 验证作者针对差异执行了[相关本地检查](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/AGENTS.md#run-relevant-checks-locally)，且 CI 覆盖穷尽矩阵；审查二者都无法发现的语义缺口。
6. **客户端界面文案由语言区域拥有。** 拒绝嵌入 JSX、模板、辅助函数返回值、无障碍属性或基础组件默认值的产品文字。要求有类型的字典键、标准 `t` 使用位置或显式本地化属性、`verify-client-ui-i18n`，以及每个受影响语言区域的行为证据；用户、模型和传输数据以及代码标识原样保留。

## 手工检查

- **UI 审查覆盖：** 对累积的可见差异应用 [UI 变更流程](../dsh-client-ui-ux/SKILL.md#required-review-loop)。针对变化属性及消费者，验证其[最低检查](../dsh-client-ui-ux/SKILL.md#受影响-ui-最低检查)。缺少必需检查仍是缺口；缺少可选报告则不是。普通变更不要求完整审计记录。只重查新增交互或已失效证据。已有测试、GUI GIF 和设计师／产品批准仍按原触发条件要求。
- **意图与接口约定：** 追踪每个变化接口的两端。确认实现与 PR 和任何 Agent Note 一致，包括错误、取消、责任归属及释放。
- **错误处理：** 对变化失败路径及其状态保证、最终用户可见报告应用 [dsh-error-handling](../dsh-error-handling/SKILL.md)。预期工具失败若会在没有 `error.name`／`error.code` 的情况下进入 `tool/result`，应指出。除非状态拥有者证明后续工作的前置条件成立，包括恢复之后，否则拒绝捕获后继续。
- **生命周期与并发：** 对异步初始化、回调、进程或拆除，应用 [defensive-patterns/general.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/general.md)。检查发布前竞态、等待期间取消、独立错误报告、回调隔离、重入前责任归属、完整脱离清理，以及达到静止状态后的释放。
- **范围、责任归属与必要性：** 先确定每个新增区别、字段、适配器、状态机、选项、防御性副本和兼容路径背后的必需行为。PR 新增的要求、检查或 Agent Note 是需要评估的设计选择，不是必要性的独立证据。接受另一种表示前，比较已有源字段、判别标记及其消费者；区分删除概念与搬迁其声明。把不必要的概念搬得更靠近拥有者，不是简化。按[根规则](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/AGENTS.md#conventions)质疑无关功能及推测性通用化。
- **能力与消费者匹配：** 追踪每个当前消费者，再按[包规则](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/AGENTS.md)指出泄漏到接口中的消费者专用行为。对于必需行为，如果局部实现增加的复杂性不多，遵循[责任归属规则](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/general.md#a-business-capability-owns-itself)，优先使用靠近生产者或消费者的已有扩展点；比较生产者拥有的声明合并方案与修改远端核心或共享类型声明的方案。也要指出反向问题：泛用服务（注册表、会话、agent）新增公开方法，而唯一调用者只有一个内部消费者，就是不必要的 API 扩张；应要求改为在构造时向该消费者传入私有能力闭包。
- **配置与公开选择：** 接受另一条 CLI 或配置透传前，追踪权威读取与优先级；转发的值可能在使用前就被覆盖。询问每个默认值、公开操作集合、格式或引入的外部概念有什么当前消费者证据或先例。缺乏证据时要求明确选择或延后。
- **模型视角：** 检查受影响模式下模型收到的准确提示词、工具模式、结果和诊断信息。指出超出模型任务的概念，再通过快照或端到端覆盖，逐字验证稳定文本，并验证动态行为。
- **强制执行：** 沿每条拒绝路径追到实际执行操作；测试能绕过模式、提示词、门面、包装或监听器顺序的直接及替代调用者。
- **借用与派生状态：** 按包约定确定每个保留值是借用还是拥有，再把通知及每个缓存、提示词、UI 回显、回放和查询视图追到文档说明的成功时点与权威来源。
- **上限覆盖最终操作：** 找到完整输出或保留结果的拥有者，包括包装与元数据。测试极小及恰好达到上限的情况、过大的单个块；字节上限还要测试多字节文本。
- **真实入口路径：** 相关情况下，测试应经过实际交付的 Loader、bin、worker、ACP 桥接或子进程。手动挂载插件发现不了无效的 Loader 导出；函数插件必须具名导出其命名空间，且不得有默认导出。
- **测试强度：** 断言应在目标回归上失败，并验证外部状态、日志、事件或释放，而不是重述实现或相信 agent 的报告。覆盖率必要，但不能证明场景正确。
- **测试可靠性：** 对拥有资源、异步、平台敏感或不稳定的测试，将 [dsh-ci-test-reliability](../dsh-ci-test-reliability/SKILL.md) 应用于真实 worker／任务拓扑、资源分配、全局状态恢复、同步、超时预算以及达到静止状态后的拆除。
- **负对照：** 每条变化的验收规则，都要验证故意构造的无效案例通过真实运行器执行时会失败。
- **已实施 Agent Notes 与交付现实一致：** PR 实施某篇提议中 Agent Note 时，在同一差异中移动并改写为现在时的交付状态，再对照实现验证路径、名称和机制。
- **对话记录变化：** 编辑器可见或模型可见变化应更新快照，或解释为什么没有适用快照。把预期输出差异当作行为变化审查，不当作格式噪声。
- **双语变化：** 比较两边的含义与术语；配对哈希通过不能证明翻译质量。

## 报告发现

说明缺陷、位置、影响和证据。局部缺陷在最小的相关差异范围内行内评论；跨领域架构、范围或整个审查的综合意见用 PR 级评论。分开阻塞项与建议，省略已由通过的门禁强制保证的问题。回复使用已有 GitHub 审查线程。收到审查时，验证每个主张，按技术依据修复或反驳，不做表演式附和。
