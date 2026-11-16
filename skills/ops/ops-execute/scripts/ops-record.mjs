#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// 仅保存本地 Markdown 事实；不运行远端命令，不判断生产授权或服务健康。
const ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/;
const MAX_INPUT = 1024 * 1024;
const MAX_RECORD = 16 * 1024 * 1024;
const decoder = new TextDecoder('utf-8', { fatal: true });
export class RecordError extends Error {}
export const sha256 = (text) => createHash('sha256').update(text).digest('hex');

function identifier(value, label) {
  if (typeof value !== 'string' || !ID.test(value)) throw new RecordError(`${label} 必须是 1–96 位字母、数字、点、下划线或连字符，首位为字母或数字`);
  return value;
}

function markdown(value, label) {
  if (typeof value !== 'string' || !value.trim() || Buffer.byteLength(value) > MAX_INPUT || value.includes('\0')) throw new RecordError(`${label} 必须是非空 UTF-8 Markdown，最多 1 MiB，不能含 NUL`);
  return `${value.trimEnd()}\n`;
}

function noLinks(directory, { create = false } = {}) {
  const resolved = path.resolve(directory);
  const root = path.parse(resolved).root;
  let current = root;
  for (const part of resolved.slice(root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    let stat = fs.lstatSync(current, { throwIfNoEntry: false });
    if (!stat && create) {
      try { fs.mkdirSync(current, { mode: 0o700 }); } catch (error) { if (error.code !== 'EEXIST') throw error; }
      stat = fs.lstatSync(current, { throwIfNoEntry: false });
    }
    if (!stat || !stat.isDirectory() || stat.isSymbolicLink()) throw new RecordError(`需要真实目录，不能经过符号链接：${current}`);
  }
  return resolved;
}

function locations(root, runId, create = false) {
  identifier(runId, 'run ID');
  if (runId === 'none') throw new RecordError('none 为无父任务的保留值，不能作为 run ID');
  if (typeof root !== 'string' || !root) throw new RecordError('必须指定已有运维工作根 root');
  const workRoot = noLinks(root);
  const runs = noLinks(path.join(workRoot, '.agents', 'ops', 'runs'), { create });
  return { workRoot, runs, directory: path.join(runs, runId), runFile: path.join(runs, runId, 'run.md') };
}

function readRegular(filename, limit = MAX_RECORD) {
  const stat = fs.lstatSync(filename);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1 || stat.size > limit) throw new RecordError(`需要独立普通文件且未超过大小限制：${filename}`);
  const fd = fs.openSync(filename, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
  try {
    const actual = fs.fstatSync(fd);
    if (!actual.isFile() || actual.ino !== stat.ino || actual.dev !== stat.dev || actual.nlink !== 1 || actual.size > limit) throw new RecordError(`读取时文件身份改变：${filename}`);
    return decoder.decode(fs.readFileSync(fd));
  } finally { fs.closeSync(fd); }
}

function syncDirectory(directory) {
  if (process.platform === 'win32') return;
  const fd = fs.openSync(directory, fs.constants.O_RDONLY);
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}

function writeNew(filename, content) {
  const fd = fs.openSync(filename, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | (fs.constants.O_NOFOLLOW || 0), 0o600);
  try { fs.writeFileSync(fd, content, 'utf8'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}

function atomicFile(directory, filename, content, replace = false) {
  if (Buffer.byteLength(content) > MAX_RECORD) throw new RecordError('记录超过 16 MiB；保留原文件并引用已有受控证据，不能继续膨胀记录');
  noLinks(directory);
  const target = path.join(directory, filename);
  const temporary = path.join(directory, `.${filename}.${randomUUID()}.tmp`);
  try {
    writeNew(temporary, content);
    if (replace) {
      readRegular(target);
      fs.renameSync(temporary, target);
    } else {
      // 同目录 hard-link 发布避免覆盖同名步骤；完整文件一次可见。
      fs.linkSync(temporary, target);
      fs.unlinkSync(temporary);
    }
    syncDirectory(directory);
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  return target;
}

function withLock(loc, runId, action) {
  const lock = path.join(loc.runs, `.${runId}.write-lock`);
  try { fs.mkdirSync(lock, { mode: 0o700 }); } catch (error) {
    if (error.code === 'EEXIST') throw new RecordError(`本地记录写锁已存在：${lock}。先核查持有者；不会按超时自动抢锁。`);
    throw error;
  }
  const original = fs.lstatSync(lock);
  try {
    writeNew(path.join(lock, 'holder.md'), `# 本地记录写锁\n\n- 主机：${os.hostname()}\n- 进程：${process.pid}\n- 创建时间：${new Date().toISOString()}\n- 标识：${randomUUID()}\n\n此锁只保护本地记录写入，不代表远端任务锁。\n`);
    return action();
  } finally {
    const current = fs.lstatSync(lock, { throwIfNoEntry: false });
    if (!current || current.isSymbolicLink() || !current.isDirectory() || current.ino !== original.ino || current.dev !== original.dev) throw new RecordError(`写锁身份改变，保留现场核实：${lock}`);
    const marker = path.join(lock, 'holder.md');
    if (fs.existsSync(marker)) fs.unlinkSync(marker);
    fs.rmdirSync(lock);
  }
}

function envelope(fields, body) {
  return `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n')}\n---\n\n${body}`;
}

export function parseRecord(text) {
  const match = /^---\n([^]*?)\n---\n\n/.exec(text);
  if (!match) throw new RecordError('记录头不完整或不是受支持的 Markdown 记录');
  const fields = {};
  for (const row of match[1].split('\n')) {
    const item = /^([a-z_]+): ([^\r\n]+)$/.exec(row);
    if (!item || Object.hasOwn(fields, item[1])) throw new RecordError('记录头包含无效或重复字段');
    fields[item[1]] = item[2];
  }
  return { fields, body: text.slice(match[0].length) };
}

function currentRun(loc, runId, writer) {
  noLinks(loc.directory);
  const content = readRegular(loc.runFile);
  const { fields } = parseRecord(content);
  if (fields.format !== 'ops-run-v1' || fields.run_id !== runId) throw new RecordError('run 身份与目录不符');
  identifier(fields.writer, '记录中的 writer');
  if (writer !== undefined && fields.writer !== identifier(writer, 'writer')) throw new RecordError(`当前记录写入者是 ${fields.writer}；先完成真实交接，不可直接冒用其他会话。`);
  return { content, fields };
}

export function createRun({ root, runId, writer, request, parentRunId }) {
  identifier(writer, 'writer');
  const body = markdown(request, '请求记录');
  if (parentRunId !== undefined) identifier(parentRunId, 'parent run ID');
  if (parentRunId === runId) throw new RecordError('run 不能是自己的父任务');
  // 参数与父记录先核实，初始化失败不发布半成品 run。
  if (parentRunId !== undefined) currentRun(locations(root, parentRunId), parentRunId);
  const loc = locations(root, runId, true);
  return withLock(loc, runId, () => {
    if (fs.lstatSync(loc.directory, { throwIfNoEntry: false })) throw new RecordError(`run 已存在，不覆盖或重新开始：${runId}`);
    const temporary = path.join(loc.runs, `.${runId}.${randomUUID()}.tmp`);
    fs.mkdirSync(temporary, { mode: 0o700 });
    try {
      fs.mkdirSync(path.join(temporary, 'steps'), { mode: 0o700 });
      const content = envelope({ format: 'ops-run-v1', run_id: runId, created_at: new Date().toISOString(), created_by: writer, writer, parent_run_id: parentRunId ?? 'none' }, body);
      writeNew(path.join(temporary, 'run.md'), content);
      syncDirectory(temporary);
      fs.renameSync(temporary, loc.directory);
      syncDirectory(loc.runs);
      return { runId, path: loc.runFile, sha256: sha256(content) };
    } finally { if (fs.existsSync(temporary)) fs.rmSync(temporary, { recursive: true }); }
  });
}

export function appendStep({ root, runId, writer, stepId, content }) {
  identifier(writer, 'writer');
  identifier(stepId, 'step ID');
  const body = markdown(content, '步骤记录');
  const loc = locations(root, runId);
  return withLock(loc, runId, () => {
    currentRun(loc, runId, writer);
    const steps = noLinks(path.join(loc.directory, 'steps'));
    const text = envelope({ format: 'ops-step-v1', run_id: runId, step_id: stepId, recorded_at: new Date().toISOString(), writer }, body);
    const saved = atomicFile(steps, `${stepId}.md`, text);
    return { runId, stepId, path: saved, sha256: sha256(text) };
  });
}

export function summarizeRun({ root, runId, writer, content, expected = 'none' }) {
  identifier(writer, 'writer');
  const body = markdown(content, '汇总记录');
  if (expected !== 'none' && !/^[a-f0-9]{64}$/.test(expected)) throw new RecordError('expected 必须是先前摘要的 SHA-256，首次保存用 none');
  const loc = locations(root, runId);
  return withLock(loc, runId, () => {
    currentRun(loc, runId, writer);
    const target = path.join(loc.directory, 'summary.md');
    const exists = fs.lstatSync(target, { throwIfNoEntry: false });
    const actual = exists ? sha256(readRegular(target)) : 'none';
    if (actual !== expected) throw new RecordError(`摘要已变化：当前 ${actual}；先重新读取事实，不覆盖并发更新。`);
    const text = envelope({ format: 'ops-summary-v1', run_id: runId, recorded_at: new Date().toISOString(), writer }, body);
    const saved = atomicFile(loc.directory, 'summary.md', text, Boolean(exists));
    return { runId, path: saved, sha256: sha256(text) };
  });
}

export function handoffRun({ root, runId, writer, to, reason, expected }) {
  identifier(writer, 'writer');
  identifier(to, '新 writer');
  const body = markdown(reason, '交接核实记录');
  if (!/^[a-f0-9]{64}$/.test(expected ?? '')) throw new RecordError('交接必须提供已读 run.md 的 SHA-256');
  if (to === writer) throw new RecordError('接续同一 writer 无须转交');
  const loc = locations(root, runId);
  return withLock(loc, runId, () => {
    const old = currentRun(loc, runId, writer);
    if (sha256(old.content) !== expected) throw new RecordError('run 在核实后已变化，请重新读取交接事实');
    const parsed = parseRecord(old.content);
    const text = envelope({ ...parsed.fields, writer: to }, `${parsed.body}\n## 写入责任交接 ${new Date().toISOString()}\n\n- 原写入者：${writer}\n- 新写入者：${to}\n\n${body}`);
    const saved = atomicFile(loc.directory, 'run.md', text, true);
    return { runId, path: saved, writer: to, sha256: sha256(text) };
  });
}

export function inspectRun({ root, runId }) {
  const loc = locations(root, runId);
  const run = currentRun(loc, runId);
  const stepsDirectory = noLinks(path.join(loc.directory, 'steps'));
  const steps = fs.readdirSync(stepsDirectory).filter((name) => !name.startsWith('.')).sort().map((name) => {
    if (!name.endsWith('.md')) throw new RecordError(`步骤目录存在未识别对象：${name}`);
    const content = readRegular(path.join(stepsDirectory, name));
    const parsed = parseRecord(content);
    if (parsed.fields.format !== 'ops-step-v1' || parsed.fields.run_id !== runId || `${parsed.fields.step_id}.md` !== name) throw new RecordError(`步骤身份不符：${name}`);
    return { path: path.join(stepsDirectory, name), ...parsed.fields, content, sha256: sha256(content) };
  });
  const summaryPath = path.join(loc.directory, 'summary.md');
  let summary = null;
  if (fs.lstatSync(summaryPath, { throwIfNoEntry: false })) {
    const content = readRegular(summaryPath);
    const parsed = parseRecord(content);
    if (parsed.fields.format !== 'ops-summary-v1' || parsed.fields.run_id !== runId) throw new RecordError('汇总身份不符');
    summary = { path: summaryPath, content, sha256: sha256(content) };
  }
  return { runId, path: loc.runFile, content: run.content, metadata: run.fields, sha256: sha256(run.content), summary, steps };
}

const usage = `本地运维记录工具（不执行远端操作）
  init --root DIR --run ID --writer ID --request-file FILE [--parent ID]
  append --root DIR --run ID --writer ID --step ID --file FILE
  summarize --root DIR --run ID --writer ID --file FILE [--expected HASH|none]
  handoff --root DIR --run ID --writer OLD --to NEW --reason-file FILE --expected HASH
  show --root DIR --run ID
记录位置：DIR/.agents/ops/runs/ID/。现有摘要更新及写入责任交接先用 show 读取 SHA-256。
输入文件只读；文件内容须先脱敏。writer 是协作标识，不是身份认证或远端资源锁。`;

export function main(argv = process.argv.slice(2)) {
  try {
    if (!argv.length || argv[0] === '--help') { console.log(usage); return 0; }
    const [command, ...args] = argv;
    const allowed = {
      init: ['root', 'run', 'writer', 'request-file', 'parent'],
      append: ['root', 'run', 'writer', 'step', 'file'],
      summarize: ['root', 'run', 'writer', 'file', 'expected'],
      handoff: ['root', 'run', 'writer', 'to', 'reason-file', 'expected'],
      show: ['root', 'run'],
    }[command];
    if (!allowed) throw new RecordError(`未知命令：${command}`);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      const name = args[i].startsWith('--') ? args[i].slice(2) : '';
      if (!allowed.includes(name) || Object.hasOwn(options, name) || args[i + 1] === undefined || args[i + 1].startsWith('--')) throw new RecordError(`无效或重复参数：${args[i]}`);
      options[name] = args[i + 1];
    }
    const fromFile = (name) => { if (!options[name]) throw new RecordError(`缺少 --${name}`); return readRegular(path.resolve(options[name]), MAX_INPUT); };
    const context = { root: options.root, runId: options.run, writer: options.writer };
    let result;
    if (command === 'init') result = createRun({ ...context, request: fromFile('request-file'), parentRunId: options.parent });
    if (command === 'append') result = appendStep({ ...context, stepId: options.step, content: fromFile('file') });
    if (command === 'summarize') result = summarizeRun({ ...context, content: fromFile('file'), expected: options.expected });
    if (command === 'handoff') result = handoffRun({ ...context, to: options.to, reason: fromFile('reason-file'), expected: options.expected });
    if (command === 'show') {
      const record = inspectRun(context);
      console.log(`run.md SHA-256: ${record.sha256}\n${record.path}\n\n${record.content}`);
      for (const step of record.steps) console.log(`步骤 ${step.step_id}: ${step.path}`);
      console.log(record.summary ? `summary.md SHA-256: ${record.summary.sha256}\n${record.summary.content}` : 'summary.md SHA-256: none');
      return 0;
    }
    console.log(`已保存：${result.path}\nSHA-256: ${result.sha256}`);
    return 0;
  } catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
