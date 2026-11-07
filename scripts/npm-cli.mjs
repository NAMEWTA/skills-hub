import { existsSync, realpathSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

export function findNpmCli(environment = process.env) {
  const candidates = [
    environment.npm_execpath,
    join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'),
    join(dirname(process.execPath), '../lib/node_modules/npm/bin/npm-cli.js'),
  ];
  for (const directory of (environment.PATH ?? environment.Path ?? '').split(delimiter)) {
    if (!directory) continue;
    candidates.push(join(directory, 'npm'), join(directory, 'node_modules/npm/bin/npm-cli.js'));
  }
  for (const candidate of candidates.filter(Boolean)) {
    if (!existsSync(candidate)) continue;
    const resolved = realpathSync(candidate);
    if (resolved.endsWith('npm-cli.js')) return resolved;
  }
  throw new Error('未找到随 Node.js 安装的 npm CLI；请使用完整的 Node.js 发行版。');
}

export function runNpm(arguments_, options = {}) {
  const result = spawnSync(process.execPath, [findNpmCli(options.env), ...arguments_], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`npm ${arguments_[0]} 失败（${result.status}）：\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  }
  return result;
}
