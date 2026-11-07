#!/usr/bin/env python3
"""Opt in to repository Git hooks without replacing an existing hook configuration."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
HOOK_FILES = ("pre-commit", "pre-push", "run-check")


def install(root: Path) -> str:
    def git(*arguments: str, optional: bool = False) -> str:
        result = subprocess.run(
            ["git", "-C", str(root), *arguments],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8",
        )
        if optional and result.returncode == 1:
            return ""
        if result.returncode:
            raise ValueError(result.stderr.strip() or "无法读取 Git 配置")
        return result.stdout.strip()

    actual_root = Path(git("rev-parse", "--show-toplevel")).resolve()
    if actual_root != root.resolve():
        raise ValueError("请指定仓库根目录，不能在任意子目录安装 hooks")
    hook_root = root / ".githooks"
    for name in HOOK_FILES:
        path = hook_root / name
        if hook_root.is_symlink() or path.is_symlink() or not path.is_file():
            raise ValueError(f"缺少本仓库的常规 hook 文件：.githooks/{name}")

    def ensure_executable() -> None:
        if os.name != "nt":
            for name in HOOK_FILES:
                path = hook_root / name
                path.chmod(path.stat().st_mode | 0o111)

    configured = git("config", "--get-all", "core.hooksPath", optional=True)
    if configured:
        paths = configured.splitlines()
        if paths != [".githooks"]:
            raise ValueError(
                "已配置 core.hooksPath，保持原值；请在现有 pre-commit/pre-push 中"
                "分别接入 scripts/check.py --staged / --pre-push。"
            )
        ensure_executable()
        return "本仓库已使用 .githooks，已核对脚本执行权限。"

    default_hooks = Path(git("rev-parse", "--git-path", "hooks"))
    if not default_hooks.is_absolute():
        default_hooks = root / default_hooks
    if default_hooks.exists():
        active = [path.name for path in default_hooks.iterdir() if not path.name.endswith(".sample")]
        if active:
            raise ValueError(
                "默认 hooks 目录已有自定义内容，保持不变："
                + ", ".join(sorted(active))
                + "；请在现有流程中接入本项目检查。"
            )
    ensure_executable()
    git("config", "--local", "core.hooksPath", ".githooks")
    return "已为本仓库启用 pre-commit（暂存快照）和 pre-push（目标提交）检查。"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help="待配置的仓库根目录")
    arguments = parser.parse_args(argv)
    try:
        print(install(arguments.root.resolve()))
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
