import assert from "node:assert/strict";

// 保留既有测试断言语义；仅将测试运行器替换为 Node 内置能力。
function matches(actual, expected) {
  if (Array.isArray(expected)) {
    assert.ok(Array.isArray(actual));
    assert.strictEqual(actual.length, expected.length);
    expected.forEach((value, index) => matches(actual[index], value));
  } else if (expected && typeof expected === "object") {
    assert.ok(actual !== null && typeof actual === "object");
    for (const [key, value] of Object.entries(expected)) matches(actual[key], value);
  } else assert.deepStrictEqual(actual, expected);
}

function exception(expected) {
  if (typeof expected === "string") return (error) => String(error?.message).includes(expected);
  return expected;
}

export function expect(actual) {
  return {
    toBe: (expected) => assert.strictEqual(actual, expected),
    toEqual: (expected) => assert.deepStrictEqual(actual, expected),
    toMatchObject: (expected) => matches(actual, expected),
    toContain: (expected) => assert.ok(actual.includes(expected)),
    toHaveLength: (expected) => assert.strictEqual(actual.length, expected),
    toBeNull: () => assert.strictEqual(actual, null),
    toBeUndefined: () => assert.strictEqual(actual, undefined),
    toBeInstanceOf: (expected) => assert.ok(actual instanceof expected),
    toThrow: (expected) => assert.throws(actual, exception(expected)),
    not: { toContain: (expected) => assert.ok(!actual.includes(expected)) },
    rejects: {
      toThrow: (expected) => assert.rejects(actual, exception(expected)),
      toBeInstanceOf: (expected) => assert.rejects(actual, expected),
    },
  };
}
