# Speculo

可复用的 AI 工作流、任务技能与持久化项目知识库。

Speculo 帮助已有 AI 助手把工作从需求推进到经过验证的交付。领域入口指向相关 Work 技能；每个 Work 保留完成该任务所需的实用知识。模型选择路径，有价值的决定和结果则保存在会话之外，随时可读。

[中文](../upstream/README-ZH.md) · [快速开始](../upstream/docs/getting-started.md) · [能力](../upstream/docs/capabilities.md) · [流程与持久化](../upstream/docs/workflow.md) · [CLI](../upstream/docs/cli.md)

## 开始

需要 Node.js `>=22.22.3 <25`。

```bash
npm install -g @namewta/speculo
speculo init . --workflows specdev --skill-targets agents --skills domain/specdev
speculo doctor .
```

然后向你的 AI 提问：

> 使用 SpecDev，根据这些 issue 准备下一个版本。澄清产品决定，在交互尚不确定的地方展示原型，然后实现并验证已商定的范围。

安装领域时会包含它的 Work 技能和参考资料。只向宿主暴露领域入口，可以保持宿主技能列表精简；agent 会在需要时沿相关链接读取。也可以直接暴露某个特定 Work：

```bash
speculo init . --workflows specdev --skill-targets agents --skills domain/specdev,specdev/prototype,specdev/implement
```

使用 `--skill-targets claude` 写入 `.claude/skills/`，使用 `agents,claude` 则同时支持两者。`--skills all` 会显式暴露所有已安装入口。交互式 `speculo init` 会提供可用选项。Speculo 安装指令和资源；模型、工具与权限由宿主提供。

使用此源码分支时，先运行 `pnpm install --frozen-lockfile` 和 `pnpm build`，再以 `node dist/src/cli.js` 替换 `speculo`。分支版本号不是 npm 发布公告。

## 四个领域，39 个可独立使用的 Work

| 领域 | Work 能力 |
| --- | --- |
| [SpecDev](../upstream/docs/workflows/specdev.md) · 21 | 需求接入、评估、调查、原型、规格、规划、任务、实现、诊断、代码与架构审查、交付、复盘、学习与归档；环境设置、接入、盘点、主机管理与部署 |
| [Learning](../upstream/docs/workflows/learning.md) · 9 | 学习者背景、评估、目标规划、课程、探究、练习、复习、主题整合与归档 |
| [Media](../upstream/docs/workflows/media.md) · 7 | 初始化、简报、参考拆解、手绘视觉提示、视频制作、发布草稿与复盘 |
| [Person](../upstream/docs/workflows/person.md) · 2 | 毛泽东的调查／实践／矛盾框架，以及钢人化论证；各自保留独立方法与来源边界 |

**Work** 是可复用的任务能力，不是强制发布关卡。领域 `SKILL.md` 是精简路由。Work 的 `SKILL.md` 提供任务专用指导，只有在有帮助时才链接到详尽参考、示例或工具。有用的原文库、设计示例与媒体工具仍可按需读取。

这里没有工作流 manifest、固定工作角色、派单协议、任务 DAG、必填交接表单或业务状态 schema 验证器。规划与拆分仍是有用的能力；模型根据实际任务选择所需深度。详见[逐项能力重构对应表](../upstream/docs/refactor-map.md)。

## 无需填表的长期知识

通常的软件流程是：需求 → 评估 → 可选原型 → 规格 → 可选拆分 → 实现与审查 → 发布／部署 → 提纯与归档。

项目数据默认位于 `.agents/speculo/.speculo/`：

| 位置 | 有用内容 |
| --- | --- |
| `releases/<name>/README.md` | 来源链接、范围、规格、决定、进度、实际结果与下一步 |
| `knowledge/adr/` | 重要决定、替代方案与长期理由 |
| `knowledge/context/` | 代码和配置无法解释的当前背景 |
| `knowledge/error/` | 已证实原因、修复与可复用防错方法 |
| `knowledge/design/` | 当前设计，包括 HTML、组件、故事、token 与图像 |
| `environments/<target>.md` | 已知目标、部署步骤、数据影响、健康检查与恢复 |
| `archive/<name>/` | 历史交付记录及其采用的版本 |

只有出现值得保留的内容时才创建这些位置。项目已有位置优先。通常一份发布记录就足够；小修复可能只需要对应 issue 或 PR。大型规格或独立切片可使用其他链接文件。当前设计保存在发布记录之外，发布记录引用该次交付采用的版本。

## 命令与工具技能

八个显式 AI 命令覆盖状态、交接、项目维护、仓库审计、历史整合、上游评估、源码 ZIP 与 Speculo 反馈。它们是向 AI 提出的请求，不是终端子命令。详见[命令指南](../upstream/docs/commands/README.md)。

[Skills Hub](../upstream/docs/capabilities.md#skills-hub) 包含 15 个可选的完整包。它们保留专门的 API、系统、教学、写作、图像和文档渲染能力。安装不会执行它们的工具。

## 安装与升级

方法位于 `.agents/speculo/`；宿主入口可选地位于 `.agents/skills/` 和 `.claude/skills/`。刷新保留用户记录和非受管新增内容。安装所有权、路径检查、暂存、漂移检测与恢复仍由确定性代码处理。

v3 将 Ops 合入 SpecDev，并简化指令格式。原有 Work 能力保留；旧 Ops 选择映射到其 SpecDev 后继。业务记录得到保留，不再按已退役协议解析。详见[升级说明](../upstream/docs/upgrade-v3.md)与[事务恢复](../upstream/docs/transaction-recovery.md)。

[文档](../upstream/docs/README.md) · [架构](../upstream/docs/architecture.md) · [贡献](../upstream/docs/contributing.md) · [研究](../upstream/docs/research.md) · [变更日志](CHANGELOG.md) · [许可证](LICENSE) · [第三方声明](THIRD-PARTY-NOTICES.md)
