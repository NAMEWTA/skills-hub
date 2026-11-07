"""Post-implementation checks for the installer's public contract.

Every installation uses a temporary repository and project. No user skill or
system directory is read or modified by these tests.
"""

from __future__ import annotations

import importlib.util
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import tempfile
import unittest
from unittest import mock


REPOSITORY = Path(__file__).resolve().parents[1]
INSTALLER_PATH = REPOSITORY / "install.py"
MODULE_SPEC = importlib.util.spec_from_file_location("skills_wta_installer_under_test", INSTALLER_PATH)
assert MODULE_SPEC is not None and MODULE_SPEC.loader is not None
installer = importlib.util.module_from_spec(MODULE_SPEC)
sys.modules[MODULE_SPEC.name] = installer
MODULE_SPEC.loader.exec_module(installer)


def snapshot(root: Path) -> dict[str, tuple]:
    """Capture temporary project contents, including links and empty folders."""
    result = {}
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root).as_posix()
        if path.is_symlink():
            result[relative] = ("link", os.readlink(path))
        elif path.is_dir():
            result[relative] = ("directory",)
        else:
            result[relative] = ("file", path.read_bytes())
    return result


class InstallContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="skills-wta-install-test-")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.repository = self.root / "repository"
        self.repository.mkdir()
        shutil.copy2(INSTALLER_PATH, self.repository / "install.py")
        self.project = self.root / "project"
        self.project.mkdir()
        self.skill_root = self.repository / "skills"
        self.target = self.project / ".agents" / "skills"
        self.sources = {
            "dev-alpha": self.write_skill("dev", "dev-alpha"),
            "dev-beta": self.write_skill("dev", "dev-beta"),
            "system-clean": self.write_skill("system", "system-clean"),
        }

    def write_skill(self, domain: str, name: str) -> Path:
        folder = self.skill_root / domain / name
        resources = {
            "SKILL.md": f"---\nname: {name}\ndescription: A fixture skill for {domain}.\n---\n\n# {name}\n".encode(),
            "references/details.md": b"Fixture reference.\n",
            "assets/nested/example.bin": bytes(range(16)),
            "scripts/check.py": b"#!/usr/bin/env python3\nprint('fixture')\n",
            "LICENSE": b"Fixture license: preserve this notice.\n",
        }
        for relative, content in resources.items():
            path = folder / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
        (folder / "scripts" / "check.py").chmod(0o755)
        return folder

    def run_cli(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(self.repository / "install.py"), *arguments],
            cwd=self.project,
            capture_output=True,
            text=True,
            timeout=20,
            check=False,
        )

    def assert_success(self, result: subprocess.CompletedProcess[str]) -> None:
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def assert_failure_without_writes(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        before = snapshot(self.project)
        result = self.run_cli(*arguments)
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(snapshot(self.project), before)
        return result

    def installed_names(self) -> set[str]:
        return {entry.name for entry in self.target.iterdir()}

    def seed_existing(self, name: str, differing: bool = False) -> Path:
        destination = self.target / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(self.sources[name], destination)
        if differing:
            (destination / "local-note.txt").write_text("Keep the user's local content.\n")
        return destination

    def create_symlink(self, link: Path, target: Path, directory: bool = True) -> None:
        link.parent.mkdir(parents=True, exist_ok=True)
        try:
            link.symlink_to(target, target_is_directory=directory)
        except (OSError, NotImplementedError) as exc:
            self.skipTest(f"Symlinks are unavailable on this platform: {exc}")

    def selected(self, *names: str) -> list:
        with mock.patch.object(installer, "SKILL_ROOT", self.skill_root):
            return installer.select(installer.catalog(), [], list(names), False)

    def assert_no_temporary_artifacts(self) -> None:
        agents = self.project / ".agents"
        self.assertFalse((agents / ".skills-wta-install.lock").exists())
        self.assertEqual(list(agents.glob(".skills-wta-stage-*")), [])

    def test_list_is_read_only_and_lists_all_domains(self) -> None:
        result = self.run_cli("list")
        self.assert_success(result)
        self.assertEqual({line.split()[1] for line in result.stdout.splitlines()}, set(self.sources))
        self.assertFalse((self.project / ".agents").exists())

    def test_list_can_filter_a_domain(self) -> None:
        result = self.run_cli("list", "--domain", "dev")
        self.assert_success(result)
        self.assertEqual({line.split()[1] for line in result.stdout.splitlines()}, {"dev-alpha", "dev-beta"})
        self.assertFalse((self.project / ".agents").exists())

    def test_domain_installs_flat_into_the_current_project(self) -> None:
        result = self.run_cli("install", "--domain", "dev")
        self.assert_success(result)
        self.assertEqual(self.installed_names(), {"dev-alpha", "dev-beta"})
        self.assertFalse((self.target / "dev").exists())
        self.assertFalse((self.repository / ".agents").exists())
        self.assert_no_temporary_artifacts()

    def test_install_inside_source_tree_is_rejected_without_writes(self) -> None:
        for directory in (self.skill_root, self.sources["dev-alpha"], self.sources["dev-alpha"] / "references"):
            for extra in ([], ["--dry-run"]):
                with self.subTest(directory=directory, extra=extra):
                    before = snapshot(self.repository)
                    result = subprocess.run(
                        [sys.executable, str(self.repository / "install.py"), "install", "--skill", "dev-alpha", *extra],
                        cwd=directory, capture_output=True, text=True, timeout=20, check=False,
                    )
                    self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
                    self.assertIn("outside this repository's source skills directory", result.stderr)
                    self.assertEqual(snapshot(self.repository), before)

    def test_select_named_skills_from_different_domains(self) -> None:
        result = self.run_cli("install", "--skill", "dev-beta", "system-clean")
        self.assert_success(result)
        self.assertEqual(self.installed_names(), {"dev-beta", "system-clean"})

    def test_mixed_and_repeated_selections_form_a_union(self) -> None:
        result = self.run_cli(
            "install", "--domain", "dev", "--domain", "dev",
            "--skill", "system-clean", "dev-alpha", "--skill", "dev-alpha",
        )
        self.assert_success(result)
        self.assertEqual(self.installed_names(), set(self.sources))
        self.assertEqual(sum("dev-alpha" in line for line in result.stdout.splitlines()), 1)

    def test_all_selects_every_domain(self) -> None:
        result = self.run_cli("install", "--all")
        self.assert_success(result)
        self.assertEqual(self.installed_names(), set(self.sources))

    def test_every_resource_and_license_is_copied(self) -> None:
        result = self.run_cli("install", "--skill", "dev-alpha")
        self.assert_success(result)
        self.assertEqual(snapshot(self.target / "dev-alpha"), snapshot(self.sources["dev-alpha"]))
        self.assertEqual((self.target / "dev-alpha" / "LICENSE").read_bytes(), b"Fixture license: preserve this notice.\n")
        if os.name != "nt":
            mode = stat.S_IMODE((self.target / "dev-alpha" / "scripts" / "check.py").stat().st_mode)
            self.assertEqual(mode, 0o755)

    @unittest.skipIf(os.name == "nt", "Windows does not use POSIX executable permission bits")
    def test_replace_repairs_executable_permission_drift_with_backup(self) -> None:
        self.assert_success(self.run_cli("install", "--skill", "dev-alpha"))
        installed = self.target / "dev-alpha" / "scripts" / "check.py"
        installed.chmod(0o644)
        conflict = self.assert_failure_without_writes("install", "--skill", "dev-alpha")
        self.assertIn("Existing skills differ", conflict.stderr)
        self.assertEqual(stat.S_IMODE(installed.stat().st_mode), 0o644)
        result = self.run_cli("install", "--skill", "dev-alpha", "--replace")
        self.assert_success(result)
        self.assertIn("replace", result.stdout)
        self.assertNotIn("unchanged", result.stdout)
        self.assertEqual(stat.S_IMODE(installed.stat().st_mode), 0o755)
        backups = list((self.project / ".agents" / ".skills-wta-backups").glob("*/dev-alpha/scripts/check.py"))
        self.assertEqual(len(backups), 1)
        self.assertEqual(stat.S_IMODE(backups[0].stat().st_mode), 0o644)
        repeated = self.run_cli("install", "--skill", "dev-alpha")
        self.assert_success(repeated)
        self.assertIn("unchanged", repeated.stdout)
        self.assert_no_temporary_artifacts()

    @unittest.skipIf(os.name == "nt", "Windows does not use POSIX executable permission bits")
    def test_replace_applies_source_executable_bit_only_change(self) -> None:
        self.assert_success(self.run_cli("install", "--skill", "dev-alpha"))
        source = self.sources["dev-alpha"] / "scripts" / "check.py"
        installed = self.target / "dev-alpha" / "scripts" / "check.py"
        source.chmod(0o644)
        self.assertEqual(source.read_bytes(), installed.read_bytes())
        result = self.run_cli("install", "--skill", "dev-alpha", "--replace")
        self.assert_success(result)
        self.assertNotIn("unchanged", result.stdout)
        self.assertEqual(stat.S_IMODE(installed.stat().st_mode), 0o644)
        backups = list((self.project / ".agents" / ".skills-wta-backups").glob("*/dev-alpha/scripts/check.py"))
        self.assertEqual(len(backups), 1)
        self.assertEqual(stat.S_IMODE(backups[0].stat().st_mode), 0o755)
        self.assert_no_temporary_artifacts()

    def test_dry_run_creates_no_directories_or_files(self) -> None:
        before = snapshot(self.project)
        result = self.run_cli("install", "--domain", "dev", "--dry-run")
        self.assert_success(result)
        self.assertIn("would install", result.stdout)
        self.assertEqual(snapshot(self.project), before)
        self.assertFalse((self.project / ".agents").exists())

    def test_dry_run_of_replacement_does_not_create_backup(self) -> None:
        self.seed_existing("dev-alpha", differing=True)
        before = snapshot(self.project)
        result = self.run_cli("install", "--skill", "dev-alpha", "--replace", "--dry-run")
        self.assert_success(result)
        self.assertIn("would replace", result.stdout)
        self.assertEqual(snapshot(self.project), before)

    def test_repeated_install_is_idempotent(self) -> None:
        self.assert_success(self.run_cli("install", "--all"))
        before = snapshot(self.project)
        sample = self.target / "dev-alpha" / "SKILL.md"
        old_mtime = sample.stat().st_mtime_ns
        result = self.run_cli("install", "--all")
        self.assert_success(result)
        self.assertEqual(result.stdout.count("unchanged"), len(self.sources))
        self.assertEqual(snapshot(self.project), before)
        self.assertEqual(sample.stat().st_mtime_ns, old_mtime)
        self.assert_no_temporary_artifacts()

    def test_unknown_domain_or_name_makes_no_changes(self) -> None:
        for arguments in (("--domain", "missing"), ("--skill", "dev-missing"), ("--domain", "dev", "missing")):
            with self.subTest(arguments=arguments):
                result = self.assert_failure_without_writes("install", *arguments)
                self.assertIn("Unknown selection", result.stderr)

    def test_all_does_not_hide_an_unknown_selection(self) -> None:
        self.assert_failure_without_writes("install", "--all", "--skill", "dev-missing")

    def test_install_requires_a_selection(self) -> None:
        result = self.assert_failure_without_writes("install")
        self.assertIn("Choose --domain, --skill, or --all", result.stderr)

    def test_unknown_options_and_destination_overrides_are_rejected(self) -> None:
        for option in ("--unknown", "--target", "--destination"):
            with self.subTest(option=option):
                result = self.assert_failure_without_writes("install", "--all", option, "elsewhere")
                self.assertEqual(result.returncode, 2)

    def test_conflict_preflight_prevents_partial_install(self) -> None:
        self.seed_existing("dev-beta", differing=True)
        result = self.assert_failure_without_writes("install", "--domain", "dev")
        self.assertIn("Existing skills differ", result.stderr)
        self.assertFalse((self.target / "dev-alpha").exists())
        self.assert_no_temporary_artifacts()

    def test_replace_backs_up_only_differing_selected_skill(self) -> None:
        old = self.seed_existing("dev-alpha", differing=True)
        old_contents = snapshot(old)
        unchanged = self.seed_existing("dev-beta")
        unchanged_contents = snapshot(unchanged)
        unrelated = self.target / "personal-unrelated"
        unrelated.mkdir()
        (unrelated / "notes.md").write_text("Preserve me.\n")
        unrelated_contents = snapshot(unrelated)
        result = self.run_cli("install", "--domain", "dev", "--replace")
        self.assert_success(result)
        self.assertEqual(snapshot(old), snapshot(self.sources["dev-alpha"]))
        self.assertEqual(snapshot(unchanged), unchanged_contents)
        self.assertEqual(snapshot(unrelated), unrelated_contents)
        backups = list((self.project / ".agents" / ".skills-wta-backups").iterdir())
        self.assertEqual(len(backups), 1)
        self.assertEqual({entry.name for entry in backups[0].iterdir()}, {"dev-alpha"})
        self.assertEqual(snapshot(backups[0] / "dev-alpha"), old_contents)
        self.assert_no_temporary_artifacts()

    def test_source_name_must_have_its_domain_prefix(self) -> None:
        self.write_skill("dev", "other-name")
        result = self.assert_failure_without_writes("install", "--all")
        self.assertIn("Skill must be named dev-xxx", result.stderr)

    def test_source_frontmatter_name_must_match_directory(self) -> None:
        manifest = self.sources["dev-alpha"] / "SKILL.md"
        manifest.write_text(manifest.read_text().replace("name: dev-alpha", "name: dev-other"))
        result = self.assert_failure_without_writes("install", "--all")
        self.assertIn("Frontmatter name must equal directory name", result.stderr)

    def test_duplicate_flat_names_are_rejected(self) -> None:
        self.write_skill("dev", "dev-extra-example")
        self.write_skill("dev-extra", "dev-extra-example")
        result = self.assert_failure_without_writes("install", "--all")
        self.assertIn("Duplicate install name", result.stderr)

    def test_source_resource_symlinks_are_rejected(self) -> None:
        outside = self.root / "outside.txt"
        outside.write_text("Do not copy through a symlink.\n")
        self.create_symlink(self.sources["dev-alpha"] / "references" / "outside.md", outside, directory=False)
        result = self.assert_failure_without_writes("install", "--skill", "dev-alpha")
        self.assertIn("Symlinks", result.stderr)

    def test_source_skill_symlinks_are_rejected(self) -> None:
        original = self.sources["dev-alpha"]
        moved = self.root / "moved-source"
        original.rename(moved)
        self.create_symlink(original, moved)
        self.assert_failure_without_writes("install", "--skill", "dev-alpha")

    def test_source_domain_symlinks_are_rejected(self) -> None:
        original = self.skill_root / "dev"
        moved = self.root / "moved-domain"
        original.rename(moved)
        self.create_symlink(original, moved)
        self.assert_failure_without_writes("install", "--all")

    def test_source_root_symlinks_are_rejected(self) -> None:
        original = self.skill_root
        moved = self.root / "moved-skills"
        original.rename(moved)
        self.create_symlink(original, moved)
        self.assert_failure_without_writes("install", "--all")

    def test_destination_agents_symlink_is_not_followed(self) -> None:
        outside = self.root / "outside-agents"
        outside.mkdir()
        self.create_symlink(self.project / ".agents", outside)
        self.assert_failure_without_writes("install", "--all")
        self.assertEqual(snapshot(outside), {})

    def test_destination_skills_symlink_is_not_followed(self) -> None:
        outside = self.root / "outside-skills"
        outside.mkdir()
        self.create_symlink(self.target, outside)
        self.assert_failure_without_writes("install", "--all")
        self.assertEqual(snapshot(outside), {})

    def test_destination_skill_symlink_is_not_replaced(self) -> None:
        outside = self.root / "outside-skill"
        shutil.copytree(self.sources["dev-alpha"], outside)
        before = snapshot(outside)
        self.create_symlink(self.target / "dev-alpha", outside)
        self.assert_failure_without_writes("install", "--skill", "dev-alpha", "--replace")
        self.assertEqual(snapshot(outside), before)

    def test_destination_nested_symlink_is_not_copied_or_removed(self) -> None:
        existing = self.seed_existing("dev-alpha", differing=True)
        outside = self.root / "outside.txt"
        outside.write_text("Preserve outside data.\n")
        self.create_symlink(existing / "outside.txt", outside, directory=False)
        self.assert_failure_without_writes("install", "--skill", "dev-alpha", "--replace")
        self.assertEqual(outside.read_text(), "Preserve outside data.\n")

    def test_backup_root_symlink_is_not_followed(self) -> None:
        self.seed_existing("dev-alpha", differing=True)
        outside = self.root / "outside-backups"
        outside.mkdir()
        self.create_symlink(self.project / ".agents" / ".skills-wta-backups", outside)
        self.assert_failure_without_writes("install", "--skill", "dev-alpha", "--replace")
        self.assertEqual(snapshot(outside), {})

    def test_existing_installer_lock_is_preserved(self) -> None:
        lock = self.project / ".agents" / ".skills-wta-install.lock"
        lock.mkdir(parents=True)
        result = self.assert_failure_without_writes("install", "--domain", "dev")
        self.assertIn("installer lock exists", result.stderr)
        self.assertTrue(lock.is_dir())

    def test_staging_failure_preserves_existing_skills(self) -> None:
        self.seed_existing("dev-beta", differing=True)
        before = snapshot(self.target)
        selected = self.selected("dev-alpha", "dev-beta")
        real_copytree = shutil.copytree

        def failing_copy(source, destination, *args, **kwargs):
            if Path(source) == self.sources["dev-beta"]:
                raise OSError("simulated staging failure")
            return real_copytree(source, destination, *args, **kwargs)

        with mock.patch.object(installer.shutil, "copytree", side_effect=failing_copy):
            with self.assertRaisesRegex(installer.InstallError, "rolled back"):
                installer.apply(selected, self.project, replace=True)
        self.assertEqual(snapshot(self.target), before)
        self.assert_no_temporary_artifacts()

    def test_publish_failure_rolls_back_new_install_and_replacement(self) -> None:
        self.seed_existing("dev-beta", differing=True)
        before = snapshot(self.target)
        selected = self.selected("dev-alpha", "dev-beta")
        real_replace = os.replace

        def failing_replace(source, destination):
            source = Path(source)
            if source.name == "dev-beta" and source.parent.name.startswith(".skills-wta-stage-"):
                raise OSError("simulated publish failure")
            return real_replace(source, destination)

        with mock.patch.object(installer.os, "replace", side_effect=failing_replace):
            with self.assertRaisesRegex(installer.InstallError, "rolled back"):
                installer.apply(selected, self.project, replace=True)
        self.assertEqual(snapshot(self.target), before)
        self.assertFalse((self.target / "dev-alpha").exists())
        self.assert_no_temporary_artifacts()

    def test_failed_rollback_preserves_recoverable_backup(self) -> None:
        old = self.seed_existing("dev-alpha", differing=True)
        old_contents = snapshot(old)
        selected = self.selected("dev-alpha", "dev-beta")
        real_replace = os.replace

        def failing_replace(source, destination):
            source = Path(source)
            if source.name == "dev-beta" and source.parent.name.startswith(".skills-wta-stage-"):
                raise OSError("simulated publish failure")
            if ".skills-wta-backups" in source.parts:
                raise OSError("simulated restore failure")
            return real_replace(source, destination)

        with mock.patch.object(installer.os, "replace", side_effect=failing_replace):
            with self.assertRaisesRegex(installer.InstallError, "manual recovery") as raised:
                installer.apply(selected, self.project, replace=True)
        backups = list((self.project / ".agents" / ".skills-wta-backups").glob("*/dev-alpha"))
        self.assertEqual(len(backups), 1)
        self.assertEqual(snapshot(backups[0]), old_contents)
        self.assertIn(str(backups[0].parent), str(raised.exception))
        self.assert_no_temporary_artifacts()


if __name__ == "__main__":
    unittest.main()
