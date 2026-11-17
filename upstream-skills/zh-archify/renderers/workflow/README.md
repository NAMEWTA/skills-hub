<a id="workflow-renderer"></a>

# 工作流渲染器

将 `diagram_type: "workflow"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/workflow/render-workflow.mjs input.workflow.json output.html
```

渲染器使用随包独立校验器，按照 `archify/schemas/workflow.schema.json` 校验输入，不需要安装依赖。

如果省略 `output.html`，渲染器使用 JSON 文件中必填的 `meta.output` 值。

渲染后运行产物检查器：

```bash
node archify/scripts/check-render-output.mjs output.html
```

它捕获在浏览器中最容易看出的最终 SVG 问题：非有限 SVG 值、意外的两点对角箭头，以及穿过图例的箭头。

<a id="input"></a>

## 输入

工作流 JSON 文件必须设置：

```json
{
  "schema_version": 2,
  "diagram_type": "workflow",
  "meta": {
    "title": "Agent Tool Call Workflow",
    "output": "agent-tool-call.html"
  },
  "lanes": [],
  "phases": [],
  "groups": [],
  "mainPath": [],
  "nodes": [],
  "edges": [],
  "cards": []
}
```

新工作流使用 `schema_version: 2`。其可读布局编译器把每个 `col` 视为 `0..5` 内的逻辑 rank，并从实测文档推导几何。`schema_version: 1` 保留为现有来源的旧固定契约；合法 v1 输出逐字节保留，绝不静默重新解释成 v2。

常见 v2 情况省略 `meta.viewBox`，让编译器使用实测固有边界。v1 中，省略的宽度仍固定为 720，高度由泳道数推导。完整示例位于 `archify/examples/agent-tool-call.workflow.json`；其 `schema_version` 决定适用契约。

schema 位于：

```text
archify/schemas/workflow.schema.json
```

<a id="migration-and-layout-receipt"></a>

## 迁移与布局回执

将现有 v1 来源迁移到独立 v2 文件：

```bash
node archify/bin/archify.mjs migrate workflow old.json new.json --to-schema 2 --json
```

再次运行命令，并以其 schema-v2 输出作为新来源，是一次幂等验证：目标字节与几何保持不变。

旧 v1 来源如果仅因 `meta.output` 缺失或已不可移植而受阻，可为独立 v2 目标提供替代值：

```bash
node archify/bin/archify.mjs migrate workflow old.json new.json --to-schema 2 --output reports/workflow.html --json
```

`--output` 本身必须是可移植的 POSIX 相对 `.html` 路径。它只更新已经验证的目标候选文件；源字节保持不变，所有非输出相关的 schema 和编译器诊断仍会阻止迁移。

该命令默认绝不覆盖来源。它将绝对 `via[*][0]`、`labelAt[0]` 和 `channelX` 值从旧坐标映射到已解出的 rank 空间；除非报告的纵向约束需要作者输入，否则保留 y 坐标；只有无歧义的容纳性修复才扩展显式 viewBox；仅在 v2 编译和产物检查通过后写入目标。含糊的显式固定值会失败，不产生目标文件。

迁移保留 `semanticChecks`，并按完整的作者定义拓扑验证这些要求。临时布局规划可能省略已路由的边，但作者不必为了迁移删除或放宽契约。完整迁移文档仍必须满足每项作者定义要求。

通过以下命令检查稳定、面向作者的 v2 计划：

```bash
node archify/bin/archify.mjs validate workflow input.workflow.json --layout-json
```

回执报告选定契约、实测 `viewBox` 和 `requiredViewBox`、已解出的列、节点、边、标签和因果诊断；刻意省略求解器迭代与候选评分。完整计划若被后期布局、画布或文字检查拒绝，也包含这些几何，并标记 `ok: false`；校验仍非零退出，不写 HTML。其 `viewBox` 是拒绝时尝试的框架，`requiredViewBox` 则是同一被拒计划的实测占地。标签使用锚点坐标，不是遮罩左上角。早期或不完整失败仅保留契约和因果诊断。失败几何是修复证据，不是验收；迁移失败报告也可能增加实测画布证据，但不代表接受被拒计划。

<a id="legend"></a>

## 图例

默认图例从 `nodes[].type` 推导组件种类。支持的 `meta.legend.entries` 键按稳定顺序为 `frontend`、`backend`、`security`、`messagebus`、`database`、`cloud`、`external`。标签与可见性可通过共享图例契约覆盖；只有已渲染节点支持的种类才获得 Semantic Legend 控件。

<a id="layout-contracts"></a>

## 布局契约

<a id="fixed-v1"></a>

### 固定 v1

| 常量 | 值 |
|----------|-------|
| viewBox | 默认 `[720, auto]` — 自动高度 = 52 + lanes×104 + (lanes−1)×20 + 124 |
| 泳道框 | x 40、宽 640、高 104、间隙 20；第一泳道顶部 y 52 |
| 泳道标题带 | 每条泳道顶部 30px；节点盒子必须位于其下方 |
| 列中心（`col` 0–5） | x = 88、220、300、430、500、625 |
| 阶段标题 | 可选 `phases[]` 渲染在第一泳道上方，跨越 `fromCol..toCol` |
| 泳道分组 | 可选 `groups[]` 在单条泳道内框出并行或分支工作 |
| 异常泳道 | 重试、拒绝、回退或失败路径设置 `lane.variant: "exception"` |
| 主路径 lint | 可选 `mainPath[]` 检查正常路径步骤有匹配的边，且不后退 |
| 默认节点 | 92×52（设置 `tag` 时高 68） |
| 节点间距 | 同一泳道内节点间 ≥8px |
| 边长 | 直线段跨度必须 ≥28px |
| 图例行 | y = 泳道底部 + 44；viewBox 高度必须 ≥ 图例 y + 18 |

列中心间距为 132／80／130／70／125px：列 1↔2（80px）和 3↔4（70px）不能在同一泳道里同时容纳默认宽 92px 的节点。此类非法 v1 来源得到一条因果性的 `workflow/column-capacity` 诊断，以及经过验证的迁移到 v2 修复；v1 绝不自动落入自适应布局。

<a id="readable-v2"></a>

### 可读 v2

| 不变量 | 契约 |
|----------|----------|
| 逻辑列 | `col` 是 `0..5` 内整数；像素中心是测量输出 |
| 相邻 rank 基线 | 应用文档特定约束前，中心距离 120px |
| 同泳道节点净空 | 节点纵向区间重叠时 ≥8px |
| 面对面的直连边 | 净间隙 ≥`max(28px, measured label mask width + 8px)` |
| 自动路由节奏 | 直连段 ≥28px；端点短段 ≥8px；内部转弯段 ≥16px |
| 隐式 viewBox | 固有内容边界加契约内边距 |
| 显式 viewBox | 容纳容量；输入过小时报告确切 `requiredViewBox` 与贡献项 |
| 泳道测量 | 同列纵向堆叠（两个或更多不同 `yOffset` 值）使隐式、未固定工作流选择按泳道测量。显式 `meta.viewBox`、`via`、`labelAt`、`channelX`、`channelY`，以及没有堆叠的工作流，为兼容而保留共享高度的 v2 几何。 |

未固定的 v2 草稿，在重叠的同泳道节点间为路由预留 32px；省略节点宽度时，可从 92px 增长到 200px 以容纳文字。文档存在显式 `meta.viewBox` 或绝对 `via`、`labelAt`、`channelX`、`channelY` 固定值时，在编译与迁移规划中都保留现有宽度默认值和 8px rank 净空约束。作者指定宽度保持权威。

自动 showcase 画布按照桌面阅读下限检查 sublabel，不把文字扩大到既有 8px 槽位之外。如果画布无法让该槽位保持可读，`workflow/sublabel-readability` 会报告所需字体和画布宽度。standard 质量与显式画布保留先前文字适配行为，以及现有构图／浏览器质量检查。

编译器只对真实相关或同泳道重叠节点应用约束，因此无关泳道里的宽节点不会扩展所有 rank。满足正确性约束后，旧中心位置只是软偏好，不是几何保证。phase 和 group 框从求解后的 rank 带推导。自动路由只规范化一次，同一个最终场景驱动校验和 SVG 序列化。长自动标签会比较直连间隙扩展与合法通道，而不是扩宽所有下游 rank。实测多行图例参与固有高度和显式 viewBox 容量计算。

Issue #250 的结构已经能在 v2 中表达，无需作者指定泳道尺寸。将三个阶段保留在一个分组泳道中，省略 `meta.viewBox`，并让偏移围绕零居中：

```json
{
  "schema_version": 2,
  "diagram_type": "workflow",
  "meta": { "title": "stack", "output": "stack.html" },
  "lanes": [{ "id": "cage", "label": "one cage" }],
  "groups": [{ "id": "g", "label": "cage", "lane": "cage", "fromCol": 1, "toCol": 3 }],
  "nodes": [
    { "id": "a", "lane": "cage", "col": 2, "type": "security", "label": "stageA", "yOffset": -90 },
    { "id": "b", "lane": "cage", "col": 2, "type": "security", "label": "stageB", "yOffset": 0 },
    { "id": "c", "lane": "cage", "col": 2, "type": "security", "label": "stageC", "yOffset": 90 }
  ],
  "edges": [
    { "from": "a", "to": "b", "fromSide": "bottom", "toSide": "top" },
    { "from": "b", "to": "c", "fromSide": "bottom", "toSide": "top" }
  ]
}
```

隐式 readable-v2 的纵向堆叠，若测得泳道高度超过 104px 基线，会声明 `data-reader-fit="width-first"`；任何隐式 readable-v2 画布，如果以全宽显示会溢出 1440×900 桌面页面，也会如此声明。桌面查看器使用可用阅读宽度和普通页面滚动，让高阶段保持可读，并保留既有 1.5× 自动放大上限。这只改变显示尺寸：规范 SVG 几何和显式 `meta.viewBox` 工作流保留作者契约。Embed、Present 和打印保留现有适配模式。`visual-check` 仍检查可读性、横向容纳性和裁切；该声明不弱化节点或路由校验。

作者指定的 `via`、`labelAt`、`channelX`、`channelY` 在 v2 中都是绝对硬固定值；不可行时返回 `workflow/explicit-pin-conflict`，而不是静默移动。`fromSide` 和 `toSide` 仍是方向约束。路由预设限制自动候选族，本身不是绝对坐标固定值。任一端点侧省略时，v2 编译器选择可行端口侧；作者指定端口侧时，该端点仅可使用所命名的端口。不可行预设返回 `workflow/route-preset-conflict`，包含实际被拒的 `evidence.invariant`。对于节点净空，它还指出节点、线段、端点角色及所需净空。依据该障碍调整相连布局或路由约束，再重新校验；只有最小线段长度，不能证明路径畅通。`workflow/route-preset-conflict` 的具体替代方案，会在当前质量配置下重新规划完整工作流来检查。

<a id="design-rules"></a>

## 设计规则

- 泳道用于归属或运行时边界。
- phase 标题用于 Intake、Plan、Execute、Report 等高层故事节拍。
- group 用于并行检查、分支处理或泳道内有界工作；每个 group 至少包含一个节点。
- 一个容器内纵向堆叠的顺序阶段，使用一条 v2 泳道和一个 group，让阶段同列，并省略 `meta.viewBox`。`yOffset` 相对于泳道内容区中心，因此三阶段堆叠应以 `-90 / 0 / 90` 居中，而不是 `0 / 90 / 180`。路由和画布由编译器控制时，编译器只扩展该泳道。
- 人工等待、拒绝、重试、回退和失败泳道使用 `lane.variant: "exception"`，不要把它们混入正常路径。
- 图有明确正常路径时设置 `mainPath`；渲染器验证相邻 ID 有匹配的边，并从左向右移动。
- 使用 lane ID 与 `0..5` 内的 `col` 索引摆放节点，不使用原始 SVG 坐标。
- 保留语义边标签。可读 v2 分配实测标签净空；标签放不下时，修复报告的容量或路由约束，不删除含义。
- 对决策、审批、协议、异步追踪、返回路径，以及端点无法完整暗示的任何关系含义，使用标签。
- 在使用原始 `via` 点之前，优先使用路由预设——`drop`（泳道间弯折；`bias` 0–1 选择位置）、`outside-right`、`return-left`、`bottom-channel`、`up-channel`；其余由 `straight` 和默认 `auto` 覆盖。
- 工作流示例保持足够紧凑，以便在窄聊天／浏览器预览中良好渲染。

<a id="optional-semantic-checks"></a>

### 可选语义检查

布局校验无法从标签或卡片推断领域事实。源代码证据建立了根、终点、必需直接关系或必需有向可达性时，将这些事实编码进 `semanticChecks`：

```json
"semanticChecks": {
  "allowedRoots": ["request", "resource_catalog"],
  "allowedTerminals": ["reply", "audit_log"],
  "requiredEdges": [
    { "from": "dispatch", "to": "dispatch_ledger" }
  ],
  "requiredPaths": [
    { "from": "event_ledger", "to": "runtime_host" }
  ]
}
```

存在 `allowedRoots` 或 `allowedTerminals` 时，它分别是零入边或零出边节点的完整允许列表。`requiredEdges` 要求一条确切作者定义方向；`requiredPaths` 允许中间节点，但遵循作者定义边方向。这些检查在布局前运行，不改变 SVG 或回执字节；不能仅为了消除路由或构图诊断而弱化。领域事实未知的字段应省略。

schema 违规以非零状态退出，消息带路径前缀，并标注元素 ID 或 label。渲染器还能在检测到布局问题时失败，包括节点重叠、节点在泳道之外、非法 phase／group 列范围、空 group、断裂的 `mainPath` 步骤、未知边目标、标签与节点或其他标签碰撞、标签宽于节点、图例超出 viewBox，或直箭头短到无法清晰阅读。共享 Clean Flow 门禁还拒绝以 2px 净空穿过无关节点的边；lane、phase 和 group 仍是允许有意穿过的容器。文字宽度估计考虑 CJK：全角字形算两个单位。

诊断遵循因果关系：rank 容量失败会抑制派生的短边、端点方向与标签重叠发现。`supportedFixes[]` 可包含由编译器修复搜索检查过的具体编辑，或来自共享构图检查的一般修复指导。一般指导不等于经过验证的编辑。任何编辑之后，都重新运行完整 `finalize` 命令。如果标签存在并未导致失败的不变量，诊断绝不会建议删除语义标签。

精致交付时，将 `meta.quality_profile` 设为 `showcase`。无关关系的真实 X 交叉会以 `composition/proper-crossing` 失败；默认 `standard` 将其保留为产物回执警告。共线泳道通道不受真实 X 规则约束，但另一道门禁会在无关边重叠至少 8px 时，于 `standard` 警告、于 `showcase` 失败。v1 保留作者定义的共享端点契约。v2 也检查共享端点，包括显式控制的路由：长或混合样式的主干、逆流、真实内部 X 交叉，以及重叠的独立箭头都不豁免。固定值保留，不静默修复；未解决的 v2 通道／箭头碰撞在 `standard` 警告，在 `showcase` 失败。

v2 仅在两条关系共享实际来源或目标端口、有效 variant、描边宽度和角色时，才允许最多 24 SVG 单位、同方向的共享末端短段。非末端重叠绝不算这种短段；前向共线途经点不能把长主干拆成允许的小段。兼容的短合流可以共享末端箭头。自动路由考虑独立端口，在争用节点预留绝对路由，优先清晰路径，而不是更短却含糊的路径。拥挤自动通道可以做有界局部调整，不移动节点，不改变显式坐标。

SVG 携带 `data-layout-contract="readable-v2"` 和每条边的角色，让产物检查对实际可见路径几何应用相同分类，而不是依赖过时的 composition-point 元数据。这些内部输出属性不会增加创作 schema 字段。其他图表类型保留现有规则。v2 的真实交叉诊断，在编译器／layout-JSON 回执和最终 HTML 检查中，都保留关系 ID、交点和支持的修复；`standard` 报告警告，`showcase` 拒绝交叉。两种分析都会合并前向共线途经点，而不改写作者路径；真实弯折和反向仍视为端点接触，不会被合并成 X。

较旧的逐边 `data-composition-routing="workflow-v2-auto"` 标记仍保留，用于兼容没有根布局契约的第一轮导出 HTML，以及较旧产物检查器。仅有标记的产物保留更窄的自动节点对交叉／逆流策略；根 `readable-v2` 契约存在时具有权威性，也检查显式路由。未退役该导出格式之前，不要把仅标记路径当作死代码移除。showcase 还拒绝任何短于 8px 的路由线段，以及短于 16px 的内部转弯段；普通 8–15px 端点短段仍可用于固定泳道间隙。
