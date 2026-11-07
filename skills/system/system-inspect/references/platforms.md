# 按实际平台取证

先在真实目标执行，记录命令是否存在与观察时间。以下均为小范围、只读起点；只选与症状相关的部分。输出中的用户名、主机、内网地址和文件路径在对外分享前脱敏。

## Linux、WSL、容器

```bash
cat /etc/os-release
uname -m
df -h .
df -i .
free -h
vmstat 1 3
```

- `df .` 只描述当前目录所在文件系统；要检查根卷或另一个挂载就明确传入对应路径。
- 首次 `vmstat` 行通常是累计统计，后续间隔样本更适合当前负载。低 free 不等于内存故障，检查 available、swap 和实际压力。
- 有 systemd 才用 `systemctl --failed`、`journalctl --disk-usage`。只抽取相关服务与时间段，避免完整日志导出。
- 需要热点时可用 `ps -eo pid,comm,%cpu,%mem --sort=-%cpu` 查看名称与指标；不要默认收集带凭据的完整进程参数。
- 容器的 CPU/内存限制以相应 cgroup 或平台配额为准；宿主总量不能作为容器容量。WSL 的虚拟盘空间和 Windows 宿主空间分别测量。
- 空间证据指向具体目录后，再用 `du -xhd 1 /approved/path` 等本机支持的参数下钻；不跨挂载反复遍历。

不在诊断时执行 `drop_caches`、`swapoff`、`sysctl`、Docker prune 或日志 vacuum。

## Windows

使用原生 PowerShell；WSL 的读数不代表 Windows 宿主。

```powershell
$PSVersionTable.PSVersion
Get-CimInstance Win32_OperatingSystem |
  Select-Object Caption,Version,OSArchitecture,FreePhysicalMemory,TotalVisibleMemorySize
Get-Volume | Select-Object DriveLetter,FileSystem,Size,SizeRemaining
Get-Process | Sort-Object CPU -Descending |
  Select-Object -First 10 Id,ProcessName,CPU,WorkingSet64
```

`CPU` 是累计处理器时间，不能单凭这张表认定当前最占 CPU。用任务管理器/资源监视器的短时采样或当前系统支持的性能计数器验证。计数器名称受系统语言影响，不假定英文路径通用。

先区分物理卷、WSL/Docker Desktop VHDX、网络共享与云文件。硬链接、压缩、稀疏文件、junction 和 OneDrive 占位文件会影响体积判断；扫描不要跟随重解析点或触发云文件下载。

不要因空间小而更改 pagefile、组件存储、WinRE、还原点、Defender 或 Windows 更新维护。

## macOS

```bash
sw_vers
uname -m
df -h .
vm_stat
```

活动监视器的内存压力与交换比“空闲内存”更有意义。需要 I/O 时核对本机 `iostat` 帮助后做数秒采样。Apple Silicon 上区分原生与 Rosetta 进程，不为了统一路径移动工具链。

APFS clone、快照、purgeable 空间与 iCloud 占位文件使目录逻辑体积不同于可释放量。先从明确的本地缓存或项目目录看起；不遍历全部 Library 或下载云占位文件。

不默认删除 Time Machine 快照，也不关闭 SIP、Gatekeeper、Spotlight 或全部登录项来“加速”。

## 网络和工具链

网络问题分清应用 → 代理监听 → 路由 → DNS → TLS → 服务响应。需要联网取证时使用与故障相关、已在任务范围内的最少请求，不把全网测速当作默认体检。

工具链只检查当前会话解析到的具体命令、版本与项目锁定配置。可能启动插件、更新或下载的 doctor 命令先查本机说明；不批量启动全部 MCP 服务或登录账号。

## 比较结果

测量前后的工作负载、输入、机器状态和采样窗口应可比。空间回收、构建耗时、响应延迟是不同指标；没有复测不写提升百分比。下一步精确到目标与验证方法，不能只给“一键优化”建议。
