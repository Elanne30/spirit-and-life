"use client";

import { useState } from "react";
import { AdminRichTextEditor } from "@/app/admin/(protected)/content/admin-rich-text-editor";
import { legacySectionsToRichText, normalizeRichTextDocument, richTextToLegacySections, type LegacySection, type RichTextDocument } from "@/app/content/article-rich-text";

export type ReflectionSection = LegacySection;

type ReflectionBodyEditorProps = {
  name?: string;
  initialSections?: ReflectionSection[];
  initialRichText?: unknown;
};

// Retained as the form-facing compatibility boundary for existing Reflection and
// Journal call sites. It reads legacy sections, exposes the new reusable editor,
// and submits both the rich document and a plain-text legacy projection.
export function ReflectionBodyEditor({ name = "sections", initialSections, initialRichText }: ReflectionBodyEditorProps) {
  const [document, setDocument] = useState<RichTextDocument>(() => normalizeRichTextDocument(initialRichText) ?? legacySectionsToRichText(initialSections));
  const sections = richTextToLegacySections(document);

  return <div className="admin-stack">
    <p className="admin-form-label" id="reflection-body-label">Body</p>
    <AdminRichTextEditor initialValue={document} onChange={setDocument} labelledBy="reflection-body-label" />
    <input name={name} type="hidden" value={JSON.stringify(sections)} />
    <input name="richText" type="hidden" value={JSON.stringify(document)} />
  </div>;
}
