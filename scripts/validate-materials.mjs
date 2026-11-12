#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { repositoryRoot, isMain } from '../install.mjs';
import { readMaterials, resolveMaterialPath } from './materials-manifest.mjs';
export { parseTsv } from './materials-manifest.mjs';
const hash = (algorithm, bytes) => createHash(algorithm).update(bytes).digest('hex');
const oid = value => /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(value);

// Never follows symlinks, including directory links; reports special files instead.
function inventory(root, relative, failures, { optional = false } = {}) {
  const result = new Set();
  if (optional && !fs.lstatSync(path.join(root, relative), { throwIfNoEntry: false })) return result;
  let directory;
  try { directory = resolveMaterialPath(root, relative, 'directory'); }
  catch (error) { failures.push(error.message); return result; }
  function visit(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) failures.push(`${relative}/${name}: symlink forbidden`);
      else if (entry.isDirectory()) visit(path.join(dir, entry.name), name);
      else if (entry.isFile()) result.add(name);
      else failures.push(`${relative}/${name}: not a regular file`);
    }
  }
  visit(directory, ''); return result;
}
function compare(actual, expected, label, failures) {
  for (const file of actual) if (!expected.has(file)) failures.push(`${label}: unregistered file ${file}`);
  for (const file of expected) if (!actual.has(file)) failures.push(`${label}: missing file ${file}`);
}

// Optional offline authentication against an explicitly supplied local Git object store.
// No fetch, checkout, hooks, filters or source programs are executed.
export function checkSourceTree(root, project, gitDirectory) {
  const failures = [];
  const git = args => {
    const result = spawnSync('git', ['--no-replace-objects', '-C', gitDirectory, ...args], { encoding: 'buffer', maxBuffer: 128 * 1024 * 1024, env: { ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_'))), GIT_NO_LAZY_FETCH: '1', GIT_TERMINAL_PROMPT: '0' } });
    if (result.error || result.status !== 0) throw new Error(`Local Git objects unavailable: ${result.error?.message ?? result.stderr.toString().trim()}`);
    return result.stdout;
  };
  try {
    if (!oid(project.revision)) throw new Error('invalid revision');
    if (git(['cat-file', '-t', project.revision]).toString().trim() !== 'commit') throw new Error('revision must identify a commit');
    const tree = project.source_root === '.' ? `${project.revision}^{tree}` : `${project.revision}:${project.source_root}`;
    if (git(['cat-file', '-t', tree]).toString().trim() !== 'tree') throw new Error('source_root must identify a tree');
    const entries = new Map();
    for (const record of new TextDecoder('utf-8', { fatal: true }).decode(git(['ls-tree', '-rz', tree])).split('\0').filter(Boolean)) {
      const match = /^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/.exec(record);
      if (!match) throw new Error('unreadable Git tree entry');
      const [, mode, type, blob, name] = match;
      if (type !== 'blob' || !['100644', '100755'].includes(mode)) throw new Error(`unsupported source Git mode: ${mode} ${name}`);
      entries.set(name, { mode, blob });
    }
    const rows = new Map(project.rows.map(row => [row.path, row]));
    compare(new Set(entries.keys()), new Set(rows.keys()), `${project.project}: Git tree versus manifest`, failures);
    for (const [name, entry] of entries) {
      const row = rows.get(name); if (!row) continue;
      if (row.source_git_blob !== entry.blob || row.source_git_mode !== entry.mode) failures.push(`${project.project}/${name}: manifest blob/mode differs from source commit tree`);
      // Reading each object catches incomplete/promisor stores without fetching.
      const bytes = git(['cat-file', 'blob', entry.blob]);
      const local = fs.readFileSync(resolveMaterialPath(root, `materials/${project.project}/upstream/${name}`));
      if (!bytes.equals(local)) failures.push(`${project.project}/${name}: bytes differ from source commit blob`);
    }
  } catch (error) { failures.push(`${project.project}: ${error.message}`); }
  return failures;
}

export function check(root = repositoryRoot, { output = console.log, gitRepositories = {} } = {}) {
  const failures = []; let model;
  try { root = fs.realpathSync(root); model = readMaterials(root); }
  catch (error) { return [error.message]; }
  const materials = resolveMaterialPath(root, 'materials', 'directory');
  const expectedProjects = new Set(model.projects.map(p => p.project));
  for (const entry of fs.readdirSync(materials, { withFileTypes: true })) {
    if (!expectedProjects.has(entry.name) && !['README.md', 'manifest.tsv'].includes(entry.name)) failures.push(`materials: unregistered entry ${entry.name}`);
    if (entry.isSymbolicLink()) failures.push(`materials/${entry.name}: symlink forbidden`);
  }
  for (const project of model.projects) {
    const base = `materials/${project.project}`;
    const upstream = inventory(root, `${base}/upstream`, failures);
    const zh = inventory(root, `${base}/zh`, failures, { optional: true });
    const expectedUpstream = new Set(project.rows.map(r => r.path));
    const expectedZh = new Set(project.rows.filter(r => r.zh_path).map(r => r.zh_path.replace(/^zh\//, '')));
    compare(upstream, expectedUpstream, `${base}/upstream`, failures); compare(zh, expectedZh, `${base}/zh`, failures);
    for (const entry of fs.readdirSync(path.join(root, base))) if (!['manifest.tsv', 'upstream', 'zh'].includes(entry)) failures.push(`${base}: unregistered entry ${entry}`);
    for (const row of project.rows) {
      const label = `${project.project}/${row.path}`;
      const fail = message => failures.push(`${label}: ${message}`);
      if (!['document', 'code', 'fixture', 'asset', 'legal'].includes(row.kind)) fail('invalid kind');
      if (!['zh', 'en', 'mixed', 'none'].includes(row.language)) fail('invalid language');
      if (!['100644', '100755'].includes(row.source_git_mode)) fail('unsupported Git mode (symlink/gitlink require explicit handling)');
      if (!oid(row.source_git_blob)) fail('invalid source Git blob');
      if (!/^[a-f0-9]{64}$/.test(row.upstream_sha256)) fail('invalid upstream SHA-256');
      if (row.language === 'zh') {
        if (row.zh_path || row.zh_sha256) fail('Chinese source must have empty zh_path and zh_sha256');
      } else if (row.zh_path !== `zh/${row.path}` || !/^[a-f0-9]{64}$/.test(row.zh_sha256)) fail('zh_path must be the same source path under zh, with SHA-256');
      if (!row.adaptation.trim()) fail('missing adaptation explanation');
      let source; let localized;
      try {
        const filename = resolveMaterialPath(root, `${base}/upstream/${row.path}`);
        source = fs.readFileSync(filename);
        if (hash('sha256', source) !== row.upstream_sha256) fail('upstream differs from recorded SHA-256');
        const algorithm = row.source_git_blob.length === 64 ? 'sha256' : 'sha1';
        if (hash(algorithm, Buffer.concat([Buffer.from(`blob ${source.length}\0`), source])) !== row.source_git_blob) fail('upstream differs from recorded source Git blob');
        const executable = (fs.statSync(filename).mode & 0o111) !== 0;
        // Windows stat does not expose Git's executable bit; the optional object-tree check still verifies it.
        if (process.platform !== 'win32' && executable !== (row.source_git_mode === '100755')) fail('upstream executable mode differs from Git mode');
      } catch (error) { fail(error.message); }
      if (row.zh_path) try {
        localized = fs.readFileSync(resolveMaterialPath(root, `${base}/${row.zh_path}`));
        if (hash('sha256', localized) !== row.zh_sha256) fail('zh differs from recorded SHA-256');
      } catch (error) { fail(error.message); }
      if (source && localized && (row.kind === 'legal' || row.language === 'none' || ['asset', 'fixture'].includes(row.kind)) && !source.equals(localized)) fail('legal, machine or language-none counterpart must preserve original bytes');
      if (localized && row.kind === 'document' && ['en', 'mixed'].includes(row.language)) {
        try {
          const text = new TextDecoder('utf-8', { fatal: true }).decode(localized);
          if (!/[\u3400-\u9fff]/u.test(text)) fail('Chinese translation is absent');
        } catch { fail('document counterpart must be UTF-8'); }
        if (source?.equals(localized)) fail('document counterpart is an untranslated byte copy');
      }
      // Structural/hash checks cannot certify translation fidelity or language classification.
      const destinations = row.runtime_paths ? row.runtime_paths.split(';') : [];
      if (new Set(destinations).size !== destinations.length) fail('duplicate runtime paths');
      const owners = new Set(destinations.filter(p => p.startsWith('skills/dev/')).map(p => p.split('/')[2]));
      if (owners.size > 1) fail('development method must have one owning skill');
      for (const destination of destinations) {
        if (!/^skills\/[^/]+\/[^/]+\/.+/.test(destination)) { fail(`runtime destination outside skills or not a skill file: ${destination}`); continue; }
        try { resolveMaterialPath(root, destination); } catch (error) { fail(`runtime destination: ${error.message}`); }
      }
      if (row.runtime_reviewed_blob && (!destinations.length || !oid(row.runtime_reviewed_blob))) fail('runtime_reviewed_blob requires runtime mapping and valid reviewed blob');
    }
  }
  for (const [name, directory] of Object.entries(gitRepositories)) {
    const project = model.projects.find(p => p.project === name);
    if (!project) failures.push(`Unknown Git verification project: ${name}`);
    else failures.push(...checkSourceTree(root, project, directory));
  }
  output(`Checked ${model.projects.length} projects, ${model.rows.length} source files; local sets, hashes, blobs, modes and runtime paths; ${Object.keys(gitRepositories).length} explicit local Git trees (translation fidelity requires review).`);
  return failures;
}
export function main(argv = process.argv.slice(2)) {
  let root = repositoryRoot;
  if (argv.length === 2 && argv[0] === '--root') root = path.resolve(argv[1]);
  else if (argv.length) { console.error('Usage: node scripts/validate-materials.mjs [--root DIRECTORY]'); return 2; }
  try {
    const failures = check(root);
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    if (!failures.length) console.log('Local material snapshot validation passed.');
    return Number(failures.length > 0);
  } catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}
if (isMain(import.meta.url)) process.exitCode = main();
