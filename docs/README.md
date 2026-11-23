# 项目文档

从要完成的任务进入。技能包维护完整执行方法和模板，文档提供使用入口、项目契约和维护说明。

## 安装与使用

| 需要做什么 | 阅读 |
| --- | --- |
| 安装、升级、预览或恢复技能 | [安装契约](usage/installation.md) |
| 选择独立的上游中文技能并了解运行依赖 | [上游独立中文技能](usage/upstream-skills.md) |
| 用 Herdr TUI 或 Core 启动 agent、派发任务、收取结果 | [Herdr 协作](usage/herdr-coordination.md) |

## 开发协作

| 需要做什么 | 阅读 |
| --- | --- |
| 判断开发阶段，组合需要的技能 | [开发流程](development/workflow.md) |
| 查明完整方法由哪个技能维护 | [开发方法归属](development/method-ownership.md) |
| 确认可交互原型并把确认结果交给实施 | [交互原型](development/prototype.md) |
| 保存开发现场、暂停或从交接继续 | [开发交接](development/handoff.md) |
| 将想法写成可认领 Issue，完善正文或追加评论 | [Issue 撰写与维护](development/issues.md) |
| 接入问题报告、分诊或持续任务 | [报告来源](development/issue-sources.md) |

## 运行运维

| 需要做什么 | 阅读 |
| --- | --- |
| 安装 ops，检查或维护多项目、多服务器 | [ops 使用说明](operations/overview.md) |
| 查清 ops 技能职责及运维与部署的交界 | [ops 方法归属](operations/method-ownership.md) |
| 验证记录工具、隔离 SSH 和运维场景 | [ops 验证](operations/validation.md) |

## 项目参考

| 需要了解什么 | 阅读 |
| --- | --- |
| 项目组件、安装器和运行包如何组织 | [项目架构](reference/architecture.md) |
| 原件、中文底稿和运行资源如何对应 | [资源组织](reference/resources.md) |
| 各领域的项目资料保存在哪，旧资料怎么迁移 | [领域持久化](reference/persistence-roots.md) |
| 怎样维护、归档和复用项目知识 | [知识与归档](reference/knowledge.md) |

## 仓库维护

| 需要做什么 | 阅读 |
| --- | --- |
| 核对仓库约束或同步上游来源 | [开发约束](maintenance/development-constraints.md) |
| 编写或整合技能 | [技能编写指南](maintenance/skill-authoring.md) |
| 检查入口预算、包资源或 Git hooks | [质量门禁](maintenance/skill-quality.md) |
| 选择验证命令、解释运行结果 | [验证指南](maintenance/validation.md) |
| 发布 npm、准备 GitHub Release 或恢复部分发布 | [发布指南](maintenance/release.md) |

贡献前阅读 [AGENTS.md](../AGENTS.md)。第三方来源和许可见[第三方声明](../THIRD_PARTY_NOTICES.md)，用户可见的版本变化见[更新记录](../CHANGELOG.md)。

## 维护文档

安装、技能入口、校验或发布行为发生变化时，在同一改动中更新对应正文和示例。文档移位时，更新总导航、仓内入链以及受影响的章节链接。一次任务的计划、调查、验证和验收证据放在 `.agents/dev/changes/<日期-主题>/`，长期知识放在 `.agents/dev/notes/`，发布操作说明与逐次结果放在 `.agents/dev/deploy/`。
