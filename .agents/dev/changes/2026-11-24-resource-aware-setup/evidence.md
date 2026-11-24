# 资源感知初始化与显式团队配置整体验收

状态：通过。用户要求的技能改造、main 推送与补丁发布已完成。

## 交付

- `dev-setup` 持有环境与主机容量的唯一完整方法，核对实际执行位置和用户指定远端，统一有效配额、共享池、峰值预留、三类容量、排队与复测规则。
- 相关 dev 执行方法在实际派发、创建/初始化工作树、重任务和恢复入口消费同一预算；保留任务覆盖范围，支持分批完成与零新增容量。
- 已完成工作树继续由 `dev-worktree` 回收，补齐直接父分支、会话/进程身份、停止入口和实际释放核验，保留用户成果与未知所有权对象。
- 可选团队上下文保存为 `.agents/dev/context/team/<team_name>.md`，由用户明确引用；普通初始化和开发阶段不选择默认团队或自动加载模型规则。
- 官方文档与固定源码机制、上游采用边界记录在[研究](research.md)及根第三方声明，完整验证记录见[本票验收](evidences/01-resource-aware-setup.md)。

## 验证与版本

| 对象 | 结果与证据 |
| --- | --- |
| 独立资源与清理场景 | 通过；验证容器约束、预留增长、共享卷、不可达远端、显式团队及五种清理候选 |
| 完整 dev 域与本地回归 | 36 个技能、743 条包内链接通过；现有隔离 worktree 等测试 9/9 通过 |
| 实现提交 | [638b1fb](https://github.com/NAMEWTA/skills-hub/commit/638b1fb95f1fa737df0a52652c170e0d98ce8371)，已进入 main |
| 实现全仓 CI | [45318787716](https://github.com/NAMEWTA/skills-hub/actions/runs/45318787716)，Linux、Windows、macOS 全通过 |
| 发布提交 | [a0b65f5](https://github.com/NAMEWTA/skills-hub/commit/a0b65f525dc31d19bc59a3ccd026b5f61a72a371)，版本 0.1.26 → 0.1.27 |
| 发布验证与上传 | [45319162331](https://github.com/NAMEWTA/skills-hub/actions/runs/45319162331)，固定提交的全部验证及发布成功 |
| 公开交付 | [npm 0.1.27](https://www.npmjs.com/package/@namewta/skills-hub/v/0.1.27) 与 [GitHub Release v0.1.27](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.27)；标签、公开状态和两个附件已回读，见[发布记录](../../deploy/npm/releases/0.1.27.md) |

本次未在用户真实宿主或指定远端上做资源压测、安装或进程/工作树删除。交付的是可执行的技能方法及其组合验证，实际容量仍由使用时的观测、负载和系统限制决定；没有新增后台服务或宣称 Markdown 提供内核级硬隔离。
