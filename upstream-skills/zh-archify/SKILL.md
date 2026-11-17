---
name: zh-archify
description: "创建经过校验的架构图、工作流、时序图、数据流图、生命周期／状态图、ERD、类图、树图、时间线和瀑布图，交付可探索的独立 HTML，支持深色／浅色主题、动效以及图片／SVG／WebM 导出。接受需求描述或 Mermaid；为基于代码的图表检查仓库证据。适用于可视化系统、API 调用、流水线、schema、历史、耗时，以及日常步骤、组成、关系和状态。当用户要求页面、解释页或可分享的回答（做成一页、用页面讲），或用户规则通过 [zh-archify explainer: ...] 行选择主动生成时，也可将回答转为结论优先、结构化面板、原生图表组成的单页解释。不能用于仪表盘。"
license: Apache-2.0
metadata:
  version: "3.2"
  author: tt-a1i
---

<a id="archify"></a>

# Archify

创建经过检查的独立 HTML，形式为原生图表，或用于回答问题的单页解释。

从工作目录运行命令。除非用户指定其他位置，否则为每次新的产物请求，在工作目录中建立独立的 `.archify/<type>-<slug>-<YYYYMMDD-HHMMSS>/` 文件夹（使用当地时间，只选择一次）：将候选文件和 `<slug>.html` 保存在其中，修复时复用该目录。原生图表使用 `candidate.json`，其中 `meta.output` 相对于工作目录；解释页可以使用 `candidate.archify.md` 和可移植的输出文件名。之后的新请求使用新文件夹。把所有命令中的 `bin/archify.mjs` 替换为已安装包的绝对路径，或相对于工作目录的路径；CLI 的输入和输出路径都从该工作目录解析。

为真实代码库创作原生图表时，在追踪请求涉及的行为时阅读[仓库创作](references/repository-authoring.md)。系统描述使用下方原生创作步骤；冻结的候选文件使用交接路径。

<a id="choose-the-artifact"></a>

## 选择产物

- 用户要求绘制或可视化系统、流程、schema 或历史时，使用原生图表和类型路由。
- 用户要求把回答做成页面时使用 `explainer`：页面、单页、解释页、可分享的内容（“做成一页”“用页面讲”“answer with a page”）。没有此类请求时，用文字回答，或绘制用户要求的图表。应请求生成页面后，回复以“输出”部分的一行模式提议结束。
- 上下文中的规则行会改变此行为。`[zh-archify explainer: proactive]`：对于需要表格、步骤或多个章节的解释、比较、权衡、决策、诊断、评审或计划，即使用户未请求，也生成页面。`[zh-archify explainer: always-on]`：每个得出结论的回复都附带不超过四个面板的简洁页面；交付但不打开，并以页面链接结束回复。`[zh-archify explainer: on-demand]`：只在用户请求时生成，而且绝不提议模式。
- 在任何模式下，页面都需要一个有结构支撑的结论：闲聊、单句回答、原始命令输出，以及明确只要文字的请求，都不生成页面。
- 对于 `explainer`，阅读[解释页创作](references/explainer-authoring.md)，了解结论、理由、范围、面板布局和可选原生图表。先写完整草稿，再运行 `finalize explainer`，进行校验、原子交付和产物检查。局部内容修订使用 panel patch。

<a id="existing-candidate-handoff"></a>

## 已有候选文件的交接

用户提供冻结的候选文件时，首先以一次 CLI 调用运行 `finalize`。通过的回执即表示自动化门禁完成；声称视觉质量之前，遵循“交付”中的视觉审阅建议。需要修复时，按第 5 步处理。

`finalize` 在交付回执中包含一次有界的更新检查；参见“更新感知”。

<a id="native-diagram-authoring"></a>

## 原生图表创作

普通生成使用此路径。只有满足指定触发条件时，才阅读分支参考。

1. 根据问题选择 `architecture`、`workflow`、`sequence`、`dataflow`、`lifecycle`、`erd`、`class`、`tree`、`timeline` 或 `waterfall`。
2. 直接使用类型路由中给出的确切 schema 和示例路径，不列举其目录。将[创作默认值](references/authoring-defaults.md)和该模式示例放在一个有界批次中阅读，与项目文档和完整 schema 分开，以免任一部分被截断；写作前补齐任何缺失章节。Architecture 使用匹配的展示示例。除 Architecture 外，每个模式还要阅读自身及公共 schema。在选择任何新字段、枚举或受约束文本之前，阅读相应 schema 定义，尤其是边界类型。示例传授结构，不提供事实。使用新的 ID、措辞和布局。直接进入候选文件，不先运行 help、doctor、起始校验、临时图表或输出路径列表。只有用户明确请求某标识时才查询品牌；未知标识且用户提供了 URL 时，阅读[品牌标识](references/brand-marks.md)。
3. 请求范围已经覆盖，且真实代码库的[源代码证据](references/repository-authoring.md)已经覆盖后，直接编写完整候选文件，不先用文字规划坐标。为 Architecture 设置坐标之前，先依据“创作默认值”选择抽象层次和连贯布局：展示主用户旅程及必要分支，保留控制角色和改变行为的条件，并为真实关系标签留足空间。节点、关系、来源、视图、卡片或边界的数量都不是目标或上限。先使用自动路由；只有必要分支、返回、给定几何或经过测量的修复需要时，才添加显式路由。除非用户请求密集的 `standard`，否则将 `meta.quality_profile` 设为 `"showcase"`。对于 ERD，使用表优先布局：在 `entities[].attributes` 中显示每个物理字段，保留 SQL 类型和源注释，列出字段承载的每个键角色（`key` 接受一个角色或列表，所以关联表字段可以是 `["pk", "fk"]`，每个 `fk` 字段还需要类似 `"orders.id"` 的 `references`）；绝不以将字段移到卡片中来替代表格展示。布局前先将表划分为功能域，为每个域给出简洁的 `tag`，并将域成员放在一个实心矩形网格区域内——单行、单列或填满的矩形块，不能是 L 形或对角线。有 tag 的表始终需要 `row`／`col`，因为绝对坐标不包含网格单元；表不能填满一个矩形的域，无法绘制为域带：渲染器会报告 `erd/domain-not-drawn`，而不是发布一个无法为域命名的图。多域 schema 最适合每域一列——每个 `tag` 形成纵向连续区域——因为阅读器会把宽画布放大到阅读器宽度，而把高画布缩小到整页容得下；宽布局因此更能在笔记本视口中保持完整和可读。以 schema 为先的 ERD 超过大约 8 张表或 50 个字段时，本身就是密集地图：第一次完整字段稿应使用 `standard`，只有布局仍可读时再升级。
4. 完整首稿写好后，直接运行 `finalize`。它的第一道门禁就是 showcase 校验；成功的首稿不需要单独预校验。命令执行期间保持候选文件不变：

   ```bash
   node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
   ```

   对于基于仓库的候选文件，首稿就要带上证据，并使用完整的首次命令：`node bin/archify.mjs finalize <type> <candidate.json> <output.html> --repo-root <repo-root> --quality showcase --json`。传入与 `meta.quality_profile` 一致的 `--quality`，例如密集 ERD 首稿的 `standard`。

   通过的回执证明其中的 `validate`、`deliver`、严格 `check` 和真实浏览器 `browser-check` 门禁均已通过。使用其精简摘要；只有独立请求或针对性故障诊断才运行单项命令。

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

当通过的 Architecture 回执报告 `visualReviewRecommendation.signals.resolvedCrossovers` 时，将候选文件另存副本，并按提示进行一次只改变节点位置和尺寸的编辑：每个节点、关系（包括 `from` 和 `to`）、标签与来源都保持不变。用 `--out-dir <folder>/review-2` 重新运行一次完整 `finalize`，因为先前 HTML 已拥有其浏览器证据。`--out-dir` 会移动新的浏览器检查回执和默认 finalize 回执，不会移动 HTML 或交付回执。成功交付会在请求的输出路径重写后两者；先前审阅证据仍绑定原始产物字节。参见[审阅证据路径](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path)。若该次运行失败、报告更多交叉，或交叉数相同但 `signals.routesOverSuggestedBends` 更多，则恢复副本，并以 `--out-dir <folder>/review-3` finalize。不要开始第二轮摆放。仅关于额外弯折的提示是可选的。

当 `layoutReviewRecommendation.action` 为 `inspect-sequence-width` 时，交付新创作的 Sequence 前，遵循[时序图宽度审阅](references/delivery-contract.md#sequence-width-review)。

普通生成中的感知审阅是可选的，新摆放的 Architecture 也一样。当用户请求视觉审阅、进行开发审计，或存在具体路由／浏览器疑问时，按照[可选截图证据](references/delivery-contract.md#optional-capture-evidence)，使用 `--out-dir <folder>/visual-check`。`visualReviewRecommendation` 仅供建议。声称视觉质量前先检查截图；没有做感知审阅时，应将任何检查结论限定为自动化检查。

门禁失败、单项命令、溯源／恢复、重复交付、导出或打开方面的问题，阅读[交付契约](references/delivery-contract.md)。原生图表恢复遵循 `deliver` → 严格溯源 `check` → `browser-check`；截图要求严格溯源。解释页交付按其创作指南采用 validate、deliver 和 check。

工作流视口溢出时，下一次布局编辑前阅读[工作流视口修复](references/authoring-contract.md#workflow-viewport-repair)。

报告验证细节时，区分产物检查、浏览器证据、截图和真正的感知审阅。用户明确请求立即预览或持续桌面循环时，参见[可选打开](references/delivery-contract.md#optional-opening)。

<a id="optional-viewer-capabilities"></a>

## 可选查看器能力

每个渲染图表默认启用实时动效；省略 `meta.animation`。查看器的 Live／Still 按钮控制播放。

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

- 以可点击的 HTML Markdown 链接开头：使用描述性标题，而不是文件名；目标为绝对路径，路径包含空格时用 `<...>` 包裹。
- 用户希望理解系统或代码库，而不只是绘制描述中的主题时，增加一两句话说明关键发现。跳过仅复述图表显而易见内容的句子。
- 说明会改变图表解读方式的因素：抽象层次；读者可能预期存在但被刻意省略的部分；数值是示意而非测量所得；缺少源代码证据；或者修复中删除或合并了请求中的内容。
- 多个图表时，仅报告一次完成，并链接到已有概览，或给出简洁的逐图链接，不提供目录路径。

不要复述命令、修复轮次、hash、质量配置或检查清单；这些信息保留在回执中。如果被问到图表是否经过验证，用一句话回答，例如“自动化检查通过；未做视觉审阅”。只有需要复现或排障时，才提供回执链接和细节。无法完成用户请求的视觉审阅时应披露；只有实际检查过才声称进行了视觉检查。保留“更新感知”要求的更新提示。

示例：`Created [Checkout request timing](/abs/path/checkout-timing.html). Durations are illustrative, not measured.`

对于解释页，用两到三行回复：结论和页面链接。只有门禁失败或仍有写作警告时才提及门禁；不要粘贴草稿。

应请求生成解释页后，如果上下文没有 `[zh-archify explainer: ...]` 行，在回复末尾添加一行可选的主动模式提议，每次对话只提议一次，例如：“需要的话，以后遇到解释、对比、排查这类问题，我可以主动做成这样的页面，要开启吗？”如果用户接受，在当前 agent 的全局规则文件（例如 `~/.claude/CLAUDE.md`、`~/.codex/AGENTS.md` 或 `~/.config/devin/AGENTS.md`）中添加 `[zh-archify explainer: proactive] Make a zh-archify explainer page, unasked, for explanations, comparisons, decisions, diagnoses, reviews and plans that need a table, steps or several sections.`，并说明文件位置；删除该行即可关闭。如果用户拒绝，提议添加 `[zh-archify explainer: on-demand]`，避免再次询问。
