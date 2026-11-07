#!/usr/bin/env python3
"""Check packaging contracts and local Markdown links without third-party dependencies."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from install import InstallError, catalog  # noqa: E402


def outside_fences(text: str) -> str:
    output = []
    marker = None
    for line in text.splitlines():
        fence = re.match(r"^\s*(`{3,}|~{3,})", line)
        if fence:
            token = fence[1][0]
            if marker is None:
                marker = token
            elif marker == token:
                marker = None
            continue
        if marker is None:
            output.append(line)
    return "\n".join(output)


def check() -> list[str]:
    failures = []
    try:
        skills = catalog()
    except (InstallError, OSError, UnicodeError) as exc:
        return [str(exc)]
    for skill in skills:
        manifest = skill.source / "SKILL.md"
        text = manifest.read_text(encoding="utf-8")
        header = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)", text, re.S)[1]
        fields = {}
        for line in header.splitlines():
            if not line.strip():
                continue
            match = re.match(r"^([a-z_]+):\s*(.+)$", line)
            if not match:
                failures.append(f"{manifest.relative_to(ROOT)}: use simple name/description scalar metadata")
                continue
            key, value = match.groups()
            if key in fields:
                failures.append(f"{manifest.relative_to(ROOT)}: duplicate metadata field {key}")
            fields[key] = value
        if set(fields) != {"name", "description"}:
            failures.append(f"{manifest.relative_to(ROOT)}: expected name and description")
        description = fields.get("description", "").strip().strip("\"'")
        if not description or len(description) > 1024 or "<" in description or ">" in description:
            failures.append(f"{manifest.relative_to(ROOT)}: missing or invalid description")
        if len(text.splitlines()) > 500:
            failures.append(f"{manifest.relative_to(ROOT)}: move long detail to local references")
        if not list(skill.source.glob("LICENSE*")):
            failures.append(f"{skill.source.relative_to(ROOT)}: missing distributable license")
        metadata = skill.source / "agents" / "openai.yaml"
        if metadata.exists():
            body = metadata.read_text(encoding="utf-8")
            if f"${skill.name}" not in body:
                failures.append(f"{metadata.relative_to(ROOT)}: default prompt must name the skill")
    checked_links = 0
    markdown = sorted(path for path in ROOT.rglob("*.md") if not any(part in {".git", ".agents", "__pycache__"} for part in path.relative_to(ROOT).parts))
    for document in markdown:
        text = outside_fences(document.read_text(encoding="utf-8"))
        skill_root = next((skill.source for skill in skills if document.is_relative_to(skill.source)), None)
        for raw in re.findall(r"!?\[[^\]\n]*\]\(([^)\n]+)\)", text):
            destination = raw.strip().split(' "', 1)[0].strip("<>")
            url = urlsplit(destination)
            if url.scheme or url.netloc or not url.path:
                continue
            checked_links += 1
            target = (document.parent / unquote(url.path)).resolve()
            if skill_root is not None and not target.is_relative_to(skill_root):
                failures.append(f"{document.relative_to(ROOT)}: link escapes standalone skill: {destination}")
            if not target.exists():
                failures.append(f"{document.relative_to(ROOT)}: missing link target: {destination}")
    print(f"Checked {len(skills)} skills, {len(markdown)} Markdown files, {checked_links} local links.")
    return failures


def main() -> int:
    failures = check()
    if failures:
        for failure in failures:
            print(f"ERROR: {failure}", file=sys.stderr)
        return 1
    print("Skill packaging and local links passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
