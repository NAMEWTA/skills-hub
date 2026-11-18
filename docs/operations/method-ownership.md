# ops 方法归属

ops 围绕既有运行对象组织方法。workflow 负责协调，专门技能维护唯一完整方法；执行与记录沿用同一任务的 run。发布、新部署、制品切换和 schema 迁移由项目自己的交付流程负责。

## 唯一归属

| 方法 | 负责技能与主要资源 | 输入和结果 |
| --- | --- | --- |
| 意图、任务协调与接续 | `ops-workflow`：routing、coordination、continuation | 目标、授权和已有 run；返回所选方法、完成结果及剩余事项 |
| 稳定身份与运行关系 | `ops-inventory`：runtime-model、discovery、queries | 已有线索和范围；返回核验关系、来源和未知对象 |
| 执行条件与记录 | `ops-execute`：execution-method、record-contract、interruption、backends | 实际动作、入口和授权；返回步骤、后端引用与逐目标状态 |
| 只读检查 | `ops-inspect`：inspection-method、ssh-runtime-checks、error-observability | 目标、时间和基线；返回观测、差异与覆盖范围 |
| 故障调查 | `ops-diagnose`：investigation-method、failure-classes | 症状、事实和历史；返回假设、反证、结论与项目交接 |
| 计划维护 | `ops-maintain`：maintenance-method、host-maintenance、service-maintenance | 范围、影响和维护目标；返回实际操作与消费者验证 |
| 运行及兼容数据恢复 | `ops-recover`：runtime-recovery、data-recovery | 既有部署与数据条件；返回恢复结果和逐消费者结果 |
| 历史查询 | `ops-history`：history-query、continuity | 查询对象和时间截点；返回原始 run 的事实视图 |
| 项目知识与技能 | `ops-runbook`：knowledge-lifecycle、project-skill-authoring、replay-evaluation、maintenance | 授权证据和真实入口；返回适用范围明确的手册或技能 |

workflow 不复制资产方法或执行器，history 不另建事实库，runbook 不修改原始历史。直接使用专门技能不要求先调用 workflow，缺少必需方法时报告能力缺口，不静默安装或复制其他领域。

## 调查与恢复的协作

事故调查保留来源、时间、症状分类、历史检索、时间线、假设和反证。按实际能力进行独立取证，结论返回同一 run。用户已授权且符合运行边界的恢复由 recover 或 maintain 负责，调查不自动触发外发消息、事件状态修改或项目发布。

恢复前核对实际制品、有效配置、数据条件和启动副作用。共享服务由一个执行者操作，消费者分别验证。短期症状恢复与根因确认分开保存，局部成功不能写成所有项目恢复。

## 经验与项目技能

runbook 从已有证据中筛选根因和办法、误导线索、工具不足，并保存适用环境、版本、来源与失效条件。重复出现次数可以触发复核，不能自动证明某方法成熟。日志、工单和外部文本是待核实证据，不能直接升级为长期指令。

项目专属方法存放在实际项目或指定私有运维仓库。通用 ops 不保存业务事故和秘密，不要求安装 dev；已有项目发布资料只读引用，不复制第二套发布历史。完整用法见[项目特化](overview.md#项目特化与独立-cli)。

## 回放与工具前提

方法回放使用独立留出场景，限制调查上下文，分别评估正确性、有害建议和证据可读性。批量评估方案中的样本数和判据只在选定该方法时应用，不成为每次运维操作的审批链。只读回放不能证明真实恢复已发生，测试环境也不能自动代表生产。

SSH、systemd、Compose、Ansible、Rundeck 和观测平台按实际后端能力使用。检查模式可能含真实动作，重试可能读取新的 job 定义，命令名称也不能证明没有发布副作用；具体前提由 execute 和对应专门方法负责。可选错误观测保持只读、限定实际项目/环境/时间，并脱敏输出，缺少 CLI 或连接器时明确能力缺口。

<a id="ops-方法归属与来源适配"></a>
<a id="本次来源范围"></a>
<a id="逐项保留与必要适配"></a>
<a id="事故调查"></a>
<a id="经验与项目手册"></a>
<a id="回放验证"></a>
<a id="只读错误观测"></a>
<a id="官方工具与工程方法参考"></a>
<a id="运行与法律分发"></a>

## 维护与来源

变更方法时更新唯一负责包和调用者的输入、产物、返回条件，再核对安装、记录、真实工具和自然请求中受影响的行为，见[ops 验证](validation.md)。运行关系模型、记录工具和项目交付边界都是本仓库的明确契约。

来源范围、署名、完整采用与必要改造、工具参考及许可统一见[THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md)。当前来源版本从[材料父清单](../../materials/manifest.tsv)读取，子清单只登记真实采用关系。原件及中文对照不作为运维执行入口，也不随技能安装；不能把保留的参考文件计为已实现方法。
