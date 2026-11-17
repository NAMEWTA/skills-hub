# SwiftUI（iOS、iPadOS、macOS）

SKILL.md 的规则与 components.md 的组件模式适用于所有平台。本文件把它们映射到 SwiftUI 和 Swift Charts，并以模拟器 QA 取代浏览器 QA。目标版本为 iOS 17 / macOS 14 及以上。

## 设计 Token

- 颜色放在资源目录（Asset Catalog），分别定义 Any 和 Dark 外观：`Accent`（流量、人员、选中）、`Money`（营收）、`Warn`（低于阈值）、`Up`、`Down`。其余优先使用系统语义颜色：`.primary`、`.secondary`、`.tertiary`；分隔线来自 `Color(.separator)`（iOS）或 `Color(nsColor: .separatorColor)`（macOS）。
- 淡色填充 = Token 加不透明度：选中态 `Color.accentColor.opacity(0.06)`，日期范围带 `.opacity(0.10)`，占比条轨道 `.quaternary`。
- 数字：所有不断变化的数值使用 `.monospacedDigit()`；文字使用 `.title`、`.headline`、`.caption` 等样式以支持 Dynamic Type，绝不把文字锁死在固定点数。

## 数字

```swift
extension Double {
    var compact: String { formatted(.number.notation(.compactName).precision(.fractionLength(0...1))) } // 1.2K
    var usd: String { formatted(.currency(code: "USD").precision(.fractionLength(0))) }
    /// Share of a total in percent: never "0.0%" for a real but tiny share.
    var share: String { self == 0 ? "0%" : self < 0.1 ? "<0.1%" : self < 1 ? String(format: "%.1f%%", self) : "\(Int(rounded()))%" }
}
```

涨跌规则与 Web 版本一致：没有上期值 → 不显示；上期基数低于约 5 → 用 `.secondary` 显示“之前是 1”；其他情况显示带正负号的百分比，用 `Up` / `Down` 表示含义，`±0%` 使用 `.secondary`。

## KPI 指标格与选中填充

```swift
struct KPITile: View {
    let label: String, value: String, explain: String, delta: Text?, series: [Double]   // delta: "▲ 13% vs Sep"
    let selected: Bool, money: Bool
    var tint: Color { money ? Color("Money") : .accentColor }
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack { Text(label).fontWeight(selected ? .medium : .regular); Spacer(); delta }.font(.subheadline)
            Text(value).font(.title.weight(.semibold)).monospacedDigit().foregroundStyle(selected ? .primary : .secondary)
            Sparkline(values: series, color: selected ? tint : .secondary)   // same window as the main chart
        }
        .padding(12)
        .background(selected ? tint.opacity(0.06) : .clear, in: .rect(cornerRadius: 12))
        .overlay { if selected { RoundedRectangle(cornerRadius: 12).strokeBorder(tint.opacity(0.22)) } }
        .contentShape(.rect)
        .help(explain)                                  // the explanation is a tooltip, never a sub-line
        .accessibilityHint(explain)
        .accessibilityAddTraits(selected ? [.isButton, .isSelected] : .isButton)
    }
}
```

所有指标格应放在一个容器里，由细线（格子间使用 `Divider()`）分隔，而不是分散的悬浮卡片。

## 图表（Swift Charts）

```swift
Chart {
    ForEach(previous) { p in                                     // the period before: grey, dashed, behind
        LineMark(x: .value("Day", p.day), y: .value("Value", p.value), series: .value("Period", "Before"))
            .foregroundStyle(.gray.opacity(0.6)).lineStyle(StrokeStyle(lineWidth: 1.5, dash: [4, 3]))
    }
    ForEach(current) { p in
        AreaMark(x: .value("Day", p.day), y: .value("Value", p.value), series: .value("Period", "Now"))
            .foregroundStyle(.linearGradient(colors: [tint.opacity(0.15), tint.opacity(0)], startPoint: .top, endPoint: .bottom))
        LineMark(x: .value("Day", p.day), y: .value("Value", p.value), series: .value("Period", "Now"))
            .foregroundStyle(tint).lineStyle(StrokeStyle(lineWidth: 2))
    }
    if let day = selectedDay {                                   // hover / scrub hairline with the value
        RuleMark(x: .value("Day", day)).foregroundStyle(.secondary.opacity(0.4))
            .annotation(position: .top, overflowResolution: .init(x: .fit, y: .disabled)) { Tooltip(day: day) }
    }
}
.chartYScale(domain: 0...ticks.last!)                            // ticks = niceTicks(max), ported from snippets.md
.chartYAxis { AxisMarks(position: .leading, values: ticks) { AxisGridLine(); AxisValueLabel() } }
.chartXAxis { AxisMarks(values: .automatic(desiredCount: 6)) }
.chartXSelection(value: $selectedDay)
```

- 圆整刻度：移植 `niceTicks` 并给坐标轴显式传入 `values:`；仅使用 `.automatic(desiredCount:)` 仍可能得到奇怪的刻度值。
- 今天尚未结束的区间：把最后一段画成独立的 `LineMark` 系列，设置 `dash: [2, 3]`。
- 营收视图：金额使用第二套刻度的 `BarMark` 效果很好；访客折线保持在前景。
- 迷你趋势图：复用相同 `Chart`，设置 `.chartXAxis(.hidden)`、`.chartYAxis(.hidden)`，高度约 32；无面积填充或仅使用淡填充。
- 可访问性：为标记提供 `.accessibilityLabel`／`.accessibilityValue`，或者提供完整 `.accessibilityChartDescriptor`，让 VoiceOver 用户访问 Audio Graphs。

## 底部有细占比条的排名列表

```swift
HStack(spacing: 10) {
    icon.frame(width: 16)
    Text(name).lineLimit(1)
    Spacer()
    Text(count, format: .number).monospacedDigit()
    Text(sharePercent.share).font(.caption).foregroundStyle(.secondary).frame(width: 44, alignment: .trailing)
}
.padding(.vertical, 8)
.overlay(alignment: .bottom) {
    GeometryReader { g in
        Capsule().fill(.quaternary)
            .overlay(alignment: .leading) { Capsule().fill(tint.opacity(0.75)).frame(width: max(2, g.size.width * barFraction)) }
    }
    .frame(height: 3)
}
```

## 热力图（班级 × 日期）

```swift
Grid(horizontalSpacing: 6, verticalSpacing: 6) {
    ForEach(rows) { row in
        GridRow {
            Text(row.name).font(.subheadline.weight(.semibold)).foregroundStyle(.secondary).help(row.owner)
            ForEach(row.cells.indices, id: \.self) { i in
                if let rate = row.cells[i] {
                    Text("\(Int(rate.rounded()))").font(.caption.weight(.semibold)).monospacedDigit()
                        .frame(maxWidth: .infinity, minHeight: 34)
                        .background(tierFill(rate), in: .rect(cornerRadius: 9))
                        .foregroundStyle(.primary)                         // never accent text on an accent tint
                        .underline(rate < 85)                              // non-colour cue for the problem tier
                } else {                                                   // not marked: the cell is the action
                    Button { remind(row) } label: { Image(systemName: "bell").frame(maxWidth: .infinity, minHeight: 34) }
                        .buttonStyle(.plain).foregroundStyle(Color("Warn"))
                        .overlay(RoundedRectangle(cornerRadius: 9).strokeBorder(Color("Warn"), style: StrokeStyle(lineWidth: 1.5, dash: [4, 3])))
                        .accessibilityLabel("\(row.name): not marked. Remind \(row.owner)")
                }
            }
        }
    }
}

func tierFill(_ rate: Double) -> Color {                                   // intensity grows toward the problem
    rate >= 95 ? .accentColor.opacity(0.07) : rate >= 90 ? .accentColor.opacity(0.15)
        : rate >= 85 ? .accentColor.opacity(0.26) : Color("Warn").opacity(0.30)
}
```

## 子弹图

```swift
Chart {
    ForEach(ranges.indices.reversed(), id: \.self) { i in                // good (light) behind, poor (dark) in front
        BarMark(xStart: .value("From", 0), xEnd: .value("To", ranges[i]), y: .value("Metric", label), height: .ratio(1))
            .foregroundStyle(.primary.opacity([0.40, 0.25, 0.10][i]))
    }
    BarMark(xStart: .value("From", 0), xEnd: .value("Value", value), y: .value("Metric", label), height: .ratio(0.33))
        .foregroundStyle(.primary)
    RuleMark(x: .value("Target", target)).foregroundStyle(.primary).lineStyle(StrokeStyle(lineWidth: 2))
}
.chartXScale(domain: 0...max).chartYAxis(.hidden).frame(height: 28)
```

## 选中、滚动和圆环图

```swift
Chart(days) { d in
    BarMark(x: .value("Day", d.date, unit: .day), y: .value("Sales", d.sales))
    if let selected, Calendar.current.isDate(d.date, inSameDayAs: selected) {
        RuleMark(x: .value("Selected", selected, unit: .day))
            .foregroundStyle(.gray.opacity(0.3)).zIndex(-1)
            .annotation(position: .top, overflowResolution: .init(x: .fit(to: .chart), y: .disabled)) {
                ValuePopover(day: d)                           // big exact value, muted date line
            }
    }
}
.chartXSelection(value: $selected)                             // hover on macOS, touch on iOS
.chartScrollableAxes(.horizontal)                              // a year of days scrolls; 30 are visible
.chartXVisibleDomain(length: 3600 * 24 * 30)
```

当某一个占比是核心结论时，可以使用圆环图：`SectorMark(angle:, innerRadius: .ratio(0.618), angularInset: 1.5)` 配 `.cornerRadius(5)`，通过 `chartBackground` 和绘图区 Frame 在中心放醒目数值，并在 `chartAngleSelection` 下将未选中扇区设为 `.opacity(0.3)`。

## 可访问性

- Swift Charts 为每个标记提供可访问性元素和声音图形；逐个设置 `.accessibilityLabel`／`.accessibilityValue`，先说上下文并读出完整词语（“6 月 1 日”“36 个松饼”）。
- 自定义图表应采用 `AXChart` 并返回 `AXChartDescriptor`：包含标题、一到两句话的摘要、轴描述（通过 `valueDescriptionProvider` 添加单位），以及每条系列自己的 `AXDataSeriesDescriptor`（折线使用 `isContinuous: true`）。
- 读取 `@Environment(\.accessibilityDifferentiateWithoutColor)`（增加形状）、`\.colorSchemeContrast`（增强颜色对比度）及 `\.accessibilityReduceTransparency`。

## 日期范围

- 使用 `Menu`（或 `.menu` 样式的 `Picker`）展示预设，当前项有勾选：今天、7／30／90 天、12 个月、昨天、本周、本月、上月，最后是“自定义范围…”。
- 自定义范围在 iOS 打开 Sheet，在 macOS 打开 Popover；把 snippets.md 中的单月网格移植成 `LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 0), count: 7))`：两个实色圆形端点之间是柔和范围带，今天有圆点，未来日期禁用，页脚显示“12 天”和“应用”。也可以退而使用两个图形化 `DatePicker` 分别选择起止日期；`MultiDatePicker` 只能选独立的多天，不能选连续范围。
- iPhone 的 Sheet 使用 `.presentationDetents([.medium, .large])`。

## 布局

- 面板：`LazyVGrid(columns: [GridItem(.adaptive(minimum: 320), spacing: 16)])` 随窗口增长增加列数，这是“宽度随屏幕增长”的原生形式（可调整大小的 Mac 窗口、iPad 分屏）。
- KPI 指标条：使用 `ViewThatFits` 从单行指标格切换到双列 `Grid`；当文字放大到无障碍字号（`dynamicTypeSize.isAccessibilitySize`）时，标签和值应上下堆叠，而不是截断。
- iPhone 导航：使用最多 5 个标签页的 `TabView`，或 `NavigationStack` 列表；绝不使用横向滚动导航。
- macOS：使用 `NavigationSplitView` 侧栏 + 内容区；工具栏包含日期范围菜单和筛选器。

## 状态

- 加载中：在真实布局上应用 `.redacted(reason: .placeholder)`。
- 空状态：使用带一个行动按钮的 `ContentUnavailableView`，或明确标注“Sample”的示例数据。
- 旧数据（新日期范围正在加载）：把旧内容保留为 `.opacity(0.4)` 并设置 `.allowsHitTesting(false)`；取消或忽略旧 `Task`（`.task(id: range)` 会自动取消上一任务）。
- 错误：整个屏幕只显示一条横幅，不要每张卡都报一次。
- 动画：只有在 `accessibilityReduceMotion` 为 false 时才执行数字缓动（`.contentTransition(.numericText())`）。

## QA 流程（模拟器）

每次 UI 修改后：构建、运行、截图、查看、修复。全面检查之前，先核对已知总数（qa.md）：使用人工计算了预期答案的固定示例数据，并为每个组件（KPI、图表数据、列表行）建立数值不一致就失败的 XCTest。然后进行全面检查：

```bash
xcrun simctl boot "iPhone 16 Pro"                                             # and a small one (iPhone SE) and an iPad
xcrun simctl ui booted appearance dark                                        # then light
xcrun simctl ui booted content_size accessibility-extra-extra-extra-large    # biggest Dynamic Type; reset to large
xcrun simctl io booted screenshot ~/Desktop/qa-iphone-dark-ax5.png
```

- 尺寸：最小的 iPhone、最大的 iPhone、iPad 竖屏与横屏；Mac 使用窄窗口和宽窗口（`screencapture -l <windowID>`，或在测试中对 View 使用 `ImageRenderer`）。
- 一次开启 Increase Contrast（`xcrun simctl ui booted increase_contrast enabled`），另一次开启 Reduce Motion（模拟器 Settings › Accessibility › Motion）。
- 打开每张截图，执行 qa.md 的一致性检查与异味清单；它们在原生端仍完全适用。
- 使用固定示例数据的 `#Preview` 覆盖每种状态（空、小样本、加载、错误），可在进入模拟器之前抓到大部分问题。
