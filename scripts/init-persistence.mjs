import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const templates = fileURLToPath(new URL('./persistence/', import.meta.url));
const domainIgnoreRules = [
  ['dev', '/.agents/dev/worktree/'],
  ['system', '/.agents/system/ignore/'],
];
const targets = [
  ['dev', 'dev', '.agents/dev'],
  ['dev', 'changes', '.agents/dev/changes'],
  ['dev', 'notes', '.agents/dev/notes'],
  ['dev', 'deploy', '.agents/dev/deploy'],
  ['dev', 'archive', '.agents/dev/archive'],
  ['dev', 'implemented', '.agents/dev/archive/changes/implemented'],
  ['dev', 'rejected', '.agents/dev/archive/changes/rejected'],
  ['dev', 'project', '.agents/dev/project'],
  ['dev', 'context', '.agents/dev/context'],
  ['system', 'system', '.agents/system'],
  ['ops', 'ops', '.agents/ops'],
];

function inspect(project, relative, fsOps) {
  const parts = relative.split('/');
  let exists = false;
  for (let index = 0; index < parts.length; index += 1) {
    const current = path.join(project, ...parts.slice(0, index + 1));
    const stat = fsOps.lstatSync(current, { throwIfNoEntry: false });
    if (!stat) continue;
    if (stat.isSymbolicLink()) throw new Error('拒绝符号链接：' + current);
    if (index === parts.length - 1) {
      if (!stat.isFile()) throw new Error('安装目标不是普通文件：' + current);
      exists = true;
    } else if (!stat.isDirectory()) throw new Error('目录路径冲突：' + current);
  }
  return exists;
}

function appendIgnoreRules(previous, rules) {
  const original = previous.toString('utf8').replace(/^\uFEFF/, '');
  const patterns = new Set(original.split(/\r?\n/).map(line => line.replace(/ +$/, '')));
  const missing = rules.filter(rule => !patterns.has(rule) && !patterns.has(rule.slice(1)));
  if (missing.length === 0) return previous;

  const eol = original.match(/\r?\n/)?.[0] ?? '\n';
  const separator = original && !original.endsWith('\n') ? eol : '';
  return Buffer.concat([previous, Buffer.from(separator + missing.join(eol) + eol)]);
}

// 安装器维护固定导航和领域忽略规则。
export function planPersistence(skills, project, fsOps = fs) {
  const domains = new Set(skills.map(skill => skill.domain));
  const entries = targets.filter(([domain]) => domains.has(domain)).map(([, template, directory]) => [
    directory + '/AGENTS.md',
    () => fsOps.readFileSync(path.join(templates, template + '.md')),
  ]);
  const ignoreRules = domainIgnoreRules.filter(([domain]) => domains.has(domain)).map(([, rule]) => rule);
  if (ignoreRules.length) {
    entries.push(['.gitignore', previous => appendIgnoreRules(previous ?? Buffer.alloc(0), ignoreRules)]);
  }
  return entries.map(([relative, contentFor]) => {
    const exists = inspect(project, relative, fsOps);
    const destination = path.join(project, relative);
    const previous = exists ? fsOps.readFileSync(destination) : null;
    const content = contentFor(previous);
    return {
      path: relative,
      destination,
      action: !exists ? 'create' : previous.equals(content) ? 'preserve' : 'update',
      content,
      previous,
    };
  });
}

// journal 保存本次创建项及被更新文件的原字节，失败时恢复。
export function applyPersistence(plan, project, fsOps = fs, journal = []) {
  for (const item of plan) {
    if (item.action === 'preserve') continue;
    const exists = inspect(project, item.path, fsOps);
    if ((item.action === 'create' && exists) || (item.action === 'update' &&
        (!exists || !fsOps.readFileSync(item.destination).equals(item.previous)))) {
      throw new Error('安装目标在安装期间变化，请重新检查：' + item.destination);
    }
    const parts = item.path.split('/').slice(0, -1);
    for (let index = 0; index < parts.length; index += 1) {
      const directory = path.join(project, ...parts.slice(0, index + 1));
      if (!fsOps.lstatSync(directory, { throwIfNoEntry: false })) {
        fsOps.mkdirSync(directory);
        journal.push({ path: directory, directory: true });
      }
    }
    const descriptor = fsOps.openSync(item.destination, item.action === 'update' ? 'r+' : 'wx');
    journal.push({ path: item.destination, directory: false, previous: item.previous });
    try {
      fsOps.writeFileSync(descriptor, item.content);
      fsOps.ftruncateSync(descriptor, item.content.length);
    }
    finally { fsOps.closeSync(descriptor); }
  }
}

export function rollbackPersistence(journal, fsOps = fs) {
  const errors = [];
  for (const item of [...journal].reverse()) {
    try {
      if (item.previous) fsOps.writeFileSync(item.path, item.previous);
      else if (item.directory) fsOps.rmdirSync(item.path);
      else fsOps.unlinkSync(item.path);
    } catch (error) {
      if (error.code === 'ENOENT' || (item.directory && error.code === 'ENOTEMPTY')) continue;
      errors.push(item.path + ': ' + error.message);
    }
  }
  return errors;
}
