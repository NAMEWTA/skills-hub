# 技能入口预算与检查

## 规范依据

以下官方资料核对于 2026-11-07。格式要求、编写建议和本仓库门禁分别说明，后续同步时应重新核对来源。

| 来源 | 与本项目相关的要求或建议 |
| --- | --- |
| [Agent Skills 格式规范](https://agentskills.io/specification) | `name` 最多 64 字符，`description` 最多 1024 字符；推荐正文少于 5000 tokens、入口少于 500 行，并使用相对引用与渐进式披露。规范允许一些可选元数据，本仓库只采用 `name`、`description` 是本地约定。 |
| [Anthropic 编写最佳实践](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) | 建议 `SKILL.md` 正文少于 500 行，接近上限时拆到参考文件；尽量直接链接所需资料，较长参考提供目录。500 行属于编写与性能建议，不是整个技能包的知识总量限制。 |
| [Anthropic 技能概述](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | 元数据供发现，技能触发后读取正文，资源按需访问。参考只有读取时才占上下文；脚本可运行后只返回结果。 |
| [OpenAI 技能文档](https://learn.chatgpt.com/docs/build-skills) | 描述应短而准确，优先写核心目标和触发条件；名称和描述先参与发现，完整正文在采用技能后读取。 |
| [OpenAI 技能与提示词文章](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | 多流程技能的入口宜作为最小路由，指向需要的方法和脚本；过宽或互相冲突的描述会妨碍选择。 |

5000 tokens 不等于 5000 个中文字符，也不等于 5000 个英文单词。本项目不固定模型 tokenizer，不用字符数量声称已经满足某个模型的精确 token 预算。

## 本仓库的可执行上限

检查范围为 `skills/<domain>/<domain>-xxx/SKILL.md`。阈值集中在 [入口检查脚本](../scripts/check-skill-quality.mjs)，由现有 [包装验证器](../scripts/validate.mjs) 和统一检查入口复用。

| 项目 | 本仓库门禁 |
| --- | --- |
| 名称 | 不超过 64 字符，遵守领域前缀和目录一致性 |
| 描述 | 非空，不超过 1024 字符，只描述可识别的任务和必要边界 |
| 正文物理行数 | 不超过 500 行 |
| 正文非空白 Unicode 字符 | 不超过 12000 个 |

正文从 YAML frontmatter 的结束分隔行之后开始。行数包含空行、代码块、表格和链接；LF 与 CRLF 都可计数。字符预算按非空白 Unicode 码点计算，中文逐字计入，代码、标点和链接同样计入，不是 UTF-8 字节数或按空格切出的单词数。

12000 字符是本项目为避免把长正文压成少数长行而采用的独立上限，不是官方规定，也不是 token 换算。预算只约束入口，不累计 `references/`、`assets/`、脚本或 `materials/`。完整方法不因超限而被删掉或换成摘要。

脚本报告实际行数、字符数及用量最高的入口；`--report` 列出全部入口。任一超限返回非零，指出文件、实际值、上限以及拆分建议。预算之内仍需审查入口是否聚焦，不能把接近上限当成写作目标。

## 本地检查与构建

使用 Node.js 22.14+，不需要 Python 或额外 npm 运行依赖。Windows、macOS 与 Linux 使用相同的命令。

```sh
# 快速结构检查：入口预算、独立包、链接、两级资料清单与映射
node scripts/check.mjs

# 完整检查：增加隔离回归测试及有限状态示例的真实故障注入
node scripts/check.mjs --full

# 仅查看所有入口的篇幅统计
node scripts/check-skill-quality.mjs --report
```

本项目分发 Markdown、模板与脚本，没有另一个需要编译的应用。`make check` 和 `make build` 都调用同一个完整检查；没有 Make 的环境使用 `npm run build` 或直接运行 Node 命令。`validate.mjs` 和 `validate-materials.mjs` 也可单独运行。

## 提交和推送前检查

本地 hooks 需要开发者显式启用一次：

```sh
node scripts/install-hooks.mjs
```

安装器只设置当前仓库的 `core.hooksPath=.githooks`。如果已经有其他 hooks 路径或默认 hooks 目录中的自定义内容，它会保留原配置并给出接入命令，不覆盖、不删除、不悄悄禁用现有 hooks。已经启用本项目 hooks 时可重复执行。

hooks 由 Node.js 执行。Git 要求入口文件名为 `pre-commit`、`pre-push`，这两个固定名称是无扩展名的 JavaScript 薄入口，实际逻辑在 `run-check.mjs` 和维护脚本中；不包含 Shell 或 Python 启动器。

| 入口 | 实际检查对象 |
| --- | --- |
| `node scripts/check.mjs` | 当前工作区，包括尚未提交的文件 |
| `node scripts/check.mjs --staged` | 完整 Git index 快照；用于 pre-commit |
| `node scripts/check.mjs --revision HEAD` | 指定提交的文件树，忽略未提交的工作区改动 |
| `node scripts/check.mjs --pre-push` | Git 从标准输入提供的每个非删除更新的目标提交；用于 pre-push |

pre-commit 检查暂存内容，不能由工作区里尚未暂存的修正掩盖错误。pre-push 检查实际推送的分支或标签目标，不用当前 HEAD 代替；带注释的标签先解析到提交，同一提交只检查一次。范围是各更新引用的目标文件树，不逐个重跑全部中间历史提交；仅删除引用没有文件树需要检查。

快照直接读取 Git 对象，不使用会受 `export-ignore` 或 `export-subst` 影响的导出内容。检查在临时目录运行，不切换分支、不改动工作区和暂存内容；未解决的 index 冲突、非提交标签、符号链接或子模块等无法按本仓库契约检查的对象会明确失败。

已有 hooks 管理工具时，在它的对应阶段接入上述 `--staged` 和 `--pre-push` 命令。pre-push 的四字段标准输入需要继续传入本脚本。

## CI

[验证工作流](../.github/workflows/validate.yml) 在每次 push 和 pull request 后运行 `node scripts/check.mjs --full`，覆盖 Linux、Windows、macOS，并运行状态图回放及实际 npm 压缩包的离线安装检查。任一预算、包装、资料或行为检查失败都会使任务失败。

本地 hooks 由开发者启用，Git 允许调用者跳过它们；CI 是独立的检查。CI 在推送后运行，是否阻止分支合并由仓库的 required checks 等分支规则决定，本脚本不会自行改动仓库权限。

## JavaScript 运行约定

维护脚本、测试、技能脚本和可执行示例使用 `.mjs` 或 `.js`。门禁拒绝源码运行目录中的 Python、Shell 与 TypeScript 脚本；Git 规定的两个 hook 文件名除外，它们仍执行 JavaScript。`materials/<project>/upstream/` 和 `zh/` 是被动来源对照，保留原扩展名，包括 `.py`、`.sh`、`.ts` 及执行位，但不作为运行依赖。此例外由目录边界明确隔离，不靠 `.txt` 后缀判断安全。来源内嵌 `.agents/skills`、AGENTS.md、SKILL.md、CI 和 hook 不参与本项目技能发现或当前指令执行，不安装其依赖或触发来源工作流；npm 白名单排除整个 materials，安装器只从真正的 skills 根发现和安装。

发布检查实际打包后安装 tarball，逐一核对技能资源与许可，防止源码可用但 npm 漏文件。发布流程见[版本发布](release.md)。

## 资料检查的职责边界

资料身份由[父清单](../materials/manifest.tsv)导航到项目子清单，当前版本只以父清单的固定 SHA 为准。六个准确来源、范围、稀疏 zh 和显式同步用法见[资料导航](../materials/README.md)。普通校验与 CI 不联网追分支；显式同步每次解析最新分支并固定同一 SHA。

资料门禁核实父子唯一性、路径穿越/symlink、upstream/zh 实际集合、SHA-256、Git blob、平台可用的执行位、法律/机器/无语言字节对照，以及 runtime_paths 的真实文件与开发方法单一归属。中文原文的 zh_path/zh_sha256 为空，不能将稀疏误判成缺译；非中文适用对照必须齐全。显式提供本地 Git 对象库时可进一步对照固定提交的完整来源树，默认本地一致性检查不冒称远端树验收。

哈希、出现中文和报告完成标记都不证明分类或全文翻译忠实。runtime_paths 只说明实际采用关系，runtime_reviewed_blob 是最后真实核对依据，不能随新材料自动前移。来源更新与运行适配分别验收，删除来源不自动删运行技能。原样来源自带法律文件保留在树内，实际分发所需法律文本仍集中于 licenses；两者不互相替代。

隔离回归覆盖临时两级清单、缺失/额外文件、稀疏中文、字节对照、原扩展名与内嵌技能不参与运行约束及安装。本地临时 Git 仓库检验同步和冲突失败，不依赖公网或正在迁移的真实材料。完整测试递归发现 tests 下的 Node 测试，不另维护材料测试注册表。状态图检查读取 pstack upstream 捕获夹具，是 captured-output replay，不是新 TLC 求解。

## 超限时怎样调整

先保留任务选择、交付目标和关键约束，把条件较少触发的流程、参数表、完整示例与反例移入本包参考；入口直接说明何时读取哪份材料。一个完整模式可以用短入口链接其方法，不要求每次读完整个包。

完整材料较多时保留有明确主题的导航，避免层层跳转却无法判断哪份文件才是执行方法。较长参考提供目录和清楚标题。本门禁不为满足机械的一层深度，把所有参考文件名重新堆进入口；资源可达性和独立安装由包装验证器检查，实际选择与读取顺序仍须用任务审查。

减少重复表述时保留成熟方法的判断条件、关键步骤、例子、反例和数值。更新引用、同包副本及资料映射后重新检查。入口变短不能证明能力更好，静态校验也不能代替调用场景和执行结果验证。

隔离回归见 [门禁测试](../tests/skill-quality.test.mjs)：覆盖中文长行、阈值边界、参考不计入入口、暂存与工作区不一致、推送非 HEAD 分支和标签、已有 hooks 保留，以及真实 Git 提交/本地远端推送被阻止的情形。
