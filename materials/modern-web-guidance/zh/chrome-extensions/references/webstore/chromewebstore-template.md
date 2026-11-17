# CHROMEWEBSTORE.md 模板

将此模板复制到项目根目录，命名为 `CHROMEWEBSTORE.md`，然后填写每个章节。标有 `[REQUIRED]` 的字段必须在提交前填写完成；标有 `[RECOMMENDED]` 的字段可选，但能提高条目质量和获批机会。

模板中的英文占位符依次表示扩展名称和特定地区列表；填写时替换为实际信息。

---

```markdown
# Chrome Web Store 条目 — [Extension Name]

> 最后更新（Last Updated）：YYYY-MM-DD

## 商店条目（Store Listing）

**扩展名称（Extension Name）** [REQUIRED]
<!-- 必须与 manifest.json 的 "name" 一致。最多 75 个字符。 -->


**简短描述（Short Description）** [REQUIRED]
<!-- 最多 132 个字符。在搜索结果和展示卡片中显示。具体说明功能。 -->


**详细描述（Detailed Description）** [REQUIRED]
<!-- 最多 16,000 个字符。建议结构：
     第 1 行：用一句话概括扩展的功能
     第 2 段：关键功能（使用换行，不使用 Markdown 项目符号，CWS 会移除 Markdown）
     第 3 段：使用方式（分步骤）
     第 4 段：隐私/权限说明（建立信任）
     第 5 段：支持/反馈信息

     从用户角度写作：扩展为他们做什么，而不是如何实现。
     绝不要提实现细节：所用 API、库、框架、代码模式。

     ❌ “使用 MutationObserver 和自定义元素跟踪页面变化”
     ✅ “滚动时自动检测新内容”

     ❌ “通过 service worker 执行后台处理”
     ✅ “在后台安静运行，不拖慢浏览器”

     ❌ “实现 declarativeNetRequest 进行网络过滤”
     ✅ “拦截广告和跟踪器，无需读取页面内容”
-->


**类别（Category）** [REQUIRED]
<!-- 选择一项：Accessibility、Blogging、Developer Tools、Fun、News & Weather、
     Photos、Productivity、Search Tools、Shopping、Social & Communication、Sports -->


**单一用途（Single Purpose）** [REQUIRED]
<!-- 一句话，范围明确且易于理解。
     好：“高亮并保存网页中选中的文本”
     差：“帮助你更好工作的生产力工具” -->


**主要语言（Primary Language）** [REQUIRED]
<!-- 例如 English、German 等。 -->


## 图片与素材（Graphics & Assets）

| 素材 | 尺寸 | 状态 | 文件名 |
|-------|-----------|--------|----------|
| 商店图标 [REQUIRED] | 128×128 PNG | ⬜ 尚未创建 | |
| 截图 1 [REQUIRED] | 1280×800 或 640×400 | ⬜ 尚未创建 | |
| 截图 2 [RECOMMENDED] | 1280×800 或 640×400 | ⬜ 尚未创建 | |
| 截图 3 [RECOMMENDED] | 1280×800 或 640×400 | ⬜ 尚未创建 | |
| 截图 4 | 1280×800 或 640×400 | ⬜ 尚未创建 | |
| 截图 5 | 1280×800 或 640×400 | ⬜ 尚未创建 | |
| 小型推广图 [RECOMMENDED] | 440×280 | ⬜ 尚未创建 | |
| 大型推广图 | 1400×560 | ⬜ 尚未创建 | |

<!-- 状态选项：⬜ 尚未创建 | 🟡 需要更新 | ✅ 已就绪 -->

### 截图说明（Screenshot Notes）
<!-- 说明每张截图应展示什么。好的截图展示扩展的实际使用情况，而不只是 popup。
     如有帮助，可以添加标注。 -->


## 权限理由（Permissions Justification）

<!-- manifest.json 中的每项权限都需要理由。审核团队会阅读这些内容。
     具体说明为什么需要该权限，以及哪个面向用户的功能使用它。
     “功能需要”会被拒绝。 -->

| 权限 | 类型 | 理由 |
|------------|------|---------------|
| | permissions | |
| | host_permissions | |

<!-- 类型只能是 "permissions" 或 "host_permissions" -->


## 隐私与数据使用（Privacy & Data Use）

<!-- 与 CWS 数据使用披露表对应。必须全面且准确，
     声明与代码行为不一致会导致拒绝。 -->

### 数据收集（Data Collection）

**扩展是否收集用户数据？** 是 / 否

<!-- 如果是，填写下表。如果否，跳到数据使用确认。 -->

| 数据类型 | 是否收集？ | 是否传输到设备之外？ | 用途 | 是否与第三方共享？ |
|-----------|-----------|------------------------|---------|---------------------------|
| 可识别个人身份的信息 | | | | |
| 健康信息 | | | | |
| 财务信息 | | | | |
| 身份验证信息 | | | | |
| 个人通信 | | | | |
| 位置 | | | | |
| 浏览历史 | | | | |
| 用户活动 | | | | |
| 网站内容 | | | | |

### 数据使用确认（Data Use Certification）
<!-- 勾选所有适用项： -->
- [ ] 数据不会出售给第三方
- [ ] 数据不会用于与扩展核心功能无关的目的
- [ ] 数据不会用于信用评估或贷款目的


## 隐私政策（Privacy Policy）

**隐私政策 URL** [REQUIRED]

<!-- 将政策放在公开可访问的 URL。GitHub Pages、自有网站或 Notion 页面都可以。
     模板见 references/webstore/privacy-policy.md。 -->


## 分发（Distribution）

**可见性**：Public / Unlisted / Private
**地区**：所有地区 / [List specific regions]

## 开发者信息（Developer Info）

**发布者名称** [REQUIRED]

**联系邮箱** [REQUIRED]
<!-- 在商店条目上公开显示。 -->

**支持 URL / 邮箱** [RECOMMENDED]
<!-- 用户获取帮助的位置。可以是 GitHub Issues 页面、邮箱或支持站点。 -->

**主页 URL** [RECOMMENDED]


## 版本历史（Version History）

<!-- 每个提交到 Chrome Web Store 的版本都添加一条记录。
     最新版本排在最前。 -->

| 版本 | 日期 | 改动 | 状态 |
|---------|------|---------|--------|
| | | | 草稿 |

<!-- 状态选项：草稿 | 已提交 | 审核中 | 已发布 | 已拒绝 -->


## 审核记录（Review Notes）

<!-- 跟踪拒绝原因、与审核团队的沟通以及已应用的修复。
     本节只供内部记录，不发布到商店。 -->

### 已知问题 / 限制（Known Issues / Limitations）
<!-- 记录审核者可能标记或用户应知道的任何内容。 -->


### 拒绝历史（Rejection History）
<!-- 如适用：
| 日期 | 原因 | 已应用的修复 | 是否重新提交 |
|------|--------|-------------|-------------|
-->

```

