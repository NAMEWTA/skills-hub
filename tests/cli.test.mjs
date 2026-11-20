import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { interactive, formatSummary, matchesSkillSearch } from '../cli.mjs';
import { createSkillTree } from '../tree-select.mjs';
import { repositoryRoot } from '../install.mjs';
import { temporary } from './helpers.mjs';
import { latestUpdate, isNpmInstallation } from '../scripts/update-cli.mjs';

function context(names, confirm = true) {
  const notes = [];
  return { ui: { notes, intro() {}, outro() {}, cancel() {}, note(text) { notes.push(text); },
    confirm: async () => confirm, isCancel: value => typeof value === 'symbol',
    spinner: () => ({ start() {}, stop() {} }) }, choose: async () => names };
}

test('update checks compare stable npm versions numerically and tolerate unavailable metadata', async () => {
  const reply = version => async () => ({ ok: true, json: async () => ({ name: '@namewta/skills-hub', version }) });
  assert.equal(await latestUpdate('0.1.9', reply('0.1.18')), '0.1.18');
  assert.equal(await latestUpdate('0.1.18', reply('0.1.18')), undefined);
  assert.equal(await latestUpdate('0.2.0', reply('0.1.18')), undefined);
  assert.equal(await latestUpdate('0.1.9', reply('0.1.18-beta.1')), undefined);
  assert.equal(await latestUpdate('0.1.9', async () => { throw new Error('offline'); }), undefined);
  assert.equal(isNpmInstallation(path.join('cache', 'node_modules', '@namewta', 'skills-hub')), true);
  assert.equal(isNpmInstallation(path.join('code', 'skills-hub')), false);
});

test('skipping prompts again next launch and accepting launches the selected version', async t => {
  const project = temporary(t, 'skills-hub update ');
  const ctx = context(['dev-spec'], false);
  let prompts = 0;
  ctx.ui.select = async () => ++prompts === 2;
  const launches = [];
  const options = {
    project, ...ctx, checkUpdate: async () => '9.0.0',
    update(version, { project: target, argv }) {
      launches.push({ version, target, argv });
      return 0;
    },
  };
  assert.equal(await interactive(options), 0);
  assert.equal(await interactive({ ...options, argv: ['install'] }), 0);
  assert.equal(await interactive({ ...options, argv: ['install', '--dry-run'] }), 0);
  assert.equal(prompts, 2);
  assert.deepEqual(launches, [{ version: '9.0.0', target: project, argv: ['install'] }]);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
});

test('tree skill install, repeat and preview preserve core behavior', async t => {
  const project = temporary(t, 'skills-hub cli ');
  assert.equal(await interactive({ project, argv: ['install', '--dry-run'], ...context(['dev-spec']) }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
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
    assert.ok(ctx.ui.notes.join('\n').includes(i ? 'replace' : 'install'));
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
  assert.equal(fs.readFileSync(path.join(project, '.gitignore'), 'utf8'), '/.agents/dev/worktree/\n/.agents/system/ignore/\n');
  assert.equal(fs.existsSync(path.join(project, '.agents/skills/dev-spec')), false);
  assert.equal(fs.existsSync(path.join(project, '.agents/skills/system-clean')), false);
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
