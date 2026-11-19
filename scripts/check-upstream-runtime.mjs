#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInstaller, repositoryRoot, isMain } from '../install.mjs';

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
    return receipt;
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  try { checkUpstreamRuntime(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
