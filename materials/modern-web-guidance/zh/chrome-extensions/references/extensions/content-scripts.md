# 内容脚本与 DOM 操作

## 两种注入方式

### 1. 静态注入（manifest 声明）
```json
{
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content/content.js"],
    "css": ["content/content.css"],
    "run_at": "document_idle"
  }]
}
```

### 2. 程序化注入（从 service worker 或 popup 发起）
```js
// Requires "scripting" permission and host access
chrome.scripting.executeScript({
  target: { tabId: tabId },
  files: ['content/content.js']
});

// Or inject a function directly
chrome.scripting.executeScript({
  target: { tabId: tabId },
  func: (param) => {
    document.body.style.backgroundColor = param;
  },
  args: ['yellow']
});
```

点击时注入可使用 `activeTab` 权限（无需 host_permissions）：
```json
{
  "permissions": ["activeTab", "scripting"]
}
```

## 隔离世界

内容脚本运行在隔离世界中：
- 与页面共享 DOM，但不共享 JavaScript 变量
- 可以访问 chrome.runtime 消息 API
- 页面的 CSP 不限制内容脚本代码
- `window` 指向内容脚本的隔离世界

## 内容脚本中的消息传递

```js
// content.js → service worker
chrome.runtime.sendMessage({ type: 'DATA', payload: data }, (response) => {
  console.log('Got response:', response);
});

// service worker → content script in a specific tab
chrome.tabs.sendMessage(tabId, { type: 'UPDATE', data: newData });

// content.js: listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CONTENT') {
    const text = document.body.innerText;
    sendResponse({ text });
  }
  return true; // Keep channel open for async sendResponse
});
```

## DOM 操作最佳实践

- 修改大量 DOM 元素时，**避免阻塞主线程**。使用 `requestAnimationFrame` 批量执行视觉更新，使用 `scheduler.yield()` 拆分长任务：

```js
// ❌ BAD: Blocks the main thread while processing hundreds of elements
const emails = document.body.innerText.match(/[\w.+-]+@[\w-]+\.[\w.]+/g);
emails.forEach(email => {
  // ... find and highlight each email (can freeze the page)
});

// ✅ GOOD: Process in batches using requestAnimationFrame
async function highlightEmails(elements) {
  const BATCH_SIZE = 20;
  for (let i = 0; i < elements.length; i += BATCH_SIZE) {
    const batch = elements.slice(i, i + BATCH_SIZE);
    await new Promise(resolve => requestAnimationFrame(() => {
      batch.forEach(el => el.style.backgroundColor = 'yellow');
      resolve();
    }));
    // Yield to the main thread between batches
    if (typeof scheduler !== 'undefined' && scheduler.yield) {
      await scheduler.yield();
    }
  }
}
```

- 动态页面（SPA、无限滚动）使用 `MutationObserver`
- 为 CSS 类添加命名空间，避免冲突（例如 `myext-highlight`）
- 向页面注入复杂 UI 时使用 Shadow DOM
- 移除时进行清理：`chrome.runtime.onMessage` 监听器会持续存在，直到内容脚本上下文被销毁
- 查找 DOM 文本时，使用 `TreeWalker` 或 `document.createNodeIterator`，不要对 `innerHTML` 使用正则；这更可靠，也不会破坏事件监听器

## `run_at` 的时机

| 值 | 时机 |
|-------|------|
| `document_start` | DOM 构造前（适合拦截） |
| `document_idle` | DOM 就绪后、全部资源加载完成前（默认值，推荐） |
| `document_end` | DOM 完成后、图片/子框架加载完成前 |

