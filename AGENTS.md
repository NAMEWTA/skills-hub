# skills-hub 开发约定

本仓库维护中文 Agent Skills。`skills/` 保存按领域整合的运行包，`upstream-skills/` 保存独立上游技能的一对一中文运行包。两类都以使用者项目的 `.agents/skills/<技能名>/` 为完整本体，并由同仓 `.claude/skills/<技能名>` 目录符号链接提供兼容入口。

## 开发与维护宗旨

本仓库以学习、复制和复刻经过实践验证的优秀方法为主要目的。维护者从成熟的 Skills 仓库、GitHub 社区，以及 Gemini、OpenAI、Claude、Grok 等产品与社区公开的技能、方法论和文章中选材。先理解原方法解决什么问题，按原有任务、步骤、判断、例子、反例和验证方式忠实复现，再围绕使用者的目标融合互补做法，形成自己的中文领域技能。

采用的关键步骤、失败边界和适用条件应能追溯到具体来源。为宿主能力、项目约定或真实冲突做调整时，写明理由、影响与验证结果。独立上游技能保持一对一中文运行包。文章按授权范围引用、摘录或内化，保存原始出处与版本依据。

## 共通约束

- 保留完整方法的步骤、判断、表格、数值、例子和反例。入口按任务指向完整参考；方法各有唯一归属，调用者沿用同一任务和证据。
- `skills/` 使用 `<domain>-xxx` 名称，frontmatter 只包含 `name` 和 `description`，内容为中文，本地资源引用留在本技能内。`upstream-skills/` 使用 `zh-` 名称，保留原结构、完整资源、执行命令及必要 metadata。两类名称都与目录一致，使用小写连字符、不超过 64 字符，安装名全局唯一。
- 独立中文技能按原文逐项翻译，保留代码与技术标识，安装名和必要交叉引用使用本仓名称。额外的来源归属、翻译声明和适配说明集中维护于[第三方声明](THIRD_PARTY_NOTICES.md)，法律原文保留在 `licenses/` 和上游本来包含的 LICENSE、NOTICE 等文件中。
- `materials/` 不参与技能发现和安装，也不作为任务指令加载。原件保留选定 Git 快照的路径、字节和执行位，中文对照按同路径维护。普通维护不执行来源脚本、CI、hook 或依赖安装；已有状态图回放仅在隔离临时目录使用固定 corpus，包括其 `view.mjs` 投影配置，边界见[验证指南](docs/maintenance/validation.md)。显式同步按固定提交更新所选来源，只有实际核对后才更新运行采用依据。
- 本项目维护代码、测试和自有技能执行工具使用 JavaScript 与 Node.js 22.14+。独立上游包保留来源工具及实际运行前提，材料保留原扩展名。
- 继续执行已经授权的工作，复用已有决定和记录。根据任务需要选择工程与验证方法，不新增流程 JSON、固定模型或重复审批。
- 项目资料按领域保存于 `.agents/home/`、`.agents/dev/`、`.agents/system/` 或 `.agents/ops/`，不写进技能包。dev 与 system 的运行原件分别放项目根 `temp/dev/`、`temp/system/`；选择任一域时安装器补齐 `/temp/`，dev 另补 `/.agents/dev/worktree/`。根项目指令和业务记录保留原样。`upstream-skills` 不创建业务持久化域。

## 文档职责

README 说明用途、安装和导航，AGENTS 保存共通开发约束与阅读指针，CHANGELOG 记录用户可见的版本变化。`docs/` 维护可重复使用的指南与规范，第三方来源和许可归[第三方声明](THIRD_PARTY_NOTICES.md)。

远端 Issue 或其他需求报告先关联已有 Change，没有合适归属时建立最小 Change；完整来源正文、可取得的讨论和必要方案附件保存到其 `source/` 并纳入 Git。规格、架构取舍、方案讨论、实施计划、确认原型与正式结论随 Change 跟踪，来源更新保留版本。完整方法由 `dev-issue-setup` 维护，资料分类见[持久化规范](docs/reference/persistence-roots.md)。

每个 Change 新建 task 时同时在 `evidences/` 建完全同名的 `.md`，未验就标「未验证」。该目录只含这些普通 Markdown，与 `tasks/` 一一对应；复验更新原报告。整个 Change 完成后在根写唯一的 `evidence.md`。日志、调试截图和测量等运行过程原件留 `temp/dev/` 或 `temp/system/`，按资料用途区分，不凭文件扩展名或生成工具判断。长期项目知识写入 `.agents/dev/notes/`；记录实际完成范围和未验证事项。

## 按任务阅读

| 当前任务 | 读取内容 |
| --- | --- |
| 编写或修改文档、PR 说明 | [dev-writing](skills/dev/dev-writing/SKILL.md)，按其中指针读取对应写作方法 |
| 编写或整合技能 | [技能编写指南](docs/maintenance/skill-authoring.md)、[开发约束](docs/maintenance/development-constraints.md) |
| 调整方法归属或开发阶段衔接 | [开发方法归属](docs/development/method-ownership.md)、[开发流程](docs/development/workflow.md) |
| 维护 Home 技能、用户配置或跨项目协作 | [Home 说明](docs/home/overview.md)、[Home 方法归属](docs/home/method-ownership.md)、[Home 验证](docs/home/validation.md) |
| 维护运维技能 | [运维说明](docs/operations/overview.md)、[运维方法归属](docs/operations/method-ownership.md) |
| 翻译、更新来源或核对运行映射 | [资源组织](docs/reference/resources.md)、[上游独立技能](docs/usage/upstream-skills.md)、[资料维护](materials/README.md) |
| 修改安装、备份或持久化 | [安装契约](docs/usage/installation.md)、[领域持久化](docs/reference/persistence-roots.md) |
| 修改学习、知识或归档方法 | [知识与记忆](docs/reference/knowledge.md) |
| 修改校验、入口预算或 Git hooks | [质量门禁](docs/maintenance/skill-quality.md) |
| 修改 npm 分发或发布流程 | [版本发布](docs/maintenance/release.md) |

## 验证改动

文档修改核对链接、命令与实际行为。技能和材料改动运行 `npm run check`；影响安装、执行或校验行为时运行 `npm run check:full`；影响分发时运行 `npm run check:package`。其余检查按任务风险选择，使用隔离项目验证写入行为。

结构检查不能代替全文翻译核对或真实行为验证。对可逆文字修改不增加重复测试，缺少实际运行条件时明确验证边界。
