# 本地全文与工具对照资料

这里保存 649 份固定版本原件及逐份本地对照，共 1298 个配对文件。其中文档 212 份、代码与配置 68 份、机器夹具 362 份、原始图片 7 份。全部内容都在仓库内；来源与固定版本集中见仓库 [README](../README.md#致谢与许可)。

**这些 `.txt` 文件是对照材料，不是技能指令。** 不参与技能发现，不会被安装，也不作为当前流程执行入口。使用技能应读取 `skills/` 中已经统一名称、路径、授权与持久化约定的运行资源。

| 类别 | 本地对照 | 完整性要求 |
| --- | --- | --- |
| 文档 | `original.txt` 与 `zh-CN.txt` | 自然语言逐份完整翻译为中文，保留结构、表格、代码示例和数值；原本中文的材料保留原文 |
| 代码与配置 | `original.txt` 与 `localized.txt` | 保留程序逻辑、协议字段与技术标识，按需翻译可读说明；不把源码冒称为中文文档 |
| 机器夹具 | `original.txt` 与 `localized.txt` | 两份字节一致，保留测试输入、黄金输出、空文件和算法回放依据 |
| 原始图片 | `original` 与 `localized` 加原扩展名 | 原字节保存；中文图意保留在对应文档底稿，不将来源品牌插画装入技能 |

底稿保留原始名称、历史工具绑定与目录约定，只说明原件语境；当前运行遵守本项目约定，工程方法按任务选择。完整许可保存在根目录 `licenses/`，安装时另附。工具的源夹具完整保留在此，不代表把整套开发测试依赖安装到每个使用项目。

逐文件摘要、类别、运行位置和适配说明见 [清单](manifest.tsv)，组织规则见 [资源组织](../docs/resources.md)。原件均按固定修订 Git blob 核对；摘要只能证明字节一致，译文质量仍需对照阅读。


## A 组

35 份。路径列保留收录时的文件位置，所有链接均指向本仓库。


### A 组 · 文档

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| a001 | `skills/engineering/ask-matt/PHASE-BOUNDARIES.md` | [原件](a001/original.txt) | [中文全文](a001/zh-CN.txt) |
| a002 | `skills/engineering/ask-matt/SKILL.md` | [原件](a002/original.txt) | [中文全文](a002/zh-CN.txt) |
| a003 | `skills/engineering/code-review/SKILL.md` | [原件](a003/original.txt) | [中文全文](a003/zh-CN.txt) |
| a004 | `skills/engineering/codebase-design/DEEPENING.md` | [原件](a004/original.txt) | [中文全文](a004/zh-CN.txt) |
| a005 | `skills/engineering/codebase-design/DESIGN-IT-TWICE.md` | [原件](a005/original.txt) | [中文全文](a005/zh-CN.txt) |
| a006 | `skills/engineering/codebase-design/SKILL.md` | [原件](a006/original.txt) | [中文全文](a006/zh-CN.txt) |
| a007 | `skills/engineering/diagnosing-bugs/SKILL.md` | [原件](a007/original.txt) | [中文全文](a007/zh-CN.txt) |
| a008 | `skills/engineering/domain-modeling/ADR-FORMAT.md` | [原件](a008/original.txt) | [中文全文](a008/zh-CN.txt) |
| a009 | `skills/engineering/domain-modeling/GLOSSARY-FORMAT.md` | [原件](a009/original.txt) | [中文全文](a009/zh-CN.txt) |
| a010 | `skills/engineering/domain-modeling/SKILL.md` | [原件](a010/original.txt) | [中文全文](a010/zh-CN.txt) |
| a011 | `skills/engineering/implement/SKILL.md` | [原件](a011/original.txt) | [中文全文](a011/zh-CN.txt) |
| a012 | `skills/engineering/implement-spec/SKILL.md` | [原件](a012/original.txt) | [中文全文](a012/zh-CN.txt) |
| a013 | `skills/engineering/pr/SKILL.md` | [原件](a013/original.txt) | [中文全文](a013/zh-CN.txt) |
| a014 | `skills/engineering/prototype/LOGIC.md` | [原件](a014/original.txt) | [中文全文](a014/zh-CN.txt) |
| a015 | `skills/engineering/prototype/SKILL.md` | [原件](a015/original.txt) | [中文全文](a015/zh-CN.txt) |
| a016 | `skills/engineering/prototype/UI.md` | [原件](a016/original.txt) | [中文全文](a016/zh-CN.txt) |
| a017 | `skills/engineering/research/SKILL.md` | [原件](a017/original.txt) | [中文全文](a017/zh-CN.txt) |
| a018 | `skills/engineering/retro/SKILL.md` | [原件](a018/original.txt) | [中文全文](a018/zh-CN.txt) |
| a019 | `skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md` | [原件](a019/original.txt) | [中文全文](a019/zh-CN.txt) |
| a020 | `skills/engineering/to-spec/SKILL.md` | [原件](a020/original.txt) | [中文全文](a020/zh-CN.txt) |
| a021 | `skills/engineering/to-tickets/SKILL.md` | [原件](a021/original.txt) | [中文全文](a021/zh-CN.txt) |
| a022 | `skills/engineering/triage/AGENT-BRIEF.md` | [原件](a022/original.txt) | [中文全文](a022/zh-CN.txt) |
| a023 | `skills/engineering/triage/OUT-OF-SCOPE.md` | [原件](a023/original.txt) | [中文全文](a023/zh-CN.txt) |
| a024 | `skills/engineering/triage/SKILL.md` | [原件](a024/original.txt) | [中文全文](a024/zh-CN.txt) |
| a025 | `skills/engineering/wayfinder/SKILL.md` | [原件](a025/original.txt) | [中文全文](a025/zh-CN.txt) |
| a026 | `skills/productivity/grill-me/SKILL.md` | [原件](a026/original.txt) | [中文全文](a026/zh-CN.txt) |
| a027 | `skills/productivity/grilling/SKILL.md` | [原件](a027/original.txt) | [中文全文](a027/zh-CN.txt) |
| a028 | `skills/productivity/handoff/SKILL.md` | [原件](a028/original.txt) | [中文全文](a028/zh-CN.txt) |
| a029 | `skills/productivity/writing-for-agents/SKILL-MECHANICS.md` | [原件](a029/original.txt) | [中文全文](a029/zh-CN.txt) |
| a030 | `skills/productivity/writing-for-agents/SKILL.md` | [原件](a030/original.txt) | [中文全文](a030/zh-CN.txt) |
| a032 | `skills/engineering/pr/CREDITS.md` | [原件](a032/original.txt) | [中文全文](a032/zh-CN.txt) |
| a033 | `skills/engineering/tdd/SKILL.md` | [原件](a033/original.txt) | [中文全文](a033/zh-CN.txt) |
| a034 | `skills/engineering/tdd/mocking.md` | [原件](a034/original.txt) | [中文全文](a034/zh-CN.txt) |
| a035 | `skills/engineering/tdd/tests.md` | [原件](a035/original.txt) | [中文全文](a035/zh-CN.txt) |

### A 组 · 代码与配置

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| a031 | `skills/engineering/diagnosing-bugs/scripts/hitl-loop.template.sh` | [原件](a031/original.txt) | [代码对照](a031/localized.txt) |

## B 组

573 份。路径列保留收录时的文件位置，所有链接均指向本仓库。


### B 组 · 文档

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| b001 | `pstack/skills/architect/SKILL.md` | [原件](b001/original.txt) | [中文全文](b001/zh-CN.txt) |
| b002 | `pstack/skills/architect/references/design-red-flags.md` | [原件](b002/original.txt) | [中文全文](b002/zh-CN.txt) |
| b003 | `pstack/skills/architect/references/rationale-template.md` | [原件](b003/original.txt) | [中文全文](b003/zh-CN.txt) |
| b004 | `pstack/skills/blast-radius/SKILL.md` | [原件](b004/original.txt) | [中文全文](b004/zh-CN.txt) |
| b005 | `pstack/skills/create-verification-skill/SKILL.md` | [原件](b005/original.txt) | [中文全文](b005/zh-CN.txt) |
| b006 | `pstack/skills/create-verification-skill/references/feature-map-example/create-note.md` | [原件](b006/original.txt) | [中文全文](b006/zh-CN.txt) |
| b007 | `pstack/skills/how/SKILL.md` | [原件](b007/original.txt) | [中文全文](b007/zh-CN.txt) |
| b008 | `pstack/skills/interrogate/SKILL.md` | [原件](b008/original.txt) | [中文全文](b008/zh-CN.txt) |
| b009 | `pstack/skills/maintain-verification-skill/SKILL.md` | [原件](b009/original.txt) | [中文全文](b009/zh-CN.txt) |
| b010 | `pstack/skills/poteto-mode/SKILL.md` | [原件](b010/original.txt) | [中文全文](b010/zh-CN.txt) |
| b011 | `pstack/skills/poteto-mode/playbooks/autonomous-run.md` | [原件](b011/original.txt) | [中文全文](b011/zh-CN.txt) |
| b012 | `pstack/skills/poteto-mode/playbooks/autopilot-full.md` | [原件](b012/original.txt) | [中文全文](b012/zh-CN.txt) |
| b013 | `pstack/skills/poteto-mode/playbooks/bug-fix.md` | [原件](b013/original.txt) | [中文全文](b013/zh-CN.txt) |
| b014 | `pstack/skills/poteto-mode/playbooks/feature.md` | [原件](b014/original.txt) | [中文全文](b014/zh-CN.txt) |
| b015 | `pstack/skills/poteto-mode/playbooks/multi-phase-plan.md` | [原件](b015/original.txt) | [中文全文](b015/zh-CN.txt) |
| b016 | `pstack/skills/poteto-mode/playbooks/opening-a-pr.md` | [原件](b016/original.txt) | [中文全文](b016/zh-CN.txt) |
| b017 | `pstack/skills/poteto-mode/playbooks/orchestrate.md` | [原件](b017/original.txt) | [中文全文](b017/zh-CN.txt) |
| b018 | `pstack/skills/poteto-mode/playbooks/pause-safely.md` | [原件](b018/original.txt) | [中文全文](b018/zh-CN.txt) |
| b019 | `pstack/skills/poteto-mode/playbooks/refactoring.md` | [原件](b019/original.txt) | [中文全文](b019/zh-CN.txt) |
| b020 | `pstack/skills/poteto-mode/playbooks/session-pickup.md` | [原件](b020/original.txt) | [中文全文](b020/zh-CN.txt) |
| b021 | `pstack/skills/poteto-mode/playbooks/shipping.md` | [原件](b021/original.txt) | [中文全文](b021/zh-CN.txt) |
| b022 | `pstack/skills/poteto-mode/playbooks/visual-parity.md` | [原件](b022/original.txt) | [中文全文](b022/zh-CN.txt) |
| b023 | `pstack/skills/principle-boundary-discipline/SKILL.md` | [原件](b023/original.txt) | [中文全文](b023/zh-CN.txt) |
| b024 | `pstack/skills/principle-encode-lessons-in-structure/SKILL.md` | [原件](b024/original.txt) | [中文全文](b024/zh-CN.txt) |
| b025 | `pstack/skills/principle-model-the-domain/SKILL.md` | [原件](b025/original.txt) | [中文全文](b025/zh-CN.txt) |
| b026 | `pstack/skills/principle-never-block-on-the-human/SKILL.md` | [原件](b026/original.txt) | [中文全文](b026/zh-CN.txt) |
| b027 | `pstack/skills/principle-outcome-oriented-execution/SKILL.md` | [原件](b027/original.txt) | [中文全文](b027/zh-CN.txt) |
| b028 | `pstack/skills/principle-prove-it-works/SKILL.md` | [原件](b028/original.txt) | [中文全文](b028/zh-CN.txt) |
| b029 | `pstack/skills/principle-sequence-verifiable-units/SKILL.md` | [原件](b029/original.txt) | [中文全文](b029/zh-CN.txt) |
| b030 | `pstack/skills/principle-test-behavior-not-implementation/SKILL.md` | [原件](b030/original.txt) | [中文全文](b030/zh-CN.txt) |
| b031 | `pstack/skills/recall/SKILL.md` | [原件](b031/original.txt) | [中文全文](b031/zh-CN.txt) |
| b032 | `pstack/skills/reflect/SKILL.md` | [原件](b032/original.txt) | [中文全文](b032/zh-CN.txt) |
| b033 | `pstack/skills/swarm/SKILL.md` | [原件](b033/original.txt) | [中文全文](b033/zh-CN.txt) |
| b034 | `pstack/skills/unslop/SKILL.md` | [原件](b034/original.txt) | [中文全文](b034/zh-CN.txt) |
| b035 | `pstack/skills/why/SKILL.md` | [原件](b035/original.txt) | [中文全文](b035/zh-CN.txt) |
| b036 | `pstack/skills/architect/references/runner-prompt.md` | [原件](b036/original.txt) | [中文全文](b036/zh-CN.txt) |
| b037 | `pstack/skills/create-verification-skill/references/feature-map-example/README.md` | [原件](b037/original.txt) | [中文全文](b037/zh-CN.txt) |
| b038 | `pstack/skills/create-verification-skill/references/feature-map-example/search.md` | [原件](b038/original.txt) | [中文全文](b038/zh-CN.txt) |
| b039 | `pstack/skills/how/references/explainer-prompt.md` | [原件](b039/original.txt) | [中文全文](b039/zh-CN.txt) |
| b040 | `pstack/skills/how/references/explorer-prompt.md` | [原件](b040/original.txt) | [中文全文](b040/zh-CN.txt) |
| b041 | `pstack/skills/poteto-mode/playbooks/authoring-a-skill.md` | [原件](b041/original.txt) | [中文全文](b041/zh-CN.txt) |
| b042 | `pstack/skills/poteto-mode/playbooks/autopilot-stack.md` | [原件](b042/original.txt) | [中文全文](b042/zh-CN.txt) |
| b043 | `pstack/skills/poteto-mode/playbooks/babysit.md` | [原件](b043/original.txt) | [中文全文](b043/zh-CN.txt) |
| b044 | `pstack/skills/poteto-mode/playbooks/eval.md` | [原件](b044/original.txt) | [中文全文](b044/zh-CN.txt) |
| b045 | `pstack/skills/poteto-mode/playbooks/hillclimb.md` | [原件](b045/original.txt) | [中文全文](b045/zh-CN.txt) |
| b046 | `pstack/skills/poteto-mode/playbooks/investigation.md` | [原件](b046/original.txt) | [中文全文](b046/zh-CN.txt) |
| b047 | `pstack/skills/poteto-mode/playbooks/perf-issue.md` | [原件](b047/original.txt) | [中文全文](b047/zh-CN.txt) |
| b048 | `pstack/skills/poteto-mode/playbooks/prototype.md` | [原件](b048/original.txt) | [中文全文](b048/zh-CN.txt) |
| b049 | `pstack/skills/poteto-mode/playbooks/runtime-forensics.md` | [原件](b049/original.txt) | [中文全文](b049/zh-CN.txt) |
| b050 | `pstack/skills/poteto-mode/playbooks/trace-forensics.md` | [原件](b050/original.txt) | [中文全文](b050/zh-CN.txt) |
| b051 | `pstack/skills/poteto-mode/playbooks/worktree-cleanup.md` | [原件](b051/original.txt) | [中文全文](b051/zh-CN.txt) |
| b052 | `pstack/skills/poteto-mode/references/bugbot-triage.md` | [原件](b052/original.txt) | [中文全文](b052/zh-CN.txt) |
| b053 | `pstack/skills/reflect/references/divergent-reviewer.md` | [原件](b053/original.txt) | [中文全文](b053/zh-CN.txt) |
| b054 | `pstack/skills/reflect/references/judgment-reviewer.md` | [原件](b054/original.txt) | [中文全文](b054/zh-CN.txt) |
| b055 | `pstack/skills/reflect/references/synthesizer.md` | [原件](b055/original.txt) | [中文全文](b055/zh-CN.txt) |
| b056 | `pstack/skills/reflect/references/tooling-reviewer.md` | [原件](b056/original.txt) | [中文全文](b056/zh-CN.txt) |
| b057 | `pstack/skills/why/references/epistemics.md` | [原件](b057/original.txt) | [中文全文](b057/zh-CN.txt) |
| b058 | `pstack/skills/why/references/investigator-prompt.md` | [原件](b058/original.txt) | [中文全文](b058/zh-CN.txt) |
| b059 | `pstack/skills/why/references/source-playbook.md` | [原件](b059/original.txt) | [中文全文](b059/zh-CN.txt) |
| b060 | `pstack/skills/why/references/sources/code-archaeology.md` | [原件](b060/original.txt) | [中文全文](b060/zh-CN.txt) |
| b061 | `pstack/skills/why/references/sources/databricks.md` | [原件](b061/original.txt) | [中文全文](b061/zh-CN.txt) |
| b062 | `pstack/skills/why/references/sources/datadog.md` | [原件](b062/original.txt) | [中文全文](b062/zh-CN.txt) |
| b063 | `pstack/skills/why/references/sources/incident-postmortem.md` | [原件](b063/original.txt) | [中文全文](b063/zh-CN.txt) |
| b064 | `pstack/skills/why/references/sources/linear.md` | [原件](b064/original.txt) | [中文全文](b064/zh-CN.txt) |
| b065 | `pstack/skills/why/references/sources/notion.md` | [原件](b065/original.txt) | [中文全文](b065/zh-CN.txt) |
| b066 | `pstack/skills/why/references/sources/sentry.md` | [原件](b066/original.txt) | [中文全文](b066/zh-CN.txt) |
| b067 | `pstack/skills/why/references/sources/slack.md` | [原件](b067/original.txt) | [中文全文](b067/zh-CN.txt) |
| b068 | `pstack/skills/why/references/synthesizer-prompt.md` | [原件](b068/original.txt) | [中文全文](b068/zh-CN.txt) |
| b069 | `pstack/agents/comment-sicko.md` | [原件](b069/original.txt) | [中文全文](b069/zh-CN.txt) |
| b070 | `pstack/skills/arena/SKILL.md` | [原件](b070/original.txt) | [中文全文](b070/zh-CN.txt) |
| b071 | `pstack/skills/benchmark-checklist/SKILL.md` | [原件](b071/original.txt) | [中文全文](b071/zh-CN.txt) |
| b072 | `pstack/skills/no-comments/SKILL.md` | [原件](b072/original.txt) | [中文全文](b072/zh-CN.txt) |
| b073 | `pstack/skills/principle-attack-the-premise/SKILL.md` | [原件](b073/original.txt) | [中文全文](b073/zh-CN.txt) |
| b074 | `pstack/skills/principle-build-the-lever/SKILL.md` | [原件](b074/original.txt) | [中文全文](b074/zh-CN.txt) |
| b075 | `pstack/skills/principle-exhaust-the-design-space/SKILL.md` | [原件](b075/original.txt) | [中文全文](b075/zh-CN.txt) |
| b076 | `pstack/skills/principle-experience-first/SKILL.md` | [原件](b076/original.txt) | [中文全文](b076/zh-CN.txt) |
| b077 | `pstack/skills/principle-explain-the-number/SKILL.md` | [原件](b077/original.txt) | [中文全文](b077/zh-CN.txt) |
| b078 | `pstack/skills/principle-fix-root-causes/SKILL.md` | [原件](b078/original.txt) | [中文全文](b078/zh-CN.txt) |
| b079 | `pstack/skills/principle-foundational-thinking/SKILL.md` | [原件](b079/original.txt) | [中文全文](b079/zh-CN.txt) |
| b080 | `pstack/skills/principle-guard-the-context-window/SKILL.md` | [原件](b080/original.txt) | [中文全文](b080/zh-CN.txt) |
| b081 | `pstack/skills/principle-laziness-protocol/SKILL.md` | [原件](b081/original.txt) | [中文全文](b081/zh-CN.txt) |
| b082 | `pstack/skills/principle-make-operations-idempotent/SKILL.md` | [原件](b082/original.txt) | [中文全文](b082/zh-CN.txt) |
| b083 | `pstack/skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md` | [原件](b083/original.txt) | [中文全文](b083/zh-CN.txt) |
| b084 | `pstack/skills/principle-minimize-reader-load/SKILL.md` | [原件](b084/original.txt) | [中文全文](b084/zh-CN.txt) |
| b085 | `pstack/skills/principle-redesign-from-first-principles/SKILL.md` | [原件](b085/original.txt) | [中文全文](b085/zh-CN.txt) |
| b086 | `pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md` | [原件](b086/original.txt) | [中文全文](b086/zh-CN.txt) |
| b087 | `pstack/skills/principle-subtract-before-you-add/SKILL.md` | [原件](b087/original.txt) | [中文全文](b087/zh-CN.txt) |
| b088 | `pstack/skills/principle-type-system-discipline/SKILL.md` | [原件](b088/original.txt) | [中文全文](b088/zh-CN.txt) |
| b089 | `pstack/skills/sharpen/SKILL.md` | [原件](b089/original.txt) | [中文全文](b089/zh-CN.txt) |
| b090 | `pstack/skills/typescript-best-practices/SKILL.md` | [原件](b090/original.txt) | [中文全文](b090/zh-CN.txt) |
| b091 | `pstack/skills/typescript-best-practices/references/patterns.md` | [原件](b091/original.txt) | [中文全文](b091/zh-CN.txt) |
| b092 | `pstack/skills/correct/SKILL.md` | [原件](b092/original.txt) | [中文全文](b092/zh-CN.txt) |
| b093 | `pstack/skills/create-formal-verification-skill/SKILL.md` | [原件](b093/original.txt) | [中文全文](b093/zh-CN.txt) |
| b094 | `pstack/skills/figure-it-out/SKILL.md` | [原件](b094/original.txt) | [中文全文](b094/zh-CN.txt) |
| b095 | `pstack/skills/maintain-formal-verification-skill/SKILL.md` | [原件](b095/original.txt) | [中文全文](b095/zh-CN.txt) |
| b096 | `pstack/skills/show-me-your-work/SKILL.md` | [原件](b096/original.txt) | [中文全文](b096/zh-CN.txt) |
| b099 | `pstack/skills/statechart/SKILL.md` | [原件](b099/original.txt) | [中文全文](b099/zh-CN.txt) |
| b100 | `pstack/skills/statechart/references/render.md` | [原件](b100/original.txt) | [中文全文](b100/zh-CN.txt) |
| b508 | `pstack/LICENSE` | [原件](b508/original.txt) | [中文全文](b508/zh-CN.txt) |
| b509 | `pstack/README.md` | [原件](b509/original.txt) | [中文全文](b509/zh-CN.txt) |
| b510 | `pstack/agents/poteto-agent.md` | [原件](b510/original.txt) | [中文全文](b510/zh-CN.txt) |
| b512 | `pstack/automations/benny/FOR_AGENTS.md` | [原件](b512/original.txt) | [中文全文](b512/zh-CN.txt) |
| b513 | `pstack/automations/benny/README.md` | [原件](b513/original.txt) | [中文全文](b513/zh-CN.txt) |
| b514 | `pstack/automations/benny/skills/reproduce-and-fix-issues/SKILL.md` | [原件](b514/original.txt) | [中文全文](b514/zh-CN.txt) |
| b515 | `pstack/automations/benny/skills/reproduce-and-fix-issues/references/control-adapter.md` | [原件](b515/original.txt) | [中文全文](b515/zh-CN.txt) |
| b516 | `pstack/automations/benny/skills/reproduce-and-fix-issues/references/feature-map.example.md` | [原件](b516/original.txt) | [中文全文](b516/zh-CN.txt) |
| b517 | `pstack/automations/benny/skills/reproduce-and-fix-issues/references/verify-existing-fix.md` | [原件](b517/original.txt) | [中文全文](b517/zh-CN.txt) |
| b518 | `pstack/automations/benny/skills/setup-benny/SKILL.md` | [原件](b518/original.txt) | [中文全文](b518/zh-CN.txt) |
| b519 | `pstack/automations/benny/skills/triage-issue-reports/SKILL.md` | [原件](b519/original.txt) | [中文全文](b519/zh-CN.txt) |
| b520 | `pstack/automations/benny/skills/triage-issue-reports/references/routing.example.md` | [原件](b520/original.txt) | [中文全文](b520/zh-CN.txt) |
| b522 | `pstack/automations/benny/templates/reproduce-automation-prompt.md` | [原件](b522/original.txt) | [中文全文](b522/zh-CN.txt) |
| b523 | `pstack/automations/benny/templates/triage-automation-prompt.md` | [原件](b523/original.txt) | [中文全文](b523/zh-CN.txt) |
| b524 | `pstack/docs/guide/01-setup.md` | [原件](b524/original.txt) | [中文全文](b524/zh-CN.txt) |
| b525 | `pstack/docs/guide/02-poteto-mode.md` | [原件](b525/original.txt) | [中文全文](b525/zh-CN.txt) |
| b526 | `pstack/docs/guide/03-understand.md` | [原件](b526/original.txt) | [中文全文](b526/zh-CN.txt) |
| b527 | `pstack/docs/guide/04-design.md` | [原件](b527/original.txt) | [中文全文](b527/zh-CN.txt) |
| b528 | `pstack/docs/guide/05-build-and-clean.md` | [原件](b528/original.txt) | [中文全文](b528/zh-CN.txt) |
| b529 | `pstack/docs/guide/06-verify-and-ship.md` | [原件](b529/original.txt) | [中文全文](b529/zh-CN.txt) |
| b530 | `pstack/docs/guide/07-overnight.md` | [原件](b530/original.txt) | [中文全文](b530/zh-CN.txt) |
| b531 | `pstack/docs/guide/08-principles.md` | [原件](b531/original.txt) | [中文全文](b531/zh-CN.txt) |
| b532 | `pstack/docs/guide/09-make-it-yours.md` | [原件](b532/original.txt) | [中文全文](b532/zh-CN.txt) |
| b533 | `pstack/docs/guide/10-recipes-and-pitfalls.md` | [原件](b533/original.txt) | [中文全文](b533/zh-CN.txt) |
| b534 | `pstack/docs/guide/README.md` | [原件](b534/original.txt) | [中文全文](b534/zh-CN.txt) |
| b541 | `pstack/docs/harness/claude-code.md` | [原件](b541/original.txt) | [中文全文](b541/zh-CN.txt) |
| b543 | `pstack/skills/automate-me/SKILL.md` | [原件](b543/original.txt) | [中文全文](b543/zh-CN.txt) |
| b544 | `pstack/skills/bro/SKILL.md` | [原件](b544/original.txt) | [中文全文](b544/zh-CN.txt) |
| b545 | `pstack/skills/in-your-own-words/SKILL.md` | [原件](b545/original.txt) | [中文全文](b545/zh-CN.txt) |
| b546 | `pstack/skills/ketchup/SKILL.md` | [原件](b546/original.txt) | [中文全文](b546/zh-CN.txt) |
| b547 | `pstack/skills/ketchup-video/SKILL.md` | [原件](b547/original.txt) | [中文全文](b547/zh-CN.txt) |
| b548 | `pstack/skills/make-bot-ui/SKILL.md` | [原件](b548/original.txt) | [中文全文](b548/zh-CN.txt) |
| b549 | `pstack/skills/poteto-help/SKILL.md` | [原件](b549/original.txt) | [中文全文](b549/zh-CN.txt) |
| b550 | `pstack/skills/poteto-help/references/prompting.md` | [原件](b550/original.txt) | [中文全文](b550/zh-CN.txt) |
| b551 | `pstack/skills/poteto-help/references/recipes.md` | [原件](b551/original.txt) | [中文全文](b551/zh-CN.txt) |
| b570 | `pstack/skills/setup-pstack/SKILL.md` | [原件](b570/original.txt) | [中文全文](b570/zh-CN.txt) |
| b571 | `pstack/skills/tdd/SKILL.md` | [原件](b571/original.txt) | [中文全文](b571/zh-CN.txt) |
| b572 | `pstack/skills/teach/SKILL.md` | [原件](b572/original.txt) | [中文全文](b572/zh-CN.txt) |
| b573 | `pstack/skills/technical-writing/SKILL.md` | [原件](b573/original.txt) | [中文全文](b573/zh-CN.txt) |

### B 组 · 代码与配置

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| b097 | `pstack/skills/show-me-your-work/references/decision-log-template.tsv` | [原件](b097/original.txt) | [代码对照](b097/localized.txt) |
| b098 | `pstack/skills/show-me-your-work/scripts/log.sh` | [原件](b098/original.txt) | [代码对照](b098/localized.txt) |
| b101 | `pstack/skills/statechart/scripts/backends/cfg.ts` | [原件](b101/original.txt) | [代码对照](b101/localized.txt) |
| b102 | `pstack/skills/statechart/scripts/backends/mermaid.ts` | [原件](b102/original.txt) | [代码对照](b102/localized.txt) |
| b103 | `pstack/skills/statechart/scripts/backends/plain-text.ts` | [原件](b103/original.txt) | [代码对照](b103/localized.txt) |
| b104 | `pstack/skills/statechart/scripts/backends/report.ts` | [原件](b104/original.txt) | [代码对照](b104/localized.txt) |
| b105 | `pstack/skills/statechart/scripts/frontends/config.ts` | [原件](b105/original.txt) | [代码对照](b105/localized.txt) |
| b106 | `pstack/skills/statechart/scripts/frontends/dot.ts` | [原件](b106/original.txt) | [代码对照](b106/localized.txt) |
| b107 | `pstack/skills/statechart/scripts/frontends/marks.ts` | [原件](b107/original.txt) | [代码对照](b107/localized.txt) |
| b108 | `pstack/skills/statechart/scripts/frontends/messages.ts` | [原件](b108/original.txt) | [代码对照](b108/localized.txt) |
| b109 | `pstack/skills/statechart/scripts/frontends/spec.ts` | [原件](b109/original.txt) | [代码对照](b109/localized.txt) |
| b110 | `pstack/skills/statechart/scripts/frontends/trace.ts` | [原件](b110/original.txt) | [代码对照](b110/localized.txt) |
| b111 | `pstack/skills/statechart/scripts/frontends/value.ts` | [原件](b111/original.txt) | [代码对照](b111/localized.txt) |
| b112 | `pstack/skills/statechart/scripts/frontends/verdict.ts` | [原件](b112/original.txt) | [代码对照](b112/localized.txt) |
| b113 | `pstack/skills/statechart/scripts/frontends/view.ts` | [原件](b113/original.txt) | [代码对照](b113/localized.txt) |
| b114 | `pstack/skills/statechart/scripts/ir.ts` | [原件](b114/original.txt) | [代码对照](b114/localized.txt) |
| b115 | `pstack/skills/statechart/scripts/package.json` | [原件](b115/original.txt) | [代码对照](b115/localized.txt) |
| b116 | `pstack/skills/statechart/scripts/passes/annotate.ts` | [原件](b116/original.txt) | [代码对照](b116/localized.txt) |
| b117 | `pstack/skills/statechart/scripts/passes/label.ts` | [原件](b117/original.txt) | [代码对照](b117/localized.txt) |
| b118 | `pstack/skills/statechart/scripts/passes/lift.ts` | [原件](b118/original.txt) | [代码对照](b118/localized.txt) |
| b119 | `pstack/skills/statechart/scripts/passes/loop-check.ts` | [原件](b119/original.txt) | [代码对照](b119/localized.txt) |
| b120 | `pstack/skills/statechart/scripts/passes/paths.ts` | [原件](b120/original.txt) | [代码对照](b120/localized.txt) |
| b121 | `pstack/skills/statechart/scripts/passes/reach.ts` | [原件](b121/original.txt) | [代码对照](b121/localized.txt) |
| b122 | `pstack/skills/statechart/scripts/passes/region-check.ts` | [原件](b122/original.txt) | [代码对照](b122/localized.txt) |
| b123 | `pstack/skills/statechart/scripts/passes/regions.ts` | [原件](b123/original.txt) | [代码对照](b123/localized.txt) |
| b124 | `pstack/skills/statechart/scripts/pipeline.ts` | [原件](b124/original.txt) | [代码对照](b124/localized.txt) |
| b125 | `pstack/skills/statechart/scripts/run.ts` | [原件](b125/original.txt) | [代码对照](b125/localized.txt) |
| b126 | `pstack/skills/statechart/scripts/statechart` | [原件](b126/original.txt) | [代码对照](b126/localized.txt) |
| b127 | `pstack/skills/statechart/scripts/statechart.ts` | [原件](b127/original.txt) | [代码对照](b127/localized.txt) |
| b128 | `pstack/skills/statechart/scripts/test/ConfigOracle.java` | [原件](b128/original.txt) | [代码对照](b128/localized.txt) |
| b129 | `pstack/skills/statechart/scripts/test/chart.test.ts` | [原件](b129/original.txt) | [代码对照](b129/localized.txt) |
| b133 | `pstack/skills/statechart/scripts/test/cli.test.ts` | [原件](b133/original.txt) | [代码对照](b133/localized.txt) |
| b134 | `pstack/skills/statechart/scripts/test/config-fuzz.test.ts` | [原件](b134/original.txt) | [代码对照](b134/localized.txt) |
| b491 | `pstack/skills/statechart/scripts/test/corpus.test.ts` | [原件](b491/original.txt) | [代码对照](b491/localized.txt) |
| b492 | `pstack/skills/statechart/scripts/test/differential.test.ts` | [原件](b492/original.txt) | [代码对照](b492/localized.txt) |
| b496 | `pstack/skills/statechart/scripts/test/java.ts` | [原件](b496/original.txt) | [代码对照](b496/localized.txt) |
| b497 | `pstack/skills/statechart/scripts/test/labels.ts` | [原件](b497/original.txt) | [代码对照](b497/localized.txt) |
| b498 | `pstack/skills/statechart/scripts/test/messages.test.ts` | [原件](b498/original.txt) | [代码对照](b498/localized.txt) |
| b499 | `pstack/skills/statechart/scripts/test/pipeline.test.ts` | [原件](b499/original.txt) | [代码对照](b499/localized.txt) |
| b500 | `pstack/skills/statechart/scripts/test/plain-tlc.test.ts` | [原件](b500/original.txt) | [代码对照](b500/localized.txt) |
| b501 | `pstack/skills/statechart/scripts/test/render.test.ts` | [原件](b501/original.txt) | [代码对照](b501/localized.txt) |
| b502 | `pstack/skills/statechart/scripts/test/tlc-out.test.ts` | [原件](b502/original.txt) | [代码对照](b502/localized.txt) |
| b503 | `pstack/skills/statechart/scripts/test/tlc.ts` | [原件](b503/original.txt) | [代码对照](b503/localized.txt) |
| b504 | `pstack/skills/statechart/scripts/tsconfig.json` | [原件](b504/original.txt) | [代码对照](b504/localized.txt) |
| b505 | `pstack/skills/statechart/scripts/worker.ts` | [原件](b505/original.txt) | [代码对照](b505/localized.txt) |
| b506 | `pstack/.cursor-plugin/plugin.json` | [原件](b506/original.txt) | [代码对照](b506/localized.txt) |
| b507 | `pstack/.gitignore` | [原件](b507/original.txt) | [代码对照](b507/localized.txt) |
| b521 | `pstack/automations/benny/templates/configuration.example.yaml` | [原件](b521/original.txt) | [代码对照](b521/localized.txt) |
| b542 | `pstack/plugin.json` | [原件](b542/original.txt) | [代码对照](b542/localized.txt) |
| b552 | `pstack/skills/poteto-mode/scripts/bootstrap.ts` | [原件](b552/original.txt) | [代码对照](b552/localized.txt) |
| b553 | `pstack/skills/poteto-mode/scripts/bun.lock` | [原件](b553/original.txt) | [代码对照](b553/localized.txt) |
| b554 | `pstack/skills/poteto-mode/scripts/check-plan.mjs` | [原件](b554/original.txt) | [代码对照](b554/localized.txt) |
| b555 | `pstack/skills/poteto-mode/scripts/check-plan.test.ts` | [原件](b555/original.txt) | [代码对照](b555/localized.txt) |
| b556 | `pstack/skills/poteto-mode/scripts/package.json` | [原件](b556/original.txt) | [代码对照](b556/localized.txt) |
| b557 | `pstack/skills/poteto-mode/scripts/watch-pr/cli.test.ts` | [原件](b557/original.txt) | [代码对照](b557/localized.txt) |
| b558 | `pstack/skills/poteto-mode/scripts/watch-pr/cli.ts` | [原件](b558/original.txt) | [代码对照](b558/localized.txt) |
| b559 | `pstack/skills/poteto-mode/scripts/watch-pr/fakes.test-helper.ts` | [原件](b559/original.txt) | [代码对照](b559/localized.txt) |
| b560 | `pstack/skills/poteto-mode/scripts/watch-pr/github.test.ts` | [原件](b560/original.txt) | [代码对照](b560/localized.txt) |
| b561 | `pstack/skills/poteto-mode/scripts/watch-pr/github.ts` | [原件](b561/original.txt) | [代码对照](b561/localized.txt) |
| b562 | `pstack/skills/poteto-mode/scripts/watch-pr/policy.test.ts` | [原件](b562/original.txt) | [代码对照](b562/localized.txt) |
| b563 | `pstack/skills/poteto-mode/scripts/watch-pr/policy.ts` | [原件](b563/original.txt) | [代码对照](b563/localized.txt) |
| b564 | `pstack/skills/poteto-mode/scripts/watch-pr/render.ts` | [原件](b564/original.txt) | [代码对照](b564/localized.txt) |
| b565 | `pstack/skills/poteto-mode/scripts/watch-pr/tsconfig.json` | [原件](b565/original.txt) | [代码对照](b565/localized.txt) |
| b566 | `pstack/skills/poteto-mode/scripts/watch-pr/types.compile.ts` | [原件](b566/original.txt) | [代码对照](b566/localized.txt) |
| b567 | `pstack/skills/poteto-mode/scripts/watch-pr/types.ts` | [原件](b567/original.txt) | [代码对照](b567/localized.txt) |
| b568 | `pstack/skills/poteto-mode/scripts/watch-pr/watch-pr` | [原件](b568/original.txt) | [代码对照](b568/localized.txt) |
| b569 | `pstack/skills/poteto-mode/scripts/worktree-audit.sh` | [原件](b569/original.txt) | [代码对照](b569/localized.txt) |

### B 组 · 机器夹具

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| b130 | `pstack/skills/statechart/scripts/test/charts/Braces.mmd` | [原件](b130/original.txt) | [原样夹具](b130/localized.txt) |
| b131 | `pstack/skills/statechart/scripts/test/charts/Escapes.mmd` | [原件](b131/original.txt) | [原样夹具](b131/localized.txt) |
| b132 | `pstack/skills/statechart/scripts/test/charts/Phases.mmd` | [原件](b132/original.txt) | [原样夹具](b132/localized.txt) |
| b135 | `pstack/skills/statechart/scripts/test/corpus/Counter/ChartRun.out` | [原件](b135/original.txt) | [原样夹具](b135/localized.txt) |
| b136 | `pstack/skills/statechart/scripts/test/corpus/Counter/Counter.cfg` | [原件](b136/original.txt) | [原样夹具](b136/localized.txt) |
| b137 | `pstack/skills/statechart/scripts/test/corpus/Counter/Counter.tla` | [原件](b137/original.txt) | [原样夹具](b137/localized.txt) |
| b138 | `pstack/skills/statechart/scripts/test/corpus/Counter/chart.mmd` | [原件](b138/original.txt) | [原样夹具](b138/localized.txt) |
| b139 | `pstack/skills/statechart/scripts/test/corpus/Counter/graph.dot` | [原件](b139/original.txt) | [原样夹具](b139/localized.txt) |
| b140 | `pstack/skills/statechart/scripts/test/corpus/Counter/report.md` | [原件](b140/original.txt) | [原样夹具](b140/localized.txt) |
| b141 | `pstack/skills/statechart/scripts/test/corpus/Counter/sany.out` | [原件](b141/original.txt) | [原样夹具](b141/localized.txt) |
| b142 | `pstack/skills/statechart/scripts/test/corpus/Counter/verdict-1.out` | [原件](b142/original.txt) | [原样夹具](b142/localized.txt) |
| b143 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/ChartRun.out` | [原件](b143/original.txt) | [原样夹具](b143/localized.txt) |
| b144 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/CounterAction.cfg` | [原件](b144/original.txt) | [原样夹具](b144/localized.txt) |
| b145 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/CounterAction.tla` | [原件](b145/original.txt) | [原样夹具](b145/localized.txt) |
| b146 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/chart.mmd` | [原件](b146/original.txt) | [原样夹具](b146/localized.txt) |
| b147 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/graph.dot` | [原件](b147/original.txt) | [原样夹具](b147/localized.txt) |
| b148 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/report.md` | [原件](b148/original.txt) | [原样夹具](b148/localized.txt) |
| b149 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/sany.out` | [原件](b149/original.txt) | [原样夹具](b149/localized.txt) |
| b150 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-1.exit` | [原件](b150/original.txt) | [原样夹具](b150/localized.txt) |
| b151 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-1.out` | [原件](b151/original.txt) | [原样夹具](b151/localized.txt) |
| b152 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-2.exit` | [原件](b152/original.txt) | [原样夹具](b152/localized.txt) |
| b153 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-2.out` | [原件](b153/original.txt) | [原样夹具](b153/localized.txt) |
| b154 | `pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-3.out` | [原件](b154/original.txt) | [原样夹具](b154/localized.txt) |
| b155 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/ChartRun.out` | [原件](b155/original.txt) | [原样夹具](b155/localized.txt) |
| b156 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/CounterDeadlock.cfg` | [原件](b156/original.txt) | [原样夹具](b156/localized.txt) |
| b157 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/CounterDeadlock.tla` | [原件](b157/original.txt) | [原样夹具](b157/localized.txt) |
| b158 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/chart.mmd` | [原件](b158/original.txt) | [原样夹具](b158/localized.txt) |
| b159 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/graph.dot` | [原件](b159/original.txt) | [原样夹具](b159/localized.txt) |
| b160 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/report.md` | [原件](b160/original.txt) | [原样夹具](b160/localized.txt) |
| b161 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/sany.out` | [原件](b161/original.txt) | [原样夹具](b161/localized.txt) |
| b162 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-1.exit` | [原件](b162/original.txt) | [原样夹具](b162/localized.txt) |
| b163 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-1.out` | [原件](b163/original.txt) | [原样夹具](b163/localized.txt) |
| b164 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-2.exit` | [原件](b164/original.txt) | [原样夹具](b164/localized.txt) |
| b165 | `pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-2.out` | [原件](b165/original.txt) | [原样夹具](b165/localized.txt) |
| b166 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/ChartRun.out` | [原件](b166/original.txt) | [原样夹具](b166/localized.txt) |
| b167 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/CounterFan.cfg` | [原件](b167/original.txt) | [原样夹具](b167/localized.txt) |
| b168 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/CounterFan.tla` | [原件](b168/original.txt) | [原样夹具](b168/localized.txt) |
| b169 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/chart.mmd` | [原件](b169/original.txt) | [原样夹具](b169/localized.txt) |
| b170 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/graph.dot` | [原件](b170/original.txt) | [原样夹具](b170/localized.txt) |
| b171 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/report.md` | [原件](b171/original.txt) | [原样夹具](b171/localized.txt) |
| b172 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/sany.out` | [原件](b172/original.txt) | [原样夹具](b172/localized.txt) |
| b173 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/verdict-1.exit` | [原件](b173/original.txt) | [原样夹具](b173/localized.txt) |
| b174 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/verdict-1.out` | [原件](b174/original.txt) | [原样夹具](b174/localized.txt) |
| b175 | `pstack/skills/statechart/scripts/test/corpus/CounterFan/verdict-2.out` | [原件](b175/original.txt) | [原样夹具](b175/localized.txt) |
| b176 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/ChartRun.exit` | [原件](b176/original.txt) | [原样夹具](b176/localized.txt) |
| b177 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/ChartRun.out` | [原件](b177/original.txt) | [原样夹具](b177/localized.txt) |
| b178 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/CounterGuard.cfg` | [原件](b178/original.txt) | [原样夹具](b178/localized.txt) |
| b179 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/CounterGuard.tla` | [原件](b179/original.txt) | [原样夹具](b179/localized.txt) |
| b180 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/chart.mmd` | [原件](b180/original.txt) | [原样夹具](b180/localized.txt) |
| b181 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/graph.dot` | [原件](b181/original.txt) | [原样夹具](b181/localized.txt) |
| b182 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/report.md` | [原件](b182/original.txt) | [原样夹具](b182/localized.txt) |
| b183 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/sany.out` | [原件](b183/original.txt) | [原样夹具](b183/localized.txt) |
| b184 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-1.exit` | [原件](b184/original.txt) | [原样夹具](b184/localized.txt) |
| b185 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-1.out` | [原件](b185/original.txt) | [原样夹具](b185/localized.txt) |
| b186 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-2.exit` | [原件](b186/original.txt) | [原样夹具](b186/localized.txt) |
| b187 | `pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-2.out` | [原件](b187/original.txt) | [原样夹具](b187/localized.txt) |
| b188 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/ChartRun.out` | [原件](b188/original.txt) | [原样夹具](b188/localized.txt) |
| b189 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/CounterInitPast.cfg` | [原件](b189/original.txt) | [原样夹具](b189/localized.txt) |
| b190 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/CounterInitPast.tla` | [原件](b190/original.txt) | [原样夹具](b190/localized.txt) |
| b191 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/chart.mmd` | [原件](b191/original.txt) | [原样夹具](b191/localized.txt) |
| b192 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/graph.dot` | [原件](b192/original.txt) | [原样夹具](b192/localized.txt) |
| b193 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/report.md` | [原件](b193/original.txt) | [原样夹具](b193/localized.txt) |
| b194 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/sany.out` | [原件](b194/original.txt) | [原样夹具](b194/localized.txt) |
| b195 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/verdict-1.exit` | [原件](b195/original.txt) | [原样夹具](b195/localized.txt) |
| b196 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/verdict-1.out` | [原件](b196/original.txt) | [原样夹具](b196/localized.txt) |
| b197 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPast/verdict-2.out` | [原件](b197/original.txt) | [原样夹具](b197/localized.txt) |
| b198 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/ChartRun.out` | [原件](b198/original.txt) | [原样夹具](b198/localized.txt) |
| b199 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/CounterInitPastHolds.cfg` | [原件](b199/original.txt) | [原样夹具](b199/localized.txt) |
| b200 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/CounterInitPastHolds.tla` | [原件](b200/original.txt) | [原样夹具](b200/localized.txt) |
| b201 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/chart.mmd` | [原件](b201/original.txt) | [原样夹具](b201/localized.txt) |
| b202 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/graph.dot` | [原件](b202/original.txt) | [原样夹具](b202/localized.txt) |
| b203 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/report.md` | [原件](b203/original.txt) | [原样夹具](b203/localized.txt) |
| b204 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/sany.out` | [原件](b204/original.txt) | [原样夹具](b204/localized.txt) |
| b205 | `pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/verdict-1.out` | [原件](b205/original.txt) | [原样夹具](b205/localized.txt) |
| b206 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/ChartRun.out` | [原件](b206/original.txt) | [原样夹具](b206/localized.txt) |
| b207 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/CounterInstance.cfg` | [原件](b207/original.txt) | [原样夹具](b207/localized.txt) |
| b208 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/CounterInstance.tla` | [原件](b208/original.txt) | [原样夹具](b208/localized.txt) |
| b209 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/CounterSteps.tla` | [原件](b209/original.txt) | [原样夹具](b209/localized.txt) |
| b210 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/chart.mmd` | [原件](b210/original.txt) | [原样夹具](b210/localized.txt) |
| b211 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/graph.dot` | [原件](b211/original.txt) | [原样夹具](b211/localized.txt) |
| b212 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/report.md` | [原件](b212/original.txt) | [原样夹具](b212/localized.txt) |
| b213 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/sany.out` | [原件](b213/original.txt) | [原样夹具](b213/localized.txt) |
| b214 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/verdict-1.exit` | [原件](b214/original.txt) | [原样夹具](b214/localized.txt) |
| b215 | `pstack/skills/statechart/scripts/test/corpus/CounterInstance/verdict-1.out` | [原件](b215/original.txt) | [原样夹具](b215/localized.txt) |
| b216 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/ChartRun.out` | [原件](b216/original.txt) | [原样夹具](b216/localized.txt) |
| b217 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/CounterJump.cfg` | [原件](b217/original.txt) | [原样夹具](b217/localized.txt) |
| b218 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/CounterJump.tla` | [原件](b218/original.txt) | [原样夹具](b218/localized.txt) |
| b219 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/chart.mmd` | [原件](b219/original.txt) | [原样夹具](b219/localized.txt) |
| b220 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/graph.dot` | [原件](b220/original.txt) | [原样夹具](b220/localized.txt) |
| b221 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/report.md` | [原件](b221/original.txt) | [原样夹具](b221/localized.txt) |
| b222 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/sany.out` | [原件](b222/original.txt) | [原样夹具](b222/localized.txt) |
| b223 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/verdict-1.exit` | [原件](b223/original.txt) | [原样夹具](b223/localized.txt) |
| b224 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/verdict-1.out` | [原件](b224/original.txt) | [原样夹具](b224/localized.txt) |
| b225 | `pstack/skills/statechart/scripts/test/corpus/CounterJump/verdict-2.out` | [原件](b225/original.txt) | [原样夹具](b225/localized.txt) |
| b226 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/ChartRun.out` | [原件](b226/original.txt) | [原样夹具](b226/localized.txt) |
| b227 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/CounterLoop.cfg` | [原件](b227/original.txt) | [原样夹具](b227/localized.txt) |
| b228 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/CounterLoop.tla` | [原件](b228/original.txt) | [原样夹具](b228/localized.txt) |
| b229 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/chart.mmd` | [原件](b229/original.txt) | [原样夹具](b229/localized.txt) |
| b230 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/graph.dot` | [原件](b230/original.txt) | [原样夹具](b230/localized.txt) |
| b231 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/report.md` | [原件](b231/original.txt) | [原样夹具](b231/localized.txt) |
| b232 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/sany.out` | [原件](b232/original.txt) | [原样夹具](b232/localized.txt) |
| b233 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/verdict-1.exit` | [原件](b233/original.txt) | [原样夹具](b233/localized.txt) |
| b234 | `pstack/skills/statechart/scripts/test/corpus/CounterLoop/verdict-1.out` | [原件](b234/original.txt) | [原样夹具](b234/localized.txt) |
| b235 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/ChartRun.out` | [原件](b235/original.txt) | [原样夹具](b235/localized.txt) |
| b236 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/CounterOrder.cfg` | [原件](b236/original.txt) | [原样夹具](b236/localized.txt) |
| b237 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/CounterOrder.tla` | [原件](b237/original.txt) | [原样夹具](b237/localized.txt) |
| b238 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/chart.mmd` | [原件](b238/original.txt) | [原样夹具](b238/localized.txt) |
| b239 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/graph.dot` | [原件](b239/original.txt) | [原样夹具](b239/localized.txt) |
| b240 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/report.md` | [原件](b240/original.txt) | [原样夹具](b240/localized.txt) |
| b241 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/sany.out` | [原件](b241/original.txt) | [原样夹具](b241/localized.txt) |
| b242 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-1.exit` | [原件](b242/original.txt) | [原样夹具](b242/localized.txt) |
| b243 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-1.out` | [原件](b243/original.txt) | [原样夹具](b243/localized.txt) |
| b244 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-2.exit` | [原件](b244/original.txt) | [原样夹具](b244/localized.txt) |
| b245 | `pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-2.out` | [原件](b245/original.txt) | [原样夹具](b245/localized.txt) |
| b246 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/ChartRun.out` | [原件](b246/original.txt) | [原样夹具](b246/localized.txt) |
| b247 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/CounterRules.cfg` | [原件](b247/original.txt) | [原样夹具](b247/localized.txt) |
| b248 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/CounterRules.tla` | [原件](b248/original.txt) | [原样夹具](b248/localized.txt) |
| b249 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/Moves.tla` | [原件](b249/original.txt) | [原样夹具](b249/localized.txt) |
| b250 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/chart.mmd` | [原件](b250/original.txt) | [原样夹具](b250/localized.txt) |
| b251 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/graph.dot` | [原件](b251/original.txt) | [原样夹具](b251/localized.txt) |
| b252 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/report.md` | [原件](b252/original.txt) | [原样夹具](b252/localized.txt) |
| b253 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/sany.out` | [原件](b253/original.txt) | [原样夹具](b253/localized.txt) |
| b254 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-1.exit` | [原件](b254/original.txt) | [原样夹具](b254/localized.txt) |
| b255 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-1.out` | [原件](b255/original.txt) | [原样夹具](b255/localized.txt) |
| b256 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-2.exit` | [原件](b256/original.txt) | [原样夹具](b256/localized.txt) |
| b257 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-2.out` | [原件](b257/original.txt) | [原样夹具](b257/localized.txt) |
| b258 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-3.exit` | [原件](b258/original.txt) | [原样夹具](b258/localized.txt) |
| b259 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-3.out` | [原件](b259/original.txt) | [原样夹具](b259/localized.txt) |
| b260 | `pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-4.out` | [原件](b260/original.txt) | [原样夹具](b260/localized.txt) |
| b261 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/ChartRun.out` | [原件](b261/original.txt) | [原样夹具](b261/localized.txt) |
| b262 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/CounterStart.cfg` | [原件](b262/original.txt) | [原样夹具](b262/localized.txt) |
| b263 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/CounterStart.tla` | [原件](b263/original.txt) | [原样夹具](b263/localized.txt) |
| b264 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/chart.mmd` | [原件](b264/original.txt) | [原样夹具](b264/localized.txt) |
| b265 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/graph.dot` | [原件](b265/original.txt) | [原样夹具](b265/localized.txt) |
| b266 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/report.md` | [原件](b266/original.txt) | [原样夹具](b266/localized.txt) |
| b267 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/sany.out` | [原件](b267/original.txt) | [原样夹具](b267/localized.txt) |
| b268 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/verdict-1.exit` | [原件](b268/original.txt) | [原样夹具](b268/localized.txt) |
| b269 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/verdict-1.out` | [原件](b269/original.txt) | [原样夹具](b269/localized.txt) |
| b270 | `pstack/skills/statechart/scripts/test/corpus/CounterStart/verdict-2.out` | [原件](b270/original.txt) | [原样夹具](b270/localized.txt) |
| b271 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/ChartRun.out` | [原件](b271/original.txt) | [原样夹具](b271/localized.txt) |
| b272 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/CounterStop.cfg` | [原件](b272/original.txt) | [原样夹具](b272/localized.txt) |
| b273 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/CounterStop.tla` | [原件](b273/original.txt) | [原样夹具](b273/localized.txt) |
| b274 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/chart.mmd` | [原件](b274/original.txt) | [原样夹具](b274/localized.txt) |
| b275 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/graph.dot` | [原件](b275/original.txt) | [原样夹具](b275/localized.txt) |
| b276 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/report.md` | [原件](b276/original.txt) | [原样夹具](b276/localized.txt) |
| b277 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/sany.out` | [原件](b277/original.txt) | [原样夹具](b277/localized.txt) |
| b278 | `pstack/skills/statechart/scripts/test/corpus/CounterStop/verdict-1.out` | [原件](b278/original.txt) | [原样夹具](b278/localized.txt) |
| b279 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/ChartRun.out` | [原件](b279/original.txt) | [原样夹具](b279/localized.txt) |
| b280 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/CounterTie.cfg` | [原件](b280/original.txt) | [原样夹具](b280/localized.txt) |
| b281 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/CounterTie.tla` | [原件](b281/original.txt) | [原样夹具](b281/localized.txt) |
| b282 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/chart.mmd` | [原件](b282/original.txt) | [原样夹具](b282/localized.txt) |
| b283 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/graph.dot` | [原件](b283/original.txt) | [原样夹具](b283/localized.txt) |
| b284 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/report.md` | [原件](b284/original.txt) | [原样夹具](b284/localized.txt) |
| b285 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/sany.out` | [原件](b285/original.txt) | [原样夹具](b285/localized.txt) |
| b286 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-1.exit` | [原件](b286/original.txt) | [原样夹具](b286/localized.txt) |
| b287 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-1.out` | [原件](b287/original.txt) | [原样夹具](b287/localized.txt) |
| b288 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-2.exit` | [原件](b288/original.txt) | [原样夹具](b288/localized.txt) |
| b289 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-2.out` | [原件](b289/original.txt) | [原样夹具](b289/localized.txt) |
| b290 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-3.exit` | [原件](b290/original.txt) | [原样夹具](b290/localized.txt) |
| b291 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-3.out` | [原件](b291/original.txt) | [原样夹具](b291/localized.txt) |
| b292 | `pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-4.out` | [原件](b292/original.txt) | [原样夹具](b292/localized.txt) |
| b293 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/ChartRun.out` | [原件](b293/original.txt) | [原样夹具](b293/localized.txt) |
| b294 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/CounterTieInGraph.cfg` | [原件](b294/original.txt) | [原样夹具](b294/localized.txt) |
| b295 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/CounterTieInGraph.tla` | [原件](b295/original.txt) | [原样夹具](b295/localized.txt) |
| b296 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/chart.mmd` | [原件](b296/original.txt) | [原样夹具](b296/localized.txt) |
| b297 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/graph.dot` | [原件](b297/original.txt) | [原样夹具](b297/localized.txt) |
| b298 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/report.md` | [原件](b298/original.txt) | [原样夹具](b298/localized.txt) |
| b299 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/sany.out` | [原件](b299/original.txt) | [原样夹具](b299/localized.txt) |
| b300 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/verdict-1.exit` | [原件](b300/original.txt) | [原样夹具](b300/localized.txt) |
| b301 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/verdict-1.out` | [原件](b301/original.txt) | [原样夹具](b301/localized.txt) |
| b302 | `pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/verdict-2.out` | [原件](b302/original.txt) | [原样夹具](b302/localized.txt) |
| b303 | `pstack/skills/statechart/scripts/test/corpus/CounterView/ChartRun.out` | [原件](b303/original.txt) | [原样夹具](b303/localized.txt) |
| b304 | `pstack/skills/statechart/scripts/test/corpus/CounterView/CounterView.cfg` | [原件](b304/original.txt) | [原样夹具](b304/localized.txt) |
| b305 | `pstack/skills/statechart/scripts/test/corpus/CounterView/CounterView.tla` | [原件](b305/original.txt) | [原样夹具](b305/localized.txt) |
| b306 | `pstack/skills/statechart/scripts/test/corpus/CounterView/chart.mmd` | [原件](b306/original.txt) | [原样夹具](b306/localized.txt) |
| b307 | `pstack/skills/statechart/scripts/test/corpus/CounterView/graph.dot` | [原件](b307/original.txt) | [原样夹具](b307/localized.txt) |
| b308 | `pstack/skills/statechart/scripts/test/corpus/CounterView/report.md` | [原件](b308/original.txt) | [原样夹具](b308/localized.txt) |
| b309 | `pstack/skills/statechart/scripts/test/corpus/CounterView/sany.out` | [原件](b309/original.txt) | [原样夹具](b309/localized.txt) |
| b310 | `pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-1.exit` | [原件](b310/original.txt) | [原样夹具](b310/localized.txt) |
| b311 | `pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-1.out` | [原件](b311/original.txt) | [原样夹具](b311/localized.txt) |
| b312 | `pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-2.exit` | [原件](b312/original.txt) | [原样夹具](b312/localized.txt) |
| b313 | `pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-2.out` | [原件](b313/original.txt) | [原样夹具](b313/localized.txt) |
| b314 | `pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-3.exit` | [原件](b314/original.txt) | [原样夹具](b314/localized.txt) |
| b315 | `pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-3.out` | [原件](b315/original.txt) | [原样夹具](b315/localized.txt) |
| b316 | `pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-4.out` | [原件](b316/original.txt) | [原样夹具](b316/localized.txt) |
| b317 | `pstack/skills/statechart/scripts/test/corpus/CounterView/view.mjs` | [原件](b317/original.txt) | [原样夹具](b317/localized.txt) |
| b318 | `pstack/skills/statechart/scripts/test/corpus/DieHard/ChartRun.out` | [原件](b318/original.txt) | [原样夹具](b318/localized.txt) |
| b319 | `pstack/skills/statechart/scripts/test/corpus/DieHard/DieHard.cfg` | [原件](b319/original.txt) | [原样夹具](b319/localized.txt) |
| b320 | `pstack/skills/statechart/scripts/test/corpus/DieHard/DieHard.tla` | [原件](b320/original.txt) | [原样夹具](b320/localized.txt) |
| b321 | `pstack/skills/statechart/scripts/test/corpus/DieHard/chart.mmd` | [原件](b321/original.txt) | [原样夹具](b321/localized.txt) |
| b322 | `pstack/skills/statechart/scripts/test/corpus/DieHard/graph.dot` | [原件](b322/original.txt) | [原样夹具](b322/localized.txt) |
| b323 | `pstack/skills/statechart/scripts/test/corpus/DieHard/report.md` | [原件](b323/original.txt) | [原样夹具](b323/localized.txt) |
| b324 | `pstack/skills/statechart/scripts/test/corpus/DieHard/sany.out` | [原件](b324/original.txt) | [原样夹具](b324/localized.txt) |
| b325 | `pstack/skills/statechart/scripts/test/corpus/DieHard/verdict-1.exit` | [原件](b325/original.txt) | [原样夹具](b325/localized.txt) |
| b326 | `pstack/skills/statechart/scripts/test/corpus/DieHard/verdict-1.out` | [原件](b326/original.txt) | [原样夹具](b326/localized.txt) |
| b327 | `pstack/skills/statechart/scripts/test/corpus/DieHard/verdict-2.out` | [原件](b327/original.txt) | [原样夹具](b327/localized.txt) |
| b328 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/ChartRun.out` | [原件](b328/original.txt) | [原样夹具](b328/localized.txt) |
| b329 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/FirstRule.cfg` | [原件](b329/original.txt) | [原样夹具](b329/localized.txt) |
| b330 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/FirstRule.tla` | [原件](b330/original.txt) | [原样夹具](b330/localized.txt) |
| b331 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/chart.mmd` | [原件](b331/original.txt) | [原样夹具](b331/localized.txt) |
| b332 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/graph.dot` | [原件](b332/original.txt) | [原样夹具](b332/localized.txt) |
| b333 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/report.md` | [原件](b333/original.txt) | [原样夹具](b333/localized.txt) |
| b334 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/sany.out` | [原件](b334/original.txt) | [原样夹具](b334/localized.txt) |
| b335 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-1.exit` | [原件](b335/original.txt) | [原样夹具](b335/localized.txt) |
| b336 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-1.out` | [原件](b336/original.txt) | [原样夹具](b336/localized.txt) |
| b337 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-2.exit` | [原件](b337/original.txt) | [原样夹具](b337/localized.txt) |
| b338 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-2.out` | [原件](b338/original.txt) | [原样夹具](b338/localized.txt) |
| b339 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-3.exit` | [原件](b339/original.txt) | [原样夹具](b339/localized.txt) |
| b340 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-3.out` | [原件](b340/original.txt) | [原样夹具](b340/localized.txt) |
| b341 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-4.exit` | [原件](b341/original.txt) | [原样夹具](b341/localized.txt) |
| b342 | `pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-4.out` | [原件](b342/original.txt) | [原样夹具](b342/localized.txt) |
| b343 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/ChartRun.out` | [原件](b343/original.txt) | [原样夹具](b343/localized.txt) |
| b344 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/HiddenClock.cfg` | [原件](b344/original.txt) | [原样夹具](b344/localized.txt) |
| b345 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/HiddenClock.tla` | [原件](b345/original.txt) | [原样夹具](b345/localized.txt) |
| b346 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/chart.mmd` | [原件](b346/original.txt) | [原样夹具](b346/localized.txt) |
| b347 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/graph.dot` | [原件](b347/original.txt) | [原样夹具](b347/localized.txt) |
| b348 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/report.md` | [原件](b348/original.txt) | [原样夹具](b348/localized.txt) |
| b349 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/sany.out` | [原件](b349/original.txt) | [原样夹具](b349/localized.txt) |
| b350 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/verdict-1.exit` | [原件](b350/original.txt) | [原样夹具](b350/localized.txt) |
| b351 | `pstack/skills/statechart/scripts/test/corpus/HiddenClock/verdict-1.out` | [原件](b351/original.txt) | [原样夹具](b351/localized.txt) |
| b352 | `pstack/skills/statechart/scripts/test/corpus/Login/ChartRun.out` | [原件](b352/original.txt) | [原样夹具](b352/localized.txt) |
| b353 | `pstack/skills/statechart/scripts/test/corpus/Login/Login.cfg` | [原件](b353/original.txt) | [原样夹具](b353/localized.txt) |
| b354 | `pstack/skills/statechart/scripts/test/corpus/Login/Login.tla` | [原件](b354/original.txt) | [原样夹具](b354/localized.txt) |
| b355 | `pstack/skills/statechart/scripts/test/corpus/Login/chart.mmd` | [原件](b355/original.txt) | [原样夹具](b355/localized.txt) |
| b356 | `pstack/skills/statechart/scripts/test/corpus/Login/graph.dot` | [原件](b356/original.txt) | [原样夹具](b356/localized.txt) |
| b357 | `pstack/skills/statechart/scripts/test/corpus/Login/report.md` | [原件](b357/original.txt) | [原样夹具](b357/localized.txt) |
| b358 | `pstack/skills/statechart/scripts/test/corpus/Login/sany.out` | [原件](b358/original.txt) | [原样夹具](b358/localized.txt) |
| b359 | `pstack/skills/statechart/scripts/test/corpus/Login/verdict-1.out` | [原件](b359/original.txt) | [原样夹具](b359/localized.txt) |
| b360 | `pstack/skills/statechart/scripts/test/corpus/Login/view.mjs` | [原件](b360/original.txt) | [原样夹具](b360/localized.txt) |
| b361 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/ChartRun.out` | [原件](b361/original.txt) | [原样夹具](b361/localized.txt) |
| b362 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/LoginGuarded.cfg` | [原件](b362/original.txt) | [原样夹具](b362/localized.txt) |
| b363 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/LoginGuarded.tla` | [原件](b363/original.txt) | [原样夹具](b363/localized.txt) |
| b364 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/chart.mmd` | [原件](b364/original.txt) | [原样夹具](b364/localized.txt) |
| b365 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/graph.dot` | [原件](b365/original.txt) | [原样夹具](b365/localized.txt) |
| b366 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/report.md` | [原件](b366/original.txt) | [原样夹具](b366/localized.txt) |
| b367 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/sany.out` | [原件](b367/original.txt) | [原样夹具](b367/localized.txt) |
| b368 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/verdict-1.out` | [原件](b368/original.txt) | [原样夹具](b368/localized.txt) |
| b369 | `pstack/skills/statechart/scripts/test/corpus/LoginGuarded/view.mjs` | [原件](b369/original.txt) | [原样夹具](b369/localized.txt) |
| b370 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/ChartRun.out` | [原件](b370/original.txt) | [原样夹具](b370/localized.txt) |
| b371 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/LoginParallel.cfg` | [原件](b371/original.txt) | [原样夹具](b371/localized.txt) |
| b372 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/LoginParallel.tla` | [原件](b372/original.txt) | [原样夹具](b372/localized.txt) |
| b373 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/chart.mmd` | [原件](b373/original.txt) | [原样夹具](b373/localized.txt) |
| b374 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/graph.dot` | [原件](b374/original.txt) | [原样夹具](b374/localized.txt) |
| b375 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/report.md` | [原件](b375/original.txt) | [原样夹具](b375/localized.txt) |
| b376 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/sany.out` | [原件](b376/original.txt) | [原样夹具](b376/localized.txt) |
| b377 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/verdict-1.exit` | [原件](b377/original.txt) | [原样夹具](b377/localized.txt) |
| b378 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/verdict-1.out` | [原件](b378/original.txt) | [原样夹具](b378/localized.txt) |
| b379 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/verdict-2.out` | [原件](b379/original.txt) | [原样夹具](b379/localized.txt) |
| b380 | `pstack/skills/statechart/scripts/test/corpus/LoginParallel/view.mjs` | [原件](b380/original.txt) | [原样夹具](b380/localized.txt) |
| b381 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/ChartRun.out` | [原件](b381/original.txt) | [原样夹具](b381/localized.txt) |
| b382 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/MediaPlayer.cfg` | [原件](b382/original.txt) | [原样夹具](b382/localized.txt) |
| b383 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/MediaPlayer.tla` | [原件](b383/original.txt) | [原样夹具](b383/localized.txt) |
| b384 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/chart.mmd` | [原件](b384/original.txt) | [原样夹具](b384/localized.txt) |
| b385 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/graph.dot` | [原件](b385/original.txt) | [原样夹具](b385/localized.txt) |
| b386 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/report.md` | [原件](b386/original.txt) | [原样夹具](b386/localized.txt) |
| b387 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/sany.out` | [原件](b387/original.txt) | [原样夹具](b387/localized.txt) |
| b388 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/verdict-1.exit` | [原件](b388/original.txt) | [原样夹具](b388/localized.txt) |
| b389 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/verdict-1.out` | [原件](b389/original.txt) | [原样夹具](b389/localized.txt) |
| b390 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/verdict-2.out` | [原件](b390/original.txt) | [原样夹具](b390/localized.txt) |
| b391 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayer/view.mjs` | [原件](b391/original.txt) | [原样夹具](b391/localized.txt) |
| b392 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/ChartRun.out` | [原件](b392/original.txt) | [原样夹具](b392/localized.txt) |
| b393 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/MediaPlayerFixed.cfg` | [原件](b393/original.txt) | [原样夹具](b393/localized.txt) |
| b394 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/MediaPlayerFixed.tla` | [原件](b394/original.txt) | [原样夹具](b394/localized.txt) |
| b395 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/chart.mmd` | [原件](b395/original.txt) | [原样夹具](b395/localized.txt) |
| b396 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/graph.dot` | [原件](b396/original.txt) | [原样夹具](b396/localized.txt) |
| b397 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/report.md` | [原件](b397/original.txt) | [原样夹具](b397/localized.txt) |
| b398 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/sany.out` | [原件](b398/original.txt) | [原样夹具](b398/localized.txt) |
| b399 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/verdict-1.out` | [原件](b399/original.txt) | [原样夹具](b399/localized.txt) |
| b400 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/view.mjs` | [原件](b400/original.txt) | [原样夹具](b400/localized.txt) |
| b401 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/ChartRun.out` | [原件](b401/original.txt) | [原样夹具](b401/localized.txt) |
| b402 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/MediaPlayer.tla` | [原件](b402/original.txt) | [原样夹具](b402/localized.txt) |
| b403 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/MediaPlayerProps.cfg` | [原件](b403/original.txt) | [原样夹具](b403/localized.txt) |
| b404 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/MediaPlayerProps.tla` | [原件](b404/original.txt) | [原样夹具](b404/localized.txt) |
| b405 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/chart.mmd` | [原件](b405/original.txt) | [原样夹具](b405/localized.txt) |
| b406 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/graph.dot` | [原件](b406/original.txt) | [原样夹具](b406/localized.txt) |
| b407 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/report.md` | [原件](b407/original.txt) | [原样夹具](b407/localized.txt) |
| b408 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/sany.out` | [原件](b408/original.txt) | [原样夹具](b408/localized.txt) |
| b409 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-1.exit` | [原件](b409/original.txt) | [原样夹具](b409/localized.txt) |
| b410 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-1.out` | [原件](b410/original.txt) | [原样夹具](b410/localized.txt) |
| b411 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-2.out` | [原件](b411/original.txt) | [原样夹具](b411/localized.txt) |
| b412 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-3.out` | [原件](b412/original.txt) | [原样夹具](b412/localized.txt) |
| b413 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-4.exit` | [原件](b413/original.txt) | [原样夹具](b413/localized.txt) |
| b414 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-4.out` | [原件](b414/original.txt) | [原样夹具](b414/localized.txt) |
| b415 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-5.exit` | [原件](b415/original.txt) | [原样夹具](b415/localized.txt) |
| b416 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-5.out` | [原件](b416/original.txt) | [原样夹具](b416/localized.txt) |
| b417 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-6.out` | [原件](b417/original.txt) | [原样夹具](b417/localized.txt) |
| b418 | `pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/view.mjs` | [原件](b418/original.txt) | [原样夹具](b418/localized.txt) |
| b419 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/ChartRun.out` | [原件](b419/original.txt) | [原样夹具](b419/localized.txt) |
| b420 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/PickWorker.cfg` | [原件](b420/original.txt) | [原样夹具](b420/localized.txt) |
| b421 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/PickWorker.tla` | [原件](b421/original.txt) | [原样夹具](b421/localized.txt) |
| b422 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/chart.mmd` | [原件](b422/original.txt) | [原样夹具](b422/localized.txt) |
| b423 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/graph.dot` | [原件](b423/original.txt) | [原样夹具](b423/localized.txt) |
| b424 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/report.md` | [原件](b424/original.txt) | [原样夹具](b424/localized.txt) |
| b425 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/sany.out` | [原件](b425/original.txt) | [原样夹具](b425/localized.txt) |
| b426 | `pstack/skills/statechart/scripts/test/corpus/PickWorker/verdict-1.out` | [原件](b426/original.txt) | [原样夹具](b426/localized.txt) |
| b427 | `pstack/skills/statechart/scripts/test/corpus/Shadow/ChartRun.out` | [原件](b427/original.txt) | [原样夹具](b427/localized.txt) |
| b428 | `pstack/skills/statechart/scripts/test/corpus/Shadow/Shadow.cfg` | [原件](b428/original.txt) | [原样夹具](b428/localized.txt) |
| b429 | `pstack/skills/statechart/scripts/test/corpus/Shadow/Shadow.tla` | [原件](b429/original.txt) | [原样夹具](b429/localized.txt) |
| b430 | `pstack/skills/statechart/scripts/test/corpus/Shadow/ShadowLib.tla` | [原件](b430/original.txt) | [原样夹具](b430/localized.txt) |
| b431 | `pstack/skills/statechart/scripts/test/corpus/Shadow/ShadowSub.tla` | [原件](b431/original.txt) | [原样夹具](b431/localized.txt) |
| b432 | `pstack/skills/statechart/scripts/test/corpus/Shadow/chart.mmd` | [原件](b432/original.txt) | [原样夹具](b432/localized.txt) |
| b433 | `pstack/skills/statechart/scripts/test/corpus/Shadow/graph.dot` | [原件](b433/original.txt) | [原样夹具](b433/localized.txt) |
| b434 | `pstack/skills/statechart/scripts/test/corpus/Shadow/report.md` | [原件](b434/original.txt) | [原样夹具](b434/localized.txt) |
| b435 | `pstack/skills/statechart/scripts/test/corpus/Shadow/sany.out` | [原件](b435/original.txt) | [原样夹具](b435/localized.txt) |
| b436 | `pstack/skills/statechart/scripts/test/corpus/Shadow/verdict-1.out` | [原件](b436/original.txt) | [原样夹具](b436/localized.txt) |
| b437 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/ChartRun.out` | [原件](b437/original.txt) | [原样夹具](b437/localized.txt) |
| b438 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/SpacedNames.cfg` | [原件](b438/original.txt) | [原样夹具](b438/localized.txt) |
| b439 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/SpacedNames.tla` | [原件](b439/original.txt) | [原样夹具](b439/localized.txt) |
| b440 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/chart.mmd` | [原件](b440/original.txt) | [原样夹具](b440/localized.txt) |
| b441 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/graph.dot` | [原件](b441/original.txt) | [原样夹具](b441/localized.txt) |
| b442 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/report.md` | [原件](b442/original.txt) | [原样夹具](b442/localized.txt) |
| b443 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/sany.out` | [原件](b443/original.txt) | [原样夹具](b443/localized.txt) |
| b444 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-1.exit` | [原件](b444/original.txt) | [原样夹具](b444/localized.txt) |
| b445 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-1.out` | [原件](b445/original.txt) | [原样夹具](b445/localized.txt) |
| b446 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-2.exit` | [原件](b446/original.txt) | [原样夹具](b446/localized.txt) |
| b447 | `pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-2.out` | [原件](b447/original.txt) | [原样夹具](b447/localized.txt) |
| b448 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/ChartRun.out` | [原件](b448/original.txt) | [原样夹具](b448/localized.txt) |
| b449 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/TwoPhase.cfg` | [原件](b449/original.txt) | [原样夹具](b449/localized.txt) |
| b450 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/TwoPhase.tla` | [原件](b450/original.txt) | [原样夹具](b450/localized.txt) |
| b451 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/chart.mmd` | [原件](b451/original.txt) | [原样夹具](b451/localized.txt) |
| b452 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/graph.dot` | [原件](b452/original.txt) | [原样夹具](b452/localized.txt) |
| b453 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/report.md` | [原件](b453/original.txt) | [原样夹具](b453/localized.txt) |
| b454 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/sany.out` | [原件](b454/original.txt) | [原样夹具](b454/localized.txt) |
| b455 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/verdict-1.exit` | [原件](b455/original.txt) | [原样夹具](b455/localized.txt) |
| b456 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/verdict-1.out` | [原件](b456/original.txt) | [原样夹具](b456/localized.txt) |
| b457 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/verdict-2.out` | [原件](b457/original.txt) | [原样夹具](b457/localized.txt) |
| b458 | `pstack/skills/statechart/scripts/test/corpus/TwoPhase/view.mjs` | [原件](b458/original.txt) | [原样夹具](b458/localized.txt) |
| b459 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/ChartRun.out` | [原件](b459/original.txt) | [原样夹具](b459/localized.txt) |
| b460 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/TwoPhaseFixed.cfg` | [原件](b460/original.txt) | [原样夹具](b460/localized.txt) |
| b461 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/TwoPhaseFixed.tla` | [原件](b461/original.txt) | [原样夹具](b461/localized.txt) |
| b462 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/chart.mmd` | [原件](b462/original.txt) | [原样夹具](b462/localized.txt) |
| b463 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/graph.dot` | [原件](b463/original.txt) | [原样夹具](b463/localized.txt) |
| b464 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/report.md` | [原件](b464/original.txt) | [原样夹具](b464/localized.txt) |
| b465 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/sany.out` | [原件](b465/original.txt) | [原样夹具](b465/localized.txt) |
| b466 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/verdict-1.out` | [原件](b466/original.txt) | [原样夹具](b466/localized.txt) |
| b467 | `pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/view.mjs` | [原件](b467/original.txt) | [原样夹具](b467/localized.txt) |
| b468 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/ChartRun.exit` | [原件](b468/original.txt) | [原样夹具](b468/localized.txt) |
| b469 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/ChartRun.out` | [原件](b469/original.txt) | [原样夹具](b469/localized.txt) |
| b470 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/TypeGuard.cfg` | [原件](b470/original.txt) | [原样夹具](b470/localized.txt) |
| b471 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/TypeGuard.tla` | [原件](b471/original.txt) | [原样夹具](b471/localized.txt) |
| b472 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/chart.mmd` | [原件](b472/original.txt) | [原样夹具](b472/localized.txt) |
| b473 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/graph.dot` | [原件](b473/original.txt) | [原样夹具](b473/localized.txt) |
| b474 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/report.md` | [原件](b474/original.txt) | [原样夹具](b474/localized.txt) |
| b475 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/sany.out` | [原件](b475/original.txt) | [原样夹具](b475/localized.txt) |
| b476 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-1.exit` | [原件](b476/original.txt) | [原样夹具](b476/localized.txt) |
| b477 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-1.out` | [原件](b477/original.txt) | [原样夹具](b477/localized.txt) |
| b478 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-2.exit` | [原件](b478/original.txt) | [原样夹具](b478/localized.txt) |
| b479 | `pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-2.out` | [原件](b479/original.txt) | [原样夹具](b479/localized.txt) |
| b480 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/ChartRun.out` | [原件](b480/original.txt) | [原样夹具](b480/localized.txt) |
| b481 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/UserNoDeadlock.cfg` | [原件](b481/original.txt) | [原样夹具](b481/localized.txt) |
| b482 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/UserNoDeadlock.tla` | [原件](b482/original.txt) | [原样夹具](b482/localized.txt) |
| b483 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/chart.mmd` | [原件](b483/original.txt) | [原样夹具](b483/localized.txt) |
| b484 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/graph.dot` | [原件](b484/original.txt) | [原样夹具](b484/localized.txt) |
| b485 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/report.md` | [原件](b485/original.txt) | [原样夹具](b485/localized.txt) |
| b486 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/sany.out` | [原件](b486/original.txt) | [原样夹具](b486/localized.txt) |
| b487 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-1.exit` | [原件](b487/original.txt) | [原样夹具](b487/localized.txt) |
| b488 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-1.out` | [原件](b488/original.txt) | [原样夹具](b488/localized.txt) |
| b489 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-2.exit` | [原件](b489/original.txt) | [原样夹具](b489/localized.txt) |
| b490 | `pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-2.out` | [原件](b490/original.txt) | [原样夹具](b490/localized.txt) |
| b493 | `pstack/skills/statechart/scripts/test/grid/Grid.cfg` | [原件](b493/original.txt) | [原样夹具](b493/localized.txt) |
| b494 | `pstack/skills/statechart/scripts/test/grid/Grid.tla` | [原件](b494/original.txt) | [原样夹具](b494/localized.txt) |
| b495 | `pstack/skills/statechart/scripts/test/grid/sany.out` | [原件](b495/original.txt) | [原样夹具](b495/localized.txt) |

### B 组 · 原始图片

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| b511 | `pstack/assets/logo.png` | [原件](b511/original.png) | [原样图片](b511/localized.png) |
| b535 | `pstack/docs/guide/images/design.jpg` | [原件](b535/original.jpg) | [原样图片](b535/localized.jpg) |
| b536 | `pstack/docs/guide/images/overnight.jpg` | [原件](b536/original.jpg) | [原样图片](b536/localized.jpg) |
| b537 | `pstack/docs/guide/images/recipes.jpg` | [原件](b537/original.jpg) | [原样图片](b537/localized.jpg) |
| b538 | `pstack/docs/guide/images/router.jpg` | [原件](b538/original.jpg) | [原样图片](b538/localized.jpg) |
| b539 | `pstack/docs/guide/images/understanding.jpg` | [原件](b539/original.jpg) | [原样图片](b539/localized.jpg) |
| b540 | `pstack/docs/guide/images/verification.jpg` | [原件](b540/original.jpg) | [原样图片](b540/localized.jpg) |

## C 组

10 份。路径列保留收录时的文件位置，所有链接均指向本仓库。


### C 组 · 文档

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| c001 | `.agents/notes/AGENTS.md` | [原件](c001/original.txt) | [中文全文](c001/zh-CN.txt) |
| c002 | `.agents/notes/README.md` | [原件](c002/original.txt) | [中文全文](c002/zh-CN.txt) |
| c003 | `.agents/notes/archived/AGENTS.md` | [原件](c003/original.txt) | [中文全文](c003/zh-CN.txt) |
| c004 | `.agents/notes/implemented/AGENTS.md` | [原件](c004/original.txt) | [中文全文](c004/zh-CN.txt) |
| c005 | `.agents/notes/implemented/architecture/2026-06-11-event-sourced-sessions.md` | [原件](c005/original.txt) | [中文全文](c005/zh-CN.txt) |
| c006 | `.agents/notes/implemented/architecture/2026-07-24-single-harness-home-resolver.md` | [原件](c006/original.txt) | [中文全文](c006/zh-CN.txt) |
| c007 | `.agents/notes/implemented/process/2026-07-26-frozen-agent-note-archive.md` | [原件](c007/original.txt) | [中文全文](c007/zh-CN.txt) |
| c008 | `.agents/skills/dsh-archive-agent-notes/SKILL.md` | [原件](c008/original.txt) | [中文全文](c008/zh-CN.txt) |
| c009 | `.agents/skills/dsh-prose-standard/SKILL.md` | [原件](c009/original.txt) | [中文全文](c009/zh-CN.txt) |
| c010 | `AGENTS.md` | [原件](c010/original.txt) | [中文全文](c010/zh-CN.txt) |

## D 组

3 份。路径列保留收录时的文件位置，所有链接均指向本仓库。


### D 组 · 文档

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| d001 | `README.md` | [原件](d001/original.txt) | [中文全文](d001/zh-CN.txt) |
| d002 | `skills/figma-designer/SKILL.md` | [原件](d002/original.txt) | [中文全文](d002/zh-CN.txt) |
| d003 | `skills/landing-page-design/SKILL.md` | [原件](d003/original.txt) | [中文全文](d003/zh-CN.txt) |

## E 组

8 份。路径列保留收录时的文件位置，所有链接均指向本仓库。


### E 组 · 文档

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| e001 | `template/.speculo/README.md` | [原件](e001/original.txt) | [中文全文](e001/zh-CN.txt) |
| e002 | `template/AGENTS.md` | [原件](e002/original.txt) | [中文全文](e002/zh-CN.txt) |
| e003 | `template/workflows/ops/common/templates/HOST-README.md` | [原件](e003/original.txt) | [中文全文](e003/zh-CN.txt) |
| e004 | `template/workflows/ops/ops-d-project-deploy/SKILL.md` | [原件](e004/original.txt) | [中文全文](e004/zh-CN.txt) |
| e005 | `template/workflows/specdev/specdev-a-archive-and-consolidate/references/consolidation-rules.md` | [原件](e005/original.txt) | [中文全文](e005/zh-CN.txt) |
| e006 | `template/workflows/specdev/specdev-a-archive-and-consolidate/references/knowledge-graduation.md` | [原件](e006/original.txt) | [中文全文](e006/zh-CN.txt) |
| e007 | `template/workflows/specdev/specdev-l-learn/SKILL.md` | [原件](e007/original.txt) | [中文全文](e007/zh-CN.txt) |
| e008 | `template/workflows/specdev/specdev-l-learn/references/lesson-format.md` | [原件](e008/original.txt) | [中文全文](e008/zh-CN.txt) |

## F 组

19 份。路径列保留收录时的文件位置，所有链接均指向本仓库。


### F 组 · 文档

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| f001 | `skills-hub/system/clash-client-profile/SKILL.md` | [原件](f001/original.txt) | [中文全文](f001/zh-CN.txt) |
| f002 | `skills-hub/system/clash-client-profile/references/clash-verge.md` | [原件](f002/original.txt) | [中文全文](f002/zh-CN.txt) |
| f003 | `skills-hub/system/clash-client-profile/references/dns-workflow.md` | [原件](f003/original.txt) | [中文全文](f003/zh-CN.txt) |
| f004 | `skills-hub/system/clash-client-profile/references/flclash.md` | [原件](f004/original.txt) | [中文全文](f004/zh-CN.txt) |
| f005 | `skills-hub/system/clash-client-profile/references/network-performance.md` | [原件](f005/original.txt) | [中文全文](f005/zh-CN.txt) |
| f006 | `skills-hub/system/clash-client-profile/references/sources.md` | [原件](f006/original.txt) | [中文全文](f006/zh-CN.txt) |
| f007 | `skills-hub/system/clash-client-profile/references/troubleshooting.md` | [原件](f007/original.txt) | [中文全文](f007/zh-CN.txt) |
| f008 | `skills-hub/system/linux-dev-disk-cleanup/SKILL.md` | [原件](f008/original.txt) | [中文全文](f008/zh-CN.txt) |
| f009 | `skills-hub/system/linux-dev-disk-cleanup/references/linux-cleanup-workflow.md` | [原件](f009/original.txt) | [中文全文](f009/zh-CN.txt) |
| f010 | `skills-hub/system/optimize-codex-config/SKILL.md` | [原件](f010/original.txt) | [中文全文](f010/zh-CN.txt) |
| f011 | `skills-hub/system/optimize-codex-config/references/optimization-method.md` | [原件](f011/original.txt) | [中文全文](f011/zh-CN.txt) |
| f012 | `skills-hub/system/proxy-region-locale/SKILL.md` | [原件](f012/original.txt) | [中文全文](f012/zh-CN.txt) |
| f013 | `skills-hub/system/proxy-region-locale/references/linux.md` | [原件](f013/original.txt) | [中文全文](f013/zh-CN.txt) |
| f014 | `skills-hub/system/proxy-region-locale/references/macos.md` | [原件](f014/original.txt) | [中文全文](f014/zh-CN.txt) |
| f015 | `skills-hub/system/proxy-region-locale/references/windows.md` | [原件](f015/original.txt) | [中文全文](f015/zh-CN.txt) |
| f016 | `skills-hub/system/system-health-audit/SKILL.md` | [原件](f016/original.txt) | [中文全文](f016/zh-CN.txt) |
| f017 | `skills-hub/system/system-health-audit/references/platforms.md` | [原件](f017/original.txt) | [中文全文](f017/zh-CN.txt) |
| f018 | `skills-hub/system/windows-dev-disk-cleanup/SKILL.md` | [原件](f018/original.txt) | [中文全文](f018/zh-CN.txt) |
| f019 | `skills-hub/system/windows-dev-disk-cleanup/references/windows-cleanup-workflow.md` | [原件](f019/original.txt) | [中文全文](f019/zh-CN.txt) |

## G 组

1 份。Herdr 上游 `skills/herdr/SKILL.md` 的完整英文原件及中文全文；固定修订与上游链接见仓库 README。中文底稿不含本地追加的启动示例；运行版复制自本地中文技能，更名为 `system-herdr`，保留追加示例并标明已修改。对应运行位置与摘要见清单 `g001`。

| 编号 | 文件位置 | 原件 | 本地对照 |
| --- | --- | --- | --- |
| g001 | `skills/herdr/SKILL.md` | [原件](g001/original.txt) | [中文全文](g001/zh-CN.txt) |
