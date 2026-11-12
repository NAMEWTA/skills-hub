### 打开 PR

每本其他手册末尾调用。

**工作树。** 在从 main 分出的 git 工作树工作，子智能体继承它。同分支多个 `Task` 调用分别用独立工作树，或在其间执行 `git fetch && git reset --hard origin/<branch>`。脏分支含无关工作时，导出补丁、新建工作树、应用补丁。工作树纠缠时，从 main 重置并做最小重建。

**提交。** 频繁提交。开 PR 前变基成有序小提交。每个提交都是未来 PR，要能落地，按讲清改动的顺序排列。修复属于刚做的提交时 amend，可分离时新提交。提交正文不重复主题。

**PR。** 提交前用 `cursor-team-kit` 的 `/deslop` 整理差异，审查前 `/no-comments`。PR 标题、描述、提交正文都用 `/technical-writing`，除 Diátaxis 外全部层次都适用，并用 STE 词汇规则：一个动作一个词、保留冠词、能用普通动词就不用 -ing。随后 `/unslop`。

**标题。** Conventional Commits 格式 `type(scope): subject`，结尾无句号。类型如 `feat`、`fix`、`docs`、`refactor`、`test`、`chore`、`perf`。scope 是领域，如 `pstack`、`poteto-mode`。主题简短、祈使式，真实符号承载改动时写符号，例如 `fix(pstack): retarget opening-a-pr babysit trigger`。

**描述。** PR 正文是给已经有差异的审查者的一分钟简报，不是实验笔记。说明为何改、排除什么、可能破坏什么、如何证明有效。用简短简单句，少标识符，不堆长墙。正文会成为 squash 提交正文，因此把该提交控制在约 40 行以内。用 `##` 标题而非加粗引导语，按下列顺序，没有内容的章节删除：

- `## Why`：问题与方法，1 至 3 句短句。不放 SHA、变基谱系或“基于 main”前言。
- `## What changed`：1 至 3 个短条目。只有真实符号或路径承载改动时才点名。重命名或改目标需写两端。
- `## Scope`：始终保留。1 至 3 条说明覆盖与刻意排除内容，如后续项、已知缺口。不写符号、路径或逐文件长文。
- `## Tradeoffs`：只写审查者否则会追问的未选方案。没有真实选择就省略。
- `## Blast Radius`：1 至 2 句说明触及谁或什么，以及为何安全或危险。main 为红时说明让它继续红的代价。
- `## Verification`：1 至 3 条，每条一个真实运行路径及结果。性能给一个带单位主数字、`before → after`，其余链接到 arena 或 swarm 目录。不写样本方法、群体过程复述、指标表。

这些章节之后，视频或截图能够证明主张时附上。完整 SHA、群体或比选通道复述、工具校正长文、逐文件清单、`CLEAN` 裁决放链接产物，不放正文。

**托管工具。** 第一次 PR 操作前确定托管工具，创建、编辑、查看、观察、合并都保持同一选择。默认 GitHub CLI（`gh`）。若 `command -v origin` 成功且 Origin 能解析仓库，优先 `origin pr ...`。Origin 不存在或无法解析时留在 `gh` 并记录回退。不要求 Graphite（`gt`）。

**内置 PR 工具。** 运行提供内置 PR 工具时，通过它创建、编辑、改目标、标记就绪，不通过托管 CLI，因为 CLI 创建的 PR 会遗漏该工具跟踪的内容。工具未覆盖功能用已选托管工具；无内置工具时全部操作使用托管工具。

**大小与堆叠。** 宁可五个窄 PR，不要一个大 PR。堆叠是基础分支链：根 PR 指主干，每个子分支变基到父分支精确尖端，PR 目标指父分支。父项合并时，按 `playbooks/shipping.md` 第 4 步把子项移至主干。无内置工具时，按选定工具用 `origin pr create --status open --base <parent-branch>` 或 `gh pr create --base <parent-branch>` 创建子项，用 `origin pr edit <pr> --base <parent-branch>` 或 `gh pr edit <pr> --base <parent-branch>` 改目标。只有独立工作才从主干分支。重大堆叠工作前先变基主干。

**就绪性。** 每个 PR 打开为就绪，永远不是草稿。内置 PR 工具可能默认草稿，所以每次创建明确 `draft: false`。Origin 用 `--status open`，`gh` 不传 `--draft`。仍成为草稿时，用 PR 工具标就绪，或按工具运行 `origin pr ready <number>`、`gh pr ready <number>`。提及状态前运行 `origin pr view <number>` 或 `gh pr view <number>`。

**跟进。** 开 PR 不自动开始跟进。发布地址并继续构建，先完成阶段或堆叠。只有用户在整个堆叠存在后要求时，才另跑跟进。每个新 PR 都跟进会拖住构建，把检查花在后续还会重启的提交上。反馈偏离意图时提出异议。

开 PR 的子智能体运行 `/deslop`、`/no-comments`，发布地址，然后回到父级，不跟进；完全自动或自动堆叠负责人除外。其简报分配跟进循环，就构成 `playbooks/babysit.md` 等待的请求。负责人在代码就绪报告后开始循环，报告可合并；它不受此处及 babysit 中“整个堆叠构建完才跟进”的限制。
