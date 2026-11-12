import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyCorpus } from '../scripts/check-statechart-replay.mjs';
import { check } from '../scripts/validate-materials.mjs';
import { parseTsv, stringifyTsv, readMaterials, queryMaterials, PARENT_COLUMNS, CHILD_COLUMNS } from '../scripts/materials-manifest.mjs';
import { temporary, write } from './helpers.mjs';

const hash = (a, b) => createHash(a).update(b).digest('hex');
function fixture(t) {
  const root = temporary(t, 'materials-isolated-');
  const project = { project: 'sample', repository: 'https://example.invalid/repo', ref: 'main', revision: 'a'.repeat(40), source_root: 'skills', manifest_path: 'sample/manifest.tsv' };
  const data = Buffer.from('# Source\r\n');
  const zh = Buffer.from('# 完整中文对照\n');
  const row = { path: 'nested/SKILL.md', kind: 'document', language: 'en', source_git_mode: '100644', source_git_blob: hash('sha1', Buffer.concat([Buffer.from(`blob ${data.length}\0`), data])), upstream_sha256: hash('sha256', data), zh_path: 'zh/nested/SKILL.md', zh_sha256: hash('sha256', zh), runtime_paths: 'skills/dev/dev-sample/method.md', runtime_reviewed_blob: '', adaptation: '保留完整方法。' };
  const upstream = path.join(root, 'materials/sample/upstream', row.path);
  const localized = path.join(root, 'materials/sample', row.zh_path);
  write(upstream, data); fs.chmodSync(upstream, 0o644); write(localized, zh);
  write(path.join(root, row.runtime_paths), '本地方法');
  const save = (parents = [project], children = [row]) => {
    write(path.join(root, 'materials/manifest.tsv'), stringifyTsv(parents, PARENT_COLUMNS));
    write(path.join(root, 'materials/sample/manifest.tsv'), stringifyTsv(children, CHILD_COLUMNS));
  };
  save();
  return { root, project, row, upstream, localized, save, failures: () => check(root, { output() {} }) };
}
const scenario = (name, fn) => test(name, t => fn(fixture(t), t));
function symlink(t, target, alias) {
  try { fs.symlinkSync(target, alias, fs.statSync(target).isDirectory() ? (process.platform === 'win32' ? 'junction' : 'dir') : 'file'); return true; }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('symlink creation unavailable'); return false; } throw error; }
}
scenario('two-level reader, queries and root alias work without real materials', (f, t) => {
  assert.deepEqual(f.failures(), []);
  const model = readMaterials(f.root);
  assert.equal(model.projects[0].rows.length, 1);
  for (const filter of [{ project: 'sample' }, { project: 'sample', path: f.row.path }, { source_path: 'skills/nested/SKILL.md' }, { runtime_path: f.row.runtime_paths }]) assert.equal(queryMaterials(model, filter).length, 1);
  const alias = path.join(temporary(t), 'alias'); if (!symlink(t, f.root, alias)) return;
  assert.deepEqual(check(alias, { output() {} }), []);
});
scenario('offline commit-tree authentication catches forged metadata and omitted files', (f, t) => {
  const repo = temporary(t, 'materials-local-git-');
  const git = args => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();
  git(['init', '--quiet']);
  write(path.join(repo, 'skills/nested/SKILL.md'), fs.readFileSync(f.upstream));
  git(['add', '.']); git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture']);
  f.project.revision = git(['rev-parse', 'HEAD']); f.save();
  const options = { output() {}, gitRepositories: { sample: repo } };
  assert.deepEqual(check(f.root, options), []);
  write(f.upstream, 'forged'); f.row.upstream_sha256 = hash('sha256', 'forged'); f.row.source_git_blob = hash('sha1', Buffer.from('blob 6\0forged')); f.save();
  assert.deepEqual(f.failures(), []);
  assert.match(check(f.root, options).join('\n'), /source commit/);
  write(path.join(repo, 'skills/omitted.txt'), 'must be included'); git(['add', '.']);
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'extra']);
  f.project.revision = git(['rev-parse', 'HEAD']); f.save();
  assert.match(check(f.root, options).join('\n'), /unregistered file omitted/);
  f.project.source_root = 'missing'; f.save(); assert.match(check(f.root, options).join('\n'), /unavailable/);
});
scenario('document byte copy cannot claim to be translated', f => {
  fs.copyFileSync(f.upstream, f.localized); f.row.zh_sha256 = f.row.upstream_sha256; f.save(); assert.match(f.failures().join('\n'), /untranslated/);
});
scenario('blob detects changed bytes even with refreshed SHA-256', f => {
  write(f.upstream, 'changed'); f.row.upstream_sha256 = hash('sha256', 'changed'); f.save();
  assert.match(f.failures().join('\n'), /Git blob/);
});
scenario('translation hash and executable mode are real checks', f => {
  write(f.localized, 'changed'); fs.chmodSync(f.upstream, 0o755);
  assert.match(f.failures().join('\n'), /SHA-256/); if (process.platform !== 'win32') assert.match(f.failures().join('\n'), /mode/);
});
scenario('Chinese sources use sparse zh', f => {
  f.row.language = 'zh'; f.row.zh_path = ''; f.row.zh_sha256 = ''; fs.unlinkSync(f.localized); f.save();
  assert.deepEqual(f.failures(), []);
  write(f.localized, '孤立副本'); assert.match(f.failures().join('\n'), /unregistered/);
});
for (const [kind, language] of [['legal', 'en'], ['code', 'none'], ['fixture', 'none'], ['asset', 'none']]) {
  scenario(`${kind}/${language} requires byte-identical counterpart`, f => {
    f.row.kind = kind; f.row.language = language; f.save();
    assert.match(f.failures().join('\n'), /original bytes/);
    fs.copyFileSync(f.upstream, f.localized); f.row.zh_sha256 = f.row.upstream_sha256; f.save(); assert.deepEqual(f.failures(), []);
  });
}
scenario('empty binary machine data is valid', f => {
  write(f.upstream, Buffer.alloc(0)); write(f.localized, Buffer.alloc(0)); f.row.kind = 'fixture'; f.row.language = 'none';
  f.row.source_git_blob = hash('sha1', Buffer.from('blob 0\0')); f.row.upstream_sha256 = f.row.zh_sha256 = hash('sha256', ''); f.save(); assert.deepEqual(f.failures(), []);
});
scenario('non-Chinese sources require same-path counterpart', f => {
  f.row.zh_path = ''; f.row.zh_sha256 = ''; f.save(); assert.match(f.failures().join('\n'), /zh_path/);
});
scenario('upstream and zh sets are exact', f => {
  write(path.join(f.root, 'materials/sample/upstream/extra'), 'x'); write(path.join(f.root, 'materials/sample/zh/extra'), 'x');
  assert.equal(f.failures().filter(x => /unregistered/.test(x)).length, 2);
  fs.unlinkSync(f.upstream); assert.match(f.failures().join('\n'), /missing/);
});
for (const field of ['path', 'zh_path', 'runtime_paths']) for (const value of ['../escape', '/absolute', 'a/../escape', 'a\\escape', 'C:/escape']) scenario(`${field} rejects ${value}`, f => {
  f.row[field] = value; f.save(); assert.ok(f.failures().length);
});
for (const field of ['manifest_path', 'source_root']) scenario(`parent ${field} rejects traversal`, f => {
  f.project[field] = '../outside'; f.save(); assert.ok(f.failures().length);
});
scenario('duplicate parents and source identities fail', f => {
  f.save([f.project, f.project]); assert.match(f.failures().join('\n'), /duplicate/);
  f.save([{ ...f.project }, { ...f.project, project: 'other', manifest_path: 'other/manifest.tsv' }]); assert.match(f.failures().join('\n'), /duplicate source/);
});
scenario('duplicate child paths fail', f => { f.save([f.project], [f.row, f.row]); assert.match(f.failures().join('\n'), /duplicate/); });
for (const target of ['materials', 'materials/sample', 'materials/sample/upstream', 'materials/sample/upstream/nested', 'materials/sample/manifest.tsv', 'materials/sample/upstream/nested/SKILL.md', 'materials/sample/zh/nested/SKILL.md', 'skills']) scenario(`symlink boundary rejected: ${target}`, (f, t) => {
  const original = path.join(f.root, target); const outside = path.join(temporary(t), 'moved'); fs.renameSync(original, outside); if (!symlink(t, outside, original)) return;
  assert.match(f.failures().join('\n'), /symlink/);
});
scenario('runtime method has one dev owner and no duplicate paths', f => {
  write(path.join(f.root, 'skills/dev/dev-other/method.md'), '方法');
  f.row.runtime_paths += ';skills/dev/dev-other/method.md'; f.save(); assert.match(f.failures().join('\n'), /one owning skill/);
  f.row.runtime_paths = 'skills/dev/dev-sample/method.md;skills/dev/dev-sample/method.md'; f.save(); assert.match(f.failures().join('\n'), /duplicate runtime/);
});
scenario('reviewed blob cannot exist without runtime relationship', f => {
  f.row.runtime_paths = ''; f.row.runtime_reviewed_blob = 'b'.repeat(40); f.save(); assert.match(f.failures().join('\n'), /reviewed/);
});
scenario('stale reviewed blob is allowed and not advanced', f => {
  f.row.runtime_reviewed_blob = 'b'.repeat(40); f.save(); assert.deepEqual(f.failures(), []); assert.equal(readMaterials(f.root).rows[0].runtime_reviewed_blob, 'b'.repeat(40));
});
for (const [field, value, message] of [['kind', 'unknown', 'invalid kind'], ['language', 'xx', 'invalid language'], ['source_git_mode', '120000', 'unsupported Git mode'], ['source_git_blob', 'bad', 'Git blob'], ['upstream_sha256', 'bad', 'SHA-256'], ['runtime_reviewed_blob', 'bad', 'reviewed'], ['adaptation', '', 'adaptation']]) scenario(`invalid metadata ${field}`, f => {
  f.row[field] = value; f.save(); assert.match(f.failures().join('\n'), new RegExp(message));
});
scenario('changed English and malformed UTF-8 do not qualify as document translation', f => {
  write(f.localized, 'Untranslated but different'); f.row.zh_sha256 = hash('sha256', 'Untranslated but different'); f.save(); assert.match(f.failures().join('\n'), /Chinese translation is absent/);
  const bytes = Buffer.from([0xff]); write(f.localized, bytes); f.row.zh_sha256 = hash('sha256', bytes); f.save(); assert.match(f.failures().join('\n'), /UTF-8/);
});
scenario('parent manifest symlink is rejected', (f, t) => {
  const original = path.join(f.root, 'materials/manifest.tsv'); const outside = path.join(temporary(t), 'manifest.tsv'); fs.renameSync(original, outside); if (!symlink(t, outside, original)) return;
  assert.match(f.failures().join('\n'), /symlink/);
});
scenario('replay copies only pstack corpus upstream bytes through the shared reader', (f, t) => {
  const prefix = 'claude-code/skills/statechart/scripts/test/corpus/';
  f.project.project = 'pstack'; f.project.manifest_path = 'pstack/manifest.tsv';
  f.row.path = prefix + 'example/example.tla'; f.row.zh_path = 'zh/' + f.row.path;
  const children = [f.row, { ...f.row, path: 'outside.py', zh_path: 'zh/outside.py' }];
  fs.renameSync(path.join(f.root, 'materials/sample'), path.join(f.root, 'materials/pstack'));
  write(path.join(f.root, 'materials/manifest.tsv'), stringifyTsv([f.project], PARENT_COLUMNS));
  write(path.join(f.root, 'materials/pstack/manifest.tsv'), stringifyTsv(children, CHILD_COLUMNS));
  const source = write(path.join(f.root, 'materials/pstack/upstream', f.row.path), Buffer.from([0, 13, 10, 255]));
  const corpus = path.join(temporary(t), 'corpus');
  assert.equal(copyCorpus(f.root, corpus), 1);
  assert.deepEqual(fs.readFileSync(path.join(corpus, 'example/example.tla')), fs.readFileSync(source));
  assert.equal(fs.existsSync(path.join(corpus, 'outside.py')), false);
  const moved = path.join(temporary(t), 'outside'); fs.renameSync(source, moved); if (!symlink(t, moved, source)) return;
  assert.throws(() => copyCorpus(f.root, path.join(temporary(t), 'corpus')), /symlink/);
});
scenario('replay rejects absent corpus instead of silently running no cases', f => {
  assert.throws(() => copyCorpus(f.root, path.join(f.root, 'corpus')), /没有找到完整捕获夹具/);
});
scenario('unregistered project directory fails', f => { fs.mkdirSync(path.join(f.root, 'materials/old')); assert.match(f.failures().join('\n'), /unregistered/); });
scenario('legacy or wrong schema is rejected instead of interpreted', f => {
  write(path.join(f.root, 'materials/manifest.tsv'), 'id\tkind\na001\tdocument\n'); assert.match(f.failures().join('\n'), /columns/);
});
test('TSV round trips quoted tabs, CRLF, newlines, empty fields and quotes', () => {
  const rows = [{ a: 'one\t"two"\nthree\r\nfour', b: '' }]; assert.deepEqual(parseTsv(stringifyTsv(rows, ['a', 'b'])), rows);
});
for (const text of ['a\ta\n1\t2\n', 'a\tb\n1\n', 'a\n"unclosed', 'a\n"closed"junk\n', 'a\nraw"quote\n']) test(`malformed TSV rejected: ${JSON.stringify(text)}`, () => assert.throws(() => parseTsv(text)));
