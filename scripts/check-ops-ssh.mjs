#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRun, appendStep, summarizeRun, inspectRun } from '../skills/ops/ops-execute/scripts/ops-record.mjs';
import { artifactHash, roles, stopRecorded, wait } from '../tests/fixtures/ops-ssh/fixture-lib.mjs';

const rootDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const controller = path.join(rootDirectory, 'tests/fixtures/ops-ssh/control.mjs');
const binaries = { ssh: '/usr/bin/ssh', sshd: '/usr/sbin/sshd', keygen: '/usr/bin/ssh-keygen' };
const shellQuote = (value) => `'${String(value).replaceAll("'", "'\"'\"'")}'`;
const configQuote = (value) => `"${String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;

function requireCondition(condition, message) { if (!condition) throw new Error(message); }

async function command(binary, args, { timeout = 12000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', timedOut = false, tooLarge = false;
    const collect = (kind, bytes) => {
      if (kind === 'stdout') stdout += bytes; else stderr += bytes;
      if (stdout.length + stderr.length > 1024 * 1024) { tooLarge = true; child.kill('SIGKILL'); }
    };
    child.stdout.on('data', (bytes) => collect('stdout', bytes));
    child.stderr.on('data', (bytes) => collect('stderr', bytes));
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); }, timeout);
    const hardTimer = setTimeout(() => child.kill('SIGKILL'), timeout + 1000);
    child.once('error', (error) => { clearTimeout(timer); clearTimeout(hardTimer); reject(error); });
    child.once('close', (code, signal) => {
      clearTimeout(timer); clearTimeout(hardTimer);
      resolve({ code, signal, timedOut, tooLarge, stdout, stderr });
    });
  });
}

async function reservePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { server, port: server.address().port };
}

async function portOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    let settled = false;
    const finish = (result) => { if (!settled) { settled = true; socket.destroy(); resolve(result); } };
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.setTimeout(400, () => finish(false));
  });
}

async function releaseReservation(reserved) {
  if (reserved.server.listening) await new Promise((resolve) => reserved.server.close(resolve));
}

async function terminateServer(server) {
  if (server.exitCode !== null || server.signalCode !== null) return;
  const exited = new Promise((resolve) => server.once('close', resolve));
  try { process.kill(-server.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  const timer = setTimeout(() => { try { process.kill(-server.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') console.error(error.message); } }, 1500);
  await exited;
  clearTimeout(timer);
}

export async function runAcceptance(reportFile) {
  requireCondition(process.platform === 'linux', '此显式验证需要 Linux /proc 与 OpenSSH，不纳入默认跨平台测试。');
  requireCondition(process.getuid?.() !== 0, '请用普通本地用户运行隔离 SSH 验证；无需 root。');
  for (const filename of Object.values(binaries)) requireCondition(fs.existsSync(filename), `缺少既有工具：${filename}`);
  const reportPath = path.resolve(reportFile);
  requireCondition(!fs.existsSync(reportPath), `报告已存在，拒绝覆盖：${reportPath}`);
  requireCondition(fs.statSync(path.dirname(reportPath)).isDirectory(), '报告父目录必须已存在');
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-ops-ssh-')));
  const context = { root, runId: 'ops-ssh-isolated', writer: 'ssh-fixture-driver' };
  const reservations = {}, servers = [], observations = [], cleanups = [];
  const startedAt = new Date().toISOString();
  const sanitize = (value) => String(value).split(root).join('<fixture-root>');
  let config, configDigest, archive = null, failure = null, sequence = 0, partialWritten = false, sharedRecoveries = 0, configVerified = false;
  const record = (name, text) => appendStep({ ...context, stepId: `${String(++sequence).padStart(3, '0')}-${name}`, content: text });
  const runSSH = async (endpoint, text, phase, expected = 0) => {
    requireCondition(['ops-lab-a', 'ops-lab-b'].includes(endpoint), 'SSH 端点必须来自本夹具');
    requireCondition(/^(identity|(start|stop|status|health) (shared-health|shop|billing))$/.test(text), 'SSH 命令必须来自固定夹具白名单');
    const display = `ssh -F <fixture-root>/ssh_config ${endpoint} ${JSON.stringify(text)}`;
    record('planned', `# ${phase}\n\n- 阶段：${phase}\n- 计划命令：\`${display}\`\n- 范围：本次 loopback 隔离夹具。\n- 授权：显式运行本验收脚本，允许建立、停止和恢复此夹具；无生产目标。\n- 验证：端点与服务身份必须匹配当前夹具，逐目标记录真实退出码和健康。\n`);
    const begun = new Date().toISOString();
    const result = await command(binaries.ssh, ['-F', path.join(root, 'ssh_config'), endpoint, text]);
    let data = null;
    try { data = JSON.parse(result.stdout.trim()); } catch { /* 错误输出仍作为原始证据记录。 */ }
    const observed = { phase, endpoint, command: text, started_at: begun, ended_at: new Date().toISOString(), ...result, data };
    observations.push(observed);
    const state = result.timedOut ? 'unknown' : result.code === 0 ? 'succeeded' : 'failed';
    record('observed', `# ${phase} 的实际 SSH 结果\n\n- 实际入口：\`${display}\`\n- 开始：${begun}\n- 结束：${observed.ended_at}\n- 执行状态：${state}\n- 退出码：${result.code}\n- 超时：${result.timedOut}\n- 现场：依据下面的实际观测；检查退出失败不表示现场未变化。\n- 记录：本文件为原始步骤，保存结果由记录工具确认。\n\n\`\`\`json\n${sanitize(JSON.stringify(data ?? result, null, 2))}\n\`\`\`\n`);
    requireCondition(!result.timedOut && !result.tooLarge, `SSH 调用结果未知或输出超限：${endpoint} ${text}`);
    requireCondition(result.code === expected, `SSH 退出码不符合场景：${endpoint} ${text}，实际 ${result.code}，${sanitize(result.stderr || result.stdout)}`);
    requireCondition(data?.lab_id === config.lab_id && data.artifact_sha256 === config.artifact_sha256, `SSH 返回身份或制品不符：${endpoint} ${text}`);
    return data;
  };

  try {
    createRun({ ...context, request: '# 隔离 SSH 运行恢复验收\n\n验证两个 loopback SSH 端点、两个项目消费一个 Node 共享服务的运行关系、既有同版本恢复、部分失败记录及最终健康。所有目标均由本脚本在临时根创建；故障注入和清理只限本夹具。没有生产授权、真实 Redis、systemd、Compose 或两台物理机器。\n' });
    for (const name of ['keys', 'state', 'launches', 'logs']) fs.mkdirSync(path.join(root, name), { mode: 0o700 });
    for (const key of ['host-a', 'host-b', 'client']) {
      const result = await command(binaries.keygen, ['-q', '-t', 'ed25519', '-N', '', '-f', path.join(root, 'keys', key)]);
      requireCondition(result.code === 0 && !result.timedOut, `临时密钥生成失败：${key}`);
    }
    for (const name of ['host-a', 'host-b', ...roles]) reservations[name] = await reservePort();
    config = {
      format: 'ops-ssh-lab-v1', root, lab_id: randomUUID(), artifact_sha256: artifactHash(),
      ports: Object.fromEntries(roles.map((role) => [role, reservations[role].port])), filename: path.join(root, 'lab.json'),
    };
    fs.writeFileSync(config.filename, `${JSON.stringify(config)}\n`, { mode: 0o600 });
    configDigest = createHash('sha256').update(fs.readFileSync(config.filename)).digest('hex');
    const knownHosts = ['host-a', 'host-b'].map((name) => {
      const pub = fs.readFileSync(path.join(root, 'keys', `${name}.pub`), 'utf8').trim().split(/\s+/).slice(0, 2).join(' ');
      return `[127.0.0.1]:${reservations[name].port} ${pub}`;
    }).join('\n');
    fs.writeFileSync(path.join(root, 'known_hosts'), `${knownHosts}\n`, { mode: 0o600 });
    const username = os.userInfo().username;
    requireCondition(/^[A-Za-z0-9_-]+$/.test(username), '当前用户名不适用于此夹具配置');
    const clientConfig = [];
    for (const [name, alias] of [['host-a', 'ops-lab-a'], ['host-b', 'ops-lab-b']]) {
      const serverConfig = [
        `Port ${reservations[name].port}`, 'ListenAddress 127.0.0.1',
        `HostKey ${configQuote(path.join(root, 'keys', name))}`, `PidFile ${configQuote(path.join(root, `${name}.pid`))}`,
        `AuthorizedKeysFile ${configQuote(path.join(root, 'keys/client.pub'))}`,
        'StrictModes no', 'PubkeyAuthentication yes', 'PasswordAuthentication no', 'KbdInteractiveAuthentication no',
        'UsePAM no', 'PermitUserRC no', 'PermitTTY no', 'DisableForwarding yes', 'PermitRootLogin no',
        `AllowUsers ${username}`, `ForceCommand ${[process.execPath, controller, config.filename, name].map(shellQuote).join(' ')}`,
      ].join('\n');
      const serverFile = path.join(root, `${name}.sshd_config`);
      fs.writeFileSync(serverFile, `${serverConfig}\n`, { mode: 0o600 });
      const checked = await command(binaries.sshd, ['-t', '-f', serverFile]);
      requireCondition(checked.code === 0, `sshd 配置检查失败：${sanitize(checked.stderr)}`);
      clientConfig.push([
        `Host ${alias}`, ' HostName 127.0.0.1', ` Port ${reservations[name].port}`, ` User ${username}`,
        ` IdentityFile ${configQuote(path.join(root, 'keys/client'))}`, ' IdentityAgent none', ' IdentitiesOnly yes',
        ' BatchMode yes', ` UserKnownHostsFile ${configQuote(path.join(root, 'known_hosts'))}`, ' GlobalKnownHostsFile /dev/null',
        ' StrictHostKeyChecking yes', ' CheckHostIP no', ' ConnectTimeout 5', ' ConnectionAttempts 1',
        ' ServerAliveInterval 2', ' ServerAliveCountMax 2', ' RequestTTY no', ' ClearAllForwardings yes',
      ].join('\n'));
      await releaseReservation(reservations[name]);
      const server = spawn(binaries.sshd, ['-D', '-e', '-f', serverFile], { detached: true, stdio: ['ignore', 'ignore', 'pipe'] });
      let log = '';
      server.stderr.on('data', (bytes) => { log = (log + bytes).slice(-8192); });
      server.on('error', (error) => { log += error.message; });
      servers.push(server);
      const until = Date.now() + 4000;
      while (Date.now() < until && !(await portOpen(reservations[name].port))) {
        requireCondition(server.exitCode === null, `sshd 提前退出：${sanitize(log)}`);
        await wait(30);
      }
      requireCondition(server.exitCode === null && await portOpen(reservations[name].port), `sshd 未监听：${sanitize(log)}`);
    }
    fs.writeFileSync(path.join(root, 'ssh_config'), `${clientConfig.join('\n\n')}\n`, { mode: 0o600 });
    record('topology', '# 夹具目标快照\n\n| 资源 ID | 实例 ID | 服务 ID | 项目/环境 | 关系/证据 |\n| --- | --- | --- | --- | --- |\n| ops-lab-a | shop-a | shop | shop/lab | 本夹具明确配置的消费者 |\n| ops-lab-b | billing-b | billing | billing/lab | 本夹具明确配置的消费者 |\n| ops-lab-b | shared-health-b | shared-health | shop/lab、billing/lab | 一个共享 Node 实例，两个已知消费者 |\n\n资源是同机不同端口的独立 sshd，不是两台物理主机。PID 是观测，实例 ID 保持稳定。\n');
    await runSSH('ops-lab-a', 'identity', '身份核验');
    await runSSH('ops-lab-b', 'identity', '身份核验');
    await releaseReservation(reservations['shared-health']);
    const initial = await runSSH('ops-lab-b', 'start shared-health', '建立隔离夹具');
    await releaseReservation(reservations.shop);
    await runSSH('ops-lab-a', 'start shop', '建立隔离夹具');
    await releaseReservation(reservations.billing);
    await runSSH('ops-lab-b', 'start billing', '建立隔离夹具');
    requireCondition((await runSSH('ops-lab-a', 'health shop', '初始消费验证')).healthy, 'shop 初始不健康');
    requireCondition((await runSSH('ops-lab-b', 'health billing', '初始消费验证')).healthy, 'billing 初始不健康');

    const stopped = await runSSH('ops-lab-b', 'stop shared-health', '仅在夹具注入故障');
    requireCondition(stopped.stopped && stopped.pid === initial.pid, '没有停止本次已有共享实例');
    await runSSH('ops-lab-b', 'stop billing', '仅在夹具准备部分失败场景');
    requireCondition(!(await runSSH('ops-lab-a', 'health shop', '故障观测', 3)).healthy, 'shop 应显式暴露共享依赖故障');
    requireCondition(!(await runSSH('ops-lab-b', 'health billing', '故障观测', 3)).healthy, 'billing 应保留不可用事实');
    const previous = await runSSH('ops-lab-b', 'status shared-health', '恢复前核实');
    requireCondition(previous.running === false, '旧共享实例仍在运行，不能重复启动');
    const restored = await runSSH('ops-lab-b', 'start shared-health', '既有共享服务同版本恢复');
    sharedRecoveries += 1;
    requireCondition(restored.started && restored.healthy && restored.pid !== initial.pid && restored.artifact_sha256 === initial.artifact_sha256, '共享服务未满足既有同版本恢复条件');
    requireCondition((await runSSH('ops-lab-a', 'health shop', '恢复后的消费者验证')).healthy, 'shop 未随依赖恢复');
    requireCondition(!(await runSSH('ops-lab-b', 'health billing', '恢复后的消费者验证', 3)).healthy, '应保留 billing 尚未恢复的部分失败');
    const partial = summarizeRun({ ...context, content: '# 部分完成\n\n整体 partial。共享服务同版本恢复一次，shop/lab 已健康，billing/lab 仍停止。\n\n| 目标 | 执行状态 | 现场状态 | 记录状态 |\n| --- | --- | --- | --- |\n| shared-health-b | succeeded | 已恢复，同一制品 | saved |\n| shop/lab | succeeded | 消费路径健康 | saved |\n| billing/lab | failed | 消费路径不可用，未恢复 | saved |\n\n依据：本 run 的实际 SSH 观察步骤；不能把共享服务就绪汇总成项目全部健康。\n' });
    partialWritten = true;
    record('partial-summary', `# 曾发生的部分失败\n\n- 汇总 SHA-256：${partial.sha256}\n- 共享恢复次数：${sharedRecoveries}\n- shared-health-b 与 shop/lab 已通过；billing/lab 尚未通过。\n- 下一步：恢复本次已经存在且被显式停止的 billing 服务，不能再次恢复共享实例。\n`);

    await runSSH('ops-lab-b', 'start billing', '接续未完成目标');
    requireCondition((await runSSH('ops-lab-a', 'health shop', '最终消费验证')).healthy, 'shop 最终验证失败');
    requireCondition((await runSSH('ops-lab-b', 'health billing', '最终消费验证')).healthy, 'billing 最终验证失败');
    requireCondition((await runSSH('ops-lab-b', 'health shared-health', '最终共享服务验证')).healthy, '共享服务最终验证失败');
    requireCondition(sharedRecoveries === 1 && artifactHash() === initial.artifact_sha256, '出现重复共享恢复或制品漂移');
    requireCondition(createHash('sha256').update(fs.readFileSync(config.filename)).digest('hex') === configDigest, '实际夹具配置在恢复期间发生变化');
    configVerified = true;
    summarizeRun({ ...context, expected: partial.sha256, content: '# 已完成本次隔离验收\n\n整体 succeeded。初始 partial 事实保留在原步骤中，随后仅恢复尚未完成的 billing。\n\n| 目标 | 执行状态 | 现场状态 | 记录状态 |\n| --- | --- | --- | --- |\n| shared-health-b | succeeded | 同一版本恢复一次，就绪 | saved |\n| shop/lab | succeeded | 实际消费验证通过 | saved |\n| billing/lab | succeeded | 实际消费验证通过 | saved |\n\n这是 Linux loopback OpenSSH 与 Node 服务的实测；未验证生产环境、物理两机、systemd、Compose 或 Redis。临时环境清理由驱动脚本最终完成，结果保留在归档报告。\n' });
  } catch (error) {
    failure = error;
    try { record('failure', `# 验收未完成\n\n${sanitize(error.message)}\n\n保留已发生的步骤；未知结果不能当作未执行。仅清理本次隔离夹具。\n`); } catch { /* 记录不可写时保留主报告中的错误。 */ }
  } finally {
    try { archive = inspectRun(context); } catch (error) { cleanups.push(`记录归档缺口：${sanitize(error.message)}`); }
    for (const reserved of Object.values(reservations)) await releaseReservation(reserved);
    for (const server of servers.reverse()) {
      try { await terminateServer(server); } catch (error) { cleanups.push(`SSH daemon 清理失败：${sanitize(error.message)}`); }
    }
    if (config) {
      const launched = path.join(root, 'launches');
      for (const name of fs.readdirSync(launched).filter((name) => name.endsWith('.json'))) {
        try {
          const item = JSON.parse(fs.readFileSync(path.join(launched, name), 'utf8'));
          requireCondition(item.lab_id === config.lab_id && roles.includes(item.service), '拒绝不属于本夹具的进程记录');
          await stopRecorded(config, item);
        } catch (error) { cleanups.push(`服务清理失败：${sanitize(error.message)}`); }
      }
    }
    for (const [name, reserved] of Object.entries(reservations)) if (await portOpen(reserved.port)) cleanups.push(`清理后端口仍开放：${name}:${reserved.port}，未终止身份不明进程`);
    try { fs.rmSync(root, { recursive: true, force: true }); } catch (error) { cleanups.push(`临时目录清理失败：${sanitize(error.message)}`); }
  }

  const passed = !failure && cleanups.length === 0;
  const header = [
    '# ops 隔离 OpenSSH 运维验收', '', `- 开始：${startedAt}`, `- 结束：${new Date().toISOString()}`,
    `- 结果：${passed ? '通过' : '未通过'}`, `- 系统：${process.platform} ${process.arch}；Node ${process.version}`,
    `- 实际 SSH 调用：${observations.length}`, `- 共享服务恢复次数（不含建立夹具）：${sharedRecoveries}`,
    `- 真实 partial 记录：${partialWritten ? '已保存并保留来源步骤' : '尚未完成'}`,
    `- 临时 SSH 密钥、端点、服务和目录清理：${cleanups.length ? '存在缺口' : '已完成，所用端口不再开放'}`,
    `- 服务制品 SHA-256：${config?.artifact_sha256 ?? '未建立'}`,
    `- 实际配置 SHA-256：${configDigest ?? '未建立'}；恢复前后核验：${configVerified ? '一致' : '未完成'}`, '',
    '本次只验证同一台 Linux 上两个独立 loopback sshd 端点、shop/billing 两个 Node 消费者和一个共享 Node 健康服务。私有临时 host/client key、固定 known_hosts、禁用转发与 TTY、固定 ForceCommand 白名单；未读取或修改用户 SSH 配置。没有生产资产、真实 Redis、systemd、Compose、两台物理机器或公网链路验收。', '',
    '## 实际调用与结果', '', '| 阶段 | 端点 | 固定命令 | 退出码 | 健康/运行结果 |', '| --- | --- | --- | --- | --- |',
    ...observations.map((item) => `| ${item.phase} | ${item.endpoint} | \`${item.command}\` | ${item.code} | ${item.data?.healthy ?? item.data?.running ?? item.data?.endpoint ?? '见原始记录'} |`), '',
    '## 记录与清理说明', '',
    '运行期间所有调用由同一 run 保存，实际步骤没有按项目重复记账。共享实例 PID 改变但稳定实例身份与制品不变。共享恢复后 shop 成功而 billing 不可用，记录 partial；接续仅恢复 billing，再验证两消费者。以下原始 Markdown 已脱敏归档，临时原路径在清理后不再存在。', '',
    ...(failure ? [`验收错误：${sanitize(failure.message)}`, ''] : []),
    ...(cleanups.length ? cleanups.map((message) => `- ${message}`) : ['清理核实无残留监听端口；只停止登记且进程身份匹配的夹具进程。']), '',
    '## 原始运维记录（脱敏归档）', '',
  ];
  if (archive) {
    for (const [name, content] of [['run.md', archive.content], ...archive.steps.map((step) => [`steps/${step.step_id}.md`, step.content]), ...(archive.summary ? [['summary.md', archive.summary.content]] : [])]) {
      header.push(`### ${name}`, '', '````markdown', sanitize(content).trimEnd(), '````', '');
    }
  }
  fs.writeFileSync(reportPath, `${header.join('\n')}\n`, { flag: 'wx', mode: 0o600 });
  return { passed, report: reportPath, sshCalls: observations.length, sharedRecoveries, partialWritten, cleanupIssues: cleanups };
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.length === 1 && argv[0] === '--help') {
    console.log('node scripts/check-ops-ssh.mjs --report FILE\n显式隔离验收：Linux 普通用户、既有 OpenSSH、Node.js 22.14+；不访问生产，不属于默认 CI。报告父目录须已存在，不覆盖现有报告。');
    return 0;
  }
  try {
    requireCondition(argv.length === 2 && argv[0] === '--report' && argv[1], '用法：node scripts/check-ops-ssh.mjs --report FILE');
    const result = await runAcceptance(argv[1]);
    console.log(JSON.stringify(result, null, 2));
    return result.passed ? 0 : 1;
  } catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = await main();
