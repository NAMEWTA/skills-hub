#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { runNpm } from './npm-cli.mjs';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));

export function regularFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`发布内容不能包含符号链接：${relative}`);
    if (entry.isDirectory()) return regularFiles(absolute, relative);
    if (!entry.isFile()) throw new Error(`发布内容不是常规文件：${relative}`);
    return [relative];
  });
}

export function validatePack(info, root = ROOT) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  if (info.name !== pkg.name || info.version !== pkg.version) throw new Error('npm 包身份与 package.json 不一致');
  const paths = new Set(info.files.map(file => file.path));
  const allowedRoot = new Set(['install.mjs', 'package.json', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']);
  if (pkg.dependencies?.['@clack/prompts']) allowedRoot.add('cli.mjs');
  for (const file of info.files) {
    if (!allowedRoot.has(file.path) && !/^(skills|licenses)\//.test(file.path)) {
      throw new Error(`npm 包包含范围外文件：${file.path}`);
    }
    if (/\.(py|pyc|sh|bash|ts|tsx|ps1|cmd|bat)$/.test(file.path)) {
      throw new Error(`npm 包仍含非 JavaScript 运行脚本：${file.path}`);
    }
  }
  for (const required of allowedRoot) {
    if (!paths.has(required)) throw new Error(`npm 包缺少 ${required}`);
  }
  for (const directory of ['skills', 'licenses']) {
    for (const relative of regularFiles(join(root, directory))) {
      if (!paths.has(`${directory}/${relative}`)) throw new Error(`npm 包缺少运行资源：${directory}/${relative}`);
    }
  }
  if (!/^sha512-/.test(info.integrity ?? '')) throw new Error('npm 未返回 SHA-512 包完整性');
  return pkg;
}

export function packPackage(root, destination) {
  const result = runNpm(['pack', '--json', '--ignore-scripts', '--pack-destination', destination], { cwd: root });
  const parsed = JSON.parse(result.stdout);
  // npm 10/11 返回数组，npm 12 返回以包名为键的对象。
  const packed = Array.isArray(parsed) ? parsed : Object.values(parsed);
  if (packed.length !== 1) throw new Error('npm pack 没有生成唯一包');
  const info = packed[0];
  validatePack(info, root);
  if (basename(info.filename) !== info.filename) throw new Error('npm 返回了越界的包路径');
  const file = join(destination, info.filename);
  const bytes = readFileSync(file);
  const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
  if (integrity !== info.integrity) throw new Error('实际压缩包与 npm 返回的完整性不符');
  return { ...info, file, sha256: createHash('sha256').update(bytes).digest('hex') };
}

function runNode(file, args, cwd) {
  const result = spawnSync(process.execPath, [file, ...args], { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`包内 CLI 失败：${result.stdout}\n${result.stderr}`);
  return result;
}

export function installedPackagePath(prefix, name) {
  if (typeof name !== 'string' || !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)) {
    throw new Error(`npm 包名称不能作为安装路径：${name}`);
  }
  return join(prefix, 'node_modules', ...name.split('/'));
}

export function checkPackage(root = ROOT) {
  const temporary = mkdtempSync(join(tmpdir(), 'skills-hub npm package '));
  try {
    const packed = packPackage(root, temporary);
    const prefix = join(temporary, 'consumer');
    // 交互 UI 依赖由 npm 正常解析；无依赖的测试夹具仍验证完全离线安装。
    const dependencies = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).dependencies;
    runNpm(['install', '--prefix', prefix, '--ignore-scripts', '--no-package-lock', '--no-save', '--no-audit', '--no-fund', ...(!dependencies ? ['--offline'] : []), packed.file], { cwd: temporary });
    const installed = installedPackagePath(prefix, packed.name);
    const cli = join(installed, 'install.mjs');
    const metadata = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));
    if (metadata.name !== packed.name || metadata.version !== packed.version) throw new Error('离线安装后的包身份不一致');
    if (!['install.mjs', './install.mjs'].includes(metadata.bin?.['skills-hub'])) throw new Error('npm 包未声明 skills-hub CLI');
    const bin = join(prefix, 'node_modules', '.bin', process.platform === 'win32' ? 'skills-hub.cmd' : 'skills-hub');
    if (!existsSync(bin)) throw new Error('npm 离线安装没有生成 skills-hub 命令入口');
    const commandVersion = runNpm(['exec', '--offline', '--no', '--prefix', prefix, '--', 'skills-hub', '--version'], { cwd: prefix }).stdout.trim();
    if (commandVersion !== packed.version) throw new Error('npm 生成的 skills-hub 命令入口未运行当前包');
    if (runNode(cli, ['--version'], temporary).stdout.trim() !== packed.version) throw new Error('已打包 CLI 的 --version 不正确');
    if (!/^Usage: skills-hub /m.test(runNode(cli, ['--help'], temporary).stdout)) throw new Error('已打包 CLI 的 --help 未使用 skills-hub 名称');
    if (metadata.dependencies?.['@clack/prompts']) {
      // 实际安装后的 UI 模块必须能解析全部依赖，显式命令仍不强制加载 UI。
      runNode(join(installed, 'cli.mjs'), [], temporary);
    }
    runNode(cli, ['list'], temporary);
    runNode(cli, ['install', '--all'], prefix);
    let skills = 0;
    for (const domain of readdirSync(join(root, 'skills'))) {
      for (const name of readdirSync(join(root, 'skills', domain))) {
        const source = join(root, 'skills', domain, name);
        if (!existsSync(join(source, 'SKILL.md'))) continue;
        const target = join(prefix, '.agents', 'skills', name);
        for (const relative of regularFiles(source)) {
          if (!readFileSync(join(source, relative)).equals(readFileSync(join(target, relative)))) {
            throw new Error(`npm 安装后资源内容不同：${name}/${relative}`);
          }
          if (process.platform !== 'win32') {
            const executable = file => lstatSync(file).mode & 0o111;
            if (Boolean(executable(join(source, relative))) !== Boolean(executable(join(target, relative)))) {
              throw new Error(`npm 安装后脚本执行位不同：${name}/${relative}`);
            }
          }
        }
        skills += 1;
      }
    }
    for (const relative of regularFiles(join(root, 'licenses'))) {
      if (!readFileSync(join(root, 'licenses', relative)).equals(readFileSync(join(installed, 'licenses', relative)))) {
        throw new Error(`npm 包内许可不一致：${relative}`);
      }
    }
    runNode(cli, ['install', '--all'], prefix);
    if (existsSync(join(prefix, '.agents', 'skills-hub-licenses'))) throw new Error('安装器不应创建项目许可目录');
    console.log(`实际 npm 包验证通过：${packed.name}@${packed.version}，${skills} 个技能，${packed.files.length} 个分发文件；包安装、命令入口、完整资源、许可与重复安装通过。`);
    return { name: packed.name, version: packed.version, filename: packed.filename, skills, files: packed.files.length, integrity: packed.integrity };
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { checkPackage(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
