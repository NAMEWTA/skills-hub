#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function canDelete(branch, comparison) {
  if (branch.protected) return { ok: false, reason: 'protected' };
  if (!/^[0-9a-f]{40}$/i.test(branch.commit?.sha ?? '')) return { ok: false, reason: 'invalid_sha' };
  if (comparison?.behind_by !== 0 || !['ahead', 'identical'].includes(comparison?.status)) return { ok: false, reason: 'unmerged' };
  return { ok: true };
}

async function githubApi(method, route) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('缺少 GITHUB_TOKEN；不删除分支');
  const response = await fetch('https://api.github.com' + route, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'skills-hub-safe-branch-cleanup'
    },
    signal: AbortSignal.timeout(30_000)
  });
  if (method === 'DELETE' && response.status === 204) return null;
  if (!response.ok) throw new Error(method + ' ' + route + ' failed with HTTP ' + response.status + ': ' + (await response.text()).slice(0, 350));
  return response.json();
}

export async function cleanMergedBranches({ repository, mainSha, api = githubApi, dryRun = false, output = console.log }) {
  if (repository !== 'NAMEWTA/skills-hub') throw new Error('只能清理预期的 skills-hub 仓库');
  if (!/^[0-9a-f]{40}$/i.test(mainSha ?? '')) throw new Error('未提供经过校验的主分支提交');
  const prefix = '/repos/' + repository;
  const getMain = () => api('GET', prefix + '/branches/main');
  const main = await getMain();
  if (main.commit?.sha !== mainSha) throw new Error('main 已发生并发变更，停止清理');
  const branches = [];
  for (let page = 1; page <= 100; page++) {
    const batch = await api('GET', prefix + '/branches?per_page=100&page=' + page);
    if (!Array.isArray(batch)) throw new Error('分支列表格式不正确');
    branches.push(...batch);
    if (batch.length < 100) break;
    if (page === 100) throw new Error('分支分页超限，不执行不完整清理');
  }
  const result = { deleted: [], skipped: [], dryRun };
  for (const branch of branches) {
    if (branch.name === 'main') continue;
    if (!branch.name || !/^[0-9a-f]{40}$/i.test(branch.commit?.sha ?? '')) throw new Error('分支身份或提交 SHA 无效');
    if (branch.protected) { result.skipped.push({ name: branch.name, reason: 'protected' }); continue; }
    const compare = await api('GET', prefix + '/compare/' + branch.commit.sha + '...' + mainSha);
    const eligibility = canDelete(branch, compare);
    if (!eligibility.ok) { result.skipped.push({ name: branch.name, reason: eligibility.reason }); continue; }
    const branchPath = branch.name.split('/').map(encodeURIComponent).join('/');
    const latest = await api('GET', prefix + '/branches/' + branchPath);
    if (latest.protected || latest.commit?.sha !== branch.commit.sha) {
      result.skipped.push({ name: branch.name, reason: 'changed_since_inspection' }); continue;
    }
    if ((await getMain()).commit?.sha !== mainSha) throw new Error('main 清理过程中发生变更，停止删除');
    if (!dryRun) await api('DELETE', prefix + '/git/refs/heads/' + branchPath);
    result.deleted.push(branch.name);
    output((dryRun ? '将删除：' : '已删除：') + branch.name);
  }
  output('清理结果：' + JSON.stringify(result));
  if (result.skipped.length) throw new Error('仍有未删除分支；已保留保护、未合并或发生并发变更的分支');
  return result;
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.some(v => v !== '--dry-run')) throw new Error('仅支持 --dry-run');
  const dryRun = argv.includes('--dry-run');
  const sha = process.env.GITHUB_SHA;
  return cleanMergedBranches({ repository: process.env.GITHUB_REPOSITORY, mainSha: sha, dryRun });
}

const direct = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (direct) main().catch(error => { console.error(error.message); process.exitCode = 1; });
