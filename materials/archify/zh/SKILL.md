---
name: archify
description: "创建经过校验、可探索的独立 HTML 架构图、工作流图、时序图、数据流图、生命周期/状态图、ERD、类图、树图、时间线和瀑布图，支持深浅主题、动态效果及图片/SVG/WebM 导出。接受需求或 Mermaid；为基于代码的图检查仓库证据。还可用有源码依据的 Code Analysis 调查本地仓库的架构健康度、耦合和重构范围。适用于可视化系统、API 调用、流水线、schema、历史、时序，以及日常步骤、组成、关系和状态。当用户要求页面、讲解页或可分享的答案（做成一页、用页面讲）时，也可把答案制作成结论在先、包含结构化面板、原生图和图表的一页讲解；对于复杂流程、诊断、比较或测试报告，默认也会主动生成；规则行 [archify explainer: on-demand] 可限制为仅在请求时生成。可选为已有原生图添加引导演示和视频导出。不适用于仪表板。"
license: Apache-2.0
metadata:
  version: "3.3"
  author: tt-a1i
---

<a id="archify"></a>

# Archify

创建经过检查的 HTML，形式可以是原生图、讲解页、故事或独立的 Code Analysis 工作台。

从工作目录运行命令。除非用户指定其他位置，否则为每次新的产物请求，在工作目录中建立独立的 `.archify/<type>-<slug>-<YYYYMMDD-HHMMSS>/` 文件夹（使用当地时间，只选择一次）：将候选文件和 `<slug>.html` 保存在其中，修复时复用该目录。原生图表使用 `candidate.json`，其中 `meta.output` 相对于工作目录；解释页可以使用 `candidate.archify.md` 和可移植的输出文件名。之后的新请求使用新文件夹。把所有命令中的 `bin/archify.mjs` 替换为已安装包的绝对路径，或相对于工作目录的路径；CLI 的输入和输出路径都从该工作目录解析。

为真实代码库创作原生图表时，在追踪请求涉及的行为时阅读[仓库创作](references/repository-authoring.md)。系统描述使用下方原生创作步骤；冻结的候选文件使用交接路径。

<a id="choose-the-artifact"></a>

## 选择产物

- 绘制系统、流程、schema 或历史时，使用原生图和类型路由表。通过 `finalize` 交付用户要求的图；代码分析是独立模式。
- 需要调查本地仓库架构健康度、模块耦合、循环、分层违规、大文件、复杂度热点或重构方向时，使用下方 Code Analysis；由 agent 处理命令，不需要架构 JSON。
- 要在一个或多个原生图上制作引导演示、动画/静态双主题 SVG、交互舞台播放器或 1080p MP4/WebM 视频，阅读[故事编写](references/story-authoring.md)。用 `story draft`/`attach` 为原生 Viewer 添加播放；用 `story validate`/`svg`/`stage`/`video` 进行声明式组件编排。
- 仅当用户明确要求解释或可视化拉取请求、分支变更或 `git diff`，要求将变更图附到 PR，或点名已安装的配套技能 `archify-pr` 时，先阅读 [PR 审查编写](references/pr-review.md)：它涵盖三点差异、带变更标记的合并超集视图，以及 `pr validate` / `pr build` / `pr attach` 循环。
- 用户要求用页面呈现答案时使用 `explainer`：页面、一页、讲解页、可分享内容（“做成一页”“用页面讲”“answer with a page”）。
- Explainer 模式默认为 `proactive`。上下文中的规则行 `[archify explainer: <mode>]` 可选择其他模式；对话中的指令在本次对话内覆盖该规则。
  - `proactive`（默认，无需规则行）：如果答案属于复杂流程或过程、诊断或排障结果、选项比较、取舍或决策、测试或审查报告，或计划，并且需要表格、步骤或多个章节才能清晰阅读，即使用户没提要求，也生成页面。
  - `on-demand`：只在用户要求时生成页面；否则用文字回答，或绘制所请求的图。
  - `always-on`（必须主动选择）：每个得出结论的回复都附一个最多四个面板的紧凑页面。
- 所有模式下，页面都需要有结论及其支撑结构。闲聊、简短或单行回答、例行状态更新（“完成，测试通过”）、原始命令输出、用户请求的原生图，以及用户要求只用文字或不要页面的回复（“只要文字”“不用做页面”），均不生成页面。每次回复最多一页；用户点名其他页面工具，或其他技能已为该回复制作页面时，不再生成。
- 只有用户要求改变模式时（“只在我要求时做页面”“always make a page”），才在当前 agent 的全局规则文件（如 `~/.codex/AGENTS.md`、`~/.claude/CLAUDE.md` 或 `~/.config/devin/AGENTS.md`）写入或替换一行 `[archify explainer: <mode>]`，并说明文件名，例如 `[archify explainer: on-demand] Make Archify explainer pages only when I ask for one.`；删除该行会恢复 `proactive`。绝不能在用户未要求时切换为 `always-on`。
- 使用 `explainer` 时，阅读[讲解页编写](references/explainer-authoring.md)，了解结论、理由、范围、面板布局和可选原生图。先写完整草稿，再运行 `finalize explainer` 完成校验、原子交付和制品检查。局部内容修订使用 panel patch。

<a id="existing-candidate-handoff"></a>

## 已有候选文件的交接

用户提供冻结的候选文件时，首先以一次 CLI 调用运行 `finalize`。通过的回执即表示自动化门禁完成；声称视觉质量之前，遵循“交付”中的视觉审阅建议。需要修复时，按第 5 步处理。

`finalize` 在交付回执中包含一次有界的更新检查；参见“更新感知”。

<a id="native-diagram-authoring"></a>

## 原生图表创作

普通生成使用此路径。只有满足指定触发条件时，才阅读分支参考。

1. 根据问题选择 `architecture`、`workflow`、`sequence`、`dataflow`、`lifecycle`、`erd`、`class`、`tree`、`timeline` 或 `waterfall`。
2. 直接使用类型路由表中的精确 schema 和示例路径，不要列出它们所在目录。将[编写默认规则](references/authoring-defaults.md)和该模式示例作为有界批次阅读，与项目文档和完整 schema 分开，避免任何一部分被截断；写作前补读缺失章节。新建 Architecture 时使用 `"layout": {"mode": "auto"}`，把组件位置交给渲染器。组件和关系字段取自匹配的 showcase 示例。保留用户提供的布局。除 Architecture 外，每种模式还需阅读该模式及 common schema。选择任何新字段、枚举或受约束文本前，先阅读相关 schema 定义，尤其是边界类型。示例用于学习结构，不代表事实。使用全新的 ID、措辞和布局。直接编写候选，不要先运行 help、doctor、起始样例校验，不要制作临时图或列出输出路径。只有明确要求某个品牌标志时才查询 brands；若用户提供了未知标志的 URL，阅读[品牌标志](references/brand-marks.md)。
3. 覆盖用户要求的范围，并在真实代码库场景下取得[源码证据](references/repository-authoring.md)后，直接写出完整候选，不要先用文字规划坐标。在坐标之前，先根据编写默认规则选择 Architecture 的抽象层次和连通布局：展示主要用户路径和必要分支，保留控制角色与会改变行为的条件，并为实际关系标签留足空间。节点、关系、来源、视图、卡片或边界的数量都不是目标或上限。先使用自动路由；只有必要分支、返回路径、用户给定几何约束或测量后修复需要时，才添加显式路由。除非用户要求密集的 `standard`，否则把 `meta.quality_profile` 设为 `"showcase"`。对于自动画布、自动放置和自动路由的网格 ERD，省略 `layout.entityW` 和实体 `width`，让宽度适应字段。如果使用固定 view box、固定表或手动路由，则为宽表显式指定尺寸。ERD 采用表格优先布局：在 `entities[].attributes` 中展示每个物理列，保留 SQL 类型和来源注释，说明每列承担的所有键角色（`key` 可接受单个角色或列表，因此连接列是 `["pk", "fk"]`，每个 `fk` 列还需 `references`，如 `"orders.id"`），绝不以把列移到卡片中代替表格。放置前按功能域分类表，为每个域设置简短的 `tag`，把域内成员放成一个实心网格矩形——单行、单列或填满的矩形块，不能是 L 形或对角线。有标签的表始终需要 `row`/`col`，因为绝对坐标没有网格单元；如果一个域的表不能填满一个矩形，就无法绘制域带：渲染器会报告 `erd/domain-not-drawn`，而不是发布无法标明域名的图。多域 schema 最适合每列一个域——每个 `tag` 为一段纵向排列——因为阅读器会把宽画布放大到阅读区域宽度，却会缩小高画布以让整页适配，因此宽布局更能在笔记本视口内保持完整清晰。以 schema 为先、超过约 8 张表或 50 个字段的 ERD 本身就是密集地图：第一次完整字段版本应使用 `standard`，只有布局仍清晰可读时才升级。
4. 完整的第一版候选写好后，直接运行 `finalize`。其第一道门禁是 showcase 校验；成功的初稿不需要单独预校验。命令运行期间保持候选不变：

   ```bash
   node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
   ```

   对于基于仓库的候选文件，首稿就要带上证据，并使用完整的首次命令：`node bin/archify.mjs finalize <type> <candidate.json> <output.html> --repo-root <repo-root> --quality showcase --json`。传入与 `meta.quality_profile` 一致的 `--quality`，例如密集 ERD 首稿的 `standard`。

   通过的回执证明内含的 `validate`、`deliver`、严格 `check` 和真实浏览器 `browser-check` 门禁均已通过。使用它的简短摘要；只有另有请求或需要针对失败定位时，才运行独立命令。Architecture finalize 通过且带有 `codeAnalysisOffer` 时，在交付摘要末尾用用户语言附上[架构诊断章节](references/delivery-contract.md#architecture-diagnosis-offer)，同一任务中每个仓库只出现一次。用户已请求或已拒绝分析时跳过。等待肯定答复后再执行所提议的命令。

5. 非零退出绝不代表成功。阅读精简 stdout 或 `evidence.summaryReceipt`，然后[修复失败的门禁](references/delivery-contract.md#failed-finalize-and-candidate-repair)，包括遵守其修复次数限制。保留请求含义与源代码证据。多条纠缠的 Architecture 路由，阅读[架构布局修复](references/architecture-layout-repair.md)；测得的字段或几何失败，阅读[创作契约](references/authoring-contract.md)。编辑相互连接的邻域，并重新运行第 4 步完整的 `finalize` 命令。一旦某次运行已经到达 `browser-check`，输出路径就拥有了该证据：之后每次运行都要使用自己的 `--out-dir <folder>/review-<n>`。

<a id="update-awareness"></a>

## 更新感知

`finalize` 和单独运行的 `deliver` 都在回执中包含 `update`。不要为同一次交付再单独检查。若 `update.noticeRequired` 为 true，阅读 `references/update-awareness.md`，并在最终回复里保留一条简短的更新提示，即使质量门禁失败也一样。一个任务包含多个图表时，只在最终回复中提示一次。只有用户明确要求时，才能暂缓或忽略提醒；绝不自行安装或更新。

首个候选文件之前，使用创作参考和相关仓库源码，而不是 Archify 的实现或测试。针对性修复后，诊断仍无法指导行动时，才检查 Archify 实现。

<a id="type-router"></a>

## 类型路由

| 类型 | 用途 | Schema | 示例 |
|---|---|---|---|
| `architecture` | 组件、服务、云／安全边界、基础设施；日常事物由什么组成 | `schemas/architecture.schema.json` | 系统描述、服务、库和 CLI 仓库：`examples/web-app.architecture.json`；部署仓库：`examples/production-deployment.architecture.json` |
| `workflow` | 流程、审批门禁、工具调用、操作手册、CI/CD；计划和逐步生活流程 | `schemas/workflow.schema.json` | `examples/agent-tool-call.workflow.json` |
| `sequence` | API 调用链、请求生命周期、异步追踪、返回；人与人之间的往返沟通 | `schemas/sequence.schema.json` | `examples/cache-miss-request.sequence.json` |
| `dataflow` | 流水线、ETL/ELT、血缘、治理、消费者；资金或文档流向何处 | `schemas/dataflow.schema.json` | `examples/product-analytics.dataflow.json` |
| `lifecycle` | 状态／阶段转换、重试、等待和终态；申请或订单当前处于哪里 | `schemas/lifecycle.schema.json` | `examples/deployment-release.lifecycle.json` |
| `erd` | 表／实体、属性、主键／外键／唯一键，以及它们之间的基数 | `schemas/erd.schema.json` | `examples/orders.erd.json` |
| `tree` | 单父级包含关系：仓库／模块树、能力或功能拆解、组织式分解 | `schemas/tree.schema.json` | `examples/payment-platform.tree.json` |
| `class` | 类、接口、选定成员，以及类型之间的依赖／关联／继承／实现／组合关系 | `schemas/class.schema.json` | `examples/payments.class.json` |
| `timeline` | 事情何时发生：事故复盘、版本历史、按比例时钟上的时间戳事件，每个来源一条泳道 | `schemas/timeline.schema.json` | `examples/payment-incident.timeline.json` |
| `waterfall` | 时间花在哪里：同一请求或 agent 运行中，各跨度的耗时、重叠和嵌套，使用共同时间轴 | `schemas/waterfall.schema.json` | `examples/checkout-request.waterfall.json` |

难以在原生图表类型之间选择时，运行 `node bin/archify.mjs guide "<scenario>" --json`。场景证明示例是结构参考，不是可复制的事实。

对于日常主题，保留相同图表模式与语义类型，再用读者熟悉的方式命名：按照[节点图标](references/authoring-contract.md#node-icons)使用日常 `icon` 值和 `meta.legend` 标签。缺少个人事实时询问，不编造日期、金额或规则。

<a id="mermaid-input"></a>

## Mermaid 输入

阅读 Mermaid 以理解拓扑和含义，再创作全新的 Archify JSON；不要机械套用 Mermaid 样式。

- `flowchart`／`graph` → `workflow`；如果是组件地图则用 `architecture`。
- `sequenceDiagram` → `sequence`；参与者成为语义参与者，箭头成为消息。
- `stateDiagram` → `lifecycle`；状态与转换保留含义，不保留 Mermaid 样式。
- `erDiagram` → `erd`；实体和关系名称、键与基数保留含义，不保留 Mermaid 样式。
- `classDiagram` → `class`；类型种类、选定成员和关系种类保留含义，不保留 Mermaid 样式。

<a id="delivery"></a>

## 交付

首个候选文件和每次修复之后，都使用上面的 `finalize` 命令。

`finalize` 在第一道未通过的门禁停止。其精简 stdout 和 `<output-stem>.finalize-summary.json` 是常规证据。成功运行不会创建截图，并报告 `visualReview: "not-requested"`。

通过的 Architecture 回执报告 `visualReviewRecommendation.signals.resolvedCrossovers` 时，先保存候选，再按[架构布局修复](references/architecture-layout-repair.md)处理。如果多条线穿过读者的主要路径，应把相连的主要步骤按顺序放置，并把各分支放在其所属组件旁。利用提示定位受影响关系。只修改一次节点位置和大小：每个节点、关系（包括 `from` 和 `to`）、标签和来源都保持原样。用 `--out-dir <folder>/review-2` 完整重跑一次 `finalize`，因为先前 HTML 已拥有自己的浏览器证据。`--out-dir` 改变新 browser-check 和默认 finalize 回执的位置，不改变 HTML 或其交付回执的位置。交付成功会在所请求输出路径重写这对文件；更早的审查证据仍绑定原制品字节。参见[审查证据路径](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path)。如果本次运行失败、报告更多交叉，或交叉相同但 `signals.routesOverSuggestedBends` 更多，则恢复保存的副本，并用 `--out-dir <folder>/review-3` finalize。不要开启第二轮位置调整。仅涉及额外弯折的提示可选处理。

当 `layoutReviewRecommendation.action` 为 `inspect-sequence-width` 时，交付新创作的 Sequence 前，遵循[时序图宽度审阅](references/delivery-contract.md#sequence-width-review)。

项目 README 默认交付静态 SVG。如果用户明确要求链接或交互式 HTML，则遵循其要求。使用 Chrome 或 Chromium，通过 `node <skill-dir>/bin/export-svg.mjs <diagram.html> <image.svg> [auto|light|dark]` 将已完成 HTML 导出为新文件。如果答案依赖小标签或 Viewer 卡片，应交付可直接粘贴的 Markdown 图片，并用正常字号的简短图注回答问题。

为 README 或项目文档交付图时，按预期阅读尺寸检查成品。从起点沿箭头走完回答请求所需的每个返回或分支。对照源码核实条件步骤、字段和检查，并在读者看到相关论断的位置写明条件。修复断裂的阅读路径并检查结果。涉及多个运行时或有条件交接时，使用[读者检查](references/repository-authoring.md#check-the-readers-answer)。

普通生成可选进行感知审查。需要可复现审查，或存在具体路由/浏览器问题时，使用[可选截图证据](references/delivery-contract.md#optional-capture-evidence)，并指定 `--out-dir <folder>/visual-check`。`visualReviewRecommendation` 仅供建议。声称视觉质量前必须检查截图；没有进行感知审查时，任何检查结论都应明确属于自动化检查。

门禁失败、单项命令、溯源／恢复、重复交付、导出或打开方面的问题，阅读[交付契约](references/delivery-contract.md)。原生图表恢复遵循 `deliver` → 严格溯源 `check` → `browser-check`；截图要求严格溯源。解释页交付按其创作指南采用 validate、deliver 和 check。

工作流视口溢出时，下一次布局编辑前阅读[工作流视口修复](references/authoring-contract.md#workflow-viewport-repair)。

报告验证细节时，区分产物检查、浏览器证据、截图和真正的感知审阅。用户明确请求立即预览或持续桌面循环时，参见[可选打开](references/delivery-contract.md#optional-opening)。

<a id="code-analysis-local-repository-architecture"></a>

## Code Analysis（本地仓库架构）

调查仓库时，运行 `node bin/archify.mjs code-analysis prepare <repo-root> --out <analysis-dir> [--locale zh-CN|en] [--language ts|py|java|go|rust]`。中文对话使用 `--locale zh-CN`。命令生成 `analysis/repo.analysis.html`，其中含有基于源码的工作台、交互式 Atlas 和捕获的 AI 任务，然后退出。不需要架构 JSON，也不需要编写图。普通画图请求以 `finalize` 交付结束；用户请求调查时才运行分析。仅当已有相关图，或用户也希望把作者编写的架构边界与代码证据对齐时，才添加 `--ir <architecture.json>`。这样会保留现有架构/Atlas 视图和经过检查的源码映射。阅读 [Code Analysis 入口与调查](modules/code-analysis/docs/USAGE.md#agent-entry-and-investigation)，了解适配器前提、无头检查、交互式重新分析和覆盖限制。交付分析 HTML 时附一两个限定范围的观察与其任务复制控件，或继续在当前对话调查。用户不需要先有维护目标，也无需了解 CLI。分析描述工作树，包括未提交源码；作者编写的提交证据应单独保留。编辑前核实源码，实施限定范围的改进或解释为何保留现有结构，然后重新运行分析及项目测试。报告实测准备时间和工具缺口；失败时保留单独交付的图；不要声称静态发现或未发现问题就证明了运行时故障或修复有效。

<a id="optional-viewer-capabilities"></a>

## 可选查看器能力

Architecture、Workflow、Sequence、Dataflow 和 Lifecycle 节点可携带可选的纯文本 `explanation`（1–1200 字符）。聚焦后的 Semantic Passport 提供 Explain；这段说明不进入规范 SVG 和视觉导出。现有标签、副标签和来源已经足够时，省略此字段。

每个渲染图表默认启用实时动效；省略 `meta.animation`。查看器的 Live／Still 按钮控制播放。

<a id="cross-diagram-navigation-overview--module--detail-across-html-artifacts"></a>

### 跨图导航（在 HTML 制品间从总览 → 模块 → 详情）

- 目标仅限同目录的 `filename.html`（可带 `?` / `#`）。不允许 `../`、`/` 或协议方案。
- 节点 `href` 是单条列表的简写（标签默认为节点标签）。两者同时存在时，`drilldowns` 优先。
- 一个子项：原生 SVG `<a>` + 角标；点击跟随链接；Alt-click 聚焦 Passport。
- 多个子项：Passport 列出全部目标；点击聚焦；Ctrl+click / 双击打开第一项。
- 子图可以设置 `meta.parentHref`。存在 `parentHref` 或 URL `?from=` 时，页头显示 Back 控件。
- 示例：同级配对 `examples/drilldown-platform.architecture.json` ↔ `examples/drilldown-integrations.architecture.json`；多子项 `examples/drilldown-overview.architecture.json`。

只有用户明确询问 Share Cards、Route／Reach 卡片、动效、深链接、演示、搜索／聚焦或其他 Viewer Runtime 功能时，才阅读 `references/viewer-runtime.md`。

<a id="setup-and-fallback"></a>

## 设置与回退

技能包内部不需要安装依赖。诊断设置时，使用以下命令验证：

```bash
node bin/archify.mjs doctor
node bin/archify.mjs demo <output-directory>
```

对于原生图表，如果没有 shell 访问能力，将架构 SVG 手工放置到 `assets/template.html` 中，使用 CSS 语义类而不是行内颜色，并遵循 `references/delivery-contract.md` 的视觉审阅契约。解释页需要其渲染器和真实交付门禁；这些能力不可用时，应报告限制，并在有用时给出文字答案，不声称已交付 HTML。

<a id="output"></a>

## 输出

使用用户的语言回复，在结果允许的范围内尽量简短；内容由图表承载，所以单张图通常只需要一句话。

- README 图以所请求制品的链接开头（默认是导出的 SVG）。如修改了 README，也附其链接。其他原生图以 HTML 链接开头。使用有描述性的 Markdown 链接与绝对路径，含空格的路径用 `<...>` 包裹。
- 用户希望理解系统或代码库，而非单纯绘制所述主题时，补充一两句关键结论。省略只是在复述图中显而易见内容的句子。
- 说明会影响读图方式的内容：读者可能期待却有意省略的部分或抽象层次、示意值而非实测值、缺少源码证据，或修复期间删去或合并的请求内容。
- 多个图只报告一次完成，附已有总览链接或紧凑的逐图链接，不要仅给目录路径。

不要复述命令、修复轮次、hash、质量配置或检查清单；这些信息保留在回执中。如果被问到图表是否经过验证，用一句话回答，例如“自动化检查通过；未做视觉审阅”。只有需要复现或排障时，才提供回执链接和细节。无法完成用户请求的视觉审阅时应披露；只有实际检查过才声称进行了视觉检查。保留“更新感知”要求的更新提示。

示例：`Created [Checkout request timing](/abs/path/checkout-timing.html). Durations are illustrative, not measured.`

对于讲解页，即使不打开页面，回复也必须清楚：先用一至三行说明结论，包括关键原因、数值或建议，然后把使用用户语言的描述性 Markdown 链接放在最后一行，例如 `[查看测试报告](/abs/path/test-report.html)` 或 `[Open the test report](...)`。使用绝对路径，含空格时以 `<...>` 包裹，不使用 `file://`；任何更新通知都放在链接之前。绝不以目录、终端日志或自动打开（`--open`）代替链接。`finalize explainer` 失败或渲染器不可用时，用文字回答，以一行说明页面未生成，不提供页面链接。仅在有门禁失败或仍有写入警告时提及门禁；不要粘贴草稿。
