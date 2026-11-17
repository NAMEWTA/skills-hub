# 上游独立中文技能

把值得保留的完整技能放进 `upstream-skills/`，让它们保持独立，直接安装。`skills/` 继续维护 dev、ops、system 等已整合的领域。来源映射与本地适配可以同时存在：映射回答“从哪里来”，运行版回答“现在怎样使用”。

## 当前可安装内容

| 安装名 | 对应原技能 | 用途 |
| --- | --- | --- |
| [zh-archify](../upstream-skills/zh-archify/SKILL.md) | tt-a1i/archify 的 `archify` | 架构、流程、时序、状态、ERD 等交互图，以及单页解释；保留渲染器、模板、示例、字体与校验工具 |
| [zh-modern-web-guidance](../upstream-skills/zh-modern-web-guidance/SKILL.md) | GoogleChrome/modern-web-guidance 的 `modern-web-guidance` | HTML、CSS、客户端 JavaScript 的现代 Web 实践与指南检索 |
| [zh-chrome-extensions](../upstream-skills/zh-chrome-extensions/SKILL.md) | 同一 Google 仓库的 `chrome-extensions` | Chrome 扩展开发、Manifest V3、权限、存储、消息和发布检查 |

Google 仓库提供的是两个技能，HTML、CSS、JavaScript 等是其中的知识主题，不各建一个安装包，也不按 GitHub 语言统计创建 domain。

## 安装和 TUI

在需要使用技能的项目根目录运行：

```sh
# 打开 TUI
npx @namewta/skills-hub@0.1.11

# 一次安装整个上游独立技能分组
npx @namewta/skills-hub@0.1.11 install --domain upstream-skills

# 只安装一个中文技能
npx @namewta/skills-hub@0.1.11 install --skill zh-archify

# 混合安装自有技能和上游中文技能
npx @namewta/skills-hub@0.1.11 install --skill dev-architecture zh-archify zh-modern-web-guidance

# 先预览
npx @namewta/skills-hub@0.1.11 install --domain upstream-skills --dry-run
```

TUI 显示 `upstream-skills（上游独立技能）`。选中分组即选中全部子项，也可只勾某个 `zh-*`，或者与其他领域混选。直接输入 `archify`、`zh-archify`、`上游` 或中文用途搜索；Tab 勾选，方向键移动/翻页，Enter 查看确认。搜索和翻页不会清空已选项。预览、取消、备份替换、失败回滚与已有领域共用同一套安装逻辑。

| 仓库文件夹 | 安装位置 |
| --- | --- |
| `skills/dev/dev-architecture/` | `.agents/skills/dev-architecture/` |
| `upstream-skills/zh-archify/` | `.agents/skills/zh-archify/` |
| `upstream-skills/zh-modern-web-guidance/` | `.agents/skills/zh-modern-web-guidance/` |
| `upstream-skills/zh-chrome-extensions/` | `.agents/skills/zh-chrome-extensions/` |

这里的 `--domain upstream-skills` 是安装分组选项。它不声明共同工作流，不创建 `.agents/upstream-skills/`，也不改变 Archify 自己的产物目录。上游原名与 `zh-` 名称可以并存，但要由用户选择适用入口，安装器不会自动删除已有原版。

Agent 是否自动发现 `.agents/skills/` 仍由宿主决定；支持显式技能调用的工具可以调用 `$zh-archify` 等名称，不支持时直接读取对应 `SKILL.md`。

## 三份内容各自做什么

| 位置 | 角色 | 是否安装 |
| --- | --- | --- |
| `materials/<来源>/upstream/` | 固定来源提交的完整选定子树，保留原名、字节与执行位 | 否 |
| `materials/<来源>/zh/` | 同路径中文底稿；程序、示例代码、资产与法律文件按清单保留原字节 | 否 |
| `upstream-skills/zh-<原名>/` | 实际使用的中文技能，允许必要适配 | 是 |

不用额外的构建目录、自动生成层或另一份技能注册表。安装器直接扫描 `skills/` 与 `upstream-skills/`。两个安装根中的技能名必须全局唯一；独立上游包的目录与 frontmatter `name` 都必须使用 `zh-` 前缀。

当前来源是 Archify 的 `archify/` 完整子树和 Google 仓库的 `skills/` 完整子树；没有把来源仓库的 `.git`、CI 或开发缓存塞进安装包。版本身份见[父清单](../materials/manifest.tsv)，逐文件关系见 [Archify 清单](../materials/archify/manifest.tsv)和 [Google 清单](../materials/modern-web-guidance/manifest.tsv)。

## 可以怎样改

可翻译说明、调整触发描述、添加宿主使用说明、修改必要的路径与自身调用名，也可以根据真实使用问题适配行为。原有步骤、判断、表格、示例和失败条件优先完整保留，具体差异记入清单的 `adaptation`。

不要因为技能改名，就把真正执行的 `modern-web-guidance` npm 命令、`archify.mjs` 文件名、JSON 字段或指南 ID 一并改名。程序和示例代码中的英文注释、业务字符串与 schema 描述目前按原字节保留，不将它们冒称已经翻译。可读 Markdown 说明全文中文化；中文标题保留原英文锚点，避免旧章节链接失效。

独立包保留上游必要 metadata、外部服务引用、工具和自己的许可，不套用自有领域技能的去来源规则或入口字数预算。仓库维护脚本仍用 Node.js；保留上游工具并不授权在安装时执行它。安装器只复制文件。

## 运行前提与中文边界

**Archify** 的本地 Node 工具、渲染资源与示例随包安装。完整 `finalize` 包含真实浏览器检查，需要可启动的 Chrome/Chromium。浏览器无法启动时应报告失败，不能把仅生成 HTML 说成四项门禁全部通过。上游更新提示用于告知原版版本；更新中文包应使用 skills-hub 的安装命令，避免用原版更新覆盖中文适配。

**Modern Web Guidance** 的入口和随包静态指南是中文；搜索、检索与版本检查仍调用上游的 `npx -y modern-web-guidance@latest ...`，首次获取通常需要网络。CLI 返回的是它当时提供的最新资料，可能为英文。先遵循原有 search/retrieve 与策略门禁，允许检索后可按相同指南 ID 阅读本地中文对照；与最新结果冲突时以本次 CLI 结果为准，向用户用中文解释。本地译文不是绕过版本或浏览器支持策略检查的离线替代入口。

**Chrome Extensions** 的入口与配套扩展参考资料是中文，真实 Chrome API 名称、Manifest 字段和代码示例保留。制作扩展所需的浏览器与测试环境由实际任务决定，安装技能不等于已经安装这些环境。

三个独立包都随自身目录携带适用法律文本和来源/修改说明。项目 MIT 不替代上游 Apache、CC BY、字体或图标的原许可。完整范围见[第三方声明](../THIRD_PARTY_NOTICES.md)。

## 后续新增和更新

新增时只做四件事：固定来源提交、完整保留所选技能与依赖资源、翻译并放入 `upstream-skills/zh-*`、在现有父子 TSV 中登记逐文件映射。文件夹中有合法 `SKILL.md` 后，CLI 和 TUI 会自动发现它，无需再改一份列表。

更新时使用[已有资料同步命令](../materials/README.md#显式同步预览准备应用)，只选择目标来源。同步工具更新资料并报告受影响的 `runtime_paths`，不会覆盖实际 `zh-*` 运行包。之后对照旧原件、新原件与当前适配，合并需要的变化并保留本地改动；实际核对后才更新 `runtime_reviewed_blob`。

检查命令：

```sh
npm run check:full
npm run check:package
# 有 Chrome/Chromium 的环境额外检查已安装 Archify 的完整 finalize
npm run check:upstream
```

当两个上游技能后来确实形成长期协作体系时，再考虑整合进新的业务 domain。当前按各自用途选择即可。
