# 审查标准

## 概要

按读者是否能完成一个结果来审查文档，而非按是否存在每个模板标题。对照代码和测试验证文字，保留准确约定，让包 README 对消费者有用，同时为维护者暴露足够实现细节。运行当前仓库门禁；`session-persistence-jsonl` 的 README 双语对是格式参考示例。

## 目录

- [新读者检验](#新读者检验)
- [证据审查](#证据审查)
- [包 README 审查](#包-readme-审查)
- [参考示例](#参考示例)
- [验证](#验证)
- [开发笔记](#开发笔记)

## 新读者检验

没有仓库背景的专业工程师，阅读三到五份相互链接的页面后，应能回答：产品或功能做什么、如何安全运行或使用、状态在哪里、由哪个组件负责、如何失败、去哪里修改。读者必须看源码才能发现公开流程时，补回缺失解释；必须吸收无关内部细节时，把细节下移。

## 证据审查

每个重要陈述都对照最有力的负责来源。名称及入口看包元数据，API 约定看公开类型及 JSDoc，行为看运行代码，已执行失败路径看测试，穷尽清单看生成目录，理由看活动 Agent Notes。绝不将旧 README、讨论或报告视为强于当前代码和测试的证据。

每项操作主张——CLI 命令、配置片段、默认值、错误消息、平台差异——证据都是实际运行，不是阅读。页面陈述行为之前，要在当前检出上执行准确命令或挂载准确配置；只引用观察到的输出、警告和失败。依赖不可用密钥或网络的主张应指明验证负责者，不断言行为。已有页面与最新 `origin/master` 比较，依据代码重新验证过时陈述。

审查安装指导前先分类包：`package.json` 有 `dsh.bundle.patch` 是功能包（可用 `dsh plugin --profile <name> add <package>` 安装，这是该命令唯一会激活为层的形态）；导出 `apply` 或默认服务是插件（挂载为 `cordis.yml` 行）；普通模块 API 是库（没有安装路径的依赖）。拒绝为其他形态编写的安装指导。

只有帮助目标读者行动、推理或避免误用的陈述才保留。理由、历史、测试讲解、重复目录及无关包细节移到各自负责处。

## 包 README 审查

要求下列内容，但不强迫统一的内部标题集合：

- 可搜索的 YAML 元数据，包含准确 `description` 和机械推导的 `kind`（`package-group`、`package-reference`、`package-library` 或 `package-bundle`）；
- 英文 Summary 三到五句话，按 `wc -w` 方式计数最多 100 词，说明主题为用户或 agent 读者做什么，并附带链接的目录；
- 受控英语，主体明确、术语稳定、动词直接、指令与条件分开、约束强度不变；
- 何时选择或避开此包；
- 存在时给出最小安全配置或使用路径：功能包是已验证的 `dsh plugin` 安装路径；库是消费者入口；绝不给不接受该方式的形态写配置档安装指导；
- 与消费者有关的可观察行为、失败、持久性、安全及性能限制；
- 概念层面的开发者责任归属和数据／生命周期设计——总体设计、架构、概略数据流——这些无法廉价地从公开类型恢复，准确细节用代码链接；
- 包政策要求的规范 Model Experience 和 Known Limitations 章节；
- 相邻文档确有帮助时，提供面向新读者的 Further Exploration；
- 最后一个非权威 Dev Note，是不完整想法、草稿及未定方向的唯一归属。

不重述 JSDoc 或生成目录。链接负责者，只解释局部需要的决定或关系。包 Summary 描述读者可见能力，而不是 Cordis 角色、注册或内部组件；省略源码标识符，除非读者在配置、命令或公开 API 中直接使用它们。拒绝任何讲述内部实现的用户章节（函数主体、事件流、数据流），也拒绝枚举 API 而非解释概念的折叠区。

## 参考示例

`session-persistence-jsonl` 的 README 双语对（[英文](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/session/session-persistence-jsonl/README.md)、[中文](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/session/session-persistence-jsonl/README.zh.md)）展示生产中的格式：可搜索 YAML，其 `kind` 选择本 package-reference 标准；四句 Summary；带链接目录；面向用户的使用章节，覆盖选择、配置、布局、持久性及读取；面向开发者设计和存储细节的 GitHub 原生 `<details>` 折叠区；Further Exploration；规范 Model Experience 和 Known Limitations 章节；最后的 Dev Note。以其结构、证据标准和双语对齐作为包 README 与跨包页面的范本；每个主张都基于其负责来源及证据。

## 验证

迭代时运行最小聚焦检查，再运行长期文档检查：

```sh
pnpm run test:docs
pnpm run verify-translation-pairing --write <pair>
pnpm run doc-sync
pnpm run lint
git diff --check
```

技能变化还要运行仓库的技能调用元数据检查，逐行对齐的双语对要比较中英文物理行数。最终差异重读两遍：一遍核对事实完整性，一遍检查简洁、导航及责任归属。

## 开发笔记

无。
