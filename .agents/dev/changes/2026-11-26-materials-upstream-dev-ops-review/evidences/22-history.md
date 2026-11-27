# 验证三宿主的只读项目会话定位和单文件安装

在 Windows、Node.js 24.21.0 上选择性安装 `dev-session-history`、`dev-recall` 和 `dev-reflect` 到空临时目录。历史包内只有 `SKILL.md`，另外两项的完整方法从各自已安装目录可读。入口预算、包内链接和持久化检查通过。

| 场景 | 实际结果 |
| --- | --- |
| Claude Agent SDK 0.3.332，`CLAUDE_CONFIG_DIR` 指向隔离目录；种入目标工作目录、同 slug 的目录名碰撞和另一个相邻目录 | `listSessions({dir, includeWorktrees:false})` 只返回目标项目；`getSessionMessages(id,{dir,limit:1,offset:0})` 读回目标会话的精确事件。[路径](https://code.claude.com/docs/en/agent-sdk/sessions#resume-a-session) · [方法](https://code.claude.com/docs/en/agent-sdk/typescript#listsessions) |
| Codex 0.172.0 的 App Server，隔离 `CODEX_HOME`；种入一个目标活动会话、一个同前缀邻居和一个目标归档会话 | `thread/list` 的精确 `cwd` 筛选、`archived:true` 和 `useStateDbOnly:true` 均返回预期候选；对目标执行 `thread/read` 后，线程的 `cwd` 与样本一致。[接口](https://learn.chatgpt.com/docs/app-server#list-threads) · [路径源码](https://github.com/openai/codex/blob/main/codex-rs/rollout/src/recorder.rs) |
| Pi 1.6.0 的实际 `SessionManager`，自定义会话目录；种入邻居会话、两个分支、中部坏行和截断尾行 | 项目列表排除邻居，读取保留四条合法记录，两条祖先链以各自叶节点重建。另对实际默认路径编码函数检查包含点的目录名。[会话](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sessions.md) · [数据格式](https://docs.pi.dev/latest/session-format) |

三种宿主验证均使用合成记录，过程文件和隔离安装已清理。实际个人会话仅核对 CLI 版本、帮助及存储目录元数据。挑选样例不覆盖远端、压缩 rollout 和所有历史版本。Pi 原生解析器会跳过坏行；发现缺口并记录行号由技能的流式读取方法负责。

另用真实 Codex CLI 0.172.0 在只读临时项目运行不含技能名称的自然请求，要求从指定 Pi 目录核对唯一会话身份和工具事件。前两轮找到正确会话和调用证据，但捕获的命令未显示读取技能。收紧技能描述后，以中文自然请求再试，观察到读取 `dev-session-history/SKILL.md`；回答核对了精确会话 ID、检出目录、文件头版本和时间，沿 `parentId` 确认唯一分支，并引用请求、工具调用与结果。它明确区分已验证的读动作与没有证据的修复或测试。该模型样例使用 Pi 合成记录；Claude Code 和 Codex 的样例验证的是宿主读取接口。
