import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packages = [
  { name: 'home-setup', script: 'registry.mjs', errorStatus: 2 },
  { name: 'home-route', script: 'route.mjs', errorStatus: 2 },
  { name: 'home-doctor', script: 'doctor.mjs', errorStatus: 2 },
  { name: 'home-knowledge', script: 'knowledge.mjs', helpTitle: 'Home 知识工具', errorStatus: 1 },
  { name: 'home-history', script: 'history.mjs', helpTitle: 'Home 历史工具', errorStatus: 1 },
  { name: 'home-tasks', script: 'tasks.mjs', helpTitle: 'Home 任务记录工具', errorStatus: 1 },
];

function fixture(t) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'home-cli-entry-'));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const home = path.join(temporary, '独立技能 # %');
  const canonical = path.join(home, '.agents/skills');
  const aliases = path.join(home, '.claude/skills');
  fs.mkdirSync(canonical, { recursive: true }); fs.mkdirSync(aliases, { recursive: true });
  for (const entry of packages) fs.cpSync(fileURLToPath(new URL(`../skills/home/${entry.name}`, import.meta.url)), path.join(canonical, entry.name), { recursive: true });
  return { temporary, home, canonical, aliases };
}

function run(argv) {
  const result = spawnSync(process.execPath, argv, { encoding: 'utf8', timeout: 30000 });
  assert.ifError(result.error); assert.equal(result.signal, null, JSON.stringify(result));
  return result;
}

test('standalone Home CLIs run help and read-only commands through real installed directory symlinks', async t => {
  const { temporary, home, canonical, aliases } = fixture(t);
  for (const entry of packages) {
    try { fs.symlinkSync(path.relative(aliases, path.join(canonical, entry.name)), path.join(aliases, entry.name), 'dir'); }
    catch (error) {
      if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('本环境不能建立真实目录符号链接'); return; }
      throw error;
    }
  }
  const project = path.join(temporary, '项目 甲'); fs.mkdirSync(project);
  const git = spawnSync('git', ['init', '-b', 'main', project], { encoding: 'utf8' });
  assert.ifError(git.error); assert.equal(git.status, 0, git.stderr);
  for (const entry of packages) await t.test(entry.name, () => {
    const script = path.join(aliases, entry.name, 'scripts', entry.script);
    const help = run([script, '--help']);
    assert.equal(help.status, 0, help.stderr); assert.equal(help.stderr, ''); assert.ok(help.stdout.includes(entry.helpTitle || entry.script), help.stdout);
    const argv = entry.name === 'home-setup' ? ['inspect', '--home', home]
      : entry.name === 'home-route' ? ['--inspect', project]
      : entry.name === 'home-doctor' ? ['--home', home]
      : entry.name === 'home-tasks' ? ['list', '--home', home]
      : ['query', '--home', home, '--text', '没有资料'];
    const result = run([script, ...argv]);
    assert.equal(result.status, entry.name === 'home-doctor' ? 1 : 0, result.stderr); assert.equal(result.stderr, '');
    assert.match(result.stdout, /\S/u, `${entry.name} 必须实际运行入口并输出 JSON`);
    const output = JSON.parse(result.stdout);
    if (entry.name === 'home-setup') assert.equal(output.registryRevision, 'absent');
    else if (entry.name === 'home-route') {
      assert.equal(output.status, 'inspected'); assert.equal(output.contextRead, false);
      assert.equal(output.actualCheckout, fs.realpathSync.native(project)); assert.equal(output.requestedPathIsGitRoot, true);
    } else if (entry.name === 'home-doctor') {
      assert.equal(output.status, 'issues'); assert.ok(output.findings.some(item => item.code === 'HOME_ENTRY_MISSING'));
    } else if (entry.name === 'home-tasks') assert.deepEqual(output, []);
    else { assert.deepEqual(output.entries, []); assert.equal(output.complete, true); }
    const invalid = run([script, '--unknown']);
    assert.equal(invalid.status, entry.errorStatus, JSON.stringify(invalid)); assert.equal(invalid.stdout, '');
    assert.equal(typeof JSON.parse(invalid.stderr).message, 'string');
    assert.equal(fs.existsSync(path.join(home, '.agents/home')), false);
  });
  const navigation = path.join(home, '.agents/home/AGENTS.md');
  fs.mkdirSync(path.dirname(navigation), { recursive: true });
  fs.writeFileSync(navigation, fs.readFileSync(new URL('../scripts/persistence/home.md', import.meta.url)));
  const repaired = run([path.join(aliases, 'home-doctor/scripts/doctor.mjs'), '--home', home]);
  assert.equal(repaired.status, 0, repaired.stderr);
  const repairedOutput = JSON.parse(repaired.stdout);
  assert.equal(repairedOutput.status, 'clear-within-scope');
  assert.deepEqual(repairedOutput.findings, []);
});

test('importing standalone Home modules does not run their CLIs with existing, absent or nonexistent argv paths', t => {
  const { home, canonical } = fixture(t);
  const urls = packages.map(entry => pathToFileURL(path.join(canonical, entry.name, 'scripts', entry.script)).href);
  const code = `for (const url of ${JSON.stringify(urls)}) {
    const module = await import(url);
    if (typeof module.main !== 'function') throw new Error('Missing main export');
  }
  if (process.exitCode !== undefined) throw new Error('Import ran a CLI');
  console.log('imported');`;
  const importer = path.join(home, 'importer.mjs'); fs.writeFileSync(importer, code);
  const cases = [
    [importer, '--help'],
    ['--input-type=module', '-e', code],
    ['--input-type=module', '-e', `process.argv = [process.execPath, ${JSON.stringify(path.join(home, 'missing-entry.mjs'))}, '--help'];\n${code}`],
  ];
  for (const argv of cases) {
    const result = run(argv); assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, 'imported\n'); assert.equal(result.stderr, '');
  }
  assert.equal(fs.existsSync(path.join(home, '.agents/home')), false);
});
