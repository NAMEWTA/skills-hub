"""Exercise budgets and Git snapshots without touching a user's repository."""

from __future__ import annotations

import csv
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

from install import LICENSE_BUNDLE_FILES
from scripts import check_skill_quality as quality

SOURCE = Path(__file__).resolve().parents[1]
ENTRY = "skills/dev/dev-sample/SKILL.md"
HEADER = "---\nname: dev-sample\ndescription: 处理示例任务。\n---\n"
VALID = HEADER + "# 示例\n\n按用户目标处理。\n"
OVERSIZED = HEADER + "字" * (quality.MAX_BODY_CHARACTERS + 1) + "\n"
ZERO_ID = "0" * 40


class EntryBudgetTests(unittest.TestCase):
    def test_line_budget_counts_only_body_and_accepts_the_boundary(self):
        body = "步骤\n" * quality.MAX_BODY_LINES
        content = HEADER + body
        self.assertEqual(quality.measure(ENTRY, content).lines, quality.MAX_BODY_LINES)
        self.assertEqual(quality.entry_issues(ENTRY, content), [])
        failures = quality.entry_issues(ENTRY, content + "多一行\n")
        self.assertEqual(len(failures), 1)
        self.assertIn("501", failures[0])
        self.assertIn("references/", failures[0])

    def test_a_single_long_chinese_line_cannot_bypass_the_budget(self):
        self.assertEqual(
            quality.entry_issues(ENTRY, HEADER + "字" * quality.MAX_BODY_CHARACTERS), [],
        )
        failures = quality.entry_issues(ENTRY, OVERSIZED)
        self.assertEqual(len(failures), 1)
        self.assertIn("12001", failures[0])
        self.assertIn("Unicode", failures[0])

    def test_characters_are_codepoints_not_utf8_bytes_or_whitespace_words(self):
        size = quality.measure(ENTRY, HEADER + "汉字 Aé 😀\t\n")
        self.assertEqual(size.characters, 5)
        self.assertEqual(size.lines, 1)

    def test_code_tables_and_blank_lines_are_not_excluded(self):
        fence = chr(96) * 3
        content = HEADER.replace("\n", "\r\n") + f"\r\n{fence}\r\n字\r\n{fence}\r\n| 表 |\r\n"
        size = quality.measure(ENTRY, content)
        self.assertEqual(size.lines, 5)
        self.assertEqual(size.characters, 10)

    def test_references_do_not_consume_the_entry_budget(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            entry = root / ENTRY
            entry.parent.mkdir(parents=True)
            entry.write_text(VALID, encoding="utf-8")
            reference = entry.parent / "references" / "method.md"
            reference.parent.mkdir()
            reference.write_text("完整方法\n" * 10_000, encoding="utf-8")
            failures, sizes = quality.check(root)
        self.assertEqual(failures, [])
        self.assertEqual(len(sizes), 1)

    def test_invalid_body_boundary_is_an_error_instead_of_zero_length(self):
        failures = quality.entry_issues(ENTRY, "# 缺少头部\n")
        self.assertTrue(failures)
        self.assertIn("frontmatter", failures[0])


class GitFixture(unittest.TestCase):
    def setUp(self):
        if not shutil.which("git"):
            self.skipTest("Git is required for commit/push snapshot checks")
        self.temporary = tempfile.TemporaryDirectory(prefix="skills-wta gate-")
        self.addCleanup(self.temporary.cleanup)
        self.base = Path(self.temporary.name)
        self.root = self.base / "repository"
        self.root.mkdir()
        self.environment = os.environ.copy()
        for key in (
            "GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_PREFIX",
            "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
            "GIT_CONFIG_COUNT", "GIT_CONFIG_PARAMETERS",
        ):
            self.environment.pop(key, None)
        self.environment.update(
            GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM="1",
            PYTHONUTF8="1", PYTHONIOENCODING="utf-8", PYTHONDONTWRITEBYTECODE="1",
        )
        self.entry = self.root / ENTRY
        self.entry.parent.mkdir(parents=True)
        self.entry.write_text(VALID, encoding="utf-8")
        for filename in (
            "install.py", "scripts/check.py", "scripts/check_skill_quality.py",
            "scripts/validate.py", "scripts/validate_materials.py", "scripts/install_hooks.py",
            ".githooks/pre-commit", ".githooks/pre-push", ".githooks/run-check",
        ):
            destination = self.root / filename
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(SOURCE / filename, destination)
        (self.root / "LICENSE").write_text("测试许可\n", encoding="utf-8")
        licenses = self.root / "licenses"
        licenses.mkdir()
        for name in LICENSE_BUNDLE_FILES:
            (licenses / name).write_text("测试许可\n", encoding="utf-8")
        self.write_materials()
        self.git("init", "--quiet")
        self.git("symbolic-ref", "HEAD", "refs/heads/main")
        self.git("config", "user.name", "Quality Check")
        self.git("config", "user.email", "quality@example.invalid")
        self.git("config", "commit.gpgsign", "false")
        self.git("config", "tag.gpgsign", "false")
        self.git("add", ".")
        self.git("commit", "--quiet", "-m", "valid fixture")
        self.original_commit = self.git("rev-parse", "HEAD").stdout.strip()

    def write_materials(self):
        directory = self.root / "materials" / "a001"
        directory.mkdir(parents=True)
        original, translation = b"# Source\n", "# 完整中文资料\n".encode()
        (directory / "original.txt").write_bytes(original)
        (directory / "zh-CN.txt").write_bytes(translation)
        record = {
            "id": "a001", "kind": "document", "source_group": "example",
            "source_path": "example.md",
            "source_git_blob": hashlib.sha1(f"blob {len(original)}\0".encode() + original).hexdigest(),
            "original_sha256": hashlib.sha256(original).hexdigest(),
            "translation_sha256": hashlib.sha256(translation).hexdigest(),
            "runtime_paths": ENTRY, "adaptation": "完整本地示例。",
        }
        with (self.root / "materials" / "manifest.tsv").open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=record, delimiter="\t", lineterminator="\n")
            writer.writeheader()
            writer.writerow(record)

    def command(self, arguments, *, input_data=None, expected=0):
        result = subprocess.run(
            arguments, cwd=self.root, env=self.environment, input=input_data,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8",
        )
        if expected is not None:
            self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
        return result

    def git(self, *arguments, input_data=None, expected=0):
        return self.command(["git", *arguments], input_data=input_data, expected=expected)

    def gate(self, *arguments, input_data=None, expected=0):
        return self.command(
            [sys.executable, str(SOURCE / "scripts" / "check.py"), "--root", str(self.root), *arguments],
            input_data=input_data, expected=expected,
        )

    def install_hooks(self, expected=0):
        return self.command(
            [sys.executable, str(SOURCE / "scripts" / "install_hooks.py"), "--root", str(self.root)],
            expected=expected,
        )

    def bad_branch(self):
        self.git("checkout", "--quiet", "-b", "oversized")
        self.entry.write_text(OVERSIZED, encoding="utf-8")
        self.git("add", ENTRY)
        self.git("commit", "--quiet", "-m", "oversized fixture")
        commit = self.git("rev-parse", "HEAD").stdout.strip()
        self.git("checkout", "--quiet", "main")
        return commit


class SnapshotGateTests(GitFixture):
    def test_existing_validator_also_enforces_the_character_budget(self):
        self.entry.write_text(OVERSIZED, encoding="utf-8")
        result = self.command(
            [sys.executable, "scripts/validate.py"], expected=1,
        )
        self.assertIn("12001", result.stderr)

    def test_staged_error_is_not_hidden_by_a_fixed_worktree(self):
        self.entry.write_text(OVERSIZED, encoding="utf-8")
        self.git("add", ENTRY)
        before = self.git("ls-files", "--stage").stdout
        self.entry.write_text(VALID, encoding="utf-8")
        result = self.gate("--staged", expected=1)
        self.assertIn("12001", result.stderr)
        self.assertEqual(self.entry.read_text(encoding="utf-8"), VALID)
        self.assertEqual(self.git("ls-files", "--stage").stdout, before)

    def test_valid_index_is_not_replaced_by_invalid_unstaged_content(self):
        self.entry.write_text(OVERSIZED, encoding="utf-8")
        self.gate("--staged")
        self.assertEqual(self.entry.read_text(encoding="utf-8"), OVERSIZED)

    def test_export_ignore_cannot_hide_a_staged_skill(self):
        self.entry.write_text(OVERSIZED, encoding="utf-8")
        (self.root / ".gitattributes").write_text("skills/** export-ignore\n", encoding="utf-8")
        self.git("add", ENTRY, ".gitattributes")
        result = self.gate("--staged", expected=1)
        self.assertIn("12001", result.stderr)

    def test_pre_push_checks_the_other_branch_being_pushed(self):
        commit = self.bad_branch()
        update = f"refs/heads/oversized {commit} refs/heads/main {ZERO_ID}\n"
        result = self.gate("--pre-push", input_data=update, expected=1)
        self.assertIn(commit, result.stdout)
        self.assertIn("12001", result.stderr)
        self.assertEqual(self.git("rev-parse", "HEAD").stdout.strip(), self.original_commit)

    def test_revision_and_push_ignore_uncommitted_changes(self):
        self.entry.write_text(OVERSIZED, encoding="utf-8")
        self.gate("--revision", "HEAD")
        update = f"refs/heads/main {self.original_commit} refs/heads/main {ZERO_ID}\n"
        self.gate("--pre-push", input_data=update)

    def test_every_distinct_push_target_is_checked(self):
        commit = self.bad_branch()
        updates = (
            f"refs/heads/main {self.original_commit} refs/heads/main {ZERO_ID}\n"
            f"refs/heads/oversized {commit} refs/heads/oversized {ZERO_ID}\n"
        )
        result = self.gate("--pre-push", input_data=updates, expected=1)
        self.assertIn(self.original_commit, result.stdout)
        self.assertIn(commit, result.stdout)

    def test_annotated_tag_is_peeled_to_its_actual_commit(self):
        commit = self.bad_branch()
        self.git("tag", "-a", "candidate", "-m", "candidate", commit)
        tag = self.git("rev-parse", "candidate").stdout.strip()
        self.assertNotEqual(tag, commit)
        update = f"refs/tags/candidate {tag} refs/tags/candidate {ZERO_ID}\n"
        result = self.gate("--pre-push", input_data=update, expected=1)
        self.assertIn(commit, result.stdout)

    def test_delete_only_push_has_no_contents_to_validate(self):
        update = f"(delete) {ZERO_ID} refs/heads/old {self.original_commit}\n"
        self.gate("--pre-push", input_data=update)

    def test_invalid_push_input_is_not_silently_skipped(self):
        self.gate("--pre-push", input_data="not a git update\n", expected=1)

    def test_unresolved_index_is_rejected_without_changing_the_conflict(self):
        self.git("checkout", "--quiet", "-b", "side")
        self.entry.write_text(HEADER + "分支甲\n", encoding="utf-8")
        self.git("add", ENTRY)
        self.git("commit", "--quiet", "-m", "side")
        self.git("checkout", "--quiet", "main")
        self.entry.write_text(HEADER + "分支乙\n", encoding="utf-8")
        self.git("add", ENTRY)
        self.git("commit", "--quiet", "-m", "main")
        self.git("merge", "side", expected=1)
        before = self.git("ls-files", "--unmerged").stdout
        self.assertTrue(before)
        self.gate("--staged", expected=1)
        self.assertEqual(self.git("ls-files", "--unmerged").stdout, before)

    def test_snapshot_does_not_follow_a_staged_symlink(self):
        object_id = self.git("hash-object", "-w", "--stdin", input_data="../outside").stdout.strip()
        self.git("update-index", "--add", "--cacheinfo", f"120000,{object_id},shortcut")
        result = self.gate("--staged", expected=1)
        self.assertIn("符号链接", result.stderr)


class HookInstallationTests(GitFixture):
    def test_existing_hook_configuration_is_preserved(self):
        self.git("config", "core.hooksPath", "my-hooks")
        self.install_hooks(expected=1)
        self.assertEqual(self.git("config", "--get", "core.hooksPath").stdout.strip(), "my-hooks")

    def test_existing_default_hooks_are_not_disabled(self):
        existing = self.root / ".git" / "hooks" / "pre-commit"
        existing.write_text("#!/bin/sh\nexit 0\n", encoding="utf-8")
        self.install_hooks(expected=1)
        self.assertEqual(existing.read_text(encoding="utf-8"), "#!/bin/sh\nexit 0\n")
        self.git("config", "--get", "core.hooksPath", expected=1)

    def test_hook_installation_is_explicit_and_idempotent(self):
        self.git("config", "--get", "core.hooksPath", expected=1)
        self.install_hooks()
        self.install_hooks()
        self.assertEqual(self.git("config", "--get", "core.hooksPath").stdout.strip(), ".githooks")

    @unittest.skipIf(os.name == "nt", "POSIX executable bits do not apply on Windows")
    def test_reinstall_repairs_missing_execute_bits_on_our_hooks(self):
        self.install_hooks()
        hook = self.root / ".githooks" / "pre-commit"
        hook.chmod(0o644)
        self.install_hooks()
        self.assertTrue(hook.stat().st_mode & 0o111)

    def test_real_pre_commit_blocks_an_invalid_index(self):
        self.install_hooks()
        self.entry.write_text(OVERSIZED, encoding="utf-8")
        self.git("add", ENTRY)
        self.entry.write_text(VALID, encoding="utf-8")
        result = self.git("commit", "--quiet", "-m", "must be blocked", expected=None)
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("12001", result.stdout + result.stderr)
        self.assertEqual(self.git("rev-parse", "HEAD").stdout.strip(), self.original_commit)

    def test_real_pre_push_blocks_a_non_head_branch_before_remote_update(self):
        commit = self.bad_branch()
        remote = self.base / "remote.git"
        self.git("init", "--quiet", "--bare", str(remote))
        self.git("remote", "add", "origin", str(remote))
        self.install_hooks()
        result = self.git("push", "origin", "oversized:main", expected=None)
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn(commit, result.stdout + result.stderr)
        self.assertIn("12001", result.stdout + result.stderr)
        self.git("-C", str(remote), "show-ref", "--verify", "--quiet", "refs/heads/main", expected=1)


if __name__ == "__main__":
    unittest.main()
