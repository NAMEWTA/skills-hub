# 多 Change 批次编排验收

在 Windows、Node.js 24.21.0、Codex CLI 0.169.1 上核对，改动基于 skills-hub 提交 `8bba91c`。本次验收使用临时 Git 项目，本地交付为终点。

## 从成员清单进入 Goal

从源码将 `dev-program` 单独安装到空项目。准备事件、消息、角色权限和组合验证四份规格，分别要求导出 `event()`、`message(event)`、`allowed(role)` 和可直接运行的 `verify.mjs`。给真实 Codex Goal 提供四个成员目录，要求保存批次并交付通过本地验证的代码。

Goal 读取已安装的技能和规格，建立引用四份规格的批次文档。它识别到事件规格已经确定字段，消息实现可以开始，组合验证才需要运行中的实现。角色判断可独立进行。实际组合验证确认成员可访问、访客被拒绝、事件提供 recipient 字段、消费真实事件得到 Hello Ada。Goal 状态从 active 变为 complete，随后从测试进程独立执行 `node verify.mjs` 通过。

## 从批次文档恢复

复制第一项实测中已经产生的文件到另一个临时 Git 项目，模拟中断遗留的工作区。将事件规格和提供方实现改成 v2 的 name 字段，保留旧消费方、旧验证和写着“事件实现仍待更新”的检查点。新 Goal 只收到批次文档路径与整批本地验收要求。

新 Goal 回读成员依据，发现 event.mjs 已满足 v2，更新了消息消费方和组合断言，写回证据并达到 complete。独立运行组合验证输出：

```text
Verified member and guest access, the v2 event payload, and the composed greeting.
```

另用 name 为 Lin 的输入验证得到 Hello Lin，避免仅凭固定问候语通过。独立权限模块在两轮工作区的 SHA-256 相同。此例验证新会话从过期记录接续，未模拟机器断电或远端 PR 恢复。

## 宿主和安装边界

首次在默认 Windows 工作区工具上试跑时，shell 启动助手报错，Goal 也报告批次目录写入受限；该次尝试超时。成功的两轮使用真实 Codex app-server Goal 和仅面向隔离样例的本地文件与验证工具。文件工具可读安装技能、写夹具实现和计划，验证工具执行样例的 Node 断言。这些工具只用于验收。技能入口另说明目标位置只读时如何交付可复制的批次资料。

用基线安装器在临时项目安装原 workflow、help、parallel、deploy，再以本次源码按整个 dev 域升级。三份迁移方法均位于新所属包，旧 workflow 路径已移除，原有业务记录保留。npm tarball 的安装、命令、资源和重复安装检查通过，共 52 个技能、1029 个分发文件。未执行 npm 发布。

## 仓库与材料检查

- `npm run check` 通过。核对了 14 个来源、1815 个材料文件，三份 pstack 方法与 Speculo 目标计划的运行路径和采用依据已经更新。上游原件与翻译底稿保持原版本。
- `npm run check:package`、`git diff --check`、方法唯一归属与持久化专项共六项测试通过。
- `npm run check:full` 的 Node 测试共 366 项，354 通过、11 跳过、1 失败。材料同步测试创建符号链接时收到 Windows 的 `EPERM`。从未修改的基线单独运行同一用例复现该错误。完整检查后续的有限状态与故障注入示例已单独执行通过。
