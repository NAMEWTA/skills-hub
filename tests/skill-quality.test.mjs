import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { repositoryRoot, licenseBundleFiles } from '../install.mjs';
import * as quality from '../scripts/check-skill-quality.mjs';
import { testFiles } from '../scripts/check.mjs';
import { temporary, write, command, isolatedGitEnvironment, saveTsv } from './helpers.mjs';

const entry = 'skills/dev/dev-sample/SKILL.md';
const header = '---\nname: dev-sample\ndescription: 处理示例任务。\n---\n';
const valid = `${header}# 示例\n\n按用户目标处理。\n`;
const oversized = `${header}${'字'.repeat(quality.maxBodyCharacters + 1)}\n`;
const zeroId = '0'.repeat(40);

test('the line budget counts only the body and accepts its boundary', () => {
  const content = header + '步骤\n'.repeat(quality.maxBodyLines);
  assert.equal(quality.measure(entry, content).lines, quality.maxBodyLines);
  assert.deepEqual(quality.entryIssues(entry, content), []);
  const failures = quality.entryIssues(entry, `${content}多一行\n`);
  assert.equal(failures.length, 1); assert.match(failures[0], /501/); assert.match(failures[0], /references\//);
});
test('a single long Chinese line cannot bypass the budget', () => {
  assert.deepEqual(quality.entryIssues(entry, header + '字'.repeat(quality.maxBodyCharacters)), []);
  const failures = quality.entryIssues(entry, oversized);
  assert.equal(failures.length, 1); assert.match(failures[0], /12001/); assert.match(failures[0], /Unicode/);
});
test('characters are codepoints, not UTF-8 bytes or whitespace-separated words', () => {
  const size = quality.measure(entry, `${header}汉字 Aé 😀\t\n`);
  assert.equal(size.characters, 5); assert.equal(size.lines, 1);
});
test('code blocks, tables and blank lines count toward the budget', () => {
  const content = header.replaceAll('\n', '\r\n') + '\r\n```\r\n字\r\n```\r\n| 表 |\r\n';
  const size = quality.measure(entry, content);
  assert.equal(size.lines, 5); assert.equal(size.characters, 10);
});
test('references do not consume the entry budget', (t) => {
  const root = temporary(t); write(path.join(root, entry), valid);
  write(path.join(root, path.dirname(entry), 'references/method.md'), '完整方法\n'.repeat(10_000));
  const { failures, sizes } = quality.check(root);
  assert.deepEqual(failures, []); assert.equal(sizes.length, 1);
});
test('an invalid body boundary is an error instead of zero length', () => {
  const failures = quality.entryIssues(entry, '# 缺少头部\n');
  assert.ok(failures.length > 0); assert.match(failures[0], /frontmatter/);
});

test('full checks discover nested Node tests without executing helpers or dependencies', (t) => {
  const root = temporary(t);
  for (const file of ['tests/install.test.mjs', 'tests/watch-pr/policy.test.mjs', 'tests/watch-pr/nested/render.test.js', 'tests/helpers.mjs', 'tests/watch-pr/node_modules/dependency.test.js']) write(path.join(root, file), '');
  assert.deepEqual(testFiles(root), ['tests/install.test.mjs', 'tests/watch-pr/nested/render.test.js', 'tests/watch-pr/policy.test.mjs'].map((filename) => filename.split('/').join(path.sep)));
});

test('test discovery rejects symlinks instead of walking outside the snapshot', (t) => {
  const root = temporary(t); const outside = temporary(t);
  write(path.join(root, 'tests/valid.test.mjs'), '');
  try { fs.symlinkSync(outside, path.join(root, 'tests/external'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('This environment cannot create directory symlinks'); return; } throw error; }
  assert.throws(() => testFiles(root), /符号链接/);
});

class GitFixture {
  constructor(t) {
    this.base = temporary(t, 'skills-wta gate-');
    this.root = path.join(this.base, 'repository');
    fs.mkdirSync(this.root);
    this.environment = isolatedGitEnvironment(path.join(this.base, 'git-config'));
    this.entry = write(path.join(this.root, entry), valid);
    for (const filename of [
      'install.mjs', 'scripts/check.mjs', 'scripts/check-skill-quality.mjs',
      'scripts/validate.mjs', 'scripts/validate-materials.mjs', 'scripts/install-hooks.mjs',
      '.githooks/pre-commit', '.githooks/pre-push', '.githooks/run-check.mjs',
    ]) {
      const target = path.join(this.root, filename); fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(repositoryRoot, filename), target);
    }
    write(path.join(this.root, 'LICENSE'), '测试许可\n');
    for (const name of licenseBundleFiles) write(path.join(this.root, 'licenses', name), '测试许可\n');
    const original = Buffer.from('# Source\n'); const translation = Buffer.from('# 完整中文资料\n');
    write(path.join(this.root, 'materials/a001/original.txt'), original);
    write(path.join(this.root, 'materials/a001/zh-CN.txt'), translation);
    const hash = (algorithm, value) => createHash(algorithm).update(value).digest('hex');
    saveTsv(path.join(this.root, 'materials/manifest.tsv'), {
      id: 'a001', kind: 'document', source_group: 'example', source_path: 'example.md',
      source_git_blob: hash('sha1', Buffer.concat([Buffer.from(`blob ${original.length}\0`), original])),
      original_sha256: hash('sha256', original), translation_sha256: hash('sha256', translation),
      runtime_paths: entry, adaptation: '完整本地示例。',
    });
    this.git(['init', '--quiet']); this.git(['symbolic-ref', 'HEAD', 'refs/heads/main']);
    this.git(['config', 'user.name', 'Quality Check']); this.git(['config', 'user.email', 'quality@example.invalid']);
    this.git(['config', 'commit.gpgsign', 'false']); this.git(['config', 'tag.gpgsign', 'false']);
    this.git(['add', '.']); this.git(['commit', '--quiet', '-m', 'valid fixture']);
    this.originalCommit = this.git(['rev-parse', 'HEAD']).stdout.trim();
  }
  run(executable, args, { input, expected = 0 } = {}) {
    const result = command(executable, args, { cwd: this.root, env: this.environment, input });
    if (expected !== null) assert.equal(result.status, expected, result.stdout + result.stderr);
    return result;
  }
  git(args, options) { return this.run('git', args, options); }
  gate(args, options) { return this.run(process.execPath, [path.join(repositoryRoot, 'scripts/check.mjs'), '--root', this.root, ...args], options); }
  installHooks(expected = 0) { return this.run(process.execPath, [path.join(repositoryRoot, 'scripts/install-hooks.mjs'), '--root', this.root], { expected }); }
  badBranch() {
    this.git(['checkout', '--quiet', '-b', 'oversized']); write(this.entry, oversized);
    this.git(['add', entry]); this.git(['commit', '--quiet', '-m', 'oversized fixture']);
    const commit = this.git(['rev-parse', 'HEAD']).stdout.trim();
    this.git(['checkout', '--quiet', 'main']); return commit;
  }
}

function scenario(name, run, options = {}) {
  test(name, options, (t) => {
    let availability;
    try { availability = command('git', ['--version']); }
    catch (error) { if (error.code === 'ENOENT') { t.skip('Git is required for snapshot checks'); return; } throw error; }
    if (availability.status !== 0) { t.skip('Git is required for snapshot checks'); return; }
    run(new GitFixture(t));
  });
}

scenario('Git config isolation uses real empty files on every platform', (f) => {
  for (const [scope, key] of [['--global', 'GIT_CONFIG_GLOBAL'], ['--system', 'GIT_CONFIG_SYSTEM']]) {
    assert.ok(fs.lstatSync(f.environment[key]).isFile());
    assert.equal(fs.readFileSync(f.environment[key], 'utf8'), '');
    assert.equal(f.git(['config', scope, '--list']).stdout, '');
  }
});

scenario('the package validator also enforces the character budget', (f) => {
  write(f.entry, oversized);
  const result = f.run(process.execPath, ['scripts/validate.mjs'], { expected: 1 });
  assert.match(result.stderr, /12001/);
});
scenario('a staged error cannot be hidden by a fixed worktree', (f) => {
  write(f.entry, oversized); f.git(['add', entry]);
  const before = f.git(['ls-files', '--stage']).stdout; write(f.entry, valid);
  assert.match(f.gate(['--staged'], { expected: 1 }).stderr, /12001/);
  assert.equal(fs.readFileSync(f.entry, 'utf8'), valid); assert.equal(f.git(['ls-files', '--stage']).stdout, before);
});
scenario('a valid index is not replaced by invalid unstaged content', (f) => {
  write(f.entry, oversized); f.gate(['--staged']); assert.equal(fs.readFileSync(f.entry, 'utf8'), oversized);
});
scenario('export-ignore cannot hide an invalid staged skill', (f) => {
  write(f.entry, oversized); write(path.join(f.root, '.gitattributes'), 'skills/** export-ignore\n');
  f.git(['add', entry, '.gitattributes']); assert.match(f.gate(['--staged'], { expected: 1 }).stderr, /12001/);
});
scenario('pre-push checks the other branch being pushed', (f) => {
  const commit = f.badBranch();
  const result = f.gate(['--pre-push'], { input: `refs/heads/oversized ${commit} refs/heads/main ${zeroId}\n`, expected: 1 });
  assert.ok(result.stdout.includes(commit)); assert.match(result.stderr, /12001/);
  assert.equal(f.git(['rev-parse', 'HEAD']).stdout.trim(), f.originalCommit);
});
scenario('revision and push checks ignore uncommitted changes', (f) => {
  write(f.entry, oversized); f.gate(['--revision', 'HEAD']);
  f.gate(['--pre-push'], { input: `refs/heads/main ${f.originalCommit} refs/heads/main ${zeroId}\n` });
});
scenario('every distinct push target is checked', (f) => {
  const commit = f.badBranch();
  const input = `refs/heads/main ${f.originalCommit} refs/heads/main ${zeroId}\nrefs/heads/oversized ${commit} refs/heads/oversized ${zeroId}\n`;
  const result = f.gate(['--pre-push'], { input, expected: 1 });
  assert.ok(result.stdout.includes(f.originalCommit)); assert.ok(result.stdout.includes(commit));
});
scenario('annotated tags are peeled to their actual commit', (f) => {
  const commit = f.badBranch(); f.git(['tag', '-a', 'candidate', '-m', 'candidate', commit]);
  const tag = f.git(['rev-parse', 'candidate']).stdout.trim(); assert.notEqual(tag, commit);
  const result = f.gate(['--pre-push'], { input: `refs/tags/candidate ${tag} refs/tags/candidate ${zeroId}\n`, expected: 1 });
  assert.ok(result.stdout.includes(commit));
});
scenario('delete-only pushes have no file contents to validate', (f) => {
  f.gate(['--pre-push'], { input: `(delete) ${zeroId} refs/heads/old ${f.originalCommit}\n` });
});
scenario('invalid pre-push input is not silently skipped', (f) => {
  f.gate(['--pre-push'], { input: 'not a git update\n', expected: 1 });
});
scenario('an unresolved index is rejected without altering its conflict', (f) => {
  f.git(['checkout', '--quiet', '-b', 'side']); write(f.entry, `${header}分支甲\n`);
  f.git(['add', entry]); f.git(['commit', '--quiet', '-m', 'side']);
  f.git(['checkout', '--quiet', 'main']); write(f.entry, `${header}分支乙\n`);
  f.git(['add', entry]); f.git(['commit', '--quiet', '-m', 'main']); f.git(['merge', 'side'], { expected: 1 });
  const before = f.git(['ls-files', '--unmerged']).stdout; assert.ok(before.length > 0);
  f.gate(['--staged'], { expected: 1 }); assert.equal(f.git(['ls-files', '--unmerged']).stdout, before);
});
scenario('snapshot inspection does not follow a staged symlink', (f) => {
  const objectId = f.git(['hash-object', '-w', '--stdin'], { input: '../outside' }).stdout.trim();
  f.git(['update-index', '--add', '--cacheinfo', `120000,${objectId},shortcut`]);
  assert.match(f.gate(['--staged'], { expected: 1 }).stderr, /符号链接/);
});
scenario('existing hook configuration is preserved', (f) => {
  f.git(['config', 'core.hooksPath', 'my-hooks']); f.installHooks(1);
  assert.equal(f.git(['config', '--get', 'core.hooksPath']).stdout.trim(), 'my-hooks');
});
scenario('existing default hooks are not disabled', (f) => {
  const existing = write(path.join(f.root, '.git/hooks/pre-commit'), '#!/usr/bin/env node\nprocess.exit(0);\n');
  f.installHooks(1); assert.equal(fs.readFileSync(existing, 'utf8'), '#!/usr/bin/env node\nprocess.exit(0);\n');
  f.git(['config', '--get', 'core.hooksPath'], { expected: 1 });
});
scenario('hook installation is explicit and idempotent', (f) => {
  f.git(['config', '--get', 'core.hooksPath'], { expected: 1 }); f.installHooks(); f.installHooks();
  assert.equal(f.git(['config', '--get', 'core.hooksPath']).stdout.trim(), '.githooks');
});
scenario('reinstall repairs missing execute bits on our hooks', (f) => {
  f.installHooks(); const hook = path.join(f.root, '.githooks/pre-commit'); fs.chmodSync(hook, 0o644);
  f.installHooks(); assert.ok(fs.statSync(hook).mode & 0o111);
}, { skip: process.platform === 'win32' ? 'POSIX executable bits do not apply on Windows' : false });
scenario('a real Git commit is blocked when its staged entry is invalid', (f) => {
  f.installHooks(); write(f.entry, oversized); f.git(['add', entry]); write(f.entry, valid);
  const result = f.git(['commit', '--quiet', '-m', 'must be blocked'], { expected: null });
  assert.notEqual(result.status, 0, result.stdout + result.stderr); assert.match(result.stdout + result.stderr, /12001/);
  assert.equal(f.git(['rev-parse', 'HEAD']).stdout.trim(), f.originalCommit);
});
scenario('a real non-HEAD push is blocked before a local remote ref is created', (f) => {
  const commit = f.badBranch(); const remote = path.join(f.base, 'remote.git');
  f.git(['init', '--quiet', '--bare', remote]); f.git(['remote', 'add', 'origin', remote]); f.installHooks();
  const result = f.git(['push', 'origin', 'oversized:main'], { expected: null });
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.ok((result.stdout + result.stderr).includes(commit)); assert.match(result.stdout + result.stderr, /12001/);
  f.git(['-C', remote, 'show-ref', '--verify', '--quiet', 'refs/heads/main'], { expected: 1 });
});
