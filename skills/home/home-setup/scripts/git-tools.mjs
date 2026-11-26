import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function fail(code, message) {
  throw Object.assign(new Error(message), { code });
}

export function entry(filename) {
  try { return fs.lstatSync(filename, { throwIfNoEntry: false }); }
  catch (error) { if (error.code !== 'ENOTDIR') throw error; }
}

export function inside(root, target) {
  const relative = path.relative(root, target);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

export function homeRoot(home) {
  const requested = path.resolve(home);
  if (!entry(requested)?.isDirectory()) fail('UNSAFE_HOME', 'Home 根必须是真实的既有目录。');
  return fs.realpathSync.native(requested);
}

export function git(cwd, args, { input, accept = [0], timeout = 15_000 } = {}) {
  const env = { ...process.env, LC_ALL: 'C', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' };
  for (const key of ['GIT_DIR', 'GIT_COMMON_DIR', 'GIT_WORK_TREE', 'GIT_IMPLICIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX', 'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG', 'GIT_CONFIG_COUNT', 'GIT_CONFIG_PARAMETERS', 'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES', 'GIT_DISCOVERY_ACROSS_FILESYSTEM']) delete env[key];
  const result = spawnSync('git', ['-c', 'core.fsmonitor=false', '-C', cwd, ...args], {
    env, input, encoding: 'utf8', timeout, maxBuffer: 32 * 1024 * 1024, windowsHide: true,
  });
  if (result.error || !accept.includes(result.status)) {
    const operation = args.find(arg => !arg.startsWith('-') && !arg.includes('='));
    fail(result.error?.code === 'ENOENT' ? 'GIT_UNAVAILABLE' : 'GIT_FAILED', `Git ${operation} 失败（${result.error?.code || result.signal || result.status}）。`);
  }
  return result;
}

export function gitRoot(directory) {
  if (entry(path.join(directory, '.git'))?.isSymbolicLink()) fail('UNSAFE_GIT', '.git 入口为目录链接，无法安全确认工作树。');
  const query = git(directory, ['rev-parse', '--show-toplevel'], { accept: [0, 128] });
  if (query.status === 0) return fs.realpathSync.native(query.stdout.replace(/\r?\n$/u, ''));
  if (!/^fatal: not a git repository\b/u.test(query.stderr)) fail('UNSAFE_GIT', 'Git 工作树不可确认，可能是裸仓库、所有权或配置异常。');
  for (let current = directory; ; current = path.dirname(current)) {
    if (entry(path.join(current, '.git'))) fail('UNSAFE_GIT', '路径上存在无法确认的 .git 入口。');
    if (current === path.dirname(current)) return null;
  }
}

export function isDirectInvocation(url) {
  if (!process.argv[1]) return false;
  try { return fs.realpathSync.native(process.argv[1]) === fs.realpathSync.native(fileURLToPath(url)); }
  catch { return false; }
}
