# 项目文档

skills-hub 管理可安装的中文 Agent Skills。阅读入口按你要完成的工作安排；运行方法在技能包内，本文档解释项目结构、使用契约和维护方式。

## 安装和使用

| 需要做什么 | 阅读 |
| --- | --- |
| 安装、更新、选择技能，处理备份或旧入口 | [安装契约](installation.md) |
| 使用保持独立的上游中文技能 | [上游独立技能](upstream-skills.md) |
| 选择开发阶段并组合技能 | [开发流程](workflow.md)与[开发方法归属](dev-method-ownership.md) |
| 保存开发现场或接续任务 | [开发交接](dev-handoff.md) |
| 用可交互 HTML 确认需求和体验 | [确认原型](dev-prototype.md) |
| 接入报告来源、分诊和 UI 修复 | [报告来源与持续任务](issue-sources.md) |
| 维护服务器、服务关系和运行历史 | [ops 使用说明](ops.md)与[方法归属](ops-method-ownership.md) |
| 在 Herdr 中派发任务和收取文件报告 | [Herdr 协作](herdr-coordination.md) |

## 理解架构

| 需要理解什么 | 阅读 |
| --- | --- |
| 两类技能、安装器、来源材料和项目资料如何分工 | [项目架构](architecture.md) |
| 原件、中文对照与运行资源如何对应 | [资源组织](resources.md) |
| `.agents/` 的领域目录、托管模板和迁移边界 | [持久化目录](persistence-roots.md) |
| 哪些知识长期保留、如何归档任务 | [知识与归档](knowledge.md) |

## 开发和发布

| 维护任务 | 阅读 |
| --- | --- |
| 修改技能、增加领域或同步上游 | [开发约束](development-constraints.md) |
| 编写入口、模板和包内引用 | [技能编写](skill-authoring.md) |
| 核对元数据、入口预算、资源和 hooks | [质量规则](skill-quality.md) |
| 选择检查命令并解释验证结果 | [验证指南](validation.md)；ops 的专项方法见 [ops 验证](ops-validation.md) |
| 发布 npm 包、完成 GitHub Release 或恢复部分发布 | [发布指南](release.md) |

贡献前先读仓库 [AGENTS.md](../AGENTS.md)。第三方来源、署名、许可和改造声明统一见 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)；具体版本的交付说明见 [CHANGELOG.md](../CHANGELOG.md)。

## 文档职责

`docs/` 保存当前架构、接口、使用和维护规范。改动产品行为时同步更新相关契约；保留仍有使用价值的迁移方法，修复路径及重要章节锚点。

一次变更的计划、调查、验证日志和验收证据放在 `.agents/dev/changes/<日期-主题>/`。长期项目知识放在 `.agents/dev/notes/`；环境操作说明和每次发布结果放在 `.agents/dev/deploy/`。这些记录引用当前文档，不把一次运行结果写成所有版本都成立的能力声明。
