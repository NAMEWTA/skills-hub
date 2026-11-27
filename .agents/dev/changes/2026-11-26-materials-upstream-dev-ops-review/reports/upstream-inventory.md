# 全部上游材料盘点与同步结果

日期：2026-11-26（Asia/Taipei）。范围为父清单登记的 **15 个来源单元、13 个独立仓库**；oncall-kit 的三个来源根分别计为来源单元。文件、映射行与运行路径的数量都不是独立技能数量。

## 结论与统计口径

本轮原件由 **1,816 个增至 2,196 个**：新增 **421**、内容修改 **229**、删除 **41**、模式变化 **0**，另有 **1,546** 个路径的内容和模式不变。父清单有 **9** 个 revision 前移，其中 **6** 个来源单元有选定根内的内容变化，**3** 个仅 revision 前移；另 **6** 个来源单元固定提交未变。最终跟踪 ref 复核截止 **2026-11-26 15:40:12 Asia/Taipei**，15 个跟踪 ref 均等于本次固定提交。最新性结论限定于该时刻。

旧值取自本次工作起点的 `git show HEAD:materials/manifest.tsv` 及各子清单；该 HEAD 为 `3d53f0f9a31b0993269055be20d2df96fbdd5325`，是远端基线 [f23ba949826c4b6cac480280ff306cdd28681f39](https://github.com/NAMEWTA/skills-hub/commit/f23ba949826c4b6cac480280ff306cdd28681f39) 的本地已验证快照。新值取自当前父子清单。全部 TSV 使用仓库共享 `scripts/materials-manifest.mjs` 的 `parseTsv` 解析。

以来源根内的 `source_path` 为键：新增/删除按路径集合差计算；修改指同路径 `source_git_blob` 不同；模式变化比较 `source_git_mode`；未变化要求 blob 和模式同时相同。模式变化可能与内容修改重叠，本轮为 0。revision 是仓库提交，不意味着所选来源根一定改变。

## 固定上游、跟踪 ref 与来源根

| 来源单元 | 跟踪 ref | source_root | 原 revision | 本次 revision | 状态 |
| --- | --- | --- | --- | --- | --- |
| pstack | `main` | `harness/pstack` | [2eaf46574b25cdf7ef8c849837099b866b7438ce](https://github.com/cursor/plugins/commit/2eaf46574b25cdf7ef8c849837099b866b7438ce) | [b1fbf4b60ac6813b4583ccc356850dafcf492665](https://github.com/cursor/plugins/commit/b1fbf4b60ac6813b4583ccc356850dafcf492665) | 内容变化 |
| mattpocock-skills | `main` | `skills` | [4ae2317ddb22b046e26455e4f9c9b3aaaf62212d](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | [6f7f7831a625f040a8e06a0e7954826b87ce775a](https://github.com/mattpocock/skills/commit/6f7f7831a625f040a8e06a0e7954826b87ce775a) | 内容变化 |
| deepseek-harness | `master` | `.agents/skills` | [e8f7b93a344964de3dca1ace9e72b6e4d6de87cb](https://github.com/deepseek-ai/deepseek-harness/commit/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb) | [4b399c39a6d1479cd84ca591b4d7c88e24d38a96](https://github.com/deepseek-ai/deepseek-harness/commit/4b399c39a6d1479cd84ca591b4d7c88e24d38a96) | 内容变化 |
| ai-design-skills | `main` | `skills` | [456d9e0d3e2d84c748bb143c6ca3d90c45e16213](https://github.com/elayadesign/ai-design-skills/commit/456d9e0d3e2d84c748bb143c6ca3d90c45e16213) | [456d9e0d3e2d84c748bb143c6ca3d90c45e16213](https://github.com/elayadesign/ai-design-skills/commit/456d9e0d3e2d84c748bb143c6ca3d90c45e16213) | 固定提交未变 |
| speculo | `HEAD` | `.` | [994a64427a6784053dd092a86713870062cfde2f](https://github.com/NAMEWTA/Speculo/commit/994a64427a6784053dd092a86713870062cfde2f) | [994a64427a6784053dd092a86713870062cfde2f](https://github.com/NAMEWTA/Speculo/commit/994a64427a6784053dd092a86713870062cfde2f) | 固定提交未变 |
| herdr | `master` | `skills/herdr` | [ee5bfb5041bb3e4a49d591c72308aae3c81ecdde](https://github.com/herdrdev/herdr/commit/ee5bfb5041bb3e4a49d591c72308aae3c81ecdde) | [e8d7d9705a7a2c89cef4dd42079379f05685af87](https://github.com/herdrdev/herdr/commit/e8d7d9705a7a2c89cef4dd42079379f05685af87) | 仅 revision 前移 |
| herdr-core | `master` | `skills/herdr-core` | [c7517808d64f06609e4ecf0db1757005373cc3a3](https://github.com/herdrdev/herdr-core/commit/c7517808d64f06609e4ecf0db1757005373cc3a3) | [329cb66ebce5eca3d917fcf7364a099046979b49](https://github.com/herdrdev/herdr-core/commit/329cb66ebce5eca3d917fcf7364a099046979b49) | 仅 revision 前移 |
| oncall-triage | `main` | `skills/triage` | [c03282cd5381a5a2e12e32bfb3c8957d52ce01f1](https://github.com/anthropics/oncall-kit/commit/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1) | [c03282cd5381a5a2e12e32bfb3c8957d52ce01f1](https://github.com/anthropics/oncall-kit/commit/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1) | 固定提交未变 |
| oncall-templates | `main` | `templates` | [c03282cd5381a5a2e12e32bfb3c8957d52ce01f1](https://github.com/anthropics/oncall-kit/commit/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1) | [c03282cd5381a5a2e12e32bfb3c8957d52ce01f1](https://github.com/anthropics/oncall-kit/commit/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1) | 固定提交未变 |
| oncall-replay | `main` | `eval` | [c03282cd5381a5a2e12e32bfb3c8957d52ce01f1](https://github.com/anthropics/oncall-kit/commit/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1) | [c03282cd5381a5a2e12e32bfb3c8957d52ce01f1](https://github.com/anthropics/oncall-kit/commit/c03282cd5381a5a2e12e32bfb3c8957d52ce01f1) | 固定提交未变 |
| openai-sentry | `main` | `skills/.curated/sentry` | [49f948faa9258a0c61caceaf225e179651397431](https://github.com/openai/skills/commit/49f948faa9258a0c61caceaf225e179651397431) | [49f948faa9258a0c61caceaf225e179651397431](https://github.com/openai/skills/commit/49f948faa9258a0c61caceaf225e179651397431) | 固定提交未变 |
| archify | `main` | `archify` | [a7ed6fd6657da90414831d1d42cf95987188750c](https://github.com/tt-a1i/archify/commit/a7ed6fd6657da90414831d1d42cf95987188750c) | [d6b0f71f25a3337ed2fcd09c973cacf67be7baba](https://github.com/tt-a1i/archify/commit/d6b0f71f25a3337ed2fcd09c973cacf67be7baba) | 内容变化 |
| modern-web-guidance | `main` | `skills` | [64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65](https://github.com/GoogleChrome/modern-web-guidance/commit/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65) | [2b4aa13a72dd47cd135b06ce5abfccd92e19b24f](https://github.com/GoogleChrome/modern-web-guidance/commit/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f) | 内容变化 |
| dashboard-design-skill | `main` | `skills/dashboard-design` | [463b8fdf62c640180ec1ba731f3616c2319bf68c](https://github.com/abdiraimov-otabek/dashboard-design-skill/commit/463b8fdf62c640180ec1ba731f3616c2319bf68c) | [57f96688862668b482f647fa1e370efb5d3ddd31](https://github.com/abdiraimov-otabek/dashboard-design-skill/commit/57f96688862668b482f647fa1e370efb5d3ddd31) | 内容变化 |
| nanobot-memory | `main` | `nanobot/skills/memory` | [557776261547ce4872a119dd094b314b8f721b1b](https://github.com/HKUDS/nanobot/commit/557776261547ce4872a119dd094b314b8f721b1b) | [c360a10e8ca8afd18916b73b7575f015941a33d9](https://github.com/HKUDS/nanobot/commit/c360a10e8ca8afd18916b73b7575f015941a33d9) | 仅 revision 前移 |

Speculo 的 `HEAD` 在本次复核中解析为默认分支 `main`。herdr、herdr-core、nanobot-memory 的父 revision 已前移，但选定来源根的文件字节和模式没有变化，因而复用已有中文对照。

## 文件变化明细

| 来源单元 | 原文件数 | 现文件数 | 新增 | 修改 | 删除 | 模式变化 | 未变化 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pstack | 560 | 541 | 5 | 80 | 24 | 0 | 456 |
| mattpocock-skills | 114 | 114 | 0 | 6 | 0 | 0 | 108 |
| deepseek-harness | 50 | 50 | 0 | 7 | 0 | 0 | 43 |
| ai-design-skills | 2 | 2 | 0 | 0 | 0 | 0 | 2 |
| speculo | 619 | 619 | 0 | 0 | 0 | 0 | 619 |
| herdr | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| herdr-core | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| oncall-triage | 5 | 5 | 0 | 0 | 0 | 0 | 5 |
| oncall-templates | 5 | 5 | 0 | 0 | 0 | 0 | 5 |
| oncall-replay | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| openai-sentry | 5 | 5 | 0 | 0 | 0 | 0 | 5 |
| archify | 206 | 601 | 411 | 100 | 16 | 0 | 90 |
| modern-web-guidance | 235 | 236 | 2 | 31 | 1 | 0 | 203 |
| dashboard-design-skill | 11 | 14 | 3 | 5 | 0 | 0 | 6 |
| nanobot-memory | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| **合计** | **1816** | **2196** | **421** | **229** | **41** | **0** | **1546** |

关系复核：`1,816 + 421 − 41 = 2,196`；`421 + 229 + 1,546 = 2,196`。原件与中文对照采用同一固定 revision；来源删除同时从材料原件和对应中文镜像移除。运行采用是否删除或重构另行评审。

## 当前映射与待采用评审

现存子清单有 **655 条**非空 `runtime_paths` 映射行，对应 **663 个**去重运行文件路径。其中 **336 条**满足 `source_git_blob != runtime_reviewed_blob`：**196 条**尚无 reviewed blob，**140 条**保留非空旧 reviewed blob。这 336 条映射共指向 **339 个**去重运行文件路径。空 reviewed blob 包括既有待审记录，不能把 336 条全部称为本轮新增退化或技能。

| 来源单元 | 现存映射行 | source/reviewed 不一致 | 其中 reviewed 为空 | 其中 reviewed 为旧 blob | 本次内容修改且已有映射 | 上游删除且原有映射 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| pstack | 141 | 139 | 136 | 3 | 70 | 22 |
| mattpocock-skills | 35 | 31 | 30 | 1 | 2 | 0 |
| deepseek-harness | 2 | 2 | 2 | 0 | 0 | 0 |
| ai-design-skills | 2 | 2 | 2 | 0 | 0 | 0 |
| speculo | 33 | 26 | 26 | 0 | 0 | 0 |
| herdr | 1 | 0 | 0 | 0 | 0 | 0 |
| herdr-core | 1 | 0 | 0 | 0 | 0 | 0 |
| oncall-triage | 1 | 0 | 0 | 0 | 0 | 0 |
| oncall-templates | 1 | 0 | 0 | 0 | 0 | 0 |
| oncall-replay | 1 | 0 | 0 | 0 | 0 | 0 |
| openai-sentry | 1 | 0 | 0 | 0 | 0 | 0 |
| archify | 190 | 100 | 0 | 100 | 100 | 16 |
| modern-web-guidance | 234 | 31 | 0 | 31 | 31 | 1 |
| dashboard-design-skill | 11 | 5 | 0 | 5 | 5 | 0 |
| nanobot-memory | 1 | 0 | 0 | 0 | 0 | 0 |
| **合计** | **655** | **336** | **196** | **140** | **208** | **39** |

现存路径的 `runtime_reviewed_blob` 相对旧清单变更数为 **0**；材料同步没有把旧运行实现标成已采用新来源。删除的 41 个来源文件中，39 个原有运行映射：pstack 22 条、Archify 16 条、Modern Web Guidance 1 条，另外 2 个无映射。39 条删除映射对应 **39 个**去重运行文件路径。将现存待审与来源删除影响合并，共 **378 个**去重运行文件路径需纳入后续采用或保留判断；这不是本轮已修改的运行文件数。

删除映射不再出现在当前子清单，故另存旧提交、旧路径、旧 blob 与运行路径证据：

- pstack：见 [pstack 同步报告](pstack-sync-report.md)。24 个来源删除中 22 个有运行映射。reflect reviewer/synthesizer、architect/why 参考及 poteto check-plan 的上游删除，不直接触发本仓运行删除。
- Archify：见 [Archify 同步记录](archify-sync-verification.json) 的 `deletedRuntimeMappings`，16 条保留旧映射，涉及旧示例渲染产物与本地化资源。
- Modern Web Guidance：见 [删除影响记录](modern-web-guidance-deleted-impact.json)，1 条保留旧映射。

## 中文对照与字节保留规则

变化的自然语言文档按固定上游同步中文；程序、机器夹具、业务字符串与法律原件按各来源既有规则保留。摘要校验只证明文件与清单对应，不能单独证明译文语义完整；变化文档另作内容与结构复核。

Archify 共 601 个原件：598 个有 `zh_path`，其中 555 个对照与原件字节相同、43 个摘要不同。这些数值区分字节保留与文字处理，不把代码和机器资源的原字节对照称为译文。新增及变化的说明文档按全文翻译；代码资源按既有规则保留原字节。另有以下 **3 篇原本中文**的材料按稀疏中文规则直接使用原件，没有重复 zh 副本：

- `modules/code-analysis/docs/TS-REAL-PROJECT-ACCEPTANCE.md`
- `modules/code-analysis/docs/TS-SDK-PROBE.md`
- `modules/code-analysis/docs/TS-UPSTREAM-LEDGER.md`

其他来源已有的原中文稀疏规则同样保留，例如 Speculo。Archify、Modern Web 与 Dashboard 原文矛盾或示例疑点在忠实同步后进入 Issue 的采用前核实清单，没有在译文中静默改写上游语义。

## 验证结果与交付边界

已阅读本 Change 的 [完整树核验报告](all-materials-source-tree-verification.md) 与 [验证结果](validation.md)，下表记录实际结果。

| 检查 | 实际结果与边界 |
| --- | --- |
| 跟踪 ref 最终复核 | 15/15 与固定 revision 一致，截止 15:40:12 Asia/Taipei。 |
| 上游完整树独立对比 | 15 单元、13 份独立 API 树、2,196 原件全部通过；树均 `truncated: false`，路径集合、原字节 Git blob 与 mode 一致。 |
| 原件/中文清单验证 | `node scripts/validate-materials.mjs` exit 0；集合、摘要、blob、模式、运行路径与稀疏中文规则通过。 |
| 仓库常规检查 | `npm run check` exit 0；Node.js v24.22.3、Linux。64 技能、785 Markdown、1,537 本地引用、许可、领域持久化与材料检查通过。 |
| 材料专项测试 | `node --test tests/materials.test.mjs tests/materials-sync.test.mjs`：85 通过、0 失败、0 跳过。 |
| 状态图回放 | `npm run check:statechart` 对应入口 exit 1；20 个案例先完成，Login 图比较失败，其余案例完整结果未取得。 |
| 运行采用 | 本轮运行技能和维护脚本未改；旧 reviewed blob 保留。材料是研究与来源镜像，不是新增安装包，也不证明运行行为已升级。 |

Login 已复现的差异为当前入口边 `s0 → s2`，最新固定夹具要求 `s0 → s1`，并在复合状态内显示 `[*] → s2`。该失败列入综合 Issue 的 P0；没有改夹具、放宽断言或报告全套回放通过。检查使用既有 captured-output replay，未启动新的 TLC 求解或执行新收录的来源工具。

常规 validator 的 `0 explicit local Git trees` 仅描述该入口未传入本地 Git 对象库；15 单元的上游一致性由独立 API 树逐文件核对补充证明。中文语义、运行采用与跨平台执行属于不同验证层，不能相互替代。
