# T06-history 验收

状态：事件工具与真实运营通过，新上下文答案/接续通过。

真实同源和归档重导返回unchanged；真正后续决定有不同event_key/id，初始事件时间/首次recorded_at不被更新覆盖。两次实际决定发生于2026-11-25T07:30:29.928+00:00与07:30:30.145+00:00，当前规则仍由context owner维护。查询与索引不把历史状态冒充现在或native resume。

专项覆盖时区排序、日期边界、unknown、ID冲突、旧SHA、并发写者与索引恢复。实际六位小数ISO首次输入被DATE拒绝且sourceSaved=false；按hash清理本轮两份半成品后，用新的实际毫秒观测完成主链，保留失败日志。文档/错误已明确秒及1–3位小数边界。

独立追加证据：新Agent无答案继承完成35条真实只读命令，当前与历史答案和随机ID准确；Home/ProjectA两个running实例均实际interrupt后按同id followup读回本层checkpoint，未重派或重复实现。Home23份权威文档、A HEAD/源码/原task/report均保持。完整来源见[真实运行记录](../runtime-evidence.md#全新上下文与真实中断接续结果)。
