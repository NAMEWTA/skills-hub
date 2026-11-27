<a id="external-diagnostics-c7"></a>

# 外部诊断（C7）

Code Analysis 可以导入现有 ESLint JSON、Ruff JSON、SARIF 2.1.0 和已保存的 GitHub review 评论。导入的 finding 保留原工具、规则、消息、严重性和位置，并使用现有任务、证据、基线和比较流水线。

本地查看器提供可搜索的 finding 列表、来源和覆盖详情、源码证据、AI 任务预览／导出，以及基线评审决策。CLI 与查看器读取同一组配置报告，并使用相同的证据和评审生命周期。

导入会读取报告；不会执行 ESLint、Ruff、项目脚本、建议修复或 AI reviewer。重新生成外部报告仍是独立的项目或 CI 步骤。

<a id="import-existing-reports"></a>

## 导入现有报告

在 `check` 或 `serve` 使用的同一份分析配置中添加来源：

```json
{
  "external": {
    "sources": [
      { "id": "web-eslint", "format": "eslint", "file": "reports/eslint.json" },
      { "id": "api-ruff", "format": "ruff", "file": "reports/ruff.json" }
    ]
  }
}
```

从 Archify 的 `archify/` 包目录运行：

```sh
node bin/archify.mjs code-analysis check /path/to/repo --language ts --config /path/to/repo/analysis.config.json --out /path/to/repo/.analysis --json
```

`--language` 选择内部源码／依赖提取器。其他语言的报告仍可产生外部 finding。引用的仓库文件若不属于该提取器已捕获的文件，会作为补充证据捕获；不会加入依赖图，也不会计为新增解析的语言源码。

每个来源具有稳定、唯一的 `id`。以较晚运行的报告替换它时，保持 id 不变。不同 workspace 或检查配置使用不同 id，即使两者都使用 ESLint。每次分析会替换该来源在本次运行中的 finding；再次导入同一报告不会追加另一份副本。

查看器的来源选项会在工具／版本旁显示此 id，因此来自不同 workspace 或 SARIF run 的报告即使工具名称一致，仍可区分。

| 来源选项 | 含义 |
|---|---|
| `id` | 必需的稳定来源身份；支持字母、数字、下划线、点、冒号和连字符。 |
| `format` | 必需：`eslint`、`ruff`、`sarif` 或 `github-review`。 |
| `file` | 必需的报告路径，相对所分析仓库根目录解析。 |
| `pathBase` | producer 报告相对路径时可选的基准目录，相对所分析根目录；默认为 `.`。 |
| `pathMappings` | 可选的显式 producer 根目录映射，例如 `[{"from":"C:/agent/repo","to":"."}]`。最长匹配根目录优先；绝不会仅按文件 basename 匹配。 |
| `tool` | 可选的显示名称覆盖。来源工具的原始规则标识符与 Archify 规则代码分开保存。 |
| `manifest` | 可选的生成时 manifest 对象，或相对所分析根目录的 JSON 文件路径。 |
| `author` | 对于 `github-review`，按 GitHub login 选择根 review 评论。其他作者的回复保留为讨论上下文。 |

例如，`pathBase: "packages/web"` 将原生报告中的 `src/index.ts` 映射为 `packages/web/src/index.ts`。manifest 的 `scope.files` 和 `files` 键始终使用仓库相对路径；`pathBase` 不应用于它们。本地根目录以外的绝对 CI 路径需要显式 `pathMappings` 条目。解析到根目录之外的源路径、符号链接逃逸和非文件 URL 不提供源码证据。

省略 `external.severity` 时采用默认 `"warning"` 策略：导入的 lint error 最高映射为 warning，warning 保持 warning，info 保持 info。来源值保留在 `external.originalSeverity` 中。AI review 评论始终为 warning。报告没有来源严重性时使用 warning，并记录这一默认处理；原始缺失值仍可见。外部 `confidence` 为未知（`null`），不是新的 Archify 质量评分。

显式设置 `external.severity: "source"` 可以保留归一化后的来源 error/warning/info 等级。source 模式下未关闭的 error 可能使组件变红，并导致 `--fail-on error` 失败；此模式不能确立已确认的结构或运行时缺陷。

CLI 默认阈值仍为 `--fail-on warning`。因此，将导入 error 限制为 warning 不会使默认检查通过。除此之外干净、只包含这些导入主张的运行，在默认策略下可以通过 `--fail-on error`；显式 `"source"` 可能使该阈值失败。内部 finding 保持现有严重性策略。

<a id="supported-report-formats"></a>

## 支持的报告格式

| 格式 | 输入和保留的事实 |
|---|---|
| `eslint` | 原生 JSON 结果数组，或包含 `results` 和 `metadata.rulesMeta` 的 `json-with-metadata`。保留插件规则 id、消息、严重性、位置、文档链接和可用的建议文本。工具／解析器诊断会将覆盖标为不完整。来源抑制的消息单独计数。 |
| `ruff` | 原生 JSON 数组，包括没有严重性的旧报告和带 `name`／severity 的当前报告。码点列转换为 UTF-16。语法错误会使覆盖不完整。Notebook 单元格坐标作为原生元数据保留；不会把它们展示为 `.ipynb` JSON 文件的行号。 |
| `sarif` | 使用内置官方 schema 验证的 SARIF 2.1.0 日志。每个 run 都有各自派生的来源身份。支持子集见下文。 |
| `github-review` | 已保存的 PR review-comments 数组或 `{ "comments": [...], "headCommit": "...", "author": "..." }`。根评论成为来源主张；讨论回复保留为上下文。收集和位置限制见下文。 |

如需生成报告，使用项目已经安装和配置的工具。典型命令如下：

```sh
mkdir -p reports
npx eslint . --format json --output-file reports/eslint.json
ruff check . --output-format json --output-file reports/ruff.json
ruff check . --output-format sarif --output-file reports/ruff.sarif
```

这些命令供项目或 CI 运行，不由 Archify 执行。lint 工具可能返回退出码 1，同时仍生成包含 finding 的有效报告。将 ESLint 导出为 SARIF 时，应使用与项目 ESLint 版本兼容的 SARIF formatter；Archify 不会向被分析项目安装 ESLint formatter。

<a id="sarif-support"></a>

### SARIF 支持

导入器读取多个 run、driver／extension 规则元数据、规则 id／索引和描述符引用、规则消息／模板、默认／结果等级、artifact 索引、文件 URI 基准、行／列位置、关联位置、源码文本／哈希断言和来源指纹。相对 URI 转义按 URI 数据解码；原生 JSON 文件名保留字面拼写。归一化之前，`columnKind` 决定列使用 Unicode 码点还是 UTF-16 代码单元。

SARIF 主位置与关联位置保留明确角色。只有关联位置的结果可以展示上下文，但不提供主路径／行或自动修改目标。扩展来源信息随规则保留，包括所提供的组件 name/guid/version；不同扩展中相同的局部规则名不会仅因消息一致而被视作同一诊断。

SARIF 适配器和身份修订均为 2。部分指纹与所有具名贡献者和来源锚点组合，用于区分重复出现的实例。完整指纹保留 producer 的身份断言。旧 SARIF id／基线不会自动迁移：应重新导入并评审，而不是把已接受实例转移到另一结果。其他格式修订仍为 1。

没有 GUID 的同名 SARIF 组件保留为独立但有歧义的实例。它们使覆盖为 partial；对它们的接受绑定到该份报告的特定字节，因此组件重排不能静默继承其他实例的决定。要获得可比较报告，应优先使用无歧义的 producer 组件身份。

已接受的来源抑制及 `pass`／`notApplicable` 结果不属于未关闭 finding。来源抑制不同于本地用户在基线中接受 finding。工具执行／配置通知会保留；失败调用或省略 `results` 不会变成一次成功的空扫描。

只有偏移量／二进制的位置和外部属性文件不会获得推断出的行证据。未解析路径、消息模板或不支持的位置数据会产生明确提示和不完整覆盖。复杂代码流、图和自动应用 `fixes` 不在首版导入视图范围内；报告哈希和项目 JSON Pointer 保留了返回原始数据的路径。

工具与 automation 身份相同的多个 run 不能只靠顺序可靠地区分。这类歧义会报告为覆盖不完整；优先使用单独的稳定配置来源或不同的 producer automation 身份。

<a id="bind-a-report-to-its-actual-source"></a>

## 将报告绑定到实际源码

导入时捕获的可读源码，不能证明旧报告分析的就是这些源码。单独的原生 JSON 报告通常无法确立完整扫描范围、有效配置，以及生成时与源码的关系。其 finding 仍可检查并导出为任务。

producer 可以提供带版本的 manifest，包含它在生成报告时实际记录的信息：

```json
{
  "schema_version": 1,
  "toolVersion": "<the actual tool version>",
  "configDigest": "<SHA-256 of the effective rule configuration>",
  "scope": { "files": ["src/index.ts"], "complete": true },
  "files": { "src/index.ts": "<SHA-256 of the source file's raw bytes>" },
  "command": "<the actual command that produced this report>",
  "exitCode": 1
}
```

尖括号值是占位符，不是有效摘要值。应提供小写的 64 字符 SHA-256 字符串。工具版本和配置未知时，也可省略或设为 `null`。只有 producer 知道完整选定范围且已成功检查该范围时，`scope.complete` 才能为 true。也要列出干净文件；存在 finding 的文件集合不是完整扫描范围。配置摘要应描述有效规则和相关 producer 设置，而不是报告字节或文件名。manifest 工具版本若与报告声明的版本矛盾，会被拒绝。

manifest 应从与报告相同的冻结源码／配置生成。事后从已编辑工作树创建源码哈希，不能确立报告的原始输入。仅 Git HEAD 匹配不能证明工作树干净。

manifest 原始字节哈希、SARIF artifact 哈希和内嵌源码文本会分别针对对应的字节／文本表示检查。这对 Python 编码和 BOM 很重要。保留的原始字节断言显示在 `analysis.external[].sourceHashes`；内嵌文本断言单独显示在 `analysis.external[].sourceTextHashes`。任务验证会重新检查扫描文件中的两类断言，范围超出 finding 自身引用的文件。

| 记录的状态 | 含义 |
|---|---|
| `binding: "verified"` | 可用报告断言与其标识的已捕获源码匹配。这不能独立证明工具结论或运行时行为。 |
| `binding: "unverified"` | 所需源码断言缺失或无法检查。捕获今天的文本不会提升此状态。 |
| `binding: "changed"` | 至少一个报告断言与已捕获源码不同。在依据旧主张行动之前生成新报告。 |
| `status: "partial"` | 部分扫描／导入数据不完整或不受支持。可用 finding 仍可见；缺少其他 finding 不能作为修复证据。 |
| `coverage.complete: null` | 完整且成功的覆盖情况未知。空诊断数组不能证明扫描干净。 |

有效空报告、已配置但缺失的报告，以及部分报告是不同情况。配置的文件缺失／格式错误会以结构化诊断失败，退出码为 2。导入器不会静默将它们替换为成功的空报告。

<a id="read-and-review-in-the-viewer"></a>

## 在查看器中阅读和评审

使用相同分析配置和编写好的架构输入启动本地查看器：

```sh
node bin/archify.mjs code-analysis serve /path/to/repo --language ts --ir /path/to/architecture.json --config /path/to/repo/analysis.config.json --baseline /path/to/repo/analysis.baseline.json --out /path/to/view
```

打开本地 URL 并点击 **Code Analysis**。**Filter** 和 **External diagnostics** 打开 finding 列表。可按来源、类别、严重性或评审状态过滤，按规则、消息或文件搜索。未验证报告过滤器包含 unverified 和 changed 的来源绑定。**Sources & coverage** 分开展示成功导入、报告绑定和声明的扫描完整性，包括有效空报告。

打开 finding 可阅读其原始规则／消息、主及关联源码摘录、位置和来源。任务预览／导出使用这些捕获证据；实时服务会在返回任务之前将其与当前源码核对。导入 finding 可以在组件图和 Atlas 上高亮其已有的文件所有者。补充证据不会创建新的依赖节点或边。

**Accept…** 要求提供原因。**Revoke acceptance** 移除本地基线决定。保存会从相同捕获事实和扫描范围重新构建页面；不会重新运行提取、重复检测或外部工具。过期页面或已变更源码不能静默接受另一个主张。已接受的外部 finding 保留配置严重性和原始严重性以供检查。默认映射的 warning 接受后不再为图着色；显式 source 模式 error 遵循现有的已接受 error 规则，保留红色指示。如果基线保存后视图文件发布失败，查看器会确认决定已保存并报告文件警告，同时保留已更新的实时页面。

重新生成报告或更改源码／配置后，使用 **Re-analyze** 开始新的分析和比较。重新分析失败时保留上一次成功结果。通过上面的配置文件添加或更改导入报告来源；查看器读取这些文件，不运行外部工具。

独立 `repo.analysis.html` 支持阅读／过滤和捕获任务导出。保存评审决定、检查当前源码和重新分析需要本地服务；静态报告不含该服务的授权令牌。

<a id="evidence-and-ai-tasks"></a>

## 证据和 AI 任务

对已完成的分析目录运行 `task`：

```sh
node bin/archify.mjs code-analysis task /path/to/repo/.analysis --finding CONV-012345abcdef --root /path/to/repo --format json --out /path/to/repo/task.json
```

将示例 id 替换为该次运行 `findings.json` 中的一个 id。默认任务格式为 Markdown。`--require-valid` 可要求验证成功后才返回可行动任务。

外部 finding 携带工具、原始规则／等级、来源 id、报告项引用、位置、原始 review 元数据及报告与源码的绑定。所选语言适配器之外的捕获文本位于 `findings.externalEvidence`。任务生成验证其哈希，并将其与原始源码快照结合；不会读取任意当前文件并将其标记为旧证据。

关联摘录保留在任务读取范围内，而自动修改范围要求主证据。实时任务请求还要匹配页面显示的主张；即使源码快照相同，消息／规则上下文改变也要求刷新页面后再导出。静态和 CLI 任务导出保留捕获证据与当前证据的区别。

稳定 finding 身份与证据新鲜度分开处理。来源指纹或带版本的源码上下文回退方式，有助于在行移动后匹配 finding。精确位置哈希标识摘录；finding 的仅源码 `evidenceDigest` 覆盖引用的完整文件，因为 lint 规则可能依赖同文件其他行。因此，即使高亮行未变，代码变化仍可能要求重新评审。

任务验证将捕获源码结果保留为 `sourceStatus`，将报告关系保留为 `reportBinding`。当前代码未变不能使未验证报告变为有效。保留的 `sourceHashes` 或 `sourceTextHashes` 中任何已扫描文件发生变化，都会使报告绑定失效，包括引用位置之外的已扫描文件。缺失或有歧义的源码证据始终明确呈现。

只有来源 manifest 或显式任务参数提供了生成命令时，才将其纳入任务。它们是需要评估的指令，绝不是导入／任务生成时执行的命令。对同一份已保存 lint 报告重新运行 Archify 不会重跑 lint；应按原设置和范围重新生成报告，再导入。

<a id="accept-revoke-and-compare"></a>

## 接受、撤销和比较

评审代码和来源主张后，接受一个当前 finding：

```sh
node bin/archify.mjs code-analysis check /path/to/repo --language ts --config /path/to/repo/analysis.config.json --baseline /path/to/repo/analysis.baseline.json --accept CONV-012345abcdef --reason "Intentional public export; retain this API."
```

无需重新分析即可撤销一个已接受 id：

```sh
node bin/archify.mjs code-analysis check /path/to/repo --baseline /path/to/repo/analysis.baseline.json --revoke CONV-012345abcdef
```

两个操作都保留不相关的基线条目。Accept 要求非空原因。`--update-baseline --reason "..."` 接受所有当前 finding 并替换基线当前集合；与接受单项不同，它会删除已不存在的条目。没有捕获源码证据或 `binding: "changed"` 的外部 finding 不能被接受。用户在评审捕获的当前证据后，可以显式接受来源未验证的主张，但这不会提升报告绑定或比较覆盖。

外部基线条目同时保存源码 `sha256` 和独立的工具主张／上下文 `externalReviewDigest`。源码／主张摘要变化或缺失会将项目重新打开为 `accepted-changed`。现有内部基线保留之前的兼容行为。

早期 C7 构建在省略 `external.severity` 时使用 `"source"`。要保留该行为，现在必须显式设置 `"source"`。将 lint 来源从旧 source 策略切换为新 warning 默认值，会改变导入设置和评审摘要，即使源码字节、finding id 和原始严重性未变。既有接受需要重新评审；跨策略比较不能直接比较，使用这种旧运行的 `--new-only` 返回退出码 2。应评审当前结果并记录新原因，不要静默迁移接受状态。此策略变化不改变 AI review 始终映射为 warning 的行为。

使用同一个 `--out` 目录比较新运行，或显式指定旧 `findings.json`：

```sh
node bin/archify.mjs code-analysis check /path/to/repo --language ts --config /path/to/repo/analysis.config.json --compare /path/to/previous/findings.json --out /path/to/current --json
```

外部比较检查来源集合、工具／版本、规则配置、导入设置与严重性策略、范围／完整性、源码绑定，以及适配器／身份版本。仅报告哈希或报告文件名变化不会改变可比性；合理修复会产生不同的报告字节。带来源限定的原因解释缺失来源或未知／变化的测量条件。消失的结果意味着**不再检测到**，不自动意味着**已修复**。

对于可比较的 ESLint 报告，Archify 首先配对同一位置、相同主张及相同捕获行的唯一 finding，即使周边上下文变化导致 ID 改变。此操作不会转移接受决定或任务证据。两个快照都必须记录行哈希；旧快照和没有此证据的报告使用 ID 匹配。无法形成精确配对的移动或编辑仍可能报告为可能的重命名。

`--new-only` 对新识别的未关闭 finding 施加门禁。比较含外部来源的运行时，不可比较或未知的比较会以 `external/comparison-unverified` 和退出码 2 失败，而不是因旧来源消失而通过。没有任何旧运行时，每个未关闭 finding 都视为新项。即使外部上下文不完整，仍可使用普通全量检查查看未关闭项和证据变化项。

`check` 的退出码保持不变：配置的门禁通过为 0，未关闭 finding 达到 `--fail-on` 为 1，用法／输入／分析错误为 2。门禁通过不保证未配置或未知范围的覆盖情况。

<a id="read-only-github-review-collection"></a>

## 只读 GitHub review 收集

可选收集器保存 PR head 和分页内联 review 评论：

```sh
node bin/archify.mjs code-analysis import-review https://github.com/OWNER/REPO/pull/NUMBER --author 'coderabbitai[bot]' --out /path/to/repo/reports/review.json --json
```

`GH_TOKEN` 或 `GITHUB_TOKEN` 可提供仓库／PR 读取权限；令牌不会写入已保存报告。收集仅使用 GitHub GET 请求，并在发布输出之前验证 PR head 未变。它不创建评论、回复、dismiss review 或调用 AI reviewer。目前接受 `github.com` PR URL，不接受 GitHub Enterprise host。收集器必须显式调用；`check` 和 `serve` 不会自动调用它。

配置其已保存输出：

```json
{
  "external": {
    "sources": [
      { "id": "pr-review", "format": "github-review", "file": "reports/review.json", "tool": "CodeRabbit", "author": "coderabbitai[bot]" }
    ]
  }
}
```

根 review 评论成为 warning 级别来源主张。稳定评论 id、来源 URL、commit、diff 侧、原始／当前原生位置以及讨论回复均予保留。只有导出的 head、所分析 base commit 和评论 commit 一致，且当前行可用时，RIGHT 侧位置才视为当前。LEFT 侧、旧／过期以及仅文件级主张不会获得虚构的当前行证据或自动修改范围。未知规则 id 保持未知。

REST review-comments 端点不代表所有 PR 讨论或完整代码评审。收集器不推断线程解决状态；仅在输入提供时保留 `resolved`／`outdated` 信息。来源评论状态不是本地基线决定。仅收集 review 也不能证明源码字节绑定或完整扫描覆盖。

<a id="current-bounds-and-provenance"></a>

## 当前边界与来源

报告和 manifest 各限制为 32 MiB；单次导入限制为 100,000 条记录。补充源码捕获限制为每文件 2 MiB、每次导入 32 MiB。不可用／二进制／排除源码保持不可验证，同时保留来源主张和提示。所选内部提取器仍适用常规代码分析语言前置条件。

GitHub 收集器总时限为 30 秒，限制为 100 页／10,000 条评论，响应／输出限制为 32 MiB。失败会保留之前的输出。

报告绑定验证所提供的文件内容断言。它不覆盖 Unix 权限元数据、依赖环境的工具行为或工具结论正确性。例如，仅 chmod 的变化不会使字节哈希 manifest 失效，即使它影响 Ruff `EXE001` 之类的来源规则。

内置官方 SARIF schema 通过独立的 draft-04 Ajv 实例检查。源码上下文指纹适配 GitHub CodeQL Action 行算法；它辅助身份识别，不是语义证明。ESLint／Ruff 检测仍由外部工具负责。Archify 实现格式适配器、源码绑定，以及与既有证据／评审／查看器流水线的集成；reviewdog 和 DefectDojo 为解析器组织提供参考，但不是内嵌运行时。观察结果和差距见[内置参考与许可证](../import/vendor/README.md)、[C7 契约中的复用／适配边界](https://github.com/tt-a1i/archify/blob/d6b0f71f25a3337ed2fcd09c973cacf67be7baba/docs/designDoc/code-analysis-c7-contract.md#delivered-scope-and-implementation-boundaries)，以及[验证记录](https://github.com/tt-a1i/archify/blob/d6b0f71f25a3337ed2fcd09c973cacf67be7baba/docs/validation/code-analysis-c7-real-repos.md)。
