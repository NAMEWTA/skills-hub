import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

export const digest = content => createHash('sha256').update(content).digest('hex');

export function fail(code, message) {
  throw Object.assign(new Error(message), { code });
}

export function openStorage(home) {
  if (!home) fail('ARGUMENT', '必须明确指定 --home');
  const requested = path.resolve(home);
  if (fs.lstatSync(requested).isSymbolicLink()) fail('PATH', 'Home 根不能是链接');
  const root = fs.realpathSync(requested);
  if (!fs.statSync(root).isDirectory()) fail('PATH', 'Home 根必须是目录');

  function location(relative, createParents = false) {
    const parts = relative.split('/');
    if (parts.some(part => !part || part === '.' || part === '..' || /[:\\\u0000-\u001f]/u.test(part))) fail('PATH', '需要 Home 协调目录内的相对路径');
    if (fs.lstatSync(requested).isSymbolicLink() || fs.realpathSync(requested) !== root) fail('PATH', 'Home 根已变更');
    const segments = ['.agents', 'home', 'coordination', ...parts];
    let current = root;
    for (const [index, segment] of segments.entries()) {
      current = path.join(current, segment);
      const parent = index < segments.length - 1;
      let stat = fs.lstatSync(current, { throwIfNoEntry: false });
      if (!stat && parent && createParents) {
        try { fs.mkdirSync(current, { mode: 0o700 }); }
        catch (error) { if (error.code !== 'EEXIST') throw error; }
        stat = fs.lstatSync(current);
      }
      if (stat?.isSymbolicLink() || (stat && parent && !stat.isDirectory())) fail('PATH', `拒绝链接或异常父目录 ${relative}`);
    }
    return current;
  }

  function list(relative) {
    const filename = location(relative ? `${relative}/.check` : '.check');
    try { return fs.readdirSync(path.dirname(filename), { withFileTypes: true }); }
    catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  }

  function read(relative) {
    const filename = location(relative);
    const stat = fs.lstatSync(filename, { throwIfNoEntry: false });
    if (!stat) return null;
    if (!stat.isFile()) fail('PATH', `需要普通文件 ${relative}`);
    const fd = fs.openSync(filename, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
    try {
      if (!fs.fstatSync(fd).isFile()) fail('PATH', `需要普通文件 ${relative}`);
      const content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(fs.readFileSync(fd));
      location(relative);
      return content;
    } finally { fs.closeSync(fd); }
  }

  function replace(relative, content, expected) {
    if (read(relative) !== expected) fail('STALE', `文件已变化 ${relative}`);
    if (content === expected) return;
    const filename = location(relative, true);
    const temporary = path.join(path.dirname(filename), `.${randomUUID()}.tmp`);
    const fd = fs.openSync(temporary, 'wx', 0o600);
    try {
      try { fs.writeFileSync(fd, content, 'utf8'); fs.fsyncSync(fd); }
      finally { fs.closeSync(fd); }
      if (read(relative) !== expected) fail('STALE', `文件已变化 ${relative}`);
      if (expected === null) fs.linkSync(temporary, filename);
      else fs.renameSync(temporary, filename);
    } finally { fs.rmSync(temporary, { force: true }); }
    if (read(relative) !== content) fail('READBACK', `读回内容不符 ${relative}`);
  }

  function locked(action) {
    const name = '.home-tasks.lock';
    const filename = location(name, true);
    const token = `${process.pid}\t${randomUUID()}\n`;
    try { fs.writeFileSync(filename, token, { flag: 'wx', mode: 0o600 }); }
    catch (error) { if (error.code === 'EEXIST') fail('BUSY', '任务写锁已存在，先核实原操作，勿重复派发'); throw error; }
    try { return action(); }
    finally { if (read(name) === token) fs.unlinkSync(location(name)); }
  }

  return { list, read, replace, locked };
}
