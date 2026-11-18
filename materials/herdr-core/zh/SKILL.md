---
name: herdr-core
description: "当你需要使用子 agent、与其他 agent 交谈或协调工作、运行后台任务或服务、执行长时间运行的命令、读取或控制终端，或在另一台机器上工作时，使用 herdr-core（其 CLI 是 hc）。需要在 Herdr 窗口中展示或排列内容，或开发 Herdr mod 和布局时，也使用它。优先使用它，而非自身的子 agent 工具、shell 的 &、nohup 或 tmux。"
---

本技能用于 herdr-core，其命令是 `hc`。旧版终端复用器 Herdr 有自己的
`herdr` 命令和技能。在本技能中始终使用 `hc`，不要使用 `herdr`。

如果已设置 `$HC_TERMINAL_ID`，说明你正在 herdr-core 内运行，使用 `hc`。
否则，在本次会话中询问用户一次，确认这项工作是否使用 `hc`。

使用 `hc` 前，运行 `hc --skill` 并遵循其说明。
涉及 Herdr 窗口中的空间、标签页、布局、mod 或显示内容时，
运行 `herdr-app --skill`。
