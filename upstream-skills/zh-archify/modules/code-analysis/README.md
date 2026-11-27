<a id="code-analysis"></a>

# 代码分析

在 Archify 包目录运行 `npm start -- "/path/to/project" [--locale zh-CN]` 启动 Archify。打开打印出的 URL，进入独立工作台和 Atlas。添加 `--ir architecture.json`，可保留所编写的图以及现有点击分析双视图。用 `--out` 指定输出目录；否则产物写入系统临时目录。下方旧命令仍受支持。

[快速开始](docs/USAGE.md)——安装、启动及查看分析结果。

调查指定 GitHub PR 时，在相同的 `prepare`、`start` 或 `serve` 流程中添加 `--pr <URL-or-number>`。PR 编号使用本地 origin 或显式的 `--repository OWNER/REPO`；`--scope` 选择仓库相对目录。固定的两个版本都使用现有分析器、工作台、语言区域、证据及任务流水线。比较及源码捕获限制见快速开始。

[外部诊断（C7）](docs/EXTERNAL-DIAGNOSTICS.md)——导入已有 ESLint、Ruff、SARIF 和 GitHub 评审结果；结合源码覆盖及证据浏览、筛选；在 CLI 或本地查看器中导出任务、接受或撤销基线决定。静态报告保留阅读及已捕获任务的导出能力。

导入的 lint 错误默认降为 warning；info 仍为 info，并保留原来源级别。显式设置 `external.severity: "source"` 可使用原有 error/warning/info 映射，这可能把开放错误显示为红色，并让 `--fail-on error` 失败。AI 评审始终为 warning。CLI 默认的 `--fail-on warning` 不变。把以前的 source 模式导入切换到新默认值，需要重新评审基线；跨越该策略变化的比较不具可比性，不能用于 `--new-only` 门禁。

Code Analysis 是 Archify 集成的静态代码分析模块，从 Bauify（提交 4bb811c）导入并在此维护。它读取源码依赖（JavaScript、TypeScript、Python、Java、Go、Rust），将文件归入模块，检查导入环、耦合、函数复杂度和配置的架构边界，并提供带 Atlas 的独立工作台。可选的手工架构图保持原样，并可与同一次分析对齐。

各评审流程共用同一提取与图处理流水线：

- **准备好的调查**（`prepare`）：`code-analysis prepare <repo-root> --out out/analysis [--locale zh-CN] [--ir architecture.json]` 生成包含已捕获 AI 任务的 `analysis/repo.analysis.html`，默认打开总览，然后退出。阅读器依次采用 `--locale`、可选的 `meta.locale`（`zh-CN`，否则回退英文）；不会保持服务器运行。自然的技能交付方式及编辑后重启比较，见 [Agent 入口与调查](docs/USAGE.md#agent-entry-and-investigation)。

- **图上分析**（`serve`，也可通过 `npm start` 到达）：
  1. **Archify 交付手工编写的图**（`archify deliver architecture …`），与没有本模块时完全相同。
  2. 交付页面通过本地服务提供，多一个 **Code Analysis** 工具栏按钮。
  3. **点击按钮才运行分析**——源码提取、模块图、规则、叠加层——并切换到分析视图。点击前不会分析。此后同一按钮显示或隐藏分析层；代码或配置变化后，总览上的 **Re-analyze** 可重新分析，无需重启。
- **终端或 CI**（`check`）：没有图的相同分析，也可通过 `--ir`／`--map` 在无界面环境检查图到代码的组件映射及未声明组件导入；支持基线、与上次运行比较及退出码。
- **评审架构漂移**（`drift`）：对照一张手工架构图比较两个本地 Git 提交。评审新观察到的组件导入，打开固定证据，并下载针对某条边的 Markdown 交接。见[架构漂移评审](docs/USAGE.md#review-architecture-drift-between-two-commits)。

`archify code-analysis task` 将一次已完成运行的发现转为 AI 优化任务（JSON 或 Markdown），并对照当前工作树检查证据；页面通过服务器使用相同逻辑。

`check --json` 还返回用于初步了解的 `investigation` 对象：`leads` 重复按优先级排列的线索，包含消息、`path:line`、符号和可执行的 `task` 命令；`architecture` 汇总模块热点、最强跨模块边及 `leads` 之外的结构信号；`ruleCounts` 展示发现按规则的分布。运行 `check` 时使用 `--out`，让每条线索或结构信号都能继续下钻。见[初看陌生仓库](docs/USAGE.md#first-look-at-an-unfamiliar-repository)。

`task --question` 无需发现项即可准备源码导览：源码身份、捕获的函数范围及直接导入。JS/TS 实现入口和新的 Python/Java 捕获，还能包含有范围限制的词法调用证据。Python/Java 入口要求提供保存的分析目录，其中包含由对应适配器捕获的 .py/.java 入口。没有可识别调用模型的历史 Python/Java 捕获，仍保留不可用的覆盖及未知总数。宿主 Agent 随后按[函数分析流程](docs/FUNCTION-ANALYSIS.md)从源码回答问题。CLI 输出只是中间阅读辅助。添加 `--base-root` 并提供必需的 `--entry`，会准备新的前后源码比较，包括分开的调用与模块阅读引用，以及明确覆盖限制。见[变更问题](docs/FUNCTION-ANALYSIS.md#change-questions)。

JS/TS 分析默认使用 `typescript.sdk: "bundled"`。内置编译器遵循项目配置与引用，不执行被分析 checkout 中的代码。可信项目可将 `typescript.sdk` 设为 `"auto"`，发现已安装 SDK，或指定经验证的 TypeScript 包目录。这两种显式选择都会在 Archify 进程中执行所选 TypeScript 包的代码。显式选择时设置 `typescript.requireProjectSdk: true` 可拒绝内置回退。在 `"auto"` 模式中，一次捕获可以对不同子项目使用不同 SDK。`raw-facts.json`、check 回执和发现记录 SDK 来源及项目归属。见[项目 SDK 与配置](docs/TECH-GUIDE.md#project-sdk-and-configuration)。Archify 选中的所有源码都会分析：不属于配置 Program 的文件进入推断项目。配置中的 `exclude` 改变项目成员关系，而 Archify 自身的 include/exclude 控制捕获。[对齐台账](docs/TS-UPSTREAM-LEDGER.md)区分官方引擎比较、迁移观察及剩余产品差异。共享 Program 成员即使其事实归入另一个默认项目，仍可用于调用分析；每份源码仍只记录一次。已验证的改进见 [ts-pattern 验收](docs/TS-REAL-PROJECT-ACCEPTANCE.md)。

可选的 [C6 重复检测](docs/USAGE.md#duplicate-code-c6-optional)通过另行安装的 jscpd 5.4.3 可执行文件支持全部六种语言。它们共用五种分析适配器：`ts` 覆盖 JavaScript 和 TypeScript，其余为 `py`、`java`、`go`、`rust`。C6 保留两个源码位置、扫描覆盖、基线与 AI 任务证据。默认关闭，不替代依赖或函数分析。

在 `archify/` 包目录执行：

```sh
node bin/archify.mjs code-analysis serve /path/to/repo --ir architecture.json --out out/analysis --language py
```

模块的 Node 解析器及 schema 包（typescript、java-parser、xmldom，以及支持 SARIF draft/format 的 Ajv）已预打包到 `modules/code-analysis/vendor/`，无需安装；维护者修改这些固定版本后，从 `archify/modules/code-analysis/` 执行 `pnpm run build:vendor` 重新生成。打开命令打印的 URL，并保持进程运行。选项：`--language ts|py|java|go|rust`（混合语言根目录应显式选择）、`--map overlay-map.json`（IR 的 `sources` 没有说明组件代表哪些模块时，使用 `{"componentId": ["moduleId", …]}`）、`--config file.json`（阈值、include/exclude、角色）、`--quality standard|showcase`（传给 `archify deliver`）。通过 `--baseline baseline.json` 把评审决定保存在稳定的项目路径；否则本地查看器写入 `<out>/baseline.json`。

`--out` 下的输出包括 `architecture.html`（Archify 原样产物），以及点击后生成的 `analysis/raw-facts.json`、`analysis/module-graph.json`、`analysis/findings.json`、`analysis/review.json`、`analysis/overview.json` 和 `analysis/repo.analysis.html`——后者是在交付页面上追加分析层的自包含页面。`analysis/view-context.json` 保留原始视图映射与范围，使评审决定无需新分析即可重建已捕获页面。修改源码或 `--config` 文件后点击 **Re-analyze** 重新分析；只有架构 JSON 变化才需要重启。上一次运行保留在 `analysis.previous/` 中供比较。

独立 HTML 无法运行源码提取器，因此需要本地进程。它只监听回环接口，只接受自身页面发出的分析请求；浏览器请求不能选择仓库或输出路径。Python 分析在 Node 中运行，使用移植的 Pyright 解析器和 Archify 源码声明分析，不需要 Python 可执行文件。被分析代码绝不执行。见 [Python 支持](docs/PYTHON.md)。

Java 分析在 Node.js 中运行，无需 JDK。它提取源码依赖和方法／构造函数复杂度；不构建项目，也不解析 Maven、Gradle、Spring、生成符号或运行时类加载。解析及语法覆盖见 [Java 支持与限制](docs/JAVA.md)。

发现以证据（文件、行、导入、捕获源码）描述工作树事实，并对潜在导入时风险分级；不声称执行安全，也不声称已证明运行时失败。见 [ARCHITECTURE.md](ARCHITECTURE.md) 和[技术指南](docs/TECH-GUIDE.md)。

```sh
npm run test:code-analysis
```

Go 源码调查支持根模块包、函数定义及保守的直接函数绑定。需要 Go 1.18+；构建条件、排除项和不完整类型信息均明确呈现。见 [Go 源码范围与限制](docs/GO.md)。

Rust 源码调查使用 Cargo/rustc 1.71+ 及带锁定解析器依赖的内置源码辅助程序；首次运行会编译辅助程序，并可能获取依赖。捕获的 Cargo 元数据、cfg/features、遗漏源码及未知分派均明确呈现。见 [Rust 源码范围与工具](docs/RUST.md)。启用 C6 后仍使用这些语言工具和解析器；jscpd 提供 token 重复检测，不替代依赖、调用或语言范围事实。
