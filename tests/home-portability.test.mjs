import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { applyScope, initGit, inspectGit } from '../skills/home/home-setup/scripts/git.mjs';

const installer = fileURLToPath(new URL('../install.mjs', import.meta.url));
const gitTool = fileURLToPath(new URL('../skills/home/home-setup/scripts/git.mjs', import.meta.url));
const topic = '2026-11-26-portable';

function fixture(t) {
  const root = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'home-portable-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function run(cwd, executable, args, status = 0, environment = {}) {
  const result = spawnSync(executable, args, { cwd, env: { ...process.env, ...environment }, encoding: 'utf8', timeout: 90_000 });
  assert.ifError(result.error);
  assert.equal(result.status, status, `${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

const git = (cwd, ...args) => run(cwd, 'git', args).trim();
const tool = (home, script, args, status = 0, env) => JSON.parse(run(home, process.execPath, [path.join(home, '.agents/skills', script), ...args], status, env));
const homeGit = (home, ...args) => tool(home, 'home-setup/scripts/git.mjs', args);

function write(root, relative, content) {
  const filename = path.join(root, relative);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, content);
  return filename;
}

function project(root, name) {
  const cwd = path.join(root, name);
  fs.mkdirSync(cwd);
  git(cwd, 'init', '-b', 'stable');
  write(cwd, 'project.md', `# ${name}\n`);
  git(cwd, 'add', 'project.md');
  git(cwd, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'fixture');
  return cwd;
}

test('git initialization preserves custom rules, embedded worktrees and a deliberately empty outer index', t => {
  const home = fixture(t);
  const originalRules = '# 用户规则\r\n/.agents/home/private.md\r\n';
  write(home, '.gitignore', originalRules);
  write(home, 'AGENTS.md', '# Home\n');
  write(home, '.agents/home/notes/plan.md', '# 已核实的计划\n');
  write(home, '.agents/home/private.md', '# 本机手记\n');
  write(home, '.agents/ops/projects/example/env.md', '# 应忽略的本机文件\n');
  write(home, '.agents/ops/projects/example/notes.md', '# 应跟踪的正式文档\n');
  write(home, '.agents/skills/example/assets/illustration.png', 'runtime asset');
  write(home, '.agents/home/capture.png', 'raw capture');
  write(home, 'temp/home/run.log', 'raw log');
  write(home, '.agents/home/local.json', '{}');
  const child = project(home, '未登记 项目');
  const worktree = path.join(home, '关联 工作树');
  git(child, 'worktree', 'add', '-b', 'alternate', worktree);
  const childIndex = fs.readFileSync(path.join(child, '.git/index'));
  const childHead = git(child, 'rev-parse', 'HEAD');
  const before = inspectGit(home);
  assert.equal(before.status, 'absent');
  assert.equal(fs.existsSync(path.join(home, '.git')), false);
  assert.throws(() => initGit(home, 'absent'), { code: 'STALE_IGNORE' });
  const initialized = initGit(home, before.ignoreRevision);
  assert.equal(initialized.status, 'ready');
  assert.equal(initialized.head, null);
  assert.deepEqual(initialized.tracked, []);
  assert.deepEqual(initialized.trackable, ['.agents/home/notes/plan.md', '.agents/ops/projects/example/notes.md', '.agents/skills/example/assets/illustration.png', '.gitignore', 'AGENTS.md']);
  assert.equal(initialized.ignoredFiles[0].path, '.agents/home/private.md');
  const rules = fs.readFileSync(path.join(home, '.gitignore'), 'utf8');
  assert.ok(rules.endsWith(originalRules));
  assert.deepEqual(initGit(home, initialized.ignoreRevision), initialized);
  assert.equal(fs.readFileSync(path.join(home, '.gitignore'), 'utf8'), rules);
  assert.equal(git(child, 'rev-parse', 'HEAD'), childHead);
  assert.deepEqual(fs.readFileSync(path.join(child, '.git/index')), childIndex);
  assert.equal(git(worktree, 'branch', '--show-current'), 'alternate');
});

test('ancestor and embedded Git roots are refused, while existing scope conflicts are reported without index or rule writes', t => {
  const root = fixture(t);
  const parent = project(root, 'ancestor');
  const nested = path.join(parent, 'home');
  fs.mkdirSync(nested);
  assert.equal(inspectGit(nested).status, 'ancestor');
  assert.throws(() => initGit(nested, 'absent'), { code: 'ANCESTOR_REPO' });
  assert.throws(() => applyScope(nested, 'absent'), { code: 'ANCESTOR_REPO' });
  assert.equal(fs.existsSync(path.join(nested, '.git')), false);
  const boundary = path.join(root, 'boundary');
  write(boundary, '.agents/home/notes.md', '# Home\n');
  project(path.join(boundary, '.agents/home'), 'subrepo');
  assert.throws(() => initGit(boundary, 'absent'), { code: 'HOME_BOUNDARY' });
  assert.throws(() => applyScope(boundary, 'absent'), { code: 'GIT_REQUIRED' });
  assert.equal(fs.existsSync(path.join(boundary, '.gitignore')), false);

  const home = path.join(root, 'scope');
  write(home, '.gitignore', '!/temp/\n');
  write(home, 'temp/home/log.md', 'transient\n');
  const initialized = initGit(home, inspectGit(home).ignoreRevision);
  assert.equal(initialized.status, 'conflict');
  assert.deepEqual(initialized.exposed, ['temp/']);
  git(home, 'add', 'temp/home/log.md');
  const index = fs.readFileSync(path.join(home, '.git/index'));
  const ignore = fs.readFileSync(path.join(home, '.gitignore'));
  const checked = initGit(home, initialized.ignoreRevision);
  assert.deepEqual(checked.trackedOutside.map(item => item.path), ['temp/home/log.md']);
  assert.deepEqual(fs.readFileSync(path.join(home, '.git/index')), index);
  assert.deepEqual(fs.readFileSync(path.join(home, '.gitignore')), ignore);
});

test('apply-scope hides embedded projects in an existing Home with an empty index', t => {
  const home = fixture(t);
  git(home, 'init', '-b', 'existing-home');
  const originalRules = '# 用户规则\r\n/temp/\r\n';
  const ignoreFile = write(home, '.gitignore', originalRules);
  const registryPath = '.agents/home/repos.json';
  write(home, registryPath, '{"formatVersion":2,"repos":[]}\n');
  const projects = ['alpha', 'beta'].map(name => {
    const cwd = project(home, name);
    const indexFile = path.join(cwd, '.git/index');
    return { name, cwd, head: git(cwd, 'rev-parse', 'HEAD'), indexFile, index: fs.readFileSync(indexFile) };
  });
  write(projects[1].cwd, '.gitignore', '*\n');
  const before = inspectGit(home);
  assert.equal(before.ignoreState, 'unmanaged');
  const status = () => git(home, 'status', '--porcelain', '--untracked-files=normal').split('\n');
  const beforeStatus = status();
  for (const { name } of projects) {
    assert.ok(beforeStatus.includes(`?? ${name}/`));
    assert.ok(before.exposed.includes(`${name}/`));
  }
  assert.deepEqual(initGit(home, before.ignoreRevision), before);
  assert.equal(fs.readFileSync(ignoreFile, 'utf8'), originalRules);

  const applied = JSON.parse(run(home, process.execPath, [gitTool, 'apply-scope', '--home', '.', '--expect-ignore', before.ignoreRevision]));
  assert.equal(applied.status, 'ready');
  assert.equal(applied.ignoreState, 'managed');
  assert.deepEqual(applied.tracked, []);
  assert.deepEqual(applied.staged, []);
  assert.equal(applied.head, null);
  assert.ok(applied.trackable.includes(registryPath));
  assert.deepEqual(status(), ['?? .agents/', '?? .gitignore']);
  assert.equal(git(home, 'symbolic-ref', '--short', 'HEAD'), 'existing-home');
  for (const { cwd, head, indexFile, index } of projects) {
    assert.equal(git(cwd, 'rev-parse', 'HEAD'), head);
    assert.deepEqual(fs.readFileSync(indexFile), index);
  }
  const rules = fs.readFileSync(ignoreFile, 'utf8');
  assert.ok(rules.endsWith(originalRules));
  assert.throws(() => applyScope(home, before.ignoreRevision), { code: 'STALE_IGNORE' });
  assert.deepEqual(applyScope(home, applied.ignoreRevision), applied);
  assert.equal(fs.readFileSync(ignoreFile, 'utf8'), rules);
});

test('apply-scope reports custom rule and index conflicts in an existing Home', t => {
  const home = fixture(t);
  git(home, 'init', '-b', 'main');
  const ignoreFile = write(home, '.gitignore', '!/visible-project/\n');
  project(home, 'visible-project');
  project(home, 'staged-project');
  git(home, '-c', 'advice.addEmbeddedRepo=false', 'add', '--', 'staged-project');
  const indexFile = path.join(home, '.git/index');
  const index = fs.readFileSync(indexFile);
  const before = inspectGit(home);
  const applied = JSON.parse(run(home, process.execPath, [gitTool, 'apply-scope', '--home', '.', '--expect-ignore', before.ignoreRevision], 1));

  assert.equal(applied.status, 'conflict');
  assert.deepEqual(applied.exposed, ['visible-project/']);
  assert.equal(applied.exposedRules[0].rule, '!/visible-project/');
  assert.deepEqual(applied.trackedOutside, [{ mode: '160000', path: 'staged-project' }]);
  assert.ok(fs.readFileSync(ignoreFile, 'utf8').endsWith('!/visible-project/\n'));
  assert.deepEqual(fs.readFileSync(indexFile), index);
  assert.deepEqual(applyScope(home, applied.ignoreRevision), applied);
});

test('an init failure after writing ignore rules can be retried from the actual persisted revision', t => {
  const home = fixture(t);
  const failure = spawnSync(process.execPath, [gitTool, 'init', '--home', home, '--expect-ignore', 'absent'], {
    encoding: 'utf8', env: { ...process.env, GIT_DEFAULT_HASH: 'unsupported-fixture-hash' },
  });
  assert.ifError(failure.error);
  assert.equal(failure.status, 2, failure.stderr);
  assert.match(JSON.parse(failure.stderr).message, /忽略规则已落盘/u);
  const partial = inspectGit(home);
  assert.equal(partial.status, 'absent');
  assert.equal(partial.ignoreState, 'managed');
  const result = initGit(home, partial.ignoreRevision);
  assert.equal(result.status, 'ready');
  assert.equal(result.ignoreRevision, partial.ignoreRevision);
  assert.deepEqual(result.staged, []);
});

test('a clean Home clone directly reads all three record types and restores registered projects without installation', t => {
  const root = fixture(t);
  const old = path.join(root, 'old');
  const remote = pathToFileURL(project(root, '远端 仓库')).href;
  const missingRemote = pathToFileURL(path.join(root, 'missing')).href;
  write(old, 'AGENTS.md', '# Home\n');
  run(old, process.execPath, [installer, 'install', '--domain', 'home']);
  assert.equal(fs.existsSync(path.join(old, '.git')), false);
  assert.equal(homeGit(old, 'inspect', '--home', '.').status, 'absent');
  const registry = { formatVersion: 2, repos: [
    { id: 'offline', purpose: '不可达远端', localPath: './offline', primaryRemote: 'origin', remotes: [{ name: 'origin', urls: [missingRemote], pushUrls: [] }], intent: 'work' },
    { id: 'collision', purpose: '目标占用', localPath: './collision', primaryRemote: 'origin', remotes: [{ name: 'origin', urls: [remote], pushUrls: [] }], intent: 'work' },
    { id: 'alpha', purpose: '内嵌项目', localPath: './项目 甲', primaryRemote: 'central', remotes: [{ name: 'central', urls: [remote, 'https://example.invalid/backup'], pushUrls: ['ssh://git@example.invalid/alpha'] }, { name: 'mirror', urls: ['https://example.invalid/mirror'], pushUrls: [] }], intent: 'work' },
    { id: 'beta', purpose: '平级项目', localPath: '../项目 乙', primaryRemote: 'origin', remotes: [{ name: 'origin', urls: [remote], pushUrls: [] }], intent: 'reference' },
    { id: 'local', purpose: '旧机本地项目', localPath: './local-only', primaryRemote: null, remotes: [], intent: 'work' },
  ] };
  write(old, '.agents/home/repos.json', JSON.stringify(registry));
  write(old, '.agents/home/local.json', JSON.stringify({ formatVersion: 1, paths: { alpha: './old-only' } }));
  write(old, 'temp/home/original.log', '旧机原件不得进入新克隆');
  write(old, '.agents/dev/notes/rules.md', '# 跨领域正式资料\n');
  const history = write(old, 'temp/event.md', '---\nevent_key: "fixture:event"\nscope: "home"\nsources: ["fixture:old-run"]\noccurred_at: "2026-11-26T00:00:00Z"\nstatus: "verified"\n---\n# 接口回顾\n\n选择稳定分支以减少部署变动，验证了三条读取路径，写入路径未覆盖。\n');
  tool(old, 'home-history/scripts/history.mjs', ['record', '--home', '.', '--input', history]);
  const knowledge = write(old, 'temp/knowledge.md', '---\nscope: "home"\nsources: ["fixture:old-run"]\nstatus: "active"\n---\n# 验收约定\n\n发布前必须核查写入路径，因为上次仅覆盖三条读取路径。\n');
  tool(old, 'home-knowledge/scripts/knowledge.mjs', ['put', '--home', '.', '--path', 'notes/acceptance.md', '--input', knowledge, '--expect', 'missing']);
  const taskInput = write(old, 'temp/task.md', '# 下一项验收\n\n在稳定分支运行写入测试，观察记录能否重新读取。\n');
  const reportInput = write(old, 'temp/report.md', '# 结果\n\n三条读取通过，待核对写入。接续者应使用空白数据先试一次。\n');
  const task = (command, ...args) => tool(old, 'home-tasks/scripts/tasks.mjs', [command, '--home', '.', '--topic', topic, ...args]);
  task('init', '--title', '写入验收', '--input', taskInput);
  task('task', '--repos', 'alpha', '--input', taskInput);
  task('reserve', '--task', 'task_01.md', '--repo', 'alpha', '--evidence', '隔离测试准备投递');
  task('report', '--task', 'task_01.md', '--repo', 'alpha', '--kind', 'progress', '--input', reportInput);

  const init = homeGit(old, 'init', '--home', '.', '--expect-ignore', homeGit(old, 'inspect', '--home', '.').ignoreRevision);
  assert.equal(init.status, 'ready');
  assert.deepEqual(init.missingSkills, []);
  git(old, 'add', '--', '.gitignore', 'AGENTS.md', '.agents');
  git(old, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'portable home');
  const home = path.join(root, '新机 Home');
  git(root, 'clone', '--no-local', old, home);
  assert.equal(fs.existsSync(path.join(home, 'temp')), false);
  assert.equal(fs.existsSync(path.join(home, '.agents/home/local.json')), false);
  assert.equal(fs.existsSync(path.join(home, '.claude')), false);
  assert.equal(fs.existsSync(path.join(home, '.agents/dev/notes/rules.md')), true);
  const search = (kind, script, text) => tool(home, `home-${kind}/scripts/${script}.mjs`, ['query', '--home', '.', '--text', text]);
  const event = search('history', 'history', '接口回顾').entries[0];
  const note = search('knowledge', 'knowledge', '验收约定').entries[0];
  const reports = tool(home, 'home-tasks/scripts/tasks.mjs', ['show', '--home', '.', '--topic', topic]);
  const read = relative => fs.readFileSync(path.join(home, '.agents/home', relative), 'utf8');
  assert.match(read(event.path), /减少部署变动.*写入路径未覆盖/u);
  assert.match(read(note.path), /发布前必须核查写入路径/u);
  assert.equal(reports.messages[0].reports[0].name, 'report_01.md');
  assert.match(read(`coordination/${topic}/task_01.md`), /运行写入测试/u);
  assert.match(read(`coordination/${topic}/report_01.md`), /使用空白数据先试一次/u);

  write(home, 'collision/occupied.txt', '已有数据');
  const restore = (...args) => tool(home, 'home-setup/scripts/restore.mjs', ['--home', '.', ...args], 1);
  assert.equal(restore().projects.find(entry => entry.id === 'alpha').status, 'planned');
  assert.equal(fs.existsSync(path.join(home, '项目 甲')), false);
  const applied = restore('--apply');
  assert.deepEqual(applied.projects.map(({ id, status }) => [id, status]), [['offline', 'blocked'], ['collision', 'blocked'], ['alpha', 'cloned'], ['beta', 'cloned'], ['local', 'blocked']]);
  assert.equal(applied.projects.find(entry => entry.id === 'offline').code, 'CLONE_FAILED');
  const alpha = path.join(home, '项目 甲');
  assert.equal(git(alpha, 'branch', '--show-current'), 'stable');
  assert.equal(git(alpha, 'config', '--get-all', 'remote.central.url'), `${remote}\nhttps://example.invalid/backup`);
  assert.equal(git(alpha, 'config', '--get', 'remote.central.pushurl'), 'ssh://git@example.invalid/alpha');
  assert.equal(git(alpha, 'config', '--get', 'remote.mirror.url'), 'https://example.invalid/mirror');
  write(alpha, 'project.md', '# 未提交工作\n');
  git(alpha, 'add', 'project.md');
  const index = fs.readFileSync(path.join(alpha, '.git/index'));
  const reused = restore('--apply').projects.find(entry => entry.id === 'alpha');
  assert.equal(reused.status, 'reused');
  assert.equal(reused.dirty, true);
  assert.deepEqual(fs.readFileSync(path.join(alpha, '.git/index')), index);
  assert.equal(git(home, 'status', '--short'), '');
  assert.equal(fs.readFileSync(path.join(home, 'collision/occupied.txt'), 'utf8'), '已有数据');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(home, '.agents/home/repos.json'), 'utf8')), registry);
});

test('v1 restores without rewriting the registry, and a cross-identity rewrite is rejected before clone', t => {
  const root = fixture(t);
  const home = path.join(root, 'home');
  fs.mkdirSync(home);
  run(home, process.execPath, [installer, 'install', '--skill', 'home-setup', 'home-route']);
  const remote = pathToFileURL(project(root, 'legacy remote')).href;
  const changed = 'https://source.example.invalid/project.git';
  const contents = JSON.stringify({ formatVersion: 1, repos: [
    { id: 'legacy', purpose: '旧登记', localPath: 'legacy', remote, intent: 'work' },
    { id: 'rewritten', purpose: '错向地址', localPath: './rewritten', remote: changed, intent: 'work' },
  ] });
  const registry = write(home, '.agents/home/repos.json', contents);
  homeGit(home, 'init', '--home', '.', '--expect-ignore', homeGit(home, 'inspect', '--home', '.').ignoreRevision);
  git(home, 'config', 'url.https://another.example.invalid/project.git.insteadOf', changed);
  const applied = tool(home, 'home-setup/scripts/restore.mjs', ['--home', '.', '--apply'], 1);
  assert.deepEqual(applied.projects.map(({ id, status, code }) => [id, status, code]), [['legacy', 'cloned', undefined], ['rewritten', 'blocked', 'IDENTITY_CONFLICT']]);
  assert.equal(fs.existsSync(path.join(home, 'rewritten')), false);
  assert.equal(git(path.join(home, 'legacy'), 'remote'), 'origin');
  const selected = tool(home, 'home-setup/scripts/restore.mjs', ['--home', '.', '--repo', 'legacy', '--apply']);
  assert.equal(selected.projects[0].status, 'reused');
  assert.equal(selected.projects.length, 1);
  assert.equal(fs.readFileSync(registry, 'utf8'), contents);
});
