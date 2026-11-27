#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createInstaller, repositoryRoot, isMain } from '../install.mjs';

function checkCodeAnalysis(run, target, installed) {
  const repo = path.join(target, 'repo');
  const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data));
  const git = (...args) => execFileSync('git', ['-c', 'core.autocrlf=false', ...args], {
    cwd: repo, encoding: 'utf8', windowsHide: true,
  }).trim();
  const firstSource = 'service/main.ts';
  const secondSource = 'storage/main.ts';
  const commit = (message) => {
    git('add', firstSource, secondSource);
    git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false',
      '-c', 'core.hooksPath=.git/empty-hooks', 'commit', '-qm', message);
    return git('rev-parse', 'HEAD');
  };
  fs.mkdirSync(repo);
  git('init', '-q', '-b', 'main');
  const repositoryUrl = 'https://example.invalid/fixtures/archify';
  git('remote', 'add', 'origin', repositoryUrl);
  fs.mkdirSync(path.join(repo, 'service'));
  fs.mkdirSync(path.join(repo, 'storage'));
  fs.writeFileSync(path.join(repo, firstSource), "import { b } from '../storage/main'; export function a() { return b(); }\n");
  fs.writeFileSync(path.join(repo, secondSource), 'export function b() { return 1; }\n');
  const base = commit('base');
  fs.writeFileSync(path.join(repo, secondSource), "import { a } from '../service/main'; export function b() { return a(); }\n");
  const head = commit('head');
  const review = JSON.parse(run(['code-analysis', 'prepare', repo, '--base', base, '--head', head,
    '--language', 'ts', '--locale', 'zh-CN', '--out', path.join(target, 'pinned-review')]));
  const payload = (file) => JSON.parse(fs.readFileSync(file, 'utf8').match(/id="bauify-analysis">([\s\S]*?)<\/script>/)[1]);
  const pinned = payload(review.html);
  assert.equal(pinned.ui.locale, 'zh-CN');
  assert.equal(pinned.pullRequest.baseSHA, base);
  assert.equal(pinned.pullRequest.headSHA, head);
  assert.equal(pinned.repository.revision, head);
  assert.ok(Object.values(pinned.tasks).some(({ task }) => task.source.gitHead === head));

  const ir = path.join(target, 'drift-input.json');
  writeJson(ir, {
    schema_version: 1, diagram_type: 'architecture', meta: {
      title: 'Fixture architecture', output: 'drift.html',
      repository: { url: repositoryUrl, revision: base, link_mode: 'local-only' },
    },
    components: [
      { id: 'service', type: 'backend', label: 'Service', pos: [40, 40], size: [170, 64], sources: [{ path: firstSource }] },
      { id: 'storage', type: 'database', label: 'Storage', pos: [280, 40], size: [170, 64], sources: [{ path: secondSource }] },
    ],
    connections: [{ from: 'service', to: 'storage', label: 'reads' }],
  });
  const driftOutput = path.join(target, 'drift');
  const drift = JSON.parse(run(['code-analysis', 'drift', repo, '--base', base, '--head', head,
    '--ir', ir, '--out', driftOutput, '--json']));
  assert.equal(drift.summary.newUndeclared, 1);
  assert.ok(drift.edges.some((edge) => edge.from === 'storage' && edge.to === 'service' &&
    edge.head.locations.some((location) => location.path === secondSource)));
  assert.ok(fs.existsSync(path.join(driftOutput, 'architecture-drift.html')));
  assert.equal(git('status', '--porcelain'), '');

  const config = path.join(repo, 'analysis.config.json');
  writeJson(config, { external: { sources: [{ id: 'fixture', format: 'sarif', file: 'scan.sarif' }] } });
  writeJson(path.join(repo, 'scan.sarif'), {
    version: '2.1.0',
    runs: [{
      tool: { driver: { name: 'Fixture' } },
      results: [{ ruleId: 'example', level: 'warning', message: { text: 'Fixture diagnostic' },
        locations: [{ physicalLocation: { artifactLocation: { uri: firstSource }, region: { startLine: 1 } } }] }],
    }],
  });
  const standalone = JSON.parse(run(['code-analysis', 'prepare', repo, '--config', config, '--language', 'ts',
    '--locale', 'zh-CN', '--out', path.join(target, 'analysis')]));
  const workingTree = payload(standalone.html);
  assert.equal(workingTree.ui.mode, 'standalone');
  assert.equal(workingTree.ui.locale, 'zh-CN');
  assert.ok(workingTree.findings.some((finding) => finding.external?.ruleId === 'example'),
    'SARIF finding with its original rule must be available in the workbench');

  const pack = path.join(installed, 'examples/checkout-ledger.pr-pack.json');
  const packOutput = path.join(target, 'pr-pack');
  run(['pr', 'validate', pack, '--json']);
  run(['pr', 'build', pack, '--out-dir', packOutput, '--json']);
  assert.ok(fs.existsSync(path.join(packOutput, 'pr-pack.receipt.json')));
}

// Exercise the installed package, including the original real-browser delivery gate.
export function checkUpstreamRuntime(root = repositoryRoot) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-archify-'));
  try {
    const installer = createInstaller({ repository: root });
    const skill = installer.catalog().find(item => item.name === 'zh-archify');
    if (!skill) throw new Error('缺少 zh-archify 运行包');
    installer.apply([skill], target);
    const installed = path.join(target, '.agents/skills/zh-archify');
    const cli = path.join(installed, 'bin/archify.mjs');
    const env = { ...process.env, ARCHIFY_UPDATE_CHECK_DISABLED: '1' };
    const run = args => {
      const result = spawnSync(process.execPath, [cli, ...args], { cwd: target, env, windowsHide: true, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
      if (result.error) throw result.error;
      if (result.status !== 0) throw new Error(`Archify ${args[0]} 失败（exit ${result.status}）：\n${result.stdout}\n${result.stderr}`);
      return result.stdout;
    };
    run(['doctor']);
    const candidate = JSON.parse(fs.readFileSync(path.join(installed, 'examples/web-app.architecture.json'), 'utf8'));
    candidate.meta.output = 'diagram.html';
    candidate.meta.locale = 'zh-CN';
    candidate.meta.quality_profile = 'standard';
    fs.writeFileSync(path.join(target, 'candidate.json'), JSON.stringify(candidate, null, 2) + '\n');
    const receipt = JSON.parse(run(['finalize', 'architecture', 'candidate.json', 'diagram.html', '--quality', 'standard', '--json']));
    const gatesPassed = ['validate', 'deliver', 'check', 'browser-check'].every(gate => receipt.gates?.[gate] === 'pass');
    if (receipt.ok !== true || !gatesPassed || receipt.browserCheck?.ran !== true || !fs.statSync(path.join(target, 'diagram.html'), { throwIfNoEntry: false })?.isFile()) {
      throw new Error(`Archify finalize 未返回成功的真实交付：${JSON.stringify(receipt)}`);
    }
    console.log('已安装 zh-archify：doctor、validate、deliver、strict check、真实 browser-check 通过。');
    checkCodeAnalysis(run, target, installed);
    console.log('已安装 zh-archify：本地 Code Analysis、SARIF 导入、固定提交比较、架构漂移和 PR 图包构建通过。');
    return receipt;
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  try { checkUpstreamRuntime(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
