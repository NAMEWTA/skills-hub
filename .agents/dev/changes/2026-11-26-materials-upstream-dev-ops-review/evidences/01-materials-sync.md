# 01 材料同步证据

已完成。15 个来源单元、13 个仓库、2,196 个原件全部通过固定 GitHub API 树的路径、Git blob、mode 对比；常规材料校验通过。核验时所有分支 head 仍与固定快照一致。

- [全量来源与映射报告](../reports/upstream-inventory.md)
- [独立 Git 树核验](../reports/all-materials-source-tree-verification.md)
- [pstack 删除与同步影响](../reports/pstack-sync-report.md)
- [Archify 翻译复核](../reports/archify-root-translation-qa.md)
- [许可检查](../reports/license-check.md)
- [最终验证](../reports/validation.md)

`npm run check` 通过；材料测试 85/85 通过。`npm run check:statechart` 的 Login 绘图差异未通过，不能标为全部运行兼容。未更新任何运行技能的 source 审阅依据以掩盖此差异。

## 2026-11-27 集成复验

在 `ac71b45` 基线上引入 [43552f68](https://github.com/NAMEWTA/skills-hub/tree/43552f68d1ad46867e7c04bf8490b3364ec48f44) 的原件、中文对照和同步报告。通过 Git 核对 13 个远端仓库，15 个单元的跟踪引用在复验时均指向[父清单](../../../../../materials/manifest.tsv)记录的固定提交。Speculo 的默认分支为 `main`，三个 oncall 单元共用一个固定提交。

候选提交在以下两处早于当前跟踪引用，所选 Git 树逐个核对相同。父清单推进固定提交，原件和中文对照沿用已复核的内容。

| 单元 | 候选提交 | 当前固定提交 | 所选 Git 树 |
| --- | --- | --- | --- |
| pstack | `b1fbf4b6` | `b7b93c36` | `2802422c2a4ecb5d29ec04d6756a30c5449a823b` |
| herdr-core | `329cb66e` | `2e8043a2` | `9691960a86a372aaa06eae674f93192b8e54cfad` |

- 在隔离的 bare Git 库获取 13 个固定提交的树。逐文件比对远端树、两级清单、暂存索引与工作区。2,196 个原件的路径、Git blob、SHA-256 与固定树一致，索引保留 12 个执行位。逐个核对中文对照 SHA-256，原件和译文文件与候选提交一致。译文语义复用候选提交的全文复核，见[来源盘点](../reports/upstream-inventory.md)及 [Archify 翻译复核](../reports/archify-root-translation-qa.md)。原始复验结果位于 `temp/dev/issue-22-materials/fixed-tree-verification.json`。
- `node scripts/validate-materials.mjs` 退出码 0。Windows 的 `node --test tests/materials.test.mjs tests/materials-sync.test.mjs` 运行 85 项，80 项通过，5 项因文件符号链接权限缺失而跳过。11 月 26 日 Linux 验证记录了完整 85 项通过。
- 第三方声明合入候选材料的许可范围，保留主线的 Home 来源记录。将[许可核对表](../reports/license-check.md)所列八个集中许可副本与本轮固定树的原始 blob 再次核对，全部一致。Archify 新源的法律文件保留在材料树原路径。声明中的本地链接均可访问。

本次资料复验没有执行上游程序。运行技能的采用、删除映射处理和状态图回放结果见 #22 各同名任务证据。
