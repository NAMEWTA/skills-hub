---
name: skills-hub-release
description: 在 NAMEWTA/skills-hub 仓库执行补丁发布。用户要求 commit、push、release、+0.0.1、打标签，或要求排查 npm 与 GitHub Release 未公开时使用。
---

# skills-hub 发布

只用于本仓库。用户授权发布后继续执行，不重复询问；只问状态时只读检查，不提交、不打标签、不重跑。以仓库根 `docs/maintenance/release.md`、`.github/workflows/release.yml` 和 `scripts/release.mjs` 为发布契约。

## 提交、打标签与推送

1. 核对当前分支、工作区、暂存内容和远端 main。执行 `git fetch origin --tags`，查 `gh run list -w release.yml`、`gh release list`、`npm view @namewta/skills-hub version --registry=https://registry.npmjs.org/`。从当前包版本增一个补丁版本（例如 `0.1.24` → `0.1.25`）；若版本或远端状态冲突，先查清，不强推或移动标签。
2. 用 `npm version patch --no-git-tag-version --ignore-scripts` 更新包与锁文件；将用户可见变化归入 `CHANGELOG.md` 的新版本。按发布契约在最终文件上执行检查，区分通过、失败和缺少前提。
3. 提交授权范围内的文件，确认 `HEAD` 是发布提交。用 `git tag -a v<VERSION> -m 'Release <VERSION>'` 创建附注标签，再用 `git push --atomic origin HEAD:refs/heads/main refs/tags/v<VERSION>` 同步提交和标签。以上命令先把 `<VERSION>` 替换为实际版本号。用 `git ls-remote origin refs/heads/main 'refs/tags/v<VERSION>*'` 核对远端 `main` 和标签解引用后的提交一致。已有正确标签时复用；已有同名异址标签时停止。

## 跟踪与验收

- 用 `gh run list -w release.yml --commit <SHA>` 和 `gh run view <RUN_ID>` 跟踪精确提交。main 和 tag 可触发两个运行，先读已有状态；不要因排队重复触发，也不要先用 `gh release create` 绕过 npm 完整性核验。现有工作流负责公开 GitHub Release 和上传附件。
- 验证未通过就看对应任务日志。macOS 排队、`publish` 被跳过、npm 扫描或 stage 待审批是不同状态。排队不等于漏打标签；确认 npm 尚未公开时不要盲目重复上传或移动标签。需要本人审批的 stage 按发布契约交接。
- 用 `npm view @namewta/skills-hub@<VERSION> version dist.integrity --registry=https://registry.npmjs.org/` 回读精确版本与摘要，核对稳定版 `latest`；用 `gh release view v<VERSION> --json url,isDraft,isPrerelease,tagName,assets` 确认公开 Release，并按发布契约核对 tarball、`SHA256SUMS` 和 npm 完整性。只有上述结果确认后才说发布完成。
- 在 `.agents/dev/deploy/npm/releases/` 记实际提交、标签、工作流、制品摘要及外部状态。尚未完成时说明阻塞位置、已完成范围和工作流链接，不把已推送写成已发布。
