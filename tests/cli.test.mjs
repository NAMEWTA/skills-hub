import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { interactive, formatSummary } from '../cli.mjs';
import { repositoryRoot } from '../install.mjs';
import { temporary } from './helpers.mjs';

function ui(answers) {
  const notes = [];
  return { notes, intro() {}, outro() {}, cancel() {}, note(text) { notes.push(text); },
    select: async () => answers.shift(), multiselect: async () => answers.shift(), confirm: async () => answers.shift(),
    isCancel: value => typeof value === 'symbol', spinner: () => ({ start() {}, stop() {} }) };
}

test('interactive skill install, repeat and preview preserve core behavior', async t => {
  const project = temporary(t, 'skills-hub cli ');
  const preview = ui(['skill', ['dev-spec'], true]);
  assert.equal(await interactive({ project, argv: ['install', '--dry-run'], ui: preview }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
  for (let i = 0; i < 2; i++) {
    const prompts = ui(['skill', ['dev-spec'], true]);
    assert.equal(await interactive({ project, ui: prompts }), 0);
    assert.ok(prompts.notes.join('\n').includes(i ? 'unchanged' : 'install'));
  }
  assert.ok(fs.existsSync(path.join(project, '.agents/skills/dev-spec/SKILL.md')));
  assert.equal(fs.existsSync(path.join(project, '.agents/skills-hub-licenses')), false);
});

test('domain selection and cancellation do not write during preview', async t => {
  const project = temporary(t, 'skills-hub cli cancel ');
  assert.equal(await interactive({ project, argv: ['install', '--dry-run'], ui: ui(['domain', ['system'], true]) }), 0);
  assert.equal(await interactive({ project, ui: ui([Symbol('cancel')]) }), 0);
  assert.equal(await interactive({ project, ui: ui(['all', false]) }), 0);
  assert.equal(fs.existsSync(path.join(project, '.agents')), false);
});

test('non-TTY requires explicit selection; Chinese/emoji summary wraps', () => {
  const result = spawnSync(process.execPath, [path.join(repositoryRoot, 'install.mjs')], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /list or install/);
  assert.ok(formatSummary(['中文技能😀'.repeat(12)], 30).includes('\n'));
});
