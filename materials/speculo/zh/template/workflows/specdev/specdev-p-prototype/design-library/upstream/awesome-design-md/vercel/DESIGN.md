---
version: alpha
name: Vercel-Inspired-design-analysis
description: "对 Vercel 设计语言的灵感式诠释——开发者平台品牌，在近白画布上采用鲜明黑色与墨色二重奏，在首屏尺度以多彩网格渐变（青 / 蓝 / 品红 / 琥珀）打断，渐变就是全部装饰系统；搭配用于标题的定制几何无衬线字体，以及用于技术标签的等宽说明字体。"

colors:
  primary: "#171717"
  on-primary: "#ffffff"
  ink: "#171717"
  body: "#4d4d4d"
  mute: "#888888"
  hairline: "#ebebeb"
  hairline-strong: "#a1a1a1"
  canvas: "#ffffff"
  canvas-soft: "#fafafa"
  canvas-soft-2: "#f5f5f5"
  link: "#0070f3"
  link-deep: "#0761d1"
  link-bg-soft: "#d3e5ff"
  success: "#0070f3"
  error: "#ee0000"
  error-soft: "#f7d4d6"
  error-deep: "#c50000"
  warning: "#f5a623"
  warning-soft: "#ffefcf"
  warning-deep: "#ab570a"
  violet: "#7928ca"
  violet-soft: "#d8ccf1"
  violet-deep: "#4c2889"
  cyan: "#50e3c2"
  cyan-soft: "#aaffec"
  cyan-deep: "#29bc9b"
  highlight-pink: "#ff0080"
  highlight-magenta: "#eb367f"
  gradient-develop-start: "#007cf0"
  gradient-develop-end: "#00dfd8"
  gradient-preview-start: "#7928ca"
  gradient-preview-end: "#ff0080"
  gradient-ship-start: "#ff4d4d"
  gradient-ship-end: "#f9cb28"
  selection-bg: "#171717"
  selection-fg: "#f2f2f2"

typography:
  display-xl:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 48px
    fontWeight: 600
    lineHeight: 48px
    letterSpacing: -2.4px
  display-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -1.28px
  display-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.96px
  display-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.6px
  body-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.28px
  body-sm-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: -0.28px
  caption:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-mono:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  code:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  button-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  button-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill-sm: 64px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  6xl: 128px
  section: 192px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 64px
    padding: "{spacing.sm} {spacing.lg}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"
  nav-cta-signup:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-login:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-ask-ai:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-primary-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  button-secondary-sm:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  tab-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill-sm}"
    padding: "0px {spacing.md}"
  icon-button-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.full}"
  card-marketing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  card-marketing-large:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-soft:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  template-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-editor-mockup:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  form-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 40px
  form-input-sm:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 32px
  form-input-lg:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 48px
  badge-secondary:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "0px {spacing.xs}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  pricing-card-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.lg} {spacing.xl}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.4xl} {spacing.lg}"
  feature-mesh-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-light:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.lg}"
  link-inline:
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  banner-marketing:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"

  # ─── 示例（示意）——自动派生；解决下方所有 TO_FILL 标记 ───
  ex-pricing-tier:
    description: "默认档位卡片。在 canvas-soft 表面上镜像 pricing-card 外框，配细线边框。"
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "精选档位——明暗翻转为墨色主色，配白字及白色 CTA。"
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "“包含哪些内容”摘要卡片——改用于品牌 GPU / 推理 / Pro 功能档位。"
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "订阅摘要——按附加项列出明细（不是真实电子商务购物车）。"
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "侧栏导航行。活动状态以品牌主色作为左边缘指示条。"
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  ex-data-table-cell:
    description: "镜像品牌表格外框。表头使用 caption-mono 大写等宽字体；正文用 body-sm。"
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption-mono}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.xs} {spacing.sm}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "登录 / 注册卡片。镜像 card-marketing-large 外框，内部使用 form-input 基础组件。"
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "模态对话框表面——与 card-marketing-large 相同外框，配 Level 5 模态阴影。"
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "空状态插图框。在 canvas-soft 上留出宽裕内边距。"
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "短暂通知表面——平直圆角的 card-marketing 外框，配 Level 4 阴影。"
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body-sm}"

---


## 概览

Vercel 是开发者平台品牌——页面是部署仪表板的营销表面，面向已经了解语法的工程师。它通过网络上最干净利落的系统之一建立这种定位：近白 `{colors.canvas-soft}` 正文背景、近黑墨色 `{colors.ink}` 文字，以及按 200 级步长划分、让每个分隔、边框和禁用状态都有刻意档位的灰阶。品牌唯一在营销尺度引入色彩的地方，是漂浮于氛围背景中的多色标网格渐变（`{colors.gradient-develop-start}` → `{colors.gradient-preview-end}` → `{colors.gradient-ship-start}` → 青 / 品红 / 琥珀），绝不缩小成色样。这个渐变就是整个装饰系统。

文字是第二个决定性声音。品牌自有定制几何无衬线字体（Geist）承载展示、正文、按钮——所有叙事内容——展示字重 600，按钮 500，正文 400。配套等宽字体（Geist Mono）承载技术标签：终端模拟图、代码块，有时是文件名说明。标题采用句首大写及明显负字距（48 px 首屏为 `-2.4px`）——品牌从不用正字距，除等宽标签外也不用全大写。

表面使用四级阶梯：`{colors.canvas}`（卡片纯白）、`{colors.canvas-soft}` 98%（页面正文）、`{colors.canvas-soft-2}` 95%（偶尔的内嵌区域）、`{colors.primary}`（需要深色模式处理的分区中，作为明暗翻转带的深近黑墨色）。阴影极其细微——每张浮起卡片都采用 `0px 1px 1px #00000005` + `0px 2px 2px #0000000a` + 内嵌边框构成的叠加阴影。卡片绝不漂浮于厚重投影上；它们以细线 + 柔光稳稳落在页面上。

**关键特征：**
- 单一黑墨色主要 CTA `{colors.primary}` 承载每个转化目标，配白上白 `button-secondary` 次要操作。品牌营销 CTA 使用 100 px 胶囊形，应用内导航按钮采用紧凑 6 px 方正形状。
- 多色标网格渐变（青-蓝-品红-琥珀）是唯一装饰外框——用于首屏尺度及功能带氛围背景中。它就是品牌。
- 每个分区眉题和小标签均用等宽字体 `{typography.caption-mono}` 或 `{typography.code}`；其他内容均用几何无衬线字体。
- 细微叠加阴影抬升——三种偏移以 4–12% 黑色不透明度分层——绝非单一厚重投影。
- 系统令牌集中存在完整的 100–1000 灰 + 蓝 + 红 + 琥珀 + 绿 + 青绿 + 紫 + 粉色阶，但营销表面仅使用 `100`、`1000` 和 `700` 档色调；其余留在设计系统令牌中服务产品内表面。
- “Active CPU”定价节奏：定价页 `pricing-card` 每行 3 张，其中 `pricing-card-featured`（Pro 档）翻转为 `{colors.primary}`，与白色同级卡片相对。

## 颜色

### 品牌与强调
- **墨色**（`{colors.primary}`——`#171717`）：唯一主要 CTA 色。近乎纯黑的墨色承载每个注册胶囊、每个页脚 CTA、深色带明暗翻转。浅色表面全页也用作文字色。（解析自 `--ds-gray-1000`。）
- **青色**（`{colors.cyan}`——`#50e3c2`）：标志性薄荷青，用于品牌渐变及 Geist 系统聚光令牌。可见于首屏渐变色标中。
- **高亮粉**（`{colors.highlight-pink}`——`#ff0080`）：品牌高亮品红，用于预览渐变对的高饱和色标。
- **紫罗兰**（`{colors.violet}`——`#7928ca`）：深紫，用作预览渐变起点及开发者控制台高亮。
- **链接蓝**（`{colors.link}`——`#0070f3`）：品牌主要链接色及旧版 `--geist-success` 语义色。

### 表面
- **画布**（`{colors.canvas}`——`#ffffff`）：纯白卡片 / 对话框 / 模态表面。
- **柔和画布**（`{colors.canvas-soft}`——`#fafafa`）：默认页面背景——98% 白。几乎每个分区都置于此色调。
- **柔和画布 2**（`{colors.canvas-soft-2}`——`#f5f5f5`）：略深的内嵌表面，用于“代码编辑器内部背景”、模板卡片悬停及下拉菜单。
- **细线**（`{colors.hairline}`——`#ebebeb`）：1 px 分隔线——表格行、卡片边框、输入框边框。
- **较强细线**（`{colors.hairline-strong}`——`#a1a1a1`）：500 档灰，用作浅色带上稍强分隔线及弱化文字色。

### 文字
- **主文字色**（`{colors.ink}`——`#171717`）：浅色表面的每个标题及正文段落。
- **正文色**（`{colors.body}`——`#4d4d4d`）：次要文字——副标题、正文说明、非活动导航链接文字、页脚栏目正文。
- **弱化色**（`{colors.mute}`——`#888888`）：最低优先级文字——占位文字、细则、低调标签。
- **主色上文字**（`{colors.on-primary}`——`#ffffff`）：`{colors.primary}` 表面上的所有文字。

### 语义
- **成功 / 链接**（`{colors.success}`——`#0070f3`）：品牌旧版成功指示兼作主要链接色。行内正文链接悬停时显示下划线。
- **深链接色**（`{colors.link-deep}`——`#0761d1`）：行内链接按下 / 已访问色。
- **柔和链接背景**（`{colors.link-bg-soft}`——`#d3e5ff`）：柔和浅蓝填色，用于“最新动态”胶囊横幅及信息徽标。
- **错误**（`{colors.error}`——`#ee0000`）：破坏性操作和表单错误的校验红。
- **柔和错误色**（`{colors.error-soft}`——`#f7d4d6`）：破坏性状态背景的柔和浅红。
- **深错误色**（`{colors.error-deep}`——`#c50000`）：按下 / 深破坏性状态。
- **警告**（`{colors.warning}`——`#f5a623`）：警示 / 待处理状态指示。
- **柔和警告色**（`{colors.warning-soft}`——`#ffefcf`）/ **深警告色**（`{colors.warning-deep}`——`#ab570a`）：背景 + 按下变体。

### 品牌渐变
品牌标志性装饰是三对渐变组成的堆叠：
- **开发**（`{colors.gradient-develop-start}` `#007cf0` → `{colors.gradient-develop-end}` `#00dfd8`）——蓝到青绿的一对，用于标记“部署” / “开发”节奏。
- **预览**（`{colors.gradient-preview-start}` `#7928ca` → `{colors.gradient-preview-end}` `#ff0080`）——紫罗兰到粉的一对，用于“预览”表面。
- **交付**（`{colors.gradient-ship-start}` `#ff4d4d` → `{colors.gradient-ship-end}` `#f9cb28`）——珊瑚到琥珀的一对，用于“交付”表面。

用作首屏氛围背景时，三对汇合为单个多彩网格渐变。将渐变视为统一对象——不裁切到单色，不重排色标，不缩小。仅用于首屏尺度。

## 排版

### 字体家族
两套定制字体承载整个系统：

1. **定制几何无衬线字体**（提取为 `Geist`），用于每种展示、正文、按钮、链接及标签。工作字重集合为 400 / 500 / 600；从不出现 700 或更粗。展示字号采用明显负字距（48 px 首屏 `-2.4 px`，32 px 分区 `-1.28 px`）；正文保持中性或轻微负字距。
2. **定制等宽字体**（提取为 `Geist Mono`），用于终端模拟图、代码块及小型等宽说明标签——任何希望传达“技术性”的内容。仅 400 字重，12 – 13 px。字距中性。

另加载一套窄体展示无衬线字体（`Space Grotesk`），用于偶尔的编辑场景，但在捕获表面中没有任何地方作为主要字体呈现。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 600 | 48px | -2.4px | 首屏标题（“在 AI 云上构建和部署。”）。 |
| `{typography.display-lg}` | 32px | 600 | 40px | -1.28px | 分区标题（“你的前端，交付到位。”“适用于所有工作负载的计算模型。”）。 |
| `{typography.display-md}` | 24px | 600 | 32px | -0.96px | 卡片组标题、定价档位名称。 |
| `{typography.display-sm}` | 20px | 600 | 28px | -0.6px | 行内展示微标题。 |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | 分区标题下的引导段落。 |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | 默认正文段落。 |
| `{typography.body-md-strong}` | 16px | 500 | 24px | 0 | 加粗行内正文。 |
| `{typography.body-sm}` | 14px | 400 | 20px | -0.28px | 次要正文、导航链接文字、button-md 标签。 |
| `{typography.body-sm-strong}` | 14px | 500 | 20px | -0.28px | 导航 CTA 标签、表格行强调。 |
| `{typography.caption}` | 12px | 400 | 16px | 0 | 页脚次要行、徽标标签。 |
| `{typography.caption-mono}` | 12px | 400 | 16px | 0 | 需要技术语气的分区眉题及标签说明。 |
| `{typography.code}` | 13px | 400 | 20px | 0 | 行内代码、终端模拟图、命令片段。 |
| `{typography.button-md}` | 14px | 500 | 20px | 0 | 小型 / 导航尺度按钮标签。 |
| `{typography.button-lg}` | 16px | 500 | 24px | 0 | 营销尺度胶囊按钮标签。 |

### 原则
- **负字距是语气的一部分。** 展示字号采用明显 `-2.4` 到 `-0.6` px 字距。恢复默认字距会破坏品牌。
- **标题句首大写，以句号结束。** “在 AI 云上构建和部署。”等标题有意以句号结尾——标点是品牌语气的一部分。
- **等宽字仅用于技术层。** 分区眉题、代码块、终端模拟图。正文段落绝不用等宽字。
- **600 字重是展示上限。** 几何无衬线字体绝不出现 700 / 800。品牌因此显得更平静。

### 替代字体说明
两套主要字体为专有字体（品牌定制字款）。开源替代：
- **几何无衬线**——*Inter*（400 / 500 / 600）是风格最接近的选择；`font-feature-settings: "ss01", "ss02"` 启用几何替代字形。*Satoshi* 是尚可的第二选择。
- **等宽**——*JetBrains Mono*（400）在 12 – 13 px 下匹配技术语气。*IBM Plex Mono* 是第二选择。

## 布局

### 间距系统
- **基础单位**：4 px。品牌 `--geist-space` 令牌恰好 4 px，捕获的每个值都是 4 的倍数。
- **令牌**：`{spacing.xxs}` 4 px · `{spacing.xs}` 8 px · `{spacing.sm}` 12 px · `{spacing.md}` 16 px · `{spacing.lg}` 24 px · `{spacing.xl}` 32 px · `{spacing.2xl}` 40 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px · `{spacing.6xl}` 128 px · `{spacing.section}` 192 px。
- **分区内边距**：营销带上下使用 `{spacing.4xl}` 到 `{spacing.5xl}`。首屏带延伸到 `{spacing.section}`，给网格渐变呼吸空间。
- **卡片内部内边距**：营销卡片为 `{spacing.lg}` 到 `{spacing.xl}`；模板网格卡片保持更紧的 `{spacing.md}`，因为处于更密集网格。
- **行内间隙**：按钮行、导航行、标签片行的同级元素间为 `{spacing.sm}` 到 `{spacing.md}`。品牌 `--geist-gap` 恰好 24 px。

### 网格与容器
- **最大宽度**：约 1400 px（`--ds-page-width`）；旧版 `--geist-page-width` 为 1200 px，仍出现在部分营销表面。内容居中，水平边距桌面 `{spacing.lg}` 24 px，移动端 `{spacing.md}` 16 px。
- **列模式**：
  - 三功能行：桌面每行 3 个，移动端 1 个（如“Web 应用 / 可组合商务 / 多租户平台”行）。
  - 标签胶囊行：5 个 `tab-ghost` 胶囊居中排列。
  - 模板网格组：桌面每行 5 个，逐步缩至移动端 1 个。
  - 定价档位网格：桌面每行 3 个，中间档位明暗翻转。
  - 标志条：约 5 个标志宽，单行。

### 留白理念
网格渐变承担大部分装饰性表达；留白分隔各带。分区间距宽裕——带间 `{spacing.4xl}` 到 `{spacing.5xl}` 让渐变呼吸。卡片内部标题/段落堆叠紧凑（`{spacing.xs}` 8 px 间隙），CTA 组之前再留更大间隙。页面呈工程化观感——外部大间隙 + 内部紧凑，绝不反过来。

### 响应式策略

#### 断点

| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 手机 | < 600px | 首屏堆叠；导航收起为汉堡菜单；三列功能网格降为单列；标签胶囊行启用水平滚动。 |
| 平板 | 600–959px | 三列网格降为双列；导航仍水平。 |
| 桌面 | 960–1199px | 完整三列网格；定价三列。 |
| 宽屏 | 1200–1399px | 容器内容宽度上限 1400 px。 |
| 超宽屏 | ≥ 1400px | 内容在 1400 px 内保持居中；色带满幅延伸，但内容保持最大宽度。 |

#### 触控目标
`button-primary` 胶囊在导航中约高 32 px，营销语境约高 48 px。营销 CTA 在所有断点都能轻松满足 WCAG AAA；导航按钮在移动端通过 `{spacing.xs}` 内边距扩展触控区域，满足 44 × 44 px 下限。

#### 收缩策略
- **导航**：桌面完整链接行 + 询问 AI / 登录 / 注册胶囊。移动端收起为标志 + 汉堡菜单，菜单以全屏覆盖层打开。
- **首屏**：网格渐变保持居中；标题 + 正文在所有断点都垂直堆叠（品牌不采用分栏首屏）。
- **三功能行**：在上述断点每行 3 个 → 2 个 → 1 个；所有视口中卡片保持 `{rounded.md}` 8 px 形状。
- **定价卡片网格**：桌面每行 3 个，移动端垂直堆叠，`pricing-card-featured` 始终位于中间。
- **模板网格**：每行 5 个 → 3 个 → 2 个 → 1 个。每张 `template-card` 图像保持 16:9。

#### 图像行为
- **网格渐变**：以内联 SVG 或 canvas 绘制渐变呈现；随首屏容器流式缩放；绝不裁切、绝不平铺。
- **客户标志**：标志条中使用单色 SVG；高度一致为 24 px。
- **代码编辑器模拟图**：深色 `{colors.primary}` 矩形，内部呈现等宽文字；布局层面按图像处理。
- **模板缩略图**：`{rounded.md}` 卡片外框中的 16:9 横图；懒加载；占位状态采用一致灰阶色板。

## 层叠高度与纵深

| 层级 | 处理方式 | 用途 |
|---|---|---|
| Level 0——平面 | 无阴影、无边框。 | 满幅首屏带及明暗翻转深色分区。 |
| Level 1——内嵌细线 | `0 0 0 1px #00000014` 内嵌 1 px 边框。 | 默认卡片外框——品牌通用的“这张卡片可见”提示。 |
| Level 2——细微投影 | `0px 1px 1px #00000005, 0px 2px 2px #0000000a` 加内嵌细线。 | 轻微抬升卡片（模板网格、营销卡片）。 |
| Level 3——柔和叠加 | `0px 2px 2px #0000000a, 0px 8px 8px -8px #0000000a` 加内嵌细线。 | “中等”抬升——功能网格卡片。 |
| Level 4——浮动叠加 | `0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a` 加内嵌细线。 | “大型”抬升——定价卡片、提示面板。 |
| Level 5——模态 | `0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f` 加内嵌细线。 | 模态 / 对话框表面及下拉菜单。 |

品牌采用**叠加**阴影——多个小偏移分层模拟自然光——绝非单一 8-px 模糊的普通投影。始终加入内嵌细线环，保持卡片边缘清晰。

### 装饰性纵深
- **网格渐变作为氛围纵深**：首屏多色标渐变是品牌唯一“氛围”效果——作为平面二维背景，而非三维插图。
- **明暗翻转深色带作为分区纵深**：表面从 `{colors.canvas-soft}` 变为 `{colors.primary}`（深墨色），是品牌带间主要纵深提示。
- **内嵌阴影 + 投影组合**：卡片结合内嵌 1 px 环及多色标投影，产生“卡片落在页面上”的效果，绝不显得材质沉重。

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.none}` | 0px | 满幅首屏 / 页脚带。 |
| `{rounded.xs}` | 4px | 最紧凑行内胶囊——`nav-cta-signup` 6-px 圆角按钮（映射到 `xs/sm`）。 |
| `{rounded.sm}` | 6px | 品牌 `--geist-radius` 令牌——应用内按钮、表单输入框、下拉菜单的基础 UI 圆角。 |
| `{rounded.md}` | 8px | 品牌 `--geist-marketing-radius` 令牌——功能卡片、模板卡片。 |
| `{rounded.lg}` | 12px | 略大的卡片外框（pricing-card 变体）。 |
| `{rounded.xl}` | 16px | 最大卡片外框——卡片顶部承载首屏图像时。 |
| `{rounded.pill-sm}` | 64px | “AI 应用 / Web 应用 / 电子商务 / 营销 / 平台”行中的 tab-ghost 胶囊。 |
| `{rounded.pill}` | 100px | 营销 CTA 胶囊——`button-primary`、`button-secondary`、“开始部署”胶囊。 |
| `{rounded.full}` | 9999px | 图标按钮圆形容器、导航链接幽灵胶囊。 |

### 摄影几何
- **网格渐变**：满幅二维氛围背景，绝不裁成框；视作页面壁纸。
- **客户标志**：单色 SVG，flex 行内统一 24 px 高。
- **代码编辑器模拟图**：16:10 深色矩形，`{rounded.md}` 圆角。
- **模板缩略图**：`{rounded.md}` 外框中的 16:9 横图。
- **展示图像**：`{rounded.lg}` 至 `{rounded.xl}` 外框内的 2:1 或 16:9 图像，带叠加阴影。

## 组件

### 按钮

**`button-primary`**——规范的 100-px 圆角黑色胶囊，营销尺度。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，标签 `{typography.button-lg}`，内边距 `0px {spacing.sm}` 12 px，形状 `{rounded.pill}` 100 px。搭配营销 flex 布局时呈现约 48 px 高。

**`button-secondary`**——营销带中与黑色主要按钮配对的白色胶囊。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 + 内边距与 `button-primary` 相同，形状 `{rounded.pill}`。

**`button-primary-sm`**——导航及定价卡片 CTA 中使用的较小主要胶囊。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，标签 `{typography.button-md}`（14 px / 500），形状 `{rounded.pill}`。

**`button-secondary-sm`**——与 `button-primary-sm` 配对的较小白色胶囊。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 + 形状与 `button-primary-sm` 相同。

**`tab-ghost`**——居中行标签胶囊（“AI 应用 / Web 应用 / 电子商务 / 营销 / 平台”）。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，标签 `{typography.body-sm}`，内边距 `0px {spacing.md}`，形状 `{rounded.pill-sm}` 64 px。

**`icon-button-circular`**——圆形图标容器（内部常为“?”或箭头）。
- 背景 `{colors.canvas}`，深色图标，1 px 实线细线边框，形状 `{rounded.full}`。

**导航 CTA：**

**`nav-cta-signup`**——导航行中的小黑色“注册”按钮。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，标签 `{typography.body-sm-strong}`，内边距 `0px {spacing.xs}`，高 28 px，形状 `{rounded.sm}` 6 px（品牌 `--geist-radius`）。

**`nav-cta-login`**——导航中的白色“登录”按钮。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 / 高度 / 形状与 `nav-cta-signup` 相同。

**`nav-cta-ask-ai`**——带浅边框的小型“询问 AI”按钮。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，1 px 实线 `{colors.hairline}` 边框（提取为 `0px solid rgb(235, 235, 235)`），排版 / 高度 / 形状相同。

### 卡片与容器

**`card-marketing`**——规范营销功能卡片（三列分区卡片）。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，内边距 `{spacing.lg}` 24 px，形状 `{rounded.md}` 8 px（`--geist-marketing-radius`）。采用 Level 3 柔和叠加阴影。

**`card-marketing-large`**——“计算模型” / “AI Gateway”提示中使用的较大营销卡片。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，内边距 `{spacing.xl}`，形状 `{rounded.lg}` 12 px。采用 Level 4 浮动叠加阴影。

**`card-soft`**——卡片组内部柔和着色卡片（比 canvas-soft 更浅）。
- 背景 `{colors.canvas-soft}`，文字 `{colors.ink}`，内边距 `{spacing.lg}`，形状 `{rounded.md}`。

**`template-card`**——“部署你的第一个应用”网格中的部署模板卡片。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，内边距 `{spacing.md}` 16 px，形状 `{rounded.md}` 8 px。顶部承载 16:9 缩略图。

**`code-editor-mockup`**——营销带中的深色代码预览表面。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，正文 `{typography.code}`（13 px / Geist Mono），内边距 `{spacing.lg}` 24 px，形状 `{rounded.md}` 8 px。

**`pricing-card`**——默认定价档位卡片。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，内边距 `{spacing.xl}` 32 px，形状 `{rounded.lg}` 12 px。内部：档位名 `{typography.display-md}`，价格 `{typography.display-xl}`，功能列表 `{typography.body-md}` 各行，底部 CTA。

**`pricing-card-featured`**——明暗翻转的“Pro”档位卡片。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，形状 + 内边距与 `pricing-card` 相同。CTA 反转为 `button-secondary-sm`（黑卡上的白胶囊）。

### 输入框与表单

**`form-input`**——规范文字输入框。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，1 px 实线 `{colors.hairline}` 边框，正文 `{typography.body-sm}`（14 px），内边距 `0px {spacing.sm}`，高 40 px（品牌 `--geist-form-height`），形状 `{rounded.sm}` 6 px。

**`form-input-sm`**——紧凑表单的小高度变体（高 32 px）。
- 与 `form-input` 相同，但高 32 px（`--geist-form-small-height`）。

**`form-input-lg`**——首屏 CTA 的大高度变体（高 48 px）。
- 与 `form-input` 相同，但高 48 px（`--geist-form-large-height`）；正文 `{typography.body-md}` 16 px。

### 导航

**`nav-bar`**——吸附顶部导航。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，高 64 px（品牌 `--header-height`），内边距 `{spacing.sm} {spacing.lg}`。布局：左侧标志，中间链接行，右侧“询问 AI / 登录 / 注册”组。

**`nav-link`**——`nav-bar` 内居中的链接行。
- 文字 `{colors.body}`，排版 `{typography.body-sm}`，内边距 `{spacing.xs} {spacing.sm}`，形状 `{rounded.full}`（幽灵胶囊——仅悬停或活动时可见，但圆角已记录）。

**`footer`**——底部四列导航。
- 背景 `{colors.canvas}`，文字 `{colors.body}`，内边距 `{spacing.4xl} {spacing.lg}`。眉题式栏标签 `{typography.caption-mono}`（大写等宽效果）；链接行 `{typography.body-sm}`。

### 标志性组件

**`hero-band`**——带网格渐变背景的白色首屏。
- 背景 `{colors.canvas}`（部分表面为 `{colors.canvas-soft}`），文字 `{colors.ink}`，内边距 `{spacing.4xl} {spacing.lg}`。内部：标题上方小等宽徽标、标题 `{typography.display-xl}`（句首大写、句号结尾）、引导正文 `{typography.body-lg}`，以及 `button-primary` + `button-secondary` CTA 行。网格渐变置于后方，缩放至约占色带上半部分。

**`feature-mesh-band`**——承载网格渐变氛围背景、上覆功能文案的次级分区。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，内边距 `{spacing.5xl} {spacing.lg}`。分区标题 `{typography.display-lg}`；辅助正文 `{typography.body-md}`。

**`showcase-band-light`**——柔和画布分区（“数秒内部署你的第一个应用”）。
- 背景 `{colors.canvas-soft}`，文字 `{colors.ink}`，内边距 `{spacing.5xl} {spacing.lg}`。

**`showcase-band-dark`**——明暗翻转深色带（“适用于所有工作负载的计算模型”）。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，内边距 `{spacing.5xl} {spacing.lg}`。分区标题 `{typography.display-lg}`（黑底白字）。常包含与色带齐平的 `code-editor-mockup`。

**`logo-strip`**——页面顶部附近可换行的客户标志行。
- 背景 `{colors.canvas}`，文字 `{colors.body}`，内边距 `{spacing.lg} {spacing.xl}`。标志呈现为高度一致的单色 SVG。

**`badge-secondary`**——小型行内元数据胶囊（“新增”“测试版”“已上线”）。
- 背景 `{colors.canvas-soft}`，文字 `{colors.body}`，正文 `{typography.caption}`，内边距 `0px {spacing.xs}`，形状 `{rounded.full}`。

**`banner-marketing`**——页面顶部“推出 X”的公告胶囊。
- 背景 `{colors.canvas-soft}`，文字 `{colors.body}`，正文 `{typography.body-sm}`，内边距 `{spacing.xs} {spacing.sm}`，形状 `{rounded.full}`。

**`link-inline`**——正文行内链接。
- 文字 `{colors.link}`（`#0070f3`），正文 `{typography.body-md}`，带下划线。

### 示例（示意）

> 自动派生、镜像套件的演示表面（`scripts/derive-examples-block.mjs`）。每个 `ex-*` 条目引用品牌原生基础组件，使下游消费者（`/preview-design`、`/generate-kit`）能一致地为同样 10 个表面换肤。`TO_FILL` 标记表示基础组件缺失——在 LLM 判断环节解决。

**`ex-pricing-tier`**——默认定价档位卡片。复用功能卡片外框及品牌 canvas-soft 表面。
- 属性：`backgroundColor`、`textColor`、`borderColor`、`rounded`、`padding`

**`ex-pricing-tier-featured`**——精选/高亮档位——明暗翻转表面（浅色模式深填色 + 浅文字，深色模式浅填色 + 深文字）。
- 属性：`backgroundColor`、`textColor`、`rounded`、`padding`

**`ex-product-selector`**——“包含哪些内容”摘要卡片——改用于 SaaS / B2B 垂直领域（**不是**真实产品画廊）。
- 属性：`backgroundColor`、`rounded`、`padding`

**`ex-cart-drawer`**——订阅摘要——改用于 SaaS / B2B（按附加项列明细，并非真实购物车）。
- 属性：`backgroundColor`、`rounded`、`padding`、`item-divider`

**`ex-app-shell-row`**——App Shell 示例内的侧栏导航行。活动状态使用品牌主色作指示。
- 属性：`backgroundColor`、`activeIndicator`、`rounded`、`padding`

**`ex-data-table-cell`**——默认数据表 th + td 外框。表头使用等宽大写眉题排版；正文使用 body-sm。
- 属性：`headerBackground`、`headerTypography`、`bodyTypography`、`cellPadding`、`rowBorder`

**`ex-auth-form-card`**——登录 / 注册卡片。复用功能卡片外框，内部使用文字输入框基础组件。
- 属性：`backgroundColor`、`rounded`、`padding`

**`ex-modal-card`**——模态对话框表面——与功能卡片相同外框，配抬升阴影。
- 属性：`backgroundColor`、`rounded`、`padding`

**`ex-empty-state-card`**——空状态插图框。
- 属性：`backgroundColor`、`rounded`、`padding`、`captionTypography`

**`ex-toast`**——短暂通知表面——功能卡片形状 + 中等阴影。
- 属性：`backgroundColor`、`rounded`、`padding`、`typography`


## 应做与不应做

### 应做
- 将 `{colors.primary}`（`#171717`）保留给全页主要 CTA。黑墨色**就是**转化目标。
- 每个营销尺度 CTA 使用 `{rounded.pill}` 100 px，导航尺度按钮使用 `{rounded.sm}` 6 px。这两种胶囊尺度有意共存。
- 每个标题设为 `{typography.display-*}` 600 字重、句首大写，常以句号结束。明显负字距是语气的一部分。
- 品牌网格渐变仅在首屏尺度作氛围装饰——绝不缩为图标，绝不缩减为单色。
- 叠加阴影（多个小偏移及内嵌细线），而非单一厚重投影。品牌抬升比 Material 更平静。
- 页面表面以 `{colors.canvas-soft}` → `{colors.canvas}` → `{colors.primary}` 明暗翻转带循环；深色带**就是**纵深提示。
- 每个代码块及技术眉题都用 `{typography.code}` / `{typography.caption-mono}`。等宽字是平台的声音。

### 不应做
- 不要引入第六种强调色。品牌以墨色 + 灰 + 四对渐变色板运作；新强调色会削平其语气。
- 不要使用全大写标题。句首大写 + 负字距不可妥协。
- 不要给卡片施加单一厚重投影。品牌抬升由多个小偏移叠加 + 内嵌细线环构成。
- 不要在图标尺度或缩减单色形式中呈现品牌渐变。渐变仅存在于首屏尺度。
- 不要将几何无衬线字体提升到 700 字重。品牌展示上限为 600。
- 不要在同一屏将营销 100-px 胶囊 CTA 形状与 6-px 导航圆角搭配——选择一种尺度并保持。
- 不要用等宽字体排正文段落。等宽字仅用于代码 + 技术标签。
