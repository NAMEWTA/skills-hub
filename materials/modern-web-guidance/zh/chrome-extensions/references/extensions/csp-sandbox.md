> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/extensions/csp-sandbox.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# CSP 与沙箱代码执行

## 扩展 CSP 限制

Chrome 扩展强制执行严格的 Content Security Policy，扩展页面（popup、侧边栏、选项页、新标签页等）不能放宽此策略。

默认阻止：
- `eval()`、`new Function()`、`setTimeout("string")`
- 内联 `<script>` 标签
- 内联事件处理器（`onclick="..."`、`onload="..."` 等）
- `javascript:` URL

## HTML 最佳实践

```html
<!-- ❌ BAD: Inline script -->
<script>
  document.getElementById('btn').onclick = () => alert('hi');
</script>

<!-- ❌ BAD: Inline event handler -->
<button onclick="doThing()">Click</button>

<!-- ✅ GOOD: External script file -->
<script src="popup.js"></script>
```

在 `popup.js` 中：
```js
document.getElementById('btn').addEventListener('click', () => {
  // Handle click
});
```

## 执行用户代码（代码实验场模式）

如果需要执行任意代码（例如类似 CodePen 的实验场），必须采用以下方案之一。**扩展 CSP 会在普通扩展页面中完全阻止 `eval()`、`new Function()` 和内联脚本。** 无法绕开这一点，必须使用沙箱。

### 方案 1：在 manifest 中声明沙箱页面（推荐）

在 manifest.json 中声明沙箱页面。沙箱页面采用较宽松的 CSP，允许 `eval()` 和内联脚本，但不能访问 chrome.* API。

```json
{
  "sandbox": {
    "pages": ["sandbox.html"]
  }
}
```

在扩展页面中通过 iframe 嵌入沙箱：

```html
<!-- playground.html (extension page) -->
<iframe id="preview" src="sandbox.html"></iframe>
```

**关键：** 扩展页面与沙箱 iframe 之间必须使用 `postMessage` 通信。不能直接访问 `iframe.contentDocument` 或 `iframe.contentWindow.document`，否则会抛出：

```
SecurityError: Blocked a frame with origin "chrome-extension://..." from accessing a cross-origin frame.
```

正确模式：

```js
// playground.js — send code to sandbox
const iframe = document.getElementById('preview');
iframe.contentWindow.postMessage({
  html: htmlCode,
  css: cssCode,
  js: jsCode
}, '*');

// sandbox.js — receive and execute
window.addEventListener('message', (event) => {
  const { html, css, js } = event.data;
  // Clear previous content
  document.body.innerHTML = '';
  document.head.querySelectorAll('style.user-style').forEach(s => s.remove());

  // Apply HTML
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  // Apply CSS
  const style = document.createElement('style');
  style.className = 'user-style';
  style.textContent = css;
  document.head.appendChild(style);

  // Execute JS (eval is allowed in sandbox!)
  try {
    eval(js);
  } catch (e) {
    const errEl = document.createElement('pre');
    errEl.style.color = 'red';
    errEl.textContent = e.message;
    document.body.appendChild(errEl);
  }
});
```

### 方案 2：iframe 中的 Blob URL

通过 blob URL 创建自包含 HTML 文档：

```js
function updatePreview(htmlCode, cssCode, jsCode) {
  const html = `
<!DOCTYPE html>
<html>
<head><style>${cssCode}</style></head>
<body>
  ${htmlCode}
  <script>${jsCode}<\/script>
</body>
</html>
`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const iframe = document.getElementById('preview');
  // Revoke previous URL
  if (iframe.dataset.blobUrl) URL.revokeObjectURL(iframe.dataset.blobUrl);
  iframe.dataset.blobUrl = url;
  iframe.src = url;
}
```

### 方案 3：srcdoc 属性

```js
const iframe = document.getElementById('preview');
iframe.srcdoc = `
  <!DOCTYPE html>
  <style>${cssCode}</style>
  ${htmlCode}
  <script>${jsCode}<\/script>
`;
```

blob URL 和 srcdoc 都会创建独立的 origin，从而绕过扩展的 CSP。但它们也不能访问 chrome.* API，而且扩展页面不能直接访问它们的 DOM（与 sandbox 相同的跨源限制）。

### 不应采用的方式

```js
// ❌ WILL FAIL: Trying to set iframe content directly
iframe.contentDocument.open();
iframe.contentDocument.write(html);
iframe.contentDocument.close();

// ❌ WILL FAIL: Accessing cross-origin sandbox DOM
const doc = iframe.contentWindow.document;
doc.body.innerHTML = html;

// ❌ WILL FAIL: eval in a normal extension page
eval(userCode); // CSP blocks this
```

## 远程资源的 CSP

扩展页面默认不能加载远程脚本。如果需要外部库：

1. **打包它们**：下载并包含在扩展中
2. **使用 chrome.scripting 注入网页**：网页有自己的 CSP

对于注入网页的内容脚本，网页 CSP 不适用于内容脚本自身的代码。内容脚本运行在隔离世界中。

