# 上游独立中文技能

`upstream-skills/` 保存可以直接安装、各自独立的中文技能。dev、ops、system 等已整合体系继续位于 `skills/`。独立技能按用途选择，不需要为了收纳它们创建一个业务 domain。

## 当前可安装内容

| 安装名 | 原技能名 | 用途 |
| --- | --- | --- |
| [zh-archify](../upstream-skills/zh-archify/SKILL.md) | `archify` | 架构、流程、时序、状态、ERD 等交互图及单页解释 |
| [zh-modern-web-guidance](../upstream-skills/zh-modern-web-guidance/SKILL.md) | `modern-web-guidance` | HTML、CSS、客户端 JavaScript 的现代 Web 实践和指南检索 |
| [zh-chrome-extensions](../upstream-skills/zh-chrome-extensions/SKILL.md) | `chrome-extensions` | Chrome 扩展、Manifest V3、权限、存储、消息及发布检查 |

一份来源仓库可以提供多个技能。HTML、CSS 和 JavaScript 是知识主题，不各建安装包，也不根据语言统计划分 domain。准确来源、版权和改造范围见[第三方声明](../THIRD_PARTY_NOTICES.md)，当前来源版本由[材料父清单](../materials/manifest.tsv)维护。

## 安装和 TUI

在目标项目根目录运行：

```sh
npx @namewta/skills-hub@latest
npx @namewta/skills-hub@latest install --domain upstream-skills --dry-run
npx @namewta/skills-hub@latest install --domain upstream-skills
npx @namewta/skills-hub@latest install --skill zh-archify
npx @namewta/skills-hub@latest install --skill dev-architecture zh-archify zh-modern-web-guidance
```

第一条打开 TUI。选择 `upstream-skills` 可勾选整组，也可以按 `archify`、`zh-archify`、`上游` 或用途搜索，与领域技能混选。Tab 勾选，方向键移动和翻页，Enter 确认；搜索和翻页保留已选项。完整交互、备份及失败恢复见[安装契约](installation.md)。

| 源码目录 | 安装目录 |
| --- | --- |
| `skills/dev/dev-architecture/` | `.agents/skills/dev-architecture/` |
| `upstream-skills/zh-archify/` | `.agents/skills/zh-archify/` |
| `upstream-skills/zh-modern-web-guidance/` | `.agents/skills/zh-modern-web-guidance/` |
| `upstream-skills/zh-chrome-extensions/` | `.agents/skills/zh-chrome-extensions/` |

`--domain upstream-skills` 只复用分组参数，不声明共同工作流，不创建 `.agents/upstream-skills/`，也不改变包自己的产物位置。原名与 `zh-` 入口可以并存，由使用者选择；安装器不会自动删除原版。

宿主是否自动发现 `.agents/skills/` 取决于实际支持。提供显式技能调用的宿主可调用 `$zh-archify`，其他宿主直接读取相应 `SKILL.md`。安装文件不等于运行环境已经具备。

## 三份内容各自做什么

| 位置 | 职责 | 是否安装 |
| --- | --- | --- |
| `materials/<来源>/upstream/` | 固定提交的完整选定子树，保留原名、字节与执行位 | 否 |
| `materials/<来源>/zh/` | 同路径适用中文底稿；原本中文时直接使用原件 | 否 |
| `upstream-skills/zh-<原名>/` | 实际中文运行包及必要适配 | 是 |

安装器直接扫描两个运行根，没有额外构建目录或技能注册表。独立包的目录和 frontmatter `name` 使用 `zh-` 前缀，安装名在全仓唯一。材料中的 name 保留原值，只有运行身份做相应调整。

每个来源的选定根完整保留，不把来源仓库的 `.git`、缓存或未选定开发文件夹带进包。逐文件关系沿父清单进入项目子清单，字段和内容规则见[资源组织](resources.md)。

## 可以怎样改

完整翻译说明，调整触发描述、安装名、自身调用及确有需要的宿主行为。优先保留原步骤、判断、表格、示例和失败条件，必要差异记入清单 `adaptation`，统一说明放在根第三方声明。

安装名改变不会改变真正执行的 npm 包名 `modern-web-guidance`、文件名 `archify.mjs`、JSON 字段、指南 ID 或协议值。可执行示例、程序和机器字符串保留语义；自然语言文档与模板按实际类别翻译，原字节对照不冒称译文。中文标题保留必要的原英文锚点。

独立包保留必要 metadata、外部服务、工具及上游原生法律文本，不套用自有技能的去来源规则、入口预算或脚本语言迁移要求。安装器只复制文件，保留脚本不意味着安装时执行它。

## 运行前提与中文边界

**Archify。** 本地 Node 工具、渲染资源、模板、示例、字体和校验工具随包安装。完整 finalize 包含真实浏览器检查，需要可启动的 Chrome/Chromium；只生成 HTML 不能视为全部检查完成。中文更新使用 skills-hub 安装命令，避免原版更新覆盖中文适配。图表的 viewer locale 与说明语言分别设置。

**Modern Web Guidance。** 入口和随包静态指南为中文，搜索、检索及版本检查继续使用 `npx -y modern-web-guidance@latest ...`。首次取得 CLI 通常需要网络，最新响应可能是英文。先遵循原有 search/retrieve 与策略检查，再按相同指南 ID 使用本地中文资料；有冲突时以本次 CLI 结果为准，并用中文解释。本地译文不替代最新检索或浏览器支持策略。

**Chrome Extensions。** 入口与参考资料为中文，Chrome API、Manifest 字段和可执行代码保持真实语义。实际制作和测试扩展仍需要对应浏览器与环境，安装技能不自动配置它们。

各包原生法律文本随完整资源保留。根项目许可不替代第三方许可，具体范围见[统一第三方声明](../THIRD_PARTY_NOTICES.md)。

## 后续新增和更新

新增独立技能时，固定来源提交和准确的完整目录，保存原件及适用中文对照，把运行版放入 `upstream-skills/zh-*`，登记父子清单的逐文件映射与适配。合法入口存在后 CLI/TUI 自动发现，无需修改另一份技能列表。

更新使用[显式材料同步](../materials/README.md#显式同步预览准备应用)选择目标来源。工具报告受影响的 `runtime_paths`，不会覆盖中文运行包。随后比较旧原件、新原件和当前适配，合并变化、复核完整内容及实际工具，完成后才更新 `runtime_reviewed_blob`。

```sh
npm run check:full
npm run check:package
npm run check:upstream
```

最后一项需要浏览器；检查范围见[验证指南](validation.md)。如果独立技能后来形成长期协作体系，再按实际方法所有权和交接关系决定是否整合为 domain，不能只因主题相近就合并。
