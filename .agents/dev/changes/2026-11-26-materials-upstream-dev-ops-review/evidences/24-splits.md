# 验证三个独立入口、旧入口转介和调用迁移

| 原入口保留的任务 | 新技能负责的任务 | 迁入资源 |
| --- | --- | --- |
| `dev-status` 书面回顾，跨会话时由 `dev-recall` 核对背景 | `dev-status-video` 制作进展视频 | `references/status-video.md`、`assets/storyboard.md` |
| `dev-deploy` 发布指定环境、核验版本、恢复与回滚 | `dev-pr` 创建、更新、跟进 CI 与审查、独立或堆叠队列、授权合并 | `autonomous-queue.md`、`autopilot-stack.md`、`babysit.md`、`local-tools.md`、`pull-request-evidence.md`、`pull-request-procedure.md`、`verified-landing.md`、完整 `scripts/local-tools/` |
| `dev-personalize` 归纳授权记录中的稳定个人惯例、维护偏好证据 | `dev-skill-authoring` 创建、更新和验证通用项目技能 | `references/authoring-a-skill.md`、`references/skill-authoring.md` |

README、工作流、帮助、方法归属、安装迁移说明和受影响的执行入口已改为新 owner。旧包显式说明转介和缺包时可完成的范围。PR 观察器移到新包，入口、参数和实现保留，测试从新路径加载。历史项目产物仍按实际位置读取。

在 Windows、Node.js 24.21.0 用 `install.mjs` 分别将六个技能各装到一个空临时项目。核对每个项目实际只安装所选包、入口所链接的本地资源存在、三个旧入口含对应转介、独立 `dev-pr` 的 `watch-pr --help` 返回 0 并列出 `--status-only`。迁移夹具通过，确认旧资源已移出且唯一方法路径存在。临时安装已清理。

`watch-pr` 的六个模块与工具包 `package.json` 和原版逐字节一致。`node --test tests/skill-composition.test.mjs tests/watch-pr/*.test.mjs` 的 57 项通过。`npm run check` 通过，检查了 70 个技能包和 833 个 Markdown 文件。

在各自隔离的合成项目中安装新旧两个方向的入口，运行真实 Codex CLI 0.172.0，使用 `--ephemeral` 和只读沙箱。请求没有点名技能；以工具执行记录核查实际读取的 `SKILL.md`，并用哈希确认样例文件无改动。

| 请求 | 实际读取与结果 |
| --- | --- |
| 用真实材料准备带字幕的进展视频，本轮只给分镜 | `dev-status-video`；给出三页、21 秒分镜、字幕、阅读时长及逐页查帧方案，注明缺失截图和成片未验证。 |
| 只写文字进展和待决事项 | `dev-status`；区分修复已实现、14 项测试通过与版本尚未部署，明确待选择的部署时间。 |
| 只检查 PR #42 当前 CI 与审查 | `dev-pr`；指出实际给定头提交、单元测试通过、浏览器检查待完成和输入焦点证据请求。 |
| 准备指定版本的预发部署演练 | `dev-deploy`；分别记录候选与恢复 digest，要求核对实际版本、健康、业务路径及回滚后复查。 |
| 用已授权样例提炼个人工作惯例 | `dev-personalize`；区分重复得到证据的偏好、待确认的 UI 验证偏好以及某次限定的表格格式要求。 |

样例覆盖触发选择和所要求的只读交付。视频请求明确只给分镜，未渲染成片；PR 证据为合成快照，未访问真实远端、创建 PR 或合并。部署样例未执行实际发布。
