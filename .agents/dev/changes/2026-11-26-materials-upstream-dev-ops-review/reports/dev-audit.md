# dev 领域上游差异审计与实施建议

审计日期：2026-11-26。运行基线：`NAMEWTA/skills-hub@f23ba949826c4b6cac480280ff306cdd28681f39`（0.1.35）。pstack 新基线：`cursor/plugins@b1fbf4b60ac6813b4583ccc356850dafcf492665`，选定根 `harness/pstack`。本文件是调查与 Issue 计划输入，没有修改运行技能、没有宣称运行适配完成。

## 1. 先纠正一个容易误判的事实

用户指出的三个能力在当前运行域中已经部分或完整存在。正确方向是修复调用入口和会话证据链，并有选择地吸收最新变化，不能按上游名字再复制三套相同技能。

| 上游能力 | 当前真实归属 | 判断与建议 |
| --- | --- | --- |
| `correct` | `dev-guardrails/references/recurring-corrections.md` | 已保留错误分型、架构→类型/机械检查→行为验证→判断说明、历史错误反证等完整方法。增强会话纠正证据输入和路由；不新增重复 `dev-correct`。本轮上游 blob 未变。 |
| `recall` | `dev-learn/references/context-recall.md` | 完整方法存在，但 `dev-learn` 的描述和主入口是理解/教学，`dev-workflow` 也没有直接的跨会话回忆行，用户难通过自然语言稳定发现。建议把这份方法迁到唯一新入口 `dev-recall`；从 learn 删除方法副本，保留按需交接。 |
| `reflect` | `dev-archive/references/parallel-retrospective.md` 与 4 份评审模板 | 已有完整流程；最新上游大幅减轻默认流程。建议保留 `dev-archive` 作为 owner，明确“仅反思”“知识维护”“Change 收尾”三个动作，默认单个执行者，复杂任务才用独立视角。不新增重复 `dev-reflect`。 |
| Claude Code 宿主适配 | `dev-help/references/harness-adapter.md` | 当前只说核实路径，缺少具体会话获取方式。将会话定位和读取的完整方法置于 `dev-recall` 包内，通用工具适配仍由 help 保留；help 不再承载第二份会话规则。 |
| 指定旧任务接续 | `dev-handoff/references/session-resume.md` | 保持。它恢复工作区/分支/未完成目标并继续执行；recall 只重建信息，不启动/恢复 CLI 进程。 |
| 个人偏好提炼/技能编写 | `dev-personalize` | 保持。已有明确授权范围、证据去重和当前明确要求优先；调用 recall 的限定证据结果，不重复维护日志扫描。 |
| 历史设计理由 | `dev-why` | 保持。它追问“为什么当时这么决定”；recall 追问“现在做到哪里”，二者输出与事实层不同。 |

当前没有 `dev-knowledge`，项目知识 owner 是 `dev-archive`。不要在 Issue 中把不存在的技能当现有改造对象。

## 2. 上游本轮发生了哪些关键变化

### 2.1 reflect 的变化值得直接吸收

新版 `reflect/SKILL.md` 从指定三位评审者和综合者，缩为完整阅读目标会话、提取稳定经验、对照实际使用过的技能、输出 Accepted/Rejected/Backlog。四个 reviewer/synthesizer 源文件已删除。运行版当前仍以“三视角→综合”为常规步骤，即使不并行也必须顺序完成三个视角，简单反思成本过高。

建议默认执行者直接阅读全文，按纠正、工具经验、缺失上下文、跳过的验证、漏触发技能五类筛选，复用已存在规则；仅当记录很长、结论相互冲突、影响面跨多个 owner 或用户指定独立复核时，启用可选三视角。保留现有模板作为本仓按需资源；不因上游删除就丢掉仍有价值的审查方法。可将 `parallel-retrospective.md` 改名为 `reflection-method.md`，更新所有引用与迁移夹具；名称反映当前默认行为。

旧 `session-retrospective.md` 是另一来源的开发环境复盘清单，与 reflect 有交叉但不完全同义：保留导航、已有自动检查失效、信息访问、昂贵工具等独有观察角度，合并重复的授权/落点/输出规则。删除其“所有工作必经实施和审查”“规则文件必然加入所有代理上下文”等绝对表述，服从实际宿主加载、任务成本和现有工程方法。

上游强制再次批准、永不 PR/push，以及自动投递 backlog 的策略不照搬。本仓已用当前任务的真实授权处理这些动作，应该继续保持。

### 2.2 recall 降低了对 why 内部布局的耦合

新版 recall 不再绑定 why 的逐来源调查模板，而是按可用来源调查当前状态、失败尝试与仍在发生的问题。这有助于单独安装使用。dev-recall 应自带本项目会话证据读取和当前 Git/Issue 状态核对方法；仅在确需历史理由调查时交给 `dev-why`。缺一个可选 owner 不应阻塞已有材料的回忆。

仍须保留时间/主题/工作区边界、当前会话排除、主会话/子代理区分、PR/Issue 现状核实、空结果与覆盖缺口。用户已给完整状态胶囊时不重复扫描。

### 2.3 pstack 的路径内容本身需要适配，不能当成稳定规范复制

最新版适配文档仍把 Claude 项目 slug 简化为只替换 `/` 与 `.`，并说目录中最新 JSONL 就是当前会话。官方当前 sessions 文档明确：路径按所有非字母数字字符编码，长路径会截断并加 hash；`CLAUDE_CONFIG_DIR` 改变根目录，特定配置可用 `CLAUDE_CODE_PROJECT_DIR_NAME` 命名项目目录；原始 JSONL 是随版本变化的内部格式。见官方来源 [C1]。

因此材料中文应忠实翻译上游，运行适配必须额外校验。mtime 只能排序候选，不能证明当前会话身份；恢复或复制旧文件、并发会话、子代理或 session 分叉都可能使“最新”选择出错。第一行也可能是元数据，不能硬编码 `message.content[0].text` 必为开场用户提示。

### 2.4 worker.md 与 Fresh subagents 默认不能全量照搬

新版 `poteto-mode/worker.md` 强调把用户目标、验收边界传递给下级执行者；这一点可映射到现有 `dev-parallel` 简报方法。具体规则中夹杂作者的个人策略：永远开 ready PR、固定 PR 40 行、不能提任何问题等，不是本仓通用要求。

新版 poteto-mode 主入口还把后续任务、fix round 和 retry 默认分给全新子代理。当前仓库已经为了 #15 明确 task 与 session 独立、一个 session 可处理多个 task、正常压缩不触发换人。必须保留本仓决定，不引回“每票新会话”“压缩即失败”或固定模型。

### 2.5 新 reframe 不需要再造独立同义技能

新增 `reframe` 从用户原始文件与描述建立术语，区分可能的不同问题，引用真实项目/论文校验术语，再重写请求。建议作为 `dev-sharpen` 的可选“术语澄清与重述”分支，原请求含歧义时才读取；实际术语教学可交 dev-learn，项目已确认术语写 glossary 的方法仍归 archive。不对每次需求强制 8–12 个术语或 2–3 个邻近领域。

### 2.6 architect/how/why 与 orchestrate 的删除要按本仓用途评估

上游删掉 architect 三份参考、how 两份提示、why 十二份调查参考和 poteto orchestrate。运行版分别仍承载架构候选、带证据教学、来源调查和多执行者协调。新上游的极短主文件并不能替代本仓这些完整的方法合同。

结论：材料树按新提交删除；运行方法先分类为仍使用/有独有内容/完全重复/失效。保留适用方法并记录其旧来源身份，去掉重复引导，默认工作流变轻；只删除有明确替代、所有调用已迁移且验证通过的文件。上游 `check-plan.mjs`/测试本来没有 runtime_paths，本轮删除它们不意味着要删除 dev-program 的 DAG 或本地票据验证。

### 2.7 dev-statechart 存在本轮可以准确移植的代码改进

对照了本仓五个实际文件并验证其 Git blob 与固定基线一致。以下上游逻辑当前尚未具备。其中 Mermaid 绘图已经在同步后的 Login 回放中确认不兼容，列为 P0；其他差异列为 P1 独立任务：

| 上游变化 | 本仓落点 | 实施要点 |
| --- | --- | --- |
| Mermaid `drawnEdges` 重排复合状态的入口边，正确显示父子状态及内部初始箭头 | `scripts/backends/mermaid.mjs` | 只调整绘制表达，保持语义图/标签/违规标记；覆盖多个外部来源与内部跨状态边，不能一律合并。 |
| `splitLines` 统一处理 CRLF 与末尾 CR | `scripts/frontends/dot.mjs`、`scripts/run.mjs` | 同时覆盖字符串输入、分块读文件、流输出；避免 Windows 日志行尾干扰匹配。 |
| SANY XML 导出失败时补取具体语法错误 | `scripts/run.mjs` | 保留原失败状态和有限错误摘要，不把 XML 管道失败误报为规则不满足。 |
| Java stdout/stderr 显式 UTF-8，Windows 隐藏子进程窗口 | `scripts/run.mjs` | 服从现有 Java/TLA2TOOLS 本地依赖合同，不加入 mise/联网安装。 |
| 主进程通知 janitor worker 已退出；Windows 不再对已退出 worker PID 调 taskkill | `scripts/statechart.mjs`、`scripts/cleanup.mjs`、`scripts/process-lifecycle.mjs` | 本仓已经有 Node 跨平台 cleanup 和 TMP/TEMP；在现有结构上修正生命周期，避免引回 shell 和重复 kill 模块。PID 复用风险需要退出/异常场景验证。 |

以上为源码差异审计，未执行新 TLC 求解、未声称在 Windows 实测。上游 compare API 文件列表达到 300 上限，完整增删集合必须使用两端 Git tree；本文不以 compare 列表证明全集。

## 3. 推荐的目标职责

仅新增一个公开入口 `dev-recall`。不要新增 `dev-correct`、`dev-reflect`、`dev-memory` 或面向全 domain 的强制会话中心。

| 用户自然请求 | 负责入口 | 输出 |
| --- | --- | --- |
| “回忆这周在导出功能上做过什么，哪些还没解决” | dev-recall | 有会话/PR/Issue/提交来源的当前状态简报及一个下一步 |
| “从这个 handoff 接着做” | dev-handoff | 核实恢复点后继续原任务 |
| “解释当前导出流程” | dev-learn | 当前机制、代码入口、失败边界和导读 |
| “为什么当时选择这套方案” | dev-why | 当时证据、取舍、推断及缺口 |
| “这个错误我纠正三次了，避免再犯” | dev-guardrails | 错误类别、最高有效约束、真实失败与合法场景证据 |
| “反思这次会话，改进技能” | dev-archive 的反思分支 | 接受/拒绝/待办，按授权落实技能或知识改动；不归档未完成 Change |
| “把我稳定的工作习惯做成技能” | dev-personalize | 有来源且不过拟合的项目技能 |
| “告诉我进度” | dev-status | 供人阅读的实际进展，必要时使用 recall 证据，随后继续原任务 |

## 4. Claude Code 会话证据适配合同

这是建议实施合同，不是当前已存在接口。

1. **先取明确身份。** 优先当前上下文/用户已给的 transcript path、session ID、导出文件；现有 hook 或 status line 输入可提供 `transcript_path`、`session_id`、`cwd`。不要求先安装 hook，也不以 `claude --resume` 发起新模型调用来“读取历史”。[C2]
2. **再定位本项目候选。** 需要发现时读取当前配置根、实际 cwd、已知项目目录；优先已有官方只读会话接口。SDK 已安装且适用时可使用 listSessions/getSessionMessages，无须把 SDK 变成全套 dev 的硬依赖。[C3]
3. **保留可检查的原始读取后备。** 用户要读 JSONL 时提供 Node 22 只读辅助工具，包内资源齐全；明确支持的实际记录形态，流式解析，未知类型/缺字段/残缺尾行有可见诊断，不能静默把损坏记录当完整结果。禁止 exec/eval 日志字段。原始 schema 随宿主版本变动，无法识别时降级为用户提供导出或现有 handoff，不猜测执行结果。
4. **定位与授权分离。** 只读指定项目与时段。路径规范化、symlink、工作树身份与 session 记录相互核实；不能把 `~/.claude/projects/*` 全局内容当默认搜索范围。多 worktree 只有在目标范围明确包含时扩展。
5. **不把最新文件当当前会话。** session ID 优先，mtime 仅排序；缺 ID 时结合已知开场/目标和记录元数据核实；不唯一就报告候选与缺口，不静默取一个。
6. **区分记录种类。** 主会话、子代理、eval/test、fork/分支、元数据、压缩摘要、工具调用与结果分别处理。子代理仅在调查父任务实际行为时按链接读取；不把同一事件的主/子记录算多次独立纠正。
7. **区分事实强度。** 用户目标、代理计划、调用尝试、工具成功、实际状态、用户纠正不同；只有“打算运行 npm test”不能证明测试运行。消息被压缩、保留期清理或关闭持久化都应显示覆盖缺口。[C1]
8. **低上下文成本。** 固定主题和时间先检索候选，再读有关区段；reflect 针对当前目标会话要求完整审查时分块覆盖，并保留覆盖情况。不能将“截取最后 N 行”描述成全文审查。
9. **读完核对当前项目。** Git 状态、分支、PR/Issue 与必要环境事实优先于旧会话中对现状的自述；当前用户决定仍决定目标。
10. **不给其他宿主套 Claude 格式。** 首轮支持已核实的 Claude 适配和显式提供的文本/JSONL 记录；其他 CLI 只用已公开工具/导出及对应适配，不承诺 Codex/Pi/Gemini 共用路径或 schema。

没有日志时仍可依靠当前对话、Change、handoff、Git 与授权的远端资料工作，输出覆盖范围。此缺失不阻塞与历史无关的已授权工作。

## 5. 持久化合同

原始会话不是第二套项目真相库，不新增全量 transcript 仓库或数据库。

| 内容 | 位置 |
| --- | --- |
| 原始 Claude 会话 | 保留在宿主自己的位置，不自动复制入 Git |
| 当次读取/调试输出 | `temp/dev/<本次主题>/`，可重建、不提交 |
| 用户明确提供且构成需求来源的会话导出/必要摘录 | 所属 Change `source/`，经范围核对与脱敏，保留来源身份和版本；沿用 dev-issue-setup 的共同来源合同 |
| 正式回忆或复盘结论 | 有实际保存需求时写所属 Change `recall.md`/`retrospective.md`，引用证据，不必每次闲聊建 Change |
| 长期错误经验 | `.agents/dev/notes/errors/<topic>.md` |
| 执行规则、适用背景 | `.agents/dev/notes/context/<topic>.md`，AGENTS 只导航 |
| 真正架构决定 | `.agents/dev/notes/decisions/` |
| 确认后的领域词汇 | `.agents/dev/notes/glossary.md` |
| 个人工作方式或通用技能改动 | 用户指定源仓库 `skills/dev/...`，不改 `.claude/plugins/cache` 或其他宿主管理缓存 |

只在真实内容出现时创建文件。新技能每次激活显式读取 `.agents/dev/AGENTS.md` 和本任务相关目录说明，不声称任意宿主会自动递归加载。来源回忆不等于自动持久化规则；长期规则必须包含适用范围、来源、反例/例外及何时重验。

## 6. 文件级实施计划

### D1：确定唯一方法归属并建立 dev-recall

- 新建 `skills/dev/dev-recall/SKILL.md`、`agents/openai.yaml`、必要包内 `references/`、简报模板及 Node 读取工具。
- 从 `dev-learn/references/context-recall.md` **迁移**完整方法并按新上游更新；从旧处移除正文，只在 learn 入口/索引留下交接说明。
- 完整会话获取与 Claude 适配只在 recall 包维护；help 保留通用工具适配与简短用途说明。
- 更新 `dev-workflow/SKILL.md`、`references/method-handoffs.md`、dev-help 的 capabilities/guide-understanding/guide-personal/recipes、dev-status 与 dev-personalize 的方法指针。
- `dev-handoff` 保持独立安装可用；只有查找历史线索才按需调用 recall，不形成必须先装 recall 才能恢复 handoff 的依赖。

### D2：实现并验证会话定位、读取与证据边界

- Node 工具放 dev-recall 包内，不放全局共享 runtime，且无后台常驻/自动 hook。
- 接口围绕显式文件/项目/时间/主题/会话身份；默认 stdout 只读。任何辅助缓存必须可重建，位于 temp/dev。
- 保留实际 line/message UUID 或宿主返回的消息身份、时间、来源文件，返回“已检查范围/未知记录/截断”等信息。
- 先用脱敏合成夹具与不同项目隔离目录验证，真实 CLI 支持再做一个已授权本项目 smoke；明确没有实测的宿主/平台。

### D3：把纠正证据连到 dev-guardrails

- 调整 guardrails 入口场景，使“你又犯了同样错误”“按我纠正过的改进”能直接触发。
- `recurring-corrections.md` 新增可选会话证据输入：一个事件一个身份、用户纠正与代理推断分开、历史错误与当前规则对应。
- 建立薄的纠正记录表：错误类、独立事件、范围、当前机制、选择层级、反证/正例、剩余风险；沿用现有 constraint 模板和 notes，不新增台账 JSON。
- 保留现有架构/类型优先及不机械新增 lint 的取舍；结构已保障时删重复指令但保留理由。

### D4：让反思与收尾解耦，吸收上游减轻流程

- `dev-archive/SKILL.md` 先按“反思/知识维护/Change 收尾”分支，不把反思视为结束任务。
- 默认单执行者完整审查目标记录；复杂情况才使用现有三视角模板，沿用当前可用资源，不强制独立综合 Agent。
- 合并 session-retrospective 与 reflection 中重合的治理段；保留各自独有检查方向。
- 接受项路由到真正 owner：技能描述/方法→dev-personalize；机械约束→dev-guardrails；项目知识→archive 原有分区；Bug→dev-debug。不把所有问题都写成提示词。
- 已授权的清楚小改动继续执行；不自动创建外部工单、发消息、改插件缓存或重复索要批准。

### D5：有选择地吸收新上游工作方式

- dev-sharpen 增加术语澄清分支，链接先实际打开并核实；未确认术语不写成强制业务定义。
- dev-parallel 现有简报增加验收边界和后续指令传递检查，不另建 worker 协议源。
- 对 architect/how/why/orchestrate 删除文件出一份“保留/合并/删除/理由/替代路径”表，保留独有方法，删除重复包装。
- 保持本仓 task/session 解耦、显式团队配置、当前授权、既有 draft/ready 决策；拒绝引入固定模型与上游个人模式。

### D6：单独升级 statechart 的行为修复

- 按第 2.7 节在现有 Node `.mjs` 代码移植绘图、CRLF、SANY 编码/错误和清理退出逻辑。
- 沿用本仓模型/代码映射、TLA2TOOLS 本地依赖、temp/dev 输出边界、退出码与非空目录保护。
- 更新固定 corpus 回放差异的期望；真实 TLC 求解与静态 captured-output replay 分开报告。

### D7：映射、说明和交付验证

- 更新 `docs/development/method-ownership.md`、workflow 文档、`docs/reference/knowledge.md`、persistence-roots、help/安装迁移与 UI 元数据。
- 更新 `materials/pstack/manifest.tsv` 的实际运行落点；只对已经全文核对且验证的具体映射前移 reviewed blob。材料同步完成不能批量标运行升级完成。
- 上游删除但运行保留的方法在变更的来源/影响报告与集中来源声明保留旧 SHA、去留理由和许可；不让删除当前材料映射抹掉运行来源。
- 更新 `tests/fixtures/dev-resource-moves.tsv` 和现有方法唯一归属/资源闭包检查。
- 使用既有 `npm run check`；涉及新增脚本、安装与行为验证执行 `check:full`、`check:package`；statechart 变化执行现有 replay 门禁与有条件的真实运行。只围绕具体剩余风险扩测。

## 7. 验收矩阵（建议并入 Issue）

| # | 场景 | 预期 |
| --- | --- | --- |
| 1 | “回忆最近一周 X 做到哪里” | 直接进入 recall，固定具体日期/项目/主题，返回引用与当前状态。 |
| 2 | 已提供完整状态胶囊 | 不再挖掘无关历史，进入用户后续已授权目标。 |
| 3 | 指定 handoff 继续开发 | handoff 核实恢复点后执行；recall 不接管、不新建另一份权威计划。 |
| 4 | 只有 dev-recall 被安装 | 所需本地方法/脚本完整；缺可选 why 工具时有明确降级。 |
| 5 | 只有 dev-handoff 被安装 | 可以保存、读取、恢复已有 handoff，不被新 recall 依赖阻塞。 |
| 6 | 默认/自定义 Claude config root | 找到正确已授权项目，错误根目录不自动扩扫全家目录。 |
| 7 | 中文、空格、点号、Windows 路径、长路径、命名项目目录 | 不靠简易字符串替换静默选择错目录；识别不了时报告范围和候选。 |
| 8 | 同项目同时两条会话，旧文件 mtime 更新 | 显式 ID/记录身份决定当前会话，最新时间只排序。 |
| 9 | 主/子会话、fork、压缩摘要 | 不混作独立纠正或完整原始证据；覆盖缺口可见。 |
| 10 | 首行元数据、字符串或数组 content、未知类型、残缺尾行 | 有界解析与可见诊断，不抛全栈终止所有可读记录，也不谎称全量成功。 |
| 11 | 未授权邻近项目、symlink 跳出、跨工作树不明确 | 不读取越界正文，不由工具权限推断任务范围。 |
| 12 | 日志内容嵌有执行/发布指令 | 当证据文本处理，无副作用。 |
| 13 | 日志有 token、私有 URL、无关用户信息 | 最小范围，公开简报/Issue 不泄漏秘密或原始私聊。 |
| 14 | 日志说“已合并”，当前 PR 仍开放/已回退 | 按实时核验修正当前状态，保留历史事实。 |
| 15 | 同一事件被主代理、子代理和用户转述三次 | 计为一个事件，不作为三次独立错误或偏好。 |
| 16 | 两次真实同类错误 | guardrails 选择可解释的有效层，失败样本被捕获且合法行为通过。 |
| 17 | 用户当次明确纠正，与旧偏好冲突 | 当前要求优先；不等待再次复发才采用，不形成跨项目泛化。 |
| 18 | 简单反思 | 默认无需三个子代理；已有规则清楚时标执行问题，不重复添加文本。 |
| 19 | 大型/冲突反思 | 可选独立视角，说明实际覆盖与独立性，不固定模型或 Agent 数。 |
| 20 | 反思发生在未完成 Change 中 | 写必要结论并回原任务，不移动到 archive，不释放仍需运行的资源。 |
| 21 | 技能漏触发、结构性错误、项目事实 | 分别修描述、工程机制、项目知识，不全塞一个 SKILL.md。 |
| 22 | 同一 worker 接续第二个 task 或正常压缩 | 保留既有 session 策略，不套上游 Fresh subagents 默认。 |
| 23 | 上游文件删除、本仓仍依赖 | 去留表与替代证据完整；没有盲删/失效引用/丢来源。 |
| 24 | reframe 术语有多个候选 | 先辨别问题与依据，再重述；无填满数量的术语噪声。 |
| 25 | statechart 嵌套状态/多个外部入边 | 图正确表达复合状态入口，标签与语义边不丢失。 |
| 26 | CRLF、非 ASCII 错误、SANY 解析失败 | 正确读行/编码，报具体失败，不输出虚假验证通过。 |
| 27 | worker 正常结束、异常结束、父退出、Windows | 只清理本次仍归属进程/目录，已结束 PID 不被当活进程再次强杀。 |
| 28 | 材料已更新但运行仅制定计划 | reviewed blob 不冒进；报告明确区分同步、分析、实施和验证。 |

## 8. 本次审计的来源

### 当前仓库（固定运行基线）

- [方法归属](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/docs/development/method-ownership.md)
- [知识与记忆](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/docs/reference/knowledge.md)
- [现有 recall](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/dev/dev-learn/references/context-recall.md)
- [现有 correct](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/dev/dev-guardrails/references/recurring-corrections.md)
- [现有 reflect](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/dev/dev-archive/references/parallel-retrospective.md)
- [现有宿主适配](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/dev/dev-help/references/harness-adapter.md)
- [现有会话接续](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/skills/dev/dev-handoff/references/session-resume.md)
- [现有 statechart](https://github.com/NAMEWTA/skills-hub/tree/f23ba949826c4b6cac480280ff306cdd28681f39/skills/dev/dev-statechart/scripts)
- [现有来源映射](https://github.com/NAMEWTA/skills-hub/blob/f23ba949826c4b6cac480280ff306cdd28681f39/materials/pstack/manifest.tsv)

### pstack 最新固定提交

- [Claude Code adapter](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/docs/harness/claude-code.md)
- [correct](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/correct/SKILL.md)
- [recall](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/recall/SKILL.md)
- [reflect](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/reflect/SKILL.md)
- [reframe](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/reframe/SKILL.md)
- [worker](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/poteto-mode/worker.md)
- [poteto-mode](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/poteto-mode/SKILL.md)
- [statechart](https://github.com/cursor/plugins/tree/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/skills/statechart/scripts)

### 官方 Claude 边界（核对于 2026-11-26）

- [C1：Manage sessions](https://code.claude.com/docs/en/sessions)，会话存放、内部格式、可配置性与写入/保留边界。
- [C2：Hooks reference](https://code.claude.com/docs/en/hooks)，`session_id`、`transcript_path`、`cwd`、子代理记录，以及部分版本 Stop 时最终消息尚未写入 transcript 的限制。
- [C3：Agent SDK sessions](https://code.claude.com/docs/en/agent-sdk/sessions)，会话读接口与接续的区别。
- [C4：Claude directory](https://code.claude.com/docs/en/claude-directory)，Windows/custom config 路径与应用数据。

父代理如需在最终聊天使用网页引用，须自己打开以上官方页面。正文中的路径/行为建议均是本仓适配判断，不能写成上游自动提供的保证。
# 补充：同步后已实证的优先缺口

最新 pstack 材料已完成 b1fbf4b60ac6813b4583ccc356850dafcf492665 同步后，运行仓库已有 `npm run check:statechart` 返回 exit 1：Login 的图边断言失败，本地 `s0 → s2` 与新来源 `s0 → s1` 加复合状态内 `[*] → s2` 不同。这说明 drawnEdges 的父状态入口绘制尚未移植，是可复现的具体升级需求。20 个前序案例明确通过，其余未完成，不宣称全绿。优先实施单独的 mermaid 绘图移植与回放，保持材料夹具原样及断言强度；CRLF、SANY、janitor 的其他升级分别验收，不能以本次局部修复代替全部来源重新认证。

