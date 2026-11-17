> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/tt-a1i/archify/blob/a7ed6fd6657da90414831d1d42cf95987188750c/archify/references/authoring-contract.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

<a id="authoring-contract"></a>

# 创作契约

只有快速创作路径要求更多细节时，才阅读本参考。schema 和示例仍是权威依据。

<a id="composition-repair"></a>

## 组成修复

修正作者创作概览的抽象层次时，在重新分组前，将每个受影响角色、关系方向、协议、边界、条件和源引用映射到保留下来的节点或关系。启动引用不能证明消息协议。保留每个主张已检查的证据。用户提供或已约定的拓扑保持固定；仅仅减少路由不足以证明合并合理。只包围一个节点的边界，需要明确隔离事实，不能只是重复节点标签。

<a id="label-repair"></a>

## 标签修复

关系标签碰撞时，先移动标签、调整路由或间距，再在保留含义的前提下缩短措辞。只有两个端点已经完整暗示其含义，而且它不表达协议、动作、方向、同步或异步行为、跨边界机制时，才省略文字。间距指净空，而不是中心距离；实测遮罩宽度优先。首稿间隙预算见[布局与路由](authoring-defaults.md#layout-and-routing)。

副标签比例失衡时，精确保留角色或协议并使其简洁，把补充事实放入 note 或卡片。保留每个必需职责、协议和边界事实。使用[布局与路由](authoring-defaults.md#layout-and-routing)中的首稿节点宽度预算。

<a id="schema-lookup"></a>

## Schema 查阅

同时阅读模式 schema 和 `schemas/common.schema.json`。模式 schema 使用 `$ref`，因此共享枚举位于 common 文件中。

- `componentType`：`frontend`、`backend`、`database`、`cloud`、`security`、`messagebus`、`external`。
- 实体关系文档使用 `entities` 和 `relationships`；`key` 接受 `pk`、`fk` 或 `uk`，`fromCardinality`／`toCardinality` 接受 `one` 或 `many`。
- `variant`：`default`、`emphasis`、`security`、`dashed`。
- 关系 ID 使用共享标识符模式，并且在所属集合中必须唯一。

不要编造字段。写入任何新字段、枚举或受约束文字前，阅读其 schema 定义，包括 common `$ref` 目标。尤其要检查边界类型、仓库身份和源引用结构。示例演示结构，不会穷举所有合法值。创作新的 ID、措辞、事实和布局。

<a id="workflow-layout-contracts"></a>

## 工作流布局契约

新工作流使用 schema v2；现有来源需要保留固定几何时，保持 schema v1。两种版本中，`col` 都在 `0..5` 范围内，绝不通过删除语义边标签来修复间距。有绝对坐标时，不要仅修改 `schema_version`：遵循规范的[迁移与布局回执契约](../renderers/workflow/README.md#migration-and-layout-receipt)。完整规范不变量位于工作流渲染器的[布局契约](../renderers/workflow/README.md#layout-contracts)。单个容器内纵向堆叠的顺序阶段，使用一条 v2 泳道和一个 group，省略 `meta.viewBox`，用 `-90 / 0 / 90` 等对称 `yOffset`，让节点围绕泳道内容居中。保留语义边标签，并根据编译器诊断行动。

<a id="legend-contract"></a>

## 图例契约

省略 `meta.legend` 得到真实的默认行为：`auto` 只列出类型化 IR 中存在的语义种类。渲染器参考使用 `mode: "all"`，移除完整图例使用 `mode: "hidden"`。`entries` 下仅选定模式 schema 列出的键合法；每个键接受 `label`、`visible` 或两者。`visible: true` 可显示未使用但受支持的约定，`visible: false` 隐藏它。`hidden` 不能被覆盖。

标签覆盖只改变给读者看的措辞。绝不从正文推断 kind，也不使用图例弥补缺失的节点、状态、消息或 flow。长标签经过测量，并换成确定性的多行。Architecture 隐式自动 viewBox 根据同一实测占地增长；自动 ERD 画布以相同方式调整尺寸，使默认图例始终属于生成内容。为向后兼容，没有 `meta.legend` 的旧文档，可以省略无法容纳在其显式 viewBox 内的隐式 auto 图例；这不会改变类型化拓扑。作者指定 `meta.viewBox` 的 ERD 保持固定区域，并报告容量问题，而不是丢弃图例。添加 `meta.legend` 会使呈现成为有意指定且严格的契约：如果解析后标签放不进作者定义 viewBox，依据诊断缩短或隐藏它们，或加宽 viewBox。

<a id="language-consistency"></a>

## 语言一致性

选择一种主要创作语言。用户明确选择优先；否则使用请求语言；请求本身没有语言倾向时，使用对话的主要语言。另行选择查看器 locale。始终将匹配的 `meta.locale` 写成格式合法的语言标签：英文用 `"en"`，简体中文用 `"zh-CN"`，西班牙语用 `"es"`，其他语言使用相应标签。渲染器消费作者指定 locale，不从图表字符串推断语言。省略它的文档仍合法，默认英文。

`meta.locale` 只控制渲染器拥有的阅读界面：`<html lang>`、文档标题后缀、默认 SVG 描述与聚焦标签、默认图例标签，以及固定查看器控件、状态、可访问名称和错误。它绝不翻译作者内容。应另外将主要语言应用于标题、副标题、节点与关系文案、边界、泳道、分组、图例标签覆盖和卡片。双语图仍为查看器选择一种主要 locale；先遵循明确的主要语言请求，再依据提示顺序或对话主导语言。

随包查看器语言目录登记在 `locales/manifest.json`：当前为 `en`、`zh-CN`、`zh-TW`、`es`、`ko`、`ar`。这些语言仅设置 `meta.locale` 就可选择完整目录。标签匹配不区分大小写（`zh-cn` 选择 `zh-CN`），但地区和文字变体是独立的：`zh-Hant`、`es-MX` 或 `ko-KR` 不会选择任何随包目录。

`meta.translations` 是可选逐键覆盖：将渲染器规范消息键（`locales/en.json`，或 `renderers/shared/i18n.mjs` 中的 `catalogKeys()`）映射到译文字符串的对象，`{placeholder}` token 必须与英文来源完全一致。每条消息按以下顺序解析：有效的 `meta.translations` 值 → 所选随包目录 → 英文。随包 locale 只需提供图表需要改变措辞的键；其余语言内容保持原样。省略字段或提供 `{}`，表示无覆盖。没有随包目录的语言，在此提供目录。复用 `examples/locales/` 或先前已审阅目录中的适当译文，翻译缺失键，并用英文来源检查键和占位符。

未知键或占位符不匹配的值会被拒绝，保留低优先级消息；stderr 报告 `i18n/invalid-translation`，`validate --json`、`deliver` 和 `finalize` 回执的 `diagnostics[]` 中记录警告。非英文 locale 中仍解析为英文的键，报告为 `i18n/translation-coverage`，附缺失键及英文原文；只需补齐这些确切键来修复缺口。覆盖率描述最终解析目录，而不是覆盖对象大小。

如果请求语言没有随包目录，而你无法提供 `meta.translations`，就不要写一个既无随包目录又无译文的 `meta.locale`。所有面向读者的作者字符串仍使用请求语言；省略 `meta.locale`，让渲染器安全使用英文，并明确告诉用户固定查看器 UI 与 `<html lang>` 仍为英文，产物未完全本地化。回退仅适用于渲染器拥有的界面，绝不允许作者文案回退英文。不要悄悄用 `zh-CN` 替代其他语言或中文地区，也不要在未披露译文尚未经审阅的情况下机器翻译 `meta.translations` 值。

保留产品名称、代码标识符、命令、协议、API 路径和环境名称的精确形式。这些术语可以在本地化文案中保留英文，但周围解释正文仍必须使用选定语言。渲染器负责的默认图例标签跟随 `meta.locale`；只有图表需要不同领域措辞时，才设置 `meta.legend.entries.*.label` 覆盖，且该作者覆盖使用主要语言。

<a id="visual-preset-default"></a>

## 视觉预设默认值

默认省略 `meta.visual_preset`。渲染器会在浅色和深色模式中都以 `classic` 打开图表。颜色模式与视觉预设是独立的查看器状态：切换 Light／Dark 必须保留当前预设。只有用户明确请求对应视觉样式时，才写 `signal-flow`、`blueprint` 或 `editorial`。

<a id="engineering-profile-default"></a>

## 工程配置默认值

普通系统架构省略 `meta.engineering_profile`。区域、集群和安全边界的措辞，本身不会启用工程 profile。只有用户明确要求生产部署拓扑、归属交接，或缺少事实就拒绝继续的部署评审，而且来源事实已知时，才启用 `deployment-ownership`。启用后，不能仅为了通过校验就删除工程 profile；应修复作者事实，或如实报告诊断。

<a id="title-hierarchy"></a>

## 标题层级

使用一个简洁标题，让图表承载解释。默认省略 `meta.subtitle`，绝不使用它重述标题、节点、边或卡片。只有用户明确要求副标题时，才增加一条简短辅助说明；省略或空白副标题，不能在生成查看器中留下空视觉行。

<a id="executable-geometry-rules"></a>

## 可执行几何规则

为笔记本与外接显示器生成一个响应式产物，保留作者定义的 SVG／viewBox、比例、语义几何和普通文档流。完整图表需要更多高度时，使用有意义的内容行，以及阅读器声明的可读页面滚动行为；视口适配不授权替代拓扑或更小字体。

- 节点锚点从各侧中点开始。`left`／`right` 改变横向端点；`top`／`bottom` 改变纵向端点。自动 Architecture 关系中，如果面对面端口没有障碍，轴偏移小于 16px，且两端都保留 16px 角部沟槽，可以共享一条横轴或纵轴。若恰好一个端点属于分散组，只移动其非共享对端；两端都分散的关系保留不同端口和外部桥接，除非一对互相面对的反向关系可以共同采用独立直线路径，并保留端点间距、标签以及周围全部路由和障碍净空。
- 端口侧是方向契约。路由首尾线段必须分别垂直于指定侧，按所命名方向向外／向内。
- Architecture 和 Dataflow 中，显式 `route: "straight"` 请求一条直连线段，未固定端口侧时可以是斜线。产物检查器保留该意图；显式端口侧、不透明节点净空和其他质量门禁仍适用。`via` 优先，并保留现有规则，包括 Dataflow 要求 via 线段正交。
- Automatic Port Spread 是 Architecture、Workflow 和 Dataflow 的默认渲染行为。共享自动端点以确定、对称方式分散，并保留 16px 角部沟槽。它不适用于 Sequence 消息、单条关系，或显式 `via`、`channelX`、`channelY`、`labelAt`、非 `auto` 路由。
- Showcase 路由节奏：每条非零线段至少 8px；每条内部线段至少 16px。分散端口接近平行时，路由器使用 24px 端点短段和 16px 外部桥接，而不是制造微小折线。
- Showcase 路由紧凑性：显式 Architecture 路由的正交长度达到考虑障碍的合法路由至少 2.5 倍、额外增加至少 200px，且某控制点越出内容包络至少 96px 时，以 `composition/excessive-route-detour` 失败。证据记录两种长度、比例、超出量、边界和偏移。移除不必要的 `via`，或将诊断出的通道向内移动，不要扩大画布。相关关系在相同外侧通道重叠至少 32px 时，视为有意设计的总线，仍合法。
- 共享端点通道只有在语义保持明确时才允许。无关共线重叠达到 8px，会导致 showcase 失败。
- 容器边框是允许有意穿过的几何，但长边沿结构边框行进则不允许。
- 边穿过无关的不透明节点，始终是硬失败，与质量配置无关。

<a id="explicit-via-coordinates"></a>

### 显式 `via` 坐标

使用解析后的出发锚点 `S = [sx, sy]` 和到达锚点 `T = [tx, ty]`。锚点从各侧中点开始，但自动路由和 Port Spread 可按上文移动它们；不要假设从自动路由复制的锚点，就是新创作显式路由的锚点。显式 `via` 路由不应用自动 Port Spread。

第一个途经点 `F = via[0]` 和最后一个途经点 `L = via[via.length - 1]`，使用下列对齐与方向（SVG y 向下增长）：

| 侧 | 出发（`fromSide`）：`S` → `F` | 到达（`toSide`）：`L` → `T` |
| --- | --- | --- |
| `top` | `F[0] === sx`、`F[1] < sy` | `L[0] === tx`、`L[1] < ty` |
| `bottom` | `F[0] === sx`、`F[1] > sy` | `L[0] === tx`、`L[1] > ty` |
| `left` | `F[1] === sy`、`F[0] < sx` | `L[1] === ty`、`L[0] < tx` |
| `right` | `F[1] === sy`、`F[0] > sx` | `L[1] === ty`、`L[0] > tx` |

例如，给定底部出发锚点 `S = [180, 160]` 和左侧到达锚点 `T = [360, 260]`，下列关系片段向下出发、向右进入目标：

```json
{
  "from": "source",
  "to": "target",
  "fromSide": "bottom",
  "toSide": "left",
  "via": [[180, 200], [300, 200], [300, 260]]
}
```

完整路径为 `[180, 160] → [180, 200] → [300, 200] → [300, 260] → [360, 260]`。如果只把第一途经点改为 `[200, 200]`，出发就会成为斜线；
若改为 `[180, 120]`，虽然 x 对齐，却向上穿过来源，而不是从底部向外。两者都违反 `fromSide: "bottom"`，并产生 `clean-flow/endpoint-side-direction`。该示例仅说明端点方向：完整路由仍须避开无关节点，并应用上面的其他几何规则。

<a id="spacing-and-labels"></a>

### 间距与标签

Showcase Architecture 中，未固定连接标签若没有冲突，就保留默认位置；若碰撞，渲染器会沿现有路由尝试一组有界的邻近位置，在解析后画布内避开节点、边界标题、其他标签和其他路由。显式 `labelAt`、`labelDx`、`labelDy` 或 `labelSegment`（包括零）会禁用此回退。路由和拓扑保持不变；附近没有清晰位置时，校验报告原碰撞。添加控制前，用 `--layout-json` 检查解析后的标签。standard 摆放保留现有行为。

间距建议指盒子之间的净空，不是中心距离。两个宽 165px 的节点中心相距 200px，净空只有 35px。

关系标签要求：

```text
clear gap > label mask width + 8px breathing room
label mask width ≈ 6.5px × ASCII units + 13px
CJK characters count as two units
```

关系标签是语义数据。间隙太小时，移动标签，调整路由或间距，再在保留含义的前提下缩短措辞。只有两个端点已完整暗示，且不承载协议、动作、方向、同步／异步行为或跨边界机制的文字，才能省略。保留每个有意义标签。删除标签不是间距修复。关系最初未带标签，因为端点已完整暗示时，说明文字为什么冗余；这属于语义创作选择，不是间距修复。Workflow v2 中，先让编译器分配实测遮罩，再应用诊断所需的 `labelAt`、`labelDx`／`labelDy` 或 `labelSegment`。除非多条边共享受约束通道，否则一次只应用一个诊断几何控制；共享通道时，依据实测几何规划最小的耦合修改，并一起验证。Architecture／Workflow 通过 `validate <type> <candidate.json> --layout-json` 提供布局证据；其他类型使用校验诊断与渲染后的 SVG 几何。添加手动路由前，检查是否有不必要的 agent 添加控制禁用了自动端口分散；保留用户要求的路由意图。依据上述实测净空规则，不猜坐标。

<a id="repair-evidence"></a>

### 修复证据

Architecture 的 `validate architecture <input.json> --layout-json` 暴露已解析组件盒子、边界框、连接点和标签位置。可测量但被拒绝的布局也会返回这些字段，并带 `ok: false`、`contract: "archify-architecture-layout-v1"`、诊断和退出码 1。这是修复证据，不是产物验收；不会写 HTML。输入格式错误或实现失败时，保留不含布局的普通失败回执。

对 `layout/boundary-out-of-bounds`，使用实测失败侧。左／上负坐标需要向内移动；增加 viewBox 宽／高只能解决右／下溢出。边界可以跨行包围成员。移动成员时保留真实成员关系，并复查相连路由。

自动 Architecture 画布包括路由点，以及节点、框和标签。作者指定 viewBox 保持权威。Showcase 中，`layout/route-out-of-bounds` 指出被裁切的路由点；负坐标需要向内路由，右／下溢出也可通过更大作者指定画布解决。扩大画布后重新检查桌面可读性。

多个交叉／通道诊断涉及相同节点时，添加路由控制前，整体考虑它们的摆放。应用一次连贯修复并验证；独立微调标签无法解决共享布局瓶颈。按代码、对象和阶段比较诊断，不只看总数。

<a id="repair-order"></a>

### 修复顺序

1. 修复缺失／非法 `meta.quality_profile` 及 schema 错误。
2. 修复节点重叠或越界摆放。
3. 修复边穿节点和端点方向错误。
4. 修复交叉、含糊通道、沿边框行进、过度绕路和路由节奏。
5. 依次修复标签对节点、标签对标签、标签对路由的净空。
6. 修复超出画布的标签：使用 `labelAt`／`labelDx`／`labelDy`／`labelSegment` 移动，或加宽 `meta.viewBox`。建议的 `labelDx`／`labelDy` 值替换作者字段，不是加到原值上。

每次编辑后，按照交付契约重新运行完整 `finalize`；只在 finalize 之间做针对性诊断时使用 `validate`。按稳定的 `code`、确切 `subject`、实测 `evidence` 和 `supportedFixes` 消费 `diagnostics[]`。诊断给出 `labelAt` 时，直接使用该点，不估算其他偏移。

<a id="mode-placement"></a>

## 模式摆放

<a id="architecture"></a>

### Architecture

依据[组成与含义](authoring-defaults.md#composition-and-meaning)选择概览或机制细节。使用一条明显的主要阅读路径；请求的拓扑需要空间时，可以经过有意义的行。在选定抽象层次保持概览可读；实现细节确实回答读者问题时再展开。只为真实的归属、信任、进程或部署边界分组。边界不能替代关系。

schema 支持时优先网格摆放。自由位置适合有界例外，不适合用文字规划坐标。事实确实如此时，将外部执行者放在系统边界之外。边界按全部成员周围带内边距的盒子绘制，因此把成员放成一个紧凑、轴对齐的组（不留能让非成员坐进带内边距边框的空湾），并让所有非成员处于该盒子之外；showcase 质量下，`layout/boundary-encloses-non-member` 报告被盒子吞进去的组件。standard 保留现有接受行为。

<a id="workflow"></a>

### Workflow

泳道表达职责或阶段。列 `0..5` 表达逻辑推进。新工作流从 `readable-v2` 开始；仅为旧几何兼容保留 `fixed-v1`。readable-v2 中，只要不同 `yOffset` 为完整矩形、标签和连接路由留足空间，节点就可共享 `(lane, col)`。保持正常路径单调，保留语义边标签，将重试和异常返回放在主泳道通道之外。

<a id="workflow-viewport-repair"></a>

#### 工作流视口修复

`viewer/viewport-overflow` 包含 `workflowLanes` 时，修改来源前，检查最高的渲染框及其节点跨度。测量单位是 CSS 像素；节点上／下空间包括泳道标题和路由，不等于可删除空间预算。框 ID 标识渲染泳道索引。

运行 `validate workflow <source.json> --layout-json`，将这些框匹配到源泳道和节点。检查是否很多步骤共享最后一个逻辑列，并使用大 `yOffset`。readable-v2 围绕偏移预留对称空间。同列纵向堆叠、隐式画布、无绝对路由或标签固定值时，它独立测量每条泳道。其他情况为兼容保留共享高度几何；见规范的[泳道测量契约](../renderers/workflow/README.md#readable-v2)。

来源的归属与显式几何允许时，把步骤重新分布到逻辑列和有意义的泳道中，保持主路径单调。保留每个必需节点、关系、标签和语义检查。如果归属或绝对固定值阻止重排，应报告该约束，而不是自动合并泳道或移动固定值。校验修改后的 JSON，交付新 HTML，再运行浏览器检查并检查首屏；仅静态检查通过不能证明视口适配。这些是修复方向，不是保证有效的坐标。

<a id="sequence"></a>

### Sequence

参与者按对话角色排序。消息拥有自己的纵向顺序。return／async／security variant 用于表达含义，不用于装饰；Sequence 不使用 Automatic Port Spread。segment 的 `from`／`to` 边必须距每条消息箭头（`message.y`）至少 4px：边沿箭头行进会让读者无法判断消息属于哪个阶段，showcase 质量报告 `sequence/segment-message-border-run`。standard 保留现有接受行为。

首稿结构：每条消息需要 `id`、`from`、`to`、`label` 和至少 160 的整数 `y`。`from` 和 `to` 必须是不同参与者——自消息不受支持（`sequence/self-message-unsupported`）。可选 phase 带为 `segments[]`，只包含 `from`、`to` 和 `label`（没有 segment `id`）。给参与者编造 `pos`／`size` 会导致 schema 校验失败——仅顺序决定它们位置。省略 `meta.viewBox`，让自动高度适配时间线和图例（最小 327px 可读带），而不是固定 760px 下限；标签放得下时，2–3 个参与者的 spread 可紧凑到低于默认 920px（4 个以上仍为 920px；长标签仍会加宽）。

<a id="dataflow"></a>

### Dataflow

stage 表达转换或保管阶段。row 区分并行流。为每条 flow 给出简洁的数据契约或移动标签；按照必读的[Dataflow 创作默认值](authoring-defaults.md#presentation-and-modes)选择视觉约定。

首稿结构：声明 `stages[]`（每项是 `{label}`），然后用整数 `stage` 和 `row` 摆放每个节点，而不是 `pos`／`size`。flow 位于 `flows[]`，必填 `from`、`to` 和非空 `label`。

省略 `meta.viewBox`，使任一质量配置下的画布宽度适配全部 stage 和节点，包括显式节点宽度。宽度采用内容加 24px 右内边距，最小 480px（五个默认 stage 仍需约 1068）；左边缘溢出仍需修复节点。作者指定 viewBox 保持固定。只有省略画布和全部节点宽度时，才应用 showcase 节点增长、可读字体、内容高度、端口桥接和有界标签摆放。`--quality` 覆盖 `meta.quality_profile`；没有它时，渲染器优先使用已设置的 `ARCHIFY_QUALITY_PROFILE`，否则使用 JSON profile。

<a id="erd"></a>

### ERD

将 schema ERD 同时视为表目录和关系地图。schema 超过 8 张表或 50 个字段时，它就是密集的完整 schema 地图：从 `meta.quality_profile: "standard"` 开始，避免为反复的 showcase 路由修复牺牲完整字段可见性。把每个物理列写入 `attributes`，保留来源 SQL 类型，并将字段中文注释以 `SQL_TYPE｜中文备注` 保留在 type 字符串中，因为 schema 没有独立 comment 属性。默认查看器在 `read` 级别展示这些行；不要依赖悬停／聚焦或卡片展示物理字段。卡片可以解释约束、推断关系或领域规则，但绝不替代字段列表。

摆放盒子前，依据已验证的表名、注释、模块路径和外键含义，将表划分为功能域。在 `tag` 中写域名，为每个域分配一块实心矩形网格区域：单行、单列或填满的矩形块——不能是 L 形或对角线——矩形每个格子都放一张该域的表。相同 tag 的表保持在一起，成员之间不要插入无关表。填满这样的矩形的域，会在表后绘制带标题的域带，因此无需阅读每个盒子也能看出分组；某 tag 的表未填满一个矩形时没有域带，而域带是域名称唯一显示处，所以渲染器报告 `erd/domain-not-drawn`，而不是发布不能命名域的图。绝对坐标根本没有网格单元，因此带 tag 的表始终需要 `row`／`col`。将父表／核心表朝共享边界排列，直接子表放在其旁边或下方。列从左到右，行从上到下，因此相邻列间关系是一条直通道。绝不在两个对齐锚点之间摆无关实体；路由器可以绕过，但净空通道更短、更易读。关联表有两个父表：把它放在两者旁边或之间的格子，不要放在一个父表下方、且与另一个父表之间堆着其他表；与它共享域 tag 的所有表仍要保持一个实心矩形。关系必须连接两个不同实体；例如 manager_id 这样的自引用，应保留为外键列（可选卡片），而不是 `employees`→`employees` 边。普通分组布局使用 `row`／`col`，只有诊断指出具体几何问题后才使用显式 `pos`／`via`。

在 `key` 中声明字段承载的每个键角色，在 `references` 中声明真实引用。字段往往同时有多个角色——关联表的 `tenant_id` 既是主键的一部分，也是指向 `tenant.id` 的外键——因此 `key` 接受一个角色或列表（`["pk", "fk"]`）；删除角色会使图表陈述少于 schema。多对多是模型的真实事实，应声明它，有关联表时也标明。关系有两个端点，每端都声明自己的最大值，因此 `many` 到 `one` 外键需要同时有 `fromCardinality` 和 `toCardinality`；`fromOptional`／`toOptional` 只把同一端最小值从一降到零（可选 `one` 读作零或一，可选 `many` 读作零或多）；`identifying: false` 绘制非标识虚线并独占虚线语义——schema 拒绝同时使该关系实线化的 `variant`。乌鸦脚朝向其描述的实体，因此符号表示该端最大值，不表示行进方向。

表的一侧能容纳的端点有限：端口最大间距为 `(side extent - 32) / (ends - 1)`，基数符号高 14 单位。关系端点超过空间容量时，报 `layout/marker-capacity`，指出表、侧与解决办法——增加字段以使该侧更高、分散关系，或减少扇入。绝不通过隐藏基数来修复。

模型需要在笔记本视口中完整阅读时，每个域分配一列。阅读器会把宽画布放大到阅读器宽度，把高画布缩窄到整页能放下，因此同样十一张表，若排成四个横向域而不是四个纵向域，会损失文字尺寸。长关系需要穿过某个域时，留出一整块空网格；穿过已占单元格会迫使路由折弯，低于内部下限的折弯会报 `composition/short-interior-segment`。

自动画布会调整尺寸，使默认图例始终包含在生成内容中；作者用 `meta.viewBox` 固定的画布，会报告图例容量，而不是丢弃图例。域带、端口和阅读器契约见 [`../renderers/erd/README.md`](../renderers/erd/README.md)。

<a id="tree"></a>

### Tree

树图回答“它如何拆分”：一个根节点，其他每个节点恰好指明一个 `parent`。链接只表示包含关系；不要用树图表示调用、数据移动或跨分支依赖。不会推断任何关系：缺失父节点（`tree/missing-parent`）、零个或多个根（`tree/root-count`）、parent 环（`tree/cycle`，也覆盖困在环下方的每个节点），以及重复 ID 都会被拒绝。子节点按声明顺序读取。

较浅且平衡的拆解使用 `layout.direction: "down"`（默认），较深或叶子较多的树（例如仓库布局）使用 `"right"`；向右树图使每个父节点与第一个子节点对齐，并在阅读器中纵向滚动。标签按词换行。`collapsed: true` 使分支在查看器中初始折叠；绝不从产物移除内容，所有导出都是完整树。真实代码库的每个节点都基于已观察路径，并附 `sources`。参见 [`../renderers/tree/README.md`](../renderers/tree/README.md)。

<a id="class"></a>

### Class

类图解释一个模块内的契约：有哪些类型、哪些成员与解释有关，以及类型如何关联。选择问题所需成员；类型可以不显示成员。每个类型声明自己的 `kind`（`class`、`abstract`、`interface`、`enum`、`record`）；除 `class` 外，每种都会绘制 UML 关键字，因此接口绝不会被读成空类。真实代码库的每个类型、成员和关系都以仓库证据为依据，并附 `sources`。

每条关系按 `from` -> `to` 读取，记法由 `kind` 决定：`dependency`（`from` 使用 `to`，虚线开放箭头）、`association`（`from` 持有 `to`，实线开放箭头）、`inheritance`（`from` 继承 `to`，实线空心三角）、`realization`（`from` 实现接口 `to`，虚线空心三角）、`composition` 和 `aggregation`（`from` 是整体，`from` 处分别为实心或空心菱形）。realization 必须从非接口指向接口；inheritance 不能跨越接口边界；继承环会被拒绝。

将类型放在 `row`／`col` 网格中，父类型位于子类型上方。两个或更多进入同一父类型的自动泛化关系，会绘制为带一个三角的层级总线。成员绝不截断：类型增长到最宽成员所需宽度，最多到 `layout.typeMaxW`，更长成员在参数边界换行。参见 [`../renderers/class/README.md`](../renderers/class/README.md)。

首稿结构：类型使用 `row`／`col`（不是 `pos`／`size`），字段放进 `attributes[]`，操作放进 `methods[]`，其中 `parameters` 是一个字符串，例如 `"msg: Message"`（不是对象数组）。枚举成员是只有 `name` 的 attribute。关系需要 `id`、`from`、`to`、`kind`。

<a id="timeline"></a>

### Timeline

时间线回答“什么事在何时发生，间隔多久”。每个事件需要带显式 `Z` 或 `±HH:MM` 偏移的 ISO 8601 `at`；无偏移时间戳会被拒绝，不猜测。`meta.timezone`（IANA，默认 `UTC`）是刻度与标签的显示时区，轴说明会注明。`meta.evidence` 必填：记录的事件（日志、git 历史、呼叫记录）用 `observed`，解释性输入用 `illustrative`。绝不将编造或近似时间标为 observed，也不以输入不存在的事件填补空白。

用 `lanes` 表示来源或类别（发布、监控、响应）；每个事件随后必须指明一个泳道。事件的可见文字是 `title`（不是 `label`）。`kind`（`default`、`change`、`alert`、`action`、`recovery`）只为卡片着色；编造 `milestone` 等值会导致 schema 校验失败。无论作者顺序如何，事件都按时间绘制；同时或接近事件会堆叠。默认将同时超过间隙中位数 8 倍及总跨度 10% 的安静时段，绘制为标有省略时长的固定宽度中断；`layout.breaks: "none"` 保留一条按比例轴。参见 [`../renderers/timeline/README.md`](../renderers/timeline/README.md)。

<a id="waterfall"></a>

### Waterfall

瀑布图为一次请求、任务或 agent 运行回答“时间花在哪里”。每个跨度包含 `id`、`name`、`start`，以及 `end` 或 `duration`，单位为 `meta.unit`（`us`、`ms`、`s`；默认 `ms`），另有可选 `parent`、`status`、`service`、`detail`。条形位置和长度仅来自这些数字。`meta.evidence` 必填：只有记录的计时（追踪导出、日志、profiler、计时运行）才能用 `measured`，否则用 `illustrative`。绝不根据代码结构推断时长，也不把估计数字当实测展示。

没有记录结束时间的跨度必须设为 `status: "incomplete"`；以开放下界绘制到最后记录时刻。互相矛盾的 end／duration、早于 start 的 end、缺失 parent 或 parent 环都会被拒绝。百分比始终是“占墙钟总时长”；父子时长包含彼此，不相加。输入未声明依赖时，不标注关键路径或等待时间。参见 [`../renderers/waterfall/README.md`](../renderers/waterfall/README.md)。

<a id="lifecycle"></a>

### Lifecycle

Schema v3 是唯一的 Lifecycle 契约。`mainPath` 从初始状态列出正常路径；每对相邻状态需要 transition。全部几何由渲染器拥有：主路径为一行，回到较早阶段（或向前跳过）的转换成为行上方弧线；其他每个状态位于其分支来源状态下方，离主路径每远一步就多下一行。只有 label、note、variant 匹配，并且恰好只有一组来自至少两个主路径阶段的出口符合该目标时，等价出口才共享一根箭头。连续阶段获得复合框，不连续阶段共享总线。其他出口保持独立，包括原 transition 上各不相同的 note。不要删除或复制 note 以强迫共享。不存在 lane、column、size 或路由控制。布局重试保留 transition 文本的最小间隙；当主路径行的最小宽度将超过原始文字可读性预算时，停止加宽。最终宽度和标签净空检查仍然适用。

主路径只保留读者要跟随的阶段，最多约六个状态，transition 标签保持简短。可恢复失败必须有一条真实返回 active 状态的 transition；写着“retry”的卡片不是拓扑。

根据读者应该注意什么来选状态 `type`，因为颜色和角部符号跟随它：等待人、时间或输入用 `waiting`；评审或分支点用 `decision`；良好或失败结果用 `success`／`failure`；停放状态和既非成功也非失败结果用 `neutral`；外部方持有工作时用 `external`；其余用 `active`。从 Mermaid `stateDiagram` 转换时，`[*] -->` 指定第一个 `mainPath` 状态；带 `--> [*]` 的状态是结果（`success`、`failure` 或 `neutral`；没有其他出转换时绘制为终态）；`<<choice>>` 转为 `decision`。将复合 `state X { ... }` 展开为内部状态，并从每个内部状态以同一标签重复其出口；共享该出口的连续主路径阶段自动加框。并发区域（`--`）没有 Lifecycle 形式：每个区域单独绘制一个生命周期图。

<a id="repository-evidence"></a>

## 仓库证据

图表必须反映真实代码时，创作前检查仓库入口、运行时边界、存储、传输和部署配置。只记录实际验证过的证据。每种图表类型的 `render`、`validate`、`deliver`、`preview`，Architecture 的 `compare`，以及 Workflow 的 `migrate` 都接受 `--repo-root <path>`；每种模式以相同方式验证 `meta.repository` 与节点 `sources`。迁移基于源码的 Workflow 也需要相同 `--repo-root`，以便在替换目标前验证候选文件。绝不仅凭文件相邻或命名推断运行时因果。

声明 `meta.repository.url` 和一个完整四十字符 `revision`，随后将 `sources` 附到模式的节点集合（Architecture `components[]`、Workflow 和 Data Flow `nodes[]`、Sequence `participants[]`、Lifecycle `states[]`），使用仓库相对 `path`，以及可选 `line`、`end_line`、`label`。验证读取该 commit 的 blob，与工作树编辑独立。验证忽略本地 Git replacement ref，包括 `GIT_REPLACE_REF_BASE` 选择的替换，并始终读取固定 SHA 对应的原始对象。它不改变仓库配置，也不删除 replacement ref。每种链接模式都要求匹配的本地 origin、可用 commit、受边界约束的路径、blob 和合法行范围。验证完全在本地，不发远程请求；它不证明公开可用性，也不证明当前读者的访问权。

`link_mode` 默认 `web`。GitHub、Gitee 和 GitLab HTTPS 仓库 URL 生成固定 revision 的链接；公共主机 github.com、gitee.com、gitlab.com 自动选择 provider。可选 `provider: "github"`、`"gitee"` 或 `"gitlab"` 必须与公共主机一致。自托管 GitLab 主机声明 `provider: "gitlab"`；Archify 绝不联系该主机来检测托管平台。已有 GitHub 声明和默认交付回执字段保持兼容。

GitLab URL 可包含嵌套分组（`group/subgroup/project`）。源链接使用 `<url>/-/blob/<revision>/<path>#L<line>-<end_line>`，仓库链接使用 `<url>/-/tree/<revision>`。带行范围的 Markdown 来源（`.md`、`.markdown`）链接到纯文本视图（`?plain=1`），使引用行高亮，而不是显示渲染文档。GitLab 仓库路径与 GitHub 一样，不区分大小写比较。

```json
{
  "url": "https://gitee.com/team/service",
  "revision": "0123456789abcdef0123456789abcdef01234567",
  "provider": "gitee"
}
```

```json
{
  "url": "https://git.example.com/platform/payments/service",
  "revision": "0123456789abcdef0123456789abcdef01234567",
  "provider": "gitlab"
}
```

内部或不受支持的托管平台选择 `link_mode: "local-only"`。查看器保留 SRC 标记、可搜索文件路径、行范围和 revision 标签，但不提供仓库或源超链接。证据回执增加 `linkMode: "local-only"`。`url` 仍是必填的预期 origin 身份；local-only 禁用链接，不禁用身份验证。不支持没有 origin 的仓库。

```json
{
  "url": "http://git.internal:3000/Platform/Services/service",
  "revision": "0123456789abcdef0123456789abcdef01234567",
  "link_mode": "local-only"
}
```

Local-only 接受 HTTP(S)、`git@host:path` 和 `ssh://git@host[:port]/path` 地址，包括嵌套命名空间。声明不含凭据的地址；检出 origin 中的 HTTP(S) 凭据不参与身份比较，并从诊断中脱敏。主机名不区分大小写；仓库路径除 GitHub 和 GitLab 外保留大小写。尾部斜杠会规范化移除。只有 GitHub、Gitee 和 GitLab（gitlab.com，或声明 `provider: "gitlab"` 的主机）会规范化末尾 `.git`，并将同主机的标准 HTTPS／443 与 Git SSH／22 匹配；不会推断另一主机或端口上的 GitLab SSH 端点。其他主机使用实际 clone 地址：传输方式、端口、`.git` 后缀，以及远程相对路径／绝对路径必须匹配。例如 `git@host:Team/repo` 不同于 `ssh://git@host/Team/repo`；`git@host:/Team/repo` 则与后者匹配。SCP 风格路径保留字面的百分号转义，而 URI 路径会解码。不会猜测 SSH 主机别名或平台特有的 browse／clone 前缀。此版本未实现 Gitea／Forgejo／Bitbucket Web 链接；有经过测试的链接 provider 前，使用 local-only。未知 Web provider 会以诊断失败，不生成猜测链接。

<a id="hand-placed-fallback"></a>

## 手工摆放回退

仅在没有任何渲染器能运行时使用。从 `assets/template.html` 开始，保留语义 CSS 类、行内 SVG／可访问性结构，并执行交付视觉检查清单。绝不引入破坏深浅主题一致性的行内字面颜色。

<a id="node-icons"></a>

## 节点图标

领域特定图表可以在 Architecture 组件、Workflow／Dataflow 节点、Sequence 参与者或 Lifecycle 状态上设置可选 `icon`。日常概念选择 `calendar`、`clock`、`person`、`briefcase`、`flag` 或 `moon`；完整目录（包括既有技术和生命周期符号）位于 `common.schema.json#/$defs/nodeIcon`。使用 `icon: "none"` 隐藏角部符号。省略 `icon` 保留按 type 的默认行为；Lifecycle 的 `start`、`active`、`neutral` 状态默认无符号。这些行内 SVG 符号由渲染器拥有，随图表导出；不接受 URL 或原始 SVG。

图标选择只改变角部符号。节点 type 仍决定颜色和语义分组；品牌标识保持独立。假期工作流可以将 `type: "backend", icon: "calendar"` 与 `meta.legend.entries.backend.label: "假期"` 配对；补班则使用 `icon: "briefcase"` 和相应图例标签。节点 label 要有意义：图标是装饰性的，对辅助技术隐藏。

完整工作流示例见[假期规划](../examples/holiday-planning.workflow.json)。
