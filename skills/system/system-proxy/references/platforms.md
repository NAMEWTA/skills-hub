# 真实主机与平台

仅采集与故障相关的字段。以下输出可能含内网地址/域名，对外分享前脱敏；不要输出完整环境变量或配置。

## Windows

在原生 PowerShell 中按需查看：

```powershell
$PSVersionTable.PSVersion
Get-NetIPConfiguration
Get-NetRoute -AddressFamily IPv6
Get-DnsClientServerAddress
netsh winhttp show proxy
```

WinHTTP、当前用户系统代理、应用自己的代理、会话环境与 WSL 是不同层。使用实际客户端界面确认端口/当前订阅，不从旧配置目录猜测。

临时改变代理优先限于独立会话或目标进程；若在当前会话改环境，先记录变量原来是否存在及原值，用 try/finally 恢复。不要默认 `setx`、重置 WinHTTP、改注册表或禁用防火墙。

WSL 的 NAT/镜像网络和宿主可达方式依版本而变；先验证实际地址，不能硬编码 localhost、固定网关或“所有监听 0.0.0.0”。

## macOS

```bash
sw_vers
scutil --proxy
scutil --dns
route -n get default
netstat -rn -f inet6
networksetup -listallnetworkservices
```

实际网络服务不一定叫 Wi-Fi；系统代理不代表所有 CLI 库会读取。区分 scoped resolver、活动服务、其他 VPN 和应用 DoH。

代理配置从 GUI 指向的真实实例取得。不要因测试失败修改全部网络服务、清空 pf、关闭 SIP，或向全局 shell profile/launchctl 写代理值。保留已工作的系统代理，先验证新路径再迁移。

## Linux、容器、远程

```bash
cat /etc/os-release
ip route
ip -6 route
```

有 systemd-resolved 时再看 `resolvectl status`；否则确认发行版实际 DNS 管理器。`/etc/resolv.conf` 可能是符号链接或生成文件，不能直接覆盖当作通用修复。

Shell、systemd 用户服务、桌面应用和容器各自继承环境。只向目标服务加入实际需要的配置，不把一次 shell export 说成全系统已生效。

远程主机和容器的 loopback 属于各自网络命名空间。需要访问宿主代理时先确认可达路径与访问控制；不自动开放公网监听或将 controller secret 发送到未验证主机。

## 浏览器与解析

明确实际浏览器和 profile。浏览器 DoH、WebRTC、扩展代理与登录回调分别处理；不要正在运行时直接改其偏好文件。

关闭浏览器安全 DNS 只有在选定的集中解析路径已实际接管时才有意义；不能把关闭本身当防泄漏。仅为网络修复不改系统语言、账号国家、时区或网站登录态。
