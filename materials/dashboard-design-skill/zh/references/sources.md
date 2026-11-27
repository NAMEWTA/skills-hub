# 参考来源（各自最值得借鉴的部分）

研究时间为 2026 年 10 月；以下均是我们自己的表述，与所列产品没有隶属关系。进行重大重设计之前，应重新查看仍在线的产品，它们可能已经变化。

## 书籍与研究

2026 年 10 月，通过作者公开发表的论文与规格，以及可靠的书籍摘要进行研究；没有转载书籍原文。相关规则见 [perception.md](perception.md)。

- **Stephen Few** — *Information Dashboard Design*（2006/2013）：十三种常见错误、单屏监测、每个数字都要有对比背景。perceptualedge.com 上的文章：“Why Most Dashboards Fail”（2007，监测的阅读顺序；灰色界面配一个红色异常标记）、“Practical Rules for Using Color in Charts”（2008，九条原则：三档强度、数量采用单一色相、避免红绿搭配、不加特效）、“Bullet Graph Design Specification”（2013）。
- **Edward Tufte** — *The Visual Display of Quantitative Information*：数据墨水比、图表垃圾、说谎因子、小倍数图；迷你趋势图见 *Beautiful Evidence*。
- **Cole Nussbaumer Knaflic** — *Storytelling with Data*：去除杂乱、有节制地使用前注意特征、“目光首先落在哪里？”的测试。
- **Steve Wexler、Jeffrey Shaffer、Andy Cotgreave** — *The Big Book of Dashboards*：重视场景而非模板；答案优先，相关指标分组。
- **Cleveland & McGill**（1984、1985），经 **Nielsen Norman Group** 的“Dashboards: Making Charts and Graphs Easier to Understand”介绍：位置和长度优于面积和角度；颜色用于类别而非表示数量大小；监测界面不要用仪表盘、3D 或树图。
- **Tableau 眼动追踪研究**（2016–2018）：大数字更早、更容易被看见；顶部获得最多注视时间；重复元素上的注意力逐渐下降。这是供应商研究，只作为方向性证据。
- **Lisa Charlotte Muth，Datawrapper** — “Which color scale to use”：顺序色阶与发散色阶（需要有意义的中点）、分档与连续色阶（阈值、可读区间）。
- **IBM Carbon** — 展示型与探索型仪表盘、F 形扫视优先级、各处同一数据集统一颜色、留白。
- **WCAG 2.2** — 1.4.1（不能只靠颜色）、1.4.11（数据标记的 3:1 对比度）、1.4.3（图中文字）、1.1.1（每张图都要有文字替代）。

## Apple（WWDC 讲座：文字记录，以及从视频截取的关键画面）

- **Design an effective chart**（WWDC22）：根据真实数据选图形标记；固定与动态坐标范围；约四条、间隔符合直觉的网格线；标题写结论；放大触控区域；颜色均衡、名称可区分且绝不单独承载意义；语音标签先说上下文。
- **Design app experiences with charts**（WWDC22）：何时需要图表（随时间变化、整体中的部分、相互比较）；宏观／中观／微观摘要可作为可点击的统计指标；第一眼 → 交互 → 展开并保持连续性；采用熟悉的形式，有意识地表达差异。该讲座建议用完整句子描述每张图；为了保持界面少文字，本技能把这些信息放入标题数字和工具提示。
- **Bring accessibility to charts in your app**（WWDC21）：图表作为可导航容器，通过 `AXChartDescriptor` 提供声音图形，长系列按时间区间分组，避免红绿和蓝黄两组易混颜色。
- **Writing for interfaces**（WWDC22）：目的、预期、上下文、共情；用视觉承载含义；明确的操作标签；能够引导的空状态；指出修复办法的错误状态；术语表；本地化。
- **Explore pie charts and interactivity in Swift Charts**（WWDC23）：饼图用于轻量的部分占整体，圆环中心标签、选中时弱化其他部分、长系列可滚动。
- **Bring Swift Charts to the third dimension**（WWDC25）：仅当数据真正有三个维度、需要通过旋转探索，且形状比精确值更重要时才使用 3D。

## 设计师

2026 年对设计师在 X 发布的 64 条仪表盘帖的研究（Marcel Kargul、Sajibur Rahman、Sujon、ln_dev7、Toby Belhome、Salung Prastyo、Bagus Fikri 等），包括统计与值得借鉴的做法，见 [inspiration.md](inspiration.md)。

- **Marcel Kargul**（Kargul Studio；x.com/marcelkargul）— 大量已交付的仪表盘作品：浅灰页面与白色卡片、胶囊形工具栏、单色图标方块和单词基准的 KPI 卡片、圆角数字胶囊热力图、中心数值和百分比图例的环形图（表示一个占比，而不是当仪表盘）、带实色端帽的浅色堆叠柱、仅展示一个大数值的深色工具提示，以及表示总体构成的分段胶囊。它是“页面自己就能说清楚”的最佳例子。

## 分析类产品（在线演示）

- **Plausible** — plausible.io/plausible.io — 被选中指标卡的填充、分组日期菜单和字母快捷键、日期菜单内的对比选项、克制的单色相图表、同时展示两个周期的工具提示。
- **Fathom** — usefathom.com/demo — 含预设侧栏和柔和范围带的双月日期选择器；尚未结束的一天用点线；“+ Add comparison”标签；事件表包含转化率和价值列。
- **Simple Analytics** — simpleanalytics.com/simpleanalytics.com — 大号浅色数字、灰色的 0% 差值、日历上方的预设胶囊、时区页脚。
- **DataFast** — datafa.st（公开演示与试用账户）— 访客趋势上的营收柱（右侧美元坐标轴）、销售峰值旁的来源 Logo、用完整句子写的 Insights 页面（购买前访问次数／天数／小时、工作日×小时热力图）、“Now”时间范围、推荐筛选标签、空状态遮罩下的示例数据、“Set up with AI”可复制提示词、3D 实时地球仪、Goal/Funnel/User/Journey 标签。案例研究：[case-study-datafast.md](case-study-datafast.md)。
- **Pirsch** — pirsch.pirsch.io — 对比菜单（前一周期、去年同期、匹配星期几）；排名条目底部使用细线条。它也展示了原生日期输入看上去像未完成控件的情况。
- **Vemetric** — app.vemetric.com/public/snappify.com — 指标卡中的色块同时作为图例；多指标叠加。
- **OpenPanel** — demo.openpanel.dev — 每张指标卡带迷你柱状图；自然语言筛选输入框。
- **GoatCounter** — 每行配一张迷你趋势图和涨跌差。
- **Matomo** — 在周期弹窗里同时提供对比复选框与 Apply（整体设计相对老旧且密集）。
- **Databuddy、Cabin、Counter.dev、Swetrix、PostHog、Umami、Mixpanel** — 补充案例（预设横条、堆叠柱、错误状态、百分比胶囊）。

## 营收与 SaaS

- **Baremetrics** — demo.baremetrics.com — 日期选择器展示各预设解析后的具体日期；醒目数字旁显示“之前为 $X”；MRR 历史行（1／3／6／12 个月前）；目标进度条用文字表示进度；实时资金动态。
- **TrustMRR** — trustmrr.com/stats — 每行一条 3 px 的细线，右侧显示百分比；用“已验证”建立可信感。
- **Shopify** — 细条末端显示数值；上一周期以点线叠加。
- **Mercury** — 收入与支出的细点状轨道条；保留小数位。
- **Stripe、Lemon Squeezy、Polar、Lago、Metronome、RevenueCat、ProfitWell** — 金额格式、收入与成本之间的阴影差值（Polar）、“数据与其他系统不同的原因是……”这样的真实性说明（RevenueCat）。

## 设计系统

- **Tremor** — KPI 卡片、面积图约定（其 BarList 使用了应避免的整行带色背景样式）。
- **shadcn/ui** — 日期范围日历（柔和范围带、实色端点日）、带日期范围选择的图表卡片页头。
- **Untitled UI** — 左侧预设列加双月日历、今天日期的环形标记。
- **React Aria** — 可访问的 DateRangePicker：网格角色、键盘操作（方向键、PageUp/Down、Home/End）。
- **Radix Themes** — 模式切换的分段控件（灰色轨道、凸起的白色滑块）。
- **Material 3、Ant、Carbon、Atlassian、Mantine** — 日期文本输入切换、格式掩码输入、图表结构核对清单。
- **Apple HIG（图表）** — 强调唯一重要的数据系列，避免装饰。

## 灵感画廊

- **SaaSFrame、Dribbble**（热门“analytics dashboard”“date range picker”“KPI cards”）— 适合观察紧凑日期选择器的模式；同时是应该避免的“AI 风格”症状（玻璃效果、霓虹、3D 图标、三块扇形圆环）的典型集合。

## X 上的设计师（2026 年 11 月 9 日搜索“dashboard design”及“saas dashboard ui”的热门帖子）

近期最优秀的仪表盘来自一小群发布完整作品而非模板的设计师。重设计之前，应查看他们的实时帖子；以下是我们自己的总结。

- **Akanksha（@uiakanksha_），“Meridian”**（2026 年 11 月 9 日）— 带刻度条的嵌套目标卡片、带涨跌标签的统计指标条、阴影斜线填充的 MRR 变化条、单一青绿色面积图配深色工具提示、分组侧栏（Analytics / Planning / Workspace），Targets 旁有“3/4”计数。它是 components.md 中目标卡片模式的参考。
- **Marcel Kargul（@marcelkargul，Kargul Studio）** — “this is the perfect dashboard design”（2025 年 10 月，1200 赞、11.6 万浏览）：钱包卡片带刻度条，用紫／橙／绿柱体表示影响，“This Month / 60D / 90D”分段日期范围。他还在 2026 年 10 月发布免费的仪表盘 Figma 文件，可研究间距、排版和布局。
- **rico（@_heyrico，ace design）** — “Dashboard design cheatsheet”（2026 年 2 月）：14 px 基础文字、16 px 图标、1 / 1.2 / 1.5 描边，优先 medium 而非 semibold。他的仪表盘将深色侧栏与相同刻度条结合。
- **Augustas（@AugustasDesign）** — 基于 shadcn 的开源布局“square-ui”（LN，@ln_dev7）的设计者；提供免费的 Figma 文件和可运行的 Next.js 实现。
- **Josh tried coding（@joshtriedcoding）** — 借鉴 Cloudflare 仪表盘的一项小交互，用他的话说能让 UI 体验明显变好；回复里把它与 Vercel 侧栏的预览交互作对比。重点在细节而非布局。

这些作品的共性（现已写进本技能）：安静的浅色表面与细线、大数字旁紧贴目标、细刻度条取代厚实色块、图表保持单一色相、涨跌差显示为小胶囊、14 px 字号。

同一批搜索结果中应保持怀疑的内容：没有真实在线产品的“完美仪表盘”“设计师收 $5,000”帖子、AI 生成的多页演示，以及靠霓虹／玻璃概念收获点赞却违反真实性原则的设计。
