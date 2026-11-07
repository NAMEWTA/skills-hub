import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { persistenceIssues, check } from '../scripts/check-persistence-roots.mjs';

test('dev and system records use separate domain roots', () => {
  assert.deepEqual(persistenceIssues('skills/dev/dev-spec/SKILL.md', '.agents/dev/changes/demo/'), []);
  assert.deepEqual(persistenceIssues('skills/system/system-config/SKILL.md', '.agents/system/workstation/config.md'), []);
  assert.deepEqual(persistenceIssues('skills/dev/dev-spec/SKILL.md', '.agents/skills/dev-spec/SKILL.md'), []);
});

test('legacy root and nested system folder fail with line and filename', () => {
  const errors = persistenceIssues('skills/dev/dev-workflow/SKILL.md', '# Test\n.agents/wtadev/notes/a.md\n.agents/dev/system/laptop/inspect.md\n');
  assert.equal(errors.length, 2);
  assert.match(errors[0], /SKILL\.md:2:.*wtadev/);
  assert.match(errors[1], /SKILL\.md:3:.*\.agents\/system/);
});

test('scan all runtime reference documents but not immutable source archives', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-domain-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const runtime = path.join(root, 'skills', 'system', 'system-inspect', 'references');
  fs.mkdirSync(runtime, { recursive: true });
  fs.writeFileSync(path.join(runtime, 'memory.md'), '保存在 .agents/wtadev/system/host/ 中\n');
  fs.mkdirSync(path.join(root, 'materials', 'b001'), { recursive: true });
  fs.writeFileSync(path.join(root, 'materials', 'b001', 'original.txt'), 'Source mentions .agents/wtadev/ and must remain immutable');
  assert.equal(check(root).length, 1);
  fs.writeFileSync(path.join(runtime, 'memory.md'), '保存在 .agents/system/host/ 中\n');
  assert.deepEqual(check(root), []);
});
