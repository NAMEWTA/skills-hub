# Issue 查重

- 目标：NAMEWTA/skills-hub
- 获取时间（UTC）：2026-11-26T08:30:07.145Z
- 查询：`GET /repos/NAMEWTA/skills-hub/issues?state=all&per_page=100`
- 返回 21 个 Issue/PR，未达 100 条分页边界；其中普通 Issue 9 个。
- 综合检索 materials、pstack、recall、reflect、JSONL，并核对全部 open/closed 标题和相关正文。现有 #3、#15、#18 已完成的边界继续保留；#21 属于独立 Home 入口与安装合同，不与本次 dev/ops 会话证据重构重复。

| 编号 | 类型 | 状态 | 标题 |
| --- | --- | --- | --- |
| [21](https://github.com/NAMEWTA/skills-hub/issues/21) | Issue | open | feat(home): 完善 AGENTS 主入口与知识维护，验证自然语言多项目闭环并固化按域初始化 |
| [20](https://github.com/NAMEWTA/skills-hub/issues/20) | Issue | closed | Home 登记改进：多 remote、显式相对路径与按需项目地图（完整实施 Plan） |
| [19](https://github.com/NAMEWTA/skills-hub/pull/19) | PR | closed | feat(dev-setup): 评估宿主机与项目负载的 Agent 并发容量 |
| [18](https://github.com/NAMEWTA/skills-hub/issues/18) | Issue | closed | feat(dev-setup): 基于宿主机与项目负载评估 Agent 并发容量，完善 environment.md |
| [17](https://github.com/NAMEWTA/skills-hub/pull/17) | PR | closed | feat(home): 完成 Home 管理、知识历史与技能同仓链接（v0.1.30） |
| [16](https://github.com/NAMEWTA/skills-hub/pull/16) | PR | closed | fix(dev): 按团队派遣规则复用 Agent 会话 |
| [15](https://github.com/NAMEWTA/skills-hub/issues/15) | Issue | closed | fix(dev): 由 dev-setup 配置派遣规则，允许同一 Agent 会话处理多个 task |
| [14](https://github.com/NAMEWTA/skills-hub/pull/14) | PR | closed | feat(dev): 新增完整 Issue 撰写与维护技能 dev-issue |
| [13](https://github.com/NAMEWTA/skills-hub/issues/13) | Issue | closed | feat(dev): 新增 dev-issue，创建和维护可直接认领的完整 GitHub Issue |
| [12](https://github.com/NAMEWTA/skills-hub/issues/12) | Issue | closed | system-herdr-core：请明确协作目录中验收日志和诊断文件的存放位置 |
| [11](https://github.com/NAMEWTA/skills-hub/pull/11) | PR | closed | feat(upstream): 完整中文移植 Dashboard Design 2.1.0 为 zh-dashboard-design |
| [10](https://github.com/NAMEWTA/skills-hub/pull/10) | PR | closed | 补充只读 npm 发布状态诊断 |
| [9](https://github.com/NAMEWTA/skills-hub/pull/9) | PR | closed | 精简上游中文技能与项目文档，发布 0.1.13 |
| [8](https://github.com/NAMEWTA/skills-hub/pull/8) | PR | closed | chore(release): 发布最新技能与安装更新 v0.1.12 |
| [7](https://github.com/NAMEWTA/skills-hub/pull/7) | PR | closed | feat(dev): 新增交互 HTML 原型与可视化意图确认闭环 |
| [6](https://github.com/NAMEWTA/skills-hub/pull/6) | PR | closed | feat: add independent Chinese upstream skills with CLI and TUI installation |
| [5](https://github.com/NAMEWTA/skills-hub/issues/5) | Issue | closed | feat(dev): 新增 dev-prototype，以用户确认的交互 HTML 作为 change 实施与验收依据 |
| [4](https://github.com/NAMEWTA/skills-hub/pull/4) | PR | closed | feat(ops): 实现独立运维领域、统一入口与运行记录（Issue #3） |
| [3](https://github.com/NAMEWTA/skills-hub/issues/3) | Issue | closed | feat(ops): 独立管理服务器与项目运行拓扑，部署发布由项目负责 |
| [2](https://github.com/NAMEWTA/skills-hub/issues/2) | Issue | closed | feat(home): Home Repo 构建、运营与管理：用户配置、分层派遣、持久知识与历史 |
| [1](https://github.com/NAMEWTA/skills-hub/pull/1) | PR | closed | feat(dev): 新增独立 dev-handoff，完整迁移交接与接续方法 |

结论：未找到覆盖本轮固定来源、JSONL 证据合同和 dev/ops 重构范围的既有 Issue，可创建一份综合 Issue。
