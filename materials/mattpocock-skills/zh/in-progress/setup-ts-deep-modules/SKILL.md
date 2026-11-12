---
name: setup-ts-deep-modules
description: 将 dependency-cruiser 接入 TypeScript 仓库，使每个包成为深模块，实现隐藏于子文件夹且只能经入口文件访问。由用户调用。
disable-model-invocation: true
---

# 设置 TypeScript 深模块

让本仓库的每个包都成为**深模块**：小接口后面承载大量行为。包的公共表面是其**入口**（包根部的文件），其子文件夹中的所有内容都隐藏。本技能安装 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)，并配置让入口成为唯一访问方式的规则，然后证明规则确实生效。

术语（深模块、接口、接缝、深度）请通过 "codebase-design" 调用 Skill 工具获取，并全程使用其语言。

## 强制的结构

```
src/packages/
  <name>/
    index.ts        ← 一个入口（公共）。从外部导入它。
    client.ts       ← 另一个入口。包可以公开多个入口。
    lib/            ← 实现：对外隐藏，内部可自由互相导入。
    tests/          ← 就地测试 + 夹具（子文件夹，因此私有）。
```

公共表面是包的**根部文件**，不是某个指定的 `index.ts`。按约定，实现放在 `lib/`，测试放在 `tests/`，使每个包都具有相同的双文件夹结构。但规则本身是通用的：*任何*子文件夹中的*任何*内容都私有，因此永远不必为增加文件夹而扩展配置。

四条规则，均为 `error`：

1. **入口边界**：包外代码（应用代码或其他包）只能导入该包入口（根部文件），绝不能导入子文件夹里的任何内容。
2. **包内自由**：包自己的文件可以自由互相导入。
3. **通过入口测试**：`<pkg>/tests/` 下的文件可以导入任何包的入口以及自己的 `tests/` 夹具，但绝不能导入任何包的子文件夹内部（即使自己的也不行）。跨包集成测试可以；深层导入不行。
4. **无环**：不允许依赖环。

**要入口，不要 barrel 聚合文件。** 因为公共表面是*每个*根部文件，包可以公开多个小入口（`index.ts`、`client.ts`、`server.ts`），而不是把一切都塞进巨大的 `index.ts`。不鼓励使用重新导出整个子树的 barrel 文件；保持入口小巧，把实现隐藏在子文件夹。

分层（哪些包可以依赖哪些包）是*另一个*问题，在配置中以注释占位，留给本仓库补充。

## 步骤

### 1. 检测环境

- **包管理器**：`pnpm-lock.yaml` → pnpm，`yarn.lock` → yarn，`bun.lockb` → bun，否则 npm。以下所有命令都使用检测出的工具（`pnpm`/`yarn`/`npm run`/`bunx`）。
- **包根目录**：若存在 `src/`，使用 `src/packages`，否则 `packages`。如果仓库已有其他明显约定，与用户确认选择。
- **已有配置**：检查 `.dependency-cruiser.*` 文件。如果存在，**不要**覆盖：合并四条规则和选项，并告知用户新增内容。

**完成条件：** 已知包管理器、包根目录和已有配置状态。

### 2. 安装 dependency-cruiser

用检测出的包管理器，将 `dependency-cruiser` 安装为 devDependency。

**完成条件：** `devDependencies` 中包含 `dependency-cruiser`。

### 3. 写配置

把 [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) 复制到仓库根部，命名为 `.dependency-cruiser.cjs`。将 `PACKAGES_ROOT` 设为步骤 1 检测到的根目录。规则基于路径深度、与扩展名无关，因此无需其他适配。

**完成条件：** `.dependency-cruiser.cjs` 存在、`PACKAGES_ROOT` 正确，且四条 forbidden 规则齐全。

### 4. 接入检查

- 添加 `lint:boundaries` 脚本：`depcruise <packages-root>`（或 `depcruise src`）。
- 把它加入仓库已有的总检查命令，即会运行 typecheck 的命令（例如 `check` / `ci` / `validate` 脚本）。**不要**修改 `tsconfig` 或添加路径别名。
- 如果没有总检查脚本，就添加 `lint:boundaries`，并告知用户将其加入 CI。

**完成条件：** `lint:boundaries` 存在，并作为 typecheck 所在同一命令的一部分执行。

### 5. 搭建示例包

创建并提交 `<packages-root>/example/`，作为可复制模板：

- `index.ts` 是入口。导出一个委托给内部文件的函数（让包明显是*深*的，而不是透传）。
- `lib/impl.ts`：位于**子文件夹**的内部文件，由 `index.ts` 导入，外部不能访问。
- `tests/example.test.ts` **只**导入 `../index`（入口），并对公共函数断言。

告知用户这是起步模板，可复制或删除。

**完成条件：** 示例包存在，通过根入口公开行为，把 `impl` 隐藏在子文件夹。

### 6. 证明规则确实生效

这是整个技能的完成标准：面对违规却不失败的配置毫无价值。

1. 运行 `lint:boundaries`，对干净示例必须**通过**。
2. 临时向 `tests/example.test.ts` 添加深层导入（例如 `import { thing } from "../lib/impl"`）。再次运行 `lint:boundaries`；必须以 `tests-through-entrypoints` **失败**。
3. 撤销深层导入，再运行一次，必须**通过**。

**完成条件：** 已观察到通过、深层导入导致失败、再次通过。如果步骤 2 不失败，说明规则接线不正确，结束前先修复。

### 7. 记录约定

**在包文件夹内**写 `README.md`（`<packages-root>/README.md`，与其约束的包并列），覆盖：`src/packages/<name>/` 布局（根部为入口，`lib/` 为实现，`tests/` 为测试）、“只通过包的入口（根部文件）导入”，以及如何运行 `lint:boundaries`。明确**不鼓励 barrel 文件**：公开多个小入口，不通过一个 index 重新导出整个子树。只保留可复制片段，以及四条规则各一段说明。

然后从仓库代理指令文件（存在时选 `CLAUDE.md`，否则 `AGENTS.md`；两者都不存在则创建 `AGENTS.md`）添加指向它的**上下文指针**。一行足够，例如 `Packages are deep modules: see [src/packages/README.md](./src/packages/README.md) before adding or importing one.`。这能让代理发现边界规则，而不是撞上规则才知道。

**完成条件：** `<packages-root>/README.md` 存在且不鼓励 barrel，仓库的 `CLAUDE.md`/`AGENTS.md` 链接到它。

## 备注

- 配置中的 `$1` 反向引用（dependency-cruiser 的分组匹配）使包可以访问自己的内部，而外部不能。不要把它们展开成逐包独立规则。
- 公共或私有由**深度**决定：包根部文件是入口；子文件夹里的任何内容都私有。惯例文件夹是 `lib/`（实现）和 `tests/`，但规则不硬编码它们：任何子文件夹都私有，因此新增文件夹永远不需要改配置。新增入口就是新增根部文件（不是 barrel）。
- 包是**扁平的**：根目录下只有一层直接子包。包内部可以任意深度嵌套；包不能包含另一个包。
- 使用 `.cjs`（不是 `.js`），使配置的 `module.exports` 即使在 `"type": "module"` 仓库中也能工作。
