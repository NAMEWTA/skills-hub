---
name: setup-pre-commit
description: 在当前仓库配置 Husky 提交前 hook，搭配 lint-staged（Prettier）、类型检查和测试。用于用户希望添加提交前 hook、设置 Husky、配置 lint-staged，或在提交时进行格式化/类型检查/测试的场景。
---

# 设置提交前 Hook

## 配置内容

- **Husky** 提交前 hook
- **lint-staged** 对全部暂存文件运行 Prettier
- **Prettier** 配置（缺失时）
- 提交前 hook 中的 **typecheck** 和 **test** 脚本

## 步骤

### 1. 检测包管理器

检查 `package-lock.json`（npm）、`pnpm-lock.yaml`（pnpm）、`yarn.lock`（yarn）、`bun.lockb`（bun）。使用实际存在的工具。不明确时默认 npm。

### 2. 安装依赖

作为 devDependencies 安装：

```
husky lint-staged prettier
```

### 3. 初始化 Husky

```bash
npx husky init
```

这会创建 `.husky/` 目录，并向 package.json 添加 `prepare: "husky"`。

### 4. 创建 `.husky/pre-commit`

写入此文件（Husky v9+ 无需 shebang）：

```
npx lint-staged
npm run typecheck
npm run test
```

**适配**：把 `npm` 换成检测出的包管理器。如果仓库 package.json 没有 `typecheck` 或 `test` 脚本，省略对应行，并告知用户。

### 5. 创建 `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. 创建 `.prettierrc`（缺失时）

仅在没有 Prettier 配置时创建。使用以下默认值：

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. 验证

- [ ] `.husky/pre-commit` 存在且可执行
- [ ] `.lintstagedrc` 存在
- [ ] package.json 的 `prepare` 脚本是 `"husky"`
- [ ] 存在 `prettier` 配置
- [ ] 运行 `npx lint-staged` 验证可用

### 8. 提交

暂存所有修改/新建文件，并以消息 `Add pre-commit hooks (husky + lint-staged + prettier)` 提交。

这会实际通过新的提交前 hook，是验证一切可用的良好冒烟测试。

## 备注

- Husky v9+ 的 hook 文件不需要 shebang
- `prettier --ignore-unknown` 跳过 Prettier 不能解析的文件（图片等）
- 提交前先运行 lint-staged（快速、仅暂存内容），再执行完整类型检查与测试
