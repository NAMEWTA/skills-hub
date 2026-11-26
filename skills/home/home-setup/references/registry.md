# 仓库登记与 Home 入口

## 目录

- 识别现有资料
- 登记合同
- 原地接入和可恢复编辑
- 按需查看与显式导出地图
- 本机路径与移址
- 根导航与交付

## 识别现有资料

Home 是用户选定的工作入口仓库，可以是现有 Git 仓库。默认推荐 Home 与项目平级；已有内嵌布局也可使用。先读取本次必要的根指令和已有地图，区分用户事实、外部输入与项目执行记录。已有权威文档保持原位置；只在有实际业务内容时建目录。

安装器只负责技能包和最小领域导航。执行本方法时才按用户请求建立登记或配置；不要把安装成功当成 Home 已接入。

## 登记合同

真源是 `.agents/home/repos.json`。初始化、登记、路由和校验直接读取它，不依赖地图文件。可读地图按需生成，显式导出时写入 `.agents/home/repos.md`。schema 见 [repos.schema.json](../assets/repos.schema.json)。

| 字段 | 规则 |
| --- | --- |
| formatVersion | 新写入为 2；继续读取旧 v1，未知版本失败 |
| id | 稳定且唯一的小写字母/数字/连字符；名称变化不自动换身份 |
| purpose | 一句话说明项目定位，不粘贴内部文档 |
| aliases | 用户实际称呼，可省略；跨仓重名可以存在，路由返回候选 |
| groups | 可选业务分组，分组不证明依赖 |
| remotes | 全部已核实 remote，逐项保存 `name`、按配置顺序的 `urls` 和显式 `pushUrls`；名称唯一，不折叠镜像或上游 |
| primaryRemote | 明确的主 remote 名称，以其 `urls[0]` 核验 fetch 身份；本地独有仓库用 `remotes: []` 和 `primaryRemote: null` |
| localPath | Home 根相对的默认 clone 位置，例如 `./project-a`、`../repos/project-a`；本机绝对路径进入 local.json |
| intent | work 或 reference，仅表示用途，不是 OS 权限或修改授权 |
| backgroundRef | 可选 Home 内相对路径；背景页由 home-knowledge 维护，不要求建页 |

示例只说明格式，不代表用户实际项目：

```json
{
  "formatVersion": 2,
  "repos": [
    {
      "id": "project-a",
      "purpose": "提供某项业务能力",
      "aliases": ["项目 A"],
      "groups": ["产品组"],
      "remotes": [
        {"name": "origin", "urls": ["https://git.example.invalid/team/project-a.git"], "pushUrls": []},
        {"name": "mirror", "urls": ["ssh://git@mirror.example.invalid/team/project-a.git"], "pushUrls": []}
      ],
      "primaryRemote": "origin",
      "localPath": "../项目 A",
      "intent": "work"
    }
  ]
}
```

保留 URL 原值及顺序。Git 对一个 remote 使用首个 `url` 抓取；未设置 `pushurl` 时，推送使用全部 `url`。登记中的 `pushUrls: []` 表示没有显式配置，不把这种隐式回退复制成另一份数据。push URL 或其他 remote 命中不能替代主 fetch 身份。route 另核对 Git 应用 `insteadOf` 后的实际首 fetch 目标；跨身份重写先交项目 owner 核实并明确配置，不把表面的 URL 相同当作身份已验证。

接入时优先建议已核实的 `origin`，只有一个 remote 时可建议该名称；多个 remote 且没有 origin 时，依据已有明确要求选主 remote，缺少依据再询问。名称和 URL 都来自现场观察，不按平台名、短仓名或旧单 URL 猜造。

旧 v1 的 `remote` 与裸相对路径继续读取，不触发隐式改写。需要修改该登记时先实际核查各项 remote，再形成完整 v2 候选。旧远端不可核实时保留旧文件，报告未迁移范围。保存工具拒绝 v1 候选，不自动将单 URL 命名为 origin。

不把默认 CLI、模型、派遣方式、凭据、PID 或运行状态放进登记。`AGENTS.md`、`.agents/`、`.agents/skills/` 是统一入口，不在每条登记维护宿主配置清单。

## 原地接入和可恢复编辑

1. 选定准确 Home 根和项目范围。按名称调用 `home-route`：未登记项目使用其 `--inspect` 方法，已登记项目按 ID 解析。记录实际路径、Git root、remote、worktree/HEAD/dirty 和观测位置；工具没有读取项目知识正文。
2. 核对新身份与已有登记。host、owner、fork 或 SSH alias 不同不凭短名合并；同一仓库的另一个 worktree 通常作为实际 checkout 选择，不另造第二 repo ID。remote 为空的项目要核实确为本地独有；路径存在但身份不同立即报告冲突。
3. 读取当前登记，取得 `registryRevision`。inspect 同时报告可选地图状态及 `mapRevision`，后者仅显式导出时使用：

   ```sh
   node <本技能目录>/scripts/registry.mjs inspect --home "<Home 根>"
   ```

4. 从读到的完整登记和现场 `remotes` 生成 v2 候选，只改授权字段。共享路径明确写成 `./` 或 `../`，含中文和空格的目录保留原名。保存时会规范化裸相对写法，绝对路径和盘符相对路径拒绝写入共享登记。候选文件由调用方放在其已有工作位置，不要求创建 `temp/home/`。校验结构：

   ```sh
   node <本技能目录>/scripts/registry.mjs validate --input "<候选登记.json>"
   ```

5. 核对差异、实际身份依据和未解决入链，再用刚读取的登记 revision 保存：

   ```sh
   node <本技能目录>/scripts/registry.mjs save --home "<Home 根>" --input "<候选登记.json>" --expect "<registryRevision>"
   ```

   首次不存在时 revision 为 `absent`，不能对已有文件使用它。校验和保存工具不探测 Git，因此返回 `identityVerified: false`；身份核查结果单独引用 route 证据。

6. 回读登记，再按必要范围调用 route。保存只写 `repos.json`，已有地图保持原样。检查 `remoteDrift` 和 `registryMatches`；附加 remote 变化时，已定位与登记已同步分开报告。不要因为 schema 合法就宣称路径、Git 身份或项目资料已验证。

工具使用排他写锁和原内容比较。保存登记只比较登记基线；显式导出地图同时比较登记与地图基线，取得锁后重新检查真源没有变化。写入前检查父目录与文件类型，原子替换单个文件；普通写入异常恢复本次已应用内容，不覆盖期间其他写者的修改。仍须遵守单一写者约定：非协作程序在最终比较与替换之间的改写不具备操作系统级 CAS 保证。进程中断可能留下写锁或旧地图；保留现场、核实原操作已结束，以完整 `repos.json` 为真源恢复，需要导出时再生成地图。不得因锁存在就自动删锁或并发重写。

`STALE_WRITE` 表示基线变化：重新读取、合并用户新内容并验证，不自动重试旧候选。显式导出时的 `UNMANAGED_MAP` 表示手写地图占用目标：按已授权范围先保留其权威位置并接入，不覆盖自定义文档。`RECOVERY_REQUIRED` 要先核对受影响文件与来源，不能报告保存完成。

## 按需查看与显式导出地图

需要查看项目清单时直接从当前登记生成 Markdown，输出到终端，不写文件：

```sh
node <本技能目录>/scripts/registry.mjs map --home "<Home 根>"
```

用户明确需要落盘地图时，先 inspect 取得登记和地图两个 revision，再导出：

```sh
node <本技能目录>/scripts/registry.mjs map --home "<Home 根>" --write --expect "<registryRevision>" --expect-map "<mapRevision>"
```

地图显示路径及 remote 名称和地址。目录链接以 `.agents/home/` 为基准计算，只使用登记默认位置，不掺入本机路径覆盖。工具只覆盖带自身生成标记的地图。手写地图、符号链接或不可读的导出目标保持原样，普通登记保存不受这些可选目标影响。已有旧地图不自动删除；需要保留时显式重建，移除时先检查用户导航入链并沿用已有授权。

## 本机路径与移址

`.agents/home/local.json` 默认忽略，格式见 [local.schema.json](../assets/local.schema.json)：

```json
{"formatVersion":1,"paths":{"project-a":"/本机位置/项目 A"}}
```

只允许已登记 ID 的路径；不能覆盖 remotes、primaryRemote、用户默认、技能或任何权限。用 `validate --input <repos.json> --local <local.json>` 检查，再在实际主机上用 route 核实。写入前回读基线、保留可恢复内容，变更后确认 Git 实际忽略状态；ignore 规则不会取消已跟踪文件。

显式 `--checkout` 优先于本机路径覆盖，覆盖优先于登记路径。worktree 中忽略的技能不自动复制；项目 Agent 检查该 checkout 实际存在的入口。远端路径要在用户指定且可达的主机执行核查，不能用本地同名目录冒充。

移址或解除登记只改变明确的登记范围，不删除仓库、worktree、知识或历史。搜索 Home 内对原 ID、路径和背景页的引用，分别交其 owner 修复；历史资料保留当时身份与时间，不改写成“当时已经在新位置”。解除登记前说明当前依赖与入链，无法解决的引用保持可见。

## 根导航与交付

安装和日常操作按 Home 根下的 `./.agents/home/AGENTS.md` 查找领域资料。完整初始化 Home 或用户单独要求补根导航时，在根 `AGENTS.md` 合并[短入口](../assets/home-navigation.md)。这一步属于已授权的初始化，不为同一目标重复确认。普通安装、升级、只登记、查询或只改偏好不修改根指令。

1. 读取根文件及实际 Home 入口，检查文件类型、现有内容和相对链接。已有等价指针直接复用；根文件不存在时按短入口建立，已有规则保留原位。路径异常、内容冲突或无法读取时报告具体位置，不沿链接覆盖其他文件。
2. 以根文件为基准合并最小指针，写前复核读取基线，变化时重读合并。写后回读正文与链接，确认未重复插入、未覆盖用户规则。根文件只说明进入哪个领域入口，不复制九技能路由、项目知识、SOUL 或执行默认。
3. Home 入口的写法和渐进式披露由 `home-knowledge` 维护。setup 只完成本次初始化与补缺；安装机制维护标记基础区，知识方法维护区外语义和资料指针。现有短入口足以完成普通接入，缺少知识技能不妨碍使用本包方法；需要更改入口语义时才交可用的知识方法，缺项如实报告，不自动安装。
4. 用户要求当前 Agent CLI 在 Home 可用时，当前运行宿主就是已选环境。按其实际版本、公开发现规则和可核对读取结果检查入口；文件存在不等于已经加载。既有入口已经生效时直接复用，不重新询问工具品牌。
5. 默认使用根 `AGENTS.md`。所选宿主确需其他入口且本次已授权接入时，在它实际支持的入口使用最小指针或官方导入机制，保留已有正文。新增专属文件是本机派生适配，不扩大 Home Git 白名单、不 force-add，也不宣称随 Home 版本化。可在既有 environment 文档记录非秘密的接入方法与实际验证等级；换机后按实际选择重新核验，并按已有授权重建必要薄入口。不默认生成各厂商文件、全局设置或 hooks。缺少实际能力时报告具体缺口与未验证部分，继续独立可完成的工作。

相对链接按包含它的文档解析。Home 的规则和资料不会因为根指针而覆盖目标项目的有效指令；项目 Agent 仍在当地读取对应知识与技能。

交付登记变更、身份与路径依据、保留的既有资料、未知或冲突项。请求地图时交付本次输出，显式导出时另给文件位置。只查询或验证时零写入；只登记时不安装 CLI、不创建项目 hooks、不启动 Agent。
