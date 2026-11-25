# T05-knowledge 验收

状态：实现、独立审查与专项测试通过；运营组合验收进行中。

现行/候选/退役分离、来源与scope、写前SHA-256、共享写锁、派生索引与预算、忘记最小排除依据均有运行工具。独立审查以旧实现失败的4项反例修复排除表边界竖线和derived_from字段类型；不安全正文跳过并标complete=false。两份独立包各自含全部脚本资源，无兄弟运行依赖。

node --test tests/home-knowledge.test.mjs tests/home-history.test.mjs：37/37通过，无跳过；含实际安装目录调用、并发/来源/重建与路径风险。跨owner配置/知识/历史忘记、新会话读取另记录真实场景。
