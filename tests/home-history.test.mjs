import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHistory } from '../skills/home/home-history/scripts/history.mjs';
import { parseDocument } from '../skills/home/home-history/scripts/files.mjs';

const script = fileURLToPath(new URL('../skills/home/home-history/scripts/history.mjs', import.meta.url));
function fixture(t, options = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'home 历史-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const local = (relative) => path.join(root, '.agents', 'home', ...relative.split('/'));
  const write = (relative, content) => { const target = local(relative); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); return target; };
  return { root, local, write, tool: createHistory(root, { now: () => '2026-11-25T12:00:00Z', ...options }) };
}
function event({ key = 'repo:project-a/issue:7/event:42', scope = 'home', source = 'repo:project-a/report:42', time = '2026-10-03T09:00:00+08:00', status = 'reported-unverified', title = '阶段回执', body = '执行者报告已提交，验收尚未完成。\n另一条仍有效的约束保留。', id } = {}) {
  return `---\nevent_key: ${JSON.stringify(key)}\nscope: ${JSON.stringify(scope)}\nsources: ${JSON.stringify([source])}\noccurred_at: ${JSON.stringify(time)}\nstatus: ${JSON.stringify(status)}\n${id ? `id: ${JSON.stringify(id)}\n` : ''}---\n# ${title}\n\n${body}\n`;
}
function run(argv) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, argv, { stdio: ['ignore', 'pipe', 'pipe'] }); let stdout = ''; let stderr = '';
    child.stdout.on('data', (value) => stdout += value); child.stderr.on('data', (value) => stderr += value);
    child.once('error', reject); child.once('close', (code) => resolve({ code, stdout, stderr }));
  });
}
function exclusion(source = 'repo:project-a/report:42', scope = 'home') {
  return `# 不再摄取的来源\n\n| source_ref | scope | basis_ref |\n| --- | --- | --- |\n| ${source} | ${scope} | user:停止保留 |\n`;
}

test('read-only history lookup does not initialize directories or require an index', (t) => {
  const { root, tool } = fixture(t); const result = tool.query('没有记录');
  assert.equal(result.entries.length, 0); assert.equal(result.complete, true); assert.equal(fs.existsSync(path.join(root, '.agents')), false);
});

test('same source event re-import is idempotent and changed content requires an explicit revision', (t) => {
  const { tool, local } = fixture(t); const first = tool.record(event()); const repeated = tool.record(event());
  assert.equal(first.status, 'saved'); assert.equal(repeated.status, 'unchanged'); assert.equal(repeated.path, first.path);
  assert.equal(fs.readdirSync(path.dirname(local(first.path))).filter((name) => name.endsWith('.md')).length, 1);
  assert.throws(() => tool.record(event({ body: '相同事件的新细节' })), { code: 'EVENT_EXISTS' });
  assert.match(tool.read(first.path).content, /验收尚未完成/);
});

test('similar titles, later actual events and independent scopes are not merged', (t) => {
  const { tool } = fixture(t);
  const first = tool.record(event());
  const later = tool.record(event({ key: 'repo:project-a/issue:7/event:43', time: '2026-10-04', status: 'accepted', body: '验收方确认通过。' }));
  const other = tool.record(event({ scope: 'home:另一组' }));
  assert.notEqual(first.id, later.id); assert.notEqual(first.id, other.id); assert.equal(tool.query('阶段回执').entries.length, 3);
});

test('explicit ID collision preserves the original event and cannot overwrite it in another month', (t) => {
  const { tool } = fixture(t); const first = tool.record(event({ id: '固定事件' })); const original = tool.read(first.path).content;
  assert.throws(() => tool.record(event({ id: '固定事件', key: 'repo:project-a/event:99', time: '2026-11-01' })), { code: 'ID_EXISTS' });
  assert.equal(tool.read(first.path).content, original);
});

test('event time, capture time and result status remain distinct, including unknown and partial events', (t) => {
  const { tool } = fixture(t);
  const recorded = tool.record(event({ time: '2026-01-02', status: 'cancelled-partial' }));
  const metadata = parseDocument(tool.read(recorded.path).content).metadata;
  assert.equal(metadata.occurred_at, '2026-01-02'); assert.equal(metadata.recorded_at, '2026-11-25T12:00:00Z'); assert.equal(metadata.status, 'cancelled-partial');
  const unknown = tool.record(event({ key: 'user:event-time-unknown', time: 'unknown', status: 'unknown' }));
  assert.match(unknown.path, /^history\/2026\/11\//); assert.equal(parseDocument(tool.read(unknown.path).content).metadata.occurred_at, 'unknown');
  assert.equal(tool.query('', { from: '2026-01-01', until: '2026-01-31' }).entries.length, 1);
  assert.equal(tool.query('', { from: '2026-01-01', until: '2026-01-31', includeUndated: true }).entries.length, 2);
  assert.equal(tool.query('', { from: '2026-11-01', until: '2026-11-30' }).entries.length, 0);
  for (const time of ['2026-02-31', '2026-11-25T12:00:00', '2026-11-25T24:00:00Z', 'tomorrow']) assert.throws(() => tool.record(event({ time })), { code: 'DATE' });
});

test('date filters respect supplied timezones and include overlapping date-only evidence', (t) => {
  const { tool } = fixture(t);
  tool.record(event({ time: '2026-10-03T09:00:00+08:00' }));
  tool.record(event({ key: 'repo:project-a/event:day-only', time: '2026-10-03' }));
  assert.equal(tool.query('', { from: '2026-10-03T00:30:00Z', until: '2026-10-03T01:30:00Z' }).entries.length, 2);
  assert.throws(() => tool.query('', { from: '2026-11-01', until: '2026-10-01' }), { code: 'DATE' });
});

test('latest history uses actual instants across offsets and places unknown timestamps last', (t) => {
  const { tool, local } = fixture(t);
  const older = tool.record(event({ title: 'Older', key: 'user:older', time: '2026-11-25T10:00:00+08:00' }));
  const newer = tool.record(event({ title: 'Newer', key: 'user:newer', time: '2026-11-25T04:00:00Z' }));
  const unknown = tool.record(event({ title: 'Unknown', key: 'user:unknown', time: 'unknown' }));
  assert.equal(tool.query('', { limit: 1 }).entries[0].path, newer.path);
  assert.deepEqual(tool.query('').entries.map(entry => entry.path), [newer.path, older.path, unknown.path]);
  const index = fs.readFileSync(local('history/index.md'), 'utf8');
  assert.ok(index.indexOf('[Newer]') < index.indexOf('[Older]'));
  assert.ok(index.indexOf('[Older]') < index.indexOf('[Unknown]'));
});

test('updating a legacy event cannot claim another events ID', (t) => {
  const { tool, write } = fixture(t);
  tool.record(event({ id: 'owned-id' }));
  const legacy = 'history/2026/10/legacy.md';
  const content = event({ key: 'user:legacy' }); write(legacy, content);
  const before = tool.read(legacy);
  assert.throws(() => tool.update(legacy, event({ key: 'user:legacy', id: 'owned-id' }), before.sha256), { code: 'ID_EXISTS' });
  assert.equal(tool.read(legacy).content, content);
});

test('revisions keep event identity and original capture time, while stale drafts cannot discard newer evidence', (t) => {
  const { tool, local } = fixture(t); const first = tool.record(event());
  const revised = tool.update(first.path, event({ status: 'accepted', body: '验收方已核实通过。\n另一条仍有效的约束保留。' }), first.sha256);
  assert.equal(revised.status, 'saved'); const parsed = parseDocument(tool.read(first.path).content);
  assert.equal(parsed.metadata.id, first.id); assert.equal(parsed.metadata.recorded_at, '2026-11-25T12:00:00Z'); assert.equal(parsed.metadata.updated_at, '2026-11-25T12:00:00Z'); assert.match(parsed.body, /仍有效的约束保留/);
  assert.throws(() => tool.update(first.path, event(), first.sha256), { code: 'STALE' });
  assert.throws(() => tool.update(first.path, event({ key: '伪装新事件' }), revised.sha256), { code: 'IDENTITY' });
  fs.appendFileSync(local(first.path), '\n人工补充来源。\n');
  assert.throws(() => tool.update(first.path, event(), revised.sha256), { code: 'STALE' });
  assert.match(tool.read(first.path).content, /人工补充来源/);
});

test('archived original events still participate in identity checks but not default active searches', (t) => {
  const { tool, local } = fixture(t); const first = tool.record(event()); const archive = first.path.replace(/^history\//, 'archive/history/');
  fs.mkdirSync(path.dirname(local(archive)), { recursive: true }); fs.renameSync(local(first.path), local(archive));
  const repeated = tool.record(event()); assert.equal(repeated.status, 'unchanged'); assert.equal(repeated.path, archive);
  assert.equal(tool.query('阶段回执').entries.length, 0); assert.equal(tool.query('阶段回执', { includeArchive: true }).entries.length, 1);
});

test('history reads durable exclusions, never modifies them, and index rebuild cannot revive excluded evidence', (t) => {
  const { tool, write, local } = fixture(t); const first = tool.record(event());
  const rules = exclusion(); write('exclusions.md', rules);
  assert.equal(tool.query('阶段回执').entries.length, 0); assert.equal(tool.query('阶段回执').excluded, 1);
  tool.index(); assert.doesNotMatch(fs.readFileSync(local('history/index.md'), 'utf8'), /阶段回执/);
  assert.throws(() => tool.record(event({ key: '同来源的新文件名' })), { code: 'EXCLUDED' });
  assert.throws(() => tool.update('exclusions.md', rules, first.sha256), { code: 'OWNER' });
  tool.remove(first.path, first.sha256); tool.index(); assert.equal(fs.readFileSync(local('exclusions.md'), 'utf8'), rules);
  assert.equal(tool.record(event({ scope: 'home:另一个明确范围' })).status, 'saved');
});

test('summarized history respects an excluded ancestor source without treating partial names as equal', (t) => {
  const { tool, write } = fixture(t);
  const content = event({ source: 'home:later-summary' }).replace('scope: "home"\n', 'scope: "home"\nderived_from: ["repo:project-a/report:42"]\n');
  const saved = tool.record(content);
  write('exclusions.md', exclusion());
  assert.equal(tool.query('阶段回执').entries.length, 0);
  assert.throws(() => tool.record(content), { code: 'EXCLUDED' });
  tool.remove(saved.path, saved.sha256);
  assert.equal(tool.record(content.replace('report:42', 'report:420')).status, 'saved');
});

test('bad exclusion format or unreadable identity ranges do not silently permit new events', (t) => {
  const { tool, write, local } = fixture(t); write('exclusions.md', '# 保留原来的排除要求');
  assert.throws(() => tool.record(event()), { code: 'EXCLUSIONS_FORMAT' }); fs.unlinkSync(local('exclusions.md'));
  write('history/2026/11/unknown.md', '---\nevent_key:\n  nested: bad\n---\n# 无法解析');
  assert.throws(() => tool.record(event()), { code: 'INCOMPLETE' });
});

test('history respects exclusion rows with optional Markdown borders and rejects ambiguous table rows', (t) => {
  const { tool, write, local } = fixture(t); tool.record(event());
  for (const row of ['| another-source | home | user:另一来源', 'another-source | home | user:另一来源 |', 'another-source | home | user:另一来源']) {
    const rules = `| source_ref | scope | basis_ref |\n| --- | --- | --- |\n${row}\n| repo:project-a/report:42 | home | user:停止使用 |\n`;
    write('exclusions.md', rules);
    assert.equal(tool.query('阶段回执').entries.length, 0);
    assert.throws(() => tool.record(event({ key: 'user:new-import' })), { code: 'EXCLUDED' });
    tool.index(); assert.doesNotMatch(fs.readFileSync(local('history/index.md'), 'utf8'), /阶段回执/);
    assert.equal(fs.readFileSync(local('exclusions.md'), 'utf8'), rules);
  }
  write('exclusions.md', '| source_ref | scope | basis_ref |\n| --- | --- | --- |\n无法解释的数据行\n| repo:project-a/report:42 | home | user:停止使用 |\n');
  assert.throws(() => tool.record(event({ key: 'user:new-import' })), { code: 'EXCLUSIONS_FORMAT' });
  assert.throws(() => tool.query('阶段回执'), { code: 'EXCLUSIONS_FORMAT' });
  assert.throws(() => tool.index(), { code: 'EXCLUSIONS_FORMAT' });
});

test('history rejects unsafe derived provenance and does not publish unparseable sources through queries or indexes', (t) => {
  const { tool, write, local } = fixture(t); write('exclusions.md', exclusion());
  const independent = event({ key: 'user:independent', source: 'home:independent' }).replace('scope: "home"\n', 'scope: "home"\nderived_from: []\n');
  assert.equal(tool.record(independent).sourceSaved, true);
  for (const value of ['"repo:project-a/report:42"', '[""]', '[" "]']) {
    const content = event({ key: 'user:unsafe', source: 'home:summary', title: '不安全的派生历史' }).replace('scope: "home"\n', `scope: "home"\nderived_from: ${value}\n`);
    assert.throws(() => tool.record(content), { code: 'PROVENANCE' });
    write('history/2026/11/unsafe.md', content);
    const found = tool.query('不安全的派生历史');
    assert.equal(found.entries.length, 0); assert.equal(found.complete, false);
    assert.ok(found.warnings.some((warning) => warning.includes('history/2026/11/unsafe.md')));
    const index = tool.index(); assert.equal(index.complete, false);
    assert.doesNotMatch(fs.readFileSync(local('history/index.md'), 'utf8'), /不安全的派生历史/);
    assert.equal(tool.read('history/2026/11/unsafe.md').content, content);
  }
  write('history/2026/11/unsafe.md', '---\nscope: home\nsources:\n  - repo:project-a/report:42\n---\n# 无法解析的旧事件\n');
  assert.equal(tool.query('无法解析的旧事件').entries.length, 0);
  tool.index(); assert.doesNotMatch(fs.readFileSync(local('history/index.md'), 'utf8'), /无法解析的旧事件/);
  assert.throws(() => tool.record(event({ key: 'user:unrelated', source: 'home:unrelated' })), { code: 'INCOMPLETE' });
  write('history/2026/11/legacy.md', '# 既有普通历史\n时间与来源仍需核查。\n');
  assert.equal(tool.query('既有普通历史').entries.length, 1);
});

test('index failure preserves the newly recorded source and can be repaired without changing timestamps', (t) => {
  const { tool, local } = fixture(t); fs.mkdirSync(local('history/index.md'), { recursive: true });
  const saved = tool.record(event()); assert.equal(saved.status, 'partial'); assert.equal(saved.sourceSaved, true); assert.equal(saved.index.status, 'pending');
  const content = tool.read(saved.path).content; fs.rmdirSync(local('history/index.md')); tool.index();
  assert.equal(tool.read(saved.path).content, content); const index = fs.readFileSync(local('history/index.md'), 'utf8'); assert.equal(tool.index().changed, false); assert.equal(fs.readFileSync(local('history/index.md'), 'utf8'), index);
});

test('bounded history searches fall back to source files and report truncation', (t) => {
  const { tool, local } = fixture(t); tool.record(event()); tool.record(event({ key: 'repo:project-a/event:43' }));
  fs.unlinkSync(local('history/index.md'));
  const all = tool.query('阶段回执'); assert.equal(all.entries.length, 2);
  const bounded = tool.query('阶段回执', { maxFiles: 1 }); assert.equal(bounded.complete, false); assert.equal(bounded.truncated, true);
});

test('history writes cannot cross into other owners or linked project knowledge', (t) => {
  const { tool, root, write, local } = fixture(t); write('context/preferences.md', '原配置');
  assert.throws(() => tool.update('context/preferences.md', event(), '0'.repeat(64)), { code: 'OWNER' });
  assert.throws(() => tool.read('history/../../context/preferences.md'), { code: 'PATH' });
  const outside = path.join(root, 'project'); fs.mkdirSync(outside); fs.writeFileSync(path.join(outside, 'e.md'), '项目原件');
  fs.mkdirSync(local('history'), { recursive: true });
  try { fs.symlinkSync(outside, local('history/linked'), 'dir'); }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('本环境不能建立目录符号链接'); return; } throw error; }
  assert.throws(() => tool.read('history/linked/e.md'), { code: 'PATH' });
  assert.throws(() => tool.record(event()), { code: 'INCOMPLETE' });
  assert.equal(fs.readFileSync(path.join(outside, 'e.md'), 'utf8'), '项目原件');
});

test('two real CLI imports produce one event, with contention or idempotence reported accurately', async (t) => {
  const { root, tool } = fixture(t); const input = path.join(root, 'input.md'); fs.writeFileSync(input, event());
  const args = [script, 'record', '--home', root, '--input', input]; const runs = await Promise.all([run(args), run(args)]);
  assert.ok(runs.some((result) => result.code === 0), JSON.stringify(runs));
  for (const result of runs) if (result.code !== 0) assert.match(result.stderr, /BUSY/);
  assert.equal(tool.query('阶段回执').entries.length, 1);
  const retry = await run(args); assert.equal(retry.code, 0, retry.stderr); assert.equal(JSON.parse(retry.stdout).status, 'unchanged');
});

test('history honors the common Home content lock and runs from an isolated copied package', async (t) => {
  const { root, write, local } = fixture(t); write('.home-content-write.lock', '另一个内容写入者\n');
  const input = path.join(root, 'input.md'); fs.writeFileSync(input, event());
  const blocked = await run([script, 'record', '--home', root, '--input', input]); assert.equal(blocked.code, 1); assert.match(blocked.stderr, /BUSY/);
  fs.unlinkSync(local('.home-content-write.lock'));
  const copy = path.join(root, 'only-this-package'); fs.cpSync(path.dirname(script), copy, { recursive: true });
  const result = await run([path.join(copy, 'history.mjs'), 'record', '--home', root, '--input', input]);
  assert.equal(result.code, 0, result.stderr); assert.equal(JSON.parse(result.stdout).sourceSaved, true);
});
