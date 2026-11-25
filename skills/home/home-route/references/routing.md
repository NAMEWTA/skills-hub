# 路由与身份核查

## 输入与选择

读取 Home 的 `.agents/home/repos.json`；当前合同为 `formatVersion: 1`，完整写入校验归 `home-setup`。未知版本明确失败。精确 repo ID 优先于同名 alias，别名可同时命中多个项目，返回其 ID、用途和默认路径，让用户或已有上下文消解。分组必须显式请求，不将名称相似视为同组。

本机覆盖只接受：

```json
{"formatVersion":1,"paths":{"project-a":"/当前主机/项目 A"}}
```

它不能包含 remote、CLI、模型、默认配置或派遣状态，键必须是当前登记 ID。Home 根、资料父目录和登记/覆盖文件必须是普通本地路径，不跟随这些位置的 symlink/junction；项目入口别名另由实际 checkout 核查处理。显式 `--checkout` 是本次选择，不写回默认。相对路径均以明确 Home 根解析；接入前 `--inspect` 使用给定路径，最好使用绝对路径。

## 核对实际位置

1. 查看入口路径和 `realpath`，核实 Git top-level、absolute git-dir、common-dir。目录名或 symlink 名称不是身份；junction 和 symlink 指向别处时依据真实目标继续核对，不静默沿用旧结论。
2. 比较登记 remote 与实际配置的 origin；没有 origin 时，只接受所有配置 remote 都归一到同一登记身份。fork 的 parent 命中不能替代 origin，不同身份或多个来源有歧义时交 setup 核实，不能自动选择刚好匹配的 remote。保留 host、仓库路径与非标准端口/协议。工具只对 `github.com` 默认端口的 `git` 用户应用已知 SSH/HTTP(S) 等价形式；其他 SSH 服务器保留用户名、绝对路径与用户目录相对路径的差别，例如 `alice@host:repo.git` 不等于 `bob@host:repo.git`，也不等于 `ssh://alice@host/repo.git`。未知服务的跨协议等价关系交 owner 核实并统一登记形式，不能猜测合并。路径大小写不折叠，SSH alias 不展开，不用短仓名合并不同 host、owner 或 fork。
3. URL 里有认证信息、查询参数或片段时拒绝输出或保存，交项目 owner 修复；不泄露 Git 错误中的带秘密 URL。非网络 remote 仅做准确字符串身份比较，不假装解析了外部服务。
4. 本地独有仓库使用空 remote；实际存在 remote 时要求先核实登记。为无 remote 仓库指定另一 checkout 时，必须证明与登记位置有同一 Git common directory，不能把另一个初始化仓库当 worktree。
5. 记录 HEAD、当前分支/分离状态和 dirty。无提交的仓库 HEAD 可为空，未提交变更保留；只读定位不 fetch、不切分支、不修改索引。工作树入口可能是 `.git` 文件，不能只找 `.git/` 目录。
6. 确认 `AGENTS.md`、`.agents/` 和 `.agents/skills/` 的入口存在性；存在不证明兼容、已加载或资料已读取。

工具在当前执行主机读取 Git 元数据；`executionHost` 与 `observedAt` 表示这次观察。用户要求远端时，通过已经授权且真实可用的连接，在指定主机执行同等核查；没有连接就标未验证。不要创建新的远端适配服务、同步器或全局路径清单。

登记默认路径当前不可达，但用户给出实际 checkout 且 remote 身份相符时，可解析显式目标并保留 `registeredPath` 供修复；它不自动修复默认路径。对本地独有仓库无法检查原 common directory 时不能证明两者同仓。

## 项目资料指针

使用 `repo ID + 相对实际 checkout 的路径 + 必要标题/符号`。当前资料按本次 checkout 解析；历史证据另附 revision 和观察时间，旧固定 commit 链接不能证明当前行为。

`--ref` 只确认目标存在和真实路径是否仍在 checkout 内，不打开正文；绝对路径、父目录跳转和经 symlink 逃出项目的引用失败。需要用户已有仓外权威资料时保留明确外部指针，由实际 owner 核实，不伪装为项目内引用。

工作树不会自动复制被忽略的技能。某个 clone 有技能不意味着本次 worktree 有；项目 Agent 必须报告在实际目录读到的指导和能力。Home 不将自己的技能包搬到项目，也不依靠附加目录、原生 import、shell 切目录或父上下文继承代替项目 CLI。

## 结果和失败处理

| 结果 | 后续 |
| --- | --- |
| resolved | 返回实际 checkout 和身份依据；调用方按任务决定是否派遣 |
| ambiguous | 返回候选，不进行项目读取或执行 |
| not_found | 核实名称或由 home-setup 登记，不遍历磁盘猜仓库 |
| IDENTITY_CONFLICT | 保留登记与真实结果的差异，暂停该目标；不改 remote 或路径 |
| PATH_UNAVAILABLE / GIT_CHECK_FAILED | 说明实际主机、检查和缺项；未验证不算通过 |
| INVALID_LOCAL / REGISTRY_VERSION | 交 home-setup 修复 owner，不猜测字段含义 |
| REFERENCE_ESCAPE | 保留原指针，说明真实边界；不跟随到其他项目读取 |

JSON 输出中 `homeRoot` 是协调入口，`actualCheckout` 是项目工作根；它们不可互换。`pathSource` 说明本次路径来自显式选择、本机覆盖还是共享登记。所有输出只证明本次范围，实际任务开始前已有明显环境变化时重新核查。
