import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { syncMaterials, PARENT, CHILD } from '../scripts/sync-materials.mjs';
import { parseTsv, stringifyTsv, parseTsvTable, PARENT_COLUMNS, CHILD_COLUMNS } from '../scripts/materials-manifest.mjs';
import { check } from '../scripts/validate-materials.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>execFileSync('git',args,{cwd,stdio:['ignore','pipe','pipe']}).toString().trim();
async function fixture(t) {
 const tmp=await fs.mkdtemp(path.join(await fs.realpath(os.tmpdir()),'sync-test-')); t.after(()=>fs.rm(tmp,{recursive:true,force:true}));
 const repo=path.join(tmp,'remote'); const root=path.join(tmp,'local'); const materialsRoot=path.join(root,'materials');
 await fs.mkdir(repo); await fs.mkdir(path.join(materialsRoot,'speculo','upstream'),{recursive:true});
 git(repo,'init','-b','main'); git(repo,'config','core.autocrlf','false'); git(repo,'config','user.email','test@example.invalid'); git(repo,'config','user.name','Test');
 await fs.writeFile(path.join(repo,'a.md'),'English original\r\n'); git(repo,'add','.'); git(repo,'commit','-m','initial');
 const revision=git(repo,'rev-parse','HEAD'); const blob=git(repo,'rev-parse','HEAD:a.md');
 const p={project:'speculo',repository:repo,ref:'HEAD',revision,source_root:'.',manifest_path:'speculo/manifest.tsv'};
 const row=Object.fromEntries(CHILD.map(k=>[k,''])); Object.assign(row,{path:'a.md',kind:'document',language:'en',source_git_mode:'100644',source_git_blob:blob,upstream_sha256:hash('English original\r\n'),zh_path:'zh/a.md',zh_sha256:hash('中文完整译文\n'),adaptation:'Faithful material; no runtime adoption.'});
 await fs.mkdir(path.join(materialsRoot,'speculo','zh')); await fs.writeFile(path.join(materialsRoot,'speculo','upstream','a.md'),'English original\r\n'); await fs.writeFile(path.join(materialsRoot,'speculo','zh','a.md'),'中文完整译文\n');
 const write=async()=>{await fs.writeFile(path.join(materialsRoot,'manifest.tsv'),stringifyTsv([p],PARENT)); await fs.writeFile(path.join(materialsRoot,'speculo','manifest.tsv'),stringifyTsv([row],CHILD));}; await write();
 const run=(mode,directory)=>syncMaterials({materialsRoot,repoRoot:root,projects:['speculo'],mode,directory});
 const commit=()=>{git(repo,'add','-A');git(repo,'commit','-m','update');};
 return {tmp,repo,root,materialsRoot,p,row,write,run,commit};
}
async function review(dir, edit) {
 const mp=path.join(dir,'speculo','manifest.tsv'); const rows=parseTsv(await fs.readFile(mp,'utf8')); await edit(rows);
 for (const row of rows) if (!row.adaptation) row.adaptation='Classified and completed counterpart; no runtime adoption.';
 await fs.writeFile(mp,stringifyTsv(rows,CHILD)); const rp=path.join(dir,'REPORT.md'); await fs.writeFile(rp,(await fs.readFile(rp,'utf8')).replace(/## Outstanding work\n[\s\S]*?\n## Completion notes/, '## Outstanding work\nNone.\n\n## Completion notes')); 
}
test('same SHA is deterministic, preserves CRLF, and apply only selected snapshot',async t=>{
 const f=await fixture(t); const a=path.join(f.tmp,'a'),b=path.join(f.tmp,'b');
 await f.run('prepare',a); await f.run('prepare',b);
 assert.equal(await fs.readFile(path.join(a,'REPORT.md'),'utf8'),await fs.readFile(path.join(b,'REPORT.md'),'utf8'));
 await f.run('apply',a); assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo','upstream','a.md'),'utf8'),'English original\r\n');
 assert.equal(await f.run('dry-run'),await f.run('dry-run'));
});
test('network/branch failure and source-root absence leave official files intact',async t=>{
 const f=await fixture(t); const before=await fs.readFile(path.join(f.materialsRoot,'speculo','manifest.tsv'),'utf8');
 f.p.repository=path.join(f.tmp,'missing');await f.write();await assert.rejects(f.run('prepare',path.join(f.tmp,'bad')));
 f.p.repository=f.repo;f.p.source_root='missing';await f.write();await assert.rejects(f.run('dry-run'));
 f.p.source_root='.';f.p.ref='absent';await f.write();await assert.rejects(f.run('dry-run'));
 assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo','manifest.tsv'),'utf8'),before);
});
test('deletions report old runtime mappings; exact moves inherit, changed moves only candidates',async t=>{
 const f=await fixture(t); f.row.runtime_paths='skills/dev/real.md';await f.write();
 await fs.rename(path.join(f.repo,'a.md'),path.join(f.repo,'moved.md'));f.commit();
 const a=path.join(f.tmp,'move'); const report=await f.run('prepare',a);assert.match(report,/MOVE/);
 const rows=parseTsv(await fs.readFile(path.join(a,'speculo','manifest.tsv'),'utf8'));assert.equal(rows[0].runtime_paths,'skills/dev/real.md');
 await fs.unlink(path.join(f.repo,'moved.md'));await fs.mkdir(path.join(f.repo,'new'));await fs.writeFile(path.join(f.repo,'new','a.md'),'Different English');f.commit();
 const r=await f.run('dry-run');assert.match(r,/Unconfirmed move/);assert.match(r,/DELETE.*skills\/dev\/real.md/);
});
test('changed translations require human review; language switch en→zh and zh→en',async t=>{
 const f=await fixture(t);await fs.writeFile(path.join(f.repo,'a.md'),'完整中文原件');f.commit();const a=path.join(f.tmp,'zh');await f.run('prepare',a);
 await assert.rejects(f.run('apply',a),/work incomplete/);
 await review(a,async rows=>{rows[0].language='zh';});await f.run('apply',a);
 await assert.rejects(fs.access(path.join(f.materialsRoot,'speculo','zh','a.md')));
 await fs.writeFile(path.join(f.repo,'a.md'),'New English text');f.commit();const b=path.join(f.tmp,'en');await f.run('prepare',b);
 await review(b,async rows=>{rows[0].language='en';rows[0].zh_path='zh/a.md';rows[0].zh_sha256=hash('新的完整中文');await fs.mkdir(path.join(b,'speculo','zh'),{recursive:true});await fs.writeFile(path.join(b,'speculo','zh','a.md'),'新的完整中文');});
 await f.run('apply',b);assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo','zh','a.md'),'utf8'),'新的完整中文');
});
test('official edits, source tampering and forged target identity are rejected',async t=>{
 const f=await fixture(t); const a=path.join(f.tmp,'prep');await f.run('prepare',a);
 await fs.writeFile(path.join(f.materialsRoot,'speculo','zh','a.md'),'concurrent');await assert.rejects(f.run('apply',a),/Conflict/);
 await fs.writeFile(path.join(f.materialsRoot,'speculo','zh','a.md'),'中文完整译文\n');
 await fs.writeFile(path.join(a,'speculo','upstream','a.md'),'tampered');await assert.rejects(f.run('apply',a),/Source mismatch/);
 const parents=parseTsv(await fs.readFile(path.join(a,'manifest.tsv'),'utf8'));parents[0].source_root='outside';await fs.writeFile(path.join(a,'manifest.tsv'),stringifyTsv(parents,PARENT));await assert.rejects(f.run('apply',a),/identity mismatch/);
});
test('failure during switching rolls back project and parent',async t=>{
 const f=await fixture(t);await fs.writeFile(path.join(f.repo,'a.md'),'全新中文原件');f.commit();const a=path.join(f.tmp,'rollback');await f.run('prepare',a);
 await review(a,async rows=>{rows[0].language='zh';});
 const originalParent=await fs.readFile(path.join(f.materialsRoot,'manifest.tsv'),'utf8');
 const rename=fs.rename;let injected=false;
 fs.rename=async function(from,to){if(!injected && path.basename(from)==='parent.tsv'){injected=true;throw Error('injected disk failure');}return rename.call(this,from,to);};
 try {await assert.rejects(f.run('apply',a),/injected disk failure/);}finally{fs.rename=rename;}
 assert.equal(await fs.readFile(path.join(f.materialsRoot,'manifest.tsv'),'utf8'),originalParent);
 assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo','upstream','a.md'),'utf8'),'English original\r\n');
 await f.run('apply',a);
});
test('default branch is resolved anew; other parent rows and projects survive apply',async t=>{
 const f=await fixture(t); const p={...f.p,project:'other',source_root:'nested',manifest_path:'other/manifest.tsv'};
 await fs.mkdir(path.join(f.materialsRoot,'other'));await fs.writeFile(path.join(f.materialsRoot,'other','manifest.tsv'),stringifyTsv([],CHILD));
 await fs.writeFile(path.join(f.materialsRoot,'manifest.tsv'),stringifyTsv([f.p,p],PARENT));
 git(f.repo,'checkout','-b','new-default');await fs.mkdir(path.join(f.repo,'nested'));await fs.writeFile(path.join(f.repo,'nested','data'),'data');f.commit();
 const a=path.join(f.tmp,'branch');const report=await f.run('prepare',a);assert.match(report,/resolved default branch: new-default/);
 await review(a,async rows=>{const r=rows.find(r=>r.path==='nested/data');r.language='none';r.kind='fixture';r.zh_path='zh/nested/data';r.zh_sha256=hash('data');await fs.mkdir(path.join(a,'speculo','zh','nested'),{recursive:true});await fs.writeFile(path.join(a,'speculo','zh','nested','data'),'data');});
 await f.run('apply',a);const parents=parseTsv(await fs.readFile(path.join(f.materialsRoot,'manifest.tsv'),'utf8'));assert.deepEqual(parents.find(r=>r.project==='other'),p);
});
test('parent update injected at lock acquisition cannot be overwritten by the pre-lock model',async t=>{
 const f=await fixture(t);const other={...f.p,project:'other',source_root:'outside',manifest_path:'other/manifest.tsv'};
 await fs.mkdir(path.join(f.materialsRoot,'other'));await fs.writeFile(path.join(f.materialsRoot,'other/manifest.tsv'),stringifyTsv([],CHILD));
 const parent=path.join(f.materialsRoot,'manifest.tsv');await fs.writeFile(parent,stringifyTsv([f.p,other],PARENT));
 const a=path.join(f.tmp,'parent-window');await f.run('prepare',a);
 const changed={...other,revision:'1'.repeat(40)};const mkdir=fs.mkdir;let injected=false;
 fs.mkdir=async function(p,...args){const result=await mkdir.call(this,p,...args);if(p===path.join(f.materialsRoot,'.sync-materials-lock')){injected=true;await fs.writeFile(parent,stringifyTsv([f.p,changed],PARENT));}return result;};
 try {await f.run('apply',a);}finally{fs.mkdir=mkdir;}
 assert.equal(injected,true);
 assert.deepEqual(parseTsv(await fs.readFile(parent,'utf8')).find(p=>p.project==='other'),changed);
});

test('selected parent identity changed at lock acquisition rejects apply without switching',async t=>{
 const f=await fixture(t);const a=path.join(f.tmp,'selected-window');await f.run('prepare',a);
 const parent=path.join(f.materialsRoot,'manifest.tsv');const changed={...f.p,ref:'changed-branch'};const mkdir=fs.mkdir;
 fs.mkdir=async function(p,...args){const result=await mkdir.call(this,p,...args);if(p===path.join(f.materialsRoot,'.sync-materials-lock'))await fs.writeFile(parent,stringifyTsv([changed],PARENT));return result;};
 try {await assert.rejects(f.run('apply',a),/Conflict|conflict/);}finally{fs.mkdir=mkdir;}
 assert.deepEqual(parseTsv(await fs.readFile(parent,'utf8')),[changed]);
 assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo/upstream/a.md'),'utf8'),'English original\r\n');
 await assert.rejects(fs.access(path.join(f.materialsRoot,'.sync-materials-lock')));
});

test('empty Git tree accepts a valid zero-row child but rejects wrong, absent or reordered headers',async t=>{
 const f=await fixture(t);await fs.unlink(path.join(f.repo,'a.md'));f.commit();
 const a=path.join(f.tmp,'empty-tree');await f.run('prepare',a);
 const child=path.join(a,'speculo/manifest.tsv');const parent=path.join(f.materialsRoot,'manifest.tsv');const before=await fs.readFile(parent);
 for(const malformed of ['wrong-header\n','',stringifyTsv([],CHILD.toReversed())]){
  await fs.writeFile(child,malformed);await assert.rejects(f.run('apply',a),/columns/);
  assert.deepEqual(await fs.readFile(parent),before);
  assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo/upstream/a.md'),'utf8'),'English original\r\n');
 }
 await fs.writeFile(child,stringifyTsv([],CHILD));await f.run('apply',a);
 assert.deepEqual(parseTsv(await fs.readFile(path.join(f.materialsRoot,'speculo/manifest.tsv'),'utf8')),[]);
 assert.deepEqual(check(f.root,{output(){}}),[]);
});

test('strict shared TSV parsing validates zero-row headers and sync reuses shared constants',()=>{
 assert.equal(PARENT,PARENT_COLUMNS);assert.equal(CHILD,CHILD_COLUMNS);
 assert.deepEqual(parseTsvTable(stringifyTsv([],CHILD_COLUMNS),CHILD_COLUMNS),{columns:CHILD_COLUMNS,rows:[]});
 for(const text of ['', 'wrong-header\n', stringifyTsv([],CHILD_COLUMNS.toReversed())])assert.throws(()=>parseTsvTable(text,CHILD_COLUMNS),/columns/);
});

test('raw Git objects ignore export attributes and preserve binary/empty/executable; symlink refused',async t=>{
 const f=await fixture(t); await fs.writeFile(path.join(f.repo,'.gitattributes'),'secret.bin export-ignore\na.md export-subst\n');await fs.writeFile(path.join(f.repo,'secret.bin'),Buffer.from([0,255,13,10]));await fs.writeFile(path.join(f.repo,'empty'),'');await fs.writeFile(path.join(f.repo,'program.js'),'throw Error("DO NOT EXECUTE")');await fs.chmod(path.join(f.repo,'program.js'),0o755);git(f.repo,'add','.');git(f.repo,'update-index','--chmod=+x','program.js');f.commit();
 const a=path.join(f.tmp,'raw');await f.run('prepare',a);assert.deepEqual(await fs.readFile(path.join(a,'speculo','upstream','secret.bin')),Buffer.from([0,255,13,10]));assert.equal(parseTsv(await fs.readFile(path.join(a,'speculo','manifest.tsv'),'utf8')).find(r=>r.path==='program.js').source_git_mode,'100755');if(process.platform!=='win32')assert.equal((await fs.stat(path.join(a,'speculo','upstream','program.js'))).mode&0o111,0o111);
 await fs.symlink('a.md',path.join(f.repo,'link'));f.commit();await assert.rejects(f.run('dry-run'),/Unsupported Git entry/);
});

test('apply rejects the same metadata, bytes and runtime defects as unified validation',async t=>{
 const f=await fixture(t);const a=path.join(f.tmp,'negative');await f.run('prepare',a);
 const mp=path.join(a,'speculo','manifest.tsv');const original=await fs.readFile(mp,'utf8');
 const zp=path.join(a,'speculo','zh','a.md');const originalZh=await fs.readFile(zp);
 for (const owner of ['dev-one','dev-two']) {await fs.mkdir(path.join(f.root,'skills','dev',owner),{recursive:true});await fs.writeFile(path.join(f.root,'skills','dev',owner,'method.md'),'local');}
 await fs.symlink(path.join(f.root,'skills','dev','dev-one'),path.join(f.root,'skills','dev','alias'),process.platform==='win32'?'junction':'dir');
 const cases=[
  [r=>{r.adaptation=' ';},/adaptation/],
  [r=>{r.runtime_paths='skills/dev/dev-one/method.md';r.runtime_reviewed_blob='bad';},/reviewed blob/],
  [r=>{r.runtime_paths='skills/dev/dev-one/method.md;skills/dev/dev-one/method.md';},/Duplicate runtime/],
  [r=>{r.runtime_paths='skills/dev/dev-one/method.md;skills/dev/dev-two/method.md';},/one owning skill/],
  [r=>{r.runtime_paths='skills/dev/alias/method.md';},/symlink forbidden/i],
  [r=>{r.kind='fixture';},/Byte counterpart/],
  [r=>{r.kind='asset';},/Byte counterpart/],
  [async r=>{const z=Buffer.from([255,254]);await fs.writeFile(zp,z);r.zh_sha256=hash(z);},/UTF-8/],
  [async r=>{await fs.writeFile(zp,'English only');r.zh_sha256=hash('English only');},/Chinese translation is absent/]
 ];
 for (const [mutate,error] of cases) {
  await fs.writeFile(zp,originalZh);const rows=parseTsv(original);await mutate(rows[0]);await fs.writeFile(mp,stringifyTsv(rows,CHILD));await assert.rejects(f.run('apply',a),error);
  assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo','zh','a.md'),'utf8'),'中文完整译文\n');
 }
});

test('inherited Git object, config and worktree variables cannot redirect synchronization',async t=>{
 const f=await fixture(t);const vars={GIT_DIR:path.join(f.tmp,'no-git'),GIT_WORK_TREE:f.root,GIT_OBJECT_DIRECTORY:path.join(f.tmp,'no-objects'),GIT_ALTERNATE_OBJECT_DIRECTORIES:path.join(f.tmp,'bad-alternates'),GIT_CONFIG_COUNT:'999',GIT_REPLACE_REF_BASE:'refs/hostile/',GIT_CONFIG_GLOBAL:path.join(f.tmp,'bad-config')};
 const previous=Object.fromEntries(Object.keys(vars).map(k=>[k,process.env[k]]));
 Object.assign(process.env,vars);
 try {const a=path.join(f.tmp,'env');await f.run('prepare',a);await f.run('apply',a);} finally {for(const [k,v] of Object.entries(previous)) {if(v===undefined)delete process.env[k];else process.env[k]=v;}}
});

test('temporary roots and all ancestors must be link-free and inside temporary scope',async t=>{
 const f=await fixture(t);const a=path.join(f.tmp,'actual');await f.run('prepare',a);
 const link=path.join(f.tmp,'link');await fs.symlink(a,link,process.platform==='win32'?'junction':'dir');
 await assert.rejects(f.run('apply',link),/Symlink forbidden/);
 await assert.rejects(f.run('prepare',path.join(link,'nested')),/Symlink forbidden/);
 const ancestor=path.join(f.tmp,'alias');await fs.symlink(f.tmp,ancestor,process.platform==='win32'?'junction':'dir');
 await assert.rejects(f.run('apply',path.join(ancestor,'actual')),/Symlink forbidden/);
 await assert.rejects(f.run('apply',f.tmp),/Invalid preparation location/);
 await assert.rejects(f.run('apply',os.homedir()),/preparation location|system temporary directory/i);
 await assert.rejects(fs.access(path.join(a,'nested')));
});

test('no per-file approval tokens: completed same-format tree applies, stale old translation does not',async t=>{
 const f=await fixture(t);await fs.writeFile(path.join(f.repo,'a.md'),'English source changed substantially');f.commit();
 const a=path.join(f.tmp,'ordinary-edit');const report=await f.run('prepare',a);assert.doesNotMatch(report,/REVIEW|\[ \]/);
 await review(a,async rows=>{const r=rows[0];r.zh_path='zh/a.md';r.zh_sha256=hash('中文完整译文\n');await fs.mkdir(path.join(a,'speculo','zh'));await fs.writeFile(path.join(a,'speculo','zh','a.md'),'中文完整译文\n');});
 await assert.rejects(f.run('apply',a),/Unchanged old translation/);
 await review(a,async rows=>{rows[0].zh_sha256=hash('原文已大幅更新，对应的完整中文翻译');await fs.writeFile(path.join(a,'speculo','zh','a.md'),'原文已大幅更新，对应的完整中文翻译');});
 await f.run('apply',a);
});

test('fixed-SHA apply still requires remote branch availability and fails without switching',async t=>{
 const f=await fixture(t);f.p.ref='main';await f.write();const a=path.join(f.tmp,'offline');await f.run('prepare',a);
 git(f.repo,'branch','-m','renamed');await assert.rejects(f.run('apply',a),/Remote branch missing/);
 assert.equal(await fs.readFile(path.join(f.materialsRoot,'speculo','upstream','a.md'),'utf8'),'English original\r\n');
});
