#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { argumentsMap, compare, excluded, fail, indexText, integer, openFiles, parseDocument, parseExclusions, provenance, renderDocument } from './files.mjs';

const documentPath = (relative) => /^(?:history|archive\/history)\/.+\.md$/.test(relative) && !relative.endsWith('/index.md');
const writable = (relative) => documentPath(relative) || relative === 'history/index.md';

export function eventTime(value) {
  if (['unknown', '未知'].includes(value)) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) fail('DATE', '时间须为 YYYY-MM-DD、带时区且小数最多三位的 ISO 时间或 unknown');
  const day = value.slice(0, 10); const calendar = new Date(`${day}T00:00:00Z`);
  if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== day || !Number.isFinite(Date.parse(value))) fail('DATE', `无效时间：${value}`);
  if (value.length > 10 && (Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 || Number(value.slice(17, 19)) > 59)) fail('DATE', `无效时刻：${value}`);
  return Date.parse(value);
}
function compareEvents(a, b) {
  const timestamp = (document) => { try { return eventTime(document.metadata.occurred_at); } catch { return null; } };
  const first = timestamp(a); const second = timestamp(b);
  if (first === null && second !== null) return 1;
  if (second === null && first !== null) return -1;
  return (first === null ? 0 : second - first) || compare(a.path, b.path);
}
function validateEvent(metadata) {
  provenance(metadata);
  for (const key of ['event_key', 'status']) if (typeof metadata[key] !== 'string' || !metadata[key].trim()) fail('METADATA', `事件需要 ${key}；不能靠标题去重或默认为完成`);
  eventTime(metadata.occurred_at);
}
function payload(metadata, body) {
  const values = { ...metadata }; delete values.id; delete values.recorded_at; delete values.updated_at;
  return renderDocument(values, body);
}

export function createHistory(homeRoot, options = {}) {
  const files = openFiles(homeRoot, { writable, lockName: '.home-content-write.lock', fsOps: options.fsOps });
  const now = options.now ?? (() => new Date().toISOString());
  const newId = options.newId ?? (() => randomUUID());
  const exclusions = () => parseExclusions(files.read('exclusions.md')?.content ?? null).entries;
  function owned(relative) { if (!documentPath(relative)) fail('OWNER', '只能操作 history 或 archive/history 正文；不会修改配置、知识或原生会话'); }
  function read(relative) { owned(relative); const result = files.read(relative); if (!result) fail('MISSING', `没有此历史原件：${relative}`); return result; }
  function scan(settings = {}) {
    const result = files.scan(['history', ...(settings.includeArchive ? ['archive/history'] : [])], settings);
    const entries = exclusions(); let excludedCount = 0;
    result.documents = result.documents.filter((document) => { if (excluded(document.metadata, entries)) { excludedCount += 1; return false; } return true; });
    return { ...result, excluded: excludedCount };
  }
  function buildIndex(settings = {}) {
    const result = scan(settings);
    const documents = result.documents.sort(compareEvents);
    const rendered = indexText('Home 历史导航', documents, 'history/index.md', { maxChars: settings.budget ?? 6000, complete: result.complete });
    const before = files.read('history/index.md');
    return { ...files.replace('history/index.md', rendered.content, before?.sha256 ?? 'missing'), shown: rendered.shown, truncated: rendered.truncated, complete: result.complete, warnings: result.warnings, excluded: result.excluded };
  }
  function afterWrite(result) {
    try { return { ...result, status: 'saved', sourceSaved: true, index: { status: 'updated', ...buildIndex() } }; }
    catch (error) { return { ...result, status: 'partial', sourceSaved: true, index: { status: 'pending', code: error.code ?? 'IO', message: error.message } }; }
  }
  function identityDocuments() {
    const result = files.scan(['history', 'archive/history'], { maxFiles: 10000, maxBytes: 33554432 });
    if (!result.complete || result.documents.some((document) => document.metadataError)) fail('INCOMPLETE', '事件身份范围未读完或元数据不可解析，不能宣称去重完成后继续新增', { warnings: result.warnings });
    return result.documents;
  }
  function record(content) {
    const { metadata, body } = parseDocument(content); validateEvent(metadata);
    return files.locked(() => {
      if (excluded(metadata, exclusions())) fail('EXCLUDED', '此来源在该范围被排除，先按原 owner 的保留决定处理');
      const documents = identityDocuments();
      const same = documents.filter((document) => document.metadata.scope === metadata.scope && document.metadata.event_key === metadata.event_key);
      if (same.length > 1) fail('IDENTITY_CONFLICT', '同一范围和事件身份已对应多份记录，先核对原件');
      if (same.length === 1) {
        if (payload(same[0].metadata, same[0].body) !== payload(metadata, body)) fail('EVENT_EXISTS', `事件已记录且内容不同；读取后用 update 修订：${same[0].path}`, { existingPath: same[0].path });
        return { status: 'unchanged', path: same[0].path, id: same[0].metadata.id, sha256: same[0].sha256, sourceSaved: false, deduplication: 'scope + event_key；只涵盖带身份的记录' };
      }
      const id = metadata.id || newId();
      if (!/^[\p{L}\p{N}][\p{L}\p{N}_-]{0,100}$/u.test(id)) fail('ID', 'id 仅使用字母、数字、下划线或连字符，最多 101 字符');
      if (documents.some((document) => document.metadata.id === id)) fail('ID_EXISTS', '事件 ID 已存在，不覆盖原件');
      const recordedAt = now(); eventTime(recordedAt);
      const bucket = eventTime(metadata.occurred_at) === null ? recordedAt : metadata.occurred_at;
      const relative = `history/${bucket.slice(0, 4)}/${bucket.slice(5, 7)}/${id}.md`;
      const finalText = renderDocument({ ...metadata, id, recorded_at: recordedAt }, body);
      return afterWrite({ ...files.replace(relative, finalText, 'missing'), id, deduplication: 'scope + event_key；只有标题相似不会合并', unidentifiedRecords: documents.filter((document) => !document.metadata.event_key || !document.metadata.scope).length });
    });
  }
  function update(relative, content, expectedHash) {
    owned(relative); const next = parseDocument(content); validateEvent(next.metadata);
    return files.locked(() => {
      const before = read(relative);
      if (before.sha256 !== expectedHash) fail('STALE', '历史已改变，重新读取并核对修改');
      const old = parseDocument(before.content);
      for (const key of ['scope', 'event_key']) if (old.metadata[key] && next.metadata[key] !== old.metadata[key]) fail('IDENTITY', `修订不能改写 ${key}；真实新事件另建记录`);
      for (const key of ['id', 'recorded_at']) {
        if (old.metadata[key] && next.metadata[key] && next.metadata[key] !== old.metadata[key]) fail('IDENTITY', `修订保留原 ${key}`);
        if (old.metadata[key]) next.metadata[key] = old.metadata[key];
      }
      if (excluded(next.metadata, exclusions())) fail('EXCLUDED', '来源已被排除；需要删除或定点移除有关内容，不可重新保存为可用摘要');
      const documents = identityDocuments().filter((document) => document.path !== relative);
      const duplicate = documents.find((document) => document.metadata.scope === next.metadata.scope && document.metadata.event_key === next.metadata.event_key);
      if (duplicate) fail('IDENTITY_CONFLICT', `其他记录已有同一事件身份：${duplicate.path}`);
      if (next.metadata.id !== undefined) {
        if (typeof next.metadata.id !== 'string' || !/^[\p{L}\p{N}][\p{L}\p{N}_-]{0,100}$/u.test(next.metadata.id)) fail('ID', 'id 仅使用字母、数字、下划线或连字符，最多 101 字符');
        if (documents.some((document) => document.metadata.id === next.metadata.id)) fail('ID_EXISTS', '事件 ID 已被其他原件使用，不覆盖或合并事件');
      }
      if (payload(next.metadata, next.body) === payload(old.metadata, old.body)) return { status: 'unchanged', path: relative, sha256: before.sha256, sourceSaved: false };
      next.metadata.updated_at = now();
      return afterWrite(files.replace(relative, renderDocument(next.metadata, next.body), expectedHash));
    });
  }
  function remove(relative, expectedHash) { owned(relative); return files.locked(() => afterWrite(files.remove(relative, expectedHash))); }
  function query(text = '', settings = {}) {
    if (typeof text !== 'string') fail('ARGUMENT', 'text 必须是字符串');
    let from = -Infinity; let until = Infinity;
    if (settings.from) { from = eventTime(settings.from); if (from === null) fail('DATE', 'from 需要确定时间'); }
    if (settings.until) { until = eventTime(settings.until); if (until === null) fail('DATE', 'until 需要确定时间'); if (settings.until.length === 10) until += 86399999; }
    if (from > until) fail('DATE', 'from 不能晚于 until');
    const result = scan(settings); const needle = text.toLowerCase(); const findings = []; let undated = 0;
    const matches = result.documents.filter((document) => {
      if (settings.scope && document.metadata.scope !== settings.scope) return false;
      if (needle && !document.content.toLowerCase().includes(needle)) return false;
      let timestamp;
      try { timestamp = eventTime(document.metadata.occurred_at); }
      catch (error) { findings.push(`${document.path}: ${error.message}`); timestamp = null; }
      if (timestamp === null) { undated += 1; return settings.includeUndated || (!settings.from && !settings.until); }
      const end = timestamp + (document.metadata.occurred_at.length === 10 ? 86399999 : 0);
      return end >= from && timestamp <= until;
    }).sort(compareEvents);
    const entries = matches.slice(0, settings.limit ?? 10).map((document) => ({ path: document.path, title: document.title, id: document.metadata.id ?? null, event_key: document.metadata.event_key ?? null, scope: document.metadata.scope ?? 'unknown', status: document.metadata.status ?? 'unknown', occurred_at: document.metadata.occurred_at ?? 'unknown', recorded_at: document.metadata.recorded_at ?? null, sources: document.metadata.sources ?? [], sha256: document.sha256, snippet: document.body.slice(0, 200).replaceAll('\n', ' ') }));
    return { entries, matches: matches.length, complete: result.complete, truncated: entries.length < matches.length || !result.complete, scanned: result.scanned, areas: result.areas, excluded: result.excluded, undated, range: { from: settings.from ?? null, until: settings.until ?? null }, warnings: [...result.warnings, ...findings], basis: '按正文的 occurred_at 检索；目录、mtime 和 recorded_at 不替代事件时间；不是当前任务状态或原生 resume' };
  }
  return { read, record, update, remove, query, index: (settings) => files.locked(() => buildIndex(settings)) };
}

const help = `Home 历史工具（Node.js 22.14+）
  record --home ROOT --input FILE|-
  read   --home ROOT --path history/YYYY/MM/ID.md
  update --home ROOT --path history/YYYY/MM/ID.md --input FILE|- --expect SHA256
  remove --home ROOT --path history/YYYY/MM/ID.md --expect SHA256
  query  --home ROOT [--text TEXT] [--from DATE] [--until DATE] [--scope SCOPE]
         [--include-archive] [--include-undated] [--limit 10]
  index  --home ROOT [--budget 6000]
query/index 可加 --max-files 2000 --max-bytes 8388608。日期边界为 UTC，带时区时间保留其偏移语义。
事件输入需 event_key、scope、sources、occurred_at、status；时间未知用 unknown。
重导依 scope + event_key 去重，修改用 read 返回的 SHA-256；不解析 CLI 原生 transcript。
partial 表示正文已保存、索引待修，退出码为 2。remove 不宣称完成跨 owner 遗忘。
`;
function inputText(filename) {
  if (filename !== '-') {
    if (!filename) fail('ARGUMENT', '需要 --input FILE 或 -');
    if (fs.statSync(filename).size > 524288) fail('LIMIT', '输入超过 524288 字节');
    return fs.readFileSync(filename, 'utf8');
  }
  const chunks = []; let size = 0; const buffer = Buffer.alloc(8192);
  for (;;) { const count = fs.readSync(0, buffer, 0, buffer.length, null); if (!count) break; size += count; if (size > 524288) fail('LIMIT', '输入超过 524288 字节'); chunks.push(Buffer.from(buffer.subarray(0, count))); }
  return Buffer.concat(chunks).toString('utf8');
}
export function main(argv = process.argv.slice(2)) {
  if (!argv.length || ['--help', 'help'].includes(argv[0])) { process.stdout.write(help); return 0; }
  try {
    const { command, options } = argumentsMap(argv);
    const allowed = new Set(['home', 'path', 'input', 'expect', 'scope', 'text', 'from', 'until', 'include-archive', 'include-undated', 'limit', 'budget', 'max-files', 'max-bytes']);
    for (const key of Object.keys(options)) if (!allowed.has(key)) fail('ARGUMENT', `不支持参数：--${key}`);
    const tool = createHistory(options.home);
    const settings = { scope: options.scope, from: options.from, until: options.until, includeArchive: options['include-archive'], includeUndated: options['include-undated'], limit: integer(options.limit, 10, 1000), budget: integer(options.budget, 6000, 50000), maxFiles: integer(options['max-files'], 2000), maxBytes: integer(options['max-bytes'], 8388608, 67108864) };
    if (settings.budget < 512) fail('ARGUMENT', '索引预算至少 512 字符');
    let result;
    if (command === 'record') result = tool.record(inputText(options.input));
    else if (command === 'read') result = tool.read(options.path);
    else if (command === 'update') result = tool.update(options.path, inputText(options.input), options.expect);
    else if (command === 'remove') result = tool.remove(options.path, options.expect);
    else if (command === 'query') result = tool.query(options.text ?? '', settings);
    else if (command === 'index') result = tool.index(settings);
    else fail('ARGUMENT', `未知命令：${command}`);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); return result.status === 'partial' ? 2 : 0;
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ error: error.code ?? 'IO', message: error.message, existingPath: error.existingPath, sourceSaved: error.sourceSaved ?? false })}\n`); return 1;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
