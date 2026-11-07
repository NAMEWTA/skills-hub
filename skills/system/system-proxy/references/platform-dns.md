# 原生系统 DNS 的现场核验

先确认实际主机与网络命名空间。WSL、容器、远程 SSH 和宿主有不同 resolver、接口和 localhost。只收集本次需要的信息，对外脱敏内部域名、地址、其他用户连接和凭据。

## macOS

用 `scutil --dns` 查看实际 resolver、作用范围与接口，用 `scutil --proxy` 查看系统代理，用 `networksetup -listallnetworkservices` 找真实服务名。不要假设服务一定叫 Wi-Fi。

结合 `route -n get default` 和 `netstat -rn -f inet6` 查看默认路由及 IPv6。GUI 系统代理不意味着每个 CLI 库都会采用。删除手填 DNS 可能恢复 DHCP resolver，不等于让 TUN 接管。

在允许网络诊断时，从受影响的原生应用触发一个可定位请求，按时间关联内核日志、路由及必要的物理接口证据。缓存命中不会产生新查询，需要区分，不为证明结果反复清所有缓存。只有任务已经包含缓存刷新时才运行对应动作。

## Windows

原生 PowerShell 检查 `Get-NetIPConfiguration`、`Get-DnsClientServerAddress`、`Get-NetRoute -AddressFamily IPv6` 与 `netsh winhttp show proxy`。用户互联网代理、WinHTTP、环境变量、浏览器和 WSL 分开记录。

多接口情况下可能同时向 TUN 与物理接口 DNS 发送查询。必须用真实解析与接口证据判断，不只看虚拟网卡 DNS。系统 DNS 地址一般不接受 `127.0.0.1:1053`；未证明本地监听、端口与服务可靠前，不给网卡写回环 DNS。

WSL NAT、镜像网络与宿主代理可达性随版本变化。只读确认真实监听和网络模式；WSL 中的 `127.0.0.1` 不自动代表宿主服务。删除某个环境的配置不能代替验证另一个环境。

## Linux、容器与远程

读 `/etc/os-release`、`ip route`、`ip -6 route`。有 systemd-resolved 时使用 `resolvectl status`；其他系统识别实际管理器。`/etc/resolv.conf` 可能是 stub、符号链接或由容器管理器生成，仅看它不能判断全部路径。

检查受影响进程实际继承的代理与 DNS 配置，不输出完整环境变量。systemd 用户服务、系统服务、图形会话与 shell 可能不同。容器内的 DNS 转发和宿主 resolver 各自核验，不用改宿主路由掩盖容器没有代理。

## 修改与验证

保持范围：系统 DNS、TUN、浏览器、IPv6 分阶段，某阶段失败不继续扩大修改。先备份本轮字段、实际网络服务与作用域；修改后读回，并通过同一原失败应用复验。

清缓存只移除旧答案，不能修正路由。AAAA 查询与 IPv6 传输分别记录。物理接口没有看到一次查询，也可能是抓取范围不完整或缓存命中，不能据此作绝对保证。

恢复本轮修改时先查并发变化，冲突停止。网络确实恢复到原路径后才报告恢复完成，见[事务验收](acceptance.md)。
