import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createKnowledge } from '../skills/home/home-knowledge/scripts/knowledge.mjs';

const script = fileURLToPath(new URL('../skills/home/home-knowledge/scripts/knowledge.mjs', import.meta.url));
function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'home 知识-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const local = (relative) => path.join(root, '.agents', 'home', ...relative.split('/'));
  const write = (relative, content) => { const target = local(relative); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); return target; };
  return { root, local, write, tool: createKnowledge(root) };
}
function note(title = '协作经验', { scope = 'home', source = 'repo:项目A/report:回执1', body = '保留契约检查与失败理由。', fields = '' } = {}) {
  return `---\nscope: ${JSON.stringify(scope)}\nsources: ${JSON.stringify([source])}\nverified_at: "2026-11-01"\n${fields}---\n# ${title}\n\n${body}\n`;
}
function run(executable, argv) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, argv, { stdio: ['ignore', 'pipe', 'pipe'] }); let stdout = ''; let stderr = '';
    child.stdout.on('data', (value) => stdout += value); child.stderr.on('data', (value) => stderr += value);
    child.once('error', reject); child.once('close', (code) => resolve({ code, stdout, stderr }));
  });
}
function symlink(t, source, target, type) {
  try { fs.symlinkSync(source, target, type); return true; }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('本环境不能建立符号链接'); return false; } throw error; }
}

test('read-only query needs no index and does not initialize Home business directories', (t) => {
  const { root, tool } = fixture(t);
  const result = tool.query('尚无记录'); assert.equal(result.complete, true); assert.equal(result.entries.length, 0);
  assert.equal(fs.existsSync(path.join(root, '.agents')), false);
});

test('Chinese paths, source references and direct source search survive deterministic index rebuild', (t) => {
  const { tool, local } = fixture(t); const content = note('项目 甲', { body: '用户采用验收回执，原件由项目所有者维护。' });
  const saved = tool.put('notes/项目 甲.md', content, 'missing'); assert.equal(saved.status, 'saved');
  const before = fs.readFileSync(local('notes/index.md'), 'utf8');
  assert.match(before, /%E9%A1%B9%E7%9B%AE%20%E7%94%B2\.md/);
  assert.equal(tool.index().changed, false); assert.equal(fs.readFileSync(local('notes/index.md'), 'utf8'), before);
  fs.unlinkSync(local('notes/index.md'));
  const found = tool.query('验收回执'); assert.equal(found.entries[0].path, 'notes/项目 甲.md'); assert.equal(found.complete, true);
  assert.equal(tool.read('notes/项目 甲.md').content, content);
});

test('stale updates and existing-file creation conflicts preserve the newer source', (t) => {
  const { tool, local } = fixture(t); const first = tool.put('notes/a.md', note(), 'missing');
  fs.writeFileSync(local('notes/a.md'), note('较新决定'));
  assert.throws(() => tool.put('notes/a.md', note('陈旧稿'), first.sha256), { code: 'STALE' });
  assert.throws(() => tool.put('notes/a.md', note('错误新增'), 'missing'), { code: 'STALE' });
  assert.match(tool.read('notes/a.md').content, /较新决定/);
});

test('owner boundaries and traversal cannot change configuration or neighboring repositories', (t) => {
  const { tool, write, local } = fixture(t); write('context/preferences.md', '真实默认');
  for (const target of ['context/preferences.md', 'history/2026/11/a.md', 'notes/index.md', 'exclusions.md']) assert.throws(() => tool.put(target, note(), 'missing'), { code: 'OWNER' });
  for (const target of ['notes/../context/preferences.md', 'notes/../../../../escape.md', 'notes/a:stream.md']) assert.throws(() => tool.put(target, note(), 'missing'), { code: 'PATH' });
  assert.equal(fs.readFileSync(local('context/preferences.md'), 'utf8'), '真实默认');
});

test('linked roots, parents and Markdown files are rejected without touching their targets', (t) => {
  const { root, tool, local, write } = fixture(t); const outside = path.join(root, 'project-a'); fs.mkdirSync(outside); fs.writeFileSync(path.join(outside, 'private.md'), '项目内部原件');
  write('notes/ordinary.md', note());
  if (!symlink(t, outside, local('notes/linked'), 'dir')) return;
  assert.throws(() => tool.put('notes/linked/private.md', note(), 'missing'), { code: 'PATH' });
  if (!symlink(t, path.join(outside, 'private.md'), local('notes/alias.md'), 'file')) return;
  assert.throws(() => tool.read('notes/alias.md'), { code: 'PATH' });
  assert.equal(fs.readFileSync(path.join(outside, 'private.md'), 'utf8'), '项目内部原件');
  const linkedRoot = path.join(root, 'home-alias'); if (!symlink(t, root, linkedRoot, 'dir')) return;
  assert.throws(() => createKnowledge(linkedRoot), { code: 'PATH' });
  const other = path.join(root, 'other-home'); fs.mkdirSync(other); fs.symlinkSync(outside, path.join(other, '.agents'), 'dir');
  assert.throws(() => createKnowledge(other).put('notes/new.md', note(), 'missing'), { code: 'PATH' });
});

test('source saved and index failure are separate, with recovery preserving verification time', (t) => {
  const { tool, local } = fixture(t); fs.mkdirSync(local('notes/index.md'), { recursive: true });
  const content = note(); const result = tool.put('notes/a.md', content, 'missing');
  assert.equal(result.status, 'partial'); assert.equal(result.sourceSaved, true); assert.equal(result.index.status, 'pending');
  assert.equal(tool.read('notes/a.md').content, content);
  fs.rmdirSync(local('notes/index.md')); tool.index(); assert.equal(tool.read('notes/a.md').content, content);
});

test('exclusion persists independently from indexes, is scoped, and prevents re-ingestion after deletion', (t) => {
  const { tool, local } = fixture(t); const content = note('旧知识'); const saved = tool.put('notes/old.md', content, 'missing');
  const excluded = tool.exclude({ source_ref: 'repo:项目A/report:回执1', scope: 'home', basis_ref: 'user:明确停止使用' }, 'missing');
  assert.equal(excluded.status, 'saved'); const exclusionText = fs.readFileSync(local('exclusions.md'), 'utf8'); assert.doesNotMatch(exclusionText, /旧知识|保留契约检查/);
  assert.equal(tool.query('旧知识').entries.length, 0); assert.doesNotMatch(fs.readFileSync(local('notes/index.md'), 'utf8'), /旧知识/);
  tool.remove('notes/old.md', saved.sha256); tool.index();
  assert.equal(fs.readFileSync(local('exclusions.md'), 'utf8'), exclusionText);
  assert.throws(() => tool.put('notes/reimport.md', content, 'missing'), { code: 'EXCLUDED' });
  assert.equal(tool.put('notes/other-scope.md', note('另一个明确范围', { scope: 'home:另一组' }), 'missing').status, 'saved');
});

test('exclusion identities with pipes and spaces remain exact and repeated exclusion is idempotent', (t) => {
  const { tool } = fixture(t); const source = 'repo:甲/report:带 | 分隔和空格';
  tool.exclude({ source_ref: source, scope: 'home', basis_ref: 'user:第 2 次确认' }, 'missing');
  const read = tool.read('exclusions.md');
  assert.equal(tool.exclude({ source_ref: source, scope: 'home', basis_ref: 'user:第 2 次确认' }, read.sha256).changed, false);
  assert.throws(() => tool.put('notes/a.md', note('排除', { source }), 'missing'), { code: 'EXCLUDED' });
  assert.equal(tool.put('notes/b.md', note('不同标识', { source: `${source}-另一事件` }), 'missing').status, 'saved');
});

test('malformed durable exclusions cannot be treated as an empty cache', (t) => {
  const { tool, write, local } = fixture(t); write('exclusions.md', '# 用户已有排除要求\n请先核对格式。');
  assert.throws(() => tool.put('notes/a.md', note(), 'missing'), { code: 'EXCLUSIONS_FORMAT' });
  assert.equal(fs.existsSync(local('notes/a.md')), false);
  assert.throws(() => tool.query('任何内容'), { code: 'EXCLUSIONS_FORMAT' });
});

test('optional Markdown table borders never discard durable exclusions or later rows', (t) => {
  const { tool, write, local } = fixture(t);
  const content = note('不能复活的旧知识'); write('notes/old.md', content);
  for (const borders of [[true, false], [false, true], [false, false]]) {
    const row = (cells) => `${borders[0] ? '| ' : ''}${cells.join(' | ')}${borders[1] ? ' |' : ''}`;
    const rules = ['# 排除来源', '', row(['source_ref', 'scope', 'basis_ref']), row(['---', '---', '---']), row(['another-source', 'home', 'user:排除另一来源']), '| repo:项目A/report:回执1 | home | user:停止使用 |', ''].join('\n');
    write('exclusions.md', rules);
    assert.equal(tool.query('不能复活').entries.length, 0);
    assert.throws(() => tool.put('notes/reimport.md', content, 'missing'), { code: 'EXCLUDED' });
    tool.index(); assert.doesNotMatch(fs.readFileSync(local('notes/index.md'), 'utf8'), /不能复活/);
    assert.equal(fs.readFileSync(local('exclusions.md'), 'utf8'), rules);
  }
  write('exclusions.md', '| source_ref | scope | basis_ref |\n| --- | --- | --- |\n无法解释的数据行\n| repo:项目A/report:回执1 | home | user:停止使用 |\n');
  assert.throws(() => tool.query('不能复活'), { code: 'EXCLUSIONS_FORMAT' });
  assert.throws(() => tool.index(), { code: 'EXCLUSIONS_FORMAT' });
});

test('unsafe derived provenance is rejected on write and omitted from query and rebuilt indexes', (t) => {
  const { tool, write, local } = fixture(t);
  tool.exclude({ source_ref: 'repo:项目A/report:回执1', scope: 'home', basis_ref: 'user:停止使用' }, 'missing');
  for (const value of ['"repo:项目A/report:回执1"', '[""]', '[" "]']) {
    const content = note('不安全的派生资料', { source: 'home:summary', fields: `derived_from: ${value}\n` });
    assert.throws(() => tool.put('notes/new.md', content, 'missing'), { code: 'PROVENANCE' });
    write('notes/unsafe.md', content);
    const found = tool.query('不安全的派生资料');
    assert.equal(found.entries.length, 0); assert.equal(found.complete, false);
    assert.ok(found.warnings.some((warning) => warning.includes('notes/unsafe.md')));
    const index = tool.index(); assert.equal(index.complete, false);
    assert.doesNotMatch(fs.readFileSync(local('notes/index.md'), 'utf8'), /不安全的派生资料/);
    assert.equal(tool.read('notes/unsafe.md').content, content);
  }
  write('notes/unsafe.md', '---\nscope: home\nsources:\n  - repo:项目A/report:回执1\n---\n# 无法解析的旧来源\n');
  assert.equal(tool.query('无法解析的旧来源').entries.length, 0);
  tool.index(); assert.doesNotMatch(fs.readFileSync(local('notes/index.md'), 'utf8'), /无法解析的旧来源/);
  const independent = note('独立来源', { source: 'home:independent', fields: 'derived_from: []\n' });
  assert.equal(tool.put('notes/independent.md', independent, 'missing').sourceSaved, true);
  write('notes/legacy.md', '# 既有普通正文\n仍可按正文检索，来源由 owner 核实。\n');
  assert.equal(tool.query('既有普通正文').entries.length, 1);
});

test('candidate and archived documents require explicit query scope; bounded results report incomplete scans', (t) => {
  const { tool, write } = fixture(t);
  write('notes/a.md', note('现行', { body: '共同关键词' })); write('notes/b.md', note('另一个现行', { body: '共同关键词' }));
  write('inbox/c.md', note('待核验', { body: '共同关键词' })); write('archive/notes/d.md', note('历史', { body: '共同关键词' }));
  assert.equal(tool.query('共同关键词').entries.length, 2);
  assert.equal(tool.query('共同关键词', { area: 'inbox' }).entries[0].path, 'inbox/c.md');
  assert.equal(tool.query('共同关键词', { area: 'archive' }).entries[0].path, 'archive/notes/d.md');
  const bounded = tool.query('共同关键词', { maxFiles: 1 }); assert.equal(bounded.complete, false); assert.equal(bounded.truncated, true);
  assert.equal(tool.query('共同关键词', { limit: 1 }).truncated, true);
});

test('whole-note candidates stay out of current navigation and explicit queries preserve evidence state', async (t) => {
  const { tool, local, root } = fixture(t);
  const fields = 'status: "pending"\nevidence_kind: "inference"\nobserved_at: "2026-10-01"\n';
  tool.put('notes/pending.md', note('未确认偏好', { fields, body: '可能采用某工具。' }), 'missing');
  assert.equal(tool.query('可能采用').entries.length, 0);
  assert.equal(tool.query('可能采用').inactive, 1);
  assert.doesNotMatch(fs.readFileSync(local('notes/index.md'), 'utf8'), /未确认偏好/);
  const explicit = tool.query('可能采用', { includeInactive: true }).entries[0];
  assert.equal(explicit.status, 'pending'); assert.equal(explicit.evidence_kind, 'inference');
  assert.equal(explicit.observed_at, '2026-10-01'); assert.equal(explicit.verified_at, '2026-11-01');
  const cli = await run(process.execPath, [script, 'query', '--home', root, '--text', '可能采用', '--include-inactive']);
  assert.equal(cli.code, 0, cli.stderr); assert.equal(JSON.parse(cli.stdout).entries[0].status, 'pending');
  tool.index({ includeInactive: true });
  assert.doesNotMatch(fs.readFileSync(local('notes/index.md'), 'utf8'), /未确认偏好/);
});

test('derived provenance cannot revive an excluded source through a renamed summary', (t) => {
  const { tool, local } = fixture(t);
  const content = note('二次摘要', { source: 'home:summary-2', fields: 'derived_from: ["repo:项目A/report:回执1"]\n' });
  const saved = tool.put('notes/derived.md', content, 'missing');
  tool.exclude({ source_ref: 'repo:项目A/report:回执1', scope: 'home', basis_ref: 'user:停止使用' }, 'missing');
  assert.equal(tool.query('二次摘要').entries.length, 0);
  assert.doesNotMatch(fs.readFileSync(local('notes/index.md'), 'utf8'), /二次摘要/);
  tool.remove('notes/derived.md', saved.sha256);
  assert.throws(() => tool.put('notes/renamed.md', content, 'missing'), { code: 'EXCLUDED' });
});

test('a truncated index never rewrites sources and lint reports review needs without refreshing facts', (t) => {
  const { tool, write, local } = fixture(t);
  for (let index = 0; index < 12; index += 1) write(`notes/${index}.md`, note(`主题${index}${'字'.repeat(80)}`));
  const body = note('需复核', { fields: 'review_after: "2026-11-02"\nrelated: ["notes/missing.md"]\n' }); write('notes/review.md', body);
  const result = tool.index({ budget: 512 }); assert.equal(result.truncated, true); assert.ok([...fs.readFileSync(local('notes/index.md'), 'utf8')].length <= 512);
  const findings = tool.lint({ today: '2026-11-25' }).findings; assert.ok(findings.some((item) => item.code === 'review-due')); assert.ok(findings.some((item) => item.code === 'missing-reference'));
  assert.equal(tool.read('notes/review.md').content, body);
});

test('two real CLI writers cannot overwrite the same missing target', async (t) => {
  const { root, tool, local } = fixture(t); const input = path.join(root, 'input.md'); fs.writeFileSync(input, note());
  const args = [script, 'put', '--home', root, '--path', 'notes/once.md', '--input', input, '--expect', 'missing'];
  const runs = await Promise.all([run(process.execPath, args), run(process.execPath, args)]);
  assert.equal(runs.filter((result) => result.code === 0).length, 1, JSON.stringify(runs));
  assert.match(runs.find((result) => result.code !== 0).stderr, /BUSY|STALE/);
  assert.equal(tool.read('notes/once.md').content, note()); assert.equal(fs.existsSync(local('.home-content-write.lock')), false);
});

test('an existing write lock is not silently reclaimed and a standalone copied package runs', async (t) => {
  const { root, write, local } = fixture(t); write('.home-content-write.lock', '原写入者待核实\n');
  const input = path.join(root, 'input.md'); fs.writeFileSync(input, note());
  const blocked = await run(process.execPath, [script, 'put', '--home', root, '--path', 'notes/a.md', '--input', input, '--expect', 'missing']);
  assert.equal(blocked.code, 1); assert.match(blocked.stderr, /BUSY/); assert.equal(fs.existsSync(local('notes/a.md')), false);
  fs.unlinkSync(local('.home-content-write.lock'));
  const copy = path.join(root, 'only-this-package'); fs.cpSync(path.dirname(script), copy, { recursive: true });
  const result = await run(process.execPath, [path.join(copy, 'knowledge.mjs'), 'put', '--home', root, '--path', 'notes/a.md', '--input', input, '--expect', 'missing']);
  assert.equal(result.code, 0, result.stderr); assert.equal(JSON.parse(result.stdout).sourceSaved, true);
});
