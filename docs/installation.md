# 安装契约

## 源码和安装结构

源码由 `skills/<domain>/<domain>-xxx/SKILL.md` 自动发现，不另建人工维护的技能注册表。安装后完整复制到当前工作目录的 `.agents/skills/<domain>-xxx/`，保留 references、assets、scripts 和 agents 等全部运行资源。完整许可从仓库 `licenses/` 自动附带到 `.agents/skills-hub-licenses/`，不放进技能目录。只安装一个技能也附带完整许可，使用者不需要选择或维护许可组合。

开发技能产生的资料保存到 `.agents/dev/`，系统技能产生的主机资料保存到 `.agents/system/<host>/`；其他领域按 `.agents/<domain>/` 扩展。安装器不预建这些目录，也不移动、覆盖或删除其中的项目记录；更新技能包后，新任务按新持久化路径执行。

安装器无网络访问、无第三方运行依赖，不安装包管理器、不修改 Agent 的全局配置，也不决定使用者的项目根目录。请先切换到目标项目根目录再运行；它有意不提供 `--target` 或安装目录交互。在本仓库的 `skills/` 或 `licenses/` 源目录及其子目录中运行安装会被拒绝，避免把技能复制进自身。

## npm 与源码入口

npm 包名为 `@namewta/skills-hub`，安装后的命令名为 `skills-hub`。在目标项目根目录运行 `npx @namewta/skills-hub@0.0.7 list` 或 `npx @namewta/skills-hub@0.0.7 install --domain dev`。也可从源码运行 `node /path/to/skills-hub/install.mjs`，命令参数完全相同。包本身没有 install/postinstall 钩子；下载或全局安装 npm 包不会写入任何项目的技能目录。

`npx` 首次获取包需要网络；已有源码的安装器完全离线。npm 包只包含安装器、运行技能及完整许可，维护底稿保留在 Git 仓库。

## 从 skills-wta 迁移

原包 `skills-wta@0.0.1` 的后续版本改用 `@namewta/skills-hub@0.0.7`。在原目标项目根目录，使用新包并选择原来需要的技能即可，例如：

```bash
npx @namewta/skills-hub@0.0.7 install --domain dev
```

新旧版本都安装到 `.agents/skills/<技能名>/`，不会因项目改名生成第二份技能目录。相同内容返回 `unchanged`；有差异时默认停止，核对变化后使用 `npx @namewta/skills-hub@0.0.7 install --domain dev --replace`。只安装个别技能时保留原来的 `--skill` 选择。旧 `.agents/wtadev/` 不再作为新资料写入位置；开发与系统资料分别使用 `.agents/dev/` 和 `.agents/system/`，已有记录须按迁移指南处理。

新版会补齐 `.agents/skills-hub-licenses/`，新备份写入 `.agents/.skills-hub-backups/`。旧 `.agents/skills-wta-licenses/` 与 `.agents/.skills-wta-backups/` 不迁移、不删除；恢复旧备份时继续从其原路径选择。

已发布的 `skills-wta@0.0.1`、`v0.0.1` 标签与发布附件保留原有内容，不能作为本次改名重新写入。新 scoped 包在原 0.0.2 准备版本基础上以 npm 已有的 `0.0.6` 为基线递增发布 `0.0.7`，使用 `v0.0.7` 标签；不移动旧 `v0.0.1` 标签；GitHub 仓库使用 [NAMEWTA/skills-hub](https://github.com/NAMEWTA/skills-hub)。

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
| `install … --replace` | 对不同内容先备份再替换 |

没有选择、未知名称或非法源码命名会返回非零退出码。不能把拼错的技能静默跳过。

## 更新与冲突

第一次安装直接复制。相同文件内容再次安装返回 `unchanged`，不修改技能。已有同名目录或配套许可目录但内容不同，默认整次安装停止；在任何技能变更前先完成冲突检查。许可缺失会在下次安装时补齐，即使选定技能内容没有改变。

更新源码后，先查看改动，再运行 `--replace`。旧目录保留在 `.agents/.skills-hub-backups/<UTC时间-随机后缀>/<技能名>/`。备份在技能扫描目录之外，不会作为重复技能加载。未选中的技能不改动。配套许可的旧副本保存在同批备份的 `.licenses/` 中；许可与所选技能一起暂存、切换并在失败时恢复。

安装先把所有新文件复制到同文件系统的临时目录，再逐个切换。普通复制或切换异常会尝试撤销本次已切换目录；撤销失败时明确报告需要人工恢复的位置。它不承诺断电、强制终止或外部程序同时修改下的完整事务。

安装事务依次取得 `.agents/.skills-wta-install.lock/` 和 `.agents/.skills-hub-install.lock/`，同时持有两把锁，防止新旧安装器并发写入同一批技能。旧锁名有意保留以兼容 `skills-wta`；安装结束仅释放本次自己取得的锁。若异常终止留下锁，先确认没有新旧安装进程，再移除遗留锁并检查备份。不要在进程运行时删除锁。

## 合并后的 UI 入口

`dev-figma-design` 已合并到 `dev-ui-design`。设计系统、颜色与语义 token、组件状态和视觉检查完整保留在新包内，直接用于项目代码，无需 Figma。

安装器只更新本次选定的名称，不自动删除已退役或未选中的目录。如果目标项目此前安装过旧入口：

1. 检查 `.agents/skills/dev-figma-design/` 是否有自行修改；将需要保留的偏好与当前 UI 资源对照处理。
2. 将整个旧目录移到 `.agents/.skills-hub-backups/<本次唯一标识>/dev-figma-design/` 或其他技能扫描目录之外。不要仅在 `.agents/skills/` 内改名，避免旧入口继续被发现。
3. 在目标项目根目录，使用更新后的安装器安装 `dev-ui-design`；需要更新现有同名包时使用 `install --skill dev-ui-design --replace`。也可更新整个 `dev` 领域。

这个过程只迁移技能入口；项目中的设计记录仍按原位置引用，新记录按领域分别使用 `.agents/dev/` 与 `.agents/system/`。

## 恢复与卸载

恢复前关闭可能正在读取或写入这些技能的工具，核对备份内容，将现有对应技能另行保留，再把选定备份目录移回 `.agents/skills/<技能名>/`。只恢复所选技能，不用整个 `.agents` 覆盖项目资料。

不再使用某技能时，移走其 `.agents/skills/<技能名>/` 文件夹即可。安装器不提供一键递归清空功能。它从不删除 `.agents/dev/`、`.agents/system/` 或原有 `.agents/wtadev/` 下的用户资料。仍保留任何本项目技能时，保留 `.agents/skills-hub-licenses/`；转移或再次分发技能时同时附带该目录。卸载全部技能后才可移走这份配套许可。

## 平台与工具

Node.js 22.14+ 标准库，无第三方安装器依赖；Windows、macOS 与 Linux 使用相同的 `node` / `npx` 命令。路径含空格时按当前 shell 规则加引号。源码和安装目标中的符号链接、设备、管道会被拒绝，避免复制到技能范围之外。相等判断比较文件路径与内容，在 POSIX 平台还检查执行位以支持脚本权限更新；不把空目录作为状态，也不比较其余平台权限。

安装器不执行任何技能中的脚本，不自动连接服务器或外部账号，不安装兄弟技能的隐含依赖。支持 `.agents/skills/` 的 Agent 可按其发现规则读取；其他 Agent 由用户显式加载文件。技能可调用性仍受宿主实际工具能力限制。
