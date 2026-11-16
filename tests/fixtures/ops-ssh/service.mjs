import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { readConfig, roles, processIdentity, atomicJson, probe } from './fixture-lib.mjs';

const config = readConfig(process.argv[2]);
const role = process.argv[3];
if (!roles.includes(role)) throw new Error('未知夹具服务');
const self = processIdentity(process.pid);
const identity = { lab_id: config.lab_id, service: role, pid: process.pid, started: self.started, artifact_sha256: config.artifact_sha256 };
fs.mkdirSync(path.join(config.root, 'launches'), { recursive: true, mode: 0o700 });
atomicJson(path.join(config.root, 'launches', `${role}-${process.pid}.json`), identity);

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' || request.url !== '/health') { response.writeHead(404).end(); return; }
  const dependency = role === 'shared-health' ? null : await probe(config, 'shared-health');
  const healthy = dependency === null || dependency.healthy;
  response.writeHead(healthy ? 200 : 503, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  response.end(JSON.stringify({ ...identity, healthy, dependency }));
});
server.on('error', (error) => { console.error(error.code || error.message); process.exitCode = 1; });
server.listen(config.ports[role], '127.0.0.1', () => {
  atomicJson(path.join(config.root, 'state', `${role}.json`), identity);
  console.log(JSON.stringify({ ...identity, listening: config.ports[role] }));
});
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => {
  server.close(() => process.exit(0));
  setTimeout(() => { server.closeAllConnections(); process.exit(0); }, 1000).unref();
});
