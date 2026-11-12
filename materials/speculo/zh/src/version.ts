import { valid } from "semver";
import { readFile } from "node:fs/promises";
import { fetchRelease, isNewerRelease } from "./update-check.js";
import { join } from "node:path";

export type VersionInfo = {
  local: string;
  latest: string | null;
  isOutdated: boolean;
};

export const isLocalOutdated = isNewerRelease;

/** 版本 2 和 3 共用安装器元数据；工作流文档为不透明数据。 */
export function isSupportedInstallVersion(value: unknown): value is string {
  return typeof value === "string" && valid(value) !== null && /^[23]\./.test(value) && value.trim() === value;
}

export async function getLocalVersion(packageRoot: string): Promise<string> {
  const packagePath = join(packageRoot, "package.json");
  const raw = await readFile(packagePath, "utf8");
  const packageJson = JSON.parse(raw) as { version: string };
  if (!packageJson.version || typeof packageJson.version !== "string") {
    throw new Error("Missing or invalid version in " + packagePath);
  }
  return packageJson.version;
}

export async function fetchLatestVersion(packageName: string): Promise<string | null> {
  return (await fetchRelease(packageName))?.version ?? null;
}

export async function checkForUpdate(
  packageRoot: string,
  packageName: string
): Promise<VersionInfo> {
  const local = await getLocalVersion(packageRoot);
  const latest = await fetchLatestVersion(packageName);
  const isOutdated = latest !== null && isLocalOutdated(local, latest);

  return { local, latest, isOutdated };
}

export function formatVersionBanner(info: VersionInfo): string {
  const lines: string[] = [];
  lines.push("");
  lines.push("  Speculo v" + info.local);

  if (info.latest !== null) {
    if (info.isOutdated) {
      lines.push("  最新版本: v" + info.latest + "（已有新版本可用！）");
      lines.push("  升级命令: npm i -g @namewta/speculo@" + info.latest);
    } else {
      lines.push("  已是最新版本 ✓");
    }
  }

  lines.push("");
  return lines.join("\n");
}
