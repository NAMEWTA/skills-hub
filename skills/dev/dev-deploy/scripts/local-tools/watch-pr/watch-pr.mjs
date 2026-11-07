#!/usr/bin/env node
// 依赖必须事先由用户或项目提供；观察器不安装依赖，也不创建后台任务。
try {
  await import("commander");
} catch (error) {
  if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
  process.stderr.write("缺少本地 commander 14.0.0。先按本技能 local-tools.md 准备依赖，再重试；未执行下载或安装。\n");
  process.exit(69);
}

const { main } = await import("./cli.ts");
process.exitCode = await main(process.argv.slice(2));
