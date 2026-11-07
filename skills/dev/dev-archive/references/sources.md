# 来源与改编

2026-11-07 阅读以下固定修订。此技能以 DeepSeek Harness 的成熟 Agent Notes 方法为主要复刻来源，并按 skills-wta 的领域目录、中文使用方式和轻量持久化要求改编。

## DeepSeek Harness

仓库：`deepseek-ai/deepseek-harness`；修订：`fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`；MIT。原许可随本技能保存在 [LICENSE](../LICENSE)。

| 原文件 | 保留的方法 |
| --- | --- |
| [dsh-archive-agent-notes/SKILL.md](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/.agents/skills/dsh-archive-agent-notes/SKILL.md) | 按未来决策价值分类；新增即检查替代；完整/部分替代；删除机械记录；保留仍有用的拒绝理由；修复入链 |
| [notes/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/.agents/notes/README.md) | 只记录代码未承载的长期理由；真实替代方案与后果；完整承接独有内容后才合并删除 |
| [implemented/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/.agents/notes/implemented/AGENTS.md) | 现役事实随实现更新；事实刷新与决定反转分开处理 |
| [frozen-agent-note-archive.md](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/.agents/notes/implemented/process/2026-07-26-frozen-agent-note-archive.md) | 现役说明与历史快照分开；默认检索不混入旧事实 |
| [dsh-prose-standard/SKILL.md](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/.agents/skills/dsh-prose-standard/SKILL.md) | 保留行为、条件、失败与责任，减少重复，链接主要说明；不以变短作为唯一目标 |

## 按用户要求作出的变化

- `.agents/notes/` 保留为项目记忆；按 context、decisions、errors、learning 组织，术语用简单 Markdown 表。需求和部署另有目录。
- 不移植 DeepSeek 专用的中英双语三件套、固定分类枚举、哈希封印及整仓 CI 命令。历史快照的原则保留，实施依赖 Git 和真实链接检查。
- 增加术语别名到代码对象的映射、核验范围、部署现状与希望行为的区别。
- SDD 与禁用 TDD 来自用户要求；不把普通回归验证等同 TDD。

## Speculo 的有限参考

仅参考 `NAMEWTA/Speculo` 修订 `9199c3bd0cf983c131efbc6340e44ac8b83a583d` 的 [specdev 目录](https://github.com/NAMEWTA/Speculo/tree/9199c3bd0cf983c131efbc6340e44ac8b83a583d/template/workflows/specdev) 中 change、context、ADR、learning 的职责分离，以及 [ops 目录](https://github.com/NAMEWTA/Speculo/tree/9199c3bd0cf983c131efbc6340e44ac8b83a583d/template/workflows/ops) 的环境资料组织。没有复制其技能正文、JSON 状态、schema、运行网关或强制状态流。
