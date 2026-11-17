# 设计 Token

亮色和暗色的每种颜色都只定义一次，然后使用 Token + Alpha 产生淡色填充（如 `bg-accent/10`），让填充色自动随主题变化。以下是一套起始定义（Tailwind v4 的 `@theme`；使用普通 CSS 变量也同样适用）：

```css
@import "tailwindcss";

@theme {
  --color-page: #f8f8f6;        /* app background */
  --color-card: #ffffff;        /* panels */
  --color-soft: #f1f1ef;        /* hover, segmented track */
  --color-side: #f3f3f1;        /* sidebar */
  --color-ink: #17171a;         /* primary text */
  --color-ink-2: #48484d;       /* secondary text, unselected values */
  --color-muted: #66666d;       /* labels, axes; >= 4.5:1 on every light surface */
  --color-line: rgb(0 0 0 / .075);        /* hairlines, bar tracks */
  --color-line-strong: rgb(0 0 0 / .14);  /* inputs, disabled text */
  --color-accent: #3e63dd;      /* traffic metrics, selection, focus */
  --color-on-accent: #ffffff;
  --color-money: #0f7f57;       /* revenue metrics */
  --color-up: #0f7f57;          /* good change */
  --color-down: #d23f45;        /* bad change on a meaningful base */
  --color-warn: #c98a00;        /* below threshold: heatmap warn tier, overdue chips */
  --color-tip: #1f2530;         /* tooltip surface */
  --color-live: #12a150;        /* live dots */
  --shadow-card: 0 1px 2px rgb(0 0 0 / .04), 0 1px 1px rgb(0 0 0 / .02);
  --shadow-pop: 0 12px 32px -8px rgb(0 0 0 / .18), 0 0 0 1px rgb(0 0 0 / .06);
}

/* dark: same names, new values. Follows the system unless the app pins a theme with data-theme. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-page: #0b0b0d; --color-card: #141417; --color-soft: #1c1c20; --color-side: #101013;
    --color-ink: #f3f3f5; --color-ink-2: #c4c4ca; --color-muted: #8c8c95;
    --color-line: rgb(255 255 255 / .08); --color-line-strong: rgb(255 255 255 / .16);
    --color-accent: #7b96ff; --color-money: #34c48b; --color-up: #34c48b; --color-down: #ff6b70;
    --color-warn: #f6b100; --color-tip: #2a3548;
  }
}
:root[data-theme="dark"] { /* the same dark values again, for a pinned dark theme */ }
```

（将这些深色取值也复制到固定主题的规则里；关键是一个名称对应两种取值。）若要让定义只出现一次，可以使用 `light-dark()` 给每个 Token 赋值（`--color-card: light-dark(#ffffff, #141417);`），并通过 `color-scheme` 决定选择哪种值：`:root { color-scheme: light dark }`、`[data-theme="light"] { color-scheme: light }`、`[data-theme="dark"] { color-scheme: dark }`。

## 规则

- 两个语义色相承载意义：`accent`（流量、人员、选中）与 `money`（营收），再加上表示“低于阈值”的 `warn`。其他颜色使用墨色、弱化色和分隔线。引入第三种色相必须有理由（例如第三种数据实体），不能只是装饰。
- 三个强度分别负责三种用途（Few）：**浅色（pale）**（Token 的 7–20%）用于非数据和弱化元素，例如轨道、柱体填充、正常的热力图档位及头像底色；**中等强度（medium）**（Token 原色）用于数据标记；**亮色或深色（bright or dark）**仅用于需要关注之处。整屏都是中等和高强度，就再也没有可用来强调的东西。
- 热力图档位使用 Token + Alpha，从而适应亮、暗主题：正常档在卡片背景上使用 `accent` 的 26 / 15 / 7%，异常档使用 30% 的 `warn` 配深色文字。
- 淡色填充使用 Token + Alpha：选中态 `bg-accent/[.06] ring-accent/20`，日期范围带 `bg-accent/10`，柱体轨道 `bg-line/70`，悬停 `bg-soft/70`。
- 在亮、暗两种主题下，检查弱化文字在每一种实际背景（卡片、浅色填充、悬停、页面）上的对比度。
- 应用内的主题设置会覆盖系统配色；验证深色模式时，也要实际切换应用的主题。

## 密度标准（2026 年设计师共识）

基础文字为 **14 px**（密集表格和次级行可用 13 px），图标 **16 px**，描边粗细 **1 / 1.2 / 1.5**（导航列表用 1、默认用 1.2、选中或独立展示用 1.5）；字重通常用 regular 和 medium，semibold 仅用于页面标题或醒目数字。rico 在 2026 年 2 月的速查表中认为这是专业仪表盘与模板化界面的分界；如能全局保持一致，也可以接受 13 px 的基础字号。同一行图标绝不要混用描边粗细。
