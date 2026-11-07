#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { repositoryRoot, readUtf8, isWithin, isMain } from '../install.mjs';

export function parseTsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const value = text[index];
    if (quoted) {
      if (value === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
      else if (value === '"') quoted = false;
      else cell += value;
    } else if (value === '"' && cell === '') quoted = true;
    else if (value === '\t') { row.push(cell); cell = ''; }
    else if (value === '\n' || value === '\r') {
      if (value === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell);
      if (row.some((field) => field.length)) rows.push(row);
      row = []; cell = '';
    } else cell += value;
  }
  if (quoted) throw new Error('Unclosed quoted field in materials/manifest.tsv');
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  if (!rows.length) return [];
  const header = rows.shift();
  return rows.map((fields) => Object.fromEntries(header.map((field, index) => [field, fields[index] ?? ''])));
}

const hash = (algorithm, bytes) => createHash(algorithm).update(bytes).digest('hex');

export function check(root = repositoryRoot, { output = console.log } = {}) {
  const failures = [];
  const materials = path.join(root, 'materials');
  const manifest = path.join(materials, 'manifest.tsv');
  if (!fs.statSync(manifest, { throwIfNoEntry: false })?.isFile()) return ['materials/manifest.tsv is missing'];
  const rows = parseTsv(readUtf8(manifest));
  if (!rows.length) return ['The material manifest must not be empty'];
  const identities = new Set();
  const sources = new Set();
  const kinds = { document: 0, code: 0, fixture: 0, asset: 0 };
  let mapped = 0;
  for (const row of rows) {
    const identity = row.id ?? '';
    if (!/^[a-z][0-9]{3}$/.test(identity) || identities.has(identity)) { failures.push(`Invalid or duplicate material identity: ${identity}`); continue; }
    identities.add(identity);
    const kind = row.kind ?? '';
    if (!Object.hasOwn(kinds, kind)) { failures.push(`${identity}: kind must be document, code, fixture or asset`); continue; }
    kinds[kind] += 1;
    const source = JSON.stringify([row.source_group ?? '', row.source_path ?? '']);
    if (!row.source_group || !row.source_path || sources.has(source)) failures.push(`${identity}: missing or duplicate source identity`);
    sources.add(source);
    const directory = path.join(materials, identity);
    const suffix = path.extname(row.source_path ?? '').toLowerCase();
    if (kind === 'asset' && !['.png', '.jpg', '.jpeg', '.svg'].includes(suffix)) { failures.push(`${identity}: unsupported asset extension: ${suffix}`); continue; }
    const originalName = kind === 'asset' ? `original${suffix}` : 'original.txt';
    const localizedName = kind === 'asset' ? `localized${suffix}` : kind === 'document' ? 'zh-CN.txt' : 'localized.txt';
    const pairedData = new Map();
    const directoryStat = fs.lstatSync(directory, { throwIfNoEntry: false });
    if (directoryStat?.isSymbolicLink()) { failures.push(`${identity}: material directory must not be a symlink`); continue; }
    for (const [filename, field] of [[originalName, 'original_sha256'], [localizedName, 'translation_sha256']]) {
      const target = path.join(directory, filename);
      const stat = fs.lstatSync(target, { throwIfNoEntry: false });
      if (!stat?.isFile() || stat.isSymbolicLink()) { failures.push(`${identity}: missing regular file ${filename}`); continue; }
      const data = fs.readFileSync(target);
      pairedData.set(filename, data);
      if (hash('sha256', data) !== row[field]) failures.push(`${identity}: ${filename} differs from its recorded SHA-256`);
      if (filename === originalName) {
        const blob = hash('sha1', Buffer.concat([Buffer.from(`blob ${data.length}\0`), data]));
        if (blob !== row.source_git_blob) failures.push(`${identity}: original differs from the recorded source Git blob`);
      }
      if (kind === 'asset') { if (!data.length) failures.push(`${identity}: empty asset`); continue; }
      let content;
      try { content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(data); }
      catch { failures.push(`${identity}: ${filename} must be UTF-8`); continue; }
      if (kind !== 'fixture' && !content.trim()) failures.push(`${identity}: ${filename} must not be empty`);
      if (kind === 'document' && filename === localizedName && !/[\u3400-\u9fff]/u.test(content)) failures.push(`${identity}: Chinese translation is absent`);
    }
    if (['fixture', 'asset'].includes(kind) && pairedData.size === 2 && !pairedData.get(originalName).equals(pairedData.get(localizedName))) failures.push(`${identity}: machine fixture or asset must preserve the original bytes`);
    if (directoryStat?.isDirectory() && JSON.stringify(fs.readdirSync(directory).sort()) !== JSON.stringify([originalName, localizedName].sort())) failures.push(`${identity}: expected only the paired files`);
    const destinations = (row.runtime_paths ?? '').split(';').filter(Boolean);
    if (destinations.length) mapped += 1;
    for (const relative of destinations) {
      const target = path.resolve(root, relative);
      let actual = target;
      try { actual = fs.realpathSync(target); } catch {}
      if (!isWithin(actual, path.join(root, 'skills')) || !fs.statSync(target, { throwIfNoEntry: false })?.isFile()) failures.push(`${identity}: runtime destination missing or outside skills: ${relative}`);
    }
    if (!row.source_path || !row.adaptation) failures.push(`${identity}: preserve the source path and adaptation explanation`);
  }
  const actual = new Set(fs.readdirSync(materials, { withFileTypes: true }).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => entry.name));
  const disagreement = [...actual].filter((name) => !identities.has(name)).concat([...identities].filter((name) => !actual.has(name))).sort();
  if (disagreement.length) failures.push(`Material directories and manifest disagree: ${JSON.stringify(disagreement)}`);
  output(`Checked ${rows.length} local pairs (${kinds.document} documents, ${kinds.code} code files, ${kinds.fixture} fixtures, ${kinds.asset} assets); ${mapped} have recorded runtime destinations.`);
  return failures;
}

export function main(argv = process.argv.slice(2)) {
  let root = repositoryRoot;
  if (argv.length === 2 && argv[0] === '--root') root = path.resolve(argv[1]);
  else if (argv.length) { console.error('Usage: node scripts/validate-materials.mjs [--root DIRECTORY]'); return 2; }
  try {
    const failures = check(root);
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    if (!failures.length) console.log('Local material pairs, recorded hashes and runtime destinations passed.');
    return Number(failures.length > 0);
  } catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}

if (isMain(import.meta.url)) process.exitCode = main();
