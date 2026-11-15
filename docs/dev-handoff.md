# 开发交接与接续

`dev-handoff` 将当前开发现场写成新会话可读取的交接，或依据已有交接确认恢复点并继续。它只属于 dev 域，资料保存在 `.agents/dev/`；可以单独安装，不依赖其他领域。

## 何时使用

| 请求 | 结果 |
| --- | --- |
| 保存开发进度，稍后继续 | 一份持久的交接文件，写清目标、停点、证据和下一步 |
| 交给另一会话或代理 | 同一交接文件及可复制的接续提示，明确下一会话重点 |
| 从交接接着做 | 核对当前工作区与必要证据，继续原任务的剩余工作 |
| 明确暂停 | 停在安全边界，保存本任务状态，留下恢复后的第一步 |

仅保存记录、临近上下文压缩或用户离线不自动意味着暂停。普通进展汇报使用 `dev-status`；把新任务拆成可实施单元使用 `dev-plan`；跨阶段协调仍由 `dev-workflow` 负责。交接不重新创建已经完成的规格或计划。

## 直接使用

调用语法由宿主决定；普通语言指定技能即可。源码安装与旧包更新方法见[安装契约](installation.md#开发交接入口迁移)。

```text
使用 dev-handoff 保存当前开发现场，下一会话重点是补齐异常输入测试。
保存后继续当前已经授权的实现。
```

```text
使用 dev-handoff 把这个开发任务交给下一会话。
沿用当前 change，写清未提交修改、已执行检查、失败尝试和第一步。
```

```text
使用 dev-handoff 读取 .agents/dev/changes/2026-11-15-example/handoff.md，
按其中的下一会话重点核对当前工作区，说明恢复点后继续。
```

```text
使用 dev-handoff 暂停当前开发任务，留下明天可以直接接续的记录。
```

技能给出的路径与提示需要实际交给接收者；跨机器时，接收者还需能够访问被引用的任务和代码。生成文件本身不证明另一代理已经接收或启动。

## 交接文件保存什么

沿用已有 change 的真实目录；新任务使用 `.agents/dev/changes/<日期-主题>/handoff.md`。模板按实际情况填写，不要求小任务创建额外文档，也不猜测未知字段。

交接包括目标与完成条件、下一会话重点、规格或原始来源、工作区与版本、已完成结果、实际验证及证据、决定及理由、失败尝试、未完成与第一步、建议 dev 技能、恢复时需复核的事项。已有规格、计划、ADR、问题、提交、差异和日志引用其实际位置，避免再维护一份正文。

“建议使用的技能”位于交接文件内部，使新会话能看到；无额外需要时说明即可。单独安装 `dev-handoff` 仍可保存和恢复，不会因为可选技能缺失而停下。密钥、密码和个人身份信息脱敏，记录安全引用。

接续以原始用户目标为期望，以当前代码和实际运行结果为现状。先核对已有证据对应的版本与范围，仅对变化、矛盾或剩余风险补充验证，既不把旧摘要当作新的通过证据，也不从零重复整个任务。

## 方法来源与必要适配

运行方法以仓库已收录的完整原件和中文对照为基准。下表区分实际复制适配与文章参考，不把参考文章冒称完整镜像。

| 来源 | 本次使用 | 适配边界 |
| --- | --- | --- |
| [Matt handoff](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/productivity/handoff/SKILL.md) | 完整保留五项要求：写文档、建议技能、引用已有产物、脱敏、按下次重点裁剪 | 临时目录改为 dev 持久目录；技能调用和 frontmatter 遵循本项目约定 |
| [pstack session pickup](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/poteto-mode/playbooks/session-pickup.md) | 完整保留读取前任轨迹、重建现场、比较完成与待办、路由执行、验证主张五步及回复要求 | 从已知交接与任务材料进入；移除旧包隐式依赖和固定模型要求 |
| [pstack pause safely](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/harness/pstack/claude-code/skills/poteto-mode/playbooks/pause-safely.md) | 完整保留明确暂停、安全边界、持久保存、恢复记录四步及回复要求 | 只处理本任务拥有的工作；提交沿用已有授权；同一交接文件保存恢复笔记 |
| [Anthropic 长任务 harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)与[上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | 方法参考：进度与 Git 状态结合，保留决定、未完成项和高价值证据，详细材料按引用读取 | 补齐模板与接续核对；不复制演示应用的任务 JSON、启动器或自动循环 |
| [Anthropic 后续 harness 实践](https://www.anthropic.com/engineering/harness-design-long-running-apps) | 方法参考：结构化交接与会话内压缩有不同成本，不能固定要求重置 | 保存、暂停和启动新会话按实际任务区分 |
| [OpenAI handoffs](https://openai.github.io/openai-agents-python/handoffs/)与[context](https://openai.github.io/openai-agents-python/context/) | 方法参考：交接目标与输入上下文需要明确提供，本地状态不会自动成为模型输入 | 给出实际文件路径与读取提示；不引入 SDK 或调度协议 |

本次核对日期为 2026-11-15。Matt/pstack 三份主要原件与最新上游同 blob，因此本次不变更资料库来源修订、不引入新的材料项目。完整原文、中文对照、运行归属和核对依据沿[父清单](../materials/manifest.tsv)进入对应子清单；具体适配见[本次来源记录](../.agents/dev/changes/2026-11-15-dev-handoff/source-adaptations.md)。上游许可保存在配套 `licenses/` 中。

## 资源归属与维护

技能结构为一个短入口、UI 元数据、一份交接模板和三份完整方法。原 `dev-workflow` 的 `handoff.md`、`handoff-method.md`、`session-resume.md`、`safe-pause.md` 已迁到 `dev-handoff`；工作流及帮助按技能名调用，资源不跨包相对引用、不复制为第二份。

改动方法时同步[方法归属](dev-method-ownership.md)、[迁移表](dev-resource-moves.tsv)、材料子清单与调用入口。安装器自动发现新技能，打包白名单已覆盖 `skills/`，无需新注册表或依赖清单。项目已有交接业务记录保持真实路径，不因技能包迁移而搬动。

本次实施计划与验证分别见[计划](../.agents/dev/changes/2026-11-15-dev-handoff/plan.md)和[验证记录](../.agents/dev/changes/2026-11-15-dev-handoff/verification.md)。结构检查证明包装与映射；隔离任务观察用于检验选择和接续行为，两者都不代表已经实测所有宿主。
