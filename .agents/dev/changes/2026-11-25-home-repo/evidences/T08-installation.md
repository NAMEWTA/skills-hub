# T08-installation 验收

状态：Linux/Windows安装事务与真实包、实际Claude发现读取通过；macOS仍等CI。

单一本体+逐技能目录symlink覆盖混选、unchanged补链、正确/错向断链、父目录/本体保护、锁后重算、更新备份、注入失败回滚、搬迁及dry-run零写入。local.json默认忽略保留用户否定规则，rollback重查替换路径。

[Windows5e4e4128](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544686)真实dir symlink及0.1.30正常tarball63技能1092文件通过；472测试中468通过/0失败/4平台不适用skip（3POSIX位及Unix socket）。[Linux同提交](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544568)472/472，无skip，实际包与浏览器通过。官方SDK0.3.332实际Claude2.1.332发现63技能并readFile读取121资源；requested=.claude/effective=.agents，零用户回合，未声称模型执行。
