# 第三方许可声明

本项目新增内容采用根目录 MIT 许可。复制、翻译与适配的材料保留各自版权与完整许可。集中法律原文在 `licenses/`，随本仓库及 npm 包分发；被动来源快照中的 LICENSE、NOTICE 和归属文件另在其原位置原样保留，不因集中分发而删除。安装器不向使用者项目复制、补齐、更新或删除 `.agents/skills-hub-licenses/`，也不触碰已有目标许可目录。技能运行目录不包含来源介绍或法律说明；再次分发技能时必须自行同时保留适用的配套许可，不能假定安装器已复制它们。

| 权利人 | 许可原文 | 本项目使用范围 |
| --- | --- | --- |
| NAMEWTA | [项目 MIT](licenses/PROJECT-LICENSE.txt) | 本项目原创说明、整合与程序 |
| Herdr 贡献者 | [Apache 2.0](licenses/herdr-Apache-2.0.txt) | Herdr 技能完整原件、中文译文与 `system-herdr` 运行适配；已更名并保留本地追加的启动示例 |
| Copyright (c) 2026 DeepSeek | [MIT](licenses/deepseek-harness-MIT.txt) | 知识、归档、写作方法与笔记实例的中文译文及适配 |
| Copyright (c) 2026 Matt Pocock | [MIT](licenses/mattpocock-skills-MIT.txt) | 需求、架构、实施、诊断、审查与写作资料的中文译文及适配 |
| Copyright (c) 2026 Lauren Tan | [MIT](licenses/pstack-MIT.txt) | 当前 `harness/pstack` 所选树中的方法、操作规程与实例；既有运行适配仍保留旧 pstack（含旧 automations）所需许可 |
| Copyright (c) 2026 Elaya | [MIT](licenses/ai-design-skills-MIT.txt) | 完整设计资料的中文译文及适配 |
| Copyright (c) 2026 wta | [MIT](licenses/Speculo-MIT.txt)、[完整第三方通知](licenses/Speculo-THIRD-PARTY-NOTICES.txt) | Speculo 整仓被动快照、中文对照及已有运行适配；MIT 不替代下列嵌套第三方许可或历史文本权利 |
| Copyright (c) 2026 Ting'an Wang | [MIT](licenses/Speculo-skills-hub-MIT.txt) | Speculo 的 12 个 skills-hub 包；同 blob 法律原件集中保留一份，包内原件各自保留 |
| Copyright (c) 2026 Ting'an Wang；Copyright (c) 2026 dualface | [MIT](licenses/Speculo-ste-zh-MIT.txt)、[NOTICE](licenses/Speculo-ste-zh-NOTICE.txt) | Speculo 的 `skills-hub/writing/ste-zh`；保留来源与概念参考边界，不包含 ASD-STE100 标准或词典 |
| Copyright (c) 2026 wta | [eli5 完整通知](licenses/Speculo-eli5-THIRD-PARTY-NOTICES.txt) | Speculo 的 `skills-hub/writing/eli5`，保留 MIT 和教学研究仅作概念参考的边界；`align-intent` 的 MIT 与 Speculo 根许可同 blob |
| Copyright (c) 2026 VoltAgent | [MIT](licenses/awesome-design-md-MIT.txt) | Speculo 内保留的十份 awesome-design-md 分析及其完整中文对照，不授予第三方品牌字体或商标权利 |
| Yosuke Ota；eslint-visitor-keys contributors；Microsoft | [解析器完整许可集](licenses/Speculo-vendor-parsers-NOTICES.txt) | Speculo 内 `optimize-codex-config/scripts/vendor`：toml-eslint-parser 1.0.3（MIT）、eslint-visitor-keys 5.0.0（Apache 2.0）、jsonc-parser 3.3.1（MIT）；均为被动资料，不运行 |
| Lucide Icons and Contributors；Cole Bemis | [Lucide 1.37.0 完整 LICENSE](licenses/lucide-1.37.0-LICENSE.txt)、[取证记录](licenses/Speculo-ASSET-LEGAL-PROVENANCE.txt) | 已镜像 Lucide 1.37.0；精确版本法律原件包含 ISC 及 Feather 衍生图标的 MIT，不能只保留 ISC 名称 |
| Unsplash 摄影来源 | [画廊完整归属原件](licenses/Speculo-gallery-ATTRIBUTION.txt)、[官方许可页原始 HTML](licenses/Unsplash-LICENSE-page.html.txt)、[官方条款页原始 HTML](licenses/Unsplash-TERMS-page.html.txt) | 已镜像三张照片的来源归属及取得时的官方完整条款；不是对照片历史条款版本或额外权利已核实的证明，见下方边界 |
| Copyright (c) 2026 Leonxlnx | [MIT](licenses/taste-skill-MIT.txt) | 设计材料内嵌的额外授权内容 |
| HumanLayer；Copyright 2025-2026 QueryTale, Inc. d/b/a HumanLayer | [Apache 2.0](licenses/humanlayer-Apache-2.0.txt)、[NOTICE](licenses/humanlayer-NOTICE.txt) | PR 资料引用的视觉说明方法；中文译文与运行流程已有修改 |

来源项目、固定修订和贡献者致谢集中见 [README](README.md#致谢与许可)。所有纳入对照的文件可在 [本地资料索引](materials/README.md) 中找到，原件与中文底稿均保留，不需要访问来源仓库才能核对。

## 本次固定来源与法律核对

法律核对使用各路本次固定提交的本地 Git 对象，不检出、不运行来源、不向 `upstream/` 添加范围外文件。集中许可逐字节与对应对象核对；Speculo、Matt 和 pstack 旧集中副本多出的一个末尾空行已恢复为对象原字节。

| 项目 | 本次固定提交 | 核对范围与集中许可依据 |
| --- | --- | --- |
| pstack | `2eaf46574b25cdf7ef8c849837099b866b7438ce` | 仅 `harness/pstack`；该树唯一法律原件为 `claude-code/LICENSE`；仓库根无 LICENSE |
| mattpocock-skills | `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` | 仅 `skills`，集中许可取同版仓库根 LICENSE |
| deepseek-harness | `e8f7b93a344964de3dca1ace9e72b6e4d6de87cb` | 仅 `.agents/skills`，集中许可取同版仓库根 LICENSE；根第三方通知涉及未收录的 Host、vendor、npm、Python 分发，不因文档中的引用引入这些依赖或扩大收录 |
| ai-design-skills | `456d9e0d3e2d84c748bb143c6ca3d90c45e16213` | 仅 `skills`，集中许可取同版仓库根 LICENSE；原有 taste-skill 额外授权继续保留 |
| speculo | `994a64427a6784053dd092a86713870062cfde2f` | 整仓；根 LICENSE、第三方通知及全部嵌套 LICENSE / NOTICE / ATTRIBUTION 依据如上，不能仅按一份 MIT 处理 |
| herdr | `ee5bfb5041bb3e4a49d591c72308aae3c81ecdde` | 仅 `skills/herdr`，集中许可取同版仓库根 LICENSE |

本次 Speculo 全树按 LICENSE / NOTICE / THIRD-PARTY-NOTICES / ATTRIBUTION 类文件名枚举到 21 个法律与归属文件，合计 9 个不同 Git blob；这 9 个 blob 均在集中目录找到原字节相同的副本（原有根 MIT 一份，新增八份）。这只证明快照现有声明的完整保留，不证明未附第三方条款或历史语料的权利已经闭合。

Speculo 的 12 个 Ting'an Wang MIT 包包括 automation/grok-bot-team-steward、coding/{gitea-repo,github-repo-steward,vscode-fullstack}、design/photo-retouch、system/{clash-client-profile,linux-dev-disk-cleanup,optimize-codex-config,proxy-region-locale,system-health-audit,windows-dev-disk-cleanup}、writing/job-application，均相对其 `skills-hub/`。十份设计分析的内嵌来源修订是 `c7c1bada4eda972236d124e06ee58df129a9266b`；这是 Speculo 固定快照中记录的来源，不另行升级该来源。

### 第三方资产与历史文本的边界及未闭合事项

本次补充只为已纳入 Speculo 资产履行法律原文保留义务，不新增第七个材料项目，不扩大六个材料来源根，不升级来源或整合新技能。补充文件仅在 `licenses/`；固定 Speculo 快照、运行技能与安装器不变。[完整取证记录](licenses/Speculo-ASSET-LEGAL-PROVENANCE.txt)列出每个 URL、UTC 取得时间、响应字节数及 SHA-256。

`assets/lucide.js` 文件头及归属原件共同指定 `lucide v1.37.0`。已核实官方 npm 注册表与该精确版本 CDN 的包身份均为 `lucide@1.37.0`，来源库为 `lucide-icons/lucide`。注册表 SLSA 声明指向提交 `796dad298f8d78c5da204c3e62a5ed93c2bfcd1e`；已读取其内容，但未独立验证声明的密码学签名或透明日志。精确版本 `https://unpkg.com/lucide@1.37.0/LICENSE`、官方来源库标签 `1.37.0` 的 LICENSE、该提交的 LICENSE 三者响应均为 **3208 字节、SHA-256 `b495047bd93a9b06913511076f504daba17d5bbeb3e0650f3bb53a4220329c57`**，原字节保存在集中目录。全文除 Lucide ISC 外还包含 Feather 衍生图标名单及 Cole Bemis MIT，均完整保留；未套用最新许可证，也未下载程序包来重新比对镜像 JS，因此镜像身份依据仍是其声明头与固定版本法律／元数据一致性。

Speculo 原通知明确说明软件许可不授予第三方品牌字体、照片、商标的额外权利。画廊归属原件记录三张 Unsplash 照片 ID：`1497366754035-f200968a6e72`（Proxyclick Visitor Management）、`1470770841072-f978cf4d019e`、`1500530855697-b586d89ba3ee`。已从官方 `https://unsplash.com/license` 及 `https://unsplash.com/terms` 保存完整 HTML 响应正文原字节（2026-11-12 UTC 取得；不执行其中脚本）。许可页为版权许可，条款第 5 节明确排除照片所含商标、可辨识人物及艺术作品等额外权利；完整条款中的其他限制也不因本摘要而省略或失效。保存官方条款不等于取得人物／商标等额外授权。

Unsplash 页面是取得时的在线版本，尚未核实三张照片各自上传／下载或 Speculo 固定快照时适用的历史条款版本，不能将现行页面冒称固定历史许可。照片特定权利清理及历史版本确认仍是明确缺口，不能声称全部第三方资产已完成法律清理。历史文本同样不主动添加任何自造许可。

`template/workflows/person/person-m-mao-zedong-cognitive-os/books/src/` 是历史文本来源语料。Speculo 原通知不声称作者身份或重新授权；本项目也不以 MIT 将这些文本重新授权。完整收录快照不是对其全部第三方权利已获授权的承诺；再次分发相应材料前，应单独核实适用权利与条件。历史研究链接及概念参考也不自动变为可全文转载的许可。

Herdr 许可原文固定于提交 `ee5bfb5041bb3e4a49d591c72308aae3c81ecdde` 的根目录 `LICENSE`，Git blob 为 `261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64`；该修订无上游 `NOTICE` 文件。本次仅收录技能文档，不收录其程序或 vendor 组件。

许可原文保持原语言和原始版权声明，中文技能正文不能替代法律原文。对照资料中保留的署名和链接属于历史原件内容，不是运行时外部依赖。

仅参考写作或技术原理、未取得全文转载许可的文章不作全文转载。本项目提供自己的本地说明；来源致谢不表示取得来源仓库未授权目录的复制许可。

PR 原件附带的贡献者声明已完整保存在对照资料，README 集中致谢。Apache 许可原件的 Git blob 为 `d645695673349e3947e8e5ae42332d0ac3164cd7`，NOTICE 为 `9671676ba14c852a29dd87f22d2b63f207f0b941`，核对日期 2026-11-07。NOTICE 列出的其他软件组件没有随本项目收录。
