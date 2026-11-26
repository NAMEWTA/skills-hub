import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { interactive, formatSummary, matchesSkillSearch } from '../cli.mjs';
import { createSkillTree } from '../tree-select.mjs';
import { repositoryRoot } from '../install.mjs';
import { temporary, snapshot } from './helpers.mjs';
import { checkLatestVersion, isNpmInstallation } from '../scripts/update-cli.mjs';

const { version: currentVersion } = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'));
const newerVersion = `${BigInt(currentVersion.split('.')[0]) + 1n}.0.0`;
const reply = version => async () => ({ ok: true, json: async () => ({ name: '@namewta/skills-hub', version }) });
const offline = async () => { throw new Error('offline'); };

function context(names, confirm = true) {
  const notes = [];
  const outros = [];
  return { ui: { notes, outros, intro() {}, outro(text) { outros.push(text); }, cancel() {}, note(text) { notes.push(text); },
    confirm: async () => confirm, isCancel: value => typeof value === 'symbol',
    spinner: () => ({ start() {}, stop() {} }) }, choose: async () => names };
}

test('update checks compare stable npm versions numerically and tolerate unavailable metadata', async () => {
  for (const [version, hasUpdate] of [
    ['0.1.9', true], ['0.1.18-rc.1', true], ['0.1.18', false], ['0.1.18+build-id', false], ['0.2.0', false],
  ]) {
    assert.deepEqual(await checkLatestVersion(version, reply('0.1.18')), { latest: '0.1.18', hasUpdate }, version);
  }
  assert.equal(await checkLatestVersion('0.1.9', reply('0.1.18-beta.1')), undefined);
  assert.equal(await checkLatestVersion('0.1.9', offline), undefined);
  assert.equal(isNpmInstallation(path.join('cache', 'node_modules', '@namewta', 'skills-hub')), true);
  assert.equal(isNpmInstallation(path.join('code', 'skills-hub')), false);
});

test('startup displays both versions when no update is needed and reports lookup failures', async t => {
  const project = temporary(t, 'skills-hub version ');
  for (const [lookup, status] of [
    [reply(currentVersion), currentVersion], [reply('0.0.0'), '0.0.0'], [offline, '未检测到最新版本号'],
  ]) {
    const ctx = context(Symbol('cancel'));
    let beforeLookup;
    ctx.choose = async () => {
      assert.deepEqual(ctx.ui.notes.slice(0, 2), [currentVersion, status]);
      return Symbol('cancel');
    };
    assert.equal(await interactive({ project, ...ctx, requestVersion(...args) {
      beforeLookup = [...ctx.ui.notes];
      return lookup(...args);
    } }), 0);
    assert.deepEqual(beforeLookup, [currentVersion]);
  }
});

test('startup stops waiting at 3 seconds even if a late response body ignores abort', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const project = temporary(t, 'skills-hub version timeout ');
  const ctx = context(Symbol('cancel'));
  ctx.choose = async () => {
    assert.deepEqual(ctx.ui.notes.slice(0, 2), [currentVersion, '未检测到最新版本号']);
    return Symbol('cancel');
  };
  const headers = Promise.withResolvers();
  const body = Promise.withResolvers();
  const readingBody = Promise.withResolvers();
  let signal;
  const launch = interactive({ project, ...ctx, requestVersion(_url, options) {
    signal = options.signal;
    return headers.promise;
  } });
  assert.deepEqual(ctx.ui.notes, [currentVersion]);
  t.mock.timers.tick(2_000);
  headers.resolve({ ok: true, json() { readingBody.resolve(); return body.promise; } });
  await readingBody.promise;
  t.mock.timers.tick(999);
  assert.equal(signal.aborted, false);
  assert.deepEqual(ctx.ui.notes, [currentVersion]);
  t.mock.timers.tick(1);
  assert.equal(await launch, 0);
  assert.equal(signal.aborted, true);
  const notes = [...ctx.ui.notes];
  body.resolve({ name: '@namewta/skills-hub', version: newerVersion });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(ctx.ui.notes, notes);
});

test('declining enters the picker, next launch asks again, and accepting launches the selected version', async t => {
  const project = temporary(t, 'skills-hub update ');
  const ctx = context(Symbol('cancel'));
  let requests = 0;
  let prompts = 0;
  let picks = 0;
  ctx.ui.select = async ({ message, options, initialValue }) => {
    assert.equal(message, '是否现在更新？');
    assert.deepEqual(options.map(option => option.label), ['是，立即更新', '否，直接进入']);
    assert.equal(initialValue, false);
    assert.deepEqual(ctx.ui.notes, [currentVersion, newerVersion]);
    return ++prompts === 2;
  };
  ctx.choose = async () => { picks++; return Symbol('cancel'); };
  const launches = [];
  const options = {
    project, ...ctx, requestVersion: () => { requests++; return reply(newerVersion)(); },
    update(version, { project: target, argv }) {
      launches.push({ version, target, argv });
      return 0;
    },
  };
  assert.equal(await interactive(options), 0);
  assert.equal(picks, 1);
  ctx.ui.notes.length = 0;
  assert.equal(await interactive({ ...options, argv: ['install'] }), 0);
  assert.equal(picks, 1);
  assert.deepEqual(launches, [{ version: newerVersion, target: project, argv: ['install'] }]);
  ctx.ui.notes.length = 0;
  assert.equal(await interactive({ ...options, argv: ['install', '--dry-run'] }), 0);
  assert.equal(ctx.ui.notes[0], currentVersion);
  assert.equal(picks, 2);
  assert.equal(requests, 2);
  assert.equal(prompts, 2);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
});

test('tree skill install, repeat and preview preserve core behavior', async t => {
  const project = temporary(t, 'skills-hub cli ');
  assert.equal(await interactive({ project, argv: ['install', '--dry-run'], ...context(['dev-spec']) }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
  assert.equal(fs.existsSync(path.join(project, '.claude')), false);
  for (let i = 0; i < 2; i++) {
    if (i === 1) fs.appendFileSync(path.join(project, '.agents/skills/dev-spec/SKILL.md'), '\n旧版本内容\n');
    const ctx = context([]);
    ctx.choose = async ({ skills, initialNames }) => {
      assert.deepEqual(initialNames, i ? ['dev-spec'] : []);
      const tree = createSkillTree(skills, initialNames);
      if (!i) tree.toggle('dev-spec');
      return tree.names();
    };
    assert.equal(await interactive({ project, ...ctx }), 0);
    assert.equal(ctx.ui.notes[0], currentVersion);
    assert.ok(ctx.ui.notes.join('\n').includes(i ? 'replace' : 'install'));
    assert.match(ctx.ui.notes.join('\n'), /Windows 创建链接遇到 EPERM 时仍会安装技能/);
    assert.match(ctx.ui.notes.join('\n'), i ? /preserved\s+\.claude\/skills\/dev-spec/ : /link\s+\.claude\/skills\/dev-spec/);
    const alias = path.join(project, '.claude/skills/dev-spec');
    assert.ok(fs.lstatSync(alias).isSymbolicLink());
    assert.equal(fs.realpathSync(alias), fs.realpathSync(path.join(project, '.agents/skills/dev-spec')));
  }
  assert.ok(fs.existsSync(path.join(project, '.agents/skills/dev-spec/SKILL.md')));
  assert.ok(fs.existsSync(path.join(project, '.agents/dev/AGENTS.md')));
  assert.ok(fs.existsSync(path.join(project, '.agents/dev/archive/changes/rejected/AGENTS.md')));
  assert.equal(fs.existsSync(path.join(project, '.agents/system')), false);
  assert.equal(fs.existsSync(path.join(project, '.agents/skills-hub-licenses')), false);
});

test('one tree mixes a domain, a child exclusion and another domain leaf', async t => {
  const project = temporary(t, 'skills-hub mixed tree ');
  const ctx = context([]);
  ctx.choose = async ({ skills }) => {
    const tree = createSkillTree(skills);
    tree.toggle('@domain:dev'); tree.toggle('dev-spec'); tree.toggle('system-proxy');
    return tree.names();
  };
  assert.equal(await interactive({ project, ...ctx }), 0);
  assert.ok(fs.existsSync(path.join(project, '.agents/skills/dev-build/SKILL.md')));
  assert.ok(fs.existsSync(path.join(project, '.agents/skills/system-proxy/SKILL.md')));
  assert.ok(fs.existsSync(path.join(project, '.agents/dev/AGENTS.md')));
  assert.ok(fs.existsSync(path.join(project, '.agents/system/AGENTS.md')));
  assert.match(ctx.ui.notes.join('\n'), /\.gitignore/);
  assert.match(ctx.ui.notes.join('\n'), /\/temp\//);
  assert.equal(fs.readFileSync(path.join(project, '.gitignore'), 'utf8'), '/.agents/dev/worktree/\n/temp/\n');
  assert.equal(fs.existsSync(path.join(project, '.agents/skills/dev-spec')), false);
  assert.equal(fs.existsSync(path.join(project, '.agents/skills/system-clean')), false);
  assert.equal(fs.existsSync(path.join(project, '.claude/skills/dev-spec')), false);
  assert.ok(fs.lstatSync(path.join(project, '.claude/skills/system-proxy')).isSymbolicLink());
});

test('interactive upstream installation uses the shared installer without domain initialization', async t => {
  const project = temporary(t, 'skills-hub upstream tree ');
  const ctx = context(['zh-archify']);
  assert.equal(await interactive({ project, argv: ['install', '--dry-run'], ...ctx }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
  assert.equal(await interactive({ project, ...ctx }), 0);
  assert.ok(fs.existsSync(path.join(project, '.agents/skills/zh-archify/SKILL.md')));
  assert.deepEqual(fs.readdirSync(path.join(project, '.agents')), ['skills']);
  assert.ok(!ctx.ui.notes.some(note => note.includes('将补齐所选领域')));
  const root = path.join(project, '.agents', 'skills');
  const installed = path.join(root, 'zh-archify', 'SKILL.md');
  fs.appendFileSync(installed, '\n本地修改\n');
  fs.mkdirSync(path.join(root, 'dev-spec'));
  fs.symlinkSync(path.join(root, 'zh-archify'), path.join(root, 'system-proxy'), 'junction');
  fs.mkdirSync(path.join(root, 'unknown-skill'));
  fs.writeFileSync(path.join(root, 'unknown-skill', 'SKILL.md'), '# Unknown');
  fs.mkdirSync(path.join(project, '.claude/skills/dev-intake'));
  fs.writeFileSync(path.join(project, '.claude/skills/dev-intake/SKILL.md'), '# Personal Claude entry');
  const preview = context([]);
  preview.choose = async ({ skills, initialNames }) => {
    assert.deepEqual(initialNames, ['zh-archify']);
    assert.equal(createSkillTree(skills, initialNames).state('@domain:upstream-skills'), 'partial');
    return initialNames;
  };
  assert.equal(await interactive({ project, argv: ['install', '--dry-run'], ...preview }), 0);
  assert.match(preview.ui.notes.join('\n'), /would replace\s+zh-archify/);
  assert.match(fs.readFileSync(installed, 'utf8'), /本地修改/);
  assert.equal(await interactive({ project, ...context(['ops-inspect']) }), 0);
  assert.match(fs.readFileSync(installed, 'utf8'), /本地修改/);
  assert.equal(fs.existsSync(path.join(project, '.agents', '.skills-hub-backups')), false);
});

test('tree cancellation and declined confirmation do not write', async t => {
  const project = temporary(t, 'skills-hub tree cancel ');
  assert.equal(await interactive({ project, ...context(Symbol('cancel')) }), 0);
  assert.equal(await interactive({ project, ...context(['system-inspect'], false) }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
  assert.equal(fs.existsSync(path.join(project, '.gitignore')), false);
  assert.equal(fs.existsSync(path.join(project, '.claude')), false);
});

test('interactive link conflicts return failure and preserve the complete project', async t => {
  const project = temporary(t, 'skills-hub Claude conflict ');
  const entry = path.join(project, '.claude/skills/dev-spec');
  fs.mkdirSync(entry, { recursive: true });
  fs.writeFileSync(path.join(entry, 'SKILL.md'), 'User-owned Claude skill.\n');
  const before = snapshot(project);
  const ctx = context(['dev-spec']);
  assert.equal(await interactive({ project, argv: ['install', '--replace'], ...ctx }), 1);
  assert.deepEqual(snapshot(project), before);
  assert.match(ctx.ui.notes.join('\n'), /Claude skill entry conflict/);
  assert.match(ctx.ui.outros.join('\n'), /安装失败/);
  assert.doesNotMatch(ctx.ui.outros.join('\n'), /安装完成/);
});

test('interactive Windows EPERM reports the missing Claude link as a warning', { skip: process.platform !== 'win32' }, async t => {
  const project = temporary(t, 'skills-hub Claude permission ');
  t.mock.method(fs, 'symlinkSync', () => {
    throw Object.assign(new Error('fixture symlink permission denied'), { code: 'EPERM' });
  });
  const ctx = context(['home-doctor']);
  assert.equal(await interactive({ project, ...ctx }), 0);
  const output = ctx.ui.notes.join('\n');
  assert.match(output, /skipped\s+\.claude\/skills\/home-doctor/);
  assert.match(output, /警告.*EPERM.*管理员.*开发人员模式/);
  assert.match(ctx.ui.outros.join('\n'), /安装完成/);
  assert.ok(fs.existsSync(path.join(project, '.agents/skills/home-doctor/SKILL.md')));
  assert.ok(fs.existsSync(path.join(project, '.agents/home/AGENTS.md')));
  assert.equal(fs.lstatSync(path.join(project, '.claude/skills/home-doctor'), { throwIfNoEntry: false }), undefined);
});

test('interactive Home selection reports its local mapping rule and creates the same skill link', async t => {
  const project = temporary(t, 'skills-hub Home tree ');
  const ctx = context(['home-setup']);
  assert.equal(await interactive({ project, ...ctx }), 0);
  assert.match(ctx.ui.notes.join('\n'), /\/\.agents\/home\/local\.json/);
  assert.equal(fs.readFileSync(path.join(project, '.gitignore'), 'utf8'), '/.agents/home/local.json\n');
  assert.ok(fs.lstatSync(path.join(project, '.claude/skills/home-setup')).isSymbolicLink());
  assert.deepEqual(fs.readdirSync(path.join(project, '.agents/home')), ['AGENTS.md']);
});

test('the confirmation reports final selected domains after an installed domain is deselected', async t => {
  const project = temporary(t, 'skills-hub Home final selection ');
  assert.equal(await interactive({ project, ...context(['dev-spec']) }), 0);
  const navigation = path.join(project, '.agents/dev/AGENTS.md');
  const original = fs.readFileSync(navigation);
  const mtime = fs.statSync(navigation, { bigint: true }).mtimeNs;
  const ctx = context([]);
  ctx.choose = async ({ initialNames }) => {
    assert.deepEqual(initialNames, ['dev-spec']);
    return ['home-knowledge'];
  };
  ctx.ui.confirm = async () => {
    assert.ok(ctx.ui.notes.includes('home'));
    assert.ok(!ctx.ui.notes.includes('dev、home'));
    assert.ok(!fs.existsSync(path.join(project, '.agents/home')));
    return true;
  };
  assert.equal(await interactive({ project, ...ctx }), 0);
  assert.deepEqual(fs.readFileSync(navigation), original);
  assert.equal(fs.statSync(navigation, { bigint: true }).mtimeNs, mtime);
  assert.deepEqual(fs.readdirSync(path.join(project, '.agents/home')), ['AGENTS.md']);
});

test('search matches names, abbreviations, domains and Chinese descriptions', () => {
  const option = { value: 'dev-spec', label: 'dev-spec', hint: 'dev · 整理开发规格，定义验收标准' };
  for (const term of ['', '   ', 'SPEC', 'ｓｐｅｃ', 'dvsp', '规格', '验标', 'dev 规格', '规格 dev']) {
    assert.equal(matchesSkillSearch(term, option), true, term);
  }
  for (const term of ['proxy', '不存在', 'spec 代理', 'cep']) assert.equal(matchesSkillSearch(term, option), false, term);
});

test('non-TTY requires explicit selection; Chinese/emoji summary wraps', () => {
  const result = spawnSync(process.execPath, [path.join(repositoryRoot, 'install.mjs')], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /list or install/);
  assert.ok(formatSummary(['中文技能😀'.repeat(12)], 30).includes('\n'));
});
