import assert from "node:assert/strict";
import test from "node:test";
import { findUnsupportedText } from "./content-save-validation";

test("normal writing characters are accepted", () => {
  const result = findUnsupportedText({
    title: "God's grace — “faith” and life: 1 John 3:1",
    body: "Apostrophes, commas, periods, colons; questions? Exclamations! (Parentheses), accents: José, naïve, and Unicode: ✝️",
  });
  assert.equal(result, null);
});

test("line breaks are accepted", () => {
  assert.equal(findUnsupportedText({ body: "First line\nSecond line\r\nThird line" }), null);
});

test("NUL characters are identified without changing the input", () => {
  const value = "before\u0000after";
  const result = findUnsupportedText({ introduction: value });
  assert.deepEqual(result, { field: "value.introduction", codePoint: "U+0000" });
  assert.equal(value, "before\u0000after");
});

test("unpaired Unicode surrogates are identified", () => {
  const result = findUnsupportedText({ body: "bad\uD800text" });
  assert.deepEqual(result, { field: "value.body", codePoint: "U+D800" });
});

test("valid surrogate pairs such as emoji are accepted", () => {
  assert.equal(findUnsupportedText({ body: "Grace ✝️ 🙏🏽" }), null);
});
