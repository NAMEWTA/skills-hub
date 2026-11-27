<a id="lifecycle-renderer"></a>

# 生命周期渲染器

将 `diagram_type: "lifecycle"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/lifecycle/render-lifecycle.mjs input.lifecycle.json output.html
```

渲染器使用随包独立校验器，按照 `archify/schemas/lifecycle.schema.json` 校验输入，不需要安装依赖。如果省略 `output.html`，则使用 JSON 文件中必填的 `meta.output` 值。

<a id="input"></a>

## 输入

```json
{
  "schema_version": 3,
  "diagram_type": "lifecycle",
  "meta": { "title": "Deployment Release Lifecycle", "output": "deployment-release.html" },
  "mainPath": ["queued", "building", "verifying", "ready", "live"],
  "states": [],
  "transitions": [],
  "cards": []
}
```

完整示例位于 `archify/examples/deployment-release.lifecycle.json`。

- `mainPath` 是从初始状态开始的正常路径。每对相邻状态都需要一条 transition；其中第一条 transition 被绘制为主行。
- `states[]` 只承载含义：`id`、`type`、`label`，以及可选的 `sublabel`、`tag`、`step`、`icon`、`brand` 和 `sources`。
- `transitions[]` 包含 `from`、`to`，以及可选的 `id`、`label`、`note`、`variant`。没有路由或标签位置控制。

<a id="layout"></a>

## 布局

几何完全由结构推导：

| 元素 | 放置方式 |
|---------|-----------|
| 主路径 | 从左到右的一行。每个间隙容纳其转换标签。第一个状态接收 UML 初始标记。 |
| 循环与跳过 | 两个不连续主路径状态之间的转换（或返回更早状态、自转换）绘制为行上方的弧。短弧嵌在长弧内；端口排序保证外侧上升线不穿过内弧。 |
| 其他状态 | 按距主路径的距离，每一层一行。状态从其在上一行所连接状态的下方开始；重叠状态并排排布。 |
| 行间 | 通过共享间隙的正交路由。水平段使用独立轨道，以尽量减少交叉；近乎垂直的路由吸附为直线，或扩展为可读折线。从末行返回初始状态的拥挤路径，在路由和标签能放下时可使用外侧边距。 |
| 共享出口 | 一个目标若恰有一组来自至少两个主路径阶段、标签、注释和 variant 完全相同的转换，则共享出口：连续阶段获得 UML 超状态式虚线复合框；不连续阶段共享带连接点的总线。其他出口保留独立连线和各自标签。如果同一目标有多组合格，全部出口仍保持独立。 |
| 同一下层行 | 相邻状态从侧面连接，并行转换围绕共享边展开（每对状态最多五条）。密集的平行标签和注释会增加通道间距及该下层行高度，以保持净空；其他状态对从行下方绕行。 |
| 标签 | 位于主路径箭头上方、弧和循环的延伸段上；其他情况位于靠近较低状态的线段旁。每个标签都与其他路由、状态和标签保持净空；如无法做到，则增加下层行及路由间距，并重复布局，最多五轮。主路径间隙会在最小行宽超过文本可读性预算之前停止增长；间隙仍容纳各自的转换文字。 |

每条路由都带交叉光晕，因此不可避免的交叉（例如两个重叠循环）仍可辨读。线条为带圆角的正交线。将不同的 note 保留在原 transition 上；不要删除或复制 note，以使不同出口满足共享条件。布局重试之后，最终宽度和标签净空检查仍然适用。

<a id="legend-and-state-marks"></a>

## 图例与状态标记

状态颜色依据 `states[].type`：active 和 start 为青色，waiting 为琥珀色，decision 为紫色，success 为绿色，failure 为玫瑰色，neutral 和 external 为石板色。主路径第一个状态带初始标记；没有出边 transition 的状态以双边框表示终态。默认图例从已渲染状态推导种类，始终列出初始标记；存在终态时，添加不可交互的 `final` 条目。支持的 `meta.legend.entries` 键按稳定顺序为 `start`、`active`、`waiting`、`decision`、`success`、`failure`、`neutral`、`external`。

状态装饰共享一条顶部栏：类型符号和 `step` 在左侧，品牌标识在右上角。只有阅读者应该注意的状态默认带符号：`waiting`（沙漏）、`decision`（菱形）、`success`（勾号）、`failure`（叉号）和 `external`；`start`、`active`、`neutral` 默认没有，除非 `icon` 指定；但终态会获得停止符号，让每种结果都有标记。文字缩小前，状态宽度先从 140px 增长到 220px，以容纳偏好字号的文字（label 12px、sublabel 9px、tag 8px）。

<a id="validation"></a>

## 校验

schema 违规以非零状态退出，并给出带路径前缀的消息。渲染器还拒绝重复状态 ID、未知或重复的 `mainPath` 状态、没有 transition 的 `mainPath` 步骤、未知的 transition 端点、无法放入最宽状态的文字、超过桌面最小文字可读宽度的画布（`lifecycle/too-wide`）、多轮间距调整后仍无法摆放的标签（`lifecycle/label-unplaced`），以及两个相邻状态之间超过五条平行 transition（`lifecycle/crowded-side-transitions`）。每个失败都是带受支持修复方式的类型化诊断。

最终产物检查应用共享构图门禁（正交线段、交叉、通道、标签净空和路由节奏）。同一共享出口总线的路由声明 `data-composition-junction`；它们只能共享该水平总线、同一来源端口的相同第一小段，以及终止于同一状态时汇合进入状态的下落段。内部垂直段仍受通道检查约束。

<a id="design-rules"></a>

## 设计规则

- 将主路径视为叙事：最多大约六个阶段。
- 将中断、等待和出口放在主路径之外；渲染器负责摆放。
- 多个阶段共享的出口使用一个标签，例如“cancel”。
- 可恢复失败需要一条真实的返回 transition。
- 完成使用 `success`，失败出口使用 `failure`，暂停使用 `waiting`，质量门禁使用 `decision`。
