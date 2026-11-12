---
name: migrate-to-shoehorn
description: 将测试文件中的 `as` 类型断言迁移到 @total-typescript/shoehorn。用于用户提及 shoehorn、希望替换测试中的 `as`，或需要部分测试数据的场景。
---

# 迁移到 Shoehorn

## 为什么使用 shoehorn？

`shoehorn` 允许测试传入部分数据，同时满足 TypeScript。它用类型安全的替代方案取代 `as` 断言。

**仅限测试代码。** 绝不在生产代码中使用 shoehorn。

测试中 `as` 的问题：

- 被训练为不使用它
- 必须手动指定目标类型
- 故意错误的数据需要双重 as（`as unknown as Type`）

## 安装

```bash
npm i @total-typescript/shoehorn
```

## 迁移模式

### 大对象，只需要少数属性

之前：

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ……还有 20 个属性
};

it("gets user by id", () => {
  // 只关心 body.id，却必须伪造整个 Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ……伪造全部 20 个属性
  });
});
```

之后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

之前：

```ts
getUser({ body: { id: "123" } } as Request);
```

之后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

之前：

```ts
getUser({ body: { id: 123 } } as unknown as Request); // 故意使用错误类型
```

之后：

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## 分别何时使用

| 函数 | 使用场景 |
| ---- | -------- |
| `fromPartial()` | 传入仍通过类型检查的部分数据 |
| `fromAny()` | 传入故意错误的数据（保留自动补全） |
| `fromExact()` | 强制完整对象（以后可换成 fromPartial） |

## 工作流

1. **收集需求**——询问用户：
   - 哪些测试文件的 `as` 断言正在造成问题？
   - 是否处理只有部分属性重要的大对象？
   - 是否需要传入故意错误的数据来测试错误？

2. **安装并迁移**：
   - [ ] 安装：`npm i @total-typescript/shoehorn`
   - [ ] 找出含 `as` 断言的测试文件：`grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] 用 `fromPartial()` 替换 `as Type`
   - [ ] 用 `fromAny()` 替换 `as unknown as Type`
   - [ ] 添加来自 `@total-typescript/shoehorn` 的导入
   - [ ] 运行类型检查验证
