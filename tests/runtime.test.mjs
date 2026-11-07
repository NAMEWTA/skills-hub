import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { check, report, stateKey } from "../skills/dev/dev-formal-verify/scripts/check-model.mjs";
import * as reservation from "../skills/dev/dev-formal-verify/assets/example/model.mjs";
import { killGroup } from "../skills/dev/dev-statechart/scripts/process-lifecycle.mjs";

const root = path.dirname(import.meta.dirname);
const absolute = (file) => path.join(root, file);
const checker = "skills/dev/dev-formal-verify/scripts/check-model.mjs";
const example = "skills/dev/dev-formal-verify/assets/example/model.mjs";
const inspect = "skills/system/system-inspect/scripts/inspect.mjs";
const audit = "skills/dev/dev-deploy/scripts/local-tools/worktree-audit.mjs";
const chart = "skills/dev/dev-statechart/scripts/statechart.mjs";

function run(file, args = [], options = {}) {
  return spawnSync(process.execPath, [absolute(file), ...args], {
    encoding: "utf8", cwd: root, timeout: 15_000, ...options,
  });
}
function temporary(t) {
  const folder = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "skills-runtime-")));
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));
  return folder;
}
function git(folder, ...args) {
  const child = spawnSync("git", ["-C", folder, ...args], { encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr || child.error?.message);
  return child.stdout;
}

test("有限模型穷尽真实实现的 8 个状态和 12 条迁移", () => {
  const result = check(reservation, 100, 1000);
  assert.equal(result.parents.size, 8);
  assert.equal(result.edges, 12);
  assert.equal(result.complete, true);
  assert.equal(result.violations.size, 0);
});

test("真实故障注入执行 0 → 1 → 0，并保留四步最短反例", () => {
  const implementation = absolute("skills/dev/dev-formal-verify/assets/example/implementation.mjs");
  const before = fs.readFileSync(implementation);
  const child = run("skills/dev/dev-formal-verify/scripts/demo.mjs");
  assert.equal(child.status, 0, child.stderr);
  assert.deepEqual([...child.stdout.matchAll(/退出码 (\d+)/g)].map((item) => Number(item[1])), [0, 1, 0]);
  assert.match(child.stdout, /最短路径共 4 步/);
  assert.ok(fs.readFileSync(implementation).equals(before));
});

test("预算截断返回 3，不把未完成搜索说成通过", () => {
  const child = run(checker, [absolute(example), "--max-states", "1"]);
  assert.equal(child.status, 3, child.stderr);
  assert.match(child.stdout, /达到预算/);
  assert.match(child.stdout, /未完成验证/);
});

test("空初始集、非布尔规则和隐藏可变状态都被拒绝", () => {
  assert.throws(() => check({ initialStates: function* () {}, transitions: function* () {}, INVARIANTS: { Rule: () => true } }, 10, 100), /没有初始状态/);
  assert.throws(() => check({ initialStates: function* () { yield 0; }, transitions: function* () {}, INVARIANTS: { Rule: () => 1 } }, 10, 100), /boolean/);
  assert.throws(() => stateKey({ value: 1 }), /深度冻结/);
  assert.throws(() => stateKey(Object.freeze({ child: { value: 1 } })), /深度冻结/);
  const hidden = Object.freeze(Object.defineProperty({}, "hidden", { value: 1 }));
  assert.throws(() => stateKey(hidden), /不可枚举/);
  assert.throws(() => stateKey(Object.freeze(new Date())), /类实例/);
});

test("按值比较全字段，字段顺序不产生重复状态", () => {
  assert.equal(stateKey(Object.freeze({ one: 1, two: 2 })), stateKey(Object.freeze({ two: 2, one: 1 })));
  assert.notEqual(stateKey(Object.freeze({ one: 1, two: 2 })), stateKey(Object.freeze({ one: 1, two: 3 })));
  assert.notEqual(stateKey(0), stateKey(-0));
});

test("死锁检查使用独立规则名，保留用户同名规则", () => {
  const model = { initialStates: function* () { yield 0; }, transitions: function* () {}, INVARIANTS: { NoDeadlock: () => true } };
  const result = check(model, 10, 100, true);
  assert.equal(result.deadlockRule, "CHECK_NoDeadlock");
  assert.ok(result.violations.has("CHECK_NoDeadlock"));
  assert.match(report(model, result, 10, 100), /NoDeadlock：在完整可达图中成立/);
});

test("有限模型报告拒绝覆盖现有证据", (t) => {
  const folder = temporary(t);
  const file = path.join(folder, "evidence.md");
  fs.writeFileSync(file, "retain me");
  const child = run(checker, [absolute(example), "--max-states", "100", "--out", file]);
  assert.equal(child.status, 2);
  assert.equal(fs.readFileSync(file, "utf8"), "retain me");
});

test("决策日志追加一次表头，规范多行并转义表格公式", (t) => {
  const folder = temporary(t);
  const file = path.join(folder, "decisions.tsv");
  const script = "skills/dev/dev-setup/scripts/append-decision-tsv.mjs";
  for (let i = 0; i < 2; i += 1) {
    const child = run(script, [file, "=formula", "a\tb\nc", "-other", "+reason", "@evidence"]);
    assert.equal(child.status, 0, child.stderr);
  }
  const rows = fs.readFileSync(file, "utf8").trimEnd().split("\n");
  assert.equal(rows.length, 3);
  assert.equal(rows[1].split("\t").length, 6);
  assert.match(rows[1], /'\=formula\ta b c\t'-other\t'\+reason\t'@evidence$/);
  const before = fs.readFileSync(file);
  assert.equal(run(script, [file]).status, 1);
  assert.ok(fs.readFileSync(file).equals(before));
});

test("只读主机快照不输出私有路径，并拒绝不存在的卷", (t) => {
  const folder = temporary(t);
  const child = run(inspect, ["--path", folder]);
  assert.equal(child.status, 0, child.stderr);
  assert.doesNotMatch(child.stdout, new RegExp(folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(child.stdout, /GiB/);
  assert.equal(run(inspect, ["--path", path.join(folder, "missing")]).status, 2);
});

test("人工复现模板消费逐行回答，提前 EOF 不伪造完成", () => {
  const script = "skills/dev/dev-debug/scripts/manual-reproduction.mjs";
  const completed = run(script, [], { input: "\ny\nfailed export\n" });
  assert.equal(completed.status, 0, completed.stderr);
  assert.match(completed.stdout, /ERRORED=y\nERROR_MSG=failed export/);
  const incomplete = run(script, [], { input: "\n" });
  assert.equal(incomplete.status, 1);
  assert.match(incomplete.stderr, /输入已结束/);
});

test("工作树审计真实路径、修改、未跟踪文件与显式对话范围", (t) => {
  const folder = temporary(t);
  const repo = path.join(folder, "repo");
  fs.mkdirSync(repo);
  git(repo, "init", "--initial-branch=main");
  git(repo, "config", "user.email", "test@example.invalid");
  git(repo, "config", "user.name", "Runtime Test");
  fs.writeFileSync(path.join(repo, "data"), "baseline\n");
  git(repo, "add", "data"); git(repo, "commit", "-m", "initial");
  const paths = {};
  for (const name of ["clean", "wip", "scratch", "chat [chosen]"]) {
    paths[name] = path.join(folder, name);
    git(repo, "worktree", "add", "-b", name.replace(/\W/g, "_"), paths[name], "main");
  }
  fs.writeFileSync(path.join(paths.wip, "data"), "modified\n");
  fs.writeFileSync(path.join(paths.scratch, "untracked"), "retain\n");
  const transcripts = path.join(folder, "transcripts");
  fs.mkdirSync(transcripts);
  fs.writeFileSync(path.join(transcripts, "record.txt"), JSON.stringify({ file: paths["chat [chosen]"].replace(/\\/g, "/") + "/data" }));
  const env = { ...process.env, SKILLS_WTA_TRANSCRIPTS_DIR: "" };
  const before = git(repo, "worktree", "list", "--porcelain");
  const child = run(audit, ["--base", "main", "--transcripts", transcripts, repo], { env });
  assert.equal(child.status, 0, child.stderr);
  const rows = new Map(child.stdout.trim().split("\n").slice(2).map((row) => {
    const fields = row.split("\t"); return [path.resolve(fields.at(-1)), fields];
  }));
  assert.equal(rows.get(paths.clean)[7], "safe");
  assert.equal(rows.get(paths.wip)[7], "hold-wip");
  assert.equal(rows.get(paths.scratch)[3], "scratch:1");
  assert.equal(rows.get(paths["chat [chosen]"])[7], "verify-recent-chat");
  assert.equal(git(repo, "worktree", "list", "--porcelain"), before);
  assert.equal(fs.readFileSync(path.join(paths.scratch, "untracked"), "utf8"), "retain\n");
  const noChat = run(audit, ["--base", "main", repo], { env });
  assert.equal(noChat.status, 0, noChat.stderr);
  assert.ok(!noChat.stdout.includes("verify-recent-chat"));
  assert.equal(run(audit, ["--base", "main", "--transcripts", path.join(folder, "missing"), repo], { env }).status, 2);
});

test("状态图帮助不需要 Java；非空目标和缺少模型工具均不覆盖证据", (t) => {
  const folder = temporary(t);
  const spec = path.join(folder, "Example.tla");
  fs.writeFileSync(spec, "---- MODULE Example ----\n====\n");
  fs.writeFileSync(path.join(folder, "Example.cfg"), "");
  const output = path.join(folder, "existing");
  fs.mkdirSync(output); fs.writeFileSync(path.join(output, "keep"), "evidence");
  const env = { ...process.env, TLA2TOOLS: path.join(folder, "missing.jar") };
  assert.equal(run(chart, ["--help"], { env }).status, 0);
  assert.equal(run(chart, [spec, "--out", output], { env }).status, 2);
  assert.equal(fs.readFileSync(path.join(output, "keep"), "utf8"), "evidence");
  const failed = path.join(folder, "failed");
  assert.equal(run(chart, [spec, "--out", failed], { env }).status, 2);
  assert.equal(fs.existsSync(failed), false);
  assert.deepEqual(fs.readdirSync(folder).filter((name) => name.includes("statechart-")), []);
});

test("状态图只终止本次创建的分离子进程组", { timeout: 10_000 }, async (t) => {
  const worker = spawn(process.execPath, ["-e", 'setInterval(()=>{},1000);console.log("ready")'], { detached: true, stdio: ["ignore", "pipe", "ignore"] });
  t.after(async () => { if (worker.exitCode === null && worker.signalCode === null) await killGroup(worker.pid); });
  const ended = new Promise((resolve, reject) => { worker.once("error", reject); worker.once("exit", resolve); });
  await new Promise((resolve, reject) => { worker.stdout.once("data", resolve); worker.once("error", reject); });
  await killGroup(worker.pid);
  await ended;
  assert.ok(worker.exitCode !== null || worker.signalCode !== null);
  await killGroup(undefined);
  await killGroup(-1);
});

test("TLC 包装器保留实际子进程参数、日志和非零退出码", (t) => {
  const folder = temporary(t);
  const java = path.join(folder, "java-fixture.mjs");
  fs.writeFileSync(java, `import fs from "node:fs";\nfs.appendFileSync(process.env.ARGUMENT_LOG, JSON.stringify(process.argv.slice(2))+"\\n");\nif(process.argv.includes("-version")){console.error("fixture version");}else{console.log("captured model violation");process.exitCode=12;}\n`);
  const adapter = path.join(folder, "adapter.mjs");
  fs.writeFileSync(adapter, `import cp from "node:child_process";import {syncBuiltinESMExports} from "node:module";const native=cp.spawnSync;cp.spawnSync=(file,args,options)=>file==="fixture-java"?native(process.execPath,[${JSON.stringify(java)},...args],options):native(file,args,options);syncBuiltinESMExports();`);
  const spec = path.join(folder, "Example.tla");
  const config = path.join(folder, "Example.cfg");
  const jar = path.join(folder, "local.jar");
  for (const file of [spec, config, jar]) fs.writeFileSync(file, "fixture");
  const output = path.join(folder, "evidence");
  const log = path.join(folder, "args.jsonl");
  const script = absolute("skills/dev/dev-formal-verify/assets/run-tlc.mjs");
  const child = spawnSync(process.execPath, ["--import", pathToFileURL(adapter).href, script, spec, config, output], { encoding: "utf8", env: { ...process.env, TLA2TOOLS: jar, JAVA: "fixture-java", ARGUMENT_LOG: log }, timeout: 10_000 });
  assert.equal(child.status, 12, child.stderr);
  assert.equal(fs.readFileSync(path.join(output, "exit-code.txt"), "utf8"), "12\n");
  assert.match(fs.readFileSync(path.join(output, "tlc.out"), "utf8"), /captured model violation/);
  const commands = fs.readFileSync(log, "utf8").trim().split("\n").map(JSON.parse);
  assert.deepEqual(commands[0], ["-version"]);
  assert.deepEqual(commands[1].slice(0, 10), ["-XX:+UseParallelGC", "-cp", jar, "tlc2.TLC", "-workers", "1", "-fp", "0", "-lncheck", "final"]);
  const refused = run("skills/dev/dev-formal-verify/assets/run-tlc.mjs", [spec, config, output], { env: { ...process.env, TLA2TOOLS: jar } });
  assert.equal(refused.status, 2);
  assert.equal(fs.readFileSync(path.join(output, "exit-code.txt"), "utf8"), "12\n");
});
