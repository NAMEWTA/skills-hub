> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/tab-management.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# 标签页管理与分组

## 权限

```json
{
  "permissions": ["tabs", "tabGroups"]
}
```

注意：`tabs` 权限授予对 Tab 对象中 `url`、`title`、`favIconUrl` 的访问权。没有此权限时仍可使用 `chrome.tabs`，但无法读取敏感的标签页属性。

## 查询标签页

```js
// All tabs
const allTabs = await chrome.tabs.query({});

// Active tab in current window
const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

// Tabs matching a URL pattern
const gmailTabs = await chrome.tabs.query({ url: '*://mail.google.com/*' });
```

## 标签页操作

```js
// Create
const tab = await chrome.tabs.create({ url: 'https://example.com', active: true });

// Update
await chrome.tabs.update(tabId, { url: 'https://new-url.com', pinned: true });

// Close
await chrome.tabs.remove(tabId);
await chrome.tabs.remove([tabId1, tabId2]); // Multiple

// Move
await chrome.tabs.move(tabId, { index: 0 }); // Move to first position

// Reload
await chrome.tabs.reload(tabId);
```

## 标签页分组

```js
// Create a group from tabs
const groupId = await chrome.tabs.group({ tabIds: [tabId1, tabId2] });

// Customize the group
await chrome.tabGroups.update(groupId, {
  title: 'Work',
  color: 'blue',     // grey, blue, red, yellow, green, pink, purple, cyan, orange
  collapsed: false
});

// Move tab into existing group
await chrome.tabs.group({ tabIds: [newTabId], groupId: existingGroupId });

// Ungroup
await chrome.tabs.ungroup(tabId);
```

## 按域名分组

```js
async function groupByDomain() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const byDomain = {};

  for (const tab of tabs) {
    try {
      const domain = new URL(tab.url).hostname;
      (byDomain[domain] ??= []).push(tab.id);
    } catch { /* ignore tabs without URLs */ }
  }

  for (const [domain, tabIds] of Object.entries(byDomain)) {
    if (tabIds.length > 1) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, {
        title: domain.replace('www.', ''),
        color: 'blue'
      });
    }
  }
}
```

## 事件

```js
chrome.tabs.onCreated.addListener((tab) => { /* new tab */ });
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { /* tab changed */ });
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => { /* tab closed */ });
chrome.tabs.onActivated.addListener(({ tabId, windowId }) => { /* tab focused */ });
chrome.tabGroups.onUpdated.addListener((group) => { /* group changed */ });
```

## 窗口

⚠️ **`chrome.windows` 没有 `.query()` 方法。** 与 `chrome.tabs.query()` 不同，不存在 `chrome.windows.query()`。根据需要使用正确方法：

```js
// ❌ BROKEN
const windows = await chrome.windows.query({ focused: true });
// TypeError: chrome.windows.query is not a function

// ✅ CORRECT
const focused = await chrome.windows.getLastFocused({ populate: true }); // includes tabs array
const current = await chrome.windows.getCurrent({ populate: true });
const all     = await chrome.windows.getAll({ populate: true });
const single  = await chrome.windows.get(windowId, { populate: true });
```

完整 API：`getAll`、`getLastFocused`、`getCurrent`、`get(windowId)`、`create`、`update`、`remove`。传入 `{ populate: true }`，可在返回的窗口对象中包含 `tabs` 数组。

```js
// Create a new window with specific tabs
const win = await chrome.windows.create({ url: 'https://example.com', focused: true });

// Move current window to a specific position/size
await chrome.windows.update(windowId, { left: 0, top: 0, width: 800, height: 600 });

// Minimise / maximise
await chrome.windows.update(windowId, { state: 'minimized' }); // 'normal' | 'minimized' | 'maximized' | 'fullscreen'
```

