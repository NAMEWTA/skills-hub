import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function temporary(t, prefix = 'skills-wta-test-') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }));
  return root;
}

export function write(filename, content) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, content);
  return filename;
}

export function snapshot(root) {
  const result = {};
  if (!fs.existsSync(root)) return result;
  function visit(parent) {
    for (const name of fs.readdirSync(parent).sort()) {
      const filename = path.join(parent, name);
      const relative = path.relative(root, filename).split(path.sep).join('/');
      const stat = fs.lstatSync(filename);
      if (stat.isSymbolicLink()) result[relative] = ['link', fs.readlinkSync(filename)];
      else if (stat.isDirectory()) { result[relative] = ['directory']; visit(filename); }
      else result[relative] = ['file', fs.readFileSync(filename)];
    }
  }
  visit(root);
  return result;
}

export function command(executable, args, options = {}) {
  const result = spawnSync(executable, args, { encoding: 'utf8', timeout: 30_000, maxBuffer: 8 * 1024 * 1024, ...options });
  if (result.error) throw result.error;
  return result;
}

export function isolatedGitEnvironment(configDirectory) {
  const environment = { ...process.env };
  for (const key of [
    'GIT_DIR', 'GIT_COMMON_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX',
    'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG', 'GIT_CONFIG_COUNT', 'GIT_CONFIG_PARAMETERS',
  ]) delete environment[key];
  const directory = path.resolve(configDirectory);
  environment.GIT_CONFIG_GLOBAL = write(path.join(directory, 'global.gitconfig'), '');
  environment.GIT_CONFIG_SYSTEM = write(path.join(directory, 'system.gitconfig'), '');
  environment.GIT_CONFIG_NOSYSTEM = '1';
  return environment;
}

export function saveTsv(filename, row) {
  const quote = (value) => /[\t\r\n"]/.test(String(value)) ? `"${String(value).replaceAll('"', '""')}"` : String(value);
  write(filename, `${Object.keys(row).map(quote).join('\t')}\n${Object.values(row).map(quote).join('\t')}\n`);
}
