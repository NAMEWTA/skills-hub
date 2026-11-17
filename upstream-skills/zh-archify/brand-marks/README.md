<a id="built-in-brand-marks"></a>

# 内置品牌标识

Archify 随包提供一个范围明确的目录，包含 107 个常用品牌，可用于架构图、工作流、时序图、数据流图和生命周期图的节点。品牌标识是作者可以选择添加的身份信息：它绝不替代节点的语义 `type`、颜色、标签或关系。

对于未知网站，采用显式的两阶段流程。先运行 `node bin/archify.mjs brands capture <url> --json`，再使用返回的、由摘要固定的 `brand` 值创作。常规渲染和校验命令不会执行未固定摘要的抓取；内容发生变化或无法取得时，会拒绝继续。

大多数矢量路径与品牌元数据由 Simple Icons 16.28.0 生成。OpenAI 标识的来源可追溯到 OpenAI 官方品牌指南。每个生成条目都在 `renderers/shared/generated-brand-marks.mjs` 中记录来源，以及上游提供时的品牌指南和许可元数据。

品牌名称和徽标可能属于相应所有者的商标。Simple Icons 的 CC0 许可覆盖其汇编成果，并不覆盖所有底层商标或美术作品。贡献者在增加或更新标识之前，必须检查记录的来源、当前品牌指南，以及预期的指代性使用方式。Archify 不暗示任何赞助、认可或合作关系。

编辑 `catalog.json`，然后重新生成已经提交的、无运行时依赖的资源包：

```bash
npm run generate:brand-marks
npm run check:brand-marks
```

不要手工编辑 `renderers/shared/generated-brand-marks.mjs`。
