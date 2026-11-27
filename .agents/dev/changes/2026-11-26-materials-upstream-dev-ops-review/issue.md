# [dev][ops] 基于最新 materials 完成会话证据、纠错与复盘重构，并修复来源升级后的运行差距

## 目标与当前状态

让开发代理能够可靠找回过去的工作证据，把明确纠正落实到真正负责的技能，并从会话中提炼长期有效的方法。运维沿用现有 run、步骤和手册体系补齐同一条证据链。新增入口只保留 `dev-recall`，其余能力在已有 owner 内改造。

**就绪状态：可认领实施；发布本 Issue 不代表运行改造已经完成。**

审查运行基线为 [skills-hub@f23ba949](https://github.com/NAMEWTA/skills-hub/tree/f23ba949826c4b6cac480280ff306cdd28681f39)，版本 0.1.35。本次材料同步使用逐来源固定提交，原件与中文对照同步，运行包尚未修改。材料同步 PR 与本 Issue 应互相引用；本 Issue 的运行改造项全部未完成。

重点来源 [pstack@b1fbf4b6](https://github.com/cursor/plugins/tree/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack) 从 560 份文件变为 541 份，新增 5、修改 80、删除 24。现存 70 行运行映射受到这次内容变化影响，删除来源还有 22 行旧运行映射需要保留追踪。`runtime_reviewed_blob` 没有因材料刷新而前移。完整来源差异、删除前映射和同步验证见本 Change 的 [pstack 报告](reports/pstack-sync-report.md)与[来源清单](reports/upstream-inventory.md)。


### 用户指定材料的直接来源

| 材料 | 本次固定原文 | 具体用途 |
| --- | --- | --- |
| Claude Code 适配 | [claude-code.md](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/docs/harness/claude-code.md) | 历史定位和宿主差异，与官方文档交叉核实 |
| correct | [SKILL.md](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/correct/SKILL.md) | 把用户纠正转为适当范围的防错机制 |
| recall | [SKILL.md](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/recall/SKILL.md) | 找回工作线索、未决事项和下一步，而非自动恢复会话 |
| reflect | [SKILL.md](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/reflect/SKILL.md) | 从目标记录提炼稳定经验，按需深入审查 |

对应中文已同步到同路径的 `materials/pstack/zh/claude-code/`，完整保留来源方法；下文明确本仓运行采用的取舍。

### P0：已经复现 statechart 兼容性失败

更新材料后运行 `npm run check:statechart`，`Login` 案例在“图边或节点标记”比较中失败，退出码为 1。本地仍输出 `s0 → s2`；新来源期望 `s0 → s1`，并在复合状态内部增加 `[*] → s2`。此前日志明确记录 20 个案例通过，其余未取得完整结果。

原因是本地 Mermaid 绘制尚未移植上游 `drawnEdges` 对复合状态入口的处理。该检查使用本仓 JavaScript 工具回放已捕获的 TLC 输出，包含隔离夹具中的 `view.mjs`，没有进行新的 TLC 求解。应修复运行算法并重跑完整回放，保持材料夹具和断言原样。同步 PR 在这一缺口解除前保持 Draft，不用“翻译完成”代表运行兼容性通过。

## 1. 明确唯一职责，避免复制三套同义技能

[现有 dev 审计](reports/dev-audit.md)表明，用户关注的三种能力已有方法基础，主要缺口在入口、会话证据和默认流程。

下文以 `dev-*` 开头的文件路径相对 `skills/dev/`，以 `ops-*` 开头的路径相对 `skills/ops/`；其他路径相对仓库根。标为新增或迁移目标的路径属于实施计划，当前尚不存在。

| 能力 | 当前实际落点 | 决定 |
| --- | --- | --- |
| 跨会话回忆 | `dev-learn/references/context-recall.md`，但入口主要描述讲解 | 迁入唯一新技能 `dev-recall`，旧位置移除方法正文 |
| 反复纠正 | `dev-guardrails/references/recurring-corrections.md` | 增强纠正证据、作用域和反证，不新增 `dev-correct` |
| 会话反思 | `dev-archive/references/parallel-retrospective.md` 及四份评审参考 | 默认轻量反思，保留按需深入视角，不新增 `dev-reflect` |
| 指定旧任务接续 | `dev-handoff/references/session-resume.md` | 保持，核对恢复点并继续任务；回忆本身不恢复 CLI |
| 理解当前代码 | `dev-learn` | 保持讲解和学习职责，不强制所有任务先做讲解 |
| 历史设计理由 | `dev-why` | 保持当时决策与取舍调查，与“现在到哪了”分开 |
| 工作习惯和技能编写 | `dev-personalize` | 接收限定范围的证据，维护真实技能源，不再复制日志扫描 |
| 项目知识 | `dev-archive` | 保持术语、背景、ADR、错误经验的既有分区；当前没有 `dev-knowledge` |
| 运维回忆、纠正、经验维护 | `ops-history`、`ops-execute`、`ops-runbook` | 在现有职责内补齐，不新增三个同名 ops 技能 |

完整方法只维护在 owner 的包内；help、workflow 和其他调用方保留用途、输入、交付物和返回条件。单独安装的技能仍可使用用户提供的证据，不形成必须安装整个 dev 域才能工作的依赖。

新 `dev-recall` 与本轮改造的纠错、反思入口，应先核实实际项目根，显式读取该项目的 `.agents/dev/AGENTS.md`，再按当前任务逐步展开资料；同版本已在当前上下文中可复用。入口缺失时报告并沿用能核实的项目规则，不假定宿主会自动加载该嵌套文件，也不因缺少可选资料而扫描其他项目。

## 2. 建立可核验的 Claude Code 会话证据读取

### 2.1 不直接复制上游的目录推导

pstack 的 [Claude Code 适配文档](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/docs/harness/claude-code.md)仍把 slug 简化为替换 `/` 和 `.`，并把目录中最新 JSONL 当成当前会话。材料中文应忠实保留来源内容；运行方法需要单独纠正。

[官方会话文档](https://code.claude.com/docs/en/sessions#where-transcripts-are-stored)说明默认位置是 `~/.claude/projects/<project>/<session-id>.jsonl`，目录名将工作路径中的非字母数字字符替换为 `-`；转换结果超过 200 字符时，截取并附加完整路径的 hash。`CLAUDE_CONFIG_DIR` 可改变根目录。`CLAUDE_CODE_PROJECT_DIR_NAME`（Claude Code v2.1.234+）必须与它同时设置，值为 1–64 个字母、数字、连字符或下划线，不能是 Windows 设备名；变量须在启动环境中设置，不由 settings 的 env 块设置。无效值会被忽略。因此不能猜 hash 算法、依赖当前进程环境还原另一会话，或仅凭同名项目目录合并记录。

### 2.2 定位顺序与身份核验

新增 `skills/dev/dev-recall/`，将完整回忆方法迁入 `references/context-recall.md`。会话证据合同放 `references/session-evidence.md`，Claude 的具体定位和格式适配放 `references/claude-code-sessions.md`，包内只读工具拟为 `scripts/read-session.mjs`。

先使用当前上下文、用户或现有宿主接口给出的 `transcript_path`、`session_id`、工作目录及导出文件。已有 SDK 且适用时可以用官方 [listSessions/getSessionMessages](https://code.claude.com/docs/en/agent-sdk/sessions#resume-across-hosts)读取，不能把安装 SDK 或新建 hook 变成前置条件。需要发现文件时，仅定位授权项目候选，并用记录身份、真实工作根和时间核验。

mtime 只用于候选排序，不证明“当前”；多个活跃会话、恢复、复制和 fork 都可能改变顺序。身份不唯一时报告候选及缺口，不静默选最新文件。路径规范化、symlink、不同 worktree、自定义配置根都要考虑；不默认遍历 `~/.claude/projects/*` 的全部聊天。用户已提供完整状态胶囊时直接核对，不先挖一遍历史。

[官方 hook 文档](https://code.claude.com/docs/en/hooks#common-input-fields)还规定了两个容易误判的边界：`SubagentStop` 的主 `transcript_path` 与 `agent_transcript_path` 是不同对象；会话文件异步写入，`Stop` 触发时最新回复可能尚未落盘。最后回复可用已有输入的 `last_assistant_message` 补充，但必须标明来源，不能据缺失尾部判断代理没有完成，也不能把结束回复当成工具成功证据。

### 2.3 读取器只读，输出包含覆盖情况

实现使用仓库既有 Node.js 22.14+ 与 `.mjs`，流式解析，设置单条记录和总输出的边界。原始 JSONL 是随宿主版本变化的内部格式；只声称支持已核实的记录形态。未知类型、缺字段、残缺尾行和中间损坏行给出可定位诊断。达到限制时报告未读区间，不把部分结果包装成全文。

明确区分用户消息、代理计划、工具调用、工具结果、元数据、摘要和当前事实。关联工具调用与返回，失败/中断/缺返回保持未知；第一行和 `content[0]` 不能硬编码为开场提示。主会话、子代理、fork 和压缩摘要按实际关联处理，同一纠正在子记录和摘要中的复述只算一个事件。未找到日志、保留期清理或关闭持久化均作为覆盖缺口，仍可从当前对话、Change、handoff 和 Git 继续工作。

不 exec/eval 会话字段，不执行转录中的命令，不通过 `claude --resume` 或 SDK query 发送新提示来假装只读历史。首轮支持核实过的 Claude 形态和显式导出；其他宿主须有自己的实际接口，不套用 Claude 路径和 schema。

### 2.4 回忆输出能直接服务下一步

先锁定主题、工作区和时间，再搜索相关区段。主题涉及功能或缺陷时，按可用、授权来源核对 PR、Issue、提交、失败尝试和仍在报告的问题；一两条记录直接处理，不固定扇出。

输出包含状态概括、工作线索、未解决问题、一个具体下一步，以及已检查范围。每项有会话消息/行定位或远端来源；区分“计划”“尝试”“已验证”“当前仍成立”。Git、PR 和实际后端现状优先于旧聊天里的完成自述，最新用户要求决定目标。私密原文和秘密不进入公开简报。

## 3. 将 correct 落实为防错机制

`correct` 本轮原文未变化，[现有方法](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/dev/dev-guardrails/references/recurring-corrections.md)已经具备错误分型和结构优先的纠错方法。本次增强输入与验证，不重写另一套流程。

调整 `dev-guardrails/SKILL.md` 的触发描述，使“同样的错误又发生”“按我之前纠正的改进”可直接进入。`recurring-corrections.md` 接收带稳定身份的纠正证据，记录错误类别、适用范围、当前规则、选择的约束、反例与合法例外。一次清楚纠正可以立即修正规则，不强制等够两三次；多份转述也不能充当多次独立发生。

先检查能否修正状态所有权、接口或类型，再选择已有机械检查、行为验证或需要人工判断的说明。历史真实错误应能被新机制拒绝，合法场景仍通过。结构已保证的要求可删除重复提示，但保留约束理由和重新核验条件；不要把每次纠正都变成 lint、测试或长篇 AGENTS 规则。产品行为缺陷交实际开发 owner，技能漏触发修 description，项目事实更新 notes，避免把所有发现都写成提示词。

## 4. 将 reflect 与真正的 Change 收尾分开

[新版 reflect](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/reflect/SKILL.md)已移除固定三评审者和综合者，改为审查目标会话、筛选稳定经验、核对已有技能、给出 Accepted/Rejected/Backlog。运行版仍以多视角为常规步骤，简单反思成本偏高。

`dev-archive/SKILL.md` 入口明确区分“会话反思”“知识维护”“Change 收尾”。单纯请求反思不移动目录、不关闭未完成 task，也不把“这次学到了什么”当成全部交付已经完成。

将 `references/parallel-retrospective.md` 改为 `reflection-method.md`。默认由当前执行者覆盖完整目标记录，按用户纠正、工具经验、缺失上下文、跳过验证、漏触发技能筛选；长记录可分块处理，但必须证明覆盖范围。结论冲突、跨多个 owner 或用户要求独立审查时，才采用现有 tooling/judgment/blindspots 视角。

每项接受结论说明问题、证据、适用范围、拟改文件和如何验证；拒绝项说明重复、一次性或证据不足；待办项写清依赖和真正 owner。先读目标技能，删除它已明确表达的建议。`session-retrospective.md` 保留导航、环境、信息访问等独有检查点，合并重复的授权和落点规则。项目知识仍由 archive 维护，技能编写采用 personalize 的方法，机械防错交 guardrails。已获授权的修改继续完成，不复制上游的重复批准、永不 PR/push 或缓存编辑策略。

## 5. 上游删减与新增内容的去留矩阵

| 对象 | 运行版处置 | 理由和替代 |
| --- | --- | --- |
| learn 的 `context-recall.md` | 迁移后删除旧正文 | recall 单一归属；旧导航改为任务交接 |
| archive 的 parallel-retrospective | 改名并重构 | 默认单执行者；修复全部入链与迁移夹具 |
| reflect 四份评审参考 | 保留、按需读取 | 各自有独有观察点，不要求每次全部执行 |
| architect 三参考、how 两提示、why 十二参考 | 保留独有方法，合并重复引导 | 极短上游主文件不能替代完整证据/设计方法；删除需有替代和迁移证明 |
| 上游 orchestrate 删除 | 保留 `dev-parallel/references/program-coordination.md` | 本仓仍需要持续项目协调；坚持 task/session 解耦 |
| 上游 check-plan 及测试删除 | 仅删除材料对应文件 | 原本无运行映射，不连带删除 dev-program 依赖和验收能力 |
| 新 reframe | 纳入 `dev-sharpen` 可选术语澄清参考 | 从原始描述区分问题、核实术语来源再重述，不固定术语数量 |
| 新 worker 与 poteto 策略 | 选择性采用验收边界传递 | 不引入固定模型、自动团队配置、每 task 新代理、固定 PR 行数或统一新增门禁 |

上游删除而本地保留的方法继续保留旧 SHA、采用理由和许可信息。当前清单只列当前来源文件，删除影响放 Change 报告和集中来源说明，不能为了清单整齐抹掉来源关系。详细 22 行旧映射见 pstack 报告。

## 6. 其他来源的针对性升级

| 来源与落点 | 应吸收的变化 | 采用前必须解决的事实 |
| --- | --- | --- |
| DeepSeek；`dev-review/references/change-impact.md`、`review-baseline.md` | 模块职责表、依赖边和反向依赖检查，让审阅者知道谁会受影响；按错误边界审查空 catch | 检查方法归 review，`dev-deploy/references/pull-request-procedure.md` 引用产物；包职责和依赖未变时不新增表格 |
| Matt；`dev-archive/references/glossary-format.md` | 在定义中将引用的其他领域术语加粗，形成清楚的交叉引用 | chief-of-staff 的个人记忆调度属于 Home，不强行搬进 dev |
| Archify；`upstream-skills/zh-archify/`，按需用于 learn/review | 新代码分析与 PR、结构化产物/Viewer 变化，按完整安装资源和许可评估 | `modules/code-analysis/README.md` 与 Python 专页说 Pyright parser 在 Node 中运行、无需 Python；`ARCHITECTURE.md` 后段仍说需要解释器，且“未实现 duplication rules”与 C6/规则目录矛盾。先依据代码、依赖与隔离夹具核实，不能将解析器包装成完整 Pyright 语义引擎 |
| Modern Web；`upstream-skills/zh-modern-web-guidance/` | 对话框、菜单、popover 和渐进增强的新方法 | `guides/ui-components/dialog.md` 将 WCAG 2.4.11 写成焦点应被完全遮挡，疑似漏 `not`；`context-menu.md` 有 `!'source' in` 优先级、`style.setAttribute` 和 `anchor/menuAnchor` 混用三处静态缺陷，需隔离验证后形成运行适配 |
| Dashboard；`upstream-skills/zh-dashboard-design/` | 新布局、组件与设计样本方法 | `references/inspiration.md` 同时使用 43 个仪表盘、`/45` 分母和 `/43` 表格。未核实前不引用为可靠统计，不擅自猜正确分母 |

DeepSeek 的[PR 方法](https://github.com/deepseek-ai/deepseek-harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/.agents/skills/dsh-pr-description/SKILL.md)要求从 manifest diff 提取实际运行依赖，对 `A → B` 检查 B 的 manifest 是否出现反向依赖 A；这与源码调用方追踪是不同证据；architecture 可在设计时消费这份约束，避免再维护一份同义检查。其[空 catch 方法](https://github.com/deepseek-ai/deepseek-harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/.agents/skills/dsh-error-handling/SKILL.md)可补入 review-baseline：try 限一项语法操作，点明允许忽略的失败及安全理由，只接受部分错误时分类并重抛其他错误，复合语句继续做语义审查。这七个变化源文件当前没有运行映射，实际采纳后才建立映射。Matt 的[术语格式](https://github.com/mattpocock/skills/blob/6f7f7831a625f040a8e06a0e7954826b87ce775a/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md)由 archive 单处维护，domain-modeling 使用同一格式，不扩张成通用术语库。

Archify 的[问题驱动分析](https://github.com/tt-a1i/archify/blob/d6b0f71f25a3337ed2fcd09c973cacf67be7baba/archify/modules/code-analysis/docs/FUNCTION-ANALYSIS.md)优先提供证据合同：记录实际 base/head、分析根、语言、配置、排除项与源码摘要。导航目标必须与捕获源码及解析状态匹配；未知调用模型不能将空数组解释为零调用，截断时报告 total/included/omitted。捕获到的调用候选、代理推断和实际运行观察分别呈现；源码或配置改变后重新提取。可按任务借鉴 C6 重复检测和 C7 外部诊断的来源绑定，不默认跑所有语言，更不能把扫描数等同于完整影响或运行缺陷。依赖矛盾以同 SHA 的 [README](https://github.com/tt-a1i/archify/blob/d6b0f71f25a3337ed2fcd09c973cacf67be7baba/archify/modules/code-analysis/README.md)和 [ARCHITECTURE](https://github.com/tt-a1i/archify/blob/d6b0f71f25a3337ed2fcd09c973cacf67be7baba/archify/modules/code-analysis/ARCHITECTURE.md)为复核入口。

Modern Web 的 [dialog](https://github.com/GoogleChrome/modern-web-guidance/blob/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f/skills/modern-web-guidance/guides/ui-components/dialog.md) 和 [context-menu](https://github.com/GoogleChrome/modern-web-guidance/blob/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f/skills/modern-web-guidance/guides/ui-components/context-menu.md)、Dashboard 的 [inspiration](https://github.com/abdiraimov-otabek/dashboard-design-skill/blob/57f96688862668b482f647fa1e370efb5d3ddd31/skills/dashboard-design/references/inspiration.md)均保留固定来源定位。这些是静态审阅发现，除 statechart 回放外没有宣称执行验证。材料原文和中文忠实保留来源；运行采用的纠错必须显式说明证据与适配，不暗改原件，也不以来源更新为由自动安装依赖、升级所有独立包或接管发布。

## 7. ops 保持现有运行事实体系，补齐经验更正

[ops 审计](reports/ops-audit.md)已核对 oncall/Sentry 的选定树没有新内容。当前 history 已有限定运维根、稳定身份、时间与缺口的方法；execute 已有原步骤不覆盖、追加更正与单一 writer；runbook 已有知识成熟、失效与独立回放。因此只做以下补齐。

1. `ops-history/references/history-query.md`、`continuity.md` 和 `assets/history-report.md` 增加会话辅助证据约定。会话用于定位候选 run 或说明当时判断，原始 run/step 与真实后端状态优先；冲突标为“聊天声称，待核实”，不能因为聊天说恢复就重放动作或报告恢复。
2. `ops-runbook/assets/lessons.md`、`references/knowledge-lifecycle.md` 和 `maintenance.md` 增加“被什么新证据纠正、影响哪些现行方法、替代入口、复验结论”。更正后更新实际引用该经验的手册，保留原 run 和历史失效关系。重复事故摘要只计一个事件，不把一次缓解写成根因。
3. `ops-workflow/references/routing.md` 加入“找回调查→history”“复盘并更新手册→runbook”“需要应用代码或 deployment 改动→项目交接”的例子，沿用当前 run；同步 `docs/operations/method-ownership.md` 与 `validation.md`。

不新增 ops JSONL 读取器或 dev 依赖，不建立跨域数据库。只有明确需要的会话摘录才成为辅助资料。应用代码、发布定义、数据/schema 变更通过项目交接，ops 不自动代项目修改或开 PR，也不迁移发布体系；已有授权内的 ops 自有方法文档、项目技能和辅助检查维护继续完成。保留现有独立回放要求，既有 70% 正确加部分正确、零有害、连续 10 次旁路观察等条件仍只适用于所选方法评估，不能推广为每次运维的审批链。

## 8. 按依赖拆成可交付任务

各 task 都应在本 Change 的 `tasks/` 与 `evidences/` 建同名 Markdown；未验明确写“未验证”。下表是实施依赖，不要求先把整张表都做完才交付第一项。

| 优先级与任务 | 依赖 | 主要文件与完成条件 |
| --- | --- | --- |
| P0 / T1 状态图入口边修复 | 最新固定材料 | `dev-statechart/scripts/backends/mermaid.mjs`；移植绘图语义，完整 captured-output replay 通过，保留多个外部来源和内部边的区别 |
| P1 / T2 建立 recall owner | 现有归属审计 | 新 `dev-recall/SKILL.md`、`agents/openai.yaml`、包内参考和 `assets/recall-brief.md`；迁出 learn 方法，单独安装资源完整 |
| P1 / T3 会话只读适配 | T2 | `scripts/read-session.mjs` 与 Claude 参考；离线夹具验证身份、范围、流式解析和缺口，明确支持版本 |
| P1 / T4 纠正与反思接入 | T2、T3；也接受用户直接提供证据 | guardrails、archive、personalize 的上述文件；独立事件去重、采纳路由、反思不关闭未完 Change |
| P1 / T5 statechart 其他差异 | T1 可先独立交付 | `frontends/dot.mjs`、`run.mjs`、`statechart.mjs`、`cleanup.mjs`、`process-lifecycle.mjs`；CRLF、SANY 行列错误、Java UTF-8、Windows 已退出 PID 不再 taskkill 分项验证 |
| P2 / T6 ops 小范围增强 | ops 审计，可并行 | history/runbook/workflow 及 ops 文档；保留原始事实与独立领域边界 |
| P2 / T7 有选择吸收其他来源 | 各自代码/内容核验，可并行 | sharpen、review、writing、glossary 和独立 zh 包；每项分别记采纳、拒绝或暂缓，不批量覆盖 |
| P1 / T8 路由、映射和安装收尾 | 对应实施项完成 | workflow 的 `references/method-handoffs.md`、help 能力/导读与 `references/harness-adapter.md`、handoff/status/personalize 方法说明、`docs/development/method-ownership.md`、`docs/reference/knowledge.md`、持久化规范与 `tests/fixtures/dev-resource-moves.tsv`；全部调用指向唯一 owner |

T8 中 personalize 的转介保持包内完整方法与明确输入，不添加跨包相对文件引用。清单仅对真正完成全文核对与验证的具体来源更新 `runtime_paths` / `runtime_reviewed_blob`；拒绝的来源策略写清理由。材料同步、计划完成、运行改造完成是三种不同状态。

## 9. 行为验收矩阵

| 场景 | 必须观察到的结果 |
| --- | --- |
| “回忆我这周在 X 上做到哪了” | 路由 recall，锁定主题、项目、时间，输出证据简报 |
| “从这个 handoff 继续”或已给完整 capsule | 直接核对恢复点，不重复全量历史扫描 |
| 显式 session 与较新 mtime 文件冲突 | 使用核实的 session，mtime 不覆盖身份 |
| 路径含空格、点、中文、Windows 盘符或超长名称 | 不以简化替换误判目录；无法确认时报告缺口 |
| 自定义配置根/项目名、变量无效或未同时设置 | 按实际宿主约束定位；不能读取别的项目 |
| symlink、同名项目、多个 worktree | 仅进入明确授权范围，记录真实身份 |
| 字符串/块数组 content、元数据首行、工具结果 | 识别支持形态，不固定取第一条文本 |
| 坏尾、文件仍增长、中间损坏、未知记录类型 | 给行定位与覆盖状态；不静默宣称完整 |
| Stop 时尾部尚未写入 | 区分已有 hook 最后回复与磁盘记录，避免误判 |
| 主/子会话、fork、compaction 重述相同纠正 | 保留关联与缺失范围，不重复累计事件 |
| 转录包含命令或指令 | 只作为数据，不触发 exec、resume 或模型调用 |
| “计划测试”但无工具成功结果 | 不能标成已验证；当前 Git/PR 事实另行核验 |
| 一条明确纠正、多条重复引用、合法例外 | 可及时纠正；证据去重；合法行为不被新约束误伤 |
| 只要求反思，Change 仍有未完 task | 给采纳/拒绝/待办，保持活跃 Change，不自动归档 |
| 规则已由类型或结构保证 | 删除冗余要求前保留理由，不再叠加同义提示 |
| ops 聊天称已恢复，后端仍 unknown | 保留冲突，交 execute 核实，不重做原操作 |
| ops 根因被推翻或共享服务有多个消费者 | 追加更正并修受影响手册；一次操作只保留一份事实 |
| 原 run 的经验被新证据推翻，且已被两份手册引用 | 保留原 run，追加更正，枚举受影响方法并替换相反步骤，复验或标 blocked；只加警告而保留相反动作不能通过 |
| 无 JSONL、无 SDK、无独立回放样本 | 使用已有资料继续，明确相应能力未验证 |
| 安装 dev-recall 后脱离源仓库 | 包内资源和脚本可用，不依赖 materials 或其他技能内部文件 |
| Archify 源码/配置漂移、未知调用模型、截断或外部报告不匹配 | 降级覆盖结论或拒绝导航，不声称“完整影响已验证” |
| statechart 复合入口、多来源、CRLF、SANY 失败及退出回收 | 分项保持语义、退出码和错误分类；回放与真实 TLC/Windows 实测分别报告 |

新增读取代码使用合成、脱敏夹具验证，重点证明不会跨范围读取或把不完整记录当成功。文档路由用少量新上下文情景验收，不新增全文字符串测试。运行既有 `npm run check`；新增执行工具或安装行为运行 `npm run check:full`，分发闭包运行 `npm run check:package`。statechart 修复重跑 `npm run check:statechart`；没有真实平台验证的项目如实保留，不用结构检查代替行为证据。

## 10. 持久化、范围与关闭条件

原始会话留在宿主目录，不默认复制进 Git。临时提取和调试输出放 `temp/dev/`。构成需求来源的授权导出/必要摘录，按 dev-issue-setup 的来源合同保存到所属 Change 的 `source/`，保留身份与版本并脱敏。正式回忆/复盘结论仅在需要保存时写回 Change；长期经验归 `.agents/dev/notes/errors/`、背景、ADR 或 glossary。技能包只放方法，AGENTS 只做必要导航。ops 继续使用自己的 `.agents/ops/` 原始记录与手册结构。

本 Issue 不要求全局会话数据库、后台索引或自动 hook，不强制固定模型/多代理，也不恢复“每任务必须新会话、压缩等于失败”的已否决规则。不将本次分析扩大为 npm 发布、生产操作、ops 发布迁移、所有任务自动 explainer 或其他宿主格式承诺。

关闭前必须同时满足：所选运行任务各有真实验收；Login 兼容性失败已解除；方法迁移没有重复 owner 或失效入链；清单审阅依据与实际采用一致；未采纳和延期内容明确保留原因。只完成材料同步或只写完计划，均不足以关闭本 Issue。完整正文、讨论和实施附件归同一 Change，最终 `evidence.md` 汇总实际完成范围与未验证事项。

