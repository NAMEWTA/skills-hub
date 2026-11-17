> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/GoogleChrome/modern-web-guidance/blob/64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65/skills/chrome-extensions/references/webstore/review-checklist.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

# 发布前审核清单

每次提交到 Chrome Web Store 前，都应逐项检查此清单。每一项都对应常见的拒绝原因或发布故障。

## Manifest 与安装包

- [ ] **manifest_version 为 3**：新提交不再接受 Manifest V2。
- [ ] **已提高版本号**：CWS 会拒绝版本号 ≤ 当前已发布版本的上传。使用 semver：修复提高 patch，新功能提高 minor，破坏性改动提高 major。
- [ ] **名称与 CHROMEWEBSTORE.md 一致**：manifest.json 的 `name` 字段必须与商店条目填写的名称完全一致。
- [ ] **manifest 中的描述 ≤ 132 个字符**：这是 chrome://extensions 中显示的简短描述，应与 CWS 简短描述相同或相近。
- [ ] **ZIP 中没有不必要的文件**：排除 `.git/`、`node_modules/`、`.env`、`*.map`、测试文件、构建配置、`CHROMEWEBSTORE.md` 本身、`README.md`、`.DS_Store`、`thumbs.db`。使用构建脚本或类似 `.cws-ignore` 的排除方式。
- [ ] **ZIP 小于 2GB**：这是最大包大小。大多数扩展应小于 10MB。
- [ ] **没有绝对文件路径**：manifest.json 中的所有路径必须为相对路径。

## 权限

- [ ] **最少权限**：只申请需要的权限。`<all_urls>` 是风险信号；尽可能使用具体 host_permissions，例如 `*://*.example.com/*`。
- [ ] **每项权限都有理由**：检查 CHROMEWEBSTORE.md 的 Permissions Justification 章节。CWS 控制台为每项权限提供填写栏，提交时需要填写。
- [ ] **优先 activeTab，而非 tabs + <all_urls>**：如果只在用户点击图标时需要访问当前标签页，正确权限是 `activeTab`。
- [ ] **没有未使用权限**：移除使用某权限的功能后，也应从 manifest.json 移除权限。残留权限会导致拒绝。
- [ ] **host_permissions 有理由**：说明哪些功能需要访问哪些域名，以及原因。

## 商店条目内容

- [ ] **详细描述具体明确**：准确说明扩展功能，不使用含糊营销语言。审核团队会阅读。
- [ ] **单一用途范围明确**：用一句话清晰说明主要功能。例如“将书签管理到分类文件夹”，而不是“生产力增强工具”。
- [ ] **没有误导性声称**：不要声称不存在的功能，也不要夸大性能。
- [ ] **没有关键词堆砌**：不要在描述中不自然地重复关键词。
- [ ] **没有商标侵权**：未经授权，不要在扩展名称、描述或截图中使用其他公司的名称、logo 或商标。
- [ ] **联系邮箱有效**：需要持续查看条目上显示的邮箱。Google 会向该地址发送重要通知（下架、政策变化）。

## 图片素材

- [ ] **商店图标**：128×128 PNG，没有透明度问题，小尺寸下仍可辨认。
- [ ] **至少 1 张截图**：1280×800 或 640×400 像素，展示扩展实际使用情况。
- [ ] **截图为当前版本**：与扩展当前 UI 一致，过时截图可能导致拒绝。
- [ ] **没有误导截图**：截图必须准确反映扩展。
- [ ] **没有手机/平板模型图**：除非扩展确实能在这些设备上使用。
- [ ] **小型推广图**（推荐）：440×280 PNG 或 JPEG，用于精选展示。

## 隐私与合规

- [ ] **数据披露表与实际一致**：CWS 数据使用披露选项必须准确反映扩展代码的实际行为。不一致就会被拒绝。
- [ ] **隐私政策 URL 可访问**：亲自打开 URL，确认能加载真实隐私政策，而不是 404 或占位内容。
- [ ] **隐私政策与披露一致**：政策文字必须与披露表中的声明一致。
- [ ] **已披露 chrome.storage.sync**：使用 `chrome.storage.sync` 时，数据会传到 Google 服务器，这属于设备外传输。
- [ ] **禁止远程代码**：扩展不能执行远程托管代码。全部 JS 必须打包在扩展中，运行时不从 CDN 加载脚本（Manifest V3 会强制要求，但仍应核实）。
- [ ] **没有混淆代码**：压缩可以；故意使代码不可读的混淆被禁止，会导致拒绝。

## 功能

- [ ] **扩展正常工作**：在 Chrome 中以未打包方式加载，测试全部功能，并检查控制台错误。
- [ ] **没有崩溃或空白 popup**：测试 popup、侧边栏、选项页、内容脚本，全部应无错误加载。
- [ ] **在目标站点正常工作**：如果针对特定网站，确认在网站当前版本上可用。
- [ ] **优雅降级**：无网络、空数据、chrome:// URL 等受限页面的边界情况都应妥善处理，不应崩溃。
- [ ] **卸载干净**：移除扩展后没有持续副作用。
- [ ] **没有过量资源消耗**：扩展不应明显拖慢浏览。尤其是内容脚本，应保持轻量。

## 更新（现有扩展）

- [ ] **已更新 CHROMEWEBSTORE.md 版本历史**：新增版本号、日期和改动摘要。
- [ ] **已更新 Last Updated 日期**：存在面向用户的改动时。
- [ ] **已更新描述中的功能清单**：新增功能时。
- [ ] **已更新权限理由**：manifest.json 权限变化时。
- [ ] **已更新截图**：UI 显著变化时。
- [ ] **已更新隐私披露**：数据处理方式变化时。

## 打包脚本

可使用类似以下脚本创建干净的提交 ZIP：

```bash
#!/bin/bash
# package-extension.sh — Creates a clean ZIP for Chrome Web Store submission

EXTENSION_NAME="my-extension"
VERSION=$(node -p "require('./manifest.json').version")
OUTPUT="${EXTENSION_NAME}-v${VERSION}.zip"

# Remove old package
rm -f "$OUTPUT"

# Create ZIP excluding dev files
zip -r "$OUTPUT" . \
  -x ".git/*" \
  -x "node_modules/*" \
  -x ".env" \
  -x "*.map" \
  -x "tests/*" \
  -x "__tests__/*" \
  -x "*.test.*" \
  -x "*.spec.*" \
  -x ".eslintrc*" \
  -x ".prettierrc*" \
  -x "tsconfig.json" \
  -x "package.json" \
  -x "package-lock.json" \
  -x "webpack.config.*" \
  -x "vite.config.*" \
  -x "rollup.config.*" \
  -x "CHROMEWEBSTORE.md" \
  -x "README.md" \
  -x "CHANGELOG.md" \
  -x ".DS_Store" \
  -x "Thumbs.db" \
  -x "*.sh" \
  -x "store-assets/*"

echo "Packaged: $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
```

根据项目定制排除列表。关键原则是：只分发 Chrome 运行扩展所必需的内容。

