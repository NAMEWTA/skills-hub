# 从扩展调用外部 API

## 权限

通常，扩展发起的 fetch 请求遵循常规 CORS 规则。

要判断这是否足够，使用 `curl` 携带测试 origin 调用 API。例如：

```
curl -H "Origin: https://example.com" -I https://api.openweathermap.org/data/2.5/weather?q=London&appid=KEY`
```

如果响应的 `Access-Control-Allow-Origin` 标头值为 `*` 或 `https://example.com`，该 API 支持 CORS。

如果 API 不支持 CORS，申请主机权限以绕过这些限制：

```json
{
  "host_permissions": [
    "https://no-cors-api.example.com/*"
  ]
}
```

**不要仅为了 API 调用就使用 `<all_urls>`。** 将范围限制到具体的 API 域名。

## 在哪里发起 API 调用

任何扩展上下文（service worker、popup、侧边栏、内容脚本）都可以调用 API：

```js
// From popup or service worker
const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=KEY');
const data = await response.json();
```

**内容脚本**也可以发起 fetch 调用，但要遵循网页的 CORS 规则。

## 错误处理模式

```js
async function callAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    if (err instanceof TypeError) {
      // Network error (offline, DNS failure, etc.)
      console.error('Network error:', err.message);
    } else {
      console.error('API error:', err.message);
    }
    return null;
  }
}
```

## API Key

- 绝不要在发布的扩展中硬编码 API Key
- 用户提供的 Key 使用 `chrome.storage.local` 保存
- 自有后端使用 `chrome.identity` 验证身份，不要嵌入 Key
- 明确标记占位 Key：`const API_KEY = 'YOUR_API_KEY_HERE';`

## Service worker 注意事项

从 service worker 发起 API 调用时，要记住它可能终止。对于长轮询或类似 webhook 的模式，使用 `chrome.offscreen` 创建持续存活的离屏文档，或使用 `chrome.alarms` 定期轮询。

