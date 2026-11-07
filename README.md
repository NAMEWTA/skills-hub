# skills-wta

按领域组织、按需安装的 Agent Skills。第一组是从需求到上线及知识沉淀的 **dev**，第二组是系统诊断、磁盘清理、网络代理与配置的 **system**。

复用成熟技能的有效方法，保留原始来源和许可证。采用 **SDD（规格驱动开发）**，严禁 TDD、测试先行及红绿重构循环；实现后根据风险验证真实行为。小任务保持简短，复杂任务才拆分。

## 安装

需要 Python 3.10+，无第三方运行依赖。先把本仓库克隆到任意位置：

```bash
git clone https://github.com/NAMEWTA/skills-wta.git
```

**在要使用技能的项目根目录运行安装器。** 不选择安装目录，目标始终是当前目录下的 `.agents/skills/`。

```bash
# 查看所有领域和技能
python3 /path/to/skills-wta/install.py list

# 安装开发领域全部技能
python3 /path/to/skills-wta/install.py install --domain dev

# 同时安装两个领域
python3 /path/to/skills-wta/install.py install --domain dev system

# 只安装指定技能，可跨领域
python3 /path/to/skills-wta/install.py install --skill dev-grill dev-spec system-proxy

# 预览，不创建任何文件
python3 /path/to/skills-wta/install.py install --domain dev --dry-run

# 仓库更新后，备份并替换存在差异的技能
python3 /path/to/skills-wta/install.py install --domain dev --replace
```

Windows 可将 `python3` 换成 `py -3`，脚本路径使用本机路径，例如：

```powershell
py -3 C:\tools\skills-wta\install.py install --domain dev
```

仓库保存 `skills/dev/dev-spec/`，安装后是 `.agents/skills/dev-spec/`，不会多一层 `dev/`。技能自带需要的参考文件、模板与许可，单独安装也能工作。相同内容再次安装无变化；有差异默认停止整次安装，`--replace` 会先保留备份。更多行为见 [安装说明](docs/installation.md)。

安装器只安装文件。Agent 是否自动发现 `.agents/skills/` 取决于所用工具；不支持自动发现的工具可以显式读取对应 `SKILL.md`。这不是后台服务，也不会自动启动开发或部署。

## dev：完整开发流程

| 技能 | 用途 |
| --- | --- |
| [dev-workflow](skills/dev/dev-workflow/SKILL.md) | 总入口：按需求路由、持续实施、恢复任务、完成交付 |
| [dev-intake](skills/dev/dev-intake/SKILL.md) | 合并聊天、Issue、截图、日志、评审等来源，保留出处与范围 |
| [dev-grill](skills/dev/dev-grill/SKILL.md) | 按设计决策树澄清问题，先查事实，再问真正的产品选择 |
| [dev-spec](skills/dev/dev-spec/SKILL.md) | 把意图转成行为规格、验收、边界与非目标 |
| [dev-architecture](skills/dev/dev-architecture/SKILL.md) | 对比结构方案，明确领域、接口、状态所有权及取舍 |
| [dev-plan](skills/dev/dev-plan/SKILL.md) | 拆分可交付的垂直切片与真正的依赖 |
| [dev-ui-design](skills/dev/dev-ui-design/SKILL.md) | 产品界面与落地页设计，完整保留 Elaya 落地页参考 |
| [dev-figma-design](skills/dev/dev-figma-design/SKILL.md) | Figma 设计系统、变量、自动布局与组件体系 |
| [dev-build](skills/dev/dev-build/SKILL.md) | 根据规格实施、集成并验证当前成果 |
| [dev-debug](skills/dev/dev-debug/SKILL.md) | 基于运行证据定位根因，修复并回到原始场景验证 |
| [dev-review](skills/dev/dev-review/SKILL.md) | 分别审查规格符合度与工程质量 |
| [dev-deploy](skills/dev/dev-deploy/SKILL.md) | 指定环境部署、真实业务验证、恢复与发布记录 |
| [dev-learn](skills/dev/dev-learn/SKILL.md) | 沿真实业务链路理解陌生模块，定位二次开发入口 |
| [dev-archive](skills/dev/dev-archive/SKILL.md) | 复盘、更新知识、处理冲突与替代、归档历史 |

使用 `dev-workflow` 可以串起完整任务，也可以只调用某一步。技能间是可选协作关系，不会因少装一项就停止工作。

```text
使用 dev-workflow：读取这个 Issue 和两张截图，理清需求，完成实现、
验证后部署到我指定的测试环境，最后更新项目知识。

使用 dev-learn：帮我沿“创建账号”走通入口、业务规则、存储和回显，
指出后续改成多租户时会涉及哪些边界。

使用 dev-archive：这个需求已经上线。核对当前代码和发布记录，
更新术语、ADR 和错误经验，处理已经冲突的旧文档。
```

`$dev-workflow` 等调用语法由具体 Agent 决定；普通语言指定技能也可以。详细衔接与例子见 [开发流程](docs/workflow.md)。

## system：系统维护

| 技能 | 用途 |
| --- | --- |
| [system-inspect](skills/system/system-inspect/SKILL.md) | 确认真实主机与问题，检查磁盘、资源、进程、网络及服务 |
| [system-cleanup](skills/system/system-cleanup/SKILL.md) | 按实际占用选择可清理对象，执行后量测并验证 |
| [system-proxy](skills/system/system-proxy/SKILL.md) | 排查和配置代理、DNS、客户端与应用生效范围 |
| [system-config](skills/system/system-config/SKILL.md) | 调整已指定的软件或系统配置，保留备份并验证真实生效 |

系统技能不会把“清缓存”扩展为删除业务数据，也不会把“应用代理”扩展为修改整机路由。主机文档按需放在 `.agents/system/<主机标识>/`；密码与订阅秘密只记录安全引用。

## 项目知识怎样留下来

技能安装包和项目资料分开。已有项目目录沿用；没有约定时使用下表，不强制一次性创建所有目录。

| 位置 | 保存什么 |
| --- | --- |
| `AGENTS.md` | 简短导航、必要项目约定；不放完整百科 |
| `.agents/changes/<日期-主题>/` | 活跃需求的简报、规格、切片、进展和证据 |
| `.agents/notes/index.md` | 常用知识入口；不维护全量注册表 |
| `.agents/notes/glossary.md` | 术语、别名、适用范围与代码映射 |
| `.agents/notes/context/` | 代码本身解释不了的背景和约束 |
| `.agents/notes/decisions/` | 仍有决策价值的 ADR、替代方案和后果 |
| `.agents/notes/errors/` | 可能再次出现的错误、识别方式与恢复经验 |
| `.agents/notes/learning/` | 经代码核验的模块导读 |
| `.agents/deploy/<环境>/` | 当前运行手册、配置与凭据引用、历史发布记录 |
| `.agents/archive/changes/`、`.agents/archive/notes/` | 已结束过程与历史知识 |

当前代码和实际运行证据说明现状，用户明确目标说明期望。知识写“为什么、边界、去哪找”，具体实现链接到代码；归档时核对引用、修复过期事实、保留仍重要的理由。详见 [知识与记忆](docs/knowledge.md)。

## 来源与维护

本版本固定研究了 DeepSeek Harness、Matt Pocock Skills、Cursor pstack、Elaya AI Design Skills 与 Speculo，并参考 OpenAI 的技能和知识管理文章。源版本、文件映射、保留内容及必要调整全部记录在 [来源与改编说明](docs/sources.md) 和 [第三方声明](THIRD_PARTY_NOTICES.md)。

开发者从 [AGENTS.md](AGENTS.md) 开始。本次检查范围见 [验证记录](docs/validation.md)。仓库校验和安装器行为检查：

```bash
python3 scripts/validate.py
python3 -m unittest discover -s tests -v
```

项目新增内容采用 [MIT](LICENSE)；上游内容保留各自 MIT 声明。不要删除随技能分发的许可证。
