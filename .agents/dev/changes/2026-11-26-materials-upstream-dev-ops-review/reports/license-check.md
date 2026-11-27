# 上游许可与集中副本核验

8 个受复核来源单元对应的集中主许可证均与最新固定提交逐 Git blob 相同。Herdr 与 Herdr Core 共用同一份字节完全相同的 Apache 2.0 原文。没有覆盖任何运行版许可证。

| 来源 | 上游文件 | 集中副本 | 最新 Git blob | 结果 |
| --- | --- | --- | --- | --- |
| pstack | [harness/pstack/claude-code/LICENSE](https://github.com/cursor/plugins/blob/b1fbf4b60ac6813b4583ccc356850dafcf492665/harness/pstack/claude-code/LICENSE) | `licenses/pstack-MIT.txt` | `6b5400237fdf6545be0b8fae370d6f2fcff8fb25` | 原字节一致 |
| mattpocock-skills | [LICENSE](https://github.com/mattpocock/skills/blob/6f7f7831a625f040a8e06a0e7954826b87ce775a/LICENSE) | `licenses/mattpocock-skills-MIT.txt` | `f1dd2c09108dde1a5f56097cee8461b3ea834499` | 原字节一致 |
| deepseek-harness | [LICENSE](https://github.com/deepseek-ai/deepseek-harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/LICENSE) | `licenses/deepseek-harness-MIT.txt` | `c1f7a78e89e4e4dc7b86664c3b3c76eb5eee1785` | 原字节一致 |
| modern-web-guidance | [LICENSE](https://github.com/GoogleChrome/modern-web-guidance/blob/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f/LICENSE) | `licenses/modern-web-guidance/LICENSE` | `d645695673349e3947e8e5ae42332d0ac3164cd7` | 原字节一致 |
| dashboard-design-skill | [LICENSE](https://github.com/abdiraimov-otabek/dashboard-design-skill/blob/57f96688862668b482f647fa1e370efb5d3ddd31/LICENSE) | `licenses/dashboard-design-skill-MIT.txt` | `8d6c98b71c5781d212af80702df416013cae041a` | 原字节一致 |
| herdr | [LICENSE](https://github.com/herdrdev/herdr/blob/e8d7d9705a7a2c89cef4dd42079379f05685af87/LICENSE) | `licenses/herdr-Apache-2.0.txt` | `261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64` | 原字节一致 |
| herdr-core | [LICENSE](https://github.com/herdrdev/herdr-core/blob/329cb66ebce5eca3d917fcf7364a099046979b49/LICENSE) | `licenses/herdr-Apache-2.0.txt` | `261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64` | 原字节一致 |
| nanobot-memory | [LICENSE](https://github.com/HKUDS/nanobot/blob/c360a10e8ca8afd18916b73b7575f015941a33d9/LICENSE) | `licenses/nanobot-MIT.txt` | `e06eb24cf4abdc5b46d354fc7d1c9531b2f52dfa` | 原字节一致 |

## 需要区分的变化

1. **Deepseek 根第三方声明变化**：`c38e1a3cead980111422dd79a70f210f440a722a` → `9faa18b7e9dd771935007861e6a1a0a7a223be84`。新增或重分组 npm/Host/workspace 依赖，并新增 Python pypdf 条目；不涉及所选 `.agents/skills` 文件内的实现。根 MIT 未变。完整下载与差异证据保存在 `research/legal-audit/`；当前 `THIRD_PARTY_NOTICES.md` 已明确未收录 Host、vendor 及这些 npm/Python 依赖实现。
2. **modern-web 根 README 全文变化，许可节未变**：`6d3cd6f52e887bab122adc7fef313a30fd0f0df3` → `07c719cb040f12bb1fbe2ac37919a60e885ae5aa`；末尾 License 节逐字相同，仍区分软件代码 Apache 2.0 与 guides 文档 CC-BY 4.0，并保留 MDN/W3C/WHATWG/IETF 来源说明。旧 `SOURCE-README.txt` 可继续作为旧运行版证据；当前材料可引用[新版本许可节](https://github.com/GoogleChrome/modern-web-guidance/blob/2b4aa13a72dd47cd135b06ce5abfccd92e19b24f/README.md#license)。本次未重新抓取 Creative Commons 站点上的许可证文本。
3. **nanobot 根第三方声明未变**：`df3fd21f59bcb127e02f2f7f87ee84126828f557`。所选 memory 技能不因仓库 head 前进而增加程序依赖。
4. **Archify 法律文件分版保留**：旧运行版六份集中副本继续保留；本次材料新增的十份法律原文已由主代理在材料树原路径同步。六份现有集中副本与最新同路径比较结果列于 JSON，其中 `THIRD_PARTY_NOTICES.md` 的变化属于材料新增来源覆盖，不应静默替换旧运行版声明。

该报告记录源文件与范围事实，不改变许可证，也不将未收录的程序依赖列为本仓库已分发内容。
