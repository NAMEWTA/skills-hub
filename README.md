# skills-hub

按领域组织、按需安装的 Agent Skills。第一组是从需求到上线及知识沉淀的 **dev**，第二组是系统诊断、磁盘清理、网络代理与配置的 **system**。

所有技能入口与操作资料均为中文，完整参考、模板和示例随技能安装，执行时只引用本技能内的相对路径。以明确意图、可组合的工程实践和完整验证闭环组织开发。规格驱动、测试驱动、状态图、形式化分析与实际运行验证按任务组合；小任务保持简短，复杂任务才拆分。

## 安装

需要 Node.js 22.14+。npm 包名为 `@namewta/skills-hub`，命令名为 `skills-hub`。可直接通过 npm 使用，无需预先克隆：

```bash
# 直接进入可搜索的领域 / 技能树
npx @namewta/skills-hub@0.1.8

# 或全局安装后运行
npm install -g @namewta/skills-hub@0.1.8
skills-hub

# 原有命令行安装方式继续保留
npx @namewta/skills-hub@0.1.8 list
npx @namewta/skills-hub@0.1.8 install --domain dev
npx @namewta/skills-hub@0.1.8 install --skill dev-grill dev-spec system-proxy
```

在目标项目根目录执行，按领域或技能选择；npm 下载包不会自动安装技能。终端中不带参数运行 `skills-hub` 或 `skills-hub install`，直接进入可搜索的领域 / 技能树，无需先选择安装模式。勾选领域会选中其全部子技能，可再取消个别子项，也能混选其他领域的技能；根节点用于全选 / 清空。绿色 `■` 表示全选，`◩` 表示部分选中，`□` 表示未选；目录使用加粗名称与 `▸` 图标，技能用 `├─` / `└─` 树枝区分。直接输入名称、领域或中文用途实时模糊搜索，支持缩写与多个关键词；↑/↓ 页内移动、←/→ 整页翻页、Tab 勾选/取消、Enter 确认。每页只属于一个领域，领域行固定在顶部且可勾选；页内到达边界不会滚动加载，底部显示全局页码及领域内页码。技能说明只显示当前焦点项，避免长文本铺满终端。更换搜索词保留已选技能，Ctrl+U 清空搜索，Ctrl+C 取消。搜索时父节点仍操作整个领域（包括隐藏子项），部分选中时再勾父节点会补齐全选。支持 `skills-hub install --dry-run` 交互预览；同名技能存在差异时自动备份替换，无需额外参数。非交互环境继续要求明确参数，不会等待输入。

交互界面使用 `@clack/prompts`、`@clack/core`、`picocolors`、`string-width` 和 `wrap-ansi`；npm 自动安装这些依赖。源码的显式参数安装器仍仅依赖 Node.js 标准库、可离线运行；源码交互模式先运行 `npm ci`。也可以克隆源码后离线运行安装器：

```bash
git clone https://github.com/NAMEWTA/skills-hub.git
```

**在要使用技能的项目根目录运行安装器。** 不选择安装目录，目标始终是当前目录下的 `.agents/skills/`。

```bash
# 查看所有领域和技能
node /path/to/skills-hub/install.mjs list

# 安装开发领域全部技能
node /path/to/skills-hub/install.mjs install --domain dev

# 同时安装两个领域
node /path/to/skills-hub/install.mjs install --domain dev system

# 安装指定技能，可跨领域
node /path/to/skills-hub/install.mjs install --skill dev-grill dev-spec system-proxy

# 预览，不创建任何文件
node /path/to/skills-hub/install.mjs install --domain dev --dry-run

# 仓库更新后，备份并替换存在差异的技能
node /path/to/skills-hub/install.mjs install --domain dev --replace
```

Windows、macOS 和 Linux 使用相同的 `node` / `npx` 命令。源码安装时使用本机路径，例如：

```powershell
node C:\tools\skills-hub\install.mjs install --domain dev
```

仓库保存 `skills/dev/dev-spec/`，安装后是 `.agents/skills/dev-spec/`，不会多一层 `dev/`。各技能维护自身的中文方法、模板与示例，可以相互调用；同一方法不复制进多个技能。许可完整保留在仓库与 npm 包内；安装器不再向目标项目复制 `.agents/skills-hub-licenses/`，已有目录也不修改或删除。相同内容再次安装无变化；有差异自动备份并替换，`--replace` 仅保留兼容。更多行为见 [安装说明](docs/installation.md)。

安装器只安装文件。Agent 是否自动发现 `.agents/skills/` 取决于所用工具；不支持自动发现的工具可以显式读取对应 `SKILL.md`。这不是后台服务，也不会自动启动开发或部署。

### 从 skills-wta 迁移

从旧包 `skills-wta@0.0.1` 切换到 `@namewta/skills-hub@0.0.8`，继续在同一项目运行上面的安装命令。新旧版本使用相同的 `.agents/skills/<技能名>/`，技能内容相同则不变，有差异时自动备份替换；新的开发记录写入 `.agents/dev/`，系统维护记录写入 `.agents/system/`；已有项目记录按迁移说明处理，安装器不会自动搬迁。新版不再复制项目许可目录，新备份使用 `.agents/.skills-hub-backups/`；已有许可和备份保持原样。旧 GitHub 标签 `v0.0.1` 保留为原包历史；本次从已发布的 scoped npm `0.0.7` 递增 `+0.0.1` 发布 `0.0.8`，使用 `v0.0.8` 标签，不覆盖历史版本。详见[迁移说明](docs/installation.md#从-skills-wta-迁移)。

## dev：完整开发流程

共 30 个开发技能。初次使用可以先用 `dev-setup` 核对可用工具与模型角色，跨阶段任务用 `dev-workflow`，明确阶段直接使用对应技能；不确定入口时用 `dev-help`。模型配置是按实际能力选择的可选约定，不是固定厂商、固定推理预算或自动安装步骤。

| 技能 | 用途 |
| --- | --- |
| [dev-help](skills/dev/dev-help/SKILL.md) | 完整本地使用指南、场景配方、能力选择与常见问题 |
| [dev-setup](skills/dev/dev-setup/SKILL.md) | 核对宿主工具、模型角色、推理预算及长任务配置 |
| [dev-workflow](skills/dev/dev-workflow/SKILL.md) | 协调跨阶段交付、恢复未明阶段任务、记录与复核任务决定 |
| [dev-personalize](skills/dev/dev-personalize/SKILL.md) | 从已授权的工作历史提炼个人习惯，生成可维护的项目技能 |
| [dev-status](skills/dev/dev-status/SKILL.md) | 只读汇总当前或指定历史范围的进度与待决事项，按需制作报告视频 |
| [dev-intake](skills/dev/dev-intake/SKILL.md) | 合并聊天、Issue、截图、日志、评审等来源，保留出处与范围 |
| [dev-issue-setup](skills/dev/dev-issue-setup/SKILL.md) | 配置报告来源、追踪器、仓库路由、控制能力与实际监控触发器 |
| [dev-issue-triage](skills/dev/dev-issue-triage/SKILL.md) | 按已配置来源适配器分类、查重与分流，不运行复现 |
| [dev-issue-fix](skills/dev/dev-issue-fix/SKILL.md) | 对可信报告双次 UI 复现，验证已有修复或交付授权内草稿 PR |
| [dev-grill](skills/dev/dev-grill/SKILL.md) | 按设计决策树澄清问题，先查事实，再问真正的产品选择 |
| [dev-spec](skills/dev/dev-spec/SKILL.md) | 把意图转成行为规格、验收、边界与非目标 |
| [dev-architecture](skills/dev/dev-architecture/SKILL.md) | 对比结构方案，明确领域、接口、状态所有权及取舍 |
| [dev-plan](skills/dev/dev-plan/SKILL.md) | 拆分可接手与验收的垂直切片，核对规格覆盖与真正依赖 |
| [dev-sharpen](skills/dev/dev-sharpen/SKILL.md) | 用四问深化待执行请求、原始材料、方法与独立证据 |
| [dev-parallel](skills/dev/dev-parallel/SKILL.md) | 分工覆盖、多个候选比选、交叉评审与统一集成 |
| [dev-ui-design](skills/dev/dev-ui-design/SKILL.md) | 产品界面、设计系统与落地页，完整 token、组件状态与视觉规范 |
| [dev-build](skills/dev/dev-build/SKILL.md) | 根据规格实施、集成并验证当前成果 |
| [dev-tdd](skills/dev/dev-tdd/SKILL.md) | 在真实公共接口逐行为进行红绿循环，保留能经受重构的测试 |
| [dev-guardrails](skills/dev/dev-guardrails/SKILL.md) | 把重复问题转为类型、接口、lint、预算与其他结构约束 |
| [dev-statechart](skills/dev/dev-statechart/SKILL.md) | 基于 TLA+ / TLC 生成带规则标记和最短反例的状态图，并核对代码 |
| [dev-formal-verify](skills/dev/dev-formal-verify/SKILL.md) | 为高价值状态和并发属性建立、运行并维护形式化验证 |
| [dev-debug](skills/dev/dev-debug/SKILL.md) | 基于运行证据定位根因，修复并回到原始场景验证 |
| [dev-review](skills/dev/dev-review/SKILL.md) | 分别审查规格符合度与工程质量 |
| [dev-verify](skills/dev/dev-verify/SKILL.md) | 运行真实用户路径，生成并维护项目专用验证方法 |
| [dev-benchmark](skills/dev/dev-benchmark/SKILL.md) | 固定负载、版本、样本和指标，验证性能变化及预算 |
| [dev-deploy](skills/dev/dev-deploy/SKILL.md) | 指定环境部署、真实业务验证、恢复与发布记录 |
| [dev-learn](skills/dev/dev-learn/SKILL.md) | 沿真实业务链路理解陌生模块，定位二次开发入口 |
| [dev-why](skills/dev/dev-why/SKILL.md) | 追溯历史动机、取舍与阈值，保留证据层级和缺口 |
| [dev-writing](skills/dev/dev-writing/SKILL.md) | 技术文档、PR、提交说明与清晰表达，完整保留写作方法 |
| [dev-archive](skills/dev/dev-archive/SKILL.md) | 复盘、更新知识、处理冲突与替代、归档历史 |

使用 `dev-workflow` 可以串起完整任务，也可以只调用某一步。技能间是可选协作关系，不会因少装一项就停止工作。

```text
使用 dev-workflow：读取这个 Issue 和两张截图，理清需求，完成实现、
验证后部署到我指定的测试环境，最后更新项目知识。

使用 dev-learn：帮我沿“创建账号”走通入口、业务规则、存储和回显，
指出后续改成多租户时会涉及哪些边界。

使用 dev-archive：这个需求已经上线。核对当前代码和发布记录，
更新术语、ADR 和错误经验，处理已经冲突的旧文档。
```

`$dev-workflow` 等调用语法由具体 Agent 决定；普通语言指定技能也可以。详细衔接与例子见 [开发流程](docs/workflow.md)。

## 怎样组合工程实践与验证闭环

前期可以用 `dev-intake`、`dev-grill`、`dev-spec`、`dev-plan` 把要求变成小而清晰的交付单元；用 `dev-architecture`、`dev-ui-design` 明确接口与体验，必要时用 `dev-sharpen` 深入打磨。随后由 `dev-build` 实施，接口稳定、行为明确时可以选择 `dev-tdd`；有真正独立范围时用 `dev-parallel`。

验证分为相互补充的几层：

| 层次 | 技能与产物 | 能说明什么 |
| --- | --- | --- |
| 结构约束 | `dev-guardrails`：类型、lint、接口、幂等与预算规则 | 让已知错误更难再次写入，不替代对实际行为的检查 |
| 经验验证 | `dev-tdd`、`dev-verify`、`dev-benchmark`：行为测试、真实操作、评测与测量 | 在实际执行的输入、环境和工作负载上观察到什么 |
| 模型结果可视化 | `dev-statechart`：TLA+ / TLC 结果、状态、轨迹、代码映射 | 让隐含行为可读，帮助人审查系统是否符合意图；普通解释图不要求模型检查 |
| 形式化分析 | `dev-formal-verify`：模型、属性、假设、反例与核对记录 | 在声明的模型、假设和边界内检查属性，并通过实际代码验证防止漂移 |
| 交付与记忆 | `dev-review`、`dev-deploy`、`dev-archive` | 审查、指定环境真实运行、更新仍有效的项目知识 |

形式化方法不能替用户证明需求本身正确，也不能凭模型检查成功声称整个程序没有 bug。状态图和模型只在有价值的模块使用；它们描述产品系统，不管理 Agent 必须逐关通过的工作流。模型反例应映射回真实代码、运行场景或回归测试，变更后一起更新。

性能预算、热路径命名、确定性回放、lint 规则和注释约定都要来自当前项目的实际目标。示例中的游戏指标和风格不是全仓默认要求；重复出现且适合静态捕获的问题，再考虑提升为结构约束。

## system：系统维护

| 技能 | 用途 |
| --- | --- |
| [system-inspect](skills/system/system-inspect/SKILL.md) | 确认真实主机与问题，检查磁盘、资源、进程、网络及服务 |
| [system-cleanup](skills/system/system-cleanup/SKILL.md) | 按实际占用选择可清理对象，执行后量测并验证 |
| [system-proxy](skills/system/system-proxy/SKILL.md) | 排查和配置代理、DNS、客户端与应用生效范围 |
| [system-config](skills/system/system-config/SKILL.md) | 调整已指定的软件或系统配置，保留备份并验证真实生效 |
| [system-herdr](skills/system/system-herdr/SKILL.md) | Herdr 终端控制与 Lead 编排；按 pane 复用 task/report 文件派发、验收和恢复任务，按需选择团队剧本；仅在用户明确要求使用 Herdr 时启用 |

系统技能不会把“清缓存”扩展为删除业务数据，也不会把“应用代理”扩展为修改整机路由。主机文档按需放在 `.agents/system/<主机标识>/`；密码与订阅秘密只记录安全引用。

## 项目知识怎样留下来

**项目持久化按领域区分：开发使用 `.agents/dev/`，系统维护使用 `.agents/system/`。** 需求、知识、部署、归档和项目配置都按职责放在这个根目录下，安装器在选择任意 dev 技能时补齐九份简短目录说明，包含 `.agents/dev/AGENTS.md`、开发六类分区及两个归档结果入口；选择 system 技能另补系统根说明。目录与模板固定维护在 `scripts/`，不依赖执行技能。固定位置的模板说明自动覆盖更新，内容相同不重写，业务记录和根 AGENTS.md 不受影响，重复安装也会同步模板，预览不写入；其余子目录与业务记录按实际需要创建。新增领域 `skills/<domain>/` 对应 `.agents/<domain>/`，不在领域根下重复嵌套同名目录。技能安装位置仍为 `.agents/skills/`；项目根目录的 `AGENTS.md` 保留简短导航，指向实际知识文件。

| 位置 | 保存什么 |
| --- | --- |
| `AGENTS.md` | 简短导航、必要项目约定；不放完整百科 |
| `.agents/dev/changes/<日期-主题>/` | 活跃需求的简报、规格、切片、进展和证据 |
| `.agents/dev/notes/index.md` | 常用知识入口；不维护全量注册表 |
| `.agents/dev/notes/glossary.md` | 术语、别名、适用范围与代码映射 |
| `.agents/dev/notes/context/` | 代码本身解释不了的背景和约束 |
| `.agents/dev/notes/decisions/` | 仍有决策价值的 ADR、替代方案和后果 |
| `.agents/dev/notes/errors/` | 可能再次出现的错误、识别方式与恢复经验 |
| `.agents/dev/notes/learning/` | 经代码核验的模块导读 |
| `.agents/dev/deploy/<环境>/` | 当前运行手册、配置与凭据引用、历史发布记录 |
| `.agents/dev/archive/changes/implemented/`、`rejected/` | 已交付或明确不实施的 change；归档时命名为 `<type>_<YYYY-MM-DD>-<slug>/` |
| `.agents/dev/archive/notes/` | 退役知识，保留原分类 |
| `.agents/dev/project/` | 项目专用配置与功能图，例如 `issue-automation/` |
| `.agents/dev/context/model-roles.md` | 当前宿主的模型角色与推理预算配置 |
| `.agents/system/<主机标识>/` | 系统检查、清理、代理及配置的维护记录 |

已有 `docs/` 等位置的有效文档按真实位置引用，避免重复保存正文。迁移本套技能的既有资料时，保留原有子目录与内容，更新项目导航及入链。当前代码和实际运行证据说明现状，用户明确目标说明期望。知识写“为什么、边界、去哪找”，具体实现链接到代码；活跃 change 不提前分类或改名；归档时由 `dev-archive` 核实结果、提炼知识，再按 architecture、feature、bug-fix、refactor、process 主类型移动重命名，沿用原创建日期并修复引用。暂缓或必要交付未完成不归档，旧历史不自动迁移；implemented 不自动表示上线。详见 [领域持久化与迁移](docs/persistence-roots.md)及[知识与记忆](docs/knowledge.md)。

## UI 入口合并

设计系统、双层颜色、文本样式、完整语义 token 与组件状态现已并入 `dev-ui-design`，无需 Figma。旧版本已经安装独立 Figma 技能的项目，请按[迁移说明](docs/installation.md#合并后的-ui-入口)先将旧包备份移出技能发现目录，再更新 UI 包，避免旧入口继续参与选择。

## 独立内容与本地资料

每个技能是一个完整安装包：`SKILL.md` 说明何时使用、如何判断、做到什么程度；`references/` 放按需读取的完整中文方法；`assets/` 放可以复制到目标项目的模板；需要确定性操作时才提供 `scripts/`。`agents/openai.yaml` 提供界面元数据。

- **全部本地引用**：技能正文、参考、模板和脚本不依赖外部文档，不出现来源项目名、来源作者名或致谢段落。内部资源引用不能越出本技能文件夹。
- **完整中文内容**：完整取得指定来源根，并逐份翻译适用的非中文/混合参考；已是中文的文件直接读取 upstream，不重复生成 zh。运行版本保留实质步骤、判断标准、例子和表格，再统一到本项目的名称、路径、工具能力与持久化约定。
- **按需阅读**：完整资料不等于每次全部加载。入口指明何时读取哪份资源，细节留在包内，需要时再读。
- **协作依赖**：原子技能负责完整方法，工作流按阶段调用。执行时沿用同一任务与证据，不递归复制资源。方法归属与迁移见[开发方法归属](docs/dev-method-ownership.md)。
- **可核对的来源双树**：资料按六个指定来源项目组织，`upstream/` 保留完整选定 Git 树的原目录、隐藏文件、原扩展名、字节与执行位，`zh/` 保留同路径适用中文或字节对照。法律、机器夹具、无自然语言文件和图片对照保持原字节；程序只翻译适用说明/注释，不改逻辑、业务字符串或机器标识。版本以[父清单](materials/manifest.tsv)为机器依据，逐文件摘要和运行映射位于项目子清单，见[资料导航](materials/README.md)。材料不执行、不发现、不安装，不触发来源 CI/hook 或安装依赖，npm 白名单排除整个 materials；即使原件是 `.py`/`.sh`/`.ts` 或包含嵌套 `.agents/skills`，安全契约不变。

逐文件关系与运行适配规则见 [资源组织](docs/resources.md)。测试驱动、行为回归、真实运行证据与形式化方法都可以使用，按用户目标和风险选择。形式化结果只说明给定假设与属性下的结论，不能代替用户判断意图，也不能代替模型与实际代码的对照。来源特有的目录、外部技能调用、固定模型和复杂工作流网关，也在运行版中改为本项目可独立执行的方法。

## 版本发布

通过 npm 分发独立技能包。更新版本号与 `CHANGELOG.md` 并推送 main 后，GitHub Actions 会完成跨平台检查、实际压缩包安装验证、npm 发布及 GitHub Release。发布任务使用仓库 Secret `NPM_TOKEN`，附带与 npm 相同的压缩包和校验和。标签、手动 Release 与失败重试方式见[版本发布](docs/release.md)。

## 维护与验证

从 [AGENTS.md](AGENTS.md) 开始；[关键开发约束](docs/development-constraints.md)说明成熟方法的保留、入口归属和上游同步，[技能编写指南](docs/skill-authoring.md)说明写法，[质量门禁](docs/skill-quality.md)说明预算与提交检查，实际检查结果见 [验证记录](docs/validation.md)。

```bash
node scripts/check.mjs
node scripts/check.mjs --full
node scripts/check-skill-quality.mjs --report

# 为本检出启用提交与推送快照检查
node scripts/install-hooks.mjs
```

校验同时拒绝运行目录中的非 JavaScript 脚本，materials 被动来源不受此扩展名约束；执行 `npm run check:package` 验证实际分发包及材料排除。校验覆盖命名、frontmatter、本地链接、单包资源可达性、外链与来源名称残留、许可附带以及对照文件完整性。结构检查不能代替内容质量审查；翻译和流程调整仍需对照全文检查。

## 致谢与许可

本项目参考以下成熟内容，材料库按六个准确范围维护原样来源、适用中文对照和当前运行映射。这里集中记录来源，技能运行目录中不放来源说明或外部参考链接。每次显式同步解析指定分支最新提交，并固定同一 SHA 完成全部读取；当前来源身份以[父清单](materials/manifest.tsv)为机器依据，下表只提供范围和导航，不重复维护 SHA 或固定数量。来源更新、翻译核对和运行版适配分别记实，不由本表推定已完成验收。

| 项目 | 准确来源范围 | 跟踪分支 | 当前文件与映射 |
| --- | --- | --- | --- |
| pstack | [cursor/plugins 的 harness/pstack](https://github.com/cursor/plugins/tree/main/harness/pstack)，保留其 `claude-code/` 层 | `main` | [项目清单](materials/pstack/manifest.tsv) |
| mattpocock-skills | [mattpocock/skills 的 skills](https://github.com/mattpocock/skills/tree/main/skills) | `main` | [项目清单](materials/mattpocock-skills/manifest.tsv) |
| deepseek-harness | [deepseek-ai/deepseek-harness 的 .agents/skills](https://github.com/deepseek-ai/deepseek-harness/tree/master/.agents/skills)，不扩为整个 .agents | `master` | [项目清单](materials/deepseek-harness/manifest.tsv) |
| ai-design-skills | [elayadesign/ai-design-skills 的 skills](https://github.com/elayadesign/ai-design-skills/tree/main/skills) | `main` | [项目清单](materials/ai-design-skills/manifest.tsv) |
| speculo | [NAMEWTA/Speculo](https://github.com/NAMEWTA/Speculo)，整仓原样资料；运行版按需融合，不移植状态引擎 | 父清单 `ref=HEAD`，当前默认解析 `main`，每次重解析 | [项目清单](materials/speculo/manifest.tsv) |
| herdr | [herdrdev/herdr 的 skills/herdr](https://github.com/herdrdev/herdr/tree/master/skills/herdr) | `master` | [项目清单](materials/herdr/manifest.tsv) |

[资料导航与同步用法](materials/README.md)解释双树、稀疏 zh、父子字段、查询和预览/准备/应用命令。Speculo 必须在父清单使用 `ref=HEAD`，同步脚本才会动态解析默认分支，不长期固定 `main`；其余五项目跟踪表中指定的 main/master 分支。普通校验与 CI 不自动联网刷新。`runtime_paths` 是实际采用关系，`runtime_reviewed_blob` 是最后真实核对依据，不能随材料更新自动前移；删除或退出当前来源的文件在差异报告中保留运行影响，不自动删除已适配技能。

`system-herdr` 的完整 Herdr 基础操作和 Claude Code、Codex、Pi 具体启动命令直接保留在 SKILL.md；团队协作按用户指定采用持久化 task/report 与 pane 清单，配套协议与剧本按需读取。文件协议、四种团队剧本及与原文冲突处的必要处理见[Herdr 采用与适配](docs/herdr-coordination.md)。逐文件 Git blob、摘要及运行核对依据从 herdr 子清单查询；本地协议与既有客户端启动扩展不写进 zh 冒称原文。Herdr 在运行内容中作为实际操作工具名称保留，不作为来源署名或外部文档依赖。

感谢这些内容的作者与贡献者。PR 视觉说明方法还通过上述资料引用了 [Dex Horthy](https://github.com/dexhorthy) 与 [HumanLayer show-me](https://github.com/humanlayer/humanlayer) 的贡献，对应 Apache 2.0 与 NOTICE 已一并附带。材料完整性以所选根的 Git 树、两级清单与实际文件逐份核对，不用旧编号或历史计数替代；当前快照及适配是否验收应以真实验证记录为准。运行包按主题整合为独立中文技能，原品牌图片、原插件配置、自动联网安装器和复杂计划准入工具仅保留作对照，不成为使用条件。

技能组织方式还参考 [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) 与 [Harness engineering](https://openai.com/index/harness-engineering/)。文章的组织原则已转化为本项目的本地编写与知识管理说明；未转载文章全文。代理配置字段的理解另参考 [MetaCubeX 文档](https://github.com/MetaCubeX/Meta-Docs/tree/2a6ba6b04a9eecdbe5c88c4e4a09776659c0878b)，运行说明已写在技能本地，不要求使用者访问该文档。

任务与计划交接还对照 [OpenAI ExecPlans](https://developers.openai.com/cookbook/articles/codex_exec_plans)、[Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices)、[Claude 技能编写指南](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)及 [OpenAI 技能评测](https://developers.openai.com/blog/eval-skills)：在既有切片与多阶段方法中补足可接手上下文、可观察验收和风险适配，不移植整套官方示例模板。逐项原文、保留内容与必要适配见[维护记录](.agents/dev/changes/2026-11-11-dev-plan-task-handoffs/source-adaptations.md)，该记录说明当时的对照范围，不代表当前材料或运行版的升级验收。

项目原创内容采用 [MIT](LICENSE)。原作者版权、MIT 许可、适用的 Apache 2.0 及 NOTICE 的分发文本集中保存在[许可目录](licenses/)并由[第三方声明](THIRD_PARTY_NOTICES.md)说明，包括设计材料内嵌的额外 MIT 声明。materials 选定来源树自带的法律文件也须原样保留，这是快照完整性要求，与根 licenses 的集中分发职责不同；当前来源移出范围也不取消既有运行内容的许可义务。许可随源码仓库和 npm 包分发，不再由技能安装器复制到用户项目。再次分发技能时应保留适用许可。
