---
name: ops-example-shared-health
description: 在既有双目标隔离 SSH 演练的有效生命期内，使用固定 identity/health 入口检查 shared-health 与 shop/lab、billing/lab 消费路径；环境已清理时复核保存报告。用于已验证的项目专属只读运维方法，不创建夹具、不恢复或发布服务。
---

# 隔离共享服务健康检查

本技能针对两个已存在的 loopback SSH 端点、两个 Node 消费者和一个共享 Node 健康服务。远端通过 ForceCommand 只接受精确的白名单命令，没有通用 Shell 或任意 HTTP 命令入口。目标仅为本次隔离演练，不能套用到生产。

## 进入当前现场或保存证据

首先判断当前是否存在由运行控制者明确提供的活动夹具。活动调用需要本次实际 `ssh_config` 的绝对路径、预期 `lab_id`、`artifact_sha256`、运维工作根及当前 run。它们来自运行控制者持有的真实配置，不从示例或旧报告猜测。

真实夹具生成的是临时根中的 `ssh_config`、`lab.json`、`known_hosts` 和私有密钥；没有 `runtime.md`。完成或失败后的清理会删除整个临时根、停止本次服务与 SSH 端点。报告中的 `<fixture-root>` 是脱敏标记，不是可连接的路径。

只有已保存报告而没有活动配置时，按下文的“保存报告复核”工作，不重建夹具、不重新使用旧端口。需要新的完整演练应由负责该环境的验证流程建立；本技能只做其生命期内的只读检查或事后的证据复核。

确认实际 cwd 和可用 `ops-execute`，沿用当前 run 并核对当前写入者。本文件作为包内样例存在不代表宿主已经注册它；独立项目 CLI 必须核对真实发现路径。缺少执行/记录方法时提供分析和明确缺口，不无记录调用。

## 目标与身份

| SSH 别名 / 资源 ID | identity 的 endpoint | 本端点允许的角色 | 实例与项目 |
| --- | --- | --- | --- |
| `ops-lab-a` | `host-a` | `shop` | `shop-a` → `shop/lab` |
| `ops-lab-b` | `host-b` | `shared-health`、`billing` | `shared-health-b` 被两个项目使用；`billing-b` → `billing/lab` |

两个端点是在同一台 Linux 上监听不同 loopback 端口的 sshd，不能称为两台物理机器。共享服务只登记一份身份，PID 是可变观测。

使用实际配置中预先生成的 host key 与客户端身份，保持 StrictHostKeyChecking 和已设置的连接限制，不改用户 SSH 配置、不关闭验证、不复制密钥或完整配置到公共记录。

## 固定只读入口

以下是传给现有 `ssh` 的独立参数。把“本次 ssh_config 绝对路径”替换为运行控制者提供的实际值；末项作为一个完整远端命令参数原样传递，不拼接额外语句。

| 目的 | ssh 参数列表 |
| --- | --- |
| 端点 a 身份 | `["-F", "本次 ssh_config 绝对路径", "ops-lab-a", "identity"]` |
| 端点 b 身份 | `["-F", "本次 ssh_config 绝对路径", "ops-lab-b", "identity"]` |
| 共享服务健康 | `["-F", "本次 ssh_config 绝对路径", "ops-lab-b", "health shared-health"]` |
| shop 消费路径 | `["-F", "本次 ssh_config 绝对路径", "ops-lab-a", "health shop"]` |
| billing 消费路径 | `["-F", "本次 ssh_config 绝对路径", "ops-lab-b", "health billing"]` |

可用独立参数的进程工具执行 `/usr/bin/ssh`，设置有界超时并捕获 stdout、stderr、退出码与实际时刻。不要发送 curl、读取标记文件、换行或 Shell 组合；ForceCommand 会拒绝非白名单输入。即使远端支持测试用 start/stop，本技能也不调用它们。

1. 先完成两个 `identity`。返回 JSON 的 `lab_id` 与 `artifact_sha256` 必须等于本次已提供的基线；`endpoint`、`services` 与上表一致。两个别名应对应不同 endpoint、同一个本次 lab_id。身份不符就停止对该目标的检查并保留证据。
2. 执行三项 `health`。每项核对顶层 lab_id、endpoint、service、artifact_sha256，保留完整有限响应和退出码。
3. 健康要求 `http_status === 200`、`healthy === true`、`identity_matches === true`。shop 和 billing 的 `result.dependency` 还必须表明同一 shared-health 的身份与健康，不能仅凭消费者进程存在通过。
4. 一条检查不健康不授权恢复。身份和连接仍可靠时，可继续独立只读检查以确认覆盖；不得因此启动、停止或重复恢复共享服务。

## 解释结果与留痕

| 结果 | 判断与下一步 |
| --- | --- |
| identity 退出 0 且身份符合 | 只证明本次端点身份，可继续健康检查 |
| health 退出 0 且健康/身份字段全部符合 | 该时刻的所选路径通过，保留响应与时间 |
| health 退出 3 | 检查入口完成但服务或消费路径不健康；读取 HTTP 状态/错误及 dependency，不把它当已恢复 |
| 退出 1 且带夹具错误 | 可能为白名单、配置或进程身份拒绝；保存错误并核对真实原因 |
| SSH 超时、其他非零退出或无法解析响应 | 记录连接/执行缺口与未知，不捏造健康结论 |

通过 `ops-execute` 把目标快照、实际只读调用、逐目标执行/现场/记录状态写入同一 run；当前 writer 不属于本会话时按其交接或子 run 方法处理。服务器与项目历史都引用这些原始步骤，不复制两份流水。

三个 health 中任何一个失败或未知，都不能报告整个目标健康。shared-health 已健康而 billing 仍失败时保留部分失败；不要再次恢复共享服务。完成检查与全部健康是两个不同结果。

## 保存报告复核

环境已清理时读取用户实际提供的保存报告，核对以下内容：

- 身份步骤中两个 endpoint、同一 lab_id 和制品摘要一致。
- `steps/001-topology.md` 对应一个共享实例和 shop/lab、billing/lab 两份消费关系。
- 实际 health 响应与退出码支持每个结论，部分失败步骤仍保留，最终摘要能够回到原始步骤。
- 最终健康证据之后有清理结果；脱敏的旧临时路径不作为当前可用入口。

报告复核不发起现场命令，不把过去的健康写成现在仍健康。本次复核本身保留轻量调用记录。

## 已验证范围与维护

2026-11-16 的隔离验收已实际调用上述 identity/health 入口。对应保存报告中的身份结果为 `003-observed`、`005-observed`；最终消费与共享健康结果为 `036-observed`、`038-observed`、`040-observed`。复核时使用实际提供的归档报告，不假设本技能附带临时运行目录。

同批完整验收共有 19 次 SSH 调用：验证驱动建立并扰动自己的夹具，只恢复共享实例一次，保留 shop 已恢复而 billing 未恢复的 partial，再接续 billing 并验证；服务制品与实际配置摘要在恢复前后相同，清理核实端口关闭。这些建立/恢复动作属于验证驱动的授权范围，不是本只读技能的操作步骤。

实测范围仅为同一 Linux 的两个独立 loopback sshd 端点及三个 Node 服务，未验证生产目标、真实 Redis、systemd、Compose、公网链路或两台物理机器；也不以本次方法验证声称不同 Agent CLI 自动发现都已测试。

结束自己打开的连接，不停止共享服务或 sshd。清理由拥有夹具的控制者完成，原始证据先归档到用户明确指定的报告中并跨越清理保留。维护者是本次演练负责人；白名单、响应结构、目标关系、制品或宿主发现方式变化后重新核验，不能沿用旧成功摘要。
