# 验证会话复盘的证据、取舍和负责人

`dev-reflect` 使用当前或指定会话做直接审阅。对照 pstack 固定版本收拢原 `dev-archive` 的 `parallel-retrospective.md`、`session-retrospective.md`、`review-judgment.md`、`review-tooling.md`、`review-blindspots.md` 和 `review-synthesis.md`。原审查对导航、用户纠正、代码与工具、能自行取得的信息、漏验证、盲点及结论综合的判断进入 `reflection-method.md`。复核可以使用独立视角，具体分工按授权和需要选择。[固定来源](https://github.com/cursor/plugins/blob/b7b93c36be9bcc36a74db438e0fd385d660bc559/harness/pstack/claude-code/skills/reflect/SKILL.md)

选择性安装到空项目后，反思入口与唯一完整方法均可读。静态检查核对了直接审阅、已覆盖拒绝、缺失与漏触发判断、机械防错待办、项目知识归属，以及仅分析或已授权编辑两种交付。`dev-archive` 保留 Change 收尾和项目知识，`dev-personalize` 继续负责个人稳定惯例。

真实 Codex CLI 0.172.0 在只读隔离项目收到「复盘开发对话，指出以后怎样少走弯路」的分析请求，读取 `dev-reflect/SKILL.md` 和完整合成对话。输出 Accepted、Rejected 与 Backlog，引用原始事件指出 `node --check` 只能检查语法、现有文档和样例可减少重复寻找，排除未证明能捕获错误的 lint，将稳定 CSV 术语交给 `dev-archive`，项目文件未修改。

首次答案曾将遵守现有 `dev-learn` 验证指导列入 Accepted。强化接受项必须改变方法后，以相同输入新开会话复验。复验将接受项具体化为修改入口发现流程，以及对明确要求实际行为验证的请求补充运行输入、命令、观察结果与未验证条件。后者是否值得在现有验证指导内细化，仍需要阅读真实目标技能判断。授权编辑分支尚未运行模型验证。
