> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/devtools.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# DevTools 面板

## 配置

```json
{
  "devtools_page": "devtools/devtools.html"
}
```

devtools 页面只在 DevTools 打开时运行。该页面不可见，作用是创建面板。

## 创建面板

`devtools/devtools.html`：
```html
<!DOCTYPE html>
<html>
<body>
  <script src="devtools.js"></script>
</body>
</html>
```

`devtools/devtools.js`：
```js
chrome.devtools.panels.create(
  'My Panel',                    // Title shown in DevTools tab
  'icons/icon-16.png',           // Icon (optional, can be empty string)
  'devtools/panel/panel.html',   // Panel content page — RELATIVE TO EXTENSION ROOT
  (panel) => {
    // panel.onShown.addListener((window) => { ... });
    // panel.onHidden.addListener(() => { ... });
  }
);
```

**关键：面板路径相对于扩展根目录**，而不是相对于 devtools.js 文件。这是最常见的 DevTools 扩展错误。

```js
// ❌ WRONG — resolves to <ext-root>/panel/panel.html (file not found)
chrome.devtools.panels.create("My Panel", "", "panel/panel.html");

// ✅ CORRECT — resolves to <ext-root>/devtools/panel/panel.html
chrome.devtools.panels.create("My Panel", "", "devtools/panel/panel.html");
```

## 面板内容

`devtools/panel/panel.html` 是普通扩展页面，可以完整访问 chrome.* API。

## 访问 DevTools API

只在 devtools 页面和面板中可用：

```js
// Get inspected window's tab ID
const tabId = chrome.devtools.inspectedWindow.tabId;

// Evaluate JS in the inspected page
chrome.devtools.inspectedWindow.eval('document.title', (result, isException) => {
  console.log('Page title:', result);
});

// Monitor network requests
chrome.devtools.network.onRequestFinished.addListener((request) => {
  // request.request.url, request.response.status, etc.
  // HAR entry format
});

// Get all captured requests
chrome.devtools.network.getHAR((harLog) => {
  harLog.entries.forEach((entry) => { /* process */ });
});
```

## 通信架构

DevTools 页面/面板并非在所有情况下都能通过 `chrome.runtime.sendMessage` 直接与 service worker 通信。使用连接模式：

```js
// In panel JS — connect to service worker
const port = chrome.runtime.connect({ name: 'devtools-panel' });
port.postMessage({ type: 'INIT', tabId: chrome.devtools.inspectedWindow.tabId });
port.onMessage.addListener((msg) => { /* handle */ });

// In service worker
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'devtools-panel') {
    port.onMessage.addListener((msg) => { /* handle */ });
  }
});
```

## 重要说明

- 每个 DevTools 窗口都有自己的 DevTools 页面（每个被检查的标签页一个）
- 关闭 DevTools 时页面被销毁
- `chrome.devtools.*` API 只在 devtools 页面上下文中可用，在 service worker 中不可用
- 面板可以通过 `chrome.devtools.inspectedWindow.eval()` 向被检查页面注入脚本

