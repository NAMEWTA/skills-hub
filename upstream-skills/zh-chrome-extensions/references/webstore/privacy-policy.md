> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/webstore/privacy-policy.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# 隐私政策指南

## 何时必须提供隐私政策？

扩展满足以下任一情况时，**必须**提供隐私政策 URL：
- 处理个人或敏感用户数据（按 CWS 政策定义）
- 使用以下任一权限：`identity`、`cookies`、`webRequest`、`browsingData`、`history`、`bookmarks`、`topSites`、`<all_urls>` 主机权限
- 收集任何形式的分析数据或遥测
- 将任何数据传出用户设备

即使不收集数据，也**建议**所有扩展提供隐私政策。这样能体现专业性，并在审核者标记扩展时避免延误。

## 托管位置

隐私政策必须位于公开可访问的 URL。可选方式：
- **GitHub Pages**：免费，可做版本控制。在 `docs/` 分支中创建 `privacy.md`。
- **GitHub Gist**：快速简便。创建公开 gist，链接到 raw URL。
- **项目网站**：如果有网站，添加 `/privacy` 页面。
- **Notion / Google Sites**：免费托管页面，URL 稳定。

不要使用可能失效或变化的 URL。CWS 审核团队会检查链接。

## 应包含的内容

### 最简政策（不收集数据）

如果扩展确实不收集任何数据，政策可以很简短：

模板中的英文占位符分别表示扩展名称、更新日期和联系邮箱。

```
[Extension Name] 隐私政策

最后更新：[Date]

[Extension Name] 不收集、存储或传输任何个人数据或浏览信息。
所有数据都保留在你的设备上。

本扩展不使用 cookie、分析统计或第三方服务。

如有疑问，请联系 [email]。
```

### 标准政策（收集部分数据）

如果扩展存储或传输数据，应覆盖以下主题：

1. **收集哪些数据**：要具体。“用户偏好”不够明确，应写“你选择的主题偏好（浅色/深色）及保存的高亮颜色”。

2. **如何存储数据**：仅本地存储？通过 chrome.storage.sync 同步？发送到服务器？

3. **为什么收集数据**：将每种数据关联到具体功能。

4. **第三方服务**：如果使用任何 API（分析、身份验证等），列出名称，并链接到其隐私政策。

5. **数据共享**：说明是否与第三方共享数据。如果共享，说明与谁共享及原因；如果不共享，明确说明。

6. **数据保留**：数据保留多久？用户能否删除？

7. **用户控制**：用户如何访问、导出或删除数据？如果扩展有“清除数据”按钮，应说明。

8. **政策变更**：说明数据处理方式改变时会更新政策，以及如何通知用户。

9. **联系方式**：用于隐私问题的邮箱或 URL。

### 模板

模板保留上游英文占位符。请依次填写：扩展名称、更新日期、每种收集数据及所需功能、存储机制（仅本地、同步或服务器端）、各用途及对应功能、第三方服务及其隐私政策链接（未使用时明确说明本扩展不使用任何第三方服务）、是否共享数据及共享对象和原因、保留期限与删除方式、政策更新的方式和时机以及用户通知方式、隐私咨询邮箱或支持 URL。

```
[Extension Name] 隐私政策

最后更新：[Date]

## 我们收集哪些数据

[Describe each type of data collected and the feature that requires it.]

## 数据如何存储

[Describe storage mechanism — local only, synced, or server-side.]

## 数据如何使用

[Describe each use case. Tie to specific features.]

## 第三方服务

[List any third-party services used. Link to their privacy policies.
If none, state "This extension does not use any third-party services."]

## 数据共享

[State whether data is shared. If yes, with whom and why.]

## 数据保留与删除

[How long data is kept. How users can delete it.]

## 本政策的变更

[How and when the policy may be updated. How users will be notified.]

## 联系方式

[Email or support URL for privacy inquiries.]
```

## 常见错误

- **政策与数据披露表不一致**：CWS 数据披露表和隐私政策必须一致。如果表中说“不收集数据”，但政策提到分析统计，就会被拒绝。

- **政策过于含糊**：“我们可能收集一些数据”不能接受。请具体说明。

- **失效链接**：隐私政策 URL 返回 404 时，提交会被自动拒绝。提交前验证链接。

- **遗漏数据类型**：如果扩展使用 `chrome.storage.sync`，数据会传到 Google 服务器，应披露。如果有任何 `fetch()` 调用，应披露发送的内容。

- **没有联系方式**：CWS 要求用户能够就隐私问题联系你。至少提供一个邮箱。

