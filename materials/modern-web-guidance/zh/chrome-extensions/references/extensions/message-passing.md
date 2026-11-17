# 消息传递

## 基本模式

### 单向消息（发送后不等待）

```js
// sender (popup, content script, etc.)
chrome.runtime.sendMessage({ type: 'LOG', data: 'hello' });

// receiver (service worker)
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'LOG') console.log(message.data);
});
```

### 请求/响应：IIFE + return true（兼容性最好）

```js
// sender
const response = await chrome.runtime.sendMessage({ type: 'GET_DATA' });
console.log(response.data);

// receiver — IIFE keeps the channel open until sendResponse is called
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_DATA') {
    (async () => {
      const data = await chrome.storage.local.get('key');
      sendResponse({ data });
    })();
    return true; // REQUIRED — tells Chrome to keep the channel open
  }
});
```

### 请求/响应：返回 Promise（Chrome 99+）

现在支持直接从监听器返回 Promise，比 IIFE 模式更简洁：

```js
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'GET_DATA') {
    return chrome.storage.local.get('key'); // returned promise resolves the response
  }
  // Return nothing (or undefined) for messages this listener doesn't handle
});
```

**注意：** 需要 Chrome 99+；只有把最低 Chrome 版本设为 99 时才使用。
**注意：** 不要混合两种风格。如果返回 Promise，就不要同时调用 `sendResponse` 或 `return true`。

## 内容脚本 ↔ service worker

```js
// content script → service worker
const result = await chrome.runtime.sendMessage({ type: 'FETCH_DATA', url: location.href });

// service worker → specific tab's content script
await chrome.tabs.sendMessage(tabId, { type: 'HIGHLIGHT', selector: '.important' });
```

## Service worker → 内容脚本（定向）

始终检查标签页存在，并且已注入内容脚本：

```js
async function sendToContentScript(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    // Content script not injected yet, or tab navigated away
    console.warn('Could not reach content script:', err.message);
    return null;
  }
}
```

## 长连接（port）

需要持久通道时（例如流式数据、DevTools 面板），使用 port：

```js
// opener (popup or content script)
const port = chrome.runtime.connect({ name: 'my-channel' });
port.postMessage({ type: 'START' });
port.onMessage.addListener((msg) => console.log('received:', msg));
port.onDisconnect.addListener(() => console.log('disconnected'));

// receiver (service worker)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'my-channel') return;
  port.onMessage.addListener((msg) => {
    if (msg.type === 'START') {
      port.postMessage({ status: 'ok' });
    }
  });
});
```

## 常见错误

### 缺少 `return true` 导致响应永远无法送达

```js
// ❌ BROKEN — async work completes but channel is already closed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  fetchSomething().then(data => sendResponse(data)); // too late
  // missing: return true
});

// ✅ CORRECT
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  fetchSomething().then(data => sendResponse(data));
  return true;
});
```

### 内容脚本就绪前向标签页发消息

内容脚本在页面加载后注入。如果 service worker 在 `tabs.onUpdated` 时立即发送消息，内容脚本可能尚未监听。使用握手或重试：

```js
// content script — announce it's ready
chrome.runtime.sendMessage({ type: 'CONTENT_READY' });

// service worker — wait for CONTENT_READY before sending
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'CONTENT_READY' && sender.tab) {
    chrome.tabs.sendMessage(sender.tab.id, { type: 'INIT_DATA', ... });
  }
});
```

### 多个监听器响应

同一消息类型只应由一个监听器响应。如果多个监听器调用 `sendResponse`，只有第一个生效，其余会被静默忽略。

