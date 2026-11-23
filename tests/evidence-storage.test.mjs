import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { repositoryRoot } from '../install.mjs';
import { checkEvidence } from '../skills/dev/dev-verify/scripts/check-evidence.mjs';
import { command, snapshot, temporary, write } from './helpers.mjs';

const checker = path.join(repositoryRoot, 'skills/dev/dev-verify/scripts/check-evidence.mjs');

test('验收报告按实际文件名配对，同数量、不同大小写或不同名称均不通过', t => {
  const change = temporary(t, 'skills-hub evidence policy ');
  const stem = 'S2.5-reply-forward';
  write(path.join(change, 'tasks', stem + '.md'), '# 任务\n');
  write(path.join(change, 'tasks', 'notes.txt'), '非票据');
  assert.deepEqual(checkEvidence(change).problems, [`缺少报告：evidences/${stem}.md`]);
  for (const wrong of [stem.toLowerCase() + '.md', stem + '-retry.md']) {
    const file = write(path.join(change, 'evidences', wrong), '# 未验证\n');
    const before = snapshot(change);
    const result = command(process.execPath, [checker, change]);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.ok(result.stderr.includes(`无完全同名的任务：evidences/${wrong}`));
    assert.ok(result.stderr.includes(`缺少报告：evidences/${stem}.md`));
    assert.deepEqual(snapshot(change), before);
    fs.unlinkSync(file);
  }
  write(path.join(change, 'evidences', stem + '.md'), '# 未验证\n');
  const before = snapshot(change);
  const result = command(process.execPath, [checker, change]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 对.*不代表通过验收/);
  assert.deepEqual(snapshot(change), before);
});

test('evidences 只接受同名普通 Markdown，拒绝附件、索引、目录和链接', t => {
  const change = temporary(t);
  const external = temporary(t);
  for (const name of ['01-run', '02-linked']) write(path.join(change, 'tasks', name + '.md'), '# 任务\n');
  write(path.join(change, 'evidences', '01-run.md'), '# 验收\n');
  write(path.join(change, 'evidences', 'index.md'), '# 无对应票据\n');
  write(path.join(change, 'evidences', 'tool.log'), 'original output');
  fs.mkdirSync(path.join(change, 'evidences', 'subdirectory'));
  fs.symlinkSync(external, path.join(change, 'evidences', '02-linked.md'), 'junction');
  fs.symlinkSync(external, path.join(change, 'tasks', '03-invalid.md'), 'junction');
  assert.deepEqual(checkEvidence(change), { count: 2, problems: [
    '任务必须是普通文件：tasks/03-invalid.md',
    '报告目录只允许普通 .md 文件：evidences/02-linked.md',
    '无完全同名的任务：evidences/index.md',
    '报告目录只允许普通 .md 文件：evidences/subdirectory',
    '报告目录只允许普通 .md 文件：evidences/tool.log',
    '缺少报告：evidences/02-linked.md',
  ] });
});
