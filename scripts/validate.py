#!/usr/bin/env python3
"""Validate independent skill packages and their local resources, using the stdlib."""

from __future__ import annotations

import ipaddress
import re
import sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from install import InstallError, LICENSE_BUNDLE_FILES, LICENSE_ROOT, catalog, regular_files  # noqa: E402

PROVENANCE = re.compile(
    r"deepseek|matt[ -]?pocock|mattpocock|ask-matt|cursor/plugins|pstack|poteto|"
    r"elayadesign|\belaya\b|ai-design-skills|speculo|leonxlnx|taste-skill|"
    r"dsh-[a-z]|upstream|lauren tan|humanlayer|dex[ -]?horthy",
    re.I,
)
WEB_URL = re.compile(r"\b(?:https?|ftp)://(?:\[[0-9a-fA-F:.]+\]|[^\s<>\"')`\]]+)[^\s<>\"')`\]]*", re.I)


def outside_fences(text: str) -> str:
    """Keep prose while excluding examples inside fenced code blocks."""
    output = []
    marker = None
    length = 0
    for line in text.splitlines():
        fence = re.match(r"^\s*(`{3,}|~{3,})(.*)$", line)
        if fence:
            token = fence[1][0]
            if marker is None:
                marker, length = token, len(fence[1])
            elif marker == token and len(fence[1]) >= length and not fence[2].strip():
                marker = None
            continue
        if marker is None:
            output.append(line)
    return "\n".join(output)


class HTMLLinks(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.destinations: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.destinations.append(value)


def markdown_destinations(text: str) -> list[str]:
    """Recognize inline, reference-style, HTML and autolink destinations."""
    prose = outside_fences(text)
    destinations = []
    # Package paths use simple relative paths without unescaped parentheses.
    for raw in re.findall(r"!?\[[^\]\n]*\]\(([^)\n]+)\)", prose):
        destinations.append(raw.strip().split(' "', 1)[0].split(" '", 1)[0].strip("<>"))
    for match in re.finditer(r"^\s{0,3}\[[^\]\n]+\]:\s*(<[^>]+>|\S+)", prose, re.M):
        destinations.append(match[1].strip("<>"))
    destinations.extend(re.findall(r"<(https?://[^>\n]+)>", prose))
    parser = HTMLLinks()
    parser.feed(prose)
    destinations.extend(parser.destinations)
    return [unescape(item) for item in destinations]


def operational_example(url: str) -> bool:
    """Loopback or reserved example addresses are not external document dependencies."""
    try:
        hostname = urlsplit(url).hostname or ""
    except ValueError:
        return False
    if hostname == "localhost" or hostname.endswith((".localhost", ".invalid", ".example")):
        return True
    if hostname in {"example.com", "example.org", "example.net"}:
        return True
    try:
        return ipaddress.ip_address(hostname).is_loopback
    except ValueError:
        return False


def runtime_issues(text: str, *, allow_service_prefixes: bool = False) -> list[str]:
    """Skill contents must be our own Chinese, self-contained operational documents."""
    issues = []
    match = PROVENANCE.search(text)
    if match:
        issues.append(f"source attribution/name belongs outside skills: {match[0]}")
    # Scan examples too: pasted commands must not fetch missing references.
    for url in dict.fromkeys(WEB_URL.findall(unescape(text))):
        # A repository-URL parser needs its literal origin, not an external document.
        service_prefix = allow_service_prefixes and (
            url == "https://github.com/" or url.startswith("https://github.com/${")
        )
        if not operational_example(url) and not service_prefix:
            issues.append(f"external URL in runtime package: {url}")
    for destination in markdown_destinations(text):
        try:
            url = urlsplit(destination)
        except ValueError:
            issues.append(f"invalid link: {destination}")
            continue
        if (url.scheme or url.netloc) and not operational_example(destination):
            issues.append(f"resource link must be package-relative: {destination}")
    return issues


def local_target(document: Path, destination: str, boundary: Path) -> tuple[Path | None, str | None]:
    try:
        url = urlsplit(destination)
    except ValueError:
        return None, f"invalid link: {destination}"
    if url.scheme or url.netloc or not url.path:
        return None, None
    if url.path.startswith(("/", "\\")):
        return None, f"use a relative package link: {destination}"
    target = (document.parent / unquote(url.path)).resolve()
    if not target.is_relative_to(boundary.resolve()):
        return target, f"link escapes its package: {destination}"
    if not target.exists():
        return target, f"missing link target: {destination}"
    return target, None


def check_skill_metadata(skill) -> list[str]:
    failures = []
    manifest = skill.source / "SKILL.md"
    content = manifest.read_text(encoding="utf-8")
    header = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)", content, re.S)[1]
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
    if len(content.splitlines()) > 500:
        failures.append(f"{manifest.relative_to(ROOT)}: move long detail to local references")
    if not re.search(r"[\u3400-\u9fff]", content):
        failures.append(f"{manifest.relative_to(ROOT)}: expected Chinese skill content")
    metadata = skill.source / "agents" / "openai.yaml"
    if metadata.exists() and f"${skill.name}" not in metadata.read_text(encoding="utf-8"):
        failures.append(f"{metadata.relative_to(ROOT)}: default prompt must name the skill")
    return failures


def unreachable_markdown(root: Path, graph: dict[Path, set[Path]]) -> set[Path]:
    visited: set[Path] = set()
    pending = [(root / "SKILL.md").resolve()]
    while pending:
        document = pending.pop()
        if document in visited:
            continue
        visited.add(document)
        pending.extend(graph.get(document, set()) - visited)
    return {path.resolve() for path in root.rglob("*.md")} - visited


def check() -> list[str]:
    failures = []
    try:
        skills = catalog()
        regular_files(LICENSE_ROOT)
    except (InstallError, OSError, UnicodeError) as exc:
        return [str(exc)]
    for filename in LICENSE_BUNDLE_FILES:
        if not (LICENSE_ROOT / filename).is_file():
            failures.append(f"licenses: missing {filename}")
    if (LICENSE_ROOT / "PROJECT-LICENSE.txt").is_file():
        if (LICENSE_ROOT / "PROJECT-LICENSE.txt").read_bytes() != (ROOT / "LICENSE").read_bytes():
            failures.append("licenses/PROJECT-LICENSE.txt must preserve the root project license")

    for skill in skills:
        failures.extend(check_skill_metadata(skill))
        for path in regular_files(skill.source):
            if path.name.startswith("LICENSE") or path.name == "NOTICE.md":
                failures.append(f"{path.relative_to(ROOT)}: keep legal notices in the companion license bundle")
            try:
                content = path.read_text(encoding="utf-8")
            except UnicodeError:
                continue
            for issue in runtime_issues(content, allow_service_prefixes=path.suffix in {".ts", ".js", ".mjs"}):
                failures.append(f"{path.relative_to(ROOT)}: {issue}")

    checked_links = 0
    graph: dict[Path, set[Path]] = {}
    markdown = sorted(path for path in ROOT.rglob("*.md") if not any(
        part in {".git", ".agents", "__pycache__"} for part in path.relative_to(ROOT).parts
    ))
    for document in markdown:
        content = document.read_text(encoding="utf-8")
        skill_root = next((skill.source for skill in skills if document.is_relative_to(skill.source)), None)
        graph[document.resolve()] = set()
        for destination in markdown_destinations(content):
            target, error = local_target(document, destination, skill_root or ROOT)
            if error:
                failures.append(f"{document.relative_to(ROOT)}: {error}")
            if target is not None:
                checked_links += 1
                graph[document.resolve()].add(target)
    for skill in skills:
        for path in sorted(unreachable_markdown(skill.source, graph)):
            failures.append(f"{path.relative_to(ROOT)}: no local link path from this skill's SKILL.md")

    print(f"Checked {len(skills)} skills, {len(markdown)} Markdown files, {checked_links} local links.")
    return failures


def main() -> int:
    failures = check()
    if failures:
        for failure in failures:
            print(f"ERROR: {failure}", file=sys.stderr)
        return 1
    print("Independent packages, local resources, Chinese entry points and license bundle passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
