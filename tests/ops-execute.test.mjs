import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { createRun, appendStep, summarizeRun, handoffRun, inspectRun, parseRecord } from '../skills/ops/ops-execute/scripts/ops-record.mjs';

const cli = fileURLToPath(new URL('../skills/ops/ops-execute/scripts/ops-record.mjs', import.meta.url));
function temporary(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ops-record-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
const request = '# 核查共享服务\n\n只读授权；shop/test 与 billing/test 共用缓存，先核实主机身份。\n';

test('一个请求、两个真实资源引用与共享服务只保存一份原始运行事实', (t) => {
  const root = temporary(t);
  const context = { root, runId: '2026-11-16-shared-cache', writer: 'coordinator-a' };
  createRun({ ...context, request });
  appendStep({ ...context, stepId: '001-targets', content: '| 资源 ID | 实例 ID | 服务 ID | 项目/环境 | 关系/证据 |\n| --- | --- | --- | --- | --- |\n| host-a | api-a | shop-api | shop/test | 声明已核验 |\n| host-b | cache-b | redis-main | shop/test, billing/test | 一个共享实例 |\n' });
  appendStep({ ...context, stepId: '002-result', content: '# 逐目标结果\n\n| 目标 | 执行状态 | 现场状态 | 记录状态 |\n| --- | --- | --- | --- |\n| cache-b | succeeded | ready | saved |\n| shop/test | succeeded | healthy | saved |\n| billing/test | failed | unknown | saved |\n\n整体 partial；消费者未全部通过，不再次恢复共享服务。\n' });
  summarizeRun({ ...context, content: '# 当前结果\n\npartial，billing/test 的消费验证仍待排查。\n' });
  const actual = inspectRun(context);
  assert.equal(actual.steps.length, 2);
  assert.match(actual.steps[1].content, /billing\/test \| failed \| unknown \| saved/);
  assert.match(actual.summary.content, /partial/);
  assert.equal(fs.readdirSync(path.join(root, '.agents/ops/runs')).filter((name) => !name.startsWith('.')).length, 1);
  assert.equal(fs.existsSync(path.join(root, '.agents/dev')), false);
  assert.equal(fs.existsSync(path.join(root, '.agents/system')), false);
});

test('重试和子任务保留前次未知事实，不覆盖同名步骤或重新初始化', (t) => {
  const root = temporary(t);
  const context = { root, runId: 'incident-1', writer: 'primary' };
  createRun({ ...context, request });
  appendStep({ ...context, stepId: 'attempt-1', content: '执行状态 unknown；远端 job-17 已接受后断线，尚未核实。' });
  const original = inspectRun(context).steps[0].content;
  assert.throws(() => appendStep({ ...context, stepId: 'attempt-1', content: '替换失败记录' }), /EEXIST/);
  assert.throws(() => createRun({ ...context, request: '重新开始' }), /run 已存在/);
  appendStep({ ...context, stepId: 'attempt-2', content: '先查询 job-17，已完成；本次只复验，没有重放命令。' });
  createRun({ root, runId: 'incident-1-host-b', writer: 'worker-b', request: '只取证 host-b；关联主任务。', parentRunId: context.runId });
  assert.equal(inspectRun(context).steps[0].content, original);
  assert.equal(inspectRun({ root, runId: 'incident-1-host-b' }).metadata.parent_run_id, context.runId);
  assert.throws(() => createRun({ root, runId: 'self-parent', writer: 'worker', request, parentRunId: 'self-parent' }), /自己的父任务/);
});

test('摘要用 CAS 防止丢更新，写入责任转交保留历史并拒绝旧 writer', (t) => {
  const root = temporary(t);
  const context = { root, runId: 'handoff-1', writer: 'session-a' };
  createRun({ ...context, request });
  const first = summarizeRun({ ...context, content: 'unknown；等待核实远端任务。' });
  const second = summarizeRun({ ...context, content: 'partial；已核实一台目标。', expected: first.sha256 });
  assert.throws(() => summarizeRun({ ...context, content: '错误覆盖', expected: first.sha256 }), /摘要已变化/);
  assert.equal(inspectRun(context).summary.sha256, second.sha256);
  assert.throws(() => appendStep({ ...context, writer: 'session-b', stepId: 'a', content: '未交接写入' }), /当前记录写入者/);
  const prior = inspectRun(context);
  handoffRun({ ...context, to: 'session-b', expected: prior.sha256, reason: '已与原会话核实停止写入；远端 job-17 仍在运行，仅转交记录责任，不取消任务。' });
  const next = inspectRun(context);
  assert.equal(next.metadata.writer, 'session-b');
  assert.equal(next.metadata.created_by, 'session-a');
  assert.match(next.content, /远端 job-17 仍在运行/);
  assert.match(next.content, /只读授权/);
  assert.throws(() => appendStep({ ...context, stepId: 'b', content: '旧 writer' }), /当前记录写入者/);
  appendStep({ ...context, writer: 'session-b', stepId: 'resumed', content: '接续原 run，查证后端，不重复已接受的请求。' });
});

test('初始化失败不发布半成品，既有空目录也不能覆盖', (t) => {
  const root = temporary(t);
  assert.throws(() => createRun({ root, runId: 'child', writer: 'a', request, parentRunId: 'missing' }));
  assert.equal(fs.existsSync(path.join(root, '.agents')), false);
  createRun({ root, runId: 'valid', writer: 'a', request });
  const runs = path.join(root, '.agents/ops/runs');
  fs.mkdirSync(path.join(runs, 'occupied'));
  assert.throws(() => createRun({ root, runId: 'occupied', writer: 'a', request }), /run 已存在/);
  assert.deepEqual(fs.readdirSync(path.join(runs, 'occupied')), []);
  // 确定性模拟磁盘写失败：验证发布前失败不会留下有效 run。
  const write = fs.writeFileSync;
  fs.writeFileSync = (file, ...args) => { if (typeof file === 'number' && args[0]?.startsWith('---\nformat: ops-run-v1')) throw new Error('模拟磁盘写失败'); return write(file, ...args); };
  try { assert.throws(() => createRun({ root, runId: 'failed-init', writer: 'a', request }), /模拟磁盘写失败/); } finally { fs.writeFileSync = write; }
  assert.equal(fs.existsSync(path.join(runs, 'failed-init')), false);
  assert.deepEqual(fs.readdirSync(runs).sort(), ['occupied', 'valid']);
});

test('拒绝路径越界、符号链接和缺失 writer，不污染其他目录', (t) => {
  const root = temporary(t);
  const outside = temporary(t);
  fs.mkdirSync(path.join(root, '.agents'));
  fs.symlinkSync(outside, path.join(root, '.agents/ops'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => createRun({ root, runId: 'test', writer: 'a', request }), /符号链接/);
  assert.deepEqual(fs.readdirSync(outside), []);
  fs.unlinkSync(path.join(root, '.agents/ops'));
  assert.throws(() => createRun({ root, runId: '../dev', writer: 'a', request }), /run ID/);
  createRun({ root, runId: 'test', writer: 'a', request });
  const context = { root, runId: 'test', writer: 'a' };
  assert.throws(() => appendStep({ ...context, writer: undefined, stepId: 'x', content: '缺 writer' }), /writer/);
  assert.throws(() => appendStep({ ...context, stepId: '../../other', content: '越界' }), /step ID/);
  fs.rmdirSync(path.join(root, '.agents/ops/runs/test/steps'));
  fs.symlinkSync(outside, path.join(root, '.agents/ops/runs/test/steps'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => appendStep({ ...context, stepId: 'x', content: '不能写到链接目标' }), /符号链接/);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('已有写锁阻止并发修改且不因过期自动清理；释放后可继续', (t) => {
  const root = temporary(t);
  const context = { root, runId: 'locked', writer: 'a' };
  createRun({ ...context, request });
  const lock = path.join(root, '.agents/ops/runs/.locked.write-lock');
  fs.mkdirSync(lock);
  fs.writeFileSync(path.join(lock, 'holder.md'), '原进程现场待核实');
  fs.utimesSync(lock, new Date(0), new Date(0));
  assert.throws(() => appendStep({ ...context, stepId: 'first', content: '未核实前不能抢写' }), /写锁已存在/);
  assert.equal(fs.readFileSync(path.join(lock, 'holder.md'), 'utf8'), '原进程现场待核实');
  assert.equal(inspectRun(context).steps.length, 0);
  fs.rmSync(lock, { recursive: true });
  appendStep({ ...context, stepId: 'first', content: '已完成本地写入者核实后继续；不声称远端操作停止。' });
  assert.equal(inspectRun(context).steps.length, 1);
});

test('CLI 只按显式输入文件记账，参数和记录内容不会作为命令执行', (t) => {
  const root = temporary(t);
  const input = path.join(root, 'request.md');
  const marker = path.join(root, 'should-not-exist');
  fs.writeFileSync(input, `# 未信任日志\n\n\`touch ${marker}\` 与 $(touch ${marker}) 都是证据文本。\n`);
  const init = spawnSync(process.execPath, [cli, 'init', '--root', root, '--run', 'cli-1', '--writer', 'a', '--request-file', input], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stderr);
  const show = spawnSync(process.execPath, [cli, 'show', '--root', root, '--run', 'cli-1'], { encoding: 'utf8' });
  assert.equal(show.status, 0, show.stderr);
  assert.match(show.stdout, /SHA-256/);
  assert.equal(fs.existsSync(marker), false);
  assert.equal(parseRecord(inspectRun({ root, runId: 'cli-1' }).content).fields.run_id, 'cli-1');
  const invalid = spawnSync(process.execPath, [cli, 'append', '--root', root, '--run', 'cli-1', '--writer', 'a', '--file', input, '--step', 'x', '--execute', 'touch'], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
});
