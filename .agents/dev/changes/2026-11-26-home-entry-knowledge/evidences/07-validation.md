# 整合与真实宿主验证验收

状态：本地实现检查与平台原生模型场景通过；独立 CLI 自然语言闭环 M06 尚未完成。对应 [任务](../tasks/07-validation.md)。不将已通过的其他层次替代 M06，不产生整项 Change 的完成结论。

## 本地门禁与范围

2026-11-26，Node.js `v24.22.3`、npm `11.19.1`。源码基线与最终提交身份分别见 T1、T8。

| 检查 | 实际结果 | 边界 |
| --- | --- | --- |
| `node --test tests/persistence-initialization.test.mjs tests/install.test.mjs tests/cli.test.mjs` | 132 项，131 通过、0 失败、1 跳过 | Windows 实际交互 EPERM 场景在 Linux 跳过；注入 EPERM 分支通过 |
| `node --test tests/home-doctor.test.mjs tests/home-cli-entry.test.mjs` | 22/22 通过 | 后续修复 owner 衔接后 doctor 专项 14/14 再通过 |
| `npm run check:full`，精确 Git 暂存树的干净快照 | 531 项，529 通过、0 失败、2 跳过；结构、来源及真实有限状态故障注入/恢复通过 | 两个跳过分别是 Windows 交互 EPERM、当前环境不能创建 Unix socket；后者未伪造通过 |
| `npm run check:statechart` | 33/33 通过 | 已捕获输出的回放；不是新运行 TLC |
| `npm run check:package` | 消费端下载依赖时 E403 | 实际 `npm pack` 可用；不能把现有 node_modules 当作 npm 消费端安装证据 |
| `npm run check:upstream` | Archify validate/deliver/check 通过；browser-check 未执行成功 | `/usr/bin/chromium` 引用的 `/usr/lib/chromium/chromium` 不存在 |

完整检查绑定暂存树 `8e62afd88306520876175238a4e4d3cf67dc70d1`。此后只补正式证据、来源尾部空行和发布记录；运行代码与包内技能没有改变。直接在工作目录第一次运行时，既有扫描器读到了 ignored temp 中解包后的 README/声明，因包不分发 docs/materials 而报告其源码链接；没有修改或绕过检查器。使用仓库 `withSnapshot` 导出精确暂存树，再在该干净目录运行原样 `npm run check:full`，实际退出 0。复制的 13 个现有依赖版本逐项与锁文件相符；这不是 `npm ci` 成功。

这些本机前提缺口交同一发布提交的 GitHub CI 补验，结果追加到 T8 与版本发布记录。过程原件在 `temp/dev/home-entry-knowledge/`：`full-clean-snapshot.log`、`full.log`、`statechart.log`、`package.log`、`upstream.log`；安装专项原件在 `temp/dev/2026-11-26-home-entry-knowledge/tasks/03-installer/final/node-test.log`。

## 从实际打包内容安装的原生模型场景

使用实际 `npm pack` 输出 `namewta-skills-hub-0.1.36.tgz`，1105 个文件；候选包 SRI：

`sha512-j4UQacM0aqwk4YmC44yzcownO0rsFoMGoDiYN2Q5in/AZlcWFXf2ccTw/g/6wULT46QEQ+r374IpJJPY1r/B9A==`

解包后用包内 `install.mjs install --domain home` 安装九技能到新的 Home。仅创建 Home 业务域，完整包方法不依赖维护仓库的 docs/materials。此候选包在最终审查的两处 SKILL 文字澄清前制作：doctor 将已规定的入口读取顺序写在首段，setup 明确“入口缺失走安装器、损坏走 knowledge 后再安装”。运行脚本及基础模板相同。上述候选包身份不冒充后续 Release 附件身份。

原生模型负责人 `/root/home_scenario` 使用 `fork_turns: none` 从新上下文开始。提示仅给正常管理任务、真实 Home/Alpha/Beta 路径和授权，不给技能名、测试答案或隐藏预期。没有覆盖 CLI、模型或推理档位。宿主没有提供最终模型档位的独立遥测，不填写推断的型号。本轮平台原生 Agent 有真实工具和独立项目工作者，仍不等于独立 `codex exec`。

实际隔离目录均位于 `temp/dev/home-entry-knowledge/native-scenario/`，Home 启动 cwd 为其 `home/`。Alpha、Beta 是各自独立本地 Git 仓库，无远端。原始 Home 根 AGENTS 已有中文和默认方式规则；项目各自 AGENTS 要求读取当地 `.agents/dev/notes/domain.md`，金额用整数分，保留 `RangeError` 合同。

| 场景 | 实际观察 |
| --- | --- |
| 自然请求初始化、登记 | 模型读取已安装入口与方法，合并根短指针并保留用户规则；建立 v2 登记；Alpha/Beta 的 `registryMatches=true`；当前原生派遣和每项目一负责人保存在现有配置 owner |
| Alpha 修改 | 实际 `quote.mjs` 改为小计 ≥10000 分免 500 分运费；相同测试改前 3/6 失败、改后 6/6 通过 |
| Beta 联调 | 保留本已正确的直接 import/调用适配器；11 个业务案例加父测试共 12/12 通过；Node Inspector 记录实际 invoice、实际 Alpha quote 各 11 次调用，运行时源码与交付散列一致 |
| 原负责人接续 | Beta 初次准备后等待 Alpha 真实交付；Home 的第二个 Beta task 沿用 `/root/home_scenario/beta_owner` 原会话，没有按 task 数量新建项目负责人 |
| 持久化 | Alpha 拥有报价与运费、Beta 消费的长期约定存 `relations.md`；长期汇报顺序存已有根 AGENTS，Home 入口指向原 owner；没有额外 SOUL 或重复正文；本次“简短”未变成永久默认 |
| 收尾 | 主题 `2026-11-26-quote-billing` 为 done，Alpha/Beta 均 done 且 held=false；最终 doctor 完整检查 15 个 Markdown、23 个本地链接、8 个明确要求的技能，findings=[]；Home Git 范围检查 ready |

关键真实结果：`9999 → shippingCents=500,totalCents=10499`；`10000 → 0,10000`；`10001 → 0,10001`。币种 TWD、字段顺序、安全整数及无效输入 RangeError 保持。Alpha 被测源码 SHA-256 为 `3e170c52c1cb99fd39b27b1f31c8f27c8c6b27a73bf4bcd49180b823a19dcffd`；Beta 适配器为 `5c41b70ec0c7077c07b4ddb757a9985b84df7cdb59f60c45c204fda7a1a81d41`。项目 HEAD 分别为 `8e432cd593b6e302ae9ddc19de67a61210aec958`、`f8b7e5108500e00eec50ed87af76515dbb7c684a`，均 dirty；通过结论绑定已记录工作区，不仅绑定 HEAD。

主负责人直接回读 Home `temp/home/doctor-final.json`、`coordination/.../report_05.md` 与 Beta `command-results.json` 核对结果。Alpha/Beta 各自 `.agents/dev/evidence/2026-11-26-quote-billing/` 保存原始测试、工作状态、源码散列、关键 I/O 与 handoff；Beta `joint-verification.json` 的 resolution/runtime/before/after 记录真实加载与调用；Home 只留组合验收与指针。

随后另一位 `/root/home_recall` 以 `fork_turns: none` 开启新上下文，仅收到 Home 路径与正常查询，未继承上述会话。它从 topic.md 找回 done/占用释放与实际 6/6、12/12，从 relations.md 找回 Alpha 契约 owner，从根 AGENTS 找回长期汇报顺序，并从 report_05.md 区分本地通过和未验证环境。全程只读；这补充 K01 与 E03 的新会话恢复证据，不声称实际触发过上下文压缩。

本次场景直接覆盖 E01/E05、K01/K02/K03/K04、M01/M02 的相关行为。九技能的统一读入口方法已逐一审查，缺失/损坏入口、安装选择与事务有专项测试；没有声称本轮用九个独立模型会话穷举 E02/E03。未改动的知识/历史/任务脚本由完整检查回归其陈旧写入、唯一 owner、忘记排除、索引部分失败、unknown 投递与占用保护；不把这些单元检查描述为独立 CLI 模型场景。

## M06：独立 CLI 阻塞与接续条件

实际安装的 Codex CLI 为 `0.172.0-alpha.2`，已有 ChatGPT 认证。官方 doctor 的 Responses WebSocket 握手成功，但最小只读 `codex -a never exec --skip-git-repo-check --ephemeral --sandbox read-only --json --color never -C <隔离目录> <固定确认提示>` 在 app-server 初始化退出 1：`Read-only file system (os error 30)`。JSONL 为空，没有模型回合。

合法配置 `sqlite_home`、`log_dir` 到可写隔离目录后仍失败。匹配版本的 [安装标识 resolver](https://github.com/openai/codex/blob/3abf31016e5dce07567454292571151829135df0/codex-rs/runtime-agent-instance/src/installation_id.rs) 要求写 `codex_home/installation_id`；[上游同类答复](https://github.com/openai/codex/issues/51293#issuecomment-6103901396) 说明 ephemeral 不免除全部运行状态写入。这支持强候选原因；本机 ptrace 不允许，不能冒称取得了失败路径 trace。

本机官方 daemon version 查询也未连接成功，没有已提供的可用 remote app-server 或第二个已认证 CLI。未改写 HOME/CODEX_HOME、未改宿主权限或认证、未探测隐藏端点。详见过程原件 `cli-preflight/preflight.md`、空 JSONL、stderr 与仅保留非敏感字段的 doctor 结果。

后续需在具备正常可写状态目录和既有认证的独立 CLI 环境，从该已发布包安装全新 Home，按 Issue 13.5 给正常自然请求，记录实际 CLI/模型标识或明确的不可观测范围、cwd、技能与 AGENTS 读取、真实 A/B 项目产物、持久知识与新会话召回。只有该链路有实际证据后才能勾选 M06 并关闭 Issue；平台原生运行、Claude SDK 枚举或 CI 文件检查不替代它。
