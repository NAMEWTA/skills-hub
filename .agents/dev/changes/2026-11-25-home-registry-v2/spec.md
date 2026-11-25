# Home 登记 v2

## 权威实施计划

本 change 按 [Issue #20 完整 Plan](source/github-NAMEWTA-skills-hub-20/issue.md) 实施；[重写前原文](source/github-NAMEWTA-skills-hub-20/issue-original.md) 保留需求由来。远端：https://github.com/NAMEWTA/skills-hub/issues/20。

## 实施分工

- H1：来源与规格固定，采用 v2 多 remote、显式相对路径、按需地图。
- H2：registry、route、doctor 和包内说明实现；真实 Git 隔离回归。
- H3：全局导航、映射和交付说明同步，独立检查、main 提交和补丁发布。

## 当前状态

2026-11-25：Plan 已写入 Issue，实施与本地专项已完成，等待远端完整 CI 和正式发布。原始来源已经保存，不将未运行的验证或发布记为完成。

## 独立审查补充

真实 Git 复现发现 `url.*.insteadOf` 可把配置地址改写到其他仓库。实现保留原始 remote，同时通过 `git remote get-url` 核验实际首 fetch 目标，跨身份改写报告冲突，已知等价协议改写允许。来源依据为 [Git remote get-url](https://git-scm.com/docs/git-remote) 与 [remote URL 配置](https://git-scm.com/docs/git-config)。此检查只核对本机 Git 实际展开结果，不冒称已验证网络重定向或 SSH 服务端映射。
