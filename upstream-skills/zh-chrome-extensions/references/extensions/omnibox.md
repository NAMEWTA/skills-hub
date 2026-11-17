# Omnibox 集成

## 配置

```json
{
  "omnibox": { "keyword": "wiki" }
}
```

用户在地址栏输入 `wiki` + 空格即可激活。

## 提供建议

```js
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  if (text.length < 2) return;

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(text)}&limit=5&format=json`
    );
    const [, titles, , urls] = await response.json();

    const suggestions = titles.map((title, i) => ({
      content: urls[i],
      description: `${title} - <url>${urls[i]}</url>`
    }));

    suggest(suggestions);
  } catch (err) {
    console.error('Search failed:', err);
  }
});
```

## 处理选择

```js
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const url = text.startsWith('http') ? text
    : `https://en.wikipedia.org/wiki/${encodeURIComponent(text)}`;

  switch (disposition) {
    case 'currentTab':
      chrome.tabs.update({ url });
      break;
    case 'newForegroundTab':
      chrome.tabs.create({ url });
      break;
    case 'newBackgroundTab':
      chrome.tabs.create({ url, active: false });
      break;
  }
});
```

## 描述格式

建议支持类似 XML 的格式：
- `<url>text</url>`：渲染为 URL 样式
- `<match>text</match>`：加粗高亮匹配内容
- `<dim>text</dim>`：弱化/次要文字

## 默认建议

```js
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.omnibox.setDefaultSuggestion({
    description: `Search Wikipedia for "<match>${text}</match>"`
  });
  // ... fetch and suggest
});
```

## 所需的 host_permissions

如果从 API 获取建议，声明：
```json
{
  "host_permissions": ["https://en.wikipedia.org/*"]
}
```

