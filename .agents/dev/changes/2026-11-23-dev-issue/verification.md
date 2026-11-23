# dev-issue 验证记录

日期：2026-11-23。对应 [Issue #13](https://github.com/NAMEWTA/skills-hub/issues/13)。实现基于 main 的 `e81e7e570b64ce5b40da0540d95966a626075672`，包版本由 0.1.23 升至 0.1.24。

## 检查范围

本次新增一个自有运行时技能，接入现有 dev 路由、职责说明和使用文档，没有新增依赖、通用运行时脚本或材料镜像。研究与取舍见 [source-adaptations.md](source-adaptations.md)。

本地环境为 Node.js v24.22.3。环境不能直接克隆 GitHub 仓库，工作区通过 GitHub 连接器按原始提交取回完整自有技能、相关脚本、测试、文档与许可证；材料镜像和外部运行时没有全部取回。因此以下本地结果按实际范围列出，完整仓库和多平台检查以 PR 与发布工作流为准。

## 已执行的确定性检查

| 检查 | 实际结果 | 证明范围 |
| --- | --- | --- |
| `node scripts/check-skill-quality.mjs` | 51 个自有技能通过 | 入口预算、结构及静态质量规则；不证明真实远程操作可靠性 |
| `node --test tests/skill-composition.test.mjs tests/skill-quality.test.mjs` | 32 项通过，无失败或跳过 | 既有组合约束、方法归属、预算和历史迁移规则 |
| `node scripts/validate.mjs --root <自有技能隔离目录>` | 51 个技能、428 个 Markdown、985 个本地引用通过 | 隔离目录包含全部自有技能、根许可证及所需伴随许可证；验证元数据、包内可达性、重复方法、资源/脚本规则及许可材料。不是全仓材料或外部运行时检查 |
| 安装器真实 API：`list --skill dev-issue`、`install --skill dev-issue --dry-run`、安装和重复安装 | 通过 | 只选择新技能；安装后文件内容与模式摘要等于源目录；消费者忽略规则正确；重复安装保持不变 |
| 全部变更 Markdown 的本地引用核对 | 283 个目标通过 | 包括使用文档与评估记录，使用完整远端路径清单和本次新文件验证目标存在；不把未取回的文件误判为不存在 |
| 离线场景项目的 `node --test …/fixture/test/notes.test.mjs` | 2 项通过 | 仅确认场景代码的既有行为；不表示草稿中的新功能、性能或 Node.js 22 验收已实现 |
| `git diff --check` | 通过 | 变更没有空白格式错误 |

新技能直接复用目录发现、安装器和现有校验能力，没有为这个可逆的文档型变化添加复述实现的自动化测试。

## 独立使用评估

执行方式、原始材料和完整输出见 [evaluation/README.md](evaluation/README.md)。四个独立会话分别承担两份新建草稿、更新与评论、异常恢复、入口路由；它们只拿到技能及原始场景材料，没有继承实现过程或主代理的评判。

| 场景 | 主代理回读后的结论 | 可核查输出 |
| --- | --- | --- |
| 新功能 | 能从代码提取当前搜索、排序和存储约束；明确旧数据兼容、拟新增接口、错误传播、持久化、任务与验收；没有将拟新增接口伪装成现有实现 | [feature-draft.md](evaluation/outputs/feature-draft.md) |
| 性能 | 将用户的 80ms 目标与实测基线分开；没有编造收益；给出可认领的测量任务、数据/环境/负载/冷热条件、正确性对照及待确认指标口径 | [performance-draft.md](evaluation/outputs/performance-draft.md) |
| 更新 | 以最新正文和已接受决定为准，保留两个已完成项与附件；采纳已确认的 JSON 范围，没有把旁观者建议当成共识 | [update-draft.md](evaluation/outputs/update-draft.md) |
| 评论 | 提供新增分析与下一步；区分两种构造输入触发相同错误与原报告的真实复现，不声称已确认根因，不修改原正文 | [comment-draft.md](evaluation/outputs/comment-draft.md) |
| 创建超时恢复 | 搜索为空时仍检查近期列表，识别同主题同正文同来源的 #61；不重复创建，不把离线匹配说成实时写入确认，也不推定原超时请求一定创建了它 | [recovery.md](evaluation/outputs/recovery.md) |
| 入口路由 | 八个请求均按产物选择入口：完整 Issue / 更新 / 评论 / 草稿归 dev-issue，分类归 triage，本地票据归 plan，修复 PR 归 debug + deploy，材料简报归 intake | [routing.md](evaluation/outputs/routing.md) |

这些评估是合成离线场景，不是向真实用户仓库发布六次 Issue，也不是网络故障注入。真实 GitHub 已完成的验证是本任务 Issue #13 的创建及回读，正文与预期一致。

## 交付时继续核对的门槛

PR 需要在真实远端提交上执行仓库原有的完整检查，包括材料、实际 npm 包和跨平台矩阵。合并后，现有 Release 工作流以 main 的实际提交重新验证并发布 0.1.24。PR、Issue 关闭、标签、Release 附件和 npm 完整性结果应以实际远端状态为准，不能由本地检查推定成功。

本记录创建时，0.1.23 的历史发布仍在等待 macOS runner；该历史排队不是本次功能验证失败，也不构成跳过发布门槛的理由。
