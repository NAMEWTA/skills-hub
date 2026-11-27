用于 AI 任务生成（lib/task.mjs）的夹具。小型合成 Python 代码为首批任务覆盖的每种类型各生成一项发现：

- complexity/function：`app/engine.py` `route`
- coupling/import-cycle：`app/a.py` ↔ `app/b.py`
- coupling/cycle：模块 `domain` ↔ `ui`
- architecture/boundary：`domain` → `ui`，使用 `analysis.config.json`

通过 `node test/task-fixtures.mjs` 重新生成 `../tasks/` 中的任务夹具。
