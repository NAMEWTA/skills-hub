> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/tt-a1i/archify/blob/a7ed6fd6657da90414831d1d42cf95987188750c/archify/renderers/class/README.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

<a id="class-and-interface-renderer"></a>

# 类与接口渲染器

将 `diagram_type: "class"` 的 JSON 文件渲染到标准 Archify HTML 模板中。

```bash
node archify/renderers/class/render-class.mjs input.class.json output.html
```

渲染器使用随包独立校验器，按照 `archify/schemas/class.schema.json` 校验输入，不需要安装依赖。省略 `output.html` 时，使用 `meta.output`，或回退到当前工作目录中的 `class.html`。`--layout-json` 打印已摆放的类型与路由，不写入 HTML。

<a id="input"></a>

## 输入

```json
{
  "schema_version": 1,
  "diagram_type": "class",
  "meta": { "title": "Payment module types" },
  "types": [],
  "relationships": [],
  "cards": []
}
```

类型通过 `label` 承载名称，包含 `kind`、`row`／`col` 网格单元（或绝对 `pos`），以及可选的 `sublabel`、`attributes`、`methods`、`sources`。作者选择解释所需的成员；类型可以不显示任何成员。

| `kind` | 页头 | 配色系列 |
| --- | --- | --- |
| `class` | 仅名称 | backend |
| `abstract` | `«abstract»`，名称斜体 | backend |
| `interface` | `«interface»` | frontend |
| `enum` | `«enumeration»`；`attributes` 为常量 | messagebus |
| `record` | `«record»` | database |

属性为 `{ name, type?, visibility?, static? }`，显示为 `+ name: Type`。方法为 `{ name, parameters?, returns?, visibility?, static?, abstract? }`，显示为 `+ name(parameters): Returns`。可见性采用 UML 符号：`+` public、`#` protected、`~` package、`-` private；静态成员加下划线，抽象方法使用斜体。接口属性描述属性契约（例如 TypeScript 的 `interface Person { name: string }`）；它们不暗示实现中存储的状态。接口也可以声明静态常量。

<a id="relationships"></a>

## 关系

每条关系都按 `from` -> `to` 读取，整个记法由 `kind` 决定，因此实现关系绝不会看起来像调用箭头：

| `kind` | 含义 | 线条 | 标记 |
| --- | --- | --- | --- |
| `dependency` | `from` 使用 `to` | 虚线 | `to` 处开放箭头 |
| `association` | `from` 持有对 `to` 的引用 | 实线 | `to` 处开放箭头 |
| `inheritance` | `from` 继承 `to` | 实线 | `to` 处空心三角 |
| `realization` | `from` 实现接口 `to` | 虚线 | `to` 处空心三角 |
| `composition` | `from` 拥有 `to` 及其生命周期 | 实线 | `from` 处实心菱形 |
| `aggregation` | `from` 聚合 `to`，但不拥有它 | 实线 | `from` 处空心菱形 |

语义检查：realization 从非接口指向接口（`class/realization-target`）；inheritance 不能跨越接口边界（`class/inheritance-kind`）；inheritance 不能形成环（`class/inheritance-cycle`）；关系不能将类型连接到自身。

<a id="layout"></a>

## 布局

`layout.mode: "grid"`（默认）按照 `row`／`col`，将类型放在与 ERD 渲染器共享的带状网格上：每列采用最宽类型，每行采用最高类型。类型在所在行带中居中，所以同一行两个类型之间的关系是一条直线。半步 `col`（例如 `1.5`）使类型居中于两列之间，不影响任一列尺寸；这让父类型可以对称地位于两个子类型上方；它占用相邻两个单元格。`layout.gapX`／`gapY`（默认 128／84）为标记和标签留空间；`layout.typeW`（180）是最小宽度，`layout.typeMaxW`（300）是最大自动宽度。

成员绝不截断。没有 `width` 的类型会增长到其最宽成员所需宽度，最多到 `typeMaxW`；更长成员换行。换行方法采用类似格式化器输出的布局：第一行以 `name(` 结束，参数再缩进一级（逗号后换行），以 `): Return` 收尾。可见性符号与类型注释使用弱化墨色，让成员名称承担行的主体。作者指定的 `width` 具有权威性；只有标题无法容纳时才报错（`class/title-text-capacity`）。

两种类型不并排时，泛化关系沿垂直方向路由，因此父类型位于子类型上方。同一 kind 的两个或更多自动泛化关系，若从下方子类型进入同一父类型，并且至少留有 40px 间隔，就绘制为一条层级总线：一个三角与主干、间隔中点的水平总线，以及到每个子类型的下落线。总线从父类型向外绘制，让虚线 realization 总线保持同一虚线相位。其 `data-motion-path` 携带从来源到目标的路由，使查看器 token 与流动覆盖层遵循关系语义方向。总线如果会穿过其他类型，则回退为普通路由。

主干还会与完整场景中的其他关系共同检查：同一个主干组可以共享端口和线段。
主干候选若与其他组或普通关系争用标记空间、重叠走廊或形成内部交叉，
整组关系回退到现有路由器，以独立端口和走廊重新规划；无冲突的
其他主干保留。每轮回退后重新检查剩余主干，且只删除冲突组，不反复恢复尝试。
类型位置、关系种类和方向、显式 `via`、端口、路由及标签位置保持作者的控制。
此检查决定是否保留自动主干，不承诺固定路线周围满足全部自动间距或任意布局都能成功。
固定路线之间的冲突和无法绕开的复杂交叉仍遵循现有路由约束，不会修改作者指定的几何。

所有其他关系使用共享正交路由器（`../architecture/routing.mjs`），以及共享 Clean Flow、交叉、通道、节奏和标签净空门禁。

标签放在空间最大的线段上：水平段上方，垂直段旁边。`labelAt`、`labelDx`／`labelDy`、`labelSegment` 可覆盖该选择。

`via: []` 与省略 `via` 等价，在主干选择和回退路由前统一按无路径点处理。
非空 `via` 仍是显式几何；其他路由与标签控制不变，原始 JSON 不会被改写。

<a id="reader-and-export"></a>

## 阅读器与导出

自动画布与 ERD 一样，声明 `data-reader-fit="intrinsic-height"` 和 7.5px 的阅读器文字下限，因此高模型会滚动，而不会把成员缩到难以辨读。图例以各自记法列出出现的关系种类；悬停或聚焦条目时，其他种类会变暗。每个类型都是可聚焦节点，其 passport 展示 kind 和 `sublabel`；提供的 `sources` 作为仓库证据显示。记法位于 SVG 自身的 `<style>` 和 marker 中，因此 SVG／PNG 导出会保留它。

<a id="tested-size"></a>

## 已测试规模

`examples/payment-processors.class.json`（11 个类型、10 条关系、长签名）约 0.2 秒完成渲染，在 1440px 桌面阅读器中以 7.5px 最小投影文字通过 showcase 门禁。更宽模型需要增加行，而不是增加列，才能保持在该下限之上。
