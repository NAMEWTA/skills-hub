# 知识入口与合作风格方法验收

状态：实现和方法审查完成，整合及实际使用证据见 [T7](07-validation.md)。对应 [任务](../tasks/02-entry-knowledge.md)。

新增 home-knowledge/references/agent-entry.md 与可选 assets/soul.md，并从 SKILL 直接链接。方法覆盖入口层级、重新读取、指针条件、唯一 owner、标记边界、迁移冲突、最小编辑与回读、风格启用/更正/忘记。knowledge-method 和 maintenance 同步 AGENTS 非托管内容及 SOUL 的维护归属；未扩大 knowledge.mjs 的白名单或声称普通编辑受主题锁保护。

唯一基础模板 scripts/persistence/home.md 为 31 行、1252 个非空白 Unicode 字符。它包含唯一 v1 区块、九技能自然意图路由及可选资料条件；没有指向尚未建立文件的必需 Markdown 链接，也没有预建 SOUL/profile 或其他业务目录。

独立审查核对了单包使用、缺入口诊断、未知版本禁止降级和 owner 衔接。审查发现普通知识编辑的完成条件不应扩大为根初始化，已限定为：仅完整初始化或根接入请求才要求根短指针。setup/doctor 修复责任也按实际安装器冲突行为校准。

初轮 `node scripts/check.mjs` 通过技能结构、本地资源可达性、持久化路径与材料快照检查。最终结构和行为门禁由 T7 记录。新增内容属于本项目实现；外部研究与采用边界同步 docs/home/sources.md 和第三方声明，没有复制新的外部代码单元。
