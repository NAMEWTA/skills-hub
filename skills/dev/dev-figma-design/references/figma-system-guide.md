# Figma 设计

以下规则用于在 Figma 中建立可维护的设计文件。当前工具的实际 API 和用户已有设计系统优先；没有既定规范时采用此完整默认。

- **实际写入前阅读当前可用 Figma 工具的接口说明。** 核对颜色范围、字体加载与布局尺寸；不假设某个工具名、插件或辅助技能已安装。
- 完整页面、组件库与设计变量分别按当前工具能力实施；没有写入能力时交付设计规格，并说明文件尚未修改。
- 精确的设计变量名称与数值见本文件末尾的[设计变量参考](#设计变量参考)。创建或绑定任何变量、文本样式之前，先阅读它。

## 工作流程

1. **先检查文件。** 列出本地变量集合和文本样式，并通过当前工具提供的设计库搜索能力，例如实际可用的 `search_design_system`，搜索变量、样式和组件。先复用已有内容，再创建新内容。
2. **缺少基础项时先建立基础。** 构建任何屏幕之前，创建以下全部内容：
   - `spacing` 与 `radius` 变量。
   - 两个颜色层：先 `Core Colors`，再包含 Light 与 Dark 模式的 `Color System`。
   - 文本样式。

   浅色和深色是变量模式，不是两套硬编码颜色。
   - **在画布上展示设计变量。** 在 `Foundations` 页面放置一个 `Foundations` 框架，就像组件放在各自框架中一样。框架内每个集合都建立一个自动布局区块：
     - `Core Colors`：每个色板一行，每个色阶一个色块。
     - `Color System`：每组一行，用两列显式指定变量模式，并排展示 Light 和 Dark。
     - `spacing`：每个设计变量一根条形，尺寸等于其值。
     - `radius`：每个设计变量一个采用该圆角的正方形。
     - 文本样式：每种样式一行示例。
   - **绑定示例，使其随设计变量更新。** 每个色块填充绑定对应变量；每根间距条和每个圆角示例绑定对应变量；每段文本示例使用对应样式。用户修改设计变量后，框架自动更新。
   - **标签：** 每个示例都标注变量名；`Color System` 还标注别名，例如 `Surface/Primary → Grayscale/870`。文字不能绑定颜色值，因此十六进制颜色标签不会自动更新。创建、重命名或修改设计变量时，同步更新标签。
3. **逐区块构建。** 先首屏，然后每次完成一个区块。不要一口气构建整页。每完成一个区块就截图，修正之后再继续。
4. **各处都使用自动布局。** 每个有子节点的框架都使用自动布局。内边距和间隙绑定间距变量，不手工输入数值。
5. **绑定，不手填。**
   - 每个填充、描边、圆角、内边距和间隙都绑定变量。
   - 每个文本层都使用文本样式。
   - 设计只绑定 `Color System` 设计变量，不直接绑定 `Core Colors`。
6. **完成前自查。** 执行文件末尾清单，修复所有不通过项，然后报告完成了什么、跳过了什么。

## 字体排版

- **字体：** 允许任何字体。使用用户或品牌指定字体；加载前通过 `figma.listAvailableFontsAsync()` 检查。
- 除非用户要求配对，否则**每个文件只用一个字体家族**。只有代码、数据或数字内容，才允许在主字体旁使用 Geist Mono。
- **不使用斜体样式，字重不超过粗体。**
- **字号只来自 Tailwind 比例：** 12、14、16、18、20、24、30、36、48、60、72、96、128。字号位于两个刻度之间时，向下取刻度，并采用该刻度行高。
- **文本样式。** 创建[设计变量参考 → 文本样式](#文本样式)中的命名样式，包括 Heading 1 到 6、Title 1 到 5、Body 1 到 6、Button-lg/md/sm/Xsm、Caption 1 到 5。名称与大小写必须完全一致。
  - 按类型分入文件夹，使面板显示为 `Heading / Heading 1`、`Body / Body 4`、`Button / Button-md`。
  - 每个文本层使用其中一种样式。不单独设置字号或字重；对已应用样式的图层修改字重会使其脱离样式。
- **分组用途：**
  - **Heading：** 页面与区块标题，从大到小。Heading 1 用于首屏。
  - **Title：** 卡片标题、列表项标题、区块起始标签和导航项。
  - **Body：** 连续正文。同一字号内，1 的字重最强，最后一个为常规。
  - **Button：** 只用于按钮内部文字。主按钮使用 Button-md，小型页头按钮使用 Button-sm。
  - **Caption：** 元数据、辅助文本、徽章、时间戳和细则。
- **新增样式。** 项目确有需要时，在所属组增加下一个编号，例如 Body 7，数值来自既有刻度。不发明新名称或比例外字号。
- **文案：**
  - 文本内不使用连字符。
  - 标题末行不单独剩下一个单词。按语义手动换行，直接在文本中换行，不通过缩窄框架挤出换行。
  - 首屏标题（Heading 1）不使用句点，末尾和短语之间都不使用。两个意思用换行分开，例如 `看见低质内容` / `决定修复什么`，而不是 `看见低质内容。决定修复什么。`。

## 间距

- 只使用 `spacing/*` 数字变量：0、2、4、8、12、16、24、32、40、48、64、80、96。不使用中间值。
- 使用 `setBoundVariable` 将 `paddingTop/Right/Bottom/Left` 和 `itemSpacing` 绑定到变量。间距变量采用 `GAP` 作用域，它同时覆盖内边距与间隙。
- 设计值位于两个设计变量之间时，取最近的一个并绑定。
- 主按钮垂直内边距为 8（`spacing/75`），水平内边距为 12（`spacing/100`）。

## 圆角

- 只使用 Tailwind 圆角值（0、2、4、6、8、12、16、24、full），保存为 `radius/*` 变量，作用域为 `CORNER_RADIUS`。分别绑定每个角，例如 `topLeftRadius`。
- **嵌套圆角规则。** 一个形状位于另一个形状内部，且间隙小于 32 时：
  `内圆角 = 外圆角 − 间隙`
  仅在结果大于 2 时应用。例如卡片圆角为 16、内边距为 8，则内部元素圆角为 8。
- 检查每个嵌套框架：读取父框架圆角和内边距，计算子框架圆角，并设置为匹配的 `radius/*` 变量。

## 颜色

### 设计变量结构：每个文件均采用两层

名称和结构固定；十六进制颜色值遵循用户品牌。完整名称清单见[设计变量参考 → 颜色](#颜色-1)。

1. **`Core Colors` 集合：** 原始色板。包含 `Primary`、`Secondary`、`Accent`、`Grayscale`，以及语义色板 `Red`（错误）、`Green`（成功）、`Yellow`（警告）。
   - 每个色板至少 10 个色阶，从接近白色的 `00` 到接近黑色的 `1000`。`500` 是基础色相。
   - 根据品牌基础色生成色阶。
   - 透明色也放在此层，保存为 `Grayscale-Alpha` 色板（`700-16` … `700-80`），不透明度存入变量本身。别名不能增加不透明度，因此 `Overlay/*` 指向这些变量。
2. **`Color System` 集合：** 包含 `Light` 和 `Dark` 模式的语义设计变量。每个值都是指向 Core Color 的别名，不能是原始十六进制颜色。
   - 分组为 `Border/`、`Surface/`、`Action/`、`Text/`、`Icon/`、`Overlay/`。
   - 每种角色有基础变量，以及所需变体：`-Hover`、`-Click` 或 `-Selected`、`-Disabled`、`-Subtle`、`-Inverted`。

- 设计只绑定 `Color System`，更换品牌时只需修改 `Core Colors`。
- 按角色命名变量，不按原始颜色命名，例如不能叫 `Surface/Blue 500`。
- 根据着色对象限定变量作用域：表面用 `FRAME_FILL`/`SHAPE_FILL`，文本用 `TEXT_FILL`，边框用 `STROKE_COLOR`。不要保留 `ALL_SCOPES`。

### 表面

- **深色模式背景只使用：** `#000000` · `#181818` · `#1F1F1F` · `#272727` · `#313131` · `#131209`。
- **背景不使用渐变。** 所有表面为纯色，包括按钮和渐隐叠加层。
- **首屏标题**是唯一渐变例外，只在文字上由左向右渐变：
  - 深色主题 `#FFFFFF` → `#9B9B9B`。
  - 浅色主题 `#000000` → `#666666`。

  两个渐变端点都绑定颜色变量，即在每个端点设置 `boundVariables.color`，使渐变随模式切换。
- **一个强调色**，饱和度保持低于 80%。
- **边框要么环绕四周，要么不用。** 不给卡片添加单侧边框。分隔行时，使用填充为 `Border/*` 变量的 1px 矩形，不用单侧描边。

## 对比度与无障碍

- 正文相对背景至少达到 **4.5:1**。
- 大字（24 及以上，或粗体 18 及以上）和界面部件，包括图标、输入框边框、焦点环，至少达到 **3:1**。
- 渐变标题检查渐变最浅端的对比度，不只检查最深端。
- 状态不能仅靠颜色区分，还应配合图标、标签或字重变化。
- 移动框架的触控目标至少为 44 × 44。
- 品牌色与白字对比度不合格时，为 `Action/*` 变量选择同色板的更深色阶，不修改文字颜色。

## 布局

- 首屏主标题与副标题最大宽度为 **680**。
- 默认不在标题上方添加眉题标签，即小胶囊或小标签，例如 `● 设计质检，并非重新设计`。只有用户要求，或用户上传的灵感图片包含此元素时才添加。
- 桌面框架宽 1440，居中的内容容器宽 1200 到 1280。
- 屏幕需要响应式版本时，增加 768 和 390 宽框架。
- 不默认将三个等宽卡片排成一行。考虑双列交错、不对称网格或便当盒布局。
- 并排卡片的共享元素对齐：标题、价格、列表和按钮应从相同的 Y 坐标开始。

## 图标

- 使用 Phosphor、Solar 或 Iconamoon。不使用 Material Icons 或 Material Symbols。
- 全文件使用一致的描边粗细。
- 以 SVG 导入图标（`createNodeFromSvg`），并绑定 `Icon/*` 变量重新着色。不用基本图形重画图标。

## 组件与状态

- 使用超过一次的内容都做成组件。将其文本暴露为组件属性。
- **交互组件**具备 **Default、Hover、Pressed、Focus、Disabled** 变体。输入框另加 **Error** 和 **Filled**。
- **按钮**属于一个组件集，具备以下两个属性，所有组合都齐全（每个尺寸 25 个变体）：
  - `Type` = Primary | Secondary | Tertiary | Error | Warning。
  - `State` = Default | Hover | Pressed | Focus | Disabled。

  填充绑定 `Action/*`，例如 `Action/Primary`、`Action/Primary-Hover`、`Action/Primary-Click`、`Action/Primary-Disabled`；边框绑定 `Border/*`；标签绑定 `Text/*`。Focus 增加可见焦点环，使用 2px 外侧描边，对比度至少 3:1，不只改变颜色。
- **数据视图**具备 **Loading**（与实际布局形状一致的骨架屏）、**Empty**（完整设计的开始使用视图）和 **Error** 状态。

## 动效（仅原型）

- 使用 Smart Animate 和自定义贝塞尔曲线 `0.22, 1, 0.36, 1`：
  - 布局变化 500ms。
  - 颜色或不透明度变化 300ms。
- 不使用 Figma 默认的 linear 或 ease 预设。

## 内容

- 使用实际草稿文案，不放占位文本。
- 虚构原型使用符合产品行业的可信姓名、品牌和数字，并标明虚构。避免可疑整数或“Acme”之类套用名称。真实产品的价格、客户、评价和统计必须有真实依据，缺失时显式标出待补内容。
- **禁止空泛词语：** “颠覆革新”“全面加速”“尖端”“毫不费力”“改变你的工作流”“提升到新高度”“发挥强大力量”“世界级”。
- 标题与按钮使用句首大写风格。

## 落地页

任务是落地页时，还要阅读本地[落地页设计](landing-page-guide.md)，遵循页面结构与文案要求，包括需求采集问题、区块顺序和行动按钮规则。其中包含大字标语区块，以逐词显现作为原型交互；减少动效模式直接显示最终文字。全部所需规则已随本技能提供。

## 文件整洁

- 给每个图层有意义的名称，例如 `Pricing / Card / Pro`。不保留 `Frame 427`、`Group 3`、`Vector` 或 `Rectangle 1`。
- 变量集合为 `spacing`、`radius`、`Core Colors` 和 `Color System`；`Color System` 中包含 `Light`、`Dark` 模式。
- 文本样式使用上述名称，按类型分文件夹。
- 每个区域一个页面：`Foundations`、`Components`、`Screens`。
- 新的顶层框架放在画布空白处，不盖住已有工作。除非用户要求，不删除或移动用户已有图层。

## 检查清单（汇报前执行）

- [ ] 每个文本层使用 Tailwind 比例上的命名文本样式（Heading、Title、Body、Button、Caption）。
- [ ] 每个内边距和间隙绑定间距变量。
- [ ] 每个圆角绑定圆角变量，嵌套圆角符合公式。
- [ ] 每个填充和描边绑定 `Color System` 变量，不用原始十六进制值或 Core Color；Light 与 Dark 模式都正常。
- [ ] Core Colors 每个色板至少 10 个色阶，所有 Color System 变量都是别名。
- [ ] `Foundations` 框架展示每个变量和文本样式，示例绑定变量，标签保持同步。
- [ ] 正文对比度通过 4.5:1，大字和界面部件通过 3:1。
- [ ] 没有背景渐变、单侧边框或斜体。
- [ ] 首屏主标题与副标题宽度上限为 680；首屏标题没有句点；用户未要求且上传灵感图未包含时，不添加眉题标签。
- [ ] 交互组件具备全部状态变体；按钮具备 5 类型 × 5 状态的所有组合。
- [ ] 图标来自 Phosphor、Solar 或 Iconamoon，描边粗细统一。
- [ ] 没有占位文案，没有名为 `Frame` 或 `Group` 的图层。

## 设计变量参考

名称固定。颜色的十六进制值遵循用户品牌；间距、圆角和字体数值固定。

### 间距

集合为 `spacing`，一个模式，类型 `FLOAT`，作用域 `GAP`。

| 设计变量 | 值 |
|---|---|
| spacing/0 | 0 |
| spacing/25 | 2 |
| spacing/50 | 4 |
| spacing/75 | 8 |
| spacing/100 | 12 |
| spacing/200 | 16 |
| spacing/300 | 24 |
| spacing/400 | 32 |
| spacing/500 | 40 |
| spacing/600 | 48 |
| spacing/700 | 64 |
| spacing/800 | 80 |
| spacing/900 | 96 |

### 圆角

集合为 `radius`，一个模式，类型 `FLOAT`，作用域 `CORNER_RADIUS`。

| 设计变量 | 值 |
|---|---|
| radius/0 | 0 |
| radius/2 | 2 |
| radius/4 | 4 |
| radius/6 | 6 |
| radius/8 | 8 |
| radius/12 | 12 |
| radius/16 | 16 |
| radius/24 | 24 |
| radius/full | 9999 |

### 文本样式

字体为文件所用的单一字体家族，可以是任何字体。样式名称按文件夹组织，例如 `Heading / Heading 1`。除非用户设定，字距为 0。

| 文件夹 / 样式 | 比例刻度 | 字号 / 行高 | 字重 |
|---|---|---|---|
| Heading / Heading 1 | `text-6xl` | 60 / 60 | 常规 |
| Heading / Heading 2 | `text-5xl` | 48 / 48 | 常规 |
| Heading / Heading 3 | `text-4xl` | 36 / 40 | 常规 |
| Heading / Heading 4 | `text-3xl` | 30 / 36 | 常规 |
| Heading / Heading 5 | `text-2xl` | 24 / 32 | 常规 |
| Heading / Heading 6 | `text-xl` | 20 / 28 | 常规 |
| Title / Title 1 | `text-xl` | 20 / 28 | 中等 |
| Title / Title 2 | `text-lg` | 18 / 28 | 中等 |
| Title / Title 3 | `text-base` | 16 / 24 | 中等 |
| Title / Title 4 | `text-sm` | 14 / 20 | 中等 |
| Title / Title 5 | `text-xs` | 12 / 16 | 中等 |
| Body / Body 1 | `text-base` | 16 / 24 | 半粗体 |
| Body / Body 2 | `text-base` | 16 / 24 | 中等 |
| Body / Body 3 | `text-base` | 16 / 24 | 常规 |
| Body / Body 4 | `text-sm` | 14 / 20 | 半粗体 |
| Body / Body 5 | `text-sm` | 14 / 20 | 中等 |
| Body / Body 6 | `text-sm` | 14 / 20 | 常规 |
| Button / Button-lg | `text-lg` | 18 / 28 | 半粗体 |
| Button / Button-md | `text-base` | 16 / 24 | 半粗体 |
| Button / Button-sm | `text-sm` | 14 / 20 | 半粗体 |
| Button / Button-Xsm | `text-xs` | 12 / 16 | 半粗体 |
| Caption / Caption 1 | `text-sm` | 14 / 20 | 中等 |
| Caption / Caption 2 | `text-sm` | 14 / 20 | 常规 |
| Caption / Caption 3 | `text-xs` | 12 / 16 | 半粗体 |
| Caption / Caption 4 | `text-xs` | 12 / 16 | 中等 |
| Caption / Caption 5 | `text-xs` | 12 / 16 | 常规 |

字体样式字符串因字体家族不同而不同。加载前使用 `figma.listAvailableFontsAsync()` 检查，例如 Geist 使用 `SemiBold`，Inter 类字体家族使用 `Semi Bold`。

### 颜色

#### 第 1 层：`Core Colors`

一个模式。原始十六进制颜色来自品牌。

| 色板 | 作用 | 色阶 |
|---|---|---|
| `Primary` | 主要品牌色 | 00, 50, 100, 150, 200, 300, 350, 400, 450, 500, 600, 700, 800, 850, 900, 950, 1000 |
| `Secondary` | 次要品牌色 | 00, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000 |
| `Accent` | 强调色 | 00, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000 |
| `Grayscale` | 中性色 | 00, 50, 100, 150, 200, 250, 300, 400, 450, 500, 600, 700, 750, 800, 850, 870, 900, 950, 1000 |
| `Red` | 错误 | 00, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000 |
| `Green` | 成功 | 00, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000 |
| `Yellow` | 警告 | 00, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000 |
| `Grayscale-Alpha` | 叠加层使用的透明中性色 | 700-16, 700-24, 700-40, 700-64, 700-80 （Grayscale/700 的十六进制颜色分别使用 16%、24%、40%、64%、80% 的不透明度，存入变量自身的不透明度字段） |

- `00` 接近白色，`500` 为基础色相，`1000` 接近黑色。
- Grayscale 的深色阶与允许的深色背景保持对应：`1000` = #000000，`870` = #181818，`850` = #1F1F1F，`800` = #272727，`750` = #313131。

#### 第 2 层：`Color System`

模式为 `Light` 和 `Dark`。每个值都是 Core Color 的别名。Dark 列是用户的参考映射。通过镜像色阶构建 Light 列，例如 Grayscale 870 的深色表面对应接近 Grayscale 00/50 的浅色表面，然后检查对比度。

**Border（边框）**

| 设计变量 | 深色模式别名 |
|---|---|
| Border/Primary | Grayscale/750 |
| Border/Primary-Disabled | Grayscale/800 |
| Border/Primary-light | Grayscale/700 |
| Border/Secondary | Grayscale/750 |
| Border/Tertiary | Grayscale/600 |
| Border/Action-Primary | Primary/400 |
| Border/Action-Disabled | Primary/600 |
| Border/Action-Secondary | Grayscale/500 |
| Border/Error | Red/400 |
| Border/Error-disabled | Red/700 |
| Border/Success | Green/400 |
| Border/Warning | Yellow/300 |
| Border/Warning - Disabled | Yellow/700 |

**Surface（表面）**

| 设计变量 | 深色模式别名 |
|---|---|
| Surface/Primary | Grayscale/870 |
| Surface/Primary-Hover | Grayscale/800 |
| Surface/Primary-Selected | Grayscale/700 |
| Surface/Primary-subtle | Grayscale/850 |
| Surface/Secondary | Grayscale/800 |
| Surface/Secondary-Hover | Grayscale/700 |
| Surface/Secondary-Selected | Grayscale/700 |
| Surface/Secondary-Subtle | Grayscale/750 |
| Surface/Tertiary | Grayscale/600 |
| Surface/Tertiary-Hover | Grayscale/450 |
| Surface/Accent | Accent/500 |
| Surface/Accent-subtle | Accent/200 |
| Surface/Info | Primary/400 |
| Surface/Info-subtle | Primary/150 |
| Surface/Error | Red/500 |
| Surface/Error-subtle | Red/100 |
| Surface/Error - Darker | Red/700 |
| Surface/Inverted | Grayscale/00 |
| Surface/Inverted-Hover | Grayscale/250 |
| Surface/Inverted-Disabled | Grayscale/450 |
| Surface/Warning | Yellow/500 |
| Surface/Warning-subtle | Yellow/100 |
| Surface/Warning - Hover | Yellow/700 |
| Surface/Success | Green/500 |
| Surface/Success-Subtle | Green/100 |

**Action（按钮和控件填充）**

| 设计变量 | 深色模式别名 |
|---|---|
| Action/Primary | Primary/500 |
| Action/Primary-Hover | Primary/700 |
| Action/Primary-Click | Primary/600 |
| Action/Primary-Disabled | Primary/700 |
| Action/Secondary | Grayscale/600 |
| Action/Secondary-Hover | Grayscale/750 |
| Action/Secondary-Click | Grayscale/700 |
| Action/Error | Red/700 |
| Action/Error-Hover | Red/800 |
| Action/Error-Disabled | Red/800 |
| Action/Error-Subtle | Red/150 |
| Action/Warning | Yellow/500 |
| Action/Warning - Hover | Yellow/700 |
| Action/Warning - Disabled | Yellow/800 |
| Action/Warning - Subtle | Yellow/100 |

**Text（文本）**

| 设计变量 | 深色模式别名 |
|---|---|
| Text/Primary | Grayscale/50 |
| Text/Primary-Disabled | Grayscale/750 |
| Text/Primary-Subtle | Grayscale/500 |
| Text/Secondary | Grayscale/200 |
| Text/Secondary-Disabled | Grayscale/500 |
| Text/Tertiary | Grayscale/400 |
| Text/Inverted | Grayscale/850 |
| Text/Error | Red/500 |
| Text/Error-Disabled | Red/800 |
| Text/Error-Inverted | Red/800 |
| Text/Error-Inverted-Disabled | Red/200 |
| Text/Success | Green/600 |
| Text/Success-Inverted | Green/700 |
| Text/Success-Inverted-Disabled | Green/300 |
| Text/Info | Primary/350 |
| Text/Info-Inverted | Primary/700 |
| Text/Info-Inverted-Disabled | Primary/200 |
| Text/Warning | Yellow/500 |
| Text/Warning - Disabled | Yellow/800 |
| Text/Warning-Inverted | Yellow/800 |
| Text/Warning-Inverted-Disabled | Yellow/300 |

**Icon（图标）**

| 设计变量 | 深色模式别名 |
|---|---|
| Icon/Default | Grayscale/50 |
| Icon/Secondary | Grayscale/200 |
| Icon/Subtle | Grayscale/500 |
| Icon/Inverted | Grayscale/850 |
| Icon/Disabled | Grayscale/750 |
| Icon/Error | Red/500 |
| Icon/Error-Disabled | Red/800 |
| Icon/Error-Inverted-Disabled | Red/200 |
| Icon/Info | Primary/350 |
| Icon/Info-Disabled | Primary/200 |
| Icon/Warning | Yellow/500 |
| Icon/Warning-Inverted | Yellow/700 |
| Icon/Warning - Disabled | Yellow/800 |
| Icon/Warning-Inverted-Disabled | Yellow/300 |
| Icon/Success | Green/400 |
| Icon/Success-Inverted-Disabled | Green/300 |

**Overlay（叠加层）**

| 设计变量 | 值 |
|---|---|
| Overlay/xs | Grayscale-Alpha/700-16 |
| Overlay/sm | Grayscale-Alpha/700-24 |
| Overlay/md | Grayscale-Alpha/700-40 |
| Overlay/lg | Grayscale-Alpha/700-64 |
| Overlay/xlg | Grayscale-Alpha/700-80 |

别名不能增加不透明度，它原样使用目标值。因此透明度存入 Core Colors（`Grayscale-Alpha`），Overlay 通过别名引用。不要手工给叠加图层设置不透明度。
