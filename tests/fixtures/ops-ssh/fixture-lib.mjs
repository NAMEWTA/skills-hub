import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const directory = path.dirname(fileURLToPath(import.meta.url));
export const serviceFile = path.join(directory, 'service.mjs');
export const roles = ['shared-health', 'shop', 'billing'];
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export function artifactHash() {
  const hash = createHash('sha256');
  for (const name of ['fixture-lib.mjs', 'service.mjs']) hash.update(fs.readFileSync(path.join(directory, name)));
  return hash.digest('hex');
}

export function readConfig(filename) {
  const actual = fs.realpathSync(filename);
  const config = JSON.parse(fs.readFileSync(actual, 'utf8'));
  if (config.format !== 'ops-ssh-lab-v1' || config.root !== path.dirname(actual) || !config.root.startsWith(path.join(fs.realpathSync(os.tmpdir()), 'skills-hub-ops-ssh-')) || !/^[a-f0-9-]{36}$/.test(config.lab_id)) throw new Error('只接受本次隔离 SSH 夹具配置');
  for (const role of roles) {
    if (!Number.isInteger(config.ports[role]) || config.ports[role] < 1024 || config.ports[role] > 65535) throw new Error('夹具端口无效');
  }
  if (config.artifact_sha256 !== artifactHash()) throw new Error('夹具服务制品在本次验证中发生变化');
  return { ...config, filename: actual };
}

export function atomicJson(filename, value) {
  const temporary = `${filename}.${randomUUID()}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value)}\n`, { mode: 0o600, flag: 'wx' });
  fs.renameSync(temporary, filename);
}

export function processIdentity(pid) {
  try {
    const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
    const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
    const argv = fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8').split('\0').filter(Boolean);
    return { pid, state: fields[0], started: fields[19], argv };
  } catch (error) { if (['ENOENT', 'ESRCH'].includes(error.code)) return null; throw error; }
}

export function checkProcess(record, config) {
  const current = processIdentity(record.pid);
  if (!current || ['Z', 'X'].includes(current.state)) return { running: false, matches: true };
  const matches = current.started === record.started && current.argv[1] === serviceFile && current.argv[2] === config.filename && current.argv[3] === record.service;
  return { running: true, matches };
}

export function activeRecord(config, role) {
  if (!roles.includes(role)) throw new Error('未知夹具服务');
  const filename = path.join(config.root, 'state', `${role}.json`);
  if (!fs.existsSync(filename)) return null;
  const record = JSON.parse(fs.readFileSync(filename, 'utf8'));
  if (record.lab_id !== config.lab_id || record.service !== role || !Number.isInteger(record.pid) || record.pid <= 1 || !/^\d+$/.test(record.started)) throw new Error('夹具进程记录不匹配');
  return record;
}

export async function probe(config, role) {
  try {
    const response = await fetch(`http://127.0.0.1:${config.ports[role]}/health`, { signal: AbortSignal.timeout(1500) });
    const result = await response.json();
    const identity = result.lab_id === config.lab_id && result.service === role && result.artifact_sha256 === config.artifact_sha256;
    return { service: role, http_status: response.status, healthy: identity && response.status === 200 && result.healthy === true, identity_matches: identity, result };
  } catch (error) {
    return { service: role, http_status: null, healthy: false, identity_matches: false, error: error.cause?.code || error.name };
  }
}

export async function stopRecorded(config, record) {
  const identity = checkProcess(record, config);
  if (!identity.matches) throw new Error(`拒绝终止身份已变化的 PID ${record.pid}`);
  if (!identity.running) return { stopped: false, running: false };
  process.kill(record.pid, 'SIGTERM');
  const until = Date.now() + 3000;
  while (Date.now() < until && checkProcess(record, config).running) await wait(20);
  const remaining = checkProcess(record, config);
  if (remaining.running) {
    if (!remaining.matches) throw new Error('停止期间进程身份发生变化');
    process.kill(record.pid, 'SIGKILL');
    const deadline = Date.now() + 1500;
    while (Date.now() < deadline && checkProcess(record, config).running) await wait(20);
  }
  if (checkProcess(record, config).running) throw new Error('已登记的夹具进程未退出');
  return { stopped: true, running: false };
}
