#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createInstaller, repositoryRoot, isMain } from '../install.mjs';

// Maintenance-only host verification. The SDK/Claude binary is installed in a
// separate prefix by CI, never added to the published installer's dependencies.
export async function checkClaudeDiscovery(root = repositoryRoot) {
  const prefix = process.env.CLAUDE_AGENT_SDK_PREFIX;
  if (!prefix) throw new Error('请设置 CLAUDE_AGENT_SDK_PREFIX，指向独立安装官方 Claude Agent SDK 的目录');
  const requireSdk = createRequire(path.join(path.resolve(prefix), 'package.json'));
  const { query } = await import(pathToFileURL(requireSdk.resolve('@anthropic-ai/claude-agent-sdk')).href);
  const sdkPackage = JSON.parse(fs.readFileSync(path.join(path.resolve(prefix), 'node_modules/@anthropic-ai/claude-agent-sdk/package.json'), 'utf8'));
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-claude-'));
  const project = path.join(temporary, 'project');
  const config = path.join(temporary, 'config');
  fs.mkdirSync(project);
  fs.mkdirSync(config);
  let session;
  let finishInput;
  let timer;
  try {
    const installer = createInstaller({ repository: root });
    const selected = installer.catalog();
    installer.apply(selected, project);
    // Keep input open without sending a user/model turn. Discovery and file
    // reads go through the actual Claude process's documented control API.
    const inputClosed = new Promise(resolve => { finishInput = resolve; });
    async function* input() { await inputClosed; }
    session = query({
      prompt: input(),
      options: {
        cwd: project,
        settingSources: ['project'],
        persistSession: false,
        permissionMode: 'default',
        permissionPrompts: 'none',
        tools: [],
        env: {
          ...process.env,
          CLAUDE_CONFIG_DIR: config,
          CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
        },
        stderr: text => process.stderr.write(text),
      },
    });
    const timedOut = new Promise((_, reject) => {
      timer = setTimeout(() => {
        session.close();
        reject(new Error('Claude 实际发现与读取检查超过 55 秒'));
      }, 55000);
    });
    const exercise = async () => {
      const init = await session.initializationResult();
      assert.match(init.claude_code_version ?? '', /^2\./, '初始化必须返回实际 Claude Code 版本');
      const commands = await session.supportedCommands();
      const reloaded = await session.reloadSkills();
      const commandNames = new Set(commands.map(command => command.name));
      const reloadedNames = new Set(reloaded.skills.map(skill => skill.name));
      // summary uses local estimates, not the remote token-count API.
      const usage = await session.getContextUsage({ detail: 'summary' });
      const definitions = usage.skills?.skillFrontmatter ?? [];
      const receipts = [];
      for (const skill of selected) {
        assert(commandNames.has(skill.name), `实际 Claude 初始化未发现 ${skill.name}`);
        assert(reloadedNames.has(skill.name), `实际 Claude 重载未发现 ${skill.name}`);
        const canonical = path.join(project, '.agents/skills', skill.name);
        const alias = path.join(project, '.claude/skills', skill.name);
        assert(fs.lstatSync(alias).isSymbolicLink(), `${skill.name} 必须为目录符号链接`);
        assert.equal(fs.realpathSync(alias), fs.realpathSync(canonical));
        const relativeFiles = ['SKILL.md'];
        const references = path.join(canonical, 'references');
        if (fs.existsSync(references)) {
          const resource = fs.readdirSync(references, { withFileTypes: true }).find(entry => entry.isFile() && entry.name.endsWith('.md'));
          if (resource) relativeFiles.push(`references/${resource.name}`);
        }
        for (const relative of relativeFiles) {
          const file = path.join(alias, relative);
          const response = await session.readFile(file, { maxBytes: 1024 * 1024 });
          assert(response, `实际 Claude 未读取链接资源 ${skill.name}/${relative}`);
          assert.notEqual(response.truncated, true, '不能用截断内容证明完整读取');
          assert.equal(response.contents, fs.readFileSync(path.join(canonical, relative), 'utf8'));
          assert.equal(fs.realpathSync(response.absPath), fs.realpathSync(path.join(canonical, relative)));
          receipts.push({
            skill: skill.name,
            resource: relative,
            requestedPath: path.relative(project, file),
            effectivePath: path.relative(project, fs.realpathSync(response.absPath)),
            sha256: createHash('sha256').update(response.contents).digest('hex'),
          });
        }
      }
      const result = {
        status: 'passed',
        sdkVersion: sdkPackage.version,
        claudeCodeVersion: init.claude_code_version,
        platform: process.platform,
        node: process.version,
        skills: selected.length,
        resourcesRead: receipts.length,
        userTurnsSent: 0,
        modelInferenceVerified: false,
        discovery: selected.map(skill => ({
          name: skill.name,
          initialized: commandNames.has(skill.name),
          reloaded: reloadedNames.has(skill.name),
          // Before a model turn the context breakdown can omit definitions;
          // the actual read receipts below still record each effective path.
          contextPath: definitions.find(item => item.name === skill.name)?.path
            ? path.relative(project, definitions.find(item => item.name === skill.name).path)
            : null,
        })),
        receipts,
      };
      console.log(JSON.stringify(result, null, 2));
      return result;
    };
    return await Promise.race([exercise(), timedOut]);
  } finally {
    clearTimeout(timer);
    finishInput?.();
    session?.close();
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  try { await checkClaudeDiscovery(); }
  catch (error) { console.error(error.stack ?? error.message); process.exitCode = 1; }
}
