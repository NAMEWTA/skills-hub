import { AutocompletePrompt } from '@clack/core';
import pc from 'picocolors';
import wrapAnsi from 'wrap-ansi';

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

export function treeSelect({ skills, input = process.stdin, output = process.stdout }) {
  const tree = createSkillTree(skills);
  class TreePrompt extends AutocompletePrompt {
    toggleSelected(value) {
      // 父节点不是安装项；最终值始终只有明确的叶子名称。
      tree.toggle(value);
      this.selectedValues = tree.names();
    }
  }
  return new TreePrompt({ input, output, multiple: true, options: tree.nodes,
    filter: (search, node) => tree.matches(search, node),
    validate: values => !values?.length ? '请至少勾选一个技能。' : undefined,
    render() {
      const count = tree.names().length;
      if (this.state === 'submit') return pc.green(`✓ 已选择 ${count} 个技能`);
      if (this.state === 'cancel') return pc.yellow('已取消树形选择');
      const rows = this.filteredOptions;
      const size = Math.max(1, Math.min(10, (output.rows || 24) - 8));
      const start = Math.max(0, Math.min(this.cursor - Math.floor(size / 2), rows.length - size));
      const width = Math.max(16, (output.columns || 80) - 4);
      const lines = rows.slice(start, start + size).map((node, index) => {
        const marker = { none: '[ ]', all: '[x]', partial: '[-]' }[tree.state(node.value)];
        const prefix = `${start + index === this.cursor ? '›' : ' '} ${'  '.repeat(node.depth)}${marker} `;
        const detail = node.depth < 2 ? ` (${node.names.length} 个技能)` : ` · ${node.hint}`;
        const line = wrapAnsi(`${prefix}${node.label}${detail}`, width, { hard: true }).split('\n')[0];
        return start + index === this.cursor ? pc.cyan(line) : line;
      });
      return [pc.bold('搜索并选择领域 / 技能'), `搜索：${this.userInputWithCursor}`,
        ...(!rows.length ? [pc.yellow('无匹配；退格修改或 Ctrl+U 清空搜索。')] : lines),
        `已选 ${count}/${skills.length} 个技能 · 显示 ${rows.length ? start + 1 : 0}–${Math.min(start + size, rows.length)}/${rows.length} 项`,
        pc.dim('↑/↓ 定位 · Tab 勾选 · Enter 确认 · Ctrl+C 取消'),
        ...(this.state === 'error' ? [pc.red(this.error)] : [])].join('\n');
    },
  }).prompt();
}
