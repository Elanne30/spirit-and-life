"use client";

import { useActionState, useState } from "react";
import { createArticleAction, updateArticleAction, type ArticleActionState } from "@/app/admin/(protected)/actions/article-content";
import { uploadContentImageAction, type ContentDraftActionState } from "@/app/admin/(protected)/actions/content";
import { AdminRichTextEditor } from "@/app/admin/(protected)/content/admin-rich-text-editor";
import { legacySectionsToRichText, normalizeRichTextDocument, richTextToLegacySections, type RichTextDocument } from "@/app/content/article-rich-text";
import { TOPICS } from "@/app/lib/content-taxonomy";
import type { ArticleDraft } from "@/app/lib/content-drafts";

const initialState: ArticleActionState = { status: "idle", message: "" };
const uploadInitialState: ContentDraftActionState = { status: "idle", message: "" };
type Props = { draft?: ArticleDraft };
function makeSlug(value: string) { return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120); }
function bodyString(draft: ArticleDraft | undefined, key: string) { const value = draft?.body[key]; return typeof value === "string" ? value : ""; }
function bodyList(draft: ArticleDraft | undefined, key: string) { const value = draft?.body[key]; return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").join(", ") : ""; }

export function ArticleForm({ draft }: Props) {
  const action = draft ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [uploadState, uploadAction, uploading] = useActionState(uploadContentImageAction, uploadInitialState);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [slug, setSlug] = useState(draft?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(draft));
  const [document, setDocument] = useState<RichTextDocument>(() => normalizeRichTextDocument(draft?.body.richText) ?? legacySectionsToRichText(Array.isArray(draft?.body.sections) ? draft.body.sections : []));
  const [imagePreview, setImagePreview] = useState(draft?.image_reference ?? bodyString(draft, "image"));
  const sections = richTextToLegacySections(document);

  return <>
    {draft ? <section className="admin-article-image-panel" aria-labelledby="article-image-heading"><div><p className="admin-form-label" id="article-image-heading">Article image</p><p className="form-note">Upload an image to use on the Article card and at the top of the published Article. JPG, PNG, WebP, or GIF up to 8 MB.</p></div>{imagePreview ? <img className="admin-article-image-preview" src={imagePreview} alt="Current Article image" /> : <div className="admin-article-image-empty">No Article image selected yet.</div>}<form action={uploadAction} className="admin-article-image-upload"><input type="hidden" name="draftId" value={draft.id} /><label className="button button-secondary" htmlFor="article-image-upload">{imagePreview ? "Change image" : "Choose image"}</label><input id="article-image-upload" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) setImagePreview(URL.createObjectURL(file)); }} /><button className="button button-primary" type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload and save image"}</button></form>{uploadState.message ? <p className={uploadState.status === "error" ? "form-error" : "form-note"} role="status">{uploadState.message}</p> : null}</section> : null}
    <form action={formAction} className="admin-form">
      {draft ? <input type="hidden" name="draftId" value={draft.id} /> : null}
      <label htmlFor="article-title">Title</label><input id="article-title" name="title" value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!slugEdited) setSlug(makeSlug(value)); }} required />
      <label htmlFor="article-slug">Slug</label><input id="article-slug" name="slug" value={slug} onChange={(event) => { setSlugEdited(true); setSlug(makeSlug(event.target.value)); }} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} />
      <p className="form-note">The slug follows the title until you edit it yourself.</p>
      <label htmlFor="article-category">Category</label><select id="article-category" name="category" defaultValue={draft?.category ?? "Philosophy"}><option>Philosophy</option><option>Apologetics</option><option>Biblical Studies</option><option>Theology</option><option>Christian Living</option><option>Faith &amp; Life</option><option>Church History</option></select>
      <div className="admin-form-grid"><div><label htmlFor="article-date">Date</label><input id="article-date" name="date" defaultValue={typeof draft?.body.date === "string" ? draft.body.date : ""} placeholder="August 18, 2026" /></div><div><label htmlFor="article-reading-time">Reading time</label><input id="article-reading-time" name="readingTime" defaultValue={typeof draft?.body.readingTime === "string" ? draft.body.readingTime : ""} placeholder="6 min read" /></div></div>
      <label htmlFor="article-topics">Topics</label><select id="article-topics" name="topics" multiple defaultValue={Array.isArray(draft?.body.topics) ? draft.body.topics.filter((value): value is string => typeof value === "string") : []}>{TOPICS.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.name}</option>)}</select><p className="form-note">Hold Ctrl/Cmd to select more than one topic.</p>
      <label htmlFor="article-series">Series</label><input id="article-series" name="series" defaultValue={bodyString(draft, "series")} placeholder="problem-of-evil" /><p className="form-note">Optional series slug. Series management will be added as the Series library is built.</p>
      <label htmlFor="article-introduction">Introduction</label><textarea id="article-introduction" name="introduction" rows={5} defaultValue={draft?.introduction ?? ""} />
      <label htmlFor="article-image">Article image reference</label><input id="article-image" name="imageReference" defaultValue={draft?.image_reference ?? bodyString(draft, "image")} placeholder="/images/articles/my-article.jpg or https://..." />
      <label htmlFor="article-scripture">Scripture reference</label><input id="article-scripture" name="scripture" defaultValue={bodyString(draft, "scripture")} placeholder="Romans 8:28" />
      <label htmlFor="article-tags">Tags</label><input id="article-tags" name="tags" defaultValue={draft?.tags.join(", ") ?? ""} placeholder="Faith, Philosophy, Apologetics" />
      <fieldset className="admin-form-section"><legend>Related material</legend><p className="form-note">Use content slugs, separated by commas. These connections appear at the end of the article.</p><label htmlFor="article-related-reflections">Related reflection slugs</label><input id="article-related-reflections" name="relatedReflectionSlugs" defaultValue={bodyList(draft, "relatedReflectionSlugs")} placeholder="reading-scripture-in-context-why-it-matters" /><label htmlFor="article-related-journals">Related journal slugs</label><input id="article-related-journals" name="relatedJournalSlugs" defaultValue={bodyList(draft, "relatedJournalSlugs")} placeholder="on-slowing-down-to-read" /><label htmlFor="article-related-books">Related book slugs</label><input id="article-related-books" name="relatedBookSlugs" defaultValue={bodyList(draft, "relatedBookSlugs")} placeholder="book-slug" /><label htmlFor="article-related-studies">Related Study Center dates</label><input id="article-related-studies" name="relatedStudyPlanDates" defaultValue={bodyList(draft, "relatedStudyPlanDates")} placeholder="2026-11-21, 2026-11-22" /></fieldset>
      <div className="admin-stack"><p className="admin-form-label" id="article-body-label">Article body</p><AdminRichTextEditor initialValue={document} onChange={setDocument} labelledBy="article-body-label" /><input name="sections" type="hidden" value={JSON.stringify(sections)} /><input name="richText" type="hidden" value={JSON.stringify(document)} /></div>
      <label className="admin-checkbox"><input name="featured" type="checkbox" value="yes" defaultChecked={draft?.body.featured === true} /> Feature this article</label>
      {!draft ? <input type="hidden" name="saveMode" value="draft" /> : null}<button className="button button-primary" type="submit" disabled={pending}>{pending ? "Saving..." : draft ? "Save Article" : "Save Article Draft"}</button>{state.message ? <p className={state.status === "error" ? "form-error" : "form-note"} role="status">{state.message}</p> : null}
    </form>
  </>;
}