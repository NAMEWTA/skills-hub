---
name: git-guardrails-claude-code
description: 设置 Claude Code hook，在危险 git 命令（push、reset --hard、clean、branch -D 等）执行前阻止它们。用于用户希望防止破坏性 git 操作、添加 git 安全 hook，或在 Claude Code 中阻止 git push/reset 的场景。
---

# 设置 Git 防护

设置 PreToolUse hook，在 Claude 执行危险 git 命令之前拦截并阻止。

## 阻止什么

- `git push`（所有变体，包括 `--force`）
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

被阻止时，Claude 会看到一条消息，告知它无权使用这些命令。

## 步骤

### 1. 询问范围

询问用户：只为**当前项目**安装（`.claude/settings.json`），还是为**所有项目**安装（`~/.claude/settings.json`）？

### 2. 复制 hook 脚本

附带脚本位于：[scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

按范围复制到目标位置：

- **项目**：`.claude/hooks/block-dangerous-git.sh`
- **全局**：`~/.claude/hooks/block-dangerous-git.sh`

用 `chmod +x` 赋予执行权限。

### 3. 向设置添加 hook

添加到相应设置文件：

**项目**（`.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**全局**（`~/.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

设置文件已存在时，把 hook 合并到既有 `hooks.PreToolUse` 数组。不要覆盖其他设置。

### 4. 询问定制需求

询问用户是否希望向阻止列表添加或移除模式，据此编辑复制后的脚本。

### 5. 验证

运行快速测试：

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

应以退出码 2 结束，并向 stderr 打印 BLOCKED 消息。
