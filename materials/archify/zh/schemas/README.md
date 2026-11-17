<a id="archify-json-ir-schemas"></a>

# Archify JSON IR Schema

每个类型化渲染器都接收 JSON 中间表示（IR），并在任何布局工作发生之前，使用本目录中的一种 schema 进行校验。

<a id="files"></a>

## 文件

| Schema | 管理对象 | 结构数组 |
|--------|---------|-------------------|
| `workflow.schema.json` | `diagram_type: "workflow"` | `lanes`、`phases`、`groups`、`mainPath`、`nodes`、`edges` |
| `sequence.schema.json` | `diagram_type: "sequence"` | `participants`、`segments`、`messages`、`activations` |
| `dataflow.schema.json` | `diagram_type: "dataflow"` | `stages`、`nodes`、`flows` |
| `lifecycle.schema.json` | `diagram_type: "lifecycle"` | `mainPath`、`states`、`transitions` |
| `architecture.schema.json` | `diagram_type: "architecture"` | `components`、`boundaries`、`connections` |
| `erd.schema.json` | `diagram_type: "erd"` | `entities`、`relationships` |
| `tree.schema.json` | `diagram_type: "tree"` | `nodes`（每个节点有一个 `parent`） |
| `class.schema.json` | `diagram_type: "class"` | `types`、`relationships` |
| `timeline.schema.json` | `diagram_type: "timeline"` | `events`（`lanes` 可选） |
| `waterfall.schema.json` | `diagram_type: "waterfall"` | `spans`（每项可选一个 `parent`） |
| `common.schema.json` | 仅共享 `$defs`（无顶层文档） | — |

每个图表 schema 都要求 `schema_version`、`diagram_type`、`meta`（包含 `title` 和持久、可移植的 `output`），以及相应结构数组——`segments`、`activations`、ERD 和 Class 的 `relationships`、`cards` 除外，它们是可选的——并在每一层设置 `additionalProperties: false`，因此未知字段会被拒绝，而不会被静默忽略。

每个 `meta` 对象还接受 `animation: "trace"`，以选择启用生成 HTML 中的 SVG／CSS 动效。省略它或设为 `"none"`，得到默认静态输出。它还接受 `locale`，其值为格式合法的语言标签（schema 模式为 `^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$`）。该字段选择固定的查看器 UI、渲染器负责的默认图例与可访问性文案、文档标题后缀以及 `<html lang>` 值；不会翻译作者输入的字符串。`locales/manifest.json` 登记的随包语言目录（`en`、`zh-CN`、`zh-TW`、`es`、`ko`、`ar`）按照标签选择，不区分大小写；地区和文字变体是独立标签。任何其他标签都需要匹配的 `translations` 对象（见下文），否则渲染器会回退为英文并披露。省略 `locale` 会保留旧行为，解析为英文。格式错误的语言标签会导致 schema 校验失败，不会猜测或静默改写。

`meta.translations` 是可选的逐键覆盖数据：把规范消息键（`locales/en.json`）映射到译文字符串的对象，其中 `{placeholder}` token 必须与英文来源匹配。每条消息按以下顺序解析：有效的 `translations` 值 → `locale` 对应的随包目录 → 英文。未知键或占位符不匹配，绝不会覆盖优先级更低但有效的消息，也不会使渲染失败；`validate`／`render`／`deliver` 会将被拒绝的条目和最终解析覆盖率报告到 stderr。

`visual_preset` 接受 `classic`（稳定默认值）、`signal-flow`（发光、偏重动效的呈现）、`blueprint`（高对比度工程评审）或 `editorial`（暖色出版式设计评审与文档）。预设只改变查看器样式，不改变语义 ID 或几何。Sequence 的 `meta` 还接受 `column_fit`。无论是否提供 `meta.viewBox`，默认值都是 `spread`。显式 `fixed` 保留历史的 108px 列间距和 86px 参与者盒子。`spread` 根据 viewBox 推导列间距和盒子宽度，在参与者卡片间至少保留 16px 沟槽，把宽画布转化为列间距和标签空间，而不是右侧空白。两种方式都不改变泳道顺序、ID 和消息语义。

`meta.views` 已退役。schema 仍接受旧的引导视图结构，使现有文件继续通过校验，但渲染器会忽略它；不要创作该字段。

<a id="legend-presentation-contract"></a>

### 图例呈现契约

每个 `meta` 对象都接受同一种可选图例结构，不改变已为该渲染器选择的 schema 版本：

```json
"legend": {
  "mode": "auto",
  "entries": {
    "security": { "label": "restricted data", "visible": true }
  }
}
```

`mode` 为 `auto`（默认）、`all` 或 `hidden`。`auto` 只包含类型化 IR 中出现的种类；`all` 包含渲染器完整、稳定的目录；`hidden` 移除整个图例，优先于条目覆盖。未显式指定 `viewBox` 的 Architecture 文档，使用最终 SVG 布局中同一份实测已解析图例占地，确定自动 viewBox 尺寸。对所有渲染器，省略 `meta.legend` 的旧文档使用兼容安全的隐式 `auto`：如果解析后的图例无法在作者显式指定的 viewBox 中无重叠地容纳，Archify 会省略整个图例，而不会把以前合法的 schema-v1 文档变成硬失败。一旦作者添加 `meta.legend`（包括显式 `mode: "auto"`），布局即视为有意指定，放不下的标签或图例带会以带路径前缀的诊断失败。条目可以设置有界、非空的 `label`、布尔值 `visible`，或同时设置两者。

`visible: false` 移除一个已解析条目；`visible: true` 将受支持但未使用的种类强制加入视觉图例。未知种类和属性会导致严格校验失败。

支持的键由渲染器决定：

| 渲染器 | `meta.legend.entries` 键 |
|---|---|
| Architecture | `frontend`、`backend`、`database`、`cloud`、`security`、`messagebus`、`external` |
| Workflow | `frontend`、`backend`、`security`、`messagebus`、`database`、`cloud`、`external` |
| Sequence | `emphasis`、`return`、`security`、`dashed`、`default` |
| Dataflow | `emphasis`、`security`、`dashed`、`database`、`default` |
| Lifecycle | `start`、`active`、`waiting`、`decision`、`success`、`failure`、`neutral`、`external` |
| ERD | `pk`、`fk`、`uk`、`one`、`many`、`optional` |
| Class | `dependency`、`association`、`inheritance`、`realization`、`composition`、`aggregation` |

标签只影响呈现：不会重命名稳定种类、改变节点／关系，或创建 Semantic Lens 的边事实。Sequence 消息与 Dataflow 流变体条目是视觉键。有确切已编译节点事实支持的组件／状态条目，会获得交互式 Semantic Legend 桥接；这包括真实存在 `nodes[].type: "database"` 事实时的 Dataflow `database`。

每个关系集合（`connections`、`edges`、`messages`、`flows`、`transitions`）都接受一个可选、由作者控制的 `id`，遵循共享 ID 模式。渲染器另行保留按源码顺序生成的运行时键；作者指定的 ID 则支持稳定的 `#relation=<id>` 查看器链接，数组重排后仍有效。没有 ID 的文档仍合法，其关系固定入口仅在当前页面本地有效。

每个语义节点集合（`components`、`nodes`、`participants`、`states`）还接受一个可选 `brand`：可以是 `archify brands --json` 返回的规范字符串，也可以是 `archify brands capture <url> --json` 返回、由摘要固定的 `{ "url", "sha256" }` 对象。已知 ID 与已知品牌域名使用随包矢量目录。未知 URL 必须在创作前通过该显式命令抓取；render 和 validate 绝不会进行未固定摘要的网络抓取。内容不安全、不可用、变化或不受支持时，使用品牌诊断拒绝继续。省略 `brand` 保留原有输出。

<a id="schema_version-policy"></a>

## schema_version 策略

Workflow 支持 schema 版本 1 和 2。版本 1 保留固定布局兼容契约；版本 2 选择启用可读工作流编译器，并可通过 `archify migrate workflow ... --to-schema 2` 显式生成。Lifecycle 只接受版本 3，即自动主路径布局（见[生命周期渲染器](../renderers/lifecycle/README.md)）。其他三种图表 schema 的 `schema_version` 固定为 `1`，没有 schema 版本迁移命令。对五种图表中的任意一种，旧的 `meta.output` 缺失或不可移植时，应在源文件修复后运行 `validate`。仅就 Workflow v1 到 v2 迁移而言，`migrate workflow` 还接受 `--output reports/diagram.html`，将该可移植值写入独立的 v2 目标，而不修改旧源文件。

Workflow 还接受可选 `semanticChecks`。`allowedRoots` 和 `allowedTerminals` 限定预期的图来源与终点集合；`requiredEdges` 要求精确的作者定义关系；`requiredPaths` 要求有向可达性，同时允许中间节点。编译器在布局前计算这些事实，并返回类型化的 `workflow/*` 诊断。该字段是增量且几何中立的：省略它保留现有工作流行为；加入一个已满足的契约不会改变 SVG 或布局回执字节。

今天能通过校验的文件，在整个 2.x 发布系列内，都必须继续按其声明版本通过校验和渲染。经明确审阅的可移植输出加固是唯一例外：省略 `meta.output` 的旧 v1 文档必须补上可移植的 POSIX 相对 `.html` 路径（例如 `reports/diagram.html`）；普通的显式 CLI 输出参数不能代替这个持久的作者值。仅针对 Workflow 的 v1 到 v2 迁移命令，也可以通过 `--output reports/diagram.html` 显式接收该值；它只把该值写入独立且已校验的目标。增量的查看器、可访问性与呈现改进，可以增强生成的 HTML，但不能重新解释作者定义的 IR，也不能把以前合法且无 profile 的 v1 文件变成新的硬性布局失败。破坏性的 IR 变更要求新版本；增量、向后兼容字段则不需要。

<a id="shared-definitions-commonschemajson"></a>

## 共享定义（common.schema.json）

五种图表 schema 引用 `common.schema.json#/$defs/...`：

- `id` — 元素标识符，模式为 `^[a-zA-Z][a-zA-Z0-9_-]*$`。
- `point` — 由两个数字组成的 `[x, y]`（用于 `via` 和 `labelAt`）。
- `componentType` — `frontend`、`backend`、`database`、`cloud`、`security`、`messagebus`、`external`。
- `locale` — 格式合法的渲染器语言标签（随包目录列在 `locales/manifest.json`；其他标签需要匹配的 `translations` 对象）。
- `translations` — 规范消息键 → 译文字符串，覆盖在 `locale` 的随包目录之上，再回退到英文。
- `portableOutputPath` — `meta.output` 使用的可移植 POSIX 相对 `.html` 路径；见[交付契约](../references/delivery-contract.md#output-path-contracts)中的两个输出路径边界。
- `brandMark` — 一个可选的内置品牌 ID，或显式 HTTP(S) 网站 URL。
- `variant` — `default`、`emphasis`、`security`、`dashed`（Sequence 消息在本地以 `return` 扩展该列表）。
- `legendMode` 和 `legendEntry` — 每个渲染器拥有的键映射所使用的共享严格模式与标签／可见性覆盖结构。
- `guidedViews` — 已退役的 `meta.views` 结构，仍被接受但会忽略。
- `cards` — 渲染在 SVG 下方的摘要卡片块。

Lifecycle 状态的 `type` 是模式专属的（`start`／`active`／`waiting`／……），保留在 `lifecycle.schema.json` 中。

JSON Schema 定义是可移植契约中能够以结构表达的预检查。随包生成的 validator 包装器与 CLI，还会强制执行基于字节的组件限制和完整运行时路径契约；需要相同跨平台接受边界的消费者，应使用该包装器。

<a id="runtime-validation"></a>

## 运行时校验

开发阶段，`scripts/generate-validators.mjs` 使用 ajv 的 draft 2020-12 standalone generator，以 `strict: true` 和 `allErrors: true` 编译全部五种 schema。生成的 `renderers/shared/generated-validators.mjs` 会提交并随技能发布，因此运行时校验没有 npm 或网络依赖。`renderers/shared/validator.mjs` 在渲染器自己的布局检查之前，应用匹配的独立校验器。

随后，共享加载器检查 JSON Schema 在此处难以清晰表达的跨集合事实：重复的 view ID、重复的 focus ID、在图表语义集合中不存在的 focus ID，以及模式关系集合中重复的作者定义关系 ID。

五种模式都支持选择启用、固定 revision 的仓库证据。`meta.repository` 指定仓库 URL 和完整 commit SHA，可选 `provider`（`github`、`gitee` 或 `gitlab`）与 `link_mode`（`web` 或 `local-only`；见创作契约）；节点可携带一到三个 `sources`，使用仓库相对 POSIX 路径，以及可选行号范围和标签。来源写在该模式自己的节点集合上——Architecture 的 `components`，Workflow 和 Data Flow 的 `nodes`，Sequence 的 `participants`，Lifecycle 的 `states`——已验证载荷按节点 ID 索引。先以 schema 校验结构，然后渲染器要求 `--repo-root`：本地 Git origin 必须匹配，Git 必须证明 commit、blob 和请求的行存在。已验证证据嵌入规范 SVG 之外，供 Semantic Passport 和 Node Finder 使用；普通文档和视觉导出不携带仓库证据。

<a id="visual-quality-and-engineering-truth"></a>

## 视觉质量与工程事实

`meta.quality_profile` 和 `meta.engineering_profile` 回答不同问题。`quality_profile` 在全部五种模式中可用，控制 Archify 评判构图的严格程度。`engineering_profile` 是可选、仅属于 Architecture 的语义契约；省略它保留普通 v1 行为。

首个工程 profile 为 `deployment-ownership`。只有用户要求缺少事实就拒绝继续的部署评审，而且来源事实已知时才启用。它要求每个非 external 组件在 `tag` 中注明所有者，并且恰好属于一个 `region`；文档必须同时包含 `region` 和 `security-group` 边界；每个 `database` 必须位于某个 `security-group` 内；每个 security group 的成员必须来自同一个共享 region；每条 region 或 security-group 成员资格发生变化的连接，都必须在 `label` 中标明真实的跨界机制。

该 profile 只校验作者定义的 IR，不发现基础设施，不推断所有者，也不证明图表匹配实时环境。事实未知时，保持 profile 未设置，或先取得事实，而不是编造。

`npm test` 以检查模式运行生成器，已提交校验器偏离 schema 时会失败。

<a id="error-format"></a>

## 错误格式

schema 违规会以非零状态退出。每个 ajv 错误单独占一行，格式为实例路径——标注最近包围元素的 `id` 或 `label`——然后是消息与参数：

```text
workflow schema validation failed:
  /nodes/3 (id/label: "router") must NOT have additional properties {"additionalProperty":"colour"}
```

schema 捕获结构错误（类型、枚举、范围、未知字段）；重叠和标签碰撞等几何问题由渲染器负责。
