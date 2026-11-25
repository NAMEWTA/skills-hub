import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { normalizeRemote, readRegistry, readLocalPaths, selectRepos, inspectCheckout, routeRepo, resolveReference } from '../skills/home/home-route/scripts/route.mjs';

const script = fileURLToPath(new URL('../skills/home/home-route/scripts/route.mjs', import.meta.url));
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'home-route-')); const home = path.join(root, '个人 Home'); fs.mkdirSync(home);
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  function repo(name, remote = 'https://one.example.invalid/team/project-a.git') {
    const cwd = path.join(root, name); fs.mkdirSync(cwd); git(cwd, 'init', '-b', 'main'); git(cwd, 'config', 'user.name', 'Fixture'); git(cwd, 'config', 'user.email', 'fixture@example.invalid'); git(cwd, 'config', 'core.autocrlf', 'false');
    fs.writeFileSync(path.join(cwd, 'AGENTS.md'), '# 项目当地规则\n'); git(cwd, 'add', 'AGENTS.md'); git(cwd, 'commit', '-m', 'fixture'); if (remote) git(cwd, 'remote', 'add', 'origin', remote);
    return cwd;
  }
  const entry = (cwd, remote = 'https://one.example.invalid/team/project-a.git') => ({ id: 'project-a', purpose: '项目背景', aliases: ['项目甲'], groups: ['组合'], remote, localPath: path.relative(home, cwd), intent: 'work' });
  return { root, home, git, repo, entry };
}
function symlink(t, source, target, type = 'dir') {
  try { fs.symlinkSync(source, target, type); return true; }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('本环境不能建立符号链接'); return false; } throw error; }
}

test('remote identity preserves host, owner, path case, aliases and nonstandard ports without exposing secrets', () => {
  const ordinary = normalizeRemote('https://github.com/Team/repo.git').identity;
  assert.equal(normalizeRemote('git@github.com:Team/repo.git').identity, ordinary);
  assert.equal(normalizeRemote('ssh://git@github.com:22/Team/repo.git').identity, ordinary);
  for (const other of ['https://two.example.invalid/Team/repo.git', 'https://one.example.invalid/Fork/repo.git', 'https://one.example.invalid/team/repo.git', 'git@ssh-alias:Team/repo.git', 'ssh://git@one.example.invalid:2222/Team/repo.git']) assert.notEqual(normalizeRemote(other).identity, ordinary);
  assert.throws(() => normalizeRemote('https://credential@one.example.invalid/Team/repo.git'), { code: 'SECRET_REMOTE' });
  assert.throws(() => normalizeRemote('ssh://git:secret@one.example.invalid/Team/repo.git'), { code: 'SECRET_REMOTE' });
});

test('unknown SSH servers retain user namespaces and relative versus absolute paths', t => {
  const { home, repo, entry } = fixture(t);
  const alice = 'alice@git.internal:project.git';
  const bob = 'bob@git.internal:project.git';
  const project = repo('wrong-user', bob);
  assert.notEqual(normalizeRemote(alice).identity, normalizeRemote(bob).identity);
  assert.throws(() => routeRepo(home, entry(project, alice)), { code: 'IDENTITY_CONFLICT' });
  assert.equal(routeRepo(home, entry(project, bob)).status, 'resolved');
  assert.notEqual(normalizeRemote(alice).identity, normalizeRemote('ssh://alice@git.internal/project.git').identity);
  assert.equal(normalizeRemote('alice@git.internal:/project.git').identity, normalizeRemote('ssh://alice@git.internal/project.git').identity);
  assert.notEqual(normalizeRemote('git@git.internal:team/project.git').identity, normalizeRemote('https://git.internal/team/project.git').identity);
  assert.notEqual(normalizeRemote('alice@github.com:Team/repo.git').identity, normalizeRemote('https://github.com/Team/repo.git').identity);
});

test('Unicode paths resolve without modifying dirty files, index or HEAD and context remains unread', t => {
  const { home, git, repo, entry } = fixture(t); const project = repo('项目 甲');
  fs.writeFileSync(path.join(project, 'AGENTS.md'), '# 用户尚未提交的指导\n'); const index = fs.readFileSync(path.join(project, '.git/index')); const head = git(project, 'rev-parse', 'HEAD');
  const result = routeRepo(home, entry(project));
  assert.equal(result.actualCheckout, fs.realpathSync(project)); assert.equal(result.homeRoot, fs.realpathSync(home)); assert.equal(result.dirty, true); assert.equal(result.contextRead, false); assert.equal(result.head, head);
  assert.deepEqual(fs.readFileSync(path.join(project, '.git/index')), index); assert.equal(fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8'), '# 用户尚未提交的指导\n');
});

test('fork origin plus parent cannot satisfy parent registry identity; differing hosts also conflict', t => {
  const { home, git, repo, entry } = fixture(t); const project = repo('fork', 'https://one.example.invalid/fork/project-a.git');
  git(project, 'remote', 'add', 'parent', 'https://one.example.invalid/team/project-a.git');
  assert.throws(() => routeRepo(home, entry(project)), { code: 'IDENTITY_CONFLICT' });
  assert.equal(routeRepo(home, entry(project, 'https://one.example.invalid/fork/project-a.git')).identityEvidence.selection, 'origin');
  git(project, 'remote', 'set-url', 'origin', 'https://two.example.invalid/team/project-a.git');
  assert.throws(() => routeRepo(home, entry(project)), { code: 'IDENTITY_CONFLICT' });
  const cli = spawnSync(process.execPath, [script, '--inspect', project, '--expected-remote', 'https://one.example.invalid/team/project-a.git'], { encoding: 'utf8' });
  assert.equal(cli.status, 2); assert.match(cli.stderr, /IDENTITY_CONFLICT/);
});

test('without origin the configured remotes must identify one unambiguous repository', t => {
  const { home, git, repo, entry } = fixture(t); const project = repo('项目甲'); git(project, 'remote', 'rename', 'origin', 'central');
  assert.equal(routeRepo(home, entry(project)).identityEvidence.selection, 'unambiguous-remotes');
  git(project, 'remote', 'add', 'other', 'https://other.example.invalid/team/project-a.git');
  assert.throws(() => routeRepo(home, entry(project)), { code: 'IDENTITY_CONFLICT' });
});

test('file-form worktrees, nested checkout and explicit local path choice retain actual identity', t => {
  const { root, home, git, repo, entry } = fixture(t); const project = repo('项目甲'); const worktree = path.join(home, '内嵌 worktree');
  git(project, 'worktree', 'add', '-b', 'feature', worktree); assert.equal(fs.lstatSync(path.join(worktree, '.git')).isFile(), true);
  const result = routeRepo(home, entry(project), { checkout: worktree, localPaths: { 'project-a': path.join(root, '不使用的路径') }, reference: 'AGENTS.md' });
  assert.equal(result.isLinkedWorktree, true); assert.equal(result.pathSource, 'explicit-checkout'); assert.equal(result.reference.contentsRead, false); assert.equal(result.entries.skillsDirectory, false);
  const local = routeRepo(home, entry(project), { localPaths: { 'project-a': worktree } }); assert.equal(local.pathSource, 'local-path-override'); assert.equal(local.actualCheckout, fs.realpathSync(worktree));
});

test('local-only alternate checkouts require the same Git common directory', t => {
  const { root, home, git, repo, entry } = fixture(t); const project = repo('本地甲', ''); const unrelated = repo('本地乙', ''); const worktree = path.join(root, '本地 工作树');
  git(project, 'worktree', 'add', '-b', 'feature', worktree);
  assert.equal(routeRepo(home, entry(project, ''), { checkout: worktree }).identityEvidence.type, 'local-only');
  assert.throws(() => routeRepo(home, entry(project, ''), { checkout: unrelated }), { code: 'IDENTITY_CONFLICT' });
});

test('exact IDs precede alias collisions while explicit groups preserve every matching repository', () => {
  const value = { repos: [{ id: 'a', aliases: ['共享'], groups: ['产品'] }, { id: 'b', aliases: ['共享', 'a'], groups: ['产品'] }] };
  assert.deepEqual(selectRepos(value, 'a').map(repo => repo.id), ['a']); assert.equal(selectRepos(value, '共享').length, 2); assert.equal(selectRepos(value, '产品', { group: true }).length, 2); assert.equal(selectRepos(value, '不存在').length, 0);
});

test('Home registration readers reject linked parents, files and invalid local configuration', t => {
  const { root, home, repo, entry } = fixture(t); const project = repo('项目甲'); const directory = path.join(home, '.agents/home'); fs.mkdirSync(directory, { recursive: true });
  const registry = { formatVersion: 1, repos: [entry(project)] }; fs.writeFileSync(path.join(directory, 'repos.json'), JSON.stringify(registry));
  assert.equal(readRegistry(home).repos.length, 1); assert.deepEqual(readLocalPaths(home, registry), {});
  for (const value of [null, false, { formatVersion: 1, paths: {}, defaultTool: 'invented' }, { formatVersion: 1, paths: { missing: '/other' } }]) { fs.writeFileSync(path.join(directory, 'local.json'), JSON.stringify(value)); assert.throws(() => readLocalPaths(home, registry)); }
  fs.unlinkSync(path.join(directory, 'local.json')); const external = path.join(root, 'external.json'); fs.writeFileSync(external, JSON.stringify(registry)); fs.unlinkSync(path.join(directory, 'repos.json'));
  if (!symlink(t, external, path.join(directory, 'repos.json'), 'file')) return;
  assert.throws(() => readRegistry(home), { code: 'UNSAFE_FILE' }); fs.unlinkSync(path.join(directory, 'repos.json'));
  fs.rmdirSync(directory); if (!symlink(t, project, directory)) return;
  assert.throws(() => readRegistry(home), { code: 'UNSAFE_HOME' });
});

test('project references reject traversal and aliases outside checkout without reading target content', t => {
  const { root, repo } = fixture(t); const project = repo('项目甲'); const outside = path.join(root, '外部知识'); fs.mkdirSync(outside); fs.writeFileSync(path.join(outside, 'secret.md'), '不得读取的项目知识');
  assert.throws(() => resolveReference(project, '../外部知识/secret.md'), { code: 'INVALID_REFERENCE' });
  if (!symlink(t, outside, path.join(project, 'outside'))) return;
  assert.throws(() => resolveReference(project, 'outside/secret.md'), { code: 'REFERENCE_ESCAPE' });
  assert.equal(resolveReference(project, 'missing.md').exists, false); assert.equal(inspectCheckout(project).entries.agentsFile, true);
});
