import { Prompt } from '@clack/core';
import pc from 'picocolors';
import stringWidth from 'string-width';
import { stripVTControlCharacters } from 'node:util';

// 非连续字符匹配，支持中文、全角英文和多关键词，不做拼音转换或拼写纠错。
export function matchesSkillSearch(search, option) {
  const normalize = value => String(value ?? '').normalize('NFKC').toLowerCase();
  const text = normalize(`${option.label ?? option.value} ${option.hint ?? ''}`);
  return normalize(search).trim().split(/\s+/u).filter(Boolean).every(term => {
    let position = 0;
    for (const character of term) {
      const found = text.indexOf(character, position);
      if (found === -1) return false;
      position = found + character.length;
    }
    return true;
  });
}

export function createSkillTree(skills) {
  const selected = new Set();
  const root = { value: '@all', label: '全部技能', depth: 0, names: skills.map(skill => skill.name) };
  const nodes = [root];
  for (const domain of [...new Set(skills.map(skill => skill.domain))]) {
    const children = skills.filter(skill => skill.domain === domain);
    nodes.push({ value: `@domain:${domain}`, label: `${domain}/`, depth: 1, names: children.map(skill => skill.name) });
    nodes.push(...children.map(skill => ({ value: skill.name, label: skill.name, depth: 2,
      domain: `@domain:${domain}`, hint: `${domain} · ${skill.description ?? ''}`, names: [skill.name] })));
  }
  const byValue = new Map(nodes.map(node => [node.value, node]));
  return {
    nodes,
    names: () => skills.filter(skill => selected.has(skill.name)).map(skill => skill.name),
    state(value) {
      const names = byValue.get(value)?.names ?? [];
      const count = names.filter(name => selected.has(name)).length;
      return count === 0 ? 'none' : count === names.length ? 'all' : 'partial';
    },
    toggle(value) {
      const node = byValue.get(value);
      if (!node) throw new Error(`未知树节点：${value}`);
      const remove = node.names.every(name => selected.has(name));
      for (const name of node.names) { if (remove) selected.delete(name); else selected.add(name); }
    },
    matches(search, node) {
      if (matchesSkillSearch(search, root)) return true;
      if (node.depth === 0) return false;
      if (matchesSkillSearch(search, node)) return true;
      if (node.depth === 2) return matchesSkillSearch(search, byValue.get(node.domain));
      return nodes.some(child => child.domain === node.value && matchesSkillSearch(search, child));
    },
  };
}

// 每页只属于一个领域；领域行始终置顶且可勾选，不与子项一起滚出屏幕。
export function createTreePager(tree, pageSize = 8) {
  let query = '', size = Math.max(1, pageSize), page = 0, cursor = 0;
  function pages() {
    const result = [];
    for (const domain of tree.nodes.filter(node => node.depth === 1)) {
      const children = tree.nodes.filter(node => node.domain === domain.value && tree.matches(query, node));
      for (let start = 0; start < children.length; start += size) {
        result.push({ domain, children: children.slice(start, start + size),
          domainPage: Math.floor(start / size) + 1, domainPages: Math.ceil(children.length / size) });
      }
    }
    return result;
  }
  function view() {
    const all = pages();
    page = Math.max(0, Math.min(page, all.length - 1));
    const current = all[page];
    const rows = current ? [tree.nodes[0], current.domain, ...current.children] : [];
    cursor = Math.max(0, Math.min(cursor, rows.length - 1));
    return { ...current, rows, cursor, page, totalPages: all.length, query, pageSize: size };
  }
  return {
    view,
    search(value) {
      if (value === query) return;
      query = value; page = 0; cursor = 0;
      const current = view();
      if (query.trim() && current.rows.length) {
        cursor = matchesSkillSearch(query, tree.nodes[0]) ? 0
          : matchesSkillSearch(query, current.domain) ? 1 : 2;
      }
    },
    resize(value) {
      if (size === value) return;
      const before = view();
      const focused = before.rows[cursor]?.value;
      size = Math.max(1, value);
      const all = pages();
      const target = all.findIndex(item => item.children.some(node => node.value === focused)
        || ((focused === '@all' || focused === before.domain?.value) && item.domain.value === before.domain?.value));
      if (target !== -1) page = target;
      const current = view();
      const index = current.rows.findIndex(node => node.value === focused);
      if (index !== -1) cursor = index;
    },
    move(direction) {
      const current = view();
      cursor = Math.max(0, Math.min(cursor + direction, current.rows.length - 1));
    },
    turn(direction) {
      const current = view();
      const next = Math.max(0, Math.min(page + direction, current.totalPages - 1));
      if (next !== page) { page = next; cursor = 2; }
    },
    toggle() {
      const focused = view().rows[cursor];
      if (focused) tree.toggle(focused.value);
    },
  };
}

const graphemes = new Intl.Segmenter('zh', { granularity: 'grapheme' });
export function fitTreeText(value, width) {
  const text = stripVTControlCharacters(String(value)).replace(/[\u0000-\u001f\u007f]/g, ' ');
  if (stringWidth(text) <= width) return text;
  let result = '', used = 0;
  for (const { segment } of graphemes.segment(text)) {
    const length = stringWidth(segment);
    if (used + length > width - 1) break;
    result += segment; used += length;
  }
  return `${result}…`;
}

export function renderTreePage(tree, pager, { columns = 80, colors = pc, error = '' } = {}) {
  const c = colors, view = pager.view(), width = Math.max(12, columns - 1);
  const line = (text, style = value => value) => style(fitTreeText(text, width));
  const lines = [line('◆ 搜索并选择领域 / 技能', c.green), line(`│ 搜索：${view.query || '输入名称 / 用途'} ▌`), '│'];
  for (const [index, node] of view.rows.entries()) {
    const active = index === view.cursor;
    const state = tree.state(node.value);
    const marker = { none: '□', all: '■', partial: '◩' }[state];
    const branch = node.depth === 0 ? '◆ ' : node.depth === 1 ? '└─ ▸ '
      : index === view.rows.length - 1 ? '   └─ ' : '   ├─ ';
    const prefix = `│ ${active ? '›' : ' '} ${branch}${marker} `;
    const suffix = node.depth < 2 ? `  ${node.names.filter(name => tree.names().includes(name)).length}/${node.names.length}` : '';
    const name = node.depth < 2 ? `${node.label}${node.depth === 1 ? '  领域' : ''}` : node.label;
    const label = fitTreeText(`${prefix}${name}${suffix}`, width).slice(prefix.length);
    // 行首保留非空树枝，避免折行工具裁掉缩进；目录与技能有不同图标和颜色。
    lines.push(c.gray(prefix.slice(0, -2)) + (state === 'none' ? c.dim(`${marker} `) : c.green(`${marker} `))
      + (node.depth < 2 ? c.bold(active ? c.green(label) : c.cyan(label)) : active ? c.green(label) : label));
  }
  if (!view.rows.length) lines.push(line('│ 无匹配；退格修改或 Ctrl+U 清空搜索。', c.yellow));
  const focused = view.rows[view.cursor];
  const detail = focused?.depth === 2 ? focused.hint
    : focused ? '勾选将操作全部子技能，包括其他页和搜索隐藏项。' : '输入其他关键词以继续选择。';
  lines.push('│', line(`│ ${focused?.label ?? '搜索提示'} · ${view.domain?.label ?? '—'}`, c.dim),
    line(`│ ${detail}`, c.dim),
    line(`│ 第 ${view.totalPages ? view.page + 1 : 0}/${view.totalPages} 页 · ${view.domain?.label ?? '—'} ${view.domainPage ?? 0}/${view.domainPages ?? 0} · 已选 ${tree.names().length} 个`, c.green),
    line(error ? `│ ${error}` : '│ ←/→ 整页翻页 · ↑/↓ 页内移动', error ? c.red : c.dim),
    line('└ Tab 勾选 · Enter 确认 · Ctrl+C 取消', c.dim));
  return lines.join('\n');
}

export function treeSelect({ skills, input = process.stdin, output = process.stdout }) {
  const tree = createSkillTree(skills);
  const pageSize = () => Math.max(1, Math.min(8, (output.rows || 24) - 13));
  const pager = createTreePager(tree, pageSize());
  class TreePrompt extends Prompt {
    constructor() {
      super({ input, output,
        render() {
          if (this.state === 'submit') return pc.green(`◇ 已选择 ${tree.names().length} 个技能`);
          if (this.state === 'cancel') return pc.yellow('◇ 已取消树形选择');
          pager.resize(pageSize());
          return renderTreePage(tree, pager, { columns: output.columns || 80, error: this.state === 'error' ? this.error : '' });
        },
      });
      this.value = [];
      this.on('userInput', value => pager.search(value));
      this.on('key', (character, key) => {
        if (key.name === 'up' || key.name === 'down') pager.move(key.name === 'up' ? -1 : 1);
        if (key.name === 'left' || key.name === 'right') {
          pager.turn(key.name === 'left' ? -1 : 1);
          // 左右键被分页占用，不让 readline 光标移动后将搜索文字插到中间。
          if (this.rl) this.rl.cursor = this.rl.line.length;
        }
        if (key.name === 'tab' || (key.name === 'space' && !pager.view().query.trim())) pager.toggle();
        this.value = tree.names();
      });
    }
    _isActionKey(character, key) {
      return key.name === 'tab' || (key.name === 'space' && !pager.view().query.trim());
    }
    _shouldSubmit() {
      if (this.value.length) return true;
      this.error = '请至少勾选一个技能。';
      this.state = 'error';
      return false;
    }
  }
  return new TreePrompt().prompt();
}
