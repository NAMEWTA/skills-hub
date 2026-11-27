<a id="pr-review-authoring"></a>

# PR 审查编写

当用户要求解释或可视化一个拉取请求、分支变更、`git diff`，或希望把变更图附到 PR 时，使用本参考。整个流程依靠本地检出和标准 `gh` CLI：不需要额外 API 密钥，也不需要托管服务。代码是事实依据；图展示改了什么、改在何处，以及与哪些相邻对象有关。图本身不评判变更。

<a id="1-read-the-real-change"></a>

## 1. 读取真实变更

在远端引用已更新的检出目录上运行预检。如果 PR 的实际目标分支不是远端默认分支，就提供其实际目标。

```sh
node bin/archify.mjs pr preflight --repo-root <repo> --base origin/<base> --head HEAD --init <pack-dir> --json
```

预检解析合并基点和 head，统计变更文件及行数，对路径分类，并返回 `materiality` 和 `policy`。省略 `--init` 可执行只读检查。使用 `--init` 时，在构建前填写生成清单中的标题和视图。已有清单会保留。用 `git diff --find-renames <baseSha> <headSha>` 检查变更块。

在 GitHub 上，把 `policy.target` 用作 attach 的 `--target` 值。在仓库根目录的 `AGENTS.md` 或 `CONTRIBUTING.md` 中，使用如 `[archify pr: ask, target=comment]` 这样的独立规则设置团队偏好。预检依次优先采用显式的 `--mode` 和 `--target`、个人规则、仓库规则，最后才是 `ask` 和 `body`。只有选定宿主的个人规则、显式个人路径或明确请求才能启用主动附加。个人规则发现支持 Codex、Claude Code、Cursor 和 Devin，通过 `HOME` 或 `USERPROFILE` 查找；回退发现遵守 `on-demand`，绝不会启用主动附加。可传入 `--global-rules <path>` 指定个人文件。小型 schema 或迁移变更即使低于通常的行数阈值，也仍可作为候选。

<a id="2-slice-by-dependency-change-stacks"></a>

## 2. 按依赖切分（变更栈）

按变更传播的顺序排列视图，只绘制 PR 实际触及的层：

1. **存储结构**——当迁移、表、列、键或索引发生变化时使用 `erd`。对类型变化的列标记 `change: "modified"` 和 `previousType`。
2. **边界与状态**——状态机和状态转换使用 `lifecycle`；新增或退役的服务、存储、队列及其关系使用 `architecture`；决策路径变化使用 `workflow`。
3. **交互与载荷**——调用顺序变化或新增一跳使用 `sequence`；转换路径变化使用 `dataflow`。把请求或事件正文放在 `messages[].payload` / `flows[].payload` 中（`summary`、`contentType`、`before`、`after` 或 `sample`）；Viewer 会在 Semantic Passport 中对比前后内容，SVG 则始终不携带这些正文。

只有一张表的迁移只需一个 `erd` 视图。新增服务并新增一次调用，则使用一个 `architecture` 视图加一个 `sequence` 视图。不要为了凑包而加入只有 `unchanged` 内容的视图。

<a id="3-merged-superset-with-one-hop-of-context"></a>

## 3. 合并后的超集，加上一跳上下文

每个视图都用一张图同时包含变更前后的内容：

- 编写前后两侧的并集。保留每个元素的作者指定位置；渲染器把 `change: "removed"` 元素原位绘制为残影，不会围绕它们重新布局。
- 用 `change` 为每个元素标记一次：`added`、`modified`、`removed`。仅对帮助理解变更的相邻对象保留 `unchanged`——直接调用方、写入的存储、离开的状态——到此为止（一跳）。普通图完全省略 `change`；只有至少一个元素具有变更状态时才显示图例。
- 对审查者首先必须找到的一两个元素设置 `emphasis: true`。它会加粗描边和标签字重，但不表示严重程度。不要在已标记变更的元素上叠加：变更颜色、边框和徽标已能引导视线，因此仅在审查的关键取决于某个未变化元素时才强调它。
- 只要任何元素带有变更状态，颜色就表示变更。未变化的节点和边转为中性色，变化节点的边框和底色使用变更颜色，图例不再显示节点类型色块（节点图标仍说明类型），线型示例只保留虚线样式和粗细。因此，在标记了变更的图中，安全节点或安全边会失去玫瑰色提示：如果信任边界对审查很重要，就在标签或 `security-group` 边界上注明。`removed` 使用细玫瑰色点线，与安全虚线区分。
- 总览应小到能在 GitHub 栏宽内读清。某个分支需要更大空间时，为它创建独立视图并设置 `"collapsed": true`，让 Markdown 把它折叠到 `<details>` 中；总览的节点只保留变更及其一跳邻居。如果每条边都与其他边交叉，这样的图不能提供有用证据，应将其拆分。
- `change` 和 `emphasis` 可用于 architecture 的组件、边界和连接；workflow 的泳道、分组、节点和边；sequence 的参与者、片段和消息；dataflow 的节点和流；lifecycle 的状态和转换；ERD 的实体、属性和关系；class 的类型、属性、方法和关系；tree 的节点；timeline 的泳道和事件；以及 waterfall 的 span（变更后的 ERD 和 class 属性还支持 `previousType`）。未使用这些键的图，其校验和渲染行为与之前完全相同。

<a id="4-choose-the-route"></a>

## 4. 选择路径

| 情况 | 路径 |
| --- | --- |
| 解释一个 PR 在一种或多种图类型中的变更 | 在合并超集候选中内联 `change` 标记，再用 `archify pr build` 生成包含 Markdown 和双主题 SVG 的多视图包。 |
| 审计两个完整的架构快照（base 和 head），包括每个移动、新增或删除组件的数量 | 用 `archify compare architecture <base.json> <head.json> --json` 生成 Before \| Delta \| After 报告。快照应编写为不含 `change` 键的完整架构图。 |
| 两者都需要 | 运行 `compare` 取得审计数量，在清单的 `stats` 中引用这些数量，并为读者绘制内联变更视图。 |

`compare` 需要两个完整快照，且仅覆盖 `architecture`；内联标记每个视图只需一个候选，覆盖十种图类型。两条路径都不输出风险意见。

<a id="5-command-loop"></a>

## 5. 命令循环

```sh
# each view: validate, deliver, check and browser-check one change-marked candidate
node bin/archify.mjs finalize <type> <view.json> <view.html> --repo-root <repo> --quality showcase --json

# optional single-view export for a comment or another forge
node bin/archify.mjs export-svg <type> <view.json> <out/view> --theme both --json

# GitHub pack (set target to policy.target or the user’s explicit choice)
node bin/archify.mjs pr validate <pr-pack.json> --repo-root <repo> --json
node bin/archify.mjs pr build <pr-pack.json> --out-dir <out> --repo-root <repo> --json
node bin/archify.mjs pr attach <pr-number-or-url> --manifest <out>/pr-pack.receipt.json --target "$target" --dry-run --json
node bin/archify.mjs pr attach <pr-number-or-url> --manifest <out>/pr-pack.receipt.json --target "$target" --json
```

在 GitLab 上，使用由独立视图组成的静态包。用支持 `glab api --form` 的 `glab` 版本登录 MR 宿主。使用完整的 HTTPS MR URL。GitLab 的目标默认为 `comment`。如果 URL 使用非默认 HTTPS 端口，请为该主机名配置 `glab`：把 `api_host` 设为 `hostname:port`，把 `api_protocol` 设为 `https`。

```sh
node bin/archify.mjs pr build <pr-pack.json> --out-dir <out> --repo-root <repo> --platform gitlab --json
node bin/archify.mjs pr attach <gitlab-mr-url> --manifest <out>/pr-pack.receipt.json --dry-run --json
node bin/archify.mjs pr attach <gitlab-mr-url> --manifest <out>/pr-pack.receipt.json --json
```

GitLab attach 会检查 MR 的 head，以及回执中固定的任何合并基点。它把变化的 SVG 上传到目标项目，再次检查版本，然后创建或更新当前登录用户的 Archify 评论。如果上传或评论写入失败，重试命令。失败尝试中已经上传的文件可能仍保留在项目存储中。

清单（`schemas/pr-pack.schema.json`；完整示例见 `examples/checkout-ledger.pr-pack.json` 及其三个带变更标记的视图）列出 `title`、`summary`、`baseRef`/`headRef`（或 `baseSha`/`headSha`），以及 `views[]`。每个视图包含 `id`、`title`、`type`、`input`（相对清单的路径），可选 `caption`、`collapsed`、`storyOnly`、`theme`、`preset`；清单还可包含 `story` 演示规格，以及可选的 `changes[]` 表和客观 `stats`。
- 未指定 `preset` 的视图继承包清单的 `preset`（未设置时为 `classic`），`pr build` 把这一统一预设写入构建后的视图快照的 `meta.visual_preset`；只有视图必须覆盖包预设时，才在该视图上设置 `preset`。
- 对复杂或跨层 PR，编写 `story`（`duration`、`stages`，以及可选的 `loop`，默认 `true`；`nodeBadges` 在故事和静态 PR 包视图中默认均为 `"labeled"`，包括 ERD/Class 标题；还有 `pair.shared`、`enter`/`connect`/`fade`/`focus`/`relabel`、`traces`、`metrics`、`detail` 和有序的 `steps`），将其编译为自包含的 960x560 动画演示 SVG，作为 PR 的主视觉，附带当前步骤的倒计时进度条。
  - 省略 `steps[].at`（可先设置一个开场节拍），使字幕在定时步骤之间或整个 `duration` 内均匀分布。
  - 设置 `detail.mode: "diff"`（使用 `baseLines` + `lines`，或用 `maxLines` 选择变更块，并可选 `selections[].baseLines`），渲染经过 Git 验证、位于 `baseSha` 和 `headSha` 之间的真实 `−` / `+` 前后差异摘录，而不是单一版本摘录。
  - 标准四阶段时间模板（`duration: 24`，按需调整）：
    - `0s – 4.5s`：基线 `before` 阶段（突出已删除的节点/路径）。
    - `4.0s – 13.5s`：配对的 `after` 转换（`pair.at: 4.0`，在 `4.8s–6.5s` 执行 `enter` + `connect`，在 `7.5s–12.5s` 让 `traces` 沿新路径移动）。
    - `13.2s – 18.5s`：次要契约/数据视图（`erd` / `sequence`）。
    - `18.2s – 24.0s`：`code_focus`，左侧节点 + 右侧 `detail`（`mode: "diff"`）+ 前后 `metrics`。
  - 把辅助基线或聚焦视图标为 `storyOnly: true`，使其参与故事但不输出独立图片；把深入参考视图（`erd`、`workflow`、`sequence` 等）保持为 `collapsed: true`，让审查者在 `<details>` 内展开静态图。
`build` 会写出固定到已验证版本的 `views/<id>.json` 快照、离线 `views/<id>.html`（源码链接和载荷差异位于此处）、通过严格 XML 与 GitHub Camo 限制检查的 `views/<id>-light.svg` / `-dark.svg`、带资源占位符的 `pr-pack.md`，以及 `pr-pack.receipt.json`。
刷新时，`attach` 从选定正文或置顶评论的隐藏元数据中读取资源哈希和 URL，只上传变化的 SVG。纯文字刷新会沿用已有 URL 原位更新包。GitHub 差异链接在 attach 时填入真实 PR URL。

在 GitHub 上，`attach` 用 `gh … --attach` 上传 SVG，把占位符改为返回的 `user-attachments` URL，并仅替换 `<!-- archify-pr-pack:start/end -->` 块，因此手写说明和重复运行都能保留。`--target comment` 则维护一条置顶评论。只需要 SVG 时使用 `--no-html`；使用 `--platform gitlab|generic` 生成单主题 `![…](…)` 图片；只有用户要求为 `sequence`/`dataflow` 提供有限时长的流动动画时才使用 `--animate-flow`。SVG 默认静态，画布不会移动。

按诊断修复，然后重新运行同一命令：

- `pr-pack/invalid-source-anchor`——选择一个变化文件，并对照固定的 Git blob 检查从 1 开始的行号。在变更行或故事步骤上设置 `path` 和 `line`，得到 head 侧链接。删除内容使用 `baseLine`；重命名变更行使用 `basePath` 指定旧路径。应选择 PR 差异中可见的行。即使被引用行确实存在，GitHub 也可能折叠未变化的上下文或大文件。GitHub 构建会在表中和故事下方包含链接；其他平台以文字显示位置。
- `pr-attach/head-sha-outdated`——比较回执中的 head 与在线 PR 的 head，按需要 push 或 fetch，然后在预期提交上重新构建。只有刻意附加较旧包时才使用 `--allow-stale`。
- `pr-attach/base-sha-outdated`——针对 GitLab MR 当前的合并基点重新构建。只有刻意附加较旧包时才使用 `--allow-stale`。
- `pr-attach/base-sha-unavailable`——等待 GitLab 准备好当前差异；如果已验证构建回执缺少 `baseSha`，则重新构建。
- `pr-attach/gitlab-api-host`——在重试前，使 `glab` API 的主机、端口和协议与 HTTPS MR URL 一致。
- `repository-evidence/*`——所引用路径或行号在固定版本中不正确。删除元素在 `meta.repository.base_revision`（合并基点）验证，其他元素在 `revision` 验证；候选未填写时，`build` 根据已验证 SHA 填入两者。应修正引用，绝不能修改标记。
- `pr-pack/base-sha-not-merge-base`、`pr-pack/head-sha-mismatch`、`pr-pack/view-revision-mismatch`——重读步骤 1；清单或某个视图固定的提交与检出目录不同。
- `pr-pack/unknown-change-view`——某个 `changes[].view` 指定了清单未声明的视图 id。
- `pr-pack/risk-verdict`——文本含有 `SAFE`、`LOW RISK`、`MERGEABLE`、`NO IMPACT` 或 `VERIFIED PR`。删除这些措辞。报告数量、名称和图；结论由审查者作出。
- `pr-story/empty-diff`、`pr-story/invalid-detail`——`mode: "diff"` 下的 `story.detail` 在选定范围内没有找到 `+/−` 行，或摘录/选择缺少必需的 `lines`/`baseLines`。应引用 `baseSha` 与 `headSha` 之间的变化行，或省略 `baseLines`/`lines`，直接截取变更块。
- `pr-attach/*`——阅读回执：附件超过 50 个、资源达到 5 MiB、`gh` 版本过旧（< 2.99.0）或尚未登录时，预检会在任何 `gh` 调用之前停止；第二步失败时会恢复原正文或删除临时评论，并在 `rollback` 中报告。在不熟悉的仓库上先运行 `--dry-run`。
- 如果导出的 SVG 没有出现变更图例，说明作者设置的画布不足以容纳它：应扩大图的指定尺寸，而不是隐藏图例。
