# 事项跟踪器：本地 Markdown

本仓库的事项和规格以 Markdown 文件存放在 `.scratch/` 中。

## 约定

- 每个功能一个目录：`.scratch/<feature-slug>/`
- 规格为 `.scratch/<feature-slug>/spec.md`
- 每个实现任务单独一个文件，位于 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，从 `01` 开始编号，绝不使用一个合并的任务文件
- 分诊状态记在每个事项文件顶部附近的 `Status:` 行中，角色字符串参见 `triage-labels.md`
- 评论和对话历史追加在文件底部的 `## Comments` 标题下

## 当技能要求“发布到事项跟踪器”

在 `.scratch/<feature-slug>/` 下创建新文件；必要时先创建目录。

## 当技能要求“获取相关任务”

读取引用路径处的文件。用户通常会直接提供路径或事项编号。

## 探路操作

供 `/wayfinder` 使用。**地图**是一个文件，每项任务对应一个**子文件**。

- **地图**：`.scratch/<effort>/map.md`，正文由笔记、目前决定和迷雾组成。
- **子任务**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，正文写问题。`Type:` 行记录任务类型（`research`／`prototype`／`grilling`／`task`）；`Status:` 行记录 `claimed`／`resolved`。
- **阻塞关系**：顶部附近的一行 `Blocked by: NN, NN`。当列出的所有文件都为 `resolved` 时，任务解除阻塞。
- **前沿**：扫描 `.scratch/<effort>/issues/`，寻找开放、未被阻塞且未被认领的文件；编号最小者优先。
- **认领**：开始任何工作前先设置 `Status: claimed` 并保存。
- **解决**：在 `## Answer` 标题下追加答案，设置 `Status: resolved`，再把上下文指针——要点加链接——追加到 `map.md` 的目前决定中。
