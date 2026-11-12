# Speculo

Speculo 分发可复用的 AI 工作流、Work 技能和工具包，并在安装时保留项目数据。包名为 `@namewta/speculo`；支持的 Node 和 pnpm 版本见 `package.json`。

## 源码导航

- `src/`：发现、CLI、宿主暴露、安装、更新与恢复。
- `template/workflows/<domain>/SKILL.md`：四个领域路由入口；SpecDev 包含 Ops。
- `template/workflows/<domain>/<work>/SKILL.md`：可独立使用的任务方法及其必要参考、示例或工具。
- `template/commands/<name>/COMMAND.md`：交接或 Git 分析等明确的 AI 请求。
- `template/references/memory.md`：长期知识约定，在保存或接续工作时读取。
- `skills-hub/`：完整、可选择安装的工具技能。
- `.agents/skills/speculo-author/SKILL.md`：修改工作流、Work、Skill 和 Command 的编写指导。
- `docs/`：用户与维护者文档；`test/` 和 `scripts/`：可执行的安装及包验证。

读取与当前任务有关的文件。安装边界见[架构](../upstream/docs/architecture.md)，持久化见[工作流](../upstream/docs/workflow.md)，能力保留审计见[重构对应表](../upstream/docs/refactor-map.md)。

## 开发

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm verify-bin
pnpm verify-package
```

测试使用一次性夹具，不访问生产环境。运行相关检查并修复回归，无需每步询问。`verify-package` 安装真实 tarball，需要从已配置的注册表或缓存取得依赖。

## 编辑说明

改变文档的包装方式前，先保留它承载的能力。保留任务专用方法、来源材料、有用示例、可执行工具和许可证；移除重复指令、过时合同及不必要的流程。精简路由仍须能通向它所替代的专业内容。文件数和字数不是验收标准。

技能使用标准头部元数据和目录发现。不要重新引入业务清单、强制表单、状态 schema 或 agent 派单协议。渐进式披露控制读取范围，不能成为删除任务所需资料的理由。

保全用户运行资料的原字节、文件所有权、路径限制和事务恢复。安装元数据是机器状态，不能变成任务状态机。修改工具时测试工具的实际行为；修改方法时检查真实任务结果。

保留来源溯源与许可证。执行以用户指令和已有范围内的授权为准。如实报告验证与限制。`v*` 标签会调用分阶段 npm 发布工作流；PR 或构建成功不授予发布权限。
