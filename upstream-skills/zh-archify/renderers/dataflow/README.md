<a id="data-flow-renderer"></a>

# 数据流渲染器

将 `diagram_type: "dataflow"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/dataflow/render-dataflow.mjs input.dataflow.json output.html
```

渲染器使用随包独立校验器，按照 `archify/schemas/dataflow.schema.json` 校验输入，不需要安装依赖。

如果省略 `output.html`，渲染器使用 JSON 文件中必填的 `meta.output` 值。

<a id="input"></a>

## 输入

数据流 JSON 文件必须设置：

```json
{
  "schema_version": 1,
  "diagram_type": "dataflow",
  "meta": {
    "title": "Product Analytics Data Flow",
    "output": "product-analytics-dataflow.html",
    "viewBox": [940, 720]
  },
  "stages": [],
  "nodes": [],
  "flows": [],
  "cards": []
}
```

完整示例位于 `archify/examples/product-analytics.dataflow.json`。

schema 位于：

```text
archify/schemas/dataflow.schema.json
```

<a id="legend"></a>

## 图例

默认视觉图例从 `flows[].variant` 推导种类（省略 `variant` 等同于 `default`），仅在存在 database 节点时加入 `database`。支持的 `meta.legend.entries` 键按稳定顺序为 `emphasis`、`security`、`dashed`、`database`、`default`。flow variant 仍仅用于视觉，因为本阶段实现没有已编译的边种类事实。存在的 `database` 条目有所不同：它来自确切的 `nodes[].type: "database"` 事实，因此发布普通的 Semantic Legend 计数、可访问名称和键盘交互。没有 database 节点却强制显示 `database` 时，它仍只属于视觉。

<a id="layout-budget"></a>

## 布局预算

| 常量 | 值 |
|----------|-------|
| viewBox | 省略宽度时会容纳所有 stage 框和节点，包括作者指定宽度，保留 24px 右内边距，最小宽度 480px（五个默认宽度 stage 需要 1068）；高度默认 720，全自动 showcase 中适配内容；schema 最小值 `[360, 360]` |
| Stages（2–5） | 中心 x = 100 + stage×215；stage 带宽 168，标题位于 y 46 |
| 行顶部（`row` 0–4） | y = 128、242、356、470、584（再加 `yOffset`） |
| 默认节点 | 112×58 |
| 节点区域 | x 在 `[24, width − 24]` 内；y 在 `[104, height − 74 − node height]` 内 |
| 节点间距 | 任意两个节点之间 ≥10px（跨 stage 和 row 检查） |
| Flow 长度 | 端点之间 ≥34px |
| 图例行 | y = height − 36 |

flow 路由预设包括 `straight`、`vertical-channel`、`bottom-channel`、`top-channel`、显式 `via` 点，或默认 `auto`（中点弯折）。

作者指定的 `meta.viewBox` 保持权威。省略时，在 `standard` 和 `showcase` 中，画布宽度都会容纳 stage 框和节点，包括显式节点宽度。增大宽度无法修复左边缘溢出。

showcase 的节点尺寸、字体、自动高度、端口桥接和标签摆放，仅在省略 `meta.viewBox` 且所有节点都省略 `width` 时生效。作者指定画布或节点宽度会保留既有布局行为，`standard` 也一样。有效质量配置为 `process.env.ARCHIFY_QUALITY_PROFILE || meta.quality_profile`；公开 CLI 的 `--quality standard|showcase` 设置环境覆盖值。

全自动 showcase 中，节点宽度可在 stage 与画布预算内增长，让辅助文字在桌面投影下保持可读。高度跟随真实节点边界、路由点和已渲染标签底板，在内容下方保留 24px，再加 stage／图例的 74px 预留。行与作者定义路由保持权威；未激活的通道控制不会扩大画布。

拥挤的入箭头可以在所在行剩余空间内，将默认节点纵向扩展到最多 104px 高。行中心和文字组保持不动，因此清晰的同一行输出仍为直线。保留 16px 角部沟槽和 10px 节点间距。显式节点 height、`yOffset`，或相接路由、端口侧、标签的固定值，都会保留原盒子。空间限制仍可能让非常密集的输入拥挤；不会移除关系或标签。

面对面的自动端口在垂直于路由的轴上距离小于 16px 时，如果直线路径畅通，非共享端点可以与分散端点对齐。这会保留共享槽位、16px 角部沟槽、已占端口以及作者定义的路由／标签控制。当两端均分散，或直达路径受阻时，保留现有垂直桥接。

障碍路由使分支最初行进方向反转时，共享端口侧可以根据稳定路由的第一次转弯，对现有槽位重新排序。标签摆放前，最多尝试 16 组完全自动的、含二到八个端口的组。只有某条路由变为直线，且没有成员增加长度或弯折、增加交叉、折返，或失去节点、边框、通道净空时，才接受该组。显式端口侧、路由和标签控制保留自己的槽位。

路由和标签稳定后，可以进行一次有界遍历，在保持其他全部路由和标签不变的同时重试对齐。最多检查 16 个标签位置；直线路径必须保留端口间距，并具有清晰、邻近的标签位置。网格修复替换有效桥接前，也必须保留路由节奏下限。未固定标签保持在距自身路由 36px 的遮罩净空范围内。如果外来路由占用了附近槽位，使标签仍位于节点内部，有界联合修复可以移动该路由，再次摆放标签。它最多检查 16 个标签槽位和 16 个路由候选，不增加弯折或交叉。无法解决的摆放保留碰撞诊断。显式 `labelAt`、`labelDx`、`labelDy`、`labelSegment` 保持权威，包括零偏移。已有合法标签会保留。

如果完整的自动标签在路由之后仍碰撞，其文字可以在水平线段旁换成两行。字号、措辞、classification 和全部路由保持不变。底板保持在该线段跨度内，并距每条路由至少 4px，而不是移到附近节点上方。此最后的容量修复，为每个受阻标签最多尝试八种词边界拆分和 64 个位置。如果两行仍放不下，保留原诊断。

<a id="design-rules"></a>

## 设计规则

- 使用 stage 表示数据生命周期边界：来源、摄入、处理、存储、消费。
- 按 stage 索引和 row 索引摆放节点；普通情况不要手工摆放原始 SVG。
- 使用 flow 标签命名数据资产，而不是传输原语：`clickstream`、`identity map`、`normalized facts`、`feature vectors`。
- 使用 `classification` 表达简短的敏感性或治理上下文：`PII touch`、`non-PII`、`approved only`、`batch`、`read-only`。
- 对 PII、策略、同意、访问控制或受限关联使用 `security`。
- 主数据路径使用 `emphasis`，异步或批量派生使用 `dashed`。
- 标签要足够短，能容纳在窄预览中。

schema 违规以非零状态退出，消息带路径前缀，并标注元素的 ID 或 label。渲染器还能在可检测到布局问题时失败，包括：stage 缺失、节点 ID 重复、节点位于可读图区域之外（`dataflow/node-above-area`／`dataflow/node-below-area`；below-area 诊断只在升高页面后仍能适配目标视口时，才建议提高 `meta.viewBox[1]`，并注明可行高度范围——建模的轴是页面容纳性，而投影文字可读性由交付检查单独报告（`viewer/projected-text-readability`））、节点重叠、标签与节点或其他标签碰撞、标签宽于节点、未知 flow 端点、缺少 flow 标签、flow 短到不可读、flow 穿过无关节点（2px Clean Flow 净空），或 stage 超出 viewBox。stage 框仍是允许有意穿过的容器。文字宽度估计考虑 CJK：全角字形按两个单位计算。

精致交付时，将 `meta.quality_profile` 设为 `showcase`。未解决的真实 X 交叉会以 `composition/proper-crossing` 失败；默认 `standard` 则将其保留为产物回执警告。在没有作者指定画布或节点宽度的自动 showcase 布局中，渲染器会比较清晰绕路与视觉分离的交叉。它优先选择短而清晰的路由，但可能保留带不透明光晕的较短自动交叉，而不采用长的外围绕行。比较交叉之前，有界路由搜索会尝试修复进入无关节点或共享歧义通道的自动路径。它们保留节点净空和通道分离；搜索失败仍保留阻挡诊断。两条交叉路径都需要匹配光晕；产物检查会验证其几何，并报告 `resolvedCrossovers` 供视觉审阅。用户提供的 `via`、非 auto 的 `route` 和通道坐标保留其几何与交叉诊断。共线 stage 通道不受真实 X 规则约束，但另一道门禁会在无关 flow 重叠至少 8px 时，于 `standard` 警告、于 `showcase` 失败。共享语义端点、点接触和更短重叠仍合法。showcase 还拒绝任何短于 8px 的路由线段，以及短于 16px 的内部转弯线段；普通 8–15px 端点短段仍合法。
