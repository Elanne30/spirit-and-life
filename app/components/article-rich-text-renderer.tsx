import type { CSSProperties, ElementType, ReactNode } from "react";
import type { RichTextNode } from "@/app/content/article-rich-text";
import { normalizeRichTextDocument } from "@/app/content/article-rich-text";

function blockClass(attrs: Record<string, unknown> | undefined) {
  const align = typeof attrs?.textAlign === "string" ? attrs.textAlign : "left";
  return `rich-text-align-${align}`;
}

function blockStyle(attrs: Record<string, unknown> | undefined): CSSProperties {
  const indent = typeof attrs?.indent === "number" ? attrs.indent : 0;
  const firstLineIndent = typeof attrs?.firstLineIndent === "number" ? attrs.firstLineIndent : 0;
  const rightIndent = typeof attrs?.rightIndent === "number" ? attrs.rightIndent : 0;
  const lineSpacing = typeof attrs?.lineSpacing === "number" ? attrs.lineSpacing : 1;
  return {
    marginLeft: indent ? `${indent * 0.25}in` : undefined,
    textIndent: firstLineIndent ? `${firstLineIndent * 0.25}in` : undefined,
    marginRight: rightIndent ? `${rightIndent * 0.25}in` : undefined,
    lineHeight: lineSpacing !== 1 ? lineSpacing : undefined,
  };
}

function renderText(node: RichTextNode, key: string) {
  let content: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") content = <strong key={`${key}-bold`}>{content}</strong>;
    if (mark.type === "italic") content = <em key={`${key}-italic`}>{content}</em>;
    if (mark.type === "underline") content = <span className="rich-text-underline" key={`${key}-underline`}>{content}</span>;
    if (mark.type === "textStyle") {
      const style: CSSProperties = {};
      if (typeof mark.attrs?.fontFamily === "string") style.fontFamily = mark.attrs.fontFamily === "Georgia" ? "Georgia, serif" : mark.attrs.fontFamily;
      if (typeof mark.attrs?.fontSize === "string") style.fontSize = mark.attrs.fontSize;
      if (typeof mark.attrs?.color === "string") style.color = mark.attrs.color;
      content = <span style={style} key={`${key}-style`}>{content}</span>;
    }
    if (mark.type === "link" && typeof mark.attrs?.href === "string") content = <a href={mark.attrs.href} rel={mark.attrs.href.startsWith("http") ? "noreferrer" : undefined} key={`${key}-link`}>{content}</a>;
  }
  return content;
}

function renderNodes(nodes: RichTextNode[], prefix = "node"): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${prefix}-${index}`;
    if (node.type === "text") return <span key={key}>{renderText(node, key)}</span>;
    if (node.type === "heading") {
      const level = Math.max(1, Math.min(6, Number(node.attrs?.level ?? 2)));
      const Tag = `h${level}` as ElementType;
      return <Tag className={blockClass(node.attrs)} style={blockStyle(node.attrs)} key={key}>{renderNodes(node.content ?? [], key)}</Tag>;
    }
    if (node.type === "paragraph") return <p className={blockClass(node.attrs)} style={blockStyle(node.attrs)} key={key}>{renderNodes(node.content ?? [], key)}</p>;
    if (node.type === "bulletList") return <ul className="rich-text-list" key={key}>{renderNodes(node.content ?? [], key)}</ul>;
    if (node.type === "orderedList") return <ol className="rich-text-list" key={key}>{renderNodes(node.content ?? [], key)}</ol>;
    if (node.type === "listItem") return <li key={key}>{renderNodes(node.content ?? [], key)}</li>;
    return null;
  });
}

export function ArticleRichTextRenderer({ document }: { document: unknown }) {
  const normalized = normalizeRichTextDocument(document);
  if (!normalized) return null;
  return <div className="article-rich-text">{renderNodes(normalized.content.content)}</div>;
}
