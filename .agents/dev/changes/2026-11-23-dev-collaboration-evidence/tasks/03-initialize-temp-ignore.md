# 03 安装时忽略项目根 temp

规格：[路径与生命周期](../plan.md#路径与生命周期)。本仓库自己的 `.gitignore` 已有 `temp/`，修复点是目标消费项目。

交付：实际安装任意 dev 或 system 技能时，项目根 `.gitignore` 默认包含 `/temp/`；dev 同时保留 `/.agents/dev/worktree/`。混装不重复写。仅 ops 或独立上游技能不增加项目 temp 规则。直接依赖：无。

## 实施范围

1. 在 `scripts/init-persistence.mjs` 的现有事务内统一规则，沿用预览、校验、双锁和回滚。保留文件字节、首次换行风格与 BOM，只补缺失条目，不改根 `AGENTS.md` 或业务资料。已有等效 `/temp/` 或 `temp/` 时不重复加行。保留已有的旧系统附件规则，新项目不再生成它。安装不创建 `temp/`、主机 Change、报告或附件目录。
2. 不取消跟踪、不移动、不删除，不把既有规则冲突静默说成已保护。取证前以真实 Git 排除结果和跟踪状态核对实际去向；已有跟踪原件或显式重新纳入的路径交项目处理，不强制写入。安装本身仍可用于非 Git 目录，不新增 Git 依赖。
3. 对齐 CLI 确认与 dry-run、非交互帮助、`scripts/persistence/{dev,changes,system}.md`。更新本仓库约定、README、安装与持久化契约、验证说明和 CHANGELOG，区分工作树、运行原件、正式资料及兼容性。补针对实际写入模板的路径回归，不将所有 `evidence.md` 或旧历史引用视为错误。

## 验收

- [ ] 比较单装 dev、单装 system、混装、仅 ops、仅独立上游、重复安装与 dry-run；`list`、`help`、取消零写入。覆盖缺少 `.gitignore`、CRLF/BOM、无末尾换行、已有等效规则、历史规则、既有例外、非法路径及注入写入失败时字节级回滚。
- [ ] 在隔离 Git 项目写测试文件，在默认规则下用 `git check-ignore -v` 验证两域的 JSON、PNG、日志和工具 Markdown 均被 `/temp/` 排除。用 `git ls-files` 核对已有跟踪文件仍保留，验收报告、协调文件和正式资产未被误忽略。验证根级规则不排除嵌套 `src/temp/`。已有跟踪或冲突规则的实例不作为新版默认安装的通过样例。
- [ ] 执行 `npm run check:full` 和 `npm run check:package`，分别覆盖源码入口和真实 tarball 消费端。安装后业务索引、原路径链接、两域导航及重复安装均符合计划。

验收：[本票报告](../evidences/03-initialize-temp-ignore.md)。
