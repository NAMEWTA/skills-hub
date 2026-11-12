# pstack 宿主树

此文件夹由 `pstack/skills`、`pstack/agents`、`pstack/docs/guide`、`pstack/docs/harness/claude-code.md`、`pstack/README.md`、`pstack/LICENSE` 和 `pstack/plugin.json` 生成。不要手工编辑。

Cursor 直接使用 `pstack/`，Claude Code 则安装 `claude-code/`。此目录树不包含 `pstack/` 的其余内容，例如 `pstack/automations` 和 `pstack/assets`。指向目录树未收录的 pstack 文件的相对链接，会改为指向 GitHub `main` 上的该文件。

编辑上述源文件后，从仓库根目录运行 `node scripts/generate-pstack-harness-trees.mjs`，并提交生成结果。
