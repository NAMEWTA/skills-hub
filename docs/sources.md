# 来源与改编说明

研究日期：**2026-11-07**。以下文件均在固定修订下读取，避免上游更新后无法说明本版本来自哪里。详细方法保留在各技能的 sources/NOTICE 与对应参考文件中。

## 固定来源

| 来源 | 固定提交 | 使用范围 |
| --- | --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/tree/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/.agents) | `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` | Agent Notes、归档、源码引用和技能写作 |
| [Matt Pocock Skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills) | `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` | 访谈、规格、切片、领域、架构、实施、审查、诊断 |
| [Cursor pstack](https://github.com/cursor/plugins/tree/8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b/pstack) | `8ecfb19f844b67a4bc7af7f66c366d57bc7b6d2b` | 生产开发方法；只复用有独立 MIT 的 pstack 范围 |
| [Elaya AI Design Skills](https://github.com/elayadesign/ai-design-skills/tree/456d9e0d3e2d84c748bb143c6ca3d90c45e16213) | `456d9e0d3e2d84c748bb143c6ca3d90c45e16213` | 完整保留 landing-page-design 与 figma-designer 原文 |
| [Speculo](https://github.com/NAMEWTA/Speculo/tree/9199c3bd0cf983c131efbc6340e44ac8b83a583d) | `9199c3bd0cf983c131efbc6340e44ac8b83a583d` | 目录职责与系统维护方法参考；不复制工作流引擎 |

Matt 当前目录已分为 `skills/engineering/`、`skills/productivity/` 等；`grill-me` 是入口，完整访谈方法在 `grilling`。本仓库按实际文件读取，未按旧路径猜测内容。

## 开发技能逐项映射

下表路径相对对应来源仓库根目录；技能列链接到随安装包保留的完整来源说明。

| 本地技能 | 主要上游路径 | 保留的实质方法 |
| --- | --- | --- |
| [dev-workflow](../skills/dev/dev-workflow/SKILL.md) | pstack `skills/poteto-mode/` 下主入口与 session-pickup、shipping；路径前缀为 `pstack/` | 按目标推进、恢复上下文、区分已写代码/已验证/已合并/已部署 |
| [dev-intake](../skills/dev/dev-intake/SKILL.md) | Matt `skills/engineering/triage/SKILL.md` | 阅读上下文、重复/已有实现判断、保留已解决与待决问题 |
| [dev-grill](../skills/dev/dev-grill/references/sources.md) | Matt `skills/productivity/grilling/`、engineering 下 domain-modeling、wayfinder | 决策树、按依赖展开的问题前沿、事实自己查证、给出建议 |
| [dev-spec](../skills/dev/dev-spec/references/sources.md) | Matt engineering 下 to-spec、triage/AGENT-BRIEF | 从共识综合问题、场景、契约、非目标与具体验收 |
| [dev-plan](../skills/dev/dev-plan/references/sources.md) | Matt to-tickets、wayfinder；pstack feature、multi-phase-plan | tracer-bullet 垂直切片、真实阻塞、重构整合边界 |
| [dev-architecture](../skills/dev/dev-architecture/references/sources.md) | Matt codebase-design、domain-modeling；pstack architect | 深模块、调用方用法先行、不同结构比较、所有权与少量 ADR |
| [dev-build](../skills/dev/dev-build/references/sources.md) | Matt implement、implement-spec；pstack feature、refactoring、autonomous-run、orchestrate | 任务前沿、独立归属、上下文指针、完整实现和实际制品证据 |
| [dev-review](../skills/dev/dev-review/references/sources.md) | Matt code-review；pstack interrogate、blast-radius | Spec / Standards 两轴、十二项审查基线、跨 diff 影响与证据 |
| [dev-debug](../skills/dev/dev-debug/references/sources.md) | Matt diagnosing-bugs；pstack bug-fix | 运行复现、可证伪假设、紧凑观察、撤销无效试探、同场景验证 |
| [dev-deploy](../skills/dev/dev-deploy/SKILL.md) | pstack shipping；Speculo ops-d-project-deploy 仅参考 | 实际交付结果、当前制品、环境记录、业务检查与恢复限制 |
| [dev-learn](../skills/dev/dev-learn/references/sources.md) | DeepSeek notes/README、dsh-prose-standard；Speculo learn 仅参考 | 代码是现状依据、完整业务路径、理由与实现分开、可更新导读 |
| [dev-archive](../skills/dev/dev-archive/references/sources.md) | DeepSeek dsh-archive-agent-notes、notes/README、implemented/AGENTS | 未来决策价值、当前事实更新、完整/部分替代、保留独有理由、修复入链 |

以上是忠实方法适配与中文整合，**不是声称上游正文逐字复制**。涉及用户明确约定时修改执行方式，并在来源文件中说明差异。没有把上游每个技能都无区别地装入开发领域。

## UI 原文保留

| 上游原文件 | 本地完整副本 | 上游 Git blob |
| --- | --- | --- |
| `skills/landing-page-design/SKILL.md` | [dev-ui-design 的 landing 原文](../skills/dev/dev-ui-design/references/landing-page-upstream.md) | `519a6f2cd6c942c2fb36a906b8ef7d11f78ba6d1` |
| 同上 | [dev-figma-design 的 landing 原文](../skills/dev/dev-figma-design/references/landing-page-upstream.md)，保证单独安装可用 | 同上 |
| `skills/figma-designer/SKILL.md` | [dev-figma-design 的 Figma 原文](../skills/dev/dev-figma-design/references/figma-upstream.md) | `d9aba588919e3dccee89355df8fa8501c2e92eae` |

上述副本逐字保留且核对了 Git blob 摘要。保留了营销目标与文案、布局方案、完整 token 表、逐节构建、动效、视觉验收，以及 Figma 的实际变量绑定、两层语义颜色、Foundations、Auto Layout 与组件状态。中文入口负责选择材料和接入项目，不用几句泛泛要求替代原文。

必要适配仅在入口说明：已有项目设计系统优先；营销结构不强加给后台；工具名依照实际宿主；真实证明与价格不能编造；SDD 与独立安装约定优先。完整原文的原始名称保留在参考文件中，它们不是额外注册的技能。

## system 的参考范围

| 本地技能 | Speculo `skills-hub/system/` 下读取范围 | 本地处理 |
| --- | --- | --- |
| [system-inspect](../skills/system/system-inspect/NOTICE.md) | system-health-audit 与 platforms | 保留真实主机、只读取证、区分观测与假设，新增轻量离线脚本 |
| [system-cleanup](../skills/system/system-cleanup/NOTICE.md) | linux-dev-disk-cleanup、windows-dev-disk-cleanup 及各自 workflow | 合并平台入口，保留准确对象、缓存/数据区分、前后测量和恢复 |
| [system-proxy](../skills/system/system-proxy/NOTICE.md) | clash-client-profile 的客户端、故障、DNS、网络参考 | 保留分层诊断与源配置意识，不固定提供商或过时通用配置 |
| [system-config](../skills/system/system-config/NOTICE.md) | optimize-codex-config、proxy-region-locale 及平台参考 | 保留版本/作用域、加载优先级、最小字段修改、备份和恢复 |

Speculo 仅用于方法与目录职责参考，没有复制其脚本、JSON 计划引擎、schema、状态机或执行网关。系统内容重新组织为短入口与按需平台参考，完整保留其 MIT 署名。

另核对 [MetaCubeX 官方 DNS/TUN 文档](https://github.com/MetaCubeX/Meta-Docs/tree/2a6ba6b04a9eecdbe5c88c4e4a09776659c0878b/docs/config)，特别是 `dns/index.md`、`dns/type.md` 与 `inbound/tun.md`。具体配置必须以使用者实际版本为准；本仓库没有复制官方文档或固化一份万能 Mihomo 配置。

## 明确做过的取舍

| 上游情况 | 本地选择及原因 |
| --- | --- |
| Matt / pstack 某些实施与 debug 步骤要求 TDD | 用户明确禁用，替换为规格 → 实现 → 必要验证；保留诊断复现 |
| pstack 固定模型、代理类型、并行数量和宿主工具 | 保留分工与独立判断方法，按实际工具能力执行 |
| 某些步骤总是要求确认、发布评论或创建工单 | 已有授权持续有效；对外动作必须来自当前任务意图 |
| DeepSeek 双语三件套、固定分类与冻结封印 | 保留知识价值和替代判断，去掉特定仓库的机械约束 |
| 原 to-spec 避免路径 | 按本项目要求把代码引用放在独立“当前证据”位置；不让路径替代语义契约 |
| Speculo 复杂工作流引擎 | 只参考目录职责，使用 Markdown、代码引用和 Git 历史 |
| UI 原文包含宿主依赖与鲜明默认风格 | 原文完整保留；本地入口限定适用场景、项目优先级和能力边界 |

## 技能与记忆写作文章

- [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)：准确触发、按需加载、减少强制路径、定义完成目标。
- [Harness engineering](https://openai.com/index/harness-engineering/)：短 AGENTS 作为导航、仓库内知识与持续文档维护。

文章用于指导组织方式，没有将全文复制为技能资源。长期记忆的最终方案详见 [知识与记忆](knowledge.md)。

## 后续更新上游

先固定新修订并比较真正使用的来源文件，检查方法和许可证变化，再更新对应技能。保留用户约定和兼容的衔接；原文副本保持完整并更新摘要。最后检查独立安装、资源链接、SDD 禁令与真实行为，不把“同步上游”变成未经判断的整仓覆盖。
