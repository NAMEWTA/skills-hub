import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { isCancel } from '@clack/prompts';
import { createSkillTree, treeSelect } from '../tree-select.mjs';

const skills = [
  { domain: 'dev', name: 'dev-spec', description: '开发规格' },
  { domain: 'dev', name: 'dev-build', description: '实现功能' },
  { domain: 'system', name: 'system-proxy', description: '网络代理' },
];

test('domain/all states derive from leaves and partial groups toggle to full', () => {
  const tree = createSkillTree(skills);
  assert.equal(tree.state('@all'), 'none');
  tree.toggle('@domain:dev');
  assert.deepEqual(tree.names(), ['dev-spec', 'dev-build']);
  assert.equal(tree.state('@domain:dev'), 'all');
  assert.equal(tree.state('@all'), 'partial');
  tree.toggle('dev-spec');
  assert.equal(tree.state('@domain:dev'), 'partial');
  tree.toggle('system-proxy');
  assert.deepEqual(tree.names(), ['dev-build', 'system-proxy']);
  tree.toggle('@domain:dev');
  assert.equal(tree.state('@all'), 'all');
  tree.toggle('@all');
  assert.deepEqual(tree.names(), []);
  tree.toggle('@all'); tree.toggle('dev-build');
  assert.equal(tree.state('@all'), 'partial');
  assert.throws(() => tree.toggle('@missing'), /未知树节点/);
});

test('search matches domains, leaves and Chinese purposes while retaining parent context', () => {
  const tree = createSkillTree(skills);
  const matches = query => tree.nodes.filter(node => tree.matches(query, node)).map(node => node.value);
  assert.deepEqual(matches('dev'), ['@domain:dev', 'dev-spec', 'dev-build']);
  assert.deepEqual(matches('规格'), ['@domain:dev', 'dev-spec']);
  assert.deepEqual(matches('sys proxy'), ['@domain:system', 'system-proxy']);
  assert.deepEqual(matches('不存在'), []);
  assert.equal(matches('').length, 6);
  // 搜索只见一个叶子时，父节点依然控制整个领域。
  tree.toggle(matches('规格')[0]);
  assert.deepEqual(tree.names(), ['dev-spec', 'dev-build']);
});

async function searchKeys(t, keys, catalog = skills) {
  const input = new PassThrough(), output = new PassThrough();
  let rendered = '';
  output.on('data', chunk => { rendered += chunk; });
  t.after(() => { input.destroy(); output.destroy(); });
  const result = treeSelect({ skills: catalog, input, output });
  for (const key of keys) {
    input.write(key);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return { values: await result, rendered };
}
const down = '\x1b[B';

test('real tree prompt mixes a domain with a leaf, excludes a child and retains selections across searches', { timeout: 5000 }, async t => {
  const { values, rendered } = await searchKeys(t, ['dev', '\t', '\x15', 'spec', down, '\t', '\x15', '代理', down, '\t', '\r']);
  assert.deepEqual(values, ['dev-build', 'system-proxy']);
  assert.ok(rendered.includes('◩'));
});

test('real tree prompt handles all, deselect child, no matches and full reset', { timeout: 5000 }, async t => {
  const { values, rendered } = await searchKeys(t, ['\t', '不存在', '\t', '\x15', 'build', down, '\t', '\r']);
  assert.deepEqual(values, ['dev-spec', 'system-proxy']);
  assert.ok(rendered.includes('无匹配'));
});

test('real tree prompt rejects empty confirmation and supports cancellation', { timeout: 5000 }, async t => {
  const { values, rendered } = await searchKeys(t, ['\r', '规格', '\x03']);
  assert.ok(isCancel(values));
  assert.ok(rendered.includes('请至少勾选一个技能'));
});
