> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/user-scripts.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# User Scripts API

`chrome.userScripts` API 允许扩展在运行时执行**用户提供的任意代码**，这些代码不能作为扩展包的一部分分发。这与内容脚本（随扩展打包）和 `chrome.scripting`（程序化执行扩展自身代码）有本质区别。

**何时使用 userScripts：** 构建脚本管理器、自定义自动化工具，或任何由用户提供 JavaScript 并在网页上运行的功能。  
**何时使用内容脚本：** 注入的代码由你编写，并随扩展分发。  
**何时使用 `chrome.scripting.executeScript`：** 需要一次性执行已知的扩展自身代码。

## Manifest

```json
{
  "manifest_version": 3,
  "minimum_chrome_version": "120",
  "permissions": ["userScripts"],
  "host_permissions": ["https://example.com/*"]
}
```

- 必须有 `"userScripts"` 权限，否则 `chrome.userScripts` 为 undefined。
- `host_permissions` 必须覆盖要注入脚本的站点。

## 用户启用：关键步骤

**`chrome.userScripts` API 需要用户明确启用。未启用时，访问 API 属性就会抛出异常。** 不同 Chrome 版本的行为不同：

| Chrome 版本 | 要求 |
|----------------|-------------|
| < 138 | 用户必须在 `chrome://extensions` 启用**开发者模式** |
| ≥ 138 | 用户必须在扩展详情页打开 **“Allow User Scripts”** |

```js
// ❌ BROKEN — crashes if user hasn't enabled the API
await chrome.userScripts.register([{ id: 'foo', matches: [...], js: [...] }]);
// TypeError: Cannot read properties of undefined

// ✅ CORRECT — always guard before any chrome.userScripts.* call
function isUserScriptsAvailable() {
  try {
    chrome.userScripts; // throws if not enabled
    return true;
  } catch {
    return false;
  }
}

if (!isUserScriptsAvailable()) {
  document.getElementById('warning').style.display = 'block';
  document.getElementById('main-ui').style.display = 'none';
  return;
}
```

## 执行世界

| 世界 | 常量 | 行为 |
|-------|----------|----------|
| **USER_SCRIPT**（默认） | `ExecutionWorld.USER_SCRIPT` | 与宿主页面 JS 隔离，不受页面 CSP 约束 |
| **MAIN** | `ExecutionWorld.MAIN` | 与宿主页面共享 JS 上下文，可以访问页面变量 |

为了安全使用默认的 `USER_SCRIPT`。只有用户脚本明确需要与宿主页面 JavaScript 环境交互时，才使用 `MAIN`。

Chrome 133+ 通过 `worldId` 支持多个隔离世界，使不同用户脚本可运行在独立环境中而不互相干扰。

## 注册脚本（持久化）

`register()` / `update()` / `getScripts()` / `unregister()` 管理跨页面加载和浏览器会话保留的脚本。已注册脚本不会因 service worker 终止而丢失。

```js
// ❌ BROKEN — both code and file specified (ScriptSource must have exactly one)
await chrome.userScripts.register([{
  id: 'my-script',
  matches: ['https://example.com/*'],
  js: [{ code: 'alert(1)', file: 'user-script.js' }] // Error: specify code OR file, not both
}]);

// ❌ BROKEN — id starts with underscore (reserved prefix)
await chrome.userScripts.register([{ id: '_my-script', ... }]);
// Error: User script IDs must not start with '_'

// ✅ CORRECT — register from a file bundled with the extension
await chrome.userScripts.register([{
  id: 'my-user-script',
  matches: ['https://example.com/*'],
  js: [{ file: 'user-script.js' }],
  runAt: 'document_idle'  // optional, this is the default
}]);

// ✅ CORRECT — register inline code supplied by the user
await chrome.userScripts.register([{
  id: 'my-user-script',
  matches: ['https://example.com/*'],
  js: [{ code: userProvidedCode }]
}]);
```

调用 `register()` 或 `update()` 前始终检查：注册已存在的 ID 会抛出错误。

```js
const existing = await chrome.userScripts.getScripts({ ids: ['my-user-script'] });
if (existing.length > 0) {
  await chrome.userScripts.update([{ id: 'my-user-script', js: [{ code: updatedCode }] }]);
} else {
  await chrome.userScripts.register([{
    id: 'my-user-script',
    matches: ['https://example.com/*'],
    js: [{ code: userProvidedCode }]
  }]);
}

// Remove a specific script
await chrome.userScripts.unregister({ ids: ['my-user-script'] });

// Remove all registered user scripts
await chrome.userScripts.unregister();
```

## 持久化：扩展更新后恢复

**扩展更新时，已注册的用户脚本会被清除。**

```js
// ❌ BROKEN — scripts registered once at install time are lost on every update
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.userScripts.register([{ id: 'foo', matches: [...], js: [...] }]);
    // After the next extension update, 'foo' is gone — no re-registration
  }
});

// ✅ CORRECT — persist configs in storage, restore on both install and update
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const { scripts = {} } = await chrome.storage.local.get('scripts');
    for (const s of Object.values(scripts)) {
      await chrome.userScripts.register([s]).catch(() => {});
    }
  }
});
```

用户每次保存脚本时，将完整脚本配置（id、matches、js）写入 `chrome.storage`，以便更新后恢复。

## 一次性注入（Chrome 135+）

`execute()` 无需注册，就能立即向特定标签页/框架注入脚本。它不会在后续页面加载中持续生效。

```js
// Requires Chrome 135+
const results = await chrome.userScripts.execute({
  target: { tabId: tabId },
  js: [{ code: userProvidedCode }],
  world: 'USER_SCRIPT'  // optional, default
});

for (const result of results) {
  if (result.error) {
    console.error('Injection failed in frame', result.frameId, result.error);
  } else {
    console.log('Result from frame', result.frameId, result.result);
  }
}
```

检查 Chrome 135+ 的可用性：

```js
if (typeof chrome.userScripts.execute === 'function') {
  await chrome.userScripts.execute({ ... });
} else {
  // Fall back to register-based approach
}
```

## 用户脚本的消息传递

用户脚本运行在 `USER_SCRIPT` 世界中，默认无法访问 `chrome.runtime`。消息传递需要明确启用。

```js
// ❌ BROKEN — messaging not enabled; chrome.runtime is undefined in the user script
// sw.js
chrome.runtime.onMessage.addListener((msg) => { ... }); // Never fires from user scripts

// user script code (running in the page)
chrome.runtime.sendMessage({ type: 'hello' }); // TypeError: chrome is not defined

// ✅ CORRECT — opt in first, then use the dedicated listener
// sw.js (run once, e.g. on install)
await chrome.userScripts.configureWorld({ messaging: true });

// sw.js — listen on the dedicated handler, not onMessage
chrome.runtime.onUserScriptMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ ok: true });
  return true; // keep channel open for async responses
});

// user script code — chrome.runtime is now available
chrome.runtime.sendMessage({ type: 'FROM_USER_SCRIPT', data: 42 });
```

长连接使用 `chrome.runtime.onUserScriptConnect`（类似于内容脚本的 `runtime.onConnect`）。

Chrome 133+ 支持通过 `worldId` 按世界配置消息传递：

```js
await chrome.userScripts.configureWorld({ worldId: 'my-world', messaging: true });
```

## `configureWorld()`：CSP 与消息传递

```js
await chrome.userScripts.configureWorld({
  csp: "script-src 'self'",  // custom CSP for the world
  messaging: true             // enable chrome.runtime messaging
});

// Chrome 133+: configure a named world
await chrome.userScripts.configureWorld({
  worldId: 'my-world',
  messaging: true
});

// Chrome 133+: reset a world's configuration
await chrome.userScripts.resetWorldConfiguration('my-world');

// Chrome 133+: list all world configurations
const configs = await chrome.userScripts.getWorldConfigurations();
```

## 完整脚本管理器模式

```js
// options.js — save user's script and (re)register it
async function saveScript(id, matches, code) {
  // Persist the config so we can restore it after extension updates
  const { scripts = {} } = await chrome.storage.local.get('scripts');
  scripts[id] = { id, matches, js: [{ code }] };
  await chrome.storage.local.set({ scripts });

  // Register or update the live script
  const existing = await chrome.userScripts.getScripts({ ids: [id] });
  if (existing.length > 0) {
    await chrome.userScripts.update([{ id, matches, js: [{ code }] }]);
  } else {
    await chrome.userScripts.register([{ id, matches, js: [{ code }] }]);
  }
}
```

## 与内容脚本的主要区别

| | 内容脚本 | userScripts |
|--|-----------------|-------------|
| 代码来源 | 随扩展打包 | 用户在运行时提供 |
| 持久化 | 自动（manifest） | 手动（register + 更新后恢复） |
| 任意代码 | 不支持 | 支持 |
| 用户明确启用 | 不需要 | 需要（Developer Mode / Allow User Scripts） |
| 消息传递 | `runtime.sendMessage` | `runtime.onUserScriptMessage`（调用 `configureWorld` 后） |
| 不受 CSP 约束 | 是 | 是（USER_SCRIPT 世界） |
| 多个世界 | 不支持 | 支持（Chrome 133+，使用 `worldId`） |

