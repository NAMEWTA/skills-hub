# npm 与 GitHub Release

发布从已经提交的包版本和精确源码提交生成 tarball。同一个压缩包上传 npm，并作为 GitHub Release 附件分发。实际版本以 `package.json`、`package-lock.json` 和 `CHANGELOG.md` 为准；本页维护发布操作和恢复契约。

## 分发内容

包名为 `@namewta/skills-hub`，命令名为 `skills-hub`，需要 Node.js 22.14+。用户安装方式见[安装契约](../usage/installation.md)。

[package.json](../../package.json) 的文件白名单包含安装器、交互模块、持久化初始化资源、两类运行技能以及法律文件。README 和包元数据按 npm 的打包规则分发。`materials/`、`docs/`、开发测试和维护工具不进入包。

安装器只复制所选技能和更新领域导航，不执行技能脚本。完整资源和独立包内的原生法律文本随包保留；来源、版权和修改范围见[第三方声明](../../THIRD_PARTY_NOTICES.md)。

发布附件使用 npm 实际返回的文件名，另提供 `SHA256SUMS`。包检查在隔离消费者中安装真实 tarball，核对命令入口、运行文件、适用执行位、许可、预览和重复安装。交互依赖由 npm 正常解析；不能把只完成 `npm pack` 写成消费端安装已经验证。

## 自动发布入口

[发布工作流](../../.github/workflows/release.yml)先由 [release.mjs](../../scripts/release.mjs)确认发布计划：

| 入口 | 发布条件 |
| --- | --- |
| 向 `main` 推送 | 包版本变化；或提交末尾有 `Release-Retry: <当前版本>` trailer |
| 推送 `v<version>` 标签 | 标签版本与包版本一致，目标提交属于 main 历史 |
| 发布 GitHub Release | 从该 Release 标签检出，核对版本和提交 |
| 在 Actions 手动运行 Release | 选择 main 或对应版本标签，输入同一版本 |

版本未变且没有重试 trailer 的普通 main 推送只检查条件，发布任务跳过。跳过不表示新内容已经发布。每次实际发布把准备阶段固定的 SHA 同时传入跨平台验证和上传任务，后续不重新解析浮动分支或标签。

## 发布下一版

1. 完成需要发布的代码、技能和文档修改。核对范围及现有用户授权。
2. 在源码根目录递增补丁版本，或按变更范围选择其他版本级别：

   ```sh
   npm version patch --no-git-tag-version
   ```

3. 在 `CHANGELOG.md` 为这个版本记录用户可见变化、必要迁移和限制。`package.json` 与锁文件必须一致。
4. 在最终文件上执行发布检查：

   ```sh
   npm ci --ignore-scripts --no-audit --no-fund
   npm run check:full
   npm run check:statechart
   npm run check:package
   npm run check:upstream
   ```

   `check:upstream` 需要可启动的 Chrome/Chromium。命令的环境与覆盖范围见[验证指南](validation.md)，不要把缺少前提记为通过。

5. 按仓库协作方式提交并把通过审查的改动合入 main。工作流验证同一提交后先核验 npm 发布结果，再补齐 `v<version>` 标签与 Release。已核验的 stage 只准备草稿，公开包通过完整性核对后才正式发布 Release；无需提前手动创建第二个标签。
6. 回读 npm 的包名、版本和完整性，以及 GitHub Release 的标签、提交、公开状态与两个附件。将实际结果保存在 `.agents/dev/deploy/npm/releases/`，环境操作说明保存在相邻 `runbook.md`。

稳定版使用 npm `latest`，含预发布标识的版本使用 `next`，GitHub Release 标为 prerelease。尚未发布且低于 npm 或 GitHub 最新稳定版的版本会失败。已发布且内容一致的旧版可以补齐附件，但不会把 `latest` 指回旧版。

## 检查与凭据

[跨平台验证](../../.github/workflows/validate.yml)覆盖 Ubuntu 的最低 Node.js 22.14.0，以及 Windows、macOS 的 Node.js 24。各平台执行完整维护检查、捕获轨迹回放和真实 npm 包验证；Linux 另检查已安装 Archify 的完整 finalize 与浏览器检查。发布任务等待这些任务全部成功，同仓库发布串行执行。

工作流把仓库 Secret `NPM_TOKEN` 映射为 `NODE_AUTH_TOKEN`，需要对实际 scoped 包具备所需发布和只读 stage 权限。凭据不写入源码、压缩包、技能、发布说明或日志。包侧若要求 stage-only 上传，普通 `npm publish` 会被拒绝；本发布器调用普通 publish，只读取并接续已经存在的 stage，不自动改成暂存上传。

发布任务申请 `id-token: write` 并使用 `--provenance`。采用 npm trusted publisher 时，包侧绑定必须与仓库 `NAMEWTA/skills-hub` 和工作流 `release.yml` 一致。OIDC 能否发布取决于实际 npm 配置，不由工作流文件存在本身证明。

`GITHUB_TOKEN` 仅在发布任务拥有标签和 Release 写权限，验证任务保持只读。自动流程不修改账户权限、不代替维护者审批 stage，也不收集 2FA 验证码。

## 重试与部分完成

npm、Git 标签和 GitHub Release 是多个外部步骤。一个步骤成功不能推出整次发布成功；恢复时先读取已经存在的状态。

| 已有状态 | 后续行为 |
| --- | --- |
| 标签存在且指向目标提交 | 继续核对包与附件 |
| 同名标签指向其他提交 | 停止，禁止移动标签 |
| npm 版本存在且 SHA-512 SRI 与实际 tarball 相同 | 跳过上传，继续完成 Release |
| npm 同版本内容不同 | 停止并递增版本，不能覆盖 |
| 同标签有唯一草稿 | 核对并继续使用 |
| 同标签有多个草稿 | 停止，先消除身份歧义 |
| 正常附件已存在 | 核对摘要，不静默覆盖 |
| 草稿有上传失败的同名 `state=starter` 零字节占位 | 清理占位后重传 |

公开 metadata 和 `latest` 都查询 scoped 包本身，包名中的 `/` 编码为 `%2F`。已有附件没有服务端摘要时，通过授权 asset API 读取内容核对，草稿也采用相同完整性要求。

可以重跑原失败任务，或在 Actions 选择原版本标签并填写相同版本。main 已前进时不能把新提交当作原提交重试。尚未创建标签且尚未发布版本时，可在修复提交末尾使用 `Release-Retry: <当前版本>`，让新提交重新通过全部检查。

若版本已有部分外部状态，新提交继续收尾必须满足已有标签身份和 tarball 不可变条件。发布脚本改动也不允许移动既有标签。需要改变包内容时发布新版本。

## npm 上传后的异步可用性

CLI 成功返回与公开版本可读是两个状态。公开查询返回 404 本身不能区分扫描、暂存审批或其他尚未公开状态。

脚本只上传一次，然后进入 20 分钟的只读核验窗口。立即查询后，检查间隔最多 30 秒；最后一次等待按剩余预算缩短，单个请求仍有 30 秒超时。窗口用单调时钟计算，日志说明已等待和剩余时间。等待时不重复 publish，不修改包，也不跳过平台检查。

只有公开 metadata 的包名、版本和完整 SHA-512 SRI 都匹配本次 tarball，才确认 npm 已公开并正式发布 GitHub Release。发现已经完整核验的 stage，则进入下一节的草稿流程。完整性冲突、权限错误和其他请求失败会停止。

npm CLI 自身失败时，脚本只按恢复流程核对一次已存在的公开版本或 stage；无法核实时保留原上传错误。窗口结束仍未确认公开会以非零状态结束，保留版本并报告实际状态。先只读核对扫描或审批结果，再从同一提交恢复。

### 只读查询发布状态

在 Actions 选择 [Inspect npm publication status](../../.github/workflows/npm-publication-status.yml)，点击 **Run workflow**。`version` 留空时读取所选提交的 `package.json.version`，也可以填写要核对的版本。main 上该工作流文件发生变更时会自动查询一次。任务使用 Node.js 24，无需安装依赖，只发送固定 npm registry 的 GET 请求。

日志和 Step Summary 分别列出精确公开版本、`latest` 阳性对照、packument 是否包含目标版本，以及该版本的发布生命周期。仅生命周期请求携带仓库 Secret `NPM_TOKEN`；输出限制为 HTTP 状态和包名、版本、状态、完整性等选定字段，不输出凭据或原始响应。

[npm 官方 API 文档](https://api-docs.npmjs.com/)定义生命周期接口 `GET /-/package/{name}/version/{version}/status`，其中 scoped 包名的 `/` 编码为 `%2F`。它需要具有该包发布权限的 npm token。401、403、404 按原 HTTP 状态显示；生命周期 404 也可能表示没有查询权限，不能解释为版本不存在。`latest` 对照也无法读取时，先排查查询通道，不能据此判断目标版本状态。工作流完成仅表示查询结束，不代表发布完成。

上传命令成功但公开状态未确认时，不直接重跑发布任务：现有发布器若仍查不到公开版本或 stage，会再次上传。先读取生命周期并核对公开版本；确认包名、版本及 SHA-512 SRI 与原 tarball 一致后，再恢复原提交。诊断工作流不上传包、不批准 stage、不修改 npm tag 或 GitHub Release。

## npm 进入暂存审批时

公开版本不可读时，脚本查询固定 registry `https://registry.npmjs.org` 的已有 stage。只读协议如下：

| 操作 | 请求与核对 |
| --- | --- |
| 列出该包 stage | `/-/stage?page=0&perPage=100&package=%40namewta%2Fskills-hub`；按 `{items, page, perPage, total}` 分页 |
| 读取唯一 stage | `/-/stage/<uuid>`；核对 `id`、`packageName`、`version`、`tag`、`shasum` |
| 读取待审查原件 | `/-/stage/<uuid>/tarball`；返回 tarball 字节 |

脚本不假设响应提供 `dist.integrity` 或审批 URL，也不把未知 `status` 解释为已经公开。查询失败、身份不符、同版本多个匹配项或摘要不符都会停止。

确认 stage 时，先核对原件 SHA-1 与列表、详情中的 `shasum`，再计算 SHA-512 SRI，并与本次 tarball 逐字节比较。通过后准备同一标签的 Release 草稿，上传同一个压缩包与 `SHA256SUMS`；Actions Summary 和草稿提供实际 UUID、摘要及操作说明。任务仍以非零状态结束，表示 npm 尚未正式公开。

维护者使用支持 stage 的 npm CLI，并替换实际 UUID：

```sh
npm stage view <stage-id> --registry=https://registry.npmjs.org/
npm stage approve <stage-id> --registry=https://registry.npmjs.org/
```

先审查包名、版本和内容，再完成平台要求的本人认证。也可以使用 npm 网站的 Staged Packages。批准后重跑原提交或对应标签的发布任务；公开版本完整性通过后，流程移除自身 `skills-hub:npm-stage` 标记，保留维护者正文和附加说明，再公开 Release。

只使用 OIDC 而没有 `NODE_AUTH_TOKEN` 时，短期发布凭据不能承担这些 stage 查询。核验窗口后仍不可读时，脚本报告只读识别能力缺口，不推断成功或无限轮询。

## 仓库与旧版迁移

发布身份固定为 `NAMEWTA/skills-hub` 与 `@namewta/skills-hub`。脚本核对 Actions 仓库身份、包名、锁文件与 repository 元数据，不能依靠旧地址重定向或移除 provenance 绕过不一致。

旧包和旧标签保留其历史内容。使用者更换包名的方法见[安装迁移](../usage/installation.md#从-skills-wta-迁移)。

## 官方依据

实际流程以[发布脚本](../../scripts/release.mjs)和[工作流](../../.github/workflows/release.yml)为准。维护外部协议时核对 [GitHub 发布 Node.js 包](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages)、[Release API](https://docs.github.com/en/rest/releases/releases)、[附件 API](https://docs.github.com/en/rest/releases/assets)、[npm 访问令牌](https://docs.npmjs.com/about-access-tokens/)、[可信发布](https://docs.npmjs.com/trusted-publishers/)和[暂存发布](https://docs.npmjs.com/staged-publishing/)。这些链接用于协议维护，不表示当前仓库已经配置了其中每种发布方式。

## 领域持久化

用户技能安装目录与项目记录分离，详见[持久化规范](../reference/persistence-roots.md)。本仓库的单次发布结果放 `.agents/dev/deploy/npm/releases/`，不追加到长期发布指南。

## 分支清理

明确授权后可以运行仓库的分支清理工作流。它只删除完全包含于 main 的非默认、非保护分支；未合并或期间更新的分支保留并报告。分支清理不删除标签、Release、npm 版本或项目资料，也不作为发布成功的必要条件。
