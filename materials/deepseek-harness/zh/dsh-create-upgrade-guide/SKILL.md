---
name: dsh-create-upgrade-guide
description: deepseek-harness 变更破坏外部可感知的接口（CLI、配置档、cordis.yml 或设置键、持久化用户数据、SDK 或传输 API、已发布包入口），或修改尚未发布的升级指南已覆盖的接口时使用，编写或更新 docs/upgrade-guide/v<version>/<item>/guide.md。
---

# DSH 创建升级指南

升级指南告诉运行 vT 版本的读者，为运行下一版本需要改什么。认识到破坏性变化时，就在引入破坏的变更中编写；不要拖到发布准备阶段。

## 范围

仅为仓库外的使用者升级后能观察到的破坏编写指南：

- `dsh` 命令、标志与配置档名称；
- `cordis.yml`、补丁、叠加配置、设置键及其可接受值；
- 持久化用户数据：Session 日志、SQLite 存储与用户数据目录；
- TypeScript 和 Python SDK 导出、JSON-RPC、HTTP 及 ACP 消息；
- 已发布包名称与入口。

尚不稳定、且所有消费者都在同一变更中更新的内部 API 无需指南。Session 格式变更仍遵循[类型确认](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/cookbook/reviewing-persistence-type-changes.md)；指南只陈述读者需要执行的动作，并链接到该记录。

## 位置

`docs/upgrade-guide/v<version>/<item>/guide.md`

- `<version>` 是编写指南时根 `package.json` 中的 `version` 字段，例如 `v0.1.7-rc.2`。指南描述从该版本升级到下一版。
- `<item>` 是变化接口的 kebab-case 名称，例如 `profile-flag-rename`。
- 每个条目目录恰好包含 `guide.md`、中文对应文件 `guide.zh.md` 和配对记录 `guide.i18n.yaml`：不加索引或附件。

## 维护

根版本未变时，当前版本目录描述从 vT 到当前 `master` 的差异。后续变更涉及其中某篇指南覆盖的接口时，在同一变更中更新该指南；破坏被撤销时删除指南。版本提升后，旧版本目录内的指南冻结；新的破坏放进新的版本目录。PR 尚未关闭而新版本已发布时，把指南移到新的版本目录：`Policy / Pre-Merge Check` 在合并后的树上运行 `verify-upgrade-guides --base`，拒绝在根版本目录之外新增指南，除非该指南所属版本线的 `release/dsh-<x.y.z>` 分支已经包含它。绝不编写跨越多个版本的指南。

## 格式

从[升级指南模板](../dsh-doc-writing/templates/upgrade-guide.md)开始。`verify-upgrade-guides` 强制以下要求：

- frontmatter 恰好具有 `kind: upgrade-guide` 和一句话的 `description`，说明什么发生破坏；只有同时添加相应门禁检查、再回填所有指南时，才可新增键；
- 一个 `#` 标题，然后 `guide.md` 中恰好是 `## Change` 和 `## Migration` 两节，`guide.zh.md` 中恰好是 `## 变更` 和 `## 迁移`，顺序如此；
- `guide.md` 最多 500 词，包含 frontmatter。

`Change` 陈述接口的旧行为、新行为及受影响者。`Migration` 按顺序列步骤，写明准确的文件、键、命令或符号，并说明如何确认迁移成功。

指南需要超过 500 词时，多余文字应放到别处：链接源文件或符号，而非重述代码；把理由移入 [Agent Note](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/README.md)；把重复的机械步骤做成脚本或 `dsh` 命令，由指南调用。

遵循 [dsh-prose-standard](../dsh-prose-standard/SKILL.md)。按[双语配对规则](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/AGENTS.md)在同一变更中编写中文对应文件，然后执行 `pnpm run verify-translation-pairing --write docs/upgrade-guide/v<version>/<item>/guide.md` 记录配对。

## 验证

```sh
pnpm run verify-upgrade-guides
pnpm run verify-translation-pairing docs/upgrade-guide/v<version>/<item>/guide.md
pnpm run verify-md-links
```
