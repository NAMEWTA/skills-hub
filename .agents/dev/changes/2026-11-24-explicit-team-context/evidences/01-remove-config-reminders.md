# 01 删除配置提醒验收

票据：[01-remove-config-reminders.md](../tasks/01-remove-config-reminders.md)。

状态：通过。修订、main 推送、完整跨平台 CI 与 v0.1.28 公开发布已完成。

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

## 远端提交与发布门禁

- main 上的版本提交：[4e6469f4a725e25348cf73f619ccdcb0002aee2a](https://github.com/NAMEWTA/skills-hub/commit/4e6469f4a725e25348cf73f619ccdcb0002aee2a)，包元数据与锁文件一致为 0.1.28。
- [发布工作流 45332319075](https://github.com/NAMEWTA/skills-hub/actions/runs/45332319075) 固定此提交，在 Ubuntu / Node 22.14.0、Windows / Node 24、macOS / Node 24 完成全部验证，三个平台均成功。
- Ubuntu 日志：55 个技能、738 份 Markdown、1407 条本地链接检查通过；384 项测试通过，0 失败/跳过；33 个回放通过；实际 0.1.28 tarball 含 55 个技能、1045 个分发文件，真实安装和完整资源检查通过；已安装 Archify 的实际浏览器检查通过。

## 发布与回读

- [发布工作流](https://github.com/NAMEWTA/skills-hub/actions/runs/45332319075) 及 [main 提交验证](https://github.com/NAMEWTA/skills-hub/actions/runs/45332318972) 均为 success。
- 发布器只上传一次，等待公开 registry 的包名、版本及完整 SHA-512 SRI 与实际 tarball 匹配后，正式发布 [v0.1.28](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.28)。日志以「已发布 v0.1.28」结束。
- GitHub API 回读 `draft=false`、`prerelease=false`，公开时间为 2026-11-24 13:26:13（Asia/Taipei）；标签精确指向版本提交 `4e6469f4a725e25348cf73f619ccdcb0002aee2a`。
- `namewta-skills-hub-0.1.28.tgz` 为 6380078 字节，`SHA256SUMS` 为 96 字节，均为 uploaded。压缩包服务端 SHA-256 与发布日志一致：`f8444f7069f95741f82b3d73214aff63adf47550e1e478c2bf76ad5a3ab59ba0`。
- 详见 [0.1.28 发布记录](../../../deploy/npm/releases/0.1.28.md)。后续记录提交仅更新 `.agents/dev/`，不改变已验证的分发内容。
