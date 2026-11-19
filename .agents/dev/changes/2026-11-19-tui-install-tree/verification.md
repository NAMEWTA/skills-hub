# 交互安装验证

在 Windows、Node.js 24.21.0 上验证基于 `70af16c` 的工作区改动。

- 通过 Windows 伪终端运行 `node install.mjs install --dry-run`。从收拢的领域列表定位 `system`，用 Tab 展开，用空格勾选 `system-cleanup`，两次 Enter 完成预览。输出为 `would install system-cleanup`，退出码为 0。
- `node --test tests/cli-pagination.test.mjs tests/cli-search.test.mjs tests/cli.test.mjs` 通过 18 项。覆盖 20 个技能的分页、短窗口、调整页容量、跨领域勾选、搜索关键词和空格键、普通及上游技能预选、旧版更新预览、跳过更新和取消。首次专项检查使用了不存在的 `ops-observe`，改为目录中的 `ops-inspect` 后通过。
- `npm run check:package` 通过。临时消费者安装了实际打包的 52 个技能和 1029 个分发文件，验证命令入口、运行资源、许可及重复安装。
- `npm run check:full` 通过包结构、本地链接、持久化路径和材料快照检查。隔离回归为 354 项通过、11 项跳过、1 项失败。失败发生于 `tests/materials-sync.test.mjs` 的夹具准备阶段，Windows 创建文件符号链接时返回 `EPERM`。单独重跑该用例复现了同一错误。
- 完整检查在隔离回归失败后退出。单独运行 `node skills/dev/dev-formal-verify/scripts/demo.mjs` 通过，原实现、注入故障和恢复后的退出码依次为 0、1、0。
