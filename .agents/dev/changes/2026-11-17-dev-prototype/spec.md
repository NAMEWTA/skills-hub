# Issue #5：可视化意图确认

来源：https://github.com/NAMEWTA/skills-hub/issues/5

本文保留 Issue 创建时的需求与验收规格；实际执行结果见 [evidence.md](evidence.md)，合并和关闭状态见关联 Issue/PR，不在此另维护一份流程状态。

## 背景与目标

当前 change 已有文字意图对齐、规格、UI 设计、切片和实施能力，但缺少独立的**可视化意图确认**入口。文字理解一致，不代表用户脑中的最终布局、操作顺序和反馈结果一致。

新增 `dev-prototype`：在完整读取已确认需求、讨论、规格、设计和边界后，沿用当前项目的真实视觉与交互基线，生成能覆盖本 change 用户旅程的可交互 HTML；先实际走查，再让用户体验和确认。**用户确认过的原型是可见布局与交互的首要实施依据，文档负责解释与定位，任务清单负责安排工作。**

本 Issue 同时授权完整实施、提交 PR、验证后合并 main，并关闭关联 Issue；不包含 npm 发版。开发这个技能本身不需要额外获得一份虚构“业务原型确认”，未来执行技能时也不得把本 Issue 的授权当成某个具体原型已被认可。

## 当前代码基线与缺口

核验日期：2026-11-17。skills-hub main：`6fb7f89a87e741b2366f5a69eeb17f308a1508c8`。

- `dev-intake` / `dev-grill` 负责来源、目标和产品决定，不能代替用户实际操作确认。
- `dev-ui-design` 负责现有组件、token、布局与状态；目前原型路由交给 `dev-build`。
- `dev-build/references/{prototype-method,ui-prototype,logic-prototype,prototype}.md` 主要是探索性、一次性原型，部分步骤要求少做错误处理、只回答一个问题、隔离保存；不能原封不动用作最终 change 确认基线。
- `dev-workflow` 等入口存在“已有规格直接实施”的捷径，应补上适用的确认基线核验，防止只调用 build 绕过可视化对齐。
- 计划/验证已有原型源码定位的有用内容，应沿用并补齐确认版本链，不另建一套流程系统。
- 安装器和 TUI 根据 `skills/<domain>/<domain>-xxx/` 动态发现，无需人工技能注册表；仍须验证搜索、选择、整包安装和 npm 包覆盖。

## 调研与具体参考

以下区分**实际复用的本地材料**与**本次最新调研**。不以查阅最新上游为由移动整个 materials 父清单，不冒称所有运行技能已同步最新版本。

| 来源 | 精确参考 | 采用与适配 |
| --- | --- | --- |
| Speculo，固定 `994a64427a6784053dd092a86713870062cfde2f` | [原型入口](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-p-prototype/SKILL.md)、[设计证据方法](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-p-prototype/references/design-evidence.md)、[完整引用示例](https://github.com/NAMEWTA/Speculo/blob/994a64427a6784053dd092a86713870062cfde2f/template/workflows/specdev/specdev-p-prototype/references/design-evidence-example.md) | 主要骨架：实际 UI/CSS/JS 直接证据、逐节定位、固定版本、实施后同场景对照；路径适配为 `.agents/dev/`。 |
| Matt Pocock，最新调研 `5863806dd4e15c63174bee4e7515a4256792ecfa`；本地材料固定 `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` | [prototype](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/prototype/SKILL.md)、[LOGIC](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/prototype/LOGIC.md)、[UI](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/prototype/UI.md) | 保留完整探索方法；复用单 HTML、领域语言、自由操作、场景 walkthrough、确定性重置和现有应用 shell。一次性原型、默认多候选、忽略错误处理不适用于最终确认分支。 |
| pstack，最新调研 `3fa33bb0f927bea2ccacd48a3cfda95145fb6bae`；本地材料固定 `2eaf46574b25cdf7ef8c849837099b866b7438ce` | [原型 playbook](https://github.com/cursor/plugins/blob/3fa33bb0f927bea2ccacd48a3cfda95145fb6bae/pstack/skills/poteto-mode/playbooks/prototype.md)、[Experience First](https://github.com/cursor/plugins/blob/3fa33bb0f927bea2ccacd48a3cfda95145fb6bae/pstack/skills/principle-experience-first/SKILL.md)、[视觉对齐](https://github.com/cursor/plugins/blob/3fa33bb0f927bea2ccacd48a3cfda95145fb6bae/pstack/skills/poteto-mode/playbooks/visual-parity.md) | 实际驱动交互、观察结果、保留证据、避免修改基线迁就实现；不将探索原型的可丢弃定位或特定迁移场景的零像素差异强加到所有 change。 |
| OpenAI | [Figma 实施技能](https://github.com/openai/skills/blob/0e7823cca07bc2cbf34718a383f9ae92525be6a5/skills/.curated/figma-implement-design/SKILL.md)、[项目设计系统与浏览器验证](https://learn.chatgpt.com/use-cases/frontend-designs)、[页面内反馈与迭代](https://openai.com/index/codex-for-almost-everything/) | 提取具体设计上下文，适配项目框架和 token，浏览器核对状态和视口；不要求 Figma 或特定桌面宿主。 |
| Anthropic / Claude | [frontend-design](https://github.com/anthropics/skills/blob/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design/SKILL.md)、[web-artifacts-builder](https://github.com/anthropics/skills/blob/ef740771ac901e03fbca3ce4e1c453a96010f30a/skills/web-artifacts-builder/SKILL.md)、[应用开发 harness](https://www.anthropic.com/research/harness-design-long-running-apps)、[端到端验证](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) | 遵循已有视觉 brief，可多文件开发并交付 HTML，按用户路径实际操作；不复制固定 React/Tailwind/shadcn 栈、可选测试策略或三代理架构。 |
| Google / Gemini | [Gemini Canvas](https://blog.google/products-and-platforms/products/gemini/gemini-collaboration-features/)、[Stitch](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/) | 可预览代码、即时修改、串联屏幕与用户旅程、保留设计上下文；不依赖平台账号或临时平台 URL。 |
| obra/superpowers，`22f0b463e7a5e579904dd6211a520321035526f7` | [visual companion](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/brainstorming/visual-companion.md) | 区分视觉问题与概念澄清，用户真实反馈是主证据，点击日志不能代替批准。只作方法参考。 |
| GitHub Spec Kit，`e210504aa09c9273a38bba665b12b8088468c96f` | [spec template](https://github.com/github/spec-kit/blob/e210504aa09c9273a38bba665b12b8088468c96f/templates/spec-template.md) | 用户旅程、独立验证、Given/When/Then 和边界覆盖；只作方法参考，不引入其流程系统。 |

**归因边界：** 以上来源支持设计上下文、交互反馈和真实验证；“确认后的 HTML 优先于可见效果的文字转述与任务清单”来自本次用户要求，不宣称是三家公司的共同官方标准。

## 技能职责与流程

### 默认：change 确认原型

1. 完整理解当前 change 的已确认来源、需求、规格、设计、业务规则及非目标；沿用决定，不重复访谈。矛盾先定位，只阻塞受影响部分。
2. 检查当前项目真实页面、导航、组件、token、字体、间距、图标、密度、主题、响应式和交互惯例，记录具体代码/截图来源。技术栈名称不等于设计风格，不擅自换肤。
3. 把本次全部需求映射到“用户旅程 → 原型入口 → 动作 → 状态/结果 → 异常/恢复 → 后续验收”。按适用范围覆盖空、加载、成功、错误、权限、禁用、取消、返回、重试、长内容与键盘焦点；不存在的状态说明不适用，不凭空扩大产品。
4. 默认交付 `prototype/index.html`。简单原型自包含；复杂原型允许项目现有构建方式，但必须保留完整本地 HTML/CSS/JS/资源、可靠启动方式和确定版本。不能只给截图、外链、需要临时会话的链接或必须登录才能体验的空壳。
5. 每个关键动作必须改变真实的前端模拟状态并产生可见结果，不能仅弹 toast 或堆死按钮。提供确定性 fixture、自由操作、必要的场景引导与重置。模拟连接/邮件/支付等不产生真实外部副作用。
6. 在可用浏览器中走通全旅程，检查页面/状态/视口/主题/键盘与必要控制台信息并修复。工具不可用时记录未验证，不能冒称通过。
7. 向用户交付可体验结果和明确的待确认范围。记录真实反馈、具体版本和确认范围；自动测试通过、Agent 自己点击“确认”、沉默或含糊评价都不等于用户批准。
8. 确认后冻结并长期保留此版本，向 spec/design/plan/tasks/build/review/verify/handoff 传递同一组入口、版本、场景与源码定位。原型变更后识别受影响确认范围；不得继续冒用旧确认。

### 探索分支

现有四份探索方法整体迁到 `dev-prototype`，保留完整方法和条件，不复制为第二套正文。只有明确解决未决问题或比较候选时进入探索；候选选定后，涉及本 change 最终效果的部分仍须形成确认原型。探索结果不能自动升级为最终用户确认。

## 权威关系与例外

- 用户最新明确决定优先。
- 已确认原型决定其实际覆盖范围内的布局、组件组合、交互、状态反馈及用户旅程。
- 规格/设计说明负责业务规则、权限、数据一致性、性能、安全和未由 HTML 表达的边界。原型不能取消这些要求；模拟成功不证明后端实现成功。
- 任务清单安排实现，不重定义效果；文档按章节引用原型，而非只在文首放一个链接。
- 冲突不能静默任选、修改基线来掩盖偏差或宣称“只是 demo”。新决定需同步原型和相应说明。
- 纯文案小修、没有新可见交互的内部重构，不强制虚构一个 UI。如果用户明确要求可视化对齐，即使是 API/CLI/后台流程，也用 HTML 状态/输入输出模拟解释其行为，标清它不是新增产品界面。
- 已有同版本、同范围的有效用户确认可直接沿用，不重复审批；缺确认只限制依赖该体验决定的实施，继续不依赖它的已授权工作。

## 产物与版本

默认使用同一 change 目录：

- `prototype/index.html` 及必要本地资源：首要交互依据。
- `prototype-review.md`：来源与风格证据、需求/场景覆盖、实际走查、用户反馈与确认版本、未覆盖项；可复用现有记录，无需固定多表审批。
- 现有 `spec.md` / `design.md` / `plan.md` / tasks / evidence / handoff：就近引用上述依据，不重复大段内容。

版本采用固定提交/可核对快照；可提供 Node 标准库内容指纹工具，为整个原型资源目录生成确定性 SHA-256 并核验 `--expect`。指纹只证明文件内容是否变化，不证明用户确认、页面可运行或真实业务正确；不引入流程 JSON、审批引擎或必填状态机。

## 实施范围

- 新增技能入口、UI 元数据、完整确认方法、原型证据引用方法、最小记录模板与必要确定性工具。
- 原型探索方法从 dev-build 唯一迁入 dev-prototype；迁移记录与 materials 子清单同步，保留原始 upstream/zh 字节和既有许可，不无关同步来源。
- 联动 intake、grill、spec、ui-design、workflow、plan、build、review、verify、handoff、help 的路由、模板和实际方法，防止入口与完整参考矛盾。
- 更新 README、开发流程、方法归属、安装/迁移、持久化导航、来源研究与适配说明。来源名/URL 放仓库文档，运行技能仍为本项目中文内容。
- 动态发现继续沿用现有实现；验证 CLI/TUI 中文搜索和选中、单技能/完整 dev 安装、完整资源随 npm 打包。
- 保持 Node.js 22.14+、`.mjs/.js`、技能预算和现有领域边界；不引入前端框架或额外运行依赖。

## 验收清单

- [ ] 新技能能正确区分文字澄清、UI 设计、探索原型、最终可视化确认与正式实现。
- [ ] 最终确认分支覆盖完整用户旅程、项目视觉基线、实际状态变化、异常恢复和重置。
- [ ] 用户确认绑定实际可查看的具体资源版本；修改资源后旧确认不能静默复用。
- [ ] 未确认/工具不可用/只完成部分场景都如实记录，不代签、不冒称通过。
- [ ] 同一原型版本进入规格、设计、任务、实现、审查、验收、交接和归档。
- [ ] 旧原型正文唯一迁移，调用者和源码映射无悬空链接或相反指令。
- [ ] 独立场景执行检验新技能的选择、产物和边界；观察可交互原型的正常与失败路径。
- [ ] 指纹工具若提供，验证资源改动/增删/重命名、目录顺序稳定性和异常输入。
- [ ] 统一检查与必要完整回归、安装、TUI 发现和 npm tarball 检查通过。
- [ ] PR 对应提交的 GitHub CI 成功后合并 main，核实 PR 为 merged、Issue 为 closed。

## 交付

先提交本 Issue；按上述范围实施并独立审查，补齐源码与验证记录；PR 使用 `Closes #本Issue`，在实际检查通过后按用户授权合并。最终报告给出真实 Issue/PR/合并提交链接、验证证据以及是否已发版。

