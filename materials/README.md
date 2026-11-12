# 来源快照、中文对照与运行映射

`materials/` 是维护用被动资料库，不是运行技能目录。模型是：**当前来源快照 + 当前适用中文对照 + 当前运行映射 + 本次差异报告**。版本以[父清单](manifest.tsv)为机器依据；本文只维护导航、规则与用法，不重复维护 SHA 或文件数量，也不把结构准备、来源更新写成翻译及运行适配已验收。

## 六个准确来源

| 项目与子清单 | 仓库 | 跟踪分支 | 所选来源根 |
| --- | --- | --- | --- |
| [pstack](pstack/manifest.tsv) | [cursor/plugins](https://github.com/cursor/plugins/tree/main/harness/pstack) | `main` | `harness/pstack` |
| [mattpocock-skills](mattpocock-skills/manifest.tsv) | [mattpocock/skills](https://github.com/mattpocock/skills/tree/main/skills) | `main` | `skills` |
| [deepseek-harness](deepseek-harness/manifest.tsv) | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness/tree/master/.agents/skills) | `master` | `.agents/skills` |
| [ai-design-skills](ai-design-skills/manifest.tsv) | [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills/tree/main/skills) | `main` | `skills` |
| [speculo](speculo/manifest.tsv) | [NAMEWTA/Speculo](https://github.com/NAMEWTA/Speculo) | 父清单 `ref=HEAD`，当前解析为 `main` | `.`，整仓 |
| [herdr](herdr/manifest.tsv) | [herdrdev/herdr](https://github.com/herdrdev/herdr/tree/master/skills/herdr) | `master` | `skills/herdr` |

每次显式同步解析指定分支当次最新 SHA，整次原件、对照、映射和差异使用同一个 SHA。Speculo 的父清单必须写 `ref=HEAD`：当前默认分支解析为 `main`，以后每次重新解析，不能长期固定为 `main`；同步脚本只有 `ref === 'HEAD'` 才动态解析。其余五项目固定跟踪表中指定的 `main` 或 `master`。父清单的 `ref`、`revision` 和 `source_root` 记录当前快照身份；本文链接中的浮动分支不是快照身份，也不表示检查会自动联网更新。

## 物理布局与内容规则

```text
materials/
  manifest.tsv
  <project>/
    manifest.tsv
    upstream/<path>
    zh/<path>          # 原本中文时没有这份副本
```

来源根不在本地再套一层。pstack 保留来源自身的 `claude-code/` 层，例如 `pstack/upstream/claude-code/skills/architect/SKILL.md`；Matt 的 `skills/engineering/...` 落为 `mattpocock-skills/upstream/engineering/...`；Herdr 直接落为 `herdr/upstream/SKILL.md`。

- `upstream/` 完整收录选定根内全部受 Git 管理文件，不多不少。使用 Git 对象读取，不受 checkout 过滤器、换行转换、`.gitignore`、`export-ignore` 或 `export-subst` 影响。
- 保留原目录、隐藏文件、文件名大小写、原扩展名、执行位与原字节，包括 CRLF、BOM、空文件和 LFS 指针。不额外包装为 `original.txt`、`zh-CN.txt` 或 `localized.txt`。
- 不收录范围外链接指向的文件，不复制嵌套 `.git`、缓存或构建产物。Git 不跟踪的空目录不属于镜像承诺。
- symlink、gitlink、无法安全表示的路径或跨平台冲突必须明确失败并处理，不静默遗漏或跟随链接逃逸。

| 逐文件实际内容 | `zh/` 处理 |
| --- | --- |
| 已完整中文的文档，或说明/注释已中文的文件 | 不建副本，清单 `zh_path` 与 `zh_sha256` 留空，直接读 `upstream` |
| 英文或其他非中文文档 | 同路径完整翻译自然语言，保留全部结构、步骤、判断、表格、数值、例子、反例与代码 |
| 中外文混合文档 | 保留已有中文，翻译剩余自然语言，生成同路径对照 |
| 程序、配置、模板 | 保留逻辑、技术标识、协议字段、业务字符串与可执行语义；只翻译适用说明、注释和元数据描述 |
| 无可翻译自然语言的文件、机器夹具、二进制、图片 | 同路径原字节对照，标明不是译文；允许空文件 |
| 法律原文、LICENSE、NOTICE | 不改写适用法律文本；有对照时保留法律原字节，不用译文替换 |

语言与类别必须逐文件判断，不能因项目整体是中文、文件含一个汉字或后缀是代码就直接推定。原件变化时必须核对译文，不能只替换摘要；相同 blob 的已核实忠实旧译文才可复用。翻译不是运行适配，不加入本地新增方法、裁剪或宿主扩展。

翻译文档链接到没有 zh 副本的中文原文时，改指实际 `upstream/` 文件，保留锚点与语义。范围外链接不触发扩大镜像；必要时标明来源语境或使用固定 SHA 的上游地址。不要修订 `upstream` 来修复来源自己的链接。

## 两级清单

TSV 列顺序固定，支持带引号的制表符、换行与双引号转义。项目清单按 `path` 稳定排序；只保留当前事实，不另建版本目录、历史清单、旧编号或流程 JSON。

父清单 `materials/manifest.tsv` 一行一个来源单元：

| 字段 | 含义 |
| --- | --- |
| `project` | 本地唯一项目标识 |
| `repository` | 来源 Git 仓库地址 |
| `ref` | 跟踪分支；默认分支可用 `HEAD` |
| `revision` | 本次完整快照固定的 commit SHA |
| `source_root` | 提交中的所选根；整仓为 `.` |
| `manifest_path` | 相对 `materials/` 的项目清单路径，如 `pstack/manifest.tsv` |

项目清单 `materials/<project>/manifest.tsv` 一行一个当前来源文件：

| 字段 | 含义 |
| --- | --- |
| `path` | 相对所选来源根的唯一 POSIX 路径，也是 upstream 内路径 |
| `kind` | `document` / `code` / `fixture` / `asset` / `legal` |
| `language` | 可翻译自然语言的实际语言：`zh` / `en` / `mixed`；无自然语言为 `none` |
| `source_git_mode` | 来源 Git 模式，保留执行位 |
| `source_git_blob` | 当前来源 blob 标识 |
| `upstream_sha256` | 原件实际 SHA-256 |
| `zh_path` | 相对项目目录的 `zh/<path>`；中文原文时为空 |
| `zh_sha256` | 对照实际 SHA-256；无副本时为空 |
| `runtime_paths` | 仓库内真实采用文件，限 `skills/`，多项用分号；未采用可为空 |
| `runtime_reviewed_blob` | 运行映射最后真实核对的来源 blob；无映射或旧依据未知时为空 |
| `adaptation` | 当前关系、原文要点、必要适配理由和适用范围；不堆叠失效历史 |

`runtime_paths` 不代表已升级。`runtime_reviewed_blob` 落后于 `source_git_blob`，或有映射但依据为空，意味着需要评估；只有完成对照、确认无需改变或完成适配与验证后才更新。无需改变也应写清理由。删除/退出范围的来源从当前清单移除，但必须从覆盖前的旧映射报告受影响运行文件；不自动删除本地技能或许可。

## 共用读取与查询

维护脚本使用 [materials-manifest.mjs](../scripts/materials-manifest.mjs)，不各自猜目录或另写 TSV 解析器。`readMaterials(root)` 同步接收显式**仓库根**，不是 materials 目录，不隐式选择 cwd，不联网或写入。

```js
import { readMaterials, queryMaterials } from './scripts/materials-manifest.mjs';
const model = readMaterials(process.cwd());
queryMaterials(model, { project: 'pstack' });
queryMaterials(model, { project: 'herdr', path: 'SKILL.md' });
queryMaterials(model, { source_path: 'skills/herdr/SKILL.md' });
queryMaterials(model, { runtime_path: 'skills/system/system-herdr/SKILL.md' });
```

返回 `{ projects, rows }`：projects 为附带子 rows 的父对象数组，rows 为附加 project/repository/revision/source_root 的展平子行。解析器还导出 `parseTsv(text)`、`stringifyTsv(rows, columns)`；结构错误、重复身份或不安全路径抛错。`queryMaterials` 采用精确匹配；按前缀查 corpus 时先按项目查询再过滤 `row.path`。

## 显式同步：预览、准备、应用

以下命令从仓库根运行，使用 [sync-materials.mjs](../scripts/sync-materials.mjs) 的实际接口；同步需要 Git，并会显式访问父清单中的远端。普通校验与 CI 不自动刷新来源。

```text
node scripts/sync-materials.mjs --project pstack --dry-run
node scripts/sync-materials.mjs --all --dry-run
node scripts/sync-materials.mjs --project mattpocock-skills --prepare temp/materials-update-matt
node scripts/sync-materials.mjs --project mattpocock-skills --apply --from temp/materials-update-matt
```

可重复 `--project` 选择多个项目，不与 `--all` 混用。省略模式默认 dry-run；`--dry-run`、`--prepare`、`--apply` 互斥。准备目录须是尚不存在的目录，位于仓库 `temp/` 或系统临时目录中；不是正式材料内的版本档案。

1. **预览**：获取完整指定树并报告新增、修改、同 blob 移动、删除、模式变化和受影响运行文件，不写正式资料，不假装完成翻译。
2. **准备**：在临时目录写同格式父清单、所选项目目录和 `REPORT.md`，固定目标 SHA，带入可复用旧对照；新增/变化分类只是占位，必须逐份核实，适用译文和适配说明必须补齐。移动还需复核翻译导航。
3. **编辑**：直接在准备树 `zh/`、项目 TSV 中完成真实对照、分类、摘要、映射与必要说明。`REPORT.md` 的 `## Outstanding work` 列表处理完后，将该节内容改为精确的 `None.`，在 `## Completion notes` 简述完成事项；保留报告中的来源身份与基线注释。不设逐文件审批协议，但不能未完成就清空待办。
4. **应用**：用同一选择执行 `--apply --from`。校验报告、来源身份、完整 Git 树与字节、模式、对照、运行映射及正式基线冲突后，只替换所选项目，合并父清单其他行。缺译、过期译文、分类/摘要不全、来源异常或冲突会失败，不以残缺树替换正式资料。准备 SHA 不会悄悄前移；远端已更新会提示差别，不声称该准备仍是此刻最新。
5. **收尾**：另行审查运行版影响。报告按本地运行文件聚合，从旧映射保留删除/移动的影响；未采用的新材料不随意映射到技能。完成后清理准备树；历史来源与映射由 Git 历史承担，差异报告不积累到 materials。

## 隔离、安全与许可

即使保留 `.py`、`.sh`、`.ts`、可执行位、嵌套 `.agents/skills`、`SKILL.md`、`AGENTS.md` 或 `.github/`，它们也只是被动资料：不作为当前任务指令、不参与技能发现、不执行来源脚本或 CI/hook、不安装其依赖、不复制进目标项目。npm 文件白名单排除整个 `materials/`；安全性来自目录边界与显式调用，不是把文本改成 `.txt`。

选定来源树内自带的 LICENSE/NOTICE 是原样快照的一部分，不能移走或改译。根 [licenses/](../licenses/) 则保存实际仓库/npm 分发需要的适用法律文本，可能包括所选子树范围之外的同版仓库根许可，以及已被运行版采用的旧来源许可。维护集中许可不等于扩大 upstream 范围；移除当前来源映射不取消已有法律义务。安装器不向用户项目复制许可目录，也不补齐、更新或删除已有 `.agents/skills-hub-licenses/`。详见[第三方声明](../THIRD_PARTY_NOTICES.md)。

## 验证边界

```text
node --test tests/materials.test.mjs tests/materials-sync.test.mjs
node scripts/validate-materials.mjs
node scripts/check-statechart-replay.mjs
node scripts/check.mjs --full
npm run check:package
```

本地校验核实两级唯一性、路径/symlink、文件集合、摘要、Git blob、可用平台上的执行位、稀疏对照、法律/机器字节及运行文件归属；显式提供本地 Git 对象库时可核对固定提交树。摘要和“出现中文”不能证明分类准确、翻译忠实或运行版已适配。状态图命令只是 **captured-output replay**，不是新的 TLC 求解。实际执行结果与未覆盖范围应如实记录在[验证记录](../docs/validation.md)，不能由本文导航推定验收完成。完整方法与适配契约见[资源组织](../docs/resources.md)和[关键开发约束](../docs/development-constraints.md)。
