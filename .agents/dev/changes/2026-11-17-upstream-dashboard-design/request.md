# 引入 Dashboard Design 独立中文技能

## 已确认请求

将 [abdiraimov-otabek/dashboard-design-skill](https://github.com/abdiraimov-otabek/dashboard-design-skill) 的 `skills/dashboard-design/` 完整对应翻译到本仓库 `upstream-skills/`，按已有上游中文技能的三层结构和逐文件来源清单实施。用户确认先完成全部内容、验证并提交 PR，**本次不递增版本，也不发布 npm**。

## 固定来源与范围

- 来源提交：`463b8fdf62c640180ec1ba731f3616c2319bf68c`（插件元数据版本 2.1.0）。
- 选定根：`skills/dashboard-design/`，Git 树共 11 个 Markdown 文件（`SKILL.md` + `references/` 10 个文件），均为 100644。
- 目标运行身份：`zh-dashboard-design`；安装位置：使用者项目的 `.agents/skills/zh-dashboard-design/`。
- 该子树不依赖仓库根部的 `examples/`、`docs/images/` 或 `.claude-plugin/`。范围外资产不复制，仓库根许可证单独保留。
- 完整翻译自然语言，保留代码围栏、数值、例子、方法与作者署名，运行版仅做必要的技能身份适配。
- 不合并或改写既有 `dev-ui-design`、`dev-prototype`，不改安装器或创造新的 domain。

## 验收

原件和 Git blob 一致，11/11 原件、中文底稿、运行版文件齐全；逐文件摘要及采用依据完整；CLI 和 npm 打包能完整安装这一独立技能；代码段与原件一致；相关跨平台测试通过；最终 PR 指向 main。
