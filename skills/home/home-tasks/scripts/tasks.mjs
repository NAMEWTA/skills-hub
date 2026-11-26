#!/usr/bin/env node
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { digest, fail, openStorage } from './storage.mjs';

const topicMarker = '<!-- home-tasks:topic v1 -->\n';
const stateStart = '\n<!-- home-tasks:state v1 -->\n```tsv\n';
const stateEnd = '\n```\n';
const idPattern = /^[a-z0-9][a-z0-9-]*$/u;
const topicPattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9-]{0,63}$/u;
const taskPattern = /^task_([0-9]{2,})\.md$/u;
const reportPattern = /^report_([0-9]{2,})\.md$/u;
const stateHeader = ['kind', 'task', 'repo', 'state', 'observed_at', 'evidence', 'attempt'];
const statusHeader = ['task', 'status', 'projects', 'project_states', 'reports', 'updated_at'];
const allHeader = ['topic', 'title', 'status', 'projects', 'project_states', 'updated_at', 'status_path'];
const terminal = new Set(['done', 'cancelled']);
const transitions = {
  pending: ['pending', 'cancelled'],
  reserved: ['pending', 'running', 'unknown', 'cancelled'],
  running: ['running', 'blocked', 'unknown', 'done', 'cancelled'],
  blocked: ['blocked', 'running', 'unknown', 'done', 'cancelled'],
  unknown: ['unknown', 'pending', 'running', 'blocked', 'done', 'cancelled'],
};
const reportKinds = new Set(['progress', 'question', 'blocker', 'result']);
const splitLines = text => text.replaceAll('\r\n', '\n').trimEnd().split('\n');
const tsv = (header, rows) => [header, ...rows].map(row => row.join('\t')).join('\n') + '\n';
const key = (task, repo) => `${task}/${repo}`;
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const latest = timestamps => [...timestamps].sort(compare).at(-1) ?? '';
const recentFirst = (a, b) => compare(b.updatedAt, a.updatedAt) || compare(a.id, b.id);

function line(value, label) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f\u007f]/u.test(value)) fail('FORMAT', `${label} 必须为非空单行文本`);
  return value;
}

function checkTopic(id) {
  if (!topicPattern.test(id ?? '')) fail('ARGUMENT', '主题需要 YYYY-MM-DD-小写短名');
  const date = id.slice(0, 10);
  if (!Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) fail('ARGUMENT', '主题日期无效');
  return id;
}

function checkRepo(id) {
  if (!idPattern.test(id ?? '')) fail('ARGUMENT', '需要准确的 repo ID');
  return id;
}

function checkTime(value) {
  if (!Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) fail('FORMAT', '需要 ISO UTC 观察时间');
}

function numbered(entry, pattern) {
  const digits = pattern.exec(entry)?.[1];
  const value = Number(digits);
  if (!Number.isSafeInteger(value) || value < 1 || String(value).padStart(2, '0') !== digits) fail('FORMAT', `编号无效 ${entry}`);
  return value;
}

function body(text) {
  if (typeof text !== 'string' || !text.trim() || text.includes(stateStart) || text.includes('\0')) fail('FORMAT', '需要有效的 Markdown 正文');
  return text.replaceAll('\r\n', '\n').trimEnd() + '\n';
}

function envelope(kind, fields, markdown) {
  return `<!-- home-tasks:${kind} v1\t${fields.join('\t')} -->\n\n${body(markdown)}`;
}

function metadata(text, kind, columns) {
  if (text === null) fail('STALE', `${kind} 文件在读取期间消失`);
  const first = text.split(/\r?\n/u, 1)[0];
  const prefix = `<!-- home-tasks:${kind} v1\t`;
  if (!first.startsWith(prefix) || !first.endsWith(' -->')) fail('FORMAT', `${kind} 缺少 Home 记录标记`);
  const fields = first.slice(prefix.length, -4).split('\t');
  if (fields.length !== columns) fail('FORMAT', `${kind} 记录字段不符`);
  checkTime(fields[0]);
  return fields;
}

function reposFor(value) {
  const repos = (value ?? '').split(',').map(checkRepo);
  if (new Set(repos).size !== repos.length) fail('ARGUMENT', '同一 task 的 repo ID 不能重复');
  return repos;
}

function parseTopic(id, content) {
  const text = content.replaceAll('\r\n', '\n');
  const offset = text.lastIndexOf(stateStart);
  if (!text.startsWith(topicMarker) || offset === -1 || !text.endsWith(stateEnd)) fail('FORMAT', `主题状态区无效 ${id}`);
  const narrative = text.slice(0, offset);
  const title = narrative.slice(topicMarker.length).split('\n', 1)[0];
  if (!title.startsWith('# ')) fail('FORMAT', `主题缺少标题 ${id}`);
  const [header, ...rows] = text.slice(offset + stateStart.length, -stateEnd.length).split('\n');
  if (header !== stateHeader.join('\t')) fail('FORMAT', `主题状态列无效 ${id}`);
  const facts = { id, title: line(title.slice(2), '主题'), narrative, content, close: null, claims: new Map(), targets: new Map(), tasks: new Map(), reports: new Map() };
  for (const row of rows) {
    const cells = row.split('\t');
    const [kind, task, repo, state, observedAt, evidence, attempt] = cells;
    if (cells.length !== stateHeader.length) fail('FORMAT', `主题状态行无效 ${id}`);
    checkTime(observedAt);
    line(evidence, '状态证据');
    const fact = { kind, task, repo, state, observedAt, evidence, attempt };
    if (kind === 'topic' && task === '-' && repo === '-' && (state === 'open' || terminal.has(state)) && !facts.close && !attempt) facts.close = fact;
    else if (kind === 'claim' && task === '-' && checkRepo(repo) && ['held', 'released'].includes(state) && !facts.claims.has(repo) && !attempt) facts.claims.set(repo, fact);
    else if (kind === 'target' && numbered(task, taskPattern) && checkRepo(repo) && (Object.hasOwn(transitions, state) || terminal.has(state)) && !facts.targets.has(key(task, repo))) facts.targets.set(key(task, repo), fact);
    else fail('FORMAT', `主题状态重复或无效 ${id}`);
  }
  if (!facts.close) fail('FORMAT', `主题缺少状态记录 ${id}`);
  return facts;
}

function factCells(fact) {
  return [fact.kind, fact.task, fact.repo, fact.state, fact.observedAt, fact.evidence, fact.attempt];
}

function readTopic(storage, id, content) {
  const topic = parseTopic(id, content);
  for (const { name } of storage.list(id)) {
    if (taskPattern.test(name)) {
      numbered(name, taskPattern);
      const [createdAt, repos, previous, replyTo] = metadata(storage.read(`${id}/${name}`), 'task', 4);
      topic.tasks.set(name, { name, createdAt, repos: reposFor(repos), previous, replyTo });
    } else if (reportPattern.test(name)) {
      numbered(name, reportPattern);
      const [createdAt, task, repo, kind] = metadata(storage.read(`${id}/${name}`), 'report', 4);
      if (!reportKinds.has(kind)) fail('FORMAT', `无效回执类型 ${id}/${name}`);
      topic.reports.set(name, { name, createdAt, task, repo: checkRepo(repo), kind });
    }
  }
  for (const task of topic.tasks.values()) {
    if (task.previous && (!topic.tasks.has(task.previous) || numbered(task.previous, taskPattern) >= numbered(task.name, taskPattern))) fail('FORMAT', `前序任务不存在或无效 ${id}/${task.name}`);
    if (task.replyTo && topic.reports.get(task.replyTo)?.task !== task.previous) fail('FORMAT', `前序回执不匹配 ${id}/${task.name}`);
  }
  for (const report of topic.reports.values()) {
    if (!topic.tasks.get(report.task)?.repos.includes(report.repo)) fail('FORMAT', `回执目标不匹配 ${id}/${report.name}`);
  }
  for (const fact of topic.targets.values()) {
    if (!topic.tasks.get(fact.task)?.repos.includes(fact.repo)) fail('FORMAT', `状态缺少对应任务 ${id}/${fact.task}`);
    if (!terminal.has(fact.state) && fact.state !== 'pending' && topic.claims.get(fact.repo)?.state !== 'held') fail('FORMAT', `进行中的项目缺少占用 ${id}/${fact.repo}`);
  }
  for (const repo of topic.claims.keys()) {
    if (![...topic.tasks.values()].some(task => task.repos.includes(repo))) fail('FORMAT', `项目占用缺少对应任务 ${id}/${repo}`);
  }
  if (terminal.has(topic.close.state) && ([...topic.claims.values()].some(claim => claim.state === 'held') || [...topic.tasks.values()].some(task => task.repos.some(repo => !terminal.has(target(topic, task.name, repo).state))))) fail('FORMAT', `已关闭主题仍有未结案目标 ${id}`);
  return topic;
}

function readTopics(storage) {
  const topics = new Map();
  for (const entry of storage.list()) {
    if (!topicPattern.test(entry.name) || !entry.isDirectory() && !entry.isSymbolicLink()) continue;
    const content = storage.read(`${entry.name}/topic.md`);
    if (content?.replaceAll('\r\n', '\n').startsWith(topicMarker)) topics.set(entry.name, readTopic(storage, checkTopic(entry.name), content));
    else if (content?.startsWith('<!-- home-tasks:topic') || storage.list(entry.name).some(({ name }) => taskPattern.test(name) || reportPattern.test(name))) fail('FORMAT', `主题缺少有效来源 ${entry.name}/topic.md`);
  }
  return topics;
}

function target(topic, task, repo) {
  const message = topic.tasks.get(task);
  if (!message?.repos.includes(repo)) fail('NOT_FOUND', `未找到任务目标 ${task}/${repo}`);
  return topic.targets.get(key(task, repo)) ?? { kind: 'target', task, repo, state: 'pending', observedAt: message.createdAt, evidence: '-', attempt: '' };
}

function targetView(fact) {
  return { ...fact, revision: digest(factCells(fact).join('\t')) };
}

function messageViews(topic) {
  return [...topic.tasks.values()].sort((a, b) => numbered(a.name, taskPattern) - numbered(b.name, taskPattern)).map(task => {
    const targets = task.repos.map(repo => targetView(target(topic, task.name, repo)));
    const reports = [...topic.reports.values()].filter(report => report.task === task.name).sort((a, b) => numbered(a.name, reportPattern) - numbered(b.name, reportPattern));
    return { ...task, targets, reports, status: summarize(targets.map(fact => fact.state)), updatedAt: latest([...targets.map(fact => fact.observedAt), ...reports.map(report => report.createdAt)]) };
  });
}

function summarize(states) {
  if (states.includes('running') || states.includes('reserved')) return 'running';
  if (states.includes('unknown')) return 'unknown';
  if (states.includes('blocked')) return 'blocked';
  if (states.includes('pending') || !states.length) return 'pending';
  return states.includes('done') ? 'done' : 'cancelled';
}

function topicView(topic) {
  const messages = messageViews(topic);
  const projects = [...new Set(messages.flatMap(message => message.repos))].sort(compare).map(repo => {
    const states = messages.flatMap(message => message.targets.filter(fact => fact.repo === repo).map(fact => fact.state));
    const held = topic.claims.get(repo)?.state === 'held';
    const state = summarize(states);
    return { repo, held, state: held && terminal.has(state) ? 'running' : state };
  });
  const state = summarize(projects.map(project => project.state));
  const status = terminal.has(topic.close.state) ? topic.close.state : terminal.has(state) ? 'running' : state;
  return { id: topic.id, title: topic.title, status, projects, messages, evidence: topic.close.evidence, updatedAt: latest([topic.close.observedAt, ...messages.map(message => message.updatedAt), ...[...topic.claims.values()].map(claim => claim.observedAt)]) };
}

const projectStates = projects => projects.map(({ repo, state }) => `${repo}=${state}`).join(',');
const sheetTitle = title => /^[=+@-]/u.test(title.trimStart()) ? `'${title}` : title;

function updateViews(storage, topics, ids) {
  const views = [...topics.values()].map(topicView).sort(recentFirst);
  function save(relative, header, rows) {
    const before = storage.read(relative);
    if (before !== null && splitLines(before)[0] !== header.join('\t')) fail('UNMANAGED_VIEW', `保留已有未受管理的视图 ${relative}`);
    storage.replace(relative, tsv(header, rows), before);
  }
  for (const view of views.filter(view => ids.includes(view.id))) {
    save(`${view.id}/status.tsv`, statusHeader, view.messages.map(message => [message.name, message.status, message.repos.join(','), projectStates(message.targets), message.reports.map(report => `${report.repo}=${report.name}`).join(','), message.updatedAt]));
  }
  if (views.length) save('all.status.tsv', allHeader, views.map(view => [view.id, sheetTitle(view.title), view.status, view.projects.map(project => project.repo).join(','), projectStates(view.projects), view.updatedAt, `${view.id}/status.tsv`]));
}

function saveFacts(storage, topic) {
  const rows = [topic.close, ...topic.claims.values(), ...topic.targets.values()];
  return storage.replace(`${topic.id}/topic.md`, `${topic.narrative}${stateStart}${tsv(stateHeader, rows.map(factCells)).slice(0, -1)}${stateEnd}`, topic.content);
}

function fact(kind, task, repo, state, observedAt, evidence, attempt = '') {
  return { kind, task, repo, state, observedAt, evidence: line(evidence, '状态证据'), attempt };
}

function nextName(entries, prefix, pattern) {
  const next = Math.max(0, ...[...entries.keys()].map(name => numbered(name, pattern))) + 1;
  return `${prefix}_${String(next).padStart(2, '0')}.md`;
}

function requireTopic(topics, id, { open = false } = {}) {
  const topic = topics.get(checkTopic(id));
  if (!topic) fail('NOT_FOUND', `没有对应的 Home 主题 ${id}`);
  if (open && terminal.has(topic.close.state)) fail('CLOSED', `主题已结案 ${id}`);
  return topic;
}

function inspectProject(topics, repo) {
  checkRepo(repo);
  const matching = [...topics.values()].map(topicView).filter(view => view.projects.some(project => project.repo === repo)).sort(recentFirst);
  const held = matching.filter(view => view.projects.find(project => project.repo === repo).held).map(view => view.id);
  if (held.length > 1) fail('OCCUPANCY_CONFLICT', `项目占用冲突 ${repo} 在 ${held.join(', ')}`);
  return { repo, occupiedBy: held[0] ?? null, topics: matching.map(view => ({ id: view.id, status: view.projects.find(project => project.repo === repo).state, pending: view.messages.filter(message => message.targets.some(target => target.repo === repo && target.state === 'pending')).map(message => message.name) })) };
}

const specifications = {
  init: ['topic title input', ''],
  task: ['topic repos input', 'previous reply-to'],
  report: ['topic task repo kind input', ''],
  reserve: ['topic task repo evidence', ''],
  state: ['topic task repo state expect evidence', ''],
  release: ['topic repo evidence', ''],
  close: ['topic state evidence', ''],
  show: ['topic', ''],
  project: ['repo', ''],
  list: ['', ''],
  rebuild: ['', ''],
};

export function run(command, options, { now = () => new Date().toISOString() } = {}) {
  if (!Object.hasOwn(specifications, command)) fail('ARGUMENT', '未知命令');
  const storage = openStorage(options.home);
  if (command === 'show') return topicView(requireTopic(readTopics(storage), options.topic));
  if (command === 'project') return inspectProject(readTopics(storage), options.repo);
  if (command === 'list') return [...readTopics(storage).values()].map(topicView).sort(recentFirst).map(({ messages, ...view }) => view);

  return storage.locked(() => {
    const topics = readTopics(storage);
    if (command === 'rebuild') {
      updateViews(storage, topics, [...topics.keys()]);
      return { status: 'rebuilt', topics: topics.size };
    }
    const id = checkTopic(options.topic);
    const time = now();
    checkTime(time);
    const input = () => fs.readFileSync(options.input, 'utf8');
    let result;
    if (command === 'init') {
      if (storage.list(id).length) fail('EXISTS', `主题目录已有资料 ${id}，先区分接续与新建`);
      const title = line(options.title, '主题标题');
      const topic = { id, narrative: `${topicMarker}# ${title}\n\n${body(input())}`, content: null, claims: new Map(), targets: new Map(), close: fact('topic', '-', '-', 'open', time, 'Home 接收任务') };
      saveFacts(storage, topic);
      result = { status: 'created', topic: id };
    } else {
      const topic = requireTopic(topics, id, { open: command !== 'report' });
      if (command === 'task') {
        const repos = reposFor(options.repos);
        const previous = options.previous ?? '';
        const replyTo = options['reply-to'] ?? '';
        if ((previous && !topic.tasks.has(previous)) || (replyTo && topic.reports.get(replyTo)?.task !== previous)) fail('NOT_FOUND', '前序任务和回执必须匹配同一主题');
        const task = nextName(topic.tasks, 'task', taskPattern);
        storage.replace(`${id}/${task}`, envelope('task', [time, repos.join(','), previous, replyTo], input()), null);
        result = { status: 'recorded', task, repos };
      } else if (command === 'report') {
        const { task, repo, kind } = options;
        if (!target(topic, task, repo).attempt) fail('STATE', '未派发目标没有可归属的项目回执');
        if (!reportKinds.has(kind)) fail('ARGUMENT', '回执类型为 progress、question、blocker 或 result');
        const report = nextName(topic.reports, 'report', reportPattern);
        storage.replace(`${id}/${report}`, envelope('report', [time, task, repo, kind], input()), null);
        result = { status: 'recorded', report, task, repo };
      } else if (command === 'close') {
        if (!terminal.has(options.state)) fail('ARGUMENT', '主题只可标记 done 或 cancelled');
        if ([...topic.claims.values()].some(claim => claim.state === 'held')) fail('OCCUPIED', '先核实并释放主题内的项目占用');
        const targets = messageViews(topic).flatMap(message => message.targets);
        if (targets.some(item => !terminal.has(item.state)) || (options.state === 'done' && !targets.some(item => item.state === 'done'))) fail('STATE', '主题的项目交付尚未达到结案条件');
        topic.close = fact('topic', '-', '-', options.state, time, options.evidence);
        result = { status: options.state, topic: id };
      } else if (command === 'release') {
        const { repo, evidence } = options;
        if (inspectProject(topics, repo).occupiedBy !== id) fail('NOT_FOUND', '主题没有该项目的占用');
        if (messageViews(topic).some(message => message.targets.some(item => item.repo === repo && item.state !== 'pending' && !terminal.has(item.state)))) fail('STATE', '仍有该项目的执行任务或未确认投递');
        topic.claims.set(repo, fact('claim', '-', repo, 'released', time, evidence));
        result = { status: 'released', repo };
      } else {
        const { task, repo, state, expect, evidence } = options;
        const current = target(topic, task, repo);
        let updated;
        if (command === 'reserve') {
          if (current.state !== 'pending') fail('STATE', '目标已占用、已投递或已结案，先回读原结果');
          const { occupiedBy } = inspectProject(topics, repo);
          if (occupiedBy && occupiedBy !== id) fail('OCCUPIED', `${repo} 已由 ${occupiedBy} 占用，本次仍待派发`);
          if (messageViews(topic).some(message => message.targets.some(item => item.repo === repo && ['reserved', 'unknown'].includes(item.state)))) fail('STATE', '先核实该项目未确认的投递');
          topic.claims.set(repo, fact('claim', '-', repo, 'held', time, evidence));
          updated = fact('target', task, repo, 'reserved', time, evidence, randomUUID());
        } else {
          if (targetView(current).revision !== expect) fail('STALE', '目标状态已变更，需重新读取并核实');
          if (!Object.hasOwn(transitions, current.state) || !transitions[current.state].includes(state)) fail('STATE', `不允许 ${current.state} → ${state}`);
          if (state === 'done' && ![...topic.reports.values()].some(report => report.task === task && report.repo === repo)) fail('EVIDENCE', '验收完成前需要该目标的回执');
          updated = fact('target', task, repo, state, time, evidence, current.attempt);
        }
        topic.targets.set(key(task, repo), updated);
        result = { status: updated.state, target: targetView(updated) };
      }
      if (!['task', 'report'].includes(command)) saveFacts(storage, topic);
    }
    try {
      topics.set(id, readTopic(storage, id, storage.read(`${id}/topic.md`)));
      updateViews(storage, topics, [id]);
      return { ...result, topic: id, views: 'current' };
    } catch (error) {
      return { ...result, topic: id, views: 'needs-rebuild', warning: error.code ?? error.message };
    }
  });
}

export function main(argv = process.argv.slice(2)) {
  if (!argv.length || argv[0] === '--help') {
    process.stdout.write('Home 任务记录工具\n' + Object.entries(specifications).map(([command, [required, optional]]) => `  ${command} --home <Home>${required ? ' ' + required.split(' ').map(name => `--${name} <值>`).join(' ') : ''}${optional ? ' ' + optional.split(' ').map(name => `[--${name} <值>]`).join(' ') : ''}`).join('\n') + '\n');
    return 0;
  }
  try {
    const [command, ...args] = argv;
    if (!Object.hasOwn(specifications, command)) fail('ARGUMENT', '未知命令');
    const [required, optional] = specifications[command];
    const mandatory = ['home', ...required.split(' ').filter(Boolean)];
    const allowed = new Set([...mandatory, ...optional.split(' ').filter(Boolean)]);
    const options = Object.create(null);
    for (let index = 0; index < args.length; index += 2) {
      const argument = args[index];
      const name = argument.slice(2);
      if (!argument.startsWith('--') || !allowed.has(name) || Object.hasOwn(options, name) || !args[index + 1] || args[index + 1].startsWith('--')) fail('ARGUMENT', `参数无效或重复 ${argument}`);
      options[name] = args[index + 1];
    }
    if (mandatory.some(name => !Object.hasOwn(options, name))) fail('ARGUMENT', '缺少必需参数，参见 --help');
    process.stdout.write(JSON.stringify(run(command, options), null, 2) + '\n');
    return 0;
  } catch (error) {
    process.stderr.write(JSON.stringify({ code: error.code ?? 'ERROR', message: error.message }) + '\n');
    return 1;
  }
}

function invokedDirectly() {
  try { return Boolean(process.argv[1]) && fs.realpathSync.native(process.argv[1]) === fs.realpathSync.native(fileURLToPath(import.meta.url)); }
  catch (error) { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false; throw error; }
}

if (invokedDirectly()) process.exitCode = main();
