import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { catalog, repositoryRoot } from '../install.mjs';
import { duplicateResourceIssues } from '../scripts/validate.mjs';
import { temporary, write } from './helpers.mjs';

test('重复方法改名或仅修改链接仍被拒绝', t => {
  const source = temporary(t);
  const method = '# 完整方法\n' + '完整步骤与判断标准。'.repeat(40);
  write(path.join(source, 'references/a.md'), method + '[示例](one.md)');
  write(path.join(source, 'references/renamed.md'), method + '[示例](two.md)');
  assert.equal(duplicateResourceIssues([{ domain: 'dev', source }]).length, 1);
});

test('整个开发领域没有重复方法和内嵌执行包', () => {
  assert.deepEqual(duplicateResourceIssues(catalog()), []);
  const root = path.join(repositoryRoot, 'skills/dev');
  const paths = fs.readdirSync(root, { recursive: true }).filter(p => fs.statSync(path.join(root, p)).isFile());
  assert.ok(paths.filter(p => p.endsWith('SKILL.md')).every(p => p.split(path.sep).length === 2));
  assert.equal(fs.existsSync(path.join(root, 'dev-help/references/workflow')), false);
  for (const [name, owner] of Object.entries({
    'tdd-method.md': 'dev-tdd', 'bug-repair.md': 'dev-debug',
    'feature-delivery.md': 'dev-build', 'adversarial-review.md': 'dev-review',
    'visual-equivalence.md': 'dev-verify', 'investigation.md': 'dev-learn',
    'source-adapter.md': 'dev-issue-setup', 'autonomous-execution.md': 'dev-workflow',
    'worktree-cleanup.md': 'dev-deploy',
  })) assert.deepEqual(paths.filter(p => p.endsWith(path.join('references', name))), [path.join(owner, 'references', name)]);
});

test('全部迁移记录指向保留的完整资源', () => {
  const lines = fs.readFileSync(path.join(repositoryRoot, 'docs/dev-resource-moves.tsv'), 'utf8').trim().split('\n').slice(1);
  for (const line of lines) {
    const [removed, owner] = line.split('\t');
    assert.ok(fs.existsSync(path.join(repositoryRoot, owner)), owner);
    assert.equal(fs.existsSync(path.join(repositoryRoot, removed)), false, removed);
  }
});
