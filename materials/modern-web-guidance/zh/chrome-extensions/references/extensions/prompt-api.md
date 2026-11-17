> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/prompt-api.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# Chrome Prompt API（LanguageModel）：扩展专用说明

`LanguageModel` API（Prompt API）适用于所有扩展上下文，包括 service worker、popup、侧边栏和其他扩展页面，无需额外的 manifest 权限。

通用 Prompt API 用法（可用性检测、会话创建、流式输出、会话管理）请使用 `modern-web-guidance` 技能。

## 已弃用的命名空间

曾使用 origin trial 的扩展可能仍保留旧 API，应移除：

```js
// ❌ OLD — deprecated
const session = await self.ai.languageModel.create();

// ✅ CURRENT (Chrome 138+)
const session = await LanguageModel.create({ ... });
```

同时从 manifest.json 移除已过期的权限：
```json
"permissions": ["aiLanguageModelOriginTrial"]  // ❌ remove this
```

## 扩展专用：`LanguageModel.params()`

扩展可以访问 `LanguageModel.params()`，返回 Web 页面无法获取的模型约束：

```js
const params = await LanguageModel.params();
// { defaultTopK: 3, maxTopK: 128, defaultTemperature: 1, maxTemperature: 2 }

const session = await LanguageModel.create({
  temperature: 0.7,
  topK: 5
});
```

## 完整扩展示例：页面摘要器

以下完整接线示例结合 manifest、service worker 和侧边栏。注意使用 `tabs` + `host_permissions`，而不是 `activeTab`：侧边栏按钮点击不会激活 `activeTab`（参见规则 12）。

### manifest.json
```json
{
  "manifest_version": 3,
  "name": "AI Page Summarizer",
  "version": "1.0",
  "permissions": ["sidePanel", "tabs", "scripting"],
  "host_permissions": ["<all_urls>"],
  "background": { "service_worker": "service-worker.js" },
  "side_panel": { "default_path": "sidepanel/sidepanel.html" },
  "action": { "default_title": "Summarize Page" }
}
```

### service-worker.js
```js
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});
```

### sidepanel/sidepanel.js
```js
const statusEl = document.getElementById('status');
const summaryEl = document.getElementById('summary');

document.getElementById('summarize').addEventListener('click', async () => {
  if (!globalThis.LanguageModel) {
    statusEl.textContent = 'Prompt API not available in this browser.';
    return;
  }

  const availability = await LanguageModel.availability({
    expectedInputs: [{ type: "text", languages: ["en"] }],
    expectedOutputs: [{ type: "text", languages: ["en"] }]
  });
  if (availability === 'unavailable') {
    statusEl.textContent = 'AI model not available on this device.';
    return;
  }

  // Requires "tabs" + "host_permissions" — activeTab does NOT work from a side panel button
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [{ result: pageText }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const body = document.body.cloneNode(true);
      body.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove());
      return body.innerText.substring(0, 4000);
    }
  });

  const session = await LanguageModel.create({
    expectedInputs: [{ type: "text", languages: ["en"] }],
    expectedOutputs: [{ type: "text", languages: ["en"] }],
    initialPrompts: [{ role: 'system', content: 'Summarize web page content in 3-5 bullet points.' }],
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        const pct = e.total ? Math.floor((e.loaded / e.total) * 100) : 0;
        statusEl.textContent = `Downloading model: ${pct}%`;
      });
    }
  });

  summaryEl.textContent = '';
  for await (const chunk of session.promptStreaming(`Summarize:\n\n${pageText}`)) {
    summaryEl.textContent += chunk; // APPEND — do not replace
  }
  session.destroy();
});
```

