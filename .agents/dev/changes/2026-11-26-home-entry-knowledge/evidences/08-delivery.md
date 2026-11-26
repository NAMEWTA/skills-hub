# 文档、提交与补丁发布验收

状态：实现、文档、main 提交及 v0.1.36 公开发布完成；Issue 关闭条件仍缺 M06，保留 open。对应 [任务](../tasks/08-delivery.md)。

版本从 `0.1.35` 增至 `0.1.36`，package 与 lock 一致。README、安装说明、领域持久化、知识规范、Home overview/method-ownership/validation/sources、CHANGELOG 与第三方声明已同步。来源为方法研究，没有新增第三方运行代码或复制外部 persona 正文。

发布使用既有 Release 工作流，并完成三平台验证、npm 公开版本完整性、标签指向与两个 Release 附件核对。精确结果见 [v0.1.36 发布记录](../../../deploy/npm/releases/0.1.36.md)。

## 首次提交和发布门禁

实现提交 [212f7f21e09ab2b354ebd3fd24b629d57a6fde0e](https://github.com/NAMEWTA/skills-hub/commit/212f7f21e09ab2b354ebd3fd24b629d57a6fde0e)，tree `131a1be6465857c96355ad9c86e3fc460fceee82`，通过 expected_sha 的正常快进推送 main，并回读确认；本地精确 Git 对象散列与远端一致。

[Release 45802799825](https://github.com/NAMEWTA/skills-hub/actions/runs/45802799825) 的 Linux、Windows 全部通过。Linux 的完整测试为 530 通过、0 失败、1 个 Windows 专项跳过；实际 npm 消费端安装验证 64 技能、1105 分发文件，Archify 真实 browser-check 通过。官方 Claude Code `2.1.332`、SDK `0.3.332` 实际发现 64 技能并读取 123 个资源，`userTurnsSent=0`、`modelInferenceVerified=false`，不计作 M06。

macOS 的 `tests/home-doctor.test.mjs` 不可读入口测试失败：测试 mock 比较未经解析的临时文件路径，doctor 按合同先 realpath 根；macOS 临时路径父级别名使 EACCES 没有被注入。实际结果因此是 clear-within-scope，而非预期 issues。publish 因门禁失败跳过，没有执行 npm 上传或创建 Release。独立 Validate 的同一 macOS 项也失败；不以 Linux 通过替代此平台。

后续只修复测试目标的真实路径和注入命中断言，保留所有行为断言和平台检查；不修改正确的产品路径解析。版本保持未发布的 `0.1.36`，按既有 `Release-Retry: 0.1.36` 契约由修复提交重新验证、发布。初次提交的最终本地 pack 为 6533144 字节，SHA-256 `25564084894e6232e52e70c14d15e6cc57f8fe5ddd92e53023eefda8a6dc7fe6`；非分发测试/证据修复不应改变产品包，后续实际核对。

修复提交为 [a60fc67af1193fa997c1d03079409520e7303061](https://github.com/NAMEWTA/skills-hub/commit/a60fc67af1193fa997c1d03079409520e7303061)，本机 doctor/CLI 专项 22/22 通过。其提交说明把 `Refs #21` 与 Release-Retry 连在同一末段，Git 没有将该段识别为 trailers；[运行 45803618486](https://github.com/NAMEWTA/skills-hub/actions/runs/45803618486) 仅 prepare 成功，validate/publish 跳过，不能称为已发布。随后使用与正文以空行分隔的独立 `Release-Retry: 0.1.36` 末段；提交前已通过 `git interpret-trailers --parse` 确认精确返回该 trailer。GitHub 回读仍无 v0.1.36 Release，未重复上传已有包。

实际发布提交为 [cfdcc3f8767c2b1d9fb79ddd40f28a7efb84a90c](https://github.com/NAMEWTA/skills-hub/commit/cfdcc3f8767c2b1d9fb79ddd40f28a7efb84a90c)。[Release 45803876873](https://github.com/NAMEWTA/skills-hub/actions/runs/45803876873) 的三平台 gate 与 publish 全部成功；[Validate 45803876770](https://github.com/NAMEWTA/skills-hub/actions/runs/45803876770) 同 SHA 完整成功。实际重打包与上述 SHA-256、6533144 字节及完整 SHA-512 一致，说明非分发的测试和证据修正没有改变产品包。

## 最终公开结果与 Issue 状态

2026-11-26 18:53:14（Asia/Taipei）Release 正式公开。回读 v0.1.36 标签精确指向 cfdcc3f；Release 非草稿、非预发布，GitHub latest 为本版；tarball 与 SHA256SUMS 两附件均 uploaded，服务端摘要与本机计算相符。发布 job 只有公开 npm 包名、版本和完整 SRI 核对成功后才到达已发布分支；没有把上传命令返回或工作流 prepare 成功视作发布完成。

已将实施、验证、实际发布和独立 CLI 阻塞分别更新到 [Issue #21](https://github.com/NAMEWTA/skills-hub/issues/21) 的状态记录。保留原验收条件，M06 不勾选；用户要求“完成了就 close”，该前提尚未满足，因此不关闭，也不生成整个 Change 的完成 evidence.md。

独立 CLI M06 见 [T7](07-validation.md)。该项尚未通过，因此本次提交引用 Issue #21 而不使用自动关闭语句；版本发布成功也不直接构成整项 Issue 完成。
