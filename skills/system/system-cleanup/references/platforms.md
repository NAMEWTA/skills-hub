# 平台清理方法

先只读、分类，再执行已有授权覆盖的项目。示例命令要在实际平台核对；它们不是默认执行清单。

## Linux

开始用 `df -h /chosen/path` 与 `df -i /chosen/path` 测对应文件系统。只在授权范围内用 `du -xhd 1 /chosen/path` 下钻；不跨挂载重复统计 overlay 和容器层。

| 对象 | 先观察 | 已明确选择后的处理 |
|---|---|---|
| APT 包缓存 | `du -sh /var/cache/apt/archives`，确认 APT 存在 | 使用该发行版支持的 `apt-get clean`；不混同卸载软件 |
| 孤儿包 | `apt-get autoremove --purge --dry-run` | 只有列表符合范围才执行；保留当前及至少一个可用回退内核和运行时 |
| journal | `journalctl --disk-usage` | 按已选择的保留量/期限 vacuum；持久上限是另一个配置变化 |
| snap 旧修订 | `snap list --all` | 只对确认 disabled 的明确版本执行 `snap remove NAME --revision=REV` |
| 临时目录 | 所有者、用途、活动占用、保留内容 | 一个准确子路径一个动作，保留 /tmp、/var/tmp 本身和活动私有目录 |

不是 APT/systemd/snap 系统就跳过对应项，不为了套流程安装它们。日志保留量不能一律写成 200 MB；以业务排查需求为准。

删除之前检查实际挂载和符号链接。源码、当前会话、运行时与数据库目录不根据 mtime 或体积自动判为废弃。

## Windows

在原生 PowerShell 用 `Get-Volume` 选择目标卷，用 Storage 设置或已验证的工具找高占用目录。不要扫描并打开云占位文件。路径含空格用 `-LiteralPath` 等字面语义；不要跨 junction/reparse point。

优先使用 Windows Storage、应用官方清理器、包管理器和卸载器。执行前核对准确产品/版本/安装路径；退出码之外还要检查对象消失、保留程序能运行。

- 旧 Node/Python/Java/.NET/IDE：先在新会话验证要保留的版本与项目 pin，再卸旧版本；不要拆当前会话依赖。
- 用户临时文件：只处理明确路径、属于已结束任务且不锁定的项；锁定即跳过，不杀进程强删。
- WSL/Docker Desktop：先识别发行版与 VHDX 的所属工作负载。删除 Linux 文件与宿主回收空间是两件事；压缩虚拟盘要求该产品支持的流程、停机范围与备份。
- 不直接删除 WinSxS、pagefile、hiberfil、WinRE、Installer 缓存或更新数据库。确有相关请求时使用 Windows 支持的管理方式，不把它们纳入普通缓存清理。
- 不自动注销 WSL 发行版、清空回收站、删还原点或重启。它们的范围和后果应已得到明确选择。

记录待重启和残留，不能靠卸载器返回成功宣称所有内容已移除。

## macOS

从 `df -h /chosen/path` 和系统 Storage 观察，再选择具体应用或开发缓存。APFS 快照、clone、purgeable 空间与逻辑目录大小不同，最后仍以同一卷空间与功能为准。

- Homebrew 如存在，可先 `brew cleanup --dry-run` 查看候选，执行前核对本机帮助与具体范围。
- Xcode 使用对应项目/工具提供的清理方法，区分 DerivedData、模拟器设备、archive 与签名材料；不可把整个 Developer 目录当缓存。
- 浏览器/IDE 使用其明确缓存功能或已确认的缓存目录；保留 profile、会话、扩展设置、历史和凭据。
- 不清空全部 `~/Library/Caches`，不删 Time Machine 快照/iCloud 占位文件，不以关 Spotlight、SIP 或 Gatekeeper 替代清理。

## 停止条件与验收

对象路径解析到了范围外、包含保留数据、活动程序依赖它、工具 dry-run 与清单矛盾、系统维护正在进行或权限不足，就停止该项并继续不受影响的已批准工作。

每批后比较同一卷可用空间，并检查保留的主要工作流。若执行影响了服务或保留数据，保留现场、停止扩大改动，按真实可用备份恢复；无法恢复就说明事实。
