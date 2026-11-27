<a id="go-source-analysis"></a>

# Go 源码分析

Go 支持属于实验性的源码调查，不是项目构建或完整影响图。通过常规 CLI 选择：

```sh
node archify/bin/archify.mjs code-analysis check /path/to/module --language go --fail-on never --out /tmp/go-analysis --json
node archify/bin/archify.mjs code-analysis task /tmp/go-analysis --root /path/to/module --entry doc/man_examples_test.go --function ExampleGenMan --question 'Where does GenMan resolve?' --format json --out /tmp/go-question.json --json
node archify/bin/archify.mjs code-analysis task --root /path/to/after --base-root /path/to/before --entry doc/man_docs.go --question 'What known references reach this changed definition?' --format json --out /tmp/go-change.json --json
```

根目录必须有已捕获且含 module 指令的 `go.mod`。一次运行分析该模块；不加载嵌套模块、`go.work`、`replace`、外部依赖或 vendor 目录。包导入按声明的模块路径加目录匹配，不按 basename 或目录远近匹配。缺失依赖保持 external/outside，不触发网络访问。

<a id="toolchain-and-cost"></a>

## 工具链与成本

除 Node 外，需要安装 Go **1.18+ 编译器**。辅助程序只使用 Go 标准库 `go/parser`、`go/ast`、`go/build` 和 `go/types`。`go run` 编译的是 Archify 内置辅助程序，不是被分析模块，并使用已安装本地工具链／缓存。`ARCHIFY_GO` 可选择 Go 可执行文件。缺失可执行文件会产生结构化 `extract/go-unavailable`、安装指引及退出码 2；编译／进程错误产生 `extract/go-failed`。

已安装 SDK 在仅含捕获元数据文件的临时目录中，通过 `go mod edit -json` 解析 `go.mod`。它处理 module 块、带引号路径和 Go 转义，不另写解析器。无效或不支持的元数据以 `extract/go-module-invalid` 明确失败。命令不加载依赖，也不改写项目。Go workspace/config/flag 覆盖、自动工具链切换、模块代理和校验和访问均被禁用。仅 SDK 的 `go list` 仍可能在另一空目录准备标准库类型导出；不执行项目程序、测试或生成器。

模块声明的 Go 语言版本会在标准库模式及仅捕获模式中传给 `go/types`。没有指令时使用 Go 1.16。记录的构建范围包含 `languageVersion` 和 `moduleParser`；旧 SDK 可能拒绝较新指令，因此应选择理解捕获元数据的 SDK。toolchain 指令绝不触发下载。这是部分源码类型检查，不证明项目成功构建。现有保存捕获仍可读；提取 revision 7 区分修正后的解析／版本行为与此前结果。

没有新增 npm 依赖或独立语言服务器。辅助程序首次编译需要 Go 常规编译缓存，成本高于热运行。元数据解析器修正前，一个微小输入的历史测量为：空 Go 编译缓存下 2.46 秒，复用缓存时 0.27 秒（本机 Go 1.27.2）。这些历史数字不包含新增元数据命令，不是当前端到端耗时，也不是真实仓库性能基准。现有 Homebrew Go 1.27.2 安装占 270 MiB；未测量全新安装／下载大小及首次运行延迟。没有 Go 的用户必须安装工具链；ZIP 没有把解析器作为平台二进制内嵌。

<a id="build-and-source-coverage"></a>

## 构建与源码覆盖

CLI JSON 回执中的 `coverage.languageScope`、`raw-facts.json.languageScope` 及问题范围报告：

- 根模块及捕获的 `go.mod`／`go.work` 输入，含源码文本和哈希。
- 实际 GOOS/GOARCH、显式 build tag、Go release tag／工具链、测试及 cgo 范围。
- 选定源码文件名、包和外部测试变体；每个被排除的 Go 文件名都有原因。
- 解析失败与不完整源码类型信息分别报告，含类型错误数、至多 20 个诊断例子，以及未加载的外部包。

可选配置：

```json
{"go":{"goos":"linux","goarch":"amd64","tags":["custom"],"tests":true,"cgo":false}}
```

未设置 GOOS/GOARCH 时，优先使用已设置的环境变量，否则使用宿主值。build tag 默认为空；明确不加载环境中的 GOFLAGS。为调查用途，默认包含测试文件。生产包、内部测试变体及外部测试包分别检查；模块图仍按既有默认角色策略排除测试／生成文件。角色排除影响图，不影响原始调用捕获或反向引用枚举。配置 include/exclude 仍生效。

`go/build.Context.MatchFile` 对照捕获字节评估平台文件名、`//go:build`／旧约束及 release tag。Cgo 源码、Go 忽略目录（含 `_...` 下示例）、vendor 和嵌套模块会明确排除。这是源码构建选择，不确认每个选定包都能编译。

<a id="definitions-dependencies-and-calls"></a>

## 定义、依赖与调用

带函数体的函数／接收者声明具有精确 UTF-16、结束位置排他的范围及源码哈希；配对问题比较 `FuncDecl` 源码区域，并枚举跨文件／包已捕获的已知直接调用者。匿名函数体包含在语法调用盘点中，但不是独立的被测量声明。struct／type／field 导航尚不是独立定义能力。

`go-source-direct-v1` 记录 Go `ast.CallExpr`，含转换、嵌套字面量及未解析调用。它用 `go/types.Info.Uses` 识别捕获的自由函数声明。普通导入、导入别名、泛型实例化语法，以及同包跨文件直接函数可以绑定。两个文件属于同一包时，原生 `go-direct-function` 事实即使没有 import 语句，也能指向另一文件。

外部包以不含声明的占位符表示，因此类型信息是**不完整**的：报告目标只建立源码函数绑定，不表示编译成功、参数适用、实际执行或运行时分派。只有观察到且声明已捕获的函数对象才能产生目标。语法无效的包及重复函数／值／类型名称不会任意选择实现。

`go-source-direct-v4` 还在捕获接口嵌入标准库接口、但后者声明未被捕获时保留接口证据。边记录外部方法身份（`package`、`qualname`、`name`、`external: true`），不捏造源码位置；通过该接口的未解析调用记录 `receiverInterface` 与 `interfaceMethod`。变更查询把这些调用点列为无目标的 `interfaceCandidates`：go/types 证明捕获类型满足接口，但外部声明没有捕获位置，因此运行时目标未确定。

方法、接口分派、函数变量、闭包、内建项、转换及不可用外部目标仍未解析。不暗示存在 points-to／callgraph 求解器。变化定义是接口方法声明时，绑定到该声明的调用属于已知引用，`interfaceCandidates` 列出该精确声明的捕获 method-set 实现，标记 `runtimeTarget: not-determined`。列表证明捕获类型满足接口，不证明运行时调用到达哪个实现。测试替身及外部实现仍可能是替代目标或处于捕获范围外。包导入边引用包源码成员关系，不是逐符号定义主张。除非显式分组／深度配置改变行为，否则按 Go 包分组。

已保存问题同时检查捕获元数据及源码的新鲜度；`go.mod` 变化会阻止有效绑定导航。配对问题记录构建选项／元数据，二者不同时限制归因。这些检查不建立整树原子性，不发现捕获后新文件，也不在导航时重新解析项目。解释缺失调用者前先读选定／排除范围。`ready` 表示可用源码导览，不表示完整影响或成功编译。`--fail-on never` 保留已有 finding 门禁约定；即便退出码为 0，也要查看覆盖。

finding 比较还在 `analysis.goBuildScope` 记录有效源码选择（GOOS/GOARCH、显式／release／tool tag、测试及 cgo）。即使配置摘要和所选文件数相同，不同构建范围也不能直接比较。没有该字段的历史 Go finding 仍有效，但可比性未知，除非其他已记录差异已证明不可比。源码增删及基于 finding 的退出策略不变。
