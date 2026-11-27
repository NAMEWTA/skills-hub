# 固定来源与运行包核对

重新查询 15 个远端 ref。nanobot-memory 前移，prepare 与 apply 从 Git 对象复核所选目录后仅更新父清单 revision。其余固定 SHA 一致。沿用[已完成的逐树和译文核对](01-materials-sync.md)。

| 来源 | 固定 SHA | 原件 | 对照 |
| --- | --- | ---: | ---: |
| pstack | b7b93c36be9bcc36a74db438e0fd385d660bc559 | 541 | 541 |
| mattpocock-skills | 6f7f7831a625f040a8e06a0e7954826b87ce775a | 114 | 114 |
| deepseek-harness | 4b399c39a6d1479cd84ca591b4d7c88e24d38a96 | 50 | 50 |
| ai-design-skills | 456d9e0d3e2d84c748bb143c6ca3d90c45e16213 | 2 | 2 |
| speculo | 994a64427a6784053dd092a86713870062cfde2f | 619 | 184 |
| herdr | e8d7d9705a7a2c89cef4dd42079379f05685af87 | 1 | 1 |
| herdr-core | 2e8043a2a47db0130943135805f4ec82c2a764bd | 1 | 1 |
| oncall-triage | c03282cd5381a5a2e12e32bfb3c8957d52ce01f1 | 5 | 5 |
| oncall-templates | c03282cd5381a5a2e12e32bfb3c8957d52ce01f1 | 5 | 5 |
| oncall-replay | c03282cd5381a5a2e12e32bfb3c8957d52ce01f1 | 1 | 1 |
| openai-sentry | 49f948faa9258a0c61caceaf225e179651397431 | 5 | 5 |
| archify | d6b0f71f25a3337ed2fcd09c973cacf67be7baba | 601 | 598 |
| modern-web-guidance | 2b4aa13a72dd47cd135b06ce5abfccd92e19b24f | 236 | 236 |
| dashboard-design-skill | 57f96688862668b482f647fa1e370efb5d3ddd31 | 14 | 14 |
| nanobot-memory | db21f04d2c9380f25d9ac343b33be5a415fd143b | 1 | 1 |

zh-modern-web-guidance：212 个相应文件均存在。与中文底稿有差异的路径为 `guides/performance/conditional-async-dependencies.md`、`guides/ui-behaviors/scroll-snap-realtime-feedback.md`、`SKILL.md`。

zh-chrome-extensions：24 个相应文件均存在。与中文底稿有差异的路径为 `references/extensions/prompt-api.md`、`SKILL.md`。

zh-dashboard-design：14 个相应文件均存在。与中文底稿有差异的路径为 `SKILL.md`。

Modern Web 的两份指南仅有行尾空白差异，Chrome Extensions 的 prompt-api.md 使用安装后的交叉引用名；三个 SKILL.md 沿用独立中文包的安装命名。
