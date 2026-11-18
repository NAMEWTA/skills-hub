# npm 与 GitHub 发布记录

## 目标与入口

- 源码仓库：`NAMEWTA/skills-hub`；发布分支：`main`。
- npm 包：`@namewta/skills-hub`；registry：`https://registry.npmjs.org/`。
- 版本标签：`v<package.json version>`；GitHub Release 附件是同一次构建的 tarball 与 `SHA256SUMS`。
- 执行入口：仓库 `.github/workflows/release.yml` 与 `scripts/release.mjs`；完整契约见[版本发布](../../../../docs/maintenance/release.md)。

## 准备与执行

先读取最新 main、开放 PR、版本和发布状态，固定本次源码依据。按最新包版本递增补丁版本，同步 package/lock、CHANGELOG 和当前安装示例；历史发布记录保留原版本。

发布候选执行 `npm run check:full`、`npm run check:statechart`、`npm run check:package`，并由 GitHub Actions 在 Linux、macOS、Windows 验证相同提交。Linux 额外运行已安装 Archify 的真实浏览器交付检查。已有项目升级时核对技能替换、备份和业务资料保护。

合并版本变化到 main 后由既有工作流发布。凭据仅引用仓库 Secret `NPM_TOKEN`，发布步骤映射到 `NODE_AUTH_TOKEN`；GitHub 写入使用工作流的 `GITHUB_TOKEN`。不在记录或包内保存凭据值。

## 完成条件与恢复

以精确 npm 版本可读、tarball SHA-512 一致、稳定版 latest 正确、Git 标签指向已验证提交、公开 Release 附件 SHA-256 一致为完成条件。工作流绿色但发布步骤跳过不代表新版本已发布。

npm 命令成功后可能仍在服务端扫描。发布器在 20 分钟内每隔至多 30 秒只读核验，等待期间不会再次上传；超时保留版本与制品，查明实际状态后继续同一提交。实际已有 stage 仍须核对原件并按其审批要求处理。

已发布版本与标签保持不可变。包内容需要修正时发布下一个补丁版本；只补齐同版本 Release 时必须核对完整性，保持原提交和附件。旧发布记录保留作为恢复依据。
