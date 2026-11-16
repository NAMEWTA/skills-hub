import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInstaller, repositoryRoot } from '../install.mjs';

const names = ['workflow', 'inventory', 'execute', 'inspect', 'diagnose', 'maintain', 'recover', 'history', 'runbook'].map(name => 'ops-' + name).sort();
const navigation = '.agents/ops/AGENTS.md';
function temporary(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-ops-install-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function command(root, ...args) {
  return spawnSync(process.execPath, [path.join(repositoryRoot, 'install.mjs'), ...args], { cwd: root, encoding: 'utf8' });
}
function success(result) { assert.equal(result.status, 0, result.stdout + result.stderr); }
function files(root) {
  return fs.readdirSync(root, { recursive: true }).filter(file => fs.lstatSync(path.join(root, file)).isFile()).map(file => file.split(path.sep).join('/')).sort();
}

test('ops domain is discovered and installs complete resources with only its navigation', t => {
  const root = temporary(t);
  const skills = createInstaller().catalog().filter(skill => skill.domain === 'ops');
  assert.deepEqual(skills.map(skill => skill.name).sort(), names);
  success(command(root, 'install', '--domain', 'ops', '--dry-run'));
  assert.deepEqual(files(root), []);
  success(command(root, 'install', '--domain', 'ops'));
  assert.deepEqual(fs.readdirSync(path.join(root, '.agents/skills')).sort(), names);
  assert.deepEqual(files(root).filter(file => !file.startsWith('.agents/skills/')), [navigation]);
  for (const skill of skills) {
    const installed = path.join(root, '.agents/skills', skill.name);
    for (const file of files(skill.source)) assert.deepEqual(fs.readFileSync(path.join(installed, file)), fs.readFileSync(path.join(skill.source, file)), `${skill.name}/${file}`);
  }
});

test('one ops skill does not install workflow or its other method owners', t => {
  const root = temporary(t);
  success(command(root, 'install', '--skill', 'ops-history'));
  assert.deepEqual(fs.readdirSync(path.join(root, '.agents/skills')), ['ops-history']);
  assert.deepEqual(files(root).filter(file => !file.startsWith('.agents/skills/')), [navigation]);
});

test('ops does not inspect unrelated domain roots or alter existing instructions and skills', t => {
  const root = temporary(t);
  fs.mkdirSync(path.join(root, '.agents/skills/custom-skill'), { recursive: true });
  const originals = new Map([
    ['AGENTS.md', '# User instructions\r\n'],
    ['.agents/dev', 'unrelated dev entry'],
    ['.agents/system', 'unrelated system entry'],
    ['.agents/workspace', 'unrelated workspace entry'],
    ['.agents/skills/custom-skill/SKILL.md', '# Existing private skill\n'],
  ]);
  for (const [file, content] of originals) fs.writeFileSync(path.join(root, file), content);
  success(command(root, 'install', '--domain', 'ops'));
  for (const [file, content] of originals) assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), content);
});

test('ops reinstall refreshes only managed navigation and preserves all business facts', t => {
  const root = temporary(t);
  success(command(root, 'install', '--skill', 'ops-inventory'));
  const request = path.join(root, '.agents/ops/runs/existing/run.md');
  fs.mkdirSync(path.dirname(request), { recursive: true });
  fs.writeFileSync(request, '# Existing facts\r\n');
  const nav = path.join(root, navigation);
  fs.writeFileSync(nav, '# Old managed navigation\n');
  success(command(root, 'install', '--skill', 'ops-inventory'));
  assert.deepEqual(fs.readFileSync(nav), fs.readFileSync(path.join(repositoryRoot, 'scripts/persistence/ops.md')));
  const mtime = fs.statSync(nav, { bigint: true }).mtimeNs;
  success(command(root, 'install', '--skill', 'ops-inventory'));
  assert.equal(fs.statSync(nav, { bigint: true }).mtimeNs, mtime);
  assert.equal(fs.readFileSync(request, 'utf8'), '# Existing facts\r\n');
  assert.equal(fs.existsSync(path.join(root, '.agents/ops/registry')), false);
});

test('ops navigation write failure rolls back selected skills and preserves existing data', t => {
  const root = temporary(t);
  const selected = createInstaller().catalog().filter(skill => skill.name === 'ops-workflow');
  const installed = path.join(root, '.agents/skills/ops-workflow');
  fs.mkdirSync(installed, { recursive: true });
  fs.writeFileSync(path.join(installed, 'local.md'), 'original private changes');
  fs.mkdirSync(path.join(root, '.agents/ops/projects'), { recursive: true });
  fs.writeFileSync(path.join(root, '.agents/ops/projects/known.md'), 'actual project knowledge');
  const installer = createInstaller({ fsOps: { ...fs, openSync(filename, ...args) {
    if (filename === path.join(root, navigation)) throw new Error('fixture navigation unavailable');
    return fs.openSync(filename, ...args);
  } } });
  assert.throws(() => installer.apply(selected, root, true), /rolled back.*navigation unavailable/);
  assert.equal(fs.readFileSync(path.join(installed, 'local.md'), 'utf8'), 'original private changes');
  assert.equal(fs.readFileSync(path.join(root, '.agents/ops/projects/known.md'), 'utf8'), 'actual project knowledge');
  assert.equal(fs.existsSync(path.join(root, navigation)), false);
});

test('ops navigation symlink is rejected before any selected skill is installed', t => {
  const root = temporary(t);
  const outside = temporary(t);
  fs.mkdirSync(path.join(root, '.agents'));
  fs.symlinkSync(outside, path.join(root, '.agents/ops'), process.platform === 'win32' ? 'junction' : 'dir');
  const result = command(root, 'install', '--skill', 'ops-inspect');
  assert.notEqual(result.status, 0);
  assert.deepEqual(files(outside), []);
  assert.equal(fs.existsSync(path.join(root, '.agents/skills')), false);
});
