import { spawnSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { findNpmCli, runNpm } from './npm-cli.mjs';

const packageName = '@namewta/skills-hub';
const registry = 'https://registry.npmjs.org';
const stable = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function isNpmInstallation(root) {
  return basename(root) === 'skills-hub' && basename(dirname(root)) === '@namewta'
    && basename(dirname(dirname(root))) === 'node_modules';
}

export async function latestUpdate(version, request = fetch) {
  const current = stable.exec(version.split(/[+-]/, 1)[0]);
  if (!current) return;
  try {
    const response = await request(`${registry}/@namewta%2Fskills-hub/latest`, {
      signal: AbortSignal.timeout(1800),
    });
    if (!response.ok) return;
    const metadata = await response.json();
    const latest = typeof metadata?.version === 'string' && stable.exec(metadata.version);
    if (!latest || metadata.name !== packageName) return;
    const difference = latest.slice(1).map((part, i) => BigInt(part) - BigInt(current[i + 1])).find(part => part !== 0n);
    if (difference > 0n || (difference === undefined && version.includes('-'))) return metadata.version;
  } catch {
    // 离线、超时或注册表响应不可用时继续安装技能。
  }
}

export function installUpdate(version, { root, project, argv }) {
  if (!stable.test(version)) throw new Error('无效的 npm 更新版本。');
  const options = { cwd: project, timeout: 120_000 };
  const globalRoot = runNpm(['root', '--global'], options).stdout.trim();
  const globalPackage = join(globalRoot, packageName);
  const global = existsSync(globalPackage) && realpathSync(globalPackage) === realpathSync(root);
  const spec = `${packageName}@${version}`;
  const flags = ['--ignore-scripts', `--registry=${registry}`];
  let command;
  if (global) {
    runNpm(['install', '--global', ...flags, '--no-audit', '--no-fund', spec], options);
    command = [resolve(globalPackage, 'install.mjs'), ...argv];
  } else {
    command = [findNpmCli(), 'exec', '--yes', ...flags, `--package=${spec}`, '--', 'skills-hub', ...argv];
  }
  const result = spawnSync(process.execPath, command, { cwd: project, windowsHide: true, stdio: 'inherit' });
  if (result.error) throw result.error;
  return result.status ?? 1;
}
