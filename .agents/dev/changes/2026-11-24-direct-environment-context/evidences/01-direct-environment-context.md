# 01 修正环境引用并发布验收

状态：通过，main 推送与 `v0.1.29` 正式发布均完成。

## 范围与旧版事实

上一版本确实仍有环境与资源转介，不归因于用户缓存。修改 19 个 dev 技能的 48 个 Markdown 文件，覆盖入口、参考方法、帮助、委派和交接模板。没有新增或删除运行资源。现行环境、工作流、交接、来源接入及持久化指南同步修正；环境评估方法自身保留发现元数据与完整容量算法。

以 main `5a8a5cb2f0ae3d52b6d41555c07f2dd9bd8e4f07` 的 Git tree 核对本地修改前的全部 400 个 dev 文件，Git blob SHA 全部一致。pstack、mattpocock-skills、speculo 的适配说明分别更新 20、5、2 行，来源身份、正文摘要和已复核对象不前移。

## 本地检查

- 使用既有导出校验函数检查完整已物化 dev 域：36 个技能、309 个 Markdown、738 个包内链接，元数据、入口预算、运行内容、资源可达性和重复方法均通过。
- 入口预算及领域持久化检查通过。既有 `persistence-roots.test.mjs` 与 `skill-composition.test.mjs` 共 7 项通过，无失败或跳过。
- 扫描其他 35 个技能的全部 393 个文件，`dev-setup` 零匹配。自身仅名称与 UI 默认提示保留技能标识。

## 实际安装与升级

使用真实 `install.mjs install --domain dev` 在两个隔离项目执行新安装，以及先安装上一版内容再更新。两者最终都是 36 个技能、400 个文件，逐包树摘要与当前来源一致，其他技能零引用。

升级实际替换 19 个包并保留备份，再次安装 36 包全部 unchanged。新安装没有创建 `environment.md` 或 team 目录；升级保留预先写入的用户环境记录。安装器未修改。原始结果与命令输出留在 `temp/dev/2026-11-24-direct-environment-context/integration/installed-u3D9Ss/`。

## 独立行为复核

独立审查者逐项审阅 48 份差异，未发现强制建档、隐含初始化、扩大未知容量、丢失独立覆盖或削弱清理条件的缺陷。

另一独立会话只接收技能和场景：没有环境文件，需要独立调查四个模块，工具最多三个子代理、已有其他任务占用一个，主机与共享池只允许新增一个只读会话。结果按一个名额分四批，使用实际观测，不创建环境文件或要求初始化，不停止其他任务，确认退出释放后补位，保留四模块独立覆盖与动态验证限制。仅核对执行安排，没有实际启动四项业务调查。

## 固定提交的完整 CI

实现与版本提交为 [`64eb5c4997251e19e8cdd2f9b9804bdf81b0fb96`](https://github.com/NAMEWTA/skills-hub/commit/64eb5c4997251e19e8cdd2f9b9804bdf81b0fb96)，已推送 main。其[独立验证流水线](https://github.com/NAMEWTA/skills-hub/actions/runs/45341215734)及[发布流水线](https://github.com/NAMEWTA/skills-hub/actions/runs/45341215728)的 Ubuntu Node 22.14.0、Windows Node 24、macOS Node 24 验证任务全部成功。

Linux 发布验证日志核实 55 个技能、738 个 Markdown、1406 个本地链接，384 项测试通过、0 失败、0 跳过，33 项捕获状态图回放完成。真实 `@namewta/skills-hub@0.1.29` tarball 含 55 个技能、1045 个分发文件，消费者安装、命令入口、完整资源逐字节核对、许可与重复安装全部通过；已安装 Archify 的实际浏览器检查通过。

当前本地只物化 dev 域与必要维护文件，完整仓库与真实 npm tarball 的上述结论来自本次固定提交的现有 CI。

## 正式发布

[发布流水线](https://github.com/NAMEWTA/skills-hub/actions/runs/45341215728)成功。发布器只上传一次，在公开 npm metadata 的包名、版本和 SHA-512 完整性与本次 tarball 相符后，公开 [v0.1.29 Release](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.29)。公开时间为 2026-11-24 14:42:10（Asia/Taipei）。

GitHub API 回读标签 `refs/tags/v0.1.29` 直接指向实现与版本提交 `64eb5c4997251e19e8cdd2f9b9804bdf81b0fb96`，Release 为正式公开状态，非 draft、非 prerelease。两个附件均已上传：`namewta-skills-hub-0.1.29.tgz` 为 6380482 字节，`SHA256SUMS` 为 96 字节。包的服务端 SHA-256 与发布日志计算值一致：`a05baf5ae1ee1ee8568ef48aa9ea39a84709b4c057c4bc418c217cd80b039dbb`。

完整元数据见[发布记录](../../../deploy/npm/releases/0.1.29.md)。当前仓库与分发已更新；用户其他项目的已安装技能需从对应项目运行本版本安装命令，安装结果不从发布动作本身推断。
