#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { repositoryRoot, readUtf8, isMain, frontmatterPattern } from '../install.mjs';

export const maxBodyLines = 500;
export const maxBodyCharacters = 12_000;

export function measure(filename, content) {
  const header = frontmatterPattern.exec(content);
  if (!header) throw new Error('缺少完整的 YAML frontmatter，无法确定正文边界');
  const body = content.slice(header[0].length);
  const lines = (body.match(/\n/g)?.length ?? 0) + Number(body.length > 0 && !body.endsWith('\n'));
  const characters = Array.from(body).filter((character) => !/[\p{White_Space}\u001c-\u001f]/u.test(character)).length;
  return { path: filename, lines, characters, budgetFraction: Math.max(lines / maxBodyLines, characters / maxBodyCharacters) };
}

export function entryIssues(filename, content) {
  let size;
  try { size = measure(filename, content); }
  catch (error) { return [`${filename}: ${error.message}`]; }
  const failures = [];
  if (size.lines > maxBodyLines) failures.push(`${filename}: 正文 ${size.lines} 行，超过项目上限 ${maxBodyLines} 行`);
  if (size.characters > maxBodyCharacters) failures.push(`${filename}: 正文 ${size.characters} 个非空白 Unicode 字符，超过项目上限 ${maxBodyCharacters}`);
  return failures.map((failure) => `${failure}；将详细方法、示例或参数拆入本包 references/，入口保留路由、关键约束和按需读取链接；压缩重复表述，不删减完整方法。`);
}

export function check(root = repositoryRoot) {
  const failures = [];
  const sizes = [];
  const skills = path.join(root, 'skills');
  const stat = fs.lstatSync(skills, { throwIfNoEntry: false });
  if (!stat?.isDirectory() || stat.isSymbolicLink()) return { failures: ['skills/: 未找到常规技能目录'], sizes };
  for (const domain of fs.readdirSync(skills).sort()) {
    const domainPath = path.join(skills, domain);
    const domainStat = fs.lstatSync(domainPath);
    if (domainStat.isSymbolicLink()) { failures.push(`${domainPath}: 入口及其目录必须是本仓库的常规文件/目录`); continue; }
    if (!domainStat.isDirectory()) continue;
    for (const name of fs.readdirSync(domainPath).sort()) {
      const skill = path.join(domainPath, name);
      const skillStat = fs.lstatSync(skill);
      if (skillStat.isSymbolicLink()) { failures.push(`${skill}: 入口及其目录必须是本仓库的常规文件/目录`); continue; }
      if (!skillStat.isDirectory()) continue;
      const filename = path.join(skill, 'SKILL.md');
      const entryStat = fs.lstatSync(filename, { throwIfNoEntry: false });
      if (!entryStat) continue;
      const relative = path.relative(root, filename).split(path.sep).join('/');
      if (!entryStat.isFile() || entryStat.isSymbolicLink()) { failures.push(`${relative}: 入口及其目录必须是本仓库的常规文件/目录`); continue; }
      try {
        const content = readUtf8(filename);
        sizes.push(measure(relative, content));
        failures.push(...entryIssues(relative, content));
      } catch (error) { failures.push(`${relative}: ${error.message}`); }
    }
  }
  if (!sizes.length && !failures.length) failures.push('skills/: 未找到 skills/<domain>/<domain>-xxx/SKILL.md');
  return { failures, sizes };
}

export function report(sizes, { allEntries = false, output = console.log } = {}) {
  output(`入口预算：检查 ${sizes.length} 项；正文上限 ${maxBodyLines} 行、${maxBodyCharacters} 个非空白 Unicode 字符（不是 token 计数）。`);
  const ordered = [...sizes].sort((a, b) => b.budgetFraction - a.budgetFraction || a.path.localeCompare(b.path));
  output(allEntries ? '行数/上限  字符数/上限  入口' : '当前占用最高的入口：');
  for (const size of allEntries ? ordered : ordered.slice(0, 3)) output(`  ${size.lines}/${maxBodyLines} 行  ${size.characters}/${maxBodyCharacters} 字符  ${size.path}`);
}

export function main(argv = process.argv.slice(2)) {
  let root = repositoryRoot;
  let allEntries = false;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--root' && argv[index + 1]) root = path.resolve(argv[++index]);
    else if (argv[index] === '--report') allEntries = true;
    else if (argv[index] === '--help') { console.log('node scripts/check-skill-quality.mjs [--root DIRECTORY] [--report]'); return 0; }
    else { console.error(`Unknown argument: ${argv[index]}`); return 2; }
  }
  try {
    const { failures, sizes } = check(root);
    report(sizes, { allEntries });
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    return Number(failures.length > 0);
  } catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}

if (isMain(import.meta.url)) process.exitCode = main();
