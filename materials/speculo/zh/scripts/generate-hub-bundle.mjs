// 仅构建使用的镜像：npm 可能省略点文件／空目录并规范化模式。
// 事实来源仍为 skills-hub/。此产物绝不复制到项目。
import { readFile, rm, writeFile } from 'node:fs/promises';
import { discoverHubCatalog } from '../dist/src/hub-catalog.js';
const output = 'dist/src/hub-resources.json';
const before = await readFile(output).catch(() => null);
await rm(output, { force: true });
try {
  const catalog = await discoverHubCatalog(process.cwd());
  const image = { schema_version: 1, packages: [...catalog.values()].map(skill => ({
    id: skill.id, nodes: [...skill.tree].map(([path, node]) => ({ path, node })),
  })) };
  await writeFile(output, JSON.stringify(image) + '\n');
  console.log(`Hub bundle: ${catalog.size} complete packages (bytes, dotfiles, directories and modes)`);
} catch (error) {
  if (before) await writeFile(output, before);
  throw error;
}
