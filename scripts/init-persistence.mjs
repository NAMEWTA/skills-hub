import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const templates = fileURLToPath(new URL('./persistence/', import.meta.url));
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
      if (!stat.isFile()) throw new Error('说明文件不是普通文件：' + current);
      exists = true;
    } else if (!stat.isDirectory()) throw new Error('目录路径冲突：' + current);
  }
  return exists;
}

// 固定领域骨架归安装器所有；不从技能包中发现或执行初始化代码。
export function planPersistence(skills, project, fsOps = fs) {
  const domains = new Set(skills.map(skill => skill.domain));
  return targets.filter(([domain]) => domains.has(domain)).map(([, template, directory]) => {
    const relative = directory + '/AGENTS.md';
    const exists = inspect(project, relative, fsOps);
    return {
      path: relative,
      destination: path.join(project, relative),
      action: exists ? 'preserve' : 'create',
      content: exists ? null : fsOps.readFileSync(path.join(templates, template + '.md'), 'utf8'),
    };
  });
}

// journal 只记录本次排他创建的文件和目录，失败时由安装事务撤销。
export function applyPersistence(plan, project, fsOps = fs, journal = []) {
  for (const item of plan) {
    if (item.action === 'preserve') continue;
    if (inspect(project, item.path, fsOps)) throw new Error('说明文件在安装期间出现，请重新检查：' + item.destination);
    const parts = item.path.split('/').slice(0, -1);
    for (let index = 0; index < parts.length; index += 1) {
      const directory = path.join(project, ...parts.slice(0, index + 1));
      if (!fsOps.lstatSync(directory, { throwIfNoEntry: false })) {
        fsOps.mkdirSync(directory);
        journal.push({ path: directory, directory: true });
      }
    }
    const descriptor = fsOps.openSync(item.destination, 'wx');
    journal.push({ path: item.destination, directory: false });
    try { fsOps.writeFileSync(descriptor, item.content, 'utf8'); }
    finally { fsOps.closeSync(descriptor); }
  }
}

export function rollbackPersistence(journal, fsOps = fs) {
  const errors = [];
  for (const item of [...journal].reverse()) {
    try {
      if (item.directory) fsOps.rmdirSync(item.path);
      else fsOps.unlinkSync(item.path);
    } catch (error) {
      if (error.code === 'ENOENT' || (item.directory && error.code === 'ENOTEMPTY')) continue;
      errors.push(item.path + ': ' + error.message);
    }
  }
  return errors;
}
