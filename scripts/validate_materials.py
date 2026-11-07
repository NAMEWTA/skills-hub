#!/usr/bin/env python3
"""Check complete local documents, code, fixtures and assets against source records."""

from __future__ import annotations

import csv
import hashlib
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


def check(root: Path = ROOT) -> list[str]:
    failures = []
    materials = root / "materials"
    manifest = materials / "manifest.tsv"
    if not manifest.is_file():
        return ["materials/manifest.tsv is missing"]
    with manifest.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle, delimiter="\t"))
    if not rows:
        return ["The material manifest must not be empty"]
    identities = set()
    sources = set()
    kinds = {"document": 0, "code": 0, "fixture": 0, "asset": 0}
    mapped = 0
    for row in rows:
        identity = row.get("id", "")
        if not re.fullmatch(r"[a-z][0-9]{3}", identity) or identity in identities:
            failures.append(f"Invalid or duplicate material identity: {identity}")
            continue
        identities.add(identity)
        kind = row.get("kind", "")
        if kind not in kinds:
            failures.append(f"{identity}: kind must be document, code, fixture or asset")
            continue
        kinds[kind] += 1
        source = (row.get("source_group", ""), row.get("source_path", ""))
        if not all(source) or source in sources:
            failures.append(f"{identity}: missing or duplicate source identity")
        sources.add(source)
        directory = materials / identity
        suffix = Path(row.get("source_path", "")).suffix.lower()
        if kind == "asset" and suffix not in {".png", ".jpg", ".jpeg", ".svg"}:
            failures.append(f"{identity}: unsupported asset extension: {suffix}")
            continue
        original_name = "original" + suffix if kind == "asset" else "original.txt"
        localized_name = "localized" + suffix if kind == "asset" else "zh-CN.txt" if kind == "document" else "localized.txt"
        paired_data = {}
        for filename, field in ((original_name, "original_sha256"), (localized_name, "translation_sha256")):
            path = directory / filename
            if path.is_symlink() or not path.is_file():
                failures.append(f"{identity}: missing regular file {filename}")
                continue
            data = path.read_bytes()
            paired_data[filename] = data
            if hashlib.sha256(data).hexdigest() != row.get(field):
                failures.append(f"{identity}: {filename} differs from its recorded SHA-256")
            if filename == original_name:
                git_blob = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
                if git_blob != row.get("source_git_blob"):
                    failures.append(f"{identity}: original differs from the recorded source Git blob")
            if kind == "asset":
                if not data:
                    failures.append(f"{identity}: empty asset")
                continue
            try:
                content = data.decode("utf-8")
            except UnicodeError:
                failures.append(f"{identity}: {filename} must be UTF-8")
                continue
            if kind != "fixture" and not content.strip():
                failures.append(f"{identity}: {filename} must not be empty")
            if kind == "document" and filename == localized_name and not re.search(r"[\u3400-\u9fff]", content):
                failures.append(f"{identity}: Chinese translation is absent")
        if kind in {"fixture", "asset"} and len(paired_data) == 2 and paired_data[original_name] != paired_data[localized_name]:
            failures.append(f"{identity}: machine fixture or asset must preserve the original bytes")
        if directory.is_symlink():
            failures.append(f"{identity}: material directory must not be a symlink")
        if directory.is_dir() and {p.name for p in directory.iterdir()} != {original_name, localized_name}:
            failures.append(f"{identity}: expected only the paired files")
        destinations = [item for item in row.get("runtime_paths", "").split(";") if item]
        if destinations:
            mapped += 1
        for relative in destinations:
            path = (root / relative).resolve()
            if not path.is_relative_to((root / "skills").resolve()) or not path.is_file():
                failures.append(f"{identity}: runtime destination missing or outside skills: {relative}")
        if not row.get("source_path") or not row.get("adaptation"):
            failures.append(f"{identity}: preserve the source path and adaptation explanation")
    actual = {p.name for p in materials.iterdir() if p.is_dir()}
    if actual != identities:
        failures.append(f"Material directories and manifest disagree: {sorted(actual ^ identities)}")
    print(f"Checked {len(rows)} local pairs ({kinds['document']} documents, {kinds['code']} code files, "
          f"{kinds['fixture']} fixtures, {kinds['asset']} assets); {mapped} have recorded runtime destinations.")
    return failures


def main() -> int:
    failures = check()
    if failures:
        for failure in failures:
            print(f"ERROR: {failure}", file=sys.stderr)
        return 1
    print("Local material pairs, recorded hashes and runtime destinations passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
