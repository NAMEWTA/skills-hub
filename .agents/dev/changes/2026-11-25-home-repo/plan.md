# Home Repo 实施

唯一行为契约：[Issue #2](https://github.com/NAMEWTA/skills-hub/issues/2)，updated_at=2026-11-25T05:53:23Z。基准 main=f782755b780646e09ae3fcb56598d89df090eb98，包0.1.29。GitHub返回完整树5767项、4506个文件，逐文件Git blob和树已核对。复用既有未提交草稿并在独立分支整合，保留原工作目录。

## 分工

安装器一个写入负责人；setup/route/doctor及协作方法一个负责人；knowledge/history一个负责人。主负责人整合来源、文档、验收和发布。技能源码与模板不改dev/ops/system，材料仅追加Home采用关系。

## 顺序

T01 → T02/T05/T08并行；T03跟随T02；T04依赖T02/T03；T06沿用T03/T05 owner；T07依赖T02/T04；T09在包合同稳定后完成；T10汇总实际结果。

- [T01-contract 锁定Issue #2和基准、八技能owner与来源](tasks/T01-contract.md)
- [T02-routing 实现Home登记、地图与真实checkout解析](tasks/T02-routing.md)
- [T03-configuration 完成用户配置、范围和环境事实方法](tasks/T03-configuration.md)
- [T04-delegation 完成workflow/doctor与真实分层协作验收](tasks/T04-delegation.md)
- [T05-knowledge 完成知识、候选、更正、退役与忘记](tasks/T05-knowledge.md)
- [T06-history 完成事件去重、时间查询与接续](tasks/T06-history.md)
- [T07-integration 完成关系取证与两项目联合验证](tasks/T07-integration.md)
- [T08-installation 完成逐技能同仓symlink安装事务](tasks/T08-installation.md)
- [T09-distribution 完成包分发、材料许可与使用文档](tasks/T09-distribution.md)
- [T10-delivery 执行最终检查、PR、合并与补丁发布](tasks/T10-delivery.md)

## 验证边界

自动测试、受控场景、真实Agent/CLI、Claude发现与平台CI分别记录。当前shell直连GitHub被环境网络策略拒绝，使用已授权GitHub连接器读写，不申请更高网络权限。依赖可从已有完整npm缓存按锁文件正常离线安装。

## 基线跟进

实施期间main合入2988ae4ad6390b5c9fa53039666284070b33e697（PR #16，会话复用）。已逐文件核对13处更改、重建并核对签名提交与Git树，快进本地基线并保留Home改动；不将其他任务的dev变更计入本PR。发布版本由0.1.29递增至0.1.30。
