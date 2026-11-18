# system-herdr-core 实施与验证

## 采用范围

包内入口仅在明确选用 Core 时启用。短任务直接通信，需要留档时从首次投递使用文件。保留 Claude Code、Codex、Pi 三套默认命令，文件协议使用 Lead 侧完整终端地址作为清单键。Codex 的推理强度使用不含嵌套引号的参数写法。本机 `codex --help` 确认无法解析为 TOML 的值会按字符串处理。

用固定 Git 提交的对象重新对照 `skills/herdr-core/`，子树、模式、blob 和原件字节全部一致。逐项阅读短入口的中文底稿，核对了描述中的各个场景、工具选择、环境变量与外部询问条件，以及 Core 和 App 手册入口。触发条件和文件协作属于运行适配，已登记在材料清单。

路由按三个请求静态核对。使用 hc 让 Codex 审查进入 Core 启动参考，使用 herdr 拆窗格进入 TUI，未点名工具的并行检查沿用当前方式。

## 安装与运行

| 验证 | 实际结果 |
| --- | --- |
| 单独安装、与 TUI 同装、重复安装 | 隔离项目通过。单装可读取全部本地参考和模板。根 `AGENTS.md` 与已有 topic 内容通过逐字节比较 |
| Core 参数与终端 | Windows 上 `hc 0.1.21` 启动 Node 交互进程，核对了两种权限参数、`--no-daemon`、模型与推理参数。验证了 `address`、`HC_TERMINAL_ID`、读取、状态和退出 |
| 模板就绪失败 | 使用隔离模板启动不发 OSC 状态的程序，确认 `first_message.sent=false` |
| 并行和恢复 | 同时向两个测试终端投递各自的 task/report 路径。验证完整地址、报告发布、Lead 更新清单、重复消息复用既有终稿，以及过期指针停止。测试进程使用同目录临时稿和硬链接发布 |
| 真实 Pi | 用 `hc` 在隔离项目启动 Pi，由外部 Lead 发送路径。Pi 核对实际终端、清单与任务，读取 `input.txt` 后发布 `t1/report01.md`。报告记录 `herdr-core-sample` 及任务身份，Lead 对照样本和报告后将 manifest 更新为 `done` |

Pi 实测使用 `--no-session --no-extensions`，以隔离本次验证。Codex CLI 已通过本机帮助核对，启动参数已通过真实 Core 转发到测试进程。Claude Code 当前 PATH 未找到，真实 Claude Code 启动、Codex 模型任务、远程机器和 Herdr App 操作留待对应环境验证。

## 仓库检查

- `npm run check` 通过，检查 51 个技能、1,339 个本地链接和 14 个材料来源单元。
- `npm run check:package` 通过，验证 npm 包内 51 个技能及许可、安装和重复安装。
- 安装锁定依赖后，`npm run check:full` 的 Node 回归为 354 通过、11 跳过、1 失败。现有 `tests/materials-sync.test.mjs` 在尝试创建符号链接时收到 Windows 的 `EPERM`。该环境问题出现在调用材料同步工具之前。单独运行后续的有限状态与故障注入演示已通过。
- `git diff --check` 通过。
