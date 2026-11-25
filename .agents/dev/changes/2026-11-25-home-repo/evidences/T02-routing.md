# T02-routing 验收

状态：登记、解析、只读诊断实现及最终 Linux、Windows、macOS 26 Intel 适用验证通过。最终提交与 job 见 [T10](T10-delivery.md)。

registry/route/doctor覆盖中文空格、平级/内嵌、.git文件型worktree、别名/身份冲突、锁内双revision、有限诊断和不读内部资料。SSH真实反例促成保留未知服务器用户与absolute/home-relative语义；仅GitHub标准git用户归一已知SSH/HTTPS形式。Windows首轮观察到8.3路径与Git长名差异，产品统一fs.realpathSync.native，并补root/子目录判定，未仅放宽测试。

[第二轮Windows](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544686)在5e4e4128通过全部适用检查，route两项原失败转为通过；[Linux](https://github.com/NAMEWTA/skills-hub/actions/runs/45568945020/job/139050544568)472/472。实际Home通过安装目录工具登记/定位A/B，contextRead=false。

真实Mac首轮还发现独立registry入口静默退出：argv保留`/var`别名，ESM入口已解析为`/private/var`。Linux真实链接父目录准确复现后，五个Home CLI统一以native realpath判断直接执行；模块导入时argv缺失或不存在不执行main。新增独立复制包经`.claude/skills`目录真链接执行的help、只读JSON、错误退出码与三种导入条件回归。六组 Home 专项 68/68 通过、无 skip。合并提交 c157ee38c54d524b11eddc31603697ac45343590 的真实 macOS 最终复验已通过：481/481、0 失败、0 跳过，真实包及同仓链接通过；完整三平台结果见 [T10](T10-delivery.md)。
