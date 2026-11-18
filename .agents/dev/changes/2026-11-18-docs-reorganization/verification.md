# 文档目录重整与验证

## 路径映射

下表中的文件名都相对仓库的 `docs/` 目录。总导航仍为 `README.md`。

| 原有路径 | 新路径 |
| --- | --- |
| `installation.md` | `usage/installation.md` |
| `upstream-skills.md` | `usage/upstream-skills.md` |
| `herdr-coordination.md` | `usage/herdr-coordination.md` |
| `workflow.md` | `development/workflow.md` |
| `dev-method-ownership.md` | `development/method-ownership.md` |
| `dev-prototype.md` | `development/prototype.md` |
| `dev-handoff.md` | `development/handoff.md` |
| `issue-sources.md` | `development/issue-sources.md` |
| `ops.md` | `operations/overview.md` |
| `ops-method-ownership.md` | `operations/method-ownership.md` |
| `ops-validation.md` | `operations/validation.md` |
| `architecture.md` | `reference/architecture.md` |
| `resources.md` | `reference/resources.md` |
| `persistence-roots.md` | `reference/persistence-roots.md` |
| `knowledge.md` | `reference/knowledge.md` |
| `development-constraints.md` | `maintenance/development-constraints.md` |
| `skill-authoring.md` | `maintenance/skill-authoring.md` |
| `skill-quality.md` | `maintenance/skill-quality.md` |
| `validation.md` | `maintenance/validation.md` |
| `release.md` | `maintenance/release.md` |

`ops-evidence/` 的三个转接页已移除，ops 验证页直接引用现有归档。根导航、开发约定、材料导航和历史记录中的现行链接已改为新位置。旧路径在历史说明中仍作为当时的记录保留。 [总导航](../../../../docs/README.md) · [历史证据](../2026-11-17-doc-cleanup/evidence/README.md)

## 内容核对

- 对照仓库的安装器、技能清单和各技能入口，核对作用域、持久化目录、使用与迁移示例。验证命令以 `package.json`、`Makefile` 和实际维护脚本为准，发布与平台矩阵以 Actions 配置和发布脚本为准。
- 从 npm registry 只读查询并检查公开版 tarball。实际 `@latest` 为 `0.1.15`，包含 `system-herdr` 和 `zh-dashboard-design`。Core 技能可以从当前源码安装，文档引导 npm 用户先核对清单。
- 复用已经归档的历史全文，将一般验证入口集中到维护验证页。质量门禁保留预算、快照及 hooks 的独有规则。Herdr 的两种当前协作入口及其持久化目录均可从安装使用导航到达。

## 验证结果

- `npm run check` 和 `git diff --check` 通过。目录共 21 篇 Markdown，包含一份导航和 20 篇正文。正文均从总导航直接可达。另检查所有迁移文档及仓内受影响文档的本地链接和目标章节。
- 在空临时项目运行安装器帮助、版本、三个分组清单、13 个安装预览及两个退出码检查。所有预览和错误调用后目录仍为空。
- 核对本机 `hc 0.1.21`、`herdr 0.9.3` 的版本及 ops 隔离验收脚本的帮助。真实生产运维、模型任务、npm 发布和认证示例按当前实现校对，本次验证覆盖只读查询和安装预览。
