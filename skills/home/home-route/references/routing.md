# 路由与身份核查

## 输入与选择

读取 Home 的 `.agents/home/repos.json`；当前新登记为 `formatVersion: 2`，继续读取旧 v1；完整写入校验归 `home-setup`。未知版本明确失败。精确 repo ID 优先于同名 alias，别名可同时命中多个项目，返回其 ID、用途和默认路径，让用户或已有上下文消解。分组必须显式请求，不将名称相似视为同组。

本机覆盖只接受：

```json
{"formatVersion":1,"paths":{"project-a":"/当前主机/项目 A"}}
```

它不能包含 remote、CLI、模型、默认配置或派遣状态，键必须是当前登记 ID。Home 根、资料父目录和登记/覆盖文件必须是普通本地路径，不跟随这些位置的 symlink/junction；项目入口别名另由实际 checkout 核查处理。显式 `--checkout` 是本次选择，不写回默认。相对路径均以明确 Home 根解析；v2 共享路径明确写成 `./` 或 `../`，旧 v1 的裸相对路径仍按原基准读取，不自动改写。接入前 `--inspect` 使用给定路径，最好使用绝对路径。

## 核对实际位置

1. 查看入口路径和 `realpath`，核实 Git top-level、absolute git-dir、common-dir。目录名或 symlink 名称不是身份；junction 和 symlink 指向别处时依据真实目标继续核对，不静默沿用旧结论。
2. v2 按登记的 `primaryRemote` 名称找到实际 remote，以登记 `urls[0]` 比较 Git `remote get-url` 返回的实际首 fetch 身份。该名称缺失或实际身份不符立即报告冲突；mirror、parent、push URL 或后续 URL 命中都不能替代。其余 URL 可以指向已核实的镜像，不要求不同主机地址归一成一个值。旧 v1 继续比较 origin；没有 origin 时只接受全部配置的 fetch URL 归一到同一登记身份，同时核对实际首 fetch 目标，不能从不同 remote 中挑一个刚好匹配的值。保留 host、仓库路径与非标准端口/协议。工具只对 `github.com` 默认端口的 `git` 用户应用已知 SSH/HTTP(S) 等价形式；其他 SSH 服务器保留用户名、绝对路径与用户目录相对路径的差别，例如 `alice@host:repo.git` 不等于 `bob@host:repo.git`，也不等于 `ssh://alice@host/repo.git`。未知服务的跨协议等价关系交 owner 核实并统一登记形式，不能猜测合并。路径大小写不折叠，SSH alias 不展开，不用短仓名合并不同 host、owner 或 fork。
3. URL 里有认证信息、查询参数或片段时拒绝输出或保存，交项目 owner 修复；不泄露 Git 错误中的带秘密 URL。非网络 remote 仅做准确字符串身份比较，不假装解析了外部服务。
4. 本地独有仓库在 v2 使用空 remotes 和 `primaryRemote: null`，旧 v1 使用空 remote；实际存在 remote 时要求先核实登记。为无 remote 仓库指定另一 checkout 时，必须证明与登记位置有同一 Git common directory，不能把另一个初始化仓库当 worktree。
5. 记录 HEAD、当前分支/分离状态和 dirty。无提交的仓库 HEAD 可为空，未提交变更保留；只读定位不 fetch、不切分支、不修改索引。工作树入口可能是 `.git` 文件，不能只找 `.git/` 目录。
6. 确认 `AGENTS.md`、`.agents/` 和 `.agents/skills/` 的入口存在性；存在不证明兼容、已加载或资料已读取。

`--inspect` 返回每个 remote 的实际 `name`、完整有序 `urls` 和显式 `pushUrls`，不展开推送回退值。空 URL 配置按 Git 的清空列表语义处理。`effectiveFetchUrls` 单独返回 Git 应用 `url.*.insteadOf` 后的首 fetch 目标，不写入登记形成另一份身份真源。已知等价协议改写可以通过；跨 host、owner 或 fork 的改写报告冲突，由项目 owner 明确配置真实目标后再核查。改写目标含凭据时同样拒绝输出。工具不联网验证服务器重定向或 SSH 服务端实际映射，这些仍需真实连接的独立证据。

`suggestedPrimaryRemote` 优先建议有 fetch URL 的 origin，只有一个 remote 时建议该名称，其余情况为 null，由已有用户要求决定。建议值不写回登记。

v2 路由分别报告身份与登记同步状态。主 fetch 身份相符可以返回 `resolved`；remote 新增、删除，或者 urls、pushUrls 内容及顺序变化，均写入 `remoteDrift` 并令 `registryMatches: false`。这些差异交 setup 核实后更新，不能声称全部登记仍同步。旧 v1 只拥有单身份事实，返回 `registryMatches: null` 与 `registryCoverage: legacy-primary-only`，不虚构完整远端快照。

工具在当前执行主机读取 Git 元数据；`executionHost` 与 `observedAt` 表示这次观察。用户要求远端时，通过已经授权且真实可用的连接，在指定主机执行同等核查；没有连接就标未验证。不要创建新的远端适配服务、同步器或全局路径清单。

登记默认路径当前不可达，但用户给出实际 checkout 且 remote 身份相符时，可解析显式目标并保留 `registeredPath` 供修复；它不自动修复默认路径。对本地独有仓库无法检查原 common directory 时不能证明两者同仓。

## 项目资料指针

使用 `repo ID + 相对实际 checkout 的路径 + 必要标题/符号`。当前资料按本次 checkout 解析；历史证据另附 revision 和观察时间，旧固定 commit 链接不能证明当前行为。

`--ref` 只确认目标存在和真实路径是否仍在 checkout 内，不打开正文；绝对路径、父目录跳转和经 symlink 逃出项目的引用失败。需要用户已有仓外权威资料时保留明确外部指针，由实际 owner 核实，不伪装为项目内引用。

工作树不会自动复制被忽略的技能。某个 clone 有技能不意味着本次 worktree 有；项目 Agent 必须报告在实际目录读到的指导和能力。Home 不将自己的技能包搬到项目，也不依靠附加目录、原生 import、shell 切目录或父上下文继承代替项目 CLI。

## 结果和失败处理

| 结果 | 后续 |
| --- | --- |
| resolved | 返回实际 checkout 和主身份依据；检查 remoteDrift，再按当前任务决定是否派遣 |
| ambiguous | 返回候选，不进行项目读取或执行 |
| not_found | 核实名称或由 home-setup 登记，不遍历磁盘猜仓库 |
| IDENTITY_CONFLICT | 保留登记与真实结果的差异，暂停该目标；不改 remote 或路径 |
| PATH_UNAVAILABLE / GIT_CHECK_FAILED | 说明实际主机、检查和缺项；未验证不算通过 |
| INVALID_LOCAL / REGISTRY_VERSION | 交 home-setup 修复 owner，不猜测字段含义 |
| REFERENCE_ESCAPE | 保留原指针，说明真实边界；不跟随到其他项目读取 |

JSON 输出中 `homeRoot` 是协调入口，`actualCheckout` 是项目工作根；它们不可互换。`pathSource` 说明本次路径来自显式选择、本机覆盖还是共享登记。所有输出只证明本次范围，实际任务开始前已有明显环境变化时重新核查。
