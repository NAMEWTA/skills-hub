# 侧边栏

## 配置

向 manifest.json 添加：
```json
{
  "permissions": ["sidePanel"],
  "side_panel": {
    "default_path": "sidepanel/sidepanel.html"
  }
}
```

## 打开侧边栏：必需

**仅定义侧边栏并不会使它能够被打开。** 必须提供明确的打开触发方式。缺少下面任一方式时，用户无法访问面板：

### 最常见方式：点击 action 图标打开

如果侧边栏是扩展的主要功能，从 action 中移除 `default_popup`，使用 `chrome.action.onClicked` 打开侧边栏：

```js
// service-worker.js
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});
```

⚠️ 只有没有设置 `default_popup` 时，`chrome.action.onClicked` 才会触发。如果同时有 popup 和侧边栏，通过 popup 中的按钮打开侧边栏，或使用另一种触发方式。

### 其他触发方式

```js
// Open from a context menu item
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'open-panel') {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Open from a keyboard shortcut (defined in manifest commands)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-side-panel') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
```

也可以针对特定标签页打开：
```js
await chrome.sidePanel.open({ tabId: tab.id });
```

### 最简方式：通过 setPanelBehavior 自动打开

如果每次点击扩展图标都应该打开侧边栏，使用一行 `setPanelBehavior` 代替 `onClicked` 监听器：

```js
// service-worker.js
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
```

⚠️ **属性是 `openPanelOnActionClick`，不是 `openPanelOnActionIconClick`。** 使用错误名称会产生同步 TypeError，进而静默中止 service worker。

使用 `setPanelBehavior` 时不要同时定义 `default_popup`，因为 popup 会优先。

## 按标签页设置面板

```js
// Different side panel content for different tabs
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url?.includes('github.com')) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel/github-panel.html',
      enabled: true
    });
  }
});
```

## 与侧边栏通信

侧边栏是扩展页面，可以直接使用所有 chrome.* API，并通过 `chrome.runtime.sendMessage` / `chrome.runtime.onMessage` 与 service worker 通信。

从当前活动标签页的内容脚本获取数据：

```js
// In side panel JS
async function getPageContent() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_CONTENT' });
  return response;
}
```

也可以从侧边栏使用 `chrome.scripting.executeScript`（需要 `scripting` 和 `activeTab` 权限）：

```js
const [{ result }] = await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: () => document.body.innerText
});
```

## 侧边栏与 Popup 对比

| 特性 | 侧边栏 | Popup |
|---------|-----------|-------|
| 保持打开 | 是 | 点击外部时关闭 |
| 调整尺寸 | 可以（由用户调整） | 固定尺寸 |
| 与页面共存 | 是（并排） | 覆盖页面 |
| 适用场景 | 长时间交互、阅读 | 快速操作、设置 |

## 重要说明

- 每个窗口共享一个侧边栏实例；打开时会替换现有内容
- 使用 `chrome.sidePanel.setOptions({ enabled: false })` 对特定标签页禁用
- 侧边栏 HTML 文件可完整访问 chrome.* API
- 切换标签页时侧边栏继续保留（按窗口）

### ⚠️ 侧边栏交互不会使 `activeTab` 生效

`activeTab` 只在直接用户手势中授予标签页访问权：点击扩展图标、右键菜单项、键盘快捷键或 omnibox 建议。**点击侧边栏中的按钮不会激活 `activeTab`。**

如果侧边栏需要读取或修改页面内容（例如“摘要”按钮），改用 `tabs` + `host_permissions`：

```json
{
  "permissions": ["tabs", "scripting", "sidePanel"],
  "host_permissions": ["<all_urls>"]
}
```

不要依赖 `activeTab` 实现侧边栏功能。

