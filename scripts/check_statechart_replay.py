#!/usr/bin/env python3
"""用仓库内已捕获输出检查状态图解析与报告；不运行新的 TLC 求解。"""

from concurrent.futures import ThreadPoolExecutor
import csv
import json
import os
from pathlib import Path, PurePosixPath
import re
import shlex
import shutil
import subprocess
import tempfile


ROOT = Path(__file__).resolve().parents[1]
PREFIX = "pstack/skills/statechart/scripts/"


def main():
    if os.name != "posix":
        raise SystemExit("此夹具回放入口需要 POSIX shell；Windows 可在 WSL 中执行。")
    node = shutil.which("node")
    if not node:
        raise SystemExit("需要能直接执行 TypeScript 的 Node；本命令不安装依赖。")
    print("回放已捕获的 TLC 输出，检查解析、图与报告；不是新的 TLC 模型求解。", flush=True)
    with tempfile.TemporaryDirectory(prefix="skills-wta-statechart-replay-") as folder:
        base = Path(folder)
        source = base / "source"
        with (ROOT / "materials/manifest.tsv").open(encoding="utf-8", newline="") as handle:
            for row in csv.DictReader(handle, delimiter="\t"):
                if not row["source_path"].startswith(PREFIX):
                    continue
                relative = PurePosixPath(row["source_path"][len(PREFIX):])
                if relative.is_absolute() or ".." in relative.parts:
                    raise ValueError("资料路径不能越出临时目录")
                target = source.joinpath(*relative.parts)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes((ROOT / "materials" / row["id"] / "original.txt").read_bytes())
        adapter = base / "captured-output-replay.sh"
        adapter.write_text(
            "#!/bin/sh\nexec " + shlex.quote(node) + " "
            + shlex.quote(str(source / "test/java.ts")) + ' "$@"\n', encoding="utf-8"
        )
        adapter.chmod(0o755)
        # 入口要求显式存在的 jar 路径；此占位文件绝不作为 Java 字节码执行。
        placeholder = base / "not-a-real-tlc.jar"
        placeholder.touch()
        entry = ROOT / "skills/dev/dev-statechart/scripts/statechart"
        cases = sorted(p for p in (source / "test/corpus").iterdir() if p.is_dir())
        if not cases:
            raise RuntimeError("没有找到完整捕获夹具")

        def run(case):
            output = base / "output" / case.name
            command = ["sh", str(entry), str(case / f"{case.name}.tla"), "--out", str(output)]
            if (case / "view.mjs").is_file():
                command += ["--view", str(case / "view.mjs")]
            env = dict(os.environ, JAVA=str(adapter), TLA2TOOLS=str(placeholder), STATECHART_REPLAY=str(case))
            result = subprocess.run(command, env=env, text=True, encoding="utf-8", capture_output=True, timeout=45)
            saved_exit = case / "verdict-1.exit"
            code = int(saved_exit.read_text()) if saved_exit.is_file() else 0
            expected = 0 if code == 0 else 1 if code in {11, 12, 13} else 2
            if result.returncode != expected or result.stderr:
                raise AssertionError((case.name, result.returncode, expected, result.stderr))
            report = (output / "report.md").read_text(encoding="utf-8")
            chart = (output / "chart.mmd").read_text(encoding="utf-8")
            original = (case / "report.md").read_text(encoding="utf-8")
            original_chart = (case / "chart.mmd").read_text(encoding="utf-8")
            rules = re.findall(r"^## 违反 (.+)$", report, re.M)
            if rules != re.findall(r"^## (.+) breaks$", original, re.M):
                raise AssertionError((case.name, "违反规则不同"))
            for pattern in (r"^\s*(\[\*\]|s\d+) --> (s\d+)", r"^\s*class (s\d+) (\w+)"):
                if re.findall(pattern, chart, re.M) != re.findall(pattern, original_chart, re.M):
                    raise AssertionError((case.name, "逻辑边或节点标记不同"))
            if len(re.findall(r"^\d+\. ", report, re.M)) != len(re.findall(r"^\d+\. ", original, re.M)):
                raise AssertionError((case.name, "反例轨迹长度不同"))
            if "@!@!@" in (output / "tlc.out").read_text(encoding="utf-8"):
                raise AssertionError((case.name, "日志仍含未解析工具协议"))
            return {"case": case.name, "exit": result.returncode, "rules": rules}

        with ThreadPoolExecutor(max_workers=4) as executor:
            results = list(executor.map(run, cases))
        print(json.dumps({"kind": "captured-output replay", "new_tlc_run": False,
                          "cases": len(results), "passed": len(results), "results": results},
                         ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
