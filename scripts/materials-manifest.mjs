import fs from 'node:fs';
import path from 'node:path';

export const PARENT_COLUMNS = ['project', 'repository', 'ref', 'revision', 'source_root', 'manifest_path'];
export const CHILD_COLUMNS = ['path', 'kind', 'language', 'source_git_mode', 'source_git_blob', 'upstream_sha256', 'zh_path', 'zh_sha256', 'runtime_paths', 'runtime_reviewed_blob', 'adaptation'];

function table(text) {
  const records = []; let row = []; let cell = ''; let state = 'plain';
  const endCell = () => { row.push(cell); cell = ''; state = 'plain'; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (state === 'quoted') {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') state = 'closed';
      else cell += c;
    } else if (c === '\t') endCell();
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      endCell(); records.push(row); row = [];
    } else if (c === '"' && state === 'plain' && cell === '') state = 'quoted';
    else {
      if (state === 'closed' || c === '"') throw new Error('Malformed TSV quoting');
      cell += c;
    }
  }
  if (state === 'quoted') throw new Error('Unclosed quoted TSV field');
  if (cell || row.length || state === 'closed') { endCell(); records.push(row); }
  if (!records.length) return { columns: [], rows: [] };
  const columns = records.shift();
  if (columns.some(c => !c) || new Set(columns).size !== columns.length) throw new Error('Empty or duplicate TSV columns');
  const rows = records.map((fields, index) => {
    if (fields.length !== columns.length) throw new Error(`TSV row ${index + 2}: expected ${columns.length} fields, got ${fields.length}`);
    return Object.fromEntries(columns.map((c, i) => [c, fields[i]]));
  });
  return { columns, rows };
}
export function parseTsv(text) { return table(text).rows; }
/** Parse and validate the actual header even when there are no data rows. */
export function parseTsvTable(text, expectedColumns, label = 'TSV') {
  const result = table(text);
  if (expectedColumns && JSON.stringify(result.columns) !== JSON.stringify(expectedColumns)) throw new Error(`${label}: columns must be ${expectedColumns.join(', ')}`);
  return result;
}
export function stringifyTsv(rows, columns) {
  const cell = value => { const s = String(value ?? ''); return /[\t\r\n"]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s; };
  return [columns, ...rows.map(row => columns.map(c => row[c] ?? ''))].map(row => row.map(cell).join('\t')).join('\n') + '\n';
}

export function assertRelativePath(value, { dot = false } = {}) {
  if (dot && value === '.') return;
  if (typeof value !== 'string' || !value || /[\\\x00-\x1f\x7f:]/.test(value) || value.split('/').some(p => !p || p === '.' || p === '..' || p.toLowerCase() === '.git')) throw new Error(`Unsafe relative path: ${JSON.stringify(value)}`);
}
// The repository root itself may be an alias; no component below it may be a symlink.
export function resolveMaterialPath(root, relative, type = 'file') {
  assertRelativePath(relative);
  const canonical = fs.realpathSync(root);
  let target = canonical;
  const parts = relative.split('/');
  for (let i = 0; i < parts.length; i++) {
    target = path.join(target, parts[i]);
    const stat = fs.lstatSync(target, { throwIfNoEntry: false });
    if (!stat) throw new Error(`missing ${relative}`);
    if (stat.isSymbolicLink()) throw new Error(`symlink forbidden: ${relative}`);
    if (i < parts.length - 1 ? !stat.isDirectory() : type === 'file' ? !stat.isFile() : !stat.isDirectory()) throw new Error(`Expected regular ${type}: ${relative}`);
  }
  return target;
}
function readTable(root, relative, columns) {
  return parseTsvTable(fs.readFileSync(resolveMaterialPath(root, relative), 'utf8'), columns, relative).rows;
}
/**
 * Read synchronously from an explicit repository root (not its materials/ directory).
 * No cwd/default-root inference, network access or writes. Root aliases are allowed;
 * symlinks below the root and malformed/duplicate manifests throw Error.
 * Returns { projects: parent rows with child `rows`, rows: flattened child rows }.
 * Optional parentText parses an already captured parent snapshot (e.g. under a
 * writer lock), so its model and byte conflict baseline refer to the same read.
 * Child files still resolve below root with the same symlink/path checks.
 */
export function readMaterials(root, { parentText } = {}) {
  const parents = parentText === undefined ? readTable(root, 'materials/manifest.tsv', PARENT_COLUMNS)
    : parseTsvTable(parentText, PARENT_COLUMNS, 'materials/manifest.tsv').rows;
  if (!parents.length) throw new Error('The parent material manifest must not be empty');
  const projects = []; const rows = []; const names = new Set(); const sources = new Set(); const manifests = new Set();
  // Validate every parent before opening any child.
  for (const p of parents) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.project) || names.has(p.project)) throw new Error(`Invalid or duplicate project: ${p.project}`);
    names.add(p.project);
    assertRelativePath(p.source_root, { dot: true }); assertRelativePath(p.manifest_path);
    if (p.manifest_path !== `${p.project}/manifest.tsv` || manifests.has(p.manifest_path)) throw new Error(`Invalid or duplicate manifest_path: ${p.manifest_path}`);
    manifests.add(p.manifest_path);
    if (!p.repository || !p.ref || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(p.revision)) throw new Error(`${p.project}: missing repository/ref or invalid revision`);
    const key = JSON.stringify([p.repository.replace(/\/$/, '').replace(/\.git$/, ''), p.source_root]);
    if (sources.has(key)) throw new Error(`duplicate source identity: ${p.repository} ${p.source_root}`);
    sources.add(key);
  }
  for (const p of parents) {
    const children = readTable(root, `materials/${p.manifest_path}`, CHILD_COLUMNS); const paths = new Set();
    for (const row of children) {
      assertRelativePath(row.path);
      if (paths.has(row.path)) throw new Error(`${p.project}: duplicate source path: ${row.path}`);
      paths.add(row.path);
      if (row.zh_path) assertRelativePath(row.zh_path);
      if (row.runtime_paths) for (const runtime of row.runtime_paths.split(';')) assertRelativePath(runtime);
      rows.push({ ...row, project: p.project, repository: p.repository, revision: p.revision, source_root: p.source_root });
    }
    projects.push({ ...p, rows: children });
  }
  return { projects, rows };
}
export function queryMaterials(materials, { project, path: sourcePath, source_path: repositoryPath, runtime_path: runtimePath } = {}) {
  return materials.rows.filter(row => (project === undefined || row.project === project)
    && (sourcePath === undefined || row.path === sourcePath)
    && (repositoryPath === undefined || (row.source_root === '.' ? row.path : `${row.source_root}/${row.path}`) === repositoryPath)
    && (runtimePath === undefined || row.runtime_paths.split(';').includes(runtimePath)));
}
