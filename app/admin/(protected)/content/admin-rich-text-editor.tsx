"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading2, IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Pilcrow, Redo2, RotateCcw, Underline } from "lucide-react";
import { fontFamilies, fontSizes, type RichTextDocument, textAlignments } from "@/app/content/article-rich-text";

type AdminRichTextEditorProps = {
  initialValue: RichTextDocument;
  onChange: (document: RichTextDocument) => void;
  labelledBy?: string;
};

const numericFontSizes = [
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "22", value: "22px" },
  { label: "24", value: "24px" },
  { label: "26", value: "26px" },
  { label: "28", value: "28px" },
  { label: "30", value: "30px" },
  { label: "32", value: "32px" },
  { label: "36", value: "36px" },
  { label: "40", value: "40px" },
];

const legacyFontSizes = [
  { label: "14", value: "0.875rem" },
  { label: "16", value: "1rem" },
  { label: "20", value: "1.25rem" },
  { label: "24", value: "1.5rem" },
];

const Indent = Extension.create({
  name: "spiritAndLifeIndent",
  addGlobalAttributes() {
    return [{
      types: ["heading", "paragraph"],
      attributes: {
        indent: { default: 0, parseHTML: (element) => Number(element.getAttribute("data-indent") ?? 0), renderHTML: (attributes) => attributes.indent ? { "data-indent": attributes.indent } : {} },
      },
    }];
  },
});

function ToolbarButton({ active = false, disabled = false, label, onClick, children }: { active?: boolean; disabled?: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return <button
    aria-label={label}
    aria-pressed={active}
    className={`admin-rich-text-button${active ? " is-active" : ""}`}
    disabled={disabled}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    title={label}
    type="button"
    style={{
      background: active ? "var(--accent)" : "transparent",
      color: active ? "var(--on-accent)" : "var(--foreground)",
      borderColor: active ? "var(--accent)" : "var(--line)",
      boxShadow: active ? "inset 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent)" : "none",
    }}
  >{children}</button>;
}

export function AdminRichTextEditor({ initialValue, onChange, labelledBy }: AdminRichTextEditorProps) {
  const [, forceUpdate] = useState(0);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: false, linkOnPaste: true, protocols: ["http", "https", "mailto"] } }),
      TextAlign.configure({ types: ["heading", "paragraph"], alignments: [...textAlignments], defaultAlignment: "left" }),
      TextStyleKit,
      Indent,
    ],
    content: initialValue.content,
    editorProps: {
      attributes: {
        class: "admin-rich-text-surface",
        role: "textbox",
        "aria-multiline": "true",
        spellCheck: "true",
        style: "background: var(--surface); color: var(--foreground); caret-color: var(--foreground); padding: clamp(1.25rem, 3vw, 3rem) clamp(1rem, 5vw, 3rem); min-height: 38rem; width: 100%; max-width: 62rem; box-sizing: border-box; margin: 0 auto;",
        ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
      },
    },
    onUpdate: ({ editor: instance }) => onChange({ format: "spirit-and-life-rich-text", version: 1, content: instance.getJSON() as RichTextDocument["content"] }),
  });

  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate((value) => value + 1);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    editor.on("focus", update);
    editor.on("blur", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      editor.off("focus", update);
      editor.off("blur", update);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(initialValue.content);
    if (current !== next) editor.commands.setContent(initialValue.content, { emitUpdate: false });
  }, [editor, initialValue]);

  if (!editor) return <div className="admin-rich-text-loading">Loading editor…</div>;

  const hasTextSelection = !editor.state.selection.empty;
  const activeMark = (name: string, attributes?: Record<string, unknown>) => hasTextSelection && editor.isActive(name, attributes);
  const activeNode = (name: string, attributes?: Record<string, unknown>) => hasTextSelection && editor.isActive(name, attributes);
  const activeAlignment = (alignment: (typeof textAlignments)[number]) => alignment !== "left" && editor.isActive({ textAlign: alignment });
  const inList = editor.isActive("bulletList") || editor.isActive("orderedList");
  const currentIndent = Number(editor.getAttributes(editor.isActive("heading") ? "heading" : "paragraph").indent ?? 0);
  const updateIndent = (amount: number) => {
    if (inList) {
      const chain = editor.chain().focus();
      if (amount > 0) chain.sinkListItem("listItem").run(); else chain.liftListItem("listItem").run();
      return;
    }
    const node = editor.isActive("heading") ? "heading" : "paragraph";
    editor.chain().focus().updateAttributes(node, { indent: Math.max(0, Math.min(4, currentIndent + amount)) }).run();
  };
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", previous ?? "");
    if (href === null) return;
    if (!href.trim()) { editor.chain().focus().unsetLink().run(); return; }
    if (!(/^(https?:|mailto:)/i.test(href.trim()) || (/^\/(?!\/)/).test(href.trim()))) { window.alert("Use an http(s), mailto, or site-relative link."); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };
  const currentFontSize = editor.getAttributes("textStyle").fontSize as string | undefined;
  const currentFontSizeLabel = currentFontSize ? (legacyFontSizes.find((option) => option.value === currentFontSize)?.label ?? currentFontSize.replace("px", "")) : "";
  const rulerMarks = ["0", "4", "8", "12", "16", "20", "24", "28", "32", "36", "40"];

  return <div className="admin-rich-text-editor">
    <div className="admin-rich-text-toolbar" role="toolbar" aria-label="Rich text formatting">
      <div className="admin-rich-text-group"><ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><RotateCcw size={16} /></ToolbarButton><ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group"><ToolbarButton label="Bold" active={activeMark("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarButton><ToolbarButton label="Italic" active={activeMark("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarButton><ToolbarButton label="Underline" active={activeMark("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group"><label className="sr-only" htmlFor="rich-text-font-family">Font family</label><select id="rich-text-font-family" aria-label="Font family" value={editor.getAttributes("textStyle").fontFamily ?? ""} onChange={(event) => event.target.value ? editor.chain().focus().setFontFamily(event.target.value).run() : editor.chain().focus().unsetFontFamily().run()}><option value="">Site default</option><option value={fontFamilies[0]}>Serif</option><option value={fontFamilies[1]}>Sans serif</option><option value={fontFamilies[2]}>Georgia</option></select><label className="sr-only" htmlFor="rich-text-font-size">Font size</label><select id="rich-text-font-size" aria-label="Font size" value={currentFontSize ?? ""} onChange={(event) => event.target.value ? editor.chain().focus().setFontSize(event.target.value).run() : editor.chain().focus().unsetFontSize().run()}><option value="">{currentFontSizeLabel || "Size"}</option>{legacyFontSizes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{numericFontSizes.filter((option) => !legacyFontSizes.some((legacy) => legacy.label === option.label)).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
      <div className="admin-rich-text-group"><ToolbarButton label="Paragraph" active={false} onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow size={16} /></ToolbarButton><ToolbarButton label="Section heading" active={activeNode("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group">{[["left", AlignLeft, "Align left"], ["center", AlignCenter, "Align center"], ["right", AlignRight, "Align right"], ["justify", AlignJustify, "Justify"]].map(([alignment, Icon, label]) => <ToolbarButton key={alignment as string} label={label as string} active={activeAlignment(alignment as (typeof textAlignments)[number])} onClick={() => editor.chain().focus().setTextAlign(alignment as "left" | "center" | "right" | "justify").run()}>{<Icon size={16} />}</ToolbarButton>)}</div>
      <div className="admin-rich-text-group"><ToolbarButton label="Bulleted list" active={activeMark("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarButton><ToolbarButton label="Numbered list" active={activeMark("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarButton><ToolbarButton label="Outdent" disabled={!inList && currentIndent <= 0} onClick={() => updateIndent(-1)}><IndentDecrease size={16} /></ToolbarButton><ToolbarButton label="Indent" disabled={!inList && currentIndent >= 4} onClick={() => updateIndent(1)}><IndentIncrease size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group"><ToolbarButton label="Add or edit link" active={activeMark("link")} onClick={setLink}><Link2 size={16} /></ToolbarButton></div>
    </div>
    <div className="admin-rich-text-ruler" aria-hidden="true" style={{ width: "100%", maxWidth: "62rem", margin: "0 auto", padding: "0 clamp(1rem, 5vw, 3rem)", boxSizing: "border-box", height: "1.6rem", display: "grid", gridTemplateColumns: "repeat(11, minmax(0, 1fr))", alignItems: "end", borderBottom: "1px solid var(--line)", background: "var(--surface-muted)", color: "var(--muted)", fontSize: "0.58rem", lineHeight: 1, userSelect: "none" }}>
      {rulerMarks.map((mark) => <span key={mark} style={{ position: "relative", height: "0.85rem", borderLeft: "1px solid color-mix(in srgb, var(--muted) 55%, transparent)", paddingLeft: "0.18rem" }}>{mark}</span>)}
    </div>
    <EditorContent editor={editor} />
  </div>;
}
