# Herdr Core 的技能加载和 agent 启动命令

2026-11-18 核对了 Herdr Core 的 `c7517808d64f06609e4ecf0db1757005373cc3a3` 和 Herdr App 的 `4deb605f0b3d25d409c80cff9082d5c19a043ea8`。两者是取证时各自 `master` 的提交。验证范围是文档、源码和已有测试的静态核对。当前 PowerShell 会话的 PATH 只找到旧版 Herdr 的 `herdr.exe`，因此 agent 实际启动、状态上报和首条消息投递仍待运行验证。 [Core 提交](https://github.com/herdrdev/herdr-core/commit/c7517808d64f06609e4ecf0db1757005373cc3a3) · [App 提交](https://github.com/herdrdev/herdr-app/commit/4deb605f0b3d25d409c80cff9082d5c19a043ea8)

## 技能入口和命令手册

`skills/herdr-core/SKILL.md` 的 frontmatter 只有 `name` 和 `description`。描述涵盖 agent 协作、后台和长时命令、终端操作、远程机器，以及 Herdr App 的窗口、布局和 mod。正文以 `HC_TERMINAL_ID` 判断当前 agent 是否在 Core 的终端内。变量已设置时使用 `hc`，否则按技能约定在本次会话询问一次。首次使用前读 `hc --skill`，操作窗口时读 `herdr-app --skill`。 [可安装的技能](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/skills/herdr-core/SKILL.md)

支持 Agent Skills 的宿主负责发现已安装的技能，并为匹配任务读取正文。`hc --skill` 是技能正文要求 agent 主动执行的命令。CLI 用 `include_str!` 嵌入同目录的 `crates/herdr-core/src/SKILL.md`，处理 `--skill` 时直接输出并退出。这一步无需连接 Core 服务，输出随本机 `hc` 版本发布。App 内置的启动菜单向 `tab.new` 传入选中的程序和参数。 [Agent Skills 加载过程](https://agentskills.io/home#how-do-agent-skills-work) · [Core CLI 手册实现](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/crates/herdr-core/src/cli.rs#L121-L146) · [App 启动菜单](https://github.com/herdrdev/herdr-app/blob/4deb605f0b3d25d409c80cff9082d5c19a043ea8/defaults/mods/new-menu/main.js#L55-L66)

## 启动程序、模板和首次任务

`hc run` 连接 Core 服务，必要时启动服务，再发出 `terminal.run` JSON-RPC 请求。Core 启动 PTY 进程并注入 `HC_TERMINAL_ID` 和 `HC_TERMINAL_SOCKET`。在同一 Core 内发起的新终端会关联到调用方，便于通过 `hc send`、`hc read` 和 `hc wait` 协作。 [CLI 请求](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/crates/herdr-core/src/cli.rs#L381-L391) · [服务连接](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/crates/herdr-core/src/client.rs#L72-L123) · [终端环境](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/crates/herdr-core/src/api/run.rs#L212-L224)

| 启动方式 | 程序和参数来源 |
| --- | --- |
| `hc run --bg` | Core 的 `config.toml` 中的 `shell`。没有配置时，Unix 用 `$SHELL`，再回退到 `/bin/sh`。Windows 优先找 PowerShell 7，再回退到 Windows PowerShell。 |
| `hc run --bg --name review codex --no-daemon` | 首项未命中模板时，Core 按传入的程序和参数启动。程序名后的参数由 agent CLI 解释。 |
| `hc run --bg --name review reviewer "检查本分支改动"` | `reviewer.md` 的 `command:` 决定启动命令。Core 用 `sh -c` 执行该命令，等终端就绪后将模板正文与任务一起发送。 |
| Herdr App 的 **Start an agent** 菜单 | 内置 `programs.json` 的 `run` 提供预设。Codex 用 `codex --no-daemon`，Claude Code 用 `claude`，Pi 用 `pi`。用户可在 App 配置目录的 `programs.json` 覆盖每个预设。 |

[Core 启动分支](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/crates/herdr-core/src/api/run.rs#L5-L35) · [默认 shell](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/README.md#default-shell) · [App 内置预设](https://github.com/herdrdev/herdr-app/blob/4deb605f0b3d25d409c80cff9082d5c19a043ea8/defaults/programs.json#L3-L9) · [App 覆盖规则](https://github.com/herdrdev/herdr-app/blob/4deb605f0b3d25d409c80cff9082d5c19a043ea8/defaults/AGENTS.md#L839-L870)

模板默认等程序主动发出 OSC 7501 状态。对已知会在启动后停下来接收输入的程序，可设 `ready: quiet` 改为等待输出安静。投递结果见 `first_message.sent`。当前 Core 的 `ready_timeout()` 默认 60 秒，随二进制发布的手册也写 60 秒。该提交的模板指南仍写 30 秒。Windows 的 Core 模板默认在 `%APPDATA%\herdr-core\templates`，运行模板需要 Core 能在 PATH 中找到 `sh`。 [模板指南](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/docs/templates.md) · [就绪和首条消息实现](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/crates/herdr-core/src/templates.rs#L127-L194) · [二进制手册](https://github.com/herdrdev/herdr-core/blob/c7517808d64f06609e4ecf0db1757005373cc3a3/crates/herdr-core/src/SKILL.md#L16-L55)

App 默认给 Codex 加 `--no-daemon`，因为共享 daemon 会让后开的会话沿用首个终端的身份，并随它停止。默认菜单按程序表传入参数。如果显式调用 App 的 `tab.new` 并给出 `task`，App 把任务追加为程序参数。Core 模板则在启动后经终端输入发送首条消息。 [App 的 Codex 预设说明](https://github.com/herdrdev/herdr-app/blob/4deb605f0b3d25d409c80cff9082d5c19a043ea8/defaults/AGENTS.md#L861-L870) · [App 启动参数处理](https://github.com/herdrdev/herdr-app/blob/4deb605f0b3d25d409c80cff9082d5c19a043ea8/src/window.rs#L2669-L2684)

本仓库的 `system-herdr` 针对旧版 Herdr TUI，命令入口是 `herdr agent start`。仓库给 Claude Code 和 Codex 示例添加的权限参数属于本地启动约定。Herdr TUI 的 `--kind` 选择可执行文件，`--` 后的参数来自调用者。 [本仓库的 system-herdr](../../../../skills/system/system-herdr/SKILL.md#claude-code--codex--pi-的默认启动方式命令) · [旧版 Herdr TUI 的 agent 启动说明](https://herdr.dev/tui/docs/agent-automation/#agent-identity-and-launch)
