import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { repositoryRoot, createInstaller, licenseBundleFiles, select, InstallError } from '../install.mjs';
import { temporary, write, snapshot, command } from './helpers.mjs';

class InstallFixture {
  constructor(t) {
    this.t = t;
    this.root = temporary(t, 'skills-hub-install-');
    this.repository = path.join(this.root, 'repository');
    this.project = path.join(this.root, 'project');
    fs.mkdirSync(this.project);
    fs.mkdirSync(this.repository);
    fs.copyFileSync(path.join(repositoryRoot, 'install.mjs'), path.join(this.repository, 'install.mjs'));
    fs.mkdirSync(path.join(this.repository, 'scripts'));
    fs.copyFileSync(path.join(repositoryRoot, 'scripts/init-persistence.mjs'), path.join(this.repository, 'scripts/init-persistence.mjs'));
    fs.cpSync(path.join(repositoryRoot, 'scripts/persistence'), path.join(this.repository, 'scripts/persistence'), { recursive: true });
    this.skillRoot = path.join(this.repository, 'skills');
    this.upstreamRoot = path.join(this.repository, 'upstream-skills');
    this.licenseRoot = path.join(this.repository, 'licenses');
    for (const name of [...licenseBundleFiles, 'third-party.txt']) write(path.join(this.licenseRoot, name), `Fixture legal notice: ${name}\n`);
    this.licenseTarget = path.join(this.project, '.agents', 'skills-hub-licenses');
    this.target = path.join(this.project, '.agents', 'skills');
    this.sources = {
      'dev-alpha': this.writeSkill('dev', 'dev-alpha'),
      'dev-beta': this.writeSkill('dev', 'dev-beta'),
      'system-clean': this.writeSkill('system', 'system-clean'),
    };
  }
  writeSkill(domain, name) {
    const folder = domain === 'upstream-skills' ? path.join(this.upstreamRoot, name) : path.join(this.skillRoot, domain, name);
    for (const [relative, content] of Object.entries({
      'SKILL.md': `---\nname: ${name}\ndescription: A fixture skill for ${domain}.\n---\n\n# ${name}\n`,
      'references/details.md': 'Fixture reference.\n',
      'assets/nested/example.bin': Buffer.from(Array.from({ length: 16 }, (_, index) => index)),
      'scripts/check.mjs': '#!/usr/bin/env node\nconsole.log("fixture");\n',
    })) write(path.join(folder, relative), content);
    fs.chmodSync(path.join(folder, 'scripts/check.mjs'), 0o755);
    return folder;
  }
  cli(...args) { return command(process.execPath, [path.join(this.repository, 'install.mjs'), ...args], { cwd: this.project }); }
  success(result) { assert.equal(result.status, 0, result.stdout + result.stderr); return result; }
  failure(...args) {
    const before = snapshot(this.project);
    const result = this.cli(...args);
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.deepEqual(snapshot(this.project), before);
    return result;
  }
  names() { return new Set(fs.readdirSync(this.target)); }
  alias(name) { return path.join(this.project, '.claude', 'skills', name); }
  // 入口可能尚不存在或已断链，只解析其真实项目根，不解析入口本身。
  actualAlias(name) { return path.join(fs.realpathSync(this.project), '.claude', 'skills', name); }
  useSymlinkedParent() {
    const parent = path.join(this.root, 'linked-parent');
    fs.symlinkSync(fs.realpathSync(this.root), parent, 'dir');
    this.project = path.join(parent, 'project');
    this.target = path.join(this.project, '.agents', 'skills');
    this.licenseTarget = path.join(this.project, '.agents', 'skills-hub-licenses');
    assert.notEqual(this.project, fs.realpathSync(this.project));
  }
  assertAlias(name, relative = true) {
    const canonical = path.join(this.target, name);
    const alias = this.alias(name);
    for (const directory of [this.target, canonical, path.dirname(path.dirname(alias)), path.dirname(alias)]) {
      assert.ok(fs.lstatSync(directory).isDirectory(), directory);
      assert.ok(!fs.lstatSync(directory).isSymbolicLink(), directory);
    }
    assert.ok(fs.lstatSync(alias).isSymbolicLink(), alias);
    assert.ok(fs.statSync(alias).isDirectory(), alias);
    if (relative) {
      assert.ok(!path.isAbsolute(fs.readlinkSync(alias)));
      assert.equal(path.normalize(fs.readlinkSync(alias)), path.join('..', '..', '.agents', 'skills', name));
    }
    assert.equal(fs.realpathSync(alias), fs.realpathSync(canonical));
    assert.deepEqual(snapshot(alias), snapshot(canonical));
  }
  installer(overrides = {}, platform = process.platform) {
    return createInstaller({ repository: this.repository, fsOps: { ...fs, ...overrides }, platform });
  }
  selected(...names) { return select(this.installer().catalog(), [], names); }
  seed(name, differing = false) {
    const destination = path.join(this.target, name);
    fs.mkdirSync(this.target, { recursive: true });
    fs.cpSync(this.sources[name], destination, { recursive: true });
    if (differing) write(path.join(destination, 'local-note.txt'), "Keep the user's local content.\n");
    return destination;
  }
  link(link, target, directory = true) {
    fs.mkdirSync(path.dirname(link), { recursive: true });
    try { fs.symlinkSync(target, link, directory ? 'junction' : 'file'); return true; }
    catch (error) {
      if (!['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) throw error;
      this.t.skip(`Symlinks are unavailable: ${error.message}`);
      return false;
    }
  }
  noTemporaryArtifacts() {
    const agents = path.join(this.project, '.agents');
    for (const name of ['.skills-wta-install.lock', '.skills-hub-install.lock']) {
      assert.ok(!fs.existsSync(path.join(agents, name)), `Installer left a lock: ${name}`);
    }
    if (fs.existsSync(agents)) assert.deepEqual(fs.readdirSync(agents).filter((name) => name.startsWith('.skills-hub-stage-')), []);
  }
  backups(suffix = '') {
    const parent = path.join(this.project, '.agents', '.skills-hub-backups');
    return fs.readdirSync(parent).map((name) => path.join(parent, name, suffix)).filter((name) => fs.existsSync(name));
  }
}

function contract(name, run, options = {}) {
  test(name, options, (t) => run(new InstallFixture(t), t));
}
const posixOnly = { skip: process.platform === 'win32' ? 'Windows does not use POSIX executable bits' : false };

contract('list is read-only and lists all domains', (f) => {
  const result = f.success(f.cli('list'));
  assert.deepEqual(new Set(result.stdout.trim().split('\n').map((line) => line.trim().split(/\s+/)[1])), new Set(Object.keys(f.sources)));
  assert.ok(!fs.existsSync(path.join(f.project, '.agents')));
});
contract('list can filter a domain', (f) => {
  const result = f.success(f.cli('list', '--domain', 'dev'));
  assert.deepEqual(new Set(result.stdout.trim().split('\n').map((line) => line.trim().split(/\s+/)[1])), new Set(['dev-alpha', 'dev-beta']));
  assert.ok(!fs.existsSync(path.join(f.project, '.agents')));
});
contract('domain installs flat into the current project', (f) => {
  f.success(f.cli('install', '--domain', 'dev'));
  assert.deepEqual(f.names(), new Set(['dev-alpha', 'dev-beta']));
  for (const name of f.names()) f.assertAlias(name);
  assert.deepEqual(fs.readdirSync(path.join(f.project, '.claude/skills')), ['dev-alpha', 'dev-beta']);
  assert.ok(!fs.existsSync(path.join(f.target, 'dev')));
  assert.ok(!fs.existsSync(path.join(f.repository, '.agents')));
  f.noTemporaryArtifacts();
});
contract('installation inside the source tree is rejected without writes', (f) => {
  const upstream = f.writeSkill('upstream-skills', 'zh-example');
  for (const cwd of [f.skillRoot, f.sources['dev-alpha'], path.join(f.sources['dev-alpha'], 'references'), f.upstreamRoot, upstream, path.join(upstream, 'references'), f.licenseRoot]) {
    for (const extra of [[], ['--dry-run']]) {
      const before = snapshot(f.repository);
      const result = command(process.execPath, [path.join(f.repository, 'install.mjs'), 'install', '--skill', 'dev-alpha', ...extra], { cwd });
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /outside this repository's source skills and licenses directories/);
      assert.deepEqual(snapshot(f.repository), before);
    }
  }
});
contract('named skills can be selected from different domains', (f) => {
  f.success(f.cli('install', '--skill', 'dev-beta', 'system-clean'));
  assert.deepEqual(f.names(), new Set(['dev-beta', 'system-clean']));
});
contract('mixed and repeated selections form a union', (f) => {
  const result = f.success(f.cli('install', '--domain', 'dev', '--domain', 'dev', '--skill', 'system-clean', 'dev-alpha', '--skill', 'dev-alpha'));
  assert.deepEqual(f.names(), new Set(Object.keys(f.sources)));
  assert.equal(result.stdout.split('\n').filter((line) => line.includes('dev-alpha')).length, 1);
  for (const name of f.names()) f.assertAlias(name);
});
contract('all selects every domain', (f) => {
  f.success(f.cli('install', '--all'));
  assert.deepEqual(f.names(), new Set(Object.keys(f.sources)));
});
contract('upstream group lists and installs complete Chinese packages without domain navigation', (f) => {
  const source = f.writeSkill('upstream-skills', 'zh-archify');
  f.writeSkill('upstream-skills', 'zh-modern-web-guidance');
  // 同仓材料依旧是被动对照，不参与运行技能发现。
  write(path.join(f.repository, 'materials/example/upstream/SKILL.md'), 'not an installable entry');
  const names = f.success(f.cli('list', '--domain', 'upstream-skills')).stdout.trim().split('\n').map(line => line.trim().split(/\s+/)[1]);
  assert.deepEqual(names, ['zh-archify', 'zh-modern-web-guidance']);
  const before = snapshot(f.project);
  const preview = f.success(f.cli('install', '--domain', 'upstream-skills', '--dry-run'));
  assert.match(preview.stdout, /would install\s+zh-archify/);
  assert.deepEqual(snapshot(f.project), before);
  f.success(f.cli('install', '--domain', 'upstream-skills'));
  assert.deepEqual(f.names(), new Set(names));
  assert.deepEqual(snapshot(path.join(f.target, 'zh-archify')), snapshot(source));
  for (const name of names) f.assertAlias(name);
  assert.deepEqual(fs.readdirSync(path.join(f.project, '.agents')), ['skills']);
  assert.match(f.success(f.cli('install', '--skill', 'zh-archify')).stdout, /unchanged/);
  f.noTemporaryArtifacts();
});
contract('upstream leaves mix with domain selections and all includes both source roots', (f) => {
  f.writeSkill('upstream-skills', 'zh-archify');
  f.writeSkill('upstream-skills', 'zh-modern-web-guidance');
  f.success(f.cli('install', '--domain', 'dev', '--skill', 'zh-archify', 'dev-alpha'));
  assert.deepEqual(f.names(), new Set(['dev-alpha', 'dev-beta', 'zh-archify']));
  assert.ok(fs.existsSync(path.join(f.project, '.agents/dev/AGENTS.md')));
  assert.ok(!fs.existsSync(path.join(f.project, '.agents/upstream-skills')));
  f.success(f.cli('install', '--all'));
  assert.deepEqual(f.names(), new Set([...Object.keys(f.sources), 'zh-archify', 'zh-modern-web-guidance']));
});
contract('every skill resource is copied without creating project licenses', (f) => {
  f.success(f.cli('install', '--skill', 'dev-alpha'));
  assert.deepEqual(snapshot(path.join(f.target, 'dev-alpha')), snapshot(f.sources['dev-alpha']));
  assert.ok(!fs.existsSync(path.join(f.target, 'dev-alpha/LICENSE')));
  assert.ok(!fs.existsSync(f.licenseTarget));
  if (process.platform !== 'win32') assert.equal(fs.statSync(path.join(f.target, 'dev-alpha/scripts/check.mjs')).mode & 0o777, 0o755);
});
contract('replacement repairs executable permission drift and keeps a backup', (f) => {
  f.success(f.cli('install', '--skill', 'dev-alpha'));
  const installed = path.join(f.target, 'dev-alpha/scripts/check.mjs');
  fs.chmodSync(installed, 0o644);
  const result = f.success(f.cli('install', '--skill', 'dev-alpha'));
  assert.match(result.stdout, /replace/); assert.doesNotMatch(result.stdout, /unchanged/);
  assert.equal(fs.statSync(installed).mode & 0o777, 0o755);
  const backups = f.backups('dev-alpha/scripts/check.mjs');
  assert.equal(backups.length, 1); assert.equal(fs.statSync(backups[0]).mode & 0o777, 0o644);
  assert.match(f.success(f.cli('install', '--skill', 'dev-alpha')).stdout, /unchanged/);
  f.noTemporaryArtifacts();
}, posixOnly);
contract('replacement applies a source executable-bit-only change', (f) => {
  f.success(f.cli('install', '--skill', 'dev-alpha'));
  const source = path.join(f.sources['dev-alpha'], 'scripts/check.mjs');
  const installed = path.join(f.target, 'dev-alpha/scripts/check.mjs');
  fs.chmodSync(source, 0o644);
  assert.deepEqual(fs.readFileSync(source), fs.readFileSync(installed));
  assert.doesNotMatch(f.success(f.cli('install', '--skill', 'dev-alpha', '--replace')).stdout, /unchanged/);
  assert.equal(fs.statSync(installed).mode & 0o777, 0o644);
  const backups = f.backups('dev-alpha/scripts/check.mjs');
  assert.equal(backups.length, 1); assert.equal(fs.statSync(backups[0]).mode & 0o777, 0o755);
  f.noTemporaryArtifacts();
}, posixOnly);
contract('dry run creates no directories or files', (f) => {
  const before = snapshot(f.project);
  const output = f.success(f.cli('install', '--domain', 'dev', '--dry-run')).stdout;
  assert.match(output, /would install/);
  assert.match(output, /would link\s+\.claude\/skills\/dev-alpha -> /);
  assert.deepEqual(snapshot(f.project), before);
  assert.ok(!fs.existsSync(path.join(f.project, '.agents')));
  assert.ok(!fs.existsSync(path.join(f.project, '.claude')));
});
contract('dry run of a replacement does not create a backup', (f) => {
  f.seed('dev-alpha', true);
  const before = snapshot(f.project);
  assert.match(f.success(f.cli('install', '--skill', 'dev-alpha', '--replace', '--dry-run')).stdout, /would replace/);
  assert.deepEqual(snapshot(f.project), before);
});
contract('planning never probes symlink permissions or creates locks', (f) => {
  const installer = f.installer({
    mkdirSync() { assert.fail('Planning must not create directories or locks'); },
    symlinkSync() { assert.fail('Planning must not probe symlink permissions'); },
  });
  const previous = snapshot(f.project);
  const actions = installer.plan(f.selected('dev-alpha'), f.project);
  assert.equal(actions[0].link.kind, 'link');
  assert.deepEqual(snapshot(f.project), previous);
});
contract('repeated installation is idempotent', (f) => {
  f.success(f.cli('install', '--all'));
  const before = snapshot(f.project);
  const sample = path.join(f.target, 'dev-alpha/SKILL.md');
  const mtime = fs.statSync(sample, { bigint: true }).mtimeNs;
  const aliasStat = fs.lstatSync(f.alias('dev-alpha'), { bigint: true });
  const result = f.success(f.cli('install', '--all'));
  assert.equal(result.stdout.match(/unchanged/g)?.length, Object.keys(f.sources).length);
  assert.deepEqual(snapshot(f.project), before);
  assert.equal(fs.statSync(sample, { bigint: true }).mtimeNs, mtime);
  assert.equal(fs.lstatSync(f.alias('dev-alpha'), { bigint: true }).mtimeNs, aliasStat.mtimeNs);
  assert.equal(fs.lstatSync(f.alias('dev-alpha'), { bigint: true }).ino, aliasStat.ino);
  assert.match(result.stdout, /preserved\s+\.claude\/skills\/dev-alpha/);
  f.noTemporaryArtifacts();
});
contract('unknown domains or names make no changes', (f) => {
  for (const args of [['--domain', 'missing'], ['--skill', 'dev-missing'], ['--domain', 'dev', 'missing']]) assert.match(f.failure('install', ...args).stderr, /Unknown selection/);
});
contract('all does not hide an unknown selection', (f) => { f.failure('install', '--all', '--skill', 'dev-missing'); });
contract('installation requires a selection', (f) => { assert.match(f.failure('install').stderr, /Choose --domain, --skill, or --all/); });
contract('unknown options and destination overrides are rejected', (f) => {
  for (const option of ['--unknown', '--target', '--destination']) assert.equal(f.failure('install', '--all', option, 'elsewhere').status, 2);
});
contract('differing skills are automatically replaced alongside new selections', (f) => {
  f.seed('dev-beta', true);
  assert.match(f.success(f.cli('install', '--domain', 'dev')).stdout, /replace/);
  assert.ok(fs.existsSync(path.join(f.target, 'dev-alpha')));
  assert.deepEqual(snapshot(path.join(f.target, 'dev-beta')), snapshot(f.sources['dev-beta']));
  assert.equal(f.backups('dev-beta').length, 1); f.noTemporaryArtifacts();
});
contract('replacement backs up only differing selected skills', (f) => {
  const old = f.seed('dev-alpha', true); const previous = snapshot(old);
  const unchanged = f.seed('dev-beta'); const unchangedContents = snapshot(unchanged);
  const unrelated = path.join(f.target, 'personal-unrelated'); write(path.join(unrelated, 'notes.md'), 'Preserve me.\n');
  const unrelatedContents = snapshot(unrelated);
  f.success(f.cli('install', '--domain', 'dev', '--replace'));
  assert.deepEqual(snapshot(old), snapshot(f.sources['dev-alpha']));
  assert.deepEqual(snapshot(unchanged), unchangedContents); assert.deepEqual(snapshot(unrelated), unrelatedContents);
  const backups = f.backups(); assert.equal(backups.length, 1);
  assert.deepEqual(fs.readdirSync(backups[0]), ['dev-alpha']);
  assert.deepEqual(snapshot(path.join(backups[0], 'dev-alpha')), previous); f.noTemporaryArtifacts();
});
contract('source names must have their domain prefix', (f) => {
  f.writeSkill('dev', 'other-name'); assert.match(f.failure('install', '--all').stderr, /Skill must be named dev-xxx/);
});
contract('upstream names require zh prefix without weakening domain names', (f) => {
  f.writeSkill('upstream-skills', 'archify');
  assert.match(f.failure('install', '--all').stderr, /Skill must be named zh-xxx/);
});
contract('upstream frontmatter must equal the installed directory name', (f) => {
  const source = f.writeSkill('upstream-skills', 'zh-archify');
  const filename = path.join(source, 'SKILL.md');
  fs.writeFileSync(filename, fs.readFileSync(filename, 'utf8').replace('name: zh-archify', 'name: archify'));
  assert.match(f.failure('install', '--all').stderr, /Frontmatter name must equal directory name/);
});
contract('flat names are unique across domain and upstream roots', (f) => {
  f.writeSkill('zh', 'zh-example');
  f.writeSkill('upstream-skills', 'zh-example');
  assert.match(f.failure('install', '--all').stderr, /Duplicate install name: zh-example/);
});
contract('upstream group cannot also be declared as a domain', (f) => {
  write(path.join(f.skillRoot, 'upstream-skills/upstream-skills-example/SKILL.md'), 'reserved group');
  assert.match(f.failure('install', '--all').stderr, /upstream-skills group belongs at the repository root/);
});
contract('source frontmatter name must match its directory', (f) => {
  const filename = path.join(f.sources['dev-alpha'], 'SKILL.md');
  fs.writeFileSync(filename, fs.readFileSync(filename, 'utf8').replace('name: dev-alpha', 'name: dev-other'));
  assert.match(f.failure('install', '--all').stderr, /Frontmatter name must equal directory name/);
});
contract('duplicate flat names are rejected', (f) => {
  f.writeSkill('dev', 'dev-extra-example'); f.writeSkill('dev-extra', 'dev-extra-example');
  assert.match(f.failure('install', '--all').stderr, /Duplicate install name/);
});
contract('source resource symlinks are rejected', (f) => {
  const outside = write(path.join(f.root, 'outside.txt'), 'Do not copy through a symlink.\n');
  if (!f.link(path.join(f.sources['dev-alpha'], 'references/outside.md'), outside, false)) return;
  assert.match(f.failure('install', '--skill', 'dev-alpha').stderr, /Symlinks/);
});
for (const [label, resolve] of [
  ['skill', (f) => f.sources['dev-alpha']], ['domain', (f) => path.join(f.skillRoot, 'dev')], ['root', (f) => f.skillRoot],
  ['upstream skill', (f) => f.writeSkill('upstream-skills', 'zh-example')],
  ['upstream root', (f) => { f.writeSkill('upstream-skills', 'zh-example'); return f.upstreamRoot; }],
]) contract(`source ${label} symlinks are rejected`, (f) => {
  const original = resolve(f); const moved = path.join(f.root, 'moved-source'); fs.renameSync(original, moved);
  if (!f.link(original, moved)) return;
  f.failure('install', '--all');
});
for (const [label, resolve] of [
  ['agents', (f) => path.join(f.project, '.agents')], ['skills', (f) => f.target],
]) contract(`destination ${label} symlink is not followed`, (f) => {
  const outside = path.join(f.root, 'outside'); fs.mkdirSync(outside);
  if (!f.link(resolve(f), outside)) return;
  f.failure('install', '--all'); assert.deepEqual(snapshot(outside), {});
});
contract('destination skill symlink is not replaced', (f) => {
  const outside = path.join(f.root, 'outside-skill'); fs.cpSync(f.sources['dev-alpha'], outside, { recursive: true });
  const before = snapshot(outside); if (!f.link(path.join(f.target, 'dev-alpha'), outside)) return;
  f.failure('install', '--skill', 'dev-alpha', '--replace'); assert.deepEqual(snapshot(outside), before);
});
contract('destination nested symlink is not copied or removed', (f) => {
  const existing = f.seed('dev-alpha', true); const outside = write(path.join(f.root, 'outside.txt'), 'Preserve outside data.\n');
  if (!f.link(path.join(existing, 'outside.txt'), outside, false)) return;
  f.failure('install', '--skill', 'dev-alpha', '--replace'); assert.equal(fs.readFileSync(outside, 'utf8'), 'Preserve outside data.\n');
});
contract('backup root symlink is not followed', (f) => {
  f.seed('dev-alpha', true); const outside = path.join(f.root, 'outside-backups'); fs.mkdirSync(outside);
  if (!f.link(path.join(f.project, '.agents/.skills-hub-backups'), outside)) return;
  f.failure('install', '--skill', 'dev-alpha', '--replace'); assert.deepEqual(snapshot(outside), {});
});
for (const name of ['.skills-wta-install.lock', '.skills-hub-install.lock']) contract(`an existing ${name} is preserved without leaving another lock`, (f) => {
  const lock = path.join(f.project, '.agents', name); fs.mkdirSync(lock, { recursive: true });
  assert.match(f.failure('install', '--domain', 'dev').stderr, /installer lock exists/); assert.ok(fs.statSync(lock).isDirectory());
});
contract('writes hold both old and new installer locks and exclude either installer', (f) => {
  const observed = [];
  const installer = f.installer({ cpSync(source, destination, options) {
    for (const name of ['.skills-wta-install.lock', '.skills-hub-install.lock']) {
      const lock = path.join(f.project, '.agents', name);
      assert.throws(() => fs.mkdirSync(lock), { code: 'EEXIST' });
      observed.push(name);
    }
    assert.match(f.failure('install', '--skill', 'dev-beta').stderr, /installer lock exists/);
    return fs.cpSync(source, destination, options);
  } });
  installer.apply(f.selected('dev-alpha'), f.project);
  assert.ok(observed.length > 0);
  f.noTemporaryArtifacts();
});
contract('renamed installation reuses skills and retains old notices and backups', (f) => {
  const skill = f.seed('dev-alpha');
  const sample = path.join(skill, 'SKILL.md');
  const mtime = fs.statSync(sample, { bigint: true }).mtimeNs;
  const legacyLicenses = path.join(f.project, '.agents', 'skills-wta-licenses');
  const legacyBackups = path.join(f.project, '.agents', '.skills-wta-backups');
  write(path.join(legacyLicenses, 'notice.txt'), 'Retain old legal notices.\n');
  write(path.join(legacyBackups, 'saved', 'SKILL.md'), 'Retain previous recovery data.\n');
  const oldLicenses = snapshot(legacyLicenses);
  const oldBackups = snapshot(legacyBackups);
  assert.match(f.success(f.cli('install', '--skill', 'dev-alpha')).stdout, /unchanged/);
  assert.equal(fs.statSync(sample, { bigint: true }).mtimeNs, mtime);
  assert.ok(!fs.existsSync(f.licenseTarget));
  assert.deepEqual(snapshot(legacyLicenses), oldLicenses);
  assert.deepEqual(snapshot(legacyBackups), oldBackups);
  f.noTemporaryArtifacts();
});
contract('staging failure preserves existing skills', (f) => {
  f.seed('dev-beta', true); const before = snapshot(f.target);
  const installer = f.installer({ cpSync(source, destination, options) {
    if (source === f.sources['dev-beta']) throw new Error('simulated staging failure');
    return fs.cpSync(source, destination, options);
  } });
  assert.throws(() => installer.apply(f.selected('dev-alpha', 'dev-beta'), f.project, true), /rolled back/);
  assert.deepEqual(snapshot(f.target), before); f.noTemporaryArtifacts();
});
contract('publish failure rolls back new installation and replacement', (f) => {
  f.seed('dev-beta', true); const before = snapshot(f.target);
  const installer = f.installer({ renameSync(source, destination) {
    if (path.basename(source) === 'dev-beta' && path.basename(path.dirname(source)).startsWith('.skills-hub-stage-')) throw new Error('simulated publish failure');
    return fs.renameSync(source, destination);
  } });
  assert.throws(() => installer.apply(f.selected('dev-alpha', 'dev-beta'), f.project, true), /rolled back/);
  assert.deepEqual(snapshot(f.target), before); assert.ok(!fs.existsSync(path.join(f.target, 'dev-alpha'))); f.noTemporaryArtifacts();
});
contract('upstream replacement failure rolls back both roots and preserves its backup', (f) => {
  f.sources['zh-archify'] = f.writeSkill('upstream-skills', 'zh-archify');
  const installed = f.seed('zh-archify', true);
  const before = snapshot(f.target);
  const installer = f.installer({ renameSync(source, destination) {
    if (path.basename(source) === 'zh-archify' && path.basename(path.dirname(source)).startsWith('.skills-hub-stage-')) throw new Error('simulated upstream publish failure');
    return fs.renameSync(source, destination);
  } });
  assert.throws(() => installer.apply(f.selected('dev-alpha', 'zh-archify'), f.project), /rolled back/);
  assert.deepEqual(snapshot(f.target), before);
  assert.ok(fs.existsSync(path.join(installed, 'local-note.txt')));
  assert.ok(!fs.existsSync(path.join(f.project, '.agents/dev')));
  f.noTemporaryArtifacts();
  f.success(f.cli('install', '--skill', 'zh-archify'));
  assert.deepEqual(snapshot(installed), snapshot(f.sources['zh-archify']));
  assert.equal(f.backups('zh-archify').length, 1);
});
contract('failed rollback preserves a recoverable backup', (f) => {
  const old = f.seed('dev-alpha', true); const previous = snapshot(old);
  const installer = f.installer({ renameSync(source, destination) {
    if (path.basename(source) === 'dev-beta' && path.basename(path.dirname(source)).startsWith('.skills-hub-stage-')) throw new Error('simulated publish failure');
    if (source.split(path.sep).includes('.skills-hub-backups')) throw new Error('simulated restore failure');
    return fs.renameSync(source, destination);
  } });
  let failure;
  try { installer.apply(f.selected('dev-alpha', 'dev-beta'), f.project, true); }
  catch (error) { failure = error; }
  assert.ok(failure instanceof InstallError); assert.match(failure.message, /manual recovery/);
  const backups = f.backups('dev-alpha'); assert.equal(backups.length, 1);
  assert.deepEqual(snapshot(backups[0]), previous); assert.ok(failure.message.includes(path.dirname(backups[0]))); f.noTemporaryArtifacts();
});
contract('installation does not require a source license directory', (f) => {
  fs.rmSync(f.licenseRoot, { recursive: true });
  f.success(f.cli('install', '--all'));
  assert.ok(!fs.existsSync(f.licenseTarget));
});
contract('unchanged skills do not restore removed project license notices', (f) => {
  f.seed('dev-alpha');
  assert.match(f.success(f.cli('install', '--skill', 'dev-alpha')).stdout, /unchanged/);
  assert.ok(!fs.existsSync(f.licenseTarget));
});
contract('existing project license notices are untouched across preview, install and replace', (f) => {
  write(path.join(f.licenseTarget, 'local.txt'), 'Preserve existing notices.\n');
  const before = snapshot(f.licenseTarget);
  for (const flags of [['--dry-run'], [], ['--replace']]) {
    f.success(f.cli('install', '--all', ...flags));
    assert.deepEqual(snapshot(f.licenseTarget), before);
  }
});
contract('project license symlinks are ignored without following or deleting them', (f) => {
  const outside = path.join(f.root, 'outside-notices'); fs.mkdirSync(outside);
  if (!f.link(f.licenseTarget, outside)) return;
  f.success(f.cli('install', '--all'));
  assert.deepEqual(snapshot(outside), {});
  assert.ok(fs.lstatSync(f.licenseTarget).isSymbolicLink());
});
contract('help and package version do not install anything', (f) => {
  write(path.join(f.repository, 'package.json'), JSON.stringify({ version: '0.0.2' }));
  assert.match(f.success(f.cli('--help')).stdout, /Usage: skills-hub/);
  assert.equal(f.success(f.cli('--version')).stdout.trim(), '0.0.2');
  assert.ok(!fs.existsSync(path.join(f.project, '.agents')));
  assert.ok(!fs.existsSync(path.join(f.project, '.claude')));
});

for (const linkedParent of [false, true]) contract('unchanged canonical skills acquire both locks to supplement only missing links' +
  (linkedParent ? ' through a symlinked parent' : ''), (f) => {
  if (linkedParent) f.useSymlinkedParent();
  const selected = f.selected('dev-alpha', 'dev-beta');
  const partial = f.installer({ symlinkSync(target, destination, type) {
    if (path.basename(destination) === 'dev-alpha') {
      throw Object.assign(new Error('fixture symlink permission denied'), { code: 'EPERM' });
    }
    fs.symlinkSync(target, destination, type);
  } }, 'win32').apply(selected, f.project);
  assert.deepEqual(partial.actions.map(action => action.link.kind), ['skipped', 'link']);
  const sample = path.join(f.target, 'dev-alpha/SKILL.md');
  const mtime = fs.statSync(sample, { bigint: true }).mtimeNs;
  const preserved = fs.lstatSync(f.alias('dev-beta'), { bigint: true });
  const created = [];
  const installer = f.installer({
    cpSync() { assert.fail('Unchanged skill bodies must not be copied'); },
    symlinkSync(target, destination, type) {
      assert.equal(type, 'dir');
      assert.equal(destination, f.actualAlias('dev-alpha'));
      for (const name of ['.skills-wta-install.lock', '.skills-hub-install.lock']) {
        assert.ok(fs.lstatSync(path.join(f.project, '.agents', name)).isDirectory());
      }
      created.push(destination);
      fs.symlinkSync(target, destination, type);
    },
  });
  const result = installer.apply(selected, f.project);
  assert.deepEqual(result.actions.map(action => [action.kind, action.link.kind]), [['unchanged', 'link'], ['unchanged', 'preserved']]);
  assert.equal(result.backup, null);
  assert.deepEqual(created, [f.actualAlias('dev-alpha')]);
  assert.equal(fs.statSync(sample, { bigint: true }).mtimeNs, mtime);
  assert.equal(fs.lstatSync(f.alias('dev-beta'), { bigint: true }).mtimeNs, preserved.mtimeNs);
  assert.equal(fs.lstatSync(f.alias('dev-beta'), { bigint: true }).ino, preserved.ino);
  for (const name of ['dev-alpha', 'dev-beta']) f.assertAlias(name);
  f.noTemporaryArtifacts();
});

contract('updates replace only the canonical body and preserve an equivalent absolute symlink', (f) => {
  f.seed('dev-alpha');
  const alias = f.alias('dev-alpha');
  fs.mkdirSync(path.dirname(alias), { recursive: true });
  const canonical = path.join(f.target, 'dev-alpha');
  fs.symlinkSync(canonical, alias, 'dir');
  const initial = fs.lstatSync(alias, { bigint: true });
  f.success(f.cli('install', '--skill', 'dev-alpha'));
  write(path.join(f.sources['dev-alpha'], 'references/details.md'), 'Updated shared content.\n');
  const output = f.success(f.cli('install', '--skill', 'dev-alpha', '--replace')).stdout;
  assert.match(output, /replace\s+dev-alpha \| preserved/);
  assert.equal(fs.readFileSync(path.join(alias, 'references/details.md'), 'utf8'), 'Updated shared content.\n');
  assert.equal(fs.readlinkSync(alias), canonical);
  assert.equal(fs.lstatSync(alias, { bigint: true }).mtimeNs, initial.mtimeNs);
  assert.equal(fs.lstatSync(alias, { bigint: true }).ino, initial.ino);
  f.assertAlias('dev-alpha', false);
  assert.equal(f.backups('dev-alpha').length, 1);
});

contract('a dangling link to the expected canonical is preserved and becomes reachable', (f) => {
  const alias = f.alias('dev-alpha');
  fs.mkdirSync(path.dirname(alias), { recursive: true });
  const target = path.join('..', '..', '.agents', 'skills', 'dev-alpha');
  fs.symlinkSync(target, alias, 'dir');
  assert.equal(fs.existsSync(alias), false);
  const inode = fs.lstatSync(alias, { bigint: true }).ino;
  const result = f.success(f.cli('install', '--skill', 'dev-alpha'));
  assert.match(result.stdout, /install\s+dev-alpha \| preserved/);
  assert.equal(fs.lstatSync(alias, { bigint: true }).ino, inode);
  f.assertAlias('dev-alpha');
});

for (const kind of ['file', 'directory', 'foreign link', 'wrong dangling link']) {
  contract(`a ${kind} at the selected Claude entry fails before writes even with --replace`, (f) => {
    f.seed('dev-beta', true);
    const alias = f.alias('dev-alpha');
    fs.mkdirSync(path.dirname(alias), { recursive: true });
    const outside = path.join(f.root, 'foreign content');
    write(path.join(outside, 'keep.md'), 'Do not touch this target.\n');
    const before = snapshot(outside);
    if (kind === 'file') fs.writeFileSync(alias, 'user entry');
    else if (kind === 'directory') write(path.join(alias, 'SKILL.md'), 'user skill');
    else fs.symlinkSync(kind === 'foreign link' ? outside : path.join(f.root, 'missing'), alias, 'dir');
    for (const options of [[], ['--dry-run'], ['--replace']]) {
      const result = f.failure('install', '--domain', 'dev', ...options);
      assert.match(result.stderr, /Claude skill entry conflict/);
      assert.ok(result.stderr.includes(alias));
    }
    assert.deepEqual(snapshot(outside), before);
    assert.ok(!fs.existsSync(path.join(f.target, 'dev-alpha')));
    assert.ok(!fs.existsSync(path.join(f.project, '.agents/.skills-hub-backups')));
  });
}

for (const parent of ['.claude', '.claude/skills']) {
  for (const kind of ['file', 'symlink']) {
    contract(`a ${kind} at ${parent} is never followed or replaced`, (f) => {
      const entry = path.join(f.project, parent);
      fs.mkdirSync(path.dirname(entry), { recursive: true });
      const outside = path.join(f.root, 'outside');
      fs.mkdirSync(outside);
      if (kind === 'file') fs.writeFileSync(entry, 'preserve');
      else fs.symlinkSync(outside, entry, 'dir');
      const result = f.failure('install', '--all', '--replace');
      assert.ok(result.stderr.includes(entry));
      assert.deepEqual(snapshot(outside), {});
      assert.ok(!fs.existsSync(path.join(f.project, '.agents')));
    });
  }
}

contract('unselected skill entries, personal Claude skills and child projects are untouched', (f) => {
  f.success(f.cli('install', '--skill', 'dev-beta'));
  const oldBody = snapshot(path.join(f.target, 'dev-beta'));
  const oldLink = fs.readlinkSync(f.alias('dev-beta'));
  write(path.join(f.sources['dev-beta'], 'references/details.md'), 'Unselected update.\n');
  const personal = path.join(f.project, '.claude/skills/personal');
  write(path.join(personal, 'SKILL.md'), 'User-owned skill.\n');
  const child = path.join(f.project, 'child project');
  write(path.join(child, '.agents/skills/dev-alpha/SKILL.md'), 'Independent child version.\n');
  write(path.join(child, '.claude/skills/dev-alpha/SKILL.md'), 'Independent child Claude version.\n');
  const previousChild = snapshot(child);
  f.success(f.cli('install', '--skill', 'dev-alpha'));
  assert.deepEqual(snapshot(path.join(f.target, 'dev-beta')), oldBody);
  assert.equal(fs.readlinkSync(f.alias('dev-beta')), oldLink);
  assert.equal(fs.readFileSync(path.join(personal, 'SKILL.md'), 'utf8'), 'User-owned skill.\n');
  assert.deepEqual(snapshot(child), previousChild);
  assert.deepEqual(fs.readdirSync(path.join(f.project, '.claude/skills')), ['dev-alpha', 'dev-beta', 'personal']);
  for (const name of ['CLAUDE.md', 'GEMINI.md', 'settings.json', 'settings.local.json']) {
    assert.ok(!fs.existsSync(path.join(f.project, name)));
    assert.ok(!fs.existsSync(path.join(f.project, '.claude', name)));
  }
});

contract('the link plan is recomputed after both locks before committing any skill', (f) => {
  const canonical = f.seed('dev-alpha', true);
  const previous = snapshot(canonical);
  const alias = f.alias('dev-alpha');
  const installer = f.installer({
    mkdirSync(directory, ...args) {
      const result = fs.mkdirSync(directory, ...args);
      if (path.basename(directory) === '.skills-hub-install.lock') write(alias, 'new user conflict');
      return result;
    },
    cpSync() { assert.fail('A conflict discovered under the locks must precede staging'); },
  });
  assert.throws(() => installer.apply(f.selected('dev-alpha'), f.project), /Claude skill entry conflict/);
  assert.deepEqual(snapshot(canonical), previous);
  assert.equal(fs.readFileSync(alias, 'utf8'), 'new user conflict');
  assert.ok(!fs.existsSync(path.join(f.project, '.agents/dev')));
  f.noTemporaryArtifacts();
});

contract('Windows skips EPERM links and completes skill updates and project initialization', (f) => {
  const previous = snapshot(f.seed('dev-alpha', true));
  const attempts = [];
  const installer = f.installer({ symlinkSync(target, destination, type) {
    attempts.push({ target, destination, type });
    throw Object.assign(new Error('fixture symlink permission denied'), { code: 'EPERM' });
  } }, 'win32');
  const selected = f.selected('dev-alpha', 'system-clean');
  const result = installer.apply(selected, f.project);
  assert.deepEqual(result.actions.map(action => [action.kind, action.link.kind]), [['replace', 'skipped'], ['install', 'skipped']]);
  assert.deepEqual(snapshot(path.join(result.backup, 'dev-alpha')), previous);
  assert.deepEqual(attempts, selected.map(({ name }) => ({
    target: path.join('..', '..', '.agents', 'skills', name), destination: f.actualAlias(name), type: 'dir',
  })));
  for (const { name, source } of selected) {
    assert.deepEqual(snapshot(path.join(f.target, name)), snapshot(source));
    assert.equal(fs.lstatSync(f.alias(name), { throwIfNoEntry: false }), undefined);
  }
  assert.ok(fs.existsSync(path.join(f.project, '.agents/dev/AGENTS.md')));
  assert.ok(fs.existsSync(path.join(f.project, '.agents/system/AGENTS.md')));
  assert.match(fs.readFileSync(path.join(f.project, '.gitignore'), 'utf8'), /\/temp\//);
  const retry = installer.plan(selected, f.project);
  assert.deepEqual(retry.map(action => [action.kind, action.link.kind]), [['unchanged', 'link'], ['unchanged', 'link']]);
  f.noTemporaryArtifacts();
});

contract('EPERM creating a directory symlink still rolls back on other platforms', (f) => {
  const previous = snapshot(f.project);
  const attempts = [];
  const installer = f.installer({ symlinkSync(target, destination, type) {
    attempts.push({ target, destination, type });
    throw Object.assign(new Error('fixture symlink permission denied'), { code: 'EPERM' });
  } }, 'linux');
  assert.throws(() => installer.apply(f.selected('dev-alpha'), f.project), /rolled back.*EPERM.*fixture symlink permission denied/);
  assert.equal(attempts.length, 1);
  assert.equal(attempts[0].type, 'dir');
  assert.ok(!path.isAbsolute(attempts[0].target));
  assert.deepEqual(snapshot(f.project), previous);
});

contract('failure on the second link restores replacements, previous dangling links and removes only new links', (f) => {
  f.seed('dev-beta', true);
  const systemAlias = f.alias('system-clean');
  fs.mkdirSync(path.dirname(systemAlias), { recursive: true });
  fs.symlinkSync(path.join('..', '..', '.agents', 'skills', 'system-clean'), systemAlias, 'dir');
  const previous = snapshot(f.project);
  let created = 0;
  const installer = f.installer({ symlinkSync(target, destination, type) {
    if (++created === 2) throw Object.assign(new Error('fixture second link failed'), { code: 'EACCES' });
    return fs.symlinkSync(target, destination, type);
  } });
  assert.throws(() => installer.apply(f.selected('dev-alpha', 'dev-beta', 'system-clean'), f.project), /rolled back.*second link failed/);
  assert.equal(created, 2);
  assert.deepEqual(snapshot(f.project), previous);
  assert.ok(fs.lstatSync(systemAlias).isSymbolicLink());
  assert.equal(fs.existsSync(systemAlias), false);
  f.noTemporaryArtifacts();
});

for (const linkedParent of [false, true]) contract('a failed link cleanup reports the remaining entry instead of claiming complete rollback' +
  (linkedParent ? ' through a symlinked parent' : ''), (f) => {
  if (linkedParent) f.useSymlinkedParent();
  const denied = [];
  const installer = f.installer({
    symlinkSync(target, destination, type) {
      if (path.basename(destination) === 'dev-beta') throw new Error('fixture link failed');
      return fs.symlinkSync(target, destination, type);
    },
    unlinkSync(filename) {
      if (filename === f.actualAlias('dev-alpha')) {
        denied.push(filename);
        throw new Error('fixture cleanup denied');
      }
      return fs.unlinkSync(filename);
    },
  });
  assert.throws(() => installer.apply(f.selected('dev-alpha', 'dev-beta'), f.project), error => {
    assert.match(error.message, /manual recovery/);
    assert.ok(error.message.includes(f.actualAlias('dev-alpha')));
    assert.match(error.message, /fixture cleanup denied/);
    return true;
  });
  assert.deepEqual(denied, [f.actualAlias('dev-alpha')]);
  assert.ok(fs.lstatSync(f.alias('dev-alpha')).isSymbolicLink());
  assert.ok(!fs.existsSync(path.join(f.target, 'dev-alpha')));
  f.noTemporaryArtifacts();
});

contract('rollback never follows a Claude parent that changed into an outside symlink', (f) => {
  const outside = path.join(f.root, 'outside');
  fs.mkdirSync(path.join(outside, 'skills'), { recursive: true });
  const before = snapshot(outside);
  const claude = path.join(f.project, '.claude');
  const installer = f.installer({ symlinkSync(target, destination, type) {
    if (path.basename(destination) === 'dev-beta') {
      fs.renameSync(claude, path.join(f.root, 'moved Claude directory'));
      fs.symlinkSync(outside, claude, 'dir');
      throw new Error('fixture parent changed during installation');
    }
    return fs.symlinkSync(target, destination, type);
  } });
  assert.throws(() => installer.apply(f.selected('dev-alpha', 'dev-beta'), f.project), /manual recovery/);
  assert.deepEqual(snapshot(outside), before);
  assert.ok(fs.lstatSync(claude).isSymbolicLink());
  f.noTemporaryArtifacts();
});

contract('relative links survive moving a project with spaces and Chinese characters', (f) => {
  const original = path.join(f.root, '中文 空格 project');
  fs.renameSync(f.project, original);
  f.project = original;
  f.target = path.join(f.project, '.agents/skills');
  f.success(f.cli('install', '--skill', 'dev-alpha'));
  f.assertAlias('dev-alpha');
  const moved = path.join(f.root, 'moved 中文 workspace');
  fs.renameSync(f.project, moved);
  f.project = moved;
  f.target = path.join(f.project, '.agents/skills');
  f.assertAlias('dev-alpha');
  const before = snapshot(f.project);
  const result = f.success(f.cli('install', '--skill', 'dev-alpha'));
  assert.match(result.stdout, /unchanged\s+dev-alpha \| preserved/);
  assert.deepEqual(snapshot(f.project), before);
});
