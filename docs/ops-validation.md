# ops 验证方法

验证 ops 时，分别核对技能方法、控制端记录工具、真实后端操作和宿主调用行为。生产维护能力必须有对应环境的证据，不能由静态文本或隔离夹具结果推定。

## 证据分层

| 检查 | 能证明什么 | 不能替代什么 |
| --- | --- | --- |
| 结构、材料和打包 | 入口可安装、资源存在、映射与分发符合契约 | 真实运维动作 |
| 安装与记录工具测试 | 选择、领域隔离、步骤保留、写入冲突和失败恢复 | 远端权限和服务健康 |
| 隔离 OpenSSH 场景 | 实际连接、进程恢复、共享消费者验证和留痕 | 生产环境或其他后端验收 |
| 独立自然请求 | 路由、记录解释、边界和交接 | 全部宿主的自动发现能力 |
| 方法审查 | 前提、停止条件、例外及完整参考可读 | 强制策略引擎或实际执行结果 |

<a id="已运行的确定性检查"></a>

## 确定性检查

在源码根执行与改动对应的检查，每次结果记录在所属 change：

```sh
node scripts/check.mjs
node --test tests/ops-installation.test.mjs tests/persistence-initialization.test.mjs
node --test tests/ops-execute.test.mjs
npm run check:package
```

安装测试覆盖完整/部分选择、预览、更新、备份、导航与其他领域隔离。[记录工具测试](../tests/ops-execute.test.mjs)覆盖 run、不可覆盖步骤、unknown、attempt、子 run、摘要比较后写入、writer 交接、路径限制与输入不执行。[通用验证指南](validation.md)说明完整回归、包检查及依赖前提。

<a id="github-ci-的完整结果"></a>

### 跨平台 CI

[验证工作流](../.github/workflows/validate.yml)在各平台执行当前提交的检查。具体 run、测试数量与平台结果进入 change 的验证记录，不写成长期能力保证；未运行或条件跳过的范围单独说明。

## 真实 SSH 运行恢复案例

显式的 [OpenSSH 验收脚本](../scripts/check-ops-ssh.mjs)需要 Linux 普通用户、Node.js 22.14+，以及 `/usr/bin/ssh`、`/usr/sbin/sshd`、`/usr/bin/ssh-keygen`。它不属于默认跨平台测试。报告父目录必须存在，报告文件必须尚未存在：

```sh
node scripts/check-ops-ssh.mjs --report /path/to/new-ops-ssh-report.md
```

脚本在本机建立两个 loopback 高端口 sshd，使用临时密钥、固定 known_hosts 和 ForceCommand 白名单。三个 Node 服务分别模拟 shop、billing 与共同依赖 shared-health。场景核对端点身份和初始健康，仅在夹具内停止服务，再以不变制品和配置恢复共享服务，分别检查消费者，并只接续尚未恢复的目标。

验收应保留同一主 run、逐条命令与退出码、共享恢复次数、稳定身份、制品/配置摘要及曾发生的 partial。最终成功不能覆盖先前的失败或未知。清理需要确认临时进程、端点、密钥与目录已处理；仅清理脚本创建并核对身份的对象。

这个场景的范围是同一 Linux 上的两个隔离 SSH 端点，不包括物理两机、公网、Redis、systemd、Compose、云 IAM、Rundeck 或真实数据库恢复。断线后的远端副作用、跨控制端锁和 exactly-once 也不能由这个夹具推出。

## 新会话入口与项目技能

在隔离工作根安装所需 ops 包后，用新任务上下文给出目标和授权范围，保留实际读取的入口及产物。可使用两个明确标为合成的历史 run，要求按服务器、项目、时间截点查询。检查以下行为：

- history 只读取本次截点前的原始记录，不把自己的查询 run 递归计入结果。
- 一个共享服务不按消费者复制动作，unknown 保留原义，不重试未知后端任务。
- 接续同一任务沿用 run；独立新目标使用关联的新 run，不接管原 writer。
- 父会话已加载的方法不被当作子 CLI 自动拥有的上下文，实际 cwd、规则、技能和记录根须明确。

[共享健康技能示例](../skills/ops/ops-runbook/assets/ops-example-shared-health/SKILL.md)只有只读 identity/health 入口。连接前需要活动夹具、控制者提供的真实 ssh_config 和基线。归档报告中的 `<fixture-root>` 是脱敏占位，清理后的报告只能用于证据复核。

<a id="issue-的-41-个场景逐项对应"></a>

## 维护场景

按实际改动选择场景，重点核对以下契约：

| 变化范围 | 必须核对的行为 |
| --- | --- |
| 身份和关系 | 同名跨环境对象、共享服务、多机/共机、未知对象与历史快照 |
| 执行和恢复 | 实际制品/配置、启动副作用、逐消费者结果、部分失败和重试前核实 |
| 记录 | 不覆盖原始步骤、摘要冲突、记录失败、writer 与本地锁的真实边界 |
| 领域边界 | 新制品、版本回滚、schema 迁移和永久拓扑变更交项目发布流程 |
| 项目技能 | 有证据的适用范围、独立验证、失效条件与来源 run；不混入秘密或发布操作 |

例如名为 repair 的脚本如果包含拉取浮动镜像和 schema migration，就不能按“恢复现有服务”执行，也不能直接截取末尾 restart 而不核对依赖。只读边界任务应明确没有现场动作，不虚构健康结果或后端 ID。

## 领域隔离与来源核对

ops 安装只更新所选包和 ops 托管导航，项目业务记录、根规则及其他领域不受影响。部分安装不自动补齐方法；缺少执行或记录能力时，可以继续资料分析，但不能伪造现场操作。

来源、许可和改造说明见[统一第三方声明](../THIRD_PARTY_NOTICES.md)，当前方法职责见[ops 方法归属](ops-method-ownership.md)。原集中报告及三份完整证据已归档，入口见[历史证据目录](../.agents/dev/changes/2026-11-17-doc-cleanup/evidence/README.md)。每份报告都保留自己的版本、环境和结论范围。

<a id="ops-验证与-issue-3-对照"></a>
