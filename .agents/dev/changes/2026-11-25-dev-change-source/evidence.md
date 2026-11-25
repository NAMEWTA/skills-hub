# Change 来源与正式资料持久化最终验收

状态：通过。方案、实现、来源记录、独立场景、完整 CI 与 v0.1.31 发布均已完成。

## 已落实的行为

完整方案见 [spec](spec.md)，原始要求见 [用户原文](source/user-request.md)。完整导入和更新方法归 dev-issue-setup/references/source-adapter.md；setup、triage、fix 共用这一契约，并提供包内 source-report.md 模板。

| 场景 | 当前规则与验证 |
| --- | --- |
| 获取 GitHub 或其他来源报告 | 按平台实例、项目/账号范围及原生 ID 定位 change；没有则建立最小 change/source，不要求预造 tasks。 |
| 保存正文和讨论 | 保存可读完整正文、实际取得的评论/作者/时间/状态、原生引用和必要方案附件；缺页、权限、未取得附件明确记录。 |
| 重复获取 | 复用同一来源和 change；旧版本先由 Git 保存，未提交旧版本保留时间快照；不覆盖未保存的本地编辑。 |
| 正式资料 | 来源、需求、设计讨论、架构、计划、确认原型和正式测试结论随 change 跟踪；按用途判定，JSON/工具生成也可为正式资料。 |
| 过程资料 | 执行日志、调试截图录屏、测量和临时工具输出放 temp/dev，避免全量提交过程噪声。 |
| 旧 temp 来源 | 只迁移本次已核实归属的误放资料，修复引用、回读并确认 Git 跟踪后处理旧副本。 |
| 下游接续 | Issue 撰写、intake、workflow、plan、architecture、verify、debug/review、handoff、archive 和全局规范一致。 |
| 任务与报告 | evidences 继续一 task 一同名 Markdown；没有 task 的轻量工作更新已有进展，不为来源留存生成空任务。 |

未新增平台连接器、资料数据库或安装时自动迁移器；方法适用于不同来源，实际读取仍以当前工具可验证的能力为限。

## 独立使用场景

新上下文执行者实际使用修改后的技能处理隔离 GitLab 导出：原生 ID 8412、iid 42、共 2 条评论仅取得 1 条，附设计文件，存在同事项 change 和误放 temp 的旧来源。

执行者复用了已有 change，将完整可读快照、JSON 原件、设计附件和带时间的旧版本保存到 source，正式分诊结论更新 brief，并明确缺失评论。根代理另核对源文件字节及 fixture 暂存范围：5 份正式资料可跟踪；源码和调试日志未变；未新增工单或冗余任务。该场景是本地方法执行验收，不是 GitLab 真实网络连接器验收。完整结论见 [D3](evidences/D3-delivery.md)。

## 验证与交付

全部 59 个自有技能共 584 文件、1044 本地链接检查通过，入口和导航预算通过；持久化路径、证据配对和安装导航回归通过。相关证据结构/持久化/技能组合测试 9/9，安装导航专项 7/7。独立审查及六条来源 adaptation 核对见 [D2](evidences/D2-implementation.md) 和 [适配记录](source-adaptations.md)。

固定发布提交 8e58e53f2f3c76deec514d236a7bc4a763b2ca65 的独立 CI 与发布前三平台门禁均通过；共用环境和产品制品验证见 [Home H3](../2026-11-25-home-registry-v2/evidences/H3-delivery.md)。[正式 Release](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.31) 已于 2026-11-25 17:58:20（Asia/Taipei）公开，实际结果见 [发布回执](../../deploy/npm/releases/0.1.31.md)。本最终报告在发布成功后补记，不改变发布包或标签。
