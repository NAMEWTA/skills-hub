import * as prompts from '@clack/prompts';
import pc from 'picocolors';
import stringWidth from 'string-width';
import wrapAnsi from 'wrap-ansi';
import { join } from 'node:path';
import { createInstaller, select, main, readUtf8, repositoryRoot } from './install.mjs';
import { isNpmInstallation, checkLatestVersion, installUpdate } from './scripts/update-cli.mjs';
import { treeSelect } from './tree-select.mjs';
export { matchesSkillSearch } from './tree-select.mjs';

export function formatSummary(names, columns = process.stdout.columns ?? 80) {
  const width = Math.max(20, Math.min(columns - 8, 100));
  const label = '已选择';
  return wrapAnsi(`${pc.bold(label)}${' '.repeat(Math.max(1, 8 - stringWidth(label)))}${names.join('、')}`, width, { hard: true });
}

export async function interactive({ argv = [], project = process.cwd(), ui = prompts, choose = treeSelect,
  requestVersion = isNpmInstallation(repositoryRoot) ? fetch : undefined, update = installUpdate } = {}) {
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
    const dryRun = argv.includes('--dry-run');
    const { version } = JSON.parse(readUtf8(join(repositoryRoot, 'package.json')));
    ui.note(version, '当前版本号');
    if (requestVersion && !dryRun) {
      const result = await checkLatestVersion(version, requestVersion);
      ui.note(result?.latest ?? '未检测到最新版本号', '最新版本号');
      if (result?.hasUpdate && await ask(ui.select({
        message: '是否现在更新？',
        options: [{ value: true, label: '是，立即更新' }, { value: false, label: '否，直接进入' }],
        initialValue: false,
      }))) {
        try { return update(result.latest, { root: repositoryRoot, project, argv }); }
        catch (error) { ui.note(error.message, '更新失败，可以继续使用当前版本'); }
      }
    }
    ui.note(project, '目标项目（技能写入 .agents/skills/）');
    const installer = createInstaller();
    const skills = installer.catalog();
    const initialNames = installer.installedNames(skills, project);
    if (initialNames.length) ui.note(`已预选 ${initialNames.length} 个已安装技能。`, '当前项目');
    const names = await ask(choose({ skills, initialNames }));
    const selected = select(skills, [], names);
    if (!selected.length) throw new Error('请至少勾选一个技能。');
    ui.note(formatSummary(selected.map(skill => skill.name)), `${selected.length} 个技能`);
    if (selected.some(skill => ['dev', 'system', 'ops'].includes(skill.domain))) {
      ui.note('将补齐所选领域的持久化目录和简短 AGENTS.md；固定模板自动更新，业务记录保留，预览不写入。', '领域初始化');
    }
    if (selected.some(skill => skill.domain === 'system')) {
      ui.note('如缺少规则，将在项目根 .gitignore 追加 /.agents/system/ignore/。', '系统附件');
    }
    if (selected.some(skill => skill.domain === 'dev')) {
      ui.note('如缺少规则，将在项目根 .gitignore 追加 /.agents/dev/worktree/。', '开发工作树');
    }
    if (!await ask(ui.confirm({ message: dryRun ? '检查安装计划？（不写入文件）' : '安装或更新以上技能？（有差异的现有技能会先备份）', initialValue: true }))) {
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
    ui.outro(code === 0 ? pc.green(dryRun ? '预览完成，未写入文件。' : '安装完成。') : pc.red('安装失败；请检查以上路径、权限或运行错误。'));
    return code;
  } catch (error) { if (error instanceof Cancelled) return 0; throw error; }
}
class Cancelled extends Error {}
