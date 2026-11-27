# pstack 同步与运行影响报告

来源：cursor/plugins，选定根 harness/pstack。

- 旧固定提交：2eaf46574b25cdf7ef8c849837099b866b7438ce。
- 本次固定提交：b1fbf4b60ac6813b4583ccc356850dafcf492665。
- 来源文件 560 → 541；新增 5、修改 80、删除 24。85 个新增或变化原件均由固定 SHA 读取并逐个验证 Git blob；541 个最终原件逐个验证 Git blob、SHA-256、执行位；未运行新下载的来源工具，既有 view.mjs 仅在下述隔离回放中加载。
- 全部 85 个新增/变化对照同步；14 份原则文档完整重译，其余使用精确差异结合原译文更新；新 reframe、worker 全译；无自然语言的程序/机器夹具保持原字节。中文中范围外 benny 链接固定到同一个最新 SHA，链接目标已核对存在。
- 现存受本次原文变化影响的映射 70 行；删除来源中有运行映射的 22 行；来源剩余待全面评估的映射 139 行。保留所有已有 runtime_paths 和 runtime_reviewed_blob，不自动改运行包。

## 删除来源与旧运行映射

材料原件和中文对照已随上游删除；下表保留删除前的来源与映射，运行文件全部保留。本表应纳入 Change 的 source/，不能伪装成当前来源清单。旧链接固定在删除前 SHA。

| 删除的来源文件 | 旧 Git blob | 受影响运行文件 | 处置建议 |
| --- | --- | --- | --- |
| [claude-code/skills/architect/references/design-red-flags.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/architect/references/design-red-flags.md) | f8503c9595b289c607ff5088f82b21197edf94ec | skills/dev/dev-architecture/references/design-red-flags.md | 保留设计方法与危险信号；评估简化入口 |
| [claude-code/skills/architect/references/rationale-template.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/architect/references/rationale-template.md) | a10f77f59510c532cd909faaf3bfeee5ffbfd588 | skills/dev/dev-architecture/references/rationale-template.md | 保留设计方法与危险信号；评估简化入口 |
| [claude-code/skills/architect/references/runner-prompt.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/architect/references/runner-prompt.md) | b1ad21aef22e80d718c361787190b599eb359d6c | skills/dev/dev-architecture/references/alternative-brief.md | 保留设计方法与危险信号；评估简化入口 |
| [claude-code/skills/how/references/explainer-prompt.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/how/references/explainer-prompt.md) | 3a36fb6736c5b74ac2774350841e332a019dec94 | skills/dev/dev-learn/references/explanation-prompt.md | 保留完整方法；评估合并成一次探索解释 |
| [claude-code/skills/how/references/explorer-prompt.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/how/references/explorer-prompt.md) | 724bacfc7df759865c0c29705bfee641e4c1aeca | skills/dev/dev-learn/references/exploration-prompt.md | 保留完整方法；评估合并成一次探索解释 |
| [claude-code/skills/poteto-mode/playbooks/orchestrate.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/poteto-mode/playbooks/orchestrate.md) | b6e5f5661a1e6b4778845de53f331cee3486905b | skills/dev/dev-parallel/references/program-coordination.md | 保留项目协调；不得恢复每任务新会话政策 |
| [claude-code/skills/poteto-mode/scripts/check-plan.mjs](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/poteto-mode/scripts/check-plan.mjs) | c3ddc398997d29d3c97a414e5c2b37172b901254 | 无 | 材料删除，无运行映射 |
| [claude-code/skills/poteto-mode/scripts/check-plan.test.ts](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/poteto-mode/scripts/check-plan.test.ts) | cd1debfa31579068dc41b8657b7de3b341be29a0 | 无 | 材料删除，无运行映射 |
| [claude-code/skills/reflect/references/divergent-reviewer.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/reflect/references/divergent-reviewer.md) | 1e070a2a3754f4dc0ddbaec4450a56179b81c92f | skills/dev/dev-archive/references/review-blindspots.md | 保留为按需深入复盘视角；改默认单代理流程 |
| [claude-code/skills/reflect/references/judgment-reviewer.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/reflect/references/judgment-reviewer.md) | 61d15d76fff852eb573b551bc1317d79ed5a2e5f | skills/dev/dev-archive/references/review-judgment.md | 保留为按需深入复盘视角；改默认单代理流程 |
| [claude-code/skills/reflect/references/synthesizer.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/reflect/references/synthesizer.md) | 1a090d86134987719ddb418023020c2ef58a6dae | skills/dev/dev-archive/references/review-synthesis.md | 保留为按需深入复盘视角；改默认单代理流程 |
| [claude-code/skills/reflect/references/tooling-reviewer.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/reflect/references/tooling-reviewer.md) | a839db4318798c51539c319cb90387ce02557225 | skills/dev/dev-archive/references/review-tooling.md | 保留为按需深入复盘视角；改默认单代理流程 |
| [claude-code/skills/why/references/epistemics.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/epistemics.md) | b18abf41dfa245ee55e94f1b3a80c0b750eb10cf | skills/dev/dev-why/references/evidence-confidence.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/investigator-prompt.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/investigator-prompt.md) | e1c2bbf52197ff600ba6e4552439e630687b7ae2 | skills/dev/dev-why/references/investigator-brief.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/source-playbook.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/source-playbook.md) | aa3d877cd539763ff05e266ae0a02dd811441e2b | skills/dev/dev-why/references/source-investigation.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/code-archaeology.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/code-archaeology.md) | e3555f809da0a5654ceefe7d2c20080397c03506 | skills/dev/dev-why/references/source-code-history.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/databricks.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/databricks.md) | 2770763ff5d0d1ad004abcc9a0138c9537ad1978 | skills/dev/dev-why/references/source-analytics.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/datadog.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/datadog.md) | 536466ddd8ae6543836abb84bdf1efd8e43089ba | skills/dev/dev-why/references/source-telemetry.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/incident-postmortem.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/incident-postmortem.md) | e7397e7ef374bee3b7f0018ac8e5ddd4322bab12 | skills/dev/dev-why/references/incident-investigation.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/linear.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/linear.md) | 899c643c078f322afe6ae0ef78a007f8ffd356c1 | skills/dev/dev-why/references/source-issues.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/notion.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/notion.md) | d16230a4105fd1dacf870da0950a38faeb9381e6 | skills/dev/dev-why/references/source-documents.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/sentry.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/sentry.md) | 8200fd9f3abbb7fca76d0079663502b33524bd09 | skills/dev/dev-why/references/source-errors.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/sources/slack.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/sources/slack.md) | cadd5618a349adc5eb1dce6fddde38e7221e00fd | skills/dev/dev-why/references/source-conversations.md | 保留证据与来源方法；调整默认调查规模 |
| [claude-code/skills/why/references/synthesizer-prompt.md](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/why/references/synthesizer-prompt.md) | 287a350c925c28b44f0e0dc687bb09a843e11100 | skills/dev/dev-why/references/investigation-synthesis.md | 保留证据与来源方法；调整默认调查规模 |

## 最新来源变化的实施候选

- correct 原文未变化；本仓已有 dev-guardrails/recurring-corrections，应增强来源证据、作用域与冲突处理，不新增平行 dev-correct。
- recall 强化共享记录与聊天记录并行，并保持实时状态核验；建议抽出 dev-recall 唯一负责跨会话回忆，dev-learn 专注讲解；原材料的宿主目录推导必须经过官方约束核验后才运行适配。
- reflect 已删除强制四角色结构，改为持久性筛选、既有技能去重、Accepted/Rejected/Backlog 路由；本地默认轻量单代理，按实际复杂性保留多视角参考。
- architect/how/why 收敛流程；完整本地方法有独立价值，避免仅因上游删除就删本仓引用。
- reframe 可并入 dev-sharpen 的术语澄清分支；worker/poteto 的固定模型、自动载入配置、每任务新代理、固定 PR 正文行数与其他强制门槛不是自动采纳项。
- statechart 的复合状态入口绘制、Windows/CRLF、SANY 行列错误、Java UTF-8、janitor exited 信号与进程回收需逐项移植并验证；本地继续 JavaScript/Node，不复制 TS 运行门槛。
- multi-phase-plan 上游删除 check-plan 机器检查和协调 playbook；本地不新增计划 JSON 或一刀切 unit/live/perf 门禁。

## 验证边界

上述验证证明来源完整性、对照摘要、差异更新和映射保留。未运行任何新下载的来源程序，也未宣称运行技能已升级。运行技能的采纳、拒绝、重构和验证由后续 Issue 分项实施。

静态核验：upstream 与 zh 均恰好 541 个文件，和固定提交的选定路径集合一致；所有原件 Git blob、SHA-256、执行位和对照摘要通过；无新增中文相对链接失效；git diff --check -- materials/pstack 通过。全局 validate-materials 当时仅报告正在并行补齐的 Archify 未登记译文，pstack 无错误。

### 已确认的运行兼容性缺口

执行仓库已有的 npm run check:statechart（本地 JavaScript 运行版 + 隔离捕获夹具回放，包含已有 view.mjs；不执行来源工具、也不求解新的 TLC 模型）返回 exit 1。Login 案例在“图边或节点标记”比较中失败：运行版仍直接输出 s0 → s2；最新来源期望 s0 → s1，并在复合状态内部加入 [*] → s2。失败前日志明确记录 20 个案例通过；其余案例未得到完整结果，不能宣称全部通过。

这是真实的运行绘图适配缺口，不是原件下载或翻译错误。不得修改原件夹具、弱化断言或声称运行版已升级。Issue 应将 backends/mermaid.ts 的 drawnEdges 语义移植到本地 backends/mermaid.mjs 列为独立优先任务，并在完成后重新运行完整回放。
