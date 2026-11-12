# 召回探针组

针对[分类](../SKILL.md#分类)的探针，在 2026-08 清理时调校。每次命中都需语义判断：有意多匹配，天然又会漏匹配；清理每轮评审都发现所有探针漏掉的案例，因此还要不带模式阅读范围内最密文字。

## 调用规则

- 加 `--hidden --glob '!.git/**'`，使 `.agents/` 被搜索；ripgrep 默认跳过点目录，清理最大的漏检风险是 Agent Notes。
- 排除放最后，避免后续包含重新接纳：`--glob '!vendor/**' --glob '!node_modules/**' --glob '!.agents/notes/archived/**' --glob '!.agents/skills/dsh-trim-cot-leakage/**'`（技能自身引用泄漏措辞作校准），再加范围内记录夹具及快照目录。[负责参考](../SKILL.md)也会因引用证据命中自身；按证据而非实际使用判断。
- 自然语言行带 `-i`，命中句首大写（“This PR adds…”、“Probably fine…”）；首行匹配代码模式，保持大小写敏感，`-i` 会把 `\bT\d\b` 及 `\bP-I\b` 变成噪声。
- 对完整短语设边界。`\bthis PR\b` 应匹配 “this PR adds”，不匹配 “this project”“this process” 或 “this provider”。
- 零命中模式在命中已知正例前不证明任何事；嘈杂模式在排除近似反例前也不证明任何事。信任语料结果前，两者都校准。
- 写作语言探针针对相反语言表面：在本应英文的 Markdown、代码注释／JSDoc 查中文残留；在 `*.zh.md` 查中文变更叙述。通用 ASCII 搜索中文文字内英文残留，会因代码及标识符太嘈杂；改为与对应页比较新增文字。

## 英文探针组

```sh
rg -n --hidden '\(decision \d|\(audit [A-Z]\d|design §|plan §|design ledger|\(B ruling|\bP-I\b|\bW\d\b|\bT\d\b' ...
rg -n --hidden -i '\bthis PR\b|\bthis branch\b|\bthis stack\b|\blater PRs?\b|\bprevious commits?\b|\bthis commit\b' ...
rg -n --hidden -i '\bused to\b|\bno longer\b|\bpreviously\b|\bthe old\b|\bwas renamed\b|\bwas moved\b' ...
rg -n --hidden -i '\bv1\b|this cut|\bcut \d|\btoday\b|\bfor now\b|roadmap' ...
rg -n --hidden -i 'rejected in review|review round|reviewer|as of v\d' ...
rg -n --hidden -i 'probably |should be enough|should suffice|it simply|is safe —|is safe --' ...
rg -n --hidden '§\d' ...
```

## 中文探针组

```sh
# 中文对应页中的变更或评审叙述。
rg -n --hidden '评审|上一?轮|旧版|老的|不再|以前|本版|遗留' --glob '*.zh.md' ...

# 英文 Markdown 中混入的中文写作语言。
rg -n --hidden '设计稿|评审|上一?轮|旧版|老的|不再|以前|本版|遗留|私有|(^|[^a-zA-Z])端([^a-zA-Z]|$)' --glob '*.md' --glob '!*.zh.md' ...

# 英文代码注释及 JSDoc 中混入的中文写作语言。
rg -n --hidden '(^[[:space:]]*(//|/\*|\*)|//|/\*)[^\r\n]*(设计稿|评审|上一?轮|旧版|老的|不再|以前|本版|遗留|私有|端)' --glob '*.{ts,tsx,js,jsx,mjs,cjs,css}' ...
rg -n --hidden '#[^\r\n]*(设计稿|评审|上一?轮|旧版|老的|不再|以前|本版|遗留|私有|端)' --glob '*.py' ...
```

## 已知误报家族

清理时判断并保留；预期还会出现：

- **工具用途的 “used to”**——“the key used to sign requests” 表用途，不表时间。时间形式之前有主体状态（“colors used to come from…”）。
- **运行新旧**——“the old connection drains before the new one accepts” 指交接中的活对象，不指仓库状态。
- **流程文档中的 “This PR”**——*关于* PR 流程的文档（“PR 正文应该……”、模板、仓库流程笔记）可合理说 PR；禁令针对文档采用某个 PR 对代码的视角。
- **协议或路径段的 `v1`**——`/v1/chat` 端点及传输格式名是标识符，不是版本印记。
- **有已提交负责者的 `§N`**——外部标准（RFC 9110 §10.1.5）及自行负责 § 编号的已提交文档，仍可按节引用。
- **对比性 “actually” 及名词 “wait”**——普通英语，不是含糊；已提交探针不查它们，只有扩大含糊模式时才出现。
- **运行时 “today” 及记录时间戳**——询问当前日期的提示或测试使用自然时间，不是仓库版本印记；记录 CLI 输出保留原语气。到达模型或用户的措辞，编辑前仍遵循行为证据规则。
- **中文文字里的“本版本”**——在版本化产物上下文中是 “this release” 的合法译法；被禁的是对应 “this cut” 的裸印记“本版”。
- **已考虑替代方案节**——Agent Note 对应文体位置内的“拒绝”是获准位置，不是评审编排。
