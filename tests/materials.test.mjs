import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { check, parseTsv } from '../scripts/validate-materials.mjs';
import { temporary, write, saveTsv } from './helpers.mjs';

const hash = (algorithm, value) => createHash(algorithm).update(value).digest('hex');

class MaterialFixture {
  constructor(t) {
    this.root = temporary(t, 'skills-wta-materials-');
    this.materials = path.join(this.root, 'materials');
    this.pair = path.join(this.materials, 'a001');
    fs.mkdirSync(this.pair, { recursive: true });
    this.runtime = write(path.join(this.root, 'skills/dev/dev-sample/references/method.md'), '# 本地方法\n');
  }
  writePair(kind = 'document', original = Buffer.from('# Original\n'), localized = Buffer.from('# 完整译文\n')) {
    for (const name of fs.readdirSync(this.pair)) fs.unlinkSync(path.join(this.pair, name));
    const originalName = kind === 'asset' ? 'original.png' : 'original.txt';
    const localizedName = kind === 'asset' ? 'localized.png' : kind === 'document' ? 'zh-CN.txt' : 'localized.txt';
    write(path.join(this.pair, originalName), original); write(path.join(this.pair, localizedName), localized);
    this.row = {
      id: 'a001', kind, source_group: 'sample', source_path: kind === 'asset' ? 'source/example.png' : 'source/example.md',
      source_git_blob: hash('sha1', Buffer.concat([Buffer.from(`blob ${original.length}\0`), original])),
      original_sha256: hash('sha256', original), translation_sha256: hash('sha256', localized),
      runtime_paths: path.relative(this.root, this.runtime).split(path.sep).join('/'), adaptation: '完整内容在本地运行。',
    };
    this.save();
  }
  save() { saveTsv(path.join(this.materials, 'manifest.tsv'), this.row); }
  failures() { return check(this.root, { output() {} }); }
}

function fidelity(name, run) { test(name, (t) => run(new MaterialFixture(t))); }

fidelity('a complete Chinese document is valid', (f) => { f.writePair(); assert.deepEqual(f.failures(), []); });
fidelity('source blob detects a changed original even after its SHA-256 was replaced', (f) => {
  f.writePair(); const changed = Buffer.from('# Modified source\n'); write(path.join(f.pair, 'original.txt'), changed);
  f.row.original_sha256 = hash('sha256', changed); f.save();
  assert.ok(f.failures().some((error) => error.includes('source Git blob')));
});
fidelity('a changed translation is detected', (f) => {
  f.writePair(); write(path.join(f.pair, 'zh-CN.txt'), '被截短的译文');
  assert.ok(f.failures().some((error) => error.includes('SHA-256')));
});
fidelity('code preserves identifiers without fabricated Chinese', (f) => {
  const code = Buffer.from('export const enabled = true;\n'); f.writePair('code', code, code); assert.deepEqual(f.failures(), []);
});
fidelity('an empty machine fixture is valid and preserved', (f) => {
  f.writePair('fixture', Buffer.alloc(0), Buffer.alloc(0)); assert.deepEqual(f.failures(), []);
});
fidelity('a machine fixture must not be translated', (f) => {
  f.writePair('fixture', Buffer.from('{"state":"READY"}\n'), Buffer.from('{"state":"START"}\n'));
  assert.ok(f.failures().some((error) => error.includes('original bytes')));
});
fidelity('a runtime mapping cannot escape skills', (f) => {
  f.writePair(); f.row.runtime_paths = 'materials/a001/original.txt'; f.save();
  assert.ok(f.failures().some((error) => error.includes('outside skills')));
});
fidelity('an untranslated document is not a Chinese translation', (f) => {
  f.writePair('document', Buffer.from('# Original\n'), Buffer.from('# Original copied without translation\n'));
  assert.ok(f.failures().some((error) => error.includes('Chinese translation is absent')));
});
fidelity('a binary asset is preserved without text decoding', (f) => {
  const data = Buffer.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10, 255, 254]);
  f.writePair('asset', data, data); assert.deepEqual(f.failures(), []);
});
fidelity('a changed asset cannot claim to be an original copy', (f) => {
  f.writePair('asset', Buffer.from('\x89PNG\r\n\x1a\noriginal'), Buffer.from('\x89PNG\r\n\x1a\nmodified'));
  assert.ok(f.failures().some((error) => error.includes('original bytes')));
});
test('TSV parsing preserves quoted tabs, newlines and quotes', () => {
  assert.deepEqual(parseTsv('id\tadaptation\r\na001\t"中文\t字段\n保留""引号"\r\n'), [{ id: 'a001', adaptation: '中文\t字段\n保留"引号' }]);
});
