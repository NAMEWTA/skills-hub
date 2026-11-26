# 文档、提交与补丁发布验收

状态：实现已提交 main；首次跨平台 CI 发现 macOS 测试夹具路径问题，正在修复后重验，尚未发布。对应 [任务](../tasks/08-delivery.md)。

版本从 `0.1.35` 增至 `0.1.36`，package 与 lock 一致。README、安装说明、领域持久化、知识规范、Home overview/method-ownership/validation/sources、CHANGELOG 与第三方声明已同步。来源为方法研究，没有新增第三方运行代码或复制外部 persona 正文。

发布使用既有 Release 工作流；不提前移动或创建版本标签，不跳过三平台验证。上传后按 release.md 回读 npm 公开版本、完整性、标签指向与两个 Release 附件。精确结果将保存 `.agents/dev/deploy/npm/releases/0.1.36.md`，并在本报告关联。

## 首次提交和发布门禁

实现提交 [212f7f21e09ab2b354ebd3fd24b629d57a6fde0e](https://github.com/NAMEWTA/skills-hub/commit/212f7f21e09ab2b354ebd3fd24b629d57a6fde0e)，tree `131a1be6465857c96355ad9c86e3fc460fceee82`，通过 expected_sha 的正常快进推送 main，并回读确认；本地精确 Git 对象散列与远端一致。

[Release 45802799825](https://github.com/NAMEWTA/skills-hub/actions/runs/45802799825) 的 Linux、Windows 全部通过。Linux 的完整测试为 530 通过、0 失败、1 个 Windows 专项跳过；实际 npm 消费端安装验证 64 技能、1105 分发文件，Archify 真实 browser-check 通过。官方 Claude Code `2.1.332`、SDK `0.3.332` 实际发现 64 技能并读取 123 个资源，`userTurnsSent=0`、`modelInferenceVerified=false`，不计作 M06。

macOS 的 `tests/home-doctor.test.mjs` 不可读入口测试失败：测试 mock 比较未经解析的临时文件路径，doctor 按合同先 realpath 根；macOS 临时路径父级别名使 EACCES 没有被注入。实际结果因此是 clear-within-scope，而非预期 issues。publish 因门禁失败跳过，没有执行 npm 上传或创建 Release。独立 Validate 的同一 macOS 项也失败；不以 Linux 通过替代此平台。

后续只修复测试目标的真实路径和注入命中断言，保留所有行为断言和平台检查；不修改正确的产品路径解析。版本保持未发布的 `0.1.36`，按既有 `Release-Retry: 0.1.36` 契约由修复提交重新验证、发布。初次提交的最终本地 pack 为 6533144 字节，SHA-256 `25564084894e6232e52e70c14d15e6cc57f8fe5ddd92e53023eefda8a6dc7fe6`；非分发测试/证据修复不应改变产品包，后续实际核对。

独立 CLI M06 见 [T7](07-validation.md)。该项尚未通过，因此本次提交引用 Issue #21 而不使用自动关闭语句；版本发布成功也不直接构成整项 Issue 完成。
