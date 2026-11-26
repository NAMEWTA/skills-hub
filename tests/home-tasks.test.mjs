import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { run } from '../skills/home/home-tasks/scripts/tasks.mjs';

const script = fileURLToPath(new URL('../skills/home/home-tasks/scripts/tasks.mjs', import.meta.url));
const alpha = '2026-11-26-integrate';
const beta = '2026-11-26-independent';
const first = 'task_01.md';
const second = 'task_02.md';

function fixture(t) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'home-tasks-fixture-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const root = path.join(home, '.agents', 'home', 'coordination');
  const input = path.join(home, 'input.md');
  fs.writeFileSync(input, '# 短消息\n\n输入与验收见项目记录。\n');
  const tool = (command, options = {}) => run(command, { home, input, evidence: '本次实际证据位置', title: '集成验证', ...options });
  const state = (topic, task, repo, value, expect = tool('show', { topic }).messages.find(message => message.name === task).targets.find(item => item.repo === repo).revision) => tool('state', { topic, task, repo, state: value, expect });
  const setup = (topic, repos) => {
    tool('init', { topic });
    return tool('task', { topic, repos });
  };
  const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
  return { home, root, tool, setup, state, read };
}

test('one batch may target several repos, and each reply has its own number', t => {
  const { tool, setup, state, read } = fixture(t);
  assert.equal(setup(alpha, 'project-a,project-b').task, first);
  assert.equal(tool('show', { topic: alpha }).status, 'pending');
  assert.throws(() => tool('report', { topic: alpha, task: first, repo: 'project-a', kind: 'result' }), { code: 'STATE' });
  tool('reserve', { topic: alpha, task: first, repo: 'project-a' });
  state(alpha, first, 'project-a', 'running');
  assert.equal(tool('report', { topic: alpha, task: first, repo: 'project-a', kind: 'progress' }).report, 'report_01.md');
  assert.equal(tool('report', { topic: alpha, task: first, repo: 'project-a', kind: 'question' }).report, 'report_02.md');
  assert.equal(state(alpha, first, 'project-a', 'blocked').status, 'blocked');
  assert.throws(() => tool('report', { topic: alpha, task: first, repo: 'project-c', kind: 'result' }), { code: 'NOT_FOUND' });
  assert.equal(tool('task', { topic: alpha, repos: 'project-a', previous: first, 'reply-to': 'report_02.md' }).task, second);
  tool('reserve', { topic: alpha, task: second, repo: 'project-a' });
  const view = tool('show', { topic: alpha });
  assert.equal(view.messages.length, 2);
  assert.deepEqual(view.messages[0].reports.map(report => report.name), ['report_01.md', 'report_02.md']);
  assert.equal(view.messages[0].targets[1].state, 'pending');
  assert.equal(view.messages[1].replyTo, 'report_02.md');
  assert.match(read(`${alpha}/task_01.md`), /输入与验收/u);
  assert.match(read(`${alpha}/status.tsv`), /task_01\.md\tblocked\tproject-a,project-b\tproject-a=blocked,project-b=pending\tproject-a=report_01\.md,project-a=report_02\.md/u);
  assert.match(read('all.status.tsv'), /project-a,project-b\tproject-a=running,project-b=pending/u);
});

test('unknown delivery holds only its project and stale observations cannot authorize a retry', t => {
  const { tool, setup, state } = fixture(t);
  setup(alpha, 'project-a');
  setup(beta, 'project-a,project-b');
  const hold = tool('reserve', { topic: alpha, task: first, repo: 'project-a' }).target;
  state(alpha, first, 'project-a', 'unknown', hold.revision);
  assert.throws(() => state(alpha, first, 'project-a', 'running', hold.revision), { code: 'STALE' });
  assert.throws(() => tool('reserve', { topic: beta, task: first, repo: 'project-a' }), { code: 'OCCUPIED' });
  assert.throws(() => tool('release', { topic: alpha, repo: 'project-a' }), { code: 'STATE' });
  assert.equal(tool('reserve', { topic: beta, task: first, repo: 'project-b' }).status, 'reserved');
  assert.throws(() => state(alpha, first, 'project-a', 'done'), { code: 'EVIDENCE' });
  state(alpha, first, 'project-a', 'cancelled');
  tool('release', { topic: alpha, repo: 'project-a' });
  tool('close', { topic: alpha, state: 'cancelled' });
  assert.equal(tool('reserve', { topic: beta, task: first, repo: 'project-a' }).status, 'reserved');
});

test('terminal report awaits Home acceptance and indexes can recover without changing source', t => {
  const { tool, setup, state, read, root } = fixture(t);
  setup(alpha, 'project-a');
  tool('reserve', { topic: alpha, task: first, repo: 'project-a' });
  state(alpha, first, 'project-a', 'running');
  tool('report', { topic: alpha, task: first, repo: 'project-a', kind: 'result' });
  assert.equal(tool('show', { topic: alpha }).status, 'running');
  state(alpha, first, 'project-a', 'done');
  assert.throws(() => tool('close', { topic: alpha, state: 'done' }), { code: 'OCCUPIED' });
  assert.equal(tool('project', { repo: 'project-a' }).occupiedBy, alpha);
  tool('release', { topic: alpha, repo: 'project-a' });
  assert.equal(tool('show', { topic: alpha }).status, 'running');
  tool('close', { topic: alpha, state: 'done' });
  assert.equal(tool('show', { topic: alpha }).status, 'done');
  const sourceBefore = read(`${alpha}/topic.md`);
  const statusBefore = read(`${alpha}/status.tsv`);
  const allBefore = read('all.status.tsv');
  fs.unlinkSync(path.join(root, alpha, 'status.tsv'));
  fs.unlinkSync(path.join(root, 'all.status.tsv'));
  assert.equal(tool('list').length, 1);
  assert.equal(fs.existsSync(path.join(root, 'all.status.tsv')), false);
  tool('rebuild');
  assert.equal(read(`${alpha}/topic.md`), sourceBefore);
  assert.equal(read(`${alpha}/status.tsv`), statusBefore);
  assert.equal(read('all.status.tsv'), allBefore);
  assert.throws(() => tool('task', { topic: alpha, repos: 'project-a' }), { code: 'CLOSED' });
});

test('verified non-delivery allows release without deleting a pending task', t => {
  const { tool, setup, state } = fixture(t);
  setup(alpha, 'project-a');
  setup(beta, 'project-a');
  tool('reserve', { topic: alpha, task: first, repo: 'project-a' });
  state(alpha, first, 'project-a', 'unknown');
  state(alpha, first, 'project-a', 'pending');
  tool('release', { topic: alpha, repo: 'project-a' });
  assert.equal(tool('show', { topic: alpha }).messages[0].targets[0].state, 'pending');
  assert.equal(tool('reserve', { topic: beta, task: first, repo: 'project-a' }).status, 'reserved');
});

test('view collision and a reply written before refresh preserve source numbering', t => {
  const { tool, setup, read, root } = fixture(t);
  setup(alpha, 'project-a');
  tool('reserve', { topic: alpha, task: first, repo: 'project-a' });
  fs.writeFileSync(path.join(root, 'all.status.tsv'), '手写表\n');
  const saved = tool('report', { topic: alpha, task: first, repo: 'project-a', kind: 'progress' });
  assert.equal(saved.views, 'needs-rebuild');
  assert.equal(saved.report, 'report_01.md');
  assert.equal(read('all.status.tsv'), '手写表\n');
  assert.equal(tool('show', { topic: alpha }).messages[0].reports.length, 1);
  assert.throws(() => tool('rebuild'), { code: 'UNMANAGED_VIEW' });
  fs.unlinkSync(path.join(root, 'all.status.tsv'));
  assert.equal(tool('report', { topic: alpha, task: first, repo: 'project-a', kind: 'result' }).report, 'report_02.md');
  assert.equal(tool('show', { topic: alpha }).messages[0].reports.length, 2);
});

test('two concurrent sessions cannot both reserve the same repo in different topics', async t => {
  const { home, tool, setup } = fixture(t);
  setup(alpha, 'project-a');
  setup(beta, 'project-a');
  const started = [alpha, beta].map(topic => new Promise((resolve, reject) => {
    execFile(process.execPath, [script, 'reserve', '--home', home, '--topic', topic, '--task', first, '--repo', 'project-a', '--evidence', '路由已核对'], (error, stdout, stderr) => {
      try { resolve(error ? { topic, ...JSON.parse(stderr) } : JSON.parse(stdout)); }
      catch (parseError) { reject(parseError); }
    });
  }));
  const results = await Promise.all(started);
  assert.equal(results.filter(result => result.status === 'reserved').length, 1);
  const denied = results.find(result => result.status !== 'reserved');
  assert.ok(['BUSY', 'OCCUPIED'].includes(denied.code));
  assert.throws(() => tool('reserve', { topic: denied.topic, task: first, repo: 'project-a' }), { code: 'OCCUPIED' });
});

test('old coordination pages are preserved and read-only queries create no files', t => {
  const { home, root, tool, read } = fixture(t);
  assert.deepEqual(tool('list'), []);
  assert.equal(fs.existsSync(path.join(home, '.agents')), false);
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, 'legacy.md'), '# 旧协调入口\n');
  assert.deepEqual(tool('list'), []);
  assert.throws(() => tool('init', { topic: '2026-02-30-invalid' }), { code: 'ARGUMENT' });
  assert.throws(() => tool('init', { topic: '../outside' }), { code: 'ARGUMENT' });
  tool('init', { topic: alpha });
  assert.equal(read('legacy.md'), '# 旧协调入口\n');
});

test('missing source for an existing numbered record cannot hide project occupancy', t => {
  const { tool, setup, root } = fixture(t);
  setup(alpha, 'project-a');
  setup(beta, 'project-a');
  tool('reserve', { topic: alpha, task: first, repo: 'project-a' });
  fs.unlinkSync(path.join(root, alpha, 'topic.md'));
  assert.throws(() => tool('project', { repo: 'project-a' }), { code: 'FORMAT' });
  assert.throws(() => tool('reserve', { topic: beta, task: first, repo: 'project-a' }), { code: 'FORMAT' });
});
