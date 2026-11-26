# 根导航片段

将下面代码块的正文合并到 Home 根 `AGENTS.md`，保留用户原有内容。链接以 Home 根为基准，已有资料位置不同时改用其真实相对路径。

```md
## Home 工作入口

先按任务读取 [Home 导航](.agents/home/AGENTS.md)与[项目登记](.agents/home/repos.json)。实际位置和 checkout 通过 `home-route` 解析；可读项目地图通过 `home-setup` 按需查看，无需预先保存 `repos.md`。

Home 保存各项目基本定位、项目管理与跨项目知识。项目内部资料由进入该项目的 Agent 读取与维护。现行知识查 `home-knowledge`，过去事件查 `home-history`，直接任务和项目占用查 `home-tasks`，配置由 `home-setup` 保存，项目派遣和验收由 `home-workflow` 协调。

显式初始化时分别设置默认派遣方式和默认 Home team。执行时按本次选择、方式与 team 关联及 Home 默认核对实际入口。各项目再次派遣时遵守当地有效规则与记录方法。
```
