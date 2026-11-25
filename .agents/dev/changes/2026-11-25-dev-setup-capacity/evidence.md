# dev-setup 容量评估整体验收

状态：已完成。2026-11-25 16:52:32（Asia/Taipei），[PR #19](https://github.com/NAMEWTA/skills-hub/pull/19) 已合并至 main；PR 与 [Issue #18](https://github.com/NAMEWTA/skills-hub/issues/18) 均已关闭，Issue 关闭原因为 completed。

用户授权和行为契约见 [brief](brief.md)，任务状态见 [plan](plan.md)。本报告在实施、验证、合并和关闭均实际完成后补记，不把远端排队或提交分支视为交付完成。

## 交付结果

- `dev-setup` 默认只读核验项目和实际执行环境，环境报告先给包含 Lead 的 Agent 建议总数、当前可新增数、重任务及内部 worker、指定状态的 worktree 保留容量。
- 容量方法使用有效 CPU/内存/磁盘及适用限额，结合完整进程树、共享资源池和项目负载计算同一组合的增量预算；保留已占用与未兑现预留、容器祖先和小数配额、运行时/API 作用域及未知边界。
- 当前观察、已经验证的运行规模、条件估算、推荐并发与实际极限分别表达。仅观察到一个 Lead 不再推导为机器最多只能运行一个 Agent；任务计划新增 0 也不替代资源可新增额度。
- 有界校准、压力退让、恢复、刷新和实际回收沿现有方法执行。task/session 接续、显式团队配置及 worktree 生命周期职责保持；各阶段继续直接复用有效环境事实。

现行用法见[环境指南](../../../../docs/development/environment.md)，完整入口及参考见 [dev-setup](../../../../skills/dev/dev-setup/SKILL.md)。实际改动为 8 个既有产品/文档文件及本 Change 的任务、证据记录；没有新增执行工具、依赖、常驻调度系统或版本发布。

## 逐项证据

| 任务 | 验收结果与原件入口 |
| --- | --- |
| 01 容量方法与输出 | [同名报告](evidences/01-capacity-method.md)：独立自然场景、真实只读使用、核心文件哈希和 F1 修复复验。 |
| 02 文档与消费边界 | [同名报告](evidences/02-docs-consumers.md)：环境指南、自然语言帮助、来源与消费者职责核对。 |
| 03 验证与远端交付 | [同名报告](evidences/03-verify-deliver.md)：Issue 的 21 条契约逐项映射，本地门禁、两轮准确 CI 与合并/关闭回读。 |

三个独立新上下文分别覆盖混合负载、容器未知限制、压力与恢复。独立审查发现首表混淆任务需要与资源额度，修复三处指引后以同一输入重新执行，原审查者读取新报告确认关闭 F1。真实隔离项目仅写入环境报告，没有执行负载或创建 worktree；最终包隔离安装与重复安装的 7 个文件逐字节一致。

合成算例和实际执行器观测分别保存。没有把工具的 Agent 槽位、容器外物理总量或当前会话数当成用户主机的硬件容量。

## 最终源码与门禁

最终 PR head：`d19a6bcd57ca1b79c8587e04e15fb9dd4e4e0a15`。实际 squash 合并提交为 [`83ee08cd53af8aa075fe88725d77341995b48c73`](https://github.com/NAMEWTA/skills-hub/commit/83ee08cd53af8aa075fe88725d77341995b48c73)，文件树为 `2c99f05aa0d489cee1e2443194edc1532dc868ac`，与三平台 CI 的实际 checkout 树相同。

[最终 PR CI 45579634296](https://github.com/NAMEWTA/skills-hub/actions/runs/45579634296) 首次 attempt 全部成功：

| 平台 | 测试总数 | 通过 | 失败 | 平台跳过 |
| --- | ---: | ---: | ---: | ---: |
| Linux / Node 22.14.0 | 483 | 482 | 0 | 1 |
| macOS Intel / Node 24.19.0 | 483 | 482 | 0 | 1 |
| Windows / Node 24.22.3 | 483 | 479 | 0 | 4 |

Linux/macOS 跳过 Windows 专属 EPERM 交互用例，Windows 实际执行该用例；Windows 跳过三项 POSIX 可执行位及一项特殊文件/套接字用例。三平台均通过 33 项捕获状态回放和实际 npm tarball 的 63 技能/1092 文件消费验证。Linux 另通过真实 Archify browser-check 与官方 Claude 63 技能发现/121 资源读取；后者零用户回合，不作为模型推理验证。

本地包消费安装的 registry E403 原样保留，正式消费验证由精确组合 CI 完成。首轮 481 项测试对应早期基准，最终 483 项对应纳入 Windows 安装器修复后的组合，两个结果没有混用。同期 Home 和 Windows 修复完整保留，CHANGELOG 冲突按双方新增内容合并。

## 验证边界与应用

本轮交付可执行的技能方法、模板和使用约定。实际多 Agent 峰值压测、用户电脑硬件评估、全平台资源采集命令、全部厂商 CLI 配额与跨项目强制隔离未在本轮实跑。21 项映射按语义审查、合成场景、实际只读运行和仓库门禁分别说明，未测范围没有被结构检查或勾选数量替代。

在目标项目实际宿主上使用更新后的技能，先复用有效样本并生成或更新唯一的 `.agents/dev/context/environment.md`。缺少成本时保留未知及最小补测路径，已有授权足够时再有界校准。推荐预算与已经生效的运行时或 OS 限额分别核对；报告本身不提供内核隔离或绝对不会 OOM 的保证。

运行原件位于项目 `temp/dev/2026-11-25-dev-setup-capacity/`；远端证据由上述固定提交、run/job 和 Issue/PR 链接提供。此次完成记录补记不改变已通过 CI 的技能及安装源码。
