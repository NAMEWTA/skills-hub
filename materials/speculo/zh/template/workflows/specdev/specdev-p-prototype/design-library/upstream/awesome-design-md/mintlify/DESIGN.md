---
version: alpha
name: Mintlify-design-analysis
description: Mintlify 以双模式美学呈现文档基础设施——氛围天空渐变营销首屏（云朵插图背景、柔和奶油到蓝色晕染），搭配密集的开发者级文档表面。系统 UI 文字采用 Inter，代码采用 Geist Mono，标志性 Mintlify 绿（{colors.brand-green}）保留给强调 CTA 及活动状态。黑色胶囊主要按钮主导营销，深色首屏带上出现白色反转，三列文档布局（侧栏 / 正文 / 目录）锚定开发者体验。覆盖首页、初创企业计划、定价对比及实际标签页文档页面。

colors:
  primary: "#0a0a0a"
  on-primary: "#ffffff"
  brand-green: "#00d4a4"
  brand-green-deep: "#00b48a"
  brand-green-soft: "#7cebcb"
  brand-tag: "#3772cf"
  brand-warn: "#c37d0d"
  brand-annotate: "#1ba673"
  brand-error: "#d45656"
  brand-cursor: "#888888"
  hero-sky-from: "#87a8c8"
  hero-sky-to: "#f5e9d8"
  hero-dark-from: "#1a3d4a"
  hero-dark-to: "#2d5a4f"
  testimonial-orange: "#f55a3c"
  testimonial-orange-deep: "#cc3a1f"
  canvas: "#ffffff"
  canvas-dark: "#0a0a0a"
  surface: "#f7f7f7"
  surface-soft: "#fafafa"
  surface-code: "#1c1c1e"
  hairline: "#e5e5e5"
  hairline-soft: "#ededed"
  hairline-dark: "#1f1f1f"
  ink: "#0a0a0a"
  charcoal: "#1c1c1e"
  slate: "#3a3a3c"
  steel: "#5a5a5c"
  stone: "#888888"
  muted: "#a8a8aa"
  on-dark: "#ffffff"
  on-dark-muted: "#b3b3b3"

typography:
  hero-display:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.5px
  heading-1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1px
  heading-2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
  heading-4:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.30
  heading-5:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  subtitle:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
  body-md-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.50
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 0.5px
  button-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30
  code-md:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  code-sm:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  code-inline:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-primary-pressed:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-accent-green:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-on-dark:
    backgroundColor: "{colors.on-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
    border: "1px solid {colors.hairline}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 32px
    border: "1px solid {colors.hairline}"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-feature:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-help:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-startup-perk:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  pricing-card-featured:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.brand-green}"
    shadow: "rgba(0, 212, 164, 0.08) 0px 8px 24px"
  testimonial-card-feature:
    backgroundColor: "{colors.testimonial-orange}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  testimonial-card-quote:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.brand-green}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.md}"
    height: 36px
    border: "1px solid {colors.hairline}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
    border: "0 0 2px transparent solid"
  segmented-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    border: "0 0 2px {colors.ink} solid"
  pill-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.primary}"
  toggle-monthly-yearly:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px"
  badge-discount:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-required:
    backgroundColor: "{colors.brand-error}"
    textColor: "{colors.on-dark}"
    typography: "{typography.micro-uppercase}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  badge-type:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  badge-tag:
    backgroundColor: "rgba(55, 114, 207, 0.15)"
    textColor: "{colors.brand-tag}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  promo-banner:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  code-block:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-block-header:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.caption}"
    padding: "{spacing.xs} {spacing.md}"
    border: "0 0 1px {colors.hairline-dark} solid"
  code-inline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.charcoal}"
    typography: "{typography.code-inline}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
    border: "1px solid {colors.hairline}"
  property-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md} 0"
    border: "0 0 1px {colors.hairline-soft} solid"
  feature-comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  feature-comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 1px {colors.hairline-soft} solid"
  sidebar-nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
  sidebar-nav-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
  sidebar-section-header:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.micro-uppercase}"
    padding: "{spacing.md} {spacing.md} {spacing.xs}"
  doc-toc-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  doc-toc-item-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
  copy-code-button:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.xs}"
    border: "1px solid {colors.hairline-dark}"
  hero-band-sky:
    backgroundColor: "{colors.hero-sky-from}"
    textColor: "{colors.on-dark}"
    rounded: "0"
    padding: "{spacing.hero}"
  hero-band-dark:
    backgroundColor: "{colors.hero-dark-from}"
    textColor: "{colors.on-dark}"
    rounded: "0"
    padding: "{spacing.hero}"
  hero-product-mockup:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "0"
    border: "1px solid {colors.hairline-soft}"
    shadow: "rgba(0, 0, 0, 0.12) 0px 24px 48px -8px"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  footer-region:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
    border: "1px solid {colors.hairline}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  startup-program-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  founder-quote-card:
    backgroundColor: "{colors.testimonial-orange}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
---

## 概览

Mintlify 定位于精致营销呈现与开发者级文档密度的交汇处。首页及初创企业页面以电影感氛围首屏开场——首页是带云朵插图的柔和天空渐变背景，初创企业页是配火箭发射的深青绿到薄荷渐变——更像 SaaS 着陆页美学，而非开发者工具。更深层表面（定价对比、实际文档页面）随即收紧成密集、高信息量布局，Inter 正文以 14–16px 贯穿长篇文字、语法高亮代码块及三列文档网格。

品牌标志性薄荷绿（{colors.brand-green}）出现克制，却很果断——用于首屏“开始使用”胶囊按钮、功能列表绿色勾号、“精选”定价档位边框，以及文档 UI 内的活动状态指示。黑色胶囊主要按钮主导营销流程；深色首屏带上出现白色反转。Inter（正文、标题）搭配 Geist Mono（代码块、行内引用、类型签名）的标志性组合，无需第三套字体就强化了开发者工具基因。

**关键特征：**
- 氛围渐变首屏带（首页天蓝到奶油；初创企业页青绿到薄荷）提供电影感营销呈现
- 标志性 Mintlify 薄荷绿（{colors.brand-green}）保留给强调 CTA、活动状态及功能确认
- 黑色胶囊主要按钮（{colors.primary} + `{rounded.full}`）用于营销 CTA
- Inter 用于所有 UI 文字；Geist Mono 用于代码块、行内代码及类型/属性签名
- 三列文档布局（侧栏 / 正文 / 目录），密集 14px 正文供开发者长篇阅读
- 严格控制圆角刻度：营销采用 `{rounded.lg}`（12px），胶囊按钮用 `{rounded.full}`——不采用中间圆角柔化
- 鲜亮证言卡片（`{colors.testimonial-orange}`）有意打破色彩节奏，制造情感冲击

## 颜色

> 来源页面：mintlify.com/（首页）、/startups（计划页）、/pricing（对比）、/docs/components/tabs（实际文档）。全部四页的令牌覆盖相同。

### 品牌与强调
- **Mintlify 薄荷**（{colors.brand-green}）：标志性强调——用于首屏“开始使用”胶囊按钮、功能列表绿色勾号、精选定价档位边框强调、侧栏活动指示圆点。
- **深薄荷**（{colors.brand-green-deep}）：薄荷强调色的按下/活动变体。
- **柔和薄荷**（{colors.brand-green-soft}）：成功状态及确认表面的细微背景色调。
- **品牌标签色**（{colors.brand-tag}）：文档标签及引用颜色（用于 `<Tabs>` JSX 式注释及代码标签片）。
- **品牌注释色**（{colors.brand-annotate}）：行内代码注释绿（用于 twoslash 代码注释系统）。
- **品牌警告色**（{colors.brand-warn}）：代码警告高亮（弃用、警示）。
- **品牌错误色**（{colors.brand-error}）：必填字段标签及错误高亮的红色。
- **证言橙**（{colors.testimonial-orange}）：暖珊瑚橙，用于“Cursor”证言卡片及温暖提示表面。

### 表面
- **画布白**（{colors.canvas}）：主要页面及卡片背景。
- **深色画布**（{colors.canvas-dark}）：促销横幅、深色反转表面、代码编辑器外框。
- **表面**（{colors.surface}）：细微分区背景、搜索胶囊静止状态、行内代码背景、侧栏活动状态。
- **柔和表面**（{colors.surface-soft}）：更安静的分区背景及 FAQ 折叠面板。
- **代码表面**（{colors.surface-code}）：深色代码块外框背景。
- **细线**（{colors.hairline}）：1px 边框及主要分隔线。
- **柔和细线**（{colors.hairline-soft}）：更安静的表格行分隔及次级分区分隔。

### 首屏氛围
- **首屏天空起点 / 终点**（{colors.hero-sky-from}、{colors.hero-sky-to}）：首页首屏氛围天蓝到柔和奶油渐变。
- **首屏深色起点 / 终点**（{colors.hero-dark-from}、{colors.hero-dark-to}）：初创企业首屏深青绿到薄荷渐变。

### 文字
- **主文字色**（{colors.ink}）：主要标题及 CTA 文字。
- **炭灰**（{colors.charcoal}）：正文、行内代码前景。
- **板岩灰**（{colors.slate}）：次要文字及元数据。
- **钢灰**（{colors.steel}）：第三级文字、表头、侧栏非活动项、页脚链接。
- **石灰**（{colors.stone}）：说明文字、twoslash 光标颜色、弱化标签。
- **弱化色**（{colors.muted}）：去强调标签及禁用文字。
- **深色上文字**（{colors.on-dark}）：深色表面（首屏带、代码块、促销横幅）上的白字。
- **深色上弱化文字**（{colors.on-dark-muted}）：降低不透明度的白色，用于代码块标题栏及深色上的元数据。

### 语义
- 错误色调来自 `{colors.brand-error}`，用于输入框边框、必填字段标签及校验消息。

## 排版

### 字体家族
**Inter**（主要）：为 UI 易读性优化的可变字体。用于每个 UI 表面——正文、标题、导航、按钮标签、说明。后备：-apple-system、BlinkMacSystemFont、'Segoe UI'、sans-serif。

**Geist Mono**（代码）：等宽字体，用于代码块、行内代码引用、类型签名（如 `string`、`number`、`boolean`），以及 API 文档属性名。后备：'SF Mono'、Menlo、Consolas、'Geist Mono Fallback'、monospace。

品牌不使用两套字体的斜体变体——强调来自字重（500/600）、颜色变化或背景高亮（代码引用中）。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 72px | 600 | 1.05 | -2px | 营销首屏展示（“智能知识平台”） |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.5px | 主要分区开场（“为智能时代而构建”） |
| `{typography.heading-1}` | 48px | 600 | 1.10 | -1px | 页面级标题（“按你的方式定价”） |
| `{typography.heading-2}` | 36px | 600 | 1.20 | -0.5px | 分区标题（“申请 Mintlify 初创企业计划”） |
| `{typography.heading-3}` | 28px | 600 | 1.25 | 0 | 子分区标题、“标签页”文档页标题 |
| `{typography.heading-4}` | 22px | 600 | 1.30 | 0 | 卡片标题、较大功能标题 |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | 较小功能标题、FAQ 问题标题 |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | 首屏副标题、引导正文 |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | 主要正文 |
| `{typography.body-md-medium}` | 16px | 500 | 1.50 | 0 | 正文强调 |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | 次要正文、表格单元、导航 |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | 活动侧栏导航、按钮标签、标签页标签 |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | 辅助文字、细则、代码块标题栏 |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | 徽标标签 |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | 页脚微文案、标签片 |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 0.5px | 侧栏分区标题、“必填”标签 |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | 胶囊按钮标签 |
| `{typography.code-md}` | 14px | 400 | 1.50 | 0 | 代码块内容 |
| `{typography.code-sm}` | 13px | 400 | 1.40 | 0 | 较小代码、类型签名 |
| `{typography.code-inline}` | 13px | 500 | 1.30 | 0 | 正文中行内 `<Tabs>` 引用 |

### 原则
- **紧凑首屏行距**（1.05），在 72px 首屏中形成杂志级展示标题
- **负字距**随字号反向推进——展示字号使用 -2px 至 -1.5px；较小标题放松至 0
- **文档级正文**（14–16px、1.50 行高）确保密集文档表面舒适的长篇阅读
- **Inter / Geist Mono 搭配**——其余全部内容用 Inter，代码引用精准使用 Geist Mono；两者对比传达品牌对开发者的尊重
- **大写微标签**配 +0.5px 字距，承载侧栏分区标题及“必填”注释标签

## 布局

### 间距系统
- **基础单位**：4px（主要增量 8px）
- **令牌**：`{spacing.xxs}`（4px）· `{spacing.xs}`（8px）· `{spacing.sm}`（12px）· `{spacing.md}`（16px）· `{spacing.lg}`（20px）· `{spacing.xl}`（24px）· `{spacing.xxl}`（32px）· `{spacing.xxxl}`（40px）· `{spacing.section-sm}`（48px）· `{spacing.section}`（64px）· `{spacing.section-lg}`（96px）· `{spacing.hero}`（120px）
- **分区节奏**：营销页面主要带间使用 `{spacing.section-lg}`（96px）；定价对比收紧为 `{spacing.section}`（64px）；文档表面子分区间用 `{spacing.xxl}`（32px）
- **卡片内部内边距**：紧凑卡片标准 `{spacing.xl}`（24px）；定价卡片及功能面板 `{spacing.xxl}`（32px）；证言卡片增至 `{spacing.section}`（64px），形成首屏卡片存在感

### 网格与容器
- 营销页面最大宽度 1280px，两侧间距 32px
- 首屏及功能带常采用双列分栏（左文字，右插图/模拟图）
- 定价页桌面每行 3 档卡片（FREE / Lift Off / Custom），下方为全面功能对比表
- 文档页面严格采用三列网格：左侧栏导航（约 240px）、中央正文（最大宽约 720px）、右目录（约 200px）
- 标志墙每行 6 个客户标志，每个高 80–100px

### 留白理念
营销表面给内容宽裕呼吸空间——首屏 `{spacing.hero}`（120px）让氛围渐变背景清晰可辨。文档显著收紧：分区间隙降至 `{spacing.xxl}`（32px），表格行压至 `{spacing.md}`（16px），侧栏导航压至 `{spacing.xs}`（8px）垂直节奏。

## 层叠高度与纵深

系统主要采用平面设计，策略性地加入氛围纵深。

| 层级 | 处理方式 | 用途 |
|---|---|---|
| 0（平面） | 无阴影；`{colors.hairline}` 边框 | 默认卡片、表格行、表单输入框 |
| 1（细微） | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | 悬停抬升块、细微高亮 |
| 2（卡片） | `rgba(0, 0, 0, 0.08) 0px 4px 12px 0px` | 标准功能卡片 |
| 3（模拟图） | `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px` | 首屏产品模拟图外框——首页首屏文档预览下深而弥散的投影 |
| 4（品牌着色） | `rgba(0, 212, 164, 0.08) 0px 8px 24px` | 精选定价档位辉光 |

### 装饰性纵深
- 首页首屏用氛围摄影背景（天空渐变上的云朵插图）表现纵深——无需阴影；图像承担表达
- 初创企业首屏采用相似处理，火箭发射插图穿过深青绿渐变
- 代码块通过深色表面上的语法高亮色彩层级形成内部纵深；不用阴影

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.xs}` | 4px | 行内代码片、微型标签 |
| `{rounded.sm}` | 6px | 侧栏导航项、类型徽标 |
| `{rounded.md}` | 8px | 输入框、搜索胶囊、代码块、次要卡片 |
| `{rounded.lg}` | 12px | 标准卡片、定价档位、首屏模拟图、FAQ 项 |
| `{rounded.xl}` | 16px | 较大功能面板 |
| `{rounded.xxl}` | 24px | 精选产品展示块 |
| `{rounded.full}` | 9999px | 所有按钮、胶囊标签页、徽标 |

圆角刻度纪律严明——品牌在同一组件家族中绝不使用介于 `{rounded.md}`（8px）与 `{rounded.lg}`（12px）之间的圆角柔化。胶囊按钮（`{rounded.full}`）普遍使用；矩形卡片一致使用 `{rounded.lg}`（12px）。

### 摄影几何
- 首屏插图（云、火箭）置于满幅渐变背景，无内部外框
- 客户标志墙用无圆角的 1:1 单元（标志作为字标行内呈现）
- 证言照片使用 1:1 比例及 `{rounded.md}`（8px）柔化
- 代码编辑器模拟首屏图像使用 `{rounded.lg}`（12px）圆角，卡片有细线边框及深而弥散的投影

## 组件

> 按不记录悬停的策略，**不记录**悬停状态。仅默认与按下/活动状态。

### 按钮

**`button-primary`**——黑色胶囊主要 CTA，所有表面的主导操作。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.button-md}`，内边距 `10px 20px`，圆角 `{rounded.full}`。
- 按下状态 `button-primary-pressed` 提亮至 `{colors.charcoal}`。
- 禁用状态 `button-primary-disabled` 使用 `{colors.hairline}` 背景及 `{colors.muted}` 文字。

**`button-accent-green`**——品牌强调 CTA 的薄荷绿胶囊（首屏“开始使用”、精选定价 CTA）。
- 背景 `{colors.brand-green}`，文字 `{colors.primary}`，排版 `{typography.button-md}`，内边距 `10px 20px`，圆角 `{rounded.full}`。

**`button-on-dark`**——深色首屏带上的白色胶囊（初创企业页“开始使用”）。
- 背景 `{colors.on-dark}`，文字 `{colors.primary}`，排版 `{typography.button-md}`，内边距 `10px 20px`，圆角 `{rounded.full}`。

**`button-secondary`**——次要操作的描边胶囊。
- 透明背景，文字 `{colors.ink}`，边框 `1px solid {colors.hairline}`，排版 `{typography.button-md}`，内边距 `10px 20px`，圆角 `{rounded.full}`。

**`button-ghost`**——更安静的矩形幽灵按钮（侧栏操作、第三级导航）。
- 透明背景，文字 `{colors.ink}`，排版 `{typography.button-md}`，内边距 `8px 12px`，圆角 `{rounded.md}`。

**`button-link`**——以低调按钮样式呈现的行内文字链接。
- 透明背景，文字 `{colors.ink}`，排版 `{typography.body-sm-medium}`，内边距 `0`。激活时出现下划线。

**`button-icon-circular`**——32×32px 圆形工具按钮（关闭、复制、箭头）。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，边框 `1px solid {colors.hairline}`，圆角 `{rounded.full}`。

### 卡片与容器

**`card-base`**——标准文档/功能卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xl}`，边框 `1px solid {colors.hairline}`。

**`card-feature`**——浅灰表面上的功能面板。
- 背景 `{colors.surface}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`。

**`card-help`**——定价对比下方的“需要帮助？”CTA 卡片（“快速入门指南”“技术写作指南”“创始人”“销售”）。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xl}`，边框 `1px solid {colors.hairline}`。

**`card-startup-perk`**——初创企业计划福利网格项（“折扣和额度”“优先支持”“初创礼包”“创始人社区”）。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xl}`，边框 `1px solid {colors.hairline}`。顶部图标，标题 `{typography.heading-5}`，描述 `{typography.body-sm}` `{colors.steel}`。

**`pricing-card`**——标准定价档位卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `1px solid {colors.hairline}`。
- 标题 `{typography.heading-3}`，价格 `{typography.display-lg}`，功能列表 `{typography.body-sm}`，带绿色勾号图标。

**`pricing-card-featured`**——突出定价档位（Lift Off / 精选计划）。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `2px solid {colors.brand-green}`，柔和品牌色阴影 `rgba(0, 212, 164, 0.08) 0px 8px 24px`。

**`testimonial-card-feature`**——亮橙色大型证言卡片，配照片 + 引语（“Cursor——在 YC 的每一期中，我们始终看到表现最出色的初创企业使用 Mintlify 构建文档。”）。
- 背景 `{colors.testimonial-orange}`，文字 `{colors.on-dark}`，圆角 `{rounded.lg}`，内边距 `{spacing.section}`。照片在右，左侧大引语 `{typography.heading-3}`，下方署名 `{typography.body-sm-medium}`。

**`testimonial-card-quote`**——初创企业页较小白色证言卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `1px solid {colors.hairline}`。

**`founder-quote-card`**——橙色表面上的 Cursor 创始人证言卡片变体。
- 背景 `{colors.testimonial-orange}`，文字 `{colors.on-dark}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`。承载特定创始人肖像 + 引语处理。

**`startup-program-card`**——较大申请/计划卡片，包含福利网格 + 申请 CTA。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `1px solid {colors.hairline}`。

### 输入框与表单

**`text-input`**——标准文字字段。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，边框 `1px solid {colors.hairline}`，圆角 `{rounded.md}`，内边距 `{spacing.sm} {spacing.md}`，高 40px。

**`text-input-focused`**——激活状态。
- 边框变为 `2px solid {colors.brand-green}`——焦点使用品牌薄荷色作为激活信号。

**`search-pill`**——文档顶部栏搜索。
- 背景 `{colors.surface}`，文字 `{colors.steel}`，排版 `{typography.body-sm}`，圆角 `{rounded.md}`，高 36px，边框 `1px solid {colors.hairline}`。

### 标签页

**`segmented-tab`** + **`segmented-tab-active`**——下划线式标签导航（文档 Tabs 组件中的“第一个标签页 / 第二个标签页 / 第三个标签页”）。
- 非活动：文字 `{colors.steel}`，透明背景，内边距 `{spacing.sm} {spacing.md}`。活动：文字 `{colors.ink}`，底部 2px `{colors.ink}` 边框。

**`pill-tab`** + **`pill-tab-active`**——胶囊式标签导航（定价页顶部：“定价 / 路线图”）。
- 非活动：背景 `{colors.canvas}`，文字 `{colors.steel}`，边框 `1px solid {colors.hairline}`，内边距 `8px 16px`，圆角 `{rounded.full}`。
- 活动：背景 `{colors.primary}`，文字 `{colors.on-primary}`，无边框。

**`toggle-monthly-yearly`**——双状态胶囊切换器（定价页按月 / 按年）。
- 背景 `{colors.surface}`，圆角 `{rounded.full}`，内边距 `4px`。活动状态将白色胶囊滑块移到选中位置。

### 徽标与状态

**`badge-discount`**——附着于年度切换器的小型绿色“节省 20%”徽标。
- 背景 `{colors.brand-green}`，文字 `{colors.primary}`，排版 `{typography.caption-bold}`，圆角 `{rounded.full}`，内边距 `2px 8px`。

**`badge-required`**——文档属性行上的红色“必填”标签。
- 背景 `{colors.brand-error}`，文字 `{colors.on-dark}`，排版 `{typography.micro-uppercase}`，圆角 `{rounded.sm}`，内边距 `2px 6px`。

**`badge-type`**——文档中的类型签名片（如 `string`、`number`、`boolean`）。
- 背景 `{colors.surface}`，文字 `{colors.steel}`，排版 `{typography.code-sm}`，圆角 `{rounded.sm}`，内边距 `2px 6px`。

**`badge-tag`**——文档标签片（如正文中高亮的 `<Tabs>` 引用）。
- 背景 `rgba(55, 114, 207, 0.15)`，文字 `{colors.brand-tag}`，排版 `{typography.caption-bold}`，圆角 `{rounded.sm}`，内边距 `2px 8px`。

**`promo-banner`**——顶部导航**上方**吸附的黑色促销条带（存在时）。
- 背景 `{colors.canvas-dark}`，文字 `{colors.on-dark}`，排版 `{typography.body-sm-medium}`，内边距 `{spacing.sm} {spacing.md}`。

### 代码

**`code-block`**——语法高亮代码容器。
- 背景 `{colors.surface-code}`，文字 `{colors.on-dark}`，排版 `{typography.code-md}`，圆角 `{rounded.md}`，内边距 `{spacing.md}`。

**`code-block-header`**——代码上方标题栏，含语言标签 + 复制按钮。
- 背景 `{colors.surface-code}`，文字 `{colors.on-dark-muted}`，排版 `{typography.caption}`，内边距 `{spacing.xs} {spacing.md}`，底部边框 `1px solid {colors.hairline-dark}`。

**`code-inline`**——正文中的行内 `<Tabs>` 引用。
- 背景 `{colors.surface}`，文字 `{colors.charcoal}`，排版 `{typography.code-inline}`，圆角 `{rounded.xs}`，内边距 `2px 6px`，边框 `1px solid {colors.hairline}`。

**`copy-code-button`**——代码块标题栏中的“复制代码”按钮。
- 透明背景，文字 `{colors.on-dark-muted}`，排版 `{typography.caption}`，圆角 `{rounded.sm}`，内边距 `{spacing.xxs} {spacing.xs}`，边框 `1px solid {colors.hairline-dark}`。

### 文档组件

**`property-row`**——API 属性文档行（如 Tabs 页的 `defaultIndex`）。
- 透明背景，文字 `{colors.ink}`，排版 `{typography.body-sm}`，内边距 `{spacing.md} 0`，底部边框 `1px solid {colors.hairline-soft}`。
- 布局：属性名 `{typography.code-inline}` + 类型徽标 + 可选必填徽标 + 下方描述 `{typography.body-sm}` `{colors.steel}`。

**`feature-comparison-table`**——详细的定价页功能对比表。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，圆角 `{rounded.md}`，边框 `1px solid {colors.hairline}`。

**`feature-comparison-row`**——对比表内单行。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，内边距 `{spacing.md} {spacing.lg}`，底部边框 `1px solid {colors.hairline-soft}`。分区分隔采用 `{typography.micro-uppercase}` `{colors.steel}`。

**`sidebar-nav-item`** + **`sidebar-nav-item-active`**——文档左侧栏链接条目。
- 非活动：透明背景，文字 `{colors.steel}`，排版 `{typography.body-sm}`，圆角 `{rounded.sm}`，内边距 `{spacing.xs} {spacing.md}`。
- 活动：背景 `{colors.surface}`，文字 `{colors.ink}`，排版 `{typography.body-sm-medium}`。

**`sidebar-section-header`**——侧栏内大写分区标题（如“组件”“基础组件”）。
- 透明背景，文字 `{colors.steel}`，排版 `{typography.micro-uppercase}`，内边距 `{spacing.md} {spacing.md} {spacing.xs}`。

**`doc-toc-item`** + **`doc-toc-item-active`**——右侧栏目录链接。
- 非活动：透明背景，文字 `{colors.steel}`，排版 `{typography.body-sm}`，内边距 `{spacing.xxs} 0`。
- 活动：文字 `{colors.ink}`，排版 `{typography.body-sm-medium}`，可选 `{colors.brand-green}` 左边框强调。

### 导航

**顶部导航（营销）**——吸附白色栏，包含标志、链接列表及右侧 CTA。
- 背景 `{colors.canvas}`，高约 64px，底部边框 `1px solid {colors.hairline-soft}`。
- 左侧：Mintlify 字标 + 水平链接列表（解决方案、定价、客户、文档、更新日志）。
- 右侧：次要“联系销售” + 黑色胶囊“开始使用”。

**顶部导航（文档）**——紧凑导航，中央搜索胶囊，右侧账户/升级 CTA。
- 背景 `{colors.canvas}`，高约 56px。搜索胶囊居中，右侧“文档 / 指南 / API 参考 / 更新日志”链接 + “联系我们” + 绿色“开始使用”。

### 标志性组件

**`hero-band-sky`**——首页首屏，带氛围天蓝到奶油渐变及云朵插图。
- 背景渐变 `linear-gradient(180deg, {colors.hero-sky-from} 0%, {colors.hero-sky-to} 100%)`，文字从渐变前段的 `{colors.on-dark}` 向下方 `{colors.ink}` 转换，内边距 `{spacing.hero}`。
- 布局：居中首屏标题 `{typography.hero-display}`、居中副标题 `{typography.subtitle}`、居中按钮行（`button-accent-green`“开始使用” + `button-secondary`“联系我们”），按钮下方产品模拟图。

**`hero-band-dark`**——初创企业首屏，带深青绿到薄荷渐变及火箭发射插图。
- 背景渐变 `linear-gradient(135deg, {colors.hero-dark-from} 0%, {colors.hero-dark-to} 100%)`，文字 `{colors.on-dark}`，内边距 `{spacing.hero}`。
- 布局：左侧首屏标题 `{typography.hero-display}` `{colors.on-dark}`，右侧插图（火箭穿过渐变），按钮行使用 `button-on-dark`（白胶囊）+ 幽灵链接。

**`hero-product-mockup`**——首页首屏内加框的代码编辑器模拟图。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，边框 `1px solid {colors.hairline-soft}`，深阴影 `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px`。
- 内部承载文档页预览（左侧栏、正文、模拟 UI 控件）。

**`logo-wall-item`**——六列信任行网格中的客户标志单元（“Anthropic / Cognition / Mintlify / Vercel / react / Lovable”，“Stripe / Block / PayPal / Compound / Auth”）。
- 透明背景，文字 `{colors.steel}`，排版 `{typography.body-md-medium}`，内边距 `{spacing.lg}`。
- 标志呈字标，统一垂直居中。

**`faq-accordion-item`**——常见问题面板项（定价页可见）。
- 背景 `{colors.canvas}`，圆角 `{rounded.md}`，内边距 `{spacing.xl}`，边框 `1px solid {colors.hairline-soft}`。
- 问题 `{typography.heading-5}`，展开答案 `{typography.body-md}` `{colors.steel}`，尖括号箭头图标 `{colors.steel}` 16px。

**`footer-region`**——多列网站页脚。
- 背景 `{colors.canvas}`，顶部边框 `1px solid {colors.hairline}`，内边距 `{spacing.section} {spacing.xxl}`。
- 5 组栏目（探索 / 资源 / 公司 / 法律 + 品牌标记列）。
- 分区标题 `{typography.body-sm-medium}` `{colors.ink}`，链接项 `{typography.body-sm}` `{colors.steel}`。

**`footer-link`**——页脚中单个链接条目。
- 透明背景，文字 `{colors.steel}`，排版 `{typography.body-sm}`，内边距 `{spacing.xxs} 0`。

## 应做与不应做

### 应做
- `{colors.brand-green}`（Mintlify 薄荷）仅保留给强调 CTA 及活动状态指示——每个视口哪怕只有一个强调按钮，也足够有分量
- 浅色背景以 `{colors.primary}`（黑）为主导 CTA；深色首屏带改用 `button-on-dark`（白胶囊）
- 每个按钮及胶囊都应用 `{rounded.full}`；绝不改变胶囊角部柔化程度
- Inter（UI 文字）搭配 Geist Mono（代码）——绝不引入第三套字体
- 克制使用氛围渐变首屏带（仅首页及初创企业页）；深层表面保持平面、密集
- 卡片一致应用 `{rounded.lg}`（12px）；`{rounded.md}`（8px）仅用于搜索胶囊、代码块等紧凑 UI
- 文档正文保持 `{typography.body-md}`（16px）、1.50 行高——绝不压缩

### 不应做
- 不要将 `{colors.brand-green}` 用于正文或大面积表面——会失去信号作用
- 不要引入薄荷、标签蓝、错误红及证言橙之外的其他强调色
- 不要给平面文档卡片加厚重阴影；抬升保留给首屏产品模拟图
- 不要将文档行高降到 1.50 以下——长篇可读性会受损
- 不要在同一首屏将氛围渐变与多种竞争强调色组合——天空/深色渐变是品牌情绪；让它呼吸
- 不要用 Inter 排代码，或 Geist Mono 排正文——字体分工**就是**品牌语气

## 响应式行为

### 断点
| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 手机（小） | < 480px | 单列。首屏缩至 36px。胶囊导航收起为汉堡菜单。定价档位单列堆叠。页脚单列折叠面板。 |
| 手机（大） | 480 – 767px | 与小型手机相同，但功能块每行 2 个。首屏缩至 44px。 |
| 平板 | 768 – 1023px | 双列功能网格。胶囊标签导航恢复。文档侧栏收起为抽屉。首屏缩至 56px。 |
| 桌面 | 1024 – 1279px | 完整三列文档网格（侧栏 / 正文 / 目录）。3 档定价卡片行。首屏 72px。 |
| 宽屏桌面 | ≥ 1280px | 首屏两侧间距更宽、产品模拟图更大、侧栏固定 240px。 |

### 触控目标
- 胶囊按钮有效高度 36–40px——移动端通过内边距覆盖提高至 44px
- 圆形图标按钮：桌面 32×32px → 移动端 44×44px
- 表单输入框高 40px；移动端提高到 44px
- 侧栏导航项约高 32px——移动抽屉中提高到 44px

### 收缩策略
- **促销横幅**保持全宽；< 480px 时截断
- **顶部导航**低于 1024px 时收起为汉堡菜单；水平链接移入抽屉
- **首屏带**：双列首屏（文字 + 模拟图）在 < 1024px 时变为堆叠；移动端模拟图呈现在文字下方
- **文档网格**：桌面三列 → < 1024px 时侧栏抽屉 → < 768px 时单列
- **定价对比**：三列档位 → < 768px 时单列堆叠；对比表水平滚动
- **首屏排版**：`{typography.hero-display}`（72px）→ 平板 56px → 大型手机 44px → 小型手机 36px
- **客户标志墙**：每行 6 个 → 平板 3 个 → 手机 2 个
- **页脚**：桌面 5 列 → 平板 2 列 → 手机折叠面板

### 图像行为
- 首屏插图（云、火箭）随首屏带懒加载；所有断点均保持清晰（基于 SVG）
- 产品模拟图跨断点保持宽高比；按比例缩放
- 客户标志使用 SVG 字标；视网膜显示屏上保持清晰

## 迭代指南

1. 每次聚焦一个组件。系统内部一致性很高。
2. 直接引用组件名及令牌（`{colors.primary}`、`{component-name}-pressed`、`{rounded.full}`）——不要改述。
3. 编辑后运行 `npx @google/design.md lint DESIGN.md`，捕获断裂引用及对比度问题。
4. 新变体作为独立 `components:` 条目加入（`-pressed`、`-disabled`、`-focused`、`-active`）。
5. 正文默认 `{typography.body-md}`，强调默认 `{typography.subtitle}`。标题逐级为 `hero-display → display-lg → heading-1 → heading-2 → heading-3 → heading-4 → heading-5`。
6. 将 `{colors.brand-green}` 限定于强调时刻。如果出现在普通表面上，询问它是否值得承担这一角色。
7. 按钮始终胶囊形（`{rounded.full}`）；在这套语言中，方形按钮意味着“第三方组件”。
8. 文档正文应为 `{typography.body-md}` 16px、1.50 行高——任何更密集处理都会破坏阅读体验。

## 已知缺口

- 这些页面未呈现画布、表面、文字及细线的具体深色模式令牌值；品牌尚未交付公开深色模式色板
- 未提取动画/过渡时长；建议悬停/焦点状态过渡使用 150–200ms ease
- 默认状态之外未明确捕获表单校验成功状态——按标准绿色边框 + 成功徽标模式实现
- 文档内代码语法高亮色板未正式定义；文档示例带有自己的 twoslash 式注释系统令牌（如 `{colors.brand-tag}`、`{colors.brand-annotate}`、`{colors.brand-warn}`），但未列出完整高亮方案
