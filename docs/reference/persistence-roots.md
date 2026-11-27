# 领域持久化目录与迁移

技能包保存可复用的方法，领域目录保存目标项目的事实与过程。安装后的技能统一在 `.agents/skills/`，实际记录按 home、dev、system、ops 分开维护。安装器管理导航模板、项目根 `temp/` 和开发工作树的忽略规则。

## 约定

以下路径相对实际项目或运维工作根：

| 目录 | 职责 |
| --- | --- |
| `.agents/skills/<技能名>/` | 安装的完整技能，不存业务记录 |
| `.claude/skills/<技能名>` | 同仓本体的目录符号链接，不保存独立知识或配置 |
| `.agents/home/` | Home 的项目登记、用户配置、关系、管理知识、历史和协调摘要；细分 owner 见 [Home 说明](../home/overview.md) |
| `.agents/dev/changes/<日期-主题>/` | 当前需求、规格、架构与方案讨论、计划、进度、确认原型和正式验收 |
| `.agents/dev/changes/<日期-主题>/source/` | 远端 Issue 等来源的完整正文、可取得的讨论、来源元数据与必要方案附件 |
| `.agents/dev/notes/` | 术语、架构取舍、背景、错误经验与学习导读 |
| `.agents/dev/deploy/` | 环境操作说明与每次发布结果 |
| `.agents/dev/archive/changes/implemented/` | 已完成交付的历史 change |
| `.agents/dev/archive/changes/rejected/` | 有明确依据决定不实施的历史 change |
| `.agents/dev/archive/notes/` | 退役知识，按原分类保留 |
| `.agents/dev/project/` | 项目专用非秘密配置 |
| `.agents/dev/context/environment.md` | 当前及用户指定主机的开发环境、资源快照、峰值预算和预留 |
| `.agents/dev/context/team/<team_name>.md` | 按需保存的团队配置，由用户在任务中显式引用 |
| `.agents/dev/worktree/<任务名>/` | 主检出下按需创建的 Git 工作树，根 `.gitignore` 排除 |
| `.agents/system/<host>/` | 主机配置、操作知识及 `changes/<change-id>/` 下的系统 Change |
| `.agents/system/herdr/`、`.agents/system/herdr-core/` | Herdr 的主题、派发单和回执，不重复写业务验收 |
| `temp/dev/`、`temp/system/` | 两域运行原件，位于目标项目根，由 `/temp/` 忽略 |
| `.agents/ops/registry/` | 运行关系、稳定身份、来源和观察时间；已命名主机按 `<别名>.md` 登记 |
| `.agents/ops/projects/` | 项目运维知识或既有权威资料的位置 |
| `.agents/ops/runs/` | 原始操作事实、步骤与可重建摘要 |

其他领域按 `.agents/<domain>/` 扩展。`upstream-skills` 只表示安装分组，不建立对应业务目录，也不强制独立上游技能改用 dev 的记录方式。

Herdr 的主题位置和身份规则随所选终端工具确定。 [Herdr 协作](../usage/herdr-coordination.md)

跨领域引用已有事实，避免复制第二份现行知识。开发资料不放进系统或运维记录，系统主机记录不嵌入 dev。

环境记录保存真实检查所得的事实；采样原件仍留 `temp/dev/`，已有协调器维护预留时只记录引用。开发任务有适用记录就复用，缺失或过期时按当前执行环境核对，不以创建文件为前置。团队配置仅按用户明确请求创建，未指定名称时按主题生成，不预建默认团队或改写根项目指令。其他开发技能沿用本次任务上下文。

## Change 的来源与正式资料

实际获取并处理远端 Issue 或其他需求报告时，先按当前任务与稳定来源身份关联已有 Change；没有合适归属时建立最小 Change。来源身份包含平台实例、项目或仓库及原生 ID，不限 GitHub。多个来源可以属于同一 Change，重复获取复用已有归属。

`source/` 保存完整正文、可取得的全部讨论、来源更新时间、实际获取时点和必要方案附件。未取得的分页、附件和受权限限制的内容明确标注；源文与我们的分析分开。同源更新先保留旧版本，不能覆盖未保存内容。完整导入、更新和旧 `temp/dev/` 来源迁移方法归 [dev-issue-setup](../../skills/dev/dev-issue-setup/SKILL.md)。

规格、架构取舍、方案讨论、实施计划、确认原型和正式测试结论记录 Change 的始末，随 Change 纳入版本管理。独立决策访谈用 `decisions.md`，探路写 `map.md` 和 `questions/`；`brief.md` 承载需求背景与来源，`spec.md` 承载正式行为契约。正式规划依据规格保存 `plan.md`、`tasks/` 与同名报告。归档资料及旧 Change 的只读引用按真实位置查阅。源附件保存在 `source/`，原型资源跟随 `prototype/`。

文件是否保留由用途决定。源 Issue 的 JSON 导出、方案中的示意图或工具生成后经核实的正式结论，均不能仅因格式或生成方式归为临时文件。日志、重复截图、临时抓包和原始测量属于执行过程，按下节处理。

## 运行原件与验收

执行日志、调试截图录像、原始测量、临时响应、状态库和未经整理的工具输出不进 Git。开发 task 用目标项目根 `temp/dev/<change-id>/tasks/<task-stem>/<run-id>/`，其中 `task-stem` 是票据去掉 `.md` 的名称；组合验证用 `temp/dev/<change-id>/integration/<run-id>/`。主机诊断用 `temp/system/hosts/<host>/<change-id-or-topic>/<run-id>/`，Herdr 自身取证按其协调协议。重跑和并发用新目录，只有确需保留才创建。来源和正式结论按上节跟踪；源码、可复用测试、模型、确认原型、发布制品和恢复备份沿用各自位置。

Change 新建 `tasks/<名称>.md` 时同时建 `evidences/<名称>.md`，尚未执行标「未验证」。`evidences/` 只含与 `tasks/` 普通 `.md` 完全同名的普通 Markdown，包括大小写和后缀；没有索引、额外报告、子目录、符号链接或附件。失败、阻塞、交接和复验均更新原报告。整体验收通过且达到指定交付点后才写 Change 根的 `evidence.md`，引用各票报告。纯查询不为附件建任务。

Git 忽略不是权限隔离，也不取消跟踪。保存运行过程原件前核对目标确实被忽略且未跟踪；来源和正式资料则核对目标未被忽略并纳入版本管理。安装器不搬迁既有业务记录。本次发现误放的来源或正式资料时，先核对归属、迁入并修复引用，验证可读和 Git 跟踪后再按授权处理旧副本。详细报告和只读目录检查见 [dev-verify 取证方法](../../skills/dev/dev-verify/references/evidence-storage.md)。

## 安装时初始化

[初始化模块](../../scripts/init-persistence.mjs)按最终选择管理固定导航：

| 选择包含 | 创建或更新的导航 |
| --- | --- |
| 任意 dev 技能 | dev 领域的九份 `AGENTS.md`；根 `.gitignore` 的 `/.agents/dev/worktree/` 和 `/temp/` |
| 任意 system 技能 | `.agents/system/AGENTS.md`；根 `.gitignore` 的 `/temp/` |
| 任意 ops 技能 | `.agents/ops/AGENTS.md` |
| 任意 home 技能 | `.agents/home/AGENTS.md`；根 `.gitignore` 的 `/.agents/home/local.json` |
| 仅独立上游技能 | 无领域导航 |

安装器导航模板归 `scripts/persistence/`。dev、system、ops 的固定导航沿用全文托管。Home 导航在文件缺失时创建，已有普通文件保留原字节及修改时间。Home 的方法随技能包更新，入口内容由 `home-knowledge` 按用户授权维护。根 `AGENTS.md` 和已有业务记录保持原位置。

初始化集合严格等于本次最终选择的业务 domain；正文引用、建议调用和历史目录都不会扩大集合。交互确认显示最终范围，未选领域的内容与 mtime 保持。list、help、version、取消、非法选择和 dry-run 不初始化。其余子目录在真实内容出现时建立；选择 ops 不先造 registry、projects 或 runs，选择 system 不先造主机，选择 home 不先造 registry、profile、SOUL、默认团队、知识、历史或任务目录。失败回滚及路径检查见[安装契约](../usage/installation.md#更新与冲突)。

目录说明提供职责与导航，不保证宿主递归加载。使用相关技能时显式读取所需导航，已有 docs、ADR 和部署手册继续引用真实位置。普通 Markdown 只保存凭据用途和安全引用。项目明确指定的本地凭据文件（例如项目选用的 `env.md`）可由原部署流程保存实际值，不随技能、操作记录或发布制品分发。

## 开发任务的收尾

活跃 change 使用 `<YYYY-MM-DD-slug>/`。只有交付完成或明确决定不实施时，`dev-archive` 才按结果移动到 implemented 或 rejected，并加 architecture、feature、bug-fix、refactor、process 之一的主类型前缀；沿用创建日期。

暂缓、阻塞、未决定和必要交付未完成的任务仍留 changes。implemented 不自动表示上线，rejected 需要真实的不实施依据。移动后修复路径和入链，旧历史不自动批量迁移，完整方法见[change 收尾](../../skills/dev/dev-archive/references/change-closure.md)及[知识与归档](knowledge.md)。

## ops 运行事实

registry、projects、runs、incidents、lessons 和可重建 index 按真实内容建立，没有源码仓库也可使用独立运维根。项目发布记录按实际位置只读引用，不复制竞争的 releases 历史。

`ops-execute` 创建或接续主 run，内部协作留下步骤；按服务器、服务和项目查询都引用同一记录集。run 请求、不可覆盖步骤及真实后端 execution 是事实依据，摘要和索引可重建。writer 与本地锁约束协作写入，不代表远端授权或跨控制端互斥，详见[运行记录](../operations/overview.md#一次操作怎样留记录)。

项目专属运维技能源码放在实际项目或指定私有仓库，再按宿主机制加载。通用包不保存项目秘密、IP 清单和事故历史。

## Home 的知识与协调资料

Home 安装只建立导航和本机路径忽略规则。setup 按需写 `repos.json`、`local.json` 与 `context/`，显式初始化时在 `context/dispatch/` 和 `context/team/` 确定派遣方式与 Home team，在 `context/preferences.md` 保存两个独立的默认链接。项目登记地图默认只读生成，显式导出时才写派生 `repos.md`。map 写 `relations.md`，knowledge 写 `notes/` 等现行知识，history 写 `history/` 等历史。`home-tasks` 在 `coordination/<主题>/` 保存 Home 直接任务、回执和验收状态，用主题 `status.tsv` 和全局 `all.status.tsv` 展示状态。

完整 Home 初始化由 setup 合并或复用根短指针，使其指向 `.agents/home/AGENTS.md`。knowledge 按授权维护 Home 主入口的渐进式披露和资料指针。可选 `.agents/home/SOUL.md` 保存尚无现成 owner 的长期合作原则，profile/preferences 继续由 setup 维护。AGENTS/SOUL 采用读基线、最小编辑、写前复核和回读，独立于知识 CLI 的主题写锁。

显式建立 Home Git 时，各领域正式资料和 `.agents/skills/` 本体可随 Home 提交。运行原件放执行仓库根的 `temp/`，Home 可用 `temp/home/`。正式正文保存使用结论、明白理由和接续工作需要的事实，换机时可脱离旧机原件阅读。项目 checkout 与本机配置继续按各自边界维护。换机恢复使用同仓 `home-setup` 入口。 [Home Git 方法](../home/overview.md#从已提交的-home-换机)

项目内部知识由当地 Agent 读取维护。派遣技能的任务、回执、日志与当前执行状态留在相应协调仓库；它们不因上层是 Home 而改写原有目录或方法。跨 owner 的忘记请求明确范围、分别处理源资料和派生入口，不宣称 Git 历史、备份或宿主私有存储已一并删除。完整规则见 [Home 方法归属](../home/method-ownership.md)。

## 从早期 `.agents/wtadev/` 迁移

这是使用者项目资料的显式迁移，安装器升级不会代为执行：

1. 清点旧目录和目标目录，核对所属项目，保存文件、链接、权限及备份位置，避免输出凭据。
2. 将 `system/<host>/` 对应到 `.agents/system/<host>/`；将 changes、notes、deploy、archive、project、context 对应到 `.agents/dev/` 的同名子目录。
3. 目标不存在时复制并核对字节；相同内容保留一份；不同内容逐项按语义和证据合并，不能用整目录覆盖丢弃历史决定。
4. 修复根规则、主题索引、规格、手册和文档链接。按当前代码及环境核对现行事实，有历史价值的旧记录注明历史范围。
5. 验证读取、引用和资料完整性，保留备份。按用户明确要求和验证结果决定是否清理旧路径。

后续记录直接写入对应领域，避免维护两份现行知识。

## 执行与验证

技能入口、模板和参考使用所属领域的当前路径。安装导航之外的业务目录按需建立，不为小任务创建空记录。维护检查核对自有运行技能中弃用的 `wtadev` 路径及误挂开发根的系统记录；来源原件和历史发布保持当时语境。

文档保存的是当前目录契约。某次初始化、迁移、验收或发布的实际结果写入所属 change 或 deploy 记录。
