<a id="sequence-renderer"></a>

# 时序图渲染器

将 `diagram_type: "sequence"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/sequence/render-sequence.mjs input.sequence.json output.html
```

渲染器使用随包独立校验器，按照 `archify/schemas/sequence.schema.json` 校验输入，不需要安装依赖。

如果省略 `output.html`，渲染器使用 JSON 文件中必填的 `meta.output` 值。

<a id="input"></a>

## 输入

时序图 JSON 文件必须设置：

```json
{
  "schema_version": 1,
  "diagram_type": "sequence",
  "meta": {
    "title": "Cache Miss Request Sequence",
    "output": "cache-miss-request.html",
    "viewBox": [920, 760]
  },
  "participants": [],
  "segments": [],
  "messages": [],
  "activations": [],
  "cards": []
}
```

时间线随 viewBox 高度缩放：更高的 `meta.viewBox` 提供更多消息空间，更矮时缩小可读带而不是裁切。完整示例位于 `archify/examples/cache-miss-request.sequence.json`。

schema 位于：

```text
archify/schemas/sequence.schema.json
```

<a id="legend"></a>

## 图例

默认视觉图例从 `messages[].variant` 推导种类（省略 `variant` 等同于 `default`）。支持的 `meta.legend.entries` 键按稳定顺序为 `emphasis`、`return`、`security`、`dashed`、`default`。它们是视觉消息键，不是 Semantic Lens 控件；标签／可见性覆盖不会创建边事实。

图例位于全部时间线内容下方，包括最后一条消息及其 note、activation 条和 segment 框，并保留 12px 间隙。没有 `meta.viewBox` 时，画布高度适配这些内容（没有固定的 760px 下限），较晚消息需要更多空间时继续增长。作者指定的 `viewBox` 太矮时，`showcase` 会失败并指出应设的确切高度；`standard` 会隐藏隐式图例，而不是把它绘制在内容上。生命线停在图例上方。消息标签采用对应线条颜色；灰色 default 和 return 线仍使用弱化文字色。

<a id="layout-budget"></a>

## 布局预算

| 常量 | 值 |
|----------|-------|
| viewBox | 自动高度容纳内容和图例（最小 327px 可读带）；较晚内容需要空间时继续增高；2–3 个短标签参与者自动宽度紧凑为 560–800px（4 个及以上默认 920；长标签仍可加宽）。schema 最小值 `[480, 480]` |
| 参与者盒子 | `spread`（默认）：相对于 viewBox 的宽度，从 86px 到 190px；`fixed`：宽 86px；两者都高 60px，位于 y 72 |
| 参与者列 | `fixed`：中心 x = 62 + index×108；`spread`：在可用 viewBox 宽度内分布列，卡片间至少留 16px 沟槽 |
| 参与者数量 | 最后一个盒子必须结束于 width − 40 或之前；无法容纳的布局拒绝继续 |
| 生命线 | 从 y 142 到 height − 65（绘制到图例正上方）；带高必须 ≥120px |
| 消息 `y` 范围 | `[160, height − 83]` |
| 消息间距 | 共享横向空间的消息之间，纵向至少 28px |
| 箭头跨度 | 两个参与者之间的横向距离 ≥60px |
| 消息 note | 箭头下方的 7px 上下文文字，在普通 Read 缩放时可见（Map 隐藏文字但不改变时间线几何）；在相邻生命线之间的一个间隙内以 11px 行距换行（消息跨越的最宽间隙；相差 0.5px 以内视为相同，选择最左侧，即 note 一直以来的起点），避开 activation 条；长的无间隔文字优先在 `/ . - ? & = # _` 后断行，否则可在任意字符处断开，使完整 note 保留在每次导出中。`showcase` 下，note 抵达后续消息时以 `sequence/note-overlap` 失败，给出该消息需要的 `y`；note 超过画布内容限制时以 `sequence/note-canvas-limit` 失败，给出所需 `meta.viewBox[1]`；segment 标签在四次向上移动后仍覆盖消息标签、路由或 note 时，以 `sequence/segment-label-overlap` 失败；每条诊断注明源路径，存在可验证修改时提供 `supportedFixes` |
| Segments | y 像素范围，`to > from`，位于 `[72, lifeline bottom + 20]` 内 |
| 图例 | 最后一行基线为 height − 54；额外行向上换行，始终保持在时间线内容下方 12px |

`segments[].from/to` 和 `activations[].from/to` 是 y 像素坐标，不是参与者 ID；activation 同样要求 `to > from`。

<a id="column-fit"></a>

### 列适配

无论是否提供 `meta.viewBox`，时序图默认 `meta.column_fit: "spread"`。显式 `"fixed"` 保留历史的 86px 盒子与 108px 列间距。要保留历史固定坐标，明确设置 `meta.column_fit: "fixed"`。宽 viewBox 否则会在右侧留下空白，或有意义的参与者标签放不进固定 86px 盒子时，使用 `"spread"`。Spread 从 viewBox 推导盒子宽度和列间距，同时保留参与者顺序、生命线和消息语义。参与者卡片保留至少 16px 沟槽。能够容纳这些卡片的窄画布，可以将左边距从 62px 减到 40px；普通画布保持 62px，右边距仍为 40px。窄到无法容纳这些边距和沟槽的框架会失败，而不是扩大作者指定的 viewBox。

产物检查器根据渲染后的参与者、路由和文字报告 `composition.sequenceColumnSpace`。固定布局右侧存在大片未用区域时，`finalize` 可能给出 `inspect-sequence-width` 建议；这只是建议，不是新的警告或失败。有界的创作修复以及显式 fixed 保留规则，见[时序图宽度审阅](../../references/delivery-contract.md#sequence-width-review)。

<a id="design-rules"></a>

## 设计规则

- 消息当前要求 `from` 和 `to` 是不同参与者。虽然 schema-v1 接受相同 ID，本渲染器不绘制自调用循环，并以 `sequence/self-message-unsupported` 拒绝，注明消息路径和参与者。增加列间距无法修复自消息。将内部步骤的措辞、归属与顺序保留在真实交互的 note 中，或保留在明确有序的卡片中。不要为了通过校验而编造另一参与者或改变目标。这些创作选择需要语义审阅，不作为自动修复宣传。
- 将参与者横向排列在顶部，顺序遵循读者应跟随的故事。
- 时间向下流动。
- 主请求路径使用 `emphasis`。
- 认证、同意、权限与策略调用使用 `security`。
- 安静的响应消息使用 `return`。
- 异步追踪、事件、日志与非阻塞工作使用 `dashed`。
- 将 segment 作为淡色背景引导；segment 标签保持简短，每条框边与每条消息箭头至少相距 4px。结束一个阶段之前，不仅检查箭头，也检查完整换行的 note。`validate` 和 `check` 在 `composition.sequenceNoteBorders` 中把交叉报告为审阅证据，不阻止 finalize。提供的 `supportedFixes` 修改只延伸指定底边；没有孤立修改能放下时，一起调整阶段边界和消息间距，保留完整 note 与消息顺序。
- 标签保持简洁，但在仅为容纳固定盒子而缩短有意义的参与者标签前，先尝试 `meta.column_fit: "spread"`。

schema 违规以非零状态退出，消息带路径前缀，并标注元素 ID 或 label。渲染器还能在可检测到布局问题时失败，包括参与者缺失、参与者 ID 重复、参与者标签宽于盒子、未知消息端点、消息超出可读时间线、横向重叠消息之间纵向间距过紧、非法 segment 或 activation 范围，以及参与者超出 viewBox。共享 Clean Flow 契约将参与者头部视为语义盒子，同时明确允许消息穿过中间生命线、activation 条与 segment 框。文字宽度估计考虑 CJK：全角字形按两个单位计算。

精致交付时，将 `meta.quality_profile` 设为 `showcase`。无关消息的真实 X 交叉会以 `composition/proper-crossing` 失败；默认 `standard` 将其保留为产物回执警告。消息仍可穿过中间生命线。共线通道不受真实 X 规则约束，但另一道门禁会在无关消息重叠至少 8px 时，于 `standard` 警告、于 `showcase` 失败。共享语义端点、点接触和更短重叠仍合法。showcase 还拒绝任何短于 8px 的路由线段，以及短于 16px 的内部转弯线段；普通 8–15px 端点短段仍合法。
