# skills-hub 开发约定

本仓库维护中文 Agent Skills。`skills/` 保存按领域整合的运行包，`upstream-skills/` 保存独立上游技能的一对一中文运行包。两类都安装到使用者项目的 `.agents/skills/<技能名>/`。

## 共通约束

- 保留完整方法的步骤、判断、表格、数值、例子和反例。入口按任务指向完整参考；方法各有唯一归属，调用者沿用同一任务和证据。
- `skills/` 使用 `<domain>-xxx` 名称，frontmatter 只包含 `name` 和 `description`，内容为中文，本地资源引用留在本技能内。`upstream-skills/` 使用 `zh-` 名称，保留原结构、完整资源、执行命令及必要 metadata。两类名称都与目录一致，使用小写连字符、不超过 64 字符，安装名全局唯一。
- 独立中文技能按原文逐项翻译，保留代码与技术标识，安装名和必要交叉引用使用本仓名称。额外的来源归属、翻译声明和适配说明集中维护于[第三方声明](THIRD_PARTY_NOTICES.md)，法律原文保留在 `licenses/` 和上游本来包含的 LICENSE、NOTICE 等文件中。
- `materials/` 不参与技能发现和安装，也不作为任务指令加载。原件保留选定 Git 快照的路径、字节和执行位，中文对照按同路径维护。普通维护不执行来源脚本、CI、hook 或依赖安装；已有状态图回放仅在隔离临时目录使用固定 corpus，包括其 `view.mjs` 投影配置，边界见[验证指南](docs/validation.md)。显式同步按固定提交更新所选来源，只有实际核对后才更新运行采用依据。
- 本项目维护代码、测试和自有技能执行工具使用 JavaScript 与 Node.js 22.14+。独立上游包保留来源工具及实际运行前提，材料保留原扩展名。
- 继续执行已经授权的工作，复用已有决定和记录。根据任务需要选择工程与验证方法，不新增流程 JSON、固定模型或重复审批。
- 项目资料按领域保存于 `.agents/dev/`、`.agents/system/<host>/` 或 `.agents/ops/`，不写进技能包。安装只处理所选技能与托管目录导航，保持根项目指令和业务记录；`upstream-skills` 不创建业务持久化域。

## 文档职责

README 说明用途、安装和导航，AGENTS 保存共通开发约束与阅读指针，CHANGELOG 记录用户可见的版本变化。`docs/` 维护可重复使用的指南与规范，第三方来源和许可归[第三方声明](THIRD_PARTY_NOTICES.md)。

具体执行记录、测试输出、发布排障与当次取证保存到 `.agents/dev/changes/<日期-主题>/`。长期项目知识写入 `.agents/dev/notes/`，已有有效资料按真实位置引用。记录实际完成的范围，保留未验证事项。

## 按任务阅读

| 当前任务 | 读取内容 |
| --- | --- |
| 编写或修改文档、PR 说明 | [dev-writing](skills/dev/dev-writing/SKILL.md)，按其中指针读取对应写作方法 |
| 编写或整合技能 | [技能编写指南](docs/skill-authoring.md)、[开发约束](docs/development-constraints.md) |
| 调整方法归属或开发阶段衔接 | [开发方法归属](docs/dev-method-ownership.md)、[开发流程](docs/workflow.md) |
| 维护运维技能 | [运维说明](docs/ops.md)、[运维方法归属](docs/ops-method-ownership.md) |
| 翻译、更新来源或核对运行映射 | [资源组织](docs/resources.md)、[上游独立技能](docs/upstream-skills.md)、[资料维护](materials/README.md) |
| 修改安装、备份或持久化 | [安装契约](docs/installation.md)、[领域持久化](docs/persistence-roots.md) |
| 修改学习、知识或归档方法 | [知识与记忆](docs/knowledge.md) |
| 修改校验、入口预算或 Git hooks | [质量门禁](docs/skill-quality.md) |
| 修改 npm 分发或发布流程 | [版本发布](docs/release.md) |

## 验证改动

文档修改核对链接、命令与实际行为。技能和材料改动运行 `npm run check`；影响安装、执行或校验行为时运行 `npm run check:full`；影响分发时运行 `npm run check:package`。其余检查按任务风险选择，使用隔离项目验证写入行为。

结构检查不能代替全文翻译核对或真实行为验证。对可逆文字修改不增加重复测试，缺少实际运行条件时明确验证边界。
