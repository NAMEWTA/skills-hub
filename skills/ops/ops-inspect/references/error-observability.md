# 只读错误观测

仅当项目已经使用错误观测平台且用户目标需要时加载。本方法使用实际可用的 `sentry` CLI；不要求所有项目安装该工具，不自动运行联网安装脚本。无该能力时使用已有平台的等价只读接口，准确说明覆盖差异。

## 身份、范围与认证

先核实真实组织、项目、环境和时间范围。CLI 可能根据 DSN、源码或目录名自动检测项目，必须与 inventory 的已核验目标对照；错误的自动检测用明确参数覆盖。不要因为缺少参数就查询默认生产环境。

已有认证可直接复用；缺少时让用户在本地认证或设置凭据引用，不把 token、DSN 秘密或完整环境文件贴进聊天/记录。可通过 `sentry auth status` 核实状态，不回显凭据。

先查看实际安装版本的帮助和 `sentry schema <resource>`，确认命令、参数、权限与真实副作用。以下参数是已选目标的示例；替换成核实的值。24 小时和 20 条仅是未给出更精确范围时可说明的有限查询起点，不是统一生产默认值。`prod` 与 `production` 是否同一环境必须由现场事实确定。

## 从列表到事件

1. 按已确认的项目、环境与时间查询，使用机器可读输出和所需字段，避免下载全部事件。

   ```bash
   sentry issue list your-org/your-project --query "is:unresolved environment:production" --period 24h --limit 20 --json --fields shortId,title,priority,level,status
   ```

2. 根据问题短 ID 取得详情，不把数字 ID 当短 ID。需要结构化数据时：

   ```bash
   sentry issue view ABC-123 --json
   ```

   人工阅读可以使用 `sentry issue view ABC-123`。核对返回项目与时间，不把同名问题合并。

3. 查看有限事件，再读取与症状对应的具体事件：

   ```bash
   sentry issue events ABC-123 --limit 20 --json
   sentry event view your-org/your-project/event-id --json
   ```

4. 专用命令缺失时先用 `sentry schema issues` 找到实际端点，再使用明确的只读请求。例如 `sentry api /api/0/organizations/your-org/ --method GET`。不使用修改 issue 状态或配置的 API。

CLI 的分页与重试不等于查询结果完整。记录数量上限、分页是否结束、时间截点和失败范围；只取前 20 条时不能声称不存在第 21 条错误。原数据的 `release` 用于关联发布，不触发发布。

## 输出

问题列表按最近出现时间整理 title、short_id、status、first_seen、last_seen、count、environments、top_tags。初次字段筛选未返回的项目，可用详情补足或标为未取得；不要生成不存在的值。事件详情保留 culprit、timestamp、environment、release、实际来源引用。

明确区别“没有结果”“查询失败”“数据不可读”“只有有限样本”。对外摘要脱敏电子邮件、IP 与个人信息；不要直接输出原始堆栈或 token。运维身份资料中的真实连接定位留在用户指定的受控来源，报告只保留必要引用。

按 execute 的同一 run 记录查询条件、目标、采集时间和脱敏证据。需要解释原因时把观察交给 diagnose，观察报告本身不宣布根因。

## 可选分析服务

某些版本提供 `sentry issue explain ABC-123` 和 `sentry issue plan ABC-123`。只有任务明确需要、真实权限/数据处理范围及调用副作用已经核实时才使用，不把它们当每次只读巡检的必经步骤。返回内容是分析或建议，必须对照原始证据，由 diagnose 判断；修复计划不授权改应用、发布或迁移。

## 例子与反例

用户要求“过去 24 小时生产环境前 10 个未处理问题”：显式核对目标与环境，用 limit 10 查询，返回有来源的排序、数量和最近时间，并说明采样边界。

若 CLI 自动定位到了 staging，而用户目标是 prod，应先纠正目标；不能把 staging 没有错误写成 prod 正常。若限流导致只得到一页，应报告部分结果；不能把 HTTP 请求成功等同完整查询。
