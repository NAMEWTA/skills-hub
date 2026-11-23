# 证据重构整体验收：02–04

状态：通过本地工作区交付验收。01 是独立需求，未实施、未验收。旧证据未扫描、迁移或兼容；未提交、推送或发布。

验收对象：`d6b7d32` 基线上的 02–04 工作区实现及实际打出的 `@namewta/skills-hub@0.1.24` tarball。联验在 Windows x64、Node.js v24.21.0、npm 12.0.2、Git 2.47.1.windows.2 上运行。本地联验包完整性为 `sha512-WkojH/aDRxmGVzPmpBYwJjfubQpn5YYgojh0fEOr9miSl3PhF3tNaCcgkOEY6aDlh9ZZ38lK3jMGQ2twnfAjNw==`，不代表 npm 上的发布制品。

| 组合场景 | 观察 | 分票报告 |
| --- | --- | --- |
| 开发取证失败后接续和重验 | 安装后的有限模型从另一个代码目录运行，原件分两轮落在目标根 `temp/dev/`，失败与恢复更新同一 `.md`。输出参数缺失不在模型旁写文件。Git-only 导出没有原始附件，仍可阅读并重跑。 | [02 开发取证](evidences/02-on-demand-evidence.md) |
| 安装和 Git 隔离 | 核对 dev-only、system-only、混装、ops-only、独立上游、升级和预览；原件被根 `/temp/` 忽略，报告和正式资源可跟踪，已有跟踪内容未改变。源码回归验证写入失败回滚。 | [03 安装](evidences/03-initialize-temp-ignore.md) |
| 系统取证及 Herdr 交接 | 两套已装模板均走了缺附件阻塞、同票重派和验收后更新清单，派发回执不重复业务验收。已装 inspect 输出和离线 DNS 请求落在忽略的 `temp/system/`。 | [04 系统取证](evidences/04-system-evidence.md) |

`npm run check:full` 计 384 项，373 通过、0 失败、11 因 Windows/POSIX 差异或权限跳过；有限状态示例实跑故障注入。`npm run check:statechart` 回放 33 项全通过，`npm run check:package` 验证 55 个技能、1044 个分发文件。实际 tarball 隔离消费者的组合探针在通过前未写总报告，完成后确认 Git 导出可用。本 Change 自身的 `tasks/` 与 `evidences/` 也逐名配对，包括未实施的 [01](evidences/01-user-selected-collaboration.md)。本次在上述联验结束后才完成这份总验收。

未验证：真实 TLC 求解、Pele 渲染、业务浏览器操作、实际 Herdr 会话和远端挂载、Linux 清理及真实代理流量。状态图回放和渲染、交接夹具不代替这些运行。重跑命令见分票报告；原件留本机 `temp/dev/2026-11-23-dev-collaboration-evidence/integration/gate-05/`，阅读本报告不依赖附件。
