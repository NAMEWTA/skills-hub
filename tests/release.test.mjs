import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  releasePlan, assertPublishedIntegrity, compareVersions, latestPolicy,
  findReleaseByTag, uploadAsset, requestJson,
  findVerifiedStage, ensureNpmPublication, stageNotice, finalizeRelease,
  packageInfo, planFromEnvironment, releaseNotes, npmMetadataUrl, readLatestPolicy,
} from '../scripts/release.mjs';
import { temporary, write } from './helpers.mjs';

const sha = 'a'.repeat(40);
const base = { eventName: 'push', event: { after: sha }, ref: 'refs/heads/main', sha, version: '0.0.2' };

test('first committed version plans a release, unchanged versions do not', () => {
  assert.equal(releasePlan(base).publish, true);
  assert.equal(releasePlan({ ...base, previousVersion: '0.0.1' }).publish, true);
  assert.equal(releasePlan({ ...base, previousVersion: '0.0.2' }).publish, false);
  assert.equal(releasePlan({ ...base, version: '0.0.3', previousVersion: '0.0.2' }).publish, true);
});

test('the scoped release requires exact package, lockfile and source-repository identities', (t) => {
  const root = temporary(t);
  const pkg = { name: '@namewta/skills-hub', version: '0.0.2', repository: { type: 'git', url: 'git+https://github.com/NAMEWTA/skills-hub.git' } };
  const lock = { name: pkg.name, version: pkg.version, packages: { '': { name: pkg.name, version: pkg.version } } };
  const save = (manifest = pkg, locked = lock) => {
    write(path.join(root, 'package.json'), JSON.stringify(manifest));
    write(path.join(root, 'package-lock.json'), JSON.stringify(locked));
  };
  save();
  assert.deepEqual(packageInfo(root), pkg);
  for (const name of ['skills-wta', 'skills-hub', '@other/skills-hub']) {
    save({ ...pkg, name }, { ...lock, name, packages: { '': { name, version: pkg.version } } });
    assert.throws(() => packageInfo(root), /名称或版本不一致/);
  }
  save(pkg, { ...lock, packages: { '': { name: 'skills-hub', version: pkg.version } } });
  assert.throws(() => packageInfo(root), /名称或版本不一致/);
  save({ ...pkg, repository: { type: 'git', url: 'git+https://github.com/NAMEWTA/skills-wta.git' } });
  assert.throws(() => packageInfo(root), /源码仓库/);
});

test('old and unrelated GitHub repositories cannot enter release planning', () => {
  const saved = process.env.GITHUB_REPOSITORY;
  try {
    for (const repository of ['NAMEWTA/skills-wta', 'other/skills-hub', 'NAMEWTA/skills-hub-copy']) {
      process.env.GITHUB_REPOSITORY = repository;
      assert.throws(() => planFromEnvironment(), /发布仅针对配置的源码仓库/);
    }
  } finally {
    if (saved === undefined) delete process.env.GITHUB_REPOSITORY;
    else process.env.GITHUB_REPOSITORY = saved;
  }
});

test('release notes install the scoped package at the exact release version', (t) => {
  const root = temporary(t);
  write(path.join(root, 'CHANGELOG.md'), '# 更新记录\n\n## 0.0.2 — 2026-11-07\n\n迁移包名。\n\n## 0.0.1 — 2026-11-06\n\n历史说明。\n');
  const notes = releaseNotes('0.0.2', root);
  assert.match(notes, /npx @namewta\/skills-hub@0\.0\.2 install --domain dev/);
  assert.ok(notes.includes('迁移包名。'));
  assert.ok(!notes.includes('历史说明。'));
});

test('scoped registry metadata keeps the package in one percent-encoded path segment', () => {
  for (const selector of ['0.0.2', '0.0.3-beta.1', 'latest', 'next']) {
    const url = npmMetadataUrl('@namewta/skills-hub', selector);
    assert.equal(url, `https://registry.npmjs.org/%40namewta%2Fskills-hub/${selector}`);
    assert.deepEqual(new URL(url).pathname.split('/').slice(1).map(decodeURIComponent), ['@namewta/skills-hub', selector]);
  }
});

test('latest lookup queries the scoped package and preserves the old GitHub release', async () => {
  const calls = [];
  const policy = await readLatestPolicy({ name: '@namewta/skills-hub', version: '0.0.2' }, async (route, options) => {
    calls.push(route);
    assert.deepEqual(options, { nullable: true });
    return { tag_name: 'v0.0.1' };
  }, {
    request: async (url, options) => {
      calls.push(String(url));
      assert.equal(options.method, 'GET');
      return new Response(null, { status: 404 });
    },
  });
  assert.deepEqual(calls, ['https://registry.npmjs.org/%40namewta%2Fskills-hub/latest', '/releases/latest']);
  assert.deepEqual(policy, { makeLatest: true });
});

test('scoped latest queries still reject rollback and skip latest for prereleases', async () => {
  const packed = { name: '@namewta/skills-hub', version: '0.0.2' };
  const api = async () => ({ tag_name: 'v0.0.3' });
  const request = async (url) => {
    assert.equal(url, 'https://registry.npmjs.org/%40namewta%2Fskills-hub/latest');
    return new Response(JSON.stringify({ name: packed.name, version: '0.0.3' }), { status: 200 });
  };
  await assert.rejects(readLatestPolicy(packed, api, { request }), /低于现有 latest/);
  assert.deepEqual(await readLatestPolicy(packed, api, { published: true, request }), { makeLatest: false });
  const unexpected = () => { throw new Error('Prereleases must not consult or replace latest'); };
  assert.deepEqual(await readLatestPolicy({ ...packed, version: '0.0.3-beta.1' }, unexpected, { request: unexpected }), { makeLatest: false });
});
test('a same-version main push retries only with an explicit matching release trailer', () => {
  const unchanged = { ...base, previousVersion: '0.0.2' };
  assert.equal(releasePlan(unchanged).publish, false);
  assert.equal(releasePlan({ ...unchanged, retryVersion: '0.0.2' }).publish, true);
  for (const retryVersion of ['0.0.3', '0.0.2\n0.0.2', '']) {
    assert.throws(() => releasePlan({ ...unchanged, retryVersion }), /Release-Retry/);
  }
  assert.throws(() => releasePlan({ ...unchanged, retryVersion: '0.0.2', ref: 'refs/heads/other' }), /不允许/);
});
test('pushed version tags must match the package version', () => {
  assert.equal(releasePlan({ ...base, ref: 'refs/tags/v0.0.2' }).tag, 'v0.0.2');
  assert.throws(() => releasePlan({ ...base, ref: 'refs/tags/v0.0.3' }), /不一致/);
});
test('manual publishing validates version and selected branch', () => {
  const manual = { ...base, eventName: 'workflow_dispatch', event: { inputs: { version: '0.0.2' } } };
  assert.equal(releasePlan(manual).publish, true);
  assert.throws(() => releasePlan({ ...manual, ref: 'refs/heads/experiment' }), /请选择/);
  assert.throws(() => releasePlan({ ...manual, event: { inputs: { version: '0.0.3' } } }), /版本不一致/);
});
test('only published GitHub releases with matching versions are accepted', () => {
  const release = { ...base, eventName: 'release', event: { action: 'published', release: { tag_name: 'v0.0.2' } } };
  assert.equal(releasePlan(release).publish, true);
  assert.throws(() => releasePlan({ ...release, event: { ...release.event, action: 'created' } }), /不一致/);
});
test('pull requests and mismatched push commits cannot plan publication', () => {
  assert.throws(() => releasePlan({ ...base, eventName: 'pull_request' }), /不允许/);
  assert.throws(() => releasePlan({ ...base, event: { after: 'b'.repeat(40) } }), /提交不一致/);
});
test('prereleases use next, invalid versions are rejected', () => {
  assert.equal(releasePlan({ ...base, version: '0.0.3-beta.1' }).distTag, 'next');
  assert.throws(() => releasePlan({ ...base, version: '0.0.3-beta.01' }), /无效/);
  assert.throws(() => releasePlan({ ...base, version: '0.0.2\nother=true' }), /无效/);
  assert.throws(() => releasePlan({ ...base, version: '0.0.2\n' }), /无效/);
});
test('retries accept an identical published package and reject immutable version reuse', () => {
  const packed = { name: '@namewta/skills-hub', version: '0.0.2', integrity: 'sha512-original' };
  assert.doesNotThrow(() => assertPublishedIntegrity({ name: packed.name, version: packed.version, dist: { integrity: packed.integrity } }, packed));
  assert.throws(() => assertPublishedIntegrity({ name: packed.name, version: packed.version, dist: { integrity: 'sha512-other' } }, packed), /已经存在/);
});

test('latest ordering compares numeric versions and prerelease identifiers correctly', () => {
  for (const [lower, higher] of [
    ['0.0.9', '0.0.10'], ['1.9.0', '1.10.0'], ['1.99.99', '2.0.0'],
    ['1.0.0-alpha.2', '1.0.0-alpha.10'], ['1.0.0-1', '1.0.0-alpha'],
    ['1.0.0-beta', '1.0.0-beta.1'], ['1.0.0-rc.1', '1.0.0'],
  ]) {
    assert.equal(compareVersions(lower, higher), -1);
    assert.equal(compareVersions(higher, lower), 1);
    assert.equal(compareVersions(lower, lower), 0);
  }
  assert.throws(() => compareVersions('unknown', '0.0.2'), /非标准/);
});

test('first and newer stable releases can become latest while prereleases cannot', () => {
  assert.deepEqual(latestPolicy({ version: '0.0.2' }), { makeLatest: true });
  assert.deepEqual(latestPolicy({ version: '0.0.10', npmLatest: '0.0.9', githubLatest: '0.0.8' }), { makeLatest: true });
  assert.deepEqual(latestPolicy({ version: '0.0.10-beta.1', npmLatest: '0.0.9' }), { makeLatest: false });
});

test('an unpublished stable release cannot replace either service with an older latest', () => {
  for (const current of [{ npmLatest: '0.0.3' }, { githubLatest: '0.0.3' }]) {
    assert.throws(() => latestPolicy({ version: '0.0.2', ...current }), /低于现有 latest/);
  }
  assert.throws(() => latestPolicy({ version: '0.0.2', githubLatest: 'initial' }), /不是可核对/);
});

test('an already published identical older package can finish without changing latest', () => {
  const packed = { name: '@namewta/skills-hub', version: '0.0.2', integrity: 'sha512-original' };
  assertPublishedIntegrity({ name: packed.name, version: packed.version, dist: { integrity: packed.integrity } }, packed);
  for (const current of [{ npmLatest: '0.0.3' }, { githubLatest: '0.0.3' }]) {
    assert.deepEqual(latestPolicy({ version: packed.version, published: true, ...current }), { makeLatest: false });
  }
});

test('draft recovery finds the matching release beyond the first page', async () => {
  const calls = [];
  const draft = { id: 201, tag_name: 'v0.0.2', draft: true };
  const result = await findReleaseByTag(async (route) => {
    calls.push(route);
    if (route === '/releases/tags/v0.0.2') return null;
    if (route.endsWith('page=1')) return Array.from({ length: 100 }, (_, index) => ({ id: index + 1, tag_name: `other-${index}`, draft: false }));
    if (route.endsWith('page=2')) return [draft];
    throw new Error(`Unexpected route ${route}`);
  }, 'v0.0.2');
  assert.deepEqual(result, draft);
  assert.deepEqual(calls, ['/releases/tags/v0.0.2', '/releases?per_page=100&page=1', '/releases?per_page=100&page=2']);
});

test('duplicate same-tag drafts on different pages are not chosen arbitrarily', async () => {
  await assert.rejects(findReleaseByTag(async (route) => {
    if (route.startsWith('/releases/tags/')) return null;
    if (route.endsWith('page=1')) return [
      { id: 1, tag_name: 'v0.0.2', draft: true },
      ...Array.from({ length: 99 }, (_, index) => ({ id: index + 2, tag_name: `other-${index}` })),
    ];
    return [{ id: 101, tag_name: 'v0.0.2', draft: true }];
  }, 'v0.0.2'), /存在多个/);
});

test('release lookup handles a first release and an already published release', async () => {
  assert.equal(await findReleaseByTag(async route => route.startsWith('/releases/tags/') ? null : [], 'v0.0.2'), null);
  const published = { id: 1, tag_name: 'v0.0.2', draft: false };
  assert.equal(await findReleaseByTag(async () => published, 'v0.0.2'), published);
});

test('successful asset deletion accepts an empty 204 response', async () => {
  const result = await requestJson('https://api.github.com/repos/NAMEWTA/skills-hub/releases/assets/1', {
    method: 'DELETE', token: 'test-token',
    request: async (_url, options) => {
      assert.equal(options.method, 'DELETE');
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      return new Response(null, { status: 204 });
    },
  });
  assert.equal(result, null);
});

function assetFixture(t, existing, draft = true) {
  const bytes = Buffer.from('the published package\n');
  const file = write(path.join(temporary(t), 'namewta-skills-hub-0.0.2.tgz'), bytes);
  const release = { id: 1, draft, upload_url: 'https://uploads.github.com/repos/NAMEWTA/skills-hub/releases/1/assets{?name,label}' };
  const operations = [];
  const api = async (route, options = {}) => {
    operations.push([options.method ?? 'GET', route]);
    if (route === '/releases/1/assets?per_page=100') return [{ id: 2, name: path.basename(file), ...existing }];
    if (route === '/releases/assets/2' && options.method === 'DELETE') return null;
    throw new Error(`Unexpected API call: ${route}`);
  };
  return { bytes, file, release, operations, api };
}

test('a failed empty starter asset in a draft is removed before retrying its upload', async (t) => {
  const fixture = assetFixture(t, { state: 'starter', size: 0 });
  await uploadAsset(fixture.api, fixture.release, fixture.file, 'application/gzip', {
    token: 'test-token',
    request: async (url, options) => {
      fixture.operations.push([options.method, String(url)]);
      assert.equal(new URL(url).origin, 'https://uploads.github.com');
      assert.equal(new URL(url).pathname, '/repos/NAMEWTA/skills-hub/releases/1/assets');
      assert.equal(new URL(url).searchParams.get('name'), 'namewta-skills-hub-0.0.2.tgz');
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      assert.deepEqual(options.body, fixture.bytes);
      return new Response('{}', { status: 201 });
    },
  });
  assert.deepEqual(fixture.operations.map(([method]) => method), ['GET', 'DELETE', 'POST']);
});

test('starter cleanup never removes a nonempty asset or an asset from a published release', async (t) => {
  for (const [size, draft] of [[1, true], [0, false]]) {
    const fixture = assetFixture(t, { state: 'starter', size }, draft);
    await assert.rejects(uploadAsset(fixture.api, fixture.release, fixture.file, 'application/gzip', {
      request: async () => { throw new Error('No network write should occur'); },
    }), /不能自动清理/);
    assert.deepEqual(fixture.operations.map(([method]) => method), ['GET']);
  }
});

test('completed assets are preserved when equal and rejected when their digest differs', async (t) => {
  const fixture = assetFixture(t, { state: 'uploaded', size: 22 });
  const digest = `sha256:${createHash('sha256').update(fixture.bytes).digest('hex')}`;
  const noRequest = { request: async () => { throw new Error('No download or upload should occur'); } };
  await uploadAsset(async () => [{ name: path.basename(fixture.file), state: 'uploaded', digest }], fixture.release, fixture.file, 'application/gzip', noRequest);
  await assert.rejects(uploadAsset(async () => [{ name: path.basename(fixture.file), state: 'uploaded', digest: 'sha256-other' }], fixture.release, fixture.file, 'application/gzip', noRequest), /内容不同/);
});

test('digestless draft assets are verified through the authenticated asset API', async (t) => {
  const fixture = assetFixture(t, { state: 'uploaded', digest: null, browser_download_url: 'https://example.invalid/private-asset' });
  let downloads = 0;
  await uploadAsset(fixture.api, fixture.release, fixture.file, 'application/gzip', {
    token: 'test-token',
    request: async (url, options) => {
      downloads += 1;
      assert.equal(url, 'https://api.github.com/repos/NAMEWTA/skills-hub/releases/assets/2');
      assert.equal(options.headers.Accept, 'application/octet-stream');
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      assert.equal(options.method, undefined);
      return new Response(fixture.bytes, { status: 200 });
    },
  });
  assert.equal(downloads, 1);
  assert.deepEqual(fixture.operations.map(([method]) => method), ['GET']);
});

test('a digestless attachment with different bytes is never overwritten', async (t) => {
  const fixture = assetFixture(t, { state: 'uploaded', digest: null });
  await assert.rejects(uploadAsset(fixture.api, fixture.release, fixture.file, 'application/gzip', {
    token: 'test-token', request: async () => new Response('different bytes'),
  }), /内容不同/);
  assert.deepEqual(fixture.operations.map(([method]) => method), ['GET']);
});

function stageFixture(t) {
  const bytes = Buffer.from('verified original stage tarball');
  const file = write(path.join(temporary(t), 'namewta-skills-hub-0.0.2.tgz'), bytes);
  const packed = { name: '@namewta/skills-hub', version: '0.0.2', file, integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}` };
  const stage = { id: '1de6f3db-2ed9-4d72-b3dd-8f0e2b474a2f', packageName: packed.name, version: packed.version, tag: 'latest', shasum: createHash('sha1').update(bytes).digest('hex'), status: 'unknown-server-state' };
  const calls = [];
  const json = data => new Response(JSON.stringify(data), { status: 200 });
  const request = async (url, options) => {
    calls.push(String(url));
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://registry.npmjs.org');
    assert.equal(options.method, 'GET');
    if (!parsed.pathname.startsWith('/-/stage')) return new Response(null, { status: 404 });
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    if (parsed.pathname === '/-/stage') {
      assert.equal(parsed.searchParams.get('package'), packed.name);
      assert.equal(parsed.searchParams.get('perPage'), '100');
      return json({ items: [stage], page: Number(parsed.searchParams.get('page')), perPage: 100, total: 1 });
    }
    if (parsed.pathname === `/-/stage/${stage.id}`) return json(stage);
    if (parsed.pathname === `/-/stage/${stage.id}/tarball`) return new Response(bytes);
    throw new Error(`Unexpected stage request: ${url}`);
  };
  return { bytes, packed, stage, calls, json, request };
}

test('stage inspection paginates from zero and verifies the original tarball without interpreting status', async (t) => {
  const f = stageFixture(t);
  const request = async (url, options) => {
    const parsed = new URL(url);
    if (parsed.pathname === '/-/stage') {
      f.calls.push(String(url));
      assert.equal(options.method, 'GET');
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      assert.equal(parsed.searchParams.get('package'), '@namewta/skills-hub');
      const page = Number(parsed.searchParams.get('page'));
      return f.json({ items: page === 0 ? Array.from({ length: 100 }, (_, index) => ({ packageName: '@namewta/skills-hub', version: `1.0.${index}` })) : [f.stage], page, perPage: 100, total: 101 });
    }
    return f.request(url, options);
  };
  assert.deepEqual(await findVerifiedStage(f.packed, { token: 'test-token', request }), f.stage);
  assert.match(f.calls[0], /page=0&perPage=100&package=%40namewta%2Fskills-hub/);
  assert.match(f.calls[1], /page=1&perPage=100&package=%40namewta%2Fskills-hub/);
});

test('stage lookup refuses duplicate matching versions', async (t) => {
  const f = stageFixture(t);
  await assert.rejects(findVerifiedStage(f.packed, {
    token: 'test-token', request: async () => f.json({ items: [f.stage, { ...f.stage, id: '2de6f3db-2ed9-4d72-b3dd-8f0e2b474a2f' }], page: 0, perPage: 100, total: 2 }),
  }), /多个/);
});

test('stage selection excludes the old unscoped package and other scopes', async (t) => {
  const f = stageFixture(t);
  const unrelated = ['skills-wta', 'skills-hub', '@other/skills-hub'].map(packageName => ({ ...f.stage, packageName }));
  const request = (url, options) => new URL(url).pathname === '/-/stage'
    ? f.json({ items: [...unrelated, f.stage], page: 0, perPage: 100, total: 4 })
    : f.request(url, options);
  assert.deepEqual(await findVerifiedStage(f.packed, { token: 'test-token', request }), f.stage);
  assert.equal(await findVerifiedStage(f.packed, {
    token: 'test-token', request: async () => f.json({ items: unrelated, page: 0, perPage: 100, total: 3 }),
  }), null);
});

test('stage read failures and malformed lists are never treated as an absent version', async (t) => {
  const f = stageFixture(t);
  for (const status of [401, 403, 404]) {
    await assert.rejects(findVerifiedStage(f.packed, { token: 'test-token', request: async () => new Response(null, { status }) }), new RegExp(`返回 ${status}`));
  }
  await assert.rejects(findVerifiedStage(f.packed, { token: 'test-token', request: async () => f.json({ versions: [] }) }), /列表不是预期/);
  assert.equal(await findVerifiedStage(f.packed, { token: 'test-token', request: async () => f.json({ items: [], page: 0, perPage: 100, total: 0 }) }), null);
});

test('stage details must preserve the listed UUID, package identity and immutable tag', async (t) => {
  const f = stageFixture(t);
  for (const change of [{ id: '2de6f3db-2ed9-4d72-b3dd-8f0e2b474a2f' }, { packageName: 'other' }, { version: '0.0.3' }, { tag: 'next' }, { shasum: '0'.repeat(40) }]) {
    await assert.rejects(findVerifiedStage(f.packed, { token: 'test-token', request: (url, options) => String(url).endsWith(`/-/stage/${f.stage.id}`) ? f.json({ ...f.stage, ...change }) : f.request(url, options) }), /不符|不一致/);
  }
});

test('stage inspection rejects either a changed tarball or a different full SHA-512', async (t) => {
  const f = stageFixture(t);
  await assert.rejects(findVerifiedStage(f.packed, { token: 'test-token', request: (url, options) => String(url).endsWith('/tarball') ? new Response('changed') : f.request(url, options) }), /SHA-1、SHA-512 或原始字节/);
  await assert.rejects(findVerifiedStage({ ...f.packed, integrity: 'sha512-other' }, { token: 'test-token', request: f.request }), /SHA-1、SHA-512 或原始字节/);
  write(f.packed.file, 'local bytes changed');
  await assert.rejects(findVerifiedStage(f.packed, { token: 'test-token', request: f.request }), /SHA-1、SHA-512 或原始字节/);
});

test('an existing verified stage suppresses npm publish completely', async (t) => {
  const f = stageFixture(t);
  const result = await ensureNpmPublication(f.packed, {
    token: 'test-token', request: f.request,
    publishPackage: () => { throw new Error('Must never publish an existing stage'); },
  });
  assert.deepEqual(result, { published: false, stage: f.stage });
});

test('a successful CLI response followed by public 404 is resolved through the newly created stage', async (t) => {
  const f = stageFixture(t);
  let published = 0;
  const result = await ensureNpmPublication(f.packed, {
    token: 'test-token',
    request: (url, options) => new URL(url).pathname === '/-/stage' && !published ? f.json({ items: [], page: 0, perPage: 100, total: 0 }) : f.request(url, options),
    publishPackage: () => { published += 1; },
    wait: () => { throw new Error('A verified stage needs no polling'); },
  });
  assert.equal(published, 1);
  assert.deepEqual(result, { published: false, stage: f.stage });
});

test('approval recovery trusts verified public metadata without republishing or reading stage', async (t) => {
  const f = stageFixture(t);
  const result = await ensureNpmPublication(f.packed, {
    token: 'test-token',
    request: async (url) => {
      assert.equal(String(url), 'https://registry.npmjs.org/%40namewta%2Fskills-hub/0.0.2');
      return f.json({ name: f.packed.name, version: f.packed.version, dist: { integrity: f.packed.integrity } });
    },
    publishPackage: () => { throw new Error('An approved version must not be published twice'); },
  });
  assert.deepEqual(result, { published: true, stage: null });
});

test('OIDC-only publication remains available and absent stage-read credentials are explicit', async (t) => {
  const f = stageFixture(t);
  let published = 0;
  const messages = [];
  const result = await ensureNpmPublication(f.packed, {
    request: async url => {
      assert.equal(String(url), 'https://registry.npmjs.org/%40namewta%2Fskills-hub/0.0.2');
      return published ? f.json({ name: f.packed.name, version: f.packed.version, dist: { integrity: f.packed.integrity } }) : new Response(null, { status: 404 });
    },
    publishPackage: () => { published += 1; }, output: message => messages.push(message),
  });
  assert.equal(result.published, true);
  assert.equal(published, 1);
  assert.match(messages[0], /没有 NODE_AUTH_TOKEN/);
  let reads = 0;
  await assert.rejects(ensureNpmPublication(f.packed, {
    request: async () => { reads += 1; return new Response(null, { status: 404 }); },
    publishPackage() {}, wait() {}, output() {},
  }), /缺少 NODE_AUTH_TOKEN/);
  assert.equal(reads, 3);
});

test('pending and approved release updates preserve human content and only change our stage notice', async (t) => {
  const f = stageFixture(t);
  const human = '# 用户版本说明\n\n请保留这段原文。';
  const release = { id: 1, draft: true, body: human };
  const calls = [];
  const api = async (route, options) => {
    calls.push({ route, ...options });
    return { ...release, ...options.body };
  };
  const pending = await finalizeRelease(api, release, { stage: f.stage });
  assert.equal(pending.draft, true);
  assert.ok(pending.body.startsWith(human));
  assert.ok(pending.body.includes('<!-- skills-hub:npm-stage:start -->'));
  assert.ok(pending.body.includes('<!-- skills-hub:npm-stage:end -->'));
  assert.ok(pending.body.includes(`npm stage approve ${f.stage.id}`));
  assert.equal(Object.hasOwn(calls[0].body, 'draft'), false);
  pending.body += '\n\n维护者追加说明。';
  const completed = await finalizeRelease(api, pending, { makeLatest: false });
  assert.equal(completed.draft, false);
  assert.equal(completed.make_latest, 'false');
  assert.ok(completed.body.startsWith(human));
  assert.ok(completed.body.endsWith('维护者追加说明。'));
  assert.equal(completed.body.includes('skills-hub:npm-stage:'), false);
  await assert.rejects(finalizeRelease(api, { ...release, draft: false }, { stage: f.stage }), /已被公开/);
  assert.throws(() => stageNotice(`${human}\n<!-- skills-hub:npm-stage:start -->`, null), /标记不完整/);
});
