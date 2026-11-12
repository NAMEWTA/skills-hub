# 元数据、链接及双语对

## 概要

README 元数据是检索与模板选择接口，不是微型报告或广告。`kind` 字段恰好选择本技能中存在、映射到文档标准的一份 README 模板；frontmatter 不携带已由文件名约定或实际门禁负责的字段。双语页权威相等，结构一一对应，物理行精确对齐。`*.i18n.yaml` 配套文件记录最后确认的配对，支持自动合并。链接语法必须在 GitHub 与文档网站正确渲染，因此仓库链接使用对渲染器有效的相对 URL。

## 目录

- [README 元数据](#readme-元数据)
- [kind 系统](#kind-系统)
- [描述质量](#描述质量)
- [仓库链接及路径提及](#仓库链接及路径提及)
- [双语行对齐](#双语行对齐)
- [双语一致性记录](#双语一致性记录)
- [开发笔记](#开发笔记)

## README 元数据

每份人工 README 以 YAML frontmatter 开始。允许自定义字段，但通用字段应足够稳定，便于搜索及索引。

```yaml
---
description: "供用户与维护者选择、配置或调试此包的示例能力。"
kind: "package-reference"
---
```

包 README 双语对必须有 `description` 与 `kind`。页面标题和包清单已负责名称，文档任务及读者路径已表达受众，在 frontmatter 重复二者没有检索价值。对应路径来自同目录文件名（`README.zh.md`），配套文件负责配对状态，因此 README 内的 `i18n` 元数据冗余。仓库负责的分类法及搜索消费者尚未证明 `tags` 相比描述和全文搜索有额外价值前，不添加它。除非已有负责者定义其他拼写，键使用小写连字符；不把易变代码清单复制进 frontmatter。

## kind 系统

`kind` 直接选择文档模板；每个 kind 恰好映射本技能内存在的一份模板，没有无 kind 的模板。`docs/persistence-changes/YYYY-MM-DD-slug.md` 使用 `persistence-change`；`docs/persistence-changes/releases/dsh-v*.md` 使用 `persistence-release`；`docs/persistence-changes/historical-formats/vN.md` 使用 `persistence-format`。中文对应文件使用同一 kind。`docs/upgrade-guide/v<version>/<item>/guide.md` 及 `guide.zh.md` 使用 `upgrade-guide`。目录 README 是索引，不是记录。按此顺序机械推导包 README 的 kind：

1. README 是 `packages/README.md` 或 `packages/<group>/README.md` → `package-group`。
2. 包清单声明 `dsh.bundle.patch` → `package-bundle`。
3. 包位于 `scripts/doc-standard.spec.ts` 的已审计库注册表 → `package-library`。
4. 其他所有情况，即默认导出的服务或 `apply` 插件 → `package-reference`。

| `kind` | 仓库位置 | 模板 | 标准 |
|---|---|---|---|
| `package-group` | `packages/README.md`、`packages/<group>/README.md` | [package-group.md](../templates/package-group.md) | 分组地图：介绍能力家族、映射直接包含的包、解释组合关系，并链接包自己负责的细节。 |
| `package-reference` | 具有插件入口的 `packages/<group>/<package>/README.md` | [package-reference.md](../templates/package-reference.md) | 包约定：遵循[包 README 审查标准](review.md#包-readme-审查)及规范的[包文档要求](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/cookbook/adding-a-package.md#4-write-the-package-readme)。 |
| `package-library` | 具有普通模块入口的 `packages/<group>/<package>/README.md` | [package-library.md](../templates/package-library.md) | 库约定：消费者入口及限制；没有配置档安装路径或挂载配置。 |
| `package-bundle` | 声明 `dsh.bundle.patch` 的 `packages/<group>/<package>/README.md` | [package-bundle.md](../templates/package-bundle.md) | 可安装层：已验证的 `dsh plugin` 安装路径、层语义及补丁文档。 |
| `persistence-change` | `docs/persistence-changes/YYYY-MM-DD-slug.md` 及中文对应文件 | [persistence-change.md](../templates/persistence-change.md) | 历史确认：机械检测的类型变化、逐根前驱引用、兼容性决定及生成的变更后模式。 |
| `persistence-release` | `docs/persistence-changes/releases/dsh-v*.md` 及中文对应文件 | [persistence-release.md](../templates/persistence-release.md) | 回溯观察：固定标签、相邻前后摘要、实际版本常量及变化后的模式；不是兼容性确认。 |
| `persistence-format` | `docs/persistence-changes/historical-formats/vN.md` 及中文对应文件 | [persistence-format.md](../templates/persistence-format.md) | 选定历史格式：来源证据、完整根模式及可达类型；当前写入器使用生成目录。 |
| `upgrade-guide` | `docs/upgrade-guide/v<version>/<item>/guide.md` 及中文对应文件 | [upgrade-guide.md](../templates/upgrade-guide.md) | 升级路径：从所在目录的发布到下一版本的一项外部可感知破坏，含 `Change` 与 `Migration` 两节，最多 500 英文词。 |

赋予 `package-library` 或 `package-bundle` 前检查事实：阅读 `package.json` 的 `dsh.bundle.patch` 及 `src/index.ts` 的入口形态（`apply` 导出或默认服务导出是插件；普通模块 API 是库）。`dsh plugin --profile <name> add <package>` 可安装任何 npm 依赖，但配置档协调只会为声明 `dsh.bundle` 的包激活层；绝不把该命令作为库或普通插件的安装路径。文档检查按同样事实推导预期 kind，拒绝其他值，也拒绝 `name`、`audience`、`tags` 及 README 内的 `i18n` 元数据。只有具有独立模板、无歧义仓库位置或声明负责者，以及将文档映射到它的聚焦检查时，才新增 kind。

## 描述质量

Agent 搜索 frontmatter 的 `description` 值，先筛选页面，再加载全文。像技能描述一样编写：陈述页面覆盖什么、读者何时应打开。用一两句具体话，包含可搜索领域术语，与邻近负责者区分。不总结每节，不宣称优越，不重复标题，不含糊推销，不保留变更历史，不写技术状态报告。

好：`已交付的 JSONL 会话持久化后端，供部署者与维护者选择、配置或调试可选 Zstandard 压缩的逐会话持久日志。`

弱：`最好、最先进且有很多优化的会话存储实现。`

## 仓库链接及路径提及

链接目标保持机器可检查，路径提及相对于讨论上下文。当前页面菜单使用纯片段链接，外部资源用完整 URL。

期望的内部链接模型从仓库根命名目标，但以 `/docs/...` 开头的 Markdown URL 在 GitHub 会解析到仓库外，网站投影器不处理，`verify-md-links` 也跳过。在仓库负责的解析器能对所有渲染器支持根路径之前，Markdown 链接使用当前对渲染器有效的相对 URL；`docs/` 或 `packages/session/` 等逻辑路径提及相对于讨论。绝不为了看似绝对路径而采用未检查的前导斜杠链接。

## 双语行对齐

英文与简体中文保持同等权威。frontmatter 键顺序、标题、空行、段落、列表项、表格、代码围栏、链接目标及物理总行数一一对应。英文侧每个相对链接指向 `.md` 目标；中文侧有对应文件时指向 `.zh.md`，否则回退 `.md`；配对门禁把 `.md` 与 `.zh.md` 目标视为同一文档。在对应行内自然翻译，不对任一语言硬换行。代码块保持字节相同，调整术语首次出现的注释位置时不改变行结构。

行数相同是结构检查，不是忠实含义的证明。完整性、术语、自然语言及每行是否表达相同命题，仍由审查负责。

## 双语一致性记录

每个双语对保留 `*.i18n.yaml` 配套文件。它按标题章节记录一对哈希，排除围栏代码块及生成区域，使不同章节的编辑可以通过 Git 默认文本合并；生成数据属于生成器写入双语页的生成区域；`verify-translation-pairing` 比较条目与当前内容，并验证结构。任一语言修改后，用 `pnpm run verify-translation-pairing --write <pair>` 重新记录。不把内容哈希复制进 README frontmatter：独立编辑会修改同一个头部行，把本可合并的文字变成负责文件冲突。

## 开发笔记

无。
