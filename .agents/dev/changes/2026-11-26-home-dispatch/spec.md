# Home 派遣初始化与项目任务记录

[需求与确认决定](source/request.md)来自本次 Home 设计对话。升级适用于 skills-hub 源仓及以后安装的技能包。

- `home-setup` 显式初始化独立的派遣默认和 Home team。缺少用户选择时解析当前宿主原生派遣，team 使用一个项目负责人和工具默认。按方式记住 team 关联，按 team 记住项目执行者覆盖。旧 Home 仅在显式补初始化时写入。
- `home-workflow` 选方式、team 与目标配置，核对实际 checkout 后由项目负责人执行。Home 验收直接交付，项目自行管理本地任务和验收。
- `home-tasks` 维护直接业务主题、按轮的 task/report、各目标状态和项目占用。TSV 可从来源重建。同一项目跨主题独占，忙碌项目可以先排队。未确认投递保留占用。原始会话由原方法核实。

实施和复验见 [01-home-dispatch](tasks/01-home-dispatch.md)。
