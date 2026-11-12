# 领域文档

工程技能探索代码库时，应如何使用本仓库的领域文档。

## 探索前，先读取这些内容

- 仓库根部的 **`GLOSSARY.md`**，或者
- 若根部存在 **`GLOSSARY-MAP.md`**：它为每个上下文指向一份 `GLOSSARY.md`。读取与主题有关的每一份。
- **`docs/adr/`**：读取涉及即将工作区域的 ADR。多上下文仓库还需检查 `src/<context>/docs/adr/` 中限定于上下文的决策。

如果这些文件中的任何一个不存在，**安静地继续**。不要指出缺失，也不要预先建议创建。`/domain-modeling` 技能（经由 `/grill-with-docs` 和 `/improve-codebase-architecture` 触达）会在术语或决策真正得到解决时按需创建。

## 文件结构

单上下文仓库（大多数仓库）：

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根部存在 `GLOSSARY-MAP.md`）：

```
/
├── GLOSSARY-MAP.md
├── docs/adr/                          ← 系统级决策
└── src/
    ├── ordering/
    │   ├── GLOSSARY.md
    │   └── docs/adr/                  ← 上下文特定决策
    └── billing/
        ├── GLOSSARY.md
        └── docs/adr/
```

## 使用术语表中的词汇

当你的输出命名领域概念时（问题标题、重构建议、假设、测试名称），使用 `GLOSSARY.md` 定义的术语。不要漂移到术语表明确避免的近义词。

如果需要的概念尚未在术语表中，这是一个信号：你要么正在发明项目不使用的语言（请重新考虑），要么存在真实空缺（记下来供 `/domain-modeling` 处理）。

## 标出 ADR 冲突

如果你的输出与现有 ADR 矛盾，明确提出，不要默默覆盖：

> _与 ADR-0007（事件溯源订单）冲突，但值得重新讨论，因为……_
