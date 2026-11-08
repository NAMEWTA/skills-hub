import * as prompts from '@clack/prompts';
import pc from 'picocolors';
import stringWidth from 'string-width';
import wrapAnsi from 'wrap-ansi';
import { createInstaller, select, main } from './install.mjs';

export function formatSummary(names, columns = process.stdout.columns ?? 80) {
  const width = Math.max(20, Math.min(columns - 8, 100));
  const label = '已选择';
  return wrapAnsi(`${pc.bold(label)}${' '.repeat(Math.max(1, 8 - stringWidth(label)))}${names.join('、')}`, width, { hard: true });
}

export async function interactive({ argv = [], project = process.cwd(), ui = prompts } = {}) {
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
    const mode = await ask(ui.select({ message: '如何选择？', options: [
      { value: 'domain', label: '按领域安装' },
      { value: 'skill', label: '选择特定技能' },
      { value: 'all', label: '安装全部技能' },
    ] }));
    let domains = [], names = [];
    if (mode === 'domain') domains = await ask(ui.multiselect({ message: '选择领域（空格勾选，回车继续）', required: true,
      options: [...new Set(skills.map(skill => skill.domain))].map(domain => ({ value: domain, label: domain, hint: `${skills.filter(skill => skill.domain === domain).length} 个技能` })) }));
    if (mode === 'skill') names = await ask(ui.multiselect({ message: '选择技能（空格勾选，回车继续）', required: true,
      options: skills.map(skill => ({ value: skill.name, label: skill.name, hint: skill.domain })) }));
    const selected = select(skills, domains, names, mode === 'all');
    ui.note(formatSummary(selected.map(skill => skill.name)), `${selected.length} 个技能`);
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
