# T09-distribution 验收

状态：来源、许可、材料映射、文档与本地实际包检查通过；远端平台门禁待执行。

新增nanobot memory固定557776261547ce4872a119dd094b314b8f721b1b原件、完整中文对照及MIT原文；只采用明确记忆/历史方法。matt chief-of-staff及handoff保持原版本和既有dev关系，追加Home实际使用路径。研究资料和实际采用分开见docs/home/sources.md。

包0.1.29→0.1.30，package/lock/CHANGELOG一致。实际tarball安装验证63技能1092文件、所有相对目录链接、许可字节和CLI/UI依赖解析；无维护脚本/材料/测试混入发布包。npm run check:statechart通过。check:upstream本地Chromium包装器存在但二进制缺失，未算browser-check通过；CI继续执行完整浏览器门禁。
