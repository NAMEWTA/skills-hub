#!/usr/bin/env node
// 小型离线只读主机快照；只使用 Node.js 标准库，不扫描目录。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

export function main(argv = process.argv.slice(2)) {
  let stats;
  try {
    const { values } = parseArgs({ args: argv, options: { path: { type: "string", default: process.cwd() }, help: { type: "boolean", short: "h" } } });
    if (values.help) { console.log("用法：node inspect.mjs [--path 目标文件系统上的现有路径]"); return 0; }
    const expanded = values.path === "~" ? os.homedir() : values.path.startsWith("~/") || values.path.startsWith("~\\") ? path.join(os.homedir(), values.path.slice(2)) : values.path;
    const target = fs.realpathSync(expanded);
    stats = fs.statfsSync(target, { bigint: true });
  } catch (error) {
    console.error(`无法读取指定文件系统：${error.code ?? error.name}`);
    return 2;
  }
  const gib = 1024 ** 3;
  const total = Number(stats.blocks * stats.bsize);
  const used = Number((stats.blocks - stats.bfree) * stats.bsize);
  const available = Number(stats.bavail * stats.bsize);
  console.log("# 只读系统快照\n");
  console.log(`- 观察时间：${new Date().toISOString()}`);
  console.log(`- 平台：${os.type()} ${os.release()} (${os.arch()})`);
  console.log(`- 当前进程报告的逻辑 CPU 数：${os.cpus().length || "未知"}`);
  console.log("- 文件系统：所选路径所属文件系统；未扫描目录");
  console.log(`- 总量 / 已用 / 可用 GiB：${(total / gib).toFixed(2)} / ${(used / gib).toFixed(2)} / ${(available / gib).toFixed(2)}`);
  if (process.platform !== "win32") console.log("- 平均负载（1/5/15 分钟）：" + os.loadavg().map((v) => v.toFixed(2)).join(" / "));
  console.log("\n此快照不证明已定位用户目标主机、虚拟机或容器配额、\n性能瓶颈、可回收空间或优化已经成功。");
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
