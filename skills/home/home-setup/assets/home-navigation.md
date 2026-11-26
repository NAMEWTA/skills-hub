# 根导航片段

用户单独明确要求补根导航时，把下面的正文合并到 Home 根 `AGENTS.md`，保留用户原有内容。链接以 Home 根为基准，已有资料位置不同时改用其真实相对路径。

```md
## Home 工作入口

先读 [Home 资料入口](./.agents/home/AGENTS.md)，按任务选择登记、知识或派遣资料。实际位置和 checkout 通过 `home-route` 解析。可读项目地图通过 `home-setup` 按需查看。

Home 保存各项目基本定位、项目管理与跨项目知识。项目内部资料由进入该项目的 Agent 读取与维护。现行知识查 `home-knowledge`，过去事件查 `home-history`，直接任务和项目占用查 `home-tasks`，配置由 `home-setup` 保存，项目派遣和验收由 `home-workflow` 协调。

显式初始化时分别设置默认派遣方式和默认 Home team。执行时按本次选择、方式与 team 关联及 Home 默认核对实际入口。各项目再次派遣时遵守当地有效规则与记录方法。

换机克隆 Home 后直接读取 `.agents/skills/` 中随仓保存的技能。使用 Git 和 Node.js 22.14+，在 Home 根运行以下命令恢复登记项目。省略 `--apply` 可预览。

    node .agents/skills/home-setup/scripts/restore.mjs --home . --apply

历史、知识和任务可在项目恢复前查询。正式记录正文保存理解结论和接续工作所需的内容，原始日志及临时产物保留在 `temp/`。
```
