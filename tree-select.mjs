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

export function createSkillTree(skills, initialNames = []) {
  const installed = new Set(initialNames);
  const selected = new Set(skills.filter(skill => installed.has(skill.name)).map(skill => skill.name));
  const root = { value: '@all', label: '全部技能', depth: 0, names: skills.map(skill => skill.name) };
  const nodes = [root];
  for (const domain of [...new Set(skills.map(skill => skill.domain))]) {
    const children = skills.filter(skill => skill.domain === domain);
    const upstream = domain === 'upstream-skills';
    const label = upstream ? `${domain}/（上游独立技能）` : `${domain}/`;
    nodes.push({ value: `@domain:${domain}`, label, depth: 1, groupType: upstream ? '分组' : '领域', names: children.map(skill => skill.name) });
    nodes.push(...children.map(skill => ({ value: skill.name, label: skill.name, depth: 2,
      domain: `@domain:${domain}`, hint: `${label} · ${skill.description ?? ''}`, names: [skill.name] })));
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

const maxPageSize = 20;
const frameOverhead = 5;

export function createTreePager(tree, pageSize = maxPageSize) {
  const [root] = tree.nodes;
  const domains = tree.nodes.filter(node => node.depth === 1);
  let query = '', size = Math.max(1, pageSize), page = 0, focus = root.value, expanded;
  const matchingDomains = () => domains.filter(node => tree.matches(query, node));
  const matchingChildren = () => expanded
    ? tree.nodes.filter(node => node.domain === expanded && tree.matches(query, node)) : [];
  function view() {
    const groups = matchingDomains();
    const matching = matchingChildren();
    const children = matching.slice(page * size, (page + 1) * size);
    const rows = groups.length ? [root, ...groups.flatMap(domain =>
      domain.value === expanded ? [domain, ...children] : [domain])] : [];
    const cursor = rows.findIndex(node => node.value === focus);
    return { rows, cursor, page, totalPages: Math.ceil(matching.length / size), query,
      pageSize: size, expanded, groups, children };
  }
  function clearSearch() {
    query = '';
    page = 0;
    focus = root.value;
    expanded = undefined;
  }
  return {
    view,
    clearSearch,
    search(value) {
      if (value === query) return;
      if (!value.trim()) {
        clearSearch();
        return;
      }
      query = value;
      page = 0;
      focus = root.value;
      const domain = matchingDomains()[0];
      expanded = domain?.value;
      if (domain && !matchesSkillSearch(query, root)) {
        focus = matchesSkillSearch(query, domain) ? domain.value : matchingChildren()[0]?.value ?? domain.value;
      }
    },
    resize(value) {
      const nextSize = Math.max(1, value);
      if (size === nextSize) return;
      const index = matchingChildren().findIndex(node => node.value === focus);
      page = Math.floor((index === -1 ? page * size : index) / nextSize);
      size = nextSize;
    },
    move(direction) {
      const current = view();
      const index = Math.max(0, Math.min(current.cursor + direction, current.rows.length - 1));
      focus = current.rows[index]?.value ?? focus;
    },
    turn(direction) {
      const { totalPages } = view();
      const next = Math.max(0, Math.min(page + direction, totalPages - 1));
      if (next === page) return;
      page = next;
      focus = view().children[0].value;
    },
    toggleExpanded() {
      const current = view();
      const node = current.rows[current.cursor];
      const domain = node?.depth === 1 ? node.value : node?.domain;
      if (!domain) return;
      expanded = domain === expanded ? undefined : domain;
      focus = domain;
      page = 0;
    },
    toggle() {
      const current = view();
      const focused = current.rows[current.cursor];
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

export function renderTreePage(tree, pager, { columns = 80, rows = Infinity, colors = pc, error = '', editing = false } = {}) {
  const c = colors, view = pager.view(), width = Math.max(1, columns - 1);
  const line = (text, style = value => value) => style(fitTreeText(text, width));
  const lines = [line('◆ 选择安装技能', c.green), line(editing
    ? `│ 搜索：${view.query} ▌` : `│ / 搜索${view.query ? ` · ${view.query}` : ''}`)];
  const available = Math.max(1, rows - frameOverhead);
  const start = Math.max(0, Math.min(view.cursor - available + 1, view.rows.length - available));
  const selected = new Set(tree.names());
  for (const [offset, node] of view.rows.slice(start, start + available).entries()) {
    const index = start + offset;
    const active = index === view.cursor;
    const state = tree.state(node.value);
    const marker = { none: '□', all: '■', partial: '◩' }[state];
    const branch = node.depth === 0 ? '◆ '
      : node.depth === 1 ? `${node === view.groups.at(-1) ? '└─' : '├─'} ${node.value === view.expanded ? '▾' : '▸'} `
        : node === view.children.at(-1) ? '   └─ ' : '   ├─ ';
    const prefix = `│ ${active ? '›' : ' '} ${branch}${marker} `;
    const suffix = node.depth < 2 ? `  ${node.names.filter(name => selected.has(name)).length}/${node.names.length}` : '';
    const name = node.depth < 2 ? `${node.label}${node.depth === 1 ? `  ${node.groupType}` : ''}` : node.label;
    if (stringWidth(prefix) >= width) {
      lines.push(line(`${prefix}${name}`, active ? c.green : c.dim));
      continue;
    }
    const label = fitTreeText(`${prefix}${name}${suffix}`, width).slice(prefix.length);
    // 行首保留非空树枝，避免折行工具裁掉缩进；目录与技能有不同图标和颜色。
    lines.push(c.gray(prefix.slice(0, -2)) + (state === 'none' ? c.dim(`${marker} `) : c.green(`${marker} `))
      + (node.depth < 2 ? c.bold(active ? c.green(label) : c.cyan(label)) : active ? c.green(label) : label));
  }
  const focused = view.rows[view.cursor];
  const detail = focused?.depth === 2 ? focused.hint : '空格勾选整组，包括其他页和筛选隐藏项。';
  const page = view.totalPages ? ` · 第 ${view.page + 1}/${view.totalPages} 页` : '';
  lines.push(line(error ? `│ ${error}` : focused ? `│ ${detail}` : '│ 无匹配，按 / 修改或 Ctrl+U 清空。', error ? c.red : focused ? c.dim : c.yellow),
    line(`│ 已选 ${selected.size} 个${page}${editing ? ' · 输入关键词，空格分隔' : ' · ↑/↓ 移动 · ←/→ 翻页'}`, c.green),
    line(editing ? '└ Enter 返回树 · Ctrl+U 清空 · Ctrl+C 取消'
      : '└ Tab 展开/收拢 · 空格勾选 · Enter 确认 · Ctrl+U 清空 · Ctrl+C 取消', c.dim));
  return lines.join('\n');
}

export function treeSelect({ skills, initialNames = [], input = process.stdin, output = process.stdout }) {
  const tree = createSkillTree(skills, initialNames);
  const pager = createTreePager(tree);
  class TreePrompt extends Prompt {
    constructor() {
      super({ input, output,
        render() {
          if (this.state === 'submit') return pc.green(`◇ 已选择 ${tree.names().length} 个技能`);
          if (this.state === 'cancel') return pc.yellow('◇ 已取消树形选择');
          const rows = output.rows || 24;
          pager.resize(Math.min(maxPageSize, rows - frameOverhead - 1 - pager.view().groups.length));
          return renderTreePage(tree, pager, { rows, columns: output.columns || 80,
            error: this.state === 'error' ? this.error : '', editing: this.editing });
        },
      });
      this.editing = false;
      this.value = tree.names();
      this.on('userInput', value => {
        if (this.editing) pager.search(value);
      });
      this.on('key', (character, key) => {
        if (key.ctrl && key.name === 'u') pager.clearSearch();
        if (this.editing) return;
        if (character === '/') {
          const { query } = pager.view();
          this._clearUserInput();
          this.editing = true;
          this._setUserInput(query, true);
        }
        if (key.name === 'up' || key.name === 'down') pager.move(key.name === 'up' ? -1 : 1);
        if (key.name === 'left' || key.name === 'right') pager.turn(key.name === 'left' ? -1 : 1);
        if (key.name === 'tab') pager.toggleExpanded();
        if (key.name === 'space') pager.toggle();
        this.value = tree.names();
      });
    }
    _shouldSubmit() {
      if (this.editing) {
        this.editing = false;
        return false;
      }
      if (this.value.length) return true;
      this.error = '请至少勾选一个技能。';
      this.state = 'error';
      return false;
    }
  }
  return new TreePrompt().prompt();
}
