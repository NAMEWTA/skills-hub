---
name: dsh-official-plugin-artwork
description: 绘制和审查官方 DeepSeek Harness 插件图标及可选功能预览，包括实验性插件。用于包图像及 PluginArtwork 图形；覆盖官方参考与色板、功能预览、包元数据门禁及设计师审查，并链接 dsh-doc 技能分发的共享绘图规则。不用于工具栏或操作图标。
---

# 官方插件图像

先阅读并遵循[插件图像](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/preset/agent-preset/skills/dsh-doc/references/artwork.md)；安装后的 DSH 在 `dsh-doc` 技能中分发它，由它负责主题、绘制和导出规则。其 Review 一节描述通过插件管理器安装的 Creator 功能包；官方插件遵循其中的比较步骤，其余步骤改用下方[审查与验证](#审查与验证)。官方插件和官方实验性插件共享同一视觉语言；实验状态由 UI 标签表达。这些指导不能替代设计师批准。

审查所在页面时，使用 [UI 审查基线](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/ui-design-review-cases.md#review-baseline)，结合图像与其图块、标签、相邻卡片及主题材质检查平衡。包图像与操作图标保持区别：光学重量协调，不等于这些角色必须有相同绘制边界、单色填充或一致几何形状。

## 可选功能预览

为官方功能包的详情文档顶部绘制较大图片之前，阅读并遵循[添加插件功能预览](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/cookbook/adding-a-plugin-preview.md)。可选性、图片数量、设计画布、位置、语言变体、文件位置和验收由它负责。该指南也负责 SVG 预览中嵌入光栅图的例外；小图标仍只能包含几何图形。插件图像中的图标尺寸不适用于预览。检查真实功能，并保留它生成的素材。

## 官方参考与负责者

- 复用设计师提供的素材。未经批准，不自创品牌标记，也不修改产品名、标识符或无关图标。
- 阅读[现有图像](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/client/ui-primitives/src/plugin-artwork.tsx)及最近的相关包 SVG。优先使用已有色板，例如[自动授权审查](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/experimental/auto-review/icon.svg)和 [Codex 子 agent](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/subagent/subagent-codex/icon.svg)。鲜艳颜色需要设计师明确许可；品牌要求需要批准。使用这些参考，而非发现已安装插件。操作图标仍归 [UI 设计入口](../dsh-client-ui-ux/SKILL.md#选择规则负责者)负责。
- [页面渲染器](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/client/ui-plugin-manager/src/client/PluginManagerPage.tsx)负责显示尺寸和外部图块框架。SVG 图像可以用颜色字面值；页面 CSS 使用语义主题设计变量。
- 检查每个受影响的入口、列表、详情及组件行。功能包图像与组件元数据各有负责者；有意保留的副本应一起更新，范围包含本地化显示名称和描述时，也要验证它们。
- 内联 React 图像需要每个实例独立的 ID；独立图片文档之间不共享 ID。
- 素材变更保持局部。不要仅为显示它而增加运行依赖、基础组件导出或渲染器特例。

## 审查与验证

1. 对不确定的几何形状细化前，展示几个编号方案，并在设计师审查中保留编号。应用选中方案；已有文件或生成的草稿不代表获批。比较产物放进被 Git 忽略的目录，不放进产品包。
2. 对[包元数据及 SVG 图像](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/scripts/verify-package-meta.ts)运行 `pnpm run verify-package-meta`，对规范包载荷运行 `pnpm run constraints`，并运行 `pnpm run verify-official-bundle-catalog`。目录过期时用 `pnpm run gen-official-bundle-catalog` 重新生成，绝不手改。结构检查不能替代视觉审查。
3. 构建受影响产物，通过 `dsh web` 检查真实页面。先批量完成已获批的细化，再重启缓存元数据的 Host，然后在两种主题下验证入口及嵌套组件行。
4. GUI PR 遵循仓库的 UI 测试政策及 [record-browser-gif](../record-browser-gif/SKILL.md)。新图形落地前获得设计师批准。把可复用绘图原则记入[插件图像](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/preset/agent-preset/skills/dsh-doc/references/artwork.md)，而非记录落选草稿的历史。
