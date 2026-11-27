<a id="story-html-parser"></a>

# Story HTML 解析器

`html-parser.mjs` 打包了 parse5 7.3.0 的 `parse` 和 `serializeOuter` 导出，以及 entities 6.0.1。它仅供 Node 故事扫描器与构建器使用，不会嵌入生成的 HTML。打包后的命令无需 npm install。

来源：[parse5](https://github.com/inikulin/parse5/tree/v7.3.0)、[entities](https://github.com/fb55/entities/tree/v6.0.1)。相邻文件分别保留 MIT 和 BSD-2-Clause 许可证。

在仓库根目录安装锁定依赖后，使用以下 stdin 入口通过 esbuild 0.25.11 重新构建：

```js
export { parse, serializeOuter } from 'parse5';
```

```sh
npx --yes esbuild@0.25.11 --bundle --platform=node --format=esm --target=node18 --minify --legal-comments=none --outfile=archify/story/vendor/html-parser.mjs < entry.mjs
```
