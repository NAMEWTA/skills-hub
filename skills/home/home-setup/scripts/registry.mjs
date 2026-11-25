#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MARKER = '<!-- home-setup:generated repos map v1 -->';
export class RegistryError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const fail = (code, message) => { throw new RegistryError(code, message); };
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.length > 0 && !/[\x00-\x1f\x7f]/u.test(value);
const ownKeys = (value, allowed, label) => { if (Object.keys(value).some(key => !allowed.includes(key))) fail('UNKNOWN_FIELD', `${label} 含未定义字段；不能把身份、配置或派遣状态混入路径覆盖。`); };
export const revision = content => content === null ? 'absent' : `sha256:${createHash('sha256').update(content).digest('hex')}`;

function checkRemote(remote, label) {
  if (typeof remote !== 'string' || /[\x00-\x20\x7f]/u.test(remote)) fail('INVALID_REMOTE', `${label} remote 必须是无空白的身份字符串，或本地独有仓库的空字符串。`);
  if (/^[a-z][a-z0-9+.-]*:\/\//iu.test(remote)) {
    let parsed;
    try { parsed = new URL(remote); } catch { fail('INVALID_REMOTE', `${label} remote URL 无效。`); }
    if (parsed.password || parsed.search || parsed.hash || (parsed.protocol !== 'ssh:' && parsed.username)) fail('SECRET_REMOTE', `${label} remote 含认证信息或 URL 参数；仅保存无秘密身份。`);
  }
}

export function validateRegistry(value) {
  if (!plain(value) || ![1, 2].includes(value.formatVersion) || !Array.isArray(value.repos)) fail('REGISTRY_VERSION', '只读取 formatVersion: 1 或 2 与 repos 数组；未知版本不改写。');
  ownKeys(value, ['formatVersion', 'repos'], '登记');
  const ids = new Set();
  for (const repo of value.repos) {
    if (!plain(repo)) fail('INVALID_REPO', '每项登记必须是对象。');
    ownKeys(repo, ['id', 'purpose', 'aliases', 'groups', ...(value.formatVersion === 1 ? ['remote'] : ['remotes', 'primaryRemote']), 'localPath', 'intent', 'backgroundRef'], '仓库登记');
    if (!/^[a-z0-9][a-z0-9-]*$/u.test(repo.id || '') || ids.has(repo.id)) fail('DUPLICATE_ID', '仓库 id 必须是唯一的小写字母/数字/连字符标识。');
    ids.add(repo.id);
    if (!text(repo.purpose) || !text(repo.localPath)) fail('INVALID_REPO', `${repo.id} 缺少单行 purpose 或 localPath。`);
    for (const key of ['aliases', 'groups']) {
      if (repo[key] === undefined) continue;
      if (!Array.isArray(repo[key]) || repo[key].some(item => !text(item)) || new Set(repo[key]).size !== repo[key].length) fail('INVALID_REPO', `${repo.id} 的 ${key} 必须是不含重复项的字符串数组。`);
    }
    if (!['work', 'reference'].includes(repo.intent)) fail('INVALID_INTENT', `${repo.id} 的 intent 必须为 work 或 reference；它不是权限授权。`);
    if (value.formatVersion === 1) checkRemote(repo.remote, repo.id);
    else {
      if (normalizeLocalPath(repo.localPath) !== repo.localPath) fail('INVALID_PATH', `${repo.id} localPath 须为显式 ./ 或 ../ 相对路径，使用正斜线。`);
      if (!Array.isArray(repo.remotes)) fail('INVALID_REMOTE', `${repo.id} remotes 必须是保留名称及 URL 顺序的数组。`);
      const names = new Set();
      for (const remote of repo.remotes) {
        if (!plain(remote) || !text(remote.name) || /\s/u.test(remote.name) || names.has(remote.name)) fail('INVALID_REMOTE', `${repo.id} remote 名称无效或重复。`);
        ownKeys(remote, ['name', 'urls', 'pushUrls'], 'remote');
        names.add(remote.name);
        for (const key of ['urls', 'pushUrls']) {
          if (!Array.isArray(remote[key])) fail('INVALID_REMOTE', `${repo.id} remote 的 ${key} 必须是数组；没有显式 push URL 时写空数组。`);
          for (const url of remote[key]) { if (!url) fail('INVALID_REMOTE', '登记 URL 不得为空。'); checkRemote(url, repo.id); }
        }
        if (!remote.urls.length && !remote.pushUrls.length) fail('INVALID_REMOTE', `${repo.id} 的 remote 没有任何 URL，先核实 Git 配置。`);
      }
      if (!repo.remotes.length ? repo.primaryRemote !== null : !text(repo.primaryRemote) || !repo.remotes.some(remote => remote.name === repo.primaryRemote && remote.urls.length)) fail('INVALID_PRIMARY_REMOTE', `${repo.id} 必须明确选定含 fetch URL 的 primaryRemote；本地独有仓库写 null。`);
    }
    if (repo.backgroundRef !== undefined && (!text(repo.backgroundRef) || path.isAbsolute(repo.backgroundRef) || path.win32.isAbsolute(repo.backgroundRef) || repo.backgroundRef.split(/[\\/]/u).includes('..'))) fail('INVALID_BACKGROUND', `${repo.id} backgroundRef 必须是 Home 内的相对路径。`);
  }
  return value;
}

export function normalizeLocalPath(value) {
  if (!text(value) || path.isAbsolute(value) || path.win32.isAbsolute(value) || /^[A-Za-z]:/u.test(value)) fail('INVALID_PATH', '共享 localPath 只保存 Home 根相对位置；本机绝对路径写入 local.json。');
  const normalized = path.posix.normalize(value.replaceAll('\\', '/'));
  return normalized === '.' ? './' : normalized === '..' ? '../' : normalized.startsWith('../') ? normalized : `./${normalized.replace(/^\.\//u, '')}`;
}

export function validateLocal(value, registry) {
  if (!plain(value) || value.formatVersion !== 1 || !plain(value.paths)) fail('INVALID_LOCAL', 'local.json 只接受 formatVersion: 1 与 paths 对象。');
  ownKeys(value, ['formatVersion', 'paths'], 'local.json');
  const ids = new Set(validateRegistry(registry).repos.map(repo => repo.id));
  for (const [id, localPath] of Object.entries(value.paths)) {
    if (!ids.has(id) || !text(localPath)) fail('INVALID_LOCAL', `本机覆盖 ${id} 必须指向已登记 ID 和有效路径。`);
  }
  return value;
}

function readText(filename) {
  try {
    const stat = fs.lstatSync(filename);
    if (!stat.isFile() || stat.isSymbolicLink()) fail('UNSAFE_FILE', `拒绝将非普通文件作为登记或地图：${filename}`);
    return fs.readFileSync(filename, 'utf8');
  } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function decode(content, label) {
  try { return JSON.parse(content); } catch { fail('INVALID_JSON', `${label} 不是有效 JSON。`); }
}

function homePaths(home) {
  const requestedRoot = path.resolve(home);
  if (fs.lstatSync(requestedRoot).isSymbolicLink()) fail('UNSAFE_HOME', 'Home 根不能是符号链接；请明确选择真实协调仓库。');
  const homeRoot = fs.realpathSync(requestedRoot);
  if (!fs.statSync(homeRoot).isDirectory()) fail('INVALID_HOME', 'Home 必须是用户明确选定的现有目录。');
  for (const relative of ['.agents', '.agents/home']) {
    const target = path.join(homeRoot, relative);
    try { const stat = fs.lstatSync(target); if (!stat.isDirectory() || stat.isSymbolicLink()) fail('UNSAFE_PARENT', `拒绝通过非普通目录写入 ${relative}。`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const domainRoot = path.join(homeRoot, '.agents/home');
  return { homeRoot, domainRoot, registryFile: path.join(domainRoot, 'repos.json'), mapFile: path.join(domainRoot, 'repos.md') };
}

const md = value => String(value).replace(/[\\`*_[\]<>|]/gu, character => `\\${character}`);
const linkPath = value => value.split(path.sep).map(segment => encodeURIComponent(segment).replace(/[!'()*]/gu, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)).join('/');
export function renderMap(registry, { homeRoot, registryRevision } = {}) {
  validateRegistry(registry);
  const root = path.resolve(homeRoot || '.');
  const mapDir = path.join(root, '.agents/home');
  const rows = registry.repos.map(repo => {
    const target = linkPath(path.relative(mapDir, path.resolve(root, repo.localPath)) || '.');
    const background = repo.backgroundRef ? `[背景页](${linkPath(path.relative(mapDir, path.resolve(root, repo.backgroundRef)))})` : '未单列';
    const remoteSummary = registry.formatVersion === 1 ? repo.remote || '本地独有' : repo.remotes.map(remote => `${remote.name}${remote.name === repo.primaryRemote ? '（主）' : ''}: ${remote.urls.join('、')}${remote.pushUrls.length ? `；push: ${remote.pushUrls.join('、')}` : ''}`).join('；') || '本地独有';
    return `| ${repo.id} | ${md(repo.purpose)} | ${md((repo.aliases || []).join('、'))} | ${md((repo.groups || []).join('、'))} | ${repo.intent} | [${md(repo.localPath)}](${target}) | ${md(remoteSummary)} | ${background} |`;
  });
  return `${MARKER}\n<!-- registry-revision: ${registryRevision || revision(`${JSON.stringify(registry, null, 2)}\n`)} -->\n# 项目地图\n\n本页按需从 repos.json 生成，保存登记不会自动维护此导出。相对链接以 .agents/home/ 为基准；本机路径覆盖见 local.json，实际任务先用 home-route 解析。\n\n| repo ID | 一句话用途 | 别名 | 分组 | 用途 | 默认位置 | Git remote | Home 背景 |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}${rows.length ? '\n' : ''}\n涉及项目内部功能、代码、永久知识或验证时，由进入该项目实际 checkout 的 Agent 读取本地 AGENTS.md、有关 .agents 资料与所需 SKILL。地图指针不代表资料已读取或获得执行授权。\n`;
}

export function inspectRegistry(home, { includeMap = true } = {}) {
  const paths = homePaths(home);
  const registryText = readText(paths.registryFile);
  const registry = registryText === null ? { formatVersion: 2, repos: [] } : validateRegistry(decode(registryText, 'repos.json'));
  let mapText = null, mapError;
  if (includeMap) try { mapText = readText(paths.mapFile); } catch (error) { mapError = error.code || 'IO_FAILED'; }
  return { ...paths, registry, registryRevision: revision(registryText), mapRevision: mapError || !includeMap ? null : revision(mapText), mapStatus: !includeMap ? 'not-inspected' : mapError ? 'unavailable' : mapText === null ? 'absent' : !mapText.startsWith(MARKER) ? 'unmanaged' : mapText === renderMap(registry, { homeRoot: paths.homeRoot, registryRevision: revision(registryText) }) ? 'current' : 'stale', ...(mapError ? { mapError } : {}), registryText, mapText };
}

function verifyExpected(actual, expected, label) {
  if (!expected || !/^(absent|sha256:[a-f0-9]{64})$/u.test(expected)) fail('MISSING_REVISION', `${label} 需要 inspect 返回的显式 revision（首次为 absent）。`);
  if (actual !== expected) fail('STALE_WRITE', `${label} 已变化；重新读取、合并用户变更并生成新候选，不覆盖新版本。`);
}

function writeTemp(filename, content, mode = 0o600) {
  const temporary = path.join(path.dirname(filename), `.${path.basename(filename)}.home-${randomUUID()}.tmp`);
  const descriptor = fs.openSync(temporary, 'wx', mode);
  try { fs.writeFileSync(descriptor, content); fs.fsyncSync(descriptor); }
  catch (error) {
    fs.closeSync(descriptor);
    try { fs.unlinkSync(temporary); }
    catch { fail('RECOVERY_REQUIRED', `临时登记写入失败且清理失败：${temporary}。保留现场，未将该文件应用到登记真源。`); }
    throw error;
  }
  fs.closeSync(descriptor);
  return temporary;
}

function commitFiles(home, plans, preconditions, { fsOps = fs } = {}) {
  const { domainRoot } = homePaths(home);
  fs.mkdirSync(domainRoot, { recursive: true });
  const lock = path.join(domainRoot, '.registry-write.lock');
  const token = randomUUID();
  let descriptor;
  try { descriptor = fsOps.openSync(lock, 'wx', 0o600); }
  catch (error) { if (error.code === 'EEXIST') fail('WRITE_BUSY', '已有登记写入锁；核对原操作后处理，不自动删除锁或并发覆盖。'); throw error; }
  const prepared = [], applied = [];
  try {
    fs.writeFileSync(descriptor, `${token}\n`);
    homePaths(home);
    // The source registry is a precondition even when only its derived map changes.
    for (const item of preconditions) {
      if (readText(item.filename) !== item.before) fail('STALE_WRITE', '取得写锁后登记或地图已变化；重新读取并合并，不应用旧地图。');
    }
    for (const plan of plans) {
      if (readText(plan.filename) !== plan.before) fail('STALE_WRITE', '写入前内容已变化；保持其他写者的内容。');
      const mode = plan.before === null ? 0o600 : fs.statSync(plan.filename).mode & 0o777;
      prepared.push({ ...plan, temporary: writeTemp(plan.filename, plan.after, mode) });
    }
    for (const plan of prepared) {
      if (readText(plan.filename) !== plan.before) fail('STALE_WRITE', '应用前内容已变化；停止并恢复本次已应用部分。');
      fs.renameSync(plan.temporary, plan.filename);
      applied.push(plan);
    }
  } catch (error) {
    const unresolved = [];
    for (const plan of applied.reverse()) {
      try {
        if (readText(plan.filename) !== plan.after) { unresolved.push(path.basename(plan.filename)); continue; }
        if (plan.before === null) fs.unlinkSync(plan.filename);
        else fs.renameSync(writeTemp(plan.filename, plan.before, fs.statSync(plan.filename).mode & 0o777), plan.filename);
      } catch { unresolved.push(path.basename(plan.filename)); }
    }
    if (unresolved.length) fail('RECOVERY_REQUIRED', `写入中止且检测到并发/恢复失败：${unresolved.join(', ')}。以完整 repos.json 为登记真源，保留现场，重新检查后生成地图。`);
    throw error;
  } finally {
    for (const plan of prepared) if (fs.existsSync(plan.temporary)) fs.unlinkSync(plan.temporary);
    fs.closeSync(descriptor);
    if (readText(lock) === `${token}\n`) fs.unlinkSync(lock);
  }
}

export function saveRegistry(home, registry, { expectedRevision, expectedMapRevision, mapOnly = false, fsOps = fs } = {}) {
  const current = inspectRegistry(home, { includeMap: mapOnly });
  verifyExpected(current.registryRevision, expectedRevision, '登记');
  if (mapOnly) {
    if (current.mapError) fail(current.mapError, '地图目标不可读取或不是普通文件，未导出；登记真源保持原样。');
    verifyExpected(current.mapRevision, expectedMapRevision, '地图');
    if (current.mapStatus === 'unmanaged') fail('UNMANAGED_MAP', 'repos.md 是已有手写地图；先按授权接入并保留原件，不能直接覆盖。');
  } else {
    if (registry?.formatVersion !== 2) fail('MIGRATION_REQUIRED', '新保存使用 formatVersion: 2；旧 v1 先由 home-route --inspect 核实实际 remote 名称和 URL，再明确迁移，不能猜造 origin。');
    registry = { ...registry, repos: Array.isArray(registry.repos) ? registry.repos.map(repo => plain(repo) ? { ...repo, localPath: normalizeLocalPath(repo.localPath) } : repo) : registry.repos };
    validateRegistry(registry);
  }
  const registryText = mapOnly ? current.registryText : `${JSON.stringify(registry, null, 2)}\n`;
  if (registryText === null) fail('MISSING_REGISTRY', '尚无登记真源；先登记，再生成地图。');
  const mapText = mapOnly ? renderMap(current.registry, { homeRoot: current.homeRoot, registryRevision: revision(registryText) }) : null;
  const plans = [];
  if (!mapOnly && registryText !== current.registryText) plans.push({ filename: current.registryFile, before: current.registryText, after: registryText });
  if (mapOnly && mapText !== current.mapText) plans.push({ filename: current.mapFile, before: current.mapText, after: mapText });
  if (plans.length) commitFiles(home, plans, [
    { filename: current.registryFile, before: current.registryText },
    ...(mapOnly ? [{ filename: current.mapFile, before: current.mapText }] : []),
  ], { fsOps });
  return { status: plans.length ? 'saved' : 'unchanged', registryRevision: revision(registryText), ...(mapOnly ? { mapRevision: revision(mapText) } : {}), files: plans.map(plan => plan.filename), identityVerified: false, note: mapOnly ? '已显式导出地图；登记真源保持原样。' : '仅保存登记；Git 身份由 home-route 核实，地图按需查看或显式导出。' };
}

export function main(argv = process.argv.slice(2)) {
  try {
    const command = argv[0];
    if (!command || command === '--help') {
      console.log('用法：registry.mjs inspect --home HOME\nregistry.mjs validate --input JSON [--local LOCAL_JSON]\nregistry.mjs save --home HOME --input JSON --expect REV\nregistry.mjs map --home HOME\nregistry.mjs map --home HOME --write --expect REV --expect-map REV\ninspect/validate/map 默认只读；save 仅保存 v2 登记，map --write 显式导出 repos.md。');
      return 0;
    }
    if (!['inspect', 'validate', 'save', 'map'].includes(command)) fail('USAGE', '未知子命令。');
    const options = {};
    for (let index = 1; index < argv.length; index += 1) {
      const key = argv[index];
      if (key === '--write' && command === 'map' && options[key] === undefined) { options[key] = true; continue; }
      if (!['--home', '--input', '--local', '--expect', '--expect-map'].includes(key) || !argv[index + 1] || argv[index + 1].startsWith('--') || options[key] !== undefined) fail('USAGE', `未知、重复或缺值参数：${key}`);
      options[key] = argv[++index];
    }
    let result;
    if (command === 'validate') {
      if (!options['--input']) fail('USAGE', 'validate 需要 --input。');
      const registry = validateRegistry(decode(fs.readFileSync(options['--input'], 'utf8'), '候选登记'));
      if (options['--local']) validateLocal(decode(fs.readFileSync(options['--local'], 'utf8'), 'local.json'), registry);
      result = { status: 'valid', repos: registry.repos.length, identityVerified: false };
    } else {
      if (!options['--home']) fail('USAGE', '需要显式 --home，不从 cwd 猜 Home。');
      if (command === 'inspect') {
        const { registryText, mapText, ...view } = inspectRegistry(options['--home']);
        result = view;
      } else if (command === 'map' && !options['--write']) {
        if (options['--expect'] || options['--expect-map']) fail('USAGE', 'map 默认只读；要导出文件请显式添加 --write 和两个 revision。');
        const current = inspectRegistry(options['--home'], { includeMap: false });
        if (current.registryText === null) fail('MISSING_REGISTRY', '尚无登记真源；先登记，再查看地图。');
        console.log(renderMap(current.registry, { homeRoot: current.homeRoot, registryRevision: current.registryRevision }));
        return 0;
      } else {
        const registry = command === 'map' ? inspectRegistry(options['--home']).registry : options['--input'] ? decode(fs.readFileSync(options['--input'], 'utf8'), '候选登记') : fail('USAGE', 'save 需要 --input。');
        result = saveRegistry(options['--home'], registry, { expectedRevision: options['--expect'], expectedMapRevision: options['--expect-map'], mapOnly: command === 'map' });
      }
    }
    console.log(JSON.stringify(result, null, 2));
    return 0;
  } catch (error) {
    console.error(JSON.stringify({ status: 'failed', code: error.code || 'IO_FAILED', message: error.message }));
    return 2;
  }
}

function isDirectInvocation() {
  if (!process.argv[1]) return false;
  try { return fs.realpathSync.native(process.argv[1]) === fs.realpathSync.native(fileURLToPath(import.meta.url)); }
  catch { return false; }
}

if (isDirectInvocation()) process.exitCode = main();
