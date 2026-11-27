<a id="external-diagnostic-input-references"></a>

# 外部诊断输入参考

`sarif-schema-2.1.0.json` 是未经修改的 OASIS SARIF 2.1.0 schema（包含 Errata 01），固定到 [oasis-tcs/sarif-spec 1742a253](https://github.com/oasis-tcs/sarif-spec/blob/1742a253eb654bf8a4ed7c60eaef7412b2c23553/sarif-2.1/schema/sarif-schema-2.1.0.json)。固定仓库的原始[许可条款](OASIS-LICENSE.md)逐字保留，包括 OASIS 政策和 RF on RAND Terms Mode。其 draft-04 校验使用 Ajv 在本地运行；报告不能加载远端 schema 或 external properties。

`../fingerprints.mjs` 仅改编了 [github/codeql-action 592d162b](https://github.com/github/codeql-action/blob/592d162ba3b2f5a3411d2cbf01df9f82c492f269/src/fingerprints.ts) 中的行哈希算法，版权归 GitHub 2020，采用 MIT 许可。`CODEQL-LICENSE.txt` 保留该许可证。适配版同步读取已捕获字符串，并用原生 BigInt 的模 2^64 运算替代 Long。不包含上传、日志或运行时代码。

解析器组织和字段处理也参考了 reviewdog 的 SARIF 解析器，以及 DefectDojo 的 ESLint/Ruff 适配器；未嵌入这些运行时及解析器源码。
