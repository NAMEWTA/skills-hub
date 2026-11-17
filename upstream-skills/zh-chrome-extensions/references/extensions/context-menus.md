# 右键菜单

## 配置

```json
{ "permissions": ["contextMenus"] }
```

## 创建菜单

在 service worker 中创建，通常放在 `onInstalled` 中（菜单会持久保留，但重新创建是幂等的）：

```js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-link',
    title: 'Save to Reading List',
    contexts: ['link']        // Only show on right-click of links
  });

  chrome.contextMenus.create({
    id: 'translate-selection',
    title: 'Translate "%s"',   // %s = selected text
    contexts: ['selection']
  });

  // M150+: Context menu for the tab strip (right-clicking a tab)
  chrome.contextMenus.create({
    id: 'duplicate-tab',
    title: 'Custom Duplicate Tab',
    contexts: ['tab']
  });
});
```

## 处理点击

```js
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'save-link':
      saveLink(info.linkUrl, info.selectionText || info.linkUrl);
      break;
    case 'translate-selection':
      translateText(info.selectionText, tab.id);
      break;
    case 'duplicate-tab':
      chrome.tabs.duplicate(tab.id); // 'tab' parameter is the clicked tab
      break;
  }
});
```

## 上下文类型

`all`、`page`、`frame`、`selection`、`link`、`editable`、`image`、`video`、`audio`、`launcher`、`browser_action`、`action`、`tab`（M150+）

## 子菜单

```js
chrome.contextMenus.create({ id: 'parent', title: 'My Extension', contexts: ['page'] });
chrome.contextMenus.create({ id: 'child1', parentId: 'parent', title: 'Option 1', contexts: ['page'] });
chrome.contextMenus.create({ id: 'child2', parentId: 'parent', title: 'Option 2', contexts: ['page'] });
```

## 动态更新

```js
chrome.contextMenus.update('save-link', { title: 'New Title' });
chrome.contextMenus.remove('save-link');
chrome.contextMenus.removeAll();
```

