# 验证范围

本地环境为 Linux / Node.js 24.22.1。仓库基线取自 main 的 `6fb7f89a87e741b2366f5a69eeb17f308a1508c8`，2958 个文件的 Git blob 和模式均与远端固定树一致。远端提交以真实 main 为父，不发布本地用于比较快照的合成提交。

## 已执行的本地检查

| 检查 | 结果与范围 |
| --- | --- |
| `npm run check:full` | 351 项隔离测试、12 个测试套件全部通过；独立包、领域持久化、材料集合/hash/blob/mode、有限状态示例与真实故障注入通过 |
| `npm run check:statechart` | 33 个已捕获 TLC 结果回放全部通过；不是新的 TLC 求解 |
| `npm run check:package` | 本地实际 pack 的白名单与资源清单通过；后续 npm 实装因离线缓存缺少 `@clack/core` 包元数据报 ENOTCACHED，完整实装交由三平台 CI 联网核验 |
| CLI/TUI | 单项/分组/混选、搜索、分页、部分选择、取消、预览、真实安装、备份与恢复通过；在 TERM=dumb 外部环境下，显式模拟终端的 12 项交互测试通过 |
| 来源完整性 | 两个新增来源共 441 文件，258 篇完整中文文档；逐文件映射到三个独立运行包；原件 blob 和 mode 与固定 Git 树一致 |
| 翻译复核 | 保留代码示例、完整步骤、表格、判断与英文锚点；另行修复反引号、方向键名称、媒体查询条件和省略的 API 参数示例；三篇自然语言模板按单独规则核对 |
| Archify | 从真实安装后的包运行 doctor 成功；实际架构示例生成约 846 KB 的 zh-CN HTML，validate / deliver / check 三项通过 |
| Google CLI | 使用公开 npm 依赖缓存实际运行 search 和 retrieve，均 exit 0；搜索返回 10 项，retrieve 返回 220 行英文指南，验证动态语言边界 |

`npm test` 复用现有 `check.mjs --full` 与 tests/ 隔离发现；不再用裸 `node --test` 递归发现材料树的来源测试。模拟终端的 TERM 设置只存在于测试夹具，生产按键语义未变。

## 真实浏览器与远端交付边界

本地 Chromium 因宿主限制报 `socket() failed: Operation not permitted`，因此本地不宣称 Archify 完整 finalize 成功。新增 `npm run check:upstream` 从安装包执行 doctor 和 finalize，要求 validate、deliver、check、browser-check 均 pass，且 browserCheck.ran 为 true。Linux CI 执行该门禁，不禁用浏览器沙箱，也不把生成 HTML 等同于浏览器验收。

三平台结果以该 PR / main 提交对应的 GitHub Actions 为准。发布沿用现有固定提交验证、同一 tgz 完整性核对、标签与附件流程；如果 npm 要求 staged publish 与本人二次验证，草稿或成功上传 stage 都不等同于公开发布。

安装包和静态指南为中文，上游 npm CLI 的最新响应仍可能为英文。技能安装不会自动安装浏览器、登录服务或保证每个宿主都能执行全部外部工具。
