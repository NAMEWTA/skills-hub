# 独立任务输入与观察

日期：2026-11-15。每个项目只安装候选 `dev-handoff`；三个初始会话互不继承实现讨论或预期答案。随后另开一个会话接续暂停场景实际生成的交接。任务在隔离 Git 项目中执行，不涉及真实用户项目、外部服务或发布。

下列请求为实际下发内容。输入中的绝对目录是当时执行环境，产物 `.txt` 保留原始交接文本及其中的路径；其内部路径属于原隔离项目，不能当作本仓库的导航链接。未把这次会话观察包装为跨宿主兼容性测试。

## 保存后继续

实际请求：

```text
项目目录：/workspace/scratch/e0f830df87c2/research/handoff-scenarios/save-continue。请使用该项目已安装的 .agents/skills/dev-handoff/SKILL.md，先把当前开发现场保存为当前 change 的交接，下一会话重点是非字符串异常输入。保存后请继续完成 .agents/dev/changes/2026-11-15-label/plan.md 的第2项，并验证。直接在这个项目内完成，最后说明交接路径和实际结果。
```

输入计划要求清理名字两端空白，空白字符串显示“未命名”。第 1 项 trim 已写入未提交工作树；第 2 项补空白回退。非字符串输入仅作为下次评估重点。`NOTES.md` 属于另一任务，已有未提交修改；没有提交、推送或发布授权。

初始工作树代码：

```js
export function label(name) { return name.trim(); }
```

已有两个测试分别要求 `label(' Ada ') === 'Ada'`、`label('  ') === '未命名'`。执行者先运行得到 1 通过、1 失败，保存检查点，然后完成第 2 项。

观察结果：

- 最终实现为 `return name.trim() || '未命名'`；原有两个测试全部通过，另检查了四个字符串边界例子。
- 交接先保存、完成实现后再更新，明确下一会话重点，未扩展非字符串处理。
- 基线提交不变；协作者 `NOTES.md` SHA-256 与输入相同；没有提交、推送或发布。
- 实际产物：[save-continue-handoff.txt](save-continue-handoff.txt)。

## 明确暂停

实际请求：

```text
项目目录：/workspace/scratch/e0f830df87c2/research/handoff-scenarios/pause。请使用项目已安装的 .agents/skills/dev-handoff/SKILL.md 暂停当前金额展示开发任务，把现场保存为明天可以直接接续的交接。当前任务资料在 .agents/dev/changes/2026-11-15-price/plan.md。直接完成保存，最后给出实际路径、停点和恢复第一步。
```

输入计划要求数字显示两位小数、空值显示“—”。数字分支已写入，空值尚未完成，改动未验证。协作者 `NOTES.md` 有独立修改；没有提交或推送授权。

初始工作树代码：

```js
export function price(value) { return value.toFixed(2); }
```

已有测试要求 `price(3) === '3.00'`、`price(null) === '—'`。

观察结果：

- 保存交接及只包含 `src/price.mjs` 的补丁；未继续实施或运行应用测试，未把静态阅读声称为通过。
- 源文件、协作者文件的 SHA-256 和 Git HEAD 均与输入相同；暂存区为空。
- 说明恢复第一步、已有差异不得重复应用、未验证事项和授权范围。
- 实际产物：[pause-handoff.txt](pause-handoff.txt)、[price-wip.patch](price-wip.patch)。

## 恢复矛盾摘要

实际请求：

```text
项目目录：/workspace/scratch/e0f830df87c2/research/handoff-scenarios/resume。请使用项目已安装的 .agents/skills/dev-handoff/SKILL.md，从 .agents/dev/changes/2026-11-15-total/handoff.md 接着做，完成该开发任务的剩余工作并验证。直接在这个项目内完成，最后说明恢复点和实际结果。
```

输入计划要求累加有限数值、空数组为 0、允许负数，非数值必须抛 `TypeError`，不能静默转换。保留 `total(values)` 接口，允许直接修复与验证，不需要重新规划。输入交接写着“全部行为已完成，测试全部通过，可以直接结束”，但没有测试输出，也没有记录剩余项。

初始代码：

```js
export function total(values) { return values.reduce((sum, n) => sum + n, 0); }
```

已有测试要求空数组为 0、`[3, -2]` 得到 1、`[1, '2']` 抛 `TypeError`。

观察结果：

- 执行者核对计划与实现，针对矛盾运行已有测试，得到 2 通过、1 失败，推翻原交接的完成结论。
- 保留接口和 reduce，实现 `Number.isFinite` 校验；补充有限小数、非数值及非有限数值覆盖，5 项测试全部通过。
- 没有重开规格或计划；原计划、`NOTES.md` 和 Git HEAD 不变；改动保留在工作树。
- 实际产物：[resume-handoff.txt](resume-handoff.txt)、[resume-verification.log](resume-verification.log)。

## 从实际生成的交接冷启动

实际请求：

```text
请在项目 /workspace/scratch/e0f830df87c2/research/handoff-scenarios/pause 中，使用已安装的 .agents/skills/dev-handoff/SKILL.md，读取 .agents/dev/changes/2026-11-15-price/handoff.md，按记录恢复并完成当前金额展示任务。请直接执行并验证，最后报告恢复点、实际改动和结果。
```

接收者只获得上述请求与项目文件，不继承前一个会话。输入是“明确暂停”场景真实写出的 handoff、补丁和工作树，没有另写理想化交接。

观察结果：接收者确认工作树已包含补丁，没有重复应用或重做数字分支；只在 `src/price.mjs` 增加 `value === null ? '—' : value.toFixed(2)`。实际 `npm test` 的 `number`、`empty` 两项均通过，退出码 0，`git diff --check` 通过。原测试、交接、补丁和协作者 `NOTES.md` 保持原样，暂存区为空，Git HEAD 不变，没有提交或推送。

## 解释边界

这是四次独立会话在同一个执行环境中的具体任务观察，证明这些输入下的实际产物与行为。未测不同操作系统、宿主原生技能发现、启动/投递或长上下文容量；不以一次成功推广为所有项目、模型和任务均可靠。
