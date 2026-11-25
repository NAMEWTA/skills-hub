# GitHub Issue #20 来源快照

- 来源平台：GitHub
- 实例：https://github.com
- 仓库：NAMEWTA/skills-hub
- 原生对象 ID：6600914701；仓库内 Issue 编号：20
- URL：https://github.com/NAMEWTA/skills-hub/issues/20
- 来源作者：NAMEWTA
- 来源创建时间：2026-11-25T09:03:40Z
- 来源更新时间：2026-11-25T09:03:40Z
- 读取时状态：open
- 本次读取日期：2026-11-25；首次读取的精确时分秒未单独捕获，不用后续回读时间替代。
- 完整度：正文完整；通过分页读取工具取得全部评论，读取时评论数为 0；无附件。
- 快照性质：重写 Plan 前的原始需求；后续正文见同目录 issue.md。

## 原始标题

Home 登记支持多 remote、显式相对路径与按需项目地图

## 原始正文

## 使用场景

初始化 Home 时，在同一个已有 checkout 上配置 `origin` 和另一个 Git remote（例如内部镜像），再用 `home-setup` 登记该项目。当前登记无法完整表达这些远端，也会为同一份登记自动落盘一份 Markdown 项目地图。相关初始设计见 [#2](https://github.com/NAMEWTA/skills-hub/issues/2)。

## 当前行为

- **多个 remote 只登记一个**。`home-route --inspect` 可以发现多个 remote，但 `.agents/home/repos.json` 的 v1 schema 只允许一个字符串 `remote`。初始化后无法从 Home 登记看到该 checkout 其余已配置的远端。[登记 schema](https://github.com/NAMEWTA/skills-hub/blob/70a60a45d1d0e2e93920c2c47b5b69d3769fcf4c/skills/home/home-setup/assets/repos.schema.json#L13-L20) · [远端检查](https://github.com/NAMEWTA/skills-hub/blob/70a60a45d1d0e2e93920c2c47b5b69d3769fcf4c/skills/home/home-route/scripts/route.mjs#L126-L147)
- **`localPath` 的相对基准在值中不够直观**。例如登记值为 `"localPath": "project-a"`。它已按 Home 根解析，但裸目录名看起来和仓库 ID 一样，无法从写法直接看出这是目录引用。[登记约定](https://github.com/NAMEWTA/skills-hub/blob/70a60a45d1d0e2e93920c2c47b5b69d3769fcf4c/skills/home/home-setup/references/registry.md#L21-L31)
- **保存登记会同时生成 `repos.md`**。地图完全派生自 `repos.json`，保存时还要核对地图的版本。在只通过技能查找和定位项目的场景中，是否需要每次把地图写成第二个文件？[登记保存实现](https://github.com/NAMEWTA/skills-hub/blob/70a60a45d1d0e2e93920c2c47b5b69d3769fcf4c/skills/home/home-setup/scripts/registry.mjs#L168-L184)

## 期望与建议

1. 登记时保存同一 checkout 的所有已核实 remote，保留 Git remote 名称与地址。保留清楚的主身份核验规则，兼容已有单 `remote` 登记和无 remote 的本地仓库。
2. 将共享登记中的 `localPath` 写成显式的 Home 根相对路径，例如 `./project-a` 或 `../repos/project-a`。本机绝对路径可通过 `local.json` 覆盖。继续读取已有裸相对路径，导航中显示路径时提供可打开的相对链接。
3. 评估是否还需默认写入 `repos.md`。建议让初始化、登记、路由和校验直接读取 `repos.json`，把可读地图保留为按需查看或显式导出。若保留默认生成，请明确由哪些使用场景依赖落盘文件。

## 验收

- [ ] 登记带 `origin` 和另一个 remote 的 checkout 后，回读能区分两者的名称和地址，`home-route` 能核验同一 checkout 的 Git 身份。
- [ ] Home 内项目和同级项目分别写成 `./project-a` 和 `../repos/project-a` 一类的相对引用。已有 `project-a` 路径仍能解析到原目录。
- [ ] 若采用按需地图，没有 `repos.md` 的 Home 可完成初始化、登记和路由，显式请求仍能得到从当前登记生成的可读地图。
