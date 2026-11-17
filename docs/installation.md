# 安装契约

在需要使用技能的项目根目录运行安装命令。安装目标固定为当前目录下的 `.agents/skills/`；安装器不修改 Agent 的全局配置，也不替你选择工作目录。

## npm 与源码入口

需要 Node.js 22.14+。使用 npm 发布版本时，以下命令取得最新包并打开交互选择：

```sh
npx @namewta/skills-hub@latest
```

也可先全局安装 `npm install -g @namewta/skills-hub`，再在目标项目运行 `skills-hub`。使用固定版本时，将 `@latest` 换成需要的已发布版本。包的下载、全局安装及依赖安装都不会自动向项目写入技能；真正写入发生在执行安装命令或确认交互选择之后。

源码入口使用相同参数。显式参数安装可直接运行，交互模式需先在源码仓库安装 npm 依赖：

```sh
node /path/to/skills-hub/install.mjs list
node /path/to/skills-hub/install.mjs install --domain dev --dry-run
node /path/to/skills-hub/install.mjs install --domain dev
```

首次获取 npm 包通常需要网络；已有源码的显式参数安装只操作本地文件。npm 不分发 `materials/`、开发测试和维护底稿。

### 交互选择

树的根节点控制全部技能，领域和 `upstream-skills` 节点控制整组。可以整组与跨组单项混选，也可以全选后取消个别技能。`■` 表示全选，`◩` 表示部分选中，`□` 表示未选；部分选中的分组再次勾选会补齐全选，全选分组再次勾选会清空该组。

| 操作 | 作用 |
| --- | --- |
| 输入文字 | 按分组、技能名或中文用途过滤 |
| ↑ / ↓ | 在当前页移动焦点 |
| ← / → | 切换整页，边界不循环 |
| Tab | 勾选或取消当前项 |
| 空搜索时按空格 | 勾选或取消当前项 |
| Ctrl+U | 清空搜索 |
| Enter | 确认选择并查看安装确认 |
| Ctrl+C | 取消，不写入 |

搜索支持非连续缩写和空格分隔的多个关键词，各词都须匹配；不提供拼音转换或拼写纠错。匹配分组时显示全部子项，匹配技能时保留所属分组。分组操作始终作用于整组，包括被搜索隐藏的技能。更改搜索或翻页不会丢失已选项。

每页最多显示 8 个技能，并按终端高度缩减；每页属于一个分组，分组状态和页码持续可见。列表显示名称，焦点技能的用途显示在底部。确认时只安装最终选中的叶子技能，已取消的子项不会因父节点状态重新加入。非 TTY 环境使用明确的命令参数，不启动交互。

## 选择

以下子命令可接在 `npx @namewta/skills-hub@latest`、`skills-hub` 或源码入口后：

| 子命令与选项 | 行为 |
| --- | --- |
| `list` | 列出当前包内的全部分组和技能 |
| `list --domain dev` | 列出指定领域 |
| `list --domain upstream-skills` | 列出独立上游中文技能 |
| `install --domain dev system` | 安装所列领域的全部技能 |
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

选择任意 dev 技能会生成或更新开发根及 changes、notes、deploy、archive、project、context、两类 change 归档目录的托管 `AGENTS.md`。system 技能触发系统根导航，ops 技能触发 ops 根导航。固定模板由安装代码管理，内容相同不重写，根 `AGENTS.md` 和业务记录保持原样。list、help、取消和 dry-run 不初始化目录。目录职责与自定义规则位置见[持久化规范](persistence-roots.md)。

根 `licenses/` 和 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)随源码及 npm 包分发，独立技能内的原生法律文件随包保留。安装器不创建、维护或删除项目的 `.agents/skills-hub-licenses/`。

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

安装器先统一检查技能和领域导航路径，再取得 `.agents/.skills-wta-install.lock/` 与 `.agents/.skills-hub-install.lock/` 两把锁。旧锁名用于与早期安装器互斥。取得锁后重新检查计划，把所选文件复制到同一文件系统的临时目录，切换技能，最后写入导航。

普通复制、切换或导航写入异常会尝试恢复本次替换前的技能和模板原字节，清理本次新建导航与空目录；安装前已有业务资料不会被回删。恢复失败会报告需要人工处理的路径。断电、强制结束及外部程序并发修改不在完整事务保证内。

异常终止留下锁时，先确认没有新旧安装进程，再移除遗留锁并检查备份。运行中的锁不能删除。即使技能全部 `unchanged`，补齐或更新导航也会取得相同锁。

## 独立 ops 领域

```sh
npx @namewta/skills-hub@latest install --domain ops --dry-run
npx @namewta/skills-hub@latest install --domain ops
```

任意 ops 选择只触发 `.agents/ops/AGENTS.md`，不生成服务器清单、项目、run 或其他业务事实，也不连接服务器。完整领域方法和独立工作根用法见[ops 说明](ops.md)。

安装器不自动安装兄弟依赖。需要完整领域协作时选择整组；只选择专门技能时，缺少的方法需要另行安装或由实际能力完成。

## 从 skills-wta 迁移

在原目标项目根目录，改用 `@namewta/skills-hub` 并选择原来需要的技能。新旧工具都安装到 `.agents/skills/<技能名>/`，不会因包名变化生成第二套目录。

已有 `.agents/skills-wta-licenses/`、`.agents/skills-hub-licenses/` 与 `.agents/.skills-wta-backups/` 保留原样；新工具只管理自己的技能备份。恢复旧备份时按其真实原路径选择。npm 的旧包名不会自动变成新包名，后续安装使用 scoped 包或当前源码入口。

## 领域持久化根目录迁移

安装器升级不自动移动或删除项目资料。旧 `.agents/wtadev/` 中的开发资料对应到 `.agents/dev/` 同职责子目录，`system/<host>/` 对应到 `.agents/system/<host>/`。先清点和备份，再逐文件核对冲突、合并内容并修复链接，详见[迁移顺序](persistence-roots.md#从早期-agentswtadev-迁移)。

## 开发交接入口迁移

使用旧版 `dev-workflow` 的项目，一起更新调用者并安装负责交接的技能：

```sh
npx @namewta/skills-hub@latest install --skill dev-workflow dev-handoff
```

完整开发套件可直接更新整个 dev。部分安装还应更新实际使用的 help、learn、plan 等调用者。整包替换会移除 workflow 内的旧交接方法；只新增 handoff 而保留旧 workflow 会留下两份方法。项目已经生成的 `handoff.md`、规格和计划继续保留原位置，使用方式见[开发交接](dev-handoff.md)。

## 开发原型入口迁移

确认原型和探索原型的方法统一由 `dev-prototype` 维护。旧版 `dev-build` 的项目至少一起更新两个包：

```sh
npx @namewta/skills-hub@latest install --skill dev-build dev-prototype
```

完整流程建议更新整个 dev，使规格、UI、计划、实施、审查、验证、交接和帮助入口同时使用当前引用。安装器不自动补齐这些调用者。

整包替换会移除 build 内的旧原型资源，已有 change、原型资源和用户确认记录保持原位置。实际使用见[可视化意图确认](dev-prototype.md)。

## 合并后的 UI 入口

使用过 `dev-figma-design` 的项目，改用 `dev-ui-design`。先核对旧目录中的自行修改，把需要保留的偏好与当前资源对照处理；再将旧目录移到技能扫描范围外的备份位置，安装或更新 `dev-ui-design`。

只在 `.agents/skills/` 内改名仍可能让宿主发现旧入口。安装器不自动删除退役或未选中的技能，项目设计记录也不因入口合并而移动。

## 恢复与卸载

恢复前停止正在读写对应技能的工具，核对备份，另行保留现有目录，再把选定备份移回 `.agents/skills/<技能名>/`。按包恢复，不用整个 `.agents` 覆盖项目资料。

卸载时移走对应技能目录即可。安装器没有递归清空项目的命令，也不删除 dev、system、ops 的业务记录。旧许可目录由使用者自行管理；再次分发仍须保留适用法律文件，范围见[统一第三方声明](../THIRD_PARTY_NOTICES.md)。

## 平台与工具

Windows、macOS、Linux 使用同一组 Node 命令。路径含空格时按所用 shell 加引号。显式参数安装核心使用 Node 标准库；交互模块使用 npm 声明的终端 UI 依赖。

源码和目标中的符号链接、设备与管道会被拒绝。文件相等判断比较路径和内容，POSIX 还比较执行位；不把空目录、修改时间或其余权限当作包内容。在仓库的 `skills/`、`upstream-skills/`、`licenses/` 及其子目录中安装会被拒绝，避免递归写入自身。

安装器不执行技能脚本、不下载技能运行工具、不连接外部账号。支持 `.agents/skills/` 的 Agent 按自身发现规则读取，其他宿主可以显式加载入口。执行某技能还需具备该任务声明的工具、环境与授权。
