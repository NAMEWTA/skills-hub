#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { planPersistence, applyPersistence, rollbackPersistence } from './scripts/init-persistence.mjs';

export const repositoryRoot = path.dirname(fileURLToPath(import.meta.url));
export const licenseBundleFiles = Object.freeze([
  'PROJECT-LICENSE.txt', 'deepseek-harness-MIT.txt',
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

export function createInstaller({ repository = repositoryRoot, fsOps = fs, platform = process.platform } = {}) {
  const skillRoot = path.join(repository, 'skills');
  const upstreamRoot = path.join(repository, 'upstream-skills');
  const licenseRoot = path.join(repository, 'licenses');
  const exists = (filename) => fsOps.lstatSync(filename, { throwIfNoEntry: false });

  function catalog() {
    const skills = [];
    const seen = new Set();
    function directories(root) {
      const rootStat = exists(root);
      if (!rootStat) return [];
      if (rootStat.isSymbolicLink()) throw new InstallError(`Symlinked source directory: ${root}`);
      if (!rootStat.isDirectory()) throw new InstallError(`Expected a source directory: ${root}`);
      return fsOps.readdirSync(root).sort().filter(name => {
        const source = path.join(root, name);
        const stat = exists(source);
        if (stat.isSymbolicLink()) throw new InstallError(`Symlinked source directory: ${source}`);
        return stat.isDirectory();
      });
    }
    function addSkill(domain, name, source, prefix) {
      const manifest = path.join(source, 'SKILL.md');
      if (!exists(manifest)) return;
      if (!slug.test(domain) || !slug.test(name)) throw new InstallError(`Invalid domain or skill name: ${domain}/${name}`);
      if (name.length > 64 || !name.startsWith(`${prefix}-`)) {
        throw new InstallError(`Skill must be named ${prefix}-xxx (max 64 characters): ${name}`);
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
    for (const domain of directories(skillRoot)) {
      if (domain === 'upstream-skills') throw new InstallError('The upstream-skills group belongs at the repository root, not inside skills/.');
      const domainPath = path.join(skillRoot, domain);
      for (const name of directories(domainPath)) addSkill(domain, name, path.join(domainPath, name), domain);
    }
    for (const name of directories(upstreamRoot)) addSkill('upstream-skills', name, path.join(upstreamRoot, name), 'zh');
    if (!skills.length) throw new InstallError(`No skills found in ${skillRoot} or ${upstreamRoot}`);
    return skills;
  }

  function checkDirectory(filename) {
    const stat = exists(filename);
    if (stat && (stat.isSymbolicLink() || !stat.isDirectory())) {
      throw new InstallError(`Refusing a symlink or non-directory destination: ${filename}`);
    }
  }

  function checkDirectoryPath(project, directory) {
    if (!isWithin(directory, project)) throw new InstallError(`Destination is outside the current project: ${directory}`);
    let current = project;
    checkDirectory(current);
    for (const part of path.relative(project, directory).split(path.sep).filter(Boolean)) {
      current = path.join(current, part);
      checkDirectory(current);
    }
  }

  function installedNames(skills, project) {
    const agents = path.join(project, '.agents');
    const target = path.join(agents, 'skills');
    if (!exists(agents)?.isDirectory() || !exists(target)?.isDirectory()) return [];
    return skills.filter(({ name }) => {
      const directory = path.join(target, name);
      return exists(directory)?.isDirectory() && exists(path.join(directory, 'SKILL.md'))?.isFile();
    }).map(({ name }) => name);
  }

  function planLink(name, project, canonical) {
    const relative = `.claude/skills/${name}`;
    const destination = path.join(project, '.claude', 'skills', name);
    const target = path.relative(path.dirname(destination), canonical);
    const stat = exists(destination);
    if (!stat) return { path: relative, destination, target, kind: 'link' };
    if (!stat.isSymbolicLink()) {
      throw new InstallError(`Claude skill entry conflict: ${destination} is not a symlink. Expected a directory symlink to ${canonical}; existing content was not changed.`);
    }
    const previous = fsOps.readlinkSync(destination);
    const resolved = path.resolve(path.dirname(destination), previous);
    // 预期本体尚未安装时，准确指向它的断链仍是可保留的入口。
    let matches = path.relative(resolved, canonical) === '';
    if (exists(canonical)) {
      try {
        matches = path.relative(fsOps.realpathSync(destination), fsOps.realpathSync(canonical)) === '' &&
          fsOps.statSync(destination).isDirectory();
      }
      catch (error) {
        if (!['ENOENT', 'ENOTDIR', 'ELOOP'].includes(error.code)) throw error;
        matches = false;
      }
    }
    if (!matches) {
      throw new InstallError(`Claude skill entry conflict: ${destination} -> ${previous}. Expected ${canonical}; the existing link and its target were not changed.`);
    }
    return { path: relative, destination, target: previous, kind: 'preserved' };
  }

  function checkLinkParents(project) {
    for (const relative of ['.agents', '.agents/skills', '.claude', '.claude/skills']) {
      checkDirectory(path.join(project, relative));
    }
  }

  function verifyLink(action, project) {
    checkLinkParents(project);
    checkDirectory(action.destination);
    const actual = planLink(action.name, project, action.destination);
    const expectedKind = action.link.kind === 'skipped' ? 'link' : 'preserved';
    if (actual.kind !== expectedKind || actual.target !== action.link.target ||
        (actual.kind === 'preserved' && path.relative(fsOps.realpathSync(actual.destination), fsOps.realpathSync(action.destination)) !== '')) {
      throw new InstallError(`Claude skill link verification failed: ${action.link.destination}`);
    }
    if (actual.kind === 'link') return;
    const manifest = path.join(actual.destination, 'SKILL.md');
    if (!exists(manifest)?.isFile()) throw new InstallError(`Expected a regular skill entry: ${manifest}`);
  }

  function plan(skills, project, replace = true) {
    const actualProject = fsOps.realpathSync(project);
    for (const source of [skillRoot, upstreamRoot, licenseRoot]) {
      if (exists(source) && isWithin(actualProject, fsOps.realpathSync(source))) {
        throw new InstallError("Run from the target project, outside this repository's source skills and licenses directories (including upstream-skills).");
      }
    }
    project = actualProject;
    const agents = path.join(project, '.agents');
    const target = path.join(agents, 'skills');
    for (const filename of [agents, target, path.join(agents, '.skills-hub-backups')]) checkDirectory(filename);
    checkLinkParents(project);
    const actions = [];
    const conflicts = [];
    const packages = skills.map((skill) => ({ source: skill.source, name: skill.name, destination: path.join(target, skill.name) }));
    for (const item of packages) {
      try {
        checkDirectory(item.destination);
        let kind;
        if (!exists(item.destination)) kind = 'install';
        else if (treeDigest(item.source, fsOps) === treeDigest(item.destination, fsOps)) kind = 'unchanged';
        else if (replace) kind = 'replace';
        else throw new InstallError(`Existing packages differ: ${item.name}. Inspect them first; --replace saves backups before replacement.`);
        actions.push({ ...item, kind, link: planLink(item.name, project, item.destination) });
      } catch (error) { conflicts.push(error.message); }
    }
    try { planPersistence(skills, project, fsOps); }
    catch (error) { conflicts.push(error.message); }
    if (conflicts.length) {
      throw new InstallError(`Installation conflicts; no files were changed:\n${conflicts.join('\n')}`);
    }
    return actions;
  }

  function persistencePlan(skills, project) { return planPersistence(skills, project, fsOps); }

  function apply(skills, project, replace = true) {
    project = fsOps.realpathSync(project);
    let actions = plan(skills, project, replace);
    let persistence = persistencePlan(skills, project);
    if (actions.every((action) => action.kind === 'unchanged' && action.link.kind === 'preserved') && persistence.every(item => item.action === 'preserve')) {
      for (const action of actions) verifyLink(action, project);
      return { actions, backup: null, persistence };
    }
    const agents = path.join(project, '.agents');
    const locks = [];
    let staging = null;
    let backup = null;
    const journal = { skills: [], persistence: [], links: [], directories: [] };
    const recoveryErrors = [];
    let failure = null;
    function ensureDirectory(directory) {
      checkDirectoryPath(project, directory);
      if (!exists(directory)) {
        fsOps.mkdirSync(directory);
        journal.directories.push(directory);
      }
    }
    try {
      ensureDirectory(agents);
      // 先取得旧版共用锁；链接补建也与现有安装事务互斥。
      for (const name of ['.skills-wta-install.lock', '.skills-hub-install.lock']) {
        const lock = path.join(agents, name);
        try { fsOps.mkdirSync(lock); }
        catch (error) {
          if (error.code !== 'EEXIST') throw error;
          throw new InstallError(`An installer lock exists: ${lock}. Check for a running installer before removing a stale lock.`);
        }
        locks.push(lock);
      }
      actions = plan(skills, project, replace);
      persistence = persistencePlan(skills, project);
      if (actions.some(action => action.kind !== 'unchanged')) staging = fsOps.mkdtempSync(path.join(agents, '.skills-hub-stage-'));
      for (const action of actions) {
        if (action.kind !== 'unchanged') {
          fsOps.cpSync(action.source, path.join(staging, action.name), { recursive: true, errorOnExist: true, force: false });
        }
      }
      ensureDirectory(path.join(agents, 'skills'));
      if (actions.some((action) => action.kind === 'replace')) {
        const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
        const backups = path.join(agents, '.skills-hub-backups');
        ensureDirectory(backups);
        backup = path.join(backups, `${stamp}-${randomUUID().replaceAll('-', '').slice(0, 8)}`);
        ensureDirectory(backup);
      }
      for (const action of actions) {
        if (action.kind === 'unchanged') continue;
        let previous = null;
        if (action.kind === 'replace') {
          previous = path.join(backup, action.name);
          fsOps.renameSync(action.destination, previous);
          journal.skills.push({ destination: action.destination, previous });
        }
        fsOps.renameSync(path.join(staging, action.name), action.destination);
        if (previous === null) journal.skills.push({ destination: action.destination, previous });
      }
      applyPersistence(persistence, project, fsOps, journal.persistence);
      ensureDirectory(path.join(project, '.claude'));
      ensureDirectory(path.join(project, '.claude', 'skills'));
      for (const action of actions) {
        checkLinkParents(project);
        checkDirectory(action.destination);
        const current = planLink(action.name, project, action.destination);
        if (current.kind !== action.link.kind || current.target !== action.link.target) {
          throw new InstallError(`Claude skill entry changed during installation: ${action.link.destination}`);
        }
        if (action.link.kind === 'link') {
          try { fsOps.symlinkSync(action.link.target, action.link.destination, 'dir'); }
          catch (error) {
            if (platform === 'win32' && error.code === 'EPERM') {
              action.link.kind = 'skipped';
              continue;
            }
            throw new InstallError(`Cannot create directory symlink ${action.link.destination} -> ${action.link.target}: ${error.code ?? ''} ${error.message}`);
          }
          journal.links.push(action.link);
        }
        verifyLink(action, project);
      }
      for (const action of actions) {
        verifyLink(action, project);
        if (treeDigest(action.source, fsOps) !== treeDigest(action.destination, fsOps)) {
          throw new InstallError(`Installed skill verification failed: ${action.destination}`);
        }
      }
      if (persistencePlan(skills, project).some(item => item.action !== 'preserve')) {
        throw new InstallError('Project initialization verification failed; check the reported paths and retry.');
      }
    } catch (error) {
      failure = error;
      for (const link of [...journal.links].reverse()) {
        try {
          checkLinkParents(project);
          const stat = exists(link.destination);
          if (!stat) continue;
          if (!stat.isSymbolicLink() || fsOps.readlinkSync(link.destination) !== link.target) {
            throw new InstallError('The created link changed; preserving the current entry for manual recovery.');
          }
          fsOps.unlinkSync(link.destination);
        } catch (recoveryError) { recoveryErrors.push(`${link.destination}: ${recoveryError.message}`); }
      }
      recoveryErrors.push(...rollbackPersistence(journal.persistence, fsOps));
      for (const item of [...journal.skills].reverse()) {
        try {
          checkDirectoryPath(project, path.dirname(item.destination));
          if (item.previous !== null) checkDirectoryPath(project, path.dirname(item.previous));
          if (exists(item.destination)) fsOps.rmSync(item.destination, { recursive: true });
          if (item.previous !== null) fsOps.renameSync(item.previous, item.destination);
        } catch (recoveryError) { recoveryErrors.push(`${item.destination}: ${recoveryError.message}`); }
      }
    } finally {
      if (staging !== null) {
        try { checkDirectoryPath(project, path.dirname(staging)); fsOps.rmSync(staging, { recursive: true, force: true }); }
        catch (error) { recoveryErrors.push(`${staging}: ${error.message}`); }
      }
      for (const lock of locks.reverse()) {
        try { checkDirectoryPath(project, lock); fsOps.rmdirSync(lock); }
        catch (error) { recoveryErrors.push(`${lock}: ${error.message}`); }
      }
      if (failure) {
        for (const directory of [...journal.directories].reverse()) {
          try { checkDirectoryPath(project, directory); fsOps.rmdirSync(directory); }
          catch (error) {
            if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes(error.code)) recoveryErrors.push(`${directory}: ${error.message}`);
          }
        }
      }
    }
    if (failure) {
      if (recoveryErrors.length) {
        throw new InstallError(`Installation failed: ${failure.message}. Some files need manual recovery.${backup ? ` Keep ${backup}.` : ''} ${recoveryErrors.join('; ')}`);
      }
      throw new InstallError(`Installation failed; changes to skill directories, Claude links and project initialization files were rolled back: ${failure.message}`);
    }
    if (recoveryErrors.length) {
      throw new InstallError(`Installation files were updated, but temporary artifacts need manual cleanup: ${recoveryErrors.join('; ')}`);
    }
    return { actions, backup, persistence };
  }
  return { catalog, installedNames, plan, apply, persistencePlan };
}

export function catalog(repository = repositoryRoot) { return createInstaller({ repository }).catalog(); }

const usage = `Usage: skills-hub <list|install> [--domain DOMAIN ...] [--skill NAME ...] [--all]
       skills-hub install <selection> [--dry-run] [--replace]

Install complete skills into the current project's .agents/skills/ and link each selected .claude/skills/<name> to that same skill. No destination option.
On Windows, EPERM while creating a Claude directory symlink skips that link and prints a warning. Reinstall with symlink permission to add it.
Conflicting Claude entries are never replaced.
--domain upstream-skills selects the independent Chinese upstream skills; it creates no domain navigation.
Selected dev/system/ops/home domains initialize domain AGENTS.md navigation; Home updates only its marked base block, and business records are preserved.
Dev or system selections add /temp/ to the project .gitignore when missing; dev also adds /.agents/dev/worktree/.
Home selections add /.agents/home/local.json to .gitignore; Home business records are created on demand by their owning skills.
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

export function main(argv = process.argv.slice(2), {
  repository = repositoryRoot, project = process.cwd(), stdout = console.log, stderr = console.error, warn = console.warn,
} = {}) {
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
      const width = Math.max(8, ...selected.map(skill => skill.domain.length));
      for (const skill of selected) stdout(`${skill.domain.padEnd(width)} ${skill.name}`);
      return 0;
    }
    const actualProject = fs.realpathSync(project);
    const { actions, backup, persistence } = args.dryRun
      ? { actions: installer.plan(selected, actualProject, args.replace), backup: null, persistence: installer.persistencePlan(selected, actualProject) }
      : installer.apply(selected, actualProject, args.replace);
    stdout(`Destination: ${path.join(actualProject, '.agents', 'skills')}`);
    stdout(`Claude entries: ${path.join(actualProject, '.claude', 'skills')}`);
    for (const action of actions) {
      const prefix = args.dryRun ? 'would ' : '';
      stdout(`${prefix}${action.kind.padEnd(9)} ${action.name} | ${prefix}${action.link.kind.padEnd(9)} ${action.link.path} -> ${action.link.target}`);
    }
    for (const item of persistence) stdout(`${args.dryRun ? 'would ' : ''}${item.action.padEnd(9)} ${item.path}`);
    if (backup !== null) stdout(`Backups: ${backup}`);
    if (actions.some(action => action.link.kind === 'skipped')) {
      warn('警告：标记为 skipped 的 .claude/skills/ 软链接未创建（EPERM）。技能已安装到 .agents/skills/。以管理员身份打开终端，或启用 Windows 开发人员模式，再重跑原安装命令补齐链接。');
    }
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
