import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { temporary } from './helpers.mjs';

function gitResult(cwd, ...args) {
  const result = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8', windowsHide: true });
  if (result.error) throw result.error;
  return result;
}

function git(cwd, ...args) {
  const result = gitResult(cwd, ...args);
  assert.equal(result.status, 0, args.join(' ') + '\n' + result.stderr);
  return result.stdout.trim();
}

function commit(cwd, filename, content, message) {
  fs.writeFileSync(path.join(cwd, filename), content);
  git(cwd, 'add', '--', filename);
  git(cwd, 'commit', '-m', message);
  return git(cwd, 'rev-parse', 'HEAD');
}

function repository(t) {
  const root = temporary(t, 'skills-worktree ');
  git(root, 'init', '-b', 'parent');
  git(root, 'config', 'user.name', 'Worktree fixture');
  git(root, 'config', 'user.email', 'worktree@example.invalid');
  git(root, 'config', 'commit.gpgSign', 'false');
  git(root, 'config', 'core.autocrlf', 'false');
  commit(root, '.gitignore', '/.agents/dev/worktree/\n', 'ignore linked checkouts');
  commit(root, 'contract.txt', 'mode=base\n', 'add base contract');
  return root;
}

function checkout(root, branch, base) {
  const target = path.join(root, '.agents/dev/worktree', branch);
  git(root, 'worktree', 'add', '-b', branch, target, base);
  return target;
}

function mergeCandidate(tree, child) {
  return gitResult(tree, 'merge', '--no-ff', '--no-commit', '--no-overwrite-ignore', child);
}

function mergeCommit(tree, parent, child, message) {
  const verifiedTree = git(tree, 'write-tree');
  git(tree, 'commit', '-m', message);
  const merge = git(tree, 'rev-parse', 'HEAD');
  assert.equal(git(tree, 'rev-parse', 'HEAD^{tree}'), verifiedTree);
  assert.equal(git(tree, 'rev-list', '--parents', '-n', '1', merge), [merge, parent, child].join(' '));
  return merge;
}

test('completed sibling worktrees merge into their parent in order and retain both parents after cleanup', t => {
  const root = repository(t);
  const base = git(root, 'rev-parse', 'HEAD');
  const first = checkout(root, 'first', base);
  const second = checkout(root, 'second', base);
  const c1 = commit(first, 'first.txt', 'first\n', 'first task');
  const c2 = commit(second, 'contract.txt', 'mode=child\n', 'second task');
  const p1 = commit(root, 'contract.txt', 'mode=parent\n', 'save parent task changes');
  const integration = checkout(root, 'integration', p1);

  assert.equal(mergeCandidate(integration, c1).status, 0);
  assert.equal(fs.readFileSync(path.join(integration, 'first.txt'), 'utf8'), 'first\n');
  const m1 = mergeCommit(integration, p1, c1, 'integrate first');
  assert.equal(git(root, 'rev-parse', 'HEAD'), p1);
  git(root, 'merge', '--ff-only', '--no-overwrite-ignore', m1);

  assert.equal(mergeCandidate(integration, c2).status, 1);
  assert.equal(git(integration, 'diff', '--name-only', '--diff-filter=U'), 'contract.txt');
  for (const [stage, mode] of ['base', 'parent', 'child'].entries()) {
    assert.equal(git(integration, 'show', `:${stage + 1}:contract.txt`), 'mode=' + mode);
  }
  fs.writeFileSync(path.join(integration, 'contract.txt'), 'modes=parent,child\n');
  git(integration, 'add', '--', 'contract.txt');
  assert.equal(git(integration, 'ls-files', '-u'), '');
  git(integration, 'diff', '--cached', '--check');
  assert.equal(fs.readFileSync(path.join(integration, 'contract.txt'), 'utf8'), 'modes=parent,child\n');
  const m2 = mergeCommit(integration, m1, c2, 'integrate second');
  assert.equal(git(root, 'rev-parse', 'HEAD'), m1);
  git(root, 'merge', '--ff-only', '--no-overwrite-ignore', m2);

  assert.equal(git(root, 'rev-parse', 'HEAD'), m2);
  assert.equal(git(root, 'status', '--porcelain=v1'), '');
  for (const child of [c1, c2]) git(root, 'merge-base', '--is-ancestor', child, 'parent');
  assert.equal(git(root, 'rev-list', '--first-parent', '-n', '3', 'parent'), [m2, m1, p1].join('\n'));
  for (const tree of [first, second, integration]) git(root, 'worktree', 'remove', tree);
  const graph = git(root, 'log', '--graph', '--oneline', '--decorate', 'parent');
  for (const subject of ['integrate first', 'integrate second', 'first task', 'second task']) assert.ok(graph.includes(subject));
});

test('a stale candidate cannot replace an advanced parent and abort restores only the integration tree', t => {
  const root = repository(t);
  const base = git(root, 'rev-parse', 'HEAD');
  const child = checkout(root, 'child', base);
  const tip = commit(child, 'contract.txt', 'mode=child\n', 'edit child contract');
  const stale = checkout(root, 'stale', base);
  assert.equal(mergeCandidate(stale, tip).status, 0);
  const staleMerge = mergeCommit(stale, base, tip, 'stale integration');

  const current = commit(root, 'contract.txt', 'mode=parent\n', 'advance parent contract');
  fs.writeFileSync(path.join(root, 'user.txt'), 'preserve user changes\n');
  const parentStatus = git(root, 'status', '--porcelain=v1');
  assert.equal(gitResult(root, 'merge', '--ff-only', '--no-overwrite-ignore', staleMerge).status, 128);
  assert.equal(git(root, 'rev-parse', 'HEAD'), current);

  const refreshed = checkout(root, 'refreshed', current);
  assert.equal(mergeCandidate(refreshed, tip).status, 1);
  git(refreshed, 'merge', '--abort');
  assert.equal(git(refreshed, 'rev-parse', 'HEAD'), current);
  assert.equal(git(refreshed, 'status', '--porcelain=v1'), '');
  assert.equal(git(root, 'status', '--porcelain=v1'), parentStatus);
  assert.equal(fs.readFileSync(path.join(root, 'user.txt'), 'utf8'), 'preserve user changes\n');
  assert.equal(git(child, 'rev-parse', 'HEAD'), tip);
});
