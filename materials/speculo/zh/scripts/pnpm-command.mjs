/** pnpm 可能在 npm_execpath 中提供 JavaScript 入口或原生可执行文件。 */
export function pnpmCommand(args, manager = process.env.npm_execpath) {
  if (!manager?.toLowerCase().includes('pnpm')) throw Error('Run with pnpm');
  return /\.(?:c?js|mjs)$/i.test(manager)
    ? [process.execPath, [manager, ...args]]
    : [manager, args];
}
