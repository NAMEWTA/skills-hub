"""Check archival fidelity without treating executable fixtures as translated prose."""

import contextlib
import csv
import hashlib
import io
from pathlib import Path
import tempfile
import unittest

from scripts.validate_materials import check


class MaterialFidelityTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="skills-wta-materials-")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.materials = self.root / "materials"
        self.pair = self.materials / "a001"
        self.pair.mkdir(parents=True)
        self.runtime = self.root / "skills" / "dev" / "dev-sample" / "references" / "method.md"
        self.runtime.parent.mkdir(parents=True)
        self.runtime.write_text("# 本地方法\n", encoding="utf-8")

    def write_pair(self, kind="document", original=b"# Original\n", localized="# 完整译文\n".encode()):
        for path in self.pair.iterdir():
            path.unlink()
        filename = "localized.png" if kind == "asset" else "zh-CN.txt" if kind == "document" else "localized.txt"
        original_name = "original.png" if kind == "asset" else "original.txt"
        (self.pair / original_name).write_bytes(original)
        (self.pair / filename).write_bytes(localized)
        self.row = {
            "id": "a001",
            "kind": kind,
            "source_group": "sample",
            "source_path": "source/example.png" if kind == "asset" else "source/example.md",
            "source_git_blob": hashlib.sha1(f"blob {len(original)}\0".encode() + original).hexdigest(),
            "original_sha256": hashlib.sha256(original).hexdigest(),
            "translation_sha256": hashlib.sha256(localized).hexdigest(),
            "runtime_paths": self.runtime.relative_to(self.root).as_posix(),
            "adaptation": "完整内容在本地运行。",
        }
        self.save_manifest()

    def save_manifest(self):
        with (self.materials / "manifest.tsv").open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=self.row, delimiter="\t", lineterminator="\n")
            writer.writeheader()
            writer.writerow(self.row)

    def failures(self):
        with contextlib.redirect_stdout(io.StringIO()):
            return check(self.root)

    def test_complete_chinese_document_is_valid(self):
        self.write_pair()
        self.assertEqual(self.failures(), [])

    def test_source_blob_detects_a_changed_original_even_if_sha256_was_replaced(self):
        self.write_pair()
        changed = b"# Modified source\n"
        (self.pair / "original.txt").write_bytes(changed)
        self.row["original_sha256"] = hashlib.sha256(changed).hexdigest()
        self.save_manifest()
        self.assertTrue(any("source Git blob" in error for error in self.failures()))

    def test_changed_translation_is_detected(self):
        self.write_pair()
        (self.pair / "zh-CN.txt").write_text("被截短的译文", encoding="utf-8")
        self.assertTrue(any("SHA-256" in error for error in self.failures()))

    def test_code_can_preserve_identifiers_without_fabricated_chinese(self):
        code = b"export const enabled = true;\n"
        self.write_pair("code", code, code)
        self.assertEqual(self.failures(), [])

    def test_empty_machine_fixture_is_valid_and_preserved(self):
        self.write_pair("fixture", b"", b"")
        self.assertEqual(self.failures(), [])

    def test_machine_fixture_must_not_be_translated(self):
        self.write_pair("fixture", b'{"state":"READY"}\n', b'{"state":"START"}\n')
        self.assertTrue(any("original bytes" in error for error in self.failures()))

    def test_runtime_mapping_cannot_escape_skills(self):
        self.write_pair()
        self.row["runtime_paths"] = "materials/a001/original.txt"
        self.save_manifest()
        self.assertTrue(any("outside skills" in error for error in self.failures()))

    def test_untranslated_document_is_not_a_chinese_translation(self):
        self.write_pair(localized=b"# Original copied without translation\n")
        self.assertTrue(any("Chinese translation is absent" in error for error in self.failures()))

    def test_binary_asset_is_preserved_without_text_decoding(self):
        data = b"\x89PNG\r\n\x1a\n\xff\xfe"
        self.write_pair("asset", data, data)
        self.assertEqual(self.failures(), [])

    def test_changed_asset_cannot_claim_to_be_an_original_copy(self):
        self.write_pair("asset", b"\x89PNG\r\n\x1a\noriginal", b"\x89PNG\r\n\x1a\nmodified")
        self.assertTrue(any("original bytes" in error for error in self.failures()))


if __name__ == "__main__":
    unittest.main()
