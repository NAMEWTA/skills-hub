import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { stripVTControlCharacters } from 'node:util';
import pc from 'picocolors';
import stringWidth from 'string-width';
import { createSkillTree, createTreePager, renderTreePage, fitTreeText, treeSelect } from '../tree-select.mjs';

const skills = [
  ...Array.from({ length: 17 }, (_, index) => ({ domain: 'dev', name: `dev-item-${index + 1}`, description: '中文用途😀，用于分析与验证。'.repeat(20) })),
  { domain: 'system', name: 'system-proxy', description: '网络代理' },
];

function fixture(size = 8) {
  const tree = createSkillTree(skills);
  return { tree, pager: createTreePager(tree, size) };
}

test('up/down stay on a fixed page; left/right jump whole pages with sticky domains', () => {
  const { pager } = fixture();
  const first = pager.view().rows.map(node => node.value);
  for (let i = 0; i < 30; i++) pager.move(1);
  assert.equal(pager.view().page, 0);
  assert.deepEqual(pager.view().rows.map(node => node.value), first);
  assert.equal(pager.view().cursor, 9);
  pager.turn(1);
  assert.equal(pager.view().page, 1);
  assert.equal(pager.view().rows[1].label, 'dev/');
  assert.equal(pager.view().rows[2].value, 'dev-item-9');
  assert.equal(pager.view().cursor, 2);
  pager.turn(1);
  assert.equal(pager.view().domainPage, 3);
  assert.equal(pager.view().rows[2].value, 'dev-item-17');
  pager.turn(1);
  assert.equal(pager.view().rows[1].label, 'system/');
  assert.equal(pager.view().domainPage, 1);
  pager.turn(1);
  assert.equal(pager.view().page, 3);
  for (let i = 0; i < 10; i++) pager.turn(-1);
  assert.equal(pager.view().page, 0);
});

test('search resets paging, focuses the matching skill and preserves selections', () => {
  const { tree, pager } = fixture();
  pager.move(1); pager.toggle(); // whole dev
  pager.turn(1);
  pager.search('dev-item-17');
  assert.equal(pager.view().page, 0);
  assert.equal(pager.view().rows[pager.view().cursor].value, 'dev-item-17');
  pager.toggle();
  assert.equal(tree.state('@domain:dev'), 'partial');
  pager.search('system');
  assert.equal(pager.view().cursor, 1);
  pager.toggle();
  assert.equal(tree.names().length, 17);
  pager.search('不存在');
  pager.turn(1); pager.move(1); pager.toggle();
  assert.equal(pager.view().rows.length, 0);
  assert.equal(tree.names().length, 17);
  pager.search('');
  assert.equal(pager.view().cursor, 0);
  assert.equal(pager.view().page, 0);
});

test('resizing preserves the focused skill and recomputes page boundaries', () => {
  const { pager } = fixture();
  pager.turn(1); pager.move(3);
  const focused = pager.view().rows[pager.view().cursor].value;
  pager.resize(3);
  assert.equal(pager.view().rows[pager.view().cursor].value, focused);
  assert.equal(pager.view().pageSize, 3);
  assert.equal(pager.view().totalPages, 7);
});

test('rendering has green checkbox styling, explicit branches and a pinned folder on every page', () => {
  const { tree, pager } = fixture();
  tree.toggle('dev-item-9'); pager.turn(1);
  const frame = renderTreePage(tree, pager, { colors: pc.createColors(true) });
  const plain = stripVTControlCharacters(frame);
  assert.match(frame, /\u001b\[32m/);
  assert.match(plain, /└─ ▸ ◩ dev\/  领域/);
  assert.match(plain, /├─ ■ dev-item-9/);
  assert.ok(plain.indexOf('dev/  领域') < plain.indexOf('dev-item-9'));
  assert.match(plain, /第 2\/4 页 · dev\/ 2\/3/);
  assert.equal(plain.split('\n').filter(line => line.includes('中文用途')).length, 1); // only focused row has a description
});

test('narrow frames, long Chinese text and emoji do not overflow or lose tree prefixes', () => {
  const { tree, pager } = fixture(3);
  pager.move(2);
  for (const columns of [24, 40, 80, 120]) {
    const plain = stripVTControlCharacters(renderTreePage(tree, pager, { columns }));
    for (const line of plain.split('\n')) assert.ok(stringWidth(line) < columns, `${columns}: ${line}`);
    assert.match(plain, /│ [ ›] {4}├─/);
  }
  assert.equal(fitTreeText('中文😀abc', 7), '中文😀…');
  assert.equal(fitTreeText('\x1b[31mhello\x1b[0m\nworld', 40), 'hello world');
});

test('real keys page as blocks, preserve search text and carry selection across domains', { timeout: 5000 }, async t => {
  const input = new PassThrough(), output = new PassThrough();
  let rendered = '';
  output.on('data', chunk => { rendered += chunk; });
  t.after(() => { input.destroy(); output.destroy(); });
  const answer = treeSelect({ skills, input, output });
  // 搜索 dev，右翻至第2页选择第9项；左右翻页后继续输入，再跨领域勾选。
  for (const key of ['dev', '\x1b[C', '\t', '\x1b[D', '-item-9', '\x15', 'system', '\t', '\x15', 'proxy', '\r']) {
    input.write(key); await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.deepEqual(await answer, ['dev-item-9', 'system-proxy']);
  assert.ok(rendered.includes('第 2/3 页')); // search dev has 3 pages
  assert.ok(rendered.includes('搜索：dev-item-9'));
  assert.ok(rendered.includes('搜索：proxy'));
});
