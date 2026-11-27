# 材料同步与 dev/ops 综合 Issue

## 本轮范围

按[原始需求](source/request.md)更新全部材料来源到核验时的跟踪分支 head，完成适用中文对照，并发布一份可直接认领的综合 Issue。本轮不实现该 Issue 提出的运行技能重构。

来源基线：`NAMEWTA/skills-hub@f23ba949826c4b6cac480280ff306cdd28681f39`，版本 `0.1.35`。源码、译文、来源映射和历史许可保持独立的审阅状态。

## 当前任务

| 任务 | 交付 | 证据 |
| --- | --- | --- |
| [01 材料同步](tasks/01-materials-sync.md) | 15 来源的固定快照、适用 zh、父子清单、删除映射与许可差异 | [01 证据](evidences/01-materials-sync.md) |
| [02 综合分析](tasks/02-dev-ops-analysis.md) | dev/ops 审计、方案、职责去重、来源去留、实施与验收 | [02 证据](evidences/02-dev-ops-analysis.md) |
| [03 GitHub 交付](tasks/03-github-delivery.md) | 同步分支与 Draft PR、完整 Issue、远端回读 | [03 证据](evidences/03-github-delivery.md) |

未来运行实施以发布的 Issue 为行为与任务清单；本计划只记录此次同步、分析和发布工作，不另建第二套运行实施进度。

## 同步与验证方式

环境不允许 shell 直接读取 GitHub Git endpoint。本轮使用已连接的 GitHub API 获取固定 commit/tree/blob；大文件使用同 SHA 的官方 Actions 制品，逐文件与 Git blob 核验后才进入快照。未执行新来源脚本、hook、CI 或依赖安装。

本地基线由完整远端树恢复并校验，Git 树严格等于 `9c8e8758871b832da8aa7464ec5a76fbddd25a1e`。本地初始化提交只用于差异核对，不作为远端历史的父提交；远端材料提交必须以真实远端 main 提交为 parent。

通过常规材料检查、独立固定 API 树比较、中文结构与全文复核。现有状态图 captured-output replay 发现 Login 入口边差异，保留失败证据，作为 Issue 的 P0；同步 PR 保持 Draft，等待运行适配完成后再评估合并。没有绕过校验或改写夹具。
