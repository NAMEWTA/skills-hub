# T02-routing 验收

状态：实现与隔离真实 Git 检查通过。

registry/route/doctor 自动化验证普通目录和文件型 worktree、中文空格路径、冲突、锁内修订、当前 cwd/identity、只读诊断和检索预算。独立审查发现 SSH 用户命名空间误合并，已修复：未知 SSH 保留 user 与 absolute/home-relative；仅 github.com/git/default-port 适用已知跨协议等价。新增 alice/bob 真实 checkout 反例。

node --test tests/home-route.test.mjs tests/home-knowledge.test.mjs tests/home-history.test.mjs：47/47通过，无跳过。Home真实场景已用安装目录 registry/route 保存两项目登记并解析；未扫描项目内部资料。
