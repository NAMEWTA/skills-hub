#!/usr/bin/env python3
"""Check the entry-body budget without limiting packaged reference material."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
MAX_BODY_LINES = 500
MAX_BODY_CHARACTERS = 12_000
FRONTMATTER = re.compile(r"\A---\r?\n.*?\r?\n---(?:\r?\n|\Z)", re.S)


@dataclass(frozen=True)
class EntrySize:
    path: str
    lines: int
    characters: int

    @property
    def budget_fraction(self) -> float:
        return max(self.lines / MAX_BODY_LINES, self.characters / MAX_BODY_CHARACTERS)


def measure(path: str, content: str) -> EntrySize:
    header = FRONTMATTER.match(content)
    if header is None:
        raise ValueError("缺少完整的 YAML frontmatter，无法确定正文边界")
    body = content[header.end():]
    # Count LF/CRLF physical lines, including blanks, fences and tables.
    lines = body.count("\n") + int(bool(body) and not body.endswith("\n"))
    characters = sum(not character.isspace() for character in body)
    return EntrySize(path, lines, characters)


def entry_issues(path: str, content: str) -> list[str]:
    try:
        size = measure(path, content)
    except ValueError as exc:
        return [f"{path}: {exc}"]
    issues = []
    if size.lines > MAX_BODY_LINES:
        issues.append(f"{path}: 正文 {size.lines} 行，超过项目上限 {MAX_BODY_LINES} 行")
    if size.characters > MAX_BODY_CHARACTERS:
        issues.append(
            f"{path}: 正文 {size.characters} 个非空白 Unicode 字符，"
            f"超过项目上限 {MAX_BODY_CHARACTERS}"
        )
    return [
        issue + "；将详细方法、示例或参数拆入本包 references/，"
        "入口保留路由、关键约束和按需读取链接；压缩重复表述，不删减完整方法。"
        for issue in issues
    ]


def check(root: Path = ROOT) -> tuple[list[str], list[EntrySize]]:
    failures: list[str] = []
    sizes: list[EntrySize] = []
    entries = sorted((root / "skills").glob("*/*/SKILL.md"))
    if not entries:
        return ["skills/: 未找到 skills/<domain>/<domain>-xxx/SKILL.md"], sizes
    for path in entries:
        relative = path.relative_to(root).as_posix()
        if any(part.is_symlink() for part in (root / "skills", path.parent.parent, path.parent, path)):
            failures.append(f"{relative}: 入口及其目录必须是本仓库的常规文件/目录")
            continue
        try:
            content = path.read_text(encoding="utf-8")
            sizes.append(measure(relative, content))
        except (OSError, UnicodeError, ValueError) as exc:
            failures.append(f"{relative}: {exc}")
            continue
        failures.extend(entry_issues(relative, content))
    return failures, sizes


def report(sizes: list[EntrySize], *, all_entries: bool = False) -> None:
    print(
        f"入口预算：检查 {len(sizes)} 项；正文上限 {MAX_BODY_LINES} 行、"
        f"{MAX_BODY_CHARACTERS} 个非空白 Unicode 字符（不是 token 计数）。"
    )
    ordered = sorted(sizes, key=lambda size: (-size.budget_fraction, size.path))
    print("行数/上限  字符数/上限  入口" if all_entries else "当前占用最高的入口：")
    for size in ordered if all_entries else ordered[:3]:
        print(
            f"  {size.lines}/{MAX_BODY_LINES} 行  "
            f"{size.characters}/{MAX_BODY_CHARACTERS} 字符  {size.path}"
        )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help="待检查的仓库根目录")
    parser.add_argument("--report", action="store_true", help="显示所有入口的实际用量")
    arguments = parser.parse_args(argv)
    failures, sizes = check(arguments.root.resolve())
    report(sizes, all_entries=arguments.report)
    for failure in failures:
        print(f"ERROR: {failure}", file=sys.stderr)
    return int(bool(failures))


if __name__ == "__main__":
    raise SystemExit(main())
