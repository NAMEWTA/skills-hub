<a id="code-analysis-quick-start"></a>
# Code Analysis 快速入门

明确请求分析 GitHub PR 时，使用相同工作台：

```sh
node bin/archify.mjs code-analysis prepare /path/to/repo --pr https://github.com/OWNER/REPO/pull/42 --out out/pr-42 --locale zh-CN
node bin/archify.mjs start /path/to/repo --pr 42 --repository OWNER/REPO --out out/pr-42
```

`--scope` 选择相对于仓库的目录（默认是提供的本地子目录）。PR 模式将 merge-base 与 head 捕获为不可变 Git blob，并使用一份捕获的配置和语言适配器，对两者运行现有分析器。`--language` 和 `--locale` 保持通常含义。本地检出目录和索引不会改变；不会执行仓库代码、钩子或包脚本。

原生工作台显示 head 的发现结果、源码证据、审阅决定和 AI 任务。比较始终以 PR 的 merge-base 为基准；刷新会重新捕获所请求的 PR。失败运行保留最后一次成功结果。Atlas 保持展示前后计数和复杂度分布。绿色 `+` 与琥珀色 `◇` 标记新增和变化的捕获对象；红色虚线曲线标记已删除、但两端仍存在于 head 中的依赖。已删除对象保留在变更列表中，并通过共享源码窗格打开 base 源码。源码侧按钮在捕获的 base 和 head 文本间切换。存在歧义的函数名不会配对。源码变化不能证明运行时行为变化或已确认缺陷；head 中已有的发现结果也不自动视为由 PR 引入。外部报告保留原始绑定、覆盖和比较限制；此流程不会运行 AI 审阅者。

捕获快照保存在所选输出目录下，因此即使本地检出内容改变，实时任务和审阅决定仍可验证固定的 head。接受审阅结果使用已配置基线和现有服务授权。离线任务始终标为捕获证据；编辑之前，请核对预期检出目录和源码修订版。

在 PR 报告中，Atlas 的 **Files** 打开捕获的变更文件列表。选择 **All captured files** 浏览仓库文件列表。搜索会匹配重命名前后的两个路径。选择变更文件，即可打开精确保存提交中的 merge-base 或 PR-head 源码。如果某侧不存在，或内容不在捕获范围内，对应源码控件会禁用。**Download .md** 记录仓库、两个提交、所选文件相对于仓库的路径及可用性，不包含源码文本。

PR 优先项使用建立在保存事实与图之上的有界影响层，而不采用整个 head 中已有的热点。它比较变化的依赖边和模块 fan-in/out，只在变更源码文件中读取精确定义指纹，并复用现有的传入引用读取器查找直接调用方与导入方，其中也包括未变化的源码文件。指标不变的函数体变化仍是阅读信号；仅位置移动不会成为影响。现有约束只作为上下文附着于变化的依赖或耦合证据。仅规则报告证据更新，不会被提升为风险增加。

该层不执行新的提取或仓库遍历。读取限制为 32 个变更文件、4 MiB 的成对源码、80 个变更定义和 160 条结果记录；每个引用预览也有界。不支持的模型、解析错误、被排除角色和耗尽的预算都会明确保留为未知。这是直接静态定位，不是运行时跟踪、行为等价性证明或完整传递影响分析。完整 head 发现结果另行提供，作为背景。PR 简报复制变更证据及其覆盖范围，不复制无关的整个 head 建议。

在 PR 模式下，简短的文件与函数增删计数跟随原有模块标签，悬停可查看详细计数。变更徽标（+/−/◇）打开捕获源码；灰色虚线尖刺在当前尖刺旁显示 merge-base 复杂度。已删除函数可标记在仍存在的文件上；已删除文件和模块保留在变更列表中。普通仓库分析中不会显示这些注解。指标不变的源码编辑也可以有变更徽标，但不表示复杂度增加或行为变化。

<a id="offline-review-of-two-local-commits"></a>
## 离线审阅两个本地提交

使用精确 Git 提交 ID 生成自包含审阅，无需联系 GitHub：

```sh
node bin/archify.mjs code-analysis prepare /path/to/repo \
  --base <40-character-base> --head <40-character-head> --language ts \
  --out out/pinned-review
```

请预先准备 Code Analysis 依赖和语言工具。所选范围需要的 Git 对象必须在本地可用。缺少提交或树对象时会产生诊断，失败运行会保留最后一份成功报告。读取器直接比较所选 base 与 head。要匹配 GitHub 的 PR 比较，请自行解析并传入其 merge-base。脏工作树、Git 分支移动和未跟踪文件都不会改变选中的提交或证据。大型仓库可使用 `--scope <repo-directory>` 选择子树。Git 使用 50% 相似度检测重命名；跨越范围边界的移动会显示为新增或删除；剩余未匹配路径超过 1000 个时，Git 可能跳过代价高昂的相似度搜索。

直接在浏览器中打开 `out/pinned-review/analysis/repo.analysis.html`。**Review commits** 显示完整 Git 身份。Atlas 的 **Files** 列出变更文件，重命名会链接两个保存路径。捕获文本提供源码按钮。分析选择范围外的变更文件，如果是普通 UTF-8 文件，仍可能有预览（补充预览每文件最多 128 KiB，每侧最多 4 MiB）。这些预览不会扩大分析覆盖。**Architecture assessment** 将观察到的依赖变化链接到源码。对于 JS/TS，可添加已有 `--ir architecture.json` 和可选 `--map overlay-map.json`，使用与 `drift` 相同的静态分析比较编写好的组件关系。选择一条关系可高亮其组件或打开导入证据。归属、解析和语法解析方面的不确定性仍在该关系中保持可见。

**Download review .md** 导出两个提交、变更路径、已记录依赖变化、源码坐标和覆盖范围。导出不包含源码文本。HTML 包含捕获的源码摘录和任务，应仅分享给可以阅读这些源码的人。相同固定选项也可用于 `archify start` 或 `code-analysis serve`。

在 Archify 仓库中的 `archify/` 包目录下运行：

```sh
npm start -- "/path/to/project" --locale zh-CN
```

打开打印出的 URL。未提供 `--ir` 时，页面加载即开始分析：左侧工作台展示优先项和任务复制控件，旁边是可交互的全仓库 Atlas。选择发现结果可高亮其 Atlas 证据；**Open source evidence** 从 Atlas 返回左侧读取器。窄屏上，工作台堆叠在 Atlas 上方。

要对齐已有的手工架构图，请添加 `--ir architecture.json`。该模式仍先交付原图，只有点击 **Code Analysis** 后才分析。使用 **Atlas** / **Classic view** 切换视图；源码映射与 IR 校验保持不变。`--map` 要求同时提供 `--ir`。

两种模式都可以选择优先项或浏览全部发现结果、复制 AI 任务，并检查捕获的源码摘录。**Show full file** 展开片段。任务标注其证据状态；编辑前应验证源码。`--locale en|zh-CN` 覆盖图的区域设置；未覆盖时先采用 IR 区域设置，再回退到英语。无法识别的 IR 区域设置回退到英语。

保持终端运行。修改源码或 `--config` 文件后，在概览中点击 **Re-analyze**：无需重启就会重新读取仓库和配置，页面以新结果重新加载，概览显示相对于上次分析的变化（新增、不再检测到，以及代码变化的发现结果）。不再检测到某条发现结果，不一定意味着已修复：如果两次运行之间配置、实际运行的规则或成功解析的文件发生变化，比较会标为不可直接比较，并说明原因（参见[比较运行结果](#comparing-runs)）。重新分析失败时，最后一次成功结果保持不变，原因显示在按钮旁。只有架构 JSON 改变时才需要重启。

分析读取工作树，包括未提交和未跟踪的源码文件。结果标为 **Working tree**；任何基础提交仅供上下文参考。源码面板使用提取时捕获的文本，工作树结果不提供基于提交的源码链接。原始事实保留源码文本和快照摘要，使发现结果、图与源码面板对应同一次提取。支持非 Git 目录。

源码面板对照基础提交标记捕获变更：绿色行边栏表示新增行，琥珀色表示修改行，行间红色删除标记表示删除。这包括暂存与未暂存变化；基础提交中不存在的文件标为 **New file**。标记始终绑定捕获源码，要看到后续编辑需重新分析。没有可读 Git 基础版本时，面板报告标记不可用，而不会把每一行都视为新增。

如果启动后架构 JSON 改变或不可用，分析请求会被拒绝，页面要求重新生成图。请使用更新后的 JSON 重启，并打开新 URL。服务器绝不会重写输入 JSON，也不会静默将新架构与旧图组合。

可选择 JavaScript、TypeScript、Python、Java、Go、Rust、C 和 C++。使用 `--language ts|py|java|go|rust|c|cpp` 指定；`ts` 同时覆盖 JavaScript 和 TypeScript。每次运行使用一个适配器；[语言参考](LANGUAGE-REFERENCE.md) 提供示例命令和限制。同时包含 `.java` 文件的 JS/TS 或 Python 树会保留原语言，除非根目录包含 Maven/Gradle 构建文件（参见[升级说明](JAVA.md)）。混合语言根目录请显式选择语言。需要显式映射图组件与代码模块时，添加 `--map overlay-map.json`。

语言提取各有前置要求：

| 适配器 | 必需工具与源码范围 |
| --- | --- |
| `ts` | Node.js；模块内置的 TypeScript 解析器。 |
| `py` | 仅需 Node；移植的 Pyright 解析器，默认 Python 3.14 语法。可将 `python.targetVersion` 设为 3.8–3.14。 |
| `java` | Node.js；模块内置的 `java-parser` 依赖；不需要 JDK 或构建项目。 |
| `go` | Go 1.18+ 与根目录 `go.mod`；参见 [Go 范围与工具](GO.md)。 |
| `rust` | Cargo/rustc 1.71+、根目录 `Cargo.toml` 和已锁定的辅助程序依赖；参见 [Rust 范围与工具](RUST.md)。 |
| `c`, `cpp` | 已有 `compile_commands.json`、Python clang 绑定及 libclang；参见 [C/C++ 范围与工具](C_CPP.md)。 |

Go 与 Rust 适配器编译 Archify 的源码辅助程序，而非目标项目。Rust 首次使用可能获取辅助程序已锁定的依赖；`rust.offline` 要求依赖已缓存。启用可选重复检测时，仍然需要这些工具。

无需图的 Java 分析可运行 `node bin/archify.mjs code-analysis check /path/to/java-repo --language java --out out/java`。不需要 JDK，也不构建项目。保守依赖解析、复杂度度量和语法覆盖参见 [Java 支持与限制](JAVA.md)。

输出默认写入系统临时目录。添加 `--out out/my-project` 可选择持久输出目录。请使用打印出的 URL：双击静态 HTML 文件无法启动本地代码分析。

也可直接运行 `node bin/archify.mjs start "/path/to/project" [--ir architecture.json] [--locale zh-CN]`。旧命令 `code-analysis serve` 仍受支持。

<a id="agent-entry-and-investigation"></a>
## 代理入口与调查

Code Analysis 独立于原生图、讲解页和故事。普通绘图请求使用 `finalize`，只交付图。对于架构健康、耦合、循环、已配置层、大文件、复杂度或重构定位，直接准备独立调查：

```sh
node bin/archify.mjs code-analysis prepare /path/to/repo --out out/project-analysis --language ts --locale zh-CN
```

只有存在相关图，或明确要求对齐已编写的架构边界时，才使用 `--ir architecture.json`。不要仅为解锁分析而编写 JSON。每次运行处理一个适配器，并披露其他语言；根据源码数量选择适配器。工具前置要求和首次安装影响准备时间，因此应报告实际测得的延迟，而非承诺固定速度。

`prepare` 与 `serve` 共享提取、规则、任务和原子输出轮换，然后退出。JSON 回执给出所选范围的计数、覆盖、优先调查线索，以及 `html`（`out/project-analysis/analysis/repo.analysis.html`）；没有 IR 时 `diagram` 为 null，否则指向未修改的已交付图。直接打开 HTML：工作台和 Atlas 已可离线使用，包含捕获任务、源码摘录、架构简报和手动复制回退方式。

在 **Recheck after edits** 下复制保存的启动命令，并在生成报告的机器上运行。命令保留语言、区域设置、配置、基线，以及可选 IR/map。没有 IR 时，打开打印 URL 即开始分析并与捕获结果比较；有 IR 时，点击 Code Analysis。后续编辑使用 **Re-analyze**。报告绝不会自动运行命令。当前源码验证之前，任务始终是捕获快照。

交付分析 HTML，并附上一到两条限定在分析范围内的结论；任务可交给编程 AI，也可在当前对话中调查。用户无需学习命令参数或提供维护目标。分析失败时，保留已单独交付的图，并披露覆盖或工具缺口。

读取器先采用显式 `--locale`，再采用 `meta.locale`：`zh-CN` 使用中文，`en` 和无法识别的区域设置使用英语。源码文本、符号名、规则标识、导入诊断与导出任务证据保留原语言。首屏汇总错误级诊断、文件循环、模块依赖闭环和已配置层规则。零值仅针对实际运行的检查；未运行规则标为未检查。信息级信号仍可通过发现结果筛选器查看。选择优先卡片标题，可直接在发现结果中查看度量与源码位置。卡片的复制图标无需打开结果即可复制 AI 任务；成功后短暂显示勾号，不额外添加状态消息。**Copy architecture brief** 图标与无界面回执共享有界热点和结构定位；其顺序不代表推断出的业务重要性。

Atlas 在右侧栏显示关系图和四个带标签的仓库总数。**Map** 与 **Files** 是简短标签页，默认选中 Map。Files 用可搜索的捕获文件列表替换关系图，不增加第三栏或下方滚动区域。悬停标签可查看说明；标签获得焦点时，也可用左/右方向键和 Home/End。选择文件会替换当前发现结果，返回 Map 时高亮其所属模块；选择模块或发现结果，或清除选择，会替换该文件。右侧面板预览其路径、模块，以及捕获的函数名和行号，并可下载为 Markdown。这是来自已保存分析的导航上下文，不含源码内容或完整诊断与任务证据；这些内容应使用发现结果的源码证据和任务操作获取。它不意味着已验证新鲜源码或外部工具。复杂度分布、可滚动模块列表、依赖记录和图例无需展开即可看到。选择模块会平滑展开其外弧，并让无关模块变暗；检查函数时保留所选模块。在独立报告中离开发现结果时，Atlas 恢复先前选择、缩放、标签页和搜索。使用 **Hide analysis** 为星图释放空间，通过左边缘拖柄重新显示读取器。

编辑后，醒目的比较显示 **no longer detected**、**new** 和变化的证据。发现结果缺失不能证明已修复。配置、分组、模型或覆盖变化会使结果不可比，并显示原因。宣称改进之前，应验证源码变更和项目测试。

<a id="verify-a-previous-task-after-edits"></a>
## 编辑后验证先前任务

1. 编辑前，打开发现结果的 **Task preview and download**，再点击 **Download task JSON**。使用 Markdown 或复制操作把任务交给开发者或编程代理。
2. 完成变更，单独运行项目检查，并在实时工作台中 **Re-analyze**，或以相同输出目录再次运行 `prepare`。保留紧邻的上一次捕获；再次运行分析会轮换这对捕获。
3. 在 **Verify a previous task** 下选择任务 JSON，预览分析观察。要记录项目检查，请下载检查模板，输入简短检查名称及其状态（`passed`、`failed`、`skipped` 或 `not-run`），再加载并重新预览。**Download verification JSON** 导出合并回执。准备好的 HTML 可离线工作；这些文件在浏览器中读取，绝不会发送到本地服务。

回执区分观察到的发现结果变化与用户报告的检查。它不运行测试、不验证测试执行，也不证明修复。新增发现结果按捕获范围计数，不归因于该任务。在适用情况下，受限比较、证据缺失和未变化的导入报告会标为无法得出结论。重新分析前，使用原始工具和设置刷新外部报告；仅字节不同仍不能证明工具针对捕获源码运行过。不要把命令、日志或秘密放进检查名称。

要以无界面方式执行相同流程，将 `verify-change` 指向 `prepare` 或 `serve` 的 `analysis/` 目录。它读取旁边的 `analysis.previous/` 捕获。在包目录下的示例：

```sh
node bin/archify.mjs code-analysis verify-change out/project-analysis/analysis --task task.json --checks-template > checks.json
# 编辑 checks.json，记录实际运行的检查及其结果。
node bin/archify.mjs code-analysis verify-change out/project-analysis/analysis --task task.json --checks checks.json > verification.json
```

省略 `--checks` 则只记录分析观察。使用原始任务 JSON：其 ID 必须匹配所选发现结果。退出码 0 表示回执已生成（即使项目检查失败或比较无法得出结论）；退出码 2 在 stdout 返回 JSON 错误，带有 `status: "error"` 与 `diagnostics`，而不是回执。`task --verify` 仍是独立的当前源码证据检查。

<a id="review-architecture-drift-between-two-commits"></a>
## 审阅两个提交之间的架构漂移

代码变更可能使现有 Architecture 图失效时，使用 `drift`。它在**相同**的已编写 IR 和组件映射下，比较观察到的有向组件对。与 `check --ir` 不同，它会说明哪些关系之前已观察到，哪些是在所选 head 中新观察到的。

```sh
node bin/archify.mjs code-analysis drift /path/to/local/repo \
  --base BASE_FULL_SHA --head HEAD_FULL_SHA --ir architecture.json \
  --map overlay-map.json --out /path/to/new-review-directory --json
```

使用两个完整的本地 Git 提交 SHA，并在源码仓库之外选择一个新的输出目录（其父目录需已存在）。`--map` 可选，使用与 `check --ir` 相同的组件到模块映射。`--config` 为两个固定版本提供同一份 Code Analysis 配置。用 `--locale en` 或 `--locale zh-CN` 选择审阅语言。带有仓库证据的已编写 IR 必须固定到任一被比较提交，并通过普通 Architecture 交付检查。

离线打开 `architecture-drift.html`，选择 **Architecture drift**。选择一条关系，在图中查看方向，并在侧面板查看证据。源码按钮打开捕获的导入行，并标识精确提交；面板绝不读取当前工作树。**Download .md** 保存所选关系、两个固定版本、源码路径与行号，以及覆盖限制，不复制源码文本。`architecture-drift.json` 包含页面所用的同一份比较。`--json` 还会将其打印到 stdout。退出码 0 表示比较已生成，即使报告存在未声明关系或无法得出结论的证据也如此。错误以退出码 2 和结构化诊断返回。现有 `check` 门禁和普通渲染输出保持不变。

对于新观察到的未声明关系，下载其 Markdown 和 **Download verification task .json**。将原始报告 JSON 与任务一起保存。预期变更提交之后，再次运行 `drift`，使用第一份报告的 head 作为新的 base，并使用相同 IR、映射和配置。传入 `--from-report original/architecture-drift.json`，对照该报告检查起始提交、IR、映射和配置。这也允许复用固定到原始 base 修订版的 IR。

```sh
node bin/archify.mjs code-analysis verify-drift original/architecture-drift.json \
  --task DRIFT-<id>.json --after follow-up/architecture-drift.json
```

验证回执针对该组件对报告 `not-observed-at-head`、`still-observed` 或 `inconclusive`。如果起始观察无法复现，或相关源码无法解析，结果就是无法得出结论。任务绑定到原始报告字节。请原样保存这些字节，不要重新格式化。验证器接受的每份已保存漂移报告最大为 32 MiB。添加 `--checks-template` 生成模板，然后通过 `--checks <checks.json>` 传入填写完成的模板，记录项目检查。命令只按报告内容记录这些结果，不运行或验证检查。

初版覆盖已解析、位于模块作用域的静态 JS/TS 导入、导出与 require，不包含纯类型、条件和延迟引用。它只使用已提交文件，不检出引用、不运行项目脚本、不加载捕获范围外的本地依赖配置，也不获取缺失对象。符号链接和子模块被省略并予以披露。链接变化、归属冲突、组件覆盖缺失、受影响的解析错误，或解析输入变化，都可能使关系无法得出结论。在现有组件对上出现新的导入点，仍属于已有关系。未映射和未解析源码不在报告范围内；即使报告没有新增关系，也不能证明全覆盖对齐或运行时行为。

<a id="first-look-at-an-unfamiliar-repository"></a>
## 初次查看陌生仓库

无需图即可运行 `check`（或传入 `--ir architecture.json [--map overlay-map.json]`，在无界面检查的同时验证图到代码的组件映射及未声明组件级导入），并将产物写入目录：

```sh
node bin/archify.mjs code-analysis check /path/to/repo --language ts --out out/first-look --json
```

只有一个合格选项时，Archify 自动选择适配器。在混合树中，领先适配器必须覆盖合格适配器所匹配文件的至少 90%。Go 或 Rust 还分别要求分析根目录中存在普通文件 `go.mod` 或 `Cargo.toml`。即使 C 或 C++ 占多数，也仍需显式选择，因为源码数量无法判断哪些文件具有唯一编译命令。[Java 检测规则](JAVA.md) 仍然适用；两者都匹配时，C++ 适配器也覆盖 C。

Archify 需要用户选择时，`extract/adapter-ambiguous` 会报告源码数量及对应 `--language` 参数。显式 `--language` 优先。每次运行都在 `coverage.otherLanguages` 中报告其他语言及其文件数。

从 JSON 回执开始，而不是从完整发现结果列表开始：

- `investigation.leads` 重复三个已排序 `priorities`，包含 `message`、`where`（`path:line`）、`symbol`、`impact` 和可运行的 `task` 命令。文本输出在 **Start here** 下打印相同列表。
- `investigation.architecture` 提供确定性的模块图定位（`modules`、`edges`、`hotspots`、`strongestEdges`），以及最多五个不在 `leads` 中的未关闭 `structuralSignals`（`coupling/*` 与 `architecture/*`）。每个信号都有自己的可运行 `task` 命令，使函数复杂度警告不会掩盖架构信号。已连接热点先按 `loc * (1 + log2(1 + fanIn))` 排序，再按 fan-in、fan-out 和 ID 排序。各项包含 `readingWeight`，`hotspotRanking` 说明排序规则。它平衡规模与传入依赖；这只是阅读顺序，不是推断的业务重要性，也不是重构理由。
- `investigation.shell` 标识命令语法：Windows 为 `cmd.exe`，其他平台为 `POSIX sh`。请将命令复制到对应 shell。空格与单引号会被保留；包含 `%` 或 `!` 的 Windows 路径使用 Node argv 启动器，避免环境变量展开。`drillDown` 模板给 `<id>` 加引号；请替换为发现结果 ID。
- `diagram`（提供 `--ir` 时）报告 `mappedComponents`、`emptyComponents`、`unmappedModules`、`ambiguousModules`、`offDiagramFindings` 和 `undeclaredEdges`（可唯一归属、但不存在于 `ir.connections` 中的跨组件代码导入）。目录 `sources` 使用已捕获文件归属，包括 Go 包路径、Rust crate 和已配置分组；`.` 选择分析根目录。更具体的目录对其文件优先。文件锚点或显式 `--map` 将整个折叠模块关联到组件。多个组件认领同一模块时，其导入归属仍未解析，并在 `ambiguousModules` 中列出。这些导入保留模块级证据，但不计入 `undeclaredEdges`。判断对齐情况之前，请同时检查未映射和有歧义模块。没有 `--ir` 时，`counts.offDiagram` 为 `null`。

`components[].sources` 是包含一到三个对象的数组，例如 `[{"path":"src/cli"}]`；字符串数组会触发模式错误，并提供修复诊断。`check --ir` 校验这一共享形状，同时允许架构 IR 的其他部分不完整。完整 `start`/`deliver` 还要求 IR 可渲染；存在 sources 时，要求固定的 `meta.repository` 及匹配的 Git 检出目录。目录引用会验证固定修订版中的该树，并链接到目录；它没有 `line`/`end_line`，也不能证明已检查后代内容。前导 `./` 和一个末尾 `/` 会规范化；`.` 在固定证据中表示仓库根目录。映射使用相对于分析根目录的路径（或带该根目录前缀的仓库相对路径）；固定源码总是使用相对于 Git 顶层的路径。断言需要源码级证据时，应使用带行号的具体文件。
- `ruleCounts` 显示发现结果按规则的分布，因此无需读完每项结果，就能看到哪条规则占主导。
- `coverage` 列出解析失败和遗漏的语言。存在解析失败或角色排除时，`analyzedFiles` 统计图和规则范围内成功解析的文件。顶层 `files` 计数可能包含提取器为源码导航或部分事实而保留的失败文件。角色排除还会报告 `excludedByRole` 和 `excludedRoleCounts`。覆盖范围不改变发现结果门禁。

对保留的每条线索，运行其 `task` 命令（或 `archify code-analysis task out/first-look --finding <id> --root /path/to/repo --format json`），获取源码摘录、事实、建议、验收要求和证据摘要。修改代码之前先阅读引用源码。发现结果是静态证据，不是已证明的缺陷：复杂度警告说明函数更难阅读和测试，并不意味着必须拆分；耦合信号也可能是有意设计。如果分支或依赖本就是问题固有的，请记录这一点并保持代码不变。

<a id="architecture-boundaries"></a>
## 架构边界

要检查各层是否只依赖允许的内容，请通过 `--config analysis.config.json` 传入配置文件：

```json
{
  "boundaries": {
    "layers": {
      "domain": ["src/domain/**"],
      "ui": ["src/ui/**", "src/components/**"],
      "shared": ["src/shared/**"]
    },
    "rules": [
      { "from": "domain", "disallow": ["ui"], "reason": "domain logic stays UI-free" },
      { "from": "shared", "allow": [] }
    ]
  }
}
```

每条规则指定一个 `from` 层，并使用 `disallow`（禁止导入的层）或 `allow`（唯一允许导入的其他层；`[]` 表示一个也不允许）。匹配多个层的文件归属到最先列出的层。涉及不属于任何层的文件、测试文件或生成文件的导入不检查。每条违反规则的导入都会列为证据，按层对合并为一条发现结果。

边界只来自这份配置。架构图不用作规则：图中缺少箭头并不禁止依赖。没有 `boundaries` 时，概览将架构边界列为未检查。覆盖范围显示每层匹配的文件数；没有匹配文件的层通常意味着 glob 拼写错误。无效 `boundaries` 块会以 `config/boundaries-invalid` 停止分析。

<a id="entry-points"></a>
## 入口点

当其他模块绕过单一入口而直接导入某模块内部文件时，`coupling/internal-leak` 会报告。每个这样的模块形成一条发现结果，列出所有访问内部的导入、触达文件以及导入它们的模块。

模块入口文件按以下顺序确定：

1. 声明约定时，采用配置中匹配 `rules.coupling.internalLeak.entries` 的文件；
2. 否则采用模块目录直属的 `index.*`（JS/TS）或 `__init__.py`（Python）。

```json
{ "rules": { "coupling": { "internalLeak": { "entries": ["src/*/index.ts", "src/*/api.ts"], "minFiles": 3 } } } }
```

严重性取决于对约定的已知程度：

- **warning**：已声明入口文件，但导入绕过了它们；
- **info**：存在 `index.*` 或 `__init__.py`，但导入绕过它；或者模块没有入口文件，其他模块触达其至少 `minFiles`（默认 3）个文件。深层导入在 ES 模块和 Python 包中是一种常见且有意的风格，因此没有声明约定时，它是信号，不是缺陷。

模块内导入、测试与生成文件，以及 `vendor/` 或 `third_party/` 目录下的模块都不检查。Java 不检查：包的公共类就是其接口。如果深层导入正是你的约定，可将 `"coupling/internal-leak"` 加入 `ignore`。无效选项会以 `config/internal-leak-invalid` 停止分析。

在 Atlas 中聚焦任何模块时，无论规则是否触发，都会标记其他模块导入的文件；参见 [Atlas 视图](#atlas-view)。

<a id="function-complexity"></a>
## 函数复杂度

每个 Python 和 JS/TS 函数都以相同方式度量。**圈复杂度**为 1，再加上每个决策点各 1：

Java 方法与构造函数使用相同阈值；Java 特有的决策点和命名见 [Java 复杂度](JAVA.md#complexity)。

| | Python | JS/TS |
| --- | --- | --- |
| 条件 | `if`/`elif` | `if`/`else if` |
| 循环 | `for`/`while` | `for`/`for…in`/`for…of`/`while`/`do` |
| 错误处理 | `except` | `catch` |
| 条件表达式 | `x if c else y` | `c ? x : y` |
| 分支 | 非 default 的 `case` | 非 default 的 `case` |
| 布尔运算符 | 每个额外的 `and`/`or` 操作数 | 每个 `&&`、`||`、`??`（以及 `&&=`、`||=`、`??=`） |
| 推导式 | 每个 `for`/`if` 子句 | — |

可选链（`?.`）不计数。**嵌套深度**是最深的块堆叠层数；`elif`/`else if` 保持其 `if` 的深度。

嵌套具名函数分别度量：
- Python 中：方法和嵌套 `def`；
- JS/TS 中：方法、构造函数、访问器，以及赋值给名称的箭头或函数表达式。

lambda 与匿名回调计入包含它们的函数。模块级回调没有这样的外围函数，因此独立度量，以接收该回调的调用及其第一个字面量参数命名，例如 `<callback of server.on("request")>`。跳过测试、生成和 vendored 文件：`roles.generated` 默认包含 `vendor/`、`vendored/`、`third_party/` 和 `third-party/`，因为其中的打包内容不属于第一方源码。可在配置中覆盖 `roles.generated`，以度量这些目录并将它们保留在模块图中。

函数复杂度达到 15 或嵌套达到 5 时报告为 info，复杂度达到 25 或嵌套达到 6 时报告为 warning。函数长度只作为上下文展示，绝不单独报告。数值较高是一项维护信号，不是缺陷。问题页面链接到函数首行和最深嵌套块。

要修改阈值，可在 `--config` 文件中设置任意一项；未设置值保留默认值：

```json
{ "rules": { "complexity": { "function": { "info": { "complexity": 12 }, "warning": { "complexity": 30, "nesting": 7 } } } } }
```

<a id="severity-levels"></a>
## 严重性级别

颜色表示发现结果属于哪类问题，而不是由哪条规则报告。

| 颜色 | 级别 | 含义 | 应对方式 |
| --- | --- | --- | --- |
| 红色 | `error` | 结构性问题：循环依赖。涉及部分无法独立理解、测试或修改，循环通常还会扩大。 | 修复。可以在基线中接受它，使 CI 不被阻断，但页面上仍保持红色。 |
| 黄色 | `warning` | 代码可以运行，但维护困难：重复代码（启用 C6 时）、枢纽或集中模块、超大文件、非常复杂的函数、越过边界。 | 审阅。修复，或说明原因后接受。 |
| 蓝色 | `info` | 值得阅读的信号。 | 无强制要求；不影响判定或 CI。 |

红色表示“应修复的结构”，而不是“已证明会在运行时失败”。导入循环展示静态结构和潜在加载顺序风险；消息保持这样的措辞。

循环分级如下：

| 发现结果 | 级别 |
| --- | --- |
| `coupling/import-cycle`：在模块作用域彼此导入的文件 | error |
| `coupling/import-cycle`：只有通过延迟或条件导入才闭合的循环 | warning |
| Java 的 `coupling/cycle`：彼此依赖的包 | error |
| Java 的 `coupling/import-cycle`：彼此引用的类 | warning：类按需加载，因此不存在加载顺序风险，类间相互引用也很常见 |
| `coupling/cycle`：通过模块作用域导入彼此依赖的模块 | error |
| `coupling/cycle`：仅通过延迟、条件或纯类型边才闭合的分量 | warning |
| Rust 文件与模块循环 | info：同一 crate 的文件一起编译，相互 `use` 很常见 |

**升级说明。** 规则版本 2 之前，文件循环为 warning，模块和 Java 循环为 info。`check` 默认因 warning 失败，因此只有模块级或 Java 循环的项目以前会通过，现在会失败。`check` 在未使用 `--baseline` 时失败，其回执会包含适用于该项目的精确命令（含语言和配置）。要采用新级别，同时避免已有循环阻断 CI，可记录一次并提交该文件：

```sh
node bin/archify.mjs code-analysis check "/path/to/project" --baseline analysis-baseline.json --update-baseline --reason "existing cycle, tracked in <issue>"
```

与变更前运行的比较会标为不可比（规则版本不同），因此级别变化不会被误读为新增或已修复的问题。

在 `coupling/import-cycle` 规则版本 3 中，Java 类循环从 error 改回 warning。它们仍会在默认 `--fail-on warning` 下使 `check` 失败，但接受后不再保持红色；Java 包循环（`coupling/cycle`）仍为 error。

<a id="concentration"></a>
## 集中度

`coupling/concentration` 报告项目中有过多内容集中于一处，或依赖同一处的位置。它报告数值，不判定某部分必须拆分。

| 原因 | 报告条件 | 默认值 |
| --- | --- | --- |
| reach | 其他模块中有一定比例直接或经其他模块依赖某模块 | `reachShare: 0.5` |
| size | 某模块拥有一定比例的已分析源码行 | `sizeShare: 0.4` |
| file | 某源码文件达到指定行数 | `fileLines: 1500` |

reach 与 size 将一个模块和其余模块比较，因此只有项目至少有 `minModules` 个模块（默认 6）时才检查。reach 统计各种静态依赖，包括延迟和纯类型导入；它不表示运行时影响。不度量测试和生成文件。

发现结果为 warning，但有一个例外：不依赖任何其他模块的模块，如果只有 reach 高，则为 info。它属于共享内核，正是循环规则建议将共享代码移入的位置。reach 高且自身存在依赖的模块，会把这些依赖的变化传递给项目大部分区域，因此仍为 warning。

```json
{ "rules": { "coupling": { "concentration": { "reachShare": 0.6, "fileLines": 2000 } } } }
```

如果这种集中是有意设计，请以此为原因接受发现结果。模块或文件源码变化时，已接受的结果会再次显示。

<a id="duplicate-code-c6-optional"></a>
## 重复代码（C6，可选）

六种源码语言都可以使用 **jscpd 5.4.3** 将 token 重复报告为 `redundancy/duplicate-block` 警告。先根据 [jscpd 分发说明](https://github.com/kucherenko/jscpd/blob/b82d84186389590fed0813d005391f3b8147dcfa/README.md#quick-start) 单独安装原生可执行程序，再在现有分析配置中启用：

```json
{
  "duplicates": {
    "enabled": true,
    "executable": "/absolute/path/to/jscpd",
    "minTokens": 50,
    "minLines": 5,
    "identifiers": "exact",
    "timeoutMs": 30000,
    "maxFileBytes": 1000000
  }
}
```

在 `archify/` 包目录下运行：

```sh
node bin/archify.mjs code-analysis check /path/to/project --language ts --config analysis.config.json --out out/analysis --json
```

对 `--language py`、`java`、`go` 或 `rust` 使用相同 `duplicates` 配置。每次调用检查所选适配器捕获的源码范围；不会合并混合仓库中的所有语言，也不会扩大 Go/Rust 构建或 profile 覆盖。

C6 比较这些选中文件的原始文本。在 Rust 中，未激活 `cfg` 区域或不透明宏内的文本仍可能匹配。重复检测覆盖说明扫描了哪些文件；它不能证明运行时可达性，也不表示覆盖了每个构建 profile。

以上是 `enabled` 为 true 时的默认值。`executable` 默认为 PATH 上的 `jscpd`；包含目录分隔符的相对路径从调用方工作目录解析。在 Windows 上应选择原生 `.exe`，而非 npm 的 `.cmd` 启动器。分析运行不会下载或安装检测器。配置块不存在、`enabled` 为 false，或 `ignore` 包含 `redundancy/duplicate-block` 时，不会探测或运行该可选程序。上述所选语言的提取前置要求仍然适用。C6 在这些要求之上增加 jscpd 可执行程序，不替代语言适配器。

模式为 `weak`：忽略空白和注释，但标识符与字面量仍有意义。将 `identifiers` 设为 `consistent`，还可考虑一致性重命名；这是不同匹配策略，不是更准确的默认值。Python 文档字符串和 TypeScript 声明仍可能形成重复 token。决定修改代码前，应先审阅其用途。这些阈值曾对真实源码进行抽样检查，但不是通用维护阈值。

检测器扫描已捕获源码的临时 UTF-8 副本，遵循所选语言和模块文件角色。测试与生成角色遵循 `modules.excludeRoles`；常见的 `vendor`、`vendored`、`third_party` 和 `third-party` 目录被省略。解析失败、不支持的格式，以及超过 `maxFileBytes` 的文件，也会记录为省略项。调用结束后移除临时树；不会执行目标项目代码。

`findings.json` 在 `analysis.duplicates` 下记录引擎与版本、实际生效设置，以及所选、已分析和省略路径；`check --json` 在 `duplicates` 下包含相同数据。原生报告也会省略低于其 token 或行数阈值的文件；如果报告未说明单独原因，则保留为 `not-reported-by-engine`。即使发现结果为零，不完整或空扫描仍保持可见：CLI 摘要发出警告，`overview.json` 记录 `coverage.duplicates`（已分析、所选、省略数量，以及 `complete`），页面将 Coverage 标为不完整，显示 `Duplicate code: x/y files analyzed · incomplete`。涉及不完整覆盖、扫描范围变化、设置或引擎变化的比较会标为不可直接比较。工具缺失、版本错误、超时和无效报告会使分析以退出码 2 失败；即使使用 `--fail-on never`，也不会变成无问题结果。

每条发现结果保留一个**原生配对**及两个位置，包括同一文件内的重复。它不会推断更大组中的所有配对。坐标从 jscpd 的 UTF-8 字节偏移转换为 UTF-16 源码偏移与从 1 开始的列号。ID 区分内容、文件、外围符号和重复出现次数；前方新增行或无关发现结果不会改变它们，但修改克隆内容或相同出现项的数量可能产生新 ID。

现有 `task` 命令导出两侧内容及各自允许的文件。证据哈希覆盖完整引用行，包括部分行匹配旁的上下文。两侧独立检查；唯一且未变化的范围可以移动，而有歧义的移动或相同副本数量变化会使旧证据失效。原有的行级证据格式仍受支持。页面中的 **Duplicate code** 显示两个文件路径及完整的短匹配范围。主题配色高亮与下划线遵循记录列号；部分行匹配旁的文本保持未标记。标记表示检测器的 token 范围，在 `weak` 模式下其中空白或注释可以不同。长范围显示有界的开头与末尾摘录，并明确注明省略数量。打开任一文件可查看完整源码；展开全文并返回发现结果后，精确标记仍然保留。不含列号的旧结果会显示提示，并保持源码未标记。两个位置在现有读取器中上下堆叠。

<a id="accepting-known-findings-baseline"></a>
## 接受已知发现结果（基线）

真实项目中，会有团队已知并决定暂时保留的发现结果。基线文件记录它们，使概览和 CI 聚焦新增问题：

```sh
node bin/archify.mjs code-analysis check "/path/to/project" --baseline analysis-baseline.json --update-baseline --reason "existing debt when analysis was adopted"
```

这会将所有当前发现结果连同该原因写入 `analysis-baseline.json`。如有需要，可逐条编辑原因，并提交该文件。通过 `--baseline analysis-baseline.json`（`npm start -- … --baseline …`）将它传给页面，或传给 `check`。

- 已接受发现结果仍在列表中，标为 **accepted** 并显示原因，但不再计入判定、优先项、图颜色或 CI 失败。
- 已接受的 **error** 是颜色上的例外：它不再使 CI 失败，也不计入优先项，但其组件仍为红色，并标为 **accepted · still to fix**。基线记录的是暂缓决定，不是修复。
- 每条记录记住其所涉及代码的指纹。如果代码变化，发现结果会以 **accepted · evidence changed** 再次显示，让人重新检查。
- 对应发现结果不再出现的条目列为不再发现：问题可能已修复或移动，可以移除该条目。再次运行 `--update-baseline` 会保留已有原因、加入新发现结果，并删除这些条目。

<a id="terminal-and-ci-code-analysis-check"></a>
## 终端与 CI：`code-analysis check`

`check` 无需图即可运行相同分析，并返回流水线可使用的状态码：

```sh
node bin/archify.mjs code-analysis check "/path/to/project" --baseline analysis-baseline.json --fail-on warning --out .analysis
```

| 选项 | 含义 |
| --- | --- |
| `--fail-on error\|warning\|info\|never` | 未关闭发现结果达到该级别时失败（默认 `warning`）。 |
| `--baseline file` | 已接受发现结果不会使运行失败，除非其代码变化。 |
| `--out dir` | 写入 `raw-facts`、`module-graph`、`findings`、`review` 和 `overview` JSON。自动与该目录中上一份 `findings.json` 比较。 |
| `--compare findings.json` | 改为与指定的较早运行比较。 |
| `--new-only` | 仅因相对于比较对象新增的发现结果失败，适合拉取请求门禁。没有上次运行可比较时，每条未关闭结果都视为新增，因此缺失比较产物不能通过门禁。 |
| `--update-baseline [--reason text]` | 写入基线，而不执行门禁检查。 |
| `--json` | 打印机器可读回执，代替摘要。 |

退出码：`0` 通过，`1` 门禁失败，`2` 分析无法运行（诊断说明原因）。未使用 `--baseline` 的失败运行会提供将当前发现结果记录到 `analysis-baseline.json` 的命令，适用于首次运行或规则变严之后。如果基线或深入查看命令包含控制字符，摘要会指向 `--json` 回执中 `gate.adopt` 或 `investigation.drillDown` 下的精确命令。打印摘要以 `path:line` 和 ID 列出导致失败的发现结果、比较计数，以及过时基线条目。

<a id="config-files"></a>
## 配置文件

`--config file.json` 合并到默认配置（`config/defaults.json`）：

- 对象在每个深度逐键合并，因此只设置一个阈值或文件角色的配置仍保留其他所有默认值；
- 数组整体替换默认列表——包括 `include`、`exclude`、`ignore` 和每个角色的 glob。要添加排除项，请复制默认 `exclude` 列表，再追加；
- 其他值替换默认值。

使用 `"ignore": ["rule/code"]` 抑制规则。可选重复检测必须先通过 `duplicates.enabled` 启用；缺少输入或配置，也会让架构边界等规则保持未检查。配置不是 JSON 对象时，会以 `cli/config-invalid` 停止分析。

<a id="atlas-view"></a>
## Atlas 视图

Classic 视图对照架构图读取结果，并打开源码证据。Atlas 绘制被分析树本身，使问题形态一目了然：

- 每个**模块**是圆周上的一段弧；较粗的弧表示被报告的枢纽；
- 每个**文件**是所属模块弧内的一条刻度；
- 两个已分析文件之间的每条**依赖**是一条曲线，按导入方模块着色，并穿过两个模块汇束，因此强耦合呈现为较粗的线束；
- 每个已测量**函数**是文件外侧的一根尖刺，圈复杂度越高越长；被报告的函数带有对应严重性颜色的圆点。

悬停查看名称和数值。点击模块弧（或侧面板中的模块）进行聚焦：它自身的依赖保持彩色，其他模块对它的依赖用中性色绘制，其余淡出。圆周内侧的标记显示其被其他模块导入的各个文件（导入模块越多，标记越长），侧面板说明其多少文件被外部导入、由多少模块导入：这就是代码实际使用的模块公开表面。点击带圆点的尖刺或侧面板中的发现结果，将该结果绘制在其他内容之上：循环路径、模块循环涉及的模块、边界跨越导入、访问模块内部的导入（其弧变粗，入口文件若存在则被圈出），或函数及其文件依赖。**Open evidence in Classic view** 显示同一发现结果及其源码摘录和 AI 任务。

动态效果仅用于表达变化：Atlas 打开时图像从中心展开，新焦点或发现结果交叉淡入，光点沿所选导入循环按导入方向移动。系统启用减少动态效果时，所有内容一次绘制并保持静止。

Atlas 不增加分析：它绘制同一次运行的原始事实、模块图和发现结果。无法解析的依赖记录不绘制曲线；侧面板说明数量，因此缺少曲线不能证明不存在依赖。与模块图一样，测试和生成文件被省略。Atlas 需要该运行的原始事实，没有它们就不提供 Atlas。

选择模块会重新分配圆内角度空间：选中扇区扩大，周围扇区缩小并绕其移动。半径保持固定，扇区彼此分离。滚轮调整这一分布。再次点击选中弧、点击空白、使用 **Clear selection** 或按 **Esc** 可返回概览。**Disable sector zoom** 保留当前选择和依赖高亮。函数尖端与主体使用相同变换后的位置处理点击；发现结果复用现有源码选择和 Classic 证据视图。跨模块发现结果返回概览。

<a id="comparing-runs"></a>
## 比较运行结果

每个 `findings.json` 都记录结果除代码之外依赖的因素：分析器版本、提取器（其解析器或运行时版本及自身逻辑修订版）、实际生效配置的摘要、已运行规则、被排除文件角色，以及解析失败的文件。Go 运行还记录 `analysis.goBuildScope`：实际生效的 GOOS/GOARCH、显式/release/tool tags、测试和 cgo 选择，包括环境与宿主默认值。比较（Re-analyze，或 `check --compare`/`--out`）列出新增、**不再检测到**及证据变化的发现结果，并补充：

- `comparable`：两次运行采用相同度量方式时为 `true`；配置、规则、分析器版本、提取器、Go 构建范围、范围或解析错误发生变化时为 `false` 并附 `reasons`；缺少必需上下文时为 `null`，包括没有构建范围的历史 Go 结果，除非另一个已知差异足以确定不可比；
- 对每条不再检测到的发现结果，如果能看到可能原因，则给出 `likelyCause`：`rule-not-run`、`files-missing`（删除、重命名或排除）、`parse-error`，或带有覆盖相同文件的新发现结果 ID 的 `possibly-renamed`。

只有在可比运行中不再检测到该发现结果，并且项目检查通过，才支持声称问题已修复。`review.json` 为现有读取器保留 `fixed`，作为 `notDetected` 的别名。

<a id="ai-optimization-tasks-code-analysis-task"></a>
## AI 优化任务：`code-analysis task`

任务是给编程代理的简报，由已完成运行中的一条发现结果（或几条相关结果）构建。它包含发现事实、带捕获摘录的引用代码位置、可能影响、建议方向（与事实分开）、需要修改和阅读的文件、必须保持不变的内容、完成条件、验证方式，以及仍待确认事项。绝不猜测业务约束和测试命令：除非主动传入，否则它们列为待确认。

```sh
# 使用 serve 写入的 analysis/ 目录，或 check 的 --out 目录：
node bin/archify.mjs code-analysis task .analysis --finding COMP-bcd966585099 --root "/path/to/project" > task.md
node bin/archify.mjs code-analysis task .analysis --finding COMP-bcd966585099 --root "/path/to/project" --command "pytest -q" --format json --out task.json
# 之后，在把导出的任务交给代理之前：
node bin/archify.mjs code-analysis task --verify task.json --root "/path/to/project" --require-valid
```

提供 `--root` 时，会将引用代码与当前工作树比较，并把任务证据标为 **valid**（未变化，可能移动）、**changed**、**missing**（文件删除或重命名）或 **unverifiable**。未提供时，任务为 **captured**：从分析快照构建，尚未检查。无论哪种情况，任务都要求代理在任何修改前阅读当前源码，并把摘录视为数据而非指令。证据不是 valid 时，`--require-valid` 以退出码 1 退出。页面通过本地服务器（`POST /task`）构建相同任务，因此复制文本与命令输出一致。

已记录摘要如果无法重新计算，即使所有展示引用都未变化，任务仍保持 **unverifiable**。为兼容保留或移除 UTF-8 BOM 的提取器，全文与函数摘要最多尝试 64 种文本组合，而不物化完整笛卡尔积；匹配即通过，搜索预算耗尽则为 **unverifiable**。没有摘要的历史任务仍可验证其捕获行。

没有行证据的模块级 `coupling/concentration` 任务使用 `moduleSummaries`，而不是空的逐文件引用块。每个摘要报告完整成员数量与行数占比，然后列出最多八个大文件、八个被外部导入的入口文件，以及八个路径与名称分组。这些分组描述源码路径，不推断业务职责。`scope.read` 列出有界阅读起点；修改模块前应检查的成员集合仍是发现结果完整的 `evidenceDigest.files`。验证仍检查该证据摘要中的每个文件，包括未出现在概要中的文件。不含该可选字段的历史任务仍可读取和验证。

契约为 `schemas/ai-task.schema.json`；每种发现类型与证据状态的示例位于 `test/fixtures/tasks/`。

<a id="investigate-a-source-question"></a>
### 调查源码问题

无需发现结果即可调查 JS/TS 函数或功能：

```sh
node bin/archify.mjs code-analysis task .analysis --question "How does this function validate its input?" --entry src/validate.mjs --function validate --root "/path/to/project" --format json --out question.json --json
```

入口可以是 `.js`、`.mjs`、`.cjs`、`.jsx`、`.ts`、`.mts`、`.cts` 或 `.tsx`；`.d.ts`、`.d.mts` 和 `.d.cts` 声明文件被拒绝，因为其中的调用体未被捕获。有现成分析目录时应使用它；省略目录会明确保留事实缺失。`--function` 可选，接受已捕获名称或限定名称。输出记录入口与源码身份、直接导入新鲜度、已捕获与已索引范围，以及所选源码范围内最多 40 个调用。请检查 `calls.coverage`、`total` 和 `omitted`：覆盖不可用时 total 为 null；捕获到零仅表示该范围内没有收集到 CallExpression。JSON 回执重复调用覆盖信息，使其在 `--json` 下仍然可见。

入口事实变化或不可用，以及入口解析错误，都返回退出码 1。可用入口返回退出码 0，即使调用覆盖不可用也如此；输出仍为 `orientation-only`。两种退出码都不表示语义问题已经回答。调用目标描述受支持的词法绑定，并有独立源码新鲜度检查，不表示运行时执行或完整影响。宿主 Agent 完成[函数分析流程](FUNCTION-ANALYSIS.md)，阅读当前源码并验证重要断言后再交付答案。发现结果导出与验证选项仍独立于问题模式。

<a id="investigate-a-changed-source-file"></a>
### 调查已变化的源码文件

使用当前提取器和同一份分析配置，捕获两个 JS/TS 根目录：

```sh
node bin/archify.mjs code-analysis task --question "Which source paths changed?" --base-root "/path/to/base" --root "/path/to/head" --entry src/validate.mjs --format json --out "/path/to/review/change.json" --json
```

必须提供 `--entry`。输出必须位于两个根目录之外。此模式接受未提交源码；读取文件时不执行目标应用。它比较文本与函数位置，记录词法调用引用，并单独保留模块导入引用。它不使用已有分析目录，也不接受 `--function`。可选 `--config` 将同一份分析配置应用于两侧；观察到的编译器或包差异会限制绑定归属判定。

回执报告每侧 `definitionCoverage` 及任何覆盖不完整原因。解析或新鲜度失败、不支持的声明入口，或不同解析设置，会产生 partial/退出码 1。各列表披露自身省略项；ready/退出码 0 表示定位信息可用，不表示完整影响或零省略。不生成保存的 raw-facts 目录。按[变更问题流程](FUNCTION-ANALYSIS.md#change-questions)，从源码和项目检查解释行为。此模式不提供自动入口选择、JSON 清单或语义差异分析。

<a id="from-the-analysis-page"></a>
### 从分析页面操作

打开优先发现结果或某组件的发现结果，阅读捕获的代码摘录，再点击 **Copy task for AI**。一次点击即可准备并复制完整简报，无需先打开预览。将它粘贴给正在处理该项目的编程 AI。**Task preview and download** 提供完整预览、**Copy AI task**、**Download .md** 和 **Check again**。本地服务可用时，复制和下载会先刷新任务。无法访问剪贴板时，会打开预览并选中文本，供手动复制。

解析器和模式包已打包在 `vendor/` 中，因此 `serve`、`check` 和 `task` 不会安装任何内容。运行任务本身不会连接 AI 接收者：当前 UI 报告的是复制或下载，不是发送或启动重构。

离线报告导出捕获快照，并标明未对照当前源码检查。变化、缺失和不可验证的证据会同时在预览与导出简报中明确提示；应要求编程 AI 在编辑前阅读当前文件。过期页面或被拒绝的服务器请求需要重试或重新分析。导出不会应用补丁，也不会执行项目检查。

关系和指标折叠在代码证据下方。源码链接打开九行上下文；**Show full file** 展开文件，同时保留函数范围高亮。**Hide analysis** 为画布释放空间；使用恢复控件重新打开读取器。未检查类别在概览中保持可见；无问题结果只覆盖实际运行的规则。

<a id="go-source-investigation"></a>
### Go 源码调查

在包含 `go.mod` 的根目录使用 `--language go`。需要已安装 Go 1.18+ 编译器。保存的问题和成对问题可沿已捕获的直接函数声明及已知调用方追踪；构建范围、测试纳入、排除文件和类型信息不完整等限制保持明确。命令、工具链成本和限制参见 [Go 支持](GO.md)。

<a id="rust-source-investigation"></a>
### Rust 源码调查

在 Cargo 工作区或包根目录使用 `--language rust`。需要 Cargo/rustc 1.71+ 和已锁定的辅助程序依赖。保存的问题与成对问题保留捕获的源码 profile、cfg/features、省略区域和有界调用模型；源码绑定不能证明编译成功或运行时分派。设置、profile 配置和限制参见 [Rust 支持](RUST.md)。

<a id="c-and-c-source-investigation"></a>
### C 与 C++ 源码调查

使用 `--language c` 或 `--language cpp`，并将 `config.cpp.compileCommands` 设为已有编译数据库。选择 C++ 也覆盖 C 翻译单元。活动 include、源码函数范围和保守的同单元直接调用都携带翻译单元上下文。保存的头文件问题要求 `--context <translation-unit>`；成对问题接受翻译单元源码入口。设置与限制参见 [C/C++ 支持](C_CPP.md)。
