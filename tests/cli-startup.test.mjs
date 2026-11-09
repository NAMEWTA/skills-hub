import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { repositoryRoot } from '../install.mjs';
import { temporary, write } from './helpers.mjs';

for (const argv of [[], ['install'], ['install', '--dry-run']]) {
  test(`TTY startup resolves the CLI back-import without a module evaluation deadlock: ${argv.join(' ')}`, t => {
    const root = temporary(t, 'skills-hub startup ');
    const entry = path.join(root, 'install.mjs');
    fs.copyFileSync(path.join(repositoryRoot, 'install.mjs'), entry);
    fs.mkdirSync(path.join(root, 'scripts'));
    fs.copyFileSync(path.join(repositoryRoot, 'scripts/init-persistence.mjs'), path.join(root, 'scripts/init-persistence.mjs'));
    // 保留真实模块依赖环，仅用确定性 UI 替代终端输入。
    write(path.join(root, 'cli.mjs'), `import { main } from './install.mjs';
export async function interactive({argv}) {
  console.log('interactive-ready', typeof main, JSON.stringify(argv));
  return 0;
}`);
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
process.argv = [process.execPath, ${JSON.stringify(entry)}, ...${JSON.stringify(argv)}];
Object.defineProperty(process.stdin, 'isTTY', {value:true});
Object.defineProperty(process.stdout, 'isTTY', {value:true});
await import(${JSON.stringify(pathToFileURL(entry).href)});
`], { encoding: 'utf8', timeout: 10000 });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /interactive-ready function/);
    assert.doesNotMatch(result.stderr, /unsettled|Warning:/);
  });
}
