# 固定合同与来源验收

状态：完成。对应 [任务](../tasks/01-contract.md)。

2026-11-26（Asia/Taipei）回读远端 main 与 Issue #21，代码仍为 `f23ba949826c4b6cac480280ff306cdd28681f39`，包版本 `0.1.35`，Issue 为 open，评论为空。实施与发布授权来自 [后续用户指令](../source/implementation-request.md)。

完整 Issue #21 及空评论列表保存在 source/github-NAMEWTA-skills-hub-21/。#2、#20 的完整正文及可取得评论沿用同日前轮实际获取的来源快照；两者为 completed，评论均为空。原始请求保留在 source/request.md。外部方法采用依据沿用 #21 的固定源码与 2026-11-26 一手资料，不把前轮隔离测试冒充本轮制品验收。

工作副本使用同机只读 Git 对象缓存，按 GitHub 返回的递归树逐项核对所需对象，再重建并核对实际 tree `9c8e8758871b832da8aa7464ec5a76fbddd25a1e` 和精确 commit。初始 `git status --short` 为空。未复制其他工作的未提交文件，也没有覆盖原工作目录。

公共合同及分工在 [计划](../plan.md) 固定。Home 为基础区更新，其他 domain 原合同不变；AGENTS/SOUL 不加入主题 CLI 白名单；独立 CLI 证据必须与平台原生 Agent 分开。
