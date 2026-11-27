# Home 工作入口

本文件保存当前 Home 的约定与资料入口。Home 维护项目管理与长期背景；目标项目的代码、规则和内部知识由当地 Agent 读取。相对路径按包含它的文件解析。

## 读取顺序

1. 激活任一 Home 技能时核对本入口。当前上下文已读同一根、同一版本可复用；新会话、压缩后缺失、入口更新或切换 Home 时重读。
2. 已有 `./context/preferences.md` 时读取本次行为有关的用户约定。需了解 Home 职责或背景时读已有 `./context/profile.md`。合作风格按用户的实际指针读取可选 `./SOUL.md` 或原权威文档。
3. 按当前任务读取已安装技能的 `SKILL.md` 和它指出的资料。候选、归档、完整历史和项目内部材料按需展开。

## 按目标进入

| 目标 | 方法与资料（按需建立） |
| --- | --- |
| 初始化、登记、偏好或派遣配置 | home-setup；`./repos.json`、本机 `./local.json`、`./context/` |
| 查项目路径与身份 | home-route；读取登记，核对实际 checkout |
| 派任务、继续原负责人、验收交付 | home-workflow；沿用户选定的派遣方法执行 |
| 查任务进展、回执与占用 | home-tasks；`./coordination/`，TSV 只导航，现状向原 owner 核查 |
| 查依赖、契约 owner 与影响 | home-map；`./relations.md` |
| 查现行知识、记住、更正、忘记或维护本入口 | home-knowledge；`./notes/index.md`、`./notes/`、`./inbox/`、`./archive/notes/`、`./exclusions.md` |
| 查当时理由、事件与接续线索 | home-history；`./history/index.md`、`./history/`、`./archive/history/` |
| 验证项目组合能否工作 | home-integrate；实际执行者保留联调原件 |
| 入口、登记或链接异常 | home-doctor；只读检查并交原 owner 修复 |

## 缺项与维护

资料尚未创建、可选 SOUL 缺省和某个技能未安装只影响有关分支；继续可完成部分，不隐式安装其他 domain。入口读不到时先核对根、路径和安装状态，直接进入最小诊断，不以读到本文件为诊断前提。

技能升级保留本文件。需要整理入口、调整实际资料指针或保存合作原则时，由 home-knowledge 按授权编辑。home-setup 维护配置及完整初始化时的根短指针。
