# Herdr Core 单入口与启动参数验证

## 改动范围

将 `system-herdr-core/references/` 的启动、终端操作、回收和文件协作并入 `system-herdr-core/SKILL.md`。删除重复参考，更新使用指南的链接，保留四份模板。入口正文为 154 行、6,797 个非空白字符，低于 500 行、12,000 字符的预算。TUI 技能和材料快照不变。

对照 TUI 的三套启动方式。Claude Code 固定使用 `--dangerously-skip-permissions`，Codex 固定使用 `--no-daemon --dangerously-bypass-approvals-and-sandbox`，Pi 以 `pi` 原生交互启动。模型和推理强度仍可选；直接、远程及模板启动均不得省略所用 CLI 的必带参数。

## 实际核对

- Windows、Node.js v24.21.0、`hc 0.1.21`。`hc --skill` 及 `hc run --help` 确认 `--bg`、`--json`、`--cwd`、`--on`、`--outlive-parent` 和 Codex `--no-daemon` 的要求。本机帮助确认 Codex 的两个开关及 Pi 的模型和推理参数。本机 PATH 未找到 Claude Code，命令按用户指定的 TUI 技能对齐。
- 在临时项目从源码单独安装 `system-herdr-core`。安装包只含 `SKILL.md` 与 `assets/`。在独立 `HC_SESSION` 和临时配置目录中，用 Node.js 探针替代三个 agent 程序，按安装文件的三条启动命令及 Claude Code 首条任务示例执行 `hc run`。四次均核对了参数顺序、工作目录和 `HC_TERMINAL_ID`，与返回的 `address` 一致；退出后移除测试终端，并停止测试 Core。首次探针遗漏了首条任务示例，改为核对四条后通过。
- 探针只验证 Core 转发和终端身份，没有启动实际 agent、远程 worker 或 App，也不验证目标机器的审批、认证或 CLI 行为。

## 仓库检查

- `npm run check` 通过，54 个技能、1,368 个本地链接。
- `npm run check:full` 通过，363 项通过、11 项跳过、0 项失败，有限状态示例的故障注入得到预期反例。
- `npm run check:package` 通过，实际 tarball 包含 54 个技能、1,037 个分发文件。
- `git diff --check` 通过；无指向两个旧参考文件的引用。
