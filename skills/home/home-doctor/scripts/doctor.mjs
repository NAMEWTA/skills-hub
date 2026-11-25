#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const inside = (root, target) => { const relative = path.relative(root, target); return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative)); };
const sha = text => `sha256:${createHash('sha256').update(text).digest('hex')}`;
const stat = filename => { try { return fs.lstatSync(filename); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
const owner = relative => /(?:^|\/)history(?:\/|$)/u.test(relative) ? 'home-history' : /(?:^|\/)(?:notes|inbox)(?:\/|$)/u.test(relative) || relative.endsWith('exclusions.md') ? 'home-knowledge' : relative.endsWith('relations.md') ? 'home-map' : relative.includes('/coordination/') ? 'home-workflow' : 'home-setup';

function links(markdown) {
  const output = [];
  let fence = null;
  for (let line of markdown.split(/\r?\n/u)) {
    const found = line.match(/^\s{0,3}(`{3,}|~{3,})/u);
    if (found) { if (!fence) fence = found[1][0]; else if (fence === found[1][0]) fence = null; continue; }
    if (fence) continue;
    line = line.replace(/(`+)[\s\S]*?\1/gu, '');
    for (const match of line.matchAll(/!?\[[^\]\n]*\]\((<[^>]*>|[^)\n]*)\S*\)/gu)) {
      let destination = match[1].trim();
      if (destination.startsWith('<') && destination.endsWith('>')) destination = destination.slice(1, -1);
      else destination = destination.split(/\s+["']/u, 1)[0];
      output.push(destination);
    }
    const definition = line.match(/^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/u);
    if (definition) output.push(definition[1].replace(/^<|>$/gu, ''));
  }
  return output;
}

export function diagnoseHome(inputHome, { requiredSkills = [], maxFiles = 2000, maxBytes = 8 * 1024 * 1024, maxDepth = 10 } = {}) {
  const requestedRoot = path.resolve(inputHome);
  if (fs.lstatSync(requestedRoot).isSymbolicLink()) throw new Error('Home 根不能是符号链接；请指定真实协调仓库。');
  const homeRoot = fs.realpathSync(requestedRoot);
  if (!fs.statSync(homeRoot).isDirectory()) throw new Error('Home 根必须是已有目录。');
  for (const value of [maxFiles, maxBytes, maxDepth]) if (!Number.isSafeInteger(value) || value < 1) throw new Error('检查预算必须是正整数。');
  const domainRoot = path.join(homeRoot, '.agents/home');
  const findings = [], checked = { markdownFiles: 0, localLinks: 0, externalPointers: 0, requestedSkills: requiredSkills.length, bytes: 0, directories: 0 };
  let complete = true;
  const add = (severity, code, target, method, message) => findings.push({ severity, code, path: path.relative(homeRoot, target).split(path.sep).join('/'), owner: method, message });
  const readable = (filename, method) => {
    const entry = stat(filename);
    if (!entry) return null;
    if (!entry.isFile() || entry.isSymbolicLink()) { add('warning', 'NONREGULAR_FILE', filename, method, '只读诊断不跟随链接或非普通资料文件；请核对实际 owner。'); return null; }
    if (entry.size > 1024 * 1024) { complete = false; add('warning', 'NOT_INSPECTED_SIZE', filename, method, '超过本次结构检查的 1 MiB 单文件范围；未检查正文链接，不代表没有问题。'); return null; }
    return fs.readFileSync(filename, 'utf8');
  };
  let registry = null;
  const registryFile = path.join(domainRoot, 'repos.json');
  for (const parent of [path.join(homeRoot, '.agents'), domainRoot]) {
    const entry = stat(parent);
    if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) {
      add('error', 'UNSAFE_HOME_PARENT', parent, 'home-setup', 'Home 资料父目录不是同仓普通目录；没有沿该入口读取。');
      return { status: 'issues', homeRoot, checked, complete: false, findings, scope: '仅 Home 结构；未读取项目知识或核实 Git 身份/Agent 就绪。' };
    }
  }
  if (!stat(domainRoot)) add('info', 'HOME_NOT_INITIALIZED', domainRoot, 'home-setup', '尚未建立 Home 业务资料；安装或单选包本身不要求预建登记。');
  const registryText = readable(registryFile, 'home-setup');
  if (registryText !== null) {
    try {
      registry = JSON.parse(registryText);
      if (![1, 2].includes(registry?.formatVersion) || !Array.isArray(registry.repos)) throw new Error('version');
      const ids = registry.repos.map(repo => repo.id);
      if (ids.some(id => typeof id !== 'string') || new Set(ids).size !== ids.length) add('error', 'REGISTRY_IDS', registryFile, 'home-setup', '登记 ID 缺失或重复；由 owner 运行完整 schema 校验。');
    } catch { registry = null; add('error', 'REGISTRY_FORMAT', registryFile, 'home-setup', '登记 JSON 或版本无效，未推测迁移。'); }
  }
  const localFile = path.join(domainRoot, 'local.json');
  const localText = readable(localFile, 'home-setup');
  if (localText !== null) {
    try {
      const local = JSON.parse(localText);
      if (local.formatVersion !== 1 || !local.paths || typeof local.paths !== 'object' || Array.isArray(local.paths) || Object.keys(local).some(key => !['formatVersion', 'paths'].includes(key))) throw new Error('shape');
      const ids = new Set(registry?.repos.map(repo => repo.id) || []);
      if (Object.entries(local.paths).some(([id, value]) => !ids.has(id) || typeof value !== 'string' || !value || /[\x00-\x1f\x7f]/u.test(value))) throw new Error('paths');
    } catch { add('error', 'LOCAL_OVERRIDE_FORMAT', localFile, 'home-setup', '本机覆盖只允许已登记 ID → 路径；不得混入身份、配置或派遣方式。'); }
  }
  const mapFile = path.join(domainRoot, 'repos.md');
  const mapText = readable(mapFile, 'home-setup');
  if (mapText !== null) {
    if (!mapText.startsWith('<!-- home-setup:generated repos map v1 -->')) add('warning', 'MAP_UNMANAGED', mapFile, 'home-setup', '已有手写地图；保留原件，由 setup 按授权接入，不能直接覆盖。');
    else if (registryText === null || !mapText.includes(`<!-- registry-revision: ${sha(registryText)} -->`)) add('warning', 'MAP_SOURCE_STALE', mapFile, 'home-setup', '地图标记与当前登记真源不同；核对后重建，不刷新项目事实时间。');
  }
  const scan = (directory, depth = 0) => {
    if (!complete) return;
    if (depth > maxDepth || ++checked.directories > 1000) { complete = false; add('warning', 'SCAN_LIMIT', directory, owner(path.relative(homeRoot, directory).split(path.sep).join('/')), '目录范围超过检查预算；未扫描部分仍需按实际问题查询。'); return; }
    for (const name of fs.readdirSync(directory).sort()) {
      if (!complete) break;
      const filename = path.join(directory, name);
      const entry = fs.lstatSync(filename);
      const relative = path.relative(homeRoot, filename).split(path.sep).join('/');
      const method = owner(relative);
      if (entry.isSymbolicLink()) { add('warning', 'LINKED_HOME_DATA', filename, method, '未递归读取链接目标；先确认是否仍是同仓权威资料。'); continue; }
      if (entry.isDirectory()) { scan(filename, depth + 1); continue; }
      if (!entry.isFile() || !name.endsWith('.md')) continue;
      if (checked.markdownFiles >= maxFiles || checked.bytes + entry.size > maxBytes) { complete = false; add('warning', 'SCAN_LIMIT', filename, method, '文件或总读取量超过检查预算；未扫描部分不视为健康。'); break; }
      const content = readable(filename, method);
      if (content === null) continue;
      checked.markdownFiles += 1;
      checked.bytes += Buffer.byteLength(content);
      for (const destination of links(content)) {
        if (!destination || destination.startsWith('#') || /^[a-z][a-z0-9+.-]*:/iu.test(destination) || destination.startsWith('//')) { checked.externalPointers += 1; continue; }
        let pathname;
        try { pathname = decodeURIComponent(destination.split(/[?#]/u, 1)[0]); }
        catch { add('warning', 'INVALID_LINK', filename, method, '相对链接编码无效。'); continue; }
        if (!pathname) continue;
        const target = path.resolve(path.dirname(filename), pathname);
        if (!inside(homeRoot, target)) { checked.externalPointers += 1; continue; }
        checked.localLinks += 1;
        if (!stat(target)) { add('warning', 'BROKEN_LINK', filename, method, `Home 内相对链接不可达：${pathname}`); continue; }
        let real;
        try { real = fs.realpathSync(target); } catch { add('warning', 'BROKEN_LINK_TARGET', filename, method, `链接真实目标不可达：${pathname}`); continue; }
        if (!inside(homeRoot, real)) add('warning', 'LINK_LEAVES_HOME', filename, method, `链接经别名离开 Home：${pathname}；未读取目标正文。`);
      }
    }
  };
  if (stat(domainRoot)?.isDirectory()) scan(domainRoot);
  for (const name of requiredSkills) {
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/u.test(name)) throw new Error('所需技能名称无效。');
    const canonical = path.join(homeRoot, '.agents/skills', name);
    const skillsParent = stat(path.join(homeRoot, '.agents/skills'));
    if (skillsParent && (!skillsParent.isDirectory() || skillsParent.isSymbolicLink())) {
      add('error', 'SKILL_PARENT_CONFLICT', path.dirname(canonical), '用户所选安装方法', '技能父目录不是同仓普通目录；不沿链接借用其他仓库技能。');
      continue;
    }
    const canonicalEntry = stat(canonical);
    const skillEntry = canonicalEntry?.isDirectory() && !canonicalEntry.isSymbolicLink() ? stat(path.join(canonical, 'SKILL.md')) : null;
    if (!canonicalEntry?.isDirectory() || canonicalEntry.isSymbolicLink() || !skillEntry?.isFile() || skillEntry.isSymbolicLink()) {
      add('error', 'REQUIRED_SKILL_MISSING', canonical, '用户所选安装方法', '本次明确需要的同仓技能本体缺失或不是普通目录；不跨仓借包。');
      continue;
    }
    const alias = path.join(homeRoot, '.claude/skills', name);
    let parentConflict = false;
    for (const relative of ['.claude', '.claude/skills']) {
      const parent = stat(path.join(homeRoot, relative));
      if (parent && (!parent.isDirectory() || parent.isSymbolicLink())) { parentConflict = true; break; }
    }
    const aliasEntry = parentConflict ? null : stat(alias);
    if (parentConflict || (aliasEntry && !aliasEntry.isSymbolicLink())) add('error', 'SKILL_ALIAS_CONFLICT', alias, '用户所选安装方法', '技能链接或父目录类型冲突；保留原内容，不用 --replace 绕过。');
    else if (!aliasEntry) add('warning', 'SKILL_ALIAS_MISSING', alias, '用户所选安装方法', '本次所需技能缺同仓发现别名；按实际安装方法补链，不复制正文。');
    else {
      try { if (fs.realpathSync(alias) !== fs.realpathSync(canonical)) add('error', 'SKILL_ALIAS_TARGET', alias, '用户所选安装方法', '别名没有指向当前同仓技能本体。'); }
      catch { add('error', 'SKILL_ALIAS_BROKEN', alias, '用户所选安装方法', '技能入口断链；核对原始目标，不当空路径覆盖。'); }
    }
  }
  return {
    status: findings.some(item => item.severity === 'error') ? 'issues' : findings.some(item => item.severity === 'warning') ? 'attention' : 'clear-within-scope',
    homeRoot, checked, complete, findings,
    scope: '仅 Home 结构、生成地图来源标记与明确要求的本地技能入口；没有读取项目知识、检验知识语义、核实 Git 身份、验证 CLI 发现或 Agent 就绪。',
    next: '登记/地图完整校验交 home-setup，实际项目身份交 home-route；知识、历史和派遣恢复分别交原 owner。',
  };
}

export function main(argv = process.argv.slice(2)) {
  try {
    if (argv.includes('--help')) { console.log('用法：node doctor.mjs --home HOME [--require-skill 准确名称 ...]\n默认只读诊断；不扫描项目知识，不安装、修复、启动或删除资料。'); return 0; }
    let home;
    const requiredSkills = [];
    for (let index = 0; index < argv.length; index += 2) {
      if (!argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('参数缺值。');
      if (argv[index] === '--home' && !home) home = argv[index + 1];
      else if (argv[index] === '--require-skill') requiredSkills.push(argv[index + 1]);
      else throw new Error(`未知或重复参数：${argv[index]}`);
    }
    if (!home) throw new Error('需要明确 --home，不从 cwd 猜测。');
    const result = diagnoseHome(home, { requiredSkills: [...new Set(requiredSkills)] });
    console.log(JSON.stringify(result, null, 2));
    return result.findings.some(item => item.severity === 'error') ? 1 : 0;
  } catch (error) { console.error(JSON.stringify({ status: 'failed', message: error.message })); return 2; }
}

function isDirectInvocation() {
  if (!process.argv[1]) return false;
  try { return fs.realpathSync.native(process.argv[1]) === fs.realpathSync.native(fileURLToPath(import.meta.url)); }
  catch { return false; }
}

if (isDirectInvocation()) process.exitCode = main();
