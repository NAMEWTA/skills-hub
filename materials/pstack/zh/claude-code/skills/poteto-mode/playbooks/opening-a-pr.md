### 打开 PR

每本其他手册末尾调用。

在从 trunk 创建的 git worktree 中开展工作，避免混入无关改动。通过 rebase 整理为小型、可合入的提交。提交前，对 diff 运行 `cursor-team-kit` 的 `/deslop`。

标题：`type(scope): subject`；若某个真实符号承载了改动，就在标题中点明。正文：40 行以内、可在一分钟内读完的简报，按顺序使用这些 `##` 标题，省略空项：`## Why`、`## What changed`、`## Scope`、`## Tradeoffs`（仅写审阅者否则会追问的被否决方案）、`## Blast Radius`、`## Verification`。

通过基底分支堆叠后续 PR。使用本次执行的 PR 工具创建可供审阅的 PR，设置 `draft: false`。没有此工具时，使用不带 `--draft` 的 `gh pr create`；若 Origin CLI 能解析该仓库，则使用 `origin pr create --status open`。创建 PR 不会自动启动看护流程。
