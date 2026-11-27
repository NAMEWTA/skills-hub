# archify

已验证 Archify 3.3.2 独立安装包。运行来源为 `tt-a1i/archify@d6b0f71f25a3337ed2fcd09c973cacf67be7baba` 的 `archify/`，取代 `a7ed6fd` 的 3.2 版。 [固定来源](https://github.com/tt-a1i/archify/tree/d6b0f71f25a3337ed2fcd09c973cacf67be7baba/archify)

## 文件和许可

- 核对全部 601 个来源路径的运行对应、中文说明和资源内容，确认移除来源退役的 16 个旧文件。包中唯一上游可执行路径 `bin/archify.mjs` 在 Windows Git index 中为 `100755`。保留 `archify` CLI、项目产物及协议名称，入口和 explainer 规则采用 `zh-archify`；三处文档链接改为同包路径。 [逐文件映射](../../../../../materials/archify/manifest.tsv)
- 两份嵌套 `.gitignore` 在运行版增加 `!.gitignore`，使 npm tarball 保留原路径。npm 安装后，skills-hub 在暂存副本中把 npm 重命名的文件恢复为原名。材料原件及中文对照保持固定快照。
- Archify 及其内含组件的 LICENSE、NOTICE 和第三方声明保留在运行包原路径，并集中保存新增许可。官方 SARIF 2.1.0 Errata 01 发布 schema 与本地文件的 SHA-256 均为 `c3b4bb2d6093897483348925aaa73af03b3e3f4bd4ca38cef26dcb4212a2682e`。随包保留 `oasis-tcs/sarif-spec@1742a253` 的仓库许可，并另附 Errata 01 完整 Notices 原文。 [许可与来源](../../../../../THIRD_PARTY_NOTICES.md#archify) [OASIS 发布件](https://docs.oasis-open.org/sarif/sarif/v2.1.0/errata01/os/sarif-v2.1.0-errata01-os-complete.html)

## 行为证据

| 验证 | 实际结果 |
| --- | --- |
| `npm run check:upstream` | 在 Windows、Node.js 24.21.0 和真实 Chrome 中，从隔离安装目录验证 doctor、`zh-CN` 图表、validate、deliver、strict check 和 browser-check。 |
| 本地 Code Analysis | 从同一安装目录构建 `zh-CN` 工作台，导入合成 SARIF 诊断并保留原始规则 ID。两次本地提交的比较记录完整 SHA 及任务源码绑定。架构漂移报告包含新增未声明依赖和精确源码位置；Git 工作树保持干净。 |
| PR 图包 | 通过本地 `pr validate` 和 `pr build`，生成实际 `pr-pack.receipt.json`。 |
| npm 打包与升级 | 从实际 npm tarball 离线安装到隔离项目。从 `08b59c4` 的 Archify 和三个旧 dev 包升级，再加三个新 dev 入口，7 个安装树的摘要均与源码匹配。原整包备份存在，重装未新建备份，两份 `.gitignore` 恢复为原文件名。 |
| `node scripts/check.mjs` | 入口、包内资源、许可与领域持久化检查通过；材料校验覆盖 15 个来源单元和 2196 个文件。 |

本轮验证采用本地 JS/TS 和合成报告。远端 GitHub/GitLab 附件、联网 PR 抓取、各语言适配器及 Story 视频导出未实测。
