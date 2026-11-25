# Home Repo 整体验收

状态：已完成。PR #17 已合并，Issue #2 已关闭，`@namewta/skills-hub@0.1.30` 正式发布完成。GitHub Release 发布时间为 `2026-11-25T08:25:56Z`，即台北时间 2026-11-25 16:25:56。本文按固定源码、实际运行和发布回读记录整体验收。

## 契约与交付身份

行为契约为 [Issue #2](https://github.com/NAMEWTA/skills-hub/issues/2)，契约版本 `2026-11-25T05:53:23Z`。原基线为 `f782755b780646e09ae3fcb56598d89df090eb98`；实施期间纳入独立 PR #16 后，以 `2988ae4ad6390b5c9fa53039666284070b33e697` 区分本次变更范围。

| 对象 | 实际结果 |
| --- | --- |
| [PR #17](https://github.com/NAMEWTA/skills-hub/pull/17) | 最终 head 为 `0cf764de44954ba309266b4e9c40f9782880fd7b`；`2026-11-25T08:13:15Z` squash 合并并关闭 |
| 合并及发布源码 | `c157ee38c54d524b11eddc31603697ac45343590` |
| 合并树 | `791c6e03a192d3a526a8f775a5857d1d7f4c6a80` |
| Issue #2 | `2026-11-25T08:13:16Z` 关闭，`state_reason=completed` |
| 包版本 | `@namewta/skills-hub@0.1.30`，由 0.1.29 递增，package、lock 与 CHANGELOG 一致 |

本次交付新增 `home-setup`、`home-route`、`home-workflow`、`home-map`、`home-knowledge`、`home-history`、`home-integrate`、`home-doctor` 八个包及其完整包内资源。Home 的登记、配置、知识、历史和管理回执保存到 `.agents/home/`，各项目继续使用自己的规则、任务负责人和记录根。通用安装器将 `.agents/skills/<name>` 作为唯一完整本体，为本次选中技能建立同仓 `.claude/skills/<name>` 目录符号链接，并将补链、替换、导航、忽略规则及异常回滚纳入同一事务。其他领域的技能方法及独立 PR #16 的变更按各自来源保留归属。

## 最终源码的三平台验证

[合并后 main 验证](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387098)已成功。[正式发布流水线](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211)的 prepare 和下列三平台验证固定同一合并 SHA，均已成功。最终 publish 结果见后文。

| 发布验证 job | Node.js | 测试总数 / 通过 / 失败 / 跳过 | 状态图回放 | 实际 0.1.30 tarball |
| --- | --- | --- | --- | --- |
| [Linux](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139068638956) | 22.14.0 | 481 / 481 / 0 / 0 | 33 / 33 | 63 技能、1092 文件及同仓目录链接通过 |
| [Windows](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139068639026) | 24 | 481 / 477 / 0 / 4 | 33 / 33 | 63 技能、1092 文件及真实 dir symlink 通过 |
| [macOS 26 Intel](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139068639012) | 24 | 481 / 481 / 0 / 0 | 33 / 33 | 63 技能、1092 文件及同仓目录链接通过 |

Windows 的 4 项跳过为三项 POSIX 权限位与一项 Unix socket 平台条件；其余适用检查均通过。33 项 statechart 检查是既有捕获轨迹回放，按该范围记证。包验证实际安装 npm tarball，并核对命令入口、完整资源、许可、重复安装和链接。

Linux 还通过已安装 Archify 的完整 finalize 与真实浏览器检查。官方 Claude Agent SDK `0.3.332` 启动的 Claude Code `2.1.332` 通过 `supportedCommands`、`reloadSkills` 发现 63 个技能，再通过 `readFile` 读取 121 个入口及参考资源；requestedPath 位于 `.claude/skills/`，有效路径回到同仓 `.agents/skills/`。发送用户回合为 0，`modelInferenceVerified=false`。这份证据覆盖宿主发现和读取。

原样日志摘要保存在仓库根 `temp/dev/home-issue-2/release-linux-excerpt.log`、`release-windows-excerpt.log`、`release-macos-excerpt.log`；完整日志由表内 job 链接定位。

## 必要真实运行

| 验收对象 | 已完成的实际结果 |
| --- | --- |
| 多级协作与当地记录 | Home 实际派遣 A、B 负责人；A、B 分别实际创建自己的实现子 Agent。A 负责人独立验收 58/58，B 负责人独立验收 34/34，均无失败或跳过。实现和技术原件留各项目，Home 仅存管理回执与来源指针。 |
| 项目内部知识查询 | 原 A 负责人在项目 cwd 实际检索当地定价笔记，返回随机决定 ID、Git blob、SHA-256、查询版本和适用范围。Home 提问前未读取该原件，也未复制项目知识镜像。 |
| 两项目联合验收 | 指定 B 负责人实际启动并通过回环 HTTP 调用 A，验证 health、1290 分 × 2 = 2580 分、12 类非法请求返回 400，以及关闭后的 ECONNREFUSED。异常响应夹具另行标记。 |
| Home 运营 | 110 步留痕、22 项有效结果检查，覆盖唯一配置 owner、两个有来源决定、候选隔离、部分更正、退役、旧 SHA 拒绝、归档去重和索引重建。10 处跨 owner 忘记后，四次 sources/derived_from 重导均返回 EXCLUDED。 |
| 全新上下文 | `fork_turns=none` 的新 Agent 未接收随机 ID、规则值或旧理由，实际执行 35 条只读命令，从 Home Markdown 准确重建当前、历史、候选、归档和忘记边界；根负责人与独立答案表逐项核对。 |
| 原生中断接续 | 父实际中断正在运行的 Home 新 Agent 与原 A 负责人，两次均返回 `previous_status=running`，随后用相同 Agent 身份接续。两层先读取自己的 checkpoint 和原 owner 记录；Home 23 份权威 Markdown、A 的 HEAD 与源码/任务/报告哈希保持，未重复实现、测试、派遣或提交。 |

实际身份、项目提交、原件哈希、随机标识与运行路径见[真实运行记录](runtime-evidence.md)。业务原件保留在 `temp/dev/home-issue-2/real-home/` 的对应项目。原生协作工具是本次明确选择的真实运行环境。

## 首次失败与修复记录

- 独立审查发现并修复来源排除 Markdown 解析、非法 derived_from 以及未知 SSH 用户命名空间问题，针对性回归记录在验收矩阵 E03。Windows 的 8.3 短路径与 Git 长路径差异随后由 native realpath 规范化修复，并取得真实 Windows 复验。
- 较早 macOS 任务恢复后实际报告 469 通过、3 失败。两项是安装测试对 `/var` 与 `/private/var` 的夹具假设，另一项是 Home CLI 经真实目录链接运行时的入口判断缺陷。安装夹具反例先复现 2/2 失败，修复后原合同和链接父目录变体 4/4 通过、安装专项 73/73；五个自包含 Home CLI 修复后，Home 专项 68/68。上述修复均被最终合并 SHA 的真实 macOS 门禁覆盖。
- 最终 PR head 的首轮 Windows 任务已完成 477 项适用测试，随后既有 statechart `CounterAction` 回放在 120000 ms 上限处失败，日志耗时为 120015 ms。同一 SHA 仅重跑失败 job 后，33 项回放与实际包验证成功；push、合并后 main 及正式发布验证也成功。首次失败保留在 `temp/dev/home-issue-2/ci-windows-0cf764d-failure.log`，重跑结果保留在 `pr-retry-windows-excerpt.log`。没有据重跑推定首次超时的根因，也没有放宽超时或删去检查。
- Home 运营首轮六位小数 ISO 日期输入被明确拒绝为 DATE，未保存历史正文。之后用新的实际时钟观测和产品支持的毫秒精度执行主链；该格式边界与失败记录保留。独立 codex 0.172.0-alpha.2 的 app-server 初始化因只读文件系统未启动，未将原生 Agent 验收改称独立 codex CLI 验收。

## npm 与 GitHub 正式发布

[正式发布流水线](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211)全部成功，[publish job 139069824527](https://github.com/NAMEWTA/skills-hub/actions/runs/45574387211/job/139069824527)结论为 success。日志记录 08:16:16 UTC 上传一次，随后只读轮询公开状态，08:25:57 UTC 输出发布完成。GitHub 记录的实际发布时间为 `2026-11-25T08:25:56Z`，工作流在 `08:26:01Z` 更新为完成。

| 发布对象 | 实际核验结果 |
| --- | --- |
| 精确 npm 包 | 发布脚本实际读取 `@namewta/skills-hub@0.1.30` 的公开 metadata，严格验证 name、version 和完整 SHA-512 SRI 与实际 tarball 相同后才公开 Release。 |
| Git 标签 v0.1.30 | 直接指向 `c157ee38c54d524b11eddc31603697ac45343590`。 |
| GitHub Release | [v0.1.30](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.30)，ID `457828372`，`draft=false`、`prerelease=false`。 |
| GitHub latest | 实际回读为 `v0.1.30`，Release ID 同为 `457828372`。 |
| tarball 附件 | `namewta-skills-hub-0.1.30.tgz`，6467705 字节，SHA-256 `e54321f358940e73a76753f0cf26c80bd8823ac8e5d37719c152ba3cd99ffe13`。公开附件摘要与本地按同一合并源码重打包的摘要一致。 |
| SHA256SUMS 附件 | 96 字节，SHA-256 `8b8dbbaef94821fa379b83c079bd8ef631b05fb0a8f98d21743f7e8ab978f41f`；内容指向上述 tarball 文件名和 SHA-256。 |

本地同源 tarball 实际计算的 SHA-512 SRI 为 `sha512-VdTrhBnx3C2VM0p3r6Xk4teSu8dlpMB4nFzCD5V8IgrkFU1c51GAKv+Vj3wRAIQUyj+u3TS9LKLIynW3F+/UOw==`，与本地 npm pack 返回值一致。公开 npm 完整性由上述发布脚本的实际严格比较证实。根负责人的网页工具无法读取 npm 公开地址，因此没有另存独立 npm raw metadata、dist.tarball 或 npm latest 的实际值；此处不把本地 npm pack 的返回字段当作 registry 回读，也不以 GitHub latest 代替 npm latest。

发布取证原件为仓库根 `temp/dev/home-issue-2/publication-verified.json`、更新的 `delivery-state.json` 和完整发布 job 日志。完整摘要与外部状态集中在 [v0.1.30 发布记录](../../deploy/npm/releases/0.1.30.md)。PR 合并、工作流状态、npm 精确版本核验和 GitHub 附件身份分别记录。

## 验收范围与后续使用

[A01–A66 矩阵](acceptance.md)逐项区分方法/静态、自动化、实际运行与条件不适用。66 行是契约映射，不是 66 次真实运行。未选择的 system-herdr-core 地址、终端与 manifest 协议，以及独立厂商 CLI 组合，沿用方法依据而不计作现场运行。

macOS 结果来自标准 Intel runner，不扩展为 Arm64 验证。Claude 结果覆盖宿主发现和资源读取，不覆盖模型实际执行技能。本次联合验证使用隔离仓库、回环 HTTP 和明确 fixture，不扩展为生产部署、长期压力、跨主机容量或多仓原子发布。忘记操作覆盖所列 owner 与本轮可触达载荷，不承诺清除 Git 历史、备份、远端、原始对话或原生记忆。各项细分边界保留在矩阵与真实运行记录中。

任务证据按 [T01 契约](evidences/T01-contract.md)、[T02 路由](evidences/T02-routing.md)、[T03 配置](evidences/T03-configuration.md)、[T04 派遣](evidences/T04-delegation.md)、[T05 知识](evidences/T05-knowledge.md)、[T06 历史](evidences/T06-history.md)、[T07 联调](evidences/T07-integration.md)、[T08 安装](evidences/T08-installation.md)、[T09 分发](evidences/T09-distribution.md)、[T10 交付](evidences/T10-delivery.md)保留。本报告完成 Change 的整体验收，不替换各项目原始证据。
