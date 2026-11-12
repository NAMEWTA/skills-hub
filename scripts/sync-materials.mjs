#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readMaterials, parseTsvTable, stringifyTsv, resolveMaterialPath, PARENT_COLUMNS, CHILD_COLUMNS } from './materials-manifest.mjs';

// Compatibility aliases; the shared reader owns the schema.
export const PARENT = PARENT_COLUMNS;
export const CHILD = CHILD_COLUMNS;
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const git = (args, cwd) => execFileSync('git', ['--no-replace-objects', '-c', `core.hooksPath=${path.join(cwd,'disabled-hooks')}`, ...args], {
  cwd, maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...Object.fromEntries(Object.entries(process.env).filter(([k])=>!k.toUpperCase().startsWith('GIT_'))), GIT_NO_LAZY_FETCH:'1', GIT_TERMINAL_PROMPT:'0', GIT_CONFIG_NOSYSTEM:'1', GIT_CONFIG_GLOBAL:path.join(cwd,'empty-config'), GIT_TEMPLATE_DIR:path.join(cwd,'disabled-hooks') }
});
// Check each existing component, including the root itself; never canonicalize away a link.
async function noSymlinkAncestors(filename) {
  const absolute=path.resolve(filename); let cursor=path.parse(absolute).root;
  for (const component of absolute.slice(cursor.length).split(path.sep).filter(Boolean)) {
    cursor=path.join(cursor,component);
    try { if ((await fs.lstat(cursor)).isSymbolicLink()) throw Error(`Symlink forbidden: ${cursor}`); }
    catch(e) { if(e.code==='ENOENT') break; throw e; }
  }
}
async function temporaryRoot(directory, repoRoot, materialsRoot) {
  const source=path.resolve(directory); const repo=path.resolve(repoRoot);
  if (source===repo || repo.startsWith(source+path.sep) || source===materialsRoot || source.startsWith(materialsRoot+path.sep)) throw Error('Invalid preparation location');
  if (![path.resolve(os.tmpdir()),path.resolve(repo,'temp')].some(base=>source.startsWith(base+path.sep))) throw Error('Preparation must be in temp/ or the system temporary directory');
  await noSymlinkAncestors(source);
  return source;
}
const safe = p => typeof p === 'string' && p && !p.includes('\\') && !p.includes('\0') && !path.posix.isAbsolute(p) && p.split('/').every(x => x && x !== '.' && x !== '..' && x.toLowerCase() !== '.git');
function requireSafe(p) { if (!safe(p)) throw Error(`Unsafe path: ${p}`); }
async function put(root, p, bytes, mode = '100644') {
  requireSafe(p); const dest = path.join(root, p); await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, bytes, { mode: mode === '100755' ? 0o755 : 0o644 });
}
async function files(root, prefix = '') {
  if (!prefix) await noSymlinkAncestors(root);
  let entries; try { entries = await fs.readdir(path.join(root, prefix), { withFileTypes: true }); } catch (e) { if (e.code === 'ENOENT' && !prefix) return []; throw e; }
  const out = [];
  for (const e of entries.sort((a,b) => a.name.localeCompare(b.name))) {
    const p = prefix ? `${prefix}/${e.name}` : e.name; requireSafe(p);
    if (e.isSymbolicLink()) throw Error(`Symlink forbidden: ${p}`);
    if (e.isDirectory()) out.push(...await files(root, p));
    else if (e.isFile()) out.push(p); else throw Error(`Unsupported file: ${p}`);
  }
  return out;
}
async function fingerprint(root) {
  const h = crypto.createHash('sha256');
  for (const p of (await files(root)).sort()) {
    const stat = await fs.stat(path.join(root,p));
    h.update(`${p}\0${stat.mode & 0o111 ? 'x' : '-'}\0`); h.update(await fs.readFile(path.join(root,p))); h.update('\0');
  }
  return h.digest('hex');
}
async function snapshot(project, revision) {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'materials-git-'));
  try {
    await fs.mkdir(path.join(tmp,'disabled-hooks')); await fs.writeFile(path.join(tmp,'empty-config'),'');
    git(['init', '--bare', tmp], tmp);
    const remote = git(['ls-remote', '--symref', '--', project.repository, project.ref === 'HEAD' ? 'HEAD' : `refs/heads/${project.ref}`], tmp).toString();
    const resolved = remote.match(/^([a-f0-9]{40,64})\s/m)?.[1];
    if (!resolved) throw Error('Remote branch missing');
    const rev = revision || resolved;
    if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(rev)) throw Error('Invalid revision');
    git(['fetch', '--no-tags', '--depth=1', '--', project.repository, rev], tmp);
    const root = project.source_root;
    if (root !== '.') requireSafe(root);
    const tree = root === '.' ? `${rev}^{tree}` : `${rev}:${root}`;
    if (git(['cat-file', '-t', tree], tmp).toString().trim() !== 'tree') throw Error('Source root is not a tree');
    const list = new TextDecoder('utf-8',{fatal:true}).decode(git(['ls-tree', '-r', '-z', tree], tmp)).split('\0').filter(Boolean);
    const result = []; const folded = new Set();
    for (const item of list) {
      const m = item.match(/^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/);
      if (!m || m[2] !== 'blob' || !['100644','100755'].includes(m[1])) throw Error(`Unsupported Git entry: ${item}`);
      requireSafe(m[4]); const key = m[4].normalize('NFC').toLowerCase();
      if (folded.has(key) || m[4].split('/').some(x => /[<>:"|?*\x00-\x1f]/.test(x) || /[. ]$/.test(x) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(x))) throw Error(`Cross-platform path conflict: ${m[4]}`);
      folded.add(key);
      result.push({ path: m[4], mode: m[1], blob: m[3], bytes: git(['cat-file','blob',m[3]],tmp) });
    }
    return { revision: rev, latest: resolved, entries: result, defaultBranch: remote.match(/^ref: refs\/heads\/(.+)\tHEAD/m)?.[1] };
  } finally { await fs.rm(tmp, { recursive:true, force:true }); }
}
function identity(p) { return PARENT.map(k => p[k] || '').join('\0'); }
const encode = s => Buffer.from(s).toString('base64');
const decode = s => Buffer.from(s, 'base64').toString();
function evidence(report, type, name) {
  const line = report.split('\n').find(l => l.startsWith(`<!-- ${type} ${encode(name)} `));
  if (!line) throw Error(`Missing ${type} evidence: ${name}`);
  return line.split(' ')[3];
}
function classification(entry, old) {
  // Language/content classification is a human decision, never inferred from one Han character.
  if (old?.source_git_blob === entry.blob) return { kind:old.kind, language:old.language };
  return { kind: old?.kind || 'document', language: old?.language || 'en' };
}
async function prepare(current, selected, destination) {
  const report = ['# Materials synchronization', '', 'Edit the same-format tree to complete outstanding work, then replace its list below with “None.” and briefly describe what was completed. No per-file approval protocol. Structural checks cannot certify translation fidelity.', ''];
  const pending=[];
  const projects = []; const runtimeImpact = new Map();
  for (const p of selected) {
    requireSafe(p.project); if (p.manifest_path !== `${p.project}/manifest.tsv`) throw Error('Unexpected manifest path');
    const snap = await snapshot(p);
    // Required local container, including a valid empty Git tree (not a promise
    // to mirror untracked empty source directories).
    await fs.mkdir(path.join(destination,p.project,'upstream'),{recursive:true});
    report.push(`## ${p.project}: ${p.revision} → ${snap.revision}`, `Source root: ${p.source_root}; resolved default branch: ${snap.defaultBranch || p.ref}`, `<!-- baseline ${encode(p.project)} ${await fingerprint(path.join(current,p.project))} -->`, `<!-- identity ${encode(p.project)} ${encode(identity(p))} -->`);
    const target = { ...p, revision:snap.revision };
    report.push(`<!-- target ${encode(p.project)} ${encode(identity(target))} -->`);
    const old = new Map(p.rows.map(r => [r.path,r])); const rows=[]; const seen = new Set();
    for (const e of snap.entries) {
      let previous = old.get(e.path); let moved = false;
      if (!previous) {
        const matches = p.rows.filter(r => r.source_git_blob === e.blob && !snap.entries.some(n => n.path === r.path));
        if (matches.length === 1) { previous=matches[0]; moved=true; seen.add(previous.path); }
      }
      seen.add(e.path);
      const unchanged = previous?.source_git_blob === e.blob;
      const row = Object.fromEntries(CHILD.map(k => [k,'']));
      Object.assign(row, classification(e,previous), { path:e.path, source_git_mode:e.mode, source_git_blob:e.blob, upstream_sha256:sha(e.bytes), runtime_paths:previous?.runtime_paths || '', runtime_reviewed_blob:previous?.runtime_reviewed_blob || '', adaptation:previous?.adaptation || '' });
      await put(destination, `${p.project}/upstream/${e.path}`, e.bytes,e.mode);
      let reused = false;
      if (unchanged && previous.language !== 'zh' && previous.zh_path && previous.zh_sha256) {
        const oldTranslation=path.join(current,p.project,previous.zh_path);
        await noSymlinkAncestors(oldTranslation);
        const b = await fs.readFile(oldTranslation);
        if (sha(b) !== previous.zh_sha256) throw Error(`Old translation digest mismatch: ${previous.path}`);
        row.zh_path=`zh/${e.path}`; row.zh_sha256=sha(b); await put(destination,`${p.project}/${row.zh_path}`,b,e.mode); reused=true;
      }
      if (!unchanged) pending.push(`- ${p.project}/${e.path}: classification is provisional; complete applicable Chinese counterpart and adaptation explanation.`);
      else if (row.language !== 'zh' && !reused) pending.push(`- ${p.project}/${e.path}: Chinese counterpart missing.`);
      if (moved) pending.push(`- ${p.project}/${e.path}: verify translated relative navigation after move.`);
      if (!previous || !unchanged || moved || previous.source_git_mode !== e.mode) report.push(`- ${moved?'MOVE':!previous?'ADD':!unchanged?'CHANGE':'MODE'} ${JSON.stringify(previous?.path || '')} → ${JSON.stringify(e.path)}; runtime: ${row.runtime_paths || '(none)'}`);
      if (!previous) {
        const candidates = p.rows.filter(r => !snap.entries.some(n => n.path === r.path) && path.posix.basename(r.path) === path.posix.basename(e.path));
        if (candidates.length) report.push(`  - Unconfirmed move/split/merge candidates: ${candidates.map(r=>JSON.stringify(r.path)).join(', ')}; do not inherit mappings without review`);
      }
      rows.push(row);
    }
    for (const r of p.rows) if (!seen.has(r.path)) report.push(`- DELETE ${JSON.stringify(r.path)}; runtime: ${r.runtime_paths || '(none)'}; source no longer covers these resources (runtime files NOT deleted)`);
    for (const previous of p.rows) {
      const next=rows.find(r=>r.path===previous.path);
      if (next && next.source_git_blob===previous.source_git_blob && next.source_git_mode===previous.source_git_mode) continue;
      for (const runtime of (previous.runtime_paths || '').split(';').filter(Boolean)) {
        if (!runtimeImpact.has(runtime)) runtimeImpact.set(runtime,[]);
        runtimeImpact.get(runtime).push(`${p.project}/${previous.path}: ${next ? 'source changed; assess adaptation' : 'removed or moved; inspect change list'}`);
      }
    }
    await put(destination,`${p.project}/manifest.tsv`,stringifyTsv(rows.sort((a,b)=>a.path.localeCompare(b.path)),CHILD)); projects.push(target);
  }
  report.push('', '## Runtime impact by local file');
  for (const [runtime, changes] of [...runtimeImpact].sort(([a],[b])=>a.localeCompare(b))) report.push(`- ${runtime}`, ...changes.map(c=>`  - ${c}`));
  if (!runtimeImpact.size) report.push('No changed source has an existing runtime mapping. New materials do not imply runtime adoption.');
  report.push('', '## Outstanding work', ...(pending.length ? pending : ['None.']), '', '## Completion notes', 'No automated claim of translation fidelity.');
  await put(destination,'manifest.tsv',stringifyTsv(projects,PARENT));
  await put(destination,'REPORT.md',report.join('\n')+'\n');
  return report.join('\n');
}
async function validatePrepared(root, p, snap, repoRoot) {
  const expected = new Set(['manifest.tsv']); const byPath = new Map(p.rows.map(r=>[r.path,r]));
  if (byPath.size !== p.rows.length || p.rows.length !== snap.entries.length) throw Error('Incomplete source inventory');
  for (const e of snap.entries) {
    const r = byPath.get(e.path); if (!r) throw Error(`Missing source: ${e.path}`);
    const b = await fs.readFile(path.join(root,p.project,'upstream',e.path));
    const stat = await fs.stat(path.join(root,p.project,'upstream',e.path));
    if (!b.equals(e.bytes) || r.source_git_blob!==e.blob || r.source_git_mode!==e.mode || r.upstream_sha256!==sha(b) || (process.platform!=='win32' && Boolean(stat.mode&0o111)!==(e.mode==='100755'))) throw Error(`Source mismatch: ${e.path}`);
    expected.add(`upstream/${e.path}`);
    if (!['document','code','fixture','asset','legal'].includes(r.kind) || !['en','mixed','zh','none'].includes(r.language)) throw Error('Invalid classification');
    if (r.language === 'zh') { if (r.zh_path || r.zh_sha256) throw Error('Chinese original must not have duplicate'); }
    else {
      if (r.zh_path !== `zh/${e.path}`) throw Error(`Translation missing: ${e.path}`);
      const z = await fs.readFile(path.join(root,p.project,r.zh_path));
      if (sha(z)!==r.zh_sha256) throw Error('Translation digest mismatch');
      if ((r.language==='none' || ['legal','fixture','asset'].includes(r.kind)) && !z.equals(b)) throw Error('Byte counterpart changed');
      if (r.kind==='document' && ['en','mixed'].includes(r.language)) {
        let text; try { text=new TextDecoder('utf-8',{fatal:true}).decode(z); } catch { throw Error('Document counterpart must be UTF-8'); }
        if (!/[\u3400-\u9fff]/u.test(text)) throw Error('Chinese translation is absent');
        if (z.equals(b)) throw Error('Untranslated copy');
      }
      expected.add(r.zh_path);
    }
    if (!r.adaptation?.trim()) throw Error('Missing adaptation explanation');
    const destinations=r.runtime_paths ? r.runtime_paths.split(';') : [];
    if (r.runtime_reviewed_blob && (!destinations.length || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(r.runtime_reviewed_blob))) throw Error('Invalid runtime reviewed blob');
    if (new Set(destinations).size!==destinations.length) throw Error('Duplicate runtime paths');
    if (new Set(destinations.filter(p=>p.startsWith('skills/dev/')).map(p=>p.split('/')[2])).size>1) throw Error('Development method must have one owning skill');
    for (const rp of destinations) {
      requireSafe(rp); if (!/^skills\/[^/]+\/[^/]+\/.+/.test(rp)) throw Error('Runtime outside skill files');
      resolveMaterialPath(repoRoot,rp);
    }
  }
  const actual = await files(path.join(root,p.project));
  if (actual.length!==expected.size || actual.some(f=>!expected.has(f))) throw Error('Unexpected prepared files');
}

export async function syncMaterials({ materialsRoot = path.resolve('materials'), repoRoot = path.dirname(materialsRoot), projects, all = false, mode = 'dry-run', directory }) {
  materialsRoot=path.resolve(materialsRoot);
  await noSymlinkAncestors(materialsRoot);
  if (!['dry-run','prepare','apply'].includes(mode)) throw Error('Unknown mode');
  const current = await readMaterials(repoRoot);
  const selected = current.projects.filter(p=>all || projects?.includes(p.project));
  if (!selected.length || (!all && projects.some(n=>!selected.some(p=>p.project===n)))) throw Error('Unknown/empty project selection');
  if (mode !== 'apply') {
    const temp = directory ? path.resolve(directory) : await fs.mkdtemp(path.join(os.tmpdir(),'materials-preview-'));
    await temporaryRoot(temp,repoRoot,materialsRoot);
    if (directory) await fs.mkdir(temp); // never overwrite an existing preparation
    try { return await prepare(materialsRoot,selected,temp); }
    catch(e) { await fs.rm(temp,{recursive:true,force:true}); throw e; }
    finally { if (mode==='dry-run') await fs.rm(temp,{recursive:true,force:true}); }
  }
  if (!directory) throw Error('--from required');
  const source=await temporaryRoot(directory,repoRoot,materialsRoot);
  await files(source); // reject all symlinks before reading manifests
  const parentRows = parseTsvTable(await fs.readFile(path.join(source,'manifest.tsv'),'utf8'), PARENT_COLUMNS, 'prepared manifest.tsv').rows;
  if (new Set(parentRows.map(p=>p.project)).size!==parentRows.length) throw Error('Duplicate prepared project');
  const prepared={projects:[]};
  for (const p of parentRows) {
    requireSafe(p.project); if(p.manifest_path!==`${p.project}/manifest.tsv`) throw Error('Invalid prepared manifest path');
    const rows=parseTsvTable(await fs.readFile(path.join(source,p.manifest_path),'utf8'), CHILD_COLUMNS, p.manifest_path).rows;
    prepared.projects.push({...p,rows});
  }
  const report=await fs.readFile(path.join(source,'REPORT.md'),'utf8');
  if (prepared.projects.length!==selected.length) throw Error('Prepared selection mismatch');
  const lock=path.join(materialsRoot,'.sync-materials-lock'); await fs.mkdir(lock);
  let work; const switched=[]; let parentChanged=false; let preserveRecovery=false;
  let parentBytes;
  try {
    parentBytes=await fs.readFile(path.join(materialsRoot,'manifest.tsv'));
    // Parse the exact locked byte baseline, never merge using the pre-lock model.
    const lockedCurrent=readMaterials(repoRoot,{parentText:parentBytes.toString('utf8')});
    for (const p of selected) {
      const locked=lockedCurrent.projects.find(row=>row.project===p.project);
      if (!locked || identity(locked)!==identity(p)) throw Error(`Parent manifest conflict: ${p.project}`);
    }
    work=await fs.mkdtemp(path.join(materialsRoot,'.sync-materials-'));
    for (const p of selected) {
      requireSafe(p.project);
      if (decode(evidence(report,'identity',p.project))!==identity(p) || evidence(report,'baseline',p.project)!==await fingerprint(path.join(materialsRoot,p.project))) throw Error(`Conflict: ${p.project}`);
      const target=prepared.projects.find(x=>x.project===p.project);
      if (!target || target.repository!==p.repository || target.ref!==p.ref || target.source_root!==p.source_root || target.manifest_path!==p.manifest_path || decode(evidence(report,'target',p.project))!==identity(target)) throw Error('Source identity mismatch');
      const outstanding=report.match(/^## Outstanding work\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1].trim();
      if (outstanding!=='None.') throw Error('Outstanding translation/classification/navigation work incomplete');
      for (const row of target.rows) {
        const previous=p.rows.find(r=>r.path===row.path);
        if (previous && previous.source_git_blob!==row.source_git_blob && row.kind==='document' && ['en','mixed'].includes(row.language) && previous.zh_sha256 && row.zh_sha256===previous.zh_sha256) throw Error(`Unchanged old translation for changed source: ${row.path}`);
      }
      const snap=await snapshot(target,target.revision);
      await validatePrepared(source,target,snap,repoRoot);
      await fs.cp(path.join(source,p.project),path.join(work,`new-${p.project}`),{recursive:true});
      await validatePrepared(work,{...target,project:`new-${p.project}`},snap,repoRoot);
      if (snap.latest!==target.revision) process.stderr.write(`${p.project}: prepared SHA is pinned; remote now ${snap.latest}\n`);
    }
    // Merge only selected identities; preserve all other current parent rows.
    const latest=await fs.readFile(path.join(materialsRoot,'manifest.tsv'));
    if (!latest.equals(parentBytes)) throw Error('Parent manifest conflict');
    for (const p of selected) if (evidence(report,'baseline',p.project)!==await fingerprint(path.join(materialsRoot,p.project))) throw Error('Concurrent project conflict');
    const merged=lockedCurrent.projects.map(p=>prepared.projects.find(t=>t.project===p.project)||p);
    await put(work,'parent.tsv',stringifyTsv(merged,PARENT));
    for (const p of selected) {
      await fs.rename(path.join(materialsRoot,p.project),path.join(work,`old-${p.project}`)); switched.push(p.project);
      await fs.rename(path.join(work,`new-${p.project}`),path.join(materialsRoot,p.project));
    }
    await fs.rename(path.join(work,'parent.tsv'),path.join(materialsRoot,'manifest.tsv')); parentChanged=true;
    return report;
  } catch(e) {
    const failures=[];
    for (const name of switched.reverse()) {
      try { await fs.rm(path.join(materialsRoot,name),{recursive:true,force:true}); await fs.rename(path.join(work,`old-${name}`),path.join(materialsRoot,name)); }
      catch (rollbackError) { failures.push(rollbackError); }
    }
    if (parentChanged) { try { await fs.writeFile(path.join(materialsRoot,'manifest.tsv'),parentBytes); } catch (rollbackError) { failures.push(rollbackError); } }
    if (failures.length) { preserveRecovery=true; throw new AggregateError([e,...failures],`Rollback incomplete; preserve recovery files at ${work}`); }
    throw e;
  } finally { if(work && !preserveRecovery) await fs.rm(work,{recursive:true,force:true}); await fs.rm(lock,{recursive:true,force:true}); }
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2); const options={projects:[]}; let modes=0;
  try {
    for(let i=0;i<args.length;i++) {
      const a=args[i];
      if(a==='--project') options.projects.push(args[++i]);
      else if(a==='--all') options.all=true;
      else if(a==='--dry-run') { options.mode='dry-run'; modes++; }
      else if(a==='--prepare') { options.mode='prepare'; options.directory=args[++i]; modes++; }
      else if(a==='--apply') { options.mode='apply'; modes++; }
      else if(a==='--from') options.directory=args[++i];
      else throw Error(`Unknown option: ${a}`);
    }
    if(modes>1 || (options.all && options.projects.length)) throw Error('Conflicting selection/mode');
    console.log(await syncMaterials(options));
  } catch(e) { console.error(e.message); process.exitCode=1; }
}
