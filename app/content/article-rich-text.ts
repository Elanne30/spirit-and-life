export const RICH_TEXT_FORMAT = "spirit-and-life-rich-text" as const;
export const RICH_TEXT_VERSION = 1 as const;

export const fontFamilies = ["serif", "sans-serif", "Georgia"] as const;
// Keep legacy rem values for existing documents and allow numeric document-editor sizes from 2px through 40px.
export const fontSizes = [
  "0.875rem",
  "1rem",
  "1.25rem",
  "1.5rem",
  ...Array.from({ length: 39 }, (_, index) => `${index + 2}px`),
] as const;
export const textAlignments = ["left", "center", "right", "justify"] as const;

export type FontFamily = (typeof fontFamilies)[number];
export type FontSize = (typeof fontSizes)[number];
export type TextAlignment = (typeof textAlignments)[number];
export type LegacySection = { heading: string; paragraphs: string[] };
export type RichTextDocument = { format: typeof RICH_TEXT_FORMAT; version: typeof RICH_TEXT_VERSION; content: { type: "doc"; content: RichTextNode[] } };
export type RichTextNode = { type: "heading" | "paragraph" | "bulletList" | "orderedList" | "listItem" | "text"; attrs?: Record<string, unknown>; text?: string; marks?: RichTextMark[]; content?: RichTextNode[] };
export type RichTextMark = { type: "bold" | "italic" | "underline" | "link" | "textStyle"; attrs?: Record<string, unknown> };

const maxIndent = 8;
const maxListDepth = 4;
const allowedSchemes = new Set(["http:", "https:", "mailto:"]);
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function asText(value: unknown) { return typeof value === "string" ? value : ""; }
function asContent(value: unknown) { return Array.isArray(value) ? value : []; }
function validLink(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const href = value.trim();
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try { const url = new URL(href); return allowedSchemes.has(url.protocol) ? href : null; } catch { return null; }
}
function validColor(value: unknown) {
  if (typeof value !== "string") return null;
  const color = value.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) return color;
  if (/^(rgb|hsl)a?\([^)]*\)$/.test(color)) return color;
  return null;
}
function normalizeMarks(value: unknown): RichTextMark[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const marks: RichTextMark[] = [];
  const seen = new Set<string>();
  for (const raw of value) {
    if (!isRecord(raw) || typeof raw.type !== "string") continue;
    if (["bold", "italic", "underline"].includes(raw.type) && !seen.has(raw.type)) { marks.push({ type: raw.type as RichTextMark["type"] }); seen.add(raw.type); }
    if (raw.type === "link" && !seen.has("link")) { const href = validLink(isRecord(raw.attrs) ? raw.attrs.href : undefined); if (href) marks.push({ type: "link", attrs: { href } }); seen.add("link"); }
    if (raw.type === "textStyle" && !seen.has("textStyle")) {
      const attrs = isRecord(raw.attrs) ? raw.attrs : {};
      const fontFamily = fontFamilies.includes(attrs.fontFamily as FontFamily) ? attrs.fontFamily as FontFamily : undefined;
      const fontSize = fontSizes.includes(attrs.fontSize as FontSize) ? attrs.fontSize as FontSize : undefined;
      const color = validColor(attrs.color);
      if (fontFamily || fontSize || color) marks.push({ type: "textStyle", attrs: { ...(fontFamily ? { fontFamily } : {}), ...(fontSize ? { fontSize } : {}), ...(color ? { color } : {}) } });
      seen.add("textStyle");
    }
  }
  return marks.length ? marks : undefined;
}
function normalizeBlockAttrs(value: unknown, heading = false) {
  const attrs = isRecord(value) ? value : {};
  const textAlign = textAlignments.includes(attrs.textAlign as TextAlignment) ? attrs.textAlign as TextAlignment : "left";
  const indentValue = Number(attrs.indent);
  const firstLineValue = Number(attrs.firstLineIndent);
  const rightIndentValue = Number(attrs.rightIndent);
  const lineSpacingValue = Number(attrs.lineSpacing);
  const indent = Number.isInteger(indentValue) ? Math.max(0, Math.min(maxIndent, indentValue)) : 0;
  const firstLineIndent = Number.isInteger(firstLineValue) ? Math.max(0, Math.min(maxIndent, firstLineValue)) : 0;
  const rightIndent = Number.isInteger(rightIndentValue) ? Math.max(0, Math.min(maxIndent, rightIndentValue)) : 0;
  const lineSpacing = [1, 1.15, 1.5, 2].includes(lineSpacingValue) ? lineSpacingValue : 1;
  return heading
    ? { level: Number.isInteger(Number(attrs.level)) ? Math.max(1, Math.min(6, Number(attrs.level))) : 2, textAlign, indent, firstLineIndent, rightIndent, lineSpacing }
    : { textAlign, indent, firstLineIndent, rightIndent, lineSpacing };
}
function normalizeNodes(value: unknown, depth = 0): RichTextNode[] {
  if (depth > maxListDepth + 1) return [];
  const nodes: RichTextNode[] = [];
  for (const raw of asContent(value)) {
    if (!isRecord(raw) || typeof raw.type !== "string") continue;
    if (raw.type === "text") { const text = asText(raw.text); if (text) nodes.push({ type: "text", text, marks: normalizeMarks(raw.marks) }); continue; }
    if (raw.type === "hardBreak") { nodes.push({ type: "text", text: "\n" }); continue; }
    if (raw.type === "paragraph" || raw.type === "heading") { const content = normalizeNodes(raw.content, depth).filter((node) => node.type === "text"); nodes.push({ type: raw.type, attrs: normalizeBlockAttrs(raw.attrs, raw.type === "heading"), ...(content.length ? { content } : {}) }); continue; }
    if (raw.type === "bulletList" || raw.type === "orderedList") { const content = normalizeNodes(raw.content, depth + 1).filter((node) => node.type === "listItem"); if (content.length) nodes.push({ type: raw.type, content }); continue; }
    if (raw.type === "listItem") { const content = normalizeNodes(raw.content, depth + 1).filter((node) => ["paragraph", "heading", "bulletList", "orderedList"].includes(node.type)); if (content.length) nodes.push({ type: "listItem", content }); }
  }
  return nodes;
}
function isSupportedMarks(value: unknown) {
  if (value === undefined) return true;
  if (!Array.isArray(value)) return false;
  return value.every((mark) => {
    if (!isRecord(mark) || typeof mark.type !== "string") return false;
    if (["bold", "italic", "underline"].includes(mark.type)) return true;
    if (mark.type === "link") return validLink(isRecord(mark.attrs) ? mark.attrs.href : undefined) !== null;
    if (mark.type === "textStyle") { const attrs = isRecord(mark.attrs) ? mark.attrs : {}; return (attrs.fontFamily === undefined || fontFamilies.includes(attrs.fontFamily as FontFamily)) && (attrs.fontSize === undefined || fontSizes.includes(attrs.fontSize as FontSize)) && (attrs.color === undefined || validColor(attrs.color) !== null); }
    return false;
  });
}
type SupportedNodeContext = "block" | "inline" | "list" | "listItem";
function isSupportedNodes(value: unknown, context: SupportedNodeContext, depth = 0): boolean {
  if (!Array.isArray(value) || depth > maxListDepth + 1) return false;
  return value.every((raw) => {
    if (!isRecord(raw) || typeof raw.type !== "string") return false;
    if (raw.type === "text") return context === "inline" && typeof raw.text === "string" && isSupportedMarks(raw.marks);
    if (raw.type === "hardBreak") return context === "inline";
    if (raw.type === "paragraph" || raw.type === "heading") return context !== "inline" && (raw.content === undefined || isSupportedNodes(raw.content, "inline", depth));
    if (raw.type === "bulletList" || raw.type === "orderedList") return context !== "inline" && isSupportedNodes(raw.content, "list", depth + 1);
    if (raw.type === "listItem") return context === "list" && isSupportedNodes(raw.content, "listItem", depth + 1);
    return context === "listItem" && (raw.type === "paragraph" || raw.type === "heading" || raw.type === "bulletList" || raw.type === "orderedList");
  });
}
export function normalizeRichTextDocument(value: unknown): RichTextDocument | null {
  if (!isRecord(value) || value.format !== RICH_TEXT_FORMAT || value.version !== RICH_TEXT_VERSION || !isRecord(value.content) || value.content.type !== "doc") return null;
  if (!isSupportedNodes(value.content.content, "block")) return null;
  const content = normalizeNodes(value.content.content);
  return { format: RICH_TEXT_FORMAT, version: RICH_TEXT_VERSION, content: { type: "doc", content: content.length ? content : [{ type: "paragraph", attrs: { textAlign: "left", indent: 0, firstLineIndent: 0, rightIndent: 0, lineSpacing: 1 } }] } };
}
export function legacySectionsToRichText(sections: LegacySection[] | undefined): RichTextDocument {
  const content: RichTextNode[] = [];
  for (const section of sections ?? []) {
    if (section.heading.trim()) content.push({ type: "heading", attrs: { level: 2, textAlign: "left", indent: 0, firstLineIndent: 0, rightIndent: 0, lineSpacing: 1 }, content: [{ type: "text", text: section.heading }] });
    for (const paragraph of section.paragraphs ?? []) if (paragraph.trim()) content.push({ type: "paragraph", attrs: { textAlign: "left", indent: 0, firstLineIndent: 0, rightIndent: 0, lineSpacing: 1 }, content: [{ type: "text", text: paragraph }] });
  }
  return { format: RICH_TEXT_FORMAT, version: RICH_TEXT_VERSION, content: { type: "doc", content: content.length ? content : [{ type: "paragraph", attrs: { textAlign: "left", indent: 0, firstLineIndent: 0, rightIndent: 0, lineSpacing: 1 } }] } };
}
function nodeText(node: RichTextNode): string { if (node.type === "text") return node.text ?? ""; return (node.content ?? []).map(nodeText).join(""); }
export function richTextToLegacySections(document: RichTextDocument): LegacySection[] {
  const sections: LegacySection[] = [];
  let current: LegacySection | null = null;
  const addParagraph = (text: string) => { const value = text.trim(); if (!value) return; if (!current) { current = { heading: "", paragraphs: [] }; sections.push(current); } current.paragraphs.push(value); };
  const walk = (nodes: RichTextNode[]) => nodes.forEach((node) => { if (node.type === "heading") { current = { heading: nodeText(node).trim(), paragraphs: [] }; sections.push(current); } else if (node.type === "paragraph") addParagraph(nodeText(node)); else if (node.type === "bulletList" || node.type === "orderedList" || node.type === "listItem") walk(node.content ?? []); });
  walk(document.content.content);
  return sections.filter((section) => section.heading || section.paragraphs.length);
}
