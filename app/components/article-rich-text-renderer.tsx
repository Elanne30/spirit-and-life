import type { ReactNode } from "react";
import type { RichTextNode } from "@/app/content/article-rich-text";
import { normalizeRichTextDocument } from "@/app/content/article-rich-text";

function classNames(...names: Array<string | undefined>) { return names.filter(Boolean).join(" "); }
function blockClass(attrs: Record<string, unknown> | undefined) {
  const align = typeof attrs?.textAlign === "string" ? attrs.textAlign : "left";
  const indent = typeof attrs?.indent === "number" ? attrs.indent : 0;
  return classNames(`rich-text-align-${align}`, indent ? `rich-text-indent-${indent}` : undefined);
}
function renderText(node: RichTextNode, key: string) {
  let content: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") content = <strong key={`${key}-bold`}>{content}</strong>;
    if (mark.type === "italic") content = <em key={`${key}-italic`}>{content}</em>;
    if (mark.type === "underline") content = <span className="rich-text-underline" key={`${key}-underline`}>{content}</span>;
    if (mark.type === "textStyle") content = <span className={classNames(mark.attrs?.fontFamily ? `rich-text-font-${mark.attrs.fontFamily}` : undefined, mark.attrs?.fontSize ? `rich-text-size-${mark.attrs.fontSize}` : undefined)} key={`${key}-style`}>{content}</span>;
    if (mark.type === "link" && typeof mark.attrs?.href === "string") content = <a href={mark.attrs.href} rel={mark.attrs.href.startsWith("http") ? "noreferrer" : undefined} key={`${key}-link`}>{content}</a>;
  }
  return content;
}
function renderNodes(nodes: RichTextNode[], prefix = "node"): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${prefix}-${index}`;
    if (node.type === "text") return <span key={key}>{renderText(node, key)}</span>;
    if (node.type === "heading") return node.attrs?.level === 3 ? <h3 className={blockClass(node.attrs)} key={key}>{renderNodes(node.content ?? [], key)}</h3> : <h2 className={blockClass(node.attrs)} key={key}>{renderNodes(node.content ?? [], key)}</h2>;
    if (node.type === "paragraph") return <p className={blockClass(node.attrs)} key={key}>{renderNodes(node.content ?? [], key)}</p>;
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
