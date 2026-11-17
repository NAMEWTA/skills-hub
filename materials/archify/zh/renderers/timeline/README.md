> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/tt-a1i/archify/blob/a7ed6fd6657da90414831d1d42cf95987188750c/archify/renderers/timeline/README.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

<a id="event-timeline-renderer"></a>

# 事件时间线渲染器

将 `diagram_type: "timeline"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/timeline/render-timeline.mjs input.timeline.json output.html
```

`--layout-json` 打印轴分段、中断、刻度、泳道和已摆放事件（包含毫秒时间戳与 x 位置），而不是 HTML。

<a id="input"></a>

## 输入

```json
{
  "schema_version": 1,
  "diagram_type": "timeline",
  "meta": { "title": "Payment failure incident", "evidence": "illustrative", "timezone": "Asia/Shanghai" },
  "lanes": [{ "id": "release", "label": "Release" }],
  "events": [{ "id": "deploy", "at": "2026-10-01T10:00:00+08:00", "title": "Deploy v2.4", "lane": "release" }]
}
```

- `at` 是带显式 `Z` 或 `±HH:MM` 偏移的 ISO 8601 时间（由 schema 约束）。不可能的日期报 `timeline/invalid-timestamp`。
- `meta.timezone` 是 IANA 时区（默认 `UTC`），用于所有刻度和标签；刻度落在该时区的墙钟时间上，所以 `+05:30` 时区按自己的整点显示刻度。未知时区报 `timeline/invalid-timezone`。
- 跨越时区偏移变更时，日刻度保持当地午夜，小时刻度使用真实的当地时刻。重复小时的两次出现都保留；跳过的小时或日期不凭空补刻度。事件时间戳和按比例的实际经过时间间距不变，因此相邻日刻度可能相距 23 或 25 小时。现有标签过滤器仍会隐藏放不下的文字。
- 夏令时和时区调整不会把刻度固定在时间段起点的 UTC 偏移上：日刻度保持当地
  午夜，小时刻度仅对应真实存在的当地时刻。回拨产生的两个相同墙钟时刻都保留；
  跳过的小时或整天不补造刻度。事件时间与轴上的实际时间距离不变，因此相邻
  日刻度之间可以是 23 或 25 小时；空间不足的刻度文字仍按原有规则隐藏。
- `meta.evidence`（`observed` 或 `illustrative`）是必填字段，在画布左上角绘制为徽标。
- 使用 `lanes` 时，每个事件都必须指明已声明的泳道（`timeline/unknown-lane`）。`detail` 显示在 Semantic Passport 中；`kind`（`change`、`alert`、`action`、`recovery`）为卡片着色并增加图例条目。

<a id="axis"></a>

## 时间轴

事件按时间排序（同一时间保持作者顺序）。x 与时间线性对应，整个图表只有一个比例；所有泳道共享同一轴，因此同一时刻在所有泳道中都有同一 x，不受各时间戳书写偏移的影响。

`layout.breaks: "auto"`（默认）会压缩同时长于不同时间戳间隙中位数 8 倍、且超过总跨度 10% 的安静时段（最多选择仍能为按比例时间保留空间的八个最长时段）。中断为固定宽度的斜线带，在轴上带折线，并标注省略时长（`≈ 1 d 11 h`）；轴说明注明压缩了多少时段，每个中断携带 `data-break-ms` 和可访问标签。每个分段内部使用相同常数比例，因此内部距离仍然精确。`layout.breaks: "none"` 绘制一条按比例的轴。`layout.width`（默认 960）为轴宽度。

<a id="cards"></a>

## 卡片

每个事件由泳道线上的圆点，以及包含精确时间和标题的卡片组成。卡片以其时刻居中，位于泳道线两侧，并从线向外按行排布：每张选择能在不触碰先前卡片的前提下离线最近的一侧（相同则选下方），因此同时或接近的事件堆叠而不重印，突发事件向两侧展开。主干绘制在所有卡片后方，所有圆点位于同一个共享光晕层，因此相隔几秒的事件会合并为一个带轮廓的胶囊。卡片使用安静表面，以对应 kind 的色调强调。标题按单词换行。跨多日的轴中，只有日期改变时，刻度才标注日期。

<a id="tested-size"></a>

## 已测试规模

`examples/archify-dev-activity.timeline.json` 是观察数据（来自本仓库 `origin/dev` 的 20 个 tag 和 merge 时间戳，包括相隔 19 秒的事件、`+05:30` 的提交者偏移，以及五个被压缩的安静时段）。约 0.3 秒完成渲染，并通过 showcase 门禁。
