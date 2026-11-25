# T09-distribution 验收

状态：来源、许可、材料、文档、包及最终三平台发布门禁通过；0.1.30 已正式发布。精确提交、平台结果及发布核验见 [T10](T10-delivery.md)。

nanobot memory固定557776261547ce4872a119dd094b314b8f721b1b原件、完整中文对照与MIT原文；matt chief-of-staff/handoff保留原版本/旧dev关系，仅加明确Home采用路径。研究与实际复用分开，运行包资源自包含。

包/lock/CHANGELOG均0.1.29→0.1.30，依赖图不变。正常CI实际tarball消费者核对63技能1092文件、所有相对目录链接、许可和CLI/UI依赖。维护脚本/材料/测试不入包；ClaudeSDK仅CI独立临时安装。statechart与Archify真实浏览器门禁通过，未用本地缺浏览器/缓存失败削弱CI。

最终只读发布审计确认release.yml按合并提交固定SHA验证和发布，无需提前给PR head打标签。releaseNotes安装页脚已补Home/开发两种精确版本命令、单一本体与Claude目录链接，以及四个领域资料路径；实际生成0.1.30说明并核对输出，未改上传、完整性、标签或批准机制。

正式发布 run `45574387211` 固定合并提交 `c157ee38c54d524b11eddc31603697ac45343590`，三平台与 publish 全部成功。Linux、macOS 26 Intel 各 481/481，Windows 477/481 加 4 平台不适用跳过，三平台各 33 回放、63 技能/1092 文件真实包通过。发布器严格核验 npm 精确版本的 name/version/SRI 后，于 `2026-11-25T08:25:56Z` 公开 [v0.1.30 Release](https://github.com/NAMEWTA/skills-hub/releases/tag/v0.1.30)，ID `457828372`，标签指向相同合并 SHA。公开附件与本地同源重打包摘要一致。网页取证通道未另存 npm raw metadata、dist.tarball 或 npm latest 的实际值，完整证据与边界见 [正式发布回执](../../../deploy/npm/releases/0.1.30.md)。
