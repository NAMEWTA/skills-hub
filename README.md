# skills-hub

按领域和独立技能分组组织的中文 Agent Skills，覆盖个人 Home、软件开发、系统维护、服务器运维和专门工具。每个技能包含使用入口、完整方法及所需模板、示例和脚本，可以单独安装，也可以按任务组合使用。

## 安装

需要 Node.js 22.14+。在要使用技能的项目根目录运行：

```sh
# 打开交互选择界面
npx @namewta/skills-hub

# 查看当前技能
npx @namewta/skills-hub list

# 安装整个开发分组
npx @namewta/skills-hub install --domain dev

# 构建、运营和管理个人 Home Repo
npx @namewta/skills-hub install --domain home

# 单独安装 Issue 撰写与维护技能
npx @namewta/skills-hub install --skill dev-issue

# 混选开发技能和独立中文技能
npx @namewta/skills-hub install --skill dev-prototype zh-archify

# 从 npm 发布版本安装仪表盘设计中文技能
npx @namewta/skills-hub@0.1.16 install --skill zh-dashboard-design

# 从源码安装 Herdr Core 技能，替换安装器路径
node /path/to/skills-hub/install.mjs install --skill system-herdr-core

# 安装前预览
npx @namewta/skills-hub install --domain upstream-skills --dry-run
```

交互界面默认勾选当前项目已安装的技能。使用 ↑/↓ 移动、Tab 展开或收拢领域、空格勾选、←/→ 翻页，按 Enter 查看安装确认。按 `/` 可搜索名称、分组或中文用途。非交互环境使用带 `--domain`、`--skill` 或 `--all` 的安装命令。

技能的完整本体安装到当前项目的 `.agents/skills/<技能名>/`，并尝试建立 `.claude/skills/<技能名>` 到该本体的目录符号链接。两个入口读取同一份资源。Windows 创建链接遇到 `EPERM` 时，安装器继续安装技能，并提示如何补建链接。重复安装会保留相同的本体并尝试补齐缺失链接，有差异的同名本体先备份再替换。入口位置有用户文件、目录或错向链接时会报告冲突。技能由实际宿主发现，也可显式读取 `SKILL.md`。安装过程中技能工具不会运行。

全局命令、源码离线安装、备份恢复和旧版本迁移见[安装说明](docs/usage/installation.md)。

## 选择技能

| 分组 | 用途 | 常用入口 |
| --- | --- | --- |
| `home` | Home 初始化、项目登记、团队配置、项目派遣与任务跟踪、持久知识和历史 | [home-workflow](skills/home/home-workflow/SKILL.md)、[home-setup](skills/home/home-setup/SKILL.md)、[home-tasks](skills/home/home-tasks/SKILL.md) |
| `dev` | 需求澄清、设计、原型、计划、实现、验证、交付和项目知识 | [dev-help](skills/dev/dev-help/SKILL.md)、[dev-workflow](skills/dev/dev-workflow/SKILL.md) |
| `system` | 主机检查、磁盘清理、代理、软件配置和终端协作 | [system-inspect](skills/system/system-inspect/SKILL.md) |
| `ops` | 多项目、多服务器与共享服务的巡检、维护、恢复和操作历史 | [ops-workflow](skills/ops/ops-workflow/SKILL.md) |
| `upstream-skills` | 保持独立结构的一对一中文技能 | 下表中的 `zh-*` 技能 |

开发任务可以从 `dev-workflow` 开始，也可以直接选择当前需要的方法。多个已有 Change 要统一推进时，用 [dev-program](skills/dev/dev-program/SKILL.md) 整理依赖和可直接交给 Goal 的批次计划。例如，`dev-prototype` 把已收敛的需求变成可操作 HTML，`dev-build` 实现真实功能，`dev-handoff` 保存现场或接续工作。各技能沿用同一任务和证据，完整方法各维护一份。

容易混淆的开发入口按希望获得的结果选择：

| 需要的结果 | 技能 |
| --- | --- |
| 把想法、Bug 或优化写成可认领 Issue，更新正文或追加评论 | `dev-issue`：Issue 撰写与维护 |
| 把散落材料整理成目标、事实、范围与缺口 | `dev-intake`：需求整理 |
| 逐层解决尚未确定的产品取舍 | `dev-grill`：决策访谈 |
| 补齐可独立实施、审查与验收的行为约定 | `dev-spec`：行为规格 |
| 改写请求的表达、目标、材料和验证方式 | `dev-sharpen`：请求改写 |
| 对报告分类、查重和分流 | `dev-issue-triage` |
| 创建、跟进或合并 PR，推进独立或堆叠队列 | `dev-pr` |
| 发布指定版本到某个环境，核对服务或回滚 | `dev-deploy` |
| 编写或修改项目技能 | `dev-skill-authoring` |
| 从授权记录提炼稳定工作偏好 | `dev-personalize` |
| 书面汇报进展 / 明确要求制作进展视频 | `dev-status` / `dev-status-video` |

这些入口按需调用。当前负责人沿用同一份权威行为契约、决定记录和有效证据，已有充分结果直接继续；可视化原型仍独立作为体验依据。完整边界见[开发流程](docs/development/workflow.md)。

```text
使用 dev-issue：研究目标仓库，把这个想法写成可直接认领的完整 Issue 并发布。
给出现状证据、需求、实施任务、验收标准和完整参考地址。

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

`upstream-skills` 只是安装分组，各技能按自身用途工作。中文说明与原版保持对应，代码、API、文件名和可执行命令保留。Archify 的完整交付检查需要 Chrome/Chromium；Modern Web Guidance 仍通过原 CLI 检索最新资料，返回内容可能是英文。运行前提与中文范围见[上游独立技能说明](docs/usage/upstream-skills.md)。

## 个人 Home Repo

在自己的 Home 仓库安装 `home` 后，可以直接要求“把这里作为我的 Home，管理这些项目，沿用当前派遣方式”，也可用 `$home-setup 初始化 Home`。完整初始化建立 Git 白名单、合并根短入口、登记已有 clone，并沿用或补齐已选派遣方式与 Home team。只发 `$home-setup` 会先检查状态，由用户选择操作。`home-workflow` 用所选方式派发任务，`home-tasks` 保存直接任务、回执和项目状态。

九个 Home 技能都从 `.agents/home/AGENTS.md` 按需读取资料。重装只更新明确标记的基础区，保留区外长期约定和知识指针；未标记自定义或损坏入口先报告冲突。`home-knowledge` 维护入口规范及可选 `SOUL.md`，已有 profile/preferences 保持唯一职责。安装只初始化本次所选 domain，单选 Home 不预建其他业务域。实际宿主的技能发现、入口加载和模型执行分别验证。

Home 了解各项目基本背景和管理关系。涉及项目内部知识、代码、技能或验证时，由当地 Agent 进入实际项目读取和完成；项目可继续依当地规则派遣子 Agent。每层派遣记录归当地所选技能，Home 保留管理摘要与证据指针。Home 的现行知识、历史事件和当前执行状态各有明确位置，可由新会话读取普通 Markdown 接续。

```text
初始化我的 Home，登记这些已有项目。默认用当前宿主原生派遣，每个项目安排一位负责人。
向项目 A 查询接口约定，让项目 B 验证兼容性，回报各自版本和证据。
查看项目 A 当前有哪些 Home 任务、哪些还在等派发。
查明当时为什么选择这个方案，再指出当前知识是否已经更正。
记住这个已经确认的管理约定，下次按它处理。这次的临时简短回复不用改默认。
```

完整用法、方法归属和验证边界见 [Home 说明](docs/home/overview.md)。

## 项目结构

| 位置 | 内容 |
| --- | --- |
| `skills/<domain>/<domain>-xxx/` | 按职责整合的 Home、开发、系统和运维技能 |
| `upstream-skills/zh-<原名>/` | 与原技能一一对应的独立中文运行包 |
| `materials/` | 固定版本的来源原件、中文对照和逐文件运行映射 |
| `docs/` | 使用说明、架构解释和维护规范 |
| `scripts/`、`tests/` | 安装支持、维护工具和验证代码 |

安装器直接扫描两个运行根，完整复制所选技能的 `SKILL.md`、`references/`、`assets/`、`scripts/` 和其他配套资源。安装后所有技能位于 `.agents/skills/` 同一层级。`materials/` 供维护时对照，不参与技能发现或安装。

项目资料按领域保存：Home 在 `.agents/home/`，开发在 `.agents/dev/`，系统维护在 `.agents/system/`，运维在 `.agents/ops/`。远端 Issue 的完整正文、讨论和必要方案附件归所属 Change 的 `source/`，设计、计划、确认原型及正式结论随 Change 跟踪。安装 dev 或 system 技能时，安装器补根 `.gitignore` 的 `/temp/`；执行日志、调试截图和测量等过程原件按需写到 `temp/dev/` 或 `temp/system/`。Change 的 `evidences/` 只放与 `tasks/` 完全同名的 `.md`，完成整体验收后才写 Change 根 `evidence.md`。独立上游分组不创建 `.agents/upstream-skills/`。详见[领域持久化与迁移](docs/reference/persistence-roots.md)。

## 文档导航

| 要完成的事 | 阅读入口 |
| --- | --- |
| 浏览完整文档、理解项目结构 | [文档导航](docs/README.md)、[架构设计](docs/reference/architecture.md) |
| 安装、升级、恢复备份或迁移旧包 | [安装说明](docs/usage/installation.md) |
| 找回近期工作、复盘对话或查当前项目会话文件 | `dev-recall`、`dev-reflect` 和三宿主路径指引 `dev-session-history`，见[开发方法归属](docs/development/method-ownership.md) |
| 组合开发技能，处理原型与交接 | [开发流程](docs/development/workflow.md)、[可交互原型](docs/development/prototype.md)、[开发交接](docs/development/handoff.md) |
| 新建完整 Issue、更新正文或追加评论 | [Issue 撰写与维护](docs/development/issues.md) |
| 构建、运营和管理个人 Home | [Home 说明](docs/home/overview.md)、[方法归属](docs/home/method-ownership.md) |
| 维护服务器和项目运行关系 | [运维说明](docs/operations/overview.md) |
| 用 Herdr TUI 或 Core 启动 agent、派发任务和收取结果 | [Herdr 协作](docs/usage/herdr-coordination.md) |
| 使用和更新独立中文技能 | [上游独立技能](docs/usage/upstream-skills.md) |
| 理解技能归属和资源组织 | [开发方法归属](docs/development/method-ownership.md)、[资源组织](docs/reference/resources.md) |
| 维护项目知识和记录位置 | [领域持久化](docs/reference/persistence-roots.md)、[知识与记忆](docs/reference/knowledge.md) |
| 修改仓库、编写技能或文档 | [开发约定](AGENTS.md)、[技能编写指南](docs/maintenance/skill-authoring.md) |
| 检查质量和发布版本 | [质量门禁](docs/maintenance/skill-quality.md)、[版本发布](docs/maintenance/release.md) |
| 查看版本变化 | [更新记录](CHANGELOG.md) |

## 致谢与许可

项目许可、第三方来源、贡献者归属与适用法律文本统一见[第三方声明](THIRD_PARTY_NOTICES.md)。
