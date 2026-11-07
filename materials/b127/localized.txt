#!/usr/bin/env node
import { type ChildProcess, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { killGroup, messageOf } from "./run.ts";

const USAGE = `用法：statechart SPEC.tla [--config FILE] [--view FILE] [--out DIR]

使用 TLC 检查 SPEC.tla，并把状态图绘制为 Mermaid。超过 500 个状态时，只绘制
通向违规规则的路径；没有违规规则时，不生成 chart.mmd。
  --config FILE  TLC 配置。默认为规格旁的 SPEC.cfg。
  --view FILE    导出 state(vars) 的模块，还可导出 step(action, from, to)、
                 group(vars)、colors 和 title。state() 返回字符串时生成平面图，
                 数组生成父状态，对象生成并行区域。默认显示各状态的值。
                 colors 为每个分组指定 blue、orange、purple、yellow、teal、tan 或 pink。
  --out DIR      写入 report.md、chart.mmd、tlc.out，以及每个违规时序属性和
                 图中未显示的违规规则的 tlc-RULE.out。目录必须新建或为空。
                 默认为 SPEC-chart。
退出码对应原样配置的 TLC 结果：全部规则成立为 0，规则被违反为 1，TLC 错误、
信号终止检查或命令无法运行为 2。SIGINT 和 SIGTERM 分别返回 130 和 143。
只有退出码 0 和 1 会写出结果。`;

let stop: NodeJS.Signals | undefined;
const stopped = new Promise<void>((resolve) => {
  for (const name of ["SIGINT", "SIGTERM"] as const)
    process.on(name, () => {
      stop ??= name;
      resolve();
    });
});

let flags;
let specFile;
try {
  const args = parseArgs({
    allowPositionals: true,
    options: { config: { type: "string" }, view: { type: "string" }, out: { type: "string" } },
  });
  flags = args.values;
  [specFile] = args.positionals;
  if (args.positionals.length !== 1) throw new Error("Give one SPEC.tla.");
} catch (error) {
  console.error(`${messageOf(error)}\n\n${USAGE}`);
  process.exit(2);
}

const codeOf = (error: unknown) =>
  error instanceof Error && "code" in error ? error.code : undefined;

try {
  const configFile = flags.config ?? specFile.replace(/\.tla$/, ".cfg");
  if (!fs.existsSync(configFile))
    throw new Error(`Cannot find the TLC config ${configFile}. Pass --config FILE.`);
  const out = flags.out ?? specFile.replace(/\.tla$/, "-chart");
  let entries: string[] = [];
  let dest: string;
  try {
    entries = fs.readdirSync(out);
    dest = fs.realpathSync(out);
  } catch (error) {
    if (codeOf(error) !== "ENOENT")
      throw new Error(
        `${out} cannot be the output folder. ${messageOf(error)}. Pass --out with a new folder.`,
        { cause: error },
      );
    if (fs.lstatSync(out, { throwIfNoEntry: false }))
      throw new Error(
        `${out} cannot be the output folder. It is a broken link. Pass --out with a new folder.`,
        { cause: error },
      );
    dest = path.resolve(out);
  }
  if (entries.length)
    throw new Error(
      `${out} is not empty. It has ${entries.sort()[0]}. The command writes only to a new or empty folder. Pass --out with a new folder.`,
    );

  let base = path.dirname(dest);
  while (!fs.existsSync(base)) base = path.dirname(base);
  const stage = fs.mkdtempSync(path.join(base, `.${path.basename(dest)}.statechart-`));
  const done = path.join(stage, "done");
  let tmp: string | undefined;
  let janitor: ChildProcess | undefined;
  let exitCode: number;
  try {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "statechart-"));
    const runtime = process.versions.deno
      ? [
          "run",
          "--quiet",
          "--no-prompt",
          "--allow-read",
          "--allow-write",
          "--allow-run",
          "--allow-env",
        ]
      : process.execArgv;
    const worker = spawn(
      process.execPath,
      [
        ...runtime,
        path.join(import.meta.dirname, "worker.ts"),
        stage,
        specFile,
        configFile,
        ...(flags.view ? [flags.view] : []),
      ],
      {
        detached: true,
        stdio: ["ignore", "inherit", "inherit"],
        env: { ...process.env, TMPDIR: tmp },
      },
    );
    janitor = spawn(
      "/bin/sh",
      [
        "-c",
        'while read -r line; do :; done; kill -s KILL -- "-$1"; rm -rf -- "$2" "$3"',
        "sh",
        String(worker.pid),
        stage,
        tmp,
      ],
      { detached: true, stdio: ["pipe", "ignore", "ignore"] },
    );
    const exited = new Promise<number>((resolve) =>
      worker.on("exit", (code) => resolve(code ?? 2)),
    );
    await Promise.race([stopped, exited]);
    await killGroup(worker.pid as number);
    const verdict = await exited;
    if (stop) {
      console.error(`${stop} stopped the check, so the command wrote nothing.`);
      exitCode = 128 + os.constants.signals[stop];
    } else if (worker.signalCode) {
      console.error(`${worker.signalCode} killed the check, so the command wrote nothing.`);
      exitCode = 2;
    } else if ((verdict === 0 || verdict === 1) && fs.existsSync(done)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      try {
        fs.renameSync(done, dest);
      } catch (error) {
        if (codeOf(error) !== "ENOTEMPTY" && codeOf(error) !== "EEXIST") throw error;
        throw new Error(
          `${path.join(out, fs.readdirSync(dest).sort()[0])} appeared while the check ran, so the command wrote nothing. Pass --out with a new folder.`,
          { cause: error },
        );
      }
      process.stdout.write(fs.readFileSync(path.join(dest, "report.md")));
      console.log(`\nWrote ${out}`);
      exitCode = verdict;
    } else exitCode = 2;
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    janitor?.kill("SIGKILL");
  }
  process.exit(exitCode);
} catch (error) {
  console.error(messageOf(error));
  process.exit(2);
}
