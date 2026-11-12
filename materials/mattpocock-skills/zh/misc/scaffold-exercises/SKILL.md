---
name: scaffold-exercises
description: 创建包含章节、问题、答案、讲解且可通过 lint 的练习目录结构。用于用户希望搭建练习骨架、创建练习占位内容，或设置新课程章节的场景。
---

# 搭建练习骨架

创建能通过 `pnpm ai-hero-cli internal lint` 的练习目录结构，然后使用 `git commit` 提交。

## 目录命名

- **章节**：`exercises/` 内的 `XX-section-name/`（例如 `01-retrieval-skill-building`）
- **练习**：章节内的 `XX.YY-exercise-name/`（例如 `01.03-retrieval-with-bm25`）
- 章节号 = `XX`，练习号 = `XX.YY`
- 名称采用 dash-case（小写、连字符）

## 练习变体

每个练习至少需要以下子文件夹之一：

- `problem/`——带 TODO 的学生工作区
- `solution/`——参考实现
- `explainer/`——概念材料，没有 TODO

创建占位内容时默认 `explainer/`，除非计划另有规定。

## 必需文件

每个子文件夹（`problem/`、`solution/`、`explainer/`）都需有 `readme.md`，且：

- **非空**（必须有真实内容，哪怕只有一行标题也可以）
- 没有失效链接

创建占位内容时，生成包含标题和描述的最小 readme：

```md
# 练习标题

这里写描述
```

如果子文件夹有代码，还需要 `main.ts`（>1 行）。但对于骨架，只含 readme 的练习也可以。

## 工作流

1. **解析计划**——提取章节名、练习名和变体类型
2. **创建目录**——对每条路径使用 `mkdir -p`
3. **创建 readme 占位内容**——每个变体文件夹一份带标题的 `readme.md`
4. **运行 lint**——用 `pnpm ai-hero-cli internal lint` 验证
5. **修复错误**——迭代直到 lint 通过

## Lint 规则摘要

检查器（`pnpm ai-hero-cli internal lint`）检查：

- 每个练习有子文件夹（`problem/`、`solution/`、`explainer/`）
- 至少存在 `problem/`、`explainer/`、`explainer.1/` 之一
- 主子文件夹存在非空 `readme.md`
- 没有 `.gitkeep` 文件
- 没有 `speaker-notes.md` 文件
- readme 没有失效链接
- readme 没有 `pnpm run exercise` 命令
- 除纯 readme 练习外，每个子文件夹都需 `main.ts`

## 移动/重命名练习

重新编号或移动时：

1. 用 `git mv`（不是 `mv`）重命名目录——保留 git 历史
2. 更新数字前缀以保持顺序
3. 移动后重新运行 lint

示例：

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 示例：依据计划搭建骨架

给定如下计划：

```
第 05 节：记忆技能构建
- 05.01 记忆入门
- 05.02 短期记忆（explainer + problem + solution）
- 05.03 长期记忆
```

创建：

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

然后创建 readme 占位内容：

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# 记忆入门"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# 短期记忆"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# 短期记忆"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# 短期记忆"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# 长期记忆"
```
