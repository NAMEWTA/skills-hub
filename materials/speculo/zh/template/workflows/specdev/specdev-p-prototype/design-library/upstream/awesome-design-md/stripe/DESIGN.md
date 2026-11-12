---
version: alpha
name: Stripi-Inspired-design-analysis
description: 对 Stripi 设计语言的灵感式诠释——这一金融基础设施品牌以深海军蓝文字色、电光靛蓝主色，以及反复出现、占据几乎每个营销页面上三分之一的氛围渐变网格为基础。系统将专有 Sohne 字体家族的纤细（300）字重与负字距结合，形成具有编辑排版密度的展示标题；在金额和数字重要的地方使用等宽数字正文。按钮是紧凑圆角的胶囊，卡片置于近白表面上，而仪表板路线则翻转明暗，成为熟悉的深色应用外壳。

colors:
  primary: "#533afd"
  primary-deep: "#4434d4"
  primary-press: "#2e2b8c"
  primary-soft: "#665efd"
  primary-bg-subdued-hover: "#b9b9f9"
  brand-dark-900: "#1c1e54"
  ink: "#0d253d"
  ink-secondary: "#273951"
  ink-mute: "#64748d"
  ink-mute-2: "#61718a"
  on-primary: "#ffffff"
  canvas: "#ffffff"
  canvas-soft: "#f6f9fc"
  canvas-cream: "#f5e9d4"
  hairline: "#e3e8ee"
  hairline-input: "#a8c3de"
  ruby: "#ea2261"
  magenta: "#f96bee"
  lemon: "#9b6829"
  shadow-blue: "#003770"

typography:
  display-xxl:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 56px
    fontWeight: 300
    lineHeight: 1.03
    letterSpacing: -1.4px
    fontFeature: ss01
  display-xl:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: -0.96px
    fontFeature: ss01
  display-lg:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 32px
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: -0.64px
    fontFeature: ss01
  display-md:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 26px
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: -0.26px
    fontFeature: ss01
  heading-lg:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 22px
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: -0.22px
    fontFeature: ss01
  heading-md:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 20px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: -0.2px
    fontFeature: ss01
  heading-sm:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: ss01
  body-lg:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: ss01
  body-md:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: ss01
  body-tabular:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: -0.42px
    fontFeature: tnum
  button-md:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
    fontFeature: ss01
  button-sm:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
    fontFeature: ss01
  caption:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.39px
    fontFeature: tnum
  micro:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: ss01
  micro-cap:
    fontFamily: "sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: 0.1px
    fontFeature: ss01

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px

components:
  button-primary-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  button-primary-pill-pressed:
    backgroundColor: "{colors.primary-press}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  button-on-dark:
    backgroundColor: "{colors.brand-dark-900}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 8px 12px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 8px 12px
  card-feature-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-pricing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-pricing-featured:
    backgroundColor: "{colors.brand-dark-900}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-cream-band:
    backgroundColor: "{colors.canvas-cream}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-dashboard-mockup:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-tabular}"
    rounded: "{rounded.lg}"
    padding: 24px
  pill-tag-soft:
    backgroundColor: "{colors.primary-bg-subdued-hover}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.micro-cap}"
    rounded: "{rounded.pill}"
    padding: 4px 8px
  nav-bar-on-mesh:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 16px 24px
  link-on-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 0px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 24px
---

## 概览

Stripi 的设计语言以渐变网格开场。一条由柔和奶油色、果冰橙、薰衣草色、电光靛蓝及红宝石粉组成的宽横带，占据几乎每个营销页面的上三分之一——这是品牌一眼可辨的氛围背景。文字及产品 UI 模拟图在其上方的 `{colors.canvas}`（白色）上悬浮，渐变既是装饰，也是视觉锚点。页面下部回归白色，在 `{colors.canvas-soft}`（略带冷色的灰白）上解释功能；仪表板产品模拟图则合成为深海军蓝的仿 IDE/控制台面板。

色彩系统有两个主要角色。**靛蓝**（`{colors.primary}`——`#533afd`）是品牌标志性的 CTA 色，使用克制：每条带状分区只放一个实心胶囊。**深海军蓝**（`{colors.ink}`——`#0d253d`）是通用正文颜色，也是仪表板模拟图、精选定价档位以及仪表板路线中深色应用表面的填色。红宝石色（`{colors.ruby}`）和品红（`{colors.magenta}`）出现在渐变网格内，也作为产品 UI 模拟图中的强调点；不作为按钮颜色。

排版以字重 300、负字距的 **Sohne** 为核心——这是品牌具有编辑排版密度的展示文字标志。展示字号（32–56px）采用 -1.4px 到 -0.64px 字距；正文字号使用 0；表格式说明字号（金额及数字至关重要的场景）采用 OpenType `tnum` 特性，并将字距收紧至 -0.36 到 -0.42px。所有文字角色均启用 `ss01` 风格集。

**关键特征：**
- 每个营销首屏均有渐变网格背景——奶油色/橙色/薰衣草色/靛蓝/红宝石色横向晕染页面上三分之一。
- 单一靛蓝 CTA 层级：填色 `{colors.primary}` 胶囊是营销表面唯一的填色按钮。
- Sohne 纤细（字重 300）展示层级，根据字号采用 -1.4px 到 -0.2px 负字距。
- 任何包含金额或数字的单元格都使用等宽数字正文（`tnum`）——品牌低调的金融数据信号。
- 深色应用仪表板路线：深海军蓝产品 UI 模拟图合成在白色画布上方，内部经常呈现代码或仪表板表格。
- 胶囊形按钮（`{rounded.pill}` 9999px）配紧凑的 `8px 16px` 内边距——短促、果断、有交易感。
- 奶油色带功能卡片（`{colors.canvas-cream}`）在蓝白分区之间引入温暖过渡，又不破坏品牌的色彩逻辑。

## 颜色

> **来源页面：**首页（`/`）、`/payments`、`/pricing`、`dashboard.stripe.com/register/payments`。

### 品牌与强调
- **靛蓝**（`{colors.primary}`——`#533afd`）：品牌标志性的 CTA 色。实心胶囊按钮、链接强调、渐变锚点。
- **深靛蓝**（`{colors.primary-deep}`——`#4434d4`）：用于渐变中间色标的较深靛蓝，也是偏暖的按下状态替代色。
- **按下靛蓝**（`{colors.primary-press}`——`#2e2b8c`）：主色的按下状态变化。
- **柔和靛蓝**（`{colors.primary-soft}`——`#665efd`）：较浅的靛蓝，用于产品 UI 强调及图表高亮。
- **弱化靛蓝**（`{colors.primary-bg-subdued-hover}`——`#b9b9f9`）：浅靛蓝填色，用作柔和标签背景。
- **品牌深色 900**（`{colors.brand-dark-900}`——`#1c1e54`）：用于精选定价档位及仪表板外框的深海军蓝。
- **红宝石色**（`{colors.ruby}`——`#ea2261`）：渐变强调及图表高亮；绝不用于按钮。
- **品红**（`{colors.magenta}`——`#f96bee`）：渐变网格中更明亮的粉色色标。
- **柠檬色**（`{colors.lemon}`——`#9b6829`）：渐变背景中温暖的果冰色标。

### 表面
- **画布**（`{colors.canvas}`——`#ffffff`）：默认页面背景。
- **柔和画布**（`{colors.canvas-soft}`——`#f6f9fc`）：略带冷色的灰白，用于渐变首屏下方的功能带。
- **奶油画布**（`{colors.canvas-cream}`——`#f5e9d4`）：用于功能带填色的暖奶油色——品牌的色彩间奏。
- **细线**（`{colors.hairline}`——`#e3e8ee`）：卡片及表格上的 1px 边框。
- **输入框细线**（`{colors.hairline-input}`——`#a8c3de`）：略偏冷的细线，用于表单输入框。

### 文字
- **主文字色**（`{colors.ink}`——`#0d253d`）：品牌全局默认正文色。深海军蓝，绝非纯黑。
- **次要文字色**（`{colors.ink-secondary}`——`#273951`）：白色上的次要文字。
- **弱化文字色**（`{colors.ink-mute}`——`#64748d`）：辅助文字、说明文字、表格标签。
- **弱化文字色 2**（`{colors.ink-mute-2}`——`#61718a`）：与 ink-mute 近似，用于导航。
- **主色上文字**（`{colors.on-primary}`——`#ffffff`）：靛蓝 / 深海军蓝表面上的文字。

### 语义
品牌营销系统不使用独立语义色板——错误 / 成功状态专门存在于仪表板产品 UI 中。

## 排版

### 字体家族

展示及 UI 层级采用 **Sohne**（专有字体，获 Klim Type Foundry 授权），字重为 300（纤细）和 400（常规）。可变字体（`sohne-var`）加载时全局启用 `font-feature-settings: "ss01"`——该风格集替换为单层结构的 `a` 及其他字符变体，它们构成品牌排版标志的一部分。

Sohne 不可用时，退回纤细字重的 **SF Pro Display**，再退到 system-ui。为了尽可能忠实于品牌，开源 **Inter** 的 300 字重，配 `font-feature-settings: "ss01"` 及展示字号上的 `letter-spacing: -1.4px`，能紧密近似其节奏。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 56px | 300 | 1.03 | -1.4px | 首屏标题 |
| `{typography.display-xl}` | 48px | 300 | 1.15 | -0.96px | 分区开场 |
| `{typography.display-lg}` | 32px | 300 | 1.1 | -0.64px | 卡片标题 / 子分区 |
| `{typography.display-md}` | 26px | 300 | 1.12 | -0.26px | 紧凑卡片标题 |
| `{typography.heading-lg}` | 22px | 300 | 1.1 | -0.22px | 定价档位名称 |
| `{typography.heading-md}` | 20px | 300 | 1.4 | -0.2px | 分区副标题 |
| `{typography.heading-sm}` | 18px | 300 | 1.4 | 0 | 小分区标签 |
| `{typography.body-lg}` | 16px | 300 | 1.4 | 0 | 营销正文引导 |
| `{typography.body-md}` | 15px | 300 | 1.4 | 0 | 默认 UI 正文 |
| `{typography.body-tabular}` | 14px | 300 | 1.4 | -0.42px | 金额 / 数字表格（使用 `tnum`） |
| `{typography.button-md}` | 16px | 400 | 1.0 | 0 | 胶囊按钮标签 |
| `{typography.button-sm}` | 14px | 400 | 1.0 | 0 | 紧凑胶囊标签 |
| `{typography.caption}` | 13px | 400 | 1.4 | -0.39px | 辅助、表格标签 |
| `{typography.micro}` | 11px | 300 | 1.4 | 0 | 附属细则 |
| `{typography.micro-cap}` | 10px | 400 | 1.15 | 0.1px | 全大写眉题 |

### 原则
- **纤细字重就是品牌。** 展示层级始终以字重 300 呈现。提高到 400 及以上会失去品牌的编辑气息。
- **展示文字负字距。** 56px 字号下为 -1.4px，按比例缩减至 20px 字号下的 -0.2px。负字距是品牌的排版标志。
- **金额使用等宽数字。** 呈现货币、交易金额或数字计数的任何单元格，都使用 `font-feature-settings: "tnum"` 并收紧字距。品牌通过这一微小细节低调传递其金融基因。
- **全局启用 `ss01`。** 在 body 元素上应用 `font-feature-settings: "ss01"`，让每一种文字角色都启用风格集替换。

### 替代字体说明
Sohne 是专有字体。展示层级使用 **Inter**（通过 Google Fonts 提供的开源字体）300 字重，配 `letter-spacing: -1.4px` 及 `font-feature-settings: "ss01"`——Inter 是最接近的开源对应字体。正文字号的规范替代是 Inter 300 字重，适用时启用 `font-feature-settings: "tnum"`。避免 Helvetica 或 system-ui 默认字体——它们比品牌所需更厚重。

## 布局

### 间距系统
- **基础单位**：8px（细部使用 2 / 4 / 12 子令牌）。
- **令牌**：`{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px。
- **分区内边距**：营销表面为 64–96px；仪表板 / 产品表面为 32–48px。
- **卡片内部内边距**：功能卡片为 32px；仪表板模拟图为 24px。

### 网格与容器
- 营销页面居中于约 1200px 容器内，上方渐变网格延伸至两侧边缘。
- 定价在 1024 / 768 断点下由每行 4 个 → 2 个 → 1 个。
- 仪表板产品模拟图使用自身内部网格（12 列表格、3 列卡片网格），以静态合成图呈现。

### 留白理念
渐变网格占据页面上三分之一；下方白色画布内边距宽裕。分区间距倾向 96px；在供用户比较并采取行动的仪表板 / 定价页面上，内容间距收紧至 32px。

## 层叠高度与纵深

| 层级 | 处理方式 | 用途 |
|---|---|---|
| 0 | 平面 | 默认表面 |
| 1 | `box-shadow: rgba(0,55,112,0.08) 0 1px 3px` | 白色上抬升的卡片 |
| 2 | `box-shadow: rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px` | 浮动面板、仪表板模拟图外框 |
| 3 | 渐变网格背景 | 品牌的主要纵深媒介——用氛围色彩，而非字面上的阴影 |

### 装饰性纵深
渐变网格**就是**纵深系统。以分层 SVG 或大型背景图实现，而非 CSS 渐变（实际网格有 CSS 无法渲染的有机团块形状）。网格提供品牌标志性的抬升感；实际阴影保留给产品 UI 模拟图，并保持细微。

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.xs}` | 4px | 细线标签、表格外框 |
| `{rounded.sm}` | 6px | 表单输入框 |
| `{rounded.md}` | 8px | 紧凑卡片、警报 |
| `{rounded.lg}` | 12px | 定价卡片、功能卡片 |
| `{rounded.xl}` | 16px | 仪表板产品模拟图外框 |
| `{rounded.pill}` | 9999px | 所有按钮、胶囊标签 |

### 摄影几何
品牌使用**产品 UI 模拟图**多于摄影。仪表板合成图在 `{rounded.lg}` 12px 容器内呈现仿 IDE/终端/仪表板外框，带细微 `box-shadow`。真实摄影出现在客户标志条及少见的案例卡片中；处理为内嵌 4:3，无阴影。

## 组件

### 按钮

**`button-primary-pill`**——全系统主要的 CTA。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.button-md}`，内边距 `{spacing.sm} {spacing.lg}`（8px 16px），圆角 `{rounded.pill}` 9999px。
- 按下状态 `button-primary-pill-pressed` 将背景变为 `{colors.primary-press}`。

**`button-secondary`**——描边风格替代按钮。
- 背景 `{colors.canvas}`，文字 `{colors.primary}`，1px 实线 `{colors.primary}` 边框，采用相同胶囊几何。

**`button-on-dark`**——用于仪表板 / 深色表面。
- 背景 `{colors.brand-dark-900}`，文字 `{colors.on-primary}`，采用相同胶囊几何。

### 卡片与容器

**`card-feature-light`**——白色上的功能说明卡片。
- 背景 `{colors.canvas}`，内边距 `{spacing.xxl}`，圆角 `{rounded.lg}` 12px，1px `{colors.hairline}` 边框，可选 Level 1 阴影。

**`card-pricing`**——标准定价档位。
- 背景 `{colors.canvas}`，内边距 `{spacing.xxl}`，圆角 `{rounded.lg}`，1px `{colors.hairline}` 边框。标题 `{typography.heading-lg}`，价格 `{typography.display-md}`，正文 `{typography.body-md}`，CTA 以 `button-primary-pill` 固定在底部。

**`card-pricing-featured`**——反色的深色精选档位。
- 背景 `{colors.brand-dark-900}`，文字 `{colors.on-primary}`，其他结构与 `card-pricing` 相同。深海军蓝填色是品牌独特的精选档位选择。

**`card-cream-band`**——温暖过渡卡片。
- 背景 `{colors.canvas-cream}`，文字 `{colors.ink}`，内边距 `{spacing.xxl}`，圆角 `{rounded.lg}`。用温暖感打断靛蓝 / 白色节奏。

**`card-dashboard-mockup`**——合成的仪表板 / 产品 UI 截图。
- 背景 `{colors.canvas}`，排版 `{typography.body-tabular}`（带 `tnum`），内边距 `{spacing.xl}` 24px，圆角 `{rounded.lg}` 12px，Level 2 阴影。常含嵌套小型模拟图：代码预览 + 仪表板表格 + 图表卡片。

### 输入框与表单

**`text-input`**——标准表单字段。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-md}`，内边距 `{spacing.sm} {spacing.md}`（8px 12px），圆角 `{rounded.sm}` 6px，1px `{colors.hairline-input}` 边框。
- 焦点状态 `text-input-focused`：边框改为 `{colors.primary}`。

### 导航

**`nav-bar-on-mesh`**——悬浮于渐变首屏上方的顶部导航。
- 背景 `{colors.canvas}`（或根据滚动情况透明），文字 `{colors.ink}`，内边距 `{spacing.lg} {spacing.xl}`。标志字标位于左侧，主要导航居中，登录 + 填色 `button-primary-pill` 位于右侧。

### 胶囊、标签与标签片

**`pill-tag-soft`**——弱化的靛蓝标签。
- 背景 `{colors.primary-bg-subdued-hover}`，文字 `{colors.primary-deep}`，排版 `{typography.micro-cap}`，内边距 `4px 8px`，圆角 `{rounded.pill}`。

### 标志性组件

**渐变网格背景**——柔和奶油色 → 果冰橙 → 薰衣草色 → 靛蓝 → 红宝石粉的色标，横向模糊晕染于页面上三分之一。以 SVG 或大型背景图实现——不是平面的 CSS 渐变（真实网格具有有机团块形状）。

**合成仪表板模拟图**——多层仿产品 UI 构图：左侧 IDE 面板，中央仪表板表格，右侧图表卡片，全都以小比例呈现在 `{rounded.lg}` 容器中，带细微 Level 2 阴影。该合成图是品牌最常被截图展示的特征。

**等宽数字金额排版**——每个表示金额、计数或交易数值的数字均使用 `font-feature-settings: "tnum"`。这是品牌低调传递其金融基础设施平台身份的信号。

**`link-on-light`**——浅色表面上的行内链接。
- 文字 `{colors.primary}`，采用 `{typography.body-md}`，默认无下划线。

**`footer-light`**——全站页脚。
- 背景 `{colors.canvas}`，文字 `{colors.ink-mute}`，排版 `{typography.caption}`，内边距 `{spacing.huge} {spacing.xl}`（64px 24px）。包含 4–6 列链接组、社交图标及一小行法律信息。

## 应做与不应做

### 应做
- 将 `{colors.primary}` 保留给填色 CTA 和行内链接强调——应克制出现，每条带状分区一个填色按钮。
- 每个营销首屏都应用渐变网格；裸画布首屏会偏离品牌。
- 展示层级以字重 300 配负字距呈现——纤细字形配紧字距是排版标志。
- 每个金额 / 数字单元格使用 `font-feature-settings: "tnum"`。
- 在 body 元素上全局应用 `font-feature-settings: "ss01"`。
- 每项功能说明都搭配合成产品 UI 模拟图；品牌的论点是“看实际产品”。

### 不应做
- 不要把展示字重提高到 300 以上——到了 400，品牌的编辑气息就会消失。
- 不要增加文档所列渐变色标之外的新强调色（奶油色 / 橙色 / 薰衣草色 / 靛蓝 / 红宝石色 / 品红）。
- 不要将靛蓝 `{colors.primary}` 用作正文文字色——它是 CTA 和链接色，不是正文字号的文字色。
- 不要将按钮内边距缩小到 `8px 16px` 以下——紧凑胶囊是品牌交易感的一部分。
- 不要在金额单元格中省略 `tnum`——这会破坏低调的金融数据特征。
- 不要用圆角矩形替代按钮的胶囊形。

## 响应式行为

### 断点

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 宽屏 | ≥ 1440px | 完整渐变网格延伸至边缘；仪表板合成图以完整比例展示 |
| 桌面 | 1024–1440px | 默认内容最大宽度；定价每行 4 个 |
| 平板 | 768–1023px | 定价每行 2 个；仪表板合成图简化为 2 个面板 |
| 手机 | < 768px | 定价每行 1 个；汉堡导航；展示字号从 56 → 36px |

### 触控目标
- 胶囊按钮在移动端通过缩放内边距达到 ≥ 40×40px。较小屏幕上，按钮扩大到 44×44px，以保持 WCAG AAA。
- 表单字段最小高度保持 40px。

### 收缩策略
- 展示层级跨断点按 56 → 48 → 32 → 26 → 22px 阶梯缩小。
- 渐变网格在移动端重新平铺，保留色彩晕染而不消失。
- 仪表板合成图在移动端简化为单面板模拟图；多层构图仅在桌面及以上呈现。
- 定价档位按每行 4 个 → 2 个 → 1 个阶梯变化。

### 图像行为
产品 UI 合成图使用 `srcset`，在主要断点进行艺术指导式裁切。移动端裁切聚焦最具操作意义的内部面板；桌面裁切展示完整多层构图。

## 迭代指南

1. 每次聚焦一个组件。
2. 直接引用组件名称及令牌（`{colors.primary}`、`{button-primary-pill}-pressed`、`{rounded.pill}`）。
3. 编辑后运行 `npx @google/design.md lint DESIGN.md`。
4. 新变体以独立条目加入。
5. 正文默认使用 `{typography.body-md}`（15px）；任何金额 / 数字单元格使用 `{typography.body-tabular}`。
6. 在 body 上全局应用 `ss01`；对数字内容逐元素应用 `tnum`。
7. 营销首屏的渐变网格不可妥协——裸画布首屏会破坏品牌。
