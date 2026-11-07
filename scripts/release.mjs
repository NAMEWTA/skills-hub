#!/usr/bin/env node
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { ROOT, packPackage } from './check-package.mjs';
import { runNpm } from './npm-cli.mjs';

const REPOSITORY = 'NAMEWTA/skills-hub';
const PACKAGE_NAME = '@namewta/skills-hub';
const REGISTRY = 'https://registry.npmjs.org';
const API = 'https://api.github.com';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STAGE_NOTICE_START = '<!-- skills-hub:npm-stage:start -->';
const STAGE_NOTICE_END = '<!-- skills-hub:npm-stage:end -->';
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

export function releaseNotes(version, root = ROOT) {
  const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
  const section = changelog.split(`## ${version} —`)[1]?.split('\n## ')[0];
  if (!section || section.indexOf('\n') < 0) throw new Error('CHANGELOG.md 缺少当前版本说明');
  return section.slice(section.indexOf('\n')).trim() + `\n\n## 安装\n\n\`npx ${PACKAGE_NAME}@${version} install --domain dev\`\n\nNode.js >=22.14.0；安装目标为当前项目的 \`.agents/skills/\`。项目持久化按领域分离：\`.agents/dev/\`、\`.agents/system/\`。\n\nnpm 包与本发布附件来自同一压缩包；校验和见 SHA256SUMS。`;
}

function git(args, { optional = false } = {}) {
  const result = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0 && !optional) throw new Error(`Git 检查失败：${result.stderr}`);
  return result;
}

export function packageInfo(root = ROOT) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  if (!validVersion(pkg.version)) throw new Error(`发布版本不是受支持的语义版本：${pkg.version}`);
  if (pkg.name !== PACKAGE_NAME || lock.name !== pkg.name || lock.version !== pkg.version || lock.packages?.['']?.name !== pkg.name || lock.packages?.['']?.version !== pkg.version) {
    throw new Error('package.json 与 package-lock.json 的名称或版本不一致');
  }
  if (pkg.repository?.type !== 'git' || pkg.repository?.url !== `git+https://github.com/${REPOSITORY}.git`) throw new Error('包的源码仓库必须与指定发布仓库一致');
  return pkg;
}

export function releasePlan({ eventName, event, ref, sha, version, previousVersion, retryVersion }) {
  if (!validVersion(version)) throw new Error('无效发布版本');
  // 旧 v0.0.1 属于原 skills-wta 包；为新 scoped 包保留独立首次发布标签。
  const tag = version === '0.0.1' ? 'skills-hub-v0.0.1' : `v${version}`;
  let publish = false;
  if (eventName === 'push' && ref === 'refs/heads/main') {
    if (event.after && event.after !== sha) throw new Error('推送事件与检出提交不一致');
    if (retryVersion !== undefined && retryVersion !== version) throw new Error('Release-Retry 必须是当前完整版本号');
    publish = previousVersion !== version || retryVersion === version;
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
  let retryVersion;
  if (process.env.GITHUB_EVENT_NAME === 'push' && process.env.GITHUB_REF === 'refs/heads/main') {
    const trailers = git(['show', '-s', '--format=%(trailers:key=Release-Retry,valueonly)', sha]).stdout.trim();
    if (trailers) retryVersion = trailers;
    const before = event.before;
    if (before && !/^0+$/.test(before)) {
      if (!/^[0-9a-f]{40}$/.test(before)) throw new Error('推送基线不是有效提交');
      git(['cat-file', '-e', `${before}^{commit}`]);
      const previous = git(['show', `${before}:package.json`], { optional: true });
      if (previous.status === 0) previousVersion = JSON.parse(previous.stdout).version;
    }
  }
  const plan = releasePlan({ eventName: process.env.GITHUB_EVENT_NAME, event, ref: process.env.GITHUB_REF, sha, version: pkg.version, previousVersion, retryVersion });
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

export function npmMetadataUrl(name, versionOrTag) {
  return `${REGISTRY}/${encodeURIComponent(name)}/${encodeURIComponent(versionOrTag)}`;
}

export async function readLatestPolicy(packed, api, { published = false, request = fetch } = {}) {
  if (packed.version.includes('-')) return { makeLatest: false };
  const npm = await requestJson(npmMetadataUrl(packed.name, 'latest'), { nullable: true, request });
  const github = await api('/releases/latest', { nullable: true });
  return latestPolicy({ version: packed.version, published, npmLatest: npm ? npm.version : null, githubLatest: github ? github.tag_name.replace(/^(?:skills-hub-v|v)/, '') : null });
}

export function assertPublishedIntegrity(metadata, packed) {
  if (metadata.name !== packed.name || metadata.version !== packed.version || metadata.dist?.integrity !== packed.integrity) {
    throw new Error('该 npm 版本已经存在，但内容与本次压缩包不一致；请递增版本，不能覆盖已发布版本');
  }
}

export async function findVerifiedStage(packed, { token, request = fetch, expectedTag = packed.version.includes('-') ? 'next' : 'latest' } = {}) {
  if (!token) throw new Error('缺少 NODE_AUTH_TOKEN，无法只读核对 npm stage；OIDC 短期发布凭据不能替代 stage 查询凭据');
  async function read(route, binary = false) {
    let response;
    try {
      response = await request(`${REGISTRY}${route}`, {
        method: 'GET', redirect: 'error',
        headers: { Authorization: `Bearer ${token}`, Accept: binary ? 'application/octet-stream' : 'application/json' },
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error) { throw new Error(`npm stage 只读请求失败 ${route}：${error.message}`); }
    if (!response.ok) throw new Error(`npm stage 只读请求 ${route} 返回 ${response.status}；无法确认暂存内容，停止发布，不将权限错误当作无 stage`);
    return binary ? Buffer.from(await response.arrayBuffer()) : response.json();
  }
  const matches = [];
  let received = 0;
  for (let page = 0; ; page += 1) {
    const query = new URLSearchParams({ page: String(page), perPage: '100', package: packed.name });
    const result = await read(`/-/stage?${query}`);
    if (!Array.isArray(result.items) || !Number.isSafeInteger(result.total) || result.total < 0) throw new Error('npm stage 列表不是预期的 {items,page,perPage,total} 响应');
    matches.push(...result.items.filter(item => item?.packageName === packed.name && item.version === packed.version));
    if (matches.length > 1) throw new Error(`发现多个 ${packed.name}@${packed.version} stage，停止自动选择`);
    received += result.items.length;
    if (received >= result.total || result.items.length < 100) break;
  }
  if (!matches.length) return null;
  const listed = matches[0];
  if (!UUID.test(listed.id ?? '')) throw new Error('npm stage 返回了无效的 UUID');
  const stage = await read(`/-/stage/${listed.id}`);
  if (stage.id !== listed.id || stage.packageName !== packed.name || stage.version !== packed.version || stage.tag !== expectedTag) {
    throw new Error('npm stage 详情的 UUID、包名、版本或不可变 tag 与本次发布不符');
  }
  if (!/^[0-9a-f]{40}$/i.test(stage.shasum ?? '') || stage.shasum !== listed.shasum) throw new Error('npm stage 的 SHA-1 shasum 缺失或列表与详情不一致');
  const bytes = await read(`/-/stage/${stage.id}/tarball`, true);
  const sha1 = createHash('sha1').update(bytes).digest('hex');
  const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
  if (sha1 !== stage.shasum.toLowerCase() || integrity !== packed.integrity || !bytes.equals(readFileSync(packed.file))) {
    throw new Error(`npm stage ${stage.id} 的 SHA-1、SHA-512 或原始字节与本次包不符；不批准、不重传、不覆盖`);
  }
  return stage;
}

export async function ensureNpmPublication(packed, { token, request = fetch, publishPackage, beforePublish = async () => {}, wait = milliseconds => new Promise(done => setTimeout(done, milliseconds)), output = console.log } = {}) {
  const url = npmMetadataUrl(packed.name, packed.version);
  async function inspect() {
    const metadata = await requestJson(url, { nullable: true, request });
    if (metadata) { assertPublishedIntegrity(metadata, packed); return { published: true, stage: null }; }
    const stage = token ? await findVerifiedStage(packed, { token, request }) : null;
    return stage ? { published: false, stage } : null;
  }
  const existing = await inspect();
  if (existing) return existing;
  if (!token) output('没有 NODE_AUTH_TOKEN，无法只读查询 npm stage；仍可尝试已配置的 OIDC 发布，但无法自动识别待审批的暂存版本。');
  await beforePublish();
  let publishError;
  try { await publishPackage(); } catch (error) { publishError = error; }
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await inspect();
    if (result) return result;
    if (publishError) throw publishError;
    if (attempt === 0) await wait(1500);
  }
  throw new Error(`npm 命令已返回成功，但公开版本仍不可读${token ? '，也未找到可核验的 stage' : '；缺少 NODE_AUTH_TOKEN，无法只读识别是否进入 stage'}；保留当前版本并核对发布状态`);
}

export function stageNotice(body, stage = null) {
  const text = body ?? '';
  const start = text.indexOf(STAGE_NOTICE_START);
  const end = text.indexOf(STAGE_NOTICE_END);
  if ((start < 0) !== (end < 0) || (start >= 0 && (end < start || text.indexOf(STAGE_NOTICE_START, start + 1) >= 0 || text.indexOf(STAGE_NOTICE_END, end + 1) >= 0))) {
    throw new Error('Release 的自动 npm stage 标记不完整或重复，保留原文并停止更新');
  }
  let notice = '';
  if (stage) {
    if (!UUID.test(stage.id ?? '')) throw new Error('无效 npm stage UUID');
    const status = JSON.stringify(stage.status ?? null).replaceAll('`', '\\`');
    notice = `${STAGE_NOTICE_START}\n## npm 尚未公开：等待维护者核对与 2FA 批准\n\n本草稿附件已与 npm stage 原始 tarball 核对 SHA-1、完整 SHA-512 和全部字节。\n\n- 包：\`${stage.packageName}@${stage.version}\`\n- Stage UUID：\`${stage.id}\`\n- Registry 原始 status：\`${status}\`（不据此推断已公开）\n\n维护者本人使用支持 stage 的 npm CLI（11.15.0+），先审查再完成 2FA：\n\n\`\`\`sh\nnpm stage view ${stage.id} --registry=https://registry.npmjs.org/\nnpm stage approve ${stage.id} --registry=https://registry.npmjs.org/\n\`\`\`\n\n也可在 npm 网站的 Staged Packages 标签页审查。批准完成后重跑同一提交的发布任务；公开版本完整性核对通过后，本草稿才会正式发布。不要重复 npm publish、覆盖版本或绕过 2FA。参见 [npm 官方 staged publishing 说明](https://docs.npmjs.com/staged-publishing/)。\n${STAGE_NOTICE_END}`;
  }
  if (start < 0) return stage ? `${text}\n\n${notice}` : text;
  return `${text.slice(0, start)}${notice}${text.slice(end + STAGE_NOTICE_END.length)}`;
}

export async function finalizeRelease(api, release, { stage = null, makeLatest = false } = {}) {
  if (stage && !release.draft) throw new Error(`npm stage ${stage.id} 尚未公开，但 GitHub Release 已被公开；保持现状并由维护者核对`);
  const body = stageNotice(release.body, stage);
  const changes = body !== (release.body ?? '') ? { body } : {};
  if (!stage && release.draft) Object.assign(changes, { draft: false, make_latest: String(makeLatest) });
  return Object.keys(changes).length ? api(`/releases/${release.id}`, { method: 'PATCH', body: changes }) : release;
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
  const temporary = mkdtempSync(join(tmpdir(), 'skills-hub release '));
  try {
    const packed = packPackage(ROOT, temporary);
    const inspectLatest = published => readLatestPolicy(packed, api, { published });
    const publication = await ensureNpmPublication(packed, {
      token: process.env.NODE_AUTH_TOKEN,
      beforePublish: () => inspectLatest(false),
      publishPackage: () => {
        if (!process.env.NODE_AUTH_TOKEN && !process.env.ACTIONS_ID_TOKEN_REQUEST_URL) throw new Error('缺少 NPM_TOKEN 或已配置的 npm trusted publisher');
        const result = runNpm(['publish', packed.file, '--access', 'public', '--provenance', '--tag', plan.distTag, '--registry', REGISTRY, '--ignore-scripts'], { cwd: ROOT });
        console.log(result.stdout.trim());
      },
    });
    const { stage } = publication;
    await inspectLatest(publication.published);
    if (stage && existingRelease && !existingRelease.draft) throw new Error(`npm stage ${stage.id} 尚未公开，已有 GitHub Release 也不应被当作 npm 发布成功；请由维护者核对`);
    if (!tagExists) await api('/git/refs', { method: 'POST', body: { ref: `refs/tags/${plan.tag}`, sha: plan.sha } });
    let release = existingRelease;
    if (!release) {
      release = await api('/releases', { method: 'POST', body: { tag_name: plan.tag, target_commitish: plan.sha, name: plan.tag, body: stageNotice(body, stage), draft: true, prerelease: plan.version.includes('-') } });
    }
    const checksums = join(temporary, 'SHA256SUMS');
    writeFileSync(checksums, `${packed.sha256}  ${packed.filename}\n`);
    await uploadAsset(api, release, packed.file, 'application/gzip');
    await uploadAsset(api, release, checksums, 'text/plain');
    const { makeLatest } = stage ? { makeLatest: false } : await inspectLatest(true);
    release = await finalizeRelease(api, release, { stage, makeLatest });
    if (stage) {
      const summary = `## ${plan.tag} 已准备审查，npm 尚待维护者 2FA 批准\n\n- 包：\`${packed.name}@${packed.version}\`\n- Stage UUID：\`${stage.id}\`\n- GitHub Release 草稿：${release.html_url}\n- 提交：${plan.sha}\n- SHA-1：\`${stage.shasum}\`\n- SHA-512：\`${packed.integrity}\`\n- SHA-256：\`${packed.sha256}\`\n\n已逐字节核对 npm stage 与本草稿附件。维护者本人先运行 \`npm stage view ${stage.id}\` 审查，再运行 \`npm stage approve ${stage.id}\` 并完成 2FA；或在 npm 网站 Staged Packages 页面操作。批准后重跑同一提交，任务将读取公开版本并核对完整性后完成 Release。当前任务以非零状态结束，表示尚未正式发布。\n`;
      console.log(summary);
      if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
      throw new Error(`npm stage ${stage.id} 已核验，等待维护者本人完成 2FA 批准；GitHub Release 保持草稿：${release.html_url}`);
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
