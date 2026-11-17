> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/tt-a1i/archify/blob/a7ed6fd6657da90414831d1d42cf95987188750c/archify/references/delivery-contract.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

<a id="delivery-contract"></a>

# 交付契约

<a id="failed-finalize-and-candidate-repair"></a>

## Finalize 失败与候选文件修复

`finalize` 在第一道未通过的门禁停止。使用精简 stdout 或 `evidence.summaryReceipt`；只有摘要缺少连贯修复所需证据时，才阅读完整 sidecar。只有四项产物检查的回执是基础验证，不是 showcase 验收：要求全部九项检查、零构图错误、零警告。几何之前先修复 `meta.quality_profile` 和 schema 错误。密集的完整 schema ERD 首次展示全部字段时，可以保留 `standard`：要求零结构错误、没有边穿节点失败、完整字段行和可读分组网格，并记录构图警告，不为它们投入无界时间。

校验失败时，重跑命令前，先编辑现有 JSON 中诊断指出的相连邻域。保留请求语义、有意义标签、源证据和固定或约定拓扑。多条路由共享节点时，应做一次摆放修复；此情况阅读[架构布局修复](architecture-layout-repair.md)。重排受阻主路径，不要微调无关标签。无关几何的构图已经清晰时保留它。只有精简证据缺少所需测量值时，才在编辑前用 `--layout-json`。Workflow v2 以稳定编译器回执作为创作证据，不使用求解器内部状态。

视口修复前，保留已经通过路由检查的最佳候选。如果视口修复引入新路由碰撞，恢复该实测布局，再处理剩余画布或文字约束。

编辑后，使用 `--quality showcase` 重新运行完整 `finalize`；基于仓库的工作还需 `--repo-root <repo-root>`。如果输出路径已拥有另一候选文件的浏览器证据，为新的 `finalize` 和任何 `visual-check` 共用一个新的 `--out-dir <output-stem>.review-<revision>`。编辑后省略旧的 `--candidate-sha256`，因为它绑定前一个候选。比较诊断时看代码、对象、阶段和证据，绝不只看错误数量下降。按持续问题跟踪修复次数，使用相同代码、对象、阶段和证据；新暴露问题开始自己的修复序列。一个问题经过两次针对性修复仍存在时，检查实测几何或相关契约；再进行一次有证据依据的重试后，报告具体缺口。

单独的 `validate` 仅用于针对性诊断；基于仓库的工作传入 `--repo-root`。通过的回执标记 `candidateFrozen: true`；运行 `nextAction.arguments`，只替换 `<output.html>`，不编辑、不重新验证、不重读候选。之后环境或证据失败，针对同一冻结字节重试。有实测理由要编辑时，会形成新候选，须不带旧 hash 运行完整 `finalize`。

<a id="validate-and-deliver"></a>

## 校验与交付

`render` 和直接渲染器入口，将分类后的创作失败以可读诊断输出到 stderr，并退出 1。输入读取／JSON 解析失败使用 `input/read` 或 `input/json-parse`；输出文件系统失败使用 `output/write` 并指出输出路径。schema 和布局失败保留既有规则码。需要机器回执时，使用文档说明的 `validate --json` 或 `deliver --json` 接口；`render` 没有 `--json` 标志。意外实现失败在人类模式保留调试信息，在机器回执中保持 `internal/unclassified`。

每个交付输出有两个产物专属元数据路径。如果输出 stem 对这些派生文件名而言太长，Archify 会缩短它并附加稳定 hash：

- `<output-stem>.delivery.json` 记录最近一次已完成尝试。
- `<output-stem>.delivery-pending.json` 是进行中尝试的恢复日志。

如果产物的字面 stem 已经匹配 Archify 保留的有界命名标记，在编码 sidecar 缺失时，命名空间引入前的原始 provenance sidecar 仍可作为读取回退。旧命名空间的原始 pending journal 是独立的拒绝继续屏障：即使编码 pending journal 同时存在，它仍阻止检查和再次交付，两个 journal 都不会被静默替换。

一个目录级 `.archify-delivery-lock.json` 将所有解析到同一物理输出目录的交付串行化。这刻意阻止大小写、Unicode 规范化、Windows 短名和符号链接别名，为同一文件系统位置创造独立所有者。代价是，同一目录中不同产物名的交付也串行执行；provenance 和 pending journal 仍是产物专属。

为了迁移安全，Archify 还检测并保留请求产物旁旧格式的 `<output-stem>.delivery-lock.json`。已有旧条目是拒绝继续的恢复屏障。新交付拥有目录互斥锁期间，还为请求拼写与已有产物物理目标拼写持有临时旧格式屏障。它先获得目录锁，再获得全部所需兼容屏障，然后才写 journal 或产物；释放时先移除目录锁，再移除这些屏障。这阻止使用任一已知拼写的旧 Archify 二进制进入交付。若某旧屏障的原始 HEAD 时代文件名超过宿主组件限制，则省略该屏障，因为旧二进制在该宿主上也无法创建该锁或交付该产物。

`deliver` 在创建或替换恢复 journal 之前，通过独占 `open(..., "wx")` 获取锁。成功的独占创建产生绑定本次尝试的内部不透明所有权能力。journal 创建、失败 provenance 记录、成对提交、回滚、journal 完结和释放锁，都在将要修改共享状态的操作内部验证当前能力。被拒绝的竞争者不创建 journal，也不写失败 provenance。

已有目录锁或旧锁不自动恢复，处理方式如下：

| 观察到的锁状态 | `deliver` 必须产生的结果 |
| --- | --- |
| 没有目录条目 | 尝试独占创建；只有成功才授予所有权。 |
| 合法 schema-v1 锁的 PID 仍运行，或无法确定已退出 | 以 `delivery/concurrent-attempt` 退出 1；保留全部共享路径。 |
| 合法 schema-v1 锁的 PID 已知退出 | 以 `delivery/lock-stale` 退出 1；精确保留锁、产物、journal 和当前 provenance。 |
| 无法读取、格式错误、符号链接、悬空符号链接、目录或其他非普通文件锁条目 | 以 `delivery/lock-invalid` 退出 1；保留该条目和全部其他共享路径。 |
| 已取得能力不再匹配当前锁或 journal | 以 `delivery/ownership-lost` 退出 1；停止全部共享路径修改。 |
| 匹配所有者无法删除自己的锁 | 以 `delivery/lock-release` 退出 1；保留锁。 |

`delivery/lock-stale` 诊断指出绝对输出和锁路径，以及原 PID 和回执 ID。恢复刻意要求显式且串行：停止该物理输出目录的全部交付尝试，确认没有活动交付拥有它，确认报告的过期条目未被替换，只移除报告的锁，然后重跑 `deliver`。过期锁恢复不能顺带删除产物、当前 provenance 或 pending journal。

锁协议面向 Node.js 18 或更高版本、本地文件系统以及遵守协议的 Archify 进程。PID、回执和文件身份比较是防御检查，不是原子 compare-and-swap。兼容屏障覆盖请求拼写和已有物理目标拼写；无法枚举任意硬链接名称或此前未知的文件系统别名，因此通过这些别名进行混合版本交付仍不在范围内。该契约不声称在 NFS、SMB 或其他网络文件系统上具备分布式锁正确性，也无法阻止忽略协议的外部进程替换共享路径。

每个不覆盖竞争写入的 HTML 发布器（`render`、`deliver`、`compare`、`preview`），都在暂存前捕获请求目录条目、规范写入槽位、物理父目录，以及已有目标类型、设备／inode 身份和 mode，并在替换前立即重新验证快照。已有写入目标必须是恰好只有一个硬链接名称的普通文件。具有多个硬链接名称的目标，以 `output/target-hardlinked` 拒绝继续：替换请求名称无法以一次发布更新未知兄弟名称。硬链接仍支持读取身份和输入／别名碰撞检查；仅不支持作为写入目标。指向单链接普通文件的符号链接仍受支持：发布保留符号链接条目，对其解析后目标应用相同协议。目录、FIFO、socket、设备、mode 改变、新占有者和身份不确定的情况，都在替换前失败。

发布保证不覆盖竞争写入并可恢复，不保证已有目标替换在进程崩溃时原子可见。为避免覆盖最后一次身份检查后出现的新占有者，Archify 先在私有恢复备份中保留已绑定旧文件，通过身份绑定隔离移除公开名称，然后以独占硬链接创建新公开名称。捕获到失败时，如果公开槽位和恢复绑定仍允许，会回滚。若进程在这些命名空间操作之间中断，则公开路径可能缺失，而经过验证的旧字节仍留在邻近私有恢复备份中。单产物发布在私有 `.archify-remove-*/publication-recovery-v1.json` 中记录原始槽位／别名身份，以及备份 inode、mode、SHA-256 和字节数，该文件与 `previous` 相邻。要让某次中断发布重新可见，停止并发写入者并运行：

```bash
node bin/recover-output.mjs /absolute/path/to/.archify-remove-<id> --json
```

这是显式恢复，不是目录扫描器。建立链接前，辅助程序检查父目录或别名是否改变、记录或备份是否被修改／硬链接、摘要或 inode 是否不匹配，以及公开目标是否已存在。它仅通过不覆盖的硬链接恢复，因此保留新占有者，而不覆盖；绝不递归移除未知条目。完成的恢复是幂等的。记录是需要独立验证的证据，不是恢复任意私有字节的授权：辅助程序只接受位于原始物理目标父目录下、记录中指定的生成子目录里的记录，并要求目录身份相同。指定被中断进程报告的确切目录；不确定的记录要手工检查。未遵守协议的进程仍可能在检查后、Node.js `linkSync` 前交换路径名；Node 没有暴露绑定描述符的链接操作。链接后身份验证因此会拒绝继续并保留恢复证据，而不是声称恢复成功或删除不确定名称。恢复自身在链接后中断时，旧公开字节和私有备份可能同时保留；之后的恢复运行会保留公开目标，需要操作者明确处理。在支持目录同步的平台上，移除旧公开名称前会对记录 fsync；已经测试的保证是进程被杀后的恢复，不是断电、存储控制器、NFS 或 SMB 的持久性保证。成对流程在私有事务暂存区保留备份。对于 `deliver`，pending journal 和锁让严格检查器保持拒绝继续。可移植的 Node.js 文件系统 API 没有一种路径名 compare-and-swap，能同时原子替换已有名称并拒绝覆盖迟到占有者：`rename` 只有通过覆盖该占有者，才能消除可见性空窗。

建立所有权后，`deliver` 在渲染前创建 journal，并在可恢复的 HTML／sidecar 成对提交期间保留它；只有该提交完成后才移除 journal。因此，校验、渲染、成对提交失败，或进程中断，都可能留下 journal。journal 是安全屏障：journal 或锁路径上只要存在任何目录条目，包括无法读取的文件、符号链接或悬空符号链接，`check`、`browser-check`、`visual-check` 都拒绝继续。针对同一物理输出目录的交付串行运行；前一次必须完成或恢复，下一次才能开始。

成功 sidecar 包含 `schemaVersion: 1`、`status: "current"`、`command: "deliver"`、唯一 `receiptId`、图表 `type`、绝对 `input` 路径、与被检查产物匹配的绝对 `output` 路径，以及 specification／artifact 的 SHA-256 和字节数。检查器把缺失、格式错误、不受支持或不一致的字段视为非法。sidecar 符号链接（包括悬空链接）也会被拒绝。检查器将 provenance 绑定到实际检查的产物字节，并在报告成功前再次验证绑定；并发字节变化会导致失败。provenance 目录条目自身必须是单链接普通文件：存在另一个硬链接时，`deliver` 和严格 check 以 `delivery/provenance-hardlink-unsupported` 拒绝继续，不扫描或猜测兄弟名称。

当前已验证所有者在旧 HTML 已存在后失败时，Archify 写入新的 `status: "failed"` sidecar，并保留 journal 直到恢复完成。旧 HTML 无法读取不妨碍写该标记；其产物 hash 和字节数可以缺失。如果 sidecar 被锁或因其他原因无法写入，Archify 保留旧 sidecar，不删除证据；journal 阻止检查器信任它。被拒绝的并发、过期锁或非法锁尝试，不写失败 provenance。所有权丢失时，Archify 报 `delivery/ownership-lost`，不覆盖或移除继任者的产物、provenance、journal 或锁，也不声称已记录失败 provenance；失败回执可报告 `provenance: "unrecorded"`。全部元数据路径均不可用时，同样使用 unrecorded 状态；没有工具能跨进程保留这个事实。恢复元数据路径访问并成功完成一次 `deliver` 之后，才能信任输出。

没有 sidecar、journal 或锁的产物仍受支持，以兼容旧版本和较低层的 `render` 命令。其检查器回执报告 `provenance: "unknown"`；工作流要求成功交付的产物时，用 `--require-provenance` 将该状态转为非零失败：

```bash
node bin/archify.mjs check <output.html> --require-provenance
node bin/archify.mjs browser-check <output.html> --json --require-provenance
```

<a id="output-path-contracts"></a>

## 输出路径契约

Archify 刻意区分持久的作者路径与命令行路径：

- 必填的作者 `meta.output` 是可移植 POSIX 相对路径，例如 `reports/diagram.html`。使用 `/`，以非空 `.html` 文件名结束；不能含绝对或驱动器相对前缀、URI、反斜杠、空段或点段、控制字符、未配对 UTF-16 surrogate、Windows 备用数据流分隔符或非法文件名字符、末尾点或空格、DOS 设备名，以及超过 255 UTF-8 字节或 255 UTF-16 代码单元限制的组件。从当前工作目录解析，跟随符号链接后仍必须物理地位于该目录内，目标扩展名为 `.html`。持久输出／归档 profile 还保守地拒绝 `PROGRA~1` 这样的 Windows 8.3 短名形式；描述性的 repo／Git POSIX 路径使用独立 profile，不受此限制。
- 显式 CLI 输出参数使用当前宿主原生语法。可以相对或绝对，使用原生分隔符，也可以解析到当前工作目录外。Windows 支持普通驱动器绝对路径、UNC 和相对路径（包括普通 `.`、`..` 导航）。系统解析出的已有文件或目录 8.3 拼写，在 Archify 能证明物理身份时可接受；这种原生别名支持，不放宽持久输出／归档 profile 对 8.3 形式名称的拒绝。扩展长度路径仅限无点段、只使用原始反斜杠的 `\\?\C:\...` 和 `\\?\UNC\server\share\...` 形式；设备命名空间、畸形根、`C:file.html` 这样的驱动器相对路径、`\file.html` 这样的当前驱动器根、备用数据流、保留设备名、非法或末尾文件名字符，以及过长组件，都拒绝继续。POSIX CLI 路径保留 POSIX 文件名规则，不继承 Windows 拼写限制。所有宿主都拒绝 NUL、未配对 surrogate，以及超出支持边界的组件。

两种契约不能互换：显式 CLI 输出不能掩盖非法持久 `meta.output`（包括缺失值）；即使不向该路径发布，`validate` 仍检查作者输出路径。Workflow v1 到 v2 迁移可通过 `migrate workflow old.json new.json --to-schema 2 --output reports/diagram.html` 显式接收一个可移植的持久替代值；它只写入独立且已验证的 v2 目标。该迁移候选例外不会修复源文件，也不会绕过任何非输出相关 schema 或编译器错误。其他修复均应在 `meta.output` 添加可移植 POSIX 相对 `.html` 路径；不因此要求修改 schema 版本。

完整首稿和每次修复编辑之后，直接运行 `finalize`。内嵌校验在交付前检查候选；单独 `validate` 仅用于针对性诊断。编辑后，省略绑定前一候选的旧 `--candidate-sha256`。CLI HTML 输出路径必须以 `.html` 结束，符号链接解析后也一样。compare 回执路径必须以 `.json` 结束。类型不匹配在写入前以 `output/cli-extension` 或 `output/cli-resolved-extension` 失败。这些检查防止意外文件类型覆盖；它们不将显式 CLI 目录置于沙箱内，也不阻止替换符合预期类型的已有产物。

候选冻结后，才使用最终验证交付：

```bash
node bin/archify.mjs deliver <type> <candidate.json> <output.html> --quality showcase --json
```

Deliver 只读取一次 specification，将相同字节写入同目录私有候选快照，渲染该快照，运行完整产物检查器；只有全部产物检查通过才替换目标。JSON 回执同时包含 `specification` 和 `artifact` 的 SHA-256 与字节数。

普通 agent 交接路径优先使用 finalizer：

```bash
node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
```

`finalize` 调用一次已验证的 `deliver`，复用其内嵌 showcase 校验结果，再执行严格 `check --require-provenance` 和 `browser-check --require-provenance`。在第一个失败或跳过阶段停止，保留该阶段完整回执。stdout 为一个精简 JSON 对象，包含门禁状态、有界可行动诊断、产物身份和证据路径。同一精简对象以原子方式写入 `<output-stem>.finalize-summary.json`；普通失败修复使用该文件。诊断被截断时，`diagnosticSummary.omittedByCode` 按诊断代码统计未展示条目，但不替代完整回执中的对象与修复证据。完整阶段回执和耗时仍保存在 `<output-stem>.finalize.json`，供审计使用。设置 `--out-dir` 时，两文件都写入该目录（除非显式 `--receipt` 覆盖 finalize 回执路径；产物 HTML 仍位于请求输出路径）；`--receipt <path.json>` 覆盖完整回执路径，并派生独立的 `<path>-summary.json`。只有精简摘要被截断且已展示对象与证据不足以确定连贯局部修复，或用户明确要求完整审计证据时，才阅读完整回执。精简回执报告 `visualReview: "not-requested"`；自动门禁不创建图片，也不要求感知审阅者。精简 `visualReviewRecommendation` 保留严格检查中为正的交叉与绕路指标，让作者无需读取完整回执就可应用下方审阅升级。建议不改变机器退出码，也不声称审阅已发生。其 `affectedRoutes` 指出交叉对和绕路（各最多八项，带截断标志）；完整严格检查的 `composition.routeReview` 保留全部受影响关系。使用这些 ID 在捕获的默认视口中追踪路由。绕路可包含 `directCorridorBlockers`，指出对齐端点之间的节点。这是几何审阅线索，不是新校验失败，也不是推断出的主路径语义。主路径受阻或多条路由纠缠时，遵循[架构布局修复](architecture-layout-repair.md)，先重排相连场景，再微调个别端口侧或标签。保留每条语义事实；只有周围构图已被接受时，才保留无关位置。

对实测自动 Architecture，如果开头存在大片未用区域，精简回执可能包含 `layoutReviewRecommendation`。其 `composition.leadingSpace` 证据计入节点、边界标题、路由和标签。检查该空白是否有意；若无意，在保留含义和用户固定几何的前提下，重新摆放相连场景，再次 finalize。该建议不改变门禁或退出状态，不要求截图。固定画布或测量不确定时不提供建议。

通过的 finalizer 回执足以证明全部四道门禁。仅仅点名门禁或要求每道通过，并不要求重放单项命令。只有请求明确要求分别执行，或针对性失败诊断需要时，才重放单项命令。

单项命令仍保持权威且向后兼容。针对性诊断、恢复或只需一道门禁时，直接使用。finalize 失败不放宽任何门禁，也不会把保留下来的旧产物变成当前成功交付。

`finalize` 仅在交付和严格检查通过后，才发现并启动私有 Chrome。因此输入、仓库证据、交付或产物检查失败都不会启动浏览器。只有当前 provenance 验证后才加载产物。浏览器门禁保留所有视口、主题和稳定性检查；完成或浏览器阶段失败时关闭浏览器。完整阶段回执记录 `execution: "in-process"` 和等价的单独 `command`，以便重放。Chrome 启动不再与前阶段重叠，因此成功运行可能稍慢。这避免对非法候选进行无用启动；它不解决宿主对 Chrome 启动的沙箱限制，也不放宽浏览器门禁。

成对提交可恢复，并不声称两个文件系统路径会原子变化，或断电后仍持久。journal 完结属于该提交的一部分：验证或移除 journal 时捕获的失败，会在可能且所有权仍有效时回滚被替换文件。所有权丢失时，旧尝试立即停止重命名、回滚、完结 journal、记录失败 provenance 或清理共享路径。任何私有暂存或可恢复备份仍保留，并由失败诊断指出。其他原因导致恢复失败时，失败回执同样指出保留的备份。进程中断可能留下 journal、备份或私有暂存；检查器随后拒绝继续。按报告的恢复证据处理，再对同一输出串行重跑 `deliver`。失败尝试非零退出，绝不调用打开器，也绝不授权收集视觉证据。

独占创建成功但锁初始化失败时，Archify 只有在能力仍标识该确切条目的情况下，才能记录失败 provenance 并移除未完成锁。替换条目会被保留。文件系统和清理错误，与活动并发交付分开报告。活动、过期、无法识别或因其他原因保留的锁，都会独立阻止检查器接受旧产物。重试前修复报告的文件系统错误；锁路径包含无关数据时，使用另一个物理输出目录。

释放锁属于交付完成的一部分。如果产物／provenance 对已经提交、journal 已完结，但匹配锁无法移除，`deliver` 以 `delivery/lock-release` 退出 1，保留锁，不打印成功回执，也不调用打开器。保留锁让严格检查器拒绝继续。只有成对提交、journal 完结和释放锁全部成功后，`deliver` 才能零退出、打印成功回执或执行 `--open`。

`deliver` 零退出后运行严格 `check`；只有严格 check 零退出后，才运行 `browser-check` 或可选 `visual-check`。失败标记、恢复 journal 或交付锁，会使每个检查器在接受保留的 HTML 前失败；报告诊断，完成成功的恢复交付，然后才能收集新浏览器证据。

静态 `check` 对受检关系与结构框使用相同 SVG 路径分析，支持 `M/L/H/V/Q/Z`、对应小写相对形式、重复参数和有限数。每个 `M` 开始独立子路径；`Z` 只关闭当前子路径。独立子路径不会产生图中不存在的连接段。被非共线 `Q` 分开的直段，在路由分析中也保持独立；曲线采样点不会成为直线路由预算或节奏检查中的微线段。线段长度和伸长率按每个连续片段测量，真实弯折数则按关系汇总。超过预算的关系只计一次，内部片段边界不享有只给语义端点的短共享主干例外。

这不代表支持完整 SVG 命令：`A/C/S/T` 产生 `artifact/svg-path-unsupported`；缺参数、非法数字和其他语法错误产生 `artifact/svg-path-malformed`。检查器非零退出，不跳过坏路径，也不无限等待。路径失败增加 `svg_path_data` 检查；普通合法产物保留现有九项检查。诊断包含受检 `pathIndex`、`role`、可用的关系／框 `id`、解析 `tokenOffset`、可用 `command` 和 `reason`，方便定位修复生成来源。`pathIndex` 从一开始；`tokenOffset` 是数字字符引用解码后 `d` 中从零开始的 UTF-16 偏移。注释、CDATA 和属性文字中的伪标签会被忽略。静态路径检查通过，不能证明浏览器或感知视觉验收通过。

<details>
<summary>中文说明</summary>

静态 `check` 对受检关系线和结构边界的 SVG 路径使用同一解析结果，支持
`M/L/H/V/Q/Z` 及其小写相对形式、重复参数和有限数值。每个 `M` 开始独立
子路径，`Z` 只闭合当前子路径；子路径之间不会被拼接成图中不存在的线段。
非共线 `Q` 前后的直线也保持分离，不会把曲线采样点计为直线路由预算或
节奏检查中的微线段。线段长度和伸长率按连续片段测量，真实转弯数汇总到原关系；超预算关系
只计一次，内部子路径断点不享有语义起终点的短共享线例外。
这不是完整 SVG 命令集的支持承诺：`A/C/S/T` 返回
`artifact/svg-path-unsupported`；缺少参数、非法数值等格式错误返回
`artifact/svg-path-malformed`，检查以非零状态结束，不跳过坏路径或无限等待。
路径失败时追加 `svg_path_data` 检查；普通有效产物仍保留原来的 9 项检查。
诊断携带受检路径的 `pathIndex`、`role`、可用的关系/边界 `id`，以及解析位置
`tokenOffset`、可用的 `command` 和 `reason`，用于定位并修复生成路径的来源。
`pathIndex` 从 1 开始；`tokenOffset` 是数字字符引用解码后的 `d` 字符串中
从 0 开始的 UTF-16 位置。注释、CDATA 和属性文本中的伪标签不参与检查。
静态路径检查通过仍不代表浏览器或感知视觉验收通过。

</details>

交付接口暴露四个独立主张：

1. `deliver` 证明确定性产物检查和字节身份。
2. `browser-check` 从确切产物收集必需的自动化浏览器证据，不捕获图片。
3. `visual-check` 可选地增加与产物绑定的截图和联系表。
4. 感知视觉审阅记录人类或具备图像能力的审阅者判断。

一项通过绝不暗示其他项通过。绝不声称确定性回执包含浏览器或感知审阅证据。

<a id="recovering-a-failed-comparison"></a>

## 恢复失败的比较

`compare` 将 HTML 产物和 JSON 回执成对提交。该提交失败时，会尝试恢复先前文件。完整回滚像普通情况一样移除临时目录。

先前文件无法恢复时，compare 以 `delta/commit-rollback-failed` 非零退出，并保留恢复目录。JSON 失败回执中的 `diagnostics[].evidence.recoveryDirectory` 指出该目录，`recoveryFiles` 为恢复失败文件列出 `{ backup, target }` 路径。人类可读诊断也打印恢复路径。

解决文件系统错误、检查当前目标，将列出的每份备份恢复到对应目标后再重试。两个旧文件全部恢复并验证之前，保留恢复目录；其中也可能有被拒绝的候选文件，不要误当备份。成功比较和提交前失败保留普通清理行为。

<a id="automated-browser-evidence"></a>

## 自动化浏览器证据

`finalize` 对确切可信 HTML 运行必需浏览器门禁，不重新渲染或修改它。针对性诊断时，等价单独命令为：

```bash
node bin/archify.mjs browser-check <output.html> --json --require-provenance
```

该无依赖命令通过 DevTools pipe 使用 Chrome／Chromium（或 Microsoft Edge）。设置 `ARCHIFY_CHROME` 时，它具有权威性，即使路径无效也一样：Archify 不会静默回退到其他浏览器。Windows 自动发现先检查所有 Chrome／Chromium 安装位置和 PATH 命令，再检查 `%ProgramFiles(x86)%`、`%ProgramFiles%`、`%LocalAppData%` 下的 Edge，最后检查 PATH 中的 `msedge`。macOS 和 Linux 同样先检查 Chrome／Chromium，再检查 Edge 应用包（macOS）和 PATH 中的 `microsoft-edge`／`microsoft-edge-stable`。它在 1440×900、1600×1000、1920×1080、2048×1320 测量浅色主题容纳性，并在四个视口都验证请求的浅色主题，在两个端点视口验证深色主题，以及 READ／Still 运行状态。请求主题解析成其他主题时，以实测证据失败。它创建一个 `<output-stem>.browser-check.json` 回执，不创建截图或联系表。传入 `--out-dir <dir>`，将回执放在独立证据目录。回执绑定产物 SHA-256 和字节数，标识 `evidenceKind: "automated-browser"`，并报告 `visualReview: "not-requested"`。

横向溢出始终失败。普通文档级纵向滚动，只有具备渲染器声明契约且实测文字可读时才接受。自动画布声明 `data-reader-fit="intrinsic-height"`（按高度适配），或 `data-reader-fit="width-first"`（Sequence 和 Waterfall 阅读宽度）；其自适应阅读器必须达到可读宽度，并暴露 `data-reader-overflow="authored"`。显式 `meta.viewBox` 的 Architecture 则声明 `data-diagram-type="architecture"` 和 `data-reader-fit="authored-height"`：SVG 坐标、纵横比和现有阅读器宽度行为不变。完整 SVG 必须位于图表面板内部，没有内部滚动或裁切，文档必须允许纵向滚动。回执记录 `verticalScrollAccepted: true` 和 `overflowDisposition: "readable-vertical-scroll"`。声明缺失或未知、其他模式中的显式 viewBox、文字不可读、横向溢出、裁切和查看器界面碰撞仍然失败。不要增加内部图表滚动器，也不要隐藏溢出。

交接中的 `browser_evidence` 只记录该自动命令的结果：

- `passed` 对应退出 0，且回执 `status: "pass"`，所有必需测量都已完成并通过。
- `failed` 对应退出 1，且回执 `status: "fail"`，检查发现缺陷、命令失败，或运行时错误使证据不完整。
- `skipped` 只对应退出 2，且回执 `status: "skipped"`，没有可用的受支持浏览器，因此检查未运行。

运行时失败留下不完整证据，不能规范化为 `skipped`。它们不否定已经成功的确定性交付。可行时，在能运行浏览器的执行环境重试环境失败。除非失败能在具备能力的环境中通过该传输接入点复现，否则保持包内传输不变。

Windows 上，Chrome／Edge 启动时重新拉起进程，可能在任何响应抵达前丢失继承的 DevTools pipe。Archify 仅从浏览器子进程环境移除独立的 `__COMPAT_LAYER=DetectorsAppHealth`（名称和值均不区分大小写）；父环境、未知层、组合层和与权限相关的兼容设置不变。它针对报告中的非提权 Git Bash app-health 情况，不覆盖所有 AppCompat 模式。提权 shell 重新拉起仍不受支持：从正常打开、非提权且不位于提权或兼容模式父进程中的 PowerShell 重跑。Archify 不压制浏览器降权，也不通过禁用沙箱来绕过重新拉起问题。零响应启动诊断会建议该办法，但不声称每个 pipe 失败都由提权或 AppCompat 引起。

provenance 失败在浏览器检查前退出，并持久化绑定本次尝试产物的失败 browser-check 回执。如果该失败回执
无法写入，诊断会指出该不完整证据。

两个浏览器命令都检查确切的已交付 HTML，不修改或重新渲染它。

<a id="sequence-width-review"></a>

## 时序图宽度审阅

通过的 `finalize` 可报告 `layoutReviewRecommendation.action: "inspect-sequence-width"`。其 `evidence` 在计入消息标签、note 和 segment 标题后，测量固定参与者列右侧未用空间。该建议不增加警告、失败、截图要求或自动几何变更。

通过的 `validate --json`、`deliver` 或 `finalize` 回执，可能在 `diagnostics[]` 中携带 `severity: "warning"` 的查看器 locale 回退（`i18n/*`）。它们不使任何门禁失败。产物应完全本地化时，按 `evidence` 修复列出的键，并重跑 `finalize`。

省略 `meta.column_fit` 的 Sequence 画布使用 `spread`，无论是否提供 `meta.viewBox`。作者指定 viewBox 保持权威；参与者容量不可行时失败，不静默扩大。显式 `meta.column_fit: "fixed"` 保留历史固定列。候选仍有固定列宽度建议时，先确认固定几何是否有意。只有已授权改变该几何时，保存候选，仅将 `meta.column_fit` 改为 `"spread"`，再使用 `--out-dir <folder>/width-review` 完整运行一次 `finalize`。保留参与者顺序、消息及其 y 位置、标签、note、来源和画布尺寸。该尝试失败时，恢复候选，并以 `--out-dir <folder>/width-restore` finalize；报告剩余布局建议，不继续迭代。无改变授权时，保留有意固定几何并披露建议。对旧的省略 fit 输入，如要保留历史固定坐标，应显式设置 `meta.column_fit: "fixed"`。该审阅关注横向构图；通过回执仍不声称感知认可。

<a id="optional-capture-evidence"></a>

## 可选截图证据

用户请求或升级为感知审阅时，`visual-check` 保持向后兼容：

```bash
node bin/archify.mjs visual-check <output.html> --summary --require-provenance
```

`--summary` 返回精简 JSON，包含全部诊断，以及完整回执、联系表和每张截图的绝对路径。选择视觉审阅后，检查相关截图；捕获成功不等于感知认可。`--json` 为现有消费者保留完整回执输出。两模式运行相同检查，保持相同退出状态。发布后清理失败时，summary 保留最终失败诊断和 `publication` 恢复细节；链接的回执记录先前已提交证据。

它执行相同的自动浏览器测量，在 1440×900 和 2048×1320 捕获浅／深色截图，写入四个视口 PNG sidecar、一个使用相对路径的 HTML 联系表，以及一个 JSON 回执。`--out-dir <dir>` 将全部 sidecar 一起移动。用浏览器打开 HTML 联系表，或使用图像阅读器检查视口 PNG。回执报告 `visualReview: "pending"`，因为截图自身不作感知判断。捕获与 provenance 失败遵循下方所有权规则。

回执、联系表和四张 PNG 构成一组有所有权的证据。捕获前，`visual-check` 冻结每个请求目录条目、规范写入槽位和物理父目录，以及目标的缺失／文件状态、类型、设备／inode 身份和 mode。硬链接证据目标不是安全写入目标。所有候选文件都通过独占创建，放在物理证据目录之下一个随机、私有暂存目录中；回执最后发布。每个暂存候选发布前必须恰好只有一个硬链接名称。不覆盖的发布链接暂时使暂存名与最终名的链接计数为二；解除已经验证的暂存名链接后，最终条目的链接计数必须为一。意外外部硬链接会使操作拒绝继续，其别名绝不移除。

Chrome 检查捕获产物的一份已核对身份和内容的副本，该副本位于本地私有临时目录，因此浏览器文件加载不依赖 UNC 或长路径支持。六个发布候选仍位于证据卷。两个临时目录的清理都不递归删除未知内容；保留条目会附恢复位置。

提交任何内容之前，`visual-check` 立即重新解析并验证完整六路径集合。原本缺失路径出现占有者、现有路径被替换、符号链接或悬空链接重新定向、父目录拓扑改变、硬链接或身份不确定，均以 `viewer/evidence-path-conflict` 拒绝继续。占有者和所有其他最终证据路径均保持未触碰。清理只在重新核对捕获身份后，移除本次运行的暂存或发布条目；改变或未知的条目会保留。

只有普通 `visual-check` 回执证明同一产物和证据目录的所有权，而且其精确 sidecar 清单匹配每个已有联系表或 PNG 的字节数与 SHA-256，才能替换已有视觉证据集合。缺失、格式错误、未知、不匹配或不完整的所有权记录，绝不授权删除。失败和跳过的运行，只有所有权证明成功时，才能作为同一已验证事务的一部分退役旧截图／联系表；否则保留全部未知证据，并报告 `viewer/evidence-path-conflict`。

Chrome 不可用，或浏览器检查前 provenance 失败时，同样应用该规则：任何路径都不能盲目删除看起来过时的证据。已验证且有所有权的集合，可以在发布 skipped 或 failed 回执前以可恢复方式退役；无所有权证据保持完整。这些结果不否定已成功的确定性交付，也不会把感知视觉审阅变成通过或失败。可行时，在具备浏览器能力的执行环境，通过受支持命令重试环境失败。除非失败能在具备能力的环境中通过该接入点复现，否则保持随包传输不变。

`browser-check` 对单个 JSON 回执应用相同私有快照、身份、所有权和不覆盖规则。其命名空间与 `visual-check` 分开，因此只重跑浏览器检查不能移除截图证据。

<a id="a-new-candidate-at-an-existing-output-path"></a>

## 在已有输出路径使用新候选文件

浏览器证据属于确切产物字节。编辑一个先前 HTML 已有浏览器证据的候选后，在下次 `finalize` 前选择新的证据目录；这样能保留旧回执与截图，避免可预防的所有权冲突重试。`--out-dir` 移动新的 browser-check 回执，以及默认的 finalize 回执和 summary。显式 `--receipt` 覆盖 finalize 回执路径；summary 跟随该路径。成功交付仍重写请求的 HTML 和相邻 `*.delivery.json`。早先浏览器或视觉证据仍绑定原始产物字节，不能当作修改后 HTML 的证据：

```bash
node bin/archify.mjs finalize architecture candidate.json diagram.html --quality showcase --repo-root <root> --out-dir diagram.review-2 --json
node bin/archify.mjs visual-check diagram.html --out-dir diagram.review-2 --summary --require-provenance
```

证据目录不是 HTML 归档。只把 HTML 复制进去，不会重新绑定回执路径或 provenance。需要历史快照时，在覆盖前分别保存候选与产物；不要假设复制的回执能验证搬移后的产物。

保持请求 HTML 路径稳定。每个改变的候选使用新修订目录，相同字节重试则保留原目录。没有仓库证据的图表省略 `--repo-root`。让命令创建其输出目录。先前校验失败且未产生 HTML 或浏览器证据时，不需要新目录。绝不为让重试通过而移除未知证据。

<a id="optional-opening"></a>

## 可选打开

只有用户需要立即本地预览时，才添加 `--open`。它在验证后的成对提交完成、恢复 journal 已移除、交付锁成功释放之后运行。使用一次参数数组形式的操作系统打开器；macOS 和 Linux 限时五秒，Windows 的 PowerShell 启动限时十五秒。回执记录 `open.status`；启动失败或不可用还包含规范化 `open.failure` 细节。CI、无人值守 agent 和非交互环境保持关闭。打开失败或不受支持，不否定交付；其状态只证明本地打开器调用是否成功。

<a id="last-good-live-preview"></a>

## 保留最近成功结果的实时预览

仅用于主动桌面创作循环：

```bash
node bin/archify.mjs preview <type> <input>.json <output>.html --quality showcase
```

Preview 在 loopback 上监视一个显式输入，将每个稳定摘要绑定到私有快照，只有现有验证交付流水线通过后才推进。输入非法、只写了一半、被删除或被后续版本取代时，屏幕与磁盘都保留先前已验证修订。相同字节不重新构建或加载。

预览运行时随无依赖 Skill ZIP 发布，必须在没有 `node_modules` 时也能工作。

绝不默认启动。不要用于 CI、无人值守 agent、远程分享或移动使用。`--no-open` 仅适用于用户会自行打开打印出的本地 URL，或循环测试。交接前以 Ctrl-C 停止。第一次 Ctrl-C 排空当前交付但不发布它；第二次 Ctrl-C 强制关闭交付进程与 HTTP 连接，包括未完成请求。关闭保留最近一次已验证产物，只移除能验证所有权的暂存文件。如果交付在回执抵达 Preview 前中断，未经确认的文件和恢复材料可能仍留在私有暂存目录；关闭不会递归删除未知内容。服务器状态、端口、源路径、诊断、错误文字和重载 token，绝不能进入生成产物或任何导出。

<a id="perceptual-review"></a>

## 感知审阅

自动化路径以确定性浏览器门禁结束，报告 `visual_review: not_requested`。普通生成不要求截图或读取图片步骤，新创作或重新摆放的 Architecture 也一样。感知审阅是可选的；明确请求或具体视觉调查时使用。可能原因包括：

- 精简 finalizer 包含关于交叉或绕路的 `visualReviewRecommendation`（建议，不是交付门禁）；
- 用户明确请求美感或视觉审阅；
- 模板、渲染器或查看器变更需要视觉回归证据；
- 新颖布局或浏览器诊断使信心不足；
- 此次运行被选入抽样审计或内部试用。

默认独立桌面查看器测量 1440×900、1600×1000、1920×1080 和 2048×1320。每个检查尺寸都要求 `document.documentElement.scrollWidth <= window.innerWidth`。优先 `scrollHeight <= window.innerHeight`；只有通过上方阅读器声明的可读例外，才接受页面级纵向滚动。在最大检查视口，检查渲染构图是否有显眼的底部空白带：主面板和必要结论卡片应均衡地利用可用高度，而不是坍缩为浅横条。出现意外溢出时，先通过只删除确实冗余内容或压缩间距来修复作者构图，再考虑缩小节点、标签或主面板。不要隐藏溢出、裁切内容、引入内部图表滚动器，或降低节点／标签字号以通过测量。窄屏／移动容纳性可保留页面纵向滚动。

升级审阅时，对当前 finalize 后的产物运行 `visual-check`，由具备能力的图像阅读器或人类检查联系表，检查两个端点主题、默认 READ 视图、线条交叉／通道、标签遮罩、节点／卡片适配、聚焦／搜索／passport 的关闭，以及导出洁净度。该审阅是补充，绝不改变 `browser_evidence`。无约束的浏览器一瞥只能支持感知审阅。

诊断或结构化交接中，报告一个真实的可选审阅状态：

- `visual_review: not_requested` — 没有审阅触发条件；不构成视觉验收主张。
- `visual_review: passed` — 只有检查过渲染产物之后才能使用。
- `visual_review: skipped (image reader unavailable)` — 已请求或触发的审阅无法运行。
- `visual_review: failed` — 附具体可见缺陷。

升级审阅使用 `correction_rounds: 0`、`correction_rounds: 1` 或 `correction_rounds: 2`；针对性修正绝不超过两轮。未请求审阅时，使用 `correction_rounds: 0`。没有检查产物，绝不报告 `visual_review: passed`。感知审阅改变候选后，重跑 `finalize`，因为先前 specification 和 artifact 回执已不再是当前版本。

<a id="handoff-receipt"></a>

## 交接回执

用户请求诊断或结构化交接时，从已有回执推导下列细节。普通面向用户的回复遵循[输出](../SKILL.md#output)；本检查清单不是默认聊天回复。

```text
diagram_type: <actual diagram type>
output: /absolute/path/to/file.html
specification_sha256: <receipt value>
artifact_sha256: <receipt value>
validation: <actual quality profile, check counts, errors, and warnings>
browser_evidence: passed|failed|skipped
visual_review: not_requested|passed|skipped (image reader unavailable)|failed
correction_rounds: 0|1|2
```

仅从最新、绑定产物的 `browser-check` 回执推导 `browser_evidence`，通常是 `finalize` 内嵌的阶段。可选截图或手动浏览器工作单独记录其产物绑定、视口／主题范围与观察；绝不以它或 `visual_review` 覆盖自动状态。

打开、预览状态、Share Cards 和其他查看器导出都不是验证主张。

Finalize 回执发布使用上述相同的身份绑定、不覆盖发布器与显式恢复记录。完整回执和 summary 必须与候选、产物、交付元数据和浏览器回执不同。目标必须不存在，或是单链接普通文件；符号链接回执条目与硬链接目标拒绝继续。迟到占有者或父目录变化会停止发布，并保持其未触碰。默认回执名共享物理产物命名空间，受宿主文件名限制约束。两份回执分别发布，不是抗崩溃的原子对；只有完整通过的命令才是成功交接。
