# 历史简化模式

这些示例用于校准无法由未使用符号搜索确立价值的候选项。它们描述已记录决定，不是当前删除机会。归档来源是冻结快照：只读被引笔记本身，不跟随或修复其出站链接。应用模式前，验证当前负责者及已发布数据义务。

## 要求完整生效路径

声明、序列化分支与测试可能构成看似可信的支持，却没有真正生效的功能。追踪两端：必须有东西产生该值，也必须有实现遵守它。[无生产者变体决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-07-04-prune-producerless-vocabulary-variants.md)删除没有发出者的保留联合成员及缓存提示。[无效请求调节项决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-07-04-drop-inert-request-knobs.md)区分了每个适配器都拒绝的调节项，和可供钩子使用的有效请求字段。删除包含声明、转发、仅拒绝测试及生成文档。

没有固定调用者，比不可达的证据弱。[技能注册拒绝决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/rejected/simplification/2026-07-12-prune-unused-skill-registry-api.md)保留有意设计的第三方注册路径。对已入目录的服务，宣称无用前先检查泛用插件调用及返回值。有效扩展点与任何提供者都无法遵守的字段，需要不同结论。

## 在消费者决策处减少区别

把每个公开变体映射到它支持的消费者动作。[已归档模型 agent 可用性决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-09-15-model-agent-availability-and-team-targets.md)给模型一个可用 Team 目标，把多种驻留状态投影成同一可用性，内部路由仍保留 Session 身份与驻留状态。[能力中立沙箱上下文](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-07-31-capability-neutral-sandbox-policy-context.md)用真实的条件策略措辞替换两个近似能力注册表；准确工具可用性仍在工具模式中。收益包括注册方法、释放状态、失效及组合测试。

不要仅因某渲染器忽略区别，就抹掉不同的持久事实。[持久步骤边界拒绝决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/rejected/simplification/2026-06-20-drop-durable-step-boundaries.md)保留空失败步骤、崩溃修复和检查需要的显式开始与完成事实。底层区别仍必要时，只简化投影。

## 用更小的明确承诺换掉泛用行为

已使用的功能仍可能是满足必需结果的昂贵方式。[固定速率 Schedule 决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-08-09-bounded-fixed-rate-schedule.md)放弃日历重复及错过执行的回放，删除解析器、求值器、跨记录门禁、持久变体及积压状态。[非事务 Loader 决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/implemented/simplification/2026-09-09-nontransactional-loader.md)放弃自动插件回滚，保留失败报告与消费者负责的激活检查。把通用回滚移到另一包，成本仍在。

像说明删除一样清楚地说明损失。[中断 turn 截断拒绝决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/rejected/simplification/2026-06-20-truncate-interrupted-turns.md)拒绝更简单的恢复算法，因为未完成 turn 可能含大量真实工作。仅方便、联合更小或测试更少，不足以证明丢失必需数据或行为合理。调查可以提出取舍，但不暗示获准实施。

## 在消费操作处明确假设

寻找已衍生共享存储、同步或确认机制的局部默认值。[显式 Schedule 时区决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/implemented/simplification/2026-08-09-explicit-schedule-time-zone.md)把浏览器事实留在原始请求，在调度操作要求显式时区，删除 Session 默认及跨标签冲突状态。[已归档注入内容决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-07-20-unwrap-injected-content-envelopes.md)让调用者负责封装，删除穿过无关层的信封控制。二者减少必须解释同一假设的负责者数量。

不要把要求挪到必须执行它的位置之后。[已归档仅 Host 的 Remote 输入验证决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-09-15-host-only-remote-input-validation.md)删除重复 Client 模式执行，但保留查找及业务调用前的 Host 验证，以及本地参数数量与 Context 绑定检查。已记录代价是畸形输入更晚失败，并失去 Client 解析意外提供的脱敏作用。

## 使用时推导，或复用已有投递负责者

每个缓存或事件订阅都问：消费者何时需要该值，是否已有权威来源保留它。[反馈遥测](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-08-06-buffer-free-feedback-telemetry.md)在反馈时读取规范 Session 前缀，删除持续复制的反馈前缓冲区及监听器。[已归档 Workspace 最近性](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-09-10-derived-workspace-recency.md)排序当前概要，不持久化提升历史；手工排序仍为独立用户状态。[已归档 Web 子 agent 投影](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-09-08-web-subagent-catalog-projections.md)复用共享流与投影存储，删除功能通知、重复读取及第二份成员缓存。

时机承诺决定是否可行。反馈时脱敏不同于捕获时脱敏；手工位置不能从活动时间戳推导；流基线缺失时，初始历史读取可能仍必要。指出这些残余义务，不要宣称所有缓存冗余。

## 删除意外的组合负责者

信任 demo、support 或 example 等名称前，检查实际启动及解析路径。[共享基础配置决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-07-29-shared-base-config-overlays.md)删除重复组合及透传设置；实际 Loader 行为决定叠加层位置。[负责者本地配置档与指南决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-08-24-owner-local-profile-tests-and-guides.md)把测试、指南及交付素材交回负责者，删除仅用于解析的工作区。[合并子 agent 服务决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-07-26-merge-subagent-control-service.md)使用显式部署策略，而非从提供者或同级工具存在推断，同时内部保留可选依赖。

包数量更少不够。不同调用者意图可能有不同归属及完成时机；保留的 Service Definition 可能服务独立提供者。证明替代方案的真实组合与依赖行为，核算剩余所有配置及生命周期胶合。

## 用被拒实验检验等价主张

[SSE 解析器替换](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/archived/simplification/2026-07-26-eventsource-parser-for-deepseek-sse.md)删除通用分帧及一致性测试，保留提供者专用终止兼容层，并记录更严格的截断尾部行为。相反，[timer-promises 拒绝决定](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/rejected/simplification/2026-07-26-builtin-timer-promises-for-hand-rolled-sleeps.md)记录名义等价的内置实现，为了少量删除却破坏确定性假时钟测试。[依赖替换审计](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/.agents/notes/rejected/simplification/2026-07-26-dependency-swaps-rejected-by-nih-audit.md)区分可替换泛用代码，与库未实现的配置上限、安全规则、生命周期责任及部署行为。

过去的拒绝是有限范围的证伪，不是永久包黑名单。只有出现解决失败前提的新证据才重访，并一起衡量实现、胶合、测试、依赖与受支持行为。
