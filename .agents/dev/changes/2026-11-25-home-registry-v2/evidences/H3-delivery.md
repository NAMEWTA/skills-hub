# H3 验证与发布

状态：通过。实现已推送 main，完整验证与 v0.1.31 正式发布均已完成。

- 全部59个自有技能：584个文件、1044条包内链接、metadata/runtime/可达性/重复资源检查0错误。
- 持久化路径检查通过；三个受影响安装导航354/385/398非空白字符，均不超过400。
- 安装导航专项7项通过，覆盖dev单技能/全域、Home单技能/全域、Git忽略与报告可跟踪、重复安装、导航链接。
- git diff --check通过；3组task/evidence配对通过。
- 版本准备为0.1.31，package与lock一致，CHANGELOG保留既有未发布变更并加入本次内容。

本地通过GitHub插件按固定commit读取所需源码、以Git blob核对；未下载全量materials及独立upstream包。全仓check:full、statechart、真实tarball消费和上游浏览器验证已由现有CI对精确提交执行；未删改gate。任务见 [H3](../tasks/H3-delivery.md)。


## 精确提交的远端验证

提交 [8e58e53f2f3c76deec514d236a7bc4a763b2ca65](https://github.com/NAMEWTA/skills-hub/commit/8e58e53f2f3c76deec514d236a7bc4a763b2ca65) 已推送 main。独立 [Validate 45588940751](https://github.com/NAMEWTA/skills-hub/actions/runs/45588940751) 全绿；[发布工作流 45588940638](https://github.com/NAMEWTA/skills-hub/actions/runs/45588940638) 的 prepare 与三平台 validate 也全部 success，publish 也已 success。

| 平台 | Node.js | 完整测试 | 发布前验证 job |
| --- | --- | --- | --- |
| Ubuntu | 22.14.0 | 493 通过，0 失败，1 项平台跳过 | [139117781550](https://github.com/NAMEWTA/skills-hub/actions/runs/45588940638/job/139117781550) |
| Windows | 24 | 490 通过，0 失败，4 项平台跳过 | [139117781460](https://github.com/NAMEWTA/skills-hub/actions/runs/45588940638/job/139117781460) |
| macOS 26 Intel | 24 | 493 通过，0 失败，1 项平台跳过 | [139117781340](https://github.com/NAMEWTA/skills-hub/actions/runs/45588940638/job/139117781340) |

每个平台发现 494 项测试。Linux/macOS 跳过 Windows EPERM 专项；Windows 的四项为既有 POSIX 权限与 Unix socket 条件。三平台均通过 33 组捕获状态图回放、真实 0.1.31 tarball 消费验证（63 技能、1093 分发文件）。Linux 另通过已安装 Archify 的浏览器验收及 Claude Agent SDK 0.3.332 / Claude Code 2.1.332 的真实技能发现与读取：63 技能、121 资源，用户回合 0，modelInferenceVerified=false。没有把状态回放称为本轮新 TLC 求解，也没有把宿主读取称为模型推理验收。

## 正式发布

GitHub Release v0.1.31 于 2026-11-25T09:58:20Z（2026-11-25 17:58:20，Asia/Taipei）正式公开；标签、Release target 和固定验证提交一致，两个附件均 uploaded，tarball SHA-256 与发布日志一致。Issue #20 已回读为 closed/completed，14 项验收全部勾选。实际制品、摘要与发布时序见 [0.1.31 发布记录](../../../deploy/npm/releases/0.1.31.md)。
