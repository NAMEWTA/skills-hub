# 安装契约

## 源码和安装结构

源码由 `skills/<domain>/<domain>-xxx/SKILL.md` 自动发现，不另建人工维护的技能注册表。安装后完整复制到当前工作目录的 `.agents/skills/<domain>-xxx/`，保留 references、assets、scripts 和 agents 等全部运行资源。完整许可保存在仓库与 npm 包的 `licenses/` 中；安装器不创建、复制、补齐、更新或删除目标项目的 `.agents/skills-hub-licenses/`，也不把许可放进技能目录。

开发技能产生的资料保存到 `.agents/dev/`，系统技能产生的主机资料保存到 `.agents/system/<host>/`；其他领域按 `.agents/<domain>/` 扩展。安装选择中包含任意 dev 技能时，安装器一次性补齐 `.agents/dev/` 根、changes、notes、deploy、archive、project、context 及 archive/changes 下 implemented、rejected 的九份短 AGENTS.md；包含 system 技能时另补 `.agents/system/AGENTS.md`。固定结构由 `scripts/init-persistence.mjs` 与 `scripts/persistence/` 维护，不属于技能包，也不执行技能脚本。命令行、领域和交互选择使用同一安装入口。固定位置的模板 AGENTS.md 在重复安装或升级时自动覆盖更新，内容相同则保持修改时间；根 AGENTS.md 不自动编辑，不迁移、覆盖或删除业务记录；list、help、取消和 dry-run 均不初始化。

文件安装核心无网络访问、无第三方运行依赖；npm 交互入口使用随 npm 安装的终端 UI 依赖，不安装包管理器、不修改 Agent 的全局配置，也不决定使用者的项目根目录。请先切换到目标项目根目录再运行；它有意不提供 `--target` 或安装目录交互。在本仓库的 `skills/` 或 `licenses/` 源目录及其子目录中运行安装会被拒绝，避免把技能复制进自身。

## npm 与源码入口

npm 包名为 `@namewta/skills-hub`，当前版本 `0.1.7`，命令名为 `skills-hub`。运行 `npm install -g @namewta/skills-hub@0.1.7` 后，在目标项目根目录运行 `skills-hub`，或直接 `npx @namewta/skills-hub@0.1.7`，直接进入领域 / 技能树，不再分三种安装模式。根节点控制全部技能，领域节点控制该领域全部子项；支持领域与跨领域单项混选、全选后取消个别技能。绿色 `■` 全选、`◩` 部分选中、`□` 未选；目录以加粗名称与 `▸` 图标区分于带树枝的叶子技能。部分选中的父节点再次勾选会补齐全选，全选父节点再次勾选会清空其子项。

直接输入关键词实时过滤，可按领域、技能名或中文用途搜索，支持非连续缩写与空格分隔的多个关键词（各词都须匹配），不支持拼音转换或拼写纠错。匹配领域时显示其全部子项，匹配技能时保留领域节点作为上下文；父节点操作始终作用于整个领域，包括搜索隐藏项。每页最多 8 个技能，按终端高度缩减；每页只属于一个领域，领域行固定在顶部、持续显示勾选状态并支持整组操作，跨页不会失去目录上下文。↑/↓ 只在当前页移动（不滚动、不跨页），←/→ 整页切换（边界不循环），Tab 勾选/取消，空搜索时也可按空格勾选，Enter 确认。搜索变化会重新定位，翻页不修改搜索文字；底部同时显示全局页码、领域内页码及总选中数。列表只显示技能名，当前焦点的用途在底部单独显示并按显示宽度截断，保留中文、emoji 与树枝缩进。清空或更换关键词保留已选项，无匹配时可退格修改或 Ctrl+U 清空搜索。至少选择一个技能才能继续，最终安装列表只包含叶子名称，不会因领域选择而重新加入已排除子项。Ctrl+C 取消；`install --dry-run` 只预览，同名技能有差异时自动备份替换，`install --replace` 仅保留兼容。非 TTY 不启动交互，需明确传参。

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
| `list` | 列出当前源码中的全部领域和技能 |
| `list --domain dev` | 只列出该领域 |
| `install --domain dev system` | 安装所列领域的全部技能 |
| `install --skill dev-spec system-proxy` | 安装所列技能，允许跨领域 |
| `install --domain system --skill dev-learn` | 领域选择与技能选择取并集，去重 |
| `install --all` | 安装全部领域 |
| `install … --dry-run` | 检查选择和冲突，展示计划，不创建目录或文件 |
| `install … --replace` | 兼容参数；不同内容默认即先备份再替换 |

没有选择、未知名称或非法源码命名会返回非零退出码。不能把拼错的技能静默跳过。

## 更新与冲突

第一次安装直接复制。相同文件内容再次安装返回 `unchanged`，不修改技能。已有同名技能目录但内容不同，默认备份后完整替换；在任何技能变更前先完成冲突检查。项目中的许可目录不参与检查、安装或替换。

更新源码或 npm 包后直接安装所选技能，有差异即自动备份替换，无需 `--replace`。旧目录保留在 `.agents/.skills-hub-backups/<UTC时间-随机后缀>/<技能名>/`。备份在技能扫描目录之外，不会作为重复技能加载。未选中的技能不改动。暂存、切换、备份与失败恢复只处理所选技能，不处理项目许可目录。

安装在写入前统一检查技能冲突和领域导航路径，再把技能复制到同文件系统的临时目录并逐个切换，最后创建缺失导航或更新旧模板；补齐导航与技能切换持有同一组安装锁，即使技能全部 unchanged 但仍需补文件也会取得锁。普通复制、切换或导航写入异常会尝试撤销本次已切换技能及本次新建导航、恢复更新前的模板原字节，并清理本次建立的空领域目录；不会回删安装前已有资料。撤销失败时明确报告需要人工恢复的位置。它不承诺断电、强制终止或外部程序同时修改下的完整事务。

安装事务依次取得 `.agents/.skills-wta-install.lock/` 和 `.agents/.skills-hub-install.lock/`，同时持有两把锁，防止新旧安装器并发写入同一批技能。旧锁名有意保留以兼容 `skills-wta`；安装结束仅释放本次自己取得的锁。若异常终止留下锁，先确认没有新旧安装进程，再移除遗留锁并检查备份。不要在进程运行时删除锁。

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
