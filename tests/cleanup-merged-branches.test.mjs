import test from 'node:test';
import assert from 'node:assert/strict';
import { canDelete, cleanMergedBranches } from '../scripts/cleanup-merged-branches.mjs';

const sha = c => c.repeat(40);
test('branch eligibility rejects unmerged and protected branches', () => {
  assert.deepEqual(canDelete({ protected: false, commit: { sha: sha('a') } }, { status: 'ahead', behind_by: 0 }), { ok: true });
  assert.deepEqual(canDelete({ protected: false, commit: { sha: sha('a') } }, { status: 'identical', behind_by: 0 }), { ok: true });
  assert.equal(canDelete({ protected: true, commit: { sha: sha('a') } }, { status: 'ahead', behind_by: 0 }).ok, false);
  assert.equal(canDelete({ protected: false, commit: { sha: sha('a') } }, { status: 'diverged', behind_by: 1 }).ok, false);
});
test('cleans only contained branches after rechecking ref and main', async () => {
  const removed = [];
  const names = [{ name: 'main', commit: { sha: sha('f') } }, { name: 'feature/a', commit: { sha: sha('a') }, protected: false }];
  const api = async (method, route) => {
    if (route.endsWith('/branches/main')) return { commit: { sha: sha('f') } };
    if (route.includes('/branches?')) return names;
    if (route.endsWith('/compare/' + sha('a') + '...' + sha('f'))) return { status: 'ahead', behind_by: 0 };
    if (route.endsWith('/branches/feature/a')) return names[1];
    if (method === 'DELETE') { removed.push(route); return null; }
    throw new Error('unexpected route: ' + route);
  };
  const result = await cleanMergedBranches({ repository: 'NAMEWTA/skills-hub', mainSha: sha('f'), api, output: () => {} });
  assert.deepEqual(result.deleted, ['feature/a']);
  assert.equal(removed.length, 1);
});
test('keeps a branch if its head changed after comparison', async () => {
  const names = [{ name: 'main', commit: { sha: sha('f') } }, { name: 'feature/a', commit: { sha: sha('a') }, protected: false }];
  const api = async (method, route) => {
    if (route.endsWith('/branches/main')) return names[0];
    if (route.includes('/branches?')) return names;
    if (route.includes('/compare/')) return { status: 'ahead', behind_by: 0 };
    if (route.endsWith('/branches/feature/a')) return { ...names[1], commit: { sha: sha('b') } };
    if (method === 'DELETE') throw new Error('must not delete');
    throw new Error('unexpected route: ' + route);
  };
  await assert.rejects(cleanMergedBranches({ repository: 'NAMEWTA/skills-hub', mainSha: sha('f'), api, output: () => {} }), /仍有未删除分支/);
});
