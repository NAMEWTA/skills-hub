# pstack 与 Matt Pocock 的运行采用复核

以 `08b59c48` 为基线，完成 [逐文件方法复核](../reports/24-method-review.md)。审阅覆盖 98 个固定上游入口、39 个原 dev 包和 157 条原待复核 dev 映射。上游入口和映射有交集，逐项记录涉及 185 个独立源文件。

- 156 条已有映射依据推进到当前源 blob。pstack 的 TypeScript 编译配置在 Node 运行包没有等价配置，取消原先指向运行 `package.json` 的映射。两份清单的 dev 映射未发现来源依据滞后。
- 配合技能拆分，15 条原采用路径迁到 `dev-pr`、`dev-status-video` 或 `dev-skill-authoring`。更改路径本身不作为采用核对证据。
- `dev-sharpen` 补回可用实验判定时先验证、再推荐的步骤。只要求改写时仍交付提示词。`dev-architecture` 补上从真实调用与近期变动定位浅模块、使用删除测试、引用既有 ADR 并比较候选结构的方法。新方法归当前模块设计资源，并记录 Matt Pocock 的来源映射。
- 17 个上游入口沿用材料身份，原因逐项列在复核报告。`chief-of-staff` 沿用原 Home 映射，本票没有推进其 Home 采用依据。

## 验证

| 实测 | 结果 |
| --- | --- |
| `npm run check` | 通过，70 个技能、833 个 Markdown、1,638 条本地引用，15 个来源及 2,196 个源文件。 |
| `node --test tests/watch-pr/cli.test.mjs tests/watch-pr/github.test.mjs tests/watch-pr/policy.test.mjs tests/runtime.test.mjs` | 70 项全通过。覆盖迁移后监控入口的模式、读 GitHub 的夹具、队列裁决，以及工作树审计、决策 TSV、人工复现和状态图本地脚本。 |
| `node --test tests/worktree-integration.test.mjs` | 2 项全通过。 |
| `npm run check:statechart` | 33 份固定捕获轨迹回放通过，覆盖 Login 的复合入口、反例和报告。 |
| 逐文件报告与子清单 | 185 条来源记录悉数匹配基线覆盖口径，报告引用的本地文件可读取，pstack 与 Matt 的 dev 运行映射采用依据均等于相应源 blob。 |

本轮 Watch PR 测试采用既有模拟平台响应，状态图使用固定 captured-output replay，资料复核没有启动新的 TLC 求解，也没有执行上游程序。
