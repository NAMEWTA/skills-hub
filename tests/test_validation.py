"""Post-implementation regression checks for independent, local skill resources."""

from pathlib import Path
import tempfile
import unittest

from scripts import validate


class IndependentResourceTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="skills-wta-links-")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.skill = self.root / "dev-sample"
        self.skill.mkdir()
        self.entry = self.skill / "SKILL.md"
        self.entry.write_text("# 示例\n", encoding="utf-8")
        self.reference = self.skill / "references" / "完整说明.md"
        self.reference.parent.mkdir()
        self.reference.write_text("# 完整说明\n", encoding="utf-8")

    def test_full_local_chinese_resource_is_resolvable(self):
        destinations = validate.markdown_destinations("参见 [完整说明](references/完整说明.md#设计)。")
        self.assertEqual(len(destinations), 1)
        target, error = validate.local_target(self.entry, destinations[0], self.skill)
        self.assertIsNone(error)
        self.assertEqual(target, self.reference.resolve())

    def test_reference_style_and_html_links_are_checked(self):
        body = '[方法][details]\n\n[details]: references/完整说明.md "说明"\n<a href="references/missing.md">另一个</a>'
        destinations = validate.markdown_destinations(body)
        self.assertIn("references/完整说明.md", destinations)
        self.assertIn("references/missing.md", destinations)
        _, error = validate.local_target(self.entry, "references/missing.md", self.skill)
        self.assertIn("missing", error)

    def test_existing_sibling_file_does_not_satisfy_standalone_install(self):
        sibling = self.root / "dev-other"
        sibling.mkdir()
        (sibling / "SKILL.md").write_text("# 兄弟技能\n", encoding="utf-8")
        _, error = validate.local_target(self.entry, "../dev-other/SKILL.md", self.skill)
        self.assertIn("escapes", error)

    def test_encoded_parent_traversal_is_also_rejected(self):
        _, error = validate.local_target(self.entry, "%2e%2e/private.txt", self.skill)
        self.assertIn("escapes", error)

    def test_external_references_cannot_hide_in_alternate_link_syntax(self):
        for body in (
            "[说明](https://docs.example.edu/reference)",
            "[说明][a]\n[a]: //docs.example.edu/reference",
            '<a href="https://docs.example.edu/reference">说明</a>',
            "[说明](file:///some/other/repository/reference.md)",
            "```sh\ncurl https://docs.example.edu/reference\n```",
        ):
            with self.subTest(body=body):
                self.assertTrue(validate.runtime_issues(body))

    def test_loopback_and_reserved_operational_examples_are_not_document_dependencies(self):
        for url in ("http://127.0.0.1:8080/health", "http://[::1]:8080/", "https://service.invalid/api"):
            with self.subTest(url=url):
                self.assertEqual(validate.runtime_issues(f"```sh\ncurl {url}\n```"), [])
        self.assertTrue(validate.runtime_issues("https://localhost.remote.example.edu/"))

    def test_provenance_is_rejected_even_without_a_link(self):
        self.assertTrue(validate.runtime_issues("此方法来自 Matt Pocock。"))
        self.assertEqual(validate.runtime_issues("使用本地完整参考，按规格完成实现后验证。"), [])

    def test_url_parser_origin_does_not_allow_external_document_dependencies(self):
        literal = 'const origin = "https://github.com/";'
        self.assertEqual(validate.runtime_issues(literal, allow_service_prefixes=True), [])
        self.assertEqual(validate.runtime_issues('`https://github.com/${owner}/${repo}/pull/${number}`', allow_service_prefixes=True), [])
        self.assertTrue(validate.runtime_issues(literal))
        self.assertTrue(validate.runtime_issues('[资料](https://github.com/)', allow_service_prefixes=True))
        self.assertTrue(validate.runtime_issues('"https://github.com/example/repo"', allow_service_prefixes=True))

    def test_resource_index_can_connect_all_full_references(self):
        index = self.skill / "references" / "index.md"
        index.write_text("# 索引\n", encoding="utf-8")
        graph = {
            self.entry.resolve(): {index.resolve()},
            index.resolve(): {self.reference.resolve()},
        }
        self.assertEqual(validate.unreachable_markdown(self.skill, graph), set())
        graph[index.resolve()] = set()
        self.assertEqual(validate.unreachable_markdown(self.skill, graph), {self.reference.resolve()})

    def test_nested_fence_example_does_not_create_a_fake_resource_link(self):
        body = "````markdown\n```text\n```\n[示例](not-a-real-resource.md)\n````\n[真实](references/完整说明.md)"
        self.assertEqual(validate.markdown_destinations(body), ["references/完整说明.md"])


if __name__ == "__main__":
    unittest.main()
