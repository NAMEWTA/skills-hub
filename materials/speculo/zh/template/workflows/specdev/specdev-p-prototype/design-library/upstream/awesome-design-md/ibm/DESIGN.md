---
version: alpha
name: IBM-design-analysis
description: "忠实于 Carbon Design System 的企业营销画布：白色表面、炭灰文字、IBM 蓝（#0f62fe）作为唯一坚定的强调色，以及有意平直方正、圆角保持 0–4px 的美学。文字采用 IBM Plex Sans：展示字号使用品牌标志性的轻字重 300，正文及强调使用 400/600。卡片为无阴影的细边框块；分区通过细微灰色行分隔。界面方正，排版轻盈，系统唯一色彩是一种有力的蓝色——形成将传统企业庄重感重构于云时代的观感。"

colors:
  primary: "#0f62fe"
  on-primary: "#ffffff"
  ink: "#161616"
  ink-muted: "#525252"
  ink-subtle: "#8c8c8c"
  canvas: "#ffffff"
  surface-1: "#f4f4f4"
  surface-2: "#e0e0e0"
  inverse-canvas: "#161616"
  inverse-surface-1: "#262626"
  inverse-ink: "#ffffff"
  inverse-ink-muted: "#c6c6c6"
  hairline: "#e0e0e0"
  hairline-strong: "#161616"
  blue-60: "#0043ce"
  blue-80: "#002d9c"
  blue-hover: "#0050e6"
  semantic-success: "#24a148"
  semantic-warning: "#f1c21b"
  semantic-error: "#da1e28"
  semantic-info: "#0f62fe"

typography:
  display-xl:
    fontFamily: IBM Plex Sans
    fontSize: 76px
    fontWeight: 300
    lineHeight: 1.17
    letterSpacing: -0.5px
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 60px
    fontWeight: 300
    lineHeight: 1.17
    letterSpacing: -0.4px
  display-md:
    fontFamily: IBM Plex Sans
    fontSize: 42px
    fontWeight: 300
    lineHeight: 1.20
    letterSpacing: 0
  headline:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0
  card-title:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  subhead:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  body:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0.16px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: 0.16px
  body-emphasis:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: 0.16px
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0.32px
  button:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: 0.16px
  eyebrow:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: 0.16px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  pill: 9999px
  full: 9999px

spacing:
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
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-primary-pressed:
    backgroundColor: "{colors.blue-80}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-danger:
    backgroundColor: "{colors.semantic-error}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 24px
  feature-card-elevated:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 24px
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 32px
  hero-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.none}"
    padding: 48px
  cta-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: 48px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  text-input-error:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  newsletter-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  product-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 16px 20px
  product-tab-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-emphasis}"
    rounded: "{rounded.none}"
    padding: 16px 20px
  resource-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 16px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: 24px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    height: 48px
  utility-bar:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    height: 32px
  footer:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px 32px
---

## 概览

IBM 的营销系统忠实应用 **Carbon Design System**——IBM 的开源企业设计系统。主导表面是纯白 `{colors.canvas}`，以浅灰 `{colors.surface-1}` 表现抬升，炭灰 `{colors.ink}`（#161616）用于文字，IBM 蓝 `{colors.primary}`（#0f62fe）是唯一品牌强调色。

决定性选择是**平直几何**：每个 CTA、每张卡片、每个输入框及容器均采用直角（`{rounded.none}` 0px）及细薄的 1px 边框。没有圆润胶囊，没有柔和阴影，没有氛围渐变。这套系统重在工程构建，而非风格化装饰。

**IBM Plex Sans** 承载整个文字层级。展示字号（76 / 60 / 42px）采用字重 **300**——IBM 标志性的轻量展示处理，让 76px 文字比竞争品牌 700 字重的展示文字显得更平静。正文为字重 400，配 `letter-spacing: 0.16px`（Carbon 的精确细节）及 1.50 行高。整体表达细致、技术化且值得信任。

系统很少诉诸色彩——IBM 蓝标识链接、主要 CTA，及少量满幅 CTA 横幅。非白色的其他表面都由炭灰承担。结果既有企业级庄重感，又没有企业式僵硬：严谨、轻字重、有意克制。

**关键特征：**
- **Carbon Design System**——IBM 营销界面本身就是 Carbon。按钮是方的，输入框是带底线的方形，圆角保持 0px。
- **轻字重展示文字**：42–76px 标题使用 Plex Sans 300 字重，是品牌的排版标志。
- **一种强调色**：`{colors.primary}` IBM 蓝承载所有链接、主要 CTA 及 CTA 横幅。不存在第二种品牌色。
- 白色画布 + 浅灰（`{colors.surface-1}`）+ 炭灰（`{colors.ink}`）覆盖 95% 的表面。
- 页脚反转为炭灰（`{colors.inverse-canvas}` #161616）——页面断开之前唯一的深色表面。
- 卡片层级通过 1px 细线及表面变化承载，绝不用投影。
- 正文的 `letter-spacing: 0.16px` 是 Carbon 精确细节——微小正字距是品牌语气的一部分。
- 页面节奏：工具栏 → 顶部导航 → 轻字重标题首屏 → 功能卡片网格 → 客户标志滚动展示 → 企业功能行 → 培训分区 → 新闻通讯 / 登录 CTA → 深色页脚。

## 颜色

> 来源页面：ibm.com（首页）、/software/ai-productivity、/consulting、/products/cloud-pak-for-aiops、/products/bare-metal-servers、community.ibm.com。

### 品牌与强调
- **IBM 蓝**（{colors.primary}）：唯一品牌强调色。链接、主要 CTA、CTA 横幅背景、焦点环。
- **蓝 60**（{colors.blue-60}）：链接悬停状态。
- **蓝 80**（{colors.blue-80}）：主要按钮按下状态。
- **悬停蓝**（{colors.blue-hover}）：主要按钮悬停状态。

### 表面
- **画布**（{colors.canvas}）：默认页面背景。
- **表面 1**（{colors.surface-1}）：浅灰（#f4f4f4）——输入字段、隔行条纹、细微分区带。
- **表面 2**（{colors.surface-2}）：略深灰（#e0e0e0）——禁用字段、用作分隔填色的细线色。
- **细线**（{colors.hairline}）：卡片、输入框、分隔线的 1px 边框。
- **强细线**（{colors.hairline-strong}）：聚焦输入框上的 1px 炭灰下划线（Carbon 标志性焦点处理）。
- **反色画布**（{colors.inverse-canvas}）：炭灰 #161616——页脚表面。
- **反色表面 1**（{colors.inverse-surface-1}）：比反色画布浅一级——页脚栏间分隔、悬停页脚项。

### 文字
- **主文字色**（{colors.ink}）：所有标题及强调正文——炭灰 #161616。
- **弱化文字色**（{colors.ink-muted}）：次要文字 #525252——元信息、副标题、页脚正文。
- **轻淡文字色**（{colors.ink-subtle}）：第三级文字 #8c8c8c——禁用状态、辅助文字、说明文字。
- **反色文字**（{colors.inverse-ink}）：炭灰上的白色——页脚标题。
- **弱化反色文字**（{colors.inverse-ink-muted}）：炭灰上的浅灰——页脚正文。

### 语义
- **成功绿**（{colors.semantic-success}）：Carbon green-50——成功状态。
- **警告黄**（{colors.semantic-warning}）：Carbon yellow-30——警告状态。
- **错误红**（{colors.semantic-error}）：Carbon red-60——错误状态；危险操作按钮背景。
- **信息蓝**（{colors.semantic-info}）：与主色相同——信息徽标。

## 排版

### 字体家族

- **IBM Plex Sans**——IBM 自有的开源字体（任何用途均免费）。几何化，略带人文感，专为企业 UI 设计。后备字体：`Helvetica Neue, Arial, sans-serif`。

同一家族承载展示、正文及说明文字——不搭配另一套展示/正文字体。层级依靠**字号 + 字重**，而非字体家族变化。Plex Sans 也按 SIL Open Font License 免费 / 开源——使其成为本列表中实现时最容易采用的定制字体。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 76px | 300 | 1.17 | -0.5px | 最大首屏标题 |
| `{typography.display-lg}` | 60px | 300 | 1.17 | -0.4px | 分区开场标题 |
| `{typography.display-md}` | 42px | 300 | 1.20 | 0 | 子分区标题、首屏卡片标题 |
| `{typography.headline}` | 32px | 400 | 1.25 | 0 | 卡片集合标题、FAQ 分类 |
| `{typography.card-title}` | 24px | 400 | 1.33 | 0 | 功能卡片标题 |
| `{typography.subhead}` | 20px | 400 | 1.40 | 0 | 展示标题旁的引导正文 |
| `{typography.body-lg}` | 18px | 400 | 1.50 | 0 | 首屏副标题、引导段落 |
| `{typography.body}` | 16px | 400 | 1.50 | 0.16px | 默认正文 |
| `{typography.body-sm}` | 14px | 400 | 1.29 | 0.16px | 卡片正文、页脚栏目 |
| `{typography.body-emphasis}` | 14px | 600 | 1.29 | 0.16px | 选中标签页标签、强调正文行 |
| `{typography.caption}` | 12px | 400 | 1.33 | 0.32px | 说明、元信息、工具栏 |
| `{typography.button}` | 14px | 400 | 1.29 | 0.16px | 所有按钮标签 |
| `{typography.eyebrow}` | 14px | 400 | 1.29 | 0.16px | 分区眉题（Carbon 避免强烈眉题；使用句首大写的 14px 文字） |

### 原则

- **轻字重展示文字就是品牌语气。** Plex Sans 300 字重的 76px 标题呈现低调权威——换成 700 就会像其他所有企业网站。
- 正文字号的 **Carbon `letter-spacing: 0.16px`** 是精确细节。不要移除。
- 营销表面**不使用等宽字体**（有 Plex Mono，但只存在于产品表面）。
- **眉题排版使用句首大写的 14px 文字**——Carbon 避免其他企业品牌常见的全大写加字距眉题。
- **展示行高收紧，正文行高放松**：display-xl 为 1.17，正文为 1.50——与字号成比例。

### 替代字体说明

IBM Plex Sans **免费且开源**（SIL OFL 许可），可从 Google Fonts 获取。推荐实现直接使用它。若有更广泛的排版需求，Plex 家族还包括 Plex Mono 和 Plex Serif。

## 布局

### 间距系统

- **基础单位**：4px（Carbon 标志性的 4 像素网格）。
- **令牌（头部元数据）**：`{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px。
- 卡片内部内边距：功能卡片用 `{spacing.lg}` 24px；产品卡片用 `{spacing.xl}` 32px；首屏卡片及 CTA 横幅用 `{spacing.xxl}` 48px。
- 按钮内边距：垂直 12px · 水平 16px——Carbon 规格。
- 表单输入框内边距：垂直 11px · 水平 16px。

### 网格与容器

- 桌面使用 Carbon 16 列网格，平板 / 手机缩为 8 / 4 列。
- 最大内容宽度约 1584px（Carbon 最大网格断点）。
- 卡片网格：桌面每行 4 个，平板 2 个，手机 1 个。
- 客户标志滚动展示采用 flex 行中的固定宽度块，小视口下水平滚动。

### 留白理念

Carbon 将精确对齐 4 像素网格作为留白系统。分区通过薄灰色行（`{colors.surface-1}`）而非巨大垂直间隙分隔。内容有意密集——IBM 客户希望页面上有很多信息，而非很多空白。

## 层叠高度与纵深

| 层级 | 处理方式 | 用途 |
|---|---|---|
| 0（平面） | 无阴影、无边框 | 正文、首屏文字、页脚正文的默认方式 |
| 1（细线） | 画布上的 1px `{colors.hairline}` 边框 | 功能卡片、输入框、列表项 |
| 2（表面抬升） | 画布上的 `{colors.surface-1}` 背景 | 隔行横幅、悬停卡片 |
| 3（焦点环） | 2px `{colors.primary}` 轮廓 + 1px `{colors.hairline-strong}` 下划线 | 聚焦的输入框、聚焦的按钮 |

Carbon 在营销中避免投影——纵深靠表面变化和 1px 细线承载。产品 / 应用表面是例外（Carbon 为浮起面板记录了阴影令牌），但营销网站几乎不用。

### 装饰性纵深

- 某些首屏插图后有**柔和蓝色渐变背景**——微弱的蓝到白色晕染，让画布更有温度，又不与标题竞争。
- **没有氛围纵深。** 没有聚光卡片，没有柔和色块分区，没有渐变面板。

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.none}` | 0px | 默认——每个按钮、卡片、输入框、容器 |
| `{rounded.xs}` | 2px | 小徽标（少见例外） |
| `{rounded.sm}` | 4px | 方形化头像、下拉菜单 |
| `{rounded.md}` | 6px | （很少使用；为完整性记录） |
| `{rounded.lg}` | 8px | （很少使用；为完整性记录） |
| `{rounded.pill}` | 9999px | 产品 UI 中的状态胶囊、徽标（营销中少见） |

品牌坚持平直的 0px 角。其他令牌为产品 / 移动表面而存在，营销中很少出现。

### 摄影与插图几何

- IBM 交替使用摄影（人物、硬件、跑车）和抽象插图（几何网格、点阵图案）。
- 图像边框平直——无圆角。
- 客户标志块置于 `{rounded.none}` 0px 块上，带细薄的 1px 边框。

## 组件

### 按钮

**`button-primary`**——蓝色实心 CTA。所有页面默认的主要按钮。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.button}`，内边距 12px 16px，圆角 `{rounded.none}`。
- 按下状态由 `button-primary-pressed` 承载（背景变为 `{colors.blue-80}`）。

**`button-secondary`**——炭灰实心按钮——Carbon 的“次要”处理。
- 背景 `{colors.ink}`，文字 `{colors.inverse-ink}`，排版 `{typography.button}`，内边距 12px 16px，圆角 `{rounded.none}`。

**`button-tertiary`**——白色按钮配蓝色 1px 边框 + 蓝字。用于第三级 CTA。
- 背景 `{colors.canvas}`，文字 `{colors.primary}`，排版 `{typography.button}`，圆角 `{rounded.none}`，内边距 12px 16px。（实现中的边框：1px `{colors.primary}`。）

**`button-ghost`**——纯文字 + 尖括号箭头，悬停前无背景。
- 背景 `{colors.canvas}`，文字 `{colors.primary}`，排版 `{typography.button}`，圆角 `{rounded.none}`，内边距 12px 16px。

**`button-danger`**——Carbon 的破坏性操作变体。
- 背景 `{colors.semantic-error}`，文字 `{colors.on-primary}`，排版 `{typography.button}`，圆角 `{rounded.none}`，内边距 12px 16px。

### 卡片与容器

**`feature-card`**——首页和产品页的默认功能亮点块。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.none}`，内边距 24px。以 1px `{colors.hairline}` 描边。

**`feature-card-elevated`**——相同形状置于 `{colors.surface-1}` 底色上——用于最新内容轮播中的“推荐”卡片。
- 背景 `{colors.surface-1}`，其他结构相同。

**`product-card`**——较大的产品展示块。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.none}`，内边距 32px。

**`hero-card`**——首屏构图卡片，包含轻字重标题、正文及 CTA。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.display-md}`，圆角 `{rounded.none}`，内边距 48px。

**`cta-banner`**——页面底部附近的全宽蓝色 CTA 面板。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.headline}`，圆角 `{rounded.none}`，内边距 48px。

**`resource-tile`**——较小的文章 / 案例块。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，圆角 `{rounded.none}`，内边距 16px。

**`customer-logo-tile`**——首页客户滚动展示中的单个块（Ferrari、Pfizer 等）。
- 背景 `{colors.canvas}`，文字 `{colors.ink-muted}`，排版 `{typography.caption}`，圆角 `{rounded.none}`，内边距 24px。1px 细线边框。

### 输入框与表单

**`text-input`** + **`text-input-focused`** + **`text-input-error`**——Carbon 输入框界面。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.none}`，内边距 11px 16px。
- 聚焦状态将底部 1px 细线替换为 2px `{colors.primary}` 下划线（Carbon 标志性焦点处理）。
- 错误状态添加 2px `{colors.semantic-error}` 底部下划线。

**`newsletter-input`**——首页“保持联系”的新闻通讯订阅输入。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.none}`，内边距 11px 16px。相邻提交按钮为 `button-primary`。

### 标签页

**`product-tab`** + **`product-tab-selected`**——产品页及首页“推荐”轮播中的水平标签页条。
- 默认：`{colors.canvas}` 背景，`{colors.ink-muted}` 文字，圆角 `{rounded.none}`，内边距 16px 20px。底部 1px 细线。
- 选中：`{colors.canvas}` 背景，`{colors.ink}` 文字，`{typography.body-emphasis}` 字重，底部 2px `{colors.primary}` 下划线。内边距 / 圆角相同。

### 导航

**`top-nav`**——吸附白色栏，左侧 IBM 图形标志，中央导航分类，右侧搜索 / 登录图标。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，高度 48px。底部 1px 细线。

**`utility-bar`**——顶部导航上方的细窄灰色条带，包含地区切换、联系及搜索快捷入口。
- 背景 `{colors.surface-1}`，文字 `{colors.ink-muted}`，排版 `{typography.caption}`，高度 32px。

### 页脚

**`footer`**——炭灰页脚（`{colors.inverse-canvas}`），左侧 IBM 字标，另有 5–6 列说明字号的链接。页面断开之前唯一的反色表面。
- 背景 `{colors.inverse-canvas}`，文字 `{colors.inverse-ink-muted}`，排版 `{typography.body-sm}`，内边距 64px 32px。

## 应做与不应做

### 应做

- 每个 CTA、卡片、输入框及容器均使用 `{rounded.none}` 0px。平直方正的美学就是品牌。
- 展示字号（42px+）使用 Plex Sans 300 字重，正文配 400。克制加粗标题的冲动。
- 将 `{colors.primary}` IBM 蓝保留给主要 CTA、链接、聚焦输入框下划线和 CTA 横幅。不作为卡片背景或眉题颜色。
- 正文字号应用 `letter-spacing: 0.16px`。这是 Carbon 的精确细节，也是排版语气的一部分。
- 通过表面变化（`canvas` → `surface-1`）和 1px 细线建立卡片层级。不加投影。
- 眉题和分区标签坚持句首大写——Carbon 避免全大写加字距。
- 仅在页脚反转为 `{colors.inverse-canvas}`；页面其余部分保持浅色。

### 不应做

- 不要给按钮、卡片或输入框加圆角。即使 4px 圆角也会破坏 Carbon 外观。
- 不要加粗展示标题。Plex Sans 300 字重就是品牌语气；700 字重会显得普通。
- 除文档所述柔和蓝色首屏渐变外，不要添加氛围纵深（渐变背景、投影、氛围覆盖层）。
- 不要引入第二种品牌色。IBM 蓝是唯一彩色强调色；状态语义使用文档所列绿 / 黄 / 红。
- 不要在未保留 `letter-spacing: 0.16px` 和展示字重 300 处理的情况下，将 IBM Plex Sans 替换为 Inter 或 Helvetica。
- 不要使用胶囊形按钮。Carbon 用直角；胶囊会呈现另一种品牌。
- 不要写全大写加字距眉题。Carbon 的眉题为 14px 句首大写。

## 响应式行为

### 断点

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 最大 | 1584px | Carbon 最大网格；栏间距扩展 |
| 超大桌面 | 1312px | 默认桌面布局 |
| 桌面 | 1056px | 卡片网格保持每行 4 个 |
| 平板 | 672px | 卡片网格每行 4 个 → 2 个；导航变为汉堡菜单 |
| 手机 | 320px | 单列；display-xl 从 76px → 约 32px |

### 触控目标

- Carbon 规格：最小点击目标 48px。触控视口中的按钮及输入框保持 48px。
- 顶部导航链接在触控设备上的点击高度从 36px 增至 48px。
- 标签页条各行保持 48px 点击高度。

### 收缩策略

- **顶部导航**：低于 672px 时，链接收起为汉堡覆盖层。图形标志和搜索图标留在栏内。
- **工具栏**：低于 672px 时隐藏，以回收垂直空间。
- **卡片网格**：每行 4 个 → 1056px 时 2 个 → 低于 672px 时 1 个。
- **展示文字**：`{typography.display-xl}` 76px 在移动端向 42px 缩放，同时保留字重 300 的处理。
- **页脚**：6 列链接网格 → 平板 3 列 → 手机 1 列。

### 图像行为

- 滚动展示中的客户标志保持宽高比，在低于 672px 时可收缩为两行滚动。
- 首屏插图按比例缩放；低于 672px 时，可堆叠在标题上方而非并排放置。

## 迭代指南

1. 每次聚焦一个组件，使用其 `components:` 令牌名称引用。
2. 正文默认为 `{typography.body}`，字重 400，配 `letter-spacing: 0.16px`。不要移除字距。
3. 引入新分区时，决定放在 `{colors.canvas}`（默认）还是 `{colors.surface-1}`（交替色带）上。双表面节奏就是整体节奏。
4. 编辑后运行 `npx @google/design.md lint DESIGN.md`。
5. 新变体以独立组件条目加入（`button-primary-pressed`、`text-input-error`、`text-input-focused`）。
6. 将 IBM 蓝视为稀缺资源：链接、主要 CTA、CTA 横幅、焦点下划线。超出这些用途就是偏离。
7. 抵制圆角。如果设计师要求 4px 圆角，品牌就在偏离 Carbon。

## 已知缺口

- IBM 产品表面（cloud-pak、watson、datacap）使用更丰富的 Carbon 组件（数据表格、图形单元格、面包屑、上下文菜单），这些未出现在所检查的营销页面中——组件存在于 Carbon 文档，而非本次营销提取中。
- Carbon 文档记录了表单字段错误及校验样式；所检查页面未呈现错误状态。
- Carbon 将深色模式记录为 Gray-100 主题，但这些营销页面不暴露它——仅页脚反色。完整深色主题是独立的 Carbon 色板，此处未提取。
- community.ibm.com 子域使用不同界面外框（社区平台白标），近似 Carbon 但不严格遵循——此处记录的系统适用于 ibm.com 主站。
