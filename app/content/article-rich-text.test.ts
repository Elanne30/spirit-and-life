import assert from "node:assert/strict";
import test from "node:test";
// Node's built-in TypeScript runner requires the explicit extension; Next's
// application imports continue to use the normal extensionless form.
// @ts-expect-error Node test runner import
import { legacySectionsToRichText, normalizeRichTextDocument, richTextToLegacySections } from "./article-rich-text.ts";

test("legacy sections become heading and paragraph rich-text nodes", () => {
  const document = legacySectionsToRichText([{ heading: "Grace", paragraphs: ["One", "Two"] }]);
  assert.deepEqual(document.content.content.map((node) => node.type), ["heading", "paragraph", "paragraph"]);
  assert.equal(document.content.content[0].content?.[0].text, "Grace");
});

test("rich text produces a readable legacy section projection", () => {
  const document = normalizeRichTextDocument({ format: "spirit-and-life-rich-text", version: 1, content: { type: "doc", content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "A heading" }] },
    { type: "paragraph", content: [{ type: "text", text: "A formatted paragraph", marks: [{ type: "bold" }] }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "A list item" }] }] }] },
  ] } });
  assert.ok(document);
  assert.deepEqual(richTextToLegacySections(document), [{ heading: "A heading", paragraphs: ["A formatted paragraph", "A list item"] }]);
});

test("hard line breaks from the editor are accepted and preserved as text line breaks", () => {
  const document = normalizeRichTextDocument({
    format: "spirit-and-life-rich-text",
    version: 1,
    content: {
      type: "doc",
      content: [{
        type: "paragraph",
        content: [
          { type: "text", text: "First line" },
          { type: "hardBreak" },
          { type: "text", text: "Second line" },
        ],
      }],
    },
  });

  assert.ok(document);
  assert.equal(document.content.content[0].content?.map((node) => node.text ?? "").join(""), "First line\nSecond line");
});

test("unsafe links and unsupported nodes are rejected", () => {
  const unsafeLink = normalizeRichTextDocument({ format: "spirit-and-life-rich-text", version: 1, content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Bad", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] } });
  const unsupportedNode = normalizeRichTextDocument({ format: "spirit-and-life-rich-text", version: 1, content: { type: "doc", content: [{ type: "script", text: "Bad" }] } });
  assert.equal(unsafeLink, null);
  assert.equal(unsupportedNode, null);
});

test("approved marks and formatting attributes are retained", () => {
  const document = normalizeRichTextDocument({ format: "spirit-and-life-rich-text", version: 1, content: { type: "doc", content: [{ type: "paragraph", attrs: { textAlign: "justify", indent: 2 }, content: [{ type: "text", text: "Formatted", marks: [{ type: "bold" }, { type: "italic" }, { type: "underline" }, { type: "textStyle", attrs: { fontFamily: "Georgia", fontSize: "1.25rem" } }, { type: "link", attrs: { href: "https://example.com" } }] }] }] } });
  assert.equal(document?.content.content[0].attrs?.textAlign, "justify");
  assert.equal(document?.content.content[0].attrs?.indent, 2);
  assert.equal(document?.content.content[0].content?.[0].marks?.length, 5);
});
