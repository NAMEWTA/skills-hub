# Claude 会话官方依据

访问日期：2026-11-26。以下是本轮实际打开并核对的官方文档索引，正文在综合 Issue 的对应章节概括；本文件不是网页全文镜像。

| 文档 | 已核对章节与用途 |
| --- | --- |
| [Manage sessions](https://code.claude.com/docs/en/sessions#where-transcripts-are-stored) | 转录路径、目录编码、长路径和存储配置；核对 pstack 简化示例的适用边界。 |
| [Name the project directory yourself](https://code.claude.com/docs/en/sessions#name-the-project-directory-yourself) | 项目目录覆盖变量的适用版本、共同环境变量、有效字符与启动时读取约束。 |
| [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory) | 默认目录、Windows 目录与配置根移动。 |
| [Hooks reference](https://code.claude.com/docs/en/hooks#common-input-fields) | 会话身份、转录路径和异步落盘；另核对 SubagentStop 的独立 agent_transcript_path。 |
| [Agent SDK sessions](https://code.claude.com/docs/en/agent-sdk/sessions#resume-across-hosts) | 已有 SDK 的只读列表/消息接口，与会继续执行模型的 resume/query 行为区分。 |

官方文档会持续变化；实施时记录实际宿主/SDK 版本与支持形态。材料翻译仍保持上游原意，运行适配依据在 Issue 中单列，不静默改写来源。
