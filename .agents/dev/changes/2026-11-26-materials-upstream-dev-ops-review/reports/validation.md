# 验证结果与边界

验证环境：Linux，Node.js `v24.22.3`。日期：2026-11-26（Asia/Taipei）。本轮改动是材料、中文对照、来源说明与研究记录，没有改运行技能或维护脚本。

| 检查 | 结果 | 能证明什么 |
| --- | --- | --- |
| 15 跟踪 ref 的最终复核 | 通过；15:40:12 时全部等于本次固定提交 | 该时刻的最新性，不承诺未来上游不会继续推进 |
| 独立 GitHub API 完整树比对 | 15/15 单元、13 仓库、2,196 原件通过 | 文件集合、Git blob、mode 与固定上游一致；所有树 truncated=false |
| `node scripts/validate-materials.mjs` | exit 0 | 父子清单、原件/对照集合、摘要、blob、模式、运行路径和稀疏中文规则 |
| `npm run check` | exit 0；16:32:59 结束 | 64 技能、785 Markdown、1,537 本地引用、许可包、领域持久化与材料检查通过 |
| `node --test tests/materials.test.mjs tests/materials-sync.test.mjs` | 85 通过，0 失败，0 跳过 | 既有材料读取、完整镜像、同步边界与异常处理测试 |
| `node scripts/check-statechart-replay.mjs`（即 `npm run check:statechart` 入口） | exit 1 | Login 的复合状态入口绘制尚未适配；全套回放未通过 |
| 中文全文与结构复核 | 已完成变化文档；Archify 重点新增模块另有独立复核 | 自然语言与原文步骤、约束、数值和技术内容对照；不是仅凭哈希判断译文质量 |

## 已复现的回放差异

回放进程先记录 20 个案例完成；Login 在图边/节点标记比较中失败。主流程尚未取得其余案例的完整结果。

- 本地实际入口边：`s0 → s2`。
- 最新固定夹具期望：`s0 → s1`，并在父复合状态内加入 `[*] → s2`。
- 错误类别：`AssertionError [ERR_ASSERTION]`，位置 `scripts/check-statechart-replay.mjs` 的图比较。
- 该差异与上游 Mermaid `drawnEdges` 处理一致；具体移植及相邻案例验收交综合 Issue 的 P0。

没有修改预期夹具、放宽断言或把失败报告成成功。本轮只运行已有 captured-output replay：使用本仓工具，并在隔离目录加载固定 corpus 的 `view.mjs`；没有启动新的 TLC 求解，也没有执行新收录的 Archify、pstack 或其他来源程序。

## 其他验证边界

常规 validator 输出中的 `0 explicit local Git trees` 表示未向该命令传入本地 Git 对象库。独立检查使用已保存的完整 GitHub API 树，对全部 2,196 个文件进行了另一次真实对比，见[核验报告](all-materials-source-tree-verification.md)，并非以清单自证。

程序、机器夹具与法律原件按各来源既有策略保留字节；Archify 可执行资源的原字节对照不称为译文。三篇原本中文的 Archify TS 文档没有重复 zh 副本。旧 `runtime_reviewed_blob` 保留，材料更新不证明运行采用已升级。

未运行跨平台完整门禁、安装/包分发验证或新上游程序端到端测试；未修改对应运行行为。Modern Web、Dashboard、Archify 的文档矛盾与代码示例缺陷为静态发现，Issue 要求在采用前核实。

过程日志保存在本地 `temp/dev/materials-upstream-review/`：`check-final.log`、`materials-tests.log`、`statechart.log`。本报告记录持久结论与复现入口；过程日志不加入版本控制。
