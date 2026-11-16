# dev-handoff：来源、完整复核与必要适配

日期：2026-11-15。仓库来源基线：`e058268749db6dcfcf3dca89b0134529be195442`。本轮按用户最新要求，把交接、会话接续和明确暂停独立为 `dev-handoff`，同步调用关系、文档和映射，并完成实施与 PR。用户明确要求以成熟方法为依据、尽量复制复刻，只作必要融合；本技能只属于 dev 域，与 system 域的运行或调度能力无关。

## 来源角色与范围

- 方法本体直接采用已有 Matt handoff、pstack session-pickup 和 pause-safely 的完整原件及中文底稿。原件、译文和来源固定版本均不变，本轮不进行材料同步。
- OpenAI 与 Anthropic/Claude 官方资料用于核对上下文提供、长期任务记录和技能组织原则；只记录采用原则及对应运行位置，不移植 SDK、harness 或整篇文章，不新增不完整的材料快照。
- 不实现会话日志定位、会话格式解析、后台 Agent 启动或多智能体调度。本轮不采用 Matt 的试验性 `in-progress/claude-handoff` 启动命令，也不新增 Orca 材料来源。
- `dev-workflow` 保留协调和路由职责；完整方法与模板仅由 `dev-handoff` 持有。dev 域状态继续使用 `.agents/dev/`，不引入跨领域状态目录、流程 JSON、固定模型或重复审批。

## 固定原件与中文对照

固定版本以[父清单](../../../../materials/manifest.tsv)为准，逐文件采用关系分别见 [Matt 子清单](../../../../materials/mattpocock-skills/manifest.tsv)和 [pstack 子清单](../../../../materials/pstack/manifest.tsv)。

| 来源方法 | 固定提交、来源根与 Git blob | 本地完整原件与中文底稿 |
| --- | --- | --- |
| Matt handoff | 仓库 `mattpocock/skills`；提交 `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`；根 `skills`；blob `a224edc643a20ddb989f9bca1547440169159810` | [原件](../../../../materials/mattpocock-skills/upstream/productivity/handoff/SKILL.md)、[中文底稿](../../../../materials/mattpocock-skills/zh/productivity/handoff/SKILL.md) |
| pstack session-pickup | 仓库 `cursor/plugins`；提交 `2eaf46574b25cdf7ef8c849837099b866b7438ce`；根 `harness/pstack`；blob `876b1433828ccc7c874123cdf300240abb285dd9` | [原件](../../../../materials/pstack/upstream/claude-code/skills/poteto-mode/playbooks/session-pickup.md)、[中文底稿](../../../../materials/pstack/zh/claude-code/skills/poteto-mode/playbooks/session-pickup.md) |
| pstack pause-safely | 与上行同仓库、提交和根；blob `9d1c5f8303976fff40de099f7f28185909430c11` | [原件](../../../../materials/pstack/upstream/claude-code/skills/poteto-mode/playbooks/pause-safely.md)、[中文底稿](../../../../materials/pstack/zh/claude-code/skills/poteto-mode/playbooks/pause-safely.md) |

本轮另核对 Matt 当前 `main` 提交 `5863806dd4e15c63174bee4e7515a4256792ecfa` 中的 handoff，blob 与本地固定版相同；pstack 当前 `main` 的两份方法也返回相同 blob。这只是确认本轮所用方法未落后，不把父清单的来源版本或其他运行方法一并前移。

本地三份原件的 Git blob、SHA-256 以及对应三份中文底稿的 SHA-256 已重新计算，均与子清单一致。这个检查只证明字节身份，下面的逐段对照才说明内容和适配。

## Matt handoff：完整方法的保留

运行归属：[handoff-method.md](../../../../skills/dev/dev-handoff/references/handoff-method.md)。生成物模板：[handoff.md](../../../../skills/dev/dev-handoff/assets/handoff.md)。入口和宿主元数据分别为 [SKILL.md](../../../../skills/dev/dev-handoff/SKILL.md)、[openai.yaml](../../../../skills/dev/dev-handoff/agents/openai.yaml)。

| 原件位置与原意 | 中文底稿核对 | 运行版实际保留的内容 | 必要适配与依据 |
| --- | --- | --- | --- |
| frontmatter：名称、用途、下一会话重点提示、禁止模型自动调用标记 | 四项均保留在底稿 | 清楚说明交接、接续与暂停触发；参数表示下一会话重点 | 按仓库规范只保留 `name`、`description`；使用 `dev-` 前缀，重点提示进入正文；不复制宿主专用 frontmatter 字段 |
| 正文第 1 段：把当前对话整理成全新 Agent 可接手的交接文档，保存至操作系统临时目录，不写当前工作区 | 完整翻译 `$TMPDIR`、`/tmp`、Windows `%TEMP%` 及排除工作区条件 | 产物是新会话能够读取、据以继续的交接文档 | 本项目统一使用 `.agents/dev/changes/<日期-主题>/handoff.md`；已有任务记录按真实位置引用，避免另起一套任务状态。这里明确改变了上游临时目录规则，依据是领域持久化规范 |
| 正文第 2 段：建议技能必须在文档内部 | 完整保留 Skill 工具语境 | 文档内列出接手阶段适用的技能和用途 | 限 dev 域；按宿主真实技能加载能力使用，不把特定工具名或未安装的可选技能变成恢复阻塞 |
| 正文第 3 段：已有规格、计划、ADR、问题、提交、差异不重复抄写，使用路径或 URL | 六类例子和引用要求完整 | 只补缺失的会话决定与理由，已有产物引用真实路径或地址 | 补充引用可读性的实际条件，避免给新会话不存在或不可访问的指针；不把完整材料复制进摘要 |
| 正文第 4 段：敏感内容脱敏 | API 密钥、密码、个人身份信息均保留 | 写入或提供给接收方前移除敏感信息 | 这是原方法的一部分，不另加无关安全审查流程 |
| 正文第 5 段：参数描述下个会话的重点，交接据此调整 | 完整保留 | 下一会话重点在文档中显式可见，决定选择哪些相关信息 | 不把参数解释成新任务、固定阶段或自动启动指令 |

旧模板没有“建议使用的技能”栏目；本次模板补齐，避免方法要求只停留在正文或聊天回复中。此要求也有 [Matt Issue #201](https://github.com/mattpocock/skills/issues/201) 的使用反馈佐证。模板的进度、验证、当前状态、下一步和注意事项来自下述 pstack 暂停记录清单；不是另造一套交接协议。

## pstack session-pickup：五步与接续回执

运行归属：[session-resume.md](../../../../skills/dev/dev-handoff/references/session-resume.md)。

| 原件位置与原意 | 中文底稿核对 | 运行版实际保留的内容 | 必要适配与依据 |
| --- | --- | --- | --- |
| 开头责任声明：负责恢复点，读取前任轨迹，不重做 | 完整保留 | 先继承已完成工作，再定位未完成部分 | 接续是已有任务的继续，不重新开启需求、计划和实施阶段 |
| 第 1 步：找已有轨迹；工作区内记录、云会话地址或已推分支；先概览/末尾，再查决策点；长记录可委派压缩 | 顺序、来源例子、工作区隐私边界、上下文管理和宿主推理配置均完整翻译 | 从现有交接与任务记录开始，只读当前任务相关材料；先理解停点，再按需追溯；长材料可由实际可用的子智能体提取相关时间线 | 不要求定位特定宿主日志，不跨项目搜索私人会话；删除固定 Cursor 路径、原包章节名与推理速度绑定，保留实际能力适配 |
| 第 2 步：重建分支、工作树、已落地内容、待办和决定，抵抗重新推导 | `git log`、对基础分支 `git diff` 及各项状态完整 | 使用已有轨迹为恢复起点，并检查当前仓库状态 | 沿用现有仓库适配：当轨迹与可核对的新事实矛盾时更新事实；不把先前摘要变成覆盖现状的绝对权威 |
| 第 3 步：比较交付与计划，明确恢复点，避免重跑先前复现和已完成工作 | 完整保留“不从头验证”的反例 | 只对变化、矛盾、缺失证据或实际剩余风险扩大复核 | 将原文绝对措辞与第 5 步真实验证要求衔接，不因接手而重跑所有工作，也不因前任说通过就免除必要核对 |
| 第 4 步：路由剩余工作；继续执行、交付建议、认可/推翻结论、复盘失败；接续方法结束 | 四类去向和退出边界完整 | 说明下一步由当前负责人或对应 dev 技能继续 | 不保留不存在的“本包执行支持”或强制 `dev-workflow` 前提；只有当前任务确实需要时才调用对应 dev 方法 |
| 第 5 步：在真实产物上按原始目标验证，前任自报不是证明 | 完整保留证明原则 | 核对实际证据以及尚未满足的原目标，不重复已充分验证的工作 | 把原包原则名称落成可执行的本地要求；代码说明现状，用户目标说明期望，二者不混同 |
| Reply：前任停点、继承/重做内容、恢复点和结果 | 完整保留 | 给出接续位置和实际行动；重做需有具体理由 | 不把读取交接文件冒称所有任务已完成 |

## pstack pause-safely：明确暂停的四步

运行归属：[safe-pause.md](../../../../skills/dev/dev-handoff/references/safe-pause.md)。

| 原件位置与原意 | 中文底稿核对 | 运行版实际保留的内容 | 必要适配与依据 |
| --- | --- | --- | --- |
| 开头责任声明与反例：只有明确要求才暂停；继续、睡觉但继续、不要停均不暂停 | 责任声明和三个反例完整 | 保存检查点与明确暂停分开；保存后仍按当前授权推进 | 修复旧工作流把即将压缩与暂停绑定的冲突，不新增询问或自动终止 |
| 第 1 步：当前原子步骤完成或回退；不启动新工作，取消嵌套子智能体 | 完整保留 | 停在安全边界，处理本任务仍在运行的工作 | 限本任务拥有的修改、进程和子任务；不误撤销用户修改或终止无关任务 |
| 第 2 步：不为暂停采取不可逆动作；不开新 PR、不新增推送 | 完整保留 | 暂停本身不产生额外提交、推送、PR 或发布授权 | 已有任务授权与后续动作按真实任务继续判断，不另立审批流程 |
| 第 3 步：让修改持久化，当前分支一个清楚的 `wip:` 提交；损坏树在提交正文说明 | 完整保留 | 修改留在磁盘，并准确记录分支、提交、未提交状态和损坏状态 | 沿用本项目已有适配：只有项目允许且授权包含提交时创建 `wip:` 提交；否则保留工作树并说明，不混入他人修改 |
| 第 4 步：写上下文外恢复记录；意图、正在做什么、进度/验证、当前状态、下一步、关键文件、注意事项；已有轨迹只引用 | 八项内容、压缩触发的临时路径例子、已有轨迹引用完整 | 使用同一任务的交接文档记录必要信息，保留已存在的决策轨迹导航 | 临时路径改为 dev 持久位置；避免生成互相冲突的第二份恢复状态；保留压缩前记录能力但不误触发暂停 |
| Reply：循环位置、磁盘与尚在上下文的信息、路径、提交/干净状态、恢复第一步；暂停不是最终报告 | 完整保留 | 清楚说明暂停位置、已保存资料、未提交修改和首个恢复动作 | 不输出大段差异，不把尚未交付的任务描述为完成 |

## 调用入口的局部适配

下列三份较大来源只核对与本次交接、接续和暂停有关的段落及其运行差异。修改发生在原有运行归属，不复制它们进入 `dev-handoff`，也不宣称本轮已重新认证整份来源和运行版；这些行的 `runtime_reviewed_blob` 保持原值。

| 固定来源与局部位置 | 实际运行位置 | 本轮保留与必要改动 |
| --- | --- | --- |
| Matt 同上固定提交，`engineering/ask-matt/PHASE-BOUNDARIES.md`；blob `fb58ef9febcfd558cdb4517e370f19034869ba26`；阶段边界、五选项、决策树第 3 项、一手/二手资料 | [phase-boundaries.md](../../../../skills/dev/dev-workflow/references/phase-boundaries.md) | 保留五个选项、按序判断及继续优先的理由。原文将 handoff 严格限制在换宿主、换目录、交同事、分出旁支四类；用户本次明确要求保存现场供稍后继续，因此补入该场景，去掉与之冲突的“完整条件”限制。明确保存不要求切换上下文或暂停；摘要仍有损，引用原始产物后按需读取，不声称所有非继续操作都只剩摘要 |
| Matt 同上固定提交，`engineering/ask-matt/SKILL.md`；blob `4bfeeb61dae548b8b7754c4fba7bd40ab3926099`；原型往返、Context hygiene、Phase boundaries | [workflow-routing.md](../../../../skills/dev/dev-workflow/references/workflow-routing.md) | 保留原型问题与证据往返，以及按阶段整理上下文。把原包 handoff 方法改为调用唯一 owner `dev-handoff`；同步稍后接续场景和保存不暂停的条件，仍按宿主实际能力进行压缩，不要求启动新会话 |
| pstack 同上固定提交，`claude-code/skills/poteto-mode/SKILL.md`；blob `3fb1e551fb5aae18e1ba791da057446e7adb2e84`；Session pickup / Pause safely 两个路由条目 | [operating-method.md](../../../../skills/dev/dev-workflow/references/operating-method.md) | 保留接续与暂停互补的路由关系，方法改由 `dev-handoff` 持有。修复原入口把离线、宿主重启或即将压缩一并视作暂停，与其 pause-safely 正文“只在明确要求时暂停”冲突的问题；明确用户离线仍要求继续时不停，仅需保存时留下交接后继续 |

这些局部变动的根据是本次用户范围、现有方法唯一归属规则、宿主差异及直接的入口/正文冲突，不代表重新设计整套工作流。其他帮助与导航只更新准确技能名称、触发条件和返回原阶段的说明。

## OpenAI 官方方法参考

读取版本：`openai/openai-agents-python` 提交 `64fbde5d02b42ae5f9db668eb0184cdb3fc9d775`。这两份文档是方法参考，没有复制 SDK 代码或整份文档，未建立新的 `materials/` 来源。

| 官方来源与位置 | 本次采用的原则 | 运行位置与适配边界 |
| --- | --- | --- |
| [handoffs.md](https://github.com/openai/openai-agents-python/blob/64fbde5d02b42ae5f9db668eb0184cdb3fc9d775/docs/handoffs.md)，Creating a handoff / Handoff inputs | 明确当前交接的目标与接收方要做的工作；附加元信息不等于接收者全部上下文 | 交接文档和接收说明写清任务、重点及恢复第一步；不移植 `input_type` JSON schema 或 `transfer_to_*` 工具 |
| 同文 Input filters | 传入上下文应围绕接手任务选择；压缩与删除工具项不自动完成敏感内容脱敏 | 与 Matt 的按重点裁剪、避免重复、明确脱敏要求一致；保留必要证据引用，不建立会话历史过滤引擎 |
| [context.md](https://github.com/openai/openai-agents-python/blob/64fbde5d02b42ae5f9db668eb0184cdb3fc9d775/docs/context.md)，Local context / Agent-LLM context | 程序持有的数据不会自动成为模型可见的输入；需要明确提供或按需读取 | 产物完成后提供真实位置及接手说明；新会话必须读取交接和所需引用；不声称写好文件就已被另一个 Agent 接收 |

SDK 的 handoff 是同一次运行中的控制权转交；本技能是面向开发任务的可读交接与接续方法，两者没有相同的运行时契约。SDK 的默认全历史继承、嵌套历史、回调、模型上下文对象和后台转交提示词均不迁入本技能。不能因此声称本技能支持 SDK 等价的自动控制权转移。

## Anthropic / Claude 官方方法参考

核对日期：2026-11-15。以下官方文章与文档是动态页面；文章发表日期说明其背景，不是本项目固定的镜像版本。已阅读全文相关章节并与运行文件核对，不转载文章全文，也不冒称存在官方通用 `handoff` 技能。

| 官方来源与位置 | 本次采用的原则 | 已落地位置与必要适配 |
| --- | --- | --- |
| [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)，2025-11-26；Incremental progress、Testing、Getting up to speed | 新会话通过进度记录和 Git 历史了解现场，再检查关键功能并选择未完成工作；避免把已有部分实现误认为全部完成 | `session-resume.md` 第 2、3、5 步及模板的完成条件、剩余范围、验证与证据。用既有规格/任务和 `handoff.md` 对应演示的任务与进度文件，不新增第二套 JSON 任务状态 |
| [coding_prompt.md](https://github.com/anthropics/claude-quickstarts/blob/4a4224bdf0e9cfb3332167b69c90457403813625/autonomous-coding/prompts/coding_prompt.md)，`anthropics/claude-quickstarts` 固定提交 `4a4224bdf0e9cfb3332167b69c90457403813625`；blob `2af09ad1acb5456866128664a002a38203f4da1d`；接续定位与进度记录部分 | 核对工作位置、规格/任务、已有进度和近期提交，记录已做事项、测试、问题、下一步和整体完成情况 | `session-resume.md` 保留 pstack 原有五步，融合上述现场与证据核对；模板承载相应信息。只作方法对照，不复制 prompt 或 demo；不引入固定 feature 数量、`init.sh`、Python SDK 循环、`git add .`、无条件提交或必须清洁工作树的要求 |
| [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，2025-09-29；Context retrieval、Compaction、Structured note-taking | 保留有用的决定、未解决问题与关键上下文；长期信息写在上下文之外；详细材料用轻量指针按需读取；过度压缩可能丢失重要信息 | `SKILL.md` 的记录与交付、接续边界，以及模板“当前事实与决定”。补充决定的理由、失败尝试和已排除方案，已有日志/规格仍只引用；不声称摘要无损，不复制全部工具输出 |
| [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)，2026-03-24；Why naive implementations fall short、The architecture | 区分结构化交接后的新上下文与同一会话内 compaction；文章根据模型实际表现移除了旧 harness 的强制 context resets | 入口将保存、接续和明确暂停分开，保存后不自动终止；工作流阶段边界按实际宿主能力整理上下文。不采用固定上下文阈值或 planner/generator/evaluator 整套架构，不把某一代模型的实验条件写成通用要求 |
| [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)，Writing effective descriptions、Progressive disclosure、Avoid deeply nested references、Evaluation and iteration | description 说明能力和触发情境；短入口提供按需导航；完整方法一层可达；在真实任务输出上判断效果 | `SKILL.md` 和 `agents/openai.yaml` 区分交接、普通状态汇报和新任务拆分，入口直接链接三个方法及模板。不会把研究文献放进运行包，也不为文案增加虚构确定性脚本；行为验证与结构校验分别报告 |

上述官方方法与 Matt 的紧凑交接文件、pstack 的接续和暂停步骤互补。实现仍以已经镜像、完整翻译的三个方法为本体，没有借“融合”删去原步骤或移植整套长任务运行框架。诚实记录未提交工作、失败检查和仍未满足的目标，是本次对开发现场的必要适配。

## 来源映射与许可

| 子清单行 | 新的唯一 `runtime_paths` | 本轮完整复核对应的 `runtime_reviewed_blob` |
| --- | --- | --- |
| Matt `productivity/handoff/SKILL.md` | `skills/dev/dev-handoff/references/handoff-method.md` | `a224edc643a20ddb989f9bca1547440169159810` |
| pstack `claude-code/skills/poteto-mode/playbooks/session-pickup.md` | `skills/dev/dev-handoff/references/session-resume.md` | `876b1433828ccc7c874123cdf300240abb285dd9` |
| pstack `claude-code/skills/poteto-mode/playbooks/pause-safely.md` | `skills/dev/dev-handoff/references/safe-pause.md` | `9d1c5f8303976fff40de099f7f28185909430c11` |

本轮不变更三份原件和中文底稿的字节、blob、摘要或父清单版本。迁移前的历史路径由 Git 历史和资源移动表记录；旧 owner 不保留第二份完整正文。Matt 的 `in-progress/claude-handoff` 继续没有运行采用关系。

Matt 和 pstack 已有完整 MIT 许可分别位于 [Matt 许可](../../../../licenses/mattpocock-skills-MIT.txt)和 [pstack 许可](../../../../licenses/pstack-MIT.txt)；本轮仅扩充集中第三方说明中的适用范围，不移除已有法律文件。OpenAI、Anthropic/Claude 文章仅作原则参考，引用和说明不代表全文复制许可；运行技能不放作者、来源 URL 或致谢。

## 本次复核结论与限制

已完成三份原件、三份中文底稿、固定清单及新运行包六个文件的逐段核对。Matt 五个正文段落均保留；pstack 会话接续的责任声明、五步与回复要求，以及安全暂停的明确触发、反例、四步与回复要求均保留。路径、授权、宿主能力、域边界及证据矛盾处理的改变已逐项说明，模板也已承接建议技能和下一会话重点。

因此主三方法可以按上表更新 `runtime_reviewed_blob`，依据是本次完整对照与实际运行内容核对，不只是文件移动。三个较大来源入口只进行了上述局部路由核对，不能前移其完整运行核对依据。OpenAI 与 Claude 的方法参考不产生伪造的材料清单行。

本文记录来源保留和必要适配，不代替运行验证。结构校验、隔离安装检查和实际行为样例应在本次验证记录中分别说明；不以字段数量或文档更长证明技能更有效，也不将静态审查冒称三个宿主上的实际会话移交测试。
