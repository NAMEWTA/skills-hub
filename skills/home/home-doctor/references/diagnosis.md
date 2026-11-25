# 诊断与修复路由

## 有界只读检查

从用户实际问题选择范围，读取有关 Home 记录。工具只递归 Home 自己的 `.agents/home/` 普通 Markdown 做结构链接检查，不跟随数据目录 symlink，不读取链接指向的项目正文。超过单文件 1 MiB 的资料报告未检查。一次结构遍历最多读取 2000 个 Markdown、总计 8 MiB，深度 10、目录 1000 个；达到预算时返回 complete: false 与具体未覆盖项，不把截断后没看到问题当没有问题。

对 Home 外的 Markdown 指针只记录为外部入口，不能用文件存在或摘要替代项目证据。项目路径/身份按 `home-route` 取得，只检查登记范围，不遍历磁盘发现项目。技术事实或当前代码关系由项目当地 Agent 返回。

未初始化 Home 业务资料可以是正常安装状态。缺少未选用的派遣技能、可选文档、dev domain 或另一 CLI 不自动构成故障；只有当前任务明确需要的能力缺失才报告阻塞。

## 检查项与 owner

| 问题 | 核查方式 | 修复 owner |
| --- | --- | --- |
| repos JSON、未知版本、重复 ID、非法 local 覆盖 | 结构报告后由 setup 完整 validate | home-setup |
| repos 地图缺失/来源 revision 不同 | 结构脚本读生成标记，setup inspect 比较完整派生内容 | home-setup |
| 默认路径、真实 checkout、remote、worktree 不符 | route 的实际只读 Git 核查 | home-setup 维护登记，home-route 提供解析依据 |
| 根导航缺项、配置引用失效 | 核对原 owner 与用户自定义内容 | home-setup |
| notes、inbox、exclusions 的断链 | 只报路径与影响，不判结论真假 | home-knowledge |
| history/归档的断链或接续线索缺失 | 只报结构；时间、去重与语义回查交 owner | home-history |
| relations 证据引用不可达 | 报结构位置；当前关系由项目取得新证据 | home-map |
| coordination 引用缺失或责任入口不清 | 核对当前目标与直接负责人入口 | home-workflow |
| 本次必要技能本体/发现别名异常 | 检查 canonical、lstat/readlink/realpath 和同仓目标 | 用户所选安装方法 |
| 投递、就绪、恢复、回收不明 | 使用原派遣记录与原方法 | 实际选用的当地派遣技能 |

生成索引和地图是派生资料，不通过手写第二套权威内容“修好”。索引缺失时原正文仍可查询；重建不刷新事实核查时间，也不从 archive 自动恢复当前规则。

## 链接与同仓技能检查

`--require-skill` 只接受当前明确需要的准确技能名，检查 Home 的 `.agents/skills/<name>/SKILL.md` 与 `.claude/skills/<name>`。标准本体是同仓普通目录，Claude 别名是逐技能目录 symlink，真实目标必须等于该本体。

同名普通目录/文件、错误链接、错向断链或链接父目录都是具体冲突，保留原内容。不要用 `--replace` 绕过链接保护，不创建整目录 symlink，不把链接改到另一仓库或 npm 缓存。升级、补链或删除依所选安装方法的原有事务处理；doctor 不重复实现安装器。

用户要验证实际工具发现时，让实际选定的 CLI 执行最小读取并记录来源；单纯 realpath 相等只证明文件系统关系。Home 只检查本次实际需要的能力，不维护固定的全 CLI 测试矩阵。

## 修复与复验

先给出具体文件/ID、观察、影响和建议 owner。默认只诊断；当前任务已授权修复时，直接把基线、原件位置和范围交 owner，保留已有决定，不重复征求相同许可。修改由 owner 先读、合并、写后回读；不批量删除历史或自动迁移知识。

对未取得新项目证据的问题保持待核实，不能把文件时间或生成时间当事实验证时间。只复验受影响项，并报告已修复、仍受阻和未检查范围。不得把诊断脚本退出 0 或没有结构错误写成项目功能、Agent 生命周期或所有知识均健康。
