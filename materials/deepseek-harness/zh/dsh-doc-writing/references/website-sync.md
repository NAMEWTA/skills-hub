# 网站发布

## 概要

文档网站是经过测试的仓库 Markdown 投影，绝不是第二份副本。[website/docs.ts](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/website/docs.ts)是显式公开允许列表，[scripts/project-doc-site.ts](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/scripts/project-doc-site.ts)将映射来源重写进可丢弃的 `website/.generated/` 树，再由 VitePress 构建。构建还从同一清单，为每个路由输出原始 Markdown 对应文件和根 `llms.txt` 索引。本参考负责清单字段、投影器链接规则、预览与验证命令，以及部署边界。

## 目录

- [清单归属](#清单归属)
- [分类变更](#分类变更)
- [DocsPage 字段](#docspage-字段)
- [保留链接行为](#保留链接行为)
- [预览与验证](#预览与验证)
- [部署单独处理](#部署单独处理)
- [开发笔记](#开发笔记)

## 清单归属

修改清单前，阅读 [docs/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md) 和 [website/docs.ts](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/website/docs.ts) 中当前 `DocsPage` 类型及条目，不依赖记忆中的字段集。新增章节、侧栏集合、语言区域或顶层导航项前，阅读 [website/.vitepress/config.ts](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/website/.vitepress/config.ts)。编辑双语来源时，遵循 [docs/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md#writing-rules) 的轻量日常路径和[配对约定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/README.md)；绝不自动调用扩展翻译技能。

绝不编辑或提交 `website/.generated/`、`website/.cache/` 或 `website/.dist/`。除 `website/AGENTS.md` 外，不在 `website/` 下新增 Markdown；`website/zh-CN/`、`website/en/` 和 `website/api/` 等语言区域及路由目录都是无效源码布局。生成目录留在 `docs/`，在那里设置新鲜度门禁，再通过清单发布。

## 分类变更

- **编辑已发布页面：** 只修改规范 Markdown 来源。路由或导航元数据不变，就不碰清单。
- **发布新页面：** 在负责的 `docs/` 层创建，再增加一个清单条目。
- **重命名、移动或移除页面：** 原子更新规范文件、清单条目及仓库入链。移除过时清单条目；`docs:check` 拒绝缺失来源。
- **发布生成目录：** 映射生成的 `docs/` 文件，但修改生成器或来源元数据，不手改目录。
- **修改站点结构：** 普通页面更新清单；只有现有侧栏、章节或语言区域模型无法表达变化时，才更新 VitePress 配置。

清单保持显式公开允许列表。不要仅因 RFC、事后复盘、测试指南、`AGENTS.md` 或维护者流程存在于 `docs/` 就发布；只有用户明确扩大站点发布范围时才添加内部材料。

## DocsPage 字段

有意识地设置每个 `DocsPage` 字段。规范字段集及 `DocsSidebar` 联合位于 [website/docs.ts](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/website/docs.ts)，去那里阅读，不把值复制进文字；章节由该文件的 `sections` 记录负责，VitePress 配置没有单独顺序列表。

- `source`：仓库相对的规范 Markdown 路径。完整双语对通过 `pairedPages()` 添加英文 `.md` 路径；它推导同目录 `.zh.md`、内容语言区域及对应别名。
- `route`：包括 `.md` 后缀的公开 VitePress 路径。
- `label`：侧栏标签，不一定等于文档 H1。
- `sidebar`：复用已有 `DocsSidebar` 集合，除非信息架构确实需要另一个。
- `section`：尽可能复用已有章节。新增时也要在 `sections` 记录中定义。
- `order`：章节内稳定顺序。
- `sourceAliases`：可选的额外仓库路径，链接投影时应解析到本页。不创建另一个公开路由。

仅当来源有意在两种路由树中回退为同一种可用语言时，使用 `mirroredPages()`。对应语言新增后，改为 `pairedPages()`。站点路由树独立于来源布局：`foo.zh.md` 投影到根路由，`foo.md` 投影到匹配的 `/en/` 路由。

## 保留链接行为

规范文档中编写普通仓库相对 Markdown 链接。投影器应用以下规则：

- 清单内目标成为站点相对路由。
- 已存在但不在清单内的目标成为 GitHub 源码链接，包括支持的行号后缀。
- 图片是例外：文件被复制进生成树，并从那里引用，因此无论仓库可见性，站点都提供它。它必须是仓库内的常规文件。
- 外部 URL、站点绝对 URL、邮件及纯片段链接保持不变。
- 缺失的仓库相对目标导致投影失败，而非静默生成坏链接。
- 跨页片段以英文 GitHub 标题 ID 为规范 ID。人工标题生成不同 VitePress ID 时，在前方紧接着放显式 `<a id="..."></a>`；生成别名在负责生成器中添加。

不要仅为满足 VitePress 而把网站专用路由写入规范 Markdown。应解析到已映射索引页的目录式仓库链接，使用 `sourceAliases`。

## 预览与验证

编辑时运行本地预览：

```sh
pnpm docs:dev
```

开发服务器监视映射源文件并重新投影。修改清单后，新来源未被自动识别时重启。

认定映射有效前，运行聚焦网站门禁：

```sh
pnpm docs:check
```

Markdown 链接检查通过但站点构建报告缺失片段时，沿 `verify-doc-site-fragments` 的源和目标路径追踪。在人工 Markdown 或负责生成器中用显式别名保留英文 GitHub ID。

提交文档站点变更前运行：

```sh
pnpm run test:docs
pnpm run doc-sync
pnpm run lint
git diff --check
```

推送前用 [dsh-pre-push-checks](../../dsh-pre-push-checks/SKILL.md)。报告修改的规范文件、增删的清单条目、受影响公开路由及准确执行的检查。

## 部署单独处理

把内容同步进 VitePress 构建不等于发布到互联网。除非用户明确要求部署并确认托管政策，否则不增加 GitHub Pages 权限、部署工作流、自定义域名或公开托管。

## 开发笔记

无。
