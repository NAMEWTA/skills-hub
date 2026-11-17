# 验证记录

## 范围

源基线：`94a2318b3dbe6c8e6d8d30d95736cc9267d279c1`。本次为 dev 运行说明、帮助、来源归属与完整方法位置的调整，没有修改执行工具或安装器。Node.js 为 `v24.22.1`。

通过已连接的 GitHub 接口读取固定提交。每个物化文件按 Git blob SHA 核对字节与执行位；未把本地准备快照的提交当作真实远端提交。

## 已执行检查

| 检查 | 结果与证明范围 |
| --- | --- |
| `git diff --check` | 通过，修改无空白错误 |
| `node scripts/check-skill-quality.mjs --report` | 46 个自有入口通过；dev 仍为 32 个，正文与 description 均在仓库预算内 |
| `node --test tests/skill-composition.test.mjs` | 3/3 通过，验证完整方法唯一归属、重复正文与迁移资源的实际位置 |
| 需求相关 6 个包的定向结构检查 | 37 个资源、65 条包内链接通过，核对元数据、资源可达性与引用边界 |
| `npm run check` | 通过；49 个安装入口、706 份 Markdown、1304 条本地链接；持久化路径及 12 个来源项目、1803 个源文件的集合、摘要、blob、执行位与运行映射全部通过 |
| `npm run check:statechart` | 已捕获 TLC 输出回放 33/33 通过；覆盖既有解析、投影、规则与反例，不是新模型求解 |
| 来源清单差异核对 | 32 行适配/归属更新，来源身份、摘要、原件与 `runtime_reviewed_blob` 保持原值 |
| 独立静态审查 | 未发现阻断问题；指出 prototype 回调需求侧仍有两处宽泛措辞，已分别改为材料整理和产品取舍，并同步来源适配 |

工作区结构、来源、迁移与回放检查均通过。独立场景结果见 [场景记录](evidence/scenarios.md)。远端多平台 CI 以同一提交的 GitHub Actions 结果为准，不将本表中的静态检查表述为全部工具运行验收。

## 环境限制

本地 `npm ci --ignore-scripts --no-audit --no-fund --prefer-offline --fetch-retries=0 --fetch-timeout=15000` 被当前网络对 npm tarball 的 HTTP 403 阻止，依赖安装未完成。没有把安装失败记为通过，也没有修改依赖或门禁来绕过该限制。需要依赖的完整检查由仓库已有 GitHub Actions 执行，核对其提交和真实结论。

没有启动新的 Java/TLC 求解、真实业务部署或外部 Issue 管道。statechart 的属性与时序轨迹支持以现有源码、既有隔离回归和捕获输出回放核对；这些证据不等于对新业务模型完成证明。
