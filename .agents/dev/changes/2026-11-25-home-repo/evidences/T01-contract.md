# T01-contract 验收

状态：实现与静态核对通过。

唯一合同为 Issue #2（2026-11-25T05:53:23Z）。基线由 f782755b 快进至 2988ae4a，保留 PR #16。对比该基线，skills/dev、skills/ops、skills/system 及既有原件/中文材料没有改动；mattpocock 仅追加 home 采用指针与本次适配说明。八包名称与唯一 owner、完整方法入口见 docs/home/method-ownership.md。

运行 node scripts/check.mjs：63 包、785 Markdown、1496 本地链接、15 材料项目/1816 原件通过；59 个自有技能入口预算全部通过。无 home-init/home-dispatch 包、统一 CLI adapter 或新的派遣总账。
