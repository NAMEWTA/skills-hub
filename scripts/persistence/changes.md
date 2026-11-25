# 当前变更

- 活跃任务在 `./<YYYY-MM-DD-slug>/` 跟踪目标、规格、设计讨论、计划和进展。
- 远端 Issue 先关联或新建 Change，完整正文、可取得的讨论及方案附件进 `source/` 并跟踪；同源复用，更新保留版本。
- 出票即建 `evidences/` 下与 `tasks/` 完全同名的普通 `.md`，初始标「未验证」。失败、复验更新原报告；整体验收后写根 `evidence.md`。
- 原型用 `prototype/`，走查版本与确认范围记 `prototype-review.md`。正式资料跟踪，日志、调试截图等过程原件放项目根 `temp/dev/`。
- 完成或明确不实施后由 `dev-archive` 提炼知识到 `../notes/`，连同来源和正式资料归入 `../archive/changes/`。
