#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { inspectRegistry, validateLocal } from './registry.mjs';
import { entry, fail, git, gitRoot, homeRoot, inside, isDirectInvocation } from './git-tools.mjs';

const transports = ['file', 'https', 'http', 'ssh', 'git'];

function realParent(target) {
  let parent = path.dirname(target);
  while (!entry(parent)) {
    const next = path.dirname(parent);
    if (next === parent) fail('PATH_CONFLICT', '无法到达目标父目录。');
    parent = next;
  }
  for (let current = parent; ; current = path.dirname(current)) {
    if (!entry(current)?.isDirectory()) fail('PATH_CONFLICT', '目标父路径包含目录链接或非目录入口。');
    if (current === path.dirname(current)) break;
  }
  return parent;
}

function assertDestination(home, target) {
  if (inside(target, home) || ['.git', '.agents', 'temp'].some(name => inside(path.join(home, name), target))) {
    fail('PATH_CONFLICT', '目标与 Home 根或其管理目录重叠。');
  }
  const parentGit = gitRoot(realParent(target));
  if (parentGit && parentGit !== home) fail('PATH_CONFLICT', '目标位于另一个 Git 工作树内。');
  if (inside(home, target)) {
    const relative = path.relative(home, target).split(path.sep).join('/');
    if (git(home, ['check-ignore', '--quiet', '--no-index', '--', `${relative}/`], { accept: [0, 1] }).status !== 0) {
      fail('HOME_TRACKING_CONFLICT', 'Home Git 未忽略目标目录，先修复跟踪范围。');
    }
    const index = git(home, ['--literal-pathspecs', 'ls-files', '-z', '--', relative]).stdout;
    if (index) fail('HOME_TRACKING_CONFLICT', 'Home 索引已包含目标路径，先修复跟踪范围。');
  }
}

function readState(home) {
  for (const relative of ['.agents', '.agents/home']) {
    const directory = path.join(home, relative);
    const stat = entry(directory);
    if (stat && (!stat.isDirectory() || entry(path.join(directory, '.git')))) fail('HOME_BOUNDARY', '登记位置不是 Home 的真实资料目录。');
  }
  const { registry, registryRevision } = inspectRegistry(home, { includeMap: false });
  if (registryRevision === 'absent') fail('MISSING_REGISTRY', '克隆项目需要已有项目登记 repos.json。');
  const localFile = path.join(home, '.agents/home/local.json');
  const stat = entry(localFile);
  if (stat && !stat.isFile()) fail('UNSAFE_LOCAL', 'local.json 必须是同仓普通文件。');
  const localText = stat ? fs.readFileSync(localFile, 'utf8') : null;
  let localPaths = {};
  if (localText !== null) {
    let value;
    try { value = JSON.parse(localText); }
    catch { fail('INVALID_LOCAL', 'local.json 无法解析。'); }
    localPaths = validateLocal(value, registry).paths;
  }
  return { registry, registryRevision, localPaths, localText };
}

function runRoute(home, args) {
  const script = path.join(home, '.agents/skills/home-route/scripts/route.mjs');
  if (gitRoot(realParent(script)) !== home) fail('UNSAFE_HOME_ROUTE', 'home-route 入口位于另一个 Git 仓库。');
  if (!entry(script)?.isFile()) fail('MISSING_HOME_ROUTE', 'Home 基线缺少同仓 home-route 技能本体。');
  const result = spawnSync(process.execPath, [script, '--home', home, ...args], {
    cwd: home, encoding: 'utf8', timeout: 30_000, maxBuffer: 4 * 1024 * 1024, windowsHide: true,
  });
  let output;
  try { output = JSON.parse(result.status === 0 ? result.stdout : result.stderr); } catch { /* Report an unusable tool response below. */ }
  if (result.status !== 0 || !output) fail(output?.code || 'ROUTE_FAILED', 'home-route 未能核验目标身份。');
  return output;
}

function remoteConfig(repo) {
  if (Object.hasOwn(repo, 'remote')) return repo.remote ? { name: 'origin', url: repo.remote } : null;
  if (repo.primaryRemote === null) return null;
  return { name: repo.primaryRemote, url: repo.remotes.find(remote => remote.name === repo.primaryRemote).urls[0] };
}

function checkRemote(home, source, repo) {
  const url = source.url;
  const scheme = /^([a-z][a-z0-9+.-]*):\/\//iu.exec(url)?.[1].toLowerCase();
  const local = path.isAbsolute(url) || path.win32.isAbsolute(url);
  if ((scheme && !transports.includes(scheme)) || (!scheme && !local && (!/^(?:[^@\s/:]+@)?(?:\[[^\]]+\]|[^\s/:]+):[^:]/u.test(url) || /^[a-z]:[^\\/]/iu.test(url)))) {
    fail('UNSUPPORTED_REMOTE', '主远端需要标准 Git 网络地址或当前机器可访问的绝对本地地址。');
  }
  for (const name of repo.remotes?.map(remote => remote.name) || [source.name]) {
    if (name.startsWith('-') || git(home, ['check-ref-format', `refs/remotes/${name}/HEAD`], { accept: [0, 1] }).status !== 0) fail('INVALID_REMOTE_NAME', '登记的 remote 名称无法用于 Git。');
  }
  if (runRoute(home, ['--check-fetch', url]).status !== 'verified') fail('ROUTE_FAILED', '未确认主远端 URL 的实际身份。');
}

function configureRemotes(directory, repo, primary) {
  function addConfig(name, key, value) {
    git(directory, ['config', '--local', '--add', `remote.${name}.${key}`, value]);
  }
  for (const remote of repo.remotes || []) {
    const isPrimary = remote.name === primary;
    for (const url of isPrimary ? remote.urls.slice(1) : remote.urls) addConfig(remote.name, 'url', url);
    for (const url of remote.pushUrls) addConfig(remote.name, 'pushurl', url);
    if (!isPrimary && remote.urls.length) addConfig(remote.name, 'fetch', `+refs/heads/*:refs/remotes/${remote.name}/*`);
  }
}

function inspectCheckout(home, repo, checkout, explicit = false) {
  const result = runRoute(home, ['--repo', repo.id, ...(explicit ? ['--checkout', checkout] : [])]);
  if (result.status !== 'resolved' || !result.requestedPathIsGitRoot || result.actualCheckout !== fs.realpathSync.native(checkout)) {
    fail('PATH_CONFLICT', '目标未指向登记项目的独立 Git 根。');
  }
  return { head: result.head, branch: result.branch, dirty: result.dirty, remoteDrift: result.remoteDrift?.map(({ name, change, fields }) => ({ name, change, fields })) || [] };
}

function publish(staged, target) {
  if (process.platform === 'win32') {
    // Windows refuses replacing an existing directory with a directory rename.
    fs.renameSync(staged, target);
    return;
  }
  fs.mkdirSync(target); // Exclusive reservation; POSIX rename can replace this empty directory.
  try { fs.renameSync(staged, target); }
  catch (error) {
    try { fs.rmdirSync(target); } catch { /* Preserve any content added to the reservation. */ }
    throw error;
  }
}

function cloneProject(home, repo, target, source, state) {
  const parent = path.dirname(target);
  fs.mkdirSync(parent, { recursive: true });
  assertDestination(home, target);
  const temporary = fs.mkdtempSync(path.join(parent, '.home-restore-'));
  const staged = path.join(temporary, 'checkout');
  try {
    const protocolOptions = ['-c', 'protocol.allow=never', '-c', 'protocol.ext.allow=never', ...transports.flatMap(protocol => ['-c', `protocol.${protocol}.allow=always`])];
    try {
      git(home, [...protocolOptions, '-c', `core.hooksPath=${path.join(temporary, 'no-hooks')}`, 'clone', '--template=', '--no-recurse-submodules', '--no-local', '--origin', source.name, '--', source.url, staged], { timeout: 300_000 });
    } catch (error) {
      fail('CLONE_FAILED', `${error.message} 请核对主远端可达性和新机凭据。`);
    }
    configureRemotes(staged, repo, source.name);
    const checkout = inspectCheckout(home, repo, staged, true);
    if (!checkout.head) fail('MISSING_REMOTE_HEAD', '主远端没有可检出的默认分支提交。');
    if (checkout.remoteDrift.length) fail('REMOTE_CONFIG_CONFLICT', '新 checkout 的完整 remote 配置与登记不同。');
    const current = readState(home);
    if (current.registryRevision !== state.registryRevision || current.localText !== state.localText) fail('STALE_REGISTRY', '恢复期间登记或本机路径已变化，请重新预览。');
    assertDestination(home, target);
    if (entry(target)) fail('PATH_CONFLICT', '下载期间目标路径已被占用。');
    if (!inside(parent, staged) || !inside(parent, target)) fail('PATH_CONFLICT', '恢复路径超出目标父目录。');
    publish(staged, target);
    return inspectCheckout(home, repo, target);
  } finally {
    const stat = entry(temporary);
    if (stat?.isDirectory() && inside(parent, fs.realpathSync.native(temporary))) fs.rmSync(temporary, { recursive: true, force: true });
  }
}

export function restore(home, { apply = false, ids = [] } = {}) {
  home = homeRoot(home);
  if (gitRoot(home) !== home) fail('MISSING_HOME_GIT', '请从已建立的 Home Git 工作树执行恢复。');
  const state = readState(home);
  const targets = state.registry.repos.map(repo => ({ repo, target: path.resolve(home, Object.hasOwn(state.localPaths, repo.id) ? state.localPaths[repo.id] : repo.localPath) }));
  if (ids.some(id => !targets.some(({ repo }) => repo.id === id))) fail('UNKNOWN_REPO', '请求包含未登记的 repo ID。');
  const projects = [];
  for (const { repo, target } of targets) {
    if (ids.length && !ids.includes(repo.id)) continue;
    const project = { id: repo.id, target };
    try {
      if (targets.some(other => other.repo.id !== repo.id && (inside(target, other.target) || inside(other.target, target)))) fail('PATH_CONFLICT', '目标与另一个登记项目路径重叠。');
      assertDestination(home, target);
      const stat = entry(target);
      if (stat) {
        const marker = stat.isDirectory() && entry(path.join(target, '.git'));
        if (!marker || !(marker.isDirectory() || marker.isFile())) fail('PATH_CONFLICT', '目标已存在且不是可复用的独立 checkout。');
        Object.assign(project, { status: 'reused', ...inspectCheckout(home, repo, target) });
      } else {
        const source = remoteConfig(repo);
        if (!source) fail('LOCAL_ONLY', '项目仅存于旧机器，需要独立迁移其 Git 数据。');
        checkRemote(home, source, repo);
        Object.assign(project, apply ? { status: 'cloned', ...cloneProject(home, repo, target, source, state) } : { status: 'planned' });
      }
    } catch (error) {
      Object.assign(project, { status: 'blocked', code: error.code || 'IO_FAILED', message: error.message });
    }
    projects.push(project);
  }
  return { status: projects.some(project => project.status === 'blocked') ? 'partial' : apply ? 'restored' : 'preview', homeRoot: home, projects };
}

export function main(argv = process.argv.slice(2)) {
  try {
    if (!argv.length || (argv.length === 1 && argv[0] === '--help')) {
      console.log('restore.mjs --home HOME [--repo ID ...] [--apply]\n默认只预览；--apply 克隆缺失的登记项目并核验，已匹配的 checkout 原地复用。');
      return 0;
    }
    let home, apply = false;
    const ids = [];
    for (let index = 0; index < argv.length; index++) {
      const flag = argv[index];
      const value = argv[index + 1];
      if (flag === '--apply' && !apply) { apply = true; continue; }
      if (!value || value.startsWith('--')) fail('USAGE', '参数缺值，请使用 --help。');
      if (flag === '--home' && !home) home = value;
      else if (flag === '--repo' && !ids.includes(value)) ids.push(value);
      else fail('USAGE', '未知或重复参数，请使用 --help。');
      index++;
    }
    if (!home) fail('USAGE', '需要显式 --home。');
    const result = restore(home, { apply, ids });
    console.log(JSON.stringify(result, null, 2));
    return result.status === 'partial' ? 1 : 0;
  } catch (error) {
    console.error(JSON.stringify({ status: 'failed', code: error.code || 'IO_FAILED', message: error.message }));
    return 2;
  }
}

if (isDirectInvocation(import.meta.url)) process.exitCode = main();
