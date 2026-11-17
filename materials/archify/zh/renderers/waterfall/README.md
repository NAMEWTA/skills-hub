> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/tt-a1i/archify/blob/a7ed6fd6657da90414831d1d42cf95987188750c/archify/renderers/waterfall/README.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

<a id="execution-waterfall-renderer"></a>

# 执行瀑布图渲染器

将 `diagram_type: "waterfall"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/waterfall/render-waterfall.mjs input.waterfall.json output.html
```

`--layout-json` 打印轴、比例、刻度，以及每一行的计时与条形几何，而不是 HTML。

<a id="input"></a>

## 输入

```json
{
  "schema_version": 1,
  "diagram_type": "waterfall",
  "meta": { "title": "Checkout request", "evidence": "illustrative", "unit": "ms" },
  "spans": [
    { "id": "request", "name": "POST /checkout", "start": 0, "end": 1200 },
    { "id": "auth", "name": "Authenticate caller", "start": 0, "duration": 100, "parent": "request" }
  ]
}
```

跨度提供 `start`，以及 `end` 或 `duration` 之一（只有两者一致时才能同时提供），使用 `meta.unit`（`us`、`ms` 或 `s`；默认 `ms`），从共同追踪起点测量。`parent`、`status`（`ok`、`error`、`cancelled`、`incomplete`）、`service`、`detail` 和 `sources` 可选。`meta.evidence`（`measured`／`illustrative`）必填，并绘制为徽标。

| 代码 | 拒绝的输入 |
| --- | --- |
| `waterfall/invalid-timing` | end 早于 start，end 与 duration 不一致，或非 `incomplete` 跨度没有 end／duration（负值由 schema 拒绝） |
| `waterfall/missing-parent` | `parent` 指定未声明的跨度 |
| `waterfall/cycle` | parent 链接形成环 |
| `waterfall/duplicate-id` | 同一 ID 声明两次 |

没有结束值的 `incomplete` 跨度，会以虚线主体和开放边缘绘制到追踪最后记录的时刻，标为 `incomplete, ≥ X`——这只是下界，绝不是测得的时长。允许多个根跨度。

<a id="layout"></a>

## 布局

行按深度优先排列：每个跨度后面紧随按开始时间排序的子跨度，名称列使用树引导线缩进，因此从左侧读取嵌套，从条形读取时间。单一线性比例把追踪的最早开始到最晚结束映射到 `layout.width`（默认 760px）；刻度采用 1／2／2.5／5 的步长。不同的行上重叠条形代表并发工作。

有子跨度的跨度，在其时间范围内绘制为带颜色、带轮廓的括号；自身执行工作的跨度是实心条形，因此视觉上区分包含子项的汇总与叶子工作。颜色表示 `service`：按首次出现顺序，为每个服务分配一个调色系列（没有 service 的跨度继承父项；无归属跨度为中性色），名称列有圆点；服务超过一个时添加图例条目。共五种服务颜色；超过五个服务后重复，使用同色的服务共享一个图例条目（`gateway · inventory`），避免图例把一种颜色错误地仅归给单个服务。红色保留给 `status: "error"`。

每个条形结束位置之后带有精确时长；画布在轴后为最宽标签预留空间，因此短操作也保留标签。页头注明墙钟总时长和范围。Semantic Passport 显示精确开始—结束、时长，以及以“`N% of T wall-clock`”表示的占比；父跨度时长包含子跨度，绝不与子项相加。不绘制关键路径或等待时间：输入没有能支持这些结论的依赖模型。

<a id="tested-size"></a>

## 已测试规模

`examples/example-rebuild.waterfall.json` 是测得的追踪数据：一次本地运行的 25 个跨度，三个并发 worker 渲染并检查八个随包示例（子进程开始到退出，使用 `performance.now()` 偏移）。约 0.2 秒完成渲染，并通过 showcase 门禁。
