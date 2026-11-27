<a id="explainer-authoring"></a>

# 解释页创作

讲解页把具有结论和一定结构的答案（解释、比较、决策、诊断、审查或计划）转成一页内容。页面以结论开头，用面板展示理由：图、表格、步骤和短文。何时生成页面（默认 `proactive` 模式、`on-demand` 及主动选择的 `always-on`）见 Skill 中“选择制品”一节。要求绘制系统时应使用原生图类型。

本指南定义完整草稿语言，直接据此编写草稿。

<a id="draft"></a>

## 草稿

编写一个 Markdown 文件 `candidate.archify.md`。标题后的第一段是直接结论，紧接着的平级列表给出最多四条理由。每个 `##` 标题开始一个面板。

```md
# Why does the first HTTPS visit take an extra round trip? {#tls-first-visit}

The browser and server must agree on keys before any request is sent: **one extra round trip** with TLS 1.3.

- The browser sends its key share in the first message, so one round trip is enough.[](source:rfc8446)
- The server replies with its key share, then its certificate, already encrypted.
- A returning browser can resume and send data immediately.

@answer scope="TLS 1.3 · first visit · no proxy"
@meta locale=en
@source rfc8446 title="RFC 8446: TLS 1.3" url=https://www.rfc-editor.org/rfc/rfc8446

## What is exchanged before the first request? {#handshake}

@sequence id=handshake-flow title="TLS 1.3 full handshake"
| actor browser | Browser | frontend |
| actor server | Server | backend |
| browser | server | ClientHello + key share |
| server | browser | ServerHello + key share | return |
| server | browser | Certificate + Finished (encrypted) | return |
| browser | server | Finished + GET / | emphasis |
| server | browser | 200 OK | return |

@steps id=handshake-steps
| hello | ClientHello | Offers cipher suites and a key share. | handshake-flow | browser |
| reply | ServerHello | Picks a suite and sends its key share; the certificate follows encrypted. | handshake-flow | server |
| done | Finished | Both sides confirm the keys; the request rides along. | handshake-flow | browser |

## How does TLS 1.3 compare with 1.2? {#versions}

| Criterion | TLS 1.2 | TLS 1.3 |
| --- | --- | --- |
| Round trips before data | Two {caution:Slower} | One {good:Faster} |
| Resumed connection | One | Zero {good:0-RTT} |
```

使用[交付](#delivery)中的命令交付。

<a id="rules-that-keep-a-draft-valid"></a>

### 保持草稿合法的规则

- ID 在整份文档中唯一：面板、块、图表和步骤共享一个命名空间。只有步骤、链接或 patch 要定位块时，才给块设置 `id`；callout、facts 和 list 省略它。根据图表内容命名（`handshake-flow`），不要根据所在面板命名（`handshake`）。
- 正文是纯文本。文件路径、glob、`<placeholders>`、运算符和代码用反引号包裹：正文中裸露的 `<`、`>` 或 `*` 会被当作 HTML 或强调而失败。行内代码按字面显示。
- directive 行是管道行，每行一条，列数必须符合文档：`| first | second |`。单元格内部的字面管道写成 `\|`。空行，或下一个 `##`／`@` 行，会结束这些行。
- directive 参数采用 `key=value`；含空格的值使用双引号和 JSON 转义。
- 使用下方紧凑行格式绘制原生图表。只有特殊情况才使用行内 JSON spec。
- 嵌套列表、原始 HTML 和其他 Markdown 扩展会失败，并给出定位诊断，指出行号、组件和修复示例。

<a id="choose-the-form-by-the-shape-of-the-information"></a>

## 按信息结构选择形式

图表替代原本用于描述它的段落。回答涉及关系、流程、按时间发生的交互、层级、历史或数据模型时，把它画出来。典型页面包含结论、一张图，以及一到两个表格或步骤列表。

| 信息结构 | 形式 |
| --- | --- |
| 多方之间按顺序交换消息：协议、请求路径 | `@sequence` |
| 包含步骤和分支的流程：分诊、推出、审批 | `@workflow` |
| 系统组成及其连接 | `@architecture` |
| 层级：目录、模块、分类 | `@tree` |
| 随时间发生的事件：事故、发布 | `@timeline` |
| 带字段和关系的实体 | `@erd` |
| 按多个标准比较选项 | 带 `{good:…}`、`{caution:…}`、`{bad:…}` 单元格的 Markdown 表格 |
| 有顺序的动作、检查或阶段 | `@steps` |
| 阅读者必须执行或验证的事项 | 任务列表，`- [ ] item` |
| 警告、开放问题或关键限定 | `@callout` |
| 几个带标签的事实 | `@facts` |
| 跨项目或随时间的数值比较、整体占比、2×2 优先级、数量流动 | ```` ```mermaid ```` 图表围栏 |
| 一个数值与限制的对照 | `@metric` |
| 仓库中已有的代码 | `@code` |
| 代码变更 | `@diff` 或 ```` ```diff ```` 围栏 |
| 尚不存在的命令、配置或代码 | 普通围栏 |

逐步讲解某张图的步骤应放在该图面板中：面板自动获得占满宽度的 12 列行，使页面能在吸附图旁展示步骤，无需 `span=12`，每一步点亮对应部分。步骤标题使用所指节点的标签，让文字与图一眼对应；详情列说明该处需要做什么。

表格保持两三列，让手机和窄窗口无需横向滚动即可看完整行；更宽的矩阵应拆成主题集中的独立表格。展示可运行行为时，把完整可复制的围栏代码与实际观察到的输出配对，不要只放片段。

简短回答使用小页面：结论加一到两个面板。解释工作原理、诊断或检查清单的问题，通常需要三到五个面板。

<a id="writing"></a>

## 写作

面向会依据页面行动、也可能核查页面的读者写作。使用用户语言。

- 先读到结论；之后每个面板都支撑、限定或应用该结论。没有更多内容需要支撑时就停止。
- 覆盖读者据此行动所需的内容：结论背后的机制、如何验证，以及结论不成立的情况。谨慎读者接下来会问的问题，应获得一个面板、一个表格行或范围说明中的一行；缺少某个事实会让读者误解时，该事实就不是可选的。
- 在点名内部函数、标志或 sidecar 之前，先用读者易懂的话说清具体机制：先说明发生什么以及为何重要，再用反引号标出精确标识（`在用暂存构建替换之前，先备份已有 HTML（\`commitDeliveryPair\`）`）。把不同维度（如输入与输出、默认与主动选择）分开，不要混成一条模糊规则。
- 通过标题或可见标签指代面板、图和示例，不要按布局位置（`left`、`right`、`above`、`below`）指代，因为面板会随屏宽堆叠和重排。
- 每层只承担一种职责：图展示结构或顺序，`@steps` 解释各阶段发生什么或检查什么，表格比较并列情况，文字解释原因或说明边界。不要在正文、节点标签和步骤详情中重复同一句话。
- 标题、面板、图标签和表头对同一事物使用同一个词，优先采用读者自己的用语。正文保持一种主要语言，不混杂半翻译片段；精确代码、CLI 标志、路径和协议名保留在反引号中。页面将正文中的名称与同名节点关联，让读者能在图上指认。
- 结果附带证据：数值带单位，文件带位置，论断带来源。整页适用条件放在 scope 中。局部假设、例外或不确定性紧邻其限定的论断、图表或示例；不要仅为缩短正文而移远。示意值或未经测量的值应在读者看到它的位置标明。
- 对读者无法独立核实的每项论断引用一个 `@source`：协议细节、阈值、基准测试数值、API 行为。无来源的经验法则要明确标为经验法则，或省略。
- 交付前重新计算每个派生数值，并展示一次算式：“1000 次请求中 990 次为 80 ms → P99 = 80 ms；11 次较慢 → P99 = 600 ms。”表格合计必须吻合。
- 动作用祈使句表达，触发条件放在前面：“如果迁移报告 schema 不匹配，重试前先回滚。”
- 需要读者执行或验证时，以检查清单面板结尾：`- [ ] item`，每项一个具体检查。读者可直接在页面勾选。

英文：短句（约不超过 25 个词）、常用词（use、before、to、because），采用有明确执行者的主动语态。

中文：短句，每句不超过约 50 字；优先写“谁做什么、结果是什么”，少用“通过……实现/进行检查/做出决定”这类空转结构；修饰语过长或双动词纠缠时果断拆句；不在中文句子里夹杂可自然表达的英文碎词（真实命令、函数名、协议名放进反引号）；数字后写清边界（超过 3 次、不超过 1 秒）；用可验证的结果代替套话。

<a id="compact-native-diagrams"></a>

## 紧凑原生图表

写出 `@<type> id=<diagram-id> title="..."`，后接竖线分隔行（`@architecture`/`@workflow`/`@sequence` 的领域概念用 `role <type> | <label>`）。每个都会编译为完整的原生 Archify 图，使用原生校验和布局，并可从页面打开完整 Viewer。一个文档最多包含四个原生图。

任何 node、actor 或 entity 行都可在末尾添加 `source:<id>` 单元格，指向已声明的 `@source`；悬停该节点时显示来源，若是仓库文件还会显示固定的源码行，使代码图兼具代码导览作用。

要复用页面中已有解释，可在节点行添加 `block:<id>`，例如 `| api | API | backend | block:api-notes |`，并用 `@prose id=api-notes` 给其段落指定 ID。可引用 prose、callout、list 和 facts 块。悬停或聚焦节点时显示该块当前文字；编辑或修补段落会更新解释，无需修改图。一行末尾可以同时有 `block:<id>` 和 `source:<id>`。

节点与参与者类型：`frontend`、`backend`、`database`、`cloud`、`security`、`messagebus`、`external`（默认 `backend`）。边与消息 variant：`default`、`emphasis`、`security`、`dashed`；Sequence 还接受 `return`。ID 以字母开头，只使用字母、数字、`-` 和 `_`。

在 `@architecture`、`@workflow` 和 `@sequence` 中，通过 `role <type> | <label>` 行重命名领域角色（例如 `role frontend | Draft state`）。节点表示领域概念、工作流阶段、状态类别或日常动作，而非字面意义上的服务器和数据库时，应使用 `role` 行：声明的角色会重命名图例与 Viewer lens，并移除这些类型节点的基础设施角标，同时保留工作流中的 `?` 决策标记。角色标签为纯文本（最多 80 字符，不含 `{...}` 大括号）。

**`@sequence`**：先声明 actor，再按顺序声明消息。

```md
@sequence id=cache-read title="Cache miss"
| actor api | Order API | backend |
| actor redis | Redis | database |
| api | redis | GET order:42 |
| redis | api | nil | return |
```

actor 行：`actor <id> | label | type`。消息行：`from | to | label | variant?`，其中 `from` 和 `to` 为 actor ID 或 label。`phase | label` 行在后续消息上打开一个带标题的区域，直到下一个 phase：`phase | TCP handshake (1 RTT)`。

**`@workflow`** 和 **`@architecture`**：先节点，后边。摆放从没有入边的节点开始，沿边从左向右进行。

```md
@workflow id=triage title="Latency triage"
| alert | Alert fires | external |
| split | Check percentiles | backend |
| trace | Compare slow traces | backend |
| fix | Fix the cause | backend |
| alert > split | |
| split > trace | tail only |
| trace > fix | cause found | emphasis |
```

节点行：`id | label | type?`。边行：`from > to | label? | variant?`。节点会扩宽以适配标签，因此每个节点标签应写成自然、便于扫读的短语（约不超过 10 个汉字或 4 个英语单词，避免 `lock+journal+render` 式关键词堆砌），把详情和代码标识交给 `@steps`。节点标签已清楚表达步骤或转换时，省略边标签；否则保持一两个词。以 `?` 结尾的节点标签会绘制为决策；其出边用答案标注（`yes`、`no`、`是`、`否`）。

将流程步骤归为 phase：声明 `lane <id> | label` 行，再在每个 Workflow 节点的第四个单元格给出所属 phase。最多六个节点绘制为一行，phase 标签在上方；更长流程换行为每个 phase 一行。

```md
@workflow id=p99-flow title="P99 triage"
| lane confirm | Confirm the symptom |
| lane locate | Locate the cause |
| alert | P99 up, mean flat | external | confirm |
| window | Align window and percentiles | backend | confirm |
| sample | Sample slow requests | backend | locate |
| fix | Fix and verify | backend | locate |
| alert > window | |
| window > sample | tail grew |
| sample > fix | cause | emphasis |
```

Architecture 允许十二列。互相通信的组件使用 `@architecture`；读者要依次执行的步骤使用 `@workflow`。

**`@tree`**：每个节点一行，`id | label | parent`；根节点的 parent 是 `-`。

```md
@tree id=package-layout title="Package layout"
| root | archify | - |
| bin | bin | root |
| explainer | explainer | root |
```

**`@timeline`**：可选 lane 行，随后事件：`id | ISO time with offset | title | lane? | kind?`。kind 包括 `default`、`change`、`alert`、`action`、`recovery`。

```md
@timeline id=incident title="Checkout incident"
| lane ops | Operations |
| deploy | 2026-10-01T10:00:00+08:00 | Deploy v2 | ops | change |
| alarm | 2026-10-01T10:12:00+08:00 | Error rate alarm | ops | alert |
```

简写时间线标为示意，并以 UTC 显示时间。

**`@erd`**：先实体，再字段，最后关系。

```md
@erd id=order-model title="Orders"
| entity user | User |
| entity order | Order |
| user.id | bigint | pk |
| order.id | bigint | pk |
| order.user_id | bigint | fk | user.id |
| order > user | many:one | placed by |
```

字段行：`entity.field | type | keys? | references?`，键 `pk`、`fk`、`uk` 以逗号分隔。关系行：`from > to | one:one|one:many|many:one|many:many | label?`。

其他原生类型（`dataflow`、`lifecycle`、`class`、`waterfall`），以及需要显式几何的图表，使用同目录 spec 文件：`@diagram dataflow source=events.dataflow.json`，按照 Skill 的原生创作流程编写。

<a id="charts"></a>

## 数值图表

一个 ```` ```mermaid ```` 围栏根据数字绘制图表：`pie`、`xychart-beta`（柱状和折线）、`quadrantChart`、`sankey-beta`、`radar-beta` 或 `venn-beta`。页面按当前主题将其渲染为静态 SVG。可选 `title="..."` 成为图题。

````md
```mermaid title="Latency before and after the release (ms)"
xychart-beta
  x-axis ["Mean", "P50", "P99"]
  y-axis "ms" 0 --> 700
  bar "Before" [80, 75, 80]
  bar "After" [88, 76, 600]
```
````

为每个系列命名（`bar "Before" [...]`），让图表获得图例。条形显示数值，饼图图例显示每个数值及其占比。排名项目或较长类别名称使用 `xychart-beta horizontal`。在手机宽度（约 390px）下，轴刻度、系列数量和标注仍应清晰，不要换行成拥挤行或截断图例；标签争夺空间时，拆分过载的多系列比较。数值体现主要观点时，例如一项激增而其他项持平、前后比较或占比，应画成图，让对比一眼可见；图下表格只补充每个数值需要的文字。把对比放在同一图中，例如前后的 mean、P50 和 P99。

数据位于草稿目录中的 CSV 或 JSON 文件时，使用 `@chart type=bar|line|pie data=latency.csv x=day y=p50,p99 unit=ms title="..."`。`x` 指定类别列，`y` 指定一个或多个数值系列列（饼图使用第一个）。CSV 需有表头行；JSON 为对象数组。文件在交付时读取并冻结，条形图或折线图最多 60 条记录，饼图最多 12 条。空数值单元格会失败，而非变成零：补齐缺失值，或删除该行并在图注说明遗漏。

类别标签、系列名和单位中的双引号及反斜杠按字面显示。包含逗号或换行的 CSV 字段必须加引号，字面的双引号用 `""` 转义；引号内的 CRLF、CR 或 LF 保持为多行标签，不会拆成另一条记录。未闭合引号、闭引号后的多余文字、重复选择的列、列数不匹配、控制字符、Unicode 行/段落分隔符（`U+2028`/`U+2029`；请用 LF）、孤立代理项或纯空白标签，会使交付失败并给出带位置的诊断，同时保留此前输出，不会静默改变标签。显示时会去掉各标签行首尾的普通空白，并把制表符或连续空格压缩成单个空格，但不会修改冻结的源文件。

图表与文字一样，需要在图题或 scope 中说明数字来源：实测、来自某来源、估计或示意。含空格或非 ASCII 文字的标签全部加引号。Mermaid 的流程图、时序图、类图、ER、状态图、时间线和思维导图，应改用上面的原生简写，让 Archify 校验并允许读者探索。

<a id="directive-reference"></a>

## Directive 参考

内联图继承页面 locale，除非自行设置。Explainer 阅读控件对中文 locale 使用中文，其他 locale 使用英语。

| 指令 | 头部参数 | 行 |
| --- | --- | --- |
| `@answer` | `scope="..."`，可选 `span=1..12`（精确桌面列数，与面板跨度相同） | 无 |
| `@meta` | `locale`（随附图 Viewer 语言目录包括 `en`、`zh-CN`、`zh-TW`、`es`、`ko`、`ar`、`ru`）、`quality_profile`、`style`（`clean`、`editorial`、`product`、`swiss`；读者可切换）、`repo_url`、`repo_revision` | 无 |
| `@source <id>` | `title`、`url`，或带 `lines=start:end` 的 `path` | 无 |
| `@steps` | `id` | `id | title | detail? | diagram-id? | node? | from~to? | edge-ids?`（node 和 route 互斥） |
| `@callout` | `id`、`level=note|warning|open-question`、`title` | 每行一个单元格；各行连接成段落 |
| `@facts` | `id` | `label | value` |
| `@metric` | `id`、`label`、`value`、`limit`、`unit`、`note`、`typical=true` | 无；必须有 `value` 或 `limit` |
| `@comparison` | `id`、`columns="A,B"`、`label` | `criterion | cell per option` |
| `@prose` | `id`、`text` | 每行一个单元格 |
| `@list` | `id`、`ordered=true` | 每行一个单元格 |
| `@code` | `id`、`source=<source-id>`、`language` | 无 |
| `@diff` | `id`、`caption` | 后接一个 ```` ```diff ```` 围栏 |
| `@image` | `id`、`path`、`alt`、`caption` | 无 |
| `@chart` | `type`（`bar`、`line`、`pie`）、`data`（`.csv` 或 `.json`）、`x`、`y`、`unit`、`title`、`id` | 无 |
| `@<diagram type>` | `id`、`title`、`changes` | 上述紧凑行 |
| `@diagram <type>` | `id`、`source`、`title` | 无 |

普通段落、平级列表和 Markdown 表格不需要 directive。表格首个表头单元格命名行标签列；比较单元格可以以 `{good:Label}`、`{caution:Label}` 或 `{bad:Label}` 结尾，行标签可带 `{#row-id}`。只标记决定比较结果的单元格，通常每行一到两个；每格都有徽标会造成噪声。

普通围栏（```` ```bash title="Run the tests" ````）是带复制按钮的字面片段。`@code` 从来源的 Git commit 和行号范围取得真实摘录，不接受作者输入的代码文本。`@image` 嵌入路径受约束的本地 PNG、JPEG、GIF 或 WebP。

<a id="inline-links-and-sources"></a>

## 行内链接与来源

支持 `**bold**`、行内代码和安全 HTTP(S) 链接。`[Redis](node:cache-read.redis)` 和 `[path](route:cache-read.api~redis)` 在已有目标处打开原生查看器。`[details](block:next)` 在页面内跳转。

`[reference text](source:docs)` 渲染文字及其后的数字上标；`[](source:docs)` 只渲染上标。编号按首次出现顺序；未引用来源随后按声明顺序排列。页脚列出标题与 URL 或仓库位置。

```md
@source router title="Request handler" path=src/router.js lines=10:30
@code source=router language=js
```

代码摘录传入 `--repo-root /path/to/repository`。提供后，读者悬停引用时，每个带行范围的仓库引用还会显示固定的源码行；无法验证的来源保持普通引用。工具解析 origin 和 HEAD，或接受 `@meta repo_url=... repo_revision=<full-commit>`。commit、路径和行号范围必须存在；工作树修改不能替代已经提交的字节。

`[5 ms](typical:Description of the value)` 成为静态脚注，打印中也保留。

<a id="panels-and-layout"></a>

## 面板与布局

每个面板标题优先使用一个具体问题。`{#id}` 提供稳定 ID，用于链接和面板替换；`{#id span=7}` 将宽度固定为 1–12 列中的指定值。省略 span：页面会测量各面板并规划布局，保持来源顺序，让结论位于左上，为每张图分配足够宽度以便标签可读，并防止表格和代码被裁切。没有 JavaScript 时使用静态宽度；窄屏和打印采用堆叠面板。

若两个示例需要在结论下方并排开始，使用 `@answer span=12`，并在各示例面板设置 `span=6`。可选的 answer span 与面板一样取 1–12 列；手机布局仍会全宽堆叠。省略它可自动放置。

<a id="delivery"></a>

## 交付

```sh
node archify/bin/archify.mjs finalize explainer candidate.archify.md answer.html --json
```

通过后，回复本身仍须清晰：先用一至三行说明结论，最后一行再放页面的 Markdown 链接，标题用用户语言描述，例如 `[查看测试报告](/abs/path/test-report.html)`。不要列举门禁，不要用目录、日志或 `--open` 代替链接。无论页面是用户请求的，还是由 Skill“选择制品”章节的 proactive 或 always-on 模式生成，都采用相同回复形式。Finalize 未通过且停止修复时，以文字回答，说明页面未生成，不提供页面链接。

链接形式：Markdown 目标使用本地绝对路径，含空格时用 `<...>` 包裹，不用 `file://`。不同宿主表现不同。能渲染本地 Markdown 链接的桌面或 IDE 聊天可以点击打开页面；终端界面可能仅显示带样式文字，点击不会打开；例如 Codex CLI 会为 Web URL 生成超链接，但不为本地文件生成（openai/codex#25934、openai/codex#22585）。保留绝对路径，以便手动打开页面；在未亲眼见到该宿主成功打开前，不要告诉用户链接可点击或已经打开。

草稿使用 `@code` 时，添加 `--repo-root <path>`。Finalize 校验、原子交付并检查 HTML；不启动浏览器，回执记录浏览器门禁未运行。失败会指出行号、组件、原因和修复示例；修复草稿，并以同一输出路径重跑。

写作警告应用[写作](#writing)规则：句子超过 50 个中文单位或 28 个英语单词、段落超过四句或 120 个单位、轻动词、套话、开场白与结束语、无边界数量、数值后使用“以上/以下/以内”、存在常用替代词的长英语单词、结论大部分加粗，以及 scope 超过 50 个单位。每条警告指出匹配文字和修复方法；修复不改变含义时应修复。用 `--writing warn|strict|off` 设置严重程度。

<a id="panel-replacement"></a>

## 替换面板

```sh
node archify/bin/archify.mjs patch explainer answer.html next replacement.md revised.html --json
```

替换文件包含一个具有相同稳定 ID 的 `##` 面板；未触及内容和冻结资源保留。改变共享来源、结论或全局文档结构时，对完整草稿重新运行 finalize。
