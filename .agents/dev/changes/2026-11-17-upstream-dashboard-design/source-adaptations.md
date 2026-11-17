# 上游原件、中文翻译与运行适配

## 来源与材料结构

固定 `abdiraimov-otabek/dashboard-design-skill@463b8fdf62c640180ec1ba731f3616c2319bf68c` 的 `skills/dashboard-design/`，只收录 11 个 Markdown 文件。原件通过 Git 文件 blob 身份与目标树对照，保持全部名称、路径及字节一致。`materials/dashboard-design-skill/upstream/` 保存原始文件；`zh/` 按相同相对路径保存完整中文对照；`upstream-skills/zh-dashboard-design/` 是唯一会被安装的运行版。

项目父清单登记来源仓库、分支、提交与所选根；子清单为每份文件登记 Git mode/blob、原件及译文 SHA-256、中文路径、运行路径、采用依据和适配理由。代码段仍保留在 Markdown 内，没有重写为新的技术栈。没有在技能目录额外创建 `UPSTREAM.md`。

## 翻译边界与必要差异

- `SKILL.md` 的原文和中文底稿保持 `name: dashboard-design`；只有运行版改为 `name: zh-dashboard-design`，并在原作者的任务完成署名中采用当前运行名，作者 Otabek、Halo/Shedi 链接和用户取消署名的权利不变。
- 其余十个参考文件在中文底稿和运行包中完全相同；保留二十类组件模式、感知规则与表格、两份案例、来源列表、QA 流程及数值阈值。
- `references/snippets.md` 的 12 段 TS/TSX 代码、`references/swiftui.md` 的 7 段 Swift 和 1 段 Bash、`references/tokens.md` 的 CSS 围栏均逐字节保留。中文化限定在自然语言正文、标题及说明，代码中的标识、字符串和注释未冒称译文。
- 上游根 `LICENSE` 是 Otabek Abdiraimov 2026 年 MIT，原字节集中保存为 `licenses/dashboard-design-skill-MIT.txt`；第三方声明标明来源、权利人和中文修改范围。
- 未收录仓库根 `examples/` 三个 HTML、`docs/` 图片或营销材料、Claude 插件市场配置。独立技能未被强制归入开发工作流，应用原有设计系统和用户喜好的优先级保持不变。

## 验证区分

材料结构、哈希、链接与代码围栏检查，不等于对真实业务仪表盘执行了浏览器或 SwiftUI 模拟器截图 QA；原技能的实际运行前提仍应由使用者具备。已运行的检查与 GitHub Actions 状态见 `verification.md`（验证后填写）。
