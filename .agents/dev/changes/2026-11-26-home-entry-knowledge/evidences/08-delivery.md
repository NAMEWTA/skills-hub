# 文档、提交与补丁发布验收

状态：实现、文档及补丁版本就绪，待提交、同 SHA CI 和公开发布回读。对应 [任务](../tasks/08-delivery.md)。

版本从 `0.1.35` 增至 `0.1.36`，package 与 lock 一致。README、安装说明、领域持久化、知识规范、Home overview/method-ownership/validation/sources、CHANGELOG 与第三方声明已同步。来源为方法研究，没有新增第三方运行代码或复制外部 persona 正文。

发布使用既有 Release 工作流；不提前移动或创建版本标签，不跳过三平台验证。上传后按 release.md 回读 npm 公开版本、完整性、标签指向与两个 Release 附件。精确结果将保存 `.agents/dev/deploy/npm/releases/0.1.36.md`，并在本报告关联。

独立 CLI M06 见 [T7](07-validation.md)。该项尚未通过，因此本次提交引用 Issue #21 而不使用自动关闭语句；版本发布成功也不直接构成整项 Issue 完成。
