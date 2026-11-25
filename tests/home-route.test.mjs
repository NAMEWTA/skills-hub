import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { normalizeRemote, readRegistry, readLocalPaths, selectRepos, inspectCheckout, routeRepo, resolveReference } from '../skills/home/home-route/scripts/route.mjs';
import { inspectRegistry, saveRegistry } from '../skills/home/home-setup/scripts/registry.mjs';

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
  const entryV2 = (cwd, primaryRemote = undefined) => {
    const observed = inspectCheckout(cwd); const { remote, ...base } = entry(cwd);
    const localPath = base.localPath.split(path.sep).join('/');
    return { ...base, localPath: localPath.startsWith('../') ? localPath : `./${localPath}`, remotes: observed.remotes, primaryRemote: primaryRemote === undefined ? observed.suggestedPrimaryRemote : primaryRemote };
  };
  return { root, home, git, repo, entry, entryV2 };
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
  assert.equal(result.actualCheckout, fs.realpathSync.native(project)); assert.equal(result.homeRoot, fs.realpathSync.native(home)); assert.equal(result.dirty, true); assert.equal(result.contextRead, false); assert.equal(result.head, head);
  assert.equal(result.realPath, result.actualCheckout); assert.equal(result.requestedPathIsGitRoot, true);
  const nested = path.join(project, '内部目录'); fs.mkdirSync(nested);
  const nestedResult = inspectCheckout(nested); assert.equal(nestedResult.requestedPathIsGitRoot, false); assert.equal(nestedResult.actualCheckout, result.actualCheckout);
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
  assert.equal(result.requestedPathIsGitRoot, true); assert.equal(result.realPath, result.actualCheckout); assert.equal(result.reference.realTarget, fs.realpathSync.native(path.join(worktree, 'AGENTS.md')));
  const local = routeRepo(home, entry(project), { localPaths: { 'project-a': worktree } }); assert.equal(local.pathSource, 'local-path-override'); assert.equal(local.actualCheckout, fs.realpathSync.native(worktree)); assert.equal(local.requestedPathIsGitRoot, true);
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
  assert.equal(resolveReference(project, 'AGENTS.md').realTarget, fs.realpathSync.native(path.join(project, 'AGENTS.md')));
  if (!symlink(t, outside, path.join(project, 'outside'))) return;
  assert.throws(() => resolveReference(project, 'outside/secret.md'), { code: 'REFERENCE_ESCAPE' });
  assert.equal(resolveReference(project, 'missing.md').exists, false); assert.equal(inspectCheckout(project).entries.agentsFile, true);
});

test('v2 registration round-trips named remotes, ordered URLs and explicit push URLs with real Git', t => {
  const { home, git, repo, entryV2 } = fixture(t); const project = repo('项目甲');
  git(project, 'remote', 'add', 'mirror', 'ssh://git@mirror.example.invalid/team/project-a.git');
  git(project, 'config', '--add', 'remote.origin.url', 'https://backup.example.invalid/team/project-a.git');
  git(project, 'config', '--add', 'remote.origin.pushurl', 'ssh://git@push.example.invalid/team/project-a.git');
  const input = { formatVersion: 2, repos: [entryV2(project)] };
  const origin = input.repos[0].remotes.find(remote => remote.name === 'origin');
  assert.deepEqual(origin.urls, ['https://one.example.invalid/team/project-a.git', 'https://backup.example.invalid/team/project-a.git']);
  assert.deepEqual(origin.pushUrls, ['ssh://git@push.example.invalid/team/project-a.git']);
  assert.equal(input.repos[0].primaryRemote, 'origin');
  saveRegistry(home, input, { expectedRevision: 'absent' });
  const loaded = readRegistry(home); assert.deepEqual(loaded, input);
  const routed = routeRepo(home, loaded.repos[0]);
  assert.equal(routed.status, 'resolved'); assert.equal(routed.identityEvidence.selection, 'primary-remote'); assert.equal(routed.identityEvidence.fetchUrlIndex, 0); assert.equal(routed.registryMatches, true); assert.deepEqual(routed.remoteDrift, []);
  assert.equal(fs.existsSync(path.join(home, '.agents/home/repos.md')), false);
  const index = fs.readFileSync(path.join(project, '.git/index')); routeRepo(home, loaded.repos[0]); assert.deepEqual(fs.readFileSync(path.join(project, '.git/index')), index);
});

test('a v2 primary fetch identity cannot be substituted by mirror, a later URL or a push URL', t => {
  const { home, git, repo, entryV2 } = fixture(t); const project = repo('fork');
  const correct = 'https://one.example.invalid/team/project-a.git';
  git(project, 'remote', 'add', 'mirror', correct); git(project, 'config', '--add', 'remote.origin.pushurl', correct);
  const registered = entryV2(project);
  git(project, 'remote', 'set-url', 'origin', 'https://one.example.invalid/fork/project-a.git');
  git(project, 'config', '--add', 'remote.origin.url', correct);
  assert.throws(() => routeRepo(home, registered), { code: 'IDENTITY_CONFLICT' });
  git(project, 'remote', 'remove', 'origin');
  assert.throws(() => routeRepo(home, registered), { code: 'IDENTITY_CONFLICT' });
});

test('without origin v2 needs an explicit primary and reports additional remote drift separately', t => {
  const { home, git, repo, entryV2 } = fixture(t); const project = repo('多远端');
  git(project, 'remote', 'rename', 'origin', 'central'); git(project, 'remote', 'add', 'mirror', 'https://mirror.example.invalid/team/project-a.git');
  assert.equal(inspectCheckout(project).suggestedPrimaryRemote, null);
  assert.throws(() => routeRepo(home, entryV2(project)), { code: 'INVALID_PRIMARY_REMOTE' });
  const registered = entryV2(project, 'central'); assert.equal(routeRepo(home, registered).registryMatches, true);
  git(project, 'remote', 'set-url', 'mirror', 'https://new-mirror.example.invalid/team/project-a.git');
  git(project, 'config', '--add', 'remote.central.pushurl', 'https://push.example.invalid/team/project-a.git');
  git(project, 'remote', 'add', 'extra', 'https://extra.example.invalid/team/project-a.git');
  let result = routeRepo(home, registered); assert.equal(result.status, 'resolved'); assert.equal(result.registryMatches, false);
  assert.deepEqual(result.remoteDrift.map(item => [item.name, item.change]), [['central', 'changed'], ['extra', 'added'], ['mirror', 'changed']]);
  git(project, 'remote', 'remove', 'mirror'); result = routeRepo(home, registered);
  assert.equal(result.remoteDrift.find(item => item.name === 'mirror').change, 'removed');
});

test('v1 bare paths still resolve without rewriting while v2 supports nested paths, local overrides and local-only worktrees', t => {
  const { root, home, git, repo, entry, entryV2 } = fixture(t); const project = repo('个人 Home/项目甲');
  const directory = path.join(home, '.agents/home'); fs.mkdirSync(directory, { recursive: true });
  const legacy = { formatVersion: 1, repos: [entry(project)] }; const text = JSON.stringify(legacy); fs.writeFileSync(path.join(directory, 'repos.json'), text);
  assert.equal(legacy.repos[0].localPath, '项目甲');
  const result = routeRepo(home, readRegistry(home).repos[0]); assert.equal(result.actualCheckout, fs.realpathSync.native(project)); assert.equal(result.registryMatches, null); assert.equal(fs.readFileSync(path.join(directory, 'repos.json'), 'utf8'), text);
  const modern = entryV2(project); assert.equal(modern.localPath, './项目甲');
  saveRegistry(home, { formatVersion: 2, repos: [modern] }, { expectedRevision: inspectRegistry(home).registryRevision });
  assert.equal(routeRepo(home, readRegistry(home).repos[0], { localPaths: { 'project-a': project } }).pathSource, 'local-path-override');
  const local = repo('本地仓', ''), worktree = path.join(root, '本地 worktree'); git(local, 'worktree', 'add', '-b', 'other', worktree);
  const localEntry = entryV2(local); assert.deepEqual(localEntry.remotes, []); assert.equal(localEntry.primaryRemote, null);
  assert.equal(routeRepo(home, localEntry, { checkout: worktree }).identityEvidence.type, 'local-only');
});

test('inspection never prints secret fetch or push URLs', t => {
  const { git, repo } = fixture(t); const project = repo('含秘密');
  git(project, 'config', '--add', 'remote.origin.pushurl', 'https://do-not-print@example.invalid/repo.git');
  const cli = spawnSync(process.execPath, [script, '--inspect', project], { encoding: 'utf8' });
  assert.equal(cli.status, 2); assert.match(cli.stderr, /SECRET_REMOTE/); assert.doesNotMatch(cli.stdout + cli.stderr, /do-not-print/);
});

test('Git insteadOf rewrites are checked against the effective primary fetch identity without losing configured URLs', t => {
  const { home, git, repo, entry, entryV2 } = fixture(t);
  const url = 'https://github.com/expected/project.git'; const project = repo('rewrite', url);
  const registered = entryV2(project);
  git(project, 'config', 'url.https://other.example.invalid/fork/.insteadOf', 'https://github.com/expected/');
  assert.equal(git(project, 'remote', 'get-url', 'origin'), 'https://other.example.invalid/fork/project.git');
  assert.throws(() => routeRepo(home, registered), { code: 'IDENTITY_CONFLICT' });
  assert.throws(() => routeRepo(home, entry(project, url)), { code: 'IDENTITY_CONFLICT' });
  git(project, 'config', '--unset', 'url.https://other.example.invalid/fork/.insteadOf');
  git(project, 'config', 'url.git@github.com:.insteadOf', 'https://github.com/');
  const inspected = inspectCheckout(project); assert.deepEqual(inspected.remotes[0].urls, [url]);
  assert.equal(inspected.effectiveFetchUrls[0].url, 'git@github.com:expected/project.git');
  assert.equal(routeRepo(home, registered).registryMatches, true);
  git(project, 'config', '--unset', 'url.git@github.com:.insteadOf');
  git(project, 'config', 'url.https://hidden-credential@other.example.invalid/.insteadOf', 'https://github.com/');
  const cli = spawnSync(process.execPath, [script, '--inspect', project], { encoding: 'utf8' });
  assert.equal(cli.status, 2); assert.match(cli.stderr, /SECRET_REMOTE/); assert.doesNotMatch(cli.stdout + cli.stderr, /hidden-credential/);
});
