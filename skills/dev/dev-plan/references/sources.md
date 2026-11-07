# 来源与适配

本技能是下列上游内容的中文适配，保留列出的具体方法。不是未经修改的上游镜像。来源固定于 2026-11-07 查阅的提交，后续更新须重新核对原文与许可。

| 上游文件 | 保留内容 |
| --- | --- |
| [skills/engineering/to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/to-tickets/SKILL.md) | tracer-bullet 垂直切片、可演示结果、真实阻塞与大范围重构例外 |
| [skills/engineering/wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/wayfinder/SKILL.md) | 工作前沿与尚不能定义的需求范围 |
| [pstack/skills/poteto-mode/playbooks/feature.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/poteto-mode/playbooks/feature.md) | 独立工作流、共享写入所有权及最小安全分解 |
| [pstack/skills/poteto-mode/playbooks/multi-phase-plan.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/poteto-mode/playbooks/multi-phase-plan.md) | 以证据定义任务完成、记录实施依赖与交付边界 |

## 本地适配

改为中文。复用 Markdown 计划和可选任务文件，去掉强制 tracker 状态、固定十路验证、Cursor /loop、必备模板检查器及重复授权。兼容迁移仅在实际约束存在时采用，允许用户指定的整体替换。

这是用户指定的仓库技能；不要求安装其他 skill、Cursor 插件、MCP 服务或特定模型。项目持久化目录可以沿用项目现有约定。

## 许可

Matt Pocock 的相关文件使用 MIT 许可，原版权和完整许可保存在 [LICENSE-MATTPOCOCK](../LICENSE-MATTPOCOCK)。

pstack 使用其目录内的 MIT 许可，版权人为 Lauren Tan，完整许可保存在 [LICENSE-PSTACK](../LICENSE-PSTACK)。cursor/plugins 根目录未标注通用许可，本技能只依据 pstack 的目录级许可复用上述内容。
