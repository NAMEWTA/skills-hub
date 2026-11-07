import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { markdownDestinations, localTarget, runtimeIssues, unreachableMarkdown, checkScriptFormats } from '../scripts/validate.mjs';
import { temporary, write } from './helpers.mjs';

function fixture(t) {
  const root = temporary(t, 'skills-wta-links-');
  const skill = path.join(root, 'dev-sample');
  const entry = write(path.join(skill, 'SKILL.md'), '# 示例\n');
  const reference = write(path.join(skill, 'references/完整说明.md'), '# 完整说明\n');
  return { root, skill, entry, reference };
}

test('a full local Chinese resource is resolvable', (t) => {
  const f = fixture(t);
  const destinations = markdownDestinations('参见 [完整说明](references/完整说明.md#设计)。');
  assert.equal(destinations.length, 1);
  const { target, error } = localTarget(f.entry, destinations[0], f.skill);
  assert.equal(error, null); assert.equal(target, fs.realpathSync(f.reference));
});
test('reference-style and HTML links are checked', (t) => {
  const f = fixture(t);
  const body = '[方法][details]\n\n[details]: references/完整说明.md "说明"\n<a href="references/missing.md">另一个</a>';
  const destinations = markdownDestinations(body);
  assert.ok(destinations.includes('references/完整说明.md')); assert.ok(destinations.includes('references/missing.md'));
  assert.match(localTarget(f.entry, 'references/missing.md', f.skill).error, /missing/);
});
test('an existing sibling file cannot satisfy standalone installation', (t) => {
  const f = fixture(t); write(path.join(f.root, 'dev-other/SKILL.md'), '# 兄弟技能\n');
  assert.match(localTarget(f.entry, '../dev-other/SKILL.md', f.skill).error, /escapes/);
});
test('encoded parent traversal is rejected', (t) => {
  const f = fixture(t); assert.match(localTarget(f.entry, '%2e%2e/private.txt', f.skill).error, /escapes/);
});
test('external references cannot hide in alternate link syntax', () => {
  for (const body of [
    '[说明](https://docs.example.edu/reference)', '[说明][a]\n[a]: //docs.example.edu/reference',
    '<a href="https://docs.example.edu/reference">说明</a>', '[说明](file:///some/other/repository/reference.md)',
    '```sh\ncurl https://docs.example.edu/reference\n```',
  ]) assert.ok(runtimeIssues(body).length > 0, body);
});
test('loopback and reserved operational examples are not document dependencies', () => {
  for (const url of ['http://127.0.0.1:8080/health', 'http://[::1]:8080/', 'https://service.invalid/api']) assert.deepEqual(runtimeIssues(`\`\`\`sh\ncurl ${url}\n\`\`\``), [], url);
  assert.ok(runtimeIssues('https://localhost.remote.example.edu/').length > 0);
});
test('provenance is rejected even without a link', () => {
  assert.ok(runtimeIssues('此方法来自 Matt Pocock。').length > 0);
  assert.deepEqual(runtimeIssues('使用本地完整参考，按规格完成实现后验证。'), []);
});
test('a URL parser origin does not allow external document dependencies', () => {
  const literal = 'const origin = "https://github.com/";';
  assert.deepEqual(runtimeIssues(literal, { allowServicePrefixes: true }), []);
  assert.deepEqual(runtimeIssues('`https://github.com/${owner}/${repo}/pull/${number}`', { allowServicePrefixes: true }), []);
  assert.ok(runtimeIssues(literal).length > 0);
  assert.ok(runtimeIssues('[资料](https://github.com/)', { allowServicePrefixes: true }).length > 0);
  assert.ok(runtimeIssues('"https://github.com/example/repo"', { allowServicePrefixes: true }).length > 0);
});
test('a resource index connects all full references', (t) => {
  const f = fixture(t); const index = write(path.join(f.skill, 'references/index.md'), '# 索引\n');
  const graph = new Map([[fs.realpathSync(f.entry), new Set([fs.realpathSync(index)])], [fs.realpathSync(index), new Set([fs.realpathSync(f.reference)])]]);
  assert.deepEqual(unreachableMarkdown(f.skill, graph), new Set());
  graph.set(fs.realpathSync(index), new Set());
  assert.deepEqual(unreachableMarkdown(f.skill, graph), new Set([fs.realpathSync(f.reference)]));
});
test('a nested fence example does not create a fake resource link', () => {
  const body = '````markdown\n```text\n```\n[示例](not-a-real-resource.md)\n````\n[真实](references/完整说明.md)';
  assert.deepEqual(markdownDestinations(body), ['references/完整说明.md']);
});
test('HTML entities cannot hide an external reference', () => {
  for (const body of ['<a href="https&colon;&sol;&sol;docs.example.edu/reference">说明</a>', '[说明](&#x68;ttps://docs.example.edu/reference)']) assert.ok(runtimeIssues(body).length > 0, body);
});
test('script format checking rejects Python, shell, TypeScript and disguised launchers but preserves archived data', (t) => {
  const root = temporary(t, 'skills-wta-script-format-');
  for (const file of ['scripts/check.py', 'skills/dev/dev-sample/scripts/run.sh', 'tests/sample.ts']) write(path.join(root, file), 'old runtime');
  for (const file of ['scripts/check.mjs', 'skills/dev/dev-sample/assets/example.js', 'materials/a001/original.txt', 'materials/a001/historical.py']) write(path.join(root, file), 'data or JavaScript');
  write(path.join(root, 'scripts/hidden-shell'), '#!/bin/sh\nexit 0\n');
  write(path.join(root, 'scripts/disguised.mjs'), '#!/bin/bash\nexit 0\n');
  write(path.join(root, 'scripts/extensionless-node'), '#!/usr/bin/env node\n');
  write(path.join(root, '.githooks/pre-commit'), '#!/usr/bin/env node\n');
  write(path.join(root, 'skills/dev/dev-sample/materials/hidden.py'), 'old runtime');
  const failures = checkScriptFormats(root);
  assert.equal(failures.length, 7); assert.ok(failures.every((failure) => !failure.startsWith('materials/')));
});
