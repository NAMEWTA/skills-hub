# DNS 设计与可执行工作流

## 1. 明确“只用代理 DNS”的含义

要控制两个独立维度：**谁解析**（批准的 resolver）与**怎么到达它**（指定代理组/隧道）。第三方公共 DoH 不因为配置进客户端就成了“代理商提供的 DNS”；代理商未发布 DNS 地址时不能猜。优先使用其正式提供且在代理内可达的 DNS；没有时让用户选择可信上游，并说明它仍能看到查询。

无既定方案时，优先评估地址明确、无需额外认证、启动依赖清楚的 DoH/DoT 端点，以减少隐式 bootstrap 和敏感信息输出。私有 provider DNS、带认证 URL、域名形式 DoH 或复杂企业 split DNS 可人工设计，但不擅自换成公共服务。**不要把域名 DoH 的 URL 生硬改成 IP**：证书/SNI 未必支持；保持证书校验，以实际服务信息为准。

规则模式中业务可 DIRECT，但其公共 DNS 也可全部从代理发出。若用户要求业务也全不直连，必须另定义受保护应用/域名和断线隔离，不用 DNS 配置冒充业务 kill switch。`.local` mDNS、企业域、路由器名和 DHCP 是独立网络需求，不把它们当成必须送公共 resolver 的网站；严格目标与这些需求不兼容时先停止，不静默加例外。

## 2. 解析路径与启动依赖

分别记录：应用 DNS → OS stub/实际网络服务 → TUN DNS 劫持 → Mihomo resolver → resolver 的 TLS 连接 → 代理组 → 最终节点。业务请求另记录目标规则与最终链。

以下字段说明以 Mihomo v1.19.32 的已知行为为定位线索；当前客户端和内核必须逐项核验。完整本地材料见[字段与类型](dns-fields.md)和[TUN 与系统 DNS](tun-dns.md)：

| 字段 | 作用 | 容易遗漏的问题 |
|---|---|---|
| `nameserver` | 普通域名的默认上游 | 隐私优先的上游见第 6 节；连接仍可能 DIRECT |
| `nameserver-policy` | 特定域名优先上游 | 比默认上游优先；旧 `geosite:cn`/system 仍会生效 |
| `direct-nameserver` | DIRECT 业务出口的域名解析 | v1.19.32 解析时固定不走 `respect-rules`。没有 `#组名` 就从默认网卡直连。留空才回落到主解析器；片段在加载文件里丢失后仍留下裸域名，比留空更差。`system` 会把查询交给操作系统 |
| `default-nameserver` | 解析 resolver 域名的引导 DNS | 必须是纯 IP，可加密。它不继承 `respect-rules`，也不要抄进业务查询 |
| `proxy-server-nameserver` | 解析代理节点的域名 | 同样不继承 `respect-rules`。若仍经尚未启动的同一代理，会产生循环依赖 |
| `proxy-server-nameserver-policy` | 节点域名的专门策略 | 可覆盖节点 bootstrap，必须一起审阅 |
| `respect-rules` | 让 `nameserver`、`fallback`、`nameserver-policy` 在没有片段时使用代理名 `RULES` | 不等于强制代理，也不作用于 direct/default/proxy-server 三类列表。文档要求非空 `proxy-server-nameserver` |
| `URL#组名` | 指定这条 DNS 连接走该代理或组 | 组名必须与真实组一致；对不上时按网卡名解释。`#` 前有空白时，Mihomo v1.19.32 使用的 YAML 解析器会把后面当成注释 |
| `fallback` | 与主解析器并行的另一组上游 | `fallback-lazy-query` 默认关闭时，每次查询都会发给回退列表，不是失败后才查。本方案保持空列表，不把国内解析器放进来 |
| `fake-ip` | 向应用提供映射地址 | 不保证 OS/浏览器解析都到达内核 |

因此要求严格代理解析的方案应将普通、DIRECT 业务解析和 resolver 引导 DNS 都显式绑定批准组，而不是只依赖 `respect-rules`。IPv4/IPv6 numeric 上游必须自己提供；不会发起本地 DNS 来寻找服务器。

### A. 不允许节点引导直连：严格但有前置条件

选择禁止节点引导解析的方案。候选使用 `proxy-server-nameserver: ["rcode://refused"]` 拒绝意外的节点域名解析；所有静态节点地址须已确定，动态 providers、域名节点或未知成员会阻止应用该方案。不能为通过检查而静默把节点域名替换成旧 IP，证书/SNI、地址变动和订阅更新仍需管理。

`default-nameserver` 与一般上游使用显式 `#组名` 的 numeric 加密地址；不会依赖本地 resolver 去解析 DoH 主机名。无已可用节点时不能保证启动。候选语法依据 Mihomo v1.19.32 的解析实现，不保证其他版本；**必须用用户实际版本检查与冷启动测试**。`rcode://refused` 的存在不代表已经完成 OS 防泄漏或 crash 隔离。

### B. 加密引导直连：可审计的启动例外

当订阅依赖节点域名，且用户批准启动解析在隧道外进行，可填：

```yaml
# 运行端点示例，不是文档引用；只有用户选择并验证后才使用。
proxy-server-nameserver:
  - "tls://9.9.9.9"
```

这里的地址仅演示格式，不是替用户选择。该列表只填经过认可的加密 numeric resolver，不填运营商、`system`、DHCP 或明文地址。仍只用于节点域名；普通、DIRECT 业务和 resolver 引导 DNS 继续显式走代理。**此模式存在直连 DNS 连接，不能报告“全部 DNS 经代理”**；运营商仍看到与 resolver 的连接元数据，resolver 会看到本地出口和节点查询。没有例外授权就阻止应用，不自动降级。

若连批准的 bootstrap 也不可达，先保留原配置并报告受阻。不要关证书校验、随意改端口或自动改用明文。若用户明确允许第 6 节的明文节点引导例外，还需单独说明明文查询暴露与直连范围；不能暗中降级。

## 3. 形成、合并与检查候选

使用客户端支持的编辑界面或可信本地 YAML/JSON 解析工具；不使用正则解析完整 YAML，也不把生产配置上传到在线转换网站。没有可用解析器时，通过客户端界面完成已知字段的修改和完整导出，不伪造脚本输出。

从客户端导出**完整实际生成配置**到用户私有目录。只有模式与端口的 `/configs` 响应不算完整配置。保留必要组、节点、TUN 和 DNS 信息；配置可能含密码，只在本机处理，不加入 Git。动态 provider 成员缺失时，取得可信展开视图后再继续，不从摘要猜测。

用[网络记录模板](../assets/network.md)写清保护组、批准 resolver、IPv6 策略、保护域名、业务规则范围、节点引导策略和例外。域名业务规则与 DNS 范围分开：保护某些业务目标，不自动表示只会为这些目标生成 DNS 查询。

候选只包含本轮相关字段的前后差异，保留未知键。它不是可直接启动的完整订阅。默认不改 `dns.listen`、系统代理、stack、MTU 或缓存参数。fake-ip 启用前检查与 LAN/VPN 的地址冲突和缓存旧地址，不把整个 `198.18.0.0/15` 当成公网目标。

**空 map 的合并陷阱：** `nameserver-policy: {}` 在某些递归合并中不会删除旧键。明确当前客户端的 map 替换和列表合并语义，导出最终完整配置重新检查。已有企业 split DNS 时先理解其用途，用户未授权移除就保留；内部域仍须本地解析时，采用标明例外的方案，不用严格公网模板覆盖。

检查已有第一命中规则，尤其进程规则、IP 规则、GEOIP、RULE-SET 与 MATCH。只修正已证实的优先级冲突，不擅建组、改节点选择或删除旧业务规则。使用实际内核支持的校验方式检查完整隔离候选；先看本机帮助，确认是否读取 provider 或地理数据，不能未经核验把它称作离线检查。

通过支持的 GUI 层导入或修改持久配置。生成文件只读，不直接覆盖。重新导出完整生成结果，核对 `nameserver-policy`、`proxy-server-nameserver-policy`、`fallback`、`direct-nameserver` 和所有 `#组名` 后缀，再确认活动内核加载。静态字段正确仍不证明系统路径或整机不旁路。

## 4. 真实 DoH 报文验证

只有任务允许相关网络诊断时才请求实际端点。下面地址是**命名占位端点**，运行前替换成用户选择且已核验的真实 DoH 端点，不可直接请求占位域名；它不是文档依赖；`7890` 为示例端口。先核实实际代理端口、选定 resolver、证书与信息披露。外部 resolver 会看到测试域名和代理出口，不携带 API key、Cookie 或节点密码。

可以用本机现成的 DNS 工具生成并解析 RFC 8484 DNS 报文。没有此工具时，下面 Python 标准库示例仅在私有临时目录生成 A 查询，不联网：

```python
from pathlib import Path
import struct

# 使用已批准的中性测试域名；28 表示 AAAA，1 表示 A。
domain = "example.com"
query_type = 1
query_id = 0x4A31
labels = domain.encode("ascii").split(b".")
assert all(0 < len(label) <= 63 for label in labels)
question = b"".join(bytes([len(label)]) + label for label in labels) + b"\x00"
header = struct.pack("!HHHHHH", query_id, 0x0100, 1, 0, 0, 0)
Path("dns-request.bin").write_bytes(header + question + struct.pack("!HH", query_type, 1))
```

在相同私有目录，经实际代理发送查询：

```bash
curl -q --proxy http://127.0.0.1:7890 --noproxy '' \
  --connect-timeout 10 --max-time 20 \
  --header 'Content-Type: application/dns-message' \
  --header 'Accept: application/dns-message' \
  --data-binary @dns-request.bin \
  --dump-header dns-response.headers --output dns-response.bin \
  --write-out '%{http_code} %{content_type}\n' \
  https://resolver.example/dns-query
```

PowerShell 使用 `curl.exe`，按原生 shell 续行与引用规则改写；不要误调用 `curl` 别名。`-q` 放在首个选项以跳过默认 curl 配置，`--proxy` 与 `--noproxy ''` 明确此请求路径。不使用 `-k`，不跟随重定向，不在失败后改直连。

分别生成 A 和 AAAA 请求。核对 TLS、HTTP 200、DNS MIME、事务 ID、question、压缩指针和长度，再区分正常答案、NODATA、NXDOMAIN 与 DNS 错误。没有可靠 DNS 报文解析能力时，只报告已核实的 TLS/HTTP 传输，DNS 内容仍未验证；HTTP 200 不能代替 DNS 语义成功。

DoT 的静态审查与 DoH 实测分开，不能把上述命令说成 DoT 实测。numeric HTTPS 不被服务证书支持时，使用该服务真实支持的地址，不欺骗 TLS。AAAA 是记录类型，不代表 IPv6 传输；IPv6 literal resolver 才直接涉及该地址族的传输测试。

**显式请求本地代理端口只证明进入代理，业务规则仍可能选择 DIRECT。** 必须核对请求最终策略链。这个请求也没有调用内核内部 DNS 解析模块，因此不能替代候选 `nameserver/#组名` 的实际加载与流量验证。

**显式代理探测不测试 OS TUN 的 DNS 拦截。** 系统路径另用[平台 DNS](platform-dns.md)和[事务验收](acceptance.md)中的原生解析、物理接口及内核证据核验。失败保留证据，不把正常 NXDOMAIN/NODATA 当作泄漏。临时文件仅包含本次测试，完成后按需要清理，不保存无关用户查询。

## 5. 为什么不能只看网页上的 DNS 国家

检测站通常通过随机域名观察递归 resolver 的出口，可能与业务节点不同。Anycast、转发链、服务商出口和地理数据库可能影响显示。出现运营商地址，只说明至少有一条查询没有使用批准的 resolver；不能据此把国内解析器、`system` 或 DHCP 加进覆写。正确证据是：批准 resolver、观察到 DNS 的路由路径、物理接口没有该测试的未授权外发，以及真实应用规则链；IP 所在国家只是线索。

查询没进入内核时，四个 DNS 输入框不会改变结果。`dns-hijack` 只看见已经进入 TUN 的包。发往同网段路由器的 53 端口、另一块网卡上的 DNS、TCP 53 未列入劫持、浏览器自己的 DoH 和 IPv6 DNS，都要按 [系统 DNS](platform-dns.md) 单独看。Windows 会同时查询 TUN 网卡和物理网卡上的 DNS。

不要声称普通 DoH“很难被封”“隐私性最高”或绝对隐藏目的。DoH/DoT 保护到 resolver 的内容，但 resolver 自己可见，连接元数据仍可见；明文 DNS 经加密隧道到 VPN resolver 与本地明文外发也不能混为一谈。清缓存仅去掉旧答案，不改变这些路径。

## 6. 隐私优先：隐藏真实地址并访问 AI

仅当本次用户明确选择本节目标时适用；否则不默认启用，先按实际应用、解析范围和可接受例外制定方案。选择该目标后，探测和候选按本节范围执行；不要把某一台电脑上 53/443/853 的结果写成所有机器的默认值。代理开启后，先选择用户认可的解析服务；例如 Google（`8.8.8.8`、`8.8.4.4`）或 Cloudflare（`1.1.1.1`、`1.0.0.1`）可作为候选，但不固定服务商或按国家代替信任判断。也可采用代理服务明确提供、且在隧道内可达的 DNS。以下数值是运行端点示例，不是文档依赖。`nameserver`、`default-nameserver`、`direct-nameserver` 的候选用它们的 DoT 或 numeric DoH。数字地址在保护组里没有回包时，才按下面的人工步骤改用同一服务商的域名 DoH。`proxy-server-nameserver` 只用同一组里、物理网卡探测实际能通的地址；`fallback` 保持空。未经用户选择的公共 DNS 不进入这些字段。打开代理不会改写订阅正文，该订阅的 DNS 覆写关掉后，正文里的国内 DNS 会重新生效。Amazon Route 53 与 Starlink 没有可填进这些字段的公共递归解析器。

`mode: rule` 时，`nameserver` 和 `direct-nameserver` 每条都带 `#保护组`。组名里的空格和符号做百分号编码，YAML 里整段加引号。编码是为了让组名里的空格不把标量拆开；不要在 `#` 前再插入空格或换行。只打开 `respect-rules` 时，没写组名的 `nameserver` 仍按路由规则选择出口，但 `direct-nameserver` 不会。直连规则要先得到真实地址；这条查询若从物理网卡去连 853 或 443，而该网卡到批准解析器的加密端口不通，国内站点会报 `dns resolve failed`。`direct-nameserver` 为空时回落到 `nameserver`，所以 `nameserver` 的组名不能省。加载后的文件若丢掉片段，把 `direct-nameserver` 留空，不要保留裸域名。`proxy-server-nameserver` 不加组名，它才是物理网卡上的节点引导。业务上游已是数字地址时，方案仍把 `default-nameserver` 钉在批准的加密地址上，不把明文 bootstrap 抄进这个字段。`mode: global` 的业务上游不加组名，由 `respect-rules` 跟随 GLOBAL。

Clash Verge 的 DNS 对话框可以和 `dns_config.yaml` 不一致。回退框里残留的国内 DoH 或未回包主机名，在保存时会写回源文件。先让四个框与磁盘一致，再保存。生成文件可能去掉引号；对 Mihomo v1.19.32，`dns-query#编码` 这种 `#` 前没有空白的标量仍会保留片段。验收读生成文件和内核日志里的实际上游与连接链，不把覆写源或对话框当成已经生效。没有回包的主机名不追加进业务列表。国内 CDN 可能因此不是本地最优，节点关闭时直连网站的解析也会失败；不以未批准解析服务换回可用性。

组名钉上之后，用一次真实 DNS 交换选定传输。TCP 握手完成，或客户端已经上传数据但下载字节为 0，都还没有答案。同一保护组里，到批准解析器数字地址的 DoT 和 numeric DoH 都没有回包，而普通 HTTPS 网站能完成时，这条节点路径没有把这些解析器地址的响应送回来。下一步改用该服务商自己的域名 DoH，并保留同一个组名：`https://resolver.example/dns-query#<百分号编码组名>`。让保护组把域名交给节点解析，不要先在本地换成刚才没有回包的 IP。域名 DoH 需要重新核对证书、SNI 与启动依赖；引导只用已批准的 bootstrap，不擅自添加另一个 resolver。域名 DoH 也没有回包就停止，保留原来的直连规则，不退回未批准的 `system` 或其他 DNS。

### 先探测物理出口，再选 bootstrap

探测必须绑定非 TUN 网卡的源地址。经虚拟网卡成功只说明代理出口通，不能证明节点域名能在隧道建立前解析。

| 物理网卡结果 | 方案里的节点引导 | 业务 `nameserver` |
|---|---|---|
| 批准的 `tls://` 或 numeric DoH 可连通 | 加密引导直连，并说明直接连接的元数据与节点查询暴露 | 同一批准集。`mode: rule` 时带 `#保护组`；`mode: global` 时不带组名，靠 `respect-rules` 跟随 GLOBAL |
| 加密端口超时，且 `tcp://` 到同一公共 IP 的 53 端口对中性域名返回未污染地址 | 用户明确允许节点引导直连与明文暴露后，才使用明文引导例外 | 仍是经代理的加密批准集，不改成明文 |
| 加密与明文都不通，或明文答案被污染 | 保持原配置，状态为受阻 | 不改 |

明文节点引导例外只放入 `proxy-server-nameserver`。路径上能看到节点域名；resolver 能看到本机出口和节点查询。记录明确标注“明文节点引导例外”，不能写成“全部 DNS 经代理”。不能把 `system`、DHCP 或任意未批准 resolver 偷偷加入该例外。

### 该隐私方案需分别决定的行为

- 如选择 fake-ip 与禁用并行回退的方案，逐项核对 `enhanced-mode: fake-ip`、`prefer-h3: false`、`fallback: []`、`fallback-filter.geoip: false` 的适用性，不作为任意故障的默认覆盖。回退列表为空时打开 GeoIP 过滤，会把不属于 `geoip-code` 的答案当成污染且无处回退；国家码缺省时界面常显示 CN，不代表策略是中国。不要把出口所在地（例如 TW 或 US）填进这个代码来代替过滤开关。
- 用户选择阻断 IPv6 时，核对顶层 `ipv6` 与 `dns.ipv6` 为 false 的适用性；若需要支持 IPv6，则验证完整隧道路由，不自动禁用。这只让内核拒绝 IPv6 并停发 AAAA，不关闭操作系统自己的 IPv6。
- `direct-nameserver` 与本节的 `#保护组` 规则相同，不填 `system`。
- fake-ip 过滤默认保留原列表。只有用户要求应用不能看到真实地址时，才把过滤缩到本地域名和该平台的连通性检测名，并单独说明被移出的公网域名。
- `mode: global` 时，[规则片段](../assets/protected-rules.yaml)中的前置规则不生效。AI 是否流畅取决于 GLOBAL 当前叶子、fake-ip 是否避免本地等待，以及 [网络性能](network-performance.md) 里的 UDP/QUIC 对照。规则模式才把这些域名放到保护组前面。

### 复制到另一台电脑

只复制 DNS 覆写源文件，不复制运行时生成配置或整个配置目录。每份订阅都要打开自己的覆写开关；订阅正文里的国内 DNS 在开关关闭时恢复生效。到新电脑后重做物理网卡探测，再制定方案。同网段路由器上的 DNS、应用自带的 DoH，以及节点明文 bootstrap，都不会因为这份文件而自动改用所选解析服务。
