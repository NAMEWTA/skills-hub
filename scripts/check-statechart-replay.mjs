#!/usr/bin/env node
// 用仓库内已捕获输出检查当前交付的状态图算法；不运行新的 TLC 求解。
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

const ROOT = path.dirname(import.meta.dirname);
const PREFIX = "pstack/skills/statechart/scripts/test/corpus/";
const run = promisify(execFile);

function materialRows() {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  const text = fs.readFileSync(path.join(ROOT, "materials/manifest.tsv"), "utf8");
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    if (quoted) {
      if (character === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
      else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"' && !cell) quoted = true;
    else if (character === "\t") { row.push(cell); cell = ""; }
    else if (character === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += character;
  }
  if (quoted) throw new Error("资料清单含未关闭的引号");
  if (cell || row.length) rows.push([...row, cell]);
  const header = rows.shift();
  return rows.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index]])));
}

// 只保留原适配器的捕获输出回放行为；明确不提供真实 Java 或模型证明。
const REPLAY_JAVA = String.raw`
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
const config = args.includes("-config") ? args[args.indexOf("-config") + 1] : undefined;
const name = config ? path.basename(config, ".cfg") : "sany";
const dump = args.includes("-dump") ? args[args.indexOf("-dump") + 2] + ".dot" : undefined;
const replay = process.env.STATECHART_REPLAY;
if (!replay) throw new Error("缺少明确的捕获夹具目录");
if (dump && fs.existsSync(path.join(replay, "graph.dot"))) fs.copyFileSync(path.join(replay, "graph.dot"), dump);
const tag = fs.existsSync("ChartRun.tla") ? fs.readFileSync("ChartRun.tla", "utf8").match(/"chart-[0-9a-f]{32}"/)?.[0] : undefined;
const saved = fs.readFileSync(path.join(replay, name + ".out"), "utf8");
process.stdout.write(tag ? saved.replace(/(<<\s*)"chart"(?=,)/g, "$1" + tag) : saved);
const status = path.join(replay, name + ".exit");
process.exit(fs.existsSync(status) ? Number(fs.readFileSync(status, "utf8")) : 0);
`;

export async function main() {
  console.log("回放已捕获的 TLC 输出，检查解析、图与报告；不是新的 TLC 模型求解。");
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "skills-hub-statechart-replay-"));
  try {
    const corpus = path.join(base, "corpus");
    for (const row of materialRows()) {
      if (!row.source_path.startsWith(PREFIX)) continue;
      const relative = row.source_path.slice(PREFIX.length);
      if (path.posix.isAbsolute(relative) || relative.split("/").includes("..") || relative.includes("\\")) throw new Error("资料路径不能越出临时目录");
      const target = path.join(corpus, ...relative.split("/"));
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(ROOT, "materials", row.id, "original.txt"), target);
    }
    const replay = path.join(base, "replay-java.mjs");
    fs.writeFileSync(replay, REPLAY_JAVA);
    const adapter = path.join(base, "adapter.mjs");
    fs.writeFileSync(adapter, `import childProcess from "node:child_process";\nimport { syncBuiltinESMExports } from "node:module";\nconst file = ${JSON.stringify(replay)};\nfor (const method of ["spawn", "execFile"]) {\n  const original = childProcess[method];\n  childProcess[method] = (command, args, ...rest) => command === "captured-output-replay" ? original(process.execPath, [file, ...args], ...rest) : original(command, args, ...rest);\n}\nsyncBuiltinESMExports();\n`);
    const placeholder = path.join(base, "not-a-real-tlc.jar");
    fs.writeFileSync(placeholder, "");
    const entry = path.join(ROOT, "skills/dev/dev-statechart/scripts/statechart.mjs");
    const cases = fs.readdirSync(corpus, { withFileTypes: true }).filter((item) => item.isDirectory()).map((item) => item.name).sort();
    if (cases.length === 0) throw new Error("没有找到完整捕获夹具");
    const results = [];
    let next = 0;
    async function worker() {
      while (next < cases.length) {
        const index = next++;
        const name = cases[index];
        const directory = path.join(corpus, name);
        const output = path.join(base, "output", name);
        // 既检查全新目标，也覆盖支持的“已有空目录”发布路径。
        if (index === 0) fs.mkdirSync(output, { recursive: true });
        const args = ["--import", pathToFileURL(adapter).href, entry, path.join(directory, `${name}.tla`), "--out", output];
        if (fs.existsSync(path.join(directory, "view.mjs"))) args.push("--view", path.join(directory, "view.mjs"));
        const env = { ...process.env, JAVA: "captured-output-replay", TLA2TOOLS: placeholder, STATECHART_REPLAY: directory };
        let result;
        try { result = { ...(await run(process.execPath, args, { env, encoding: "utf8", timeout: 45_000, maxBuffer: 8 * 1024 * 1024 })), code: 0 }; }
        catch (error) { if (typeof error.code !== "number") throw error; result = error; }
        const savedExit = path.join(directory, "verdict-1.exit");
        const code = fs.existsSync(savedExit) ? Number(fs.readFileSync(savedExit, "utf8")) : 0;
        const expected = code === 0 ? 0 : [11, 12, 13].includes(code) ? 1 : 2;
        assert.equal(result.code, expected, `${name}: 退出码；${result.stderr}`);
        assert.equal(result.stderr, "", `${name}: stderr`);
        const report = fs.readFileSync(path.join(output, "report.md"), "utf8");
        const chart = fs.readFileSync(path.join(output, "chart.mmd"), "utf8");
        const original = fs.readFileSync(path.join(directory, "report.md"), "utf8");
        const originalChart = fs.readFileSync(path.join(directory, "chart.mmd"), "utf8");
        const matches = (text, regex) => [...text.matchAll(regex)].map((match) => match.slice(1));
        const rules = matches(report, /^## 违反 (.+)$/gm).flat();
        assert.deepEqual(rules, matches(original, /^## (.+) breaks$/gm).flat(), `${name}: 违反规则`);
        for (const pattern of [/^\s*(\[\*\]|s\d+) --> (s\d+)/gm, /^\s*class (s\d+) (\w+)/gm])
          assert.deepEqual(matches(chart, pattern), matches(originalChart, pattern), `${name}: 图边或节点标记`);
        assert.equal([...report.matchAll(/^\d+\. /gm)].length, [...original.matchAll(/^\d+\. /gm)].length, `${name}: 反例轨迹长度`);
        assert.equal(fs.readFileSync(path.join(output, "tlc.out"), "utf8").includes("@!@!@"), false, `${name}: 工具协议清理`);
        results[index] = { case: name, exit: result.code, rules };
      }
    }
    await Promise.all(Array.from({ length: Math.min(4, cases.length) }, worker));
    console.log(JSON.stringify({ kind: "captured-output replay", new_tlc_run: false, cases: results.length, passed: results.length, results }, null, 2));
    return 0;
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { process.exitCode = await main(); }
  catch (error) { console.error(error); process.exitCode = 1; }
}
