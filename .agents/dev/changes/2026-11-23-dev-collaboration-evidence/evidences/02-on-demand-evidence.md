# 02 开发取证验收

任务：[02-on-demand-evidence](../tasks/02-on-demand-evidence.md)

状态：隔离联验通过。真实业务浏览器操作、TLC 求解和 Pele 渲染不在已验证范围。

Windows / Node v24.21.0，基线 `d6b7d32` 的本轮工作区打包。已安装的有限模型检查在隔离副本去掉提交保护后按预期退出 1，报告 9 个状态、13 条迁移和 `NoOversell` 的四步反例。验收探针误期待报告写「违反」，实际文案是「发现反例」，导致探针提前结束，不是工具行为缺陷。修正探针，保留初次输出于本机 `temp/dev/2026-11-23-dev-collaboration-evidence/integration/gate-02/probe.log`。

## 复验

- 在同一个装了真实 tarball 的隔离 Git 项目出票 `tasks/S2.5-reply-forward.md`，同名报告先标「未验证」。从另一个代码目录运行已安装的 `check-model.mjs MODEL --max-states 100 --max-transitions 1000 --out FILE`。故障版退出 1，恢复提交保护后退出 0（8 个状态、12 条迁移）。失败留 `temp/dev/test-evidence/tasks/S2.5-reply-forward/before/model-check.md`，复验留 `after/model-check.md`，都更新原同名报告；没有覆盖原件。
- 省略有限模型的 `--out` 只输出终端文本，没有写新文件。已安装的 `check-evidence.mjs CHANGE` 在第一次执行前及复验后均报告一对；仓库回归还用同数量的错名、错大小写和报告目录的目录、链接、附加工件检验拒绝分支。组合通过前没有根 `evidence.md`。组合通过后写一份，`git checkout-index` 导出不含 `temp/`，仍能读失败和复验事实及重跑命令。
- 从独立代码目录，以包含空格的绝对路径运行已安装的 `run-tlc.mjs`、`statechart.mjs`、`render.mjs`。固定 corpus 的 `PickWorker` / `TypeGuard` 回放中，TLC 包装器保留退出 0 / 12，状态图返回 0 / 1；生成报告、MMD 与日志均在 `temp/dev/`，非空目标被拒绝，版控目录无新增产物。三条命令都拒绝省略输出。SVG 夹具验证主题嵌入、显式输出和不覆盖；这不是实际 Pele 渲染。完整状态图 corpus 33 项回放通过。

## 重跑

运行 `node --test tests/evidence-storage.test.mjs tests/runtime.test.mjs` 和 `npm run check:statechart`。实际安装流程见 [03](03-initialize-temp-ignore.md)。在独立代码目录复制已装 `dev-formal-verify/assets/example/`；在 `implementation.mjs` 临时把提交时的 `state.available < 1` 检查改为 `false`，用上述命令把两轮输出写入不同 `--out`，恢复原样后复验。用已装 `dev-verify/scripts/check-evidence.mjs` 逐名核对报告，再用 `git check-ignore -v` 和 `git ls-files` 核对原件。最终联验输出位于本机 `temp/dev/2026-11-23-dev-collaboration-evidence/integration/gate-05/`；隔离消费者已清理，无需依赖这些附件阅读结论。
