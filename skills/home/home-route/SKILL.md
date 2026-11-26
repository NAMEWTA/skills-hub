---
name: home-route
description: 只读定位已登记项目，解析项目名、别名、分组、本机路径覆盖或指定 worktree。用于「项目在哪里」「这个名字指哪个仓库」「用这个 worktree」，核对实际 checkout、Git 远端身份和资料入口。更新登记用 home-setup，诊断已发现的结构异常用 home-doctor。
---

# 定位项目与实际 checkout

交付带依据的位置结果：repo ID、Home 根、登记路径、入口与真实路径、实际 checkout、Git 身份/HEAD/dirty、观测主机和时间。协调记录根与执行 cwd 分开；本技能不决定派遣工具或实际会话身份。

## 执行

先读取下述 Home 主入口，再读[路由与身份核查](references/routing.md)。同一上下文已读同一根、同一版本的入口可复用；新会话、压缩后缺失、入口更新或换根时重读。入口读不到先核对根、路径和安装状态，可用时调用 `home-doctor`；无需先成功读取才能做最小只读诊断。

1. 从实际 Home 根读取 `./.agents/home/AGENTS.md`。按用户所指 ID、别名或分组读取登记及合法本机路径覆盖。准确 ID 优先，别名重名时返回候选，以登记和用户明确指定的目标核对身份。
2. 按显式 checkout → local.json → 登记路径选择入口。核对真实路径、Git root、主 remote 和 common directory，支持 `.git` 为文件的 worktree；路径指向不同仓库时停止该目标。v2 按指定主 remote 的首 fetch URL 核验，其他 remote 的变动单独报告；旧 v1 沿用原身份规则。
3. 只确认统一入口是否存在；项目资料引用只解析 `repo ID + checkout 内相对路径`，不读取正文或扫描项目知识。
4. 将解析结果交回调用者。需要项目调查/开发时，由 `home-workflow` 按用户选择调用当地派遣方法；需要登记修改交 `home-setup`，结构异常交 `home-doctor`。

## 包内工具

```sh
node <本技能目录>/scripts/route.mjs --home "<Home 根>" --repo "<准确 ID 或别名>"
node <本技能目录>/scripts/route.mjs --home "<Home 根>" --repo "<ID>" --checkout "<实际 worktree>" --ref "<项目内相对路径>"
node <本技能目录>/scripts/route.mjs --home "<Home 根>" --group "<明确分组>"
node <本技能目录>/scripts/route.mjs --inspect "<接入前的既有 clone>" --expected-remote "<无秘密的 Git URL>"
node <本技能目录>/scripts/route.mjs --home "<Home 根>" --check-fetch "<登记主 fetch URL>"
```

工具使用 Node.js 22.14+ 和当前主机的 Git，只读 Git 元数据与文件入口。`--check-fetch` 供恢复前核对 Git 实际展开的 URL 身份，不联络远端。成功退出 0；输入/读取错误退出 2；缺项、歧义或身份冲突退出 3。分组结果可部分成功，调用者保留失败目标，不把已解析集合当成全部完成。

## 完成条件

项目身份、实际路径与作用范围均有依据；未知项不写成通过。检查 `remoteDrift` 和 `registryMatches`，已定位不等于登记仍与全部远端配置一致。不会 fetch、rebase、切分支、清理 dirty 文件、复制技能或读取项目知识。返回 `contextRead: false`，入口存在不等于当地 Agent 已读取。远端必须在用户指定且可达的实际主机核查，不把本机结果外推。
