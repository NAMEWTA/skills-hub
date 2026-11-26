# 必读入口诊断验收

状态：实现与专项验证完成。对应 [任务](../tasks/05-doctor.md)。

## 实施结果

`home-doctor/scripts/doctor.mjs` 增加必读主入口检查。已有 `.agents/home/` 或同仓真实 `home-*/SKILL.md` 的目录缺少 `AGENTS.md` 时返回 `HOME_ENTRY_MISSING`，不再报告无问题。相似空目录名、仅安装其他 domain 和未建立 Home 的外部目录不会触发该错误。

必读入口的空白、非普通文件/符号链接、实际读取失败、基础区缺半边/重复/嵌套/非独占行、未知版本和空基础区分别返回具体 findings。标记规则与安装器对齐：精确 v1/end、独占行、LF/CRLF 和文件开头 BOM；裸名称的普通正文不误判。已知旧模板按固定 SHA-256 识别，提示迁移而不改原件；未标记自定义入口交 `home-knowledge` 核对。

AGENTS/SOUL 的实际相对链接归知识方法；配置引用归 setup。缺文件、精确旧模板和合法标记内空白交安装方法；空文件或损坏标记先交知识方法核对版本、保留内容并整理明确边界，再由安装器填充。未知版本保留并核对匹配工具，不降级。入口读取失败直接进入最小诊断，不强制先安装其他 owner。合法的可选 profile、SOUL、登记和历史缺省不报故障。诊断全过程只读，不沿异常入口读取外部正文。

## 验证

2026-11-26 在固定基线 `f23ba949826c4b6cac480280ff306cdd28681f39` 的本次工作树运行：

```sh
node --test tests/home-doctor.test.mjs tests/home-cli-entry.test.mjs
```

结果：22 通过、0 失败、0 跳过，其中 doctor 14 项，CLI 入口/链接与导入 8 项。原始输出保存到 `temp/dev/home-entry-knowledge/doctor-cli-tests.log`。

覆盖实际回归：

- 空 Home domain 缺入口与只装单个 Home 技能缺入口都返回错误，并保持文件系统零写入。
- 外部空目录、未选 domain、只是类似名称的目录、合法可选资料缺省保持正常。
- 旧模板与未标记用户内容分开路由，原始字节保留。
- 空文件、空/注释基础区、标记损坏、重复、嵌套、顺序错误、非独占行及未知版本不能报告健康；LF/CRLF/BOM 正常。
- EACCES 读取异常通过确定性文件调用注入复现；目录和真实文件 symlink 均拒绝，未遍历其内容。
- 主入口的真实相对链接从入口文件所在目录解析，损坏时交知识 owner；大纲例子和外部项目正文继续不被扫描。
- 安装目录中直接运行 doctor 遇缺入口退出 1 并返回 JSON findings；把真实安装模板放入同一隔离 Home 后，经相同目录链接运行退出 0、findings 为空。其他 Home CLI 的 help/只读/非法参数及正常 import 行为保持。

`git diff --check` 和自有技能入口预算检查通过。

独立审查指出，空文件与损坏标记会被安装器报 `HOME_ENTRY_CONFLICT`，直接重装不能恢复。已修正这两类 finding 的 owner 为 `home-knowledge`，同步 SKILL/诊断方法，并对每类异常的 owner 和未知版本不降级要求增加断言。复验 `node --test tests/home-doctor.test.mjs`：14 通过、0 失败、0 跳过；原始输出为 `temp/dev/home-entry-knowledge/doctor-review-tests.log`。

## 验证边界

本轮为当前 Linux/Node 环境的确定性工具验证。读取异常使用明确标记的 EACCES 注入，真实 symlink 已执行；不外推为所有平台权限状态。诊断结果只证明文件、标记和显式链接的结构，不证明知识真伪、项目功能、真实 CLI 自动发现或模型已读取。最终整合、真实宿主闭环和发布结果由对应任务报告。
