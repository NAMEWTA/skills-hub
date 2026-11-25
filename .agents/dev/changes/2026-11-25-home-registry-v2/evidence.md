# Home 登记 v2 最终验收

状态：通过。实现、main 推送、三平台完整验证及 v0.1.31 正式发布均已完成。

## 范围与依据

按 [Issue #20 Plan 快照](source/github-NAMEWTA-skills-hub-20/issue.md) 实施；[原始需求](source/github-NAMEWTA-skills-hub-20/issue-original.md) 保留重写前正文。源码提交为 [8e58e53f2f3c76deec514d236a7bc4a763b2ca65](https://github.com/NAMEWTA/skills-hub/commit/8e58e53f2f3c76deec514d236a7bc4a763b2ca65)，在基线 f7285ab799f76700b36c54293b84c9a0013c3ec9 上修改 88 个文件，没有删除其他远端文件。

## 逐项验收

| 验收要求 | 实际结果与依据 |
| --- | --- |
| 多 remote 的名称及地址完整保留 | v2 remotes 保存名称、有序 urls 和显式 pushUrls；真实 Git roundtrip 通过。 |
| 多 URL 与主身份语义 | 首 fetch URL 决定主身份；其他 URL 与 push 不替代。Git 空配置重置、URL 顺序均有行为覆盖。 |
| fork 与缺失主 remote | 命中 mirror/upstream 不能代替错误主 remote；缺失主 remote 返回冲突。 |
| 无 origin 和本地仓库 | 多 remote 无 origin 时不任意建议；明确 primaryRemote 才可登记；真正本地仓库支持空 remotes/null 主项。 |
| 附加 remote 漂移 | 返回 remoteDrift/registryMatches；主身份可定位与登记同步分别表达。 |
| v1 兼容 | 读取、路由、诊断不迁移旧数据；独立场景核对查询后原字节未变。新保存必须实际 inspect 后形成 v2。 |
| 路径 | 保存 ./ 或 ../；拒绝共享绝对与盘符相对路径；local.json 与 --checkout 优先序不变。 |
| 无地图正常 | repos.json 是正常读写入口；doctor 不再因缺 repos.md 报错。 |
| 保存与地图解耦 | save 只写登记；独立场景核对手写地图字节不变，地图符号链接或不可读也不阻塞登记。 |
| 按需地图 | map 默认 stdout 零写入；显式 --write 导出；中文、空格、括号目录链接从 .agents/home 正确换算并解码核实。 |
| 并发与保护 | 保留登记 revision、显式导出双 revision、排他锁、手写文件保护和恢复边界；不宣称 OS 级 CAS。 |
| 既有 Home 与安装行为 | 完整仓库 CI、真实 tarball 消费、Home CLI 链接入口及知识/历史/关系回归通过。 |
| 说明与导航一致 | 三个 Home owner、schema、导航和领域规范同步；所有 59 个自有技能结构及 1044 包内链接检查通过。 |
| main 与补丁发布 | v0.1.31 已正式公开，标签与验证源码一致；Issue #20 已 completed，14 项验收全部勾选。 |

独立复核还发现并修复 insteadOf 身份绕行：保留原始配置，同时核对 Git 展开的实际首 fetch URL；不同仓库身份拒绝，已知 GitHub HTTPS/SSH 等价身份允许，含凭据的展开 URL 拒绝且不泄露。没有验证网络重定向或 SSH 服务端映射。

## 测试与边界

本地核心 Home 四组回归 42 项通过（registry 11、route 16、doctor 8、CLI entry 7）；另有知识/历史回归和独立真实 Git 场景，详见 [H2](evidences/H2-implementation.md)。全部 59 个自有技能的 metadata、运行包、资源可达性、重复检查及预算通过。固定源码的远端三平台完整门禁、状态回放、真实 tarball 和 Linux 专项见 [H3](evidences/H3-delivery.md)。

Linux/macOS：494 项中 493 通过、0 失败、1 项 Windows 专属跳过；Windows：490 通过、0 失败、4 项 POSIX/Unix 条件跳过。三平台各有 33 组捕获状态图回放通过、实际包 63 技能/1093 文件通过。Linux Claude Code 验证为发现与读取，未发送模型回合。

功能在隔离 Git 仓库和 CI 中验证；未替用户迁移任何真实 Home 登记，也未批量移动历史业务资料。

## 发布与收尾

[正式 Release](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.31) 于 2026-11-25 17:58:20（Asia/Taipei）公开。[发布回执](../../deploy/npm/releases/0.1.31.md) 保存精确提交、三平台 gate、制品身份和 npm 异步公开时序。当前 Issue 的完成状态与原文已回读保存在 source；本报告及发布回执在发布成功后追加到 main，不改变版本、包或标签。
