# 01 材料同步证据

已完成。15 个来源单元、13 个仓库、2,196 个原件全部通过固定 GitHub API 树的路径、Git blob、mode 对比；常规材料校验通过。核验时所有分支 head 仍与固定快照一致。

- [全量来源与映射报告](../reports/upstream-inventory.md)
- [独立 Git 树核验](../reports/all-materials-source-tree-verification.md)
- [pstack 删除与同步影响](../reports/pstack-sync-report.md)
- [Archify 翻译复核](../reports/archify-root-translation-qa.md)
- [许可检查](../reports/license-check.md)
- [最终验证](../reports/validation.md)

`npm run check` 通过；材料测试 85/85 通过。`npm run check:statechart` 的 Login 绘图差异未通过，不能标为全部运行兼容。未更新任何运行技能的 source 审阅依据以掩盖此差异。
