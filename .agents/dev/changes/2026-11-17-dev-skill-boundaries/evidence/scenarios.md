# 独立自然请求与本地场景记录

## 方法与范围

在未继承实施讨论的独立上下文中，提供当前 `skills/dev/`、下面 12 个互不相关的自然请求及少量场景文件。执行者先读取全部 32 个技能的名称与 description，再选择入口并读取完整参考。未提供期望路由或本次修改诊断；没有外部服务调用。

只有请求 11 授权写入它指定的决定记录。其余业务代码与配置只读；请求 7 的验证仅更改内存中的配置值。验证观察到的是本次隔离任务的行为，不代表所有宿主都会自动选择相同入口。

## 请求与真实结果

| 序号 | 原始请求要点 | 执行者选择与产出 |
| --- | --- | --- |
| 1 | 将聊天、两个 Issue 和截图整理为目标、事实、已定范围与缺口，不运行应用 | `dev-intake`；未附原件时明确业务事实未知，给出待补来源，没有默认复现或建单 |
| 2 | 文件归属影响后续权限，请逐层帮助决定 | `dev-grill`；先问文件归属，明确推荐尚未成为决定，不借用第 11 项的独立授权 |
| 3 | 已确认的 `brief.md` 是否能交给独立实施者和验收者 | `dev-spec`；确认契约已充分，保留 brief，未另建 spec；仅建议补入口与 ASCII 范围说明 |
| 4 | 只改写“帮我优化登录页面，弄好看点”，未授权开发 | `dev-sharpen`；交付包含材料、范围、方法与验收建议的请求文本，没有启动开发 |
| 5 | 手工故障报告只做分类、查重和分流，没有自动化 | `dev-issue-triage`；手工入口可用，缺实际报告及历史集合时标为未判定/未查重，未配置后台任务 |
| 6 | 没有 spec 文件，明确要求登录名 ASCII 大小写不敏感；审查实际代码 | `dev-review`；读取明确用户要求并运行四输入探针，规格轴发现 1 个根因缺陷，规范轴未凭空制造规则 |
| 7 | 运行加载器报 `Missing required config: port`，诊断并建议，禁止改文件 | `dev-debug`；验证一个证据明确的配置键拼写原因，原命令失败，内存更正后原加载器成功，未凑假设 |
| 8 | 代码完成，创建 PR 并跟进 CI，暂不部署；只讨论所需资料 | `dev-deploy` 代码交付分支；索取仓库/分支/提交和已有证据，没有要求主机、迁移或回滚计划 |
| 9 | 给项目起草权限审查技能，没有个人历史 | `dev-personalize` 通用编写分支；交付 `SKILL.md` 与 `agents/openai.yaml` 两文件草稿，无偏好提炼前置 |
| 10 | 已检查的 `.mjs` 模型只有报告和反例，缺 `.tla`、完整图导出与 Java/TLC | `dev-formal-verify`；使用报告、步骤表和有依据的反例路径图，不调用 statechart，也不补造完整状态图 |
| 11 | 已明确文件归团队、退出者失去访问权，请写回计划指定记录 | `dev-workflow` 决定记录分支；选择已给定，因此未再访谈，直接更新原决定文件并回读，原计划继续引用 |
| 12 | billing 应用和 billing 形式模型分别生成验证技能 | 应用由 `dev-verify`、模型由 `dev-formal-verify` 负责；给出两个不同前缀、源/安装位置及已有包职责核对，未覆盖或迁移旧包 |

12 项均保持本次任务的输出和授权边界。请求 11 选择 workflow 记录已给定的决定符合任务实际，不机械要求每次保存产品决定都重启 grill。

## 实际运行场景

### 没有 spec 文件时的两轴审查

用户要求为“登录名不区分 ASCII 大小写”。代码原件：

```js
const accounts = [{ login: 'alice', id: 1 }];
export function findAccount(login) {
  return accounts.find(account => account.login === login) ?? null;
}
```

执行者通过 Node.js `v24.22.1` 导入真实函数并调用：

| 输入 | 实际 ID | 结果 |
| --- | --- | --- |
| `alice` | `1` | 基线命中 |
| `Alice` | `null` | 违反大小写不敏感要求 |
| `ALICE` | `null` | 违反大小写不敏感要求 |
| `nobody` | `null` | 未知名称的补充观察 |

探针输出 `failures=2`，退出码为 1。执行者将两次失败归为严格相等比较的同一根因，没有因缺少独立 spec 跳过规格轴。未找到适用场景项目的明确编码规范时，未将兄弟技能仓库的 AGENTS 误作场景规范。本次没有修改代码。

### 单个有依据的故障解释

原加载器：

```js
import fs from 'node:fs';
const config = JSON.parse(fs.readFileSync(new URL('./server.json', import.meta.url), 'utf8'));
if (!Number.isInteger(config.port)) throw new Error('Missing required config: port');
console.log(`Configured port: ${config.port}`);
```

配置原件为 `{"poart":8080}`。原 CLI 实际报 `Error: Missing required config: port`，退出码 1。只读诊断取得：

```json
{"actualKeys":["poart"],"portType":"undefined","portIsInteger":false,"poart":8080}
```

执行者只在内存把 `poart` 改为 `port`，拦截该次配置读取后导入原加载器，输出 `Configured port: 8080`，退出码 0。建议仅修正配置键，未加入错误拼写兼容层，也未宣称原文件已修好。

### 已有决定的记录与返回

原文件 `decisions/member-exit.md` 标为待决定，并已被计划指定为权威位置。执行者将状态改为已决定，写入团队文件所有权、退出者访问撤销、用户本次明确选择的来源及返回原计划的说明。未提供业务理由时没有编造理由；没有原计划文件时未声称更新过计划索引。

回读后的 SHA-256 为 `49c8645498ef75a75eae17d9015d3f0671966111e51aee583d99cc2c36b9f6c3`。另外四个场景文件的前后摘要一致；没有新建竞争 brief。

### JavaScript 模型展示

执行者读取现有检查器并真实运行 `check-model.mjs --help`，退出码 0，核对命令支持 `MODEL.mjs`、状态/迁移预算、死锁选项及 Markdown 输出。没有具体报告正文时仅给出展示方法，没有捏造状态值；没有运行新的模型或 TLC。

## 完整参考读取

需求侧读取 intake 的来源证据/事项整理/目标复述/brief，grill 的访谈入口、决策访谈与澄清，spec 的规格综合与完整实施简报，sharpen 的深化请求和模板。报告侧读取 triage 全文及来源协议。

执行侧读取 review 的两轴、审查基线、影响范围和报告方法，debug 的缺陷修复与诊断方法，deploy 的 PR 准备、证据、跟进和落地方法，personalize 的通用技能编写与结构规则。验证侧读取实际检查器、工具选型、两类生成与维护方法，决定记录读取 workflow/plan 的原记录约定。

这些阅读用于当前请求，没有将所有技能当作一条必走流水线，也没有将静态阅读表述为真实部署或新属性证明。
