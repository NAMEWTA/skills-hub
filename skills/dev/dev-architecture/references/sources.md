# 来源与适配

本技能是下列上游内容的中文适配，保留列出的具体方法。不是未经修改的上游镜像。来源固定于 2026-11-07 查阅的提交，后续更新须重新核对原文与许可。

| 上游文件 | 保留内容 |
| --- | --- |
| [skills/engineering/codebase-design/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/codebase-design/SKILL.md) | 深模块、接口负担、局部性和删除检验 |
| [skills/engineering/codebase-design/DEEPENING.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/codebase-design/DEEPENING.md) | 实际依赖分类及内外部替换点 |
| [skills/engineering/codebase-design/DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/codebase-design/DESIGN-IT-TWICE.md) | 不同设计目标下的结构比较 |
| [skills/engineering/domain-modeling/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/domain-modeling/SKILL.md) | 领域词汇与稀疏 ADR 的三项判断 |
| [pstack/skills/architect/SKILL.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/architect/SKILL.md) | 先理解系统、先写调用方式、草图与实现偏离的处理 |
| [pstack/skills/architect/references/design-red-flags.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/architect/references/design-red-flags.md) | 浅模块、信息泄漏、时序拆分、共享所有权和手工列表 |
| [pstack/skills/architect/references/rationale-template.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/architect/references/rationale-template.md) | 问题、用法、结构、方案选择、取舍与下一步 |

## 本地适配

改为中文。保留真实候选比较和 caller-first 方法；去掉特定模型、arena、每跨函数必用该技能等宿主策略。比较规模随问题而定，代码骨架按需，ADR 与当前代码引用接入项目 Markdown 记忆。

这是用户指定的仓库技能；不要求安装其他 skill、Cursor 插件、MCP 服务或特定模型。项目持久化目录可以沿用项目现有约定。

## 许可

Matt Pocock 的相关文件使用 MIT 许可，原版权和完整许可保存在 [LICENSE-MATTPOCOCK](../LICENSE-MATTPOCOCK)。

pstack 使用其目录内的 MIT 许可，版权人为 Lauren Tan，完整许可保存在 [LICENSE-PSTACK](../LICENSE-PSTACK)。cursor/plugins 根目录未标注通用许可，本技能只依据 pstack 的目录级许可复用上述内容。
