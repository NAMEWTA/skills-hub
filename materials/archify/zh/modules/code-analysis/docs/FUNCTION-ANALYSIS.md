<a id="explain-a-function-or-feature"></a>

# 解释函数或功能

当用户询问某个源码功能做什么、输入如何到达输出、其变更意味着什么，或是否需要改进时，使用此工作流。它接收问题和入口文件，可选函数名称；不要求已有 finding。`task --help` 说明问题模式及其选项。

单入口导览接受 JS/TS 实现文件，或已经捕获在已保存分析目录中、且具有匹配 Python／Java producer 元数据的 .py/.java 入口。Python／Java 使用已捕获的函数范围和文件依赖。新鲜的 Python `python-source-v3` 事实提供源码调用点、词法目标以及有限范围内的接收者／签名声明目标（参见 [Python 支持](PYTHON.md)）；新鲜的 Java `java-static-lexical-v1` 事实提供有限范围内的方法调用导航。下述新鲜配对导览还支持已捕获的具名 Python／Java 定义。C/C++ 已保存导览使用 `cpp-source-direct-v1` 和已捕获的编译数据库。头文件入口需要从 `languageScope.fileContexts` 提供 `--context <translation-unit>`；虚调用和跨单元调用仍为未知。

1. **界定范围。** 深入阅读路径之前，记录问题、入口、验收问题和排除区域。对于代码变更，固定完整的 base/head 修订版本，并将两侧保留在各自的 checkout 中；把作者意图与从源码推断出的行为分开记录。使用 `task --question … --entry … --root …` 准备导览；如有现成分析目录则传入它。阅读 `scope`：区分 Git 根目录、分析根目录和已捕获事实文件；根目录之外的区域只是已索引路径，并非推断出的职责。根目录匹配也仍然存在语言／过滤／解析限制。Git 范围未知不妨碍阅读源码。完成标准：已记录范围并理解导览状态。导览是中间结果，不是最终分析。
2. **定位。** 从当前根目录读取入口。只有文件事实有效且 parseErrors 为空时，才使用已捕获的函数范围。事实缺失或发生变化时，需要从当前源码发现位置；在把旧范围或导入边用作当前事实之前，先刷新提取。无效入口必须更正。完成标准：在当前源码中识别实际入口并记录其身份。
3. **追踪。** 沿着回答问题所需的有限路径追踪：调用者／派发、输入、分支、辅助函数、配置和输出。在源码中检查计算得到的导入与子进程命令；沿这些路径追踪时检查目标源码。使用调用位置之前，先阅读 `calls.coverage` 和 `calls.bindingCoverage`。

   对于 JS/TS，显式 `js-ts-lexical-v1` 调用模型覆盖声明、直接 const 箭头函数／函数表达式初始化器，以及指向直接捕获导出的相对静态具名导入。v2 模型还将相对默认导入绑定到只有一个实现体的直接默认函数声明；默认导出表达式和重导出仍未解析。此消费者同时支持两个版本，不会重新解释旧事实。`adapterRevision` 标识提取变化；它不能确立调用能力，因为不同实验分支曾为仅提取导入的实现重复使用修订号。只有 `available` 提供可用记录；调用模型缺失／未知、调用缺失、入口文本改变和解析错误都会使总数保持未知、记录为空。available 状态下的零表示此源码范围未收集到调用节点，不表示没有运行时调用（JS/TS 模型排除构造器和带标签模板）。

   反向追踪时，`importers` 列出指向入口文件的已捕获且已解析导入，`callers` 列出绑定到所选声明的文件、名称、行、列的调用。没有 `--function` 时，callers 覆盖入口文件任意位置的已绑定目标。每份列表独立限制为 40 条，并提供 `total/included/omitted`；限制在反向选择后应用。检查每个来源的新鲜度，仅使用 `status: valid` 的 `navigation.location`。过期来源和转发路径保留其捕获记录及计数，但不提供有效导航。未知的历史调用模型使调用者总数保持未知。这些列表是捕获的源码引用，不是完整影响图，也不能证明运行时派发。只有原适配器捕获过 `directCaller` 时才提供它；不会把外层源码范围推断为嵌套调用的直接调用者。

   缺少该标记的旧 JS/TS 事实仍可读取，但即使其 calls 数组非空，也需要重新提取才能进行调用导览。

   当前 Python `python-source-v3` 使用移植的 Pyright 语法代码盘点源码调用，并将目标扩展到有限范围内的接收者声明。历史 Python `python-lexical-v1` 盘点解析有效文件中的每个 `ast.Call`。它只绑定唯一的普通、无装饰器模块级定义，或通过显式静态 from-import 别名指向直接捕获的定义。属性、类、带装饰器目标、重导出、遮蔽和歧义绑定保持未解析。已捕获的 `functions[].sourceRange` 保存精确的 UTF-16、末端不包含位置，以及解码后源码片段的哈希；此消费者不重新进行 TS 解析即可验证它。范围从 def/async def 起，不包含前置装饰器；物理上位于范围内的默认值和嵌套方法体会包含在内。这不确立执行或运行时身份。配对定义比较使用下文所述的另一个完整头部范围。

   新鲜 Java `java-static-lexical-v1` 捕获盘点方法调用，包括所选范围内的嵌套类型和 lambda。构造器和方法引用不在其中。对于顶层普通类中没有 extends/implements、具有匹配固定参数个数的唯一显式 static 实体方法，`same-file-static-method` 为裸标识符调用提供词法源码候选。重载、可变参数、显式调用类型实参、Object 方法名，以及嵌套／局部／匿名所有者保持未解析。它不检查实参类型适用性或编译；运行时派发、反射和提供者需要阅读源码。Java 精确函数列排除同一行相邻方法。参见 [Java 边界](JAVA.md#method-invocation-source-navigation)。

   缺少已识别模型的历史 Python／Java 捕获仍为 unavailable，总数未知；空数组不表示没有调用。新增标记的事实需要更新后的 raw-facts schema；旧的严格读取器会拒绝这个额外字段。

   每个 `calls.records` 项保留原始 `fact` 和在分析目录 `raw-facts.json` calls 数组中的 `factIndex`，并关联到 `calls.provenance` 中的快照。使用完整的起止范围；链式调用可能共享起点。原始 `fact.target` 是捕获证据，不是当前导航承诺。只有 `targetNavigation.location` 的状态为 `valid` 时才使用它。同文件目标共享入口新鲜度；导入目标单独检查。目标已变更、缺失、不可验证或存在解析错误时，`location: null`；使用这些目标范围之前，阅读当前源码并刷新提取。有效导航验证已捕获目标文本和坐标，不表示其他源码／配置变化后已重新解析。断言当前绑定关系之前刷新提取。不读取或解析未捕获目标。

   对于 JS/TS，v1/v2 的 `imported-function` 覆盖指向直接导出的相对、非 type-only 具名导入；v2 还支持上文所述的直接默认函数声明。命名空间、包、CommonJS／动态和重导出路径仍不受支持。有效的 `same-file-function` 导航可作为词法声明提示，包括重新赋值情形。`same-file-function-initializer` 指向直接 const 初始化器；具名函数表达式使用已测量的内部名称，它可能不同于变量名。这不能证明 TDZ 安全性或执行。被包装的初始化器、let/var、别名和参数传播仍未知；未解析原因要求阅读当前被调函数、参数、导入或赋值。所选范围包含嵌套函数和闭包体，不仅包含所选函数的直接调用。

   当前 JS/TS 测量还为实现记录 `functions[].sourceRange`：从 1 开始的 UTF-16 列、不包含的末端，以及已捕获片段的 SHA256。该范围内的位置标识所测量的实现，不证明运行时派发。JS/TS 适配器修订 23 及以后要求 `sourceRange`；更早且缺少该字段的 JS/TS 捕获仍可读取。

   输出包含按源码顺序排列的前 40 条记录。得出结论之前检查 total/included/omitted；通过当前源码或原始事实读取其余部分。入口新鲜度只覆盖同文件目标。把未解析导入视为覆盖限制。完成标准：每个验收问题都有源码支持的回答，或明确命名的未解析边界。
4. **检查。** 选择少量影响重大的主张，在运行有限探测之前记录预期结果。遵循项目的测试选择指南。记录实际命令、结果和未测试分支。交付前复查使用过的文件；若有变化，更新分析或将相关主张标记为过期。仅有入口新鲜度不能验证报告其余部分。对于变更，分别定位并检查两侧源码，然后使用相同的有限输入运行检查，并记录预期 base/head 结果。记录依赖／环境复用及其限制；针对当前实验树的检查不能验证历史两侧。
5. **交付。** 编写带源码链接的实际分析：职责、输入／输出、主要流程、关键依赖／配置、失败出口、相关变更语义，以及覆盖限制。区分工具观察、Agent 解释和运行时观察。改进候选需要有已观察问题、最小合理变更和验收检查；否则明确得出“没有充分理由变更”的结论。完成需要这份分析和验证记录，不是 CLI 导览或这份清单。

工具检查文件身份并定位已捕获事实；语义解释由宿主 Agent 负责。报告所分析修订版本及工作树状态。单次运行既不是独立验证，也不是准确率／成本基准。语义解释不授权实施其提出的变更。

对于已保存的 Python／Java／C/C++ 问题，传入现有分析目录和唯一的已捕获函数 qualname。例如，从 `archify/` 运行：

```sh
node bin/archify.mjs code-analysis task /path/to/python-analysis \
  --question "Where does this imported helper come from?" \
  --root /path/to/python-source --entry package/entry.py --function chosen
```

歧义名称仍会报错。`Entry.chosen()` 这样的 Java qualname 可以区分重载；Python stub 可能与实现共享 qualname，因此没有唯一捕获名称时，应省略 `--function` 并检查文件。导入覆盖整个入口文件。Python 包边不能标识所导入的对象，Java 类型边也不能证明运行时提供者或调用目标。

<a id="change-questions"></a>

## 变更问题

对于两个现有源码根目录，从 `archify/` 包目录准备一对新鲜捕获：

```sh
node bin/archify.mjs code-analysis task \
  --question "How did language selection change?" \
  --base-root /path/to/base --root /path/to/head \
  --entry extract/index.mjs --format json --out /path/to/review/change.json
```

输出必须位于两个根目录之外。该路径使用已安装的分析器依赖并读取源码，不运行目标应用或更改 checkout。验证后的入口后缀一次性为两侧选择 JS/TS、Python (.py) 或 Java (.java)，即使根目录混合多种语言也如此。两侧使用当前提取器和同一份有效分析配置（默认值，或一个按通常分析配置规则与默认值合并的 `--config`）。它接受未提交文件；Git 元数据作为背景信息，每个快照摘要标识所捕获的文本。C/C++ 配对问题选择 `.c/.cc/.cpp/.cxx/.C` 翻译单元入口，并保守地将编译数据库设置变化报告为 partial。现有分析目录、finding/verify 选项和 `--function` 属于独立模式。

跟随位置之前先阅读导览：

- `fileChanges` 覆盖两个根目录中所选入口语言的已捕获文件。新增／删除文件属于正常结果。文档、排除文件和其他语言不在此信号范围内。`changedDefinitions`、`positionOnlyDefinitions` 和 `unpairedDefinitions` 聚焦入口文件；已知引用搜索所有已捕获源码。支持入口只在一侧存在。`definitionCoverage` 明确报告每侧情况。已捕获声明文件的覆盖为 `declaration-file-unsupported`，状态 partial／退出码 1；可用实现文件测量到零个函数是另一种结果。
- `outgoingImports` 列出每侧入口文件的导入，与所选定义分开。每项保留原始导入 `fact`、该侧／快照的 `factIndex` 和 `originStatus`。`targetNavigation` 独立提供：未解析或外部目标的位置为 null，并有明确原因。解释事实时保留 `kind`、`typeOnly`、`lazy` 和 `conditional`。导入位置变化是源码阅读证据，不是执行时机的证明。
- `moduleReading` 与函数调用分开：每侧列出目标为入口的已捕获、已解析导入／重导出。阅读原始 fact 的 `kind`、`typeOnly` 和 `lazy` 标志（缺失标志表示 false）。这些是依赖阅读位置，不证明某函数执行或行为受影响。`factIndex` 定位该侧／快照的 imports 数组。导航要求来源／入口源码有效且解析输入未变；配置差异仍保留同样的绑定归因限制。未解析导入计数覆盖所有已捕获源码，而这些导入的目标不能归属于此入口。零个已解析引用不能证明没有消费者。
- 唯一的文件 + 限定名称 + 语法种类槽位是一对阅读位置，不是持久实体 ID。文本差异包含格式变化，不证明行为变化。函数文本相等但位置移动的情况单独列出。重命名／移动显示为 unpaired 或 deleted/added，绝不根据名称或相似度推断。重复槽位保持 unpaired。
- Python／Java 仅配对具有已验证 `functions[].definition: {kind, sourceRange}` 元数据的已捕获具名定义。UTF-16、从 1 开始、末端不包含的范围涵盖所属装饰器／注解／修饰符，排除前置注释和尾部换行。SHA256 对解码后源码片段的 UTF-8 编码计算哈希。Python `FunctionDef`／`AsyncFunctionDef` 元数据独立于原始 `sourceRange`；后者仍从 def/async def 起，仍是调用目标坐标。输出中，定义的 `line`／`column` 保留该身份起点；`definition.sourceRange` 是 `textSha256` 使用的完整比较范围。Java 使用带方法体的精确 CST method／interface-method／constructor／compact-constructor 种类。初始化器和字段 lambda 指标记录缺少该元数据，保持 unavailable；abstract 和 native 无方法体声明不捕获为定义。Java qualname 包含参数拼写，因此参数变化可能保持 unpaired。历史元数据缺失或范围／哈希无效时为 unavailable，绝不从整行猜测；`unavailableDefinitions` 记录有限范围的原因并使覆盖为 partial。Java 原始源码偏移保留安全的 Unicode 转义拼写；需要 Unicode 预处理的文件仍为解析错误。
- 非 TS 一侧的 `resolution` 具有 `coverage: not-applicable`、`model: captured-source-import-resolution` 以及共享分析配置摘要；不会虚构编译器读取／选项。其绑定归因为 `source-import-model-only`，绝不等同于运行时环境证据。两次捕获的 producer、修订、语言和调用模型必须匹配。
- 对于 JS/TS，每侧记录源码新鲜度、解析失败、编译器选项，以及实际读取的配置／包输入的摘要。相对根目录的选项会归一化以便比较；继承配置和包元数据均包括在内。`comparison.resolutionChanges` 列出变化的选项及其值，以及变化的配置／包路径及每侧哈希，与源码文件变化分开。差异会设置 `bindingAttribution: limited`：在把绑定变化仅归因于源码之前，应先解释这些差异。即使无关配置文本编辑，也会保守触发该限制。配置相同的情况下，新增源码候选也可能改变绑定。
- 解析失败或源码漂移产生 `status: partial` 和退出码 1，同时保留有效区域；该退出码描述捕获／配置限制，不是 finding gate 失败。受影响定义没有可信位置。原始调用 `fact` 记录是捕获证据；仅在 `knownReferences.items[].navigation` 有效时使用它。坐标和 factIndex 属于该项所在的一侧和快照。此模式不生成已保存 raw-facts 目录；选定记录内嵌在输出中。解析输入漂移会抑制调用导航。
- `knownReferences` 和 `unresolvedWithinSourceRange` 公开调用覆盖。当前 Python `python-source-v3` producer 支持有限范围的接收者和签名声明锚点。配对比较记录显式依赖声明哈希的差异。参见[模型限制](PYTHON.md)。采用 `python-lexical-v1` 的历史匹配 Python producer 支持直接名称的词法调用证据；即使带装饰器目标和方法调用目标保持未解析，带装饰器定义仍可以配对。范围内未解析调用点使用完整所属范围，可能包含装饰器表达式和嵌套定义。采用 `java-static-lexical-v1` 的匹配 Java producer 支持有限范围的 `same-file-static-method` 源码候选，并将成员调用保留为未解析。这些候选不检查实参类型适用性或编译。没有已识别模型的历史捕获使用 `coverage: unavailable`、`total: null` 和 `omitted: null`，无论捕获的 calls 数组是否为空。未知模型仍为 unavailable；仅靠适配器修订号不能授予覆盖能力。
- 可用列表包含 total/included/omitted，最多 40 项。上限之外的相关内容应阅读源码。`unresolvedWithinSourceRange` 包含嵌套闭包；受支持的词法引用不能确立运行时调用者、完整影响或风险。新鲜度检查是有限观察，不是原子的双树快照，也不承诺将来重新解析。

继续执行上面的**追踪**、**检查**和**交付**。尤其要阅读两侧的实际调用者和相关分支，并区分源码支持的解释与实际执行行为。完成需要一份带源码引用、明确未知项的简短分析，不只是此导览 JSON。

对于 `python-lexical-v2`，一个唯一、无条件、显式 from-import 重导出可以把调用经由 API 模块连接到已捕获实现。阅读此路径记录的两条静态导入边；别名不改变定义名称。更长／重新绑定／条件／通配符链以及运行时模块初始化仍未得到证明。已保存的 v1 输出保留仅直接绑定的范围。

Rust `rust-source-direct-v3` 保留之前的直接／单态覆盖，并新增 `rust-specialized-inherent-source-candidate`：经由无约束类型泛型 struct 的裸路径可以标识一个具体特化的源码函数。非泛型 impl 中具名类型实参只确立源码候选；适用性／推断、显式泛型调用实参、Self／别名／trait／接收者，以及生命周期／const／有约束／带默认值的所有者仍未获证明。不支持的泛型／接收者或其他竞争 inherent 声明会使选择保持未知。复用已捕获导入解析器和源码范围。历史 v1/v2 捕获保留各自原有范围。
