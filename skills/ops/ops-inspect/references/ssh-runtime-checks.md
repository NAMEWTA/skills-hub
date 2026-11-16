# SSH 与现有运行单元检查

这些是操作入口示例，不是默认要执行的命令清单。由 ops-execute 通过真实已有工具执行，使用已核验的 SSH alias、unit、Compose 项目名和配置文件；不直接拼接不可信日志或用户字符串为远端 shell 命令。远端无需安装本技能或 AI CLI。

## 建立正确的连接语境

先确认 SSH 入口与稳定资源身份的对应关系、连接用户名、跳板和已有 host key 校验。不要关闭 host key 检查、自动提权或搜索额外凭据。别名或 IP 可变化，不能单独作为历史身份。

记录实际控制端目录与远端入口。只查询当前用户已授权目标；认证失败保留缺口，不尝试绕过权限。已有会话的连接成功不保证后续重启后仍为同一资源。

## 主机层

| 目的 | 已有命令入口示例 | 解读限制 |
| --- | --- | --- |
| 采集时间与运行时长 | date -u；uptime | 对齐时区；负载需结合 CPU 数和持续窗口 |
| 内存与换页 | free -b；vmstat 1 3 | 可用内存与文件缓存分开；三次采样不证明长期趋势 |
| 空间与 inode | df -P；df -Pi | 磁盘空间正常也可能 inode 耗尽；只看相关挂载 |
| 运行压力 | 读取 /proc/pressure/cpu、memory、io（存在时） | 平台不支持时报告缺失；不要安装新代理来补数据 |
| 已失败单元 | systemctl --failed --no-pager | 只列当前可见失败，不代表所有项目状态 |
| 资源时间线 | 既有指标平台的指定主机和窗口 | 保留标签、聚合口径、数据延迟与查询是否完整 |

读取大目录容量前先确认路径、文件系统和查询成本；目录递归遍历可能影响磁盘，不能把无限制 du/find 当免费只读检查。默认从现有指标和已知目录入手。

## systemd 实例

对已经定位的 unit：

| 目的 | 命令入口示例 |
| --- | --- |
| 当前状态及身份 | systemctl show shop-api.service --property=Id,ActiveState,SubState,MainPID,ExecMainStatus,NRestarts,FragmentPath,DropInPaths |
| 本次时间窗日志 | journalctl --unit=shop-api.service --since="2026-11-16 08:00:00 UTC" --until="2026-11-16 08:15:00 UTC" --no-pager --output=short-iso |
| 启动定义核查 | systemctl cat shop-api.service |
| 既有就绪检查 | 按项目指定的只读 readiness 或真实验证入口 |

示例名称和时间必须换成当前已核验值。show 的 MainPID 是观测标识，不能替代稳定实例 ID。cat 或日志可能含内联凭据，先限制读取/保存范围并脱敏，不将完整原文直接发布到工单。

版本不能仅靠 unit 名或一个显示标签确认。按项目实际路径查询二进制版本或制品摘要，记录有效配置身份；不要为读取版本触发安装、下载或服务启动。

## Compose 实例

先确认 Docker context/连接端点、项目名、全部既有 compose 文件、工作目录与环境来源，并核对已安装版本支持所需选项与输出字段。只在真实配置可用时用该项目的命令，不靠当前目录猜目标。

| 目的 | 命令入口示例 | 边界 |
| --- | --- | --- |
| 列当前项目运行单元 | docker compose --project-name shop --file /srv/shop/compose.yaml ps --all --format json | 这是工具输出格式，不是要求建立流程 JSON |
| 读指定服务日志 | docker compose --project-name shop --file /srv/shop/compose.yaml logs --since 2026-11-16T08:00:00Z --until 2026-11-16T08:15:00Z --tail 200 api | tail 限制意味着可能未覆盖整个窗口 |
| 核对容器状态 | docker inspect --format '{{json .State}}' 已核验容器ID | Health 字段可能不存在；运行中不等于就绪 |
| 核对实际镜像 | docker inspect --format '{{.Image}}' 已核验容器ID | 实际 image ID 与声明 tag 分开记录 |
| 核对镜像来源摘要 | docker image inspect --format '{{json .RepoDigests}}' 已核验镜像ID | 本地构建镜像可能无 RepoDigest，不伪造 |
| 核对挂载 | docker inspect --format '{{json .Mounts}}' 已核验容器ID | 限制保存路径与业务信息，未确认卷不操作 |

不运行 compose pull、build、up、down、restart，也不默认执行 exec 进入业务容器。完整 docker inspect / compose config 可能包含秘密；优先选择字段。若只能获取全量配置，保留在受控环境内，仅记录必要摘要或引用。

## 证书、备份和业务路径

证书检查按真实服务名、SNI 与信任链进行；一个端口返回证书不等于证书属于用户访问的域名。报告到期时间、当前校验时间、链/身份是否通过及实际续期基线，不强加全局“剩余多少天”规则。

备份检查读取既有任务的实际完成记录、对象身份、校验结果、恢复点和保留规则。不得因为对象文件存在或任务退出零就断言可恢复；恢复能力需要已有演练证据，或明确写未验证。

业务路径只使用已知无写入或获准的验证操作。使用生产请求会产生业务变更时不把它归类为普通只读检查，说明需要的验证条件。

