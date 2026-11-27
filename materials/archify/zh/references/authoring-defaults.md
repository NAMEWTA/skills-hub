<a id="authoring-defaults"></a>

# 创作默认值

编写新的候选文件前阅读一次。已有冻结候选文件直接进入 `finalize` 时，只有修复改变创作内容才需要本参考。

<a id="composition-and-meaning"></a>

## 组成与含义

对于 Architecture，除非用户要求更窄的机制、模块地图或部署拓扑，否则默认采用由主要用户旅程引导的系统概览。如果仍能解释请求中的交互，将协作角色归入准确命名的子系统。如果合并会隐藏控制归属、信任或持久化边界、生命周期行为，或读者要求的其他区别，就将角色分开。次要和需要选择启用的能力，保留在简洁、带来源的说明中，除非其路径与当前问题有关。刻意缩窄范围时，在标题中说明。

保留用户要求的每项职责、关系方向、协议和会改变行为的条件。在受影响节点或关系上显示审批、授权和状态转换门禁；单靠卡片无法限定一条看上去无条件的箭头。每项论断都保留来源证据。边界表达真实的隔离、归属、运行时或持久化事实。一个视图同时覆盖某组件的本地与远端配置时，省略机器轮廓。在每个相关节点上写明位置，包括可配置的节点。机器轮廓适合单个命名部署，或分别绘制的部署替代方案。两种情况下，框与标签对各组件运行位置的描述都必须一致。卡片回答读者的额外问题，不能替代必需拓扑。节点、边、来源、卡片或边界均无配额。如果作者编写的总览在失败后需要重新分组，使用[构图修复](authoring-contract.md#composition-repair)；用户提供或已同意的拓扑保持固定。

关系标签承载含义。为它们留出清晰空间，保留动作、协议、方向、异步行为或跨边界含义。在模式 schema 允许缺少标签时，只有两个端点已经完整蕴含该含义才省略；碰撞需要通过间距或路由修复。实测证据报告碰撞时，参见[标签修复](authoring-contract.md#label-repair)。

<a id="layout-and-routing"></a>

## 布局与路由

新建 Architecture 时，在顶层设置 `"layout": {"mode": "auto"}`。写出组件、关系和真实边界成员。对尚未放置的组件，省略 `pos`、`row`、`col` 和 `size`。其卡片会适配普通标题和上下文文字，渲染器负责排列相连组件。省略 `meta.viewBox`，让画布适配内容。用户提供的绝对位置应保留在该组件的 `pos` 中。用户提供行/列分配时使用 `mode: "grid"`。

自行放置组件或修复实测冲突时，根据真实关系选择位置：

- **主路径**：阅读者的主要旅程，相邻节点按照阅读顺序相邻。让中等长度路径经过有意义的行，不要形成扁平的横条。
- **分支或存储**：放在拥有、读取或写入它的节点正上方或正下方，并与该节点居中对齐，使边只需一条直线。同一行的所有存储和分支放在这一行的同一侧。
- **返回**（回到较早的主路径节点）：将来源放在主路径没有分支或存储的一侧，使它通过空通道，而不是穿过这些节点。
- **第二入口**：目标节点已经有一条入边时，摆放新来源，使其从另一侧抵达该节点，通常在正下方或正上方。
- **扇出**：一侧有 k 条关系时，至少需要 `32 + 14 × (k − 1)`px（四条需要 74px）。将枢纽的对端分散在两到三侧，或放大枢纽。让父节点在子节点之间居中；子节点只有一个父节点时，与父节点对齐。

手动放置时，追踪每条非主路径关系：其直线或单次弯折通道不能穿过其他节点，也不能与其他关系交叉。如有这种情况，移动不在主路径上的那个端点。把主要参与者及与其相连的第一步一起放在画布原点附近（约 `[40, 40]`，而非 `[200, 200]`）；用内容行形成纵向节奏。起点过远造成的顶部/左侧空白会浪费画布、降低填充率，却不改善可读性。新建 Architecture 时省略 `meta.viewBox`，让 Reader 测量固有高度。用户提供的固定几何始终优先。

从自动路由和自动端口侧开始。只有必要分支、返回或给定几何才固定某一侧。新的 Architecture 中，如果没有必需端口侧约束阻止平行直线，相邻请求／响应方向保持自动；保留用户提供的端口侧固定值。`via`、`channelX`、`channelY` 和标签坐标只用于实测缺陷。写坐标前，对每条横向并排盒子之间的带标签边，无论是否位于主路径，都按 `6.5px × ASCII units + 21px` 预留净空，CJK 按两个单位计算；按各自标签长度计算，不使用整行固定间隔。边界框是所有成员周围带内边距的盒子：将成员摆成紧凑、轴对齐的一组（不要留下能让非成员坐进带内边距边框的空湾），并让所有非成员，尤其外部执行者，处于该盒子之外。Architecture 画布宽度保持在 1240px 以内；若宽至少是高的 1.55 倍，则可到 1790px；超过后，8px 关系标签会低于桌面文字下限。Architecture 副标签按偏好的 9px 字体，以 `5.4px × text units + 8px` 设置尺寸，CJK 计两倍；辅助文案保持简洁，但不丢失必需事实。不要以可读性或含义来交换更少交叉。已诊断布局问题的实测间距、端口、画布和路由规则，见[几何参考](authoring-contract.md#executable-geometry-rules)。

<a id="evidence-and-schema"></a>

## 证据与 Schema

对于真实仓库，检查源码时遵循[仓库创作](repository-authoring.md)。将不含凭据的 origin 和四十字符 commit 固定在 `meta.repository` 中，为每个关键语义节点附上已检查的仓库相对 `sources`，并在第一次 `finalize` 时传入 `--repo-root`。每条引用只证明该位置可见的事实。追踪重要关系和条件到真实来源；不要把启动引用复用于协议或持久化证据。

示例展示字段结构，不提供合法值或来源事实。它们是已经完成的展示案例，因此可选呈现字段（`meta.subtitle`、`meta.viewBox`、`meta.column_fit`、`via`、`labelAt`）并非默认值；以此处默认值为准。添加字段、枚举或受约束文本前，阅读模式 schema 和共享定义。尤其要检查 Architecture 边界类型。较长证据放进卡片，同时保留事实。详情见[Schema 查阅](authoring-contract.md#schema-lookup)。

<a id="presentation-and-modes"></a>

## 呈现与模式

动效自动启用。省略 `meta.animation`；使用查看器的 Live／Still 按钮暂停或恢复播放。

根据用户选择或请求/对话确定一种主要编写语言。设置 `meta.locale`；`en`、`zh-CN`、`zh-TW`、`es`、`ko`、`ar` 和 `ru` 无需额外设置即可选择随附 Viewer 语言目录。其他语言应提供包含可复用 UI 翻译的 `meta.translations`，或明确说明 Viewer UI 与 `<html lang>` 会固定回退到英语。在本地化周围解释时，保留产品、代码、协议、命令、API 和环境名称的精确写法。双语情况参见[语言一致性](authoring-contract.md#language-consistency)。

省略 `meta.visual_preset` 以使用 classic，省略 `meta.subtitle` 以仅显示标题，省略 `meta.legend` 以使用真实的自动图例，普通系统概览省略 `meta.engineering_profile`。显式样式和副标题需要用户请求。图例或部署归属应遵循[图例](authoring-contract.md#legend-contract)或[工程配置](authoring-contract.md#engineering-profile-default)契约。节点指代真实产品时，品牌是可选且显式的；[品牌标识](brand-marks.md)给出该分支的查找与抓取规则。绝不让徽标替代语义类型、标签或关系事实。将必填 `meta.output` 设为工作目录内可移植的 POSIX 相对 `.html` 路径；原生路径例外见[输出路径契约](delivery-contract.md#output-path-contracts)。

为 README 的 Architecture 图设计布局时，应适配文档栏宽。比较两个均通过校验的布局时，用相同栏宽打开两份 SVG，并沿用户要求的路径阅读。较宽候选即使减少了一个弯折，也可能使箭头标签变小。保留读者能够顺畅跟随的候选。让相连组件足够接近，以便一起阅读标签。两组件间过长的协议说明可能迫使整张图缩小。把动作或载荷留在箭头上，将辅助详情移到相邻图注，或把分支放到所属对象下方。按文档通常的宽度限制检查导出图片。如果读者必须放大才能跟随主要交接，就调整布局。

把 Workflow 颜色图例作为图的一部分阅读。默认标签描述“Agent logic”“External system”等软件角色。如果颜色在其他领域区分步骤或结果，使用 `meta.legend.entries.<kind>.label` 写出实际角色。如果标签和泳道已经表达区别，可用 `meta.legend.mode: "hidden"` 省略冗余图例。

新建 Workflow 使用 schema v2，并省略 `meta.viewBox`，让编译器测量真实占用范围；不要仅为满足视口比例添加空画布。保留用户提供的固定几何和 v1 来源。对于[从上到下的链条](../renderers/workflow/README.md#vertical-workflows)，将连续步骤放在同一泳道、同一列中，并按顺序连接。省略 `yOffset` 和路由控制，让编译器安排步骤及其箭头的间距。在未固定的草稿中，省略节点 `width`：节点从 92px 起步，根据标签、副标签和 tag 扩展，最多 200px。显式画布以及绝对路由或标签固定点保留原有几何契约。需要泳道或分组几何细节时，使用其[布局契约](../renderers/workflow/README.md#layout-contracts)。

新的 Sequence 省略 `meta.viewBox` 和 `meta.column_fit`：自动高度适配时间线（没有 760px 下限）；标签能放下时，2–3 个短标签参与者紧凑排列在低于 920px 的宽度内；拥挤标签仍会推动画布扩大，直到可读宽度上限；保留作者指定的 `meta.viewBox`。需要历史固定坐标时，显式设置 `meta.column_fit: "fixed"`；宽 viewBox 留有未使用的横向空间，或有意义的标签需要更宽空间时，使用 `spread`。将参与者内部动作描述在周围真实跨参与者消息的 note 中，保留其含义与顺序；Sequence 不支持自消息循环。新的摆放在放下一条消息前，先为该 note 预留纵向空间：28px 是无 note 消息的基础间距，不是 note 预算。note 向消息下方扩展；在下一条共享这块空间的消息之前，一行渲染文字至少留 44px，两行留 55px，三行留 66px（例如 y=200 的三行 note，下一条消息必须位于 y=266 或更后）。换行取决于最终泳道宽度，因此更长 note 要留更多空间，保留每条 note 的含义，不以删除解决问题。这些间距不保证避开分段标题、其他 note 或 activation。用户提供的固定 y 值保持权威；agent 创作新稿时，根据需要一起调整后续消息、分段边界与 activation 边界，保留顺序与含义，并在这些约束内用 `sequence/note-overlap` 证据修复。

新的 Dataflow 从 2 到 5 个 stage、row 为 0 到 4 的网格开始，并遵循规范的[Dataflow 画布与展示默认值](authoring-contract.md#dataflow)。相邻 stage 中心相距 215px，默认节点宽 112px，因此两者间约有 100px；将 flow 标签控制在约 17 个文本单位以内，CJK 算两个，更多细节移入卡片；只有给定几何或实测约束需要时才添加尺寸或路由控制。

对于 Dataflow 血缘，从每个请求的输出向后追踪到其生产者实际消费的值。某个转换如果组合原始载荷和派生配置，就要分别接收带标签的输入；每个上游节点只能传递它实际输出的值。对有证据支持的存储端点使用 `database`，并标明文件或存储名称。计算得到的内存结果，通过生成它的 `backend` 操作来表达，并在 label 或 sublabel 中注明结果字段。

Dataflow 的每条 flow 都必须有非空 `label`。根据默认图例向阅读者传达的含义选择 `variant`：省略／`default` 是普通数据流，`emphasis` 是主要数据，`security` 是策略／PII，`dashed` 是异步批处理。普通依赖、返回或回退使用 `default`；只有来源支持相应含义时，才使用 `security` 或 `dashed`。如果用户请求不同视觉约定，按照[图例契约](authoring-contract.md#legend-contract)，为受影响的 `meta.legend.entries.<variant>.label` 提供措辞，真实描述所有使用该 variant 的 flow。

Lifecycle 使用 schema v3：在 `mainPath` 中列出正常路径，并创作包括主路径在内的全部 transition；渲染器负责放置其他状态与路由。保留每个出口的 label、note 和 variant；[符合条件的等价出口](../renderers/lifecycle/README.md#layout)会自动共享路由。转换标签保持简短；可恢复失败必须有真实的返回转换。

Class 省略 `meta.viewBox`，网格控制为三列；只有类型宽度仍接近默认 180px 时才用四列：长成员会使类型扩大到接近 `layout.typeMaxW`（300px），每增加一列都会加宽画布，使所有文字进一步缩向可读性下限，因此应优先增加行。`layout.gapX` 和 `layout.typeMaxW` 控制宽度。

仓库或目录 Tree 设置 `layout.direction: "right"`；较浅、平衡的拆解保留默认 `"down"`。模式特定的摆放或视口问题需要更多细节时，阅读[模式摆放](authoring-contract.md#mode-placement)。

`finalize` 执行浏览器门禁。让完整绘图在桌面端保持舒适可读，横向溢出为零。必要时使用有意义的纵向行与固有高度页面滚动。6px 的投影文字检查是失败底线；在 1440px 视口下，普通上下文文字应以约 7.5px 或更大为目标。视口证据失败时，参见[自动化浏览器证据](delivery-contract.md#automated-browser-evidence)。
