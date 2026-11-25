#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export class RouteError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const fail = (code, message) => { throw new RouteError(code, message); };
const text = (value) => typeof value === 'string' && value.length > 0 && !/[\x00-\x1f\x7f]/u.test(value);
const inside = (root, target) => { const rel = path.relative(root, target); return rel === '' || (!rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel)); };
const exists = (filename) => { try { fs.lstatSync(filename); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } };

function homePath(inputHome) {
  const requested = path.resolve(inputHome);
  if (fs.lstatSync(requested).isSymbolicLink()) fail('UNSAFE_HOME', 'Home 根不能是符号链接；使用明确的真实协调仓库。');
  const root = fs.realpathSync.native(requested);
  if (!fs.statSync(root).isDirectory()) fail('UNSAFE_HOME', 'Home 根必须是已有目录。');
  for (const relative of ['.agents', '.agents/home']) {
    const filename = path.join(root, relative);
    if (!exists(filename)) continue;
    const stat = fs.lstatSync(filename);
    if (!stat.isDirectory() || stat.isSymbolicLink()) fail('UNSAFE_HOME', `Home 资料父目录不是同仓普通目录：${relative}`);
  }
  return root;
}

// Unknown SSH servers keep their user and absolute/home-relative path semantics.
// Only GitHub's documented git@github.com clone form has cross-transport identity.
export function normalizeRemote(value) {
  if (!text(value)) fail('INVALID_REMOTE', 'remote 必须是无控制字符的非空字符串。');
  let transport, host, port = '', repoPath, username = '', pathKind = 'absolute';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    let url;
    try { url = new URL(value); } catch { fail('INVALID_REMOTE', 'remote URL 无法解析。'); }
    transport = url.protocol.slice(0, -1).toLowerCase();
    if (url.password || url.search || url.hash || (transport !== 'ssh' && url.username)) {
      fail('SECRET_REMOTE', 'remote 不得含认证信息、查询参数或片段；请使用不带秘密的身份 URL。');
    }
    if (!['http', 'https', 'ssh', 'git'].includes(transport)) return { kind: 'opaque', identity: value };
    host = url.hostname.toLowerCase();
    port = url.port;
    username = url.username;
    repoPath = url.pathname.replace(/^\//, '');
  } else {
    const scp = value.match(/^(?:([^@\s/:]+)@)?(\[[^\]]+\]|[^\s/:]+):(.+)$/u);
    if (!scp || /^[A-Za-z]:[\\/]/u.test(value)) return { kind: 'opaque', identity: value };
    transport = 'ssh'; username = scp[1] || ''; host = scp[2].toLowerCase(); repoPath = scp[3];
    pathKind = repoPath.startsWith('/') ? 'absolute' : 'home-relative';
    repoPath = repoPath.replace(/^\//, '');
  }
  repoPath = repoPath.replace(/\/+$/, '').replace(/\.git$/, '');
  if (!host || !repoPath || repoPath.split('/').some(part => !part || part === '.' || part === '..') || /[?#]/u.test(repoPath)) {
    fail('INVALID_REMOTE', 'remote 必须保留明确的 host 与仓库路径。');
  }
  const standardPort = { http: '80', https: '443', ssh: '22', git: '9418' }[transport];
  const authority = !port || port === standardPort ? host : `${host}:${transport}:${port}`;
  const githubClone = host === 'github.com' && username === 'git' && (!port || port === '22') && !repoPath.startsWith('~');
  const identity = transport === 'ssh' && !githubClone
    ? `ssh://${username || '(default)'}@${authority}/${pathKind}/${repoPath}`
    : `${authority}/${repoPath}`;
  return { kind: 'network', host, port: port || null, repositoryPath: repoPath, transport, username: username || null, pathKind, identity };
}

function readJson(filename, optional = false) {
  if (optional && !exists(filename)) return undefined;
  if (exists(filename)) {
    const stat = fs.lstatSync(filename);
    if (!stat.isFile() || stat.isSymbolicLink()) fail('UNSAFE_FILE', 'Home 登记和路径覆盖必须是同仓普通文件；不跟随链接读取。');
  }
  try { return JSON.parse(fs.readFileSync(filename, 'utf8')); }
  catch (error) { fail('INVALID_JSON', `${filename} 无法读取为 JSON（${error.code || '语法错误'}）。`); }
}

export function readRegistry(homeRoot) {
  homeRoot = homePath(homeRoot);
  const value = readJson(path.join(homeRoot, '.agents/home/repos.json'));
  if (value?.formatVersion !== 1 || !Array.isArray(value.repos)) fail('REGISTRY_VERSION', '只读取 formatVersion: 1 的 repos 数组；未知版本不猜测迁移。');
  const ids = new Set();
  for (const repo of value.repos) {
    if (!repo || !/^[a-z0-9][a-z0-9-]*$/u.test(repo.id || '') || ids.has(repo.id) || !text(repo.localPath) || typeof repo.remote !== 'string') {
      fail('INVALID_REGISTRY', '登记必须含唯一 id、localPath 与 remote；请由 home-setup 校验完整 schema。');
    }
    if (repo.aliases !== undefined && (!Array.isArray(repo.aliases) || repo.aliases.some(alias => !text(alias)))) fail('INVALID_REGISTRY', `仓库 ${repo.id} 的 aliases 无效。`);
    if (repo.groups !== undefined && (!Array.isArray(repo.groups) || repo.groups.some(group => !text(group)))) fail('INVALID_REGISTRY', `仓库 ${repo.id} 的 groups 无效。`);
    if (repo.remote) normalizeRemote(repo.remote);
    ids.add(repo.id);
  }
  return value;
}

export function readLocalPaths(homeRoot, registry) {
  homeRoot = homePath(homeRoot);
  const value = readJson(path.join(homeRoot, '.agents/home/local.json'), true);
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || value.formatVersion !== 1 || !value.paths || typeof value.paths !== 'object' || Array.isArray(value.paths) || Object.keys(value).some(key => !['formatVersion', 'paths'].includes(key))) {
    fail('INVALID_LOCAL', 'local.json 只接受 formatVersion: 1 与 paths（repo ID → 本机路径）。');
  }
  const known = new Set(registry.repos.map(repo => repo.id));
  for (const [id, localPath] of Object.entries(value.paths)) {
    if (!known.has(id) || !text(localPath)) fail('INVALID_LOCAL', `local.json 的 ${id} 不是已登记 ID 或有效路径；禁止身份/配置覆盖。`);
  }
  return value.paths;
}

export function selectRepos(registry, query, { group = false } = {}) {
  if (!text(query)) fail('MISSING_QUERY', '提供准确 repo ID、别名或显式分组。');
  if (group) return registry.repos.filter(repo => (repo.groups || []).includes(query));
  const exact = registry.repos.find(repo => repo.id === query);
  return exact ? [exact] : registry.repos.filter(repo => (repo.aliases || []).includes(query));
}

function git(cwd, args, { optional = false } = {}) {
  const env = { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0' };
  for (const key of ['GIT_DIR', 'GIT_COMMON_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX', 'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG', 'GIT_CONFIG_COUNT', 'GIT_CONFIG_PARAMETERS']) delete env[key];
  const result = spawnSync('git', ['-c', 'core.fsmonitor=false', '-C', cwd, ...args], { env, encoding: 'utf8', timeout: 15_000, maxBuffer: 4 * 1024 * 1024, windowsHide: true });
  if (result.error || result.status !== 0) {
    if (optional && !result.error) return null;
    fail('GIT_CHECK_FAILED', `Git 只读核查失败：${args[0]}（${result.error?.code || result.status}）；未执行 fetch、切分支或写入。`);
  }
  return result.stdout.trim();
}

export function inspectCheckout(inputPath) {
  const requestedPath = path.resolve(inputPath);
  let realPath;
  // Resolve every compared path through the native filesystem implementation;
  // Windows 8.3 input paths and Git's long paths must have the same identity.
  try { realPath = fs.realpathSync.native(requestedPath); } catch (error) { fail('PATH_UNAVAILABLE', `路径不可达：${requestedPath}（${error.code}）。`); }
  if (!fs.statSync(realPath).isDirectory()) fail('NOT_DIRECTORY', `目标不是目录：${requestedPath}`);
  const actualCheckout = fs.realpathSync.native(git(realPath, ['rev-parse', '--show-toplevel']));
  const gitDir = fs.realpathSync.native(git(actualCheckout, ['rev-parse', '--absolute-git-dir']));
  const commonDir = fs.realpathSync.native(git(actualCheckout, ['rev-parse', '--path-format=absolute', '--git-common-dir']));
  const remoteLines = git(actualCheckout, ['config', '--get-regexp', '^remote\\..*\\.url$'], { optional: true });
  const remotes = [];
  for (const line of (remoteLines || '').split('\n').filter(Boolean)) {
    const match = line.match(/^remote\.(.+)\.url\s+(.+)$/u);
    if (!match) continue;
    let identity;
    try { identity = normalizeRemote(match[2]); }
    catch (error) { fail(error.code || 'INVALID_REMOTE', `目标 remote ${match[1]} 的 URL 不适合保存；先由项目 owner 移除内嵌认证信息或修复格式。`); }
    remotes.push({ name: match[1], ...identity });
  }
  const head = git(actualCheckout, ['rev-parse', '--verify', 'HEAD'], { optional: true });
  const branch = git(actualCheckout, ['symbolic-ref', '--quiet', '--short', 'HEAD'], { optional: true });
  const dirty = Boolean(git(actualCheckout, ['status', '--porcelain=v1', '--untracked-files=normal']));
  return {
    requestedPath, realPath, actualCheckout, gitDir, commonDir,
    isLinkedWorktree: gitDir !== commonDir,
    requestedPathIsGitRoot: realPath === actualCheckout,
    followsPathAlias: requestedPath !== realPath,
    head, branch, dirty, remotes,
    entries: {
      agentsFile: exists(path.join(actualCheckout, 'AGENTS.md')),
      agentsDirectory: exists(path.join(actualCheckout, '.agents')),
      skillsDirectory: exists(path.join(actualCheckout, '.agents/skills')),
    },
    observedAt: new Date().toISOString(), executionHost: os.hostname(),
  };
}

export function resolveReference(checkout, reference) {
  if (!text(reference) || path.isAbsolute(reference) || path.win32.isAbsolute(reference) || reference.split(/[\\/]/u).includes('..')) {
    fail('INVALID_REFERENCE', '项目资料引用必须是实际 checkout 内的相对路径，不接受父目录跳转。');
  }
  checkout = fs.realpathSync.native(path.resolve(checkout));
  const target = path.resolve(checkout, reference);
  if (!inside(checkout, target)) fail('REFERENCE_ESCAPE', '引用离开实际 checkout。');
  const present = exists(target);
  let realTarget = null;
  if (present) {
    try { realTarget = fs.realpathSync.native(target); } catch { fail('BROKEN_REFERENCE', '引用存在但真实目标不可达。'); }
    if (!inside(checkout, realTarget)) fail('REFERENCE_ESCAPE', '引用经 symlink/junction 指向 checkout 之外。');
  }
  return { relativePath: reference, target, realTarget, exists: present, contentsRead: false };
}

export function routeRepo(homeRoot, repo, { localPaths = {}, checkout, reference } = {}) {
  homeRoot = homePath(homeRoot);
  const registeredPath = path.resolve(homeRoot, localPaths[repo.id] || repo.localPath);
  const chosenPath = checkout ? path.resolve(homeRoot, checkout) : registeredPath;
  const actual = inspectCheckout(chosenPath);
  const expected = repo.remote ? normalizeRemote(repo.remote) : null;
  let identityEvidence;
  if (expected) {
    identityEvidence = matchIdentity(actual.remotes, expected, repo.id);
  } else {
    if (actual.remotes.length) fail('IDENTITY_CONFLICT', `仓库 ${repo.id} 登记为本地独有，但实际配置了 remote；先由 home-setup 核实登记。`);
    if (checkout && path.resolve(chosenPath) !== path.resolve(registeredPath)) {
      const registered = inspectCheckout(registeredPath);
      if (registered.commonDir !== actual.commonDir) fail('IDENTITY_CONFLICT', '无 remote 的替代 checkout 必须由同一 Git common directory 证明，不能把另一个本地仓库视为 worktree。');
    }
    identityEvidence = { type: 'local-only', commonDir: actual.commonDir };
  }
  const result = {
    status: 'resolved', repoId: repo.id, purpose: repo.purpose || '', intent: repo.intent,
    homeRoot, registeredPath, pathSource: checkout ? 'explicit-checkout' : localPaths[repo.id] ? 'local-path-override' : 'registry',
    identityEvidence, ...actual,
    contextRead: false,
    next: '由进入实际 checkout 的项目 Agent 读取 AGENTS.md、有关 .agents 资料和所需 SKILL；本结果只核对位置与入口。',
  };
  if (reference) result.reference = resolveReference(actual.actualCheckout, reference);
  return result;
}

function matchIdentity(remotes, expected, repoId = '待接入项目') {
  // An parent URL does not change the identity of a fork's origin.
  const origin = remotes.filter(remote => remote.name === 'origin');
  const selected = origin.length ? origin : remotes;
  if (!selected.length || selected.some(remote => remote.identity !== expected.identity || remote.kind !== expected.kind)) {
    fail('IDENTITY_CONFLICT', `仓库 ${repoId} 的 origin（无 origin 时为全部已配置 remote）与登记身份不一致或存在歧义；parent 命中不能代替 fork 身份核查。`);
  }
  return { type: 'remote', expected, selection: origin.length ? 'origin' : 'unambiguous-remotes', matchedRemoteNames: selected.map(remote => remote.name) };
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--help') { options.help = true; continue; }
    if (!['--home', '--repo', '--group', '--checkout', '--ref', '--inspect', '--expected-remote'].includes(key) || !argv[index + 1] || argv[index + 1].startsWith('--')) fail('USAGE', `未知或缺值参数：${key}`);
    if (options[key.slice(2)] !== undefined) fail('USAGE', `重复参数：${key}`);
    options[key.slice(2)] = argv[++index];
  }
  return options;
}

export function main(argv = process.argv.slice(2)) {
  try {
    const options = parseArgs(argv);
    if (options.help) {
      console.log('用法：node route.mjs --home HOME --repo ID或别名 [--checkout 路径] [--ref 相对路径]\n分组：--home HOME --group 组名；接入前：--inspect 路径 [--expected-remote URL]\n只读本机核查；远端须在用户指定且可达的实际主机运行，不启动 Agent。');
      return 0;
    }
    if (options.inspect) {
      if (options.home || options.repo || options.group || options.checkout || options.ref) fail('USAGE', '--inspect 不与登记路由参数混用。');
      const result = inspectCheckout(options.inspect);
      if (options['expected-remote'] !== undefined) {
        const expected = normalizeRemote(options['expected-remote']);
        result.identityEvidence = matchIdentity(result.remotes, expected);
      }
      console.log(JSON.stringify({ status: 'inspected', ...result, contextRead: false }, null, 2));
      return 0;
    }
    if (!options.home || Boolean(options.repo) === Boolean(options.group) || options['expected-remote']) fail('USAGE', '登记路由需要 --home 以及 --repo/--group 中的一项。');
    if (options.group && options.checkout) fail('USAGE', '一个 --checkout 不能覆盖整组仓库；分别解析准确 ID。');
    const homeRoot = homePath(options.home);
    const registry = readRegistry(homeRoot);
    const localPaths = readLocalPaths(homeRoot, registry);
    const selected = selectRepos(registry, options.repo || options.group, { group: Boolean(options.group) });
    if (!selected.length) { console.log(JSON.stringify({ status: 'not_found', query: options.repo || options.group })); return 3; }
    if (!options.group && selected.length > 1) { console.log(JSON.stringify({ status: 'ambiguous', candidates: selected.map(repo => ({ id: repo.id, purpose: repo.purpose, localPath: repo.localPath })) }, null, 2)); return 3; }
    const results = selected.map(repo => {
      try { return routeRepo(homeRoot, repo, { localPaths, checkout: options.checkout, reference: options.ref }); }
      catch (error) { return { status: 'conflict', repoId: repo.id, code: error.code || 'CHECK_FAILED', message: error.message }; }
    });
    console.log(JSON.stringify(options.group ? { status: results.every(result => result.status === 'resolved') ? 'resolved' : 'partial', results } : results[0], null, 2));
    return results.every(result => result.status === 'resolved') ? 0 : 3;
  } catch (error) {
    console.error(JSON.stringify({ status: 'invalid', code: error.code || 'READ_FAILED', message: error.message }));
    return 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
