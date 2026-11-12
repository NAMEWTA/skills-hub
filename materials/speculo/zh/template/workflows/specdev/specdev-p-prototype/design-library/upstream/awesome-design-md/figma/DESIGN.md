---
version: alpha
name: Figma-design-analysis
description: "自信的黑白编辑框架，被超大、手工裁切感的柔和彩色色块打断。营销画布严格单色——figmaSans 可变字体、纯白表面、纯黑文字、胶囊形 CTA——而每个故事分区又将页面带入饱和的青柠、薰衣草、奶油、薄荷或粉色面板，像干净桌面上的便利贴。最终形成兼具技术感与愉悦感的设计系统——由喜欢色彩的人打造、用于严肃工作的工具。"

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  ink: "#000000"
  canvas: "#ffffff"
  inverse-canvas: "#000000"
  inverse-ink: "#ffffff"
  on-inverse-soft: "#ffffff"
  hairline: "#e6e6e6"
  hairline-soft: "#f1f1f1"
  surface-soft: "#f7f7f5"
  block-lime: "#dceeb1"
  block-lilac: "#c5b0f4"
  block-cream: "#f4ecd6"
  block-pink: "#efd4d4"
  block-mint: "#c8e6cd"
  block-coral: "#f3c9b6"
  block-navy: "#1f1d3d"
  accent-magenta: "#ff3d8b"
  semantic-success: "#1ea64a"
  overlay-scrim: "#000000"

typography:
  display-xl:
    fontFamily: figmaSans
    fontSize: 86px
    fontWeight: 340
    lineHeight: 1.00
    letterSpacing: -1.72px
    fontFeature: kern
  display-lg:
    fontFamily: figmaSans
    fontSize: 64px
    fontWeight: 340
    lineHeight: 1.10
    letterSpacing: -0.96px
    fontFeature: kern
  headline:
    fontFamily: figmaSans
    fontSize: 26px
    fontWeight: 540
    lineHeight: 1.35
    letterSpacing: -0.26px
    fontFeature: kern
  subhead:
    fontFamily: figmaSans
    fontSize: 26px
    fontWeight: 340
    lineHeight: 1.35
    letterSpacing: -0.26px
    fontFeature: kern
  card-title:
    fontFamily: figmaSans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: 0
    fontFeature: kern
  body-lg:
    fontFamily: figmaSans
    fontSize: 20px
    fontWeight: 330
    lineHeight: 1.40
    letterSpacing: -0.14px
    fontFeature: kern
  body:
    fontFamily: figmaSans
    fontSize: 18px
    fontWeight: 320
    lineHeight: 1.45
    letterSpacing: -0.26px
    fontFeature: kern
  body-sm:
    fontFamily: figmaSans
    fontSize: 16px
    fontWeight: 330
    lineHeight: 1.45
    letterSpacing: -0.14px
    fontFeature: kern
  link:
    fontFamily: figmaSans
    fontSize: 20px
    fontWeight: 480
    lineHeight: 1.40
    letterSpacing: -0.10px
    fontFeature: kern
  button:
    fontFamily: figmaSans
    fontSize: 20px
    fontWeight: 480
    lineHeight: 1.40
    letterSpacing: -0.10px
    fontFeature: kern
  eyebrow:
    fontFamily: figmaMono
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: 0.54px
    fontFeature: kern
  caption:
    fontFamily: figmaMono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.00
    letterSpacing: 0.60px
    fontFeature: kern

rounded:
  xs: 2px
  sm: 6px
  md: 8px
  lg: 24px
  xl: 32px
  pill: 50px
  full: 9999px

spacing:
  hair: 1px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 20px
  button-primary-pressed:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 18px 10px
  button-tertiary-text:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.link}"
    rounded: "{rounded.full}"
    padding: 8px 12px
  button-icon-circular:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    size: 40px
  button-icon-circular-inverse:
    backgroundColor: "{colors.on-inverse-soft}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    size: 40px
  button-magenta-promo:
    backgroundColor: "{colors.accent-magenta}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 18px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 18px
  pricing-tab-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 18px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 14px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 14px
  pricing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-feature-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
  color-block-section:
    backgroundColor: "{colors.block-lime}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 48px
  color-block-section-lilac:
    backgroundColor: "{colors.block-lilac}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 48px
  color-block-section-navy:
    backgroundColor: "{colors.block-navy}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 48px
  promo-banner-lilac:
    backgroundColor: "{colors.block-lilac}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px 24px
  template-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  feature-illustration-tile:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.md}"
    padding: 24px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  marquee-strip:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 36px
  comparison-checkmark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.semantic-success}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    size: 16px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## 概览

Figma 的营销画布在系统层面是如编辑器般洁净的黑白框架。界面外框——顶部导航、正文、页脚、主要 CTA——采用单色。标题使用超大的 `{typography.display-xl}`，以 `figmaSans` 搭配明显负字距；正文使用同一可变字体家族，字重约 320–340；小型等宽标签 `{typography.eyebrow}` 和 `{typography.caption}`（figmaMono、全大写、正字距）作为分区标记。每个 CTA 都是胶囊——`{rounded.pill}`——全站主要操作都是同一个黑色 `{components.button-primary}`，搭配同一个白色 `{components.button-secondary}`。

设计的独特之处在这些单色首尾框架**之间**：页面反复进入超大的柔和**色块分区**——青柠、薰衣草、奶油、薄荷、粉、珊瑚及深海军蓝——横跨整个内容宽度，配 `{rounded.lg}` 圆角及 `{spacing.xxl}` 内边距。这些块承载故事。它们不是塞进卡片的强调色，而是接管整整一个视口高度的空间，像设计师在干净墙面上排列巨型便利贴。FigJam 的柔和色最丰富，首页轮换使用整套颜色，定价页以青柠色 FAQ 面板结尾——词汇相同，各路由节奏不同。

这套系统建立在对比上：单色界面让色块显得有意为之，而非装饰；色块让单色界面像编辑用纸，而非企业 SaaS。内容安排宽裕，展示字号的行高紧凑；界面从不依靠阴影或渐变去做色块与自信排版本已做到的事。

**关键特征：**
- 单色系统核心：`{colors.primary}`（黑）和 `{colors.canvas}`（白）承载每个 CTA、每行正文、每个页脚链接。
- 超大的柔和**色块分区**（`{colors.block-lime}`、`{colors.block-lilac}`、`{colors.block-cream}`、`{colors.block-mint}`、`{colors.block-pink}`、`{colors.block-coral}`、`{colors.block-navy}`）定义每个长篇页面的叙事节奏。
- 胶囊是唯一按钮形状——文字 CTA 用 `{rounded.pill}`，图标按钮用 `{rounded.full}`。任何地方都没有方形按钮。
- `figmaSans` 可变字体使用不同寻常的精细字重增量（320、330、340、450、480、540）——文字系统像同一声音灵活变化，而非多个字重组成的家族。
- 展示字号使用紧凑负字距（86px 时 -1.72px，64px 时 -0.96px），形成自信的编辑排版节奏。
- `figmaMono` 保留给类别标签、眉题及说明文字——始终全大写、正字距——标记分类而不与展示文字竞争。
- 首页色块节奏：白色首屏 → 滚动条带 → 白色功能分区 → 青柠色系统分区 → 海军蓝产品交付分区 → 珊瑚色开发者分区 → 白色模板网格 → 白色页脚。

## 颜色

> 来源页面：figma.com（首页）、/design/、/figjam/brainstorming-tool/、/pricing/、/contact/。

### 品牌与强调
- **黑色**（{colors.primary}）：系统主色。每个主要 CTA、每个标题、每行正文、滚动条带、深色分区的反色画布。
- **白色**（{colors.on-primary}）：黑色表面上的反色文字；也是次要胶囊按钮（`{components.button-secondary}`）前景所用的画布色。
- **促销品红**（{colors.accent-magenta}）：唯一的饱和 CTA 粉色，保留给促销行内按钮——例如淡紫色 Release Notes 横幅上的“预留席位”。克制使用；它不是分区色。

### 表面
- **画布**（{colors.canvas}）：默认页面背景及每张白色卡片的主体。
- **反色画布**（{colors.inverse-canvas}）：页脚、滚动条带，以及部分“交付产品”式故事分区。
- **柔和表面**（{colors.surface-soft}）：图标按钮、模板卡片及功能插图块在白色画布上所用的灰白背景。
- **细线**（{colors.hairline}）：表单输入框、定价卡片及表格分隔的 1px 边框。
- **柔和细线**（{colors.hairline-soft}）：更细微的分隔——对比表格行分隔线及页脚栏线。
- **青柠色块**（{colors.block-lime}）：标志性的**系统 / FAQ / 联系表单**色块。在首页、定价页、联系页重复出现。
- **淡紫色块**（{colors.block-lilac}）：`/design/` 的首屏块；也用于行内 Release Notes 促销横幅。
- **奶油色块**（{colors.block-cream}）：柔和暖背景——FigJam 首屏条带、模板网格分区。
- **薄荷色块**（{colors.block-mint}）：FigJam 柔和色分区。
- **粉色块**（{colors.block-pink}）：FigJam 柔和色分区。
- **珊瑚色块**（{colors.block-coral}）：首页“交付产品”的珊瑚色故事块。
- **海军蓝色块**（{colors.block-navy}）：深靛蓝故事块——页脚上方出现深色表面的唯一位置。

### 文字
- **主文字色**（{colors.ink}）：浅色表面的所有标题、正文及说明文字。营销中没有更柔和的中灰文字角色——正文始终为黑色、字重 320–340，通过字重而非不透明度建立层级。
- **反色文字**（{colors.inverse-ink}）：反色画布表面（页脚、滚动条带、海军蓝色块）上的文字。
- **反色柔和色**（{colors.on-inverse-soft}）：约 16% 不透明度的白色，用于深色分区中的圆形图标按钮表面（令牌记录基础色；半透明在渲染时应用）。

### 语义
- **成功绿**（{colors.semantic-success}）：定价对比表勾号。用作字形填色，而非表面。
- **覆盖遮罩**（{colors.overlay-scrim}）：模态框 / 视频覆盖层后约 60% 不透明度的黑色（令牌记录基础色；不透明度在渲染时应用）。

## 排版

### 字体家族

- **figmaSans**——Figma 专有可变字体；后备栈为 `figmaSans Fallback, SF Pro Display, system-ui, helvetica`。可变字重轴以不同寻常的精细增量使用（320、330、340、450、480、540、700）——设计系统像同一声音调节表达，而非阶梯式字重家族。
- **figmaMono**——专有等宽字体；后备为 `figmaMono Fallback, SF Mono, menlo`。专用于眉题标签与说明文字，始终大写、正字距。

所有文字角色均启用 OpenType `kern`。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 86px | 340 | 1.00 | -1.72px | 首屏标题（首页、FigJam） |
| `{typography.display-lg}` | 64px | 340 | 1.10 | -0.96px | 分区开场标题 |
| `{typography.headline}` | 26px | 540 | 1.35 | -0.26px | 色块内的故事块标题 |
| `{typography.subhead}` | 26px | 340 | 1.35 | -0.26px | 接近标题大小的长篇介绍段落 |
| `{typography.card-title}` | 24px | 700 | 1.45 | 0 | 定价档位标题、功能卡片标题 |
| `{typography.body-lg}` | 20px | 330 | 1.40 | -0.14px | 首屏引导正文、联系表单标签 |
| `{typography.body}` | 18px | 320 | 1.45 | -0.26px | 默认正文 |
| `{typography.body-sm}` | 16px | 330 | 1.45 | -0.14px | 卡片正文、页脚链接列表 |
| `{typography.link}` | 20px | 480 | 1.40 | -0.10px | 行内链接强调 |
| `{typography.button}` | 20px | 480 | 1.40 | -0.10px | 所有胶囊按钮，主要及次要 |
| `{typography.eyebrow}` | 18px | 400 | 1.30 | 0.54px | figmaMono 大写分区眉题 |
| `{typography.caption}` | 12px | 400 | 1.00 | 0.60px | figmaMono 大写说明文字、页脚栏标题 |

### 原则

- **正文层级依靠字重，而非字号。** 20px、330 字重的段落与 20px、480 字重的链接相邻——无需尺寸变化，视觉就能识别强调。
- **负字距随字号缩放。** Display-xl 收紧 -1.72px；subhead 仅 -0.26px。正文字距接近零。这样展示文字有编辑气质，正文字号仍保持可读。
- **等宽字用于分类，不用于正文。** figmaMono 保留给眉题和说明文字——绝不用来排段落。
- **展示行高紧凑，正文行高宽裕。** 展示字号为 1.00–1.10；正文为 1.40–1.45。对比强化标题是图形、正文供阅读的区分。

### 替代字体说明

无法获得 figmaSans / figmaMono 时，适合的开源替代为无衬线 **Inter**（或 **Geist**），以及等宽 **JetBrains Mono**（或 **Geist Mono**）。Inter 可变字重与 figmaSans 的精细字重轴较接近；预计需手动将行高降低约 0.02，以补偿 Inter 略高的 x 字高。

## 布局

### 间距系统

- **基础单位**：8px。
- **令牌（头部元数据）**：`{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px。
- 分区内部内边距：色块分区采用 `{spacing.xxl}`（48px）。
- 卡片内部内边距：定价卡片和模板块采用 `{spacing.lg}`（24px）。
- 表单输入框内边距：垂直 `{spacing.sm}` 12px · 水平 14px。
- 按钮内边距：胶囊按钮垂直 `{spacing.xs}` 8px · 水平 `{spacing.lg}` 24px（`button-secondary` 提取出的非对称 `8px 18px 10px`，让文字在胶囊内实现光学居中）。
- 通用节奏常量：`{spacing.section}`（96px）——主要内容分区间的垂直间隙在首页、定价页及 FigJam 页面保持一致。

### 网格与容器

- 最大内容宽度约 1280px（明确断点之一），两侧边距从桌面 `{spacing.xxl}` 缩放到移动端 `{spacing.lg}`。
- 桌面定价对比及 FigJam 模板画廊采用三列、四列网格。
- 色块分区打破列网格——在 `{rounded.lg}` 圆角内满幅横跨内容宽度，内部放置由标题 + 正文构成的单列编辑布局。

### 留白理念

留白让色块显得经过刻意安排。每个彩色面板与下一个面板之间，页面都回到白色画布，留出 `{spacing.section}` 呼吸空间。色块内部的文字享有宽裕侧边距（两侧常各超过色块宽度的 1/4），使面板像海报，而非文字墙。

## 层叠高度与纵深

| 层级 | 处理方式 | 用途 |
|---|---|---|
| 0（平面） | 无阴影、无边框 | 色块分区、反色画布页脚、首屏的默认方式 |
| 1（细线） | `{colors.canvas}` 上的 1px `{colors.hairline}` 边框 | 定价卡片、表单输入框、对比表单元格 |
| 2（柔和浮起） | 细微投影，约 0 4px 16px rgba(0,0,0,0.06) | 浮动模板块、下拉菜单 |
| 3（模态框） | 更强阴影 + 后方 `{colors.overlay-scrim}` | 视频 / 图像灯箱覆盖层 |

Figma 营销系统有意少用阴影——色块替代传统抬升效果。多数 SaaS 网站以带阴影白卡吸引注意，Figma 则使用饱和彩色背景面板。这样，偶尔出现的真实阴影（如悬浮于奶油色分区上方的模板卡片）便成为值得注意的例外。

### 装饰性纵深

- **色块分区**是主要纵深手段。从白色画布变为青柠 / 薰衣草 / 奶油色，就是分区分隔。
- FigJam 的**便利贴式组件缩略图**——略微倾斜、像板上便条一样排列的柔和彩色矩形——呈现拼贴感，而非卡片堆叠。
- **嵌入的产品 UI 模拟图**（Figma Design 面板、FigJam 画布片段）在色块上以平面构图出现；内部阴影细微，限制在模拟图内部。

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.xs}` | 2px | 锚点 / 链接装饰圆角 |
| `{rounded.sm}` | 6px | 小型标签片、次级导航标签页 |
| `{rounded.md}` | 8px | 表单输入框、列表项、图像框 |
| `{rounded.lg}` | 24px | 定价卡片、色块分区、大型图像容器 |
| `{rounded.xl}` | 32px | 首屏功能面板、超大提示块 |
| `{rounded.pill}` | 50px | 所有文字 CTA（主要、次要、标签页切换） |
| `{rounded.full}` | 9999px | 圆形图标按钮、对比表勾号字形 |

### 摄影与插图几何

- 图像框采用 `{rounded.md}`（8px）——足够圆润以显友善，又足够克制以保持编辑感。
- 首页网格中的模板缩略图放在 `{rounded.md}` 块中，嵌入预览周围有 `{spacing.md}` 内边距。
- FigJam 柔和彩色便利贴组件缩略图保留小型 `{rounded.sm}` 圆角，模仿真实便条纸。
- 营销表面不出现圆形头像——Figma 的营销避免人格化表现。

## 组件

### 按钮

**`button-primary`**——顶部导航、每个首屏和每个收尾 CTA 中的黑色“免费开始使用”胶囊。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.button}`，内边距 10px 20px，圆角 `{rounded.pill}`。
- 按下状态由 `button-primary-pressed` 承载（表面相同；线上网站依赖微小缩放，而非加深填色）。

**`button-secondary`**——黑字白色胶囊。用于第三级导航操作（“联系销售”），并作为主要胶囊的视觉搭档。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.button}`，内边距 8px 18px 10px（垂直非对称，让文字光学居中），圆角 `{rounded.pill}`。无边框。

**`button-tertiary-text`**——顶部导航及页脚内，以按钮点击目标方式设置的纯文字链接。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.link}`，圆角 `{rounded.full}`（仅点击目标），内边距 `{spacing.xs}` `{spacing.sm}`。

**`button-icon-circular`**——浅色表面上用于轮播控件、社交链接及行内操作的 40px 圆形图标按钮。
- 背景 `{colors.surface-soft}`，文字 `{colors.ink}`，圆角 `{rounded.full}`，尺寸 40px。

**`button-icon-circular-inverse`**——形状相同，用于反色画布 / 深色色块。
- 背景 `{colors.on-inverse-soft}`（半透明白），文字 `{colors.inverse-ink}`，圆角 `{rounded.full}`，尺寸 40px。

**`button-magenta-promo`**——饱和粉色胶囊，仅用于促销表面，如淡紫色“预留席位”Release Notes 横幅。保留给 Figma 产品团队希望 CTA 在已有颜色的面板上突出时使用。
- 背景 `{colors.accent-magenta}`，文字 `{colors.on-primary}`，排版 `{typography.button}`，圆角 `{rounded.pill}`，内边距 10px 18px。

### 定价标签页

**`pricing-tab-default`** + **`pricing-tab-selected`**——`/pricing/` 上切换 Starter / Professional / Organization / Enterprise 的胶囊切换器。
- 默认：`{colors.canvas}` 背景，`{colors.ink}` 文字，圆角 `{rounded.pill}`。
- 选中：`{colors.primary}` 背景，`{colors.on-primary}` 文字——与 `button-primary` 的表面完全相同，使选中标签页像活动 CTA，而非被动状态。

### 输入框与表单

**`text-input`** + **`text-input-focused`**——`/contact/` 上的表单字段及定价席位数量步进器。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.md}`，内边距 12px 14px。
- 聚焦时保留相同表面——通过环而非填色变化传达焦点。

### 卡片与容器

**`pricing-card`**——`/pricing/` 上各个档位。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.lg}`，内边距 `{spacing.lg}`。使用 `{colors.hairline}` 描边，而非阴影。

**`pricing-card-feature-row`**——对比表中的单行。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`。行分隔色为 `{colors.hairline-soft}`。

**`template-card`**——首页“探索大家正在制作的内容”网格及 FigJam 模板画廊中的缩略图块。
- 背景 `{colors.surface-soft}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，圆角 `{rounded.md}`，内边距 `{spacing.md}`。

**`feature-illustration-tile`**——承载产品 UI 模拟图或柔和彩色插图的较大构图块。
- 背景 `{colors.surface-soft}`，文字 `{colors.ink}`，排版 `{typography.eyebrow}`，圆角 `{rounded.md}`，内边距 `{spacing.lg}`。

### 色块分区（标志性）

Figma 营销的定义性表面。每个都是内容全宽面板，配 `{rounded.lg}` 圆角及 `{spacing.xxl}` 内边距。变体：

**`color-block-section`**——用于“系统”故事（首页）、定价 FAQ 及联系表单的青柠底色。
- 背景 `{colors.block-lime}`，文字 `{colors.ink}`，排版 `{typography.subhead}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`。

**`color-block-section-lilac`**——`/design/` 首屏及 FigJam 亮点分区的薰衣草底色。
- 背景 `{colors.block-lilac}`，其他结构相同。

**`color-block-section-navy`**——首页“交付产品”故事块的深靛蓝底色。页脚上方唯一的反色色块表面。
- 背景 `{colors.block-navy}`，文字 `{colors.inverse-ink}`，其他结构相同。

（奶油、薄荷、粉及珊瑚色块变体采用相同形状，分别使用对应 `{colors.block-*}` 表面。）

### 促销横幅

**`promo-banner-lilac`**——悬浮于联系表单上方的 Release Notes / “预留席位”行内横幅。
- 背景 `{colors.block-lilac}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，圆角 `{rounded.md}`，内边距 `{spacing.md}` `{spacing.lg}`。右边缘放置 `button-magenta-promo`。

### 导航

**`top-nav`**——吸附白色栏，包含标志、主要导航链接、登录链接，以及靠右的 `button-secondary`（“联系销售”）+ `button-primary`（“免费开始使用”）组合。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，高度 56px。
- 移动端：主要链接收起为汉堡菜单，打开全画布覆盖层；两个胶囊 CTA 保持在栏上可见。

**`marquee-strip`**——紧挨导航下方的细黑条带，滚动展示白色客户标志。
- 背景 `{colors.inverse-canvas}`，文字 `{colors.inverse-ink}`，排版 `{typography.body-sm}`，高度 36px。

### 对比字形

**`comparison-checkmark`**——定价对比矩阵中的绿色勾号。
- 背景 `{colors.canvas}`，字形颜色 `{colors.semantic-success}`，圆角 `{rounded.full}`，尺寸 16px。

### 页脚

**`footer`**——白色画布上的密集链接网格，左上角以展示字重呈现“Figma”字标。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，栏目标题及小链接采用 `{typography.caption}`，上下内边距 `{spacing.section}` · 两侧 `{spacing.xl}`。

## 应做与不应做

### 应做

- 将 `{colors.primary}` 保留给真正的主要 CTA 及选中状态（如 `pricing-tab-selected`）。不要当作装饰性强调。
- 引入故事分区时，从 `{colors.block-*}` 家族选择**一个**色块，横跨整个内容宽度，配 `{rounded.lg}` 圆角及 `{spacing.xxl}` 内边距。
- 文字保持 `figmaSans` 可变字重——从 320、330、340、480、540、700 中选择以表达层级。避免使用集合之外的中间字重。
- `figmaMono` 仅用于眉题和说明文字，始终大写，配文档规定的正字距。
- 每个 CTA 都做成胶囊（`{rounded.pill}`），每个图标按钮都做成圆形（`{rounded.full}`）。
- 每两个色块之间都允许页面**回到白色画布**，让每个色块显得经过刻意安排。
- 分区同时需要主要操作及销售 / 次要操作时，配对使用 `button-primary` 和 `button-secondary`——黑白组合是品牌标志。

### 不应做

- 不要引入中灰文字。正文层级来自 `figmaSans` 字重，而非不透明度。
- 不要给色块分区添加投影——颜色本身就是纵深手段。
- 不要引入文档所列 `{colors.block-*}` 色板及 `{colors.accent-magenta}` 之外的新强调色。例如增加饱和品牌橙会破坏系统。
- 不要让同一视口内出现多于一个色块——Figma 的节奏始终让白色画布分隔色块。
- 不要把 CTA 做方。方形按钮会呈现另一种品牌。
- 不要在正文中使用 `figmaMono`——它是分类工具，而非阅读字体。
- 不要将 `pricing-tab-selected` 的黑色填色替换为彩色标签页；品牌模式为“选中 = 主色表面”。

## 响应式行为

### 断点

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 4k | 1920px | 最大内容宽度保持 1280px；两侧间距扩展 |
| 超大桌面 | 1440px | 默认桌面布局 |
| 桌面 | 1400px | 对比表列宽标准化 |
| 小型桌面 | 1280px | 定价档位网格保持每行 4 个 |
| 平板 | 960px | 定价每行 4 个 → 2 个；导航变为汉堡菜单 |
| 大型手机 | 768px | 色块分区变为满幅（边缘不再有圆角） |
| 手机 | 560px | Display-xl 从 86px 降到约 48px；胶囊 CTA 全宽 |
| 超小手机 | 559px | 双列页脚收缩为单列 |

### 触控目标

- 胶囊按钮（`button-primary`、`button-secondary`）在所有视口保持最小 44px 点击高度——通过 `{typography.button}` 20px 行高与文档规定的垂直内边距组合实现。
- 圆形图标按钮（`button-icon-circular`）桌面为 40px，触控视口扩大到 44px。
- `/contact/` 上表单输入框最小点击目标高度为 48px。

### 收缩策略

- **导航**：桌面水平导航及两个靠右胶囊，在低于 960px 时收起为汉堡覆盖层。两个胶囊（“联系销售”“免费开始使用”）在 560px 以上留在栏上可见，低于该宽度则堆叠于覆盖层中。
- **定价档位网格**：每行 4 个 → 960px 时 2 个 → 低于 768px 时 1 个。胶囊切换器保持水平，低于 560px 时按需水平滚动。
- **色块分区**：高于 768px 时，周围保留 `{spacing.xxl}` 画布，使圆角可辨；低于 768px 时去掉圆角，色块延伸至视口边缘，形成海报效果。
- **对比表**：低于 960px 时，矩阵收起为按档位划分的折叠面板，避免水平滚动。

### 图像行为

- 色块内产品 UI 模拟图按比例缩放，绝不裁切。低于 768px 时缩小，而非重排。
- 首页网格模板缩略图采用懒加载，滚动时以动画进入。
- 便利贴风格的 FigJam 缩略图跨断点保持轻微倾斜——旋转是品牌信号，不只是桌面上的花饰。

## 迭代指南

1. 每次聚焦一个组件，并使用其 `components:` 令牌名称引用（如 `{components.button-primary}`、`{components.color-block-section}`）。
2. 引入新分区时，**先**决定放在哪个 `{colors.block-*}` 令牌上；表面选择是影响最大的决定。
3. 正文默认使用 `{typography.body}`；仅在色块内部使用 `{typography.subhead}` 或 `{typography.headline}`。
4. 编辑后运行 `npx @google/design.md lint DESIGN.md`——`broken-ref`、`contrast-ratio`、`orphaned-tokens` 警告自动标记问题。
5. 新变体以独立组件条目加入（`-pressed`、`-selected`）——不要埋在散文中。
6. 保持 `{colors.primary}` 稀缺。如果同一视口出现两个 `button-primary`，分区承载过多——将其中一个弱化为 `button-secondary`。
7. 将 `{colors.accent-magenta}` 视为单次使用色：每页一个促销 CTA，绝不两个。

## 已知缺口

- `{colors.block-*}` 的确切柔和色十六进制值来自截图像素；生产源很可能使用未通过 CSS 变量暴露的命名令牌。将文档数值视为忠实近似，而非精确品牌规格。
- 未记录深色模式，因为营销网站不提供深色主题——最接近的是海军蓝色块（`color-block-section-navy`）及反色画布页脚。
- `/contact/` 上看不到表单字段错误及校验样式，因为静态截图未呈现错误状态。输入框有细线边框及 `{rounded.md}` 圆角；错误处理未记录。
- 未记录动态滚动条带和色块显现动画（遵循不记录交互的政策）。
