# Home 入口与知识维护实施

目标：完成 [Issue #21](https://github.com/NAMEWTA/skills-hub/issues/21)，按用户后续指令提交并推送 main，发布补丁版本后关闭已完成 Issue。行为契约只沿用 source 中的完整 Issue。

基线：`f23ba949826c4b6cac480280ff306cdd28681f39`，包版本 `0.1.35`，目标版本 `0.1.36`。2026-11-26（Asia/Taipei）核对 main 未前进。源码 Git tree `9c8e8758871b832da8aa7464ec5a76fbddd25a1e`；本地检出按远端所有 blob/tree SHA 核验。

## 分工与状态

| 任务 | 负责人和写入范围 | 状态 |
| --- | --- | --- |
| [01 来源](tasks/01-contract.md) | 主负责人，source/ 与合同记录 | 完成 |
| [02 入口](tasks/02-entry-knowledge.md) | 主负责人，home-knowledge 与 scripts/persistence/home.md | 完成 |
| [03 安装器](tasks/03-installer.md) | 安装器负责人，init-persistence/install/cli 及专项测试 | 完成 |
| [04 setup](tasks/04-setup.md) | Home 负责人，home-setup | 完成 |
| [05 doctor](tasks/05-doctor.md) | Home 负责人，home-doctor 与专项测试 | 完成 |
| [06 协作](tasks/06-collaboration.md) | 主负责人，其余六技能及必要参考 | 方法与原生协作验证完成 |
| [07 验证](tasks/07-validation.md) | 主负责人整合；独立负责人核查实际 CLI 条件 | 同 SHA 三平台、实际 npm 安装、原生双项目和新会话召回通过；M06 独立 CLI 初始化阻塞 |
| [08 交付](tasks/08-delivery.md) | 主负责人，docs/README/CHANGELOG/package 与发布记录 | 已推送 main，v0.1.36 公开发布及完整性回读完成；Issue 因 M06 保持 open |

## 已固定的公共合同

- Home 基础区唯一标记：`<!-- skills-hub:home-entry:start v1 -->` 到 `<!-- skills-hub:home-entry:end -->`。安装模板只含这一完整基础区；用户内容在区外。
- 仅精确旧官方模板和唯一完整已知版本可确定性迁移。未标记自定义、损坏/重复/未知标记在写入前返回冲突，整次安装零写入。
- knowledge 负责入口语义和可选 SOUL；setup 负责接入与配置，installer 写基础区，doctor 只读诊断。AGENTS/SOUL 不加入既有知识 CLI 的主题写入白名单。
- 完整初始化包含根短指针。普通安装/局部操作不改根。当前实际宿主已是有效选择；默认不增加厂商配置。
- 沿用九技能、v2 登记、Home 直接任务与原派遣/会话能力，不新增中心运行时。

## 验证与交付顺序

先完成受影响专项并审查合同；最终版本执行 check:full、check:statechart、check:package、check:upstream。实际 CLI 验证与文件发现证据分开记录。读取最新 main 后提交所需差异，正常推进分支，不覆盖并发提交；由既有 Release 工作流验证同一 SHA 并发布。回读 npm 与 Release 身份、摘要、附件；满足 Issue 完成定义后关闭。若模型运行或发布存在真实限制，明确保留未完成项，不用模拟或成功推送替代验收。

过程原件：`temp/dev/home-entry-knowledge/`。每任务更新同名 evidences 报告，整体验收完成后写唯一 evidence.md，发布结果另存 deploy/npm/releases/。
