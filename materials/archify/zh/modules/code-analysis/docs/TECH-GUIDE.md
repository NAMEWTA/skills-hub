<a id="code-analysis-technical-guide-what-is-behind-the-code"></a>
# Code Analysis 技术指南：代码背后的技术

本指南面向首次阅读本模块的人。每节回答四个问题：这是什么、代码在哪里、为什么使用它，以及容易遇到什么问题。阅读代码时碰到不熟悉的内容，可以回到这里查阅。

建议按流水线顺序阅读：先看运行时（Node、ESM），再看契约（JSON Schema），然后依次了解 extract → graphs → evaluate → overlay 各阶段使用的技术，再看将这些阶段与点击操作连接起来的 `serve` 进程，最后看测试与跨平台问题。

Java 适配器参见 [Java 源码分析](JAVA.md)，其中介绍解析器选择、语法与错误覆盖、保守的类型到文件解析、方法复杂度，以及结构性循环的语义。Java 解析在 Node.js 中运行；适配器会立即归约每个文件的 CST，而不会保留整个项目的语法树。

---

<a id="1-runtime-nodejs-and-es-modules"></a>
## 1. 运行时：Node.js 与 ES 模块

<a id="what-it-is"></a>
### 是什么

Bauify 是一个 Node.js 命令行程序。`.mjs` 扩展名表示文件属于 **ES 模块**（ESM），即 JavaScript 官方的模块系统，使用 `import` / `export` 语句，而非 CommonJS 的 `require()` / `module.exports`。

```js
// extract/py/index.mjs
import path from 'node:path';                   // Node 内置模块，使用 node: 前缀
import { fail } from '../shared/diagnostics.mjs';  // 本仓库中的文件；扩展名不可省略
export const id = 'py';
export function extract(root, config) { … }
```

<a id="why"></a>
### 为什么使用

`package.json` 中的 `"type": "module"` 让整个包默认采用 ESM。选择 ESM 而非 CommonJS 有两个原因：Archify 本身也使用 ESM，因此风格一致；ESM 的 `import` 是静态的，而这种“可静态分析的依赖”正是 Bauify 分析他人代码时所依赖的性质。

<a id="where-it-bites"></a>
### 容易遇到的问题

- ESM 中的相对导入**必须包含扩展名**：使用 `'./files.mjs'`，而不是 `'./files'`。
- ESM 中没有 `__dirname`。要找到当前文件所在目录，应使用 `fileURLToPath(import.meta.url)`；`scripts/build-python.mjs` 在构建入口中就使用了它。
- 带括号的 `import()` 是**动态导入**：它返回 Promise，参数可以是任意表达式。下文讨论“不透明”依赖时会再次涉及它。

---

<a id="2-contracts-json-schema-and-ajv"></a>
## 2. 契约：JSON Schema 与 ajv

<a id="what-it-is-1"></a>
### 是什么

**JSON Schema** 是一种用 JSON 描述 JSON 文档结构的标准。Bauify 中每个生成 JSON 的阶段都有对应的输出模式：`schemas/raw-facts.schema.json`、`schemas/module-graph.schema.json`、`schemas/findings.schema.json`。

**ajv** 是 Node 中使用最广泛的 JSON Schema 校验器。相关代码位于 `schemas/validate.mjs`：

```js
import Ajv2020 from 'ajv/dist/2020.js';           // draft 2020-12 版本
const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
const validate = ajv.compile(schema);              // 将模式编译为校验函数
if (!validate(data)) console.log(validate.errors); // 每条错误都带有 instancePath 和 message
```

<a id="why-1"></a>
### 为什么使用

先定义契约，再编写代码。模式确定后，extract 的输出会在**写入磁盘之前**接受校验，graphs 的输入会在**读取后立即**接受校验。某个阶段若输出不符合规范的 JSON，会立即以 `extract/schema-invalid` 失败，而不是让下一阶段莫名崩溃。

模式中的两个结构值得关注：

```json
"if":   { "properties": { "resolved": { "const": true } } },
"then": { "required": ["to"] },
"else": { "not": { "required": ["to"] } }
```

这是一个**条件约束**：`resolved` 为 true 时，必须存在 `to`；为 false 时，不能存在 `to`。这个不变量原先只写在注释中；一位审阅者指出，注释不是约束，因此它后来变成了由模式强制执行的规则。

`"additionalProperties": false` 禁止出现模式未列出的字段，因此适配器无法悄悄把私有字段塞进公开契约。

<a id="where-it-bites-1"></a>
### 容易遇到的问题

- Draft 2020-12 必须从 `ajv/dist/2020.js` 导入；默认的 `ajv` 导出只认识 draft-07，会报告“no schema with key or ref”。
- ajv 的 `strict: true` 会拒绝在 `then` 中通过 `required` 要求上一层定义的属性（`strictRequired`）。我们关闭 `strictRequired`，保留其余所有严格检查。

---

<a id="3-extractts-the-typescript-compiler-api"></a>
## 3. extract/ts：TypeScript Compiler API

<a id="what-it-is-2"></a>
### 是什么

TypeScript 是一门语言，但 `typescript` 包也以 API 的形式提供编译器，可将源码解析为 **AST**（抽象语法树）并执行类型分析。它也能解析普通 JavaScript（`allowJs: true`），因此 Archify 用它处理 JS 和 TS。

<a id="what-an-ast-is"></a>
### 什么是 AST

AST 是源码的树形表示。`import { a } from './x.mjs'` 这一行会变成一个 `ImportDeclaration` 节点，其下包含 `ImportClause`（导入什么）和 `StringLiteral`（从哪里导入）。分析代码，就是在树中寻找特定类型的节点。

`extract/ts/index.mjs` 中的遍历（`collectImports`）：

```js
const visit = (node) => {
  if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
    found.push({ specifier: node.moduleSpecifier.text, kind: 'static', line: lineOf(source, node), … });
  } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
    // import(...) —— 动态导入
  }
  ts.forEachChild(node, visit);   // 递归遍历每个子节点
};
visit(sourceFile);
```

`ts.isXxx(node)` 函数是用于判断节点类型的类型守卫；`ts.forEachChild` 采用深度优先遍历。

<a id="program-and-type-checker"></a>
### Program 与类型检查器

最初，Archify 使用 `ts.createSourceFile` 逐个解析文件。上游审阅者因一个真实缺陷，将其改为 `ts.createProgram(files, { noResolve: true, noLib: true })` 加上 `program.getTypeChecker()`：

```js
function local() { require('./dep'); var require = (s) => s; }
```

这里的 `require` 是局部变量，不是 CommonJS 加载器。单看语法无法区分；类型检查器的 `getSymbolAtLocation(identifier)` 会指出标识符绑定到哪个声明——没有声明表示全局 `require`，有声明表示局部变量。`noResolve` 和 `noLib` 让 Program 只做词法绑定，不解析模块或标准库，因此成本仍可接受。

<a id="project-sdk-and-configuration"></a>
### 项目 SDK 与配置

默认的 `typescript.sdk: "bundled"` 使用 Archify 自带的 TypeScript 5.9.3。它会遵循项目配置和引用，不执行被分析检出目录中的代码。固定树分析始终使用内置 SDK 和已捕获的解析输入，即使实时捕获配置为使用已安装的 SDK 也一样。

对于可信项目，`typescript.sdk: "auto"` 会在所选源码的 `node_modules` 或祖先目录的 `node_modules` 中寻找 TypeScript 包，也包括 `src/` 等较窄分析根目录之上的祖先目录。显式设置 `typescript.sdk` 时，可指定相对于分析根目录的 TypeScript 包目录，或指定绝对路径。这两种主动选择都会在 Archify 进程中执行所选 TypeScript 包中的代码。它们使用已安装的包，不下载 SDK，也不运行项目应用程序或构建脚本。

auto 模式找不到已安装的 SDK 时，会回退到内置 SDK，并在 `languageScope.limitations` 中记录已声明但缺失的 SDK。在实时分析中，`typescript.requireProjectSdk: true` 会拒绝任何选中项目使用 bundled 模式或 auto 回退。无效或未经验证的已安装 SDK 会导致失败。经过验证的版本范围是 5.6–6.0，并分别对 5.6.3、5.9.3 和 6.0.3 做过离散版本探测。

自动选择允许一次捕获使用不同 SDK。一个解决方案可以引用使用不同 SDK 的项目。某项配置服务于以其选中源码为根文件的组，其中也包括带有自身 SDK 的嵌套包源码。每个编译器都会验证其参与组的设置，并能沿解决方案配置跟随引用，而不套用无关的编译器选项。每个文件归属于一个项目和一个 SDK；`repository.adapter` 变为 `typescript@multi`，`languageScope.sdks` 及各项目的 `sdkIndex/sdkVersion` 记录具体分配。SDK 路径是规范化的物理路径，位于物理分析根目录内时使用相对路径。版本替换或 SDK 重新链接会在下次捕获时被检测到，包括同一进程中的重复库调用。被配置排除、但仍被选中的源码，其 SDK 仍会产生推断项目事实，且必须满足版本策略。Archify 的显式排除会在 SDK 选择之前移除这些源码。

每个选中的源码都会在根目录内查找 `tsconfig.json` 和 `jsconfig.json`；同一目录内优先使用 `tsconfig`。分析根目录是配置发现的工作区边界。TypeScript 依据冻结的文件清单解析 `extends`、`files`、`include`、`exclude` 和实际生效的编译器选项；被引用的配置（包括显式命名的配置）会被递归发现。这些模式用于选择初始根文件。SDK 的 `createProgram` 会沿导入和引用查找完整成员，因此 `exclude` 列出的文件仍可能通过导入进入 Program，这遵循 [TypeScript 的语义](https://www.typescriptlang.org/tsconfig/#exclude)。显式设置的 `noResolve` 会被遵守。

修订版 27 分析 **Archify 选中的每个源码文件**。不属于已配置 Program 的源码会进入推断项目，类似于在 VS Code 中打开一个文件。已配置项目原样使用 TypeScript 解析后的选项：未设置 `allowJs` 的 `tsconfig` 不会从推断默认值中获得它。推断项目使用受支持 SDK 对应的 VS Code 默认值：`allowJs`、模块 `Preserve`、解析 `Bundler`、目标 `ES2022`、JSX `react-jsx`，以及 `allowImportingTsExtensions`。参见固定版本的 [VS Code 选项构建器](https://github.com/microsoft/vscode/blob/2c33b50b16c472efe58357d1d2a8a5414bc23fbf/extensions/typescript-language-features/src/tsconfig.ts) 与[工作区边界](https://github.com/microsoft/vscode/blob/2c33b50b16c472efe58357d1d2a8a5414bc23fbf/extensions/typescript-language-features/src/tsServer/bufferSyncSupport.ts)。不会加载工作区设置、未保存的缓冲区或编辑器会话。`languageScope.excludedByProject` 仍是一个空的兼容字段；捕获范围仍受 Archify 自身的 include/exclude 和根目录限制。

归属判定优先选择包含文件的最近配置，其次是已发现且导入该文件的项目，最后才是推断项目。原生 Program 可以重叠；Archify 只在所属项目下记录一次源码。修订版 28 将 `projects[].files`（事实的独占归属）与 `projects[].members`（同一 SDK 下可供该调用方 Program 使用的已捕获源码）分开。即使导入源码成员有另一个默认所属项目，测试仍可以调用其中的函数。文件、函数、导入和调用点仅由所属项目输出，因此共享分析不会重复生成事实。历史比较会分别比较 SDK 身份、实际生效的选项、归属与 Program 成员关系，不受数组顺序影响。修订版 30 还为已配置项目记录 `selectionDigest`，覆盖实际生效的 `files`、`include`、`exclude` 和引用。选择条件的变更会影响可比性。在选择条件相同的情况下，Program 新增或移除源码可能改变所引入的共享依赖，但不会让两次运行变得不可比。

成员发现与词法调用提取使用同一个基于快照的编译器宿主。已配置和推断的成员 Program 遵循项目解析设置；后续调用 Program 则在完整的已捕获成员（包括共享依赖）上保留 `noResolve: true`。两者都省略标准库和自动类型包，也都不会把外部源码文本读入事实。当每个已捕获候选文件都已经是根文件时，扩展过程无法再增加成员，因而会跳过成员 Program。这在修复共享源码上下文缺失的同时，保留了有界调用模型。

跨所选 SDK 组的调用仍未解析。对于共享目标，调用方上下文中的实现范围与哈希必须匹配所属项目捕获的函数。转发语句的选择也必须匹配所属项目在相同语句位置记录的导入。如果两项配置为共享的 barrel 入口选择不同目标，该调用就保持未知，因为保存的文件图无法表达这种依赖上下文的路径。修订版 28 记录并验证这些 Program 边界；较早、不含 `members` 的捕获仍可按其记录的修订版读取。

快照宿主使用所选 TypeScript 包的 `matchFiles` 辅助函数，将 TypeScript 配置 glob 应用于已捕获路径。经过验证的版本均导出 `matchFiles`，但它不属于公开声明 API，因此升级版本时必须保留项目测试。JS 实现查找使用公开的 `resolveModuleName` API，其捕获宿主只提供 JS 候选文件。

架构漂移与拉取请求分析对物化后的 Git 树使用内置 SDK。它们仅使用各固定树中的输入解析项目，因此本地 SDK 设置和已安装依赖不会影响结果。

<a id="module-resolution"></a>
### 模块解析

`program.getModeForUsageLocation` 根据每个字面量导入的语法、文件或包格式，以及编译器选项，确定其解析模式，也包括显式的纯类型 `resolution-mode` 属性。该模式连同捕获的快照宿主一起传给 `ts.resolveModuleName`，使受支持的包 `imports` 和 `exports` 映射选择适当的 `import` 或 `require` 条件。在 NodeNext 模式中，动态 `import()` 即使位于 CommonJS 文件内也使用 import 条件；编译为 `require` 的 TypeScript 静态导入则使用 require 条件。

解析结果必须位于分析根目录内，且属于所选文件集合，才能成为已解析边。对于来自 `.js`、`.mjs` 和 `.cjs` 文件的非纯类型引用，如果包导入或 ESM 模式的相对导入选择了声明文件，就会触发实现查找。第二次公开的 `resolveModuleName` 调用使用仅暴露 JavaScript 实现的快照宿主；只有已捕获的 JavaScript 文件能够提供这条边。移除内部的 `noDtsResolution` 标志后，声明与实现的回归用例以及抽样的真实源码事实仍得以保留。即使声明文件被选中用于分析，缺失或被排除的实现仍保持未解析。TypeScript 调用方保留其源码与类型解析，相对 CommonJS 入口也保留原有行为。

对于 Node16/NodeNext 解析中的运行时 `.js/.mjs/.cjs` 引用，受影响的根目录内精确 `#imports` 和自身包导出键若包含 null 或空数组，会在 TypeScript 之前使用一个基于快照的小型目标选择器。已匹配条件中的 null 会阻断同级 default；空对象表示无匹配，而空数组表示阻断。数组可以在 null、无匹配或已知无效目标之后继续尝试，但绝不会因为所选文件缺失或被排除，或某种有效目标形式不受支持而继续。条件仍按引用分别确定（包括动态导入和 createRequire），并包含配置的自定义条件；也会遵守禁用的 imports/exports 选项。普通 TypeScript、纯类型、JSX 路径，以及无关的精确键都保留原有策略。

选择器支持嵌套条件与数组，以及字面量的相对 JavaScript 端点。受影响的模式路径、包内重定向、URL、转义或旧式路径形式、非 JS 端点、数字条件键，以及相关 node-addons/module-sync 策略，都会保持未知，而不会选择猜测的回退。它不增加外部包搜索、运行时解析器进程或跨提取缓存。版本升级时必须保留声明与实现的回归测试。这不是完整的 Node 运行时加载器；自定义加载器和能否成功执行仍是独立问题。仅有已解析边，不能证明 Node 会成功加载该文件。

<a id="bounded-esm-and-commonjs-call-targets"></a>
### 有界的 ESM 与 CommonJS 调用目标

`js-ts-lexical-v5` 沿已捕获、模块间无环的显式值导入与导出路径，追踪到唯一且已测量的函数实现体。对导入绑定的本地导出，以及显式再导出，都会在 `calls[].via` 中保留每条转发语句。不带函数体的重载签名不属于实现目标。观察到绑定写入或直接 eval 时（也包括括号与被擦除的 TypeScript 包装），会阻止对导入实现的归属判定。导航已保存问题之前，必须确认转发源码仍然新鲜。

`js-ts-lexical-v6` 还会沿顶层 `const { name } = require('./file')` 绑定，追踪到通过静态 `module.exports.name`、`exports.name` 或 `module.exports = { name }` 导出的唯一顶层函数声明。require 必须解析到调用方 Program 的已捕获成员；静态的自身 require 是有效的。重复或动态导出、逸出的模块对象、对可调用绑定的写入，以及直接 eval，都会使调用保持未解析。对目标进行命名空间 require 也会阻止归属判定。可见的加载器别名、动态 require、缓存访问或模块加载器逸出，会阻止整个已捕获调用方 Program 的 CommonJS 归属判定，因为它们可能绕过记录的静态边。这项保守规则也拒绝只读缓存使用；不会尝试对缓存影响做跨过程证明。使用前会检查目标已记录的 require 边和源码新鲜度。修订版 28 修复了现有模型中的共享成员覆盖，不增加成员分派，也不重新解释旧捕获。

修订版 23 保存每个已测量 JS/TS 函数精确的 UTF-16 源码范围与哈希。项目 SDK 捕获还记录语法类型。新鲜源码问题使用这些已捕获范围；成对的变更问题可以使用记录的语法类型，避免使用不同 SDK 重新解析。不含语法类型的历史捕获，在处理成对变更问题时仍采用保守的重新解析路径。

修订版 27 对带 UTF-16LE/BE BOM 的源码和配置采用与 TypeScript 一致的解码方式。UTF-8 源码 BOM 保留历史捕获表示；源码问题使用相同解码和 UTF-16 位置。适配器的 AST 遍历使用显式栈，因此 TypeScript 支持的有效长二元表达式不会导致适配器递归溢出。已测试的边界参见可执行的[对齐台账](../../../../upstream/modules/code-analysis/docs/TS-UPSTREAM-LEDGER.md)。

星号导出、纯类型导出、CommonJS 再导出与动态转发、任意函数值别名、工厂返回结果，以及循环路径仍不受支持。这是有界的源码证据，不能证明初始化顺序、运行时身份、执行情况或完整影响。历史调用模型保留各自捕获时的覆盖范围。

<a id="why-not-dependency-cruiser-or-babel"></a>
### 为什么不用 dependency-cruiser 或 Babel

适配器复用其 TypeScript Program 和遍历，生成导入边、函数度量及保守的词法调用事实。它不会为这些证据增加另一个语法解析器或模块解析器。显式的 `js-ts-lexical-v2` 调用模型及其不支持的情况见[架构说明](../ARCHITECTURE.md#jsts-call-facts)；完整符号图和调用图仍未实现。

<a id="where-it-bites-2"></a>
### 容易遇到的问题

- `node.getStart(source)` 需要 sourceFile 参数；省略它会导致 Program 模式下的位置错误。
- 使用 `localeCompare` 排序依赖操作系统区域设置，不同机器上的结果会不同——参见第 9 节。

---

<a id="4-extractpy-a-transplanted-pyright-parser-in-node"></a>
## 4. extract/py：移植到 Node 的 Pyright 解析器

<a id="what-it-is-3"></a>
### 是什么

Python 适配器现在完全在 Node 中运行。`extract/py/upstream` 包含来自 Pyright 1.1.414、采用 MIT 许可证的必要分词器、解析器、源码位置和解析器诊断。其精确提交、原始文件哈希与修改记录在 `UPSTREAM.json` 中。`syntax.ts` 可选择 Python 3.8–3.14 语法，不受宿主 Python 安装影响；默认是 3.14。

<a id="syntax-binding-and-source-declarations"></a>
### 语法、绑定与源码声明

`bindings.ts` 在查找前收集词法绑定事件。`collect.ts` 和 `facts.ts` 保留导入时机与纯类型守卫、模块符号、函数范围、调用清单、McCabe 复杂度和嵌套层数。`source.ts` 沿有界的接收者与签名类型追踪到已捕获声明，对不支持或有歧义的形式明确记录未知。原有的、基于捕获树的包与命名空间导入解析器仍位于 `index.mjs`。

`npm run build:python` 使用 esbuild 将这一部分打包为已检入仓库的 `analyze.mjs`。`npm run check:python` 检查该包并对源码进行类型检查；模块测试命令会自动运行它。生产环境不需要 Python、esbuild 或完整的 Pyright npm 包。功能契约、参考比较和更新流程参见 [Python 范围与来源](PYTHON.md)。

<a id="python-import-semantics-the-part-newcomers-find-hardest"></a>
### Python 导入语义（新手最难理解的部分）

- **包**：含有 `__init__.py` 的目录。在同一搜索目录中，Python 优先选择 `pkg/__init__.py`，而非同级 `pkg.py`。适配器在已捕获源码中遵循这一顺序。
- **相对导入**：`from .a import x` 中的点表示“相对于当前文件所属的包”。`level=1` 是同一目录，`level=2` 是父目录。超出分析根目录时记录为 `outside`。
- **`from pkg import name`** 有两种解释：`name` 是 `pkg/name.py`（子模块），或是 `pkg/__init__.py` 中定义的变量（属性）。代码先尝试子模块，再回退到属性，并指向 `__init__.py`。
- **PEP 420 命名空间包**：从 Python 3.3 起，**不含** `__init__.py` 的目录也可以是包。ai-voice 的 `utils/` 和 `asr/` 就属于这种情况。它本身没有文件，因此只有 `from ns import submodule` 会产生边；`from ns import attribute` 为 `unknown`。这个问题是在真实仓库中发现的：初版曾有 56 次解析失败。
- **绝对导入的搜索路径**：真实 Python 会搜索 `sys.path`；Bauify 无法知道用户的运行时，因此遵循常见约定：先搜索仓库根目录，再搜索 `src/`。
- **父包**：每个点分组件都先于其子级解析。`pkg.py` 这样的已捕获模块会阻断 `pkg.child`；普通包将子级查找限制在该包内。只有不存在优先的普通包或模块时，两个绝对搜索根目录中的命名空间部分才会合并。目录从已捕获的 `.py` 路径推导，因此被排除文件和空目录不会成为额外解析输入。当调用方属于该包时，相对导入也会按 root/src 顺序搜索推断的命名空间部分。普通包仍限制在自身目录内。如果分析根目录本身就是一个包，或源码目录位于推断包之外，则保留词法相对查找，因为其外部导入上下文未知。不对导入钩子、任意运行时搜索路径或 `__path__` 变更建模。
- **动态导入**：`importlib.import_module("a.b")` 的参数为字面量时可以解析；若为变量则记录为 `opaque`。
- **部分初始化**：A 导入 B、B 又导入 A 时，Python 本身不会自动失败。正在加载的模块已位于 `sys.modules` 中，因此第二次 `import a` 只会返回尚未完成构建的模块。只有当 B 执行 `from a import X`，而 A 尚未执行绑定 `X` 的那一行时才会失败。`import-cycle` 规则的分层正是基于这一区别（第 8 节）。

---

<a id="5-the-four-kinds-of-unresolved-why-they-are-counted-separately"></a>
## 5. 四类“未解析”：为什么分别计数

`raw-facts.json` 在 `unresolved` 下有四个计数器，它们都属于 `required`：

| 类别 | 含义 | 预期 |
|---|---|---|
| `external` | 裸模块名或 `node:` 前缀：第三方或标准库 | 大多属于正常情况 |
| `outside` | 已解析，但文件位于分析根目录之外 | 通常是测试引用了上一级目录的脚本 |
| `unknown` | 看起来是路径，但没有对应文件 | **应为 0**；非零表示存在解析缺口或代码中的引用已损坏 |
| `opaque` | `import()` / `require()` / `import_module()` 的参数不是字符串字面量 | 静态分析的盲区；必须保持可见 |

Java 保持相同含义：导入任何已分析文件都未声明的包（JDK、第三方）属于 `external`；无法解析的已分析包导入，或匹配某个已分析类型但无法解析的类型引用，属于 `unknown`。Java 适配器不对 `Class.forName` 或 `ServiceLoader` 这样的反射加载建模，因此其 `opaque` 保持为 0；这不表示代码中不存在此类加载。参见 [Java 源码分析](JAVA.md#dependencies)。

单个 Java 字段或方法静态导入，不会隐藏同名但无关的类型。只有当其所属者唯一地存在于已分析源码中、声明了该静态成员，并且具有完整已知的成员类型作用域且无匹配的声明或继承类型时，类型查找才会越过该导入继续进行。真正的成员类型导入，以及所属者或超类型链不确定的情况，仍保留保守防护；这不会增加类路径或通用层次解析。

`opaque` 尤其重要。Archify 的 `bin/archify.mjs` 通过 `spawnSync(process.execPath, [rendererPath])` 启动渲染器，并通过 `import(pathToFileURL(path.join(...)))` 加载 delta 模块——这两类调用的目标都只有在运行时才知道。图中从 `bin` 到渲染器**没有边**，这是事实；但如果只是缺少这条边，读者会误以为 `bin` 不依赖渲染器。计数会告诉读者“这里有 3 次无法看见的动态加载”，这就是 ARCHITECTURE.md 所说的“遗漏保持可见”。

---

<a id="6-small-utilities-glob-matching-file-roles-git"></a>
## 6. 小型工具：glob 匹配、文件角色与 Git

<a id="glob--regular-expression"></a>
### glob → 正则表达式

`config/defaults.json` 中的 `**/test/**` 和 `**/*.{js,mjs}` 是 **glob** 模式，即路径的简写形式。Node 18 没有稳定的内置 glob，因此 `core/glob.mjs` 手写了从 glob 到正则表达式的转换器：`**` → 任意层数目录，`*` → 单一路径段内的任意字符，`{a,b}` → 两者之一。一位审阅者补充了一个边界情况：未闭合的 `{` 以前会导致无限循环，现在会报告 `cli/config-invalid`。

<a id="file-roles"></a>
### 文件角色

每个文件都会标记为 `source` / `test` / `generated`。规则使用 glob，优先级为 **test > generated > source**：`test/generated-artifact-xml.test.mjs` 匹配其中两类，但被归为测试。这个优先级是在测试暴露歧义后确定的。

### Git

`extract/shared/git.mjs` 通过 `spawnSync('git', [...])` 运行三条**只读**命令：`rev-parse --show-toplevel`（仓库根目录）、`rev-parse HEAD`（上下文中的 `baseRevision`）和 `remote get-url origin`（远程 URL）。提取读取工作树，因此即使检出目录干净，`sourceKind` 也是 `working-tree`，`revision` 也是 null。没有 Git 时，基础修订版和 URL 为 null，分析仍会继续。每个文件保留适配器实际解析的文本；`extractFacts` 对捕获事实计算哈希，生成 `snapshotId`，并传播到图和发现结果。源码面板使用已捕获文本，不会重新读取已变化的文件，工作树结果也不会生成基于提交的源码链接。

---

<a id="7-graphsmodule-graph-basics-and-metrics"></a>
## 7. graphs/module：图的基础与指标

<a id="from-a-file-graph-to-a-module-graph"></a>
### 从文件图到模块图

raw-facts 中的边连接文件。`graphs/module.mjs` 将每个文件映射到模块（依据配置的分组、包边界或目录深度；根目录文件各自成为独立模块）。包边界来自标记文件——`package.json`、`pyproject.toml`、`__init__.py`——提取器将它们记录到 `packageMarkers` 中，因为它们不是被解析的源码，永远不会出现在 `files` 中。Java 还记录 `pom.xml` 和 `build.gradle(.kts)`，并按构建模块分组；单模块构建则按包分组，除非设置了 `modules.depth` 或 `modules.packageBoundaries: false`（参见 [Java 源码分析](JAVA.md)）。随后，图将文件边**合并**为模块边：同一对模块之间的多条文件边合为一条，`weight` 是数量，`kinds` 分别统计静态与动态边，`evidence` 最多保留五条 file:line 记录。

对于 JS/TS，默认策略也识别嵌套源码根目录：`web/src/pages/x.ts` 属于 `web/src/pages`，而直接位于 `web/src` 下的文件仍留在该根目录。无论是否有包标记，它都会使用任意包嵌套深度下最内层的 `src`，也包括 `src/apps/web/src`。单个根级 `src/*` 保留原有的深度二策略。显式 `modules.groups` 优先；显式 `modules.depth` 或 `modules.packageBoundaries: false` 恢复原始目录策略。分组路径未改变时保留原有模块与发现结果锚点。新拆分的路径获得各自锚点；`grouping.typescript: nested-source-roots-v2` 进入分析配置摘要，因此历史比较会将重新分组报告为不可比，而不是将消失的发现结果称为已修复。历史 v1 图使用第一个 `src`；它们仍可读取，与最内层根目录 v2 策略比较时会显示为分组变更。历史图和发现结果文档仍被接受。默认角色将 Vitest、Jest、Playwright 和 Cypress 配置、Vitest workspace 及 Karma 配置标记为 `test`；显式配置的角色数组会替换这些默认值。

使用 `Map` 去重是常见的 JS 写法：

```js
const key = `${from} ${to}`;
if (!edgeMap.has(key)) edgeMap.set(key, { from, to, weight: 0, … });
edgeMap.get(key).weight += 1;
```

<a id="fan-in-fan-out-instability"></a>
### fan-in、fan-out 与 instability

- **fan-in**：有多少其他模块依赖我（入边）。高 = 使用广泛，变更需谨慎。
- **fan-out**：我依赖多少其他模块（出边）。高 = 脆弱，它们每次变化我都需要跟随。
- **instability（不稳定性）** I = fanOut / (fanIn + fanOut)。0 表示纯汇点（只被依赖），1 表示纯源点（只依赖别人）。该指标来自 Robert C. Martin 的《Agile Software Development》；健康的方向是“不稳定者依赖稳定者”。

完全没有边时，I 为 `null`，而不是 0：不会把没有数据伪装成一个数值。

<a id="why-test-and-generated-files-are-excluded"></a>
### 为什么排除测试与生成文件

测试文件几乎会导入所有内容；保留它们会抬高每个模块的 fan-in，使指标失去意义。生成文件（`generated-validators.mjs`）属于构建产物，不反映设计。它们会被排除，但仍会**计数**（`excluded.files`），因此图中的卡片可以显示“102 个文件未绘制”。

---

<a id="8-evaluate-rules-tarjan-and-the-partial-initialisation-proof"></a>
## 8. evaluate：规则、Tarjan 与部分初始化证明

<a id="the-rule-engine"></a>
### 规则引擎

`evaluate/index.mjs` 加载各规则模块，使用模块图、原始事实和配置运行规则，并为每条发现结果生成稳定 ID，例如 `COUP-3f9a2c1b07de`：维度前缀加上规则代码与发现对象的哈希（对象使用排序后的文件路径，或模块分组路径，而非生成的模块 ID）。ID 不依赖输出顺序，因此新增或修复一条发现结果不会改变其他 ID，不同运行间也能匹配发现结果。改变模块分组配置会改变模块级 ID，因为这改变了模块本身的定义。有原始事实时，每条发现结果还带有 `evidenceDigest`：它所涉及的文件（对象文件，或对象各模块中的所有文件）及其源码文本的 SHA-256。修改无关文件不会改变该摘要，而 `repository.snapshotId` 会因任何编辑而变化；ID 不变、摘要变化，表示仍是同一个问题，但证据需要重新检查。规则之间不读取彼此输出。被抑制的规则会计入 `summary.suppressed`，而不是静默跳过。

<a id="strongly-connected-components"></a>
### 强连通分量

有向图中的循环是一组彼此都可达的节点。**Tarjan 算法**通过一次深度优先遍历找到所有这样的集合（强连通分量，SCC），过程中维护一个栈，并为每个节点保存从它可达的最小索引。单节点 SCC 只有在节点存在自边时才是循环。两条规则使用同一实现，但 `coupling/import-cycle` 包含单文件的自导入，而 `coupling/cycle` 只报告多模块 SCC。随后，第二次 BFS 会选出 SCC 内**最短**的循环，使消息能引用一个具体闭环，而非整个分量。

<a id="why-the-tiers"></a>
### 为什么分层

`import-cycle` 先从运行时分析中排除纯类型导入，再对所有运行时边以及模块作用域中的无条件子集分别运行 Tarjan。混合分量属于信息级，带有 `loading: not-proven`：延迟函数仍可能在模块初始化期间运行。模块作用域分量以 `potential-at-import` 发出警告。`findPartialInitCandidate` 可以在 `partialInitCandidate` 下附加绑定顺序假设，并设置 `potential-partial-init`；这不是执行证明，也绝不会将严重性提升为 error。测试会把小型手写夹具与真实 Python/JS 加载相比较，其中包括反驳旧版“安全”和“失败”断言的反例。运行时风险置信度 0.7 是序数启发式值，不是测得的概率。

Python 使用 AST 访问器区分函数体与外围默认值或装饰器表达式，标记仅限 TYPE_CHECKING 的边和条件边，并纳入子模块导入会加载的包初始化器。`match` 的匹配对象继承外围上下文；case 守卫和主体属于条件执行。TypeScript 标记显式纯类型边、延迟的 import()/require() 调用，以及受守卫控制的 CommonJS 加载。例如，`if (require("./a")) require("./b")` 会先求值第一次加载，再决定是否执行第二次。可选链参数和计算键也会为 CommonJS 加载增加条件：`sink?.use(require("./b"))` 与 `sink?.[require("./b")]` 都是条件执行。`require("./b")?.use` 中的基对象仍立即求值；`(sink?.use)(require("./b"))` 中的参数也是如此，因为括号分组打断了可选链。这些语法标志不能证明加载是否执行，也不能证明初始化是否安全。适配器解析别名和内联类型说明符时会使用 tsconfig 选项。如果 TypeScript 将相对 CommonJS require 解析为声明，适配器会在捕获清单中查找所请求文件，包括 Node 隐式的 `.js` 扩展名。对于目录，它会检查显式 JavaScript main 或默认 `index.js`。经确认的运行时文件对 require 优先，而纯类型导入保留其声明目标。源码文本、根目录内的 JSON 配置与包元数据，以及解析文件清单，都在编译器设置之前捕获。配置解析与模块解析使用该清单（也包括不存在的查找结果），不会重新读取工作树。已安装的配置包和非常规配置扩展在首次使用时缓存，并在返回前再次检查；如果发生变化，会以 `extract/source-changed` 拒绝提取。这种一致性检查不声称提供操作系统级原子文件系统快照。图保留结构依赖，分配避免碰撞的模块 ID，并保存精确文件归属供叠加层使用。在模式形状检查之后，语义校验会验证唯一性和跨记录引用。

<a id="hub"></a>
### 枢纽

`coupling/hub` 对模块图进行数值计算：fan-in 和 fan-out 都达到或超过配置阈值。发现结果中会回显阈值，让读者看到具体比较标准。

<a id="function-complexity"></a>
### 函数复杂度

Python 提取器在 `facts.functions` 中为每个函数记录一项：`file`、`name`、`qualname`（`Class.method`、`outer.<locals>.inner`）、`line`、`endLine`、`complexity`、`nesting` 和 `deepestLine`。复杂度遵循 McCabe/radon 的解释：函数本身计 1；每个 `if`/`elif`、`for`/`while`、`except` 处理器、条件表达式、除不可反驳的 `case _` 之外的 `match` 分支、每个推导式 `for` 及其 `if`，以及 `and`/`or` 的每个额外操作数，都再加 1。嵌套层数计算堆叠的 `if`、循环、`with`、`try`、`match` 块；`elif` 是独自位于父节点 `orelse` 中的 `If`，保留父节点深度。嵌套函数和类分别测量，不计入父级；lambda 计入外围函数。`ast.Match` 和 `TryStar` 通过 `getattr` 查找，因此旧版解释器仍能运行。

JS/TS 提取器从 TypeScript 语法树记录相同字段（`extract/ts/functions.mjs`）。
- **复杂度：** 每个 `if`（包括 `else if`）、条件表达式、`for`/`for…in`/`for…of`/`while`/`do`、`catch`、非 default 的 `case`，以及每个 `&&`、`||`、`??` 及其赋值形式，都加 1。可选链不计数。
- **嵌套：** 计算 `if`、循环、`switch`、`try`、`with` 块。`else if` 保留其 `if` 的深度，`catch` 保留其 `try` 的深度，因此相同逻辑在两种语言中得到相同数值；有一致性测试验证这一点。
- **记录：** 声明、方法、构造函数、访问器，以及绑定到名称的函数表达式或箭头表达式（变量、对象属性、类字段、赋值目标、`export default`），各自获得记录。名称限定为 `Class.method`、`object.method` 或 `outer.<locals>.inner`。
- **回调：** 匿名回调折叠进包含它的函数。模块作用域没有外围函数，因此记录为 `<callback of callee>`（例如 `<callback of runCheck(…).then>`）；如果调用的第一个参数是字面量，也会包含该参数（`<callback of server.on("request")>`），这样注册或删除其他处理器就不会使其改名。只有同一文件中调用和字面量都相同的回调，才按源码顺序获得 `#2`、`#3`。
- **跳过：** 没有函数体的函数（重载签名、抽象方法）以及声明文件。

在 archify 自身的 1,245 个源码函数中，默认规则总体标记出 12%。大多数目录为 5–9%，接近 Python 的比例；`bin/archify.mjs` 有十个超过 200 行的函数，比例达到 20%。

`complexity/function` 仅在存在 `facts.functions` 时运行（其 `enabled(config, facts)` 会检查事实），因此 JS/TS 运行会将复杂度报告为未检查，而不是无问题。复杂度达到 15 或嵌套达到 5 时报告 info，达到 25 或 6 时报告 warning，可在 `rules.complexity.function` 下按级别配置。对象为 `{ file, function, line, endLine }`；ID 仅对文件和限定名称计算哈希，因此在函数上方编辑不会改变 ID；`evidenceDigest` 只对函数自身的行计算哈希（`evidenceDigest.lines`），所以编辑同一文件的其他位置不会使证据失效。默认值曾在一个 180 文件的 Python 项目中检查，标记了约 6% 的函数。

概览在严重性和影响范围相同时，按规模对复杂度发现结果排序；先从最高严重性中为每条规则选出最佳发现结果，再填满其余优先项，因此某条拥有大量实例的规则不会占满全部三个位置。

<a id="entry-points"></a>
### 入口点

`coupling/internal-leak`（版本 1）与边界规则一样遍历 `facts.imports`，但按被导入模块分组：每个两端位于模块图中不同模块的已解析导入，要么落在目标模块的入口文件之一（计为 `viaEntry`），要么被引用为直接访问内部。如果设置了 `rules.coupling.internalLeak.entries` glob，则由它们确定入口文件（`entrySource: "config"`）；否则采用模块目录直属的 `index.*` 或 `__init__.py`（`"detected"`）；再否则没有入口（`"none"`）。存在被引用导入的模块产生一条 `subject: { module }` 发现结果，因此导入增减时 ID 保持稳定；`evidenceDigest` 对每个被引用导入的两端计算。严重性按发现结果确定：仅显式配置约定时为 warning；自动检测到入口时为 info；没有入口时，至少触达 `minFiles` 个内部文件才为 info。跳过 `vendor/` 或 `third_party/` 下的模块；Java 或没有原始事实时不启用该规则，并显示为未运行。

Atlas 将发现结果映射为 `kind: "edges"`，包含 `module` 与 `entries`（文件索引），并在浏览器中根据依赖列表单独计算每个模块的对外表面（被其他模块导入的文件及其导入模块），因此聚焦模块即使没有相关规则也能显示这部分信息。

<a id="architecture-boundaries"></a>
### 架构边界

`architecture/boundary` 检查读者在 `--config` 文件的 `boundaries` 下声明的层规则：`layers` 将名称映射到路径 glob；每条规则指定一个 `from` 层，并使用 `disallow`（禁止的层）或 `allow`（唯一允许的其他层）。它需要主动启用：规则可以导出 `enabled(config)`，引擎会跳过未启用规则，并将其排除在 `findings.rules` 外，因此概览会显示边界未检查，而不是报告边界无问题。

该规则遍历 `facts.imports`，而非模块边，因为模块边最多只保留五条证据导入。每个已解析导入的两端都归属到第一个 glob 匹配的层；任意一端不属于任何层、位于同一层内，或触及被排除角色（test、generated）的导入不会检查。纯类型导入也计入，并予以标记。同一 `from → to` 对的所有跨层导入形成一条发现结果（`subject: { boundary: { from, to } }`，严重性 warning，置信度 1），因此跨层导入增减时 ID 不变，而按每条被引用导入两端计算的 `evidenceDigest` 会变化。无效的 `boundaries` 块会以 `config/boundaries-invalid` 停止分析，而不是只检查少于声明范围的内容。架构图绝不会用作约束来源：图中没有连线，并不表示禁止该依赖。

概览的覆盖范围会列出每个已声明层及其匹配到的已分析文件数；某层没有匹配任何文件，通常意味着 glob 拼写有误。页面中的组件只有在其某个文件越过已配置边界时，才会获得“Architecture boundary”指示器；没有配置时，不会给出绿色的边界无问题声明。

---

<a id="9-overlayinject-layering-onto-archifys-html"></a>
## 9. overlay/inject：叠加到 Archify 的 HTML 上

<a id="what-it-does"></a>
### 做什么

`buildOverlay` 将已交付 HTML 作为字符串输入，为每个组件计算一条记录（模块、文件、边、指示器、发现结果），并在 `</body>` 前插入三块内容：装载数据的 `<script type="application/json">`、一个 `<style>`，以及包含页面逻辑的 `<script>`。原有标记不做任何编辑，结果写入新文件。页面所需内容全部嵌入其中——通过 file:// URL 打开也能离线工作。

<a id="the-atlas-view"></a>
### Atlas 视图

`overlay/atlas.mjs` 从同一次运行构建第二份载荷 `buildAtlas({ graph, facts, findings, review })`，以 `#bauify-atlas-data` 嵌入到 Classic 脚本之前（Classic 仅在存在该数据时提供 **Atlas** 按钮），其后再放置自身样式和脚本。它是投影，不是新的分析：模块图所属文件按模块分组、按路径排序；文件间每条已解析依赖各占一项；每个已测量函数表示为 `[file, name, line, complexity, nesting, length, finding]`；每条发现结果带有其选择的索引（`function`、`cycle` 路径和文件、`modules`、枢纽的 `module`、边界导入的 `edges`，以及访问模块内部导入的 `edges`、`module` 与 `entries`）。模块标签采用仍可保持唯一性的最短路径后缀。没有原始事实就没有 Atlas。

页面将其绘制在 `<canvas>` 上：文件排列成圆环，模块间留有间隙；依赖绘为三次曲线，控制点位于两个模块中间角度靠近圆心的位置（模块内部曲线保持靠近圆周）；函数绘为按复杂度缩放的径向尖刺，上限为 26。命中测试采用极坐标：半径选择环（弧、尖刺、刻度），角度选择模块、文件或函数。颜色来自页面主题变量，`data-theme` 变化时重绘。图像先绘制到离屏帧；可见画布将它与基于时间的动态效果（打开时环形揭示、选择时与上一帧交叉淡化、沿所选导入循环曲线移动的光点）和悬停标记合成，因此悬停不会重绘整张图。帧由 `requestAnimationFrame` 生成，在帧被节流时由计时器补充；`prefers-reduced-motion: reduce` 会关闭这三种效果。`<html>` 上的 `data-bauify-atlas-animating` 与 `data-bauify-atlas-flow` 暴露动态状态。选择发现结果会在 `<html>` 上设置 `data-bauify-atlas-finding`，聚焦模块会设置 `data-bauify-atlas-focus`，供浏览器测试读取；`window.__archifyShowFinding(id)`（来自 Classic 脚本）会在其中打开一条发现结果及其证据。

<a id="mapping-components-to-modules"></a>
### 将组件映射到模块

IR 中组件的 `sources` 指定文件；路径包含该文件的最深模块认领该组件，后代模块跟随父模块，除非另一个组件认领它们。`--map` 用显式 `{ componentId: [moduleId] }` 表替换该策略。没有组件认领的模块会被列出，不会丢弃。

按组件组织的 `findings` 会在涉及的每个组件上重复同一发现结果；如果发现结果的模块都没有组件认领，它就不会出现在任何组件上。因此载荷还包含顶层 `findings` 列表：每条发现结果恰好一次，附带 `moduleIds`（对象中命名的模块，或拥有其文件的模块）和 `componentIds`（显示该发现结果的组件，可以为空）。项目级视图从这个列表进行计数与排序，而不是从各组件汇总。

<a id="the-overview"></a>
### 概览

`overlay/overview.mjs` 将上述列表转换为载荷中的 `overview`，同时写入 `overview.json`。它不生成措辞或质量评分：`verdict` 为 `attention`（触发警告或错误）、`signals-only`（仅 info）或 `none-found`（实际运行的检查中未触发任何结果）。`groups` 按规则计数发现结果。不同层级中的同一结构会建立关联：较大文件循环中嵌套的文件循环，或跨越两个及以上模块且这些模块都位于同一模块级循环中的文件循环。`priorities` 最多选择三条发现结果，先按严重性，再按影响范围（模块数、fan-in 总和、文件数），最后按 ID 排序，并跳过与已选项有关联的发现结果。`coverage` 说明语言和适配器、已分析及因角色排除的文件数、配置的排除模式（从不枚举被排除路径，因此列出名称而不计数）、解析失败、指定 `--language` 时被遗漏的其他语言源码、未解析导入、已运行与被抑制的规则、未被组件认领的模块，以及在运行重复检测时，该检测所选文件中实际分析了多少、覆盖是否完整。

页面上，概览是左栏的默认内容：打开叠加层就显示它（替代旧提示，颜色图例也移入其中）。每个优先项以及“All findings”下的每条发现结果，都在详情面板中打开，显示图示、证据和关联结果；涉及的组件保持高亮，其余变暗（`data-bauify-focus`）。不属于任何组件的发现结果也以同样方式打开，使用由其模块构建的替代组件。点击组件会用该组件面板替换概览；面板中的“← Overview”链接与关闭按钮可返回概览。概览可折叠为判定行。宽度小于 1180 px 时，详情面板覆盖左栏；小于 860 px 时，源码面板覆盖两栏，而不会与它们重叠。与叠加层其余部分一样，措辞使用英文模板文本。

<a id="indicators-and-the-halo"></a>
### 指示器与光晕

每个组件的指示器在 Node 端根据涉及该组件的发现结果计算：循环指示器查看文件上的 `import-cycle` 与模块上的 `cycle` 发现结果，采用最严重层级；枢纽指示器查找模块上的 `hub` 发现结果；不稳定性则用其各模块 fan-out 总和除以 fan-in 与 fan-out 总和。组件颜色由最严重的指示器决定。页面中，`drawLayer` 在追加到 Archify SVG 的 SVG 分组内，为每个组件绘制一个圆角 `rect`；大小来自组件 `g[data-node-id]` 的 `getBBox()`，向边框外扩 10 px，并用 CSS 滤镜模糊，使其看起来是光晕而非第二层边框；红色会播放动画。

<a id="diagrams-and-source-excerpts"></a>
### 图示与源码摘录

第二个面板中的图示是在页面中构建的纯 SVG 字符串：循环环将最短循环的文件放在椭圆上，并在它们之间绘制裁剪后的箭头（闭合导入为延迟导入时用虚线）；枢纽星图将依赖它的模块放左侧、它依赖的模块放右侧；不稳定性用两条条形和 0–1 刻度上的一个标记表示。`collectSnippets` 嵌入每条发现结果所引用文件的全文，取自提取快照（`facts.files[].sourceText`），不会重新读取工作树，因此第三个面板显示的引用行位于实际被分析的同一份字节内容中。

<a id="where-it-bites-3"></a>
### 容易遇到的问题

- 浏览器脚本和样式是 `overlay/client/` 中的普通文件（`overlay.js`、`overlay.css`、`atlas.js`、`atlas.css`），由 `overlay/client-assets.mjs` 内联进页面。它们以前是 JavaScript 模板字面量，每个反斜杠都必须写两遍；现在按普通代码编写即可。每个脚本都是传统 IIFE：没有 `import`/`export`，并且绝不能出现文本 `</script`。
- Archify 查看器定义了面板使用的 CSS 变量（`--panel`、`--bg`、`--text` 等）。不存在的变量（`--panel-bg` 就曾是这样一个猜测）会静默回退为空，导致某个主题中的文本不可见。

---

<a id="10-binserve-deliver-first-analyze-on-click"></a>
## 10. bin/serve：先交付，点击后分析

<a id="what-it-does-1"></a>
### 做什么

`serve` 是模块唯一入口。它通过 Archify 自身的 CLI 对编写好的 IR 运行 `archify deliver architecture`（使用子进程，因此 Archify 的检查与回执和人手动执行时完全相同），读取交付的 HTML，追加一个小型 `<script>`，在工具栏中添加 **Code Analysis** 按钮，然后通过回环端口提供该页面。点击按钮之前，不会发生其他操作。

<a id="the-click"></a>
### 点击之后

按钮向 `/analyze` 发起 POST。请求必须来自服务提供的页面（检查 `Origin` 头），且携带为本进程生成的令牌；其他请求一律拒绝，因此另一标签页中的页面无法启动分析或选择路径。第一次接受请求时，服务器以子进程启动 `bin/analyze-run.mjs`。它通过 stdin 以 JSON 传入 `analyzeRepository` 选项，并读回一行 JSON：回执或结构化诊断。extract → graphs → evaluate → overlay 都在该进程中运行，因此大型仓库不会阻塞服务器事件循环。

每次运行写入 `<out>/analysis.next-<random>`。只有成功后才交换目录：当前 `<out>/analysis` 移至 `<out>/analysis.previous`，新目录变为 `<out>/analysis`。失败运行的目录会删除。当前 `findings.json` 作为 `previous` 传入，因此每次运行都携带与上一次的比较。响应是分析页面。并发点击共享同一次运行；之后的点击直接返回最新结果，不再重复运行。

<a id="re-analysis"></a>
### 重新分析

带有 `X-Analysis-Refresh: 1` 的请求会丢弃缓存结果并启动新运行（如果已有运行正在进行，则加入该运行）。客户端暴露 `window.__archifyReanalyze`；存在该方法时，概览会显示 **Re-analyze**。成功后页面携带 `?analysis=open` 重新加载，客户端点击其启动按钮，获取新的缓存结果。这会从头重新挂载叠加层，而非修补正在运行的层；随后移除查询字符串。失败时按钮重新启用，在其下显示错误，屏幕和磁盘上的最后一次成功结果保持不变。架构 IR 若已变化，仍像首次点击一样以 409 拒绝。

<a id="review-baseline-and-comparison"></a>
### 审阅：基线与比较

`lib/review.mjs` 将本次运行的发现结果与两类内容比较，两者都以稳定的发现结果 ID 为键：

- **基线**（`--baseline`、`schemas/baseline.schema.json`，ID 唯一）。每条发现结果为 `open`、`accepted` 或 `accepted-changed`。如果某条记录保存的 `sha256` 不再匹配发现结果的 `evidenceDigest`，则为 `accepted-changed`。对应发现结果已消失的条目为 `stale`。
- **上次运行**（`previous`）。发现结果为 `new`、`evidence-changed` 或 `unchanged`；上次存在、本次消失的结果为 `notDetected`（`fixed` 保留为已弃用别名，包含相同条目）。`comparability(previous.analysis, current.analysis)` 设置 `comparable`（`true`、`false`，或一侧没有 `analysis` 块时为 `null`）和 `reasons[]`，原因代码包括 `language-changed`、`analyzer-changed`、`adapter-changed`、`config-changed`、`rules-removed`、`rules-added`、`rules-changed`、`scope-changed`、`parse-errors`、`context-missing`。每个 `notDetected` 条目可以带有 `likelyCause`：`rule-not-run`、`parse-error`、`files-missing`（需要当前文件列表），或带有 `candidates` 的 `possibly-renamed`（同一规则针对同一组文件的新发现结果）。

`findings.json` 携带该 `analysis` 块（`evaluate/index.mjs`、`analysisContext`）：来自 `package.json` 的分析器名称与版本、`adapter` 与 `adapterRevision`（参见[提取器修订版](#extractor-revisions)）、`configDigest`（对移除 `schema_version` 后的规范化合并配置计算 sha256）、`ruleVersions`（已运行规则，不包含被抑制规则；规则逻辑变化时导出 `version`，默认为 1），以及 `coverage`（已分析文件数、被排除角色、存在解析错误的文件）。该块在模式中是可选的，因此旧发现结果仍然有效。

`review.json` 保存两种比较。叠加层将每条发现结果的状态复制到顶层发现结果列表。概览在列表中保留已接受结果，并计入 `counts.accepted`，但将其排除在严重性计数、判定和优先项之外。组件指示器与图环只根据未关闭的发现结果计算。上一次 `findings.json` 不可读时表示没有比较，不是失败；无效基线则以 `baseline/invalid` 停止运行。

<a id="extractor-revisions"></a>
### 提取器修订版

原始事实在 `repository` 中记录提取器的两个方面：`adapter`，即所用解析器或运行时（`typescript@<version>`、`python@<version>`、`java-parser@<version>`）；以及 `adapterRevision`，即适配器自身逻辑的修订版。每个适配器以 `REVISION` 导出它（`extract/ts/index.mjs`、`extract/py/index.mjs`、`extract/java/index.mjs`）。任意一项变化都会报告为 `adapter-changed`，因此因提取逻辑变化而出现或消失的依赖不会被误读为代码变更。未记录修订版的运行与记录了修订版的运行比较时，也会报告变化；这只会在升级后的第一次比较发生一次。

当同样源码可能产生不同原始事实时，应提高适配器的 `REVISION`：包括文件、角色、解析错误、导入及其解析、未解析计数、符号或函数度量。`extract/shared/` 的变更若改变某个适配器输出，就提高该适配器的修订版。输出完全相同的重构、消息或性能变更不需要提高。修订版按语言独立管理：修改 Java 解析器只提高 Java 的修订版，因此 TypeScript 和 Python 结果仍可比较。

`test/extractor-revisions.test.mjs` 将这件事变成明确决策，而不是依赖记忆：它为每种语言提取一个固定夹具（`ts-basic`、`py-basic`、`java-basic`），将输出摘要和适配器的 `REVISION` 一同与 `test/fixtures/extractor-revisions.json` 比较。输出变化时，测试失败并要求判断属于哪种情况。如果适配器逻辑变化，则提高 `REVISION`；如果只是夹具变化，则保持不变。无论哪种情况，都应在该文件中记录新的摘要和修订版。摘要不包含 `repository` 与已捕获源码文本，因为这些依赖检出内容，而不是提取逻辑。

`bin/check.mjs` 在没有图的情况下执行相同审阅。门禁统计达到或超过 `--fail-on` 的未关闭发现结果；`accepted-changed` 计为未关闭。使用 `--new-only` 时，只计入相对于比较对象新增的发现结果；没有可用比较时，每条未关闭结果都计为新增。退出码为 0（通过）、1（门禁失败）和 2（诊断）。`--update-baseline` 写入 `baselineFrom(findings)`：保留已有原因，新结果使用 `--reason`，已消失条目被移除。

<a id="handing-over-to-the-layer"></a>
### 交接给叠加层

页面不会导航到分析页面。它解析响应，将三个叠加块（`bauify-analysis`、`bauify-style`、`bauify-script`）复制到自身，移除自己的启动按钮——叠加层会在工具栏添加自己的 **Code Analysis** 开关——并点击该开关一次。因此读者看到的仍是同一页面，只是现在叠加层已打开；之后该开关用于显示或隐藏它。失败以结构化诊断（第 12 节）返回，在按钮旁显示，并提供重试选项。

<a id="where-it-bites-4"></a>
### 容易遇到的问题

- 客户端脚本通过 `client.toString()` 注入，因此必须是普通、独立且接近 ES5 风格的 JavaScript：不能导入、不能引用模块作用域、不能使用包含嵌套反引号的模板字面量。
- 通过 `textContent` 追加 `<script>` 元素会执行它；正是通过这种方式追加叠加层脚本，才使叠加层无需重新加载即可运行。
- Windows 上的 `execFile` 需要 `process.execPath` 加脚本路径，绝不能依赖 `PATH` 上的 `archify`。

<a id="11-determinism-why-byte-identical-matters-so-much"></a>
## 11. 确定性：为什么“字节完全相同”如此重要

“同一输入运行两次，得到字节完全相同的输出”是一项硬约束，因为它让两次分析的 `diff` 等同于代码结构的 `diff`。代码在各处都谨慎处理：

- 每个数组在输出前都按稳定键排序（文件按路径，边按 from / line / specifier）。
- 不包含时间戳或绝对路径（`repository.root` 相对于 Git 根目录）。
- **不使用 `localeCompare`。** 它根据操作系统语言设置排序；`ä` 与 `z` 在 `C` 区域设置和 `sv_SE` 下的顺序不同。改用字节顺序比较 `a < b ? -1 : a > b ? 1 : 0`。该问题由审阅者发现，随后得到修复。
- `JSON.stringify(value, null, 2)` 按插入顺序输出属性，因此对象按固定字段顺序构建。

有一项测试会运行流水线两次并逐字节比较。

---

<a id="12-failure-is-a-structured-diagnostic"></a>
## 12. 失败以结构化诊断表示

Bauify 从不向用户打印 Node 堆栈跟踪。每个失败都是固定形状的对象（`core/diagnostics.mjs`）：

```json
{ "code": "extract/adapter-ambiguous", "severity": "error",
  "message": "More than one language adapter matches; choose one explicitly.",
  "subject": { "root": "…" }, "evidence": { "detected": ["ts", "py"] },
  "supportedFixes": ["pass --language ts", "pass --language py"] }
```

实现方式：`fail(code, message, details)` 抛出自定义 `DiagnosticError`；`serve` 在点击处理外围捕获它，并以 `{ error, diagnostics: [...] }`（HTTP 500）回复页面，由按钮显示并提供重试。不是 `DiagnosticError` 的意外错误也走相同路径，代码为 `internal/unclassified`——它说明“未分类”，而不会编造修复方法。

这一形状与 Archify 的诊断契约相同，因此以后发现结果才能附加到 Archify 节点卡片。

---

<a id="13-tests-nodetest-fixtures-self-analysis"></a>
## 13. 测试：node:test、夹具与自分析

### node:test

Node 18 自带测试运行器，因此无需安装 jest。`node --test test/*.test.mjs` 运行所有文件；每个 `test('name', fn)` 使用 `node:assert/strict` 断言。`{ skip: 'reason' }` 表示跳过而非失败——依赖 Archify 的测试在不存在检出目录时就采用这种行为。

<a id="synthetic-fixtures"></a>
### 合成夹具

`test/fixtures/ts-basic/` 和 `py-basic/` 是手写的微型仓库；每个文件只有几行，覆盖一种情况（相对导入、命名空间包、语法错误、使用计算路径的动态导入等）。旁边的 `expected.json` 是**先手工推导，再通过运行程序确认**的。测试使用 `assert.deepEqual(actual, expected)`。它们的价值在于：当变更改变某条边时，能立即知道具体文件和行号。

<a id="regression-tests"></a>
### 回归测试

`test/extract-regressions.test.mjs` 中的每项测试都对应一次审阅发现的缺陷：区域设置排序、`..generated/` 误分类、glob 无限循环、局部 `require`。再次破坏其中任何一项，都能立即复现。

<a id="rule-tests"></a>
### 规则测试

`test/evaluate.test.mjs` 在内存中构建微型图和事实集，逐字段检查 `import-cycle` 的分层；其中的证明用例（在 `foo` 存在之前执行 `from b import foo`）对应一个确实会在 Python 中抛出 `ImportError` 的双文件布局。

<a id="self-analysis"></a>
### 自分析

分析 Archify 自身的 `archify/` 包时，会断言三层结构 `bin → renderers/* → renderers/shared`、`shared` 的 fan-out 为 0，以及 bin 到 renderers 之间没有静态边但 `opaque ≥ 1`。这既测试本模块，也同时检查周边代码结构的健康状况。

<a id="subprocess-tests"></a>
### 子进程测试

大多数测试直接调用库（`extractFacts`、`buildGraph`、`evaluateGraph`、`analyzeRepository`）。少数测试需要独立进程——例如不同区域设置、干净环境、结构化失败形状——会使用仅用于测试的工具 `test/run-extract.mjs`。点击流程通过在进程内启动 `serve` 并使用 `fetch` 驱动来测试：点击前页面没有分析，未授权请求被拒绝，第一次被接受的点击写入各阶段产物，第二次点击复用它们。

---

<a id="14-cross-platform-what-you-meet-on-windows"></a>
## 14. 跨平台：Windows 上会遇到什么

- **路径分隔符**：Windows 使用 `\`，POSIX 使用 `/`。写入 JSON 的每条路径都经过 `toPosix()` 转为 `/`；否则同一仓库在两台机器上会产生不同产物。
- **行结束符**：Windows Git 默认 `autocrlf=true`，检出时把 LF 转为 CRLF。`.gitattributes` 中的 `* text=auto eol=lf` 让仓库保持 LF；`lineCount` 接受 `/\r\n|\n|\r/`。
- **符号链接**：普通 Windows 用户不启用开发者模式就无法创建符号链接。Archify 的一批测试因此在 Windows 上失败；这与 Bauify 无关。
- **临时目录**：绝不硬编码 `/tmp`，应使用 `os.tmpdir()`。
- **解释器名称**：`python` / `python3` / `py -3`，参见第 4 节。
- **ESM 与 Windows 绝对路径**：`import('C:\\...')` 会抛出 `ERR_UNSUPPORTED_ESM_URL_SCHEME`；先用 `pathToFileURL()` 包装路径。这曾是上游一个真实的 Windows 缺陷。

---

<a id="15-glossary"></a>
## 15. 术语表

| 术语 | 一句话解释 |
|---|---|
| AST | 源码的树形表示；分析代码就是在其中寻找节点 |
| ESM / CJS | 两种 JS 模块系统；`import` 可静态分析，`require` 是函数调用 |
| JSON Schema | JSON 文档形状的规范；ajv 是校验器 |
| raw-facts | extract 的输出：文件、角色、导入边、符号和四种未解析计数器 |
| module graph（模块图） | 按目录将文件边折叠为模块级边，并带有 fan-in/out 和证据 |
| findings（发现结果） | evaluate 的输出：带类型、证据和修复方法的诊断 |
| IR | 中间表示；Archify 的 `architecture` JSON 就是其 IR |
| fan-in / fan-out / instability | 入边 / 出边 / 出边数 ÷（入边数 + 出边数） |
| SCC / Tarjan | 一组彼此均可达的节点 / 通过一次遍历找到它们的算法 |
| lazy import（延迟导入） | 函数体内的导入；在函数被调用时执行，而非加载时执行 |
| partially initialised module（部分初始化的模块） | 已在 `sys.modules` 中但尚未执行完毕的模块；循环导入错误的来源 |
| DAG | 有向无环图；分层布局的前提 |
| back edge（回边） | DFS 期间指向正在处理节点的边；表示循环 |
| topological order / Kahn（拓扑序 / Kahn） | DAG 的一种顺序，所有前驱都排在其后继之前 |
| non-planar graph（非平面图） | 无论怎样绘制都会交叉的图；大多数真实依赖图都如此 |
| PEP 420 | 没有 `__init__.py` 的目录仍可以是 Python 包 |
| opaque（不透明） | 参数不是字面量的动态导入；静态分析无法看到目标 |
| evidence mode（证据模式） | 携带提交 sha 和源码路径的 IR，供 Archify 用 git 验证 |
| structured diagnostic（结构化诊断） | 六字段失败对象：code / severity / message / subject / evidence / supportedFixes |
| overlay（叠加层） | 注入 Archify 已交付 HTML 副本中的 Bauify 分析层 |

---

<a id="16-further-reading"></a>
## 16. 延伸阅读

- TypeScript Compiler API：官方 wiki 页面“Using the Compiler API”；用 `ts.createSourceFile` 打印一棵小树，比只读文档更容易学会。
- Python `ast`：`ast` 模块文档；`ast.dump(ast.parse("from . import x"), indent=2)` 用一行代码展示结构。关于循环导入，语言参考中的导入系统章节解释了 `sys.modules` 和部分初始化。
- JSON Schema：json-schema.org 上的“Understanding JSON Schema”，尤其是 `if/then/else` 与 `additionalProperties`。
- 图算法：任意算法教材中的 DFS、拓扑排序和强连通分量（Tarjan）章节；`coupling/cycle` 与 `coupling/import-cycle` 使用的就是 Tarjan。
- 依赖指标：Robert C. Martin，《Agile Software Development: Principles, Patterns, and Practices》第 20 章“Principles of Package Design”。
- Archify 的契约：`archify/references/authoring-contract.md` 与 `delivery-contract.md`；它们解释 `deliver` 检查什么，以及其回执保证什么。

<a id="ai-tasks-and-evidence-checks"></a>
### AI 任务与证据检查

`lib/task.mjs` 从同一次运行的 `findings.json` 和 `raw-facts.json` 构建任务（`schemas/ai-task.schema.json`）；混用不同运行会被拒绝（`task/snapshot-mismatch`）。`locationsOf` 将每条发现结果转换为行范围：复杂度结果对应函数行（`focusLine` 位于最深块），导入循环对应路径上的导入，边界或模块循环对应其证据导入（每行一个位置，列出所有目标），枢纽则对应文件而不指定行。每个范围对以 `\n` 连接的精确行计算 `sha256`；摘录长度有界（`EXCERPT`：最多 60 行的函数完整保留，否则保留开头、焦点前后 10 行和末尾，并用 `omitted` 范围及 `complete: false` 标明省略）。`scope.modify` 是有引用行的文件，`scope.read` 是计算发现结果时使用的其他文件。事实来自发现消息，建议来自规则的 `supportedFixes`，保留要求与验收条件来自逐规则模板；验证命令仅在提供时出现。`taskId` 对排序后的发现结果 ID 及其证据摘要计算哈希。`renderTaskMarkdown` 渲染同一对象；源码放在比其内部任何连续反引号都更长的围栏中。`buildTaskPayloads` 为无服务器页面返回 `{ [findingId]: { task, markdown } }`。

`lib/evidence.mjs` 的 `verifyTask(task, root)` 只读取 `root` 内被引用的文件（不允许绝对路径、`..` 或符号链接逃逸）。如果某位置的哈希在相同行或文件内另一位置（`currentStartLine`）匹配，则为 `valid`；否则为 `changed`；文件已消失时为 `missing`；没有捕获哈希时为 `unverifiable`。对每条发现结果，按 `evaluate` 的方式重新计算证据摘要（函数范围采用当前位置）；某个位置有效但摘要变化时，发现结果仍为 `changed`。任务汇总采用最严重状态：`missing > changed > unverifiable > valid`。带或不带 UTF-8 BOM 都可接受，因为 Python 解码器会去掉它。

<a id="python-call-capture"></a>
### Python 调用捕获

Python 适配器修订版 13 输出仅需 Node 的 `python-source-v3` 声明模型。参见 [Python 支持](PYTHON.md)。历史修订版 7 增加了 `python-lexical-v1`、包含在源码内的 Call 记录，以及可选的精确 `functions[].sourceRange` 证明。AST 的 UTF-8 字节偏移会对照解码后的源码转换为 UTF-16 列位置。范围不包含前置装饰器；哈希保留内部真实行结束符。不含该模型的旧捕获保持不可用，而不会被视为已知零。绑定限制与新鲜度参见[架构契约](../ARCHITECTURE.md#python-call-facts)；新鲜的成对变更流程仍仅支持 JS/TS。

<a id="java-captured-superclass-qualifier-evidence"></a>
### Java 已捕获超类限定符证据

Java 调用模型 v4 允许从继承普通顶层类封闭捕获链的调用方，获取显式类限定的静态源码候选。它复用类型与成员继承图，在同一次遍历中收集继承的实例字段和静态字段名称。不完整、外部、循环或有歧义的祖先关系不能证明不存在值；仅含类型的 JDK 允许列表不提供字段清单。成员类型遮蔽保留现有类型命名空间守卫。未限定的继承调用、接口或虚分派、继承的目标所属者，以及参数适用性仍未得到证明。

每个新的继承上下文目标都会记录 qualifierAncestry 源码点。导航保存的问题时要求这些文件仍然新鲜；即使调用方和目标文本没有变化，修改父类也可能改变限定符绑定。历史 Java v1–v3 捕获仍可按其原始范围读取，不会按 v4 重新绑定。

新的继承上下文候选与祖先证据也必须保持在同一个已捕获 Maven/Gradle 标记根目录内。兄弟模块可能包含一个与外部依赖具有相同 FQCN 的兼容类；没有类路径证据时，它不能成为目标。跨根目录的继承上下文调用报告 `java-inherited-build-scope`，其中也包括那些合法、已知但仍被遗漏的调用。这不实现 Maven/Gradle 依赖解析，也不改变旧版非继承的源码全局契约。
