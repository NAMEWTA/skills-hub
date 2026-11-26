#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { entry, fail, git, gitRoot, homeRoot, isDirectInvocation } from './git-tools.mjs';

const start = '# BEGIN home-setup Git scope';
const end = '# END home-setup Git scope';
const rules = [
  start, '/*', '!/.gitignore', '!/AGENTS.md', '!/.agents/',
  '/temp/', '/.agents/**/temp/', '/.agents/**/node_modules/', '/.agents/dev/worktree/',
  '/.agents/.skills-*-backups/', '/.agents/.skills-*-install.lock/', '/.agents/home/local.json',
  '/.agents/**/.env', '/.agents/**/.env.*', '/.agents/**/.npmrc', '/.agents/ops/**/env.md',
  '/.agents/**/*.log', '/.agents/**/*.log.*', '/.agents/**/*.tmp', '/.agents/**/*.lock',
  '/.agents/home/**/*.png', '/.agents/home/**/*.jpg', '/.agents/home/**/*.jpeg',
  '/.agents/home/**/*.mp4', '/.agents/home/**/*.webm', end,
];
const requiredSkills = ['home-doctor', 'home-history', 'home-integrate', 'home-knowledge', 'home-map', 'home-route', 'home-setup', 'home-tasks', 'home-workflow'];
const noTrack = [
  /(?:^|\/)(?:temp|node_modules)(?:\/|$)/u,
  /^\.agents\/(?:dev\/worktree|\.skills-[^/]+-(?:backups|install\.lock))(?:\/|$)/u,
  /^\.agents\/home\/local\.json$/u,
  /(?:^|\/)\.(?:env(?:\..*)?|npmrc)$/u,
  /^\.agents\/ops\/(?:.*\/)?env\.md$/u,
  /(?:\.log(?:\.[^/]*)?|\.tmp|\.lock)(?:\/|$)/u,
  /^\.agents\/home\/.*\.(?:png|jpe?g|mp4|webm)$/u,
];

function inScope(relative) {
  if (relative === '.gitignore' || relative === 'AGENTS.md') return true;
  const normalized = relative.toLowerCase();
  return (normalized === '.agents' || normalized.startsWith('.agents/')) && !noTrack.some(pattern => pattern.test(normalized));
}

function readIgnore(filename) {
  const stat = entry(filename);
  if (!stat) return null;
  if (!stat.isFile()) fail('UNSAFE_IGNORE', '.gitignore 必须是同仓普通文件。');
  return fs.readFileSync(filename);
}

function revision(bytes) {
  return bytes === null ? 'absent' : `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}

function ignorePlan(before) {
  const text = before?.toString('utf8') || '';
  const lines = text.replace(/^\uFEFF/u, '').split(/\r?\n/u);
  const begin = lines.indexOf(start), finish = lines.indexOf(end);
  if (begin !== -1 || finish !== -1) {
    if (begin === -1 || finish <= begin || lines.lastIndexOf(start) !== begin || lines.lastIndexOf(end) !== finish) {
      fail('IGNORE_MARKERS', 'Home 忽略规则标记不完整或重复，请先核对已有规则。');
    }
    return { state: 'managed', bytes: before };
  }
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  const block = Buffer.from(`${rules.join(newline)}${newline}${text ? newline : ''}`);
  const bomLength = text.startsWith('\uFEFF') ? 3 : 0;
  return { state: before === null ? 'absent' : 'unmanaged', bytes: Buffer.concat([before?.subarray(0, bomLength) || Buffer.alloc(0), block, before?.subarray(bomLength) || Buffer.alloc(0)]) };
}

function scan(root) {
  const files = ['.gitignore'];
  const excluded = new Set(['temp/', '.agents/home/local.json', '.agents/dev/worktree/', '.agents/ops/env.md']);
  const boundaries = [];
  function visit(relative) {
    const filename = path.join(root, relative);
    const stat = entry(filename);
    if (!stat) return;
    if (!inScope(relative)) { excluded.add(stat.isDirectory() ? `${relative}/` : relative); return; }
    if (stat.isFile()) { if (relative !== '.gitignore') files.push(relative); return; }
    if (!stat.isDirectory() || relative === 'AGENTS.md') { boundaries.push(relative); excluded.add(relative); return; }
    if (entry(path.join(filename, '.git')) || (entry(path.join(filename, 'HEAD'))?.isFile() && entry(path.join(filename, 'objects'))?.isDirectory())) {
      boundaries.push(relative);
      excluded.add(`${relative}/`);
      return;
    }
    for (const name of fs.readdirSync(filename)) visit(`${relative}/${name}`);
  }
  visit('.agents');
  visit('AGENTS.md');
  for (const name of fs.readdirSync(root)) {
    if (['.git', '.gitignore', '.agents', 'AGENTS.md'].includes(name) || name === '.home-git.lock' || /^\.home-git-[0-9a-f-]+\.tmp$/u.test(name)) continue;
    const stat = entry(path.join(root, name));
    if (stat) excluded.add(stat.isDirectory() ? `${name}/` : name);
  }
  return { files: files.sort(), excluded: [...excluded].sort(), boundaries: boundaries.sort() };
}

function indexedPaths(root) {
  return git(root, ['ls-files', '--stage', '-z']).stdout.split('\0').filter(Boolean).map(record => {
    const tab = record.indexOf('\t');
    return { mode: record.slice(0, record.indexOf(' ')), path: record.slice(tab + 1) };
  });
}

function ignoreMatches(root, relativePaths) {
  const pathsByQuery = new Map();
  for (const relative of relativePaths) {
    const directory = relative.endsWith('/') ? relative.slice(0, -1) : null;
    // Git uses a trailing slash to check inside a directory, where its own ignore rules can apply.
    const query = directory && entry(path.join(root, directory))?.isDirectory() ? directory : relative;
    pathsByQuery.set(query, relative);
  }
  const input = [...pathsByQuery.keys()].map(query => `${query}\0`).join('');
  const output = git(root, ['check-ignore', '--no-index', '--verbose', '-z', '--stdin'], { input, accept: [0, 1] }).stdout.split('\0');
  const matches = new Map();
  for (let index = 0; index + 3 < output.length; index += 4) {
    const [source, line, rule, query] = output.slice(index, index + 4);
    matches.set(pathsByQuery.get(query), { source, line: Number(line), rule });
  }
  return matches;
}

export function inspectGit(home) {
  const root = homeRoot(home);
  const gitTop = gitRoot(root);
  if (gitTop && gitTop !== root) return { status: 'ancestor', homeRoot: root, gitRoot: gitTop };
  const ignore = readIgnore(path.join(root, '.gitignore'));
  const ignoreState = ignorePlan(ignore).state;
  const { files, excluded, boundaries } = scan(root);
  const missingSkills = requiredSkills.filter(name => {
    if (boundaries.some(relative => `.agents/skills/${name}/SKILL.md` === relative || `.agents/skills/${name}/SKILL.md`.startsWith(`${relative}/`))) return true;
    return !entry(path.join(root, '.agents/skills', name, 'SKILL.md'))?.isFile();
  });
  const result = { status: gitTop ? 'ready' : 'absent', homeRoot: root, gitRoot: gitTop, ignoreRevision: revision(ignore), ignoreState, boundaries, missingSkills };
  if (!gitTop) return { ...result, candidates: files, expectedExcluded: excluded };
  const matches = ignoreMatches(root, [...files, ...excluded]);
  const ignored = relative => matches.has(relative) && !matches.get(relative).rule.startsWith('!');
  const index = indexedPaths(root);
  const indexed = new Set(index.map(item => item.path));
  const trackedOutside = index.filter(item => !inScope(item.path) || ['120000', '160000'].includes(item.mode) || boundaries.some(boundary => item.path === boundary || item.path.startsWith(`${boundary}/`)));
  const exposed = excluded.filter(relative => !ignored(relative));
  const exposedRules = exposed.filter(relative => matches.has(relative)).map(relative => ({ path: relative, ...matches.get(relative) }));
  const ignoredFiles = files.filter(ignored).map(relative => ({ path: relative, tracked: indexed.has(relative), ...matches.get(relative) }));
  const blockedBaseline = ignoredFiles.filter(({ path: relative, tracked }) => !tracked && ['.gitignore', 'AGENTS.md', '.agents/home/repos.json', '.agents/skills/'].some(prefix => prefix.endsWith('/') ? relative.startsWith(prefix) : relative === prefix));
  const head = git(root, ['rev-parse', '--verify', '--quiet', 'HEAD'], { accept: [0, 1] }).stdout.trim() || null;
  const staged = git(root, ['diff', '--cached', '--name-only', '--no-renames', '--no-ext-diff', '-z']).stdout.split('\0').filter(Boolean);
  return {
    ...result, status: exposed.length || trackedOutside.length || blockedBaseline.length ? 'conflict' : 'ready', head, staged,
    tracked: [...indexed].sort(), trackable: files.filter(relative => !ignored(relative) && !indexed.has(relative)),
    ignoredFiles, blockedBaseline, exposed, exposedRules, trackedOutside,
  };
}

function writeIgnore(filename, before, after) {
  const temp = path.join(path.dirname(filename), `.home-git-${randomUUID()}.tmp`);
  const descriptor = fs.openSync(temp, 'wx', before === null ? 0o644 : entry(filename).mode & 0o777);
  try {
    try { fs.writeFileSync(descriptor, after); fs.fsyncSync(descriptor); }
    finally { fs.closeSync(descriptor); }
    if (revision(readIgnore(filename)) !== revision(before)) fail('STALE_IGNORE', '.gitignore 已变化，请重新检查。');
    fs.renameSync(temp, filename);
  } finally {
    if (entry(temp)) fs.unlinkSync(temp);
  }
}

function inspectIndependentHome(home) {
  const current = inspectGit(home);
  if (current.status === 'ancestor') fail('ANCESTOR_REPO', 'Home 位于另一 Git 工作树中，请先确认真正的仓库根。');
  return current;
}

function updateGitScope(current, expected) {
  if (current.ignoreRevision !== expected) fail('STALE_IGNORE', '.gitignore 基线不符，请先运行 inspect。');
  if (!current.gitRoot && current.boundaries.length) {
    fail('HOME_BOUNDARY', `Home 待跟踪范围存在嵌套仓库、目录链接或特殊入口：${current.boundaries.join('、')}。`);
  }
  if (current.gitRoot && current.ignoreState === 'managed') return current;

  const root = current.homeRoot;
  const lock = path.join(root, '.home-git.lock');
  const descriptor = fs.openSync(lock, 'wx', 0o600);
  let ignoreWritten = false;
  try {
    if (gitRoot(root) !== current.gitRoot) fail('STALE_GIT', 'Git 工作树已变化，请重新检查。');
    const filename = path.join(root, '.gitignore');
    const before = readIgnore(filename);
    if (revision(before) !== expected) fail('STALE_IGNORE', '.gitignore 已变化，请重新检查。');
    const { bytes } = ignorePlan(before);
    if (!before?.equals(bytes)) { writeIgnore(filename, before, bytes); ignoreWritten = true; }
    if (!current.gitRoot) git(root, ['init', '--template=', '-b', 'main']);
    return inspectGit(root);
  } catch (error) {
    if (ignoreWritten) error.message += ' 忽略规则已落盘，请先运行 inspect 再接续。';
    throw error;
  } finally {
    fs.closeSync(descriptor);
    fs.unlinkSync(lock);
  }
}

export function initGit(home, expected) {
  const current = inspectIndependentHome(home);
  return current.gitRoot ? current : updateGitScope(current, expected);
}

export function applyScope(home, expected) {
  const current = inspectIndependentHome(home);
  if (!current.gitRoot) fail('GIT_REQUIRED', '请在已有的 Home Git 根使用 apply-scope。尚无 Git 时使用 init。');
  return updateGitScope(current, expected);
}

export function main(argv = process.argv.slice(2)) {
  try {
    if (!argv.length || (argv.length === 1 && argv[0] === '--help')) {
      console.log('git.mjs inspect --home HOME\ngit.mjs init --home HOME --expect-ignore REV\ngit.mjs apply-scope --home HOME --expect-ignore REV\ninspect 只读。init 建立 Git 和跟踪范围。apply-scope 为已有 Home Git 根补齐跟踪范围。');
      return 0;
    }
    const [command, homeFlag, home, expectFlag, expected] = argv;
    const inspect = command === 'inspect' && argv.length === 3;
    const update = ['init', 'apply-scope'].includes(command) && argv.length === 5 && expectFlag === '--expect-ignore' && /^(?:absent|sha256:[a-f0-9]{64})$/u.test(expected);
    if (homeFlag !== '--home' || !home || home.startsWith('--') || !(inspect || update)) fail('USAGE', '请使用 --help 查看参数。');
    let result;
    if (inspect) result = inspectGit(home);
    else if (command === 'init') result = initGit(home, expected);
    else result = applyScope(home, expected);
    console.log(JSON.stringify(result, null, 2));
    return ['conflict', 'ancestor'].includes(result.status) ? 1 : 0;
  } catch (error) {
    console.error(JSON.stringify({ status: 'failed', code: error.code || 'IO_FAILED', message: error.message }));
    return 2;
  }
}

if (isDirectInvocation(import.meta.url)) process.exitCode = main();
