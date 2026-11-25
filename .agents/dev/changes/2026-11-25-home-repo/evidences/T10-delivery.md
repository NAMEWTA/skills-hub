# T10-delivery 验收

状态：已完成。实施、独立审查、必要真实运行和最终三平台验证完成；PR #17 已 squash 合并，Issue #2 与 PR 已关闭。`@namewta/skills-hub@0.1.30` 正式发布完成，GitHub Release 发布时间为 `2026-11-25T08:25:56Z`，即台北时间 2026-11-25 16:25:56。实际回读与取证边界见本文及 [v0.1.30 发布记录](../../../deploy/npm/releases/0.1.30.md)。

## 最终提交与平台结果

最终 PR head 为 `0cf764de44954ba309266b4e9c40f9782880fd7b`。[PR #17](https://github.com/NAMEWTA/skills-hub/pull/17)于 `2026-11-25T08:13:15Z` squash 合并为 `c157ee38c54d524b11eddc31603697ac45343590`，树为 `791c6e03a192d3a526a8f775a5857d1d7f4c6a80`。Issue #2 于 `2026-11-25T08:13:16Z` 以 completed 关闭。版本为 `0.1.30`。

[最终 PR 验证](https://github.com/NAMEWTA/skills-hub/actions/runs/45573476883)、[最终 head 的 push 验证](https://github.com/NAMEWTA/skills-hub/actions/runs/45573466188)及[合并后 main 验证](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387098)均完成。PR 的 Windows 首轮失败及同 SHA 重跑范围保留在下一节。

[正式发布 run 45574387211](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211)先固定合并 SHA，再通过 prepare 和三个验证 job。下表以这次发布验证为最终平台证据。

| 平台与 job | 测试 | 回放 | 实际发布包 |
| --- | --- | --- | --- |
| [Linux / Node 22.14.0](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139068638956) | 481 总数、481 通过、0 失败、0 跳过 | 33/33 | 0.1.30，63 技能、1092 文件及同仓链接通过 |
| [Windows / Node 24](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139068639026) | 481 总数、477 通过、0 失败、4 平台跳过 | 33/33 | 0.1.30，63 技能、1092 文件及真实目录 dir symlink 通过 |
| [macOS 26 Intel / Node 24](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139068639012) | 481 总数、481 通过、0 失败、0 跳过 | 33/33 | 0.1.30，63 技能、1092 文件及同仓链接通过 |

Windows 跳过项为三项 POSIX 权限位与一项 Unix socket。三平台均执行完整维护检查、既有捕获状态图回放及正常联网的真实 tarball 消费验证。日志中的 0.0.2、3 技能/34 文件是包检查自身的测试夹具；正式产品验证结果为表中的 0.1.30、63 技能/1092 文件。

Linux 的 Archify 完整 finalize 与真实 browser-check 通过。官方 SDK `0.3.332` / Claude Code `2.1.332` 实际初始化及 reload 均发现 63 技能，并通过真实进程 readFile 读取 121 个入口/参考资源。请求从 `.claude/skills/` 进入，有效路径回到同仓 `.agents/skills/`，内容摘要与本体一致。`userTurnsSent=0`、`modelInferenceVerified=false`，证据范围是宿主发现与读取。

原样摘要位于仓库根 `temp/dev/home-issue-2/release-{linux,windows,macos}-excerpt.log`；完整日志入口为表内 job。合并与关闭回读、job 身份和本地候选制品元数据保存在 `temp/dev/home-issue-2/delivery-state.json`。

## 实施期平台结果

提交 `5e4e4128465ef93e8d0ccd6cfa9537b4a552068a` 的 [Linux](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544568) 为 472/472、无跳过；同提交 [Windows](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544686) 为 472 项中的 468 通过、0 失败、4 平台不适用跳过。两平台的 0.1.30 实际包、63 技能/1092 文件及目录链接通过；Linux 浏览器及官方 Claude 63 技能/121 资源检查通过。该次结果保留其原提交与数量。

提交 `d56bb84b51eed021852da46aedaa04800902fdaa` 的 [Linux/Windows CI](https://github.com/NAMEWTA/skills-hub/actions/runs/45571553517)也已通过。后来恢复的旧 macOS 任务发现下述问题，最终修复和合并后的三平台结果另外记录，不用早期两平台成功代替 macOS 复验。

## 首次失败、修复与重跑

较早 macos-latest Arm64 任务曾排队，随后按 GitHub 官方标准 runner 清单将本轮 macOS 验证固定为同版 `macos-26-intel` / Node 24，保留全部检查。Intel 的最终结果不作为 Arm64 证据。

旧 macOS 任务恢复后实际发现三项失败：两项安装夹具假设 `/var/...` 与 `/private/var/...` 字符串相同；一项 Home CLI 的 argv 与 ESM 入口经符号链接规范化后不一致，导致 main 静默跳过。安装负责人修正夹具比较和故障注入匹配，保留产品规范路径语义并增加注入命中断言。旧两项在 Linux 真链接布局下 2/2 失败，修复后原合同和链接父目录变体 4/4 通过，安装专项 73/73。五个自包含 Home CLI 采用 native realpath 判断直接执行，独立安装包的 help、只读 JSON、非法参数及导入场景纳入 Home 专项 68/68。最终合并 SHA 的真实 macOS 481/481 与包检查完成了平台复验。详细原件见[Mac 回归记录](../runtime-evidence.md#macos真实失败与回归)。

最终 PR head `0cf764de44954ba309266b4e9c40f9782880fd7b` 的首轮 Windows job 已完成 481 项测试中的 477 项适用测试，4 项按平台跳过；后续既有 `CounterAction` 回放在 120000 ms 上限处以 SIGTERM 失败，实际记录 120015 ms。该失败保留为真实首轮结果，没有把整次首轮描述为成功。

同一 SHA 仅重跑失败 job 后，477 项适用测试、33 项回放和真实 0.1.30 包均通过；最终 head 的独立 push 运行、合并 SHA 的 main 与正式发布验证也通过。重跑没有改源码、放宽超时或删除检查。现有记录没有确定首次超时根因。失败与重跑摘要分别为 `temp/dev/home-issue-2/ci-windows-0cf764d-failure.log` 和 `pr-retry-windows-excerpt.log`。

Windows 较早的 8.3 路径身份差异、独立审查发现的 exclusions/derived_from 与 SSH 命名空间问题均保留原问题和修复回归，见[A01–A66 矩阵](../acceptance.md)及[真实运行记录](../runtime-evidence.md)。

## 必要真实组合验收

- 原生 Home 实际派遣 A、B 负责人，两位负责人分别创建真实实现子 Agent。A 独立 58/58、B 独立 34/34 均通过；源码、测试与技术原件留各项目，Home 收取管理回执。
- 项目内部知识问题由原 A 负责人在项目 cwd 实际检索，返回提问前 Home 不知道的随机决定 ID、来源版本、Git blob、哈希与适用范围。原件未复制到 Home。
- 指定 B 负责人实际启动 A 并执行 HTTP 联调，正常链路、12 类非法请求及关闭后连接拒绝均有原件。明确标注的异常响应夹具与真实服务链路分别记证。
- Home 运营在实际安装目录完成 110 步、22 项有效结果检查，覆盖配置、更正、候选、退役、历史去重、索引重建、10 处跨 owner 忘记及四次重导拒绝。
- 新 Agent 以 fork_turns=none 建立独立上下文，未接收答案，执行 35 条命令重建当前与历史、候选、归档及忘记边界。Home 与原 A 两个 running 实例接受真实 interrupt，再以同一身份读取本层 checkpoint 接续，没有重复编码、测试、派遣或提交。

以上身份、提交、哈希、路径及首次失败边界见[真实运行记录](../runtime-evidence.md)，矩阵 E05–E08、E12、E14、E15 提供对应关系。原生工具是实际所选环境。独立 codex app-server 因只读文件系统未启动；未选择的 system-herdr-core 及厂商 CLI 恢复协议保留方法依据。66 条验收项按证据类型分别解释。

## 正式发布回读

[发布 run 45574387211](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211)的 prepare、三平台验证和 [publish job 139069824527](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139069824527)全部 success。发布日志记录 08:16:16 UTC 上传一次，然后只读轮询，08:25:57 UTC 输出发布完成；没有把上传命令成功单独作为完成证据。

发布脚本实际读取精确 npm 公开 metadata，并严格核对包名 `@namewta/skills-hub`、版本 `0.1.30` 和完整 SHA-512 SRI 与本次 tarball 相同，再公开 GitHub Release。根负责人使用的网页工具无法读取 npm 地址，因此没有额外保存独立 npm raw metadata、dist.tarball 或 npm latest 实际值。公开包核验依据为实际运行的发布脚本、成功日志及制品身份，未伪造另一次 npm 回读。

标签 `v0.1.30` 直接指向合并提交 `c157ee38c54d524b11eddc31603697ac45343590`。[GitHub Release](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.30) 的 ID 为 `457828372`，发布时间为 `2026-11-25T08:25:56Z`，`draft=false`、`prerelease=false`；GitHub latest 实际回读为同一个 `v0.1.30` Release。

公开 tarball 附件为 `namewta-skills-hub-0.1.30.tgz`，6467705 字节，SHA-256 `e54321f358940e73a76753f0cf26c80bd8823ac8e5d37719c152ba3cd99ffe13`，与按同一合并源码在本地重打包的摘要相同。`SHA256SUMS` 为 96 字节，附件 SHA-256 `8b8dbbaef94821fa379b83c079bd8ef631b05fb0a8f98d21743f7e8ab978f41f`，其内容给出该 tarball 的相同 SHA-256 和文件名。

本地同源制品实际计算的完整 SRI 为 `sha512-VdTrhBnx3C2VM0p3r6Xk4teSu8dlpMB4nFzCD5V8IgrkFU1c51GAKv+Vj3wRAIQUyj+u3TS9LKLIynW3F+/UOw==`，与本地 npm pack 返回值一致；本地计算与公开 npm 核验是两项分开陈述的证据。原件见 `temp/dev/home-issue-2/publication-verified.json` 和 `delivery-state.json`，完整外部回执归 [v0.1.30 发布记录](../../../deploy/npm/releases/0.1.30.md)。

## 交付记录与范围

完整 Change 结果见[整体验收](../evidence.md)，逐条契约见[验收矩阵](../acceptance.md)。来源、许可、单包闭包、入口预算和其他领域方法归属沿用各任务报告及最终源码门禁。用户已授权合并、关闭 Issue/PR 与补丁发布。

本地隔离 fixture 的临时输入含目标归属相对链接，曾使工作区递归检查把运行原件当源码而失败。原件保留、门禁未修改，随后使用现有 `node scripts/check.mjs --staged` 核对提交快照；最终 CI 从干净的精确提交执行完整检查。临时原件位于 `temp/dev/home-issue-2/`。

本次验证范围不扩展为生产部署、长期压力、所有 Windows 权限配置、macOS Arm64、所有 CLI 组合或模型执行技能。知识忘记只覆盖实际列出的 owner 和本轮可触达载荷，不承诺删除外部原件、Git 历史、备份或原生记忆。上述范围保持为验收边界，不将未选择分支计作运行失败，也不因收口文档重新执行既有测试。
