import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, statSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'materials/dashboard-design-skill/upstream');
const translated = join(root, 'materials/dashboard-design-skill/zh');
const runtime = join(root, 'upstream-skills/zh-dashboard-design');
const paths = [
  'SKILL.md',
  'references/case-study-datafast.md',
  'references/case-study-school-dashboard.md',
  'references/components.md',
  'references/inspiration.md',
  'references/layout-ideas.md',
  'references/layout.md',
  'references/perception.md',
  'references/playbooks.md',
  'references/qa.md',
  'references/snippets.md',
  'references/sources.md',
  'references/swiftui.md',
  'references/tokens.md',
];

function files(dir) {
  const out = [];
  function visit(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) out.push(relative(dir, full).split('\\').join('/'));
      else throw Error('Unexpected symlink or special entry: ' + full);
    }
  }
  visit(dir);
  return out.sort();
}

function read(dir, path) {
  return readFileSync(join(dir, path), 'utf8');
}

function codeBlocks(markdown) {
  return [...markdown.matchAll(/^```([^\n]*)\n[\s\S]*?^```/gm)]
    .filter((match) => match[1] && match[1] !== 'text')
    .map((match) => match[0]
      .replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '')
      .replace(/(^|[ \t]+)\/\/[^\n]*/gm, '')
      .split('\n').map(line => line.trimEnd()).filter(Boolean).join('\n'));
}

function headings(markdown) {
  return [...markdown.matchAll(/^#{1,4} .+/gm)].map(match => match[0]);
}

test('Dashboard Design fixed source, complete Chinese mirror and runtime are one-to-one', () => {
  for (const dir of [source, translated, runtime]) {
    assert.deepEqual(files(dir), paths, 'Unexpected files under ' + dir);
  }
  for (const path of paths) {
    const original = read(source, path);
    const zh = read(translated, path);
    const installed = read(runtime, path);
    assert.notEqual(zh, original, path + ' must be translated');
    assert.match(zh, /[\u3400-\u9fff]/u, path + ' must contain Chinese');
    assert.equal(headings(zh).length, headings(original).length, path + ' headings must correspond');
    assert.deepEqual(codeBlocks(zh), codeBlocks(original), path + ' executable code fences must remain intact');
    if (path !== 'SKILL.md') assert.equal(installed, zh, path + ' runtime must use the reviewed translation');
  }

  assert.match(read(source, 'SKILL.md'), /^---\nname: dashboard-design\n/);
  assert.match(read(translated, 'SKILL.md'), /^---\nname: dashboard-design\n/);
  assert.match(read(runtime, 'SKILL.md'), /^---\nname: zh-dashboard-design\n/);
  assert.match(read(runtime, 'SKILL.md'), /Otabek/);
  assert.match(read(runtime, 'SKILL.md'), /Halo/);
  assert.match(read(runtime, 'SKILL.md'), /Shedi/);
  assert.match(read(runtime, 'references/qa.md'), /3440[\s\S]*1440[\s\S]*375/);
  assert.match(read(runtime, 'references/swiftui.md'), /iOS 17 \/ macOS 14/);
  assert.match(readFileSync(join(root, 'licenses/dashboard-design-skill-MIT.txt'), 'utf8'), /Copyright \(c\) 2026 Otabek Abdiraimov/);
});

test('Dashboard Design local links stay inside the independently installed package', () => {
  for (const path of paths) {
    const content = read(runtime, path).replace(/`[^`\n]+`/g, '');
    for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)) {
      const target = decodeURIComponent(match[1]).split('#')[0];
      if (!target || /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('/')) continue;
      const resolved = resolve(dirname(join(runtime, path)), target);
      assert.ok(resolved.startsWith(runtime + '/') || resolved.startsWith(runtime + '\\'), 'Package-escape link: ' + match[1]);
      assert.ok(existsSync(resolved), path + ' references missing file ' + target);
    }
  }
});

test('Dashboard Design can be selected and installed alone without extra domain directories', t => {
  const target = mkdtempSync(join(tmpdir(), 'skills-hub-dashboard-design-'));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  function cli(...args) {
    const result = spawnSync(process.execPath, [join(root, 'install.mjs'), ...args], { cwd: target, encoding: 'utf8', timeout: 30000 });
    assert.equal(result.status, 0, (result.stdout || '') + (result.stderr || ''));
    return result.stdout;
  }
  const listed = cli('list', '--domain', 'upstream-skills');
  assert.match(listed, /zh-dashboard-design/);
  const preview = cli('install', '--skill', 'zh-dashboard-design', '--dry-run');
  assert.match(preview, /zh-dashboard-design/);
  assert.ok(!existsSync(join(target, '.agents')), 'Preview must not write');
  cli('install', '--skill', 'zh-dashboard-design');
  const installed = join(target, '.agents/skills/zh-dashboard-design');
  assert.deepEqual(files(installed), paths);
  for (const path of paths) assert.equal(read(installed, path), read(runtime, path));
  assert.ok(!existsSync(join(target, '.agents/upstream-skills')));
  assert.ok(!existsSync(join(target, '.agents/dev')));
  assert.match(cli('install', '--skill', 'zh-dashboard-design'), /unchanged/i);
});
