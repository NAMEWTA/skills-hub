<a id="atomic-output--design-and-protocol"></a>

# 原子输出——设计与协议

`renderers/shared/atomic-output.mjs` 是每次 `finalize`、`deliver`、`compare` 和 `migrate` 操作依赖的持久性层。它提供这些工作流共用的发布与隔离原语。其他 CLI 与工具代码（`bin/archify.mjs`、`bin/preview.mjs`、`bin/visual-check.mjs`、`bin/recover-output.mjs`、`scripts/copy-site-assets.mjs`、`scripts/write-deterministic-zip.mjs`、示例与黄金测试）也会为恢复路径、原子写入和探测调用 `fs.linkSync` 与 `fs.renameSync`；区别在于，`atomic-output.mjs` 明确定义了这些调用方所依赖的契约。

<a id="why-this-exists"></a>

## 为什么需要它

调用方需要区分自己准备的候选文件与已被其他写入方替换的路径，包括发布或清理失败时。候选在发布前单独写出，让调用方在暴露目标位置之前检查完整字节。

发布流程使用一个已打开文件的绑定，在当前操作期间验证身份、内容、模式和链接数：

> 通过把候选硬链接到目标位置来发布候选。只要调用方保留该绑定，显式验证检查就能确认目标位置是否仍指向已捕获的候选和内容。发布过程会在变更与清理前后执行这些检查。

调用方负责绑定的生命周期，以及任何必需的写入方协调。本协议不会串行化调用方，不会自动验证未来的读取，也不会为多个文件提供事务。

<a id="the-contract"></a>

## 契约

`captureRegularFileBinding` 函数返回包含以下字段的快照：

- 成功时返回 `status: 'captured'`。
- `binding`——不透明 token，必须传回 `verifyRegularFileBinding`、`releaseRegularFileBinding`、`quarantineRemoveRegularFileBinding` 或 `backupPublicRegularFileBinding`，把清理范围限定到已捕获的描述符。
- `identity`——`{ device, inode, mode, links }`，其中 `device` 和 `inode` 是 `BigInt`（以容纳 Windows 身份值），`mode` 是包含权限位（`mode & 0o777`）的 `Number`，`links` 是当前硬链接数。
- `content.sha256`——文件正文的小写十六进制摘要；状态为 `captured` 时始终返回。
- `content.bytes`——当前字节长度；状态为 `captured` 时始终返回。
- `content.buffer`——以 `Buffer` 表示的文件字节，仅在传入 `includeContent: true` 时出现。
- `mode`——`Number`，复制自 `identity.mode`，便于不解构 identity 对象的调用方使用。

`verifyRegularFileBinding` 函数可在之后任意时刻重新取得同样的身份信息，并返回以下状态之一：

- `status: 'match'`——所有检查仍通过；已捕获的条目仍满足所请求的绑定。
- `status: 'different'`——至少一项检查失败（链接数、身份、模式、内容）；该路径上的条目已不是先前捕获的条目。
- `status: 'unknown'`——验证器无法确定结果（描述符不可用、文件系统不提供链接数、无法从已捕获句柄取得大小等）。调用方必须将其视为验证失败，不能视为通过。
- `status: 'unsupported'`——条目类型不适用于该操作（硬链接目标、非常规文件条目等）。调用方必须将其视为验证失败，不能视为通过。

失败状态不能被默默当作通过。调用方必须使操作失败，绝不能静默继续。

`quarantineRemoveRegularFileBinding` 函数先把拥有的文件移动到私有目录（`.archify-remove-*`），然后再删除。清理失败时可能保留恢复路径，供调用方报告。返回状态覆盖全部结果：

- `status: 'removed'`——条目已成功移入隔离区并解除链接。
- `status: 'preserved'`——隔离步骤发现目标路径上的条目已被另一方替换；被移走的副本已恢复到原路径，替换内容保持完好。调用方可接受这一结果，并报告 `committed-with-warning`。
- `status: 'recovery-required'`——隔离准备、移动或解除链接失败；条目留在恢复目录中。调用方必须报告恢复路径，并中止任何无关变更。
- `status: 'different'`——条目身份在捕获后（或恢复步骤后）发生变化。调用方必须中止。
- `status: 'unknown'`——验证器无法确定结果。调用方必须中止。
- `status: 'unsupported'`——条目类型不适合删除。调用方必须中止。

<a id="why-hard-link-not-rename"></a>

## 为什么使用硬链接而不是重命名

`fs.renameSync` 会把目标的目录条目替换为指向候选。重命名后，目标的 inode 就是候选的 inode，因此提交后的验证检查也能以相同方式工作。

发布路径改用 `fs.linkSync` + `quarantineRemoveRegularFileBinding`，原因如下：

- 在 POSIX 上，`linkSync` 的硬链接创建是原子的。一次操作就能使目标成为候选的硬链接。
- 然后通过 `quarantineRemoveRegularFileBinding` 从暂存目录删除候选；既保留目标唯一的硬链接，也使删除可恢复。
- 当前发布调用在隔离暂存候选后会验证 `expectedLinks: 1`（参见 `publishRegularFileBinding`）。如果进程在 `linkSync` 之后、当前发布调用完成之前停止，这项检查就不会运行。之后执行 `finalize` 不会扫描旧暂存目录，也不会删除候选；重启后的恢复由显式的 `bin/recover-output.mjs` 消费方负责，它操作一个指定名称的私有恢复目录。操作者必须在重试前检查保留的暂存与恢复路径。

`fs.renameSync` 无法提供这一进程内发布协议所依赖的双链接观察。这是发布设计上的取舍，并不保证之后的 `finalize` 能推断或修复中断的重命名。

<a id="why-fsconstantso_nofollow-sometimes"></a>

## 为什么（有时）使用 `fs.constants.O_NOFOLLOW`

在 POSIX 上，用 `O_NOFOLLOW` 打开路径会拒绝符号链接——若打开一个指向常规文件的符号链接，就可能与在 lstat 和 open 之间替换目标的 TOCTOU 攻击者发生竞争。在 Windows 上，系统调用层会忽略 `O_NOFOLLOW`，因此我们将其设为 `0`，并依赖基于句柄的 fstat 检测替换：如果打开句柄上的 inode 与路径 stat 得到的 inode 不一致，捕获会返回 `status: 'unknown', reason: 'target-changed-during-inspection'`。

<a id="why-the-quarantine-for-removal"></a>

## 为什么删除要使用隔离区

删除路径先把已捕获条目移到私有目录，在那里验证其绑定，然后解除链接。如果移走的条目属于另一方，代码会恢复该条目，而不是删除它。移动、恢复或解除链接失败都会报告给调用方；清理无法完成时，还会报告保留的恢复路径。

空目录清理对 `ENOTEMPTY` 另有有界重试：SMB 可能已确认解除链接，但紧随其后的目录删除仍未观察到条目消失。重试绝不会递归删除非空目录。这提供的是失败报告与其他所有者内容的保留，并不保证能在崩溃后恢复任意中断的删除。协议如下：

```text
captureRegularFileBinding(path)
        ↓
  bind → { identity, content, mode, sha256, bytes }
        ↓
quarantineRemoveRegularFileBinding(bind, path)
        ↓
  rename into .archify-remove-<rand>/
        ↓
  fs.unlinkSync from .archify-remove-<rand>/
        ↓
  status: 'removed' | 'preserved' | 'recovery-required' | 'different' | 'unknown' | 'unsupported'
```

`recovery-required` 会返回隔离文件路径，让调用方将其留在原处，并向操作者报告。

<a id="what-fails-closed"></a>

## 哪些情况会拒绝继续

原子输出层默认在无法确认安全时拒绝继续：

- 默认目标绑定预期只有一个链接，并拒绝 `nlink > 1`（`hardlinked`）。受控的发布/备份步骤在验证临时别名时，会显式请求 `expectedLinks: 2`，然后在清理后验证预期的单链接状态。
- 身份值为 `0n` 的目标（例如不提供 inode 的 Windows FAT 文件系统）会被拒绝（`identity-unavailable`）。
- 在捕获与验证之间改变 inode、设备、模式、大小或内容的目标会被拒绝（`different`，附具体原因）。
- 无法在不跟随符号链接的前提下打开其句柄的目标会被拒绝（`target-handle-inspection-failed`）。

每次拒绝都会返回 `{ status, reason }`，由调用方映射为诊断。任何调用路径都不得把拒绝当作成功。

<a id="what-this-is-not"></a>

## 它不是什么

- 它**不是**事务数据库。它不会回滚远端系统上的部分副作用，也不会使多文件操作具备事务性。它验证单个文件绑定，并报告保留的恢复路径。
- 它**不是**并发锁。`bin/archify.mjs` 中的 delivery/finalize 路径使用自己的交付锁（`deliveryLockPath`）。其他消费方直接调用共享发布原语。原语不获取该锁，只验证路径身份和内容；每个调用方负责其工作流所需的并发协调与绑定生命周期。
- 它在不同目标路径之间**不具备**幂等性。对两个不同目标执行两次 `finalize`，会产生两个独立制品；该层不按内容去重。
- 它**不是**目录扫描器。它不会寻找孤立的暂存条目；这些条目的恢复由 `bin/recover-output.mjs` 负责。

<a id="where-to-look-in-the-source"></a>

## 从源码哪里查看

| 函数 | 用途 |
|---|---|
| `captureAtomicOutput` | 一次性快照，捕获目标的完整身份、内容和模式 |
| `captureRegularFileBinding` | 可复用版本；保证相同，可调用任意次数 |
| `verifyAtomicOutput` | 为已捕获目标重新取得身份信息 |
| `verifyRegularFileBinding` | 可复用版本 |
| `quarantineRemoveRegularFileBinding` | 移入私有隔离区后解除链接；处理 `preserved` 路径 |
| `backupPublicRegularFileBinding` | 为已验证备份创建硬链接，然后隔离删除公开名称，并验证剩余链接 |
| `publishRegularFileBinding` | 发布协议本体：将候选硬链接到目标，隔离移除候选，验证失败时拒绝继续 |
| `removeEmptyDirectoryWithRetry` | 对 SMB 的 `ENOTEMPTY` 竞争执行有界重试 |

`test/atomic-output*.test.mjs`、`test/portable-delivery*.test.mjs` 和 `test/delivery-lock*.test.mjs` 中的测试覆盖失败模式矩阵：硬链接检测、模式不匹配、内容哈希不匹配、竞争写入方，以及提交后恢复。
