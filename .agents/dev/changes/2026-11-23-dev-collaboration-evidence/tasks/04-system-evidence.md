# 04 统一系统运行取证和 Herdr 交接

规格：[路径与生命周期](../plan.md#路径与生命周期)。逐包改动依据见 [system 审查](../evidence-audit.md#system六个技能都纳入检查)。

交付：系统运行原件只在目标项目 `temp/system/` 的本次运行目录留存。Herdr TUI 与 Core 的业务验收只在所属 Change 的同名 Markdown 保存一次；同号回执仍支持派发、恢复和回收。直接依赖：无；隔离安装联验依赖 [03](03-initialize-temp-ignore.md)。

## 实施范围

1. 更新 TUI 和 Core 的入口、`assets/{topic,task,report}.md` 和协作指南。任务写业务票据与验收位置、必需附件、worker 可写路径和 Lead 可读路径。保留主题根、完整执行者身份、目录编码、manifest 列和单写入者。Herdr 自身诊断按 `temp/system/<工具>/<topic>/<执行者目录>/<派发 task-stem>/<run-id>/` 保存；开发测试输出仍按开发票据落 `temp/dev/`。验证实际挂载后才派发；不能共享的原件走已授权交接，不回退到跟踪目录。
2. `reportNN.md` 是同号回执。保留完整派发身份、执行者状态、业务产物与同名验收报告指针，必要时附运行目录指针，不写第二套验收正文。worker 先写完必要附件和本轮观察，再以原有不覆盖协议发布回执；观察可用终端返回，须留存的临时观察随运行放 `temp/`。Lead 核对实际产物和附件，由唯一写入者更新原业务报告。之后才更新清单的 `done` 或 `blocked`，并按原规则回收。失败或复验继续写原业务报告；Herdr 重派时保留旧编号和回执，不能把 `task02.md` 当成第二张业务票。重复投递、等待超时、迟到的报告不重新执行或覆盖已有结果。
3. 新开独立系统 Change 时沿用 `.agents/system/<host>/` 下实际工作记录；持久验收用其 `tasks/`、`evidences/` 及完成后的 `evidence.md`。没有 Change 的只读查询用终端，当次观察或已有主机记录即可，不为临时捕获造业务票。本轮不检查或处理既有派发、旧报告和附件。
4. 更新 `system-inspect` 的命令重定向、`system-cleanup` 的 Linux 清单/前后结果、`system-config` 的验证输出说明、`system-proxy` 的 DNS 捕获工作目录。保留权威配置、凭据与受限备份、原生服务日志及数据的真实位置；仅导出本次必要且可保存的摘取样本。不改变只读、脱敏、清理和恢复约束。

默认同根布局下，从 `.agents/system/herdr-core/2026-11-20-review/build%2Ft7/report01.md` 引用探针日志的相对 URI 为 `../../../../../temp/system/herdr-core/2026-11-20-review/build%252Ft7/task01/run-01/install.log`。这是可选的本地附件指针，不是持久业务报告。挂载布局不同则提供 Lead 实际可达的路径，不复制相对路径示例。

## 验收

- [ ] 两套已安装协议用例覆盖带空格的主题、终端目录 `build%2Ft7`（在 Markdown 链接中为 `build%252Ft7`）、不同挂载和路径冲突。核对必需附件能读，不以 worker 状态或回执存在代替验收。
- [ ] 失败、重派和复验产生不同 Herdr 编号与运行目录，只更新一份业务同名报告。模拟回执到达而 Lead 尚未验收、旧终端重复回告、附件丢失的分支。验证新版派发的清单和回收条件不放宽。
- [ ] 核对系统独立 Change 和四个非 Herdr 技能的写入边界。读取项目根的暂存工件、保留的真实配置和报告；检查无远端工具时 stdout 与限制仍可用。没有真实 Herdr/外部挂载或目标设备时，记录只验证了目录与文件协议，不宣称实机通过。

验收：[本票报告](../evidences/04-system-evidence.md)。
