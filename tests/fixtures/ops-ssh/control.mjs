import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { readConfig, roles, serviceFile, activeRecord, checkProcess, stopRecorded, probe, wait } from './fixture-lib.mjs';

async function run() {
  const config = readConfig(process.argv[2]);
  const endpoint = process.argv[3];
  const allowed = { 'host-a': ['shop'], 'host-b': ['shared-health', 'billing'] }[endpoint];
  if (!allowed) throw new Error('未知夹具端点');
  const command = process.env.SSH_ORIGINAL_COMMAND || '';
  if (command === 'identity') return { lab_id: config.lab_id, endpoint, services: allowed, artifact_sha256: config.artifact_sha256, node_version: process.version };
  const match = /^(start|stop|status|health) (shared-health|shop|billing)$/.exec(command);
  if (!match || !roles.includes(match[2]) || !allowed.includes(match[2])) throw new Error('只允许本端点固定夹具命令');
  const [, action, role] = match;
  const base = { lab_id: config.lab_id, endpoint, service: role, action, artifact_sha256: config.artifact_sha256 };
  const old = activeRecord(config, role);
  if (old && !checkProcess(old, config).matches) throw new Error('原 PID 已不是本夹具进程');
  if (action === 'health') {
    const observed = await probe(config, role);
    if (!observed.healthy) process.exitCode = 3;
    return { ...base, ...observed };
  }
  if (action === 'status') return { ...base, pid: old?.pid ?? null, running: old ? checkProcess(old, config).running : false, ...await probe(config, role) };
  if (action === 'stop') return { ...base, pid: old?.pid ?? null, ...(old ? await stopRecorded(config, old) : { stopped: false, running: false }) };
  if (old && checkProcess(old, config).running) return { ...base, pid: old.pid, started: false, running: true, ...await probe(config, role) };
  const logfile = fs.openSync(path.join(config.root, 'logs', `${role}.log`), 'a', 0o600);
  let child;
  try {
    child = spawn(process.execPath, [serviceFile, config.filename, role], { detached: true, stdio: ['ignore', logfile, logfile], env: { PATH: process.env.PATH || '/usr/bin:/bin', LANG: 'C.UTF-8' } });
    await new Promise((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject); });
    child.unref();
  } finally { fs.closeSync(logfile); }
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    const current = activeRecord(config, role);
    if (current?.pid === child.pid && checkProcess(current, config).running) {
      const observed = await probe(config, role);
      if (observed.identity_matches) return { ...base, pid: child.pid, started: true, running: true, ...observed };
    }
    await wait(30);
  }
  throw new Error('夹具服务未在时限内就绪；保留进程记录待核实');
}

try { console.log(JSON.stringify(await run())); }
catch (error) { console.log(JSON.stringify({ error: error.message, scope: 'isolated-ops-ssh-fixture' })); process.exitCode = 1; }
