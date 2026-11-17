# 文档整理前的历史证据

这些文件迁自 `docs/`。它们记录各自标题和正文中的历史时间、版本、环境、实际结果与限制，不代表当前版本重新通过验证。长期操作契约改由 [项目文档](../../../../../docs/README.md)维护。

本目录保留完整报告、原始步骤和场景表，历史资源迁移表独立保存在测试夹具目录。Markdown 只调整本地链接，以适应新位置；代码围栏与报告内容不改写。下表摘要对应迁移前原文件，可与 Git 历史核对。TSV 字节保持不变，测试从稳定的 `tests/fixtures/` 路径读取完整历史关系，不依赖活跃 change 的名称。

| 原位置 | 归档 | 迁移前 SHA-256 | 处理 |
| --- | --- | --- | --- |
| `docs/validation.md` | [validation-history.md](validation-history.md) | `15fba0c83a690ee72c1b24ef12ee96b8894fad28249eb0db6d49d9216f5f0f3d` | 正文、表格与代码保留；仅修复移动后的本地 Markdown 链接 |
| `docs/ops-validation.md` | [ops-validation.md](ops-validation.md) | `f98bd484eb8991177a53afa8439da00dc67566aa34c9f56c4e40242becf31761` | 正文、表格与代码保留；仅修复移动后的本地 Markdown 链接 |
| `docs/dev-resource-moves.tsv` | [dev-resource-moves.tsv](../../../../../tests/fixtures/dev-resource-moves.tsv) | `ceaab8fbe18bf324568c977f52932046514b3adb2d725e42d40264e61391fe59` | 原样 TSV |
| `docs/ops-evidence/ssh-2026-11-16.md` | [ops-evidence/ssh-2026-11-16.md](ops-evidence/ssh-2026-11-16.md) | `c1ee2196a783f71f27bfba6922d57a76bc2882ac5800a77417be8b88e7298eb3` | 正文、表格与代码保留；仅修复移动后的本地 Markdown 链接 |
| `docs/ops-evidence/boundary-2026-11-16.md` | [ops-evidence/boundary-2026-11-16.md](ops-evidence/boundary-2026-11-16.md) | `f0344b8af18d7c714eb4b3a4927f42b13ed6c14fb704bc683d205cb2600acef4` | 正文、表格与代码保留；仅修复移动后的本地 Markdown 链接 |
| `docs/ops-evidence/history-2026-11-16.md` | [ops-evidence/history-2026-11-16.md](ops-evidence/history-2026-11-16.md) | `22037adbdcff59a4678b08095aa79e5a4f485b2186a81707f0a22c58c82319dc` | 正文、表格与代码保留；仅修复移动后的本地 Markdown 链接 |

历史报告中的临时路径只说明当时证据位置；归档不保证临时环境仍可恢复。可重复运行的方法、依赖和结论范围见 [验证指南](../../../../../docs/validation.md)与 [ops 验证](../../../../../docs/ops-validation.md)。
