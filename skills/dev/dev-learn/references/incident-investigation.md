# 事故与复盘背景

- **Linear**：寻找标有 `incident`、`sev-*`、`postmortem-action-item`、`reliability` 的工单。
- **Slack**：在目标代码加入日期附近，搜索 `#sev-*` 和 `#incident-*` 频道。
- **Git**：提交消息中“修复事故”“增加防御检查”，或先“回退”随后“重新应用并……”等表述，都是强信号。

相关执行条件、方案比选、记录与工具回退见 [本地执行支持](execution-support.md)；按任务选择完整方法见 [资料索引](index.md)。
