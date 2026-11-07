# 开发缓存与容器

缓存与本地数据先按所有者和用途区分。可重新生成也可能需要网络、昂贵编译或尚未保存的输入；清理前说明代价。

## 语言与构建工具

| 对象 | 观察/定位 | 可选清理范围 |
|---|---|---|
| Rust 项目构建 | 项目配置与实际 target 目录 | 在该项目运行 `cargo clean`；保留源码、lockfile、配置、Cargo bin |
| Go build cache | `go env GOCACHE GOMODCACHE` | `go clean -cache` 清构建缓存；`-modcache` 需要重新下载，单独选择 |
| npm | `npm config get cache` | 先核对缓存必要性；确需时官方 cache 命令，_npx 与项目 node_modules 分开 |
| pnpm | `pnpm store path` | `pnpm store prune` 按当前版本语义处理；不删除仍被工作负载依赖的整个 store |
| Python pip | `python -m pip cache info` | 已选范围可用 `python -m pip cache purge`，不删除虚拟环境替代清缓存 |
| Gradle/Maven | 实际缓存/仓库与配置位置 | 分开缓存、wrapper、配置和离线依赖；不删 .m2/settings.xml 或密钥 |
| 前端产物 | 具体项目和构建配置 | 仅项目确定的生成目录；不从家目录递归查找并删除所有 build/dist/.next |

以上命令仅在对应工具存在、版本支持且当前范围匹配时使用。不要运行未知项目脚本来“清理”，先读取其真实行为；`clean` 这个名字不是安全证明。

不要把全局依赖 store、虚拟环境、模型权重、Agent 会话或本地索引自动当成无价值缓存。

## Docker / Podman

先识别正确 context、daemon、存储根和 rootless/rootful 实例。可用 `docker system df`、`docker ps -a`、具名对象的 `inspect` 建立占用与挂载关系；对外只保留脱敏摘要，inspect 原文可能有环境密钥。

1. 记录需要保留的容器、运行状态、volume 和宿主 bind mount。
2. 仅移除清单明确点名且当前不在运行的容器。已停止不等于数据不需要。
3. 卷按准确 ID/名称、业务归属与数据备份逐个决定；默认保留。孤立或 dangling 不代表可以销毁。
4. 镜像与 build cache 按当前工具支持的 dry-run/过滤/保留策略或明确列表处理；先看本机帮助。会影响离线启动或回退镜像时说明代价。
5. 每批后核对保留的容器健康、挂载和空间，发现变化就停。

不执行 `docker system prune -a --volumes` 作为通用优化，不把广泛 `volume prune` 或没有精确范围的删除放入定时任务。不手工删除 Docker/Podman 数据根。

对于停止的开发栈，卷仍可能保存唯一数据库；用户明确要求销毁该栈及其数据并核对对象之后，才移除对应对象。Bind mount 中的业务数据不包含在“清容器镜像”里。

## 实际回收量

文件系统可能因开放文件句柄、快照、硬链接或虚拟盘保留而尚未释放空间。先检查对应原因，不扩大删除。报告逻辑占用与实际可用空间变化的差别；不为了达到预计数字不断追加新目标。
