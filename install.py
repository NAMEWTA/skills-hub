#!/usr/bin/env python3
"""Install selected repository skills into the current project's .agents/skills.

Python 3.10+, standard library only. No network access or destination selection.
"""

from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4


REPOSITORY = Path(__file__).resolve().parent
SKILL_ROOT = REPOSITORY / "skills"
LICENSE_ROOT = REPOSITORY / "licenses"
LICENSE_BUNDLE_FILES = (
    "PROJECT-LICENSE.txt",
    "THIRD_PARTY_NOTICES.txt",
    "deepseek-harness-MIT.txt",
    "mattpocock-skills-MIT.txt",
    "pstack-MIT.txt",
    "ai-design-skills-MIT.txt",
    "Speculo-MIT.txt",
    "taste-skill-MIT.txt",
    "humanlayer-Apache-2.0.txt",
    "humanlayer-NOTICE.txt",
)
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class InstallError(Exception):
    """A user-actionable installation error."""


@dataclass(frozen=True)
class Skill:
    domain: str
    name: str
    source: Path


@dataclass(frozen=True)
class Action:
    source: Path
    name: str
    destination: Path
    kind: str


def regular_files(directory: Path) -> list[Path]:
    """Reject links, devices and pipes rather than copying outside a skill."""
    if directory.is_symlink() or not directory.is_dir():
        raise InstallError(f"Expected a real directory: {directory}")
    files = []
    for entry in sorted(directory.rglob("*")):
        if entry.is_symlink():
            raise InstallError(f"Symlinks are not supported: {entry}")
        if entry.is_file():
            files.append(entry)
        elif not entry.is_dir():
            raise InstallError(f"Unsupported filesystem entry: {entry}")
    return files


def catalog() -> list[Skill]:
    skills = []
    seen = set()
    for manifest in sorted(SKILL_ROOT.glob("*/*/SKILL.md")):
        source = manifest.parent
        domain = source.parent.name
        name = source.name
        if source.parent.is_symlink() or SKILL_ROOT.is_symlink():
            raise InstallError(f"Symlinked source directory: {source}")
        if not SLUG.fullmatch(domain) or not SLUG.fullmatch(name):
            raise InstallError(f"Invalid domain or skill name: {domain}/{name}")
        if len(name) > 64 or not name.startswith(domain + "-"):
            raise InstallError(f"Skill must be named {domain}-xxx (max 64 characters): {name}")
        regular_files(source)
        content = manifest.read_text(encoding="utf-8")
        frontmatter = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)", content, re.S)
        if not frontmatter:
            raise InstallError(f"Missing frontmatter: {manifest}")
        declared_name = re.search(r"^name:\s*([^\r\n]+)", frontmatter[1], re.M)
        if not declared_name or declared_name[1].strip().strip("\"'") != name:
            raise InstallError(f"Frontmatter name must equal directory name: {manifest}")
        if name in seen:
            raise InstallError(f"Duplicate install name: {name}")
        seen.add(name)
        skills.append(Skill(domain, name, source))
    if not skills:
        raise InstallError(f"No skills found in {SKILL_ROOT}")
    return skills


def select(skills: list[Skill], domains: list[str], names: list[str], all_skills: bool) -> list[Skill]:
    known_domains = {skill.domain for skill in skills}
    known_names = {skill.name for skill in skills}
    unknown = (set(domains) - known_domains) | (set(names) - known_names)
    if unknown:
        raise InstallError("Unknown selection: " + ", ".join(sorted(unknown)) + ". Run 'list'.")
    return [skill for skill in skills if all_skills or skill.domain in domains or skill.name in names]


def tree_digest(directory: Path) -> str:
    digest = hashlib.sha256()
    for path in regular_files(directory):
        relative = path.relative_to(directory).as_posix().encode("utf-8")
        content = path.read_bytes()
        # Include lengths to make boundaries unambiguous; empty directories have no content.
        digest.update(len(relative).to_bytes(8, "big"))
        digest.update(relative)
        digest.update(len(content).to_bytes(8, "big"))
        digest.update(content)
        if os.name != "nt":
            digest.update((path.stat().st_mode & 0o111).to_bytes(2, "big"))
    return digest.hexdigest()


def check_directory(path: Path) -> None:
    if path.is_symlink() or (path.exists() and not path.is_dir()):
        raise InstallError(f"Refusing a symlink or non-directory destination: {path}")


def plan(skills: list[Skill], project: Path, replace: bool) -> list[Action]:
    if any(project.resolve().is_relative_to(source.resolve()) for source in (SKILL_ROOT, LICENSE_ROOT)):
        raise InstallError("Run from the target project, outside this repository's source skills and licenses directories.")
    regular_files(LICENSE_ROOT)
    if any(not (LICENSE_ROOT / name).is_file() for name in LICENSE_BUNDLE_FILES):
        raise InstallError("The repository license bundle is incomplete; restore licenses before installing.")
    agents = project / ".agents"
    target = agents / "skills"
    for path in (agents, target, agents / ".skills-wta-backups", agents / "skills-wta-licenses"):
        check_directory(path)
    actions = []
    conflicts = []
    packages = [(skill.source, skill.name, target / skill.name) for skill in skills]
    packages.append((LICENSE_ROOT, ".licenses", agents / "skills-wta-licenses"))
    for source, name, destination in packages:
        check_directory(destination)
        if not destination.exists():
            kind = "install"
        elif tree_digest(source) == tree_digest(destination):
            kind = "unchanged"
        elif replace:
            kind = "replace"
        else:
            conflicts.append(name if name != ".licenses" else "license notices")
            continue
        actions.append(Action(source, name, destination, kind))
    if conflicts:
        raise InstallError(
            "Existing packages differ: " + ", ".join(conflicts)
            + ". No skills were changed. Inspect them first; --replace saves backups before replacement."
        )
    return actions


def apply(skills: list[Skill], project: Path, replace: bool) -> tuple[list[Action], Path | None]:
    actions = plan(skills, project, replace)
    if all(action.kind == "unchanged" for action in actions):
        return actions, None
    agents = project / ".agents"
    agents.mkdir(exist_ok=True)
    lock = agents / ".skills-wta-install.lock"
    try:
        lock.mkdir()
    except FileExistsError as exc:
        raise InstallError(f"An installer lock exists: {lock}. Check for a running installer before removing a stale lock.") from exc
    staging = None
    backup_root = None
    completed: list[tuple[Path, Path | None]] = []
    try:
        # Recheck after taking the lock; a different process may have just installed.
        actions = plan(skills, project, replace)
        staging = Path(tempfile.mkdtemp(prefix=".skills-wta-stage-", dir=agents))
        for action in actions:
            if action.kind != "unchanged":
                shutil.copytree(action.source, staging / action.name)
        (agents / "skills").mkdir(exist_ok=True)
        if any(action.kind == "replace" for action in actions):
            stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
            backup_root = agents / ".skills-wta-backups" / f"{stamp}-{uuid4().hex[:8]}"
            backup_root.mkdir(parents=True)
        for action in actions:
            if action.kind == "unchanged":
                continue
            backup = None
            if action.kind == "replace":
                assert backup_root is not None
                backup = backup_root / action.name
                os.replace(action.destination, backup)
                completed.append((action.destination, backup))
            os.replace(staging / action.name, action.destination)
            if backup is None:
                completed.append((action.destination, None))
        return actions, backup_root
    except Exception as exc:
        recovery_errors = []
        for destination, backup in reversed(completed):
            try:
                if destination.exists():
                    shutil.rmtree(destination)
                if backup is not None:
                    os.replace(backup, destination)
            except OSError as recovery_error:
                recovery_errors.append(f"{destination}: {recovery_error}")
        if recovery_errors:
            raise InstallError(
                f"Installation failed: {exc}. Some files need manual recovery; keep {backup_root}. "
                + "; ".join(recovery_errors)
            ) from exc
        raise InstallError(f"Installation failed; changed skill directories were rolled back: {exc}") from exc
    finally:
        if staging is not None:
            shutil.rmtree(staging, ignore_errors=True)
        lock.rmdir()


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(description=__doc__)
    commands = result.add_subparsers(dest="command", required=True)
    for command in ("list", "install"):
        sub = commands.add_parser(command, help=f"{command.capitalize()} skills")
        sub.add_argument("--domain", nargs="+", action="extend", default=[], metavar="DOMAIN")
        sub.add_argument("--skill", nargs="+", action="extend", default=[], metavar="NAME")
        sub.add_argument("--all", action="store_true", help="Select every domain")
        if command == "install":
            sub.add_argument("--dry-run", action="store_true", help="Show changes without creating any files")
            sub.add_argument("--replace", action="store_true", help="Back up and replace differing skill directories")
    return result


def main(argv: list[str] | None = None) -> int:
    arguments = parser().parse_args(argv)
    try:
        skills = catalog()
        everything = arguments.all or (arguments.command == "list" and not arguments.domain and not arguments.skill)
        selected = select(skills, arguments.domain, arguments.skill, everything)
        if not selected:
            raise InstallError("Choose --domain, --skill, or --all. Run 'list' to see available skills.")
        if arguments.command == "list":
            for skill in selected:
                print(f"{skill.domain:8} {skill.name}")
            return 0
        project = Path.cwd().resolve()
        if arguments.dry_run:
            actions, backup = plan(selected, project, arguments.replace), None
        else:
            actions, backup = apply(selected, project, arguments.replace)
        print(f"Destination: {project / '.agents' / 'skills'}")
        for action in actions:
            if action.name != ".licenses":
                print(f"{'would ' if arguments.dry_run else ''}{action.kind:9} {action.name}")
            elif action.kind != "unchanged":
                print(f"{'Would copy' if arguments.dry_run else 'Copied'} license notices: {action.destination}")
        if backup is not None:
            print(f"Backups: {backup}")
        return 0
    except (InstallError, OSError, UnicodeError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
