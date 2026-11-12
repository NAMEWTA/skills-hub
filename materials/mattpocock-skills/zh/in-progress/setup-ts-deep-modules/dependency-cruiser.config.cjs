// @ts-check
// dependency-cruiser 的深模块约束。
//
// 包根目录下每个包都是深模块：小接口后面承载大量行为。
// 包的公共表面是其入口：包根部的文件。
// 实现位于子文件夹，是私有的（惯例是 `lib/` 放实现，
// `tests/` 放测试，但任何子文件夹都是私有的）。
// 包可公开多个小入口（index.ts、client.ts、server.ts 等）；
// 优先这样做，而不是使用一个巨大的 barrel index。
//
// 这里唯一应该需要编辑的是 PACKAGES_ROOT。

/** 包的位置。每个包是一个直接子目录（扁平，不嵌套）。 */
const PACKAGES_ROOT = "src/packages";

// --- 派生模式（无需编辑） -------------------------------------------------
const R = PACKAGES_ROOT;
/**
 * 包的私有内部：嵌套在包子文件夹中的任何内容。
 * 包根部文件是入口，不会在此匹配：
 * 外部仍可导入它们。
 */
const PACKAGE_INTERNALS = `^${R}/[^/]+/[^/]+/`;

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "entrypoint-boundary-from-app",
      comment:
        "应用/根部代码可以导入包的入口（根部文件），但不能导入其子文件夹内的任何内容。",
      severity: "error",
      from: { pathNot: `^${R}/` }, // 导入方不在任何包内
      to: { path: PACKAGE_INTERNALS },
    },
    {
      name: "entrypoint-boundary-across-packages",
      comment:
        "包自己的文件可自由互相导入，但访问其他包时只能通过入口，绝不能访问其内部。",
      severity: "error",
      // 导入方在包（$1）内，但不是测试文件
      from: { path: `^${R}/([^/]+)/`, pathNot: `^${R}/[^/]+/tests/` },
      to: {
        path: PACKAGE_INTERNALS,
        pathNot: `^${R}/$1/`, // 同一个包 → 包内自由
      },
    },
    {
      name: "tests-through-entrypoints",
      comment:
        "包的测试与其他调用方一样，通过入口检验包：可导入任何包的入口以及自己的 tests/ 夹具，但绝不能导入任何包的内部，即使自己的也不行。",
      severity: "error",
      from: { path: `^${R}/([^/]+)/tests/` }, // 包 $1 中的测试文件
      to: {
        path: PACKAGE_INTERNALS,
        pathNot: `^${R}/$1/tests/`, // 自己的 tests/ 夹具 → 允许
      },
    },
    {
      name: "tests-folder-is-private",
      comment:
        "包的 tests/ 文件夹只能由测试访问：其他任何内容都不能导入夹具。",
      severity: "error",
      from: { pathNot: `^${R}/[^/]+/tests/` }, // 导入方自身不是测试
      to: { path: `^${R}/[^/]+/tests/` },
    },
    {
      name: "no-circular",
      comment: "禁止依赖环。如果希望允许包外的环，将范围限定为 `^${R}/`。",
      severity: "error",
      from: {},
      to: { circular: true },
    },

    // --- 分层（可选，默认关闭） --------------------------------------------
    // 接口隐藏控制如何导入（通过入口）。
    // 分层控制哪些包可以依赖哪些包。在这里添加自己的规则，
    // 例如：
    //
    // {
    //   name: "ui-may-not-depend-on-billing",
    //   severity: "error",
    //   from: { path: `^${R}/ui/` },
    //   to:   { path: `^${R}/billing/` },
    // },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
  },
};
