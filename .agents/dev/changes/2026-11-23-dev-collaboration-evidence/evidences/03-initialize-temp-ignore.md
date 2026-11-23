# 03 安装忽略规则验收

任务：[03-initialize-temp-ignore](../tasks/03-initialize-temp-ignore.md)

状态：源码和本地 tarball 安装均通过复验。

Windows / Node v24.21.0 / npm 12.0.2，基线 `d6b7d32` 的本轮工作区。首次 `npm run check:full` 因四组 dev 安装超出托管 `changes/AGENTS.md` 的 400 非空白字符限制、另因独立上游预览错误期待 `would create`，共失败 5 项。已缩短托管说明至 346 字符，并让只选独立上游的预览断言检查技能安装、不要求创建业务导航。原始输出留本机 `temp/dev/2026-11-23-dev-collaboration-evidence/integration/gate-01/full.log`。

## 复验

- 源码的安装回归验证 dev、system、混装、仅 ops、仅独立上游、重复安装、预览和只读操作。注入 `.gitignore` 的部分写入失败，验证恢复原字节和回滚两个领域导航与技能写入。升级夹具验证 BOM、CRLF、原规则、已跟踪文件和 `!/temp/` 仍有效；不动业务内容。新安装均不预建 `temp/`。
- 在独立 npm 前缀安装工作区生成的 tarball，再运行包内 CLI。dev-only 得到 `/.agents/dev/worktree/` 和 `/temp/`；system-only 只有 `/temp/`；混装两条规则无重复；ops-only 和独立上游不创建 `.gitignore`。各项预览无写入，重装不再添加。另用包内 CLI 升级一份隔离夹具，验证旧 `.gitignore` 字节、根项目规则及手写配置记录不变，托管导航更新，未预建原件目录。`npm run check:package` 核验 55 个技能、1044 个分发文件、命令入口及资源。
- 隔离 Git 项目验证待留原件被 `/temp/` 排除，包括 JSON、PNG、日志和工具 Markdown；报告、协调回执、原型文件、测试夹具和 `src/temp/` 仍可跟踪。安装后 `git ls-files` 仍列出此前已跟踪的 fixture；`git check-ignore --no-index` 能显示对应规则，但不会取消跟踪。

## 重跑

在仓库执行 `node --test tests/persistence-initialization.test.mjs tests/cli.test.mjs` 和 `npm run check:package`。另可运行 `npm pack --ignore-scripts --pack-destination <隔离目录>`，以 `npm install --prefix <独立工具目录> --ignore-scripts --no-package-lock --no-save <tarball>` 安装；在空目标目录运行该包的 `install.mjs install --skill dev-verify system-inspect --dry-run`，去掉 `--dry-run` 后连装两次，核对 `.gitignore` 字节、`temp/` 不预建及原件排除。包验证是本地分发检查，不是公开发布结果。最终联验日志留本机 `temp/dev/2026-11-23-dev-collaboration-evidence/integration/gate-05/`。
