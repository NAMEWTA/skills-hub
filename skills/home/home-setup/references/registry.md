# 仓库登记与 Home 入口

## 目录

- 识别现有资料
- 登记合同
- 原地接入和可恢复编辑
- 本机路径与移址
- 薄导航和交付

## 识别现有资料

Home 是用户选定的工作入口仓库，可以是现有 Git 仓库。默认推荐 Home 与项目平级；已有内嵌布局也可使用。先读取本次必要的根指令和已有地图，区分用户事实、外部输入与项目执行记录。已有权威文档保持原位置；只在有实际业务内容时建目录。

安装器只负责技能包和最小领域导航。执行本方法时才按用户请求建立登记或配置；不要把安装成功当成 Home 已接入。

## 登记合同

真源是 `.agents/home/repos.json`，派生地图是 `.agents/home/repos.md`。schema 见 [repos.schema.json](../assets/repos.schema.json)。

| 字段 | 规则 |
| --- | --- |
| formatVersion | 当前为 1，未知版本失败，不猜测迁移 |
| id | 稳定且唯一的小写字母/数字/连字符；名称变化不自动换身份 |
| purpose | 一句话说明项目定位，不粘贴内部文档 |
| aliases | 用户实际称呼，可省略；跨仓重名可以存在，路由返回候选 |
| groups | 可选业务分组，分组不证明依赖 |
| remote | 核实的 Git 身份，保留真实 host/owner/repo；本地独有仓库明确写空字符串 |
| localPath | 默认 clone 位置；相对路径以 Home 根解析 |
| intent | work 或 reference，仅表示用途，不是 OS 权限或修改授权 |
| backgroundRef | 可选 Home 内相对路径；背景页由 home-knowledge 维护，不要求建页 |

示例只说明格式，不代表用户实际项目：

```json
{
  "formatVersion": 1,
  "repos": [
    {
      "id": "project-a",
      "purpose": "提供某项业务能力",
      "aliases": ["项目 A"],
      "groups": ["产品组"],
      "remote": "https://git.example.invalid/team/project-a.git",
      "localPath": "../项目 A",
      "intent": "work"
    }
  ]
}
```

不把默认 CLI、模型、派遣方式、凭据、PID 或运行状态放进登记。`AGENTS.md`、`.agents/`、`.agents/skills/` 是统一入口，不在每条登记维护宿主配置清单。

## 原地接入和可恢复编辑

1. 选定准确 Home 根和项目范围。按名称调用 `home-route`：未登记项目使用其 `--inspect` 方法，已登记项目按 ID 解析。记录实际路径、Git root、remote、worktree/HEAD/dirty 和观测位置；工具没有读取项目知识正文。
2. 核对新身份与已有登记。host、owner、fork 或 SSH alias 不同不凭短名合并；同一仓库的另一个 worktree 通常作为实际 checkout 选择，不另造第二 repo ID。remote 为空的项目要核实确为本地独有；路径存在但身份不同立即报告冲突。
3. 读取当前登记与地图，取得两个 revision：

   ```sh
   node <本技能目录>/scripts/registry.mjs inspect --home "<Home 根>"
   ```

4. 从读到的完整登记生成本次候选，只改授权字段。候选文件由调用方放在其已有工作位置，不要求创建 `temp/home/`。校验结构：

   ```sh
   node <本技能目录>/scripts/registry.mjs validate --input "<候选登记.json>"
   ```

5. 核对差异、实际身份依据和未解决入链，再用刚读取的两个 revision 保存：

   ```sh
   node <本技能目录>/scripts/registry.mjs save --home "<Home 根>" --input "<候选登记.json>" --expect "<registryRevision>" --expect-map "<mapRevision>"
   ```

   首次不存在时 revision 为 `absent`，不能对已有文件使用它。校验和保存工具不探测 Git，因此返回 `identityVerified: false`；身份核查结果单独引用 route 证据。

6. 回读登记和地图，再按必要范围调用 route。不要因为 schema 合法就宣称路径、Git 身份或项目资料已验证。

工具使用排他写锁和原内容比较，取得锁后同时重验登记与地图基线；仅重建地图也检查登记真源没有变化。写入前检查父目录与文件类型，原子替换单个文件；普通写入异常恢复本次已应用内容，不覆盖期间其他写者的修改。仍须遵守单一写者约定：非协作程序在最终比较与替换之间的改写不具备操作系统级 CAS 保证。进程中断可能留下写锁或旧地图；保留现场、核实原操作已结束，以完整 `repos.json` 为真源恢复，再生成地图。不得因锁存在就自动删锁或并发重写。

`STALE_WRITE` 表示基线变化：重新读取、合并用户新内容并验证，不自动重试旧候选。`UNMANAGED_MAP` 表示手写地图占用目标：按已授权范围先保留其权威位置并接入，不覆盖自定义文档。`RECOVERY_REQUIRED` 要先核对受影响文件与来源，不能报告保存完成。

只重建地图时：

```sh
node <本技能目录>/scripts/registry.mjs map --home "<Home 根>" --expect "<registryRevision>" --expect-map "<mapRevision>"
```

地图只使用登记默认位置，不掺入某台机器的路径覆盖。工具只覆盖带自身生成标记的地图；其他资料不动。

## 本机路径与移址

`.agents/home/local.json` 默认忽略，格式见 [local.schema.json](../assets/local.schema.json)：

```json
{"formatVersion":1,"paths":{"project-a":"/本机位置/项目 A"}}
```

只允许已登记 ID 的路径；不能覆盖 remote、用户默认、技能或任何权限。用 `validate --input <repos.json> --local <local.json>` 检查，再在实际主机上用 route 核实。写入前回读基线、保留可恢复内容，变更后确认 Git 实际忽略状态；ignore 规则不会取消已跟踪文件。

显式 `--checkout` 优先于本机路径覆盖，覆盖优先于登记路径。worktree 中忽略的技能不自动复制；项目 Agent 检查该 checkout 实际存在的入口。远端路径要在用户指定且可达的主机执行核查，不能用本地同名目录冒充。

移址或解除登记只改变明确的登记范围，不删除仓库、worktree、知识或历史。搜索 Home 内对原 ID、路径和背景页的引用，分别交其 owner 修复；历史资料保留当时身份与时间，不改写成“当时已经在新位置”。解除登记前说明当前依赖与入链，无法解决的引用保持可见。

## 薄导航和交付

根 `AGENTS.md` 只合并用户同意的薄导航，参考 [导航片段](../assets/home-navigation.md)。先检查是否已有等价入口；保留全部自定义正文和规则，不用模板覆盖文件。安装器不写这个根文件。

交付登记变更、地图位置、身份与路径依据、保留的既有资料、未知或冲突项。只查询或验证时零写入；只登记时不安装 CLI、不创建项目 hooks、不启动 Agent。
