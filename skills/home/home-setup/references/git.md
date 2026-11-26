# Home Git 基线与换机恢复

## 建立或检查本地 Git

在用户选定的 Home 根执行。先用只读检查确认真实 Git 根、`.gitignore` 基线、嵌套边界和预期范围。安装、升级技能、普通登记和查询沿用各自的入口。

```sh
node <本技能目录>/scripts/git.mjs inspect --home "<Home 根>"
node <本技能目录>/scripts/git.mjs init --home "<Home 根>" --expect-ignore "<ignoreRevision>"
```

`init` 在尚无 Git 的独立 Home 根写入独立管理段，再建立 `main`。原有忽略规则保留在管理段后，后置例外以 Git 实际判定为准。已有精确 Git 根只读核验；若用户明确要求修复，先检查其既有规则和索引，再处理具体冲突。位于祖先仓库内时先确认真正的 Home 根。遇到权限、基线变化或部分失败时重跑 `inspect`，从实际状态接续。工具仅写本地 Git 元数据和忽略规则。暂存、提交、远端配置和同步按用户指令操作。

| 默认范围 | 文件 |
| --- | --- |
| 适合进入基线 | 根 `AGENTS.md`、`.gitignore`、`.agents/` 内各领域的正式资料与 `.agents/skills/` 的完整技能包，包括必需的模板、脚本与运行资产 |
| 留在本机或各自仓库 | 项目 checkout、worktree、运行原件、安装缓存、`.claude/skills/` 兼容链接、本机路径覆盖与凭据 |

正式资料按用途判断，Home 的候选、派遣记录、回执、知识、历史、归档、索引和状态 TSV 均可入库。执行日志、截图、录像和临时输出放执行仓库根的 `temp/`，Home 执行原件可用 `temp/home/`。随技能发布并实际需要的图片等资产随技能本体保存。核对各领域自己的本机文件和凭据约定，必要时给其准确路径加规则。检查尤其容易和正式资料混淆的 `env.md`。已有项目的 Git 根、worktree 入口或目录链接是扫描边界。报告被放行或已在索引中的排除项，按授权处理实际冲突，保留项目文件。

检查 `trackable`、`tracked`、`staged`、`head`、`blockedBaseline`、`exposed` 与 `trackedOutside`，按实际结果区分可跟踪、已暂存或已有提交。`missingSkills` 表示基线还缺哪些 Home 技能入口。建基线时从已经选定的 `skills-hub` 来源补齐缺项并核对本体资源，沿用已验证的技能版本和用户定制。Home 提交同时标识资料和随仓技能版本。接入旧 Home 时查看历史、知识和任务是否存在只能跳到旧机日志或会话的记录，按材料补全正式正文。能确认的事实和未能补齐的缺口分别写清。使用[根导航片段](../assets/home-navigation.md)合并换机入口。

## 新机克隆后使用

在新克隆的 Home 根，使用 Git 和 Node.js 22.14+ 运行随仓工具：

```sh
node .agents/skills/home-setup/scripts/restore.mjs --home .
node .agents/skills/home-setup/scripts/restore.mjs --home . --apply
node .agents/skills/home-setup/scripts/restore.mjs --home . --repo project-a --apply
```

默认预览所有登记项，`--apply` 恢复缺失项目，可重复 `--repo` 选择准确 ID。源是 `repos.json`。默认路径相对新 Home 根，本机已有合法 `local.json` 时优先使用其覆盖。无须安装技能。可独立查询 `.agents/home/` 正式正文，也可使用同仓 `home-history`、`home-knowledge`、`home-tasks` 的查询入口，项目不可达时这些查询仍可用。

已有且核验匹配的 checkout 原地复用，报告附加远端漂移并保留当前状态。缺失项目使用登记的主 fetch URL 和远端默认分支。v2 新 checkout 按登记恢复远端名称、有序 URL 和显式 push URL；v1 使用单远端克隆，保留共享登记。克隆前检查 Git 展开的实际 fetch 身份，下载后由 `home-route` 核验再放到目标位置。项目保留独立 Git，内嵌项目须已被 Home 忽略且索引中无该路径。

若路径已有其他文件、与另一个登记路径重叠、始于另一个项目内部或经目录链接跳转，报告目标冲突。远端不可访问、授权缺失和本机独有项目逐项报告。其余可恢复项目继续。验证通过且已下载的项目在重跑时复用；新机的 Git/SSH 凭据从本机有效配置取得。记录的历史提交可供需要时另行定位。原会话或旧机未提交工作由原 owner 确认。

两个工具输出 JSON。`0` 表示本次检查或操作成功，`1` 表示边界冲突或部分项目无法恢复，`2` 表示用法、环境或读写失败。安装和本地检查不联络远端。只有恢复的 `--apply` 克隆缺失的项目。
