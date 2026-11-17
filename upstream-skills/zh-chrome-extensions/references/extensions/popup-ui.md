> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/popup-ui.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# Popup UI

## 配置

```json
{
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    },
    "default_title": "My Extension"
  }
}
```

## 关键约束

- 用户点击外部时 popup 会关闭，不要依赖它持续打开
- 默认最大尺寸为 800x600 px，通过 body/html 上的 CSS 设置尺寸
- 所有脚本必须为外部文件（CSP 不允许内联脚本）
- 所有事件监听器必须使用 `addEventListener`（不能用内联处理器）

## Popup HTML 模板

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { width: 350px; min-height: 200px; padding: 16px; font-family: system-ui; }
  </style>
</head>
<body>
  <h1>My Extension</h1>
  <div id="content"></div>
  <script src="popup.js"></script>
</body>
</html>
```

## 持久化

Popup 关闭时状态会丢失。使用 `chrome.storage` 持久化：

```js
// Save on change
document.getElementById('input').addEventListener('input', (e) => {
  chrome.storage.local.set({ savedInput: e.target.value });
});

// Restore on open
document.addEventListener('DOMContentLoaded', async () => {
  const { savedInput = '' } = await chrome.storage.local.get('savedInput');
  document.getElementById('input').value = savedInput;
});
```

注意：`localStorage` 在 popup 中技术上可用（它有持久 origin），但强烈推荐 `chrome.storage`，因为它适用于所有扩展上下文，并支持同步。

## 与 service worker 通信

```js
// From popup
const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });

// Long-lived connection
const port = chrome.runtime.connect({ name: 'popup' });
port.postMessage({ type: 'INIT' });
port.onMessage.addListener((msg) => { /* handle */ });
```

## 动态 popup 与无 popup

如果希望点击 action 时执行操作，而不是显示 popup，移除 `default_popup`，并使用 `chrome.action.onClicked`：

```js
// In service worker — only fires if NO popup is set
chrome.action.onClicked.addListener((tab) => {
  // Open side panel, inject script, etc.
});
```

可以动态切换有 popup 和无 popup 两种模式：
```js
chrome.action.setPopup({ popup: 'popup/popup.html' }); // Enable popup
chrome.action.setPopup({ popup: '' }); // Disable popup (enables onClicked)
```

