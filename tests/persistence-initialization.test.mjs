import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot, createInstaller } from '../install.mjs';
import { planPersistence } from '../scripts/init-persistence.mjs';

const dev = ['dev', 'dev/changes', 'dev/notes', 'dev/deploy', 'dev/archive',
  'dev/archive/changes/implemented', 'dev/archive/changes/rejected', 'dev/project', 'dev/context']
  .map(directory => `.agents/${directory}/AGENTS.md`).sort();
const system = '.agents/system/AGENTS.md';
function project(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-init-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function files(root) {
  return fs.readdirSync(root, { recursive: true }).filter(file => fs.lstatSync(path.join(root, file)).isFile()).map(file => file.split(path.sep).join('/')).sort();
}
function records(root) { return files(root).filter(file => !file.startsWith('.agents/skills/')); }
function run(root, ...args) {
  return spawnSync(process.execPath, [path.join(repositoryRoot, 'install.mjs'), ...args], { cwd: root, encoding: 'utf8' });
}
function success(result) { assert.equal(result.status, 0, result.stdout + result.stderr); return result; }

for (const [label, args, expected] of [
  ['one dev skill', ['--skill', 'dev-intake'], dev],
  ['dev domain', ['--domain', 'dev'], dev],
  ['system only', ['--skill', 'system-inspect'], [system]],
  ['mixed domains', ['--skill', 'dev-intake', 'system-inspect'], [...dev, system].sort()],
  ['all domains', ['--all'], [...dev, system].sort()],
]) test(`installing ${label} bootstraps exactly the selected domain records`, t => {
  const root = project(t);
  const preview = success(run(root, 'install', ...args, '--dry-run'));
  assert.match(preview.stdout, /would create/);
  assert.deepEqual(files(root), []);
  success(run(root, 'install', ...args));
  assert.deepEqual(records(root), expected);
  for (const file of expected) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(content, /^# /);
    assert.ok(Array.from(content.replace(/\s/gu, '')).length <= 400, file);
  }
});

test('list, help, cancellation-equivalent empty selection and invalid selection do not initialize anything', t => {
  const root = project(t);
  for (const args of [['list'], ['--help'], ['--version']]) success(run(root, ...args));
  for (const args of [['install'], ['install', '--skill', 'dev-missing']]) assert.notEqual(run(root, ...args).status, 0);
  assert.deepEqual(files(root), []);
});

test('reinstall preserves custom instructions and root file; missing instructions are filled even for unchanged skills', t => {
  const root = project(t);
  success(run(root, 'install', '--skill', 'dev-intake'));
  const custom = path.join(root, '.agents/dev/AGENTS.md');
  fs.writeFileSync(custom, '# 我的规则\r\n不得覆盖\r\n');
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# 根规则\n');
  const mtime = fs.statSync(custom, { bigint: true }).mtimeNs;
  const skillFile = path.join(root, '.agents/skills/dev-intake/SKILL.md');
  const skillMtime = fs.statSync(skillFile, { bigint: true }).mtimeNs;
  fs.unlinkSync(path.join(root, dev[1]));
  const preview = success(run(root, 'install', '--skill', 'dev-intake', '--dry-run'));
  assert.match(preview.stdout, /would create/);
  assert.equal(fs.existsSync(path.join(root, dev[1])), false);
  success(run(root, 'install', '--skill', 'dev-intake'));
  success(run(root, 'install', '--skill', 'dev-intake', '--replace'));
  assert.deepEqual(records(root), [...dev, 'AGENTS.md'].sort());
  assert.equal(fs.readFileSync(custom, 'utf8'), '# 我的规则\r\n不得覆盖\r\n');
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
  const installer = createInstaller({ fsOps: { ...fs, openSync(filename, ...args) {
    if (filename === path.join(root, '.agents/dev/notes/AGENTS.md')) throw new Error('fixture permission denied');
    return fs.openSync(filename, ...args);
  } } });
  assert.throws(() => installer.apply(selected, root, true), /rolled back.*permission denied/);
  assert.equal(fs.readFileSync(path.join(installed, 'local.txt'), 'utf8'), 'keep previous skill');
  assert.equal(fs.readFileSync(user, 'utf8'), 'keep project knowledge');
  assert.equal(fs.existsSync(path.join(root, '.agents/dev/AGENTS.md')), false);
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

test('initialization ownership is the installer, not an installed skill', t => {
  const root = project(t);
  success(run(root, 'install', '--skill', 'dev-setup'));
  assert.equal(fs.existsSync(path.join(root, '.agents/skills/dev-setup/scripts/init-persistence.mjs')), false);
  assert.equal(fs.existsSync(path.join(root, '.agents/skills/dev-setup/assets/persistence')), false);
  assert.deepEqual(planPersistence([{ domain: 'future' }], root), []);
});
