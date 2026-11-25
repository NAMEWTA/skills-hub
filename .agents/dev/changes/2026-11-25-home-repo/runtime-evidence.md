# 真实 Home 组合验收

## 范围与环境

2026-11-25，在 `temp/dev/home-issue-2/real-home/` 建立三个隔离 Git 仓库 `Home`、`ProjectA`、`ProjectB`。Node.js 为 v24.22.3，Linux；无生产数据、外部 API 或远端业务仓库。Home 实际安装八个 home 包，并经安装目录中的 registry/route 工具登记和解析两个项目。

本次 fixture 明确选择当前环境原生 Agent 协作工具。用户没有要求固定厂商 CLI，产品也不设置默认。实际使用 `collaboration.spawn_agent`、消息和同一负责人会话继续；这不等于 hc、Claude 或独立 codex CLI 验收。独立 codex 0.172.0-alpha.2 尝试启动时在 app-server 初始化遇到只读文件系统，保留失败边界，没有改变受控 HOME 或权限。

## 实际派遣和记录 owner

| 协调层 | 真实负责人 | 真实直接子 Agent | 实际实现/验收 cwd | 记录根 |
| --- | --- | --- | --- | --- |
| Home | `/root` | `/root/real_project_a`、`/root/real_project_b` | 对应项目 | Home 的 `.agents/home/coordination/` 仅存管理回执 |
| ProjectA | `/root/real_project_a` | `/root/real_project_a/provider_implementation` | `real-home/ProjectA` | A 的 `.agents/dev/changes/home-integration/` |
| ProjectB | `/root/real_project_b` | `/root/real_project_b/consumer_impl` | `real-home/ProjectB` | B 的 `.agents/dev/changes/home-integration/` |

两位项目负责人实际创建实现子 Agent，由子 Agent 编写源码和本地回执；负责人分别独立审查、编写测试、执行、提交。Home 不直接派遣或清理 A/B 的后代。项目没有安装 Home 接收器或 hook，也未借用 Home 安装目录作为当地运行依赖；它们按本地 AGENTS.md 接受普通任务。

B 最初只读上下文曾使用 Home/A cwd，读取规则后全部实现、审查、测试、写记录及 Git 操作固定 B。该早期差异保留在 B 的 context.json，不把所有历史 cwd 伪写为 B。A 首次写上层回执时发现 Home coordination 父目录不存在，先回报，由 Home 创建目录，再写指定文件。

## ProjectA 独立交付

- 源码验收提交：`311addd209ba3de9ce239a32e2f020b009ab8c95`。
- 最终提交：`01a65d39917cee923a10e65acf35a4391a87b65b`，工作树干净。后续提交仅增加知识查询证据和交接记录。
- 实际 `npm test`：58 通过、0 失败、0 跳过，退出 0；另有实际 HTTP 200/200/400 样本。
- `src/provider.js` SHA-256：`5fd3af45c20b2180c4701ae47ab255a393ea2632d00274e21fe34c5f91769063`。
- 服务使用 Node 标准库、回环地址与临时端口，提供 health、整数分报价、严格数量校验、404/405 和每请求 UUID。

权威原件留 A：`task.md`、`provider-report.md`、负责人 `report.md`、`test/provider.test.js` 与 `evidence/` 下实际输出。Home 只接收 `project-a-report.md` 和来源指针。

## 项目内部知识查询

Home 在代码验收后向原 A 负责人追问单价和金额表示的理由；提问前没有读取 A 的内部定价笔记，也不知道负责人生成的决策 UUID。A 在实际项目 cwd 执行定向 `rg`，核对 Git blob、工作文件和版本后返回摘要，没有重派编码任务。

| 项目 | 真实结果 |
| --- | --- |
| 决策标识 | `f22befb6-26e5-447f-88cc-8dec9fe0a4f9` |
| 当地来源 | `.agents/dev/notes/pricing.md` |
| 查询时版本 | `311addd209ba3de9ce239a32e2f020b009ab8c95` |
| 来源 Git blob | `a689155e70e4174f968357dd925a4ce45520a705` |
| 来源 SHA-256 | `ac762cbb7bbe7b4a7da11fa6e12dcc4ee835ea3b8d2146d213fa59335098e26c` |

查询区分了 fixture 假设与外部事实：1290 分是隔离演示商品的负责人假设，含元与角便于暴露单位错误，没有市场询价依据；整数分避免本例的浮点金额歧义。Home 的 `project-a-knowledge-report.md` 保存适用范围和来源，不建立内部知识镜像。最终 A 提交中该来源 blob 未变。

## ProjectB 真实联合验收

Home 明确由 B 负责人执行集成验收。B 使用 A 的公开 `startProvider({port:0})`，实际在 `127.0.0.1:44991` 启动并通过 HTTP 调用，没有用伪造的项目回执替代执行。

| 项目 | 真实结果 |
| --- | --- |
| A 组合版本 | `01a65d39917cee923a10e65acf35a4391a87b65b`，执行前后 clean |
| B 最终版本 | `45aec563d2719bdf3868b55f4e8aa3ab11698dcf`，提交后 clean |
| 独立命令 | `npm test` → `node --test --test-reporter=spec`，退出 0 |
| 独立结果 | 34 通过、0 失败、0 跳过 |
| 真实正常链路 | health=ok；qty=2、unitPriceCents=1290、totalCents=2580、currency=CNY |
| 真实请求标识样本 | `aca25a6d-b44a-4f7d-ad57-376c8b3d2886` |
| 真实非法请求 | 缺失、0、101、负数、小数、前导零、科学计数、加号、空白、空值、重复、额外参数共 12 类均 HTTP 400 |
| 资源关闭 | listening=false、address=null；新连接 ECONNREFUSED；进程正常退出 |

B 的调用方异常响应校验另使用明确标注的本地夹具，与真实 A→B 链路区分。超时、响应体积上限和中断流只做静态审查，未专门注入；未验证生产部署、长期压力或 Node20 最低版本。Home 未把组合通过描述为多仓原子发布。

权威原件留 B：`owner-report.md`、`execution.json`、`test-output.log`、`context.json`、`implementation-report.md`，以及当前知识 `.agents/dev/notes/consumer.md`。Home 收到 `project-b-report.md`，未扫描 A/B 技术知识来替项目回答。

## Claude 宿主和发布包

[Linux CI 的实际日志](https://github.com/NAMEWTA/skills-hub/actions/runs/45567944978/job/139047242747)绑定源码 `139b3e87328aa490d239632f3a1065a939ead696`：472 项全通过、无跳过；正常联网真实 npm tarball 验证 63 技能/1092 文件及全部目录链接；Archify 完整 finalize 和真实 browser-check 通过。

同一任务独立安装官方 SDK `0.3.332`，实际 Claude Code 返回版本 `2.1.332`。维护脚本通过真实进程的 `supportedCommands`、`reloadSkills` 核查全部 63 技能，再通过其 `readFile` 读取 121 个入口/参考资源；每个 requestedPath 在 `.claude/skills/`，有效 realpath 回到同仓 `.agents/skills/`，正文 SHA-256 与本体一致。没有发送用户回合，结果明确 `modelInferenceVerified=false`：这是宿主发现/读取验收，不是模型执行任务证明。没有把 fs.realpath 的单独检查当作宿主证据。

原始日志摘录和完整远端日志地址留 `temp/dev/home-issue-2/ci-linux-139b3e8-excerpt.log`。Windows 首轮发现8.3短路径与Git长路径比较差异，已统一native realpath并增加root判定断言。[第二轮Windows job](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544686)绑定5e4e4128465ef93e8d0ccd6cfa9537b4a552068a：472项中468通过、0失败、4个平台不适用项跳过（三项POSIX权限位与Unix套接字）；正常0.1.30 tarball和全部真实目录symlink通过。[同轮Linux](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544568)472/472、正常包、真实浏览器与Claude63技能/121资源全部通过。macOS及最终提交结果在T10收口。

## 运营与新上下文

运营负责人 /root/home_operations 已在实际安装目录完成110步留痕、22项有效结果检查；原始argv/cwd/退出码与JSON返回在Home的temp/home-operations-evidence/commands.jsonl及result.json，管理回执为coordination/operations-report.md。新上下文与受控中断的独立结果见后文，不从这22项推断。

本次资料明确标为隔离fixture，不把测试偏好写成真实用户偏好。现行格式唯一owner为context/preferences.md；knowledge只保存指针。随机决定ID为9fd1d36a-9174-48ab-a127-a7e4aa1e393e，现行决定时间2026-11-25T07:30:30.145+00:00。初始事件22300b40-081c-4a3a-90fc-e45a651cd9de与后续f608d65a-9d07-4e05-b82c-4c96f1083209分开保存实际发生时间、首次记录时间和理由，重导返回unchanged。

实测覆盖候选默认排除、部分更正保留独立内容、knowledge/history旧SHA返回STALE、知识退役及归档默认排除、历史归档参与去重、删除索引后直接查正文、两次重建字节相同且不刷新事实时间。

忘记fixture原先在3份context、notes、inbox、history、两类archive与两索引共10处有载荷。各owner定点清理后，业务正文与本轮临时输入/日志的载荷命中为0，无关独立内容保留；knowledge的exclusions只保留获准source_ref/scope/basis_ref。knowledge/history通过sources和derived_from四次重导均返回EXCLUDED；查询与重建不复活。没有声称删除Git历史、备份、远端、原始对话、原生记忆或未触达项目原件。

首轮Python时钟的六位小数ISO输入实际返回DATE并未保存历史正文；仅两份本轮setup半成品按hash清理，失败证据保留。后续使用新的实际时钟观测与毫秒精度重新执行一次主链，未伪称无损转换或混用发生/整理时间。产品文档和错误信息已明确支持秒及1–3位小数的边界，未偷偷截断高精度来源。

Home关系owner依据A/B直接回执建立实际生产/消费关系，安装目录route复核两仓身份、版本和clean状态，contextRead=false，未扫描技术知识。

## 全新上下文与真实中断接续结果

全新 /root/home_fresh_session 由fork_turns=none创建，其初始提示仅有路径和问题，没有随机ID、规则值或旧理由。它实际读取已安装方法和Home Markdown、执行35条查询/核查命令，准确回报当前随机ID9fd1d36a-9174-48ab-a127-a7e4aa1e393e、唯一preferences owner、两条历史事件的当时理由/occurred_at/recorded_at、候选未确认、归档默认排除和忘记的最小依据。根负责人逐项与独立保存的答案表核对一致。项目路由只确认入口/HEAD/dirty，contextRead=false；它没有扫描项目内部知识。

父实际调用interrupt_agent对正在运行的Home新Agent和原ProjectA负责人分别中断，两个工具返回previous_status=running。之后父使用同一Agent身份followup，而不是另起实现者。ProjectA等待直接观察到aborted by user after 22.3s；两层恢复都首先实际回读各自checkpoint与原owner记录，再核对当前状态。

Home checkpoint SHA-256为09805f61116812b86e0f0069f4a5ee2ac15782f6e7d08033d3694fe0c82ba786，恢复时Home业务HEAD为c63f74f036a23b734d86d9c150c2be2cb67808a2；23份权威Markdown字节未变，原35命令未重复。A恢复后HEAD仍为01a65d39917cee923a10e65acf35a4391a87b65b、dirty为空、provider SHA仍为5fd3af45c20b2180c4701ae47ab255a393ea2632d00274e21fe34c5f91769063，原task/report哈希不变。没有重复编码、测试、新派子Agent或Git提交。

新Agent明确区分原A/B已完成交付与后来临时A15任务的running状态；活跃表没列出B也不被解读为可重派。当前原生协作工具同id恢复不扩展为独立CLI、独立进程或跨工具resume能力。

原件：Home的coordination/fresh-session-report.md、temp/fresh-session-evidence/{answers-and-findings.md,commands.jsonl,checkpoint.json,resume-record.md,controlled-interrupt-result.json}；A的temp/home-resumption/{checkpoint.json,resumption-evidence.json,resumption-report.md}及Home指定project-a-resumption-report.md。父实际控制回执留外层temp/dev/home-issue-2/controlled-resumption-parent.json。

## CI runner记录

macos-latest的Arm64任务曾持续排队，既有main在06:51 UTC的验证及更早06:42的PR验证同样等待。2026-11-25核对GitHub官方runner清单后，将本次macOS门禁固定到同版标准macos-26-intel / Node24，完整check:full、statechart、正常npm包门禁保持。依据：https://docs.github.com/en/actions/reference/runners/github-hosted-runners 。这是实际运行环境选择，不把Intel结果冒称Arm64结果。旧main任务后于07:49 UTC完成；旧首轮Home任务于07:56完成并暴露下述真实缺陷，未把队列问题当作代码通过。

## macOS真实失败与回归

[首轮macOS job](https://github.com/NAMEWTA/skills-hub/actions/runs/45567944978/job/139047243255)绑定139b3e87328aa490d239632f3a1065a939ead696，472项中469通过、3失败、0跳过。

其中两项是安装测试的路径假设：产品正确将项目根规范到真实路径，但测试仍把`/var/...`与`/private/var/...`进行字符串比较，或以未规范路径注入失败。只修夹具比较和注入匹配，并增加注入命中断言；未改安装器产品语义。Linux真实链接模拟该布局，旧版指定两项2/2失败，修复后原合同和新增链接父目录变体4/4通过；整个安装测试73/73、无skip。

另一项是真实Home CLI入口缺陷。Node的ESM入口会解析链接，但argv仍保留别名，原字符串判断静默跳过main。五个Home CLI均修为native realpath比较，保留每包自包含和正常模块导入；不存在或缺失argv不触发CLI。回归实际复制五个独立包，建立`.claude/skills`到`.agents/skills`目录真链接，分别执行help、只读JSON和非法参数；另验证存在、缺失、不存在argv路径的正常导入。六组Home专项68/68、无skip。最终提交的三平台结果归T10，不能由本地复现替代Mac复验。
