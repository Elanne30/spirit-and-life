"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Extension, Mark } from "@tiptap/core";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ChevronDown,
  IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Minus,
  Pilcrow, Plus, Redo2, RotateCcw, Underline,
} from "lucide-react";
import { fontFamilies, fontSizes, type RichTextDocument, textAlignments, type TextAlignment } from "@/app/content/article-rich-text";
import styles from "./admin-rich-text-editor.module.css";

type AdminRichTextEditorProps = { initialValue: RichTextDocument; onChange: (document: RichTextDocument) => void; labelledBy?: string };
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type MenuName = "heading" | "paragraph" | "spacing" | null;

const PAGE_WIDTH_IN = 8.6;
const PAGE_HEIGHT_IN = 11;
const DEFAULT_MARGIN_IN = 1;
const INDENT_STEP_IN = 0.25;
const MAX_INDENT = 8;
const ZOOM_MIN = 75;
const ZOOM_MAX = 150;
const MIXED_VALUE = "__mixed__";

const numericFontSizes = Array.from({ length: 39 }, (_, index) => ({ label: String(index + 2), value: `${index + 2}px` }));
const headingOptions: Array<{ label: string; value: HeadingLevel | "paragraph" }> = [
  { label: "Normal", value: "paragraph" }, { label: "Heading 1", value: 1 }, { label: "Heading 2", value: 2 },
  { label: "Heading 3", value: 3 }, { label: "Heading 4", value: 4 }, { label: "Heading 5", value: 5 },
  { label: "Heading 6", value: 6 }, { label: "Paragraph", value: "paragraph" },
];
const spacingOptions = [{ label: "Single", value: 1 }, { label: "1.15", value: 1.15 }, { label: "1.5", value: 1.5 }, { label: "Double", value: 2 }];

const UnderlineMark = Mark.create({ name: "underline", parseHTML() { return [{ tag: "u" }, { style: "text-decoration=underline" }]; }, renderHTML() { return ["u", 0]; } });
const DocumentLayout = Extension.create({
  name: "spiritAndLifeDocumentLayout",
  addGlobalAttributes() { return [{ types: ["heading", "paragraph"], attributes: {
    indent: { default: 0, parseHTML: (element) => Number(element.getAttribute("data-indent") ?? 0), renderHTML: (attrs) => Number(attrs.indent) ? { "data-indent": Number(attrs.indent) } : {} },
    firstLineIndent: { default: 0, parseHTML: (element) => Number(element.getAttribute("data-first-line-indent") ?? 0), renderHTML: (attrs) => Number(attrs.firstLineIndent) ? { "data-first-line-indent": Number(attrs.firstLineIndent) } : {} },
    rightIndent: { default: 0, parseHTML: (element) => Number(element.getAttribute("data-right-indent") ?? 0), renderHTML: (attrs) => Number(attrs.rightIndent) ? { "data-right-indent": Number(attrs.rightIndent) } : {} },
    lineSpacing: { default: 1, parseHTML: (element) => Number(element.getAttribute("data-line-spacing") ?? 1), renderHTML: (attrs) => Number(attrs.lineSpacing) !== 1 ? { "data-line-spacing": Number(attrs.lineSpacing) } : {} },
  } }]; },
});

function ToolbarButton({ active = false, disabled = false, label, onClick, children }: { active?: boolean; disabled?: boolean; label: string; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-label={label} aria-pressed={active} title={label} disabled={disabled} className={`${styles.toolbarButton}${active ? ` ${styles.active}` : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={onClick}>{children}</button>;
}
function ToolbarGroup({ children }: { children: ReactNode }) { return <div className={styles.toolbarGroup}>{children}</div>; }

function Menu({ name, label, value, open, onToggle, children }: { name: string; label: string; value: ReactNode; open: boolean; onToggle: () => void; children: ReactNode }) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ left: 6, top: 6 });
  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect(); if (!rect) return;
      const viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
      const menuWidth = Math.min(205, Math.max(120, viewportWidth - 12)), menuHeight = Math.min(420, Math.max(140, viewportHeight - 16));
      const left = Math.max(6, Math.min(rect.left, viewportWidth - menuWidth - 6));
      const spaceBelow = viewportHeight - rect.bottom - 6;
      const top = spaceBelow >= 180 ? Math.min(rect.bottom + 5, viewportHeight - menuHeight - 6) : Math.max(6, rect.top - menuHeight - 5);
      setPosition({ left, top });
    };
    updatePosition(); window.addEventListener("resize", updatePosition); window.visualViewport?.addEventListener("resize", updatePosition); window.visualViewport?.addEventListener("scroll", updatePosition); document.addEventListener("scroll", updatePosition, true);
    return () => { window.removeEventListener("resize", updatePosition); window.visualViewport?.removeEventListener("resize", updatePosition); window.visualViewport?.removeEventListener("scroll", updatePosition); document.removeEventListener("scroll", updatePosition, true); };
  }, [open]);
  return <div className={styles.dropdown} data-menu={name}>
    <button ref={triggerRef} type="button" className={styles.dropdownTrigger} aria-haspopup="menu" aria-expanded={open} title={label} onMouseDown={(event) => event.preventDefault()} onClick={onToggle}><span className={styles.dropdownValue}>{value}</span><ChevronDown size={14} /></button>
    {open && typeof document !== "undefined" ? createPortal(<div className={styles.dropdownMenu} data-portal-menu={name} role="menu" style={{ left: position.left, top: position.top }}>{children}</div>, document.body) : null}
  </div>;
}
function MenuItem({ active, label, onClick, children }: { active?: boolean; label: string; onClick: () => void; children?: ReactNode }) {
  return <button type="button" role="menuitem" aria-label={label} className={`${styles.dropdownItem}${active ? ` ${styles.dropdownItemActive}` : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={onClick}>{children ?? label}</button>;
}
function RulerHandle({ label, left, onMove, kind }: { label: string; left: number; onMove: (clientX: number) => void; kind: "first" | "body" | "right" }) {
  const dragging = useRef(false), styleName = `rulerHandle${kind.charAt(0).toUpperCase()}${kind.slice(1)}` as keyof typeof styles;
  return <button type="button" aria-label={label} title={label} className={`${styles.rulerHandle} ${styles[styleName]}`} style={{ left: `${left}px` }} onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); dragging.current = true; }} onPointerMove={(event) => { if (dragging.current) onMove(event.clientX); }} onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }} />;
}

export function AdminRichTextEditor({ initialValue, onChange, labelledBy }: AdminRichTextEditorProps) {
  const [, forceUpdate] = useState(0), [openMenu, setOpenMenu] = useState<MenuName>(null), [zoom, setZoom] = useState(100), [scrollLeft, setScrollLeft] = useState(0), [scrollTop, setScrollTop] = useState(0);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] }, link: { openOnClick: false, autolink: false, linkOnPaste: true, protocols: ["http", "https", "mailto"] } }), UnderlineMark, TextAlign.configure({ types: ["heading", "paragraph"], alignments: [...textAlignments], defaultAlignment: "left" }), TextStyleKit, DocumentLayout],
    content: initialValue.content,
    editorProps: { attributes: { class: styles.prose, role: "textbox", "aria-multiline": "true", spellCheck: "true", ...(labelledBy ? { "aria-labelledby": labelledBy } : {}) } },
    onUpdate: ({ editor: instance }) => onChange({ format: "spirit-and-life-rich-text", version: 1, content: instance.getJSON() as RichTextDocument["content"] }),
  });
  useEffect(() => { if (!editor) return; const update = () => forceUpdate((value) => value + 1); editor.on("selectionUpdate", update); editor.on("transaction", update); editor.on("focus", update); editor.on("blur", update); return () => { editor.off("selectionUpdate", update); editor.off("transaction", update); editor.off("focus", update); editor.off("blur", update); }; }, [editor]);
  useEffect(() => { if (!editor) return; const current = JSON.stringify(editor.getJSON()), next = JSON.stringify(initialValue.content); if (current !== next) editor.commands.setContent(initialValue.content, { emitUpdate: false }); }, [editor, initialValue]);
  useEffect(() => { if (!openMenu) return; const close = (event: MouseEvent) => { if (!(event.target instanceof Node)) return; const target = event.target as Element; if (!target.closest(`[data-menu="${openMenu}"]`) && !target.closest(`[data-portal-menu="${openMenu}"]`)) setOpenMenu(null); }; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenMenu(null); }; document.addEventListener("mousedown", close); document.addEventListener("keydown", onKey); return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", onKey); }; }, [openMenu]);
  if (!editor) return <div className={styles.loading}>Loading editor…</div>;

  const selection = editor.state.selection, hasSelection = !selection.empty, sameBlock = selection.$from.sameParent(selection.$to), blockType = editor.isActive("heading") ? "heading" : "paragraph";
  const attrs = editor.getAttributes(blockType) as { level?: number; indent?: number; firstLineIndent?: number; rightIndent?: number; lineSpacing?: number; textAlign?: string };
  const currentIndent = Math.max(0, Math.min(MAX_INDENT, Number(attrs.indent ?? 0))), currentFirstLineIndent = Math.max(0, Math.min(MAX_INDENT, Number(attrs.firstLineIndent ?? 0))), currentRightIndent = Math.max(0, Math.min(MAX_INDENT, Number(attrs.rightIndent ?? 0))), currentSpacing = Number(attrs.lineSpacing ?? 1);
  const currentAlignment: TextAlignment = textAlignments.includes(attrs.textAlign as TextAlignment) ? attrs.textAlign as TextAlignment : "left";
  const inBulletList = editor.isActive("bulletList"), inOrderedList = editor.isActive("orderedList");
  const currentHeading = hasSelection && !sameBlock ? "Mixed" : editor.isActive("heading") ? `Heading ${Number(attrs.level ?? 1)}` : "Normal";
  const textStyleAttrs = editor.getAttributes("textStyle") as { fontFamily?: string; fontSize?: string }, currentFontFamily = textStyleAttrs.fontFamily, currentFontSize = textStyleAttrs.fontSize;
  const currentFontFamilyValue = hasSelection && currentFontFamily === undefined ? MIXED_VALUE : currentFontFamily ?? "";
  const currentFontSizeValue = hasSelection && currentFontSize === undefined ? MIXED_VALUE : currentFontSize ?? "";
  const currentFontSizeLabel = currentFontSize?.replace("px", "") || (hasSelection ? "Mixed" : "11");
  const wordCount = editor.state.doc.textContent.trim().split(/\s+/).filter(Boolean).length;

  const setBlockAttribute = (name: string, value: number) => { editor.chain().focus().updateAttributes(blockType, { [name]: value }).run(); };
  const setHeading = (value: HeadingLevel | "paragraph") => { if (value === "paragraph") editor.chain().focus().setParagraph().run(); else editor.chain().focus().setHeading({ level: value }).run(); setOpenMenu(null); };
  const setSpacing = (value: number) => { setBlockAttribute("lineSpacing", value); setOpenMenu(null); };
  const setIndent = (delta: number) => { if (editor.isActive("bulletList") || editor.isActive("orderedList")) { const chain = editor.chain().focus(); if (delta > 0) chain.sinkListItem("listItem").run(); else chain.liftListItem("listItem").run(); return; } setBlockAttribute("indent", Math.max(0, Math.min(MAX_INDENT, currentIndent + delta))); };
  const setRulerIndent = (kind: "first" | "body" | "right", clientX: number) => { const ruler = document.getElementById("spirit-life-horizontal-ruler"); if (!ruler) return; const rect = ruler.getBoundingClientRect(); const inches = Math.max(0, Math.min(PAGE_WIDTH_IN, (clientX - rect.left + scrollLeft) / (96 * (zoom / 100)))); if (kind === "right") { setBlockAttribute("rightIndent", Math.max(0, Math.min(MAX_INDENT, Math.round((PAGE_WIDTH_IN - DEFAULT_MARGIN_IN - inches) / INDENT_STEP_IN)))); return; } setBlockAttribute(kind === "first" ? "firstLineIndent" : "indent", Math.max(0, Math.min(MAX_INDENT, Math.round((inches - DEFAULT_MARGIN_IN) / INDENT_STEP_IN)))); };
  const rulerLeft = (indent: number) => (DEFAULT_MARGIN_IN + indent * INDENT_STEP_IN) * 96 * (zoom / 100), rulerRight = (indent: number) => (PAGE_WIDTH_IN - DEFAULT_MARGIN_IN - indent * INDENT_STEP_IN) * 96 * (zoom / 100);
  const setLink = () => { const previous = editor.getAttributes("link").href as string | undefined, href = window.prompt("Link URL", previous ?? ""); if (href === null) return; if (!href.trim()) { editor.chain().focus().unsetLink().run(); return; } if (!(/^(https?:|mailto:)/i.test(href.trim()) || /^\/(?!\/)/.test(href.trim()))) { window.alert("Use an http(s), mailto, or site-relative link."); return; } editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run(); };
  const pageOuterWidth = PAGE_WIDTH_IN * 96 * (zoom / 100), pageOuterHeight = PAGE_HEIGHT_IN * 96 * (zoom / 100);
  const pageStyle = { transform: `scale(${zoom / 100})`, transformOrigin: "top left" } as CSSProperties;
  const rulerTrackStyle = { width: `${pageOuterWidth}px`, marginLeft: `max(24px, calc(50% - ${pageOuterWidth / 2}px))`, transform: `translateX(${-scrollLeft}px)` } as CSSProperties;

  return <div className={styles.editorShell}>
    <div className={styles.toolbar} role="toolbar" aria-label="Rich text formatting">
      <ToolbarGroup><ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><RotateCcw size={18} /></ToolbarButton><ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={18} /></ToolbarButton></ToolbarGroup>
      <ToolbarGroup><ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></ToolbarButton><ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></ToolbarButton><ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleMark("underline").run()}><Underline size={18} /></ToolbarButton></ToolbarGroup>
      <ToolbarGroup><label className={styles.srOnly} htmlFor="rich-text-font-family">Font family</label><select id="rich-text-font-family" aria-label="Font family" value={currentFontFamilyValue} onChange={(event) => event.target.value && event.target.value !== MIXED_VALUE ? editor.chain().focus().setFontFamily(event.target.value).run() : undefined} className={styles.select}><option value="">Calibri (Body)</option><option value={MIXED_VALUE} disabled>Mixed</option><option value={fontFamilies[0]}>Serif</option><option value={fontFamilies[1]}>Sans serif</option><option value={fontFamilies[2]}>Georgia</option></select><label className={styles.srOnly} htmlFor="rich-text-font-size">Font size</label><select id="rich-text-font-size" aria-label="Font size" value={currentFontSizeValue} onChange={(event) => event.target.value && event.target.value !== MIXED_VALUE ? editor.chain().focus().setFontSize(event.target.value).run() : undefined} className={`${styles.select} ${styles.sizeSelect}`}><option value="">11</option><option value={MIXED_VALUE} disabled>{currentFontSizeLabel === "Mixed" ? "Mixed" : "Size"}</option>{numericFontSizes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{fontSizes.filter((size) => !numericFontSizes.some((option) => option.value === size)).map((size) => <option key={size} value={size}>{size.replace("rem", "")}</option>)}</select></ToolbarGroup>
      <ToolbarGroup><Menu name="heading" label="Heading style" value={currentHeading} open={openMenu === "heading"} onToggle={() => setOpenMenu(openMenu === "heading" ? null : "heading")}>{headingOptions.map((option, index) => <MenuItem key={`${option.label}-${index}`} label={option.label} active={!hasSelection || sameBlock ? (option.value === "paragraph" ? !editor.isActive("heading") : editor.isActive("heading", { level: option.value })) : false} onClick={() => setHeading(option.value)}><span className={`${styles.headingOption} ${option.value === "paragraph" ? styles.paragraphOption : styles[`heading${option.value}`]}`}>{option.label}</span></MenuItem>)}</Menu></ToolbarGroup>
      <ToolbarGroup>{([["left", AlignLeft, "Align left"], ["center", AlignCenter, "Align center"], ["right", AlignRight, "Align right"], ["justify", AlignJustify, "Justify"]] as const).map(([alignment, Icon, label]) => <ToolbarButton key={alignment} label={label} active={currentAlignment === alignment} onClick={() => editor.chain().focus().setTextAlign(alignment).run()}><Icon size={18} /></ToolbarButton>)}</ToolbarGroup>
      <ToolbarGroup><ToolbarButton label="Bulleted list" active={inBulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></ToolbarButton><ToolbarButton label="Numbered list" active={inOrderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></ToolbarButton><ToolbarButton label="Decrease indent" disabled={!inBulletList && !inOrderedList && currentIndent === 0} active={currentIndent > 0} onClick={() => setIndent(-1)}><IndentDecrease size={18} /></ToolbarButton><ToolbarButton label="Increase indent" disabled={!inBulletList && !inOrderedList && currentIndent >= MAX_INDENT} active={currentIndent > 0} onClick={() => setIndent(1)}><IndentIncrease size={18} /></ToolbarButton></ToolbarGroup>
      <ToolbarGroup><Menu name="paragraph" label="Paragraph options" value={<Pilcrow size={18} />} open={openMenu === "paragraph"} onToggle={() => setOpenMenu(openMenu === "paragraph" ? null : "paragraph")}><MenuItem label="Decrease indent" onClick={() => { setIndent(-1); setOpenMenu(null); }} /><MenuItem label="Increase indent" onClick={() => { setIndent(1); setOpenMenu(null); }} /><MenuItem label="First-line indent" onClick={() => { setBlockAttribute("firstLineIndent", Math.min(MAX_INDENT, currentFirstLineIndent + 1)); setOpenMenu(null); }} /><MenuItem label="Right indent" onClick={() => { setBlockAttribute("rightIndent", Math.min(MAX_INDENT, currentRightIndent + 1)); setOpenMenu(null); }} /></Menu><Menu name="spacing" label="Line spacing" value={<span className={styles.spacingLabel}>↕</span>} open={openMenu === "spacing"} onToggle={() => setOpenMenu(openMenu === "spacing" ? null : "spacing")}>{spacingOptions.map((option) => <MenuItem key={option.label} label={`${option.label} line spacing`} active={!hasSelection || sameBlock ? currentSpacing === option.value : false} onClick={() => setSpacing(option.value)}>{option.label} line spacing</MenuItem>)}</Menu><ToolbarButton label="Add or edit link" active={editor.isActive("link")} onClick={setLink}><Link2 size={18} /></ToolbarButton></ToolbarGroup>
    </div>
    <div className={styles.rulerHeader} aria-hidden="true"><div className={styles.rulerHeaderViewport}><div className={styles.rulerHeaderTrack} style={rulerTrackStyle}><div id="spirit-life-horizontal-ruler" className={styles.horizontalRuler} style={{ width: `${pageOuterWidth}px` }}>{Array.from({ length: 19 }, (_, index) => <span key={index} className={styles.rulerNumber} style={{ left: `${index * 48 * (zoom / 100)}px` }}>{index / 2}</span>)}<span className={`${styles.marginZone} ${styles.marginZoneLeft}`} style={{ width: `${96 * (zoom / 100)}px` }} /><span className={`${styles.marginZone} ${styles.marginZoneRight}`} style={{ width: `${96 * (zoom / 100)}px` }} /><span className={styles.marginLabel} style={{ left: `${96 * (zoom / 100)}px` }}>1</span><span className={styles.marginLabel} style={{ left: `${7.6 * 96 * (zoom / 100)}px` }}>7.6</span><RulerHandle kind="first" label="First-line indent" left={rulerLeft(currentFirstLineIndent)} onMove={(clientX) => setRulerIndent("first", clientX)} /><RulerHandle kind="body" label="Left indent" left={rulerLeft(currentIndent)} onMove={(clientX) => setRulerIndent("body", clientX)} /><RulerHandle kind="right" label="Right indent" left={rulerRight(currentRightIndent)} onMove={(clientX) => setRulerIndent("right", clientX)} /></div></div></div></div>
    <div className={styles.workspace}><div className={styles.verticalRulerViewport} aria-hidden="true"><div className={styles.verticalRuler} style={{ height: `${pageOuterHeight}px`, transform: `translateY(${-scrollTop}px)` }}>{Array.from({ length: 23 }, (_, index) => <span key={index} className={styles.verticalRulerMark} style={{ top: `${index * 48 * (zoom / 100)}px` }}>{index / 2}</span>)}</div></div><div className={styles.pageViewport} onScroll={(event) => { setScrollLeft(event.currentTarget.scrollLeft); setScrollTop(event.currentTarget.scrollTop); }}><div className={styles.pageStage} style={{ width: `${pageOuterWidth + 48}px`, minHeight: `${pageOuterHeight + 48}px` }}><div className={styles.page} style={{ ...pageStyle, width: `${pageOuterWidth}px` }}><EditorContent editor={editor} /></div></div></div></div>
    <div className={styles.statusBar}><div className={styles.statusLeft}><span>{wordCount} words</span><span>English (United States)</span></div><div className={styles.zoomControl}><button type="button" aria-label="Zoom out" title="Zoom out" disabled={zoom <= ZOOM_MIN} onClick={() => setZoom((value) => Math.max(ZOOM_MIN, value - 5))}><Minus size={16} /></button><input aria-label="Zoom" type="range" min={ZOOM_MIN} max={ZOOM_MAX} step="5" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /><button type="button" aria-label="Zoom in" title="Zoom in" disabled={zoom >= ZOOM_MAX} onClick={() => setZoom((value) => Math.min(ZOOM_MAX, value + 5))}><Plus size={16} /></button><span>{zoom}%</span></div></div>
  </div>;
}
