---
name: zh-chrome-extensions
description: "使用 Manifest V3 最佳实践构建并发布 Chrome 扩展。当用户要求创建、修改、调试或理解 Chrome 浏览器扩展、附加组件，或涉及 Chrome Extensions API 的任何内容时，使用此技能。 提及以下内容时触发：Chrome 扩展、浏览器扩展、manifest.json、content script、浏览器场景中的 service worker、浏览器扩展场景中的 popup、side panel、chrome.* API、declarativeNetRequest、omnibox、扩展场景中的 context menu、userScripts、用户脚本、脚本管理器，或构建与 Chrome 浏览器 UI 集成功能的任何请求。 向 Chrome Web Store 发布的相关任务也触发：发布扩展、准备上架、回应审核拒绝、编写权限理由或起草隐私政策。"
---

> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/SKILL.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# Chrome 扩展

## 中文适配说明

默认使用中文解释与交付。本文及 `references/` 提供固定上游版本的中文对照，代码、API 名称和可执行命令保持原样。涉及现代 Web 指南时，遵循 `zh-modern-web-guidance` 的正常检索流程：仍运行原名 `modern-web-guidance` CLI，保留版本握手与功能门禁。CLI 最新结果可能是英文；本地中文对照用于辅助理解，与最新检索结果冲突时以本次 CLI 结果为准，不得用本地文件替代或绕过检索策略。

使用 Manifest V3 构建可用于生产的 Chrome 扩展，并发布到 Chrome Web Store。

## 第 1 部分：构建扩展

### 强制规则

这些规则针对最常见的扩展故障原因。违反其中任何一条都会导致构建产物无法正常工作。

#### 1. 图标：只引用实际创建的文件，或者完全省略图标

```
❌ BROKEN — referencing files that don't exist or reusing one file for all sizes:
   "icons": { "16": "icon.png", "48": "icon.png", "128": "icon.png" }

✅ CORRECT — each size is a separate file at the correct pixel dimensions:
   "icons": { "16": "icons/icon-16.png", "48": "icons/icon-48.png", "128": "icons/icon-128.png" }
   (where icon-16.png is 16×16px, icon-48.png is 48×48px, icon-128.png is 128×128px)

✅ ALSO CORRECT — omit icons from manifest if you cannot generate real PNG files:
   (just remove the "icons" and "default_icon" fields — Chrome uses a default icon)
```

**如果包含图标引用，就必须创建真实的图片文件。** 使用脚本生成它们（参见 `references/extensions/icons.md`），或者省略图标。绝不要引用不存在的文件。

#### 2. 侧边栏：必须提供打开方式

仅定义 `"side_panel": {"default_path": "..."}` 并不会让侧边栏能够被打开。添加触发方式：

```js
// In service-worker.js — open side panel on extension icon click
// IMPORTANT: chrome.action.onClicked ONLY fires when there is NO default_popup
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});
```

如果扩展同时有 popup 和侧边栏，在 popup 中添加调用 `chrome.sidePanel.open()` 的按钮。也可以使用 `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })`，但属性是 `openPanelOnActionClick`，不是 `openPanelOnActionIconClick`；包含“Icon”的错误属性会导致同步 TypeError，进而静默中止 service worker。使用 `setPanelBehavior` 时，不要同时定义 `default_popup`。参见 `references/extensions/side-panel.md`。

#### 3. 代码执行：仅使用沙箱 iframe

扩展 CSP 会在所有扩展页面中阻止 `eval()`、`new Function()` 和内联 `<script>`。

```js
// ❌ BROKEN — direct iframe DOM access throws SecurityError
iframe.contentDocument.write(html);

// ❌ BROKEN — eval in extension page
eval(userCode); // CSP blocks this

// ✅ OPTION A: Sandbox in manifest + postMessage
// manifest.json: { "sandbox": { "pages": ["sandbox.html"] } }
iframe.contentWindow.postMessage({ html, css, js }, '*');
// sandbox.html receives and runs:
window.addEventListener('message', (e) => { eval(e.data.js); /* allowed in sandbox */ });

// ✅ OPTION B: Blob URL (creates separate origin, bypasses extension CSP)
iframe.src = URL.createObjectURL(new Blob([doc], { type: 'text/html' }));

// ✅ OPTION C: srcdoc
iframe.srcdoc = `<style>${css}</style>${html}<script>${js}<\/script>`;
```

完整说明见 `references/extensions/csp-sandbox.md`。

#### 4. `tab.url` 需要 `tabs` 权限

没有此权限时，`tab.url` 会静默返回 `undefined`，不会抛出错误。参见 `references/extensions/permissions.md`。

#### 5. 始终使用 async/await，不要使用 `.then()` 调用链

```js
// ❌ BAD
chrome.tabs.query({active: true, currentWindow: true}).then(tabs => {
  chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['content.js']}).then(() => {});
});

// ✅ GOOD
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
```

对于需要执行异步操作的 `runtime.onMessage` 监听器：

```js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const data = await chrome.storage.local.get('key');
    sendResponse({ data });
  })();
  return true; // keeps channel open
});
```

#### 6. 内容脚本：不要阻塞主线程

修改大量 DOM 元素时，使用 `requestAnimationFrame` 分批处理，并在批次之间让出执行权：

```js
async function highlightAll(elements) {
  const BATCH = 20;
  for (let i = 0; i < elements.length; i += BATCH) {
    await new Promise(r => requestAnimationFrame(() => {
      elements.slice(i, i + BATCH).forEach(el => el.style.backgroundColor = 'yellow');
      r();
    }));
    if (globalThis.scheduler?.yield) await scheduler.yield();
  }
}
```

参见 `references/extensions/content-scripts.md`。

#### 7. Service worker 生命周期短暂，绝不要在变量中保存状态

```js
// ❌ BROKEN — state lost when SW terminates (~30s of inactivity)
let count = 0;
chrome.tabs.onUpdated.addListener(() => { count++; });

// ✅ CORRECT — persist in chrome.storage, read on every event
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== 'complete') return;
  const { count = 0 } = await chrome.storage.local.get('count');
  await chrome.storage.local.set({ count: count + 1 });
  await chrome.action.setBadgeText({ text: String(count + 1) });
});
```

使用 `chrome.alarms` 代替 `setTimeout`/`setInterval`。参见 `references/extensions/service-worker.md`。

#### 8. chrome.identity：开发与生产的扩展 ID 不同

使用 Google 登录时，OAuth client_id 与某个特定扩展 ID 绑定。未打包的开发环境与 Chrome Web Store 中的 ID 会不同。

要在开发中稳定 ID，在 manifest.json 中添加 `"key"` 字段：
1. 将扩展打包一次（chrome://extensions → Pack）
2. 从 .crx 提取公钥
3. 向 manifest.json 添加 `"key": "MIIBIjANBgkqh..."`

始终记录：“发布到 Chrome Web Store 后，使用商店分配的扩展 ID 更新 OAuth 客户端。”参见 `references/extensions/auth-identity.md`。

#### 9. 右键菜单：操作完成后向用户反馈

右键菜单项执行保存、复制等操作后，要向用户确认。使用通知、徽标闪烁或注入式 toast，不要让操作静默发生。完整的 toast 实现见 `references/extensions/context-menus.md`。

#### 10. Prompt API：可用于 service worker、popup 和侧边栏

`LanguageModel` API 可用于所有扩展上下文，包括 service worker、popup 和侧边栏，无需额外 manifest 权限。扩展还可以使用 Web 页面上不可用的 `LanguageModel.params()`：

```js
const params = await LanguageModel.params();
// { defaultTopK: 3, maxTopK: 128, defaultTemperature: 1, maxTemperature: 2 }
```

通用的 Prompt API 模式（可用性检测、会话创建、流式输出）请使用 `zh-modern-web-guidance` 技能。扩展专用的接线示例见 `references/extensions/prompt-api.md`。

#### 11. `chrome.action` API 要求 manifest 包含 `action`

使用 `chrome.action.setBadgeText`、`chrome.action.setIcon` 或 `chrome.action.onClicked` 时，manifest.json 中必须有 `"action"` 键，即使其值为空对象。没有它时，`chrome.action` 为 `undefined`。

```js
// ❌ BROKEN — manifest has no "action" key
await chrome.action.setBadgeText({ text: '5' });
// TypeError: Cannot read properties of undefined (reading 'setBadgeText')

// ✅ FIX — add "action" to manifest.json (at minimum an empty object)
{ "action": {} }
// or with a popup:
{ "action": { "default_popup": "popup/popup.html" } }
```

#### 12. `activeTab` 只适用于直接用户手势，不适用于侧边栏操作

`activeTab` 仅在直接用户手势（点击扩展 action 图标、右键菜单项、键盘快捷键、omnibox 建议）触发时，授予对当前标签页的临时访问权限；侧边栏或 popup 内的按钮点击不属于这种情况。应改用 `tabs` + `host_permissions`。参见 `references/extensions/permissions.md` 和 `references/extensions/side-panel.md`。

#### 13. DevTools 面板 URL 相对于扩展根目录

创建 DevTools 面板时，面板 HTML 路径相对于**扩展根目录**，而不是相对于调用 `chrome.devtools.panels.create()` 的 devtools 页面。

```js
// ❌ BROKEN — path relative to devtools/ directory
chrome.devtools.panels.create("My Panel", "", "panel/panel.html");

// ✅ CORRECT — full path from extension root
chrome.devtools.panels.create("My Panel", "", "devtools/panel/panel.html");
```

参见 `references/extensions/devtools.md`。

#### 14. 离屏文档不能访问大多数 chrome.* API

离屏文档（`chrome.offscreen`）受到**严格限制**。大多数 `chrome.*` API 不可用，包括 `chrome.downloads`、`chrome.tabs`、`chrome.action` 等。

```js
// ❌ BROKEN — chrome.downloads is undefined in offscreen documents
chrome.downloads.download({ url, filename: 'recording.webm' }); // TypeError

// ❌ BROKEN — chrome.action is undefined in offscreen documents
chrome.action.setBadgeText({ text: 'REC' }); // TypeError
```

**离屏文档中仅可使用以下 API：**
- `chrome.runtime.sendMessage` / `chrome.runtime.onMessage`
- `chrome.runtime.getURL`
- 标准 Web API（DOM、fetch、MediaRecorder、Canvas、Web Audio 等）

**经验规则：** 离屏文档负责 Web API 工作（录制、解析、音频）；service worker 负责全部 chrome.* API 工作（下载、更新徽标、通知）。使用 `chrome.runtime.sendMessage` 在两者之间桥接。参见 `references/extensions/message-passing.md`。

#### 15. 通知和徽标图标必须引用真实图片文件

`chrome.notifications.create()` 需要有效的 `iconUrl`，指向真实图片文件。文件不存在或路径错误时，调用会失败并报 `"Unable to download all specified images."`。

```js
// ❌ BROKEN — icon file doesn't exist
chrome.notifications.create('reminder', {
  type: 'basic',
  iconUrl: 'icons/icon-128.png', // File not in extension!
  title: 'Reminder',
  message: 'Time is up!'
});

// ✅ Generate a data URL at runtime via OffscreenCanvas — no file needed.
// See `references/extensions/icons.md` for a reusable implementation.
const iconUrl = await getIconDataUrl();
chrome.notifications.create('reminder', { type: 'basic', iconUrl, title: 'Reminder', message: 'Time is up!' });
```

这适用于 chrome.* API 中的所有图片引用，包括通知、`chrome.action.setIcon`、右键菜单图标等。**如果引用了文件，文件就必须存在。**

#### 16. 标签页采集：使用状态锁防止重复启动

如果前一次采集仍在进行时调用 `chrome.tabCapture.getMediaStreamId()`，会报 `"Cannot capture a tab with an active stream"`。快速双击扩展图标很容易触发此问题。使用明确的状态锁：

```js
// ❌ BROKEN — no guard against rapid clicks
let isRecording = false;
chrome.action.onClicked.addListener(async (tab) => {
  if (isRecording) { stopRecording(); isRecording = false; }
  else { isRecording = true; startRecording(tab); } // Second click = "active stream" error
});

// ✅ CORRECT — use transitional states to lock out concurrent operations
// State machine: 'idle' → 'starting' → 'recording' → 'stopping' → 'idle'
// Store state in chrome.storage.session (survives SW restart, cleared on browser close)
chrome.action.onClicked.addListener(async (tab) => {
  const { recordingState = 'idle' } = await chrome.storage.session.get('recordingState');

  if (recordingState === 'starting' || recordingState === 'stopping') return;

  if (recordingState === 'idle') {
    await chrome.storage.session.set({ recordingState: 'starting' });
    try {
      await startRecording(tab);
      await chrome.storage.session.set({ recordingState: 'recording' });
      await chrome.action.setBadgeText({ text: 'REC' });
      await chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    } catch (err) {
      console.error('Failed to start recording:', err);
      await chrome.storage.session.set({ recordingState: 'idle' });
    }
  } else if (recordingState === 'recording') {
    await chrome.storage.session.set({ recordingState: 'stopping' });
    try { await stopRecording(); }
    finally {
      await chrome.storage.session.set({ recordingState: 'idle' });
      await chrome.action.setBadgeText({ text: '' });
    }
  }
});
```

此模式适用于所有管理独占资源的 chrome API：`chrome.tabCapture`、`chrome.desktopCapture`、`chrome.offscreen.createDocument`（同一时间只允许一个离屏文档）。参见 `references/extensions/media-capture.md`。

#### 17. `chrome.desktopCapture` 需要可访问 URL 的目标标签页

从 service worker 调用 `chrome.desktopCapture.chooseDesktopMedia()` 时，必须将当前活动标签页作为 `targetTab` 参数传入。该标签页对象必须填充 `url` 字段，因此需要 `"tabs"` 权限。

```js
// ❌ BROKEN — called without targetTab from service worker
chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], (streamId) => { ... });
// Error: "A target tab is required when called from a service worker context."

// ❌ BROKEN — tab doesn't have url field (missing "tabs" permission)
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], tab, (streamId) => { ... });
// Error: "targetTab doesn't have URL field set."

// ✅ CORRECT — "tabs" permission in manifest + pass tab object
// manifest.json: { "permissions": ["tabs", "desktopCapture"] }
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], tab, (streamId) => {
  if (!streamId) return; // User cancelled
});
```

**注意：** 仅录制标签页时，优先使用 `chrome.tabCapture.getMediaStreamId()`。只有需要让用户选择要采集的屏幕/窗口时，才使用 `chrome.desktopCapture`。参见 `references/extensions/media-capture.md`。

#### 18. 用户脚本：四个不明显的陷阱

`chrome.userScripts` 在运行时执行**用户提供的代码**。将它用于脚本管理器和用户自动化，不要用于扩展内置脚本。

- **未启用时，访问 API 属性就会抛出异常。** Chrome 138+ 要求用户在扩展详情页打开“Allow User Scripts”；Chrome < 138 要求启用开发者模式。在任何 `chrome.userScripts.*` 调用前，始终调用 `isUserScriptsAvailable()`；返回 false 时显示错误 UI。
- **更新扩展会清除已注册脚本。** 在 `chrome.storage` 中持久化配置，并在 `runtime.onInstalled` 的 `"update"` 原因分支中重新注册。
- **消息传递需要明确启用。** 首先调用 `configureWorld({ messaging: true })`；监听 `runtime.onUserScriptMessage`，不要监听 `runtime.onMessage`。
- **`ScriptSource` 约束：** 每个 `js` 条目必须且只能包含 `code` 或 `file` 中的一个。**`id` 约束：** 不能以 `_` 开头。

参见 `references/extensions/user-scripts.md`。

#### 19. `chrome.windows` 没有 `.query()` 方法，使用 `getAll`、`getLastFocused` 或 `getCurrent`

与 `chrome.tabs.query()` 不同，`chrome.windows` API 没有 `.query()` 方法。

```js
// ❌ BROKEN — chrome.windows.query does not exist
const windows = await chrome.windows.query({ focused: true });
// TypeError: chrome.windows.query is not a function

// ✅ CORRECT — use the right method for your need
const focused = await chrome.windows.getLastFocused({ populate: true });
const current = await chrome.windows.getCurrent({ populate: true });
const all     = await chrome.windows.getAll({ populate: true });
```

**`chrome.windows` 的方法：** `getAll`、`getLastFocused`、`getCurrent`、`get(windowId)`、`create`、`update`、`remove`。参见 `references/extensions/tab-management.md`。

#### 20. 在 service worker 的消息监听器中，调用 `chrome.permissions.request()` 前不能执行任何 `await`

来自 UI 上下文（侧边栏、popup）的用户手势确实会通过 `chrome.runtime.sendMessage` 传播到 service worker 的 `onMessage` 监听器，但只在那一轮同步执行中有效。如果监听器在调用 `chrome.permissions.request()` 前执行了 `await`（即使只是短暂延迟），用户手势就会消失，调用会抛出 `"This function must be called during a user gesture"`。应在监听器最开始调用它，之前不执行任何 await。参见 `references/extensions/permissions.md`。

### 始终使用 Manifest V3

绝不要生成 Manifest V2 代码。
- 使用 `background.service_worker`，不要使用 `background.scripts`
- 使用 `chrome.action`，不要使用 `chrome.browserAction`
- 使用 `chrome.scripting.executeScript`，不要使用 `chrome.tabs.executeScript`
- `host_permissions` 与 `permissions` 分开
- HTML 中不使用内联脚本，使用 `<script src="file.js">`
- 不使用内联事件处理器，使用 `addEventListener`

---

## 第 2 部分：发布到 Chrome Web Store

管理 `CHROMEWEBSTORE.md`，将它作为 Chrome 扩展项目所有商店条目元数据、权限理由、隐私披露、版本历史和发布准备情况的唯一事实来源。

### 核心流程

每次对 Chrome 扩展项目的修改会影响商店展示时，更新（或创建）项目根目录下的 `CHROMEWEBSTORE.md`。该文件记录开发者需要在 Chrome Developer Dashboard 填写的全部内容，使其能够从一份文档复制粘贴，无需在发布时临时拼凑。

#### 何时创建 CHROMEWEBSTORE.md

发生以下任一情况时立即创建：
- 用户表示希望发布扩展
- 用户要求“准备上架”或“准备发布”
- 你正在构建一个明确会最终上架的新扩展
- 用户询问商店条目的要求

以 `references/webstore/chromewebstore-template.md` 中的模板为起点。生成文件前先阅读该模板。

#### 何时更新 CHROMEWEBSTORE.md

遇到以下情况时更新：
- **面向用户的改动**：更新“Last Updated”日期、描述中的功能清单，并在 Version History 中新增条目
- **manifest.json 改动**：如果 permissions、host_permissions 或 content_scripts 改变，更新 Permissions Justification 章节；每项权限都需要审核团队能够理解的、用朴素英语写明的理由
- **新版本**：在 Version History 中加入版本号、日期和摘要
- **涉及隐私的改动**：如果数据收集、存储或传输发生变化，更新 Privacy & Data Use 章节和隐私政策
- **素材改动**：如果图标或 UI 改变，记录哪些截图需要更新
- **回应拒绝**：如果用户报告 CWS 审核拒绝，更新文件记录修复，并在 Version History 中补充说明

### 如何填写

各章节的信息都应取自实际项目文件：
1. 读取 `manifest.json`，提取 name、version、description、permissions、host_permissions
2. 扫描代码库中的数据收集行为（存储、fetch 调用、分析统计）
3. 检查图标文件及尺寸
4. 查看扩展 UI，理解功能，以便撰写描述

面向商店的文案应具体、诚实，并强调用户收益。Chrome Web Store 审核团队会拒绝含糊描述。“让生活更轻松”会被拒绝；“高亮任意网页中的搜索结果，并允许你将高亮内容保存到本地列表”则能通过。

**绝不要提实现细节。** 用户关心扩展为他们做什么，而不是如何构建。删去对 API、库、框架或代码模式的描述：

| ❌ 实现细节（删除） | ✅ 用户收益（保留） |
|-----------------------------------|--------------------------|
| “使用 MutationObserver 检测页面变化” | “浏览时自动检测新内容” |
| “使用自定义元素和 Shadow DOM 构建” | “无缝工作，不影响页面样式” |
| “通过 service worker 执行后台处理” | “在后台安静运行，不拖慢浏览器” |
| “使用 chrome.storage.sync API” | “设置可在所有设备间同步” |
| “实现 declarativeNetRequest 过滤” | “拦截广告和跟踪器，无需读取页面内容” |

### CHROMEWEBSTORE.md 的章节

生成文件前阅读 `references/webstore/chromewebstore-template.md`，其中定义了各章节的覆盖内容和填写方式。风险最高的章节是 Permissions Justification：为每个 permission 和 host_permission 用朴素英语写出具体理由。“扩展正常运行需要”会被拒绝。隐私政策的生成指导见 `references/webstore/privacy-policy.md`。

### 发布前检查清单

提交前逐项检查 `references/webstore/review-checklist.md`。首次提交最常见的失败原因包括：
- 每个 permission 和 host_permission 都必须有具体理由（不能只写“运行需要”）
- 隐私政策 URL 必须可访问，并与数据使用披露表一致
- 至少提供 1 张 1280×800 或 640×400 的截图
- ZIP 必须排除 `.git/`、`node_modules/`、`.env`、`CHROMEWEBSTORE.md`

### 商店条目文案指南

文案指导与常见拒绝原因见 `references/webstore/store-listing.md`。关键规则：先说功能（“高亮任意网页中的搜索词”），不要先说感受（“重新享受搜索”）。

---

## 参考文件

需要详细 API 模式或发布指导时，在编写代码或内容**之前**先阅读对应文件：

| 主题 | 参考文件 |
|-------|-----------|
| 权限 | `references/extensions/permissions.md` |
| 侧边栏 | `references/extensions/side-panel.md` |
| 内容脚本与 DOM | `references/extensions/content-scripts.md` |
| Popup | `references/extensions/popup-ui.md` |
| Service worker 生命周期 | `references/extensions/service-worker.md` |
| 代码执行与 CSP | `references/extensions/csp-sandbox.md` |
| API 调用 | `references/extensions/api-calling.md` |
| Declarative Net Request | `references/extensions/declarative-net-request.md` |
| Chrome Prompt API | `references/extensions/prompt-api.md` |
| DevTools 面板 | `references/extensions/devtools.md` |
| 身份验证 | `references/extensions/auth-identity.md` |
| 右键菜单 | `references/extensions/context-menus.md` |
| Omnibox | `references/extensions/omnibox.md` |
| 存储 | `references/extensions/storage.md` |
| 标签页与窗口管理 | `references/extensions/tab-management.md` |
| 标签页/桌面采集 | `references/extensions/media-capture.md` |
| 用户脚本 | `references/extensions/user-scripts.md` |
| 消息传递 | `references/extensions/message-passing.md` |
| 图标 | `references/extensions/icons.md` |
| CHROMEWEBSTORE.md 模板 | `references/webstore/chromewebstore-template.md` |
| 隐私政策指南 | `references/webstore/privacy-policy.md` |
| 发布前审核清单 | `references/webstore/review-checklist.md` |
| 商店条目技巧与拒绝原因 | `references/webstore/store-listing.md` |

## 输出检查清单

交付前验证**每一项**：

- [ ] `manifest_version: 3`，任何位置都没有 V2 API
- [ ] manifest 引用的所有图标文件都真实存在且尺寸正确，或者已省略图标
- [ ] 侧边栏有明确的打开触发方式，而不只是 manifest 声明
- [ ] 代码执行使用 sandbox/blob/srcdoc，扩展页面中没有 `eval()`
- [ ] 访问 `tab.url` 或 `tab.title` 时已声明 `tabs` 权限
- [ ] 所有代码使用 `async`/`await`，没有 `.then()` 调用链
- [ ] 内容脚本通过 `requestAnimationFrame` 批量更新 DOM
- [ ] Service worker 不在全局变量中存状态，而是使用 `chrome.storage`
- [ ] HTML 中没有内联脚本或事件处理器
- [ ] 右键菜单操作向用户显示确认反馈
- [ ] 使用 `chrome.action.*` API 时，manifest 中存在 `"action": {}`（或更完整的配置）
- [ ] 从侧边栏读取或操作标签页时，使用 `tabs` + `host_permissions`，而不是 `activeTab`
- [ ] `chrome.devtools.panels.create()` 中的 DevTools 面板路径相对于扩展根目录
- [ ] 离屏文档只使用 `chrome.runtime` 消息传递，不使用 `chrome.downloads`、`chrome.action` 等
- [ ] `chrome.notifications`、`chrome.action.setIcon` 等中的所有图片引用都指向真实文件（或使用 data URL）
- [ ] 标签页/桌面采集使用状态锁，防止重复启动错误
- [ ] `chrome.desktopCapture.chooseDesktopMedia` 传入 `targetTab`，并有 `tabs` 权限
- [ ] `chrome.windows` 使用 `getAll`/`getLastFocused`/`getCurrent`，不使用不存在的 `.query()`
- [ ] service worker 的 `onMessage` 监听器在调用 `chrome.permissions.request()` 前没有任何 `await`（第一个异步间隙后用户手势就会丢失）
- [ ] 使用前检查 `chrome.userScripts` 可用性（用户未启用时，访问 API 就会抛出异常）
- [ ] 用户脚本配置持久化到 `chrome.storage`，并在 `runtime.onInstalled` 的 `"update"` 原因分支中恢复
- [ ] 用户脚本发送消息前调用 `configureWorld({ messaging: true })`；监听 `onUserScriptMessage`，不是 `onMessage`
- [ ] `ScriptSource` 条目必须且只能包含 `code` 或 `file` 中的一个（不能同时包含，也不能都不包含）
- [ ] 用户脚本 `id` 不以下划线开头
- [ ] `sidePanel.setPanelBehavior` 使用 `openPanelOnActionClick`，不是 `openPanelOnActionIconClick`
- [ ] 所有异步操作都有错误处理
- [ ] `host_permissions` 限制到具体域名（除非必要，不使用 `<all_urls>`）
- [ ] 异步响应的 `onMessage` 监听器包含 `return true`
- [ ] `chrome.contextMenus` 的 `contexts` 中使用 `"tab"` 时，需要 Chrome M150+
