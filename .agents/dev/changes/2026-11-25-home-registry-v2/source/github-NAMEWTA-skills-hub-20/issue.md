# GitHub Issue #20 完成状态快照

- 来源平台与实例：GitHub / https://github.com
- 仓库：NAMEWTA/skills-hub
- 原生对象 ID：6600914701；仓库内 Issue 编号：20
- URL：https://github.com/NAMEWTA/skills-hub/issues/20
- 标题：Home 登记改进：多 remote、显式相对路径与按需项目地图（完整实施 Plan）
- 来源作者：NAMEWTA
- 来源创建时间：2026-11-25T09:03:40Z
- 来源更新时间：2026-11-25T09:59:41Z
- 来源状态：closed / completed；关闭时间：2026-11-25T09:59:41Z
- 抓取时间：2026-11-25 10:00:11 UTC
- 完整度：正文完整，全部评论工具回读为 0 条；正文无附件。
- 版本关系：[原始需求](issue-original.md) 保留重写前正文；实施前 Plan 已随 [8e58e53 提交](https://github.com/NAMEWTA/skills-hub/blob/8e58e53f2f3c76deec514d236a7bc4a763b2ca65/.agents/dev/changes/2026-11-25-home-registry-v2/source/github-NAMEWTA-skills-hub-20/issue.md) 保存，本文件更新为完成后实际回读的正文。

## 原生正文

## 0. 目标、基线与决定

本 Issue 负责 Home 项目登记的三项改进：**完整登记同一 checkout 的多个 Git remote、将共享路径写成显式的 Home 根相对路径、把项目登记地图改为按需查看或显式导出。**

- 实施基线：main `f7285ab799f76700b36c54293b84c9a0013c3ec9`，包版本 `0.1.30`；核查日期 2026-11-25。
- 需求来源：本 Issue 原始描述及 [Home 初始设计 #2](https://github.com/NAMEWTA/skills-hub/issues/2)。
- 用户已授权：重写本 Issue 的详细 Plan 后实施，提交并推送 main，补丁版本递增 0.0.1。
- 本地跟踪：`.agents/dev/changes/2026-11-25-home-registry-v2/`；原始 Issue、重写后的计划快照与必要讨论存 `source/`，每项任务配同名 `evidences/*.md`，完成后汇总 `evidence.md`。
- 本计划在实施前写入。各验收项按真实执行结果更新，不将方案或测试设计标成通过。

## 1. 当前问题与根因

| 问题 | 当前实现 | 后果 |
| --- | --- | --- |
| 多 remote 只保存一个身份 | v1 schema 只有 `remote: string`；route 检查可以列多个远端，但不提供可完整回写的名称/多 URL/显式 push URL 登记 | origin 与内部镜像无法同时准确表达 |
| 相对路径写法不直观 | 相对路径本来就按 Home 根解析，但允许裸 `project-a`；共享字段也缺少明确的新写入边界 | 从值本身不易看出是目录引用，机器绝对路径容易进入共享登记 |
| 地图强制参与保存 | registry.save 要同时核对登记与地图 revision，并同时生成 `repos.md` | 派生文件变成正常登记的前置依赖；手写地图可能阻塞纯登记修改 |
| 缺地图被诊断为问题 | doctor 对不存在的地图产生诊断 | 仅使用技能和 JSON 登记的 Home 不能保持最小资料集合 |

实施只改现有 Home owner：`home-setup` 管理登记和项目登记地图，`home-route` 管理 checkout 定位和身份核验，`home-doctor` 管理诊断。`home-map` 继续管理项目之间的 `relations.md`。

## 2. 登记格式：v2 保存完整 remote，v1 保持读取兼容

### 2.1 v2 格式

保留现有 id、purpose、aliases、groups、localPath、intent、backgroundRef 等业务字段，将单个 `remote` 替换为：

```json
{
  "formatVersion": 2,
  "repos": [{
    "id": "project-a",
    "purpose": "项目 A 的业务说明",
    "localPath": "./project-a",
    "intent": "work",
    "primaryRemote": "origin",
    "remotes": [
      {
        "name": "origin",
        "urls": ["https://github.com/example/project-a.git"],
        "pushUrls": []
      },
      {
        "name": "internal",
        "urls": ["ssh://git@git.example.invalid/team/project-a.git"],
        "pushUrls": ["ssh://git@git.example.invalid/team/project-a.git"]
      }
    ]
  }]
}
```

- remote 名称在同一项目中唯一，保留 Git 中实际核实的名称，不把第二个 remote 猜成 upstream/mirror。
- `urls` 保存有序的 fetch 配置 URL；`pushUrls` 只保存显式配置的 push URL。没有显式 push URL 时是空数组，不合成重复配置。
- 保留多个 URL 的顺序与信息；不把不同主机的镜像归一成同一个地址，不将 SSH alias 当真实主机强行合并。
- 有 origin 时可推荐 origin；只有一个 remote 时可推荐它；多个 remote 且没有 origin 时必须由当前任务明确 primaryRemote。
- 真正没有 remote 的本地仓库使用 `remotes: []`、`primaryRemote: null`，仍核实其 Git root/worktree/commonDir。
- 不接受含秘密的 URL；错误信息不回显凭据。保存登记不配置远端、不执行 fetch/push、不修改项目 checkout。
- schema 与实际运行校验同步约束必填、未知字段、重复名称、非法版本和主 remote 存在性。

### 2.2 主身份核验

根据 [Git 官方 remote 配置语义](https://git-scm.com/docs/git-config#Documentation/git-config.txt-remoteltnamegturl)，同一 remote 多个 URL 时首 URL 用于 fetch；显式 push URL 另有用途。

因此 v2 路由按 `primaryRemote` 的**首个 fetch URL**核验主身份：

1. 只比较指定名称的主 remote，不在其他 remote 中寻找“任意一个相同地址”作为兜底。
2. 主 remote 不存在、首 fetch 身份不符时返回身份冲突，不能拿 fork 的 upstream/mirror 命中冒充主仓匹配。
3. 其他 remote 新增、删除、URL 顺序或配置变化返回可见的 `remoteDrift` 与 `registryMatches: false`；主身份正确时仍可定位，但提示由 setup 更新登记。
4. push URL 不用于替代 fetch 身份；地址无损保存与身份规范化比较分别处理。

### 2.3 兼容与迁移

- 继续读取 v1 `remote` 与裸相对路径，保留旧登记的身份核验语义；读取、定位、诊断不自动写回。
- 新登记采用 v2；将旧登记保存为 v2 前必须实际 inspect 对应 checkout，补齐所有可核实 remote。
- 不从旧字符串推断 remote 名称，不静默丢弃未核实远端；无法访问 checkout 时保留旧登记并报告待核实范围。
- 未知格式明确失败。无需引入第二份主身份字段或双写协议。

## 3. 路径合同

- 共享 `repos.json.localPath` 的新写入必须相对 **Home 根目录**：Home 内为 `./project-a`，同级/外部项目为 `../repos/project-a` 一类的引用。
- 保存时将合法裸相对路径规范成显式 `./` 或 `../`；继续读旧裸路径到相同目录。
- 共享登记的新写入拒绝机器绝对路径，提示转为相对路径或使用默认忽略的 `.agents/home/local.json`。
- 本机绝对路径覆盖继续支持，显式 `--checkout` 优先，其次 local.json，再次共享 localPath；不改变原有授权语义。
- Markdown 地图展示相对 Home 的原始可读路径，链接地址按实际导出文件所在目录正确换算。中文、空格、括号等必须生成可点击链接，而不是错误地从 `.agents/home/` 再解析一次 `./project-a`。

## 4. 地图改为按需查看与显式导出

### 4.1 正常读写

- 初始化、登记、路由、诊断直接使用 `repos.json`。
- `registry save` 只比较登记 revision 并原子保存 `repos.json`；不创建、不改写已有 `repos.md`，手写地图不阻塞登记保存。
- 保留现有排他锁、路径检查和写前基线比较；登记过期继续返回 `STALE_WRITE`。

### 4.2 可读地图

- `registry map --home <Home>` 默认从当前登记渲染到 stdout，零写入。
- `registry map --home <Home> --write --expect <registryRevision> --expect-map <mapRevision>` 显式导出 `.agents/home/repos.md`。
- 导出时才核对登记和地图双 revision；只能覆盖带自身生成标记的派生地图，保留手写地图保护。
- 地图只反映共享登记，不混入某台机器 local.json 的覆盖路径。
- 没有 repos.md 是合法状态；已经存在的生成地图可诊断过期，给出按需导出方法。默认导航指向 repos.json。
- 锁、并发改写、异常恢复沿用现有边界，不把普通文件替换声称为跨进程全局事务。

## 5. 文件与责任分工

| 范围 | 主要落点 |
| --- | --- |
| 格式与保存 | `skills/home/home-setup/assets/repos.schema.json`、`scripts/registry.mjs` |
| Git 检查与路由 | `skills/home/home-route/scripts/route.mjs` |
| 诊断 | `skills/home/home-doctor/scripts/doctor.mjs` |
| 使用方法与导航 | home-setup / home-route / home-doctor 的入口、参考、导航模板 |
| 安装和领域文档 | `scripts/persistence/home.md`、`docs/home/`、`docs/reference/persistence-roots.md` 及实际受影响引用 |
| 行为验证 | `tests/home-registry.test.mjs`、`home-route.test.mjs`、`home-doctor.test.mjs`、`home-cli-entry.test.mjs` 与相关安装导航场景 |
| 版本交付 | package.json、package-lock.json、CHANGELOG.md、所属 change 的任务与结论报告 |

不修改上游材料原文。若运行采用映射的 adaptation 需要描述本次差异，更新相应清单说明并保持来源 blob 身份。

## 6. 实施步骤

### H1：规格与来源固化

- 保存本 Issue 原始内容及重写后的计划快照到所属 change/source。
- 固定 v2 格式、主身份核验、路径新写入与地图导出合同。
- 建立 H1/H2/H3 任务及同名证据报告，未执行前标未验证。

### H2：实现登记、路由与地图行为

- 扩展 inspect 输出完整 remote 配置，保持只读。
- 实现 v1 兼容读取和 v2 校验/保存；规范共享相对路径。
- 路由核验主 remote，区分身份冲突与其他 remote 漂移。
- save 解耦地图；map 默认 stdout、显式 --write；doctor 允许缺地图。
- 同步使用示例、CLI 帮助和错误信息，不保留互相矛盾的步骤。

### H3：回归、文档及发布

- 用真实隔离 Git 仓库验证 origin+内部镜像、多 URL、fork、无 remote、worktree 和路径覆盖。
- 检查单技能安装后脚本资源完整性、导航预算、链接和打包行为。
- 与本次独立的 dev change 来源持久化调整一同发布补丁版本。
- 回读实际 main 提交、同提交跨平台 CI、npm 与 GitHub Release 的结果，再更新本 Issue 和 change 结论。

## 7. 验收矩阵

- [x] origin + internal/mirror 两个 remote 的名称、URL 和显式 push URL 保存后无损回读。
- [x] 多 fetch/push URL 顺序保留，首 fetch URL 决定主身份；push URL 不冒充主身份。
- [x] fork 的主 remote 错误但其他 remote 命中时仍拒绝；主 remote 不存在明确冲突。
- [x] 多 remote 无 origin 时有明确 primaryRemote 才能形成新登记；本地无 remote 正常支持。
- [x] 附加 remote 漂移可见，定位成功与登记已同步分别表达。
- [x] v1 单 remote 与裸相对路径仍正确读取；查询不自动迁移。
- [x] 新保存 Home 内 `./...` 与同级 `../...`；共享绝对路径拒绝，本机 local.json 覆盖正常。
- [x] 无 repos.md 也能完成初始化、保存、路由与诊断。
- [x] save 不创建/改写 repos.md，不因已有手写地图失败。
- [x] map 默认 stdout 零写入；显式导出具有正确的相对目录链接，中文/空格/括号可用。
- [x] 登记及导出各自的基线冲突、锁、手写文件保护和异常处理仍成立。
- [x] 现有知识、历史、关系、单包执行与安装行为未被破坏。
- [x] 同步技能、schema、模板、文档与必要来源映射，无默认强制地图的遗留执行指令。
- [x] main 提交完成，补丁版本发布完成，真实验证结果和环境限制已记录。

## 8. 验证与交付规则

本地先运行受影响的真实 Git/Node 行为测试和技能检查；完整仓库的既有门禁继续执行，不删减或绕过：

```text
npm run check:full
npm run check:statechart
npm run check:package
npm run check:upstream
```

发布由现有 main 版本变更工作流固定源码 SHA，完成 Ubuntu / Windows / macOS 验证后分发同一个 npm tarball 并创建对应 GitHub Release。若本地环境缺完整材料、浏览器或网络条件，明确区分本地已验证内容与远端 CI 实际结果。

制定计划时最新版本为 0.1.30，目标补丁版本为 **0.1.31**。发布前已重新核对远端，无并发版本冲突；最终正式发布为 v0.1.31，未覆盖已有版本或标签。

## 9. 可复查实现基线

- [登记 schema](https://github.com/NAMEWTA/skills-hub/blob/f7285ab799f76700b36c54293b84c9a0013c3ec9/skills/home/home-setup/assets/repos.schema.json)
- [登记与地图保存](https://github.com/NAMEWTA/skills-hub/blob/f7285ab799f76700b36c54293b84c9a0013c3ec9/skills/home/home-setup/scripts/registry.mjs)
- [checkout 检查与路由](https://github.com/NAMEWTA/skills-hub/blob/f7285ab799f76700b36c54293b84c9a0013c3ec9/skills/home/home-route/scripts/route.mjs)
- [Home 诊断](https://github.com/NAMEWTA/skills-hub/blob/f7285ab799f76700b36c54293b84c9a0013c3ec9/skills/home/home-doctor/scripts/doctor.mjs)
- [领域持久化合同](https://github.com/NAMEWTA/skills-hub/blob/f7285ab799f76700b36c54293b84c9a0013c3ec9/docs/reference/persistence-roots.md)
- [发布流程](https://github.com/NAMEWTA/skills-hub/blob/f7285ab799f76700b36c54293b84c9a0013c3ec9/.github/workflows/release.yml)


## 10. 实施与交付结果（2026-11-25）

**已完成实现、main 提交、全部门禁及正式补丁发布。**

- 实现提交：[8e58e53f2f3c76deec514d236a7bc4a763b2ca65](https://github.com/NAMEWTA/skills-hub/commit/8e58e53f2f3c76deec514d236a7bc4a763b2ca65)。
- 正式发布：[v0.1.31](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.31)；npm [@namewta/skills-hub@0.1.31](https://www.npmjs.com/package/@namewta/skills-hub/v/0.1.31)。GitHub 发布时间为 2026-11-25 17:58:20（Asia/Taipei，平台原始时间 `2026-11-25T09:58:20Z`）。
- 标签、Release target 与两个完整 CI 的源码 SHA 一致；Release 为 `draft=false`、`prerelease=false`，GitHub latest 回读为 v0.1.31。
- [独立三平台验证](https://github.com/NAMEWTA/skills-hub/actions/runs/45588940751)与[发布流水线](https://github.com/NAMEWTA/skills-hub/actions/runs/45588940638)均成功。
- 494 项完整测试：Linux/macOS 各 493 通过、0 失败、1 项 Windows 专属跳过；Windows 490 通过、0 失败、4 项 POSIX/Unix 条件跳过。三平台各完成 33 组捕获状态图回放和真实 tarball 消费验证（63 技能、1093 分发文件）。
- Linux 另通过 Archify 浏览器验证及真实 Claude Code 技能发现/读取（63 技能、121 资源、0 用户回合）。这不是模型推理验收，macOS 本轮为 Intel runner。
- 发布制品 SHA-256：`82cddaeb57ab63854a0fe7088a649edaf5535431fa174889579ac7c4b6559063`。同一 tarball 上传 npm 与 GitHub；公开 npm 包名/版本/完整性由发布任务核对后才公开 Release。
- 独立复核额外发现并修复 `url.*.insteadOf` 的身份绕行：原始 remote 配置仍完整保存，同时核验 Git 展开的实际首 fetch 目标。跨仓库改写拒绝，已知等价协议改写允许；未将本机展开检查冒称网络或 SSH 服务端身份验证。

来源及正式记录已经纳入 change 跟踪：

- [Home 实施计划与最终验收](https://github.com/NAMEWTA/skills-hub/tree/main/.agents/dev/changes/2026-11-25-home-registry-v2)
- [Dev 来源与正式资料持久化方案和验收](https://github.com/NAMEWTA/skills-hub/tree/main/.agents/dev/changes/2026-11-25-dev-change-source)
- [0.1.31 发布记录](https://github.com/NAMEWTA/skills-hub/blob/main/.agents/dev/deploy/npm/releases/0.1.31.md)

旧 v1 登记保持读取兼容，实际迁移需重新核实 checkout；本次未自动迁移用户 Home 或批量移动历史业务文件。
