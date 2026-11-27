<a id="code-analysis-architecture"></a>

# 代码分析架构

Code Analysis 是 Archify 的集成模块。本文说明已实现的流水线及其当前边界。启动命令见[使用指南](docs/USAGE.md)。

<a id="entry-point-and-lifecycle"></a>

## 入口与生命周期

在 Archify 包目录执行：

```sh
npm start -- "/path/to/project" --ir architecture.json
```

`bin/archify.mjs` 把 `start` 分派到本模块的 `bin/serve.mjs`。旧命令 `archify code-analysis serve` 使用相同实现。省略 `--out` 时，统一入口提供临时输出目录。

服务器先以手工编写的 JSON 调用 Archify 的 `deliver architecture`。输入固定了仓库证据时，交付会对照项目 Git 仓库检查。交付失败会在提供页面前中止启动。

服务器在回环地址提供带 Code Analysis 按钮的图。读者点击按钮后才开始提取源码。每次分析都在子进程（`bin/analyze-run.mjs`）中运行，使服务器保持响应。并发请求共享正在进行的分析；之后返回最近一次成功结果，直到读者点击 **Re-analyze**。该操作启动新分析，只有成功才替换结果；页面随后重新加载并打开它。分析失败会保留上次良好结果，允许重试。每次运行重新读取配置文件；只有架构 JSON 变化才需要重启服务器。

`POST /task`（检查同源及 token）为当前结果中的 finding id 构建 AI 优化任务，并对照工作树检查证据。请求只携带 finding id；结果目录及仓库根由服务器固定。

`archify code-analysis check`（`bin/check.mjs`）面向终端和 CI，无图运行 extract → graphs → evaluate；开放发现达到配置级别时以非零退出。

`archify code-analysis task`（`bin/task.mjs`）从已完成运行的 `findings.json` 和 `raw-facts.json` 构建 AI 优化任务（`lib/task.mjs`），并可选择对照工作树检查证据（`lib/evidence.mjs`）。

提供 `--question` 时，改为无需 finding 的单入口源码导览（`lib/explain.mjs`、`lib/question-calls.mjs`）。该模式检查捕获的源码身份、直接导入和受支持调用位置，然后指向宿主 Agent 的[函数分析流程](docs/FUNCTION-ANALYSIS.md)。它不运行语义分析，也不执行被分析项目。

提供 `--base-root` 时，问题路径用当前提取器和同一分析配置重新捕获两个 JS/TS 根目录（`lib/change-question.mjs`）。可选提取观察器暴露有效编译器选项及解析读取，供比较和新鲜度检查；raw facts 与 revision 9 不变。必需入口选择函数文本／位置对、词法调用引用，以及分开的模块导入阅读位置。声明覆盖保持明确。文本配对及引用均不能证明运行时影响。该路径不保存 raw-facts 目录，不推断重命名，也不自动选择变化入口。

<a id="analysis-pipeline"></a>

## 分析流水线

`lib/analysis.mjs` 提供三个数据阶段；`overlay/page.mjs` 运行它们，并为已交付页面追加第四阶段：

1. **提取事实**（`extract/`）：选择 Python、JS/TS、Java、Go 或 Rust 适配器，读取源码，记录文件、导入、可用符号信息及未解析依赖。Python 使用 AST 提取器；JS/TS 使用 TypeScript Compiler API；Java 使用 `java-parser` CST，逐文件归约为声明／引用索引。Go 与 Rust 使用仅源码配置，见[语言参考](docs/LANGUAGE-REFERENCE.md)。每次运行选择一个适配器。
2. **构建模块图**（`graphs/module.mjs`）：按显式配置、包边界或目录深度分组文件（Java 按构建模块，单模块构建中按包）；聚合模块间依赖；计算文件归属与模块指标。根目录文件各自构成模块。测试及生成角色默认排除，并在输出中计数。
3. **评估规则**（`evaluate/`）：运行导入环、模块耦合环、枢纽与集中度规则；函数复杂度（Python、JS/TS、Java）；以及配置声明的架构边界规则。Java 环描述结构依赖，不推断类初始化风险。发现包含严重程度、主体及支撑证据。配置的规则抑制会在摘要中计数。
4. **构建分析视图**（`overlay/inject.mjs`）：通过源码引用或显式映射，将手工组件映射到代码模块；再向交付页面的副本加入发现与源码导航。

编排器按 JSON schema 验证中间数据，还检查提供的 raw facts 与模块图在仓库元数据、文件归属及依赖聚合上是否一致。

针对根内精确 JavaScript 包导入／自身导出的条件 null 边界，一个有范围限制、由快照支持的选择器，在常规源码边界检查前保留 blocked、no-match、invalid、selected 和 unsupported 结果。它不是 Node 加载器；受影响但不支持的形式仍为未知。TypeScript／仅类型解析及无关键沿用既有策略，见[模块解析](docs/TECH-GUIDE.md#module-resolution)。

<a id="python-call-facts"></a>

## Python 调用事实

当前 `python-source-v3` 在 Node 中运行移植的 Pyright tokenizer/parser。Archify 的绑定遍历、导入收集器、指标及有范围限制的源码类型形状使用该语法树。没有交付完整 Pyright 的 Program、LSP、binder、evaluator 或 typeshed。`python-source-declaration` 将词法调用扩展到捕获的接收者／签名声明、源码继承、有限局部流程、有类型的装饰器约定及泛型工厂。显式依赖声明输入可细化接收者类型，不增加项目导航目标。见 [Python 实现与边界](docs/PYTHON.md)。

下列 `python-lexical-v1` 约定描述历史捕获，读取时不重新绑定。它盘点语法有效的已捕获 Python 文件中每个 `ast.Call`。它将 Name 调用保守地绑定到唯一、普通、未装饰的模块级定义，或到达此类直接捕获定义的显式静态 from-import 别名。同一函数块中，单个无条件函数局部 from-import 位于调用前，且没有参数冲突或其他写入时，也会绑定。闭包／类局部导入仍未知。绑定事件在查找前收集，因此参数、之后的局部写入、导入，以及 pattern/catch/comprehension 遮蔽不会意外回退到模块目标。属性、类、被装饰目标、再导出、条件／重新绑定／歧义绑定、global/nonlocal，以及注解／泛型上下文仍未解析。不执行目标代码。

Python 函数另带 `sourceRange`：从精确的 def/async def 到 AST 结束位置，使用从 1 起算的 UTF-16 列、排他结束位置，以及解码切片按 UTF-8 编码后的 SHA256。它不包含前置装饰器；配对比较使用另一个包含所属头部的 `definition.sourceRange` 范围。已保存问题的消费者对照精确且未改变的源码验证范围，不使用 TypeScript 重新解析。物理上位于范围内的调用包括默认值及嵌套函数体；这些是源码包含的调用点，不是调用者图或运行时分派。导入目标的新鲜度单独检查。可识别且新鲜的零值表示确知收集了零个 Call；没有可识别模型的历史 Python/Java 捕获仍不可用。新 span 对当前阅读器属于加法扩展；旧的严格函数 schema 会拒绝它们。

Java `java-static-lexical-v1` 收集方法调用，并将目标限制为同文件中唯一的静态源码候选。Java `sourceRange` 支持调用选择及目标坐标；`definition.sourceRange` 保留配对比较所需的所属头部范围。两者共存，使用精确源码哈希。参数类型适用性、编译及运行时分派仍未知。见 [Java 边界](docs/JAVA.md#method-invocation-source-navigation)。

<a id="jsts-call-facts"></a>

## JS/TS 调用事实

当前 `js-ts-lexical-v5` 在已捕获、模块无环的值路径上增加稳定的显式 ESM 转发，每条转发语句保留在 `calls[].via` 中；实现体与重载签名分开。范围及未知项见[技术指南](docs/TECH-GUIDE.md#explicit-esm-call-forwarding)。下列 v1/v2 约定描述历史捕获，读取时不重新绑定。

JS/TS 适配器记录语法有效、非声明文件中的 `CallExpression` 调用点。`callModel: "js-ts-lexical-v2"` 显式标识此覆盖；没有可识别模型的空数组不能证明已收集调用。适配器 revision 标识提取变更，不是能力开关。Python 与 Java 不输出此调用模型。

现有 TypeScript checker 提供保守的词法绑定：具有函数体的唯一普通函数声明、直接 `const` 箭头／函数表达式初始化器，或到达上述形式直接捕获导出的相对静态具名导入。v2 模型还把相对默认导入（包括 `default as`）绑定到直接默认函数声明，无论具名还是匿名，但必须恰有一个实现体。遵循导入别名与词法遮蔽。每个目标都关联捕获源码中测量过的函数。命名空间／包导入、默认导出表达式、局部导出别名、再导出、可变或被包装的初始化器、成员／动态分派及可选调用仍未解析。不收集构造函数与标签模板。记录可能包含嵌套函数里的调用；目标或零计数都不能证明执行、可达性或完整影响。

checker 若将参数默认值调用指向同一函数体内的声明，该调用保持未解析：初始化器无法访问函数体作用域。这也包括解构默认值及初始化器中创建的闭包。有效外部／导入绑定，以及初始化器创建的函数作用域内声明，保留常规解析；适配器不会尝试将被拒绝的函数体目标重新绑定为外部声明。

调用与目标位置采用从 1 起算的 UTF-16 坐标；调用结束位置排他。链式调用可共享起点而终点不同。语义检查验证源码边界、测量函数及记录的静态导入边，不重跑绑定分析。`symbols` 保留 Python 绑定顺序语义；`unresolved` 计数器仍统计导入。模块图、规则、finding 任务和 UI 不消费调用记录。问题导览最多读取选定源码范围内的 40 条记录，含嵌套函数体，并报告 total/included/omitted 计数。缺失或未知调用模型会使覆盖不可用，即便适配器 revision 数值看起来熟悉。原始事实保持不变；当前导航要求源码文本匹配且没有解析错误，导入目标单独检查。配置或其他源码变化后，这些检查不重新解析导入。

问题导览显式支持 v1 和 v2，并报告其不同绑定覆盖。v1 不含默认导入；新消费者读取它时保留原事实。仅懂 v1 的问题消费者把 v2 视为不可用，不假定理解新约定。更新后的 schema 仍允许历史空数组。旧严格 schema 拒绝新增的 `callModel` 字段，因此消费者需要更新后的 schema 才能读取新捕获。解释调用覆盖前，阅读器还必须考虑解析错误、排除文件及声明文件。

<a id="current-findings-and-presentation"></a>

## 当前发现与呈现

已实现规则检查文件级导入环、模块级耦合环，以及入向和出向依赖数较高的模块。导入证据区分相关加载条件，例如惰性、条件及仅类型导入。发现描述静态结构及潜在加载风险，不证明运行时失败，也不认证执行安全。

分析层以单一阅读列承载项目总览、组件页、问题页和源码页。桌面布局在阅读列旁为架构画布预留空间；窄窗口一次展示一个阅读页，并提供 View diagram／Show analysis 切换。返回按钮回到上一页。总览优先项包含源码位置及可能的维护影响。问题页展示观察事实、至多两段各九行的代码片段、建议下一步，以及可展开的 AI 任务预览。关系、指标和完整规则证据保留为可展开内容。函数源码视图同时高亮测量范围及选中行。

AI 任务预览使用共用任务生成器的 Markdown。在线页面从经过认证的本地服务器请求任务，复制或下载前重查证据。静态报告嵌入捕获任务，并明确当前源码未检查。网络失败可回退到带此标签的快照；HTTP 拒绝仍为错误，需要重试或重新分析。剪贴板失败时选中预览供手工复制。导出任务不修改源码。比较使用“未再次检测到”的表述；比较上下文不兼容或未知时显示原因，不声称已经修复。

带行号的源码引用展示九行上下文窗口，并高亮引用行。无行号引用展示十二行文件预览，明确标为开头行，而不是 finding 证据。读者可切换到完整捕获文件再返回；片段自动换行，完整文件保留原格式。未映射模块即使没有架构图组件，仍保留文件证据。相关组件会高亮，并可用 Viewer 相机定位，同时保留桌面缩放。分析成功后，Code Analysis 按钮切换分析层。

<a id="files-and-responsibilities"></a>

## 文件与职责

- `bin/`：交付、本地服务器及点击触发的分析请求。
- `config/`：默认源码包含、排除及文件角色模式。
- `extract/py/`：Python 提取及适配器集成。
- `extract/ts/`：JavaScript 和 TypeScript 提取。
- `extract/java/`：Java 解析、保守源码依赖解析，以及方法／构造函数指标。见 [Java 支持](docs/JAVA.md)。
- `core/`：各阶段共用的无依赖辅助函数（结构化诊断、glob 匹配、精确源码范围及行范围摘要），经 `core/index.mjs` 导入。它不导入任何阶段或第三方包。
- `extract/shared/`：适配器使用的文件遍历、文件角色及 Git 元数据。其 `diagnostics`、`glob`、`source-range`、`schema` 和 `semantics` 文件只重新导出 `core/` 与 `schemas/`，让适配器保持一个本地导入路径。
- `graphs/`：模块分组及依赖聚合。
- `evaluate/rules/index.mjs`：规则注册表；新规则由独立文件及此处一行组成。
- `evaluate/rules/coupling/`：导入环、模块环、枢纽、集中度及内部泄漏规则。环属于 error，见[严重级别](docs/USAGE.md#severity-levels)。
- `evaluate/rules/architecture/`：配置中声明、显式启用的层边界规则。
- `evaluate/rules/complexity/`：共用函数复杂度及嵌套阈值；测量值来自各语言提取器。
- `evaluate/rules/redundancy/`：重复规则及可选 jscpd 运行器。`evaluate/` 不导入 `lib/`；以前的 `lib/duplicates.mjs` 入口保留为兼容性重新导出。
- `lib/`：数据阶段（extract → graph → evaluate）、配置合并、中间数据检查、评审（`review.mjs`：基线、运行比较及可比性）、AI 任务（`task.mjs`：任务模型与 Markdown 渲染）和证据检查（`evidence.mjs`：捕获源码对照工作树）。
- `bin/check.mjs`：终端及 CI 的无界面分析；`bin/task.mjs`：AI 任务导出及证据检查；`bin/analyze-run.mjs`：供服务器使用的子进程单次分析。
- `overlay/`：映射与浏览器呈现；`overlay/page.mjs` 是单个交付页面的完整分析；`overlay/client/` 以普通文件保存浏览器脚本与样式，由 `overlay/client-assets.mjs` 在构建时内联。`overlay/` 基于 `lib/`，绝不反向依赖。
- `schemas/`：raw-facts、module-graph、findings、baseline 和 AI task 约定，以及验证器（`validate.mjs`）和 JSON schema 无法表达的交叉引用不变量（`semantics.mjs`），经 `schemas/index.mjs` 导入。
- `test/`：回归测试、小型源码夹具及预期提取结果。
- `docs/`：使用与技术文档。

<a id="outputs"></a>

## 输出

分析前，`<out>/architecture.html` 包含 Archify 交付产物。服务器只向提供的响应添加启动按钮，不覆盖该产物。

成功分析后，`<out>/analysis/` 包含：

- `raw-facts.json`
- `module-graph.json`
- `findings.json`
- `review.json`（基线状态及与上次运行的比较）
- `overview.json`
- `repo.analysis.html`

每次运行先写新的 `<out>/analysis.next-*` 目录，只有成功才换入。被替换的运行移动到 `<out>/analysis.previous/`，作为下一次运行的比较对象。失败运行被移除，因此 `<out>/analysis/` 始终保存最近一次完整结果。

分析 HTML 嵌入已映射文件及证据文件的源码上下文，可以离线显示已有结果。没有本地服务器就不能重新扫描项目。

<a id="runtime-dependencies-and-boundaries"></a>

## 运行依赖与边界

模块使用 `typescript` 解析 JS/TS，`java-parser` 解析 Java，`ajv` 检查 JSON schema。Python 分析还需要 Python 解释器。Java 分析不需要 JVM。安装 Archify 时会安装模块依赖；服务器可在首次使用时安装缺失依赖。

本地服务器检查请求 host，并要求分析请求带有匹配的 origin 及每服务器 token。嵌入源码收集限于被分析源码根。`serve`、`check` 和 `task` 入口都在加载分析库之前初始化缺失模块依赖，新解压的包也如此。

分析器不执行被分析应用，也不调用 LLM。AI 任务由固定模板从分析数据构建；是否应用修改，由读者交接任务的编码代理负责。目前没有实现独立调用图、测试图、Git 变更图、重复规则、污点分析、并发或资源安全验证、自动修复及综合质量分数。结果标识一份含捕获源码文本及快照摘要的工作树提取。Git HEAD 是作为上下文的基准元数据，不是被分析内容的 revision；这不是变更影响分析。

Python `python-lexical-v2` 保留 v1 盘点，并增加一次唯一、无条件、显式的 from-import 再导出（包括别名），目标是另一个捕获文件中的普通未装饰函数。现有绑定事件扫描器提供符合条件的导出绑定；现有捕获导入解析器提供两跳路径。语义检查要求一条或两条已记录静态导入边，以及精确目标定义范围。更长链、回到调用者的环、条件／重新绑定／通配导出、类及运行时模块初始化均不在此模型内。已保存 v1 捕获保留仅直接目标的覆盖。

Rust `rust-source-direct-v3` 保留原直接／单态覆盖，并增加 `rust-specialized-inherent-source-candidate`：通过无约束类型泛型 struct 的裸路径，可识别一个具体特化源码函数。非泛型 impl 中的具名类型参数只建立源码候选；适用性／推断、显式泛型调用参数、Self／别名／trait／接收者，以及带生命周期／const／约束／默认值的拥有者仍未证明。不支持的泛型／接收者或其他竞争 inherent 声明使选择保持未知。复用已捕获导入解析器和源码范围。历史 v1/v2 捕获保留原范围。
