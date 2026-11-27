<a id="language-reference"></a>

# 语言参考

每次运行选择一种语言。从仓库根执行这些命令。JavaScript/TypeScript、Python 和 Java 示例使用已提交夹具，不构建或执行夹具项目。Go 与 Rust 使用你提供的项目路径，因为这些适配器需要各自的项目元数据及已安装工具链。

<a id="javascript-and-typescript"></a>

## JavaScript 与 TypeScript

```sh
node archify/bin/archify.mjs code-analysis check archify/modules/code-analysis/test/fixtures/ts-basic --language ts --out out/ts
```

`src/index.mjs` 记录静态导入、再导出、命名空间导入及字面动态导入。函数体和延迟导入与模块作用域边保持区别。夹具中的计算型动态导入保留为未解析证据，不猜测成文件边。TypeScript 使用项目捕获的 `tsconfig` 及路径别名；仅类型导入不会成为运行时依赖。

## Python

```sh
node archify/bin/archify.mjs code-analysis check archify/modules/code-analysis/test/fixtures/py-basic --language py --out out/py --fail-on never
```

夹具可能报告 warning。`--fail-on never` 防止演示因 finding 门禁失败；不表示默认门禁会通过。适配器记录包相对导入并测量函数。命名空间包和 `__init__.py` 包初始化影响依赖解析。`py-basic` 夹具包含畸形源码和一个命名空间包，用于展示解析失败及未解析导入如何保留在覆盖中。

Python 代码在 Node 中由从 Pyright 1.1.414 移植的源码子集解析。默认语言目标为 3.14；分析配置中设置 `{"python":{"targetVersion":"3.11"}}`，可选择更早的语法目标（3.8–3.14）。宿主 Python 版本和 `BAUIFY_PYTHON` 不影响提取。完整 Pyright 仅为测试参考，不是运行依赖。见 [Python 范围与迁移](PYTHON.md)。

## Java

```sh
node archify/bin/archify.mjs code-analysis check archify/modules/code-analysis/test/fixtures/java-basic --language java --out out/java --fail-on never
```

与 Python 示例相同，`--fail-on never` 用于演示分析，不声称默认 finding 门禁通过。适配器无需运行 JDK、Maven、Gradle 或项目测试，即可记录无歧义的源码级类型依赖与方法复杂度。夹具包含声明、导入及一个外部超类型案例，其中继承的成员类型有意保持未解析。Java 环是结构依赖，不声称类初始化会失败。解析器及解析边界见 [Java 支持与限制](JAVA.md)。

## Go

```sh
node archify/bin/archify.mjs code-analysis check /path/to/go-module --language go --out out/go
```

Go 分析要求根目录 `go.mod` 和已安装的 Go 1.18+ 编译器。它捕获根模块源码范围、函数定义及保守的直接函数绑定。构建选择、排除文件、解析失败及不完整类型信息保持明确；不下载模块，也不建立完整构建图或运行时调用图。工具链选择、命令和源码问题示例见 [Go 支持与限制](GO.md)。

## Rust

```sh
node archify/bin/archify.mjs code-analysis check /path/to/rust-workspace --language rust --out out/rust
```

Rust 分析要求 Cargo/rustc 1.71+，捕获已声明本地 workspace target、函数范围，以及有边界限制的直接引用证据。首次使用会编译内置解析辅助程序，并可能获取其锁定依赖；不执行项目构建脚本或宏。条件编译、不支持路径、宏和未解析分派都保留明确不确定性。工具链、工作区、调用模型和源码问题细节见 [Rust 支持与限制](RUST.md)。

<a id="c-and-c"></a>

## C 与 C++

```sh
node archify/bin/archify.mjs code-analysis check /path/to/project --language cpp --config /path/to/analysis.config.json --out out/cpp --fail-on never
```

C/C++ 要求已有编译数据库、匹配的 Python clang 绑定和已安装的 libclang。适配器在每个已记录编译单元上下文中捕获活动 include、源码定义及有范围限制的直接调用导航。配置、平台状态、问题和未知项见 [C/C++ 支持与限制](C_CPP.md)。

<a id="evidence"></a>

## 证据

每种语言的 `raw-facts.json` 都记录已解析文件、源码位置、语言专有事实，以及未解析或排除范围。`findings.json` 记录所选适配器、规则版本、配置摘要及覆盖。一次干净运行只说明实际执行的检查；不能证明不存在未建模依赖或运行时行为。
