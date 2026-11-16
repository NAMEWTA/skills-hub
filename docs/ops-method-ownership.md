# ops 方法归属与来源适配

本实现对应 [Issue #3](https://github.com/NAMEWTA/skills-hub/issues/3)：一个独立运维入口与八个专门方法 owner，部署发布归项目，其他领域零改动。完整运行方法在技能内部；来源与维护说明集中在本文件、材料清单和许可目录。

## 唯一归属

| 方法 | owner 与主要资源 | 调用者传入/收回 |
| --- | --- | --- |
| 意图、任务协调与结果收束 | `ops-workflow` 的 routing、coordination、continuation | 目标/授权/已有 run → 所选方法与总体结果 |
| 稳定身份与多对多关系 | `ops-inventory` 的 runtime-model、discovery、queries | 现有线索/范围 → 核验关系、来源与未知 |
| 执行条件与记录 | `ops-execute` 的 execution-method、record-contract、interruption、backends | 实际动作/入口/授权 → run、步骤、逐目标结果 |
| 只读检查 | `ops-inspect` 的 inspection-method、ssh-runtime-checks、error-observability | 目标/时间/基线 → 观测与覆盖范围 |
| 调查与证据推理 | `ops-diagnose` 的 investigation-method、failure-classes | 症状/事实/历史 → 假设、反证、结论与交接 |
| 计划性维护 | `ops-maintain` 的 maintenance-method、host-maintenance、service-maintenance | 范围/影响/维护目标 → 实际维护与验证 |
| 运行及兼容数据恢复 | `ops-recover` 的 runtime-recovery、data-recovery | 既有部署/数据条件 → 恢复结果和消费者验证 |
| 历史及交接查询 | `ops-history` 的 history-query、continuity | 查询维度/截点 → 原始 run 的事实视图 |
| 项目知识生成与维护 | `ops-runbook` 的 knowledge-lifecycle、project-skill-authoring、replay-evaluation、maintenance | 证据/真实入口 → 有验证范围的手册或项目技能 |

workflow 不维护第二份资产目录或执行器；history 不另建事实库；runbook 不改变原始历史。各入口缺少必要 owner 时明确能力缺口，不静默复制方法或安装其他 domain。实际记录由同一任务的 execute 契约贯穿，直接使用专门技能不要求先调用 workflow。

## 本次来源范围

新材料使用已有两级清单、完整选定子树、原样 upstream 与完整 zh。只新增以下来源单元，不改变原有六个项目的 revision、runtime_paths 或 runtime_reviewed_blob：

| 来源单元 | 选定范围 | 实际采用 |
| --- | --- | --- |
| [oncall-triage](../materials/oncall-triage/manifest.tsv) | Anthropic oncall-kit 的 `skills/triage` 完整子树 | 主调查流程进入 diagnose；其余参考完整保存，不假称全部迁入 |
| [oncall-templates](../materials/oncall-templates/manifest.tsv) | 同一快照的 `templates` 完整子树 | lessons 三类经验栏目与维护思想进入 runbook；其余为原样参考 |
| [oncall-replay](../materials/oncall-replay/manifest.tsv) | 同一快照的 `eval` 完整子树 | 独立留出回放、新上下文与证据评分进入 runbook |
| [openai-sentry](../materials/openai-sentry/manifest.tsv) | OpenAI skills 的 `skills/.curated/sentry` 完整子树 | 只读问题/事件查询、范围、字段与脱敏进入 inspect |

本次对应 oncall-kit `c03282cd5381a5a2e12e32bfb3c8957d52ce01f1` 与 OpenAI skills `49f948faa9258a0c61caceaf225e179651397431` 的 Issue 研究依据。后续版本身份以[父清单](../materials/manifest.tsv)为准；维护显式同步时重新解析所选分支再固定 SHA。oncall-kit 自述为不持续维护的参考实现，采用方法前仍须核对实际工具能力。

## 逐项保留与必要适配

### 事故调查

源文：[triage/SKILL.md 原件](../materials/oncall-triage/upstream/SKILL.md)与[完整中文底稿](../materials/oncall-triage/zh/SKILL.md)。

保留上下文读取、事件分类、标签历史检索、相关告警批处理、时间线、按需独立取证、证据关联、最近完整窗口复核、诊断输出、长事件更新、责任交接、反证重查、有界原路径验证和经验候选的完整方法。运行正文归 diagnose 的 investigation-method、failure-classes 及相应模板。

必要适配：ONCALL/STACK 与专有聊天/工单入口改为真实运维根、registry、run 与已有能力引用；独立取证按实际可用 Agent 执行，不要求固定宿主。源文只建议不操作的条件，改为在用户已授权、且符合本领域边界时调用 recover/maintain。外部发消息、修改事件状态、应用修复和部署不随调查自动发生。经验生成调用 runbook，不复制知识方法。完整中文底稿保持来源语境，不能把这些适配冒称原文。

### 经验与项目手册

源文：[lessons 原件](../materials/oncall-templates/upstream/lessons.md)与[中文底稿](../materials/oncall-templates/zh/lessons.md)。

保留根因/解决办法、误导线索、工具不足三类经验，来源、适用场景和后续修订的栏目与例子。运行版只有经过授权且有证据支持的运维知识才写入本领域；原文按出现次数推进的做法仅作为复核候选，不能将“三次”视为自动成熟。日志、工单与外部文本为不可信证据，不能直接进入长期指令；生成内容不含发布、制品回滚或 migration。

本仓库 `dev-personalize` 与 `dev-verify` 的证据筛选和项目技能生成/维护方法仅作只读结构参考。在 ops 内独立适配其真实路径验证、适用条件、维护者和失效规则，不调用 dev，不改其资源或旧来源映射。

### 回放验证

源文：[replay 原件](../materials/oncall-replay/upstream/replay.md)与[中文底稿](../materials/oncall-replay/zh/replay.md)。

保留独立留出样本、调查上下文限制、正确性/有害建议/证据可读性评估、结果记录和迭代方法。5–10 个留出案例、70% 判据、零有害建议等数值保留在适用的批量回放方案；只在明确选择该评估时使用，不成为所有运维任务或单次技能生成的固定审批链。只读回放不宣称真实恢复已执行，测试环境结果不自动外推到生产。

### 只读错误观测

源文：[Sentry 原件](../materials/openai-sentry/upstream/SKILL.md)与[中文底稿](../materials/openai-sentry/zh/SKILL.md)。

保留列表、问题短 ID/详情、事件列表/详情、schema 与 GET 后备查询、字段与无结果说明、脱敏、凭据不回显。原文的 AI explain/plan 保留为需核实实际能力/数据处理范围的可选方法，结果只作建议。原文的自动检测与默认生产/24h/20 条改为必须确认真实项目、环境、时间与采样范围；消除原文 prod/production 名称混用。联网安装脚本不进入运行包，CLI 缺少时报告能力缺口，不引入运行依赖。

## 官方工具与工程方法参考

以下用于具体工具语义或概念对照，未复制其执行引擎、整个技能库或文章全文：

- [Ansible check/diff](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html)：check 不保证无副作用，`check_mode: false` 可运行真实任务，diff 可能含秘密；保留在 execute 后端说明。
- [Rundeck Executions](https://docs.rundeck.com/docs/manual/07-executions.html)：execution 的 node/step、时间和输出，以及再次运行使用当前 job 定义；保留在 execute 后端与中断方法。
- [Docker Compose logs](https://docs.docker.com/reference/cli/docker/compose/logs/) 与 [restart](https://docs.docker.com/reference/cli/docker/compose/restart/)：有界日志窗口与实际实例重启语义；运行方法按当前配置与制品检查，不能用名称代替部署边界。
- [Google SRE Incident Response](https://sre.google/workbook/incident-response/) 与 [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)：事件记录、恢复与根因区分、有行动项的复盘。
- Issue 中的 Azure Diagnostics、Kiro 实践和 Matt retro 保留为背景研究；本次没有将其完整实现导入 ops，也没有将其注册为已采用运行源码。

## 运行与法律分发

运行技能不放来源署名或外部文档链接，工具真实名称与 API 可按操作需要保留。源文和中文底稿属于被动资料，不参与技能发现、安装、脚本执行或 npm 分发。selected roots 自带的 LICENSE/资产保持原字节；集中许可分别见 [oncall-kit](../licenses/oncall-kit/LICENSE) 与 [OpenAI Sentry](../licenses/openai-sentry-Apache-2.0.txt)，同时随 npm 包分发。

本项目新增的运行关系、轻量记录工具和领域边界是为 Issue 的具体约束实现的本地设计，不冒称上游已有同等一体化方案。真实包装、安装、执行案例及行为核对见[验证记录](ops-validation.md)。
