---
name: home-setup
description: 初始化个人 Home Repo 的默认派遣方式和 Home team，原地登记项目、维护项目地图，以及保存用户背景、运行偏好和有关环境事实。用于“建立 Home”“接入这个项目”“以后用这套方式派遣”“记住项目使用哪个模型”“修改 Home 默认”；安装或普通查询不初始化。
---

# 接入 Home 与用户配置

交付可回读的仓库登记和用户实际要求的配置。项目地图按需查看，明确要求导出时才保存。用户选定的 Home Repo、skills-hub 源码仓和目标项目分别有自己的职责；Home 不等于操作系统用户目录。保留已有权威资料和当前授权，不为相同设置新建第二份真源。

## 先选择本次分支

| 任务 | 必读方法 | 产物 |
| --- | --- | --- |
| 显式初始化 Home 或补初始化派遣 | [派遣与团队初始化](references/dispatch.md)，有项目时读[登记与入口](references/registry.md) | 默认派遣方式、默认 Home team、适用的登记与导航 |
| 登记/移址/解除登记、查看或导出地图 | [登记与入口](references/registry.md) | repos.json、按需地图、必要薄导航 |
| 保存用户背景、偏好、派遣方式或团队 | [用户配置](references/configuration.md)，涉及派遣时读[派遣与团队初始化](references/dispatch.md) | context 文档或现有 owner |
| 验证本次所需工具或执行位置 | [环境事实](references/environment.md) | 有来源、时间、边界的能力观察 |

普通查询已有足够资料时直接继续，不要求完成全套初始化。只编辑配置时不探测全部账号、不启动任务；同一请求含执行工作时，完成保存后把选用配置交回 `home-workflow`。

## 执行方法

1. 确认用户指定的 Home 根、已有 `AGENTS.md`、`.agents/home/` 及同类资料真实位置。先复用既有要求，只有缺项确实阻止当前行动时询问具体项。
2. 登记项目时按准确名称调用 `home-route`，核实既有 clone、实际 checkout 与全部 remote。新登记采用 v2，保存名称、完整 URL 列表和明确的主 remote，路径写成 Home 根相对的 `./` 或 `../` 形式。旧 v1 继续读取，改写前按现场核查结果迁移。项目内部知识仍由进入项目的 Agent 读取；不移动仓库、不重新 clone、不切分支。
3. 按本次范围维护登记或 context。显式初始化时确定一个默认派遣方式和一个默认 Home team，分别保留有效旧选择，缺少选择时按派遣与团队初始化方法补齐。普通登记、配置编辑和安装更新沿用原默认。
4. 将用户的配置意图、现场能力观察和本次实际运行证据分开。CLI、模型、推理设置和派遣技能不设固定候选枚举；未知值不传入工具。
5. 按授权合并根薄导航，直接引用登记真源并保留用户正文。用包内工具校验、保存，再回读所改字段、路径和作用范围。没有 `repos.md` 是正常状态；地图由当前登记按需生成，显式导出时才写文件。
6. 报告保存内容、仍未知事项和实际做过的能力检查。保存配置不等于工具已切换、任务已送达或模型已生效。

先确定派遣方式，再选择 Home team，最后应用 repo ID 对应的执行者配置与本次覆盖。Home 默认只约束 Home 发出的直接任务，项目再派遣按当地规则，除非用户明确指定全链范围。

## 工具与模板

登记工具只读命令先行，完整参数与失败处理见登记方法：

```sh
node <本技能目录>/scripts/registry.mjs inspect --home "<Home 根>"
node <本技能目录>/scripts/registry.mjs validate --input "<候选登记.json>"
```

使用 [repos schema](assets/repos.schema.json)、[本机覆盖 schema](assets/local.schema.json) 校对输入；只有路径可以进入 `local.json`。秘密保留已有安全位置的引用，不写入登记或配置。

按真实内容选择 [profile](assets/profile.md)、[preferences](assets/preferences.md)、[派遣方式](assets/dispatch.md)、[Home team](assets/team.md)、[环境记录](assets/environment.md) 和 [根导航片段](assets/home-navigation.md)。模板不要求全部栏目有值，不在安装时批量生成。已有等价文档原地维护并引用。

## 完成条件

登记有稳定 ID、明确用途和核实过的身份；地图可由登记重建；自定义内容和其他领域资料保留。配置变更可与用户要求逐项对回，实际能力与运行结果有独立证据。不得创建项目接收器、宿主专属配置、全局默认、会话账本或自动后台服务。
