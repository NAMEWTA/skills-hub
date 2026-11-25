import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

export const digest = (text) => createHash('sha256').update(text).digest('hex');
export const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export function fail(code, message, details = {}) {
  throw Object.assign(new Error(message), { code, ...details });
}
export function integer(value, fallback, maximum = 10000) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > maximum) fail('ARGUMENT', `整数必须在 1 到 ${maximum} 之间`);
  return number;
}

export function parseDocument(content) {
  const text = content.replaceAll('\r\n', '\n');
  const metadata = Object.create(null);
  if (!text.startsWith('---\n')) return { metadata, body: text };
  const end = text.indexOf('\n---\n', 4);
  if (end < 0) fail('METADATA', 'frontmatter 缺少结束行');
  for (const line of text.slice(4, end).split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const match = /^([a-z][a-z0-9_]*):\s*(.*)$/.exec(line);
    if (!match || Object.hasOwn(metadata, match[1])) fail('METADATA', '工具仅接受不重复的平面 frontmatter 字段');
    const [, key, raw] = match;
    let value = raw.trim();
    if (value.startsWith('[') || value.startsWith('"')) {
      try { value = JSON.parse(value); } catch { fail('METADATA', `${key} 的字符串或列表格式无效`); }
    } else if (value.startsWith("'")) {
      if (!value.endsWith("'")) fail('METADATA', `${key} 的引号未闭合`);
      value = value.slice(1, -1).replaceAll("''", "'");
    } else if (/^[{>|&*!]/.test(value)) fail('METADATA', `${key} 需要普通字符串或 JSON 字符串列表`);
    if (typeof value !== 'string' && !(Array.isArray(value) && value.every((item) => typeof item === 'string'))) fail('METADATA', `${key} 需要字符串或字符串列表`);
    metadata[key] = value;
  }
  sourceMetadata(metadata);
  return { metadata, body: text.slice(end + 5) };
}

export function renderDocument(metadata, body) {
  const lines = Object.keys(metadata).sort(compare).map((key) => `${key}: ${JSON.stringify(metadata[key])}`);
  return `---\n${lines.join('\n')}\n---\n${body.replace(/^\n*/, '\n')}`.replace(/\n*$/, '\n');
}

function sourceMetadata(metadata, required = false) {
  const nonempty = (value) => typeof value === 'string' && Boolean(value.trim());
  if ((required || Object.hasOwn(metadata, 'scope')) && !nonempty(metadata.scope)) fail('PROVENANCE', 'scope 必须是非空字符串');
  if ((required || Object.hasOwn(metadata, 'sources')) && (!Array.isArray(metadata.sources) || !metadata.sources.length || !metadata.sources.every(nonempty))) fail('PROVENANCE', 'sources 必须是非空字符串列表');
  if (Object.hasOwn(metadata, 'derived_from') && (!Array.isArray(metadata.derived_from) || !metadata.derived_from.every(nonempty))) fail('PROVENANCE', 'derived_from 必须是非空字符串组成的列表；没有派生来源时可省略或使用空列表');
}
export function provenance(metadata) { sourceMetadata(metadata, true); }

function tableCells(line) {
  const source = line.trim(); const cells = []; let value = ''; let lastSeparator = -1;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '\\' && ['|', '\\'].includes(source[index + 1])) value += source[++index];
    else if (char === '|') { cells.push(value.trim()); value = ''; lastSeparator = index; }
    else value += char;
  }
  if (lastSeparator < 0) return null;
  cells.push(value.trim());
  if (source.startsWith('|')) cells.shift();
  if (lastSeparator === source.length - 1) cells.pop();
  return cells;
}

export function parseExclusions(content) {
  if (content === null) return { entries: [], lines: [], end: -1 };
  const lines = content.replaceAll('\r\n', '\n').split('\n');
  const headers = lines.map((line, index) => ({ cells: tableCells(line), index })).filter(({ cells }) => cells?.join('\0') === 'source_ref\0scope\0basis_ref');
  if (headers.length !== 1) fail('EXCLUSIONS_FORMAT', 'exclusions.md 需要唯一的 source_ref / scope / basis_ref 三列表；先人工核对，不能当空文件忽略');
  let end = headers[0].index + 1; const separator = tableCells(lines[end] ?? '');
  if (separator?.length !== 3 || !separator.every((cell) => /^:?-+:?$/.test(cell))) fail('EXCLUSIONS_FORMAT', '排除表缺少有效分隔行');
  const entries = [];
  while (end + 1 < lines.length) {
    const line = lines[end + 1];
    if (!line.trim()) break;
    const cells = tableCells(line);
    if (!cells) fail('EXCLUSIONS_FORMAT', '排除表含无法解释的数据行；需有来源、范围和依据三列，表后正文用空行分隔');
    if (cells.length !== 3 || cells.some((cell) => !cell)) fail('EXCLUSIONS_FORMAT', '排除项必须有来源身份、范围和依据引用');
    if (entries.length >= 1000) fail('EXCLUSIONS_FORMAT', '排除表超过 1000 项，需要按授权整理');
    entries.push({ source_ref: cells[0], scope: cells[1], basis_ref: cells[2] }); end += 1;
  }
  return { entries, lines, end };
}

export function excluded(metadata, entries) {
  sourceMetadata(metadata);
  const sources = [...(Array.isArray(metadata.sources) ? metadata.sources : []), ...(Array.isArray(metadata.derived_from) ? metadata.derived_from : [])];
  return entries.some((entry) => (entry.scope === '*' || entry.scope === metadata.scope) && sources.includes(entry.source_ref));
}

export function appendExclusion(content, entry) {
  for (const key of ['source_ref', 'scope', 'basis_ref']) if (typeof entry[key] !== 'string' || !entry[key].trim() || /[\r\n\0]/.test(entry[key])) fail('ARGUMENT', `${key} 必须是非空单行值`);
  if (entry.source_ref === '*') fail('ARGUMENT', 'source_ref 必须是准确来源身份，不能使用通配符');
  const initial = content ?? '# 不再摄取的来源\n\n只保留用户允许保存的最小来源身份、范围与依据，不保存被忘记的正文。\n\n| source_ref | scope | basis_ref |\n| --- | --- | --- |\n';
  const parsed = parseExclusions(initial);
  if (parsed.entries.some((row) => row.source_ref === entry.source_ref && row.scope === entry.scope)) return { content: initial, changed: false };
  const cell = (value) => value.replaceAll('\\', '\\\\').replaceAll('|', '\\|');
  parsed.lines.splice(parsed.end + 1, 0, `| ${cell(entry.source_ref)} | ${cell(entry.scope)} | ${cell(entry.basis_ref)} |`);
  return { content: parsed.lines.join('\n').replace(/\n*$/, '\n'), changed: true };
}

export function openFiles(homeRoot, { writable, lockName, fsOps = fs }) {
  if (!homeRoot) fail('ARGUMENT', '必须显式传入 --home，不能从 cwd 推定知识归属');
  const requested = path.resolve(homeRoot);
  if (fsOps.lstatSync(requested).isSymbolicLink()) fail('PATH', 'Home 根本身不能是符号链接');
  const root = fsOps.realpathSync(requested);
  if (!fsOps.statSync(root).isDirectory()) fail('PATH', 'Home 根必须是已有目录');
  const base = path.join(root, '.agents', 'home');

  function checked(relative, createParents = false) {
    if (typeof relative !== 'string' || !relative || /[:\\\0\r\n]/.test(relative) || path.posix.isAbsolute(relative) || path.win32.isAbsolute(relative) || path.posix.normalize(relative) !== relative || relative.split('/').some((part) => !part || part === '..' || part === '.')) fail('PATH', '需要 .agents/home 内的规范相对路径');
    if (fsOps.realpathSync(requested) !== root || fsOps.lstatSync(requested).isSymbolicLink()) fail('PATH', 'Home 根在操作期间发生变化');
    const segments = ['.agents', 'home', ...relative.split('/')]; let current = root;
    for (let index = 0; index < segments.length; index += 1) {
      current = path.join(current, segments[index]); let stat;
      try { stat = fsOps.lstatSync(current); }
      catch (error) {
        if (error.code !== 'ENOENT') throw error;
        if (!createParents || index === segments.length - 1) continue;
        try { fsOps.mkdirSync(current, { mode: 0o700 }); } catch (mkdirError) { if (mkdirError.code !== 'EEXIST') throw mkdirError; }
        stat = fsOps.lstatSync(current);
      }
      if (!stat) continue;
      if (stat.isSymbolicLink()) fail('PATH', `拒绝符号链接路径：${relative}`);
      if (index < segments.length - 1 && !stat.isDirectory()) fail('PATH', `父路径不是目录：${relative}`);
    }
    return current;
  }

  function read(relative, maximumBytes = 524288) {
    const filename = checked(relative); let stat;
    try { stat = fsOps.lstatSync(filename); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
    if (!stat.isFile() || stat.isSymbolicLink()) fail('PATH', `需要普通文件：${relative}`);
    if (stat.size > maximumBytes) fail('LIMIT', `文件超过 ${maximumBytes} 字节：${relative}`);
    const fd = fsOps.openSync(filename, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
    let content;
    try { if (!fsOps.fstatSync(fd).isFile()) fail('PATH', '读取目标不是普通文件'); content = fsOps.readFileSync(fd, 'utf8'); }
    finally { fsOps.closeSync(fd); }
    checked(relative);
    if (Buffer.byteLength(content) > maximumBytes) fail('LIMIT', `文件读取期间超过限制：${relative}`);
    return { path: relative, content, sha256: digest(content) };
  }

  function expectation(relative, expected) {
    if (expected !== 'missing' && !/^[0-9a-f]{64}$/.test(expected ?? '')) fail('EXPECTED_HASH', '写入/删除必须提供 read 返回的 SHA-256；新文件使用 missing');
    const before = read(relative);
    if ((expected === 'missing' && before) || (expected !== 'missing' && before?.sha256 !== expected)) fail('STALE', `原件已变化或存在冲突，重新读取：${relative}`);
    return before;
  }

  function replace(relative, content, expected) {
    if (!writable(relative)) fail('OWNER', `该包不维护此路径：${relative}`);
    if (typeof content !== 'string' || Buffer.byteLength(content) > 524288) fail('LIMIT', '正文必须是最多 524288 字节的 UTF-8 文本');
    const filename = checked(relative, true); const before = expectation(relative, expected);
    if (before?.content === content) return { path: relative, sha256: before.sha256, changed: false };
    const temporary = path.join(path.dirname(filename), `.${path.basename(filename)}.${randomUUID()}.tmp`);
    let fd;
    try {
      fd = fsOps.openSync(temporary, 'wx', 0o600); fsOps.writeFileSync(fd, content); fsOps.fsyncSync(fd); fsOps.closeSync(fd); fd = undefined;
      checked(relative); expectation(relative, expected);
      if (before) fsOps.renameSync(temporary, filename);
      else { fsOps.linkSync(temporary, filename); fsOps.unlinkSync(temporary); }
    } finally {
      if (fd !== undefined) fsOps.closeSync(fd);
      try { fsOps.unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    const after = read(relative);
    if (after?.sha256 !== digest(content)) fail('READBACK', `写入后读回不一致：${relative}`, { sourceSaved: true });
    return { path: relative, sha256: after.sha256, changed: true };
  }

  function remove(relative, expected) {
    if (!writable(relative)) fail('OWNER', `该包不维护此路径：${relative}`);
    if (expected === 'missing') fail('EXPECTED_HASH', '删除需要已读取原件的 SHA-256');
    expectation(relative, expected); fsOps.unlinkSync(checked(relative));
    return { path: relative, deleted: true };
  }

  function locked(action) {
    const filename = checked(lockName, true); const token = `${process.pid}\n${randomUUID()}\n`;
    let fd;
    try { fd = fsOps.openSync(filename, 'wx', 0o600); }
    catch (error) { if (error.code === 'EEXIST') fail('BUSY', `写入锁已存在：${lockName}；先核实原写入者，不按时间自动删锁`); throw error; }
    try { fsOps.writeFileSync(fd, token); fsOps.closeSync(fd); fd = undefined; return action(); }
    finally {
      if (fd !== undefined) fsOps.closeSync(fd);
      const current = read(lockName);
      if (current?.content === token) fsOps.unlinkSync(checked(lockName));
    }
  }

  function scan(areas, { maxFiles = 2000, maxBytes = 8388608, maxDepth = 10 } = {}) {
    const documents = []; const warnings = []; let visited = 0; let bytes = 0; let directories = 0; let complete = true; let metadataComplete = true;
    const walk = (relative, depth) => {
      if (!complete) return;
      if (depth > maxDepth || ++directories > 1000) { complete = false; warnings.push('目录范围超过限制'); return; }
      let entries;
      try { const directory = checked(`${relative}/.scan-check`); entries = fsOps.readdirSync(path.dirname(directory), { withFileTypes: true }); }
      catch (error) { if (error.code === 'ENOENT') return; complete = false; warnings.push(`${relative}: ${error.message}`); return; }
      for (const entry of entries.sort((a, b) => compare(a.name, b.name))) {
        const rel = `${relative}/${entry.name}`;
        if (entry.isSymbolicLink()) { complete = false; warnings.push(`未读取符号链接：${rel}`); continue; }
        if (entry.isDirectory()) { walk(rel, depth + 1); continue; }
        if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'index.md') continue;
        if (++visited > maxFiles) { complete = false; warnings.push(`文件超过 ${maxFiles} 个，范围未读完`); return; }
        try {
          const document = read(rel); if (!document) continue;
          bytes += Buffer.byteLength(document.content);
          if (bytes > maxBytes) { complete = false; warnings.push(`读取预算超过 ${maxBytes} 字节`); return; }
          try { Object.assign(document, parseDocument(document.content)); }
          catch (error) { metadataComplete = false; warnings.push(`${rel}: ${error.message}；未用于查询或导航，需 owner 核对原文`); continue; }
          document.title = document.metadata.title || /^#\s+(.+)$/m.exec(document.body)?.[1] || path.posix.basename(rel, '.md');
          documents.push(document);
        } catch (error) { complete = false; warnings.push(`${rel}: ${error.message}`); }
      }
    };
    for (const area of areas) walk(area, 0);
    return { documents, complete: complete && metadataComplete, warnings, scanned: documents.length, bytes, areas };
  }
  return { root, base, checked, read, replace, remove, locked, scan };
}

export function indexText(title, documents, indexPath, { maxChars = 6000, complete = true } = {}) {
  const escape = (value) => String(value).replace(/[\r\n]+/g, ' ').replace(/[\\[\]`*_]/g, '\\$&').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const lines = [`# ${title}`, '', '此文件是可重建导航；正文及来源约定为真源。未列出不表示没有记录。', ''];
  let shown = 0;
  for (const doc of documents) {
    const destination = path.posix.relative(path.posix.dirname(indexPath), doc.path).split('/').map(encodeURIComponent).join('/');
    const summary = doc.metadata.summary ? `：${escape(doc.metadata.summary).slice(0, 160)}` : '';
    const line = `- [${escape(doc.title).slice(0, 160)}](${destination})${summary}`;
    if ([...lines.join('\n')].length + [...line].length + 180 > maxChars) break;
    lines.push(line); shown += 1;
  }
  lines.push('', `已列 ${shown} / 本次可读 ${documents.length} 项；枚举${complete ? '完整' : '未完成'}；导航${shown < documents.length ? '已截断' : '未截断'}。`, '需要未列内容时，按本次范围检索正文；候选和归档须分别明确选择。', '');
  return { content: lines.join('\n'), shown, truncated: shown < documents.length || !complete };
}

export function argumentsMap(argv) {
  const [command, ...rest] = argv; const options = Object.create(null);
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!/^--[a-z][a-z-]*$/.test(key) || Object.hasOwn(options, key.slice(2))) fail('ARGUMENT', `无效或重复参数：${key}`);
    if (['--include-archive', '--include-undated'].includes(key)) options[key.slice(2)] = true;
    else { const value = rest[++index]; if (value === undefined || value.startsWith('--')) fail('ARGUMENT', `${key} 缺少值`); options[key.slice(2)] = value; }
  }
  return { command, options };
}
