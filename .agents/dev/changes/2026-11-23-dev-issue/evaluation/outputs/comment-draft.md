## 补充：同一报错可由两个入口触发，建议先补调用栈和最小输入

针对 [#55](https://example.invalid/example/memodesk/issues/55) 以及维护者要求补最小复现的评论（提供快照中的评论 ID `20`），我检查了附带日志和当前查询源码，并用构造输入验证了两条候选路径。现有证据仍不足以确定报告中的实际触发输入或根因。

### 新证据

`user-log.txt` 记录的错误是：

```text
TypeError: Cannot read properties of null (reading 'toLowerCase')
Reported version: 1.0.0
No imported JSON attached.
```

日志没有调用栈、导入 JSON、操作时传入的查询参数或原运行环境信息。所提供源码快照的 `package.json` 同样标记 `1.0.0`，但没有提交号，不能据此证明它与报告发生时的构建完全一致。

当前 `src/notes.mjs:1–5` 为：

```js
export function listNotes(notes, query = '') {
  const needle = query.toLowerCase();
  return notes.filter(note => !note.archived && note.title.toLowerCase().includes(needle))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
```

这里有两个直接调用 `toLowerCase()` 的位置：

- 第 2 行：`query` 为 `null` 时会报该错误。默认值 `''` 只处理未传参数或传入 `undefined` 的情况，不处理显式 `null`。
- 第 3 行：某条参与过滤的未归档记录的 `title` 为 `null` 时也会报完全相同的错误。

在所给离线源码上做的构造输入检查如下。**实际执行环境为 Node.js `v24.22.3`；项目约定使用 Node.js 22，尚未在 Node.js 22 复验。以下结果证明候选触发机制，不代表复现了报告者那次导入。**

| 构造输入 | 本次观察结果 |
| --- | --- |
| 合法未归档笔记，`title: 'Alpha'`，查询 `'ALPHA'` | 返回该笔记，正常大小写不敏感查询成立。 |
| 未归档笔记 `title: null`，查询 `'alpha'` | 产生与日志相同的 TypeError，首个源码位置为 `src/notes.mjs:3:60`。 |
| 合法未归档笔记，查询参数为 `null` | 产生与日志相同的 TypeError，首个源码位置为 `src/notes.mjs:2:24`。 |
| 已归档笔记 `title: null`，查询 `'alpha'` | 返回空数组；归档条件短路，不会读取该记录的标题。 |
| 未归档笔记 `body: null`、标题合法，查询 `'alpha'` | 正常返回；当前查询没有读取 `body`。 |

两条错误路径可在仓库根目录用以下构造示例单独验证，无需修改项目文件：

```sh
node --input-type=module <<'NODE'
import { listNotes } from './src/notes.mjs';
const note = { id: 'a', title: 'Alpha', body: 'one', updatedAt: '2026-11-20', archived: false };
for (const [label, notes, query] of [
  ['null title', [{ ...note, title: null }], 'alpha'],
  ['null query', [note], null],
]) {
  try {
    console.log(label, listNotes(notes, query));
  } catch (error) {
    console.log(label, error.stack);
  }
}
NODE
```

另外，`src/store.mjs:2` 的 `loadNotes(file)` 只执行文件读取和 `JSON.parse`，没有记录结构或字段类型验证。`JSON.parse` 可以成功解析包含 `title: null` 的合法 JSON。**如果外部导入复用这条加载路径，缺少字段校验可能使此类记录进入查询；这是根据源码提出的调查线索。**快照没有导入调用点，尚不能确认真实导入路径或坏数据来源。

“导入后报错”使导入数据中的空标题值得优先检查，但日志本身不能排除空查询参数，也不能说明故障概率或回归范围。

### 建议与影响

建议先取得能区分上述入口的证据，再决定修复范围；下面是分析建议，尚未由维护者确认采纳。

1. **定位原始触发点。**补充完整调用栈中的首个项目源码位置、实际传给 `listNotes` 的查询值及类型、应用版本或提交、Node 版本和复现步骤。导入数据可缩减为一条记录，但要保留触发字段的真实值和类型，尤其是 `title`、`archived`、`updatedAt`。
2. **核对导入边界。**追踪外部 JSON 如何成为 `notes` 数组。若确认是非法记录进入列表，建议在导入或加载边界验证数组结构及需要的字段，给出可定位到记录和字段的错误。整批拒绝还是允许跳过错误记录应沿用已有导入契约；没有契约时需先明确处理策略，不能默默删除记录或把 `null` 转成字符串来掩盖问题。
3. **核对查询参数契约。**若确认调用者传入 `null`，修复该调用来源，并让查询边界对无效类型给出可理解的处理。仅当项目明确允许 `null` 表示空查询时才将其归一化；不能把未经确认的语义写成既定规则。
4. **保护现有行为。**定位与修复时保持未归档过滤、更新时间降序和标题大小写不敏感搜索；当前错误与 `body` 没有直接调用关系，不需要据此扩大到正文搜索功能。

### 验证与接续

- 在项目约定的 Node.js 22 上，用原报告缩减后的 JSON 和实际查询参数重现，并记录触发源码行；对比这里的两个构造输入，确定哪条路径与原问题一致。
- 修复后，对已确认触发路径增加回归验证：合法输入搜索仍正常；不合法的记录或查询参数按约定得到明确错误或受控处理，不再出现未处理的该 TypeError。
- 若调整导入校验，验证有效导入保持数据不变，失败处理符合已确定的整批拒绝或部分接受规则，错误信息能定位具体记录和字段。
- 使用已存在的 `npm test` 入口验证查询回归。当前命令只运行 `test/notes.test.mjs`，其中两条现有测试未覆盖空标题、空查询参数或导入校验；拟新增测试要纳入实际运行范围。本次没有新增测试，也没有把计划中的修复验证记为已通过。

目前可以认领的下一步是**补齐原始最小输入并定位故障路径**。本次已经补充源码证据与构造输入结果；原始输入、调用栈和环境仍缺失，因此暂不认定根因，也不宣称已经修复。
