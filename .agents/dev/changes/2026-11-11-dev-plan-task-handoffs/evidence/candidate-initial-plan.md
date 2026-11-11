现有 `plan.md` 不能直接交接：漏了导入预览、两个导出入口与预览器的整合验收；也误把“修改不同文件”当作可并行依据。以下计划替代旧计划，仅在回复中交付。

**目标、来源与边界**

以 [spec.md](/tmp/dev-plan-handoff-eval/candidate/shared/spec.md) 为准，交付三个可分别使用、分别验收的结果：CLI 导出、HTTP 下载、导入预览，并证明两种导出结果都能被预览器读取。

沿用现有 Node.js ESM 实现，不新增依赖、权限体系、库存写入或导入合并策略。实施交付止于本地代码及验证，不提交、不推送、不发 PR。遵守项目约束：仅访问当前项目，不联网；统一检查命令为项目根目录下的 `node --test`。

当前已核实的入口：

| 已有文件 | 当前行为与复用方向 |
| --- | --- |
| [schema.mjs](/tmp/dev-plan-handoff-eval/candidate/shared/schema.mjs) | `csvColumns` 当前只有 `sku,quantity`，作为统一列定义继续使用 |
| [csv.mjs](/tmp/dev-plan-handoff-eval/candidate/shared/csv.mjs) | `encode(rows)` 直接拼接，无 CSV 转义；扩展为共享格式实现 |
| [cli.mjs](/tmp/dev-plan-handoff-eval/candidate/shared/cli.mjs) | 仅有 `exportCsv(rows)`，没有命令行执行与退出码处理 |
| [http.mjs](/tmp/dev-plan-handoff-eval/candidate/shared/http.mjs) | `download(rows)` 返回 `{status: 200, body}`，继续保留该调用方式 |
| [test/csv.test.mjs](/tmp/dev-plan-handoff-eval/candidate/shared/test/csv.test.mjs) | 唯一测试锁定旧的两列输出，需要随规格更新 |

本次只运行了现有基线检查：`node --test`，1 项测试通过。这只能证明当前基线可运行，不能证明新需求已满足。

**统一行为约定**

以下是交接所需的具体接口安排；规格未指定的局部接口采用这些约定，避免实施者各自设计：

- CSV 表头固定为 `sku,quantity,note`。字段包含逗号、双引号或换行时加双引号，字段内双引号写成两个双引号。所有列使用同一转义规则。
- 为保留现有 `{sku, quantity}` 调用，缺省 `note` 输出为空字段；显式空字符串同样合法。
- 保留 `exportCsv(rows)` 和 `download(rows)`。CSV 内容按新规格升级，不保留旧两列输出。
- CLI 新增直接执行方式：`node cli.mjs` 从标准输入读取 JSON 行对象数组，成功将 CSV 写到标准输出。失败写诊断到标准错误并退出非零；完成读取、解析和编码后才输出 CSV。程序不写输入文件，也不新增输出文件参数。
- HTTP 沿用现有函数式响应对象，保留 `status`、`body`，增加 `headers`，使 `Content-Type` 为 `text/csv`；无需搭建新服务器。
- 拟新增 `preview.mjs`，提供 `previewCsv(text)`：成功返回 `{rowCount}`，失败返回 `{error: {line, message}}`。行数不含表头；错误行号从 1 开始，多行记录按该记录起始物理行定位。
- 预览校验固定表头、字段数和 CSV 引号结构，接受 LF、CRLF 及可选的末尾换行。仅表头返回 0 行；空输入报错；不额外引入 SKU 或数量的业务校验。

**切片 A：可实际执行的 CLI CSV 导出**

来源：`spec.md` 的“CLI 导出”；同时承接三个结果共用的格式契约。

交付：现有 `exportCsv(rows)` 与真实 CLI 均能输出三列、正确转义的 CSV，并提供可观察的失败退出行为。

依赖：无，可以首先实施。共享格式调整较小，直接并入首个完整行为，不单列基础设施任务。

写入边界：A 的实施者唯一负责修改 `schema.mjs`、`csv.mjs` 的编码部分、`cli.mjs`、现有 `test/csv.test.mjs`；拟新增 `test/cli.test.mjs`。导入模块时不得执行 CLI 或读取标准输入。

验收与证据：

- 调用 `exportCsv`，输入普通记录、缺省 note、空 note → 表头及字段顺序正确，每条记录均有三列。
- 分别输入含逗号、双引号、LF、CRLF 及组合字符的 note → 与人工写定的 CSV 预期文本一致，不能仅用未来解析器回读代替编码正确性断言。
- 通过子进程执行真实 CLI，传入有效 JSON 数组 → 退出码为 0，标准输出为完整 CSV。
- 传入损坏 JSON 或非数组输入 → 退出非零，标准错误有诊断，不输出部分 CSV。
- 测试以临时输入文件供给 CLI，并比较执行前后原始字节 → 输入保持不变。
- `node --test` 全量通过，包括更新后的旧测试。

A 的完成证据由编码断言及真实子进程测试提供；不等待预览器完成。

**切片 B：保持调用方式的 HTTP CSV 下载**

来源：`spec.md` 的“HTTP 下载”。

交付：已有调用方仍能调用 `download(rows)`、读取 `status` 和 `body`，响应同时具备规定的 CSV 类型与格式。

依赖：A 提供的三列定义、共享编码器及对应测试已可用。B 无需自行实现转义。

写入边界：B 的实施者唯一负责 `http.mjs`，拟新增 `test/http.test.mjs`；读取共享格式模块，不修改其契约。

验收与证据：

- 调用现有 `download(rows)` → 返回 `status: 200`、字符串 `body`，以及值为 `text/csv` 的 `Content-Type`。
- 输入包含空 note、缺省 note、逗号、双引号和多行 note 的记录 → 响应体与人工预期 CSV 一致。
- 相同输入分别调用 `download(rows)` 与 `exportCsv(rows)` → 响应体与 CLI 函数导出内容完全一致。
- 原有 `{sku, quantity}` 调用仍可使用 → 新增 note 列为空，既有响应属性保留。
- `node --test` 全量通过。

本项目没有实际 HTTP 服务器，验收使用现有响应对象入口，不为验证新增网络层。

**切片 C：只读 CSV 导入预览**

来源：`spec.md` 的“导入预览”。

交付：调用者提交相同 CSV 格式，获得记录数或带行号的错误，全程不写库存。

依赖：A 提供的三列定义和格式契约。C 的独立验收使用手写 CSV，不依赖 B 或最终往返测试。

写入边界：C 的实施者唯一负责拟新增的 `preview.mjs`、`test/preview.test.mjs`，并可在 `csv.mjs` 增加解析能力；保持 A 已验收的编码接口与行为，`schema.mjs` 只读。

实施要点：解析必须支持引号内逗号、转义双引号和跨行字段，不能用逐行拆分再按逗号切割实现。预览入口不接入库存或持久化写入。

验收与证据：

- 输入人工构造的合法 CSV，覆盖空 note、带逗号、双引号、多行 note → 返回正确记录数，多行字段不增加记录数。
- 仅表头 → `{rowCount: 0}`；有无末尾换行、LF 与 CRLF 均按约定接受。
- 表头缺列、错序或字段数不符 → 返回含行号的错误。
- 未闭合引号、非法引号位置或引号结束后存在非法字符 → 返回错误，定位到出错记录的起始行。
- 在前面存在跨行记录时再制造错误 → 行号仍按物理行计算。
- 同一输入重复预览 → 结果一致，无文件或库存写入。
- `node --test` 全量通过，A 的编码和 CLI 测试继续通过。

**执行顺序与整合责任**

顺序为 **A → B、C → 最终整合验收**。

A 完成后，B、C 可以并行：B 只消费编码器，C 增加解析能力；两者不能各自改变列定义或编码契约。若 C 发现必须修改既有编码行为，由共享模块负责人统一处理，并复验 A、B。各自使用独立测试输入和临时资源，不共享固定文件路径。

最终整合由 A 的实施者负责，拟新增 `test/integration.test.mjs`。它是三个结果的共同完成检查，不增加第四项产品交付：

| 规格要求 | 实现归属 | 验证归属 |
| --- | --- | --- |
| CLI 三列、转义、失败非零、输入不变 | A | A 的编码与子进程测试 |
| HTTP 同格式、`text/csv`、调用方可用 | B | B 的响应及兼容测试 |
| 预览计数、带行号错误、空 note、只读 | C | C 的独立解析与预览测试 |
| CLI 输出可被预览读取 | A、C | 整合负责人执行真实 CLI，将标准输出交给 `previewCsv` |
| HTTP 输出可被预览读取 | B、C | 整合负责人将 `download(rows).body` 交给 `previewCsv` |

整合使用包含空 note、逗号、双引号、多行字段的同一组记录：两条路径均须返回原始记录数；保留独立文本断言，防止编码器与解析器出现相互抵消的错误。

实施者最终在项目根目录运行 `node --test`，在交接回复中记录实际运行环境、命令、结果及未通过项。只有三个行为各自通过、两条整合路径通过、全量回归通过，才达到规格的本地完成边界。当前尚未实施这些改动，也未创建任何文件或任务。