# MemoDesk

本地笔记管理模块。`src/notes.mjs` 查询笔记，`src/store.mjs` 保存 JSON 文件。笔记字段为 id、title、body、updatedAt、archived。现有查询仅展示未归档笔记，按更新时间倒序。当前没有置顶字段。

验证：`npm test`。
