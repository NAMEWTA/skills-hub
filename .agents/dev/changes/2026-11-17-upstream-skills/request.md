# 独立上游中文技能

用户要求完整收录 Archify 和 Google modern-web-guidance 中的独立技能，建立可维护的来源映射，提供中文运行包、CLI 与 TUI 安装，然后提交 PR、合并 main，并把当前源码版本 0.1.10 增加一个补丁版本至 0.1.11。上述远端交付已经获得授权。

## 实现边界

- 自有体系保留 `skills/<domain>/`；新增同级 `upstream-skills/zh-<原名>/`，允许继续适配，不把独立来源强行整合成业务领域。
- 安装器直接发现两个根，复用现有事务、预览、备份和恢复；TUI 将 upstream-skills 当作一个可整组选取的分组，也支持混选。
- 实际安装仍为 `.agents/skills/<技能名>/`；不生成 `.agents/upstream-skills/` 业务资料。
- 来源原件、中文对照和逐文件映射复用现有 materials 父子 TSV；不引入额外生成层、注册表或构建服务。
- 保留完整方法、资源和必要法律文本；实际命令、协议、指南 ID、原程序与可执行示例不随中文技能名改名。

来源和适配依据见 [source-adaptations.md](source-adaptations.md)，验证范围见 [verification.md](verification.md)。
