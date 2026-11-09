import * as prompts from '@clack/prompts';
import pc from 'picocolors';
import stringWidth from 'string-width';
import wrapAnsi from 'wrap-ansi';
import { createInstaller, select, main } from './install.mjs';
import { treeSelect } from './tree-select.mjs';
export { matchesSkillSearch } from './tree-select.mjs';

export function formatSummary(names, columns = process.stdout.columns ?? 80) {
  const width = Math.max(20, Math.min(columns - 8, 100));
  const label = '已选择';
  return wrapAnsi(`${pc.bold(label)}${' '.repeat(Math.max(1, 8 - stringWidth(label)))}${names.join('、')}`, width, { hard: true });
}

export async function interactive({ argv = [], project = process.cwd(), ui = prompts, choose = treeSelect } = {}) {
  if (argv.some(value => !['install', '--replace', '--dry-run'].includes(value))) {
    throw new Error('交互安装只接受 install、--replace 和 --dry-run。');
  }
  const ask = async promise => {
    const value = await promise;
    if (ui.isCancel(value)) { ui.cancel('已取消，未修改文件。'); throw new Cancelled(); }
    return value;
  };
  try {
    ui.intro(pc.cyan('skills-hub · 按需安装中文技能'));
    ui.note(project, '目标项目（技能写入 .agents/skills/）');
    const skills = createInstaller().catalog();
    ui.note('↑/↓ 页内移动，←/→ 整页翻页，Tab 勾选，Enter 确认。\n直接输入搜索；勾选领域包含其他页和隐藏子项，可再取消个别技能。\n■ 全选 · ◩ 部分选中 · □ 未选；Ctrl+U 清空搜索。', '树形搜索多选');
    const names = await ask(choose({ skills }));
    const selected = select(skills, [], names);
    if (!selected.length) throw new Error('请至少勾选一个技能。');
    ui.note(formatSummary(selected.map(skill => skill.name)), `${selected.length} 个技能`);
    if (selected.some(skill => ['dev', 'system'].includes(skill.domain))) {
      ui.note('将补齐所选领域的持久化目录和简短 AGENTS.md；固定模板自动更新，业务记录保留，预览不写入。', '领域初始化');
    }
    const dryRun = argv.includes('--dry-run');
    if (!await ask(ui.confirm({ message: dryRun ? '检查安装计划？（不写入文件）' : '安装以上技能？', initialValue: true }))) {
      ui.cancel('已取消，未修改文件。'); return 0;
    }
    const command = ['install', '--skill', ...selected.map(skill => skill.name)];
    if (argv.includes('--replace')) command.push('--replace');
    if (dryRun) command.push('--dry-run');
    const spinner = ui.spinner();
    const output = [];
    spinner.start(dryRun ? '正在检查计划' : '正在安装');
    let code;
    try { code = main(command, { project, stdout: line => output.push(line), stderr: line => output.push(pc.red(line)) }); }
    finally { spinner.stop('检查与文件操作结束'); }
    ui.note(output.join('\n'), '结果');
    ui.outro(code === 0 ? pc.green(dryRun ? '预览完成，未写入文件。' : '安装完成。') : pc.red('安装失败；请检查以上错误，内容冲突需核对后显式使用 --replace。'));
    return code;
  } catch (error) { if (error instanceof Cancelled) return 0; throw error; }
}
class Cancelled extends Error {}
