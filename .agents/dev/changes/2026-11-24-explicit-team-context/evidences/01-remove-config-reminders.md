# 01 删除配置提醒验收

票据：[01-remove-config-reminders.md](../tasks/01-remove-config-reminders.md)。

状态：本地组合验证通过，远端 CI 和发布待验证。

## 已完成

- 删除阶段执行、工作流、帮助、报告来源模板中的团队/模型配置与继承提醒，保留 `dev-setup` 的配置保存方法。
- 独立审查与主代理分别核对实际残留。帮助包删减后检查 17 份 Markdown、89 条本地链接、元数据与资源可达性，通过。
- 安装器资料导航改用开发环境、资源预算与任务上下文，不预设角色模型栏目。

## 本地组合验证

- 复用仓库原有验证器检查完整 dev 域：36 个技能、309 份 Markdown、739 条包内链接；元数据、运行正文、资源可达性与方法去重均通过。入口预算与领域持久化检查通过。
- `node --test --test-concurrency=1 tests/persistence-roots.test.mjs tests/skill-composition.test.mjs`：7 项通过，0 失败/跳过。
- 独立复核确认配置转介与默认提醒已清除，资源准入、候选数量、盲评匿名性、业务角色模型和追踪器 team 字段仍保留。
- `dev-setup` 与 `dev-worktree` 的全部本地文件逐字节等于本次基线；本次不改变资源容量或回收方法。
- 31 条 pstack 运行映射补充局部适配说明，来源快照、原件/译文哈希及 `runtime_reviewed_blob` 保持原值。
- 本地仍使用前次维护的部分源码副本；完整材料、其他领域和真实 tarball 的验证交给现有发布 CI，不把局部检查冒充全仓通过。

## 待补证据

最终版本提交 CI、npm 与 GitHub Release 回读。
