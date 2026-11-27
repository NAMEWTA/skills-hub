<a id="rust-source-investigation"></a>

# Rust 源码调查

通过常规 CLI 选择实验性 Rust 适配器：

```sh
node archify/bin/archify.mjs code-analysis check /path/to/workspace --language rust --fail-on never --out /tmp/rust-analysis --json
node archify/bin/archify.mjs code-analysis task /tmp/rust-analysis --root /path/to/workspace --entry src/lib.rs --function caller --question 'Where is this function defined?' --format json --out /tmp/rust-question.json --json
node archify/bin/archify.mjs code-analysis task --root /path/to/after --base-root /path/to/before --entry src/lib.rs --question 'Which captured direct references reach changed definitions?' --format json --out /tmp/rust-change.json --json
```

这是源码导览。精确函数范围、不可变捕获文本及哈希、定义跳转和捕获直接引用复用共用调查输出，不证明编译、运行时可达性或完整变更影响。已保存问题要求匹配的 Rust facts；配对问题重新捕获两个版本。配置／元数据差异可能使配对结果成为部分覆盖（退出码 1），即使单个已知引用能正确导航。

<a id="tooling-and-cost"></a>

## 工具与成本

需要 Cargo/rustc 1.71+；1.77.1 和 1.89.0 已在本地验证。ARCHIFY_CARGO、ARCHIFY_RUSTC 选择已安装可执行文件。缺工具返回结构化 extract/rust-unavailable、安装指引及退出码 2。ZIP 内置源码和锁定辅助程序，不含平台二进制。首次使用编译 Archify 辅助程序，并可能下载锁定的 MIT/Apache 解析依赖（syn 2.0.119、proc-macro2 1.0.107、quote 1.0.47、serde_json 1.0.154）。不需要 rust-analyzer。只有这些依赖已缓存时才设 rust.offline=true。工具链安装独立处理；缺工具时不自动安装。

项目清单及空源码盘点桩捕获到临时目录，用于 cargo metadata --offline --locked --no-deps。不执行项目源码、.cargo 配置、rust-toolchain 文件、构建脚本或宏。syn 辅助程序解析捕获源码字节，并在安装目录外使用临时编译缓存。不下载或检查项目依赖源码。捕获根外的绝对／path 依赖属于未知；需要这些依赖的清单配置可能以 extract/rust-metadata-failed 失败，不捏造 workspace。

<a id="scope-and-settings"></a>

## 范围与设置

```json
{"rust":{"tests":false,"defaultFeatures":true,"features":{"my-package":["chosen-feature"]},"cfg":["custom_known_flag"],"target":"aarch64-apple-darwin","offline":true}}
```

通过 --config 传入 JSON。默认分析本地 workspace lib/bin target、包默认 feature，以及本地 path 依赖的 feature 转发。这是已声明源码配置，不是 Cargo 完整解析／构建图或目标特定依赖激活。除非 tests=true，否则排除测试 target 和 cfg(test)；examples、benches、proc-macro crate 及构建脚本始终排除。不指定 target 时使用宿主；target cfg 由 rustc 查询，不构建项目。未知 custom/build-script cfg 和不透明属性保留不确定性，不替它们选择分支。

coverage.languageScope 与 raw-facts languageScope 报告实际选中文件／crate、排除文件／target／区域、缺失模块、解析失败、条件定义、不透明宏、工具版本、cfg 和捕获 Cargo 元数据。成功的 --fail-on never 检查无论 finding 门禁如何都退出 0；应独立检查 coverage 和 parse_errors。解析失败始终可见，不能算完整覆盖。

<a id="targets-and-boundaries"></a>

## 目标与边界

crate 内 crate/self/super 路径、显式路径、模块 use/use-as、分组导入、无歧义 glob，以及本地 workspace 库路径可识别自由函数。实际 Cargo 库名及重命名依赖定义边界。模块查找遵循 edition、模块文件／path 属性、词法遮蔽及条件导入。不支持或歧义路径保持未解析。跨 crate 源码绑定不证明可见性或类型正确性。

最初 v1 模型把方法、trait 分派、函数值、关联函数、作为目标的局部 item 函数、生成／展开宏、外部 crate 和完整类型推断保留为未知。后续有限 inherent-function revision 见下文。v5 额外记录本地 trait 声明及 impl 边，但仅 trait 调用目标仍为声明锚点，不是运行时分派。v6 额外按每份源码声明盘点一次 trait 默认方法体。v7 用捕获 inherent 返回类型及 AsRef/Borrow/Deref 实现目标，替代没有证据的单参数包装访问器假设，并按声明位置替换泛型 struct 字段。v8 从捕获本地声明解析访问器 trait（含别名及有默认值的泛型参数），读取 impl where-clause 约束，为字段接收者应用默认类型参数，跟随标准 Box/Arc/Rc 访问器载荷，并绑定 tuple-variant match 载荷。v9 在满足下列条件时遍历本地 `macro_rules!` 调用的实参表达式：宏在选中 crate 中恰定义一次，在调用点按文本可见且没有可能绑定同名的 import/glob，每条规则都匹配单个 `$x:expr`，每个展开都只在 repetition 与嵌套宏实参外使用 `$x` 一次；所得调用记录带 `macroEvidence`。v10 解析调用点实际可见的宏绑定，含先出现、遮蔽模块绑定的块局部定义，以及离开该块后恢复的外层绑定；并要求每条活动展开路径在所选 cfg 下保留实参使用；被 cfg 删除、嵌套在另一宏中，或活动配置下无法证明的使用仍未知。v11 在 trait 默认体中被调方法确实由外层 trait 声明时，把 `self` 绑定到该 trait 声明；并展开作为整个 impl 体的一个零参数本地宏，以 impl self 类型及泛型盘点生成转发方法；`*self`／`**self` 调用保留捕获 trait 约束，生成调用者标为 `macro-generated-method`，具体运行时实现仍未确定。语法函数／方法体及默认体组成调用盘点；其他宏均有不透明记录。类型／字段定义尚不是可导航实体。结构环表示源码耦合，不暗示运行时导入顺序或部分初始化。

固定真实项目回放及源码／ZIP 证据见 benchmarks/code-analysis-go-rust/RUST.md。这些有限案例不是整仓准确性测量。

<a id="current-call-model-and-trait-impl-candidates"></a>

## 当前调用模型与 trait 实现候选

当前捕获使用 rust-source-direct-v15 / adapter15。历史 v1 收集自由函数；v2 额外接受唯一单态 inherent 函数路径；v3 额外接受通向唯一具体类型特化的裸泛型 struct 路径。历史事实保留原范围，不重新绑定。

v4 在泛型参数只有无约束生命周期的 struct/enum 上增加无接收者 inherent 源码候选。impl 参数必须无约束、没有 where clause，并与拥有者具名生命周期实参一一对应。裸名义类型／模块／导入别名路径复用已有 crate 身份及源码位置。重复／条件／不支持的同级声明阻止选择；variant 名仍阻止选择同名 inherent 函数。新调用使用 rust-lifetime-inherent-source-candidate。

v5 记录捕获本地 trait 声明、方法及 impl-method 边。显式 `<Type as Trait>::method(...)` 路径解析为该名义类型及 trait 的唯一捕获 impl（`rust-trait-impl`）。方法调用的接收者若是参数、局部 `let`、字面 struct 路径或构造路径，且捕获名义类型无歧义，可解析到唯一 impl；同名 inherent 声明会阻止选择。经声明的 `T: Trait` 约束、`dyn Trait`、`Trait::method` 或泛型路径的调用，只指向 trait 方法声明（`rust-trait-method-candidate`）；证明 trait 使用，不证明运行时实现。变更问题将它们单独列为 `traitCandidates`，带 `runtimeTarget: not-determined`，与直接引用分开。选定定义为 trait 方法默认体时，声明文件内的 trait 分派调用点列在直接引用中：体在 `fn` 关键字注册，调用指向方法名，因此对同一声明检查两个源码锚点。模块路径在 crate 内有效，因此另一个 workspace member 的同名 trait 被排除，不按 qualname 合并。

v11 把 trait 默认体中的裸 `self` 方法调用绑定到外层 trait 声明的方法（`rust-trait-method-candidate`）。trait 未声明的方法仍未解析；具体类型覆盖该方法时，对该类型的调用仍解析到覆盖实现，不指向默认体。它还在调用构成整个 impl 体时展开一个零参数本地 `macro_rules!`。生成方法继承 impl self 类型、泛型约束及 where clause，`*self`／`**self` 调用保留接收者捕获 trait 约束，包括 `&mut T` 和 `Box<T>`。这些调用是锚定 trait 声明的候选，直接调用者报告为 `macro-generated-method`，一个物理源码位置代表所有调用。非空 matcher、导入或歧义定义、与其他 impl item 混合的调用，以及非 `self` 泛型接收者的解引用仍未知。

v12 将宏调用属性传播到生成方法状态，与外层 impl、生成方法及体 cfg 合并，含嵌套 `cfg_attr`。移除的方法／调用被省略；未知条件不能建立目标或访问器返回类型；未知访问器保留为歧义阻塞项，不从候选集合消失。未知的生成 trait 实现也会阻止方法和限定调用的唯一性。每个物理模板调用仍只盘点一次，并跨贡献展开保留 `macroTemplate` 来源：

```json
{
  "definition": {"file": "src/lib.rs", "name": "forward", "line": 3, "column": 14},
  "expansions": [
    {"file": "src/lib.rs", "line": 12, "column": 5, "implLine": 11, "implColumn": 1, "selfType": "& T", "trait": "Gate"}
  ]
}
```

`definition` 指向宏名称。每个展开的 `file`／`line`／`column` 指向调用路径；`implLine`／`implColumn` 指向该文件外层 `impl` token。坐标是从 1 起算的 UTF-16 源码点。`selfType` 是可打印原始 impl self 类型，含引用和泛型实参；可选 `trait` 是可打印 trait 路径（inherent impl 不含）。至少存在一个展开，按源码来源去重。

`directCaller.kind` 仍为 `macro-generated-method`，但 qualname 现在标识模板，如 `mod::forward!::method`，不标识唯一 impl。嵌套具名函数仍为 `local-function`，父级由模板限定。同文件以不同模块身份加载且调用者不一致时，省略 `directCaller`，不丢弃一致目标；宏与物理展开锚点保留。展开对目标意见不一致时，顶层调用为 `unresolved`，reason 是 `rust-context-dependent`，没有 `target`；相同 `macroTemplate` 来源仍可用。不提供逐展开目标或运行时实现身份。已保存问题记录原样保留该对象；目标导航还检查捕获定义及展开文件的新鲜度。历史 v11 捕获按原约定接受，不追补 v12 来源信息。

v13 从捕获的本地自由函数签名绑定闭包输入类型：裸 `fn(...)` 参数、`impl Fn/FnMut/FnOnce(...)` 参数，或恰有一个此类约束的泛型参数。调用实参形状替换被调函数泛型（如 `&BiLock<T>` 对照 `&BiLock<R>`）；闭包输入随后获得声明类型去掉引用后的类型。闭包内每个调用在开头 `|` 处带最内层 `closure` 锚点，而 `directCaller` 仍为外层具名函数或方法。未绑定或冲突的被调泛型、竞争 callable 约束、参数数目不符及方法调用型辅助函数不产生绑定，因此未解析闭包调用不带目标。解构闭包输入不会给子绑定赋聚合类型。经方法调用、迭代器适配器或外部 API 传入的闭包不在该有限规则内。

v14 在闭包赋型中保留名称来源。辅助函数签名中的类型在声明该函数的模块中解析，因此模块局部短名或导入别名不能回退到调用者的同名类型。从调用实参替换的泛型保留实际类型的模块身份，包括调用点别名。未解析或外部类型保持独立，绝不会选择同拼写的捕获本地类型；身份不足时闭包调用未知。

v15 用选定捕获同步函数声明的返回类型识别后续方法调用的接收者，包括经局部绑定的调用。返回类型在函数声明模块解析；返回 `Self` 的 inherent 函数使用捕获拥有者。仅外观像构造函数的路径不再提供接收者类型：`A::make() -> B` 可绑定 `B::run`；未知、条件、未解析泛型或未捕获返回仍未知。async 函数写明的是 Future 的输出，因此未 await 调用或 async 访问器不能将该输出当接收者类型。未遮蔽 unit-struct 值也可通过词法 use/glob 解析提供名义接收者类型。解构 let/参数字段不继承聚合类型；无类型遮蔽会清除先前接收者证据。对于名义 `Type::method()` 调用，一个捕获 trait 实现可识别实现体，若实现省略该方法则识别 trait 声明。竞争 trait 拥有者使目标未知。trait 还必须在调用者词法作用域可见。trait 方法名携带精确捕获范围与哈希，使无体声明可通过与函数目标相同的新鲜度检查。方法声明 cfg 也必须被选中，才能提供目标或访问器返回类型；未知方法 cfg 仍是未证明证据。同一 trait 锚点在 lib/bin 上下文中一致的副本可导航，每份副本都必须验证相同精确名称 span。[固定测试与实现台账](RUST-RA-PARITY.md)将当前能力映射到 rust-analyzer 的 IDE、类型推断及名称解析测试，记录可执行规范化案例，并说明剩余差异。rust-analyzer 提供独立预期及实现指导，不是运行依赖。这些有限比较不证明与 rust-analyzer 完全等价。

v6 按每份源码声明盘点一次 trait 方法默认体，不按每个实现类型盘点。无体声明不增加调用。体内调用带 `defaultMethod` 上下文（file、name、qualname、line、column、trait），并使用既有接收者赋型：具有捕获名义类型的局部值可解析到唯一 trait impl；依赖具体 `Self` 或未解析类型的调用仍未解析。trait 的多个实现不重复计入默认体调用。

当所属 impl 的 self 类型及 struct 字段声明已捕获时，方法接收者也可经 `self.<field>` 解析。泛型字段按 struct 声明中的位置替换，因此 `impl<A: Right, B: Left> Pair<B, A>` 将 `first: X` 映射为 `B`、`second: Y` 映射为 `A`；不同实例化的 impl（`impl<T: Gate> Holder<u8>`）保持未解析；字段声明为唯一名义类型时，选择其唯一 impl。

`self.as_ref()`、`self.deref()` 和 `self.borrow()` 只有具备捕获源码证据才解包：接收者类型上的 inherent 方法有已捕获返回类型，或存在捕获的 `AsRef`／`Borrow`／`Deref` 实现目标。inherent 访问器遮蔽包装 trait；没有该证据的包装器保持未解析，不假定它暴露泛型参数。impl 与 struct 之间重命名泛型（例如 `impl<S> Subscriber for Layered<L, S>`，字段声明为 `inner: I`）、模式绑定、循环变量、不属于零参数 impl 体模式的宏生成接收者，以及其他访问器链仍未解析。

不支持的适用性明确保留：外部或宏生成 trait、supertrait／blanket impl、类型别名／Self、泛型实参替换、重命名泛型字段产生的接收者类型、模式绑定、循环变量、嵌套链或重新赋值局部变量，以及默认体内需要具体 `Self` 的调用。具体类型实现多个同名方法 trait 时保持未解析，不任择其一。重复 trait-method qualname（不同 trait 中相同类型、相同方法名）在配对问题中仍为重复槽，但 head-only traitCandidates 仍可检查。源码导航不推断生命周期，不做 borrow-check、编译、执行，也不建立完整影响。原生函数 sourceRange 从 pub/fn 起，而 definition.sourceRange 还包含所属属性／文档注释；目标位置使用前者。已保存及配对问题保留既有新鲜度及源码配置检查。常规工具链要求不变。
