# Home 来源与适配

本页区分实际采用的方法与研究参考。固定来源版本只由[材料父清单](../../materials/manifest.tsv)维护；逐文件原件、完整中文对照、Git blob 与运行路径见对应子清单。Home 运行包不依赖本页或 materials。

## 运行采用

| 来源 | 已采用的方法 | 本项目适配 |
| --- | --- | --- |
| [Matt chief-of-staff](../../materials/mattpocock-skills/upstream/in-progress/chief-of-staff/SKILL.md) 与[中文底稿](../../materials/mattpocock-skills/zh/in-progress/chief-of-staff/SKILL.md) | 直接负责人、稀疏上下文指针、已有知识库优先、主题互链与有日期的来源 | workflow 管理直接项目交付；knowledge 保存现行主题，history 保存当时事实。移除强制所有工作交子代理、固定回顾比例、自动日程和跨包相对加载；各层方法按实际用户选择调用 |
| [Matt handoff](../../materials/mattpocock-skills/upstream/productivity/handoff/SKILL.md) 与[中文底稿](../../materials/mattpocock-skills/zh/productivity/handoff/SKILL.md) | 新会话接续摘要、下一重点、建议方法、引用已有产物与脱敏 | history 提供普通 Markdown 接续说明，沿用现有协调 owner；原会话身份和恢复归原方法，摘要不冒充 native resume |
| [nanobot memory](../../materials/nanobot-memory/upstream/SKILL.md) 与[中文底稿](../../materials/nanobot-memory/zh/SKILL.md) | 相关页按需读取、来源不是上位指令、保存已确认长期价值、写前读原文、修复引用、回读后报告，按主题/时间查看相关历史 | 配置交 setup，项目内部知识交项目；知识/历史使用 `.agents/home/` Markdown，不读取或写入其原生 JSONL、cursor、global memory 或 Dream 运行时 |
| 本仓 [dev-setup](../../skills/dev/dev-setup/SKILL.md) | 配置意图、环境能力与真实运行结果分别取证 | home-setup 保存 Home 用户明确选择，只有明确设置才存在 Home 默认。dev 原有技能、模板与方法保持不变 |
| 用户实际选择的派遣方法，例如 [system-herdr-core](../../skills/system/system-herdr-core/SKILL.md) | 已有任务投递、身份、观察、恢复、回收与本层持久化协议 | 读取当地已安装入口并调用；home 不复制其实现，不安装依赖，不统一所有层的 CLI 或记录根 |

Matt 的新增 Home 采用关系附加到[已有清单](../../materials/mattpocock-skills/manifest.tsv)，不改原有 dev 采用关系和快照。nanobot 使用独立的[来源单元](../../materials/nanobot-memory/manifest.tsv)。自有 Node 工具实现本 Issue 的结构检查、写入与检索合同，没有复制其他项目的后台服务或数据库实现。版权和许可原文归[第三方声明](../../THIRD_PARTY_NOTICES.md)。

## 研究依据

完整研究、固定源码链接与可访问性说明保存在 [Issue #2 第 15、21 节](https://github.com/NAMEWTA/skills-hub/issues/2)。以下资料解释设计取舍，不代表已复制其实现、安装其产品或验证所有宿主版本。

| 研究入口 | 对 Home 的取舍 |
| --- | --- |
| [Home Repo Pattern](https://www.aihero.dev/the-home-repo-pattern) | 短地图、带用途的项目指针与当地项目自治；不是通用 CLI 派遣协议 |
| [OpenAI Codex memories](https://learn.chatgpt.com/docs/customization/memories)、[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[memory 与 compaction](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction) | Home 自己的 Markdown 保持真源；原生 recall、会话和压缩对象分别说明，不同步厂商私有存储 |
| [Claude Code memory](https://code.claude.com/docs/en/memory)、[skills](https://code.claude.com/docs/en/skills) | 按需主题读取；同仓逐技能目录链接提供发现入口。文件可读与实际宿主发现分别验收 |
| [Gemini Auto Memory](https://geminicli.com/docs/cli/auto-memory/)、[Google ADK Memory](https://adk.dev/sessions/memory/) | 候选与当前有效知识分开；无需后台提取器或 Memory Bank |
| [Grok Build memory](https://x.ai/news/grok-build-memory)、[固定实现](https://github.com/xai-org/grok-build/tree/2bdd1d6a6369de0e8c68132ea4539e9abd9e14a8) | 当前要求优先、来源/观察时间、读后修改、有界索引和防重新摄取；不复制 Rust 运行时，不把 durable state DB 当作索引缓存，不采用剥离 Git host 的身份算法 |
| [Orca 月度 journal](https://github.com/stablyai/orca/blob/8f97cb210f601d8381a59589a3a97bc43b539a7e/src/main/bots/bot-memory-journal.ts) | 区分当时业务事件、知识修改审计和原生会话；不复制 Bot 控制面或中央技能聚合 |
| [OpenClaw provenance](https://github.com/openclaw/openclaw/blob/79e42e0877d9e3641e365b17517b9f19e0c4320a/docs/concepts/memory-provenance.md) | 清理已有派生内容与阻止未来摄取分别处理；忘记报告列出实际范围，不宣称清除未触达原件或备份 |
| [devrig index](https://github.com/lakpriya1s/devrig/blob/414eb1cfaeab86628f1cf4c2461ce8c79b893525/scripts/build-knowledge-index.mjs)、[Node.js fs.symlink](https://nodejs.org/docs/v22.14.0/api/fs.html#fssymlinktarget-path-type-callback) | 可重建的索引显式接收根目录。安装器使用 Node 标准库创建目录符号链接。错误处理见 [安装契约](../usage/installation.md#平台与工具)。 |

网站文章的许可不由关联代码仓推定。研究参考没有被当作整仓代码收录；后续若复制新的 source unit，先固定版本、保留原件与必要中文对照，再补运行映射和法律归属。不得因 Home 新增方法而刷新其他领域的共享快照。

## 维护入口

- 业务职责和字段归属见[方法归属](method-ownership.md)。
- 实际行为、平台和宿主范围见[验证说明](validation.md)，单次结果保存在所属 Change。
- 来源更新沿用[材料维护](../../materials/README.md)，运行方法先核对实际差异再更新 reviewed 标记。
