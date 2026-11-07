#!/usr/bin/env node
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { ROOT, packPackage } from './check-package.mjs';
import { runNpm } from './npm-cli.mjs';

const REPOSITORY = 'NAMEWTA/skills-wta';
const REGISTRY = 'https://registry.npmjs.org';
const API = 'https://api.github.com';
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?$/;

function validVersion(value) { return typeof value === 'string' && value.trim() === value && SEMVER.test(value); }

export function compareVersions(left, right) {
  if (!validVersion(left) || !validVersion(right)) throw new Error('无法比较非标准发布版本');
  const a = SEMVER.exec(left);
  const b = SEMVER.exec(right);
  for (let index = 1; index <= 3; index += 1) {
    const x = BigInt(a[index]);
    const y = BigInt(b[index]);
    if (x !== y) return x < y ? -1 : 1;
  }
  if (!a[4] || !b[4]) return a[4] ? -1 : b[4] ? 1 : 0;
  const x = a[4].split('.');
  const y = b[4].split('.');
  for (let index = 0; index < Math.max(x.length, y.length); index += 1) {
    if (x[index] === undefined) return -1;
    if (y[index] === undefined) return 1;
    if (x[index] === y[index]) continue;
    const xNumeric = /^\d+$/.test(x[index]);
    const yNumeric = /^\d+$/.test(y[index]);
    if (xNumeric && yNumeric) return BigInt(x[index]) < BigInt(y[index]) ? -1 : 1;
    if (xNumeric !== yNumeric) return xNumeric ? -1 : 1;
    return x[index] < y[index] ? -1 : 1;
  }
  return 0;
}

export function latestPolicy({ version, published = false, npmLatest = null, githubLatest = null }) {
  if (!validVersion(version)) throw new Error('无效发布版本');
  if (version.includes('-')) return { makeLatest: false };
  const newer = [];
  for (const [service, latest] of [['npm', npmLatest], ['GitHub', githubLatest]]) {
    if (latest === null) continue;
    if (!validVersion(latest)) throw new Error(`${service} latest 不是可核对的语义版本，停止修改发布指向`);
    if (compareVersions(version, latest) < 0) newer.push(`${service} ${latest}`);
  }
  if (newer.length && !published) {
    throw new Error(`未发布的稳定版本 ${version} 低于现有 latest（${newer.join('、')}）；请递增版本，不回退 latest`);
  }
  return { makeLatest: newer.length === 0 };
}

function releaseNotes(version) {
  const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
  const section = changelog.split(`## ${version} —`)[1]?.split('\n## ')[0];
  if (!section || section.indexOf('\n') < 0) throw new Error('CHANGELOG.md 缺少当前版本说明');
  return section.slice(section.indexOf('\n')).trim() + `\n\n## 安装\n\n\`npx skills-wta@${version} install --domain dev\`\n\nNode.js >=22.14.0；安装目标为当前项目的 \`.agents/skills/\`。\n\nnpm 包与本发布附件来自同一压缩包；校验和见 SHA256SUMS。`;
}

function git(args, { optional = false } = {}) {
  const result = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0 && !optional) throw new Error(`Git 检查失败：${result.stderr}`);
  return result;
}

function packageInfo() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const lock = JSON.parse(readFileSync(join(ROOT, 'package-lock.json'), 'utf8'));
  if (!validVersion(pkg.version)) throw new Error(`发布版本不是受支持的语义版本：${pkg.version}`);
  if (pkg.name !== 'skills-wta' || lock.name !== pkg.name || lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version) {
    throw new Error('package.json 与 package-lock.json 的名称或版本不一致');
  }
  return pkg;
}

export function releasePlan({ eventName, event, ref, sha, version, previousVersion }) {
  if (!validVersion(version)) throw new Error('无效发布版本');
  const tag = `v${version}`;
  let publish = false;
  if (eventName === 'push' && ref === 'refs/heads/main') {
    if (event.after && event.after !== sha) throw new Error('推送事件与检出提交不一致');
    publish = previousVersion !== version;
  } else if (eventName === 'push' && ref?.startsWith('refs/tags/')) {
    if (ref !== `refs/tags/${tag}`) throw new Error('Git 标签与 package.json 版本不一致');
    publish = true;
  } else if (eventName === 'release') {
    if (event.action !== 'published' || event.release?.tag_name !== tag) throw new Error('Release 事件或标签与包版本不一致');
    publish = true;
  } else if (eventName === 'workflow_dispatch') {
    if (ref !== 'refs/heads/main' && ref !== `refs/tags/${tag}`) throw new Error('手动发布请选择 main 或对应版本标签');
    if (event.inputs?.version !== version) throw new Error('手动填写的版本与检出版本不一致；先提交版本变更');
    publish = true;
  } else {
    throw new Error('该事件不允许发布');
  }
  return { publish, version, tag, sha, distTag: version.includes('-') ? 'next' : 'latest' };
}

export function planFromEnvironment() {
  if (process.env.GITHUB_REPOSITORY !== REPOSITORY) throw new Error('发布仅针对配置的源码仓库');
  const pkg = packageInfo();
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const sha = git(['rev-parse', 'HEAD']).stdout.trim();
  let previousVersion;
  if (process.env.GITHUB_EVENT_NAME === 'push' && process.env.GITHUB_REF === 'refs/heads/main') {
    const before = event.before;
    if (before && !/^0+$/.test(before)) {
      if (!/^[0-9a-f]{40}$/.test(before)) throw new Error('推送基线不是有效提交');
      git(['cat-file', '-e', `${before}^{commit}`]);
      const previous = git(['show', `${before}:package.json`], { optional: true });
      if (previous.status === 0) previousVersion = JSON.parse(previous.stdout).version;
    }
  }
  const plan = releasePlan({ eventName: process.env.GITHUB_EVENT_NAME, event, ref: process.env.GITHUB_REF, sha, version: pkg.version, previousVersion });
  if (plan.publish) {
    git(['merge-base', '--is-ancestor', sha, 'refs/remotes/origin/main']);
    releaseNotes(plan.version);
  }
  return plan;
}

export async function requestJson(url, { token, nullable = false, method = 'GET', body, request = fetch } = {}) {
  const response = await request(url, {
    method,
    headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30_000),
  });
  if (nullable && response.status === 404) return null;
  if (!response.ok) throw new Error(`${new URL(url).hostname} ${method} 返回 ${response.status}：${(await response.text()).slice(0, 1500)}`);
  if (response.status === 204) return null;
  return response.json();
}

export function assertPublishedIntegrity(metadata, packed) {
  if (metadata.name !== packed.name || metadata.version !== packed.version || metadata.dist?.integrity !== packed.integrity) {
    throw new Error('该 npm 版本已经存在，但内容与本次压缩包不一致；请递增版本，不能覆盖已发布版本');
  }
}

async function inspectTag(api, tag, sha) {
  const ref = await api(`/git/ref/tags/${encodeURIComponent(tag)}`, { nullable: true });
  if (!ref) return false;
  let object = ref.object;
  for (let depth = 0; object.type === 'tag' && depth < 5; depth += 1) object = (await api(`/git/tags/${object.sha}`)).object;
  if (object.type !== 'commit' || object.sha !== sha) throw new Error(`已有 ${tag} 没有指向本次验证的提交；不移动已有发布标签`);
  return true;
}

export async function findReleaseByTag(api, tag) {
  const published = await api(`/releases/tags/${encodeURIComponent(tag)}`, { nullable: true });
  if (published) return published;
  let match = null;
  for (let page = 1; ; page += 1) {
    const releases = await api(`/releases?per_page=100&page=${page}`);
    if (!Array.isArray(releases)) throw new Error('GitHub Release 列表响应无效');
    for (const release of releases.filter(item => item.tag_name === tag)) {
      if (match && match.id !== release.id) throw new Error(`存在多个 ${tag} Release，停止自动选择草稿`);
      match = release;
    }
    if (releases.length < 100) return match;
  }
}

export async function uploadAsset(api, release, file, contentType, { token = process.env.GITHUB_TOKEN, request = fetch } = {}) {
  const name = file.split(/[\\/]/).at(-1);
  const bytes = readFileSync(file);
  const digest = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
  const assets = await api(`/releases/${release.id}/assets?per_page=100`);
  const existing = assets.find(asset => asset.name === name);
  if (existing) {
    if (release.draft && existing.state === 'starter' && existing.size === 0) {
      await api(`/releases/assets/${existing.id}`, { method: 'DELETE' });
    } else {
      if (existing.state && existing.state !== 'uploaded') throw new Error(`已有发布附件尚未上传完成且不能自动清理：${name}`);
      if (existing.digest) {
        if (existing.digest !== digest) throw new Error(`已有发布附件内容不同：${name}`);
        return;
      }
      const response = await request(`${API}/repos/${REPOSITORY}/releases/assets/${existing.id}`, {
        headers: { Accept: 'application/octet-stream', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`无法核对已有发布附件：${name}（${response.status}）`);
      if (!Buffer.from(await response.arrayBuffer()).equals(bytes)) throw new Error(`已有发布附件内容不同：${name}`);
      return;
    }
  }
  const url = new URL(release.upload_url.replace(/\{.*$/, ''));
  if (url.origin !== 'https://uploads.github.com') throw new Error('GitHub 返回了非预期的上传目标');
  url.searchParams.set('name', name);
  const response = await request(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType }, body: bytes, signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`上传 ${name} 失败：${response.status}`);
}

export async function publish() {
  const plan = planFromEnvironment();
  if (!plan.publish) { console.log('版本没有变化，本次不发布。'); return; }
  const body = releaseNotes(plan.version);
  if (!process.env.GITHUB_TOKEN) throw new Error('发布任务缺少 GITHUB_TOKEN');
  const api = (path, options = {}) => requestJson(`${API}/repos/${REPOSITORY}${path}`, { token: process.env.GITHUB_TOKEN, ...options });
  const tagExists = await inspectTag(api, plan.tag, plan.sha);
  const existingRelease = await findReleaseByTag(api, plan.tag);
  const temporary = mkdtempSync(join(tmpdir(), 'skills-wta release '));
  try {
    const packed = packPackage(ROOT, temporary);
    const registryUrl = `${REGISTRY}/${encodeURIComponent(packed.name)}/${encodeURIComponent(packed.version)}`;
    let metadata = await requestJson(registryUrl, { nullable: true });
    async function inspectLatest(published) {
      if (plan.version.includes('-')) return { makeLatest: false };
      const npm = await requestJson(`${REGISTRY}/${encodeURIComponent(packed.name)}/latest`, { nullable: true });
      const github = await api('/releases/latest', { nullable: true });
      return latestPolicy({ version: plan.version, published, npmLatest: npm ? npm.version : null, githubLatest: github ? github.tag_name.replace(/^v/, '') : null });
    }
    if (metadata) {
      assertPublishedIntegrity(metadata, packed);
      await inspectLatest(true);
      console.log(`npm ${packed.name}@${packed.version} 已存在且完整性一致，继续核对 Release。`);
    } else {
      await inspectLatest(false);
      if (!process.env.NODE_AUTH_TOKEN && !process.env.ACTIONS_ID_TOKEN_REQUEST_URL) throw new Error('缺少 NPM_TOKEN 或已配置的 npm trusted publisher');
      const result = runNpm(['publish', packed.file, '--access', 'public', '--provenance', '--tag', plan.distTag, '--registry', REGISTRY, '--ignore-scripts'], { cwd: ROOT });
      console.log(result.stdout.trim());
      for (let attempt = 0; attempt < 8; attempt += 1) {
        metadata = await requestJson(registryUrl, { nullable: true });
        if (metadata) break;
        await new Promise(done => setTimeout(done, 1500));
      }
      if (!metadata) throw new Error('npm 命令已返回成功，但尚未从 registry 读回版本；可重跑本次发布核对');
      assertPublishedIntegrity(metadata, packed);
    }
    if (!tagExists) await api('/git/refs', { method: 'POST', body: { ref: `refs/tags/${plan.tag}`, sha: plan.sha } });
    let release = existingRelease;
    if (!release) {
      release = await api('/releases', { method: 'POST', body: { tag_name: plan.tag, target_commitish: plan.sha, name: plan.tag, body, draft: true, prerelease: plan.version.includes('-') } });
    }
    const checksums = join(temporary, 'SHA256SUMS');
    writeFileSync(checksums, `${packed.sha256}  ${packed.filename}\n`);
    await uploadAsset(api, release, packed.file, 'application/gzip');
    await uploadAsset(api, release, checksums, 'text/plain');
    if (release.draft) {
      const { makeLatest } = await inspectLatest(true);
      release = await api(`/releases/${release.id}`, { method: 'PATCH', body: { draft: false, make_latest: String(makeLatest) } });
    }
    const summary = `## 已发布 ${plan.tag}\n\n- npm：https://www.npmjs.com/package/${packed.name}/v/${plan.version}\n- Release：${release.html_url}\n- 提交：${plan.sha}\n- SHA-256：\`${packed.sha256}\`\n`;
    console.log(summary);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv[2] === 'plan') {
      const plan = planFromEnvironment();
      for (const [key, value] of Object.entries(plan)) {
        console.log(`${key}=${value}`);
        if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
      }
    } else if (process.argv[2] === 'publish') await publish();
    else throw new Error('用法：node scripts/release.mjs plan|publish；发布操作仅在 GitHub Actions 的指定事件中执行。');
  } catch (error) {
    let message = error.message;
    for (const secret of [process.env.NODE_AUTH_TOKEN, process.env.GITHUB_TOKEN].filter(Boolean)) message = message.split(secret).join('[redacted]');
    console.error(message);
    process.exitCode = 1;
  }
}
