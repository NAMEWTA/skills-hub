# 04 系统取证与 Herdr 交接验收

任务：[04-system-evidence](../tasks/04-system-evidence.md)

状态：已安装模板、文件协作夹具及本机只读取证通过。未接入真实 Herdr 或远端主机。

实际 tarball 安装后，Herdr TUI 的内嵌回执与独立模板一致。隔离探针误用半角冒号解析 TUI 模板的字段，无法核对写出的 `pane_id`，未执行附件阻塞和重派。修正探针按模板的全角冒号填字段，原始输出留本机 `temp/dev/2026-11-23-dev-collaboration-evidence/integration/gate-03/probe.log`。没有连接实际 Herdr 会话。

## 复验

- Windows / Node v24.21.0，在与 [02](02-on-demand-evidence.md) 同一隔离消费项目使用已装 TUI 与 Core 模板。两份内嵌回执分别与独立 `assets/report.md` 一致；manifest 仍是原三列。主题含空格；`pane:1/7` 映射为 `pane%3A1%2F7`，`build/t7` 映射为 `build%2Ft7`，manifest 保存原标识；核对 URL 的 `%20` / `%25` 编码及向上五层的相对路径能打开附件。用两个不同绝对路径指向同一临时目录，实际读回两边为同一文件；这是本机挂载路径夹具，不是远程挂载。
- 两套均先发布 `report01.md`，worker `done` 时清单仍为 `active`。Lead 读不到必需附件后更新业务报告并标 `blocked`，未回收。重派 `task02.md`，可读附件在新运行目录，Lead 复核后才更新原业务报告并把 manifest 改为 `done`。旧回执保留，尝试覆盖终稿返回 `EEXIST`；业务目录仍只有与原票同名的一份报告。终端通知、延迟消息和实际进程回收未执行。
- 已安装的 `system-inspect/scripts/inspect.mjs --path <隔离项目>` 真实输出本机文件系统容量，按需捕获到忽略的 `temp/system/hosts/localhost/audit/run-01/inspect.md`。从已装 `dns-workflow.md` 执行离线 Python 3.12 样例，在指定运行目录写 29 字节 A 查询，未发送请求。`system-cleanup` 和 `system-config` 核对路径说明、原件与正式配置/恢复备份边界，未执行系统清理或改配置。

## 重跑

在隔离项目安装 `system-herdr`、`system-herdr-core`、`system-inspect`、`system-proxy` 及 `dev-verify`。按两套模板各建一个含空格的主题和已有业务票，先发 `task01.md`，让回执存在但不提供必需附件；确认无法验收，再按 `task02.md` 的新运行目录补附件。按 TUI 的全角冒号和 Core 的 ` — ` 填写回执，核对 `git check-ignore -v`、两侧附件可达性和业务报告一致性；末尾执行 `node <已装 dev-verify>/scripts/check-evidence.mjs <系统 Change>`。主机取证可以只运行 inspect；在线网络、远端挂载和回收需另在授权环境验证。最终联验日志位于本机 `temp/dev/2026-11-23-dev-collaboration-evidence/integration/gate-05/probe.log`。
