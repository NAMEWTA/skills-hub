import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint } from '../skills/dev/dev-prototype/scripts/fingerprint.mjs';
import { command, snapshot, temporary, write } from './helpers.mjs';

const cli = fileURLToPath(new URL('../skills/dev/dev-prototype/scripts/fingerprint.mjs', import.meta.url));
const run = (...args) => command(process.execPath, [cli, ...args]);
const page = '<!doctype html><html lang="zh"><title>原型</title><button>保存</button></html>';

function bundle(root, reversed = false) {
  const entries = [
    ['原型.html', page],
    ['assets/app.js', 'document.title = "交互原型";'],
    ['assets/theme.css', ':root { color: #123456; }'],
    ['assets/图像.bin', Buffer.from([0, 255, 127, 0])],
    ['.metadata', '被隐藏的资源同样参与摘要'],
  ];
  for (const [name, content] of reversed ? entries.reverse() : entries) write(path.join(root, name), content);
  return root;
}

test('完整资源包摘要不受位置、创建顺序和修改时间影响，并列出稳定的相对路径', async t => {
  const root = temporary(t);
  const first = bundle(path.join(root, 'first'));
  const second = bundle(path.join(root, '另一个位置'), true);
  fs.utimesSync(path.join(second, '原型.html'), new Date(0), new Date(0));
  const result = await fingerprint(first);
  assert.deepEqual(await fingerprint(second), result);
  assert.match(result.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(result.files.map(file => file.path), [
    '.metadata', 'assets/app.js', 'assets/theme.css', 'assets/图像.bin', '原型.html',
  ]);
  for (const file of result.files) assert.match(file.sha256, /^[a-f0-9]{64}$/);
});

test('HTML、脚本、样式、二进制和隐藏文件任一内容变化均改变总摘要，恢复内容恢复摘要', async t => {
  const root = bundle(temporary(t));
  const original = await fingerprint(root);
  for (const file of original.files) {
    const absolute = path.join(root, file.path);
    const before = fs.readFileSync(absolute);
    const changed = Buffer.from(before);
    changed[0] ^= 1;
    fs.writeFileSync(absolute, changed);
    const after = await fingerprint(root);
    assert.notEqual(after.sha256, original.sha256, file.path);
    assert.notEqual(after.files.find(entry => entry.path === file.path).sha256, file.sha256, file.path);
    fs.writeFileSync(absolute, before);
    assert.equal((await fingerprint(root)).sha256, original.sha256, file.path);
  }
});

test('资源新增、删除和改名都改变摘要', async t => {
  const root = bundle(temporary(t));
  const original = await fingerprint(root);
  const added = write(path.join(root, 'extra.txt'), '新资源');
  assert.notEqual((await fingerprint(root)).sha256, original.sha256);
  fs.rmSync(added);
  assert.equal((await fingerprint(root)).sha256, original.sha256);
  const resource = path.join(root, 'assets', 'app.js');
  fs.renameSync(resource, path.join(root, 'assets', 'renamed.js'));
  assert.notEqual((await fingerprint(root)).sha256, original.sha256);
  fs.renameSync(path.join(root, 'assets', 'renamed.js'), resource);
  fs.rmSync(resource);
  assert.notEqual((await fingerprint(root)).sha256, original.sha256);
});

test('CLI 输出资源清单，匹配与不匹配均不写入原型或确认文件', async t => {
  const root = bundle(temporary(t));
  const before = snapshot(root);
  const expected = (await fingerprint(root)).sha256;
  const normal = run(root);
  assert.equal(normal.status, 0, normal.stderr);
  assert.match(normal.stdout, new RegExp(`原型资源包 SHA-256：${expected}`));
  assert.match(normal.stdout, /"assets\/theme\.css"/);
  assert.match(normal.stdout, /不代表用户确认或交互验证通过/);
  const matched = run(root, '--expect', expected.toUpperCase());
  assert.equal(matched.status, 0, matched.stderr);
  assert.match(matched.stdout, /指纹匹配/);
  const mismatched = run(root, '--expect', '0'.repeat(64));
  assert.equal(mismatched.status, 1);
  assert.match(mismatched.stderr, /指纹不匹配/);
  assert.deepEqual(snapshot(root), before);
});

test('CLI 拒绝缺少目标和无效参数，帮助可独立读取', t => {
  const root = bundle(temporary(t));
  for (const args of [
    [], [''], ['--unknown'], [root, '--unknown'], [root, '--expect'],
    [root, '--expect', '123'], [root, '--expect', 'z'.repeat(64)],
    [root, '--other', '0'.repeat(64)], [root, '--expect', '0'.repeat(64), 'extra'],
    [path.join(root, 'missing')],
  ]) {
    const result = run(...args);
    assert.equal(result.status, 1, JSON.stringify(args));
    assert.match(result.stderr, /无法核对原型指纹/);
  }
  const help = run('--help');
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /用法/);
});

test('拒绝非目录、空目录、空子目录与没有 HTML 的目录', async t => {
  const root = temporary(t);
  await assert.rejects(fingerprint(root), /空目录/);
  const filename = write(path.join(root, 'plain.txt'), '内容');
  await assert.rejects(fingerprint(filename), /必须是目录/);
  await assert.rejects(fingerprint(root), /至少需要一个.*入口文件/);
  write(path.join(root, 'preview.HTM'), page);
  assert.equal((await fingerprint(root)).files.length, 2);
  fs.mkdirSync(path.join(root, 'empty'));
  await assert.rejects(fingerprint(root), /空目录/);
  for (const value of [undefined, null, '', '   ', 123]) {
    await assert.rejects(fingerprint(value), /请提供原型目录/);
  }
});

test('拒绝根目录、子目录和资源文件的符号链接', async t => {
  const root = temporary(t);
  const target = bundle(path.join(root, 'target'));
  const rootLink = path.join(root, 'root-link');
  try {
    fs.symlinkSync(target, rootLink, process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (process.platform === 'win32' && ['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
      t.skip('当前 Windows 环境不允许建立符号链接。');
      return;
    }
    throw error;
  }
  await assert.rejects(fingerprint(rootLink), /符号链接/);
  const child = path.join(target, 'linked-assets');
  fs.symlinkSync(path.join(target, 'assets'), child, process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(fingerprint(target), /符号链接/);
  fs.rmSync(child);
  try {
    fs.symlinkSync(path.join(target, '原型.html'), path.join(target, 'linked.html'), 'file');
  } catch (error) {
    if (process.platform === 'win32' && ['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
      t.diagnostic('目录链接已核验；当前 Windows 环境不允许建立文件符号链接。');
      return;
    }
    throw error;
  }
  await assert.rejects(fingerprint(target), /符号链接/);
});

test('拒绝目录中的特殊文件，避免把套接字作为资源读取', { skip: process.platform === 'win32' }, async t => {
  const root = temporary(t, 'prototype-');
  write(path.join(root, 'index.html'), page);
  const server = net.createServer();
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(path.join(root, 'socket'), resolve);
    });
  } catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
      t.skip('当前环境不允许创建本地套接字，无法构造特殊文件。');
      return;
    }
    throw error;
  }
  try {
    await assert.rejects(fingerprint(root), /特殊文件/);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
