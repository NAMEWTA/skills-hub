<a id="hierarchy-and-tree-renderer"></a>

# 层级与树图渲染器

将 `diagram_type: "tree"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/tree/render-tree.mjs input.tree.json output.html
```

渲染器使用随包独立校验器，按照 `archify/schemas/tree.schema.json` 校验输入。省略 `output.html` 时，使用 `meta.output`，或回退到 `tree.html`。`--layout-json` 打印已摆放节点和链接，不写入 HTML。

<a id="input"></a>

## 输入

```json
{
  "schema_version": 1,
  "diagram_type": "tree",
  "meta": { "title": "Payment platform capabilities" },
  "nodes": [
    { "id": "platform", "label": "Payment platform" },
    { "id": "orders", "label": "Orders", "parent": "platform" }
  ]
}
```

节点具有 `id`、`label`，以及可选 `parent`、`sublabel`、`collapsed` 和 `sources`。子节点按声明顺序读取。每条链接连接父节点及其子节点。Schema 支持单一父节点，没有边标签。

决策是严格层级时，把各结果的条件写进子节点标签，例如 `No matching provider: Exit 2`。保留来源中的精确条件。需要带标签的转换、汇合或循环时使用 [Workflow](../workflow/README.md)。

<a id="structure-checks"></a>

## 结构检查

层级完全按作者声明，不附加或推断任何关系。

| 代码 | 拒绝的输入 |
| --- | --- |
| `tree/missing-parent` | `parent` 指定了未声明的节点 |
| `tree/root-count` | 没有 `parent` 的节点为零个或超过一个 |
| `tree/cycle` | parent 链形成环；环以下每个节点均不可达，因此该诊断一并覆盖它们 |
| `tree/duplicate-id` | 同一 ID 声明两次 |

<a id="layout"></a>

## 布局

`layout.direction: "down"`（默认）时，每代共享一行；`"right"` 时共享一列。父节点居于首个与末个子节点之间。在没有堆叠列表的自动向下树中，相邻子树可在不同行复用横向空间。自动画布高于宽度的向右树，在空间允许时让各父节点与第一个子节点对齐，使读者从根开始再滚动。作者指定的 `meta.viewBox` 保留完整跨度布局和居中的父节点。

向下布局时，连续三个或更多的叶子兄弟节点，会在父节点下方堆叠成缩进列表，共享同一宽度，并沿一条主干抵达，而不是横向扇出。这使仓库这样的真实层级能在一屏尺度内保持可读；更短的连续叶节点和每个分支仍保留行布局。叶子节点使用安静的卡片；根与分支承担色调强调。

节点按 label 在 `layout.nodeW`（140）和 `layout.nodeMaxW`（向下 220，向右 200）之间调整尺寸。label 和 sublabel 按单词换行（CJK 可在任意字符处换行），选择保持相同行数的最窄宽度，使长标签形成均衡盒子；一个单词可以先把节点扩到 1.5 × `nodeMaxW`，再被拆开，因此不会截断任何内容。`gapX`／`gapY` 设置兄弟间距和代际间距。

自动画布请求 10px 的阅读器文本下限，但仍受可用宽度限制。较高的树可纵向滚动，以保持标签可读。

<a id="expand-and-collapse"></a>

## 展开与折叠

每个有子节点的节点，都会在出边侧获得切换控件：节点之后独立且可聚焦的按钮，带有 `aria-expanded` 和本地化标签，说明隐藏了多少后代。查看器模块 `viewer/tree-branches.js` 管理状态：

- 折叠只隐藏后代及其链接。位置按完整树只计算一次，所以可见内容不移动，读者不会失去当前位置。折叠节点显示堆叠卡片和隐藏数量。
- 键盘：切换按钮上使用 Enter／Space；聚焦分支节点时 ArrowLeft 折叠、ArrowRight 展开。焦点留在所使用的控件上。
- 任意分支折叠时，左上角显示 **Expand all**，可恢复作者定义的层级。
- 通过 Finder、Node Outline、引导视图或共享链接选择隐藏节点时，先展开其祖先。
- `collapsed: true` 只设置查看器初始状态。SVG 始终包含完整树。

导出范围是明确的：每次 SVG／PNG／JPEG／WebP 导出都是完整树，与屏幕上折叠了什么无关。Export Cleanup 从副本移除折叠状态，保留实时视图不变。

<a id="tested-size"></a>

## 已测试规模

`examples/archify-repository.tree.json`（31 个节点，深度 4，不平衡，四个堆叠列表）约 0.2 秒完成渲染，并通过 showcase 门禁；一次切换会在几毫秒以内更新 DOM。
