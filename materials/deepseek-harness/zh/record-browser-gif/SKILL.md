---
name: record-browser-gif
description: 通过可用浏览器控制流程、可选的较高捕获帧率 Playwright Videos 及确定性编码，将浏览器或 Web UI 交互演示录为优化 GIF，再用 gh --attach 附到 PR；发布需 gh v2.99.0 以上，超过 5 MiB 则拆分。要求制作、录制或生成浏览器流程演示 GIF 时使用；每个改变产品用户可见 GUI 行为的 PR 也必须使用，并从该 PR 真实服务器及模型流程录制 GIF。
---

# 录制浏览器 GIF

产出简短、真实的本地 UI 演示 GIF；只有任务包含附到 PR 时，才通过技能末尾附件流程发布。优先可用浏览器控制流程。该流程支持更高帧率连续捕获时，使用 [Playwright Videos](https://playwright.dev/docs/videos)；裁剪、播放速度、尾部停留、尺寸及大小使用随附编码器。

[已归档证据链决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/process/2026-08-08-browser-gif-evidence-chain.md)记录为何一个故事板来自一次隔离运行，以及发布为何重新验证产物与演示的 PR 分支头。

## 每个 GUI PR 都含 GIF

改变产品用户可见 GUI 行为的 PR **必须**包含按本技能录制、通过[附件流程](#发布-gif)嵌入正文的演示 GIF。

录制本身就是证据：使用从该 PR 分支树启动的真实服务器、真实 API 密钥及真实模型轮次。除非用户明确要求夹具录制，绝不替换成夹具查询、模拟传输、合成事件注入或测试专用钩子。嵌入旁说明准确演示提交 SHA、提供服务的树及 origin、任何模式标志或浏览器状态例外，以及是否运行真实模型轮次，让评审者准确知道证明什么。

## 录制与发布分开

- 录制产出本地视频或截图；编码产出一个 `.gif`，超过 5 MiB 则产出[编号分片](#用-gh-附加)。二者都不修改远程状态。
- 发布——用 `gh --attach` 附到 PR 正文——是独立最后步骤，仅当任务包含附到 PR 才执行。绝不提交到任何分支。
- 保留要求的录制条件。真实服务器或真实 API 演示不用夹具查询、模拟传输、合成事件注入或测试专用钩子。缺凭据或服务器时报告限制，不替代夹具。
- 绝不读取或暴露凭据值。使用应用正常配置路径及无害演示提示。

## 准备应用

特定 PR 的 GIF 展示该 PR 的树，因此逐 PR 准备：

1. 要求干净工作树，用 `git rev-parse HEAD` 记录准确提交，再构建该树——这里是 `pnpm run build && pnpm run build:web`。针对其他提交构建录制会误归证据。
2. 每端口从该树启动一个服务器，用全新临时 `DSH_HOME`、`DSH_AGENTS_HOME`、工作区及会话状态。浏览器也用全新隔离 context 或 profile；流程无法创建时，导航前清除该 origin 的 cookie 与网站存储，防持久客户端状态影响证据。即使无 `DEEPSEEK_API_KEY` 和根 `.env`，真实 API 凭据仍可能在 `~/.dsh/.credentials.yaml`。临时 `DSH_HOME` 下用录制叠加配置，把 `dsh-credentials-local` 提供者的 `path` 设为已有文件绝对路径。让应用正常凭据提供者解析密钥，绝不回显。
3. 一个故事板视为一次证据运行：每个发布帧都来自该服务器、这些状态根、工作区、会话及模型驱动场景运行。捕获自动化失败，丢弃该次帧，从全新根重跑；不拼接不同运行。
4. 切换 PR 时，按 PID 或准确命令行匹配停止旧服务器。宽泛 `pkill -f` 可能匹配并杀死启动它的 shell，包括你自己的。

## 录制流程

遵循可用浏览器控制流程的准备、交互及清理指令。支持 `recordVideo` 时，在同一受控 context 开视频，捕获更多中间帧。否则在该流程内用[截图捕获](#截图捕获)；视频是否可用不决定选哪个浏览器控制流程。已有用户浏览器状态仍是需明确说明的隔离例外。

只有浏览器控制不可用时，才在隔离无头浏览器使用仓库声明的 Playwright 依赖，在捕获笔记说明回退。本仓库从 `apps/web/package.json` 解析；不安装其他驱动，不打开用户浏览器。

录制前识别 origin、构建或开发服务器、传输及模式覆盖。生产默认打开自动化无法驱动的原生表面时，通过正常应用配置选择官方可浏览器操作的生产后端，并披露覆盖。

脚本、原视频、时序笔记、QA 帧及 GIF 放仓库被 Git 忽略的 `.playwright-mcp/`。先建运行目录。

### 捕获视频

明确匹配 `viewport` 与 `recordVideo.size`，否则 Playwright 缩视频到 800×800 内，可能使 UI 文字难读。

通过所选浏览器控制流程配置视频。独立 Playwright 回退使用：

```js
const { chromium } = createRequire(join(repo, 'apps/web/package.json'))('playwright')
const browser = await chromium.launch()
const size = { width: 1440, height: 900 }
const context = await browser.newContext({
  viewport: size,
  recordVideo: { dir: join(runDir, 'videos'), size },
})
try {
  const page = await context.newPage()
  const video = page.video()
  // Navigate and exercise the real application here.
  await context.close()
  await video.saveAs(join(runDir, 'demo.webm'))
} finally {
  await context.close()
  await browser.close()
}
```

从 `node:module` 导入 `createRequire`，从 `node:path` 导入 `join`；录制脚本中将 `repo` 及全新 `runDir` 设为绝对路径。关闭页前保留视频句柄。`video.saveAs()` 或编码前等待 `context.close()`；仅关浏览器不保证视频刷出。每页各有视频：明确选演示页，不拼无关页或运行。失败运行只作诊断。

选三至六个有意义状态的短故事。动作前等待唯一语义定位器；无障碍名称相等用 `exact: true`，完成条件用不会匹配提示回显的精确文本。状态验证后固定等待可供阅读停留，但绝不证明就绪。视频保留动画及滚动。

演示工具调用、拒绝或恢复时，打开详情或轨迹，使视频显示工具身份、状态或稳定错误码及下游结果。瞬态运行状态重要时，提示慢前台操作，观察具体 DOM 标记；连续视频捕获中间帧。让模型给简短最终哨兵标记锚定完成。演示状态可见后停止不必要的长真实 API 运行。

不捕获秘密、个人数据、无关标签页或通知。浏览器视频包含页面内容，不含浏览器外框；避免应用渲染带凭据 URL。审查选定区间全部内容，包括中间状态。全程同一视口。

## 编码 GIF

需要 `python3`、`ffmpeg`、`ffprobe`。缺媒体程序则报告依赖，不未经授权装软件。使用前单独一行导出 `GIF_SKILL_DIR`；行内赋值不能影响同命令参数展开。

```sh
export GIF_SKILL_DIR=/absolute/path/to/this/skill
python3 "$GIF_SKILL_DIR/scripts/encode_gif.py" \
  /absolute/path/to/demo.webm \
  /absolute/path/to/demo.gif \
  --start 2 --end 32 --speed 2 --final-hold 3 \
  --fps 10 --max-width 1200 --colors 128
```

`--start`、`--end` 按秒选一个连续源区间。默认完整视频 1×，尾部额外停两秒。`--speed` 改速度；在 GIF 旁披露速度及所选区间，避免暗示实测响应延迟。用观察视频时间，不猜墙钟偏移，保留完整原因及结果。尾停重复最后选定帧。`--fps` 设编码帧率，提高它无法恢复源未捕获运动。保留原 WebM 作 QA；不拼不同运行，不合成缺失状态。

编码器探测 WebM 容器时长，调色板转换前裁剪及变速，检查编码时长、动画、宽及字节数。拒绝空或越界区间、短于两输出帧的选择、模式不适用标志及意外覆盖。产物大先降 `--max-width`，再 `--colors` 或 `--fps`，保持可读。只有解析准确输出路径后才用 `--force`。

### 截图捕获

连续视频不可用或用户要故事板时，遵循可用浏览器控制流程。用截图 API 从一次隔离运行捕获三至六个已验证状态。返回图像字节直接保存到同一运行目录，如 `00-initial.png`、`01-typed.png`，尺寸裁剪相同。瞬态状态在同一次浏览器脚本调用中轮询 DOM 标记并捕获。

```sh
python3 "$GIF_SKILL_DIR/scripts/encode_gif.py" \
  /absolute/path/to/frames /absolute/path/to/demo.gif \
  --durations 1.5,1.5,1.5,3.5 --fps 10 --max-width 1200 --colors 128
```

单时长适用于所有截图；否则逐帧给正时长，结算状态停最久。目录输入拒绝少于两帧、尺寸或时长数量不匹配。视频时序标志只适用视频；`--durations`、`--pattern` 只适用截图目录。

## 验证产物

1. 读编码器 JSON 概要，确认输出路径、源区间及速度（或截图数）、编码帧数、尺寸、时长、字节数。
2. 目视读取编码 GIF 本身，不只看源帧。确认转换易懂、末态停够、无敏感内容。查看器只渲染首帧时，用 `ffmpeg` 从编码 GIF 解代表帧检查；编码前截图不证明编码顺序、色板或尾停。
3. 运行 `git status --short`，确认原视频、QA 帧及产物只在忽略路径。
4. 返回 GIF 绝对路径，客户端支持本地媒体时渲染，说明使用真实 API、夹具还是其他传输。任务不含附到 PR 时到此停止。

编码器维护：媒体前提装好后，运行 `python3 -m unittest discover -s "$GIF_SKILL_DIR/scripts" -p 'test_*.py' -v`。这些本地媒体测试不在仓库 CI 运行。

## 发布 GIF

只有任务包含附到 PR 才执行。

绝不把 GIF 提交到该 PR 自身或任何其他分支：仓库任何分支提交的媒体，默认克隆及完整历史获取都会下载。只用 `gh --attach`，一次命令上传 GitHub 并重写正文引用，无分支携带媒体。

### 用 gh 附加

附加前查 `gh --version`。`gh --attach` 需要 `gh` v2.99.0 以上、github.com 仓库（不支持 GitHub Enterprise Server）及仓库写权限。版本更旧则停止，告诉开发者升级，保留已验证 GIF 供重试，不未经授权安装或升级。其他要求未满足或附加失败（认证、写权限、非 github.com 仓库、上传错误）也停止并报告。绝不改用其他发布方式。

发布不超过 5 MiB 的 GIF，即编码器默认 `--max-bytes`。编码器因大小拒绝时，先降 `--max-width`，再 `--colors` 或 `--fps`。文字可读条件下仍超限，则拆分：将同次证据运行连续、不重叠区间编码为编号分片，每片通过大小检查；一个视频用 `--start`、`--end`，截图用 `--pattern` 选连续子集。每片均验证产物。嵌入旁说明位置（如 `2/3`）及源区间或帧。

正文文件把每个 GIF 写成普通本地路径引用，与 `--attach` 路径相同；`gh` 原地改成上传 URL，保留位置及替代文本，所以正文引用顺序决定分片展示顺序：

```markdown
![<alt text>](<path/to/demo.gif>)
```

演示 PR 通常是发布目标。工具 PR 可嵌入另一 PR 的明确标记示例；命名来源 PR，以下每次检查都比较其实时 head。绝不把示例归为工具分支。

附加前立即重读演示 PR 实时 head，新演示 PR 则读已推分支顶端，与 GIF 旁记录提交比较。移动则停止重录。然后附加：

```sh
gh pr create --body-file <body.md> --attach <path/to/demo.gif>     # new pull request
gh pr edit <pr> --body-file <body.md> --attach <path/to/demo.gif>  # existing pull request
```

`--attach` 可重复，但拒绝同文件两次。所有分片在一次 `gh pr create` 或 `gh pr edit` 发布，每片一个 `--attach`，使一次前后实时 head 检查覆盖全部。正文未引用的 GIF 追加末尾，使用标志上的替代文本（`--attach '<path>#<alt text>'`）；重写引用保留正文替代文本。附加后再读演示实时 head，要求仍在记录提交。重读实时正文确认引用指向上传 URL，用 GitHub Markdown API 渲染并确认预期 `<img>`，取一次上传 URL 确认 `200` 及 `image/gif`。

### 已有素材分支

较早 PR 正文嵌入本仓库孤立 `*-assets` 分支的 GIF。绝不新增、删除、重写或强推这些分支；已合并 PR 正文引用它们的 URL。
