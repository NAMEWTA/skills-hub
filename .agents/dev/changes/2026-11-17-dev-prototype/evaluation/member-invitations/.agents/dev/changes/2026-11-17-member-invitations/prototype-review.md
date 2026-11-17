# 成员邀请原型：走查、版本与交接

**状态：P1 原型已制作；尚未获得用户对本版本的真实体验确认。**

本记录放在 `prototype/` 之外，是本 change 的版本与用户确认事实的统一维护位置；项目 README 提供打开与操作说明并引用本记录。文中所有相对链接以本文件所在目录为起点。本文使用的源码定位均指向 P1 的同一个自包含 HTML，不把函数名或 CSS 选择器伪装成页面锚点。

## 1. 入口、来源与完整版本

| 项目 | 实际依据 |
| --- | --- |
| 活动入口 | [prototype/index.html](prototype/index.html)，可直接以本地文件打开，无构建步骤 |
| 固定版本 | **P1**，2026-11-17 制作并保留；[完整只读快照](snapshots/P1-06304fe9674e/index.html)，不是 Git 提交，也不代表用户认可 |
| 已确认文字需求 | [spec.md](spec.md)，行为 1–7 与边界 |
| 视觉基线 | [current/index.html](../../../../current/index.html)，未修改 |
| 包含的资源 | 仅一个 `index.html`；HTML、CSS、JavaScript、fixture 均内嵌，无远程字体、图标、图片或脚本 |
| 模拟边界 | 仅内存状态；不发邮件；刷新与重置恢复初始数据；不存在 API、存储或接受邀请页面 |
| 已有用户认可 | 仅文字需求；没有可复用的原型确认 |

目录指纹（对 `prototype/` 的完整内容计算，快照目录得到同一结果）：

```text
06304fe9674e29257680d4684d56cc3c434d6503633d6e1977123d7a808d65bf
```

单文件 `index.html` 的 SHA-256：

```text
da480af0d351eea3e1d0486e335adb7649119ffee2c01f8e8aebb26579b28e93
```

目录指纹由本次使用的 `dev-prototype/scripts/fingerprint.mjs` 计算；文件清单格式是 `dev-prototype-fingerprint-v1`。快照保留真实内容，指纹用于核对变化，二者不证明浏览器效果或用户身份。

P1 所依据的原页面与需求文档内容也已核对，来源 SHA-256 保留在此：

| 来源文件 | SHA-256 |
| --- | --- |
| [current/index.html](../../../../current/index.html) | `5287cde8d49dd8dd319980c6807961acd5484f378d0c28399125a88b147e9feb` |
| [spec.md](spec.md) | `1d05e9bba8f001e71a2a1d0b50260166ba88a73ca5db7c7e9b2b949e5a4c56fd` |

要恢复 P1，将快照中的 `index.html` 复制到一个新目录后直接打开；核对上述单文件 SHA-256 即可。不要覆写只读快照。后续修订保留 P1，另建新快照，并让新的用户反馈绑定新的内容指纹。

## 2. 项目风格与新增设计

P1 继承原成员页的 204px 侧栏、概览/成员/设置导航位置、工作区/团队页头、深色主题与 720px 侧栏折叠断点。`current/index.html` 的 token 原值继续使用：背景 `#14202b`、面板 `#1d2d3b`、边线 `#354755`、正文 `#edf3f7`、次级文字 `#a8b7c2`、强调色 `#62d6b6`、危险色 `#ff9e9e`、圆角 `6px`。正文 `15px/1.5`，桌面主区 28px、面板 20px、单元格 12px。没有沿用技能包中的采购示例外观。

源码依据：[P1 HTML](snapshots/P1-06304fe9674e/index.html) 的 `:root`、`.shell`、`aside`、`nav`、`.topbar`、`.panel`、`th,td`、`:focus-visible` 和 `@media(max-width:720px)`。这些样式的静态部分不需要 JavaScript。

原成员页没有抽屉、错误、空态或撤销确认。P1 在同一 token 上新增右侧 460px 上限的原生 `dialog`，使用固定页头/页脚与独立滚动正文。520px 以下抽屉占满宽度，表格转换为带字段标签的纵向卡片。新交互是本次待确认设计，不能称为“沿用了旧页面已有抽屉”。

源码依据：[P1 HTML](snapshots/P1-06304fe9674e/index.html) 的 `#invitation-drawer`、`.drawer-header`、`.drawer-body`、`.drawer-footer`、`@media(max-width:520px)`；`openDrawer()`、`renderDrawer()`、`closeDrawer()` 驱动视图与焦点。

概览与设置未新增产品功能，导航位置保留并说明本次仅开放成员页。原型演示、权限切换、失败模式和重置放在独立 `.demo-panel` 中，不混入真实业务抽屉。

## 3. 需求与场景覆盖

以下全部引用 **P1** 的 [源码文件](snapshots/P1-06304fe9674e/index.html)。表中“已实现”描述源码与模拟状态，不代表已经在真实浏览器执行。

| 需求 | 起点、动作与可见结果 | 取消、异常与恢复 | HTML / CSS / JavaScript 定位 | 后续生产验证 |
| --- | --- | --- | --- | --- |
| 1. 管理员邀请 | `邀请成员` 打开右侧抽屉；填写邮箱；选择成员或只读 | 取消或 Escape 返回列表，不创建 | `#invite-open`、`#empty-invite-open`、生成的 `#invite-form` / `#invite-email` / `#invite-role`；`.field`、抽屉样式；`openCreate()`、`openDrawer()`、`renderDrawer()` | 真实成员角色语义与服务端权限 |
| 2. 校验与重复 | 必填、格式、已有成员及待接受邮箱校验；保留原输入与角色 | 错误可修正；不新增记录；大小写/首尾空白用于模拟去重 | `#form-error`、`input[aria-invalid="true"]`、`.form-error`；`validateEmail()`、`normalizeEmail()`、输入事件 | 服务端邮箱规范化、边界地址政策与原子去重；原生邮箱校验需真实浏览器复查 |
| 3. 等待与成功 | 发送等待 1.1 秒；只提交一次；成功后新记录真实加入列表；抽屉展示成功详情，关闭仍保留记录 | 等待中取消会终止模拟计时器；继续邀请开启新表单 | `#send-progress`、`#invite-submit`、`#invitation-rows`、`#invitation-count`；`.spinner`、`.success-mark`；`submitInvitation()`、`renderInvitations()`、`abortPending()` | 真实发送结果、幂等、延迟、关闭页面后请求语义与数据持久化 |
| 4. 失败与重试 | 演示区选择下次失败；等待后明确显示服务暂不可用；邮箱与角色保留；重试成功产生一条记录 | 失败只消费一次；下一次直接成功；可以修改内容或取消 | `#demo-outcome`、`#form-error`、`#invite-submit`；`.form-error`；`state.form.errorKind`、`submitInvitation()` 的失败分支 | 生产错误类型、可重试条件与真实服务恢复 |
| 5. 详情与撤销 | 列表查看打开详情；撤销进入确认状态；确认后移除对应邀请并更新计数/空态 | 保留邀请返回详情；撤销等待时取消或关闭不删除 | `data-action="view-invitation"`、生成的 `#revoke-open` / `#revoke-cancel` / `#revoke-confirm`；`.detail-list`、`.warning-box`；`openDetails()`、`requestRevoke()`、`cancelRevoke()`、`confirmRevoke()` | 服务端撤销、并发接受与撤销冲突、过期链接行为 |
| 6. 空态与普通成员 | 无邀请时显示空态与邀请入口；普通成员可看成员、邀请、详情，但创建/撤销禁用并有原因 | 切回管理员恢复操作；重置或创建恢复非空列表 | `#invitation-empty`、`#permission-note`、生成的 `#detail-permission`；`.empty-state`、`.permission-note`；`renderPermissions()`、`isAdmin()`、行为处理器权限检查 | 服务端鉴权与读取范围，不能只依赖前端禁用 |
| 7. 模拟、窄屏与焦点 | 成功/失败、身份、空态、长邮箱和确定性重置均有入口；抽屉 Escape 关闭并返回焦点 | 原触发器消失或隐藏时回到邀请标题；所有待处理计时器可失效 | `#demo-role`、`#demo-empty`、`#demo-long`、`#demo-reset`、`#invitation-heading`；520px / 720px 媒体查询、`.wrap`、`.email`、`prefers-reduced-motion`；`resetDemo()`、`closeDrawer()`、`focusAfterRender()`、`requestVersion`、dialog `cancel` 事件 | 桌面/窄屏实测、真实键盘与屏幕阅读器；接受页面和真实邮件明确不在本次范围 |

## 4. 实际检查结果与限制

检查日期：**2026-11-17**。检查对象：上述最终 P1 内容。

### 已执行

- 完整读取需求与现有页面源码；逐条核对入口、状态修改、失败/取消恢复及模拟边界。
- 对内嵌脚本执行语法解析。
- 执行 [logic-check.mjs](verification/logic-check.mjs)，**15 项状态逻辑检查通过**，真实输出保存在 [logic-check.txt](verification/logic-check.txt)。它覆盖必填/格式分支、两类重复、等待与成功、重复提交、失败重试、取消、撤销确认/取消、空态、权限变化、重置清理迟到请求及输出转义。
- 状态检查直接运行 HTML 内的原处理函数，使用最小显示适配器和确定性计时器；动态渲染函数被替换，不是完整 DOM 集成测试，也没有启动浏览器。
- 独立源码审查发现 `.invitation-table td:first-child{width:56%}` 的优先级高于窄屏通用 `td` 规则。已在 520px 媒体查询中用同等优先级明确覆写为 `width:100%`，避免窄屏长邮箱被压缩到半行宽。源码复查修正已落入最终 P1。
- 活动入口与完整快照的文件字节及目录指纹一致；没有外部资源依赖。

### 未执行，不能写为通过

**真实浏览器视觉与交互走查未完成。** Browser 插件返回缺少 originating browser context；备用云浏览器拒绝本地 `file://` 协议，并明确禁止通过其他表面或间接执行绕过。没有转用替代浏览器或改协议绕过这一限制。

因此未实际观察桌面或 375–390px 窄屏渲染、长内容溢出、移动键盘、滚动、CSS 动画、真实点击事件、原生邮箱校验、原生 dialog 的模态行为、Tab / Shift+Tab / Enter / Escape、焦点返回以及屏幕阅读器播报。没有可作为证据的页面截图或录屏。

用户可依 [项目入口与走查说明](../../../../README.md) 在实际浏览器中完成这些检查。若用户只确认某一场景，不应把未体验的其余场景写为已确认。

## 5. 用户反馈与确认

**尚未获得本版本的用户确认。**

- 反馈来源与时间：尚无针对 P1 实际效果的用户反馈。
- 用户已认可内容：[spec.md](spec.md) 的文字需求。
- 已获原型认可的版本与范围：无。
- 待确认范围：当前项目风格下的页面信息层级、右侧抽屉宽度/布局、成功后留在抽屉展示结果的节奏、错误和重试文案、抽屉内撤销确认、权限/空态提示、窄屏与键盘体验。
- 确认方式：用户实际打开 P1 并操作后，自然语言明确认可或提出具体修改即可；不需要额外审批表单。Agent 的检查、模拟成功与本记录均不构成认可。

## 6. 修订与实施交接

本次只交付原型与必要材料，不进入真实产品实施。没有修改 `current/index.html`、`spec.md` 或 `skills-hub`；没有创建 GitHub 内容。

下一轮应将真实反馈记录到第 5 节，包含实际入口、P1 完整快照/指纹、用户原话或忠实摘要和明确范围。若需修改，先保留 P1，再完成新版本与受影响场景检查，按实际反馈确认差异。

面向 `dev-spec` / `dev-plan` / `dev-build` / `dev-review` / `dev-verify` / `dev-handoff` 的共同依据是：**同一固定资源版本 + 本记录第 3 节的逐项源码定位 + 真实用户确认范围 + spec 的后台边界**。P1 当前仍待确认，不得提前称为已确认实施基线。后续经用户确认后，可见效果在其认可范围内以该版本为依据；任务清单和文字说明不能悄悄重定义它。

生产实施仍需单独完成和验证服务端授权、邮箱规范化与原子去重、真实邮件/API、持久化、幂等、并发接受与撤销的一致性。模拟发送成功不证明其中任何能力已经实现。原型的“关闭即取消计时器”只是本地演示语义；真实异步请求若无法取消，应先说明并对齐受影响的体验。

实施验收应在同一页面、相同数据/状态、相同视口与主题下对照被确认的完整版本；缺陷修正或新用户决定需要同步版本与引用，不得改旧快照以掩盖差异。

### 2026-11-17 资料组织调整

按更新后的 `dev-prototype` 记录约束，将原独立 JSON 流程清单收拢到本记录，保留完整资源入口、快照、指纹、来源哈希与实际确认事实。README 的版本与确认状态改为引用本记录，后续反馈统一维护在第 5 节。

本轮仅调整资料组织，没有改动交互 HTML 或只读快照。P1 的资源内容与上述指纹保持一致，不另增内容版本。此前浏览器验证的限制保持原记录；本轮未重试浏览器动作，也未重复执行未受影响的状态逻辑检查。
