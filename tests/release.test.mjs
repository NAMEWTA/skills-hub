import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  releasePlan, assertPublishedIntegrity, compareVersions, latestPolicy,
  findReleaseByTag, uploadAsset, requestJson,
} from '../scripts/release.mjs';
import { temporary, write } from './helpers.mjs';

const sha = 'a'.repeat(40);
const base = { eventName: 'push', event: { after: sha }, ref: 'refs/heads/main', sha, version: '0.0.1' };

test('first committed version plans a release, unchanged versions do not', () => {
  assert.equal(releasePlan(base).publish, true);
  assert.equal(releasePlan({ ...base, previousVersion: '0.0.1' }).publish, false);
  assert.equal(releasePlan({ ...base, version: '0.0.2', previousVersion: '0.0.1' }).publish, true);
});
test('a same-version main push retries only with an explicit matching release trailer', () => {
  const unchanged = { ...base, previousVersion: '0.0.1' };
  assert.equal(releasePlan(unchanged).publish, false);
  assert.equal(releasePlan({ ...unchanged, retryVersion: '0.0.1' }).publish, true);
  for (const retryVersion of ['0.0.2', '0.0.1\n0.0.1', '']) {
    assert.throws(() => releasePlan({ ...unchanged, retryVersion }), /Release-Retry/);
  }
  assert.throws(() => releasePlan({ ...unchanged, retryVersion: '0.0.1', ref: 'refs/heads/other' }), /不允许/);
});
test('pushed version tags must match the package version', () => {
  assert.equal(releasePlan({ ...base, ref: 'refs/tags/v0.0.1' }).tag, 'v0.0.1');
  assert.throws(() => releasePlan({ ...base, ref: 'refs/tags/v0.0.2' }), /不一致/);
});
test('manual publishing validates version and selected branch', () => {
  const manual = { ...base, eventName: 'workflow_dispatch', event: { inputs: { version: '0.0.1' } } };
  assert.equal(releasePlan(manual).publish, true);
  assert.throws(() => releasePlan({ ...manual, ref: 'refs/heads/experiment' }), /请选择/);
  assert.throws(() => releasePlan({ ...manual, event: { inputs: { version: '0.0.2' } } }), /版本不一致/);
});
test('only published GitHub releases with matching versions are accepted', () => {
  const release = { ...base, eventName: 'release', event: { action: 'published', release: { tag_name: 'v0.0.1' } } };
  assert.equal(releasePlan(release).publish, true);
  assert.throws(() => releasePlan({ ...release, event: { ...release.event, action: 'created' } }), /不一致/);
});
test('pull requests and mismatched push commits cannot plan publication', () => {
  assert.throws(() => releasePlan({ ...base, eventName: 'pull_request' }), /不允许/);
  assert.throws(() => releasePlan({ ...base, event: { after: 'b'.repeat(40) } }), /提交不一致/);
});
test('prereleases use next, invalid versions are rejected', () => {
  assert.equal(releasePlan({ ...base, version: '0.0.2-beta.1' }).distTag, 'next');
  assert.throws(() => releasePlan({ ...base, version: '0.0.2-beta.01' }), /无效/);
  assert.throws(() => releasePlan({ ...base, version: '0.0.1\nother=true' }), /无效/);
  assert.throws(() => releasePlan({ ...base, version: '0.0.1\n' }), /无效/);
});
test('retries accept an identical published package and reject immutable version reuse', () => {
  const packed = { name: 'skills-wta', version: '0.0.1', integrity: 'sha512-original' };
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
  assert.throws(() => compareVersions('unknown', '0.0.1'), /非标准/);
});

test('first and newer stable releases can become latest while prereleases cannot', () => {
  assert.deepEqual(latestPolicy({ version: '0.0.1' }), { makeLatest: true });
  assert.deepEqual(latestPolicy({ version: '0.0.10', npmLatest: '0.0.9', githubLatest: '0.0.8' }), { makeLatest: true });
  assert.deepEqual(latestPolicy({ version: '0.0.10-beta.1', npmLatest: '0.0.9' }), { makeLatest: false });
});

test('an unpublished stable release cannot replace either service with an older latest', () => {
  for (const current of [{ npmLatest: '0.0.2' }, { githubLatest: '0.0.2' }]) {
    assert.throws(() => latestPolicy({ version: '0.0.1', ...current }), /低于现有 latest/);
  }
  assert.throws(() => latestPolicy({ version: '0.0.1', githubLatest: 'initial' }), /不是可核对/);
});

test('an already published identical older package can finish without changing latest', () => {
  const packed = { name: 'skills-wta', version: '0.0.1', integrity: 'sha512-original' };
  assertPublishedIntegrity({ name: packed.name, version: packed.version, dist: { integrity: packed.integrity } }, packed);
  for (const current of [{ npmLatest: '0.0.2' }, { githubLatest: '0.0.2' }]) {
    assert.deepEqual(latestPolicy({ version: packed.version, published: true, ...current }), { makeLatest: false });
  }
});

test('draft recovery finds the matching release beyond the first page', async () => {
  const calls = [];
  const draft = { id: 201, tag_name: 'v0.0.1', draft: true };
  const result = await findReleaseByTag(async (route) => {
    calls.push(route);
    if (route === '/releases/tags/v0.0.1') return null;
    if (route.endsWith('page=1')) return Array.from({ length: 100 }, (_, index) => ({ id: index + 1, tag_name: `other-${index}`, draft: false }));
    if (route.endsWith('page=2')) return [draft];
    throw new Error(`Unexpected route ${route}`);
  }, 'v0.0.1');
  assert.deepEqual(result, draft);
  assert.deepEqual(calls, ['/releases/tags/v0.0.1', '/releases?per_page=100&page=1', '/releases?per_page=100&page=2']);
});

test('duplicate same-tag drafts on different pages are not chosen arbitrarily', async () => {
  await assert.rejects(findReleaseByTag(async (route) => {
    if (route.startsWith('/releases/tags/')) return null;
    if (route.endsWith('page=1')) return [
      { id: 1, tag_name: 'v0.0.1', draft: true },
      ...Array.from({ length: 99 }, (_, index) => ({ id: index + 2, tag_name: `other-${index}` })),
    ];
    return [{ id: 101, tag_name: 'v0.0.1', draft: true }];
  }, 'v0.0.1'), /存在多个/);
});

test('release lookup handles a first release and an already published release', async () => {
  assert.equal(await findReleaseByTag(async route => route.startsWith('/releases/tags/') ? null : [], 'v0.0.1'), null);
  const published = { id: 1, tag_name: 'v0.0.1', draft: false };
  assert.equal(await findReleaseByTag(async () => published, 'v0.0.1'), published);
});

test('successful asset deletion accepts an empty 204 response', async () => {
  const result = await requestJson('https://api.github.com/repos/NAMEWTA/skills-wta/releases/assets/1', {
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
  const file = write(path.join(temporary(t), 'skills-wta-0.0.1.tgz'), bytes);
  const release = { id: 1, draft, upload_url: 'https://uploads.github.com/repos/NAMEWTA/skills-wta/releases/1/assets{?name,label}' };
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
      assert.equal(url, 'https://api.github.com/repos/NAMEWTA/skills-wta/releases/assets/2');
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
