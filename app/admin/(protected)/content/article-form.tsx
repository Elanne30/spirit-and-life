"use client";

import { useActionState, useState } from "react";
import { createArticleAction, updateArticleAction, type ArticleActionState } from "@/app/admin/(protected)/actions/article-content";
import { AdminRichTextEditor } from "@/app/admin/(protected)/content/admin-rich-text-editor";
import { legacySectionsToRichText, normalizeRichTextDocument, richTextToLegacySections, type RichTextDocument } from "@/app/content/article-rich-text";
import type { ArticleDraft } from "@/app/lib/content-drafts";

const initialState: ArticleActionState = { status: "idle", message: "" };
type Props = { draft?: ArticleDraft };
function makeSlug(value: string) { return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120); }

export function ArticleForm({ draft }: Props) {
  const action = draft ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [slug, setSlug] = useState(draft?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(draft));
  const [document, setDocument] = useState<RichTextDocument>(() => normalizeRichTextDocument(draft?.body.richText) ?? legacySectionsToRichText(Array.isArray(draft?.body.sections) ? draft.body.sections : []));
  const sections = richTextToLegacySections(document);

  return <form action={formAction} className="admin-form">
    {draft ? <input type="hidden" name="draftId" value={draft.id} /> : null}
    <label htmlFor="article-title">Title</label>
    <input id="article-title" name="title" value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!slugEdited) setSlug(makeSlug(value)); }} required />
    <label htmlFor="article-slug">Slug</label>
    <input id="article-slug" name="slug" value={slug} onChange={(event) => { setSlugEdited(true); setSlug(makeSlug(event.target.value)); }} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} />
    <p className="form-note">The slug follows the title until you edit it yourself.</p>
    <label htmlFor="article-category">Category</label>
    <select id="article-category" name="category" defaultValue={draft?.category ?? "Philosophy"}><option>Philosophy</option><option>Apologetics</option><option>Biblical Studies</option><option>Theology</option><option>Christian Living</option><option>Faith &amp; Life</option><option>Church History</option></select>
    <div className="admin-form-grid"><div><label htmlFor="article-date">Date</label><input id="article-date" name="date" defaultValue={typeof draft?.body.date === "string" ? draft.body.date : ""} placeholder="August 18, 2026" /></div><div><label htmlFor="article-reading-time">Reading time</label><input id="article-reading-time" name="readingTime" defaultValue={typeof draft?.body.readingTime === "string" ? draft.body.readingTime : ""} placeholder="6 min read" /></div></div>
    <label htmlFor="article-introduction">Introduction</label><textarea id="article-introduction" name="introduction" rows={5} defaultValue={draft?.introduction ?? ""} />
    <label htmlFor="article-tags">Tags</label><input id="article-tags" name="tags" defaultValue={draft?.tags.join(", ") ?? ""} placeholder="Faith, Philosophy, Apologetics" />
    <div className="admin-stack"><p className="admin-form-label" id="article-body-label">Article body</p><AdminRichTextEditor initialValue={document} onChange={setDocument} labelledBy="article-body-label" /><input name="sections" type="hidden" value={JSON.stringify(sections)} /><input name="richText" type="hidden" value={JSON.stringify(document)} /></div>
    <label className="admin-checkbox"><input name="featured" type="checkbox" value="yes" defaultChecked={draft?.body.featured === true} /> Feature this article</label>
    {!draft ? <input type="hidden" name="saveMode" value="draft" /> : null}
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Saving..." : draft ? "Save Article" : "Save Article Draft"}</button>
    {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"} role="status">{state.message}</p> : null}
  </form>;
}
