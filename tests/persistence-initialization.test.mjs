import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot, createInstaller } from '../install.mjs';
import { planPersistence } from '../scripts/init-persistence.mjs';
import { isolatedGitEnvironment, snapshot } from './helpers.mjs';

const dev = ['dev', 'dev/changes', 'dev/notes', 'dev/deploy', 'dev/archive',
  'dev/archive/changes/implemented', 'dev/archive/changes/rejected', 'dev/project', 'dev/context']
  .map(directory => `.agents/${directory}/AGENTS.md`).sort();
const system = '.agents/system/AGENTS.md';
const home = '.agents/home/AGENTS.md';
const tempRule = '/temp/';
const worktreeRule = '/.agents/dev/worktree/';
const homeRule = '/.agents/home/local.json';
function project(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-init-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function files(root) {
  const result = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(filename);
      else if (entry.isFile()) result.push(path.relative(root, filename).split(path.sep).join('/'));
    }
  }
  visit(root);
  return result.sort();
}
function records(root) { return files(root).filter(file => !file.startsWith('.agents/skills/')); }
function run(root, ...args) {
  return spawnSync(process.execPath, [path.join(repositoryRoot, 'install.mjs'), ...args], { cwd: root, encoding: 'utf8' });
}
function success(result) { assert.equal(result.status, 0, result.stdout + result.stderr); return result; }

for (const [label, args, expected] of [
  ['one dev skill', ['--skill', 'dev-intake'], [...dev, '.gitignore']],
  ['dev domain', ['--domain', 'dev'], [...dev, '.gitignore']],
  ['system only', ['--skill', 'system-inspect'], [system, '.gitignore'].sort()],
  ['ops only', ['--domain', 'ops'], ['.agents/ops/AGENTS.md']],
  ['one home skill', ['--skill', 'home-setup'], [home, '.gitignore'].sort()],
  ['home domain', ['--domain', 'home'], [home, '.gitignore'].sort()],
  ['independent skill only', ['--skill', 'zh-archify'], []],
  ['mixed domains', ['--skill', 'dev-intake', 'system-inspect'], [...dev, system, '.gitignore'].sort()],
  ['all domains', ['--all'], [...dev, system, home, '.agents/ops/AGENTS.md', '.gitignore'].sort()],
]) test(`installing ${label} bootstraps exactly the selected domain records`, t => {
  const root = project(t);
  const preview = success(run(root, 'install', ...args, '--dry-run'));
  assert.match(preview.stdout, /would install/);
  if (expected.length) assert.match(preview.stdout, /would create/);
  else assert.doesNotMatch(preview.stdout, /would create|\.gitignore/);
  assert.deepEqual(files(root), []);
  success(run(root, 'install', ...args));
  assert.deepEqual(records(root), expected);
  assert.equal(fs.existsSync(path.join(root, 'temp')), false);
  for (const file of expected) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    if (file === '.gitignore') {
      const rules = [expected.includes(dev[0]) && worktreeRule, (expected.includes(dev[0]) || expected.includes(system)) && tempRule,
        expected.includes(home) && homeRule].filter(Boolean);
      assert.equal(content, rules.join('\n') + '\n');
      continue;
    }
    assert.match(content, /^# /);
    assert.ok(Array.from(content.replace(/\s/gu, '')).length <= 400, file);
  }
});

test('a second Claude link failure restores mixed domain navigation, ignore bytes and skill backups in one transaction', t => {
  const root = project(t);
  const regular = createInstaller();
  const selected = regular.catalog().filter(skill => ['dev-intake', 'home-setup', 'system-inspect'].includes(skill.name));
  assert.equal(selected.length, 3);
  const installed = path.join(root, '.agents/skills/dev-intake');
  fs.mkdirSync(path.dirname(installed), { recursive: true });
  fs.cpSync(selected.find(skill => skill.name === 'dev-intake').source, installed, { recursive: true });
  fs.writeFileSync(path.join(installed, 'local.txt'), 'Original skill content.\n');
  fs.mkdirSync(path.join(root, '.agents/dev/notes'), { recursive: true });
  fs.writeFileSync(path.join(root, '.agents/dev/notes/user.md'), 'Existing project knowledge.\n');
  fs.writeFileSync(path.join(root, '.agents/dev/AGENTS.md'), '# Previous managed navigation\n');
  fs.writeFileSync(path.join(root, '.gitignore'), '\uFEFF# 本地规则\r\n/generated/');
  const previous = snapshot(root);
  let attempts = 0;
  const installer = createInstaller({ fsOps: { ...fs, symlinkSync(target, destination, type) {
    assert.equal(type, 'dir');
    assert.match(fs.readFileSync(path.join(root, '.gitignore'), 'utf8'), /\/\.agents\/home\/local\.json/);
    assert.ok(fs.existsSync(path.join(root, home)));
    if (++attempts === 2) throw Object.assign(new Error('fixture second alias failed'), { code: 'EIO' });
    return fs.symlinkSync(target, destination, type);
  } } });
  assert.throws(() => installer.apply(selected, root), /rolled back.*second alias failed/);
  assert.equal(attempts, 2);
  assert.deepEqual(snapshot(root), previous);
  assert.equal(fs.existsSync(path.join(root, '.claude')), false);
});

test('home local defaults preserve explicit Git exceptions and leave business records unchanged', t => {
  const root = project(t);
  const env = isolatedGitEnvironment(project(t));
  const git = (...args) => spawnSync('git', args, { cwd: root, encoding: 'utf8', env });
  assert.equal(git('init', '--quiet').status, 0);
  fs.mkdirSync(path.join(root, '.agents/home/context'), { recursive: true });
  const local = path.join(root, '.agents/home/local.json');
  const preferences = path.join(root, '.agents/home/context/preferences.md');
  const rootRules = path.join(root, 'AGENTS.md');
  const originalRootRules = Buffer.from('# 用户的根规则\r\n');
  fs.writeFileSync(local, '{"formatVersion":1,"paths":{}}\n');
  fs.writeFileSync(preferences, '# 用户明确保存的设置\n');
  fs.writeFileSync(rootRules, originalRootRules);
  const original = '\uFEFF# Keep the explicitly selected mapping\r\n!/.agents/home/local.json\r\n';
  fs.writeFileSync(path.join(root, '.gitignore'), original);
  success(run(root, 'install', '--skill', 'home-setup'));
  const expected = '\uFEFF/.agents/home/local.json\r\n' + original.slice(1);
  assert.equal(fs.readFileSync(path.join(root, '.gitignore'), 'utf8'), expected);
  assert.equal(git('check-ignore', '--quiet', '.agents/home/local.json').status, 1);
  assert.equal(fs.readFileSync(local, 'utf8'), '{"formatVersion":1,"paths":{}}\n');
  assert.equal(fs.readFileSync(preferences, 'utf8'), '# 用户明确保存的设置\n');
  assert.deepEqual(fs.readFileSync(rootRules), originalRootRules);
  for (const file of ['repos.json', 'repos.md', 'relations.md', 'context/dispatch', 'context/team', 'notes', 'inbox', 'history', 'coordination']) {
    assert.equal(fs.existsSync(path.join(root, '.agents/home', file)), false, file);
  }
  const dispatch = path.join(root, '.agents/home/context/dispatch/native.md');
  const team = path.join(root, '.agents/home/context/team/default.md');
  fs.mkdirSync(path.dirname(dispatch));
  fs.mkdirSync(path.dirname(team));
  fs.writeFileSync(dispatch, '# 当前宿主原生派遣\n');
  fs.writeFileSync(team, '# Home 项目负责人\n');
  const navigation = path.join(root, home);
  fs.writeFileSync(navigation, '# 旧版 Home 导航\n');
  success(run(root, 'install', '--domain', 'home'));
  assert.deepEqual(fs.readFileSync(navigation), fs.readFileSync(path.join(repositoryRoot, 'scripts/persistence/home.md')));
  assert.deepEqual(fs.readFileSync(rootRules), originalRootRules);
  assert.equal(fs.readFileSync(dispatch, 'utf8'), '# 当前宿主原生派遣\n');
  assert.equal(fs.readFileSync(team, 'utf8'), '# Home 项目负责人\n');
  assert.equal(fs.readFileSync(preferences, 'utf8'), '# 用户明确保存的设置\n');
  assert.equal(fs.readFileSync(path.join(root, '.gitignore'), 'utf8'), expected);

  fs.unlinkSync(navigation);
  success(run(root, 'install', '--skill', 'home-setup'));
  assert.deepEqual(fs.readFileSync(navigation), fs.readFileSync(path.join(repositoryRoot, 'scripts/persistence/home.md')));
  assert.deepEqual(fs.readFileSync(rootRules), originalRootRules);
  assert.equal(fs.readFileSync(preferences, 'utf8'), '# 用户明确保存的设置\n');
});

for (const redirected of ['parent', 'file']) test(`link failure rollback does not follow a replaced persistence ${redirected}`, t => {
  const root = project(t);
  const outside = project(t);
  const original = '# Previous managed Home navigation\n';
  fs.mkdirSync(path.join(root, '.agents/home'), { recursive: true });
  fs.writeFileSync(path.join(root, '.agents/home/AGENTS.md'), original);
  fs.writeFileSync(path.join(outside, 'AGENTS.md'), '# Outside content must survive\n');
  const previous = snapshot(outside);
  const regular = createInstaller();
  const selected = regular.catalog().filter(skill => skill.name === 'home-setup');
  const installer = createInstaller({ fsOps: { ...fs, symlinkSync() {
    const redirectedPath = path.join(root, '.agents/home', redirected === 'file' ? 'AGENTS.md' : '');
    const moved = path.join(root, 'moved-home-' + redirected);
    fs.renameSync(redirectedPath, moved);
    fs.symlinkSync(redirected === 'file' ? path.join(outside, 'AGENTS.md') : outside, redirectedPath,
      redirected === 'file' ? 'file' : 'dir');
    throw Object.assign(new Error('fixture alias failure after path replacement'), { code: 'EIO' });
  } } });
  assert.throws(() => installer.apply(selected, root), error => {
    assert.match(error.message, /manual recovery/);
    assert.match(error.message, /回滚拒绝符号链接/);
    return true;
  });
  assert.deepEqual(snapshot(outside), previous);
  assert.equal(fs.readFileSync(path.join(root, 'moved-home-' + redirected, redirected === 'file' ? '' : 'AGENTS.md'), 'utf8'),
    fs.readFileSync(path.join(repositoryRoot, 'scripts/persistence/home.md'), 'utf8'));
});

test('system installation adds a default without rewriting user bytes on reinstall', t => {
  const root = project(t);
  const ignore = path.join(root, '.gitignore');
  const original = '\uFEFF# 项目规则\r\n/generated/';
  fs.writeFileSync(ignore, original);
  const args = ['install', '--skill', 'system-inspect'];
  assert.match(success(run(root, ...args, '--dry-run')).stdout, /would update\s+\.gitignore/);
  assert.equal(fs.readFileSync(ignore, 'utf8'), original);
  success(run(root, ...args));
  const expected = '\uFEFF' + tempRule + '\r\n' + original.slice(1);
  assert.equal(fs.readFileSync(ignore, 'utf8'), expected);
  const mtime = fs.statSync(ignore, { bigint: true }).mtimeNs;
  assert.match(success(run(root, ...args)).stdout, /preserve\s+\.gitignore/);
  assert.equal(fs.readFileSync(ignore, 'utf8'), expected);
  assert.equal(fs.statSync(ignore, { bigint: true }).mtimeNs, mtime);
  assert.equal(fs.existsSync(path.join(root, 'temp')), false);
  const mixed = [...args, 'dev-intake'];
  assert.match(success(run(root, ...mixed)).stdout, /update\s+\.gitignore/);
  assert.match(success(run(root, ...mixed)).stdout, /preserve\s+\.gitignore/);
  assert.equal(fs.readFileSync(ignore, 'utf8'), expected + '\r\n' + worktreeRule + '\r\n');
  assert.equal(fs.existsSync(path.join(root, '.agents/dev/worktree')), false);
});

test('an existing temp rule and project business records are left untouched', t => {
  const root = project(t);
  const ignore = path.join(root, '.gitignore');
  const original = '# My rules\r\n/custom/\r\ntemp/\r\n';
  fs.writeFileSync(ignore, original);
  const record = path.join(root, '.agents', 'system', 'host', 'configuration.md');
  fs.mkdirSync(path.dirname(record), { recursive: true });
  fs.writeFileSync(record, '# 手写配置记录\r\n');
  assert.match(success(run(root, 'install', '--skill', 'system-herdr')).stdout, /preserve\s+\.gitignore/);
  assert.equal(fs.readFileSync(ignore, 'utf8'), original);
  assert.equal(fs.readFileSync(record, 'utf8'), '# 手写配置记录\r\n');
  assert.equal(fs.existsSync(path.join(root, 'temp')), false);
});

test('existing project exceptions, legacy rules and tracked files survive a system upgrade', t => {
  const root = project(t);
  const env = isolatedGitEnvironment(project(t));
  const git = (...args) => spawnSync('git', args, { cwd: root, env, encoding: 'utf8' });
  success(git('init', '--quiet'));
  const ignore = path.join(root, '.gitignore');
  const original = '/.agents/system/ignore/\n!/temp/\n';
  fs.writeFileSync(ignore, original);
  const tracked = 'temp/previously-tracked.log';
  fs.mkdirSync(path.join(root, 'temp'));
  fs.writeFileSync(path.join(root, tracked), 'owner retained this file\n');
  success(git('add', '--', tracked));
  success(run(root, 'install', '--skill', 'system-herdr', 'dev-intake'));
  assert.equal(fs.readFileSync(ignore, 'utf8'), tempRule + '\n' + original + worktreeRule + '\n');
  assert.equal(git('check-ignore', '-q', '--', 'temp/not-ignored.log').status, 1);
  assert.equal(git('check-ignore', '-q', '--', '.agents/system/ignore/old.log').status, 0);
  assert.equal(success(git('ls-files', '--', tracked)).stdout.trim(), tracked);
  assert.equal(fs.readFileSync(path.join(root, tracked), 'utf8'), 'owner retained this file\n');
});

test('working checkouts and raw evidence are ignored while coordination and change reports remain eligible for Git', t => {
  const root = project(t);
  const env = isolatedGitEnvironment(project(t));
  const git = (...args) => spawnSync('git', args, { cwd: root, env, encoding: 'utf8' });
  success(git('init', '--quiet'));
  const tracked = 'temp/preexisting.log';
  fs.mkdirSync(path.join(root, 'temp'));
  fs.writeFileSync(path.join(root, tracked), 'already tracked\n');
  success(git('add', '--', tracked));
  success(run(root, 'install', '--skill', 'system-herdr', 'system-herdr-core', 'dev-worktree'));
  assert.equal(git('check-ignore', '-q', '--', tracked).status, 1);
  assert.equal(git('check-ignore', '-q', '--no-index', '--', tracked).status, 0);
  const ignored = ['herdr', 'herdr-core'].flatMap(host =>
    ['task01/run-01/install.log', 'task01/run-01/diagnostics.json', 'task02/run-02/screenshot.png'].map(file =>
      `temp/system/${host}/2026-11-20-test/build%2Ft7/${file}`));
  ignored.push('temp/dev/test/tasks/01-run/attempt-01/report.md', 'temp/dev/test/integration/attempt-01/trace.json',
    'temp/system/hosts/host/inspect/attempt-01/diagnostics.log', '.agents/dev/worktree/test/src/index.mjs');
  const eligible = ['herdr', 'herdr-core'].flatMap(host =>
    ['manifest.tsv', 'build%2Ft7/task01.md', 'build%2Ft7/report01.md'].map(file => `.agents/system/${host}/2026-11-20-test/${file}`));
  eligible.push('.agents/dev/changes/test/tasks/01-run.md', '.agents/dev/changes/test/evidences/01-run.md',
    '.agents/dev/changes/test/evidence.md', '.agents/system/host/audit.md',
    '.agents/dev/changes/test/prototype/index.html', 'tests/input.mjs', 'src/temp/input.json');
  for (const relative of [...ignored, ...eligible]) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'fixture\n');
  }
  const checked = success(git('check-ignore', '-v', '--', ...ignored, ...eligible));
  assert.deepEqual(checked.stdout.trim().split(/\r?\n/).map(line => line.split('\t')[1]), ignored);
  assert.match(checked.stdout, /\.gitignore:\d+:\/temp\/\ttemp\/dev\//);
  success(git('add', '--', ...eligible));
  const index = success(git('ls-files', '-z'));
  assert.deepEqual(index.stdout.split('\0').filter(Boolean).sort(), [...eligible, tracked].sort());
});

test('invalid .gitignore target stops system initialization before writes', t => {
  const root = project(t);
  fs.mkdirSync(path.join(root, '.gitignore'));
  const result = run(root, 'install', '--skill', 'system-inspect');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /\.gitignore/);
  assert.equal(fs.existsSync(path.join(root, '.agents')), false);
});

test('a partial .gitignore write restores original bytes and rolls back mixed domain initialization', t => {
  const root = project(t);
  const ignore = path.join(root, '.gitignore');
  const original = Buffer.from('\uFEFF# 本地规则\r\n/.agents/system/ignore/');
  fs.writeFileSync(ignore, original);
  let ignoreDescriptor;
  const installer = createInstaller({ fsOps: { ...fs,
    openSync(filename, ...args) {
      const fd = fs.openSync(filename, ...args);
      if (filename === ignore) ignoreDescriptor = fd;
      return fd;
    },
    writeFileSync(file, data, ...args) {
      if (file === ignoreDescriptor && ignoreDescriptor !== undefined) {
        fs.writeFileSync(file, data.subarray(0, 8));
        throw new Error('fixture .gitignore write failed');
      }
      return fs.writeFileSync(file, data, ...args);
    },
  } });
  const selected = installer.catalog().filter(skill => ['dev-intake', 'system-inspect'].includes(skill.name));
  assert.throws(() => installer.apply(selected, root), /rolled back.*\.gitignore write failed/);
  assert.deepEqual(files(root), ['.gitignore']);
  assert.deepEqual(fs.readFileSync(ignore), original);
});

test('list, help, cancellation-equivalent empty selection and invalid selection do not initialize anything', t => {
  const root = project(t);
  for (const args of [['list'], ['--help'], ['--version']]) success(run(root, ...args));
  for (const args of [['install'], ['install', '--skill', 'dev-missing']]) assert.notEqual(run(root, ...args).status, 0);
  assert.deepEqual(files(root), []);
});

test('reinstall updates managed instructions and fills missing files while preserving root and unchanged templates', t => {
  const root = project(t);
  success(run(root, 'install', '--skill', 'dev-intake'));
  const custom = path.join(root, '.agents/dev/AGENTS.md');
  fs.writeFileSync(custom, '# 我的规则\r\n不得覆盖\r\n');
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# 根规则\n');
  const template = fs.readFileSync(path.join(repositoryRoot, 'scripts/persistence/dev.md'), 'utf8');
  const skillFile = path.join(root, '.agents/skills/dev-intake/SKILL.md');
  const skillMtime = fs.statSync(skillFile, { bigint: true }).mtimeNs;
  fs.unlinkSync(path.join(root, dev[1]));
  const preview = success(run(root, 'install', '--skill', 'dev-intake', '--dry-run'));
  assert.match(preview.stdout, /would create/);
  assert.equal(fs.existsSync(path.join(root, dev[1])), false);
  success(run(root, 'install', '--skill', 'dev-intake'));
  const mtime = fs.statSync(custom, { bigint: true }).mtimeNs;
  success(run(root, 'install', '--skill', 'dev-intake', '--replace'));
  assert.deepEqual(records(root), [...dev, 'AGENTS.md', '.gitignore'].sort());
  assert.equal(fs.readFileSync(custom, 'utf8'), template);
  assert.equal(fs.statSync(custom, { bigint: true }).mtimeNs, mtime);
  assert.equal(fs.statSync(skillFile, { bigint: true }).mtimeNs, skillMtime);
  assert.equal(fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8'), '# 根规则\n');
});

for (const conflict of ['.agents/dev/notes', '.agents/dev/archive/changes/rejected/AGENTS.md']) {
  test(`preflight rejects ${conflict} before installing any skill`, t => {
    const root = project(t);
    const target = path.join(root, conflict);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (conflict.endsWith('AGENTS.md')) fs.mkdirSync(target);
    else fs.writeFileSync(target, 'conflict');
    const before = files(root);
    for (const extra of [[], ['--dry-run']]) {
      const result = run(root, 'install', '--skill', 'dev-intake', ...extra);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /冲突|不是普通文件/);
      assert.deepEqual(files(root), before);
      assert.equal(fs.existsSync(path.join(root, '.agents/skills')), false);
    }
  });
}

for (const target of ['.agents/dev', '.agents/dev/notes/AGENTS.md']) {
  test(`symlink at ${target} cannot redirect installation initialization`, t => {
    const root = project(t);
    const outside = project(t);
    const link = path.join(root, target);
    fs.mkdirSync(path.dirname(link), { recursive: true });
    fs.symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
    assert.notEqual(run(root, 'install', '--skill', 'dev-intake').status, 0);
    assert.deepEqual(files(outside), []);
    assert.equal(fs.existsSync(path.join(root, '.agents/skills')), false);
  });
}

test('an unrelated domain does not inspect or touch dev records', t => {
  const root = project(t);
  fs.mkdirSync(path.join(root, '.agents'));
  fs.writeFileSync(path.join(root, '.agents/dev'), 'custom unrelated entry');
  success(run(root, 'install', '--skill', 'system-inspect'));
  assert.equal(fs.readFileSync(path.join(root, '.agents/dev'), 'utf8'), 'custom unrelated entry');
  assert.equal(fs.existsSync(path.join(root, system)), true);
});

test('persistence write failure rolls back new files and restores replaced skills without touching user data', t => {
  const root = project(t);
  const regular = createInstaller();
  const selected = regular.catalog().filter(skill => skill.name === 'dev-intake');
  const installed = path.join(root, '.agents/skills/dev-intake');
  fs.mkdirSync(path.dirname(installed), { recursive: true });
  fs.cpSync(selected[0].source, installed, { recursive: true });
  fs.writeFileSync(path.join(installed, 'local.txt'), 'keep previous skill');
  fs.mkdirSync(path.join(root, '.agents/dev/notes'), { recursive: true });
  const user = path.join(root, '.agents/dev/notes/user.md');
  fs.writeFileSync(user, 'keep project knowledge');
  const managed = path.join(root, '.agents/dev/AGENTS.md');
  fs.writeFileSync(managed, '# 旧模板\n' + '旧内容'.repeat(200));
  const originalManaged = fs.readFileSync(managed);
  const installer = createInstaller({ fsOps: { ...fs, openSync(filename, ...args) {
    if (filename === path.join(root, '.agents/dev/notes/AGENTS.md')) throw new Error('fixture permission denied');
    return fs.openSync(filename, ...args);
  } } });
  assert.throws(() => installer.apply(selected, root, true), /rolled back.*permission denied/);
  assert.equal(fs.readFileSync(path.join(installed, 'local.txt'), 'utf8'), 'keep previous skill');
  assert.equal(fs.readFileSync(user, 'utf8'), 'keep project knowledge');
  assert.deepEqual(fs.readFileSync(managed), originalManaged);
  assert.equal(fs.existsSync(path.join(root, '.agents/dev/changes')), false);
  assert.equal(fs.existsSync(path.join(root, '.agents/.skills-hub-install.lock')), false);
  assert.equal(fs.existsSync(path.join(root, '.agents/.skills-wta-install.lock')), false);
  regular.apply(selected, root, true);
  for (const file of dev) assert.equal(fs.statSync(path.join(root, file)).isFile(), true);
});

test('filling missing records for unchanged skills holds both installer locks', t => {
  const root = project(t);
  const regular = createInstaller();
  const selected = regular.catalog().filter(skill => skill.name === 'dev-intake');
  regular.apply(selected, root);
  const missing = path.join(root, '.agents/dev/notes/AGENTS.md');
  fs.unlinkSync(missing);
  let observed = false;
  const installer = createInstaller({ fsOps: { ...fs, openSync(filename, ...args) {
    if (filename === missing) {
      observed = true;
      for (const name of ['.skills-wta-install.lock', '.skills-hub-install.lock']) assert.ok(fs.existsSync(path.join(root, '.agents', name)));
      const concurrent = run(root, 'install', '--skill', 'dev-intake');
      assert.notEqual(concurrent.status, 0);
      assert.match(concurrent.stderr, /installer lock exists/);
    }
    return fs.openSync(filename, ...args);
  } } });
  assert.ok(installer.apply(selected, root).actions.every(action => action.kind === 'unchanged'));
  assert.ok(observed);
  assert.ok(fs.existsSync(missing));
});

test('generated navigation paths resolve relative to each AGENTS.md, including deep archives', t => {
  const root = project(t);
  success(run(root, 'install', '--skill', 'dev-intake', 'system-inspect', 'home-setup'));
  for (const [directory, relative, target] of [
    ['dev', './changes/', 'dev/changes'],
    ['dev', '../system/', 'system'],
    ['dev/context', '../notes/context/', 'dev/notes/context'],
    ['dev/notes', '../archive/', 'dev/archive'],
    ['dev/archive', './changes/implemented/', 'dev/archive/changes/implemented'],
    ['dev/archive', './changes/rejected/', 'dev/archive/changes/rejected'],
    ['dev/archive', '../notes/', 'dev/notes'],
    ['dev/changes', '../notes/', 'dev/notes'],
    ['dev/changes', '../archive/changes/', 'dev/archive/changes'],
    ['dev/project', '../changes/', 'dev/changes'],
    ['dev/archive/changes/implemented', '../../../notes/', 'dev/notes'],
    ['dev/archive/changes/rejected', '../../../notes/', 'dev/notes'],
    ['system', '../dev/', 'dev'],
    ['home', './repos.json', 'home/repos.json'],
    ['home', './local.json', 'home/local.json'],
    ['home', './context/preferences.md', 'home/context/preferences.md'],
    ['home', './notes/index.md', 'home/notes/index.md'],
    ['home', './notes/', 'home/notes'],
    ['home', './inbox/', 'home/inbox'],
    ['home', './archive/notes/', 'home/archive/notes'],
    ['home', './exclusions.md', 'home/exclusions.md'],
    ['home', './history/index.md', 'home/history/index.md'],
    ['home', './history/', 'home/history'],
    ['home', './archive/history/', 'home/archive/history'],
    ['home', './relations.md', 'home/relations.md'],
    ['home', './coordination/all.status.tsv', 'home/coordination/all.status.tsv'],
    ['home', './coordination/', 'home/coordination'],
  ]) {
    const parent = path.join(root, '.agents', directory);
    assert.ok(fs.readFileSync(path.join(parent, 'AGENTS.md'), 'utf8').includes('`' + relative + '`'), directory + ': ' + relative);
    assert.equal(path.resolve(parent, relative), path.join(root, '.agents', target));
  }
  // A navigation entry for on-demand knowledge must not create empty business directories.
  assert.equal(fs.existsSync(path.join(root, '.agents/dev/notes/context')), false);
  assert.deepEqual(fs.readdirSync(path.join(root, '.agents/home')), ['AGENTS.md']);
});

test('initialization ownership is the installer, not an installed skill', t => {
  const root = project(t);
  success(run(root, 'install', '--skill', 'dev-setup'));
  assert.equal(fs.existsSync(path.join(root, '.agents/skills/dev-setup/scripts/init-persistence.mjs')), false);
  assert.equal(fs.existsSync(path.join(root, '.agents/skills/dev-setup/assets/persistence')), false);
  assert.deepEqual(planPersistence([{ domain: 'future' }], root), []);
});
