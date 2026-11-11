# 原始请求与隔离项目

这些是实际发送给独立上下文的请求，不含评分规则或预期结论。候选使用相同 CLI 默认配置、只读沙箱与独立会话；请求只访问合成目录，不修改本仓库。

## 同请求原版/候选/修正后复查

请使用 $dev-plan 核对现有 plan.md，并给出能交给未参与讨论的同事接手的完整计划。需求以 spec.md 为准，沿用项目现有实现。只在回复中交付计划，不实施、不创建任务或其他文件。

## 小改动

请使用 $dev-plan，先给一个简短改动计划：把 labels.mjs 和 README.md 中的“暂存”改为“保存”，不改变其他行为。只回复计划，不修改文件。

## 独立来源审查

请只读审查 before 与 after 的 dev-plan 改动，并对照 matt-original.txt、multiphase-original.txt、project-contract.txt 和 source-adaptations.txt 的维护依据；官方资料已放在本目录，按实际问题核对相关原文。重点找会造成执行错误、成熟方法丢失、授权越界或自相矛盾的具体问题，不要求制造发现，也不要做纯文风建议。对每个真实问题给严重性、路径和具体理由；明确没有发现阻塞时也说明未验证范围。不要修改文件。

## 合成项目的来源文件

以下保存共享契约场景的实际输入。输出中的 /tmp 绝对链接仅说明当时的隔离现场；目录可能清理，不作为长期运行前提。

### AGENTS.md

```text
这是一个隔离的 Node.js 示例项目。仅访问当前项目内的资料与代码，不联网，不读取其他项目或用户配置。开发检查为 node --test。
```

### package.json

```text
{"name":"handoff-ledger","private":true,"type":"module","scripts":{"test":"node --test"}}
```

### schema.mjs

```text
export const csvColumns = ["sku", "quantity"];
```

### csv.mjs

```text
import { csvColumns } from "./schema.mjs";
export function encode(rows) { return [csvColumns.join(","), ...rows.map(r => csvColumns.map(k => r[k]).join(","))].join("\n"); }
```

### cli.mjs

```text
import { encode } from "./csv.mjs";
export function exportCsv(rows) { return encode(rows); }
```

### http.mjs

```text
import { encode } from "./csv.mjs";
export function download(rows) { return {status: 200, body: encode(rows)}; }
```

### test/csv.test.mjs

```text
import { test } from "node:test";
import assert from "node:assert/strict";
import { encode } from "../csv.mjs";
test("existing CSV columns", () => assert.equal(encode([{sku:"A",quantity:2}]), "sku,quantity\nA,2"));
```

### spec.md

```text
# 本次交付

用户要求三个可使用的结果，不是三张任务票：

## CLI 导出
CLI 导出 CSV；列顺序固定为 sku,quantity,note，note 中的逗号、双引号和换行遵循 CSV 转义。失败时退出非零，不覆盖原输入。

## HTTP 下载
HTTP 下载使用相同 CSV 列与转义规则；响应 Content-Type 为 text/csv。现有调用方继续可用。无需新增权限体系。

## 导入预览
只解析同一 CSV 格式，返回行数或含行号的错误，不写库存。空 note 合法，不增加真正导入和合并策略。

## 完成
三项各自可验收；再证明 CLI 导出结果可被导入预览读取，HTTP 同样输出被预览器接受的格式。交付止于本地代码及验证，不提交或发 PR。
```

### plan.md

```text
# 旧计划

A：CLI 导出，只写 cli.mjs；运行 node --test 即完成。
B：HTTP 下载，只写 http.mjs；运行 node --test 即完成。
A 与 B 不改同一文件，可以马上并行。所有任务完成即需求完成。
```
