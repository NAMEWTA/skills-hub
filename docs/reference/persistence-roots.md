# 领域持久化目录与迁移

技能包保存可复用的方法，领域目录保存目标项目的事实与过程。安装后的技能统一在 `.agents/skills/`，实际记录按 dev、system、ops 分开维护。安装器管理约定的导航模板及开发工作树和系统附件的忽略规则。

## 约定

以下路径相对实际项目或运维工作根：

| 目录 | 职责 |
| --- | --- |
| `.agents/skills/<技能名>/` | 安装的完整技能，不存业务记录 |
| `.agents/dev/changes/<日期-主题>/` | 当前需求、规格、计划、进展、原型与验证证据 |
| `.agents/dev/notes/` | 术语、架构取舍、背景、错误经验与学习导读 |
| `.agents/dev/deploy/` | 环境操作说明与每次发布结果 |
| `.agents/dev/archive/changes/implemented/` | 已完成交付的历史 change |
| `.agents/dev/archive/changes/rejected/` | 有明确依据决定不实施的历史 change |
| `.agents/dev/archive/notes/` | 退役知识，按原分类保留 |
| `.agents/dev/project/` | 项目专用非秘密配置 |
| `.agents/dev/context/` | 实际模型角色和执行背景 |
| `.agents/dev/worktree/<任务名>/` | 主检出下按需创建的 Git 工作树，根 `.gitignore` 排除 |
| `.agents/system/<host>/` | 对应主机的诊断、清理、代理和配置记录 |
| `.agents/system/herdr/`、`.agents/system/herdr-core/` | Herdr TUI 与 Core 各自的协作主题、任务和报告，按实际派发建立 |
| `.agents/system/ignore/` | 系统任务的临时附件。Herdr 按工具、主题、执行者目录和任务文件名（去掉 `.md`）定位 |
| `.agents/ops/registry/` | 运行关系、稳定身份、来源和观察时间 |
| `.agents/ops/projects/` | 项目运维知识或既有权威资料的位置 |
| `.agents/ops/runs/` | 原始操作事实、步骤与可重建摘要 |

其他领域按 `.agents/<domain>/` 扩展。`upstream-skills` 只表示安装分组，不建立对应业务目录，也不强制独立上游技能改用 dev 的记录方式。

Herdr 的主题位置和身份规则随所选终端工具确定。 [Herdr 协作](../usage/herdr-coordination.md)

跨领域引用已有事实，避免复制第二份现行知识。开发资料不放进系统或运维记录，系统主机记录不放 `.agents/dev/system/`。用户明确指定其他位置时沿用要求，并在导航中记录实际路径。

## 安装时初始化

[初始化模块](../../scripts/init-persistence.mjs)按最终选择管理固定导航：

| 选择包含 | 创建或更新的导航 |
| --- | --- |
| 任意 dev 技能 | dev 领域的九份 `AGENTS.md`，以及根 `.gitignore` 的 `/.agents/dev/worktree/` 规则 |
| 任意 system 技能 | `.agents/system/AGENTS.md` 和项目根 `.gitignore` 的 `/.agents/system/ignore/` 规则 |
| 任意 ops 技能 | `.agents/ops/AGENTS.md` |
| 仅独立上游技能 | 无领域导航 |

模板源码归 `scripts/persistence/`，不放在技能内，也不由技能脚本执行。固定位置的 `AGENTS.md` 自动更新，字节相同不重写。自定义规则放根 `AGENTS.md` 或其他非托管文件，已有业务记录按原位置保留。

list、help、取消和 dry-run 不初始化。其余子目录在真实内容出现时建立；选择 ops 不先造 registry、projects 或 runs，选择 system 不先造主机。失败回滚及路径检查见[安装契约](../usage/installation.md#更新与冲突)。

目录说明提供职责与导航，不保证宿主递归加载。使用相关技能时显式读取所需导航，已有 docs、ADR 和部署手册继续引用真实位置。秘密留在实际安全存储中，Markdown 只保存用途和安全引用。

## 开发任务的收尾

活跃 change 使用 `<YYYY-MM-DD-slug>/`。只有交付完成或明确决定不实施时，`dev-archive` 才按结果移动到 implemented 或 rejected，并加 architecture、feature、bug-fix、refactor、process 之一的主类型前缀；沿用创建日期。

暂缓、阻塞、未决定和必要交付未完成的任务仍留 changes。implemented 不自动表示上线，rejected 需要真实的不实施依据。移动后修复路径和入链，旧历史不自动批量迁移，完整方法见[change 收尾](../../skills/dev/dev-archive/references/change-closure.md)及[知识与归档](knowledge.md)。

## ops 运行事实

registry、projects、runs、incidents、lessons 和可重建 index 按真实内容建立，没有源码仓库也可使用独立运维根。项目发布记录按实际位置只读引用，不复制竞争的 releases 历史。

`ops-execute` 创建或接续主 run，内部协作留下步骤；按服务器、服务和项目查询都引用同一记录集。run 请求、不可覆盖步骤及真实后端 execution 是事实依据，摘要和索引可重建。writer 与本地锁约束协作写入，不代表远端授权或跨控制端互斥，详见[运行记录](../operations/overview.md#一次操作怎样留记录)。

项目专属运维技能源码放在实际项目或指定私有仓库，再按宿主机制加载。通用包不保存项目秘密、IP 清单和事故历史。

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
