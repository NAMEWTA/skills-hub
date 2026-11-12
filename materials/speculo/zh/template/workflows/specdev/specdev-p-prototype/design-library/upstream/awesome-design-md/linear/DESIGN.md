---
version: alpha
name: Linear-design-analysis
description: "以 #010102 为基底、近黑且聚焦产品的营销画布（本集合所有工具中最深的深色表面），搭配浅灰文字（#f7f8f8），以 Linear 标志性的薰衣草蓝（#5e6ad2）作为唯一彩色强调色。系统呈现软件工艺文档的气质：密集、技术化、低调奢华。展示文字采用 Linear 定制无衬线字体（后备为 SF Pro Display），字重 500–700，配审慎的负字距。卡片是带细线边框的炭灰面板（#0f1011）。薰衣草强调色用于品牌标记、焦点环和少数有明确意图的 CTA，绝不用于装饰。页面节奏依赖深色面板中的产品 UI 截图，而非氛围色彩。"

colors:
  primary: "#5e6ad2"
  on-primary: "#ffffff"
  primary-hover: "#828fff"
  primary-focus: "#5e69d1"
  ink: "#f7f8f8"
  ink-muted: "#d0d6e0"
  ink-subtle: "#8a8f98"
  ink-tertiary: "#62666d"
  canvas: "#010102"
  surface-1: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  surface-4: "#191a1b"
  hairline: "#23252a"
  hairline-strong: "#34343a"
  hairline-tertiary: "#3e3e44"
  inverse-canvas: "#ffffff"
  inverse-surface-1: "#f5f6f6"
  inverse-surface-2: "#f6f7f7"
  inverse-ink: "#000000"
  brand-secure: "#7a7fad"
  semantic-success: "#27a644"
  semantic-overlay: "#000000"

typography:
  display-xl:
    fontFamily: Linear Display
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -3.0px
  display-lg:
    fontFamily: Linear Display
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.8px
  display-md:
    fontFamily: Linear Display
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1.0px
  headline:
    fontFamily: Linear Display
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.6px
  card-title:
    fontFamily: Linear Display
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.4px
  subhead:
    fontFamily: Linear Display
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.2px
  body-lg:
    fontFamily: Linear Text
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.1px
  body:
    fontFamily: Linear Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.05px
  body-sm:
    fontFamily: Linear Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Linear Text
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: Linear Text
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: Linear Text
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.4px
  mono:
    fontFamily: Linear Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
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
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-primary-pressed:
    backgroundColor: "{colors.primary-focus}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-inverse:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-featured:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-screenshot-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 16px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  pricing-tab-selected:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: 48px
  changelog-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 24px 0
  status-badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## 概览

Linear 的营销画布是本集合中最深的深色表面——`{colors.canvas}` 为 #010102，基本是纯黑，仅带一点蓝色。其上是供卡片、面板和浮起块使用的四级表面阶梯（`{colors.surface-1}` 至 `{colors.surface-4}`），细线边框从 `{colors.hairline}`（#23252a）逐级延伸到 `{colors.hairline-strong}` 和 `{colors.hairline-tertiary}`。浅灰文字（`{colors.ink}` #f7f8f8）承载正文及标题。

唯一的彩色强调色是 **Linear 薰衣草蓝** `{colors.primary}`（#5e6ad2）——用于品牌标记、焦点环及主要 CTA 按钮。更浅的悬停状态（`{colors.primary-hover}` #828fff）及带焦点色调的变体（`{colors.primary-focus}` #5e69d1）延展同一色相。Linear 在营销画布上避免使用饱和的绿色、橙色、红色等；唯一的语义色是 `{colors.semantic-success}`（#27a644），用于状态胶囊及偶尔出现的成功指示。

展示文字采用 Linear 定制无衬线字体（以 `SF Pro Display` 为后备），字重 500–700，负字距由 80px 字号下的 -3.0px 逐渐收敛到正文的 0。正文字体为 Linear 的正文专用字款；Linear Mono 则保留给产品截图中的代码片段。

页面节奏依靠**密集的产品截图**——Linear 的营销以高保真产品 UI 截图（议题列表、项目视图、仪表板）为先，将其置于 `{colors.surface-1}` 面板内，采用 `{rounded.xl}` 16px 圆角。周边界面装饰有意保持极简，让应用截图承担主要表达。

**关键特征：**
- **深色画布营销系统**——`{colors.canvas}`（#010102）是本集合中最深的深色。
- **薰衣草蓝品牌强调色**（`{colors.primary}` #5e6ad2）——只少量用于品牌标记、焦点及主要 CTA。
- 四级表面阶梯（canvas → surface-1 → surface-2 → surface-3 → surface-4）无需阴影即可承载层级。
- 展示文字使用明显负字距（80px 字号下为 -3.0px）；正文保持 -0.05px。
- 卡片使用 `{rounded.lg}` 12px 圆角及 1px 细线边框——不用胶囊形，很少使用 16px。
- **产品 UI 截图**主导页面。营销界面是应用的深色相框。
- 没有第二种彩色强调色，没有氛围渐变，没有聚光卡片。

## 颜色

> 来源页面：linear.app（首页）、/intake、/pricing、/contact/sales、/build。

### 品牌与强调
- **薰衣草蓝**（{colors.primary}）：Linear 标志性强调色——主要 CTA、品牌标记、链接强调。
- **薰衣草悬停色**（{colors.primary-hover}）：较浅的薰衣草色（#828fff）——主要 CTA 的悬停状态。
- **薰衣草焦点色**（{colors.primary-focus}）：焦点环色调（#5e69d1）——聚焦的输入框、聚焦的按钮。
- **品牌安全色**（{colors.brand-secure}）：弱化的薰衣草灰（#7a7fad）——用于“Linear Security”表面。

### 表面
- **画布**（{colors.canvas}）：默认页面背景——#010102，接近纯黑，略带蓝色。
- **表面 1**（{colors.surface-1}）：比画布高一级——功能卡片、定价卡片、产品截图面板。
- **表面 2**（{colors.surface-2}）：高两级——精选定价卡片、悬停卡片。
- **表面 3**（{colors.surface-3}）：高三级——line-tertiary 背景、次级导航。
- **表面 4**（{colors.surface-4}）：高四级——bg-level-3，最深层的浮起表面。
- **细线**（{colors.hairline}）：卡片及分隔线上的 1px 边框。
- **强细线**（{colors.hairline-strong}）：更明显的 1px 边框——输入框焦点环。
- **第三级细线**（{colors.hairline-tertiary}）：嵌套表面的第三级边框。
- **反色画布**（{colors.inverse-canvas}）：纯白——用于少数分区开场中的反色胶囊 CTA 表面。
- **反色表面 1**（{colors.inverse-surface-1}）：比反色画布高一级。
- **反色表面 2**（{colors.inverse-surface-2}）：比反色画布高两级。

### 文字
- **主文字色**（{colors.ink}）：所有标题及强调正文——浅灰 #f7f8f8。
- **弱化文字色**（{colors.ink-muted}）：次要文字 #d0d6e0——首屏面板上的元信息。
- **轻淡文字色**（{colors.ink-subtle}）：第三级文字 #8a8f98——未选中的定价标签页、页脚栏目。
- **第三级文字色令牌**（{colors.ink-tertiary}）：第四层文字 #62666d——禁用状态、脚注。

### 语义
- **成功绿**（{colors.semantic-success}）：状态胶囊、成功指示。营销中唯一的语义色。
- **覆盖层**（{colors.semantic-overlay}）：用于模态框的纯黑遮罩。

## 排版

### 字体家族

- **Linear Display**——Linear 定制展示无衬线字体；后备为 `SF Pro Display, -apple-system, system-ui, Segoe UI, Roboto`。承载 display-xl 到 subhead。
- **Linear Text**——Linear 定制正文无衬线字体（针对正文字号调优、略有不同的字款）；使用相同后备栈。承载正文各字号、按钮标签、说明文字。
- **Linear Mono**——Linear 定制等宽字体；后备为 `ui-monospace, SF Mono, Menlo`。用于产品截图中的代码片段及状态 / ID 令牌。

营销表面将 Display 和 Text 视为连贯统一的表达；字体家族的转换不引人注意。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 600 | 1.05 | -3.0px | 最大首屏标题 |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.8px | 分区开场标题 |
| `{typography.display-md}` | 40px | 600 | 1.15 | -1.0px | 子分区标题 |
| `{typography.headline}` | 28px | 600 | 1.20 | -0.6px | 定价档位标题、CTA 横幅标题 |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.4px | 功能卡片标题 |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | 引导正文、介绍段落 |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | 首屏副标题、引导段落 |
| `{typography.body}` | 16px | 400 | 1.50 | -0.05px | 默认正文 |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | 卡片正文、页脚栏目 |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | 说明、元信息、状态 |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | 所有按钮标签 |
| `{typography.eyebrow}` | 13px | 500 | 1.30 | 0.4px | 分区眉题（轻微正字距） |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | 产品截图中代码使用的 Linear Mono |

### 原则

- **展示文字使用明显负字距**（80px 字号下为 -3.0px，约占字号 4%）。
- **从展示到正文保持同一表达。** Display-xl 字重 600 → 正文字重 400——同一字体家族，字重范围较窄。
- **眉题使用正字距**（+0.4px）——与负字距展示文字形成对比，将眉题标识为分类信息。
- **等宽字仅用于代码语境。** Linear Mono 出现在产品截图内，不用于营销界面的装饰元素。

### 替代字体说明

Linear 定制字体不公开分发；文档中的后备栈 `SF Pro Display, -apple-system, system-ui` 是 macOS 上推荐的替代方案。跨平台实现时，500 / 600 / 700 字重的 **Inter** 是最接近的免费替代。**Geist Sans** 也可行。等宽字体可用字重 400 的 **JetBrains Mono** 或 **Geist Mono**，都与 Linear Mono 十分接近。

## 布局

### 间距系统

- **基础单位**：4px。
- **令牌（头部元数据）**：`{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px。
- 卡片内部内边距：功能/定价卡片用 `{spacing.lg}` 24px；证言卡片用 `{spacing.xl}` 32px；CTA 横幅用 `{spacing.xxl}` 48px。
- 胶囊按钮内边距：垂直 8px · 水平 14px——Linear 的紧凑按钮规格。
- 表单输入框内边距：垂直 8px · 水平 12px。

### 网格与容器

- 最大内容宽度约为 1280px。
- 卡片网格：桌面端每行 3 个，平板端 2 个，移动端 1 个。
- 定价档位网格每行 3 个；下方对比条带按档位显示勾号。
- 产品截图面板横跨整个内容宽度——它们是主角。

### 留白理念

深色画布本身**就是**留白。分区通过抬升到 surface-1 面板上来区分，而非依靠白色空隙。面板内内容块之间留出宽裕的 `{spacing.lg}` 24px 间隙；分区间为 `{spacing.section}` 96px。

## 层叠高度与纵深

| 层级 | 处理方式 | 用途 |
|---|---|---|
| 0（平面） | 无阴影、无边框 | 正文、首屏文字、页脚的默认方式 |
| 1（炭灰抬升） | 画布上的 `{colors.surface-1}` 背景，1px `{colors.hairline}` | 默认卡片、产品面板 |
| 2（surface-2 抬升） | `{colors.surface-2}` 背景，1px `{colors.hairline-strong}` | 精选定价卡片、悬停卡片 |
| 3（surface-3 抬升） | `{colors.surface-3}` 背景 | 次级导航、下拉菜单 |
| 4（焦点环） | 2px `{colors.primary-focus}` 轮廓，50% 不透明度 | 聚焦的输入框、聚焦的按钮 |

Linear 通过表面阶梯 + 细线边框承载纵深。品牌几乎完全避免在深色上使用投影。

### 装饰性纵深

- **产品 UI 截图**是装饰性纵深的主要来源。
- **没有氛围渐变，没有聚光卡片。**
- 浮起面板的顶边有**细微白色边缘高光**——给深色表面一点“像素渲染”的感觉。

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.xs}` | 4px | 小型标签片、状态徽标 |
| `{rounded.sm}` | 6px | 行内标签 |
| `{rounded.md}` | 8px | 所有按钮、表单输入框 |
| `{rounded.lg}` | 12px | 定价卡片、功能卡片、证言卡片 |
| `{rounded.xl}` | 16px | 产品截图面板 |
| `{rounded.xxl}` | 24px | 超大 CTA 横幅（少见） |
| `{rounded.pill}` | 9999px | 定价标签页切换、状态胶囊 |
| `{rounded.full}` | 9999px | 圆形头像 |

### 摄影与插图几何

- 产品 UI 截图占主导；放在 `{rounded.xl}` 16px 圆角块中，外部内边距为 `{spacing.lg}` 24px。
- 客户标志块以小尺寸呈现（标志高度约 24px），置于 `{colors.canvas}` 上，无边框。
- 证言卡片中的圆形头像使用 `{rounded.full}`，尺寸为 32–40px。

## 组件

### 按钮

**`button-primary`**——薰衣草色 CTA。所有页面的默认主要 CTA。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.button}`，内边距 8px 14px，圆角 `{rounded.md}`。
- 按下状态由 `button-primary-pressed` 承载（背景变为 `{colors.primary-focus}`）。
- 悬停状态由 `button-primary-hover` 承载（背景变为较浅的薰衣草色 `{colors.primary-hover}`）。

**`button-secondary`**——炭灰按钮。用于次要 CTA（“登录”“阅读更新日志”）。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.button}`，内边距 8px 14px，圆角 `{rounded.md}`。1px `{colors.hairline}` 边框。

**`button-tertiary`**——纯文字按钮。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.button}`，圆角 `{rounded.md}`，内边距 8px 14px。

**`button-inverse`**——深色背景上的白色反色 CTA。
- 背景 `{colors.inverse-canvas}`，文字 `{colors.inverse-ink}`，排版 `{typography.button}`，圆角 `{rounded.md}`，内边距 8px 14px。

### 定价标签页

**`pricing-tab-default`** + **`pricing-tab-selected`**——`/pricing` 上的胶囊切换器。
- 默认：`{colors.canvas}` 背景，`{colors.ink-subtle}` 文字，圆角 `{rounded.pill}`，内边距 6px 14px。
- 选中：`{colors.surface-2}` 背景，`{colors.ink}` 文字——选中 = 表面抬升。

### 卡片与容器

**`pricing-card`**——`/pricing` 上的各个档位。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.lg}`，内边距 24px。1px `{colors.hairline}` 边框。

**`pricing-card-featured`**——推荐档位——表面抬升到 surface-2。
- 背景 `{colors.surface-2}`，其他结构相同。

**`feature-card`**——通用功能亮点块。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.lg}`，内边距 24px。

**`product-screenshot-card`**——占主导的卡片类型——为高保真 Linear 应用 UI 截图提供外框。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.xl}`，内边距 24px。

**`testimonial-card`**——客户引语，配头像 + 姓名 + 职位。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.body-lg}`，圆角 `{rounded.lg}`，内边距 32px。

**`customer-logo-tile`**——客户标志滚动展示区中的小块。
- 背景 `{colors.canvas}`，文字 `{colors.ink-subtle}`，排版 `{typography.caption}`，圆角 `{rounded.xs}`，内边距 16px。

**`cta-banner`**——页面底部附近的收尾 CTA 面板。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.headline}`，圆角 `{rounded.lg}`，内边距 48px。

### 输入框与表单

**`text-input`** + **`text-input-focused`**——`/contact/sales` 及注册覆盖层中的表单字段。
- 背景 `{colors.surface-1}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.md}`，内边距 8px 12px。
- 聚焦时保留相同表面；焦点环为 2px `{colors.primary-focus}` 轮廓，50% 不透明度。

### 状态与 Build 页面

**`changelog-row`**——`/build`（更新日志页）上的各行，列出版本、日期及变更。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body}`，圆角 `{rounded.xs}`，内边距 24px 0。底部分隔线为 1px `{colors.hairline}`。

**`status-badge`**——小型状态胶囊。
- 背景 `{colors.surface-2}`，文字 `{colors.ink-muted}`，排版 `{typography.caption}`，圆角 `{rounded.pill}`，内边距 2px 8px。

### 导航

**`top-nav`**——吸附的深色栏，左侧为 Linear 字标，主要导航链接居中，右侧为 `button-secondary`（“登录”）+ `button-primary`（“开始使用”）组合。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，高度 56px。

### 页脚

**`footer`**——`{colors.canvas}` 上的密集链接网格，Linear 字标位于左侧。
- 背景 `{colors.canvas}`，文字 `{colors.ink-subtle}`，排版 `{typography.caption}`，内边距 64px 32px。

## 应做与不应做

### 应做

- 将 `{colors.canvas}`（#010102）保留为系统的锚定表面——微弱蓝色调是有意为之。
- 薰衣草色 `{colors.primary}` **仅用于**：品牌标记、主要 CTA、焦点环、链接强调。
- 通过四级表面阶梯建立层级，避免跳级。
- 展示文字字重 600，搭配正文字重 400——Linear 避免 700 及以上的展示字重。
- 展示文字大胆使用负字距。
- 每个分区都以产品 UI 截图为主角。
- CTA 使用 `{rounded.md}` 8px 圆角。

### 不应做

- 不要交付浅色模式营销页面。
- 不要将薰衣草色作为分区背景或卡片填色。
- 不要引入第二种彩色强调色（营销中不用橙色、粉色、绿色）。
- 不要添加氛围渐变或聚光卡片。
- 不要将 CTA 做成胶囊圆角。
- 不要使用真正的纯黑 `#000000` 作为画布。
- 不要在产品截图模拟图中组合多种鲜亮强调色。

## 响应式行为

### 断点

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 超大桌面 | 1440px | 默认桌面布局 |
| 桌面 | 1280px | 卡片网格保持每行 3 个 |
| 平板 | 1024px | 卡片网格从每行 3 个 → 2 个 |
| 大型手机 | 768px | 定价对比变为折叠面板；导航变为汉堡菜单 |
| 手机 | 480px | 单列；display-xl 从 80px → 约 36px |

### 触控目标

- 所有视口中 CTA 点击高度保持 ≥40px。
- 定价标签页胶囊点击高度保持 ≥36px；触控视口增大至 ≥44px。
- 表单输入框在触控设备上的目标尺寸保持 ≥44px。

### 收缩策略

- **顶部导航**：低于 768px 时，链接收起为汉堡菜单。
- **卡片网格**：每行 3 个 → 1024px 时 2 个 → 低于 768px 时 1 个。
- **定价对比**：低于 768px 时，每个档位采用折叠面板。
- **展示文字**：`{typography.display-xl}` 80px 在移动端向 `{typography.display-md}` 40px 缩放。

### 图像行为

- 产品 UI 截图保持宽高比，绝不裁切。
- 滚动展示区的客户标志在低于 768px 时，可由每行 6 个收缩为 3 个。

## 迭代指南

1. 每次聚焦一个组件，使用其 `components:` 令牌名称引用。
2. 引入分区时，先决定它处于哪一级抬升表面。
3. 正文默认为 `{typography.body}`，字重 400。
4. 编辑后运行 `npx @google/design.md lint DESIGN.md`。
5. 新增变体以独立组件条目加入。
6. 将薰衣草色视为稀缺资源：品牌标记、主要 CTA、焦点、链接强调。
7. 每个分区都以产品 UI 截图开场。

## 已知缺口

- 四级表面阶梯的数值直接提取自 Linear 的 `--color-bg-level-3`、`--color-line-tint` 等 CSS 变量；它们是 Linear 的规范表面规格。
- 检查过的页面中看不到表单字段错误及校验样式。
- 未记录浅色模式，因为营销网站不提供浅色主题。
- Linear 实际产品 UI 为议题优先级与项目标签使用更丰富的彩色标签色板（红、橙、黄、绿、蓝、紫）——这些颜色存在于模拟图展示的产品内部表面中。
- 定制展示、正文及等宽字体家族为专有字体；可以使用开源替代品。
