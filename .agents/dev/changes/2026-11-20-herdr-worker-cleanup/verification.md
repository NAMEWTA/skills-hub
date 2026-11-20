# Herdr 临时 worker 回收验证

## 实施范围

两个技能在验收后引导 Lead 回收本次创建、已无待办也无需复用的临时 worker。使用文件协作时，关闭前重读当前 topic 清单中该 worker 的任务指针和 `done` 状态。两个技能资产清单仍为三列模板，运行清单与 task/report 留作复查。短任务直接核验结果和后续安排。

静态走查从两个技能入口和各自验收段落进入回收方法。`active`、`blocked`、已切换任务指针的旧 `done`、仍在工作的 `done`、后续要复用的 worker 和非本次创建的终端均不满足回收条件。

## 本机验证

- Windows PowerShell，Node.js v24.21.0。使用 `herdr 0.9.3` 的具名测试会话创建根窗格和临时窗格，向临时窗格的确切 ID 执行 `herdr pane close`。`herdr pane list` 确认临时窗格消失、根窗格仍在。测试会话已停止并删除。PowerShell 首次清除测试日志目录报错，随后按原路径清除并验证目录已不存在。
- `hc 0.1.21` 在具名测试会话启动两个 Node.js 测试进程。一个从 `live` 经 `hc kill` 到 `finished` 后用 `hc rm` 移除，另一个自然退出后直接用 `hc rm` 移除。两次 `hc rm` 均返回目标地址，移除后 `hc get` 均返回非零退出状态。测试 Core 已停止。
- 实测覆盖本地 CLI 生命周期。远程会话及模型加载技能后的实际执行留待相应环境验证。

## 仓库检查

- `npm run check` 通过，包含 52 个技能、1349 处本地链接及 1815 份来源文件的结构检查。
- `npm run check:full` 的隔离回归为 356 通过、11 跳过、1 失败。失败发生在 `tests/materials-sync.test.mjs` 的 `fs.symlink`，Windows 拒绝创建文件符号链接并返回 `EPERM`，测试尚未进入材料同步断言。这个限制也出现在此前的 Herdr Core 验证中。
- `node skills/dev/dev-formal-verify/scripts/demo.mjs` 通过原实现、隔离故障注入和恢复三阶段检查。
- `git diff --check` 通过。
