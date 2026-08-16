"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Extension, Mark } from "@tiptap/core";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ChevronDown, IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Pilcrow, Redo2, RotateCcw, Underline } from "lucide-react";
import { fontFamilies, fontSizes, type RichTextDocument, textAlignments } from "@/app/content/article-rich-text";
import styles from "./admin-rich-text-editor.module.css";

type AdminRichTextEditorProps = { initialValue: RichTextDocument; onChange: (document: RichTextDocument) => void; labelledBy?: string };
const PAGE_WIDTH_IN = 8.5;
const DEFAULT_MARGIN_IN = 1;
const INDENT_STEP_IN = 0.25;
const MAX_INDENT = 8;
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
const numericFontSizes = Array.from({ length: 39 }, (_, index) => { const value = index + 2; return { label: String(value), value: `${value}px` }; });
const headingOptions = [
  { label: "Normal", value: "paragraph" as const },
  { label: "Heading 1", value: 1 as const },
  { label: "Heading 2", value: 2 as const },
  { label: "Heading 3", value: 3 as const },
  { label: "Heading 4", value: 4 as const },
  { label: "Heading 5", value: 5 as const },
  { label: "Heading 6", value: 6 as const },
  { label: "Paragraph", value: "paragraph" as const },
];

const UnderlineMark = Mark.create({
  name: "underline",
  parseHTML() { return [{ tag: "u" }, { style: "text-decoration=underline" }]; },
  renderHTML() { return ["u", 0]; },
});

const DocumentLayout = Extension.create({
  name: "spiritAndLifeDocumentLayout",
  addGlobalAttributes() {
    return [{
      types: ["heading", "paragraph"],
      attributes: {
        indent: { default: 0, parseHTML: (element) => Number(element.getAttribute("data-indent") ?? 0), renderHTML: (attributes) => { const value = Number(attributes.indent ?? 0); return value ? { "data-indent": value } : {}; } },
        firstLineIndent: { default: 0, parseHTML: (element) => Number(element.getAttribute("data-first-line-indent") ?? 0), renderHTML: (attributes) => { const value = Number(attributes.firstLineIndent ?? 0); return value ? { "data-first-line-indent": value } : {}; } },
        rightIndent: { default: 0, parseHTML: (element) => Number(element.getAttribute("data-right-indent") ?? 0), renderHTML: (attributes) => { const value = Number(attributes.rightIndent ?? 0); return value ? { "data-right-indent": value } : {}; } },
        lineSpacing: { default: 1, parseHTML: (element) => Number(element.getAttribute("data-line-spacing") ?? 1), renderHTML: (attributes) => { const value = Number(attributes.lineSpacing ?? 1); return value !== 1 ? { "data-line-spacing": value } : {}; } },
      },
    }];
  },
});

function ToolbarButton({ active = false, disabled = false, label, onClick, children }: { active?: boolean; disabled?: boolean; label: string; onClick: () => void; children: ReactNode }) {
  return <button aria-label={label} aria-pressed={active} className={`${styles.toolbarButton}${active ? ` ${styles.active}` : ""}`} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={onClick} title={label} type="button">{children}</button>;
}
function ToolbarGroup({ children }: { children: ReactNode }) { return <div className={styles.toolbarGroup}>{children}</div>; }
function Dropdown({ label, value, open, onToggle, children }: { label: string; value: ReactNode; open: boolean; onToggle: () => void; children: ReactNode }) {
  return <div className={styles.dropdown}>
    <button type="button" className={styles.dropdownTrigger} aria-haspopup="menu" aria-expanded={open} onMouseDown={(event) => event.preventDefault()} onClick={onToggle} title={label}>
      <span className={styles.dropdownValue}>{value || label}</span><ChevronDown size={14} />
    </button>
    {open ? <div className={styles.dropdownMenu} role="menu">{children}</div> : null}
  </div>;
}
function DropdownItem({ active, label, onClick, children }: { active?: boolean; label: string; onClick: () => void; children?: ReactNode }) {
  return <button type="button" role="menuitem" aria-label={label} className={`${styles.dropdownItem}${active ? ` ${styles.dropdownItemActive}` : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={onClick}>{children ?? label}</button>;
}
function RulerMarker({ type, left, label, onChange }: { type: "first" | "body" | "right"; left: number; label: string; onChange: (clientX: number) => void }) {
  const dragging = useRef(false);
  return <button type="button" aria-label={label} title={label} className={`${styles.rulerMarker} ${styles[`rulerMarker${type}`]}`} style={{ left: `${left}%` }}
    onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); dragging.current = true; }}
    onPointerMove={(event) => { if (dragging.current) onChange(event.clientX); }}
    onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }} />;
}

export function AdminRichTextEditor({ initialValue, onChange, labelledBy }: AdminRichTextEditorProps) {
  const [, forceUpdate] = useState(0);
  const [openMenu, setOpenMenu] = useState<"heading" | "paragraph" | null>(null);
  const [zoom, setZoom] = useState(100);
  const rulerRef = useRef<HTMLDivElement | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] }, link: { openOnClick: false, autolink: false, linkOnPaste: true, protocols: ["http", "https", "mailto"] } }),
      UnderlineMark,
      TextAlign.configure({ types: ["heading", "paragraph"], alignments: [...textAlignments], defaultAlignment: "left" }),
      TextStyleKit,
      DocumentLayout,
    ],
    content: initialValue.content,
    editorProps: { attributes: { class: styles.prose, role: "textbox", "aria-multiline": "true", spellCheck: "true", ...(labelledBy ? { "aria-labelledby": labelledBy } : {}) } },
    onUpdate: ({ editor: instance }) => onChange({ format: "spirit-and-life-rich-text", version: 1, content: instance.getJSON() as RichTextDocument["content"] }),
  });

  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate((value) => value + 1);
    editor.on("selectionUpdate", update); editor.on("transaction", update); editor.on("focus", update); editor.on("blur", update);
    return () => { editor.off("selectionUpdate", update); editor.off("transaction", update); editor.off("focus", update); editor.off("blur", update); };
  }, [editor]);
  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON()); const next = JSON.stringify(initialValue.content);
    if (current !== next) editor.commands.setContent(initialValue.content, { emitUpdate: false });
  }, [editor, initialValue]);
  useEffect(() => {
    if (!openMenu) return;
    const close = (event: MouseEvent) => { if (!(event.target instanceof HTMLElement) || !event.target.closest(`.${styles.dropdown}`)) setOpenMenu(null); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, [openMenu]);

  if (!editor) return <div className={styles.loading}>Loading editor…</div>;
  const blockType = editor.isActive("heading") ? "heading" : "paragraph";
  const blockAttrs = editor.getAttributes(blockType) as { level?: number; indent?: number; firstLineIndent?: number; rightIndent?: number; lineSpacing?: number };
  const currentHeadingLabel = editor.isActive("heading") ? `Heading ${Number(blockAttrs.level ?? 1)}` : "Normal";
  const currentIndent = Math.max(0, Math.min(MAX_INDENT, Number(blockAttrs.indent ?? 0)));
  const currentFirstLineIndent = Math.max(0, Math.min(MAX_INDENT, Number(blockAttrs.firstLineIndent ?? 0)));
  const currentRightIndent = Math.max(0, Math.min(MAX_INDENT, Number(blockAttrs.rightIndent ?? 0)));
  const currentLineSpacing = Number(blockAttrs.lineSpacing ?? 1);
  const inList = editor.isActive("bulletList") || editor.isActive("orderedList");
  const activeAlignment = (alignment: (typeof textAlignments)[number]) => alignment !== "left" && editor.isActive({ textAlign: alignment });
  const currentFontFamily = editor.getAttributes("textStyle").fontFamily as string | undefined;
  const currentFontSize = editor.getAttributes("textStyle").fontSize as string | undefined;
  const currentFontSizeLabel = currentFontSize?.replace("px", "") || "";
  const wordCount = editor.state.doc.textContent.trim().split(/\s+/).filter(Boolean).length;
  const setBlockAttribute = (name: string, value: number) => { editor.chain().focus().updateAttributes(blockType, { [name]: value }).run(); };
  const setHeading = (value: HeadingLevel | "paragraph") => { if (value === "paragraph") editor.chain().focus().setParagraph().run(); else editor.chain().focus().setHeading({ level: value }).run(); setOpenMenu(null); };
  const setRulerPosition = (kind: "first" | "body" | "right", clientX: number) => {
    const ruler = rulerRef.current; if (!ruler) return;
    const rect = ruler.getBoundingClientRect(); const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)); const inches = (percent / 100) * PAGE_WIDTH_IN;
    if (kind === "right") { setBlockAttribute("rightIndent", Math.round(Math.max(0, Math.min(MAX_INDENT, (PAGE_WIDTH_IN - DEFAULT_MARGIN_IN - inches) / INDENT_STEP_IN)))); return; }
    setBlockAttribute(kind === "first" ? "firstLineIndent" : "indent", Math.round(Math.max(0, Math.min(MAX_INDENT, (inches - DEFAULT_MARGIN_IN) / INDENT_STEP_IN))));
  };
  const rulerLeft = (indent: number) => ((DEFAULT_MARGIN_IN + indent * INDENT_STEP_IN) / PAGE_WIDTH_IN) * 100;
  const rulerRight = (indent: number) => ((PAGE_WIDTH_IN - DEFAULT_MARGIN_IN - indent * INDENT_STEP_IN) / PAGE_WIDTH_IN) * 100;
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined; const href = window.prompt("Link URL", previous ?? ""); if (href === null) return;
    if (!href.trim()) { editor.chain().focus().unsetLink().run(); return; }
    if (!(/^(https?:|mailto:)/i.test(href.trim()) || /^\/(?!\/)/.test(href.trim()))) { window.alert("Use an http(s), mailto, or site-relative link."); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };
  const documentZoomStyle = { zoom: `${zoom / 100}` } as CSSProperties;

  return <div className={styles.editorShell}>
    <div className={styles.toolbar} role="toolbar" aria-label="Rich text formatting">
      <ToolbarGroup><ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><RotateCcw size={18} /></ToolbarButton><ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={18} /></ToolbarButton></ToolbarGroup>
      <ToolbarGroup><ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></ToolbarButton><ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></ToolbarButton><ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleMark("underline").run()}><Underline size={18} /></ToolbarButton></ToolbarGroup>
      <ToolbarGroup>
        <label className={styles.srOnly} htmlFor="rich-text-font-family">Font family</label>
        <select id="rich-text-font-family" aria-label="Font family" value={currentFontFamily ?? ""} onChange={(event) => event.target.value ? editor.chain().focus().setFontFamily(event.target.value).run() : editor.chain().focus().unsetFontFamily().run()} className={styles.select}><option value="">Calibri (Body)</option><option value={fontFamilies[0]}>Serif</option><option value={fontFamilies[1]}>Sans serif</option><option value={fontFamilies[2]}>Georgia</option></select>
        <label className={styles.srOnly} htmlFor="rich-text-font-size">Font size</label>
        <select id="rich-text-font-size" aria-label="Font size" value={currentFontSize ?? ""} onChange={(event) => event.target.value ? editor.chain().focus().setFontSize(event.target.value).run() : editor.chain().focus().unsetFontSize().run()} className={`${styles.select} ${styles.sizeSelect}`}><option value="">{currentFontSizeLabel || "11"}</option>{numericFontSizes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{fontSizes.filter((size) => !numericFontSizes.some((option) => option.value === size)).map((size) => <option key={size} value={size}>{size.replace("rem", "")}</option>)}</select>
      </ToolbarGroup>
      <ToolbarGroup><Dropdown label="Style" value={currentHeadingLabel} open={openMenu === "heading"} onToggle={() => setOpenMenu(openMenu === "heading" ? null : "heading")}>
        {headingOptions.map((option, index) => <DropdownItem key={`${option.label}-${index}`} label={option.label} active={option.value === "paragraph" ? !editor.isActive("heading") : editor.isActive("heading", { level: option.value })} onClick={() => setHeading(option.value)}><span className={`${styles.headingOption} ${option.value === "paragraph" ? styles.paragraphOption : styles[`heading${option.value}`]}`}>{option.label}</span></DropdownItem>)}
      </Dropdown></ToolbarGroup>
      <ToolbarGroup>{[["left", AlignLeft, "Align left"], ["center", AlignCenter, "Align center"], ["right", AlignRight, "Align right"], ["justify", AlignJustify, "Justify"]].map(([alignment, Icon, label]) => <ToolbarButton key={alignment as string} label={label as string} active={activeAlignment(alignment as (typeof textAlignments)[number])} onClick={() => editor.chain().focus().setTextAlign(alignment as "left" | "center" | "right" | "justify").run()}><Icon size={18} /></ToolbarButton>)}</ToolbarGroup>
      <ToolbarGroup><ToolbarButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></ToolbarButton><ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></ToolbarButton><ToolbarButton label="Outdent" disabled={!inList && currentIndent <= 0} onClick={() => { if (inList) editor.chain().focus().liftListItem("listItem").run(); else setBlockAttribute("indent", Math.max(0, currentIndent - 1)); }}><IndentDecrease size={18} /></ToolbarButton><ToolbarButton label="Indent" disabled={!inList && currentIndent >= MAX_INDENT} onClick={() => { if (inList) editor.chain().focus().sinkListItem("listItem").run(); else setBlockAttribute("indent", Math.min(MAX_INDENT, currentIndent + 1)); }}><IndentIncrease size={18} /></ToolbarButton></ToolbarGroup>
      <ToolbarGroup><Dropdown label="Paragraph" value={<Pilcrow size={18} />} open={openMenu === "paragraph"} onToggle={() => setOpenMenu(openMenu === "paragraph" ? null : "paragraph")}>
        <DropdownItem label="Single line spacing" active={currentLineSpacing === 1} onClick={() => { setBlockAttribute("lineSpacing", 1); setOpenMenu(null); }}>Single line spacing</DropdownItem><DropdownItem label="1.15 line spacing" active={currentLineSpacing === 1.15} onClick={() => { setBlockAttribute("lineSpacing", 1.15); setOpenMenu(null); }}>1.15 line spacing</DropdownItem><DropdownItem label="1.5 line spacing" active={currentLineSpacing === 1.5} onClick={() => { setBlockAttribute("lineSpacing", 1.5); setOpenMenu(null); }}>1.5 line spacing</DropdownItem><DropdownItem label="Double line spacing" active={currentLineSpacing === 2} onClick={() => { setBlockAttribute("lineSpacing", 2); setOpenMenu(null); }}>Double line spacing</DropdownItem>
      </Dropdown></ToolbarGroup>
      <ToolbarGroup><ToolbarButton label="Add or edit link" active={editor.isActive("link")} onClick={setLink}><Link2 size={18} /></ToolbarButton></ToolbarGroup>
    </div>

    <div className={styles.workspace}><div className={styles.canvasRow}>
      <div className={styles.verticalRuler} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} className={styles.verticalRulerMark} style={{ top: `${(index / 11) * 100}%` }}>{index}</span>)}</div>
      <div className={styles.pageColumn}>
        <div ref={rulerRef} className={styles.horizontalRuler} aria-label="Document ruler">
          {Array.from({ length: 9 }, (_, index) => <span key={index} className={styles.rulerNumber} style={{ left: `${(index / PAGE_WIDTH_IN) * 100}%` }}>{index}</span>)}<span className={styles.rulerHalf} style={{ left: `${(8.5 / PAGE_WIDTH_IN) * 100}%` }}>8.5</span>
          <RulerMarker type="first" label="First line indent" left={rulerLeft(currentFirstLineIndent)} onChange={(clientX) => setRulerPosition("first", clientX)} /><RulerMarker type="body" label="Left indent" left={rulerLeft(currentIndent)} onChange={(clientX) => setRulerPosition("body", clientX)} /><RulerMarker type="right" label="Right indent" left={rulerRight(currentRightIndent)} onChange={(clientX) => setRulerPosition("right", clientX)} />
        </div>
        <div className={styles.pageScroller}><div className={styles.page} style={documentZoomStyle}><EditorContent editor={editor} /></div></div>
      </div>
    </div></div>

    <div className={styles.statusBar}><div className={styles.statusLeft}><span>{wordCount} words</span><span>English (United States)</span></div><div className={styles.zoomControl}><button type="button" aria-label="Zoom out" title="Zoom out" onClick={() => setZoom((value) => Math.max(75, value - 5))}>−</button><input aria-label="Zoom" type="range" min="75" max="150" step="5" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /><button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => setZoom((value) => Math.min(150, value + 5))}>+</button><span>{zoom}%</span></div></div>
  </div>;
}
