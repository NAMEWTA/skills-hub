#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot, isMain } from '../install.mjs';

const hookFiles = ['pre-commit', 'pre-push', 'run-check.mjs'];

export function install(root) {
  function git(args, optional = false) {
    const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
    if (result.error) throw result.error;
    if (optional && result.status === 1) return '';
    if (result.status !== 0) throw new Error(result.stderr.trim() || '无法读取 Git 配置');
    return result.stdout.trim();
  }
  const actualRoot = fs.realpathSync(git(['rev-parse', '--show-toplevel']));
  if (actualRoot !== fs.realpathSync(root)) throw new Error('请指定仓库根目录，不能在任意子目录安装 hooks');
  const hookRoot = path.join(root, '.githooks');
  const directory = fs.lstatSync(hookRoot, { throwIfNoEntry: false });
  if (!directory?.isDirectory() || directory.isSymbolicLink()) throw new Error('缺少本仓库的常规 hook 目录：.githooks');
  for (const name of hookFiles) {
    const stat = fs.lstatSync(path.join(hookRoot, name), { throwIfNoEntry: false });
    if (!stat?.isFile() || stat.isSymbolicLink()) throw new Error(`缺少本仓库的常规 hook 文件：.githooks/${name}`);
  }
  function ensureExecutable() {
    if (process.platform === 'win32') return;
    for (const name of hookFiles) {
      const filename = path.join(hookRoot, name);
      fs.chmodSync(filename, fs.statSync(filename).mode | 0o111);
    }
  }
  const configured = git(['config', '--get-all', 'core.hooksPath'], true);
  if (configured) {
    if (configured !== '.githooks') throw new Error('已配置 core.hooksPath，保持原值；请在现有 pre-commit/pre-push 中分别接入 node scripts/check.mjs --staged / --pre-push。');
    ensureExecutable();
    return '本仓库已使用 .githooks，已核对脚本执行权限。';
  }
  const hookPath = git(['rev-parse', '--git-path', 'hooks']);
  const defaultHooks = path.resolve(root, hookPath);
  if (fs.existsSync(defaultHooks)) {
    const active = fs.readdirSync(defaultHooks).filter((name) => !name.endsWith('.sample')).sort();
    if (active.length) throw new Error(`默认 hooks 目录已有自定义内容，保持不变：${active.join(', ')}；请在现有流程中接入本项目检查。`);
  }
  ensureExecutable();
  git(['config', '--local', 'core.hooksPath', '.githooks']);
  return '已为本仓库启用 pre-commit（暂存快照）和 pre-push（目标提交）检查。';
}

export function main(argv = process.argv.slice(2)) {
  let root = repositoryRoot;
  if (argv.length === 2 && argv[0] === '--root') root = path.resolve(argv[1]);
  else if (argv.length === 1 && argv[0] === '--help') { console.log('node scripts/install-hooks.mjs [--root DIRECTORY]'); return 0; }
  else if (argv.length) { console.error('Usage: node scripts/install-hooks.mjs [--root DIRECTORY]'); return 2; }
  try { console.log(install(root)); return 0; }
  catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}

if (isMain(import.meta.url)) process.exitCode = main();
