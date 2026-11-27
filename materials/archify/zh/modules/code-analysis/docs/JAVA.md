<a id="java-source-analysis"></a>

# Java 源码分析

在 `archify/` 包目录执行：

```sh
node bin/archify.mjs code-analysis check /path/to/java-repo --language java --out out/java
```

图工作流接受相同的 `--language java`。扫描同时发现 Java 和另一受支持语言时，若根目录包含 `pom.xml`、`build.gradle(.kts)` 或 `settings.gradle(.kts)`，Java 可参与[自动选择](USAGE.md#first-look-at-an-unfamiliar-repository)。构建标记仅在子目录，例如 `backend/pom.xml` 与 `frontend/package.json` 并列时，使用 `--language java` 分析 Java 文件。运行会报告遗漏的其他语言文件。默认排除 `build/` 目录及 `target/` 下 Java 源码；`target/` 下 JS/TS 和 Python 仍照常分析。`src/test/` 文件以测试角色提取，并按既有角色策略排除在依赖图之外。

升级说明：同时包含 `.java` 的 JS/TS 或 Python 树（如 React Native 的 `android/` 文件夹），若根目录没有 Maven/Gradle 构建文件，省略 `--language` 时仍按原语言分析；覆盖现在会列出遗漏的 Java 文件。默认配置变化，因此升级后的首次比较报告 `config-changed`，不能直接比较。

适配器读取捕获的 UTF-8 源码，接受 UTF-8 BOM，并保留解码文本及源码位置。损坏或不支持的文件留在 `files` 和 `parse_errors` 中，不贡献依赖或函数指标。适配器不运行 Java 代码、Maven/Gradle 构建、注解处理器或 LLM，也不需要 JDK。

<a id="optional-jdk-method-binding"></a>

## 可选 JDK 方法绑定

要为方法位于捕获源码中的调用增加由编译器选择的目标，传入以下配置文件：

```json
{ "java": { "semantic": true, "release": 8 } }
```

`java.semantic` 默认关闭。开启后，Archify 使用本地 JDK 17+ 的 `java` 可执行文件（可由 `ARCHIFY_JAVA` 指定），分析已捕获 Java 源码的临时副本。`java.release` 可选；省略时使用运行 JDK 的默认源码级别。不支持的 release 或编译器错误，会使受影响源码组保留 JS 结果。`languageScope.semantic` 记录所选 release、JDK 版本、分析文件数、增加／拒绝目标和失败组。没有 JDK 或编译器失败时，提取仍可用；不下载或读取外部 jar，不运行注解处理器，也不执行项目代码。

每个编译器组只包含有限 Maven 源码集和已声明直接依赖模型允许的捕获源码。记录目标前，Archify 通过完整源码范围将编译器调用匹配到 JS 调用，对照精确捕获声明范围检查目标，再次检查 Maven 可见性。编译器可能识别没有函数体的接口或抽象方法声明；这些目标放在 `methodDeclarations`，与测量复杂度的 `functions` 分开。它们标识静态选中的声明，不是运行时实现。启用捕获使用 `java-static-lexical-v6`（适配器 revision 14）；关闭捕获保留 v5 绑定模型。v6 拒绝跨越捕获 Maven 边界但没有直接路由的既有普通静态候选，即使编译器不可用也如此。外部 jar、完整 effective POM、Gradle 配置、生成代码及完整 classpath 仍不在该模式内，所以失败源码组保留保守 JS 覆盖。

<a id="dependencies"></a>

## 依赖

规范类型名到文件的映射依据声明，不依据目录布局。只有源码索引识别到单文件中的唯一无歧义声明，才记录依赖。同文件内依赖不产生文件边。

记录的引用形式：

- import 声明：单类型导入，以及所属类型声明了成员的静态导入。静态成员包括静态字段与方法、enum 常量、interface 常量，以及显式或隐式静态的成员类型（成员 enum、record、interface，以及 interface 的所有成员类型）。
- 类型位置：字段、参数、局部、返回及类型实参类型，`extends`／`implements`／`permits`、`throws`、`catch`、强转、`instanceof`、数组类型及注解。
- 实例创建 `new T(…)`（含匿名类的类型）、构造函数引用 `T::new` 和 `T[]::new`，以及类字面量 `T.class`。

解析遵循词法类型作用域、文件内声明、单类型导入及同包类型。完全限定名使用源码索引；限定名绝不会从当前包的子包开始；若首段命名了按需导入声明的类型，则保持未解析（不检查按需导入类型的继承成员；独立解析的超类仍可提供成员类型）。下列守卫使不确定绑定保持未解析。

以下情况有意保持未解析：

- 重复声明（例如 main 与 test 源码集），以及外层类型被声明多次的成员类型；所有查找路径均如此，包括静态导入。
- 同一个捕获 Maven 或 Gradle 构建模块内，main 源码不能绑定仅位于 `src/test/java` 的声明；test 源码仍可访问 main。即使其中一份属于测试源码集，重复声明仍有歧义。这是源码集边界，不是完整 classpath 模型。
- 冲突导入、类型参数遮蔽、文件任意位置局部类型造成的名称遮蔽，以及单条静态导入引入的简单名（导入本身仍记录）。任何块中声明的类型（方法、接口方法、构造函数、初始化器、lambda、switch-rule 块）均属局部，不进入索引。
- 类型体内引用：若其超类型无法传递地各自解析为一个被分析声明或列出的 JDK 类型（如外部、重复或循环超类型），继承成员类型可能绑定该名称，因此保持未解析。这也包括不需要 import 的同包引用：Spring PetClinic 中，`PetValidator implements Validator`（Spring 接口），所以不会记录它对同包 `Pet` 的使用。这里缺边不证明没有耦合。

  分析祖先完整时，一个祖先中唯一 public 或 protected 成员类型会解析到声明文件，即使有同名外部导入。类还可在 `implements` 子句中使用显式超类的此类成员。private、仅包可见、重复、限定或其他不确定的继承成员名保持 `unknown`；一个被分析祖先声明了成员类型，但另一个祖先是外部类型时也如此。enum 体中的 `EnumDesc`（`java.lang.Enum` 的成员类型）保持未解析。类型自身成员在其 extends/implements 子句不在作用域内，因此声明头不受该类型体守卫约束；record 的组件列表则能看到自身成员。其他作用域守卫仍生效。

  列出的 JDK 类型为 `java.lang` 中的 `Comparable`、`Cloneable`、`AutoCloseable`、`Iterable`、`Runnable`、`Throwable`、`Exception`、`RuntimeException`、`Error`、`IllegalArgumentException`、`IllegalStateException`、`UnsupportedOperationException`；`java.io` 中的 `Serializable`、`Closeable`、`IOException`；`java.util` 中的 `Iterator`、`Collection`、`List`、`Set`、`Map`、`EventListener`；以及 `java.util.concurrent.Callable`。其中只有 `Map` 提供成员类型 `Entry`，它在这些类型体中保持未解析。成员类型已通过 JDK 17 反射核查（public、protected 及继承成员类型）；未检查其他 JDK 版本。

  只有单类型导入显式命名超类型（`import java.io.Serializable;`），才将其视为上述类型之一，因为该导入优先于同包及按需导入类型，未分析源码不能占用名称；同时要求没有外层类型声明、继承或可能继承该名称成员类型，文件中也没有同名类型参数或局部类型。其他形式都保留守卫：隐式 `java.lang` 名称（`extends RuntimeException`）或按需导入，因为未分析的同包源码（如被排除的生成文件或解析错误文件）可能声明该名称；完全限定名（`implements java.io.Serializable`）也如此，因为未见的 `java` 类型可能遮蔽包。
- 局部及匿名类体内引用，其成员和继承作用域未建模。方法仍接收复杂度指标。
- 按需 `*` 导入，不会展开成包内全部文件；需要通配或 classpath 查找的名称也保持未解析。
- 限定创建 `outer.new Inner()`（相对于外部实例类型）、其他方法引用 `X::m`，以及 `X.m()`、`X.F` 等静态调用或字段访问，其限定符可能是表达式。
- `Class.forName("…")`、`ServiceLoader` 等反射加载未建模，因此不计为 `opaque`。

这是保守源码依赖图，不是完整 Java 类型或方法调用解析。

未解析计数器保持[技术指南](TECH-GUIDE.md#5-the-four-kinds-of-unresolved-why-they-are-counted-separately)中的共通含义：`external` 在被分析源码之外，`unknown` 是内部解析缺口。每个 import 声明都记录；没有被分析文件声明其包（JDK、第三方）时，未解析导入记为 `external`，否则为 `unknown`（例如项目包中构建生成的类型）。类型引用只有可能表示被分析类型时才记录：匹配被分析类型名，或位于被分析包。类型参数、局部类型名、绑定外部导入的名称（由该 import 表示），以及没有被分析文件声明的名称（`String`、`Override`）不产生记录，如同 JS/TS 适配器中使用外部模块不产生记录。已记录但未解析的引用计为 `unknown`；对 Java 而言主要衡量上述保守规则。`imports[].kind = "static"` 在共通约定中表示静态记录的依赖，不专指 Java `import static` 关键字。边权统计依赖记录，包括记录的 import 和类型引用，不只统计 import 声明。

模块（包）环是作为 error 报告的结构发现；类（文件）环为 warning，因为类按需加载，互相引用很常见（见[严重级别](USAGE.md#severity-levels)）。消息、任务导出及 UI 不推断 Python 式部分初始化，也不声称 Java 运行时失败。

Java 没有包标记文件，因此默认模块是构建单元：每个含 `pom.xml`、`build.gradle` 或 `build.gradle.kts` 的目录拥有其下任意深度源码（`grouping.java: "build-modules"`）；不属于任何构建模块的文件仍按目录深度分组。若至多一个构建模块拥有被分析的非测试、非生成源码，整树会只有一个模块、无从比较，因此改按包拆分（`grouping.java: "packages"`）：对每个常规源码根 `src/<set>/java`，在该根文件共有目录之下的首层目录拆分，通常是 `src/main/java/<common prefix>` 之下的第一个包层。直接位于源码根的文件，如 `module-info.java`，构成该根自己的模块。其他文件仍按目录深度；没有这种源码根的树在全部文件共有目录之下拆分。

显式 `modules.groups` 仍优先，其已认领文件不参与决定拆分。设置 `modules.depth` 或 `modules.packageBoundaries: false` 恢复按目录深度分组。不读取 JPMS 模块。

分组由构建文件位置及源码目录推断，不评估 Maven/Gradle 模型。Java v5 另行读取有限 Maven 声明，用于下文静态调用候选。增加第二个构建模块、移动源码或改变共有目录前缀，即使依赖不变，也可能改变模块及模块边、模块环和枢纽。只在分组相同时比较跨次模块级 finding；长期比较可用 `modules.groups` 固定模块，例如 `{ "modules": { "groups": { "core": ["core/src/main/java/**"], "web": ["web/src/main/java/**"] } } }`。分组变化后消失的模块环不能算修复。

<a id="complexity"></a>

## 复杂度

方法、带体接口方法、构造函数及 record 紧凑构造函数输出既有 `functions` 约定。没有体的 abstract/native 方法跳过。限定名遵循共通 `Class.method` 和 `outer.<locals>.inner` 形式，并添加参数类型，如 `Service.save(String,int...)`：Java 每个重载都有体；若按源码顺序加 `#2` 后缀，在前方增加重载就会重命名后续重载。局部和匿名类方法（含 enum 常量体）单独测量。lambda 计入包含它的方法。不属于任何方法的代码独立测量，如同 JS/TS 中模块级回调：静态及实例初始化块记为 `Class.<static initializer>`、`Class.<instance initializer>`（后续同类块加 `#2`）；初始化器含 lambda 的字段按字段名记录，如 `Registry.COMPARATOR`。其他字段初始化器不测量。

复杂度从 1 开始，每个 `if`、循环、`catch`、条件表达式、非 default switch 标签、pattern guard、`&&`、`||` 各加 1。一个标签含多个 case 常量仍只计一次。嵌套统计 if/loop/switch/try/synchronized 块；`else if` 与前一个 if 同深度，catch/finally 与所属 try 同深度。注释和字符串不增加分支。复用已有阈值及源码证据视图。

<a id="method-invocation-source-navigation"></a>

## 方法调用源码导航

默认捕获使用 `java-static-lexical-v5`（适配器 revision 14）。下文历史 v1 限制描述最初收集约定。后续 revision 增加显式类限定 public static 方法（v2）、不同参数数量同名方法中唯一固定参数数量候选（v3），以及调用者具有封闭且已捕获的普通类祖先链时的限定符查找（v4）。捕获祖先不能包含会阻塞限定符的继承字段或成员类型；这不是通用继承或重载／类型推断。参数数量可排除继承签名时，唯一局部静态方法可以重载继承的 `Object` 方法名。若数量也匹配某个 `Object` 方法，词法目标仍未知。

Java v5 还在捕获 POM 建立唯一**直接**项目依赖时，允许这些继承上下文静态调用跨越 Maven 项目根。它读取字面项目坐标、本地 parent（包括指定名称的 parent XML 文件）、继承默认属性和 dependency management，以及共用字面 reactor 声明。main 源码要求 compile/provided jar 路由；test 还可使用 test/runtime scope。`src/test/java` 中目标要求 test-jar 依赖；普通 jar 不暴露测试夹具。目标以及用于证明限定符不存在的任何捕获祖先都需要有效路由。仅仅同属 reactor 不授予依赖。

`languageScope` 记录实际使用的精确 UTF-8 POM 文本及 SHA-256、有效项目坐标／直接依赖、profile 标识、不支持模型和限制。`calls[].buildEvidence` 包含可跳转 POM 声明点。已保存及配对调查在允许调用导航前检查这些输入是否变化。POM 是元数据，不是被分析 Java 源码。扫描器捕获配置的 XML/POM，使指定本地 parent 可从同一快照读取；只输出实际使用元数据。`src/main/resources/archetype-resources/` 下 Maven archetype 模板标记本身不声明项目，也不成为解析输入。显式指定的本地 parent 仍可读取。其中 Java 文件遵循配置 include/exclude。

相关 dependency/module profile、未解析 parent/property、重复坐标、导入 BOM、自定义 main/test 布局和 Gradle 依赖，不能授予这些新路由。不执行 Maven、Gradle、插件、注解处理器或项目代码，不要求安装 JDK 或 Maven。同一捕获构建模块内，main 不能用 test 源码祖先或直接静态目标导航。属性展开后的子 dependency 与 dependency-management 声明，在授予项目路由证据前覆盖匹配 parent 条目。

XML 阅读器固定 `@xmldom/xmldom@0.9.12`。除上述 main/test 源码集边界外，既有同根和无 parent 源码候选保留原约定；依赖证据不会把全局源码类型索引变成完整 classpath，也不会消除多份声明的歧义。外部制品、传递依赖、CLI/settings 激活、生成代码、运行时加载及完整影响仍未知。

最初 v1 捕获声明 `callModel: "java-static-lexical-v1"`。它们盘点所有已解析方法调用表达式，保留完整原始源码 UTF-16 起点及排他终点，包括链式调用和 lambda／嵌套类型体。不含构造函数、方法引用及隐式调用。只有当前、语法有效、选中范围带此标记时，零值才是已知零；旧 Java 空数组仍不可用。

`same-file-static-method` 仅为以下情况提供词法源码候选：裸标识符调用位于被测量普通方法中，方法直接属于没有 `extends` 或 `implements` 的顶层普通类。类中必须恰有一个该名称的方法声明，显式为 `static`，带捕获体且固定参数数量匹配。重载、varargs、显式调用类型实参、继承的 Object 方法名、嵌套／局部／匿名拥有者，以及限定／成员调用仍未解析。lambda 内调用保留外层方法上下文。Java 函数测量包含精确 UTF-16 `column`／`endColumn`，使同一行相邻方法可区分。

这是源码阅读辅助，不是 Java 编译器归属分析：参数类型适用性、编译、虚分派、反射、provider 选择及执行未建模。其他所有调用点保留明确未知。已保存问题任务暴露这些边界，并以捕获源码新鲜度控制目标导航，见[函数分析](FUNCTION-ANALYSIS.md)。

<a id="parser-choice-and-boundaries"></a>

## 解析器选择与边界

实现固定 `java-parser@3.0.1`，它是同步 JavaScript 解析器，生成带 token offset 和行列位置的 CST。

语法探针覆盖 Java 8 风格泛型／lambda、record 及紧凑构造函数、sealed 类型、文本块、模块描述符和 Java 21 switch pattern/guard。这些探针不证明完整覆盖每个 Java release 或 preview feature。不支持语法报告为解析错误。

已修正一个已知误解析：`java-parser@3.0.1` 会把体同时也是合法块的成员 record，例如 `record Value(int x) {}` 或 `record Value(int x) { static class Part {} }`，读成返回类型为 `record` 的方法。这种方法无法编译，因此适配器把节点改写为 record 声明，并把嵌套类型恢复为成员类型。

Java Unicode 转义在词法分析前展开，包括注释内转义。解析出的注释、字符串／字符字面量及文本块中，若解码字符保持 token 边界，适配器接受转义，同时保留原文及源码 offset。成对原始反斜杠使后续 `u` 不具转义标记资格。转义引号、注释定界符、反斜杠及换行仍产生诊断；畸形转义以及 token 范围外转义也如此。其他源码编码、构建感知符号解析、生成／Lombok 符号、Spring 注入、继承／调用图及类初始化分析，均在本适配器范围之外。

小型人工计数夹具保护依赖及复杂度正确性。真实仓库检查应固定源码 revision，从子模块开始再扩大到整树。除时间与内存外，一并报告解析失败及未解析覆盖；完成本身不证明完整依赖覆盖。
