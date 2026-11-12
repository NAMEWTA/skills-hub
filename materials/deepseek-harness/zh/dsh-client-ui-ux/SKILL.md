---
name: dsh-client-ui-ux
description: 设计及审查 DSH 用户可见 UI：对齐、间距、图标、视觉基础、几何及交互。修改 client、experimental 或 app 包 UI 前使用；交付前验证受影响渲染结果。
---

# DeepSeek Harness UI 开发

本技能是 UI 设计及审查入口，负责流程、视觉基础、几何及交互指导；对齐、间距及图标细节在下列参考。只加载相关参考；示例解释判断，不代表覆盖。

<a id="required-review-loop"></a>
## UI 变更流程

UI 变化应用适用设计规则，包括可见加载、错误、禁用、展开及焦点状态。按影响及回归风险选择投入；普通开发不需完整设计审计。

| 变化 | 必需检查 | 额外记录 |
|---|---|---|
| 局部文案、图标复用、颜色或间距 | 检查实际页面、受影响邻项及相关状态；跑适用测试。应用下列最低检查。 | 简报结果及实质缺口。默认不需独立计划、轴线图、场景清单、源快照或截图报告。 |
| 页面布局、共享组件或全局样式 | 识别受影响关系及消费者；在组装页面中检查不同的受影响布局、内容及状态变体。只在等价有依据时复用证据。 | 简述范围。被要求或需解释广泛变化、评估回归风险时，保留起始版本及可比图像。 |
| 明确全面审查 | 覆盖约定区域及相关状态；区分已查结果、缺陷及未查范围。 | 用[审查指南](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/cookbook/reviewing-ui-design.md)记录覆盖、发现及支持证据。仅要求比较不意味着全产品审计。 |

### 受影响 UI 最低检查

即使小变更也适用；可选文档不让检查可选。打开实际页面，将变化元素与直接受影响邻项一起检查，不只判断 CSS 或孤立组件。

- **颜色或不透明度：** 检查明暗主题，包括受影响前景／背景及状态组合。
- **布局、间距、字体或尺寸：** 检查受限容器、长或换行内容；检查变化断点两侧、对齐、裁切及动作可达。
- **交互：** 实际操作变化路径，以及受影响焦点、禁用、加载、错误、展开及重叠状态。只查会受影响状态，不查全部组合。
- **共享组件或全局样式：** 追踪受影响消费者，检查不同组装布局及状态；一个孤立示例不能证明覆盖。

必需场景不可用时，说明未查什么、为何及如何验证；标明生产组件夹具可提供部分证据，不算实际页通过。必需检查缺失时不声称验证完成。运行原有适用测试；仅源码检查及测试通过不能确立渲染结果。

未变负责资料读一次；判断不确定时查示例。检查相关状态及实际使用尺寸，不固定截图数，也不做每宽度 × 主题 × 状态组合。批量处理相关编辑，复用当前应用实例及有效证据。纯文档及有渲染不变证据的重构不需新 UI 捕获；说明依据。

需要前后比较时，保留实际起始实现，包括未提交工作，采用可比捕获条件。绝不重建缺失前图并冒称原件。不论是否需额外证据，都保护已有工作。

交付、评审或推送前，只查新增累积交互、缺失必需检查及失效证据；不在每阶段重复已完成验证。准确报告结果及实质缺口。必需场景或检查缺失时，不声称完整覆盖或视觉验收。

这些投入层级只改变额外设计审查程序。已有[客户端测试要求](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/client/AGENTS.md)、[GUI PR GIF 要求](../record-browser-gif/SKILL.md#每个-gui-pr-都含-gif)及[设计师／产品批准](#设计审查升级)仍适用，包括原触发条件满足时的局部变化。

## 选择规则负责者

布局变化读对齐及间距参考。选、画或审查作品，或新增、修改、审查图标按钮、纯图标动作或信息图标时读图标参考，包括不改作品的复用。其他任务用下列相关章节，不默认全加载。已有响应式及官方图像技能保留范围；数值尺度由实现负责者管理。

| 实现前需要的决定 | 章节或参考 |
|---|---|
| 共享轴、文字起点、居中、树缩进、完整图标框 | [对齐](references/alignment.md) |
| 语义组、内外间隙、重复节奏、章节分离 | [间距及分组](references/spacing.md) |
| 界面图标选择与作品；图标按钮与纯图标动作、提示、信息悬停内容、无障碍标签及焦点 | [图标](references/icons.md) |
| 颜色、字体及既有处理 | [视觉基础](#视觉基础)；[Web 样式](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/web-styling.md)负责 token／材质 |
| 组件几何、嵌套轮廓及状态填充 | [几何决定](#组件几何)；[圆角标准](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/ui-radius.md)负责值及例外 |
| 反馈寿命、加载、叠加、滚动及平台净空 | [交互及反馈](#交互及反馈)；[错误处理](../dsh-error-handling/SKILL.md)负责失败保证 |
| 响应布局、移动专用交互、文字按钮等组件截断／省略规则 | [响应式 UI](../dsh-responsive-ui/SKILL.md) |
| 官方插件图像及功能预览 | [官方图像](../dsh-official-plugin-artwork/SKILL.md) |
| 文案、语言归属及组件语义 | [文字标准](../dsh-prose-standard/SKILL.md)、[语言归属](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/implemented/architecture/2026-08-23-locale-owned-client-ui-copy.md)、[基础组件目录](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/client/ui-primitives/README.md#component-catalog) |
| 密度、信息层级、组合控件状态及组件选择 | [原则参考](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/ui-design-review-cases.md#density)第 3–6 节 |

## 先复用再新增

能力匹配时扩展已有组件、容器及交互。右侧栏内容通过现有侧栏槽注册，不新建独立侧栏。遵循[图标复用](references/icons.md#优先复用已有图标)。重组前读[客户端指令](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/client/AGENTS.md)及[客户端防御模式](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/defensive-patterns/client-components.md)，了解组件／状态归属及分层。

## 视觉基础

- 新加字面值前，先复用目标页或最近既定同级的 token、值及完整处理；Plugins 通常是整页参考。
- 验证明暗主题颜色；前景／背景组合可读，尤其弱化文字。
- 新增或修改功能 CSS 的**字重 ≤500**；用尺寸或颜色强调。ui-theme Markdown 字体 token 例外。
- 先用主题字体角色，再页面尺度，再可比页面的尺寸／间距比。不为单元素发明尺寸。同类共享尺寸，尺度保持少量（13px 是既定行／细节尺寸）。
- 图标／文字关系应用[对齐](references/alignment.md)及[同前景规则](references/icons.md#放置及使用)，包括值箭头及搜索提示。

## 组件几何

先选组件角色及尺寸变体，再选容器关系。高度、圆角、曲线、内缩及材质一起比较；仅圆角相等不构成协调，换行／展开本身也不证明应加大圆角。[圆角标准](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/ui-radius.md#radius-scale)负责值及例外。

- **内缩：** 协调内外曲线及内缩。同心圆弧的半径相减准确；超椭圆相减只为名义尺寸规则，因此除侧间隙还查对角留白。
- **齐边或相接：** 外框负责暴露角，内部连接保持方角。悬停填充及伪元素遵循轮廓，不裁菜单或焦点。
- **独立子卡／组：** 用自身角色／尺寸层级，不套对话框圆角，也不扣除全部父内边距。
- **圆／胶囊：** 用主题圆曲线例外保形，包括头像容器及图像；普通控件用共享曲线。

悬停、按下、选中、加载及禁用状态保持填充、描边、叠加几何稳定。复用[卡片／高度材质](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/ui-radius.md#settings-cards)：阴影已有中性细线；保留语义状态色边框，不叠中性边缘。

在受影响主题／状态及相关长标签／窄布局下，按实际尺寸比较相关控件，包括小选择控件。静态检查拒绝不支持声明；渲染比较判断适配。需要时查[几何案例](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/ui-design-review-cases.md#geometry)。应用于范围内变化，不批量改风格。

## 交互及反馈

### 反馈表面

遵循[错误处理](../dsh-error-handling/SKILL.md#本地化可操作可见的报告)。按消息寿命选反馈：

- 瞬态成功／失败用全应用 Toast，状态及渲染由寿命长于报告面板／标签的宿主管理，如 `shell.overlay` 条目。删除可能关闭源面板；面板拥有的 Toast 会随之消失。不对待定状态发 Toast。
- 失败操作保留可见数据；删除失败保留行。
- 表面自身失败用原位提示：带 Retry 的查询失败或字段验证。有内容旁用紧凑提示；仅空面板居中完整错误态。
- 短、朴素错误，最好一句，除必要诊断码外无内部术语。不超过两句的中文提示省略尾部句号（。）。预留空间或叠加提示，避免邻项移位。

### 加载状态

列表用骨架屏；其他页级加载居中裸 spinner。每页／组件保持一种加载处理，包括并发区域。只有上下文需要才加加载文字。

### 叠加层及菜单

合并前验证每个菜单、弹出层及提示都能外点关闭（可聚焦时还支持 Escape），带边缘余量适配视口，逃出祖先裁切、包含块及邻项覆盖，必要时 portal 到 body。只翻转到容得下的一侧；两侧都不够时不来回振荡。

用共享滚动条样式及小内缩；滚动条在容器内，不被圆角或边缘裁切。

### 平台窗口适配

新页头／页面考虑 macOS 及 Windows 窗口装饰。Menu、Modal 及叠加基础组件消费 `--dsh-frame-top-clearance`；局部 macOS 内缩用限定 `[data-platform='darwin']` 覆盖及样式表断言修复，不改全局变量。审查净空加页面内缩总量。

## 组合检查规则

先检查组合，再查受影响组内／跨组关系、远处同类及展开内容。匹配轴两端，光学调整前比较完整图标框。保留弹出／焦点可见、字段反馈、窄布局动作及草稿。查受影响主题材质／平台背景。完整界面主张覆盖全部区域；夹具／裁图只能证明其渲染内容。

## 每条规则一个负责者

更新本技能内负责章节或参考；不把设计专长暴露为独立技能。示例留[案例参考](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/docs/ui-design-review-cases.md)；AGENTS 及 PR 流程链接这里，不复制规则。

规则变化说明适用性、决定、例外及可观察验证；更新区分案例，删除其他处被替代陈述。说明是迁移还是未来编辑范围，不暗示已有 UI 已遵循。只自动化机械可判检查。本地审查工具消费仓库规则，保留来源／规则修订，不另维护标准副本。

## 设计审查升级

- 大量 UI 变化，或任何用户明显可感知的 UI／交互变化 PR，必须经设计师或产品审查。没有批准者担任该角色时，建议请求设计／产品评审者（截至 2026-09 名单：yx zhang、yifffan、zhangziya、gaokaige；成员变化时在此更新）。
