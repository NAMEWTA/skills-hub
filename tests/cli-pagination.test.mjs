import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { stripVTControlCharacters } from 'node:util';
import pc from 'picocolors';
import stringWidth from 'string-width';
import { createSkillTree, createTreePager, renderTreePage, fitTreeText, treeSelect } from '../tree-select.mjs';

const skills = [
  ...Array.from({ length: 41 }, (_, index) => ({ domain: 'dev', name: `dev-item-${index + 1}`, description: '中文用途😀，用于分析与验证。'.repeat(20) })),
  { domain: 'system', name: 'system-proxy', description: '网络代理' },
];

function fixture(size) {
  const tree = createSkillTree(skills);
  return { tree, pager: createTreePager(tree, size) };
}

test('shows collapsed domains first and pages 20 skills within the expanded domain', () => {
  const { pager } = fixture();
  assert.deepEqual(pager.view().rows.map(node => node.value), ['@all', '@domain:dev', '@domain:system']);
  pager.move(1);
  pager.toggleExpanded();
  const first = pager.view().rows.map(node => node.value);
  assert.equal(pager.view().children.length, 20);
  for (let i = 0; i < 30; i++) pager.move(1);
  assert.equal(pager.view().page, 0);
  assert.deepEqual(pager.view().rows.map(node => node.value), first);
  assert.equal(pager.view().rows[pager.view().cursor].value, '@domain:system');
  pager.turn(1);
  assert.equal(pager.view().page, 1);
  assert.equal(pager.view().rows[1].label, 'dev/');
  assert.equal(pager.view().rows[2].value, 'dev-item-21');
  assert.equal(pager.view().cursor, 2);
  pager.turn(1);
  assert.equal(pager.view().rows[2].value, 'dev-item-41');
  pager.turn(1);
  assert.equal(pager.view().page, 2);
  pager.move(1); pager.toggleExpanded();
  assert.equal(pager.view().page, 0);
  assert.equal(pager.view().expanded, '@domain:system');
  assert.deepEqual(pager.view().children.map(node => node.value), ['system-proxy']);
  pager.move(1); pager.toggleExpanded();
  assert.equal(pager.view().rows[pager.view().cursor].value, '@domain:system');
  assert.equal(pager.view().expanded, undefined);
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
  assert.equal(tree.names().length, 41);
  pager.search('不存在');
  pager.turn(1); pager.move(1); pager.toggle();
  assert.equal(pager.view().rows.length, 0);
  assert.equal(tree.names().length, 41);
  pager.search('');
  assert.equal(pager.view().cursor, 0);
  assert.equal(pager.view().page, 0);
});

test('upstream group keeps its Chinese label, search aliases and selection state across pages', () => {
  const skills = [
    { domain: 'dev', name: 'dev-spec', description: '开发规格' },
    { domain: 'upstream-skills', name: 'zh-archify', description: '绘制架构图' },
    { domain: 'upstream-skills', name: 'zh-modern-web-guidance', description: '现代网页开发指引' },
    { domain: 'upstream-skills', name: 'zh-chrome-extensions', description: '浏览器扩展开发' },
  ];
  const tree = createSkillTree(skills), pager = createTreePager(tree, 2);
  const group = '@domain:upstream-skills';
  pager.search('上游独立技能');
  assert.equal(pager.view().rows[pager.view().cursor].value, group);
  assert.equal(pager.view().totalPages, 2);
  pager.toggle();
  assert.equal(tree.state(group), 'all');
  pager.turn(1); pager.toggle(); // 排除第二页的 chrome 技能。
  assert.equal(tree.state(group), 'partial');
  for (const query of ['archify', 'zh-archify', '上游 架构']) {
    pager.search(query);
    assert.equal(pager.view().rows[pager.view().cursor].value, 'zh-archify');
    const frame = stripVTControlCharacters(renderTreePage(tree, pager, { columns: 100 }));
    assert.match(frame, /▾ ◩ upstream-skills\/（上游独立技能）  分组/);
  }
  pager.search('upstream-skills');
  assert.equal(pager.view().rows[pager.view().cursor].value, group);
  pager.toggle(); // 部分选中的父分组补齐全部，包括搜索外的项。
  assert.equal(tree.state(group), 'all');
  pager.search('dev'); pager.toggle();
  assert.equal(tree.state('@all'), 'all');
  tree.toggle('zh-chrome-extensions');
  assert.deepEqual(tree.names(), ['dev-spec', 'zh-archify', 'zh-modern-web-guidance']);
});

test('resizing preserves the focused skill and recomputes page boundaries', () => {
  const { pager } = fixture(8);
  pager.move(1); pager.toggleExpanded();
  pager.turn(1); pager.move(3);
  const focused = pager.view().rows[pager.view().cursor].value;
  pager.resize(3);
  assert.equal(pager.view().rows[pager.view().cursor].value, focused);
  assert.equal(pager.view().pageSize, 3);
  assert.equal(pager.view().totalPages, 14);
});

test('rendering has green checkbox styling, explicit branches and a pinned folder on every page', () => {
  const { tree, pager } = fixture(8);
  pager.move(1); pager.toggleExpanded();
  tree.toggle('dev-item-9'); pager.turn(1);
  const frame = renderTreePage(tree, pager, { colors: pc.createColors(true) });
  const plain = stripVTControlCharacters(frame);
  assert.match(frame, /\u001b\[32m/);
  assert.match(plain, /├─ ▾ ◩ dev\/  领域/);
  assert.match(plain, /├─ ■ dev-item-9/);
  assert.ok(plain.indexOf('dev/  领域') < plain.indexOf('dev-item-9'));
  assert.match(plain, /第 2\/6 页/);
  assert.equal(plain.split('\n').filter(line => line.includes('中文用途')).length, 1); // only focused row has a description
});

test('narrow frames, long Chinese text and emoji do not overflow or lose tree prefixes', () => {
  const { tree, pager } = fixture(3);
  pager.move(1); pager.toggleExpanded(); pager.move(1);
  for (const columns of [24, 40, 80, 120]) {
    const plain = stripVTControlCharacters(renderTreePage(tree, pager, { columns }));
    for (const line of plain.split('\n')) assert.ok(stringWidth(line) < columns, `${columns}: ${line}`);
    assert.match(plain, /│ [ ›] {4}├─/);
  }
  assert.equal(fitTreeText('中文😀abc', 7), '中文😀…');
  assert.equal(fitTreeText('\x1b[31mhello\x1b[0m\nworld', 40), 'hello world');
});

test('real keys reach system from collapsed tree, paginate and preserve selections', { timeout: 5000 }, async t => {
  // 夹具模拟可交互终端，不继承 CI 的 TERM=dumb（readline 会禁用编辑键）。
  const previousTerm = process.env.TERM;
  process.env.TERM = 'xterm-256color';
  t.after(() => {
    if (previousTerm === undefined) delete process.env.TERM;
    else process.env.TERM = previousTerm;
  });
  const input = new PassThrough(), output = new PassThrough();
  output.rows = 16; // 5 frame rows, 3 group/root rows, 8 skills.
  let rendered = '';
  output.on('data', chunk => { rendered += chunk; });
  t.after(() => { input.destroy(); output.destroy(); });
  const answer = treeSelect({ skills, initialNames: ['dev-item-1'], input, output });
  const down = '\x1b[B', up = '\x1b[A';
  for (const key of [down, down, '\t', down, ' ', '\t', up, '\t', '\x1b[C', ' ', '\r']) {
    input.write(key); await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.deepEqual(await answer, ['dev-item-1', 'dev-item-9', 'system-proxy']);
  assert.ok(rendered.includes('第 2/6 页'));
});
