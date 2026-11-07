# 来源与适配

本技能是下列上游内容的中文适配，保留列出的具体方法。不是未经修改的上游镜像。来源固定于 2026-11-07 查阅的提交，后续更新须重新核对原文与许可。

| 上游文件 | 保留内容 |
| --- | --- |
| [skills/engineering/diagnosing-bugs/SKILL.md](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/diagnosing-bugs/SKILL.md) | 紧凑观察路径、复现最小化、可证伪假设、针对观测、脱敏和清理 |
| [pstack/skills/poteto-mode/playbooks/bug-fix.md](https://github.com/cursor/plugins/blob/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack/skills/poteto-mode/playbooks/bug-fix.md) | 证据支持的最小修复、撤掉被否定的试探、同表面复核 |

## 本地适配

改为中文。移除先写失败测试、失败测试先提交以及 red-green-refactor，保留诊断所需的现象复现和运行证据。修复按 SDD 契约实现后补必要回归验证；不设固定假设数量或必须某工具的硬门槛。

这是用户指定的仓库技能；不要求安装其他 skill、Cursor 插件、MCP 服务或特定模型。项目持久化目录可以沿用项目现有约定。

## 许可

Matt Pocock 的相关文件使用 MIT 许可，原版权和完整许可保存在 [LICENSE-MATTPOCOCK](../LICENSE-MATTPOCOCK)。

pstack 使用其目录内的 MIT 许可，版权人为 Lauren Tan，完整许可保存在 [LICENSE-PSTACK](../LICENSE-PSTACK)。cursor/plugins 根目录未标注通用许可，本技能只依据 pstack 的目录级许可复用上述内容。
