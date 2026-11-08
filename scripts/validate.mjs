#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { isIP } from 'node:net';
import {
  repositoryRoot, licenseBundleFiles, catalog, regularFiles, readUtf8,
  isWithin, isMain, frontmatterPattern,
} from '../install.mjs';
import { entryIssues } from './check-skill-quality.mjs';

const provenance = /deepseek|matt[ -]?pocock|mattpocock|ask-matt|cursor\/plugins|pstack|poteto|elayadesign|\belaya\b|ai-design-skills|speculo|leonxlnx|taste-skill|dsh-[a-z]|upstream|lauren tan|humanlayer|dex[ -]?horthy/i;
const webUrl = /\b(?:https?|ftp):\/\/(?:\[[0-9a-fA-F:.]+\]|[^\s<>"')`\]]+)[^\s<>"')`\]]*/gi;
const ignoredDirectories = new Set(['.git', '.agents', '__pycache__', 'node_modules']);
const entities = {
  amp: '&', AMP: '&', lt: '<', LT: '<', gt: '>', GT: '>', quot: '"', QUOT: '"', apos: "'",
  colon: ':', sol: '/', bsol: '\\', num: '#', percnt: '%', period: '.', quest: '?', equals: '=',
  commat: '@', semi: ';', lpar: '(', rpar: ')', lsqb: '[', rsqb: ']', lbrack: '[', rbrack: ']',
  Tab: '\t', NewLine: '\n', nbsp: '\u00a0', lowbar: '_', hyphen: '\u2010', plus: '+', comma: ',',
};

export function unescapeHtml(text) {
  return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z][a-z0-9]+);?/gi, (whole, entity) => {
    if (!entity.startsWith('#')) return entities[entity] ?? whole;
    const number = /^#x/i.test(entity) ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff) ? String.fromCodePoint(number) : '\ufffd';
  });
}

export function outsideFences(text) {
  const output = [];
  let marker = null;
  let length = 0;
  for (const line of text.split(/\r?\n/)) {
    const fence = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (fence) {
      const token = fence[1][0];
      if (marker === null) { marker = token; length = fence[1].length; }
      else if (marker === token && fence[1].length >= length && !fence[2].trim()) marker = null;
      continue;
    }
    if (marker === null) output.push(line);
  }
  return output.join('\n');
}

export function markdownDestinations(text) {
  const prose = outsideFences(text);
  const destinations = [];
  for (const match of prose.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    destinations.push(match[1].trim().split(' "', 1)[0].split(" '", 1)[0].replace(/^[<>]+|[<>]+$/g, ''));
  }
  for (const match of prose.matchAll(/^\s{0,3}\[[^\]\n]+\]:\s*(<[^>]+>|\S+)/gm)) destinations.push(match[1].replace(/^[<>]+|[<>]+$/g, ''));
  for (const match of prose.matchAll(/<(https?:\/\/[^>\n]+)>/g)) destinations.push(match[1]);
  const html = prose.replace(/<!--[\s\S]*?-->/g, '');
  for (const tag of html.matchAll(/<[a-z][^<>]*>/gi)) {
    for (const match of tag[0].matchAll(/\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
      const value = match[1] ?? match[2] ?? match[3];
      if (value) destinations.push(value);
    }
  }
  return destinations.map(unescapeHtml);
}

function urlParts(destination) {
  const cleaned = destination.replace(/[\t\r\n]/g, '').replace(/^[\x00-\x20]+/, '');
  const scheme = /^[a-z][a-z\d+.-]*:/i.test(cleaned);
  const authority = cleaned.startsWith('//');
  if (scheme || authority) {
    const parsed = new URL(authority ? `https:${cleaned}` : cleaned);
    return { external: true, path: parsed.pathname };
  }
  return { external: false, path: cleaned.split(/[?#]/, 1)[0] };
}

export function operationalExample(url) {
  let hostname;
  try { hostname = new URL(url).hostname.toLowerCase().replace(/^\[|\]$/g, ''); }
  catch { return false; }
  if (hostname === 'localhost' || ['.localhost', '.invalid', '.example'].some((ending) => hostname.endsWith(ending))) return true;
  if (['example.com', 'example.org', 'example.net'].includes(hostname)) return true;
  if (isIP(hostname) === 4) return hostname.startsWith('127.');
  return isIP(hostname) === 6 && (hostname === '::1' || hostname === '0:0:0:0:0:0:0:1');
}

export function runtimeIssues(text, { allowServicePrefixes = false } = {}) {
  const failures = [];
  const source = text.match(provenance);
  if (source) failures.push(`source attribution/name belongs outside skills: ${source[0]}`);
  for (const url of new Set(unescapeHtml(text).match(webUrl) ?? [])) {
    const servicePrefix = allowServicePrefixes && (url === 'https://github.com/' || url.startsWith('https://github.com/${'));
    if (!operationalExample(url) && !servicePrefix) failures.push(`external URL in runtime package: ${url}`);
  }
  for (const destination of markdownDestinations(text)) {
    try {
      if (urlParts(destination).external && !operationalExample(destination)) failures.push(`resource link must be package-relative: ${destination}`);
    } catch { failures.push(`invalid link: ${destination}`); }
  }
  return failures;
}

function canonicalPath(filename) {
  try { return fs.realpathSync(filename); }
  catch (error) {
    if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
    const parent = path.dirname(filename);
    if (parent === filename) return filename;
    return path.join(canonicalPath(parent), path.basename(filename));
  }
}

export function localTarget(document, destination, boundary) {
  let parts;
  try { parts = urlParts(destination); }
  catch { return { target: null, error: `invalid link: ${destination}` }; }
  if (parts.external || !parts.path) return { target: null, error: null };
  if (/^[/\\]/.test(parts.path)) return { target: null, error: `use a relative package link: ${destination}` };
  let decoded;
  try { decoded = decodeURIComponent(parts.path).replaceAll('\\', '/'); }
  catch { return { target: null, error: `invalid link encoding: ${destination}` }; }
  const target = canonicalPath(path.resolve(path.dirname(document), decoded));
  if (!isWithin(target, canonicalPath(path.resolve(boundary)))) return { target, error: `link escapes its package: ${destination}` };
  if (!fs.existsSync(target)) return { target, error: `missing link target: ${destination}` };
  return { target, error: null };
}

function filesUnder(directory, { ignore = ignoredDirectories } = {}) {
  const files = [];
  function visit(parent) {
    for (const entry of fs.readdirSync(parent, { withFileTypes: true })) {
      if (ignore.has(entry.name)) continue;
      const filename = path.join(parent, entry.name);
      if (entry.isDirectory()) visit(filename);
      else if (entry.isFile()) files.push(filename);
    }
  }
  visit(directory);
  return files.sort();
}

export function checkScriptFormats(root = repositoryRoot) {
  const failures = [];
  for (const filename of filesUnder(root)) {
    const relative = path.relative(root, filename).split(path.sep).join('/');
    if (relative.startsWith('materials/') || relative.startsWith('licenses/')) continue;
    const disallowedExtension = /\.(?:py|sh|bash|ts|tsx|cjs|ps1|bat|cmd)$/i.test(filename);
    const descriptor = fs.openSync(filename, 'r');
    const prefix = Buffer.alloc(256);
    let count;
    try { count = fs.readSync(descriptor, prefix, 0, prefix.length, 0); }
    finally { fs.closeSync(descriptor); }
    const firstLine = prefix.subarray(0, count).toString('utf8').split('\n', 1)[0];
    const hasShebang = firstLine.startsWith('#!');
    const nodeShebang = /^#![ \t]*(?:\/\S*\/node|\/usr\/bin\/env[ \t]+(?:-S[ \t]+)?node)(?:[ \t][^\r\n]*)?\r?$/.test(firstLine);
    const fixedHook = relative === '.githooks/pre-commit' || relative === '.githooks/pre-push';
    if (disallowedExtension || (hasShebang && (!nodeShebang || (!/\.(?:mjs|js)$/.test(filename) && !fixedHook)))) {
      failures.push(`${relative}: executable repository scripts must use .mjs or .js with Node.js; only fixed Git hook names may omit the extension; keep source originals only as material data`);
    }
  }
  return failures;
}

export function checkSkillMetadata(skill, root = repositoryRoot) {
  const failures = [];
  const manifest = path.join(skill.source, 'SKILL.md');
  const content = readUtf8(manifest);
  const header = content.match(frontmatterPattern)?.[1];
  const relative = path.relative(root, manifest);
  if (header === undefined) return [`${relative}: missing frontmatter`];
  const fields = new Map();
  for (const line of header.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = line.match(/^([a-z_]+):\s*(.+)$/);
    if (!match) { failures.push(`${relative}: use simple name/description scalar metadata`); continue; }
    if (fields.has(match[1])) failures.push(`${relative}: duplicate metadata field ${match[1]}`);
    fields.set(match[1], match[2]);
  }
  if (fields.size !== 2 || !fields.has('name') || !fields.has('description')) failures.push(`${relative}: expected name and description`);
  const description = (fields.get('description') ?? '').trim().replace(/^["']+|["']+$/g, '');
  if (!description || Array.from(description).length > 1024 || /[<>]/.test(description)) failures.push(`${relative}: missing or invalid description`);
  failures.push(...entryIssues(relative.split(path.sep).join('/'), content));
  if (!/[\u3400-\u9fff]/u.test(content)) failures.push(`${relative}: expected Chinese skill content`);
  const metadata = path.join(skill.source, 'agents', 'openai.yaml');
  if (fs.existsSync(metadata) && !readUtf8(metadata).includes(`$${skill.name}`)) failures.push(`${path.relative(root, metadata)}: default prompt must name the skill`);
  return failures;
}

export function unreachableMarkdown(root, graph) {
  const visited = new Set();
  const pending = [canonicalPath(path.join(root, 'SKILL.md'))];
  while (pending.length) {
    const document = pending.pop();
    if (visited.has(document)) continue;
    visited.add(document);
    pending.push(...(graph.get(document) ?? []));
  }
  return new Set(filesUnder(root).filter((filename) => filename.endsWith('.md')).map(canonicalPath).filter((filename) => !visited.has(filename)));
}

export function duplicateResourceIssues(skills) {
  const seen = new Map();
  const failures = [];
  for (const skill of skills.filter(item => item.domain === 'dev')) {
    for (const filename of regularFiles(skill.source)) {
      if (!/\.(?:md|mjs|js)$/.test(filename) || path.basename(filename) === 'SKILL.md') continue;
      const content = readUtf8(filename).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();
      if (content.length < 300) continue;
      if (seen.has(content)) failures.push(`${filename}: duplicate development resource; keep one owner and call it: ${seen.get(content)}`);
      else seen.set(content, filename);
    }
  }
  return failures;
}

export function check(root = repositoryRoot, { output = console.log } = {}) {
  const failures = [];
  let skills;
  const licenseRoot = path.join(root, 'licenses');
  try { skills = catalog(root); regularFiles(licenseRoot); }
  catch (error) { return [error.message]; }
  for (const name of licenseBundleFiles) {
    if (!fs.statSync(path.join(licenseRoot, name), { throwIfNoEntry: false })?.isFile()) failures.push(`licenses: missing ${name}`);
  }
  const projectLicense = path.join(licenseRoot, 'PROJECT-LICENSE.txt');
  if (fs.existsSync(projectLicense) && !fs.readFileSync(projectLicense).equals(fs.readFileSync(path.join(root, 'LICENSE')))) {
    failures.push('licenses/PROJECT-LICENSE.txt must preserve the root project license');
  }
  failures.push(...checkScriptFormats(root), ...duplicateResourceIssues(skills));
  for (const skill of skills) {
    failures.push(...checkSkillMetadata(skill, root));
    for (const filename of regularFiles(skill.source)) {
      const relative = path.relative(root, filename);
      if (path.basename(filename).startsWith('LICENSE') || path.basename(filename) === 'NOTICE.md') failures.push(`${relative}: keep legal notices in the companion license bundle`);
      let content;
      try { content = readUtf8(filename); }
      catch (error) { if (error.code === 'ERR_ENCODING_INVALID_ENCODED_DATA') continue; throw error; }
      for (const issue of runtimeIssues(content, { allowServicePrefixes: ['.js', '.mjs'].includes(path.extname(filename)) })) failures.push(`${relative}: ${issue}`);
    }
  }
  let checkedLinks = 0;
  const graph = new Map();
  const markdown = filesUnder(root).filter((filename) => filename.endsWith('.md'));
  for (const document of markdown) {
    const content = readUtf8(document);
    const skillRoot = skills.find((skill) => isWithin(document, skill.source))?.source;
    const destinations = new Set();
    graph.set(canonicalPath(document), destinations);
    for (const destination of markdownDestinations(content)) {
      const { target, error } = localTarget(document, destination, skillRoot ?? root);
      if (error) failures.push(`${path.relative(root, document)}: ${error}`);
      if (target !== null) { checkedLinks += 1; destinations.add(target); }
    }
  }
  for (const skill of skills) {
    for (const filename of [...unreachableMarkdown(skill.source, graph)].sort()) failures.push(`${path.relative(root, filename)}: no local link path from this skill's SKILL.md`);
  }
  output(`Checked ${skills.length} skills, ${markdown.length} Markdown files, ${checkedLinks} local links.`);
  return failures;
}

export function main(argv = process.argv.slice(2)) {
  let root = repositoryRoot;
  if (argv.length === 2 && argv[0] === '--root') root = path.resolve(argv[1]);
  else if (argv.length) { console.error('Usage: node scripts/validate.mjs [--root DIRECTORY]'); return 2; }
  try {
    const failures = check(root);
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    if (!failures.length) console.log('Skill packages, unique methods, local resources and license bundle passed.');
    return Number(failures.length > 0);
  } catch (error) { console.error(`ERROR: ${error.message}`); return 1; }
}

if (isMain(import.meta.url)) process.exitCode = main();
