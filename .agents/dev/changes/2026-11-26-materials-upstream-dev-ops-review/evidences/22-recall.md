# 迁移七天主题回忆并核对共享记录

`dev-learn/references/context-recall.md` 迁到 `dev-recall/references/context-recall.md`，并核对 pstack 的固定来源版本。保留默认七天窗口、先过滤再读、具名功能或缺陷的共享记录、实时验证及简报契约；本地改用共同的 `dev-session-history`，按当前环境和实际收益选择分工。项目与时间范围、旧记录与当前事实的差异及无结果/不可访问分开说明。[固定来源](https://github.com/cursor/plugins/blob/b7b93c36be9bcc36a74db438e0fd385d660bc559/harness/pstack/claude-code/skills/recall/SKILL.md)

选择性安装到空项目后，入口和迁移后的参考方法均可读；旧入口改为按技能名转介，结构检查通过。按方法分别核对纯活动回顾、具名功能回忆、已有完整胶囊及指定会话接续四条指针。默认只返回简报；需要保存时引用同一 Change。

在真实 Codex CLI 0.172.0 的只读隔离项目用自然语言请求回顾 CSV 导入功能过去一周的进展及当前状态。工具轨迹先读 `dev-recall/SKILL.md`，再读 `dev-session-history/SKILL.md`。结果给出 11 月 20 日至 27 日的窗口，准确引用合成 Issue #31 的已回退修复、Pi 会话事件及当前 `importer.js`。它指出表头仍未校验，预览行重复是持续报障且原因未验证，并给出一个下一步。此样例检验具名功能的工作回忆；其余三个路由目前只有方法核对。
