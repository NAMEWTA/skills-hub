import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { diagnoseHome } from '../skills/home/home-doctor/scripts/doctor.mjs';
import { inspectRegistry, saveRegistry } from '../skills/home/home-setup/scripts/registry.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'home-doctor-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = relative => path.join(root, relative);
  const write = (relative, content) => { const target = file(relative); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); return target; };
  return { root, file, write };
}
function symlink(t, source, target, type = 'dir') {
  try { fs.symlinkSync(source, target, type); return true; }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('本环境不能建立符号链接'); return false; } throw error; }
}

test('empty Home is a read-only normal state and unselected tools are not diagnosed as failures', t => {
  const { root } = fixture(t); const result = diagnoseHome(root);
  assert.equal(result.status, 'clear-within-scope'); assert.equal(result.complete, true); assert.equal(result.findings[0].code, 'HOME_NOT_INITIALIZED'); assert.deepEqual(fs.readdirSync(root), []);
});

test('stale maps and malformed local identity overrides go to setup without modifying source', t => {
  const { root, file, write } = fixture(t); const current = inspectRegistry(root);
  saveRegistry(root, { formatVersion: 1, repos: [] }, { expectedRevision: current.registryRevision, expectedMapRevision: current.mapRevision });
  const before = fs.readFileSync(file('.agents/home/repos.md'), 'utf8'); write('.agents/home/repos.json', '{"formatVersion":1,"repos":[]}');
  write('.agents/home/local.json', '{"formatVersion":1,"paths":{},"remote":"forged"}');
  const result = diagnoseHome(root); assert.equal(result.status, 'issues');
  for (const code of ['MAP_SOURCE_STALE', 'LOCAL_OVERRIDE_FORMAT']) assert.ok(result.findings.some(item => item.code === code && item.owner === 'home-setup'));
  assert.equal(fs.readFileSync(file('.agents/home/repos.md'), 'utf8'), before);
});

test('structural broken links route to their owners, while fenced examples and external pointers are not opened', t => {
  const { root, write } = fixture(t);
  write('.agents/home/notes/甲.md', '# 现行主题\n\n[失效](missing.md)\n[外部项目](../../../project/private.md)\n\n```md\n[只是例子](sample.md)\n```\n');
  write('.agents/home/history/2026/11/过去.md', '# 历史\n\n[旧报告](missing.md)\n');
  write('project/private.md', '# 不应扫描的内部知识\n\n[内部缺失](missing-in-project.md)\n');
  const result = diagnoseHome(root);
  const broken = result.findings.filter(item => item.code === 'BROKEN_LINK');
  assert.equal(broken.length, 2); assert.deepEqual(new Set(broken.map(item => item.owner)), new Set(['home-knowledge', 'home-history']));
  assert.equal(result.checked.markdownFiles, 2); assert.ok(result.checked.externalPointers >= 1 || result.checked.localLinks >= 3);
  assert.ok(result.findings.every(item => !item.message.includes('sample.md') && !item.message.includes('missing-in-project.md')));
});

test('scan budgets expose incomplete coverage without treating unvisited documents as healthy', t => {
  const { root, write } = fixture(t); write('.agents/home/notes/a.md', '# A\n'); write('.agents/home/notes/b.md', '# B\n[断链](missing.md)\n');
  const result = diagnoseHome(root, { maxFiles: 1 });
  assert.equal(result.complete, false); assert.equal(result.checked.markdownFiles, 1); assert.ok(result.findings.some(item => item.code === 'SCAN_LIMIT')); assert.equal(result.status, 'attention');
});

test('canonical and relative alias are diagnosed without claiming actual host skill discovery', t => {
  const { root, file, write } = fixture(t); write('.agents/skills/home-route/SKILL.md', '# 已安装技能\n'); fs.mkdirSync(file('.claude/skills'), { recursive: true });
  if (!symlink(t, '../../.agents/skills/home-route', file('.claude/skills/home-route'))) return;
  const result = diagnoseHome(root, { requiredSkills: ['home-route'] }); assert.equal(result.status, 'clear-within-scope'); assert.match(result.scope, /没有.*验证 CLI 发现/);
  fs.unlinkSync(file('.claude/skills/home-route')); fs.mkdirSync(file('.claude/skills/home-route'));
  const conflict = diagnoseHome(root, { requiredSkills: ['home-route'] }); assert.ok(conflict.findings.some(item => item.code === 'SKILL_ALIAS_CONFLICT'));
});

test('linked canonical parent or SKILL file cannot masquerade as a local installed skill', t => {
  const { root, file, write } = fixture(t); const outside = file('external'); write('external/home-route/SKILL.md', '# 外部技能\n'); fs.mkdirSync(file('.agents'), { recursive: true });
  if (!symlink(t, outside, file('.agents/skills'))) return;
  const linkedParent = diagnoseHome(root, { requiredSkills: ['home-route'] }); assert.ok(linkedParent.findings.some(item => item.code === 'SKILL_PARENT_CONFLICT'));
  fs.unlinkSync(file('.agents/skills')); fs.mkdirSync(file('.agents/skills/home-route'), { recursive: true });
  if (!symlink(t, file('external/home-route/SKILL.md'), file('.agents/skills/home-route/SKILL.md'), 'file')) return;
  const linkedFile = diagnoseHome(root, { requiredSkills: ['home-route'] }); assert.ok(linkedFile.findings.some(item => item.code === 'REQUIRED_SKILL_MISSING'));
});

test('linked Home data is reported without following project contents or changing original bytes', t => {
  const { root, file, write } = fixture(t); const privateFile = write('project/private.md', '# 原件\n[不读取](missing.md)\n'); fs.mkdirSync(file('.agents/home/notes'), { recursive: true });
  if (!symlink(t, file('project'), file('.agents/home/notes/foreign'))) return;
  const result = diagnoseHome(root); assert.ok(result.findings.some(item => item.code === 'LINKED_HOME_DATA')); assert.equal(result.checked.markdownFiles, 0); assert.equal(fs.readFileSync(privateFile, 'utf8'), '# 原件\n[不读取](missing.md)\n');
});
