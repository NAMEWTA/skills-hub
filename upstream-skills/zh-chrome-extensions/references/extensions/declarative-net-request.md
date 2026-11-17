# Declarative Net Request（内容过滤）

## 配置

```json
{
  "permissions": ["declarativeNetRequest"],
  "declarative_net_request": {
    "rule_resources": [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules/rules.json"
    }]
  }
}
```

要使用 `onRuleMatchedDebug`，添加 `"declarativeNetRequestFeedback"` 权限（仅开发环境）。

## 规则格式

`rules/rules.json`：
```json
[
  {
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "doubleclick.net",
      "resourceTypes": ["script", "image", "xmlhttprequest", "sub_frame"]
    }
  },
  {
    "id": 2,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "google-analytics.com",
      "resourceTypes": ["script", "xmlhttprequest"]
    }
  }
]
```

### 规则字段

- `id`：每条规则唯一的整数
- `priority`：发生冲突时优先级较高的规则胜出
- `action.type`：`"block"`、`"redirect"`、`"allow"`、`"modifyHeaders"`、`"allowAllRequests"`、`"upgradeScheme"`
- `condition.urlFilter`：匹配模式（支持 `*`、`||`、`|`、`^`）
- `condition.resourceTypes`：要匹配的资源类型数组

### URL 过滤模式

| 模式 | 匹配内容 |
|---------|---------|
| `"doubleclick.net"` | 任何包含“doubleclick.net”的 URL |
| `"||doubleclick.net"` | 域名以 doubleclick.net 开头 |
| `"||example.com/ads/*"` | 特定路径模式 |
| `*://*.tracking.com/*` | 子域名匹配 |

### 资源类型

`main_frame`、`sub_frame`、`stylesheet`、`script`、`image`、`font`、`object`、`xmlhttprequest`、`ping`、`csp_report`、`media`、`websocket`、`webtransport`、`webbundle`、`other`

## 动态规则（运行时）

```js
// Add rules at runtime
await chrome.declarativeNetRequest.updateDynamicRules({
  addRules: [{
    id: 1000,
    priority: 1,
    action: { type: 'block' },
    condition: { urlFilter: 'ads.example.com' }
  }],
  removeRuleIds: [] // IDs to remove
});
```

## 跟踪被拦截的请求

`onRuleMatchedDebug` 只在开发环境（未打包）中可用，并且需要 `declarativeNetRequestFeedback`：

```js
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  // info.request, info.rule
});
```

生产环境中，通过 `webRequest`（仅观察）统计，或使用 `webNavigation` 维护计数：

```js
// Alternative: Use webRequest to observe (requires host_permissions)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Count requests to known tracking domains
    if (isTrackerDomain(new URL(details.url).hostname)) {
      incrementBlockCount(details.tabId);
    }
  },
  { urls: ["<all_urls>"] }
);
```

## 限额

- 静态规则：每个扩展保证 30,000 条，另外可使用扩展之间共享池中的 300,000 条额度
- 动态规则：30,000 条
- 会话规则：5,000 条

