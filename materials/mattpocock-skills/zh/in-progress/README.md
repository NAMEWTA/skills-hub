# 开发中

测试版。这些技能有意公开：试用它们，告诉我哪里出问题。它们在进入稳定分类前，不会加入插件或顶层 README，没有文档页面，可能随时改变或消失，不另行通知。

插件不会提供这些技能。直接安装某一个：

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

- **[loop-me](./loop-me/SKILL.md)**：通过多轮会话的深入追问，把想法变成可实现的工作流规格，以当前目录作为有状态工作区。由用户调用。
- **[writing-beats](./writing-beats/SKILL.md)**：以自选冒险路径的风格，把文章塑造成节拍之旅。选择起始节拍，只写该节拍，再转向下一个，直到文章自然结束。
- **[writing-fragments](./writing-fragments/SKILL.md)**：通过深入追问挖掘你的片段（异质的写作精华），追加到单个文档，作为未来文章的原始素材。
- **[writing-shape](./writing-shape/SKILL.md)**：将原始素材 Markdown 文件逐段塑造成文章，每一步都讨论形式选择的理由。
- **[claude-handoff](./claude-handoff/SKILL.md)**：经由 `claude --bg`，把当前对话连同交接摘要移交给全新的后台代理，让它立即接手工作。由用户调用。
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)**：将 dependency-cruiser 接入 TypeScript 仓库，使每个包成为深模块：实现隐藏在子目录，只能经由入口文件访问，测试也通过这些入口检验它。由用户调用。
- **[software-factory](./software-factory/SKILL.md)**：设计软件工厂的共享语言：它运行的任务，以及接入的服务。与深入追问会话一起调用。由用户调用。
