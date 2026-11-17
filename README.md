# skills-hub

按领域和独立技能分组组织的中文 Agent Skills，覆盖软件开发、系统维护、服务器运维和专门工具。每个技能包含使用入口、完整方法及所需模板、示例和脚本，可以单独安装，也可以按任务组合使用。

## 安装

需要 Node.js 22.14+。在要使用技能的项目根目录运行：

```sh
# 打开交互选择界面
npx @namewta/skills-hub

# 查看当前技能
npx @namewta/skills-hub list

# 安装整个开发分组
npx @namewta/skills-hub install --domain dev

# 混选开发技能和独立中文技能
npx @namewta/skills-hub install --skill dev-prototype zh-archify

# 单独安装仪表盘设计中文技能
npx @namewta/skills-hub install --skill zh-dashboard-design

# 安装前预览
npx @namewta/skills-hub install --domain upstream-skills --dry-run
```

交互界面支持按名称、分组或中文用途搜索，整组选择和跨组混选。使用 ↑/↓ 移动、←/→ 翻页、Tab 勾选、Enter 确认；搜索和翻页保留已选项。非交互环境使用带 `--domain`、`--skill` 或 `--all` 的安装命令。

技能安装到当前项目的 `.agents/skills/<技能名>/`。重复安装时，相同内容保持不变，有差异的同名技能先备份再替换。安装器只复制文件，不执行技能中的工具；技能是否自动加载由所用 Agent 决定，也可以直接读取对应的 `SKILL.md`。

全局命令、源码离线安装、备份恢复和旧版本迁移见[安装说明](docs/installation.md)。

## 选择技能

| 分组 | 用途 | 常用入口 |
| --- | --- | --- |
| `dev` | 需求澄清、设计、原型、计划、实现、验证、交付和项目知识 | [dev-help](skills/dev/dev-help/SKILL.md)、[dev-workflow](skills/dev/dev-workflow/SKILL.md) |
| `system` | 主机检查、磁盘清理、代理、软件配置和终端协作 | [system-inspect](skills/system/system-inspect/SKILL.md) |
| `ops` | 多项目、多服务器与共享服务的巡检、维护、恢复和操作历史 | [ops-workflow](skills/ops/ops-workflow/SKILL.md) |
| `upstream-skills` | 保持独立结构的一对一中文技能 | 下表中的 `zh-*` 技能 |

开发任务可以从 `dev-workflow` 开始，也可以直接选择当前需要的方法。例如，`dev-prototype` 把已收敛的需求变成可操作 HTML，`dev-build` 实现真实功能，`dev-handoff` 保存现场或接续工作。各技能沿用同一任务和证据，完整方法各维护一份。

容易混淆的开发入口按希望获得的结果选择：

| 需要的结果 | 技能 |
| --- | --- |
| 把散落材料整理成目标、事实、范围与缺口 | `dev-intake`：需求整理 |
| 逐层解决尚未确定的产品取舍 | `dev-grill`：决策访谈 |
| 补齐可独立实施、审查与验收的行为约定 | `dev-spec`：行为规格 |
| 改写请求的表达、目标、材料和验证方式 | `dev-sharpen`：请求改写 |
| 对报告分类、查重和分流 | `dev-issue-triage` |
| 创建或跟进 PR、合并已验证改动；或发布到指定环境 | `dev-deploy`：PR 交付与环境部署两个分支 |
| 编写项目技能；或从授权记录提炼稳定工作偏好 | `dev-personalize`：技能编写与偏好提炼两个分支 |

这些入口按需调用。当前负责人沿用同一份权威行为契约、决定记录和有效证据，已有充分结果直接继续；可视化原型仍独立作为体验依据。完整边界见[开发流程](docs/workflow.md)。

```text
使用 dev-prototype：读取这个需求的规格和设计，沿用项目风格，
把完整用户旅程做成可操作的 HTML，让我体验并确认。

使用 ops-workflow：检查两个项目共用服务的健康和容量，
先只读核对实际部署关系，再给出需要处理的事项。
```

独立中文技能可逐项安装，也可用 `install --domain upstream-skills` 安装整组：

| 技能 | 用途 |
| --- | --- |
| [zh-archify](upstream-skills/zh-archify/SKILL.md) | 架构、流程、时序、状态、ERD 等交互图和单页解释 |
| [zh-modern-web-guidance](upstream-skills/zh-modern-web-guidance/SKILL.md) | HTML、CSS、客户端 JavaScript 的现代 Web 实践与指南检索 |
| [zh-chrome-extensions](upstream-skills/zh-chrome-extensions/SKILL.md) | Chrome 扩展、Manifest V3、权限、存储、消息和发布检查 |
| [zh-dashboard-design](upstream-skills/zh-dashboard-design/SKILL.md) | 数据仪表盘的 KPI、图表、热力图、响应式布局、SwiftUI 与截图 QA |

`upstream-skills` 只是安装分组，各技能按自身用途工作。中文说明与原版保持对应，代码、API、文件名和可执行命令保留。Archify 的完整交付检查需要 Chrome/Chromium；Modern Web Guidance 仍通过原 CLI 检索最新资料，返回内容可能是英文。运行前提与中文范围见[上游独立技能说明](docs/upstream-skills.md)。

## 项目结构

| 位置 | 内容 |
| --- | --- |
| `skills/<domain>/<domain>-xxx/` | 按职责整合的开发、系统和运维技能 |
| `upstream-skills/zh-<原名>/` | 与原技能一一对应的独立中文运行包 |
| `materials/` | 固定版本的来源原件、中文对照和逐文件运行映射 |
| `docs/` | 使用说明、架构解释和维护规范 |
| `scripts/`、`tests/` | 安装支持、维护工具和验证代码 |

安装器直接扫描两个运行根，完整复制所选技能的 `SKILL.md`、`references/`、`assets/`、`scripts/` 和其他配套资源。安装后所有技能位于 `.agents/skills/` 同一层级。`materials/` 供维护时对照，不参与技能发现或安装。

使用技能产生的项目资料按领域保存：开发资料位于 `.agents/dev/`，系统维护资料位于 `.agents/system/<主机标识>/`，运维资料位于 `.agents/ops/`。选择相关技能时，安装器维护对应的简短目录导航，业务记录按任务创建。独立上游分组不创建 `.agents/upstream-skills/`。详见[领域持久化与迁移](docs/persistence-roots.md)。

## 文档导航

| 要完成的事 | 阅读入口 |
| --- | --- |
| 浏览完整文档、理解项目结构 | [文档导航](docs/README.md)、[架构设计](docs/architecture.md) |
| 安装、升级、恢复备份或迁移旧包 | [安装说明](docs/installation.md) |
| 组合开发技能，处理原型与交接 | [开发流程](docs/workflow.md)、[可交互原型](docs/dev-prototype.md)、[开发交接](docs/dev-handoff.md) |
| 维护服务器和项目运行关系 | [运维说明](docs/ops.md) |
| 使用和更新独立中文技能 | [上游独立技能](docs/upstream-skills.md) |
| 理解技能归属和资源组织 | [开发方法归属](docs/dev-method-ownership.md)、[资源组织](docs/resources.md) |
| 维护项目知识和记录位置 | [领域持久化](docs/persistence-roots.md)、[知识与记忆](docs/knowledge.md) |
| 修改仓库、编写技能或文档 | [开发约定](AGENTS.md)、[技能编写指南](docs/skill-authoring.md) |
| 检查质量和发布版本 | [质量门禁](docs/skill-quality.md)、[版本发布](docs/release.md) |
| 查看版本变化 | [更新记录](CHANGELOG.md) |

## 致谢与许可

项目许可、第三方来源、贡献者归属与适用法律文本统一见[第三方声明](THIRD_PARTY_NOTICES.md)。
