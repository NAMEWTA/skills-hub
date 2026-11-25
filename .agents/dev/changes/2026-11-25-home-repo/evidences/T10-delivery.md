# T10-delivery 验收

状态：实施、独立审查和必要真实组合验收已完成；最终三平台CI、merge和公开发布待完成。PR为[草稿#17](https://github.com/NAMEWTA/skills-hub/pull/17)，用户已授权合并main、关闭Issue/PR与补丁发布，无额外审批环节。

## 已取得结果

- 5e4e4128465ef93e8d0ccd6cfa9537b4a552068a的[Linux](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544568)：472/472，无skip；正常实际包63技能1092文件、状态图回放、Archify真实浏览器、官方Claude2.1.332发现63技能并读121资源全部通过。
- 同提交[Windows](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544686)：472测试中468通过、0失败、4平台不适用skip；真实目录symlink及完整正常tarball通过。首轮8.3路径问题已在产品native realpath修复后复验。
- 原生Home→A/B→真实实现子Agent；A负责人58项独立通过，B真实HTTP组合34项通过；项目内部随机知识查询由A实际检索。
- Home运营110步/22项有效结果检查；全新Agent不继承答案，实际35条命令准确重建当前与历史/候选/忘记边界；Home与A两个running实例真实interrupt后同id按本地checkpoint接续，无重复实现或派遣。
- 来源/许可、未改变其他领域、单包闭包和入口预算已检查。完整[A01–A66矩阵](../acceptance.md)保留条件分支与未宣称的运行范围，[真实原件摘要](../runtime-evidence.md)提供身份、提交、哈希与路径。

## 最终平台与交付点

macos-latest的Arm64任务及既有main任务曾持续排队。本次核对官方runner清单后，将完整macOS门禁固定到标准macos-26-intel/Node24，未删检查或改成mock。d56bb84b51eed021852da46aedaa04800902fdaa的[Linux/Windows CI](https://github.com/NAMEWTA/skills-hub/actions/runs/45571553517)完整通过，但较早Mac任务恢复后发现2项安装夹具路径假设与1项CLI入口缺陷。随后已修五个Home CLI的真链接直接执行判断，以及两项测试的真实路径比较/故障注入；专项Home68/68、安装73/73通过，无skip，旧fixture反例得到准确复现。详见runtime-evidence的Mac回归章节。最终修复提交仍须通过三平台CI，不能用此前Linux/Windows或本地反例替代；最终实际结果在交付回执绑定准确SHA。

包与锁文件由0.1.29递增至0.1.30。合并后使用仓库既有release.yml从固定提交验证、上传、核对公开npm完整性并发布GitHub Release。现在尚未merge或发布；完整外部结果最终归Change根evidence.md与.agents/dev/deploy/npm/releases/0.1.30.md，不提前生成成功回执。

本地工作区中隔离fixture的临时输入含用于归属目标的相对链接，工作区递归检查会把它们当源码而失败；未改门禁或删原始证据。最终使用现有node scripts/check.mjs --staged核对真实发布快照并通过，CI从干净精确提交执行完整检查。运行原件保留temp/dev/home-issue-2/。
