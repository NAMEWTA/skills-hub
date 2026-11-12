---
name: dsh-pre-push-checks
description: 推送、强制推送、标记可评审或声称 deepseek-harness 分支检查通过前，以及 gh stack sync 发布重写分支后立即使用，选择覆盖待发或刚发布差异的最小测试与检查，不条件反射运行全仓套件。
---

# DSH 推送前检查

在 `deepseek-harness` 推送前，用本技能运行一次相关本地证据。唯一顺序例外是 `gh stack sync`，它可能在验证重写层之前发布级联变基；之后立即验证，证据通过前不合并。Git 钩子有意保持狭窄：pre-commit 修复已暂存 lint、检查已暂存空白并保护 vendored 来源元数据；pre-push 只跑增量仓库类型检查。穷尽覆盖及平台矩阵由 CI 负责。

## 检查待发变化

1. 确认检出及分支。

```sh
git status --short --branch
git rev-parse --show-toplevel
```

2. 验证实时 PR 基分支或堆叠父分支，获取该引用，并对照检查完整范围。

```sh
pnpm --silent run change-scope --base <verified-base-ref>
```

命令不会猜测或获取基准。提供已从当前远程或堆叠状态验证的引用；检查非 `HEAD` 提交时用 `--head <ref>`。其带版本 JSON 记录相对解析出的合并基点的已提交路径；暂存、未暂存及未跟踪路径描述当前工作树。合并变化的基分支后重新报告，重估组合范围会影响的行为，只重跑因合并失效的检查。

## 选择相关证据

钩子之外没有统一本地基线。每项行为变化需要可用的最窄测试或专用检查，且能在回归时失败；只有差异实际触及更广表面才增加检查。

待发变化新增或修改拥有资源或异步的测试、夹具、辅助程序或 CI 执行路径时，先用 [dsh-ci-test-reliability](../dsh-ci-test-reliability/SKILL.md)决定是否适用恢复、负控制、静止拆除或并发进程证据。本技能仍负责选命令，避免重复已通过证据。

- **包或脚本行为：** 运行负责的 Vitest 文件或聚焦测试名。共享约定变化时加邻包测试；除非变化确实横切或用户要求，全仓覆盖留给 CI。
- **Remote mock 类型：** 未构建的 `any` 是显式本地回退，不是严格证据。交付 Remote／mock 变化前运行 `pnpm run typecheck`；诊断剩余错误前重建缺失、过时或不完整生成声明。例外留在[测试代理](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/test-support/remote-mock/README.md#remote-proxy)，不进生产 Remote 类型、环境标志或复制签名。
- **文档、Agent Notes、目录或文档链接注释：** 运行 `pnpm run doc-sync`；文档流程要求时跑完整 lint。
- **用户可见 UI：** 用 [UI 变更流程](../dsh-client-ui-ux/SKILL.md#required-review-loop)及其[最低检查](../dsh-client-ui-ux/SKILL.md#受影响-ui-最低检查)，验证必需检查及新增累积效果。披露缺失检查；可选文书不替代结果检查。复用有效证据；普通变更推送时不需单独完整审计报告。保留既有测试、GUI GIF 及设计师／产品批准要求。仅测试不足以确立视觉验收。
- **模型、编辑器、CLI 或终端可见输出：** 运行负责输出的聚焦无密钥快照或真实可运行示例场景。
- **预期输出位置：** 所选已记录 Session 代既作回放输入又作预期持久输出的测试，放顶层 `snapshots/`，`snapshot.yml` 命名已交付 `dsh` 配置档及组合／头部固定信息。规范父文件为 `session[.vN].jsonl`，子文件为 `session.<ordinal>[.vN].jsonl`；框架按角色选择最高代。没有该 Session 往返的 ARIA、几何、生成器、CLI 及单元预期，放负责测试旁的 `tests/expected/`；不放 `snapshots/`，不设 `*.snapshot.ts` 负责文件。用负责的 `test:expected`、`test:web` 或 `test` 通道。
- **配置档及配置位置：** 已交付 `dsh` 配置档的跨包行为放 `apps/cli/tests/profiles/`；包专用 Loader 组合放该包 `tests/fixtures/`。面向用户的可选叠加层放 `apps/cli/config/examples/`，配对 `docs/user/` 指南。
- **包清单、公开导出、构建配置、worker／bin 入口或构建后运行路径：** 运行 `pnpm run build`、相关卫生检查及负责的构建产物冒烟测试。
- **仓库测试及脚本类型：** `pnpm run build:artifacts` 只检查包项目。声称 TypeScript 变化完成前，在最新 `build:artifacts` 后运行 `pnpm run build:check`，或运行 `pnpm run build`；`build:check` 读取已有 `build:artifacts` 输出，绝不重建它。
- **真实提供者或 agent 行为：** 有凭据时运行相关 `pnpm run test:e2e` 目标；绝不打印秘密。

不要仅因接下来提交或推送而手工重复已通过检查。特别是，不要只为重复 pre-push 钩子而在推送前立即运行类型检查。

通过 `pnpm run` 时，Vitest 文件及名称过滤器直接放脚本名之后；不要插入独立 `--`，它会传到 Vitest，可能禁用 `-t` 过滤。例如以下只跑一个无头快照场景：

```sh
pnpm run test:snapshot snapshots/session/headless.snapshot.ts -t 'cordis-inspect-jsdoc'
```

此规则适用于这些 pnpm 脚本；npm 及其他启动器有自己的参数转发语法。将过滤运行作为聚焦证据前，检查报告的选中测试数。

### 单元覆盖聚焦受影响源码

测试选择与覆盖选择独立。Vitest 文件过滤器选运行测试，而仓库配置默认衡量每个 `packages/*/*/src/**/*.ts` 文件。需要单元覆盖时，同时命名负责测试及其必须证明覆盖的源文件或包：

```sh
pnpm exec vitest run packages/<group>/<package>/tests/<behavior>.spec.ts \
  --coverage \
  --coverage.include='packages/<group>/<package>/src/**/*.ts'
```

行为确实限于一个模块时用准确源文件。多文件或包重复 `--coverage.include`，传入覆盖范围所需全部负责测试文件。配置的逐文件 100% 阈值在选中范围内仍适用。

负责测试不清楚时，用 Vitest 依赖图发现候选，再检查所选测试后才作为证据：

```sh
pnpm exec vitest related packages/<group>/<package>/src/<changed>.ts \
  --run \
  --coverage \
  --coverage.include='packages/<group>/<package>/src/<changed>.ts'
```

`vitest related` 无法发现仅经配置、动态加载、子进程、worker、构建产物或外部提供者触达的行为；显式选其负责测试。不用 `--passWithNoTests`、降低阈值或缩窄 `--coverage.include` 隐藏未覆盖的受影响文件。所选包范围因单个聚焦测试覆盖不足失败时，增加其他相关负责测试；只有排除模块不可能受变化影响时才能缩窄源码范围。

## 完整本地预演

只有用户明确要求、诊断 CI 失败，或变化横跨仓库到没有更窄可信集合时，才运行完整本地近似。以当前工作流及包脚本为清单；不重建已删除 `check:pre-push` 聚合。

## 保护重写历史的推送

独立及堆叠 PR 分支允许变基，包括评审之后。独立历史重写前，获取当前远程分支，记录准确 OID；用 `--force-with-lease=<branch>:<observed-oid>` 发布，确保并发更新会中止推送。`gh stack push` 及 `gh stack sync` 为托管分支提供租约保护。绝不允许裸 `--force`。

任何重写推送后，再取实时分支头，重新审计未解决评审线程、批准、可合并性及检查。重写前提交哈希及行内评论锚点不再是当前证据。

### 同步后验证

`gh stack sync` 在一次操作中获取、级联变基并推送，无法在重写与发布之间插入本地验证。运行前要求干净工作树，记录官方堆叠顺序及准确远程分支头。返回后：

1. 重新查询每个分支头及 GitHub 官方堆叠顺序。
2. 对照实时 PR 基分支检查每个重写层的变化范围。
3. 为每个受影响层运行本技能选出的相关证据。
4. 所选检查全部通过前，所有 PR 保持未合并，报告验证待定。

同步后证据失败时，保留受租约保护的已发布分支头，修复、验证修复并发布纠正。不因命令成功就声称同步使堆叠可合并。

## 处理失败

普通推送前相关检查失败，停下修复或解释阻塞。不推送并盼 CI 不同。同步后例外则阻止合并，遵循上述修复流程。

看似环境专用失败时，证明它：

- 记录准确命令、失败测试及平台专用不匹配。
- 确认相关非平台证据。
- 必需检查优先修跨平台不确定性。
- 只有用户明确要求或同意才绕过本地钩子，准确报告什么失败、为何预期 CI 不同。

## 推送流程

普通及独立变基推送：

1. 相关检查运行一次。
2. 正常提交，继续前检查 pre-commit 修复器改动文件。
3. 正常推送，或对获授权重写分支用准确租约，使增量类型检查钩子运行。
4. 验证远程引用匹配本地 `HEAD`。

```sh
git rev-parse HEAD origin/$(git branch --show-current)
```

GitHub PR 推送后检查远程 CI：

```sh
gh pr checks
```

待定检查如实报待定。归因分支或环境前先检查失败。

`gh pr checks` 报 “no checks reported”，且 `/actions/runs?head_sha=<sha>` 返回 `total_count: 0` 时，怀疑推送或 GitHub 事件丢失前先读可合并性：

```sh
gh pr view <number> --json mergeable,mergeStateStatus
```

PR 为 `CONFLICTING`／`DIRTY` 时 GitHub 不创建 `pull_request` 工作流运行，因此缺信号表示冲突，不是基础设施。唯一修复是解决冲突；空提交、`--allow-empty` 推送、草稿／就绪切换、撤销再恢复，都让 `total_count` 仍为零并增加垃圾历史。分支尚无法本地合并时，用 `git merge-tree --write-tree HEAD origin/<base>` 确认冲突路径。

`gh stack sync` 使用同步后验证顺序，不假装普通顺序可行。
