#!/usr/bin/env python3
"""在隔离副本中检查示例实现、注入真实故障并核对恢复结果。"""
from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile


def main() -> int:
    skill = Path(__file__).resolve().parents[1]
    checker = skill / "scripts/check_model.py"
    with tempfile.TemporaryDirectory(prefix="formal-example-") as folder:
        target = Path(folder) / "example"
        shutil.copytree(skill / "assets/example", target, ignore=shutil.ignore_patterns("__pycache__"))
        implementation = target / "implementation.py"
        original = implementation.read_bytes()
        command = [sys.executable, "-B", str(checker), str(target / "model.py"), "--max-states", "100", "--max-transitions", "1000"]
        child_env = {**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"}

        def run(label, expected):
            result = subprocess.run(command, text=True, encoding="utf-8", capture_output=True, timeout=30, env=child_env)
            print(f"\n## {label}（退出码 {result.returncode}）\n")
            print(result.stdout, end="")
            if result.stderr:
                print(result.stderr, file=sys.stderr, end="")
            if result.returncode != expected:
                raise RuntimeError(f"{label}预期退出码 {expected}，实际为 {result.returncode}")

        run("原实现", 0)
        guard = "if state.available < 1:  # 故障注入只移除此处保护。"
        text = original.decode("utf-8")
        if text.count(guard) != 1:
            raise RuntimeError("无法唯一定位演示保护；未修改文件")
        try:
            implementation.write_text(text.replace(guard, "if False:  # 临时故障：跳过提交时的余量检查。"), encoding="utf-8")
            run("隔离副本移除提交保护", 1)
        finally:
            implementation.write_bytes(original)
        if implementation.read_bytes() != original:
            raise RuntimeError("隔离副本未恢复")
        run("恢复原实现", 0)
    print("\n示例完成：三次均为实际有限状态枚举；没有执行 TLC，也没有改动用户产品代码。")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"演示失败：{error}", file=sys.stderr)
        raise SystemExit(2)
