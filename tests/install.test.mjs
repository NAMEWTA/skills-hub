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
    const folder = path.join(this.skillRoot, domain, name);
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
  installer(overrides = {}) { return createInstaller({ repository: this.repository, fsOps: { ...fs, ...overrides } }); }
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
  assert.ok(!fs.existsSync(path.join(f.target, 'dev')));
  assert.ok(!fs.existsSync(path.join(f.repository, '.agents')));
  f.noTemporaryArtifacts();
});
contract('installation inside the source tree is rejected without writes', (f) => {
  for (const cwd of [f.skillRoot, f.sources['dev-alpha'], path.join(f.sources['dev-alpha'], 'references'), f.licenseRoot]) {
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
});
contract('all selects every domain', (f) => {
  f.success(f.cli('install', '--all'));
  assert.deepEqual(f.names(), new Set(Object.keys(f.sources)));
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
  assert.match(f.success(f.cli('install', '--domain', 'dev', '--dry-run')).stdout, /would install/);
  assert.deepEqual(snapshot(f.project), before);
  assert.ok(!fs.existsSync(path.join(f.project, '.agents')));
});
contract('dry run of a replacement does not create a backup', (f) => {
  f.seed('dev-alpha', true);
  const before = snapshot(f.project);
  assert.match(f.success(f.cli('install', '--skill', 'dev-alpha', '--replace', '--dry-run')).stdout, /would replace/);
  assert.deepEqual(snapshot(f.project), before);
});
contract('repeated installation is idempotent', (f) => {
  f.success(f.cli('install', '--all'));
  const before = snapshot(f.project);
  const sample = path.join(f.target, 'dev-alpha/SKILL.md');
  const mtime = fs.statSync(sample, { bigint: true }).mtimeNs;
  const result = f.success(f.cli('install', '--all'));
  assert.equal(result.stdout.match(/unchanged/g)?.length, Object.keys(f.sources).length);
  assert.deepEqual(snapshot(f.project), before);
  assert.equal(fs.statSync(sample, { bigint: true }).mtimeNs, mtime);
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
});
