> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/tt-a1i/archify/blob/a7ed6fd6657da90414831d1d42cf95987188750c/archify/renderers/tree/README.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

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

节点包含 `id`、`label`，以及可选的 `parent`、`sublabel`、`collapsed`、`sources`。子节点按声明顺序读取。链接只表示包含关系；第一阶段实现不包含跨分支关系。

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

每一代共享一条带：`layout.direction: "down"`（默认）时是一行，`"right"` 时是一列。在另一轴上，每棵子树拥有一段连续范围，因此宽度或深度不一致的分支也不会重叠。父节点位于第一个和最后一个子节点的中间（若中间子节点距中点只有几个像素，则直接与它精确对齐，使主干不发生小折弯；绘边时，舍入后相差不超过 2px 的主干也会吸附对齐）；向右布局时，节点在各自列内左对齐。

向下布局时，连续三个或更多的叶子兄弟节点，会在父节点下方堆叠成缩进列表，共享同一宽度，并沿一条主干抵达，而不是横向扇出。这使仓库这样的真实层级能在一屏尺度内保持可读；更短的连续叶节点和每个分支仍保留行布局。叶子节点使用安静的卡片；根与分支承担色调强调。

节点按 label 在 `layout.nodeW`（140）和 `layout.nodeMaxW`（向下 220，向右 200）之间调整尺寸。label 和 sublabel 按单词换行（CJK 可在任意字符处换行），选择保持相同行数的最窄宽度，使长标签形成均衡盒子；一个单词可以先把节点扩到 1.5 × `nodeMaxW`，再被拆开，因此不会截断任何内容。`gapX`／`gapY` 设置兄弟间距和代际间距。

自动画布声明 `data-reader-fit="intrinsic-height"` 和 7.5px 的阅读器文字下限，因此深层向右树图会滚动，而不是缩小。

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
