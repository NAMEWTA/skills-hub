# 安装契约

在需要使用技能的项目根目录运行安装命令。安装器把完整本体安装到 `.agents/skills/`，并尝试为每个所选技能在同仓 `.claude/skills/` 建立目录符号链接。Windows 创建链接遇到 `EPERM` 时，安装器继续部署本体和项目初始化文件，并报告缺失的链接。安装范围仅限当前项目，Agent 的全局配置保持原样。

## npm 与源码入口

需要 Node.js 22.14+。`@latest` 指 npm 最新公开版本。在目标项目根目录打开交互选择。

```sh
npx @namewta/skills-hub@latest
```

也可先全局安装 `npm install -g @namewta/skills-hub`，再在目标项目运行 `skills-hub`。用 `npx @namewta/skills-hub@latest list` 核对公开包的技能清单，用 `node /path/to/skills-hub/install.mjs list` 核对源码清单。需要复现某个公开版本时，将 `@latest` 换成该版本。包的下载、全局安装和项目写入分属不同步骤，执行 `install` 或确认交互选择才会写入项目技能。

源码入口使用相同参数。显式参数安装可直接运行，交互模式需先在源码仓库安装 npm 依赖：

```sh
node /path/to/skills-hub/install.mjs list
node /path/to/skills-hub/install.mjs install --domain dev --dry-run
node /path/to/skills-hub/install.mjs install --domain dev
```

首次获取 npm 包通常需要网络；已有源码的显式参数安装只操作本地文件。npm 不分发 `materials/`、开发测试和维护底稿。

### 交互选择

交互安装启动时先显示当前版本号。通过 npm 运行时，安装器最多等待 3 秒查询 npm 的最新稳定版本。查到后会显示最新版本号，只有它比当前版本更新时才询问 **是否现在更新？**。离线、查询失败或 3 秒内未查到时，会显示「未检测到最新版本号」并进入技能选择。

选择 **是，立即更新** 会安装并启动新版本。全局安装会更新全局包，`npx` 或项目本地安装会通过 npm 缓存启动新版本。选择 **否，直接进入** 会使用当前版本进入技能选择，下次启动仍会检查。源码和 `--dry-run` 的交互启动只显示当前版本号，不查询 npm。带明确技能选择的安装命令和 `list` 等非交互命令不检查更新。

树的根节点控制全部技能，领域和 `upstream-skills` 节点控制整组。可以整组与跨组单项混选，也可以全选后取消个别技能。`■` 表示全选，`◩` 表示部分选中，`□` 表示未选；部分选中的分组再次勾选会补齐全选，全选分组再次勾选会清空该组。

默认收拢所有领域。要浏览 `system`，用方向键定位 `system/`，再按 Tab。展开一个领域会自动收拢上一个。终端足够高时每页显示最多 20 个技能，窗口较矮时会减少技能行。

| 操作 | 作用 |
| --- | --- |
| `/` | 进入搜索，按分组、技能名或中文用途过滤 |
| ↑ / ↓ | 在树中移动焦点 |
| ← / → | 在展开的领域内翻页 |
| Tab | 展开或收拢焦点所在领域 |
| 空格 | 在树中勾选或取消当前项，在搜索框中分隔关键词 |
| Ctrl+U | 清空搜索并收拢领域 |
| Enter | 编辑搜索时返回树，在树中查看安装确认 |
| Ctrl+C | 取消，不写入 |

搜索支持非连续缩写和多个关键词，各词都须匹配。搜索会展开第一个匹配的分组。分组名称匹配时，可浏览其全部子项。分组勾选作用于整组，包括被搜索隐藏的技能。收拢、搜索和翻页都会保留勾选。

交互界面会预选 `.agents/skills/` 中包含常规 `SKILL.md` 文件且名称出现在当前目录清单中的技能。取消勾选会跳过该技能的本轮安装或更新。已勾选的技能按下文的更新规则处理。非 TTY 环境使用明确的命令参数，不启动交互。

## 选择

以下子命令可接在 `npx @namewta/skills-hub@latest`、`skills-hub` 或源码入口后：

| 子命令与选项 | 行为 |
| --- | --- |
| `list` | 列出当前包内的全部分组和技能 |
| `list --domain dev` | 列出指定领域 |
| `list --domain upstream-skills` | 列出独立上游中文技能 |
| `install --domain dev system` | 安装所列领域的全部技能 |
| `install --domain home` | 安装完整 Home 技能域，建立同仓入口与 Home 最小导航 |
| `install --domain upstream-skills` | 安装全部独立上游中文技能 |
| `install --skill dev-spec system-proxy zh-archify` | 按完整安装名选择，允许跨组混选 |
| `install --domain system --skill dev-learn` | 领域与技能选择取并集并去重 |
| `install --all` | 安装两个运行根中的全部技能 |
| `install … --dry-run` | 检查选择、目标及冲突，显示计划，零写入 |
| `install … --replace` | 兼容选项；不同内容默认已先备份再替换 |
| `--help` / `--version` | 查看命令帮助或当前工具版本 |

没有选择、未知名称或非法命名都会失败，不会静默忽略拼错的技能。参数语法错误返回退出码 2；未知选择、install 没有选择、安装与目录错误返回 1；成功返回 0。目录和版本以实际取得的包为准，旧 npm 包不会自动包含源码中新增加的技能。

## 源码和安装结构

| 源码位置 | 目标位置 | 组织方式 |
| --- | --- | --- |
| `skills/<domain>/<domain>-xxx/` | `.agents/skills/<domain>-xxx/` | 具有协作关系的领域技能 |
| `upstream-skills/zh-<原名>/` | `.agents/skills/zh-<原名>/` | 保持独立的上游中文运行包 |

安装器自动发现 `SKILL.md`，完整复制包内 references、assets、scripts、agents 及其他运行资源。目录名与 frontmatter 的 `name` 必须相同，两处源码的安装名全局唯一。安装后没有领域或来源中间目录；`materials/` 不参与安装器的发现和复制，安装器也不执行材料内容。

安装器为每个本次选中的技能规划 Claude 入口 `.claude/skills/<name>`。新链接使用相对路径 `../../.agents/skills/<name>`，指向同仓的完整技能目录，移动整个项目后仍然有效。两个入口共享同一份本体。`.claude/skills/` 本身是普通目录。未选中的技能和用户自有入口保持原样。Home 与各项目分别安装、分别更新。

选择任意 dev 技能会生成或更新开发根及 changes、notes、deploy、archive、project、context、两类 change 归档目录的托管 `AGENTS.md`。ops 和 home 技能分别触发本领域根导航。固定模板由安装代码管理，内容相同不重写，根 `AGENTS.md` 和业务记录保持原样。目录职责与自定义规则位置见[持久化规范](../reference/persistence-roots.md)。

选择任意 dev 或 system 技能时，在项目根 `.gitignore` 补齐 `/temp/`。dev 另补 `/.agents/dev/worktree/`，system 同时补系统根导航。home 补 `/.agents/home/local.json`；仅装 home 不加 `/temp/`。混装只加一条 `/temp/`；仅 ops 或独立上游包不加忽略项。缺少 `.gitignore` 时创建，已有等效条目不重复写；新增 `/temp/` 和 Home 本机映射默认规则放在既有项目规则之前，保留 `!/temp/`、`!/.agents/home/local.json` 等明确例外。实际忽略结果以 Git 判定为准。任务按需建立工作树和附件目录。交互和显式命令使用同一规则；`--dry-run` 只预览。list、help、取消和 dry-run 均不写入，也不创建链接探测或安装锁。

忽略规则不取消跟踪。安装器不扫描、迁移或兼容旧证据，也不写入业务 Change；旧资料由使用者处理。实际取证和报告路径见[运行原件与验收](../reference/persistence-roots.md#运行原件与验收)。

根 `licenses/` 和 [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md)随源码及 npm 包分发，独立技能内的原生法律文件随包保留。安装器不创建、维护或删除项目的 `.agents/skills-hub-licenses/`。

## 上游独立技能

```sh
npx @namewta/skills-hub@latest install --skill zh-archify --dry-run
npx @namewta/skills-hub@latest install --skill zh-archify zh-modern-web-guidance
npx @namewta/skills-hub@latest install --domain upstream-skills
```

`--domain upstream-skills` 复用安装分组选项，不表示这些技能组成业务领域，不生成 `.agents/upstream-skills/` 或 `.agents/zh/`。安装器读取现成中文运行包，不在线翻译、不临时拼接译文，也不执行来源的安装或同步脚本。

CLI 的 `--skill` 使用完整 `zh-` 安装名；交互搜索可输入原名。原版技能可与中文名并存，安装器不会自动删除原版。每个技能的用途、工具前提与中文覆盖边界见[上游独立技能](upstream-skills.md)。

## 更新与冲突

更新 npm 包或源码后，重新安装所选技能。第一次安装直接复制；路径、文件内容及适用执行位相同时返回 `unchanged`；内容不同则先备份再完整替换。未选中的技能保持原样，替换会移除新包已经不含的旧资源。

备份位于 `.agents/.skills-hub-backups/<UTC时间-随机后缀>/<技能名>/`，处于技能扫描目录之外。安装前的自行修改保存在备份中，不会自动合并回新版。需要长期项目特化时，在项目自己的技能源码或规则文件维护，再按宿主机制使用。

安装器先检查技能本体、逐技能 Claude 入口、领域导航及适用的 `.gitignore` 路径，再取得 `.agents/.skills-wta-install.lock/` 与 `.agents/.skills-hub-install.lock/` 两把锁。旧锁名用于与早期安装器互斥。取得锁后重新检查计划，把需要更新的本体复制到同一文件系统的临时目录，切换技能，写入导航和忽略规则，再尝试补齐链接。安装器核对本体、初始化文件和已创建或保留的链接，并报告缺失且跳过的链接。

除 Windows 创建 Claude 目录符号链接返回 `EPERM` 外，复制、切换、初始化或创建链接出错时，安装器尝试恢复本次替换前的技能、导航和 `.gitignore` 原字节，撤销本轮创建的链接，并清理本轮创建且仍为空的目录。已有正确链接和业务资料保持原样。回滚会拒绝被替换成链接的父目录。恢复失败会报告需要人工处理的路径与可用备份。断电、强制结束及外部程序并发修改超出事务保证范围。

异常终止留下锁时，先确认没有新旧安装进程，再移除遗留锁并检查备份。运行中的锁必须保留。即使技能全部 `unchanged`，补齐缺失链接、补齐或更新导航也会取得相同锁。输出分别列出本体的 `install`、`replace` 或 `unchanged`，以及链接的 `link`、`preserved` 或 `skipped`。重复安装会保留正确的入口。

### Claude 入口冲突

| 安装前状态 | 处理 |
| --- | --- |
| 对应入口缺失 | 建立指向同仓本体的相对目录 symlink |
| 目录 symlink 已正确指向同一本体 | 保留，包括经真实路径核对正确的绝对链接；绝对链接不保证搬迁后仍有效 |
| 断链的目标恰为预期本体 | 保留入口，本次安装本体后恢复可达性 |
| 同名普通文件、普通目录或指向其他目标的链接 | 写入前报告冲突；`--replace` 不授权覆盖这些入口 |
| 错向断链 | 仍报冲突，不当成空路径替换 |
| `.claude` 或 `.claude/skills` 是链接或非目录 | 报告冲突，不跟随它写入 |

预检使用 `lstat` 和 `readlink`，已有本体时核对真实路径。需要处理自己的同名入口时，先明确其来源并另行保留或移动，再重试。普通安装不迁移旧 Claude 技能，不创建 `CLAUDE.md`、`GEMINI.md`、settings 或 hooks，也不改变项目已存在的这些文件。

## 独立 home 领域

```sh
npx @namewta/skills-hub@latest install --domain home --dry-run
npx @namewta/skills-hub@latest install --domain home
```

安装只处理选中技能本体、同仓 Claude 入口、`.agents/home/AGENTS.md` 与本机映射默认忽略项。不创建 repos.json、用户背景与偏好、团队配置、知识、候选、历史、协调记录、clone 或 worktree，也不遍历子项目安装其他领域。

安装后用 `$home-setup 初始化 Home` 初始化用户选定的 Home。只发 `$home-setup` 会先检查状态并询问操作范围。根 `AGENTS.md` 的薄导航由 setup 在已有授权内合并，用户资料按需建立。已保存完整技能本体的 Home 克隆可直接调用同仓恢复工具。更新 Home 技能保留业务资料。 [Home 说明](../home/overview.md)

## 独立 ops 领域

```sh
npx @namewta/skills-hub@latest install --domain ops --dry-run
npx @namewta/skills-hub@latest install --domain ops
```

任意 ops 选择只触发 `.agents/ops/AGENTS.md`，不生成服务器清单、项目、run 或其他业务事实，也不连接服务器。完整领域方法和独立工作根用法见[ops 说明](../operations/overview.md)。

安装器不自动安装兄弟依赖。需要完整领域协作时选择整组；只选择专门技能时，缺少的方法需要另行安装或由实际能力完成。

## 从 skills-wta 迁移

在原目标项目根目录，改用 `@namewta/skills-hub` 并选择原来需要的技能。新旧工具都安装到 `.agents/skills/<技能名>/`，不会因包名变化生成第二套目录。

已有 `.agents/skills-wta-licenses/`、`.agents/skills-hub-licenses/` 与 `.agents/.skills-wta-backups/` 保留原样；新工具只管理自己的技能备份。恢复旧备份时按其真实原路径选择。npm 的旧包名不会自动变成新包名，后续安装使用 scoped 包或当前源码入口。

## 领域持久化根目录迁移

安装器升级不自动移动或删除项目资料。旧 `.agents/wtadev/` 中的开发资料对应到 `.agents/dev/` 同职责子目录，`system/<host>/` 对应到 `.agents/system/<host>/`。先清点和备份，再逐文件核对冲突、合并内容并修复链接，详见[迁移顺序](../reference/persistence-roots.md#从早期-agentswtadev-迁移)。

## 多 Change 编排与原有队列方法

在目标项目根目录使用包含 `dev-program` 的版本。整组安装使用 `--domain dev`。从当前源码按名更新调用者和方法所属包时，将下方路径换成源码安装器的位置。

```sh
node /path/to/skills-hub/install.mjs install --skill dev-workflow dev-help dev-program dev-parallel dev-deploy
```

单独编排可只安装 `dev-program`。原有批次与子 Change 记录沿用真实位置，按任务使用的其他开发阶段技能仍可单独选取。

## 开发交接入口迁移

使用旧版 `dev-workflow` 的项目，一起更新调用者并安装负责交接的技能：

```sh
npx @namewta/skills-hub@latest install --skill dev-workflow dev-handoff
```

完整开发套件可直接更新整个 dev。部分安装还应更新实际使用的 help、learn、plan 等调用者。整包替换会移除 workflow 内的旧交接方法；只新增 handoff 而保留旧 workflow 会留下两份方法。项目已经生成的 `handoff.md`、规格和计划继续保留原位置，使用方式见[开发交接](../development/handoff.md)。

## 开发原型入口迁移

确认原型和探索原型的方法统一由 `dev-prototype` 维护。旧版 `dev-build` 的项目至少一起更新两个包：

```sh
npx @namewta/skills-hub@latest install --skill dev-build dev-prototype
```

完整流程建议更新整个 dev，使规格、UI、计划、实施、审查、验证、交接和帮助入口同时使用当前引用。安装器不自动补齐这些调用者。

整包替换会移除 build 内的旧原型资源，已有 change、原型资源和用户确认记录保持原位置。实际使用见[可视化意图确认](../development/prototype.md)。

## 合并后的 UI 入口

使用过 `dev-figma-design` 的项目，改用 `dev-ui-design`。先核对旧目录中的自行修改，把需要保留的偏好与当前资源对照处理；再将旧目录移到技能扫描范围外的备份位置，安装或更新 `dev-ui-design`。

只在 `.agents/skills/` 内改名仍可能让宿主发现旧入口。安装器不自动删除退役或未选中的技能，项目设计记录也不因入口合并而移动。

## 恢复与卸载

恢复前停止正在读写对应技能的工具，核对备份，另行保留现有目录，再把选定备份移回 `.agents/skills/<技能名>/`。已有正确 Claude 链接继续指向该位置，回读核对即可；不要将备份目录直接作为新的技能入口。按包恢复，不用整个 `.agents` 覆盖项目资料。

卸载时先核对 `.claude/skills/<技能名>` 确实是对应本体的链接，移除这个链接入口，再移走 `.agents/skills/<技能名>/`。保留其他入口与业务资料；同名用户目录或外来链接应单独核查。安装器没有递归清空项目的命令，也不删除 home、dev、system、ops 的业务记录。旧许可目录由使用者自行管理；再次分发仍须保留适用法律文件，范围见[统一第三方声明](../../THIRD_PARTY_NOTICES.md)。

## 平台与工具

Windows、macOS、Linux 使用同一组 Node 命令。路径含空格时按所用 shell 加引号。显式参数安装使用 Node 标准库，交互模块使用 npm 声明的终端 UI 依赖。Claude 入口使用真实目录符号链接。

Windows 创建 Claude 链接遇到 `EPERM` 时，结果将失败的链接标为 `skipped`。技能本体与项目初始化仍完成，命令返回 `0`。要补齐链接，以管理员身份打开终端，或在 Windows 设置启用「开发人员模式」，再到同一项目重跑原安装命令。其他链接创建错误仍会触发回滚。

源码、canonical 本体和受保护持久化路径中的符号链接、设备与管道继续被拒绝；允许的新增链接仅是经过核对的逐技能 Claude 入口。源码和 npm tarball 仍分发完整普通文件，不把目标项目的链接打进包。文件相等判断比较路径和内容，POSIX 还比较执行位；不把空目录、修改时间或其余权限当作包内容。在仓库的 `skills/`、`upstream-skills/`、`licenses/` 及其子目录中安装会被拒绝，避免递归写入自身。

安装器不执行技能脚本、不下载技能运行工具、不连接外部账号。支持 `.agents/skills/` 的 Agent 按自身发现规则读取；Claude 可通过项目 `.claude/skills/` 的技能链接读取相同本体，具体版本的发现与调用需要真实宿主验证。文件系统链接验证和 tarball 消费验证不等于已经完成宿主调用。执行某技能还需具备该任务声明的工具、环境与授权。
