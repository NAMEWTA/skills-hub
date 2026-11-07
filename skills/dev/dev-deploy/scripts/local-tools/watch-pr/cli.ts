import { setTimeout as delay } from "node:timers/promises";
import {
  Command,
  CommanderError,
  InvalidArgumentError,
  Option,
} from "commander";
import {
  GhGitHubReader,
  WatcherQueryError,
  discoverStack,
  resolveContext,
} from "./github.ts";
import {
  runQueued,
  runSimple,
  statusQueryVerdict,
  verdictFactory,
  type WatchClock,
} from "./policy.ts";
import { renderJson, renderPretty } from "./render.ts";
import type * as T from "./types.ts";
import { nonEmpty, parsePrNumber } from "./types.ts";
export interface CliOptions {
  readonly owner: string | null;
  readonly repo: string | null;
  readonly pr: T.PrNumber | null;
  readonly mode: T.WatchMode;
  readonly stackPrs: readonly T.PrNumber[];
  readonly statusOnly: boolean;
  readonly pretty: boolean;
  readonly polling: T.PollingOptions;
}
function positiveNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0)
    throw new InvalidArgumentError("必须大于零");
  return parsed;
}
function nonNegativeNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0)
    throw new InvalidArgumentError("必须大于或等于零");
  return parsed;
}
function positiveInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0)
    throw new InvalidArgumentError("必须是正整数");
  return parsed;
}
function prNumber(value: string): T.PrNumber {
  try {
    return parsePrNumber(Number(value.replace(/^#/, "")));
  } catch {
    throw new InvalidArgumentError("必须是正整数");
  }
}
function stackPrList(value: string): T.NonEmpty<T.PrNumber> {
  const numbers = value.split(",").map((part) => prNumber(part.trim()));
  if (new Set(numbers).size !== numbers.length)
    throw new InvalidArgumentError("包含重复的 PR");
  const parsed = nonEmpty(numbers);
  if (parsed === null) throw new InvalidArgumentError("不能为空");
  return parsed;
}
interface RawOptions {
  readonly owner?: string;
  readonly repo?: string;
  readonly pr?: T.PrNumber;
  readonly stack: boolean;
  readonly queuedStack: boolean;
  readonly stackPrs?: T.NonEmpty<T.PrNumber>;
  readonly interval: number;
  readonly sweepInterval: number;
  readonly timeout: number;
  readonly maxQueryErrors: number;
  readonly statusOnly: boolean;
  readonly allowDraft: boolean;
  readonly pretty: boolean;
}
export function parseArgs(
  argv: readonly string[],
  io: Pick<CliRuntime, "stdout" | "stderr">
): CliOptions {
  const program = new Command("watch-pr")
    .description(
      "观察一个 PR、相连的 PR 堆叠，或固定的队列堆叠。\n默认输出 JSON（轮询时为 NDJSON）；--pretty 输出供人阅读的文字。"
    )
    .configureOutput({
      writeOut: (value) => io.stdout(value
        .replace(/^Usage:/gm, "用法：")
        .replace(/^Options:/gm, "选项：")
        .replace(/\(default: ([^)]+)\)/g, "（默认：$1）")),
      writeErr: io.stderr,
    })
    .helpOption("-h, --help", "显示命令帮助")
    .exitOverride()
    .option("--owner <owner>", "GitHub 仓库所有者")
    .option("--repo <repo>", "GitHub 仓库名称")
    .option("--pr <number>", "PR 编号", prNumber)
    .addOption(
      new Option("--stack", "观察相连且尚未关闭的 PR 堆叠")
        .default(false)
        .conflicts("queuedStack")
    )
    .option(
      "--queued-stack",
      "观察已记录的堆叠，直到全部 PR 合并",
      false
    )
    .option(
      "--stack-prs <n,...>",
      "固定的自底向上队列（仅队列模式）",
      stackPrList
    )
    .option("--interval <seconds>", "轮询间隔", positiveNumber, 60)
    .option(
      "--sweep-interval <seconds>",
      "完整堆叠扫描间隔",
      positiveNumber,
      300
    )
    .option(
      "--timeout <seconds>",
      "截止时间；0 表示不设截止时间",
      nonNegativeNumber,
      0
    )
    .option(
      "--max-query-errors <count>",
      "连续查询错误的允许次数",
      positiveInteger,
      5
    )
    .option("--status-only", "输出一次状态表并以 0 退出", false)
    .option("--allow-draft", "不把草稿状态作为合并门槛", false)
    .option("--pretty", "输出供人阅读的文字，不输出 JSON", false);
  program.parse(argv, { from: "user" });
  const raw = program.opts<RawOptions>();
  if (raw.stackPrs !== undefined && !raw.queuedStack)
    program.error("error: --stack-prs 必须与 --queued-stack 一起使用");
  return {
    owner: raw.owner ?? null,
    repo: raw.repo ?? null,
    pr: raw.pr ?? null,
    mode: raw.queuedStack ? "queued-stack" : raw.stack ? "stack" : "single",
    stackPrs: raw.stackPrs ?? [],
    statusOnly: raw.statusOnly,
    pretty: raw.pretty,
    polling: {
      interval: raw.interval,
      sweepInterval: raw.sweepInterval,
      timeout: raw.timeout,
      maxQueryErrors: raw.maxQueryErrors,
      allowDraft: raw.allowDraft,
    },
  };
}
export interface CliRuntime {
  readonly reader: T.GitHubReader;
  readonly clock: WatchClock;
  readonly stdout: (value: string) => void;
  readonly stderr: (value: string) => void;
}
function realRuntime(): CliRuntime {
  return {
    reader: new GhGitHubReader(),
    clock: {
      now: () => performance.now() / 1_000,
      observedAt: () => new Date().toISOString(),
      sleep: async (seconds) => {
        await delay(seconds * 1_000);
      },
    },
    stdout: (value) => process.stdout.write(value),
    stderr: (value) => process.stderr.write(value),
  };
}
export async function main(
  argv: readonly string[],
  runtime: CliRuntime = realRuntime()
): Promise<number> {
  let options: CliOptions;
  try {
    options = parseArgs(argv, runtime);
  } catch (error) {
    if (!(error instanceof CommanderError)) throw error;
    return error.exitCode === 0 ? 0 : 64;
  }
  const render = options.pretty ? renderPretty : renderJson;
  const emit = (verdict: T.ProgressVerdict): void =>
    runtime.stdout(render(verdict));
  let contexts: T.NonEmpty<T.PrContext>;
  try {
    const seed = await resolveContext({
      reader: runtime.reader,
      owner: options.owner,
      repo: options.repo,
      pr: options.pr ?? options.stackPrs[0] ?? null,
    });
    contexts =
      nonEmpty(options.stackPrs.map((number) => ({ ...seed, number }))) ??
      (options.mode === "single"
        ? [seed]
        : await discoverStack(runtime.reader, seed));
  } catch (error) {
    if (!(error instanceof WatcherQueryError)) throw error;
    const verdict = statusQueryVerdict(
      verdictFactory(runtime.clock, options.mode),
      1,
      error.failure
    );
    runtime.stdout(render(verdict));
    return verdict.exitCode;
  }
  const dependencies = { reader: runtime.reader, clock: runtime.clock, emit };
  const verdict =
    options.mode === "queued-stack" && !options.statusOnly
      ? await runQueued({ dependencies, contexts, options: options.polling })
      : await runSimple({
          dependencies,
          contexts,
          mode: options.mode,
          statusOnly: options.statusOnly,
          options: options.polling,
        });
  runtime.stdout(render(verdict));
  return verdict.exitCode;
}
