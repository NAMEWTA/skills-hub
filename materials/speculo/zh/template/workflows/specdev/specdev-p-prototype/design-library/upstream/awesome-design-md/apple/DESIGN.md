---
version: alpha
name: Apple-design-analysis
description: 摄影优先的界面，将营销变成博物馆画廊。满幅产品展块交替使用明暗画布，以负字距 SF Pro Display 标题及唯一交互色行动蓝（#0066cc）衬托。UI 外框退后，让产品说话——没有装饰渐变，界面外框无阴影，只有落在表面上的产品图像下方那一道标志性投影。

colors:
  primary: "#0066cc"
  primary-focus: "#0071e3"
  primary-on-dark: "#2997ff"
  ink: "#1d1d1f"
  body: "#1d1d1f"
  body-on-dark: "#ffffff"
  body-muted: "#cccccc"
  ink-muted-80: "#333333"
  ink-muted-48: "#7a7a7a"
  divider-soft: "#f0f0f0"
  hairline: "#e0e0e0"
  canvas: "#ffffff"
  canvas-parchment: "#f5f5f7"
  surface-pearl: "#fafafc"
  surface-tile-1: "#272729"
  surface-tile-2: "#2a2a2c"
  surface-tile-3: "#252527"
  surface-black: "#000000"
  surface-chip-translucent: "#d2d2d7"
  on-primary: "#ffffff"
  on-dark: "#ffffff"

typography:
  hero-display:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: -0.28px
  display-lg:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
  display-md:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.47
    letterSpacing: -0.374px
  lead:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0.196px
  lead-airy:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  tagline:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.19
    letterSpacing: 0.231px
  body-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.24
    letterSpacing: -0.374px
  body:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.374px
  dense-link:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 2.41
    letterSpacing: 0
  caption:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: -0.224px
  caption-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: -0.224px
  button-large:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.0
    letterSpacing: 0
  button-utility:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: -0.224px
  fine-print:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px
  micro-legal:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.08px
  nav-link:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px

rounded:
  none: 0px
  xs: 5px
  sm: 8px
  md: 11px
  lg: 18px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 17px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-primary-focus:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-primary-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-secondary-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-dark-utility:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-utility}"
    rounded: "{rounded.sm}"
    padding: 8px 15px
  button-pearl-capsule:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink-muted-80}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-store-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-large}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
  button-icon-circular:
    backgroundColor: "{colors.surface-chip-translucent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 44px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{colors.primary-on-dark}"
    typography: "{typography.body}"
  global-nav:
    backgroundColor: "{colors.surface-black}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 44px
  sub-nav-frosted:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.tagline}"
    height: 52px
  product-tile-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-parchment:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark-2:
    backgroundColor: "{colors.surface-tile-2}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  product-tile-dark-3:
    backgroundColor: "{colors.surface-tile-3}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  store-utility-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.lg}"
    padding: 24px
  configurator-option-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 12px 16px
  configurator-option-chip-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  search-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  floating-sticky-bar:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: 64px
    padding: 12px 32px
  environment-quote-card:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  footer:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink-muted-80}"
    typography: "{typography.fine-print}"
    padding: 64px
---

## 概览

Apple 的网页是**以近乎不可见的 UI 衬托、满怀敬意展示产品摄影**的典范。每页由满幅产品“展块”堆叠而成——明暗画布交替，每块都围绕居中的首屏标题、一行标语、两个小巧蓝色胶囊 CTA，以及清晰得难以置信的产品渲染图。没有什么与产品竞争。排版自信却安静；色彩不是纯白，就是灰白羊皮纸色，或近黑展块；交互元素仅用一种安静的蓝色。

即便按当代 SaaS 标准，其密度也异常低。每块约占一个视口，没有装饰性外框——无边框、无渐变、无装饰相框、标题无阴影。只有产品图像落在某个表面上时才出现抬升（唯一柔和投影 `rgba(0, 0, 0, 0.22) 3px 5px 30px`，赋予视觉重量）。最终目录更像博物馆画廊：墙面消失，展品接管一切。

商店及购物表面保留相同骨架，但切换模式。产品配置器（iPhone 17 Pro、配件网格）引入紧凑的白色工具卡片网格，采用 `{rounded.lg}`（18px）圆角及细边框，搭配持续可见的细窄次级导航条。环境页面则更深色、更具编辑感。全部五种表面的文字系统、间距节奏及单一蓝色强调都一致——同一种设计语言，以不同音量表达。

**关键特征：**
- 摄影优先的呈现；UI 退后，让产品说话。
- 交替满幅展块分区：白/羊皮纸色 ↔ 近黑，颜色变化本身充当分区分隔。
- 单一蓝色强调（`{colors.primary}`——#0066cc）承载每个交互元素。没有第二种品牌色。
- 两种按钮语法：小巧蓝色胶囊 CTA（`{rounded.pill}`）及紧凑工具矩形（`{rounded.sm}`）。
- SF Pro Display + SF Pro Text——展示字号负字距，形成标志性的“Apple 式紧凑”标题感。
- 仅在产品图像需要呼吸时使用极轻柔抬升——全系统恰好只有一种投影。
- 紧凑双行导航：细窄 `{component.global-nav}` + 产品特定的 `{component.sub-nav-frosted}`，配持续可见、右对齐的主要 CTA。
- 跨页面分区节奏：浅色首屏 → 深色产品展块 → 浅色工具展块 → 深色展块 → 羊皮纸色页脚——可预测的脉动。

## 颜色

> **分析的来源页面：**首页、环境、商店、iPhone 17 Pro 购买页、配件索引。五种表面的色彩系统相同，只有表面模式组合不同。

### 品牌与强调
- **行动蓝**（`{colors.primary}`——#0066cc）：品牌层面唯一交互色。所有文字链接、所有蓝色胶囊 CTA（“进一步了解”“购买”），以及焦点环基础色。这是 Apple 安静却通用的“点击我”信号。按下状态通过活动缩放变换而非十六进制色变化，呈现略深变体。
- **焦点蓝**（`{colors.primary-focus}`——#0071e3）：比行动蓝稍亮的同系色，保留给按钮键盘焦点环（`outline: 2px solid`）。
- **天空链接蓝**（`{colors.primary-on-dark}`——#2997ff）：更亮的蓝色，用于深色表面中的文内链接及行内提示；行动蓝在展块背景上会消失。

### 表面
- **纯白**（`{colors.canvas}`——#ffffff）：主导画布。内容、工具卡片、商店展块、配置器网格。
- **羊皮纸色**（`{colors.canvas-parchment}`——#f5f5f7）：标志性 Apple 灰白。用于交替浅色展块、页脚区域及商店工具分区默认页面画布。与白色的差别恰好足以产生节奏。
- **珍珠按钮色**（`{colors.surface-pearl}`——#fafafc）：近白，用于次要“幽灵”按钮填色——比羊皮纸画布更浅，使按钮在 `{colors.canvas-parchment}` 上仍像按钮。
- **近黑展块 1**（`{colors.surface-tile-1}`——#272729）：首页产品网格的主要深色展块表面。
- **近黑展块 2**（`{colors.surface-tile-2}`——#2a2a2c）：微微浅一级——深色展块紧邻展块 1 上下时使用，形成极微弱区分。
- **近黑展块 3**（`{colors.surface-tile-3}`——#252527）：微微深一级——用于堆叠底部及嵌入视频/播放器框架。
- **纯黑**（`{colors.surface-black}`——#000000）：保留给真正的虚空——视频播放器背景、满幅摄影覆盖层、全局导航栏背景。
- **半透明控件灰**（`{colors.surface-chip-translucent}`——#d2d2d7）：摄影上圆形控制按钮所用半透明灰片的基础十六进制色。生产中以约 64% alpha 应用，即 `rgba(210, 210, 215, 0.64)`。

### 文字
- **近黑文字色**（`{colors.ink}`——#1d1d1f）：每个标题、每段正文的声音，也是深色工具按钮填色。选择它而非纯黑，是为了让页面保持摄影感而非印刷感。
- **正文色**（`{colors.body}`——#1d1d1f）：与主文字色相同——Apple 的浅色表面全部文字只用一种近黑色。
- **深色上正文**（`{colors.body-on-dark}`——#ffffff）：深色展块及全局导航栏上的全部文字。
- **弱化正文**（`{colors.body-muted}`——#cccccc）：深色展块上的次要文案，纯白会过于醒目。
- **弱化文字 80**（`{colors.ink-muted-80}`——#333333）：白色珍珠按钮表面上的正文——比纯黑略柔和。
- **弱化文字 48**（`{colors.ink-muted-48}`——#7a7a7a）：禁用按钮文字及法律细则。

### 细线与边框
- **柔和分隔**（`{colors.divider-soft}`——#f0f0f0）：次要按钮的“边框”色——充当环形阴影，而非硬线。生产中常以 `rgba(0, 0, 0, 0.04)` 应用。
- **细线**（`{colors.hairline}`——#e0e0e0）：商店工具卡片及配置器选项片上的 1px 细线边框。

### 品牌渐变
**没有装饰渐变。** 产品摄影中的氛围纵深（iPhone 17 Pro 相机板、Apple Watch 表带、AirPods 反光）来自图像本身，不是 CSS 渐变覆盖层。环境页面首屏采用摄影氛围（黎明山景），但没有定义渐变令牌。Apple 是少见的完全没有渐变设计令牌的奢华品牌网站。

## 排版

### 字体家族
- **展示**：`SF Pro Display, system-ui, -apple-system, sans-serif`——Apple 专有展示字体，针对 ≥ 19px 字号优化。定义每个标题的语气。
- **正文 / UI**：`SF Pro Text, system-ui, -apple-system, sans-serif`——针对文字优化的变体，用于正文、说明、按钮及低于 20px 的链接。
- **OpenType 特性**：数字链接（价格表、规格表）启用 `font-variant-numeric: numerator`。展示字号依靠紧字距，而非上下文连字。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 56px | 600 | 1.07 | -0.28px | 首屏标题；标志性“Apple 式紧凑”字距 |
| `{typography.display-lg}` | 40px | 600 | 1.10 | 0 | 每个产品展块顶部的标题 |
| `{typography.display-md}` | 34px | 600 | 1.47 | -0.374px | 分区标题（展示比例的 SF Pro Text） |
| `{typography.lead}` | 28px | 400 | 1.14 | 0.196px | 产品展块辅助文案 |
| `{typography.lead-airy}` | 24px | 300 | 1.5 | 0 | 环境页面引导段落（少见的 300 字重） |
| `{typography.tagline}` | 21px | 600 | 1.19 | 0.231px | 展块下标语；次级导航类别名 |
| `{typography.body-strong}` | 17px | 600 | 1.24 | -0.374px | 行内强强调 |
| `{typography.body}` | 17px | 400 | 1.47 | -0.374px | 默认段落 |
| `{typography.dense-link}` | 17px | 400 | 2.41 | 0 | 页脚 / 商店工具链接列表（宽松行距） |
| `{typography.caption}` | 14px | 400 | 1.43 | -0.224px | 次要说明、按钮文字 |
| `{typography.caption-strong}` | 14px | 600 | 1.29 | -0.224px | 强调说明 |
| `{typography.button-large}` | 18px | 300 | 1.0 | 0 | 商店首屏 CTA（少见的 300 字重） |
| `{typography.button-utility}` | 14px | 400 | 1.29 | -0.224px | 工具/导航按钮标签 |
| `{typography.fine-print}` | 12px | 400 | 1.0 | -0.12px | 细则、页脚正文 |
| `{typography.micro-legal}` | 10px | 400 | 1.3 | -0.08px | 微型法律免责声明 |
| `{typography.nav-link}` | 12px | 400 | 1.0 | -0.12px | 全局导航菜单项 |

### 原则

- **展示字号使用负字距。** 每个 17px 及以上标题略收紧字距（`-0.12 → -0.374px`）。这产生标志性的“Apple 式紧凑”标题节奏。12px 及以下绝不使用。
- **正文 17px，而非 16px。** Apple 打破 SaaS 惯例，段落使用 17px。多出的一个像素赋予页面明确的“阅读，而非扫读”节奏。
- **300 字重真实存在且少见。** 有意用于少数较大文字（`{typography.button-large}` 18px/300 和 `{typography.lead-airy}` 24px/300）。并非偶然——这是轻盈氛围信号，保留给内容应显通透的时刻。
- **标题 600，而非 700。** Apple 标题为 600 字重。需要稍强表达时，少量在 `{typography.tagline}`（21px）使用 700。
- **行高依语境而定。** 展示字号用 1.07–1.19（紧凑）。正文用 1.47。页脚/商店工具链接堆叠采用异常宽松的 2.41（`{typography.dense-link}`）。2.41 不是错误——它让密集页脚链接列能够呼吸。
- **500 字重有意缺席。** 阶梯是 300 / 400 / 600 / 700。中等字重的文字始终用 600。

### 替代字体说明
SF Pro 是 Apple 专有系统字体。非原系统构建时：

- 栈首使用 `system-ui, -apple-system, BlinkMacSystemFont`——在 macOS/iOS/Safari 上解析到真实 SF Pro。
- 非 Apple 平台上，**Inter**（Google Fonts，可变）是最接近的开源对应字体。Inter 600 字重配 `font-feature-settings: "ss03"` 可近似 SF Pro 圆润的“a”字符。
- 展示字号将 `letter-spacing` 下调 `-0.01em`，重现 Apple 紧凑感；Inter 默认字距略宽于 SF Pro。
- 替换为 Inter 时，正文行高收紧 `0.03`（1.47 → 1.44）——Inter 较高的 x 字高需要更少行间距。

## 布局

### 间距系统
- **基础单位：**8px。基础以下数值（2、4、5、6、7）用于紧凑排版微调；结构布局对齐 8/12/16/20/24。
- **令牌：**`{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 17px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px。
- **分区垂直内边距：**产品展块内为 `{spacing.section}`（80px）；展块边到边堆叠，间隙 0（颜色变化提供分隔）。
- **卡片内边距：**工具网格卡片内为 `{spacing.lg}`（24px）。
- **按钮内边距：**垂直 8–11px，水平 15–22px。
- **通用节奏常量：**17px 正文行高倍数（约 25px 一行）及 21px 标语字号出现在每个分析页面上。

### 网格与容器
- **最大内容宽度：**文字密集分区（环境）约 980px，产品网格（商店、配件）约 1440px，产品展块（首页）满幅。
- **列模式：**商店/配件为 3 至 5 列工具卡片网格；首页偶尔采用双列并排展块；产品展块首屏为单列居中堆叠。
- **间隙：**工具网格卡片间 20–24px。

### 留白理念
Apple 的留白是产品的展台。每个展块标题上方至少 64px 空间，下方 48–64px。产品渲染图绝不拥挤；离产品图最近的内容至少相距 40px。页脚是唯一打破这一规则的地方——Apple 有意让它密集，使完整信息架构一目了然。

## 层叠高度与纵深

| 层级 | 处理方式 | 用途 |
|---|---|---|
| 平面 | 无阴影、无边框 | 满幅展块、全局导航、页脚、正文分区 |
| 柔和细线 | 1px `rgba(0, 0, 0, 0.08)` 边框 | 工具卡片、次级导航磨砂玻璃分隔 |
| 背景模糊 | 80% 羊皮纸色上 `backdrop-filter: blur(N)` | 次级导航及 iPhone 购买页浮动吸附栏 |
| 产品阴影 | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0` | 落在表面上的产品渲染图（系统唯一真正的“阴影”） |

**阴影理念。** Apple **恰好只用一种**投影，应用于摄影式产品图像——绝不用在卡片、按钮或文字上。UI 抬升来自（a）表面颜色变化（浅色展块 ↔ 深色展块）和（b）吸附栏上的背景模糊。唯一的阴影用于赋予产品重量，而非 UI 层级。

### 装饰性纵深
- 环境页面上的**氛围图像**（摄影风景）提供情绪；不涉及 CSS 渐变。
- **满幅展块交替**不靠边框或阴影产生节奏——颜色变化本身就是分隔。
- `{component.sub-nav-frosted}` 和 `{component.floating-sticky-bar}` 上的 **backdrop-filter 模糊**创造“悬浮于内容上”的效果，服务功能，而非装饰。

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.none}` | 0px | 满幅产品展块（无圆角） |
| `{rounded.xs}` | 5px | 以轻微标签片样式呈现的行内链接（少见） |
| `{rounded.sm}` | 8px | 深色工具按钮（登录、购物袋）、行内卡片图像 |
| `{rounded.md}` | 11px | 白色珍珠按钮胶囊 |
| `{rounded.lg}` | 18px | 商店工具卡片、配件网格卡片 |
| `{rounded.pill}` | 9999px | 主要蓝色胶囊 CTA、次级导航购买按钮、配置器选项片、搜索输入框——标志性 Apple 胶囊 |
| `{rounded.full}` | 9999px / 50% | 悬浮于摄影上的圆形控制片 |

### 摄影几何
- **首屏图像**：首页满幅，21:9 或更高；环境和商店页 16:9。产品渲染图逼真如摄影，常摄于有色调的表面上，该表面成为展块背景。
- **产品渲染图**：透明 PNG/WebP；落于表面展块上，并带系统阴影。
- **配件网格**：正方形 1:1 裁切，`{rounded.lg}`（18px）圆角，浅中性背景，产品居中，内部留 20–40px 内边距。
- **首屏展块不使用圆角图像**——图像是满幅矩形。圆角（`{rounded.sm}`、`{rounded.lg}`）仅出现在行内卡片图像。
- 所有断点通过响应式 `srcset` 和 `sizes` 懒加载；采用 CDN 优化的 WebP。

## 组件

### 顶部导航

**`global-nav`**——每页顶部固定、持续可见的超细黑色导航栏。背景 `{colors.surface-black}`，高 44px，文字 `{colors.on-dark}`，排版 `{typography.nav-link}`（12px / 400 / -0.12px 字距）。链接安静，相距约 20px，贯穿顶部。右对齐图标组：搜索、购物袋——始终可见。移动端约 834px 时收起为汉堡菜单，Apple 标志居中。

**`sub-nav-frosted`**——表面特定导航，吸附于全局导航下。背景 `{colors.canvas-parchment}`，80% 不透明度，配 backdrop-filter 模糊，形成磨砂玻璃效果。高 52px。左侧：产品类别名（“iPhone”“商店”“配件”），采用 `{typography.tagline}`（21px / 600）。右侧：`{typography.button-utility}`（14px）行内导航链接，以持续可见的 `{component.button-primary}`（“购买”）或工具链接结束。

### 按钮

**`button-primary`**——标志性 Apple 操作。背景 `{colors.primary}`（行动蓝 #0066cc），文字 `{colors.on-primary}`，排版 `{typography.body}`（SF Pro Text 17px / 400），圆角 `{rounded.pill}`（完整胶囊），内边距 11px × 22px。完整胶囊圆角**就是**品牌操作信号。
- 活动状态：`{component.button-primary-active}`——`transform: scale(0.95)`（全系统微交互）。
- 焦点状态：`{component.button-primary-focus}`——2px 实线 `{colors.primary-focus}` 轮廓。

**`button-secondary-pill`**——两个蓝色胶囊并列时的第二 CTA（“进一步了解” / “购买”）。透明背景，文字 `{colors.primary}`，1px 实线 `{colors.primary}` 边框，圆角 `{rounded.pill}`，内边距 11px × 22px。呈“幽灵胶囊”效果。

**`button-dark-utility`**——全局导航操作（登录、购物袋、语言选择器）。背景 `{colors.ink}`（#1d1d1f），文字 `{colors.on-dark}`，排版 `{typography.button-utility}`（14px / 400 / -0.224px 字距），圆角 `{rounded.sm}`（8px），内边距 8px × 15px。活动状态通过 `transform: scale(0.95)` 缩小。

**`button-pearl-capsule`**——产品卡片次要按钮。背景 `{colors.surface-pearl}`（#fafafc），文字 `{colors.ink-muted-80}`，排版 `{typography.caption}`（14px），3px 实线 `{colors.divider-soft}` 边框（充当柔和环，而非可见线），圆角 `{rounded.md}`（11px），内边距 8px × 14px。

**`button-store-hero`**——商店首屏表面上的较大主要 CTA。与 `{component.button-primary}` 相同行动蓝 + 纸白，但采用 `{typography.button-large}`（18px / 300——注意少见的 300 字重）及稍大内边距（14px × 28px）。在商店着陆页少量使用。

**`button-icon-circular`**——悬浮于摄影上。44 × 44px，背景 `{colors.surface-chip-translucent}` 约 64% alpha，图标 `{colors.ink}`，圆角 `{rounded.full}`。用于轮播控件、关闭按钮及图内控件（iPhone 购买页产品图缩略图）。

**`text-link`**——`{colors.primary}`（行动蓝）行内正文链接。按语境决定是否带下划线。

**`text-link-on-dark`**——深色展块上的行内正文链接，采用 `{colors.primary-on-dark}`（天空链接蓝 #2997ff）——行动蓝在 `{colors.surface-tile-1}` 上会消失。

### 卡片与容器

**`product-tile-light`**——满幅浅色展块。背景 `{colors.canvas}`（白），文字 `{colors.ink}`，圆角 `{rounded.none}`（0——展块贴边），垂直内边距 `{spacing.section}`（80px）。居中堆叠：产品名 `{typography.display-lg}`（40px / 600）→ 单行标语 `{typography.lead}`（28px / 400）→ 两个 `{component.button-primary}` CTA（“进一步了解” / “购买”）→ 落在表面、带系统阴影的产品渲染图。

**`product-tile-parchment`**——与 `{component.product-tile-light}` 相同，但置于 `{colors.canvas-parchment}`（#f5f5f7）上。用于打断连续两个白色展块。

**`product-tile-dark`**——满幅深色展块。背景 `{colors.surface-tile-1}`（#272729），文字 `{colors.on-dark}`，圆角 `{rounded.none}`，垂直内边距 `{spacing.section}`（80px）。与浅色展块相同内容堆叠，但行内文案用 `{component.text-link-on-dark}`，按钮用 `{component.button-primary}`（行动蓝在深色表面仍可用）。首页产品网格中作为交替深色带。

**`product-tile-dark-2`**——`{colors.surface-tile-2}`（#2a2a2c）变体。深色展块紧邻 `{component.product-tile-dark}` 上下时使用，通过微小明度变化形成极弱区分。

**`product-tile-dark-3`**——`{colors.surface-tile-3}`（#252527）变体。用于堆叠底部及嵌入视频/播放器框架。

**`store-utility-card`**——用于商店及配件网格。背景 `{colors.canvas}`（白），1px 实线 `{colors.hairline}` 边框，圆角 `{rounded.lg}`（18px），内边距 `{spacing.lg}`（24px）。顶部：产品图（1:1 裁切，内部图像圆角 `{rounded.sm}`（8px））。下方：产品名 `{typography.body-strong}`（17px / 600）、价格 `{typography.body}`（17px / 400），以及 `{component.text-link}`（“购买”或“进一步了解”）。默认无阴影；产品渲染图自身承载系统产品阴影。

**`configurator-option-chip`**——iPhone 17 Pro 购买页使用的胶囊形可点击单元。背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.caption}`，圆角 `{rounded.pill}`，内边距 12px × 16px。包含小产品缩略图 + 标签 + 价格差额。每行排列 4–5 个选项。

**`configurator-option-chip-selected`**——选中状态。边框升级为 2px 实线 `{colors.primary-focus}`。形状、内容相同。

**`environment-quote-card`**——环境页面专属的摄影画布首屏。深色摄影背景（黎明山景），以 `{colors.surface-tile-1}` 为后备色；居中白字标题 `{typography.display-lg}`（40px），标题上方为小型绿色“Apple 2030”象形标志，下方单个 `{component.button-primary}`。内边距 `{spacing.section}`（80px）。

**`floating-sticky-bar`**——iPhone 17 Pro 购买页滚动时悬于视口底部。背景 `{colors.canvas-parchment}`，80% 不透明度，配 `backdrop-filter: blur(N)`，高 64px，内边距 12px × 32px。左侧：实时价格总额 `{typography.body}`。右侧：`{component.button-primary}`（“添加到购物袋”）。

### 输入框与表单

**`search-input`**——配件搜索输入框。背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body}`（17px），1px 实线 `rgba(0, 0, 0, 0.08)` 边框，圆角 `{rounded.pill}`（完整胶囊——搜索也采用胶囊形，与 CTA 语法一致），内边距 12px × 20px，高 44px。前置图标：14px 搜索字形，弱化色调。

分析页面未呈现错误及校验状态。

### 页脚

**`footer`**——背景 `{colors.canvas-parchment}`（#f5f5f7），文字 `{colors.ink-muted-80}`。链接列采用 `{typography.dense-link}`（17px / 400 / 2.41 行高——宽松行距让密集列易于扫读）。栏标题 `{typography.caption-strong}`（14px / 600）。最底部法律行 `{typography.fine-print}`（12px / 400），文字 `{colors.ink-muted-48}`。垂直内边距 64px。

## 应做与不应做

### 应做
- 每个交互元素——链接、胶囊 CTA、焦点信号——都使用 `{colors.primary}`（行动蓝 #0066cc），除此之外不用它。单一强调色不可妥协。
- 标题设为 `{typography.hero-display}` 或 `{typography.display-lg}`，配负字距（`-0.28 → -0.374px`），获得标志性“Apple 式紧凑”节奏。
- 正文采用 `{typography.body}`（17px / 400 / 1.47 / -0.374px）——不是 16px。多出的一个像素定义品牌阅读节奏。
- 交替使用 `{component.product-tile-light}`（或羊皮纸色）与 `{component.product-tile-dark}`，形成满幅分区节奏。颜色变化**就是**分隔。
- 将 `{rounded.pill}` 保留给主要蓝色 CTA 及其他应呈现为“操作”的元素（配置器选项片、搜索输入框、吸附栏 CTA）。
- 唯一产品阴影（`rgba(0, 0, 0, 0.22) 3px 5px 30px`）仅用于落在表面的产品渲染图——绝不用在卡片、按钮或文字。
- 每个按钮的活动/按下状态均使用 `transform: scale(0.95)`——全系统微交互。
- 全局导航保持 `{colors.surface-black}`（纯黑）——大多数页面上唯一出现纯黑的位置。

### 不应做
- 不要引入第二种强调色；每个“点击我”信号都是 `{colors.primary}`（行动蓝）。
- 不要给卡片、按钮或文字加阴影——阴影保留给产品图像。
- 不要使用渐变作为装饰背景；氛围来自摄影。
- 不要将正文字重设为 500——Apple 阶梯为 300 / 400 / 600 / 700，500 有意缺席。正文始终 400；行内强强调 600；展示 600。
- 不要给满幅展块加圆角——展块是贴边矩形；颜色变化就是分隔。
- 不要将正文行高收紧到 1.47 以下——编辑式行距是品牌的一部分。
- 不要混合圆角语法——紧凑工具用 `{rounded.sm}`，工具卡片用 `{rounded.lg}`，胶囊用 `{rounded.pill}`，不用中间值（少见的 `{rounded.md}` 珍珠按钮除外）。
- 不要在浅色表面使用 `{colors.primary-on-dark}`（天空链接蓝）——它是深色展块专属变体。行动蓝用于浅色表面。

## 响应式行为

### 断点

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 小型手机 | ≤ 419px | 单列展块；次级导航仅保留类别名 + 主要 CTA；首屏字号降至 28px |
| 手机 | 420–640px | 单列堆叠；产品渲染图缩放至展块宽度 80%；首屏 h1 降至 34px |
| 大型手机 | 641–735px | 展块采用更紧内边距（垂直 48px 而非 80px）；细则换行 |
| 竖屏平板 | 736–833px | 全局导航收起为汉堡菜单；次级导航隐藏类别片，保留主要 CTA |
| 横屏平板 | 834–1023px | 全局导航恢复完全展开；3 列工具网格变为 2 列 |
| 小型桌面 | 1024–1068px | 产品展块用 2/3 宽度及边距；首屏 h1 保持 40px |
| 桌面 | 1069–1440px | 完整布局；商店网格 4–5 列；内容最大 1440px |
| 宽屏桌面 | ≥ 1441px | 内容锁定 1440px，边距吸收额外宽度 |

对 agent 重要的结构断点：1440px（内容锁定）、1068px（小型桌面）、833px（横屏平板切换）、734px（竖屏平板）、640px（手机）、480px（小型手机）。

### 触控目标
- 最小 44 × 44px。`{component.button-primary}` 约为 44 × 100px（完整胶囊圆角使可见点击区比标签暗示的更宽裕）。
- `{component.button-icon-circular}` 恰好 44 × 44px。
- 全局导航工具链接更小（约 32 × 80px）——它们有意采用更紧目标，因为属于精确桌面操作；≤ 833px 时由移动汉堡菜单替代。

### 收缩策略
- **全局导航**：桌面完整水平链接行 → 在 834px 及以下收起为 Apple 标志 + 汉堡菜单 + 购物袋图标。
- **次级导航**：类别名 + 行内链接 + 主要 CTA → 移动端仅类别名 + 主要 CTA；行内链接移入汉堡托盘。
- **产品展块**：834px 时从双列堆叠为单列；小型手机垂直内边距从 80px → 48px。
- **工具网格**（商店、配件）：5 列 → 4 列（1440px）→ 3 列（1068px）→ 2 列（834px）→ 1 列（640px）。
- **首屏排版**：`{typography.hero-display}`（56px）→ 1068px 时 `{typography.display-lg}`（40px）→ 640px 时 34px → 419px 时 28px。

### 图像行为
- 所有产品图像使用响应式 `srcset`，裁切与断点匹配。
- 首屏摄影在移动端可能改变艺术指导（例如环境页面风景在移动端裁成更高比例，以不同方式框取主体）。
- 产品渲染图跨断点保持 1:1 或 4:3 宽高比；只改变缩放。
- 默认懒加载；首屏上方图像立即加载。

## 迭代指南

1. 每次聚焦一个组件。直接引用其 YAML 键（`{component.product-tile-dark}`、`{component.search-input}`）。
2. 现有组件变体（`-active`、`-focus`、`-2`、`-3`）在 `components:` 中作为独立条目存在。
3. 处处使用 `{token.refs}`——绝不内联十六进制色。
4. 绝不记录悬停。仅记录默认及活动/按下状态。
5. 展示标题保持 SF Pro Display 600，负字距。正文保持 SF Pro Text 400、17px。这条边界不可打破。
6. 唯一投影（`rgba(0, 0, 0, 0.22) 3px 5px 30px`）仅保留给产品摄影。
7. 不确定如何强调时：先交替表面（浅色 → 深色展块），再考虑添加界面装饰。

## 已知缺口

- 分析页面未呈现表单校验及错误状态；仅记录中性搜索输入框。
- 首页嵌入视频/播放器框架使用 `{colors.surface-black}`；未记录内部播放器控件（属于平台组件，而非网页设计令牌）。
- 某些组件图像是动态的（轮换产品首屏），具体文案因表面而异——组件规格命名结构，而非轮换内容。
- 分析页面未呈现商店及配件工具卡片的深色模式对应版；此处记录的是 Apple 默认交付的日间/浅色主导版本。
- 氛围摄影（环境页面山景）是内容资产，而非设计令牌；所记录的 `{component.environment-quote-card}` 仅描述结构表面。
- `{component.sub-nav-frosted}` 和 `{component.floating-sticky-bar}` 的确切 backdrop-filter 模糊半径因平台而异；生产 CSS 常以 `saturate(180%) blur(20px)` 为基线，但该值未正式定义为令牌。
