> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/service-worker.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# Service worker 生命周期与状态管理

## 核心问题

Chrome 会在约 30 秒无活动后终止扩展 service worker。与 Manifest V2 的持久后台页面不同，不能依赖内存中的状态。

## 规则

1. **绝不要将状态保存在全局变量中**：将每次事件处理都视为 SW 刚刚启动
2. **全部持久状态使用 chrome.storage**：按需读取，修改后写回
3. **定时任务使用 chrome.alarms**：不要用 setTimeout/setInterval（它们会随 SW 一起终止）
4. **临时会话状态使用 chrome.storage.session**：SW 重启后保留，浏览器重启后不保留

## 存储层级选择

| 需求 | 使用 |
|------|-----|
| 浏览器重启后保留，并跨设备同步 | `chrome.storage.sync`（每项 8KB，总计 100KB） |
| 浏览器重启后保留，仅本地保存 | `chrome.storage.local`（默认 10MB） |
| 仅 SW 重启后保留 | `chrome.storage.session`（默认 10MB） |
| 从不持久化（应避免） | 全局变量 ❌ |

## 模式：按需读取状态

```js
// ❌ BAD: State in memory
let count = 0;
chrome.webNavigation.onCompleted.addListener(() => {
  count++;
  chrome.action.setBadgeText({ text: String(count) });
});

// ✅ GOOD: State in storage
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId !== 0) return; // Main frame only
  const data = await chrome.storage.local.get({ visitCount: 0 });
  data.visitCount++;
  await chrome.storage.local.set(data);
  chrome.action.setBadgeText({ text: String(data.visitCount) });
});
```

## 模式：用 Alarm 代替 Timer

```js
// ❌ BAD: Timer dies when SW terminates
setInterval(() => checkForUpdates(), 60000);

// ✅ GOOD: Alarm persists
chrome.alarms.create('check-updates', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'check-updates') {
    checkForUpdates();
  }
});
```

最小 alarm 间隔为 0.5 分钟。

## 模式：一次性初始化

```js
// Set up defaults and context menus on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.local.set({ settings: defaultSettings });
  }
  // Context menus must be re-created (they persist, but re-creating is idempotent)
  chrome.contextMenus.create({
    id: 'myItem',
    title: 'My Context Menu Item',
    contexts: ['selection']
  });
});
```

## 模式：必要时保持 SW 存活

有时需要让 SW 持续运行较长的操作。采用以下方案之一：

1. **chrome.offscreen**：为长任务创建离屏文档
2. **定期写入存储**：每次 chrome.storage 调用都会重置空闲计时器
3. **活动 port 连接**：打开的 port 会保持 SW 存活

```js
// Port-based keepalive from popup/side panel
const port = chrome.runtime.connect({ name: 'keepalive' });
// The SW stays alive as long as this port is open
```

⚠️ 不要滥用保活模式。Chrome 未来版本可能施加更严格的限制。

## 模式：事件注册

所有事件监听器都必须在 service worker 顶层同步注册。Chrome 会向重启后的 SW 重放事件，但只针对同步注册的监听器。

```js
// ✅ GOOD: Top-level registration
chrome.runtime.onMessage.addListener(handleMessage);
chrome.tabs.onUpdated.addListener(handleTabUpdate);
chrome.webNavigation.onCompleted.addListener(handleNavigation);

// ❌ BAD: Conditional or async registration
async function setup() {
  const { enabled } = await chrome.storage.local.get('enabled');
  if (enabled) {
    chrome.tabs.onUpdated.addListener(handleTabUpdate); // Too late!
  }
}
setup();
```

应注册全部监听器，在监听器内部检查条件：

```js
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const { enabled } = await chrome.storage.local.get('enabled');
  if (!enabled) return;
  // Process...
});
```

## 基于日期的重置

每日计数器应同时保存日期和计数：

```js
function getToday() {
  return new Date().toISOString().split('T')[0]; // "2025-01-15"
}

async function incrementDailyCount() {
  const { dailyCount = 0, countDate = '' } = await chrome.storage.local.get(['dailyCount', 'countDate']);
  const today = getToday();

  if (countDate !== today) {
    // New day — reset
    await chrome.storage.local.set({ dailyCount: 1, countDate: today });
    return 1;
  } else {
    const newCount = dailyCount + 1;
    await chrome.storage.local.set({ dailyCount: newCount });
    return newCount;
  }
}
```

