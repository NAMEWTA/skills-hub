<a id="c-and-c-source-analysis"></a>

# C 与 C++ 源码分析

C 编译单元使用 `--language c`，C++ 项目使用 `--language cpp`。选择 C++ 也包含同一编译数据库列出的 `.c` 编译单元。每次运行仍只分析一种语言选择。头文件的语言和活动预处理分支由包含它的编译单元决定；仅凭后缀不会选择解析器模式。

<a id="prerequisites-and-command"></a>

## 前提与命令

提供已有 `compile_commands.json`，以及安装了与本机 `libclang` 兼容的 `clang` 绑定的 Python 解释器。Archify 读取数据库及源码，不调用数据库中的编译器、CMake、Make、项目测试或生成器。CMake 使用 Ninja 或 Makefile 生成器时，可通过 `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON` 生成数据库；分析前由你自行运行配置。没有编译单元命令的纯头文件项目不在本适配器范围内。

本地验证过的 Apple Clang 14 配置：

```sh
python3 -m venv /path/to/clang-venv
/path/to/clang-venv/bin/python -m pip install 'clang==14.0.6'
export ARCHIFY_CPP_PYTHON=/path/to/clang-venv/bin/python
export ARCHIFY_LIBCLANG=/Library/Developer/CommandLineTools/usr/lib/libclang.dylib
```

Linux 和 Windows 也通过 `ARCHIFY_LIBCLANG` 覆盖库位置，指向已安装的 `libclang.so` 或 `libclang.dll`。`ARCHIFY_CPP_SYSROOT` 可覆盖系统根；macOS 否则询问 `xcrun --show-sdk-path`。当前集成已在 macOS 的 Apple Clang 14 上验证。Linux、Windows 的发行版与 SDK 组合仍需验证，才能声称是受支持的发布环境。

创建分析配置，例如：

```json
{
  "cpp": {
    "compileCommands": "build/compile_commands.json"
  }
}
```

路径可以是绝对路径或相对分析根的路径；文件必须命名为 `compile_commands.json`。只有配置了 `cpp.compileCommands`，自动语言检测才考虑 C 和 C++。混合仓库选择其他语言时，仍可报告未检查的 C/C++ 文件。显式 `cpp.sysroot` 覆盖环境变量和 macOS 自动检测。`cpp.timeoutMs` 默认 180000，大范围选择可设为 10000–600000 毫秒。然后执行：

```sh
node archify/bin/archify.mjs code-analysis check /path/to/project --language cpp --config /path/to/analysis.config.json --out /path/to/analysis --fail-on never
```

`--fail-on never` 适合初次检查；它不证明项目没有问题。`check` 与 `prepare` 在回执及离线分析视图中提供相同的捕获事实。

<a id="evidence-and-limits"></a>

## 证据与限制

只解析具有精确、唯一数据库命令的源码。绝不接受数据库查找推断出的后备命令。缺失命令、解析器诊断及歧义命令会明确记录或拒绝。`languageScope.build.units` 给出每个选定编译单元及其命令摘要、标准、宏名称、包含路径、目标和解析状态。`raw-facts.json` 不保存数据库原始文本，只保存其 SHA-256。数据库变化后，已保存问题变为过期，finding 比较报告构建范围发生变化。

项目源码字节只捕获一次，再作为未保存文件传给 libclang。如果活动项目 include 未被捕获或已被排除，提取会停止，避免把实时源码与冻结事实混合。外部 SDK 和第三方头文件作为解析上下文，不作为捕获的项目文件。适配器拒绝响应文件、编译器插件和参数转发选项，以及预编译／模块状态等不支持的文件加载标志。参数包含字面的 `@` 时使用 `arguments` 数组。解析前移除依赖输出和 time-trace 输出选项。所得事实不证明项目可以构建。

默认 C/C++ 输入集合包含 `.h`、`.hh`、`.hpp`、`.hxx`、`.inc`、`.ipp`、`.inl`、`.tcc`、`.tpp` 和 `.def` include。这些默认值只适用于 C/C++ 适配器。与共用默认值不同的自定义 `include` 列表，仍严格选择其指定模式。分析配置排除的文件不解码，也不计入源码字节预算。活动 include 若指向被排除的项目文件，会以明确诊断停止提取。UTF-8 验证适用于带编译命令的编译单元和活动项目 include；未使用文件不会阻塞提取。经外部包装头文件到达的项目头文件仍被捕获，并归入包含它们的编译单元。

include 边表示指令在至少一个已记录编译单元上下文中活动。`contexts` 列出这些单元；模块图是其并集。环发现要求每条边有共同上下文，属于结构 warning，绝不声称运行时初始化有问题。它们列出全部观察到的上下文，并展示 `exampleContext` 中的一条路径；其他上下文可能使用另一条路径。函数复杂度统计 `if`、循环、`case`、catch 和条件表达式节点，再加一；嵌套记录 branch/switch 深度。同一个物理定义若在不同上下文中出现身份或测量冲突，会被省略并列入 `languageScope.conflicts`。

`cpp-source-direct-v1` 盘点 libclang 调用表达式；只有源码定义在同一编译单元可见、与已捕获函数范围匹配，而且属于普通直接调用时才绑定。虚分派、函数指针、模板和宏生成的调用，以及需要跨单元链接的调用保持未解析。绑定目标是源码导航证据，不证明执行或完整调用图。宏被调用者展开按 Clang 预处理记录检查；仅位于普通调用实参中的宏不会遮蔽其直接目标。调用者身份在上下文间不一致时，合并调用省略 `directCaller`；一致的调用者即便目标未知也保留。

<a id="source-questions"></a>

## 源码问题

`.c`、`.cc`、`.cpp`、`.cxx` 和 `.C` 入口的已保存问题使用其自身编译单元。上述所有已捕获头文件后缀都可作为已保存问题入口。头文件需传入其一个已记录上下文：

```sh
node archify/bin/archify.mjs code-analysis task /path/to/analysis --root /path/to/project --entry include/api.h --context src/main.cpp --function chosen --question 'Who calls this definition?' --format json
```

问题在提供导航前检查当前入口、显示的目标文件和编译数据库摘要。数据库不变不能证明外部 SDK 文件不变。新的配对问题接受 C/C++ 编译单元入口；两个根之间观察到的数据库或解析器设置不同时，比较为部分覆盖。

完整回归 CI 分片从 `libclang==18.1.1` 安装匹配绑定及原生库，并设置 `ARCHIFY_CPP_REQUIRED=1`，使解析器不可用时 C/C++ 测试失败。其他本地流程未安装解析器时，可以明确跳过原生测试。用适配器 revision 4 重新生成 C/C++ 事实，可获得修正后的宏与调用者来源信息。
