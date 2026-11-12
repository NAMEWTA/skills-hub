/** 仅在安装清理回退完成后，由 CLI 处理取消。 */
export class InstallCancelled extends Error {
  constructor(public readonly exitCode: 0 | 130 = 130) {
    super("已取消，未应用安装变更。");
    this.name = "InstallCancelled";
  }
}
