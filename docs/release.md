# npm 与 GitHub Release

## 分发内容

包名为 `skills-wta`，首个版本为 `0.0.1`。需要 Node.js 22.14+，安装器和运行工具使用 JavaScript，不需要 Python 或 TypeScript 编译器。

在目标项目根目录运行：

```sh
npx skills-wta@0.0.1 list
npx skills-wta@0.0.1 install --domain dev
npx skills-wta@0.0.1 install --skill dev-spec system-proxy
npx skills-wta@0.0.1 install --domain dev --replace
```

`npx` 负责取得 npm 包，安装器按明确选择把完整技能复制到当前项目的 `.agents/skills/`，并附带许可。包没有安装后自动执行的 lifecycle hook。源码方式仍可使用 `node /path/to/skills-wta/install.mjs`，参数一致。

`package.json` 的文件白名单只分发安装器、技能、许可、README 与法律说明。`materials/`、开发测试、维护工具和凭据不进入 npm 包；源码仓库继续保留完整来源对照。发布附件是实际提交到 npm 的同一个 `.tgz`，同时提供 `SHA256SUMS`。

## 自动发布入口

[发布工作流](../.github/workflows/release.yml) 支持以下入口：

| 入口 | 行为 |
| --- | --- |
| 向 `main` 推送 `package.json` / `package-lock.json` 的版本变化 | 自动验证新版本，再发布 npm、创建版本标签及 GitHub Release |
| 推送 `v*` 标签 | 标签必须等于包版本，并指向 main 历史中实际验证的提交 |
| 在 GitHub 发布 Release | 使用该 Release 的标签检出；版本一致并通过检查后发布 npm、补齐附件 |
| 在 Actions 手动运行 Release 工作流 | 选择 main 或对应版本标签，填写同一版本号；用于明确发布或重试 |

第一次新增 `0.0.1` 的包配置并推送到 main 时，属于第一次版本变化。普通技能提交不会因为改了内容就自动复用旧版本发布；先递增版本。

## 发布下一版

在源码仓库完成修改与检查后：

```sh
npm run check:full
npm run check:statechart
npm run check:package
npm version 0.0.2 --no-git-tag-version
```

在 `CHANGELOG.md` 增加 `## 0.0.2 — YYYY-MM-DD` 及本版说明，提交代码、两个版本文件和更新记录，再推送 main。工作流完成检查后创建 `v0.0.2`，不要求另外手动打标签。也可以使用标签或 Release 入口，但其版本必须与代码一致。

稳定版发布到 npm `latest`；含预发布标识的版本，例如 `0.0.2-beta.1`，发布到 `next`，GitHub Release 标记为 prerelease。版本号不能重复用于不同内容。同仓库的发布任务串行执行；尚未发布且低于 npm 或 GitHub 现有 `latest` 的稳定版会明确失败，需递增版本。已经发布且完整性相同的旧版可以继续补齐 Release，但不会把 `latest` 指回旧版。

## 检查与凭据

工作流先固定提交及版本，将准备阶段的同一个 SHA 显式传给[跨平台验证](../.github/workflows/validate.yml)和发布任务，不在验证时重新解析标签。Linux 检查最低 Node.js 22.14.0，Windows 与 macOS 检查 Node.js 24；执行全部维护测试、状态图捕获轨迹回放，以及实际 npm 包的离线安装。发布任务依赖这些任务全部成功。

仓库 Secret `NPM_TOKEN` 在发布步骤映射为 `NODE_AUTH_TOKEN`；不写入源码、包、技能、版本说明或日志。该 token 需要具有目标包的发布权限，不能是只读或仅允许暂存版本的 token。GitHub 自动提供的 `GITHUB_TOKEN` 只在发布任务拥有写 Release / 标签权限；普通验证任务保持只读。

发布任务使用 `--provenance` 并申请 `id-token: write`。如果以后为此包配置 npm trusted publisher，填写仓库 `NAMEWTA/skills-wta` 与工作流文件名 `release.yml`；当前工作流也具备 npm 使用 OIDC 的条件。npm 的当前政策正在调整 token 直接发布能力，长期使用可按[官方可信发布说明](https://docs.npmjs.com/trusted-publishers/)完成包侧绑定，不将修改账户权限混入普通技能安装。

GitHub 自动创建的 Release 不依赖再次触发另一条工作流：npm 发布、标签、附件与 Release 完成都在同一发布任务中执行。

## 重试与部分完成

发布脚本先检查已有标签，禁止移动到其他提交。npm 版本已经存在时，实际 tarball 的 SHA-512 必须与 registry 一致，才能跳过 npm 发布并继续补齐 Release；内容不同会失败并要求递增版本。已有 Release 附件同样核对内容，不静默覆盖。

npm 发布后会读回 registry 的版本与完整性；随后准备 GitHub Release 草稿、上传压缩包与校验和，最后发布草稿。重跑时会分页查找同标签的既有草稿并继续；匹配到多个草稿时明确停止。只有草稿中上传失败遗留的 `state=starter`、大小为零的同名占位附件会被清理重传，正常附件仍核对内容且不覆盖。缺少服务端摘要的附件通过带授权的 GitHub asset API 下载核对，因此草稿也可恢复。

某个外部步骤失败时，按实际结果报告，不把 npm 和 GitHub 视为同一事务。可重跑原失败任务，或在 Actions 选择原版本标签并填写相同版本号继续。主分支已前进时，不要把新的 main 提交当作原提交重试。

如果需要修改已发布包的内容，应发布新版本。即使修改只涉及发布脚本，新提交也不能替代已有版本标签指向的提交。标签已经存在时须保持原 SHA；若修复后的流程无法在原提交上完成，应明确处理剩余发布步骤，不能移动标签或覆盖 npm 版本。标签尚未创建时，只有实际 tarball 完整性相同且新提交通过全部检查，才能继续原版本的收尾。

## 官方依据

- [GitHub：发布 Node.js 包](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages)：Release 触发、`setup-node` registry 配置、`NODE_AUTH_TOKEN` 与 provenance。
- [GitHub：Release API](https://docs.github.com/en/rest/releases/releases)：按标签查询已发布 Release，以及通过列表查询有权限读取的草稿。
- [GitHub：Release 附件 API](https://docs.github.com/en/rest/releases/assets)：授权下载附件，以及上传失败后 `starter` 空占位的处理。
- [npm：访问令牌](https://docs.npmjs.com/about-access-tokens/)：granular token 的发布权限、2FA 与 stage-only 区别。
- [npm：可信发布](https://docs.npmjs.com/trusted-publishers/)：OIDC、Node/npm 版本前提、仓库与工作流绑定。

本页描述发布机制，某次实际发布的成功状态以该提交的 Actions、npm 版本和 GitHub Release 为准。
