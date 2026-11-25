#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { appendExclusion, argumentsMap, compare, excluded, fail, indexText, integer, openFiles, parseDocument, parseExclusions, provenance } from './files.mjs';

const documentPath = (relative) => /^(?:notes|inbox|archive\/notes)\/.+\.md$/.test(relative) && !relative.endsWith('/index.md');
const writable = (relative) => documentPath(relative) || ['notes/index.md', 'exclusions.md'].includes(relative);
const inactive = new Set(['retired', 'superseded', 'pending', 'candidate', 'unverified', 'draft', '退役', '已取代', '待核验', '候选', '草稿']);

export function createKnowledge(homeRoot, options = {}) {
  const files = openFiles(homeRoot, { writable, lockName: '.home-content-write.lock', fsOps: options.fsOps });
  const exclusions = () => parseExclusions(files.read('exclusions.md')?.content ?? null).entries;
  function owned(relative, allowExclusions = false) {
    if (!documentPath(relative) && !(allowExclusions && relative === 'exclusions.md')) fail('OWNER', '只能操作 notes、inbox、archive/notes 中的正文；索引由 index 命令生成');
  }
  function read(relative) { owned(relative, true); const result = files.read(relative); if (!result) fail('MISSING', `没有此原件：${relative}`); return result; }
  function scan(area = 'notes', settings = {}) {
    const areas = { notes: ['notes'], inbox: ['inbox'], archive: ['archive/notes'] }[area];
    if (!areas) fail('ARGUMENT', 'area 只能是 notes、inbox 或 archive；候选和归档需明确选择');
    const result = files.scan(areas, settings); const rows = exclusions(); let excludedCount = 0; let inactiveCount = 0;
    result.documents = result.documents.filter((document) => {
      if (excluded(document.metadata, rows)) { excludedCount += 1; return false; }
      if (area === 'notes' && !settings.includeInactive && inactive.has(document.metadata.status)) { inactiveCount += 1; return false; }
      return true;
    });
    return { ...result, excluded: excludedCount, inactive: inactiveCount };
  }
  function buildIndex(settings = {}) {
    const result = scan('notes', { ...settings, includeInactive: false });
    const documents = result.documents.sort((a, b) => compare(a.path, b.path));
    const rendered = indexText('Home 现行知识导航', documents, 'notes/index.md', { maxChars: settings.budget ?? 6000, complete: result.complete });
    const old = files.read('notes/index.md');
    const write = files.replace('notes/index.md', rendered.content, old?.sha256 ?? 'missing');
    return { ...write, shown: rendered.shown, truncated: rendered.truncated, complete: result.complete, warnings: result.warnings, excluded: result.excluded, inactive: result.inactive };
  }
  function afterWrite(result) {
    try { return { ...result, status: 'saved', sourceSaved: true, index: { status: 'updated', ...buildIndex() } }; }
    catch (error) { return { ...result, status: 'partial', sourceSaved: true, index: { status: 'pending', code: error.code ?? 'IO', message: error.message } }; }
  }
  function put(relative, content, expectedHash) {
    owned(relative); const parsed = parseDocument(content); provenance(parsed.metadata);
    return files.locked(() => {
      if (excluded(parsed.metadata, exclusions())) fail('EXCLUDED', '来源在此范围被排除；不能借新文件或重建重新摄取');
      return afterWrite(files.replace(relative, content, expectedHash));
    });
  }
  function remove(relative, expectedHash) {
    owned(relative);
    return files.locked(() => afterWrite(files.remove(relative, expectedHash)));
  }
  function exclude(entry, expectedHash) {
    return files.locked(() => {
      const before = files.read('exclusions.md');
      if ((before?.sha256 ?? 'missing') !== expectedHash) fail('STALE', 'exclusions.md 已改变，先重新读取；首次创建使用 missing');
      const next = appendExclusion(before?.content ?? null, entry);
      return afterWrite(files.replace('exclusions.md', next.content, expectedHash));
    });
  }
  function query(text, settings = {}) {
    if (typeof text !== 'string' || !text.trim()) fail('ARGUMENT', 'query 需要非空 text');
    const result = scan(settings.area ?? 'notes', settings); const needle = text.toLowerCase();
    const matches = result.documents.filter((document) => (!settings.scope || document.metadata.scope === settings.scope) && document.content.toLowerCase().includes(needle));
    const entries = matches.slice(0, settings.limit ?? 10).map((document) => {
      const at = document.content.toLowerCase().indexOf(needle);
      return { path: document.path, title: document.title, scope: document.metadata.scope ?? 'unknown', status: document.metadata.status ?? 'unspecified', evidence_kind: document.metadata.evidence_kind ?? 'unspecified', observed_at: document.metadata.observed_at ?? null, verified_at: document.metadata.verified_at ?? null, review_after: document.metadata.review_after ?? null, sources: document.metadata.sources ?? [], derived_from: document.metadata.derived_from ?? [], sha256: document.sha256, sourceCheck: document.metadata.scope && Array.isArray(document.metadata.sources) ? 'identifiers-only' : 'manual-required', snippet: document.content.slice(Math.max(0, at - 40), at + 160).replaceAll('\n', ' ') };
    });
    return { entries, matches: matches.length, returned: entries.length, complete: result.complete, truncated: entries.length < matches.length || !result.complete, scanned: result.scanned, areas: result.areas, excluded: result.excluded, inactive: result.inactive, warnings: result.warnings, basis: '正文检索；未依赖 index.md；来源标识检查不代替语义核验，未标状态不代表已核实' };
  }
  function lint(settings = {}) {
    const result = files.scan(['notes', 'inbox', ...(settings.includeArchive ? ['archive/notes'] : [])], settings);
    const entries = exclusions(); const findings = []; const identities = new Map();
    const today = settings.today ?? new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(today) || !Number.isFinite(Date.parse(today))) fail('ARGUMENT', 'today 需要有效 YYYY-MM-DD');
    for (const document of result.documents) {
      const metadata = document.metadata;
      if (document.metadataError) findings.push({ path: document.path, code: 'metadata', message: document.metadataError });
      if (!metadata.scope || !Array.isArray(metadata.sources) || !metadata.sources.length) findings.push({ path: document.path, code: 'provenance', message: '需人工核对来源和作用范围；没有据此判定内容错误' });
      if (excluded(metadata, entries)) findings.push({ path: document.path, code: 'excluded-source', message: '已停止使用的来源仍有正文，交 owner 按授权处理' });
      if (metadata.review_after && (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.review_after) || !Number.isFinite(Date.parse(metadata.review_after)))) findings.push({ path: document.path, code: 'date', message: 'review_after 不是有效日期' });
      else if (metadata.review_after && metadata.review_after <= today) findings.push({ path: document.path, code: 'review-due', message: '达到约定复核日期；未核实前不刷新 verified_at，也不据此判无效' });
      if (metadata.id) {
        if (identities.has(metadata.id)) findings.push({ path: document.path, code: 'duplicate-id', other: identities.get(metadata.id) });
        else identities.set(metadata.id, document.path);
      }
      for (const target of Array.isArray(metadata.related) ? metadata.related : []) {
        if (!documentPath(target)) { findings.push({ path: document.path, code: 'reference', message: `related 仅检查 Home 知识正文路径：${target}` }); continue; }
        try { if (!files.read(target)) findings.push({ path: document.path, code: 'missing-reference', target }); }
        catch (error) { findings.push({ path: document.path, code: 'reference', target, message: error.message }); }
      }
    }
    return { findings, complete: result.complete, warnings: result.warnings, scanned: result.scanned, changed: false };
  }
  return { read, put, remove, exclude, query, lint, index: (settings) => files.locked(() => buildIndex(settings)) };
}

const help = `Home 知识工具（Node.js 22.14+）
  read    --home ROOT --path notes/主题.md
  put     --home ROOT --path notes/主题.md --input FILE|- --expect SHA256|missing
  remove  --home ROOT --path notes/主题.md --expect SHA256
  exclude --home ROOT --source-ref ID --scope SCOPE --basis-ref REF --expect SHA256|missing
  query   --home ROOT --text TEXT [--area notes|inbox|archive] [--scope SCOPE] [--include-inactive] [--limit 10]
  index   --home ROOT [--budget 6000]
  lint    --home ROOT [--today YYYY-MM-DD] [--include-archive]
query/index/lint 可加 --max-files 2000 --max-bytes 8388608。索引预算单位为 Unicode 字符。
read 返回正文与 SHA-256。partial 表示正文已保存但索引待修，退出码为 2。
remove 只处理明确文件，不宣称完成跨 owner 遗忘。排除只匹配准确来源身份与 scope。
notes 默认跳过整篇标为候选、待核验或退役的正文；需查这些材料时明确 --include-inactive。
`;

function inputText(filename) {
  if (filename !== '-') {
    if (!filename) fail('ARGUMENT', 'put 需要 --input FILE 或 -');
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
    const allowed = new Set(['home', 'path', 'input', 'expect', 'source-ref', 'scope', 'basis-ref', 'text', 'area', 'limit', 'budget', 'max-files', 'max-bytes', 'today', 'include-archive', 'include-inactive']);
    for (const key of Object.keys(options)) if (!allowed.has(key)) fail('ARGUMENT', `不支持参数：--${key}`);
    const tool = createKnowledge(options.home);
    const settings = { area: options.area, scope: options.scope, limit: integer(options.limit, 10, 1000), budget: integer(options.budget, 6000, 50000), maxFiles: integer(options['max-files'], 2000), maxBytes: integer(options['max-bytes'], 8388608, 67108864), today: options.today, includeArchive: options['include-archive'], includeInactive: options['include-inactive'] };
    if (settings.budget < 512) fail('ARGUMENT', '索引预算至少 512 字符');
    let result;
    if (command === 'read') result = tool.read(options.path);
    else if (command === 'put') result = tool.put(options.path, inputText(options.input), options.expect);
    else if (command === 'remove') result = tool.remove(options.path, options.expect);
    else if (command === 'exclude') result = tool.exclude({ source_ref: options['source-ref'], scope: options.scope, basis_ref: options['basis-ref'] }, options.expect);
    else if (command === 'query') result = tool.query(options.text, settings);
    else if (command === 'index') result = tool.index(settings);
    else if (command === 'lint') result = tool.lint(settings);
    else fail('ARGUMENT', `未知命令：${command}`);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); return result.status === 'partial' ? 2 : 0;
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ error: error.code ?? 'IO', message: error.message, sourceSaved: error.sourceSaved ?? false })}\n`); return 1;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
