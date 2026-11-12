# Herdr 方法采用与文件通信

实际执行正文统一保留在 [SKILL.md](../skills/system/system-herdr/SKILL.md)，配套文件仅提供 topic、task、report 和 manifest 的通信格式。核对日期：2026-11-12。

## 来源与完整性

依据[父清单](../materials/manifest.tsv)固定的 Herdr 修订 `ee5bfb5041bb3e4a49d591c72308aae3c81ecdde`，对照[完整原件](../materials/herdr/upstream/SKILL.md)、[中文底稿](../materials/herdr/zh/SKILL.md)及[逐文件采用记录](../materials/herdr/manifest.tsv)。本次核对时上游 master 仍为同一修订，原件 blob 为 `4943e5575e941a7820ea01ca9416e79749c3ddc3`；原件、中文底稿及父清单版本未改变。

CLI 正文从完整中文底稿复用，保留环境、帮助、布局、身份、ID、跨机器、启动、投递、等待、读取、关闭边界与错误处理的全部方法、数值和命令示例。具体采用范围仅登记 SKILL.md，不保存第二份 CLI 或协议正文。

## 必要适配与本地扩展

| 对应内容 | 处理及原因 |
| --- | --- |
| 技能名称与描述 | 使用本仓库的 system-herdr 名称，描述补充文件通信入口；保留明确使用 Herdr 才触发及运行环境前提 |
| agent_blocked 的回答 | 先检查界面，沿用已有授权；只在缺少必要决定、权限或认证时询问，符合仓库不重复审批约定 |
| 提交与等待 | 保留原有生命周期语义；单项任务可提交后等待，多个已确定并行任务先投递再等待，不改变 CLI 的完成判定 |
| Markdown 输出后备 | 普通终端交互恢复原件的后备限定；用户指定 task/report 通信时从首次派发就使用持久文件，两个场景分别说明 |
| Claude Code、Codex、Pi 默认启动命令 | 逐字保留既有三条本地启动命令及其模型、推理强度、权限和后台选项；保留占位参数说明，不写进来源原件或译文 |
| 持久文件通信 | 按用户指定使用日期主题目录、pane 目录和同号 task/report；三列 manifest 维护当前任务与 active/done/blocked，保留验收、重复投递和中断恢复约定 |

文件通信是本地约定，不是 Herdr 原生消息系统。报告与真实产物用于验收，终端生命周期不替代任务结果；恢复时先核实动作是否已经发生。实际检查范围见[验证记录](validation.md)。
