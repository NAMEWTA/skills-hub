# 可交互原型与可视化意图确认

`dev-prototype` 把已经对齐的文字需求转为可操作 HTML，让用户亲自验证“最后是否就该这样显示和工作”。已确认原型是本 change 可见布局与交互的首要依据；文档解释意图、约束与证据位置，任务安排实现。模拟原型不等于真实产品完成。

完整范围见 [Issue #5](https://github.com/NAMEWTA/skills-hub/issues/5)，源码见 [dev-prototype](../skills/dev/dev-prototype/SKILL.md)，来源与必要适配见[维护记录](../.agents/dev/changes/2026-11-17-dev-prototype/source-adaptations.md)，实际验证见[证据](../.agents/dev/changes/2026-11-17-dev-prototype/evidence.md)。

## 在开发流程中的分工

| 能力 | 负责的问题 |
| --- | --- |
| dev-intake / dev-grill | 用户要解决什么、范围与产品规则是什么 |
| dev-spec | 哪些行为、边界和结果必须成立 |
| dev-ui-design | 如何沿用项目组件、token、布局和交互规范 |
| **dev-prototype** | 用户实际看见并操作后，是否确认这就是期望效果 |
| dev-plan / dev-build | 按确认基线拆任务并实现真实能力 |
| dev-review / dev-verify | 产品是否与同版本原型及业务契约一致 |
| dev-handoff / dev-archive | 保留入口、资源版本、确认范围和证据 |

常见路线：文字需求与必要设计收敛 → 完整交互原型 → 实际走查与用户确认 → 计划/任务 → 实施 → 同场景验收。已有计划可以先存在，但任务描述不能覆盖确认原型；已有同内容、同范围的有效确认直接复用。

新增或实质改变页面、导航、交互的 change 先确认最终体验。纯文案小修、无可见变化的内部维护不强制虚构 UI；用户明确要理解 API/CLI/后台时，可用 HTML 状态和输入输出演示，标清它不是新增产品界面。只暂停依赖未确认体验决定的实施，其他已授权工作继续。

## 怎样使用

```text
使用 dev-prototype，完整读取这个 change 的最终需求、规格和设计。
沿用当前项目的布局、组件、配色、密度和交互习惯，生成可完整操作的 HTML。
把创建、修改、取消、失败、恢复和完成结果连起来，让我实际体验并确认。
确认后，后续任务与实现都以这个具体版本的原型为依据。
```

已有原型时，可以要求“核对是否覆盖全部需求，补全遗漏状态和旅程，保留已有认可，列出本轮变化并绑定完整资源与确认记录”。仍有开放问题时明确要求探索，例如“比较两个详情呈现方式”。探索保留完整界面变体、逻辑演练与轻量比选方法，不强制已定案任务重新做多个候选。

### 安装和 TUI

`dev-prototype` 从 `0.1.12` 起随 npm 包提供。在目标项目根目录更新整个 dev 领域，可让调用者与迁移后的方法同时生效：

```bash
npx @namewta/skills-hub@0.1.12 install --domain dev --dry-run
npx @namewta/skills-hub@0.1.12 install --domain dev
```

部分安装至少一起更新旧方法所有者和新入口：

```bash
npx @namewta/skills-hub@0.1.12 install --skill dev-build dev-prototype
```

完整流程建议更新整个 dev 域，让规格、UI、计划、实施、审查、验证和交接引用同时生效。安装器不自动安装兄弟依赖。运行 `npx @namewta/skills-hub@0.1.12` 进入 TUI；新技能位于 dev 域，可以用 `dev-prototype`、“原型”或“可视化”搜索和选择，与 `upstream-skills` 分组中的技能混选。TUI 沿用原有动态发现，无需注册表或新的交互界面。源码安装仍可运行 `node /path/to/skills-hub/install.mjs` 并使用相同参数。

安装器复制整个技能资源包；更新旧 dev-build 时四份原型方法随整包替换移出运行目录。用户已有 change 与业务原型不搬迁、不删除，详见[迁移说明](installation.md#开发原型入口迁移)。

## 交付、确认和内容版本

| 位置 | 用途 |
| --- | --- |
| `prototype/index.html` | 用户体验入口；简单场景自包含 |
| `prototype/` 的 CSS、JS、图片、字体等 | 完整体验资源；复杂场景可由当前项目工具链导出 |
| `prototype-review.md` | 需求覆盖、风格来源、实际走查、真实反馈、确认版本和缺口 |
| 现有 spec/design/plan/tasks/evidence/handoff | 按节引用同版本同场景源码，说明边界与实施安排 |

关键操作真实改变前端模拟状态，列表、详情、计数和反馈保持一致；失败/重试保留上下文，提供自由操作、必要 walkthrough 和确定性重置。外部能力使用明确的本地模拟，不产生真实邮件、服务器、付费或生产写操作。

生成完成、浏览器走查通过、用户确认是三个不同事实。只有用户针对实际版本和范围的明确认可才可记录确认；Agent 自检、自点按钮、沉默、文字方案认可或一般开发授权不能代签。自然语言反馈足够，不强制指定句式或审批系统。部分认可不能覆盖未展示旅程。

固定提交或可恢复快照必须包含完整资源。CSS/JS/资产变化同样影响体验，不能只靠 HTML 文件名或手写“v1”。包内工具可计算并复核整个目录：

```text
node .agents/skills/dev-prototype/scripts/fingerprint.mjs .agents/dev/changes/<日期-主题>/prototype
node .agents/skills/dev-prototype/scripts/fingerprint.mjs .agents/dev/changes/<日期-主题>/prototype --expect <64位SHA256>
```

工具只用 Node 标准库，按排序后的相对路径与文件内容计算 SHA-256。增删、修改、改名改变摘要，目录移动和修改时间不影响。需要至少一个 `.html`/`.htm`，拒绝空目录、符号链接和特殊文件，全程只读。

**指纹不是用户确认、浏览器验收或旧文件备份。** Git/快照仍须保留旧版本，记录与输出放在原型目录之外，目录外/远程动态依赖另行锁定和说明。改动后定位影响、保留旧确认，再更新相应引用与认可；不能只替换旧记录的摘要。

## 实施怎样对照

用户最新明确决定优先；已确认原型决定覆盖范围内的可见效果，规格仍约束业务、安全、权限、数据、性能和未在 HTML 中表达的规则。发现冲突或原型缺陷要明确解决，不机械复制错误，也不能让 mock 成功取消生产要求。

说明文档逐节定位真实 HTML 节点、CSS 选择器/token、JS 函数/事件与场景。单文件 HTML 内的 style/script 同样是证据；只给首页链接、截图或形容词不够。正式产品在同页面、同状态、同视口、同主题下对照；可以适配生产技术栈，不能自行改变已确认体验。任务全部勾完不代表结果一致。

随包[采购申请完整示例](../skills/dev/dev-prototype/references/design-evidence-example.md)展示筛选、选择、dialog、焦点、失败重试和响应式的精确源码引用。它只教证据定位，未经用户确认，不是项目默认皮肤，也不是完整 change 确认原型。

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


## 最新研究与收录基线分开

Matt 与 pstack 最新研究提交比父清单更新，但本次四个原型文件的本地字节、子清单、固定提交 API 与最新提交 API 四方 Git blob 完全相同。Speculo 已收录快照与当前核验提交一致。因此复用完整原件与中文对照，不全量同步材料、不移动父清单 SHA。

只更新实际运行归属与本次真实核对依据。完整探索方法从 dev-build 唯一迁入 dev-prototype，来源方法仍完整保留。其他官方/开源文章只作方法参考，未复制全文、导入整库或成为运行依赖。

既有 Speculo、Matt、pstack 法律原文继续保留于 licenses 与原始材料；采购例子只分发必要 HTML/CSS/JS，不带设计画廊的第三方图片、字体、图标库或无关 demo。见[第三方声明](../THIRD_PARTY_NOTICES.md)。

## 验证边界

结构检查证明预算、命名、资源、映射和唯一归属；行为检查证明指纹、安装与 TUI 操作。独立使用任务检验技能是否能按现有项目风格生成完整交互 HTML并诚实记录待确认。实际结果与限制写入[证据](../.agents/dev/changes/2026-11-17-dev-prototype/evidence.md)，不把结构检查、模拟状态验证或示例原型等同于真实用户认可。

