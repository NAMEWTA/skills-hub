# 开发协作与证据产物实施计划

目标：dev 和 system 运行原件不进 Git。每张 task 只保留一份同名 Markdown 验收报告，整体验收完成后才写总报告。本次只实施 02–04。协作规则 01 是独立需求，不纳入本次实施和验收。旧证据不扫描、不迁移、不提供兼容，由使用者自行处理。

策划基线为 skills-hub `d6b7d32`。此前对 36 个 dev、6 个 system 入口及其包内资源和写入点的静态核对见[审查清单](evidence-audit.md)。当前行为以[持久化契约](../../../../docs/reference/persistence-roots.md)和实际代码为准。

| 票据 | 交付摘要 | 实施依赖 |
| --- | --- | --- |
| [01 由用户或项目指令指定协作规则](tasks/01-user-selected-collaboration.md) | 保留明确选择与普通项目规则，不让阶段技能自动选组 | 独立，不纳入本轮证据重构 |
| [02 统一开发取证与报告](tasks/02-on-demand-evidence.md) | 改 dev 的入口、模板、实际工具与消费者；每票一份报告，整体验收后汇总 | 无，可与 03 并行；隔离安装联验依赖 03 |
| [03 安装时忽略项目根 temp](tasks/03-initialize-temp-ignore.md) | 统一初始化、托管导航、CLI 和发行验收，保持安装事务及旧资料 | 无 |
| [04 统一系统取证与 Herdr 交接](tasks/04-system-evidence.md) | 改系统六包及 Herdr 协作说明，执行派发不生成重复验收报告 | 无，可与 03 并行；隔离安装联验依赖 03 |

实施先固定下方路径和报告归属，优先完成 03 的公共安装边界。02 和 04 可并行，不共享技能文件；在同一个隔离消费项目做最终联验。安装规则和新写入点同版交付，避免新项目还用旧写入点却没有旧忽略规则。出票即创建同名报告，尚无实测写「未验证」。Change 总报告只在 02–04 联验达到交付点后写。

## 策划阶段取证（仅作历史背景）

### 协作规则为什么到处出现

[dev-build 第 32 行](../../../../skills/dev/dev-build/SKILL.md#L32)和 [dev-review 第 14 行](../../../../skills/dev/dev-review/SKILL.md#L14)不仅重复说明，还把文件路径或规则组选择交给阶段技能。`dev-workflow`、`dev-parallel`、`dev-program` 和 `dev-deploy` 有相似引用，单删两个入口仍会在编排、批次或交付时重新引入。提交 `1bd0fdc` 随 0.1.16 引入了保存、项目默认和单任务覆盖的做法，[当次验证记录](../2026-11-18-dev-cooperation-rules/verification.md)保留了历史场景。

Huhu 根 `AGENTS.md:3–5` 已有项目自己的选择规则：用户明确选用规则组才读 `.agents/dev/context/model-roles.md`，否则沿用当前会话与工具。Huhu 的 `2026-11-19-huhu-issues-3-10/program.md:48` 则记录该批次明确选用了 Herdr Core 和团队角色。这是目标项目选择协作方式的实例，不要求通用技能再声明一次。保留配置方法与已明确的协作约束，删除执行入口里的指定路径与自动兜底。

### Huhu Mail 的证据从哪里来

样本：`D:/Document/code/huhu/.agents/dev/changes/2026-11-19-issue-8-mail-module/evidence/`。在检查版本下，Git 跟踪 12 份 Markdown、12 张 PNG 和 1 个 TypeScript 渲染探针。主检出中的文件可以按下表追溯，不依赖目录时间戳。

| 查到的内容 | 可以确认的来源 |
| --- | --- |
| `evidence/` 最早出现 | Huhu 提交 `eb4d1ba7` 首次加入 `S0.1-source-baseline.md`，记录上游源码、行为和许可范围；`0cda9b40` 随后加入 `S0.2-transport-probe.md`。批次 `progress.md:16` 引用两份记录。这两份文件先于 UI 截图。未查到决定最初目录命名的完整执行会话。 |
| `S1-workbench.md`、两张首批截图和渲染探针 | Herdr Core 主题 `2026-11-20-huhu-issues-3-10-implementation` 下的 `t17c/task01.md:11` 允许实施者写 Mail 和 #8 证据；`t17c/report01.md:5,18` 确认写入候选提交 `20567cc2`。Huhu 当前分支上对应的新增提交为 `48ffa5e0`。实际截图由本项目 `workbench-renderer.test.ts` 在设置 `HUHU_MAIL_PROOF_SCREENSHOTS` 时写入指定目录，脚本未把 `evidence/` 写死。 |
| skills-hub 中明确要求此目录名的指令 | `d6b7d32:skills/dev/dev-plan/references/multiphase-plan.md:98` 要求把截图存入 `evidence/<task-id>/<scenario>/<slug>.png`。Huhu 安装副本相同规则在第 88 行。实际样本将截图集中在 `evidence/S1-workbench/`，并未逐项照搬模板；不能把模板存在当成首个 Markdown 的直接创建证据。 |
| 验证方法与安装行为 | 基线 `d6b7d32` 的 `dev-verify` 要求保存 `evidence.md` 和被引用的产物，未指定附件目录名。`dev-build` 要求记录实施进度和证据，也没有该目录硬约定。[初始化模块](../../../../scripts/init-persistence.mjs)只规划领域导航及 `.gitignore`，不创建具体 change 的证据目录。 |

因此，若问“哪个技能写死了 `evidence/`”，答案是 `dev-plan` 的多阶段模板；若问“是谁实际写了这个样本”，Git 能确认先有 S0 调研与探针记录，后有 Huhu 实施者及验证脚本按任务保存和扩充。不能把整个目录归给一次 `dev-verify` 调用，也不应从通用技能的调整推导出可以删除旧证据。`S1-workbench.md` 的重跑步骤和其他票据仍引用该目录。Huhu 未在本轮重构中读取或改动。

## 路径与生命周期

路径从运行本次任务的目标项目根算起，不从技能目录、调用工具时的当前目录或独立 worker worktree 推导。跨 worktree 由负责人指定对应项目根；跨挂载核对真实读写位置。纯查询或不需要留存的输出可直接返回，不为了格式创建目录或空报告。

| 内容 | 位置 | 何时写 |
| --- | --- | --- |
| 开发 task 的运行原件 | `temp/dev/<change-id>/tasks/<task-stem>/<run-id>/` | 需要留下实际输出时。重跑和并发都使用新的运行目录，不覆盖原件 |
| 开发 Change 的组合取证 | `temp/dev/<change-id>/integration/<run-id>/` | 在组合版本上运行时，与实施票据的目录分开 |
| 系统运行原件 | `temp/system/hosts/<host>/<change-id-or-topic>/<run-id>/`；Herdr 本身的取证用 `temp/system/<herdr-or-herdr-core>/<topic>/<执行者目录>/<派发 task-stem>/<run-id>/` | 按本次采集内容分类。Herdr 派发的开发测试原件仍用 `temp/dev/` |
| task Markdown 验收 | `<change>/evidences/<task 文件名>` | 新建 task 时同时建普通 `.md` 报告，未验证写明。两目录的 `.md` 完整文件名（含大小写）一一对应，`evidences/` 不含任何其他目录、链接或文件。失败、阻塞、接手、补测都更新同一份 |
| Change 总验收 | `<change>/evidence.md` | 达到本次约定的最终交付点、核对实际整合版本后由 Change 负责人写唯一总报告 |

- `<task-stem>` 是原票文件名去掉 `.md`。以 `tasks/S2.5-reply-forward.md` 为例，失败与复验都写 `evidences/S2.5-reply-forward.md`，不能写 `evidences/S2.5.md`、`*-retry.md` 或按日期另建。临时路径包含运行标识，便于回读，也不随 Change 归档搬动。不要为每次验证另开号。
- 任务报告包含验收项、实际版本或工作树、环境与输入、已执行命令或用户操作、退出结果、关键观察、未覆盖范围与可重跑步骤。保留影响判断的旧失败和替代关系。引用原件时标明项目根相对路径、用途和本机可用性，不把临时文件作为克隆后必定可读的 Markdown 链接。需要打开的证据读不到就记录缺口，不据此验收。
- 每票有一位报告写入者。审查、调试、性能、UI 和形式验证共用原票及其报告。`progress.md`、`review.md`、交接、设计、PR 和批次可以写其本职的状态、决定或意见，验收详情只引用权威报告。总报告给出组合场景、实际结果、交付版本、已接受的限制，并索引各票报告。未满足必要门禁不写总报告；组合验收失败先在现有进展中记阻碍和运行指针，定位到任务后更新相应报告。明确否决的 Change 记否决依据，不冒充验收通过。
- 报告和原件按用途而非扩展名区分。工具生成的 `report.md`、日志、JSON、PNG、录像、HAR、采样、状态库和图均是原件。确认原型全量资源、可复用的测试、夹具及模型、正式发布制品、服务原生数据和受保护的恢复备份仍用各自位置。手写对照验收结论放票据报告，已确认的设计版本和用户决定仍由设计记录保存。
- 项目中独立系统工作需要持久验收时，复用已有系统 Change，或在实际主机资料 `.agents/system/<host>/changes/<change-id>/` 建真实任务。只读单次咨询不用新造 Change。Herdr `taskNN.md` 是派发单，`reportNN.md` 保留发布和回收所需的回执与指针，不是第二份持久验收。重派可换编号，原业务 task 和验收报告不变。详见 [04](tasks/04-system-evidence.md)。
- 根 `/temp/` 忽略未跟踪的目录，而非访问控制、备份或清理许可。按需采集并脱敏，不保留凭据。必须跨机回读时沿用已授权的私有共享或制品交接，不把附件转存到 Git。验收与接手后按项目保留期处理；不清空整个 `temp/`。

## 升级边界

新规则仅用于新版新建的记录。安装器只更新选中技能、托管导航和忽略条目，不扫描、迁移或兼容任何旧证据，不移除项目已有规则，不动业务文件和 Git 索引。既有项目生成的验证技能、本地适配器和在途 Herdr 派发均不处理。

## 实施后的验收

1. **安装边界。** 用隔离 Git 项目验证单装 dev、单装 system、混装、仅 ops、仅独立上游、重复安装、预览、升级与写入失败回滚。创建代表性文件，用 `git check-ignore -v` 核对两域原件确实被忽略，并用 `git ls-files` 区分已有跟踪文件。报告、派发记录、原型和测试仍可跟踪；根规则不新增对 `src/temp/` 的忽略。保留 BOM、换行和项目原规则。用真实 tarball 重做关键路径。
2. **同一票失败、接续、重验。** 实际安装后用一张含稳定文件名的票，先产生失败观察，再补测。文件树中只有一份同名 `evidences/` 报告，两轮需要留存的原件位于不同运行目录。另一条轻量验证不产生附件。组合验收之前无总报告，达到约定终点才写一份。只取 Git 文件的副本仍可阅读结论和重跑，不因缺本地附件丢掉验收事实。
3. **真实写入点。** 从项目子目录或独立 worktree 调用安装后的工具，检查输出参数确实指向目标项目的 `temp/`，没有写到模型旁、技能安装目录或任意当前目录。覆盖失败、退出码、不覆盖、并发和信号清理。用回放或工具夹具验证输出契约；真实 TLC、Pele 或浏览器缺失则注明哪些行为未验。
4. **Herdr 接续。** 对两套模板各走一轮失败或返工，读取同号回执、重派到新编号并更新原业务报告。覆盖带空格主题、已编码的 Core 地址、不同挂载、必需附件不可读、迟到和重复提示。未完成正式验收不得标记 `done` 或提前回收。用实际 Herdr/远端环境核验终端和挂载行为；模拟夹具仅验证路径及文件交互。
5. **仓库门禁。** 按[验证指南](../../../../docs/maintenance/validation.md)运行 `npm run check:full`（包含 `check` 的静态检查）、`npm run check:statechart` 和 `npm run check:package`。复扫审查清单中的旧写入默认值，核对包内资源可达及入口预算，保留历史引用。记录真实命令、版本、结果和缺口，不以模板检查代替实际运行。

验收入口：[整体验收](evidence.md)、[02](evidences/02-on-demand-evidence.md)、[03](evidences/03-initialize-temp-ignore.md)、[04](evidences/04-system-evidence.md)。[01](evidences/01-user-selected-collaboration.md) 仅保留未验证状态，不作为本次门禁。
