> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/storage.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# Chrome Storage API

## 存储区域

| 区域 | 是否持久化 | 是否同步 | 配额 | 用途 |
|------|----------|-------|-------|---------|
| `chrome.storage.local` | 是 | 否 | 10 MB | 大多数扩展数据 |
| `chrome.storage.sync` | 是 | 是（跨设备） | 总计 100 KB，每项 8 KB | 用户偏好、小量数据 |
| `chrome.storage.session` | 直到浏览器关闭 | 否 | 10 MB | 临时状态，SW 重启后保留 |

所需权限：`"storage"`

## 基本操作

```js
// Set
await chrome.storage.local.set({ key: 'value', count: 42, items: [1,2,3] });

// Get (with defaults)
const { key = 'default', count = 0 } = await chrome.storage.local.get(['key', 'count']);

// Get all
const allData = await chrome.storage.local.get(null);

// Remove
await chrome.storage.local.remove('key');
await chrome.storage.local.remove(['key1', 'key2']);

// Clear all
await chrome.storage.local.clear();
```

## 变更监听器（适用于所有上下文）

```js
chrome.storage.onChanged.addListener((changes, areaName) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(`${areaName}.${key}: ${oldValue} → ${newValue}`);
  }
});
```

## storage.sync 配额

使用 sync 时注意限额：
- `QUOTA_BYTES_PER_ITEM`：每个键值对 8,192 字节
- `MAX_ITEMS`：512 项
- `QUOTA_BYTES`：总计 102,400 字节
- `MAX_WRITE_OPERATIONS_PER_HOUR`：1,800 次
- `MAX_WRITE_OPERATIONS_PER_MINUTE`：120 次

大数据应拆分到多个键，或使用 `chrome.storage.local`。

## storage.session 说明

- 仅 MV3 可用
- 浏览器关闭时清除（不只是 SW 终止时）
- service worker、popup、侧边栏等均可访问
- 适用于身份验证 token、临时缓存、进行中的操作

## 为什么不用 localStorage？

`localStorage` 适用于 popup 和扩展页面，但不适用于 service worker。`chrome.storage` 在各处都可用，并支持跨上下文变更监听器。始终优先使用 `chrome.storage`。

