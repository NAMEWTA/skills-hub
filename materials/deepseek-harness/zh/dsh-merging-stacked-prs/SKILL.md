---
name: dsh-merging-stacked-prs
description: 将依赖 GitHub PR 栈（A ← B ← C，每个基于下层分支）合入 master，合并基准是另一个开放 PR 分支的 PR，或请求提到 stacked PRs、PR stack、dependent PRs 或按序合并多个关联 PR 时使用。要求同仓库的每条依赖链在落地前使用 GitHub 官方堆叠 PR 功能，让 GitHub 负责全栈规则、CI、排序、改换目标与合并状态。
---

# 落地官方 GitHub PR 栈

通过 GitHub 原生栈对象和 `gh stack merge` 落地依赖 PR。不要用 `gh pr merge` 与 `gh pr edit` 逐个合并并改换目标来复刻栈语义。根 [AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/AGENTS.md)负责允许的向前合并和变基历史；[栈审查指南](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/cookbook/responding-to-pr-review-on-a-stack.md)负责审查修复的传播。

## 要求原生栈支持

修改 GitHub 状态前运行 `gh stack --version`。官方扩展或服务端栈功能不可用就硬停止；不要退回逐个手工合并和改换 PR 目标。GitHub 栈要求所有头分支在同一仓库，因此跨 fork 链应硬停止。

使用干净的专用工作树。获取当前 PR 元数据及准确头 OID，不信任分支名或早先报告：

```sh
gh pr view <pr> --json number,author,baseRefName,baseRefOid,headRefName,headRefOid,isCrossRepository,state,isDraft,reviewDecision,mergeStateStatus,statusCheckRollup
```

每条表面上的链至少查询一个 PR 的 `PullRequest.stack` 和 `stackEntry.position`；这个 GitHub 官方对象才是栈成员的权威来源，不能仅推断基准分支。`size` 超过返回页时，对 `entries` 分页：

```sh
gh api graphql -F owner=<owner> -F name=<repo> -F number=<pr> -f query='
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      number
      author { login }
      baseRefName
      headRefName
      stackEntry { position }
      stack {
        number
        baseRefName
        size
        entries(first: 100) {
          nodes {
            position
            pullRequest { number author { login } baseRefName headRefName state isDraft }
          }
        }
      }
    }
  }
}'
```

按在线 PR 的基准确定预期的自底向上顺序：底层以主干为目标，每个更高 PR 以紧邻下层的头分支为目标。

## 链接缺失栈成员

先比较已有栈条目与预期链。一个现有栈可以包含所请求链中保持顺序的子集；出现多个栈编号、非预期条目或顺序冲突时，任何修改前都需要用户指示。

任意依赖 PR 尚未加入该官方栈时：

1. 精确比较每个 `author.login`。
2. 全部作者相同时，按自底向上顺序自动链接该链：

```sh
gh stack link --base <trunk> <bottom-pr> <next-pr> ... <top-pr>
```

3. 作者不同或任一作者不可获得时，修改 GitHub 状态前询问用户是否链接。
4. 重新查询 GraphQL，要求只有一个栈编号、预期主干、完整 PR 集合，以及预期位置与基准链。

绝不自动解散、重排或重建已有栈；`gh stack link` 只追加，已合并或排队条目无法移出栈。

## 只在需要时刷新

不要仅因为存在刷新机制就改写分支。在线合并状态或仓库规则要求更新主干时，在两种允许的历史中选择：

- **原生级联变基：** 远程栈尚未在本地跟踪时，用 `gh stack checkout <pr-or-stack>` 检出，再运行 `gh stack sync`。命令可能在本地验证前对每个活动层变基，并进行租约保护的强推。立即检查改写范围，对每个受影响层运行相关检查；通过前不得合并或声称已就绪。sync 检测到变基冲突时，用 `gh stack rebase`，解决并验证，再用 `gh stack push` 发布。checkout 或 sync 报告本地与远程栈组合分歧时，取消并询问，不自动删除或重建远程栈。
- **增量向前合并：** 把主干合入最底部受影响分支，再按自底向上顺序将每个更新后的父分支传播到子分支，正常推送。合并进行期间基准前进时，先保留该检查点，再合入较新的头。

审查后允许任何历史改写，但会使提交 OID 假设失效。推送后重新获取准确头提交，重审未解决审查线程、批准、可合并性及检查。绝不使用裸 `--force`，也不覆盖并发前进的远程头。

## 合并范围预检

合并前立即重查官方栈。要求每个选中 PR 开放、非草稿、顺序正确，并满足仓库审查与检查要求。独立处理每个 PR 状态；顶层就绪不能证明依赖已就绪。

“落地该栈”选择整个栈。部分落地需要明确边界 PR，并包括从最底层到该边界的每一层。

## 通过栈 API 合并

用官方栈编号合并整个栈：

```sh
gh stack merge <stack-number> --yes --merge
```

明确请求部分落地时，合并到边界 PR：

```sh
gh stack merge <boundary-pr> --yes --merge
```

不传 `--delete-branch`，不手工改换依赖目标，不发出逐 PR 合并命令。GitHub 自底向上合并选中范围，并对剩余上层改换目标／变基。直接栈合并是全有或全无；主干使用合并队列时，GitHub 将选中范围一起入队，但可能分组合入。

不绕过合并要求。原生合并报告阻塞项时，经由负责 PR 检查并解决，或停止并报告；绝不退回 `gh pr merge`。

## 验证落地状态

等待每个选中 PR 都报告 `MERGED`；排队请求不等于已落地：

```sh
gh pr view <pr> --json number,state,mergedAt,mergeCommit,baseRefName,headRefName
```

部分落地后，重查官方栈，验证每个剩余 PR 仍按预期顺序链接，目标是栈主干或其下层。重新检查当前头、审查状态及 CI，因为 GitHub 可能已将剩余层变基。

仅在对应 PR 报告 `MERGED` 后，另作最后一轮分支删除。删除每条分支前，要求 GitHub 报告没有开放 PR 仍以它为基准：

```sh
gh pr list --state open --base <branch> --json number --jq length
```

任何非 `0` 结果都阻止删除。

## 检查清单

- [ ] 原生 `gh stack` 支持可用；每个 PR 分支在同一仓库。
- [ ] 在线 PR 基准与准确头建立一条自底向上的依赖链。
- [ ] GraphQL 报告一个官方栈，其主干、条目及顺序符合预期；符合条件的同作者未成栈链已自动链接。
- [ ] 任何改写层都通过相关验证，之后已重审审查线程、批准、可合并性及检查。
- [ ] 整栈或有明确边界的前缀，通过 `gh stack merge --yes --merge` 提交。
- [ ] 每个选中 PR 报告 `MERGED`；剩余上层仍构成预期官方栈。
- [ ] 仅在验证已合并状态及零依赖后删除分支。
