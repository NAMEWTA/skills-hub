---
version: alpha
name: Airbnb-design-analysis
description: 温暖、宽裕的消费市场平台，以干净白色画布和 Airbnb Rausch（#ff385c）为锚点；唯一鲜明的品牌色承载每个主要 CTA、搜索圆球按钮及评分圆点。文字使用适中字重的 Airbnb Cereal VF——展示文字为 22–28px、500/600 字重，而非金融科技和企业系统所用的厚重 700 以上字重；品牌相信摄影及宽裕留白，而非强势排版。三个产品入口（房源、体验、服务）位于顶部导航，配手绘风格 32 图标字形及“新品”徽标，传达市场扩展，而非功能堆砌。胶囊形搜索栏（`{rounded.full}`）、柔和圆角房源卡片（`{rounded.lg}` 约 14px）及 32px 按钮圆角呈现友善、人性化——除正文网格外，没有硬角。

colors:
  primary: "#ff385c"
  primary-active: "#e00b41"
  primary-disabled: "#ffd1da"
  primary-error-text: "#c13515"
  primary-error-text-hover: "#b32505"
  luxe: "#460479"
  plus: "#92174d"
  ink: "#222222"
  body: "#3f3f3f"
  muted: "#6a6a6a"
  muted-soft: "#929292"
  hairline: "#dddddd"
  hairline-soft: "#ebebeb"
  border-strong: "#c1c1c1"
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-card: "#ffffff"
  surface-strong: "#f2f2f2"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  legal-link: "#428bff"
  star-rating: "#222222"
  scrim: "#000000"

typography:
  display-xl:
    fontFamily: "'Airbnb Cereal VF', Circular, -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: 0
  display-lg:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: -0.44px
  display-md:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: 0
  display-sm:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.18px
  title-md:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  title-sm:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  rating-display:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1px
  body-md:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  caption:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0
  caption-sm:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.23
    letterSpacing: 0
  badge:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: 0
  micro-label:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: 0
  uppercase-tag:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 8px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0.32px
    textTransform: uppercase
  button-md:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  button-sm:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0
  link:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  nav-link:
    fontFamily: "'Airbnb Cereal VF', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 14px
  lg: 20px
  xl: 32px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 14px 24px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 13px 23px
    height: 48px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
  button-pill-rausch:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 10px 20px
  search-orb:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 48px
  icon-button-circle:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 32px
  icon-button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 40px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 80px
  product-tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
  product-tab-inactive:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav-link}"
  search-bar-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 14px 24px
    height: 64px
  search-field-segment:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    padding: 8px 24px
  category-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.button-sm}"
  category-tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.none}"
  property-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
  property-card-photo:
    rounded: "{rounded.md}"
  experience-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.md}"
  city-link-block:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
  rating-display-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.rating-display}"
  guest-favorite-badge:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  new-tag:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.uppercase-tag}"
    rounded: "{rounded.full}"
    padding: 2px 6px
  amenity-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 12px 0
  reviews-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  host-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 24px
  reservation-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  date-picker-day:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
  date-picker-day-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 12px
    height: 56px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: 48px 80px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  legal-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.caption-sm}"
---

## 概览

Airbnb 是宽裕、摄影主导的消费市场平台的典范。基础画布为**纯白**（`{colors.canvas}`——#ffffff），标题与正文使用深近黑文字色（`{colors.ink}`——#222222），唯一醒目的 **Rausch**（`{colors.primary}`——#ff385c）承载每个主要 CTA、搜索圆球按钮、心形收藏状态及行内品牌链接。主线营销没有第二种品牌色——**Luxe 紫**（`{colors.luxe}`——#460479）和 **Plus 品红**（`{colors.plus}`——#92174d）是子品牌强调色，仅在 Airbnb Luxe / Plus 语境内出现。

文字使用 **Airbnb Cereal VF**（Airbnb 获许可使用的定制可变字体），历史自有字体 **Circular** 作为后备，其下再配系统字体栈。Cereal 采用适中字重——展示标题为 22–28px、500–600 字重，而不是金融或企业系统偏爱的 700 以上厚重字重。首页首屏 h1（“为未来出游寻找灵感”）仅 28px / 700，在典型 SaaS 页面上会显小；这里却成立，因为布局依靠摄影（城市拼贴、房源卡片）而非强势排版提供视觉分量。

形状语言是**柔和的**。按钮圆角 8px（`{rounded.sm}`），房源卡片约 14px（`{rounded.md}`），搜索栏完全胶囊化（`{rounded.full}`），愿望单心形和搜索圆球为圆形（`{rounded.full}`），分类条圆角为 32px（`{rounded.xl}`）。除正文网格本身外，几乎没有硬角——每个交互元素都是圆润的。

**关键特征：**
- 单一强调色：`{colors.primary}`（#ff385c——“Rausch”）承载每个主要 CTA、搜索圆球、心形收藏状态及品牌字标。使用克制——大多数页面 90% 是白色 + 文字色，仅有一两处 Rausch。
- 定制可变字体：`Airbnb Cereal VF`。展示字重 500–700，正文 400。适中字重是有意安排——系统相信摄影能提供视觉重量。
- 三产品顶部导航：房源、体验、服务——各有手绘风格 32px 图标，较新的两个产品带“新品”徽标（`{component.new-tag}`）。活动标签页使用下划线（`{component.product-tab-active}`）。
- 胶囊形全局搜索栏：白色表面、完全圆润（`{rounded.full}`），以 1px 细线分成目的地 / 日期 / 人数片段，末端为圆形 Rausch 搜索球（`{component.search-orb}`）。
- 房源卡片照片优先：按宽高比构成的矩形，配 `{rounded.md}` 圆角裁切、可滑动图像轮播、左上悬浮“房客喜爱”徽标、右上心形图标，下方 4–5 行元信息。
- 编辑型下拉内容（页脚、语言选择器）是白色画布上的干净文字列——无卡片表面、无阴影。
- 系统将抬升限制在一级阴影（`box-shadow: rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.1) 0 4px 8px`）——用于悬停浮起卡片及搜索/账户下拉菜单。
- 8px 基础间距系统，主要分区为 `{spacing.section}`（64px）——宽裕但不至于像编辑杂志那样空旷；市场平台希望每次滚动看到更多卡片。

## 颜色

### 品牌与强调
- **Rausch**（`{colors.primary}`——#ff385c）：唯一品牌色。用于主要 CTA 背景（预订、继续）、搜索圆球、房源卡片心形收藏状态及行内品牌链接。消费旅游领域最具辨识度的颜色。
- **活动 Rausch**（`{colors.primary-active}`——#e00b41）：按下 / 指针按下变体——略更饱和。用于 `{component.button-primary-active}`。
- **禁用 Rausch**（`{colors.primary-disabled}`——#ffd1da）：用于禁用 CTA 的浅色调。
- **Luxe 紫**（`{colors.luxe}`——#460479）：Airbnb Luxe 子品牌强调色。仅出现在 Luxe 品牌表面——绝不用于主线营销。
- **Plus 品红**（`{colors.plus}`——#92174d）：Airbnb Plus 子品牌强调色。与 Luxe 同样限定范围——仅限子产品。

### 表面
- **画布**（`{colors.canvas}`——#ffffff）：每个公开页面的默认底色。Airbnb 公开网页没有深色模式。
- **柔和表面**（`{colors.surface-soft}`——#f7f7f7）：最浅填色——用于禁用字段、次级导航悬停背景及行内搜索筛选带。
- **较强表面**（`{colors.surface-strong}`——#f2f2f2）：略重填色——圆形图标按钮表面（如面包屑返回箭头及房源工具栏按钮）。

### 细线与边框
- **细线**（`{colors.hairline}`——#dddddd）：默认 1px 边框色——搜索栏分隔、表格分隔、页脚栏间分隔、卡片 1px 边框。
- **柔和细线**（`{colors.hairline-soft}`——#ebebeb）：更浅分隔色，用于长滚动编辑正文的分隔。
- **较强边框**（`{colors.border-strong}`——#c1c1c1）：较重描边，用于禁用描边按钮及聚焦后的表单输入框轮廓。

### 文字
- **主文字色**（`{colors.ink}`——#222222）：浅色表面的主导文字色。展示标题、正文段落、主要导航链接及大多数行内链接文字。绝非纯黑。
- **正文色**（`{colors.body}`——#3f3f3f）：次要连续正文色，用于长篇评论及设施文案中主文字色显得过重的场合。
- **弱化色**（`{colors.muted}`——#6a6a6a）：城市链接块副标题（“乡村小屋出租”“别墅出租”）、非活动产品标签页标签、页脚分类子标签、“查看全部”链接。
- **柔和弱化色**（`{colors.muted-soft}`——#929292）：禁用链接文字。极少使用。
- **星级评分色**（`{colors.star-rating}`——#222222）：与主文字色令牌相同——Airbnb 星形图标及“4.81”等评分数字都使用主文字色，而非黄/金色，这是有意的品牌选择（黄色星星在旅游语境中显得廉价）。
- **主色上文字**（`{colors.on-primary}`——#ffffff）：Rausch CTA 上的白色文字。

### 语义
- **错误**（`{colors.primary-error-text}`——#c13515）：表单校验行内错误文字。不同于 Rausch——更深、更饱和的红。
- **错误悬停**（`{colors.primary-error-text-hover}`——#b32505）：链接悬停时加深。
- **法律链接蓝**（`{colors.legal-link}`——#428bff）：法律文案中的行内链接（隐私、条款）。仅用于法律子条带。

### 遮罩
- **遮罩**（`{colors.scrim}`——#000000，50% 不透明度）：全局模态框背景色——日期选择器、登录对话框、语言选择器。存储基础十六进制色；不透明度在渲染时应用。

## 排版

### 字体家族
系统所有内容均使用 **Airbnb Cereal VF**——展示、正文、导航、说明、微文案。后备依次为 `Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`。**Circular** 是历史自有字体，仍保留为首个非可变后备；其后由系统字体栈支持。

没有独立的展示字体家族。可变字体承载整个字号刻度。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.rating-display}` | 64px | 700 | 1.1 | -1px | 房源详情评分展示（“4.81”） |
| `{typography.display-xl}` | 28px | 700 | 1.43 | 0 | 首页 h1（“为未来出游寻找灵感”） |
| `{typography.display-lg}` | 22px | 500 | 1.18 | -0.44px | 房源详情 h1（“靠近费特希耶 Aliyah Bali 海滩……”） |
| `{typography.display-md}` | 21px | 700 | 1.43 | 0 | 房源详情分区标题（“这里提供什么”） |
| `{typography.display-sm}` | 20px | 600 | 1.20 | -0.18px | 子分区标题（“须知事项”） |
| `{typography.title-md}` | 16px | 600 | 1.25 | 0 | 城市链接块标题（“威尔明顿”“雅典”） |
| `{typography.title-sm}` | 16px | 500 | 1.25 | 0 | 页脚栏标题（“支持”“出租房源”“Airbnb”） |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | 房源文案内默认连续正文 |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | 卡片元信息行、日期、价格、距离文字 |
| `{typography.caption}` | 14px | 500 | 1.29 | 0 | 搜索字段片段标签（“目的地”“日期”“人数”） |
| `{typography.caption-sm}` | 13px | 400 | 1.23 | 0 | 页脚法律行（“© 2026 Airbnb, Inc.”） |
| `{typography.badge}` | 11px | 600 | 1.18 | 0 | “房客喜爱”悬浮徽标文字 |
| `{typography.micro-label}` | 12px | 700 | 1.33 | 0 | 卡片设施微标签（“Inline 6”） |
| `{typography.uppercase-tag}` | 8px | 700 | 1.25 | 0.32px（大写） | 产品导航标签页“新品”徽标 |
| `{typography.button-md}` | 16px | 500 | 1.25 | 0 | 主要 CTA 按钮标签 |
| `{typography.button-sm}` | 14px | 500 | 1.29 | 0 | 胶囊按钮标签（分类条） |
| `{typography.link}` | 14px | 400 | 1.43 | 0 | 行内正文链接 |
| `{typography.nav-link}` | 16px | 600 | 1.25 | 0 | 顶部产品导航标签（房源、体验、服务） |

### 原则
展示字重保持适中。首页 h1 的 28px / 700 有意较小——藏在搜索栏下，让摄影及城市链接网格承载视觉层级。房源详情 h1 的 22px / 500 更安静；其上方房源照片横幅承担主要表达。

整个系统唯一在排版上高声突出的时刻，是房源页面的**评分展示**（`{typography.rating-display}`——64px / 700）。只有这里，系统信任文字独自承载层级——评分数字是最强信任信号，因此获得最醒目的处理。

### 替代字体说明
Airbnb Cereal VF 和 Circular 不可用时，**Inter** 是最接近的开源替代。将展示标题行高下调约 2%，匹配 Cereal 略紧的顶高；其余比例可以直接迁移。

## 布局

### 间距系统
- **基础单位：**4px（带 2px 微步长）。
- **令牌：**`{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px。
- **分区内边距（垂直）：**主要页面带为 `{spacing.section}`（64px）；比典型 SaaS 营销（80–96px）更紧，因为市场平台每次滚动需更高卡片密度。
- **卡片内部内边距：**`{component.host-card}` 和 `{component.reservation-card}` 为 `{spacing.lg}`（24px）；房源卡片元信息块为 `{spacing.base}`（16px）；说明 / 日期行间隙为 `{spacing.sm}`（8px）。
- **间隙：**首页城市网格卡片间 `{spacing.base}`（16px）；页脚栏间 `{spacing.lg}`（24px）；密集分类条分隔处 `{spacing.xs}`（4px）。

### 网格与容器
- **最大内容宽度：**首页及编辑页面约 1280px，居中。房源详情页上限更接近 1080px，以保持照片横幅及预订侧栏可读。
- **城市链接网格（首页页脚）：**桌面 6 列，每个单元格包含 `{typography.title-md}` 城市名及弱化 `{typography.body-sm}` 分类子标签。
- **房源详情：**双列，左侧照片 / 设施正文（约 64% 宽），右侧吸附预订卡片（`{component.reservation-card}`，约 32%）。
- **页脚：**桌面 3 列链接列表（支持 / 出租房源 / Airbnb），移动端收缩为 1 列。

### 留白理念
系统给予编辑带 64px 垂直呼吸空间，但压紧卡片网格——房源及城市链接卡片间仅 16px。对比是有意的：页面呈现“开阔首屏，下方密集市场”，强化市场平台属性，又不会在首屏压倒访客。

## 层叠高度

系统基本只有**一级阴影**，再加平面基线。

- **平面（无阴影）：**正文、首屏、页脚、所有编辑带——95% 的表面。
- **卡片悬停浮起：**`box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0`——用于指针悬停的房源卡片、静止搜索栏，以及下拉菜单（账户菜单、语言选择器、日期选择器）。这是全系统唯一阴影定义。
- **模态遮罩：**`{colors.scrim}` 以 50% 不透明度渲染——全局模态背景。用于日期选择器、登录对话框、语言选择器。

没有渐进式抬升层级——系统要么有这一级阴影，要么没有。纵深来自摄影、白上白的表面区分及圆角裁切，而非层层阴影。

## 组件

### 按钮

**`button-primary`**——Rausch 填色、白字、8px 圆角、14×24px 内边距、48px 高、字重 500。系统最常见 CTA：“预订”“继续”“搜索”，以及账户流程的主要操作。

**`button-primary-active`**——按下状态。背景改为 `{colors.primary-active}`。无变换，无阴影变化。

**`button-primary-disabled`**——#ffd1da 浅 Rausch 色，白字。光标为 not-allowed。

**`button-secondary`**——白色填色、主文字色文字及 1px 同色轮廓。8px 圆角。用于“保存”“取消”，以及 Rausch 表面上的反色 CTA。

**`button-tertiary-text`**——纯主文字色文字，无表面，无边框。悬停时加下划线。用于“显示更多”一类链接及模态框关闭标签。

**`button-pill-rausch`**——精选单元中的胶囊形 Rausch CTA（如“成为房东”子 CTA）——9999px 圆角、10×20px 内边距、14px 标签。

### 搜索表面

**`search-bar-pill`**——标志性全局搜索栏。白色填色、9999px 圆角、64px 高、1px 细线及 1px 阴影边框。内部以垂直细线分成 `{component.search-field-segment}` 单元（目的地 / 日期 / 人数）。每个片段在 `{typography.caption}` 占位行上方放置一个大写说明标签。

**`search-orb`**——搜索栏右端的圆形 Rausch 球。48×48px、完全圆形，白色放大镜图标居中。首页最强烈的一处色彩。

### 顶部导航

**`top-nav`**——白色表面、80px 高、底部 1px 细线。Airbnb 字标靠左，三个产品标签页（房源 / 体验 / 服务）正中，账户工具（房东链接、语言地球、账户菜单）靠右。

**`product-tab-active`**——`{typography.nav-link}` 主文字色标签，32px 手绘风格图标，图标与标签组合下方有 2px 主文字色下划线。

**`product-tab-inactive`**——弱化标签、插画图标、无下划线。点击后活动。

**`new-tag`**——图标右上锚定的微型圆润胶囊徽标（`{rounded.full}`），使用 `{typography.uppercase-tag}`（8px / 700、0.32px 字距、大写）显示“新品”。用于体验及服务，传达新近推出。

### 房源卡片

**`property-card`**——照片优先的卡片。图像宽高比 1:1，配 `{rounded.md}` 圆角裁切、叠加轮播圆点、左上悬浮“房客喜爱”徽标（`{component.guest-favorite-badge}`），右上心形图标（`{component.icon-button-circle}` 默认描边，收藏后 Rausch 填色）。图像下方为 4–5 行元信息——标题（`{typography.title-md}`）、距离 / 日期（弱化 `{typography.body-sm}`），以及右对齐价格（“每晚 $X”）。

**`property-card-photo`**——照片板本身，单独作为令牌，因为一些表面（愿望单、搜索结果）复用照片而不含元信息块。

**`experience-card`**——体验房源使用的较高比例卡片（4:5）。同样的 `{rounded.md}` 裁切，左上悬浮“新品”徽标，右上心形，下方单行标题。

**`guest-favorite-badge`**——白色圆润胶囊（`{rounded.full}`），11px / 600 字重。悬于照片上，使用系统唯一阴影层级表现抬升。

### 房源详情

**`rating-display-card`**——标志性房源详情场景。64px / 700 评分数字（“4.81”）左右配微型月桂花环 SVG 装饰。评分下为“房客喜爱”标语及一行主文字色统计列。全系统最强的排版分量。

**`amenity-row`**——设施图标 + 主文字色标签的单列列表，采用 `{typography.body-md}`。每行 12px 内边距，行间无边框；分区上下以 1px 细线分隔。

**`reviews-card`**——评论摘录双列网格。每列在 3 行摘录上方放作者行（头像、姓名、日期），并配“显示更多”第三级链接。

**`host-card`**——白色卡片，`{rounded.md}` 圆角及 24px 内边距，含房东头像、姓名、“超赞房东”徽标、回复率统计及“联系房东”`{component.button-secondary}`。

**`reservation-card`**——房源详情页右侧吸附卡片。白色表面、`{rounded.md}` 圆角、1px 细线边框、1px 阴影层级抬升、24px 内边距。包含：每晚价格（`{typography.display-md}` 主文字色）、日期范围选择器、房客人数步进器、全宽“预订”主要 CTA，以及下方以 `{typography.body-sm}` 呈现的费用明细堆叠。

### 日期选择器

**`date-picker-day`**——40×40px 圆形单元，用 `{typography.body-sm}` 显示日期数字。默认透明填色、主文字色文字。

**`date-picker-day-selected`**——主文字色填色、白字、完整圆形（`{rounded.full}`）。两个选中日期之间的范围状态采用连接两端的 `{colors.surface-soft}` 长圆背景。

### 表单

**`text-input`**——白色表面、1px 细线轮廓、`{rounded.sm}` 8px 圆角、56px 高、14×12px 内边距。上方堆叠标签（弱化 `{typography.caption}`），占位文字为弱化 `{typography.body-md}`。聚焦时边框加粗为 2px 主文字色，边框颜色改为 `{colors.ink}`——无辉光，无环。

### 页脚

**`footer-light`**——白色表面（与页面画布一致——Airbnb 没有对比页脚），48×80px 内边距。三列链接块（支持 / 出租房源 / Airbnb），间隔宽裕 24px。每列以 `{typography.title-sm}` 主文字色标签为标题，下方堆叠 `{component.footer-link}` 行，采用 `{typography.body-sm}` 主文字色。

**`legal-band`**——页脚各列下的底部条带，包含版权行、语言选择器（地球图标 + “英语（美国）”链接）、货币选择器及社交图标（Facebook、X、Instagram）。所有文字采用弱化 `{colors.muted}`，字号为 `{typography.caption-sm}`。

## 响应式行为

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 手机 | < 744px | 顶部导航收起为标志 + 汉堡菜单；产品标签页藏进面板；搜索栏收缩为单个可点击胶囊；房源卡片单列堆叠；城市网格 1 列；房源详情将预订卡片收缩为底部吸附栏。 |
| 平板 | 744–1128px | 顶部导航保留产品标签页，但搜索栏收窄；房源卡片每行 2 个；城市网格 2–3 列；预订卡片保持右侧吸附，但宽度缩小。 |
| 桌面 | 1128–1440px | 完整顶部导航，三个产品标签页居中；完整胶囊宽度搜索栏，3 个片段都可见；房源卡片每行 4 个；城市网格 6 列；房源详情双列，配预订侧栏。 |
| 宽屏 | > 1440px | 房源/搜索页面内容宽度上限为 1440px，编辑页面约 1280px；两侧边距吸收剩余空间。 |

### 触控目标
- 主要 CTA 最小 48×48px（高于 WCAG AAA）。
- 搜索圆球为 48×48px 圆形——页面点击最多的元素。
- 心形收藏按钮为 32×32px 圆形——处于 AAA 边缘，但照片卡片内宽裕的 12px 内边距予以补偿。
- 日期选择器日单元为 40×40px 圆形。

### 收缩策略
- 顶部产品标签页在低于 744px 时收起为汉堡面板。
- 搜索栏 3 个片段收缩为一次点击入口，在移动端打开全屏搜索覆盖层。
- 房源及城市链接网格在各断点清晰减少列数——不对行重排；始终减少列。
- 房源详情的预订卡片在移动端由右侧吸附栏变为底部吸附栏，仅保留“预订”CTA + 每晚价格摘要。

## 已知缺口

- **悬停状态颜色：**遵循全局不记录悬停的策略，有意不记录——Airbnb 房源卡片的实际 `:hover` 样式是细微抬升，但精确提取不可靠。
- **加载状态 / 骨架屏：**提取的表面中不可见。
- **地图视图样式：**搜索结果地图使用 Mapbox 着色图块及定制 Rausch 标记；此处未捕获。
- **表单输入错误状态：**已记录错误文字颜色（`{colors.primary-error-text}`），但捕获表面中看不到校验失败时完整输入框轮廓 + 辅助文字组合。
- **子品牌色板：**Luxe（`{colors.luxe}`）和 Plus（`{colors.plus}`）作为令牌记录，但完整子系统（排版覆盖、表面处理）存在于独立子域，此处未捕获。
