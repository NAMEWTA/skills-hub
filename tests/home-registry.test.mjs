import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inspectRegistry, saveRegistry, validateRegistry, validateLocal } from '../skills/home/home-setup/scripts/registry.mjs';

const script = fileURLToPath(new URL('../skills/home/home-setup/scripts/registry.mjs', import.meta.url));
function fixture(t) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'home-registry-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  return { home, file: relative => path.join(home, '.agents/home', relative) };
}
const registry = (purpose = '项目甲的用途') => ({ formatVersion: 1, repos: [{ id: 'project-a', purpose, aliases: ['项目 甲'], groups: ['产品'], remote: 'https://git.example.invalid/team/project-a.git', localPath: '../项目 甲', intent: 'work' }] });
const expectations = current => ({ expectedRevision: current.registryRevision, expectedMapRevision: current.mapRevision });
function run(argv) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, argv, { stdio: ['ignore', 'pipe', 'pipe'] }); let stdout = '', stderr = '';
    child.stdout.on('data', text => stdout += text); child.stderr.on('data', text => stderr += text);
    child.once('error', reject); child.once('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
}
function symlink(t, source, target, type = 'dir') {
  try { fs.symlinkSync(source, target, type); return true; }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('本环境不能建立符号链接'); return false; } throw error; }
}

test('read-only inspect does not initialize business data; save creates one source and an idempotent Unicode map', t => {
  const { home, file } = fixture(t);
  const initial = inspectRegistry(home);
  assert.equal(initial.registryRevision, 'absent'); assert.equal(initial.mapStatus, 'absent'); assert.equal(fs.existsSync(path.join(home, '.agents')), false);
  const saved = saveRegistry(home, registry(), expectations(initial)); assert.equal(saved.status, 'saved'); assert.equal(saved.identityVerified, false);
  const current = inspectRegistry(home); assert.equal(current.mapStatus, 'current');
  const map = fs.readFileSync(file('repos.md'), 'utf8'); assert.match(map, /项目甲的用途/); assert.match(map, /%E9%A1%B9%E7%9B%AE%20%E7%94%B2/);
  assert.equal(saveRegistry(home, registry(), expectations(current)).status, 'unchanged');
  assert.deepEqual(fs.readdirSync(file('')).sort(), ['repos.json', 'repos.md']);
});

test('unknown versions, invalid identities, secrets and local non-path overrides fail before writes', t => {
  const { home } = fixture(t);
  assert.throws(() => validateRegistry({ formatVersion: 2, repos: [] }), { code: 'REGISTRY_VERSION' });
  const duplicate = registry(); duplicate.repos.push({ ...duplicate.repos[0] }); assert.throws(() => validateRegistry(duplicate), { code: 'DUPLICATE_ID' });
  const withSecret = registry(); withSecret.repos[0].remote = 'https://private-token@git.example.invalid/team/repo'; assert.throws(() => validateRegistry(withSecret), { code: 'SECRET_REMOTE' });
  for (const invalid of [null, { formatVersion: 1, paths: {}, model: 'fabricated' }, { formatVersion: 1, paths: { unknown: '/somewhere' } }]) assert.throws(() => validateLocal(invalid, registry()));
  const background = registry(); background.repos[0].backgroundRef = '../other-project/private.md'; assert.throws(() => validateRegistry(background), { code: 'INVALID_BACKGROUND' });
  assert.equal(fs.existsSync(path.join(home, '.agents')), false);
});

test('stale source and map revisions preserve intervening changes, and handwritten maps are not overwritten', t => {
  const { home, file } = fixture(t);
  const before = inspectRegistry(home); saveRegistry(home, registry(), expectations(before));
  assert.throws(() => saveRegistry(home, registry('旧稿'), expectations(before)), { code: 'STALE_WRITE' });
  const current = inspectRegistry(home); fs.writeFileSync(file('repos.md'), '# 用户原有地图\n');
  assert.throws(() => saveRegistry(home, registry('新稿'), expectations(current)), { code: 'STALE_WRITE' });
  assert.throws(() => saveRegistry(home, registry(), expectations(inspectRegistry(home))), { code: 'UNMANAGED_MAP' });
  assert.equal(fs.readFileSync(file('repos.md'), 'utf8'), '# 用户原有地图\n');
});

test('map-only rebuild rechecks the source inside its write lock and preserves a newer registry', t => {
  const { home, file } = fixture(t);
  saveRegistry(home, registry(), expectations(inspectRegistry(home))); fs.unlinkSync(file('repos.md'));
  const current = inspectRegistry(home); const newer = `${JSON.stringify(registry('另一个写者的新事实'), null, 2)}\n`;
  const fsOps = { openSync(filename, ...args) {
    const fd = fs.openSync(filename, ...args);
    if (filename.endsWith('.registry-write.lock')) fs.writeFileSync(file('repos.json'), newer);
    return fd;
  } };
  assert.throws(() => saveRegistry(home, current.registry, { ...expectations(current), mapOnly: true, fsOps }), { code: 'STALE_WRITE' });
  assert.equal(fs.readFileSync(file('repos.json'), 'utf8'), newer); assert.equal(fs.existsSync(file('repos.md')), false); assert.equal(fs.existsSync(file('.registry-write.lock')), false);
  const latest = inspectRegistry(home); saveRegistry(home, latest.registry, { ...expectations(latest), mapOnly: true });
  assert.equal(inspectRegistry(home).mapStatus, 'current'); assert.match(fs.readFileSync(file('repos.md'), 'utf8'), /另一个写者的新事实/);
});

test('linked Home roots, data parents and registry files are rejected without modifying targets', t => {
  const { home, file } = fixture(t); const external = path.join(home, 'external'); fs.mkdirSync(external);
  const alias = path.join(home, 'alias'); if (!symlink(t, external, alias)) return;
  assert.throws(() => inspectRegistry(alias), { code: 'UNSAFE_HOME' });
  if (!symlink(t, external, path.join(home, '.agents'))) return;
  assert.throws(() => saveRegistry(home, registry(), { expectedRevision: 'absent', expectedMapRevision: 'absent' }), { code: 'UNSAFE_PARENT' });
  assert.deepEqual(fs.readdirSync(external), []); fs.unlinkSync(path.join(home, '.agents')); fs.mkdirSync(file(''), { recursive: true });
  const outsideFile = path.join(external, 'registry.json'); fs.writeFileSync(outsideFile, JSON.stringify(registry()));
  if (!symlink(t, outsideFile, file('repos.json'), 'file')) return;
  assert.throws(() => inspectRegistry(home), { code: 'UNSAFE_FILE' }); assert.equal(fs.readFileSync(outsideFile, 'utf8'), JSON.stringify(registry()));
});

test('real concurrent writers cannot both save the same absent source, and locks are not reclaimed implicitly', async t => {
  const { home, file } = fixture(t); const input = path.join(home, 'candidate.json'); fs.writeFileSync(input, JSON.stringify(registry()));
  const argv = [script, 'save', '--home', home, '--input', input, '--expect', 'absent', '--expect-map', 'absent'];
  const results = await Promise.all([run(argv), run(argv)]); assert.equal(results.filter(result => result.code === 0).length, 1, JSON.stringify(results));
  assert.match(results.find(result => result.code !== 0).stderr, /WRITE_BUSY|STALE_WRITE/);
  assert.equal(inspectRegistry(home).mapStatus, 'current');
  fs.writeFileSync(file('.registry-write.lock'), '需核实原写入者\n');
  assert.throws(() => saveRegistry(home, registry('需要修改'), expectations(inspectRegistry(home))), { code: 'WRITE_BUSY' });
  assert.equal(fs.readFileSync(file('.registry-write.lock'), 'utf8'), '需核实原写入者\n');
});

test('a standalone copied registry package runs without skills-hub source imports', async t => {
  const { home } = fixture(t); const isolated = path.join(home, 'standalone'); fs.mkdirSync(isolated); fs.copyFileSync(script, path.join(isolated, 'registry.mjs'));
  const result = await run([path.join(isolated, 'registry.mjs'), 'inspect', '--home', home]);
  assert.equal(result.signal, null, JSON.stringify(result)); assert.equal(result.code, 0, JSON.stringify(result));
  assert.match(result.stdout, /\S/u, '独立包的 inspect CLI 必须输出 JSON，不能静默跳过入口。');
  assert.equal(JSON.parse(result.stdout).registryRevision, 'absent');
});
