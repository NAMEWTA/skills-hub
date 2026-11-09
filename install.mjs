#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { planPersistence, applyPersistence, rollbackPersistence } from './scripts/init-persistence.mjs';

export const repositoryRoot = path.dirname(fileURLToPath(import.meta.url));
export const licenseBundleFiles = Object.freeze([
  'PROJECT-LICENSE.txt', 'THIRD_PARTY_NOTICES.txt', 'deepseek-harness-MIT.txt',
  'mattpocock-skills-MIT.txt', 'pstack-MIT.txt', 'ai-design-skills-MIT.txt',
  'Speculo-MIT.txt', 'taste-skill-MIT.txt', 'humanlayer-Apache-2.0.txt',
  'humanlayer-NOTICE.txt', 'herdr-Apache-2.0.txt',
]);
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const utf8 = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

export class InstallError extends Error {}

export function isMain(url) {
  if (!process.argv[1]) return false;
  try { return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(url)); }
  catch { return false; }
}

export function readUtf8(filename, fsOps = fs) {
  return utf8.decode(fsOps.readFileSync(filename));
}

export function isWithin(target, boundary) {
  const relative = path.relative(path.resolve(boundary), path.resolve(target));
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

export function regularFiles(directory, fsOps = fs) {
  const root = fsOps.lstatSync(directory, { throwIfNoEntry: false });
  if (!root?.isDirectory() || root.isSymbolicLink()) {
    throw new InstallError(`Expected a real directory: ${directory}`);
  }
  const files = [];
  function visit(parent) {
    for (const name of fsOps.readdirSync(parent).sort()) {
      const entry = path.join(parent, name);
      const stat = fsOps.lstatSync(entry);
      if (stat.isSymbolicLink()) throw new InstallError(`Symlinks are not supported: ${entry}`);
      if (stat.isFile()) files.push(entry);
      else if (stat.isDirectory()) visit(entry);
      else throw new InstallError(`Unsupported filesystem entry: ${entry}`);
    }
  }
  visit(directory);
  return files.sort();
}

export function treeDigest(directory, fsOps = fs) {
  const digest = createHash('sha256');
  const length = (value) => { const bytes = Buffer.alloc(8); bytes.writeBigUInt64BE(BigInt(value)); return bytes; };
  for (const filename of regularFiles(directory, fsOps)) {
    const relative = Buffer.from(path.relative(directory, filename).split(path.sep).join('/'));
    const content = fsOps.readFileSync(filename);
    digest.update(length(relative.length)).update(relative).update(length(content.length)).update(content);
    if (process.platform !== 'win32') {
      const mode = Buffer.alloc(2);
      mode.writeUInt16BE(fsOps.statSync(filename).mode & 0o111);
      digest.update(mode);
    }
  }
  return digest.digest('hex');
}

export function select(skills, domains = [], names = [], allSkills = false) {
  const knownDomains = new Set(skills.map((skill) => skill.domain));
  const knownNames = new Set(skills.map((skill) => skill.name));
  const unknown = new Set([...domains.filter((value) => !knownDomains.has(value)), ...names.filter((value) => !knownNames.has(value))]);
  if (unknown.size) throw new InstallError(`Unknown selection: ${[...unknown].sort().join(', ')}. Run 'list'.`);
  return skills.filter((skill) => allSkills || domains.includes(skill.domain) || names.includes(skill.name));
}

export function createInstaller({ repository = repositoryRoot, fsOps = fs } = {}) {
  const skillRoot = path.join(repository, 'skills');
  const licenseRoot = path.join(repository, 'licenses');
  const exists = (filename) => fsOps.lstatSync(filename, { throwIfNoEntry: false });

  function catalog() {
    const skills = [];
    const seen = new Set();
    const rootStat = exists(skillRoot);
    if (rootStat?.isSymbolicLink()) throw new InstallError(`Symlinked source directory: ${skillRoot}`);
    if (!rootStat?.isDirectory()) throw new InstallError(`No skills found in ${skillRoot}`);
    for (const domain of fsOps.readdirSync(skillRoot).sort()) {
      const domainPath = path.join(skillRoot, domain);
      const domainStat = exists(domainPath);
      if (domainStat.isSymbolicLink()) throw new InstallError(`Symlinked source directory: ${domainPath}`);
      if (!domainStat.isDirectory()) continue;
      for (const name of fsOps.readdirSync(domainPath).sort()) {
        const source = path.join(domainPath, name);
        const sourceStat = exists(source);
        if (sourceStat.isSymbolicLink()) throw new InstallError(`Symlinks are not supported: ${source}`);
        if (!sourceStat.isDirectory()) continue;
        const manifest = path.join(source, 'SKILL.md');
        if (!exists(manifest)) continue;
        if (!slug.test(domain) || !slug.test(name)) throw new InstallError(`Invalid domain or skill name: ${domain}/${name}`);
        if (name.length > 64 || !name.startsWith(`${domain}-`)) {
          throw new InstallError(`Skill must be named ${domain}-xxx (max 64 characters): ${name}`);
        }
        regularFiles(source, fsOps);
        const header = readUtf8(manifest, fsOps).match(frontmatterPattern);
        if (!header) throw new InstallError(`Missing frontmatter: ${manifest}`);
        const declared = header[1].match(/^name:\s*([^\r\n]+)/m)?.[1].trim().replace(/^["']+|["']+$/g, '');
        if (declared !== name) throw new InstallError(`Frontmatter name must equal directory name: ${manifest}`);
        if (seen.has(name)) throw new InstallError(`Duplicate install name: ${name}`);
        seen.add(name);
        const description = header[1].match(/^description:\s*([^\r\n]+)/m)?.[1].trim().replace(/^["']|["']$/g, '') ?? '';
        skills.push({ domain, name, source, description });
      }
    }
    if (!skills.length) throw new InstallError(`No skills found in ${skillRoot}`);
    return skills;
  }

  function checkDirectory(filename) {
    const stat = exists(filename);
    if (stat && (stat.isSymbolicLink() || !stat.isDirectory())) {
      throw new InstallError(`Refusing a symlink or non-directory destination: ${filename}`);
    }
  }

  function plan(skills, project, replace = true) {
    const actualProject = fsOps.realpathSync(project);
    for (const source of [skillRoot, licenseRoot]) {
      if (exists(source) && isWithin(actualProject, fsOps.realpathSync(source))) {
        throw new InstallError("Run from the target project, outside this repository's source skills and licenses directories.");
      }
    }
    const agents = path.join(project, '.agents');
    const target = path.join(agents, 'skills');
    for (const filename of [agents, target, path.join(agents, '.skills-hub-backups')]) checkDirectory(filename);
    const actions = [];
    const conflicts = [];
    const packages = skills.map((skill) => ({ source: skill.source, name: skill.name, destination: path.join(target, skill.name) }));
    for (const item of packages) {
      checkDirectory(item.destination);
      let kind;
      if (!exists(item.destination)) kind = 'install';
      else if (treeDigest(item.source, fsOps) === treeDigest(item.destination, fsOps)) kind = 'unchanged';
      else if (replace) kind = 'replace';
      else { conflicts.push(item.name); continue; }
      actions.push({ ...item, kind });
    }
    if (conflicts.length) {
      throw new InstallError(`Existing packages differ: ${conflicts.join(', ')}. No skills were changed. Inspect them first; --replace saves backups before replacement.`);
    }
    planPersistence(skills, project, fsOps);
    return actions;
  }

  function persistencePlan(skills, project) { return planPersistence(skills, project, fsOps); }

  function apply(skills, project, replace = true) {
    let actions = plan(skills, project, replace);
    let persistence = persistencePlan(skills, project);
    if (actions.every((action) => action.kind === 'unchanged') && persistence.every(item => item.action === 'preserve')) {
      return { actions, backup: null, persistence };
    }
    const agents = path.join(project, '.agents');
    fsOps.mkdirSync(agents, { recursive: true });
    const locks = [];
    try {
      // 先取得旧版共用锁，使改名前后的安装器不会同时写入 .agents/skills。
      for (const name of ['.skills-wta-install.lock', '.skills-hub-install.lock']) {
        const lock = path.join(agents, name);
        try { fsOps.mkdirSync(lock); }
        catch (error) {
          if (error.code !== 'EEXIST') throw error;
          throw new InstallError(`An installer lock exists: ${lock}. Check for a running installer before removing a stale lock.`);
        }
        locks.push(lock);
      }
    } catch (error) {
      for (const lock of locks.reverse()) fsOps.rmdirSync(lock);
      throw error;
    }
    let staging = null;
    let backup = null;
    const completed = [];
    const persistenceJournal = [];
    try {
      actions = plan(skills, project, replace);
      persistence = persistencePlan(skills, project);
      staging = fsOps.mkdtempSync(path.join(agents, '.skills-hub-stage-'));
      for (const action of actions) {
        if (action.kind !== 'unchanged') {
          fsOps.cpSync(action.source, path.join(staging, action.name), { recursive: true, errorOnExist: true, force: false });
        }
      }
      fsOps.mkdirSync(path.join(agents, 'skills'), { recursive: true });
      if (actions.some((action) => action.kind === 'replace')) {
        const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
        backup = path.join(agents, '.skills-hub-backups', `${stamp}-${randomUUID().replaceAll('-', '').slice(0, 8)}`);
        fsOps.mkdirSync(backup, { recursive: true });
      }
      for (const action of actions) {
        if (action.kind === 'unchanged') continue;
        let previous = null;
        if (action.kind === 'replace') {
          previous = path.join(backup, action.name);
          fsOps.renameSync(action.destination, previous);
          completed.push({ destination: action.destination, previous });
        }
        fsOps.renameSync(path.join(staging, action.name), action.destination);
        if (previous === null) completed.push({ destination: action.destination, previous });
      }
      applyPersistence(persistence, project, fsOps, persistenceJournal);
      return { actions, backup, persistence };
    } catch (error) {
      const recoveryErrors = rollbackPersistence(persistenceJournal, fsOps);
      for (const item of completed.reverse()) {
        try {
          if (exists(item.destination)) fsOps.rmSync(item.destination, { recursive: true });
          if (item.previous !== null) fsOps.renameSync(item.previous, item.destination);
        } catch (recoveryError) { recoveryErrors.push(`${item.destination}: ${recoveryError.message}`); }
      }
      if (recoveryErrors.length) {
        throw new InstallError(`Installation failed: ${error.message}. Some files need manual recovery.${backup ? ` Keep ${backup}.` : ''} ${recoveryErrors.join('; ')}`);
      }
      throw new InstallError(`Installation failed; changed skill directories and newly created domain navigation were rolled back: ${error.message}`);
    } finally {
      if (staging !== null) fsOps.rmSync(staging, { recursive: true, force: true });
      for (const lock of locks.reverse()) fsOps.rmdirSync(lock);
    }
  }
  return { catalog, plan, apply, persistencePlan };
}

export function catalog(repository = repositoryRoot) { return createInstaller({ repository }).catalog(); }

const usage = `Usage: skills-hub <list|install> [--domain DOMAIN ...] [--skill NAME ...] [--all]
       skills-hub install <selection> [--dry-run] [--replace]

Install complete skills into the current project's .agents/skills/. No destination option.
Selected dev/system domains also initialize missing domain AGENTS.md navigation; managed templates are updated; business records are preserved.
--dry-run  Preview without writing files.
Differing selected skills are backed up and replaced automatically.
--replace  Accepted for compatibility; replacement is already the default.
`;

function parseArguments(argv) {
  if (argv.length === 1 && ['--version', '-v'].includes(argv[0])) return { version: true };
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...tokens] = argv;
  if (!['list', 'install'].includes(command)) throw new Error('Choose the list or install command.');
  const result = { command, domains: [], names: [], all: false, dryRun: false, replace: true };
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === '--all') result.all = true;
    else if (token === '--dry-run' && command === 'install') result.dryRun = true;
    else if (token === '--replace' && command === 'install') result.replace = true;
    else if (token === '--domain' || token === '--skill') {
      const values = [];
      while (index + 1 < tokens.length && !tokens[index + 1].startsWith('-')) values.push(tokens[++index]);
      if (!values.length) throw new Error(`${token} needs at least one value.`);
      result[token === '--domain' ? 'domains' : 'names'].push(...values);
    } else throw new Error(`Unknown argument: ${token}`);
  }
  return result;
}

export function main(argv = process.argv.slice(2), { repository = repositoryRoot, project = process.cwd(), stdout = console.log, stderr = console.error } = {}) {
  let args;
  try { args = parseArguments(argv); }
  catch (error) { stderr(`${error.message}\n${usage}`); return 2; }
  if (args.help) { stdout(usage); return 0; }
  try {
    if (args.version) {
      const { version } = JSON.parse(readUtf8(path.join(repository, 'package.json')));
      if (typeof version !== 'string' || !version) throw new InstallError('The package version is missing.');
      stdout(version);
      return 0;
    }
    const installer = createInstaller({ repository });
    const skills = installer.catalog();
    const everything = args.all || (args.command === 'list' && !args.domains.length && !args.names.length);
    const selected = select(skills, args.domains, args.names, everything);
    if (!selected.length) throw new InstallError("Choose --domain, --skill, or --all. Run 'list' to see available skills.");
    if (args.command === 'list') {
      for (const skill of selected) stdout(`${skill.domain.padEnd(8)} ${skill.name}`);
      return 0;
    }
    const actualProject = fs.realpathSync(project);
    const { actions, backup, persistence } = args.dryRun
      ? { actions: installer.plan(selected, actualProject, args.replace), backup: null, persistence: installer.persistencePlan(selected, actualProject) }
      : installer.apply(selected, actualProject, args.replace);
    stdout(`Destination: ${path.join(actualProject, '.agents', 'skills')}`);
    for (const action of actions) {
      stdout(`${args.dryRun ? 'would ' : ''}${action.kind.padEnd(9)} ${action.name}`);
    }
    for (const item of persistence) stdout(`${args.dryRun ? 'would ' : ''}${item.action.padEnd(9)} ${item.path}`);
    if (backup !== null) stdout(`Backups: ${backup}`);
    return 0;
  } catch (error) { stderr(`Error: ${error.message}`); return 1; }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  const interactiveRequest = argv.length === 0 || (argv[0] === 'install' && argv.slice(1).every(value => ['--replace', '--dry-run'].includes(value)));
  if (interactiveRequest && process.stdin.isTTY && process.stdout.isTTY) {
    // 不在本模块顶层 await：cli.mjs 会导入本模块，等待会形成模块求值死锁。
    import('./cli.mjs').then(({ interactive }) => interactive({ argv }))
      .then(code => { process.exitCode = code; })
      .catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
  } else process.exitCode = main(argv);
}
