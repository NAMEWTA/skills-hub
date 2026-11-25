# 真实 Home 组合验收

## 范围与环境

2026-11-25，在 `temp/dev/home-issue-2/real-home/` 建立三个隔离 Git 仓库 `Home`、`ProjectA`、`ProjectB`。Node.js 为 v24.22.3，Linux；无生产数据、外部 API 或远端业务仓库。Home 实际安装八个 home 包，并经安装目录中的 registry/route 工具登记和解析两个项目。

本次 fixture 明确选择当前环境原生 Agent 协作工具。用户没有要求固定厂商 CLI，产品也不设置默认。实际使用 `collaboration.spawn_agent`、消息和同一负责人会话继续；这不等于 hc、Claude 或独立 codex CLI 验收。独立 codex 0.172.0-alpha.2 尝试启动时在 app-server 初始化遇到只读文件系统，保留失败边界，没有改变受控 HOME 或权限。

## 实际派遣和记录 owner

| 协调层 | 真实负责人 | 真实直接子 Agent | 实际实现/验收 cwd | 记录根 |
| --- | --- | --- | --- | --- |
| Home | `/root` | `/root/real_project_a`、`/root/real_project_b` | 对应项目 | Home 的 `.agents/home/coordination/` 仅存管理回执 |
| ProjectA | `/root/real_project_a` | `/root/real_project_a/provider_implementation` | `real-home/ProjectA` | A 的 `.agents/dev/changes/home-integration/` |
| ProjectB | `/root/real_project_b` | `/root/real_project_b/consumer_impl` | `real-home/ProjectB` | B 的 `.agents/dev/changes/home-integration/` |

两位项目负责人实际创建实现子 Agent，由子 Agent 编写源码和本地回执；负责人分别独立审查、编写测试、执行、提交。Home 不直接派遣或清理 A/B 的后代。项目没有安装 Home 接收器或 hook，也未借用 Home 安装目录作为当地运行依赖；它们按本地 AGENTS.md 接受普通任务。

B 最初只读上下文曾使用 Home/A cwd，读取规则后全部实现、审查、测试、写记录及 Git 操作固定 B。该早期差异保留在 B 的 context.json，不把所有历史 cwd 伪写为 B。A 首次写上层回执时发现 Home coordination 父目录不存在，先回报，由 Home 创建目录，再写指定文件。

## ProjectA 独立交付

- 源码验收提交：`311addd209ba3de9ce239a32e2f020b009ab8c95`。
- 最终提交：`01a65d39917cee923a10e65acf35a4391a87b65b`，工作树干净。后续提交仅增加知识查询证据和交接记录。
- 实际 `npm test`：58 通过、0 失败、0 跳过，退出 0；另有实际 HTTP 200/200/400 样本。
- `src/provider.js` SHA-256：`5fd3af45c20b2180c4701ae47ab255a393ea2632d00274e21fe34c5f91769063`。
- 服务使用 Node 标准库、回环地址与临时端口，提供 health、整数分报价、严格数量校验、404/405 和每请求 UUID。

权威原件留 A：`task.md`、`provider-report.md`、负责人 `report.md`、`test/provider.test.js` 与 `evidence/` 下实际输出。Home 只接收 `project-a-report.md` 和来源指针。

## 项目内部知识查询

Home 在代码验收后向原 A 负责人追问单价和金额表示的理由；提问前没有读取 A 的内部定价笔记，也不知道负责人生成的决策 UUID。A 在实际项目 cwd 执行定向 `rg`，核对 Git blob、工作文件和版本后返回摘要，没有重派编码任务。

| 项目 | 真实结果 |
| --- | --- |
| 决策标识 | `f22befb6-26e5-447f-88cc-8dec9fe0a4f9` |
| 当地来源 | `.agents/dev/notes/pricing.md` |
| 查询时版本 | `311addd209ba3de9ce239a32e2f020b009ab8c95` |
| 来源 Git blob | `a689155e70e4174f968357dd925a4ce45520a705` |
| 来源 SHA-256 | `ac762cbb7bbe7b4a7da11fa6e12dcc4ee835ea3b8d2146d213fa59335098e26c` |

查询区分了 fixture 假设与外部事实：1290 分是隔离演示商品的负责人假设，含元与角便于暴露单位错误，没有市场询价依据；整数分避免本例的浮点金额歧义。Home 的 `project-a-knowledge-report.md` 保存适用范围和来源，不建立内部知识镜像。最终 A 提交中该来源 blob 未变。

## ProjectB 真实联合验收

Home 明确由 B 负责人执行集成验收。B 使用 A 的公开 `startProvider({port:0})`，实际在 `127.0.0.1:44991` 启动并通过 HTTP 调用，没有用伪造的项目回执替代执行。

| 项目 | 真实结果 |
| --- | --- |
| A 组合版本 | `01a65d39917cee923a10e65acf35a4391a87b65b`，执行前后 clean |
| B 最终版本 | `45aec563d2719bdf3868b55f4e8aa3ab11698dcf`，提交后 clean |
| 独立命令 | `npm test` → `node --test --test-reporter=spec`，退出 0 |
| 独立结果 | 34 通过、0 失败、0 跳过 |
| 真实正常链路 | health=ok；qty=2、unitPriceCents=1290、totalCents=2580、currency=CNY |
| 真实请求标识样本 | `aca25a6d-b44a-4f7d-ad57-376c8b3d2886` |
| 真实非法请求 | 缺失、0、101、负数、小数、前导零、科学计数、加号、空白、空值、重复、额外参数共 12 类均 HTTP 400 |
| 资源关闭 | listening=false、address=null；新连接 ECONNREFUSED；进程正常退出 |

B 的调用方异常响应校验另使用明确标注的本地夹具，与真实 A→B 链路区分。超时、响应体积上限和中断流只做静态审查，未专门注入；未验证生产部署、长期压力或 Node20 最低版本。Home 未把组合通过描述为多仓原子发布。

权威原件留 B：`owner-report.md`、`execution.json`、`test-output.log`、`context.json`、`implementation-report.md`，以及当前知识 `.agents/dev/notes/consumer.md`。Home 收到 `project-b-report.md`，未扫描 A/B 技术知识来替项目回答。

## Claude 宿主和发布包

[Linux CI 的实际日志](https://github.com/NAMEWTA/skills-hub/actions/runs/45567944978/job/139047242747)绑定源码 `139b3e87328aa490d239632f3a1065a939ead696`：472 项全通过、无跳过；正常联网真实 npm tarball 验证 63 技能/1092 文件及全部目录链接；Archify 完整 finalize 和真实 browser-check 通过。

同一任务独立安装官方 SDK `0.3.332`，实际 Claude Code 返回版本 `2.1.332`。维护脚本通过真实进程的 `supportedCommands`、`reloadSkills` 核查全部 63 技能，再通过其 `readFile` 读取 121 个入口/参考资源；每个 requestedPath 在 `.claude/skills/`，有效 realpath 回到同仓 `.agents/skills/`，正文 SHA-256 与本体一致。没有发送用户回合，结果明确 `modelInferenceVerified=false`：这是宿主发现/读取验收，不是模型执行任务证明。没有把 fs.realpath 的单独检查当作宿主证据。

原始日志摘录和完整远端日志地址留 `temp/dev/home-issue-2/ci-linux-139b3e8-excerpt.log`。Windows 首轮已真实创建技能目录 symlink，但 route 测试发现 8.3 短路径和 Git 长路径比较差异，正在修复并等待复验；不将该轮整体写成通过。macOS 及最终提交复验结果在 T10 收口。

## 运营与新上下文

配置/现行/历史一致性、跨 owner 忘记和新 Agent 重新读取正在实际执行；结果尚未写为完成。不得以本文件的准备计划替代这些后续验收。最终结果归对应 T03/T05/T06 验收及本节的追加记录。
