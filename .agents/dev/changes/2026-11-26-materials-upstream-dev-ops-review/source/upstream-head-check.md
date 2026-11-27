# 最终上游分支节点复核

截至 **2026-11-26T07:40:12.266Z**，15 个材料源单元（13 个独立仓库）的跟踪分支均仍指向本次固定快照，**没有发现同步期间的 head 漂移**。

核验窗口为 2026-11-26T07:40:03.814Z 至 2026-11-26T07:40:12.266Z。通过 GitHub connector 只读 GET Git refs 重新解析每个分支；Speculo 的 `HEAD` 先查询仓库默认分支，结果为 `main`，随后解析该分支。oncall 的三个源单元复用同一次仓库分支观察。该结果是核验时点状态，不能承诺未来分支不会前进。

| 来源 | 跟踪分支 | 本次固定 SHA / 当前 SHA | 结果 |
| --- | --- | --- | --- |
| pstack | main | `b1fbf4b60ac6813b4583ccc356850dafcf492665` | 一致 |
| mattpocock-skills | main | `6f7f7831a625f040a8e06a0e7954826b87ce775a` | 一致 |
| deepseek-harness | master | `4b399c39a6d1479cd84ca591b4d7c88e24d38a96` | 一致 |
| ai-design-skills | main | `456d9e0d3e2d84c748bb143c6ca3d90c45e16213` | 一致 |
| speculo | HEAD → main | `994a64427a6784053dd092a86713870062cfde2f` | 一致 |
| herdr | master | `e8d7d9705a7a2c89cef4dd42079379f05685af87` | 一致 |
| herdr-core | master | `329cb66ebce5eca3d917fcf7364a099046979b49` | 一致 |
| oncall-triage | main | `c03282cd5381a5a2e12e32bfb3c8957d52ce01f1` | 一致 |
| oncall-templates | main | `c03282cd5381a5a2e12e32bfb3c8957d52ce01f1` | 一致 |
| oncall-replay | main | `c03282cd5381a5a2e12e32bfb3c8957d52ce01f1` | 一致 |
| openai-sentry | main | `49f948faa9258a0c61caceaf225e179651397431` | 一致 |
| archify | main | `d6b0f71f25a3337ed2fcd09c973cacf67be7baba` | 一致 |
| modern-web-guidance | main | `2b4aa13a72dd47cd135b06ce5abfccd92e19b24f` | 一致 |
| dashboard-design-skill | main | `57f96688862668b482f647fa1e370efb5d3ddd31` | 一致 |
| nanobot-memory | main | `c360a10e8ca8afd18916b73b7575f015941a33d9` | 一致 |

详细请求端点、分源时间戳和完整 SHA 记录于 `final-upstream-head-check.json`。本次复核没有修改任何材料、中文译文或清单。

