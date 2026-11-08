import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { interactive, formatSummary, matchesSkillSearch } from '../cli.mjs';
import { createSkillTree } from '../tree-select.mjs';
import { repositoryRoot } from '../install.mjs';
import { temporary } from './helpers.mjs';

function context(names, confirm = true) {
  const notes = [];
  return { ui: { notes, intro() {}, outro() {}, cancel() {}, note(text) { notes.push(text); },
    confirm: async () => confirm, isCancel: value => typeof value === 'symbol',
    spinner: () => ({ start() {}, stop() {} }) }, choose: async () => names };
}

test('tree skill install, repeat and preview preserve core behavior', async t => {
  const project = temporary(t, 'skills-hub cli ');
  assert.equal(await interactive({ project, argv: ['install', '--dry-run'], ...context(['dev-spec']) }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
  for (let i = 0; i < 2; i++) {
    const ctx = context(['dev-spec']);
    assert.equal(await interactive({ project, ...ctx }), 0);
    assert.ok(ctx.ui.notes.join('\n').includes(i ? 'unchanged' : 'install'));
  }
  assert.ok(fs.existsSync(path.join(project, '.agents/skills/dev-spec/SKILL.md')));
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
  assert.equal(fs.existsSync(path.join(project, '.agents/skills/dev-spec')), false);
  assert.equal(fs.existsSync(path.join(project, '.agents/skills/system-clean')), false);
});

test('tree cancellation and declined confirmation do not write', async t => {
  const project = temporary(t, 'skills-hub tree cancel ');
  assert.equal(await interactive({ project, ...context(Symbol('cancel')) }), 0);
  assert.equal(await interactive({ project, ...context(['dev-spec'], false) }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
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
