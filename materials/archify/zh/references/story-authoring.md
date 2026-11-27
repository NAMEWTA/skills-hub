<a id="story-authoring"></a>

# 故事编写

Archify 提供两种互补的故事工作流：

1. **Viewer 演示附加**（`story scan | draft | attach`）：为单个原生 HTML 图增加 Viewer 内播放、配乐合成，以及离线 1080p WebM 或 MP4 导出。
2. **组件编排与独立交付物**（`story validate | svg | stage | video`）：通过 `story-choreography` JSON 规格或已有的 `<native.html> <brief.json>` 对，将一个或多个原生图编排为双主题动画 `.svg`、静态 `.still.svg`、交互式 `.stage.html`，或由无头 Chrome 直接生成的 1080p `.mp4`/`.webm` 视频。

<a id="1-viewer-attachment-scan-draft-attach"></a>

## 1. Viewer 附加（`scan`、`draft`、`attach`）

```sh
node bin/archify.mjs story draft <native.html> <brief.json> --json
node bin/archify.mjs story attach <native.html> <brief.json> <enhanced.html> --json
```

`draft` 写出 brief 和 `<brief-stem>.source.json`。阅读 source map，取得真实节点 ID、连接 ID、方向、分组和图例，然后把提纲替换为使用用户语言写成的完整 brief。若只检查而不写文件，使用 `story scan <native.html> --json`。

```json
{
  "version": 2,
  "title": "How a task reaches the worker",
  "intro": "Establish the whole path before following its handoffs.",
  "outro": "The queue separates accepting a task from finishing its work.",
  "scenes": [{
    "title": "Dispatch the work",
    "points": [{
      "anchor": "worker",
      "via": "dispatch",
      "title": "The worker receives the task",
      "text": "Explain this responsibility and its consequence.",
      "caption": "The queued task reaches the worker."
    }]
  }]
}
```

给每个区域安排不同职责：
- **顶部（`scene.title`）**：章节主题或中心判断；各要点展开期间保持稳定。
- **底部（`point.caption`）**：讲述当前动作，并衔接相邻步骤。
- **侧边（`point.title`、`point.text`）**：解释职责、条件、分支或范围。

选择与运动规则：
- `anchor` 选择节点；可选 `via` 选择一个边 ID 或数组。要点或场景的 `action`：`trace` 按顺序沿边移动，`parallel` 同时展示分支，`relation` 展示关联而不产生实时 token 传递（`erd`、`class`、`tree`、`timeline`、`waterfall` 默认使用此值）。
- 需要代码摘录时，向 `story attach` 传入 `--repo-root <repository>`。要点的 `code` 选择 `node`（默认：`anchor`）、`source` 索引，以及可选的 `fromLine`、`toLine` 和 `emphasis` 行号，行号必须位于已验证范围内（最多 20 行）。

附加到 Viewer 的视频默认导出为 **WebM（VP9/Opus），1080p、60 fps**。导出菜单同时提供 WebM 和 MP4。支持时，下载通过 `showSaveFilePicker` 流式写入。以程序方式调用 `Archify.story.exportVideo()` 会返回 Blob。传入 `{format: "mp4"}` 可请求 H.264/AAC。

<a id="2-component-choreography-validate-svg-stage-video"></a>

## 2. 组件编排（`validate`、`svg`、`stage`、`video`）

需要多视图编排、组件身份转换、指标标注、固定代码面板，或不修改原生 HTML 而直接从 CLI 输出 `.svg`/`.mp4` 时：

```sh
node bin/archify.mjs story validate <choreography.json> [--repo-root path] [--json]
node bin/archify.mjs story svg <choreography.json> <out.svg|stem> [--theme both|light|dark] [--still] [--repo-root path] [--json]
node bin/archify.mjs story stage <choreography.json> <out.html> [--theme light|dark] [--repo-root path] [--json]
node bin/archify.mjs story video <choreography.json> <out.mp4|out.webm> [--format mp4|webm] [--fps 30|60] [--repo-root path] [--json]
```

`svg`、`stage` 和 `video` 也接受含三个位置参数的单图桥接形式 `<native.html> <brief.json> <out>`，把已有 brief 编译为独立 SVG、舞台播放器或 MP4/WebM 视频。
使用单图桥接时，`story svg diagram.html brief.json story.svg` 会写出动画 `story.svg` 和静态首帧 `story.still.svg`。用 `--theme both` 可为每个主题分别生成一对文件。

最小的 `story-choreography` 规格（按 `schemas/story-choreography.schema.json` 校验）：

```json
{
  "schema_version": 1,
  "title": "Queue handoff walkthrough",
  "preset": "classic",
  "views": [
    { "id": "arch", "type": "architecture", "input": "arch.json" },
    { "id": "flow", "type": "dataflow", "input": "flow.json" }
  ],
  "steps": [
    { "view": "arch", "title": "Ingress queues requests", "body": "API writes work items to the shared queue.", "focus": ["api", "queue"] },
    { "view": "flow", "transition": { "from": "arch", "shared": [{ "id": "queue", "subtitle": "Durable buffer" }] },
      "title": "Worker drains batches", "body": "Consumer reads from the queue and persists state.", "trace": { "edges": ["queue~worker"], "action": "trace" } }
  ]
}
```

主要能力与约束：
- **视图与标注**：每个视图接受原生 `.json` schema 输入、已渲染的 `.html` 或内联 `diagram` 对象，还可指定 `callouts: { "<nodeId>": { "text": "...", "tone": "accent|added|modified|removed|neutral" } }`。
- **跨视图转换**：`step.transition` 将前一个视图中的共享组件平滑变形（`id`，可选 `targetId`、`label`、`subtitle`）。
- **声明式节拍操作**：省略 `duration` / `at` 可自动安排步骤时间；也可提供显式 `duration` + 严格递增的 `at` 时间戳。每个步骤支持 `enter`、`connect`、`fade`、`relabel`、`focus`（`center`，或搭配 `detail` 时使用 `left`）、`trace`（`trace`/`parallel`）、`metrics`（`before -> after`）和 `detail`（`path`、`lines`、`highlight`、`selections`）。
- **时间安排**：自动安排会计入作者指定的入场/连接错峰，以及完整的 trace。显式步骤时长不能与下一步重叠，也不能超出故事时长。在有意留出的间隔内，图保持姿态，而步骤字幕和代码面板淡出。回到某个视图时，会在同一原生图层上使用独立的可见时间窗口。
- **结构安全**：静态关系图（`erd`、`class`、`tree`）上的实时 `trace` token 需要 `allowStructuralTrace`；已删除元素始终拒绝实时传递 token。输出 SVG、舞台 HTML 或视频前，会检查所引用的 `detail` 路径和行号。每个视图的仓库版本也约束其代码摘录，包括以原生 HTML 提供的视图。
- **来源版本**：`detail.revision` 接受 `head`、`base` 或完整的 40 字符提交 SHA。别名使用所属视图固定的仓库版本；省略版本时，如有 head 固定值则采用该值。固定版本的摘录需要 `--repo-root`，绝不回退到工作区文本。未固定版本的摘录从相对 `--repo-root` 或编排目录的位置读取。所有解析后的摘录都受输出路径冲突保护。
- **输出**：`story svg` 生成符合 Camo 限制的独立双主题 `<stem>-light.svg` 和 `<stem>-dark.svg`（使用 `--still` 或 `stills[]` 时，还生成 `.still.svg` 静态关键帧）；`story stage` 生成自包含 HTML 播放器，支持 1080p60 分批 MP4/WebM 导出；`story video` 调用无头 Chrome，直接从 CLI 输出 `.mp4` 或 `.webm` 文件。

故事配色遵循第一个声明视图的有效预设；使用单 HTML 桥接时，遵循原生图的预设。代码详情最多接受 20 行源码。用户偏好减少动态效果时，Stage 打开后保持暂停，仍支持拖动进度、主动播放和视频导出。独立动画 SVG 在此偏好下采用静态总览。

Stage 的 MP4 仅包含视频，需要支持 H.264 的 Chrome。附加 Story 的 MP4 还包含 AAC 音频。可通过 `.mp4` CLI 输出、`--format mp4`、Stage 的 MP4 按钮，或附加 Viewer 中的 `Archify.story.exportVideo({format:'mp4'})` 请求 MP4。不支持的编解码器会产生对应格式的错误。

SVG 发布采用可恢复且不覆盖冲突目标的写入方式。如果进程在替换过程中停止，公开文件可能暂时不存在，而旧字节保存在恢复备份中。对单个文件，请遵循[中断发布处理流程](delivery-contract.md#validate-and-deliver)。

`story svg` 在渲染或发布后续 SVG 时捕获错误，会尝试回滚之前的写入。如果恢复不完整，命令会把可用的恢复副本保留在临时目录中。普通文本和 JSON 诊断都会标明每个副本、请求的输出，以及解析后的目标位置。重试前检查这些路径。

Stage 视频导出期间会锁定播放控件；无论成功、失败还是取消，都会恢复控件及读者先前的位置。已有的 `story scan|draft|attach` 命令仍可独立于编排功能使用。
