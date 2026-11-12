---
version: alpha
name: Notion-design-analysis
description: Notion 通过自信、插图丰富的品牌语气呈现一体化工作空间——以深海军蓝首屏带（{colors.brand-navy}）为锚点，配品牌色便利贴圆点和网格线插图、标志性紫色胶囊主要 CTA（{colors.primary}），以及呼应实际产品彩色数据库属性的丰富柔和功能卡片色板。系统在每个 UI 表面使用 Notion-Sans（基于 Inter）字体，提供 4 档定价对比（Free / Plus / Business / Enterprise），并将实际工作空间 UI 模拟图直接放进首屏带。覆盖首页、企业、产品 AI、产品 Agents、初创企业及定价表面。

colors:
  primary: "#5645d4"
  primary-pressed: "#4534b3"
  primary-deep: "#3a2a99"
  on-primary: "#ffffff"
  brand-navy: "#0a1530"
  brand-navy-deep: "#070f24"
  brand-navy-mid: "#1a2a52"
  link-blue: "#0075de"
  link-blue-pressed: "#005bab"
  brand-orange: "#dd5b00"
  brand-orange-deep: "#793400"
  brand-pink: "#ff64c8"
  brand-pink-deep: "#a02e6d"
  brand-purple: "#7b3ff2"
  brand-purple-300: "#d6b6f6"
  brand-purple-800: "#391c57"
  brand-teal: "#2a9d99"
  brand-green: "#1aae39"
  brand-yellow: "#f5d75e"
  brand-brown: "#523410"
  card-tint-peach: "#ffe8d4"
  card-tint-rose: "#fde0ec"
  card-tint-mint: "#d9f3e1"
  card-tint-lavender: "#e6e0f5"
  card-tint-sky: "#dcecfa"
  card-tint-yellow: "#fef7d6"
  card-tint-yellow-bold: "#f9e79f"
  card-tint-cream: "#f8f5e8"
  card-tint-gray: "#f0eeec"
  canvas: "#ffffff"
  surface: "#f6f5f4"
  surface-soft: "#fafaf9"
  hairline: "#e5e3df"
  hairline-soft: "#ede9e4"
  hairline-strong: "#c8c4be"
  ink-deep: "#000000"
  ink: "#1a1a1a"
  charcoal: "#37352f"
  slate: "#5d5b54"
  steel: "#787671"
  stone: "#a4a097"
  muted: "#bbb8b1"
  on-dark: "#ffffff"
  on-dark-muted: "#a4a097"
  semantic-success: "#1aae39"
  semantic-warning: "#dd5b00"
  semantic-error: "#e03131"

typography:
  hero-display:
    fontFamily: Notion Sans
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: Notion Sans
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1px
  heading-1:
    fontFamily: Notion Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.5px
  heading-2:
    fontFamily: Notion Sans
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Notion Sans
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
  heading-4:
    fontFamily: Notion Sans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.30
  heading-5:
    fontFamily: Notion Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  subtitle:
    fontFamily: Notion Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Notion Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-md-medium:
    fontFamily: Notion Sans
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.55
  body-sm:
    fontFamily: Notion Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Notion Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Notion Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Notion Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Notion Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Notion Sans
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 1px
  button-md:
    fontFamily: Notion Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  xxxl: 24px
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
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-dark:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    border: "1px solid {colors.hairline-strong}"
  button-on-dark:
    backgroundColor: "{colors.on-dark}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-secondary-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    border: "1px solid {colors.on-dark-muted}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.link-blue}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  card-feature-yellow-bold:
    backgroundColor: "{colors.card-tint-yellow-bold}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-peach:
    backgroundColor: "{colors.card-tint-peach}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-rose:
    backgroundColor: "{colors.card-tint-rose}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-mint:
    backgroundColor: "{colors.card-tint-mint}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-sky:
    backgroundColor: "{colors.card-tint-sky}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-lavender:
    backgroundColor: "{colors.card-tint-lavender}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-yellow:
    backgroundColor: "{colors.card-tint-yellow}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-cream:
    backgroundColor: "{colors.card-tint-cream}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-agent-tile:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-template:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
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
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.primary}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.primary}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 44px
    border: "1px solid {colors.hairline}"
  pill-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.md}"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.ink-deep}"
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
  badge-purple:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-pink:
    backgroundColor: "{colors.brand-pink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-orange:
    backgroundColor: "{colors.brand-orange}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-tag-purple:
    backgroundColor: "{colors.card-tint-lavender}"
    textColor: "{colors.brand-purple-800}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-tag-orange:
    backgroundColor: "{colors.card-tint-peach}"
    textColor: "{colors.brand-orange-deep}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-tag-green:
    backgroundColor: "{colors.card-tint-mint}"
    textColor: "{colors.brand-green}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-popular:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  promo-banner:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  hero-band-dark:
    backgroundColor: "{colors.brand-navy}"
    textColor: "{colors.on-dark}"
    rounded: "0"
    padding: "{spacing.hero}"
  workspace-mockup-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "0"
    border: "1px solid {colors.hairline}"
    shadow: "rgba(15, 15, 15, 0.2) 0px 24px 48px -8px"
  cta-banner-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 1px {colors.hairline-soft} solid"
  testimonial-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "0 0 1px {colors.hairline} solid"
  stat-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section-sm}"
  footer-region:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.charcoal}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
    border: "1px solid {colors.hairline}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
---

## 概览

Notion 通过自信、插图丰富的品牌语气，将自身呈现为一体化工作空间。首页以居中的 **“认识夜班团队。”** 开场，置于深海军蓝首屏带（{colors.brand-navy}）上；品牌色便利贴圆点及网格线插图散布标题周围。标志性的**紫色胶囊主要 CTA**（{colors.primary}）“免费使用 Notion”处于视觉中心，搭配描边次要按钮“申请演示”。按钮下方，一张真实 Notion 工作空间 UI 模拟卡片（“Ramp HQ”看板）突破首屏带边界，带深而弥散的投影。

首屏下方，页面循环呈现独特的功能分区序列：密集便利贴“让工作 24/7 全天候推进”面板，带红/蓝/绿/紫/青绿色状态图标；**醒目黄色**（{colors.card-tint-yellow-bold}）“询问随叫随到的助手”横幅卡片，两侧为橙/玫瑰/薄荷柔和色功能块，展示助手 UI 模拟图；以及“把所有工作汇集一处”的三列网格，带品牌色模拟图（天蓝教程卡片、浅色 Notion 日历、棕/锈色证言板）。定价页横向呈现 4 档（Free / Plus / Business / Enterprise），其中一档突出显示（紫边框），下方延伸密集的功能对比表。

系统在所有 UI 表面使用 Notion-Sans 字体（基于 Inter）——人文几何风格与彩色插图自然搭配。按钮是 `{rounded.md}`（8px）矩形，**不是**胶囊——Notion 稳重的矩形几何与普遍使用胶囊的竞争者区分开来。卡片统一使用 `{rounded.lg}`（12px）。

**关键特征：**
- 深海军蓝首屏带（{colors.brand-navy}），配散布便利贴圆点 + 网格线装饰插图
- **标志性紫色胶囊**（{colors.primary}）主要 CTA——Notion 可辨识的“免费使用 Notion”按钮颜色
- 首屏嵌入真实 Notion 工作空间 UI 模拟卡片，带深投影
- 醒目黄色功能横幅（{colors.card-tint-yellow-bold}）用于高强调内容分区
- 柔和功能卡片色板（桃、玫瑰、薄荷、薰衣草、天空、黄）呼应实际产品数据库属性
- 所有 UI 表面使用 Notion-Sans（基于 Inter）
- 按钮 8px 圆角（**不是**胶囊），卡片 12px 圆角——稳重的编辑几何
- 4 档定价对比，配密集功能表
- 居中首屏布局（不同于大多数 B2B SaaS 常见的左对齐）

## 颜色

> 来源页面：notion.com/（首页）、/enterprise、/product/ai、/product/agents、/startups、/pricing。全部六页的令牌覆盖相同。

### 品牌与主色
- **Notion 紫**（{colors.primary}）：标志性主要 CTA 色——一眼可辨的“免费使用 Notion”胶囊按钮。仅保留给主导 CTA。
- **按下紫**（{colors.primary-pressed}）：按下状态变体
- **深紫**（{colors.primary-deep}）：更深变体，用于强调
- **品牌海军蓝**（{colors.brand-navy}）：首屏带背景——深海军蓝
- **深品牌海军蓝**（{colors.brand-navy-deep}）：促销横幅使用的更深海军蓝
- **中品牌海军蓝**（{colors.brand-navy-mid}）：中间色段的海军蓝
- **链接蓝**（{colors.link-blue}）：行内文字链接蓝（**不是**主要 CTA）
- **按下链接蓝**（{colors.link-blue-pressed}）：按下状态链接蓝

### 品牌色谱（呼应实际产品数据库属性）
- **品牌粉**（{colors.brand-pink}）：粉色强调
- **深品牌粉**（{colors.brand-pink-deep}）：更深粉色
- **品牌橙**（{colors.brand-orange}）：橙色强调
- **深品牌橙**（{colors.brand-orange-deep}）：更深的橙锈色
- **品牌紫**（{colors.brand-purple}）：紫色强调变体
- **品牌紫 300**（{colors.brand-purple-300}）：浅紫
- **品牌紫 800**（{colors.brand-purple-800}）：标签文字使用的深紫
- **品牌青绿**（{colors.brand-teal}）：青绿色强调
- **品牌绿**（{colors.brand-green}）：亮绿
- **品牌黄**（{colors.brand-yellow}）：柔和黄
- **品牌棕**（{colors.brand-brown}）：用于“大地色”色调的品牌棕

### 卡片色调（柔和功能卡片背景）
- **桃色调**（{colors.card-tint-peach}）：浅桃色
- **玫瑰色调**（{colors.card-tint-rose}）：浅玫瑰粉
- **薄荷色调**（{colors.card-tint-mint}）：浅薄荷绿
- **薰衣草色调**（{colors.card-tint-lavender}）：浅薰衣草色
- **天空色调**（{colors.card-tint-sky}）：浅天蓝
- **黄色调**（{colors.card-tint-yellow}）：浅黄
- **醒目黄色调**（{colors.card-tint-yellow-bold}）：用于高强调功能横幅（“询问随叫随到的助手”）的醒目黄
- **奶油色调**（{colors.card-tint-cream}）：奶油色
- **灰色调**（{colors.card-tint-gray}）：中性表面

### 表面
- **画布白**（{colors.canvas}）：页面背景及主要卡片表面
- **表面**（{colors.surface}）：细微分区背景、搜索胶囊静止状态、精选定价档位
- **柔和表面**（{colors.surface-soft}）：更安静的分区分隔
- **细线**（{colors.hairline}）：1px 边框及主要分隔线
- **柔和细线**（{colors.hairline-soft}）：更安静的分隔线
- **较强细线**（{colors.hairline-strong}）：输入框较强的 1px 边框

### 文字
- **深文字色**（{colors.ink-deep}）：纯黑，用于强调
- **主文字色**（{colors.ink}）：主要标题及正文
- **炭灰**（{colors.charcoal}）：正文强调（Notion 标志性暖炭灰）
- **板岩灰**（{colors.slate}）：次要文字
- **钢灰**（{colors.steel}）：第三级文字、页脚链接
- **石灰**（{colors.stone}）：弱化标签
- **弱化色**（{colors.muted}）：禁用状态、占位符
- **深色上文字**（{colors.on-dark}）：深色表面上的白字
- **深色上弱化文字**（{colors.on-dark-muted}）：降低不透明度的白色

### 语义
- **成功**（{colors.semantic-success}）：确认绿
- **警告**（{colors.semantic-warning}）：中等优先级提示（橙）
- **错误**（{colors.semantic-error}）：校验错误（红）

## 排版

### 字体家族
**Notion Sans**（主要）：Notion 定制的基于 Inter 的可变字体。后备：Inter、-apple-system、system-ui、'Segoe UI'、Helvetica、sans-serif。所有 UI 表面采用人文几何风格。

### 层级

| 令牌 | 字号 | 字重 | 行高 | 字距 | 用途 |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 600 | 1.05 | -2px | 首屏（“认识夜班团队”） |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1px | 分区开场 |
| `{typography.heading-1}` | 48px | 600 | 1.15 | -0.5px | 页面级标题（“免费试用”） |
| `{typography.heading-2}` | 36px | 600 | 1.20 | -0.5px | 子分区标题（“让工作 24/7 全天候推进”） |
| `{typography.heading-3}` | 28px | 600 | 1.25 | 0 | 卡片标题 |
| `{typography.heading-4}` | 22px | 600 | 1.30 | 0 | 功能块标题 |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | FAQ 问题 |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | 首屏副标题 |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | 主要正文 |
| `{typography.body-md-medium}` | 16px | 500 | 1.55 | 0 | 正文强调 |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | 次要正文 |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | 活动侧栏、按钮标签 |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | 徽标标签 |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | 按钮标签 |

### 原则
- 80px 展示文字采用紧凑首屏行距（1.05）
- 展示字号使用负字距（-2px 至 -0.5px）
- 正文行距宽裕（1.55），利于文档阅读
- 标题字重 600 + 按钮 500；正文 400

## 布局

### 间距系统
- **基础单位**：4px（主要增量 8px）
- **令牌**：`{spacing.xxs}`（4px）至 `{spacing.hero}`（120px）
- **分区节奏**：营销页面使用 `{spacing.section-lg}`（96px）；定价收紧至 `{spacing.section}`（64px）

### 网格与容器
- 最大宽度 1280px，两侧间距 32px
- 定价：桌面 4 档卡片行，配密集对比表
- 首页：居中首屏，按钮下方工作空间模拟图；彩色功能卡片分区交替

### 留白理念
营销表面在功能卡片带之间使用宽裕呼吸空间。首屏工作空间模拟卡片采用全宽处理，带深投影。

## 层叠高度与纵深

| 层级 | 处理方式 | 用途 |
|---|---|---|
| 0（平面） | 无阴影；`{colors.hairline}` 边框 | 默认卡片、表格行 |
| 1（细微） | `rgba(15, 15, 15, 0.04) 0px 1px 2px 0px` | 悬停抬升块 |
| 2（卡片） | `rgba(15, 15, 15, 0.08) 0px 4px 12px 0px` | 功能卡片 |
| 3（模拟图） | `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px` | 首屏工作空间模拟卡片 |
| 4（模态框） | `rgba(15, 15, 15, 0.16) 0px 16px 48px -8px` | 模态框、下拉菜单 |

### 装饰性纵深
- 首屏工作空间模拟卡片使用深而弥散的投影（Level 3）——在海军蓝色带上形成显著抬升
- 柔和功能卡片通过着色背景承载自身视觉分量
- 便利贴圆点插图及网格线为海军蓝首屏添加氛围装饰

## 形状

### 圆角半径刻度

| 令牌 | 数值 | 用途 |
|---|---|---|
| `{rounded.xs}` | 4px | 标签片 |
| `{rounded.sm}` | 6px | 类型徽标 |
| `{rounded.md}` | 8px | 按钮、输入框、搜索胶囊 |
| `{rounded.lg}` | 12px | 卡片、定价档位、agent 块、工作空间模拟图 |
| `{rounded.xl}` | 16px | 更大功能面板 |
| `{rounded.xxl}` | 20px | 精选产品展示 |
| `{rounded.xxxl}` | 24px | 更大功能卡片 |
| `{rounded.full}` | 9999px | 状态徽标、胶囊标签页（**不是**普通按钮） |

Notion 几何稳重而具编辑感——`{rounded.md}`（8px）按钮将它与到处使用胶囊按钮的品牌区分开来。

## 组件

> 按不记录悬停的策略，**不记录**悬停状态。

### 按钮

**`button-primary`**——标志性紫色矩形主要 CTA，主导操作。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.button-md}`，内边距 `10px 18px`，圆角 `{rounded.md}`。
- 按下状态 `button-primary-pressed` 加深为 `{colors.primary-pressed}`。
- 禁用状态使用 `{colors.hairline}` 背景。

**`button-dark`**——浅色背景上的黑色矩形 CTA。
- 背景 `{colors.ink-deep}`，文字 `{colors.on-dark}`，排版 `{typography.button-md}`，内边距 `10px 18px`，圆角 `{rounded.md}`。

**`button-secondary`**——次要操作的描边矩形（“申请演示”）。
- 透明背景，文字 `{colors.ink}`，边框 `1px solid {colors.hairline-strong}`，排版 `{typography.button-md}`，内边距 `10px 18px`，圆角 `{rounded.md}`。

**`button-on-dark`**——深色首屏带上的白色按钮。
- 背景 `{colors.on-dark}`，文字 `{colors.ink}`，排版 `{typography.button-md}`，内边距 `10px 18px`，圆角 `{rounded.md}`。

**`button-secondary-on-dark`**——深色上的描边按钮。
- 透明背景，文字 `{colors.on-dark}`，边框 `1px solid {colors.on-dark-muted}`，排版 `{typography.button-md}`，内边距 `10px 18px`，圆角 `{rounded.md}`。

**`button-ghost`**——更安静的幽灵按钮。
- 透明背景，文字 `{colors.ink}`，排版 `{typography.button-md}`，内边距 `8px 12px`，圆角 `{rounded.sm}`。

**`button-link`**——行内蓝色文字链接（**不是**主要紫色）。
- 透明背景，文字 `{colors.link-blue}`，排版 `{typography.body-sm-medium}`，内边距 `0`。

### 卡片与容器

**`card-base`**——标准内容卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xl}`，边框 `1px solid {colors.hairline}`。

**`card-feature`**——更大内边距的功能卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `1px solid {colors.hairline}`。

**`card-feature-yellow-bold`**——高强调内容的醒目黄色功能横幅（“询问随叫随到的助手”）。
- 背景 `{colors.card-tint-yellow-bold}`，文字 `{colors.charcoal}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`。

**`card-feature-peach`** + **`card-feature-rose`** + **`card-feature-mint`** + **`card-feature-sky`** + **`card-feature-lavender`** + **`card-feature-yellow`** + **`card-feature-cream`**——柔和着色功能卡片。
- 各变体使用对应 `card-tint-*` 色作背景，文字 `{colors.charcoal}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`。

**`card-agent-tile`**——agent 助手块。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xl}`，边框 `1px solid {colors.hairline}`。

**`card-template`**——模板缩略图卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.lg}`，边框 `1px solid {colors.hairline}`。

**`card-startup-perk`**——初创企业计划福利网格项。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xl}`，边框 `1px solid {colors.hairline}`。

**`pricing-card`**——标准定价档位卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `1px solid {colors.hairline}`。

**`pricing-card-featured`**——精选定价档位（Plus 或 Business——紫边框）。
- 背景 `{colors.surface}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `2px solid {colors.primary}`。

### 输入框与表单

**`text-input`**——标准文字字段。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，边框 `1px solid {colors.hairline-strong}`，圆角 `{rounded.md}`，内边距 `{spacing.sm} {spacing.md}`，高度 44px。

**`text-input-focused`**——激活状态。
- 边框变为 `2px solid {colors.primary}`（紫）。

**`search-pill`**——搜索栏。
- 背景 `{colors.surface}`，文字 `{colors.steel}`，排版 `{typography.body-md}`，圆角 `{rounded.md}`，高 44px，边框 `1px solid {colors.hairline}`。

### 标签页

**`pill-tab`** + **`pill-tab-active`**——用于顶层切换的胶囊式标签导航。
- 非活动：文字 `{colors.steel}`，边框 `1px solid {colors.hairline}`，内边距 `{spacing.xs} {spacing.md}`，圆角 `{rounded.full}`。
- 活动：背景 `{colors.ink-deep}`，文字 `{colors.on-dark}`。

**`segmented-tab`** + **`segmented-tab-active`**——下划线式标签导航。
- 非活动：文字 `{colors.steel}`，无边框。活动：文字 `{colors.ink}`，底部 2px `{colors.ink}` 边框。

### 徽标与状态

**`badge-purple`**——紫色状态徽标（匹配主要 CTA）。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.caption-bold}`，圆角 `{rounded.full}`，内边距 `4px 10px`。

**`badge-pink`**——粉色强调徽标。
- 背景 `{colors.brand-pink}`，文字 `{colors.on-primary}`，排版 `{typography.caption-bold}`，圆角 `{rounded.full}`，内边距 `4px 10px`。

**`badge-orange`**——橙色强调徽标。
- 背景 `{colors.brand-orange}`，文字 `{colors.on-primary}`，排版 `{typography.caption-bold}`，圆角 `{rounded.full}`，内边距 `4px 10px`。

**`badge-tag-purple`**——柔和紫色功能标签片。
- 背景 `{colors.card-tint-lavender}`，文字 `{colors.brand-purple-800}`，排版 `{typography.caption-bold}`，圆角 `{rounded.sm}`，内边距 `2px 8px`。

**`badge-tag-orange`**——柔和橙色功能标签。
- 背景 `{colors.card-tint-peach}`，文字 `{colors.brand-orange-deep}`，排版 `{typography.caption-bold}`，圆角 `{rounded.sm}`，内边距 `2px 8px`。

**`badge-tag-green`**——柔和薄荷色功能标签。
- 背景 `{colors.card-tint-mint}`，文字 `{colors.brand-green}`，排版 `{typography.caption-bold}`，圆角 `{rounded.sm}`，内边距 `2px 8px`。

**`badge-popular`**——“最受欢迎”档位指示。
- 背景 `{colors.primary}`，文字 `{colors.on-primary}`，排版 `{typography.caption-bold}`，圆角 `{rounded.full}`，内边距 `4px 10px`。

**`promo-banner`**——顶部导航**上方**的浅色促销条带。
- 背景 `{colors.surface}`，文字 `{colors.ink}`，排版 `{typography.body-sm-medium}`，内边距 `{spacing.sm} {spacing.md}`。（“开发者：5 月 13 日，抢先了解我们全新的开发者平台。”）

### 表格

**`comparison-table`**——定价功能对比表。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，排版 `{typography.body-sm}`，圆角 `{rounded.md}`，边框 `1px solid {colors.hairline}`。

**`comparison-row`**——单个功能行。
- 背景 `{colors.canvas}`，文字 `{colors.ink}`，内边距 `{spacing.md} {spacing.lg}`，底部边框 `1px solid {colors.hairline-soft}`。

### 文档组件

**`workspace-mockup-card`**——首屏带上嵌入的 Notion 工作空间 UI 模拟图（“Ramp HQ”看板）。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，边框 `1px solid {colors.hairline}`，深阴影 `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px`。承载真实 Notion 产品 UI 模拟图。

**`testimonial-card`**——客户证言卡片。
- 背景 `{colors.canvas}`，圆角 `{rounded.lg}`，内边距 `{spacing.xxl}`，边框 `1px solid {colors.hairline}`。

**`logo-wall-item`**——客户标志字标单元。
- 透明背景，文字 `{colors.steel}`，排版 `{typography.body-md-medium}`，内边距 `{spacing.lg}`。

**`faq-accordion-item`**——FAQ 面板。
- 背景 `{colors.canvas}`，圆角 `{rounded.md}`，内边距 `{spacing.xl}`，底部边框 `1px solid {colors.hairline}`。

**`stat-row`**——带条形图可视化的统计条带（“更多生产力，更少工具。”）。
- 背景 `{colors.surface}`，文字 `{colors.ink}`，圆角 `{rounded.lg}`，内边距 `{spacing.section-sm}`。

**`cta-banner-light`**——浅色表面 CTA 横幅。
- 背景 `{colors.surface}`，文字 `{colors.ink}`，圆角 `{rounded.lg}`，内边距 `{spacing.section}`。

### 导航

**顶部导航（营销）**——吸附白色栏。
- 背景 `{colors.canvas}`，高约 64px，底部边框 `1px solid {colors.hairline}`。
- 左侧：Notion“N”标志 + “产品 / AI / 解决方案 / 资源 / 企业 / 定价 / 申请演示”链接。
- 右侧：“免费使用 Notion”紫色按钮 + “登录”链接。

### 标志性组件

**`hero-band-dark`**——深海军蓝首屏带，含嵌入工作空间模拟图及装饰圆点/线条。
- 背景 `{colors.brand-navy}`，文字 `{colors.on-dark}`，内边距 `{spacing.hero}`。
- 布局：居中标题 `{typography.hero-display}`、副标题、按钮行（紫色 `button-primary` + `button-secondary-on-dark`），下方为 `workspace-mockup-card`。
- 氛围装饰：首屏内容周围散布彩色便利贴圆点及网格线插图（**不是**字面意义的图案填充——按页面用 SVG/插图处理）。

**`footer-region`**——多列浅色页脚。
- 背景 `{colors.canvas}`，内边距 `{spacing.section} {spacing.xxl}`，顶部边框 `1px solid {colors.hairline}`。
- 6 列链接网格（产品 / 下载 / 资源 / 适用人群 / 公司 / 法律）。

**`footer-link`**——单个页脚链接。
- 透明背景，文字 `{colors.steel}`，排版 `{typography.body-sm}`，内边距 `{spacing.xxs} 0`。

## 应做与不应做

### 应做
- 所有表面的主导 CTA 使用 `{colors.primary}`（紫色）——这是可辨识的品牌信号
- 深海军蓝首屏带（{colors.brand-navy}）搭配紫色按钮 + 装饰便利贴圆点
- 大量使用柔和功能卡片色调（桃、玫瑰、薄荷、薰衣草、天空、黄）
- 高强调“询问助手”式横幅卡片采用 `{colors.card-tint-yellow-bold}`
- 按钮一致应用 `{rounded.md}`（8px）——Notion 使用矩形，而非胶囊
- 所有卡片家族应用 `{rounded.lg}`（12px）
- 所有 UI 表面保持 Notion-Sans
- 首屏带使用工作空间模拟卡片，展示真实产品 UI

### 不应做
- 不要将紫色用于正文或大面积背景表面
- 不要使用胶囊按钮；Notion 几何是稳重矩形
- 不要混淆链接蓝（{colors.link-blue}）和主要紫色（{colors.primary}）——它们角色不同
- 不要给平面文档卡片施加厚重阴影
- 不要将 Notion-Sans 替换为普通 Inter

## 响应式行为

### 断点
| 名称 | 宽度 | 主要变化 |
|---|---|---|
| 手机（小） | < 480px | 单列。首屏 36px。定价每行 1 个。 |
| 手机（大） | 480 – 767px | 功能卡片每行 2 个。首屏 48px。 |
| 平板 | 768 – 1023px | 双列功能网格。首屏 56px。 |
| 桌面 | 1024 – 1279px | 4 档定价卡片行。首屏 72px。 |
| 宽屏桌面 | ≥ 1280px | 完整 80px 首屏呈现。 |

### 触控目标
- 按钮有效高度 40–44px
- 表单输入框高度 44px
- 胶囊标签页约 32px → 移动端 44px

### 收缩策略
- **促销横幅**保持全宽；< 480px 时截断
- **顶部导航**低于 1024px 时收起为汉堡菜单
- **首屏带**：移动端工作空间模拟卡片移到文字/按钮下方
- **定价档位**：4 列 → 平板 2 列 → 手机 1 列
- **功能卡片**：桌面每行 3 个 → 平板 2 个 → 手机 1 个
- **首屏排版**：80px → 56px → 48px → 36px
- **页脚**：桌面 6 列 → 平板 3 列 → 手机折叠面板

### 图像行为
- 工作空间模拟卡片保持宽高比
- 功能卡片内柔和彩色插图按比例缩放
- 客户标志墙：字标高度一致为 60–80px

## 迭代指南

1. 每次聚焦一个组件
2. 直接引用组件名及令牌
3. 编辑后运行 `npx @google/design.md lint DESIGN.md`
4. 新变体作为独立 `components:` 条目加入
5. 正文默认 `{typography.body-md}`
6. 保持 `{colors.primary}`（紫）为主要 CTA——与行内链接 `{colors.link-blue}` 区分
7. 按钮（矩形）使用 `{rounded.md}`，卡片使用 `{rounded.lg}`，`{rounded.full}` 仅用于胶囊标签页/徽标

## 已知缺口

- 除首屏带外，未呈现具体深色模式令牌值
- 未提取动画/过渡时长；建议 150–200ms ease
- 未明确捕获表单校验成功状态
- 柔和色调映射（哪个功能用哪个色调）基于观察——实际品牌库可能有更多条目
