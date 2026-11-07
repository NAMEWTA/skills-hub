import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { checkPackage, installedPackagePath } from '../scripts/check-package.mjs';
import { licenseBundleFiles, repositoryRoot } from '../install.mjs';
import { temporary, write } from './helpers.mjs';

test('scoped package paths retain the scope and cannot leave node_modules', () => {
  const prefix = path.resolve('consumer');
  assert.equal(installedPackagePath(prefix, '@namewta/skills-hub'), path.join(prefix, 'node_modules', '@namewta', 'skills-hub'));
  assert.equal(installedPackagePath(prefix, 'skills-hub'), path.join(prefix, 'node_modules', 'skills-hub'));
  for (const name of ['../skills-hub', '@namewta/../skills-hub', '@namewta\\skills-hub', '/skills-hub', '@namewta/', '', null]) {
    assert.throws(() => installedPackagePath(prefix, name), /安装路径/);
  }
});

test('the scoped tarball installs offline and exposes the skills-hub command', (t) => {
  const root = temporary(t, 'skills-hub scoped-package-');
  write(path.join(root, 'package.json'), JSON.stringify({
    name: '@namewta/skills-hub', version: '0.0.2', type: 'module',
    bin: { 'skills-hub': './install.mjs' },
    files: ['install.mjs', 'skills/', 'licenses/', 'LICENSE', 'THIRD_PARTY_NOTICES.md'],
    license: 'MIT',
  }));
  fs.copyFileSync(path.join(repositoryRoot, 'install.mjs'), path.join(root, 'install.mjs'));
  for (const name of ['README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) write(path.join(root, name), '测试发布文档。\n');
  for (const name of licenseBundleFiles) write(path.join(root, 'licenses', name), '测试许可。\n');
  write(path.join(root, 'skills', 'dev', 'dev-sample', 'SKILL.md'), '---\nname: dev-sample\ndescription: 测试离线安装。\n---\n\n# 测试\n');
  const packed = checkPackage(root);
  assert.equal(packed.name, '@namewta/skills-hub');
  assert.equal(packed.version, '0.0.2');
  assert.equal(packed.filename, 'namewta-skills-hub-0.0.2.tgz');
  assert.equal(packed.skills, 1);
});
