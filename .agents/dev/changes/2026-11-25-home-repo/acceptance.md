# Issue #2 验收矩阵

本表逐项对应 [Issue #2](https://github.com/NAMEWTA/skills-hub/issues/2) 第 18 节 A01–A66，契约版本为 `2026-11-25T05:53:23Z`。记录日期为 2026-11-25。方法、自动化和真实运行分别标明；最终跨平台与外部交付状态见T10，不把未选择的CLI分支写成实测。

已提交实现为 [139b3e87328aa490d239632f3a1065a939ead696](https://github.com/NAMEWTA/skills-hub/commit/139b3e87328aa490d239632f3a1065a939ead696)，交付入口为[草稿 PR #17](https://github.com/NAMEWTA/skills-hub/pull/17)。原契约基线是 `f782755b780646e09ae3fcb56598d89df090eb98`；实施期间纳入独立 PR #16 后，变更比较基线为 `2988ae4ad6390b5c9fa53039666284070b33e697`。Windows路径修复已在5e4e4128465ef93e8d0ccd6cfa9537b4a552068a的真实Linux/Windows CI通过（E13），运营、新上下文和实际中断接续已补齐E12/E14/E15。macOS runner选择及最终提交结果见T10。

## 证据类型与状态

| 类型 | 本表使用方式 |
| --- | --- |
| 方法/静态 | 已读取方法、源码、差异或资源关系，确认职责与实现。不能据此声称真实 Agent、宿主或异常恢复已经运行。 |
| 自动化 | 已执行的测试、隔离 Git/文件系统场景及故障注入，绑定命令和日志。真实子进程或 HTTP 测试仍按其明确测试范围解释。 |
| 实际运行 | 实际派遣的 Agent 完成任务、当地知识查询、项目负责人联合验收，或实际 npm/Claude/浏览器宿主的运行证据。不同对象的运行证明不互相替代。 |
| 条件不适用 | 此次没有选择的条件分支，例如 `system-herdr-core` 的终端地址与 manifest 协议。保留方法依据，不计作该分支运行通过。 |

“通过”只指同一行注明的对象与范围。“方法已覆盖”不等于现场演练。“进行中”及“未演练”保留待补证据，不按总行数汇总为 66 项真实运行通过。

## 可复查证据

下文的 E 编号引用本节记录。临时原件路径均相对仓库根，原件留在原运行位置；项目内部知识没有复制到本验收文件。

| 编号 | 证据与绑定范围 |
| --- | --- |
| E01 | [T01 契约与差异核对](evidences/T01-contract.md)。对 `2988ae4a..139b3e8` 的 `skills/dev`、`skills/ops`、`skills/system` 比较无变化；原材料映射保持，仅追加 Home 采用关系。方法归属见 [Home 方法归属](../../../../docs/home/method-ownership.md)。 |
| E02 | [Linux CI 原始 job](https://github.com/NAMEWTA/skills-hub/actions/runs/45567944978/job/139047242747)，绑定 `139b3e8`。`check:full` 为 472/472、0 失败、0 跳过；正常联网 `check:package` 为 63 技能、1092 分发文件；`check:upstream` 实际浏览器检查通过。逐行原样摘录在 `temp/dev/home-issue-2/ci-linux-139b3e8-excerpt.log`。摘要见[真实运行记录](runtime-evidence.md)。 |
| E03 | `temp/dev/home-issue-2/final-regression.log`：`node --test tests/home-route.test.mjs tests/home-knowledge.test.mjs tests/home-history.test.mjs`，47/47 通过、无跳过。包含来源排除、派生来源格式及未知 SSH 用户命名空间的审查回归。后续 Windows 路径修复按新提交的实际 CI 另行绑定。 |
| E04 | `temp/dev/home-issue-2/installer-validation.log`：安装与持久化专项 115/115 通过、无跳过。主要断言在 [install 测试](../../../../tests/install.test.mjs)、[持久化测试](../../../../tests/persistence-initialization.test.mjs)、[交互测试](../../../../tests/cli.test.mjs)。这些测试也包含于 E02 的 Linux 全量运行。 |
| E05 | 实际隔离 Home 为 `temp/dev/home-issue-2/real-home/Home`。其 `AGENTS.md` 明确选择当前原生 Agent 协作工具，不设长期 CLI 默认；实际安装八个 Home 包，用安装目录中的 registry/route 登记并解析 ProjectA、ProjectB。登记用途分别为本地 JSON 报价服务、消费者与组合验证。见[运行范围](runtime-evidence.md#范围与环境)。 |
| E06 | Home 的 `.agents/home/coordination/project-a-report.md`：A 负责人 `/root/real_project_a` 实际派出 `provider_implementation`，负责人独立 `npm test` 58/58、无跳过。源码验收提交 `311addd2`，最终提交 `01a65d39917cee923a10e65acf35a4391a87b65b`。实现、任务与原始证据留 ProjectA。见 [A 交付摘要](runtime-evidence.md#projecta-独立交付)。 |
| E07 | Home 的 `.agents/home/coordination/project-a-knowledge-report.md`：A 在实际 cwd 读取当地 `.agents/dev/notes/pricing.md`，返回随机决策 ID `f22befb6-26e5-447f-88cc-8dec9fe0a4f9`、来源 blob、SHA-256、查询版本与范围。Home 提问前未读该笔记。实际检索原件留 A 的 `evidence/pricing-query.json`，见[知识查询摘要](runtime-evidence.md#项目内部知识查询)。 |
| E08 | Home 的 `.agents/home/coordination/project-b-report.md`：B 负责人 `/root/real_project_b` 实际派出 `consumer_impl`，独立 34/34、无跳过，最终提交 `45aec563d2719bdf3868b55f4e8aa3ab11698dcf`。B 对 A 最终版本在 `127.0.0.1:44991` 执行真实 HTTP 联调，并核验关闭后 ECONNREFUSED；异常响应夹具与真实链路分别说明。原件留 B 的 `owner-report.md`、`execution.json`、`test-output.log` 等，见 [B 联合验收](runtime-evidence.md#projectb-真实联合验收)。 |
| E09 | E02 的真实 Claude 进程：官方 SDK `0.3.332`、Claude Code `2.1.332`；`supportedCommands` 和 `reloadSkills` 均发现 63 技能，`readFile` 读取 121 个入口/参考资源，requestedPath 为 `.claude/skills/`，有效路径回到同仓 `.agents/skills/`。发送用户回合为 0，`modelInferenceVerified=false`。见[宿主证据](runtime-evidence.md#claude-宿主和发布包)与[检查实现](../../../../scripts/check-claude-discovery.mjs)。 |
| E10 | 本地实际 tarball 的补充证据在 `temp/dev/home-issue-2/package/result.json`：0.1.30、63 技能、1092 文件，以精确 consumer lock 和已有缓存执行 npm ci 后核对。它不代替正常联网门禁，后者由 E02 提供。 |
| E11 | Windows首轮发现并修复8.3短名与Git长名比较；E13提供真实复验。macos-latest（Arm64）与既有main任务持续排队，现按官方标准runner清单改为同版macos-26-intel/Node24，完整门禁保持；不冒称Arm64运行。结果见[T10](evidences/T10-delivery.md)。 |
| E12 | /root/home_operations在实际安装Home完成110步/22项有效检查：配置唯一owner、两次有来源决定、候选隔离、部分更正/退役、旧hash拒绝、归档去重、索引删除回退/幂等重建、10处跨owner忘记和4次重导EXCLUDED。Home业务提交c63f74f036a23b734d86d9c150c2be2cb67808a2；原件在Home的coordination/operations-report.md与temp/home-operations-evidence/，见[运营记录](runtime-evidence.md#运营与新上下文)。 |
| E13 | [Linux第二轮](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544568)绑定5e4e4128，472/472、真实包/浏览器/Claude全部通过；[Windows第二轮](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544686)同提交472测试中468通过、0失败、4纯平台skip，真实0.1.30 tarball及所有目录symlink通过。 |
| E14 | 全新fork_turns=none的/root/home_fresh_session没有被提供随机ID/规则值/旧理由；实际35条只读命令与Markdown重读准确答出当前/历史、候选/归档、原owner与forget范围。根与独立答案表逐项核对。原件Home/temp/fresh-session-evidence/，回执coordination/fresh-session-report.md，见[独立结果](runtime-evidence.md#全新上下文与真实中断接续结果)。 |
| E15 | 父实际interrupt运行中的Home新Agent和ProjectA负责人，两个返回previous_status=running，再同id followup。两层先重读本地checkpoint/原owner记录再查现状，Home23份权威Markdown与A HEAD/provider/task/report保持，未重复实现/测试/派遣/提交。A等待直接观察aborted after22.3s。原件路径与准确边界见[接续结果](runtime-evidence.md#全新上下文与真实中断接续结果)。 |

E06–E08 的三个 Home 回执均已实际读取。本轮原生 Agent 工具是实际运行环境；没有将其改称 hc、Claude 或独立 Codex CLI。独立 `codex 0.172.0-alpha.2` 的 app-server 初始化遇只读文件系统，未成功启动。`system-herdr-core` 未被此次组合选择，其协议依据为未修改的[现有技能](../../../../skills/system/system-herdr-core/SKILL.md)，属于条件分支。

## A01–A07 范围与各仓自治

| 编号 | 实现落点 | 证据类型 | 准确证据 | 当前状态与边界 |
| --- | --- | --- | --- | --- |
| A01 | `skills/home/`、`materials/*/manifest.tsv`；其他领域保持原方法 | 方法/静态 | E01；基线比较与 Home 唯一 owner 表 | 通过。独立 PR #16 的 dev 改动按新基线排除，不归入本变更。 |
| A02 | `install.mjs`、`scripts/init-persistence.mjs`、`scripts/persistence/home.md` | 自动化；实际运行 | E04 中 `installing home domain bootstraps exactly the selected domain records`、`unselected skill entries, personal Claude skills and child projects are untouched`；E05 | Linux 范围通过。只建本次技能、别名、Home 根导航和本机映射忽略项，业务文件由实际 setup 后建。 |
| A03 | 公共安装器的选择并集、原领域初始化 | 自动化 | E02/E04；`upstream group lists and installs complete Chinese packages without domain navigation` 及各 domain 持久化参数化测试 | Linux 通过。未把 zh 包变为业务持久化域，也未改变其他领域方法。 |
| A04 | `home-workflow/references/delegation.md`；项目当地 `AGENTS.md` | 方法/静态；实际运行 | E05–E08；A/B 按本地规则接受普通任务，未借用 Home 运行包 | 本次项目自治通过。不同技能版本、各种无 dev 组合未逐一现场演练，不由此声称所有组合兼容。 |
| A05 | `home-workflow/references/delegation.md` 的当地方法与共享路径前提 | 实际运行；条件不适用 | E06/E08 的真实子 Agent 工作，无 Home 接收器或 hook；未修改的 `system-herdr-core` | 普通任务分支通过。Core 文件协作未选用，其共享路径条件仅按现有方法核对。 |
| A06 | `home-setup/scripts/registry.mjs` 的 `saveRegistry/commitFiles`；登记方法的移址与解除登记 | 方法/静态；自动化 | [registry 测试](../../../../tests/home-registry.test.mjs)的只写 repos.json/repos.md、修订冲突与保留手写地图；E02 | 写入边界通过。真实项目解除登记后的全部入链修复未单独演练。 |
| A07 | `install.mjs`、Home 导航模板、setup 薄导航合并方法 | 方法/静态；自动化 | E04 精确文件集合断言；`home local defaults preserve explicit Git exceptions and leave business records unchanged` | Linux 安装通过。新增宿主入口只有逐技能 `.claude/skills` 链接，已有根指令与用户资料保留。 |

## A08–A17 多级派遣与记录归属

| 编号 | 实现落点 | 证据类型 | 准确证据 | 当前状态与边界 |
| --- | --- | --- | --- | --- |
| A08 | `home-workflow` 项目任务与直接交付方法 | 实际运行 | E05–E08；[实际关系与 cwd](runtime-evidence.md#实际派遣和记录-owner) | 通过所选原生 Agent 组合。实现与验收 cwd 为各项目，Home 的管理回执留 Home。B 早期只读上下文使用过 Home/A cwd，已如实保留。 |
| A09 | `home-workflow/references/delegation.md` 的本层 owner 规则 | 实际运行；条件不适用 | E06/E08 的真实 `provider_implementation`、`consumer_impl`；各项目 `.agents/dev/changes/home-integration/` | 本次两项目继续派遣通过。采用当地规则和原生工具，没有声称调用未选择的 Core 或其他 CLI。 |
| A10 | 项目任务简报中的指定回执位置与本层资料归属 | 实际运行；条件不适用 | E06/E08 列明负责人、子 Agent、当地回执和上层指定文件；A 首次缺父目录的失败及重试记录 | 原生任务回执分层通过。没有生成 Core manifest，因此不把本例记为该 manifest 协议实测。 |
| A11 | `home-workflow/references/delegation.md` 的完整身份与短名规则 | 方法/静态；实际运行；条件不适用 | E06/E08 使用相同 `home-integration` 主题名而分属 A/B 根；原生 Agent 完整任务路径不同 | 本次同名主题隔离有实证。不同 Core 同短地址、同 Core 终端唯一性与接续未运行，因未选择 Core。 |
| A12 | workflow 仅管理直接负责人；项目内修订回到项目 owner | 方法/静态；实际运行 | E07 查询交给原 A 负责人，E08 由 B 负责人验收自己的实现子 Agent | 本次直接负责人边界通过。Home 未越级重启或清理后代。 |
| A13 | `home-setup/references/configuration.md` 的选择顺序与作用范围 | 方法/静态；实际运行 | E05 不设长期 CLI 默认；E06/E08 各自当地规则；delegation 明确下层自治 | 方法与本次原生组合通过。异种 CLI 组合未演练，不作该兼容声明。 |
| A14 | `home-doctor/scripts/doctor.mjs` 所需本地入口检查；workflow 缺项分支 | 方法/静态；自动化 | [doctor 测试](../../../../tests/home-doctor.test.mjs)的所需本体缺失、链接父目录/文件拒绝；E02 | 自动化通过。未选工具不报故障；明确缺包不从别仓借用或自动安装。 |
| A15 | `home-workflow/references/coordination.md`、delegation 的接续分支 | 方法/静态 ；实际运行 | E07 为同一 A 负责人继续查询；E12 新上下文验收待完成 | 本次原生方法的两层中断后同id接续通过（E15）。Home/项目分别读本层checkpoint；独立厂商CLI或Core恢复没有被冒称验证。 |
| A16 | delegation 的直接交付验收与异常分支 | 方法/静态；实际运行；条件不适用 | E06/E08 负责人独立 58/34 项验收；E06 保留上层目录缺失及修复过程 | 真实独立交付验收与等待中断/查回有证据（E06/E08/E15），没有把running/idle当业务完成。空shell、厂商CLI输入等待等未选分支保留方法边界。 |
| A17 | workflow、integrate、history 的资料 owner 边界 | 实际运行 | E06–E08 三份 Home 摘要仅引用项目 task/report、测试与知识原件 | 本次分层归档通过。A/B 技术原件仍在项目，Home 未建立项目知识镜像。 |

## A18–A28 地图、知识和联合验证

| 编号 | 实现落点 | 证据类型 | 准确证据 | 当前状态与边界 |
| --- | --- | --- | --- | --- |
| A18 | setup registry；route 的 `selectRepos/inspectCheckout/routeRepo` | 自动化；实际运行 | E03；route 的别名冲突、fork/parent、不同 host、未知 SSH 用户回归；E05 原地登记与解析 | Linux 通过。普通核查未 fetch、切分支或改变 dirty 内容；Windows 路径比较另列 A19。 |
| A19 | route 实际路径、Git root/common-dir、worktree；doctor 引用检查 | 自动化 | E03 的 Unicode、空格、内嵌 `.git` 文件型 worktree；E11 的 Windows 实际失败及修复 | Linux/Windows通过，包含实际8.3原生路径复验（E13）。Mac结果随最终CI记录；不把早期失败写成通过。 |
| A20 | setup 的 `repos.json/repos.md`；knowledge 的项目管理背景方法 | 方法/静态；实际运行 | E05 两项目实际用途；E06–E08 管理回执；E12 背景运营演练 | 项目基本用途已实证。完整管理背景与配置的运营演练进行中，不要求必须跨两个项目才保存。 |
| A21 | workflow 委派查询；knowledge 保留结论及原件指针 | 实际运行 | E07：A 当地读取定价知识及随机 ID、blob、SHA-256，Home 未预先读取 | 本次真实项目内部知识查询通过。来源原文不复制到本矩阵或 Home 知识库。 |
| A22 | 任务简报、知识来源字段、integrate 组合版本与范围 | 实际运行 | E06 最终产物哈希；E07 查询版本与假设范围；E08 A/B 最终版本、实际结果及未覆盖项 | 本例通过。历史查询时间、当前提交、演示假设和生产未知分开记录。 |
| A23 | `home-knowledge/references/maintenance.md`、知识/历史工具 | 方法/静态；自动化 | E03 的原件修订、候选/退役过滤与索引；E12 跨 owner 更正演练 | 真实配置更正、知识指针与前后历史互链通过（E12/E14）；索引重建保持正文与时间。无长期价值可不落新主题属方法审查。 |
| A24 | `knowledge.mjs` 的 lint 与维护方法 | 方法/静态；自动化 | `a truncated index never rewrites sources and lint reports review needs without refreshing facts`；E03 | 自动化通过。HEAD 变化仅触发相关复核的语义按方法核对，没有自动刷新事实日期。 |
| A25 | registry 生成地图；knowledge/history 生成索引；doctor 只读结构 | 自动化；实际运行 | E02/E03；registry 幂等及锁内真源重验，索引稳定与 doctor owner 路由；E05 实际 repos.md | 通过所测重建范围。正文/登记仍是真源，doctor 未接管知识语义。 |
| A26 | `home-map/references/relations.md`；integrate 的项目证据核对 | 方法/静态；实际运行 | E06 A 的公开报价契约与 E08 B 的真实消费链路 | 双方实际回执支持A→B关系、契约owner和本例影响集合（E08/E12）；未据同组或同名猜依赖。 |
| A27 | `home-integrate` 的执行者、版本组合、服务和原件要求 | 实际运行 | E08，B 被指定为联调执行者；实际端口、请求、版本、测试与关闭证据见 runtime-evidence | 本次两项目联合验收通过。执行由 B 完成，Home 未代替项目实施。 |
| A28 | integrate 的 dirty/mock/环境与未覆盖项分支 | 方法/静态；实际运行 | E08 区分真实 A→B 与本地异常响应夹具，列明超时等仅静态检查及生产环境未验证 | 本次结果边界通过。实际组合为 clean；没有另跑 dirty 组合或宣称多仓原子发布。 |

## A29–A43 单一本体与 Claude 技能链接

| 编号 | 实现落点 | 证据类型 | 准确证据 | 当前状态与边界 |
| --- | --- | --- | --- | --- |
| A29 | `install.mjs` 的 `planLink/apply/verifyLink` | 自动化；实际运行 | E04 新装；E05 Home 实装；E02/E10 实际 tarball | Linux 新装通过。canonical 为真实目录，新增别名目标为 `../../.agents/skills/<name>`。 |
| A30 | 安装器整包复制、整目录 symlink；包资源核对 | 自动化；实际运行 | E04 的 `every skill resource is copied without creating project licenses`；E02 全量分发资源；E09 宿主 121 次读取 | 文件树与单一本体通过。Claude 实读入口和选取的参考资源，不声称它逐个执行了所有 scripts/assets。 |
| A31 | `select()` 与所选包计划 | 自动化 | E04 混选并集、未选入口及个人 Claude 技能保持；交互跨域选择测试 | Linux 通过。未选项和子项目不因本次安装被改动。 |
| A32 | `apply()` 的 unchanged 判断包含链接、双锁后重算 | 自动化 | `unchanged canonical skills acquire both locks to supplement only missing links`、`repeated installation is idempotent`；E04 | 通过。缺链补建纳入事务，完全重复安装不重写入口。 |
| A33 | canonical 替换、备份及保持正确别名 | 自动化 | E04 的 replacement/backup 测试、`updates replace only the canonical body and preserve an equivalent absolute symlink` | 通过。旧资源按整体替换合同删除；绝对旧链接保留但不承诺搬迁性。 |
| A34 | `planLink()` 区分预期断链和错向断链 | 自动化 | E04 的 `a dangling link to the expected canonical is preserved and becomes reachable` 及错向冲突参数化场景 | 通过。未将断链一律视为空路径。 |
| A35 | lstat/readlink/realpath 预检及父目录拒绝 | 自动化 | E04 的同名文件/目录、外来链接和父目录冲突场景；交互冲突保留完整项目 | 通过。`--replace` 不绕过 Claude 入口冲突。 |
| A36 | `regularFiles/checkDirectory` 与持久化路径检查 | 自动化 | E04 的 source/canonical/nested/backup symlink 拒绝；持久化非法路径测试 | 通过。只对准确的 Claude 逐技能别名增加允许范围。 |
| A37 | `verifyLink()`、`check-package.mjs` 的 realpath 核对 | 自动化；实际运行 | E02/E10 全部所选技能验证；E09 实际宿主有效路径 | 通过本次安装目标。没有把源码目录、缓存、stage 或 backup 用作别名目标。 |
| A38 | 新链接使用相对目标；route 核对实际 worktree 入口 | 方法/静态；自动化 | E04 的 `relative links survive moving a project with spaces and Chinese characters`；E03 文件型 worktree 测试 | Linux 搬迁通过。worktree 本地缺技能不推断宿主已加载；平台路径复验见 A19。 |
| A39 | 链接、技能、导航、忽略规则的同一 journal 与回滚 | 自动化 | E04 的 EPERM、第二链接失败、清理失败、父目录被替换等场景；持久化混域恢复原字节测试 | 普通异常及注入边界通过。未声明断电或非配合外部程序并发下的完整事务。 |
| A40 | 显式 CLI、交互预览与取消共用计划 | 自动化 | E04 的 dry-run、list/help/version、取消、权限探测禁止与锁后重算场景 | 通过。预览不建目录、锁或权限探测链接。 |
| A41 | `symlinkSync(..., 'dir')` 及错误回滚，无 junction/copy fallback | 自动化；实际运行 | E11 Windows 首轮真实安装 symlink 已通过；E04 权限拒绝注入 | Windows真实dir symlink和完整适用门禁通过（E13）；EPERM失败回滚有注入证据。未声称现场覆盖所有Windows权限组合。 |
| A42 | npm files 清单、`check-package.mjs`、交互与显式安装器 | 自动化；实际运行 | E02 正常联网 0.1.30 实际 tarball；E10 离线锁定消费；E04 交互入口测试 | Linux/Windows正常联网真实tarball通过（E13），63技能1092文件与完整链接。Mac结果随最终CI记录。 |
| A43 | `scripts/check-claude-discovery.mjs`；`docs/home/validation.md` | 实际运行 | E09 官方 SDK 0.3.332 / Claude 2.1.332，63 初始化/重载发现、121 readFile 读取 | 宿主发现与资源读取通过。零用户回合，未验证模型实际执行技能。 |

## A44–A48 完整交付

| 编号 | 实现落点 | 证据类型 | 准确证据 | 当前状态与边界 |
| --- | --- | --- | --- | --- |
| A44 | 八个 `skills/home/home-*` 包、包内资源导入与按名方法调用 | 方法/静态；自动化；实际运行 | E01 资源闭包；E02 打包；registry/knowledge/history 独立复制包测试；E05 实际安装目录调用 | 八包资源闭包、实际安装目录工具与运营/协作方法通过（E12/E14）；无home-dispatch或第二派遣实现。 |
| A45 | 各入口缺包分支、doctor 所需技能检查；安装器不自动补依赖 | 方法/静态；自动化 | E02/E04 单选准确集合；doctor 必需本体缺失、未选工具不报错测试 | 方法与安装检查通过。没有把缺失兄弟技能说成已执行。 |
| A46 | workflow 的本层直接任务与项目自治方法 | 实际运行 | E05–E08：Home→A/B，A→provider_implementation，B→consumer_impl；当地记录与独立验收 | 本次真实多级组合通过。不是图示或伪造 fixture 回执。 |
| A47 | workflow/knowledge 的当地查询；integrate 的真实执行者 | 实际运行 | E07 的随机知识标识查询与 E08 的真实 HTTP 组合 | 两项必要真实场景均通过。本例未验证独立厂商 CLI。 |
| A48 | 来源清单、许可、Home 文档、安装提示与分层证据报告 | 方法/静态；自动化；实际运行 | E01/E02；[Home 来源](../../../../docs/home/sources.md)、[第三方声明](../../../../THIRD_PARTY_NOTICES.md)、runtime-evidence | 来源、文档及已取得运行边界已对齐（E12–E15）；最终CI/PR/Release状态按T10记录，未提前声称发布。 |

## A49–A66 用户配置、知识与历史运营

| 编号 | 实现落点 | 证据类型 | 准确证据 | 当前状态与边界 |
| --- | --- | --- | --- | --- |
| A49 | `skills/home/`、持久化导航、动态 domain 安装与 docs/home | 方法/静态；自动化 | E01/E02；八包含 setup/history，安装 home domain 的准确文件集合 | 通过。没有 workspace 运行别名、home-init 或 home-dispatch。 |
| A50 | setup 独立入口与 workflow 分流；configuration 的按需保存 | 方法/静态；自动化；实际运行 | E05 初始 Home 明确无长期 CLI 默认；registry 只读不初始化测试；E12 | 无默认、按需保存及显式具名配置在真实fixture验证（E12/E14）；未制造默认团队或探测全部账号。 |
| A51 | configuration 的本次要求→明确配置→Home 默认→工具默认及作用范围 | 方法/静态 | E05 明确原生工具仅本次选择；E12 计划覆盖临时覆盖与长期默认 | 作用范围方法与本次具名配置通过（E12/E14）；配置仅fixture管理层，不改A/B或既有会话。所有CLI默认组合未逐一现场演练。 |
| A52 | configuration/environment 的意图、能力与实际生效分离 | 方法/静态；实际运行 | E05 的工具选择；独立 codex 启动失败如实保留；E09 明确模型执行未验证；E12 | 意图、观察、生效与未知区分通过（E12/E14）；实际原生工具、失败的独立codex和零模型回合的Claude各有准确边界。 |
| A53 | setup 的 environment 与 configuration 资源 owner 规则 | 方法/静态 | `home-setup/references/environment.md`“资源与生效范围”；configuration 的角色与预算表 | 方法/静态通过。未运行跨主机额度调度实验；Home 没有实现新的容量管理器。 |
| A54 | setup 唯一配置 owner；history 接续与 workflow 最小入口 | 方法/静态 ；实际运行 | E12/E14/E15；原件与结果见对应证据入口 | 全新实际Agent无答案继承，重读唯一配置owner并准确回报随机ID/规则/来源（E14）；不依赖原生auto memory。 |
| A55 | setup 配置、knowledge 现行主题、history 当时事件互相引用 | 方法/静态；自动化 ；实际运行 | E12/E14/E15；原件与结果见对应证据入口 | 真实两个有来源决定与现行唯一owner一致，新Agent分别答出当时理由/当前规则、发生/整理时间（E12/E14）。 |
| A56 | knowledge 的候选核验、配置 owner 与外部来源边界 | 方法/静态；自动化 | E03 的 `whole-note candidates stay out of current navigation...`；knowledge/configuration 不从第三方输入推断偏好 | 真实候选默认0、显式inactive与inbox各1，未变成current（E12/E14）。外部消息/推断的授权判断仍归方法，不从时间或重复摘要自动晋升。 |
| A57 | history 显式事件 status；workflow 验收与历史写入分开 | 自动化；实际运行 | E03 的取消/部分/unknown 事件测试；E06/E08 分开实现者报告与负责人验收 | 所测状态表达通过。记录历史不自动证明已部署或当前仍运行。 |
| A58 | `history.mjs` 按 scope+event_key 查重，归档参与身份检查 | 自动化 | E03 同源重导、后续新事件、相似标题、不同 scope、归档及两个真实 CLI 写入进程测试 | 通过。去重只覆盖可读且有身份的记录，重复摘要不增加证据来源。 |
| A59 | route 的 host/owner/SSH 命名空间；文件工具显式 `--home` 与 scope | 方法/静态；自动化；实际运行 | E03 不同 host、fork、alice/bob 回归；E06/E08 当地记录与 Home 回执分开 | Linux/Windows身份与owner边界通过（E13），含SSH命名空间与本层记录分离；Mac结果随最终CI记录。 |
| A60 | registry 写锁/双 revision；knowledge/history 共用写锁与 SHA-256 预期值 | 自动化 | E02/E03 的 stale write、真实并发写者、锁内地图源重验、事件 ID 冲突与旧稿保留测试 | 通过工具协作写入边界。非配合编辑器不受此锁保证，冲突需重读合并。 |
| A61 | query 直接扫正文；index 预算/稳定排序；afterWrite partial | 自动化 | E03 的缺索引回退、预算截断、幂等重建、索引失败保留正文与 verified_at 不变测试 | 通过。不安全来源正文跳过并返回 `complete:false` 与警告，不静默当作有效资料。 |
| A62 | history 的 occurred_at/recorded_at/updated_at；知识 observed/verified 时间 | 方法/静态；自动化；实际运行 | E03 时区、仅日期、unknown、历史排序测试；E07 查询时间、来源版本与限定范围 | 日期与来源字段边界通过。原件已丢失时仅可确认摘要的处理规则属方法覆盖，未另造原件丢失场景。 |
| A63 | knowledge 维护的部分替代/退役；history 保留实际状态 | 方法/静态；自动化 ；实际运行 | E12/E14/E15；原件与结果见对应证据入口 | 真实部分更正保留独立有效内容、退役及两类归档默认排除通过（E12/E14），没有把未完成工作清理成完成。 |
| A64 | knowledge exclusions；各 owner 忘记；history 只读排除依据 | 方法/静态；自动化 ；实际运行 | E12/E14/E15；原件与结果见对应证据入口 | 实际10处跨owner忘记、4次重导拒绝及新Agent四类只读0命中通过（E12/E14）；外部Git/备份/原生范围明确未承诺删除。 |
| A65 | history 接续说明；workflow 查原任务 owner 与实际实例 | 方法/静态；实际运行 | E12/E14/E15；原件与结果见对应证据入口 | 新上下文普通重读与实际同id中断后回读通过（E14/E15）；核查原owner，不因running或活跃表缺项重派，不把摘要当独立CLI resume。 |
| A66 | workflow 收尾与 history 回顾按授权触发；setup 保存不启动 | 方法/静态；自动化 | E04 安装精确文件集合/只读零写入；各方法无 daemon、cron 或宿主记忆同步实现；E12 | 真实任务末整理与安装/只读边界通过（E12/E14）；未创建daemon/未来计划/宿主同步。日周回顾按实际新授权运行属于方法分支。 |

## 最终交付与验证边界

必要的真实多级派遣、项目内部知识查询、两个项目HTTP联合验证、官方Claude发现读取、Home运营、独立新上下文重读及两层原生中断接续均已有证据。Linux/Windows修复后结果绑定5e4e4128；最终CI和公开交付点在[T10](evidences/T10-delivery.md)收口。

Core完整地址、终端、manifest与各厂商CLI组合此次未选，保持既有方法而不宣称现场覆盖。投递超时/空shell等具体CLI异常、生产部署、长期容量、所有技能版本或硬件架构组合不在本次实际运行声明内。macOS使用官方标准Intel runner取得同平台完整证据，不将其视为Arm64结果。
