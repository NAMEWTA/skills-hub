# T08-installation 验收

状态：Linux安装事务、专项与真实tarball检查通过；Windows/Claude宿主待远端CI。

63个所选技能各有唯一.agents/skills本体与相对.claude/skills目录符号链接。覆盖混选、unchanged补链、正确断链/错向冲突、父目录与本体保护、锁后重算、更新备份、注入链接失败回滚、搬迁和dry-run零写入；显式入口与交互共用事务。修复local.json忽略规则保留用户否定规则及rollback父路径再检查。

安装负责人专项115/115通过。npm run check:full最终472项，471通过、0失败、1环境跳过（容器不能创建Unix套接字）。真实npm tarball通过锁定依赖缓存的npm ci安装后核对63技能、1092文件与全部链接；一般check:package本地因离线缓存缺registry metadata受限，保持原门禁由CI正常联网运行。Windows必须是真实dir symlink，不能用Linux或注入结果冒充。

新增maintenance-only check:claude，CI独立安装官方SDK并启动真实Claude过程，发现和readFile链接资源；零用户回合，不冒称模型执行。此时尚未运行，待CI证据。
