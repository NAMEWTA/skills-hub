# HTML 报告格式

架构审查渲染为操作系统临时目录中的单个自包含 HTML 文件。Tailwind 和 Mermaid 都通过 CDN 加载。Mermaid 能可靠处理图结构的示意图；更具编辑设计感的视觉图形（面积图、剖面图）用手工构建的 div 和内联 SVG。将二者结合：不要什么都依赖 Mermaid，否则会开始显得千篇一律。

## 骨架

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review for {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* 为 Tailwind 难以直接覆盖的内容添加小型自定义样式层：
         虚线接缝、手绘感箭头等。 */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 页眉

仓库名、日期，以及简明图例：实线框 = 模块，虚线 = 接缝，红箭头 = 泄漏，粗深色框 = 深模块。不要引言段落，直接进入候选项。

## 候选项卡片

由图承担主要表达任务。文字要少、朴素，直接使用术语表（来自 `/codebase-design` 技能）中的术语，不必刻意铺陈。

每个候选项是一个 `<article>`：

- **标题**：简短，点明深化内容（例如“收拢订单接收流水线”）。
- **徽章行**：推荐强度（`Strong` = 翡翠绿，`Worth exploring` = 琥珀色，`Speculative` = 石板灰），另加依赖类别标签（`in-process`、`local-substitutable`、`ports & adapters`、`mock`）。
- **文件**：等宽字体列表，`font-mono text-sm`。
- **前后对照图**：核心内容。两列并排，参见下面的图形模式。
- **问题**：一句话。痛点是什么。
- **方案**：一句话。改变什么。
- **收益**：项目符号，每项 ≤6 个词。例如“测试命中一个接口”“定价逻辑不再泄漏”“删除 4 个浅包装层”。
- **ADR 提示**（适用时）：琥珀色背景框中的一行文字。

不要成段解释。如果一张图需要一段文字才能理解，就重画这张图。

## 图形模式

为候选项挑选适合的模式，混合使用。不要让每张图都一样。多样性本来就是目标的一部分。

### Mermaid 图（依赖/调用流的主力）

当重点是“X 调用 Y 调用 Z，看看有多乱”时，用 Mermaid `flowchart` 或 `graph`。将它放进 Tailwind 风格的卡片，不要显得像突然插入的异物。用 classDef 把泄漏边标红、深模块标深色。对于“之前：6 次往返；之后：1 次”，时序图很合适。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 手工构建的方框与箭头（Mermaid 的布局不配合时）

用带边框、标签的 `<div>` 表示模块。在相对定位容器上，用绝对定位的内联 SVG `<line>` 或 `<path>` 表示箭头。当你想让“之后”的图呈现为一个粗边框深模块、内部细节灰显时，采用这种方式，因为 Mermaid 无法准确体现这种视觉分量。

### 剖面图（适合多层浅薄结构）

堆叠水平带（`h-12 border-l-4`），展示一次调用穿过的各层。之前：6 个几乎不做事的薄层。之后：1 个粗厚的带，标明整合后的职责。

### 面积图（适合“接口与实现一样宽”）

每个模块用两个矩形：一个代表接口表面积，一个代表实现。之前：接口矩形几乎和实现矩形一样高（浅）。之后：接口矩形矮，实现矩形高（深）。

### 调用图收拢

之前：将函数调用树渲染为嵌套方框。之后：把同一棵树收拢进一个方框，现已内部化的调用在框内淡化显示。

## 风格指导

- 偏编辑设计风，而不是企业仪表盘。大量留白。标题可选衬线字体（`font-serif` 与 stone/slate 配色搭配良好）。
- 克制用色：一种强调色（翡翠绿或靛蓝），再用红色表示泄漏、琥珀色表示警告。
- 图高保持约 320px，让前后对照能舒适地并排显示，无需滚动。
- 图内模块标签使用 `text-xs uppercase tracking-wider`，使其看起来像示意图而非 UI。
- 唯一的脚本是 Tailwind CDN 和 Mermaid ESM 导入。除此之外报告是静态的：没有应用代码，除了 Mermaid 自身渲染外没有交互。

## 首选建议部分

一张更大的卡片：候选项名称、一句推荐理由、跳转到其卡片的锚点链接。仅此而已。

## 语气

用简明、朴素的英语，但架构名词和动词直接来自 `/codebase-design` 技能。简洁不是术语漂移的借口。

**必须准确使用：** module、interface、implementation、depth、deep、shallow、seam、adapter、leverage、locality。

**绝不替换成：** component、service、unit（代替 module）· API、signature（代替 interface）· boundary（代替 seam）· layer、wrapper（本来指 module 时替代 module）。

**符合风格的表述：**

- “订单接收 module 很 shallow：interface 几乎与 implementation 一样复杂。”
- “定价逻辑跨 seam 泄漏。”
- “深化：一个 interface，一个测试位置。”
- “两个 adapter 证明这条 seam 的价值：生产环境用 HTTP，测试用内存实现。”

**收益项目符号**要用术语表语言命名收益：*“locality：缺陷集中在一个 module”*、*“leverage：一个 interface，N 个调用点”*、*“interface 缩小；implementation 吸收包装层”*。不要写*“更易维护”*或*“代码更整洁”*，因为这些词不在术语表中，也没有提供应有的信息价值。

不要含糊其辞，不要铺垫，不要“值得注意的是……”。一句话能变成项目符号，就改成项目符号。一条项目符号能删，就删。如果某个术语不在 `/codebase-design` 术语表里，先找一个已有术语，再考虑造新词。
