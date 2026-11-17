# dev-prototype 实际试用：成员邀请

## 试用设定与证据边界

这是主代理构建的虚构项目：提供一个现有成员页面，并模拟一份已经收敛的成员邀请规格。首轮试用时，独立代理只收到任务、技能路径和项目输入，没有收到预期答案或应得出的改进结论；它按技能完成原型、验证记录与交接，再根据更新后的技能收拢资料。

**试用规格中的“文字需求已确认”属于测试设定，绝非真实用户对业务效果的批准。P1 原型未获用户确认。** 这些文件用于保留技能实际使用证据，不作为生产产品的批准或验收凭据。

本次真实浏览器走查未完成：浏览器插件缺少连接上下文，备用浏览器拒绝本地文件协议。未绕过限制，也未在归档时重试。此前通过的 **15 项状态逻辑检查使用 Node 显示适配器和可控计时器，属于状态函数检查，不是 DOM 集成测试或浏览器 E2E**；视觉、键盘与原生 dialog 等限制保留在原走查记录中。

## 完整归档与入口

`member-invitations/` 保留试用项目的 8 个源文件及原相对目录：项目 README、原成员页、规格、交互 HTML、完整快照、走查记录、逻辑检查脚本和实际输出。各文件均按原件字节复制；原型、快照、规格和走查记录没有为归档改写。

- [项目说明与体验顺序](member-invitations/README.md)
- [可直接打开的交互 HTML](member-invitations/.agents/dev/changes/2026-11-17-member-invitations/prototype/index.html)
- [走查、固定快照、资源指纹与确认范围](member-invitations/.agents/dev/changes/2026-11-17-member-invitations/prototype-review.md)

从 `skills-hub` 仓库根目录复跑状态检查：

```bash
cd .agents/dev/changes/2026-11-17-dev-prototype/evaluation/member-invitations
node .agents/dev/changes/2026-11-17-member-invitations/verification/logic-check.mjs
```

脚本按自身位置读取归档中的 `../prototype/index.html`，不依赖原试用项目的绝对路径。HTML 无外部资源，可在有权限的本地浏览器中直接打开；本次归档没有新增浏览器验证结论。

## 试用暴露的资料组织问题与改进

第一轮除 Markdown 走查记录外，还生成了独立 `prototype-version.json` 流程状态清单，使版本与确认事实出现重复维护。随后将约束直接补入技能入口、change 确认方法和记录模板：版本及真实确认事实集中于现有 Markdown，Git 或完整快照保存资源，不另建流程 JSON、确认状态清单或审批引擎。

独立代理按更新后的技能删除该 JSON，将其独有的制作日期与来源哈希迁入原走查记录；项目 README 改为引用统一记录，后续反馈指向同一确认章节。此次收拢仅调整资料，交互 HTML 与快照保持 P1 原有内容和指纹。归档保存的是收拢后的完整试用结果。
