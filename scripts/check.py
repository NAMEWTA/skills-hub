#!/usr/bin/env python3
"""Run repository checks on the worktree, staged tree, or exact push targets."""

from __future__ import annotations

import argparse
from contextlib import contextmanager
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import tempfile
from typing import Iterator

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts import check_skill_quality  # noqa: E402

OBJECT_ID = re.compile(r"(?:[0-9a-f]{40}|[0-9a-f]{64})\Z")
GIT_LOCAL_ENV = (
    "GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_PREFIX",
    "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
)


class CheckError(Exception):
    """A check cannot establish the contents being committed or pushed."""


def git(root: Path, *arguments: str, input_data: bytes | None = None) -> bytes:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), *arguments],
            input=input_data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False,
        )
    except OSError as exc:
        raise CheckError(f"无法执行 Git：{exc}") from exc
    if result.returncode:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        raise CheckError(f"Git 无法读取待检查快照：{detail}")
    return result.stdout


def resolve_commit(root: Path, revision: str) -> str:
    return git(root, "rev-parse", "--verify", "--end-of-options", f"{revision}^{{commit}}").decode().strip()


@contextmanager
def snapshot(root: Path, tree: str) -> Iterator[Path]:
    """Copy Git blobs exactly; export-ignore/subst and worktree edits cannot alter them."""
    records = []
    for record in git(root, "ls-tree", "-r", "-z", "--full-tree", tree).split(b"\0"):
        if not record:
            continue
        metadata, raw_path = record.split(b"\t", 1)
        mode, kind, object_id = metadata.split()
        relative = raw_path.decode("utf-8")
        if mode not in {b"100644", b"100755"} or kind != b"blob":
            raise CheckError(f"{relative}: 快照检查只支持常规文件，不忽略符号链接或子模块")
        path = PurePosixPath(relative)
        if path.is_absolute() or ".." in path.parts or ".git" in path.parts or "\\" in relative:
            raise CheckError(f"无效快照路径：{relative}")
        records.append((mode, object_id, path))

    object_ids = b"".join(object_id + b"\n" for _, object_id, _ in records)
    blobs = git(root, "cat-file", "--batch", input_data=object_ids) if records else b""
    offset = 0
    with tempfile.TemporaryDirectory(prefix="skills-wta-check-") as temporary:
        target_root = Path(temporary)
        for mode, object_id, relative in records:
            end = blobs.find(b"\n", offset)
            if end < 0:
                raise CheckError(f"{relative}: Git blob 输出不完整")
            header = blobs[offset:end].split()
            if len(header) != 3 or header[0] != object_id or header[1] != b"blob":
                raise CheckError(f"{relative}: Git blob 身份或类型不符")
            size = int(header[2])
            start, stop = end + 1, end + 1 + size
            if stop >= len(blobs) or blobs[stop:stop + 1] != b"\n":
                raise CheckError(f"{relative}: Git blob 内容不完整")
            target = target_root.joinpath(*relative.parts)
            if not target.resolve().is_relative_to(target_root.resolve()):
                raise CheckError(f"快照路径越界：{relative}")
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(blobs[start:stop])
            if os.name != "nt":
                target.chmod(0o755 if mode == b"100755" else 0o644)
            offset = stop + 1
        if offset != len(blobs):
            raise CheckError("Git blob 输出包含未匹配内容")
        yield target_root


def validation_environment() -> dict[str, str]:
    environment = os.environ.copy()
    for name in GIT_LOCAL_ENV:
        environment.pop(name, None)
    environment.update(
        PYTHONUTF8="1", PYTHONIOENCODING="utf-8", PYTHONDONTWRITEBYTECODE="1",
    )
    return environment


def check_tree(root: Path, *, full: bool = False) -> int:
    failures, sizes = check_skill_quality.check(root)
    check_skill_quality.report(sizes)
    if failures:
        for failure in failures:
            print(f"ERROR: {failure}", file=sys.stderr)
        return 1

    commands = [
        ("独立包、元数据和本地引用", ["scripts/validate.py"]),
        ("原件、中文底稿和运行映射", ["scripts/validate_materials.py"]),
    ]
    if full:
        commands.extend([
            ("隔离回归检查", ["-m", "unittest", "discover", "-s", "tests", "-v"]),
            ("有限状态示例及真实故障注入", ["skills/dev/dev-formal-verify/scripts/demo.py"]),
        ])
    for label, arguments in commands:
        if arguments[0] != "-m" and not (root / arguments[0]).is_file():
            raise CheckError(f"快照缺少检查入口：{arguments[0]}")
        print(f"检查：{label}", flush=True)
        result = subprocess.run(
            [sys.executable, *arguments], cwd=root, env=validation_environment(), check=False,
        )
        if result.returncode:
            return 1
    return 0


def push_commits(root: Path, updates: str) -> list[tuple[str, str]]:
    commits = []
    seen = set()
    for number, line in enumerate(updates.splitlines(), start=1):
        fields = line.split()
        if len(fields) != 4:
            raise CheckError(f"pre-push 输入第 {number} 行不是 Git 的四字段更新记录")
        local_ref, local_id, remote_ref, remote_id = fields
        if not OBJECT_ID.fullmatch(local_id) or not OBJECT_ID.fullmatch(remote_id):
            raise CheckError(f"pre-push 输入第 {number} 行的对象标识无效")
        if set(local_id) == {"0"}:
            continue
        commit = resolve_commit(root, local_id)
        if commit not in seen:
            commits.append((commit, f"{local_ref} -> {remote_ref}"))
            seen.add(commit)
    return commits


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help="待检查的仓库根目录")
    parser.add_argument("--full", action="store_true", help="结构检查后运行隔离测试和形式化示例")
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument("--staged", action="store_true", help="检查当前 Git index 的完整快照")
    selection.add_argument("--revision", help="检查指定提交，不读取未提交工作区修改")
    selection.add_argument("--pre-push", action="store_true", help="从标准输入读取 Git pre-push 更新")
    arguments = parser.parse_args(argv)
    root = arguments.root.resolve()
    try:
        if arguments.staged:
            tree = git(root, "write-tree").decode().strip()
            print(f"检查暂存快照 {tree}，不使用未暂存的修正。", flush=True)
            with snapshot(root, tree) as checkout:
                return check_tree(checkout, full=arguments.full)
        if arguments.revision:
            commits = [(resolve_commit(root, arguments.revision), arguments.revision)]
        elif arguments.pre_push:
            commits = push_commits(root, sys.stdin.read())
        else:
            print("检查当前工作区。", flush=True)
            return check_tree(root, full=arguments.full)
        for commit, label in commits:
            print(f"检查目标提交 {commit} ({label})，不以当前 HEAD 或工作区替代。", flush=True)
            with snapshot(root, commit) as checkout:
                if check_tree(checkout, full=arguments.full):
                    return 1
        if not commits:
            print("本次没有需要检查的提交目标（例如仅删除远端引用）。")
        return 0
    except (CheckError, OSError, UnicodeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
