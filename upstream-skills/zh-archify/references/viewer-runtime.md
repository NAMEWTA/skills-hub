<a id="viewer-runtime-reference"></a>

# 查看器运行时参考

仅在用户询问面向阅读者的能力时阅读本文件。常规生成不需要实现或重新编写这些功能的文档；它们已经包含在生成的 HTML 中。

<a id="exploration"></a>

## 探索

- Diagram Guide 列出当前可用的操作和快捷键。通过指南按钮或 `?` 打开；它绝不会自动打开。
- Reading Depth 在默认的 100% 缩放下从 READ 开始，在 175% 显示 FULL 细节，只有低于 100% 时才回退到 MAP。聚焦、路径与语义交互在任何缩放级别都能显示其确切事实。
- Semantic Lens 汇总选中的节点／关系类型，不改变作者定义的几何。
- Intent Trace 在正式聚焦前，预览精细指针或键盘选中的目标。
- Node Finder 搜索标签和稳定 ID。
- Semantic Passport 在聚焦时打开，展示作者定义的上游／下游事实，支持可复制的深链接，具有明确的关闭操作，在真正的外部激活和 Escape 时关闭，并且绝不进入规范导出。
- Semantic Radar 映射可见视口和作者定义的图，不会成为第二个事实来源。
- Direct Relationship Pin 使唯一的已编译关系可以操作，同时保留作者定义的线条和稳定关系身份。如果来源／目标／标签／ID 元数据冲突，必须拒绝继续。
- Route Probe 仅基于作者定义的有向关系解析恰好两个端点。它绝不根据几何位置推断路径。

<a id="embedded-reading-addresses"></a>

## 嵌入式阅读地址

当宿主通过不透明的 `srcdoc` frame 展示原生阅读器时，可以在阅读器的 `html` 元素上设置 `data-reading-link-template`。提供包含恰好一个 `{state}` 标记的绝对 HTTP、HTTPS 或 file URL，例如 `https://example.test/architecture#page=mechanism&reader={state}`。原生 Focus、Relationship、Reach、Route 和 Lens 的复制操作，会将该标记替换为经过百分号编码的不透明查询状态。宿主保留自身页面身份，并将该值恢复为原生 frame 的 hash；它绝不解析或重建查询。

未配置时保留独立页面链接。无效、包含凭据或不受支持的 URL 模板，会使复制失败，而且不访问剪贴板。此接入点只改变被复制的地址，不改变查询解析、历史、权限、嵌入隔离或作者定义的几何，也不新增网络或存储接口。

<a id="motion-and-presentation"></a>

## 动效与演示

每个渲染出的图表默认启用由阅读者控制的 Live／Still 动效。在 Live 模式下，每条边都在同一个共享周期中播放小型光效：一颗彗星（辉光、光晕、尾迹、头部，以及每条边上更暗的回声）沿下游级联，留下柔和尾迹，并在目标节点处以涟漪落下；节点只入场一次，随后按作者定义的步骤交错，在同一周期中发光。相位遵循作者定义的步骤顺序（来源节点的等级；时序图中则按时间先后）；流动效果运行在独立的查看器覆盖层上，原始线型和箭头保持完整。较短的边使用更大、更亮的彗星；回声保持较暗。没有已保存偏好时，新页面从 Still 开始。选择 Live 会启动连续流动并保存该偏好；选择 Still 会停止动效并清除已保存的 Live 偏好。已有的 Still 偏好仍保持 Still。语义探索会暂时占用动效预算，该操作释放后才恢复连续流动。没有连接的图表只保留有界的节点入场效果，不会凭空创造流动。省略 `meta.animation`；历史值 `"trace"` 和 `"none"` 仍因输入兼容而被接受，但不改变该默认行为。减少动效、隐藏页面、打印和规范导出，都保留完整的静态含义。Presentation Stage 改变查看器界面和取景，绝不改变作者定义的几何。这不是面向移动设备的产品功能；窄布局只保证内容约束在范围内。

<a id="canonical-exports"></a>

## 规范导出

导出菜单可复制／下载完整图表的 PNG、下载 JPEG／WebP、下载双主题 SVG，并录制启用轨迹动效的 WebM。查看器状态——Guide、Lens、查找器、聚焦、路径、相机、雷达、演示模式、动效所有权与临时覆盖层——必须从规范导出中移除。

打开、关闭或完成导出时，会保留当前的 Focus／Reach 选择，方便继续探索。由导出自身触发的下载激活不属于外部关闭操作；真正的外部激活和 Escape 仍维持既有行为。完整图表的 PNG／SVG 导出仍包含完整的规范图表，而 Reach Share Card 表达当前作者定义的闭包。

<a id="route-share-card"></a>

### 路径分享卡

真实的有向 Route Probe 成功解析后，阅读者可以使用 **Export → Route Share Card**。它复用完全相同的有序路径快照和共享的 Share Card 接入点：`format=share-card`、`variant=route`。隔离副本只能使用静态的 `data-share-route-*` 装饰。它只支持下载；路径过期、不可达或冲突时会拒绝继续，并且绝不会成为规范产物。

<a id="reach-share-card"></a>

### 可达范围分享卡

作者定义的可达性查询得到非空结果后，阅读者可以使用 **Export → Reach Share Card**。它直接消费已经解析出的上游／下游节点与边集合，不重新遍历：`format=share-card`、`variant=reach`。隔离副本只能使用静态的 `data-share-reach-*` 装饰。它只支持下载。应称其为作者定义的可达性，而不是影响、爆炸半径、破坏或运行时因果关系。

<a id="truth-boundary"></a>

## 事实边界

查看器导出是沟通素材，不能替代经过检查的 HTML、确定性的交付回执或真正的视觉审阅。不要为了这些仅属于查看器的能力，新增托管服务、存储接口、依赖、schema 分支或移动产品界面。
