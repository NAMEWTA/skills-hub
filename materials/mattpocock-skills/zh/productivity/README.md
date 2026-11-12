# 效率

通用工作流工具，不限于代码。

## 由用户调用

只有你输入名称时才可触达（Claude Code：`disable-model-invocation: true`；Codex：`agents/openai.yaml` 中的 `policy.allow_implicit_invocation: false`）。

- **[grill-me](./grill-me/SKILL.md)**：围绕计划或设计接受持续深入访谈，直到设计树每个分支都解决。
- **[handoff](./handoff/SKILL.md)**：将当前对话压缩成交接文档，让其他代理继续工作。
- **[teach](./teach/SKILL.md)**：跨多个会话教授用户新技能或概念，以当前目录作为有状态教学工作区。
- **[to-questionnaire](./to-questionnaire/SKILL.md)**：把你无法独自回答的决策变成 Markdown 问卷，交给能够回答的那个人（异步填写，或开会一起填写）。
- **[wait-what](./wait-what/SKILL.md)**：某条消息没讲明白时立即调用。代理用朴素英语、采用你 `GLOSSARY.md` 的术语，补上你缺失的上下文并重新讲解。

## 由模型调用

模型或用户均可触达（提供丰富的触发表述，让模型能够主动使用）。

- **[grilling](./grilling/SKILL.md)**：围绕计划、决策或想法持续深入访谈用户，直到设计树每个分支都解决。
- **[writing-for-agents](./writing-for-agents/SKILL.md)**：为代理编写文档：技能、AGENTS.md/CLAUDE.md，以及代理通过指针触达的任何文档。
