# 来源与适配

本技能是下列上游内容的中文适配，保留列出的具体方法。不是未经修改的上游镜像。来源固定于 2026-11-07 查阅的提交，后续更新须重新核对原文与许可。

| 上游文件 | 保留内容 |
| --- | --- |
| [skills/engineering/code-review/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/code-review/SKILL.md) | 规格 / 规范独立两轴、固定比较范围及十二项启发式基线 |
| [pstack/skills/interrogate/SKILL.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/interrogate/SKILL.md) | 独立挑战、运行重现、核对证据并合并同根因问题 |
| [pstack/skills/blast-radius/SKILL.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/blast-radius/SKILL.md) | 跨 diff 影响、真实依赖版本和关键安全事实的证实 |

## 本地适配

改为中文。两轴保留独立结论；支持工作树、可由上下文明确的基准与无正式 spec 的真实请求。去掉特定模型及强制 arena。区分运行证据、确定代码证据和待证实假设，不能运行时如实说明。

这是用户指定的仓库技能；不要求安装其他 skill、Cursor 插件、MCP 服务或特定模型。项目持久化目录可以沿用项目现有约定。

## 许可

Matt Pocock 的相关文件使用 MIT 许可，原版权和完整许可保存在 [LICENSE-MATTPOCOCK](../LICENSE-MATTPOCOCK)。

pstack 使用其目录内的 MIT 许可，版权人为 Lauren Tan，完整许可保存在 [LICENSE-PSTACK](../LICENSE-PSTACK)。cursor/plugins 根目录未标注通用许可，本技能只依据 pstack 的目录级许可复用上述内容。
