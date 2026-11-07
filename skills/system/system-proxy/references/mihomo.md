# Clash / Mihomo 配置要点

## 目录

- [找实际配置来源](#找实际配置来源)
- [规则和 DNS 分开处理](#规则和-dns-分开处理)
- [加载与实际请求](#加载与实际请求)
- [本地完整资料](#本地完整资料)

## 找实际配置来源

先记录客户端和内核的实际版本。Clash Verge Rev、FlClash、便携版和多实例的位置不同，以 GUI 和活动实例确认，不取第一个同名目录。

区分订阅原文、用户覆写/merge、全局设置和客户端生成的最终配置。优先改官方支持的持久入口，生成文件只用来验证结果。不要直接改 runtime 文件来绕过客户端。

Clash Verge 的订阅级 DNS 开关与全局开关可能独立；GUI 旧表单可能把旧值重新保存，修改后检查当前订阅和生成配置。FlClash 的 JSON/SQLite 内部字段不作为跨版本 API；未知格式使用受支持界面，不猜字段、删 WAL/SHM 或直接写库。

多个覆写层的列表替换、map 合并与空对象删除语义必须实测或查当前版本。空 `{}` 不保证旧策略消失。只导入成功不足以证明最终配置正确。

## 规则和 DNS 分开处理

规则按真实首命中顺序分析。保持用户局域网、企业网络与既有业务策略，新的目标规则放在实际截获它的规则前。不要用 `*claude*` 一类宽泛匹配代替域名/进程证据。

| 配置/概念 | 应检查什么 |
|---|---|
| `nameserver` | 普通域名上游身份与实际连接路径 |
| `nameserver-policy` | 优先策略是否覆盖了默认选择，企业 split DNS 是否仍需保留 |
| `proxy-server-nameserver` | 代理节点域名的 bootstrap，是否依赖尚未建立的同一隧道 |
| `default-nameserver` | 解析 resolver 主机名的引导；当前文档要求 IP 地址形式，可为加密 DNS |
| `direct-nameserver` | DIRECT 流量的解析路径，与业务上游分别核对 |
| `respect-rules` | DNS 遵循规则不等于必经代理；还需要可用的节点解析 |
| DNS URL 的 `#代理名` | 名字必须匹配实际代理/组；文档说明找不到会当作接口名 |
| `fallback` | 当前版本是否并行发送查询，以及这些 resolver 是否在用户选择内 |
| `fake-ip` | 地址映射和过滤列表，不等于所有应用 DNS 已劫持 |
| TUN / `dns-hijack` | 实际平台、TCP/UDP 53、LAN DNS、原生 IPv6 和其他 VPN 的行为 |

先确定目标是“业务按规则分流”“受保护应用不直连”还是“指定公网 DNS 只走代理”；这些要求不同。不要为了一处网站超时自动把全机改 global、换所有 resolver 或禁掉 IPv6。

公共 resolver 的身份与经过哪条连接分开决定，不固定某家服务。保留企业/本地域名需求。节点 bootstrap 确需直连时要明确这项例外及查询暴露，不能继续称作“全部 DNS 经代理”。

DNS-over-HTTPS 需要正确证书与 SNI，不机械把域名替换成 IP。不填未验证的监听地址/端口到系统网卡；常规系统 DNS 设置不接受 `127.0.0.1:1053`。

## 加载与实际请求

候选配置使用真实内核支持的语法检查；先看本机帮助，并确认检查是否会读取 provider/Geo 数据或联网。保留已知可用的 stack/MTU，示例文档里的数值不是优化建议。

1. 备份本轮持久配置和作用域，确认恢复路径。
2. 应用最小的规则或 DNS 变更。
3. 导出/读取完整有效配置，确认覆写没有丢字段或恢复旧策略；controller 的局部配置接口不一定包含完整 DNS。
4. 核对活动内核已加载，再重现原应用请求，观察首命中规则和最终节点。
5. 验证 DNS/IPv6 的实际路径与选定目标一致；剩余部分标未验证。

不要仅依据 resolver 出口国家推断成功/泄漏；anycast、转发和地理库都会影响显示。DNS 通过不能代替真实业务请求，某个网站 403 也不自动证明解析错误。

## 本地完整资料

- 持久配置与生成结果：[Clash Verge Rev](clash-verge.md)、[FlClash](flclash.md)。
- 字段含义、优先级和协议：[DNS 字段与类型](dns-fields.md)。
- 方案、启动依赖和实际报文：[DNS 工作流](dns-workflow.md)。
- 系统接管与地址族：[TUN 与系统 DNS](tun-dns.md)、[平台 DNS](platform-dns.md)。
- 浏览器旁路：[浏览器隐私](browser-privacy.md)。
- 分阶段变更、证据与恢复：[事务验收](acceptance.md)。
- 规则失败与性能：[分层排错](troubleshooting.md)、[网络性能](network-performance.md)。

字段说明用于形成与检查方案，不是可以直接覆盖用户配置的模板。先核验实际版本，再确定本轮修改。

## 本地完整资料

- 持久配置与生成结果：[Clash Verge Rev](clash-verge.md)、[FlClash](flclash.md)。
- 字段含义、优先级和协议：[DNS 字段与类型](dns-fields.md)。
- 方案、启动依赖和实际报文：[DNS 工作流](dns-workflow.md)。
- 系统接管与地址族：[TUN 与系统 DNS](tun-dns.md)、[平台 DNS](platform-dns.md)。
- 浏览器旁路：[浏览器隐私](browser-privacy.md)。
- 分阶段变更、证据与恢复：[事务验收](acceptance.md)。
- 规则失败与性能：[分层排错](troubleshooting.md)、[网络性能](network-performance.md)。

字段说明用于形成与检查方案，不是可以直接覆盖用户配置的模板。先核验实际版本，再确定本轮修改。

## 本地完整资料

- 持久配置与生成结果：[Clash Verge Rev](clash-verge.md)、[FlClash](flclash.md)。
- 字段含义、优先级和协议：[DNS 字段与类型](dns-fields.md)。
- 方案、启动依赖和实际报文：[DNS 工作流](dns-workflow.md)。
- 系统接管与地址族：[TUN 与系统 DNS](tun-dns.md)、[平台 DNS](platform-dns.md)。
- 浏览器旁路：[浏览器隐私](browser-privacy.md)。
- 分阶段变更、证据与恢复：[事务验收](acceptance.md)。
- 规则失败与性能：[分层排错](troubleshooting.md)、[网络性能](network-performance.md)。

字段说明用于形成与检查方案，不是可以直接覆盖用户配置的模板。先核验实际版本，再确定本轮修改。
