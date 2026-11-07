#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { repositoryRoot } from '../install.mjs';

const readable = /\.(?:md|ya?ml|json|mjs|js)$/i;

export function persistenceIssues(filename, content) {
  const errors = [];
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const text = lines[index];
    if (text.includes('.agents/wtadev')) {
      errors.push(filename + ':' + (index + 1) + ': 运行技能仍引用弃用的 .agents/wtadev/；改用 .agents/<domain>/');
    }
    if (text.includes('.agents/dev/system/')) {
      errors.push(filename + ':' + (index + 1) + ': 系统领域资料不能嵌入 dev；应使用 .agents/system/<host>/');
    }
  }
  return errors;
}

export function check(root = repositoryRoot) {
  const errors = [];
  const source = path.join(root, 'skills');
  if (!fs.existsSync(source)) return ['skills/: 未找到技能目录'];
  function visit(parent) {
    for (const child of fs.readdirSync(parent, { withFileTypes: true })) {
      const absolute = path.join(parent, child.name);
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      if (child.isSymbolicLink()) { errors.push(relative + ': 技能运行目录不得包含符号链接'); continue; }
      if (child.isDirectory()) { visit(absolute); continue; }
      if (!child.isFile() || !readable.test(child.name)) continue;
      errors.push(...persistenceIssues(relative, fs.readFileSync(absolute, 'utf8')));
    }
  }
  visit(source);
  return errors;
}

export function main(args = process.argv.slice(2)) {
  let root = repositoryRoot;
  if (args.length === 2 && args[0] === '--root') root = path.resolve(args[1]);
  else if (args.length) { console.error('Usage: node scripts/check-persistence-roots.mjs [--root DIRECTORY]'); return 2; }
  const problems = check(root);
  if (problems.length) { for (const problem of problems) console.error(problem); return 1; }
  console.log('Domain persistence paths passed: dev → .agents/dev/, system → .agents/system/; .agents/skills/ unchanged.');
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
