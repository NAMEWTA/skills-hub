### 工作树和模拟器清理

1. 快照与审计。记录 `df -h /`，运行 `scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]`，遵循 principle-build-the-lever。不传 `-b` 时按 `origin/HEAD` 检查 `MERGED`，PR 目标是其他分支时传 `-b origin/<branch>`。路径来自 `git worktree list`，不手输，因为手输 `myrepo-worktrees/x` 会漏掉 `.cursor/worktrees/myrepo/x` 中的工作树，遵循 principle-encode-lessons-in-structure。按大小、年龄、合并状态、未提交工作、PR 状态、最近触及它的聊天分类，再建议分组。对话扫描很慢，后台运行。
2. 分组是建议，不是许可。固定和活跃聊天才是真实产物，遵循 principle-prove-it-works。从用户或侧栏获取该集合，逐候选核对。工具曾把用户固定的工作树标为 `safe`，因此固定集合优先。
3. 删除前验证使用情况。对每个 `verify-recent-chat` 行或任何疑点，扇出子智能体读记录，报告聊天是否固定或进行中、触及哪些工作树，遵循 principle-guard-the-context-window，因为对话是大内容。固定聊天通过后台子智能体在兄弟工作树创建 arena 和复现树，即使名称没出现在侧栏，也正在使用。按“子智能体”一节选择推理级别和快速或标准速度。
4. 不可逆丢失时暂停。`wip:N` 是 N 项已跟踪未提交编辑，先展示差异取得决定，因为干净工作树可从分支恢复，未提交内容却会丢失。`scratch:N` 是未跟踪临时内容，可删除但要列文件。按自主性，干净、已合并、不使用的继续；`wip` 和使用中的暂停。
5. 清理已确认集合。逐路径执行 `git worktree remove --force <path>`。目录因忽略的构建产物仍存在时，`rm -rf` 删除，再 `git worktree prune`。分支引用仍在，因此不丢提交。用 `df -h /` 和重新列举确认。
6. 模拟器和其他空间来源。模拟器通常是下一大收益。`xcrun simctl --set testing delete all` 清 XCTestDevices 克隆，`xcrun simctl delete unavailable` 清不可用项，`xcrun simctl runtime list` 后 `runtime delete <id>` 清旧运行时。需要时再看 Xcode `DerivedData`、`iOS DeviceSupport`、`~/Library/Application Support/Cursor` 中 `state.vscdb.backup` 和 `snapshots/roots/<root>`，以曾作为工作区打开的文件夹命名的 root 会膨胀，以及 pnpm、uv、brew、yarn 包缓存。只清用户未要求保留的缓存。

这是唯一删除用户状态而没有代码审查兜底的手册，因此以上门禁就是审查。

**回复：** 清理前后 `df -h /` 与回收空间、已删除工作树、每个保留项的一行理由，如被哪个聊天使用或有未提交工作。
