# 运维历史与经验复核

核对固定 oncall、Sentry 与既有映射，对照[运维逐项审查](../reports/ops-audit.md)。在 history-query 中补明多视角共享同一原始 run，未知状态沿该 run 查现场；在 knowledge-lifecycle 中补明已覆盖、待验证、临时缓解与移交条件。inspect、diagnose、execute 仍由原入口处理现场及授权；未执行生产操作。

Windows Node 24.21：ops-execute 全部 7 项通过，包括共享服务唯一事实、中断与重试。ops-installation 的业务保留、重装、写入失败回滚等 4 项通过，另 2 项的 Claude 链接断言失败（当前 Windows 用户无法创建目录符号链接）。原始结果在 temp/dev/issue-22/ops.log。
