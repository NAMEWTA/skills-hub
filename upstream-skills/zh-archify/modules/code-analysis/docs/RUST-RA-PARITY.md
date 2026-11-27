<a id="rust-call-evidence-against-pinned-rust-analyzer-tests"></a>

# 对照固定版本 rust-analyzer 测试的 Rust 调用证据

本台账将 Archify 已提供的 Rust 输出与 [rust-analyzer 的 `e5e7830640558e323e89c831488a3172b58dc66d` 版本](https://github.com/rust-lang/rust-analyzer/tree/e5e7830640558e323e89c831488a3172b58dc66d)进行比较。参考依据包括上游 fixture、预期目标或推断类型，以及确立这些结果的实现。比较时，将每个案例归一化为它所捕获的调用目标（文件、名称、定义行）；调用层级案例还比较直接调用者。Archify 额外检查已保存目标能否依据捕获的源码及文件当前的新鲜度继续导航。LSP 光标范围和 UI 分组属于不同的输出契约。

运行移植案例：

```sh
node --test --test-name-pattern='Rust rust-analyzer' archify/modules/code-analysis/test/rust-calls.test.mjs
```

下列 fixture 位于 `test/rust-calls.test.mjs`。其中移除了 `$0` 光标和下划线注释；其余相关源码形式及预期目标均遵循固定版本的测试。表中的测试名称对应一个具体的上游测试身份，不是对整体 Rust 准确率的估计。直接移植的 fixture 在 21 个 fixture 中覆盖 24 个上游测试身份。另有五项测试使用从上游语义派生的精简失败对照；它们单独列出，不算作又通过了五个 LSP 案例。一个经过适配的闭包 fixture 检查受支持的自由函数子集，并将不支持的方法回调案例保留为明确的未知项。

<a id="coverage-of-the-existing-rust-adapter"></a>

## 现有 Rust 适配器的覆盖情况

最初的 19 项测试身份台账抽样检查了 IDE 定义、层级和引用测试。它并未确立现有适配器所有功能所依赖的类型推断和解析前提。下表进一步将这些功能追溯到固定版本的 HIR 测试。作为语义参考的上游测试，只有同时出现在后面的 fixture 表中，才声明为可执行的移植测试。

| 现有 Archify 行为 | 需要研究的固定版本上游测试 | 本地保护／仍存在的差异 |
| --- | --- | --- |
| 自由函数、模块路径、别名、edition 命名空间和已捕获的 workspace crate | [nameres tests]：`use_as`、`edition_2015_imports`、`extern_crate_rename`、`values_dont_shadow_extern_crates`；[method tests]：`cross_crate_associated_method_call` | 现有 crate 路径、edition、依赖别名和自定义库测试验证已捕获的 Cargo 身份。外部依赖仍未捕获。 |
| Cargo test/cfg/path 选择 | [nameres tests]：`cfg_test`、`cfg_not_test`；[module tests]：`cfg_in_module_file` | 现有 cfg 配置、cfg_attr/path、未知生成 cfg 测试，以及 trait 方法 cfg 对照。cfg 未知的方法不能确立目标或访问器返回类型。这些是保守的对照，并不表示与完整加载的 Cargo 项目等价。 |
| 单态、具体特化和仅含生命周期的 inherent 路径 | [method tests]：`infer_associated_method_struct`、`infer_associated_method_with_modules`、`infer_associated_method_generics_without_args` | 现有 inherent／特化／生命周期测试检查目标、竞争 impl 和不支持的同级项。Archify 不复现通用的基于实参的类型推断。 |
| 返回值及后续方法接收者 | [method tests]：`infer_associated_method_with_modules`；[trait tests]：`infer_async`、`infer_desugar_async` | 返回类型／模块测试，以及下述 async 对照。书面声明的 async 输出不是调用表达式的类型。 |
| unit 值、局部导入、glob 导入和遮蔽 | [glob tests]：`glob_shadowed_def`、`glob_shadowed_def_reversed`；[block tests]：`use_from_crate`、`nested_blocks`；[simple tests]：`should_be_shadowing_imports` | 局部导入和块级 glob 对照，以及闭包遮蔽／重新赋值测试。接收者查找现在复用词法路径解析，不再依赖模块的拼写。 |
| 具体 trait impl、泛型／dyn trait 锚点和 inherent 优先级 | [definition tests]：`goto_impl_of_trait_fn`；[method tests]：`infer_call_trait_method_on_generic_param_2`、`method_resolution_impl_before_trait`、`method_resolution_impl_ref_before_trait`、`method_resolution_trait_autoderef`、`dyn_trait_method_priority` | 已移植的目标以及现有 trait impl 和竞争所有者对照。即使完整 RA trait 作用域／适用性分析能够选出一个目标，多个所有者仍保持未解析。 |
| 默认 trait 方法体、`self` 和直接调用者 | [trait tests]：`trait_default_method_self_bound_implements_trait`；[definition tests]：`goto_impl_of_trait_fn::method_call_defaulted` | 已移植的 trait 锚点，以及现有默认方法体、覆盖、局部函数调用者和已变更默认方法引用测试。不推断具体的运行时派发。 |
| 显式字段接收者、泛型位置、where 约束和默认类型参数 | [trait tests]：`tuple_struct_fields`、`infer_default_trait_type_parameter`；[method tests]：`method_resolution_where_clause_1` | 现有字段位置、交换泛型、where 子句和带默认值字段测试。这验证的是有限范围内的声明身份，而非通用 impl 适用性。 |
| 已捕获的 `as_ref`／`borrow`／`deref` 和智能指针载荷 | [trait tests]：`deref_trait`、`infer_borrow`；[method tests]：`method_resolution_impl_before_trait` | 现有包装实现、别名、同名访问器、inherent 优先级和智能指针测试。通用 autoderef 与 blanket impl 推断仍在适配器范围之外。async 访问器输出现在保持未知。 |
| 由已捕获局部 fn／Fn 家族签名提供上下文的闭包输入 | [trait tests]：`closure_as_argument_inference_order`、`infer_fn_trait_arg`；[pattern tests]：`match_ergonomics_in_closure_params` | 现有 fn／FnOnce、模块身份、泛型替换和解构闭包测试。方法／外部回调仍不受支持。 |
| 模式绑定 | [pattern tests]：`infer_adt_pattern` | 新增 let／参数对照拒绝把聚合类型复制到字段绑定上。Archify 仍不推断通用的解构字段。 |
| 保留表达式的宏、文本作用域和 impl 体模板 | [macro tests]：`plain_macros_are_legacy_textual_scoped`、`legacy_macro_use_before_def`；[hierarchy tests]：`test_call_hierarchy_in_macros_incoming` | 现有宏作用域／cfg／来源／歧义测试覆盖 Archify 的两种有限展开形式。完整的上游生成函数／标识符匹配器 fixture 并非通过的移植案例。 |
| 直接调用边、传入引用和已变更定义 | 下列 [hierarchy tests] 与 [reference tests] | 已移植的物理调用边和已变更直接引用。通用非调用引用与 LSP 层级中的 trait／实现分组具有不同的契约。 |
| 跨 crate 上下文的精确源码导航 | [definition implementation]，`goto_definition`；[hierarchy implementation]，`CallLocations` | 精确名称／摘要、过期文件、v14 和重复 trait 锚点对照。UTF-16 范围、已保存哈希及当前文件新鲜度是 Archify 特有的证据契约。 |

<a id="what-changed-after-reading-the-implementation"></a>

## 阅读实现后发生的变化

RA 的[调用层级实现][hierarchy implementation]通过 `Semantics` 获取调用的 callable／类型或已解析的方法；它不会根据构造器路径的拼写推断接收者。适配器现在把声明的被调函数／模块规则限制在同步单态返回值内。`infer_desugar_async` 区分 `impl Future<Output = T>` 与 `T`，因此 async 自由函数、关联函数或访问器不能把 `T` 提供为未经 await 的接收者类型。

RA 的[模式推断][pattern inference]使用各字段实例化后的类型递归检查字段。Archify 对 let／参数模式中的类型提示和形状都复用 `whole_binding_names`：解构名称保持无类型，不会得到聚合类型。新的遮蔽也会清除旧的局部类型提示。

RA 的[解析器][resolver]在模块作用域之前遍历表达式和块作用域。Archify 的类型提示和形状查找现在共享最近局部作用域规则，unit 值形状也使用现有支持 use／glob 的路径解析器。内层导入不能回退到外层同名类型；无关 glob 不会擦除已经确立的局部类型。

RA 的[定义实现][definition implementation]会去重导航目标。位于同一个物理方法锚点的多个已捕获 trait 记录，在每条记录都验证同一精确名称范围时，现在能够导航；伪造副本仍会使导航被拒绝。这能处理 lib 和 binary 共享同一源码文件的情况，同时保留它们各自独立的 crate 上下文。

RA 的名称解析 cfg 测试先选择声明，再把声明用作名称证据。适配器现在也在内部保留每个 trait 方法的 cfg 状态。未知方法仍会阻止歧义消除，但不能成为目标，也不能提供访问器返回类型。`Rust rust-analyzer cfg boundary` 同时检查未知配置和显式选择的配置；加入此防护之前，该测试会失败。

这些修正之前，四个精简对照在 `b20a9355` 上失败：async 接收者、let／参数字段模式、块级 glob 接收者身份，以及重复 trait 锚点。前三项都有编译器接受的反例；`rustc --emit=mir` 选择了 `FutureExt::run`、`C::run` 和 `other::S::run`，而 Archify 报告的是 `B::run` 或外层 trait 方法。这些是合成复现，不是生产事故声明。仓库中的对照分别名为 `Rust rust-analyzer async return boundary`、`pattern boundary`、`block glob lookup` 和 `navigation deduplicates`。

上游仓库仅在固定修订版本以只读方式使用。这里的测试以独立记录的上游预期执行 Archify；不会执行上游 Rust 测试框架或运行时 LSP 服务器。

<a id="definition-targets"></a>

## 定义目标

来源：[固定版本的 `goto_definition.rs`](https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/goto_definition.rs)。

| 上游测试 | Archify 检查 |
| --- | --- |
| `goto_def_for_methods` | `foo.frobnicate()` → `Foo` 的 inherent 方法体 |
| `goto_def_for_ufcs_inherent_methods` | `Foo::frobnicate()` → `Foo` 的 inherent 方法体 |
| `goto_def_for_ufcs_trait_methods_through_traits` | `Foo::frobnicate()` → 无方法体的 trait 方法声明；导航有效 |
| `goto_def_for_ufcs_trait_methods_through_self` | `Foo::frobnicate()` 通过一个已捕获 trait impl → trait 声明；导航有效 |
| `goto_impl_of_trait_fn::method_call` | `s.a()` → 已捕获的 trait 实现方法体 |
| `goto_impl_of_trait_fn::path_call` | `Stwuct::a(&s)` → 已捕获的 trait 实现方法体 |
| `goto_impl_of_trait_fn::method_call_defaulted` | `s.a()` → trait 默认方法声明 |
| `goto_impl_of_trait_fn::method_call_on_generic` | `T: Twait`，`s.a()` → 仅 trait 声明 |

下列源码 fixture 来自 [method tests] 和 [trait tests]。上游断言推断得到的结果类型；提供该类型的唯一声明被归一化为 Archify 的方法目标，并接受导航检查。

| 上游测试 | Archify 检查 |
| --- | --- |
| `method_resolution_impl_before_trait` | `S.foo()` → inherent `i8` 方法，优先于 `u128` trait impl |
| `method_resolution_impl_ref_before_trait` | `S.foo()` → inherent `&self` 方法，优先于竞争的引用 trait impl |
| `method_resolution_trait_autoderef` | `(&S).foo()` → 已捕获的 trait impl |
| `infer_call_trait_method_on_generic_param_2` | `T: Trait<U>`，`t.method()` → trait 声明，不选择具体的 `U` |
| `trait_default_method_self_bound_implements_trait` | trait 默认方法体内的 `self.foo()` → 该 trait 自身的声明 |

[trait tests] 中的 `closure_as_argument_inference_order` 有一个经过适配的 fixture，名为 `Rust rust-analyzer closure argument order`。它为原本没有方法体的 inherent `S::method` 添加了方法体。自由函数的两种实参顺序都会把 `s.method()` 解析为该方法；方法回调的那一半则受 Archify 既有回调边界限制，仍未解析。该部分不匹配 RA 的完整推断，因此不计入通过的等价案例。

<a id="captured-call-edges"></a>

## 已捕获的调用边

来源：[固定版本的 `call_hierarchy.rs`](https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/call_hierarchy.rs)。源码与调用边相同的测试共享一个 Archify fixture；其上游测试身份仍分别列出。

| 上游测试 | Archify 检查 |
| --- | --- |
| `test_call_hierarchy_on_ref` | `caller` → `callee` |
| `test_call_hierarchy_on_def` | `caller` → `callee` |
| `test_call_hierarchy_in_same_fn` | 两个 `caller` → `callee` 调用点 |
| `test_call_hierarchy_in_different_fn` | `caller1` 和 `caller2` 分别 → `callee` |
| `test_call_hierarchy_in_tests_mod` | 设置 `rust.tests=true` 时，普通调用者和 `#[test]` 调用者 → `callee` |
| `test_call_hierarchy_in_different_files` | 导入的调用 → `foo/mod.rs` 中的定义 |
| `test_call_hierarchy_outgoing` | 两个向外的 `caller` → `callee` 调用点 |
| `test_call_hierarchy_outgoing_in_different_files` | 向外调用 → `foo/mod.rs` 中的定义 |
| `test_call_hierarchy_incoming_outgoing` | `caller1` → `caller2` → `caller3` |
| `test_call_hierarchy_issue_5103` | `main` → `a` → `b`；选择任一中间函数都会保留正确的边 |

<a id="captured-direct-references"></a>

## 已捕获的直接引用

来源：[固定版本的 `references.rs`](https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/references.rs)。

| 上游测试 | Archify 检查 |
| --- | --- |
| `test_find_struct_function_refs_outside_module` | `main` 中的 `foo::Foo::new()` 到达已捕获方法；发生变更的 `new` 会把该调用列为有效的已知引用 |

<a id="scope-boundaries"></a>

## 范围边界

固定版本的文件还覆盖字段、类型、别名、运算符、宏定义、`include!`、光标位置选择和 UI 过滤。Archify 的 Rust 事实不输出这些 LSP 功能，因此这些测试没有可匹配的输出来比较。Archify 当前的调用还会把嵌套块内局部 impl、依赖泛型／实参的 trait 重载选择、通用宏展开，以及语义无效 impl 的恢复保留为未解析。例如 `goto_impl_of_trait_fn::method_call_inside_block`、`goto_impl_of_trait_fn::where_clause_can_work`、`path_call_multiple_trait_impl`、`query_impls_in_nearest_block` 和宏调用层级案例。这些是记录下来的边界，而非通过的对等性案例。其余 `references.rs` 案例搜索变量、类型、导入及其他非调用引用。Archify 的变更问题仅报告指向已变更定义的已捕获直接调用证据。

移植测试旁的本地回归测试还会拒绝错误的、看似构造器的返回类型，块内局部 unit struct 遮蔽，泛型特化泄漏，竞争 trait 所有者（包括未知 cfg），伪造的 trait 方法摘要，过期目标文件，以及 v14 导航兼容性。这些对照在仅凭 rust-analyzer 的编辑器目标不足以确立证据时，保护 Archify 保守的源码证据契约。通过这些有限案例不能证明整个功能或整个仓库等价。上述语义参考表明确保留了泛型适用性、blanket impl、通用模式推断和宏展开方面的差距。

[definition tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/goto_definition.rs
[definition implementation]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/goto_definition.rs#L175
[hierarchy tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/call_hierarchy.rs
[hierarchy implementation]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/call_hierarchy.rs#L96
[reference tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/ide/src/references.rs
[method tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-ide/src/tests/method_resolution.rs
[trait tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-ide/src/tests/traits.rs
[pattern tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-ide/src/tests/patterns.rs
[simple tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-ide/src/tests/simple.rs
[nameres tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-def/src/nameres/tests.rs
[module tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-def/src/nameres/tests/mod_resolution.rs
[glob tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-def/src/nameres/tests/globs.rs
[block tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-def/src/expr_store/tests/body/block.rs
[macro tests]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-def/src/nameres/tests/macros.rs
[pattern inference]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-ty/src/infer/pat.rs#L1200
[resolver]: https://github.com/rust-lang/rust-analyzer/blob/e5e7830640558e323e89c831488a3172b58dc66d/crates/hir-def/src/resolver.rs#L415
