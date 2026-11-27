# 集成、安装与分发

[PR #23](https://github.com/NAMEWTA/skills-hub/pull/23) 基于 ac71b45。本地基础检查覆盖 67 个技能、1559 条本地链接及 2196 份原件。新增路径技能选择性安装后仅含 SKILL.md。旧迁移索引改指真实 owner，三条 skill-composition 用例通过。

[三平台 CI](https://github.com/NAMEWTA/skills-hub/actions/runs/45924475332) 在 f6bf320 通过完整检查、状态图回放及真实 tarball 的安装验收。Linux 另外执行 Archify 浏览器交付和 Claude 技能发现。此前 63d72c3 的 SANY 诊断用例缺少有效 INIT/NEXT，已修正夹具并保留原断言。

本地 Windows 当前用户无法建立 Claude 目录链接，早期全量测试 475 通过、28 失败、22 跳过；安装/分发链接断言由上述具备权限的托管环境通过。Home 临时文件 rename 的偶发 EPERM 已在本机单独重跑通过。

[逐文件运行映射](../reports/issue-22-runtime-review.md) 与各票分别记录当前版本采纳及历史依据。201 条 dev 来源映射中有 168 条保留旧依据或待完整复核，4 条 ops 映射均与当前来源 blob 对应。

在五个独立空项目中分别安装 dev-session-history、dev-recall、dev-reflect、dev-guardrails、ops-history，各项目 .agents/skills 均只有所选项，三宿主路径包恰含一个 SKILL.md。精简指引后的 5f764fb 再次通过[三平台 CI](https://github.com/NAMEWTA/skills-hub/actions/runs/45924747066)。最终审查提交的状态由 PR 检查记录给出。
