#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot, isWithin, isMain } from '../install.mjs';
import { check as checkBudget, report } from './check-skill-quality.mjs';

const objectIdPattern = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/;
const gitLocalEnvironment = [
  'GIT_DIR', 'GIT_COMMON_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX',
  'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES',
];
const utf8 = new TextDecoder('utf-8', { fatal: true });

export class CheckError extends Error {}

export function git(root, args, input) {
  const result = spawnSync('git', ['-C', root, ...args], { input, maxBuffer: 256 * 1024 * 1024 });
  if (result.error) throw new CheckError(`无法执行 Git：${result.error.message}`);
  if (result.status !== 0) throw new CheckError(`Git 无法读取待检查快照：${result.stderr.toString('utf8').trim() || result.signal || result.status}`);
  return result.stdout;
}

export function resolveCommit(root, revision) {
  return git(root, ['rev-parse', '--verify', '--end-of-options', `${revision}^{commit}`]).toString('utf8').trim();
}

export function withSnapshot(root, tree, inspect) {
  const records = [];
  for (const row of utf8.decode(git(root, ['ls-tree', '-r', '-z', '--full-tree', tree])).split('\0').filter(Boolean)) {
    const separator = row.indexOf('\t');
    if (separator < 0) throw new CheckError('Git tree 输出格式无效');
    const [mode, kind, objectId] = row.slice(0, separator).split(' ');
    const relative = row.slice(separator + 1);
    if (!['100644', '100755'].includes(mode) || kind !== 'blob') throw new CheckError(`${relative}: 快照检查只支持常规文件，不忽略符号链接或子模块`);
    const parts = relative.split('/');
    if (!relative || path.posix.isAbsolute(relative) || path.win32.isAbsolute(relative) || parts.some((part) => part === '..' || part.toLowerCase() === '.git') || relative.includes('\\')) {
      throw new CheckError(`无效快照路径：${relative}`);
    }
    records.push({ mode, objectId, relative });
  }
  const blobs = records.length ? git(root, ['cat-file', '--batch'], records.map((entry) => `${entry.objectId}\n`).join('')) : Buffer.alloc(0);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-check-'));
  let offset = 0;
  try {
    for (const { mode, objectId, relative } of records) {
      const end = blobs.indexOf(10, offset);
      if (end < 0) throw new CheckError(`${relative}: Git blob 输出不完整`);
      const header = blobs.subarray(offset, end).toString('ascii').split(' ');
      if (header.length !== 3 || header[0] !== objectId || header[1] !== 'blob' || !/^\d+$/.test(header[2])) throw new CheckError(`${relative}: Git blob 身份或类型不符`);
      const size = Number(header[2]);
      const start = end + 1;
      const stop = start + size;
      if (!Number.isSafeInteger(size) || stop >= blobs.length || blobs[stop] !== 10) throw new CheckError(`${relative}: Git blob 内容不完整`);
      const target = path.resolve(temporary, ...relative.split('/'));
      if (!isWithin(target, temporary)) throw new CheckError(`快照路径越界：${relative}`);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, blobs.subarray(start, stop));
      if (process.platform !== 'win32') fs.chmodSync(target, mode === '100755' ? 0o755 : 0o644);
      offset = stop + 1;
    }
    if (offset !== blobs.length) throw new CheckError('Git blob 输出包含未匹配内容');
    return inspect(temporary);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
}

export function validationEnvironment() {
  const environment = { ...process.env };
  for (const key of gitLocalEnvironment) delete environment[key];
  return environment;
}

export function testFiles(root) {
  const directory = path.join(root, 'tests');
  if (!fs.lstatSync(directory, { throwIfNoEntry: false })?.isDirectory()) throw new CheckError('快照缺少常规隔离测试目录 tests/');
  const files = [];
  function visit(parent) {
    for (const entry of fs.readdirSync(parent, { withFileTypes: true })) {
      const filename = path.join(parent, entry.name);
      if (entry.isSymbolicLink()) throw new CheckError(`${path.relative(root, filename)}: 测试目录不得包含符号链接`);
      if (entry.name === 'node_modules') continue;
      if (entry.isDirectory()) visit(filename);
      else if (entry.isFile() && /\.test\.(?:mjs|js)$/.test(entry.name)) files.push(path.relative(root, filename));
    }
  }
  visit(directory);
  if (!files.length) throw new CheckError('tests/: 未找到 Node.js 隔离测试');
  return files.sort();
}

export function checkTree(root, { full = false } = {}) {
  const { failures, sizes } = checkBudget(root);
  report(sizes);
  if (failures.length) {
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    return 1;
  }
  const commands = [
    ['独立包、元数据和本地引用', ['scripts/validate.mjs']],
    ['原件、中文底稿和运行映射', ['scripts/validate-materials.mjs']],
  ];
  if (full) commands.push(
    ['隔离回归检查', ['--test', ...testFiles(root)]],
    ['有限状态示例及真实故障注入', ['skills/dev/dev-formal-verify/scripts/demo.mjs']],
  );
  for (const [label, args] of commands) {
    if (args[0] !== '--test' && !fs.statSync(path.join(root, args[0]), { throwIfNoEntry: false })?.isFile()) throw new CheckError(`快照缺少检查入口：${args[0]}`);
    console.log(`检查：${label}`);
    const result = spawnSync(process.execPath, args, { cwd: root, env: validationEnvironment(), stdio: 'inherit' });
    if (result.error) throw new CheckError(`无法执行 ${label}：${result.error.message}`);
    if (result.status !== 0) return 1;
  }
  return 0;
}

export function pushCommits(root, updates) {
  const commits = [];
  const seen = new Set();
  const lines = updates ? updates.replace(/\r?\n$/, '').split(/\r?\n/) : [];
  for (let index = 0; index < lines.length; index += 1) {
    const fields = lines[index].trim().split(/\s+/);
    if (fields.length !== 4) throw new CheckError(`pre-push 输入第 ${index + 1} 行不是 Git 的四字段更新记录`);
    const [localRef, localId, remoteRef, remoteId] = fields;
    if (!objectIdPattern.test(localId) || !objectIdPattern.test(remoteId)) throw new CheckError(`pre-push 输入第 ${index + 1} 行的对象标识无效`);
    if (/^0+$/.test(localId)) continue;
    const commit = resolveCommit(root, localId);
    if (!seen.has(commit)) { commits.push({ commit, label: `${localRef} -> ${remoteRef}` }); seen.add(commit); }
  }
  return commits;
}

function parseArguments(argv) {
  const args = { root: repositoryRoot, full: false, mode: null, revision: null };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === '--root' && argv[index + 1]) args.root = path.resolve(argv[++index]);
    else if (flag === '--full') args.full = true;
    else if (flag === '--help') args.help = true;
    else if (['--staged', '--revision', '--pre-push'].includes(flag)) {
      if (args.mode && args.mode !== flag) throw new CheckError('只能选择 --staged、--revision、--pre-push 中的一种');
      args.mode = flag;
      if (flag === '--revision') {
        if (!argv[index + 1]) throw new CheckError('--revision 需要提交标识');
        args.revision = argv[++index];
      }
    } else throw new CheckError(`Unknown argument: ${flag}`);
  }
  return args;
}

export function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArguments(argv);
    if (args.help) { console.log('node scripts/check.mjs [--root DIRECTORY] [--full] [--staged | --revision COMMIT | --pre-push]'); return 0; }
    if (args.mode === '--staged') {
      const tree = git(args.root, ['write-tree']).toString('utf8').trim();
      console.log(`检查暂存快照 ${tree}，不使用未暂存的修正。`);
      return withSnapshot(args.root, tree, (snapshot) => checkTree(snapshot, { full: args.full }));
    }
    let commits;
    if (args.mode === '--revision') commits = [{ commit: resolveCommit(args.root, args.revision), label: args.revision }];
    else if (args.mode === '--pre-push') commits = pushCommits(args.root, fs.readFileSync(0, 'utf8'));
    else { console.log('检查当前工作区。'); return checkTree(args.root, { full: args.full }); }
    for (const { commit, label } of commits) {
      console.log(`检查目标提交 ${commit} (${label})，不以当前 HEAD 或工作区替代。`);
      if (withSnapshot(args.root, commit, (snapshot) => checkTree(snapshot, { full: args.full }))) return 1;
    }
    if (!commits.length) console.log('本次没有需要检查的提交目标（例如仅删除远端引用）。');
    return 0;
  } catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}

if (isMain(import.meta.url)) process.exitCode = main();
