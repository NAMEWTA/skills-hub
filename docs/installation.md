# 安装契约

## 源码和安装结构

安装器从两处自动发现完整运行技能，不另建人工维护的技能注册表：

| 源码位置 | 安装位置 | 组织方式 |
| --- | --- | --- |
| `skills/<domain>/<domain>-xxx/SKILL.md` | `.agents/skills/<domain>-xxx/` | dev、system、ops 等领域体系 |
| `upstream-skills/zh-<原名>/SKILL.md` | `.agents/skills/zh-<原名>/` | 中文化并作必要适配的上游独立技能 |

两种技能都完整复制 references、assets、scripts、agents 等运行资源，安装后没有领域或来源中间层。上游独立技能名使用 `zh-` 前缀，目录名必须与 frontmatter 的 `name` 相同；两处运行目录的安装名全局唯一，重复时报错。领域技能继续使用自己的领域前缀。`materials/` 中的原件、中文对照和开发辅助技能不参与发现、安装或执行。

完整许可保存在仓库与 npm 包的 `licenses/` 中；上游独立技能包内已有的 LICENSE、NOTICE 等法律文件随完整包保留。安装器不另外创建、复制、补齐、更新或删除目标项目的 `.agents/skills-hub-licenses/`。

开发技能产生的资料保存到 `.agents/dev/`，系统技能产生的主机资料保存到 `.agents/system/<host>/`；其他领域按 `.agents/<domain>/` 扩展。安装选择中包含任意 dev 技能时，安装器一次性补齐 `.agents/dev/` 根、changes、notes、deploy、archive、project、context 及 archive/changes 下 implemented、rejected 的九份短 AGENTS.md；包含 system 技能时另补 `.agents/system/AGENTS.md`；包含 ops 技能时只补 `.agents/ops/AGENTS.md`。`upstream-skills` 只是安装分组，不是新的领域，不创建 `.agents/upstream-skills/` 或 `.agents/zh/`。固定结构由 `scripts/init-persistence.mjs` 与 `scripts/persistence/` 维护，不属于技能包，也不执行技能脚本。命令行、领域和交互选择使用同一安装入口。固定位置的模板 AGENTS.md 在重复安装或升级时自动覆盖更新，内容相同则保持修改时间；根 AGENTS.md 不自动编辑，不迁移、覆盖或删除业务记录；list、help、取消和 dry-run 均不初始化。

文件安装核心无网络访问、无第三方运行依赖；npm 交互入口使用随 npm 安装的终端 UI 依赖，不安装包管理器、不修改 Agent 的全局配置，也不决定使用者的项目根目录。请先切换到目标项目根目录再运行；它有意不提供 `--target` 或安装目录交互。在本仓库的 `skills/`、`upstream-skills/` 或 `licenses/` 源目录及其子目录中运行安装会被拒绝，避免把技能复制进自身。

## npm 与源码入口

npm 包名为 `@namewta/skills-hub`，命令名为 `skills-hub`。运行 `npm install -g @namewta/skills-hub` 后，在目标项目根目录运行 `skills-hub`，或直接 `npx @namewta/skills-hub`，进入分组 / 技能树。根节点控制全部技能；dev、system、ops 和 `upstream-skills/（上游独立技能）` 都作为一级分组，分组节点控制全部子项。支持整组与跨组单项混选、全选后取消个别技能。绿色 `■` 全选、`◩` 部分选中、`□` 未选；目录以加粗名称与 `▸` 图标区分于带树枝的叶子技能。部分选中的父节点再次勾选会补齐全选，全选父节点再次勾选会清空其子项。新增上游分组需使用包含本次变更的源码或发布版本；已发布旧包不会自动获得仓库中的新技能。

直接输入关键词实时过滤，可按分组、技能名或中文用途搜索；例如 `archify`、`zh-archify`、`上游`、`upstream-skills` 都能找到对应项。支持非连续缩写与空格分隔的多个关键词（各词都须匹配），不支持拼音转换或拼写纠错。匹配分组时显示其全部子项，匹配技能时保留分组节点作为上下文；父节点操作始终作用于整个分组，包括搜索隐藏项。每页最多 8 个技能，按终端高度缩减；每页只属于一个分组，分组行固定在顶部、持续显示勾选状态并支持整组操作，跨页不会失去目录上下文。↑/↓ 只在当前页移动（不滚动、不跨页），←/→ 整页切换（边界不循环），Tab 勾选/取消，空搜索时也可按空格勾选，Enter 确认。搜索变化会重新定位，翻页不修改搜索文字；底部同时显示全局页码、组内页码及总选中数。列表只显示技能名，当前焦点的用途在底部单独显示并按显示宽度截断，保留中文、emoji 与树枝缩进。清空或更换关键词保留已选项，无匹配时可退格修改或 Ctrl+U 清空搜索。至少选择一个技能才能继续，最终安装列表只包含叶子名称，不会因分组选择而重新加入已排除子项。Ctrl+C 取消；`install --dry-run` 只预览，同名技能有差异时自动备份替换，`install --replace` 仅保留兼容。非 TTY 不启动交互，需明确传参。

原有 `list`、`install --domain`、`install --skill`、`--all` 等参数保持兼容。也可从源码运行 `node /path/to/skills-hub/install.mjs`，命令参数完全相同；源码交互模式需先 `npm ci`。包本身没有 install/postinstall 钩子；下载或全局安装 npm 包不会写入任何项目的技能目录。

`npx` 首次获取包需要网络；已有源码的安装器完全离线。npm 包只包含安装器、运行技能及完整许可，维护底稿保留在 Git 仓库。

## 从 skills-wta 迁移

原包 `skills-wta@0.0.1` 的后续版本改用 `@namewta/skills-hub@0.0.8`。在原目标项目根目录，使用新包并选择原来需要的技能即可，例如：

```bash
npx @namewta/skills-hub@0.0.8 install --domain dev
```

新旧版本都安装到 `.agents/skills/<技能名>/`，不会因项目改名生成第二份技能目录。相同内容返回 `unchanged`；有差异时自动备份替换，也兼容旧命令 `npx @namewta/skills-hub@0.0.8 install --domain dev --replace`。只安装个别技能时保留原来的 `--skill` 选择。旧 `.agents/wtadev/` 不再作为新资料写入位置；开发与系统资料分别使用 `.agents/dev/` 和 `.agents/system/`，已有记录须按迁移指南处理。

新版不再写入 `.agents/skills-hub-licenses/`；已有目录保持原样。新备份写入 `.agents/.skills-hub-backups/`。旧 `.agents/skills-wta-licenses/` 与 `.agents/.skills-wta-backups/` 不迁移、不删除；恢复旧备份时继续从其原路径选择。

已发布的 `skills-wta@0.0.1`、`v0.0.1` 标签与发布附件保留原有内容，不能作为本次改名重新写入。新 scoped 包从已发布的 `0.0.7` 递增 `+0.0.1` 发布 `0.0.8`，使用 `v0.0.8` 标签；不移动旧 `v0.0.1` 标签；GitHub 仓库使用 [NAMEWTA/skills-hub](https://github.com/NAMEWTA/skills-hub)。

## 领域持久化根目录迁移

技能更新不会自动移动、重命名或删除项目资料。历史 `.agents/wtadev/changes/`、`notes/`、`deploy/`、`archive/`、`project/`、`context/` 归入 `.agents/dev/` 同名子目录，历史 `.agents/wtadev/system/<host>/` 归入 `.agents/system/<host>/`。先备份和清点，再检查目标位置是否已有不同内容，按文件核对、合并与修复链接；不以整个目录覆盖目标位置。验收后再决定是否清理旧目录，详见[迁移规范](persistence-roots.md)。

## 选择

| 命令 | 行为 |
| --- | --- |
| `list` | 列出当前源码中的全部分组和技能 |
| `list --domain dev` | 只列出该领域 |
| `list --domain upstream-skills` | 只列出上游独立技能 |
| `install --domain dev system` | 安装所列领域的全部技能 |
| `install --domain upstream-skills` | 安装全部上游独立技能，不初始化领域目录 |
| `install --skill dev-spec system-proxy zh-archify` | 安装所列技能，允许跨领域与上游分组混选 |
| `install --domain system --skill dev-learn` | 领域选择与技能选择取并集，去重 |
| `install --all` | 安装两处运行目录中的全部技能 |
| `install … --dry-run` | 检查选择和冲突，展示计划，不创建目录或文件 |
| `install … --replace` | 兼容参数；不同内容默认即先备份再替换 |

没有选择、未知名称或非法源码命名会返回非零退出码。不能把拼错的技能静默跳过。

## 上游独立技能

`upstream-skills/` 保存可以直接修改、实际安装的中文适配版。`materials/` 保留来源原件和适用中文对照，供更新时比较；材料同步不会自动覆盖运行版。安装时读取完整运行包，不临时拼接译文、不在线翻译，也不执行上游仓库的安装或同步脚本。

在目标项目中使用包含这些技能的源码：

```bash
node /path/to/skills-hub/install.mjs list --domain upstream-skills
node /path/to/skills-hub/install.mjs install --skill zh-archify --dry-run
node /path/to/skills-hub/install.mjs install --skill zh-archify zh-modern-web-guidance
node /path/to/skills-hub/install.mjs install --domain upstream-skills
```

安装后入口是 `.agents/skills/zh-archify/SKILL.md`、`.agents/skills/zh-modern-web-guidance/SKILL.md` 等；原版名与本仓 `zh-` 名保持明确对应。命令行 `--skill` 使用完整安装名，交互搜索可以只输入原名。`--domain upstream-skills` 复用现有分组参数，不表示这些技能构成统一的领域流程。单装或混装均遵循相同的预览、备份、重复安装与失败恢复规则。

## 更新与冲突

第一次安装直接复制。相同文件内容再次安装返回 `unchanged`，不修改技能。已有同名技能目录但内容不同，默认备份后完整替换；在任何技能变更前先完成冲突检查。项目中的许可目录不参与检查、安装或替换。

更新源码或 npm 包后直接安装所选技能，有差异即自动备份替换，无需 `--replace`。旧目录保留在 `.agents/.skills-hub-backups/<UTC时间-随机后缀>/<技能名>/`。备份在技能扫描目录之外，不会作为重复技能加载。未选中的技能不改动。暂存、切换、备份与失败恢复只处理所选技能，不处理项目许可目录。

安装在写入前统一检查技能冲突和领域导航路径，再把技能复制到同文件系统的临时目录并逐个切换，最后创建缺失导航或更新旧模板；补齐导航与技能切换持有同一组安装锁，即使技能全部 unchanged 但仍需补文件也会取得锁。普通复制、切换或导航写入异常会尝试撤销本次已切换技能及本次新建导航、恢复更新前的模板原字节，并清理本次建立的空领域目录；不会回删安装前已有资料。撤销失败时明确报告需要人工恢复的位置。它不承诺断电、强制终止或外部程序同时修改下的完整事务。

安装事务依次取得 `.agents/.skills-wta-install.lock/` 和 `.agents/.skills-hub-install.lock/`，同时持有两把锁，防止新旧安装器并发写入同一批技能。旧锁名有意保留以兼容 `skills-wta`；安装结束仅释放本次自己取得的锁。若异常终止留下锁，先确认没有新旧安装进程，再移除遗留锁并检查备份。不要在进程运行时删除锁。

## 独立 ops 领域

`0.1.11` 提供九个 ops 技能。在实际运维工作根使用 npm 入口：

```bash
npx @namewta/skills-hub@0.1.11 install --domain ops --dry-run
npx @namewta/skills-hub@0.1.11 install --domain ops
```

也可使用更新后的源码：`node /path/to/skills-hub/install.mjs install --domain ops`，加 `--dry-run` 可先预览。

选择任意 ops 技能只新增/更新 `.agents/ops/AGENTS.md` 这一份托管导航，不生成 registry、runs 或项目事实，也不执行任何服务器操作。业务目录按需创建，根 AGENTS.md 与其他领域记录不改。重复安装、备份、失败回滚和预览继续遵循上面的同一安装契约。

完整领域包含 `ops-workflow`、inventory、execute、inspect、diagnose、maintain、recover、history、runbook。部分安装不解析或自动安装兄弟依赖；需要某方法而未安装时明确缺口。专门技能可直接使用，不强制 workflow。ops 不依赖其他 domain；各项目发布仍按自己的方法执行。用法、技能发现和独立 CLI 上下文见[运维说明](ops.md)。

## 开发交接入口迁移

`dev-handoff` 是独立的 dev 技能，接管原 `dev-workflow` 中的交接方法、会话接续、安全暂停和交接模板。使用包含该变更的更新后源码，在目标项目根目录一起更新旧调用者与新入口：

```bash
node /path/to/skills-hub/install.mjs install --skill dev-workflow dev-handoff
```

若原来安装了整个开发领域，直接更新整个领域即可，相关帮助、学习与计划入口也会同步：

```bash
node /path/to/skills-hub/install.mjs install --domain dev
```

只选择部分技能的项目，按原选择更新已安装的 `dev-help`、`dev-learn`、`dev-plan`，使其导航指向新入口。也可只安装 `dev-handoff` 使用其保存、交接与接续方法；它不要求其他领域技能。

安装器会先备份再完整替换有差异的 `dev-workflow`，旧交接资源随整包替换移出运行目录，无需手动删文件。只新增 `dev-handoff` 而不更新旧 `dev-workflow` 会留下旧方法副本。项目已经创建的 `handoff.md`、规格、计划和其他业务记录不搬迁、不重写，继续引用原真实位置。完整能力与边界见[开发上下文交接](dev-handoff.md)。

## 合并后的 UI 入口

`dev-figma-design` 已合并到 `dev-ui-design`。设计系统、颜色与语义 token、组件状态和视觉检查完整保留在新包内，直接用于项目代码，无需 Figma。

安装器只更新本次选定的技能并补齐相应领域导航，不自动删除已退役或未选中的目录。如果目标项目此前安装过旧入口：

1. 检查 `.agents/skills/dev-figma-design/` 是否有自行修改；将需要保留的偏好与当前 UI 资源对照处理。
2. 将整个旧目录移到 `.agents/.skills-hub-backups/<本次唯一标识>/dev-figma-design/` 或其他技能扫描目录之外。不要仅在 `.agents/skills/` 内改名，避免旧入口继续被发现。
3. 在目标项目根目录，使用更新后的安装器安装 `dev-ui-design`；需要更新现有同名包时使用 `install --skill dev-ui-design --replace`。也可更新整个 `dev` 领域。

这个过程只迁移技能入口；项目中的设计记录仍按原位置引用，新记录按领域分别使用 `.agents/dev/` 与 `.agents/system/`。

## 恢复与卸载

恢复前关闭可能正在读取或写入这些技能的工具，核对备份内容，将现有对应技能另行保留，再把选定备份目录移回 `.agents/skills/<技能名>/`。只恢复所选技能，不用整个 `.agents` 覆盖项目资料。

不再使用某技能时，移走其 `.agents/skills/<技能名>/` 文件夹即可。安装器不提供一键递归清空功能。它从不删除 `.agents/dev/`、`.agents/system/` 或原有 `.agents/wtadev/` 下的用户资料。旧版留下的 `.agents/skills-hub-licenses/` 不会自动删除，由使用者自行管理。需要法律声明时可查阅源码仓库或已安装 npm 包内的 `licenses/`；再次分发仍应保留适用许可。

## 平台与工具

Node.js 22.14+；显式参数安装核心仅使用标准库，交互界面依赖 `@clack/prompts`、`@clack/core`、`picocolors`、`string-width`、`wrap-ansi`；Windows、macOS 与 Linux 使用相同的 `node` / `npx` 命令。路径含空格时按当前 shell 规则加引号。源码和安装目标中的符号链接、设备、管道会被拒绝，避免复制到技能范围之外。相等判断比较文件路径与内容，在 POSIX 平台还检查执行位以支持脚本权限更新；不把空目录作为状态，也不比较其余平台权限。

npm 包包含安装器自身的 scripts 初始化模块与固定模板，但不会把这些工具复制进项目技能包。安装器不执行任何技能中的脚本，不自动连接服务器或外部账号，不安装兄弟技能的隐含依赖。支持 `.agents/skills/` 的 Agent 可按其发现规则读取；其他 Agent 由用户显式加载文件。技能可调用性仍受宿主实际工具能力限制。
