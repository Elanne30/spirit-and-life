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
        style: "background: var(--surface); color: var(--foreground); caret-color: var(--foreground); padding: 2.25rem 3rem; min-height: 38rem; max-width: 100%; margin: 0 auto;",
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

  return <div className="admin-rich-text-editor">
    <div className="admin-rich-text-toolbar" role="toolbar" aria-label="Rich text formatting">
      <div className="admin-rich-text-group"><ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><RotateCcw size={16} /></ToolbarButton><ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group"><ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarButton><ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarButton><ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group"><label className="sr-only" htmlFor="rich-text-font-family">Font family</label><select id="rich-text-font-family" aria-label="Font family" value={editor.getAttributes("textStyle").fontFamily ?? ""} onChange={(event) => event.target.value ? editor.chain().focus().setFontFamily(event.target.value).run() : editor.chain().focus().unsetFontFamily().run()}><option value="">Site default</option><option value={fontFamilies[0]}>Serif</option><option value={fontFamilies[1]}>Sans serif</option><option value={fontFamilies[2]}>Georgia</option></select><label className="sr-only" htmlFor="rich-text-font-size">Font size</label><select id="rich-text-font-size" aria-label="Font size" value={editor.getAttributes("textStyle").fontSize ?? ""} onChange={(event) => event.target.value ? editor.chain().focus().setFontSize(event.target.value).run() : editor.chain().focus().unsetFontSize().run()}><option value="">Size</option><option value={fontSizes[0]}>Small</option><option value={fontSizes[1]}>Normal</option><option value={fontSizes[2]}>Large</option><option value={fontSizes[3]}>Extra large</option></select></div>
      <div className="admin-rich-text-group"><ToolbarButton label="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow size={16} /></ToolbarButton><ToolbarButton label="Section heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group">{[["left", AlignLeft, "Align left"], ["center", AlignCenter, "Align center"], ["right", AlignRight, "Align right"], ["justify", AlignJustify, "Justify"]].map(([alignment, Icon, label]) => <ToolbarButton key={alignment as string} label={label as string} active={editor.isActive({ textAlign: alignment })} onClick={() => editor.chain().focus().setTextAlign(alignment as "left" | "center" | "right" | "justify").run()}>{<Icon size={16} />}</ToolbarButton>)}</div>
      <div className="admin-rich-text-group"><ToolbarButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarButton><ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarButton><ToolbarButton label="Outdent" disabled={!inList && currentIndent <= 0} onClick={() => updateIndent(-1)}><IndentDecrease size={16} /></ToolbarButton><ToolbarButton label="Indent" disabled={!inList && currentIndent >= 4} onClick={() => updateIndent(1)}><IndentIncrease size={16} /></ToolbarButton></div>
      <div className="admin-rich-text-group"><ToolbarButton label="Add or edit link" active={editor.isActive("link")} onClick={setLink}><Link2 size={16} /></ToolbarButton></div>
    </div>
    <EditorContent editor={editor} />
  </div>;
}
