---
name: dsh-translate-docs
description: 手工运行扩展 DeepSeek Harness 双语文档流程，包括生成简报、委派文字翻译、全文翻译及限定范围配对验证。
disable-model-invocation: true
user-invocable: true
---

# 翻译 DeepSeek-Harness 文档

## 调用边界

只有用户明确按名调用 `dsh-translate-docs` 才运行扩展流程。普通文档工作、从另一技能或推断翻译需求时，绝不选择或加载它；日常翻译遵循 [docs/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md)的一次调用、一遍处理规则。

## 本技能是什么

**本技能是指导，不是翻译记忆库。** 它是让 `foo.md ↔ foo.zh.md` 双语对一致、两种语言自然的流程地图。两种语言同等权威：任一侧可编写变化，该侧即此次更新来源。你是译者：以下规则说明必须成立什么，不规定具体句子怎么措辞——措辞判断归你，术语不是。

## 按变化类型分流——决定后续一切

- **更新**（已有双语对，一侧修改）：走[更新路径](#更新路径简报驱动)。由简报驱动，有意低成本：不读指导语料，不做 Git 考古，最小修改对应页。绝不为一次更新重译全文；最小更新保留未变内容已审措辞，重译会抛弃这些审查。
- **新双语对**（尚无对应页）：走[全文路径](#全文路径新双语对)。
- **删除或重命名文档**：对应页及 `.i18n.yaml` 一起删除或重命名，否则门禁报告配对不完整。

`.agents/notes/archived/` 下冻结 Agent Notes 不属于翻译工作。完整三文件组由归档验证器封存；归档后绝不更新、重新记录或修复任一侧。

## 更新路径（简报驱动）

简报驱动路径用小部分成本达到指导语料质量；已归档的[简报更新 Agent Note](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/process/2026-07-26-briefed-minimal-translation-updates.md)记录基准证据。

1. **生成简报：** `pnpm run gen-translation-brief <any file of the pair>`（不带参数为所有失同步双语对生成）。简报按最窄安全对齐粒度映射变化：先是变化 Markdown 单元（段落、表行、列表项、标题），再整节，再全文；含编写侧自最后确认一致状态以来差异，每个变化单元最后确认来源、当前来源、当前对应文字（含行号）、涉及术语行、首次出现移动提示及绑定更新规则摘要。
2. **只有机械差异？用 `--apply`。** 全部变化都在双语共享、字节相同代码围栏内时，简报会说明；`pnpm run gen-translation-brief --apply <pair>` 将编辑后的围栏拼入对应页，写前验证结构；无需子 agent，无需手改。
3. **文字差异？传简报委派子 agent**（或传生成命令）。简报是译者全部工作集；子 agent 不重读指导语料（规则摘要、术语行及变化单元三方上下文均内嵌），也不重新推导差异。只有简报确实无法回答具体决定时，才升级到全文路径的真实依据：周围无先例的未列术语，或全文简报（`BOTH sides changed`，或单元与章节都无法对齐），后者始终意味着按 [translation-rules.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/translation-rules.md)手工协调。
4. **覆盖差异的最小编辑。** 保留差异未触及部分已审措辞，然后逐子句对照源验证变化区块：无增无漏、术语遵循内嵌行、代码片段逐字保留。
5. **限定范围记录及验证：** `pnpm run verify-translation-pairing --write <pair>` 后运行 `pnpm run verify-translation-pairing <pair>`。`--write` 准确指定已确认双语对；拒绝裸运行，因此批量重新记录始终需显式 `--all`。全语料检查仍在 `doc-sync`／CI 跑，不逐更新运行。

## 全文路径（新双语对）

需要从头翻译时，编排 agent 不翻译：启动子 agent 完成。译者先读以下真实依据，再将全文译到另一语言；长文逐节，边译边锁定源结构，而非最后修结构。

### 真实依据（阅读，不重写摘要）

- **[docs/i18n/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/README.md)**——配对约定：三文件组（`foo.md`、`foo.zh.md`、`foo.i18n.yaml`）、逐节哈希一致性记录、语言切换行、范围及排除。
- **[docs/i18n/translation-rules.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/translation-rules.md)**——如何翻译：忠实、保留结构、术语纪律、排版（MUST／SHOULD 级别）。
- **[docs/i18n/terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/terminology.md)**——双向绑定的术语表。翻译前加载，不是感觉不确定才加载；没注意到的术语才会漂移。
- **[docs/i18n/translation-prompt.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/translation-prompt.md)**——自动流水线经校准、机器消费模板。使用本技能的 agent 不渲染它；自动渲染器唯一注入的仓库文件是术语表，而本技能及 `translation-rules.md` 对 agent 编写翻译仍有约束。
- **[dsh-prose-standard](../dsh-prose-standard/SKILL.md)**——必需文字覆盖及编辑判断。双侧均应用，不增删源命题。

### 翻译

- **第一遍——写作，不机械转置。** 读语义单元，再按最近[风格样本](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/style-samples.md)语域，以母语技术作者方式重述。保留必需框架，不强求逐句对应。
- **第二遍——逐子句对照源验证。** 忠实在此检查，不是写作方式：确认无增无漏、每个术语遵表、每个代码片段逐字存留。以母语重写句子修正，不往里补词。
- **单独读成品对应页。** 对照源后，不把源放旁边读译文，重写只有独立阅读才显别扭的措辞。
- 文件只写最终文字，不写草稿或笔记。
- [terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/terminology.md)每个术语严格按指定译法。中文目标用中文及首次出现列；未列术语需可引用的中文开源／厂商先例，否则保持英文并列入「待定术语」。英文目标用英文列及既有英文技术术语；源词有歧义则保留并加简短释义，列为待定。不行内发明译法。
- 双语代码块字节相同，包括注释。仓库相对文档链接保持同一语义目标及准确查询／片段后缀：活动双语语料目标英文侧用 `.md`，中文侧用 `.zh.md`；范围内缺对应页是错误；语料外保留编写路径；语言切换器仍是跨语言例外。
- 配对门禁检查标题深度、围栏块、表行列数、列表种类、有序列表起点、列表项数、链接语言及语义目标。第二遍手工验证列表及表格顺序、非规范编号、行内代码、强调、含义、术语及语气。

## 找出工作

- `pnpm run verify-translation-pairing --list` 打印每份范围内文档 missing／out-of-sync／ok。缺失及失同步违反约定，正常检查拒绝它们。
- 无参数 `pnpm run gen-translation-brief` 打印所有失同步双语对简报。
- 编辑双语文档的 PR，工作列表就是 diff：每个变化侧都需在同一 PR 更新对应页并重录配对，忘记则门禁变红。

## 完成双语对

1. 切换器：中文文件 H1 后紧接 `[English](foo.md) | 中文`，英文 H1 后 `English | [中文](foo.zh.md)`；新双语对都加，但生成器负责的英文源应与生成输出字节相同并省略切换器，中文页仍链接回来。
2. 记录一致性：`pnpm run verify-translation-pairing --write <pair>` 重算逐节哈希，记录到 `foo.i18n.yaml`。PR 的 yaml 差异是可审查的“我确认二者说相同内容”声明；真正确认后才运行。
3. 普通文档无需清单条目：每个范围内来源都需配对。只有负责政策记录了真正的生成、指令性或构造即双语排除时，才改 [scripts/translation-pairing.manifest.json](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/scripts/translation-pairing.manifest.json)。
4. PR 前：受影响双语对通过限定检查；按 [dsh-pre-push-checks](../dsh-pre-push-checks/SKILL.md)，`pnpm run doc-sync`（含全语料配对及 `verify-md-wrap`／`verify-md-links`）在 PR 级别运行一次，不放每次翻译任务内。
5. 保持 PR 可审查：说明哪些是新双语对、哪些是最小更新，显著列「待定术语」。

## 如何回应翻译评审

遵循[代码审查报告指导](../dsh-code-review/SKILL.md#报告发现)：按价值评估每项意见。术语意见记住术语表是约定；把评审者译法决定应用到 [terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/i18n/terminology.md)，不只改单文件。
