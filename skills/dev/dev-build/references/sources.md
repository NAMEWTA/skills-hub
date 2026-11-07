# 来源与适配

本技能是下列上游内容的中文适配，保留列出的具体方法。不是未经修改的上游镜像。来源固定于 2026-11-07 查阅的提交，后续更新须重新核对原文与许可。

| 上游文件 | 保留内容 |
| --- | --- |
| [skills/engineering/implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/implement-spec/SKILL.md) | 任务图前沿、上下文指针、独立实施与整合审查 |
| [skills/engineering/implement/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/implement/SKILL.md) | 从指定规格或工单实施、运行检查和交付 |
| [pstack/skills/poteto-mode/playbooks/feature.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/poteto-mode/playbooks/feature.md) | 唯一写入者、按真实表面验证及小单元交付 |
| [pstack/skills/poteto-mode/playbooks/refactoring.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/poteto-mode/playbooks/refactoring.md) | 保持或明确重定义行为契约、迁移调用者、删除旧接口 |
| [pstack/skills/poteto-mode/playbooks/autonomous-run.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/poteto-mode/playbooks/autonomous-run.md) | 可检查完成条件、证据驱动迭代与不中途停在计划 |
| [pstack/skills/poteto-mode/playbooks/orchestrate.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/poteto-mode/playbooks/orchestrate.md) | 阅读实际产物、所有权和真实交付状态 |

## 本地适配

改为中文。用 SDD 完整替换上游强制调用 tdd；实现后做风险相称验证。去掉固定模型、每任务必建工作树、机械代理数量和自动外部消息。保留已授权动作持续执行，单技能安装时可自行完成必要步骤。

这是用户指定的仓库技能；不要求安装其他 skill、Cursor 插件、MCP 服务或特定模型。项目持久化目录可以沿用项目现有约定。

## 许可

Matt Pocock 的相关文件使用 MIT 许可，原版权和完整许可保存在 [LICENSE-MATTPOCOCK](../LICENSE-MATTPOCOCK)。

pstack 使用其目录内的 MIT 许可，版权人为 Lauren Tan，完整许可保存在 [LICENSE-PSTACK](../LICENSE-PSTACK)。cursor/plugins 根目录未标注通用许可，本技能只依据 pstack 的目录级许可复用上述内容。
