# 来源核验与必要适配

关联 [Issue #5](https://github.com/NAMEWTA/skills-hub/issues/5)，核验日期 2026-11-17。完整来源链接和研究结论见[开发说明](../../../../docs/dev-prototype.md)。

## 固定材料与最新研究

| 来源 | 收录 SHA | 本次最新研究 SHA |
| --- | --- | --- |
| Speculo | `994a64427a6784053dd092a86713870062cfde2f` | 相同 |
| Matt | `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` | `5863806dd4e15c63174bee4e7515a4256792ecfa` |
| pstack | `2eaf46574b25cdf7ef8c849837099b866b7438ce` | `3fa33bb0f927bea2ccacd48a3cfda95145fb6bae` |

四个探索来源经本地实际字节、子清单、固定与最新提交 API 四方核对，Git blob 完全相同：

| 来源文件 | 相同的 blob |
| --- | --- |
| Matt engineering/prototype/SKILL.md | `a0044501fe0d385b4d8575b610188ede9b236ccf` |
| Matt engineering/prototype/LOGIC.md | `32be86a0a5d9928db84b3988e55f9debe476ab40` |
| Matt engineering/prototype/UI.md | `3977951663490882c2632b40695d9f59a2fe2408` |
| pstack claude-code/skills/poteto-mode/playbooks/prototype.md | `18bedc7e9249d180f9198d5b4b13e3817d41d281` |

pstack 最新提交中 harness/pstack/claude-code 与 pstack 两条对应路径同时存在且为同 blob，不宣称旧路径失效。父清单、upstream/zh 字节均不变，不借本次研究全量升级材料。

## 探索方法完整迁移

四份运行参考由 dev-build/references 迁入 dev-prototype/references，文件名不变；所有调用者与历史迁移目标改为唯一新归属。

| 文件 | 保留内容 | 必要适配 |
| --- | --- | --- |
| prototype-method.md | 按问题选UI/逻辑、简单启动、内存状态、展示状态、记录答案与留存试验 | 限定探索用途；只省略无关错误处理；涉及最终体验先补完整确认原型，再实施；确认基线长期保留 |
| ui-prototype.md | 已有承载页优先，默认3个/最多5个结构变体，URL/键盘切换、开发环境控制、取舍与清理 | 候选数量仅限开放探索；不入主分支指生产试验路由，确认资料可随change保存；选变体不等于未展示旅程获批 |
| logic-prototype.md | 纯模块、单HTML、领域语言、状态展示、自由操作、完整walkthrough、边界与反例 | 项目视觉优先；不写测试仅限探索，不能取消确认走查；正式复用逻辑需检查生产约束，确认外壳长期保留 |
| prototype.md | 定义决策、开放方向找参考、轻栈隔离、切换比选、实际观察、推荐 | 变体仅限未决问题；已定需求走确认分支；准确调用dev-build/dev-architecture，不将试验当完整确认 |

逐条核对后为这四行填入对应 runtime_reviewed_blob；这是经过明确适配的方法，不冒称未经修改原文。完整步骤、判断、例子与反例保留，未以篇幅或偏好删减方法。

## Speculo 证据方法与例子

下列来源均相对 template/workflows/specdev/specdev-p-prototype，目标相对 skills/dev/dev-prototype：

| 来源 | 目标 | 保留与适配 |
| --- | --- | --- |
| SKILL.md | SKILL.md、references/change-prototype.md | 采用项目设计事实、可操作UI、长期版本、逐节引用和下游对照；适配领域路径/技能，补完整需求闭环、真实确认与内容漂移；非逐字复制 |
| references/design-evidence.md | 同路径 | 完整保留证据矩阵、定位规则、示例、五步写作/修改/交付及工具限制，只补随包示例边界 |
| references/design-evidence-example.md | 同路径 | 完整保留采购申请布局/视觉/筛选/选择/dialog/焦点/失败重试/响应式/边界；外部URL改包内真实源码，真实SHA256代替来源提交声明，明确未经用户确认 |
| design-library/templates/enterprise-data.html | assets/example/enterprise-data.html | 保留DOM/绑定/状态/金额，界面、ARIA与虚构姓名中文化，去来源品牌和缺失画廊导航 |
| design-library/templates/assets/prototypes.css | assets/example/assets/prototypes.css | 保留采购页全部适用token/布局/状态/断点，仅去不分发的营销、电商、作品集规则 |
| design-library/templates/assets/prototypes.js | assets/example/assets/prototypes.js | 保留dialog/焦点/筛选/排序/选择/失败保留/成功更新，中文化显示；删三个不分发页面分支，内部状态不变 |

采购 JS 中文文案逆向还原后与上游通用 dialog + 采购分支逐字一致。删无关代码的原因是页面不分发，不是为了迁就说明。示例仅教证据定位，不是项目默认设计或完整确认基线。

新增 prototype-review.md 与 fingerprint.mjs 是本次需求的轻量适配，不虚构上游映射；指纹只读、不生成审批状态、不证明用户认可。

## 其他方法与法律边界

OpenAI、Anthropic、Google、Superpowers、Spec Kit 的具体路径与采用理由在研究表中，仅参考方法，不复制文章全文或导入平台 SDK/固定框架/服务器。原型优先来自本次用户要求，限定可见效果及真实确认范围，不覆盖业务、安全、权限与数据约束。

已有 Speculo/Matt/pstack 法律原文继续随仓库与 npm 包保留，材料原件 LICENSE/NOTICE 不改；运行包不增加署名或外链。采购例子不分发画廊照片、字体或图标依赖。

