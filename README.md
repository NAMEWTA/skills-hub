# skills-hub

按领域组织、按需安装的 Agent Skills。第一组是从需求到上线及知识沉淀的 **dev**，第二组是系统诊断、磁盘清理、网络代理与配置的 **system**。

所有技能入口与操作资料均为中文，完整参考、模板和示例随技能安装，执行时只引用本技能内的相对路径。以明确意图、可组合的工程实践和完整验证闭环组织开发。规格驱动、测试驱动、状态图、形式化分析与实际运行验证按任务组合；小任务保持简短，复杂任务才拆分。

## 安装

需要 Node.js 22.14+。npm 包名为 `@namewta/skills-hub`，命令名为 `skills-hub`。可直接通过 npm 使用，无需预先克隆：

```bash
# 直接交互多选领域或技能
npx @namewta/skills-hub@0.1.1

# 或全局安装后运行
npm install -g @namewta/skills-hub@0.1.1
skills-hub

# 原有命令行安装方式继续保留
npx @namewta/skills-hub@0.1.1 list
npx @namewta/skills-hub@0.1.1 install --domain dev
npx @namewta/skills-hub@0.1.1 install --skill dev-grill dev-spec system-proxy
```

在目标项目根目录执行，按领域或技能选择；npm 下载包不会自动安装技能。终端中不带参数运行 `skills-hub` 或 `skills-hub install` 会进入中文交互：空格多选，回车确认，Ctrl+C 取消。支持 `skills-hub install --dry-run` 交互预览；内容冲突需检查后显式运行 `skills-hub install --replace`，不会自动覆盖。非交互环境继续要求明确参数，不会等待输入。

交互界面使用 `@clack/prompts`、`picocolors`、`string-width` 和 `wrap-ansi`；npm 自动安装这些依赖。源码的显式参数安装器仍仅依赖 Node.js 标准库、可离线运行；源码交互模式先运行 `npm ci`。也可以克隆源码后离线运行安装器：

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

# 只安装指定技能，可跨领域
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

仓库保存 `skills/dev/dev-spec/`，安装后是 `.agents/skills/dev-spec/`，不会多一层 `dev/`。技能自带所需的中文参考文件、模板与示例，单独安装也能工作。许可完整保留在仓库与 npm 包内；安装器不再向目标项目复制 `.agents/skills-hub-licenses/`，已有目录也不修改或删除。相同内容再次安装无变化；有差异默认停止整次安装，`--replace` 会先保留备份。更多行为见 [安装说明](docs/installation.md)。

安装器只安装文件。Agent 是否自动发现 `.agents/skills/` 取决于所用工具；不支持自动发现的工具可以显式读取对应 `SKILL.md`。这不是后台服务，也不会自动启动开发或部署。

### 从 skills-wta 迁移

从旧包 `skills-wta@0.0.1` 切换到 `@namewta/skills-hub@0.0.8`，继续在同一项目运行上面的安装命令。新旧版本使用相同的 `.agents/skills/<技能名>/`，技能内容相同则不变，有差异时先检查再用 `--replace`；新的开发记录写入 `.agents/dev/`，系统维护记录写入 `.agents/system/`；已有项目记录按迁移说明处理，安装器不会自动搬迁。新版不再复制项目许可目录，新备份使用 `.agents/.skills-hub-backups/`；已有许可和备份保持原样。旧 GitHub 标签 `v0.0.1` 保留为原包历史；本次从已发布的 scoped npm `0.0.7` 递增 `+0.0.1` 发布 `0.0.8`，使用 `v0.0.8` 标签，不覆盖历史版本。详见[迁移说明](docs/installation.md#从-skills-wta-迁移)。

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
| [dev-plan](skills/dev/dev-plan/SKILL.md) | 拆分可交付的垂直切片与真正的依赖 |
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
| [system-herdr](skills/system/system-herdr/SKILL.md) | 在 Herdr 内查看与控制窗格、标签页、工作区、命令及 agent；仅在用户明确要求使用 Herdr 时启用 |

系统技能不会把“清缓存”扩展为删除业务数据，也不会把“应用代理”扩展为修改整机路由。主机文档按需放在 `.agents/system/<主机标识>/`；密码与订阅秘密只记录安全引用。

## 项目知识怎样留下来

**项目持久化按领域区分：开发使用 `.agents/dev/`，系统维护使用 `.agents/system/`。** 需求、知识、部署、归档和项目配置都按职责放在这个根目录下，只有实际需要时才创建对应领域子目录。新增领域 `skills/<domain>/` 对应 `.agents/<domain>/`，不在领域根下重复嵌套同名目录。技能安装位置仍为 `.agents/skills/`；项目根目录的 `AGENTS.md` 保留简短导航，指向实际知识文件。

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
| `.agents/dev/archive/changes/`、`.agents/dev/archive/notes/` | 已结束过程与历史知识 |
| `.agents/dev/project/` | 项目专用配置与功能图，例如 `issue-automation/` |
| `.agents/dev/context/model-roles.md` | 当前宿主的模型角色与推理预算配置 |
| `.agents/system/<主机标识>/` | 系统检查、清理、代理及配置的维护记录 |

已有 `docs/` 等位置的有效文档按真实位置引用，避免重复保存正文。迁移本套技能的既有资料时，保留原有子目录与内容，更新项目导航及入链。当前代码和实际运行证据说明现状，用户明确目标说明期望。知识写“为什么、边界、去哪找”，具体实现链接到代码；归档时核对引用、修复过期事实、保留仍重要的理由。详见 [领域持久化与迁移](docs/persistence-roots.md)及[知识与记忆](docs/knowledge.md)。

## UI 入口合并

设计系统、双层颜色、文本样式、完整语义 token 与组件状态现已并入 `dev-ui-design`，无需 Figma。旧版本已经安装独立 Figma 技能的项目，请按[迁移说明](docs/installation.md#合并后的-ui-入口)先将旧包备份移出技能发现目录，再更新 UI 包，避免旧入口继续参与选择。

## 独立内容与本地资料

每个技能是一个完整安装包：`SKILL.md` 说明何时使用、如何判断、做到什么程度；`references/` 放按需读取的完整中文方法；`assets/` 放可以复制到目标项目的模板；需要确定性操作时才提供 `scripts/`。`agents/openai.yaml` 提供界面元数据。

- **全部本地引用**：技能正文、参考、模板和脚本不依赖外部文档，不出现来源项目名、来源作者名或致谢段落。内部资源引用不能越出本技能文件夹。
- **完整中文内容**：复制并逐份翻译选定的参考文件；已是中文的文件保留原文作为对照。运行版本保留实质步骤、判断标准、例子和表格，再统一到本项目的名称、路径、工具能力与持久化约定。
- **按需阅读**：完整资料不等于每次全部加载。入口指明何时读取哪份资源，细节留在包内，需要时再读。
- **独立安装**：其他技能是可选交接对象；没有安装其他技能时，按当前包内方法完成已授权工作，不形成隐含依赖。
- **可核对的完整底稿**：仓库内保存 648 份固定版本原件及逐份本地对照，其中 211 份文档有完整中文底稿、68 份代码与配置保留程序逻辑及技术标识、362 份机器夹具和 7 份原始图片按原字节保存，见 [本地资料索引](materials/README.md)。这些对照文件用于维护，不会安装为技能，也不作为执行指令。

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

校验同时拒绝非 JavaScript 运行脚本；执行 `npm run check:package` 验证实际分发包。校验覆盖命名、frontmatter、本地链接、单包资源可达性、外链与来源名称残留、许可附带以及对照文件完整性。结构检查不能代替内容质量审查；翻译和流程调整仍需对照全文检查。

## 致谢与许可

本项目对以下成熟内容进行了完整收录、中文翻译与适配。这里集中记录来源，技能运行目录中不放来源说明或外部参考链接。固定修订用于说明本次实际收录的内容，后续更新先比较对应文件，再修改本地版本。

| 资料组 | 参考项目与范围 | 固定提交 | 本地原件与中文对照 |
| --- | --- | --- | --- |
| A · 35 份 | [Matt Pocock Skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills)，需求、访谈、规格、架构、实施、TDD 与写作 | `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` | [A 组索引](materials/README.md#a-组) |
| B · 573 份 | [Cursor pstack](https://github.com/cursor/plugins/tree/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack)，0.15.36 版本整个目录：61 个技能入口、23 个流程、24 条原则、2 个代理定义、全部指南、自动化、工具、夹具、配置与图片 | `8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b` | [B 组索引](materials/README.md#b-组) |
| C · 10 份 | [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/tree/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/.agents)，知识、归档、技能写作及完整架构笔记实例 | `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` | [C 组索引](materials/README.md#c-组) |
| D · 3 份 | [Elaya AI Design Skills](https://github.com/elayadesign/ai-design-skills/tree/456d9e0d3e2d84c748bb143c6ca3d90c45e16213)，完整落地页、Figma 设计技能与说明 | `456d9e0d3e2d84c748bb143c6ca3d90c45e16213` | [D 组索引](materials/README.md#d-组) |
| E · 8 份、F · 19 份 | [Speculo](https://github.com/NAMEWTA/Speculo/tree/9199c3bd0cf983c131efbc6340e44ac8b83a583d)，所参考的知识、部署及系统维护资料；仅按需融合，未移植状态引擎 | `9199c3bd0cf983c131efbc6340e44ac8b83a583d` | [E 组索引](materials/README.md#e-组)、[F 组索引](materials/README.md#f-组) |

G 组新增 [Herdr 上游技能](https://github.com/herdrdev/herdr/blob/master/skills/herdr/SKILL.md)，固定提交 `ee5bfb5041bb3e4a49d591c72308aae3c81ecdde`，固定文件见[该修订原文](https://github.com/herdrdev/herdr/blob/ee5bfb5041bb3e4a49d591c72308aae3c81ecdde/skills/herdr/SKILL.md)，完整原件与中文译文见 [G 组索引](materials/README.md#g-组)。`system-herdr` 直接复制自本地 `/home/wta/projects/huhu/.agents/skills/herdr/SKILL.md`，仅更名并添加修改说明；保留本地追加的 Claude Code、Codex、Pi 启动示例，不将这些示例冒称上游内容。逐文件 Git blob、摘要及适配关系见清单 `g001`。Herdr 在运行内容中作为实际操作工具名称保留，不作为来源署名或外部文档依赖。

感谢这些内容的作者与贡献者。PR 视觉说明方法还通过上述资料引用了 [Dex Horthy](https://github.com/dexhorthy) 与 [HumanLayer show-me](https://github.com/humanlayer/humanlayer) 的贡献，对应 Apache 2.0 与 NOTICE 已一并附带。B 组完整镜像所固定的 `pstack/` 目录，逐文件与该提交的目录树核对，无遗漏；其余组按表中范围收录。运行包按主题整合为独立中文技能，原品牌图片、原插件配置、自动联网安装器和复杂计划准入工具仅保留作对照，不成为使用条件。

技能组织方式还参考 [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) 与 [Harness engineering](https://openai.com/index/harness-engineering/)。文章的组织原则已转化为本项目的本地编写与知识管理说明；未转载文章全文。代理配置字段的理解另参考 [MetaCubeX 文档](https://github.com/MetaCubeX/Meta-Docs/tree/2a6ba6b04a9eecdbe5c88c4e4a09776659c0878b)，运行说明已写在技能本地，不要求使用者访问该文档。

项目原创内容采用 [MIT](LICENSE)。原作者版权、MIT 许可、适用的 Apache 2.0 及 NOTICE 完整保存在 [许可目录](licenses/) 和 [第三方声明](THIRD_PARTY_NOTICES.md)，包括设计材料内嵌的额外 MIT 声明。许可随源码仓库和 npm 包分发，不再由技能安装器复制到用户项目。再次分发技能时应保留适用许可。
