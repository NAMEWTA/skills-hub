<a id="vendored-pele"></a>

# 随包收录的 Pele

Pele 1.3.0（MIT，<https://github.com/obsidianmd/pele>），来源为 npm tarball `pele-1.3.0.tgz`（sha256 `8c55d4f2335367c31e77550dfbbd00c99533c432b9323aa37730188c0a355da5`）。

仅原样复制 `dist/esm/core.js`，图表入口 `pie`、`xychart`、`quadrantChart`、`sankey`、`radar`、`venn`，以及它们导入的 chunks。Explainer 页面在构建时将这些图表渲染为静态 SVG；交付的页面内部不包含 Pele 代码。
