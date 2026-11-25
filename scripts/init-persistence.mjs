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
  ['ops', 'ops', '.agents/ops'],
  ['home', 'home', '.agents/home'],
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

function ensureIgnoreRules(previous, rules) {
  const text = previous.toString('utf8');
  const original = text.replace(/^\uFEFF/, '');
  const patterns = new Set(original.split(/\r?\n/).map(line => line.replace(/ +$/, '')));
  const missing = rules.filter(rule => !patterns.has(rule) && !patterns.has(rule.slice(1)));
  if (missing.length === 0) return previous;

  const eol = original.match(/\r?\n/)?.[0] ?? '\n';
  let content = previous;
  const defaults = missing.filter(rule => ['/temp/', '/.agents/home/local.json'].includes(rule));
  if (original && defaults.length) {
    // 新默认规则先于用户规则，保留用户对运行原件和本机映射的明确例外。
    const bom = text.startsWith('\uFEFF') ? 3 : 0;
    content = Buffer.concat([previous.subarray(0, bom), Buffer.from(defaults.join(eol) + eol), previous.subarray(bom)]);
    for (const rule of defaults) missing.splice(missing.indexOf(rule), 1);
  }
  if (!missing.length) return content;
  const separator = original && !original.endsWith('\n') ? eol : '';
  return Buffer.concat([content, Buffer.from(separator + missing.join(eol) + eol)]);
}

// 安装器维护固定导航和领域忽略规则。
export function planPersistence(skills, project, fsOps = fs) {
  const domains = new Set(skills.map(skill => skill.domain));
  const entries = targets.filter(([domain]) => domains.has(domain)).map(([, template, directory]) => [
    directory + '/AGENTS.md',
    () => fsOps.readFileSync(path.join(templates, template + '.md')),
  ]);
  const ignoreRules = [];
  if (domains.has('dev')) ignoreRules.push('/.agents/dev/worktree/');
  if (domains.has('dev') || domains.has('system')) ignoreRules.push('/temp/');
  if (domains.has('home')) ignoreRules.push('/.agents/home/local.json');
  if (ignoreRules.length) {
    entries.push(['.gitignore', previous => ensureIgnoreRules(previous ?? Buffer.alloc(0), ignoreRules)]);
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
        journal.push({ project, path: directory, directory: true });
      }
    }
    const descriptor = fsOps.openSync(item.destination, item.action === 'update' ? 'r+' : 'wx');
    journal.push({ project, path: item.destination, directory: false, previous: item.previous });
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
      // 回滚也不跟随安装期间被替换的父目录或文件链接。
      const relative = path.relative(item.project, item.path);
      if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw new Error('回滚路径不在原项目内：' + item.path);
      }
      let current = item.project;
      const parts = relative.split(path.sep);
      for (let index = -1; index < parts.length; index += 1) {
        if (index >= 0) current = path.join(current, parts[index]);
        const stat = fsOps.lstatSync(current, { throwIfNoEntry: false });
        if (!stat) continue;
        if (stat.isSymbolicLink()) throw new Error('回滚拒绝符号链接：' + current);
        const directory = index < parts.length - 1 || item.directory;
        if (directory ? !stat.isDirectory() : !stat.isFile()) {
          throw new Error('回滚路径类型已变化：' + current);
        }
      }
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
