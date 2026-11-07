# DNS 与代理的常见误判

以下表格用于核对证据含义。具体版本与现场路径仍须实际验证。

| 原说法/建议 | 本技能采用的精确边界 |
|---|---|
| 开代理后只用代理提供 DNS | 保留“不用未经批准的本地解析”目标；代理商未提供 DNS 时不虚构地址。resolver 身份与连接是否走代理分别验收 |
| 关浏览器安全 DNS 就能避免泄漏 | 集中解析方案要先证明系统已接管，再关获准 Profile 的 DoH；走代理的获准 DoH 不必关闭 |
| Mac 删除手填 DNS 即自动接管 | 可能恢复 DHCP resolver；要读 scoped resolver 与实际路由 |
| flushdns/flushcache 修复泄漏 | 只清旧答案，不改变 resolver 或隧道路由 |
| DNS 劫持或 fake-ip 可以接管所有查询 | fake-ip 是映射；53 劫持不覆盖所有 LAN DNS/DoH/DoT/DoQ；要看系统和应用路径 |
| HTTP/SOCKS 只转 TCP，必先本地解析 | HTTP CONNECT 可携带域名，SOCKS5 也有远端解析与 UDP 能力；取决于客户端/代理支持与用法 |
| AAAA 泄漏等于 IPv6 DNS 传输 | DNS 记录类型与传输地址族独立，分别测试 |
| DoH 隐私最高、很难封 | 加密保护到 resolver 的内容，不隐藏所有连接元数据、不保证可达或经过代理 |
| DNS 显示节点所在国家就是成功 | 检测的是递归解析出口；anycast、转发链和地理库会影响显示，国家不能证明路径 |
| 检测站出现运营商 DNS，就改回国内解析器 | 这只说明有查询没走批准 resolver。国内解析器、`system` 和回退列表会看到域名，不能用来掩盖同网段路由器或浏览器 DoH 的旁路 |
| WebRTC 总会暴露真实 IP | 取决于 ICE candidate、浏览器策略、UDP/TUN、STUN/TURN 等；分别验收，不把私有地址直接判作公网泄漏 |
