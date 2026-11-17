> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/permissions.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# 权限

## `permissions` 与 `host_permissions`

这是两个独立的 manifest 键，不要混淆：

```json
{
  "permissions": ["tabs", "scripting", "storage"],
  "host_permissions": ["https://api.example.com/*"]
}
```

- `permissions` 授予 chrome.* API 访问权（`tabs`、`storage`、`scripting`、`desktopCapture` 等）
- `host_permissions` 授予访问特定 origin 的权限，用于 `fetch`、`chrome.scripting.executeScript` 及跨源读取标签页 URL

将 `host_permissions` 限制到特定域名，不要使用 `<all_urls>`，除非扩展确实需要在每个站点运行；宽泛的主机权限会引起 Chrome Web Store 更严格的审核。

## `tab.url` 需要 `tabs` 权限

没有此权限时，`tab.url` 和 `tab.title` 会静默返回 `undefined`，不会抛出错误。

```js
// manifest.json — REQUIRED if you read tab.url or tab.title anywhere:
{ "permissions": ["tabs"] }
```

完整的 tabs/windows API 见 `references/extensions/tab-management.md`。

## `activeTab` 只适用于直接用户手势，不适用于侧边栏交互

只有下列操作触发时，`activeTab` 才授予对当前标签页的临时访问权：
- 点击扩展 action 图标
- 右键菜单项（包括 `"tab"` 上下文）
- `commands` API 的键盘快捷键
- 接受 omnibox 建议

点击侧边栏内的按钮、稍后打开的 popup 中的按钮，或任何程序化触发，都**不会**授予访问权。

```js
// ❌ BROKEN — activeTab does NOT work from a side panel button click
document.getElementById('summarize').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => document.body.innerText });
});

// ✅ FIX — use "tabs" permission + specific host_permissions instead
// manifest.json: { "permissions": ["tabs", "scripting"], "host_permissions": ["<all_urls>"] }
```

侧边栏专门说明见 `references/extensions/side-panel.md`。

## `chrome.permissions.request()` 需要用户手势：手势可以经过一次 `sendMessage`，但不能再经过 `await`

`chrome.permissions.request()`（用于可选/动态权限）只能在用户手势中执行，例如点击或按键。来自 UI 上下文（侧边栏、popup）的手势**确实会**通过 `chrome.runtime.sendMessage` 传播到 service worker 的 `onMessage` 监听器，但只在那一轮同步执行中有效。如果监听器在调用 `chrome.permissions.request()` 前使用 `await` 等待任何操作（定时器、存储读取、另一次消息往返），手势就会消失，调用会抛出 `"This function must be called during a user gesture, such as an onclick handler"`。

```js
// side-panel.js
button.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'REQUEST_PERMISSION' }, (granted) => { ... });
});

// service-worker.js

// ❌ BROKEN — an await before chrome.permissions.request() burns the gesture window
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'REQUEST_PERMISSION') {
    (async () => {
      await chrome.storage.local.get('someSetting'); // gesture is gone after this
      const granted = await chrome.permissions.request({ permissions: ['downloads'] });
      sendResponse(granted);
    })();
    return true;
  }
});

// ✅ CORRECT — call chrome.permissions.request() as the first thing in the listener,
// nothing awaited before it
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'REQUEST_PERMISSION') {
    chrome.permissions.request({ permissions: ['downloads'] }).then(sendResponse);
    return true; // fine to await the *result* — the call itself already happened synchronously
  }
});
```

**经验规则：** 在接收点击触发消息的监听器中，将 `chrome.permissions.request()`（或其他需要用户手势的操作，如 `activeTab`）放在第一条语句，在任何其他 `await` 之前执行。随后 await 它**返回的** Promise 没有问题；导致失效的是在调用**之前** await 其他操作。

## 检查和移除权限

```js
// Check whether an optional permission is currently granted
const hasIt = await chrome.permissions.contains({ permissions: ['downloads'] });

// Remove a previously granted optional permission
await chrome.permissions.remove({ permissions: ['downloads'] });
```

在 manifest 中声明可选权限，这样才能在运行时申请：

```json
{ "optional_permissions": ["downloads"] }
```

