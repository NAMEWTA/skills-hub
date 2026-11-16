# 两个项目与共享服务示例

以下为说明模型的虚构夹具，主机名、ID、路径和状态均不是用户资产，也不代表已完成现场验证。

## 已登记运行对象

| 资源 ID | 稳定实例 ID | 逻辑服务 | 运行定位 |
| --- | --- | --- | --- |
| host-a | shop-web-a | shop-web | systemd `shop-web.service` |
| host-a | shop-api-a | shop-api | systemd `shop-api.service` |
| host-b | shop-api-b | shop-api | systemd `shop-api.service` |
| host-b | shop-worker-b | shop-worker | systemd `shop-worker.service` |
| host-b | billing-worker-b | billing-worker | systemd `billing-worker.service` |
| host-b | pg-main-b | pg-main | systemd `postgresql.service` |
| host-b | redis-main-b | redis-main | systemd `redis.service` |
| host-a | 待核实（发现编号 unknown-a-01） | 未确认 | 一个已发现进程，归属与稳定运行单元待核实 |

## 项目使用关系

| 项目环境 | 服务 | 角色/必要性 | 已确认消费范围 |
| --- | --- | --- | --- |
| shop/prod | shop-web | 组成、必需 | 页面入口 |
| shop/prod | shop-api | 组成、必需 | API 路径 |
| shop/prod | shop-worker | 组成、异步处理必需 | shop 队列 |
| shop/prod | pg-main | 共享依赖、必需 | database=shop、schema=public |
| shop/prod | redis-main | 共享依赖、按具体功能判断 | 缓存前缀 shop:；队列边界另核验 |
| billing/prod | billing-worker | 组成、必需 | 账单任务 |
| billing/prod | pg-main | 共享依赖、必需 | database=billing、schema=public |
| billing/prod | redis-main | 共享依赖、必需 | 已核实的 billing 队列范围 |

真实登记时每组表行还要引用具体声明/观测证据和采集时间，不能使用示例代替核验。

## 有证据的依赖

shop-web→shop-api、shop-api→pg-main、shop-api→redis-main、shop-worker→redis-main、billing-worker→pg-main、billing-worker→redis-main。没有证据的边不添加；各边分别说明环境、逻辑消费范围和来源。

## 三种问题的答案

**host-b 承载哪些项目？** 列出自身五个已知实例：shop-api 与 shop-worker 直接属于 shop/prod，billing-worker 直接属于 billing/prod；pg-main 与 redis-main 分别被两个项目引用。host-b 的实例重启会有不同粒度的影响，整机重启才涉及所有这些对象。shop-api 在 host-a 还有一个实例，但没有流量和容量证据时不能保证维护无影响。

**shop/prod 由什么组成？** 它有跨 host-a/host-b 的 web、API、worker，另使用 host-b 的共享数据库和缓存/队列。它不因此拥有 billing-worker；billing-worker 与 shop-worker 共机也不自动互为依赖。

**redis-main-b 恢复后验证什么？** 先验证该共享实例，再按已知消费关系验证 shop-api、shop-worker 与 billing-worker 的相应路径。共享恢复只执行一次，消费者分别保留成功、失败或未知。数据库 schema 检查不等于 Redis 恢复验证。

## 身份与差异练习

- shop-api-a 的 PID 由 123 变为 456：追加观测，稳定实例 ID 不变；是否同部署仍需核对制品与配置。
- host-b 的 IP 未变，但权威 VM ID 已换：新的资源身份承接现有定位，旧 run 保留旧资源快照。
- shop/staging 也有名为 redis-main 的服务：不能引用本例 prod 实例，先按环境消歧。
- unknown-a-01 无项目资料：保留未知与覆盖缺口，不能为了清理机器将其停止。
- 文档说 shop 不依赖 Redis，但当前生效配置和调用证据证明依赖：在 ops 保存冲突与时间，向原资料维护方交接，不自行改写其他领域文档。
