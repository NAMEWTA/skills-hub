# npm 与 GitHub Release

## 分发内容

包名为 `@namewta/skills-hub`，本次包版本为 `0.0.8`。需要 Node.js 22.14+，安装器和运行工具使用 JavaScript，不需要 Python 或 TypeScript 编译器。

在目标项目根目录运行：

```sh
npx @namewta/skills-hub@0.0.8 list
npx @namewta/skills-hub@0.0.8 install --domain dev
npx @namewta/skills-hub@0.0.8 install --skill dev-spec system-proxy
npx @namewta/skills-hub@0.0.8 install --domain dev --replace
```

`npx` 负责取得 npm 包，安装器按明确选择把完整技能复制到当前项目的 `.agents/skills/`，并附带许可。包没有安装后自动执行的 lifecycle hook。源码方式仍可使用 `node /path/to/skills-hub/install.mjs`，参数一致。

`package.json` 的文件白名单只分发安装器、技能、许可、README 与法律说明。`materials/`、开发测试、维护工具和凭据不进入 npm 包；源码仓库继续保留完整来源对照。本次 scoped 包的发布附件为 `namewta-skills-hub-0.0.8.tgz`，是实际提交到 npm 的同一个压缩包，同时提供 `SHA256SUMS`。

## 仓库与旧版迁移

本版发布身份固定为源码仓库 `NAMEWTA/skills-hub` 与 npm 包 `@namewta/skills-hub`。先完成 GitHub 仓库的实际改名，再运行发布；脚本核对 Actions 提供的仓库身份、包名、锁文件及源码仓库元数据，不把旧地址的重定向视为身份已经一致，也不移除 provenance 来绕过不一致。

历史 `v0.0.1` 标签属于旧的 `skills-wta` 包，必须保留。本次 `@namewta/skills-hub@0.0.8` 使用 `v0.0.8` 标签；不移动旧 `v0.0.1`、不覆盖已发布的 npm 版本。后续版本继续使用常规 `v0.0.9` 等标签。npm 包名是独立身份，旧命令不会自动变成新包；使用本页的 scoped 安装命令取得新版。

## 自动发布入口

[发布工作流](../.github/workflows/release.yml) 支持以下入口：

| 入口 | 行为 |
| --- | --- |
| 向 `main` 推送 `package.json` / `package-lock.json` 的版本变化 | 自动验证新版本，再发布 npm、创建版本标签及 GitHub Release |
| 向 `main` 推送带 `Release-Retry: 当前版本` trailer 的修复提交 | 显式重试尚未完成的发布；仍执行全部验证、标签和不可变包检查 |
| 推送 `v*` 标签 | 当前版本及后续版本按 `v<version>`，均必须匹配实际包版本，并指向 main 历史中实际验证的提交 |
| 在 GitHub 发布 Release | 使用该 Release 的标签检出；版本一致并通过检查后发布 npm、补齐附件 |
| 在 Actions 手动运行 Release 工作流 | 选择 main 或对应版本标签，填写同一版本号；用于明确发布或重试 |

本次提交 `0.0.8` 的包配置并推送到 main，属于版本变化（本次从已发布的 `0.0.7` 版本递增 +0.0.1）。普通技能提交不会因为改了内容就自动复用旧版本发布；先递增版本。

每次 main 推送只先检查发布条件；版本未变且没有明确重试 trailer 时，发布任务直接跳过。当前版本在验证阶段失败、尚未创建版本标签和 npm 版本时，修复后可以在提交说明末尾独立一段写 `Release-Retry: 0.0.8`，推送后对新提交重新执行完整发布。该标记不跳过任何门禁，也不允许移动已有标签或覆盖 npm 内容。

## 发布下一版

在源码仓库完成修改与检查后：

```sh
npm run check:full
npm run check:statechart
npm run check:package
npm version 0.0.9 --no-git-tag-version
```

后续在 `CHANGELOG.md` 增加 `## 0.0.9 — YYYY-MM-DD` 及本版说明，提交代码、两个版本文件和更新记录，再推送 main。工作流完成检查后创建 `v0.0.9`，不要求另外手动打标签。也可以使用标签或 Release 入口，但其版本必须与代码一致。

稳定版发布到 npm `latest`；含预发布标识的版本，例如 `0.0.2-beta.1`，发布到 `next`，GitHub Release 标记为 prerelease。版本号不能重复用于不同内容。同仓库的发布任务串行执行；尚未发布且低于 npm 或 GitHub 现有 `latest` 的稳定版会明确失败，需递增版本。已经发布且完整性相同的旧版可以继续补齐 Release，但不会把 `latest` 指回旧版。

## 检查与凭据

工作流先固定提交及版本，将准备阶段的同一个 SHA 显式传给[跨平台验证](../.github/workflows/validate.yml)和发布任务，不在验证时重新解析标签。Linux 检查最低 Node.js 22.14.0，Windows 与 macOS 检查 Node.js 24；执行全部维护测试、状态图捕获轨迹回放，以及实际 npm 包的离线安装。发布任务依赖这些任务全部成功。

仓库 Secret `NPM_TOKEN` 在发布步骤映射为 `NODE_AUTH_TOKEN`；不写入源码、包、技能、版本说明或日志。它的授权范围需要覆盖 `@namewta` scope 下 `@namewta/skills-hub` 新包的创建与发布，以及需要使用的只读 stage 查询；已有其他包的权限不会自动覆盖此包。token 的能力和包侧权限决定结果是直接发布还是进入暂存审批。需要维护者批准的暂存包会保留为待审查状态，不能把 CLI 的成功输出当作已经公开。只读识别 stage 还需要该凭据有本包的读取权限；权限错误会明确停止，不按“没有 stage”继续重发。GitHub 自动提供的 `GITHUB_TOKEN` 只在发布任务拥有写 Release / 标签权限；普通验证任务保持只读。

发布任务使用 `--provenance` 并申请 `id-token: write`。如果以后为此包配置 npm trusted publisher，填写仓库 `NAMEWTA/skills-hub` 与工作流文件名 `release.yml`；当前工作流也具备 npm 使用 OIDC 的条件。npm 的当前政策正在调整 token 直接发布能力，长期使用可按[官方可信发布说明](https://docs.npmjs.com/trusted-publishers/)完成包侧绑定，不将修改账户权限混入普通技能安装。

GitHub 自动创建的 Release 不依赖再次触发另一条工作流：npm 公开版本核对、标签、附件与 Release 完成都在同一发布任务中执行；仍待 npm 审批时只准备 Release 草稿和审查信息。

## 重试与部分完成

发布脚本先检查已有标签，禁止移动到其他提交。npm 版本已经存在时，实际 tarball 的 SHA-512 必须与 registry 一致，才能跳过 npm 发布并继续补齐 Release；内容不同会失败并要求递增版本。已有 Release 附件同样核对内容，不静默覆盖。

公开版本与 `latest` 都查询 scoped 包本身。包名作为一个路径段编码，其中 `/` 写成 `%2F`；不会退回查询同名的无 scope 包。

| 查询 | 固定 registry 下的 GET 路径 |
| --- | --- |
| 当前版本与完整性 | `/%40namewta%2Fskills-hub/0.0.8` |
| 当前 npm latest | `/%40namewta%2Fskills-hub/latest` |

npm 发布后会读回 registry 的版本与完整性；随后准备 GitHub Release 草稿、上传压缩包与校验和，最后发布草稿。重跑时会分页查找同标签的既有草稿并继续；匹配到多个草稿时明确停止。只有草稿中上传失败遗留的 `state=starter`、大小为零的同名占位附件会被清理重传，正常附件仍核对内容且不覆盖。缺少服务端摘要的附件通过带授权的 GitHub asset API 下载核对，因此草稿也可恢复。

某个外部步骤失败时，按实际结果报告，不把 npm 和 GitHub 视为同一事务。可重跑原失败任务，或在 Actions 选择原版本标签并填写相同版本号继续。主分支已前进时，不要把新的 main 提交当作原提交重试。

如果需要修改已发布包的内容，应发布新版本。即使修改只涉及发布脚本，新提交也不能替代已有版本标签指向的提交。标签已经存在时须保持原 SHA；若修复后的流程无法在原提交上完成，应明确处理剩余发布步骤，不能移动标签或覆盖 npm 版本。标签尚未创建时，只有实际 tarball 完整性相同且新提交通过全部检查，才能继续原版本的收尾。

## npm 进入暂存审批时

npm 暂存版本与正式版本共用版本号约束。若 CLI 返回成功，但公开版本仍为 404，或后续重试返回 `Cannot publish over previously staged version`，不要反复 `npm publish`、改写同版本内容或绕过 2FA。脚本在公开版本不可读时先查询已有 stage；发现已核验的同版本 stage 就停止重复 npm 上传。

只读查询使用固定的 `https://registry.npmjs.org`，并按 npm CLI v12.2.1 的实现执行：

| 操作 | GET 路径与响应 |
| --- | --- |
| 按包名列出 stage | `/-/stage?page=0&perPage=100&package=%40namewta%2Fskills-hub`；响应为 `{items, page, perPage, total}`，页码从 0 开始 |
| 读取唯一 stage 详情 | `/-/stage/<uuid>`；返回单个 item，核对 `id`、`packageName`、`version`、`tag`、`shasum` |
| 下载待审查原件 | `/-/stage/<uuid>/tarball`；返回 tarball 原始字节 |

列表和详情的已知字段包括 `id`、`packageName`、`version`、`tag`、`createdAt`、`actor`、`actorType`、`shasum`、`status`。项目不假设详情提供 `dist.integrity` 或审批 URL，也不根据未经确认的 `status` 语义推断已经公开。查询失败、身份不符、同版本匹配多个 stage 或摘要不符都会停止。

脚本下载 stage 原件，核对它的 SHA-1 与列表/详情的 `shasum`，再计算完整 SHA-512 SRI，并逐字节比较本次打包文件。通过后创建或继续同一标签的 GitHub Release 草稿，附上完全相同的 `.tgz` 与 `SHA256SUMS`。Actions Summary 和草稿说明会显示实际 stage UUID、草稿地址、完整摘要与维护者操作；任务以非零状态结束，明确表示 npm 尚未正式发布。

维护者本人在支持 stage 的 npm CLI（11.15.0+）中，使用 Summary 提供的实际 UUID：

```sh
npm stage view <stage-id> --registry=https://registry.npmjs.org/
npm stage approve <stage-id> --registry=https://registry.npmjs.org/
```

先检查包名、版本与内容，再由本人完成批准所要求的 2FA；也可在 npm 网站的 **Staged Packages** 标签页审查和批准。自动流程不会调用 stage approve / reject，不修改审批权限，不收集验证码。批准完成后，重跑**原提交**的发布任务或选择对应版本标签：公开版本的完整性通过核对后，流程只移除自身的 `skills-hub:npm-stage` 待审批标记，保留维护者已有正文和追加说明，然后正式发布 GitHub Release。

没有 `NODE_AUTH_TOKEN` 的 OIDC 发布仍可运行，但 OIDC 短期发布凭据不能用于这些 stage 查询。若公开版本始终不可读，脚本会明确报告只读识别能力缺口，不假装已发布。CLI 返回后只做有限次数的公开版本/stage 核验，不无限轮询。

## 官方依据

- [GitHub：发布 Node.js 包](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages)：Release 触发、`setup-node` registry 配置、`NODE_AUTH_TOKEN` 与 provenance。
- [GitHub：Release API](https://docs.github.com/en/rest/releases/releases)：按标签查询已发布 Release，以及通过列表查询有权限读取的草稿。
- [GitHub：Release 附件 API](https://docs.github.com/en/rest/releases/assets)：授权下载附件，以及上传失败后 `starter` 空占位的处理。
- [npm：访问令牌](https://docs.npmjs.com/about-access-tokens/)：granular token 的发布权限、2FA 与 stage-only 区别。
- [npm：可信发布](https://docs.npmjs.com/trusted-publishers/)：OIDC、Node/npm 版本前提、仓库与工作流绑定。
- [npm：暂存发布](https://docs.npmjs.com/staged-publishing/)及 [npm stage 命令](https://docs.npmjs.com/cli/v12/commands/npm-stage/)：维护者审查、2FA、只读命令与凭据限制。
- npm CLI v12.2.1：[列表及分页](https://github.com/npm/cli/blob/v12.2.1/lib/commands/stage/list.js)、[详情](https://github.com/npm/cli/blob/v12.2.1/lib/commands/stage/view.js)、[tarball 下载](https://github.com/npm/cli/blob/v12.2.1/lib/commands/stage/download.js)、[响应测试](https://github.com/npm/cli/blob/v12.2.1/test/lib/commands/stage/view.js)与 [摘要计算](https://github.com/npm/cli/blob/v12.2.1/lib/utils/tar.js)。

本页描述发布机制，某次实际发布的成功状态以该提交的 Actions、npm 版本和 GitHub Release 为准。

## 领域持久化

本包所有技能安装目录仍为 `.agents/skills/`，与资料沉淀目录分离。开发技能使用 `.agents/dev/`，系统技能使用 `.agents/system/<host>/`，其他领域统一采用 `.agents/<domain>/`。旧 `.agents/wtadev/` 只作为迁移输入，不在安装器运行时自动移动；见[领域目录规范](persistence-roots.md)。

## 分支清理

完成主分支全平台验证后，可以运行明确授权的一次性分支清理工作流。它只删除完全包含于 main 的非默认、非保护分支，未合并或期间更新的分支保持原样并报告异常。此操作不删除 tag、Release、npm 历史或任何项目资料。
